import { ToolDefinition, ToolResponse, ToolExecutor, ComponentInfo } from '../types';

export class ComponentTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            {
                name: 'add_component',
                description: 'Add a component to a specific node. IMPORTANT: You must provide the nodeUuid parameter to specify which node to add the component to.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Target node UUID. REQUIRED: You must specify the exact node to add the component to. Use get_all_nodes or find_node_by_name to get the UUID of the desired node.'
                        },
                        componentType: {
                            type: 'string',
                            description: 'Component type (e.g., cc.Sprite, cc.Label, cc.Button)'
                        }
                    },
                    required: ['nodeUuid', 'componentType']
                }
            },
            {
                name: 'remove_component',
                description: 'Remove a component from a node',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        componentType: {
                            type: 'string',
                            description: 'Component type to remove'
                        }
                    },
                    required: ['nodeUuid', 'componentType']
                }
            },
            {
                name: 'get_components',
                description: 'Get all components of a node',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID'
                        }
                    },
                    required: ['nodeUuid']
                }
            },
            {
                name: 'get_component_info',
                description: 'Get specific component information',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        componentType: {
                            type: 'string',
                            description: 'Component type to get info for'
                        }
                    },
                    required: ['nodeUuid', 'componentType']
                }
            },
            {
                name: 'set_component_property',
                description: 'Set component property value - AI必须提供5个参数：节点UUID、组件名称、属性名称、属性类型、属性值\n' +
                    '重要：对于引用类型属性：\n' +
                    '• 节点引用(propertyType: "node"): value传入目标节点的UUID字符串\n' +
                    '• 组件引用(propertyType: "component"): value传入目标组件的UUID字符串\n' +
                    '• 资源引用(propertyType: "spriteFrame/prefab/asset"): value传入资源UUID字符串',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID - 节点的UUID'
                        },
                        componentType: {
                            type: 'string',
                            description: 'Component type - 组件类型',
                            enum: ['cc.Label', 'cc.Sprite', 'cc.Button', 'cc.Toggle', 'cc.Slider', 'cc.ScrollView', 'cc.EditBox', 'cc.ProgressBar', 'cc.RichText', 'cc.Mask', 'cc.Graphics', 'cc.Layout', 'cc.Widget', 'cc.UITransform', 'TestMCPScript']
                        },
                        property: {
                            type: 'string',
                            description: 'Property name - 属性名称'
                        },
                        propertyType: {
                            type: 'string',
                            description: 'Property type - 属性类型（必须明确指定）',
                            enum: [
                                'string', 'number', 'boolean', 'integer', 'float',
                                'color', 'vec2', 'vec3', 'size',
                                'node', 'component', 'spriteFrame', 'prefab', 'asset',
                                'nodeArray', 'colorArray', 'numberArray', 'stringArray'
                            ]
                        },
                        value: {
                            description: 'Property value - 属性值，根据propertyType使用不同格式:\n' +
                                '基础类型：\n' +
                                '• string: "Hello World"\n' +
                                '• number/integer/float: 42 或 3.14\n' +
                                '• boolean: true 或 false\n' +
                                '• color: {"r":255,"g":0,"b":0,"a":255}\n' +
                                '• vec2: {"x":100,"y":50}\n' +
                                '• vec3: {"x":1,"y":2,"z":3}\n' +
                                '• size: {"width":100,"height":50}\n' +
                                '引用类型（重要）：\n' +
                                '• node: "target-node-uuid-string" （目标节点的UUID字符串）\n' +
                                '• component: "target-component-uuid-string" （目标组件的UUID字符串）\n' +
                                '• spriteFrame/prefab/asset: "asset-uuid-string" （资源UUID字符串）\n' +
                                '数组类型：\n' +
                                '• nodeArray: ["uuid1","uuid2","uuid3"]\n' +
                                '• colorArray: [{"r":255,"g":0,"b":0,"a":255},{"r":0,"g":255,"b":0,"a":255}]\n' +
                                '• numberArray: [1,2,3,4,5]\n' +
                                '• stringArray: ["item1","item2","item3"]'
                        }
                    },
                    required: ['nodeUuid', 'componentType', 'property', 'propertyType', 'value']
                }
            },
            {
                name: 'attach_script',
                description: 'Attach a script component to a node',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        scriptPath: {
                            type: 'string',
                            description: 'Script asset path (e.g., db://assets/scripts/MyScript.ts)'
                        }
                    },
                    required: ['nodeUuid', 'scriptPath']
                }
            },
            {
                name: 'get_available_components',
                description: 'Get list of available component types',
                inputSchema: {
                    type: 'object',
                    properties: {
                        category: {
                            type: 'string',
                            description: 'Component category filter',
                            enum: ['all', 'renderer', 'ui', 'physics', 'animation', 'audio'],
                            default: 'all'
                        }
                    }
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'add_component':
                return await this.addComponent(args.nodeUuid, args.componentType);
            case 'remove_component':
                return await this.removeComponent(args.nodeUuid, args.componentType);
            case 'get_components':
                return await this.getComponents(args.nodeUuid);
            case 'get_component_info':
                return await this.getComponentInfo(args.nodeUuid, args.componentType);
            case 'set_component_property':
                return await this.setComponentProperty(args);
            case 'attach_script':
                return await this.attachScript(args.nodeUuid, args.scriptPath);
            case 'get_available_components':
                return await this.getAvailableComponents(args.category);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async addComponent(nodeUuid: string, componentType: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            // 尝试直接使用 Editor API 添加组件
            Editor.Message.request('scene', 'create-component', {
                uuid: nodeUuid,
                component: componentType
            }).then((result: any) => {
                // Get comprehensive verification data including node info and all components
                Promise.all([
                    this.getComponents(nodeUuid),
                    this.getComponentInfo(nodeUuid, componentType)
                ]).then(([allComponentsInfo, newComponentInfo]) => {
                    const addedComponent = allComponentsInfo.data?.components?.find((comp: any) => comp.type === componentType);
                    resolve({
                        success: true,
                        data: {
                            componentId: result,
                            nodeUuid: nodeUuid,
                            componentType: componentType,
                            message: `Component '${componentType}' added successfully`,
                            componentVerified: !!addedComponent
                        },
                        verificationData: {
                            addedComponent: newComponentInfo.data,
                            allNodeComponents: allComponentsInfo.data,
                            componentCount: allComponentsInfo.data?.components?.length || 0,
                            verificationStatus: {
                                componentExists: !!addedComponent,
                                componentDetails: addedComponent || null
                            }
                        }
                    });
                }).catch(() => {
                    resolve({
                        success: true,
                        data: {
                            componentId: result,
                            nodeUuid: nodeUuid,
                            componentType: componentType,
                            message: `Component '${componentType}' added successfully (verification failed)`
                        }
                    });
                });
            }).catch((err: Error) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'addComponentToNode',
                    args: [nodeUuid, componentType]
                };
                
                Editor.Message.request('scene', 'execute-scene-script', options).then((result: any) => {
                    resolve(result);
                }).catch((err2: Error) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }

    private async removeComponent(nodeUuid: string, componentType: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            const options = {
                name: 'cocos-mcp-server',
                method: 'removeComponentFromNode',
                args: [nodeUuid, componentType]
            };
            
            Editor.Message.request('scene', 'execute-scene-script', options).then((result: any) => {
                resolve(result);
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async getComponents(nodeUuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            // 优先尝试直接使用 Editor API 查询节点信息
            Editor.Message.request('scene', 'query-node', nodeUuid).then((nodeData: any) => {
                if (nodeData && nodeData.__comps__) {
                    const components = nodeData.__comps__.map((comp: any) => ({
                        type: comp.__type__ || comp.cid || comp.type || 'Unknown',
                        enabled: comp.enabled !== undefined ? comp.enabled : true,
                        properties: this.extractComponentProperties(comp)
                    }));
                    
                    resolve({
                        success: true,
                        data: {
                            nodeUuid: nodeUuid,
                            components: components
                        }
                    });
                } else {
                    resolve({ success: false, error: 'Node not found or no components data' });
                }
            }).catch((err: Error) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'getNodeInfo',
                    args: [nodeUuid]
                };
                
                Editor.Message.request('scene', 'execute-scene-script', options).then((result: any) => {
                    if (result.success) {
                        resolve({
                            success: true,
                            data: result.data.components
                        });
                    } else {
                        resolve(result);
                    }
                }).catch((err2: Error) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }

    private async getComponentInfo(nodeUuid: string, componentType: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            // 优先尝试直接使用 Editor API 查询节点信息
            Editor.Message.request('scene', 'query-node', nodeUuid).then((nodeData: any) => {
                if (nodeData && nodeData.__comps__) {
                    const component = nodeData.__comps__.find((comp: any) => {
                        const compType = comp.__type__ || comp.cid || comp.type;
                        return compType === componentType;
                    });
                    
                    if (component) {
                        resolve({
                            success: true,
                            data: {
                                nodeUuid: nodeUuid,
                                componentType: componentType,
                                enabled: component.enabled !== undefined ? component.enabled : true,
                                properties: this.extractComponentProperties(component)
                            }
                        });
                    } else {
                        resolve({ success: false, error: `Component '${componentType}' not found on node` });
                    }
                } else {
                    resolve({ success: false, error: 'Node not found or no components data' });
                }
            }).catch((err: Error) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'getNodeInfo',
                    args: [nodeUuid]
                };
                
                Editor.Message.request('scene', 'execute-scene-script', options).then((result: any) => {
                    if (result.success && result.data.components) {
                        const component = result.data.components.find((comp: any) => comp.type === componentType);
                        if (component) {
                            resolve({
                                success: true,
                                data: {
                                    nodeUuid: nodeUuid,
                                    componentType: componentType,
                                    ...component
                                }
                            });
                        } else {
                            resolve({ success: false, error: `Component '${componentType}' not found on node` });
                        }
                    } else {
                        resolve({ success: false, error: result.error || 'Failed to get component info' });
                    }
                }).catch((err2: Error) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }

    private extractComponentProperties(component: any): Record<string, any> {
        console.log(`[extractComponentProperties] Processing component:`, Object.keys(component));
        
        // 检查组件是否有 value 属性，这通常包含实际的组件属性
        if (component.value && typeof component.value === 'object') {
            console.log(`[extractComponentProperties] Found component.value with properties:`, Object.keys(component.value));
            return component.value; // 直接返回 value 对象，它包含所有组件属性
        }
        
        // 备用方案：从组件对象中直接提取属性
        const properties: Record<string, any> = {};
        const excludeKeys = ['__type__', 'enabled', 'node', '_id', '__scriptAsset', 'uuid', 'name', '_name', '_objFlags', '_enabled', 'type', 'readonly', 'visible', 'cid', 'editor', 'extends'];
        
        for (const key in component) {
            if (!excludeKeys.includes(key) && !key.startsWith('_')) {
                console.log(`[extractComponentProperties] Found direct property '${key}':`, typeof component[key]);
                properties[key] = component[key];
            }
        }
        
        console.log(`[extractComponentProperties] Final extracted properties:`, Object.keys(properties));
        return properties;
    }

    private async setComponentProperty(args: any): Promise<ToolResponse> {
        const { nodeUuid, componentType, property, propertyType, value } = args;
        
        return new Promise(async (resolve) => {
            try {
                console.log(`[ComponentTools] Setting ${componentType}.${property} (type: ${propertyType}) = ${JSON.stringify(value)} on node ${nodeUuid}`);
                
                // Step 1: 获取组件信息，使用与getComponents相同的方法
                const componentsResponse = await this.getComponents(nodeUuid);
                if (!componentsResponse.success || !componentsResponse.data) {
                    resolve({
                        success: false,
                        error: `Failed to get components for node '${nodeUuid}': ${componentsResponse.error}`
                    });
                    return;
                }
                
                const allComponents = componentsResponse.data.components;
                
                // Step 2: 查找目标组件
                let targetComponent = null;
                const availableTypes: string[] = [];
                
                for (let i = 0; i < allComponents.length; i++) {
                    const comp = allComponents[i];
                    availableTypes.push(comp.type);
                    
                    if (comp.type === componentType) {
                        targetComponent = comp;
                        break;
                    }
                }
                
                if (!targetComponent) {
                    resolve({
                        success: false,
                        error: `Component '${componentType}' not found on node. Available components: ${availableTypes.join(', ')}`
                    });
                    return;
                }
                
                // Step 3: 自动检测和转换属性值
                let propertyInfo;
                try {
                    console.log(`[ComponentTools] Analyzing property: ${property}`);
                    propertyInfo = this.analyzeProperty(targetComponent, property);
                } catch (analyzeError: any) {
                    console.error(`[ComponentTools] Error in analyzeProperty:`, analyzeError);
                    resolve({
                        success: false,
                        error: `Failed to analyze property '${property}': ${analyzeError.message}`
                    });
                    return;
                }
                
                if (!propertyInfo.exists) {
                    resolve({
                        success: false,
                        error: `Property '${property}' not found on component '${componentType}'. Available properties: ${propertyInfo.availableProperties.join(', ')}`
                    });
                    return;
                }
                
                // Step 4: 处理属性值和设置
                const originalValue = propertyInfo.originalValue;
                let processedValue: any;
                
                // 根据明确的propertyType处理属性值
                switch (propertyType) {
                    case 'string':
                        processedValue = String(value);
                        break;
                    case 'number':
                    case 'integer':
                    case 'float':
                        processedValue = Number(value);
                        break;
                    case 'boolean':
                        processedValue = Boolean(value);
                        break;
                    case 'color':
                        if (typeof value === 'object' && value !== null) {
                            processedValue = {
                                r: Math.min(255, Math.max(0, Number(value.r) || 0)),
                                g: Math.min(255, Math.max(0, Number(value.g) || 0)),
                                b: Math.min(255, Math.max(0, Number(value.b) || 0)),
                                a: value.a !== undefined ? Math.min(255, Math.max(0, Number(value.a))) : 255
                            };
                        } else {
                            throw new Error('Color value must be an object with r, g, b properties');
                        }
                        break;
                    case 'vec2':
                        if (typeof value === 'object' && value !== null) {
                            processedValue = {
                                x: Number(value.x) || 0,
                                y: Number(value.y) || 0
                            };
                        } else {
                            throw new Error('Vec2 value must be an object with x, y properties');
                        }
                        break;
                    case 'vec3':
                        if (typeof value === 'object' && value !== null) {
                            processedValue = {
                                x: Number(value.x) || 0,
                                y: Number(value.y) || 0,
                                z: Number(value.z) || 0
                            };
                        } else {
                            throw new Error('Vec3 value must be an object with x, y, z properties');
                        }
                        break;
                    case 'size':
                        if (typeof value === 'object' && value !== null) {
                            processedValue = {
                                width: Number(value.width) || 0,
                                height: Number(value.height) || 0
                            };
                        } else {
                            throw new Error('Size value must be an object with width, height properties');
                        }
                        break;
                    case 'node':
                        if (typeof value === 'string') {
                            processedValue = { uuid: value };
                        } else {
                            throw new Error('Node reference value must be a string UUID');
                        }
                        break;
                    case 'component':
                        if (typeof value === 'string') {
                            // 组件引用：需要验证节点上是否有对应组件类型
                            // 推断组件类型从属性名称（例如：labelComponent -> Label, buttonComponent -> Button）
                            let expectedComponentType = '';
                            const propertyLower = property.toLowerCase(); 
                            if (propertyLower.includes('label')) {
                                expectedComponentType = 'cc.Label';
                            } else if (propertyLower.includes('button')) {
                                expectedComponentType = 'cc.Button';
                            } else if (propertyLower.includes('sprite')) {
                                expectedComponentType = 'cc.Sprite';
                            } else if (propertyLower.includes('canvas')) {
                                expectedComponentType = 'cc.Canvas';
                            } else if (propertyLower.includes('camera')) {
                                expectedComponentType = 'cc.Camera';
                            }
                            
                            // 验证目标节点是否存在指定组件
                            try {
                                const nodeData = await Editor.Message.request('scene', 'query-node', value);
                                if (nodeData && nodeData.__comps__ && expectedComponentType) {
                                    const targetComponent = nodeData.__comps__.find((comp: any) => 
                                        comp.__type__ === expectedComponentType
                                    );
                                    if (targetComponent) {
                                        // 找到匹配组件，使用组件的UUID
                                        processedValue = { uuid: (targetComponent as any).uuid || value };
                                    } else {
                                        console.warn(`[setComponentProperty] Node ${value} does not have component ${expectedComponentType}`);
                                        processedValue = { uuid: value }; // 仍然设置，让Editor处理
                                    }
                                } else {
                                    // 无法推断组件类型或节点不存在，直接使用UUID
                                    processedValue = { uuid: value };
                                }
                            } catch (error) {
                                console.warn(`[setComponentProperty] Failed to verify component on node ${value}: ${error}`);
                                processedValue = { uuid: value }; // 仍然设置，让Editor处理
                            }
                        } else if (typeof value === 'object' && value !== null && value.node && value.component) {
                            // 查找具体的组件UUID
                            try {
                                const nodeData = await Editor.Message.request('scene', 'query-node', value.node);
                                if (nodeData && nodeData.__comps__) {
                                    const targetComponent = nodeData.__comps__.find((comp: any) => 
                                        comp.__type__ === value.component
                                    );
                                    if (targetComponent) {
                                        processedValue = { uuid: (targetComponent as any).uuid || "" };
                                    } else {
                                        processedValue = { uuid: "" };
                                    }
                                } else {
                                    processedValue = { uuid: "" };
                                }
                            } catch (error) {
                                console.warn(`[setComponentProperty] Failed to find component: ${error}`);
                                processedValue = { uuid: "" };
                            }
                        } else {
                            throw new Error('Component reference value must be a string UUID or object with node and component properties');
                        }
                        break;
                    case 'spriteFrame':
                    case 'prefab':
                    case 'asset':
                        if (typeof value === 'string') {
                            processedValue = { uuid: value };
                        } else {
                            throw new Error(`${propertyType} value must be a string UUID`);
                        }
                        break;
                    case 'nodeArray':
                        if (Array.isArray(value)) {
                            processedValue = value.map((item: any) => {
                                if (typeof item === 'string') {
                                    return { uuid: item };
                                } else {
                                    throw new Error('NodeArray items must be string UUIDs');
                                }
                            });
                        } else {
                            throw new Error('NodeArray value must be an array');
                        }
                        break;
                    case 'colorArray':
                        if (Array.isArray(value)) {
                            processedValue = value.map((item: any) => {
                                if (typeof item === 'object' && item !== null && 'r' in item) {
                                    return {
                                        r: Math.min(255, Math.max(0, Number(item.r) || 0)),
                                        g: Math.min(255, Math.max(0, Number(item.g) || 0)),
                                        b: Math.min(255, Math.max(0, Number(item.b) || 0)),
                                        a: item.a !== undefined ? Math.min(255, Math.max(0, Number(item.a))) : 255
                                    };
                                } else {
                                    throw new Error('ColorArray items must be objects with r, g, b properties');
                                }
                            });
                        } else {
                            throw new Error('ColorArray value must be an array');
                        }
                        break;
                    case 'numberArray':
                        if (Array.isArray(value)) {
                            processedValue = value.map((item: any) => Number(item));
                        } else {
                            throw new Error('NumberArray value must be an array');
                        }
                        break;
                    case 'stringArray':
                        if (Array.isArray(value)) {
                            processedValue = value.map((item: any) => String(item));
                        } else {
                            throw new Error('StringArray value must be an array');
                        }
                        break;
                    default:
                        throw new Error(`Unsupported property type: ${propertyType}`);
                }
                
                console.log(`[ComponentTools] Converting value: ${JSON.stringify(value)} -> ${JSON.stringify(processedValue)} (type: ${propertyType})`);
                
                // Step 5: 获取原始节点数据来构建正确的路径
                const rawNodeData = await Editor.Message.request('scene', 'query-node', nodeUuid);
                if (!rawNodeData || !rawNodeData.__comps__) {
                    resolve({
                        success: false,
                        error: `Failed to get raw node data for property setting`
                    });
                    return;
                }
                
                // 找到原始组件的索引
                let rawComponentIndex = -1;
                for (let i = 0; i < rawNodeData.__comps__.length; i++) {
                    const comp = rawNodeData.__comps__[i] as any;
                    const compType = comp.__type__ || comp.cid || comp.type || 'Unknown';
                    if (compType === componentType) {
                        rawComponentIndex = i;
                        break;
                    }
                }
                
                if (rawComponentIndex === -1) {
                    resolve({
                        success: false,
                        error: `Could not find component index for setting property`
                    });
                    return;
                }
                
                // 构建正确的属性路径
                let propertyPath = `__comps__.${rawComponentIndex}.${property}`;
                
                // 特殊处理资源类属性
                if (propertyInfo.type === 'asset') {
                    // 对于资源类属性，需要特殊处理
                    const assetValue = typeof processedValue === 'string' ? 
                        { uuid: processedValue } : processedValue;
                    
                    // Determine asset type based on property name
                    let assetType = 'cc.SpriteFrame'; // default
                    if (property.toLowerCase().includes('texture')) {
                        assetType = 'cc.Texture2D';
                    } else if (property.toLowerCase().includes('material')) {
                        assetType = 'cc.Material';
                    } else if (property.toLowerCase().includes('font')) {
                        assetType = 'cc.Font';
                    } else if (property.toLowerCase().includes('clip')) {
                        assetType = 'cc.AudioClip';
                    }
                    
                    // Try multiple approaches for setting asset properties
                    try {
                        // Approach 1: Direct property setting with asset structure
                        await Editor.Message.request('scene', 'set-property', {
                            uuid: nodeUuid,
                            path: propertyPath,
                            dump: { 
                                value: assetValue,
                                type: assetType
                            }
                        });
                    } catch (error1) {
                        try {
                            // Approach 2: Try with different structure
                            await Editor.Message.request('scene', 'set-property', {
                                uuid: nodeUuid,
                                path: propertyPath,
                                dump: { 
                                    value: {
                                        __uuid__: assetValue.uuid || assetValue
                                    }
                                }
                            });
                        } catch (error2) {
                            // Approach 3: Try direct UUID assignment
                            await Editor.Message.request('scene', 'set-property', {
                                uuid: nodeUuid,
                                path: propertyPath,
                                dump: { value: assetValue.uuid || assetValue }
                            });
                        }
                    }
                } else if (componentType === 'cc.UITransform' && (property === '_contentSize' || property === 'contentSize')) {
                    // Special handling for UITransform contentSize - set width and height separately
                    const width = Number(value.width) || 100;
                    const height = Number(value.height) || 100;
                    
                    // Set width first
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: `__comps__.${rawComponentIndex}.width`,
                        dump: { value: width }
                    });
                    
                    // Then set height
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: `__comps__.${rawComponentIndex}.height`,
                        dump: { value: height }
                    });
                } else if (componentType === 'cc.UITransform' && (property === '_anchorPoint' || property === 'anchorPoint')) {
                    // Special handling for UITransform anchorPoint - set anchorX and anchorY separately
                    const anchorX = Number(value.x) || 0.5;
                    const anchorY = Number(value.y) || 0.5;
                    
                    // Set anchorX first
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: `__comps__.${rawComponentIndex}.anchorX`,
                        dump: { value: anchorX }
                    });
                    
                    // Then set anchorY  
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: `__comps__.${rawComponentIndex}.anchorY`,
                        dump: { value: anchorY }
                    });
                } else if (propertyInfo.type === 'color' && processedValue && typeof processedValue === 'object') {
                    // 特殊处理颜色属性，确保RGBA值正确
                    // Cocos Creator颜色值范围是0-255
                    const colorValue = {
                        r: Math.min(255, Math.max(0, Number(processedValue.r) || 0)),
                        g: Math.min(255, Math.max(0, Number(processedValue.g) || 0)),
                        b: Math.min(255, Math.max(0, Number(processedValue.b) || 0)),
                        a: processedValue.a !== undefined ? Math.min(255, Math.max(0, Number(processedValue.a))) : 255
                    };
                    
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: { 
                            value: colorValue,
                            type: 'cc.Color'
                        }
                    });
                } else if (propertyInfo.type === 'vec3' && processedValue && typeof processedValue === 'object') {
                    // 特殊处理Vec3属性
                    const vec3Value = {
                        x: Number(processedValue.x) || 0,
                        y: Number(processedValue.y) || 0,
                        z: Number(processedValue.z) || 0
                    };
                    
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: { 
                            value: vec3Value,
                            type: 'cc.Vec3'
                        }
                    });
                } else if (propertyInfo.type === 'vec2' && processedValue && typeof processedValue === 'object') {
                    // 特殊处理Vec2属性
                    const vec2Value = {
                        x: Number(processedValue.x) || 0,
                        y: Number(processedValue.y) || 0
                    };
                    
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: { 
                            value: vec2Value,
                            type: 'cc.Vec2'
                        }
                    });
                } else if (propertyInfo.type === 'size' && processedValue && typeof processedValue === 'object') {
                    // 特殊处理Size属性
                    const sizeValue = {
                        width: Number(processedValue.width) || 0,
                        height: Number(processedValue.height) || 0
                    };
                    
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: { 
                            value: sizeValue,
                            type: 'cc.Size'
                        }
                    });
                } else if ((propertyInfo.type === 'node' || propertyInfo.type === 'cc.Node') && processedValue && typeof processedValue === 'object' && 'uuid' in processedValue) {
                    // 特殊处理节点引用
                    console.log(`[ComponentTools] Setting node reference with UUID: ${processedValue.uuid}`);
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: { 
                            value: processedValue,
                            type: 'cc.Node'
                        }
                    });
                } else if (propertyInfo.type === 'component') {
                    // 特殊处理组件引用 - 方案B：使用完整的属性描述符
                    let componentValue;
                    let originalPropertyDescriptor: any = {};
                    
                    // 关键优化：获取完整的原始属性描述符
                    try {
                        const tempResult = await this.getComponentInfo(nodeUuid, componentType);
                        if (tempResult.success && tempResult.data?.properties?.[property]) {
                            const propertyMeta = tempResult.data.properties[property];
                            if (propertyMeta && typeof propertyMeta === 'object') {
                                // 保存完整的属性描述符（除了value之外的所有信息）
                                originalPropertyDescriptor = { ...propertyMeta };
                                delete originalPropertyDescriptor.value; // 移除旧的value，我们会设置新的
                                console.log(`[setComponentProperty] Preserving original property descriptor for ${property}:`, Object.keys(originalPropertyDescriptor));
                            }
                        }
                    } catch (error) {
                        console.warn(`[setComponentProperty] Failed to get original property descriptor: ${error}`);
                    }
                    
                    if (typeof processedValue === 'string') {
                        // 如果是字符串，假设是组件的UUID
                        componentValue = { uuid: processedValue };
                    } else if (processedValue && typeof processedValue === 'object') {
                        if (processedValue.node && processedValue.component) {
                            // 如果提供了节点和组件类型，需要查找具体的组件UUID
                            try {
                                const nodeData = await Editor.Message.request('scene', 'query-node', processedValue.node);
                                if (nodeData && nodeData.__comps__) {
                                    const targetComponent = nodeData.__comps__.find((comp: any) => 
                                        comp.__type__ === processedValue.component
                                    );
                                    if (targetComponent) {
                                        componentValue = { uuid: (targetComponent as any).uuid || "" };
                                    } else {
                                        componentValue = { uuid: "" };
                                    }
                                } else {
                                    componentValue = { uuid: "" };
                                }
                            } catch (error) {
                                console.warn(`[setComponentProperty] Failed to find component: ${error}`);
                                componentValue = { uuid: "" };
                            }
                        } else {
                            componentValue = processedValue;
                        }
                    } else {
                        componentValue = { uuid: "" };
                    }
                    
                    // 方案B：使用完整的属性描述符，保持所有原始元数据
                    const dumpData = {
                        value: componentValue,
                        ...originalPropertyDescriptor // 保持完整的属性描述符
                    };
                    
                    console.log(`[setComponentProperty] Setting with complete descriptor:`, Object.keys(dumpData));
                    
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: dumpData
                    });
                } else if (propertyInfo.type === 'nodeArray' && Array.isArray(processedValue)) {
                    // 特殊处理节点数组
                    const nodeArrayValue = processedValue.map((item: any) => {
                        if (typeof item === 'string') {
                            return { __uuid__: item };
                        } else if (item && typeof item === 'object' && (item.uuid || item.__uuid__)) {
                            return { __uuid__: item.uuid || item.__uuid__ };
                        } else {
                            return { __uuid__: "" };
                        }
                    });
                    
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: { 
                            value: nodeArrayValue,
                            type: 'cc.Node'
                        }
                    });
                } else if (propertyInfo.type === 'colorArray' && Array.isArray(processedValue)) {
                    // 特殊处理颜色数组
                    const colorArrayValue = processedValue.map((item: any) => {
                        if (item && typeof item === 'object' && 'r' in item) {
                            return {
                                r: Math.min(255, Math.max(0, Number(item.r) || 0)),
                                g: Math.min(255, Math.max(0, Number(item.g) || 0)),
                                b: Math.min(255, Math.max(0, Number(item.b) || 0)),
                                a: item.a !== undefined ? Math.min(255, Math.max(0, Number(item.a))) : 255
                            };
                        } else {
                            return { r: 255, g: 255, b: 255, a: 255 };
                        }
                    });
                    
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: { 
                            value: colorArrayValue,
                            type: 'cc.Color'
                        }
                    });
                } else {
                    // Normal property setting for non-asset properties
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: { value: processedValue }
                    });
                }
                
                // Step 5: 等待Editor完成更新，然后验证设置结果
                await new Promise(resolve => setTimeout(resolve, 200)); // 等待200ms让Editor完成更新
                const verification = await this.verifyPropertyChange(nodeUuid, componentType, property, originalValue, processedValue);
                
                resolve({
                    success: true,
                    message: `Successfully set ${componentType}.${property} = ${JSON.stringify(processedValue)}`,
                    data: {
                        nodeUuid,
                        componentType,
                        property,
                        originalValue,
                        newValue: processedValue,
                        actualValue: verification.actualValue,
                        changeVerified: verification.verified
                    },
                    verificationData: verification.fullData
                });
                
            } catch (error: any) {
                console.error(`[ComponentTools] Error setting property:`, error);
                resolve({
                    success: false,
                    error: `Failed to set property: ${error.message}`
                });
            }
        });
    }


    private async attachScript(nodeUuid: string, scriptPath: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            // 从脚本路径提取组件类名
            const scriptName = scriptPath.split('/').pop()?.replace('.ts', '').replace('.js', '');
            if (!scriptName) {
                resolve({ success: false, error: 'Invalid script path' });
                return;
            }
            
            // 首先尝试直接使用脚本名称作为组件类型
            Editor.Message.request('scene', 'create-component', {
                uuid: nodeUuid,
                component: scriptName  // 使用脚本名称而非UUID
            }).then((result: any) => {
                resolve({
                    success: true,
                    data: {
                        componentId: result,
                        scriptPath: scriptPath,
                        componentName: scriptName,
                        message: `Script '${scriptName}' attached successfully`
                    }
                });
            }).catch((err: Error) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'attachScript',
                    args: [nodeUuid, scriptPath]
                };
                
                Editor.Message.request('scene', 'execute-scene-script', options).then((result: any) => {
                    resolve(result);
                }).catch(() => {
                    resolve({ 
                        success: false, 
                        error: `Failed to attach script '${scriptName}': ${err.message}`,
                        instruction: 'Please ensure the script is properly compiled and exported as a Component class. You can also manually attach the script through the Properties panel in the editor.'
                    });
                });
            });
        });
    }

    private async getAvailableComponents(category: string = 'all'): Promise<ToolResponse> {
        const componentCategories: Record<string, string[]> = {
            renderer: ['cc.Sprite', 'cc.Label', 'cc.RichText', 'cc.Mask', 'cc.Graphics'],
            ui: ['cc.Button', 'cc.Toggle', 'cc.Slider', 'cc.ScrollView', 'cc.EditBox', 'cc.ProgressBar'],
            physics: ['cc.RigidBody2D', 'cc.BoxCollider2D', 'cc.CircleCollider2D', 'cc.PolygonCollider2D'],
            animation: ['cc.Animation', 'cc.AnimationClip', 'cc.SkeletalAnimation'],
            audio: ['cc.AudioSource'],
            layout: ['cc.Layout', 'cc.Widget', 'cc.PageView', 'cc.PageViewIndicator'],
            effects: ['cc.MotionStreak', 'cc.ParticleSystem2D'],
            camera: ['cc.Camera'],
            light: ['cc.Light', 'cc.DirectionalLight', 'cc.PointLight', 'cc.SpotLight']
        };

        let components: string[] = [];
        
        if (category === 'all') {
            for (const cat in componentCategories) {
                components = components.concat(componentCategories[cat]);
            }
        } else if (componentCategories[category]) {
            components = componentCategories[category];
        }

        return {
            success: true,
            data: {
                category: category,
                components: components
            }
        };
    }

    private isValidPropertyDescriptor(propData: any): boolean {
        // 检查是否是有效的属性描述对象
        if (typeof propData !== 'object' || propData === null) {
            return false;
        }
        
        try {
            const keys = Object.keys(propData);
            
            // 避免遍历简单的数值对象（如 {width: 200, height: 150}）
            const isSimpleValueObject = keys.every(key => {
                const value = propData[key];
                return typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean';
            });
            
            if (isSimpleValueObject) {
                return false;
            }
            
            // 检查是否包含属性描述符的特征字段，不使用'in'操作符
            const hasName = keys.includes('name');
            const hasValue = keys.includes('value');
            const hasType = keys.includes('type');
            const hasDisplayName = keys.includes('displayName');
            const hasReadonly = keys.includes('readonly');
            
            // 必须包含name或value字段，且通常还有type字段
            const hasValidStructure = (hasName || hasValue) && (hasType || hasDisplayName || hasReadonly);
            
            // 额外检查：如果有default字段且结构复杂，避免深度遍历
            if (keys.includes('default') && propData.default && typeof propData.default === 'object') {
                const defaultKeys = Object.keys(propData.default);
                if (defaultKeys.includes('value') && typeof propData.default.value === 'object') {
                    // 这种情况下，我们只返回顶层属性，不深入遍历default.value
                    return hasValidStructure;
                }
            }
            
            return hasValidStructure;
        } catch (error) {
            console.warn(`[isValidPropertyDescriptor] Error checking property descriptor:`, error);
            return false;
        }
    }

    private analyzeProperty(component: any, propertyName: string): { exists: boolean; type: string; availableProperties: string[]; originalValue: any } {
        // 从复杂的组件结构中提取可用属性
        const availableProperties: string[] = [];
        let propertyValue: any = undefined;
        let propertyExists = false;
        
        // 尝试多种方式查找属性：
        // 1. 直接属性访问
        if (Object.prototype.hasOwnProperty.call(component, propertyName)) {
            propertyValue = component[propertyName];
            propertyExists = true;
        }
        
        // 2. 从嵌套结构中查找 (如从测试数据看到的复杂结构)
        if (!propertyExists && component.properties && typeof component.properties === 'object') {
            // 首先检查properties.value是否存在（这是我们在getComponents中看到的结构）
            if (component.properties.value && typeof component.properties.value === 'object') {
                const valueObj = component.properties.value;
                for (const [key, propData] of Object.entries(valueObj)) {
                    // 检查propData是否是一个有效的属性描述对象
                    // 确保propData是对象且包含预期的属性结构
                    if (this.isValidPropertyDescriptor(propData)) {
                        const propInfo = propData as any;
                        availableProperties.push(key);
                        if (key === propertyName) {
                            // 优先使用value属性，如果没有则使用propData本身
                            try {
                                const propKeys = Object.keys(propInfo);
                                propertyValue = propKeys.includes('value') ? propInfo.value : propInfo;
                            } catch (error) {
                                // 如果检查失败，直接使用propInfo
                                propertyValue = propInfo;
                            }
                            propertyExists = true;
                        }
                    }
                }
            } else {
                // 备用方案：直接从properties查找
                for (const [key, propData] of Object.entries(component.properties)) {
                    if (this.isValidPropertyDescriptor(propData)) {
                        const propInfo = propData as any;
                        availableProperties.push(key);
                        if (key === propertyName) {
                            // 优先使用value属性，如果没有则使用propData本身
                            try {
                                const propKeys = Object.keys(propInfo);
                                propertyValue = propKeys.includes('value') ? propInfo.value : propInfo;
                            } catch (error) {
                                // 如果检查失败，直接使用propInfo
                                propertyValue = propInfo;
                            }
                            propertyExists = true;
                        }
                    }
                }
            }
        }
        
        // 3. 从直接属性中提取简单属性名
        if (availableProperties.length === 0) {
            for (const key of Object.keys(component)) {
                if (!key.startsWith('_') && !['__type__', 'cid', 'node', 'uuid', 'name', 'enabled', 'type', 'readonly', 'visible'].includes(key)) {
                    availableProperties.push(key);
                }
            }
        }
        
        if (!propertyExists) {
            return {
                exists: false,
                type: 'unknown',
                availableProperties,
                originalValue: undefined
            };
        }
        
        let type = 'unknown';
        
        // 智能类型检测
        if (Array.isArray(propertyValue)) {
            // 数组类型检测
            if (propertyName.toLowerCase().includes('node')) {
                type = 'nodeArray';
            } else if (propertyName.toLowerCase().includes('color')) {
                type = 'colorArray';
            } else {
                type = 'array';
            }
        } else if (typeof propertyValue === 'string') {
            // Check if property name suggests it's an asset
            if (['spriteFrame', 'texture', 'material', 'font', 'clip', 'prefab'].includes(propertyName.toLowerCase())) {
                type = 'asset';
            } else {
                type = 'string';
            }
        } else if (typeof propertyValue === 'number') {
            type = 'number';
        } else if (typeof propertyValue === 'boolean') {
            type = 'boolean';
        } else if (propertyValue && typeof propertyValue === 'object') {
            try {
                const keys = Object.keys(propertyValue);
                if (keys.includes('r') && keys.includes('g') && keys.includes('b')) {
                    type = 'color';
                } else if (keys.includes('x') && keys.includes('y')) {
                    type = propertyValue.z !== undefined ? 'vec3' : 'vec2';
                } else if (keys.includes('width') && keys.includes('height')) {
                    type = 'size';
                } else if (keys.includes('uuid') || keys.includes('__uuid__')) {
                    // 检查是否是节点引用（通过属性名或__id__属性判断）
                    if (propertyName.toLowerCase().includes('node') || 
                        propertyName.toLowerCase().includes('target') ||
                        keys.includes('__id__')) {
                        type = 'node';
                    } else {
                        type = 'asset';
                    }
                } else if (keys.includes('__id__')) {
                    // 节点引用特征
                    type = 'node';
                } else {
                    type = 'object';
                }
            } catch (error) {
                console.warn(`[analyzeProperty] Error checking property type for: ${JSON.stringify(propertyValue)}`);
                type = 'object';
            }
        } else if (propertyValue === null || propertyValue === undefined) {
            // For null/undefined values, check property name to determine type
            if (['spriteFrame', 'texture', 'material', 'font', 'clip', 'prefab'].includes(propertyName.toLowerCase())) {
                type = 'asset';
            } else if (propertyName.toLowerCase().includes('node') || 
                      propertyName.toLowerCase().includes('target')) {
                type = 'node';
            } else if (propertyName.toLowerCase().includes('component')) {
                type = 'component';
            } else {
                type = 'unknown';
            }
        }
        
        return {
            exists: true,
            type,
            availableProperties,
            originalValue: propertyValue
        };
    }

    private smartConvertValue(inputValue: any, propertyInfo: any): any {
        const { type, originalValue } = propertyInfo;
        
        console.log(`[smartConvertValue] Converting ${JSON.stringify(inputValue)} to type: ${type}`);
        
        switch (type) {
            case 'string':
                return String(inputValue);
                
            case 'number':
                return Number(inputValue);
                
            case 'boolean':
                if (typeof inputValue === 'boolean') return inputValue;
                if (typeof inputValue === 'string') {
                    return inputValue.toLowerCase() === 'true' || inputValue === '1';
                }
                return Boolean(inputValue);
                
            case 'color':
                if (typeof inputValue === 'object' && inputValue !== null) {
                    // 先检查对象的值是否都是数字或字符串，避免对复杂对象使用'in'操作符
                    try {
                        // 如果输入是颜色对象，直接使用
                        const inputKeys = Object.keys(inputValue);
                        if (inputKeys.includes('r') || inputKeys.includes('g') || inputKeys.includes('b')) {
                            return {
                                r: Number(inputValue.r) || 0,
                                g: Number(inputValue.g) || 0,
                                b: Number(inputValue.b) || 0,
                                a: inputValue.a !== undefined ? Number(inputValue.a) : 255
                            };
                        }
                    } catch (error) {
                        // 如果使用'in'操作符出错，说明不是有效的颜色对象
                        console.warn(`[smartConvertValue] Invalid color input: ${JSON.stringify(inputValue)}`);
                    }
                } else if (typeof inputValue === 'string') {
                    // 如果是字符串，尝试解析为十六进制颜色
                    return this.parseColorString(inputValue);
                }
                // 保持原值结构，只更新提供的值
                try {
                    const inputKeys = typeof inputValue === 'object' && inputValue ? Object.keys(inputValue) : [];
                    return {
                        r: inputKeys.includes('r') ? Number(inputValue.r) : (originalValue.r || 255),
                        g: inputKeys.includes('g') ? Number(inputValue.g) : (originalValue.g || 255),
                        b: inputKeys.includes('b') ? Number(inputValue.b) : (originalValue.b || 255),
                        a: inputKeys.includes('a') ? Number(inputValue.a) : (originalValue.a || 255)
                    };
                } catch (error) {
                    // 如果有任何错误，返回原值或默认值
                    return {
                        r: originalValue.r || 255,
                        g: originalValue.g || 255,
                        b: originalValue.b || 255,
                        a: originalValue.a || 255
                    };
                }
                
            case 'vec2':
                if (typeof inputValue === 'object' && inputValue !== null) {
                    return {
                        x: Number(inputValue.x) || originalValue.x || 0,
                        y: Number(inputValue.y) || originalValue.y || 0
                    };
                }
                return originalValue;
                
            case 'vec3':
                if (typeof inputValue === 'object' && inputValue !== null) {
                    return {
                        x: Number(inputValue.x) || originalValue.x || 0,
                        y: Number(inputValue.y) || originalValue.y || 0,
                        z: Number(inputValue.z) || originalValue.z || 0
                    };
                }
                return originalValue;
                
            case 'size':
                if (typeof inputValue === 'object' && inputValue !== null) {
                    return {
                        width: Number(inputValue.width) || originalValue.width || 100,
                        height: Number(inputValue.height) || originalValue.height || 100
                    };
                }
                return originalValue;
                
            case 'node':
                if (typeof inputValue === 'string') {
                    // 节点引用需要特殊处理
                    return inputValue;
                } else if (typeof inputValue === 'object' && inputValue !== null) {
                    // 如果已经是对象形式，返回UUID或完整对象
                    return inputValue.uuid || inputValue;
                }
                return originalValue;
                
            case 'asset':
                if (typeof inputValue === 'string') {
                    // 如果输入是字符串路径，转换为asset对象
                    return { uuid: inputValue };
                } else if (typeof inputValue === 'object' && inputValue !== null) {
                    return inputValue;
                }
                return originalValue;
                
            default:
                // 对于未知类型，尽量保持原有结构
                if (typeof inputValue === typeof originalValue) {
                    return inputValue;
                }
                return originalValue;
        }
    }

    private parseColorString(colorStr: string): { r: number; g: number; b: number; a: number } {
        // 简单的颜色字符串解析（支持#RRGGBB格式） // cSpell:ignore RRGGBB
        if (colorStr.startsWith('#') && colorStr.length === 7) {
            const r = parseInt(colorStr.substring(1, 3), 16);
            const g = parseInt(colorStr.substring(3, 5), 16);
            const b = parseInt(colorStr.substring(5, 7), 16);
            return { r, g, b, a: 255 };
        }
        // 默认返回白色
        return { r: 255, g: 255, b: 255, a: 255 };
    }

    private async verifyPropertyChange(nodeUuid: string, componentType: string, property: string, originalValue: any, expectedValue: any): Promise<{ verified: boolean; actualValue: any; fullData: any }> {
        console.log(`[verifyPropertyChange] Starting verification for ${componentType}.${property}`);
        console.log(`[verifyPropertyChange] Expected value:`, JSON.stringify(expectedValue));
        console.log(`[verifyPropertyChange] Original value:`, JSON.stringify(originalValue));
        
        try {
            // 重新获取组件信息进行验证
            console.log(`[verifyPropertyChange] Calling getComponentInfo...`);
            const componentInfo = await this.getComponentInfo(nodeUuid, componentType);
            console.log(`[verifyPropertyChange] getComponentInfo success:`, componentInfo.success);
            
            const allComponents = await this.getComponents(nodeUuid);
            console.log(`[verifyPropertyChange] getComponents success:`, allComponents.success);
            
            if (componentInfo.success && componentInfo.data) {
                console.log(`[verifyPropertyChange] Component data available, extracting property '${property}'`);
                const allPropertyNames = Object.keys(componentInfo.data.properties || {});
                console.log(`[verifyPropertyChange] Available properties:`, allPropertyNames);
                const propertyData = componentInfo.data.properties?.[property];
                console.log(`[verifyPropertyChange] Raw property data for '${property}':`, JSON.stringify(propertyData));
                
                // 从属性数据中提取实际值
                let actualValue = propertyData;
                console.log(`[verifyPropertyChange] Initial actualValue:`, JSON.stringify(actualValue));
                
                if (propertyData && typeof propertyData === 'object' && 'value' in propertyData) {
                    actualValue = propertyData.value;
                    console.log(`[verifyPropertyChange] Extracted actualValue from .value:`, JSON.stringify(actualValue));
                } else {
                    console.log(`[verifyPropertyChange] No .value property found, using raw data`);
                }
                
                // 修复验证逻辑：检查实际值是否匹配期望值
                let verified = false;
                
                if (typeof expectedValue === 'object' && expectedValue !== null && 'uuid' in expectedValue) {
                    // 对于引用类型（节点/组件/资源），比较UUID
                    const actualUuid = actualValue && typeof actualValue === 'object' && 'uuid' in actualValue ? actualValue.uuid : '';
                    const expectedUuid = expectedValue.uuid || '';
                    verified = actualUuid === expectedUuid && expectedUuid !== '';
                    
                    console.log(`[verifyPropertyChange] Reference comparison:`);
                    console.log(`  - Expected UUID: "${expectedUuid}"`);
                    console.log(`  - Actual UUID: "${actualUuid}"`);
                    console.log(`  - UUID match: ${actualUuid === expectedUuid}`);
                    console.log(`  - UUID not empty: ${expectedUuid !== ''}`);
                    console.log(`  - Final verified: ${verified}`);
                } else {
                    // 对于其他类型，直接比较值
                    console.log(`[verifyPropertyChange] Value comparison:`);
                    console.log(`  - Expected type: ${typeof expectedValue}`);
                    console.log(`  - Actual type: ${typeof actualValue}`);
                    
                    if (typeof actualValue === typeof expectedValue) {
                        if (typeof actualValue === 'object' && actualValue !== null && expectedValue !== null) {
                            // 对象类型的深度比较
                            verified = JSON.stringify(actualValue) === JSON.stringify(expectedValue);
                            console.log(`  - Object comparison (JSON): ${verified}`);
                        } else {
                            // 基本类型的直接比较
                            verified = actualValue === expectedValue;
                            console.log(`  - Direct comparison: ${verified}`);
                        }
                    } else {
                        // 类型不匹配时的特殊处理（如数字和字符串）
                        const stringMatch = String(actualValue) === String(expectedValue);
                        const numberMatch = Number(actualValue) === Number(expectedValue);
                        verified = stringMatch || numberMatch;
                        console.log(`  - String match: ${stringMatch}`);
                        console.log(`  - Number match: ${numberMatch}`);
                        console.log(`  - Type mismatch verified: ${verified}`);
                    }
                }
                
                console.log(`[verifyPropertyChange] Final verification result: ${verified}`);
                console.log(`[verifyPropertyChange] Final actualValue:`, JSON.stringify(actualValue));
                
                const result = {
                    verified,
                    actualValue,
                    fullData: {
                        // 只返回修改的属性信息，不返回完整组件数据
                        modifiedProperty: {
                            name: property,
                            before: originalValue,
                            expected: expectedValue,
                            actual: actualValue,
                            verified,
                            propertyMetadata: propertyData // 只包含这个属性的元数据
                        },
                        // 简化的组件信息
                        componentSummary: {
                            nodeUuid,
                            componentType,
                            totalProperties: Object.keys(componentInfo.data?.properties || {}).length
                        }
                    }
                };
                
                console.log(`[verifyPropertyChange] Returning result:`, JSON.stringify(result, null, 2));
                return result;
            } else {
                console.log(`[verifyPropertyChange] ComponentInfo failed or no data:`, componentInfo);
            }
        } catch (error) {
            console.error('[verifyPropertyChange] Verification failed with error:', error);
            console.error('[verifyPropertyChange] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        }
        
        console.log(`[verifyPropertyChange] Returning fallback result`);
        return {
            verified: false,
            actualValue: undefined,
            fullData: null
        };
    }
}