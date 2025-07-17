"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesTools = void 0;
class PreferencesTools {
    getTools() {
        return [
            {
                name: 'get_preferences',
                description: 'Get editor preferences',
                inputSchema: {
                    type: 'object',
                    properties: {
                        key: {
                            type: 'string',
                            description: 'Specific preference key to get (optional)'
                        }
                    }
                }
            },
            {
                name: 'set_preferences',
                description: 'Set editor preferences',
                inputSchema: {
                    type: 'object',
                    properties: {
                        key: {
                            type: 'string',
                            description: 'Preference key to set'
                        },
                        value: {
                            description: 'Preference value to set'
                        }
                    },
                    required: ['key', 'value']
                }
            },
            {
                name: 'get_global_preferences',
                description: 'Get global editor preferences',
                inputSchema: {
                    type: 'object',
                    properties: {
                        key: {
                            type: 'string',
                            description: 'Global preference key to get (optional)'
                        }
                    }
                }
            },
            {
                name: 'set_global_preferences',
                description: 'Set global editor preferences',
                inputSchema: {
                    type: 'object',
                    properties: {
                        key: {
                            type: 'string',
                            description: 'Global preference key to set'
                        },
                        value: {
                            description: 'Global preference value to set'
                        }
                    },
                    required: ['key', 'value']
                }
            },
            {
                name: 'get_recent_projects',
                description: 'Get recently opened projects',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'clear_recent_projects',
                description: 'Clear recently opened projects list',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            }
        ];
    }
    async execute(toolName, args) {
        switch (toolName) {
            case 'get_preferences':
                return await this.getPreferences(args.key);
            case 'set_preferences':
                return await this.setPreferences(args.key, args.value);
            case 'get_global_preferences':
                return await this.getGlobalPreferences(args.key);
            case 'set_global_preferences':
                return await this.setGlobalPreferences(args.key, args.value);
            case 'get_recent_projects':
                return await this.getRecentProjects();
            case 'clear_recent_projects':
                return await this.clearRecentProjects();
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
    async getPreferences(key) {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Preferences API is not supported through MCP',
                instruction: 'Please access preferences through the editor menu: Edit > Preferences or use the preferences panel in the editor'
            });
        });
    }
    async setPreferences(key, value) {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Preferences API is not supported through MCP',
                instruction: 'Please modify preferences through the editor menu: Edit > Preferences or use the preferences panel in the editor'
            });
        });
    }
    async getGlobalPreferences(key) {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Global preferences API is not supported through MCP',
                instruction: 'Please access global preferences through the editor menu: Edit > Preferences or use the preferences panel in the editor'
            });
        });
    }
    async setGlobalPreferences(key, value) {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Global preferences API is not supported through MCP',
                instruction: 'Please modify global preferences through the editor menu: Edit > Preferences or use the preferences panel in the editor'
            });
        });
    }
    async getRecentProjects() {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Recent projects API is not supported through MCP',
                instruction: 'Please check recent projects through the editor menu: File > Recent Projects or the start screen'
            });
        });
    }
    async clearRecentProjects() {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Recent projects API is not supported through MCP',
                instruction: 'Please clear recent projects through the editor menu: File > Recent Projects or the start screen'
            });
        });
    }
}
exports.PreferencesTools = PreferencesTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyZW5jZXMtdG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb3VyY2UvdG9vbHMvcHJlZmVyZW5jZXMtdG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSxnQkFBZ0I7SUFDekIsUUFBUTtRQUNKLE9BQU87WUFDSDtnQkFDSSxJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixXQUFXLEVBQUUsd0JBQXdCO2dCQUNyQyxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLEdBQUcsRUFBRTs0QkFDRCxJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsMkNBQTJDO3lCQUMzRDtxQkFDSjtpQkFDSjthQUNKO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLGlCQUFpQjtnQkFDdkIsV0FBVyxFQUFFLHdCQUF3QjtnQkFDckMsV0FBVyxFQUFFO29CQUNULElBQUksRUFBRSxRQUFRO29CQUNkLFVBQVUsRUFBRTt3QkFDUixHQUFHLEVBQUU7NEJBQ0QsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLHVCQUF1Qjt5QkFDdkM7d0JBQ0QsS0FBSyxFQUFFOzRCQUNILFdBQVcsRUFBRSx5QkFBeUI7eUJBQ3pDO3FCQUNKO29CQUNELFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7aUJBQzdCO2FBQ0o7WUFDRDtnQkFDSSxJQUFJLEVBQUUsd0JBQXdCO2dCQUM5QixXQUFXLEVBQUUsK0JBQStCO2dCQUM1QyxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLEdBQUcsRUFBRTs0QkFDRCxJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUseUNBQXlDO3lCQUN6RDtxQkFDSjtpQkFDSjthQUNKO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLHdCQUF3QjtnQkFDOUIsV0FBVyxFQUFFLCtCQUErQjtnQkFDNUMsV0FBVyxF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LE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzNCLE9BQU8sQ0FBQztnQkFDSixPQUFPLEVBQUUsS0FBSztnQkFDZCxLQUFLLEVBQUUscURBQXFEO2dCQUM1RCxXQUFXLEVBQUUseUhBQXlIO2FBQ3pJLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLEtBQUssQ0FBQyxpQkFBaUI7UUFDM0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzNCLE9BQU8sQ0FBQztnQkFDSixPQUFPLEVBQUUsS0FBSztnQkFDZCxLQUFLLEVBQUUsa0RBQWtEO2dCQUN6RCxXQUFXLEVBQUUsa0dBQWtHO2FBQ2xILENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLEtBQUssQ0FBQyxtQkFBbUI7UUFDN0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzNCLE9BQU8sQ0FBQztnQkFDSixPQUFPLEVBQUUsS0FBSztnQkFDZCxLQUFLLEVBQUUsa0RBQWtEO2dCQUN6RCxXQUFXLEVBQUUsa0dBQWtHO2FBQ2xILENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBaEtELDRDQWdLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRvb2xEZWZpbml0aW9uLCBUb29sUmVzcG9uc2UsIFRvb2xFeGVjdXRvciB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFByZWZlcmVuY2VzVG9vbHMgaW1wbGVtZW50cyBUb29sRXhlY3V0b3Ige1xuICAgIGdldFRvb2xzKCk6IFRvb2xEZWZpbml0aW9uW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdnZXRfcHJlZmVyZW5jZXMnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnR2V0IGVkaXRvciBwcmVmZXJlbmNlcycsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU3BlY2lmaWMgcHJlZmVyZW5jZSBrZXkgdG8gZ2V0IChvcHRpb25hbCknXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzZXRfcHJlZmVyZW5jZXMnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IGVkaXRvciBwcmVmZXJlbmNlcycsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUHJlZmVyZW5jZSBrZXkgdG8gc2V0J1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcmVmZXJlbmNlIHZhbHVlIHRvIHNldCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsna2V5JywgJ3ZhbHVlJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdnZXRfZ2xvYmFsX3ByZWZlcmVuY2VzJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0dldCBnbG9iYWwgZWRpdG9yIHByZWZlcmVuY2VzJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdHbG9iYWwgcHJlZmVyZW5jZSBrZXkgdG8gZ2V0IChvcHRpb25hbCknXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzZXRfZ2xvYmFsX3ByZWZlcmVuY2VzJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NldCBnbG9iYWwgZWRpdG9yIHByZWZlcmVuY2VzJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdHbG9iYWwgcHJlZmVyZW5jZSBrZXkgdG8gc2V0J1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdHbG9iYWwgcHJlZmVyZW5jZSB2YWx1ZSB0byBzZXQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2tleScsICd2YWx1ZSddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnZ2V0X3JlY2VudF9wcm9qZWN0cycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdHZXQgcmVjZW50bHkgb3BlbmVkIHByb2plY3RzJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdjbGVhcl9yZWNlbnRfcHJvamVjdHMnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ2xlYXIgcmVjZW50bHkgb3BlbmVkIHByb2plY3RzIGxpc3QnLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlKHRvb2xOYW1lOiBzdHJpbmcsIGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHN3aXRjaCAodG9vbE5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9wcmVmZXJlbmNlcyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0UHJlZmVyZW5jZXMoYXJncy5rZXkpO1xuICAgICAgICAgICAgY2FzZSAnc2V0X3ByZWZlcmVuY2VzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRQcmVmZXJlbmNlcyhhcmdzLmtleSwgYXJncy52YWx1ZSk7XG4gICAgICAgICAgICBjYXNlICdnZXRfZ2xvYmFsX3ByZWZlcmVuY2VzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRHbG9iYWxQcmVmZXJlbmNlcyhhcmdzLmtleSk7XG4gICAgICAgICAgICBjYXNlICdzZXRfZ2xvYmFsX3ByZWZlcmVuY2VzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRHbG9iYWxQcmVmZXJlbmNlcyhhcmdzLmtleSwgYXJncy52YWx1ZSk7XG4gICAgICAgICAgICBjYXNlICdnZXRfcmVjZW50X3Byb2plY3RzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRSZWNlbnRQcm9qZWN0cygpO1xuICAgICAgICAgICAgY2FzZSAnY2xlYXJfcmVjZW50X3Byb2plY3RzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGVhclJlY2VudFByb2plY3RzKCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biB0b29sOiAke3Rvb2xOYW1lfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRQcmVmZXJlbmNlcyhrZXk/OiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiAnUHJlZmVyZW5jZXMgQVBJIGlzIG5vdCBzdXBwb3J0ZWQgdGhyb3VnaCBNQ1AnLFxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9uOiAnUGxlYXNlIGFjY2VzcyBwcmVmZXJlbmNlcyB0aHJvdWdoIHRoZSBlZGl0b3IgbWVudTogRWRpdCA+IFByZWZlcmVuY2VzIG9yIHVzZSB0aGUgcHJlZmVyZW5jZXMgcGFuZWwgaW4gdGhlIGVkaXRvcidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHNldFByZWZlcmVuY2VzKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogJ1ByZWZlcmVuY2VzIEFQSSBpcyBub3Qgc3VwcG9ydGVkIHRocm91Z2ggTUNQJyxcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbjogJ1BsZWFzZSBtb2RpZnkgcHJlZmVyZW5jZXMgdGhyb3VnaCB0aGUgZWRpdG9yIG1lbnU6IEVkaXQgPiBQcmVmZXJlbmNlcyBvciB1c2UgdGhlIHByZWZlcmVuY2VzIHBhbmVsIGluIHRoZSBlZGl0b3InXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRHbG9iYWxQcmVmZXJlbmNlcyhrZXk/OiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiAnR2xvYmFsIHByZWZlcmVuY2VzIEFQSSBpcyBub3Qgc3VwcG9ydGVkIHRocm91Z2ggTUNQJyxcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbjogJ1BsZWFzZSBhY2Nlc3MgZ2xvYmFsIHByZWZlcmVuY2VzIHRocm91Z2ggdGhlIGVkaXRvciBtZW51OiBFZGl0ID4gUHJlZmVyZW5jZXMgb3IgdXNlIHRoZSBwcmVmZXJlbmNlcyBwYW5lbCBpbiB0aGUgZWRpdG9yJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgc2V0R2xvYmFsUHJlZmVyZW5jZXMoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiAnR2xvYmFsIHByZWZlcmVuY2VzIEFQSSBpcyBub3Qgc3VwcG9ydGVkIHRocm91Z2ggTUNQJyxcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbjogJ1BsZWFzZSBtb2RpZnkgZ2xvYmFsIHByZWZlcmVuY2VzIHRocm91Z2ggdGhlIGVkaXRvciBtZW51OiBFZGl0ID4gUHJlZmVyZW5jZXMgb3IgdXNlIHRoZSBwcmVmZXJlbmNlcyBwYW5lbCBpbiB0aGUgZWRpdG9yJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0UmVjZW50UHJvamVjdHMoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogJ1JlY2VudCBwcm9qZWN0cyBBUEkgaXMgbm90IHN1cHBvcnRlZCB0aHJvdWdoIE1DUCcsXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb246ICdQbGVhc2UgY2hlY2sgcmVjZW50IHByb2plY3RzIHRocm91Z2ggdGhlIGVkaXRvciBtZW51OiBGaWxlID4gUmVjZW50IFByb2plY3RzIG9yIHRoZSBzdGFydCBzY3JlZW4nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjbGVhclJlY2VudFByb2plY3RzKCk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6ICdSZWNlbnQgcHJvamVjdHMgQVBJIGlzIG5vdCBzdXBwb3J0ZWQgdGhyb3VnaCBNQ1AnLFxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9uOiAnUGxlYXNlIGNsZWFyIHJlY2VudCBwcm9qZWN0cyB0aHJvdWdoIHRoZSBlZGl0b3IgbWVudTogRmlsZSA+IFJlY2VudCBQcm9qZWN0cyBvciB0aGUgc3RhcnQgc2NyZWVuJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=