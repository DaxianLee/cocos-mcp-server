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
                description: 'Set component property value',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        componentType: {
                            type: 'string',
                            description: 'Component type'
                        },
                        property: {
                            type: 'string',
                            description: 'Property name'
                        },
                        value: {
                            description: 'Property value'
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
                resolve({
                    success: true,
                    data: {
                        componentId: result,
                        message: `Component '${componentType}' added successfully`
                    }
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
                        type: comp.__type__ || 'Unknown',
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
                    const component = nodeData.__comps__.find((comp: any) => comp.__type__ === componentType);
                    
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
        return new Promise((resolve) => {
            // 首先获取节点信息以找到正确的组件索引
            Editor.Message.request('scene', 'query-node', args.nodeUuid).then((nodeData: any) => {
                if (!nodeData || !nodeData.__comps__) {
                    throw new Error('Node not found or no components data');
                }
                
                // 查找组件索引
                let componentIndex = -1;
                for (let i = 0; i < nodeData.__comps__.length; i++) {
                    const comp = nodeData.__comps__[i];
                    if (comp.__type__ === args.componentType) {
                        componentIndex = i;
                        break;
                    }
                }
                
                if (componentIndex === -1) {
                    throw new Error(`Component '${args.componentType}' not found on node`);
                }
                
                // 使用正确的组件索引路径
                const propertyPath = `__comps__.${componentIndex}.${args.property}`;
                
                return Editor.Message.request('scene', 'set-property', {
                    uuid: args.nodeUuid,
                    path: propertyPath,
                    dump: {
                        value: args.value
                    }
                });
            }).then(() => {
                resolve({
                    success: true,
                    message: `Component property '${args.property}' updated successfully`
                });
            }).catch((err: Error) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'setComponentProperty',
                    args: [args.nodeUuid, args.componentType, args.property, args.value]
                };
                Editor.Message.request('scene', 'execute-scene-script', options).then((result: any) => {
                    resolve(result);
                }).catch((err2: Error) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
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
                }).catch((err2: Error) => {
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
}