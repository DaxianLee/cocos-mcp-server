import { ToolDefinition, ToolResponse, ToolExecutor, NodeInfo } from '../types';
import { ComponentTools } from './component-tools';

declare const Editor: any;

export class NodeTools implements ToolExecutor {
    private componentTools = new ComponentTools();
    
    getTools(): ToolDefinition[] {
        return [
            // 1. Node Query - Search and information
            {
                name: 'node_query',
                description: 'NODE SEARCH & INFORMATION: Essential tool for finding and inspecting scene nodes. CRITICAL WORKFLOW: Always use this FIRST to get node UUIDs before any modifications. Use "find" for partial name search, "find_by_name" for exact match, "info" for detailed node data, "list_all" to see entire scene structure.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['info', 'find', 'find_by_name', 'list_all', 'detect_type', 'tree'],
                            description: 'Search/query operation: "info" = get complete node details (requires uuid) | "find" = search by partial name match (requires pattern) | "find_by_name" = find exact name (requires name) | "list_all" = get all scene nodes | "detect_type" = determine 2D/3D type (requires uuid) | "tree" = get hierarchical structure (optional uuid for subtree)'
                        },
                        uuid: {
                            type: 'string',
                            description: 'Target node UUID (REQUIRED for info/detect_type actions). For tree action: root node UUID (optional, defaults to scene root). IMPORTANT: Get UUID from find/find_by_name/list_all first! Format: "12345678-abcd-1234-5678-123456789abc"'
                        },
                        pattern: {
                            type: 'string',
                            description: 'Name search pattern (REQUIRED for find action). Supports partial matching. Examples: "Player" finds "Player", "PlayerController", "EnemyPlayer". Case-insensitive unless exactMatch=true.'
                        },
                        name: {
                            type: 'string',
                            description: 'Exact node name (REQUIRED for find_by_name action). Must match perfectly including case and spaces. Examples: "MainCamera", "UI Root", "Background Image". Use find action for partial matches.'
                        },
                        exactMatch: {
                            type: 'boolean',
                            description: 'Match mode for find action. false (default) = partial matching ("btn" finds "btnClose", "submitBtn"), true = exact matching ("btn" finds only "btn"). Recommended: false for discovery, true for precision.',
                            default: false
                        },
                        maxDepth: {
                            type: 'number',
                            description: 'Maximum tree depth to traverse. Use with action="tree". Controls how deep to traverse the node hierarchy.',
                            default: 10,
                            minimum: 1,
                            maximum: 20
                        }
                    },
                    required: ['action']
                }
            },
            
            // 2. Node Lifecycle - Create and delete
            {
                name: 'node_lifecycle',
                description: 'NODE CREATION & DELETION: Create new nodes or delete existing ones. CRITICAL WORKFLOW for create: 1) Use node_query to find parent UUID, 2) Provide parentUuid (scene root if omitted), 3) Add components or instantiate from prefab. Delete only needs node UUID.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['create', 'delete'],
                            description: 'Lifecycle operation: "create" = add new node to scene (requires name, optional parentUuid/components/assetPath) | "delete" = remove node from scene (requires uuid from node_query)'
                        },
                        // Create parameters
                        name: {
                            type: 'string',
                            description: 'Node name (REQUIRED for create action). Choose descriptive names. Examples: "PlayerSprite" for game character, "MainMenuButton" for UI element, "BackgroundMusic" for audio node.'
                        },
                        parentUuid: {
                            type: 'string',
                            description: 'Parent node UUID for new node placement (create action). WORKFLOW: Use node_query to find parent UUID first. If omitted, creates under scene root. Examples: Canvas UUID for UI elements, Scene root UUID for game objects.'
                        },
                        nodeType: {
                            type: 'string',
                            enum: ['Node', '2DNode', '3DNode'],
                            description: 'Node type (for create)',
                            default: 'Node'
                        },
                        components: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Component types to attach (create action). Common combinations: ["cc.Sprite"] for images, ["cc.Label"] for text, ["cc.Button", "cc.Sprite"] for clickable images. Format: ["cc.ComponentName"]'
                        },
                        assetUuid: {
                            type: 'string',
                            description: 'Prefab asset UUID for instantiation (create action). Use asset_query to find prefab UUID first. Creates complete prefab instance with all children and components. Alternative to components parameter.'
                        },
                        assetPath: {
                            type: 'string',
                            description: 'Prefab asset path for instantiation (create action). Alternative to assetUuid. Examples: "db://assets/prefabs/Player.prefab", "db://assets/ui/MenuPanel.prefab". System resolves path to UUID automatically.'
                        },
                        unlinkPrefab: {
                            type: 'boolean',
                            description: 'Unlink from prefab after creation',
                            default: false
                        },
                        initialTransform: {
                            type: 'object',
                            properties: {
                                position: {
                                    type: 'object',
                                    properties: {
                                        x: { type: 'number' },
                                        y: { type: 'number' },
                                        z: { type: 'number' }
                                    }
                                },
                                rotation: {
                                    type: 'object',
                                    properties: {
                                        x: { type: 'number' },
                                        y: { type: 'number' },
                                        z: { type: 'number' }
                                    }
                                },
                                scale: {
                                    type: 'object',
                                    properties: {
                                        x: { type: 'number' },
                                        y: { type: 'number' },
                                        z: { type: 'number' }
                                    }
                                }
                            },
                            description: 'Initial transform (for create)'
                        },
                        // Delete parameters
                        uuid: {
                            type: 'string',
                            description: 'Target node UUID for deletion (REQUIRED for delete action). WORKFLOW: Use node_query to find UUID first. WARNING: Deletes node and all children permanently. Format: "12345678-abcd-1234-5678-123456789abc"'
                        }
                    },
                    required: ['action']
                }
            },
            
            // 3. Node Transform - Properties and transformation
            {
                name: 'node_transform',
                description: 'MODIFY NODE PROPERTIES: Use this to change node name, visibility, position, rotation, scale, or other properties. Automatically handles 2D/3D differences. ALWAYS provide uuid (get from node_query first).',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'REQUIRED: UUID of node to modify. Get this from node_query first! Without UUID, cannot modify node.'
                        },
                        name: {
                            type: 'string',
                            description: 'Change node name. Example: "PlayerSprite" → "EnemySprite"'
                        },
                        active: {
                            type: 'boolean',
                            description: 'Show/hide node. true = visible, false = hidden. Hidden nodes and their children don\'t render'
                        },
                        layer: {
                            type: 'number',
                            description: 'Node layer'
                        },
                        mobility: {
                            type: 'number',
                            description: 'Node mobility setting'
                        },
                        position: {
                            type: 'object',
                            properties: {
                                x: { type: 'number' },
                                y: { type: 'number' },
                                z: { type: 'number', description: 'Z coordinate (ignored for 2D nodes)' }
                            },
                            description: 'Set node position {x, y, z}. For 2D nodes: only x,y matter (z auto-set to 0). Example: {x: 100, y: 200}'
                        },
                        rotation: {
                            type: 'object',
                            properties: {
                                x: { type: 'number', description: 'X rotation (ignored for 2D nodes)' },
                                y: { type: 'number', description: 'Y rotation (ignored for 2D nodes)' },
                                z: { type: 'number', description: 'Z rotation (main axis for 2D nodes)' }
                            },
                            description: 'Set node rotation {x, y, z} in degrees. For 2D nodes: only z matters (x,y ignored). Example 2D: {z: 45}, 3D: {x: 30, y: 45, z: 0}'
                        },
                        scale: {
                            type: 'object',
                            properties: {
                                x: { type: 'number' },
                                y: { type: 'number' },
                                z: { type: 'number', description: 'Z scale (usually 1 for 2D nodes)' }
                            },
                            description: 'Set node scale {x, y, z}. For 2D nodes: z typically stays 1. Example: {x: 2, y: 2} doubles size'
                        },
                        customProperties: {
                            type: 'object',
                            description: 'Other properties as key-value pairs'
                        }
                    },
                    required: ['uuid']
                }
            },
            
            // 4. Node Hierarchy - Parent-child operations
            {
                name: 'node_hierarchy',
                description: 'MOVE OR COPY NODES: Use this to change node parent (move in hierarchy) or duplicate nodes. For move: changes which node is the parent. For duplicate: creates a copy of the node.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['move', 'duplicate'],
                            description: 'Choose action: "move" = change node\'s parent | "duplicate" = create a copy of node'
                        },
                        // Move parameters
                        nodeUuid: {
                            type: 'string',
                            description: 'UUID of node to move. Use with action="move". Get UUID from node_query first!'
                        },
                        newParentUuid: {
                            type: 'string',
                            description: 'UUID of new parent node. Use with action="move". The node will become a child of this parent'
                        },
                        siblingIndex: {
                            type: 'number',
                            description: 'Sibling index in new parent',
                            default: -1
                        },
                        // Duplicate parameters
                        uuid: {
                            type: 'string',
                            description: 'UUID of node to copy. Use with action="duplicate". Creates an exact copy with new UUID'
                        },
                        includeChildren: {
                            type: 'boolean',
                            description: 'Include children when duplicating',
                            default: true
                        }
                    },
                    required: ['action']
                }
            },

            // 5. Node Clipboard Operations - Copy, paste, cut
            {
                name: 'node_clipboard',
                description: 'CLIPBOARD OPERATIONS: Copy, paste, cut nodes and manage node clipboard operations. Use this for duplicating and moving nodes within the scene hierarchy.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['copy', 'paste', 'cut'],
                            description: 'Action: "copy" = copy nodes to clipboard | "paste" = paste nodes from clipboard to target parent | "cut" = cut nodes (copy + mark for move)'
                        },
                        // For copy and cut actions
                        uuids: {
                            type: ['string', 'array'],
                            items: { type: 'string' },
                            description: 'Node UUID(s) to copy or cut. Can be a single string UUID or array of UUIDs. Get UUIDs from node_query tool first!'
                        },
                        // For paste action
                        target: {
                            type: 'string',
                            description: 'Target parent node UUID for paste operation. The copied/cut nodes will become children of this node.'
                        },
                        keepWorldTransform: {
                            type: 'boolean',
                            description: 'Preserve world coordinates when pasting (paste action only). true = keep world position, false = use local position',
                            default: false
                        }
                    },
                    required: ['action']
                }
            },

            // 6. Node Property Management - Reset properties
            {
                name: 'node_property_management',
                description: 'PROPERTY MANAGEMENT: Reset node properties, transform values, or component settings to defaults. Use this to restore original values and clean up modifications.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['reset_property', 'reset_transform', 'reset_component'],
                            description: 'Action: "reset_property" = reset specific node property | "reset_transform" = reset position/rotation/scale | "reset_component" = reset component to defaults'
                        },
                        // For reset_property and reset_transform actions
                        uuid: {
                            type: 'string',
                            description: 'Node UUID for reset_property/reset_transform actions, or Component UUID for reset_component action. Get UUID from appropriate query tools.'
                        },
                        // For reset_property action only
                        path: {
                            type: 'string',
                            description: 'Property path to reset (reset_property action only). Examples: "position", "rotation", "scale", "active", "layer"'
                        }
                    },
                    required: ['action', 'uuid']
                }
            },

            // 7. Node Array Management - Move or remove array elements
            {
                name: 'node_array_management',
                description: 'ARRAY MANAGEMENT: Move or remove elements in node array properties like component lists. Use this for reordering components or removing array items.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['move_element', 'remove_element'],
                            description: 'Action: "move_element" = change array element position | "remove_element" = delete array element at index'
                        },
                        uuid: {
                            type: 'string',
                            description: 'Node UUID that contains the array property. Get UUID from node_query tool.'
                        },
                        path: {
                            type: 'string',
                            description: 'Array property path. Common examples: "__comps__" (components), "children" (child nodes)'
                        },
                        index: {
                            type: 'number',
                            description: 'Target array index to operate on. 0-based indexing (remove_element action only)'
                        },
                        // For move_element action
                        target: {
                            type: 'number',
                            description: 'Original index of element to move (move_element action only)'
                        },
                        offset: {
                            type: 'number',
                            description: 'Position offset to move by (move_element action only). Positive = move down, negative = move up'
                        }
                    },
                    required: ['action', 'uuid', 'path']
                }
            },

            // 8. Node Script Management - Attach/remove custom scripts
            {
                name: 'node_script_management',
                description: 'NODE SCRIPT MANAGEMENT: Attach or remove custom TypeScript/JavaScript components to/from nodes. WORKFLOW: 1) Use \"attach\" with scriptPath for new scripts, 2) Use component_query from component-tools to see attached scripts, 3) Use \"remove\" with scriptCid to detach. Scripts are node-based components with UUID-format CIDs.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['attach', 'remove'],
                            description: 'Script operation: \"attach\" = add custom script to node (requires nodeUuid+scriptPath) | \"remove\" = detach script from node (requires nodeUuid+scriptCid from component_query)'
                        },
                        nodeUuid: {
                            type: 'string',
                            description: 'Target node UUID (REQUIRED). Get from node_query tool first. Format: \"12345678-abcd-1234-5678-123456789abc\". Script will be attached to/removed from this node.'
                        },
                        scriptPath: {
                            type: 'string',
                            description: 'Script file path (REQUIRED for attach action). Must be valid Cocos asset path. Examples: \"db://assets/scripts/PlayerController.ts\", \"db://assets/game/GameManager.js\". Use asset_query to find script paths.'
                        },
                        scriptCid: {
                            type: 'string',
                            description: 'Script component ID (REQUIRED for remove action). UUID-like format from component_query list. Example: \"9b4a7ueT9xD6aRE+AlOusy1\". Cannot remove script without exact CID - use component_query from component-tools first!'
                        }
                    },
                    required: ['action', 'nodeUuid']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        console.log(`[NodeTools] Executing ${toolName} with args:`, args);
        
        try {
            switch (toolName) {
                case 'node_query':
                    return await this.handleNodeQuery(args);
                case 'node_lifecycle':
                    return await this.handleNodeLifecycle(args);
                case 'node_transform':
                    return await this.handleNodeTransform(args);
                case 'node_hierarchy':
                    return await this.handleNodeHierarchy(args);
                case 'node_clipboard':
                    return await this.handleNodeClipboard(args);
                case 'node_property_management':
                    return await this.handleNodePropertyManagement(args);
                case 'node_array_management':
                    return await this.handleNodeArrayManagement(args);
                case 'node_script_management':
                    return await this.handleNodeScriptManagement(args);
                default:
                    throw new Error(`Unknown tool: ${toolName}`);
            }
        } catch (error) {
            console.error(`[NodeTools] Error in ${toolName}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    private async handleNodeQuery(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'info':
                if (!args.uuid) {
                    return { success: false, error: 'UUID required for info action' };
                }
                return await this.getNodeInfo(args.uuid);
                
            case 'find':
                if (!args.pattern) {
                    return { success: false, error: 'Pattern required for find action' };
                }
                return await this.findNodes(args.pattern, args.exactMatch);
                
            case 'find_by_name':
                if (!args.name) {
                    return { success: false, error: 'Name required for find_by_name action' };
                }
                return await this.findNodeByName(args.name);
                
            case 'list_all':
                return await this.getAllNodes();
                
            case 'detect_type':
                if (!args.uuid) {
                    return { success: false, error: 'UUID required for detect_type action' };
                }
                return await this.detectNodeType(args.uuid);
                
            case 'tree':
                return await this.getNodeTree(args.uuid, args.maxDepth || 10);
                
            default:
                return { success: false, error: `Unknown query action: ${action}` };
        }
    }

    private async handleNodeLifecycle(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'create':
                if (!args.name) {
                    return { success: false, error: 'Name required for create action' };
                }
                return await this.createNode(args);
                
            case 'delete':
                if (!args.uuid) {
                    return { success: false, error: 'UUID required for delete action' };
                }
                return await this.deleteNode(args.uuid);
                
            default:
                return { success: false, error: `Unknown lifecycle action: ${action}` };
        }
    }

    private async handleNodeTransform(args: any): Promise<ToolResponse> {
        if (!args.uuid) {
            return { success: false, error: 'UUID required for transform operations' };
        }
        return await this.setNodeProperties(args.uuid, args);
    }

    private async handleNodeHierarchy(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'move':
                if (!args.nodeUuid || !args.newParentUuid) {
                    return { success: false, error: 'nodeUuid and newParentUuid required for move action' };
                }
                return await this.moveNode(args.nodeUuid, args.newParentUuid, args.siblingIndex);
                
            case 'duplicate':
                if (!args.uuid) {
                    return { success: false, error: 'UUID required for duplicate action' };
                }
                return await this.duplicateNode(args.uuid, args.includeChildren);
                
            default:
                return { success: false, error: `Unknown hierarchy action: ${action}` };
        }
    }

    private async handleNodeClipboard(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'copy':
                return await this.copyNode(args.uuids);
            case 'paste':
                return await this.pasteNode(args.target, args.uuids, args.keepWorldTransform);
            case 'cut':
                return await this.cutNode(args.uuids);
            default:
                return { success: false, error: `Unknown clipboard action: ${action}` };
        }
    }

    private async handleNodePropertyManagement(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'reset_property':
                return await this.resetNodeProperty(args.uuid, args.path);
            case 'reset_transform':
                return await this.resetNodeTransform(args.uuid);
            case 'reset_component':
                return await this.resetComponent(args.uuid);
            default:
                return { success: false, error: `Unknown property management action: ${action}` };
        }
    }

    private async handleNodeArrayManagement(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'move_element':
                return await this.moveArrayElement(args.uuid, args.path, args.target, args.offset);
            case 'remove_element':
                return await this.removeArrayElement(args.uuid, args.path, args.index);
            default:
                return { success: false, error: `Unknown array management action: ${action}` };
        }
    }

    // Implementation methods
    private async createNode(args: any): Promise<ToolResponse> {
        try {
            let targetParentUuid = args.parentUuid;

            // If no parent UUID provided, get scene root
            if (!targetParentUuid) {
                try {
                    const sceneInfo = await Editor.Message.request('scene', 'query-node-tree');
                    if (sceneInfo && typeof sceneInfo === 'object' && !Array.isArray(sceneInfo) && Object.prototype.hasOwnProperty.call(sceneInfo, 'uuid')) {
                        targetParentUuid = (sceneInfo as any).uuid;
                        console.log(`No parent specified, using scene root: ${targetParentUuid}`);
                    } else if (Array.isArray(sceneInfo) && sceneInfo.length > 0 && sceneInfo[0].uuid) {
                        targetParentUuid = sceneInfo[0].uuid;
                        console.log(`No parent specified, using scene root: ${targetParentUuid}`);
                    } else {
                        const currentScene = await Editor.Message.request('scene', 'query-current-scene');
                        if (currentScene && currentScene.uuid) {
                            targetParentUuid = currentScene.uuid;
                        }
                    }
                } catch (err) {
                    console.warn('Failed to get scene root, will use default behavior');
                }
            }

            // Resolve asset path to UUID if provided
            let finalAssetUuid = args.assetUuid;
            if (args.assetPath && !finalAssetUuid) {
                try {
                    const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', args.assetPath);
                    if (assetInfo && assetInfo.uuid) {
                        finalAssetUuid = assetInfo.uuid;
                        console.log(`Asset path '${args.assetPath}' resolved to UUID: ${finalAssetUuid}`);
                    } else {
                        return {
                            success: false,
                            error: `Asset not found at path: ${args.assetPath}`
                        };
                    }
                } catch (err) {
                    return {
                        success: false,
                        error: `Failed to resolve asset path '${args.assetPath}': ${err}`
                    };
                }
            }

            // Build create-node options
            const createNodeOptions: any = {
                name: args.name
            };

            if (targetParentUuid) {
                createNodeOptions.parent = targetParentUuid;
            }

            if (finalAssetUuid) {
                createNodeOptions.assetUuid = finalAssetUuid;
                if (args.unlinkPrefab) {
                    createNodeOptions.unlinkPrefab = true;
                }
            }

            if (args.components && args.components.length > 0) {
                createNodeOptions.components = args.components;
            } else if (args.nodeType && args.nodeType !== 'Node' && !finalAssetUuid) {
                createNodeOptions.components = [args.nodeType];
            }

            if (args.keepWorldTransform) {
                createNodeOptions.keepWorldTransform = true;
            }

            console.log('Creating node with options:', createNodeOptions);

            // Create node
            const nodeUuid = await Editor.Message.request('scene', 'create-node', createNodeOptions);
            const uuid = Array.isArray(nodeUuid) ? nodeUuid[0] : nodeUuid;

            // Handle sibling index
            if (args.siblingIndex !== undefined && args.siblingIndex >= 0 && uuid && targetParentUuid) {
                try {
                    await new Promise(r => setTimeout(r, 100));
                    await Editor.Message.request('scene', 'set-parent', {
                        parent: targetParentUuid,
                        uuids: [uuid],
                        keepWorldTransform: args.keepWorldTransform || false
                    });
                } catch (err) {
                    console.warn('Failed to set sibling index:', err);
                }
            }

            // Add components if provided
            if (args.components && args.components.length > 0 && uuid) {
                try {
                    await new Promise(r => setTimeout(r, 100));
                    for (const componentType of args.components) {
                        try {
                            const result = await this.componentTools.execute('add_component', {
                                nodeUuid: uuid,
                                componentType: componentType
                            });
                            if (result.success) {
                                console.log(`Component ${componentType} added successfully`);
                            } else {
                                console.warn(`Failed to add component ${componentType}:`, result.error);
                            }
                        } catch (err) {
                            console.warn(`Failed to add component ${componentType}:`, err);
                        }
                    }
                } catch (err) {
                    console.warn('Failed to add components:', err);
                }
            }

            // Set initial transform if provided
            if (args.initialTransform && uuid) {
                try {
                    await new Promise(r => setTimeout(r, 150));
                    await this.setNodeTransform({
                        uuid: uuid,
                        position: args.initialTransform.position,
                        rotation: args.initialTransform.rotation,
                        scale: args.initialTransform.scale
                    });
                    console.log('Initial transform applied successfully');
                } catch (err) {
                    console.warn('Failed to set initial transform:', err);
                }
            }

            // Get created node info for verification
            let verificationData: any = null;
            try {
                const nodeInfo = await this.getNodeInfo(uuid);
                if (nodeInfo.success) {
                    verificationData = {
                        nodeInfo: nodeInfo.data,
                        creationDetails: {
                            parentUuid: targetParentUuid,
                            nodeType: args.nodeType || 'Node',
                            fromAsset: !!finalAssetUuid,
                            assetUuid: finalAssetUuid,
                            assetPath: args.assetPath,
                            timestamp: new Date().toISOString()
                        }
                    };
                }
            } catch (err) {
                console.warn('Failed to get verification data:', err);
            }

            const successMessage = finalAssetUuid
                ? `Node '${args.name}' instantiated from asset successfully`
                : `Node '${args.name}' created successfully`;

            return {
                success: true,
                data: {
                    uuid: uuid,
                    name: args.name,
                    parentUuid: targetParentUuid,
                    nodeType: args.nodeType || 'Node',
                    fromAsset: !!finalAssetUuid,
                    assetUuid: finalAssetUuid,
                    message: successMessage
                },
                verificationData: verificationData
            };

        } catch (err: any) {
            return {
                success: false,
                error: `Failed to create node: ${err.message}. Args: ${JSON.stringify(args)}`
            };
        }
    }

    private async getNodeInfo(uuid: string): Promise<ToolResponse> {
        try {
            const nodeData = await Editor.Message.request('scene', 'query-node', uuid);
            if (!nodeData) {
                return {
                    success: false,
                    error: 'Node not found or invalid response'
                };
            }

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
            return { success: true, data: info };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async findNodes(pattern: string, exactMatch: boolean = false): Promise<ToolResponse> {
        try {
            const tree = await Editor.Message.request('scene', 'query-node-tree');
            const nodes: any[] = [];

            const searchTree = (node: any, currentPath: string = '') => {
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

            return { success: true, data: nodes };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async findNodeByName(name: string): Promise<ToolResponse> {
        try {
            const tree = await Editor.Message.request('scene', 'query-node-tree');
            const foundNode = this.searchNodeInTree(tree, name);
            if (foundNode) {
                return {
                    success: true,
                    data: {
                        uuid: foundNode.uuid,
                        name: foundNode.name,
                        path: this.getNodePath(foundNode)
                    }
                };
            } else {
                return { success: false, error: `Node '${name}' not found` };
            }
        } catch (err: any) {
            return { success: false, error: err.message };
        }
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
        try {
            const tree = await Editor.Message.request('scene', 'query-node-tree');
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

            return {
                success: true,
                data: {
                    totalNodes: nodes.length,
                    nodes: nodes
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
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

    private async setNodeProperties(uuid: string, args: any): Promise<ToolResponse> {
        const { name, active, layer, mobility, position, rotation, scale, customProperties } = args;
        const updatePromises: Promise<any>[] = [];
        const updates: string[] = [];
        const warnings: string[] = [];

        try {
            // Get node info to determine 2D/3D
            let is2DNode = false;
            let nodeInfo: any = null;

            if (position || rotation || scale) {
                const nodeInfoResponse = await this.getNodeInfo(uuid);
                if (!nodeInfoResponse.success || !nodeInfoResponse.data) {
                    return { success: false, error: 'Failed to get node information' };
                }
                nodeInfo = nodeInfoResponse.data;
                is2DNode = this.is2DNode(nodeInfo);
            }

            // Handle general properties
            if (name !== undefined) {
                updatePromises.push(
                    Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'name',
                        dump: { value: name }
                    })
                );
                updates.push('name');
            }

            if (active !== undefined) {
                updatePromises.push(
                    Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'active',
                        dump: { value: active }
                    })
                );
                updates.push('active');
            }

            if (layer !== undefined) {
                updatePromises.push(
                    Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'layer',
                        dump: { value: layer }
                    })
                );
                updates.push('layer');
            }

            if (mobility !== undefined) {
                updatePromises.push(
                    Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'mobility',
                        dump: { value: mobility }
                    })
                );
                updates.push('mobility');
            }

            // Handle transform properties
            if (position) {
                const normalizedPosition = this.normalizeTransformValue(position, 'position', is2DNode);
                if (normalizedPosition.warning) {
                    warnings.push(normalizedPosition.warning);
                }

                updatePromises.push(
                    Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'position',
                        dump: { value: normalizedPosition.value }
                    })
                );
                updates.push('position');
            }

            if (rotation) {
                const normalizedRotation = this.normalizeTransformValue(rotation, 'rotation', is2DNode);
                if (normalizedRotation.warning) {
                    warnings.push(normalizedRotation.warning);
                }

                updatePromises.push(
                    Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'rotation',
                        dump: { value: normalizedRotation.value }
                    })
                );
                updates.push('rotation');
            }

            if (scale) {
                const normalizedScale = this.normalizeTransformValue(scale, 'scale', is2DNode);
                if (normalizedScale.warning) {
                    warnings.push(normalizedScale.warning);
                }

                updatePromises.push(
                    Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'scale',
                        dump: { value: normalizedScale.value }
                    })
                );
                updates.push('scale');
            }

            // Handle custom properties
            if (customProperties && typeof customProperties === 'object') {
                for (const [property, value] of Object.entries(customProperties)) {
                    updatePromises.push(
                        Editor.Message.request('scene', 'set-property', {
                            uuid: uuid,
                            path: property,
                            dump: { value: value as any }
                        })
                    );
                    updates.push(property);
                }
            }

            if (updatePromises.length === 0) {
                return {
                    success: false,
                    error: 'No properties provided to update'
                };
            }

            // Execute all updates
            await Promise.all(updatePromises);

            // Get updated node info for verification
            const updatedNodeInfo = await this.getNodeInfo(uuid);

            return {
                success: true,
                message: `✅ Updated ${updates.length} properties`,
                data: {
                    nodeUuid: uuid,
                    updatedProperties: updates,
                    warnings: warnings.length > 0 ? warnings : undefined
                }
            };

        } catch (err: any) {
            return {
                success: false,
                error: `Failed to set node properties: ${err.message}`
            };
        }
    }

    private async setNodeTransform(args: any): Promise<ToolResponse> {
        const { uuid, position, rotation, scale } = args;
        const updatePromises: Promise<any>[] = [];
        const updates: string[] = [];
        const warnings: string[] = [];

        try {
            // Get node info to determine 2D/3D
            const nodeInfoResponse = await this.getNodeInfo(uuid);
            if (!nodeInfoResponse.success || !nodeInfoResponse.data) {
                return { success: false, error: 'Failed to get node information' };
            }

            const nodeInfo = nodeInfoResponse.data;
            const is2DNode = this.is2DNode(nodeInfo);

            if (position) {
                const normalizedPosition = this.normalizeTransformValue(position, 'position', is2DNode);
                if (normalizedPosition.warning) {
                    warnings.push(normalizedPosition.warning);
                }

                updatePromises.push(
                    Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'position',
                        dump: { value: normalizedPosition.value }
                    })
                );
                updates.push('position');
            }

            if (rotation) {
                const normalizedRotation = this.normalizeTransformValue(rotation, 'rotation', is2DNode);
                if (normalizedRotation.warning) {
                    warnings.push(normalizedRotation.warning);
                }

                updatePromises.push(
                    Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'rotation',
                        dump: { value: normalizedRotation.value }
                    })
                );
                updates.push('rotation');
            }

            if (scale) {
                const normalizedScale = this.normalizeTransformValue(scale, 'scale', is2DNode);
                if (normalizedScale.warning) {
                    warnings.push(normalizedScale.warning);
                }

                updatePromises.push(
                    Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'scale',
                        dump: { value: normalizedScale.value }
                    })
                );
                updates.push('scale');
            }

            if (updatePromises.length === 0) {
                return { success: false, error: 'No transform properties specified' };
            }

            await Promise.all(updatePromises);

            const response: any = {
                success: true,
                message: `✅ Transform updated: ${updates.join(', ')} ${is2DNode ? '(2D)' : '(3D)'}`,
                data: {
                    nodeUuid: uuid,
                    nodeType: is2DNode ? '2D' : '3D',
                    appliedChanges: updates
                }
            };

            if (warnings.length > 0) {
                response.warning = warnings.join('; ');
            }

            return response;

        } catch (err: any) {
            return {
                success: false,
                error: `Failed to update transform: ${err.message}`
            };
        }
    }

    private is2DNode(nodeInfo: any): boolean {
        const components = nodeInfo.components || [];
        
        // Check for 2D components
        const has2DComponents = components.some((comp: any) => 
            comp.type && (
                comp.type.includes('cc.Sprite') ||
                comp.type.includes('cc.Label') ||
                comp.type.includes('cc.Button') ||
                comp.type.includes('cc.Layout') ||
                comp.type.includes('cc.Widget') ||
                comp.type.includes('cc.Mask') ||
                comp.type.includes('cc.Graphics')
            )
        );
        
        if (has2DComponents) {
            return true;
        }
        
        // Check for 3D components  
        const has3DComponents = components.some((comp: any) =>
            comp.type && (
                comp.type.includes('cc.MeshRenderer') ||
                comp.type.includes('cc.Camera') ||
                comp.type.includes('cc.Light') ||
                comp.type.includes('cc.DirectionalLight') ||
                comp.type.includes('cc.PointLight') ||
                comp.type.includes('cc.SpotLight')
            )
        );
        
        if (has3DComponents) {
            return false;
        }
        
        // Default heuristic
        const position = nodeInfo.position;
        if (position && Math.abs(position.z) < 0.001) {
            return true;
        }
        
        return false;
    }

    private normalizeTransformValue(value: any, type: 'position' | 'rotation' | 'scale', is2D: boolean): { value: any, warning?: string } {
        const result = { ...value };
        let warning: string | undefined;
        
        if (is2D) {
            switch (type) {
                case 'position':
                    if (value.z !== undefined && Math.abs(value.z) > 0.001) {
                        warning = `2D node: z position (${value.z}) ignored, set to 0`;
                        result.z = 0;
                    } else if (value.z === undefined) {
                        result.z = 0;
                    }
                    break;
                    
                case 'rotation':
                    if ((value.x !== undefined && Math.abs(value.x) > 0.001) || 
                        (value.y !== undefined && Math.abs(value.y) > 0.001)) {
                        warning = `2D node: x,y rotations ignored, only z rotation applied`;
                        result.x = 0;
                        result.y = 0;
                    } else {
                        result.x = result.x || 0;
                        result.y = result.y || 0;
                    }
                    result.z = result.z || 0;
                    break;
                    
                case 'scale':
                    if (value.z === undefined) {
                        result.z = 1;
                    }
                    break;
            }
        } else {
            // 3D node
            result.x = result.x !== undefined ? result.x : (type === 'scale' ? 1 : 0);
            result.y = result.y !== undefined ? result.y : (type === 'scale' ? 1 : 0);
            result.z = result.z !== undefined ? result.z : (type === 'scale' ? 1 : 0);
        }
        
        return { value: result, warning };
    }

    private async deleteNode(uuid: string): Promise<ToolResponse> {
        try {
            await Editor.Message.request('scene', 'remove-node', { uuid: uuid });
            return {
                success: true,
                message: '✅ Node deleted'
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async moveNode(nodeUuid: string, newParentUuid: string, siblingIndex: number = -1): Promise<ToolResponse> {
        try {
            await Editor.Message.request('scene', 'set-parent', {
                parent: newParentUuid,
                uuids: [nodeUuid],
                keepWorldTransform: false
            });
            return {
                success: true,
                message: '✅ Node moved'
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async duplicateNode(uuid: string, includeChildren: boolean = true): Promise<ToolResponse> {
        try {
            const result = await Editor.Message.request('scene', 'duplicate-node', uuid);
            return {
                success: true,
                data: {
                    newUuid: result.uuid,
                    message: '✅ Node duplicated'
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async detectNodeType(uuid: string): Promise<ToolResponse> {
        try {
            const nodeInfoResponse = await this.getNodeInfo(uuid);
            if (!nodeInfoResponse.success || !nodeInfoResponse.data) {
                return { success: false, error: 'Failed to get node information' };
            }

            const nodeInfo = nodeInfoResponse.data;
            const is2D = this.is2DNode(nodeInfo);
            const components = nodeInfo.components || [];

            const detectionReasons: string[] = [];

            // Check for 2D components
            const twoDComponents = components.filter((comp: any) =>
                comp.type && (
                    comp.type.includes('cc.Sprite') ||
                    comp.type.includes('cc.Label') ||
                    comp.type.includes('cc.Button') ||
                    comp.type.includes('cc.Layout') ||
                    comp.type.includes('cc.Widget') ||
                    comp.type.includes('cc.Mask') ||
                    comp.type.includes('cc.Graphics')
                )
            );

            // Check for 3D components
            const threeDComponents = components.filter((comp: any) =>
                comp.type && (
                    comp.type.includes('cc.MeshRenderer') ||
                    comp.type.includes('cc.Camera') ||
                    comp.type.includes('cc.Light') ||
                    comp.type.includes('cc.DirectionalLight') ||
                    comp.type.includes('cc.PointLight') ||
                    comp.type.includes('cc.SpotLight')
                )
            );

            if (twoDComponents.length > 0) {
                detectionReasons.push(`Has 2D components: ${twoDComponents.map((c: any) => c.type).join(', ')}`);
            }

            if (threeDComponents.length > 0) {
                detectionReasons.push(`Has 3D components: ${threeDComponents.map((c: any) => c.type).join(', ')}`);
            }

            const position = nodeInfo.position;
            if (position && Math.abs(position.z) < 0.001) {
                detectionReasons.push('Z position is ~0 (likely 2D)');
            } else if (position && Math.abs(position.z) > 0.001) {
                detectionReasons.push(`Z position is ${position.z} (likely 3D)`);
            }

            if (detectionReasons.length === 0) {
                detectionReasons.push('No specific indicators found, defaulting based on heuristics');
            }

            return {
                success: true,
                data: {
                    nodeUuid: uuid,
                    nodeName: nodeInfo.name,
                    nodeType: is2D ? '2D' : '3D',
                    detectionReasons: detectionReasons,
                    components: components.map((comp: any) => ({
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
            };

        } catch (err: any) {
            return {
                success: false,
                error: `Failed to detect node type: ${err.message}`
            };
        }
    }

    private getComponentCategory(componentType: string): string {
        if (!componentType) return 'unknown';
        
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

    private async getNodeTree(rootUuid?: string, maxDepth: number = 10): Promise<ToolResponse> {
        try {
            // 使用官方的 query-node-tree API
            const nodeTree = await Editor.Message.request('scene', 'query-node-tree', rootUuid);
            
            // 递归处理节点树，限制深度
            const processNode = (node: any, currentDepth: number = 0): any => {
                if (currentDepth >= maxDepth) {
                    return {
                        uuid: node.uuid,
                        name: node.name,
                        active: node.active,
                        type: node.type,
                        children: node.children ? [`... ${node.children.length} children (max depth reached)`] : [],
                        truncated: true,
                        childCount: node.children ? node.children.length : 0
                    };
                }

                const processedNode = {
                    uuid: node.uuid,
                    name: node.name,
                    active: node.active,
                    type: node.type,
                    isScene: node.isScene || false,
                    prefab: node.prefab || 0,
                    components: node.components ? node.components.map((comp: any) => ({
                        type: comp.type,
                        value: comp.value,
                        extends: comp.extends || []
                    })) : [],
                    childCount: node.children ? node.children.length : 0,
                    children: [] as any[]
                };

                if (node.children && node.children.length > 0) {
                    processedNode.children = node.children.map((child: any) => 
                        processNode(child, currentDepth + 1)
                    );
                }

                return processedNode;
            };

            const processedTree = processNode(nodeTree, 0);
            
            return {
                success: true,
                message: `✅ Node tree retrieved (root: ${nodeTree.name || 'scene'})`,
                data: {
                    tree: processedTree,
                    rootUuid: rootUuid || 'scene',
                    maxDepth: maxDepth,
                    nodeCount: this.countTreeNodes(processedTree)
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Failed to get node tree: ${error.message}`
            };
        }
    }

    private countTreeNodes(node: any): number {
        let count = 1; // 当前节点
        if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
                if (typeof child === 'object' && !child.truncated) {
                    count += this.countTreeNodes(child);
                }
            }
        }
        return count;
    }

    // New methods from scene-advanced-tools.ts
    private async copyNode(uuids: string | string[]): Promise<ToolResponse> {
        // Validate parameters
        if (!uuids) {
            return {
                success: false,
                error: 'Node UUID(s) are required'
            };
        }

        const nodeUuids = Array.isArray(uuids) ? uuids : [uuids];

        // Validate each UUID
        for (const uuid of nodeUuids) {
            if (!uuid || typeof uuid !== 'string' || uuid.trim().length === 0) {
                return {
                    success: false,
                    error: 'All UUIDs must be non-empty strings'
                };
            }
        }

        const trimmedUuids = nodeUuids.map(uuid => uuid.trim());
        const inputUuids = Array.isArray(uuids) ? trimmedUuids : trimmedUuids[0];

        try {
            const result: string | string[] = await Editor.Message.request('scene', 'copy-node', inputUuids);
            return {
                success: true,
                message: `✅ ${Array.isArray(result) ? result.length : 1} node(s) copied to clipboard`,
                data: {
                    originalUuids: trimmedUuids,
                    copiedUuids: result,
                    action: 'copy',
                    nodeCount: Array.isArray(result) ? result.length : 1
                }
            };
        } catch (err: any) {
            return {
                success: false,
                error: `Failed to copy node(s): ${err.message}`
            };
        }
    }

    private async pasteNode(target: string, uuids: string | string[], keepWorldTransform: boolean = false): Promise<ToolResponse> {
        // Validate parameters
        if (!target || typeof target !== 'string' || target.trim().length === 0) {
            return {
                success: false,
                error: 'Target parent UUID is required and must be a non-empty string'
            };
        }

        if (!uuids) {
            return {
                success: false,
                error: 'Node UUID(s) to paste are required'
            };
        }

        const nodeUuids = Array.isArray(uuids) ? uuids : [uuids];

        // Validate each UUID
        for (const uuid of nodeUuids) {
            if (!uuid || typeof uuid !== 'string' || uuid.trim().length === 0) {
                return {
                    success: false,
                    error: 'All UUIDs must be non-empty strings'
                };
            }
        }

        const trimmedTarget = target.trim();
        const trimmedUuids = nodeUuids.map(uuid => uuid.trim());
        const inputUuids = Array.isArray(uuids) ? trimmedUuids : trimmedUuids[0];

        try {
            const result: string | string[] = await Editor.Message.request('scene', 'paste-node', {
                target: trimmedTarget,
                uuids: inputUuids,
                keepWorldTransform
            });
            return {
                success: true,
                message: `✅ ${Array.isArray(result) ? result.length : 1} node(s) pasted successfully`,
                data: {
                    targetParent: trimmedTarget,
                    originalUuids: trimmedUuids,
                    newUuids: result,
                    keepWorldTransform,
                    action: 'paste',
                    nodeCount: Array.isArray(result) ? result.length : 1
                }
            };
        } catch (err: any) {
            return {
                success: false,
                error: `Failed to paste node(s): ${err.message}`
            };
        }
    }

    private async cutNode(uuids: string | string[]): Promise<ToolResponse> {
        // Validate parameters
        if (!uuids) {
            return {
                success: false,
                error: 'Node UUID(s) are required'
            };
        }

        const nodeUuids = Array.isArray(uuids) ? uuids : [uuids];

        // Validate each UUID
        for (const uuid of nodeUuids) {
            if (!uuid || typeof uuid !== 'string' || uuid.trim().length === 0) {
                return {
                    success: false,
                    error: 'All UUIDs must be non-empty strings'
                };
            }
        }

        const trimmedUuids = nodeUuids.map(uuid => uuid.trim());
        const inputUuids = Array.isArray(uuids) ? trimmedUuids : trimmedUuids[0];

        try {
            const result = await Editor.Message.request('scene', 'cut-node', inputUuids);
            return {
                success: true,
                message: `✅ ${Array.isArray(result) ? result.length : 1} node(s) cut to clipboard`,
                data: {
                    originalUuids: trimmedUuids,
                    cutUuids: result,
                    action: 'cut',
                    nodeCount: Array.isArray(result) ? result.length : 1,
                    note: 'Nodes are copied to clipboard and marked for move operation'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                error: `Failed to cut node(s): ${err.message}`
            };
        }
    }

    private async resetNodeProperty(uuid: string, path: string): Promise<ToolResponse> {
        // Validate parameters
        if (!uuid || typeof uuid !== 'string' || uuid.trim().length === 0) {
            return {
                success: false,
                error: 'Node UUID is required and must be a non-empty string'
            };
        }

        if (!path || typeof path !== 'string' || path.trim().length === 0) {
            return {
                success: false,
                error: 'Property path is required and must be a non-empty string'
            };
        }

        const trimmedUuid = uuid.trim();
        const trimmedPath = path.trim();

        try {
            await Editor.Message.request('scene', 'reset-property', {
                uuid: trimmedUuid,
                path: trimmedPath,
                dump: { value: null }
            });
            return {
                success: true,
                message: `✅ Property '${trimmedPath}' reset to default value`,
                data: {
                    uuid: trimmedUuid,
                    path: trimmedPath,
                    action: 'reset_property'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                error: `Failed to reset property '${trimmedPath}': ${err.message}`
            };
        }
    }

    private async resetNodeTransform(uuid: string): Promise<ToolResponse> {
        if (!uuid || typeof uuid !== 'string' || uuid.trim().length === 0) {
            return {
                success: false,
                error: 'Node UUID is required and must be a non-empty string'
            };
        }

        const trimmedUuid = uuid.trim();

        try {
            await Editor.Message.request('scene', 'reset-node', { uuid: trimmedUuid });
            return {
                success: true,
                message: '✅ Node transform reset to default values',
                data: {
                    uuid: trimmedUuid,
                    action: 'reset_transform',
                    resetProperties: ['position', 'rotation', 'scale']
                }
            };
        } catch (err: any) {
            return {
                success: false,
                error: `Failed to reset node transform: ${err.message}`
            };
        }
    }

    private async resetComponent(uuid: string): Promise<ToolResponse> {
        if (!uuid || typeof uuid !== 'string' || uuid.trim().length === 0) {
            return {
                success: false,
                error: 'Component UUID is required and must be a non-empty string'
            };
        }

        const trimmedUuid = uuid.trim();

        try {
            await Editor.Message.request('scene', 'reset-component', { uuid: trimmedUuid });
            return {
                success: true,
                message: '✅ Component reset to default values',
                data: {
                    uuid: trimmedUuid,
                    action: 'reset_component'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                error: `Failed to reset component: ${err.message}`
            };
        }
    }

    private async moveArrayElement(uuid: string, path: string, target: number, offset: number): Promise<ToolResponse> {
        // Validate parameters
        if (!uuid || typeof uuid !== 'string' || uuid.trim().length === 0) {
            return {
                success: false,
                error: 'Node UUID is required and must be a non-empty string'
            };
        }

        if (!path || typeof path !== 'string' || path.trim().length === 0) {
            return {
                success: false,
                error: 'Array path is required and must be a non-empty string'
            };
        }

        if (typeof target !== 'number' || target < 0 || !Number.isInteger(target)) {
            return {
                success: false,
                error: 'Target index must be a non-negative integer'
            };
        }

        if (typeof offset !== 'number' || !Number.isInteger(offset) || offset === 0) {
            return {
                success: false,
                error: 'Offset must be a non-zero integer'
            };
        }

        const trimmedUuid = uuid.trim();
        const trimmedPath = path.trim();

        try {
            await Editor.Message.request('scene', 'move-array-element', {
                uuid: trimmedUuid,
                path: trimmedPath,
                target,
                offset
            });
            return {
                success: true,
                message: `✅ Array element moved from index ${target} by ${offset} positions`,
                data: {
                    uuid: trimmedUuid,
                    path: trimmedPath,
                    target,
                    offset,
                    newIndex: target + offset,
                    action: 'move_element'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                error: `Failed to move array element: ${err.message}`
            };
        }
    }

    private async removeArrayElement(uuid: string, path: string, index: number): Promise<ToolResponse> {
        // Validate parameters
        if (!uuid || typeof uuid !== 'string' || uuid.trim().length === 0) {
            return {
                success: false,
                error: 'Node UUID is required and must be a non-empty string'
            };
        }

        if (!path || typeof path !== 'string' || path.trim().length === 0) {
            return {
                success: false,
                error: 'Array path is required and must be a non-empty string'
            };
        }

        if (typeof index !== 'number' || index < 0 || !Number.isInteger(index)) {
            return {
                success: false,
                error: 'Index must be a non-negative integer'
            };
        }

        const trimmedUuid = uuid.trim();
        const trimmedPath = path.trim();

        try {
            await Editor.Message.request('scene', 'remove-array-element', {
                uuid: trimmedUuid,
                path: trimmedPath,
                index
            });
            return {
                success: true,
                message: `✅ Array element at index ${index} removed successfully`,
                data: {
                    uuid: trimmedUuid,
                    path: trimmedPath,
                    index,
                    action: 'remove_element'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                error: `Failed to remove array element at index ${index}: ${err.message}`
            };
        }
    }

    // New script management handler
    private async handleNodeScriptManagement(args: any): Promise<ToolResponse> {
        const { action, nodeUuid, scriptPath, scriptCid } = args;
        
        switch (action) {
            case 'attach':
                if (!scriptPath) {
                    return { success: false, error: 'scriptPath required for attach action' };
                }
                return await this.attachScriptToNode(nodeUuid, scriptPath);
            case 'remove':
                if (!scriptCid) {
                    return { success: false, error: 'scriptCid required for remove action' };
                }
                return await this.removeScriptFromNode(nodeUuid, scriptCid);
            default:
                return { success: false, error: `Unknown script management action: ${action}` };
        }
    }

    // Script attachment implementation (copied and adapted from component-tools)
    private async attachScriptToNode(nodeUuid: string, scriptPath: string): Promise<ToolResponse> {
        try {
            // Extract script component name from path
            const scriptName = scriptPath.split('/').pop()?.replace('.ts', '').replace('.js', '');
            if (!scriptName) {
                return { success: false, error: 'Invalid script path: unable to extract script name' };
            }

            // Check if script already exists on node using ComponentTools
            const allComponentsInfo = await this.componentTools.execute('component_query', {
                action: 'list',
                nodeUuid: nodeUuid
            });

            if (allComponentsInfo.success && allComponentsInfo.data?.components) {
                // First, get the script UUID to compare with component __scriptAsset
                let scriptUuid: string | null = null;
                try {
                    scriptUuid = await Editor.Message.request('asset-db', 'query-uuid', scriptPath);
                    console.log(`[DEBUG] Script UUID for duplicate check: ${scriptUuid}`);
                } catch (e) {
                    console.log(`[DEBUG] Could not get script UUID for duplicate check: ${e}`);
                }

                // Look for existing script in multiple ways:
                // 1. By script class name (exact match)
                // 2. By checking if component has __scriptAsset UUID pointing to our script
                // 3. By checking non-cc.* components that might be our script
                const existingScript = allComponentsInfo.data.components.find((comp: any) => {
                    console.log(`[DEBUG] Checking component type: ${comp.type}`);

                    // Method 1: Direct name match
                    if (comp.type === scriptName) {
                        console.log(`[DEBUG] Found exact script name match: ${comp.type}`);
                        return true;
                    }

                    // Method 2: Check __scriptAsset UUID if available
                    if (comp.properties && comp.properties.__scriptAsset && comp.properties.__scriptAsset.value) {
                        const scriptAssetUuid = comp.properties.__scriptAsset.value.uuid;
                        console.log(`[DEBUG] Checking __scriptAsset UUID: ${scriptAssetUuid} vs ${scriptUuid}`);
                        if (scriptAssetUuid === scriptUuid) {
                            console.log(`[DEBUG] Found script by __scriptAsset UUID match!`);
                            return true;
                        }
                    }

                    // Method 3: Check by component name containing our script name
                    if (comp.properties && comp.properties.name && comp.properties.name.value) {
                        const componentName = comp.properties.name.value;
                        console.log(`[DEBUG] Checking component name: ${componentName}`);
                        if (componentName.includes(`<${scriptName}>`)) {
                            console.log(`[DEBUG] Found script by component name match: ${componentName}`);
                            return true;
                        }
                    }

                    return false;
                });

                if (existingScript) {
                    console.log(`[DEBUG] Script already exists, component details:`, existingScript);
                    return {
                        success: true,
                        message: `✅ Script '${scriptName}' already exists on node`,
                        data: {
                            nodeUuid: nodeUuid,
                            scriptName: scriptName,
                            scriptPath: scriptPath,
                            alreadyExists: true,
                            componentId: existingScript.cid,
                            componentType: existingScript.type
                        }
                    };
                }
            }

            // The create-component API expects the script class name (from @ccclass), not file UUID
            // We use the extracted scriptName which matches the @ccclass name
            try {
                console.log(`[DEBUG] Attempting to create component with nodeUuid: ${nodeUuid}, scriptName: ${scriptName}`);
                const createResult = await Editor.Message.request('scene', 'create-component', {
                    uuid: nodeUuid,
                    component: scriptName
                });
                console.log(`[DEBUG] Create component result:`, createResult);
            } catch (createError) {
                console.error(`[DEBUG] Create component failed:`, createError);
                return { success: false, error: `Failed to create component: ${createError}` };
            }

            // Wait for editor to complete component addition
            await new Promise(r => setTimeout(r, 100));

            // Verify script was attached successfully
            const verifyComponentsInfo = await this.componentTools.execute('component_query', {
                action: 'list',
                nodeUuid: nodeUuid
            });

            if (verifyComponentsInfo.success && verifyComponentsInfo.data?.components) {
                // Check for script component by looking for any component that's not a built-in cc.* type
                // or specifically matches our script name
                const beforeComponents = allComponentsInfo.data?.components?.map((c: any) => c.type) || [];
                const afterComponents = verifyComponentsInfo.data.components.map((c: any) => c.type);
                const newComponents = afterComponents.filter((type: string) => !beforeComponents.includes(type));

                console.log(`[DEBUG] Components before: ${beforeComponents.join(', ')}`);
                console.log(`[DEBUG] Components after: ${afterComponents.join(', ')}`);
                console.log(`[DEBUG] New components: ${newComponents.join(', ')}`);

                // Look for the script either by name match or as a new non-cc.* component
                const addedScript = verifyComponentsInfo.data.components.find((comp: any) =>
                    comp.type === scriptName ||
                    (newComponents.includes(comp.type) && !comp.type.startsWith('cc.'))
                );

                if (addedScript || newComponents.length > 0) {
                    const finalScript = addedScript || verifyComponentsInfo.data.components.find((comp: any) => newComponents.includes(comp.type));
                    return {
                        success: true,
                        message: `✅ Script '${scriptName}' attached successfully to node`,
                        data: {
                            nodeUuid: nodeUuid,
                            scriptName: scriptName,
                            scriptPath: scriptPath,
                            alreadyExists: false,
                            componentId: finalScript.cid,
                            componentType: finalScript.type
                        }
                    };
                } else {
                    return {
                        success: false,
                        error: `Script '${scriptName}' was not found on node after attachment attempt. Available components: ${afterComponents.join(', ')}`
                    };
                }
            } else {
                return {
                    success: false,
                    error: `Failed to verify script attachment: ${verifyComponentsInfo.error || 'Unable to query node components'}`
                };
            }

        } catch (err: any) {
            // Fallback: try using scene script execution
            try {
                const sceneScriptOptions = {
                    name: 'cocos-mcp-server',
                    method: 'attachScript',
                    args: [nodeUuid, scriptPath]
                };
                const sceneResult = await Editor.Message.request('scene', 'execute-scene-script', sceneScriptOptions);
                return sceneResult;
            } catch (sceneErr) {
                return {
                    success: false,
                    error: `Failed to attach script '${scriptPath.split('/').pop()}': ${err.message}. Please ensure the script is properly compiled and exported as a Component class. You can also manually attach the script through the Properties panel in the editor.`
                };
            }
        }
    }

    // Script removal implementation
    private async removeScriptFromNode(nodeUuid: string, scriptCid: string): Promise<ToolResponse> {
        try {
            // Use ComponentTools to remove the script component
            const removeResult = await this.componentTools.execute('component_manage', {
                action: 'remove',
                nodeUuid: nodeUuid,
                componentType: scriptCid
            });

            if (removeResult.success) {
                return {
                    success: true,
                    message: `✅ Script component removed successfully from node`,
                    data: {
                        nodeUuid: nodeUuid,
                        removedComponentId: scriptCid
                    }
                };
            } else {
                return {
                    success: false,
                    error: `Failed to remove script component: ${removeResult.error}`
                };
            }

        } catch (err: any) {
            return {
                success: false,
                error: `Error removing script component: ${err.message}`
            };
        }
    }
}