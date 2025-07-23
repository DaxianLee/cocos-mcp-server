"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationTools = void 0;
class ValidationTools {
    getTools() {
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
    async execute(toolName, args) {
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
    async validateJsonParams(jsonString, expectedSchema) {
        try {
            // First try to parse as-is
            let parsed;
            try {
                parsed = JSON.parse(jsonString);
            }
            catch (error) {
                // Try to fix common issues
                const fixed = this.fixJsonString(jsonString);
                try {
                    parsed = JSON.parse(fixed);
                }
                catch (secondError) {
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
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async createSafeStringValue(value) {
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
    async formatMcpRequest(toolName, toolArgs) {
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
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to format MCP request: ${error.message}`
            };
        }
    }
    fixJsonString(jsonStr) {
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
    escapJsonString(str) {
        return str
            .replace(/\\/g, '\\\\') // Escape backslashes first
            .replace(/"/g, '\\"') // Escape quotes
            .replace(/\n/g, '\\n') // Escape newlines
            .replace(/\r/g, '\\r') // Escape carriage returns
            .replace(/\t/g, '\\t') // Escape tabs
            .replace(/\f/g, '\\f') // Escape form feeds
            .replace(/\b/g, '\\b'); // Escape backspaces
    }
    validateAgainstSchema(data, schema) {
        const errors = [];
        const suggestions = [];
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
    getJsonFixSuggestions(jsonStr) {
        const suggestions = [];
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
    generateCurlCommand(jsonStr) {
        const escapedJson = jsonStr.replace(/'/g, "'\"'\"'");
        return `curl -X POST http://127.0.0.1:8585/mcp \\
  -H "Content-Type: application/json" \\
  -d '${escapedJson}'`;
    }
}
exports.ValidationTools = ValidationTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbi10b29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS90b29scy92YWxpZGF0aW9uLXRvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsZUFBZTtJQUN4QixRQUFRO1FBQ0osT0FBTztZQUNIO2dCQUNJLElBQUksRUFBRSxzQkFBc0I7Z0JBQzVCLFdBQVcsRUFBRSxnRUFBZ0U7Z0JBQzdFLFdBQVcsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsVUFBVSxFQUFFOzRCQUNSLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSxpQ0FBaUM7eUJBQ2pEO3dCQUNELGNBQWMsRUFBRTs0QkFDWixJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsc0NBQXNDO3lCQUN0RDtxQkFDSjtvQkFDRCxRQUFRLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQzNCO2FBQ0o7WUFDRDtnQkFDSSxJQUFJLEVBQUUsbUJBQW1CO2dCQUN6QixXQUFXLEVBQUUsa0VBQWtFO2dCQUMvRSxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLEtBQUssRUFBRTs0QkFDSCxJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsMkJBQTJCO3lCQUMzQztxQkFDSjtvQkFDRCxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUM7aUJBQ3RCO2FBQ0o7WUFDRDtnQkFDSSxJQUFJLEVBQUUsb0JBQW9CO2dCQUMxQixXQUFXLEVBQUUseURBQXlEO2dCQUN0RSxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLFFBQVEsRUFBRTs0QkFDTixJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsbUJBQW1CO3lCQUNuQzt3QkFDRCxTQUFTLEVBQUU7NEJBQ1AsSUFBSSxFQUFFLFFBQVE7NEJBQ2Qs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b29sUmVzcG9uc2UsIFRvb2xFeGVjdXRvciB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25Ub29scyBpbXBsZW1lbnRzIFRvb2xFeGVjdXRvciB7XG4gICAgZ2V0VG9vbHMoKTogVG9vbERlZmluaXRpb25bXSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3ZhbGlkYXRlX2pzb25fcGFyYW1zJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1ZhbGlkYXRlIGFuZCBmaXggSlNPTiBwYXJhbWV0ZXJzIGJlZm9yZSBzZW5kaW5nIHRvIG90aGVyIHRvb2xzJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAganNvblN0cmluZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSlNPTiBzdHJpbmcgdG8gdmFsaWRhdGUgYW5kIGZpeCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRXhwZWN0ZWQgcGFyYW1ldGVyIHNjaGVtYSAob3B0aW9uYWwpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydqc29uU3RyaW5nJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzYWZlX3N0cmluZ192YWx1ZScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDcmVhdGUgYSBzYWZlIHN0cmluZyB2YWx1ZSB0aGF0IHdvblxcJ3QgY2F1c2UgSlNPTiBwYXJzaW5nIGlzc3VlcycsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTdHJpbmcgdmFsdWUgdG8gbWFrZSBzYWZlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWyd2YWx1ZSddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnZm9ybWF0X21jcF9yZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Zvcm1hdCBhIGNvbXBsZXRlIE1DUCByZXF1ZXN0IHdpdGggcHJvcGVyIEpTT04gZXNjYXBpbmcnLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sTmFtZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVG9vbCBuYW1lIHRvIGNhbGwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUb29sIGFyZ3VtZW50cydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsndG9vbE5hbWUnLCAnYXJndW1lbnRzJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZSh0b29sTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBzd2l0Y2ggKHRvb2xOYW1lKSB7XG4gICAgICAgICAgICBjYXNlICd2YWxpZGF0ZV9qc29uX3BhcmFtcyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMudmFsaWRhdGVKc29uUGFyYW1zKGFyZ3MuanNvblN0cmluZywgYXJncy5leHBlY3RlZFNjaGVtYSk7XG4gICAgICAgICAgICBjYXNlICdzYWZlX3N0cmluZ192YWx1ZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY3JlYXRlU2FmZVN0cmluZ1ZhbHVlKGFyZ3MudmFsdWUpO1xuICAgICAgICAgICAgY2FzZSAnZm9ybWF0X21jcF9yZXF1ZXN0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5mb3JtYXRNY3BSZXF1ZXN0KGFyZ3MudG9vbE5hbWUsIGFyZ3MuYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHRvb2w6ICR7dG9vbE5hbWV9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHZhbGlkYXRlSnNvblBhcmFtcyhqc29uU3RyaW5nOiBzdHJpbmcsIGV4cGVjdGVkU2NoZW1hPzogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIEZpcnN0IHRyeSB0byBwYXJzZSBhcy1pc1xuICAgICAgICAgICAgbGV0IHBhcnNlZDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShqc29uU3RyaW5nKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgICAgICAgICAvLyBUcnkgdG8gZml4IGNvbW1vbiBpc3N1ZXNcbiAgICAgICAgICAgICAgICBjb25zdCBmaXhlZCA9IHRoaXMuZml4SnNvblN0cmluZyhqc29uU3RyaW5nKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKGZpeGVkKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChzZWNvbmRFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogYENhbm5vdCBmaXggSlNPTjogJHtlcnJvci5tZXNzYWdlfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxKc29uOiBqc29uU3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpeGVkQXR0ZW1wdDogZml4ZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnM6IHRoaXMuZ2V0SnNvbkZpeFN1Z2dlc3Rpb25zKGpzb25TdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBWYWxpZGF0ZSBhZ2FpbnN0IHNjaGVtYSBpZiBwcm92aWRlZFxuICAgICAgICAgICAgaWYgKGV4cGVjdGVkU2NoZW1hKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsaWRhdGlvbiA9IHRoaXMudmFsaWRhdGVBZ2FpbnN0U2NoZW1hKHBhcnNlZCwgZXhwZWN0ZWRTY2hlbWEpO1xuICAgICAgICAgICAgICAgIGlmICghdmFsaWRhdGlvbi52YWxpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ1NjaGVtYSB2YWxpZGF0aW9uIGZhaWxlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkSnNvbjogcGFyc2VkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb25FcnJvcnM6IHZhbGlkYXRpb24uZXJyb3JzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25zOiB2YWxpZGF0aW9uLnN1Z2dlc3Rpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWRKc29uOiBwYXJzZWQsXG4gICAgICAgICAgICAgICAgICAgIGZpeGVkSnNvbjogSlNPTi5zdHJpbmdpZnkocGFyc2VkLCBudWxsLCAyKSxcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLm1lc3NhZ2VcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNyZWF0ZVNhZmVTdHJpbmdWYWx1ZSh2YWx1ZTogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3Qgc2FmZVZhbHVlID0gdGhpcy5lc2NhcEpzb25TdHJpbmcodmFsdWUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBzYWZlVmFsdWU6IHNhZmVWYWx1ZSxcbiAgICAgICAgICAgICAgICBqc29uUmVhZHk6IEpTT04uc3RyaW5naWZ5KHNhZmVWYWx1ZSksXG4gICAgICAgICAgICAgICAgdXNhZ2U6IGBVc2UgXCIke3NhZmVWYWx1ZX1cIiBpbiB5b3VyIEpTT04gcGFyYW1ldGVyc2BcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGZvcm1hdE1jcFJlcXVlc3QodG9vbE5hbWU6IHN0cmluZywgdG9vbEFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBtY3BSZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgIGpzb25ycGM6ICcyLjAnLFxuICAgICAgICAgICAgICAgIGlkOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Rvb2xzL2NhbGwnLFxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0b29sTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzOiB0b29sQXJnc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZEpzb24gPSBKU09OLnN0cmluZ2lmeShtY3BSZXF1ZXN0LCBudWxsLCAyKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBhY3RKc29uID0gSlNPTi5zdHJpbmdpZnkobWNwUmVxdWVzdCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3Q6IG1jcFJlcXVlc3QsXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZEpzb246IGZvcm1hdHRlZEpzb24sXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhY3RKc29uOiBjb21wYWN0SnNvbixcbiAgICAgICAgICAgICAgICAgICAgY3VybENvbW1hbmQ6IHRoaXMuZ2VuZXJhdGVDdXJsQ29tbWFuZChjb21wYWN0SnNvbilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBgRmFpbGVkIHRvIGZvcm1hdCBNQ1AgcmVxdWVzdDogJHtlcnJvci5tZXNzYWdlfWBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZpeEpzb25TdHJpbmcoanNvblN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGZpeGVkID0ganNvblN0cjtcbiAgICAgICAgXG4gICAgICAgIC8vIEZpeCBjb21tb24gZXNjYXBlIGNoYXJhY3RlciBpc3N1ZXNcbiAgICAgICAgZml4ZWQgPSBmaXhlZFxuICAgICAgICAgICAgLy8gRml4IHVuZXNjYXBlZCBxdW90ZXMgaW4gc3RyaW5nIHZhbHVlc1xuICAgICAgICAgICAgLnJlcGxhY2UoLyhcXHtbXn1dKlwiW15cIl0qXCI6XFxzKlwiKShbXlwiXSpcIikoW15cIl0qXCIpKFtefV0qXFx9KS9nLCAobWF0Y2gsIHByZWZpeCwgY29udGVudCwgc3VmZml4LCBlbmQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlc2NhcGVkQ29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVmaXggKyBlc2NhcGVkQ29udGVudCArIHN1ZmZpeCArIGVuZDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvLyBGaXggdW5lc2NhcGVkIGJhY2tzbGFzaGVzXG4gICAgICAgICAgICAucmVwbGFjZSgvKFteXFxcXF0pXFxcXChbXlwiXFxcXFxcL2JmbnJ0dV0pL2csICckMVxcXFxcXFxcJDInKVxuICAgICAgICAgICAgLy8gRml4IHRyYWlsaW5nIGNvbW1hc1xuICAgICAgICAgICAgLnJlcGxhY2UoLywoXFxzKlt9XFxdXSkvZywgJyQxJylcbiAgICAgICAgICAgIC8vIEZpeCBjb250cm9sIGNoYXJhY3RlcnNcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHQvZywgJ1xcXFx0JylcbiAgICAgICAgICAgIC8vIEZpeCBzaW5nbGUgcXVvdGVzIHRvIGRvdWJsZSBxdW90ZXNcbiAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csICdcIicpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZpeGVkO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXNjYXBKc29uU3RyaW5nKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHN0clxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykgIC8vIEVzY2FwZSBiYWNrc2xhc2hlcyBmaXJzdFxuICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSAgICAvLyBFc2NhcGUgcXVvdGVzXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpICAgLy8gRXNjYXBlIG5ld2xpbmVzXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxyL2csICdcXFxccicpICAgLy8gRXNjYXBlIGNhcnJpYWdlIHJldHVybnNcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHQvZywgJ1xcXFx0JykgICAvLyBFc2NhcGUgdGFic1xuICAgICAgICAgICAgLnJlcGxhY2UoL1xcZi9nLCAnXFxcXGYnKSAgIC8vIEVzY2FwZSBmb3JtIGZlZWRzXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxiL2csICdcXFxcYicpOyAgLy8gRXNjYXBlIGJhY2tzcGFjZXNcbiAgICB9XG5cbiAgICBwcml2YXRlIHZhbGlkYXRlQWdhaW5zdFNjaGVtYShkYXRhOiBhbnksIHNjaGVtYTogYW55KTogeyB2YWxpZDogYm9vbGVhbjsgZXJyb3JzOiBzdHJpbmdbXTsgc3VnZ2VzdGlvbnM6IHN0cmluZ1tdIH0ge1xuICAgICAgICBjb25zdCBlcnJvcnM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25zOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIC8vIEJhc2ljIHR5cGUgY2hlY2tpbmdcbiAgICAgICAgaWYgKHNjaGVtYS50eXBlKSB7XG4gICAgICAgICAgICBjb25zdCBhY3R1YWxUeXBlID0gQXJyYXkuaXNBcnJheShkYXRhKSA/ICdhcnJheScgOiB0eXBlb2YgZGF0YTtcbiAgICAgICAgICAgIGlmIChhY3R1YWxUeXBlICE9PSBzY2hlbWEudHlwZSkge1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGBFeHBlY3RlZCB0eXBlICR7c2NoZW1hLnR5cGV9LCBnb3QgJHthY3R1YWxUeXBlfWApO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25zLnB1c2goYENvbnZlcnQgdmFsdWUgdG8gJHtzY2hlbWEudHlwZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlcXVpcmVkIGZpZWxkcyBjaGVja2luZ1xuICAgICAgICBpZiAoc2NoZW1hLnJlcXVpcmVkICYmIEFycmF5LmlzQXJyYXkoc2NoZW1hLnJlcXVpcmVkKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBzY2hlbWEucmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBmaWVsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goYE1pc3NpbmcgcmVxdWlyZWQgZmllbGQ6ICR7ZmllbGR9YCk7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25zLnB1c2goYEFkZCByZXF1aXJlZCBmaWVsZCBcIiR7ZmllbGR9XCJgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsaWQ6IGVycm9ycy5sZW5ndGggPT09IDAsXG4gICAgICAgICAgICBlcnJvcnMsXG4gICAgICAgICAgICBzdWdnZXN0aW9uc1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SnNvbkZpeFN1Z2dlc3Rpb25zKGpzb25TdHI6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbnM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIFxuICAgICAgICBpZiAoanNvblN0ci5pbmNsdWRlcygnXFxcXFwiJykpIHtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25zLnB1c2goJ0NoZWNrIGZvciBpbXByb3Blcmx5IGVzY2FwZWQgcXVvdGVzJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGpzb25TdHIuaW5jbHVkZXMoXCInXCIpKSB7XG4gICAgICAgICAgICBzdWdnZXN0aW9ucy5wdXNoKCdSZXBsYWNlIHNpbmdsZSBxdW90ZXMgd2l0aCBkb3VibGUgcXVvdGVzJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGpzb25TdHIuaW5jbHVkZXMoJ1xcbicpIHx8IGpzb25TdHIuaW5jbHVkZXMoJ1xcdCcpKSB7XG4gICAgICAgICAgICBzdWdnZXN0aW9ucy5wdXNoKCdFc2NhcGUgbmV3bGluZXMgYW5kIHRhYnMgcHJvcGVybHknKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoanNvblN0ci5tYXRjaCgvLFxccypbfVxcXV0vKSkge1xuICAgICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCgnUmVtb3ZlIHRyYWlsaW5nIGNvbW1hcycpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbnM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUN1cmxDb21tYW5kKGpzb25TdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGVzY2FwZWRKc29uID0ganNvblN0ci5yZXBsYWNlKC8nL2csIFwiJ1xcXCInXFxcIidcIik7XG4gICAgICAgIHJldHVybiBgY3VybCAtWCBQT1NUIGh0dHA6Ly8xMjcuMC4wLjE6ODU4NS9tY3AgXFxcXFxuICAtSCBcIkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblwiIFxcXFxcbiAgLWQgJyR7ZXNjYXBlZEpzb259J2A7XG4gICAgfVxufSJdfQ==