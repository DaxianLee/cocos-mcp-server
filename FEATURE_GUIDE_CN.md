# Cocos Creator MCP 服务器功能指导文档

## 概述

Cocos Creator MCP 服务器是一个全面的 Model Context Protocol (MCP) 服务器插件，专为 Cocos Creator 3.8+ 设计，通过标准化协议使 AI 助手能够与 Cocos Creator 编辑器进行交互。

本文档详细介绍了所有可用的 MCP 工具及其使用方法。

## 工具分类

MCP 服务器提供了 **158 个工具**，按功能分为 13 个主要类别：

1. [场景操作工具 (Scene Tools)](#1-场景操作工具-scene-tools)
2. [节点操作工具 (Node Tools)](#2-节点操作工具-node-tools)
3. [组件管理工具 (Component Tools)](#3-组件管理工具-component-tools)
4. [预制体操作工具 (Prefab Tools)](#4-预制体操作工具-prefab-tools)
5. [项目控制工具 (Project Tools)](#5-项目控制工具-project-tools)
6. [调试工具 (Debug Tools)](#6-调试工具-debug-tools)
7. [偏好设置工具 (Preferences Tools)](#7-偏好设置工具-preferences-tools)
8. [服务器工具 (Server Tools)](#8-服务器工具-server-tools)
9. [广播工具 (Broadcast Tools)](#9-广播工具-broadcast-tools)
10. [高级资源工具 (Asset Advanced Tools)](#10-高级资源工具-asset-advanced-tools)
11. [参考图像工具 (Reference Image Tools)](#11-参考图像工具-reference-image-tools)
12. [高级场景工具 (Scene Advanced Tools)](#12-高级场景工具-scene-advanced-tools)
13. [场景视图工具 (Scene View Tools)](#13-场景视图工具-scene-view-tools)

---

## 1. 场景操作工具 (Scene Tools)

### 1.1 scene_get_current_scene
获取当前场景信息

**参数**: 无

**返回**: 当前场景的名称、UUID、类型、激活状态和节点数量

**示例**:
```json
{
  "tool": "scene_get_current_scene",
  "arguments": {}
}
```

### 1.2 scene_get_scene_list
获取项目中所有场景列表

**参数**: 无

**返回**: 项目中所有场景的列表，包括名称、路径和UUID

**示例**:
```json
{
  "tool": "scene_get_scene_list",
  "arguments": {}
}
```

### 1.3 scene_open_scene
通过路径打开场景

**参数**:
- `scenePath` (string, 必需): 场景文件路径

**示例**:
```json
{
  "tool": "scene_open_scene",
  "arguments": {
    "scenePath": "db://assets/scenes/GameScene.scene"
  }
}
```

### 1.4 scene_save_scene
保存当前场景

**参数**: 无

**示例**:
```json
{
  "tool": "scene_save_scene",
  "arguments": {}
}
```

### 1.5 scene_create_scene
创建新场景资源

**参数**:
- `sceneName` (string, 必需): 新场景的名称
- `savePath` (string, 必需): 保存场景的路径

**示例**:
```json
{
  "tool": "scene_create_scene",
  "arguments": {
    "sceneName": "NewLevel",
    "savePath": "db://assets/scenes/NewLevel.scene"
  }
}
```

### 1.6 scene_save_scene_as
将场景另存为新文件

**参数**:
- `path` (string, 必需): 保存场景的路径

**示例**:
```json
{
  "tool": "scene_save_scene_as",
  "arguments": {
    "path": "db://assets/scenes/GameScene_Copy.scene"
  }
}
```

### 1.7 scene_close_scene
关闭当前场景

**参数**: 无

**示例**:
```json
{
  "tool": "scene_close_scene",
  "arguments": {}
}
```

### 1.8 scene_get_scene_hierarchy
获取当前场景的完整层级结构

**参数**:
- `includeComponents` (boolean, 可选): 是否包含组件信息，默认为 false

**示例**:
```json
{
  "tool": "scene_get_scene_hierarchy",
  "arguments": {
    "includeComponents": true
  }
}
```

---

## 2. 节点操作工具 (Node Tools)

### 2.1 node_create_node
在场景中创建新节点

**参数**:
- `name` (string, 必需): 节点名称
- `parentUuid` (string, **强烈建议**): 父节点UUID。**重要**：强烈建议始终提供此参数。使用 `get_current_scene` 或 `get_all_nodes` 查找父节点UUID。如果不提供，节点将在场景根节点创建。
- `nodeType` (string, 可选): 节点类型，可选值：`Node`、`2DNode`、`3DNode`，默认为 `Node`
- `siblingIndex` (number, 可选): 同级索引，-1 表示添加到末尾，默认为 -1

**重要提示**: 为了确保节点创建在预期位置，请始终提供 `parentUuid` 参数。您可以通过以下方式获取父节点UUID：
- 使用 `scene_get_current_scene` 获取场景根节点UUID
- 使用 `node_get_all_nodes` 查看所有节点及其UUID
- 使用 `node_find_node_by_name` 查找特定节点的UUID

**示例**:
```json
{
  "tool": "node_create_node",
  "arguments": {
    "name": "PlayerNode",
    "nodeType": "2DNode",
    "parentUuid": "parent-uuid-here"
  }
}
```

### 2.2 node_get_node_info
通过UUID获取节点信息

**参数**:
- `uuid` (string, 必需): 节点UUID

**示例**:
```json
{
  "tool": "node_get_node_info",
  "arguments": {
    "uuid": "node-uuid-here"
  }
}
```

### 2.3 node_find_nodes
按名称模式查找节点

**参数**:
- `pattern` (string, 必需): 搜索的名称模式
- `exactMatch` (boolean, 可选): 是否精确匹配，默认为 false

**示例**:
```json
{
  "tool": "node_find_nodes",
  "arguments": {
    "pattern": "Enemy",
    "exactMatch": false
  }
}
```

### 2.4 node_find_node_by_name
通过精确名称查找第一个节点

**参数**:
- `name` (string, 必需): 要查找的节点名称

**示例**:
```json
{
  "tool": "node_find_node_by_name",
  "arguments": {
    "name": "Player"
  }
}
```

### 2.5 node_get_all_nodes
获取场景中所有节点及其UUID

**参数**: 无

**示例**:
```json
{
  "tool": "node_get_all_nodes",
  "arguments": {}
}
```

### 2.6 node_set_node_property
设置节点属性值

**参数**:
- `uuid` (string, 必需): 节点UUID
- `property` (string, 必需): 属性名称（如 position、rotation、scale、active）
- `value` (any, 必需): 属性值

**示例**:
```json
{
  "tool": "node_set_node_property",
  "arguments": {
    "uuid": "node-uuid-here",
    "property": "position",
    "value": {"x": 100, "y": 200, "z": 0}
  }
}
```

### 2.7 node_delete_node
从场景中删除节点

**参数**:
- `uuid` (string, 必需): 要删除的节点UUID

**示例**:
```json
{
  "tool": "node_delete_node",
  "arguments": {
    "uuid": "node-uuid-here"
  }
}
```

### 2.8 node_move_node
将节点移动到新的父节点

**参数**:
- `nodeUuid` (string, 必需): 要移动的节点UUID
- `newParentUuid` (string, 必需): 新父节点UUID
- `siblingIndex` (number, 可选): 新父节点中的同级索引，默认为 -1

**示例**:
```json
{
  "tool": "node_move_node",
  "arguments": {
    "nodeUuid": "node-uuid-here",
    "newParentUuid": "parent-uuid-here",
    "siblingIndex": 0
  }
}
```

### 2.9 node_duplicate_node
复制节点

**参数**:
- `uuid` (string, 必需): 要复制的节点UUID
- `includeChildren` (boolean, 可选): 是否包含子节点，默认为 true

**示例**:
```json
{
  "tool": "node_duplicate_node",
  "arguments": {
    "uuid": "node-uuid-here",
    "includeChildren": true
  }
}
```

---

## 3. 组件管理工具 (Component Tools)

### 3.1 component_add_component
向指定节点添加组件

**参数**:
- `nodeUuid` (string, **必需**): 目标节点UUID。**重要**：必须指定要添加组件的确切节点。使用 `get_all_nodes` 或 `find_node_by_name` 获取所需节点的UUID。
- `componentType` (string, 必需): 组件类型（如 cc.Sprite、cc.Label、cc.Button）

**重要提示**: 在添加组件之前，请确保：
1. 先使用 `node_get_all_nodes` 或 `node_find_node_by_name` 找到目标节点的UUID
2. 验证节点存在且UUID正确
3. 选择合适的组件类型

**示例**:
```json
{
  "tool": "component_add_component",
  "arguments": {
    "nodeUuid": "node-uuid-here",
    "componentType": "cc.Sprite"
  }
}
```

### 3.2 component_remove_component
从节点移除组件

**参数**:
- `nodeUuid` (string, 必需): 节点UUID
- `componentType` (string, 必需): 要移除的组件类型

**示例**:
```json
{
  "tool": "component_remove_component",
  "arguments": {
    "nodeUuid": "node-uuid-here",
    "componentType": "cc.Sprite"
  }
}
```

### 3.3 component_get_components
获取节点的所有组件

**参数**:
- `nodeUuid` (string, 必需): 节点UUID

**示例**:
```json
{
  "tool": "component_get_components",
  "arguments": {
    "nodeUuid": "node-uuid-here"
  }
}
```

### 3.4 component_get_component_info
获取特定组件信息

**参数**:
- `nodeUuid` (string, 必需): 节点UUID
- `componentType` (string, 必需): 要获取信息的组件类型

**示例**:
```json
{
  "tool": "component_get_component_info",
  "arguments": {
    "nodeUuid": "node-uuid-here",
    "componentType": "cc.Sprite"
  }
}
```

### 3.5 component_set_component_property
设置组件属性值

**参数**:
- `nodeUuid` (string, 必需): 节点UUID
- `componentType` (string, 必需): 组件类型
- `property` (string, 必需): 属性名称
- `value` (any, 必需): 属性值

**示例**:
```json
{
  "tool": "component_set_component_property",
  "arguments": {
    "nodeUuid": "node-uuid-here",
    "componentType": "cc.Sprite",
    "property": "spriteFrame",
    "value": "sprite-frame-uuid"
  }
}
```

### 3.6 component_attach_script
向节点附加脚本组件

**参数**:
- `nodeUuid` (string, 必需): 节点UUID
- `scriptPath` (string, 必需): 脚本资源路径

**示例**:
```json
{
  "tool": "component_attach_script",
  "arguments": {
    "nodeUuid": "node-uuid-here",
    "scriptPath": "db://assets/scripts/PlayerController.ts"
  }
}
```

### 3.7 component_get_available_components
获取可用组件类型列表

**参数**:
- `category` (string, 可选): 组件类别过滤器，可选值：`all`、`renderer`、`ui`、`physics`、`animation`、`audio`，默认为 `all`

**示例**:
```json
{
  "tool": "component_get_available_components",
  "arguments": {
    "category": "ui"
  }
}
```

---

## 4. 预制体操作工具 (Prefab Tools)

**⚠️ 已知问题**: 使用标准 Cocos Creator API 进行预制体实例化时，可能无法正确恢复包含子节点的复杂预制体结构。虽然预制体创建功能可以正确保存所有子节点信息，但通过 `create-node` 配合 `assetUuid` 进行的实例化过程存在限制，可能导致实例化的预制体中缺少子节点。

### 4.1 prefab_get_prefab_list
获取项目中所有预制体

**参数**:
- `folder` (string, 可选): 搜索文件夹路径，默认为 `db://assets`

**示例**:
```json
{
  "tool": "prefab_get_prefab_list",
  "arguments": {
    "folder": "db://assets/prefabs"
  }
}
```

### 4.2 prefab_load_prefab
通过路径加载预制体

**参数**:
- `prefabPath` (string, 必需): 预制体资源路径

**示例**:
```json
{
  "tool": "prefab_load_prefab",
  "arguments": {
    "prefabPath": "db://assets/prefabs/Enemy.prefab"
  }
}
```

### 4.3 prefab_instantiate_prefab
在场景中实例化预制体

**参数**:
- `prefabPath` (string, 必需): 预制体资源路径
- `parentUuid` (string, 可选): 父节点UUID
- `position` (object, 可选): 初始位置，包含 x、y、z 属性

**示例**:
```json
{
  "tool": "prefab_instantiate_prefab",
  "arguments": {
    "prefabPath": "db://assets/prefabs/Enemy.prefab",
    "parentUuid": "parent-uuid-here",
    "position": {"x": 100, "y": 200, "z": 0}
  }
}
```

**⚠️ 功能限制**: 包含子节点的复杂预制体可能无法正确实例化。由于 Cocos Creator API 在标准 `create-node` 方法中使用 `assetUuid` 的限制，可能只创建根节点，子节点可能会丢失。这是当前实现的已知问题。

### 4.4 prefab_create_prefab
从节点创建预制体

**参数**:
- `nodeUuid` (string, 必需): 源节点UUID
- `savePath` (string, 必需): 保存预制体的路径
- `prefabName` (string, 必需): 预制体名称

**示例**:
```json
{
  "tool": "prefab_create_prefab",
  "arguments": {
    "nodeUuid": "node-uuid-here",
    "savePath": "db://assets/prefabs/",
    "prefabName": "MyPrefab"
  }
}
```

### 4.5 prefab_create_prefab_from_node
从节点创建预制体（create_prefab 的别名）

**参数**:
- `nodeUuid` (string, 必需): 源节点UUID
- `prefabPath` (string, 必需): 保存预制体的路径

**示例**:
```json
{
  "tool": "prefab_create_prefab_from_node",
  "arguments": {
    "nodeUuid": "node-uuid-here",
    "prefabPath": "db://assets/prefabs/MyPrefab.prefab"
  }
}
```

### 4.6 prefab_update_prefab
更新现有预制体

**参数**:
- `prefabPath` (string, 必需): 预制体资源路径
- `nodeUuid` (string, 必需): 包含更改的节点UUID

**示例**:
```json
{
  "tool": "prefab_update_prefab",
  "arguments": {
    "prefabPath": "db://assets/prefabs/Enemy.prefab",
    "nodeUuid": "node-uuid-here"
  }
}
```

### 4.7 prefab_revert_prefab
将预制体实例恢复为原始状态

**参数**:
- `nodeUuid` (string, 必需): 预制体实例节点UUID

**示例**:
```json
{
  "tool": "prefab_revert_prefab",
  "arguments": {
    "nodeUuid": "prefab-instance-uuid-here"
  }
}
```

### 4.8 prefab_get_prefab_info
获取详细的预制体信息

**参数**:
- `prefabPath` (string, 必需): 预制体资源路径

**示例**:
```json
{
  "tool": "prefab_get_prefab_info",
  "arguments": {
    "prefabPath": "db://assets/prefabs/Enemy.prefab"
  }
}
```

---

## 5. 项目控制工具 (Project Tools)

### 5.1 project_run_project
在预览模式下运行项目

**参数**:
- `platform` (string, 可选): 目标平台，可选值：`browser`、`simulator`、`preview`，默认为 `browser`

**示例**:
```json
{
  "tool": "project_run_project",
  "arguments": {
    "platform": "browser"
  }
}
```

### 5.2 project_build_project
构建项目

**参数**:
- `platform` (string, 必需): 构建平台，可选值：`web-mobile`、`web-desktop`、`ios`、`android`、`windows`、`mac`
- `debug` (boolean, 可选): 是否调试构建，默认为 true

**示例**:
```json
{
  "tool": "project_build_project",
  "arguments": {
    "platform": "web-mobile",
    "debug": false
  }
}
```

### 5.3 project_get_project_info
获取项目信息

**参数**: 无

**示例**:
```json
{
  "tool": "project_get_project_info",
  "arguments": {}
}
```

### 5.4 project_get_project_settings
获取项目设置

**参数**:
- `category` (string, 可选): 设置类别，可选值：`general`、`physics`、`render`、`assets`，默认为 `general`

**示例**:
```json
{
  "tool": "project_get_project_settings",
  "arguments": {
    "category": "physics"
  }
}
```

### 5.5 project_refresh_assets
刷新资源数据库

**参数**:
- `folder` (string, 可选): 要刷新的特定文件夹

**示例**:
```json
{
  "tool": "project_refresh_assets",
  "arguments": {
    "folder": "db://assets/textures"
  }
}
```

### 5.6 project_import_asset
导入资源文件

**参数**:
- `sourcePath` (string, 必需): 源文件路径
- `targetFolder` (string, 必需): 资源中的目标文件夹

**示例**:
```json
{
  "tool": "project_import_asset",
  "arguments": {
    "sourcePath": "/path/to/image.png",
    "targetFolder": "db://assets/textures"
  }
}
```

### 5.7 project_get_asset_info
获取资源信息

**参数**:
- `assetPath` (string, 必需): 资源路径

**示例**:
```json
{
  "tool": "project_get_asset_info",
  "arguments": {
    "assetPath": "db://assets/textures/player.png"
  }
}
```

### 5.8 project_get_assets
按类型获取资源

**参数**:
- `type` (string, 可选): 资源类型过滤器，可选值：`all`、`scene`、`prefab`、`script`、`texture`、`material`、`mesh`、`audio`、`animation`，默认为 `all`
- `folder` (string, 可选): 搜索文件夹，默认为 `db://assets`

**示例**:
```json
{
  "tool": "project_get_assets",
  "arguments": {
    "type": "texture",
    "folder": "db://assets/textures"
  }
}
```

### 5.9 project_get_build_settings
获取构建设置

**参数**: 无

**示例**:
```json
{
  "tool": "project_get_build_settings",
  "arguments": {}
}
```

### 5.10 project_open_build_panel
在编辑器中打开构建面板

**参数**: 无

**示例**:
```json
{
  "tool": "project_open_build_panel",
  "arguments": {}
}
```

### 5.11 project_check_builder_status
检查构建器工作进程是否就绪

**参数**: 无

**示例**:
```json
{
  "tool": "project_check_builder_status",
  "arguments": {}
}
```

### 5.12 project_start_preview_server
启动预览服务器

**参数**:
- `port` (number, 可选): 预览服务器端口，默认为 7456

**示例**:
```json
{
  "tool": "project_start_preview_server",
  "arguments": {
    "port": 8080
  }
}
```

### 5.13 project_stop_preview_server
停止预览服务器

**参数**: 无

**示例**:
```json
{
  "tool": "project_stop_preview_server",
  "arguments": {}
}
```

### 5.14 project_create_asset
创建新的资源文件或文件夹

**参数**:
- `url` (string, 必需): 资源URL
- `content` (string, 可选): 文件内容，null 表示创建文件夹
- `overwrite` (boolean, 可选): 是否覆盖现有文件，默认为 false

**示例**:
```json
{
  "tool": "project_create_asset",
  "arguments": {
    "url": "db://assets/scripts/NewScript.ts",
    "content": "// New TypeScript script\n",
    "overwrite": false
  }
}
```

### 5.15 project_copy_asset
复制资源到另一个位置

**参数**:
- `source` (string, 必需): 源资源URL
- `target` (string, 必需): 目标位置URL
- `overwrite` (boolean, 可选): 是否覆盖现有文件，默认为 false

**示例**:
```json
{
  "tool": "project_copy_asset",
  "arguments": {
    "source": "db://assets/textures/player.png",
    "target": "db://assets/textures/backup/player.png",
    "overwrite": false
  }
}
```

### 5.16 project_move_asset
移动资源到另一个位置

**参数**:
- `source` (string, 必需): 源资源URL
- `target` (string, 必需): 目标位置URL
- `overwrite` (boolean, 可选): 是否覆盖现有文件，默认为 false

**示例**:
```json
{
  "tool": "project_move_asset",
  "arguments": {
    "source": "db://assets/textures/old_player.png",
    "target": "db://assets/textures/player.png",
    "overwrite": true
  }
}
```

### 5.17 project_delete_asset
删除资源

**参数**:
- `url` (string, 必需): 要删除的资源URL

**示例**:
```json
{
  "tool": "project_delete_asset",
  "arguments": {
    "url": "db://assets/textures/unused.png"
  }
}
```

### 5.18 project_save_asset
保存资源内容

**参数**:
- `url` (string, 必需): 资源URL
- `content` (string, 必需): 资源内容

**示例**:
```json
{
  "tool": "project_save_asset",
  "arguments": {
    "url": "db://assets/scripts/GameManager.ts",
    "content": "// Updated script content\n"
  }
}
```

### 5.19 project_reimport_asset
重新导入资源

**参数**:
- `url` (string, 必需): 要重新导入的资源URL

**示例**:
```json
{
  "tool": "project_reimport_asset",
  "arguments": {
    "url": "db://assets/textures/player.png"
  }
}
```

### 5.20 project_query_asset_path
获取资源磁盘路径

**参数**:
- `url` (string, 必需): 资源URL

**示例**:
```json
{
  "tool": "project_query_asset_path",
  "arguments": {
    "url": "db://assets/textures/player.png"
  }
}
```

### 5.21 project_query_asset_uuid
从URL获取资源UUID

**参数**:
- `url` (string, 必需): 资源URL

**示例**:
```json
{
  "tool": "project_query_asset_uuid",
  "arguments": {
    "url": "db://assets/textures/player.png"
  }
}
```

### 5.22 project_query_asset_url
从UUID获取资源URL

**参数**:
- `uuid` (string, 必需): 资源UUID

**示例**:
```json
{
  "tool": "project_query_asset_url",
  "arguments": {
    "uuid": "asset-uuid-here"
  }
}
```

---

## 6. 调试工具 (Debug Tools)

### 6.1 debug_get_console_logs
获取编辑器控制台日志

**参数**:
- `limit` (number, 可选): 要检索的最新日志数量，默认为 100
- `filter` (string, 可选): 按类型过滤日志，可选值：`all`、`log`、`warn`、`error`、`info`，默认为 `all`

**示例**:
```json
{
  "tool": "debug_get_console_logs",
  "arguments": {
    "limit": 50,
    "filter": "error"
  }
}
```

### 6.2 debug_clear_console
清空编辑器控制台

**参数**: 无

**示例**:
```json
{
  "tool": "debug_clear_console",
  "arguments": {}
}
```

### 6.3 debug_execute_script
在场景上下文中执行JavaScript代码

**参数**:
- `script` (string, 必需): 要执行的JavaScript代码

**示例**:
```json
{
  "tool": "debug_execute_script",
  "arguments": {
    "script": "console.log('Hello from MCP!');"
  }
}
```

### 6.4 debug_get_node_tree
获取用于调试的详细节点树

**参数**:
- `rootUuid` (string, 可选): 根节点UUID，如果不提供则使用场景根节点
- `maxDepth` (number, 可选): 最大树深度，默认为 10

**示例**:
```json
{
  "tool": "debug_get_node_tree",
  "arguments": {
    "rootUuid": "root-node-uuid",
    "maxDepth": 5
  }
}
```

### 6.5 debug_get_performance_stats
获取性能统计信息

**参数**: 无

**示例**:
```json
{
  "tool": "debug_get_performance_stats",
  "arguments": {}
}
```

### 6.6 debug_validate_scene
验证当前场景是否有问题

**参数**:
- `checkMissingAssets` (boolean, 可选): 检查缺失的资源引用，默认为 true
- `checkPerformance` (boolean, 可选): 检查性能问题，默认为 true

**示例**:
```json
{
  "tool": "debug_validate_scene",
  "arguments": {
    "checkMissingAssets": true,
    "checkPerformance": true
  }
}
```

### 6.7 debug_get_editor_info
获取编辑器和环境信息

**参数**: 无

**示例**:
```json
{
  "tool": "debug_get_editor_info",
  "arguments": {}
}
```

### 6.8 debug_get_project_logs
从 temp/logs/project.log 文件获取项目日志

**参数**:
- `lines` (number, 可选): 从日志文件末尾读取的行数，默认值为100，范围：1-10000
- `filterKeyword` (string, 可选): 按指定关键词过滤日志
- `logLevel` (string, 可选): 按日志级别过滤，选项：`ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, `ALL`，默认为 `ALL`

**示例**:
```json
{
  "tool": "debug_get_project_logs",
  "arguments": {
    "lines": 200,
    "filterKeyword": "prefab",
    "logLevel": "INFO"
  }
}
```

### 6.9 debug_get_log_file_info
获取项目日志文件信息

**参数**: 无

**返回**: 文件大小、最后修改时间、行数和文件路径信息

**示例**:
```json
{
  "tool": "debug_get_log_file_info",
  "arguments": {}
}
```

### 6.10 debug_search_project_logs
在项目日志中搜索特定模式或错误

**参数**:
- `pattern` (string, 必需): 搜索模式（支持正则表达式）
- `maxResults` (number, 可选): 最大匹配结果数量，默认为20，范围：1-100
- `contextLines` (number, 可选): 匹配结果周围显示的上下文行数，默认为2，范围：0-10

**示例**:
```json
{
  "tool": "debug_search_project_logs",
  "arguments": {
    "pattern": "error|failed|exception",
    "maxResults": 10,
    "contextLines": 3
  }
}
```

---

## 7. 偏好设置工具 (Preferences Tools)

### 7.1 preferences_get_preferences
获取编辑器偏好设置

**参数**:
- `key` (string, 可选): 要获取的特定偏好设置键

**示例**:
```json
{
  "tool": "preferences_get_preferences",
  "arguments": {
    "key": "editor.theme"
  }
}
```

### 7.2 preferences_set_preferences
设置编辑器偏好设置

**参数**:
- `key` (string, 必需): 要设置的偏好设置键
- `value` (any, 必需): 要设置的偏好设置值

**示例**:
```json
{
  "tool": "preferences_set_preferences",
  "arguments": {
    "key": "editor.theme",
    "value": "dark"
  }
}
```

### 7.3 preferences_get_global_preferences
获取全局编辑器偏好设置

**参数**:
- `key` (string, 可选): 要获取的全局偏好设置键

**示例**:
```json
{
  "tool": "preferences_get_global_preferences",
  "arguments": {
    "key": "global.autoSave"
  }
}
```

### 7.4 preferences_set_global_preferences
设置全局编辑器偏好设置

**参数**:
- `key` (string, 必需): 要设置的全局偏好设置键
- `value` (any, 必需): 要设置的全局偏好设置值

**示例**:
```json
{
  "tool": "preferences_set_global_preferences",
  "arguments": {
    "key": "global.autoSave",
    "value": true
  }
}
```

### 7.5 preferences_get_recent_projects
获取最近打开的项目

**参数**: 无

**示例**:
```json
{
  "tool": "preferences_get_recent_projects",
  "arguments": {}
}
```

### 7.6 preferences_clear_recent_projects
清除最近打开的项目列表

**参数**: 无

**示例**:
```json
{
  "tool": "preferences_clear_recent_projects",
  "arguments": {}
}
```

---

## 8. 服务器工具 (Server Tools)

### 8.1 server_get_server_info
获取服务器信息

**参数**: 无

**示例**:
```json
{
  "tool": "server_get_server_info",
  "arguments": {}
}
```

### 8.2 server_broadcast_custom_message
广播自定义消息

**参数**:
- `message` (string, 必需): 消息名称
- `data` (any, 可选): 消息数据

**示例**:
```json
{
  "tool": "server_broadcast_custom_message",
  "arguments": {
    "message": "custom_event",
    "data": {"type": "test", "value": 123}
  }
}
```

### 8.3 server_get_editor_version
获取编辑器版本信息

**参数**: 无

**示例**:
```json
{
  "tool": "server_get_editor_version",
  "arguments": {}
}
```

### 8.4 server_get_project_name
获取当前项目名称

**参数**: 无

**示例**:
```json
{
  "tool": "server_get_project_name",
  "arguments": {}
}
```

### 8.5 server_get_project_path
获取当前项目路径

**参数**: 无

**示例**:
```json
{
  "tool": "server_get_project_path",
  "arguments": {}
}
```

### 8.6 server_get_project_uuid
获取当前项目UUID

**参数**: 无

**示例**:
```json
{
  "tool": "server_get_project_uuid",
  "arguments": {}
}
```

### 8.7 server_restart_editor
请求重启编辑器

**参数**: 无

**示例**:
```json
{
  "tool": "server_restart_editor",
  "arguments": {}
}
```

### 8.8 server_quit_editor
请求退出编辑器

**参数**: 无

**示例**:
```json
{
  "tool": "server_quit_editor",
  "arguments": {}
}
```

---

## 9. 广播工具 (Broadcast Tools)

### 9.1 broadcast_get_broadcast_log
获取最近的广播消息日志

**参数**:
- `limit` (number, 可选): 要返回的最新消息数量，默认为 50
- `messageType` (string, 可选): 按消息类型过滤

**示例**:
```json
{
  "tool": "broadcast_get_broadcast_log",
  "arguments": {
    "limit": 100,
    "messageType": "scene_change"
  }
}
```

### 9.2 broadcast_listen_broadcast
开始监听特定广播消息

**参数**:
- `messageType` (string, 必需): 要监听的消息类型

**示例**:
```json
{
  "tool": "broadcast_listen_broadcast",
  "arguments": {
    "messageType": "node_created"
  }
}
```

### 9.3 broadcast_stop_listening
停止监听特定广播消息

**参数**:
- `messageType` (string, 必需): 要停止监听的消息类型

**示例**:
```json
{
  "tool": "broadcast_stop_listening",
  "arguments": {
    "messageType": "node_created"
  }
}
```

### 9.4 broadcast_clear_broadcast_log
清除广播消息日志

**参数**: 无

**示例**:
```json
{
  "tool": "broadcast_clear_broadcast_log",
  "arguments": {}
}
```

### 9.5 broadcast_get_active_listeners
获取活动广播监听器列表

**参数**: 无

**示例**:
```json
{
  "tool": "broadcast_get_active_listeners",
  "arguments": {}
}
```

---

## 使用须知

### 1. 工具调用格式

所有工具调用都使用 JSON-RPC 2.0 格式：

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "tool_name",
    "arguments": {
      // 工具参数
    }
  },
  "id": 1
}
```

### 2. 常见UUID获取方法

- 使用 `node_get_all_nodes` 获取所有节点UUID
- 使用 `node_find_node_by_name` 按名称查找节点UUID
- 使用 `scene_get_current_scene` 获取场景UUID
- 使用 `prefab_get_prefab_list` 获取预制体信息

### 3. 资源路径格式

Cocos Creator 使用 `db://` 前缀的资源URL格式：
- 场景：`db://assets/scenes/GameScene.scene`
- 预制体：`db://assets/prefabs/Player.prefab`
- 脚本：`db://assets/scripts/GameManager.ts`
- 纹理：`db://assets/textures/player.png`

### 4. 错误处理

如果工具调用失败，会返回错误信息：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32000,
    "message": "Tool execution failed",
    "data": {
      "error": "详细错误信息"
    }
  }
}
```

### 5. 最佳实践

1. **先查询再操作**：在修改节点或组件之前，先使用查询工具获取当前状态
2. **使用UUID**：尽量使用UUID而不是名称来引用节点和资源
3. **错误检查**：始终检查工具调用的返回值，确保操作成功
4. **资源管理**：在删除或移动资源前，确保没有其他地方引用它们
5. **性能考虑**：避免在循环中频繁调用工具，考虑批量操作

---

## 技术支持

如果您在使用过程中遇到问题，可以：

1. 使用 `debug_get_console_logs` 查看详细的错误日志
2. 使用 `debug_validate_scene` 检查场景是否有问题
3. 使用 `debug_get_editor_info` 获取环境信息
4. 检查 MCP 服务器的运行状态和日志

---

*此文档基于 Cocos Creator MCP 服务器 v1.3.0 编写，如有更新请参考最新版本文档。*