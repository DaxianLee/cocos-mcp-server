import { ToolDefinition, ToolResponse, ToolExecutor } from '../types';

export class ReferenceImageTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            {
                name: 'add_reference_image',
                description: 'Add reference image(s) to scene',
                inputSchema: {
                    type: 'object',
                    properties: {
                        paths: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Array of reference image absolute paths'
                        }
                    },
                    required: ['paths']
                }
            },
            {
                name: 'remove_reference_image',
                description: 'Remove reference image(s)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        paths: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Array of reference image paths to remove (optional, removes current if empty)'
                        }
                    }
                }
            },
            {
                name: 'switch_reference_image',
                description: 'Switch to specific reference image',
                inputSchema: {
                    type: 'object',
                    properties: {
                        path: {
                            type: 'string',
                            description: 'Reference image absolute path'
                        },
                        sceneUUID: {
                            type: 'string',
                            description: 'Specific scene UUID (optional)'
                        }
                    },
                    required: ['path']
                }
            },
            {
                name: 'set_reference_image_data',
                description: 'Set reference image transform and display properties',
                inputSchema: {
                    type: 'object',
                    properties: {
                        key: {
                            type: 'string',
                            description: 'Property key',
                            enum: ['path', 'x', 'y', 'sx', 'sy', 'opacity']
                        },
                        value: {
                            description: 'Property value (path: string, x/y/sx/sy: number, opacity: number 0-1)'
                        }
                    },
                    required: ['key', 'value']
                }
            },
            {
                name: 'query_reference_image_config',
                description: 'Query reference image configuration',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'query_current_reference_image',
                description: 'Query current reference image data',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'refresh_reference_image',
                description: 'Refresh reference image display',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'set_reference_image_position',
                description: 'Set reference image position',
                inputSchema: {
                    type: 'object',
                    properties: {
                        x: {
                            type: 'number',
                            description: 'X offset'
                        },
                        y: {
                            type: 'number',
                            description: 'Y offset'
                        }
                    },
                    required: ['x', 'y']
                }
            },
            {
                name: 'set_reference_image_scale',
                description: 'Set reference image scale',
                inputSchema: {
                    type: 'object',
                    properties: {
                        sx: {
                            type: 'number',
                            description: 'X scale',
                            minimum: 0.1,
                            maximum: 10
                        },
                        sy: {
                            type: 'number',
                            description: 'Y scale',
                            minimum: 0.1,
                            maximum: 10
                        }
                    },
                    required: ['sx', 'sy']
                }
            },
            {
                name: 'set_reference_image_opacity',
                description: 'Set reference image opacity',
                inputSchema: {
                    type: 'object',
                    properties: {
                        opacity: {
                            type: 'number',
                            description: 'Opacity (0.0 to 1.0)',
                            minimum: 0,
                            maximum: 1
                        }
                    },
                    required: ['opacity']
                }
            },
            {
                name: 'list_reference_images',
                description: 'List all available reference images',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'clear_all_reference_images',
                description: 'Clear all reference images',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'add_reference_image':
                return await this.addReferenceImage(args.paths);
            case 'remove_reference_image':
                return await this.removeReferenceImage(args.paths);
            case 'switch_reference_image':
                return await this.switchReferenceImage(args.path, args.sceneUUID);
            case 'set_reference_image_data':
                return await this.setReferenceImageData(args.key, args.value);
            case 'query_reference_image_config':
                return await this.queryReferenceImageConfig();
            case 'query_current_reference_image':
                return await this.queryCurrentReferenceImage();
            case 'refresh_reference_image':
                return await this.refreshReferenceImage();
            case 'set_reference_image_position':
                return await this.setReferenceImagePosition(args.x, args.y);
            case 'set_reference_image_scale':
                return await this.setReferenceImageScale(args.sx, args.sy);
            case 'set_reference_image_opacity':
                return await this.setReferenceImageOpacity(args.opacity);
            case 'list_reference_images':
                return await this.listReferenceImages();
            case 'clear_all_reference_images':
                return await this.clearAllReferenceImages();
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async addReferenceImage(paths: string[]): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'add-image', paths).then(() => {
                resolve({
                    success: true,
                    data: {
                        addedPaths: paths,
                        count: paths.length,
                        message: `Added ${paths.length} reference image(s)`
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async removeReferenceImage(paths?: string[]): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'remove-image', paths).then(() => {
                const message = paths && paths.length > 0 ? 
                    `Removed ${paths.length} reference image(s)` : 
                    'Removed current reference image';
                resolve({
                    success: true,
                    message: message
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async switchReferenceImage(path: string, sceneUUID?: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            const args = sceneUUID ? [path, sceneUUID] : [path];
            Editor.Message.request('reference-image', 'switch-image', ...args).then(() => {
                resolve({
                    success: true,
                    data: {
                        path: path,
                        sceneUUID: sceneUUID,
                        message: `Switched to reference image: ${path}`
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async setReferenceImageData(key: string, value: any): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'set-image-data', key, value).then(() => {
                resolve({
                    success: true,
                    data: {
                        key: key,
                        value: value,
                        message: `Reference image ${key} set to ${value}`
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async queryReferenceImageConfig(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'query-config').then((config: any) => {
                resolve({
                    success: true,
                    data: config
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async queryCurrentReferenceImage(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'query-current').then((current: any) => {
                resolve({
                    success: true,
                    data: current
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async refreshReferenceImage(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'refresh').then(() => {
                resolve({
                    success: true,
                    message: 'Reference image refreshed'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async setReferenceImagePosition(x: number, y: number): Promise<ToolResponse> {
        return new Promise(async (resolve) => {
            try {
                await Editor.Message.request('reference-image', 'set-image-data', 'x', x);
                await Editor.Message.request('reference-image', 'set-image-data', 'y', y);
                
                resolve({
                    success: true,
                    data: {
                        x: x,
                        y: y,
                        message: `Reference image position set to (${x}, ${y})`
                    }
                });
            } catch (err: any) {
                resolve({ success: false, error: err.message });
            }
        });
    }

    private async setReferenceImageScale(sx: number, sy: number): Promise<ToolResponse> {
        return new Promise(async (resolve) => {
            try {
                await Editor.Message.request('reference-image', 'set-image-data', 'sx', sx);
                await Editor.Message.request('reference-image', 'set-image-data', 'sy', sy);
                
                resolve({
                    success: true,
                    data: {
                        sx: sx,
                        sy: sy,
                        message: `Reference image scale set to (${sx}, ${sy})`
                    }
                });
            } catch (err: any) {
                resolve({ success: false, error: err.message });
            }
        });
    }

    private async setReferenceImageOpacity(opacity: number): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'set-image-data', 'opacity', opacity).then(() => {
                resolve({
                    success: true,
                    data: {
                        opacity: opacity,
                        message: `Reference image opacity set to ${opacity}`
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async listReferenceImages(): Promise<ToolResponse> {
        return new Promise(async (resolve) => {
            try {
                const config = await Editor.Message.request('reference-image', 'query-config');
                const current = await Editor.Message.request('reference-image', 'query-current');
                
                resolve({
                    success: true,
                    data: {
                        config: config,
                        current: current,
                        message: 'Reference image information retrieved'
                    }
                });
            } catch (err: any) {
                resolve({ success: false, error: err.message });
            }
        });
    }

    private async clearAllReferenceImages(): Promise<ToolResponse> {
        return new Promise(async (resolve) => {
            try {
                // Remove all reference images by calling remove-image without paths
                await Editor.Message.request('reference-image', 'remove-image');
                
                resolve({
                    success: true,
                    message: 'All reference images cleared'
                });
            } catch (err: any) {
                resolve({ success: false, error: err.message });
            }
        });
    }
}