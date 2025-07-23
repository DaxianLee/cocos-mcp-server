"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTools = void 0;
class NodeTools {
    getTools() {
        return [
            {
                name: 'create_node',
                description: 'Create a new node in the scene. IMPORTANT: You should always provide parentUuid to specify where to create the node. If parentUuid is not provided, the node will be created at the scene root.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Node name'
                        },
                        parentUuid: {
                            type: 'string',
                            description: 'Parent node UUID. STRONGLY RECOMMENDED: Always provide this parameter. Use get_current_scene or get_all_nodes to find parent UUIDs. If not provided, node will be created at scene root.'
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
                description: 'Set node property value (prefer using set_node_transform for position/rotation/scale)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        property: {
                            type: 'string',
                            description: 'Property name (e.g., active, name, layer)'
                        },
                        value: {
                            description: 'Property value'
                        }
                    },
                    required: ['uuid', 'property', 'value']
                }
            },
            {
                name: 'set_node_transform',
                description: 'Set node transform properties (position, rotation, scale) with unified interface. Automatically handles 2D/3D node differences.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        position: {
                            type: 'object',
                            properties: {
                                x: { type: 'number' },
                                y: { type: 'number' },
                                z: { type: 'number', description: 'Z coordinate (ignored for 2D nodes)' }
                            },
                            description: 'Node position. For 2D nodes, only x,y are used; z is ignored. For 3D nodes, all coordinates are used.'
                        },
                        rotation: {
                            type: 'object',
                            properties: {
                                x: { type: 'number', description: 'X rotation (ignored for 2D nodes)' },
                                y: { type: 'number', description: 'Y rotation (ignored for 2D nodes)' },
                                z: { type: 'number', description: 'Z rotation (main rotation axis for 2D nodes)' }
                            },
                            description: 'Node rotation in euler angles. For 2D nodes, only z rotation is used. For 3D nodes, all axes are used.'
                        },
                        scale: {
                            type: 'object',
                            properties: {
                                x: { type: 'number' },
                                y: { type: 'number' },
                                z: { type: 'number', description: 'Z scale (usually 1 for 2D nodes)' }
                            },
                            description: 'Node scale. For 2D nodes, z is typically 1. For 3D nodes, all axes are used.'
                        }
                    },
                    required: ['uuid']
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
            },
            {
                name: 'detect_node_type',
                description: 'Detect if a node is 2D or 3D based on its components and properties',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Node UUID to analyze'
                        }
                    },
                    required: ['uuid']
                }
            }
        ];
    }
    async execute(toolName, args) {
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
            case 'set_node_transform':
                return await this.setNodeTransform(args);
            case 'delete_node':
                return await this.deleteNode(args.uuid);
            case 'move_node':
                return await this.moveNode(args.nodeUuid, args.newParentUuid, args.siblingIndex);
            case 'duplicate_node':
                return await this.duplicateNode(args.uuid, args.includeChildren);
            case 'detect_node_type':
                return await this.detectNodeType(args.uuid);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
    async createNode(args) {
        return new Promise(async (resolve) => {
            let targetParentUuid = args.parentUuid;
            // 如果没有提供父节点UUID，获取场景根节点
            if (!targetParentUuid) {
                try {
                    const sceneInfo = await Editor.Message.request('scene', 'query-node-tree');
                    if (sceneInfo && typeof sceneInfo === 'object' && !Array.isArray(sceneInfo) && Object.prototype.hasOwnProperty.call(sceneInfo, 'uuid')) {
                        targetParentUuid = sceneInfo.uuid;
                        console.log(`No parent specified, using scene root: ${targetParentUuid}`);
                    }
                    else if (Array.isArray(sceneInfo) && sceneInfo.length > 0 && sceneInfo[0].uuid) {
                        // 如果返回的是数组，使用第一个元素（通常是场景根节点）
                        targetParentUuid = sceneInfo[0].uuid;
                        console.log(`No parent specified, using scene root: ${targetParentUuid}`);
                    }
                    else {
                        // 备用方案：尝试获取当前场景
                        const currentScene = await Editor.Message.request('scene', 'query-current-scene');
                        if (currentScene && currentScene.uuid) {
                            targetParentUuid = currentScene.uuid;
                        }
                    }
                }
                catch (err) {
                    console.warn('Failed to get scene root, will use default behavior');
                }
            }
            // 如果指定了父节点，先验证父节点是否存在
            if (targetParentUuid) {
                try {
                    const parentNode = await Editor.Message.request('scene', 'query-node', targetParentUuid);
                    if (!parentNode) {
                        resolve({
                            success: false,
                            error: `Parent node with UUID '${targetParentUuid}' not found`
                        });
                        return;
                    }
                }
                catch (err) {
                    resolve({
                        success: false,
                        error: `Failed to verify parent node: ${err}`
                    });
                    return;
                }
            }
            const nodeData = {
                name: args.name,
                type: args.nodeType || 'cc.Node'
            };
            // 使用正确的create-node API参数结构
            if (targetParentUuid) {
                const createNodeOptions = {
                    parent: targetParentUuid,
                    name: args.name,
                    components: args.nodeType && args.nodeType !== 'Node' ? [args.nodeType] : undefined
                };
                Editor.Message.request('scene', 'create-node', createNodeOptions).then((nodeUuid) => {
                    // 如果需要设置特定的兄弟索引，使用set-parent API
                    // 添加延迟以避免内部状态竞争
                    if (args.siblingIndex !== undefined && args.siblingIndex >= 0 && nodeUuid) {
                        setTimeout(() => {
                            Editor.Message.request('scene', 'set-parent', {
                                parent: targetParentUuid,
                                uuids: [nodeUuid],
                                keepWorldTransform: false
                            }).then(() => {
                                resolve({
                                    success: true,
                                    data: {
                                        uuid: nodeUuid,
                                        name: args.name,
                                        parentUuid: targetParentUuid,
                                        message: args.parentUuid
                                            ? `Node '${args.name}' created under specified parent`
                                            : `Node '${args.name}' created at scene root (no parent specified)`
                                    }
                                });
                            }).catch(() => {
                                // 即使移动失败，节点已创建，返回成功但带警告
                                resolve({
                                    success: true,
                                    data: {
                                        uuid: nodeUuid,
                                        name: args.name,
                                        message: `Node '${args.name}' created but may not be under intended parent`,
                                        warning: 'Failed to move node to specified parent'
                                    }
                                });
                            });
                        }, 100); // 100ms延迟
                    }
                    else {
                        // Get complete node info for verification
                        this.getNodeInfo(nodeUuid).then((nodeInfo) => {
                            resolve({
                                success: true,
                                data: {
                                    uuid: nodeUuid,
                                    name: args.name,
                                    message: `Node '${args.name}' created successfully`
                                },
                                verificationData: {
                                    nodeInfo: nodeInfo.data,
                                    creationDetails: {
                                        parentUuid: targetParentUuid,
                                        nodeType: args.nodeType || 'Node',
                                        timestamp: new Date().toISOString()
                                    }
                                }
                            });
                        }).catch(() => {
                            resolve({
                                success: true,
                                data: {
                                    uuid: nodeUuid,
                                    name: args.name,
                                    message: `Node '${args.name}' created successfully (verification failed)`
                                }
                            });
                        });
                    }
                }).catch((err) => {
                    resolve({ success: false, error: err.message });
                });
            }
            else {
                // 没有找到场景根节点，使用默认行为（创建在场景根节点）
                const createNodeOptions = {
                    name: args.name,
                    components: args.nodeType && args.nodeType !== 'Node' ? [args.nodeType] : undefined
                };
                Editor.Message.request('scene', 'create-node', createNodeOptions).then((result) => {
                    resolve({
                        success: true,
                        data: {
                            uuid: result,
                            name: args.name,
                            message: `Node '${args.name}' created at default location (scene root not found)`,
                            warning: 'Could not determine scene root, node created at default location'
                        }
                    });
                }).catch((err) => {
                    resolve({ success: false, error: err.message });
                });
            }
        });
    }
    async getNodeInfo(uuid) {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-node', uuid).then((nodeData) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                if (!nodeData) {
                    resolve({
                        success: false,
                        error: 'Node not found or invalid response'
                    });
                    return;
                }
                // 根据实际返回的数据结构解析节点信息
                const info = {
                    uuid: ((_a = nodeData.uuid) === null || _a === void 0 ? void 0 : _a.value) || uuid,
                    name: ((_b = nodeData.name) === null || _b === void 0 ? void 0 : _b.value) || 'Unknown',
                    active: ((_c = nodeData.active) === null || _c === void 0 ? void 0 : _c.value) !== undefined ? nodeData.active.value : true,
                    position: ((_d = nodeData.position) === null || _d === void 0 ? void 0 : _d.value) || { x: 0, y: 0, z: 0 },
                    rotation: ((_e = nodeData.rotation) === null || _e === void 0 ? void 0 : _e.value) || { x: 0, y: 0, z: 0 },
                    scale: ((_f = nodeData.scale) === null || _f === void 0 ? void 0 : _f.value) || { x: 1, y: 1, z: 1 },
                    parent: ((_h = (_g = nodeData.parent) === null || _g === void 0 ? void 0 : _g.value) === null || _h === void 0 ? void 0 : _h.uuid) || null,
                    children: nodeData.children || [],
                    components: (nodeData.__comps__ || []).map((comp) => ({
                        type: comp.__type__ || 'Unknown',
                        enabled: comp.enabled !== undefined ? comp.enabled : true
                    })),
                    layer: ((_j = nodeData.layer) === null || _j === void 0 ? void 0 : _j.value) || 1073741824,
                    mobility: ((_k = nodeData.mobility) === null || _k === void 0 ? void 0 : _k.value) || 0
                };
                resolve({ success: true, data: info });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async findNodes(pattern, exactMatch = false) {
        return new Promise((resolve) => {
            // Note: 'query-nodes-by-name' API doesn't exist in official documentation
            // Using tree traversal as primary approach
            Editor.Message.request('scene', 'query-node-tree').then((tree) => {
                const nodes = [];
                const searchTree = (node, currentPath = '') => {
                    const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name;
                    const matches = exactMatch ?
                        node.name === pattern :
                        node.name.toLowerCase().includes(pattern.toLowerCase());
                    if (matches) {
                        nodes.push({
                            uuid: node.uuid,
                            name: node.name,
                            path: nodePath
                        });
                    }
                    if (node.children) {
                        for (const child of node.children) {
                            searchTree(child, nodePath);
                        }
                    }
                };
                if (tree) {
                    searchTree(tree);
                }
                resolve({ success: true, data: nodes });
            }).catch((err) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'findNodes',
                    args: [pattern, exactMatch]
                };
                Editor.Message.request('scene', 'execute-scene-script', options).then((result) => {
                    resolve(result);
                }).catch((err2) => {
                    resolve({ success: false, error: `Tree search failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }
    async findNodeByName(name) {
        return new Promise((resolve) => {
            // 优先尝试使用 Editor API 查询节点树并搜索
            Editor.Message.request('scene', 'query-node-tree').then((tree) => {
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
                }
                else {
                    resolve({ success: false, error: `Node '${name}' not found` });
                }
            }).catch((err) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'findNodeByName',
                    args: [name]
                };
                Editor.Message.request('scene', 'execute-scene-script', options).then((result) => {
                    resolve(result);
                }).catch((err2) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }
    searchNodeInTree(node, targetName) {
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
    async getAllNodes() {
        return new Promise((resolve) => {
            // 尝试查询场景节点树
            Editor.Message.request('scene', 'query-node-tree').then((tree) => {
                const nodes = [];
                const traverseTree = (node) => {
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
            }).catch((err) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'getAllNodes',
                    args: []
                };
                Editor.Message.request('scene', 'execute-scene-script', options).then((result) => {
                    resolve(result);
                }).catch((err2) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }
    getNodePath(node) {
        const path = [node.name];
        let current = node.parent;
        while (current && current.name !== 'Canvas') {
            path.unshift(current.name);
            current = current.parent;
        }
        return path.join('/');
    }
    async setNodeProperty(uuid, property, value) {
        return new Promise((resolve) => {
            // 尝试直接使用 Editor API 设置节点属性
            Editor.Message.request('scene', 'set-property', {
                uuid: uuid,
                path: property,
                dump: {
                    value: value
                }
            }).then(() => {
                // Get comprehensive verification data including updated node info
                this.getNodeInfo(uuid).then((nodeInfo) => {
                    resolve({
                        success: true,
                        message: `Property '${property}' updated successfully`,
                        data: {
                            nodeUuid: uuid,
                            property: property,
                            newValue: value
                        },
                        verificationData: {
                            nodeInfo: nodeInfo.data,
                            changeDetails: {
                                property: property,
                                value: value,
                                timestamp: new Date().toISOString()
                            }
                        }
                    });
                }).catch(() => {
                    resolve({
                        success: true,
                        message: `Property '${property}' updated successfully (verification failed)`
                    });
                });
            }).catch((err) => {
                // 如果直接设置失败，尝试使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'setNodeProperty',
                    args: [uuid, property, value]
                };
                Editor.Message.request('scene', 'execute-scene-script', options).then((result) => {
                    resolve(result);
                }).catch((err2) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }
    async setNodeTransform(args) {
        return new Promise(async (resolve) => {
            const { uuid, position, rotation, scale } = args;
            const updatePromises = [];
            const updates = [];
            const warnings = [];
            try {
                // First get node info to determine if it's 2D or 3D
                const nodeInfoResponse = await this.getNodeInfo(uuid);
                if (!nodeInfoResponse.success || !nodeInfoResponse.data) {
                    resolve({ success: false, error: 'Failed to get node information' });
                    return;
                }
                const nodeInfo = nodeInfoResponse.data;
                const is2DNode = this.is2DNode(nodeInfo);
                if (position) {
                    const normalizedPosition = this.normalizeTransformValue(position, 'position', is2DNode);
                    if (normalizedPosition.warning) {
                        warnings.push(normalizedPosition.warning);
                    }
                    updatePromises.push(Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'position',
                        dump: { value: normalizedPosition.value }
                    }));
                    updates.push('position');
                }
                if (rotation) {
                    const normalizedRotation = this.normalizeTransformValue(rotation, 'rotation', is2DNode);
                    if (normalizedRotation.warning) {
                        warnings.push(normalizedRotation.warning);
                    }
                    updatePromises.push(Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'rotation',
                        dump: { value: normalizedRotation.value }
                    }));
                    updates.push('rotation');
                }
                if (scale) {
                    const normalizedScale = this.normalizeTransformValue(scale, 'scale', is2DNode);
                    if (normalizedScale.warning) {
                        warnings.push(normalizedScale.warning);
                    }
                    updatePromises.push(Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'scale',
                        dump: { value: normalizedScale.value }
                    }));
                    updates.push('scale');
                }
                if (updatePromises.length === 0) {
                    resolve({ success: false, error: 'No transform properties specified' });
                    return;
                }
                await Promise.all(updatePromises);
                // Verify the changes by getting updated node info
                const updatedNodeInfo = await this.getNodeInfo(uuid);
                const response = {
                    success: true,
                    message: `Transform properties updated: ${updates.join(', ')} ${is2DNode ? '(2D node)' : '(3D node)'}`,
                    updatedProperties: updates,
                    data: {
                        nodeUuid: uuid,
                        nodeType: is2DNode ? '2D' : '3D',
                        appliedChanges: updates,
                        transformConstraints: {
                            position: is2DNode ? 'x, y only (z ignored)' : 'x, y, z all used',
                            rotation: is2DNode ? 'z only (x, y ignored)' : 'x, y, z all used',
                            scale: is2DNode ? 'x, y main, z typically 1' : 'x, y, z all used'
                        }
                    },
                    verificationData: {
                        nodeInfo: updatedNodeInfo.data,
                        transformDetails: {
                            originalNodeType: is2DNode ? '2D' : '3D',
                            appliedTransforms: updates,
                            timestamp: new Date().toISOString()
                        },
                        beforeAfterComparison: {
                            before: nodeInfo,
                            after: updatedNodeInfo.data
                        }
                    }
                };
                if (warnings.length > 0) {
                    response.warning = warnings.join('; ');
                }
                resolve(response);
            }
            catch (err) {
                resolve({
                    success: false,
                    error: `Failed to update transform: ${err.message}`
                });
            }
        });
    }
    is2DNode(nodeInfo) {
        // Check if node has 2D-specific components or is under Canvas
        const components = nodeInfo.components || [];
        // Check for common 2D components
        const has2DComponents = components.some((comp) => comp.type && (comp.type.includes('cc.Sprite') ||
            comp.type.includes('cc.Label') ||
            comp.type.includes('cc.Button') ||
            comp.type.includes('cc.Layout') ||
            comp.type.includes('cc.Widget') ||
            comp.type.includes('cc.Mask') ||
            comp.type.includes('cc.Graphics')));
        if (has2DComponents) {
            return true;
        }
        // Check for 3D-specific components  
        const has3DComponents = components.some((comp) => comp.type && (comp.type.includes('cc.MeshRenderer') ||
            comp.type.includes('cc.Camera') ||
            comp.type.includes('cc.Light') ||
            comp.type.includes('cc.DirectionalLight') ||
            comp.type.includes('cc.PointLight') ||
            comp.type.includes('cc.SpotLight')));
        if (has3DComponents) {
            return false;
        }
        // Default heuristic: if z position is 0 and hasn't been changed, likely 2D
        const position = nodeInfo.position;
        if (position && Math.abs(position.z) < 0.001) {
            return true;
        }
        // Default to 3D if uncertain
        return false;
    }
    normalizeTransformValue(value, type, is2D) {
        const result = Object.assign({}, value);
        let warning;
        if (is2D) {
            switch (type) {
                case 'position':
                    if (value.z !== undefined && Math.abs(value.z) > 0.001) {
                        warning = `2D node: z position (${value.z}) ignored, set to 0`;
                        result.z = 0;
                    }
                    else if (value.z === undefined) {
                        result.z = 0;
                    }
                    break;
                case 'rotation':
                    if ((value.x !== undefined && Math.abs(value.x) > 0.001) ||
                        (value.y !== undefined && Math.abs(value.y) > 0.001)) {
                        warning = `2D node: x,y rotations ignored, only z rotation applied`;
                        result.x = 0;
                        result.y = 0;
                    }
                    else {
                        result.x = result.x || 0;
                        result.y = result.y || 0;
                    }
                    result.z = result.z || 0;
                    break;
                case 'scale':
                    if (value.z === undefined) {
                        result.z = 1; // Default scale for 2D
                    }
                    break;
            }
        }
        else {
            // 3D node - ensure all axes are defined
            result.x = result.x !== undefined ? result.x : (type === 'scale' ? 1 : 0);
            result.y = result.y !== undefined ? result.y : (type === 'scale' ? 1 : 0);
            result.z = result.z !== undefined ? result.z : (type === 'scale' ? 1 : 0);
        }
        return { value: result, warning };
    }
    async deleteNode(uuid) {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'remove-node', { uuid: uuid }).then(() => {
                resolve({
                    success: true,
                    message: 'Node deleted successfully'
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async moveNode(nodeUuid, newParentUuid, siblingIndex = -1) {
        return new Promise((resolve) => {
            // Use correct set-parent API instead of move-node
            Editor.Message.request('scene', 'set-parent', {
                parent: newParentUuid,
                uuids: [nodeUuid],
                keepWorldTransform: false
            }).then(() => {
                resolve({
                    success: true,
                    message: 'Node moved successfully'
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async duplicateNode(uuid, includeChildren = true) {
        return new Promise((resolve) => {
            // Note: includeChildren parameter is accepted for future use but not currently implemented
            Editor.Message.request('scene', 'duplicate-node', uuid).then((result) => {
                resolve({
                    success: true,
                    data: {
                        newUuid: result.uuid,
                        message: 'Node duplicated successfully'
                    }
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async detectNodeType(uuid) {
        return new Promise(async (resolve) => {
            try {
                const nodeInfoResponse = await this.getNodeInfo(uuid);
                if (!nodeInfoResponse.success || !nodeInfoResponse.data) {
                    resolve({ success: false, error: 'Failed to get node information' });
                    return;
                }
                const nodeInfo = nodeInfoResponse.data;
                const is2D = this.is2DNode(nodeInfo);
                const components = nodeInfo.components || [];
                // Collect detection reasons
                const detectionReasons = [];
                // Check for 2D components
                const twoDComponents = components.filter((comp) => comp.type && (comp.type.includes('cc.Sprite') ||
                    comp.type.includes('cc.Label') ||
                    comp.type.includes('cc.Button') ||
                    comp.type.includes('cc.Layout') ||
                    comp.type.includes('cc.Widget') ||
                    comp.type.includes('cc.Mask') ||
                    comp.type.includes('cc.Graphics')));
                // Check for 3D components
                const threeDComponents = components.filter((comp) => comp.type && (comp.type.includes('cc.MeshRenderer') ||
                    comp.type.includes('cc.Camera') ||
                    comp.type.includes('cc.Light') ||
                    comp.type.includes('cc.DirectionalLight') ||
                    comp.type.includes('cc.PointLight') ||
                    comp.type.includes('cc.SpotLight')));
                if (twoDComponents.length > 0) {
                    detectionReasons.push(`Has 2D components: ${twoDComponents.map((c) => c.type).join(', ')}`);
                }
                if (threeDComponents.length > 0) {
                    detectionReasons.push(`Has 3D components: ${threeDComponents.map((c) => c.type).join(', ')}`);
                }
                // Check position for heuristic
                const position = nodeInfo.position;
                if (position && Math.abs(position.z) < 0.001) {
                    detectionReasons.push('Z position is ~0 (likely 2D)');
                }
                else if (position && Math.abs(position.z) > 0.001) {
                    detectionReasons.push(`Z position is ${position.z} (likely 3D)`);
                }
                if (detectionReasons.length === 0) {
                    detectionReasons.push('No specific indicators found, defaulting based on heuristics');
                }
                resolve({
                    success: true,
                    data: {
                        nodeUuid: uuid,
                        nodeName: nodeInfo.name,
                        nodeType: is2D ? '2D' : '3D',
                        detectionReasons: detectionReasons,
                        components: components.map((comp) => ({
                            type: comp.type,
                            category: this.getComponentCategory(comp.type)
                        })),
                        position: nodeInfo.position,
                        transformConstraints: {
                            position: is2D ? 'x, y only (z ignored)' : 'x, y, z all used',
                            rotation: is2D ? 'z only (x, y ignored)' : 'x, y, z all used',
                            scale: is2D ? 'x, y main, z typically 1' : 'x, y, z all used'
                        }
                    }
                });
            }
            catch (err) {
                resolve({
                    success: false,
                    error: `Failed to detect node type: ${err.message}`
                });
            }
        });
    }
    getComponentCategory(componentType) {
        if (!componentType)
            return 'unknown';
        if (componentType.includes('cc.Sprite') || componentType.includes('cc.Label') ||
            componentType.includes('cc.Button') || componentType.includes('cc.Layout') ||
            componentType.includes('cc.Widget') || componentType.includes('cc.Mask') ||
            componentType.includes('cc.Graphics')) {
            return '2D';
        }
        if (componentType.includes('cc.MeshRenderer') || componentType.includes('cc.Camera') ||
            componentType.includes('cc.Light') || componentType.includes('cc.DirectionalLight') ||
            componentType.includes('cc.PointLight') || componentType.includes('cc.SpotLight')) {
            return '3D';
        }
        return 'generic';
    }
}
exports.NodeTools = NodeTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS10b29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS90b29scy9ub2RlLXRvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsU0FBUztJQUNsQixRQUFRO1FBQ0osT0FBTztZQUNIO2dCQUNJLElBQUksRUFBRSxhQUFhO2dCQUNuQixXQUFXLEVBQUUsaU1BQWlNO2dCQUM5TSxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsV0FBVzt5QkFDM0I7d0JBQ0QsVUFBVSxFQUFFOzRCQUNSLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSwwTEFBMEw7eUJBQzFNO3dCQUNELFFBQVEsRUFBRTs0QkFDTixJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsaUNBQWlDOzRCQUM5QyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQzs0QkFDbEMsT0FBTyxFQUFFLE1BQU07eUJBQ2xCO3dCQUNELFlBQVksRUFBRTs0QkFDVixJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUscURBQXFEOzRCQUNsRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO3lCQUNkO3FCQUNKO29CQUNELFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDckI7YUFDSjtZQUNEO2dCQUNJLElBQUksRUFBRSxlQUFlO2dCQUNyQixXQUFXLEVBQUUsOEJBQThCO2dCQUMzQyxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsV0FBVzt5QkFDM0I7cUJBQ0o7b0JBQ0QsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNyQjthQUNKO1lB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QUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQ3hFLGFBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztZQUN4QyxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFDaEYsYUFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDO1lBQ25GLGFBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO1lBQ3BGLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0NBQ0o7QUF4L0JELDhCQXcvQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb29sRGVmaW5pdGlvbiwgVG9vbFJlc3BvbnNlLCBUb29sRXhlY3V0b3IsIE5vZGVJbmZvIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgTm9kZVRvb2xzIGltcGxlbWVudHMgVG9vbEV4ZWN1dG9yIHtcbiAgICBnZXRUb29scygpOiBUb29sRGVmaW5pdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY3JlYXRlX25vZGUnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ3JlYXRlIGEgbmV3IG5vZGUgaW4gdGhlIHNjZW5lLiBJTVBPUlRBTlQ6IFlvdSBzaG91bGQgYWx3YXlzIHByb3ZpZGUgcGFyZW50VXVpZCB0byBzcGVjaWZ5IHdoZXJlIHRvIGNyZWF0ZSB0aGUgbm9kZS4gSWYgcGFyZW50VXVpZCBpcyBub3QgcHJvdmlkZWQsIHRoZSBub2RlIHdpbGwgYmUgY3JlYXRlZCBhdCB0aGUgc2NlbmUgcm9vdC4nLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdOb2RlIG5hbWUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VXVpZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUGFyZW50IG5vZGUgVVVJRC4gU1RST05HTFkgUkVDT01NRU5ERUQ6IEFsd2F5cyBwcm92aWRlIHRoaXMgcGFyYW1ldGVyLiBVc2UgZ2V0X2N1cnJlbnRfc2NlbmUgb3IgZ2V0X2FsbF9ub2RlcyB0byBmaW5kIHBhcmVudCBVVUlEcy4gSWYgbm90IHByb3ZpZGVkLCBub2RlIHdpbGwgYmUgY3JlYXRlZCBhdCBzY2VuZSByb290LidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlVHlwZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTm9kZSB0eXBlOiBOb2RlLCAyRE5vZGUsIDNETm9kZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydOb2RlJywgJzJETm9kZScsICczRE5vZGUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAnTm9kZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWJsaW5nSW5kZXg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NpYmxpbmcgaW5kZXggZm9yIG9yZGVyaW5nICgtMSBtZWFucyBhcHBlbmQgYXQgZW5kKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogLTFcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnbmFtZSddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnZ2V0X25vZGVfaW5mbycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdHZXQgbm9kZSBpbmZvcm1hdGlvbiBieSBVVUlEJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTm9kZSBVVUlEJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWyd1dWlkJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdmaW5kX25vZGVzJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0ZpbmQgbm9kZXMgYnkgbmFtZSBwYXR0ZXJuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTmFtZSBwYXR0ZXJuIHRvIHNlYXJjaCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBleGFjdE1hdGNoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRXhhY3QgbWF0Y2ggb3IgcGFydGlhbCBtYXRjaCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsncGF0dGVybiddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnZmluZF9ub2RlX2J5X25hbWUnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRmluZCBmaXJzdCBub2RlIGJ5IGV4YWN0IG5hbWUnLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdOb2RlIG5hbWUgdG8gZmluZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnbmFtZSddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnZ2V0X2FsbF9ub2RlcycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdHZXQgYWxsIG5vZGVzIGluIHRoZSBzY2VuZSB3aXRoIHRoZWlyIFVVSURzJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzZXRfbm9kZV9wcm9wZXJ0eScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZXQgbm9kZSBwcm9wZXJ0eSB2YWx1ZSAocHJlZmVyIHVzaW5nIHNldF9ub2RlX3RyYW5zZm9ybSBmb3IgcG9zaXRpb24vcm90YXRpb24vc2NhbGUpJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTm9kZSBVVUlEJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcm9wZXJ0eSBuYW1lIChlLmcuLCBhY3RpdmUsIG5hbWUsIGxheWVyKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUHJvcGVydHkgdmFsdWUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3V1aWQnLCAncHJvcGVydHknLCAndmFsdWUnXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3NldF9ub2RlX3RyYW5zZm9ybScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZXQgbm9kZSB0cmFuc2Zvcm0gcHJvcGVydGllcyAocG9zaXRpb24sIHJvdGF0aW9uLCBzY2FsZSkgd2l0aCB1bmlmaWVkIGludGVyZmFjZS4gQXV0b21hdGljYWxseSBoYW5kbGVzIDJELzNEIG5vZGUgZGlmZmVyZW5jZXMuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTm9kZSBVVUlEJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiB7IHR5cGU6ICdudW1iZXInIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHsgdHlwZTogJ251bWJlcicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgejogeyB0eXBlOiAnbnVtYmVyJywgZGVzY3JpcHRpb246ICdaIGNvb3JkaW5hdGUgKGlnbm9yZWQgZm9yIDJEIG5vZGVzKScgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdOb2RlIHBvc2l0aW9uLiBGb3IgMkQgbm9kZXMsIG9ubHkgeCx5IGFyZSB1c2VkOyB6IGlzIGlnbm9yZWQuIEZvciAzRCBub2RlcywgYWxsIGNvb3JkaW5hdGVzIGFyZSB1c2VkLidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICByb3RhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogeyB0eXBlOiAnbnVtYmVyJywgZGVzY3JpcHRpb246ICdYIHJvdGF0aW9uIChpZ25vcmVkIGZvciAyRCBub2RlcyknIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHsgdHlwZTogJ251bWJlcicsIGRlc2NyaXB0aW9uOiAnWSByb3RhdGlvbiAoaWdub3JlZCBmb3IgMkQgbm9kZXMpJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6OiB7IHR5cGU6ICdudW1iZXInLCBkZXNjcmlwdGlvbjogJ1ogcm90YXRpb24gKG1haW4gcm90YXRpb24gYXhpcyBmb3IgMkQgbm9kZXMpJyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ05vZGUgcm90YXRpb24gaW4gZXVsZXIgYW5nbGVzLiBGb3IgMkQgbm9kZXMsIG9ubHkgeiByb3RhdGlvbiBpcyB1c2VkLiBGb3IgM0Qgbm9kZXMsIGFsbCBheGVzIGFyZSB1c2VkLidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogeyB0eXBlOiAnbnVtYmVyJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiB7IHR5cGU6ICdudW1iZXInIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHo6IHsgdHlwZTogJ251bWJlcicsIGRlc2NyaXB0aW9uOiAnWiBzY2FsZSAodXN1YWxseSAxIGZvciAyRCBub2RlcyknIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTm9kZSBzY2FsZS4gRm9yIDJEIG5vZGVzLCB6IGlzIHR5cGljYWxseSAxLiBGb3IgM0Qgbm9kZXMsIGFsbCBheGVzIGFyZSB1c2VkLidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsndXVpZCddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnZGVsZXRlX25vZGUnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGVsZXRlIGEgbm9kZSBmcm9tIHNjZW5lJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTm9kZSBVVUlEIHRvIGRlbGV0ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsndXVpZCddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbW92ZV9ub2RlJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ01vdmUgbm9kZSB0byBuZXcgcGFyZW50JyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVV1aWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ05vZGUgVVVJRCB0byBtb3ZlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1BhcmVudFV1aWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ05ldyBwYXJlbnQgbm9kZSBVVUlEJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpYmxpbmdJbmRleDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2libGluZyBpbmRleCBpbiBuZXcgcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydub2RlVXVpZCcsICduZXdQYXJlbnRVdWlkJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdkdXBsaWNhdGVfbm9kZScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdEdXBsaWNhdGUgYSBub2RlJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTm9kZSBVVUlEIHRvIGR1cGxpY2F0ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlQ2hpbGRyZW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJbmNsdWRlIGNoaWxkcmVuIG5vZGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3V1aWQnXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2RldGVjdF9ub2RlX3R5cGUnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGV0ZWN0IGlmIGEgbm9kZSBpcyAyRCBvciAzRCBiYXNlZCBvbiBpdHMgY29tcG9uZW50cyBhbmQgcHJvcGVydGllcycsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ05vZGUgVVVJRCB0byBhbmFseXplJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWyd1dWlkJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZSh0b29sTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBzd2l0Y2ggKHRvb2xOYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdjcmVhdGVfbm9kZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY3JlYXRlTm9kZShhcmdzKTtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9ub2RlX2luZm8nOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldE5vZGVJbmZvKGFyZ3MudXVpZCk7XG4gICAgICAgICAgICBjYXNlICdmaW5kX25vZGVzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5maW5kTm9kZXMoYXJncy5wYXR0ZXJuLCBhcmdzLmV4YWN0TWF0Y2gpO1xuICAgICAgICAgICAgY2FzZSAnZmluZF9ub2RlX2J5X25hbWUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmZpbmROb2RlQnlOYW1lKGFyZ3MubmFtZSk7XG4gICAgICAgICAgICBjYXNlICdnZXRfYWxsX25vZGVzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRBbGxOb2RlcygpO1xuICAgICAgICAgICAgY2FzZSAnc2V0X25vZGVfcHJvcGVydHknOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNldE5vZGVQcm9wZXJ0eShhcmdzLnV1aWQsIGFyZ3MucHJvcGVydHksIGFyZ3MudmFsdWUpO1xuICAgICAgICAgICAgY2FzZSAnc2V0X25vZGVfdHJhbnNmb3JtJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXROb2RlVHJhbnNmb3JtKGFyZ3MpO1xuICAgICAgICAgICAgY2FzZSAnZGVsZXRlX25vZGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmRlbGV0ZU5vZGUoYXJncy51dWlkKTtcbiAgICAgICAgICAgIGNhc2UgJ21vdmVfbm9kZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMubW92ZU5vZGUoYXJncy5ub2RlVXVpZCwgYXJncy5uZXdQYXJlbnRVdWlkLCBhcmdzLnNpYmxpbmdJbmRleCk7XG4gICAgICAgICAgICBjYXNlICdkdXBsaWNhdGVfbm9kZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZHVwbGljYXRlTm9kZShhcmdzLnV1aWQsIGFyZ3MuaW5jbHVkZUNoaWxkcmVuKTtcbiAgICAgICAgICAgIGNhc2UgJ2RldGVjdF9ub2RlX3R5cGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmRldGVjdE5vZGVUeXBlKGFyZ3MudXVpZCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biB0b29sOiAke3Rvb2xOYW1lfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjcmVhdGVOb2RlKGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHRhcmdldFBhcmVudFV1aWQgPSBhcmdzLnBhcmVudFV1aWQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOWmguaenOayoeacieaPkOS+m+eItuiKgueCuVVVSUTvvIzojrflj5blnLrmma/moLnoioLngrlcbiAgICAgICAgICAgIGlmICghdGFyZ2V0UGFyZW50VXVpZCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjZW5lSW5mbyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3F1ZXJ5LW5vZGUtdHJlZScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2NlbmVJbmZvICYmIHR5cGVvZiBzY2VuZUluZm8gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHNjZW5lSW5mbykgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNjZW5lSW5mbywgJ3V1aWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0UGFyZW50VXVpZCA9IChzY2VuZUluZm8gYXMgYW55KS51dWlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE5vIHBhcmVudCBzcGVjaWZpZWQsIHVzaW5nIHNjZW5lIHJvb3Q6ICR7dGFyZ2V0UGFyZW50VXVpZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNjZW5lSW5mbykgJiYgc2NlbmVJbmZvLmxlbmd0aCA+IDAgJiYgc2NlbmVJbmZvWzBdLnV1aWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOi/lOWbnueahOaYr+aVsOe7hO+8jOS9v+eUqOesrOS4gOS4quWFg+e0oO+8iOmAmuW4uOaYr+WcuuaZr+agueiKgueCue+8iVxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0UGFyZW50VXVpZCA9IHNjZW5lSW5mb1swXS51dWlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE5vIHBhcmVudCBzcGVjaWZpZWQsIHVzaW5nIHNjZW5lIHJvb3Q6ICR7dGFyZ2V0UGFyZW50VXVpZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWkh+eUqOaWueahiO+8muWwneivleiOt+WPluW9k+WJjeWcuuaZr1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNjZW5lID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncXVlcnktY3VycmVudC1zY2VuZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTY2VuZSAmJiBjdXJyZW50U2NlbmUudXVpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFBhcmVudFV1aWQgPSBjdXJyZW50U2NlbmUudXVpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBnZXQgc2NlbmUgcm9vdCwgd2lsbCB1c2UgZGVmYXVsdCBiZWhhdmlvcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5aaC5p6c5oyH5a6a5LqG54i26IqC54K577yM5YWI6aqM6K+B54i26IqC54K55piv5ZCm5a2Y5ZyoXG4gICAgICAgICAgICBpZiAodGFyZ2V0UGFyZW50VXVpZCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdxdWVyeS1ub2RlJywgdGFyZ2V0UGFyZW50VXVpZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBQYXJlbnQgbm9kZSB3aXRoIFVVSUQgJyR7dGFyZ2V0UGFyZW50VXVpZH0nIG5vdCBmb3VuZGBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byB2ZXJpZnkgcGFyZW50IG5vZGU6ICR7ZXJyfWBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5vZGVEYXRhOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogYXJncy5uYW1lLFxuICAgICAgICAgICAgICAgIHR5cGU6IGFyZ3Mubm9kZVR5cGUgfHwgJ2NjLk5vZGUnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDkvb/nlKjmraPnoa7nmoRjcmVhdGUtbm9kZSBBUEnlj4LmlbDnu5PmnoRcbiAgICAgICAgICAgIGlmICh0YXJnZXRQYXJlbnRVdWlkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlTm9kZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogdGFyZ2V0UGFyZW50VXVpZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogYXJncy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzOiBhcmdzLm5vZGVUeXBlICYmIGFyZ3Mubm9kZVR5cGUgIT09ICdOb2RlJyA/IFthcmdzLm5vZGVUeXBlXSA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnY3JlYXRlLW5vZGUnLCBjcmVhdGVOb2RlT3B0aW9ucykudGhlbigobm9kZVV1aWQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzpnIDopoHorr7nva7nibnlrprnmoTlhYTlvJ/ntKLlvJXvvIzkvb/nlKhzZXQtcGFyZW50IEFQSVxuICAgICAgICAgICAgICAgICAgICAvLyDmt7vliqDlu7bov5/ku6Xpgb/lhY3lhoXpg6jnirbmgIHnq57kuolcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3Muc2libGluZ0luZGV4ICE9PSB1bmRlZmluZWQgJiYgYXJncy5zaWJsaW5nSW5kZXggPj0gMCAmJiBub2RlVXVpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnc2V0LXBhcmVudCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiB0YXJnZXRQYXJlbnRVdWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dWlkczogW25vZGVVdWlkXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2VlcFdvcmxkVHJhbnNmb3JtOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogbm9kZVV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYXJncy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFV1aWQ6IHRhcmdldFBhcmVudFV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYXJncy5wYXJlbnRVdWlkIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGBOb2RlICcke2FyZ3MubmFtZX0nIGNyZWF0ZWQgdW5kZXIgc3BlY2lmaWVkIHBhcmVudGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBgTm9kZSAnJHthcmdzLm5hbWV9JyBjcmVhdGVkIGF0IHNjZW5lIHJvb3QgKG5vIHBhcmVudCBzcGVjaWZpZWQpYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWNs+S9v+enu+WKqOWksei0pe+8jOiKgueCueW3suWIm+W7uu+8jOi/lOWbnuaIkOWKn+S9huW4puitpuWRilxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogbm9kZVV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYXJncy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBOb2RlICcke2FyZ3MubmFtZX0nIGNyZWF0ZWQgYnV0IG1heSBub3QgYmUgdW5kZXIgaW50ZW5kZWQgcGFyZW50YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5nOiAnRmFpbGVkIHRvIG1vdmUgbm9kZSB0byBzcGVjaWZpZWQgcGFyZW50J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7IC8vIDEwMG1z5bu26L+fXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgY29tcGxldGUgbm9kZSBpbmZvIGZvciB2ZXJpZmljYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Tm9kZUluZm8obm9kZVV1aWQpLnRoZW4oKG5vZGVJbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IG5vZGVVdWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYXJncy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYE5vZGUgJyR7YXJncy5uYW1lfScgY3JlYXRlZCBzdWNjZXNzZnVsbHlgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcmlmaWNhdGlvbkRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVJbmZvOiBub2RlSW5mby5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRpb25EZXRhaWxzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VXVpZDogdGFyZ2V0UGFyZW50VXVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlVHlwZTogYXJncy5ub2RlVHlwZSB8fCAnTm9kZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dWlkOiBub2RlVXVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGFyZ3MubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBOb2RlICcke2FyZ3MubmFtZX0nIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5ICh2ZXJpZmljYXRpb24gZmFpbGVkKWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5rKh5pyJ5om+5Yiw5Zy65pmv5qC56IqC54K577yM5L2/55So6buY6K6k6KGM5Li677yI5Yib5bu65Zyo5Zy65pmv5qC56IqC54K577yJXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlTm9kZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGFyZ3MubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50czogYXJncy5ub2RlVHlwZSAmJiBhcmdzLm5vZGVUeXBlICE9PSAnTm9kZScgPyBbYXJncy5ub2RlVHlwZV0gOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ2NyZWF0ZS1ub2RlJywgY3JlYXRlTm9kZU9wdGlvbnMpLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dWlkOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYXJncy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBOb2RlICcke2FyZ3MubmFtZX0nIGNyZWF0ZWQgYXQgZGVmYXVsdCBsb2NhdGlvbiAoc2NlbmUgcm9vdCBub3QgZm91bmQpYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5nOiAnQ291bGQgbm90IGRldGVybWluZSBzY2VuZSByb290LCBub2RlIGNyZWF0ZWQgYXQgZGVmYXVsdCBsb2NhdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0Tm9kZUluZm8odXVpZDogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdxdWVyeS1ub2RlJywgdXVpZCkudGhlbigobm9kZURhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghbm9kZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAnTm9kZSBub3QgZm91bmQgb3IgaW52YWxpZCByZXNwb25zZSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8g5qC55o2u5a6e6ZmF6L+U5Zue55qE5pWw5o2u57uT5p6E6Kej5p6Q6IqC54K55L+h5oGvXG4gICAgICAgICAgICAgICAgY29uc3QgaW5mbzogTm9kZUluZm8gPSB7XG4gICAgICAgICAgICAgICAgICAgIHV1aWQ6IG5vZGVEYXRhLnV1aWQ/LnZhbHVlIHx8IHV1aWQsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5vZGVEYXRhLm5hbWU/LnZhbHVlIHx8ICdVbmtub3duJyxcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiBub2RlRGF0YS5hY3RpdmU/LnZhbHVlICE9PSB1bmRlZmluZWQgPyBub2RlRGF0YS5hY3RpdmUudmFsdWUgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogbm9kZURhdGEucG9zaXRpb24/LnZhbHVlIHx8IHsgeDogMCwgeTogMCwgejogMCB9LFxuICAgICAgICAgICAgICAgICAgICByb3RhdGlvbjogbm9kZURhdGEucm90YXRpb24/LnZhbHVlIHx8IHsgeDogMCwgeTogMCwgejogMCB9LFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogbm9kZURhdGEuc2NhbGU/LnZhbHVlIHx8IHsgeDogMSwgeTogMSwgejogMSB9LFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IG5vZGVEYXRhLnBhcmVudD8udmFsdWU/LnV1aWQgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IG5vZGVEYXRhLmNoaWxkcmVuIHx8IFtdLFxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzOiAobm9kZURhdGEuX19jb21wc19fIHx8IFtdKS5tYXAoKGNvbXA6IGFueSkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGNvbXAuX190eXBlX18gfHwgJ1Vua25vd24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogY29tcC5lbmFibGVkICE9PSB1bmRlZmluZWQgPyBjb21wLmVuYWJsZWQgOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXI6IG5vZGVEYXRhLmxheWVyPy52YWx1ZSB8fCAxMDczNzQxODI0LFxuICAgICAgICAgICAgICAgICAgICBtb2JpbGl0eTogbm9kZURhdGEubW9iaWxpdHk/LnZhbHVlIHx8IDBcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBpbmZvIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGZpbmROb2RlcyhwYXR0ZXJuOiBzdHJpbmcsIGV4YWN0TWF0Y2g6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgLy8gTm90ZTogJ3F1ZXJ5LW5vZGVzLWJ5LW5hbWUnIEFQSSBkb2Vzbid0IGV4aXN0IGluIG9mZmljaWFsIGRvY3VtZW50YXRpb25cbiAgICAgICAgICAgIC8vIFVzaW5nIHRyZWUgdHJhdmVyc2FsIGFzIHByaW1hcnkgYXBwcm9hY2hcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3F1ZXJ5LW5vZGUtdHJlZScpLnRoZW4oKHRyZWU6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHNlYXJjaFRyZWUgPSAobm9kZTogYW55LCBjdXJyZW50UGF0aDogc3RyaW5nID0gJycpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZVBhdGggPSBjdXJyZW50UGF0aCA/IGAke2N1cnJlbnRQYXRofS8ke25vZGUubmFtZX1gIDogbm9kZS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IGV4YWN0TWF0Y2ggPyBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUubmFtZSA9PT0gcGF0dGVybiA6IFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocGF0dGVybi50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dWlkOiBub2RlLnV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG5vZGVQYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFRyZWUoY2hpbGQsIG5vZGVQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHRyZWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoVHJlZSh0cmVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IG5vZGVzIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDlpIfnlKjmlrnmoYjvvJrkvb/nlKjlnLrmma/ohJrmnKxcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29jb3MtbWNwLXNlcnZlcicsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ2ZpbmROb2RlcycsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtwYXR0ZXJuLCBleGFjdE1hdGNoXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnZXhlY3V0ZS1zY2VuZS1zY3JpcHQnLCBvcHRpb25zKS50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycjI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBUcmVlIHNlYXJjaCBmYWlsZWQ6ICR7ZXJyLm1lc3NhZ2V9LCBTY2VuZSBzY3JpcHQgZmFpbGVkOiAke2VycjIubWVzc2FnZX1gIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZmluZE5vZGVCeU5hbWUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAvLyDkvJjlhYjlsJ3or5Xkvb/nlKggRWRpdG9yIEFQSSDmn6Xor6LoioLngrnmoJHlubbmkJzntKJcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3F1ZXJ5LW5vZGUtdHJlZScpLnRoZW4oKHRyZWU6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kTm9kZSA9IHRoaXMuc2VhcmNoTm9kZUluVHJlZSh0cmVlLCBuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZm91bmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dWlkOiBmb3VuZE5vZGUudXVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBmb3VuZE5vZGUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB0aGlzLmdldE5vZGVQYXRoKGZvdW5kTm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYE5vZGUgJyR7bmFtZX0nIG5vdCBmb3VuZGAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDlpIfnlKjmlrnmoYjvvJrkvb/nlKjlnLrmma/ohJrmnKxcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29jb3MtbWNwLXNlcnZlcicsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ2ZpbmROb2RlQnlOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW25hbWVdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdleGVjdXRlLXNjZW5lLXNjcmlwdCcsIG9wdGlvbnMpLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyMjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYERpcmVjdCBBUEkgZmFpbGVkOiAke2Vyci5tZXNzYWdlfSwgU2NlbmUgc2NyaXB0IGZhaWxlZDogJHtlcnIyLm1lc3NhZ2V9YCB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNlYXJjaE5vZGVJblRyZWUobm9kZTogYW55LCB0YXJnZXROYW1lOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICBpZiAobm9kZS5uYW1lID09PSB0YXJnZXROYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gdGhpcy5zZWFyY2hOb2RlSW5UcmVlKGNoaWxkLCB0YXJnZXROYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRBbGxOb2RlcygpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIC8vIOWwneivleafpeivouWcuuaZr+iKgueCueagkVxuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncXVlcnktbm9kZS10cmVlJykudGhlbigodHJlZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZXM6IGFueVtdID0gW107XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgdHJhdmVyc2VUcmVlID0gKG5vZGU6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IG5vZGUudXVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG5vZGUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IG5vZGUudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogbm9kZS5hY3RpdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB0aGlzLmdldE5vZGVQYXRoKG5vZGUpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlcnNlVHJlZShjaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0cmVlICYmIHRyZWUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhdmVyc2VUcmVlKHRyZWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxOb2Rlczogbm9kZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g5aSH55So5pa55qGI77ya5L2/55So5Zy65pmv6ISa5pysXG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvY29zLW1jcC1zZXJ2ZXInLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXRBbGxOb2RlcycsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdleGVjdXRlLXNjZW5lLXNjcmlwdCcsIG9wdGlvbnMpLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyMjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYERpcmVjdCBBUEkgZmFpbGVkOiAke2Vyci5tZXNzYWdlfSwgU2NlbmUgc2NyaXB0IGZhaWxlZDogJHtlcnIyLm1lc3NhZ2V9YCB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE5vZGVQYXRoKG5vZGU6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBbbm9kZS5uYW1lXTtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBub2RlLnBhcmVudDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudC5uYW1lICE9PSAnQ2FudmFzJykge1xuICAgICAgICAgICAgcGF0aC51bnNoaWZ0KGN1cnJlbnQubmFtZSk7XG4gICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGguam9pbignLycpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgc2V0Tm9kZVByb3BlcnR5KHV1aWQ6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgLy8g5bCd6K+V55u05o6l5L2/55SoIEVkaXRvciBBUEkg6K6+572u6IqC54K55bGe5oCnXG4gICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdzZXQtcHJvcGVydHknLCB7XG4gICAgICAgICAgICAgICAgdXVpZDogdXVpZCxcbiAgICAgICAgICAgICAgICBwYXRoOiBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICBkdW1wOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIEdldCBjb21wcmVoZW5zaXZlIHZlcmlmaWNhdGlvbiBkYXRhIGluY2x1ZGluZyB1cGRhdGVkIG5vZGUgaW5mb1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Tm9kZUluZm8odXVpZCkudGhlbigobm9kZUluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFByb3BlcnR5ICcke3Byb3BlcnR5fScgdXBkYXRlZCBzdWNjZXNzZnVsbHlgLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVVdWlkOiB1dWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJpZmljYXRpb25EYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUluZm86IG5vZGVJbmZvLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlRGV0YWlsczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFByb3BlcnR5ICcke3Byb3BlcnR5fScgdXBkYXRlZCBzdWNjZXNzZnVsbHkgKHZlcmlmaWNhdGlvbiBmYWlsZWQpYFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c55u05o6l6K6+572u5aSx6LSl77yM5bCd6K+V5L2/55So5Zy65pmv6ISa5pysXG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvY29zLW1jcC1zZXJ2ZXInLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdzZXROb2RlUHJvcGVydHknLFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbdXVpZCwgcHJvcGVydHksIHZhbHVlXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnZXhlY3V0ZS1zY2VuZS1zY3JpcHQnLCBvcHRpb25zKS50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycjI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBEaXJlY3QgQVBJIGZhaWxlZDogJHtlcnIubWVzc2FnZX0sIFNjZW5lIHNjcmlwdCBmYWlsZWQ6ICR7ZXJyMi5tZXNzYWdlfWAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZXROb2RlVHJhbnNmb3JtKGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyB1dWlkLCBwb3NpdGlvbiwgcm90YXRpb24sIHNjYWxlIH0gPSBhcmdzO1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlUHJvbWlzZXM6IFByb21pc2U8YW55PltdID0gW107XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgY29uc3Qgd2FybmluZ3M6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gRmlyc3QgZ2V0IG5vZGUgaW5mbyB0byBkZXRlcm1pbmUgaWYgaXQncyAyRCBvciAzRFxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVJbmZvUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldE5vZGVJbmZvKHV1aWQpO1xuICAgICAgICAgICAgICAgIGlmICghbm9kZUluZm9SZXNwb25zZS5zdWNjZXNzIHx8ICFub2RlSW5mb1Jlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0ZhaWxlZCB0byBnZXQgbm9kZSBpbmZvcm1hdGlvbicgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZUluZm8gPSBub2RlSW5mb1Jlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgaXMyRE5vZGUgPSB0aGlzLmlzMkROb2RlKG5vZGVJbmZvKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZFBvc2l0aW9uID0gdGhpcy5ub3JtYWxpemVUcmFuc2Zvcm1WYWx1ZShwb3NpdGlvbiwgJ3Bvc2l0aW9uJywgaXMyRE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFBvc2l0aW9uLndhcm5pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5pbmdzLnB1c2gobm9ybWFsaXplZFBvc2l0aW9uLndhcm5pbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVQcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnc2V0LXByb3BlcnR5Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IHV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJ3Bvc2l0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdW1wOiB7IHZhbHVlOiBub3JtYWxpemVkUG9zaXRpb24udmFsdWUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlcy5wdXNoKCdwb3NpdGlvbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAocm90YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZFJvdGF0aW9uID0gdGhpcy5ub3JtYWxpemVUcmFuc2Zvcm1WYWx1ZShyb3RhdGlvbiwgJ3JvdGF0aW9uJywgaXMyRE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFJvdGF0aW9uLndhcm5pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5pbmdzLnB1c2gobm9ybWFsaXplZFJvdGF0aW9uLndhcm5pbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVQcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnc2V0LXByb3BlcnR5Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IHV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJ3JvdGF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdW1wOiB7IHZhbHVlOiBub3JtYWxpemVkUm90YXRpb24udmFsdWUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlcy5wdXNoKCdyb3RhdGlvbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoc2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZFNjYWxlID0gdGhpcy5ub3JtYWxpemVUcmFuc2Zvcm1WYWx1ZShzY2FsZSwgJ3NjYWxlJywgaXMyRE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFNjYWxlLndhcm5pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5pbmdzLnB1c2gobm9ybWFsaXplZFNjYWxlLndhcm5pbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVQcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnc2V0LXByb3BlcnR5Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IHV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJ3NjYWxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdW1wOiB7IHZhbHVlOiBub3JtYWxpemVkU2NhbGUudmFsdWUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlcy5wdXNoKCdzY2FsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlUHJvbWlzZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdObyB0cmFuc2Zvcm0gcHJvcGVydGllcyBzcGVjaWZpZWQnIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHVwZGF0ZVByb21pc2VzKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBWZXJpZnkgdGhlIGNoYW5nZXMgYnkgZ2V0dGluZyB1cGRhdGVkIG5vZGUgaW5mb1xuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWROb2RlSW5mbyA9IGF3YWl0IHRoaXMuZ2V0Tm9kZUluZm8odXVpZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2U6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFRyYW5zZm9ybSBwcm9wZXJ0aWVzIHVwZGF0ZWQ6ICR7dXBkYXRlcy5qb2luKCcsICcpfSAke2lzMkROb2RlID8gJygyRCBub2RlKScgOiAnKDNEIG5vZGUpJ31gLFxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkUHJvcGVydGllczogdXBkYXRlcyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVV1aWQ6IHV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlVHlwZTogaXMyRE5vZGUgPyAnMkQnIDogJzNEJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGxpZWRDaGFuZ2VzOiB1cGRhdGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtQ29uc3RyYWludHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogaXMyRE5vZGUgPyAneCwgeSBvbmx5ICh6IGlnbm9yZWQpJyA6ICd4LCB5LCB6IGFsbCB1c2VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3RhdGlvbjogaXMyRE5vZGUgPyAneiBvbmx5ICh4LCB5IGlnbm9yZWQpJyA6ICd4LCB5LCB6IGFsbCB1c2VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogaXMyRE5vZGUgPyAneCwgeSBtYWluLCB6IHR5cGljYWxseSAxJyA6ICd4LCB5LCB6IGFsbCB1c2VkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2ZXJpZmljYXRpb25EYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlSW5mbzogdXBkYXRlZE5vZGVJbmZvLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1EZXRhaWxzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxOb2RlVHlwZTogaXMyRE5vZGUgPyAnMkQnIDogJzNEJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBsaWVkVHJhbnNmb3JtczogdXBkYXRlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZUFmdGVyQ29tcGFyaXNvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZTogbm9kZUluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXI6IHVwZGF0ZWROb2RlSW5mby5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh3YXJuaW5ncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLndhcm5pbmcgPSB3YXJuaW5ncy5qb2luKCc7ICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBgRmFpbGVkIHRvIHVwZGF0ZSB0cmFuc2Zvcm06ICR7ZXJyLm1lc3NhZ2V9YCBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpczJETm9kZShub2RlSW5mbzogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIC8vIENoZWNrIGlmIG5vZGUgaGFzIDJELXNwZWNpZmljIGNvbXBvbmVudHMgb3IgaXMgdW5kZXIgQ2FudmFzXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBub2RlSW5mby5jb21wb25lbnRzIHx8IFtdO1xuICAgICAgICBcbiAgICAgICAgLy8gQ2hlY2sgZm9yIGNvbW1vbiAyRCBjb21wb25lbnRzXG4gICAgICAgIGNvbnN0IGhhczJEQ29tcG9uZW50cyA9IGNvbXBvbmVudHMuc29tZSgoY29tcDogYW55KSA9PiBcbiAgICAgICAgICAgIGNvbXAudHlwZSAmJiAoXG4gICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5TcHJpdGUnKSB8fFxuICAgICAgICAgICAgICAgIGNvbXAudHlwZS5pbmNsdWRlcygnY2MuTGFiZWwnKSB8fFxuICAgICAgICAgICAgICAgIGNvbXAudHlwZS5pbmNsdWRlcygnY2MuQnV0dG9uJykgfHxcbiAgICAgICAgICAgICAgICBjb21wLnR5cGUuaW5jbHVkZXMoJ2NjLkxheW91dCcpIHx8XG4gICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5XaWRnZXQnKSB8fFxuICAgICAgICAgICAgICAgIGNvbXAudHlwZS5pbmNsdWRlcygnY2MuTWFzaycpIHx8XG4gICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5HcmFwaGljcycpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICBpZiAoaGFzMkRDb21wb25lbnRzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gQ2hlY2sgZm9yIDNELXNwZWNpZmljIGNvbXBvbmVudHMgIFxuICAgICAgICBjb25zdCBoYXMzRENvbXBvbmVudHMgPSBjb21wb25lbnRzLnNvbWUoKGNvbXA6IGFueSkgPT5cbiAgICAgICAgICAgIGNvbXAudHlwZSAmJiAoXG4gICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5NZXNoUmVuZGVyZXInKSB8fFxuICAgICAgICAgICAgICAgIGNvbXAudHlwZS5pbmNsdWRlcygnY2MuQ2FtZXJhJykgfHxcbiAgICAgICAgICAgICAgICBjb21wLnR5cGUuaW5jbHVkZXMoJ2NjLkxpZ2h0JykgfHxcbiAgICAgICAgICAgICAgICBjb21wLnR5cGUuaW5jbHVkZXMoJ2NjLkRpcmVjdGlvbmFsTGlnaHQnKSB8fFxuICAgICAgICAgICAgICAgIGNvbXAudHlwZS5pbmNsdWRlcygnY2MuUG9pbnRMaWdodCcpIHx8XG4gICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5TcG90TGlnaHQnKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgaWYgKGhhczNEQ29tcG9uZW50cykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBEZWZhdWx0IGhldXJpc3RpYzogaWYgeiBwb3NpdGlvbiBpcyAwIGFuZCBoYXNuJ3QgYmVlbiBjaGFuZ2VkLCBsaWtlbHkgMkRcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBub2RlSW5mby5wb3NpdGlvbjtcbiAgICAgICAgaWYgKHBvc2l0aW9uICYmIE1hdGguYWJzKHBvc2l0aW9uLnopIDwgMC4wMDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBEZWZhdWx0IHRvIDNEIGlmIHVuY2VydGFpblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3JtYWxpemVUcmFuc2Zvcm1WYWx1ZSh2YWx1ZTogYW55LCB0eXBlOiAncG9zaXRpb24nIHwgJ3JvdGF0aW9uJyB8ICdzY2FsZScsIGlzMkQ6IGJvb2xlYW4pOiB7IHZhbHVlOiBhbnksIHdhcm5pbmc/OiBzdHJpbmcgfSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHsgLi4udmFsdWUgfTtcbiAgICAgICAgbGV0IHdhcm5pbmc6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgICAgXG4gICAgICAgIGlmIChpczJEKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdwb3NpdGlvbic6XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS56ICE9PSB1bmRlZmluZWQgJiYgTWF0aC5hYnModmFsdWUueikgPiAwLjAwMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2FybmluZyA9IGAyRCBub2RlOiB6IHBvc2l0aW9uICgke3ZhbHVlLnp9KSBpZ25vcmVkLCBzZXQgdG8gMGA7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQueiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUueiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQueiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNhc2UgJ3JvdGF0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh2YWx1ZS54ICE9PSB1bmRlZmluZWQgJiYgTWF0aC5hYnModmFsdWUueCkgPiAwLjAwMSkgfHwgXG4gICAgICAgICAgICAgICAgICAgICAgICAodmFsdWUueSAhPT0gdW5kZWZpbmVkICYmIE1hdGguYWJzKHZhbHVlLnkpID4gMC4wMDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5nID0gYDJEIG5vZGU6IHgseSByb3RhdGlvbnMgaWdub3JlZCwgb25seSB6IHJvdGF0aW9uIGFwcGxpZWRgO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnggPSByZXN1bHQueCB8fCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnkgPSByZXN1bHQueSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC56ID0gcmVzdWx0LnogfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnogPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnogPSAxOyAvLyBEZWZhdWx0IHNjYWxlIGZvciAyRFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gM0Qgbm9kZSAtIGVuc3VyZSBhbGwgYXhlcyBhcmUgZGVmaW5lZFxuICAgICAgICAgICAgcmVzdWx0LnggPSByZXN1bHQueCAhPT0gdW5kZWZpbmVkID8gcmVzdWx0LnggOiAodHlwZSA9PT0gJ3NjYWxlJyA/IDEgOiAwKTtcbiAgICAgICAgICAgIHJlc3VsdC55ID0gcmVzdWx0LnkgIT09IHVuZGVmaW5lZCA/IHJlc3VsdC55IDogKHR5cGUgPT09ICdzY2FsZScgPyAxIDogMCk7XG4gICAgICAgICAgICByZXN1bHQueiA9IHJlc3VsdC56ICE9PSB1bmRlZmluZWQgPyByZXN1bHQueiA6ICh0eXBlID09PSAnc2NhbGUnID8gMSA6IDApO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4geyB2YWx1ZTogcmVzdWx0LCB3YXJuaW5nIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBkZWxldGVOb2RlKHV1aWQ6IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncmVtb3ZlLW5vZGUnLCB7IHV1aWQ6IHV1aWQgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdOb2RlIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIG1vdmVOb2RlKG5vZGVVdWlkOiBzdHJpbmcsIG5ld1BhcmVudFV1aWQ6IHN0cmluZywgc2libGluZ0luZGV4OiBudW1iZXIgPSAtMSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgLy8gVXNlIGNvcnJlY3Qgc2V0LXBhcmVudCBBUEkgaW5zdGVhZCBvZiBtb3ZlLW5vZGVcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3NldC1wYXJlbnQnLCB7XG4gICAgICAgICAgICAgICAgcGFyZW50OiBuZXdQYXJlbnRVdWlkLFxuICAgICAgICAgICAgICAgIHV1aWRzOiBbbm9kZVV1aWRdLFxuICAgICAgICAgICAgICAgIGtlZXBXb3JsZFRyYW5zZm9ybTogZmFsc2VcbiAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm9kZSBtb3ZlZCBzdWNjZXNzZnVsbHknXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZHVwbGljYXRlTm9kZSh1dWlkOiBzdHJpbmcsIGluY2x1ZGVDaGlsZHJlbjogYm9vbGVhbiA9IHRydWUpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIC8vIE5vdGU6IGluY2x1ZGVDaGlsZHJlbiBwYXJhbWV0ZXIgaXMgYWNjZXB0ZWQgZm9yIGZ1dHVyZSB1c2UgYnV0IG5vdCBjdXJyZW50bHkgaW1wbGVtZW50ZWRcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ2R1cGxpY2F0ZS1ub2RlJywgdXVpZCkudGhlbigocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VXVpZDogcmVzdWx0LnV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm9kZSBkdXBsaWNhdGVkIHN1Y2Nlc3NmdWxseSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGRldGVjdE5vZGVUeXBlKHV1aWQ6IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlSW5mb1Jlc3BvbnNlID0gYXdhaXQgdGhpcy5nZXROb2RlSW5mbyh1dWlkKTtcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGVJbmZvUmVzcG9uc2Uuc3VjY2VzcyB8fCAhbm9kZUluZm9SZXNwb25zZS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdGYWlsZWQgdG8gZ2V0IG5vZGUgaW5mb3JtYXRpb24nIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZUluZm8gPSBub2RlSW5mb1Jlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgaXMyRCA9IHRoaXMuaXMyRE5vZGUobm9kZUluZm8pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBub2RlSW5mby5jb21wb25lbnRzIHx8IFtdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIENvbGxlY3QgZGV0ZWN0aW9uIHJlYXNvbnNcbiAgICAgICAgICAgICAgICBjb25zdCBkZXRlY3Rpb25SZWFzb25zOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGZvciAyRCBjb21wb25lbnRzXG4gICAgICAgICAgICAgICAgY29uc3QgdHdvRENvbXBvbmVudHMgPSBjb21wb25lbnRzLmZpbHRlcigoY29tcDogYW55KSA9PiBcbiAgICAgICAgICAgICAgICAgICAgY29tcC50eXBlICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXAudHlwZS5pbmNsdWRlcygnY2MuU3ByaXRlJykgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXAudHlwZS5pbmNsdWRlcygnY2MuTGFiZWwnKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5CdXR0b24nKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5MYXlvdXQnKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5XaWRnZXQnKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5NYXNrJykgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXAudHlwZS5pbmNsdWRlcygnY2MuR3JhcGhpY3MnKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgM0QgY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIGNvbnN0IHRocmVlRENvbXBvbmVudHMgPSBjb21wb25lbnRzLmZpbHRlcigoY29tcDogYW55KSA9PlxuICAgICAgICAgICAgICAgICAgICBjb21wLnR5cGUgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5NZXNoUmVuZGVyZXInKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5DYW1lcmEnKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5MaWdodCcpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wLnR5cGUuaW5jbHVkZXMoJ2NjLkRpcmVjdGlvbmFsTGlnaHQnKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcC50eXBlLmluY2x1ZGVzKCdjYy5Qb2ludExpZ2h0JykgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXAudHlwZS5pbmNsdWRlcygnY2MuU3BvdExpZ2h0JylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHdvRENvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBkZXRlY3Rpb25SZWFzb25zLnB1c2goYEhhcyAyRCBjb21wb25lbnRzOiAke3R3b0RDb21wb25lbnRzLm1hcCgoYzogYW55KSA9PiBjLnR5cGUpLmpvaW4oJywgJyl9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0aHJlZURDb21wb25lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0ZWN0aW9uUmVhc29ucy5wdXNoKGBIYXMgM0QgY29tcG9uZW50czogJHt0aHJlZURDb21wb25lbnRzLm1hcCgoYzogYW55KSA9PiBjLnR5cGUpLmpvaW4oJywgJyl9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIENoZWNrIHBvc2l0aW9uIGZvciBoZXVyaXN0aWNcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5vZGVJbmZvLnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbiAmJiBNYXRoLmFicyhwb3NpdGlvbi56KSA8IDAuMDAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRldGVjdGlvblJlYXNvbnMucHVzaCgnWiBwb3NpdGlvbiBpcyB+MCAobGlrZWx5IDJEKScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocG9zaXRpb24gJiYgTWF0aC5hYnMocG9zaXRpb24ueikgPiAwLjAwMSkge1xuICAgICAgICAgICAgICAgICAgICBkZXRlY3Rpb25SZWFzb25zLnB1c2goYFogcG9zaXRpb24gaXMgJHtwb3NpdGlvbi56fSAobGlrZWx5IDNEKWApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChkZXRlY3Rpb25SZWFzb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBkZXRlY3Rpb25SZWFzb25zLnB1c2goJ05vIHNwZWNpZmljIGluZGljYXRvcnMgZm91bmQsIGRlZmF1bHRpbmcgYmFzZWQgb24gaGV1cmlzdGljcycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlVXVpZDogdXVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVOYW1lOiBub2RlSW5mby5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVR5cGU6IGlzMkQgPyAnMkQnIDogJzNEJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGVjdGlvblJlYXNvbnM6IGRldGVjdGlvblJlYXNvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzOiBjb21wb25lbnRzLm1hcCgoY29tcDogYW55KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGNvbXAudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogdGhpcy5nZXRDb21wb25lbnRDYXRlZ29yeShjb21wLnR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogbm9kZUluZm8ucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1Db25zdHJhaW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBpczJEID8gJ3gsIHkgb25seSAoeiBpZ25vcmVkKScgOiAneCwgeSwgeiBhbGwgdXNlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRpb246IGlzMkQgPyAneiBvbmx5ICh4LCB5IGlnbm9yZWQpJyA6ICd4LCB5LCB6IGFsbCB1c2VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogaXMyRCA/ICd4LCB5IG1haW4sIHogdHlwaWNhbGx5IDEnIDogJ3gsIHksIHogYWxsIHVzZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBgRmFpbGVkIHRvIGRldGVjdCBub2RlIHR5cGU6ICR7ZXJyLm1lc3NhZ2V9YCBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb21wb25lbnRDYXRlZ29yeShjb21wb25lbnRUeXBlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIWNvbXBvbmVudFR5cGUpIHJldHVybiAndW5rbm93bic7XG4gICAgICAgIFxuICAgICAgICBpZiAoY29tcG9uZW50VHlwZS5pbmNsdWRlcygnY2MuU3ByaXRlJykgfHwgY29tcG9uZW50VHlwZS5pbmNsdWRlcygnY2MuTGFiZWwnKSB8fCBcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGUuaW5jbHVkZXMoJ2NjLkJ1dHRvbicpIHx8IGNvbXBvbmVudFR5cGUuaW5jbHVkZXMoJ2NjLkxheW91dCcpIHx8XG4gICAgICAgICAgICBjb21wb25lbnRUeXBlLmluY2x1ZGVzKCdjYy5XaWRnZXQnKSB8fCBjb21wb25lbnRUeXBlLmluY2x1ZGVzKCdjYy5NYXNrJykgfHxcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGUuaW5jbHVkZXMoJ2NjLkdyYXBoaWNzJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnMkQnO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoY29tcG9uZW50VHlwZS5pbmNsdWRlcygnY2MuTWVzaFJlbmRlcmVyJykgfHwgY29tcG9uZW50VHlwZS5pbmNsdWRlcygnY2MuQ2FtZXJhJykgfHxcbiAgICAgICAgICAgIGNvbXBvbmVudFR5cGUuaW5jbHVkZXMoJ2NjLkxpZ2h0JykgfHwgY29tcG9uZW50VHlwZS5pbmNsdWRlcygnY2MuRGlyZWN0aW9uYWxMaWdodCcpIHx8XG4gICAgICAgICAgICBjb21wb25lbnRUeXBlLmluY2x1ZGVzKCdjYy5Qb2ludExpZ2h0JykgfHwgY29tcG9uZW50VHlwZS5pbmNsdWRlcygnY2MuU3BvdExpZ2h0JykpIHtcbiAgICAgICAgICAgIHJldHVybiAnM0QnO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gJ2dlbmVyaWMnO1xuICAgIH1cbn0iXX0=