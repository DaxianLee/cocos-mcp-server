import { ToolDefinition, ToolResponse, ToolExecutor } from '../types';
import { fixCommonJsonIssues } from '../utils/json-utils';
import { readSettings } from '../settings';

export class ValidationTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            {
                name: 'validate_json_params',
                description: 'JSON PARAMETER VALIDATION: Validate and auto-fix JSON strings before sending to other tools. USAGE: Paste malformed JSON and get corrected version. Handles common issues like unescaped quotes, trailing commas, missing brackets. Essential for ensuring tool parameters are properly formatted.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        jsonString: {
                            type: 'string',
                            description: 'JSON string to validate and repair (REQUIRED). Can be malformed - tool will attempt automatic fixes. Examples: missing quotes, trailing commas, unescaped characters. Paste your JSON here for validation and correction.'
                        },
                        expectedSchema: {
                            type: 'object',
                            description: 'Expected JSON structure for validation (optional). Provides schema-based validation beyond syntax checking. Useful for ensuring JSON matches specific tool requirements. Leave empty for syntax-only validation.'
                        }
                    },
                    required: ['jsonString']
                }
            },
            {
                name: 'safe_string_value',
                description: 'STRING SAFETY: Convert text into JSON-safe format by escaping special characters. USAGE: When you have strings with quotes, newlines, or special characters that break JSON. Automatically handles escaping and formatting for safe JSON inclusion.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        value: {
                            type: 'string',
                            description: 'Text to make JSON-safe (REQUIRED). Can contain quotes, newlines, special characters. Examples: file paths with backslashes, text with quotes, multi-line strings. Tool will escape all problematic characters.'
                        }
                    },
                    required: ['value']
                }
            },
            {
                name: 'format_mcp_request',
                description: 'MCP REQUEST FORMATTING: Generate properly formatted MCP tool call request with correct JSON structure. USAGE: Provide tool name and arguments, get back complete MCP request ready to send. Handles all JSON escaping and protocol formatting automatically.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        toolName: {
                            type: 'string',
                            description: 'Target MCP tool name (REQUIRED). Must be exact tool name from available tools. Examples: "node_query", "asset_manage", "scene_management". Case-sensitive exact match required.'
                        },
                        arguments: {
                            type: 'object',
                            description: 'Tool parameters object (REQUIRED). Must be valid JSON object containing all required parameters for the specified tool. Example: {"action": "info", "uuid": "node-uuid-here"}. Use tool documentation for required fields.'
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
                return { success: false, error: `Unknown validation tool: ${toolName}. Available tools: validate_json_params, safe_string_value, format_mcp_request` };
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
                const fixed = fixCommonJsonIssues(jsonString);
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
        const port = readSettings().port;
        return `curl -X POST http://127.0.0.1:${port}/mcp \\
  -H "Content-Type: application/json" \\
  -d '${escapedJson}'`;
    }
}