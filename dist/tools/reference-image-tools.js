"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceImageTools = void 0;
class ReferenceImageTools {
    getTools() {
        return [
            // 1. Reference Image Management - Basic operations
            {
                name: 'reference_image_management',
                description: 'REFERENCE IMAGE MANAGEMENT: Manage overlay reference images in the scene editor for design guidance. WORKFLOW: "add" images from file paths → "switch" between multiple references → "remove" when no longer needed OR "clear_all" to reset. Essential for UI design and scene layout matching.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['add', 'remove', 'switch', 'clear_all'],
                            description: 'Management operation: "add" = add reference images from file paths (requires paths array) | "remove" = remove specific images (requires removePaths array) | "switch" = change active reference (requires path) | "clear_all" = remove all references (no parameters)'
                        },
                        // For add action
                        paths: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Image file paths to add (REQUIRED for add action). Array of absolute paths to image files. Supported formats: PNG, JPG, JPEG, GIF. Examples: ["/Users/username/Desktop/mockup.png", "/path/to/ui-design.jpg"]. Files must exist and be readable.'
                        },
                        // For remove action
                        removePaths: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Image paths to remove (remove action). Array of absolute paths matching previously added images. If empty array [], removes current active reference. Examples: ["/path/to/old-mockup.png"]. Use exact paths from previous add operations.'
                        },
                        // For switch action
                        path: {
                            type: 'string',
                            description: 'Target reference image path (REQUIRED for switch action). Absolute path to previously added reference image. Must match exactly with previously added image path. Example: "/Users/username/Desktop/design-mockup.png".'
                        },
                        sceneUUID: {
                            type: 'string',
                            description: 'Scene UUID for switch operation (switch action, optional). Specifies which scene to switch reference in. If omitted, uses current active scene. Format: "12345678-abcd-1234-5678-123456789abc". Rarely needed unless working with multiple scenes.'
                        }
                    },
                    required: ['action']
                }
            },
            // 2. Reference Image Query - Get information
            {
                name: 'reference_image_query',
                description: 'REFERENCE IMAGE QUERY: Inspect current reference image state and configuration. USAGE: "get_config" for system settings, "get_current" for active image details, "list_all" for inventory of added images. Essential for understanding current reference setup and debugging display issues.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['get_config', 'get_current', 'list_all'],
                            description: 'Query operation: "get_config" = system configuration and settings | "get_current" = active reference image details (path, position, scale, opacity) | "list_all" = complete inventory of added reference images'
                        }
                    },
                    required: ['action']
                }
            },
            // 3. Reference Image Transform - Position, scale, opacity
            {
                name: 'reference_image_transform',
                description: 'REFERENCE IMAGE TRANSFORM: Adjust reference image display properties for better design alignment. USAGE: Fine-tune position, scale, and opacity to overlay images properly with scene content. Essential for precise UI design matching and layout guidance.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['set_position', 'set_scale', 'set_opacity', 'set_data'],
                            description: 'Transform operation: "set_position" = adjust image position (requires x, y) | "set_scale" = resize image (requires sx, sy) | "set_opacity" = change transparency (requires opacity) | "set_data" = modify any property (requires key, value)'
                        },
                        // For set_position action
                        x: {
                            type: 'number',
                            description: 'Horizontal position offset (REQUIRED for set_position). Pixels from center. Positive = right, negative = left. Examples: 100 moves right, -50 moves left. Use for precise image alignment with scene elements.'
                        },
                        y: {
                            type: 'number',
                            description: 'Vertical position offset (REQUIRED for set_position). Pixels from center. Positive = up, negative = down. Examples: 200 moves up, -100 moves down. Coordinate system follows Cocos Creator convention.'
                        },
                        // For set_scale action
                        sx: {
                            type: 'number',
                            description: 'Horizontal scale multiplier (REQUIRED for set_scale). Range: 0.1-10.0. 1.0 = original size, 0.5 = half size, 2.0 = double size. Examples: 0.8 for smaller overlay, 1.2 for slightly larger reference.',
                            minimum: 0.1,
                            maximum: 10
                        },
                        sy: {
                            type: 'number',
                            description: 'Vertical scale multiplier (REQUIRED for set_scale). Range: 0.1-10.0. 1.0 = original size, 0.5 = half size, 2.0 = double size. Usually matches sx for proportional scaling. Set different values for aspect ratio adjustment.',
                            minimum: 0.1,
                            maximum: 10
                        },
                        // For set_opacity action
                        opacity: {
                            type: 'number',
                            description: 'Transparency level (REQUIRED for set_opacity). Range: 0.0-1.0. 0.0 = invisible, 1.0 = fully opaque, 0.5 = semi-transparent. Recommended: 0.3-0.7 for subtle overlay, 0.8-1.0 for clear reference.',
                            minimum: 0,
                            maximum: 1
                        },
                        // For set_data action
                        key: {
                            type: 'string',
                            description: 'Property name to modify (REQUIRED for set_data). Available keys: "path" (image file), "x" (horizontal position), "y" (vertical position), "sx" (horizontal scale), "sy" (vertical scale), "opacity" (transparency). Use for programmatic property updates.',
                            enum: ['path', 'x', 'y', 'sx', 'sy', 'opacity']
                        },
                        value: {
                            description: 'Property value to assign (REQUIRED for set_data). Type varies by key: string for "path" (file path), number for position/scale/opacity. Examples: "/new/path.png" for path, 150 for x/y, 1.5 for sx/sy, 0.7 for opacity.'
                        }
                    },
                    required: ['action']
                }
            },
            // 4. Reference Image Display - Refresh and utilities
            {
                name: 'reference_image_display',
                description: 'REFERENCE IMAGE DISPLAY: Update and refresh reference image rendering in the scene view. USAGE: "refresh" to force display update after changes or when images appear corrupted. Use when reference images don\'t display correctly or after system changes.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['refresh'],
                            description: 'Display operation: "refresh" = force update reference image rendering and visibility (no parameters needed). Use when images don\'t appear or display incorrectly.'
                        }
                    },
                    required: ['action']
                }
            }
        ];
    }
    async execute(toolName, args) {
        switch (toolName) {
            case 'reference_image_management':
                return await this.handleImageManagement(args);
            case 'reference_image_query':
                return await this.handleImageQuery(args);
            case 'reference_image_transform':
                return await this.handleImageTransform(args);
            case 'reference_image_display':
                return await this.handleImageDisplay(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
    async addReferenceImage(paths) {
        // 验证路径格式
        const invalidPaths = paths.filter(path => !path || typeof path !== 'string');
        if (invalidPaths.length > 0) {
            return {
                success: false,
                error: `Invalid paths provided: ${invalidPaths.join(', ')}`
            };
        }
        try {
            await Editor.Message.request('reference-image', 'add-image', paths);
            return {
                success: true,
                data: {
                    addedPaths: paths,
                    count: paths.length,
                    message: `Added ${paths.length} reference image(s)`
                }
            };
        }
        catch (err) {
            // 增强错误信息
            let errorMessage = err.message;
            if (err.message.includes('not found') || err.message.includes('not exist')) {
                errorMessage = `Image file not found: ${paths.join(', ')}. Please check if the file exists and the path is correct.`;
            }
            else if (err.message.includes('permission')) {
                errorMessage = `Permission denied accessing image files: ${paths.join(', ')}. Please check file permissions.`;
            }
            else if (err.message.includes('format')) {
                errorMessage = `Unsupported image format: ${paths.join(', ')}. Please use supported formats (PNG, JPG, JPEG).`;
            }
            return {
                success: false,
                error: errorMessage,
                data: {
                    failedPaths: paths,
                    suggestion: 'Please verify the image paths and file existence.'
                }
            };
        }
    }
    async removeReferenceImage(paths) {
        try {
            await Editor.Message.request('reference-image', 'remove-image', paths);
            const message = paths && paths.length > 0 ?
                `Removed ${paths.length} reference image(s)` :
                'Removed current reference image';
            return {
                success: true,
                message: message
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async switchReferenceImage(path, sceneUUID) {
        var _a, _b;
        // 验证路径格式
        if (!path || typeof path !== 'string') {
            return {
                success: false,
                error: 'Invalid image path provided. Please provide a valid file path.'
            };
        }
        try {
            const args = sceneUUID ? [path, sceneUUID] : [path];
            const result = await Editor.Message.request('reference-image', 'switch-image', ...args);
            // 检查是否有警告信息
            const hasWarning = result && (result.warning || ((_a = result.message) === null || _a === void 0 ? void 0 : _a.includes('blank')) || ((_b = result.message) === null || _b === void 0 ? void 0 : _b.includes('not found')));
            return {
                success: true,
                data: {
                    path: path,
                    sceneUUID: sceneUUID,
                    message: `Switched to reference image: ${path}`,
                    warning: hasWarning ? 'Image may be blank or not found. Please verify the image file exists.' : undefined
                },
                warning: hasWarning ? 'Image may be blank or not found. Please verify the image file exists.' : undefined
            };
        }
        catch (err) {
            let errorMessage = err.message;
            if (err.message.includes('not found') || err.message.includes('not exist')) {
                errorMessage = `Image file not found: ${path}. Please check if the file exists and the path is correct.`;
            }
            else if (err.message.includes('permission')) {
                errorMessage = `Permission denied accessing image file: ${path}. Please check file permissions.`;
            }
            else if (err.message.includes('format')) {
                errorMessage = `Unsupported image format: ${path}. Please use supported formats (PNG, JPG, JPEG).`;
            }
            return {
                success: false,
                error: errorMessage,
                data: {
                    failedPath: path,
                    suggestion: 'Please verify the image path and file existence.'
                }
            };
        }
    }
    async setReferenceImageData(key, value) {
        try {
            await Editor.Message.request('reference-image', 'set-image-data', key, value);
            return {
                success: true,
                data: {
                    key: key,
                    value: value,
                    message: `Reference image ${key} set to ${value}`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryReferenceImageConfig() {
        try {
            const config = await Editor.Message.request('reference-image', 'query-config');
            // 数据一致性检查
            const consistencyIssues = this.checkDataConsistency(config);
            return {
                success: true,
                data: Object.assign(Object.assign({}, config), { dataConsistency: {
                        issues: consistencyIssues,
                        hasIssues: consistencyIssues.length > 0
                    } }),
                warning: consistencyIssues.length > 0 ?
                    `Data consistency issues detected: ${consistencyIssues.join(', ')}` : undefined
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    checkDataConsistency(config) {
        const issues = [];
        if (!config) {
            issues.push('No configuration data available');
            return issues;
        }
        // 检查配置中的图片列表
        if (config.images && Array.isArray(config.images)) {
            const deletedImages = config.images.filter((img) => img.path && (img.path.includes('deleted') || img.path.includes('nonexistent')));
            if (deletedImages.length > 0) {
                issues.push(`Found ${deletedImages.length} deleted/nonexistent images in configuration`);
            }
            // 检查当前图片是否在列表中
            if (config.current && !config.images.find((img) => img.path === config.current)) {
                issues.push('Current image not found in image list');
            }
            // 检查重复的图片路径
            const paths = config.images.map((img) => img.path).filter(Boolean);
            const uniquePaths = new Set(paths);
            if (paths.length !== uniquePaths.size) {
                issues.push('Duplicate image paths found in configuration');
            }
        }
        // 检查当前图片设置
        if (config.current && typeof config.current !== 'string') {
            issues.push('Invalid current image path format');
        }
        return issues;
    }
    async queryCurrentReferenceImage() {
        try {
            const current = await Editor.Message.request('reference-image', 'query-current');
            return {
                success: true,
                data: current
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async refreshReferenceImage() {
        try {
            await Editor.Message.request('reference-image', 'refresh');
            return {
                success: true,
                message: 'Reference image refreshed'
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async setReferenceImagePosition(x, y) {
        try {
            await Editor.Message.request('reference-image', 'set-image-data', 'x', x);
            await Editor.Message.request('reference-image', 'set-image-data', 'y', y);
            return {
                success: true,
                data: {
                    x: x,
                    y: y,
                    message: `Reference image position set to (${x}, ${y})`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async setReferenceImageScale(sx, sy) {
        try {
            await Editor.Message.request('reference-image', 'set-image-data', 'sx', sx);
            await Editor.Message.request('reference-image', 'set-image-data', 'sy', sy);
            return {
                success: true,
                data: {
                    sx: sx,
                    sy: sy,
                    message: `Reference image scale set to (${sx}, ${sy})`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async setReferenceImageOpacity(opacity) {
        try {
            await Editor.Message.request('reference-image', 'set-image-data', 'opacity', opacity);
            return {
                success: true,
                data: {
                    opacity: opacity,
                    message: `Reference image opacity set to ${opacity}`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async listReferenceImages() {
        try {
            const config = await Editor.Message.request('reference-image', 'query-config');
            const current = await Editor.Message.request('reference-image', 'query-current');
            return {
                success: true,
                data: {
                    config: config,
                    current: current,
                    message: 'Reference image information retrieved'
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async clearAllReferenceImages() {
        try {
            // Remove all reference images by calling remove-image without paths
            await Editor.Message.request('reference-image', 'remove-image');
            return {
                success: true,
                message: 'All reference images cleared'
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    // New handler methods for optimized tools
    async handleImageManagement(args) {
        const { action } = args;
        switch (action) {
            case 'add':
                return await this.addReferenceImage(args.paths);
            case 'remove':
                return await this.removeReferenceImage(args.removePaths);
            case 'switch':
                return await this.switchReferenceImage(args.path, args.sceneUUID);
            case 'clear_all':
                return await this.clearAllReferenceImages();
            default:
                return { success: false, error: `Unknown image management action: ${action}` };
        }
    }
    async handleImageQuery(args) {
        const { action } = args;
        switch (action) {
            case 'get_config':
                return await this.queryReferenceImageConfig();
            case 'get_current':
                return await this.queryCurrentReferenceImage();
            case 'list_all':
                return await this.listReferenceImages();
            default:
                return { success: false, error: `Unknown image query action: ${action}` };
        }
    }
    async handleImageTransform(args) {
        const { action } = args;
        switch (action) {
            case 'set_position':
                return await this.setReferenceImagePosition(args.x, args.y);
            case 'set_scale':
                return await this.setReferenceImageScale(args.sx, args.sy);
            case 'set_opacity':
                return await this.setReferenceImageOpacity(args.opacity);
            case 'set_data':
                return await this.setReferenceImageData(args.key, args.value);
            default:
                return { success: false, error: `Unknown image transform action: ${action}` };
        }
    }
    async handleImageDisplay(args) {
        const { action } = args;
        switch (action) {
            case 'refresh':
                return await this.refreshReferenceImage();
            default:
                return { success: false, error: `Unknown image display action: ${action}` };
        }
    }
}
exports.ReferenceImageTools = ReferenceImageTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLWltYWdlLXRvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL3Rvb2xzL3JlZmVyZW5jZS1pbWFnZS10b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLG1CQUFtQjtJQUM1QixRQUFRO1FBQ0osT0FBTztZQUNILG1EQUFtRDtZQUNuRDtnQkFDSSxJQUFJLEVBQUUsNEJBQTRCO2dCQUNsQyxXQUFXLEVBQUUsaVNBQWlTO2dCQUM5UyxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLE1BQU0sRUFBRTs0QkFDSixJQUFJLEVBQUUsUUFBUTs0QkFDZCxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUM7NEJBQzlDLFdBQVcsRUFBRSx1UUFBdVE7eUJBQ3ZSO3dCQUNELGlCQUFpQjt3QkFDakIsS0FBSyxFQUFFOzRCQUNILElBQUksRUFBRSxPQUFPOzRCQUNiLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7NEJBQ3pCLFdBQVcsRUFBRSxrUEFBa1A7eUJBQ2xRO3dCQUNELG9CQUFvQjt3QkFDcEIsV0FBVyxFQUFFOzRCQUNULElBQUksRUFBRSxPQUFPOzRCQUNiLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7NEJBQ3pCLFdBQVcsRUFBRSw0T0FBNE87eUJBQzVQO3dCQUNELG9CQUFvQjt3QkFDcEIsSUFBSSxFQUFFOzRCQUNGLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSx5TkFBeU47eUJBQ3pPO3dCQUNELFNBQVMsRUFBRTs0QkFDUCxJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsb1BBQW9QO3lCQUNwUTtxQkFDSjtvQkFDRCxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUJBQ3ZCO2FBQ0o7WUFFRCw2Q0FBNkM7WUFDN0M7Z0JBQ0ks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TyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBUztRQUN0QyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRXhCLFFBQVEsTUFBTSxFQUFFLENBQUM7WUFDYixLQUFLLFNBQVM7Z0JBQ1YsT0FBTyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQzlDO2dCQUNJLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxpQ0FBaUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztRQUNwRixDQUFDO0lBQ0wsQ0FBQztDQUVKO0FBaGZELGtEQWdmQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRvb2xEZWZpbml0aW9uLCBUb29sUmVzcG9uc2UsIFRvb2xFeGVjdXRvciB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFJlZmVyZW5jZUltYWdlVG9vbHMgaW1wbGVtZW50cyBUb29sRXhlY3V0b3Ige1xuICAgIGdldFRvb2xzKCk6IFRvb2xEZWZpbml0aW9uW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLy8gMS4gUmVmZXJlbmNlIEltYWdlIE1hbmFnZW1lbnQgLSBCYXNpYyBvcGVyYXRpb25zXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3JlZmVyZW5jZV9pbWFnZV9tYW5hZ2VtZW50JyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1JFRkVSRU5DRSBJTUFHRSBNQU5BR0VNRU5UOiBNYW5hZ2Ugb3ZlcmxheSByZWZlcmVuY2UgaW1hZ2VzIGluIHRoZSBzY2VuZSBlZGl0b3IgZm9yIGRlc2lnbiBndWlkYW5jZS4gV09SS0ZMT1c6IFwiYWRkXCIgaW1hZ2VzIGZyb20gZmlsZSBwYXRocyDihpIgXCJzd2l0Y2hcIiBiZXR3ZWVuIG11bHRpcGxlIHJlZmVyZW5jZXMg4oaSIFwicmVtb3ZlXCIgd2hlbiBubyBsb25nZXIgbmVlZGVkIE9SIFwiY2xlYXJfYWxsXCIgdG8gcmVzZXQuIEVzc2VudGlhbCBmb3IgVUkgZGVzaWduIGFuZCBzY2VuZSBsYXlvdXQgbWF0Y2hpbmcuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydhZGQnLCAncmVtb3ZlJywgJ3N3aXRjaCcsICdjbGVhcl9hbGwnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ01hbmFnZW1lbnQgb3BlcmF0aW9uOiBcImFkZFwiID0gYWRkIHJlZmVyZW5jZSBpbWFnZXMgZnJvbSBmaWxlIHBhdGhzIChyZXF1aXJlcyBwYXRocyBhcnJheSkgfCBcInJlbW92ZVwiID0gcmVtb3ZlIHNwZWNpZmljIGltYWdlcyAocmVxdWlyZXMgcmVtb3ZlUGF0aHMgYXJyYXkpIHwgXCJzd2l0Y2hcIiA9IGNoYW5nZSBhY3RpdmUgcmVmZXJlbmNlIChyZXF1aXJlcyBwYXRoKSB8IFwiY2xlYXJfYWxsXCIgPSByZW1vdmUgYWxsIHJlZmVyZW5jZXMgKG5vIHBhcmFtZXRlcnMpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBhZGQgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0ltYWdlIGZpbGUgcGF0aHMgdG8gYWRkIChSRVFVSVJFRCBmb3IgYWRkIGFjdGlvbikuIEFycmF5IG9mIGFic29sdXRlIHBhdGhzIHRvIGltYWdlIGZpbGVzLiBTdXBwb3J0ZWQgZm9ybWF0czogUE5HLCBKUEcsIEpQRUcsIEdJRi4gRXhhbXBsZXM6IFtcIi9Vc2Vycy91c2VybmFtZS9EZXNrdG9wL21vY2t1cC5wbmdcIiwgXCIvcGF0aC90by91aS1kZXNpZ24uanBnXCJdLiBGaWxlcyBtdXN0IGV4aXN0IGFuZCBiZSByZWFkYWJsZS4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHJlbW92ZSBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZVBhdGhzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSW1hZ2UgcGF0aHMgdG8gcmVtb3ZlIChyZW1vdmUgYWN0aW9uKS4gQXJyYXkgb2YgYWJzb2x1dGUgcGF0aHMgbWF0Y2hpbmcgcHJldmlvdXNseSBhZGRlZCBpbWFnZXMuIElmIGVtcHR5IGFycmF5IFtdLCByZW1vdmVzIGN1cnJlbnQgYWN0aXZlIHJlZmVyZW5jZS4gRXhhbXBsZXM6IFtcIi9wYXRoL3RvL29sZC1tb2NrdXAucG5nXCJdLiBVc2UgZXhhY3QgcGF0aHMgZnJvbSBwcmV2aW91cyBhZGQgb3BlcmF0aW9ucy4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHN3aXRjaCBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RhcmdldCByZWZlcmVuY2UgaW1hZ2UgcGF0aCAoUkVRVUlSRUQgZm9yIHN3aXRjaCBhY3Rpb24pLiBBYnNvbHV0ZSBwYXRoIHRvIHByZXZpb3VzbHkgYWRkZWQgcmVmZXJlbmNlIGltYWdlLiBNdXN0IG1hdGNoIGV4YWN0bHkgd2l0aCBwcmV2aW91c2x5IGFkZGVkIGltYWdlIHBhdGguIEV4YW1wbGU6IFwiL1VzZXJzL3VzZXJuYW1lL0Rlc2t0b3AvZGVzaWduLW1vY2t1cC5wbmdcIi4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmVVVUlEOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTY2VuZSBVVUlEIGZvciBzd2l0Y2ggb3BlcmF0aW9uIChzd2l0Y2ggYWN0aW9uLCBvcHRpb25hbCkuIFNwZWNpZmllcyB3aGljaCBzY2VuZSB0byBzd2l0Y2ggcmVmZXJlbmNlIGluLiBJZiBvbWl0dGVkLCB1c2VzIGN1cnJlbnQgYWN0aXZlIHNjZW5lLiBGb3JtYXQ6IFwiMTIzNDU2NzgtYWJjZC0xMjM0LTU2NzgtMTIzNDU2Nzg5YWJjXCIuIFJhcmVseSBuZWVkZWQgdW5sZXNzIHdvcmtpbmcgd2l0aCBtdWx0aXBsZSBzY2VuZXMuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIDIuIFJlZmVyZW5jZSBJbWFnZSBRdWVyeSAtIEdldCBpbmZvcm1hdGlvblxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdyZWZlcmVuY2VfaW1hZ2VfcXVlcnknLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUkVGRVJFTkNFIElNQUdFIFFVRVJZOiBJbnNwZWN0IGN1cnJlbnQgcmVmZXJlbmNlIGltYWdlIHN0YXRlIGFuZCBjb25maWd1cmF0aW9uLiBVU0FHRTogXCJnZXRfY29uZmlnXCIgZm9yIHN5c3RlbSBzZXR0aW5ncywgXCJnZXRfY3VycmVudFwiIGZvciBhY3RpdmUgaW1hZ2UgZGV0YWlscywgXCJsaXN0X2FsbFwiIGZvciBpbnZlbnRvcnkgb2YgYWRkZWQgaW1hZ2VzLiBFc3NlbnRpYWwgZm9yIHVuZGVyc3RhbmRpbmcgY3VycmVudCByZWZlcmVuY2Ugc2V0dXAgYW5kIGRlYnVnZ2luZyBkaXNwbGF5IGlzc3Vlcy4nLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2dldF9jb25maWcnLCAnZ2V0X2N1cnJlbnQnLCAnbGlzdF9hbGwnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1F1ZXJ5IG9wZXJhdGlvbjogXCJnZXRfY29uZmlnXCIgPSBzeXN0ZW0gY29uZmlndXJhdGlvbiBhbmQgc2V0dGluZ3MgfCBcImdldF9jdXJyZW50XCIgPSBhY3RpdmUgcmVmZXJlbmNlIGltYWdlIGRldGFpbHMgKHBhdGgsIHBvc2l0aW9uLCBzY2FsZSwgb3BhY2l0eSkgfCBcImxpc3RfYWxsXCIgPSBjb21wbGV0ZSBpbnZlbnRvcnkgb2YgYWRkZWQgcmVmZXJlbmNlIGltYWdlcydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYWN0aW9uJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyAzLiBSZWZlcmVuY2UgSW1hZ2UgVHJhbnNmb3JtIC0gUG9zaXRpb24sIHNjYWxlLCBvcGFjaXR5XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3JlZmVyZW5jZV9pbWFnZV90cmFuc2Zvcm0nLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUkVGRVJFTkNFIElNQUdFIFRSQU5TRk9STTogQWRqdXN0IHJlZmVyZW5jZSBpbWFnZSBkaXNwbGF5IHByb3BlcnRpZXMgZm9yIGJldHRlciBkZXNpZ24gYWxpZ25tZW50LiBVU0FHRTogRmluZS10dW5lIHBvc2l0aW9uLCBzY2FsZSwgYW5kIG9wYWNpdHkgdG8gb3ZlcmxheSBpbWFnZXMgcHJvcGVybHkgd2l0aCBzY2VuZSBjb250ZW50LiBFc3NlbnRpYWwgZm9yIHByZWNpc2UgVUkgZGVzaWduIG1hdGNoaW5nIGFuZCBsYXlvdXQgZ3VpZGFuY2UuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydzZXRfcG9zaXRpb24nLCAnc2V0X3NjYWxlJywgJ3NldF9vcGFjaXR5JywgJ3NldF9kYXRhJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUcmFuc2Zvcm0gb3BlcmF0aW9uOiBcInNldF9wb3NpdGlvblwiID0gYWRqdXN0IGltYWdlIHBvc2l0aW9uIChyZXF1aXJlcyB4LCB5KSB8IFwic2V0X3NjYWxlXCIgPSByZXNpemUgaW1hZ2UgKHJlcXVpcmVzIHN4LCBzeSkgfCBcInNldF9vcGFjaXR5XCIgPSBjaGFuZ2UgdHJhbnNwYXJlbmN5IChyZXF1aXJlcyBvcGFjaXR5KSB8IFwic2V0X2RhdGFcIiA9IG1vZGlmeSBhbnkgcHJvcGVydHkgKHJlcXVpcmVzIGtleSwgdmFsdWUpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBzZXRfcG9zaXRpb24gYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdIb3Jpem9udGFsIHBvc2l0aW9uIG9mZnNldCAoUkVRVUlSRUQgZm9yIHNldF9wb3NpdGlvbikuIFBpeGVscyBmcm9tIGNlbnRlci4gUG9zaXRpdmUgPSByaWdodCwgbmVnYXRpdmUgPSBsZWZ0LiBFeGFtcGxlczogMTAwIG1vdmVzIHJpZ2h0LCAtNTAgbW92ZXMgbGVmdC4gVXNlIGZvciBwcmVjaXNlIGltYWdlIGFsaWdubWVudCB3aXRoIHNjZW5lIGVsZW1lbnRzLidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdWZXJ0aWNhbCBwb3NpdGlvbiBvZmZzZXQgKFJFUVVJUkVEIGZvciBzZXRfcG9zaXRpb24pLiBQaXhlbHMgZnJvbSBjZW50ZXIuIFBvc2l0aXZlID0gdXAsIG5lZ2F0aXZlID0gZG93bi4gRXhhbXBsZXM6IDIwMCBtb3ZlcyB1cCwgLTEwMCBtb3ZlcyBkb3duLiBDb29yZGluYXRlIHN5c3RlbSBmb2xsb3dzIENvY29zIENyZWF0b3IgY29udmVudGlvbi4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHNldF9zY2FsZSBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHN4OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdIb3Jpem9udGFsIHNjYWxlIG11bHRpcGxpZXIgKFJFUVVJUkVEIGZvciBzZXRfc2NhbGUpLiBSYW5nZTogMC4xLTEwLjAuIDEuMCA9IG9yaWdpbmFsIHNpemUsIDAuNSA9IGhhbGYgc2l6ZSwgMi4wID0gZG91YmxlIHNpemUuIEV4YW1wbGVzOiAwLjggZm9yIHNtYWxsZXIgb3ZlcmxheSwgMS4yIGZvciBzbGlnaHRseSBsYXJnZXIgcmVmZXJlbmNlLicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogMC4xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heGltdW06IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3k6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1ZlcnRpY2FsIHNjYWxlIG11bHRpcGxpZXIgKFJFUVVJUkVEIGZvciBzZXRfc2NhbGUpLiBSYW5nZTogMC4xLTEwLjAuIDEuMCA9IG9yaWdpbmFsIHNpemUsIDAuNSA9IGhhbGYgc2l6ZSwgMi4wID0gZG91YmxlIHNpemUuIFVzdWFsbHkgbWF0Y2hlcyBzeCBmb3IgcHJvcG9ydGlvbmFsIHNjYWxpbmcuIFNldCBkaWZmZXJlbnQgdmFsdWVzIGZvciBhc3BlY3QgcmF0aW8gYWRqdXN0bWVudC4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IDAuMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBzZXRfb3BhY2l0eSBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RyYW5zcGFyZW5jeSBsZXZlbCAoUkVRVUlSRUQgZm9yIHNldF9vcGFjaXR5KS4gUmFuZ2U6IDAuMC0xLjAuIDAuMCA9IGludmlzaWJsZSwgMS4wID0gZnVsbHkgb3BhcXVlLCAwLjUgPSBzZW1pLXRyYW5zcGFyZW50LiBSZWNvbW1lbmRlZDogMC4zLTAuNyBmb3Igc3VidGxlIG92ZXJsYXksIDAuOC0xLjAgZm9yIGNsZWFyIHJlZmVyZW5jZS4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogMVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBzZXRfZGF0YSBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUHJvcGVydHkgbmFtZSB0byBtb2RpZnkgKFJFUVVJUkVEIGZvciBzZXRfZGF0YSkuIEF2YWlsYWJsZSBrZXlzOiBcInBhdGhcIiAoaW1hZ2UgZmlsZSksIFwieFwiIChob3Jpem9udGFsIHBvc2l0aW9uKSwgXCJ5XCIgKHZlcnRpY2FsIHBvc2l0aW9uKSwgXCJzeFwiIChob3Jpem9udGFsIHNjYWxlKSwgXCJzeVwiICh2ZXJ0aWNhbCBzY2FsZSksIFwib3BhY2l0eVwiICh0cmFuc3BhcmVuY3kpLiBVc2UgZm9yIHByb2dyYW1tYXRpYyBwcm9wZXJ0eSB1cGRhdGVzLicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydwYXRoJywgJ3gnLCAneScsICdzeCcsICdzeScsICdvcGFjaXR5J11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUHJvcGVydHkgdmFsdWUgdG8gYXNzaWduIChSRVFVSVJFRCBmb3Igc2V0X2RhdGEpLiBUeXBlIHZhcmllcyBieSBrZXk6IHN0cmluZyBmb3IgXCJwYXRoXCIgKGZpbGUgcGF0aCksIG51bWJlciBmb3IgcG9zaXRpb24vc2NhbGUvb3BhY2l0eS4gRXhhbXBsZXM6IFwiL25ldy9wYXRoLnBuZ1wiIGZvciBwYXRoLCAxNTAgZm9yIHgveSwgMS41IGZvciBzeC9zeSwgMC43IGZvciBvcGFjaXR5LidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYWN0aW9uJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyA0LiBSZWZlcmVuY2UgSW1hZ2UgRGlzcGxheSAtIFJlZnJlc2ggYW5kIHV0aWxpdGllc1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdyZWZlcmVuY2VfaW1hZ2VfZGlzcGxheScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdSRUZFUkVOQ0UgSU1BR0UgRElTUExBWTogVXBkYXRlIGFuZCByZWZyZXNoIHJlZmVyZW5jZSBpbWFnZSByZW5kZXJpbmcgaW4gdGhlIHNjZW5lIHZpZXcuIFVTQUdFOiBcInJlZnJlc2hcIiB0byBmb3JjZSBkaXNwbGF5IHVwZGF0ZSBhZnRlciBjaGFuZ2VzIG9yIHdoZW4gaW1hZ2VzIGFwcGVhciBjb3JydXB0ZWQuIFVzZSB3aGVuIHJlZmVyZW5jZSBpbWFnZXMgZG9uXFwndCBkaXNwbGF5IGNvcnJlY3RseSBvciBhZnRlciBzeXN0ZW0gY2hhbmdlcy4nLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ3JlZnJlc2gnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Rpc3BsYXkgb3BlcmF0aW9uOiBcInJlZnJlc2hcIiA9IGZvcmNlIHVwZGF0ZSByZWZlcmVuY2UgaW1hZ2UgcmVuZGVyaW5nIGFuZCB2aXNpYmlsaXR5IChubyBwYXJhbWV0ZXJzIG5lZWRlZCkuIFVzZSB3aGVuIGltYWdlcyBkb25cXCd0IGFwcGVhciBvciBkaXNwbGF5IGluY29ycmVjdGx5LidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYWN0aW9uJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZSh0b29sTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBzd2l0Y2ggKHRvb2xOYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdyZWZlcmVuY2VfaW1hZ2VfbWFuYWdlbWVudCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlSW1hZ2VNYW5hZ2VtZW50KGFyZ3MpO1xuICAgICAgICAgICAgY2FzZSAncmVmZXJlbmNlX2ltYWdlX3F1ZXJ5JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5oYW5kbGVJbWFnZVF1ZXJ5KGFyZ3MpO1xuICAgICAgICAgICAgY2FzZSAncmVmZXJlbmNlX2ltYWdlX3RyYW5zZm9ybSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlSW1hZ2VUcmFuc2Zvcm0oYXJncyk7XG4gICAgICAgICAgICBjYXNlICdyZWZlcmVuY2VfaW1hZ2VfZGlzcGxheSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlSW1hZ2VEaXNwbGF5KGFyZ3MpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdG9vbDogJHt0b29sTmFtZX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgYWRkUmVmZXJlbmNlSW1hZ2UocGF0aHM6IHN0cmluZ1tdKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgLy8g6aqM6K+B6Lev5b6E5qC85byPXG4gICAgICAgIGNvbnN0IGludmFsaWRQYXRocyA9IHBhdGhzLmZpbHRlcihwYXRoID0+ICFwYXRoIHx8IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJyk7XG4gICAgICAgIGlmIChpbnZhbGlkUGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogYEludmFsaWQgcGF0aHMgcHJvdmlkZWQ6ICR7aW52YWxpZFBhdGhzLmpvaW4oJywgJyl9YFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAnYWRkLWltYWdlJywgcGF0aHMpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgYWRkZWRQYXRoczogcGF0aHMsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBwYXRocy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBBZGRlZCAke3BhdGhzLmxlbmd0aH0gcmVmZXJlbmNlIGltYWdlKHMpYFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAvLyDlop7lvLrplJnor6/kv6Hmga9cbiAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcbiAgICAgICAgICAgIGlmIChlcnIubWVzc2FnZS5pbmNsdWRlcygnbm90IGZvdW5kJykgfHwgZXJyLm1lc3NhZ2UuaW5jbHVkZXMoJ25vdCBleGlzdCcpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gYEltYWdlIGZpbGUgbm90IGZvdW5kOiAke3BhdGhzLmpvaW4oJywgJyl9LiBQbGVhc2UgY2hlY2sgaWYgdGhlIGZpbGUgZXhpc3RzIGFuZCB0aGUgcGF0aCBpcyBjb3JyZWN0LmA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVyci5tZXNzYWdlLmluY2x1ZGVzKCdwZXJtaXNzaW9uJykpIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBgUGVybWlzc2lvbiBkZW5pZWQgYWNjZXNzaW5nIGltYWdlIGZpbGVzOiAke3BhdGhzLmpvaW4oJywgJyl9LiBQbGVhc2UgY2hlY2sgZmlsZSBwZXJtaXNzaW9ucy5gO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnIubWVzc2FnZS5pbmNsdWRlcygnZm9ybWF0JykpIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBgVW5zdXBwb3J0ZWQgaW1hZ2UgZm9ybWF0OiAke3BhdGhzLmpvaW4oJywgJyl9LiBQbGVhc2UgdXNlIHN1cHBvcnRlZCBmb3JtYXRzIChQTkcsIEpQRywgSlBFRykuYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JNZXNzYWdlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZmFpbGVkUGF0aHM6IHBhdGhzLFxuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uOiAnUGxlYXNlIHZlcmlmeSB0aGUgaW1hZ2UgcGF0aHMgYW5kIGZpbGUgZXhpc3RlbmNlLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyByZW1vdmVSZWZlcmVuY2VJbWFnZShwYXRocz86IHN0cmluZ1tdKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdyZW1vdmUtaW1hZ2UnLCBwYXRocyk7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gcGF0aHMgJiYgcGF0aHMubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICAgICAgYFJlbW92ZWQgJHtwYXRocy5sZW5ndGh9IHJlZmVyZW5jZSBpbWFnZShzKWAgOlxuICAgICAgICAgICAgICAgICdSZW1vdmVkIGN1cnJlbnQgcmVmZXJlbmNlIGltYWdlJztcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzd2l0Y2hSZWZlcmVuY2VJbWFnZShwYXRoOiBzdHJpbmcsIHNjZW5lVVVJRD86IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIC8vIOmqjOivgei3r+W+hOagvOW8j1xuICAgICAgICBpZiAoIXBhdGggfHwgdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiAnSW52YWxpZCBpbWFnZSBwYXRoIHByb3ZpZGVkLiBQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIGZpbGUgcGF0aC4nXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBzY2VuZVVVSUQgPyBbcGF0aCwgc2NlbmVVVUlEXSA6IFtwYXRoXTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3N3aXRjaC1pbWFnZScsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgLy8g5qOA5p+l5piv5ZCm5pyJ6K2m5ZGK5L+h5oGvXG4gICAgICAgICAgICBjb25zdCBoYXNXYXJuaW5nID0gcmVzdWx0ICYmIChyZXN1bHQud2FybmluZyB8fCByZXN1bHQubWVzc2FnZT8uaW5jbHVkZXMoJ2JsYW5rJykgfHwgcmVzdWx0Lm1lc3NhZ2U/LmluY2x1ZGVzKCdub3QgZm91bmQnKSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHNjZW5lVVVJRDogc2NlbmVVVUlELFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgU3dpdGNoZWQgdG8gcmVmZXJlbmNlIGltYWdlOiAke3BhdGh9YCxcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZzogaGFzV2FybmluZyA/ICdJbWFnZSBtYXkgYmUgYmxhbmsgb3Igbm90IGZvdW5kLiBQbGVhc2UgdmVyaWZ5IHRoZSBpbWFnZSBmaWxlIGV4aXN0cy4nIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB3YXJuaW5nOiBoYXNXYXJuaW5nID8gJ0ltYWdlIG1heSBiZSBibGFuayBvciBub3QgZm91bmQuIFBsZWFzZSB2ZXJpZnkgdGhlIGltYWdlIGZpbGUgZXhpc3RzLicgOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlID0gZXJyLm1lc3NhZ2U7XG4gICAgICAgICAgICBpZiAoZXJyLm1lc3NhZ2UuaW5jbHVkZXMoJ25vdCBmb3VuZCcpIHx8IGVyci5tZXNzYWdlLmluY2x1ZGVzKCdub3QgZXhpc3QnKSkge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGBJbWFnZSBmaWxlIG5vdCBmb3VuZDogJHtwYXRofS4gUGxlYXNlIGNoZWNrIGlmIHRoZSBmaWxlIGV4aXN0cyBhbmQgdGhlIHBhdGggaXMgY29ycmVjdC5gO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnIubWVzc2FnZS5pbmNsdWRlcygncGVybWlzc2lvbicpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gYFBlcm1pc3Npb24gZGVuaWVkIGFjY2Vzc2luZyBpbWFnZSBmaWxlOiAke3BhdGh9LiBQbGVhc2UgY2hlY2sgZmlsZSBwZXJtaXNzaW9ucy5gO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnIubWVzc2FnZS5pbmNsdWRlcygnZm9ybWF0JykpIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBgVW5zdXBwb3J0ZWQgaW1hZ2UgZm9ybWF0OiAke3BhdGh9LiBQbGVhc2UgdXNlIHN1cHBvcnRlZCBmb3JtYXRzIChQTkcsIEpQRywgSlBFRykuYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JNZXNzYWdlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZmFpbGVkUGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbjogJ1BsZWFzZSB2ZXJpZnkgdGhlIGltYWdlIHBhdGggYW5kIGZpbGUgZXhpc3RlbmNlLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZXRSZWZlcmVuY2VJbWFnZURhdGEoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3NldC1pbWFnZS1kYXRhJywga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgUmVmZXJlbmNlIGltYWdlICR7a2V5fSBzZXQgdG8gJHt2YWx1ZX1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcXVlcnlSZWZlcmVuY2VJbWFnZUNvbmZpZygpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29uZmlnOiBhbnkgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAncXVlcnktY29uZmlnJyk7XG4gICAgICAgICAgICAvLyDmlbDmja7kuIDoh7TmgKfmo4Dmn6VcbiAgICAgICAgICAgIGNvbnN0IGNvbnNpc3RlbmN5SXNzdWVzID0gdGhpcy5jaGVja0RhdGFDb25zaXN0ZW5jeShjb25maWcpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFDb25zaXN0ZW5jeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNzdWVzOiBjb25zaXN0ZW5jeUlzc3VlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0lzc3VlczogY29uc2lzdGVuY3lJc3N1ZXMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB3YXJuaW5nOiBjb25zaXN0ZW5jeUlzc3Vlcy5sZW5ndGggPiAwID9cbiAgICAgICAgICAgICAgICAgICAgYERhdGEgY29uc2lzdGVuY3kgaXNzdWVzIGRldGVjdGVkOiAke2NvbnNpc3RlbmN5SXNzdWVzLmpvaW4oJywgJyl9YCA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tEYXRhQ29uc2lzdGVuY3koY29uZmlnOiBhbnkpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IGlzc3Vlczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgXG4gICAgICAgIGlmICghY29uZmlnKSB7XG4gICAgICAgICAgICBpc3N1ZXMucHVzaCgnTm8gY29uZmlndXJhdGlvbiBkYXRhIGF2YWlsYWJsZScpO1xuICAgICAgICAgICAgcmV0dXJuIGlzc3VlcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOajgOafpemFjee9ruS4reeahOWbvueJh+WIl+ihqFxuICAgICAgICBpZiAoY29uZmlnLmltYWdlcyAmJiBBcnJheS5pc0FycmF5KGNvbmZpZy5pbWFnZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBkZWxldGVkSW1hZ2VzID0gY29uZmlnLmltYWdlcy5maWx0ZXIoKGltZzogYW55KSA9PiBcbiAgICAgICAgICAgICAgICBpbWcucGF0aCAmJiAoaW1nLnBhdGguaW5jbHVkZXMoJ2RlbGV0ZWQnKSB8fCBpbWcucGF0aC5pbmNsdWRlcygnbm9uZXhpc3RlbnQnKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChkZWxldGVkSW1hZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpc3N1ZXMucHVzaChgRm91bmQgJHtkZWxldGVkSW1hZ2VzLmxlbmd0aH0gZGVsZXRlZC9ub25leGlzdGVudCBpbWFnZXMgaW4gY29uZmlndXJhdGlvbmApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmo4Dmn6XlvZPliY3lm77niYfmmK/lkKblnKjliJfooajkuK1cbiAgICAgICAgICAgIGlmIChjb25maWcuY3VycmVudCAmJiAhY29uZmlnLmltYWdlcy5maW5kKChpbWc6IGFueSkgPT4gaW1nLnBhdGggPT09IGNvbmZpZy5jdXJyZW50KSkge1xuICAgICAgICAgICAgICAgIGlzc3Vlcy5wdXNoKCdDdXJyZW50IGltYWdlIG5vdCBmb3VuZCBpbiBpbWFnZSBsaXN0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOajgOafpemHjeWkjeeahOWbvueJh+i3r+W+hFxuICAgICAgICAgICAgY29uc3QgcGF0aHMgPSBjb25maWcuaW1hZ2VzLm1hcCgoaW1nOiBhbnkpID0+IGltZy5wYXRoKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgICAgICBjb25zdCB1bmlxdWVQYXRocyA9IG5ldyBTZXQocGF0aHMpO1xuICAgICAgICAgICAgaWYgKHBhdGhzLmxlbmd0aCAhPT0gdW5pcXVlUGF0aHMuc2l6ZSkge1xuICAgICAgICAgICAgICAgIGlzc3Vlcy5wdXNoKCdEdXBsaWNhdGUgaW1hZ2UgcGF0aHMgZm91bmQgaW4gY29uZmlndXJhdGlvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5qOA5p+l5b2T5YmN5Zu+54mH6K6+572uXG4gICAgICAgIGlmIChjb25maWcuY3VycmVudCAmJiB0eXBlb2YgY29uZmlnLmN1cnJlbnQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpc3N1ZXMucHVzaCgnSW52YWxpZCBjdXJyZW50IGltYWdlIHBhdGggZm9ybWF0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNzdWVzO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcXVlcnlDdXJyZW50UmVmZXJlbmNlSW1hZ2UoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQ6IGFueSA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdxdWVyeS1jdXJyZW50Jyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YTogY3VycmVudFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcmVmcmVzaFJlZmVyZW5jZUltYWdlKCk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAncmVmcmVzaCcpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdSZWZlcmVuY2UgaW1hZ2UgcmVmcmVzaGVkJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgc2V0UmVmZXJlbmNlSW1hZ2VQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcik6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAnc2V0LWltYWdlLWRhdGEnLCAneCcsIHgpO1xuICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3NldC1pbWFnZS1kYXRhJywgJ3knLCB5KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFJlZmVyZW5jZSBpbWFnZSBwb3NpdGlvbiBzZXQgdG8gKCR7eH0sICR7eX0pYFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHNldFJlZmVyZW5jZUltYWdlU2NhbGUoc3g6IG51bWJlciwgc3k6IG51bWJlcik6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAnc2V0LWltYWdlLWRhdGEnLCAnc3gnLCBzeCk7XG4gICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAnc2V0LWltYWdlLWRhdGEnLCAnc3knLCBzeSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHN4OiBzeCxcbiAgICAgICAgICAgICAgICAgICAgc3k6IHN5LFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgUmVmZXJlbmNlIGltYWdlIHNjYWxlIHNldCB0byAoJHtzeH0sICR7c3l9KWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZXRSZWZlcmVuY2VJbWFnZU9wYWNpdHkob3BhY2l0eTogbnVtYmVyKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdzZXQtaW1hZ2UtZGF0YScsICdvcGFjaXR5Jywgb3BhY2l0eSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBvcGFjaXR5LFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgUmVmZXJlbmNlIGltYWdlIG9wYWNpdHkgc2V0IHRvICR7b3BhY2l0eX1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgbGlzdFJlZmVyZW5jZUltYWdlcygpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29uZmlnID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3F1ZXJ5LWNvbmZpZycpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdxdWVyeS1jdXJyZW50Jyk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBjdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnUmVmZXJlbmNlIGltYWdlIGluZm9ybWF0aW9uIHJldHJpZXZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjbGVhckFsbFJlZmVyZW5jZUltYWdlcygpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCByZWZlcmVuY2UgaW1hZ2VzIGJ5IGNhbGxpbmcgcmVtb3ZlLWltYWdlIHdpdGhvdXQgcGF0aHNcbiAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdyZW1vdmUtaW1hZ2UnKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdBbGwgcmVmZXJlbmNlIGltYWdlcyBjbGVhcmVkJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5ldyBoYW5kbGVyIG1ldGhvZHMgZm9yIG9wdGltaXplZCB0b29sc1xuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlSW1hZ2VNYW5hZ2VtZW50KGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2FkZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYWRkUmVmZXJlbmNlSW1hZ2UoYXJncy5wYXRocyk7XG4gICAgICAgICAgICBjYXNlICdyZW1vdmUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlbW92ZVJlZmVyZW5jZUltYWdlKGFyZ3MucmVtb3ZlUGF0aHMpO1xuICAgICAgICAgICAgY2FzZSAnc3dpdGNoJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zd2l0Y2hSZWZlcmVuY2VJbWFnZShhcmdzLnBhdGgsIGFyZ3Muc2NlbmVVVUlEKTtcbiAgICAgICAgICAgIGNhc2UgJ2NsZWFyX2FsbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xlYXJBbGxSZWZlcmVuY2VJbWFnZXMoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgVW5rbm93biBpbWFnZSBtYW5hZ2VtZW50IGFjdGlvbjogJHthY3Rpb259YCB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBoYW5kbGVJbWFnZVF1ZXJ5KGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9jb25maWcnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnF1ZXJ5UmVmZXJlbmNlSW1hZ2VDb25maWcoKTtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9jdXJyZW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5xdWVyeUN1cnJlbnRSZWZlcmVuY2VJbWFnZSgpO1xuICAgICAgICAgICAgY2FzZSAnbGlzdF9hbGwnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmxpc3RSZWZlcmVuY2VJbWFnZXMoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgVW5rbm93biBpbWFnZSBxdWVyeSBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlSW1hZ2VUcmFuc2Zvcm0oYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgeyBhY3Rpb24gfSA9IGFyZ3M7XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnc2V0X3Bvc2l0aW9uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRSZWZlcmVuY2VJbWFnZVBvc2l0aW9uKGFyZ3MueCwgYXJncy55KTtcbiAgICAgICAgICAgIGNhc2UgJ3NldF9zY2FsZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2V0UmVmZXJlbmNlSW1hZ2VTY2FsZShhcmdzLnN4LCBhcmdzLnN5KTtcbiAgICAgICAgICAgIGNhc2UgJ3NldF9vcGFjaXR5JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRSZWZlcmVuY2VJbWFnZU9wYWNpdHkoYXJncy5vcGFjaXR5KTtcbiAgICAgICAgICAgIGNhc2UgJ3NldF9kYXRhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRSZWZlcmVuY2VJbWFnZURhdGEoYXJncy5rZXksIGFyZ3MudmFsdWUpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIGltYWdlIHRyYW5zZm9ybSBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlSW1hZ2VEaXNwbGF5KGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ3JlZnJlc2gnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlZnJlc2hSZWZlcmVuY2VJbWFnZSgpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIGltYWdlIGRpc3BsYXkgYWN0aW9uOiAke2FjdGlvbn1gIH07XG4gICAgICAgIH1cbiAgICB9XG5cbn0iXX0=