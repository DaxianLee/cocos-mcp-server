"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSceneTools = testSceneTools;
exports.testAssetTools = testAssetTools;
exports.testProjectTools = testProjectTools;
exports.runAllTests = runAllTests;
/**
 * 手动测试脚本
 * 可以在 Cocos Creator 控制台中执行测试
 */
async function testSceneTools() {
    console.log('=== Testing Scene Tools ===');
    try {
        // 1. 获取场景信息
        console.log('1. Getting scene info...');
        const sceneInfo = await Editor.Message.request('scene', 'get-scene-info');
        console.log('Scene info:', sceneInfo);
        // 2. 创建节点
        console.log('\n2. Creating test node...');
        const createResult = await Editor.Message.request('scene', 'create-node', {
            name: 'TestNode_' + Date.now(),
            type: 'cc.Node'
        });
        console.log('Create result:', createResult);
        if (createResult && createResult.uuid) {
            const nodeUuid = createResult.uuid;
            // 3. 查询节点
            console.log('\n3. Querying node...');
            const nodeInfo = await Editor.Message.request('scene', 'query-node', {
                uuid: nodeUuid
            });
            console.log('Node info:', nodeInfo);
            // 4. 设置节点属性
            console.log('\n4. Setting node position...');
            await Editor.Message.request('scene', 'set-node-property', {
                uuid: nodeUuid,
                path: 'position',
                value: { x: 100, y: 200, z: 0 }
            });
            console.log('Position set successfully');
            // 5. 添加组件
            console.log('\n5. Adding Sprite component...');
            const addCompResult = await Editor.Message.request('scene', 'add-component', {
                uuid: nodeUuid,
                component: 'cc.Sprite'
            });
            console.log('Component added:', addCompResult);
            // 6. 查询组件
            console.log('\n6. Querying component...');
            const compInfo = await Editor.Message.request('scene', 'query-node-component', {
                uuid: nodeUuid,
                component: 'cc.Sprite'
            });
            console.log('Component info:', compInfo);
            // 7. 删除节点
            console.log('\n7. Removing test node...');
            await Editor.Message.request('scene', 'remove-node', {
                uuid: nodeUuid
            });
            console.log('Node removed successfully');
        }
    }
    catch (error) {
        console.error('Test failed:', error);
    }
}
async function testAssetTools() {
    console.log('\n=== Testing Asset Tools ===');
    try {
        // 1. 查询资源
        console.log('1. Querying image assets...');
        const assets = await Editor.Message.request('asset-db', 'query-assets', {
            pattern: '**/*.png',
            ccType: 'cc.ImageAsset'
        });
        console.log('Found assets:', (assets === null || assets === void 0 ? void 0 : assets.length) || 0);
        // 2. 获取资源信息
        console.log('\n2. Getting asset database info...');
        const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', {
            uuid: 'db://assets'
        });
        console.log('Asset info:', assetInfo);
    }
    catch (error) {
        console.error('Test failed:', error);
    }
}
async function testProjectTools() {
    console.log('\n=== Testing Project Tools ===');
    try {
        // 1. 获取项目信息
        console.log('1. Getting project info...');
        const projectInfo = await Editor.Message.request('project', 'query-info');
        console.log('Project info:', projectInfo);
        // 2. 检查构建能力
        console.log('\n2. Checking build capability...');
        const canBuild = await Editor.Message.request('project', 'can-build');
        console.log('Can build:', canBuild);
    }
    catch (error) {
        console.error('Test failed:', error);
    }
}
async function runAllTests() {
    console.log('Starting MCP Server Tools Test...\n');
    await testSceneTools();
    await testAssetTools();
    await testProjectTools();
    console.log('\n=== All tests completed ===');
}
// 导出到全局，方便在控制台调用
global.MCPTest = {
    testSceneTools,
    testAssetTools,
    testProjectTools,
    runAllTests
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFudWFsLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb3VyY2UvdGVzdC9tYW51YWwtdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9BLHdDQStEQztBQUVELHdDQXNCQztBQUVELDRDQWlCQztBQUVELGtDQVFDO0FBekhEOzs7R0FHRztBQUVJLEtBQUssVUFBVSxjQUFjO0lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUUzQyxJQUFJLENBQUM7UUFDRCxZQUFZO1FBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDMUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFdEMsVUFBVTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUMxQyxNQUFNLFlBQVksR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUU7WUFDdEUsSUFBSSxFQUFFLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzlCLElBQUksRUFBRSxTQUFTO1NBQ2xCLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFNUMsSUFBSSxZQUFZLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3BDLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7WUFFbkMsVUFBVTtZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUNyQyxNQUFNLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMs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QUNkLGNBQWM7SUFDZCxnQkFBZ0I7SUFDaEIsV0FBVztDQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIGNvbnN0IEVkaXRvcjogYW55O1xuXG4vKipcbiAqIOaJi+WKqOa1i+ivleiEmuacrFxuICog5Y+v5Lul5ZyoIENvY29zIENyZWF0b3Ig5o6n5Yi25Y+w5Lit5omn6KGM5rWL6K+VXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3RTY2VuZVRvb2xzKCkge1xuICAgIGNvbnNvbGUubG9nKCc9PT0gVGVzdGluZyBTY2VuZSBUb29scyA9PT0nKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgICAvLyAxLiDojrflj5blnLrmma/kv6Hmga9cbiAgICAgICAgY29uc29sZS5sb2coJzEuIEdldHRpbmcgc2NlbmUgaW5mby4uLicpO1xuICAgICAgICBjb25zdCBzY2VuZUluZm8gPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdnZXQtc2NlbmUtaW5mbycpO1xuICAgICAgICBjb25zb2xlLmxvZygnU2NlbmUgaW5mbzonLCBzY2VuZUluZm8pO1xuICAgICAgICBcbiAgICAgICAgLy8gMi4g5Yib5bu66IqC54K5XG4gICAgICAgIGNvbnNvbGUubG9nKCdcXG4yLiBDcmVhdGluZyB0ZXN0IG5vZGUuLi4nKTtcbiAgICAgICAgY29uc3QgY3JlYXRlUmVzdWx0ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnY3JlYXRlLW5vZGUnLCB7XG4gICAgICAgICAgICBuYW1lOiAnVGVzdE5vZGVfJyArIERhdGUubm93KCksXG4gICAgICAgICAgICB0eXBlOiAnY2MuTm9kZSdcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDcmVhdGUgcmVzdWx0OicsIGNyZWF0ZVJlc3VsdCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoY3JlYXRlUmVzdWx0ICYmIGNyZWF0ZVJlc3VsdC51dWlkKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlVXVpZCA9IGNyZWF0ZVJlc3VsdC51dWlkO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyAzLiDmn6Xor6LoioLngrlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdcXG4zLiBRdWVyeWluZyBub2RlLi4uJyk7XG4gICAgICAgICAgICBjb25zdCBub2RlSW5mbyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3F1ZXJ5LW5vZGUnLCB7XG4gICAgICAgICAgICAgICAgdXVpZDogbm9kZVV1aWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vZGUgaW5mbzonLCBub2RlSW5mbyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIDQuIOiuvue9ruiKgueCueWxnuaAp1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1xcbjQuIFNldHRpbmcgbm9kZSBwb3NpdGlvbi4uLicpO1xuICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnc2V0LW5vZGUtcHJvcGVydHknLCB7XG4gICAgICAgICAgICAgICAgdXVpZDogbm9kZVV1aWQsXG4gICAgICAgICAgICAgICAgcGF0aDogJ3Bvc2l0aW9uJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogeyB4OiAxMDAsIHk6IDIwMCwgejogMCB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3NpdGlvbiBzZXQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIDUuIOa3u+WKoOe7hOS7tlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1xcbjUuIEFkZGluZyBTcHJpdGUgY29tcG9uZW50Li4uJyk7XG4gICAgICAgICAgICBjb25zdCBhZGRDb21wUmVzdWx0ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnYWRkLWNvbXBvbmVudCcsIHtcbiAgICAgICAgICAgICAgICB1dWlkOiBub2RlVXVpZCxcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICdjYy5TcHJpdGUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb21wb25lbnQgYWRkZWQ6JywgYWRkQ29tcFJlc3VsdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIDYuIOafpeivoue7hOS7tlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1xcbjYuIFF1ZXJ5aW5nIGNvbXBvbmVudC4uLicpO1xuICAgICAgICAgICAgY29uc3QgY29tcEluZm8gPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdxdWVyeS1ub2RlLWNvbXBvbmVudCcsIHtcbiAgICAgICAgICAgICAgICB1dWlkOiBub2RlVXVpZCxcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICdjYy5TcHJpdGUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb21wb25lbnQgaW5mbzonLCBjb21wSW5mbyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIDcuIOWIoOmZpOiKgueCuVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1xcbjcuIFJlbW92aW5nIHRlc3Qgbm9kZS4uLicpO1xuICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncmVtb3ZlLW5vZGUnLCB7XG4gICAgICAgICAgICAgICAgdXVpZDogbm9kZVV1aWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vZGUgcmVtb3ZlZCBzdWNjZXNzZnVsbHknKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdUZXN0IGZhaWxlZDonLCBlcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdEFzc2V0VG9vbHMoKSB7XG4gICAgY29uc29sZS5sb2coJ1xcbj09PSBUZXN0aW5nIEFzc2V0IFRvb2xzID09PScpO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAgIC8vIDEuIOafpeivoui1hOa6kFxuICAgICAgICBjb25zb2xlLmxvZygnMS4gUXVlcnlpbmcgaW1hZ2UgYXNzZXRzLi4uJyk7XG4gICAgICAgIGNvbnN0IGFzc2V0cyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ3F1ZXJ5LWFzc2V0cycsIHtcbiAgICAgICAgICAgIHBhdHRlcm46ICcqKi8qLnBuZycsXG4gICAgICAgICAgICBjY1R5cGU6ICdjYy5JbWFnZUFzc2V0J1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZvdW5kIGFzc2V0czonLCBhc3NldHM/Lmxlbmd0aCB8fCAwKTtcbiAgICAgICAgXG4gICAgICAgIC8vIDIuIOiOt+WPlui1hOa6kOS/oeaBr1xuICAgICAgICBjb25zb2xlLmxvZygnXFxuMi4gR2V0dGluZyBhc3NldCBkYXRhYmFzZSBpbmZvLi4uJyk7XG4gICAgICAgIGNvbnN0IGFzc2V0SW5mbyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ3F1ZXJ5LWFzc2V0LWluZm8nLCB7XG4gICAgICAgICAgICB1dWlkOiAnZGI6Ly9hc3NldHMnXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZygnQXNzZXQgaW5mbzonLCBhc3NldEluZm8pO1xuICAgICAgICBcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdUZXN0IGZhaWxlZDonLCBlcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdFByb2plY3RUb29scygpIHtcbiAgICBjb25zb2xlLmxvZygnXFxuPT09IFRlc3RpbmcgUHJvamVjdCBUb29scyA9PT0nKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgICAvLyAxLiDojrflj5bpobnnm67kv6Hmga9cbiAgICAgICAgY29uc29sZS5sb2coJzEuIEdldHRpbmcgcHJvamVjdCBpbmZvLi4uJyk7XG4gICAgICAgIGNvbnN0IHByb2plY3RJbmZvID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncHJvamVjdCcsICdxdWVyeS1pbmZvJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQcm9qZWN0IGluZm86JywgcHJvamVjdEluZm8pO1xuICAgICAgICBcbiAgICAgICAgLy8gMi4g5qOA5p+l5p6E5bu66IO95YqbXG4gICAgICAgIGNvbnNvbGUubG9nKCdcXG4yLiBDaGVja2luZyBidWlsZCBjYXBhYmlsaXR5Li4uJyk7XG4gICAgICAgIGNvbnN0IGNhbkJ1aWxkID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncHJvamVjdCcsICdjYW4tYnVpbGQnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ0NhbiBidWlsZDonLCBjYW5CdWlsZCk7XG4gICAgICAgIFxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Rlc3QgZmFpbGVkOicsIGVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW5BbGxUZXN0cygpIHtcbiAgICBjb25zb2xlLmxvZygnU3RhcnRpbmcgTUNQIFNlcnZlciBUb29scyBUZXN0Li4uXFxuJyk7XG4gICAgXG4gICAgYXdhaXQgdGVzdFNjZW5lVG9vbHMoKTtcbiAgICBhd2FpdCB0ZXN0QXNzZXRUb29scygpO1xuICAgIGF3YWl0IHRlc3RQcm9qZWN0VG9vbHMoKTtcbiAgICBcbiAgICBjb25zb2xlLmxvZygnXFxuPT09IEFsbCB0ZXN0cyBjb21wbGV0ZWQgPT09Jyk7XG59XG5cbi8vIOWvvOWHuuWIsOWFqOWxgO+8jOaWueS+v+WcqOaOp+WItuWPsOiwg+eUqFxuKGdsb2JhbCBhcyBhbnkpLk1DUFRlc3QgPSB7XG4gICAgdGVzdFNjZW5lVG9vbHMsXG4gICAgdGVzdEFzc2V0VG9vbHMsXG4gICAgdGVzdFByb2plY3RUb29scyxcbiAgICBydW5BbGxUZXN0c1xufTsiXX0=