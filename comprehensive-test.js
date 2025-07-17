const http = require('http');

const SERVER_URL = 'http://localhost:8585';

class MCPTester {
    constructor() {
        this.testResults = [];
        this.currentCategory = '';
    }

    async makeRequest(toolName, args = {}) {
        const payload = {
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: {
                name: toolName,
                arguments: args
            }
        };

        return new Promise((resolve, reject) => {
            const data = JSON.stringify(payload);
            const options = {
                hostname: '127.0.0.1',
                port: 8585,
                path: '/mcp',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };

            const req = http.request(options, (res) => {
                let responseData = '';
                res.on('data', chunk => responseData += chunk);
                res.on('end', () => {
                    try {
                        const response = JSON.parse(responseData);
                        resolve(response);
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on('error', reject);
            req.write(data);
            req.end();
        });
    }

    async testTool(toolName, args = {}, description = '') {
        const testName = description || toolName.replace(/_/g, ' ');
        process.stdout.write(`  ${testName}... `);
        
        try {
            const response = await this.makeRequest(toolName, args);
            
            if (response.result && response.result.success !== false) {
                console.log('✅ 通过');
                this.testResults.push({ tool: toolName, status: 'pass', category: this.currentCategory });
                return response.result;
            } else {
                const error = response.result?.error || response.error?.message || 'Unknown error';
                console.log(`❌ 失败: ${error}`);
                this.testResults.push({ tool: toolName, status: 'fail', error, category: this.currentCategory });
                return null;
            }
        } catch (error) {
            console.log(`❌ 错误: ${error.message}`);
            this.testResults.push({ tool: toolName, status: 'error', error: error.message, category: this.currentCategory });
            return null;
        }
    }

    printCategory(categoryName) {
        this.currentCategory = categoryName;
        console.log(`\n📁 ${categoryName}:`);
    }

    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 测试结果汇总:');
        console.log('='.repeat(60));
        
        const categories = [...new Set(this.testResults.map(r => r.category))];
        
        for (const category of categories) {
            const categoryResults = this.testResults.filter(r => r.category === category);
            const passed = categoryResults.filter(r => r.status === 'pass').length;
            const failed = categoryResults.filter(r => r.status === 'fail').length;
            const errors = categoryResults.filter(r => r.status === 'error').length;
            
            console.log(`\n${category}:`);
            console.log(`  ✅ 通过: ${passed}`);
            console.log(`  ❌ 失败: ${failed}`);
            console.log(`  ⚠️  错误: ${errors}`);
            console.log(`  📊 总计: ${categoryResults.length}`);
        }
        
        const totalPassed = this.testResults.filter(r => r.status === 'pass').length;
        const totalFailed = this.testResults.filter(r => r.status === 'fail').length;
        const totalErrors = this.testResults.filter(r => r.status === 'error').length;
        const total = this.testResults.length;
        
        console.log(`\n总体结果:`);
        console.log(`  ✅ 通过: ${totalPassed}/${total} (${((totalPassed/total)*100).toFixed(1)}%)`);
        console.log(`  ❌ 失败: ${totalFailed}/${total} (${((totalFailed/total)*100).toFixed(1)}%)`);
        console.log(`  ⚠️  错误: ${totalErrors}/${total} (${((totalErrors/total)*100).toFixed(1)}%)`);
        
        // 显示失败的工具
        const failedTools = this.testResults.filter(r => r.status === 'fail' || r.status === 'error');
        if (failedTools.length > 0) {
            console.log('\n❌ 失败的工具:');
            failedTools.forEach(tool => {
                console.log(`  - ${tool.tool}: ${tool.error}`);
            });
        }
    }

    async runAllTests() {
        console.log('🚀 开始全面测试 Cocos MCP 工具...\n');
        
        // 1. 场景管理工具
        this.printCategory('场景管理');
        await this.testTool('scene_create_scene', { 
            sceneName: 'TestScene2', 
            savePath: 'db://assets/scenes/TestScene2.scene' 
        }, '创建场景');
        await this.testTool('scene_get_current_scene', {}, '获取当前场景');
        await this.testTool('scene_save_scene', {}, '保存场景');
        await this.testTool('scene_get_scene_list', {}, '获取场景列表');
        await this.testTool('scene_get_scene_hierarchy', {}, '获取场景层次结构');
        
        // 2. 节点操作工具
        this.printCategory('节点操作');
        const nodeResult = await this.testTool('node_create_node', { name: 'TestNode' }, '创建节点');
        let testNodeUuid = null;
        if (nodeResult && nodeResult.data && nodeResult.data.uuid) {
            testNodeUuid = nodeResult.data.uuid;
        }
        
        await this.testTool('node_get_all_nodes', {}, '获取所有节点');
        await this.testTool('node_find_node_by_name', { name: 'TestNode' }, '按名称查找节点');
        
        if (testNodeUuid) {
            await this.testTool('node_get_node_info', { uuid: testNodeUuid }, '获取节点信息');
            await this.testTool('node_set_node_property', { 
                uuid: testNodeUuid, 
                property: 'position', 
                value: { x: 100, y: 100, z: 0 }
            }, '设置节点属性');
            await this.testTool('node_duplicate_node', { uuid: testNodeUuid }, '复制节点');
        }
        
        // 3. 组件管理工具
        this.printCategory('组件管理');
        if (testNodeUuid) {
            await this.testTool('component_add_component', { 
                nodeUuid: testNodeUuid, 
                componentType: 'cc.Sprite' 
            }, '添加组件');
            await this.testTool('component_get_components', { nodeUuid: testNodeUuid }, '获取组件列表');
            await this.testTool('component_get_component_info', { 
                nodeUuid: testNodeUuid, 
                componentType: 'cc.Sprite' 
            }, '获取组件信息');
        }
        await this.testTool('component_get_available_components', {}, '获取可用组件');
        
        // 4. 预制体工具
        this.printCategory('预制体管理');
        if (testNodeUuid) {
            await this.testTool('prefab_create_prefab', { 
                nodeUuid: testNodeUuid, 
                prefabPath: 'db://assets/prefabs/TestPrefab.prefab' 
            }, '创建预制体');
        }
        await this.testTool('prefab_get_prefab_list', {}, '获取预制体列表');
        await this.testTool('prefab_instantiate_prefab', { 
            prefabPath: 'db://assets/prefabs/TestPrefab.prefab' 
        }, '实例化预制体');
        
        // 5. 项目和资源管理
        this.printCategory('项目资源管理');
        await this.testTool('project_get_project_info', {}, '获取项目信息');
        await this.testTool('project_get_project_settings', {}, '获取项目设置');
        await this.testTool('project_get_assets', { type: 'all' }, '获取资源列表');
        await this.testTool('project_refresh_assets', {}, '刷新资源');
        await this.testTool('project_create_asset', { 
            url: 'db://assets/test-folder', 
            content: null 
        }, '创建资源文件夹');
        
        // 6. 调试工具
        this.printCategory('调试工具');
        await this.testTool('debug_get_console_logs', {}, '获取控制台日志');
        await this.testTool('debug_get_performance_stats', {}, '获取性能统计');
        await this.testTool('debug_validate_scene', {}, '验证场景');
        await this.testTool('debug_get_editor_info', {}, '获取编辑器信息');
        
        // 7. 偏好设置工具
        this.printCategory('偏好设置');
        await this.testTool('preferences_get_preferences', {}, '获取偏好设置');
        await this.testTool('preferences_get_global_preferences', {}, '获取全局偏好设置');
        await this.testTool('preferences_get_recent_projects', {}, '获取最近项目');
        
        // 8. 服务器控制工具
        this.printCategory('服务器控制');
        await this.testTool('server_get_server_info', {}, '获取服务器信息');
        await this.testTool('server_get_editor_version', {}, '获取编辑器版本');
        
        // 9. 广播消息工具
        this.printCategory('广播消息');
        await this.testTool('broadcast_get_broadcast_log', {}, '获取广播日志');
        
        // 清理测试节点
        if (testNodeUuid) {
            await this.testTool('node_delete_node', { uuid: testNodeUuid }, '删除测试节点');
        }
        
        this.printSummary();
    }
}

// 运行测试
const tester = new MCPTester();
tester.runAllTests().catch(console.error);