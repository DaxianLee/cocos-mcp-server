"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetAdvancedTools = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class AssetAdvancedTools {
    getTools() {
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
    async execute(toolName, args) {
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
    async handleAssetManage(args) {
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
    async handleAssetAnalyze(args) {
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
    async handleAssetSystem(args) {
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
    async handleAssetQuery(args) {
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
    async handleAssetOperations(args) {
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
    async saveAssetMeta(urlOrUUID, content) {
        try {
            const result = await Editor.Message.request('asset-db', 'save-asset-meta', urlOrUUID, content);
            return {
                success: true,
                message: `✅ Asset meta saved successfully`,
                data: { urlOrUUID, result }
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to save asset meta: ${error.message}`
            };
        }
    }
    async generateAvailableUrl(url) {
        try {
            const availableUrl = await Editor.Message.request('asset-db', 'generate-available-url', url);
            return {
                success: true,
                message: `✅ Available URL generated`,
                data: { originalUrl: url, availableUrl }
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to generate available URL: ${error.message}`
            };
        }
    }
    async queryAssetDbReady() {
        try {
            const isReady = await Editor.Message.request('asset-db', 'query-ready');
            return {
                success: true,
                message: `✅ Asset database status: ${isReady ? 'Ready' : 'Not Ready'}`,
                data: { ready: isReady }
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to check asset database status: ${error.message}`
            };
        }
    }
    async openAssetExternal(url) {
        try {
            const result = await Editor.Message.request('asset-db', 'open-asset-external', url);
            return {
                success: true,
                message: `✅ Asset opened externally`,
                data: { url, result }
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to open asset externally: ${error.message}`
            };
        }
    }
    async batchImportAssets(assets, overwrite = false) {
        const results = [];
        let successCount = 0;
        let errorCount = 0;
        for (const asset of assets) {
            try {
                const result = await Editor.Message.request('asset-db', 'create-asset', asset.targetUrl, {
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
            }
            catch (error) {
                results.push({
                    sourcePath: asset.sourcePath,
                    targetUrl: asset.targetUrl,
                    success: false,
                    error: error.message
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
    async batchDeleteAssets(urls) {
        const results = [];
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
            }
            catch (error) {
                results.push({
                    url,
                    success: false,
                    error: error.message
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
    async getAssetDependencies(url, deep = true) {
        try {
            const dependencies = await Editor.Message.request('asset-db', 'query-asset-dependencies', url, deep);
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
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to get asset dependencies: ${error.message}`
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
    async exportAssetManifest(folder = 'db://assets', format = 'json', _includeMetadata = false) {
        try {
            // 获取实际的资源数据
            const allAssetsResponse = await Editor.Message.request('asset-db', 'query-assets');
            const allAssets = Array.isArray(allAssetsResponse) ? allAssetsResponse : [];
            // 过滤指定文件夹的资源
            const filteredAssets = allAssets.filter(asset => asset.path && asset.path.includes(folder));
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
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to export asset manifest: ${error.message}`
            };
        }
    }
    groupAssetsByType(assets) {
        const grouped = {};
        assets.forEach(asset => {
            const type = asset.type || 'Unknown';
            grouped[type] = (grouped[type] || 0) + 1;
        });
        return grouped;
    }
    // New asset operation methods moved from project-tools.ts
    async refreshAssets(folder) {
        const targetPath = folder || 'db://assets';
        try {
            await Editor.Message.request('asset-db', 'refresh-asset', targetPath);
            return {
                success: true,
                message: `✅ Assets refreshed in: ${targetPath}`,
                data: { folder: targetPath }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async importAsset(sourcePath, targetFolder) {
        if (!fs.existsSync(sourcePath)) {
            return { success: false, error: 'Source file not found' };
        }
        const fileName = path.basename(sourcePath);
        const targetPath = targetFolder.startsWith('db://') ?
            targetFolder : `db://assets/${targetFolder}`;
        try {
            const result = await Editor.Message.request('asset-db', 'import-asset', sourcePath, `${targetPath}/${fileName}`);
            return {
                success: true,
                message: `✅ Asset imported: ${fileName}`,
                data: {
                    uuid: result.uuid,
                    path: result.url,
                    fileName
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async getAssetInfo(assetPath) {
        try {
            const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', assetPath);
            if (!assetInfo) {
                return { success: false, error: 'Asset not found' };
            }
            const info = {
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
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async getAssets(type = 'all', folder = 'db://assets') {
        try {
            let patterns = [];
            // 决定搜索范围
            if (folder === 'all') {
                // 搜索用户资源和内置资源
                patterns = ['db://assets/**/*', 'db://internal/**/*'];
            }
            else if (folder === 'db://internal') {
                // 只搜索内置资源
                patterns = ['db://internal/**/*'];
            }
            else if (folder === 'db://assets') {
                // 只搜索用户资源
                patterns = ['db://assets/**/*'];
            }
            else {
                // 指定文件夹
                patterns = [`${folder}/**/*`];
            }
            // 如果指定了类型，添加扩展名过滤
            if (type !== 'all') {
                const typeExtensions = {
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
            const allResults = await Promise.all(patterns.map(pattern => Editor.Message.request('asset-db', 'query-assets', { pattern: pattern })
                .catch((err) => {
                console.log(`[DEBUG] Pattern ${pattern} failed:`, err);
                return [];
            })));
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
                        size: asset.size || 0,
                        isDirectory: asset.isDirectory || false,
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
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async createAsset(url, content = null, overwrite = false) {
        const options = {
            overwrite: overwrite,
            rename: !overwrite
        };
        try {
            const result = await Editor.Message.request('asset-db', 'create-asset', url, content, options);
            const assetType = content === null ? 'Folder' : 'File';
            return {
                success: true,
                message: `✅ ${assetType} created successfully`,
                data: {
                    uuid: result === null || result === void 0 ? void 0 : result.uuid,
                    url: (result === null || result === void 0 ? void 0 : result.url) || url,
                    type: assetType.toLowerCase()
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async copyAsset(source, target, overwrite = false) {
        const options = {
            overwrite: overwrite,
            rename: !overwrite
        };
        try {
            const result = await Editor.Message.request('asset-db', 'copy-asset', source, target, options);
            return {
                success: true,
                message: `✅ Asset copied successfully`,
                data: {
                    uuid: result === null || result === void 0 ? void 0 : result.uuid,
                    source: source,
                    target: (result === null || result === void 0 ? void 0 : result.url) || target
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async moveAsset(source, target, overwrite = false) {
        const options = {
            overwrite: overwrite,
            rename: !overwrite
        };
        try {
            const result = await Editor.Message.request('asset-db', 'move-asset', source, target, options);
            return {
                success: true,
                message: `✅ Asset moved successfully`,
                data: {
                    uuid: result === null || result === void 0 ? void 0 : result.uuid,
                    source: source,
                    target: (result === null || result === void 0 ? void 0 : result.url) || target
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async deleteAsset(url) {
        try {
            await Editor.Message.request('asset-db', 'delete-asset', url);
            return {
                success: true,
                message: `✅ Asset deleted successfully`,
                data: { url }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async saveAsset(url, content) {
        try {
            const result = await Editor.Message.request('asset-db', 'save-asset', url, content);
            return {
                success: true,
                message: `✅ Asset saved successfully`,
                data: {
                    uuid: result === null || result === void 0 ? void 0 : result.uuid,
                    url: (result === null || result === void 0 ? void 0 : result.url) || url
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async reimportAsset(url) {
        try {
            await Editor.Message.request('asset-db', 'reimport-asset', url);
            return {
                success: true,
                message: `✅ Asset reimported successfully`,
                data: { url }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryAssetPath(url) {
        try {
            const assetPath = await Editor.Message.request('asset-db', 'query-path', url);
            if (assetPath) {
                return {
                    success: true,
                    message: `✅ Asset path retrieved`,
                    data: { url, path: assetPath }
                };
            }
            else {
                return { success: false, error: 'Asset path not found' };
            }
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryAssetUuid(url) {
        try {
            const uuid = await Editor.Message.request('asset-db', 'query-uuid', url);
            if (uuid) {
                return {
                    success: true,
                    message: `✅ Asset UUID retrieved`,
                    data: { url, uuid }
                };
            }
            else {
                return { success: false, error: 'Asset UUID not found' };
            }
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryAssetUrl(uuid) {
        try {
            const url = await Editor.Message.request('asset-db', 'query-url', uuid);
            if (url) {
                return {
                    success: true,
                    message: `✅ Asset URL retrieved`,
                    data: { uuid, url }
                };
            }
            else {
                return { success: false, error: 'Asset URL not found' };
            }
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async findAssetByName(args) {
        const { name, exactMatch = false, assetType = 'all', folder = 'db://assets', maxResults = 20 } = args;
        try {
            const allAssetsResponse = await this.getAssets(assetType, folder);
            if (!allAssetsResponse.success || !allAssetsResponse.data) {
                return {
                    success: false,
                    error: `Failed to get assets: ${allAssetsResponse.error}`
                };
            }
            const allAssets = allAssetsResponse.data.assets;
            let matchedAssets = [];
            for (const asset of allAssets) {
                const assetName = asset.name;
                let matches = false;
                if (exactMatch) {
                    matches = assetName === name;
                }
                else {
                    matches = assetName.toLowerCase().includes(name.toLowerCase());
                }
                if (matches) {
                    try {
                        const detailResponse = await this.getAssetInfo(asset.path);
                        if (detailResponse.success) {
                            matchedAssets.push(Object.assign(Object.assign({}, asset), { details: detailResponse.data }));
                        }
                        else {
                            matchedAssets.push(asset);
                        }
                    }
                    catch (_a) {
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
        }
        catch (error) {
            return {
                success: false,
                error: `Asset search failed: ${error.message}`
            };
        }
    }
    async getAssetDetails(assetPath, includeSubAssets = true) {
        try {
            const assetInfoResponse = await this.getAssetInfo(assetPath);
            if (!assetInfoResponse.success) {
                return assetInfoResponse;
            }
            const assetInfo = assetInfoResponse.data;
            const detailedInfo = Object.assign(Object.assign({}, assetInfo), { subAssets: [] });
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
                        }
                        catch (_a) {
                            // Sub-asset doesn't exist, skip it
                        }
                    }
                }
            }
            return {
                success: true,
                message: `✅ Asset details retrieved. Found ${detailedInfo.subAssets.length} sub-assets`,
                data: Object.assign({ assetPath,
                    includeSubAssets }, detailedInfo)
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to get asset details: ${error.message}`
            };
        }
    }
}
exports.AssetAdvancedTools = AssetAdvancedTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtYWR2YW5jZWQtdG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb3VyY2UvdG9vbHMvYXNzZXQtYWR2YW5jZWQtdG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsdUNBQXlCO0FBQ3pCLDJDQUE2QjtBQUU3QixNQUFhLGtCQUFrQjtJQUMzQixRQUFRO1FBQ0osT0FBTztZQUNIO2dCQUNJLElBQUksRUFBRSxjQUFjO2dCQUNwQixXQUFXLEVBQUUsOFZBQThWO2dCQUMzVyxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLE1BQU0sRUFBRTs0QkFDSixJQUFJLEVBQUUsUUFBUTs0QkFDZCxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxjQUFjLENBQUM7NEJBQ3ZELFdBQVcsRUFBRSxvU0FBb1M7eUJBQ3BUO3dCQUNELG9CQUFvQjt3QkFDcEIsTUFBTSxFQUFFOzRCQUNKLElBQUksRUFBRSxPQUFPOzRCQUNiLEtBQUssRUFBRTtnQ0FDSCxJQUFJLEVBQUUsUUFBUTtnQ0FDZCxVQUFVLEVBQUU7b0NBQ1IsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUU7b0NBQy9ELFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFO2lDQUNqRTtnQ0FDRCxRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDOzZCQUN4Qzs0QkFDRCxXQUFXLEVBQUUsMk9BQTJPO3lCQUMzUDt3QkFDRCxTQUFTLEVBQUU7NEJBQ1AsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsV0FBVyxFQUFFLDJEQUEyRDs0QkFDeEUsT0FBTyxFQUFFLEtBQUs7eUJBQ2pCO3dCQUNELG9CQUFvQjt3QkFDcEIs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QUMsTUFBTTtpQ0FDMUIsQ0FBQyxDQUFDOzRCQUNQLENBQUM7d0JBQ0wsQ0FBQzt3QkFBQyxXQUFNLENBQUM7NEJBQ0wsbUNBQW1DO3dCQUN2QyxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxPQUFPO2dCQUNILE9BQU8sRUFBRSxJQUFJO2dCQUNiLE9BQU8sRUFBRSxvQ0FBb0MsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLGFBQWE7Z0JBQ3ZGLElBQUksa0JBQ0EsU0FBUztvQkFDVCxnQkFBZ0IsSUFDYixZQUFZLENBQ2xCO2FBQ0osQ0FBQztRQUVOLENBQUM7UUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1lBQ2xCLE9BQU87Z0JBQ0gsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsS0FBSyxFQUFFLGdDQUFnQyxLQUFLLENBQUMsT0FBTyxFQUFFO2FBQ3pELENBQUM7UUFDTixDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBdGtDRCxnREFza0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVG9vbERlZmluaXRpb24sIFRvb2xSZXNwb25zZSwgVG9vbEV4ZWN1dG9yLCBBc3NldEluZm8gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgY2xhc3MgQXNzZXRBZHZhbmNlZFRvb2xzIGltcGxlbWVudHMgVG9vbEV4ZWN1dG9yIHtcbiAgICBnZXRUb29scygpOiBUb29sRGVmaW5pdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXNzZXRfbWFuYWdlJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FTU0VUIE1BTkFHRU1FTlQ6IEltcG9ydCwgZGVsZXRlLCBzYXZlIG1ldGFkYXRhLCBvciBnZW5lcmF0ZSBVUkxzIGZvciBhc3NldHMuIFVzZSB0aGlzIGZvciBhbGwgYXNzZXQgY3JlYXRpb24vZGVsZXRpb24vbW9kaWZpY2F0aW9uIG9wZXJhdGlvbnMuIFdPUktGTE9XOiBGaXJzdCB1c2UgYXNzZXRfcXVlcnkgdG8gZmluZCBhc3NldHMsIHRoZW4gcGVyZm9ybSBvcGVyYXRpb25zLiBJbXBvcnQgcmVxdWlyZXMgc291cmNlUGF0aCt0YXJnZXRVcmwsIGRlbGV0ZSBuZWVkcyB1cmxzIGFycmF5LCBzYXZlX21ldGEgbmVlZHMgdXJsT3JVVUlEK2NvbnRlbnQsIGdlbmVyYXRlX3VybCBuZWVkcyB1cmwgcGFyYW1ldGVyLicsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnaW1wb3J0JywgJ2RlbGV0ZScsICdzYXZlX21ldGEnLCAnZ2VuZXJhdGVfdXJsJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDaG9vc2Ugb3BlcmF0aW9uOiBcImltcG9ydFwiID0gYmF0Y2ggaW1wb3J0IGV4dGVybmFsIGZpbGVzIGludG8gcHJvamVjdCAocmVxdWlyZXMgYXNzZXRzIGFycmF5KSB8IFwiZGVsZXRlXCIgPSBiYXRjaCByZW1vdmUgYXNzZXRzIGZyb20gcHJvamVjdCAocmVxdWlyZXMgdXJscyBhcnJheSkgfCBcInNhdmVfbWV0YVwiID0gdXBkYXRlIGFzc2V0IG1ldGFkYXRhIChyZXF1aXJlcyB1cmxPclVVSUQrY29udGVudCkgfCBcImdlbmVyYXRlX3VybFwiID0gY3JlYXRlIHVuaXF1ZSBVUkwgZm9yIGFzc2V0IChyZXF1aXJlcyB1cmwpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBpbXBvcnQgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NldHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VQYXRoOiB7IHR5cGU6ICdzdHJpbmcnLCBkZXNjcmlwdGlvbjogJ1NvdXJjZSBmaWxlIHBhdGgnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRVcmw6IHsgdHlwZTogJ3N0cmluZycsIGRlc2NyaXB0aW9uOiAnVGFyZ2V0IGFzc2V0IFVSTCcgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydzb3VyY2VQYXRoJywgJ3RhcmdldFVybCddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FycmF5IG9mIGltcG9ydCBvcGVyYXRpb25zIChSRVFVSVJFRCBmb3IgaW1wb3J0IGFjdGlvbikuIEVhY2ggaXRlbSBtdXN0IGhhdmUgc291cmNlUGF0aCAoZXh0ZXJuYWwgZmlsZSkgYW5kIHRhcmdldFVybCAoZGVzdGluYXRpb24gaW4gcHJvamVjdCkuIEV4YW1wbGU6IFt7XCJzb3VyY2VQYXRoXCI6XCIvcGF0aC90by9pbWFnZS5wbmdcIiwgXCJ0YXJnZXRVcmxcIjpcImRiOi8vYXNzZXRzL2ltYWdlcy9oZXJvLnBuZ1wifV0nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcndyaXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0byBvdmVyd3JpdGUgZXhpc3RpbmcgYXNzZXRzIChpbXBvcnQgYWN0aW9uIG9ubHkpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBkZWxldGUgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmxzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXJyYXkgb2YgYXNzZXQgVVJMcyB0byByZW1vdmUgKFJFUVVJUkVEIGZvciBkZWxldGUgYWN0aW9uKS4gVXNlIENvY29zIGFzc2V0IFVSTHMgbGlrZSBcImRiOi8vYXNzZXRzL2ltYWdlcy9oZXJvLnBuZ1wiLiBHZXQgVVJMcyBmcm9tIGFzc2V0X3F1ZXJ5IHRvb2wgZmlyc3QuIEV4YW1wbGU6IFtcImRiOi8vYXNzZXRzL2ltYWdlcy9vbGQxLnBuZ1wiLCBcImRiOi8vYXNzZXRzL3NjZW5lcy90ZXN0LnNjZW5lXCJdJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBzYXZlX21ldGEgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmxPclVVSUQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Fzc2V0IGlkZW50aWZpZXIgKFJFUVVJUkVEIGZvciBzYXZlX21ldGEgYWN0aW9uKS4gQ2FuIGJlIGFzc2V0IFVSTCBsaWtlIFwiZGI6Ly9hc3NldHMvaW1hZ2UucG5nXCIgb3IgVVVJRCBsaWtlIFwiMTIzNDU2NzgtYWJjZC0xMjM0LTU2NzgtMTIzNDU2Nzg5YWJjXCIuIEdldCBmcm9tIGFzc2V0X3F1ZXJ5IHRvb2wuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NlcmlhbGl6ZWQgbWV0YWRhdGEgY29udGVudCAoUkVRVUlSRUQgZm9yIHNhdmVfbWV0YSBhY3Rpb24pLiBNdXN0IGJlIHZhbGlkIEpTT04gc3RyaW5nIGNvbnRhaW5pbmcgYXNzZXQgbWV0YWRhdGEuIEZvcm1hdCBkZXBlbmRzIG9uIGFzc2V0IHR5cGUuIEV4YW1wbGU6IFwie1xcXCJpbXBvcnRlclxcXCI6XFxcImltYWdlXFxcIixcXFwic2V0dGluZ3NcXFwiOntcXFwiZm9ybWF0XFxcIjpcXFwicG5nXFxcIn19XCInXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGdlbmVyYXRlX3VybCBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXNzZXQgVVJMIHRvIGdlbmVyYXRlIGF2YWlsYWJsZSBVUkwgZm9yIChnZW5lcmF0ZV91cmwgYWN0aW9uIG9ubHkpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2Fzc2V0X2FuYWx5emUnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQVNTRVQgQU5BTFlTSVM6IEdldCBkZXBlbmRlbmNpZXMgb3IgZXhwb3J0IG1hbmlmZXN0cy4gVXNlIHRoaXMgdG8gdW5kZXJzdGFuZCBhc3NldCByZWxhdGlvbnNoaXBzIGFuZCBnZW5lcmF0ZSBwcm9qZWN0IHJlcG9ydHMuIFdPUktGTE9XOiBVc2UgZGVwZW5kZW5jaWVzIHRvIHRyYWNlIGFzc2V0IHVzYWdlLCB1c2UgbWFuaWZlc3QgdG8gZXhwb3J0IGludmVudG9yeS4gTElNSVRBVElPTlM6IFJlZmVyZW5jZSB2YWxpZGF0aW9uIGFuZCB1bnVzZWQgYXNzZXQgZGV0ZWN0aW9uIGFyZSBkaXNhYmxlZCBkdWUgdG8gQVBJIGNvbnN0cmFpbnRzLicsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnZGVwZW5kZW5jaWVzJywgJ21hbmlmZXN0J10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBbmFseXNpcyB0eXBlOiBcImRlcGVuZGVuY2llc1wiID0gdHJhY2Ugd2hpY2ggYXNzZXRzIHRoaXMgYXNzZXQgZGVwZW5kcyBvbiAocmVxdWlyZXMgdXJsIHBhcmFtZXRlcikgfCBcIm1hbmlmZXN0XCIgPSBnZW5lcmF0ZSBjb21wbGV0ZSBhc3NldCBpbnZlbnRvcnkgcmVwb3J0IGZvciBmb2xkZXIgKG9wdGlvbmFsIGZvbGRlciBwYXJhbWV0ZXIsIG91dHB1dHMgSlNPTi9DU1YvWE1MIGZvcm1hdCknXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29tbW9uIHBhcmFtZXRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGFyZ2V0IGZvbGRlciBwYXRoIHRvIGFuYWx5emUgKGJvdGggYWN0aW9ucykuIERlZmF1bHQ6IFwiZGI6Ly9hc3NldHNcIiBhbmFseXplcyBlbnRpcmUgcHJvamVjdC4gRXhhbXBsZXM6IFwiZGI6Ly9hc3NldHMvc2NlbmVzXCIgZm9yIHNjZW5lcyBvbmx5LCBcImRiOi8vYXNzZXRzL3RleHR1cmVzXCIgZm9yIHRleHR1cmVzIG9ubHkuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAnZGI6Ly9hc3NldHMnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGRlcGVuZGVuY2llcyBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXNzZXQgVVJMIHRvIGFuYWx5emUgZGVwZW5kZW5jaWVzIGZvciAoUkVRVUlSRUQgZm9yIGRlcGVuZGVuY2llcyBhY3Rpb24pLiBNdXN0IGJlIHZhbGlkIENvY29zIGFzc2V0IFVSTCBsaWtlIFwiZGI6Ly9hc3NldHMvc2NlbmVzL0dhbWUuc2NlbmVcIiBvciBcImRiOi8vYXNzZXRzL3ByZWZhYnMvUGxheWVyLnByZWZhYlwiLiBHZXQgVVJMIGZyb20gYXNzZXRfcXVlcnkgdG9vbCBmaXJzdC4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVlcDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0luY2x1ZGUgaW5kaXJlY3QgZGVwZW5kZW5jaWVzIChkZXBlbmRlbmNpZXMgYWN0aW9uIG9ubHkpLiB0cnVlID0gc2hvdyBhbGwgbmVzdGVkIGRlcGVuZGVuY2llcyByZWN1cnNpdmVseSwgZmFsc2UgPSBzaG93IG9ubHkgZGlyZWN0IGRlcGVuZGVuY2llcy4gUmVjb21tZW5kZWQ6IHRydWUgZm9yIGNvbXBsZXRlIGFuYWx5c2lzLicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciB1bnVzZWQgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlU3ViZm9sZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdG8gaW5jbHVkZSBzdWJmb2xkZXJzICh1bnVzZWQgYWN0aW9uIG9ubHkpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIG1hbmlmZXN0IGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdPdXRwdXQgZm9ybWF0IGZvciBtYW5pZmVzdCAobWFuaWZlc3QgYWN0aW9uIG9ubHkpLiBcImpzb25cIiA9IHN0cnVjdHVyZWQgZGF0YSBmb3IgQVBJcywgXCJjc3ZcIiA9IHNwcmVhZHNoZWV0IGNvbXBhdGlibGUsIFwieG1sXCIgPSBsZWdhY3kgc3lzdGVtIGludGVncmF0aW9uLicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydqc29uJywgJ2NzdicsICd4bWwnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAnanNvbidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlTWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJbmNsdWRlIGRldGFpbGVkIG1ldGFkYXRhIGluIG1hbmlmZXN0IChtYW5pZmVzdCBhY3Rpb24gb25seSkuIHRydWUgPSBmdWxsIGFzc2V0IGluZm9ybWF0aW9uIGluY2x1ZGluZyBpbXBvcnQgc2V0dGluZ3MsIGZhbHNlID0gYmFzaWMgaW5mbyBvbmx5IChuYW1lLCBwYXRoLCB0eXBlLCBVVUlEKS4gTm90ZTogQ3VycmVudGx5IGxpbWl0ZWQgYnkgQVBJIGF2YWlsYWJpbGl0eS4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2FjdGlvbiddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIENPTU1FTlRFRCBPVVQ6IGFzc2V0X29wdGltaXplIC0gVGV4dHVyZSBjb21wcmVzc2lvbiByZXF1aXJlcyBpbWFnZSBwcm9jZXNzaW5nIEFQSXMgbm90IGF2YWlsYWJsZSBpbiBDb2NvcyBDcmVhdG9yIE1DUFxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXNzZXRfb3B0aW1pemUnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQVNTRVQgT1BUSU1JWkFUSU9OOiBDb21wcmVzcyB0ZXh0dXJlcyBhbmQgb3B0aW1pemUgYXNzZXRzIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UuIERJU0FCTEVEIC0gTm8gaW1hZ2UgcHJvY2Vzc2luZyBBUElzIGF2YWlsYWJsZS4nLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2NvbXByZXNzX3RleHR1cmVzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBY3Rpb246IFwiY29tcHJlc3NfdGV4dHVyZXNcIiA9IGJhdGNoIGNvbXByZXNzIHRleHR1cmUgYXNzZXRzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdhc3NldF9zeXN0ZW0nLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQVNTRVQgU1lTVEVNOiBDaGVjayBhc3NldCBkYXRhYmFzZSBzdGF0dXMsIHJlZnJlc2ggYXNzZXRzLCBvciBvcGVuIGFzc2V0cyB3aXRoIGV4dGVybmFsIHByb2dyYW1zLiBVc2UgdGhpcyBmb3Igc3lzdGVtLWxldmVsIGFzc2V0IG9wZXJhdGlvbnMuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydjaGVja19yZWFkeScsICdvcGVuX2V4dGVybmFsJywgJ3JlZnJlc2gnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FjdGlvbjogXCJjaGVja19yZWFkeVwiID0gY2hlY2sgaWYgYXNzZXQgZGF0YWJhc2UgaXMgcmVhZHkgfCBcIm9wZW5fZXh0ZXJuYWxcIiA9IG9wZW4gYXNzZXQgd2l0aCBleHRlcm5hbCBwcm9ncmFtIHwgXCJyZWZyZXNoXCIgPSByZWZyZXNoIGFzc2V0IGRhdGFiYXNlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXNzZXQgVVJMIHRvIG9wZW4gKG9wZW5fZXh0ZXJuYWwgYWN0aW9uIG9ubHkpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU3BlY2lmaWMgZm9sZGVyIHRvIHJlZnJlc2ggKHJlZnJlc2ggYWN0aW9uIG9ubHkpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2Fzc2V0X3F1ZXJ5JyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FTU0VUIFFVRVJZOiBTZWFyY2gsIGdldCBpbmZvcm1hdGlvbiwgYW5kIGZpbmQgYXNzZXRzIGJ5IHZhcmlvdXMgY3JpdGVyaWEuIFVzZSB0aGlzIGZvciBhc3NldCBkaXNjb3ZlcnkgYW5kIGRldGFpbGVkIGluZm9ybWF0aW9uIHJldHJpZXZhbC4nLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2dldF9pbmZvJywgJ2dldF9hc3NldHMnLCAnZmluZF9ieV9uYW1lJywgJ2dldF9kZXRhaWxzJywgJ3F1ZXJ5X3BhdGgnLCAncXVlcnlfdXVpZCcsICdxdWVyeV91cmwnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1F1ZXJ5IGFjdGlvbiB0byBwZXJmb3JtJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBnZXRfaW5mbyBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0UGF0aDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXNzZXQgcGF0aCAoZ2V0X2luZm8vZ2V0X2RldGFpbHMgYWN0aW9ucyBvbmx5KSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgZ2V0X2Fzc2V0cyBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2FsbCcsICdzY2VuZScsICdwcmVmYWInLCAnc2NyaXB0JywgJ3RleHR1cmUnLCAnbWF0ZXJpYWwnLCAnbWVzaCcsICdhdWRpbycsICdhbmltYXRpb24nLCAnZWZmZWN0JywgJ2NodW5rJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBc3NldCB0eXBlIGZpbHRlciAoZ2V0X2Fzc2V0cyBhY3Rpb24gb25seSkuIFN1cHBvcnRzIENvY29zIGJ1aWx0LWluIHR5cGVzIGxpa2UgZWZmZWN0IGFuZCBjaHVuay4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdhbGwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZWFyY2ggc2NvcGUgKGdldF9hc3NldHMvZmluZF9ieV9uYW1lIGFjdGlvbnMpLiBPcHRpb25zOiBcImRiOi8vYXNzZXRzXCIgPSB1c2VyIGFzc2V0cyBvbmx5LCBcImRiOi8vaW50ZXJuYWxcIiA9IGJ1aWx0LWluIGFzc2V0cyBvbmx5LCBcImFsbFwiID0gYm90aCB1c2VyIGFuZCBidWlsdC1pbiBhc3NldHMuIERlZmF1bHQgc2VhcmNoZXMgYm90aCB1c2VyIGFuZCBidWlsdC1pbi4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdkYjovL2Fzc2V0cydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgZmluZF9ieV9uYW1lIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXNzZXQgbmFtZSB0byBzZWFyY2ggZm9yIChmaW5kX2J5X25hbWUgYWN0aW9uIG9ubHkpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0TWF0Y2g6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRvIHVzZSBleGFjdCBuYW1lIG1hdGNoaW5nIChmaW5kX2J5X25hbWUgYWN0aW9uIG9ubHkpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0VHlwZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnYWxsJywgJ3NjZW5lJywgJ3ByZWZhYicsICdzY3JpcHQnLCAndGV4dHVyZScsICdtYXRlcmlhbCcsICdtZXNoJywgJ2F1ZGlvJywgJ2FuaW1hdGlvbicsICdzcHJpdGVGcmFtZSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRmlsdGVyIGJ5IGFzc2V0IHR5cGUgKGZpbmRfYnlfbmFtZSBhY3Rpb24gb25seSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdhbGwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4UmVzdWx0czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWF4aW11bSBudW1iZXIgb2YgcmVzdWx0cyAoZmluZF9ieV9uYW1lIGFjdGlvbiBvbmx5KScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogMjBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgZ2V0X2RldGFpbHMgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlU3ViQXNzZXRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSW5jbHVkZSBzdWItYXNzZXRzIGxpa2Ugc3ByaXRlRnJhbWUgKGdldF9kZXRhaWxzIGFjdGlvbiBvbmx5KScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBxdWVyeSBhY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Fzc2V0IFVSTCAocXVlcnlfcGF0aC9xdWVyeV91dWlkIGFjdGlvbnMgb25seSknXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXNzZXQgVVVJRCAocXVlcnlfdXJsIGFjdGlvbiBvbmx5KSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYWN0aW9uJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdhc3NldF9vcGVyYXRpb25zJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FTU0VUIE9QRVJBVElPTlM6IENyZWF0ZSwgY29weSwgbW92ZSwgZGVsZXRlLCBzYXZlLCBhbmQgaW1wb3J0IGFzc2V0cy4gVXNlIHRoaXMgZm9yIGFsbCBhc3NldCBmaWxlIG9wZXJhdGlvbnMgYW5kIG1vZGlmaWNhdGlvbnMuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydjcmVhdGUnLCAnY29weScsICdtb3ZlJywgJ2RlbGV0ZScsICdzYXZlJywgJ3JlaW1wb3J0JywgJ2ltcG9ydCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXNzZXQgb3BlcmF0aW9uIHRvIHBlcmZvcm0nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGNyZWF0ZSBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXNzZXQgVVJMIChjcmVhdGUvZGVsZXRlL3NhdmUvcmVpbXBvcnQgYWN0aW9ucyknXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRmlsZSBjb250ZW50IC0gbnVsbCBmb3IgZm9sZGVyIChjcmVhdGUvc2F2ZSBhY3Rpb25zKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyd3JpdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdPdmVyd3JpdGUgZXhpc3RpbmcgZmlsZSAoY3JlYXRlL2NvcHkvbW92ZSBhY3Rpb25zKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgY29weS9tb3ZlIGFjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU291cmNlIGFzc2V0IFVSTCAoY29weS9tb3ZlIGFjdGlvbnMpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGFyZ2V0IGxvY2F0aW9uIFVSTCAoY29weS9tb3ZlIGFjdGlvbnMpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBpbXBvcnQgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VQYXRoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTb3VyY2UgZmlsZSBwYXRoIChpbXBvcnQgYWN0aW9uIG9ubHkpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEZvbGRlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGFyZ2V0IGZvbGRlciBpbiBhc3NldHMgKGltcG9ydCBhY3Rpb24gb25seSknXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2FjdGlvbiddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGFzeW5jIGV4ZWN1dGUodG9vbE5hbWU6IHN0cmluZywgYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgc3dpdGNoICh0b29sTmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnYXNzZXRfbWFuYWdlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5oYW5kbGVBc3NldE1hbmFnZShhcmdzKTtcbiAgICAgICAgICAgIGNhc2UgJ2Fzc2V0X2FuYWx5emUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmhhbmRsZUFzc2V0QW5hbHl6ZShhcmdzKTtcbiAgICAgICAgICAgIGNhc2UgJ2Fzc2V0X3N5c3RlbSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlQXNzZXRTeXN0ZW0oYXJncyk7XG4gICAgICAgICAgICBjYXNlICdhc3NldF9xdWVyeSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlQXNzZXRRdWVyeShhcmdzKTtcbiAgICAgICAgICAgIGNhc2UgJ2Fzc2V0X29wZXJhdGlvbnMnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmhhbmRsZUFzc2V0T3BlcmF0aW9ucyhhcmdzKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHRvb2w6ICR7dG9vbE5hbWV9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDmlrDnmoTmlbTlkIjlpITnkIblh73mlbBcbiAgICBwcml2YXRlIGFzeW5jIGhhbmRsZUFzc2V0TWFuYWdlKGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2ltcG9ydCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYmF0Y2hJbXBvcnRBc3NldHMoYXJncy5hc3NldHMsIGFyZ3Mub3ZlcndyaXRlKTtcbiAgICAgICAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYmF0Y2hEZWxldGVBc3NldHMoYXJncy51cmxzKTtcbiAgICAgICAgICAgIGNhc2UgJ3NhdmVfbWV0YSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2F2ZUFzc2V0TWV0YShhcmdzLnVybE9yVVVJRCwgYXJncy5jb250ZW50KTtcbiAgICAgICAgICAgIGNhc2UgJ2dlbmVyYXRlX3VybCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2VuZXJhdGVBdmFpbGFibGVVcmwoYXJncy51cmwpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIGFzc2V0IG1hbmFnZSBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlQXNzZXRBbmFseXplKGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIC8vIGNhc2UgJ3ZhbGlkYXRlX3JlZnMnOiAvLyBDT01NRU5URUQgT1VUIC0gUmVxdWlyZXMgY29tcGxleCBwcm9qZWN0IGFuYWx5c2lzXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGF3YWl0IHRoaXMudmFsaWRhdGVBc3NldFJlZmVyZW5jZXMoYXJncy5mb2xkZXIpO1xuICAgICAgICAgICAgY2FzZSAnZGVwZW5kZW5jaWVzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRBc3NldERlcGVuZGVuY2llcyhhcmdzLnVybCwgYXJncy5kZWVwKTtcbiAgICAgICAgICAgIC8vIGNhc2UgJ3VudXNlZCc6IC8vIENPTU1FTlRFRCBPVVQgLSBSZXF1aXJlcyBjb21wbGV4IHByb2plY3QgYW5hbHlzaXNcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRVbnVzZWRBc3NldHMoYXJncy5mb2xkZXIsIGFyZ3MuaW5jbHVkZVN1YmZvbGRlcnMpO1xuICAgICAgICAgICAgY2FzZSAnbWFuaWZlc3QnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmV4cG9ydEFzc2V0TWFuaWZlc3QoYXJncy5mb2xkZXIsIGFyZ3MuZm9ybWF0LCBhcmdzLmluY2x1ZGVNZXRhZGF0YSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYFVua25vd24gYXNzZXQgYW5hbHl6ZSBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIENPTU1FTlRFRCBPVVQgLSBObyBpbWFnZSBwcm9jZXNzaW5nIEFQSXMgYXZhaWxhYmxlIGluIENvY29zIENyZWF0b3IgTUNQXG4gICAgLypcbiAgICBwcml2YXRlIGFzeW5jIGhhbmRsZUFzc2V0T3B0aW1pemUoYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgeyBhY3Rpb24gfSA9IGFyZ3M7XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnY29tcHJlc3NfdGV4dHVyZXMnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNvbXByZXNzVGV4dHVyZXMoYXJncy5mb2xkZXIsIGFyZ3MucXVhbGl0eSwgYXJncy5mb3JtYXQsIGFyZ3MucmVjdXJzaXZlKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgVW5rbm93biBhc3NldCBvcHRpbWl6ZSBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAqL1xuXG4gICAgcHJpdmF0ZSBhc3luYyBoYW5kbGVBc3NldFN5c3RlbShhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCB7IGFjdGlvbiB9ID0gYXJncztcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlICdjaGVja19yZWFkeSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucXVlcnlBc3NldERiUmVhZHkoKTtcbiAgICAgICAgICAgIGNhc2UgJ29wZW5fZXh0ZXJuYWwnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9wZW5Bc3NldEV4dGVybmFsKGFyZ3MudXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ3JlZnJlc2gnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlZnJlc2hBc3NldHMoYXJncy5mb2xkZXIpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIGFzc2V0IHN5c3RlbSBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlQXNzZXRRdWVyeShhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCB7IGFjdGlvbiB9ID0gYXJncztcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlICdnZXRfaW5mbyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0QXNzZXRJbmZvKGFyZ3MuYXNzZXRQYXRoKTtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9hc3NldHMnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldEFzc2V0cyhhcmdzLnR5cGUsIGFyZ3MuZm9sZGVyKTtcbiAgICAgICAgICAgIGNhc2UgJ2ZpbmRfYnlfbmFtZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZmluZEFzc2V0QnlOYW1lKGFyZ3MpO1xuICAgICAgICAgICAgY2FzZSAnZ2V0X2RldGFpbHMnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldEFzc2V0RGV0YWlscyhhcmdzLmFzc2V0UGF0aCwgYXJncy5pbmNsdWRlU3ViQXNzZXRzKTtcbiAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5X3BhdGgnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnF1ZXJ5QXNzZXRQYXRoKGFyZ3MudXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5X3V1aWQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnF1ZXJ5QXNzZXRVdWlkKGFyZ3MudXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5X3VybCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucXVlcnlBc3NldFVybChhcmdzLnV1aWQpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIGFzc2V0IHF1ZXJ5IGFjdGlvbjogJHthY3Rpb259YCB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBoYW5kbGVBc3NldE9wZXJhdGlvbnMoYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgeyBhY3Rpb24gfSA9IGFyZ3M7XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnY3JlYXRlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jcmVhdGVBc3NldChhcmdzLnVybCwgYXJncy5jb250ZW50LCBhcmdzLm92ZXJ3cml0ZSk7XG4gICAgICAgICAgICBjYXNlICdjb3B5JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jb3B5QXNzZXQoYXJncy5zb3VyY2UsIGFyZ3MudGFyZ2V0LCBhcmdzLm92ZXJ3cml0ZSk7XG4gICAgICAgICAgICBjYXNlICdtb3ZlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5tb3ZlQXNzZXQoYXJncy5zb3VyY2UsIGFyZ3MudGFyZ2V0LCBhcmdzLm92ZXJ3cml0ZSk7XG4gICAgICAgICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmRlbGV0ZUFzc2V0KGFyZ3MudXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ3NhdmUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNhdmVBc3NldChhcmdzLnVybCwgYXJncy5jb250ZW50KTtcbiAgICAgICAgICAgIGNhc2UgJ3JlaW1wb3J0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5yZWltcG9ydEFzc2V0KGFyZ3MudXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ2ltcG9ydCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaW1wb3J0QXNzZXQoYXJncy5zb3VyY2VQYXRoLCBhcmdzLnRhcmdldEZvbGRlcik7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYFVua25vd24gYXNzZXQgb3BlcmF0aW9uIGFjdGlvbjogJHthY3Rpb259YCB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g5Y6f5pyJ55qE5a6e546w5pa55rOV5L+d5oyB5LiN5Y+Y77yI5LuO5Y6f5paH5Lu25aSN5Yi277yJXG4gICAgcHJpdmF0ZSBhc3luYyBzYXZlQXNzZXRNZXRhKHVybE9yVVVJRDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAnc2F2ZS1hc3NldC1tZXRhJywgdXJsT3JVVUlELCBjb250ZW50KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIEFzc2V0IG1ldGEgc2F2ZWQgc3VjY2Vzc2Z1bGx5YCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IHVybE9yVVVJRCwgcmVzdWx0IH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBgRmFpbGVkIHRvIHNhdmUgYXNzZXQgbWV0YTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2VuZXJhdGVBdmFpbGFibGVVcmwodXJsOiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYXZhaWxhYmxlVXJsID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAnZ2VuZXJhdGUtYXZhaWxhYmxlLXVybCcsIHVybCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBBdmFpbGFibGUgVVJMIGdlbmVyYXRlZGAsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBvcmlnaW5hbFVybDogdXJsLCBhdmFpbGFibGVVcmwgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGBGYWlsZWQgdG8gZ2VuZXJhdGUgYXZhaWxhYmxlIFVSTDogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcXVlcnlBc3NldERiUmVhZHkoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGlzUmVhZHkgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdhc3NldC1kYicsICdxdWVyeS1yZWFkeScpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDinIUgQXNzZXQgZGF0YWJhc2Ugc3RhdHVzOiAke2lzUmVhZHkgPyAnUmVhZHknIDogJ05vdCBSZWFkeSd9YCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IHJlYWR5OiBpc1JlYWR5IH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBgRmFpbGVkIHRvIGNoZWNrIGFzc2V0IGRhdGFiYXNlIHN0YXR1czogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgb3BlbkFzc2V0RXh0ZXJuYWwodXJsOiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAnb3Blbi1hc3NldC1leHRlcm5hbCcsIHVybCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBBc3NldCBvcGVuZWQgZXh0ZXJuYWxseWAsXG4gICAgICAgICAgICAgICAgZGF0YTogeyB1cmwsIHJlc3VsdCB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byBvcGVuIGFzc2V0IGV4dGVybmFsbHk6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJhdGNoSW1wb3J0QXNzZXRzKGFzc2V0czogQXJyYXk8eyBzb3VyY2VQYXRoOiBzdHJpbmc7IHRhcmdldFVybDogc3RyaW5nIH0+LCBvdmVyd3JpdGU6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdHM6IGFueVtdID0gW107XG4gICAgICAgIGxldCBzdWNjZXNzQ291bnQgPSAwO1xuICAgICAgICBsZXQgZXJyb3JDb3VudCA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBhc3NldCBvZiBhc3NldHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgKEVkaXRvci5NZXNzYWdlLnJlcXVlc3QgYXMgYW55KSgnYXNzZXQtZGInLCAnY3JlYXRlLWFzc2V0JywgYXNzZXQudGFyZ2V0VXJsLCB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogYXNzZXQuc291cmNlUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcmVuYW1lOiAhKG92ZXJ3cml0ZSB8fCBmYWxzZSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VQYXRoOiBhc3NldC5zb3VyY2VQYXRoLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRVcmw6IGFzc2V0LnRhcmdldFVybCxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc3VjY2Vzc0NvdW50Kys7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZVBhdGg6IGFzc2V0LnNvdXJjZVBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFVybDogYXNzZXQudGFyZ2V0VXJsLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGVycm9yQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiBlcnJvckNvdW50ID09PSAwLFxuICAgICAgICAgICAgbWVzc2FnZTogYOKchSBJbXBvcnRlZCAke3N1Y2Nlc3NDb3VudH0vJHthc3NldHMubGVuZ3RofSBhc3NldHNgLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHRvdGFsUmVxdWVzdGVkOiBhc3NldHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3NDb3VudCxcbiAgICAgICAgICAgICAgICBlcnJvckNvdW50LFxuICAgICAgICAgICAgICAgIHJlc3VsdHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGJhdGNoRGVsZXRlQXNzZXRzKHVybHM6IHN0cmluZ1tdKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0czogYW55W10gPSBbXTtcbiAgICAgICAgbGV0IHN1Y2Nlc3NDb3VudCA9IDA7XG4gICAgICAgIGxldCBlcnJvckNvdW50ID0gMDtcblxuICAgICAgICBmb3IgKGNvbnN0IHVybCBvZiB1cmxzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ2RlbGV0ZS1hc3NldCcsIHVybCk7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzdWNjZXNzQ291bnQrKztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGVycm9yQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiBlcnJvckNvdW50ID09PSAwLFxuICAgICAgICAgICAgbWVzc2FnZTogYOKchSBEZWxldGVkICR7c3VjY2Vzc0NvdW50fS8ke3VybHMubGVuZ3RofSBhc3NldHNgLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHRvdGFsUmVxdWVzdGVkOiB1cmxzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzQ291bnQsXG4gICAgICAgICAgICAgICAgZXJyb3JDb3VudCxcbiAgICAgICAgICAgICAgICByZXN1bHRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQ09NTUVOVEVEIE9VVCAtIFJlcXVpcmVzIGNvbXBsZXggcHJvamVjdCBhbmFseXNpcyBub3QgYXZhaWxhYmxlIGluIGN1cnJlbnQgQ29jb3MgQ3JlYXRvciBNQ1AgQVBJc1xuICAgIC8qXG4gICAgcHJpdmF0ZSBhc3luYyB2YWxpZGF0ZUFzc2V0UmVmZXJlbmNlcyhmb2xkZXI6IHN0cmluZyA9ICdkYjovL2Fzc2V0cycpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogJ0Fzc2V0IHJlZmVyZW5jZSB2YWxpZGF0aW9uIHJlcXVpcmVzIGNvbXBsZXggcHJvamVjdCBhbmFseXNpcyBub3QgYXZhaWxhYmxlIGluIGN1cnJlbnQgQ29jb3MgQ3JlYXRvciBNQ1AgaW1wbGVtZW50YXRpb24uJ1xuICAgICAgICB9O1xuICAgIH1cbiAgICAqL1xuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRBc3NldERlcGVuZGVuY2llcyh1cmw6IHN0cmluZywgZGVlcDogYm9vbGVhbiA9IHRydWUpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0gYXdhaXQgKEVkaXRvci5NZXNzYWdlLnJlcXVlc3QgYXMgYW55KSgnYXNzZXQtZGInLCAncXVlcnktYXNzZXQtZGVwZW5kZW5jaWVzJywgdXJsLCBkZWVwKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIEFzc2V0IGRlcGVuZGVuY2llcyByZXRyaWV2ZWRgLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICBkZWVwLFxuICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXMsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBBcnJheS5pc0FycmF5KGRlcGVuZGVuY2llcykgPyBkZXBlbmRlbmNpZXMubGVuZ3RoIDogMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBgRmFpbGVkIHRvIGdldCBhc3NldCBkZXBlbmRlbmNpZXM6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDT01NRU5URUQgT1VUIC0gUmVxdWlyZXMgY29tcHJlaGVuc2l2ZSBwcm9qZWN0IGFuYWx5c2lzIG5vdCBhdmFpbGFibGUgaW4gY3VycmVudCBDb2NvcyBDcmVhdG9yIE1DUCBBUElzXG4gICAgLypcbiAgICBwcml2YXRlIGFzeW5jIGdldFVudXNlZEFzc2V0cyhmb2xkZXI6IHN0cmluZyA9ICdkYjovL2Fzc2V0cycsIGluY2x1ZGVTdWJmb2xkZXJzOiBib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiAnVW51c2VkIGFzc2V0IGRldGVjdGlvbiByZXF1aXJlcyBjb21wcmVoZW5zaXZlIHByb2plY3QgYW5hbHlzaXMgbm90IGF2YWlsYWJsZSBpbiBjdXJyZW50IENvY29zIENyZWF0b3IgTUNQIGltcGxlbWVudGF0aW9uLidcbiAgICAgICAgfTtcbiAgICB9XG4gICAgKi9cblxuICAgIC8vIENPTU1FTlRFRCBPVVQgLSBUZXh0dXJlIGNvbXByZXNzaW9uIHJlcXVpcmVzIGltYWdlIHByb2Nlc3NpbmcgQVBJcyBub3QgYXZhaWxhYmxlIGluIENvY29zIENyZWF0b3IgTUNQXG4gICAgLypcbiAgICBwcml2YXRlIGFzeW5jIGNvbXByZXNzVGV4dHVyZXMoZm9sZGVyOiBzdHJpbmcgPSAnZGI6Ly9hc3NldHMnLCBxdWFsaXR5OiBudW1iZXIgPSA4MCwgZm9ybWF0OiBzdHJpbmcgPSAnanBnJywgcmVjdXJzaXZlOiBib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiAnVGV4dHVyZSBjb21wcmVzc2lvbiByZXF1aXJlcyBpbWFnZSBwcm9jZXNzaW5nIGNhcGFiaWxpdGllcyBub3QgYXZhaWxhYmxlIGluIGN1cnJlbnQgQ29jb3MgQ3JlYXRvciBNQ1AgaW1wbGVtZW50YXRpb24uJ1xuICAgICAgICB9O1xuICAgIH1cbiAgICAqL1xuXG4gICAgcHJpdmF0ZSBhc3luYyBleHBvcnRBc3NldE1hbmlmZXN0KGZvbGRlcjogc3RyaW5nID0gJ2RiOi8vYXNzZXRzJywgZm9ybWF0OiBzdHJpbmcgPSAnanNvbicsIF9pbmNsdWRlTWV0YWRhdGE6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyDojrflj5blrp7pmYXnmoTotYTmupDmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGFsbEFzc2V0c1Jlc3BvbnNlID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAncXVlcnktYXNzZXRzJyk7XG4gICAgICAgICAgICBjb25zdCBhbGxBc3NldHMgPSBBcnJheS5pc0FycmF5KGFsbEFzc2V0c1Jlc3BvbnNlKSA/IGFsbEFzc2V0c1Jlc3BvbnNlIDogW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOi/h+a7pOaMh+WumuaWh+S7tuWkueeahOi1hOa6kFxuICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRBc3NldHMgPSBhbGxBc3NldHMuZmlsdGVyKGFzc2V0ID0+IFxuICAgICAgICAgICAgICAgIGFzc2V0LnBhdGggJiYgYXNzZXQucGF0aC5pbmNsdWRlcyhmb2xkZXIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDmnoTlu7rotYTmupDmuIXljZUgLSDlj6rljIXlkKvln7rnoYDkv6Hmga/vvIzkuI3ljIXlkKvmqKHmi5/nmoTlhYPmlbDmja5cbiAgICAgICAgICAgIGNvbnN0IGFzc2V0cyA9IGZpbHRlcmVkQXNzZXRzLm1hcChhc3NldCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogYXNzZXQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogYXNzZXQucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogYXNzZXQudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogYXNzZXQudXVpZFxuICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiBpbmNsdWRlTWV0YWRhdGEgcGFyYW1ldGVyIGlnbm9yZWQgLSBkZXRhaWxlZCBtZXRhZGF0YSByZXF1aXJlcyBBUElzIG5vdCBhdmFpbGFibGUgaW4gY3VycmVudCBNQ1BcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG1hbmlmZXN0ID0ge1xuICAgICAgICAgICAgICAgIGZvbGRlcixcbiAgICAgICAgICAgICAgICBmb3JtYXQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1ldGFkYXRhOiBmYWxzZSwgLy8gQWx3YXlzIGZhbHNlIC0gbWV0YWRhdGEgQVBJcyBub3QgYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgYXNzZXRzLFxuICAgICAgICAgICAgICAgIGV4cG9ydERhdGU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICB0b3RhbEFzc2V0czogYXNzZXRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBzdW1tYXJ5OiB7XG4gICAgICAgICAgICAgICAgICAgIGJ5VHlwZTogdGhpcy5ncm91cEFzc2V0c0J5VHlwZShhc3NldHMpXG4gICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHRvdGFsU2l6ZSBjYWxjdWxhdGlvbiByZW1vdmVkIC0gcmVxdWlyZXMgZmlsZSBzeXN0ZW0gQVBJcyBub3QgYXZhaWxhYmxlIGluIE1DUFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIEFzc2V0IG1hbmlmZXN0IGV4cG9ydGVkIHdpdGggJHthc3NldHMubGVuZ3RofSBhc3NldHNgLFxuICAgICAgICAgICAgICAgIGRhdGE6IG1hbmlmZXN0XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byBleHBvcnQgYXNzZXQgbWFuaWZlc3Q6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBncm91cEFzc2V0c0J5VHlwZShhc3NldHM6IGFueVtdKTogYW55IHtcbiAgICAgICAgY29uc3QgZ3JvdXBlZDogYW55ID0ge307XG4gICAgICAgIGFzc2V0cy5mb3JFYWNoKGFzc2V0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBhc3NldC50eXBlIHx8ICdVbmtub3duJztcbiAgICAgICAgICAgIGdyb3VwZWRbdHlwZV0gPSAoZ3JvdXBlZFt0eXBlXSB8fCAwKSArIDE7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZ3JvdXBlZDtcbiAgICB9XG5cbiAgICAvLyBOZXcgYXNzZXQgb3BlcmF0aW9uIG1ldGhvZHMgbW92ZWQgZnJvbSBwcm9qZWN0LXRvb2xzLnRzXG4gICAgcHJpdmF0ZSBhc3luYyByZWZyZXNoQXNzZXRzKGZvbGRlcj86IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHRhcmdldFBhdGggPSBmb2xkZXIgfHwgJ2RiOi8vYXNzZXRzJztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ3JlZnJlc2gtYXNzZXQnLCB0YXJnZXRQYXRoKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIEFzc2V0cyByZWZyZXNoZWQgaW46ICR7dGFyZ2V0UGF0aH1gLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgZm9sZGVyOiB0YXJnZXRQYXRoIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGltcG9ydEFzc2V0KHNvdXJjZVBhdGg6IHN0cmluZywgdGFyZ2V0Rm9sZGVyOiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoc291cmNlUGF0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ1NvdXJjZSBmaWxlIG5vdCBmb3VuZCcgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gcGF0aC5iYXNlbmFtZShzb3VyY2VQYXRoKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0UGF0aCA9IHRhcmdldEZvbGRlci5zdGFydHNXaXRoKCdkYjovLycpID9cbiAgICAgICAgICAgIHRhcmdldEZvbGRlciA6IGBkYjovL2Fzc2V0cy8ke3RhcmdldEZvbGRlcn1gO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQ6IGFueSA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ2ltcG9ydC1hc3NldCcsIHNvdXJjZVBhdGgsIGAke3RhcmdldFBhdGh9LyR7ZmlsZU5hbWV9YCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBBc3NldCBpbXBvcnRlZDogJHtmaWxlTmFtZX1gLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogcmVzdWx0LnV1aWQsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IHJlc3VsdC51cmwsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0QXNzZXRJbmZvKGFzc2V0UGF0aDogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFzc2V0SW5mbzogYW55ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAncXVlcnktYXNzZXQtaW5mbycsIGFzc2V0UGF0aCk7XG4gICAgICAgICAgICBpZiAoIWFzc2V0SW5mbykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0Fzc2V0IG5vdCBmb3VuZCcgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaW5mbzogQXNzZXRJbmZvID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IGFzc2V0SW5mby5uYW1lLFxuICAgICAgICAgICAgICAgIHV1aWQ6IGFzc2V0SW5mby51dWlkLFxuICAgICAgICAgICAgICAgIHBhdGg6IGFzc2V0SW5mby51cmwsXG4gICAgICAgICAgICAgICAgdHlwZTogYXNzZXRJbmZvLnR5cGUsXG4gICAgICAgICAgICAgICAgc2l6ZTogYXNzZXRJbmZvLnNpemUsXG4gICAgICAgICAgICAgICAgaXNEaXJlY3Rvcnk6IGFzc2V0SW5mby5pc0RpcmVjdG9yeVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGFzc2V0SW5mby5tZXRhKSB7XG4gICAgICAgICAgICAgICAgaW5mby5tZXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB2ZXI6IGFzc2V0SW5mby5tZXRhLnZlcixcbiAgICAgICAgICAgICAgICAgICAgaW1wb3J0ZXI6IGFzc2V0SW5mby5tZXRhLmltcG9ydGVyXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDinIUgQXNzZXQgaW5mbyByZXRyaWV2ZWQ6ICR7aW5mby5uYW1lfWAsXG4gICAgICAgICAgICAgICAgZGF0YTogaW5mb1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0QXNzZXRzKHR5cGU6IHN0cmluZyA9ICdhbGwnLCBmb2xkZXI6IHN0cmluZyA9ICdkYjovL2Fzc2V0cycpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHBhdHRlcm5zOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgICAgICAvLyDlhrPlrprmkJzntKLojIPlm7RcbiAgICAgICAgICAgIGlmIChmb2xkZXIgPT09ICdhbGwnKSB7XG4gICAgICAgICAgICAgICAgLy8g5pCc57Si55So5oi36LWE5rqQ5ZKM5YaF572u6LWE5rqQXG4gICAgICAgICAgICAgICAgcGF0dGVybnMgPSBbJ2RiOi8vYXNzZXRzLyoqLyonLCAnZGI6Ly9pbnRlcm5hbC8qKi8qJ107XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvbGRlciA9PT0gJ2RiOi8vaW50ZXJuYWwnKSB7XG4gICAgICAgICAgICAgICAgLy8g5Y+q5pCc57Si5YaF572u6LWE5rqQXG4gICAgICAgICAgICAgICAgcGF0dGVybnMgPSBbJ2RiOi8vaW50ZXJuYWwvKiovKiddO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmb2xkZXIgPT09ICdkYjovL2Fzc2V0cycpIHtcbiAgICAgICAgICAgICAgICAvLyDlj6rmkJzntKLnlKjmiLfotYTmupBcbiAgICAgICAgICAgICAgICBwYXR0ZXJucyA9IFsnZGI6Ly9hc3NldHMvKiovKiddO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDmjIflrprmlofku7blpLlcbiAgICAgICAgICAgICAgICBwYXR0ZXJucyA9IFtgJHtmb2xkZXJ9LyoqLypgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5aaC5p6c5oyH5a6a5LqG57G75Z6L77yM5re75Yqg5omp5bGV5ZCN6L+H5rukXG4gICAgICAgICAgICBpZiAodHlwZSAhPT0gJ2FsbCcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlRXh0ZW5zaW9uczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ3NjZW5lJzogJy5zY2VuZScsXG4gICAgICAgICAgICAgICAgICAgICdwcmVmYWInOiAnLnByZWZhYicsXG4gICAgICAgICAgICAgICAgICAgICdzY3JpcHQnOiAnLnt0cyxqc30nLFxuICAgICAgICAgICAgICAgICAgICAndGV4dHVyZSc6ICcue3BuZyxqcGcsanBlZyxnaWYsdGdhLGJtcCxwc2R9JyxcbiAgICAgICAgICAgICAgICAgICAgJ21hdGVyaWFsJzogJy5tdGwnLFxuICAgICAgICAgICAgICAgICAgICAnbWVzaCc6ICcue2ZieCxvYmosZGFlfScsXG4gICAgICAgICAgICAgICAgICAgICdhdWRpbyc6ICcue21wMyxvZ2csd2F2LG00YX0nLFxuICAgICAgICAgICAgICAgICAgICAnYW5pbWF0aW9uJzogJy57YW5pbSxjbGlwfScsXG4gICAgICAgICAgICAgICAgICAgICdlZmZlY3QnOiAnLmVmZmVjdCcsXG4gICAgICAgICAgICAgICAgICAgICdjaHVuayc6ICcuY2h1bmsnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IHR5cGVFeHRlbnNpb25zW3R5cGVdO1xuICAgICAgICAgICAgICAgIGlmIChleHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0dGVybnMgPSBwYXR0ZXJucy5tYXAocGF0dGVybiA9PiBwYXR0ZXJuLnJlcGxhY2UoJy8qKi8qJywgYC8qKi8qJHtleHRlbnNpb259YCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coYFtERUJVR10gU2VhcmNoaW5nIGFzc2V0cyB3aXRoIHBhdHRlcm5zOmAsIHBhdHRlcm5zKTtcblxuICAgICAgICAgICAgLy8g5bm26KGM5p+l6K+i5omA5pyJ5qih5byPXG4gICAgICAgICAgICBjb25zdCBhbGxSZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgcGF0dGVybnMubWFwKHBhdHRlcm4gPT5cbiAgICAgICAgICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAncXVlcnktYXNzZXRzJywgeyBwYXR0ZXJuOiBwYXR0ZXJuIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtERUJVR10gUGF0dGVybiAke3BhdHRlcm59IGZhaWxlZDpgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8g5ZCI5bm257uT5p6c5bm25Y676YeNXG4gICAgICAgICAgICBjb25zdCBjb21iaW5lZFJlc3VsdHMgPSBhbGxSZXN1bHRzLmZsYXQoKTtcbiAgICAgICAgICAgIGNvbnN0IHVuaXF1ZUFzc2V0cyA9IG5ldyBNYXAoKTtcblxuICAgICAgICAgICAgY29tYmluZWRSZXN1bHRzLmZvckVhY2goYXNzZXQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhc3NldCAmJiBhc3NldC51dWlkICYmICF1bmlxdWVBc3NldHMuaGFzKGFzc2V0LnV1aWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaXF1ZUFzc2V0cy5zZXQoYXNzZXQudXVpZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYXNzZXQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IGFzc2V0LnV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBhc3NldC51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhc3NldC50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogKGFzc2V0IGFzIGFueSkuc2l6ZSB8fCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXJlY3Rvcnk6IChhc3NldCBhcyBhbnkpLmlzRGlyZWN0b3J5IHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNCdWlsdEluOiBhc3NldC51cmwuc3RhcnRzV2l0aCgnZGI6Ly9pbnRlcm5hbCcpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBhc3NldHMgPSBBcnJheS5mcm9tKHVuaXF1ZUFzc2V0cy52YWx1ZXMoKSk7XG5cbiAgICAgICAgICAgIC8vIOaMieexu+Wei+WIhue7hOe7n+iuoVxuICAgICAgICAgICAgY29uc3QgdXNlckFzc2V0cyA9IGFzc2V0cy5maWx0ZXIoYSA9PiAhYS5pc0J1aWx0SW4pO1xuICAgICAgICAgICAgY29uc3QgYnVpbHRJbkFzc2V0cyA9IGFzc2V0cy5maWx0ZXIoYSA9PiBhLmlzQnVpbHRJbik7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIEZvdW5kICR7YXNzZXRzLmxlbmd0aH0gYXNzZXRzICgke3VzZXJBc3NldHMubGVuZ3RofSB1c2VyICsgJHtidWlsdEluQXNzZXRzLmxlbmd0aH0gYnVpbHQtaW4pIG9mIHR5cGUgJyR7dHlwZX0nYCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGZvbGRlcjogZm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogYXNzZXRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgdXNlckNvdW50OiB1c2VyQXNzZXRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgYnVpbHRJbkNvdW50OiBidWlsdEluQXNzZXRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBhc3NldHNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjcmVhdGVBc3NldCh1cmw6IHN0cmluZywgY29udGVudDogc3RyaW5nIHwgbnVsbCA9IG51bGwsIG92ZXJ3cml0ZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG92ZXJ3cml0ZTogb3ZlcndyaXRlLFxuICAgICAgICAgICAgcmVuYW1lOiAhb3ZlcndyaXRlXG4gICAgICAgIH07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAnY3JlYXRlLWFzc2V0JywgdXJsLCBjb250ZW50LCBvcHRpb25zKTtcbiAgICAgICAgICAgIGNvbnN0IGFzc2V0VHlwZSA9IGNvbnRlbnQgPT09IG51bGwgPyAnRm9sZGVyJyA6ICdGaWxlJztcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFICR7YXNzZXRUeXBlfSBjcmVhdGVkIHN1Y2Nlc3NmdWxseWAsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB1dWlkOiByZXN1bHQ/LnV1aWQsXG4gICAgICAgICAgICAgICAgICAgIHVybDogcmVzdWx0Py51cmwgfHwgdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBhc3NldFR5cGUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGNvcHlBc3NldChzb3VyY2U6IHN0cmluZywgdGFyZ2V0OiBzdHJpbmcsIG92ZXJ3cml0ZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG92ZXJ3cml0ZTogb3ZlcndyaXRlLFxuICAgICAgICAgICAgcmVuYW1lOiAhb3ZlcndyaXRlXG4gICAgICAgIH07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAnY29weS1hc3NldCcsIHNvdXJjZSwgdGFyZ2V0LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIEFzc2V0IGNvcGllZCBzdWNjZXNzZnVsbHlgLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogcmVzdWx0Py51dWlkLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiByZXN1bHQ/LnVybCB8fCB0YXJnZXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBtb3ZlQXNzZXQoc291cmNlOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nLCBvdmVyd3JpdGU6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvdmVyd3JpdGU6IG92ZXJ3cml0ZSxcbiAgICAgICAgICAgIHJlbmFtZTogIW92ZXJ3cml0ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQ6IGFueSA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ21vdmUtYXNzZXQnLCBzb3VyY2UsIHRhcmdldCwgb3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBBc3NldCBtb3ZlZCBzdWNjZXNzZnVsbHlgLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogcmVzdWx0Py51dWlkLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiByZXN1bHQ/LnVybCB8fCB0YXJnZXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBkZWxldGVBc3NldCh1cmw6IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdhc3NldC1kYicsICdkZWxldGUtYXNzZXQnLCB1cmwpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDinIUgQXNzZXQgZGVsZXRlZCBzdWNjZXNzZnVsbHlgLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgdXJsIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHNhdmVBc3NldCh1cmw6IHN0cmluZywgY29udGVudDogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAnc2F2ZS1hc3NldCcsIHVybCwgY29udGVudCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBBc3NldCBzYXZlZCBzdWNjZXNzZnVsbHlgLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogcmVzdWx0Py51dWlkLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHJlc3VsdD8udXJsIHx8IHVybFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHJlaW1wb3J0QXNzZXQodXJsOiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAncmVpbXBvcnQtYXNzZXQnLCB1cmwpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDinIUgQXNzZXQgcmVpbXBvcnRlZCBzdWNjZXNzZnVsbHlgLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgdXJsIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHF1ZXJ5QXNzZXRQYXRoKHVybDogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFzc2V0UGF0aDogc3RyaW5nIHwgbnVsbCA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ3F1ZXJ5LXBhdGgnLCB1cmwpO1xuICAgICAgICAgICAgaWYgKGFzc2V0UGF0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDinIUgQXNzZXQgcGF0aCByZXRyaWV2ZWRgLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IHVybCwgcGF0aDogYXNzZXRQYXRoIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdBc3NldCBwYXRoIG5vdCBmb3VuZCcgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcXVlcnlBc3NldFV1aWQodXJsOiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdXVpZDogc3RyaW5nIHwgbnVsbCA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ3F1ZXJ5LXV1aWQnLCB1cmwpO1xuICAgICAgICAgICAgaWYgKHV1aWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIEFzc2V0IFVVSUQgcmV0cmlldmVkYCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyB1cmwsIHV1aWQgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0Fzc2V0IFVVSUQgbm90IGZvdW5kJyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBxdWVyeUFzc2V0VXJsKHV1aWQ6IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB1cmw6IHN0cmluZyB8IG51bGwgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdhc3NldC1kYicsICdxdWVyeS11cmwnLCB1dWlkKTtcbiAgICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIEFzc2V0IFVSTCByZXRyaWV2ZWRgLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IHV1aWQsIHVybCB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnQXNzZXQgVVJMIG5vdCBmb3VuZCcgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZmluZEFzc2V0QnlOYW1lKGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgbmFtZSwgZXhhY3RNYXRjaCA9IGZhbHNlLCBhc3NldFR5cGUgPSAnYWxsJywgZm9sZGVyID0gJ2RiOi8vYXNzZXRzJywgbWF4UmVzdWx0cyA9IDIwIH0gPSBhcmdzO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhbGxBc3NldHNSZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0QXNzZXRzKGFzc2V0VHlwZSwgZm9sZGVyKTtcbiAgICAgICAgICAgIGlmICghYWxsQXNzZXRzUmVzcG9uc2Uuc3VjY2VzcyB8fCAhYWxsQXNzZXRzUmVzcG9uc2UuZGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byBnZXQgYXNzZXRzOiAke2FsbEFzc2V0c1Jlc3BvbnNlLmVycm9yfWBcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBhbGxBc3NldHMgPSBhbGxBc3NldHNSZXNwb25zZS5kYXRhLmFzc2V0cyBhcyBhbnlbXTtcbiAgICAgICAgICAgIGxldCBtYXRjaGVkQXNzZXRzOiBhbnlbXSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFzc2V0IG9mIGFsbEFzc2V0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFzc2V0TmFtZSA9IGFzc2V0Lm5hbWU7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZXMgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmIChleGFjdE1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMgPSBhc3NldE5hbWUgPT09IG5hbWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IGFzc2V0TmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKG5hbWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRldGFpbFJlc3BvbnNlID0gYXdhaXQgdGhpcy5nZXRBc3NldEluZm8oYXNzZXQucGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGV0YWlsUmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWRBc3NldHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmFzc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWxzOiBkZXRhaWxSZXNwb25zZS5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWRBc3NldHMucHVzaChhc3NldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZEFzc2V0cy5wdXNoKGFzc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaGVkQXNzZXRzLmxlbmd0aCA+PSBtYXhSZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDinIUgRm91bmQgJHttYXRjaGVkQXNzZXRzLmxlbmd0aH0gYXNzZXRzIG1hdGNoaW5nICcke25hbWV9J2AsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hUZXJtOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICBleGFjdE1hdGNoLFxuICAgICAgICAgICAgICAgICAgICBhc3NldFR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgdG90YWxGb3VuZDogbWF0Y2hlZEFzc2V0cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIG1heFJlc3VsdHMsXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0czogbWF0Y2hlZEFzc2V0c1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogYEFzc2V0IHNlYXJjaCBmYWlsZWQ6ICR7ZXJyb3IubWVzc2FnZX1gXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgYXN5bmMgZ2V0QXNzZXREZXRhaWxzKGFzc2V0UGF0aDogc3RyaW5nLCBpbmNsdWRlU3ViQXNzZXRzOiBib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhc3NldEluZm9SZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0QXNzZXRJbmZvKGFzc2V0UGF0aCk7XG4gICAgICAgICAgICBpZiAoIWFzc2V0SW5mb1Jlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXNzZXRJbmZvUmVzcG9uc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGFzc2V0SW5mbyA9IGFzc2V0SW5mb1Jlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBkZXRhaWxlZEluZm86IGFueSA9IHtcbiAgICAgICAgICAgICAgICAuLi5hc3NldEluZm8sXG4gICAgICAgICAgICAgICAgc3ViQXNzZXRzOiBbXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGluY2x1ZGVTdWJBc3NldHMgJiYgYXNzZXRJbmZvKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFzc2V0SW5mby50eXBlID09PSAnY2MuSW1hZ2VBc3NldCcgfHwgYXNzZXRQYXRoLm1hdGNoKC9cXC4ocG5nfGpwZ3xqcGVnfGdpZnx0Z2F8Ym1wfHBzZCkkL2kpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhc2VVdWlkID0gYXNzZXRJbmZvLnV1aWQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc3NpYmxlU3ViQXNzZXRzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnc3ByaXRlRnJhbWUnLCB1dWlkOiBgJHtiYXNlVXVpZH1AZjk5NDFgLCBzdWZmaXg6ICdAZjk5NDEnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICd0ZXh0dXJlJywgdXVpZDogYCR7YmFzZVV1aWR9QDZjNDhhYCwgc3VmZml4OiAnQDZjNDhhJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAndGV4dHVyZTJEJywgdXVpZDogYCR7YmFzZVV1aWR9QDZjNDhhYCwgc3VmZml4OiAnQDZjNDhhJyB9XG4gICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBzdWJBc3NldCBvZiBwb3NzaWJsZVN1YkFzc2V0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWJBc3NldFVybCA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ3F1ZXJ5LXVybCcsIHN1YkFzc2V0LnV1aWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJBc3NldFVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWxlZEluZm8uc3ViQXNzZXRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogc3ViQXNzZXQudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IHN1YkFzc2V0LnV1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHN1YkFzc2V0VXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VmZml4OiBzdWJBc3NldC5zdWZmaXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3ViLWFzc2V0IGRvZXNuJ3QgZXhpc3QsIHNraXAgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDinIUgQXNzZXQgZGV0YWlscyByZXRyaWV2ZWQuIEZvdW5kICR7ZGV0YWlsZWRJbmZvLnN1YkFzc2V0cy5sZW5ndGh9IHN1Yi1hc3NldHNgLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgYXNzZXRQYXRoLFxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlU3ViQXNzZXRzLFxuICAgICAgICAgICAgICAgICAgICAuLi5kZXRhaWxlZEluZm9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGBGYWlsZWQgdG8gZ2V0IGFzc2V0IGRldGFpbHM6ICR7ZXJyb3IubWVzc2FnZX1gXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==