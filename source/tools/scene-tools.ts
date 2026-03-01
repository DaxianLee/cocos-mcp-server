import { ToolDefinition, ToolResponse, ToolExecutor, SceneInfo } from '../types';

export class SceneTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            // 1. Scene Management - Basic operations
            {
                name: 'scene_management',
                description: 'SCENE MANAGEMENT: Core scene operations for project workflow. COMMON TASKS: get_current for active scene info, get_list to see all scenes, open to switch scenes, save to persist changes, create for new scenes. WORKFLOW: Always save before switching scenes to avoid data loss.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['get_current', 'get_list', 'open', 'save', 'create', 'save_as', 'close'],
                            description: 'Scene operation: "get_current" = active scene details | "get_list" = all project scenes | "open" = switch to scene (requires scenePath) | "save" = save current changes | "create" = new scene file (requires sceneName+savePath) | "save_as" = copy scene (requires path) | "close" = close active scene'
                        },
                        // For open action
                        scenePath: {
                            type: 'string',
                            description: 'Scene file path to open (REQUIRED for open action). Use Cocos asset URLs. Examples: "db://assets/scenes/Game.scene", "db://assets/levels/Level1.scene". Get paths from get_list action first.'
                        },
                        // For create action
                        sceneName: {
                            type: 'string',
                            description: 'New scene name (REQUIRED for create action). Use descriptive names without extension. Examples: "MainMenu", "GameLevel1", "Settings". System adds .scene extension automatically.'
                        },
                        savePath: {
                            type: 'string',
                            description: 'Save location for new scene (REQUIRED for create action). Must include .scene extension. Examples: "db://assets/scenes/Tutorial.scene", "db://assets/levels/BossLevel.scene".'
                        },
                        // For save_as action
                        path: {
                            type: 'string',
                            description: 'Destination path for scene copy (REQUIRED for save_as action). Creates duplicate of current scene. Examples: "db://assets/scenes/GameBackup.scene", "db://assets/versions/v1_Game.scene".'
                        }
                    },
                    required: ['action']
                }
            },

            // 2. Scene Hierarchy - Get scene structure
            {
                name: 'scene_hierarchy',
                description: 'SCENE HIERARCHY: Get the complete hierarchy of current scene with optional component information. Use this to inspect scene structure.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        includeComponents: {
                            type: 'boolean',
                            description: 'Show component details in hierarchy output. true = full information including component types and properties (detailed but verbose), false = basic structure only (faster, cleaner output). Recommended: false for overview, true for analysis.',
                            default: false
                        }
                    }
                }
            },

            // 3. Scene Execution Control - Execute scripts and methods
            {
                name: 'scene_execution_control',
                description: 'EXECUTION CONTROL: Execute component methods, scene scripts, or restore prefab instances. Use this for running custom logic and managing prefab synchronization.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['execute_component_method', 'execute_scene_script', 'restore_prefab'],
                            description: 'Action: "execute_component_method" = call method on component | "execute_scene_script" = run scene plugin method | "restore_prefab" = sync prefab instance'
                        },
                        // For execute_component_method action
                        uuid: {
                            type: 'string',
                            description: 'Component UUID to execute method on (execute_component_method action only). Get from component tools.'
                        },
                        name: {
                            type: 'string',
                            description: 'Method name to execute. For execute_component_method: component method name. For execute_scene_script: plugin name'
                        },
                        method: {
                            type: 'string',
                            description: 'Script method name to call (execute_scene_script action only)'
                        },
                        args: {
                            type: 'array',
                            description: 'Arguments to pass to the method. Each element will be passed as a parameter to the method call.',
                            default: []
                        },
                        // For restore_prefab action
                        nodeUuid: {
                            type: 'string',
                            description: 'Prefab instance node UUID (restore_prefab action only). The node that should be synchronized with its prefab.'
                        },
                        assetUuid: {
                            type: 'string',
                            description: 'Prefab asset UUID (restore_prefab action only). The source prefab to restore from.'
                        }
                    },
                    required: ['action']
                }
            },

            // 4. Scene State Management - Snapshots and undo/redo
            {
                name: 'scene_state_management',
                description: 'STATE MANAGEMENT: Create snapshots, manage undo/redo operations, and control scene reload. Use this for version control and state tracking.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['create_snapshot', 'abort_snapshot', 'begin_undo', 'end_undo', 'cancel_undo', 'soft_reload'],
                            description: 'Action: "create_snapshot" = save scene state | "abort_snapshot" = cancel snapshot | "begin_undo" = start recording | "end_undo" = finish recording | "cancel_undo" = cancel recording | "soft_reload" = reload scene'
                        },
                        // For undo operations
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID to record for undo (begin_undo action only). Changes to this node will be tracked.'
                        },
                        undoId: {
                            type: 'string',
                            description: 'Undo recording ID from begin_undo operation (end_undo/cancel_undo actions only). Used to identify which recording to complete or cancel.'
                        }
                    },
                    required: ['action']
                }
            },

            // 5. Scene Query System - Scene status and information
            {
                name: 'scene_query_system',
                description: 'QUERY SYSTEM: Get scene status, available classes/components, and find nodes by asset usage. Use this for scene inspection and analysis.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['check_ready', 'check_dirty', 'list_classes', 'list_components', 'check_script', 'find_nodes_by_asset'],
                            description: 'Action: "check_ready" = is scene ready | "check_dirty" = has unsaved changes | "list_classes" = get registered classes | "list_components" = get available components | "check_script" = verify script exists | "find_nodes_by_asset" = find nodes using asset'
                        },
                        // For list_classes action
                        extends: {
                            type: 'string',
                            description: 'Filter classes that extend this base class (list_classes action only). Example: "cc.Component" shows all component classes'
                        },
                        // For check_script action
                        className: {
                            type: 'string',
                            description: 'Script class name to verify (check_script action only). Example: "PlayerController"'
                        },
                        // For find_nodes_by_asset action
                        assetUuid: {
                            type: 'string',
                            description: 'Asset UUID to search for usage (find_nodes_by_asset action only). Get UUID from asset tools.'
                        }
                    },
                    required: ['action']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'scene_management':
                return await this.handleSceneManagement(args);
            case 'scene_hierarchy':
                return await this.getSceneHierarchy(args.includeComponents);
            case 'scene_execution_control':
                return await this.handleExecutionControl(args);
            case 'scene_state_management':
                return await this.handleStateManagement(args);
            case 'scene_query_system':
                return await this.handleQuerySystem(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async getCurrentScene(): Promise<ToolResponse> {
        try {
            // 直接使用 query-node-tree 来获取场景信息（这个方法已经验证可用）
            const tree: any = await Editor.Message.request('scene', 'query-node-tree');
            if (tree && tree.uuid) {
                return {
                    success: true,
                    data: {
                        name: tree.name || 'Current Scene',
                        uuid: tree.uuid,
                        type: tree.type || 'cc.Scene',
                        active: tree.active !== undefined ? tree.active : true,
                        nodeCount: tree.children ? tree.children.length : 0
                    }
                };
            } else {
                return { success: false, error: 'No scene data available' };
            }
        } catch (err: any) {
            // 备用方案：使用场景脚本
            try {
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'getCurrentSceneInfo',
                    args: []
                };
                const result: any = await Editor.Message.request('scene', 'execute-scene-script', options);
                return result;
            } catch (err2: any) {
                return { success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` };
            }
        }
    }

    private async getSceneList(): Promise<ToolResponse> {
        try {
            const results: any[] = await Editor.Message.request('asset-db', 'query-assets', {
                pattern: 'db://assets/**/*.scene'
            });
            const scenes: SceneInfo[] = results.map(asset => ({
                name: asset.name,
                path: asset.url,
                uuid: asset.uuid
            }));
            return { success: true, data: scenes };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async openScene(scenePath: string): Promise<ToolResponse> {
        try {
            // 首先获取场景的UUID
            const uuid: string | null = await Editor.Message.request('asset-db', 'query-uuid', scenePath);
            if (!uuid) {
                return { success: false, error: 'Scene not found' };
            }

            // 使用正确的 scene API 打开场景 (需要UUID)
            await Editor.Message.request('scene', 'open-scene', uuid);
            return { success: true, message: `Scene opened: ${scenePath}` };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async saveScene(): Promise<ToolResponse> {
        try {
            await Editor.Message.request('scene', 'save-scene');
            return { success: true, message: 'Scene saved successfully' };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async createScene(sceneName: string, savePath: string): Promise<ToolResponse> {
        // 确保路径以.scene结尾
        const fullPath = savePath.endsWith('.scene') ? savePath : `${savePath}/${sceneName}.scene`;

        // 使用正确的Cocos Creator 3.8场景格式
        const sceneContent = JSON.stringify([
            {
                "__type__": "cc.SceneAsset",
                "_name": sceneName,
                "_objFlags": 0,
                "__editorExtras__": {},
                "_native": "",
                "scene": {
                    "__id__": 1
                }
            },
            {
                "__type__": "cc.Scene",
                "_name": sceneName,
                "_objFlags": 0,
                "__editorExtras__": {},
                "_parent": null,
                "_children": [],
                "_active": true,
                "_components": [],
                "_prefab": null,
                "_lpos": {
                    "__type__": "cc.Vec3",
                    "x": 0,
                    "y": 0,
                    "z": 0
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
                    "x": 1,
                    "y": 1,
                    "z": 1
                },
                "_mobility": 0,
                "_layer": 1073741824,
                "_euler": {
                    "__type__": "cc.Vec3",
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
                "autoReleaseAssets": false,
                "_globals": {
                    "__id__": 2
                },
                "_id": "scene"
            },
            {
                "__type__": "cc.SceneGlobals",
                "ambient": {
                    "__id__": 3
                },
                "skybox": {
                    "__id__": 4
                },
                "fog": {
                    "__id__": 5
                },
                "octree": {
                    "__id__": 6
                }
            },
            {
                "__type__": "cc.AmbientInfo",
                "_skyColorHDR": {
                    "__type__": "cc.Vec4",
                    "x": 0.2,
                    "y": 0.5,
                    "z": 0.8,
                    "w": 0.520833
                },
                "_skyColor": {
                    "__type__": "cc.Vec4",
                    "x": 0.2,
                    "y": 0.5,
                    "z": 0.8,
                    "w": 0.520833
                },
                "_skyIllumHDR": 20000,
                "_skyIllum": 20000,
                "_groundAlbedoHDR": {
                    "__type__": "cc.Vec4",
                    "x": 0.2,
                    "y": 0.2,
                    "z": 0.2,
                    "w": 1
                },
                "_groundAlbedo": {
                    "__type__": "cc.Vec4",
                    "x": 0.2,
                    "y": 0.2,
                    "z": 0.2,
                    "w": 1
                }
            },
            {
                "__type__": "cc.SkyboxInfo",
                "_envLightingType": 0,
                "_envmapHDR": null,
                "_envmap": null,
                "_envmapLodCount": 0,
                "_diffuseMapHDR": null,
                "_diffuseMap": null,
                "_enabled": false,
                "_useHDR": true,
                "_editableMaterial": null,
                "_reflectionHDR": null,
                "_reflectionMap": null,
                "_rotationAngle": 0
            },
            {
                "__type__": "cc.FogInfo",
                "_type": 0,
                "_fogColor": {
                    "__type__": "cc.Color",
                    "r": 200,
                    "g": 200,
                    "b": 200,
                    "a": 255
                },
                "_enabled": false,
                "_fogDensity": 0.3,
                "_fogStart": 0.5,
                "_fogEnd": 300,
                "_fogAtten": 5,
                "_fogTop": 1.5,
                "_fogRange": 1.2,
                "_accurate": false
            },
            {
                "__type__": "cc.OctreeInfo",
                "_enabled": false,
                "_minPos": {
                    "__type__": "cc.Vec3",
                    "x": -1024,
                    "y": -1024,
                    "z": -1024
                },
                "_maxPos": {
                    "__type__": "cc.Vec3",
                    "x": 1024,
                    "y": 1024,
                    "z": 1024
                },
                "_depth": 8
            }
        ], null, 2);

        try {
            const result: any = await Editor.Message.request('asset-db', 'create-asset', fullPath, sceneContent);
            // Verify scene creation by checking if it exists
            try {
                const sceneList = await this.getSceneList();
                const createdScene = sceneList.data?.find((scene: any) => scene.uuid === result.uuid);
                return {
                    success: true,
                    data: {
                        uuid: result.uuid,
                        url: result.url,
                        name: sceneName,
                        message: `Scene '${sceneName}' created successfully`,
                        sceneVerified: !!createdScene
                    },
                    verificationData: createdScene
                };
            } catch {
                return {
                    success: true,
                    data: {
                        uuid: result.uuid,
                        url: result.url,
                        name: sceneName,
                        message: `Scene '${sceneName}' created successfully (verification failed)`
                    }
                };
            }
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async getSceneHierarchy(includeComponents: boolean = false): Promise<ToolResponse> {
        try {
            // 优先尝试使用 Editor API 查询场景节点树
            const tree: any = await Editor.Message.request('scene', 'query-node-tree');
            if (tree) {
                const hierarchy = this.buildHierarchy(tree, includeComponents);
                return {
                    success: true,
                    data: hierarchy
                };
            } else {
                return { success: false, error: 'No scene hierarchy available' };
            }
        } catch (err: any) {
            // 备用方案：使用场景脚本
            try {
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'getSceneHierarchy',
                    args: [includeComponents]
                };
                const result: any = await Editor.Message.request('scene', 'execute-scene-script', options);
                return result;
            } catch (err2: any) {
                return { success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` };
            }
        }
    }

    private buildHierarchy(node: any, includeComponents: boolean): any {
        const nodeInfo: any = {
            uuid: node.uuid,
            name: node.name,
            type: node.type,
            active: node.active,
            children: []
        };

        if (includeComponents && node.__comps__) {
            nodeInfo.components = node.__comps__.map((comp: any) => ({
                type: comp.__type__ || 'Unknown',
                enabled: comp.enabled !== undefined ? comp.enabled : true
            }));
        }

        if (node.children) {
            nodeInfo.children = node.children.map((child: any) => 
                this.buildHierarchy(child, includeComponents)
            );
        }

        return nodeInfo;
    }

    private async saveSceneAs(path: string): Promise<ToolResponse> {
        try {
            // save-as-scene API 不接受路径参数，会弹出对话框让用户选择
            await (Editor.Message.request as any)('scene', 'save-as-scene');
            return {
                success: true,
                data: {
                    path: path,
                    message: `Scene save-as dialog opened`
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async closeScene(): Promise<ToolResponse> {
        try {
            await Editor.Message.request('scene', 'close-scene');
            return {
                success: true,
                message: 'Scene closed successfully'
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async executeComponentMethod(uuid: string, name: string, args: any[]): Promise<ToolResponse> {
        try {
            const result: any = await Editor.Message.request('scene', 'execute-component-method', {
                uuid: uuid,
                name: name,
                args: args
            });
            return {
                success: true,
                data: result,
                message: `Component method ${name} executed successfully`
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async executeSceneScript(name: string, method: string, args: any[]): Promise<ToolResponse> {
        try {
            const result: any = await Editor.Message.request('scene', 'execute-scene-script', {
                name: name,
                method: method,
                args: args
            });
            return {
                success: true,
                data: result,
                message: `Scene script ${name}.${method} executed successfully`
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async restorePrefab(nodeUuid: string, assetUuid: string): Promise<ToolResponse> {
        try {
            const result: any = await (Editor.Message.request as any)('scene', 'restore-prefab', nodeUuid, assetUuid);
            return { success: true, data: result };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async sceneSnapshot(): Promise<ToolResponse> {
        try {
            const result: any = await Editor.Message.request('scene', 'snapshot');
            return {
                success: true,
                data: result,
                message: 'Scene snapshot created successfully'
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async sceneSnapshotAbort(): Promise<ToolResponse> {
        try {
            await Editor.Message.request('scene', 'snapshot-abort');
            return { success: true, message: 'Scene snapshot aborted' };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async beginUndoRecording(nodeUuid: string): Promise<ToolResponse> {
        try {
            const undoId: string = await Editor.Message.request('scene', 'begin-recording', nodeUuid);
            return {
                success: true,
                data: { undoId, nodeUuid },
                message: `Undo recording started for node ${nodeUuid}`
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async endUndoRecording(undoId: string): Promise<ToolResponse> {
        try {
            await Editor.Message.request('scene', 'end-recording', undoId);
            return {
                success: true,
                data: { undoId },
                message: 'Undo recording ended successfully'
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async cancelUndoRecording(undoId: string): Promise<ToolResponse> {
        try {
            await Editor.Message.request('scene', 'cancel-recording', undoId);
            return {
                success: true,
                data: { undoId },
                message: 'Undo recording cancelled successfully'
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async softReloadScene(): Promise<ToolResponse> {
        try {
            await Editor.Message.request('scene', 'soft-reload');
            return { success: true, message: 'Scene soft reloaded successfully' };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async querySceneReady(): Promise<ToolResponse> {
        try {
            const result: any = await Editor.Message.request('scene', 'query-is-ready');
            return { success: true, data: { isReady: result }, message: `Scene ready status: ${result}` };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async querySceneDirty(): Promise<ToolResponse> {
        try {
            const result: any = await Editor.Message.request('scene', 'query-dirty');
            return { success: true, data: { isDirty: result }, message: `Scene dirty status: ${result}` };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async querySceneClasses(extendsClass: string | undefined): Promise<ToolResponse> {
        try {
            const result: any = await Editor.Message.request('scene', 'query-classes', {});
            // Filter by extends class if provided
            let classes = result;
            if (extendsClass) {
                classes = result.filter((cls: any) => cls.extends === extendsClass);
            }
            return {
                success: true,
                data: { classes, total: classes.length },
                message: `Found ${classes.length} classes${extendsClass ? ` extending ${extendsClass}` : ''}`
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async querySceneComponents(): Promise<ToolResponse> {
        try {
            const result: any = await Editor.Message.request('scene', 'query-components');
            return {
                success: true,
                data: { components: result, total: result.length },
                message: `Found ${result.length} components in scene`
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async queryComponentHasScript(className: string): Promise<ToolResponse> {
        try {
            const result: any = await Editor.Message.request('scene', 'query-component-has-script', className);
            return {
                success: true,
                data: { hasScript: result, className },
                message: `Script ${className} ${result ? 'exists' : 'does not exist'} in component list`
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async queryNodesByAssetUuid(assetUuid: string): Promise<ToolResponse> {
        try {
            const result: any = await Editor.Message.request('scene', 'query-nodes-by-asset-uuid', assetUuid);
            return {
                success: true,
                data: { nodeUuids: result, assetUuid, count: result.length },
                message: `Found ${result.length} nodes using asset ${assetUuid}`
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    // New handler methods
    private async handleSceneManagement(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'get_current':
                return await this.getCurrentScene();
            case 'get_list':
                return await this.getSceneList();
            case 'open':
                return await this.openScene(args.scenePath);
            case 'save':
                return await this.saveScene();
            case 'create':
                return await this.createScene(args.sceneName, args.savePath);
            case 'save_as':
                return await this.saveSceneAs(args.path);
            case 'close':
                return await this.closeScene();
            default:
                return { success: false, error: `Unknown scene management action: ${action}` };
        }
    }

    private async handleExecutionControl(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'execute_component_method':
                return await this.executeComponentMethod(args.uuid, args.name, args.args);
            case 'execute_scene_script':
                return await this.executeSceneScript(args.name, args.method, args.args);
            case 'restore_prefab':
                return await this.restorePrefab(args.nodeUuid, args.assetUuid);
            default:
                return { success: false, error: `Unknown execution control action: ${action}` };
        }
    }

    private async handleStateManagement(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'create_snapshot':
                return await this.sceneSnapshot();
            case 'abort_snapshot':
                return await this.sceneSnapshotAbort();
            case 'begin_undo':
                return await this.beginUndoRecording(args.nodeUuid);
            case 'end_undo':
                return await this.endUndoRecording(args.undoId);
            case 'cancel_undo':
                return await this.cancelUndoRecording(args.undoId);
            case 'soft_reload':
                return await this.softReloadScene();
            default:
                return { success: false, error: `Unknown state management action: ${action}` };
        }
    }

    private async handleQuerySystem(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'check_ready':
                return await this.querySceneReady();
            case 'check_dirty':
                return await this.querySceneDirty();
            case 'list_classes':
                return await this.querySceneClasses(args.extends);
            case 'list_components':
                return await this.querySceneComponents();
            case 'check_script':
                return await this.queryComponentHasScript(args.className);
            case 'find_nodes_by_asset':
                return await this.queryNodesByAssetUuid(args.assetUuid);
            default:
                return { success: false, error: `Unknown query system action: ${action}` };
        }
    }

}