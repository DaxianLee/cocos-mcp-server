# Cocos Creator MCP 服务器 1.5.0 工具说明

## 说明

这份文档是面向 AI 调用的 1.5.0 版工具说明。

- 1.4 旧版说明见 [FEATURE_GUIDE_CN.md](FEATURE_GUIDE_CN.md)
- 1.4 说明基于旧的细粒度工具体系
- 1.5 说明基于新的 50 个核心工具 + `action` 操作码体系

1.5 的目标不是保留所有旧工具名，而是把高频能力统一收口，减少调用轮次和参数猜测。

## 调用格式

所有 1.5 工具统一使用下面的格式：

```json
{
  "tool": "node_lifecycle",
  "arguments": {
    "action": "create",
    "name": "Player",
    "parentUuid": "parent-uuid",
    "nodeType": "2DNode"
  }
}
```

## 通用规则

- 所有工具都必须传 `action`
- 除非文档明确写明可省略，否则 `uuid`、`nodeUuid`、`parentUuid`、`assetUuid`、`prefabPath`、`url` 这类标识符都应先查询再使用
- 节点创建时强烈建议始终传 `parentUuid`
- 组件删除时优先使用从 `component_query` 取到的真实组件类型或 cid
- 涉及引用关系时，优先使用 `uuid` 或 `assetUuid`，不要依赖名字
- 预制体和事件绑定是高风险操作，调用前先查目标节点和组件信息

## 常用查询顺序

1. 场景相关：`scene_management` 或 `scene_hierarchy`
2. 节点相关：`node_query`
3. 组件相关：`component_query`
4. 资源相关：`asset_query` 或 `project_query`
5. 预制体相关：`prefab_browse`

## 1. 场景工具

### `scene_management`
用途：场景生命周期管理

- `action`: `get_current`, `list`, `open`, `save`, `create`, `save_as`, `close`
- 常用参数：
  - `open`: `scenePath`
  - `create`: `sceneName`, `savePath`
  - `save_as`: `path`

示例：

```json
{
  "tool": "scene_management",
  "arguments": {
    "action": "open",
    "scenePath": "db://assets/scenes/Game.scene"
  }
}
```

### `scene_hierarchy`
用途：获取当前场景层级

- `action`: `get`
- 参数：`includeComponents`

### `scene_execution_control`
用途：场景脚本执行、组件方法执行、Prefab 恢复、场景状态查询

- `action`: `execute_component_method`, `execute_scene_script`, `restore_prefab`, `soft_reload`, `query_ready`, `query_dirty`
- 常用参数：
  - `execute_component_method`: `uuid`, `name`, `args`
  - `execute_scene_script`: `name`, `method`, `args`
  - `restore_prefab`: `nodeUuid`, `assetUuid`

### `scene_snapshot`
用途：场景快照

- `action`: `create`, `abort`

### `scene_query`
用途：查询场景类、组件、资源引用节点、脚本组件注册情况

- `action`: `classes`, `components`, `nodes_by_asset_uuid`, `component_has_script`
- 常用参数：`extends`, `assetUuid`, `className`

### `scene_view_control`
用途：控制场景视图、Gizmo、网格、视角

- `action`: `change_gizmo_tool`, `change_gizmo_pivot`, `change_gizmo_coordinate`, `change_view_mode`, `set_grid_visible`, `set_icon_gizmo_3d`, `set_icon_gizmo_size`, `focus_camera_on_nodes`, `align_camera_with_view`, `align_view_with_node`, `reset`

### `scene_view_query`
用途：查询场景视图状态

- `action`: `get_status`, `gizmo_tool`, `gizmo_pivot`, `gizmo_view_mode`, `gizmo_coordinate`, `view_mode`, `grid_visible`, `icon_gizmo_3d`, `icon_gizmo_size`

### `scene_undo_manage`
用途：显式控制撤销记录

- `action`: `begin`, `end`, `cancel`
- 常用参数：
  - `begin`: `nodeUuid`
  - `end` / `cancel`: `uuid`

## 2. 节点工具

### `node_query`
用途：节点查询

- `action`: `get_info`, `find`, `find_by_name`, `get_all`, `detect_type`
- 常用参数：`uuid`, `pattern`, `name`, `exactMatch`

### `node_lifecycle`
用途：节点创建、删除、复制

- `action`: `create`, `delete`, `duplicate`
- 常用参数：
  - `create`: `name`, `parentUuid`, `nodeType`, `siblingIndex`, `assetUuid`, `assetPath`, `unlinkPrefab`, `keepWorldTransform`
  - `delete`: `uuid`
  - `duplicate`: `uuid`, `includeChildren`

示例：

```json
{
  "tool": "node_lifecycle",
  "arguments": {
    "action": "create",
    "name": "EnemyRoot",
    "parentUuid": "canvas-uuid",
    "nodeType": "2DNode"
  }
}
```

### `node_transform`
用途：节点变换和基础属性更新

- `action`: `set_transform`, `set_property`
- 常用参数：
  - `set_transform`: `uuid`, `position`, `rotation`, `scale`
  - `set_property`: `uuid`, `property`, `value`

### `node_hierarchy`
用途：节点移动与层级操作

- `action`: `move`, `copy`, `paste`, `cut`
- 常用参数：
  - `move`: `nodeUuid`, `newParentUuid`, `siblingIndex`
  - `copy` / `cut`: `uuids`
  - `paste`: `target`, `uuids`, `keepWorldTransform`

### `node_clipboard`
用途：节点剪贴板操作

- `action`: `copy`, `paste`, `cut`
- 参数与 `node_hierarchy` 中相同

### `node_property_management`
用途：重置节点属性、数组属性调整

- `action`: `reset_property`, `reset_transform`, `move_array_element`, `remove_array_element`
- 常用参数：`uuid`, `path`, `target`, `offset`, `index`

### `node_reference`
用途：节点与资源/Prefab 引用关系查询

- `action`: `nodes_by_asset_uuid`, `restore_prefab`
- 常用参数：`assetUuid`, `nodeUuid`

## 3. 组件工具

### `component_manage`
用途：组件增删

- `action`: `add`, `remove`
- 参数：`nodeUuid`, `componentType`

### `component_script`
用途：脚本组件挂载或移除

- `action`: `attach`, `detach`
- 常用参数：
  - `attach`: `nodeUuid`, `scriptPath`
  - `detach`: `nodeUuid`, `componentType`

### `component_query`
用途：查询节点组件和单个组件信息

- `action`: `get_components`, `get_info`
- 参数：`nodeUuid`, `componentType`

### `component_property`
用途：设置组件属性

- `action`: `set`
- 参数：`nodeUuid`, `componentType`, `property`, `propertyType`, `value`

示例：

```json
{
  "tool": "component_property",
  "arguments": {
    "action": "set",
    "nodeUuid": "label-node-uuid",
    "componentType": "cc.Label",
    "property": "string",
    "propertyType": "string",
    "value": "Hello"
  }
}
```

### `component_event_binding`
用途：按钮点击事件绑定

- `action`: `get_button_events`, `clear_button_events`, `set_button_events`, `append_button_event`
- 常用参数：
  - `nodeUuid`
  - `componentType`
  - `events`
  - `targetNodeUuid`
  - `component`
  - `handler`
  - `customEventData`

说明：

- 这组工具主要面向 `cc.Button`
- `append_button_event` 用来追加单条事件
- `set_button_events` 会整体覆盖事件数组

### `component_available`
用途：列出可用组件类型

- `action`: `list`
- 参数：`category`

## 4. 预制体工具

### `prefab_browse`
用途：浏览和校验预制体

- `action`: `list`, `load`, `info`, `validate`
- 常用参数：`folder`, `prefabPath`

### `prefab_lifecycle`
用途：创建或复制预制体

- `action`: `create`, `duplicate`
- 常用参数：
  - `create`: `nodeUuid`, `savePath`, `prefabName`
  - `duplicate`: `sourcePrefabPath`, `targetPrefabPath`, `newPrefabName`

### `prefab_instance`
用途：实例化、还原、恢复 Prefab 节点

- `action`: `instantiate`, `revert`, `restore_node`, `restore`
- 常用参数：
  - `instantiate`: `prefabPath`, `parentUuid`, `position`
  - `revert`: `nodeUuid`
  - `restore_node`: `nodeUuid`, `assetUuid`
  - `restore`: `nodeUuid`, `assetUuid`

### `prefab_edit`
用途：更新或回退预制体

- `action`: `update`, `revert`
- 参数：
  - `update`: `prefabPath`, `nodeUuid`
  - `revert`: `nodeUuid`

### `prefab_reference`
用途：预制体和资源引用查询

- `action`: `restore_node`, `nodes_by_asset_uuid`

## 5. 资源工具

### `asset_manage`
用途：单资源增删改导入导出

- `action`: `import`, `create`, `copy`, `move`, `delete`, `save`, `reimport`, `open_external`
- 常用参数：
  - `import`: `sourcePath`, `targetFolder`
  - `create`: `url`, `content`, `overwrite`
  - `copy` / `move`: `source`, `target`, `overwrite`
  - `delete`: `url`
  - `save`: `url`, `content`
  - `reimport`: `url`
  - `open_external`: `urlOrUUID`

### `asset_query`
用途：资源查询

- `action`: `get_info`, `list`, `query_path`, `query_uuid`, `query_url`, `find_by_name`, `details`, `generate_available_url`, `db_ready`

### `asset_analyze`
用途：资源分析

- `action`: `validate_references`, `dependencies`, `unused`
- 常用参数：`directory`, `excludeDirectories`, `urlOrUUID`, `direction`

### `asset_batch`
用途：资源批量操作

- `action`: `batch_import`, `batch_delete`, `compress_textures`, `export_manifest`

### `asset_meta`
用途：资源 meta 保存

- `action`: `save_meta`
- 参数：`urlOrUUID`, `content`

## 6. 项目工具

### `project_manage`
用途：项目信息与项目设置

- `action`: `get_info`, `get_settings`, `refresh_assets`
- 参数：`category`, `folder`

### `project_build_system`
用途：构建系统

- `action`: `build`, `get_build_settings`, `open_build_panel`, `check_builder_status`
- 常用参数：`platform`, `debug`

### `project_runtime`
用途：运行和预览服务

- `action`: `run`, `start_preview_server`, `stop_preview_server`
- 参数：`platform`, `port`

### `project_asset_system`
用途：项目级资源写操作

- `action`: `import`, `create`, `copy`, `move`, `delete`, `save`, `reimport`

### `project_query`
用途：项目资产查询

- `action`: `assets`, `asset_info`, `asset_details`, `asset_path`, `asset_uuid`, `asset_url`, `find_asset_by_name`

## 7. 调试工具

### `debug_console`
用途：控制台日志读取和清空

- `action`: `get`, `clear`
- 参数：`limit`, `filter`

### `debug_logs`
用途：项目日志读取和搜索

- `action`: `get_project_logs`, `get_log_file_info`, `search`
- 参数：`lines`, `filterKeyword`, `logLevel`, `pattern`, `maxResults`, `contextLines`

### `debug_execute`
用途：执行调试脚本

- `action`: `script`
- 参数：`script`

### `debug_scene`
用途：场景调试

- `action`: `node_tree`, `validate`, `editor_info`
- 参数：`rootUuid`, `maxDepth`, `checkMissingAssets`, `checkPerformance`

### `debug_performance`
用途：性能统计

- `action`: `stats`

## 8. 偏好设置工具

### `preferences_manage`
用途：偏好设置统一入口

- `action`: `open`, `query`, `set`, `get_all`, `reset`, `export`, `import`
- 常用参数：`tab`, `args`, `name`, `path`, `value`, `type`, `exportPath`, `importPath`

## 9. 服务器工具

### `server_info`
用途：服务器基础信息

- `action`: `ip_list`, `sorted_ip_list`, `port`, `status`

### `server_network`
用途：网络连通性和网卡信息

- `action`: `connectivity`, `interfaces`
- 参数：`timeout`

### `server_control`
用途：MCP 服务元信息

- `action`: `health`, `settings`, `available_tools`

说明：

- `health` 会返回 1.5 版本、工具数量和当前设置
- `available_tools` 会返回当前暴露的统一工具列表

## 10. 广播工具

### `broadcast_message`
用途：广播监听与日志管理

- `action`: `get_log`, `listen`, `stop_listening`, `clear_log`, `active_listeners`
- 参数：`limit`, `messageType`

## 11. 参考图工具

### `reference_image_manage`
用途：参考图片管理

- `action`: `add`, `remove`, `switch`, `set_data`, `query_config`, `query_current`, `refresh`, `set_position`, `set_scale`, `set_opacity`, `list`, `clear_all`

## 12. 校验工具

### `validation_params`
用途：参数安全处理和请求格式化

- `action`: `validate_json`, `safe_string`, `format_mcp_request`
- 参数：`jsonString`, `expectedSchema`, `value`, `toolName`, `arguments`

## 13. 引用工具

### `resource_reference`
用途：资源引用关系和依赖分析

- `action`: `nodes_by_asset_uuid`, `asset_dependencies`, `validate_asset_references`

## 14. 工具注册表

### `tool_registry`
用途：给 AI 自查当前 1.5 工具体系

- `action`: `list`, `describe`, `actions`
- 参数：`toolName`

建议：

- 初次接入时先调 `tool_registry.list`
- 不确定某个工具支持哪些操作时调 `tool_registry.actions`
- 不确定参数结构时调 `tool_registry.describe`

## 最佳实践

### 1. 先查再改

- 改场景前先 `scene_management.get_current`
- 改节点前先 `node_query.get_info`
- 改组件前先 `component_query.get_components`
- 改资源前先 `asset_query.get_info` 或 `project_query.asset_info`

### 2. 使用 UUID，不要依赖名称

- 名称适合查询
- 真正写操作尽量用 `uuid`、`nodeUuid`、`assetUuid`

### 3. 预制体操作分三步

1. `prefab_browse.info` 或 `prefab_browse.validate`
2. `prefab_instance.instantiate` 或 `prefab_lifecycle.create`
3. 必要时 `prefab_edit.update` 或 `prefab_instance.revert`

### 4. 事件绑定先查按钮组件

推荐顺序：

1. `component_query.get_components`
2. `component_event_binding.get_button_events`
3. `component_event_binding.append_button_event`

### 5. 工具选择建议

- 场景切换和保存：`scene_management`
- 节点增删改查：`node_*`
- 组件读写：`component_*`
- 预制体：`prefab_*`
- 资源：`asset_*` 或 `project_*`
- 调试：`debug_*`
- 不确定该用什么时：`tool_registry`

## 最小示例集

### 创建节点

```json
{
  "tool": "node_lifecycle",
  "arguments": {
    "action": "create",
    "name": "StartButton",
    "parentUuid": "canvas-uuid",
    "nodeType": "2DNode"
  }
}
```

### 设置节点位置

```json
{
  "tool": "node_transform",
  "arguments": {
    "action": "set_transform",
    "uuid": "node-uuid",
    "position": { "x": 0, "y": -200, "z": 0 }
  }
}
```

### 挂载脚本

```json
{
  "tool": "component_script",
  "arguments": {
    "action": "attach",
    "nodeUuid": "node-uuid",
    "scriptPath": "db://assets/scripts/GameController.ts"
  }
}
```

### 生成预制体

```json
{
  "tool": "prefab_lifecycle",
  "arguments": {
    "action": "create",
    "nodeUuid": "node-uuid",
    "prefabName": "Enemy",
    "savePath": "db://assets/prefabs/Enemy.prefab"
  }
}
```

### 搜索资源

```json
{
  "tool": "project_query",
  "arguments": {
    "action": "find_asset_by_name",
    "name": "Enemy",
    "assetType": "prefab",
    "folder": "db://assets",
    "exactMatch": false
  }
}
```

### 自查工具系统

```json
{
  "tool": "tool_registry",
  "arguments": {
    "action": "describe",
    "toolName": "node_lifecycle"
  }
}
```
