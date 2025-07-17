declare const Editor: any;

/**
 * MCP 工具测试器 - 直接测试通过 WebSocket 的 MCP 工具
 */
export class MCPToolTester {
    private ws: WebSocket | null = null;
    private messageId = 0;
    private responseHandlers = new Map<number, (response: any) => void>();

    async connect(port: number): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                this.ws = new WebSocket(`ws://localhost:${port}`);
                
                this.ws.onopen = () => {
                    console.log('WebSocket 连接成功');
                    resolve(true);
                };
                
                this.ws.onerror = (error) => {
                    console.error('WebSocket 连接错误:', error);
                    resolve(false);
                };
                
                this.ws.onmessage = (event) => {
                    try {
                        const response = JSON.parse(event.data);
                        if (response.id && this.responseHandlers.has(response.id)) {
                            const handler = this.responseHandlers.get(response.id);
                            this.responseHandlers.delete(response.id);
                            handler?.(response);
                        }
                    } catch (error) {
                        console.error('处理响应时出错:', error);
                    }
                };
            } catch (error) {
                console.error('创建 WebSocket 时出错:', error);
                resolve(false);
            }
        });
    }

    async callTool(tool: string, args: any = {}): Promise<any> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket 未连接');
        }

        return new Promise((resolve, reject) => {
            const id = ++this.messageId;
            const request = {
                jsonrpc: '2.0',
                id,
                method: 'tools/call',
                params: {
                    name: tool,
                    arguments: args
                }
            };

            const timeout = setTimeout(() => {
                this.responseHandlers.delete(id);
                reject(new Error('请求超时'));
            }, 10000);

            this.responseHandlers.set(id, (response) => {
                clearTimeout(timeout);
                if (response.error) {
                    reject(new Error(response.error.message));
                } else {
                    resolve(response.result);
                }
            });

            this.ws!.send(JSON.stringify(request));
        });
    }

    async listTools(): Promise<any> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket 未连接');
        }

        return new Promise((resolve, reject) => {
            const id = ++this.messageId;
            const request = {
                jsonrpc: '2.0',
                id,
                method: 'tools/list'
            };

            const timeout = setTimeout(() => {
                this.responseHandlers.delete(id);
                reject(new Error('请求超时'));
            }, 10000);

            this.responseHandlers.set(id, (response) => {
                clearTimeout(timeout);
                if (response.error) {
                    reject(new Error(response.error.message));
                } else {
                    resolve(response.result);
                }
            });

            this.ws!.send(JSON.stringify(request));
        });
    }

    async testMCPTools() {
        console.log('\n=== 测试 MCP 工具（通过 WebSocket）===');
        
        try {
            // 0. 获取工具列表
            console.log('\n0. 获取工具列表...');
            const toolsList = await this.listTools();
            console.log(`找到 ${toolsList.tools?.length || 0} 个工具:`);
            if (toolsList.tools) {
                for (const tool of toolsList.tools.slice(0, 10)) { // 只显示前10个
                    console.log(`  - ${tool.name}: ${tool.description}`);
                }
                if (toolsList.tools.length > 10) {
                    console.log(`  ... 还有 ${toolsList.tools.length - 10} 个工具`);
                }
            }
            
            // 1. 测试场景工具
            console.log('\n1. 测试当前场景信息...');
            const sceneInfo = await this.callTool('scene_get_current_scene');
            console.log('场景信息:', JSON.stringify(sceneInfo).substring(0, 100) + '...');
            
            // 2. 测试场景列表
            console.log('\n2. 测试场景列表...');
            const sceneList = await this.callTool('scene_get_scene_list');
            console.log('场景列表:', JSON.stringify(sceneList).substring(0, 100) + '...');
            
            // 3. 测试节点创建
            console.log('\n3. 测试创建节点...');
            const createResult = await this.callTool('node_create_node', {
                name: 'MCPTestNode_' + Date.now(),
                nodeType: 'cc.Node',
                position: { x: 0, y: 0, z: 0 }
            });
            console.log('创建节点结果:', createResult);
            
            // 解析创建节点的结果
            let nodeUuid: string | null = null;
            if (createResult.content && createResult.content[0] && createResult.content[0].text) {
                try {
                    const resultData = JSON.parse(createResult.content[0].text);
                    if (resultData.success && resultData.data && resultData.data.uuid) {
                        nodeUuid = resultData.data.uuid;
                        console.log('成功获取节点UUID:', nodeUuid);
                    }
                } catch (e) {
                }
            }
            
            if (nodeUuid) {
                // 4. 测试查询节点
                console.log('\n4. 测试查询节点...');
                const queryResult = await this.callTool('node_get_node_info', {
                    uuid: nodeUuid
                });
                console.log('节点信息:', JSON.stringify(queryResult).substring(0, 100) + '...');
                
                // 5. 测试删除节点
                console.log('\n5. 测试删除节点...');
                const removeResult = await this.callTool('node_delete_node', {
                    uuid: nodeUuid
                });
                console.log('删除结果:', removeResult);
            } else {
                console.log('无法从创建结果获取节点UUID，尝试通过名称查找...');
                
                // 备用方案：通过名称查找刚创建的节点
                const findResult = await this.callTool('node_find_node_by_name', {
                    name: 'MCPTestNode_' + Date.now()
                });
                
                if (findResult.content && findResult.content[0] && findResult.content[0].text) {
                    try {
                        const findData = JSON.parse(findResult.content[0].text);
                        if (findData.success && findData.data && findData.data.uuid) {
                            nodeUuid = findData.data.uuid;
                            console.log('通过名称查找成功获取UUID:', nodeUuid);
                        }
                    } catch (e) {
                    }
                }
                
                if (!nodeUuid) {
                    console.log('所有方式都无法获取节点UUID，跳过后续节点操作测试');
                }
            }
            
            // 6. 测试项目工具
            console.log('\n6. 测试项目信息...');
            const projectInfo = await this.callTool('project_get_project_info');
            console.log('项目信息:', JSON.stringify(projectInfo).substring(0, 100) + '...');
            
            // 7. 测试预制体工具
            console.log('\n7. 测试预制体列表...');
            const prefabResult = await this.callTool('prefab_get_prefab_list', {
                folder: 'db://assets'
            });
            console.log('找到预制体:', prefabResult.data?.length || 0);
            
            // 8. 测试组件工具
            console.log('\n8. 测试可用组件...');
            const componentsResult = await this.callTool('component_get_available_components');
            console.log('可用组件:', JSON.stringify(componentsResult).substring(0, 100) + '...');
            
            // 9. 测试调试工具
            console.log('\n9. 测试编辑器信息...');
            const editorInfo = await this.callTool('debug_get_editor_info');
            console.log('编辑器信息:', JSON.stringify(editorInfo).substring(0, 100) + '...');
            
        } catch (error) {
            console.error('MCP 工具测试失败:', error);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.responseHandlers.clear();
    }
}

// 导出到全局方便测试
(global as any).MCPToolTester = MCPToolTester;