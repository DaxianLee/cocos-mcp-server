"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerTools = void 0;
class ServerTools {
    getTools() {
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
    async execute(toolName, args) {
        switch (toolName) {
            case 'server_information':
                return await this.handleServerInformation(args);
            case 'server_connectivity':
                return await this.handleServerConnectivity(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
    async queryServerIPList() {
        try {
            const ipList = await Editor.Message.request('server', 'query-ip-list');
            return {
                success: true,
                data: {
                    ipList: ipList,
                    count: ipList.length,
                    message: 'IP list retrieved successfully'
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async querySortedServerIPList() {
        try {
            const sortedIPList = await Editor.Message.request('server', 'query-sort-ip-list');
            return {
                success: true,
                data: {
                    sortedIPList: sortedIPList,
                    count: sortedIPList.length,
                    message: 'Sorted IP list retrieved successfully'
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryServerPort() {
        try {
            const port = await Editor.Message.request('server', 'query-port');
            return {
                success: true,
                data: {
                    port: port,
                    message: `Editor server is running on port ${port}`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async getServerStatus() {
        var _a;
        try {
            const [ipListResult, portResult] = await Promise.allSettled([
                this.queryServerIPList(),
                this.queryServerPort()
            ]);
            const status = {
                timestamp: new Date().toISOString(),
                serverRunning: true
            };
            if (ipListResult.status === 'fulfilled' && ipListResult.value.success) {
                status.availableIPs = ipListResult.value.data.ipList;
                status.ipCount = ipListResult.value.data.count;
            }
            else {
                status.availableIPs = [];
                status.ipCount = 0;
                status.ipError = ipListResult.status === 'rejected' ? ipListResult.reason : ipListResult.value.error;
            }
            if (portResult.status === 'fulfilled' && portResult.value.success) {
                status.port = portResult.value.data.port;
            }
            else {
                status.port = null;
                status.portError = portResult.status === 'rejected' ? portResult.reason : portResult.value.error;
            }
            status.editorVersion = ((_a = Editor.versions) === null || _a === void 0 ? void 0 : _a.cocos) || 'Unknown';
            status.platform = process.platform;
            status.nodeVersion = process.version;
            return {
                success: true,
                data: status
            };
        }
        catch (err) {
            return {
                success: false,
                error: `Failed to get server status: ${err.message}`
            };
        }
    }
    async checkServerConnectivity(timeout = 5000) {
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
        }
        catch (err) {
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
    async getNetworkInterfaces() {
        try {
            const os = require('os');
            const interfaces = os.networkInterfaces();
            const networkInfo = Object.entries(interfaces).map(([name, addresses]) => ({
                name: name,
                addresses: addresses.map((addr) => ({
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
        }
        catch (err) {
            return {
                success: false,
                error: `Failed to get network interfaces: ${err.message}`
            };
        }
    }
    // New handler methods for optimized tools
    async handleServerInformation(args) {
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
    async handleServerConnectivity(args) {
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
exports.ServerTools = ServerTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLXRvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL3Rvb2xzL3NlcnZlci10b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLFdBQVc7SUFDcEIsUUFBUTtRQUNKLE9BQU87WUFDSCx1REFBdUQ7WUFDdkQ7Z0JBQ0ksSUFBSSxFQUFFLG9CQUFvQjtnQkFDMUIsV0FBVyxFQUFFLHFSQUFxUjtnQkFDbFMsV0FBVyxFQUFFO29CQUNULElBQUksRUFBRSxRQUFRO29CQUNkLFVBQVUsRUFBRTt3QkFDUixNQUFNLEVBQUU7NEJBQ0osSUFBSSxFQUFFLFFBQVE7NEJBQ2QsSUFBSSxFQUFFLENBQUMsYUFBYSxFQUFFLG9CQUFvQixFQUFFLFVBQVUsRUFBRSwwQkFBMEIsQ0FBQzs0QkFDbkYsV0FBVyxFQUFFLG1RQUFtUTt5QkFDblI7cUJBQ0o7b0JBQ0QsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDO2lCQUN2QjthQUNKO1lBRUQsNERBQTREO1lBQzVEO2dCQUNJLElBQUksRUFBRSxxQkFBcUI7Z0JBQzNCLFdBQVcsRUFBRSxzU0FBc1M7Z0JBQ25ULFdBQVcsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsTUFBTSxFQUFFOzRCQUNKLElBQUksRUFBRSxRQUFROzRCQUNkLElBQUksRUFBRSxDQUFDLG1CQUFtQixFQUFFLHdCQUF3QixDQUFDOzRCQUNyRCxXQUFXLEVBQUUsOE5BQThOO3lCQUM5Tzt3QkFDRCxPQUFPLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLHlQQUF5UDs0QkFDdFEsT0FBTyxFQUFFLElBQUk7NEJBQ2IsT0FBTyxFQUFFLElBQUk7NEJBQ2IsT0FBTyxFQUFFLEtBQUs7eUJBQ2pCO3FCQUNKO29CQUNELFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQztpQkFDdkI7YUFDSjtTQUNKLENBQUM7SUFDTixDQUFDO0lB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SyxFQUFFLHVDQUF1QyxNQUFNLEVBQUUsRUFBRSxDQUFDO1FBQzFGLENBQUM7SUFDTCxDQUFDO0NBRUo7QUF6UEQsa0NBeVBDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVG9vbERlZmluaXRpb24sIFRvb2xSZXNwb25zZSwgVG9vbEV4ZWN1dG9yIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgU2VydmVyVG9vbHMgaW1wbGVtZW50cyBUb29sRXhlY3V0b3Ige1xuICAgIGdldFRvb2xzKCk6IFRvb2xEZWZpbml0aW9uW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLy8gMS4gU2VydmVyIEluZm9ybWF0aW9uIE1hbmFnZW1lbnQgLSBCYXNpYyBzZXJ2ZXIgaW5mb1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzZXJ2ZXJfaW5mb3JtYXRpb24nLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU0VSVkVSIElORk9STUFUSU9OOiBHZXQgQ29jb3MgQ3JlYXRvciBlZGl0b3Igc2VydmVyIG5ldHdvcmsgZGV0YWlscyBhbmQgc3RhdHVzLiBVU0FHRTogRXNzZW50aWFsIGZvciBuZXR3b3JrIGNvbmZpZ3VyYXRpb24sIGRlYnVnZ2luZyBjb25uZWN0aW9uIGlzc3VlcywgYW5kIHVuZGVyc3RhbmRpbmcgc2VydmVyIHNldHVwLiBVc2UgXCJnZXRfaXBfbGlzdFwiIHRvIHNlZSBhdmFpbGFibGUgbmV0d29yayBpbnRlcmZhY2VzLCBcImdldF9wb3J0XCIgZm9yIGN1cnJlbnQgc2VydmVyIHBvcnQuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydnZXRfaXBfbGlzdCcsICdnZXRfc29ydGVkX2lwX2xpc3QnLCAnZ2V0X3BvcnQnLCAnZ2V0X2NvbXByZWhlbnNpdmVfc3RhdHVzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJbmZvcm1hdGlvbiBxdWVyeTogXCJnZXRfaXBfbGlzdFwiID0gYWxsIGF2YWlsYWJsZSBuZXR3b3JrIElQIGFkZHJlc3NlcyB8IFwiZ2V0X3NvcnRlZF9pcF9saXN0XCIgPSBJUHMgc29ydGVkIGJ5IHByaW9yaXR5L3R5cGUgfCBcImdldF9wb3J0XCIgPSBjdXJyZW50IGVkaXRvciBzZXJ2ZXIgcG9ydCBudW1iZXIgfCBcImdldF9jb21wcmVoZW5zaXZlX3N0YXR1c1wiID0gY29tcGxldGUgc2VydmVyIHN0YXR1cyB3aXRoIElQcywgcG9ydCwgYW5kIHN5c3RlbSBpbmZvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIDIuIFNlcnZlciBDb25uZWN0aXZpdHkgVGVzdGluZyAtIE5ldHdvcmsgYW5kIGNvbm5lY3Rpdml0eVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzZXJ2ZXJfY29ubmVjdGl2aXR5JyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NFUlZFUiBDT05ORUNUSVZJVFk6IFRlc3QgYW5kIGRpYWdub3NlIG5ldHdvcmsgY29ubmVjdGl2aXR5IGZvciB0aGUgQ29jb3MgQ3JlYXRvciBlZGl0b3Igc2VydmVyLiBVU0FHRTogXCJ0ZXN0X2Nvbm5lY3Rpdml0eVwiIHRvIHZlcmlmeSBzZXJ2ZXIgYWNjZXNzaWJpbGl0eSB3aXRoIGN1c3RvbSB0aW1lb3V0LCBcImdldF9uZXR3b3JrX2ludGVyZmFjZXNcIiBmb3IgZGV0YWlsZWQgbmV0d29yayBhZGFwdGVyIGluZm9ybWF0aW9uLiBDcml0aWNhbCBmb3IgdHJvdWJsZXNob290aW5nIGNvbm5lY3Rpb24gcHJvYmxlbXMuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWyd0ZXN0X2Nvbm5lY3Rpdml0eScsICdnZXRfbmV0d29ya19pbnRlcmZhY2VzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDb25uZWN0aXZpdHkgb3BlcmF0aW9uOiBcInRlc3RfY29ubmVjdGl2aXR5XCIgPSB2ZXJpZnkgc2VydmVyIGNvbm5lY3Rpb24gYW5kIHJlc3BvbnNlIHRpbWUgKG9wdGlvbmFsIHRpbWVvdXQgcGFyYW1ldGVyKSB8IFwiZ2V0X25ldHdvcmtfaW50ZXJmYWNlc1wiID0gZGV0YWlsZWQgbmV0d29yayBhZGFwdGVyIGFuZCBpbnRlcmZhY2UgaW5mb3JtYXRpb24gKG5vIHBhcmFtZXRlcnMgbmVlZGVkKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDb25uZWN0aW9uIHRpbWVvdXQgZHVyYXRpb24gKHRlc3RfY29ubmVjdGl2aXR5IGFjdGlvbikuIE1pbGxpc2Vjb25kcyB0byB3YWl0IGZvciBzZXJ2ZXIgcmVzcG9uc2UuIEV4YW1wbGVzOiAxMDAwIGZvciBxdWljayB0ZXN0LCA1MDAwIGZvciBzdGFuZGFyZCBjaGVjaywgMTAwMDAgZm9yIHNsb3cgbmV0d29ya3MuIERlZmF1bHQ6IDUwMDBtcyBwcm92aWRlcyBnb29kIGJhbGFuY2UgYmV0d2VlbiBzcGVlZCBhbmQgcmVsaWFiaWxpdHkuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiA1MDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogMzAwMDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYWN0aW9uJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZSh0b29sTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBzd2l0Y2ggKHRvb2xOYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdzZXJ2ZXJfaW5mb3JtYXRpb24nOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmhhbmRsZVNlcnZlckluZm9ybWF0aW9uKGFyZ3MpO1xuICAgICAgICAgICAgY2FzZSAnc2VydmVyX2Nvbm5lY3Rpdml0eSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlU2VydmVyQ29ubmVjdGl2aXR5KGFyZ3MpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdG9vbDogJHt0b29sTmFtZX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcXVlcnlTZXJ2ZXJJUExpc3QoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGlwTGlzdDogc3RyaW5nW10gPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzZXJ2ZXInLCAncXVlcnktaXAtbGlzdCcpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgaXBMaXN0OiBpcExpc3QsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBpcExpc3QubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSVAgbGlzdCByZXRyaWV2ZWQgc3VjY2Vzc2Z1bGx5J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHF1ZXJ5U29ydGVkU2VydmVySVBMaXN0KCk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzb3J0ZWRJUExpc3Q6IHN0cmluZ1tdID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2VydmVyJywgJ3F1ZXJ5LXNvcnQtaXAtbGlzdCcpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc29ydGVkSVBMaXN0OiBzb3J0ZWRJUExpc3QsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBzb3J0ZWRJUExpc3QubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnU29ydGVkIElQIGxpc3QgcmV0cmlldmVkIHN1Y2Nlc3NmdWxseSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBxdWVyeVNlcnZlclBvcnQoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBvcnQ6IG51bWJlciA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NlcnZlcicsICdxdWVyeS1wb3J0Jyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBwb3J0OiBwb3J0LFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgRWRpdG9yIHNlcnZlciBpcyBydW5uaW5nIG9uIHBvcnQgJHtwb3J0fWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRTZXJ2ZXJTdGF0dXMoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IFtpcExpc3RSZXN1bHQsIHBvcnRSZXN1bHRdID0gYXdhaXQgUHJvbWlzZS5hbGxTZXR0bGVkKFtcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5U2VydmVySVBMaXN0KCksXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeVNlcnZlclBvcnQoKVxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXR1czogYW55ID0ge1xuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICAgIHNlcnZlclJ1bm5pbmc6IHRydWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChpcExpc3RSZXN1bHQuc3RhdHVzID09PSAnZnVsZmlsbGVkJyAmJiBpcExpc3RSZXN1bHQudmFsdWUuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHN0YXR1cy5hdmFpbGFibGVJUHMgPSBpcExpc3RSZXN1bHQudmFsdWUuZGF0YS5pcExpc3Q7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmlwQ291bnQgPSBpcExpc3RSZXN1bHQudmFsdWUuZGF0YS5jb3VudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmF2YWlsYWJsZUlQcyA9IFtdO1xuICAgICAgICAgICAgICAgIHN0YXR1cy5pcENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBzdGF0dXMuaXBFcnJvciA9IGlwTGlzdFJlc3VsdC5zdGF0dXMgPT09ICdyZWplY3RlZCcgPyBpcExpc3RSZXN1bHQucmVhc29uIDogaXBMaXN0UmVzdWx0LnZhbHVlLmVycm9yO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocG9ydFJlc3VsdC5zdGF0dXMgPT09ICdmdWxmaWxsZWQnICYmIHBvcnRSZXN1bHQudmFsdWUuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHN0YXR1cy5wb3J0ID0gcG9ydFJlc3VsdC52YWx1ZS5kYXRhLnBvcnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXR1cy5wb3J0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzdGF0dXMucG9ydEVycm9yID0gcG9ydFJlc3VsdC5zdGF0dXMgPT09ICdyZWplY3RlZCcgPyBwb3J0UmVzdWx0LnJlYXNvbiA6IHBvcnRSZXN1bHQudmFsdWUuZXJyb3I7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXR1cy5lZGl0b3JWZXJzaW9uID0gKEVkaXRvciBhcyBhbnkpLnZlcnNpb25zPy5jb2NvcyB8fCAnVW5rbm93bic7XG4gICAgICAgICAgICBzdGF0dXMucGxhdGZvcm0gPSBwcm9jZXNzLnBsYXRmb3JtO1xuICAgICAgICAgICAgc3RhdHVzLm5vZGVWZXJzaW9uID0gcHJvY2Vzcy52ZXJzaW9uO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YTogc3RhdHVzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byBnZXQgc2VydmVyIHN0YXR1czogJHtlcnIubWVzc2FnZX1gXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjaGVja1NlcnZlckNvbm5lY3Rpdml0eSh0aW1lb3V0OiBudW1iZXIgPSA1MDAwKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdGVzdFByb21pc2UgPSBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzZXJ2ZXInLCAncXVlcnktcG9ydCcpO1xuICAgICAgICAgICAgY29uc3QgdGltZW91dFByb21pc2UgPSBuZXcgUHJvbWlzZSgoXywgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiByZWplY3QobmV3IEVycm9yKCdDb25uZWN0aW9uIHRpbWVvdXQnKSksIHRpbWVvdXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UucmFjZShbdGVzdFByb21pc2UsIHRpbWVvdXRQcm9taXNlXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlVGltZSA9IERhdGUubm93KCkgLSBzdGFydFRpbWU7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUaW1lOiByZXNwb25zZVRpbWUsXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBTZXJ2ZXIgY29ubmVjdGl2aXR5IGNvbmZpcm1lZCBpbiAke3Jlc3BvbnNlVGltZX1tc2BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VUaW1lID0gRGF0ZS5ub3coKSAtIHN0YXJ0VGltZTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVGltZTogcmVzcG9uc2VUaW1lLFxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXROZXR3b3JrSW50ZXJmYWNlcygpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJmYWNlcyA9IG9zLm5ldHdvcmtJbnRlcmZhY2VzKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5ldHdvcmtJbmZvID0gT2JqZWN0LmVudHJpZXMoaW50ZXJmYWNlcykubWFwKChbbmFtZSwgYWRkcmVzc2VzXTogW3N0cmluZywgYW55XSkgPT4gKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgIGFkZHJlc3NlczogYWRkcmVzc2VzLm1hcCgoYWRkcjogYW55KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBhZGRyLmFkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgIGZhbWlseTogYWRkci5mYW1pbHksXG4gICAgICAgICAgICAgICAgICAgIGludGVybmFsOiBhZGRyLmludGVybmFsLFxuICAgICAgICAgICAgICAgICAgICBjaWRyOiBhZGRyLmNpZHJcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VydmVySVBSZXN1bHQgPSBhd2FpdCB0aGlzLnF1ZXJ5U2VydmVySVBMaXN0KCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIG5ldHdvcmtJbnRlcmZhY2VzOiBuZXR3b3JrSW5mbyxcbiAgICAgICAgICAgICAgICAgICAgc2VydmVyQXZhaWxhYmxlSVBzOiBzZXJ2ZXJJUFJlc3VsdC5zdWNjZXNzID8gc2VydmVySVBSZXN1bHQuZGF0YS5pcExpc3QgOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ05ldHdvcmsgaW50ZXJmYWNlcyByZXRyaWV2ZWQgc3VjY2Vzc2Z1bGx5J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBgRmFpbGVkIHRvIGdldCBuZXR3b3JrIGludGVyZmFjZXM6ICR7ZXJyLm1lc3NhZ2V9YFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5ldyBoYW5kbGVyIG1ldGhvZHMgZm9yIG9wdGltaXplZCB0b29sc1xuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlU2VydmVySW5mb3JtYXRpb24oYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgeyBhY3Rpb24gfSA9IGFyZ3M7XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnZ2V0X2lwX2xpc3QnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnF1ZXJ5U2VydmVySVBMaXN0KCk7XG4gICAgICAgICAgICBjYXNlICdnZXRfc29ydGVkX2lwX2xpc3QnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnF1ZXJ5U29ydGVkU2VydmVySVBMaXN0KCk7XG4gICAgICAgICAgICBjYXNlICdnZXRfcG9ydCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucXVlcnlTZXJ2ZXJQb3J0KCk7XG4gICAgICAgICAgICBjYXNlICdnZXRfY29tcHJlaGVuc2l2ZV9zdGF0dXMnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFNlcnZlclN0YXR1cygpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIHNlcnZlciBpbmZvcm1hdGlvbiBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlU2VydmVyQ29ubmVjdGl2aXR5KGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uLCB0aW1lb3V0IH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ3Rlc3RfY29ubmVjdGl2aXR5JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jaGVja1NlcnZlckNvbm5lY3Rpdml0eSh0aW1lb3V0KTtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9uZXR3b3JrX2ludGVyZmFjZXMnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldE5ldHdvcmtJbnRlcmZhY2VzKCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYFVua25vd24gc2VydmVyIGNvbm5lY3Rpdml0eSBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxufSJdfQ==