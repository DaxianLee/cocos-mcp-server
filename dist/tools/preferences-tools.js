"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesTools = void 0;
class PreferencesTools {
    getTools() {
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
    async execute(toolName, args) {
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
    async handlePreferencesManage(args) {
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
    async handlePreferencesQuery(args) {
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
    async handlePreferencesBackup(args) {
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
    async openPreferencesPanel(tab) {
        try {
            const requestArgs = tab ? [tab] : [];
            await Editor.Message.request('preferences', 'open-settings', ...requestArgs);
            return {
                success: true,
                message: `✅ Preferences panel opened${tab ? ` on "${tab}" tab` : ''}`,
                data: { tab: tab || 'general' }
            };
        }
        catch (err) {
            return { success: false, error: `Failed to open preferences panel: ${err.message}` };
        }
    }
    async getPreferencesConfig(category, path, scope = 'global') {
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
            const config = await Editor.Message.request('preferences', 'query-config', ...requestArgs);
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
        }
        catch (err) {
            return { success: false, error: `Failed to get preference config: ${err.message}` };
        }
    }
    async setPreferencesConfig(category, path, value, scope = 'global') {
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
            const success = await Editor.Message.request('preferences', 'set-config', trimmedCategory, trimmedPath, value, scope);
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
            }
            else {
                return {
                    success: false,
                    error: `Failed to update preference "${trimmedCategory}.${trimmedPath}". Value may be invalid or read-only.`
                };
            }
        }
        catch (err) {
            return { success: false, error: `Error setting preference: ${err.message}` };
        }
    }
    async resetPreferencesConfig(category, scope = 'global') {
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
            const defaultConfig = await Editor.Message.request('preferences', 'query-config', trimmedCategory, undefined, 'default');
            if (!defaultConfig) {
                throw new Error(`No default configuration found for category "${trimmedCategory}"`);
            }
            // Apply default configuration
            const success = await Editor.Message.request('preferences', 'set-config', trimmedCategory, '', defaultConfig, scope);
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
            }
            else {
                return {
                    success: false,
                    error: `Failed to reset preference category "${trimmedCategory}". Category may not support reset operation.`
                };
            }
        }
        catch (err) {
            return { success: false, error: `Error resetting preferences: ${err.message}` };
        }
    }
    async getAllPreferences(scope = 'global', categories) {
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
        const preferences = {};
        try {
            const queryPromises = categoriesToQuery.map(category => {
                return Editor.Message.request('preferences', 'query-config', category, undefined, scope)
                    .then((config) => {
                    preferences[category] = config;
                })
                    .catch(() => {
                    // Category doesn't exist or access denied
                    preferences[category] = null;
                });
            });
            await Promise.all(queryPromises);
            // Filter out null entries
            const validPreferences = Object.fromEntries(Object.entries(preferences).filter(([_, value]) => value !== null));
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
        }
        catch (err) {
            return { success: false, error: `Error retrieving preferences: ${err.message}` };
        }
    }
    async listPreferencesCategories() {
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
    async searchPreferencesSettings(keyword, includeValues = true) {
        var _a;
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
            const preferences = ((_a = allPrefsResponse.data) === null || _a === void 0 ? void 0 : _a.preferences) || {};
            const searchResults = [];
            // Search through all categories and their settings
            for (const [category, config] of Object.entries(preferences)) {
                if (config && typeof config === 'object') {
                    this.searchInObject(config, trimmedKeyword, category, '', searchResults, includeValues);
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
        }
        catch (error) {
            return {
                success: false,
                error: `Search failed: ${error.message}`
            };
        }
    }
    searchInObject(obj, keyword, category, pathPrefix, results, includeValues) {
        if (!obj || typeof obj !== 'object' || !keyword || typeof keyword !== 'string') {
            return;
        }
        const lowerKeyword = keyword.toLowerCase();
        try {
            for (const [key, value] of Object.entries(obj)) {
                if (typeof key !== 'string')
                    continue;
                const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
                const keyMatches = key.toLowerCase().includes(lowerKeyword);
                const valueMatches = typeof value === 'string' && value.toLowerCase().includes(lowerKeyword);
                if (keyMatches || valueMatches) {
                    const result = {
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
        }
        catch (error) {
            // Skip objects that can't be enumerated
        }
    }
    async exportPreferences(categories, scope = 'global', includeDefaults = false) {
        var _a, _b, _c, _d;
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
            const exportData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    scope: scope,
                    includeDefaults: includeDefaults,
                    cocosVersion: ((_a = Editor.versions) === null || _a === void 0 ? void 0 : _a.cocos) || 'Unknown',
                    exportedCategories: Object.keys(((_b = allPrefsResponse.data) === null || _b === void 0 ? void 0 : _b.preferences) || {}),
                    requestedCategories: categories || 'all'
                },
                preferences: ((_c = allPrefsResponse.data) === null || _c === void 0 ? void 0 : _c.preferences) || {}
            };
            // Include defaults if requested
            if (includeDefaults) {
                try {
                    const defaultsResponse = await this.getAllPreferences('default', categories);
                    if (defaultsResponse.success) {
                        exportData.defaults = ((_d = defaultsResponse.data) === null || _d === void 0 ? void 0 : _d.preferences) || {};
                    }
                    else {
                        exportData.metadata.defaultsWarning = 'Could not retrieve default preferences';
                    }
                }
                catch (error) {
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
        }
        catch (error) {
            return {
                success: false,
                error: `Export failed: ${error.message}`
            };
        }
    }
    async validateBackupData(backupData) {
        try {
            const validation = {
                isValid: true,
                errors: [],
                warnings: [],
                metadata: null
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
            }
            else {
                // Check for metadata
                if (backupData.metadata) {
                    if (typeof backupData.metadata !== 'object') {
                        validation.errors.push('Metadata must be an object');
                        validation.isValid = false;
                    }
                    else {
                        validation.metadata = backupData.metadata;
                        if (!backupData.metadata.exportDate) {
                            validation.warnings.push('Missing export date in metadata');
                        }
                        else if (typeof backupData.metadata.exportDate !== 'string') {
                            validation.warnings.push('Export date should be a string');
                        }
                        if (!backupData.metadata.scope) {
                            validation.warnings.push('Missing scope information in metadata');
                        }
                        else if (!['global', 'local', 'default'].includes(backupData.metadata.scope)) {
                            validation.warnings.push('Invalid scope value in metadata');
                        }
                        if (backupData.metadata.cocosVersion && typeof backupData.metadata.cocosVersion !== 'string') {
                            validation.warnings.push('Cocos version should be a string');
                        }
                    }
                }
                else {
                    validation.warnings.push('No metadata found in backup file');
                }
                // Check for preferences data
                if (!backupData.preferences) {
                    validation.errors.push('No preferences data found in backup');
                    validation.isValid = false;
                }
                else if (typeof backupData.preferences !== 'object' || Array.isArray(backupData.preferences)) {
                    validation.errors.push('Preferences data must be an object (not array or primitive type)');
                    validation.isValid = false;
                }
                else {
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
                        categoryCount: (backupData === null || backupData === void 0 ? void 0 : backupData.preferences) ? Object.keys(backupData.preferences).length : 0,
                        errorCount: validation.errors.length,
                        warningCount: validation.warnings.length
                    }
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Validation failed: ${error.message}`
            };
        }
    }
}
exports.PreferencesTools = PreferencesTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyZW5jZXMtdG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb3VyY2UvdG9vbHMvcHJlZmVyZW5jZXMtdG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSxnQkFBZ0I7SUFDekIsUUFBUTtRQUNKLE9BQU87WUFDSDtnQkFDSSxJQUFJLEVBQUUsb0JBQW9CO2dCQUMxQixXQUFXLEVBQUUsb1JBQW9SO2dCQUNqUyxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLE1BQU0sRUFBRTs0QkFDSixJQUFJLEVBQUUsUUFBUTs0QkFDZCxJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUM7NEJBQ2hFLFdBQVcsRUFBRSxrUkFBa1I7eUJBQ2xTO3dCQUNELHdCQUF3Qjt3QkFDeEIsR0FBRyxFQUFFOzRCQUNELElBQUksRUFBRSxRQUFROzRCQUNkLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUM7NEJBQ3pILFdBQVcsRUFBRSx5VUFBeVU7eUJBQ3pWO3dCQUNELGlEQUFpRDt3QkFDakQsUUFBUSxFQUFFOzRCQUNOLElBQUksRUFBRSxRQUFROzRCQUNkLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUM7NEJBQ3pILFdBQVcsRUFBRSxzUUFBc1E7NEJBQ25SLE9BQU8sRUFBRSxTQUFTO3lCQUNyQjt3QkFDRCxJQUFJLEVBQUU7NEJBQ0YsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLDJQQUEyUDt5QkFDM1E7d0JBQ0QsS0FB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QUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQzt3QkFDdkMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUM7d0JBQzNDLGFBQWEsRUFBRSxDQUFBLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdkYsVUFBVSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTTt3QkFDcEMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTTtxQkFDM0M7aUJBQ0o7YUFDSixDQUFDO1FBQ04sQ0FBQztRQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7WUFDbEIsT0FBTztnQkFDSCxPQUFPLEVBQUUsS0FBSztnQkFDZCxLQUFLLEVBQUUsc0JBQXNCLEtBQUssQ0FBQyxPQUFPLEVBQUU7YUFDL0MsQ0FBQztRQUNOLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFycUJELDRDQXFxQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb29sRGVmaW5pdGlvbiwgVG9vbFJlc3BvbnNlLCBUb29sRXhlY3V0b3IgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBQcmVmZXJlbmNlc1Rvb2xzIGltcGxlbWVudHMgVG9vbEV4ZWN1dG9yIHtcbiAgICBnZXRUb29scygpOiBUb29sRGVmaW5pdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncHJlZmVyZW5jZXNfbWFuYWdlJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1BSRUZFUkVOQ0VTIE1BTkFHRU1FTlQ6IENvbmZpZ3VyZSBDb2NvcyBDcmVhdG9yIGVkaXRvciBzZXR0aW5ncyBhbmQgb3BlbiBwcmVmZXJlbmNlcyBwYW5lbC4gV09SS0ZMT1c6IG9wZW5fcGFuZWwgdG8gYWNjZXNzIEdVSSBzZXR0aW5ncywgZ2V0X2NvbmZpZyB0byByZWFkIGN1cnJlbnQgdmFsdWVzLCBzZXRfY29uZmlnIHRvIG1vZGlmeSBzZXR0aW5ncywgcmVzZXRfY29uZmlnIHRvIHJlc3RvcmUgZGVmYXVsdHMuIFN1cHBvcnRzIGdsb2JhbC9sb2NhbC9kZWZhdWx0IHNjb3Blcy4nLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ29wZW5fcGFuZWwnLCAnZ2V0X2NvbmZpZycsICdzZXRfY29uZmlnJywgJ3Jlc2V0X2NvbmZpZyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUHJlZmVyZW5jZSBvcGVyYXRpb246IFwib3Blbl9wYW5lbFwiID0gbGF1bmNoIHByZWZlcmVuY2VzIEdVSSAob3B0aW9uYWwgdGFiIHBhcmFtZXRlcikgfCBcImdldF9jb25maWdcIiA9IHJlYWQgY29uZmlndXJhdGlvbiB2YWx1ZXMgKHJlcXVpcmVzIGNhdGVnb3J5K3BhdGgpIHwgXCJzZXRfY29uZmlnXCIgPSBtb2RpZnkgc2V0dGluZ3MgKHJlcXVpcmVzIGNhdGVnb3J5K3BhdGgrdmFsdWUpIHwgXCJyZXNldF9jb25maWdcIiA9IHJlc3RvcmUgZGVmYXVsdHMgKHJlcXVpcmVzIGNhdGVnb3J5KSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3Igb3Blbl9wYW5lbCBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnZ2VuZXJhbCcsICdleHRlcm5hbC10b29scycsICdkYXRhLWVkaXRvcicsICdsYWJvcmF0b3J5JywgJ2V4dGVuc2lvbnMnLCAncHJldmlldycsICdjb25zb2xlJywgJ25hdGl2ZScsICdidWlsZGVyJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcmVmZXJlbmNlcyB0YWIgdG8gZGlzcGxheSAob3Blbl9wYW5lbCBhY3Rpb24pLiBBdmFpbGFibGUgdGFiczogXCJnZW5lcmFsXCIgKGJhc2ljIHNldHRpbmdzKSwgXCJleHRlcm5hbC10b29sc1wiIChlZGl0b3IgdG9vbHMpLCBcImRhdGEtZWRpdG9yXCIgKGRhdGEgZWRpdGluZyksIFwibGFib3JhdG9yeVwiIChleHBlcmltZW50YWwgZmVhdHVyZXMpLCBcImV4dGVuc2lvbnNcIiAocGx1Z2lucyksIFwicHJldmlld1wiIChwcmV2aWV3IHNldHRpbmdzKSwgXCJjb25zb2xlXCIgKGNvbnNvbGUgY29uZmlnKSwgXCJuYXRpdmVcIiAobmF0aXZlIGJ1aWxkKSwgXCJidWlsZGVyXCIgKGJ1aWxkIHNldHRpbmdzKS4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGdldF9jb25maWcvc2V0X2NvbmZpZy9yZXNldF9jb25maWcgYWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2dlbmVyYWwnLCAnZXh0ZXJuYWwtdG9vbHMnLCAnZGF0YS1lZGl0b3InLCAnbGFib3JhdG9yeScsICdleHRlbnNpb25zJywgJ3ByZXZpZXcnLCAnY29uc29sZScsICduYXRpdmUnLCAnYnVpbGRlciddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ29uZmlndXJhdGlvbiBjYXRlZ29yeSAoUkVRVUlSRUQgZm9yIGdldF9jb25maWcvc2V0X2NvbmZpZy9yZXNldF9jb25maWcpLiBDYXRlZ29yaWVzIG1hdGNoIHByZWZlcmVuY2VzIHRhYnMuIFwiZ2VuZXJhbFwiID0gYmFzaWMgZWRpdG9yIHNldHRpbmdzLCBcImV4dGVybmFsLXRvb2xzXCIgPSB0b29sIGludGVncmF0aW9uLCBcImRhdGEtZWRpdG9yXCIgPSBkYXRhIGVkaXRpbmcgcHJlZmVyZW5jZXMuIERlZmF1bHQ6IGdlbmVyYWwgZm9yIGNvbW1vbiBzZXR0aW5ncy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdnZW5lcmFsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NldHRpbmcgcGF0aCB3aXRoaW4gY2F0ZWdvcnkgKFJFUVVJUkVEIGZvciBnZXRfY29uZmlnL3NldF9jb25maWcpLiBVc2UgZG90IG5vdGF0aW9uIGZvciBuZXN0ZWQgdmFsdWVzLiBFeGFtcGxlczogXCJlZGl0b3IuZm9udFNpemVcIiBmb3IgZWRpdG9yIHRleHQgc2l6ZSwgXCJwcmV2aWV3LmF1dG9SZWZyZXNoXCIgZm9yIGF1dG8tcmVmcmVzaCBzZXR0aW5nLiBDaGVjayBhdmFpbGFibGUgcGF0aHMgd2l0aCBnZXRfYWxsIGFjdGlvbiBmaXJzdC4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ05ldyBzZXR0aW5nIHZhbHVlIChSRVFVSVJFRCBmb3Igc2V0X2NvbmZpZykuIFR5cGUgZGVwZW5kcyBvbiBzZXR0aW5nOiBzdHJpbmcgZm9yIHBhdGhzL25hbWVzLCBudW1iZXIgZm9yIHNpemVzL2RlbGF5cywgYm9vbGVhbiBmb3Igb24vb2ZmIG9wdGlvbnMsIG9iamVjdCBmb3IgY29tcGxleCBzZXR0aW5ncy4gRXhhbXBsZXM6IDE0IGZvciBmb250U2l6ZSwgdHJ1ZSBmb3IgYXV0b1NhdmUsIFwiL3Vzci9iaW4vY29kZVwiIGZvciBlZGl0b3IgcGF0aC4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2dsb2JhbCcsICdsb2NhbCcsICdkZWZhdWx0J10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZXR0aW5nIHNjb3BlIGxldmVsLiBcImdsb2JhbFwiID0gYXBwbGllcyB0byBhbGwgcHJvamVjdHMgKG1vc3QgY29tbW9uKSwgXCJsb2NhbFwiID0gY3VycmVudCBwcm9qZWN0IG9ubHkgKG92ZXJyaWRlcyBnbG9iYWwpLCBcImRlZmF1bHRcIiA9IGZhY3Rvcnkgc2V0dGluZ3MgKHJlYWQtb25seSBmb3IgY29tcGFyaXNvbikuIFJlY29tbWVuZGVkOiBnbG9iYWwgZm9yIGdlbmVyYWwgcHJlZmVyZW5jZXMsIGxvY2FsIGZvciBwcm9qZWN0LXNwZWNpZmljIG92ZXJyaWRlcy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdnbG9iYWwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2FjdGlvbiddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncHJlZmVyZW5jZXNfcXVlcnknLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUFJFRkVSRU5DRVMgUVVFUlk6IEdldCBhbGwgYXZhaWxhYmxlIHByZWZlcmVuY2VzLCBsaXN0IGNhdGVnb3JpZXMsIG9yIHNlYXJjaCBmb3Igc3BlY2lmaWMgcHJlZmVyZW5jZSBzZXR0aW5ncy4gVXNlIHRoaXMgZm9yIHByZWZlcmVuY2UgZGlzY292ZXJ5IGFuZCBpbnNwZWN0aW9uLicsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnZ2V0X2FsbCcsICdsaXN0X2NhdGVnb3JpZXMnLCAnc2VhcmNoX3NldHRpbmdzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdRdWVyeSBhY3Rpb246IFwiZ2V0X2FsbFwiID0gcmV0cmlldmUgYWxsIHByZWZlcmVuY2UgY29uZmlndXJhdGlvbnMgfCBcImxpc3RfY2F0ZWdvcmllc1wiID0gZ2V0IGF2YWlsYWJsZSBwcmVmZXJlbmNlIGNhdGVnb3JpZXMgfCBcInNlYXJjaF9zZXR0aW5nc1wiID0gZmluZCBzZXR0aW5ncyBieSBrZXl3b3JkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBnZXRfYWxsIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2dsb2JhbCcsICdsb2NhbCcsICdkZWZhdWx0J10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDb25maWd1cmF0aW9uIHNjb3BlIHRvIHF1ZXJ5IChnZXRfYWxsIGFjdGlvbiBvbmx5KScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogJ2dsb2JhbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydnZW5lcmFsJywgJ2V4dGVybmFsLXRvb2xzJywgJ2RhdGEtZWRpdG9yJywgJ2xhYm9yYXRvcnknLCAnZXh0ZW5zaW9ucycsICdwcmV2aWV3JywgJ2NvbnNvbGUnLCAnbmF0aXZlJywgJ2J1aWxkZXInXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTcGVjaWZpYyBjYXRlZ29yaWVzIHRvIGluY2x1ZGUgKGdldF9hbGwgYWN0aW9uIG9ubHkpLiBJZiBub3Qgc3BlY2lmaWVkLCBhbGwgY2F0ZWdvcmllcyBhcmUgaW5jbHVkZWQuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBzZWFyY2hfc2V0dGluZ3MgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXl3b3JkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZWFyY2gga2V5d29yZCBmb3IgZmluZGluZyBzZXR0aW5ncyAoc2VhcmNoX3NldHRpbmdzIGFjdGlvbiBvbmx5KSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlVmFsdWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSW5jbHVkZSBjdXJyZW50IHZhbHVlcyBpbiBzZWFyY2ggcmVzdWx0cyAoc2VhcmNoX3NldHRpbmdzIGFjdGlvbiBvbmx5KScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3ByZWZlcmVuY2VzX2JhY2t1cCcsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQUkVGRVJFTkNFUyBCQUNLVVA6IEV4cG9ydCBjdXJyZW50IHByZWZlcmVuY2VzIHRvIEpTT04gZm9ybWF0IG9yIHByZXBhcmUgZm9yIGJhY2t1cCBvcGVyYXRpb25zLiBVc2UgdGhpcyBmb3IgcHJlZmVyZW5jZSBiYWNrdXAgYW5kIHJlc3RvcmUgd29ya2Zsb3dzLicsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnZXhwb3J0JywgJ3ZhbGlkYXRlX2JhY2t1cCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQmFja3VwIGFjdGlvbjogXCJleHBvcnRcIiA9IGV4cG9ydCBwcmVmZXJlbmNlcyB0byBKU09OIHwgXCJ2YWxpZGF0ZV9iYWNrdXBcIiA9IGNoZWNrIGJhY2t1cCBmaWxlIGZvcm1hdCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgZXhwb3J0IGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcmllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnZ2VuZXJhbCcsICdleHRlcm5hbC10b29scycsICdkYXRhLWVkaXRvcicsICdsYWJvcmF0b3J5JywgJ2V4dGVuc2lvbnMnLCAncHJldmlldycsICdjb25zb2xlJywgJ25hdGl2ZScsICdidWlsZGVyJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ2F0ZWdvcmllcyB0byBleHBvcnQgKGV4cG9ydCBhY3Rpb24gb25seSkuIElmIG5vdCBzcGVjaWZpZWQsIGFsbCBjYXRlZ29yaWVzIGFyZSBleHBvcnRlZC4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2dsb2JhbCcsICdsb2NhbCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ29uZmlndXJhdGlvbiBzY29wZSB0byBleHBvcnQgKGV4cG9ydCBhY3Rpb24gb25seSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdnbG9iYWwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZURlZmF1bHRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSW5jbHVkZSBkZWZhdWx0IHZhbHVlcyBpbiBleHBvcnQgKGV4cG9ydCBhY3Rpb24gb25seSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHZhbGlkYXRlX2JhY2t1cCBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2t1cERhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0JhY2t1cCBkYXRhIHRvIHZhbGlkYXRlICh2YWxpZGF0ZV9iYWNrdXAgYWN0aW9uIG9ubHkpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlKHRvb2xOYW1lOiBzdHJpbmcsIGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHN3aXRjaCAodG9vbE5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3ByZWZlcmVuY2VzX21hbmFnZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlUHJlZmVyZW5jZXNNYW5hZ2UoYXJncyk7XG4gICAgICAgICAgICBjYXNlICdwcmVmZXJlbmNlc19xdWVyeSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlUHJlZmVyZW5jZXNRdWVyeShhcmdzKTtcbiAgICAgICAgICAgIGNhc2UgJ3ByZWZlcmVuY2VzX2JhY2t1cCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlUHJlZmVyZW5jZXNCYWNrdXAoYXJncyk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biB0b29sOiAke3Rvb2xOYW1lfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTmV3IGNvbnNvbGlkYXRlZCBoYW5kbGVyc1xuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlUHJlZmVyZW5jZXNNYW5hZ2UoYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgeyBhY3Rpb24gfSA9IGFyZ3M7XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnb3Blbl9wYW5lbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMub3BlblByZWZlcmVuY2VzUGFuZWwoYXJncy50YWIpO1xuICAgICAgICAgICAgY2FzZSAnZ2V0X2NvbmZpZyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0UHJlZmVyZW5jZXNDb25maWcoYXJncy5jYXRlZ29yeSwgYXJncy5wYXRoLCBhcmdzLnNjb3BlKTtcbiAgICAgICAgICAgIGNhc2UgJ3NldF9jb25maWcnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNldFByZWZlcmVuY2VzQ29uZmlnKGFyZ3MuY2F0ZWdvcnksIGFyZ3MucGF0aCwgYXJncy52YWx1ZSwgYXJncy5zY29wZSk7XG4gICAgICAgICAgICBjYXNlICdyZXNldF9jb25maWcnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlc2V0UHJlZmVyZW5jZXNDb25maWcoYXJncy5jYXRlZ29yeSwgYXJncy5zY29wZSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYFVua25vd24gcHJlZmVyZW5jZXMgbWFuYWdlIGFjdGlvbjogJHthY3Rpb259YCB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBoYW5kbGVQcmVmZXJlbmNlc1F1ZXJ5KGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9hbGwnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldEFsbFByZWZlcmVuY2VzKGFyZ3Muc2NvcGUsIGFyZ3MuY2F0ZWdvcmllcyk7XG4gICAgICAgICAgICBjYXNlICdsaXN0X2NhdGVnb3JpZXMnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmxpc3RQcmVmZXJlbmNlc0NhdGVnb3JpZXMoKTtcbiAgICAgICAgICAgIGNhc2UgJ3NlYXJjaF9zZXR0aW5ncyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2VhcmNoUHJlZmVyZW5jZXNTZXR0aW5ncyhhcmdzLmtleXdvcmQsIGFyZ3MuaW5jbHVkZVZhbHVlcyk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYFVua25vd24gcHJlZmVyZW5jZXMgcXVlcnkgYWN0aW9uOiAke2FjdGlvbn1gIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGhhbmRsZVByZWZlcmVuY2VzQmFja3VwKGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2V4cG9ydCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhwb3J0UHJlZmVyZW5jZXMoYXJncy5jYXRlZ29yaWVzLCBhcmdzLnNjb3BlLCBhcmdzLmluY2x1ZGVEZWZhdWx0cyk7XG4gICAgICAgICAgICBjYXNlICd2YWxpZGF0ZV9iYWNrdXAnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnZhbGlkYXRlQmFja3VwRGF0YShhcmdzLmJhY2t1cERhdGEpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIHByZWZlcmVuY2VzIGJhY2t1cCBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEltcGxlbWVudGF0aW9uIG1ldGhvZHNcbiAgICBwcml2YXRlIGFzeW5jIG9wZW5QcmVmZXJlbmNlc1BhbmVsKHRhYj86IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0QXJncyA9IHRhYiA/IFt0YWJdIDogW107XG4gICAgICAgICAgICBhd2FpdCAoRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCBhcyBhbnkpKCdwcmVmZXJlbmNlcycsICdvcGVuLXNldHRpbmdzJywgLi4ucmVxdWVzdEFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDinIUgUHJlZmVyZW5jZXMgcGFuZWwgb3BlbmVkJHt0YWIgPyBgIG9uIFwiJHt0YWJ9XCIgdGFiYCA6ICcnfWAsXG4gICAgICAgICAgICAgICAgZGF0YTogeyB0YWI6IHRhYiB8fCAnZ2VuZXJhbCcgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYEZhaWxlZCB0byBvcGVuIHByZWZlcmVuY2VzIHBhbmVsOiAke2Vyci5tZXNzYWdlfWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0UHJlZmVyZW5jZXNDb25maWcoY2F0ZWdvcnk6IHN0cmluZywgcGF0aD86IHN0cmluZywgc2NvcGU6IHN0cmluZyA9ICdnbG9iYWwnKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgLy8gVmFsaWRhdGUgY2F0ZWdvcnkgcGFyYW1ldGVyXG4gICAgICAgIGlmICghY2F0ZWdvcnkgfHwgdHlwZW9mIGNhdGVnb3J5ICE9PSAnc3RyaW5nJyB8fCBjYXRlZ29yeS50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiAnQ2F0ZWdvcnkgaXMgcmVxdWlyZWQgYW5kIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyaW1tZWRDYXRlZ29yeSA9IGNhdGVnb3J5LnRyaW0oKTtcbiAgICAgICAgY29uc3QgcmVxdWVzdEFyZ3MgPSBbdHJpbW1lZENhdGVnb3J5XTtcbiAgICAgICAgaWYgKHBhdGggJiYgdHlwZW9mIHBhdGggPT09ICdzdHJpbmcnICYmIHBhdGgudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJlcXVlc3RBcmdzLnB1c2gocGF0aC50cmltKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBcmdzLnB1c2goc2NvcGUpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjb25maWcgPSBhd2FpdCAoRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCBhcyBhbnkpKCdwcmVmZXJlbmNlcycsICdxdWVyeS1jb25maWcnLCAuLi5yZXF1ZXN0QXJncyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBDb25maWd1cmF0aW9uIHJldHJpZXZlZCBmb3IgJHt0cmltbWVkQ2F0ZWdvcnl9JHtwYXRoID8gYC4ke3BhdGgudHJpbSgpfWAgOiAnJ31gLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHRyaW1tZWRDYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogcGF0aCA/IHBhdGgudHJpbSgpIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYEZhaWxlZCB0byBnZXQgcHJlZmVyZW5jZSBjb25maWc6ICR7ZXJyLm1lc3NhZ2V9YCB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZXRQcmVmZXJlbmNlc0NvbmZpZyhjYXRlZ29yeTogc3RyaW5nLCBwYXRoOiBzdHJpbmcsIHZhbHVlOiBhbnksIHNjb3BlOiBzdHJpbmcgPSAnZ2xvYmFsJyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIC8vIFZhbGlkYXRlIHJlcXVpcmVkIHBhcmFtZXRlcnNcbiAgICAgICAgaWYgKCFjYXRlZ29yeSB8fCB0eXBlb2YgY2F0ZWdvcnkgIT09ICdzdHJpbmcnIHx8IGNhdGVnb3J5LnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6ICdDYXRlZ29yeSBpcyByZXF1aXJlZCBhbmQgbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFwYXRoIHx8IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJyB8fCBwYXRoLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6ICdQYXRoIGlzIHJlcXVpcmVkIGFuZCBtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZydcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogJ1ZhbHVlIGlzIHJlcXVpcmVkIGFuZCBjYW5ub3QgYmUgdW5kZWZpbmVkJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyaW1tZWRDYXRlZ29yeSA9IGNhdGVnb3J5LnRyaW0oKTtcbiAgICAgICAgY29uc3QgdHJpbW1lZFBhdGggPSBwYXRoLnRyaW0oKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGF3YWl0IChFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0IGFzIGFueSkoJ3ByZWZlcmVuY2VzJywgJ3NldC1jb25maWcnLCB0cmltbWVkQ2F0ZWdvcnksIHRyaW1tZWRQYXRoLCB2YWx1ZSwgc2NvcGUpO1xuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIFByZWZlcmVuY2UgXCIke3RyaW1tZWRDYXRlZ29yeX0uJHt0cmltbWVkUGF0aH1cIiB1cGRhdGVkIHN1Y2Nlc3NmdWxseWAsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiB0cmltbWVkQ2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB0cmltbWVkUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byB1cGRhdGUgcHJlZmVyZW5jZSBcIiR7dHJpbW1lZENhdGVnb3J5fS4ke3RyaW1tZWRQYXRofVwiLiBWYWx1ZSBtYXkgYmUgaW52YWxpZCBvciByZWFkLW9ubHkuYFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBFcnJvciBzZXR0aW5nIHByZWZlcmVuY2U6ICR7ZXJyLm1lc3NhZ2V9YCB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyByZXNldFByZWZlcmVuY2VzQ29uZmlnKGNhdGVnb3J5OiBzdHJpbmcsIHNjb3BlOiBzdHJpbmcgPSAnZ2xvYmFsJyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIC8vIFZhbGlkYXRlIGNhdGVnb3J5IHBhcmFtZXRlclxuICAgICAgICBpZiAoIWNhdGVnb3J5IHx8IHR5cGVvZiBjYXRlZ29yeSAhPT0gJ3N0cmluZycgfHwgY2F0ZWdvcnkudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogJ0NhdGVnb3J5IGlzIHJlcXVpcmVkIGFuZCBtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZydcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cmltbWVkQ2F0ZWdvcnkgPSBjYXRlZ29yeS50cmltKCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIEdldCBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gZmlyc3RcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWcgPSBhd2FpdCAoRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCBhcyBhbnkpKCdwcmVmZXJlbmNlcycsICdxdWVyeS1jb25maWcnLCB0cmltbWVkQ2F0ZWdvcnksIHVuZGVmaW5lZCwgJ2RlZmF1bHQnKTtcbiAgICAgICAgICAgIGlmICghZGVmYXVsdENvbmZpZykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gZGVmYXVsdCBjb25maWd1cmF0aW9uIGZvdW5kIGZvciBjYXRlZ29yeSBcIiR7dHJpbW1lZENhdGVnb3J5fVwiYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBBcHBseSBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBhd2FpdCAoRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCBhcyBhbnkpKCdwcmVmZXJlbmNlcycsICdzZXQtY29uZmlnJywgdHJpbW1lZENhdGVnb3J5LCAnJywgZGVmYXVsdENvbmZpZywgc2NvcGUpO1xuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIFByZWZlcmVuY2UgY2F0ZWdvcnkgXCIke3RyaW1tZWRDYXRlZ29yeX1cIiByZXNldCB0byBkZWZhdWx0c2AsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiB0cmltbWVkQ2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3Jlc2V0J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBgRmFpbGVkIHRvIHJlc2V0IHByZWZlcmVuY2UgY2F0ZWdvcnkgXCIke3RyaW1tZWRDYXRlZ29yeX1cIi4gQ2F0ZWdvcnkgbWF5IG5vdCBzdXBwb3J0IHJlc2V0IG9wZXJhdGlvbi5gXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYEVycm9yIHJlc2V0dGluZyBwcmVmZXJlbmNlczogJHtlcnIubWVzc2FnZX1gIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGdldEFsbFByZWZlcmVuY2VzKHNjb3BlOiBzdHJpbmcgPSAnZ2xvYmFsJywgY2F0ZWdvcmllcz86IHN0cmluZ1tdKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgYXZhaWxhYmxlQ2F0ZWdvcmllcyA9IFtcbiAgICAgICAgICAgICdnZW5lcmFsJyxcbiAgICAgICAgICAgICdleHRlcm5hbC10b29scycsXG4gICAgICAgICAgICAnZGF0YS1lZGl0b3InLFxuICAgICAgICAgICAgJ2xhYm9yYXRvcnknLFxuICAgICAgICAgICAgJ2V4dGVuc2lvbnMnLFxuICAgICAgICAgICAgJ3ByZXZpZXcnLFxuICAgICAgICAgICAgJ2NvbnNvbGUnLFxuICAgICAgICAgICAgJ25hdGl2ZScsXG4gICAgICAgICAgICAnYnVpbGRlcidcbiAgICAgICAgXTtcblxuICAgICAgICAvLyBVc2Ugc3BlY2lmaWVkIGNhdGVnb3JpZXMgb3IgYWxsIGF2YWlsYWJsZSBvbmVzXG4gICAgICAgIGNvbnN0IGNhdGVnb3JpZXNUb1F1ZXJ5ID0gY2F0ZWdvcmllcyB8fCBhdmFpbGFibGVDYXRlZ29yaWVzO1xuICAgICAgICBjb25zdCBwcmVmZXJlbmNlczogYW55ID0ge307XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5UHJvbWlzZXMgPSBjYXRlZ29yaWVzVG9RdWVyeS5tYXAoY2F0ZWdvcnkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCBhcyBhbnkpKCdwcmVmZXJlbmNlcycsICdxdWVyeS1jb25maWcnLCBjYXRlZ29yeSwgdW5kZWZpbmVkLCBzY29wZSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGNvbmZpZzogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlc1tjYXRlZ29yeV0gPSBjb25maWc7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDYXRlZ29yeSBkb2Vzbid0IGV4aXN0IG9yIGFjY2VzcyBkZW5pZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZlcmVuY2VzW2NhdGVnb3J5XSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHF1ZXJ5UHJvbWlzZXMpO1xuXG4gICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IG51bGwgZW50cmllc1xuICAgICAgICAgICAgY29uc3QgdmFsaWRQcmVmZXJlbmNlcyA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhwcmVmZXJlbmNlcykuZmlsdGVyKChbXywgdmFsdWVdKSA9PiB2YWx1ZSAhPT0gbnVsbClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIFJldHJpZXZlZCBwcmVmZXJlbmNlcyBmb3IgJHtPYmplY3Qua2V5cyh2YWxpZFByZWZlcmVuY2VzKS5sZW5ndGh9IGNhdGVnb3JpZXNgLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RlZENhdGVnb3JpZXM6IGNhdGVnb3JpZXNUb1F1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVDYXRlZ29yaWVzOiBPYmplY3Qua2V5cyh2YWxpZFByZWZlcmVuY2VzKSxcbiAgICAgICAgICAgICAgICAgICAgcHJlZmVyZW5jZXM6IHZhbGlkUHJlZmVyZW5jZXMsXG4gICAgICAgICAgICAgICAgICAgIHN1bW1hcnk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsQ2F0ZWdvcmllczogT2JqZWN0LmtleXModmFsaWRQcmVmZXJlbmNlcykubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6IHNjb3BlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgRXJyb3IgcmV0cmlldmluZyBwcmVmZXJlbmNlczogJHtlcnIubWVzc2FnZX1gIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxpc3RQcmVmZXJlbmNlc0NhdGVnb3JpZXMoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgY2F0ZWdvcmllcyA9IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2dlbmVyYWwnLCBkZXNjcmlwdGlvbjogJ0dlbmVyYWwgZWRpdG9yIHNldHRpbmdzIGFuZCBVSSBwcmVmZXJlbmNlcycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2V4dGVybmFsLXRvb2xzJywgZGVzY3JpcHRpb246ICdFeHRlcm5hbCB0b29sIGludGVncmF0aW9ucyBhbmQgcGF0aHMnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdkYXRhLWVkaXRvcicsIGRlc2NyaXB0aW9uOiAnRGF0YSBlZGl0b3IgY29uZmlndXJhdGlvbnMgYW5kIHRlbXBsYXRlcycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2xhYm9yYXRvcnknLCBkZXNjcmlwdGlvbjogJ0V4cGVyaW1lbnRhbCBmZWF0dXJlcyBhbmQgYmV0YSBmdW5jdGlvbmFsaXR5JyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnZXh0ZW5zaW9ucycsIGRlc2NyaXB0aW9uOiAnRXh0ZW5zaW9uIG1hbmFnZXIgYW5kIHBsdWdpbiBzZXR0aW5ncycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3ByZXZpZXcnLCBkZXNjcmlwdGlvbjogJ0dhbWUgcHJldmlldyBhbmQgc2ltdWxhdG9yIHNldHRpbmdzJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnY29uc29sZScsIGRlc2NyaXB0aW9uOiAnQ29uc29sZSBwYW5lbCBkaXNwbGF5IGFuZCBsb2dnaW5nIG9wdGlvbnMnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICduYXRpdmUnLCBkZXNjcmlwdGlvbjogJ05hdGl2ZSBwbGF0Zm9ybSBidWlsZCBjb25maWd1cmF0aW9ucycgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2J1aWxkZXInLCBkZXNjcmlwdGlvbjogJ0J1aWxkIHN5c3RlbSBhbmQgY29tcGlsYXRpb24gc2V0dGluZ3MnIH1cbiAgICAgICAgXTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGDinIUgTGlzdGVkICR7Y2F0ZWdvcmllcy5sZW5ndGh9IGF2YWlsYWJsZSBwcmVmZXJlbmNlIGNhdGVnb3JpZXNgLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgdG90YWxDb3VudDogY2F0ZWdvcmllcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgdXNhZ2U6ICdVc2UgdGhlc2UgY2F0ZWdvcnkgbmFtZXMgd2l0aCBwcmVmZXJlbmNlc19tYW5hZ2Ugb3IgcHJlZmVyZW5jZXNfcXVlcnkgdG9vbHMnXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZWFyY2hQcmVmZXJlbmNlc1NldHRpbmdzKGtleXdvcmQ6IHN0cmluZywgaW5jbHVkZVZhbHVlczogYm9vbGVhbiA9IHRydWUpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gVmFsaWRhdGUga2V5d29yZCBwYXJhbWV0ZXJcbiAgICAgICAgICAgIGlmICgha2V5d29yZCB8fCB0eXBlb2Yga2V5d29yZCAhPT0gJ3N0cmluZycgfHwga2V5d29yZC50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAnU2VhcmNoIGtleXdvcmQgaXMgcmVxdWlyZWQgYW5kIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRyaW1tZWRLZXl3b3JkID0ga2V5d29yZC50cmltKCk7XG4gICAgICAgICAgICBjb25zdCBhbGxQcmVmc1Jlc3BvbnNlID0gYXdhaXQgdGhpcy5nZXRBbGxQcmVmZXJlbmNlcygnZ2xvYmFsJyk7XG4gICAgICAgICAgICBpZiAoIWFsbFByZWZzUmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbGxQcmVmc1Jlc3BvbnNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwcmVmZXJlbmNlcyA9IGFsbFByZWZzUmVzcG9uc2UuZGF0YT8ucHJlZmVyZW5jZXMgfHwge307XG4gICAgICAgICAgICBjb25zdCBzZWFyY2hSZXN1bHRzOiBhbnlbXSA9IFtdO1xuXG4gICAgICAgICAgICAvLyBTZWFyY2ggdGhyb3VnaCBhbGwgY2F0ZWdvcmllcyBhbmQgdGhlaXIgc2V0dGluZ3NcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2NhdGVnb3J5LCBjb25maWddIG9mIE9iamVjdC5lbnRyaWVzKHByZWZlcmVuY2VzKSkge1xuICAgICAgICAgICAgICAgIGlmIChjb25maWcgJiYgdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbk9iamVjdChjb25maWcgYXMgYW55LCB0cmltbWVkS2V5d29yZCwgY2F0ZWdvcnksICcnLCBzZWFyY2hSZXN1bHRzLCBpbmNsdWRlVmFsdWVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIEZvdW5kICR7c2VhcmNoUmVzdWx0cy5sZW5ndGh9IHNldHRpbmdzIG1hdGNoaW5nIFwiJHt0cmltbWVkS2V5d29yZH1cImAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXl3b3JkOiB0cmltbWVkS2V5d29yZCxcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVkZVZhbHVlcyxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Q291bnQ6IHNlYXJjaFJlc3VsdHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzOiBzZWFyY2hSZXN1bHRzLnNsaWNlKDAsIDUwKSwgLy8gTGltaXQgcmVzdWx0cyB0byBwcmV2ZW50IG92ZXJ3aGVsbWluZyBvdXRwdXRcbiAgICAgICAgICAgICAgICAgICAgaGFzTW9yZVJlc3VsdHM6IHNlYXJjaFJlc3VsdHMubGVuZ3RoID4gNTBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBgU2VhcmNoIGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNlYXJjaEluT2JqZWN0KG9iajogYW55LCBrZXl3b3JkOiBzdHJpbmcsIGNhdGVnb3J5OiBzdHJpbmcsIHBhdGhQcmVmaXg6IHN0cmluZywgcmVzdWx0czogYW55W10sIGluY2x1ZGVWYWx1ZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgIWtleXdvcmQgfHwgdHlwZW9mIGtleXdvcmQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsb3dlcktleXdvcmQgPSBrZXl3b3JkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqKSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykgY29udGludWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFBhdGggPSBwYXRoUHJlZml4ID8gYCR7cGF0aFByZWZpeH0uJHtrZXl9YCA6IGtleTtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlNYXRjaGVzID0ga2V5LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMobG93ZXJLZXl3b3JkKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZU1hdGNoZXMgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMobG93ZXJLZXl3b3JkKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoa2V5TWF0Y2hlcyB8fCB2YWx1ZU1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGN1cnJlbnRQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hUeXBlOiBrZXlNYXRjaGVzID8gKHZhbHVlTWF0Y2hlcyA/ICdib3RoJyA6ICdrZXknKSA6ICd2YWx1ZSdcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmNsdWRlVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC52YWx1ZVR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBSZWN1cnNpdmVseSBzZWFyY2ggbmVzdGVkIG9iamVjdHMgKHdpdGggZGVwdGggbGltaXQgdG8gcHJldmVudCBpbmZpbml0ZSByZWN1cnNpb24pXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIHBhdGhQcmVmaXguc3BsaXQoJy4nKS5sZW5ndGggPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaEluT2JqZWN0KHZhbHVlLCBrZXl3b3JkLCBjYXRlZ29yeSwgY3VycmVudFBhdGgsIHJlc3VsdHMsIGluY2x1ZGVWYWx1ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIFNraXAgb2JqZWN0cyB0aGF0IGNhbid0IGJlIGVudW1lcmF0ZWRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZXhwb3J0UHJlZmVyZW5jZXMoY2F0ZWdvcmllcz86IHN0cmluZ1tdLCBzY29wZTogc3RyaW5nID0gJ2dsb2JhbCcsIGluY2x1ZGVEZWZhdWx0czogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFZhbGlkYXRlIHNjb3BlIHBhcmFtZXRlclxuICAgICAgICAgICAgY29uc3QgdmFsaWRTY29wZXMgPSBbJ2dsb2JhbCcsICdsb2NhbCddO1xuICAgICAgICAgICAgaWYgKCF2YWxpZFNjb3Blcy5pbmNsdWRlcyhzY29wZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBJbnZhbGlkIHNjb3BlIFwiJHtzY29wZX1cIi4gTXVzdCBiZSBvbmUgb2Y6ICR7dmFsaWRTY29wZXMuam9pbignLCAnKX1gXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVmFsaWRhdGUgY2F0ZWdvcmllcyBwYXJhbWV0ZXIgaWYgcHJvdmlkZWRcbiAgICAgICAgICAgIGlmIChjYXRlZ29yaWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNhdGVnb3JpZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAnQ2F0ZWdvcmllcyBtdXN0IGJlIGFuIGFycmF5J1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkQ2F0ZWdvcmllcyA9IFsnZ2VuZXJhbCcsICdleHRlcm5hbC10b29scycsICdkYXRhLWVkaXRvcicsICdsYWJvcmF0b3J5JywgJ2V4dGVuc2lvbnMnLCAncHJldmlldycsICdjb25zb2xlJywgJ25hdGl2ZScsICdidWlsZGVyJ107XG4gICAgICAgICAgICAgICAgY29uc3QgaW52YWxpZENhdGVnb3JpZXMgPSBjYXRlZ29yaWVzLmZpbHRlcihjYXQgPT4gIXZhbGlkQ2F0ZWdvcmllcy5pbmNsdWRlcyhjYXQpKTtcbiAgICAgICAgICAgICAgICBpZiAoaW52YWxpZENhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogYEludmFsaWQgY2F0ZWdvcmllczogJHtpbnZhbGlkQ2F0ZWdvcmllcy5qb2luKCcsICcpfS4gVmFsaWQgY2F0ZWdvcmllcyBhcmU6ICR7dmFsaWRDYXRlZ29yaWVzLmpvaW4oJywgJyl9YFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYWxsUHJlZnNSZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0QWxsUHJlZmVyZW5jZXMoc2NvcGUsIGNhdGVnb3JpZXMpO1xuICAgICAgICAgICAgaWYgKCFhbGxQcmVmc1Jlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsUHJlZnNSZXNwb25zZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZXhwb3J0RGF0YTogYW55ID0ge1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydERhdGU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlRGVmYXVsdHM6IGluY2x1ZGVEZWZhdWx0cyxcbiAgICAgICAgICAgICAgICAgICAgY29jb3NWZXJzaW9uOiAoRWRpdG9yIGFzIGFueSkudmVyc2lvbnM/LmNvY29zIHx8ICdVbmtub3duJyxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0ZWRDYXRlZ29yaWVzOiBPYmplY3Qua2V5cyhhbGxQcmVmc1Jlc3BvbnNlLmRhdGE/LnByZWZlcmVuY2VzIHx8IHt9KSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdGVkQ2F0ZWdvcmllczogY2F0ZWdvcmllcyB8fCAnYWxsJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcHJlZmVyZW5jZXM6IGFsbFByZWZzUmVzcG9uc2UuZGF0YT8ucHJlZmVyZW5jZXMgfHwge31cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIEluY2x1ZGUgZGVmYXVsdHMgaWYgcmVxdWVzdGVkXG4gICAgICAgICAgICBpZiAoaW5jbHVkZURlZmF1bHRzKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdHNSZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0QWxsUHJlZmVyZW5jZXMoJ2RlZmF1bHQnLCBjYXRlZ29yaWVzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRzUmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0RGF0YS5kZWZhdWx0cyA9IGRlZmF1bHRzUmVzcG9uc2UuZGF0YT8ucHJlZmVyZW5jZXMgfHwge307XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBvcnREYXRhLm1ldGFkYXRhLmRlZmF1bHRzV2FybmluZyA9ICdDb3VsZCBub3QgcmV0cmlldmUgZGVmYXVsdCBwcmVmZXJlbmNlcyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBleHBvcnREYXRhLm1ldGFkYXRhLmRlZmF1bHRzV2FybmluZyA9ICdFcnJvciByZXRyaWV2aW5nIGRlZmF1bHQgcHJlZmVyZW5jZXMnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QganNvbkRhdGEgPSBKU09OLnN0cmluZ2lmeShleHBvcnREYXRhLCBudWxsLCAyKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cG9ydFBhdGggPSBgY29jb3NfcHJlZmVyZW5jZXNfJHtzY29wZX1fJHtEYXRlLm5vdygpfS5qc29uYDtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDinIUgUHJlZmVyZW5jZXMgZXhwb3J0ZWQgZm9yICR7ZXhwb3J0RGF0YS5tZXRhZGF0YS5leHBvcnRlZENhdGVnb3JpZXMubGVuZ3RofSBjYXRlZ29yaWVzYCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydFBhdGgsXG4gICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhOiBleHBvcnREYXRhLm1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlczogZXhwb3J0RGF0YS5wcmVmZXJlbmNlcyxcbiAgICAgICAgICAgICAgICAgICAganNvbkRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVTaXplOiBCdWZmZXIuYnl0ZUxlbmd0aChqc29uRGF0YSwgJ3V0ZjgnKSxcbiAgICAgICAgICAgICAgICAgICAgc3VtbWFyeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxDYXRlZ29yaWVzOiBleHBvcnREYXRhLm1ldGFkYXRhLmV4cG9ydGVkQ2F0ZWdvcmllcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZTogc2NvcGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlRGVmYXVsdHM6IGluY2x1ZGVEZWZhdWx0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0RlZmF1bHRzOiAhIWV4cG9ydERhdGEuZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGBFeHBvcnQgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgdmFsaWRhdGVCYWNrdXBEYXRhKGJhY2t1cERhdGE6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB2YWxpZGF0aW9uID0ge1xuICAgICAgICAgICAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgZXJyb3JzOiBbXSBhcyBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICB3YXJuaW5nczogW10gYXMgc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgbWV0YWRhdGE6IG51bGwgYXMgYW55XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBiYWNrdXBEYXRhIGlzIHByb3ZpZGVkXG4gICAgICAgICAgICBpZiAoYmFja3VwRGF0YSA9PT0gdW5kZWZpbmVkIHx8IGJhY2t1cERhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLmlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLmVycm9ycy5wdXNoKCdCYWNrdXAgZGF0YSBpcyByZXF1aXJlZCBhbmQgY2Fubm90IGJlIG51bGwgb3IgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAnQmFja3VwIGRhdGEgaXMgcmVxdWlyZWQgZm9yIHZhbGlkYXRpb24nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hlY2sgYmFzaWMgc3RydWN0dXJlXG4gICAgICAgICAgICBpZiAodHlwZW9mIGJhY2t1cERhdGEgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkoYmFja3VwRGF0YSkpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLmlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLmVycm9ycy5wdXNoKCdCYWNrdXAgZGF0YSBtdXN0IGJlIGEgdmFsaWQgb2JqZWN0IChub3QgYXJyYXkgb3IgcHJpbWl0aXZlIHR5cGUpJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGZvciBtZXRhZGF0YVxuICAgICAgICAgICAgICAgIGlmIChiYWNrdXBEYXRhLm1ldGFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYmFja3VwRGF0YS5tZXRhZGF0YSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24uZXJyb3JzLnB1c2goJ01ldGFkYXRhIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLmlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24ubWV0YWRhdGEgPSBiYWNrdXBEYXRhLm1ldGFkYXRhO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJhY2t1cERhdGEubWV0YWRhdGEuZXhwb3J0RGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24ud2FybmluZ3MucHVzaCgnTWlzc2luZyBleHBvcnQgZGF0ZSBpbiBtZXRhZGF0YScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYmFja3VwRGF0YS5tZXRhZGF0YS5leHBvcnREYXRlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24ud2FybmluZ3MucHVzaCgnRXhwb3J0IGRhdGUgc2hvdWxkIGJlIGEgc3RyaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYmFja3VwRGF0YS5tZXRhZGF0YS5zY29wZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24ud2FybmluZ3MucHVzaCgnTWlzc2luZyBzY29wZSBpbmZvcm1hdGlvbiBpbiBtZXRhZGF0YScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghWydnbG9iYWwnLCAnbG9jYWwnLCAnZGVmYXVsdCddLmluY2x1ZGVzKGJhY2t1cERhdGEubWV0YWRhdGEuc2NvcGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbi53YXJuaW5ncy5wdXNoKCdJbnZhbGlkIHNjb3BlIHZhbHVlIGluIG1ldGFkYXRhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYWNrdXBEYXRhLm1ldGFkYXRhLmNvY29zVmVyc2lvbiAmJiB0eXBlb2YgYmFja3VwRGF0YS5tZXRhZGF0YS5jb2Nvc1ZlcnNpb24gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbi53YXJuaW5ncy5wdXNoKCdDb2NvcyB2ZXJzaW9uIHNob3VsZCBiZSBhIHN0cmluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbi53YXJuaW5ncy5wdXNoKCdObyBtZXRhZGF0YSBmb3VuZCBpbiBiYWNrdXAgZmlsZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGZvciBwcmVmZXJlbmNlcyBkYXRhXG4gICAgICAgICAgICAgICAgaWYgKCFiYWNrdXBEYXRhLnByZWZlcmVuY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24uZXJyb3JzLnB1c2goJ05vIHByZWZlcmVuY2VzIGRhdGEgZm91bmQgaW4gYmFja3VwJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24uaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJhY2t1cERhdGEucHJlZmVyZW5jZXMgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkoYmFja3VwRGF0YS5wcmVmZXJlbmNlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbi5lcnJvcnMucHVzaCgnUHJlZmVyZW5jZXMgZGF0YSBtdXN0IGJlIGFuIG9iamVjdCAobm90IGFycmF5IG9yIHByaW1pdGl2ZSB0eXBlKScpO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLmlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCBjYXRlZ29yaWVzIGFuZCB2YWxpZGF0ZSBzdHJ1Y3R1cmVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlDb3VudCA9IE9iamVjdC5rZXlzKGJhY2t1cERhdGEucHJlZmVyZW5jZXMpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5Q291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24ud2FybmluZ3MucHVzaCgnQmFja3VwIGNvbnRhaW5zIG5vIHByZWZlcmVuY2UgY2F0ZWdvcmllcycpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVmFsaWRhdGUgY2F0ZWdvcnkgbmFtZXNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRDYXRlZ29yaWVzID0gWydnZW5lcmFsJywgJ2V4dGVybmFsLXRvb2xzJywgJ2RhdGEtZWRpdG9yJywgJ2xhYm9yYXRvcnknLCAnZXh0ZW5zaW9ucycsICdwcmV2aWV3JywgJ2NvbnNvbGUnLCAnbmF0aXZlJywgJ2J1aWxkZXInXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW52YWxpZENhdGVnb3JpZXMgPSBPYmplY3Qua2V5cyhiYWNrdXBEYXRhLnByZWZlcmVuY2VzKS5maWx0ZXIoY2F0ID0+ICF2YWxpZENhdGVnb3JpZXMuaW5jbHVkZXMoY2F0KSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnZhbGlkQ2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLndhcm5pbmdzLnB1c2goYFVua25vd24gY2F0ZWdvcmllcyBmb3VuZDogJHtpbnZhbGlkQ2F0ZWdvcmllcy5qb2luKCcsICcpfWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBCYWNrdXAgdmFsaWRhdGlvbiBjb21wbGV0ZWQ6ICR7dmFsaWRhdGlvbi5pc1ZhbGlkID8gJ1ZhbGlkJyA6ICdJbnZhbGlkJ31gLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZDogdmFsaWRhdGlvbi5pc1ZhbGlkLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcnM6IHZhbGlkYXRpb24uZXJyb3JzLFxuICAgICAgICAgICAgICAgICAgICB3YXJuaW5nczogdmFsaWRhdGlvbi53YXJuaW5ncyxcbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGE6IHZhbGlkYXRpb24ubWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHN1bW1hcnk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0Vycm9yczogdmFsaWRhdGlvbi5lcnJvcnMubGVuZ3RoID4gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmdzOiB2YWxpZGF0aW9uLndhcm5pbmdzLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeUNvdW50OiBiYWNrdXBEYXRhPy5wcmVmZXJlbmNlcyA/IE9iamVjdC5rZXlzKGJhY2t1cERhdGEucHJlZmVyZW5jZXMpLmxlbmd0aCA6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvdW50OiB2YWxpZGF0aW9uLmVycm9ycy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5nQ291bnQ6IHZhbGlkYXRpb24ud2FybmluZ3MubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBgVmFsaWRhdGlvbiBmYWlsZWQ6ICR7ZXJyb3IubWVzc2FnZX1gXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==