"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceImageTools = void 0;
class ReferenceImageTools {
    getTools() {
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
    async execute(toolName, args) {
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
    async addReferenceImage(paths) {
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
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async removeReferenceImage(paths) {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'remove-image', paths).then(() => {
                const message = paths && paths.length > 0 ?
                    `Removed ${paths.length} reference image(s)` :
                    'Removed current reference image';
                resolve({
                    success: true,
                    message: message
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async switchReferenceImage(path, sceneUUID) {
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
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async setReferenceImageData(key, value) {
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
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async queryReferenceImageConfig() {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'query-config').then((config) => {
                resolve({
                    success: true,
                    data: config
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async queryCurrentReferenceImage() {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'query-current').then((current) => {
                resolve({
                    success: true,
                    data: current
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async refreshReferenceImage() {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'refresh').then(() => {
                resolve({
                    success: true,
                    message: 'Reference image refreshed'
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async setReferenceImagePosition(x, y) {
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
            }
            catch (err) {
                resolve({ success: false, error: err.message });
            }
        });
    }
    async setReferenceImageScale(sx, sy) {
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
            }
            catch (err) {
                resolve({ success: false, error: err.message });
            }
        });
    }
    async setReferenceImageOpacity(opacity) {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'set-image-data', 'opacity', opacity).then(() => {
                resolve({
                    success: true,
                    data: {
                        opacity: opacity,
                        message: `Reference image opacity set to ${opacity}`
                    }
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async listReferenceImages() {
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
            }
            catch (err) {
                resolve({ success: false, error: err.message });
            }
        });
    }
    async clearAllReferenceImages() {
        return new Promise(async (resolve) => {
            try {
                // Remove all reference images by calling remove-image without paths
                await Editor.Message.request('reference-image', 'remove-image');
                resolve({
                    success: true,
                    message: 'All reference images cleared'
                });
            }
            catch (err) {
                resolve({ success: false, error: err.message });
            }
        });
    }
}
exports.ReferenceImageTools = ReferenceImageTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLWltYWdlLXRvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL3Rvb2xzL3JlZmVyZW5jZS1pbWFnZS10b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLG1CQUFtQjtJQUM1QixRQUFRO1FBQ0osT0FBTztZQUNIO2dCQUNJLElBQUksRUFBRSxxQkFBcUI7Z0JBQzNCLFdBQVcsRUFBRSxpQ0FBaUM7Z0JBQzlDLFdBQVcsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsS0FBSyxFQUFFOzRCQUNILElBQUksRUFBRSxPQUFPOzRCQUNiLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7NEJBQ3pCLFdBQVcsRUFBRSx5Q0FBeUM7eUJBQ3pEO3FCQUNKO29CQUNELFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQztpQkFDdEI7YUFDSjtZQUNEO2dCQUNJLElBQUksRUFBRSx3QkFBd0I7Z0JBQzlCLFdBQVcsRUFBRSwyQkFBMkI7Z0JBQ3hDLFdBQVcsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsS0FBSyxFQUFFOzRCQUNILElBQUksRUFBRSxPQUFPOzRCQUNiLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7NEJBQ3pCLFdBQVcsRUFBRSwrRUFBK0U7eUJBQy9GO3FCQUNKO2lCQUNKO2FBQ0o7WUFDRDtnQkFDSSxJQUFJLEVBQUUsd0JBQXdCO2dCQUM5QixXQUFXLEVBQUUsb0NBQW9DO2dCQUNqRCxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsK0JBQStCO3lCQUMvQzt3QkFDRCxTQUFTLEVBQUU7NEJBQ1AsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FB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TSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFFaEUsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSxJQUFJO29CQUNiLE9BQU8sRUFBRSw4QkFBOEI7aUJBQzFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFBQyxPQUFPLEdBQVEsRUFBRSxDQUFDO2dCQUNoQixPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNwRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUE1WUQsa0RBNFlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVG9vbERlZmluaXRpb24sIFRvb2xSZXNwb25zZSwgVG9vbEV4ZWN1dG9yIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgUmVmZXJlbmNlSW1hZ2VUb29scyBpbXBsZW1lbnRzIFRvb2xFeGVjdXRvciB7XG4gICAgZ2V0VG9vbHMoKTogVG9vbERlZmluaXRpb25bXSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkZF9yZWZlcmVuY2VfaW1hZ2UnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQWRkIHJlZmVyZW5jZSBpbWFnZShzKSB0byBzY2VuZScsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXJyYXkgb2YgcmVmZXJlbmNlIGltYWdlIGFic29sdXRlIHBhdGhzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydwYXRocyddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVtb3ZlX3JlZmVyZW5jZV9pbWFnZScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdSZW1vdmUgcmVmZXJlbmNlIGltYWdlKHMpJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBcnJheSBvZiByZWZlcmVuY2UgaW1hZ2UgcGF0aHMgdG8gcmVtb3ZlIChvcHRpb25hbCwgcmVtb3ZlcyBjdXJyZW50IGlmIGVtcHR5KSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3N3aXRjaF9yZWZlcmVuY2VfaW1hZ2UnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU3dpdGNoIHRvIHNwZWNpZmljIHJlZmVyZW5jZSBpbWFnZScsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1JlZmVyZW5jZSBpbWFnZSBhYnNvbHV0ZSBwYXRoJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjZW5lVVVJRDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU3BlY2lmaWMgc2NlbmUgVVVJRCAob3B0aW9uYWwpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydwYXRoJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzZXRfcmVmZXJlbmNlX2ltYWdlX2RhdGEnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IHJlZmVyZW5jZSBpbWFnZSB0cmFuc2Zvcm0gYW5kIGRpc3BsYXkgcHJvcGVydGllcycsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUHJvcGVydHkga2V5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ3BhdGgnLCAneCcsICd5JywgJ3N4JywgJ3N5JywgJ29wYWNpdHknXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcm9wZXJ0eSB2YWx1ZSAocGF0aDogc3RyaW5nLCB4L3kvc3gvc3k6IG51bWJlciwgb3BhY2l0eTogbnVtYmVyIDAtMSknXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2tleScsICd2YWx1ZSddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncXVlcnlfcmVmZXJlbmNlX2ltYWdlX2NvbmZpZycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdRdWVyeSByZWZlcmVuY2UgaW1hZ2UgY29uZmlndXJhdGlvbicsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncXVlcnlfY3VycmVudF9yZWZlcmVuY2VfaW1hZ2UnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUXVlcnkgY3VycmVudCByZWZlcmVuY2UgaW1hZ2UgZGF0YScsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVmcmVzaF9yZWZlcmVuY2VfaW1hZ2UnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUmVmcmVzaCByZWZlcmVuY2UgaW1hZ2UgZGlzcGxheScsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2V0X3JlZmVyZW5jZV9pbWFnZV9wb3NpdGlvbicsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZXQgcmVmZXJlbmNlIGltYWdlIHBvc2l0aW9uJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnWCBvZmZzZXQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnWSBvZmZzZXQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3gnLCAneSddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2V0X3JlZmVyZW5jZV9pbWFnZV9zY2FsZScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZXQgcmVmZXJlbmNlIGltYWdlIHNjYWxlJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3g6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1ggc2NhbGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IDAuMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdZIHNjYWxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiAwLjEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnc3gnLCAnc3knXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3NldF9yZWZlcmVuY2VfaW1hZ2Vfb3BhY2l0eScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZXQgcmVmZXJlbmNlIGltYWdlIG9wYWNpdHknLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdPcGFjaXR5ICgwLjAgdG8gMS4wKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ29wYWNpdHknXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2xpc3RfcmVmZXJlbmNlX2ltYWdlcycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdMaXN0IGFsbCBhdmFpbGFibGUgcmVmZXJlbmNlIGltYWdlcycsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY2xlYXJfYWxsX3JlZmVyZW5jZV9pbWFnZXMnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ2xlYXIgYWxsIHJlZmVyZW5jZSBpbWFnZXMnLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlKHRvb2xOYW1lOiBzdHJpbmcsIGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHN3aXRjaCAodG9vbE5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2FkZF9yZWZlcmVuY2VfaW1hZ2UnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmFkZFJlZmVyZW5jZUltYWdlKGFyZ3MucGF0aHMpO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlX3JlZmVyZW5jZV9pbWFnZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucmVtb3ZlUmVmZXJlbmNlSW1hZ2UoYXJncy5wYXRocyk7XG4gICAgICAgICAgICBjYXNlICdzd2l0Y2hfcmVmZXJlbmNlX2ltYWdlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zd2l0Y2hSZWZlcmVuY2VJbWFnZShhcmdzLnBhdGgsIGFyZ3Muc2NlbmVVVUlEKTtcbiAgICAgICAgICAgIGNhc2UgJ3NldF9yZWZlcmVuY2VfaW1hZ2VfZGF0YSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2V0UmVmZXJlbmNlSW1hZ2VEYXRhKGFyZ3Mua2V5LCBhcmdzLnZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5X3JlZmVyZW5jZV9pbWFnZV9jb25maWcnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnF1ZXJ5UmVmZXJlbmNlSW1hZ2VDb25maWcoKTtcbiAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5X2N1cnJlbnRfcmVmZXJlbmNlX2ltYWdlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5xdWVyeUN1cnJlbnRSZWZlcmVuY2VJbWFnZSgpO1xuICAgICAgICAgICAgY2FzZSAncmVmcmVzaF9yZWZlcmVuY2VfaW1hZ2UnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlZnJlc2hSZWZlcmVuY2VJbWFnZSgpO1xuICAgICAgICAgICAgY2FzZSAnc2V0X3JlZmVyZW5jZV9pbWFnZV9wb3NpdGlvbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2V0UmVmZXJlbmNlSW1hZ2VQb3NpdGlvbihhcmdzLngsIGFyZ3MueSk7XG4gICAgICAgICAgICBjYXNlICdzZXRfcmVmZXJlbmNlX2ltYWdlX3NjYWxlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRSZWZlcmVuY2VJbWFnZVNjYWxlKGFyZ3Muc3gsIGFyZ3Muc3kpO1xuICAgICAgICAgICAgY2FzZSAnc2V0X3JlZmVyZW5jZV9pbWFnZV9vcGFjaXR5JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRSZWZlcmVuY2VJbWFnZU9wYWNpdHkoYXJncy5vcGFjaXR5KTtcbiAgICAgICAgICAgIGNhc2UgJ2xpc3RfcmVmZXJlbmNlX2ltYWdlcyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMubGlzdFJlZmVyZW5jZUltYWdlcygpO1xuICAgICAgICAgICAgY2FzZSAnY2xlYXJfYWxsX3JlZmVyZW5jZV9pbWFnZXMnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNsZWFyQWxsUmVmZXJlbmNlSW1hZ2VzKCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biB0b29sOiAke3Rvb2xOYW1lfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBhZGRSZWZlcmVuY2VJbWFnZShwYXRoczogc3RyaW5nW10pOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdhZGQtaW1hZ2UnLCBwYXRocykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkUGF0aHM6IHBhdGhzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHBhdGhzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBBZGRlZCAke3BhdGhzLmxlbmd0aH0gcmVmZXJlbmNlIGltYWdlKHMpYFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcmVtb3ZlUmVmZXJlbmNlSW1hZ2UocGF0aHM/OiBzdHJpbmdbXSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3JlbW92ZS1pbWFnZScsIHBhdGhzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gcGF0aHMgJiYgcGF0aHMubGVuZ3RoID4gMCA/IFxuICAgICAgICAgICAgICAgICAgICBgUmVtb3ZlZCAke3BhdGhzLmxlbmd0aH0gcmVmZXJlbmNlIGltYWdlKHMpYCA6IFxuICAgICAgICAgICAgICAgICAgICAnUmVtb3ZlZCBjdXJyZW50IHJlZmVyZW5jZSBpbWFnZSc7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzd2l0Y2hSZWZlcmVuY2VJbWFnZShwYXRoOiBzdHJpbmcsIHNjZW5lVVVJRD86IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXJncyA9IHNjZW5lVVVJRCA/IFtwYXRoLCBzY2VuZVVVSURdIDogW3BhdGhdO1xuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3N3aXRjaC1pbWFnZScsIC4uLmFyZ3MpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmVVVUlEOiBzY2VuZVVVSUQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgU3dpdGNoZWQgdG8gcmVmZXJlbmNlIGltYWdlOiAke3BhdGh9YFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgc2V0UmVmZXJlbmNlSW1hZ2VEYXRhKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAnc2V0LWltYWdlLWRhdGEnLCBrZXksIHZhbHVlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgUmVmZXJlbmNlIGltYWdlICR7a2V5fSBzZXQgdG8gJHt2YWx1ZX1gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBxdWVyeVJlZmVyZW5jZUltYWdlQ29uZmlnKCk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3F1ZXJ5LWNvbmZpZycpLnRoZW4oKGNvbmZpZzogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGNvbmZpZ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHF1ZXJ5Q3VycmVudFJlZmVyZW5jZUltYWdlKCk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3F1ZXJ5LWN1cnJlbnQnKS50aGVuKChjdXJyZW50OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY3VycmVudFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHJlZnJlc2hSZWZlcmVuY2VJbWFnZSgpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdyZWZyZXNoJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdSZWZlcmVuY2UgaW1hZ2UgcmVmcmVzaGVkJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHNldFJlZmVyZW5jZUltYWdlUG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3NldC1pbWFnZS1kYXRhJywgJ3gnLCB4KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAnc2V0LWltYWdlLWRhdGEnLCAneScsIHkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBSZWZlcmVuY2UgaW1hZ2UgcG9zaXRpb24gc2V0IHRvICgke3h9LCAke3l9KWBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZXRSZWZlcmVuY2VJbWFnZVNjYWxlKHN4OiBudW1iZXIsIHN5OiBudW1iZXIpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3NldC1pbWFnZS1kYXRhJywgJ3N4Jywgc3gpO1xuICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdzZXQtaW1hZ2UtZGF0YScsICdzeScsIHN5KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3g6IHN4LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3k6IHN5LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFJlZmVyZW5jZSBpbWFnZSBzY2FsZSBzZXQgdG8gKCR7c3h9LCAke3N5fSlgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgc2V0UmVmZXJlbmNlSW1hZ2VPcGFjaXR5KG9wYWNpdHk6IG51bWJlcik6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3NldC1pbWFnZS1kYXRhJywgJ29wYWNpdHknLCBvcGFjaXR5KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogb3BhY2l0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBSZWZlcmVuY2UgaW1hZ2Ugb3BhY2l0eSBzZXQgdG8gJHtvcGFjaXR5fWBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxpc3RSZWZlcmVuY2VJbWFnZXMoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdxdWVyeS1jb25maWcnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3F1ZXJ5LWN1cnJlbnQnKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBjdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1JlZmVyZW5jZSBpbWFnZSBpbmZvcm1hdGlvbiByZXRyaWV2ZWQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2xlYXJBbGxSZWZlcmVuY2VJbWFnZXMoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgcmVmZXJlbmNlIGltYWdlcyBieSBjYWxsaW5nIHJlbW92ZS1pbWFnZSB3aXRob3V0IHBhdGhzXG4gICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3JlbW92ZS1pbWFnZScpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnQWxsIHJlZmVyZW5jZSBpbWFnZXMgY2xlYXJlZCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=