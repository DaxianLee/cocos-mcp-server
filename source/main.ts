import { MCPServer } from './mcp-server';
import { readSettings, saveSettings } from './settings';
import { MCPServerSettings } from './types';

let mcpServer: MCPServer | null = null;

/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    /**
     * @en Open the MCP server panel
     * @zh 打开 MCP 服务器面板
     */
    openPanel() {
        Editor.Panel.open('cocos-mcp-server');
    },

    /**
     * @en Start the MCP server
     * @zh 启动 MCP 服务器
     */
    async startServer() {
        if (mcpServer) {
            await mcpServer.start();
        } else {
            console.warn('[MCP插件] mcpServer 未初始化');
        }
    },

    /**
     * @en Stop the MCP server
     * @zh 停止 MCP 服务器
     */
    async stopServer() {
        if (mcpServer) {
            mcpServer.stop();
        } else {
            console.warn('[MCP插件] mcpServer 未初始化');
        }
    },

    /**
     * @en Get server status
     * @zh 获取服务器状态
     */
    getServerStatus() {
        return mcpServer ? mcpServer.getStatus() : { running: false, port: 0, clients: 0 };
    },

    /**
     * @en Update server settings
     * @zh 更新服务器设置
     */
    updateSettings(settings: MCPServerSettings) {
        saveSettings(settings);
        if (mcpServer) {
            mcpServer.stop();
            mcpServer = new MCPServer(settings);
            mcpServer.start();
        } else {
            mcpServer = new MCPServer(settings);
            mcpServer.start();
        }
    },

    /**
     * @en Get tools list
     * @zh 获取工具列表
     */
    getToolsList() {
        return mcpServer ? mcpServer.getAvailableTools() : [];
    },
    /**
     * @en Get server settings
     * @zh 获取服务器设置
     */
    getServerSettings() {
        return mcpServer ? mcpServer.getSettings() : readSettings();
    }
};

/**
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
export function load() {
    console.log('[MCP Plugin] Loading MCP server plugin...');
    try {
        const settings = readSettings();
        console.log('[MCP Plugin] Settings loaded:', settings);
        mcpServer = new MCPServer(settings);
        
        // 如果设置了自动启动，则启动服务器
        if (settings.autoStart) {
            console.log('[MCP Plugin] Auto-starting MCP server...');
            mcpServer.start().catch(error => {
                console.error('[MCP Plugin] Failed to auto-start server:', error);
            });
        } else {
            console.log('[MCP Plugin] MCP server created but not started (autoStart=false)');
            console.log('[MCP Plugin] Use the MCP panel or call startServer() to start the server');
        }
    } catch (error) {
        console.error('[MCP Plugin] Failed to load MCP server:', error);
    }
}

/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
export function unload() {
    if (mcpServer) {
        mcpServer.stop();
        mcpServer = null;
    }
}