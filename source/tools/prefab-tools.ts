import { ToolDefinition, ToolResponse, ToolExecutor, PrefabInfo } from '../types';

export class PrefabTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            {
                name: 'get_prefab_list',
                description: 'Get all prefabs in the project',
                inputSchema: {
                    type: 'object',
                    properties: {
                        folder: {
                            type: 'string',
                            description: 'Folder path to search (optional)',
                            default: 'db://assets'
                        }
                    }
                }
            },
            {
                name: 'load_prefab',
                description: 'Load a prefab by path',
                inputSchema: {
                    type: 'object',
                    properties: {
                        prefabPath: {
                            type: 'string',
                            description: 'Prefab asset path'
                        }
                    },
                    required: ['prefabPath']
                }
            },
            {
                name: 'instantiate_prefab',
                description: 'Instantiate a prefab in the scene',
                inputSchema: {
                    type: 'object',
                    properties: {
                        prefabPath: {
                            type: 'string',
                            description: 'Prefab asset path'
                        },
                        parentUuid: {
                            type: 'string',
                            description: 'Parent node UUID (optional)'
                        },
                        position: {
                            type: 'object',
                            description: 'Initial position',
                            properties: {
                                x: { type: 'number' },
                                y: { type: 'number' },
                                z: { type: 'number' }
                            }
                        }
                    },
                    required: ['prefabPath']
                }
            },
            {
                name: 'create_prefab',
                description: 'Create a prefab from a node',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Source node UUID'
                        },
                        savePath: {
                            type: 'string',
                            description: 'Path to save the prefab'
                        },
                        prefabName: {
                            type: 'string',
                            description: 'Prefab name'
                        },
                        includeChildren: {
                            type: 'boolean',
                            description: 'Whether to include child nodes',
                            default: true
                        },
                        includeComponents: {
                            type: 'boolean',
                            description: 'Whether to include components',
                            default: true
                        }
                    },
                    required: ['nodeUuid', 'savePath', 'prefabName']
                }
            },
            {
                name: 'create_prefab_from_node',
                description: 'Create a prefab from a node (alias for create_prefab)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Source node UUID'
                        },
                        prefabPath: {
                            type: 'string',
                            description: 'Path to save the prefab'
                        }
                    },
                    required: ['nodeUuid', 'prefabPath']
                }
            },
            {
                name: 'update_prefab',
                description: 'Update an existing prefab',
                inputSchema: {
                    type: 'object',
                    properties: {
                        prefabPath: {
                            type: 'string',
                            description: 'Prefab asset path'
                        },
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID with changes'
                        }
                    },
                    required: ['prefabPath', 'nodeUuid']
                }
            },
            {
                name: 'revert_prefab',
                description: 'Revert prefab instance to original',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Prefab instance node UUID'
                        }
                    },
                    required: ['nodeUuid']
                }
            },
            {
                name: 'get_prefab_info',
                description: 'Get detailed prefab information',
                inputSchema: {
                    type: 'object',
                    properties: {
                        prefabPath: {
                            type: 'string',
                            description: 'Prefab asset path'
                        }
                    },
                    required: ['prefabPath']
                }
            },
            {
                name: 'validate_prefab',
                description: 'Validate a prefab file format',
                inputSchema: {
                    type: 'object',
                    properties: {
                        prefabPath: {
                            type: 'string',
                            description: 'Prefab asset path'
                        }
                    },
                    required: ['prefabPath']
                }
            },
            {
                name: 'duplicate_prefab',
                description: 'Duplicate an existing prefab',
                inputSchema: {
                    type: 'object',
                    properties: {
                        sourcePrefabPath: {
                            type: 'string',
                            description: 'Source prefab path'
                        },
                        targetPrefabPath: {
                            type: 'string',
                            description: 'Target prefab path'
                        },
                        newPrefabName: {
                            type: 'string',
                            description: 'New prefab name'
                        }
                    },
                    required: ['sourcePrefabPath', 'targetPrefabPath']
                }
            },
            {
                name: 'restore_prefab_node',
                description: 'Restore prefab node using prefab asset (built-in undo record)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Prefab instance node UUID'
                        },
                        assetUuid: {
                            type: 'string',
                            description: 'Prefab asset UUID'
                        }
                    },
                    required: ['nodeUuid', 'assetUuid']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'get_prefab_list':
                return await this.getPrefabList(args.folder);
            case 'load_prefab':
                return await this.loadPrefab(args.prefabPath);
            case 'instantiate_prefab':
                return await this.instantiatePrefab(args);
            case 'create_prefab':
                return await this.createPrefab(args);
            case 'create_prefab_from_node':
                return await this.createPrefabFromNode(args);
            case 'update_prefab':
                return await this.updatePrefab(args.prefabPath, args.nodeUuid);
            case 'revert_prefab':
                return await this.revertPrefab(args.nodeUuid);
            case 'get_prefab_info':
                return await this.getPrefabInfo(args.prefabPath);
            case 'validate_prefab':
                return await this.validatePrefab(args.prefabPath);
            case 'duplicate_prefab':
                return await this.duplicatePrefab(args);
            case 'restore_prefab_node':
                return await this.restorePrefabNode(args.nodeUuid, args.assetUuid);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async getPrefabList(folder: string = 'db://assets'): Promise<ToolResponse> {
        return new Promise((resolve) => {
            const pattern = folder.endsWith('/') ? 
                `${folder}**/*.prefab` : `${folder}/**/*.prefab`;
            
            Editor.Message.request('asset-db', 'query-assets', {
                pattern: pattern
            }).then((results: any[]) => {
                const prefabs: PrefabInfo[] = results.map(asset => ({
                    name: asset.name,
                    path: asset.url,
                    uuid: asset.uuid,
                    folder: asset.url.substring(0, asset.url.lastIndexOf('/'))
                }));
                resolve({ success: true, data: prefabs });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async loadPrefab(prefabPath: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('asset-db', 'query-asset-info', prefabPath).then((assetInfo: any) => {
                if (!assetInfo) {
                    throw new Error('Prefab not found');
                }
                
                return Editor.Message.request('scene', 'load-asset', {
                    uuid: assetInfo.uuid
                });
            }).then((prefabData: any) => {
                resolve({
                    success: true,
                    data: {
                        uuid: prefabData.uuid,
                        name: prefabData.name,
                        message: 'Prefab loaded successfully'
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async instantiatePrefab(args: any): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('asset-db', 'query-asset-info', args.prefabPath).then((assetInfo: any) => {
                if (!assetInfo) {
                    throw new Error('预制体未找到');
                }

                // 使用正确的 create-node API 从预制体资源实例化
                const createNodeOptions: any = {
                    assetUuid: assetInfo.uuid
                };

                // 设置父节点
                if (args.parentUuid) {
                    createNodeOptions.parent = args.parentUuid;
                }

                // 设置节点名称
                if (args.name) {
                    createNodeOptions.name = args.name;
                } else if (assetInfo.name) {
                    createNodeOptions.name = assetInfo.name;
                }

                // 设置初始属性（如位置）
                if (args.position) {
                    createNodeOptions.dump = {
                        position: {
                            value: args.position
                        }
                    };
                }

                return Editor.Message.request('scene', 'create-node', createNodeOptions);
            }).then((nodeUuid: string | string[]) => {
                // 获取实际的节点UUID
                const uuid = Array.isArray(nodeUuid) ? nodeUuid[0] : nodeUuid;
                
                resolve({
                    success: true,
                    data: {
                        nodeUuid: uuid,
                        prefabPath: args.prefabPath,
                        parentUuid: args.parentUuid,
                        position: args.position,
                        message: '预制体实例化成功'
                    }
                });
            }).catch((err: Error) => {
                resolve({ 
                    success: false, 
                    error: `预制体实例化失败: ${err.message}`,
                    instruction: '请检查预制体路径是否正确，确保预制体文件格式正确'
                });
            });
        });
    }

    private async tryCreateNodeWithPrefab(args: any): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('asset-db', 'query-asset-info', args.prefabPath).then((assetInfo: any) => {
                if (!assetInfo) {
                    throw new Error('预制体未找到');
                }

                // 方法2: 使用 create-node 指定预制体资源
                const createNodeOptions: any = {
                    assetUuid: assetInfo.uuid
                };

                // 设置父节点
                if (args.parentUuid) {
                    createNodeOptions.parent = args.parentUuid;
                }

                return Editor.Message.request('scene', 'create-node', createNodeOptions);
            }).then((nodeUuid: string | string[]) => {
                const uuid = Array.isArray(nodeUuid) ? nodeUuid[0] : nodeUuid;
                
                // 如果指定了位置，设置节点位置
                if (args.position && uuid) {
                    Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'position',
                        dump: { value: args.position }
                    }).then(() => {
                        resolve({
                            success: true,
                            data: {
                                nodeUuid: uuid,
                                prefabPath: args.prefabPath,
                                position: args.position,
                                message: '预制体实例化成功（备用方法）并设置了位置'
                            }
                        });
                    }).catch(() => {
                        resolve({
                            success: true,
                            data: {
                                nodeUuid: uuid,
                                prefabPath: args.prefabPath,
                                message: '预制体实例化成功（备用方法）但位置设置失败'
                            }
                        });
                    });
                } else {
                    resolve({
                        success: true,
                        data: {
                            nodeUuid: uuid,
                            prefabPath: args.prefabPath,
                            message: '预制体实例化成功（备用方法）'
                        }
                    });
                }
            }).catch((err: Error) => {
                resolve({
                    success: false,
                    error: `备用预制体实例化方法也失败: ${err.message}`
                });
            });
        });
    }

    private async tryAlternativeInstantiateMethods(args: any): Promise<ToolResponse> {
        return new Promise(async (resolve) => {
            try {
                // 方法1: 尝试使用 create-node 然后设置预制体
                const assetInfo = await this.getAssetInfo(args.prefabPath);
                if (!assetInfo) {
                    resolve({ success: false, error: '无法获取预制体信息' });
                    return;
                }

                // 创建空节点
                const createResult = await this.createNode(args.parentUuid, args.position);
                if (!createResult.success) {
                    resolve(createResult);
                    return;
                }

                // 尝试将预制体应用到节点
                const applyResult = await this.applyPrefabToNode(createResult.data.nodeUuid, assetInfo.uuid);
                if (applyResult.success) {
                    resolve({
                        success: true,
                        data: {
                            nodeUuid: createResult.data.nodeUuid,
                            name: createResult.data.name,
                            message: '预制体实例化成功（使用备选方法）'
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        error: '无法将预制体应用到节点',
                        data: {
                            nodeUuid: createResult.data.nodeUuid,
                            message: '已创建节点，但无法应用预制体数据'
                        }
                    });
                }

            } catch (error) {
                resolve({ success: false, error: `备选实例化方法失败: ${error}` });
            }
        });
    }

    private async getAssetInfo(prefabPath: string): Promise<any> {
        return new Promise((resolve) => {
            Editor.Message.request('asset-db', 'query-asset-info', prefabPath).then((assetInfo: any) => {
                resolve(assetInfo);
            }).catch(() => {
                resolve(null);
            });
        });
    }

    private async createNode(parentUuid?: string, position?: any): Promise<ToolResponse> {
        return new Promise((resolve) => {
            const createNodeOptions: any = {
                name: 'PrefabInstance'
            };

            // 设置父节点
            if (parentUuid) {
                createNodeOptions.parent = parentUuid;
            }

            // 设置位置
            if (position) {
                createNodeOptions.dump = {
                    position: position
                };
            }

            Editor.Message.request('scene', 'create-node', createNodeOptions).then((nodeUuid: string | string[]) => {
                const uuid = Array.isArray(nodeUuid) ? nodeUuid[0] : nodeUuid;
                resolve({
                    success: true,
                    data: {
                        nodeUuid: uuid,
                        name: 'PrefabInstance'
                    }
                });
            }).catch((error: any) => {
                resolve({ success: false, error: error.message || '创建节点失败' });
            });
        });
    }

    private async applyPrefabToNode(nodeUuid: string, prefabUuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            // 尝试多种方法来应用预制体数据
            const methods = [
                () => Editor.Message.request('scene', 'apply-prefab', { node: nodeUuid, prefab: prefabUuid }),
                () => Editor.Message.request('scene', 'set-prefab', { node: nodeUuid, prefab: prefabUuid }),
                () => Editor.Message.request('scene', 'load-prefab-to-node', { node: nodeUuid, prefab: prefabUuid })
            ];

            const tryMethod = (index: number) => {
                if (index >= methods.length) {
                    resolve({ success: false, error: '无法应用预制体数据' });
                    return;
                }

                methods[index]().then(() => {
                    resolve({ success: true });
                }).catch(() => {
                    tryMethod(index + 1);
                });
            };

            tryMethod(0);
        });
    }

    private async createPrefab(args: any): Promise<ToolResponse> {
        return new Promise(async (resolve) => {
            try {
                // 支持 prefabPath 和 savePath 两种参数名
                const pathParam = args.prefabPath || args.savePath;
                if (!pathParam) {
                    resolve({
                        success: false,
                        error: '缺少预制体路径参数。请提供 prefabPath 或 savePath。'
                    });
                    return;
                }

                const prefabName = args.prefabName || 'NewPrefab';
                const fullPath = pathParam.endsWith('.prefab') ? 
                    pathParam : `${pathParam}/${prefabName}.prefab`;

                // 尝试使用Cocos Creator的原生预制体创建API
                const nativeResult = await this.createPrefabNative(args.nodeUuid, fullPath);
                if (nativeResult.success) {
                    resolve(nativeResult);
                    return;
                }

                // 如果原生API失败，使用自定义实现
                const customResult = await this.createPrefabCustom(args.nodeUuid, fullPath, prefabName);
                resolve(customResult);

            } catch (error) {
                resolve({
                    success: false,
                    error: `创建预制体时发生错误: ${error}`
                });
            }
        });
    }

    private async createPrefabNative(nodeUuid: string, prefabPath: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            // 根据官方API文档，不存在直接的预制体创建API
            // 预制体创建需要手动在编辑器中完成
            resolve({
                success: false,
                error: '原生预制体创建API不存在',
                instruction: '根据Cocos Creator官方API文档，预制体创建需要手动操作：\n1. 在场景中选择节点\n2. 将节点拖拽到资源管理器中\n3. 或右键节点选择"生成预制体"'
            });
        });
    }

    private async createPrefabCustom(nodeUuid: string, prefabPath: string, prefabName: string): Promise<ToolResponse> {
        return new Promise(async (resolve) => {
            try {
                // 1. 获取源节点的完整数据
                const nodeData = await this.getNodeData(nodeUuid);
                if (!nodeData) {
                    resolve({
                        success: false,
                        error: `无法找到节点: ${nodeUuid}`
                    });
                    return;
                }

                // 2. 生成预制体UUID
                const prefabUuid = this.generateUUID();

                // 3. 创建预制体数据结构
                const prefabData = this.createPrefabData(nodeData, prefabName, prefabUuid);

                // 4. 基于官方格式创建预制体数据结构
                console.log('=== 开始创建预制体 ===');
                console.log('节点名称:', nodeData.name?.value || '未知');
                console.log('节点UUID:', nodeData.uuid?.value || '未知');
                console.log('预制体保存路径:', prefabPath);
                console.log(`开始创建预制体，节点数据:`, nodeData);
                const prefabJsonData = await this.createStandardPrefabData(nodeData, prefabName, prefabUuid);

                // 5. 创建标准meta文件数据
                const standardMetaData = this.createStandardMetaData(prefabName, prefabUuid);

                // 6. 保存预制体和meta文件
                const saveResult = await this.savePrefabWithMeta(prefabPath, prefabJsonData, standardMetaData);

                if (saveResult.success) {
                    resolve({
                        success: true,
                        data: {
                            prefabUuid: prefabUuid,
                            prefabPath: prefabPath,
                            nodeUuid: nodeUuid,
                            prefabName: prefabName,
                            message: '自定义预制体创建成功'
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        error: saveResult.error || '保存预制体文件失败'
                    });
                }

            } catch (error) {
                resolve({
                    success: false,
                    error: `创建预制体时发生错误: ${error}`
                });
            }
        });
    }

    private async getNodeData(nodeUuid: string): Promise<any> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-node', nodeUuid).then((nodeInfo: any) => {
                if (!nodeInfo) {
                    resolve(null);
                    return;
                }

                // 尝试获取节点的完整序列化数据
                Editor.Message.request('scene', 'serialize-node', {
                    node: nodeUuid,
                    includeChildren: true
                }).then((serializedData: any) => {
                    resolve(serializedData);
                }).catch(() => {
                    // 如果序列化失败，尝试获取节点的详细信息
                    this.getNodeDetailedInfo(nodeUuid).then((detailedInfo: any) => {
                        resolve(detailedInfo || nodeInfo);
                    }).catch(() => {
                        resolve(nodeInfo);
                    });
                });
            }).catch(() => {
                resolve(null);
            });
        });
    }

    private async getNodeDetailedInfo(nodeUuid: string): Promise<any> {
        return new Promise((resolve) => {
            // 获取节点的详细信息，包括组件和子节点
            Editor.Message.request('scene', 'query-node-detail', nodeUuid).then((detailInfo: any) => {
                if (detailInfo) {
                    resolve(detailInfo);
                } else {
                    // 如果无法获取详细信息，构建基本节点信息
                    this.buildBasicNodeInfo(nodeUuid).then((basicInfo: any) => {
                        resolve(basicInfo);
                    }).catch(() => {
                        resolve(null);
                    });
                }
            }).catch(() => {
                resolve(null);
            });
        });
    }

    private async buildBasicNodeInfo(nodeUuid: string): Promise<any> {
        return new Promise((resolve) => {
            // 构建基本的节点信息
            Editor.Message.request('scene', 'query-node', nodeUuid).then((nodeInfo: any) => {
                if (!nodeInfo) {
                    resolve(null);
                    return;
                }

                // 简化版本：只返回基本节点信息，不获取子节点和组件
                // 这些信息将在后续的预制体处理中根据需要添加
                const basicInfo = {
                    ...nodeInfo,
                    children: [],
                    components: []
                };
                resolve(basicInfo);
            }).catch(() => {
                resolve(null);
            });
        });
    }

    private generateUUID(): string {
        // 生成符合Cocos Creator格式的UUID
        const chars = '0123456789abcdef';
        let uuid = '';
        for (let i = 0; i < 32; i++) {
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += chars[Math.floor(Math.random() * chars.length)];
        }
        return uuid;
    }

    private createPrefabData(nodeData: any, prefabName: string, prefabUuid: string): any[] {
        // 创建标准的预制体数据结构
        const prefabAsset = {
            "__type__": "cc.Prefab",
            "_name": prefabName,
            "_objFlags": 0,
            "__editorExtras__": {},
            "_native": "",
            "data": {
                "__id__": 1
            },
            "optimizationPolicy": 0,
            "persistent": false
        };

        // 处理节点数据，确保符合预制体格式
        const processedNodeData = this.processNodeForPrefab(nodeData, prefabUuid);

        return [prefabAsset, ...processedNodeData];
    }

    private processNodeForPrefab(nodeData: any, prefabUuid: string): any[] {
        // 处理节点数据以符合预制体格式
        const processedData: any[] = [];
        let idCounter = 1;

        // 递归处理节点和组件
        const processNode = (node: any, parentId: number = 0): number => {
            const nodeId = idCounter++;
            
            // 创建节点对象
            const processedNode = {
                "__type__": "cc.Node",
                "_name": node.name || "Node",
                "_objFlags": 0,
                "__editorExtras__": {},
                "_parent": parentId > 0 ? { "__id__": parentId } : null,
                "_children": node.children ? node.children.map(() => ({ "__id__": idCounter++ })) : [],
                "_active": node.active !== false,
                "_components": node.components ? node.components.map(() => ({ "__id__": idCounter++ })) : [],
                "_prefab": {
                    "__id__": idCounter++
                },
                "_lpos": {
                    "__type__": "cc.Vec3",
                    "x": node.position?.x || 0,
                    "y": node.position?.y || 0,
                    "z": node.position?.z || 0
                },
                "_lrot": {
                    "__type__": "cc.Quat",
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "w": 1
                },
                "_lscale": {
                    "__type__": "cc.Vec3",
                    "x": node.scale?.x || 1,
                    "y": node.scale?.y || 1,
                    "z": node.scale?.z || 1
                },
                "_mobility": 0,
                "_layer": 1073741824,
                "_euler": {
                    "__type__": "cc.Vec3",
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
                "_id": ""
            };

            processedData.push(processedNode);

            // 处理组件
            if (node.components) {
                node.components.forEach((component: any) => {
                    const componentId = idCounter++;
                    const processedComponents = this.processComponentForPrefab(component, componentId);
                    processedData.push(...processedComponents);
                });
            }

            // 处理子节点
            if (node.children) {
                node.children.forEach((child: any) => {
                    processNode(child, nodeId);
                });
            }

            return nodeId;
        };

        processNode(nodeData);
        return processedData;
    }

    private processComponentForPrefab(component: any, componentId: number): any[] {
        // 处理组件数据以符合预制体格式
        const processedComponent = {
            "__type__": component.type || "cc.Component",
            "_name": "",
            "_objFlags": 0,
            "__editorExtras__": {},
            "node": {
                "__id__": componentId - 1
            },
            "_enabled": component.enabled !== false,
            "__prefab": {
                "__id__": componentId + 1
            },
            ...component.properties
        };

        // 添加组件特定的预制体信息
        const compPrefabInfo = {
            "__type__": "cc.CompPrefabInfo",
            "fileId": this.generateFileId()
        };

        return [processedComponent, compPrefabInfo];
    }

    private generateFileId(): string {
        // 生成文件ID（简化版本）
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/';
        let fileId = '';
        for (let i = 0; i < 22; i++) {
            fileId += chars[Math.floor(Math.random() * chars.length)];
        }
        return fileId;
    }

    private createMetaData(prefabName: string, prefabUuid: string): any {
        return {
            "ver": "1.1.50",
            "importer": "prefab",
            "imported": true,
            "uuid": prefabUuid,
            "files": [
                ".json"
            ],
            "subMetas": {},
            "userData": {
                "syncNodeName": prefabName
            }
        };
    }

    private async savePrefabFiles(prefabPath: string, prefabData: any[], metaData: any): Promise<{ success: boolean; error?: string }> {
        return new Promise((resolve) => {
            try {
                // 使用Editor API保存预制体文件
                const prefabContent = JSON.stringify(prefabData, null, 2);
                const metaContent = JSON.stringify(metaData, null, 2);
                
                // 尝试使用更可靠的保存方法
                this.saveAssetFile(prefabPath, prefabContent).then(() => {
                    // 再创建meta文件
                    const metaPath = `${prefabPath}.meta`;
                    return this.saveAssetFile(metaPath, metaContent);
                }).then(() => {
                    resolve({ success: true });
                }).catch((error: any) => {
                    resolve({ success: false, error: error.message || '保存预制体文件失败' });
                });
            } catch (error) {
                resolve({ success: false, error: `保存文件时发生错误: ${error}` });
            }
        });
    }

    private async saveAssetFile(filePath: string, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            // 尝试多种保存方法
            const saveMethods = [
                () => Editor.Message.request('asset-db', 'create-asset', filePath, content),
                () => Editor.Message.request('asset-db', 'save-asset', filePath, content),
                () => Editor.Message.request('asset-db', 'write-asset', filePath, content)
            ];

            const trySave = (index: number) => {
                if (index >= saveMethods.length) {
                    reject(new Error('所有保存方法都失败了'));
                    return;
                }

                saveMethods[index]().then(() => {
                    resolve();
                }).catch(() => {
                    trySave(index + 1);
                });
            };

            trySave(0);
        });
    }

    private async updatePrefab(prefabPath: string, nodeUuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('asset-db', 'query-asset-info', prefabPath).then((assetInfo: any) => {
                if (!assetInfo) {
                    throw new Error('Prefab not found');
                }

                return Editor.Message.request('scene', 'apply-prefab', {
                    node: nodeUuid,
                    prefab: assetInfo.uuid
                });
            }).then(() => {
                resolve({
                    success: true,
                    message: 'Prefab updated successfully'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async revertPrefab(nodeUuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'revert-prefab', {
                node: nodeUuid
            }).then(() => {
                resolve({
                    success: true,
                    message: 'Prefab instance reverted successfully'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async getPrefabInfo(prefabPath: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('asset-db', 'query-asset-info', prefabPath).then((assetInfo: any) => {
                if (!assetInfo) {
                    throw new Error('Prefab not found');
                }

                return Editor.Message.request('asset-db', 'query-asset-meta', assetInfo.uuid);
            }).then((metaInfo: any) => {
                const info: PrefabInfo = {
                    name: metaInfo.name,
                    uuid: metaInfo.uuid,
                    path: prefabPath,
                    folder: prefabPath.substring(0, prefabPath.lastIndexOf('/')),
                    createTime: metaInfo.createTime,
                    modifyTime: metaInfo.modifyTime,
                    dependencies: metaInfo.depends || []
                };
                resolve({ success: true, data: info });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async createPrefabFromNode(args: any): Promise<ToolResponse> {
        // 从 prefabPath 提取名称
        const prefabPath = args.prefabPath;
        const prefabName = prefabPath.split('/').pop()?.replace('.prefab', '') || 'NewPrefab';
        
        // 调用原来的 createPrefab 方法
        return await this.createPrefab({
            nodeUuid: args.nodeUuid,
            savePath: prefabPath,
            prefabName: prefabName
        });
    }

    private async validatePrefab(prefabPath: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            try {
                // 读取预制体文件内容
                Editor.Message.request('asset-db', 'query-asset-info', prefabPath).then((assetInfo: any) => {
                    if (!assetInfo) {
                        resolve({
                            success: false,
                            error: '预制体文件不存在'
                        });
                        return;
                    }

                    // 验证预制体格式
                    Editor.Message.request('asset-db', 'read-asset', prefabPath).then((content: string) => {
                        try {
                            const prefabData = JSON.parse(content);
                            const validationResult = this.validatePrefabFormat(prefabData);
                            
                            resolve({
                                success: true,
                                data: {
                                    isValid: validationResult.isValid,
                                    issues: validationResult.issues,
                                    nodeCount: validationResult.nodeCount,
                                    componentCount: validationResult.componentCount,
                                    message: validationResult.isValid ? '预制体格式有效' : '预制体格式存在问题'
                                }
                            });
                        } catch (parseError) {
                            resolve({
                                success: false,
                                error: '预制体文件格式错误，无法解析JSON'
                            });
                        }
                    }).catch((error: any) => {
                        resolve({
                            success: false,
                            error: `读取预制体文件失败: ${error.message}`
                        });
                    });
                }).catch((error: any) => {
                    resolve({
                        success: false,
                        error: `查询预制体信息失败: ${error.message}`
                    });
                });
            } catch (error) {
                resolve({
                    success: false,
                    error: `验证预制体时发生错误: ${error}`
                });
            }
        });
    }

    private validatePrefabFormat(prefabData: any): { isValid: boolean; issues: string[]; nodeCount: number; componentCount: number } {
        const issues: string[] = [];
        let nodeCount = 0;
        let componentCount = 0;

        // 检查基本结构
        if (!Array.isArray(prefabData)) {
            issues.push('预制体数据必须是数组格式');
            return { isValid: false, issues, nodeCount, componentCount };
        }

        if (prefabData.length === 0) {
            issues.push('预制体数据为空');
            return { isValid: false, issues, nodeCount, componentCount };
        }

        // 检查第一个元素是否为预制体资产
        const firstElement = prefabData[0];
        if (!firstElement || firstElement.__type__ !== 'cc.Prefab') {
            issues.push('第一个元素必须是cc.Prefab类型');
        }

        // 统计节点和组件
        prefabData.forEach((item: any, index: number) => {
            if (item.__type__ === 'cc.Node') {
                nodeCount++;
            } else if (item.__type__ && item.__type__.includes('cc.')) {
                componentCount++;
            }
        });

        // 检查必要的字段
        if (nodeCount === 0) {
            issues.push('预制体必须包含至少一个节点');
        }

        return {
            isValid: issues.length === 0,
            issues,
            nodeCount,
            componentCount
        };
    }

    private async duplicatePrefab(args: any): Promise<ToolResponse> {
        return new Promise(async (resolve) => {
            try {
                const { sourcePrefabPath, targetPrefabPath, newPrefabName } = args;
                
                // 读取源预制体
                const sourceInfo = await this.getPrefabInfo(sourcePrefabPath);
                if (!sourceInfo.success) {
                    resolve({
                        success: false,
                        error: `无法读取源预制体: ${sourceInfo.error}`
                    });
                    return;
                }

                // 读取源预制体内容
                const sourceContent = await this.readPrefabContent(sourcePrefabPath);
                if (!sourceContent.success) {
                    resolve({
                        success: false,
                        error: `无法读取源预制体内容: ${sourceContent.error}`
                    });
                    return;
                }

                // 生成新的UUID
                const newUuid = this.generateUUID();
                
                // 修改预制体数据
                const modifiedData = this.modifyPrefabForDuplication(sourceContent.data, newPrefabName, newUuid);
                
                // 创建新的meta数据
                const newMetaData = this.createMetaData(newPrefabName || 'DuplicatedPrefab', newUuid);
                
                // 预制体复制功能暂时禁用，因为涉及复杂的序列化格式
                resolve({
                    success: false,
                    error: '预制体复制功能暂时不可用',
                    instruction: '请在 Cocos Creator 编辑器中手动复制预制体：\n1. 在资源管理器中选择要复制的预制体\n2. 右键选择复制\n3. 在目标位置粘贴'
                });

            } catch (error) {
                resolve({
                    success: false,
                    error: `复制预制体时发生错误: ${error}`
                });
            }
        });
    }

    private async readPrefabContent(prefabPath: string): Promise<{ success: boolean; data?: any; error?: string }> {
        return new Promise((resolve) => {
            Editor.Message.request('asset-db', 'read-asset', prefabPath).then((content: string) => {
                try {
                    const prefabData = JSON.parse(content);
                    resolve({ success: true, data: prefabData });
                } catch (parseError) {
                    resolve({ success: false, error: '预制体文件格式错误' });
                }
            }).catch((error: any) => {
                resolve({ success: false, error: error.message || '读取预制体文件失败' });
            });
        });
    }

    private modifyPrefabForDuplication(prefabData: any[], newName: string, newUuid: string): any[] {
        // 修改预制体数据以创建副本
        const modifiedData = [...prefabData];
        
        // 修改第一个元素（预制体资产）
        if (modifiedData[0] && modifiedData[0].__type__ === 'cc.Prefab') {
            modifiedData[0]._name = newName || 'DuplicatedPrefab';
        }

        // 更新所有UUID引用（简化版本）
        // 在实际应用中，可能需要更复杂的UUID映射处理
        
        return modifiedData;
    }

    private async restorePrefabNode(nodeUuid: string, assetUuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            // 使用官方API restore-prefab 还原预制体节点
            (Editor.Message.request as any)('scene', 'restore-prefab', nodeUuid, assetUuid).then(() => {
                resolve({
                    success: true,
                    data: {
                        nodeUuid: nodeUuid,
                        assetUuid: assetUuid,
                        message: '预制体节点还原成功'
                    }
                });
            }).catch((error: any) => {
                resolve({
                    success: false,
                    error: `预制体节点还原失败: ${error.message}`
                });
            });
        });
    }

    // 基于官方预制体格式的新实现方法
    private async getNodeDataForPrefab(nodeUuid: string): Promise<{ success: boolean; data?: any; error?: string }> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-node', nodeUuid).then((nodeData: any) => {
                if (!nodeData) {
                    resolve({ success: false, error: '节点不存在' });
                    return;
                }
                resolve({ success: true, data: nodeData });
            }).catch((error: any) => {
                resolve({ success: false, error: error.message });
            });
        });
    }

    private async createStandardPrefabData(nodeData: any, prefabName: string, prefabUuid: string): Promise<any[]> {
        // 基于官方Canvas.prefab格式创建预制体数据结构
        const prefabData: any[] = [];
        let currentId = 0;

        // 第一个元素：cc.Prefab 资源对象
        const prefabAsset = {
            "__type__": "cc.Prefab",
            "_name": prefabName,
            "_objFlags": 0,
            "__editorExtras__": {},
            "_native": "",
            "data": {
                "__id__": 1
            },
            "optimizationPolicy": 0,
            "persistent": false
        };
        prefabData.push(prefabAsset);
        currentId++;

        // 第二个元素：根节点
        const rootNode = await this.createNodeObject(nodeData, null, prefabData, currentId);
        prefabData.push(rootNode.node);
        currentId = rootNode.nextId;

        // 添加根节点的 PrefabInfo
        const rootPrefabInfo = {
            "__type__": "cc.PrefabInfo",
            "root": {
                "__id__": 1
            },
            "asset": {
                "__id__": 0
            },
            "fileId": this.generateFileId(),
            "targetOverrides": null
        };
        prefabData.push(rootPrefabInfo);

        return prefabData;
    }

    private async createNodeObject(nodeData: any, parentId: number | null, prefabData: any[], currentId: number): Promise<{ node: any; nextId: number }> {
        const nodeId = currentId++;
        
        // 提取节点的基本属性
        const position = nodeData.position?.value || { x: 0, y: 0, z: 0 };
        const rotation = nodeData.rotation?.value || { x: 0, y: 0, z: 0, w: 1 };
        const scale = nodeData.scale?.value || { x: 1, y: 1, z: 1 };
        const active = nodeData.active?.value !== undefined ? nodeData.active.value : true;
        const name = nodeData.name?.value || 'Node';
        const layer = nodeData.layer?.value || 33554432;

        const node: any = {
            "__type__": "cc.Node",
            "_name": name,
            "_objFlags": 0,
            "__editorExtras__": {},
            "_parent": parentId !== null ? { "__id__": parentId } : null,
            "_children": [],
            "_active": active,
            "_components": [],
            "_prefab": {
                "__id__": currentId++
            },
            "_lpos": {
                "__type__": "cc.Vec3",
                "x": position.x,
                "y": position.y,
                "z": position.z
            },
            "_lrot": {
                "__type__": "cc.Quat",
                "x": rotation.x,
                "y": rotation.y,
                "z": rotation.z,
                "w": rotation.w
            },
            "_lscale": {
                "__type__": "cc.Vec3",
                "x": scale.x,
                "y": scale.y,
                "z": scale.z
            },
            "_mobility": 0,
            "_layer": layer,
            "_euler": {
                "__type__": "cc.Vec3",
                "x": 0,
                "y": 0,
                "z": 0
            },
            "_id": ""
        };

        // 添加组件
        if (nodeData.__comps__ && nodeData.__comps__.length > 0) {
            for (const comp of nodeData.__comps__) {
                const componentId = currentId++;
                node._components.push({ "__id__": componentId });
                
                // 创建组件对象
                const componentObj = this.createComponentObject(comp, nodeId, currentId++);
                prefabData.push(componentObj);
                
                // 添加组件的 CompPrefabInfo
                const compPrefabInfo = {
                    "__type__": "cc.CompPrefabInfo",
                    "fileId": this.generateFileId()
                };
                prefabData.push(compPrefabInfo);
                currentId++;
            }
        }

        // 处理子节点
        if (nodeData.children && Array.isArray(nodeData.children) && nodeData.children.length > 0) {
            console.log(`=== 处理子节点 ===`);
            console.log(`节点 ${name} 包含 ${nodeData.children.length} 个子节点`);
            console.log('完整子节点数据:', JSON.stringify(nodeData.children, null, 2));
            
            for (let i = 0; i < nodeData.children.length; i++) {
                const childRef = nodeData.children[i];
                console.log(`第${i}个子节点的完整数据:`, JSON.stringify(childRef, null, 2));
                
                // 尝试多种可能的UUID提取方式
                let childUuid = null;
                if (typeof childRef === 'string') {
                    childUuid = childRef;
                    console.log(`方法1 - 直接字符串: ${childUuid}`);
                } else if (childRef && childRef.value) {
                    if (typeof childRef.value === 'string') {
                        childUuid = childRef.value;
                        console.log(`方法2 - value是字符串: ${childUuid}`);
                    } else if (childRef.value.uuid) {
                        childUuid = childRef.value.uuid;
                        console.log(`方法3 - value.uuid: ${childUuid}`);
                    } else if (childRef.value.__id__) {
                        console.log(`方法4 - 发现__id__引用: ${childRef.value.__id__}`);
                        // 这可能是一个内部引用，我们需要不同的处理方式
                        continue;
                    } else {
                        console.log('方法4 - value不是字符串，内容:', JSON.stringify(childRef.value));
                    }
                } else if (childRef && childRef.uuid) {
                    childUuid = childRef.uuid;
                    console.log(`方法5 - 直接uuid属性: ${childUuid}`);
                } else {
                    console.log('方法6 - 无法识别的子节点格式:', JSON.stringify(childRef));
                }
                
                if (childUuid && childUuid !== '[object Object]') {
                    try {
                        // 获取子节点数据
                        const childNodeData = await this.getNodeData(childUuid);
                        if (childNodeData) {
                            const childId = currentId;
                            node._children.push({ "__id__": childId });
                            
                            // 递归创建子节点
                            const childResult = await this.createNodeObject(childNodeData, nodeId, prefabData, currentId);
                            prefabData.push(childResult.node);
                            currentId = childResult.nextId;
                            
                            // 为子节点添加PrefabInfo
                            const childPrefabInfo = {
                                "__type__": "cc.PrefabInfo",
                                "root": {
                                    "__id__": 1  // 指向根节点
                                },
                                "asset": {
                                    "__id__": 0  // 指向Prefab资源
                                },
                                "fileId": this.generateFileId(),
                                "instance": null,
                                "targetOverrides": null,
                                "nestedPrefabInstanceRoots": null
                            };
                            prefabData.push(childPrefabInfo);
                            currentId++;
                            
                            console.log(`✅ 已添加子节点: ${childNodeData.name?.value || '未知'}`);
                            console.log(`子节点在预制体数组中的索引: ${currentId}`);
                        } else {
                            console.warn(`无法获取子节点数据: ${childUuid}`);
                        }
                    } catch (error) {
                        console.error(`处理子节点 ${childUuid} 时出错:`, error);
                    }
                }
            }
        }

        return { node, nextId: currentId };
    }

    private createComponentObject(componentData: any, nodeId: number, prefabInfoId: number): any {
        const componentType = componentData.__type__ || 'cc.Component';
        
        const component: any = {
            "__type__": componentType,
            "_name": "",
            "_objFlags": 0,
            "__editorExtras__": {},
            "node": {
                "__id__": nodeId
            },
            "_enabled": componentData.enabled !== undefined ? componentData.enabled : true,
            "__prefab": {
                "__id__": prefabInfoId
            },
            "_id": ""
        };

        // 复制组件的其他属性
        for (const key in componentData) {
            if (!key.startsWith('_') && key !== '__type__' && key !== 'enabled' && key !== 'node') {
                component[key] = componentData[key];
            }
        }

        return component;
    }

    private createStandardMetaData(prefabName: string, prefabUuid: string): any {
        return {
            "ver": "1.1.50",
            "importer": "prefab",
            "imported": true,
            "uuid": prefabUuid,
            "files": [
                ".json"
            ],
            "subMetas": {},
            "userData": {
                "syncNodeName": prefabName
            }
        };
    }

    private async savePrefabWithMeta(prefabPath: string, prefabData: any[], metaData: any): Promise<{ success: boolean; error?: string }> {
        try {
            const prefabContent = JSON.stringify(prefabData, null, 2);
            const metaContent = JSON.stringify(metaData, null, 2);

            // 确保路径以.prefab结尾
            const finalPrefabPath = prefabPath.endsWith('.prefab') ? prefabPath : `${prefabPath}.prefab`;
            const metaPath = `${finalPrefabPath}.meta`;

            // 使用asset-db API创建预制体文件
            await new Promise((resolve, reject) => {
                Editor.Message.request('asset-db', 'create-asset', finalPrefabPath, prefabContent).then(() => {
                    resolve(true);
                }).catch((error: any) => {
                    reject(error);
                });
            });

            // 创建meta文件
            await new Promise((resolve, reject) => {
                Editor.Message.request('asset-db', 'create-asset', metaPath, metaContent).then(() => {
                    resolve(true);
                }).catch((error: any) => {
                    reject(error);
                });
            });

            console.log(`=== 预制体保存完成 ===`);
            console.log(`预制体文件已保存: ${finalPrefabPath}`);
            console.log(`Meta文件已保存: ${metaPath}`);
            console.log(`预制体数组总长度: ${prefabData.length}`);
            console.log(`预制体根节点索引: ${prefabData.length - 1}`);

            return { success: true };
        } catch (error: any) {
            console.error('保存预制体文件时出错:', error);
            return { success: false, error: error.message };
        }
    }

}