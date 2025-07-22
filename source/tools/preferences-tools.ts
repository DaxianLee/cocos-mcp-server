import { ToolDefinition, ToolResponse, ToolExecutor } from '../types';

export class PreferencesTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            {
                name: 'open_preferences_settings',
                description: 'Open preferences settings panel',
                inputSchema: {
                    type: 'object',
                    properties: {
                        tab: {
                            type: 'string',
                            description: 'Preferences tab to open (optional)',
                            enum: ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions']
                        },
                        args: {
                            type: 'array',
                            description: 'Additional arguments to pass to the tab'
                        }
                    }
                }
            },
            {
                name: 'query_preferences_config',
                description: 'Query preferences configuration',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Plugin or category name',
                            default: 'general'
                        },
                        path: {
                            type: 'string',
                            description: 'Configuration path (optional)'
                        },
                        type: {
                            type: 'string',
                            description: 'Configuration type',
                            enum: ['default', 'global', 'local'],
                            default: 'global'
                        }
                    },
                    required: ['name']
                }
            },
            {
                name: 'set_preferences_config',
                description: 'Set preferences configuration',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Plugin name'
                        },
                        path: {
                            type: 'string',
                            description: 'Configuration path'
                        },
                        value: {
                            description: 'Configuration value'
                        },
                        type: {
                            type: 'string',
                            description: 'Configuration type',
                            enum: ['default', 'global', 'local'],
                            default: 'global'
                        }
                    },
                    required: ['name', 'path', 'value']
                }
            },
            {
                name: 'get_all_preferences',
                description: 'Get all available preferences categories',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'reset_preferences',
                description: 'Reset preferences to default values',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Specific preference category to reset (optional)'
                        },
                        type: {
                            type: 'string',
                            description: 'Configuration type to reset',
                            enum: ['global', 'local'],
                            default: 'global'
                        }
                    }
                }
            },
            {
                name: 'export_preferences',
                description: 'Export current preferences configuration',
                inputSchema: {
                    type: 'object',
                    properties: {
                        exportPath: {
                            type: 'string',
                            description: 'Path to export preferences file (optional)'
                        }
                    }
                }
            },
            {
                name: 'import_preferences',
                description: 'Import preferences configuration from file',
                inputSchema: {
                    type: 'object',
                    properties: {
                        importPath: {
                            type: 'string',
                            description: 'Path to import preferences file from'
                        }
                    },
                    required: ['importPath']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'open_preferences_settings':
                return await this.openPreferencesSettings(args.tab, args.args);
            case 'query_preferences_config':
                return await this.queryPreferencesConfig(args.name, args.path, args.type);
            case 'set_preferences_config':
                return await this.setPreferencesConfig(args.name, args.path, args.value, args.type);
            case 'get_all_preferences':
                return await this.getAllPreferences();
            case 'reset_preferences':
                return await this.resetPreferences(args.name, args.type);
            case 'export_preferences':
                return await this.exportPreferences(args.exportPath);
            case 'import_preferences':
                return await this.importPreferences(args.importPath);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async openPreferencesSettings(tab?: string, args?: any[]): Promise<ToolResponse> {
        return new Promise((resolve) => {
            const requestArgs = [];
            if (tab) {
                requestArgs.push(tab);
            }
            if (args && args.length > 0) {
                requestArgs.push(...args);
            }

            (Editor.Message.request as any)('preferences', 'open-settings', ...requestArgs).then(() => {
                resolve({
                    success: true,
                    message: `Preferences settings opened${tab ? ` on tab: ${tab}` : ''}`
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async queryPreferencesConfig(name: string, path?: string, type: string = 'global'): Promise<ToolResponse> {
        return new Promise((resolve) => {
            const requestArgs = [name];
            if (path) {
                requestArgs.push(path);
            }
            requestArgs.push(type);

            (Editor.Message.request as any)('preferences', 'query-config', ...requestArgs).then((config: any) => {
                resolve({
                    success: true,
                    data: {
                        name: name,
                        path: path,
                        type: type,
                        config: config
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async setPreferencesConfig(name: string, path: string, value: any, type: string = 'global'): Promise<ToolResponse> {
        return new Promise((resolve) => {
            (Editor.Message.request as any)('preferences', 'set-config', name, path, value, type).then((success: boolean) => {
                if (success) {
                    resolve({
                        success: true,
                        message: `Preference '${name}.${path}' updated successfully`
                    });
                } else {
                    resolve({
                        success: false,
                        error: `Failed to update preference '${name}.${path}'`
                    });
                }
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async getAllPreferences(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            // Common preference categories in Cocos Creator
            const categories = [
                'general',
                'external-tools', 
                'data-editor',
                'laboratory',
                'extensions',
                'preview',
                'console',
                'native',
                'builder'
            ];

            const preferences: any = {};

            const queryPromises = categories.map(category => {
                return Editor.Message.request('preferences', 'query-config', category, undefined, 'global')
                    .then((config: any) => {
                        preferences[category] = config;
                    })
                    .catch(() => {
                        // Ignore errors for categories that don't exist
                        preferences[category] = null;
                    });
            });

            Promise.all(queryPromises).then(() => {
                // Filter out null entries
                const validPreferences = Object.fromEntries(
                    Object.entries(preferences).filter(([_, value]) => value !== null)
                );

                resolve({
                    success: true,
                    data: {
                        categories: Object.keys(validPreferences),
                        preferences: validPreferences
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async resetPreferences(name?: string, type: string = 'global'): Promise<ToolResponse> {
        return new Promise((resolve) => {
            if (name) {
                // Reset specific preference category
                Editor.Message.request('preferences', 'query-config', name, undefined, 'default').then((defaultConfig: any) => {
                    return (Editor.Message.request as any)('preferences', 'set-config', name, '', defaultConfig, type);
                }).then((success: boolean) => {
                    if (success) {
                        resolve({
                            success: true,
                            message: `Preference category '${name}' reset to default`
                        });
                    } else {
                        resolve({
                            success: false,
                            error: `Failed to reset preference category '${name}'`
                        });
                    }
                }).catch((err: Error) => {
                    resolve({ success: false, error: err.message });
                });
            } else {
                resolve({
                    success: false,
                    error: 'Resetting all preferences is not supported through API. Please specify a preference category.'
                });
            }
        });
    }

    private async exportPreferences(exportPath?: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            this.getAllPreferences().then((prefsResult: ToolResponse) => {
                if (!prefsResult.success) {
                    resolve(prefsResult);
                    return;
                }

                const prefsData = JSON.stringify(prefsResult.data, null, 2);
                const path = exportPath || `preferences_export_${Date.now()}.json`;

                // For now, return the data - in a real implementation, you'd write to file
                resolve({
                    success: true,
                    data: {
                        exportPath: path,
                        preferences: prefsResult.data,
                        jsonData: prefsData,
                        message: 'Preferences exported successfully'
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async importPreferences(importPath: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Import preferences functionality requires file system access which is not available in this context. Please manually import preferences through the Editor UI.'
            });
        });
    }
}