import { ToolDefinition, ToolResponse, ToolExecutor } from '../types';

export class SceneAdvancedTools implements ToolExecutor {
    getTools(): ToolDefinition[] {
        return [
            {
                name: 'reset_node_property',
                description: 'Reset node property to default value',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        path: {
                            type: 'string',
                            description: 'Property path (e.g., position, rotation, scale)'
                        }
                    },
                    required: ['uuid', 'path']
                }
            },
            {
                name: 'move_array_element',
                description: 'Move array element position',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        path: {
                            type: 'string',
                            description: 'Array property path (e.g., __comps__)'
                        },
                        target: {
                            type: 'number',
                            description: 'Target item original index'
                        },
                        offset: {
                            type: 'number',
                            description: 'Offset amount (positive or negative)'
                        }
                    },
                    required: ['uuid', 'path', 'target', 'offset']
                }
            },
            {
                name: 'remove_array_element',
                description: 'Remove array element at specific index',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        path: {
                            type: 'string',
                            description: 'Array property path'
                        },
                        index: {
                            type: 'number',
                            description: 'Target item index to remove'
                        }
                    },
                    required: ['uuid', 'path', 'index']
                }
            },
            {
                name: 'copy_node',
                description: 'Copy node for later paste operation',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuids: {
                            oneOf: [
                                { type: 'string' },
                                { type: 'array', items: { type: 'string' } }
                            ],
                            description: 'Node UUID or array of UUIDs to copy'
                        }
                    },
                    required: ['uuids']
                }
            },
            {
                name: 'paste_node',
                description: 'Paste previously copied nodes',
                inputSchema: {
                    type: 'object',
                    properties: {
                        target: {
                            type: 'string',
                            description: 'Target parent node UUID'
                        },
                        uuids: {
                            oneOf: [
                                { type: 'string' },
                                { type: 'array', items: { type: 'string' } }
                            ],
                            description: 'Node UUIDs to paste'
                        },
                        keepWorldTransform: {
                            type: 'boolean',
                            description: 'Keep world transform coordinates',
                            default: false
                        }
                    },
                    required: ['target', 'uuids']
                }
            },
            {
                name: 'cut_node',
                description: 'Cut node (copy + mark for move)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuids: {
                            oneOf: [
                                { type: 'string' },
                                { type: 'array', items: { type: 'string' } }
                            ],
                            description: 'Node UUID or array of UUIDs to cut'
                        }
                    },
                    required: ['uuids']
                }
            },
            {
                name: 'reset_node_transform',
                description: 'Reset node position, rotation and scale',
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
                name: 'reset_component',
                description: 'Reset component to default values',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Component UUID'
                        }
                    },
                    required: ['uuid']
                }
            },
            {
                name: 'restore_prefab',
                description: 'Restore prefab instance from asset',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        assetUuid: {
                            type: 'string',
                            description: 'Prefab asset UUID'
                        }
                    },
                    required: ['nodeUuid', 'assetUuid']
                }
            },
            {
                name: 'execute_component_method',
                description: 'Execute method on component',
                inputSchema: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: 'Component UUID'
                        },
                        name: {
                            type: 'string',
                            description: 'Method name'
                        },
                        args: {
                            type: 'array',
                            description: 'Method arguments',
                            default: []
                        }
                    },
                    required: ['uuid', 'name']
                }
            },
            {
                name: 'execute_scene_script',
                description: 'Execute scene script method',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Plugin name'
                        },
                        method: {
                            type: 'string',
                            description: 'Method name'
                        },
                        args: {
                            type: 'array',
                            description: 'Method arguments',
                            default: []
                        }
                    },
                    required: ['name', 'method']
                }
            },
            {
                name: 'scene_snapshot',
                description: 'Create scene state snapshot',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'scene_snapshot_abort',
                description: 'Abort scene snapshot creation',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'begin_undo_recording',
                description: 'Begin recording undo data',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID to record'
                        }
                    },
                    required: ['nodeUuid']
                }
            },
            {
                name: 'end_undo_recording',
                description: 'End recording undo data',
                inputSchema: {
                    type: 'object',
                    properties: {
                        undoId: {
                            type: 'string',
                            description: 'Undo recording ID from begin_undo_recording'
                        }
                    },
                    required: ['undoId']
                }
            },
            {
                name: 'cancel_undo_recording',
                description: 'Cancel undo recording',
                inputSchema: {
                    type: 'object',
                    properties: {
                        undoId: {
                            type: 'string',
                            description: 'Undo recording ID to cancel'
                        }
                    },
                    required: ['undoId']
                }
            },
            {
                name: 'soft_reload_scene',
                description: 'Soft reload current scene',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'query_scene_ready',
                description: 'Check if scene is ready',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'query_scene_dirty',
                description: 'Check if scene has unsaved changes',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'query_scene_classes',
                description: 'Query all registered classes',
                inputSchema: {
                    type: 'object',
                    properties: {
                        extends: {
                            type: 'string',
                            description: 'Filter classes that extend this base class'
                        }
                    }
                }
            },
            {
                name: 'query_scene_components',
                description: 'Query available scene components',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'query_component_has_script',
                description: 'Check if component has script',
                inputSchema: {
                    type: 'object',
                    properties: {
                        className: {
                            type: 'string',
                            description: 'Script class name to check'
                        }
                    },
                    required: ['className']
                }
            },
            {
                name: 'query_nodes_by_asset_uuid',
                description: 'Find nodes that use specific asset UUID',
                inputSchema: {
                    type: 'object',
                    properties: {
                        assetUuid: {
                            type: 'string',
                            description: 'Asset UUID to search for'
                        }
                    },
                    required: ['assetUuid']
                }
            }
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'reset_node_property':
                return await this.resetNodeProperty(args.uuid, args.path);
            case 'move_array_element':
                return await this.moveArrayElement(args.uuid, args.path, args.target, args.offset);
            case 'remove_array_element':
                return await this.removeArrayElement(args.uuid, args.path, args.index);
            case 'copy_node':
                return await this.copyNode(args.uuids);
            case 'paste_node':
                return await this.pasteNode(args.target, args.uuids, args.keepWorldTransform);
            case 'cut_node':
                return await this.cutNode(args.uuids);
            case 'reset_node_transform':
                return await this.resetNodeTransform(args.uuid);
            case 'reset_component':
                return await this.resetComponent(args.uuid);
            case 'restore_prefab':
                return await this.restorePrefab(args.nodeUuid, args.assetUuid);
            case 'execute_component_method':
                return await this.executeComponentMethod(args.uuid, args.name, args.args);
            case 'execute_scene_script':
                return await this.executeSceneScript(args.name, args.method, args.args);
            case 'scene_snapshot':
                return await this.sceneSnapshot();
            case 'scene_snapshot_abort':
                return await this.sceneSnapshotAbort();
            case 'begin_undo_recording':
                return await this.beginUndoRecording(args.nodeUuid);
            case 'end_undo_recording':
                return await this.endUndoRecording(args.undoId);
            case 'cancel_undo_recording':
                return await this.cancelUndoRecording(args.undoId);
            case 'soft_reload_scene':
                return await this.softReloadScene();
            case 'query_scene_ready':
                return await this.querySceneReady();
            case 'query_scene_dirty':
                return await this.querySceneDirty();
            case 'query_scene_classes':
                return await this.querySceneClasses(args.extends);
            case 'query_scene_components':
                return await this.querySceneComponents();
            case 'query_component_has_script':
                return await this.queryComponentHasScript(args.className);
            case 'query_nodes_by_asset_uuid':
                return await this.queryNodesByAssetUuid(args.assetUuid);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async resetNodeProperty(uuid: string, path: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'reset-property', { 
                uuid, 
                path, 
                dump: { value: null } 
            }).then(() => {
                resolve({
                    success: true,
                    message: `Property '${path}' reset to default value`
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async moveArrayElement(uuid: string, path: string, target: number, offset: number): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'move-array-element', {
                uuid,
                path,
                target,
                offset
            }).then(() => {
                resolve({
                    success: true,
                    message: `Array element at index ${target} moved by ${offset}`
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async removeArrayElement(uuid: string, path: string, index: number): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'remove-array-element', {
                uuid,
                path,
                index
            }).then(() => {
                resolve({
                    success: true,
                    message: `Array element at index ${index} removed`
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async copyNode(uuids: string | string[]): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'copy-node', uuids).then((result: string | string[]) => {
                resolve({
                    success: true,
                    data: {
                        copiedUuids: result,
                        message: 'Node(s) copied successfully'
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async pasteNode(target: string, uuids: string | string[], keepWorldTransform: boolean = false): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'paste-node', {
                target,
                uuids,
                keepWorldTransform
            }).then((result: string | string[]) => {
                resolve({
                    success: true,
                    data: {
                        newUuids: result,
                        message: 'Node(s) pasted successfully'
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async cutNode(uuids: string | string[]): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'cut-node', uuids).then((result: any) => {
                resolve({
                    success: true,
                    data: {
                        cutUuids: result,
                        message: 'Node(s) cut successfully'
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async resetNodeTransform(uuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'reset-node', { uuid }).then(() => {
                resolve({
                    success: true,
                    message: 'Node transform reset to default'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async resetComponent(uuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'reset-component', { uuid }).then(() => {
                resolve({
                    success: true,
                    message: 'Component reset to default values'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async restorePrefab(nodeUuid: string, assetUuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            (Editor.Message.request as any)('scene', 'restore-prefab', nodeUuid, assetUuid).then(() => {
                resolve({
                    success: true,
                    message: 'Prefab restored successfully'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async executeComponentMethod(uuid: string, name: string, args: any[] = []): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'execute-component-method', {
                uuid,
                name,
                args
            }).then((result: any) => {
                resolve({
                    success: true,
                    data: {
                        result: result,
                        message: `Method '${name}' executed successfully`
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async executeSceneScript(name: string, method: string, args: any[] = []): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'execute-scene-script', {
                name,
                method,
                args
            }).then((result: any) => {
                resolve({
                    success: true,
                    data: result
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async sceneSnapshot(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'snapshot').then(() => {
                resolve({
                    success: true,
                    message: 'Scene snapshot created'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async sceneSnapshotAbort(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'snapshot-abort').then(() => {
                resolve({
                    success: true,
                    message: 'Scene snapshot aborted'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async beginUndoRecording(nodeUuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'begin-recording', nodeUuid).then((undoId: string) => {
                resolve({
                    success: true,
                    data: {
                        undoId: undoId,
                        message: 'Undo recording started'
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async endUndoRecording(undoId: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'end-recording', undoId).then(() => {
                resolve({
                    success: true,
                    message: 'Undo recording ended'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async cancelUndoRecording(undoId: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'cancel-recording', undoId).then(() => {
                resolve({
                    success: true,
                    message: 'Undo recording cancelled'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async softReloadScene(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'soft-reload').then(() => {
                resolve({
                    success: true,
                    message: 'Scene soft reloaded successfully'
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async querySceneReady(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-is-ready').then((ready: boolean) => {
                resolve({
                    success: true,
                    data: {
                        ready: ready,
                        message: ready ? 'Scene is ready' : 'Scene is not ready'
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async querySceneDirty(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-dirty').then((dirty: boolean) => {
                resolve({
                    success: true,
                    data: {
                        dirty: dirty,
                        message: dirty ? 'Scene has unsaved changes' : 'Scene is clean'
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async querySceneClasses(extendsClass?: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            const options: any = {};
            if (extendsClass) {
                options.extends = extendsClass;
            }

            Editor.Message.request('scene', 'query-classes', options).then((classes: any[]) => {
                resolve({
                    success: true,
                    data: {
                        classes: classes,
                        count: classes.length,
                        extendsFilter: extendsClass
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async querySceneComponents(): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-components').then((components: any[]) => {
                resolve({
                    success: true,
                    data: {
                        components: components,
                        count: components.length
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async queryComponentHasScript(className: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-component-has-script', className).then((hasScript: boolean) => {
                resolve({
                    success: true,
                    data: {
                        className: className,
                        hasScript: hasScript,
                        message: hasScript ? `Component '${className}' has script` : `Component '${className}' does not have script`
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }

    private async queryNodesByAssetUuid(assetUuid: string): Promise<ToolResponse> {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-nodes-by-asset-uuid', assetUuid).then((nodeUuids: string[]) => {
                resolve({
                    success: true,
                    data: {
                        assetUuid: assetUuid,
                        nodeUuids: nodeUuids,
                        count: nodeUuids.length,
                        message: `Found ${nodeUuids.length} nodes using asset`
                    }
                });
            }).catch((err: Error) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
}