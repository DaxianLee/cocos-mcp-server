import * as fs from 'fs';
import * as path from 'path';
import { MCPServerSettings, ToolManagerSettings, ToolConfiguration, ToolConfig } from './types';

const DEFAULT_SETTINGS: MCPServerSettings = {
    port: 3000,
    autoStart: false,
    enableDebugLog: false,
    allowedOrigins: ['*'],
    maxConnections: 10
};

const DEFAULT_TOOL_MANAGER_SETTINGS: ToolManagerSettings = {
    configurations: [],
    currentConfigId: '',
    maxConfigSlots: 5
};

function getSettingsPath(): string {
    return path.join(Editor.Project.path, 'settings', 'mcp-server.json');
}

function getToolManagerSettingsPath(): string {
    return path.join(Editor.Project.path, 'settings', 'tool-manager.json');
}

function ensureSettingsDir(): void {
    const settingsDir = path.dirname(getSettingsPath());
    if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir, { recursive: true });
    }
}

export function readSettings(): MCPServerSettings {
    try {
        ensureSettingsDir();
        const settingsFile = getSettingsPath();
        if (fs.existsSync(settingsFile)) {
            const content = fs.readFileSync(settingsFile, 'utf8');
            return { ...DEFAULT_SETTINGS, ...JSON.parse(content) };
        }
    } catch (e) {
        console.error('Failed to read settings:', e);
    }
    return DEFAULT_SETTINGS;
}

export function saveSettings(settings: MCPServerSettings): void {
    try {
        ensureSettingsDir();
        const settingsFile = getSettingsPath();
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
    } catch (e) {
        console.error('Failed to save settings:', e);
        throw e;
    }
}

// 工具管理器设置相关函数
export function readToolManagerSettings(): ToolManagerSettings {
    try {
        ensureSettingsDir();
        const settingsFile = getToolManagerSettingsPath();
        if (fs.existsSync(settingsFile)) {
            const content = fs.readFileSync(settingsFile, 'utf8');
            return { ...DEFAULT_TOOL_MANAGER_SETTINGS, ...JSON.parse(content) };
        }
    } catch (e) {
        console.error('Failed to read tool manager settings:', e);
    }
    return DEFAULT_TOOL_MANAGER_SETTINGS;
}

export function saveToolManagerSettings(settings: ToolManagerSettings): void {
    try {
        ensureSettingsDir();
        const settingsFile = getToolManagerSettingsPath();
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
    } catch (e) {
        console.error('Failed to save tool manager settings:', e);
        throw e;
    }
}

export function exportToolConfiguration(config: ToolConfiguration): string {
    return JSON.stringify(config, null, 2);
}

export function importToolConfiguration(configJson: string): ToolConfiguration {
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

export { DEFAULT_SETTINGS, DEFAULT_TOOL_MANAGER_SETTINGS };