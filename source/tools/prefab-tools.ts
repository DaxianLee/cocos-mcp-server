import { ToolDefinition, ToolResponse, ToolExecutor, PrefabInfo } from '../types';
import { readSettings } from '../settings';

export class PrefabTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            // 1. Browse prefabs - Query and information
            {
                name: 'prefab_browse',
                description: 'PREFAB BROWSER: Query and analyze prefab files in your project. WORKFLOW: Use "list" to discover all prefabs → "info" to get detailed prefab data → "validate" to check file integrity. Essential for prefab management and debugging. Common use: finding prefabs before instantiation.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['list', 'info', 'validate'],
                            description: 'Browse operation: "list" = get all prefabs in folder (optional folder parameter) | "info" = get detailed prefab data (requires prefabPath) | "validate" = check prefab file integrity (requires prefabPath)'
                        },
                        folder: {
                            type: 'string',
                            description: 'Search directory for prefabs (list action). Default: "db://assets" searches entire project. Examples: "db://assets/prefabs" for main prefabs, "db://assets/ui" for UI prefabs. Use specific folders for focused searches.',
                            default: 'db://assets'
                        },
                        prefabPath: {
                            type: 'string',
                            description: 'Prefab file path (REQUIRED for info/validate actions). Must be valid Cocos asset path ending in .prefab. Examples: "db://assets/prefabs/Player.prefab", "db://assets/ui/MenuPanel.prefab". Get paths from list action first.'
                        }
                    },
                    required: ['action']
                }
            },

            // 2. Prefab lifecycle - Create, duplicate, delete
            {
                name: 'prefab_lifecycle',
                description: 'PREFAB LIFECYCLE: Create prefabs from existing nodes or delete prefab files. WORKFLOW: For create → select source node → specify name and save path → creates reusable prefab. For delete → specify prefab path → removes file permanently. Use with caution for delete operations.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['create', 'delete'],
                            description: 'Lifecycle operation: "create" = convert scene node into reusable prefab (requires nodeUuid+prefabName+savePath) | "delete" = permanently remove prefab file (requires prefabPath - WARNING: irreversible)'
                        },
                        nodeUuid: {
                            type: 'string',
                            description: 'Source node UUID for prefab creation (REQUIRED for create action). Use node_query to find target node UUID first. The node and all its children will be converted into a prefab. Format: "12345678-abcd-1234-5678-123456789abc"'
                        },
                        prefabName: {
                            type: 'string',
                            description: 'New prefab name (REQUIRED for create action). Choose descriptive names without .prefab extension. Examples: "PlayerCharacter", "UIButton", "EnemyTank". System adds .prefab extension automatically.'
                        },
                        savePath: {
                            type: 'string',
                            description: 'Destination path for new prefab (REQUIRED for create action). Must include .prefab extension. Examples: "db://assets/prefabs/Player.prefab", "db://assets/ui/CustomButton.prefab". Ensure parent folder exists.'
                        },
                        prefabPath: {
                            type: 'string',
                            description: 'Prefab file to delete (REQUIRED for delete action). WARNING: This permanently removes the prefab file. Examples: "db://assets/prefabs/OldPlayer.prefab". Use prefab_browse list to find exact paths first.'
                        }
                    },
                    required: ['action']
                }
            },

            // 3. Scene prefab instances - Instantiate, unlink, apply, revert
            {
                name: 'prefab_instance',
                description: 'PREFAB INSTANCES: Manage prefab instances in the scene. WORKFLOW: "instantiate" to create instances → modify as needed → "apply" to save changes back to prefab OR "unlink" to break connection OR "revert" to restore original. Critical for prefab-based development.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['instantiate', 'unlink', 'apply', 'revert'],
                            description: 'Instance operation: "instantiate" = create prefab instance in scene (requires prefabPath+parentUuid) | "unlink" = break prefab connection, make independent (requires nodeUuid) | "apply" = save instance changes to prefab (requires nodeUuid) | "revert" = restore to prefab state (requires nodeUuid)'
                        },
                        prefabPath: {
                            type: 'string',
                            description: 'Prefab file path (REQUIRED for instantiate action). Must be valid .prefab file. Examples: "db://assets/prefabs/Player.prefab", "db://assets/ui/MenuPanel.prefab". Use prefab_browse to find available prefabs.'
                        },
                        parentUuid: {
                            type: 'string',
                            description: 'Parent node UUID for new instance (REQUIRED for instantiate action). Use node_query to find parent node first. The prefab instance will be created as a child of this node. Format: "12345678-abcd-1234-5678-123456789abc"'
                        },
                        position: {
                            type: 'object',
                            properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } },
                            description: 'Starting position for new instance (instantiate action). Sets initial transform after creation. Example: {"x": 100, "y": 200, "z": 0}. Optional - defaults to prefab\'s original position if omitted.'
                        },
                        nodeUuid: {
                            type: 'string',
                            description: 'Prefab instance node UUID (REQUIRED for unlink/apply/revert actions). Must be a node that was created from a prefab. Use node_query to find prefab instance nodes. Format: "12345678-abcd-1234-5678-123456789abc"'
                        }
                    },
                    required: ['action']
                }
            },

            // 4. Prefab edit mode - IMPORTANT: Complete workflow for editing prefabs
            {
                name: 'prefab_edit',
                description: 'PREFAB EDIT WORKFLOW: Edit prefab content in dedicated editing mode. CRITICAL WORKFLOW: 1) "enter" edit mode (switches to prefab scene) → 2) make modifications using other tools → 3) "save" changes → 4) "exit" back to main scene. IMPORTANT: Always save before exit to persist changes.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['enter', 'save', 'exit', 'test'],
                            description: 'Edit operation: "enter" = start editing prefab in dedicated scene (requires prefabPath) | "save" = persist current changes to prefab file | "exit" = return to main scene (REMEMBER to save first) | "test" = create test instance to verify changes (requires parentUuid)'
                        },
                        prefabPath: {
                            type: 'string',
                            description: 'Prefab file path (REQUIRED for enter/save/exit actions). Must be valid .prefab file. Examples: "db://assets/prefabs/Player.prefab". For enter: opens prefab for editing. For save/exit: specifies which prefab to save/close.'
                        },
                        parentUuid: {
                            type: 'string',
                            description: 'Parent node for test instance (test action only). Use node_query to find parent UUID. Creates temporary instance to verify prefab changes work correctly. Format: "12345678-abcd-1234-5678-123456789abc"'
                        }
                    },
                    required: ['action', 'prefabPath']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'prefab_browse':
                return await this.handlePrefabBrowse(args);
            case 'prefab_lifecycle':
                return await this.handlePrefabLifecycle(args);
            case 'prefab_instance':
                return await this.handlePrefabInstance(args);
            case 'prefab_edit':
                return await this.handlePrefabEdit(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async getPrefabList(folder: string = 'db://assets'): Promise<ToolResponse> {
        try {
            const pattern = folder.endsWith('/') ?
                `${folder}**/*.prefab` : `${folder}/**/*.prefab`;

            const results: any[] = await Editor.Message.request('asset-db', 'query-assets', {
                pattern: pattern
            });
            const prefabs: PrefabInfo[] = results.map(asset => ({
                name: asset.name,
                path: asset.url,
                uuid: asset.uuid,
                folder: asset.url.substring(0, asset.url.lastIndexOf('/'))
            }));
            return { success: true, data: prefabs };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async loadPrefab(prefabPath: string): Promise<ToolResponse> {
        try {
            const assetInfo: any = await Editor.Message.request('asset-db', 'query-asset-info', prefabPath);
            if (!assetInfo) {
                throw new Error('Prefab not found');
            }

            const prefabData: any = await Editor.Message.request('scene', 'load-asset', {
                uuid: assetInfo.uuid
            });
            return {
                success: true,
                data: {
                    uuid: prefabData.uuid,
                    name: prefabData.name,
                    message: 'Prefab loaded successfully'
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async instantiatePrefab(args: any): Promise<ToolResponse> {
        try {
            // 获取预制体资源信息
            const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', args.prefabPath);
            if (!assetInfo) {
                throw new Error('预制体未找到');
            }

            // 记录撤销操作
            await this.recordUndoOperation('instantiate-prefab', args.parentUuid || 'scene');

            // 使用编辑器标准流程
            const result = await this.instantiatePrefabStandard(args, assetInfo);
            if (result.success) {
                // 实例化预制体不需要刷新全部资源
                return result;
            }

            // 回退方法
            console.log('标准方法失败，使用简化方法...');
            const fallbackResult = await this.instantiatePrefabSimple(args, assetInfo);
            // 实例化预制体不需要刷新全部资源
            return fallbackResult;

        } catch (err: any) {
            return {
                success: false,
                error: `预制体实例化失败: ${err.message}`,
                instruction: '请检查预制体路径是否正确，确保预制体文件格式正确'
            };
        }
    }

    /**
     * 建立节点与预制体的关联关系
     * 这个方法创建必要的PrefabInfo和PrefabInstance结构
     */
    private async establishPrefabConnection(nodeUuid: string, prefabUuid: string, prefabPath: string): Promise<void> {
        try {
            // 读取预制体文件获取根节点的fileId
            const prefabContent = await this.readPrefabFile(prefabPath);
            if (!prefabContent || !prefabContent.data || !prefabContent.data.length) {
                throw new Error('无法读取预制体文件内容');
            }

            // 找到预制体根节点的fileId (通常是第二个对象，即索引1)
            const rootNode = prefabContent.data.find((item: any) => item.__type === 'cc.Node' && item._parent === null);
            if (!rootNode || !rootNode._prefab) {
                throw new Error('无法找到预制体根节点或其预制体信息');
            }

            // 获取根节点的PrefabInfo
            const rootPrefabInfo = prefabContent.data[rootNode._prefab.__id__];
            if (!rootPrefabInfo || rootPrefabInfo.__type !== 'cc.PrefabInfo') {
                throw new Error('无法找到预制体根节点的PrefabInfo');
            }

            const rootFileId = rootPrefabInfo.fileId;

            // 使用scene API建立预制体连接
            const prefabConnectionData = {
                node: nodeUuid,
                prefab: prefabUuid,
                fileId: rootFileId
            };

            // 尝试使用多种API方法建立预制体连接
            const connectionMethods = [
                () => Editor.Message.request('scene', 'connect-prefab-instance', prefabConnectionData),
                () => Editor.Message.request('scene', 'set-prefab-connection', prefabConnectionData),
                () => Editor.Message.request('scene', 'apply-prefab-link', prefabConnectionData)
            ];

            let connected = false;
            for (const method of connectionMethods) {
                try {
                    await method();
                    connected = true;
                    break;
                } catch (error) {
                    console.warn('预制体连接方法失败，尝试下一个方法:', error);
                }
            }

            if (!connected) {
                // 如果所有API方法都失败，尝试手动修改场景数据
                console.warn('所有预制体连接API都失败，尝试手动建立连接');
                await this.manuallyEstablishPrefabConnection(nodeUuid, prefabUuid, rootFileId);
            }

        } catch (error) {
            console.error('建立预制体连接失败:', error);
            throw error;
        }
    }

    /**
     * 手动建立预制体连接（当API方法失败时的备用方案）
     */
    private async manuallyEstablishPrefabConnection(nodeUuid: string, prefabUuid: string, rootFileId: string): Promise<void> {
        try {
            // 尝试使用dump API修改节点的_prefab属性
            const prefabConnectionData = {
                [nodeUuid]: {
                    '_prefab': {
                        '__uuid__': prefabUuid,
                        '__expectedType__': 'cc.Prefab',
                        'fileId': rootFileId
                    }
                }
            };

            await Editor.Message.request('scene', 'set-property', {
                uuid: nodeUuid,
                path: '_prefab',
                dump: {
                    value: {
                        '__uuid__': prefabUuid,
                        '__expectedType__': 'cc.Prefab'
                    }
                }
            });

        } catch (error) {
            console.error('手动建立预制体连接也失败:', error);
            // 不抛出错误，因为基本的节点创建已经成功
        }
    }

    /**
     * 读取预制体文件内容
     */
    private async readPrefabFile(prefabPath: string): Promise<any> {
        try {
            // 尝试使用asset-db API读取文件内容
            let assetContent: any;
            try {
                assetContent = await Editor.Message.request('asset-db', 'query-asset-info', prefabPath);
                if (assetContent && assetContent.source) {
                    // 如果有source路径，直接读取文件
                    const fs = require('fs');
                    const path = require('path');
                    const fullPath = path.resolve(assetContent.source);
                    const fileContent = fs.readFileSync(fullPath, 'utf8');
                    return JSON.parse(fileContent);
                }
            } catch (error) {
                console.warn('使用asset-db读取失败，尝试其他方法:', error);
            }

            // 备用方法：转换db://路径为实际文件路径
            const fsPath = prefabPath.replace('db://assets/', 'assets/').replace('db://assets', 'assets');
            const fs = require('fs');
            const path = require('path');

            // 尝试多个可能的项目根路径
            const possiblePaths = [
                path.resolve(process.cwd(), '../../NewProject_3', fsPath),
                path.resolve('/Users/lizhiyong/NewProject_3', fsPath),
                path.resolve(fsPath),
                // 如果是根目录下的文件，也尝试直接路径
                path.resolve('/Users/lizhiyong/NewProject_3/assets', path.basename(fsPath))
            ];

            console.log('尝试读取预制体文件，路径转换:', {
                originalPath: prefabPath,
                fsPath: fsPath,
                possiblePaths: possiblePaths
            });

            for (const fullPath of possiblePaths) {
                try {
                    console.log(`检查路径: ${fullPath}`);
                    if (fs.existsSync(fullPath)) {
                        console.log(`找到文件: ${fullPath}`);
                        const fileContent = fs.readFileSync(fullPath, 'utf8');
                        const parsed = JSON.parse(fileContent);
                        console.log('文件解析成功，数据结构:', {
                            hasData: !!parsed.data,
                            dataLength: parsed.data ? parsed.data.length : 0
                        });
                        return parsed;
                    } else {
                        console.log(`文件不存在: ${fullPath}`);
                    }
                } catch (readError) {
                    console.warn(`读取文件失败 ${fullPath}:`, readError);
                }
            }

            throw new Error('无法找到或读取预制体文件');
        } catch (error) {
            console.error('读取预制体文件失败:', error);
            throw error;
        }
    }

    private async tryCreateNodeWithPrefab(args: any): Promise<ToolResponse> {
        try {
            const assetInfo: any = await Editor.Message.request('asset-db', 'query-asset-info', args.prefabPath);
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

            const nodeUuid: string | string[] = await Editor.Message.request('scene', 'create-node', createNodeOptions);
            const uuid = Array.isArray(nodeUuid) ? nodeUuid[0] : nodeUuid;

            // 如果指定了位置，设置节点位置
            if (args.position && uuid) {
                try {
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: 'position',
                        dump: { value: args.position }
                    });
                    return {
                        success: true,
                        data: {
                            nodeUuid: uuid,
                            prefabPath: args.prefabPath,
                            position: args.position,
                            message: '预制体实例化成功（备用方法）并设置了位置'
                        }
                    };
                } catch {
                    return {
                        success: true,
                        data: {
                            nodeUuid: uuid,
                            prefabPath: args.prefabPath,
                            message: '预制体实例化成功（备用方法）但位置设置失败'
                        }
                    };
                }
            } else {
                return {
                    success: true,
                    data: {
                        nodeUuid: uuid,
                        prefabPath: args.prefabPath,
                        message: '预制体实例化成功（备用方法）'
                    }
                };
            }
        } catch (err: any) {
            return {
                success: false,
                error: `备用预制体实例化方法也失败: ${err.message}`
            };
        }
    }

    private async tryAlternativeInstantiateMethods(args: any): Promise<ToolResponse> {
        try {
            // 方法1: 尝试使用 create-node 然后设置预制体
            const assetInfo = await this.getAssetInfo(args.prefabPath);
            if (!assetInfo) {
                return { success: false, error: '无法获取预制体信息' };
            }

            // 创建空节点
            const createResult = await this.createNode(args.parentUuid, args.position);
            if (!createResult.success) {
                return createResult;
            }

            // 尝试将预制体应用到节点
            const applyResult = await this.applyPrefabToNode(createResult.data.nodeUuid, assetInfo.uuid);
            if (applyResult.success) {
                return {
                    success: true,
                    data: {
                        nodeUuid: createResult.data.nodeUuid,
                        name: createResult.data.name,
                        message: '预制体实例化成功（使用备选方法）'
                    }
                };
            } else {
                return {
                    success: false,
                    error: '无法将预制体应用到节点',
                    data: {
                        nodeUuid: createResult.data.nodeUuid,
                        message: '已创建节点，但无法应用预制体数据'
                    }
                };
            }

        } catch (error) {
            return { success: false, error: `备选实例化方法失败: ${error}` };
        }
    }

    private async getAssetInfo(prefabPath: string): Promise<any> {
        try {
            const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', prefabPath);
            return assetInfo;
        } catch {
            return null;
        }
    }

    private async createNode(parentUuid?: string, position?: any): Promise<ToolResponse> {
        try {
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

            const nodeUuid: string | string[] = await Editor.Message.request('scene', 'create-node', createNodeOptions);
            const uuid = Array.isArray(nodeUuid) ? nodeUuid[0] : nodeUuid;
            return {
                success: true,
                data: {
                    nodeUuid: uuid,
                    name: 'PrefabInstance'
                }
            };
        } catch (error: any) {
            return { success: false, error: error.message || '创建节点失败' };
        }
    }

    private async applyPrefabToNode(nodeUuid: string, prefabUuid: string): Promise<ToolResponse> {
        // 尝试多种方法来应用预制体数据
        const methods = [
            () => Editor.Message.request('scene', 'apply-prefab', { node: nodeUuid, prefab: prefabUuid }),
            () => Editor.Message.request('scene', 'set-prefab', { node: nodeUuid, prefab: prefabUuid }),
            () => Editor.Message.request('scene', 'load-prefab-to-node', { node: nodeUuid, prefab: prefabUuid })
        ];

        for (const method of methods) {
            try {
                await method();
                return { success: true };
            } catch {
                // try next method
            }
        }
        return { success: false, error: '无法应用预制体数据' };
    }

    /**
     * 使用 asset-db API 创建预制体的新方法
     * 深度整合引擎的资源管理系统，实现完整的预制体创建流程
     */
    /**
     * 使用 asset-db API 创建预制体的新方法
     * 深度整合引擎的资源管理系统，实现完整的预制体创建流程
     */
    private async createPrefabWithAssetDB(nodeUuid: string, savePath: string, prefabName: string, includeChildren: boolean, includeComponents: boolean): Promise<ToolResponse> {
        try {
            console.log('=== 使用 Asset-DB API 创建预制体 ===');
            console.log(`节点UUID: ${nodeUuid}`);
            console.log(`保存路径: ${savePath}`);
            console.log(`预制体名称: ${prefabName}`);

            // 第一步：获取节点数据（包括变换属性）
            const nodeData = await this.getNodeData(nodeUuid);
            if (!nodeData) {
                return {
                    success: false,
                    error: '无法获取节点数据'
                };
            }

            console.log('获取到节点数据，子节点数量:', nodeData.children ? nodeData.children.length : 0);

            // 第二步：先创建资源文件以获取引擎分配的UUID
            console.log('创建预制体资源文件...');
            const tempPrefabContent = JSON.stringify([{"__type__": "cc.Prefab", "_name": prefabName}], null, 2);
            const createResult = await this.createAssetWithAssetDB(savePath, tempPrefabContent);
            if (!createResult.success) {
                return createResult;
            }

            // 获取引擎分配的实际UUID
            const actualPrefabUuid = createResult.data?.uuid;
            if (!actualPrefabUuid) {
                return {
                    success: false,
                    error: '无法获取引擎分配的预制体UUID'
                };
            }
            console.log('引擎分配的UUID:', actualPrefabUuid);

            // 第三步：使用实际UUID重新生成预制体内容
            const prefabContent = await this.createStandardPrefabContent(nodeData, prefabName, actualPrefabUuid, includeChildren, includeComponents);
            const prefabContentString = JSON.stringify(prefabContent, null, 2);

            // 第四步：更新预制体文件内容
            console.log('更新预制体文件内容...');
            const updateResult = await this.updateAssetWithAssetDB(savePath, prefabContentString);

            // 第五步：创建对应的meta文件（使用实际UUID）
            console.log('创建预制体meta文件...');
            const metaContent = this.createStandardMetaContent(prefabName, actualPrefabUuid);
            const metaResult = await this.createMetaWithAssetDB(savePath, metaContent);

            // 第六步：重新导入资源以更新引用
            console.log('重新导入预制体资源...');
            const reimportResult = await this.reimportAssetWithAssetDB(savePath);

            // 第七步：尝试将原始节点转换为预制体实例
            console.log('尝试将原始节点转换为预制体实例...');
            const convertResult = await this.convertNodeToPrefabInstance(nodeUuid, actualPrefabUuid, savePath);

            return {
                success: true,
                data: {
                    prefabUuid: actualPrefabUuid,
                    prefabPath: savePath,
                    nodeUuid: nodeUuid,
                    prefabName: prefabName,
                    convertedToPrefabInstance: convertResult.success,
                    createAssetResult: createResult,
                    updateResult: updateResult,
                    metaResult: metaResult,
                    reimportResult: reimportResult,
                    convertResult: convertResult,
                    message: convertResult.success ? '预制体创建并成功转换原始节点' : '预制体创建成功，但节点转换失败'
                }
            };

        } catch (error) {
            console.error('创建预制体时发生错误:', error);
            return {
                success: false,
                error: `创建预制体失败: ${error}`
            };
        }
    }

    private async createPrefab(args: any): Promise<ToolResponse> {
        try {
            // 支持 prefabPath 和 savePath 两种参数名
            const pathParam = args.prefabPath || args.savePath;
            if (!pathParam) {
                return {
                    success: false,
                    error: '缺少预制体路径参数。请提供 prefabPath 或 savePath。'
                };
            }

            const prefabName = args.prefabName || 'NewPrefab';
            const fullPath = pathParam.endsWith('.prefab') ?
                pathParam : `${pathParam}/${prefabName}.prefab`;

            // 记录撤销操作
            await this.recordUndoOperation('create-prefab', args.nodeUuid);

            // 优先使用编辑器标准方法: scene.create-prefab
            console.log('使用编辑器标准方法创建预制体...');
            const sceneResult = await this.createPrefabWithScene(args.nodeUuid, fullPath, prefabName);

            if (sceneResult.success) {
                // 创建成功后立即刷新资源
                await this.refreshAssets(fullPath);
                return sceneResult;
            }

            // 回退到 asset-db 方法
            console.log('scene方法失败，使用asset-db方法...');
            const assetDbResult = await this.createPrefabWithAssetDB(
                args.nodeUuid,
                fullPath,
                prefabName,
                true, // includeChildren
                true  // includeComponents
            );

            if (assetDbResult.success) {
                await this.refreshAssets(fullPath);
                return assetDbResult;
            }

            // 最后使用自定义实现
            console.log('asset-db方法失败，使用自定义实现...');
            const customResult = await this.createPrefabCustom(args.nodeUuid, fullPath, prefabName);
            if (customResult.success) {
                await this.refreshAssets(fullPath);
            }
            return customResult;

        } catch (error) {
            return {
                success: false,
                error: `创建预制体时发生错误: ${error}`
            };
        }
    }

    // 使用编辑器标准的 scene.create-prefab 方法
    // 使用编辑器标准的 scene.create-prefab 方法
    private async createPrefabWithScene(nodeUuid: string, prefabPath: string, prefabName: string): Promise<ToolResponse> {
        try {
            console.log(`[DEBUG] Creating prefab with scene API: nodeUuid=${nodeUuid}, prefabPath=${prefabPath}`);

            // 确保目录存在
            const dirPath = prefabPath.substring(0, prefabPath.lastIndexOf('/'));
            console.log(`[DEBUG] Ensuring directory exists: ${dirPath}`);

            try {
                await Editor.Message.request('asset-db', 'create-asset', dirPath, null);
                console.log(`[DEBUG] Directory creation attempted: ${dirPath}`);
            } catch (dirError) {
                console.log(`[DEBUG] Directory creation failed or already exists: ${dirError}`);
            }

            const result = await Editor.Message.request('scene', 'create-prefab', {
                nodeUuid: nodeUuid,
                url: prefabPath
            });

            console.log('[DEBUG] scene.create-prefab result:', result);

            // 验证预制体是否真的创建成功
            await new Promise(resolve => setTimeout(resolve, 500)); // 等待文件系统同步

            try {
                const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', prefabPath);
                console.log('[DEBUG] Asset verification result:', assetInfo);

                if (assetInfo && assetInfo.uuid) {
                    console.log('[DEBUG] Prefab creation verified successfully');
                    return {
                        success: true,
                        data: {
                            prefabPath: prefabPath,
                            prefabName: prefabName,
                            nodeUuid: nodeUuid,
                            assetUuid: assetInfo.uuid,
                            message: 'Prefab created successfully with scene API'
                        }
                    };
                } else {
                    console.log('[DEBUG] Prefab creation failed - asset not found after creation');
                    return {
                        success: false,
                        error: 'Prefab creation appeared successful but asset was not found. File may not have been created.'
                    };
                }
            } catch (verifyError) {
                console.log('[DEBUG] Asset verification failed:', verifyError);
                return {
                    success: false,
                    error: `Prefab creation verification failed: ${verifyError}`
                };
            }

        } catch (error: any) {
            console.log('[DEBUG] scene.create-prefab failed:', error);
            return {
                success: false,
                error: `Scene API prefab creation failed: ${error.message || error}`
            };
        }
    }

    // 记录撤销操作 - 暂时禁用，因为API不存在
    private async recordUndoOperation(operation: string, nodeUuid: string): Promise<void> {
        try {
            // 暂时注释掉不存在的API调用
            // await Editor.Message.request('scene', 'undo.record', {
            //     operation: operation,
            //     nodeUuid: nodeUuid,
            //     timestamp: Date.now()
            // });
            console.log(`撤销记录跳过 (API不存在): ${operation} for ${nodeUuid}`);
        } catch (error) {
            console.log(`撤销记录保存失败: ${error}`);
            // 不阻断主流程
        }
    }

    // 刷新资源 - 优化版本，避免不必要的全局刷新
    private async refreshAssets(assetPath?: string): Promise<void> {
        try {
            if (assetPath) {
                // 刷新特定资源
                await Editor.Message.request('asset-db', 'refresh-asset', assetPath);
                console.log(`资源刷新成功: ${assetPath}`);
            } else {
                // 避免全局刷新，只刷新资源目录
                console.log('跳过全局资源刷新，避免编辑器重新加载');
                // 如果确实需要刷新，可以手动调用：
                // await Editor.Message.request('asset-db', 'refresh');
            }
        } catch (error) {
            console.log(`资源刷新失败: ${error}`);
            // 不阻断主流程
        }
    }

    // 使用编辑器标准流程实例化预制体
    // 使用编辑器标准流程实例化预制体
    private async instantiatePrefabStandard(args: any, assetInfo: any): Promise<ToolResponse> {
        try {
            const parentUuid = args.parentUuid || 'ae46a3bb-5483-43dc-8152-8c5e42a0a9aa'; // 默认场景根节点

            // 1. 开始记录
            await Editor.Message.request('scene', 'begin-recording', [parentUuid]);

            // 2. 创建节点（使用assetUuid参数）
            const createNodeOptions: any = {
                parent: parentUuid,
                assetUuid: assetInfo.uuid,
                name: args.name || assetInfo.name || 'PrefabInstance',
                type: 'cc.Prefab'
            };

            const nodeUuid = await Editor.Message.request('scene', 'create-node', createNodeOptions);
            const uuid = Array.isArray(nodeUuid) ? nodeUuid[0] : nodeUuid;

            // 3. 如果有位置参数，调整节点位置
            if (args.position) {
                await Editor.Message.request('scene', 'set-property', {
                    uuid: uuid,
                    path: 'position',
                    dump: { value: args.position }
                });
            }

            // 4. 如果需要调整在父节点中的顺序
            if (args.siblingIndex !== undefined && args.siblingIndex >= 0) {
                await Editor.Message.request('scene', 'move-array-element', {
                    uuid: parentUuid,
                    path: 'children',
                    target: args.siblingIndex,
                    offset: 0
                });
            }

            // 5. 结束记录
            await Editor.Message.request('scene', 'end-recording', [`instantiate-${Date.now()}`]);

            return {
                success: true,
                data: {
                    nodeUuid: uuid,
                    prefabPath: args.prefabPath,
                    parentUuid: parentUuid,
                    position: args.position,
                    message: '预制体实例化成功（使用编辑器标准流程）'
                }
            };

        } catch (error) {
            console.log('编辑器标准流程失败:', error);
            return {
                success: false,
                error: `编辑器标准流程失败: ${error}`
            };
        }
    }

    // 简化的实例化方法
    // 简化的实例化方法
    private async instantiatePrefabSimple(args: any, assetInfo: any): Promise<ToolResponse> {
        try {
            // 使用简化的 create-node API
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

            // 创建节点
            const nodeUuid = await Editor.Message.request('scene', 'create-node', createNodeOptions);
            const uuid = Array.isArray(nodeUuid) ? nodeUuid[0] : nodeUuid;

            console.log('简化方法预制体节点创建成功:', {
                nodeUuid: uuid,
                prefabUuid: assetInfo.uuid,
                prefabPath: args.prefabPath
            });

            return {
                success: true,
                data: {
                    nodeUuid: uuid,
                    prefabPath: args.prefabPath,
                    parentUuid: args.parentUuid,
                    position: args.position,
                    message: '预制体实例化成功（使用简化方法）'
                }
            };

        } catch (error) {
            return {
                success: false,
                error: `简化方法失败: ${error}`
            };
        }
    }

    // 1. Prefab browse handler
    private async handlePrefabBrowse(args: any): Promise<ToolResponse> {
        try {
            const { action } = args;

            switch (action) {
                case 'list':
                    return await this.getPrefabList(args.folder);
                case 'info':
                    if (!args.prefabPath) {
                        return { success: false, error: 'prefabPath required for info action' };
                    }
                    return await this.getPrefabInfo(args.prefabPath);
                case 'validate':
                    if (!args.prefabPath) {
                        return { success: false, error: 'prefabPath required for validate action' };
                    }
                    return await this.validatePrefab(args.prefabPath);
                default:
                    return { success: false, error: `Unsupported browse action: ${action}` };
            }
        } catch (error) {
            return { success: false, error: `Browse operation failed: ${error}` };
        }
    }

    // 2. Prefab lifecycle handler
    private async handlePrefabLifecycle(args: any): Promise<ToolResponse> {
        try {
            const { action } = args;

            switch (action) {
                case 'create':
                    if (!args.nodeUuid || !args.prefabName || !args.savePath) {
                        return { success: false, error: 'nodeUuid, prefabName, savePath required for create' };
                    }
                    const createResult = await this.createPrefab({
                        nodeUuid: args.nodeUuid,
                        prefabName: args.prefabName,
                        savePath: args.savePath
                    });
                    if (createResult.success) {
                        return {
                            success: true,
                            data: {
                                prefabPath: args.savePath,
                                message: '✅ Prefab created'
                            }
                        };
                    }
                    return createResult;
                case 'delete':
                    if (!args.prefabPath) {
                        return { success: false, error: 'prefabPath required for delete' };
                    }
                    try {
                        await Editor.Message.request('asset-db', 'delete-asset', args.prefabPath);
                        await this.refreshAssets();
                        return {
                            success: true,
                            data: { message: '✅ Prefab deleted' }
                        };
                    } catch (error) {
                        return { success: false, error: `Delete failed: ${error}` };
                    }
                default:
                    return { success: false, error: `Unsupported lifecycle action: ${action}` };
            }
        } catch (error) {
            return { success: false, error: `Lifecycle operation failed: ${error}` };
        }
    }

    // 3. Prefab instance handler
    private async handlePrefabInstance(args: any): Promise<ToolResponse> {
        try {
            const { action } = args;

            switch (action) {
                case 'instantiate':
                    if (!args.prefabPath) {
                        return { success: false, error: 'prefabPath required for instantiate' };
                    }
                    const instantiateResult = await this.instantiatePrefab({
                        prefabPath: args.prefabPath,
                        parentUuid: args.parentUuid,
                        position: args.position
                    });
                    if (instantiateResult.success) {
                        return {
                            success: true,
                            data: {
                                nodeUuid: instantiateResult.data.nodeUuid,
                                message: '✅ Prefab instantiated'
                            }
                        };
                    }
                    return instantiateResult;
                case 'unlink':
                    if (!args.nodeUuid) {
                        return { success: false, error: 'nodeUuid required for unlink' };
                    }
                    const unlinkResult = await this.unlinkPrefab(args.nodeUuid);
                    if (unlinkResult.success) {
                        return {
                            success: true,
                            data: { message: '✅ Prefab unlinked' }
                        };
                    }
                    return unlinkResult;
                case 'apply':
                    if (!args.nodeUuid) {
                        return { success: false, error: 'nodeUuid required for apply' };
                    }
                    const applyResult = await this.applyPrefab(args.nodeUuid);
                    if (applyResult.success) {
                        return {
                            success: true,
                            data: { message: '✅ Changes applied to prefab' }
                        };
                    }
                    return applyResult;
                case 'revert':
                    if (!args.nodeUuid) {
                        return { success: false, error: 'nodeUuid required for revert' };
                    }
                    return await this.revertPrefab(args.nodeUuid);
                default:
                    return { success: false, error: `Unsupported instance action: ${action}` };
            }
        } catch (error) {
            return { success: false, error: `Instance operation failed: ${error}` };
        }
    }

    // 4. Prefab edit workflow handler
    private async handlePrefabEdit(args: any): Promise<ToolResponse> {
        try {
            const { action, prefabPath } = args;

            switch (action) {
                case 'enter':
                    const enterResult = await this.enterPrefabEditMode(prefabPath);
                    if (enterResult.success) {
                        return {
                            success: true,
                            data: {
                                status: 'editing',
                                prefabPath: prefabPath,
                                message: '✅ Entered prefab edit mode',
                                reminder: '⚠️  IMPORTANT: After making changes, you MUST call save action, then exit action to return to scene'
                            }
                        };
                    }
                    return enterResult;
                case 'save':
                    const saveResult = await this.savePrefabDirect(prefabPath);
                    if (saveResult.success) {
                        return {
                            success: true,
                            data: {
                                status: 'saved',
                                prefabPath: prefabPath,
                                message: '✅ Prefab saved',
                                reminder: '⚠️  IMPORTANT: You MUST call exit action now to return to scene view'
                            }
                        };
                    }
                    return saveResult;
                case 'exit':
                    const exitResult = await this.exitPrefabEditMode(prefabPath);
                    if (exitResult.success) {
                        return {
                            success: true,
                            data: {
                                status: 'scene',
                                message: '✅ Returned to scene view',
                                note: 'Prefab editing complete'
                            }
                        };
                    }
                    return exitResult;
                case 'test':
                    return await this.testPrefabChanges(prefabPath, args.parentUuid);
                default:
                    return { success: false, error: `Unsupported edit action: ${action}` };
            }
        } catch (error) {
            return { success: false, error: `Prefab edit failed: ${error}` };
        }
    }

    // 参数验证方法
    private validatePrefabOperation(operation: string, args: any): { valid: boolean; error?: string } {
        const requiredParams: Record<string, string[]> = {
            'create': ['nodeUuid', 'prefabName'],
            'instantiate': ['prefabPath'],
            'update': ['prefabPath', 'nodeUuid'],
            'delete': ['prefabPath'],
            'revert': ['nodeUuid'],
            'get_info': ['prefabPath'],
            'validate': ['prefabPath'],
            'unlink': ['nodeUuid'],
            'apply': ['nodeUuid'],
            'edit': ['prefabPath'],
            'save': ['prefabPath'],
            'exit_edit': [],
            'test_changes': ['prefabPath']
        };

        const required = requiredParams[operation];
        if (!required) {
            return { valid: false, error: `不支持的操作类型: ${operation}` };
        }

        for (const param of required) {
            if (!args[param]) {
                return { valid: false, error: `操作 '${operation}' 缺少必需参数: ${param}` };
            }
        }

        // 特殊验证规则
        if (operation === 'create' && !args.savePath && !args.prefabPath) {
            return { valid: false, error: `操作 'create' 需要 savePath 或 prefabPath 参数` };
        }

        return { valid: true };
    }

    // 统一的预制体管理方法
    private async managePrefab(args: any): Promise<ToolResponse> {
        try {
            // 验证操作类型
            const operation = args.operation;
            if (!operation) {
                return {
                    success: false,
                    error: '缺少必需参数: operation'
                };
            }

            // 验证各操作所需的参数
            const validationResult = this.validatePrefabOperation(operation, args);
            if (!validationResult.valid) {
                return {
                    success: false,
                    error: validationResult.error
                };
            }

            switch (operation) {
                case 'create':
                    return await this.createPrefab({
                        nodeUuid: args.nodeUuid,
                        savePath: args.savePath || args.prefabPath,
                        prefabName: args.prefabName
                    });

                case 'instantiate':
                    return await this.instantiatePrefab({
                        prefabPath: args.prefabPath,
                        parentUuid: args.parentUuid,
                        position: args.position,
                        siblingIndex: args.siblingIndex
                    });

                case 'update':
                    return await this.updatePrefab(args.prefabPath, args.nodeUuid);

                case 'delete':
                    // 删除预制体资源
                    try {
                        await Editor.Message.request('asset-db', 'delete-asset', args.prefabPath);
                        await this.refreshAssets();
                        return {
                            success: true,
                            data: {
                                prefabPath: args.prefabPath,
                                message: '预制体删除成功'
                            }
                        };
                    } catch (error) {
                        return {
                            success: false,
                            error: `预制体删除失败: ${error}`
                        };
                    }

                case 'revert':
                    return await this.revertPrefab(args.nodeUuid);


                case 'get_info':
                    return await this.getPrefabInfo(args.prefabPath);

                case 'validate':
                    return await this.validatePrefab(args.prefabPath);

                case 'unlink':
                    return await this.unlinkPrefab(args.nodeUuid);

                case 'apply':
                    return await this.applyPrefab(args.nodeUuid);

                case 'edit':
                    return await this.enterPrefabEditMode(args.prefabPath);

                case 'save':
                    return await this.savePrefabDirect(args.prefabPath);

                case 'exit_edit':
                    return await this.exitPrefabEditMode(args.prefabPath);

                case 'test_changes':
                    return await this.testPrefabChanges(args.prefabPath, args.parentUuid);

                default:
                    return {
                        success: false,
                        error: `不支持的预制体操作: ${operation}`
                    };
            }
        } catch (error) {
            return {
                success: false,
                error: `预制体管理操作失败: ${error}`
            };
        }
    }

    private async createPrefabCustom(nodeUuid: string, prefabPath: string, prefabName: string): Promise<ToolResponse> {
        try {
            // 1. 获取源节点的完整数据
            const nodeData = await this.getNodeData(nodeUuid);
            if (!nodeData) {
                return {
                    success: false,
                    error: `无法找到节点: ${nodeUuid}`
                };
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
            const prefabJsonData = await this.createStandardPrefabContent(nodeData, prefabName, prefabUuid, true, true);

            // 5. 创建标准meta文件数据
            const standardMetaData = this.createStandardMetaData(prefabName, prefabUuid);

            // 6. 保存预制体和meta文件
            const saveResult = await this.savePrefabWithMeta(prefabPath, prefabJsonData, standardMetaData);

            if (saveResult.success) {
                // 保存成功后，将原始节点转换为预制体实例
                const convertResult = await this.convertNodeToPrefabInstance(nodeUuid, prefabPath, prefabUuid);

                return {
                    success: true,
                    data: {
                        prefabUuid: prefabUuid,
                        prefabPath: prefabPath,
                        nodeUuid: nodeUuid,
                        prefabName: prefabName,
                        convertedToPrefabInstance: convertResult.success,
                        message: convertResult.success ?
                            '自定义预制体创建成功，原始节点已转换为预制体实例' :
                            '预制体创建成功，但节点转换失败'
                    }
                };
            } else {
                return {
                    success: false,
                    error: saveResult.error || '保存预制体文件失败'
                };
            }

        } catch (error) {
            return {
                success: false,
                error: `创建预制体时发生错误: ${error}`
            };
        }
    }

    private async getNodeData(nodeUuid: string): Promise<any> {
        try {
            // 首先获取基本节点信息
            const nodeInfo = await Editor.Message.request('scene', 'query-node', nodeUuid);
            if (!nodeInfo) {
                return null;
            }

            console.log(`获取节点 ${nodeUuid} 的基本信息成功`);

            // 使用query-node-tree获取包含子节点的完整结构
            const nodeTree = await this.getNodeWithChildren(nodeUuid);
            if (nodeTree) {
                console.log(`获取节点 ${nodeUuid} 的完整树结构成功`);
                return nodeTree;
            } else {
                console.log(`使用基本节点信息`);
                return nodeInfo;
            }
        } catch (error) {
            console.warn(`获取节点数据失败 ${nodeUuid}:`, error);
            return null;
        }
    }

    // 使用query-node-tree获取包含子节点的完整节点结构
    private async getNodeWithChildren(nodeUuid: string): Promise<any> {
        try {
            // 获取整个场景树
            const tree = await Editor.Message.request('scene', 'query-node-tree');
            if (!tree) {
                return null;
            }

            // 在树中查找指定的节点
            const targetNode = this.findNodeInTree(tree, nodeUuid);
            if (targetNode) {
                console.log(`在场景树中找到节点 ${nodeUuid}，子节点数量: ${targetNode.children ? targetNode.children.length : 0}`);

                // 增强节点树，获取每个节点的正确组件信息
                const enhancedTree = await this.enhanceTreeWithMCPComponents(targetNode);
                return enhancedTree;
            }

            return null;
        } catch (error) {
            console.warn(`获取节点树结构失败 ${nodeUuid}:`, error);
            return null;
        }
    }

    // 在节点树中递归查找指定UUID的节点
    private findNodeInTree(node: any, targetUuid: string): any {
        if (!node) return null;

        // 检查当前节点
        if (node.uuid === targetUuid || node.value?.uuid === targetUuid) {
            return node;
        }

        // 递归检查子节点
        if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
                const found = this.findNodeInTree(child, targetUuid);
                if (found) {
                    return found;
                }
            }
        }

        return null;
    }

    /**
     * 使用MCP接口增强节点树，获取正确的组件信息
     */
    private async enhanceTreeWithMCPComponents(node: any): Promise<any> {
        if (!node || !node.uuid) {
            return node;
        }

        try {
            // 使用MCP接口获取节点的组件信息
            const port = readSettings().port;
            const response = await fetch(`http://localhost:${port}/mcp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "tools/call",
                    "params": {
                        "name": "component_get_components",
                        "arguments": {
                            "nodeUuid": node.uuid
                        }
                    },
                    "id": Date.now()
                })
            });

            const mcpResult = await response.json();
            if (mcpResult.result?.content?.[0]?.text) {
                const componentData = JSON.parse(mcpResult.result.content[0].text);
                if (componentData.success && componentData.data.components) {
                    // 更新节点的组件信息为MCP返回的正确数据
                    node.components = componentData.data.components;
                    console.log(`节点 ${node.uuid} 获取到 ${componentData.data.components.length} 个组件，包含脚本组件的正确类型`);
                }
            }
        } catch (error) {
            console.warn(`获取节点 ${node.uuid} 的MCP组件信息失败:`, error);
        }

        // 递归处理子节点
        if (node.children && Array.isArray(node.children)) {
            for (let i = 0; i < node.children.length; i++) {
                node.children[i] = await this.enhanceTreeWithMCPComponents(node.children[i]);
            }
        }

        return node;
    }

    private async buildBasicNodeInfo(nodeUuid: string): Promise<any> {
        try {
            // 构建基本的节点信息
            const nodeInfo: any = await Editor.Message.request('scene', 'query-node', nodeUuid);
            if (!nodeInfo) {
                return null;
            }

            // 简化版本：只返回基本节点信息，不获取子节点和组件
            // 这些信息将在后续的预制体处理中根据需要添加
            const basicInfo = {
                ...nodeInfo,
                children: [],
                components: []
            };
            return basicInfo;
        } catch {
            return null;
        }
    }

    // 验证节点数据是否有效
    private isValidNodeData(nodeData: any): boolean {
        if (!nodeData) return false;
        if (typeof nodeData !== 'object') return false;

        // 检查基本属性 - 适配query-node-tree的数据格式
        return nodeData.hasOwnProperty('uuid') ||
               nodeData.hasOwnProperty('name') ||
               nodeData.hasOwnProperty('__type__') ||
               (nodeData.value && (
                   nodeData.value.hasOwnProperty('uuid') ||
                   nodeData.value.hasOwnProperty('name') ||
                   nodeData.value.hasOwnProperty('__type__')
               ));
    }

    // 提取子节点UUID的统一方法
    private extractChildUuid(childRef: any): string | null {
        if (!childRef) return null;

        // 方法1: 直接字符串
        if (typeof childRef === 'string') {
            return childRef;
        }

        // 方法2: value属性包含字符串
        if (childRef.value && typeof childRef.value === 'string') {
            return childRef.value;
        }

        // 方法3: value.uuid属性
        if (childRef.value && childRef.value.uuid) {
            return childRef.value.uuid;
        }

        // 方法4: 直接uuid属性
        if (childRef.uuid) {
            return childRef.uuid;
        }

        // 方法5: __id__引用 - 这种情况需要特殊处理
        if (childRef.__id__ !== undefined) {
            console.log(`发现__id__引用: ${childRef.__id__}，可能需要从数据结构中查找`);
            return null; // 暂时返回null，后续可以添加引用解析逻辑
        }

        console.warn('无法提取子节点UUID:', JSON.stringify(childRef));
        return null;
    }

    // 获取需要处理的子节点数据
    private getChildrenToProcess(nodeData: any): any[] {
        const children: any[] = [];

        // 方法1: 直接从children数组获取（从query-node-tree返回的数据）
        if (nodeData.children && Array.isArray(nodeData.children)) {
            console.log(`从children数组获取子节点，数量: ${nodeData.children.length}`);
            for (const child of nodeData.children) {
                // query-node-tree返回的子节点通常已经是完整的数据结构
                if (this.isValidNodeData(child)) {
                    children.push(child);
                    console.log(`添加子节点: ${child.name || child.value?.name || '未知'}`);
                } else {
                    console.log('子节点数据无效:', JSON.stringify(child, null, 2));
                }
            }
        } else {
            console.log('节点没有子节点或children数组为空');
        }

        return children;
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
        try {
            // 使用Editor API保存预制体文件
            const prefabContent = JSON.stringify(prefabData, null, 2);
            const metaContent = JSON.stringify(metaData, null, 2);

            // 尝试使用更可靠的保存方法
            await this.saveAssetFile(prefabPath, prefabContent);
            // 再创建meta文件
            const metaPath = `${prefabPath}.meta`;
            await this.saveAssetFile(metaPath, metaContent);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message || '保存预制体文件失败' };
        }
    }

    private async saveAssetFile(filePath: string, content: string): Promise<void> {
        // 尝试多种保存方法
        const methods = [
            () => Editor.Message.request('asset-db', 'create-asset', filePath, content),
            () => Editor.Message.request('asset-db', 'save-asset', filePath, content),
            () => Editor.Message.request('asset-db', 'write-asset', filePath, content)
        ];

        for (const method of methods) {
            try {
                await method();
                return;
            } catch {
                // try next method
            }
        }
        throw new Error('所有保存方法都失败了');
    }

    private async updatePrefab(prefabPath: string, nodeUuid: string): Promise<ToolResponse> {
        try {
            console.log(`开始更新预制体: prefabPath=${prefabPath}, nodeUuid=${nodeUuid}`);

            // 1. 首先验证节点是预制体实例
            const nodeInfo = await Editor.Message.request('scene', 'query-node', nodeUuid);
            if (!nodeInfo || !(nodeInfo as any).__prefab__) {
                return {
                    success: false,
                    error: '指定的节点不是预制体实例'
                };
            }

            const prefabInfo = (nodeInfo as any).__prefab__;
            console.log(`预制体实例信息:`, prefabInfo);

            // 2. 使用正确的 apply-prefab API 格式（基于编辑器日志）
            console.log('调用 scene.apply-prefab API...');
            const applyResult = await Editor.Message.request('scene', 'apply-prefab', [nodeUuid]);
            console.log('apply-prefab API 调用结果:', applyResult);

            // 3. 等待编辑器处理
            await new Promise(resolve => setTimeout(resolve, 200));

            // 4. 获取预制体资源信息并刷新
            try {
                const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', prefabPath);
                if (assetInfo && assetInfo.source) {
                    // 刷新特定的预制体资源
                    await this.refreshAssets(assetInfo.source);
                    console.log(`预制体资源已刷新: ${assetInfo.source}`);
                }
            } catch (assetError) {
                console.log('获取或刷新预制体资源失败:', assetError);
            }

            return {
                success: true,
                data: {
                    nodeUuid: nodeUuid,
                    prefabPath: prefabPath,
                    prefabAssetUuid: prefabInfo.asset,
                    message: '预制体实例的修改已成功应用到预制体资源',
                    applyResult: applyResult
                }
            };

        } catch (error: any) {
            console.error('更新预制体失败:', error);
            return {
                success: false,
                error: `更新预制体失败: ${error.message || error}`,
                instruction: '请确认节点是有效的预制体实例且存在未应用的修改'
            };
        }
    }

    private async revertPrefab(nodeUuid: string): Promise<ToolResponse> {
        try {
            // 先获取节点信息以确定预制体资源UUID
            const nodeInfo = await Editor.Message.request('scene', 'query-node', nodeUuid);
            if (!nodeInfo || !nodeInfo.__prefab__) {
                return {
                    success: false,
                    error: 'Node is not a prefab instance'
                };
            }

            const prefabAssetUuid = nodeInfo.__prefab__.uuid;

            // 使用正确的API: restore-prefab
            (Editor.Message.request as any)('scene', 'restore-prefab', nodeUuid, prefabAssetUuid);

            return {
                success: true,
                data: {
                    message: 'Prefab reverted',
                    nodeUuid: nodeUuid
                }
            };
        } catch (error) {
            return { success: false, error: `Failed to get node info: ${error}` };
        }
    }

    private async getPrefabInfo(prefabPath: string): Promise<ToolResponse> {
        try {
            const assetInfo: any = await Editor.Message.request('asset-db', 'query-asset-info', prefabPath);
            if (!assetInfo) {
                throw new Error('Prefab not found');
            }

            const metaInfo: any = await Editor.Message.request('asset-db', 'query-asset-meta', assetInfo.uuid);
            const info: PrefabInfo = {
                name: metaInfo.name,
                uuid: metaInfo.uuid,
                path: prefabPath,
                folder: prefabPath.substring(0, prefabPath.lastIndexOf('/')),
                createTime: metaInfo.createTime,
                modifyTime: metaInfo.modifyTime,
                dependencies: metaInfo.depends || []
            };
            return { success: true, data: info };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
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
        try {
            // 读取预制体文件内容
            const assetInfo: any = await Editor.Message.request('asset-db', 'query-asset-info', prefabPath);
            if (!assetInfo) {
                return {
                    success: false,
                    error: '预制体文件不存在'
                };
            }

            // 获取预制体文件的磁盘路径
            const diskPath: string | null = await Editor.Message.request('asset-db', 'query-path', prefabPath);
            if (!diskPath) {
                return {
                    success: false,
                    error: 'Cannot get prefab disk path'
                };
            }

            // 使用Node.js fs读取文件
            const fs = require('fs');
            try {
                const content = fs.readFileSync(diskPath, 'utf8');
                const prefabData = JSON.parse(content);
                const validationResult = this.validatePrefabFormat(prefabData);

                return {
                    success: true,
                    data: {
                        isValid: validationResult.isValid,
                        issues: validationResult.issues,
                        nodeCount: validationResult.nodeCount,
                        componentCount: validationResult.componentCount,
                        message: validationResult.isValid ? '预制体格式有效' : '预制体格式存在问题'
                    }
                };
            } catch (parseError) {
                return {
                    success: false,
                    error: '预制体文件格式错误，无法解析JSON'
                };
            }
        } catch (error: any) {
            return {
                success: false,
                error: `验证预制体时发生错误: ${error.message || error}`
            };
        }
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


    private async readPrefabContent(prefabPath: string): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            // 获取磁盘路径
            const diskPath: string | null = await Editor.Message.request('asset-db', 'query-path', prefabPath);
            if (!diskPath) {
                return { success: false, error: 'Cannot get prefab disk path' };
            }

            // 使用fs读取文件
            const fs = require('fs');
            try {
                const content = fs.readFileSync(diskPath, 'utf8');
                const prefabData = JSON.parse(content);
                return { success: true, data: prefabData };
            } catch (parseError) {
                return { success: false, error: '预制体文件格式错误' };
            }
        } catch (error: any) {
            return { success: false, error: error.message || '读取预制体文件失败' };
        }
    }


    /**
     * 使用 asset-db API 创建资源文件
     */
    /**
     * 使用 asset-db API 创建资源文件
     */
    private async createAssetWithAssetDB(assetPath: string, content: string): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const assetInfo: any = await Editor.Message.request('asset-db', 'create-asset', assetPath, content, {
                overwrite: true,
                rename: false
            });
            console.log('创建资源文件成功:', assetInfo);
            return { success: true, data: assetInfo };
        } catch (error: any) {
            console.error('创建资源文件失败:', error);
            return { success: false, error: error.message || '创建资源文件失败' };
        }
    }

    /**
     * 使用 asset-db API 创建 meta 文件
     */
    /**
     * 使用 asset-db API 创建 meta 文件
     */
    private async createMetaWithAssetDB(assetPath: string, metaContent: any): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const metaContentString = JSON.stringify(metaContent, null, 2);
            const assetInfo: any = await Editor.Message.request('asset-db', 'save-asset-meta', assetPath, metaContentString);
            console.log('创建meta文件成功:', assetInfo);
            return { success: true, data: assetInfo };
        } catch (error: any) {
            console.error('创建meta文件失败:', error);
            return { success: false, error: error.message || '创建meta文件失败' };
        }
    }

    /**
     * 使用 asset-db API 重新导入资源
     */
    /**
     * 使用 asset-db API 重新导入资源
     */
    private async reimportAssetWithAssetDB(assetPath: string): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const result: any = await Editor.Message.request('asset-db', 'reimport-asset', assetPath);
            console.log('重新导入资源成功:', result);
            return { success: true, data: result };
        } catch (error: any) {
            console.error('重新导入资源失败:', error);
            return { success: false, error: error.message || '重新导入资源失败' };
        }
    }

    /**
     * 使用 asset-db API 更新资源文件内容
     */
    /**
     * 使用 asset-db API 更新资源文件内容
     */
    private async updateAssetWithAssetDB(assetPath: string, content: string): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const result: any = await Editor.Message.request('asset-db', 'save-asset', assetPath, content);
            console.log('更新资源文件成功:', result);
            return { success: true, data: result };
        } catch (error: any) {
            console.error('更新资源文件失败:', error);
            return { success: false, error: error.message || '更新资源文件失败' };
        }
    }

    /**
     * 创建符合 Cocos Creator 标准的预制体内容
     * 完整实现递归节点树处理，匹配引擎标准格式
     */
    private async createStandardPrefabContent(nodeData: any, prefabName: string, prefabUuid: string, includeChildren: boolean, includeComponents: boolean): Promise<any[]> {
        console.log('开始创建引擎标准预制体内容...');

        const prefabData: any[] = [];
        let currentId = 0;

        // 1. 创建预制体资产对象 (index 0)
        const prefabAsset = {
            "__type__": "cc.Prefab",
            "_name": prefabName || "", // 确保预制体名称不为空
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

        // 2. 递归创建完整的节点树结构
        const context = {
            prefabData,
            currentId: currentId + 1, // 根节点占用索引1，子节点从索引2开始
            prefabAssetIndex: 0,
            nodeFileIds: new Map<string, string>(), // 存储节点ID到fileId的映射
            nodeUuidToIndex: new Map<string, number>(), // 存储节点UUID到索引的映射
            componentUuidToIndex: new Map<string, number>() // 存储组件UUID到索引的映射
        };

        // 创建根节点和整个节点树 - 注意：根节点的父节点应该是null，不是预制体对象
        await this.createCompleteNodeTree(nodeData, null, 1, context, includeChildren, includeComponents, prefabName);

        console.log(`预制体内容创建完成，总共 ${prefabData.length} 个对象`);
        console.log('节点fileId映射:', Array.from(context.nodeFileIds.entries()));

        return prefabData;
    }

    /**
     * 递归创建完整的节点树，包括所有子节点和对应的PrefabInfo
     */
    private async createCompleteNodeTree(
        nodeData: any,
        parentNodeIndex: number | null,
        nodeIndex: number,
        context: {
            prefabData: any[],
            currentId: number,
            prefabAssetIndex: number,
            nodeFileIds: Map<string, string>,
            nodeUuidToIndex: Map<string, number>,
            componentUuidToIndex: Map<string, number>
        },
        includeChildren: boolean,
        includeComponents: boolean,
        nodeName?: string
    ): Promise<void> {
        const { prefabData } = context;

        // 创建节点对象
        const node = this.createEngineStandardNode(nodeData, parentNodeIndex, nodeName);

        // 确保节点在指定的索引位置
        while (prefabData.length <= nodeIndex) {
            prefabData.push(null);
        }
        console.log(`设置节点到索引 ${nodeIndex}: ${node._name}, _parent:`, node._parent, `_children count: ${node._children.length}`);
        prefabData[nodeIndex] = node;

        // 为当前节点生成fileId并记录UUID到索引的映射
        const nodeUuid = this.extractNodeUuid(nodeData);
        const fileId = nodeUuid || this.generateFileId();
        context.nodeFileIds.set(nodeIndex.toString(), fileId);

        // 记录节点UUID到索引的映射
        if (nodeUuid) {
            context.nodeUuidToIndex.set(nodeUuid, nodeIndex);
            console.log(`记录节点UUID映射: ${nodeUuid} -> ${nodeIndex}`);
        }

        // 先处理子节点（保持与手动创建的索引顺序一致）
        const childrenToProcess = this.getChildrenToProcess(nodeData);
        if (includeChildren && childrenToProcess.length > 0) {
            console.log(`处理节点 ${node._name} 的 ${childrenToProcess.length} 个子节点`);

            // 为每个子节点分配索引
            const childIndices: number[] = [];
            console.log(`准备为 ${childrenToProcess.length} 个子节点分配索引，当前ID: ${context.currentId}`);
            for (let i = 0; i < childrenToProcess.length; i++) {
                console.log(`处理第 ${i+1} 个子节点，当前currentId: ${context.currentId}`);
                const childIndex = context.currentId++;
                childIndices.push(childIndex);
                node._children.push({ "__id__": childIndex });
                console.log(`✅ 添加子节点引用到 ${node._name}: {__id__: ${childIndex}}`);
            }
            console.log(`✅ 节点 ${node._name} 最终的子节点数组:`, node._children);

            // 递归创建子节点
            for (let i = 0; i < childrenToProcess.length; i++) {
                const childData = childrenToProcess[i];
                const childIndex = childIndices[i];
                await this.createCompleteNodeTree(
                    childData,
                    nodeIndex,
                    childIndex,
                    context,
                    includeChildren,
                    includeComponents,
                    childData.name || `Child${i+1}`
                );
            }
        }

        // 然后处理组件
        if (includeComponents && nodeData.components && Array.isArray(nodeData.components)) {
            console.log(`处理节点 ${node._name} 的 ${nodeData.components.length} 个组件`);

            const componentIndices: number[] = [];
            for (const component of nodeData.components) {
                const componentIndex = context.currentId++;
                componentIndices.push(componentIndex);
                node._components.push({ "__id__": componentIndex });

                // 记录组件UUID到索引的映射
                const componentUuid = component.uuid || (component.value && component.value.uuid);
                if (componentUuid) {
                    context.componentUuidToIndex.set(componentUuid, componentIndex);
                    console.log(`记录组件UUID映射: ${componentUuid} -> ${componentIndex}`);
                }

                // 创建组件对象，传入context以处理引用
                const componentObj = this.createComponentObject(component, nodeIndex, context);
                prefabData[componentIndex] = componentObj;

                // 为组件创建 CompPrefabInfo
                const compPrefabInfoIndex = context.currentId++;
                prefabData[compPrefabInfoIndex] = {
                    "__type__": "cc.CompPrefabInfo",
                    "fileId": this.generateFileId()
                };

                // 如果组件对象有 __prefab 属性，设置引用
                if (componentObj && typeof componentObj === 'object') {
                    componentObj.__prefab = { "__id__": compPrefabInfoIndex };
                }
            }

            console.log(`✅ 节点 ${node._name} 添加了 ${componentIndices.length} 个组件`);
        }


        // 为当前节点创建PrefabInfo
        const prefabInfoIndex = context.currentId++;
        node._prefab = { "__id__": prefabInfoIndex };

        const prefabInfo: any = {
            "__type__": "cc.PrefabInfo",
            "root": { "__id__": 1 },
            "asset": { "__id__": context.prefabAssetIndex },
            "fileId": fileId,
            "targetOverrides": null,
            "nestedPrefabInstanceRoots": null
        };

        // 根节点的特殊处理
        if (nodeIndex === 1) {
            // 根节点没有instance，但可能有targetOverrides
            prefabInfo.instance = null;
        } else {
            // 子节点通常有instance为null
            prefabInfo.instance = null;
        }

        prefabData[prefabInfoIndex] = prefabInfo;
        context.currentId = prefabInfoIndex + 1;
    }

    /**
     * 将UUID转换为Cocos Creator的压缩格式
     * 基于真实Cocos Creator编辑器的压缩算法实现
     * 前5个hex字符保持不变，剩余27个字符压缩成18个字符
     */
    private uuidToCompressedId(uuid: string): string {
        const BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        // 移除连字符并转为小写
        const cleanUuid = uuid.replace(/-/g, '').toLowerCase();

        // 确保UUID有效
        if (cleanUuid.length !== 32) {
            return uuid; // 如果不是有效的UUID，返回原始值
        }

        // Cocos Creator的压缩算法：前5个字符保持不变，剩余27个字符压缩成18个字符
        let result = cleanUuid.substring(0, 5);

        // 剩余27个字符需要压缩成18个字符
        const remainder = cleanUuid.substring(5);

        // 每3个hex字符压缩成2个字符
        for (let i = 0; i < remainder.length; i += 3) {
            const hex1 = remainder[i] || '0';
            const hex2 = remainder[i + 1] || '0';
            const hex3 = remainder[i + 2] || '0';

            // 将3个hex字符(12位)转换为2个base64字符
            const value = parseInt(hex1 + hex2 + hex3, 16);

            // 12位分成两个6位
            const high6 = (value >> 6) & 63;
            const low6 = value & 63;

            result += BASE64_KEYS[high6] + BASE64_KEYS[low6];
        }

        return result;
    }

    /**
     * 创建组件对象
     */
    private createComponentObject(componentData: any, nodeIndex: number, context?: {
        nodeUuidToIndex?: Map<string, number>,
        componentUuidToIndex?: Map<string, number>
    }): any {
        let componentType = componentData.type || componentData.__type__ || 'cc.Component';
        const enabled = componentData.enabled !== undefined ? componentData.enabled : true;

        // console.log(`创建组件对象 - 原始类型: ${componentType}`);
        // console.log('组件完整数据:', JSON.stringify(componentData, null, 2));

        // 处理脚本组件 - MCP接口已经返回正确的压缩UUID格式
        if (componentType && !componentType.startsWith('cc.')) {
            console.log(`使用脚本组件压缩UUID类型: ${componentType}`);
        }

        // 基础组件结构
        const component: any = {
            "__type__": componentType,
            "_name": "",
            "_objFlags": 0,
            "__editorExtras__": {},
            "node": { "__id__": nodeIndex },
            "_enabled": enabled
        };

        // 提前设置 __prefab 属性占位符，后续会被正确设置
        component.__prefab = null;

        // 根据组件类型添加特定属性
        if (componentType === 'cc.UITransform') {
            const contentSize = componentData.properties?.contentSize?.value || { width: 100, height: 100 };
            const anchorPoint = componentData.properties?.anchorPoint?.value || { x: 0.5, y: 0.5 };

            component._contentSize = {
                "__type__": "cc.Size",
                "width": contentSize.width,
                "height": contentSize.height
            };
            component._anchorPoint = {
                "__type__": "cc.Vec2",
                "x": anchorPoint.x,
                "y": anchorPoint.y
            };
        } else if (componentType === 'cc.Sprite') {
            // 处理Sprite组件的spriteFrame引用
            const spriteFrameProp = componentData.properties?._spriteFrame || componentData.properties?.spriteFrame;
            if (spriteFrameProp) {
                component._spriteFrame = this.processComponentProperty(spriteFrameProp, context);
            } else {
                component._spriteFrame = null;
            }

            component._type = componentData.properties?._type?.value ?? 0;
            component._fillType = componentData.properties?._fillType?.value ?? 0;
            component._sizeMode = componentData.properties?._sizeMode?.value ?? 1;
            component._fillCenter = { "__type__": "cc.Vec2", "x": 0, "y": 0 };
            component._fillStart = componentData.properties?._fillStart?.value ?? 0;
            component._fillRange = componentData.properties?._fillRange?.value ?? 0;
            component._isTrimmedMode = componentData.properties?._isTrimmedMode?.value ?? true;
            component._useGrayscale = componentData.properties?._useGrayscale?.value ?? false;

            // 调试：打印Sprite组件的所有属性（已注释）
            // console.log('Sprite组件属性:', JSON.stringify(componentData.properties, null, 2));
            component._atlas = null;
            component._id = "";
        } else if (componentType === 'cc.Button') {
            component._interactable = true;
            component._transition = 3;
            component._normalColor = { "__type__": "cc.Color", "r": 255, "g": 255, "b": 255, "a": 255 };
            component._hoverColor = { "__type__": "cc.Color", "r": 211, "g": 211, "b": 211, "a": 255 };
            component._pressedColor = { "__type__": "cc.Color", "r": 255, "g": 255, "b": 255, "a": 255 };
            component._disabledColor = { "__type__": "cc.Color", "r": 124, "g": 124, "b": 124, "a": 255 };
            component._normalSprite = null;
            component._hoverSprite = null;
            component._pressedSprite = null;
            component._disabledSprite = null;
            component._duration = 0.1;
            component._zoomScale = 1.2;
            // 处理Button的target引用
            const targetProp = componentData.properties?._target || componentData.properties?.target;
            if (targetProp) {
                component._target = this.processComponentProperty(targetProp, context);
            } else {
                component._target = { "__id__": nodeIndex }; // 默认指向自身节点
            }
            component._clickEvents = [];
            component._id = "";
        } else if (componentType === 'cc.Label') {
            component._string = componentData.properties?._string?.value || "Label";
            component._horizontalAlign = 1;
            component._verticalAlign = 1;
            component._actualFontSize = 20;
            component._fontSize = 20;
            component._fontFamily = "Arial";
            component._lineHeight = 25;
            component._overflow = 0;
            component._enableWrapText = true;
            component._font = null;
            component._isSystemFontUsed = true;
            component._spacingX = 0;
            component._isItalic = false;
            component._isBold = false;
            component._isUnderline = false;
            component._underlineHeight = 2;
            component._cacheMode = 0;
            component._id = "";
        } else if (componentData.properties) {
            // 处理所有组件的属性（包括内置组件和自定义脚本组件）
            for (const [key, value] of Object.entries(componentData.properties)) {
                if (key === 'node' || key === 'enabled' || key === '__type__' ||
                    key === 'uuid' || key === 'name' || key === '__scriptAsset' || key === '_objFlags') {
                    continue; // 跳过这些特殊属性，包括_objFlags
                }

                // 对于以下划线开头的属性，需要特殊处理
                if (key.startsWith('_')) {
                    // 确保属性名保持原样（包括下划线）
                    const propValue = this.processComponentProperty(value, context);
                    if (propValue !== undefined) {
                        component[key] = propValue;
                    }
                } else {
                    // 非下划线开头的属性正常处理
                    const propValue = this.processComponentProperty(value, context);
                    if (propValue !== undefined) {
                        component[key] = propValue;
                    }
                }
            }
        }

        // 确保 _id 在最后位置
        const _id = component._id || "";
        delete component._id;
        component._id = _id;

        return component;
    }

    /**
     * 处理组件属性值，确保格式与手动创建的预制体一致
     */
    private processComponentProperty(propData: any, context?: {
        nodeUuidToIndex?: Map<string, number>,
        componentUuidToIndex?: Map<string, number>
    }): any {
        if (!propData || typeof propData !== 'object') {
            return propData;
        }

        const value = propData.value;
        const type = propData.type;

        // 处理null值
        if (value === null || value === undefined) {
            return null;
        }

        // 处理空UUID对象，转换为null
        if (value && typeof value === 'object' && value.uuid === '') {
            return null;
        }

        // 处理节点引用
        if (type === 'cc.Node' && value?.uuid) {
            // 在预制体中，节点引用需要转换为 __id__ 形式
            if (context?.nodeUuidToIndex && context.nodeUuidToIndex.has(value.uuid)) {
                // 内部引用：转换为__id__格式
                return {
                    "__id__": context.nodeUuidToIndex.get(value.uuid)
                };
            }
            // 外部引用：设置为null，因为外部节点不属于预制体结构
            console.warn(`Node reference UUID ${value.uuid} not found in prefab context, setting to null (external reference)`);
            return null;
        }

        // 处理资源引用（预制体、纹理、精灵帧等）
        if (value?.uuid && (
            type === 'cc.Prefab' ||
            type === 'cc.Texture2D' ||
            type === 'cc.SpriteFrame' ||
            type === 'cc.Material' ||
            type === 'cc.AnimationClip' ||
            type === 'cc.AudioClip' ||
            type === 'cc.Font' ||
            type === 'cc.Asset'
        )) {
            // 对于预制体引用，保持原始UUID格式
            const uuidToUse = type === 'cc.Prefab' ? value.uuid : this.uuidToCompressedId(value.uuid);
            return {
                "__uuid__": uuidToUse,
                "__expectedType__": type
            };
        }

        // 处理组件引用（包括具体的组件类型如cc.Label, cc.Button等）
        if (value?.uuid && (type === 'cc.Component' ||
            type === 'cc.Label' || type === 'cc.Button' || type === 'cc.Sprite' ||
            type === 'cc.UITransform' || type === 'cc.RigidBody2D' ||
            type === 'cc.BoxCollider2D' || type === 'cc.Animation' ||
            type === 'cc.AudioSource' || (type?.startsWith('cc.') && !type.includes('@')))) {
            // 在预制体中，组件引用也需要转换为 __id__ 形式
            if (context?.componentUuidToIndex && context.componentUuidToIndex.has(value.uuid)) {
                // 内部引用：转换为__id__格式
                console.log(`Component reference ${type} UUID ${value.uuid} found in prefab context, converting to __id__`);
                return {
                    "__id__": context.componentUuidToIndex.get(value.uuid)
                };
            }
            // 外部引用：设置为null，因为外部组件不属于预制体结构
            console.warn(`Component reference ${type} UUID ${value.uuid} not found in prefab context, setting to null (external reference)`);
            return null;
        }

        // 处理复杂类型，添加__type__标记
        if (value && typeof value === 'object') {
            if (type === 'cc.Color') {
                return {
                    "__type__": "cc.Color",
                    "r": Math.min(255, Math.max(0, Number(value.r) || 0)),
                    "g": Math.min(255, Math.max(0, Number(value.g) || 0)),
                    "b": Math.min(255, Math.max(0, Number(value.b) || 0)),
                    "a": value.a !== undefined ? Math.min(255, Math.max(0, Number(value.a))) : 255
                };
            } else if (type === 'cc.Vec3') {
                return {
                    "__type__": "cc.Vec3",
                    "x": Number(value.x) || 0,
                    "y": Number(value.y) || 0,
                    "z": Number(value.z) || 0
                };
            } else if (type === 'cc.Vec2') {
                return {
                    "__type__": "cc.Vec2",
                    "x": Number(value.x) || 0,
                    "y": Number(value.y) || 0
                };
            } else if (type === 'cc.Size') {
                return {
                    "__type__": "cc.Size",
                    "width": Number(value.width) || 0,
                    "height": Number(value.height) || 0
                };
            } else if (type === 'cc.Quat') {
                return {
                    "__type__": "cc.Quat",
                    "x": Number(value.x) || 0,
                    "y": Number(value.y) || 0,
                    "z": Number(value.z) || 0,
                    "w": value.w !== undefined ? Number(value.w) : 1
                };
            }
        }

        // 处理数组类型
        if (Array.isArray(value)) {
            // 节点数组
            if (propData.elementTypeData?.type === 'cc.Node') {
                return value.map(item => {
                    if (item?.uuid && context?.nodeUuidToIndex?.has(item.uuid)) {
                        return { "__id__": context.nodeUuidToIndex.get(item.uuid) };
                    }
                    return null;
                }).filter(item => item !== null);
            }

            // 资源数组
            if (propData.elementTypeData?.type && propData.elementTypeData.type.startsWith('cc.')) {
                return value.map(item => {
                    if (item?.uuid) {
                        return {
                            "__uuid__": this.uuidToCompressedId(item.uuid),
                            "__expectedType__": propData.elementTypeData.type
                        };
                    }
                    return null;
                }).filter(item => item !== null);
            }

            // 基础类型数组
            return value.map(item => item?.value !== undefined ? item.value : item);
        }

        // 其他复杂对象类型，保持原样但确保有__type__标记
        if (value && typeof value === 'object' && type && type.startsWith('cc.')) {
            return {
                "__type__": type,
                ...value
            };
        }

        return value;
    }

    /**
     * 创建符合引擎标准的节点对象
     */
    private createEngineStandardNode(nodeData: any, parentNodeIndex: number | null, nodeName?: string): any {
        // 调试：打印原始节点数据（已注释）
        // console.log('原始节点数据:', JSON.stringify(nodeData, null, 2));

        // 提取节点的基本属性
        const getValue = (prop: any) => {
            if (prop?.value !== undefined) return prop.value;
            if (prop !== undefined) return prop;
            return null;
        };

        const position = getValue(nodeData.position) || getValue(nodeData.value?.position) || { x: 0, y: 0, z: 0 };
        const rotation = getValue(nodeData.rotation) || getValue(nodeData.value?.rotation) || { x: 0, y: 0, z: 0, w: 1 };
        const scale = getValue(nodeData.scale) || getValue(nodeData.value?.scale) || { x: 1, y: 1, z: 1 };
        const active = getValue(nodeData.active) ?? getValue(nodeData.value?.active) ?? true;
        const name = nodeName || getValue(nodeData.name) || getValue(nodeData.value?.name) || 'Node';
        const layer = getValue(nodeData.layer) || getValue(nodeData.value?.layer) || 1073741824;

        // 调试输出
        console.log(`创建节点: ${name}, parentNodeIndex: ${parentNodeIndex}`);

        const parentRef = parentNodeIndex !== null ? { "__id__": parentNodeIndex } : null;
        console.log(`节点 ${name} 的父节点引用:`, parentRef);

        return {
            "__type__": "cc.Node",
            "_name": name,
            "_objFlags": 0,
            "__editorExtras__": {},
            "_parent": parentRef,
            "_children": [], // 子节点引用将在递归过程中动态添加
            "_active": active,
            "_components": [], // 组件引用将在处理组件时动态添加
            "_prefab": { "__id__": 0 }, // 临时值，后续会被正确设置
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
    }

    /**
     * 从节点数据中提取UUID
     */
    private extractNodeUuid(nodeData: any): string | null {
        if (!nodeData) return null;

        // 尝试多种方式获取UUID
        const sources = [
            nodeData.uuid,
            nodeData.value?.uuid,
            nodeData.__uuid__,
            nodeData.value?.__uuid__,
            nodeData.id,
            nodeData.value?.id
        ];

        for (const source of sources) {
            if (typeof source === 'string' && source.length > 0) {
                return source;
            }
        }

        return null;
    }

    /**
     * 创建最小化的节点对象，不包含任何组件以避免依赖问题
     */
    private createMinimalNode(nodeData: any, nodeName?: string): any {
        // 提取节点的基本属性
        const getValue = (prop: any) => {
            if (prop?.value !== undefined) return prop.value;
            if (prop !== undefined) return prop;
            return null;
        };

        const position = getValue(nodeData.position) || getValue(nodeData.value?.position) || { x: 0, y: 0, z: 0 };
        const rotation = getValue(nodeData.rotation) || getValue(nodeData.value?.rotation) || { x: 0, y: 0, z: 0, w: 1 };
        const scale = getValue(nodeData.scale) || getValue(nodeData.value?.scale) || { x: 1, y: 1, z: 1 };
        const active = getValue(nodeData.active) ?? getValue(nodeData.value?.active) ?? true;
        const name = nodeName || getValue(nodeData.name) || getValue(nodeData.value?.name) || 'Node';
        const layer = getValue(nodeData.layer) || getValue(nodeData.value?.layer) || 33554432;

        return {
            "__type__": "cc.Node",
            "_name": name,
            "_objFlags": 0,
            "_parent": null,
            "_children": [],
            "_active": active,
            "_components": [], // 空的组件数组，避免组件依赖问题
            "_prefab": {
                "__id__": 2
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
            "_layer": layer,
            "_euler": {
                "__type__": "cc.Vec3",
                "x": 0,
                "y": 0,
                "z": 0
            },
            "_id": ""
        };
    }

    /**
     * 创建标准的 meta 文件内容
     */
    private createStandardMetaContent(prefabName: string, prefabUuid: string): any {
        return {
            "ver": "2.0.3",
            "importer": "prefab",
            "imported": true,
            "uuid": prefabUuid,
            "files": [
                ".json"
            ],
            "subMetas": {},
            "userData": {
                "syncNodeName": prefabName,
                "hasIcon": false
            }
        };
    }

    /**
     * 尝试将原始节点转换为预制体实例
     */
    /**
     * 尝试将原始节点转换为预制体实例
     */
    private async convertNodeToPrefabInstance(nodeUuid: string, prefabUuid: string, prefabPath: string): Promise<{ success: boolean; error?: string }> {
        // 这个功能需要深入的场景编辑器集成，暂时返回失败
        // 在实际的引擎中，这涉及到复杂的预制体实例化和节点替换逻辑
        console.log('节点转换为预制体实例的功能需要更深入的引擎集成');
        return {
            success: false,
            error: '节点转换为预制体实例需要更深入的引擎集成支持'
        };
    }

    private async restorePrefabNode(nodeUuid: string, assetUuid: string): Promise<ToolResponse> {
        try {
            // 使用官方API restore-prefab 还原预制体节点
            await (Editor.Message.request as any)('scene', 'restore-prefab', nodeUuid, assetUuid);
            return {
                success: true,
                data: {
                    nodeUuid: nodeUuid,
                    assetUuid: assetUuid,
                    message: '预制体节点还原成功'
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: `预制体节点还原失败: ${error.message}`
            };
        }
    }

    // 基于官方预制体格式的新实现方法
    // 基于官方预制体格式的新实现方法
    private async getNodeDataForPrefab(nodeUuid: string): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const nodeData: any = await Editor.Message.request('scene', 'query-node', nodeUuid);
            if (!nodeData) {
                return { success: false, error: '节点不存在' };
            }
            return { success: true, data: nodeData };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
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

        // 添加根节点的 PrefabInfo - 修复asset引用使用UUID
        const rootPrefabInfo = {
            "__type__": "cc.PrefabInfo",
            "root": {
                "__id__": 1
            },
            "asset": {
                "__uuid__": prefabUuid
            },
            "fileId": this.generateFileId(),
            "instance": null,
            "targetOverrides": [],
            "nestedPrefabInstanceRoots": []
        };
        prefabData.push(rootPrefabInfo);

        return prefabData;
    }


    private async createNodeObject(nodeData: any, parentId: number | null, prefabData: any[], currentId: number): Promise<{ node: any; nextId: number }> {
        const nodeId = currentId++;

        // 提取节点的基本属性 - 适配query-node-tree的数据格式
        const getValue = (prop: any) => {
            if (prop?.value !== undefined) return prop.value;
            if (prop !== undefined) return prop;
            return null;
        };

        const position = getValue(nodeData.position) || getValue(nodeData.value?.position) || { x: 0, y: 0, z: 0 };
        const rotation = getValue(nodeData.rotation) || getValue(nodeData.value?.rotation) || { x: 0, y: 0, z: 0, w: 1 };
        const scale = getValue(nodeData.scale) || getValue(nodeData.value?.scale) || { x: 1, y: 1, z: 1 };
        const active = getValue(nodeData.active) ?? getValue(nodeData.value?.active) ?? true;
        const name = getValue(nodeData.name) || getValue(nodeData.value?.name) || 'Node';
        const layer = getValue(nodeData.layer) || getValue(nodeData.value?.layer) || 33554432;

        const node: any = {
            "__type__": "cc.Node",
            "_name": name,
            "_objFlags": 0,
            "__editorExtras__": {},
            "_parent": parentId !== null ? { "__id__": parentId } : null,
            "_children": [],
            "_active": active,
            "_components": [],
            "_prefab": parentId === null ? {
                "__id__": currentId++
            } : null,
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

        // 暂时跳过UITransform组件以避免_getDependComponent错误
        // 后续通过Engine API动态添加
        console.log(`节点 ${name} 暂时跳过UITransform组件，避免引擎依赖错误`);

        // 处理其他组件（暂时跳过，专注于修复UITransform问题）
        const components = this.extractComponentsFromNode(nodeData);
        if (components.length > 0) {
            console.log(`节点 ${name} 包含 ${components.length} 个其他组件，暂时跳过以专注于UITransform修复`);
        }

        // 处理子节点 - 使用query-node-tree获取的完整结构
        const childrenToProcess = this.getChildrenToProcess(nodeData);
        if (childrenToProcess.length > 0) {
            console.log(`=== 处理子节点 ===`);
            console.log(`节点 ${name} 包含 ${childrenToProcess.length} 个子节点`);

            for (let i = 0; i < childrenToProcess.length; i++) {
                const childData = childrenToProcess[i];
                const childName = childData.name || childData.value?.name || '未知';
                console.log(`处理第${i + 1}个子节点: ${childName}`);

                try {
                    const childId = currentId;
                    node._children.push({ "__id__": childId });

                    // 递归创建子节点
                    const childResult = await this.createNodeObject(childData, nodeId, prefabData, currentId);
                    prefabData.push(childResult.node);
                    currentId = childResult.nextId;

                    // 子节点不需要PrefabInfo，只有根节点需要
                    // 子节点的_prefab应该设置为null
                    childResult.node._prefab = null;

                    console.log(`✅ 成功添加子节点: ${childName}`);
                } catch (error) {
                    console.error(`处理子节点 ${childName} 时出错:`, error);
                }
            }
        }

        return { node, nextId: currentId };
    }

    // 从节点数据中提取组件信息
    private extractComponentsFromNode(nodeData: any): any[] {
        const components: any[] = [];

        // 从不同位置尝试获取组件数据
        const componentSources = [
            nodeData.__comps__,
            nodeData.components,
            nodeData.value?.__comps__,
            nodeData.value?.components
        ];

        for (const source of componentSources) {
            if (Array.isArray(source)) {
                components.push(...source.filter(comp => comp && (comp.__type__ || comp.type)));
                break; // 找到有效的组件数组就退出
            }
        }

        return components;
    }

    // 创建标准的组件对象
    private createStandardComponentObject(componentData: any, nodeId: number, prefabInfoId: number): any {
        const componentType = componentData.__type__ || componentData.type;

        if (!componentType) {
            console.warn('组件缺少类型信息:', componentData);
            return null;
        }

        // 基础组件结构 - 基于官方预制体格式
        const component: any = {
            "__type__": componentType,
            "_name": "",
            "_objFlags": 0,
            "node": {
                "__id__": nodeId
            },
            "_enabled": this.getComponentPropertyValue(componentData, 'enabled', true),
            "__prefab": {
                "__id__": prefabInfoId
            }
        };

        // 根据组件类型添加特定属性
        this.addComponentSpecificProperties(component, componentData, componentType);

        // 添加_id属性
        component._id = "";

        return component;
    }

    // 添加组件特定的属性
    private addComponentSpecificProperties(component: any, componentData: any, componentType: string): void {
        switch (componentType) {
            case 'cc.UITransform':
                this.addUITransformProperties(component, componentData);
                break;
            case 'cc.Sprite':
                this.addSpriteProperties(component, componentData);
                break;
            case 'cc.Label':
                this.addLabelProperties(component, componentData);
                break;
            case 'cc.Button':
                this.addButtonProperties(component, componentData);
                break;
            default:
                // 对于未知类型的组件，复制所有安全的属性
                this.addGenericProperties(component, componentData);
                break;
        }
    }

    // UITransform组件属性
    private addUITransformProperties(component: any, componentData: any): void {
        component._contentSize = this.createSizeObject(
            this.getComponentPropertyValue(componentData, 'contentSize', { width: 100, height: 100 })
        );
        component._anchorPoint = this.createVec2Object(
            this.getComponentPropertyValue(componentData, 'anchorPoint', { x: 0.5, y: 0.5 })
        );
    }

    // Sprite组件属性
    private addSpriteProperties(component: any, componentData: any): void {
        component._visFlags = 0;
        component._customMaterial = null;
        component._srcBlendFactor = 2;
        component._dstBlendFactor = 4;
        component._color = this.createColorObject(
            this.getComponentPropertyValue(componentData, 'color', { r: 255, g: 255, b: 255, a: 255 })
        );
        component._spriteFrame = this.getComponentPropertyValue(componentData, 'spriteFrame', null);
        component._type = this.getComponentPropertyValue(componentData, 'type', 0);
        component._fillType = 0;
        component._sizeMode = this.getComponentPropertyValue(componentData, 'sizeMode', 1);
        component._fillCenter = this.createVec2Object({ x: 0, y: 0 });
        component._fillStart = 0;
        component._fillRange = 0;
        component._isTrimmedMode = true;
        component._useGrayscale = false;
        component._atlas = null;
    }

    // Label组件属性
    private addLabelProperties(component: any, componentData: any): void {
        component._visFlags = 0;
        component._customMaterial = null;
        component._srcBlendFactor = 2;
        component._dstBlendFactor = 4;
        component._color = this.createColorObject(
            this.getComponentPropertyValue(componentData, 'color', { r: 0, g: 0, b: 0, a: 255 })
        );
        component._string = this.getComponentPropertyValue(componentData, 'string', 'Label');
        component._horizontalAlign = 1;
        component._verticalAlign = 1;
        component._actualFontSize = 20;
        component._fontSize = this.getComponentPropertyValue(componentData, 'fontSize', 20);
        component._fontFamily = 'Arial';
        component._lineHeight = 40;
        component._overflow = 1;
        component._enableWrapText = false;
        component._font = null;
        component._isSystemFontUsed = true;
        component._isItalic = false;
        component._isBold = false;
        component._isUnderline = false;
        component._underlineHeight = 2;
        component._cacheMode = 0;
    }

    // Button组件属性
    private addButtonProperties(component: any, componentData: any): void {
        component.clickEvents = [];
        component._interactable = true;
        component._transition = 2;
        component._normalColor = this.createColorObject({ r: 214, g: 214, b: 214, a: 255 });
        component._hoverColor = this.createColorObject({ r: 211, g: 211, b: 211, a: 255 });
        component._pressedColor = this.createColorObject({ r: 255, g: 255, b: 255, a: 255 });
        component._disabledColor = this.createColorObject({ r: 124, g: 124, b: 124, a: 255 });
        component._duration = 0.1;
        component._zoomScale = 1.2;
    }

    // 添加通用属性
    private addGenericProperties(component: any, componentData: any): void {
        // 只复制安全的、已知的属性
        const safeProperties = ['enabled', 'color', 'string', 'fontSize', 'spriteFrame', 'type', 'sizeMode'];

        for (const prop of safeProperties) {
            if (componentData.hasOwnProperty(prop)) {
                const value = this.getComponentPropertyValue(componentData, prop);
                if (value !== undefined) {
                    component[`_${prop}`] = value;
                }
            }
        }
    }

    // 创建Vec2对象
    private createVec2Object(data: any): any {
        return {
            "__type__": "cc.Vec2",
            "x": data?.x || 0,
            "y": data?.y || 0
        };
    }

    // 创建Vec3对象
    private createVec3Object(data: any): any {
        return {
            "__type__": "cc.Vec3",
            "x": data?.x || 0,
            "y": data?.y || 0,
            "z": data?.z || 0
        };
    }

    // 创建Size对象
    private createSizeObject(data: any): any {
        return {
            "__type__": "cc.Size",
            "width": data?.width || 100,
            "height": data?.height || 100
        };
    }

    // 创建Color对象
    private createColorObject(data: any): any {
        return {
            "__type__": "cc.Color",
            "r": data?.r ?? 255,
            "g": data?.g ?? 255,
            "b": data?.b ?? 255,
            "a": data?.a ?? 255
        };
    }

    // 判断是否应该复制组件属性
    private shouldCopyComponentProperty(key: string, value: any): boolean {
        // 跳过内部属性和已处理的属性
        if (key.startsWith('__') || key === '_enabled' || key === 'node' || key === 'enabled') {
            return false;
        }

        // 跳过函数和undefined值
        if (typeof value === 'function' || value === undefined) {
            return false;
        }

        return true;
    }


    // 获取组件属性值 - 重命名以避免冲突
    private getComponentPropertyValue(componentData: any, propertyName: string, defaultValue?: any): any {
        // 尝试直接获取属性
        if (componentData[propertyName] !== undefined) {
            return this.extractValue(componentData[propertyName]);
        }

        // 尝试从value属性中获取
        if (componentData.value && componentData.value[propertyName] !== undefined) {
            return this.extractValue(componentData.value[propertyName]);
        }

        // 尝试带下划线前缀的属性名
        const prefixedName = `_${propertyName}`;
        if (componentData[prefixedName] !== undefined) {
            return this.extractValue(componentData[prefixedName]);
        }

        return defaultValue;
    }

    // 提取属性值
    private extractValue(data: any): any {
        if (data === null || data === undefined) {
            return data;
        }

        // 如果有value属性，优先使用value
        if (typeof data === 'object' && data.hasOwnProperty('value')) {
            return data.value;
        }

        // 如果是引用对象，保持原样
        if (typeof data === 'object' && (data.__id__ !== undefined || data.__uuid__ !== undefined)) {
            return data;
        }

        return data;
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
            await Editor.Message.request('asset-db', 'create-asset', finalPrefabPath, prefabContent);

            // 创建meta文件
            await Editor.Message.request('asset-db', 'create-asset', metaPath, metaContent);

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

    // 解除预制体链接，将预制体实例转换为普通节点
    // 解除预制体链接，将预制体实例转换为普通节点
    private async unlinkPrefab(nodeUuid: string): Promise<ToolResponse> {
        try {
            console.log(`开始解除预制体链接: ${nodeUuid}`);

            // 使用 Editor.Message.request 调用场景 API 的 unlink-prefab 方法
            console.log('尝试解除预制体链接，参数: [nodeUuid, true]');
            try {
                const result: any = await Editor.Message.request('scene', 'unlink-prefab', [
                    nodeUuid,
                    true
                ]);
                console.log('解除预制体链接API调用完成，返回值:', result);

                // 等待一小段时间让编辑器处理变化
                await new Promise(resolve => setTimeout(resolve, 100));

                // 手动清除预制体属性
                try {
                    console.log('手动清除预制体属性...');
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: '__prefab__',
                        dump: { value: null }
                    });
                    console.log('预制体属性已清除');
                } catch (clearError) {
                    console.log('清除预制体属性失败:', clearError);
                }

                // 再次等待处理
                await new Promise(resolve => setTimeout(resolve, 100));

                // 验证节点是否真的解除了预制体链接
                try {
                    const nodeInfo = await Editor.Message.request('scene', 'query-node', nodeUuid);
                    console.log('最终验证 - 节点预制体状态:', nodeInfo && (nodeInfo as any).__prefab__ ? '仍是预制体' : '已解除链接');

                    // 检查节点是否还有预制体属性
                    const isPrefabInstance = nodeInfo && (nodeInfo as any).__prefab__ && (nodeInfo as any).__prefab__.uuid;

                    return {
                        success: true,
                        data: {
                            nodeUuid: nodeUuid,
                            message: isPrefabInstance ?
                                '预制体链接解除可能未完全成功，请检查编辑器界面' :
                                '预制体实例已成功转换为普通节点',
                            result: result,
                            isPrefabInstance: isPrefabInstance,
                            nodeInfo: nodeInfo,
                            note: '已验证节点状态'
                        }
                    };
                } catch (verifyError) {
                    console.log('验证节点状态时出错:', verifyError);
                    return {
                        success: true,
                        data: {
                            nodeUuid: nodeUuid,
                            message: '预制体链接解除API调用成功，但无法验证最终状态',
                            result: result,
                            verifyError: String(verifyError)
                        }
                    };
                }
            } catch (error: any) {
                console.error('解除预制体链接失败:', error);

                // 尝试备用方法：通过设置节点的prefab属性为null
                const altResult = await this.tryAlternativeUnlink(nodeUuid);
                if (altResult.success) {
                    return altResult;
                } else {
                    return {
                        success: false,
                        error: `解除预制体链接失败: ${error.message || error}`,
                        instruction: '请确认节点是预制体实例且在当前场景中存在'
                    };
                }
            }
        } catch (error) {
            console.error('解除预制体链接异常:', error);
            return {
                success: false,
                error: `解除预制体链接异常: ${error}`
            };
        }
    }

    // 备用解除预制体链接方法：通过修改节点属性
    // 备用解除预制体链接方法：通过修改节点属性
    private async tryAlternativeUnlink(nodeUuid: string): Promise<ToolResponse> {
        try {
            // 尝试通过设置节点属性来解除预制体链接
            await Editor.Message.request('scene', 'set-property', {
                uuid: nodeUuid,
                path: '_prefab',
                dump: { value: null }
            });
            // 同时移除预制体实例标记
            await Editor.Message.request('scene', 'set-property', {
                uuid: nodeUuid,
                path: '_prefab.instance',
                dump: { value: null }
            });
            console.log('备用方法解除预制体链接成功');
            return {
                success: true,
                data: {
                    nodeUuid: nodeUuid,
                    message: '预制体实例已通过备用方法转换为普通节点',
                    method: 'alternative'
                }
            };
        } catch (error: any) {
            console.error('备用方法失败:', error);
            return {
                success: false,
                error: `备用方法失败: ${error.message || error}`
            };
        }
    }

    // 应用预制体实例的修改回预制体资源
    // 应用预制体实例的修改回预制体资源
    private async applyPrefab(nodeUuid: string): Promise<ToolResponse> {
        try {
            console.log(`开始应用预制体实例修改: ${nodeUuid}`);

            // 1. 首先验证节点是预制体实例
            const nodeInfo = await Editor.Message.request('scene', 'query-node', nodeUuid);
            if (!nodeInfo || !(nodeInfo as any).__prefab__) {
                return {
                    success: false,
                    error: '指定的节点不是预制体实例'
                };
            }

            const prefabInfo = (nodeInfo as any).__prefab__;
            const prefabAssetUuid = prefabInfo.asset;

            console.log(`预制体实例信息:`, prefabInfo);
            console.log(`关联的预制体资源 UUID: ${prefabAssetUuid}`);

            // 2. 调用 scene.apply-prefab API 应用修改
            console.log('调用 scene.apply-prefab API...');
            const applyResult: any = await Editor.Message.request('scene', 'apply-prefab', [nodeUuid]);
            console.log('apply-prefab API 调用结果:', applyResult);

            // 3. 等待编辑器处理
            await new Promise(resolve => setTimeout(resolve, 200));

            // 4. 获取预制体资源路径进行更新
            try {
                const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', prefabAssetUuid);
                console.log('预制体资源信息:', assetInfo);

                if (assetInfo && assetInfo.source) {
                    const prefabPath = assetInfo.source;
                    console.log(`预制体资源路径: ${prefabPath}`);

                    // 5. 刷新特定的预制体资源
                    await this.refreshAssets(prefabPath);

                    return {
                        success: true,
                        data: {
                            nodeUuid: nodeUuid,
                            prefabAssetUuid: prefabAssetUuid,
                            prefabPath: prefabPath,
                            message: '预制体实例的修改已成功应用到预制体资源',
                            applyResult: applyResult
                        }
                    };
                } else {
                    return {
                        success: true,
                        data: {
                            nodeUuid: nodeUuid,
                            prefabAssetUuid: prefabAssetUuid,
                            message: '预制体修改已应用，但无法获取资源路径信息',
                            applyResult: applyResult
                        }
                    };
                }
            } catch (assetError) {
                console.log('获取预制体资源信息失败:', assetError);
                return {
                    success: true,
                    data: {
                        nodeUuid: nodeUuid,
                        prefabAssetUuid: prefabAssetUuid,
                        message: '预制体修改已应用，但获取资源信息时出错',
                        applyResult: applyResult,
                        assetError: String(assetError)
                    }
                };
            }

        } catch (error: any) {
            console.error('应用预制体修改异常:', error);
            return {
                success: false,
                error: `应用预制体修改异常: ${error.message || error}`
            };
        }
    }

    // 进入预制体编辑模式 - 基于编辑器日志实现
    // 进入预制体编辑模式 - 基于编辑器日志实现
    private async enterPrefabEditMode(prefabPath: string): Promise<ToolResponse> {
        try {
            console.log(`开始进入预制体编辑模式: ${prefabPath}`);

            // 1. 查询预制体资源信息
            const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', prefabPath);
            if (!assetInfo) {
                return {
                    success: false,
                    error: '预制体资源不存在'
                };
            }

            const prefabUuid = assetInfo.uuid;
            console.log(`预制体 UUID: ${prefabUuid}`);

            // 2. 根据编辑器日志，首先打开预制体资源 (就像双击预制体文件)
            try {
                await Editor.Message.request('asset-db', 'open-asset', prefabPath);
                console.log('预制体资源打开请求已发送');
            } catch (openError) {
                console.log('打开预制体资源失败:', openError);
            }

            // 3. 等待编辑器处理资源打开
            await new Promise(resolve => setTimeout(resolve, 800));

            // 4. 设置预制体预览模式 (基于日志中的 call-preview-function)
            try {
                await Editor.Message.request('scene', 'call-preview-function', [
                    'scene:prefab-preview',
                    'setPrefab',
                    prefabUuid
                ]);
                console.log('预制体预览模式设置成功');
            } catch (previewError) {
                console.log('预制体预览模式设置失败:', previewError);
            }

            // 5. 设置hierarchy面板为预制体编辑模式 (基于日志中的 hierarchy.staging)
            try {
                await Editor.Message.request('hierarchy', 'staging', {
                    assetUuid: prefabUuid,
                    animationUuid: '',
                    expandLevels: ['0']
                });
                console.log('Hierarchy预制体编辑模式设置成功');
            } catch (hierarchyError) {
                console.log('设置Hierarchy预制体编辑模式失败:', hierarchyError);
            }

            // 6. 等待编辑器完全处理
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                success: true,
                data: {
                    prefabPath: prefabPath,
                    prefabUuid: prefabUuid,
                    message: '已进入预制体编辑模式',
                    mode: 'prefab-edit',
                    editSession: {
                        prefabPath: prefabPath,
                        prefabUuid: prefabUuid,
                        startTime: Date.now()
                    },
                    note: '编辑器界面应该已切换到预制体编辑模式'
                }
            };

        } catch (error: any) {
            console.error('进入预制体编辑模式失败:', error);
            return {
                success: false,
                error: `进入预制体编辑模式失败: ${error.message || error}`
            };
        }
    }

    // 保存预制体 - 基于编辑器日志中的 save-asset 调用
    // 保存预制体 - 基于编辑器日志中的 save-asset 调用
    private async savePrefabDirect(prefabPath: string): Promise<ToolResponse> {
        try {
            console.log(`开始保存预制体: ${prefabPath}`);

            // 1. 查询预制体资源信息
            const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', prefabPath);
            if (!assetInfo) {
                return {
                    success: false,
                    error: '预制体资源不存在'
                };
            }

            const prefabUuid = assetInfo.uuid;
            console.log(`预制体 UUID: ${prefabUuid}`);

            // 2. 调用 scene.save-scene 保存当前编辑状态 (基于日志)
            // 这会将当前场景的编辑状态保存到内存中
            try {
                await Editor.Message.request('scene', 'save-scene');
                console.log('场景状态已保存到内存');
            } catch (saveSceneError) {
                console.log('保存场景状态失败:', saveSceneError);
            }

            // 3. 查询预制体元数据
            try {
                const metaInfo = await Editor.Message.request('asset-db', 'query-asset-meta', prefabUuid);
                console.log('预制体元数据:', metaInfo);
            } catch (metaError) {
                console.log('获取预制体元数据失败:', metaError);
            }

            // 4. 基于编辑器日志，直接触发保存操作
            // 在预制体编辑模式下，scene.save-scene 会自动处理预制体内容的保存
            // 不需要手动调用 asset-db.save-asset，编辑器会自动处理

            // 5. 等待编辑器处理资源变化
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                success: true,
                data: {
                    prefabPath: prefabPath,
                    prefabUuid: prefabUuid,
                    message: '预制体保存请求已发送，编辑器将自动处理保存流程',
                    timestamp: Date.now(),
                    note: '基于编辑器日志，预制体编辑模式下scene.save-scene会自动保存预制体内容'
                }
            };

        } catch (error: any) {
            console.error('保存预制体失败:', error);
            return {
                success: false,
                error: `保存预制体失败: ${error.message || error}`
            };
        }
    }

    // 退出预制体编辑模式 - 切换回场景
    // 退出预制体编辑模式 - 切换回场景
    private async exitPrefabEditMode(scenePath?: string): Promise<ToolResponse> {
        try {
            console.log(`开始退出预制体编辑模式，切换到场景: ${scenePath || 'db://assets/scene.scene'}`);

            // 1. 确定目标场景路径
            const targetScene = scenePath || 'db://assets/scene.scene';

            // 2. 查询目标场景信息
            const sceneAssetInfo = await Editor.Message.request('asset-db', 'query-asset-info', targetScene);
            if (!sceneAssetInfo) {
                return {
                    success: false,
                    error: '目标场景不存在'
                };
            }

            const sceneUuid = sceneAssetInfo.uuid;
            console.log(`目标场景 UUID: ${sceneUuid}`);

            // 3. 调用 asset-db.open-asset 打开场景资源 (基于日志)
            try {
                await Editor.Message.request('asset-db', 'open-asset', targetScene);
                console.log('场景资源打开请求已发送');
            } catch (openError) {
                console.log('打开场景资源失败:', openError);
            }

            // 4. 调用 scene.open-scene 切换场景 (基于日志)
            try {
                await Editor.Message.request('scene', 'open-scene', sceneUuid);
                console.log('场景切换请求已发送');
            } catch (openSceneError) {
                console.log('切换场景失败:', openSceneError);
            }

            // 5. 等待编辑器处理场景切换
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 6. 查询当前场景状态确认切换成功
            try {
                const currentScene = await Editor.Message.request('scene', 'query-current-scene');
                console.log('当前场景:', currentScene);
            } catch (queryError) {
                console.log('查询当前场景失败:', queryError);
            }

            return {
                success: true,
                data: {
                    message: '已退出预制体编辑模式并切换到场景',
                    previousMode: 'prefab-edit',
                    currentMode: 'scene',
                    targetScene: targetScene,
                    sceneUuid: sceneUuid,
                    timestamp: Date.now()
                }
            };

        } catch (error: any) {
            console.error('退出预制体编辑模式失败:', error);
            return {
                success: false,
                error: `退出预制体编辑模式失败: ${error.message || error}`
            };
        }
    }

    // 开始记录编辑操作 - 基于日志中的 begin-recording
    // 开始记录编辑操作 - 基于日志中的 begin-recording
    private async beginRecording(nodeUuids: string[]): Promise<ToolResponse> {
        try {
            console.log(`开始记录编辑操作，节点: ${nodeUuids.join(', ')}`);

            const result = await Editor.Message.request('scene', 'begin-recording',
                nodeUuids,
                null
            );

            console.log('开始记录结果:', result);

            return {
                success: true,
                data: {
                    nodeUuids: nodeUuids,
                    recordingId: result,
                    message: '编辑记录已开始',
                    timestamp: Date.now()
                }
            };

        } catch (error: any) {
            console.error('开始记录编辑操作失败:', error);
            return {
                success: false,
                error: `开始记录编辑操作失败: ${error.message || error}`
            };
        }
    }

    // 结束记录编辑操作 - 基于日志中的 end-recording
    // 结束记录编辑操作 - 基于日志中的 end-recording
    private async endRecording(recordingId: string): Promise<ToolResponse> {
        try {
            console.log(`结束记录编辑操作，记录ID: ${recordingId}`);

            const result = await Editor.Message.request('scene', 'end-recording', recordingId);

            console.log('结束记录结果:', result);

            return {
                success: true,
                data: {
                    recordingId: recordingId,
                    result: result,
                    message: '编辑记录已结束',
                    timestamp: Date.now()
                }
            };

        } catch (error: any) {
            console.error('结束记录编辑操作失败:', error);
            return {
                success: false,
                error: `结束记录编辑操作失败: ${error.message || error}`
            };
        }
    }

    // 测试预制体修改 - 实例化预制体验证修改是否成功
    // 测试预制体修改 - 实例化预制体验证修改是否成功
    private async testPrefabChanges(prefabPath: string, parentUuid?: string): Promise<ToolResponse> {
        try {
            console.log(`开始测试预制体修改: ${prefabPath}`);

            // 1. 首先确保我们在场景模式
            try {
                await this.exitPrefabEditMode();
                console.log('已确保在场景模式');
            } catch (exitError) {
                console.log('切换到场景模式时出错:', exitError);
            }

            // 2. 获取场景根节点作为父节点（如果没有指定parentUuid）
            let targetParentUuid = parentUuid;
            if (!targetParentUuid) {
                try {
                    const nodeTree: any = await Editor.Message.request('scene', 'query-node-tree');
                    if (nodeTree && nodeTree.children && nodeTree.children.length > 0) {
                        // 使用Canvas节点作为父节点
                        const canvasNode = nodeTree.children.find((child: any) =>
                            child.name && (child.name.includes('Canvas') || (child.__comps__ && child.__comps__.some((comp: any) => comp.__type__ === 'cc.Canvas')))
                        );
                        if (canvasNode) {
                            targetParentUuid = canvasNode.uuid.value;
                            console.log(`找到Canvas节点作为父节点: ${targetParentUuid}`);
                        } else {
                            targetParentUuid = nodeTree.uuid.value; // 使用场景根节点
                            console.log(`使用场景根节点作为父节点: ${targetParentUuid}`);
                        }
                    }
                } catch (treeError) {
                    console.log('获取节点树失败:', treeError);
                }
            }

            // 3. 实例化预制体到场景中
            console.log(`实例化预制体到节点: ${targetParentUuid}`);
            const instantiateResult = await this.instantiatePrefab({
                prefabPath: prefabPath,
                parentUuid: targetParentUuid,
                position: { x: 0, y: 0, z: 0 }
            });

            if (!instantiateResult.success) {
                return {
                    success: false,
                    error: `实例化预制体失败: ${instantiateResult.error}`
                };
            }

            const instanceNodeUuid = instantiateResult.data.nodeUuid;
            console.log(`预制体实例化成功，节点UUID: ${instanceNodeUuid}`);

            // 4. 等待实例化完成
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 5. 查询实例化后的节点信息，验证修改
            try {
                const instanceInfo = await Editor.Message.request('scene', 'query-node', instanceNodeUuid);
                console.log('实例化节点信息:', JSON.stringify(instanceInfo, null, 2));

                // 6. 查询节点树获取子节点信息
                const nodeTree = await Editor.Message.request('scene', 'query-node-tree');
                const findInstanceInTree = (tree: any, targetUuid: string): any => {
                    if (tree.uuid && tree.uuid.value === targetUuid) {
                        return tree;
                    }
                    if (tree.children) {
                        for (const child of tree.children) {
                            const found = findInstanceInTree(child, targetUuid);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const instanceNode = findInstanceInTree(nodeTree, instanceNodeUuid);
                console.log('节点树中的实例信息:', JSON.stringify(instanceNode, null, 2));

                return {
                    success: true,
                    data: {
                        message: 'Test completed - prefab instantiated successfully',
                        instanceNodeUuid: instanceNodeUuid,
                        prefabPath: prefabPath,
                        note: 'Check editor Hierarchy panel to verify changes'
                    }
                };

            } catch (queryError) {
                console.log('查询实例节点信息失败:', queryError);
                return {
                    success: true,
                    data: {
                        prefabPath: prefabPath,
                        instanceNodeUuid: instanceNodeUuid,
                        parentUuid: targetParentUuid,
                        message: '预制体实例化成功，但查询详细信息失败',
                        note: '请手动检查编辑器中的预制体实例'
                    }
                };
            }

        } catch (error: any) {
            console.error('测试预制体修改失败:', error);
            return {
                success: false,
                error: `测试预制体修改失败: ${error.message || error}`
            };
        }
    }

}
