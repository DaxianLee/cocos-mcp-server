declare const Editor: any;

/**
 * Manual test script
 * Can be run in the Cocos Creator console
 */

export async function testSceneTools() {
    console.log('=== Testing Scene Tools ===');
    
    try {
        // 1. Get scene information
        console.log('1. Getting scene info...');
        const sceneInfo = await Editor.Message.request('scene', 'get-scene-info');
        console.log('Scene info:', sceneInfo);
        
        // 2. Create a node
        console.log('\n2. Creating test node...');
        const createResult = await Editor.Message.request('scene', 'create-node', {
            name: 'TestNode_' + Date.now(),
            type: 'cc.Node'
        });
        console.log('Create result:', createResult);
        
        if (createResult && createResult.uuid) {
            const nodeUuid = createResult.uuid;
            
            // 3. Query the node
            console.log('\n3. Querying node...');
            const nodeInfo = await Editor.Message.request('scene', 'query-node', {
                uuid: nodeUuid
            });
            console.log('Node info:', nodeInfo);
            
            // 4. Set node properties
            console.log('\n4. Setting node position...');
            await Editor.Message.request('scene', 'set-node-property', {
                uuid: nodeUuid,
                path: 'position',
                value: { x: 100, y: 200, z: 0 }
            });
            console.log('Position set successfully');
            
            // 5. Add a component
            console.log('\n5. Adding Sprite component...');
            const addCompResult = await Editor.Message.request('scene', 'add-component', {
                uuid: nodeUuid,
                component: 'cc.Sprite'
            });
            console.log('Component added:', addCompResult);
            
            // 6. Query the component
            console.log('\n6. Querying component...');
            const compInfo = await Editor.Message.request('scene', 'query-node-component', {
                uuid: nodeUuid,
                component: 'cc.Sprite'
            });
            console.log('Component info:', compInfo);
            
            // 7. Delete the node
            console.log('\n7. Removing test node...');
            await Editor.Message.request('scene', 'remove-node', {
                uuid: nodeUuid
            });
            console.log('Node removed successfully');
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

export async function testAssetTools() {
    console.log('\n=== Testing Asset Tools ===');
    
    try {
        // 1. Query assets
        console.log('1. Querying image assets...');
        const assets = await Editor.Message.request('asset-db', 'query-assets', {
            pattern: '**/*.png',
            ccType: 'cc.ImageAsset'
        });
        console.log('Found assets:', assets?.length || 0);
        
        // 2. Get asset information
        console.log('\n2. Getting asset database info...');
        const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', {
            uuid: 'db://assets'
        });
        console.log('Asset info:', assetInfo);
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

export async function testProjectTools() {
    console.log('\n=== Testing Project Tools ===');
    
    try {
        // 1. Get project information
        console.log('1. Getting project info...');
        const projectInfo = await Editor.Message.request('project', 'query-info');
        console.log('Project info:', projectInfo);
        
        // 2. Check build capability
        console.log('\n2. Checking build capability...');
        const canBuild = await Editor.Message.request('project', 'can-build');
        console.log('Can build:', canBuild);
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

export async function runAllTests() {
    console.log('Starting MCP Server Tools Test...\n');
    
    await testSceneTools();
    await testAssetTools();
    await testProjectTools();
    
    console.log('\n=== All tests completed ===');
}

// Export globally for convenient console access
(global as any).MCPTest = {
    testSceneTools,
    testAssetTools,
    testProjectTools,
    runAllTests
};