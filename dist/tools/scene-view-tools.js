"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneViewTools = void 0;
class SceneViewTools {
    getTools() {
        return [
            {
                name: 'scene_view_gizmo_management',
                description: 'GIZMO MANAGEMENT: Control scene manipulation tools and transformation handles. USAGE: Change between position/rotation/scale tools, switch coordinate systems (local/global), adjust pivot points. Essential for precise scene editing and object manipulation in the editor.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            description: 'Gizmo operation to perform. Query actions get current state, change actions modify settings.',
                            enum: ['change_tool', 'query_tool', 'change_pivot', 'query_pivot', 'change_coordinate', 'query_coordinate', 'query_view_mode']
                        },
                        toolName: {
                            type: 'string',
                            description: 'Transformation tool type (REQUIRED for change_tool action). "position" = move objects, "rotation" = rotate objects, "scale" = resize objects, "rect" = 2D rect transform. Choose based on desired editing operation.',
                            enum: ['position', 'rotation', 'scale', 'rect']
                        },
                        pivotName: {
                            type: 'string',
                            description: 'Transform pivot point (REQUIRED for change_pivot action). "pivot" = use object\'s pivot point (local center), "center" = use geometric center (bounding box center). Affects rotation and scaling behavior.',
                            enum: ['pivot', 'center']
                        },
                        coordinateType: {
                            type: 'string',
                            description: 'Coordinate system reference (REQUIRED for change_coordinate action). "local" = relative to object\'s orientation, "global" = relative to world axes. Local useful for object-oriented editing, global for world-aligned operations.',
                            enum: ['local', 'global']
                        }
                    },
                    required: ['action']
                }
            },
            {
                name: 'scene_view_mode_control',
                description: 'VIEW MODE CONTROL: Switch scene editor between 2D and 3D modes and control visual aids. USAGE: Toggle 2D/3D perspective for different editing contexts, show/hide grid for alignment reference. 2D mode for UI/sprite editing, 3D mode for 3D scene construction.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            description: 'View control operation. Change actions modify view state, query actions get current state.',
                            enum: ['change_2d_3d', 'query_2d_3d', 'set_grid', 'query_grid']
                        },
                        is2D: {
                            type: 'boolean',
                            description: 'View mode setting (REQUIRED for change_2d_3d action). true = 2D orthographic view (for UI, sprites, 2D games), false = 3D perspective view (for 3D scenes, spatial editing). Choose based on content type.'
                        },
                        gridVisible: {
                            type: 'boolean',
                            description: 'Grid display state (REQUIRED for set_grid action). true = show alignment grid (helpful for positioning), false = hide grid (cleaner view for final preview). Grid aids in precise object placement and alignment.'
                        }
                    },
                    required: ['action']
                }
            },
            {
                name: 'scene_view_icon_gizmo',
                description: 'ICON GIZMO CONTROL: Configure visual representation of scene nodes and components. USAGE: Adjust icon display mode (2D/3D) and size for better visibility. Useful for managing visual clutter and improving scene navigation when working with many objects.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            description: 'Icon gizmo operation. Set actions modify appearance, query actions get current settings.',
                            enum: ['set_3d_mode', 'query_3d_mode', 'set_size', 'query_size']
                        },
                        is3D: {
                            type: 'boolean',
                            description: 'Icon display mode (REQUIRED for set_3d_mode action). true = 3D icons (spatial representation), false = 2D icons (flat representation). 3D mode for spatial awareness, 2D mode for reduced visual complexity.'
                        },
                        size: {
                            type: 'number',
                            description: 'Icon size scale (REQUIRED for set_size action). Range: 10-100. Smaller values = less visual noise, larger values = easier selection. Recommended: 20-30 for dense scenes, 40-60 for sparse scenes. Adjust based on scene complexity.',
                            minimum: 10,
                            maximum: 100
                        }
                    },
                    required: ['action']
                }
            },
            {
                name: 'scene_view_camera_control',
                description: 'CAMERA CONTROL: Navigate and position the scene view camera for better editing workflow. USAGE: Focus on specific objects, align camera angles, and synchronize view positions. Essential for efficient scene navigation and precise editing of complex scenes.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            description: 'Camera operation: "focus_on_nodes" = center view on specific nodes (requires nodeUuids) | "align_camera_with_view" = sync camera to current view | "align_view_with_node" = position view to match node orientation.',
                            enum: ['focus_on_nodes', 'align_camera_with_view', 'align_view_with_node']
                        },
                        nodeUuids: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Node UUIDs to focus on (REQUIRED for focus_on_nodes action). Array of node UUIDs to center in view. Use node_query to get UUIDs first. Examples: ["node-uuid-1", "node-uuid-2"]. Empty array [] focuses on all scene nodes. Format: array of UUID strings.'
                        }
                    },
                    required: ['action']
                }
            },
            {
                name: 'scene_view_status_management',
                description: 'STATUS MANAGEMENT: Monitor scene view configuration and restore default settings. USAGE: "get_status" for comprehensive view state information, "reset_view" to restore default camera position and settings. Useful for troubleshooting view issues and standardizing editor state.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            description: 'Status operation: "get_status" = retrieve current scene view configuration and settings | "reset_view" = restore scene view to default camera position and settings (no parameters needed).',
                            enum: ['get_status', 'reset_view']
                        }
                    },
                    required: ['action']
                }
            }
        ];
    }
    async execute(toolName, args) {
        switch (toolName) {
            case 'scene_view_gizmo_management':
                return await this.handleGizmoManagement(args);
            case 'scene_view_mode_control':
                return await this.handleViewModeControl(args);
            case 'scene_view_icon_gizmo':
                return await this.handleIconGizmo(args);
            case 'scene_view_camera_control':
                return await this.handleCameraControl(args);
            case 'scene_view_status_management':
                return await this.handleStatusManagement(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
    async handleGizmoManagement(args) {
        const { action, toolName, pivotName, coordinateType } = args;
        switch (action) {
            case 'change_tool':
                if (!toolName) {
                    return { success: false, error: 'toolName is required for change_tool action' };
                }
                return await this.changeGizmoTool(toolName);
            case 'query_tool':
                return await this.queryGizmoToolName();
            case 'change_pivot':
                if (!pivotName) {
                    return { success: false, error: 'pivotName is required for change_pivot action' };
                }
                return await this.changeGizmoPivot(pivotName);
            case 'query_pivot':
                return await this.queryGizmoPivot();
            case 'change_coordinate':
                if (!coordinateType) {
                    return { success: false, error: 'coordinateType is required for change_coordinate action' };
                }
                return await this.changeGizmoCoordinate(coordinateType);
            case 'query_coordinate':
                return await this.queryGizmoCoordinate();
            case 'query_view_mode':
                return await this.queryGizmoViewMode();
            default:
                return { success: false, error: `Unknown action: ${action}` };
        }
    }
    async handleViewModeControl(args) {
        const { action, is2D, gridVisible } = args;
        switch (action) {
            case 'change_2d_3d':
                if (is2D === undefined) {
                    return { success: false, error: 'is2D is required for change_2d_3d action' };
                }
                return await this.changeViewMode2D3D(is2D);
            case 'query_2d_3d':
                return await this.queryViewMode2D3D();
            case 'set_grid':
                if (gridVisible === undefined) {
                    return { success: false, error: 'gridVisible is required for set_grid action' };
                }
                return await this.setGridVisible(gridVisible);
            case 'query_grid':
                return await this.queryGridVisible();
            default:
                return { success: false, error: `Unknown action: ${action}` };
        }
    }
    async handleIconGizmo(args) {
        const { action, is3D, size } = args;
        switch (action) {
            case 'set_3d_mode':
                if (is3D === undefined) {
                    return { success: false, error: 'is3D is required for set_3d_mode action' };
                }
                return await this.setIconGizmo3D(is3D);
            case 'query_3d_mode':
                return await this.queryIconGizmo3D();
            case 'set_size':
                if (size === undefined) {
                    return { success: false, error: 'size is required for set_size action' };
                }
                return await this.setIconGizmoSize(size);
            case 'query_size':
                return await this.queryIconGizmoSize();
            default:
                return { success: false, error: `Unknown action: ${action}` };
        }
    }
    async handleCameraControl(args) {
        const { action, nodeUuids } = args;
        switch (action) {
            case 'focus_on_nodes':
                return await this.focusCameraOnNodes(nodeUuids || []);
            case 'align_camera_with_view':
                return await this.alignCameraWithView();
            case 'align_view_with_node':
                return await this.alignViewWithNode();
            default:
                return { success: false, error: `Unknown action: ${action}` };
        }
    }
    async handleStatusManagement(args) {
        const { action } = args;
        switch (action) {
            case 'get_status':
                return await this.getSceneViewStatus();
            case 'reset_view':
                return await this.resetSceneView();
            default:
                return { success: false, error: `Unknown action: ${action}` };
        }
    }
    // Private implementation methods
    async changeGizmoTool(name) {
        try {
            await Editor.Message.request('scene', 'change-gizmo-tool', name);
            return {
                success: true,
                message: `Gizmo tool changed to '${name}'`,
                data: { toolName: name }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryGizmoToolName() {
        try {
            const toolName = await Editor.Message.request('scene', 'query-gizmo-tool-name');
            return {
                success: true,
                data: {
                    currentTool: toolName,
                    message: `Current Gizmo tool: ${toolName}`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async changeGizmoPivot(name) {
        try {
            await Editor.Message.request('scene', 'change-gizmo-pivot', name);
            return {
                success: true,
                message: `Gizmo pivot changed to '${name}'`,
                data: { pivotName: name }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryGizmoPivot() {
        try {
            const pivotName = await Editor.Message.request('scene', 'query-gizmo-pivot');
            return {
                success: true,
                data: {
                    currentPivot: pivotName,
                    message: `Current Gizmo pivot: ${pivotName}`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryGizmoViewMode() {
        try {
            const viewMode = await Editor.Message.request('scene', 'query-gizmo-view-mode');
            return {
                success: true,
                data: {
                    viewMode: viewMode,
                    message: `Current view mode: ${viewMode}`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async changeGizmoCoordinate(type) {
        try {
            await Editor.Message.request('scene', 'change-gizmo-coordinate', type);
            return {
                success: true,
                message: `Coordinate system changed to '${type}'`,
                data: { coordinateType: type }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryGizmoCoordinate() {
        try {
            const coordinate = await Editor.Message.request('scene', 'query-gizmo-coordinate');
            return {
                success: true,
                data: {
                    coordinate: coordinate,
                    message: `Current coordinate system: ${coordinate}`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async changeViewMode2D3D(is2D) {
        try {
            await Editor.Message.request('scene', 'change-is2D', is2D);
            return {
                success: true,
                message: `View mode changed to ${is2D ? '2D' : '3D'}`,
                data: { is2D: is2D, viewMode: is2D ? '2D' : '3D' }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryViewMode2D3D() {
        try {
            const is2D = await Editor.Message.request('scene', 'query-is2D');
            return {
                success: true,
                data: {
                    is2D: is2D,
                    viewMode: is2D ? '2D' : '3D',
                    message: `Current view mode: ${is2D ? '2D' : '3D'}`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async setGridVisible(visible) {
        try {
            await Editor.Message.request('scene', 'set-grid-visible', visible);
            return {
                success: true,
                message: `Grid ${visible ? 'shown' : 'hidden'}`,
                data: { gridVisible: visible }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryGridVisible() {
        try {
            const visible = await Editor.Message.request('scene', 'query-is-grid-visible');
            return {
                success: true,
                data: {
                    visible: visible,
                    message: `Grid is ${visible ? 'visible' : 'hidden'}`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async setIconGizmo3D(is3D) {
        try {
            await Editor.Message.request('scene', 'set-icon-gizmo-3d', is3D);
            return {
                success: true,
                message: `IconGizmo set to ${is3D ? '3D' : '2D'} mode`,
                data: { is3D: is3D, mode: is3D ? '3D' : '2D' }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryIconGizmo3D() {
        try {
            const is3D = await Editor.Message.request('scene', 'query-is-icon-gizmo-3d');
            return {
                success: true,
                data: {
                    is3D: is3D,
                    mode: is3D ? '3D' : '2D',
                    message: `IconGizmo is in ${is3D ? '3D' : '2D'} mode`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async setIconGizmoSize(size) {
        try {
            await Editor.Message.request('scene', 'set-icon-gizmo-size', size);
            return {
                success: true,
                message: `IconGizmo size set to ${size}`,
                data: { size: size }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async queryIconGizmoSize() {
        try {
            const size = await Editor.Message.request('scene', 'query-icon-gizmo-size');
            return {
                success: true,
                data: {
                    size: size,
                    message: `IconGizmo size: ${size}`
                }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async focusCameraOnNodes(nodeUuids) {
        try {
            await Editor.Message.request('scene', 'focus-camera', nodeUuids);
            const message = nodeUuids.length === 0 ?
                'Camera focused on all nodes' :
                `Camera focused on ${nodeUuids.length} node(s)`;
            return {
                success: true,
                message: message,
                data: { focusedNodes: nodeUuids }
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async alignCameraWithView() {
        try {
            await Editor.Message.request('scene', 'align-with-view');
            return {
                success: true,
                message: 'Scene camera aligned with current view'
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async alignViewWithNode() {
        try {
            await Editor.Message.request('scene', 'align-view-with-node');
            return {
                success: true,
                message: 'View aligned with selected node successfully'
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async getSceneViewStatus() {
        try {
            // Gather all view status information
            const [gizmoTool, gizmoPivot, gizmoCoordinate, viewMode2D3D, gridVisible, iconGizmo3D, iconGizmoSize] = await Promise.allSettled([
                this.queryGizmoToolName(),
                this.queryGizmoPivot(),
                this.queryGizmoCoordinate(),
                this.queryViewMode2D3D(),
                this.queryGridVisible(),
                this.queryIconGizmo3D(),
                this.queryIconGizmoSize()
            ]);
            const status = {
                timestamp: new Date().toISOString()
            };
            // Extract data from fulfilled promises
            if (gizmoTool.status === 'fulfilled' && gizmoTool.value.success) {
                status.gizmoTool = gizmoTool.value.data.currentTool;
            }
            if (gizmoPivot.status === 'fulfilled' && gizmoPivot.value.success) {
                status.gizmoPivot = gizmoPivot.value.data.currentPivot;
            }
            if (gizmoCoordinate.status === 'fulfilled' && gizmoCoordinate.value.success) {
                status.coordinate = gizmoCoordinate.value.data.coordinate;
            }
            if (viewMode2D3D.status === 'fulfilled' && viewMode2D3D.value.success) {
                status.is2D = viewMode2D3D.value.data.is2D;
                status.viewMode = viewMode2D3D.value.data.viewMode;
            }
            if (gridVisible.status === 'fulfilled' && gridVisible.value.success) {
                status.gridVisible = gridVisible.value.data.visible;
            }
            if (iconGizmo3D.status === 'fulfilled' && iconGizmo3D.value.success) {
                status.iconGizmo3D = iconGizmo3D.value.data.is3D;
            }
            if (iconGizmoSize.status === 'fulfilled' && iconGizmoSize.value.success) {
                status.iconGizmoSize = iconGizmoSize.value.data.size;
            }
            return {
                success: true,
                data: status,
                message: 'Scene view status retrieved successfully'
            };
        }
        catch (err) {
            return {
                success: false,
                error: `Failed to get scene view status: ${err.message}`
            };
        }
    }
    async resetSceneView() {
        try {
            // Reset scene view to default settings
            const resetActions = [
                this.changeGizmoTool('position'),
                this.changeGizmoPivot('pivot'),
                this.changeGizmoCoordinate('local'),
                this.changeViewMode2D3D(false), // 3D mode
                this.setGridVisible(true),
                this.setIconGizmo3D(true),
                this.setIconGizmoSize(60)
            ];
            await Promise.all(resetActions);
            return {
                success: true,
                message: 'Scene view reset to default settings',
                data: {
                    defaultSettings: {
                        gizmoTool: 'position',
                        gizmoPivot: 'pivot',
                        coordinate: 'local',
                        viewMode: '3D',
                        gridVisible: true,
                        iconGizmo3D: true,
                        iconGizmoSize: 60
                    }
                }
            };
        }
        catch (err) {
            return {
                success: false,
                error: `Failed to reset scene view: ${err.message}`
            };
        }
    }
}
exports.SceneViewTools = SceneViewTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NlbmUtdmlldy10b29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS90b29scy9zY2VuZS12aWV3LXRvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsY0FBYztJQUN2QixRQUFRO1FBQ0osT0FBTztZQUNIO2dCQUNJLElBQUksRUFBRSw2QkFBNkI7Z0JBQ25DLFdBQVcsRUFBRSwrUUFBK1E7Z0JBQzVSLFdBQVcsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsTUFBTSxFQUFFOzRCQUNKLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSw4RkFBOEY7NEJBQzNHLElBQUksRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxpQkFBaUIsQ0FBQzt5QkFDakk7d0JBQ0QsUUFBUSxFQUFFOzRCQUNOLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSxzTkFBc047NEJBQ25PLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQzt5QkFDbEQ7d0JBQ0QsU0FBUyxFQUFFOzRCQUNQLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSw2TUFBNk07NEJBQzFOLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7eUJBQzVCO3dCQUNELGNBQWMsRUFBRTs0QkFDWixJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUscU9BQXFPOzRCQUNsUCxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO3lCQUM1QjtxQkFDSjtvQkFDRCxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUJBQ3ZCO2FBQ0o7WUFDRDtnQkFDSSxJQUFJLEVBQUUseUJBQXlCO2dCQUMvQixXQUFXLEVBQUUsbVFBQW1RO2dCQUNoUixX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QUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRWhDLE9BQU87Z0JBQ0gsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsT0FBTyxFQUFFLHNDQUFzQztnQkFDL0MsSUFBSSxFQUFFO29CQUNGLGVBQWUsRUFBRTt3QkFDYixTQUFTLEVBQUUsVUFBVTt3QkFDckIsVUFBVSxFQUFFLE9BQU87d0JBQ25CLFVBQVUsRUFBRSxPQUFPO3dCQUNuQixRQUFRLEVBQUUsSUFBSTt3QkFDZCxXQUFXLEVBQUUsSUFBSTt3QkFDakIsV0FBVyxFQUFFLElBQUk7d0JBQ2pCLGFBQWEsRUFBRSxFQUFFO3FCQUNwQjtpQkFDSjthQUNKLENBQUM7UUFFTixDQUFDO1FBQUMsT0FBTyxHQUFRLEVBQUUsQ0FBQztZQUNoQixPQUFPO2dCQUNILE9BQU8sRUFBRSxLQUFLO2dCQUNkLEtBQUssRUFBRSwrQkFBK0IsR0FBRyxDQUFDLE9BQU8sRUFBRTthQUN0RCxDQUFDO1FBQ04sQ0FBQztJQUNMLENBQUM7Q0FDSjtBQXJsQkQsd0NBcWxCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRvb2xEZWZpbml0aW9uLCBUb29sUmVzcG9uc2UsIFRvb2xFeGVjdXRvciB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFNjZW5lVmlld1Rvb2xzIGltcGxlbWVudHMgVG9vbEV4ZWN1dG9yIHtcbiAgICBnZXRUb29scygpOiBUb29sRGVmaW5pdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2NlbmVfdmlld19naXptb19tYW5hZ2VtZW50JyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0dJWk1PIE1BTkFHRU1FTlQ6IENvbnRyb2wgc2NlbmUgbWFuaXB1bGF0aW9uIHRvb2xzIGFuZCB0cmFuc2Zvcm1hdGlvbiBoYW5kbGVzLiBVU0FHRTogQ2hhbmdlIGJldHdlZW4gcG9zaXRpb24vcm90YXRpb24vc2NhbGUgdG9vbHMsIHN3aXRjaCBjb29yZGluYXRlIHN5c3RlbXMgKGxvY2FsL2dsb2JhbCksIGFkanVzdCBwaXZvdCBwb2ludHMuIEVzc2VudGlhbCBmb3IgcHJlY2lzZSBzY2VuZSBlZGl0aW5nIGFuZCBvYmplY3QgbWFuaXB1bGF0aW9uIGluIHRoZSBlZGl0b3IuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdHaXptbyBvcGVyYXRpb24gdG8gcGVyZm9ybS4gUXVlcnkgYWN0aW9ucyBnZXQgY3VycmVudCBzdGF0ZSwgY2hhbmdlIGFjdGlvbnMgbW9kaWZ5IHNldHRpbmdzLicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydjaGFuZ2VfdG9vbCcsICdxdWVyeV90b29sJywgJ2NoYW5nZV9waXZvdCcsICdxdWVyeV9waXZvdCcsICdjaGFuZ2VfY29vcmRpbmF0ZScsICdxdWVyeV9jb29yZGluYXRlJywgJ3F1ZXJ5X3ZpZXdfbW9kZSddXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbE5hbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RyYW5zZm9ybWF0aW9uIHRvb2wgdHlwZSAoUkVRVUlSRUQgZm9yIGNoYW5nZV90b29sIGFjdGlvbikuIFwicG9zaXRpb25cIiA9IG1vdmUgb2JqZWN0cywgXCJyb3RhdGlvblwiID0gcm90YXRlIG9iamVjdHMsIFwic2NhbGVcIiA9IHJlc2l6ZSBvYmplY3RzLCBcInJlY3RcIiA9IDJEIHJlY3QgdHJhbnNmb3JtLiBDaG9vc2UgYmFzZWQgb24gZGVzaXJlZCBlZGl0aW5nIG9wZXJhdGlvbi4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsncG9zaXRpb24nLCAncm90YXRpb24nLCAnc2NhbGUnLCAncmVjdCddXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGl2b3ROYW1lOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUcmFuc2Zvcm0gcGl2b3QgcG9pbnQgKFJFUVVJUkVEIGZvciBjaGFuZ2VfcGl2b3QgYWN0aW9uKS4gXCJwaXZvdFwiID0gdXNlIG9iamVjdFxcJ3MgcGl2b3QgcG9pbnQgKGxvY2FsIGNlbnRlciksIFwiY2VudGVyXCIgPSB1c2UgZ2VvbWV0cmljIGNlbnRlciAoYm91bmRpbmcgYm94IGNlbnRlcikuIEFmZmVjdHMgcm90YXRpb24gYW5kIHNjYWxpbmcgYmVoYXZpb3IuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ3Bpdm90JywgJ2NlbnRlciddXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVR5cGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Nvb3JkaW5hdGUgc3lzdGVtIHJlZmVyZW5jZSAoUkVRVUlSRUQgZm9yIGNoYW5nZV9jb29yZGluYXRlIGFjdGlvbikuIFwibG9jYWxcIiA9IHJlbGF0aXZlIHRvIG9iamVjdFxcJ3Mgb3JpZW50YXRpb24sIFwiZ2xvYmFsXCIgPSByZWxhdGl2ZSB0byB3b3JsZCBheGVzLiBMb2NhbCB1c2VmdWwgZm9yIG9iamVjdC1vcmllbnRlZCBlZGl0aW5nLCBnbG9iYWwgZm9yIHdvcmxkLWFsaWduZWQgb3BlcmF0aW9ucy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnbG9jYWwnLCAnZ2xvYmFsJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYWN0aW9uJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzY2VuZV92aWV3X21vZGVfY29udHJvbCcsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdWSUVXIE1PREUgQ09OVFJPTDogU3dpdGNoIHNjZW5lIGVkaXRvciBiZXR3ZWVuIDJEIGFuZCAzRCBtb2RlcyBhbmQgY29udHJvbCB2aXN1YWwgYWlkcy4gVVNBR0U6IFRvZ2dsZSAyRC8zRCBwZXJzcGVjdGl2ZSBmb3IgZGlmZmVyZW50IGVkaXRpbmcgY29udGV4dHMsIHNob3cvaGlkZSBncmlkIGZvciBhbGlnbm1lbnQgcmVmZXJlbmNlLiAyRCBtb2RlIGZvciBVSS9zcHJpdGUgZWRpdGluZywgM0QgbW9kZSBmb3IgM0Qgc2NlbmUgY29uc3RydWN0aW9uLicsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVmlldyBjb250cm9sIG9wZXJhdGlvbi4gQ2hhbmdlIGFjdGlvbnMgbW9kaWZ5IHZpZXcgc3RhdGUsIHF1ZXJ5IGFjdGlvbnMgZ2V0IGN1cnJlbnQgc3RhdGUuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2NoYW5nZV8yZF8zZCcsICdxdWVyeV8yZF8zZCcsICdzZXRfZ3JpZCcsICdxdWVyeV9ncmlkJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpczJEOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVmlldyBtb2RlIHNldHRpbmcgKFJFUVVJUkVEIGZvciBjaGFuZ2VfMmRfM2QgYWN0aW9uKS4gdHJ1ZSA9IDJEIG9ydGhvZ3JhcGhpYyB2aWV3IChmb3IgVUksIHNwcml0ZXMsIDJEIGdhbWVzKSwgZmFsc2UgPSAzRCBwZXJzcGVjdGl2ZSB2aWV3IChmb3IgM0Qgc2NlbmVzLCBzcGF0aWFsIGVkaXRpbmcpLiBDaG9vc2UgYmFzZWQgb24gY29udGVudCB0eXBlLidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkVmlzaWJsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0dyaWQgZGlzcGxheSBzdGF0ZSAoUkVRVUlSRUQgZm9yIHNldF9ncmlkIGFjdGlvbikuIHRydWUgPSBzaG93IGFsaWdubWVudCBncmlkIChoZWxwZnVsIGZvciBwb3NpdGlvbmluZyksIGZhbHNlID0gaGlkZSBncmlkIChjbGVhbmVyIHZpZXcgZm9yIGZpbmFsIHByZXZpZXcpLiBHcmlkIGFpZHMgaW4gcHJlY2lzZSBvYmplY3QgcGxhY2VtZW50IGFuZCBhbGlnbm1lbnQuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3NjZW5lX3ZpZXdfaWNvbl9naXptbycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJQ09OIEdJWk1PIENPTlRST0w6IENvbmZpZ3VyZSB2aXN1YWwgcmVwcmVzZW50YXRpb24gb2Ygc2NlbmUgbm9kZXMgYW5kIGNvbXBvbmVudHMuIFVTQUdFOiBBZGp1c3QgaWNvbiBkaXNwbGF5IG1vZGUgKDJELzNEKSBhbmQgc2l6ZSBmb3IgYmV0dGVyIHZpc2liaWxpdHkuIFVzZWZ1bCBmb3IgbWFuYWdpbmcgdmlzdWFsIGNsdXR0ZXIgYW5kIGltcHJvdmluZyBzY2VuZSBuYXZpZ2F0aW9uIHdoZW4gd29ya2luZyB3aXRoIG1hbnkgb2JqZWN0cy4nLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0ljb24gZ2l6bW8gb3BlcmF0aW9uLiBTZXQgYWN0aW9ucyBtb2RpZnkgYXBwZWFyYW5jZSwgcXVlcnkgYWN0aW9ucyBnZXQgY3VycmVudCBzZXR0aW5ncy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnc2V0XzNkX21vZGUnLCAncXVlcnlfM2RfbW9kZScsICdzZXRfc2l6ZScsICdxdWVyeV9zaXplJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpczNEOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWNvbiBkaXNwbGF5IG1vZGUgKFJFUVVJUkVEIGZvciBzZXRfM2RfbW9kZSBhY3Rpb24pLiB0cnVlID0gM0QgaWNvbnMgKHNwYXRpYWwgcmVwcmVzZW50YXRpb24pLCBmYWxzZSA9IDJEIGljb25zIChmbGF0IHJlcHJlc2VudGF0aW9uKS4gM0QgbW9kZSBmb3Igc3BhdGlhbCBhd2FyZW5lc3MsIDJEIG1vZGUgZm9yIHJlZHVjZWQgdmlzdWFsIGNvbXBsZXhpdHkuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0ljb24gc2l6ZSBzY2FsZSAoUkVRVUlSRUQgZm9yIHNldF9zaXplIGFjdGlvbikuIFJhbmdlOiAxMC0xMDAuIFNtYWxsZXIgdmFsdWVzID0gbGVzcyB2aXN1YWwgbm9pc2UsIGxhcmdlciB2YWx1ZXMgPSBlYXNpZXIgc2VsZWN0aW9uLiBSZWNvbW1lbmRlZDogMjAtMzAgZm9yIGRlbnNlIHNjZW5lcywgNDAtNjAgZm9yIHNwYXJzZSBzY2VuZXMuIEFkanVzdCBiYXNlZCBvbiBzY2VuZSBjb21wbGV4aXR5LicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogMTAwXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2FjdGlvbiddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2NlbmVfdmlld19jYW1lcmFfY29udHJvbCcsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDQU1FUkEgQ09OVFJPTDogTmF2aWdhdGUgYW5kIHBvc2l0aW9uIHRoZSBzY2VuZSB2aWV3IGNhbWVyYSBmb3IgYmV0dGVyIGVkaXRpbmcgd29ya2Zsb3cuIFVTQUdFOiBGb2N1cyBvbiBzcGVjaWZpYyBvYmplY3RzLCBhbGlnbiBjYW1lcmEgYW5nbGVzLCBhbmQgc3luY2hyb25pemUgdmlldyBwb3NpdGlvbnMuIEVzc2VudGlhbCBmb3IgZWZmaWNpZW50IHNjZW5lIG5hdmlnYXRpb24gYW5kIHByZWNpc2UgZWRpdGluZyBvZiBjb21wbGV4IHNjZW5lcy4nLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NhbWVyYSBvcGVyYXRpb246IFwiZm9jdXNfb25fbm9kZXNcIiA9IGNlbnRlciB2aWV3IG9uIHNwZWNpZmljIG5vZGVzIChyZXF1aXJlcyBub2RlVXVpZHMpIHwgXCJhbGlnbl9jYW1lcmFfd2l0aF92aWV3XCIgPSBzeW5jIGNhbWVyYSB0byBjdXJyZW50IHZpZXcgfCBcImFsaWduX3ZpZXdfd2l0aF9ub2RlXCIgPSBwb3NpdGlvbiB2aWV3IHRvIG1hdGNoIG5vZGUgb3JpZW50YXRpb24uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2ZvY3VzX29uX25vZGVzJywgJ2FsaWduX2NhbWVyYV93aXRoX3ZpZXcnLCAnYWxpZ25fdmlld193aXRoX25vZGUnXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVVdWlkczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ05vZGUgVVVJRHMgdG8gZm9jdXMgb24gKFJFUVVJUkVEIGZvciBmb2N1c19vbl9ub2RlcyBhY3Rpb24pLiBBcnJheSBvZiBub2RlIFVVSURzIHRvIGNlbnRlciBpbiB2aWV3LiBVc2Ugbm9kZV9xdWVyeSB0byBnZXQgVVVJRHMgZmlyc3QuIEV4YW1wbGVzOiBbXCJub2RlLXV1aWQtMVwiLCBcIm5vZGUtdXVpZC0yXCJdLiBFbXB0eSBhcnJheSBbXSBmb2N1c2VzIG9uIGFsbCBzY2VuZSBub2Rlcy4gRm9ybWF0OiBhcnJheSBvZiBVVUlEIHN0cmluZ3MuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3NjZW5lX3ZpZXdfc3RhdHVzX21hbmFnZW1lbnQnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU1RBVFVTIE1BTkFHRU1FTlQ6IE1vbml0b3Igc2NlbmUgdmlldyBjb25maWd1cmF0aW9uIGFuZCByZXN0b3JlIGRlZmF1bHQgc2V0dGluZ3MuIFVTQUdFOiBcImdldF9zdGF0dXNcIiBmb3IgY29tcHJlaGVuc2l2ZSB2aWV3IHN0YXRlIGluZm9ybWF0aW9uLCBcInJlc2V0X3ZpZXdcIiB0byByZXN0b3JlIGRlZmF1bHQgY2FtZXJhIHBvc2l0aW9uIGFuZCBzZXR0aW5ncy4gVXNlZnVsIGZvciB0cm91Ymxlc2hvb3RpbmcgdmlldyBpc3N1ZXMgYW5kIHN0YW5kYXJkaXppbmcgZWRpdG9yIHN0YXRlLicsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU3RhdHVzIG9wZXJhdGlvbjogXCJnZXRfc3RhdHVzXCIgPSByZXRyaWV2ZSBjdXJyZW50IHNjZW5lIHZpZXcgY29uZmlndXJhdGlvbiBhbmQgc2V0dGluZ3MgfCBcInJlc2V0X3ZpZXdcIiA9IHJlc3RvcmUgc2NlbmUgdmlldyB0byBkZWZhdWx0IGNhbWVyYSBwb3NpdGlvbiBhbmQgc2V0dGluZ3MgKG5vIHBhcmFtZXRlcnMgbmVlZGVkKS4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnZ2V0X3N0YXR1cycsICdyZXNldF92aWV3J11cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYWN0aW9uJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZSh0b29sTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBzd2l0Y2ggKHRvb2xOYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdzY2VuZV92aWV3X2dpem1vX21hbmFnZW1lbnQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmhhbmRsZUdpem1vTWFuYWdlbWVudChhcmdzKTtcbiAgICAgICAgICAgIGNhc2UgJ3NjZW5lX3ZpZXdfbW9kZV9jb250cm9sJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5oYW5kbGVWaWV3TW9kZUNvbnRyb2woYXJncyk7XG4gICAgICAgICAgICBjYXNlICdzY2VuZV92aWV3X2ljb25fZ2l6bW8nOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmhhbmRsZUljb25HaXptbyhhcmdzKTtcbiAgICAgICAgICAgIGNhc2UgJ3NjZW5lX3ZpZXdfY2FtZXJhX2NvbnRyb2wnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmhhbmRsZUNhbWVyYUNvbnRyb2woYXJncyk7XG4gICAgICAgICAgICBjYXNlICdzY2VuZV92aWV3X3N0YXR1c19tYW5hZ2VtZW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5oYW5kbGVTdGF0dXNNYW5hZ2VtZW50KGFyZ3MpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdG9vbDogJHt0b29sTmFtZX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlR2l6bW9NYW5hZ2VtZW50KGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uLCB0b29sTmFtZSwgcGl2b3ROYW1lLCBjb29yZGluYXRlVHlwZSB9ID0gYXJncztcblxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnY2hhbmdlX3Rvb2wnOlxuICAgICAgICAgICAgICAgIGlmICghdG9vbE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAndG9vbE5hbWUgaXMgcmVxdWlyZWQgZm9yIGNoYW5nZV90b29sIGFjdGlvbicgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2hhbmdlR2l6bW9Ub29sKHRvb2xOYW1lKTtcbiAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5X3Rvb2wnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnF1ZXJ5R2l6bW9Ub29sTmFtZSgpO1xuICAgICAgICAgICAgY2FzZSAnY2hhbmdlX3Bpdm90JzpcbiAgICAgICAgICAgICAgICBpZiAoIXBpdm90TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdwaXZvdE5hbWUgaXMgcmVxdWlyZWQgZm9yIGNoYW5nZV9waXZvdCBhY3Rpb24nIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNoYW5nZUdpem1vUGl2b3QocGl2b3ROYW1lKTtcbiAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5X3Bpdm90JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5xdWVyeUdpem1vUGl2b3QoKTtcbiAgICAgICAgICAgIGNhc2UgJ2NoYW5nZV9jb29yZGluYXRlJzpcbiAgICAgICAgICAgICAgICBpZiAoIWNvb3JkaW5hdGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2Nvb3JkaW5hdGVUeXBlIGlzIHJlcXVpcmVkIGZvciBjaGFuZ2VfY29vcmRpbmF0ZSBhY3Rpb24nIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNoYW5nZUdpem1vQ29vcmRpbmF0ZShjb29yZGluYXRlVHlwZSk7XG4gICAgICAgICAgICBjYXNlICdxdWVyeV9jb29yZGluYXRlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5xdWVyeUdpem1vQ29vcmRpbmF0ZSgpO1xuICAgICAgICAgICAgY2FzZSAncXVlcnlfdmlld19tb2RlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5xdWVyeUdpem1vVmlld01vZGUoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgVW5rbm93biBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlVmlld01vZGVDb250cm9sKGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uLCBpczJELCBncmlkVmlzaWJsZSB9ID0gYXJncztcblxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnY2hhbmdlXzJkXzNkJzpcbiAgICAgICAgICAgICAgICBpZiAoaXMyRCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2lzMkQgaXMgcmVxdWlyZWQgZm9yIGNoYW5nZV8yZF8zZCBhY3Rpb24nIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNoYW5nZVZpZXdNb2RlMkQzRChpczJEKTtcbiAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5XzJkXzNkJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5xdWVyeVZpZXdNb2RlMkQzRCgpO1xuICAgICAgICAgICAgY2FzZSAnc2V0X2dyaWQnOlxuICAgICAgICAgICAgICAgIGlmIChncmlkVmlzaWJsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2dyaWRWaXNpYmxlIGlzIHJlcXVpcmVkIGZvciBzZXRfZ3JpZCBhY3Rpb24nIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNldEdyaWRWaXNpYmxlKGdyaWRWaXNpYmxlKTtcbiAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5X2dyaWQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnF1ZXJ5R3JpZFZpc2libGUoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgVW5rbm93biBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlSWNvbkdpem1vKGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uLCBpczNELCBzaXplIH0gPSBhcmdzO1xuXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlICdzZXRfM2RfbW9kZSc6XG4gICAgICAgICAgICAgICAgaWYgKGlzM0QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdpczNEIGlzIHJlcXVpcmVkIGZvciBzZXRfM2RfbW9kZSBhY3Rpb24nIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNldEljb25HaXptbzNEKGlzM0QpO1xuICAgICAgICAgICAgY2FzZSAncXVlcnlfM2RfbW9kZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucXVlcnlJY29uR2l6bW8zRCgpO1xuICAgICAgICAgICAgY2FzZSAnc2V0X3NpemUnOlxuICAgICAgICAgICAgICAgIGlmIChzaXplID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnc2l6ZSBpcyByZXF1aXJlZCBmb3Igc2V0X3NpemUgYWN0aW9uJyB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRJY29uR2l6bW9TaXplKHNpemUpO1xuICAgICAgICAgICAgY2FzZSAncXVlcnlfc2l6ZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucXVlcnlJY29uR2l6bW9TaXplKCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYFVua25vd24gYWN0aW9uOiAke2FjdGlvbn1gIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGhhbmRsZUNhbWVyYUNvbnRyb2woYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgeyBhY3Rpb24sIG5vZGVVdWlkcyB9ID0gYXJncztcblxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnZm9jdXNfb25fbm9kZXMnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmZvY3VzQ2FtZXJhT25Ob2Rlcyhub2RlVXVpZHMgfHwgW10pO1xuICAgICAgICAgICAgY2FzZSAnYWxpZ25fY2FtZXJhX3dpdGhfdmlldyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYWxpZ25DYW1lcmFXaXRoVmlldygpO1xuICAgICAgICAgICAgY2FzZSAnYWxpZ25fdmlld193aXRoX25vZGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmFsaWduVmlld1dpdGhOb2RlKCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYFVua25vd24gYWN0aW9uOiAke2FjdGlvbn1gIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGhhbmRsZVN0YXR1c01hbmFnZW1lbnQoYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgeyBhY3Rpb24gfSA9IGFyZ3M7XG5cbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9zdGF0dXMnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFNjZW5lVmlld1N0YXR1cygpO1xuICAgICAgICAgICAgY2FzZSAncmVzZXRfdmlldyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucmVzZXRTY2VuZVZpZXcoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgVW5rbm93biBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFByaXZhdGUgaW1wbGVtZW50YXRpb24gbWV0aG9kc1xuICAgIHByaXZhdGUgYXN5bmMgY2hhbmdlR2l6bW9Ub29sKG5hbWU6IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdjaGFuZ2UtZ2l6bW8tdG9vbCcsIG5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBHaXptbyB0b29sIGNoYW5nZWQgdG8gJyR7bmFtZX0nYCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IHRvb2xOYW1lOiBuYW1lIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHF1ZXJ5R2l6bW9Ub29sTmFtZSgpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdG9vbE5hbWU6IHN0cmluZyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3F1ZXJ5LWdpem1vLXRvb2wtbmFtZScpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRvb2w6IHRvb2xOYW1lLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgQ3VycmVudCBHaXptbyB0b29sOiAke3Rvb2xOYW1lfWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjaGFuZ2VHaXptb1Bpdm90KG5hbWU6IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdjaGFuZ2UtZ2l6bW8tcGl2b3QnLCBuYW1lKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBgR2l6bW8gcGl2b3QgY2hhbmdlZCB0byAnJHtuYW1lfSdgLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgcGl2b3ROYW1lOiBuYW1lIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHF1ZXJ5R2l6bW9QaXZvdCgpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGl2b3ROYW1lOiBzdHJpbmcgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdxdWVyeS1naXptby1waXZvdCcpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBpdm90OiBwaXZvdE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBDdXJyZW50IEdpem1vIHBpdm90OiAke3Bpdm90TmFtZX1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcXVlcnlHaXptb1ZpZXdNb2RlKCk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB2aWV3TW9kZTogc3RyaW5nID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncXVlcnktZ2l6bW8tdmlldy1tb2RlJyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZTogdmlld01vZGUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBDdXJyZW50IHZpZXcgbW9kZTogJHt2aWV3TW9kZX1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2hhbmdlR2l6bW9Db29yZGluYXRlKHR5cGU6IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdjaGFuZ2UtZ2l6bW8tY29vcmRpbmF0ZScsIHR5cGUpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBDb29yZGluYXRlIHN5c3RlbSBjaGFuZ2VkIHRvICcke3R5cGV9J2AsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBjb29yZGluYXRlVHlwZTogdHlwZSB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBxdWVyeUdpem1vQ29vcmRpbmF0ZSgpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29vcmRpbmF0ZTogc3RyaW5nID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncXVlcnktZ2l6bW8tY29vcmRpbmF0ZScpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZTogY29vcmRpbmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYEN1cnJlbnQgY29vcmRpbmF0ZSBzeXN0ZW06ICR7Y29vcmRpbmF0ZX1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2hhbmdlVmlld01vZGUyRDNEKGlzMkQ6IGJvb2xlYW4pOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnY2hhbmdlLWlzMkQnLCBpczJEKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBgVmlldyBtb2RlIGNoYW5nZWQgdG8gJHtpczJEID8gJzJEJyA6ICczRCd9YCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGlzMkQ6IGlzMkQsIHZpZXdNb2RlOiBpczJEID8gJzJEJyA6ICczRCcgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcXVlcnlWaWV3TW9kZTJEM0QoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGlzMkQ6IGJvb2xlYW4gPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdxdWVyeS1pczJEJyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBpczJEOiBpczJELFxuICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZTogaXMyRCA/ICcyRCcgOiAnM0QnLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgQ3VycmVudCB2aWV3IG1vZGU6ICR7aXMyRCA/ICcyRCcgOiAnM0QnfWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZXRHcmlkVmlzaWJsZSh2aXNpYmxlOiBib29sZWFuKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3NldC1ncmlkLXZpc2libGUnLCB2aXNpYmxlKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBgR3JpZCAke3Zpc2libGUgPyAnc2hvd24nIDogJ2hpZGRlbid9YCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGdyaWRWaXNpYmxlOiB2aXNpYmxlIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHF1ZXJ5R3JpZFZpc2libGUoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHZpc2libGU6IGJvb2xlYW4gPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdxdWVyeS1pcy1ncmlkLXZpc2libGUnKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHZpc2libGUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBHcmlkIGlzICR7dmlzaWJsZSA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nfWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZXRJY29uR2l6bW8zRChpczNEOiBib29sZWFuKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3NldC1pY29uLWdpem1vLTNkJywgaXMzRCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYEljb25HaXptbyBzZXQgdG8gJHtpczNEID8gJzNEJyA6ICcyRCd9IG1vZGVgLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgaXMzRDogaXMzRCwgbW9kZTogaXMzRCA/ICczRCcgOiAnMkQnIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHF1ZXJ5SWNvbkdpem1vM0QoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGlzM0Q6IGJvb2xlYW4gPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdxdWVyeS1pcy1pY29uLWdpem1vLTNkJyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBpczNEOiBpczNELFxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBpczNEID8gJzNEJyA6ICcyRCcsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBJY29uR2l6bW8gaXMgaW4gJHtpczNEID8gJzNEJyA6ICcyRCd9IG1vZGVgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgc2V0SWNvbkdpem1vU2l6ZShzaXplOiBudW1iZXIpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnc2V0LWljb24tZ2l6bW8tc2l6ZScsIHNpemUpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBJY29uR2l6bW8gc2l6ZSBzZXQgdG8gJHtzaXplfWAsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBzaXplOiBzaXplIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHF1ZXJ5SWNvbkdpem1vU2l6ZSgpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc2l6ZTogbnVtYmVyID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncXVlcnktaWNvbi1naXptby1zaXplJyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgSWNvbkdpem1vIHNpemU6ICR7c2l6ZX1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZm9jdXNDYW1lcmFPbk5vZGVzKG5vZGVVdWlkczogc3RyaW5nW10pOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnZm9jdXMtY2FtZXJhJywgbm9kZVV1aWRzKTtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBub2RlVXVpZHMubGVuZ3RoID09PSAwID9cbiAgICAgICAgICAgICAgICAnQ2FtZXJhIGZvY3VzZWQgb24gYWxsIG5vZGVzJyA6XG4gICAgICAgICAgICAgICAgYENhbWVyYSBmb2N1c2VkIG9uICR7bm9kZVV1aWRzLmxlbmd0aH0gbm9kZShzKWA7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGZvY3VzZWROb2Rlczogbm9kZVV1aWRzIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGFsaWduQ2FtZXJhV2l0aFZpZXcoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ2FsaWduLXdpdGgtdmlldycpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdTY2VuZSBjYW1lcmEgYWxpZ25lZCB3aXRoIGN1cnJlbnQgdmlldydcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGFsaWduVmlld1dpdGhOb2RlKCk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdhbGlnbi12aWV3LXdpdGgtbm9kZScpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdWaWV3IGFsaWduZWQgd2l0aCBzZWxlY3RlZCBub2RlIHN1Y2Nlc3NmdWxseSdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGdldFNjZW5lVmlld1N0YXR1cygpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gR2F0aGVyIGFsbCB2aWV3IHN0YXR1cyBpbmZvcm1hdGlvblxuICAgICAgICAgICAgY29uc3QgW1xuICAgICAgICAgICAgICAgIGdpem1vVG9vbCxcbiAgICAgICAgICAgICAgICBnaXptb1Bpdm90LFxuICAgICAgICAgICAgICAgIGdpem1vQ29vcmRpbmF0ZSxcbiAgICAgICAgICAgICAgICB2aWV3TW9kZTJEM0QsXG4gICAgICAgICAgICAgICAgZ3JpZFZpc2libGUsXG4gICAgICAgICAgICAgICAgaWNvbkdpem1vM0QsXG4gICAgICAgICAgICAgICAgaWNvbkdpem1vU2l6ZVxuICAgICAgICAgICAgXSA9IGF3YWl0IFByb21pc2UuYWxsU2V0dGxlZChbXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeUdpem1vVG9vbE5hbWUoKSxcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5R2l6bW9QaXZvdCgpLFxuICAgICAgICAgICAgICAgIHRoaXMucXVlcnlHaXptb0Nvb3JkaW5hdGUoKSxcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5Vmlld01vZGUyRDNEKCksXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeUdyaWRWaXNpYmxlKCksXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeUljb25HaXptbzNEKCksXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeUljb25HaXptb1NpemUoKVxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXR1czogYW55ID0ge1xuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBFeHRyYWN0IGRhdGEgZnJvbSBmdWxmaWxsZWQgcHJvbWlzZXNcbiAgICAgICAgICAgIGlmIChnaXptb1Rvb2wuc3RhdHVzID09PSAnZnVsZmlsbGVkJyAmJiBnaXptb1Rvb2wudmFsdWUuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHN0YXR1cy5naXptb1Rvb2wgPSBnaXptb1Rvb2wudmFsdWUuZGF0YS5jdXJyZW50VG9vbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnaXptb1Bpdm90LnN0YXR1cyA9PT0gJ2Z1bGZpbGxlZCcgJiYgZ2l6bW9QaXZvdC52YWx1ZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmdpem1vUGl2b3QgPSBnaXptb1Bpdm90LnZhbHVlLmRhdGEuY3VycmVudFBpdm90O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdpem1vQ29vcmRpbmF0ZS5zdGF0dXMgPT09ICdmdWxmaWxsZWQnICYmIGdpem1vQ29vcmRpbmF0ZS52YWx1ZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmNvb3JkaW5hdGUgPSBnaXptb0Nvb3JkaW5hdGUudmFsdWUuZGF0YS5jb29yZGluYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZpZXdNb2RlMkQzRC5zdGF0dXMgPT09ICdmdWxmaWxsZWQnICYmIHZpZXdNb2RlMkQzRC52YWx1ZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmlzMkQgPSB2aWV3TW9kZTJEM0QudmFsdWUuZGF0YS5pczJEO1xuICAgICAgICAgICAgICAgIHN0YXR1cy52aWV3TW9kZSA9IHZpZXdNb2RlMkQzRC52YWx1ZS5kYXRhLnZpZXdNb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdyaWRWaXNpYmxlLnN0YXR1cyA9PT0gJ2Z1bGZpbGxlZCcgJiYgZ3JpZFZpc2libGUudmFsdWUuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHN0YXR1cy5ncmlkVmlzaWJsZSA9IGdyaWRWaXNpYmxlLnZhbHVlLmRhdGEudmlzaWJsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpY29uR2l6bW8zRC5zdGF0dXMgPT09ICdmdWxmaWxsZWQnICYmIGljb25HaXptbzNELnZhbHVlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICBzdGF0dXMuaWNvbkdpem1vM0QgPSBpY29uR2l6bW8zRC52YWx1ZS5kYXRhLmlzM0Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWNvbkdpem1vU2l6ZS5zdGF0dXMgPT09ICdmdWxmaWxsZWQnICYmIGljb25HaXptb1NpemUudmFsdWUuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHN0YXR1cy5pY29uR2l6bW9TaXplID0gaWNvbkdpem1vU2l6ZS52YWx1ZS5kYXRhLnNpemU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiBzdGF0dXMsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ1NjZW5lIHZpZXcgc3RhdHVzIHJldHJpZXZlZCBzdWNjZXNzZnVsbHknXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBgRmFpbGVkIHRvIGdldCBzY2VuZSB2aWV3IHN0YXR1czogJHtlcnIubWVzc2FnZX1gXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyByZXNldFNjZW5lVmlldygpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gUmVzZXQgc2NlbmUgdmlldyB0byBkZWZhdWx0IHNldHRpbmdzXG4gICAgICAgICAgICBjb25zdCByZXNldEFjdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VHaXptb1Rvb2woJ3Bvc2l0aW9uJyksXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VHaXptb1Bpdm90KCdwaXZvdCcpLFxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlR2l6bW9Db29yZGluYXRlKCdsb2NhbCcpLFxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlVmlld01vZGUyRDNEKGZhbHNlKSwgLy8gM0QgbW9kZVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0R3JpZFZpc2libGUodHJ1ZSksXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJY29uR2l6bW8zRCh0cnVlKSxcbiAgICAgICAgICAgICAgICB0aGlzLnNldEljb25HaXptb1NpemUoNjApXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChyZXNldEFjdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ1NjZW5lIHZpZXcgcmVzZXQgdG8gZGVmYXVsdCBzZXR0aW5ncycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0U2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdpem1vVG9vbDogJ3Bvc2l0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdpem1vUGl2b3Q6ICdwaXZvdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlOiAnbG9jYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlld01vZGU6ICczRCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkVmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb25HaXptbzNEOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkdpem1vU2l6ZTogNjBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGBGYWlsZWQgdG8gcmVzZXQgc2NlbmUgdmlldzogJHtlcnIubWVzc2FnZX1gXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==