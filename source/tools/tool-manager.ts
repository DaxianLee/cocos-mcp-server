import { v4 as uuidv4 } from 'uuid';
import { ToolConfig, ToolConfiguration, ToolManagerSettings, ToolDefinition } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class ToolManager {
    private settings: ToolManagerSettings;
    private availableTools: ToolConfig[] = [];

    constructor() {
        this.settings = this.readToolManagerSettings();
        this.initializeAvailableTools();
        
        // 如果没有配置，自动创建一个默认配置
        if (this.settings.configurations.length === 0) {
            console.log('[ToolManager] No configurations found, creating default configuration...');
            this.createConfiguration('默认配置', '自动创建的默认工具配置');
        }
    }

    private getToolManagerSettingsPath(): string {
        return path.join(Editor.Project.path, 'settings', 'tool-manager.json');
    }

    private ensureSettingsDir(): void {
        const settingsDir = path.dirname(this.getToolManagerSettingsPath());
        if (!fs.existsSync(settingsDir)) {
            fs.mkdirSync(settingsDir, { recursive: true });
        }
    }

    private readToolManagerSettings(): ToolManagerSettings {
        const DEFAULT_TOOL_MANAGER_SETTINGS: ToolManagerSettings = {
            configurations: [],
            currentConfigId: '',
            maxConfigSlots: 5
        };

        try {
            this.ensureSettingsDir();
            const settingsFile = this.getToolManagerSettingsPath();
            if (fs.existsSync(settingsFile)) {
                const content = fs.readFileSync(settingsFile, 'utf8');
                return { ...DEFAULT_TOOL_MANAGER_SETTINGS, ...JSON.parse(content) };
            }
        } catch (e) {
            console.error('Failed to read tool manager settings:', e);
        }
        return DEFAULT_TOOL_MANAGER_SETTINGS;
    }

    private saveToolManagerSettings(settings: ToolManagerSettings): void {
        try {
            this.ensureSettingsDir();
            const settingsFile = this.getToolManagerSettingsPath();
            fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
        } catch (e) {
            console.error('Failed to save tool manager settings:', e);
            throw e;
        }
    }

    private exportToolConfiguration(config: ToolConfiguration): string {
        return JSON.stringify(config, null, 2);
    }

    private importToolConfiguration(configJson: string): ToolConfiguration {
        try {
            const config = JSON.parse(configJson);
            // 验证配置格式
            if (!config.id || !config.name || !Array.isArray(config.tools)) {
                throw new Error('Invalid configuration format');
            }
            return config;
        } catch (e) {
            console.error('Failed to parse tool configuration:', e);
            throw new Error('Invalid JSON format or configuration structure');
        }
    }

    private initializeAvailableTools(): void {
        // 从MCP服务器获取真实的工具列表
        try {
            // 导入所有工具类
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

            // 初始化工具实例
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

            // 从每个工具类获取工具列表
            this.availableTools = [];
            for (const [category, toolSet] of Object.entries(tools)) {
                const toolDefinitions = toolSet.getTools();
                toolDefinitions.forEach((tool: any) => {
                    this.availableTools.push({
                        category: category,
                        name: tool.name,
                        enabled: true, // 默认启用
                        description: tool.description
                    });
                });
            }

            console.log(`[ToolManager] Initialized ${this.availableTools.length} tools from MCP server`);
        } catch (error) {
            console.error('[ToolManager] Failed to initialize tools from MCP server:', error);
            // 如果获取失败，使用默认工具列表作为后备
            this.initializeDefaultTools();
        }
    }

    private initializeDefaultTools(): void {
        // 默认工具列表作为后备方案
        const toolCategories = [
            { category: 'scene', name: '场景工具', tools: [
                { name: 'getCurrentSceneInfo', description: '获取当前场景信息' },
                { name: 'getSceneHierarchy', description: '获取场景层级结构' },
                { name: 'createNewScene', description: '创建新场景' },
                { name: 'saveScene', description: '保存场景' },
                { name: 'loadScene', description: '加载场景' }
            ]},
            { category: 'node', name: '节点工具', tools: [
                { name: 'getAllNodes', description: '获取所有节点' },
                { name: 'findNodeByName', description: '根据名称查找节点' },
                { name: 'createNode', description: '创建节点' },
                { name: 'deleteNode', description: '删除节点' },
                { name: 'setNodeProperty', description: '设置节点属性' },
                { name: 'getNodeInfo', description: '获取节点信息' }
            ]},
            { category: 'component', name: '组件工具', tools: [
                { name: 'addComponentToNode', description: '添加组件到节点' },
                { name: 'removeComponentFromNode', description: '从节点移除组件' },
                { name: 'setComponentProperty', description: '设置组件属性' },
                { name: 'getComponentInfo', description: '获取组件信息' }
            ]},
            { category: 'prefab', name: '预制体工具', tools: [
                { name: 'createPrefabFromNode', description: '从节点创建预制体' },
                { name: 'instantiatePrefab', description: '实例化预制体' },
                { name: 'getPrefabInfo', description: '获取预制体信息' },
                { name: 'savePrefab', description: '保存预制体' }
            ]},
            { category: 'project', name: '项目工具', tools: [
                { name: 'getProjectInfo', description: '获取项目信息' },
                { name: 'getAssetList', description: '获取资源列表' },
                { name: 'createAsset', description: '创建资源' },
                { name: 'deleteAsset', description: '删除资源' }
            ]},
            { category: 'debug', name: '调试工具', tools: [
                { name: 'getConsoleLogs', description: '获取控制台日志' },
                { name: 'getPerformanceStats', description: '获取性能统计' },
                { name: 'validateScene', description: '验证场景' },
                { name: 'getErrorLogs', description: '获取错误日志' }
            ]},
            { category: 'preferences', name: '偏好设置工具', tools: [
                { name: 'getPreferences', description: '获取偏好设置' },
                { name: 'setPreferences', description: '设置偏好设置' },
                { name: 'resetPreferences', description: '重置偏好设置' }
            ]},
            { category: 'server', name: '服务器工具', tools: [
                { name: 'getServerStatus', description: '获取服务器状态' },
                { name: 'getConnectedClients', description: '获取连接的客户端' },
                { name: 'getServerLogs', description: '获取服务器日志' }
            ]},
            { category: 'broadcast', name: '广播工具', tools: [
                { name: 'broadcastMessage', description: '广播消息' },
                { name: 'getBroadcastHistory', description: '获取广播历史' }
            ]},
            { category: 'sceneAdvanced', name: '高级场景工具', tools: [
                { name: 'optimizeScene', description: '优化场景' },
                { name: 'analyzeScene', description: '分析场景' },
                { name: 'batchOperation', description: '批量操作' }
            ]},
            { category: 'sceneView', name: '场景视图工具', tools: [
                { name: 'getViewportInfo', description: '获取视口信息' },
                { name: 'setViewportCamera', description: '设置视口相机' },
                { name: 'focusOnNode', description: '聚焦到节点' }
            ]},
            { category: 'referenceImage', name: '参考图片工具', tools: [
                { name: 'addReferenceImage', description: '添加参考图片' },
                { name: 'removeReferenceImage', description: '移除参考图片' },
                { name: 'getReferenceImages', description: '获取参考图片列表' }
            ]},
            { category: 'assetAdvanced', name: '高级资源工具', tools: [
                { name: 'importAsset', description: '导入资源' },
                { name: 'exportAsset', description: '导出资源' },
                { name: 'processAsset', description: '处理资源' }
            ]},
            { category: 'validation', name: '验证工具', tools: [
                { name: 'validateProject', description: '验证项目' },
                { name: 'validateAssets', description: '验证资源' },
                { name: 'generateReport', description: '生成报告' }
            ]}
        ];

        this.availableTools = [];
        toolCategories.forEach(category => {
            category.tools.forEach(tool => {
                this.availableTools.push({
                    category: category.category,
                    name: tool.name,
                    enabled: true, // 默认启用
                    description: tool.description
                });
            });
        });

        console.log(`[ToolManager] Initialized ${this.availableTools.length} default tools`);
    }

    public getAvailableTools(): ToolConfig[] {
        return [...this.availableTools];
    }

    public getConfigurations(): ToolConfiguration[] {
        return [...this.settings.configurations];
    }

    public getCurrentConfiguration(): ToolConfiguration | null {
        if (!this.settings.currentConfigId) {
            return null;
        }
        return this.settings.configurations.find(config => config.id === this.settings.currentConfigId) || null;
    }

    public createConfiguration(name: string, description?: string): ToolConfiguration {
        if (this.settings.configurations.length >= this.settings.maxConfigSlots) {
            throw new Error(`已达到最大配置槽位数量 (${this.settings.maxConfigSlots})`);
        }

        const config: ToolConfiguration = {
            id: uuidv4(),
            name,
            description,
            tools: this.availableTools.map(tool => ({ ...tool })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.settings.configurations.push(config);
        this.settings.currentConfigId = config.id;
        this.saveSettings();

        return config;
    }

    public updateConfiguration(configId: string, updates: Partial<ToolConfiguration>): ToolConfiguration {
        const configIndex = this.settings.configurations.findIndex(config => config.id === configId);
        if (configIndex === -1) {
            throw new Error('配置不存在');
        }

        const config = this.settings.configurations[configIndex];
        const updatedConfig: ToolConfiguration = {
            ...config,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.settings.configurations[configIndex] = updatedConfig;
        this.saveSettings();

        return updatedConfig;
    }

    public deleteConfiguration(configId: string): void {
        const configIndex = this.settings.configurations.findIndex(config => config.id === configId);
        if (configIndex === -1) {
            throw new Error('配置不存在');
        }

        this.settings.configurations.splice(configIndex, 1);
        
        // 如果删除的是当前配置，清空当前配置ID
        if (this.settings.currentConfigId === configId) {
            this.settings.currentConfigId = this.settings.configurations.length > 0 
                ? this.settings.configurations[0].id 
                : '';
        }

        this.saveSettings();
    }

    public setCurrentConfiguration(configId: string): void {
        const config = this.settings.configurations.find(config => config.id === configId);
        if (!config) {
            throw new Error('配置不存在');
        }

        this.settings.currentConfigId = configId;
        this.saveSettings();
    }

    public updateToolStatus(configId: string, category: string, toolName: string, enabled: boolean): void {
        console.log(`Backend: Updating tool status - configId: ${configId}, category: ${category}, toolName: ${toolName}, enabled: ${enabled}`);
        
        const config = this.settings.configurations.find(config => config.id === configId);
        if (!config) {
            console.error(`Backend: Config not found with ID: ${configId}`);
            throw new Error('配置不存在');
        }

        console.log(`Backend: Found config: ${config.name}`);

        const tool = config.tools.find(t => t.category === category && t.name === toolName);
        if (!tool) {
            console.error(`Backend: Tool not found - category: ${category}, name: ${toolName}`);
            throw new Error('工具不存在');
        }

        console.log(`Backend: Found tool: ${tool.name}, current enabled: ${tool.enabled}, new enabled: ${enabled}`);
        
        tool.enabled = enabled;
        config.updatedAt = new Date().toISOString();
        
        console.log(`Backend: Tool updated, saving settings...`);
        this.saveSettings();
        console.log(`Backend: Settings saved successfully`);
    }

    public updateToolStatusBatch(configId: string, updates: { category: string; name: string; enabled: boolean }[]): void {
        console.log(`Backend: updateToolStatusBatch called with configId: ${configId}`);
        console.log(`Backend: Current configurations count: ${this.settings.configurations.length}`);
        console.log(`Backend: Current config IDs:`, this.settings.configurations.map(c => c.id));
        
        const config = this.settings.configurations.find(config => config.id === configId);
        if (!config) {
            console.error(`Backend: Config not found with ID: ${configId}`);
            console.error(`Backend: Available config IDs:`, this.settings.configurations.map(c => c.id));
            throw new Error('配置不存在');
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

    public exportConfiguration(configId: string): string {
        const config = this.settings.configurations.find(config => config.id === configId);
        if (!config) {
            throw new Error('配置不存在');
        }

        return this.exportToolConfiguration(config);
    }

    public importConfiguration(configJson: string): ToolConfiguration {
        const config = this.importToolConfiguration(configJson);
        
        // 生成新的ID和时间戳
        config.id = uuidv4();
        config.createdAt = new Date().toISOString();
        config.updatedAt = new Date().toISOString();

        if (this.settings.configurations.length >= this.settings.maxConfigSlots) {
            throw new Error(`已达到最大配置槽位数量 (${this.settings.maxConfigSlots})`);
        }

        this.settings.configurations.push(config);
        this.saveSettings();

        return config;
    }

    public getEnabledTools(): ToolConfig[] {
        const currentConfig = this.getCurrentConfiguration();
        if (!currentConfig) {
            return this.availableTools.filter(tool => tool.enabled);
        }
        return currentConfig.tools.filter(tool => tool.enabled);
    }

    public getToolManagerState() {
        const currentConfig = this.getCurrentConfiguration();
        return {
            success: true,
            availableTools: currentConfig ? currentConfig.tools : this.getAvailableTools(),
            selectedConfigId: this.settings.currentConfigId,
            configurations: this.getConfigurations(),
            maxConfigSlots: this.settings.maxConfigSlots
        };
    }

    private saveSettings(): void {
        console.log(`Backend: Saving settings, current configs count: ${this.settings.configurations.length}`);
        this.saveToolManagerSettings(this.settings);
        console.log(`Backend: Settings saved to file`);
    }
} 