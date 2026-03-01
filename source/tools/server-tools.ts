import { ToolDefinition, ToolResponse, ToolExecutor } from '../types';

export class ServerTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            // 1. Server Information Management - Basic server info
            {
                name: 'server_information',
                description: 'SERVER INFORMATION: Get Cocos Creator editor server network details and status. USAGE: Essential for network configuration, debugging connection issues, and understanding server setup. Use "get_ip_list" to see available network interfaces, "get_port" for current server port.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['get_ip_list', 'get_sorted_ip_list', 'get_port', 'get_comprehensive_status'],
                            description: 'Information query: "get_ip_list" = all available network IP addresses | "get_sorted_ip_list" = IPs sorted by priority/type | "get_port" = current editor server port number | "get_comprehensive_status" = complete server status with IPs, port, and system info'
                        }
                    },
                    required: ['action']
                }
            },

            // 2. Server Connectivity Testing - Network and connectivity
            {
                name: 'server_connectivity',
                description: 'SERVER CONNECTIVITY: Test and diagnose network connectivity for the Cocos Creator editor server. USAGE: "test_connectivity" to verify server accessibility with custom timeout, "get_network_interfaces" for detailed network adapter information. Critical for troubleshooting connection problems.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['test_connectivity', 'get_network_interfaces'],
                            description: 'Connectivity operation: "test_connectivity" = verify server connection and response time (optional timeout parameter) | "get_network_interfaces" = detailed network adapter and interface information (no parameters needed)'
                        },
                        timeout: {
                            type: 'number',
                            description: 'Connection timeout duration (test_connectivity action). Milliseconds to wait for server response. Examples: 1000 for quick test, 5000 for standard check, 10000 for slow networks. Default: 5000ms provides good balance between speed and reliability.',
                            default: 5000,
                            minimum: 1000,
                            maximum: 30000
                        }
                    },
                    required: ['action']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'server_information':
                return await this.handleServerInformation(args);
            case 'server_connectivity':
                return await this.handleServerConnectivity(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async queryServerIPList(): Promise<ToolResponse> {
        try {
            const ipList: string[] = await Editor.Message.request('server', 'query-ip-list');
            return {
                success: true,
                data: {
                    ipList: ipList,
                    count: ipList.length,
                    message: 'IP list retrieved successfully'
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async querySortedServerIPList(): Promise<ToolResponse> {
        try {
            const sortedIPList: string[] = await Editor.Message.request('server', 'query-sort-ip-list');
            return {
                success: true,
                data: {
                    sortedIPList: sortedIPList,
                    count: sortedIPList.length,
                    message: 'Sorted IP list retrieved successfully'
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async queryServerPort(): Promise<ToolResponse> {
        try {
            const port: number = await Editor.Message.request('server', 'query-port');
            return {
                success: true,
                data: {
                    port: port,
                    message: `Editor server is running on port ${port}`
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async getServerStatus(): Promise<ToolResponse> {
        try {
            const [ipListResult, portResult] = await Promise.allSettled([
                this.queryServerIPList(),
                this.queryServerPort()
            ]);

            const status: any = {
                timestamp: new Date().toISOString(),
                serverRunning: true
            };

            if (ipListResult.status === 'fulfilled' && ipListResult.value.success) {
                status.availableIPs = ipListResult.value.data.ipList;
                status.ipCount = ipListResult.value.data.count;
            } else {
                status.availableIPs = [];
                status.ipCount = 0;
                status.ipError = ipListResult.status === 'rejected' ? ipListResult.reason : ipListResult.value.error;
            }

            if (portResult.status === 'fulfilled' && portResult.value.success) {
                status.port = portResult.value.data.port;
            } else {
                status.port = null;
                status.portError = portResult.status === 'rejected' ? portResult.reason : portResult.value.error;
            }

            status.editorVersion = (Editor as any).versions?.cocos || 'Unknown';
            status.platform = process.platform;
            status.nodeVersion = process.version;

            return {
                success: true,
                data: status
            };
        } catch (err: any) {
            return {
                success: false,
                error: `Failed to get server status: ${err.message}`
            };
        }
    }

    private async checkServerConnectivity(timeout: number = 5000): Promise<ToolResponse> {
        const startTime = Date.now();

        try {
            const testPromise = Editor.Message.request('server', 'query-port');
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Connection timeout')), timeout);
            });

            await Promise.race([testPromise, timeoutPromise]);

            const responseTime = Date.now() - startTime;

            return {
                success: true,
                data: {
                    connected: true,
                    responseTime: responseTime,
                    timeout: timeout,
                    message: `Server connectivity confirmed in ${responseTime}ms`
                }
            };
        } catch (err: any) {
            const responseTime = Date.now() - startTime;

            return {
                success: false,
                data: {
                    connected: false,
                    responseTime: responseTime,
                    timeout: timeout,
                    error: err.message
                }
            };
        }
    }

    private async getNetworkInterfaces(): Promise<ToolResponse> {
        try {
            const os = require('os');
            const interfaces = os.networkInterfaces();

            const networkInfo = Object.entries(interfaces).map(([name, addresses]: [string, any]) => ({
                name: name,
                addresses: addresses.map((addr: any) => ({
                    address: addr.address,
                    family: addr.family,
                    internal: addr.internal,
                    cidr: addr.cidr
                }))
            }));

            const serverIPResult = await this.queryServerIPList();

            return {
                success: true,
                data: {
                    networkInterfaces: networkInfo,
                    serverAvailableIPs: serverIPResult.success ? serverIPResult.data.ipList : [],
                    message: 'Network interfaces retrieved successfully'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                error: `Failed to get network interfaces: ${err.message}`
            };
        }
    }

    // New handler methods for optimized tools
    private async handleServerInformation(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'get_ip_list':
                return await this.queryServerIPList();
            case 'get_sorted_ip_list':
                return await this.querySortedServerIPList();
            case 'get_port':
                return await this.queryServerPort();
            case 'get_comprehensive_status':
                return await this.getServerStatus();
            default:
                return { success: false, error: `Unknown server information action: ${action}` };
        }
    }

    private async handleServerConnectivity(args: any): Promise<ToolResponse> {
        const { action, timeout } = args;
        
        switch (action) {
            case 'test_connectivity':
                return await this.checkServerConnectivity(timeout);
            case 'get_network_interfaces':
                return await this.getNetworkInterfaces();
            default:
                return { success: false, error: `Unknown server connectivity action: ${action}` };
        }
    }

}