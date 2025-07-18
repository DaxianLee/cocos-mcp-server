import { ToolDefinition, ToolResponse, ToolExecutor, NodeInfo } from '../types';

export class NodeTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            {
                name: 'create_node',
                description: 'Create a new node in the scene. If parentUuid is not provided, the node will be created at the current selection in the editor.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Node name'
                        },
                        parentUuid: {
                            type: 'string',
                            description: 'Parent node UUID. If not provided, node will be created at current editor selection. To create at scene root, first get the root node UUID.'
                        },
                        nodeType: {
                            type: 'string',
                            description: 'Node type: Node, 2DNode, 3DNode',
                            enum: ['Node', '2DNode', '3DNode'],
                            default: 'Node'
                        },
                        siblingIndex: {
                            type: 'number',
                            description: 'Sibling index for ordering (-1 means append at end)',
                            default: -1
                        }
                    },
                    required: ['name']
                }
            },
            {
                name: 'get_node_info',
                description: 'Get node information by UUID',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Node UUID'
                        }
                    },
                    required: ['uuid']
                }
            },
            {
                name: 'find_nodes',
                description: 'Find nodes by name pattern',
                inputSchema: {
                    type: 'object',
                    properties: {
                        pattern: {
                            type: 'string',
                            description: 'Name pattern to search'
                        },
                        exactMatch: {
                            type: 'boolean',
                            description: 'Exact match or partial match',
                            default: false
                        }
                    },
                    required: ['pattern']
                }
            },
            {
                name: 'find_node_by_name',
                description: 'Find first node by exact name',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Node name to find'
                        }
                    },
                    required: ['name']
                }
            },
            {
                name: 'get_all_nodes',
                description: 'Get all nodes in the scene with their UUIDs',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'set_node_property',
                description: 'Set node property value',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        property: {
                            type: 'string',
                            description: 'Property name (e.g., position, rotation, scale, active)'
                        },
                        value: {
                            description: 'Property value'
                        }
                    },
                    required: ['uuid', 'property', 'value']
                }
            },
            {
                name: 'delete_node',
                description: 'Delete a node from scene',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Node UUID to delete'
                        }
                    },
                    required: ['uuid']
                }
            },
            {
                name: 'move_node',
                description: 'Move node to new parent',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID to move'
                        },
                        newParentUuid: {
                            type: 'string',
                            description: 'New parent node UUID'
                        },
                        siblingIndex: {
                            type: 'number',
                            description: 'Sibling index in new parent',
                            default: -1
                        }
                    },
                    required: ['nodeUuid', 'newParentUuid']
                }
            },
            {
                name: 'duplicate_node',
                description: 'Duplicate a node',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Node UUID to duplicate'
                        },
                        includeChildren: {
                            type: 'boolean',
                            description: 'Include children nodes',
                            default: true
                        }
                    },
                    required: ['uuid']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'create_node':
                return await this.createNode(args);
            case 'get_node_info':
                return await this.getNodeInfo(args.uuid);
            case 'find_nodes':
                return await this.findNodes(args.pattern, args.exactMatch);
            case 'find_node_by_name':
                return await this.findNodeByName(args.name);
            case 'get_all_nodes':
                return await this.getAllNodes();
            case 'set_node_property':
                return await this.setNodeProperty(args.uuid, args.property, args.value);
            case 'delete_node':
                return await this.deleteNode(args.uuid);
            case 'move_node':
                return await this.moveNode(args.nodeUuid, args.newParentUuid, args.siblingIndex);
            case 'duplicate_node':
                return await this.duplicateNode(args.uuid, args.includeChildren);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async createNode(args: any): Promise<ToolResponse> {
        return new Promise(async (resolve) => {
            // 如果指定了父节点，先验证父节点是否存在
            if (args.parentUuid) {
                try {
                    const parentNode = await Editor.Message.request('scene', 'query-node', args.parentUuid);
                    if (!parentNode) {
                        resolve({
                            success: false,
                            error: `Parent node with UUID '${args.parentUuid}' not found`
                        });
                        return;
                    }
                } catch (err) {
                    resolve({
                        success: false,
                        error: `Failed to verify parent node: ${err}`
                    });
                    return;
                }
            }

            const nodeData: any = {
                name: args.name,
                type: args.nodeType || 'cc.Node'
            };

            // 使用更明确的父节点指定方式
            if (args.parentUuid) {
                nodeData.parent = args.parentUuid;
                // 尝试先创建节点，然后移动到指定父节点
                Editor.Message.request('scene', 'create-node', nodeData).then((nodeUuid: any) => {
                    // 如果创建成功但可能没有在正确的父节点下，尝试移动
                    if (args.parentUuid && nodeUuid) {
                        Editor.Message.request('scene', 'move-node', {
                            uuid: nodeUuid,
                            parent: args.parentUuid,
                            index: args.siblingIndex !== undefined ? args.siblingIndex : -1
                        }).then(() => {
                            resolve({
                                success: true,
                                data: {
                                    uuid: nodeUuid,
                                    name: args.name,
                                    parentUuid: args.parentUuid,
                                    message: `Node '${args.name}' created under specified parent`
                                }
                            });
                        }).catch(() => {
                            // 即使移动失败，节点已创建，返回成功但带警告
                            resolve({
                                success: true,
                                data: {
                                    uuid: nodeUuid,
                                    name: args.name,
                                    message: `Node '${args.name}' created but may not be under specified parent`,
                                    warning: 'Failed to move node to specified parent'
                                }
                            });
                        });
                    } else {
                        resolve({
                            success: true,
                            data: {
                                uuid: nodeUuid,
                                name: args.name,
                                message: `Node '${args.name}' created successfully`
                            }
                        });
                    }
                }).catch((err: Error) => {
                    resolve({ success: false, error: err.message });
                });
            } else {
                // 没有指定父节点，使用默认行为
                Editor.Message.request('scene', 'create-node', nodeData).then((result: any) => {
                    resolve({
                        success: true,
                        data: {
                            uuid: result,
                            name: args.name,
                            message: `Node '${args.name}' created at current selection`
                        }
                    });
                }).catch((err: Error) => {
                    resolve({ success: false, error: err.message });
                });
            }
        });
    }

    private async getNodeInfo(uuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-node', uuid).then((nodeData: any) => {
                if (!nodeData) {
                    resolve({
                        success: false,
                        error: 'Node not found or invalid response'
                    });
                    return;
                }
                
                // 根据实际返回的数据结构解析节点信息
                const info: NodeInfo = {
                    uuid: nodeData.uuid?.value || uuid,
                    name: nodeData.name?.value || 'Unknown',
                    active: nodeData.active?.value !== undefined ? nodeData.active.value : true,
                    position: nodeData.position?.value || { x: 0, y: 0, z: 0 },
                    rotation: nodeData.rotation?.value || { x: 0, y: 0, z: 0 },
                    scale: nodeData.scale?.value || { x: 1, y: 1, z: 1 },
                    parent: nodeData.parent?.value?.uuid || null,
                    children: nodeData.children || [],
                    components: (nodeData.__comps__ || []).map((comp: any) => ({
                        type: comp.__type__ || 'Unknown',
                        enabled: comp.enabled !== undefined ? comp.enabled : true
                    })),
                    layer: nodeData.layer?.value || 1073741824,
                    mobility: nodeData.mobility?.value || 0
                };
                resolve({ success: true, data: info });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async findNodes(pattern: string, exactMatch: boolean = false): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-nodes-by-name', {
                name: pattern,
                exactMatch: exactMatch
            }).then((results: any[]) => {
                const nodes = results.map(node => ({
                    uuid: node.uuid,
                    name: node.name,
                    path: node.path
                }));
                resolve({ success: true, data: nodes });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async findNodeByName(name: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            // 优先尝试使用 Editor API 查询节点树并搜索
            Editor.Message.request('scene', 'query-node-tree').then((tree: any) => {
                const foundNode = this.searchNodeInTree(tree, name);
                if (foundNode) {
                    resolve({
                        success: true,
                        data: {
                            uuid: foundNode.uuid,
                            name: foundNode.name,
                            path: this.getNodePath(foundNode)
                        }
                    });
                } else {
                    resolve({ success: false, error: `Node '${name}' not found` });
                }
            }).catch((err: Error) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'findNodeByName',
                    args: [name]
                };
                
                Editor.Message.request('scene', 'execute-scene-script', options).then((result: any) => {
                    resolve(result);
                }).catch((err2: Error) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }

    private searchNodeInTree(node: any, targetName: string): any {
        if (node.name === targetName) {
            return node;
        }
        
        if (node.children) {
            for (const child of node.children) {
                const found = this.searchNodeInTree(child, targetName);
                if (found) {
                    return found;
                }
            }
        }
        
        return null;
    }

    private async getAllNodes(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            // 尝试查询场景节点树
            Editor.Message.request('scene', 'query-node-tree').then((tree: any) => {
                const nodes: any[] = [];
                
                const traverseTree = (node: any) => {
                    nodes.push({
                        uuid: node.uuid,
                        name: node.name,
                        type: node.type,
                        active: node.active,
                        path: this.getNodePath(node)
                    });
                    
                    if (node.children) {
                        for (const child of node.children) {
                            traverseTree(child);
                        }
                    }
                };
                
                if (tree && tree.children) {
                    traverseTree(tree);
                }
                
                resolve({
                    success: true,
                    data: {
                        totalNodes: nodes.length,
                        nodes: nodes
                    }
                });
            }).catch((err: Error) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'getAllNodes',
                    args: []
                };
                
                Editor.Message.request('scene', 'execute-scene-script', options).then((result: any) => {
                    resolve(result);
                }).catch((err2: Error) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }

    private getNodePath(node: any): string {
        const path = [node.name];
        let current = node.parent;
        while (current && current.name !== 'Canvas') {
            path.unshift(current.name);
            current = current.parent;
        }
        return path.join('/');
    }

    private async setNodeProperty(uuid: string, property: string, value: any): Promise<ToolResponse> {
        return new Promise((resolve) => {
            // 尝试直接使用 Editor API 设置节点属性
            Editor.Message.request('scene', 'set-property', {
                uuid: uuid,
                path: property,
                dump: {
                    value: value
                }
            }).then(() => {
                resolve({
                    success: true,
                    message: `Property '${property}' updated successfully`
                });
            }).catch((err: Error) => {
                // 如果直接设置失败，尝试使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'setNodeProperty',
                    args: [uuid, property, value]
                };
                
                Editor.Message.request('scene', 'execute-scene-script', options).then((result: any) => {
                    resolve(result);
                }).catch((err2: Error) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }

    private async deleteNode(uuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'remove-node', { uuid: uuid }).then(() => {
                resolve({
                    success: true,
                    message: 'Node deleted successfully'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async moveNode(nodeUuid: string, newParentUuid: string, siblingIndex: number = -1): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'move-node', {
                uuid: nodeUuid,
                parent: newParentUuid,
                index: siblingIndex
            }).then(() => {
                resolve({
                    success: true,
                    message: 'Node moved successfully'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async duplicateNode(uuid: string, includeChildren: boolean = true): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'duplicate-node', uuid).then((result: any) => {
                resolve({
                    success: true,
                    data: {
                        newUuid: result.uuid,
                        message: 'Node duplicated successfully'
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
}