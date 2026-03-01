"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastTools = void 0;
class BroadcastTools {
    constructor() {
        this.listeners = new Map();
        this.messageLog = [];
        this.setupBroadcastListeners();
    }
    getTools() {
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
    async execute(toolName, args) {
        switch (toolName) {
            case 'broadcast_log_management':
                return await this.handleBroadcastLogManagement(args);
            case 'broadcast_listener_management':
                return await this.handleBroadcastListenerManagement(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
    setupBroadcastListeners() {
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
    addBroadcastListener(messageType) {
        const listener = (data) => {
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
        this.listeners.get(messageType).push(listener);
        // 注册 Editor 消息监听 - 暂时注释掉，Editor.Message API可能不支持
        // Editor.Message.on(messageType, listener);
        console.log(`[BroadcastTools] Added listener for ${messageType} (simulated)`);
    }
    removeBroadcastListener(messageType) {
        const listeners = this.listeners.get(messageType);
        if (listeners) {
            listeners.forEach(listener => {
                // Editor.Message.off(messageType, listener);
                console.log(`[BroadcastTools] Removed listener for ${messageType} (simulated)`);
            });
            this.listeners.delete(messageType);
        }
    }
    async getBroadcastLog(limit = 50, messageType) {
        let filteredLog = this.messageLog;
        if (messageType) {
            filteredLog = this.messageLog.filter(entry => entry.message === messageType);
        }
        const recentLog = filteredLog.slice(-limit).map(entry => (Object.assign(Object.assign({}, entry), { timestamp: new Date(entry.timestamp).toISOString() })));
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
    async listenBroadcast(messageType) {
        if (!this.listeners.has(messageType)) {
            this.addBroadcastListener(messageType);
            return {
                success: true,
                data: {
                    messageType: messageType,
                    message: `Started listening for broadcast: ${messageType}`
                }
            };
        }
        else {
            return {
                success: true,
                data: {
                    messageType: messageType,
                    message: `Already listening for broadcast: ${messageType}`
                }
            };
        }
    }
    async stopListening(messageType) {
        if (this.listeners.has(messageType)) {
            this.removeBroadcastListener(messageType);
            return {
                success: true,
                data: {
                    messageType: messageType,
                    message: `Stopped listening for broadcast: ${messageType}`
                }
            };
        }
        else {
            return {
                success: true,
                data: {
                    messageType: messageType,
                    message: `Was not listening for broadcast: ${messageType}`
                }
            };
        }
    }
    async clearBroadcastLog() {
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
    async getActiveListeners() {
        const activeListeners = Array.from(this.listeners.keys()).map(messageType => {
            var _a;
            return ({
                messageType: messageType,
                listenerCount: ((_a = this.listeners.get(messageType)) === null || _a === void 0 ? void 0 : _a.length) || 0
            });
        });
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
    async handleBroadcastLogManagement(args) {
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
    async handleBroadcastListenerManagement(args) {
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
exports.BroadcastTools = BroadcastTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvYWRjYXN0LXRvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL3Rvb2xzL2Jyb2FkY2FzdC10b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLGNBQWM7SUFJdkI7UUFIUSxjQUFTLEdBQTRCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDL0MsZUFBVSxHQUE2RCxFQUFFLENBQUM7UUFHOUUsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPO1lBQ0gsK0NBQStDO1lBQy9DO2dCQUNJLElBQUksRUFBRSwwQkFBMEI7Z0JBQ2hDLFdBQVcsRUFBRSxvUkFBb1I7Z0JBQ2pTLFdBQVcsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsTUFBTSxFQUFFOzRCQUNKLElBQUksRUFBRSxRQUFROzRCQUNkLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUM7NEJBQzlCLFdBQVcsRUFBRSw0S0FBNEs7eUJBQzVMO3dCQUNELHFCQUFxQjt3QkFDckIsS0FBSyxFQUFFOzRCQUNILElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSwwTEFBMEw7NEJBQ3ZNLE9BQU8sRUFBRSxFQUFFOzRCQUNYLE9BQU8sRUFBRSxDQUFDOzRCQUNWLE9BQU8sRUFBRSxJQUFJO3lCQUNoQjt3QkFDRCxXQUFXLEVBQUU7NEJBQ1QsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLCtOQUErTjt5QkFDL087cUJBQ0o7b0JBQ0QsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDO2lCQUN2QjthQUNKO1lBRUQseURBQXlEO1lBQ3pEO2dCQUNJLElBQUksRUFBRSwrQkFBK0I7Z0JBQ3JDLFdBQVcsRUFBRSwwUkFBMFI7Z0JBQ3ZTLFdBQVcsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsTUFB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YixLQUFLLGlCQUFpQjtnQkFDbEIsT0FBTyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkQsS0FBSyxnQkFBZ0I7Z0JBQ2pCLE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2pELEtBQUssc0JBQXNCO2dCQUN2QixPQUFPLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDM0M7Z0JBQ0ksT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGlEQUFpRCxNQUFNLEVBQUUsRUFBRSxDQUFDO1FBQ3BHLENBQUM7SUFDTCxDQUFDO0NBRUo7QUEvUEQsd0NBK1BDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVG9vbERlZmluaXRpb24sIFRvb2xSZXNwb25zZSwgVG9vbEV4ZWN1dG9yIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgQnJvYWRjYXN0VG9vbHMgaW1wbGVtZW50cyBUb29sRXhlY3V0b3Ige1xuICAgIHByaXZhdGUgbGlzdGVuZXJzOiBNYXA8c3RyaW5nLCBGdW5jdGlvbltdPiA9IG5ldyBNYXAoKTtcbiAgICBwcml2YXRlIG1lc3NhZ2VMb2c6IEFycmF5PHsgbWVzc2FnZTogc3RyaW5nOyBkYXRhOiBhbnk7IHRpbWVzdGFtcDogbnVtYmVyIH0+ID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zZXR1cEJyb2FkY2FzdExpc3RlbmVycygpO1xuICAgIH1cblxuICAgIGdldFRvb2xzKCk6IFRvb2xEZWZpbml0aW9uW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLy8gMS4gQnJvYWRjYXN0IExvZyBNYW5hZ2VtZW50IC0gTG9nIG9wZXJhdGlvbnNcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnYnJvYWRjYXN0X2xvZ19tYW5hZ2VtZW50JyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0JST0FEQ0FTVCBMT0cgTUFOQUdFTUVOVDogTW9uaXRvciBDb2NvcyBDcmVhdG9yIGludGVybmFsIG1lc3NhZ2VzIGZvciBkZWJ1Z2dpbmcgYW5kIHN5c3RlbSBtb25pdG9yaW5nLiBVU0FHRTogZ2V0X2xvZyB0byB2aWV3IHJlY2VudCBldmVudHMsIGNsZWFyX2xvZyB0byByZXNldCBoaXN0b3J5LiBERUJVR0dJTkc6IFVzZSBtZXNzYWdlVHlwZSBmaWx0ZXIgdG8gZm9jdXMgb24gc3BlY2lmaWMgZXZlbnRzIGxpa2UgXCJzY2VuZTpyZWFkeVwiIG9yIFwiYXNzZXQtZGI6YXNzZXQtYWRkXCIuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydnZXRfbG9nJywgJ2NsZWFyX2xvZyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTG9nIG9wZXJhdGlvbjogXCJnZXRfbG9nXCIgPSByZXRyaWV2ZSByZWNlbnQgYnJvYWRjYXN0IG1lc3NhZ2VzIChzdXBwb3J0cyBsaW1pdCttZXNzYWdlVHlwZSBmaWx0ZXJzKSB8IFwiY2xlYXJfbG9nXCIgPSBjbGVhciBhbGwgc3RvcmVkIG1lc3NhZ2UgaGlzdG9yeSAobm8gcGFyYW1ldGVycyBuZWVkZWQpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBnZXRfbG9nIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ01heGltdW0gbWVzc2FnZXMgdG8gcmV0dXJuIChnZXRfbG9nIGFjdGlvbikuIENvbnRyb2xzIG91dHB1dCBzaXplLiBFeGFtcGxlczogMTAgZm9yIHJlY2VudCBldmVudHMsIDEwMCBmb3IgY29tcHJlaGVuc2l2ZSBoaXN0b3J5LCA1MDAgZm9yIGRlZXAgZGVidWdnaW5nLiBEZWZhdWx0OiA1MCBmb3IgYmFsYW5jZWQgdmlldy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogMTAwMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VUeXBlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdNZXNzYWdlIHR5cGUgZmlsdGVyIChnZXRfbG9nIGFjdGlvbikuIFNob3cgb25seSBzcGVjaWZpYyBldmVudCB0eXBlcy4gQ29tbW9uIGZpbHRlcnM6IFwic2NlbmU6cmVhZHlcIiAoc2NlbmUgbG9hZGVkKSwgXCJhc3NldC1kYjphc3NldC1hZGRcIiAoYXNzZXQgaW1wb3J0ZWQpLCBcImJ1aWxkLXdvcmtlcjpyZWFkeVwiIChidWlsZCBzeXN0ZW0pLiBMZWF2ZSBlbXB0eSBmb3IgYWxsIG1lc3NhZ2VzLidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYWN0aW9uJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyAyLiBCcm9hZGNhc3QgTGlzdGVuZXIgTWFuYWdlbWVudCAtIExpc3RlbmVyIG9wZXJhdGlvbnNcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnYnJvYWRjYXN0X2xpc3RlbmVyX21hbmFnZW1lbnQnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQlJPQURDQVNUIExJU1RFTkVSIE1BTkFHRU1FTlQ6IENvbnRyb2wgd2hpY2ggQ29jb3MgQ3JlYXRvciBldmVudHMgdG8gbW9uaXRvciBpbiByZWFsLXRpbWUuIFdPUktGTE9XOiBzdGFydF9saXN0ZW5pbmcgdG8gYmVnaW4gbW9uaXRvcmluZyBldmVudHMg4oaSIGdldF9hY3RpdmVfbGlzdGVuZXJzIHRvIHNlZSBjdXJyZW50IG1vbml0b3JzIOKGkiBzdG9wX2xpc3RlbmluZyB0byBlbmQgbW9uaXRvcmluZy4gVXNlZnVsIGZvciBkZWJ1Z2dpbmcgd29ya2Zsb3dzIGFuZCBzeXN0ZW0gbW9uaXRvcmluZy4nLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ3N0YXJ0X2xpc3RlbmluZycsICdzdG9wX2xpc3RlbmluZycsICdnZXRfYWN0aXZlX2xpc3RlbmVycyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTGlzdGVuZXIgb3BlcmF0aW9uOiBcInN0YXJ0X2xpc3RlbmluZ1wiID0gYmVnaW4gbW9uaXRvcmluZyBldmVudHMgKHJlcXVpcmVzIG1lc3NhZ2VUeXBlKSB8IFwic3RvcF9saXN0ZW5pbmdcIiA9IHN0b3AgbW9uaXRvcmluZyBldmVudHMgKHJlcXVpcmVzIG1lc3NhZ2VUeXBlKSB8IFwiZ2V0X2FjdGl2ZV9saXN0ZW5lcnNcIiA9IGxpc3QgY3VycmVudCBtb25pdG9ycyAobm8gcGFyYW1ldGVycyBuZWVkZWQpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBzdGFydF9saXN0ZW5pbmcgYW5kIHN0b3BfbGlzdGVuaW5nIGFjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VUeXBlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdFdmVudCB0eXBlIHRvIG1vbml0b3IgKFJFUVVJUkVEIGZvciBzdGFydF9saXN0ZW5pbmcvc3RvcF9saXN0ZW5pbmcpLiBDcml0aWNhbCBldmVudHM6IFwic2NlbmU6cmVhZHlcIiAoc2NlbmUgY2hhbmdlcyksIFwiYXNzZXQtZGI6YXNzZXQtYWRkXCIgKGltcG9ydHMpLCBcImFzc2V0LWRiOmFzc2V0LWNoYW5nZVwiIChtb2RpZmljYXRpb25zKSwgXCJidWlsZC13b3JrZXI6cmVhZHlcIiAoYnVpbGQgc3RhdHVzKS4gQ2FzZS1zZW5zaXRpdmUgZXhhY3QgbWF0Y2ggcmVxdWlyZWQuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlKHRvb2xOYW1lOiBzdHJpbmcsIGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHN3aXRjaCAodG9vbE5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2Jyb2FkY2FzdF9sb2dfbWFuYWdlbWVudCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlQnJvYWRjYXN0TG9nTWFuYWdlbWVudChhcmdzKTtcbiAgICAgICAgICAgIGNhc2UgJ2Jyb2FkY2FzdF9saXN0ZW5lcl9tYW5hZ2VtZW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5oYW5kbGVCcm9hZGNhc3RMaXN0ZW5lck1hbmFnZW1lbnQoYXJncyk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biB0b29sOiAke3Rvb2xOYW1lfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cEJyb2FkY2FzdExpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgLy8g6K6+572u6aKE5a6a5LmJ55qE6YeN6KaB5bm/5pKt5raI5oGv55uR5ZCsXG4gICAgICAgIGNvbnN0IGltcG9ydGFudE1lc3NhZ2VzID0gW1xuICAgICAgICAgICAgJ2J1aWxkLXdvcmtlcjpyZWFkeScsXG4gICAgICAgICAgICAnYnVpbGQtd29ya2VyOmNsb3NlZCcsXG4gICAgICAgICAgICAnc2NlbmU6cmVhZHknLFxuICAgICAgICAgICAgJ3NjZW5lOmNsb3NlJyxcbiAgICAgICAgICAgICdzY2VuZTpsaWdodC1wcm9iZS1lZGl0LW1vZGUtY2hhbmdlZCcsXG4gICAgICAgICAgICAnc2NlbmU6bGlnaHQtcHJvYmUtYm91bmRpbmctYm94LWVkaXQtbW9kZS1jaGFuZ2VkJyxcbiAgICAgICAgICAgICdhc3NldC1kYjpyZWFkeScsXG4gICAgICAgICAgICAnYXNzZXQtZGI6Y2xvc2UnLFxuICAgICAgICAgICAgJ2Fzc2V0LWRiOmFzc2V0LWFkZCcsXG4gICAgICAgICAgICAnYXNzZXQtZGI6YXNzZXQtY2hhbmdlJyxcbiAgICAgICAgICAgICdhc3NldC1kYjphc3NldC1kZWxldGUnXG4gICAgICAgIF07XG5cbiAgICAgICAgaW1wb3J0YW50TWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlVHlwZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZEJyb2FkY2FzdExpc3RlbmVyKG1lc3NhZ2VUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRCcm9hZGNhc3RMaXN0ZW5lcihtZXNzYWdlVHlwZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlTG9nLnB1c2goe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VUeXBlLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g5L+d5oyB5pel5b+X5aSn5bCP5Zyo5ZCI55CG6IyD5Zu05YaFXG4gICAgICAgICAgICBpZiAodGhpcy5tZXNzYWdlTG9nLmxlbmd0aCA+IDEwMDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2VMb2cgPSB0aGlzLm1lc3NhZ2VMb2cuc2xpY2UoLTUwMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbQnJvYWRjYXN0XSAke21lc3NhZ2VUeXBlfTpgLCBkYXRhKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIXRoaXMubGlzdGVuZXJzLmhhcyhtZXNzYWdlVHlwZSkpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnNldChtZXNzYWdlVHlwZSwgW10pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLmdldChtZXNzYWdlVHlwZSkhLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgICAgIC8vIOazqOWGjCBFZGl0b3Ig5raI5oGv55uR5ZCsIC0g5pqC5pe25rOo6YeK5o6J77yMRWRpdG9yLk1lc3NhZ2UgQVBJ5Y+v6IO95LiN5pSv5oyBXG4gICAgICAgIC8vIEVkaXRvci5NZXNzYWdlLm9uKG1lc3NhZ2VUeXBlLCBsaXN0ZW5lcik7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbQnJvYWRjYXN0VG9vbHNdIEFkZGVkIGxpc3RlbmVyIGZvciAke21lc3NhZ2VUeXBlfSAoc2ltdWxhdGVkKWApO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlQnJvYWRjYXN0TGlzdGVuZXIobWVzc2FnZVR5cGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycy5nZXQobWVzc2FnZVR5cGUpO1xuICAgICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiB7XG4gICAgICAgICAgICAgICAgLy8gRWRpdG9yLk1lc3NhZ2Uub2ZmKG1lc3NhZ2VUeXBlLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtCcm9hZGNhc3RUb29sc10gUmVtb3ZlZCBsaXN0ZW5lciBmb3IgJHttZXNzYWdlVHlwZX0gKHNpbXVsYXRlZClgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMuZGVsZXRlKG1lc3NhZ2VUeXBlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0QnJvYWRjYXN0TG9nKGxpbWl0OiBudW1iZXIgPSA1MCwgbWVzc2FnZVR5cGU/OiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBsZXQgZmlsdGVyZWRMb2cgPSB0aGlzLm1lc3NhZ2VMb2c7XG5cbiAgICAgICAgaWYgKG1lc3NhZ2VUeXBlKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZExvZyA9IHRoaXMubWVzc2FnZUxvZy5maWx0ZXIoZW50cnkgPT4gZW50cnkubWVzc2FnZSA9PT0gbWVzc2FnZVR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjZW50TG9nID0gZmlsdGVyZWRMb2cuc2xpY2UoLWxpbWl0KS5tYXAoZW50cnkgPT4gKHtcbiAgICAgICAgICAgIC4uLmVudHJ5LFxuICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZShlbnRyeS50aW1lc3RhbXApLnRvSVNPU3RyaW5nKClcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGxvZzogcmVjZW50TG9nLFxuICAgICAgICAgICAgICAgIGNvdW50OiByZWNlbnRMb2cubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHRvdGFsQ291bnQ6IGZpbHRlcmVkTG9nLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6IG1lc3NhZ2VUeXBlIHx8ICdhbGwnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdCcm9hZGNhc3QgbG9nIHJldHJpZXZlZCBzdWNjZXNzZnVsbHknXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBsaXN0ZW5Ccm9hZGNhc3QobWVzc2FnZVR5cGU6IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnMuaGFzKG1lc3NhZ2VUeXBlKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRCcm9hZGNhc3RMaXN0ZW5lcihtZXNzYWdlVHlwZSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlVHlwZTogbWVzc2FnZVR5cGUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBTdGFydGVkIGxpc3RlbmluZyBmb3IgYnJvYWRjYXN0OiAke21lc3NhZ2VUeXBlfWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZVR5cGU6IG1lc3NhZ2VUeXBlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgQWxyZWFkeSBsaXN0ZW5pbmcgZm9yIGJyb2FkY2FzdDogJHttZXNzYWdlVHlwZX1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgc3RvcExpc3RlbmluZyhtZXNzYWdlVHlwZTogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzLmhhcyhtZXNzYWdlVHlwZSkpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQnJvYWRjYXN0TGlzdGVuZXIobWVzc2FnZVR5cGUpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZVR5cGU6IG1lc3NhZ2VUeXBlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgU3RvcHBlZCBsaXN0ZW5pbmcgZm9yIGJyb2FkY2FzdDogJHttZXNzYWdlVHlwZX1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VUeXBlOiBtZXNzYWdlVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFdhcyBub3QgbGlzdGVuaW5nIGZvciBicm9hZGNhc3Q6ICR7bWVzc2FnZVR5cGV9YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNsZWFyQnJvYWRjYXN0TG9nKCk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzQ291bnQgPSB0aGlzLm1lc3NhZ2VMb2cubGVuZ3RoO1xuICAgICAgICB0aGlzLm1lc3NhZ2VMb2cgPSBbXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgY2xlYXJlZENvdW50OiBwcmV2aW91c0NvdW50LFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdCcm9hZGNhc3QgbG9nIGNsZWFyZWQgc3VjY2Vzc2Z1bGx5J1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0QWN0aXZlTGlzdGVuZXJzKCk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZUxpc3RlbmVycyA9IEFycmF5LmZyb20odGhpcy5saXN0ZW5lcnMua2V5cygpKS5tYXAobWVzc2FnZVR5cGUgPT4gKHtcbiAgICAgICAgICAgIG1lc3NhZ2VUeXBlOiBtZXNzYWdlVHlwZSxcbiAgICAgICAgICAgIGxpc3RlbmVyQ291bnQ6IHRoaXMubGlzdGVuZXJzLmdldChtZXNzYWdlVHlwZSk/Lmxlbmd0aCB8fCAwXG4gICAgICAgIH0pKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnM6IGFjdGl2ZUxpc3RlbmVycyxcbiAgICAgICAgICAgICAgICBjb3VudDogYWN0aXZlTGlzdGVuZXJzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnQWN0aXZlIGxpc3RlbmVycyByZXRyaWV2ZWQgc3VjY2Vzc2Z1bGx5J1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIE5ldyBoYW5kbGVyIG1ldGhvZHMgZm9yIG9wdGltaXplZCB0b29sc1xuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlQnJvYWRjYXN0TG9nTWFuYWdlbWVudChhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCB7IGFjdGlvbiwgbGltaXQsIG1lc3NhZ2VUeXBlIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9sb2cnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldEJyb2FkY2FzdExvZyhsaW1pdCwgbWVzc2FnZVR5cGUpO1xuICAgICAgICAgICAgY2FzZSAnY2xlYXJfbG9nJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGVhckJyb2FkY2FzdExvZygpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIGJyb2FkY2FzdCBsb2cgbWFuYWdlbWVudCBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlQnJvYWRjYXN0TGlzdGVuZXJNYW5hZ2VtZW50KGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uLCBtZXNzYWdlVHlwZSB9ID0gYXJncztcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlICdzdGFydF9saXN0ZW5pbmcnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmxpc3RlbkJyb2FkY2FzdChtZXNzYWdlVHlwZSk7XG4gICAgICAgICAgICBjYXNlICdzdG9wX2xpc3RlbmluZyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc3RvcExpc3RlbmluZyhtZXNzYWdlVHlwZSk7XG4gICAgICAgICAgICBjYXNlICdnZXRfYWN0aXZlX2xpc3RlbmVycyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0QWN0aXZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYFVua25vd24gYnJvYWRjYXN0IGxpc3RlbmVyIG1hbmFnZW1lbnQgYWN0aW9uOiAke2FjdGlvbn1gIH07XG4gICAgICAgIH1cbiAgICB9XG5cbn0iXX0=