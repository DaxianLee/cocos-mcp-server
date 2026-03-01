import { ToolDefinition, ToolResponse, ToolExecutor, AssetInfo } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class AssetAdvancedTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            {
                name: 'asset_manage',
                description: 'ASSET MANAGEMENT: Import, delete, save metadata, or generate URLs for assets. Use this for all asset creation/deletion/modification operations. WORKFLOW: First use asset_query to find assets, then perform operations. Import requires sourcePath+targetUrl, delete needs urls array, save_meta needs urlOrUUID+content, generate_url needs url parameter.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['import', 'delete', 'save_meta', 'generate_url'],
                            description: 'Choose operation: "import" = batch import external files into project (requires assets array) | "delete" = batch remove assets from project (requires urls array) | "save_meta" = update asset metadata (requires urlOrUUID+content) | "generate_url" = create unique URL for asset (requires url)'
                        },
                        // For import action
                        assets: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    sourcePath: { type: 'string', description: 'Source file path' },
                                    targetUrl: { type: 'string', description: 'Target asset URL' }
                                },
                                required: ['sourcePath', 'targetUrl']
                            },
                            description: 'Array of import operations (REQUIRED for import action). Each item must have sourcePath (external file) and targetUrl (destination in project). Example: [{"sourcePath":"/path/to/image.png", "targetUrl":"db://assets/images/hero.png"}]'
                        },
                        overwrite: {
                            type: 'boolean',
                            description: 'Whether to overwrite existing assets (import action only)',
                            default: false
                        },
                        // For delete action
                        urls: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Array of asset URLs to remove (REQUIRED for delete action). Use Cocos asset URLs like "db://assets/images/hero.png". Get URLs from asset_query tool first. Example: ["db://assets/images/old1.png", "db://assets/scenes/test.scene"]'
                        },
                        // For save_meta action
                        urlOrUUID: {
                            type: 'string',
                            description: 'Asset identifier (REQUIRED for save_meta action). Can be asset URL like "db://assets/image.png" or UUID like "12345678-abcd-1234-5678-123456789abc". Get from asset_query tool.'
                        },
                        content: {
                            type: 'string',
                            description: 'Serialized metadata content (REQUIRED for save_meta action). Must be valid JSON string containing asset metadata. Format depends on asset type. Example: "{\"importer\":\"image\",\"settings\":{\"format\":\"png\"}}"'
                        },
                        // For generate_url action
                        url: {
                            type: 'string',
                            description: 'Asset URL to generate available URL for (generate_url action only)'
                        }
                    },
                    required: ['action']
                }
            },
            {
                name: 'asset_analyze',
                description: 'ASSET ANALYSIS: Get dependencies or export manifests. Use this to understand asset relationships and generate project reports. WORKFLOW: Use dependencies to trace asset usage, use manifest to export inventory. LIMITATIONS: Reference validation and unused asset detection are disabled due to API constraints.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['dependencies', 'manifest'],
                            description: 'Analysis type: "dependencies" = trace which assets this asset depends on (requires url parameter) | "manifest" = generate complete asset inventory report for folder (optional folder parameter, outputs JSON/CSV/XML format)'
                        },
                        // Common parameters
                        folder: {
                            type: 'string',
                            description: 'Target folder path to analyze (both actions). Default: "db://assets" analyzes entire project. Examples: "db://assets/scenes" for scenes only, "db://assets/textures" for textures only.',
                            default: 'db://assets'
                        },
                        // For dependencies action
                        url: {
                            type: 'string',
                            description: 'Asset URL to analyze dependencies for (REQUIRED for dependencies action). Must be valid Cocos asset URL like "db://assets/scenes/Game.scene" or "db://assets/prefabs/Player.prefab". Get URL from asset_query tool first.'
                        },
                        deep: {
                            type: 'boolean',
                            description: 'Include indirect dependencies (dependencies action only). true = show all nested dependencies recursively, false = show only direct dependencies. Recommended: true for complete analysis.',
                            default: true
                        },
                        // For unused action
                        includeSubfolders: {
                            type: 'boolean',
                            description: 'Whether to include subfolders (unused action only)',
                            default: true
                        },
                        // For manifest action
                        format: {
                            type: 'string',
                            description: 'Output format for manifest (manifest action only). "json" = structured data for APIs, "csv" = spreadsheet compatible, "xml" = legacy system integration.',
                            enum: ['json', 'csv', 'xml'],
                            default: 'json'
                        },
                        includeMetadata: {
                            type: 'boolean',
                            description: 'Include detailed metadata in manifest (manifest action only). true = full asset information including import settings, false = basic info only (name, path, type, UUID). Note: Currently limited by API availability.',
                            default: false
                        }
                    },
                    required: ['action']
                }
            },
            // COMMENTED OUT: asset_optimize - Texture compression requires image processing APIs not available in Cocos Creator MCP
            /*
            {
                name: 'asset_optimize',
                description: 'ASSET OPTIMIZATION: Compress textures and optimize assets for better performance. DISABLED - No image processing APIs available.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['compress_textures'],
                            description: 'Action: "compress_textures" = batch compress texture assets'
                        }
                    },
                    required: ['action']
                }
            },
            */
            {
                name: 'asset_system',
                description: 'ASSET SYSTEM: Check asset database status, refresh assets, or open assets with external programs. Use this for system-level asset operations.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['check_ready', 'open_external', 'refresh'],
                            description: 'Action: "check_ready" = check if asset database is ready | "open_external" = open asset with external program | "refresh" = refresh asset database'
                        },
                        url: {
                            type: 'string',
                            description: 'Asset URL to open (open_external action only)'
                        },
                        folder: {
                            type: 'string',
                            description: 'Specific folder to refresh (refresh action only)'
                        }
                    },
                    required: ['action']
                }
            },
            {
                name: 'asset_query',
                description: 'ASSET QUERY: Search, get information, and find assets by various criteria. Use this for asset discovery and detailed information retrieval.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['get_info', 'get_assets', 'find_by_name', 'get_details', 'query_path', 'query_uuid', 'query_url'],
                            description: 'Query action to perform'
                        },
                        // For get_info action
                        assetPath: {
                            type: 'string',
                            description: 'Asset path (get_info/get_details actions only)'
                        },
                        // For get_assets action
                        type: {
                            type: 'string',
                            enum: ['all', 'scene', 'prefab', 'script', 'texture', 'material', 'mesh', 'audio', 'animation', 'effect', 'chunk'],
                            description: 'Asset type filter (get_assets action only). Supports Cocos built-in types like effect and chunk.',
                            default: 'all'
                        },
                        folder: {
                            type: 'string',
                            description: 'Search scope (get_assets/find_by_name actions). Options: "db://assets" = user assets only, "db://internal" = built-in assets only, "all" = both user and built-in assets. Default searches both user and built-in.',
                            default: 'db://assets'
                        },
                        // For find_by_name action
                        name: {
                            type: 'string',
                            description: 'Asset name to search for (find_by_name action only)'
                        },
                        exactMatch: {
                            type: 'boolean',
                            description: 'Whether to use exact name matching (find_by_name action only)',
                            default: false
                        },
                        assetType: {
                            type: 'string',
                            enum: ['all', 'scene', 'prefab', 'script', 'texture', 'material', 'mesh', 'audio', 'animation', 'spriteFrame'],
                            description: 'Filter by asset type (find_by_name action only)',
                            default: 'all'
                        },
                        maxResults: {
                            type: 'number',
                            description: 'Maximum number of results (find_by_name action only)',
                            default: 20
                        },
                        // For get_details action
                        includeSubAssets: {
                            type: 'boolean',
                            description: 'Include sub-assets like spriteFrame (get_details action only)',
                            default: true
                        },
                        // For query actions
                        url: {
                            type: 'string',
                            description: 'Asset URL (query_path/query_uuid actions only)'
                        },
                        uuid: {
                            type: 'string',
                            description: 'Asset UUID (query_url action only)'
                        }
                    },
                    required: ['action']
                }
            },
            {
                name: 'asset_operations',
                description: 'ASSET OPERATIONS: Create, copy, move, delete, save, and import assets. Use this for all asset file operations and modifications.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['create', 'copy', 'move', 'delete', 'save', 'reimport', 'import'],
                            description: 'Asset operation to perform'
                        },
                        // For create action
                        url: {
                            type: 'string',
                            description: 'Asset URL (create/delete/save/reimport actions)'
                        },
                        content: {
                            type: 'string',
                            description: 'File content - null for folder (create/save actions)'
                        },
                        overwrite: {
                            type: 'boolean',
                            description: 'Overwrite existing file (create/copy/move actions)',
                            default: false
                        },
                        // For copy/move actions
                        source: {
                            type: 'string',
                            description: 'Source asset URL (copy/move actions)'
                        },
                        target: {
                            type: 'string',
                            description: 'Target location URL (copy/move actions)'
                        },
                        // For import action
                        sourcePath: {
                            type: 'string',
                            description: 'Source file path (import action only)'
                        },
                        targetFolder: {
                            type: 'string',
                            description: 'Target folder in assets (import action only)'
                        }
                    },
                    required: ['action']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'asset_manage':
                return await this.handleAssetManage(args);
            case 'asset_analyze':
                return await this.handleAssetAnalyze(args);
            case 'asset_system':
                return await this.handleAssetSystem(args);
            case 'asset_query':
                return await this.handleAssetQuery(args);
            case 'asset_operations':
                return await this.handleAssetOperations(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    // 新的整合处理函数
    private async handleAssetManage(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'import':
                return await this.batchImportAssets(args.assets, args.overwrite);
            case 'delete':
                return await this.batchDeleteAssets(args.urls);
            case 'save_meta':
                return await this.saveAssetMeta(args.urlOrUUID, args.content);
            case 'generate_url':
                return await this.generateAvailableUrl(args.url);
            default:
                return { success: false, error: `Unknown asset manage action: ${action}` };
        }
    }

    private async handleAssetAnalyze(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            // case 'validate_refs': // COMMENTED OUT - Requires complex project analysis
            //     return await this.validateAssetReferences(args.folder);
            case 'dependencies':
                return await this.getAssetDependencies(args.url, args.deep);
            // case 'unused': // COMMENTED OUT - Requires complex project analysis
            //     return await this.getUnusedAssets(args.folder, args.includeSubfolders);
            case 'manifest':
                return await this.exportAssetManifest(args.folder, args.format, args.includeMetadata);
            default:
                return { success: false, error: `Unknown asset analyze action: ${action}` };
        }
    }

    // COMMENTED OUT - No image processing APIs available in Cocos Creator MCP
    /*
    private async handleAssetOptimize(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'compress_textures':
                return await this.compressTextures(args.folder, args.quality, args.format, args.recursive);
            default:
                return { success: false, error: `Unknown asset optimize action: ${action}` };
        }
    }
    */

    private async handleAssetSystem(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'check_ready':
                return await this.queryAssetDbReady();
            case 'open_external':
                return await this.openAssetExternal(args.url);
            case 'refresh':
                return await this.refreshAssets(args.folder);
            default:
                return { success: false, error: `Unknown asset system action: ${action}` };
        }
    }

    private async handleAssetQuery(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'get_info':
                return await this.getAssetInfo(args.assetPath);
            case 'get_assets':
                return await this.getAssets(args.type, args.folder);
            case 'find_by_name':
                return await this.findAssetByName(args);
            case 'get_details':
                return await this.getAssetDetails(args.assetPath, args.includeSubAssets);
            case 'query_path':
                return await this.queryAssetPath(args.url);
            case 'query_uuid':
                return await this.queryAssetUuid(args.url);
            case 'query_url':
                return await this.queryAssetUrl(args.uuid);
            default:
                return { success: false, error: `Unknown asset query action: ${action}` };
        }
    }

    private async handleAssetOperations(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'create':
                return await this.createAsset(args.url, args.content, args.overwrite);
            case 'copy':
                return await this.copyAsset(args.source, args.target, args.overwrite);
            case 'move':
                return await this.moveAsset(args.source, args.target, args.overwrite);
            case 'delete':
                return await this.deleteAsset(args.url);
            case 'save':
                return await this.saveAsset(args.url, args.content);
            case 'reimport':
                return await this.reimportAsset(args.url);
            case 'import':
                return await this.importAsset(args.sourcePath, args.targetFolder);
            default:
                return { success: false, error: `Unknown asset operation action: ${action}` };
        }
    }

    // 原有的实现方法保持不变（从原文件复制）
    private async saveAssetMeta(urlOrUUID: string, content: string): Promise<ToolResponse> {
        try {
            const result = await Editor.Message.request('asset-db', 'save-asset-meta', urlOrUUID, content);
            return {
                success: true,
                message: `✅ Asset meta saved successfully`,
                data: { urlOrUUID, result }
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to save asset meta: ${(error as Error).message}`
            };
        }
    }

    private async generateAvailableUrl(url: string): Promise<ToolResponse> {
        try {
            const availableUrl = await Editor.Message.request('asset-db', 'generate-available-url', url);
            return {
                success: true,
                message: `✅ Available URL generated`,
                data: { originalUrl: url, availableUrl }
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to generate available URL: ${(error as Error).message}`
            };
        }
    }

    private async queryAssetDbReady(): Promise<ToolResponse> {
        try {
            const isReady = await Editor.Message.request('asset-db', 'query-ready');
            return {
                success: true,
                message: `✅ Asset database status: ${isReady ? 'Ready' : 'Not Ready'}`,
                data: { ready: isReady }
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to check asset database status: ${(error as Error).message}`
            };
        }
    }

    private async openAssetExternal(url: string): Promise<ToolResponse> {
        try {
            const result = await Editor.Message.request('asset-db', 'open-asset-external', url);
            return {
                success: true,
                message: `✅ Asset opened externally`,
                data: { url, result }
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to open asset externally: ${(error as Error).message}`
            };
        }
    }

    private async batchImportAssets(assets: Array<{ sourcePath: string; targetUrl: string }>, overwrite: boolean = false): Promise<ToolResponse> {
        const results: any[] = [];
        let successCount = 0;
        let errorCount = 0;

        for (const asset of assets) {
            try {
                const result = await (Editor.Message.request as any)('asset-db', 'create-asset', asset.targetUrl, {
                    source: asset.sourcePath,
                    rename: !(overwrite || false)
                });
                
                results.push({
                    sourcePath: asset.sourcePath,
                    targetUrl: asset.targetUrl,
                    success: true,
                    result
                });
                successCount++;
            } catch (error) {
                results.push({
                    sourcePath: asset.sourcePath,
                    targetUrl: asset.targetUrl,
                    success: false,
                    error: (error as Error).message
                });
                errorCount++;
            }
        }

        return {
            success: errorCount === 0,
            message: `✅ Imported ${successCount}/${assets.length} assets`,
            data: {
                totalRequested: assets.length,
                successCount,
                errorCount,
                results
            }
        };
    }

    private async batchDeleteAssets(urls: string[]): Promise<ToolResponse> {
        const results: any[] = [];
        let successCount = 0;
        let errorCount = 0;

        for (const url of urls) {
            try {
                const result = await Editor.Message.request('asset-db', 'delete-asset', url);
                results.push({
                    url,
                    success: true,
                    result
                });
                successCount++;
            } catch (error) {
                results.push({
                    url,
                    success: false,
                    error: (error as Error).message
                });
                errorCount++;
            }
        }

        return {
            success: errorCount === 0,
            message: `✅ Deleted ${successCount}/${urls.length} assets`,
            data: {
                totalRequested: urls.length,
                successCount,
                errorCount,
                results
            }
        };
    }

    // COMMENTED OUT - Requires complex project analysis not available in current Cocos Creator MCP APIs
    /*
    private async validateAssetReferences(folder: string = 'db://assets'): Promise<ToolResponse> {
        return {
            success: false,
            error: 'Asset reference validation requires complex project analysis not available in current Cocos Creator MCP implementation.'
        };
    }
    */

    private async getAssetDependencies(url: string, deep: boolean = true): Promise<ToolResponse> {
        try {
            const dependencies = await (Editor.Message.request as any)('asset-db', 'query-asset-dependencies', url, deep);
            return {
                success: true,
                message: `✅ Asset dependencies retrieved`,
                data: {
                    url,
                    deep,
                    dependencies,
                    count: Array.isArray(dependencies) ? dependencies.length : 0
                }
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to get asset dependencies: ${(error as Error).message}`
            };
        }
    }

    // COMMENTED OUT - Requires comprehensive project analysis not available in current Cocos Creator MCP APIs
    /*
    private async getUnusedAssets(folder: string = 'db://assets', includeSubfolders: boolean = true): Promise<ToolResponse> {
        return {
            success: false,
            error: 'Unused asset detection requires comprehensive project analysis not available in current Cocos Creator MCP implementation.'
        };
    }
    */

    // COMMENTED OUT - Texture compression requires image processing APIs not available in Cocos Creator MCP
    /*
    private async compressTextures(folder: string = 'db://assets', quality: number = 80, format: string = 'jpg', recursive: boolean = true): Promise<ToolResponse> {
        return {
            success: false,
            error: 'Texture compression requires image processing capabilities not available in current Cocos Creator MCP implementation.'
        };
    }
    */

    private async exportAssetManifest(folder: string = 'db://assets', format: string = 'json', _includeMetadata: boolean = false): Promise<ToolResponse> {
        try {
            // 获取实际的资源数据
            const allAssetsResponse = await Editor.Message.request('asset-db', 'query-assets');
            const allAssets = Array.isArray(allAssetsResponse) ? allAssetsResponse : [];
            
            // 过滤指定文件夹的资源
            const filteredAssets = allAssets.filter(asset => 
                asset.path && asset.path.includes(folder)
            );
            
            // 构建资源清单 - 只包含基础信息，不包含模拟的元数据
            const assets = filteredAssets.map(asset => {
                return {
                    name: asset.name,
                    path: asset.path,
                    type: asset.type,
                    uuid: asset.uuid
                    // NOTE: includeMetadata parameter ignored - detailed metadata requires APIs not available in current MCP
                };
            });
            
            const manifest = {
                folder,
                format,
                includeMetadata: false, // Always false - metadata APIs not available
                assets,
                exportDate: new Date().toISOString(),
                totalAssets: assets.length,
                summary: {
                    byType: this.groupAssetsByType(assets)
                    // NOTE: totalSize calculation removed - requires file system APIs not available in MCP
                }
            };
            
            return {
                success: true,
                message: `✅ Asset manifest exported with ${assets.length} assets`,
                data: manifest
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to export asset manifest: ${(error as Error).message}`
            };
        }
    }
    
    private groupAssetsByType(assets: any[]): any {
        const grouped: any = {};
        assets.forEach(asset => {
            const type = asset.type || 'Unknown';
            grouped[type] = (grouped[type] || 0) + 1;
        });
        return grouped;
    }

    // New asset operation methods moved from project-tools.ts
    private async refreshAssets(folder?: string): Promise<ToolResponse> {
        const targetPath = folder || 'db://assets';
        try {
            await Editor.Message.request('asset-db', 'refresh-asset', targetPath);
            return {
                success: true,
                message: `✅ Assets refreshed in: ${targetPath}`,
                data: { folder: targetPath }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async importAsset(sourcePath: string, targetFolder: string): Promise<ToolResponse> {
        if (!fs.existsSync(sourcePath)) {
            return { success: false, error: 'Source file not found' };
        }

        const fileName = path.basename(sourcePath);
        const targetPath = targetFolder.startsWith('db://') ?
            targetFolder : `db://assets/${targetFolder}`;

        try {
            const result: any = await Editor.Message.request('asset-db', 'import-asset', sourcePath, `${targetPath}/${fileName}`);
            return {
                success: true,
                message: `✅ Asset imported: ${fileName}`,
                data: {
                    uuid: result.uuid,
                    path: result.url,
                    fileName
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async getAssetInfo(assetPath: string): Promise<ToolResponse> {
        try {
            const assetInfo: any = await Editor.Message.request('asset-db', 'query-asset-info', assetPath);
            if (!assetInfo) {
                return { success: false, error: 'Asset not found' };
            }

            const info: AssetInfo = {
                name: assetInfo.name,
                uuid: assetInfo.uuid,
                path: assetInfo.url,
                type: assetInfo.type,
                size: assetInfo.size,
                isDirectory: assetInfo.isDirectory
            };

            if (assetInfo.meta) {
                info.meta = {
                    ver: assetInfo.meta.ver,
                    importer: assetInfo.meta.importer
                };
            }

            return {
                success: true,
                message: `✅ Asset info retrieved: ${info.name}`,
                data: info
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async getAssets(type: string = 'all', folder: string = 'db://assets'): Promise<ToolResponse> {
        try {
            let patterns: string[] = [];

            // 决定搜索范围
            if (folder === 'all') {
                // 搜索用户资源和内置资源
                patterns = ['db://assets/**/*', 'db://internal/**/*'];
            } else if (folder === 'db://internal') {
                // 只搜索内置资源
                patterns = ['db://internal/**/*'];
            } else if (folder === 'db://assets') {
                // 只搜索用户资源
                patterns = ['db://assets/**/*'];
            } else {
                // 指定文件夹
                patterns = [`${folder}/**/*`];
            }

            // 如果指定了类型，添加扩展名过滤
            if (type !== 'all') {
                const typeExtensions: Record<string, string> = {
                    'scene': '.scene',
                    'prefab': '.prefab',
                    'script': '.{ts,js}',
                    'texture': '.{png,jpg,jpeg,gif,tga,bmp,psd}',
                    'material': '.mtl',
                    'mesh': '.{fbx,obj,dae}',
                    'audio': '.{mp3,ogg,wav,m4a}',
                    'animation': '.{anim,clip}',
                    'effect': '.effect',
                    'chunk': '.chunk'
                };

                const extension = typeExtensions[type];
                if (extension) {
                    patterns = patterns.map(pattern => pattern.replace('/**/*', `/**/*${extension}`));
                }
            }

            console.log(`[DEBUG] Searching assets with patterns:`, patterns);

            // 并行查询所有模式
            const allResults = await Promise.all(
                patterns.map(pattern =>
                    Editor.Message.request('asset-db', 'query-assets', { pattern: pattern })
                        .catch((err: any) => {
                            console.log(`[DEBUG] Pattern ${pattern} failed:`, err);
                            return [];
                        })
                )
            );

            // 合并结果并去重
            const combinedResults = allResults.flat();
            const uniqueAssets = new Map();

            combinedResults.forEach(asset => {
                if (asset && asset.uuid && !uniqueAssets.has(asset.uuid)) {
                    uniqueAssets.set(asset.uuid, {
                        name: asset.name,
                        uuid: asset.uuid,
                        path: asset.url,
                        type: asset.type,
                        size: (asset as any).size || 0,
                        isDirectory: (asset as any).isDirectory || false,
                        isBuiltIn: asset.url.startsWith('db://internal')
                    });
                }
            });

            const assets = Array.from(uniqueAssets.values());

            // 按类型分组统计
            const userAssets = assets.filter(a => !a.isBuiltIn);
            const builtInAssets = assets.filter(a => a.isBuiltIn);

            return {
                success: true,
                message: `✅ Found ${assets.length} assets (${userAssets.length} user + ${builtInAssets.length} built-in) of type '${type}'`,
                data: {
                    type: type,
                    folder: folder,
                    count: assets.length,
                    userCount: userAssets.length,
                    builtInCount: builtInAssets.length,
                    assets: assets
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async createAsset(url: string, content: string | null = null, overwrite: boolean = false): Promise<ToolResponse> {
        const options = {
            overwrite: overwrite,
            rename: !overwrite
        };

        try {
            const result: any = await Editor.Message.request('asset-db', 'create-asset', url, content, options);
            const assetType = content === null ? 'Folder' : 'File';
            return {
                success: true,
                message: `✅ ${assetType} created successfully`,
                data: {
                    uuid: result?.uuid,
                    url: result?.url || url,
                    type: assetType.toLowerCase()
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async copyAsset(source: string, target: string, overwrite: boolean = false): Promise<ToolResponse> {
        const options = {
            overwrite: overwrite,
            rename: !overwrite
        };

        try {
            const result: any = await Editor.Message.request('asset-db', 'copy-asset', source, target, options);
            return {
                success: true,
                message: `✅ Asset copied successfully`,
                data: {
                    uuid: result?.uuid,
                    source: source,
                    target: result?.url || target
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async moveAsset(source: string, target: string, overwrite: boolean = false): Promise<ToolResponse> {
        const options = {
            overwrite: overwrite,
            rename: !overwrite
        };

        try {
            const result: any = await Editor.Message.request('asset-db', 'move-asset', source, target, options);
            return {
                success: true,
                message: `✅ Asset moved successfully`,
                data: {
                    uuid: result?.uuid,
                    source: source,
                    target: result?.url || target
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async deleteAsset(url: string): Promise<ToolResponse> {
        try {
            await Editor.Message.request('asset-db', 'delete-asset', url);
            return {
                success: true,
                message: `✅ Asset deleted successfully`,
                data: { url }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async saveAsset(url: string, content: string): Promise<ToolResponse> {
        try {
            const result: any = await Editor.Message.request('asset-db', 'save-asset', url, content);
            return {
                success: true,
                message: `✅ Asset saved successfully`,
                data: {
                    uuid: result?.uuid,
                    url: result?.url || url
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async reimportAsset(url: string): Promise<ToolResponse> {
        try {
            await Editor.Message.request('asset-db', 'reimport-asset', url);
            return {
                success: true,
                message: `✅ Asset reimported successfully`,
                data: { url }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async queryAssetPath(url: string): Promise<ToolResponse> {
        try {
            const assetPath: string | null = await Editor.Message.request('asset-db', 'query-path', url);
            if (assetPath) {
                return {
                    success: true,
                    message: `✅ Asset path retrieved`,
                    data: { url, path: assetPath }
                };
            } else {
                return { success: false, error: 'Asset path not found' };
            }
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async queryAssetUuid(url: string): Promise<ToolResponse> {
        try {
            const uuid: string | null = await Editor.Message.request('asset-db', 'query-uuid', url);
            if (uuid) {
                return {
                    success: true,
                    message: `✅ Asset UUID retrieved`,
                    data: { url, uuid }
                };
            } else {
                return { success: false, error: 'Asset UUID not found' };
            }
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async queryAssetUrl(uuid: string): Promise<ToolResponse> {
        try {
            const url: string | null = await Editor.Message.request('asset-db', 'query-url', uuid);
            if (url) {
                return {
                    success: true,
                    message: `✅ Asset URL retrieved`,
                    data: { uuid, url }
                };
            } else {
                return { success: false, error: 'Asset URL not found' };
            }
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async findAssetByName(args: any): Promise<ToolResponse> {
        const { name, exactMatch = false, assetType = 'all', folder = 'db://assets', maxResults = 20 } = args;

        try {
            const allAssetsResponse = await this.getAssets(assetType, folder);
            if (!allAssetsResponse.success || !allAssetsResponse.data) {
                return {
                    success: false,
                    error: `Failed to get assets: ${allAssetsResponse.error}`
                };
            }

            const allAssets = allAssetsResponse.data.assets as any[];
            let matchedAssets: any[] = [];

            for (const asset of allAssets) {
                const assetName = asset.name;
                let matches = false;

                if (exactMatch) {
                    matches = assetName === name;
                } else {
                    matches = assetName.toLowerCase().includes(name.toLowerCase());
                }

                if (matches) {
                    try {
                        const detailResponse = await this.getAssetInfo(asset.path);
                        if (detailResponse.success) {
                            matchedAssets.push({
                                ...asset,
                                details: detailResponse.data
                            });
                        } else {
                            matchedAssets.push(asset);
                        }
                    } catch {
                        matchedAssets.push(asset);
                    }

                    if (matchedAssets.length >= maxResults) {
                        break;
                    }
                }
            }

            return {
                success: true,
                message: `✅ Found ${matchedAssets.length} assets matching '${name}'`,
                data: {
                    searchTerm: name,
                    exactMatch,
                    assetType,
                    folder,
                    totalFound: matchedAssets.length,
                    maxResults,
                    assets: matchedAssets
                }
            };

        } catch (error: any) {
            return {
                success: false,
                error: `Asset search failed: ${error.message}`
            };
        }
    }
    
    private async getAssetDetails(assetPath: string, includeSubAssets: boolean = true): Promise<ToolResponse> {
        try {
            const assetInfoResponse = await this.getAssetInfo(assetPath);
            if (!assetInfoResponse.success) {
                return assetInfoResponse;
            }

            const assetInfo = assetInfoResponse.data;
            const detailedInfo: any = {
                ...assetInfo,
                subAssets: []
            };

            if (includeSubAssets && assetInfo) {
                if (assetInfo.type === 'cc.ImageAsset' || assetPath.match(/\.(png|jpg|jpeg|gif|tga|bmp|psd)$/i)) {
                    const baseUuid = assetInfo.uuid;
                    const possibleSubAssets = [
                        { type: 'spriteFrame', uuid: `${baseUuid}@f9941`, suffix: '@f9941' },
                        { type: 'texture', uuid: `${baseUuid}@6c48a`, suffix: '@6c48a' },
                        { type: 'texture2D', uuid: `${baseUuid}@6c48a`, suffix: '@6c48a' }
                    ];

                    for (const subAsset of possibleSubAssets) {
                        try {
                            const subAssetUrl = await Editor.Message.request('asset-db', 'query-url', subAsset.uuid);
                            if (subAssetUrl) {
                                detailedInfo.subAssets.push({
                                    type: subAsset.type,
                                    uuid: subAsset.uuid,
                                    url: subAssetUrl,
                                    suffix: subAsset.suffix
                                });
                            }
                        } catch {
                            // Sub-asset doesn't exist, skip it
                        }
                    }
                }
            }

            return {
                success: true,
                message: `✅ Asset details retrieved. Found ${detailedInfo.subAssets.length} sub-assets`,
                data: {
                    assetPath,
                    includeSubAssets,
                    ...detailedInfo
                }
            };

        } catch (error: any) {
            return {
                success: false,
                error: `Failed to get asset details: ${error.message}`
            };
        }
    }
}