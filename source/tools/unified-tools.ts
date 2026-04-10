import { ToolDefinition, ToolResponse, MCPServerSettings } from '../types';
import { SceneTools } from './scene-tools';
import { NodeTools } from './node-tools';
import { ComponentTools } from './component-tools';
import { PrefabTools } from './prefab-tools';
import { ProjectTools } from './project-tools';
import { DebugTools } from './debug-tools';
import { PreferencesTools } from './preferences-tools';
import { ServerTools } from './server-tools';
import { BroadcastTools } from './broadcast-tools';
import { SceneAdvancedTools } from './scene-advanced-tools';
import { SceneViewTools } from './scene-view-tools';
import { ReferenceImageTools } from './reference-image-tools';
import { AssetAdvancedTools } from './asset-advanced-tools';
import { ValidationTools } from './validation-tools';

type ToolInfoProvider = {
    getSettings?: () => MCPServerSettings;
    getToolDefinitions?: () => ToolDefinition[];
};

type RegisteredTool = ToolDefinition & {
    execute: (args: any) => Promise<ToolResponse>;
};

type LegacyPrefix =
    | 'sceneAdvanced'
    | 'sceneView'
    | 'referenceImage'
    | 'assetAdvanced'
    | 'validation'
    | 'scene'
    | 'node'
    | 'component'
    | 'prefab'
    | 'project'
    | 'debug'
    | 'preferences'
    | 'server'
    | 'broadcast';

const LEGACY_PREFIXES: LegacyPrefix[] = [
    'sceneAdvanced',
    'sceneView',
    'referenceImage',
    'assetAdvanced',
    'validation',
    'scene',
    'node',
    'component',
    'prefab',
    'project',
    'debug',
    'preferences',
    'server',
    'broadcast',
];

const PROP = {
    string: (description: string, extra: Record<string, any> = {}) => ({ type: 'string', description, ...extra }),
    number: (description: string, extra: Record<string, any> = {}) => ({ type: 'number', description, ...extra }),
    boolean: (description: string, extra: Record<string, any> = {}) => ({ type: 'boolean', description, ...extra }),
    object: (description: string, extra: Record<string, any> = {}) => ({ type: 'object', description, ...extra }),
    array: (description: string, items: Record<string, any> = { type: 'string' }, extra: Record<string, any> = {}) => ({
        type: 'array',
        items,
        description,
        ...extra,
    }),
};

const SHARED_PROPERTIES: Record<string, any> = {
    uuid: PROP.string('UUID'),
    uuids: {
        oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
        ],
        description: 'Single UUID or UUID list',
    },
    nodeUuid: PROP.string('Node UUID'),
    parentUuid: PROP.string('Parent node UUID'),
    newParentUuid: PROP.string('New parent node UUID'),
    name: PROP.string('Name'),
    pattern: PROP.string('Search pattern'),
    exactMatch: PROP.boolean('Use exact match', { default: false }),
    includeComponents: PROP.boolean('Include component information', { default: false }),
    includeChildren: PROP.boolean('Include child nodes', { default: true }),
    includeSubAssets: PROP.boolean('Include sub-assets', { default: true }),
    keepWorldTransform: PROP.boolean('Keep world transform', { default: false }),
    unlinkPrefab: PROP.boolean('Unlink prefab after instantiation', { default: false }),
    scenePath: PROP.string('Scene path'),
    sceneName: PROP.string('Scene name'),
    savePath: PROP.string('Save path'),
    path: PROP.string('Path'),
    prefabPath: PROP.string('Prefab path'),
    sourcePrefabPath: PROP.string('Source prefab path'),
    targetPrefabPath: PROP.string('Target prefab path'),
    newPrefabName: PROP.string('New prefab name'),
    assetPath: PROP.string('Asset path'),
    assetUuid: PROP.string('Asset UUID'),
    assetType: PROP.string('Asset type'),
    folder: PROP.string('Folder path or URL'),
    url: PROP.string('Asset URL'),
    urlOrUUID: PROP.string('Asset URL or UUID'),
    content: { description: 'Text or serialized content' },
    source: PROP.string('Source URL'),
    target: PROP.string('Target URL or UUID'),
    sourcePath: PROP.string('Source file path'),
    targetFolder: PROP.string('Target folder'),
    sourceDirectory: PROP.string('Source directory'),
    targetDirectory: PROP.string('Target directory'),
    directory: PROP.string('Directory path or URL'),
    excludeDirectories: PROP.array('Directories to exclude', { type: 'string' }),
    property: PROP.string('Property name'),
    propertyType: PROP.string('Property value type'),
    value: { description: 'Action value' },
    values: PROP.object('Action values object'),
    events: PROP.array('Button click events', { type: 'object' }),
    handler: PROP.string('Handler function name'),
    component: PROP.string('Target component class name'),
    customEventData: PROP.string('Custom event payload'),
    componentType: PROP.string('Component type or cid'),
    scriptPath: PROP.string('Script path'),
    method: PROP.string('Method name'),
    args: PROP.array('Method arguments', {}),
    tab: PROP.string('Preferences tab or panel tab'),
    category: PROP.string('Category'),
    debug: PROP.boolean('Debug mode', { default: true }),
    timeout: PROP.number('Timeout in milliseconds', { default: 5000 }),
    limit: PROP.number('Result limit', { default: 100 }),
    lines: PROP.number('Number of lines', { default: 100 }),
    filterKeyword: PROP.string('Filter keyword'),
    logLevel: PROP.string('Log level', { default: 'ALL' }),
    script: PROP.string('JavaScript snippet'),
    platform: PROP.string('Platform'),
    type: PROP.string('Type filter'),
    filter: PROP.string('Console or log filter'),
    direction: PROP.string('Dependency direction', { default: 'dependencies' }),
    recursive: PROP.boolean('Include subdirectories', { default: false }),
    overwrite: PROP.boolean('Overwrite existing files', { default: false }),
    format: PROP.string('Format'),
    quality: PROP.number('Quality'),
    maxResults: PROP.number('Maximum results', { default: 20 }),
    contextLines: PROP.number('Context lines', { default: 2 }),
    rootUuid: PROP.string('Root node UUID'),
    maxDepth: PROP.number('Maximum tree depth', { default: 10 }),
    port: PROP.number('Port'),
    visible: PROP.boolean('Visibility flag'),
    includeMetadata: PROP.boolean('Include metadata', { default: true }),
    is2D: PROP.boolean('Whether to use 2D view mode'),
    is3D: PROP.boolean('Whether to use 3D icon mode'),
    size: PROP.number('Size value'),
    opacity: PROP.number('Opacity value'),
    sx: PROP.number('Scale X'),
    sy: PROP.number('Scale Y'),
    x: PROP.number('X value'),
    y: PROP.number('Y value'),
    z: PROP.number('Z value'),
    position: PROP.object('Position object'),
    rotation: PROP.object('Rotation object'),
    scale: PROP.object('Scale object'),
    nodeType: PROP.string('Node type', { enum: ['Node', '2DNode', '3DNode'], default: 'Node' }),
    siblingIndex: PROP.number('Sibling index', { default: -1 }),
    targetNodeUuid: PROP.string('Target node UUID'),
    toolName: PROP.string('Tool name'),
    jsonString: PROP.string('JSON string'),
    expectedSchema: PROP.object('Expected schema'),
    arguments: PROP.object('Tool arguments object'),
    messageType: PROP.string('Broadcast message type'),
    fileFilter: PROP.array('File extension filter', { type: 'string' }),
    exportPath: PROP.string('Export path'),
    importPath: PROP.string('Import path'),
    extends: PROP.string('Base class filter'),
    className: PROP.string('Class name'),
    prefabName: PROP.string('Prefab name'),
    key: PROP.string('Property key'),
    isCurrentOnly: PROP.boolean('Operate on current selection only', { default: false }),
    paths: PROP.array('Path list', { type: 'string' }),
    urls: PROP.array('URL list', { type: 'string' }),
    sceneUUID: PROP.string('Scene UUID'),
    checkMissingAssets: PROP.boolean('Check missing assets', { default: true }),
    checkPerformance: PROP.boolean('Check performance', { default: true }),
};

function pickProps(keys: string[]): Record<string, any> {
    const selected: Record<string, any> = {};
    for (const key of keys) {
        selected[key] = SHARED_PROPERTIES[key];
    }
    return selected;
}

export class UnifiedTools {
    private readonly legacy = {
        scene: new SceneTools(),
        node: new NodeTools(),
        component: new ComponentTools(),
        prefab: new PrefabTools(),
        project: new ProjectTools(),
        debug: new DebugTools(),
        preferences: new PreferencesTools(),
        server: new ServerTools(),
        broadcast: new BroadcastTools(),
        sceneAdvanced: new SceneAdvancedTools(),
        sceneView: new SceneViewTools(),
        referenceImage: new ReferenceImageTools(),
        assetAdvanced: new AssetAdvancedTools(),
        validation: new ValidationTools(),
    };

    private readonly tools: RegisteredTool[];

    constructor(private readonly infoProvider: ToolInfoProvider = {}) {
        this.tools = this.buildTools();
    }

    public getTools(): ToolDefinition[] {
        return this.tools.map(({ execute, ...tool }) => tool);
    }

    public async execute(name: string, args: any): Promise<ToolResponse> {
        const tool = this.tools.find((item) => item.name === name);
        if (!tool) {
            throw new Error(`Tool ${name} not found`);
        }
        return tool.execute(args ?? {});
    }

    private buildTools(): RegisteredTool[] {
        return [
            this.createTool(
                'scene_management',
                'Unified scene lifecycle tool. Actions: get_current, list, open, save, create, save_as, close.',
                ['get_current', 'list', 'open', 'save', 'create', 'save_as', 'close'],
                ['scenePath', 'sceneName', 'savePath', 'path'],
                (args) => this.routeLegacyAction('scene_management', {
                    get_current: 'scene_get_current_scene',
                    list: 'scene_get_scene_list',
                    open: 'scene_open_scene',
                    save: 'scene_save_scene',
                    create: 'scene_create_scene',
                    save_as: 'scene_save_scene_as',
                    close: 'scene_close_scene',
                }, args),
            ),
            this.createTool(
                'scene_hierarchy',
                'Unified scene hierarchy tool. Actions: get.',
                ['get'],
                ['includeComponents'],
                (args) => this.routeLegacyAction('scene_hierarchy', {
                    get: 'scene_get_scene_hierarchy',
                }, args),
            ),
            this.createTool(
                'scene_execution_control',
                'Unified scene execution tool. Actions: execute_component_method, execute_scene_script, restore_prefab, soft_reload, query_ready, query_dirty.',
                ['execute_component_method', 'execute_scene_script', 'restore_prefab', 'soft_reload', 'query_ready', 'query_dirty'],
                ['uuid', 'nodeUuid', 'assetUuid', 'name', 'method', 'args'],
                (args) => this.routeLegacyAction('scene_execution_control', {
                    execute_component_method: 'sceneAdvanced_execute_component_method',
                    execute_scene_script: 'sceneAdvanced_execute_scene_script',
                    restore_prefab: 'sceneAdvanced_restore_prefab',
                    soft_reload: 'sceneAdvanced_soft_reload_scene',
                    query_ready: 'sceneAdvanced_query_scene_ready',
                    query_dirty: 'sceneAdvanced_query_scene_dirty',
                }, args),
            ),
            this.createTool(
                'scene_snapshot',
                'Unified scene snapshot tool. Actions: create, abort.',
                ['create', 'abort'],
                [],
                (args) => this.routeLegacyAction('scene_snapshot', {
                    create: 'sceneAdvanced_scene_snapshot',
                    abort: 'sceneAdvanced_scene_snapshot_abort',
                }, args),
            ),
            this.createTool(
                'scene_query',
                'Unified scene query tool. Actions: classes, components, nodes_by_asset_uuid, component_has_script.',
                ['classes', 'components', 'nodes_by_asset_uuid', 'component_has_script'],
                ['extends', 'assetUuid', 'className'],
                (args) => this.routeLegacyAction('scene_query', {
                    classes: 'sceneAdvanced_query_scene_classes',
                    components: 'sceneAdvanced_query_scene_components',
                    nodes_by_asset_uuid: 'sceneAdvanced_query_nodes_by_asset_uuid',
                    component_has_script: 'sceneAdvanced_query_component_has_script',
                }, args),
            ),
            this.createTool(
                'scene_view_control',
                'Unified scene view control tool. Actions: change_gizmo_tool, change_gizmo_pivot, change_gizmo_coordinate, change_view_mode, set_grid_visible, set_icon_gizmo_3d, set_icon_gizmo_size, focus_camera_on_nodes, align_camera_with_view, align_view_with_node, reset.',
                ['change_gizmo_tool', 'change_gizmo_pivot', 'change_gizmo_coordinate', 'change_view_mode', 'set_grid_visible', 'set_icon_gizmo_3d', 'set_icon_gizmo_size', 'focus_camera_on_nodes', 'align_camera_with_view', 'align_view_with_node', 'reset'],
                ['name', 'type', 'visible', 'is3D', 'size', 'is2D', 'uuids'],
                (args) => this.routeLegacyAction('scene_view_control', {
                    change_gizmo_tool: 'sceneView_change_gizmo_tool',
                    change_gizmo_pivot: 'sceneView_change_gizmo_pivot',
                    change_gizmo_coordinate: 'sceneView_change_gizmo_coordinate',
                    change_view_mode: 'sceneView_change_view_mode_2d_3d',
                    set_grid_visible: 'sceneView_set_grid_visible',
                    set_icon_gizmo_3d: 'sceneView_set_icon_gizmo_3d',
                    set_icon_gizmo_size: 'sceneView_set_icon_gizmo_size',
                    focus_camera_on_nodes: 'sceneView_focus_camera_on_nodes',
                    align_camera_with_view: 'sceneView_align_camera_with_view',
                    align_view_with_node: 'sceneView_align_view_with_node',
                    reset: 'sceneView_reset_scene_view',
                }, args),
            ),
            this.createTool(
                'scene_view_query',
                'Unified scene view query tool. Actions: get_status, gizmo_tool, gizmo_pivot, gizmo_view_mode, gizmo_coordinate, view_mode, grid_visible, icon_gizmo_3d, icon_gizmo_size.',
                ['get_status', 'gizmo_tool', 'gizmo_pivot', 'gizmo_view_mode', 'gizmo_coordinate', 'view_mode', 'grid_visible', 'icon_gizmo_3d', 'icon_gizmo_size'],
                [],
                (args) => this.routeLegacyAction('scene_view_query', {
                    get_status: 'sceneView_get_scene_view_status',
                    gizmo_tool: 'sceneView_query_gizmo_tool_name',
                    gizmo_pivot: 'sceneView_query_gizmo_pivot',
                    gizmo_view_mode: 'sceneView_query_gizmo_view_mode',
                    gizmo_coordinate: 'sceneView_query_gizmo_coordinate',
                    view_mode: 'sceneView_query_view_mode_2d_3d',
                    grid_visible: 'sceneView_query_grid_visible',
                    icon_gizmo_3d: 'sceneView_query_icon_gizmo_3d',
                    icon_gizmo_size: 'sceneView_query_icon_gizmo_size',
                }, args),
            ),
            this.createTool(
                'scene_undo_manage',
                'Unified scene undo tool. Actions: begin, end, cancel.',
                ['begin', 'end', 'cancel'],
                ['nodeUuid', 'uuid'],
                (args) => this.routeLegacyAction('scene_undo_manage', {
                    begin: 'sceneAdvanced_begin_undo_recording',
                    end: 'sceneAdvanced_end_undo_recording',
                    cancel: 'sceneAdvanced_cancel_undo_recording',
                }, args),
            ),
            this.createTool(
                'node_query',
                'Unified node query tool. Actions: get_info, find, find_by_name, get_all, detect_type.',
                ['get_info', 'find', 'find_by_name', 'get_all', 'detect_type'],
                ['uuid', 'pattern', 'name', 'exactMatch'],
                (args) => this.routeLegacyAction('node_query', {
                    get_info: 'node_get_node_info',
                    find: 'node_find_nodes',
                    find_by_name: 'node_find_node_by_name',
                    get_all: 'node_get_all_nodes',
                    detect_type: 'node_detect_node_type',
                }, args),
            ),
            this.createTool(
                'node_lifecycle',
                'Unified node lifecycle tool. Actions: create, delete, duplicate.',
                ['create', 'delete', 'duplicate'],
                ['name', 'uuid', 'parentUuid', 'nodeType', 'siblingIndex', 'assetUuid', 'assetPath', 'unlinkPrefab', 'keepWorldTransform', 'includeChildren', 'position', 'rotation', 'scale'],
                (args) => this.routeLegacyAction('node_lifecycle', {
                    create: 'node_create_node',
                    delete: 'node_delete_node',
                    duplicate: 'node_duplicate_node',
                }, args),
            ),
            this.createTool(
                'node_transform',
                'Unified node transform tool. Actions: set_transform, set_property.',
                ['set_transform', 'set_property'],
                ['uuid', 'property', 'value', 'position', 'rotation', 'scale'],
                (args) => this.routeLegacyAction('node_transform', {
                    set_transform: 'node_set_node_transform',
                    set_property: 'node_set_node_property',
                }, args),
            ),
            this.createTool(
                'node_hierarchy',
                'Unified node hierarchy tool. Actions: move, copy, paste, cut.',
                ['move', 'copy', 'paste', 'cut'],
                ['uuid', 'uuids', 'nodeUuid', 'newParentUuid', 'target', 'keepWorldTransform', 'siblingIndex'],
                (args) => this.routeLegacyAction('node_hierarchy', {
                    move: 'node_move_node',
                    copy: 'sceneAdvanced_copy_node',
                    paste: 'sceneAdvanced_paste_node',
                    cut: 'sceneAdvanced_cut_node',
                }, args),
            ),
            this.createTool(
                'node_clipboard',
                'Unified node clipboard tool. Actions: copy, paste, cut.',
                ['copy', 'paste', 'cut'],
                ['uuids', 'target', 'keepWorldTransform'],
                (args) => this.routeLegacyAction('node_clipboard', {
                    copy: 'sceneAdvanced_copy_node',
                    paste: 'sceneAdvanced_paste_node',
                    cut: 'sceneAdvanced_cut_node',
                }, args),
            ),
            this.createTool(
                'node_property_management',
                'Unified node property management tool. Actions: reset_property, reset_transform, move_array_element, remove_array_element.',
                ['reset_property', 'reset_transform', 'move_array_element', 'remove_array_element'],
                ['uuid', 'path', 'target', 'offset', 'index'],
                (args) => this.routeLegacyAction('node_property_management', {
                    reset_property: 'sceneAdvanced_reset_node_property',
                    reset_transform: 'sceneAdvanced_reset_node_transform',
                    move_array_element: 'sceneAdvanced_move_array_element',
                    remove_array_element: 'sceneAdvanced_remove_array_element',
                }, args),
            ),
            this.createTool(
                'node_reference',
                'Unified node reference tool. Actions: nodes_by_asset_uuid, restore_prefab.',
                ['nodes_by_asset_uuid', 'restore_prefab'],
                ['assetUuid', 'nodeUuid'],
                (args) => this.routeLegacyAction('node_reference', {
                    nodes_by_asset_uuid: 'sceneAdvanced_query_nodes_by_asset_uuid',
                    restore_prefab: 'sceneAdvanced_restore_prefab',
                }, args),
            ),
            this.createTool(
                'component_manage',
                'Unified component management tool. Actions: add, remove.',
                ['add', 'remove'],
                ['nodeUuid', 'componentType'],
                (args) => this.routeLegacyAction('component_manage', {
                    add: 'component_add_component',
                    remove: 'component_remove_component',
                }, args),
            ),
            this.createTool(
                'component_script',
                'Unified script component tool. Actions: attach, detach.',
                ['attach', 'detach'],
                ['nodeUuid', 'scriptPath', 'componentType'],
                (args) => this.routeLegacyAction('component_script', {
                    attach: 'component_attach_script',
                    detach: 'component_remove_component',
                }, args),
            ),
            this.createTool(
                'component_query',
                'Unified component query tool. Actions: get_components, get_info.',
                ['get_components', 'get_info'],
                ['nodeUuid', 'componentType'],
                (args) => this.routeLegacyAction('component_query', {
                    get_components: 'component_get_components',
                    get_info: 'component_get_component_info',
                }, args),
            ),
            this.createTool(
                'component_property',
                'Unified component property tool. Actions: set.',
                ['set'],
                ['nodeUuid', 'componentType', 'property', 'propertyType', 'value'],
                (args) => this.routeLegacyAction('component_property', {
                    set: 'component_set_component_property',
                }, args),
            ),
            this.createTool(
                'component_event_binding',
                'Unified component event binding tool for button click events. Actions: get_button_events, clear_button_events, set_button_events, append_button_event.',
                ['get_button_events', 'clear_button_events', 'set_button_events', 'append_button_event'],
                ['nodeUuid', 'componentType', 'events', 'targetNodeUuid', 'component', 'handler', 'customEventData'],
                (args) => this.handleComponentEventBinding(args),
            ),
            this.createTool(
                'component_available',
                'Unified component discovery tool. Actions: list.',
                ['list'],
                ['category'],
                (args) => this.routeLegacyAction('component_available', {
                    list: 'component_get_available_components',
                }, args),
            ),
            this.createTool(
                'prefab_browse',
                'Unified prefab browse tool. Actions: list, load, info, validate.',
                ['list', 'load', 'info', 'validate'],
                ['folder', 'prefabPath'],
                (args) => this.routeLegacyAction('prefab_browse', {
                    list: 'prefab_get_prefab_list',
                    load: 'prefab_load_prefab',
                    info: 'prefab_get_prefab_info',
                    validate: 'prefab_validate_prefab',
                }, args),
            ),
            this.createTool(
                'prefab_lifecycle',
                'Unified prefab lifecycle tool. Actions: create, duplicate.',
                ['create', 'duplicate'],
                ['nodeUuid', 'savePath', 'prefabName', 'sourcePrefabPath', 'targetPrefabPath', 'newPrefabName'],
                (args) => this.routeLegacyAction('prefab_lifecycle', {
                    create: 'prefab_create_prefab',
                    duplicate: 'prefab_duplicate_prefab',
                }, args),
            ),
            this.createTool(
                'prefab_instance',
                'Unified prefab instance tool. Actions: instantiate, revert, restore_node, restore.',
                ['instantiate', 'revert', 'restore_node', 'restore'],
                ['prefabPath', 'parentUuid', 'position', 'nodeUuid', 'assetUuid'],
                (args) => this.routeLegacyAction('prefab_instance', {
                    instantiate: 'prefab_instantiate_prefab',
                    revert: 'prefab_revert_prefab',
                    restore_node: 'prefab_restore_prefab_node',
                    restore: 'sceneAdvanced_restore_prefab',
                }, args),
            ),
            this.createTool(
                'prefab_edit',
                'Unified prefab edit tool. Actions: update, revert.',
                ['update', 'revert'],
                ['prefabPath', 'nodeUuid'],
                (args) => this.routeLegacyAction('prefab_edit', {
                    update: 'prefab_update_prefab',
                    revert: 'prefab_revert_prefab',
                }, args),
            ),
            this.createTool(
                'prefab_reference',
                'Unified prefab reference tool. Actions: restore_node, nodes_by_asset_uuid.',
                ['restore_node', 'nodes_by_asset_uuid'],
                ['nodeUuid', 'assetUuid'],
                (args) => this.routeLegacyAction('prefab_reference', {
                    restore_node: 'prefab_restore_prefab_node',
                    nodes_by_asset_uuid: 'sceneAdvanced_query_nodes_by_asset_uuid',
                }, args),
            ),
            this.createTool(
                'asset_manage',
                'Unified asset management tool. Actions: import, create, copy, move, delete, save, reimport, open_external.',
                ['import', 'create', 'copy', 'move', 'delete', 'save', 'reimport', 'open_external'],
                ['sourcePath', 'targetFolder', 'url', 'content', 'overwrite', 'source', 'target', 'urlOrUUID'],
                (args) => this.routeLegacyAction('asset_manage', {
                    import: 'project_import_asset',
                    create: 'project_create_asset',
                    copy: 'project_copy_asset',
                    move: 'project_move_asset',
                    delete: 'project_delete_asset',
                    save: 'project_save_asset',
                    reimport: 'project_reimport_asset',
                    open_external: 'assetAdvanced_open_asset_external',
                }, args),
            ),
            this.createTool(
                'asset_query',
                'Unified asset query tool. Actions: get_info, list, query_path, query_uuid, query_url, find_by_name, details, generate_available_url, db_ready.',
                ['get_info', 'list', 'query_path', 'query_uuid', 'query_url', 'find_by_name', 'details', 'generate_available_url', 'db_ready'],
                ['assetPath', 'folder', 'type', 'url', 'uuid', 'name', 'exactMatch', 'assetType', 'maxResults', 'includeSubAssets'],
                (args) => this.routeLegacyAction('asset_query', {
                    get_info: 'project_get_asset_info',
                    list: 'project_get_assets',
                    query_path: 'project_query_asset_path',
                    query_uuid: 'project_query_asset_uuid',
                    query_url: 'project_query_asset_url',
                    find_by_name: 'project_find_asset_by_name',
                    details: 'project_get_asset_details',
                    generate_available_url: 'assetAdvanced_generate_available_url',
                    db_ready: 'assetAdvanced_query_asset_db_ready',
                }, args),
            ),
            this.createTool(
                'asset_analyze',
                'Unified asset analysis tool. Actions: validate_references, dependencies, unused.',
                ['validate_references', 'dependencies', 'unused'],
                ['directory', 'excludeDirectories', 'urlOrUUID', 'direction'],
                (args) => this.routeLegacyAction('asset_analyze', {
                    validate_references: 'assetAdvanced_validate_asset_references',
                    dependencies: 'assetAdvanced_get_asset_dependencies',
                    unused: 'assetAdvanced_get_unused_assets',
                }, args),
            ),
            this.createTool(
                'asset_batch',
                'Unified asset batch tool. Actions: batch_import, batch_delete, compress_textures, export_manifest.',
                ['batch_import', 'batch_delete', 'compress_textures', 'export_manifest'],
                ['sourceDirectory', 'targetDirectory', 'fileFilter', 'recursive', 'overwrite', 'urls', 'directory', 'format', 'quality', 'includeMetadata'],
                (args) => this.routeLegacyAction('asset_batch', {
                    batch_import: 'assetAdvanced_batch_import_assets',
                    batch_delete: 'assetAdvanced_batch_delete_assets',
                    compress_textures: 'assetAdvanced_compress_textures',
                    export_manifest: 'assetAdvanced_export_asset_manifest',
                }, args),
            ),
            this.createTool(
                'asset_meta',
                'Unified asset meta tool. Actions: save_meta.',
                ['save_meta'],
                ['urlOrUUID', 'content'],
                (args) => this.routeLegacyAction('asset_meta', {
                    save_meta: 'assetAdvanced_save_asset_meta',
                }, args),
            ),
            this.createTool(
                'project_manage',
                'Unified project management tool. Actions: get_info, get_settings, refresh_assets.',
                ['get_info', 'get_settings', 'refresh_assets'],
                ['category', 'folder'],
                (args) => this.routeLegacyAction('project_manage', {
                    get_info: 'project_get_project_info',
                    get_settings: 'project_get_project_settings',
                    refresh_assets: 'project_refresh_assets',
                }, args),
            ),
            this.createTool(
                'project_build_system',
                'Unified build system tool. Actions: build, get_build_settings, open_build_panel, check_builder_status.',
                ['build', 'get_build_settings', 'open_build_panel', 'check_builder_status'],
                ['platform', 'debug'],
                (args) => this.routeLegacyAction('project_build_system', {
                    build: 'project_build_project',
                    get_build_settings: 'project_get_build_settings',
                    open_build_panel: 'project_open_build_panel',
                    check_builder_status: 'project_check_builder_status',
                }, args),
            ),
            this.createTool(
                'project_runtime',
                'Unified project runtime tool. Actions: run, start_preview_server, stop_preview_server.',
                ['run', 'start_preview_server', 'stop_preview_server'],
                ['platform', 'port'],
                (args) => this.routeLegacyAction('project_runtime', {
                    run: 'project_run_project',
                    start_preview_server: 'project_start_preview_server',
                    stop_preview_server: 'project_stop_preview_server',
                }, args),
            ),
            this.createTool(
                'project_asset_system',
                'Unified project asset system tool. Actions: import, create, copy, move, delete, save, reimport.',
                ['import', 'create', 'copy', 'move', 'delete', 'save', 'reimport'],
                ['sourcePath', 'targetFolder', 'url', 'content', 'overwrite', 'source', 'target'],
                (args) => this.routeLegacyAction('project_asset_system', {
                    import: 'project_import_asset',
                    create: 'project_create_asset',
                    copy: 'project_copy_asset',
                    move: 'project_move_asset',
                    delete: 'project_delete_asset',
                    save: 'project_save_asset',
                    reimport: 'project_reimport_asset',
                }, args),
            ),
            this.createTool(
                'project_query',
                'Unified project query tool. Actions: assets, asset_info, asset_details, asset_path, asset_uuid, asset_url, find_asset_by_name.',
                ['assets', 'asset_info', 'asset_details', 'asset_path', 'asset_uuid', 'asset_url', 'find_asset_by_name'],
                ['type', 'folder', 'assetPath', 'includeSubAssets', 'url', 'uuid', 'name', 'exactMatch', 'assetType', 'maxResults'],
                (args) => this.routeLegacyAction('project_query', {
                    assets: 'project_get_assets',
                    asset_info: 'project_get_asset_info',
                    asset_details: 'project_get_asset_details',
                    asset_path: 'project_query_asset_path',
                    asset_uuid: 'project_query_asset_uuid',
                    asset_url: 'project_query_asset_url',
                    find_asset_by_name: 'project_find_asset_by_name',
                }, args),
            ),
            this.createTool(
                'debug_console',
                'Unified console debugging tool. Actions: get, clear.',
                ['get', 'clear'],
                ['limit', 'filter'],
                (args) => this.routeLegacyAction('debug_console', {
                    get: 'debug_get_console_logs',
                    clear: 'debug_clear_console',
                }, args),
            ),
            this.createTool(
                'debug_logs',
                'Unified project log tool. Actions: get_project_logs, get_log_file_info, search.',
                ['get_project_logs', 'get_log_file_info', 'search'],
                ['lines', 'filterKeyword', 'logLevel', 'pattern', 'maxResults', 'contextLines'],
                (args) => this.routeLegacyAction('debug_logs', {
                    get_project_logs: 'debug_get_project_logs',
                    get_log_file_info: 'debug_get_log_file_info',
                    search: 'debug_search_project_logs',
                }, args),
            ),
            this.createTool(
                'debug_execute',
                'Unified execution debugging tool. Actions: script.',
                ['script'],
                ['script'],
                (args) => this.routeLegacyAction('debug_execute', {
                    script: 'debug_execute_script',
                }, args),
            ),
            this.createTool(
                'debug_scene',
                'Unified scene debugging tool. Actions: node_tree, validate, editor_info.',
                ['node_tree', 'validate', 'editor_info'],
                ['rootUuid', 'maxDepth', 'checkMissingAssets', 'checkPerformance'],
                (args) => this.routeLegacyAction('debug_scene', {
                    node_tree: 'debug_get_node_tree',
                    validate: 'debug_validate_scene',
                    editor_info: 'debug_get_editor_info',
                }, args),
            ),
            this.createTool(
                'debug_performance',
                'Unified performance debugging tool. Actions: stats.',
                ['stats'],
                [],
                (args) => this.routeLegacyAction('debug_performance', {
                    stats: 'debug_get_performance_stats',
                }, args),
            ),
            this.createTool(
                'preferences_manage',
                'Unified preferences tool. Actions: open, query, set, get_all, reset, export, import.',
                ['open', 'query', 'set', 'get_all', 'reset', 'export', 'import'],
                ['tab', 'args', 'name', 'path', 'value', 'type', 'exportPath', 'importPath'],
                (args) => this.routeLegacyAction('preferences_manage', {
                    open: 'preferences_open_preferences_settings',
                    query: 'preferences_query_preferences_config',
                    set: 'preferences_set_preferences_config',
                    get_all: 'preferences_get_all_preferences',
                    reset: 'preferences_reset_preferences',
                    export: 'preferences_export_preferences',
                    import: 'preferences_import_preferences',
                }, args),
            ),
            this.createTool(
                'server_info',
                'Unified server information tool. Actions: ip_list, sorted_ip_list, port, status.',
                ['ip_list', 'sorted_ip_list', 'port', 'status'],
                [],
                (args) => this.routeLegacyAction('server_info', {
                    ip_list: 'server_query_server_ip_list',
                    sorted_ip_list: 'server_query_sorted_server_ip_list',
                    port: 'server_query_server_port',
                    status: 'server_get_server_status',
                }, args),
            ),
            this.createTool(
                'server_network',
                'Unified server network tool. Actions: connectivity, interfaces.',
                ['connectivity', 'interfaces'],
                ['timeout'],
                (args) => this.routeLegacyAction('server_network', {
                    connectivity: 'server_check_server_connectivity',
                    interfaces: 'server_get_network_interfaces',
                }, args),
            ),
            this.createTool(
                'server_control',
                'Unified MCP server control metadata tool. Actions: health, settings, available_tools.',
                ['health', 'settings', 'available_tools'],
                [],
                (args) => this.handleServerControl(args),
            ),
            this.createTool(
                'broadcast_message',
                'Unified broadcast tool. Actions: get_log, listen, stop_listening, clear_log, active_listeners.',
                ['get_log', 'listen', 'stop_listening', 'clear_log', 'active_listeners'],
                ['limit', 'messageType'],
                (args) => this.routeLegacyAction('broadcast_message', {
                    get_log: 'broadcast_get_broadcast_log',
                    listen: 'broadcast_listen_broadcast',
                    stop_listening: 'broadcast_stop_listening',
                    clear_log: 'broadcast_clear_broadcast_log',
                    active_listeners: 'broadcast_get_active_listeners',
                }, args),
            ),
            this.createTool(
                'reference_image_manage',
                'Unified reference image tool. Actions: add, remove, switch, set_data, query_config, query_current, refresh, set_position, set_scale, set_opacity, list, clear_all.',
                ['add', 'remove', 'switch', 'set_data', 'query_config', 'query_current', 'refresh', 'set_position', 'set_scale', 'set_opacity', 'list', 'clear_all'],
                ['paths', 'path', 'sceneUUID', 'key', 'value', 'x', 'y', 'sx', 'sy', 'opacity'],
                (args) => this.routeLegacyAction('reference_image_manage', {
                    add: 'referenceImage_add_reference_image',
                    remove: 'referenceImage_remove_reference_image',
                    switch: 'referenceImage_switch_reference_image',
                    set_data: 'referenceImage_set_reference_image_data',
                    query_config: 'referenceImage_query_reference_image_config',
                    query_current: 'referenceImage_query_current_reference_image',
                    refresh: 'referenceImage_refresh_reference_image',
                    set_position: 'referenceImage_set_reference_image_position',
                    set_scale: 'referenceImage_set_reference_image_scale',
                    set_opacity: 'referenceImage_set_reference_image_opacity',
                    list: 'referenceImage_list_reference_images',
                    clear_all: 'referenceImage_clear_all_reference_images',
                }, args),
            ),
            this.createTool(
                'validation_params',
                'Unified validation helper tool. Actions: validate_json, safe_string, format_mcp_request.',
                ['validate_json', 'safe_string', 'format_mcp_request'],
                ['jsonString', 'expectedSchema', 'value', 'toolName', 'arguments'],
                (args) => this.routeLegacyAction('validation_params', {
                    validate_json: 'validation_validate_json_params',
                    safe_string: 'validation_safe_string_value',
                    format_mcp_request: 'validation_format_mcp_request',
                }, args),
            ),
            this.createTool(
                'resource_reference',
                'Unified resource reference tool. Actions: nodes_by_asset_uuid, asset_dependencies, validate_asset_references.',
                ['nodes_by_asset_uuid', 'asset_dependencies', 'validate_asset_references'],
                ['assetUuid', 'urlOrUUID', 'direction', 'directory'],
                (args) => this.routeLegacyAction('resource_reference', {
                    nodes_by_asset_uuid: 'sceneAdvanced_query_nodes_by_asset_uuid',
                    asset_dependencies: 'assetAdvanced_get_asset_dependencies',
                    validate_asset_references: 'assetAdvanced_validate_asset_references',
                }, args),
            ),
            this.createTool(
                'tool_registry',
                'Unified tool registry helper. Actions: list, describe, actions.',
                ['list', 'describe', 'actions'],
                ['toolName'],
                (args) => this.handleToolRegistry(args),
            ),
        ];
    }

    private createTool(
        name: string,
        description: string,
        actions: string[],
        propertyKeys: string[],
        execute: (args: any) => Promise<ToolResponse>,
    ): RegisteredTool {
        return {
            name,
            description,
            inputSchema: {
                type: 'object',
                properties: {
                    action: {
                        type: 'string',
                        enum: actions,
                        description: `Operation code. Supported actions: ${actions.join(', ')}`,
                    },
                    ...pickProps(propertyKeys),
                },
                required: ['action'],
            },
            execute,
        };
    }

    private async routeLegacyAction(toolName: string, actionMap: Record<string, string>, args: any): Promise<ToolResponse> {
        const action = args?.action;
        if (!action) {
            return { success: false, error: `${toolName} requires an action parameter` };
        }

        const target = actionMap[action];
        if (!target) {
            return {
                success: false,
                error: `Unsupported action '${action}' for ${toolName}. Available actions: ${Object.keys(actionMap).join(', ')}`,
            };
        }

        const payload = { ...args };
        delete payload.action;
        return this.callLegacy(target, payload);
    }

    private async callLegacy(fullName: string, args: any): Promise<ToolResponse> {
        for (const prefix of LEGACY_PREFIXES) {
            const prefixWithSeparator = `${prefix}_`;
            if (fullName.startsWith(prefixWithSeparator)) {
                const executor = (this.legacy as any)[prefix];
                const toolName = fullName.slice(prefixWithSeparator.length);
                return executor.execute(toolName, args);
            }
        }

        throw new Error(`Legacy tool ${fullName} not found`);
    }

    private async handleServerControl(args: any): Promise<ToolResponse> {
        switch (args.action) {
            case 'health':
                return {
                    success: true,
                    data: {
                        status: 'ok',
                        version: '1.5.0',
                        tools: this.getTools().length,
                        settings: this.infoProvider.getSettings ? this.infoProvider.getSettings() : null,
                    },
                };
            case 'settings':
                return {
                    success: true,
                    data: this.infoProvider.getSettings ? this.infoProvider.getSettings() : null,
                };
            case 'available_tools':
                return {
                    success: true,
                    data: {
                        count: this.getTools().length,
                        tools: this.getTools().map((tool) => ({
                            name: tool.name,
                            description: tool.description,
                        })),
                    },
                };
            default:
                return {
                    success: false,
                    error: `Unsupported action '${args.action}' for server_control. Available actions: health, settings, available_tools`,
                };
        }
    }

    private async handleToolRegistry(args: any): Promise<ToolResponse> {
        const tools = this.getTools();
        switch (args.action) {
            case 'list':
                return {
                    success: true,
                    data: {
                        count: tools.length,
                        tools: tools.map((tool) => ({
                            name: tool.name,
                            description: tool.description,
                        })),
                    },
                };
            case 'describe': {
                const target = tools.find((tool) => tool.name === args.toolName);
                if (!target) {
                    return { success: false, error: `Tool ${args.toolName} not found` };
                }
                return {
                    success: true,
                    data: target,
                };
            }
            case 'actions':
                return {
                    success: true,
                    data: tools.map((tool) => ({
                        name: tool.name,
                        actions: tool.inputSchema?.properties?.action?.enum ?? [],
                    })),
                };
            default:
                return {
                    success: false,
                    error: `Unsupported action '${args.action}' for tool_registry. Available actions: list, describe, actions`,
                };
        }
    }

    private async handleComponentEventBinding(args: any): Promise<ToolResponse> {
        const nodeUuid = args.nodeUuid;
        const componentType = args.componentType || 'cc.Button';

        if (!nodeUuid) {
            return { success: false, error: 'component_event_binding requires nodeUuid' };
        }

        try {
            const componentInfo = await this.getRawComponentInfo(nodeUuid, componentType);
            if (!componentInfo) {
                return { success: false, error: `Component ${componentType} not found on node ${nodeUuid}` };
            }

            const fieldName = this.getButtonEventFieldName(componentInfo.component);
            const currentEvents = Array.isArray((componentInfo.component as any)[fieldName]) ? (componentInfo.component as any)[fieldName] : [];

            switch (args.action) {
                case 'get_button_events':
                    return {
                        success: true,
                        data: {
                            nodeUuid,
                            componentType,
                            fieldName,
                            events: currentEvents,
                            count: currentEvents.length,
                        },
                    };
                case 'clear_button_events':
                    await this.setRawComponentProperty(nodeUuid, componentInfo.index, fieldName, []);
                    return {
                        success: true,
                        data: {
                            nodeUuid,
                            componentType,
                            cleared: true,
                            count: 0,
                        },
                    };
                case 'set_button_events': {
                    const events = Array.isArray(args.events) ? args.events : [];
                    await this.setRawComponentProperty(nodeUuid, componentInfo.index, fieldName, events);
                    return {
                        success: true,
                        data: {
                            nodeUuid,
                            componentType,
                            fieldName,
                            count: events.length,
                            events,
                        },
                    };
                }
                case 'append_button_event': {
                    const nextEvents = [
                        ...currentEvents,
                        this.buildButtonClickEvent(args),
                    ];
                    await this.setRawComponentProperty(nodeUuid, componentInfo.index, fieldName, nextEvents);
                    return {
                        success: true,
                        data: {
                            nodeUuid,
                            componentType,
                            fieldName,
                            count: nextEvents.length,
                            events: nextEvents,
                        },
                    };
                }
                default:
                    return {
                        success: false,
                        error: `Unsupported action '${args.action}' for component_event_binding. Available actions: get_button_events, clear_button_events, set_button_events, append_button_event`,
                    };
            }
        } catch (error: any) {
            return {
                success: false,
                error: `Failed to process component event binding: ${error.message}`,
            };
        }
    }

    private buildButtonClickEvent(args: any): any {
        return {
            __type__: 'cc.ClickEvent',
            target: args.targetNodeUuid ? { uuid: args.targetNodeUuid } : null,
            component: args.component || '',
            handler: args.handler || '',
            customEventData: args.customEventData || '',
        };
    }

    private async getRawComponentInfo(nodeUuid: string, componentType: string): Promise<{ index: number; component: any } | null> {
        const nodeData = await Editor.Message.request('scene', 'query-node', nodeUuid);
        if (!nodeData || !Array.isArray(nodeData.__comps__)) {
            return null;
        }

        const exactIndex = nodeData.__comps__.findIndex((component: any) => component.type === componentType);
        if (exactIndex >= 0) {
            return {
                index: exactIndex,
                component: nodeData.__comps__[exactIndex],
            };
        }

        return null;
    }

    private getButtonEventFieldName(component: any): string {
        if (component && Object.prototype.hasOwnProperty.call(component, '_clickEvents')) {
            return '_clickEvents';
        }
        return 'clickEvents';
    }

    private async setRawComponentProperty(nodeUuid: string, componentIndex: number, fieldName: string, value: any): Promise<void> {
        await Editor.Message.request('scene', 'set-property', {
            uuid: nodeUuid,
            path: `__comps__.${componentIndex}.${fieldName}`,
            dump: { value },
        });
    }
}
