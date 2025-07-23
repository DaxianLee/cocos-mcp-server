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
                description: 'Set component property value - AI只需提供4个简单参数：节点UUID、组件名称、属性名称、属性值',
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
                            enum: ['cc.Label', 'cc.Sprite', 'cc.Button', 'cc.Toggle', 'cc.Slider', 'cc.ScrollView', 'cc.EditBox', 'cc.ProgressBar', 'cc.RichText', 'cc.Mask', 'cc.Graphics', 'cc.Layout', 'cc.Widget', 'cc.UITransform']
                        },
                        property: {
                            type: 'string',
                            description: 'Property name - 属性名称，常见值: string(文本), color(颜色), fontSize(字体大小), spriteFrame(精灵帧), enabled(启用状态), position(位置), scale(缩放), rotation(旋转)'
                        },
                        value: {
                            description: 'Property value - 属性值，支持的类型:\n• 字符串: "Hello World"\n• 数字: 32, 1.5\n• 布尔值: true, false\n• 颜色对象: {"r":255,"g":0,"b":0,"a":255} 或 "#FF0000"\n• 向量对象: {"x":100,"y":50} 或 {"x":1,"y":2,"z":3}\n• 尺寸对象: {"width":100,"height":50}\n• 资源UUID: "asset-uuid-string"'
                        }
                    },
                    required: ['nodeUuid', 'componentType', 'property', 'value']
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
        const properties: Record<string, any> = {};
        const excludeKeys = ['__type__', 'enabled', 'node', '_id'];
        
        for (const key in component) {
            if (!excludeKeys.includes(key) && !key.startsWith('_')) {
                properties[key] = component[key];
            }
        }
        
        return properties;
    }

    private async setComponentProperty(args: any): Promise<ToolResponse> {
        const { nodeUuid, componentType, property, value } = args;
        
        return new Promise(async (resolve) => {
            try {
                console.log(`[ComponentTools] Setting ${componentType}.${property} = ${JSON.stringify(value)} on node ${nodeUuid}`);
                
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
                
                const processedValue = this.smartConvertValue(value, propertyInfo);
                const originalValue = propertyInfo.originalValue;
                
                console.log(`[ComponentTools] Converting value: ${JSON.stringify(value)} -> ${JSON.stringify(processedValue)} (type: ${propertyInfo.type})`);
                
                // Step 4: 设置属性值
                // 需要重新获取原始节点数据来构建正确的路径
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
                } else {
                    // Normal property setting for non-asset properties
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: { value: processedValue }
                    });
                }
                
                // Step 5: 验证设置结果
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
        if (typeof propertyValue === 'string') {
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
                    type = 'asset';
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
                                a: Number(inputValue.a) !== undefined ? Number(inputValue.a) : 255
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
        try {
            // 重新获取组件信息进行验证
            const componentInfo = await this.getComponentInfo(nodeUuid, componentType);
            const allComponents = await this.getComponents(nodeUuid);
            
            if (componentInfo.success && componentInfo.data) {
                const actualValue = componentInfo.data.properties?.[property];
                const verified = JSON.stringify(actualValue) !== JSON.stringify(originalValue);
                
                return {
                    verified,
                    actualValue,
                    fullData: {
                        updatedComponent: componentInfo.data,
                        allNodeComponents: allComponents.data,
                        changeDetails: {
                            property,
                            before: originalValue,
                            expected: expectedValue,
                            actual: actualValue,
                            verified
                        }
                    }
                };
            }
        } catch (error) {
            console.warn('[verifyPropertyChange] Verification failed:', error);
        }
        
        return {
            verified: false,
            actualValue: undefined,
            fullData: null
        };
    }
}