import { ToolDefinition, ToolResponse, ToolExecutor } from '../types';

export class ServerTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            {
                name: 'get_server_info',
                description: 'Get server information',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'broadcast_custom_message',
                description: 'Broadcast a custom message',
                inputSchema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Message name'
                        },
                        data: {
                            description: 'Message data (optional)'
                        }
                    },
                    required: ['message']
                }
            },
            {
                name: 'get_editor_version',
                description: 'Get editor version information',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'get_project_name',
                description: 'Get current project name',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'get_project_path',
                description: 'Get current project path',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'get_project_uuid',
                description: 'Get current project UUID',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'restart_editor',
                description: 'Request to restart the editor',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'quit_editor',
                description: 'Request to quit the editor',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'get_server_info':
                return await this.getServerInfo();
            case 'broadcast_custom_message':
                return await this.broadcastCustomMessage(args.message, args.data);
            case 'get_editor_version':
                return await this.getEditorVersion();
            case 'get_project_name':
                return await this.getProjectName();
            case 'get_project_path':
                return await this.getProjectPath();
            case 'get_project_uuid':
                return await this.getProjectUuid();
            case 'restart_editor':
                return await this.restartEditor();
            case 'quit_editor':
                return await this.quitEditor();
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async getServerInfo(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            try {
                const info = {
                    editorVersion: (Editor as any).versions?.editor || 'Unknown',
                    cocosVersion: (Editor as any).versions?.cocos || 'Unknown',
                    nodeVersion: process.version,
                    platform: process.platform,
                    arch: process.arch,
                    projectName: Editor.Project.name,
                    projectPath: Editor.Project.path,
                    projectUuid: Editor.Project.uuid
                };

                resolve({
                    success: true,
                    data: {
                        server: info,
                        message: 'Server information retrieved successfully'
                    }
                });
            } catch (err: any) {
                resolve({ success: false, error: err.message });
            }
        });
    }

    private async broadcastCustomMessage(message: string, data?: any): Promise<ToolResponse> {
        return new Promise((resolve) => {
            try {
                if (data !== undefined) {
                    Editor.Message.broadcast(message, data);
                } else {
                    Editor.Message.broadcast(message);
                }

                resolve({
                    success: true,
                    data: {
                        message: message,
                        data: data,
                        result: 'Message broadcasted successfully'
                    }
                });
            } catch (err: any) {
                resolve({ success: false, error: err.message });
            }
        });
    }

    private async getEditorVersion(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            try {
                const version = {
                    editor: (Editor as any).versions?.editor || 'Unknown',
                    cocos: (Editor as any).versions?.cocos || 'Unknown',
                    node: process.version
                };

                resolve({
                    success: true,
                    data: {
                        version: version,
                        message: 'Editor version retrieved successfully'
                    }
                });
            } catch (err: any) {
                resolve({ success: false, error: err.message });
            }
        });
    }

    private async getProjectName(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            try {
                const name = Editor.Project.name;
                resolve({
                    success: true,
                    data: {
                        name: name,
                        message: 'Project name retrieved successfully'
                    }
                });
            } catch (err: any) {
                resolve({ success: false, error: err.message });
            }
        });
    }

    private async getProjectPath(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            try {
                const path = Editor.Project.path;
                resolve({
                    success: true,
                    data: {
                        path: path,
                        message: 'Project path retrieved successfully'
                    }
                });
            } catch (err: any) {
                resolve({ success: false, error: err.message });
            }
        });
    }

    private async getProjectUuid(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            try {
                const uuid = Editor.Project.uuid;
                resolve({
                    success: true,
                    data: {
                        uuid: uuid,
                        message: 'Project UUID retrieved successfully'
                    }
                });
            } catch (err: any) {
                resolve({ success: false, error: err.message });
            }
        });
    }

    private async restartEditor(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Editor restart is not supported through MCP API',
                instruction: 'Please restart the editor manually or use the editor menu: File > Restart Editor'
            });
        });
    }

    private async quitEditor(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            resolve({
                success: false,
                error: 'Editor quit is not supported through MCP API',
                instruction: 'Please quit the editor manually or use the editor menu: File > Quit'
            });
        });
    }
}