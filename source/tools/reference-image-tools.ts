import { ToolDefinition, ToolResponse, ToolExecutor } from '../types';

export class ReferenceImageTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
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

    async execute(toolName: string, args: any): Promise<ToolResponse> {
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

    private async addReferenceImage(paths: string[]): Promise<ToolResponse> {
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
        } catch (err: any) {
            // 增强错误信息
            let errorMessage = err.message;
            if (err.message.includes('not found') || err.message.includes('not exist')) {
                errorMessage = `Image file not found: ${paths.join(', ')}. Please check if the file exists and the path is correct.`;
            } else if (err.message.includes('permission')) {
                errorMessage = `Permission denied accessing image files: ${paths.join(', ')}. Please check file permissions.`;
            } else if (err.message.includes('format')) {
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

    private async removeReferenceImage(paths?: string[]): Promise<ToolResponse> {
        try {
            await Editor.Message.request('reference-image', 'remove-image', paths);
            const message = paths && paths.length > 0 ?
                `Removed ${paths.length} reference image(s)` :
                'Removed current reference image';
            return {
                success: true,
                message: message
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async switchReferenceImage(path: string, sceneUUID?: string): Promise<ToolResponse> {
        // 验证路径格式
        if (!path || typeof path !== 'string') {
            return {
                success: false,
                error: 'Invalid image path provided. Please provide a valid file path.'
            };
        }

        try {
            const args = sceneUUID ? [path, sceneUUID] : [path];
            const result: any = await Editor.Message.request('reference-image', 'switch-image', ...args);
            // 检查是否有警告信息
            const hasWarning = result && (result.warning || result.message?.includes('blank') || result.message?.includes('not found'));

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
        } catch (err: any) {
            let errorMessage = err.message;
            if (err.message.includes('not found') || err.message.includes('not exist')) {
                errorMessage = `Image file not found: ${path}. Please check if the file exists and the path is correct.`;
            } else if (err.message.includes('permission')) {
                errorMessage = `Permission denied accessing image file: ${path}. Please check file permissions.`;
            } else if (err.message.includes('format')) {
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

    private async setReferenceImageData(key: string, value: any): Promise<ToolResponse> {
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
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async queryReferenceImageConfig(): Promise<ToolResponse> {
        try {
            const config: any = await Editor.Message.request('reference-image', 'query-config');
            // 数据一致性检查
            const consistencyIssues = this.checkDataConsistency(config);

            return {
                success: true,
                data: {
                    ...config,
                    dataConsistency: {
                        issues: consistencyIssues,
                        hasIssues: consistencyIssues.length > 0
                    }
                },
                warning: consistencyIssues.length > 0 ?
                    `Data consistency issues detected: ${consistencyIssues.join(', ')}` : undefined
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private checkDataConsistency(config: any): string[] {
        const issues: string[] = [];
        
        if (!config) {
            issues.push('No configuration data available');
            return issues;
        }

        // 检查配置中的图片列表
        if (config.images && Array.isArray(config.images)) {
            const deletedImages = config.images.filter((img: any) => 
                img.path && (img.path.includes('deleted') || img.path.includes('nonexistent'))
            );
            
            if (deletedImages.length > 0) {
                issues.push(`Found ${deletedImages.length} deleted/nonexistent images in configuration`);
            }

            // 检查当前图片是否在列表中
            if (config.current && !config.images.find((img: any) => img.path === config.current)) {
                issues.push('Current image not found in image list');
            }

            // 检查重复的图片路径
            const paths = config.images.map((img: any) => img.path).filter(Boolean);
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

    private async queryCurrentReferenceImage(): Promise<ToolResponse> {
        try {
            const current: any = await Editor.Message.request('reference-image', 'query-current');
            return {
                success: true,
                data: current
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async refreshReferenceImage(): Promise<ToolResponse> {
        try {
            await Editor.Message.request('reference-image', 'refresh');
            return {
                success: true,
                message: 'Reference image refreshed'
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async setReferenceImagePosition(x: number, y: number): Promise<ToolResponse> {
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
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async setReferenceImageScale(sx: number, sy: number): Promise<ToolResponse> {
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
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async setReferenceImageOpacity(opacity: number): Promise<ToolResponse> {
        try {
            await Editor.Message.request('reference-image', 'set-image-data', 'opacity', opacity);
            return {
                success: true,
                data: {
                    opacity: opacity,
                    message: `Reference image opacity set to ${opacity}`
                }
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async listReferenceImages(): Promise<ToolResponse> {
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
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    private async clearAllReferenceImages(): Promise<ToolResponse> {
        try {
            // Remove all reference images by calling remove-image without paths
            await Editor.Message.request('reference-image', 'remove-image');

            return {
                success: true,
                message: 'All reference images cleared'
            };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    // New handler methods for optimized tools
    private async handleImageManagement(args: any): Promise<ToolResponse> {
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

    private async handleImageQuery(args: any): Promise<ToolResponse> {
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

    private async handleImageTransform(args: any): Promise<ToolResponse> {
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

    private async handleImageDisplay(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'refresh':
                return await this.refreshReferenceImage();
            default:
                return { success: false, error: `Unknown image display action: ${action}` };
        }
    }

}