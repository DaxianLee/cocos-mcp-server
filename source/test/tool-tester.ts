declare const Editor: any;

interface TestResult {
    tool: string;
    method: string;
    success: boolean;
    result?: any;
    error?: string;
    time: number;
}

export class ToolTester {
    private results: TestResult[] = [];

    async runTest(tool: string, method: string, params: any): Promise<TestResult> {
        const startTime = Date.now();
        const result: TestResult = {
            tool,
            method,
            success: false,
            time: 0
        };

        try {
            const response = await Editor.Message.request(tool, method, params);
            result.success = true;
            result.result = response;
        } catch (error) {
            result.success = false;
            result.error = error instanceof Error ? error.message : String(error);
        }

        result.time = Date.now() - startTime;
        this.results.push(result);
        return result;
    }

    async testSceneOperations() {
        console.log('Testing Scene Operations...');
        
        // Test node creation (this is the main scene operation that works)
        const createResult = await this.runTest('scene', 'create-node', {
            name: 'TestNode',
            type: 'cc.Node'
        });
        
        if (createResult.success && createResult.result) {
            const nodeUuid = createResult.result;
            
            // Test query node info
            await this.runTest('scene', 'query-node-info', nodeUuid);
            
            // Test remove node
            await this.runTest('scene', 'remove-node', nodeUuid);
        }
        
        // Test execute scene script
        await this.runTest('scene', 'execute-scene-script', {
            name: 'cocos-mcp-server',
            method: 'test-method',
            args: []
        });
    }

    async testNodeOperations() {
        console.log('Testing Node Operations...');
        
        // Create a test node first
        const createResult = await this.runTest('scene', 'create-node', {
            name: 'TestNodeForOps',
            type: 'cc.Node'
        });
        
        if (createResult.success && createResult.result) {
            const nodeUuid = createResult.result;
            
            // Test set property
            await this.runTest('scene', 'set-property', {
                uuid: nodeUuid,
                path: 'position',
                dump: {
                    type: 'cc.Vec3',
                    value: { x: 100, y: 200, z: 0 }
                }
            });
            
            // Test add component
            await this.runTest('scene', 'add-component', {
                uuid: nodeUuid,
                component: 'cc.Sprite'
            });
            
            // Clean up
            await this.runTest('scene', 'remove-node', nodeUuid);
        }
    }

    async testAssetOperations() {
        console.log('Testing Asset Operations...');
        
        // Test asset list
        await this.runTest('asset-db', 'query-assets', {
            pattern: '**/*.png',
            ccType: 'cc.ImageAsset'
        });
        
        // Test query asset by path
        await this.runTest('asset-db', 'query-path', 'db://assets');
        
        // Test query asset by uuid (using a valid uuid format)
        await this.runTest('asset-db', 'query-uuid', 'db://assets');
    }

    async testProjectOperations() {
        console.log('Testing Project Operations...');
        
        // Test open project settings
        await this.runTest('project', 'open-settings', {});
        
        // Test query project settings
        const projectName = await this.runTest('project', 'query-setting', 'name');
        
        if (projectName.success) {
            console.log('Project name:', projectName.result);
        }
    }

    async runAllTests() {
        this.results = [];
        
        await this.testSceneOperations();
        await this.testNodeOperations();
        await this.testAssetOperations();
        await this.testProjectOperations();
        
        return this.getTestReport();
    }

    getTestReport() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.success).length;
        const failed = total - passed;
        
        return {
            summary: {
                total,
                passed,
                failed,
                passRate: total > 0 ? (passed / total * 100).toFixed(2) + '%' : '0%'
            },
            results: this.results,
            grouped: this.groupResultsByTool()
        };
    }

    private groupResultsByTool() {
        const grouped: Record<string, TestResult[]> = {};
        
        for (const result of this.results) {
            if (!grouped[result.tool]) {
                grouped[result.tool] = [];
            }
            grouped[result.tool].push(result);
        }
        
        return grouped;
    }
}