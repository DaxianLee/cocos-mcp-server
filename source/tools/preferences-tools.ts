import { ToolDefinition, ToolResponse, ToolExecutor } from '../types';

export class PreferencesTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            {
                name: 'preferences_manage',
                description: 'PREFERENCES MANAGEMENT: Configure Cocos Creator editor settings and open preferences panel. WORKFLOW: open_panel to access GUI settings, get_config to read current values, set_config to modify settings, reset_config to restore defaults. Supports global/local/default scopes.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['open_panel', 'get_config', 'set_config', 'reset_config'],
                            description: 'Preference operation: "open_panel" = launch preferences GUI (optional tab parameter) | "get_config" = read configuration values (requires category+path) | "set_config" = modify settings (requires category+path+value) | "reset_config" = restore defaults (requires category)'
                        },
                        // For open_panel action
                        tab: {
                            type: 'string',
                            enum: ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder'],
                            description: 'Preferences tab to display (open_panel action). Available tabs: "general" (basic settings), "external-tools" (editor tools), "data-editor" (data editing), "laboratory" (experimental features), "extensions" (plugins), "preview" (preview settings), "console" (console config), "native" (native build), "builder" (build settings).'
                        },
                        // For get_config/set_config/reset_config actions
                        category: {
                            type: 'string',
                            enum: ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder'],
                            description: 'Configuration category (REQUIRED for get_config/set_config/reset_config). Categories match preferences tabs. "general" = basic editor settings, "external-tools" = tool integration, "data-editor" = data editing preferences. Default: general for common settings.',
                            default: 'general'
                        },
                        path: {
                            type: 'string',
                            description: 'Setting path within category (REQUIRED for get_config/set_config). Use dot notation for nested values. Examples: "editor.fontSize" for editor text size, "preview.autoRefresh" for auto-refresh setting. Check available paths with get_all action first.'
                        },
                        value: {
                            description: 'New setting value (REQUIRED for set_config). Type depends on setting: string for paths/names, number for sizes/delays, boolean for on/off options, object for complex settings. Examples: 14 for fontSize, true for autoSave, "/usr/bin/code" for editor path.'
                        },
                        scope: {
                            type: 'string',
                            enum: ['global', 'local', 'default'],
                            description: 'Setting scope level. "global" = applies to all projects (most common), "local" = current project only (overrides global), "default" = factory settings (read-only for comparison). Recommended: global for general preferences, local for project-specific overrides.',
                            default: 'global'
                        }
                    },
                    required: ['action']
                }
            },
            {
                name: 'preferences_query',
                description: 'PREFERENCES QUERY: Get all available preferences, list categories, or search for specific preference settings. Use this for preference discovery and inspection.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['get_all', 'list_categories', 'search_settings'],
                            description: 'Query action: "get_all" = retrieve all preference configurations | "list_categories" = get available preference categories | "search_settings" = find settings by keyword'
                        },
                        // For get_all action
                        scope: {
                            type: 'string',
                            enum: ['global', 'local', 'default'],
                            description: 'Configuration scope to query (get_all action only)',
                            default: 'global'
                        },
                        categories: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder']
                            },
                            description: 'Specific categories to include (get_all action only). If not specified, all categories are included.'
                        },
                        // For search_settings action
                        keyword: {
                            type: 'string',
                            description: 'Search keyword for finding settings (search_settings action only)'
                        },
                        includeValues: {
                            type: 'boolean',
                            description: 'Include current values in search results (search_settings action only)',
                            default: true
                        }
                    },
                    required: ['action']
                }
            },
            {
                name: 'preferences_backup',
                description: 'PREFERENCES BACKUP: Export current preferences to JSON format or prepare for backup operations. Use this for preference backup and restore workflows.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['export', 'validate_backup'],
                            description: 'Backup action: "export" = export preferences to JSON | "validate_backup" = check backup file format'
                        },
                        // For export action
                        categories: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder']
                            },
                            description: 'Categories to export (export action only). If not specified, all categories are exported.'
                        },
                        scope: {
                            type: 'string',
                            enum: ['global', 'local'],
                            description: 'Configuration scope to export (export action only)',
                            default: 'global'
                        },
                        includeDefaults: {
                            type: 'boolean',
                            description: 'Include default values in export (export action only)',
                            default: false
                        },
                        // For validate_backup action
                        backupData: {
                            type: 'object',
                            description: 'Backup data to validate (validate_backup action only)'
                        }
                    },
                    required: ['action']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'preferences_manage':
                return await this.handlePreferencesManage(args);
            case 'preferences_query':
                return await this.handlePreferencesQuery(args);
            case 'preferences_backup':
                return await this.handlePreferencesBackup(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    // New consolidated handlers
    private async handlePreferencesManage(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'open_panel':
                return await this.openPreferencesPanel(args.tab);
            case 'get_config':
                return await this.getPreferencesConfig(args.category, args.path, args.scope);
            case 'set_config':
                return await this.setPreferencesConfig(args.category, args.path, args.value, args.scope);
            case 'reset_config':
                return await this.resetPreferencesConfig(args.category, args.scope);
            default:
                return { success: false, error: `Unknown preferences manage action: ${action}` };
        }
    }

    private async handlePreferencesQuery(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'get_all':
                return await this.getAllPreferences(args.scope, args.categories);
            case 'list_categories':
                return await this.listPreferencesCategories();
            case 'search_settings':
                return await this.searchPreferencesSettings(args.keyword, args.includeValues);
            default:
                return { success: false, error: `Unknown preferences query action: ${action}` };
        }
    }

    private async handlePreferencesBackup(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'export':
                return await this.exportPreferences(args.categories, args.scope, args.includeDefaults);
            case 'validate_backup':
                return await this.validateBackupData(args.backupData);
            default:
                return { success: false, error: `Unknown preferences backup action: ${action}` };
        }
    }

    // Implementation methods
    private async openPreferencesPanel(tab?: string): Promise<ToolResponse> {
        try {
            const requestArgs = tab ? [tab] : [];
            await (Editor.Message.request as any)('preferences', 'open-settings', ...requestArgs);
            return {
                success: true,
                message: `✅ Preferences panel opened${tab ? ` on "${tab}" tab` : ''}`,
                data: { tab: tab || 'general' }
            };
        } catch (err: any) {
            return { success: false, error: `Failed to open preferences panel: ${err.message}` };
        }
    }

    private async getPreferencesConfig(category: string, path?: string, scope: string = 'global'): Promise<ToolResponse> {
        // Validate category parameter
        if (!category || typeof category !== 'string' || category.trim().length === 0) {
            return {
                success: false,
                error: 'Category is required and must be a non-empty string'
            };
        }

        const trimmedCategory = category.trim();
        const requestArgs = [trimmedCategory];
        if (path && typeof path === 'string' && path.trim().length > 0) {
            requestArgs.push(path.trim());
        }
        requestArgs.push(scope);

        try {
            const config = await (Editor.Message.request as any)('preferences', 'query-config', ...requestArgs);
            return {
                success: true,
                message: `✅ Configuration retrieved for ${trimmedCategory}${path ? `.${path.trim()}` : ''}`,
                data: {
                    category: trimmedCategory,
                    path: path ? path.trim() : undefined,
                    scope,
                    config
                }
            };
        } catch (err: any) {
            return { success: false, error: `Failed to get preference config: ${err.message}` };
        }
    }

    private async setPreferencesConfig(category: string, path: string, value: any, scope: string = 'global'): Promise<ToolResponse> {
        // Validate required parameters
        if (!category || typeof category !== 'string' || category.trim().length === 0) {
            return {
                success: false,
                error: 'Category is required and must be a non-empty string'
            };
        }

        if (!path || typeof path !== 'string' || path.trim().length === 0) {
            return {
                success: false,
                error: 'Path is required and must be a non-empty string'
            };
        }

        if (value === undefined) {
            return {
                success: false,
                error: 'Value is required and cannot be undefined'
            };
        }

        const trimmedCategory = category.trim();
        const trimmedPath = path.trim();

        try {
            const success = await (Editor.Message.request as any)('preferences', 'set-config', trimmedCategory, trimmedPath, value, scope);
            if (success) {
                return {
                    success: true,
                    message: `✅ Preference "${trimmedCategory}.${trimmedPath}" updated successfully`,
                    data: {
                        category: trimmedCategory,
                        path: trimmedPath,
                        value,
                        scope
                    }
                };
            } else {
                return {
                    success: false,
                    error: `Failed to update preference "${trimmedCategory}.${trimmedPath}". Value may be invalid or read-only.`
                };
            }
        } catch (err: any) {
            return { success: false, error: `Error setting preference: ${err.message}` };
        }
    }

    private async resetPreferencesConfig(category: string, scope: string = 'global'): Promise<ToolResponse> {
        // Validate category parameter
        if (!category || typeof category !== 'string' || category.trim().length === 0) {
            return {
                success: false,
                error: 'Category is required and must be a non-empty string'
            };
        }

        const trimmedCategory = category.trim();

        try {
            // Get default configuration first
            const defaultConfig = await (Editor.Message.request as any)('preferences', 'query-config', trimmedCategory, undefined, 'default');
            if (!defaultConfig) {
                throw new Error(`No default configuration found for category "${trimmedCategory}"`);
            }
            // Apply default configuration
            const success = await (Editor.Message.request as any)('preferences', 'set-config', trimmedCategory, '', defaultConfig, scope);
            if (success) {
                return {
                    success: true,
                    message: `✅ Preference category "${trimmedCategory}" reset to defaults`,
                    data: {
                        category: trimmedCategory,
                        scope,
                        action: 'reset'
                    }
                };
            } else {
                return {
                    success: false,
                    error: `Failed to reset preference category "${trimmedCategory}". Category may not support reset operation.`
                };
            }
        } catch (err: any) {
            return { success: false, error: `Error resetting preferences: ${err.message}` };
        }
    }

    private async getAllPreferences(scope: string = 'global', categories?: string[]): Promise<ToolResponse> {
        const availableCategories = [
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

        // Use specified categories or all available ones
        const categoriesToQuery = categories || availableCategories;
        const preferences: any = {};

        try {
            const queryPromises = categoriesToQuery.map(category => {
                return (Editor.Message.request as any)('preferences', 'query-config', category, undefined, scope)
                    .then((config: any) => {
                        preferences[category] = config;
                    })
                    .catch(() => {
                        // Category doesn't exist or access denied
                        preferences[category] = null;
                    });
            });

            await Promise.all(queryPromises);

            // Filter out null entries
            const validPreferences = Object.fromEntries(
                Object.entries(preferences).filter(([_, value]) => value !== null)
            );

            return {
                success: true,
                message: `✅ Retrieved preferences for ${Object.keys(validPreferences).length} categories`,
                data: {
                    scope,
                    requestedCategories: categoriesToQuery,
                    availableCategories: Object.keys(validPreferences),
                    preferences: validPreferences,
                    summary: {
                        totalCategories: Object.keys(validPreferences).length,
                        scope: scope
                    }
                }
            };
        } catch (err: any) {
            return { success: false, error: `Error retrieving preferences: ${err.message}` };
        }
    }

    private async listPreferencesCategories(): Promise<ToolResponse> {
        const categories = [
            { name: 'general', description: 'General editor settings and UI preferences' },
            { name: 'external-tools', description: 'External tool integrations and paths' },
            { name: 'data-editor', description: 'Data editor configurations and templates' },
            { name: 'laboratory', description: 'Experimental features and beta functionality' },
            { name: 'extensions', description: 'Extension manager and plugin settings' },
            { name: 'preview', description: 'Game preview and simulator settings' },
            { name: 'console', description: 'Console panel display and logging options' },
            { name: 'native', description: 'Native platform build configurations' },
            { name: 'builder', description: 'Build system and compilation settings' }
        ];

        return {
            success: true,
            message: `✅ Listed ${categories.length} available preference categories`,
            data: {
                categories,
                totalCount: categories.length,
                usage: 'Use these category names with preferences_manage or preferences_query tools'
            }
        };
    }

    private async searchPreferencesSettings(keyword: string, includeValues: boolean = true): Promise<ToolResponse> {
        try {
            // Validate keyword parameter
            if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
                return {
                    success: false,
                    error: 'Search keyword is required and must be a non-empty string'
                };
            }

            const trimmedKeyword = keyword.trim();
            const allPrefsResponse = await this.getAllPreferences('global');
            if (!allPrefsResponse.success) {
                return allPrefsResponse;
            }

            const preferences = allPrefsResponse.data?.preferences || {};
            const searchResults: any[] = [];

            // Search through all categories and their settings
            for (const [category, config] of Object.entries(preferences)) {
                if (config && typeof config === 'object') {
                    this.searchInObject(config as any, trimmedKeyword, category, '', searchResults, includeValues);
                }
            }

            return {
                success: true,
                message: `✅ Found ${searchResults.length} settings matching "${trimmedKeyword}"`,
                data: {
                    keyword: trimmedKeyword,
                    includeValues,
                    resultCount: searchResults.length,
                    results: searchResults.slice(0, 50), // Limit results to prevent overwhelming output
                    hasMoreResults: searchResults.length > 50
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Search failed: ${error.message}`
            };
        }
    }

    private searchInObject(obj: any, keyword: string, category: string, pathPrefix: string, results: any[], includeValues: boolean): void {
        if (!obj || typeof obj !== 'object' || !keyword || typeof keyword !== 'string') {
            return;
        }

        const lowerKeyword = keyword.toLowerCase();
        
        try {
            for (const [key, value] of Object.entries(obj)) {
                if (typeof key !== 'string') continue;
                
                const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
                const keyMatches = key.toLowerCase().includes(lowerKeyword);
                const valueMatches = typeof value === 'string' && value.toLowerCase().includes(lowerKeyword);
                
                if (keyMatches || valueMatches) {
                    const result: any = {
                        category,
                        path: currentPath,
                        key,
                        matchType: keyMatches ? (valueMatches ? 'both' : 'key') : 'value'
                    };
                    
                    if (includeValues) {
                        result.value = value;
                        result.valueType = typeof value;
                    }
                    
                    results.push(result);
                }
                
                // Recursively search nested objects (with depth limit to prevent infinite recursion)
                if (value && typeof value === 'object' && !Array.isArray(value) && pathPrefix.split('.').length < 10) {
                    this.searchInObject(value, keyword, category, currentPath, results, includeValues);
                }
            }
        } catch (error) {
            // Skip objects that can't be enumerated
        }
    }

    private async exportPreferences(categories?: string[], scope: string = 'global', includeDefaults: boolean = false): Promise<ToolResponse> {
        try {
            // Validate scope parameter
            const validScopes = ['global', 'local'];
            if (!validScopes.includes(scope)) {
                return {
                    success: false,
                    error: `Invalid scope "${scope}". Must be one of: ${validScopes.join(', ')}`
                };
            }

            // Validate categories parameter if provided
            if (categories) {
                if (!Array.isArray(categories)) {
                    return {
                        success: false,
                        error: 'Categories must be an array'
                    };
                }

                const validCategories = ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder'];
                const invalidCategories = categories.filter(cat => !validCategories.includes(cat));
                if (invalidCategories.length > 0) {
                    return {
                        success: false,
                        error: `Invalid categories: ${invalidCategories.join(', ')}. Valid categories are: ${validCategories.join(', ')}`
                    };
                }
            }

            const allPrefsResponse = await this.getAllPreferences(scope, categories);
            if (!allPrefsResponse.success) {
                return allPrefsResponse;
            }

            const exportData: any = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    scope: scope,
                    includeDefaults: includeDefaults,
                    cocosVersion: (Editor as any).versions?.cocos || 'Unknown',
                    exportedCategories: Object.keys(allPrefsResponse.data?.preferences || {}),
                    requestedCategories: categories || 'all'
                },
                preferences: allPrefsResponse.data?.preferences || {}
            };

            // Include defaults if requested
            if (includeDefaults) {
                try {
                    const defaultsResponse = await this.getAllPreferences('default', categories);
                    if (defaultsResponse.success) {
                        exportData.defaults = defaultsResponse.data?.preferences || {};
                    } else {
                        exportData.metadata.defaultsWarning = 'Could not retrieve default preferences';
                    }
                } catch (error) {
                    exportData.metadata.defaultsWarning = 'Error retrieving default preferences';
                }
            }

            const jsonData = JSON.stringify(exportData, null, 2);
            const exportPath = `cocos_preferences_${scope}_${Date.now()}.json`;

            return {
                success: true,
                message: `✅ Preferences exported for ${exportData.metadata.exportedCategories.length} categories`,
                data: {
                    exportPath,
                    metadata: exportData.metadata,
                    preferences: exportData.preferences,
                    jsonData,
                    fileSize: Buffer.byteLength(jsonData, 'utf8'),
                    summary: {
                        totalCategories: exportData.metadata.exportedCategories.length,
                        scope: scope,
                        includeDefaults: includeDefaults,
                        hasDefaults: !!exportData.defaults
                    }
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Export failed: ${error.message}`
            };
        }
    }

    private async validateBackupData(backupData: any): Promise<ToolResponse> {
        try {
            const validation = {
                isValid: true,
                errors: [] as string[],
                warnings: [] as string[],
                metadata: null as any
            };

            // Check if backupData is provided
            if (backupData === undefined || backupData === null) {
                validation.isValid = false;
                validation.errors.push('Backup data is required and cannot be null or undefined');
                return {
                    success: false,
                    error: 'Backup data is required for validation'
                };
            }

            // Check basic structure
            if (typeof backupData !== 'object' || Array.isArray(backupData)) {
                validation.isValid = false;
                validation.errors.push('Backup data must be a valid object (not array or primitive type)');
            } else {
                // Check for metadata
                if (backupData.metadata) {
                    if (typeof backupData.metadata !== 'object') {
                        validation.errors.push('Metadata must be an object');
                        validation.isValid = false;
                    } else {
                        validation.metadata = backupData.metadata;

                        if (!backupData.metadata.exportDate) {
                            validation.warnings.push('Missing export date in metadata');
                        } else if (typeof backupData.metadata.exportDate !== 'string') {
                            validation.warnings.push('Export date should be a string');
                        }

                        if (!backupData.metadata.scope) {
                            validation.warnings.push('Missing scope information in metadata');
                        } else if (!['global', 'local', 'default'].includes(backupData.metadata.scope)) {
                            validation.warnings.push('Invalid scope value in metadata');
                        }

                        if (backupData.metadata.cocosVersion && typeof backupData.metadata.cocosVersion !== 'string') {
                            validation.warnings.push('Cocos version should be a string');
                        }
                    }
                } else {
                    validation.warnings.push('No metadata found in backup file');
                }

                // Check for preferences data
                if (!backupData.preferences) {
                    validation.errors.push('No preferences data found in backup');
                    validation.isValid = false;
                } else if (typeof backupData.preferences !== 'object' || Array.isArray(backupData.preferences)) {
                    validation.errors.push('Preferences data must be an object (not array or primitive type)');
                    validation.isValid = false;
                } else {
                    // Count categories and validate structure
                    const categoryCount = Object.keys(backupData.preferences).length;
                    if (categoryCount === 0) {
                        validation.warnings.push('Backup contains no preference categories');
                    }

                    // Validate category names
                    const validCategories = ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder'];
                    const invalidCategories = Object.keys(backupData.preferences).filter(cat => !validCategories.includes(cat));
                    if (invalidCategories.length > 0) {
                        validation.warnings.push(`Unknown categories found: ${invalidCategories.join(', ')}`);
                    }
                }
            }

            return {
                success: true,
                message: `✅ Backup validation completed: ${validation.isValid ? 'Valid' : 'Invalid'}`,
                data: {
                    isValid: validation.isValid,
                    errors: validation.errors,
                    warnings: validation.warnings,
                    metadata: validation.metadata,
                    summary: {
                        hasErrors: validation.errors.length > 0,
                        hasWarnings: validation.warnings.length > 0,
                        categoryCount: backupData?.preferences ? Object.keys(backupData.preferences).length : 0,
                        errorCount: validation.errors.length,
                        warningCount: validation.warnings.length
                    }
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Validation failed: ${error.message}`
            };
        }
    }
}