import { ToolDefinition, ToolResponse, ToolExecutor } from '../types';

export class PreferencesTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
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

    async execute(toolName: string, args: any): Promise<ToolResponse> {
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

    private async getPreferences(key?: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Preferences API is not supported through MCP',
                instruction: 'Please access preferences through the editor menu: Edit > Preferences or use the preferences panel in the editor'
            });
        });
    }

    private async setPreferences(key: string, value: any): Promise<ToolResponse> {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Preferences API is not supported through MCP',
                instruction: 'Please modify preferences through the editor menu: Edit > Preferences or use the preferences panel in the editor'
            });
        });
    }

    private async getGlobalPreferences(key?: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Global preferences API is not supported through MCP',
                instruction: 'Please access global preferences through the editor menu: Edit > Preferences or use the preferences panel in the editor'
            });
        });
    }

    private async setGlobalPreferences(key: string, value: any): Promise<ToolResponse> {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Global preferences API is not supported through MCP',
                instruction: 'Please modify global preferences through the editor menu: Edit > Preferences or use the preferences panel in the editor'
            });
        });
    }

    private async getRecentProjects(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Recent projects API is not supported through MCP',
                instruction: 'Please check recent projects through the editor menu: File > Recent Projects or the start screen'
            });
        });
    }

    private async clearRecentProjects(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Recent projects API is not supported through MCP',
                instruction: 'Please clear recent projects through the editor menu: File > Recent Projects or the start screen'
            });
        });
    }
}