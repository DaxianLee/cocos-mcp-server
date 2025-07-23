import { ToolDefinition, ToolResponse, ToolExecutor } from '../types';

export class ValidationTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            {
                name: 'validate_json_params',
                description: 'Validate and fix JSON parameters before sending to other tools',
                inputSchema: {
                    type: 'object',
                    properties: {
                        jsonString: {
                            type: 'string',
                            description: 'JSON string to validate and fix'
                        },
                        expectedSchema: {
                            type: 'object',
                            description: 'Expected parameter schema (optional)'
                        }
                    },
                    required: ['jsonString']
                }
            },
            {
                name: 'safe_string_value',
                description: 'Create a safe string value that won\'t cause JSON parsing issues',
                inputSchema: {
                    type: 'object',
                    properties: {
                        value: {
                            type: 'string',
                            description: 'String value to make safe'
                        }
                    },
                    required: ['value']
                }
            },
            {
                name: 'format_mcp_request',
                description: 'Format a complete MCP request with proper JSON escaping',
                inputSchema: {
                    type: 'object',
                    properties: {
                        toolName: {
                            type: 'string',
                            description: 'Tool name to call'
                        },
                        arguments: {
                            type: 'object',
                            description: 'Tool arguments'
                        }
                    },
                    required: ['toolName', 'arguments']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'validate_json_params':
                return await this.validateJsonParams(args.jsonString, args.expectedSchema);
            case 'safe_string_value':
                return await this.createSafeStringValue(args.value);
            case 'format_mcp_request':
                return await this.formatMcpRequest(args.toolName, args.arguments);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async validateJsonParams(jsonString: string, expectedSchema?: any): Promise<ToolResponse> {
        try {
            // First try to parse as-is
            let parsed;
            try {
                parsed = JSON.parse(jsonString);
            } catch (error: any) {
                // Try to fix common issues
                const fixed = this.fixJsonString(jsonString);
                try {
                    parsed = JSON.parse(fixed);
                } catch (secondError) {
                    return {
                        success: false,
                        error: `Cannot fix JSON: ${error.message}`,
                        data: {
                            originalJson: jsonString,
                            fixedAttempt: fixed,
                            suggestions: this.getJsonFixSuggestions(jsonString)
                        }
                    };
                }
            }

            // Validate against schema if provided
            if (expectedSchema) {
                const validation = this.validateAgainstSchema(parsed, expectedSchema);
                if (!validation.valid) {
                    return {
                        success: false,
                        error: 'Schema validation failed',
                        data: {
                            parsedJson: parsed,
                            validationErrors: validation.errors,
                            suggestions: validation.suggestions
                        }
                    };
                }
            }

            return {
                success: true,
                data: {
                    parsedJson: parsed,
                    fixedJson: JSON.stringify(parsed, null, 2),
                    isValid: true
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    private async createSafeStringValue(value: string): Promise<ToolResponse> {
        const safeValue = this.escapJsonString(value);
        return {
            success: true,
            data: {
                originalValue: value,
                safeValue: safeValue,
                jsonReady: JSON.stringify(safeValue),
                usage: `Use "${safeValue}" in your JSON parameters`
            }
        };
    }

    private async formatMcpRequest(toolName: string, toolArgs: any): Promise<ToolResponse> {
        try {
            const mcpRequest = {
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'tools/call',
                params: {
                    name: toolName,
                    arguments: toolArgs
                }
            };

            const formattedJson = JSON.stringify(mcpRequest, null, 2);
            const compactJson = JSON.stringify(mcpRequest);

            return {
                success: true,
                data: {
                    request: mcpRequest,
                    formattedJson: formattedJson,
                    compactJson: compactJson,
                    curlCommand: this.generateCurlCommand(compactJson)
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Failed to format MCP request: ${error.message}`
            };
        }
    }

    private fixJsonString(jsonStr: string): string {
        let fixed = jsonStr;
        
        // Fix common escape character issues
        fixed = fixed
            // Fix unescaped quotes in string values
            .replace(/(\{[^}]*"[^"]*":\s*")([^"]*")([^"]*")([^}]*\})/g, (match, prefix, content, suffix, end) => {
                const escapedContent = content.replace(/"/g, '\\"');
                return prefix + escapedContent + suffix + end;
            })
            // Fix unescaped backslashes
            .replace(/([^\\])\\([^"\\\/bfnrtu])/g, '$1\\\\$2')
            // Fix trailing commas
            .replace(/,(\s*[}\]])/g, '$1')
            // Fix control characters
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
            // Fix single quotes to double quotes
            .replace(/'/g, '"');
        
        return fixed;
    }

    private escapJsonString(str: string): string {
        return str
            .replace(/\\/g, '\\\\')  // Escape backslashes first
            .replace(/"/g, '\\"')    // Escape quotes
            .replace(/\n/g, '\\n')   // Escape newlines
            .replace(/\r/g, '\\r')   // Escape carriage returns
            .replace(/\t/g, '\\t')   // Escape tabs
            .replace(/\f/g, '\\f')   // Escape form feeds
            .replace(/\b/g, '\\b');  // Escape backspaces
    }

    private validateAgainstSchema(data: any, schema: any): { valid: boolean; errors: string[]; suggestions: string[] } {
        const errors: string[] = [];
        const suggestions: string[] = [];

        // Basic type checking
        if (schema.type) {
            const actualType = Array.isArray(data) ? 'array' : typeof data;
            if (actualType !== schema.type) {
                errors.push(`Expected type ${schema.type}, got ${actualType}`);
                suggestions.push(`Convert value to ${schema.type}`);
            }
        }

        // Required fields checking
        if (schema.required && Array.isArray(schema.required)) {
            for (const field of schema.required) {
                if (!Object.prototype.hasOwnProperty.call(data, field)) {
                    errors.push(`Missing required field: ${field}`);
                    suggestions.push(`Add required field "${field}"`);
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            suggestions
        };
    }

    private getJsonFixSuggestions(jsonStr: string): string[] {
        const suggestions: string[] = [];
        
        if (jsonStr.includes('\\"')) {
            suggestions.push('Check for improperly escaped quotes');
        }
        if (jsonStr.includes("'")) {
            suggestions.push('Replace single quotes with double quotes');
        }
        if (jsonStr.includes('\n') || jsonStr.includes('\t')) {
            suggestions.push('Escape newlines and tabs properly');
        }
        if (jsonStr.match(/,\s*[}\]]/)) {
            suggestions.push('Remove trailing commas');
        }
        
        return suggestions;
    }

    private generateCurlCommand(jsonStr: string): string {
        const escapedJson = jsonStr.replace(/'/g, "'\"'\"'");
        return `curl -X POST http://127.0.0.1:8585/mcp \\
  -H "Content-Type: application/json" \\
  -d '${escapedJson}'`;
    }
}