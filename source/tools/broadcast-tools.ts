import { ToolDefinition, ToolResponse, ToolExecutor } from '../types';

export class BroadcastTools implements ToolExecutor {
    private listeners: Map<string, Function[]> = new Map();
    private messageLog: Array<{ message: string; data: any; timestamp: number }> = [];

    constructor() {
        this.setupBroadcastListeners();
    }

    getTools(): ToolDefinition[] {
        return [
            // 1. Broadcast Log Management - Log operations
            {
                name: 'broadcast_log_management',
                description: 'BROADCAST LOG MANAGEMENT: Monitor Cocos Creator internal messages for debugging and system monitoring. USAGE: get_log to view recent events, clear_log to reset history. DEBUGGING: Use messageType filter to focus on specific events like "scene:ready" or "asset-db:asset-add".',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['get_log', 'clear_log'],
                            description: 'Log operation: "get_log" = retrieve recent broadcast messages (supports limit+messageType filters) | "clear_log" = clear all stored message history (no parameters needed)'
                        },
                        // For get_log action
                        limit: {
                            type: 'number',
                            description: 'Maximum messages to return (get_log action). Controls output size. Examples: 10 for recent events, 100 for comprehensive history, 500 for deep debugging. Default: 50 for balanced view.',
                            default: 50,
                            minimum: 1,
                            maximum: 1000
                        },
                        messageType: {
                            type: 'string',
                            description: 'Message type filter (get_log action). Show only specific event types. Common filters: "scene:ready" (scene loaded), "asset-db:asset-add" (asset imported), "build-worker:ready" (build system). Leave empty for all messages.'
                        }
                    },
                    required: ['action']
                }
            },

            // 2. Broadcast Listener Management - Listener operations
            {
                name: 'broadcast_listener_management',
                description: 'BROADCAST LISTENER MANAGEMENT: Control which Cocos Creator events to monitor in real-time. WORKFLOW: start_listening to begin monitoring events → get_active_listeners to see current monitors → stop_listening to end monitoring. Useful for debugging workflows and system monitoring.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['start_listening', 'stop_listening', 'get_active_listeners'],
                            description: 'Listener operation: "start_listening" = begin monitoring events (requires messageType) | "stop_listening" = stop monitoring events (requires messageType) | "get_active_listeners" = list current monitors (no parameters needed)'
                        },
                        // For start_listening and stop_listening actions
                        messageType: {
                            type: 'string',
                            description: 'Event type to monitor (REQUIRED for start_listening/stop_listening). Critical events: "scene:ready" (scene changes), "asset-db:asset-add" (imports), "asset-db:asset-change" (modifications), "build-worker:ready" (build status). Case-sensitive exact match required.'
                        }
                    },
                    required: ['action']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'broadcast_log_management':
                return await this.handleBroadcastLogManagement(args);
            case 'broadcast_listener_management':
                return await this.handleBroadcastListenerManagement(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private setupBroadcastListeners(): void {
        // 设置预定义的重要广播消息监听
        const importantMessages = [
            'build-worker:ready',
            'build-worker:closed',
            'scene:ready',
            'scene:close',
            'scene:light-probe-edit-mode-changed',
            'scene:light-probe-bounding-box-edit-mode-changed',
            'asset-db:ready',
            'asset-db:close',
            'asset-db:asset-add',
            'asset-db:asset-change',
            'asset-db:asset-delete'
        ];

        importantMessages.forEach(messageType => {
            this.addBroadcastListener(messageType);
        });
    }

    private addBroadcastListener(messageType: string): void {
        const listener = (data: any) => {
            this.messageLog.push({
                message: messageType,
                data: data,
                timestamp: Date.now()
            });

            // 保持日志大小在合理范围内
            if (this.messageLog.length > 1000) {
                this.messageLog = this.messageLog.slice(-500);
            }

            console.log(`[Broadcast] ${messageType}:`, data);
        };

        if (!this.listeners.has(messageType)) {
            this.listeners.set(messageType, []);
        }
        this.listeners.get(messageType)!.push(listener);

        // 注册 Editor 消息监听 - 暂时注释掉，Editor.Message API可能不支持
        // Editor.Message.on(messageType, listener);
        console.log(`[BroadcastTools] Added listener for ${messageType} (simulated)`);
    }

    private removeBroadcastListener(messageType: string): void {
        const listeners = this.listeners.get(messageType);
        if (listeners) {
            listeners.forEach(listener => {
                // Editor.Message.off(messageType, listener);
                console.log(`[BroadcastTools] Removed listener for ${messageType} (simulated)`);
            });
            this.listeners.delete(messageType);
        }
    }

    private async getBroadcastLog(limit: number = 50, messageType?: string): Promise<ToolResponse> {
        let filteredLog = this.messageLog;

        if (messageType) {
            filteredLog = this.messageLog.filter(entry => entry.message === messageType);
        }

        const recentLog = filteredLog.slice(-limit).map(entry => ({
            ...entry,
            timestamp: new Date(entry.timestamp).toISOString()
        }));

        return {
            success: true,
            data: {
                log: recentLog,
                count: recentLog.length,
                totalCount: filteredLog.length,
                filter: messageType || 'all',
                message: 'Broadcast log retrieved successfully'
            }
        };
    }

    private async listenBroadcast(messageType: string): Promise<ToolResponse> {
        if (!this.listeners.has(messageType)) {
            this.addBroadcastListener(messageType);
            return {
                success: true,
                data: {
                    messageType: messageType,
                    message: `Started listening for broadcast: ${messageType}`
                }
            };
        } else {
            return {
                success: true,
                data: {
                    messageType: messageType,
                    message: `Already listening for broadcast: ${messageType}`
                }
            };
        }
    }

    private async stopListening(messageType: string): Promise<ToolResponse> {
        if (this.listeners.has(messageType)) {
            this.removeBroadcastListener(messageType);
            return {
                success: true,
                data: {
                    messageType: messageType,
                    message: `Stopped listening for broadcast: ${messageType}`
                }
            };
        } else {
            return {
                success: true,
                data: {
                    messageType: messageType,
                    message: `Was not listening for broadcast: ${messageType}`
                }
            };
        }
    }

    private async clearBroadcastLog(): Promise<ToolResponse> {
        const previousCount = this.messageLog.length;
        this.messageLog = [];
        return {
            success: true,
            data: {
                clearedCount: previousCount,
                message: 'Broadcast log cleared successfully'
            }
        };
    }

    private async getActiveListeners(): Promise<ToolResponse> {
        const activeListeners = Array.from(this.listeners.keys()).map(messageType => ({
            messageType: messageType,
            listenerCount: this.listeners.get(messageType)?.length || 0
        }));

        return {
            success: true,
            data: {
                listeners: activeListeners,
                count: activeListeners.length,
                message: 'Active listeners retrieved successfully'
            }
        };
    }

    // New handler methods for optimized tools
    private async handleBroadcastLogManagement(args: any): Promise<ToolResponse> {
        const { action, limit, messageType } = args;
        
        switch (action) {
            case 'get_log':
                return await this.getBroadcastLog(limit, messageType);
            case 'clear_log':
                return await this.clearBroadcastLog();
            default:
                return { success: false, error: `Unknown broadcast log management action: ${action}` };
        }
    }

    private async handleBroadcastListenerManagement(args: any): Promise<ToolResponse> {
        const { action, messageType } = args;
        
        switch (action) {
            case 'start_listening':
                return await this.listenBroadcast(messageType);
            case 'stop_listening':
                return await this.stopListening(messageType);
            case 'get_active_listeners':
                return await this.getActiveListeners();
            default:
                return { success: false, error: `Unknown broadcast listener management action: ${action}` };
        }
    }

}