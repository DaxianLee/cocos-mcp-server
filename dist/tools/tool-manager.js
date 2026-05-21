"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolManager = void 0;
const uuid_1 = require("uuid");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ToolManager {
    constructor() {
        this.availableTools = [];
        this.settings = this.readToolManagerSettings();
        this.initializeAvailableTools();
        // If no configuration exists, create a default one automatically
        if (this.settings.configurations.length === 0) {
            console.log('[ToolManager] No configurations found, creating default configuration...');
            this.createConfiguration('Default Configuration', 'Default tool configuration created automatically');
        }
    }
    getToolManagerSettingsPath() {
        return path.join(Editor.Project.path, 'settings', 'tool-manager.json');
    }
    ensureSettingsDir() {
        const settingsDir = path.dirname(this.getToolManagerSettingsPath());
        if (!fs.existsSync(settingsDir)) {
            fs.mkdirSync(settingsDir, { recursive: true });
        }
    }
    readToolManagerSettings() {
        const DEFAULT_TOOL_MANAGER_SETTINGS = {
            configurations: [],
            currentConfigId: '',
            maxConfigSlots: 5
        };
        try {
            this.ensureSettingsDir();
            const settingsFile = this.getToolManagerSettingsPath();
            if (fs.existsSync(settingsFile)) {
                const content = fs.readFileSync(settingsFile, 'utf8');
                return Object.assign(Object.assign({}, DEFAULT_TOOL_MANAGER_SETTINGS), JSON.parse(content));
            }
        }
        catch (e) {
            console.error('Failed to read tool manager settings:', e);
        }
        return DEFAULT_TOOL_MANAGER_SETTINGS;
    }
    saveToolManagerSettings(settings) {
        try {
            this.ensureSettingsDir();
            const settingsFile = this.getToolManagerSettingsPath();
            fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
        }
        catch (e) {
            console.error('Failed to save tool manager settings:', e);
            throw e;
        }
    }
    exportToolConfiguration(config) {
        return JSON.stringify(config, null, 2);
    }
    importToolConfiguration(configJson) {
        try {
            const config = JSON.parse(configJson);
            // Validate configuration format
            if (!config.id || !config.name || !Array.isArray(config.tools)) {
                throw new Error('Invalid configuration format');
            }
            return config;
        }
        catch (e) {
            console.error('Failed to parse tool configuration:', e);
            throw new Error('Invalid JSON format or configuration structure');
        }
    }
    initializeAvailableTools() {
        // Get the actual tool list from the MCP server
        try {
            // Import all tool classes
            const { SceneTools } = require('./scene-tools');
            const { NodeTools } = require('./node-tools');
            const { ComponentTools } = require('./component-tools');
            const { PrefabTools } = require('./prefab-tools');
            const { ProjectTools } = require('./project-tools');
            const { DebugTools } = require('./debug-tools');
            const { PreferencesTools } = require('./preferences-tools');
            const { ServerTools } = require('./server-tools');
            const { BroadcastTools } = require('./broadcast-tools');
            const { SceneAdvancedTools } = require('./scene-advanced-tools');
            const { SceneViewTools } = require('./scene-view-tools');
            const { ReferenceImageTools } = require('./reference-image-tools');
            const { AssetAdvancedTools } = require('./asset-advanced-tools');
            const { ValidationTools } = require('./validation-tools');
            // Initialize tool instances
            const tools = {
                scene: new SceneTools(),
                node: new NodeTools(),
                component: new ComponentTools(),
                prefab: new PrefabTools(),
                project: new ProjectTools(),
                debug: new DebugTools(),
                preferences: new PreferencesTools(),
                server: new ServerTools(),
                broadcast: new BroadcastTools(),
                sceneAdvanced: new SceneAdvancedTools(),
                sceneView: new SceneViewTools(),
                referenceImage: new ReferenceImageTools(),
                assetAdvanced: new AssetAdvancedTools(),
                validation: new ValidationTools()
            };
            // Get the tool list from each tool class
            this.availableTools = [];
            for (const [category, toolSet] of Object.entries(tools)) {
                const toolDefinitions = toolSet.getTools();
                toolDefinitions.forEach((tool) => {
                    this.availableTools.push({
                        category: category,
                        name: tool.name,
                        enabled: true, // Enabled by default
                        description: tool.description
                    });
                });
            }
            console.log(`[ToolManager] Initialized ${this.availableTools.length} tools from MCP server`);
        }
        catch (error) {
            console.error('[ToolManager] Failed to initialize tools from MCP server:', error);
            // If fetching fails, use the default tool list as a fallback
            this.initializeDefaultTools();
        }
    }
    initializeDefaultTools() {
        // Default tool list as a fallback
        const toolCategories = [
            { category: 'scene', name: 'Scene Tools', tools: [
                    { name: 'getCurrentSceneInfo', description: 'Get current scene information' },
                    { name: 'getSceneHierarchy', description: 'Get scene hierarchy' },
                    { name: 'createNewScene', description: 'Create new scene' },
                    { name: 'saveScene', description: 'Save scene' },
                    { name: 'loadScene', description: 'Load scene' }
                ] },
            { category: 'node', name: 'Node Tools', tools: [
                    { name: 'getAllNodes', description: 'Get all nodes' },
                    { name: 'findNodeByName', description: 'Find node by name' },
                    { name: 'createNode', description: 'Create node' },
                    { name: 'deleteNode', description: 'Delete node' },
                    { name: 'setNodeProperty', description: 'Set node properties' },
                    { name: 'getNodeInfo', description: 'Get node information' }
                ] },
            { category: 'component', name: 'Component Tools', tools: [
                    { name: 'addComponentToNode', description: 'Add component to node' },
                    { name: 'removeComponentFromNode', description: 'Remove component from node' },
                    { name: 'setComponentProperty', description: 'Set component properties' },
                    { name: 'getComponentInfo', description: 'Get component information' }
                ] },
            { category: 'prefab', name: 'Prefab Tools', tools: [
                    { name: 'createPrefabFromNode', description: 'Create prefab from node' },
                    { name: 'instantiatePrefab', description: 'Instantiate prefab' },
                    { name: 'getPrefabInfo', description: 'Get prefab information' },
                    { name: 'savePrefab', description: 'Save prefab' }
                ] },
            { category: 'project', name: 'Project Tools', tools: [
                    { name: 'getProjectInfo', description: 'Get project information' },
                    { name: 'getAssetList', description: 'Get asset list' },
                    { name: 'createAsset', description: 'Create asset' },
                    { name: 'deleteAsset', description: 'Delete asset' }
                ] },
            { category: 'debug', name: 'Debug Tools', tools: [
                    { name: 'getConsoleLogs', description: 'Get console logs' },
                    { name: 'getPerformanceStats', description: 'Get performance statistics' },
                    { name: 'validateScene', description: 'Validate scene' },
                    { name: 'getErrorLogs', description: 'Get error logs' }
                ] },
            { category: 'preferences', name: 'Preferences Tools', tools: [
                    { name: 'getPreferences', description: 'Get preferences' },
                    { name: 'setPreferences', description: 'Set preferences' },
                    { name: 'resetPreferences', description: 'Reset preferences' }
                ] },
            { category: 'server', name: 'Server Tools', tools: [
                    { name: 'getServerStatus', description: 'Get server status' },
                    { name: 'getConnectedClients', description: 'Get connected clients' },
                    { name: 'getServerLogs', description: 'Get server logs' }
                ] },
            { category: 'broadcast', name: 'Broadcast Tools', tools: [
                    { name: 'broadcastMessage', description: 'Broadcast message' },
                    { name: 'getBroadcastHistory', description: 'Get broadcast history' }
                ] },
            { category: 'sceneAdvanced', name: 'Advanced Scene Tools', tools: [
                    { name: 'optimizeScene', description: 'Optimize scene' },
                    { name: 'analyzeScene', description: 'Analyze scene' },
                    { name: 'batchOperation', description: 'Batch operation' }
                ] },
            { category: 'sceneView', name: 'Scene View Tools', tools: [
                    { name: 'getViewportInfo', description: 'Get viewport information' },
                    { name: 'setViewportCamera', description: 'Set viewport camera' },
                    { name: 'focusOnNode', description: 'Focus on node' }
                ] },
            { category: 'referenceImage', name: 'Reference Image Tools', tools: [
                    { name: 'addReferenceImage', description: 'Add reference image' },
                    { name: 'removeReferenceImage', description: 'Remove reference image' },
                    { name: 'getReferenceImages', description: 'Get reference image list' }
                ] },
            { category: 'assetAdvanced', name: 'Advanced Asset Tools', tools: [
                    { name: 'importAsset', description: 'Import asset' },
                    { name: 'exportAsset', description: 'Export asset' },
                    { name: 'processAsset', description: 'Process asset' }
                ] },
            { category: 'validation', name: 'Validation Tools', tools: [
                    { name: 'validateProject', description: 'Validate project' },
                    { name: 'validateAssets', description: 'Validate assets' },
                    { name: 'generateReport', description: 'Generate report' }
                ] }
        ];
        this.availableTools = [];
        toolCategories.forEach(category => {
            category.tools.forEach(tool => {
                this.availableTools.push({
                    category: category.category,
                    name: tool.name,
                    enabled: true, // Enabled by default
                    description: tool.description
                });
            });
        });
        console.log(`[ToolManager] Initialized ${this.availableTools.length} default tools`);
    }
    getAvailableTools() {
        return [...this.availableTools];
    }
    getConfigurations() {
        return [...this.settings.configurations];
    }
    getCurrentConfiguration() {
        if (!this.settings.currentConfigId) {
            return null;
        }
        return this.settings.configurations.find(config => config.id === this.settings.currentConfigId) || null;
    }
    createConfiguration(name, description) {
        if (this.settings.configurations.length >= this.settings.maxConfigSlots) {
            throw new Error(`Maximum number of configuration slots reached (${this.settings.maxConfigSlots})`);
        }
        const config = {
            id: (0, uuid_1.v4)(),
            name,
            description,
            tools: this.availableTools.map(tool => (Object.assign({}, tool))),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.settings.configurations.push(config);
        this.settings.currentConfigId = config.id;
        this.saveSettings();
        return config;
    }
    updateConfiguration(configId, updates) {
        const configIndex = this.settings.configurations.findIndex(config => config.id === configId);
        if (configIndex === -1) {
            throw new Error('Configuration not found');
        }
        const config = this.settings.configurations[configIndex];
        const updatedConfig = Object.assign(Object.assign(Object.assign({}, config), updates), { updatedAt: new Date().toISOString() });
        this.settings.configurations[configIndex] = updatedConfig;
        this.saveSettings();
        return updatedConfig;
    }
    deleteConfiguration(configId) {
        const configIndex = this.settings.configurations.findIndex(config => config.id === configId);
        if (configIndex === -1) {
            throw new Error('Configuration not found');
        }
        this.settings.configurations.splice(configIndex, 1);
        // If the deleted configuration is the current one, clear the current configuration ID
        if (this.settings.currentConfigId === configId) {
            this.settings.currentConfigId = this.settings.configurations.length > 0
                ? this.settings.configurations[0].id
                : '';
        }
        this.saveSettings();
    }
    setCurrentConfiguration(configId) {
        const config = this.settings.configurations.find(config => config.id === configId);
        if (!config) {
            throw new Error('Configuration not found');
        }
        this.settings.currentConfigId = configId;
        this.saveSettings();
    }
    updateToolStatus(configId, category, toolName, enabled) {
        console.log(`Backend: Updating tool status - configId: ${configId}, category: ${category}, toolName: ${toolName}, enabled: ${enabled}`);
        const config = this.settings.configurations.find(config => config.id === configId);
        if (!config) {
            console.error(`Backend: Config not found with ID: ${configId}`);
            throw new Error('Configuration not found');
        }
        console.log(`Backend: Found config: ${config.name}`);
        const tool = config.tools.find(t => t.category === category && t.name === toolName);
        if (!tool) {
            console.error(`Backend: Tool not found - category: ${category}, name: ${toolName}`);
            throw new Error('Tool not found');
        }
        console.log(`Backend: Found tool: ${tool.name}, current enabled: ${tool.enabled}, new enabled: ${enabled}`);
        tool.enabled = enabled;
        config.updatedAt = new Date().toISOString();
        console.log(`Backend: Tool updated, saving settings...`);
        this.saveSettings();
        console.log(`Backend: Settings saved successfully`);
    }
    updateToolStatusBatch(configId, updates) {
        console.log(`Backend: updateToolStatusBatch called with configId: ${configId}`);
        console.log(`Backend: Current configurations count: ${this.settings.configurations.length}`);
        console.log(`Backend: Current config IDs:`, this.settings.configurations.map(c => c.id));
        const config = this.settings.configurations.find(config => config.id === configId);
        if (!config) {
            console.error(`Backend: Config not found with ID: ${configId}`);
            console.error(`Backend: Available config IDs:`, this.settings.configurations.map(c => c.id));
            throw new Error('Configuration not found');
        }
        console.log(`Backend: Found config: ${config.name}, updating ${updates.length} tools`);
        updates.forEach(update => {
            const tool = config.tools.find(t => t.category === update.category && t.name === update.name);
            if (tool) {
                tool.enabled = update.enabled;
            }
        });
        config.updatedAt = new Date().toISOString();
        this.saveSettings();
        console.log(`Backend: Batch update completed successfully`);
    }
    exportConfiguration(configId) {
        const config = this.settings.configurations.find(config => config.id === configId);
        if (!config) {
            throw new Error('Configuration not found');
        }
        return this.exportToolConfiguration(config);
    }
    importConfiguration(configJson) {
        const config = this.importToolConfiguration(configJson);
        // Generate a new ID and timestamps
        config.id = (0, uuid_1.v4)();
        config.createdAt = new Date().toISOString();
        config.updatedAt = new Date().toISOString();
        if (this.settings.configurations.length >= this.settings.maxConfigSlots) {
            throw new Error(`Maximum number of configuration slots reached (${this.settings.maxConfigSlots})`);
        }
        this.settings.configurations.push(config);
        this.saveSettings();
        return config;
    }
    getEnabledTools() {
        const currentConfig = this.getCurrentConfiguration();
        if (!currentConfig) {
            return this.availableTools.filter(tool => tool.enabled);
        }
        return currentConfig.tools.filter(tool => tool.enabled);
    }
    getToolManagerState() {
        const currentConfig = this.getCurrentConfiguration();
        return {
            success: true,
            availableTools: currentConfig ? currentConfig.tools : this.getAvailableTools(),
            selectedConfigId: this.settings.currentConfigId,
            configurations: this.getConfigurations(),
            maxConfigSlots: this.settings.maxConfigSlots
        };
    }
    saveSettings() {
        console.log(`Backend: Saving settings, current configs count: ${this.settings.configurations.length}`);
        this.saveToolManagerSettings(this.settings);
        console.log(`Backend: Settings saved to file`);
    }
}
exports.ToolManager = ToolManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbC1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL3Rvb2xzL3Rvb2wtbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBb0M7QUFFcEMsdUNBQXlCO0FBQ3pCLDJDQUE2QjtBQUU3QixNQUFhLFdBQVc7SUFJcEI7UUFGUSxtQkFBYyxHQUFpQixFQUFFLENBQUM7UUFHdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUVoQyxpRUFBaUU7UUFDakUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQywwRUFBMEUsQ0FBQyxDQUFDO1lBQ3hGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyx1QkFBdUIsRUFBRSxrREFBa0QsQ0FBQyxDQUFDO1FBQzFHLENBQUM7SUFDTCxDQUFDO0lBRU8sMEJBQTBCO1FBQzlCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRU8saUJBQWlCO1FBQ3JCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbkQsQ0FBQztJQUNMLENBQUM7SUFFTyx1QkFBdUI7UUFDM0IsTUFB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LE9BQU8sQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSxtQkFBbUI7UUFDdEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDckQsT0FBTztZQUNILE9BQU8sRUFBRSxJQUFJO1lBQ2IsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzlFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZTtZQUMvQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3hDLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWM7U0FDL0MsQ0FBQztJQUNOLENBQUM7SUFFTyxZQUFZO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0RBQW9ELElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdkcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztDQUNKO0FBbmFELGtDQW1hQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xyXG5pbXBvcnQgeyBUb29sQ29uZmlnLCBUb29sQ29uZmlndXJhdGlvbiwgVG9vbE1hbmFnZXJTZXR0aW5ncywgVG9vbERlZmluaXRpb24gfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUb29sTWFuYWdlciB7XHJcbiAgICBwcml2YXRlIHNldHRpbmdzOiBUb29sTWFuYWdlclNldHRpbmdzO1xyXG4gICAgcHJpdmF0ZSBhdmFpbGFibGVUb29sczogVG9vbENvbmZpZ1tdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHRoaXMucmVhZFRvb2xNYW5hZ2VyU2V0dGluZ3MoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVBdmFpbGFibGVUb29scygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIElmIG5vIGNvbmZpZ3VyYXRpb24gZXhpc3RzLCBjcmVhdGUgYSBkZWZhdWx0IG9uZSBhdXRvbWF0aWNhbGx5XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuY29uZmlndXJhdGlvbnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbVG9vbE1hbmFnZXJdIE5vIGNvbmZpZ3VyYXRpb25zIGZvdW5kLCBjcmVhdGluZyBkZWZhdWx0IGNvbmZpZ3VyYXRpb24uLi4nKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVDb25maWd1cmF0aW9uKCdEZWZhdWx0IENvbmZpZ3VyYXRpb24nLCAnRGVmYXVsdCB0b29sIGNvbmZpZ3VyYXRpb24gY3JlYXRlZCBhdXRvbWF0aWNhbGx5Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0VG9vbE1hbmFnZXJTZXR0aW5nc1BhdGgoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gcGF0aC5qb2luKEVkaXRvci5Qcm9qZWN0LnBhdGgsICdzZXR0aW5ncycsICd0b29sLW1hbmFnZXIuanNvbicpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZW5zdXJlU2V0dGluZ3NEaXIoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgc2V0dGluZ3NEaXIgPSBwYXRoLmRpcm5hbWUodGhpcy5nZXRUb29sTWFuYWdlclNldHRpbmdzUGF0aCgpKTtcclxuICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoc2V0dGluZ3NEaXIpKSB7XHJcbiAgICAgICAgICAgIGZzLm1rZGlyU3luYyhzZXR0aW5nc0RpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhZFRvb2xNYW5hZ2VyU2V0dGluZ3MoKTogVG9vbE1hbmFnZXJTZXR0aW5ncyB7XHJcbiAgICAgICAgY29uc3QgREVGQVVMVF9UT09MX01BTkFHRVJfU0VUVElOR1M6IFRvb2xNYW5hZ2VyU2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25zOiBbXSxcclxuICAgICAgICAgICAgY3VycmVudENvbmZpZ0lkOiAnJyxcclxuICAgICAgICAgICAgbWF4Q29uZmlnU2xvdHM6IDVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmVuc3VyZVNldHRpbmdzRGlyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzRmlsZSA9IHRoaXMuZ2V0VG9vbE1hbmFnZXJTZXR0aW5nc1BhdGgoKTtcclxuICAgICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoc2V0dGluZ3NGaWxlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhzZXR0aW5nc0ZpbGUsICd1dGY4Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5ERUZBVUxUX1RPT0xfTUFOQUdFUl9TRVRUSU5HUywgLi4uSlNPTi5wYXJzZShjb250ZW50KSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcmVhZCB0b29sIG1hbmFnZXIgc2V0dGluZ3M6JywgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBERUZBVUxUX1RPT0xfTUFOQUdFUl9TRVRUSU5HUztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNhdmVUb29sTWFuYWdlclNldHRpbmdzKHNldHRpbmdzOiBUb29sTWFuYWdlclNldHRpbmdzKTogdm9pZCB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5lbnN1cmVTZXR0aW5nc0RpcigpO1xyXG4gICAgICAgICAgICBjb25zdCBzZXR0aW5nc0ZpbGUgPSB0aGlzLmdldFRvb2xNYW5hZ2VyU2V0dGluZ3NQYXRoKCk7XHJcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoc2V0dGluZ3NGaWxlLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncywgbnVsbCwgMikpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNhdmUgdG9vbCBtYW5hZ2VyIHNldHRpbmdzOicsIGUpO1xyXG4gICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4cG9ydFRvb2xDb25maWd1cmF0aW9uKGNvbmZpZzogVG9vbENvbmZpZ3VyYXRpb24pOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShjb25maWcsIG51bGwsIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW1wb3J0VG9vbENvbmZpZ3VyYXRpb24oY29uZmlnSnNvbjogc3RyaW5nKTogVG9vbENvbmZpZ3VyYXRpb24ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IEpTT04ucGFyc2UoY29uZmlnSnNvbik7XHJcbiAgICAgICAgICAgIC8vIFZhbGlkYXRlIGNvbmZpZ3VyYXRpb24gZm9ybWF0XHJcbiAgICAgICAgICAgIGlmICghY29uZmlnLmlkIHx8ICFjb25maWcubmFtZSB8fCAhQXJyYXkuaXNBcnJheShjb25maWcudG9vbHMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29uZmlndXJhdGlvbiBmb3JtYXQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHBhcnNlIHRvb2wgY29uZmlndXJhdGlvbjonLCBlKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEpTT04gZm9ybWF0IG9yIGNvbmZpZ3VyYXRpb24gc3RydWN0dXJlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZUF2YWlsYWJsZVRvb2xzKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIEdldCB0aGUgYWN0dWFsIHRvb2wgbGlzdCBmcm9tIHRoZSBNQ1Agc2VydmVyXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gSW1wb3J0IGFsbCB0b29sIGNsYXNzZXNcclxuICAgICAgICAgICAgY29uc3QgeyBTY2VuZVRvb2xzIH0gPSByZXF1aXJlKCcuL3NjZW5lLXRvb2xzJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgTm9kZVRvb2xzIH0gPSByZXF1aXJlKCcuL25vZGUtdG9vbHMnKTtcclxuICAgICAgICAgICAgY29uc3QgeyBDb21wb25lbnRUb29scyB9ID0gcmVxdWlyZSgnLi9jb21wb25lbnQtdG9vbHMnKTtcclxuICAgICAgICAgICAgY29uc3QgeyBQcmVmYWJUb29scyB9ID0gcmVxdWlyZSgnLi9wcmVmYWItdG9vbHMnKTtcclxuICAgICAgICAgICAgY29uc3QgeyBQcm9qZWN0VG9vbHMgfSA9IHJlcXVpcmUoJy4vcHJvamVjdC10b29scycpO1xyXG4gICAgICAgICAgICBjb25zdCB7IERlYnVnVG9vbHMgfSA9IHJlcXVpcmUoJy4vZGVidWctdG9vbHMnKTtcclxuICAgICAgICAgICAgY29uc3QgeyBQcmVmZXJlbmNlc1Rvb2xzIH0gPSByZXF1aXJlKCcuL3ByZWZlcmVuY2VzLXRvb2xzJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgU2VydmVyVG9vbHMgfSA9IHJlcXVpcmUoJy4vc2VydmVyLXRvb2xzJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgQnJvYWRjYXN0VG9vbHMgfSA9IHJlcXVpcmUoJy4vYnJvYWRjYXN0LXRvb2xzJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgU2NlbmVBZHZhbmNlZFRvb2xzIH0gPSByZXF1aXJlKCcuL3NjZW5lLWFkdmFuY2VkLXRvb2xzJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgU2NlbmVWaWV3VG9vbHMgfSA9IHJlcXVpcmUoJy4vc2NlbmUtdmlldy10b29scycpO1xyXG4gICAgICAgICAgICBjb25zdCB7IFJlZmVyZW5jZUltYWdlVG9vbHMgfSA9IHJlcXVpcmUoJy4vcmVmZXJlbmNlLWltYWdlLXRvb2xzJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgQXNzZXRBZHZhbmNlZFRvb2xzIH0gPSByZXF1aXJlKCcuL2Fzc2V0LWFkdmFuY2VkLXRvb2xzJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgVmFsaWRhdGlvblRvb2xzIH0gPSByZXF1aXJlKCcuL3ZhbGlkYXRpb24tdG9vbHMnKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgdG9vbCBpbnN0YW5jZXNcclxuICAgICAgICAgICAgY29uc3QgdG9vbHMgPSB7XHJcbiAgICAgICAgICAgICAgICBzY2VuZTogbmV3IFNjZW5lVG9vbHMoKSxcclxuICAgICAgICAgICAgICAgIG5vZGU6IG5ldyBOb2RlVG9vbHMoKSxcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDogbmV3IENvbXBvbmVudFRvb2xzKCksXHJcbiAgICAgICAgICAgICAgICBwcmVmYWI6IG5ldyBQcmVmYWJUb29scygpLFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogbmV3IFByb2plY3RUb29scygpLFxyXG4gICAgICAgICAgICAgICAgZGVidWc6IG5ldyBEZWJ1Z1Rvb2xzKCksXHJcbiAgICAgICAgICAgICAgICBwcmVmZXJlbmNlczogbmV3IFByZWZlcmVuY2VzVG9vbHMoKSxcclxuICAgICAgICAgICAgICAgIHNlcnZlcjogbmV3IFNlcnZlclRvb2xzKCksXHJcbiAgICAgICAgICAgICAgICBicm9hZGNhc3Q6IG5ldyBCcm9hZGNhc3RUb29scygpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVBZHZhbmNlZDogbmV3IFNjZW5lQWR2YW5jZWRUb29scygpLFxyXG4gICAgICAgICAgICAgICAgc2NlbmVWaWV3OiBuZXcgU2NlbmVWaWV3VG9vbHMoKSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZUltYWdlOiBuZXcgUmVmZXJlbmNlSW1hZ2VUb29scygpLFxyXG4gICAgICAgICAgICAgICAgYXNzZXRBZHZhbmNlZDogbmV3IEFzc2V0QWR2YW5jZWRUb29scygpLFxyXG4gICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogbmV3IFZhbGlkYXRpb25Ub29scygpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHRvb2wgbGlzdCBmcm9tIGVhY2ggdG9vbCBjbGFzc1xyXG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVRvb2xzID0gW107XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2NhdGVnb3J5LCB0b29sU2V0XSBvZiBPYmplY3QuZW50cmllcyh0b29scykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvb2xEZWZpbml0aW9ucyA9IHRvb2xTZXQuZ2V0VG9vbHMoKTtcclxuICAgICAgICAgICAgICAgIHRvb2xEZWZpbml0aW9ucy5mb3JFYWNoKCh0b29sOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVRvb2xzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRvb2wubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSwgLy8gRW5hYmxlZCBieSBkZWZhdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0b29sLmRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFtUb29sTWFuYWdlcl0gSW5pdGlhbGl6ZWQgJHt0aGlzLmF2YWlsYWJsZVRvb2xzLmxlbmd0aH0gdG9vbHMgZnJvbSBNQ1Agc2VydmVyYCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Rvb2xNYW5hZ2VyXSBGYWlsZWQgdG8gaW5pdGlhbGl6ZSB0b29scyBmcm9tIE1DUCBzZXJ2ZXI6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAvLyBJZiBmZXRjaGluZyBmYWlscywgdXNlIHRoZSBkZWZhdWx0IHRvb2wgbGlzdCBhcyBhIGZhbGxiYWNrXHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZURlZmF1bHRUb29scygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRpYWxpemVEZWZhdWx0VG9vbHMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gRGVmYXVsdCB0b29sIGxpc3QgYXMgYSBmYWxsYmFja1xyXG4gICAgICAgIGNvbnN0IHRvb2xDYXRlZ29yaWVzID0gW1xyXG4gICAgICAgICAgICB7IGNhdGVnb3J5OiAnc2NlbmUnLCBuYW1lOiAnU2NlbmUgVG9vbHMnLCB0b29sczogW1xyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnZ2V0Q3VycmVudFNjZW5lSW5mbycsIGRlc2NyaXB0aW9uOiAnR2V0IGN1cnJlbnQgc2NlbmUgaW5mb3JtYXRpb24nIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdnZXRTY2VuZUhpZXJhcmNoeScsIGRlc2NyaXB0aW9uOiAnR2V0IHNjZW5lIGhpZXJhcmNoeScgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2NyZWF0ZU5ld1NjZW5lJywgZGVzY3JpcHRpb246ICdDcmVhdGUgbmV3IHNjZW5lJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnc2F2ZVNjZW5lJywgZGVzY3JpcHRpb246ICdTYXZlIHNjZW5lJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnbG9hZFNjZW5lJywgZGVzY3JpcHRpb246ICdMb2FkIHNjZW5lJyB9XHJcbiAgICAgICAgICAgIF19LFxyXG4gICAgICAgICAgICB7IGNhdGVnb3J5OiAnbm9kZScsIG5hbWU6ICdOb2RlIFRvb2xzJywgdG9vbHM6IFtcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2dldEFsbE5vZGVzJywgZGVzY3JpcHRpb246ICdHZXQgYWxsIG5vZGVzJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnZmluZE5vZGVCeU5hbWUnLCBkZXNjcmlwdGlvbjogJ0ZpbmQgbm9kZSBieSBuYW1lJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnY3JlYXRlTm9kZScsIGRlc2NyaXB0aW9uOiAnQ3JlYXRlIG5vZGUnIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdkZWxldGVOb2RlJywgZGVzY3JpcHRpb246ICdEZWxldGUgbm9kZScgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ3NldE5vZGVQcm9wZXJ0eScsIGRlc2NyaXB0aW9uOiAnU2V0IG5vZGUgcHJvcGVydGllcycgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2dldE5vZGVJbmZvJywgZGVzY3JpcHRpb246ICdHZXQgbm9kZSBpbmZvcm1hdGlvbicgfVxyXG4gICAgICAgICAgICBdfSxcclxuICAgICAgICAgICAgeyBjYXRlZ29yeTogJ2NvbXBvbmVudCcsIG5hbWU6ICdDb21wb25lbnQgVG9vbHMnLCB0b29sczogW1xyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYWRkQ29tcG9uZW50VG9Ob2RlJywgZGVzY3JpcHRpb246ICdBZGQgY29tcG9uZW50IHRvIG5vZGUnIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdyZW1vdmVDb21wb25lbnRGcm9tTm9kZScsIGRlc2NyaXB0aW9uOiAnUmVtb3ZlIGNvbXBvbmVudCBmcm9tIG5vZGUnIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdzZXRDb21wb25lbnRQcm9wZXJ0eScsIGRlc2NyaXB0aW9uOiAnU2V0IGNvbXBvbmVudCBwcm9wZXJ0aWVzJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnZ2V0Q29tcG9uZW50SW5mbycsIGRlc2NyaXB0aW9uOiAnR2V0IGNvbXBvbmVudCBpbmZvcm1hdGlvbicgfVxyXG4gICAgICAgICAgICBdfSxcclxuICAgICAgICAgICAgeyBjYXRlZ29yeTogJ3ByZWZhYicsIG5hbWU6ICdQcmVmYWIgVG9vbHMnLCB0b29sczogW1xyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnY3JlYXRlUHJlZmFiRnJvbU5vZGUnLCBkZXNjcmlwdGlvbjogJ0NyZWF0ZSBwcmVmYWIgZnJvbSBub2RlJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnaW5zdGFudGlhdGVQcmVmYWInLCBkZXNjcmlwdGlvbjogJ0luc3RhbnRpYXRlIHByZWZhYicgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2dldFByZWZhYkluZm8nLCBkZXNjcmlwdGlvbjogJ0dldCBwcmVmYWIgaW5mb3JtYXRpb24nIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdzYXZlUHJlZmFiJywgZGVzY3JpcHRpb246ICdTYXZlIHByZWZhYicgfVxyXG4gICAgICAgICAgICBdfSxcclxuICAgICAgICAgICAgeyBjYXRlZ29yeTogJ3Byb2plY3QnLCBuYW1lOiAnUHJvamVjdCBUb29scycsIHRvb2xzOiBbXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdnZXRQcm9qZWN0SW5mbycsIGRlc2NyaXB0aW9uOiAnR2V0IHByb2plY3QgaW5mb3JtYXRpb24nIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdnZXRBc3NldExpc3QnLCBkZXNjcmlwdGlvbjogJ0dldCBhc3NldCBsaXN0JyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnY3JlYXRlQXNzZXQnLCBkZXNjcmlwdGlvbjogJ0NyZWF0ZSBhc3NldCcgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2RlbGV0ZUFzc2V0JywgZGVzY3JpcHRpb246ICdEZWxldGUgYXNzZXQnIH1cclxuICAgICAgICAgICAgXX0sXHJcbiAgICAgICAgICAgIHsgY2F0ZWdvcnk6ICdkZWJ1ZycsIG5hbWU6ICdEZWJ1ZyBUb29scycsIHRvb2xzOiBbXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdnZXRDb25zb2xlTG9ncycsIGRlc2NyaXB0aW9uOiAnR2V0IGNvbnNvbGUgbG9ncycgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2dldFBlcmZvcm1hbmNlU3RhdHMnLCBkZXNjcmlwdGlvbjogJ0dldCBwZXJmb3JtYW5jZSBzdGF0aXN0aWNzJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAndmFsaWRhdGVTY2VuZScsIGRlc2NyaXB0aW9uOiAnVmFsaWRhdGUgc2NlbmUnIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdnZXRFcnJvckxvZ3MnLCBkZXNjcmlwdGlvbjogJ0dldCBlcnJvciBsb2dzJyB9XHJcbiAgICAgICAgICAgIF19LFxyXG4gICAgICAgICAgICB7IGNhdGVnb3J5OiAncHJlZmVyZW5jZXMnLCBuYW1lOiAnUHJlZmVyZW5jZXMgVG9vbHMnLCB0b29sczogW1xyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnZ2V0UHJlZmVyZW5jZXMnLCBkZXNjcmlwdGlvbjogJ0dldCBwcmVmZXJlbmNlcycgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ3NldFByZWZlcmVuY2VzJywgZGVzY3JpcHRpb246ICdTZXQgcHJlZmVyZW5jZXMnIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdyZXNldFByZWZlcmVuY2VzJywgZGVzY3JpcHRpb246ICdSZXNldCBwcmVmZXJlbmNlcycgfVxyXG4gICAgICAgICAgICBdfSxcclxuICAgICAgICAgICAgeyBjYXRlZ29yeTogJ3NlcnZlcicsIG5hbWU6ICdTZXJ2ZXIgVG9vbHMnLCB0b29sczogW1xyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnZ2V0U2VydmVyU3RhdHVzJywgZGVzY3JpcHRpb246ICdHZXQgc2VydmVyIHN0YXR1cycgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2dldENvbm5lY3RlZENsaWVudHMnLCBkZXNjcmlwdGlvbjogJ0dldCBjb25uZWN0ZWQgY2xpZW50cycgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2dldFNlcnZlckxvZ3MnLCBkZXNjcmlwdGlvbjogJ0dldCBzZXJ2ZXIgbG9ncycgfVxyXG4gICAgICAgICAgICBdfSxcclxuICAgICAgICAgICAgeyBjYXRlZ29yeTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICdCcm9hZGNhc3QgVG9vbHMnLCB0b29sczogW1xyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYnJvYWRjYXN0TWVzc2FnZScsIGRlc2NyaXB0aW9uOiAnQnJvYWRjYXN0IG1lc3NhZ2UnIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdnZXRCcm9hZGNhc3RIaXN0b3J5JywgZGVzY3JpcHRpb246ICdHZXQgYnJvYWRjYXN0IGhpc3RvcnknIH1cclxuICAgICAgICAgICAgXX0sXHJcbiAgICAgICAgICAgIHsgY2F0ZWdvcnk6ICdzY2VuZUFkdmFuY2VkJywgbmFtZTogJ0FkdmFuY2VkIFNjZW5lIFRvb2xzJywgdG9vbHM6IFtcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ29wdGltaXplU2NlbmUnLCBkZXNjcmlwdGlvbjogJ09wdGltaXplIHNjZW5lJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYW5hbHl6ZVNjZW5lJywgZGVzY3JpcHRpb246ICdBbmFseXplIHNjZW5lJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYmF0Y2hPcGVyYXRpb24nLCBkZXNjcmlwdGlvbjogJ0JhdGNoIG9wZXJhdGlvbicgfVxyXG4gICAgICAgICAgICBdfSxcclxuICAgICAgICAgICAgeyBjYXRlZ29yeTogJ3NjZW5lVmlldycsIG5hbWU6ICdTY2VuZSBWaWV3IFRvb2xzJywgdG9vbHM6IFtcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2dldFZpZXdwb3J0SW5mbycsIGRlc2NyaXB0aW9uOiAnR2V0IHZpZXdwb3J0IGluZm9ybWF0aW9uJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnc2V0Vmlld3BvcnRDYW1lcmEnLCBkZXNjcmlwdGlvbjogJ1NldCB2aWV3cG9ydCBjYW1lcmEnIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdmb2N1c09uTm9kZScsIGRlc2NyaXB0aW9uOiAnRm9jdXMgb24gbm9kZScgfVxyXG4gICAgICAgICAgICBdfSxcclxuICAgICAgICAgICAgeyBjYXRlZ29yeTogJ3JlZmVyZW5jZUltYWdlJywgbmFtZTogJ1JlZmVyZW5jZSBJbWFnZSBUb29scycsIHRvb2xzOiBbXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdhZGRSZWZlcmVuY2VJbWFnZScsIGRlc2NyaXB0aW9uOiAnQWRkIHJlZmVyZW5jZSBpbWFnZScgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ3JlbW92ZVJlZmVyZW5jZUltYWdlJywgZGVzY3JpcHRpb246ICdSZW1vdmUgcmVmZXJlbmNlIGltYWdlJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnZ2V0UmVmZXJlbmNlSW1hZ2VzJywgZGVzY3JpcHRpb246ICdHZXQgcmVmZXJlbmNlIGltYWdlIGxpc3QnIH1cclxuICAgICAgICAgICAgXX0sXHJcbiAgICAgICAgICAgIHsgY2F0ZWdvcnk6ICdhc3NldEFkdmFuY2VkJywgbmFtZTogJ0FkdmFuY2VkIEFzc2V0IFRvb2xzJywgdG9vbHM6IFtcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2ltcG9ydEFzc2V0JywgZGVzY3JpcHRpb246ICdJbXBvcnQgYXNzZXQnIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdleHBvcnRBc3NldCcsIGRlc2NyaXB0aW9uOiAnRXhwb3J0IGFzc2V0JyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAncHJvY2Vzc0Fzc2V0JywgZGVzY3JpcHRpb246ICdQcm9jZXNzIGFzc2V0JyB9XHJcbiAgICAgICAgICAgIF19LFxyXG4gICAgICAgICAgICB7IGNhdGVnb3J5OiAndmFsaWRhdGlvbicsIG5hbWU6ICdWYWxpZGF0aW9uIFRvb2xzJywgdG9vbHM6IFtcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ3ZhbGlkYXRlUHJvamVjdCcsIGRlc2NyaXB0aW9uOiAnVmFsaWRhdGUgcHJvamVjdCcgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ3ZhbGlkYXRlQXNzZXRzJywgZGVzY3JpcHRpb246ICdWYWxpZGF0ZSBhc3NldHMnIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdnZW5lcmF0ZVJlcG9ydCcsIGRlc2NyaXB0aW9uOiAnR2VuZXJhdGUgcmVwb3J0JyB9XHJcbiAgICAgICAgICAgIF19XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdGhpcy5hdmFpbGFibGVUb29scyA9IFtdO1xyXG4gICAgICAgIHRvb2xDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBjYXRlZ29yeS50b29scy5mb3JFYWNoKHRvb2wgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVUb29scy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnkuY2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdG9vbC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIEVuYWJsZWQgYnkgZGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0b29sLmRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbVG9vbE1hbmFnZXJdIEluaXRpYWxpemVkICR7dGhpcy5hdmFpbGFibGVUb29scy5sZW5ndGh9IGRlZmF1bHQgdG9vbHNgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QXZhaWxhYmxlVG9vbHMoKTogVG9vbENvbmZpZ1tdIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMuYXZhaWxhYmxlVG9vbHNdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb25maWd1cmF0aW9ucygpOiBUb29sQ29uZmlndXJhdGlvbltdIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMuc2V0dGluZ3MuY29uZmlndXJhdGlvbnNdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDdXJyZW50Q29uZmlndXJhdGlvbigpOiBUb29sQ29uZmlndXJhdGlvbiB8IG51bGwge1xyXG4gICAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5jdXJyZW50Q29uZmlnSWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmNvbmZpZ3VyYXRpb25zLmZpbmQoY29uZmlnID0+IGNvbmZpZy5pZCA9PT0gdGhpcy5zZXR0aW5ncy5jdXJyZW50Q29uZmlnSWQpIHx8IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUNvbmZpZ3VyYXRpb24obmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbj86IHN0cmluZyk6IFRvb2xDb25maWd1cmF0aW9uIHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5jb25maWd1cmF0aW9ucy5sZW5ndGggPj0gdGhpcy5zZXR0aW5ncy5tYXhDb25maWdTbG90cykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1heGltdW0gbnVtYmVyIG9mIGNvbmZpZ3VyYXRpb24gc2xvdHMgcmVhY2hlZCAoJHt0aGlzLnNldHRpbmdzLm1heENvbmZpZ1Nsb3RzfSlgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZzogVG9vbENvbmZpZ3VyYXRpb24gPSB7XHJcbiAgICAgICAgICAgIGlkOiB1dWlkdjQoKSxcclxuICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIHRvb2xzOiB0aGlzLmF2YWlsYWJsZVRvb2xzLm1hcCh0b29sID0+ICh7IC4uLnRvb2wgfSkpLFxyXG4gICAgICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldHRpbmdzLmNvbmZpZ3VyYXRpb25zLnB1c2goY29uZmlnKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdzLmN1cnJlbnRDb25maWdJZCA9IGNvbmZpZy5pZDtcclxuICAgICAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVDb25maWd1cmF0aW9uKGNvbmZpZ0lkOiBzdHJpbmcsIHVwZGF0ZXM6IFBhcnRpYWw8VG9vbENvbmZpZ3VyYXRpb24+KTogVG9vbENvbmZpZ3VyYXRpb24ge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZ0luZGV4ID0gdGhpcy5zZXR0aW5ncy5jb25maWd1cmF0aW9ucy5maW5kSW5kZXgoY29uZmlnID0+IGNvbmZpZy5pZCA9PT0gY29uZmlnSWQpO1xyXG4gICAgICAgIGlmIChjb25maWdJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb25maWd1cmF0aW9uIG5vdCBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5zZXR0aW5ncy5jb25maWd1cmF0aW9uc1tjb25maWdJbmRleF07XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZENvbmZpZzogVG9vbENvbmZpZ3VyYXRpb24gPSB7XHJcbiAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgLi4udXBkYXRlcyxcclxuICAgICAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldHRpbmdzLmNvbmZpZ3VyYXRpb25zW2NvbmZpZ0luZGV4XSA9IHVwZGF0ZWRDb25maWc7XHJcbiAgICAgICAgdGhpcy5zYXZlU2V0dGluZ3MoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHVwZGF0ZWRDb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZUNvbmZpZ3VyYXRpb24oY29uZmlnSWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZ0luZGV4ID0gdGhpcy5zZXR0aW5ncy5jb25maWd1cmF0aW9ucy5maW5kSW5kZXgoY29uZmlnID0+IGNvbmZpZy5pZCA9PT0gY29uZmlnSWQpO1xyXG4gICAgICAgIGlmIChjb25maWdJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb25maWd1cmF0aW9uIG5vdCBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5jb25maWd1cmF0aW9ucy5zcGxpY2UoY29uZmlnSW5kZXgsIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIElmIHRoZSBkZWxldGVkIGNvbmZpZ3VyYXRpb24gaXMgdGhlIGN1cnJlbnQgb25lLCBjbGVhciB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIElEXHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuY3VycmVudENvbmZpZ0lkID09PSBjb25maWdJZCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLmN1cnJlbnRDb25maWdJZCA9IHRoaXMuc2V0dGluZ3MuY29uZmlndXJhdGlvbnMubGVuZ3RoID4gMCBcclxuICAgICAgICAgICAgICAgID8gdGhpcy5zZXR0aW5ncy5jb25maWd1cmF0aW9uc1swXS5pZCBcclxuICAgICAgICAgICAgICAgIDogJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDdXJyZW50Q29uZmlndXJhdGlvbihjb25maWdJZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5zZXR0aW5ncy5jb25maWd1cmF0aW9ucy5maW5kKGNvbmZpZyA9PiBjb25maWcuaWQgPT09IGNvbmZpZ0lkKTtcclxuICAgICAgICBpZiAoIWNvbmZpZykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbmZpZ3VyYXRpb24gbm90IGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldHRpbmdzLmN1cnJlbnRDb25maWdJZCA9IGNvbmZpZ0lkO1xyXG4gICAgICAgIHRoaXMuc2F2ZVNldHRpbmdzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVRvb2xTdGF0dXMoY29uZmlnSWQ6IHN0cmluZywgY2F0ZWdvcnk6IHN0cmluZywgdG9vbE5hbWU6IHN0cmluZywgZW5hYmxlZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBCYWNrZW5kOiBVcGRhdGluZyB0b29sIHN0YXR1cyAtIGNvbmZpZ0lkOiAke2NvbmZpZ0lkfSwgY2F0ZWdvcnk6ICR7Y2F0ZWdvcnl9LCB0b29sTmFtZTogJHt0b29sTmFtZX0sIGVuYWJsZWQ6ICR7ZW5hYmxlZH1gKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLnNldHRpbmdzLmNvbmZpZ3VyYXRpb25zLmZpbmQoY29uZmlnID0+IGNvbmZpZy5pZCA9PT0gY29uZmlnSWQpO1xyXG4gICAgICAgIGlmICghY29uZmlnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEJhY2tlbmQ6IENvbmZpZyBub3QgZm91bmQgd2l0aCBJRDogJHtjb25maWdJZH1gKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb25maWd1cmF0aW9uIG5vdCBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYEJhY2tlbmQ6IEZvdW5kIGNvbmZpZzogJHtjb25maWcubmFtZX1gKTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9vbCA9IGNvbmZpZy50b29scy5maW5kKHQgPT4gdC5jYXRlZ29yeSA9PT0gY2F0ZWdvcnkgJiYgdC5uYW1lID09PSB0b29sTmFtZSk7XHJcbiAgICAgICAgaWYgKCF0b29sKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEJhY2tlbmQ6IFRvb2wgbm90IGZvdW5kIC0gY2F0ZWdvcnk6ICR7Y2F0ZWdvcnl9LCBuYW1lOiAke3Rvb2xOYW1lfWApO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Rvb2wgbm90IGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgQmFja2VuZDogRm91bmQgdG9vbDogJHt0b29sLm5hbWV9LCBjdXJyZW50IGVuYWJsZWQ6ICR7dG9vbC5lbmFibGVkfSwgbmV3IGVuYWJsZWQ6ICR7ZW5hYmxlZH1gKTtcclxuICAgICAgICBcclxuICAgICAgICB0b29sLmVuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgICAgIGNvbmZpZy51cGRhdGVkQXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coYEJhY2tlbmQ6IFRvb2wgdXBkYXRlZCwgc2F2aW5nIHNldHRpbmdzLi4uYCk7XHJcbiAgICAgICAgdGhpcy5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgQmFja2VuZDogU2V0dGluZ3Mgc2F2ZWQgc3VjY2Vzc2Z1bGx5YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVRvb2xTdGF0dXNCYXRjaChjb25maWdJZDogc3RyaW5nLCB1cGRhdGVzOiB7IGNhdGVnb3J5OiBzdHJpbmc7IG5hbWU6IHN0cmluZzsgZW5hYmxlZDogYm9vbGVhbiB9W10pOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgQmFja2VuZDogdXBkYXRlVG9vbFN0YXR1c0JhdGNoIGNhbGxlZCB3aXRoIGNvbmZpZ0lkOiAke2NvbmZpZ0lkfWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBCYWNrZW5kOiBDdXJyZW50IGNvbmZpZ3VyYXRpb25zIGNvdW50OiAke3RoaXMuc2V0dGluZ3MuY29uZmlndXJhdGlvbnMubGVuZ3RofWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBCYWNrZW5kOiBDdXJyZW50IGNvbmZpZyBJRHM6YCwgdGhpcy5zZXR0aW5ncy5jb25maWd1cmF0aW9ucy5tYXAoYyA9PiBjLmlkKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5zZXR0aW5ncy5jb25maWd1cmF0aW9ucy5maW5kKGNvbmZpZyA9PiBjb25maWcuaWQgPT09IGNvbmZpZ0lkKTtcclxuICAgICAgICBpZiAoIWNvbmZpZykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBCYWNrZW5kOiBDb25maWcgbm90IGZvdW5kIHdpdGggSUQ6ICR7Y29uZmlnSWR9YCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEJhY2tlbmQ6IEF2YWlsYWJsZSBjb25maWcgSURzOmAsIHRoaXMuc2V0dGluZ3MuY29uZmlndXJhdGlvbnMubWFwKGMgPT4gYy5pZCkpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbmZpZ3VyYXRpb24gbm90IGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgQmFja2VuZDogRm91bmQgY29uZmlnOiAke2NvbmZpZy5uYW1lfSwgdXBkYXRpbmcgJHt1cGRhdGVzLmxlbmd0aH0gdG9vbHNgKTtcclxuXHJcbiAgICAgICAgdXBkYXRlcy5mb3JFYWNoKHVwZGF0ZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvb2wgPSBjb25maWcudG9vbHMuZmluZCh0ID0+IHQuY2F0ZWdvcnkgPT09IHVwZGF0ZS5jYXRlZ29yeSAmJiB0Lm5hbWUgPT09IHVwZGF0ZS5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKHRvb2wpIHtcclxuICAgICAgICAgICAgICAgIHRvb2wuZW5hYmxlZCA9IHVwZGF0ZS5lbmFibGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbmZpZy51cGRhdGVkQXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgQmFja2VuZDogQmF0Y2ggdXBkYXRlIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHlgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXhwb3J0Q29uZmlndXJhdGlvbihjb25maWdJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLnNldHRpbmdzLmNvbmZpZ3VyYXRpb25zLmZpbmQoY29uZmlnID0+IGNvbmZpZy5pZCA9PT0gY29uZmlnSWQpO1xyXG4gICAgICAgIGlmICghY29uZmlnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29uZmlndXJhdGlvbiBub3QgZm91bmQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmV4cG9ydFRvb2xDb25maWd1cmF0aW9uKGNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGltcG9ydENvbmZpZ3VyYXRpb24oY29uZmlnSnNvbjogc3RyaW5nKTogVG9vbENvbmZpZ3VyYXRpb24ge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuaW1wb3J0VG9vbENvbmZpZ3VyYXRpb24oY29uZmlnSnNvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gR2VuZXJhdGUgYSBuZXcgSUQgYW5kIHRpbWVzdGFtcHNcclxuICAgICAgICBjb25maWcuaWQgPSB1dWlkdjQoKTtcclxuICAgICAgICBjb25maWcuY3JlYXRlZEF0ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xyXG4gICAgICAgIGNvbmZpZy51cGRhdGVkQXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmNvbmZpZ3VyYXRpb25zLmxlbmd0aCA+PSB0aGlzLnNldHRpbmdzLm1heENvbmZpZ1Nsb3RzKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTWF4aW11bSBudW1iZXIgb2YgY29uZmlndXJhdGlvbiBzbG90cyByZWFjaGVkICgke3RoaXMuc2V0dGluZ3MubWF4Q29uZmlnU2xvdHN9KWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5jb25maWd1cmF0aW9ucy5wdXNoKGNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5zYXZlU2V0dGluZ3MoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RW5hYmxlZFRvb2xzKCk6IFRvb2xDb25maWdbXSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudENvbmZpZyA9IHRoaXMuZ2V0Q3VycmVudENvbmZpZ3VyYXRpb24oKTtcclxuICAgICAgICBpZiAoIWN1cnJlbnRDb25maWcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXZhaWxhYmxlVG9vbHMuZmlsdGVyKHRvb2wgPT4gdG9vbC5lbmFibGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRDb25maWcudG9vbHMuZmlsdGVyKHRvb2wgPT4gdG9vbC5lbmFibGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VG9vbE1hbmFnZXJTdGF0ZSgpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50Q29uZmlnID0gdGhpcy5nZXRDdXJyZW50Q29uZmlndXJhdGlvbigpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgIGF2YWlsYWJsZVRvb2xzOiBjdXJyZW50Q29uZmlnID8gY3VycmVudENvbmZpZy50b29scyA6IHRoaXMuZ2V0QXZhaWxhYmxlVG9vbHMoKSxcclxuICAgICAgICAgICAgc2VsZWN0ZWRDb25maWdJZDogdGhpcy5zZXR0aW5ncy5jdXJyZW50Q29uZmlnSWQsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25zOiB0aGlzLmdldENvbmZpZ3VyYXRpb25zKCksXHJcbiAgICAgICAgICAgIG1heENvbmZpZ1Nsb3RzOiB0aGlzLnNldHRpbmdzLm1heENvbmZpZ1Nsb3RzXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNhdmVTZXR0aW5ncygpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgQmFja2VuZDogU2F2aW5nIHNldHRpbmdzLCBjdXJyZW50IGNvbmZpZ3MgY291bnQ6ICR7dGhpcy5zZXR0aW5ncy5jb25maWd1cmF0aW9ucy5sZW5ndGh9YCk7XHJcbiAgICAgICAgdGhpcy5zYXZlVG9vbE1hbmFnZXJTZXR0aW5ncyh0aGlzLnNldHRpbmdzKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgQmFja2VuZDogU2V0dGluZ3Mgc2F2ZWQgdG8gZmlsZWApO1xyXG4gICAgfVxyXG59ICJdfQ==