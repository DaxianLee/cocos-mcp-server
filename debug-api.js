// 测试可用的 Editor API
const testMethods = [
    'scene.query-node-tree',
    'scene.create-node',
    'scene.remove-node',
    'scene.set-property',
    'scene.create-component',
    'scene.remove-component',
    'scene.add-component',
    'scene.query-node',
    'scene.query-scene',
    'scene.query-hierarchy'
];

async function testAPI() {
    console.log('Testing available Editor API methods...');
    
    for (const method of testMethods) {
        console.log(`\nTesting: ${method}`);
        
        try {
            const response = await fetch('http://localhost:8585/mcp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'tools/call',
                    params: {
                        name: 'debug_test_editor_api',
                        arguments: {
                            method: method.replace('.', ' - ')
                        }
                    }
                })
            });
            
            const data = await response.json();
            console.log(`Response: ${JSON.stringify(data)}`);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }
}

testAPI();