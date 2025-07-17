# Cocos Creator MCP Server Feature Guide

## Overview

The Cocos Creator MCP Server is a comprehensive Model Context Protocol (MCP) server plugin designed for Cocos Creator 3.8+ that enables AI assistants to interact with the Cocos Creator editor through a standardized protocol.

This document provides detailed information about all available MCP tools and their usage.

## Tool Categories

The MCP server provides **80 tools** organized into 9 main categories:

1. [Scene Tools](#1-scene-tools)
2. [Node Tools](#2-node-tools)
3. [Component Tools](#3-component-tools)
4. [Prefab Tools](#4-prefab-tools)
5. [Project Tools](#5-project-tools)
6. [Debug Tools](#6-debug-tools)
7. [Preferences Tools](#7-preferences-tools)
8. [Server Tools](#8-server-tools)
9. [Broadcast Tools](#9-broadcast-tools)

---

## 1. Scene Tools

### 1.1 scene_get_current_scene
Get current scene information

**Parameters**: None

**Returns**: Current scene name, UUID, type, active state, and node count

**Example**:
```json
{
  "tool": "scene_get_current_scene",
  "arguments": {}
}
```

### 1.2 scene_get_scene_list
Get all scenes in the project

**Parameters**: None

**Returns**: List of all scenes in the project with name, path, and UUID

**Example**:
```json
{
  "tool": "scene_get_scene_list",
  "arguments": {}
}
```

### 1.3 scene_open_scene
Open a scene by path

**Parameters**:
- `scenePath` (string, required): The scene file path

**Example**:
```json
{
  "tool": "scene_open_scene",
  "arguments": {
    "scenePath": "db://assets/scenes/GameScene.scene"
  }
}
```

### 1.4 scene_save_scene
Save current scene

**Parameters**: None

**Example**:
```json
{
  "tool": "scene_save_scene",
  "arguments": {}
}
```

### 1.5 scene_create_scene
Create a new scene asset

**Parameters**:
- `sceneName` (string, required): Name of the new scene
- `savePath` (string, required): Path to save the scene

**Example**:
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
Save scene as new file

**Parameters**:
- `path` (string, required): Path to save the scene

**Example**:
```json
{
  "tool": "scene_save_scene_as",
  "arguments": {
    "path": "db://assets/scenes/GameScene_Copy.scene"
  }
}
```

### 1.7 scene_close_scene
Close current scene

**Parameters**: None

**Example**:
```json
{
  "tool": "scene_close_scene",
  "arguments": {}
}
```

### 1.8 scene_get_scene_hierarchy
Get the complete hierarchy of current scene

**Parameters**:
- `includeComponents` (boolean, optional): Include component information, default is false

**Example**:
```json
{
  "tool": "scene_get_scene_hierarchy",
  "arguments": {
    "includeComponents": true
  }
}
```

---

## 2. Node Tools

### 2.1 node_create_node
Create a new node in the scene

**Parameters**:
- `name` (string, required): Node name
- `parentUuid` (string, optional): Parent node UUID, if not provided, node will be created at current editor selection
- `nodeType` (string, optional): Node type, options: `Node`, `2DNode`, `3DNode`, default is `Node`
- `siblingIndex` (number, optional): Sibling index for ordering, -1 means append at end, default is -1

**Example**:
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
Get node information by UUID

**Parameters**:
- `uuid` (string, required): Node UUID

**Example**:
```json
{
  "tool": "node_get_node_info",
  "arguments": {
    "uuid": "node-uuid-here"
  }
}
```

### 2.3 node_find_nodes
Find nodes by name pattern

**Parameters**:
- `pattern` (string, required): Name pattern to search
- `exactMatch` (boolean, optional): Exact match or partial match, default is false

**Example**:
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
Find first node by exact name

**Parameters**:
- `name` (string, required): Node name to find

**Example**:
```json
{
  "tool": "node_find_node_by_name",
  "arguments": {
    "name": "Player"
  }
}
```

### 2.5 node_get_all_nodes
Get all nodes in the scene with their UUIDs

**Parameters**: None

**Example**:
```json
{
  "tool": "node_get_all_nodes",
  "arguments": {}
}
```

### 2.6 node_set_node_property
Set node property value

**Parameters**:
- `uuid` (string, required): Node UUID
- `property` (string, required): Property name (e.g., position, rotation, scale, active)
- `value` (any, required): Property value

**Example**:
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
Delete a node from scene

**Parameters**:
- `uuid` (string, required): Node UUID to delete

**Example**:
```json
{
  "tool": "node_delete_node",
  "arguments": {
    "uuid": "node-uuid-here"
  }
}
```

### 2.8 node_move_node
Move node to new parent

**Parameters**:
- `nodeUuid` (string, required): Node UUID to move
- `newParentUuid` (string, required): New parent node UUID
- `siblingIndex` (number, optional): Sibling index in new parent, default is -1

**Example**:
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
Duplicate a node

**Parameters**:
- `uuid` (string, required): Node UUID to duplicate
- `includeChildren` (boolean, optional): Include children nodes, default is true

**Example**:
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

## 3. Component Tools

### 3.1 component_add_component
Add a component to a specific node

**Parameters**:
- `nodeUuid` (string, required): Target node UUID
- `componentType` (string, required): Component type (e.g., cc.Sprite, cc.Label, cc.Button)

**Example**:
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
Remove a component from a node

**Parameters**:
- `nodeUuid` (string, required): Node UUID
- `componentType` (string, required): Component type to remove

**Example**:
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
Get all components of a node

**Parameters**:
- `nodeUuid` (string, required): Node UUID

**Example**:
```json
{
  "tool": "component_get_components",
  "arguments": {
    "nodeUuid": "node-uuid-here"
  }
}
```

### 3.4 component_get_component_info
Get specific component information

**Parameters**:
- `nodeUuid` (string, required): Node UUID
- `componentType` (string, required): Component type to get info for

**Example**:
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
Set component property value

**Parameters**:
- `nodeUuid` (string, required): Node UUID
- `componentType` (string, required): Component type
- `property` (string, required): Property name
- `value` (any, required): Property value

**Example**:
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
Attach a script component to a node

**Parameters**:
- `nodeUuid` (string, required): Node UUID
- `scriptPath` (string, required): Script asset path

**Example**:
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
Get list of available component types

**Parameters**:
- `category` (string, optional): Component category filter, options: `all`, `renderer`, `ui`, `physics`, `animation`, `audio`, default is `all`

**Example**:
```json
{
  "tool": "component_get_available_components",
  "arguments": {
    "category": "ui"
  }
}
```

---

## 4. Prefab Tools

### 4.1 prefab_get_prefab_list
Get all prefabs in the project

**Parameters**:
- `folder` (string, optional): Folder path to search, default is `db://assets`

**Example**:
```json
{
  "tool": "prefab_get_prefab_list",
  "arguments": {
    "folder": "db://assets/prefabs"
  }
}
```

### 4.2 prefab_load_prefab
Load a prefab by path

**Parameters**:
- `prefabPath` (string, required): Prefab asset path

**Example**:
```json
{
  "tool": "prefab_load_prefab",
  "arguments": {
    "prefabPath": "db://assets/prefabs/Enemy.prefab"
  }
}
```

### 4.3 prefab_instantiate_prefab
Instantiate a prefab in the scene

**Parameters**:
- `prefabPath` (string, required): Prefab asset path
- `parentUuid` (string, optional): Parent node UUID
- `position` (object, optional): Initial position with x, y, z properties

**Example**:
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

### 4.4 prefab_create_prefab
Create a prefab from a node

**Parameters**:
- `nodeUuid` (string, required): Source node UUID
- `savePath` (string, required): Path to save the prefab
- `prefabName` (string, required): Prefab name

**Example**:
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
Create a prefab from a node (alias for create_prefab)

**Parameters**:
- `nodeUuid` (string, required): Source node UUID
- `prefabPath` (string, required): Path to save the prefab

**Example**:
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
Update an existing prefab

**Parameters**:
- `prefabPath` (string, required): Prefab asset path
- `nodeUuid` (string, required): Node UUID with changes

**Example**:
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
Revert prefab instance to original

**Parameters**:
- `nodeUuid` (string, required): Prefab instance node UUID

**Example**:
```json
{
  "tool": "prefab_revert_prefab",
  "arguments": {
    "nodeUuid": "prefab-instance-uuid-here"
  }
}
```

### 4.8 prefab_get_prefab_info
Get detailed prefab information

**Parameters**:
- `prefabPath` (string, required): Prefab asset path

**Example**:
```json
{
  "tool": "prefab_get_prefab_info",
  "arguments": {
    "prefabPath": "db://assets/prefabs/Enemy.prefab"
  }
}
```

---

## 5. Project Tools

### 5.1 project_run_project
Run the project in preview mode

**Parameters**:
- `platform` (string, optional): Target platform, options: `browser`, `simulator`, `preview`, default is `browser`

**Example**:
```json
{
  "tool": "project_run_project",
  "arguments": {
    "platform": "browser"
  }
}
```

### 5.2 project_build_project
Build the project

**Parameters**:
- `platform` (string, required): Build platform, options: `web-mobile`, `web-desktop`, `ios`, `android`, `windows`, `mac`
- `debug` (boolean, optional): Debug build, default is true

**Example**:
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
Get project information

**Parameters**: None

**Example**:
```json
{
  "tool": "project_get_project_info",
  "arguments": {}
}
```

### 5.4 project_get_project_settings
Get project settings

**Parameters**:
- `category` (string, optional): Settings category, options: `general`, `physics`, `render`, `assets`, default is `general`

**Example**:
```json
{
  "tool": "project_get_project_settings",
  "arguments": {
    "category": "physics"
  }
}
```

### 5.5 project_refresh_assets
Refresh asset database

**Parameters**:
- `folder` (string, optional): Specific folder to refresh

**Example**:
```json
{
  "tool": "project_refresh_assets",
  "arguments": {
    "folder": "db://assets/textures"
  }
}
```

### 5.6 project_import_asset
Import an asset file

**Parameters**:
- `sourcePath` (string, required): Source file path
- `targetFolder` (string, required): Target folder in assets

**Example**:
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
Get asset information

**Parameters**:
- `assetPath` (string, required): Asset path

**Example**:
```json
{
  "tool": "project_get_asset_info",
  "arguments": {
    "assetPath": "db://assets/textures/player.png"
  }
}
```

### 5.8 project_get_assets
Get assets by type

**Parameters**:
- `type` (string, optional): Asset type filter, options: `all`, `scene`, `prefab`, `script`, `texture`, `material`, `mesh`, `audio`, `animation`, default is `all`
- `folder` (string, optional): Folder to search in, default is `db://assets`

**Example**:
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
Get build settings

**Parameters**: None

**Example**:
```json
{
  "tool": "project_get_build_settings",
  "arguments": {}
}
```

### 5.10 project_open_build_panel
Open the build panel in the editor

**Parameters**: None

**Example**:
```json
{
  "tool": "project_open_build_panel",
  "arguments": {}
}
```

### 5.11 project_check_builder_status
Check if builder worker is ready

**Parameters**: None

**Example**:
```json
{
  "tool": "project_check_builder_status",
  "arguments": {}
}
```

### 5.12 project_start_preview_server
Start preview server

**Parameters**:
- `port` (number, optional): Preview server port, default is 7456

**Example**:
```json
{
  "tool": "project_start_preview_server",
  "arguments": {
    "port": 8080
  }
}
```

### 5.13 project_stop_preview_server
Stop preview server

**Parameters**: None

**Example**:
```json
{
  "tool": "project_stop_preview_server",
  "arguments": {}
}
```

### 5.14 project_create_asset
Create a new asset file or folder

**Parameters**:
- `url` (string, required): Asset URL
- `content` (string, optional): File content, null for folder
- `overwrite` (boolean, optional): Overwrite existing file, default is false

**Example**:
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
Copy an asset to another location

**Parameters**:
- `source` (string, required): Source asset URL
- `target` (string, required): Target location URL
- `overwrite` (boolean, optional): Overwrite existing file, default is false

**Example**:
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
Move an asset to another location

**Parameters**:
- `source` (string, required): Source asset URL
- `target` (string, required): Target location URL
- `overwrite` (boolean, optional): Overwrite existing file, default is false

**Example**:
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
Delete an asset

**Parameters**:
- `url` (string, required): Asset URL to delete

**Example**:
```json
{
  "tool": "project_delete_asset",
  "arguments": {
    "url": "db://assets/textures/unused.png"
  }
}
```

### 5.18 project_save_asset
Save asset content

**Parameters**:
- `url` (string, required): Asset URL
- `content` (string, required): Asset content

**Example**:
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
Reimport an asset

**Parameters**:
- `url` (string, required): Asset URL to reimport

**Example**:
```json
{
  "tool": "project_reimport_asset",
  "arguments": {
    "url": "db://assets/textures/player.png"
  }
}
```

### 5.20 project_query_asset_path
Get asset disk path

**Parameters**:
- `url` (string, required): Asset URL

**Example**:
```json
{
  "tool": "project_query_asset_path",
  "arguments": {
    "url": "db://assets/textures/player.png"
  }
}
```

### 5.21 project_query_asset_uuid
Get asset UUID from URL

**Parameters**:
- `url` (string, required): Asset URL

**Example**:
```json
{
  "tool": "project_query_asset_uuid",
  "arguments": {
    "url": "db://assets/textures/player.png"
  }
}
```

### 5.22 project_query_asset_url
Get asset URL from UUID

**Parameters**:
- `uuid` (string, required): Asset UUID

**Example**:
```json
{
  "tool": "project_query_asset_url",
  "arguments": {
    "uuid": "asset-uuid-here"
  }
}
```

---

## 6. Debug Tools

### 6.1 debug_get_console_logs
Get editor console logs

**Parameters**:
- `limit` (number, optional): Number of recent logs to retrieve, default is 100
- `filter` (string, optional): Filter logs by type, options: `all`, `log`, `warn`, `error`, `info`, default is `all`

**Example**:
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
Clear editor console

**Parameters**: None

**Example**:
```json
{
  "tool": "debug_clear_console",
  "arguments": {}
}
```

### 6.3 debug_execute_script
Execute JavaScript in scene context

**Parameters**:
- `script` (string, required): JavaScript code to execute

**Example**:
```json
{
  "tool": "debug_execute_script",
  "arguments": {
    "script": "console.log('Hello from MCP!');"
  }
}
```

### 6.4 debug_get_node_tree
Get detailed node tree for debugging

**Parameters**:
- `rootUuid` (string, optional): Root node UUID, uses scene root if not provided
- `maxDepth` (number, optional): Maximum tree depth, default is 10

**Example**:
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
Get performance statistics

**Parameters**: None

**Example**:
```json
{
  "tool": "debug_get_performance_stats",
  "arguments": {}
}
```

### 6.6 debug_validate_scene
Validate current scene for issues

**Parameters**:
- `checkMissingAssets` (boolean, optional): Check for missing asset references, default is true
- `checkPerformance` (boolean, optional): Check for performance issues, default is true

**Example**:
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
Get editor and environment information

**Parameters**: None

**Example**:
```json
{
  "tool": "debug_get_editor_info",
  "arguments": {}
}
```

---

## 7. Preferences Tools

### 7.1 preferences_get_preferences
Get editor preferences

**Parameters**:
- `key` (string, optional): Specific preference key to get

**Example**:
```json
{
  "tool": "preferences_get_preferences",
  "arguments": {
    "key": "editor.theme"
  }
}
```

### 7.2 preferences_set_preferences
Set editor preferences

**Parameters**:
- `key` (string, required): Preference key to set
- `value` (any, required): Preference value to set

**Example**:
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
Get global editor preferences

**Parameters**:
- `key` (string, optional): Global preference key to get

**Example**:
```json
{
  "tool": "preferences_get_global_preferences",
  "arguments": {
    "key": "global.autoSave"
  }
}
```

### 7.4 preferences_set_global_preferences
Set global editor preferences

**Parameters**:
- `key` (string, required): Global preference key to set
- `value` (any, required): Global preference value to set

**Example**:
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
Get recently opened projects

**Parameters**: None

**Example**:
```json
{
  "tool": "preferences_get_recent_projects",
  "arguments": {}
}
```

### 7.6 preferences_clear_recent_projects
Clear recently opened projects list

**Parameters**: None

**Example**:
```json
{
  "tool": "preferences_clear_recent_projects",
  "arguments": {}
}
```

---

## 8. Server Tools

### 8.1 server_get_server_info
Get server information

**Parameters**: None

**Example**:
```json
{
  "tool": "server_get_server_info",
  "arguments": {}
}
```

### 8.2 server_broadcast_custom_message
Broadcast a custom message

**Parameters**:
- `message` (string, required): Message name
- `data` (any, optional): Message data

**Example**:
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
Get editor version information

**Parameters**: None

**Example**:
```json
{
  "tool": "server_get_editor_version",
  "arguments": {}
}
```

### 8.4 server_get_project_name
Get current project name

**Parameters**: None

**Example**:
```json
{
  "tool": "server_get_project_name",
  "arguments": {}
}
```

### 8.5 server_get_project_path
Get current project path

**Parameters**: None

**Example**:
```json
{
  "tool": "server_get_project_path",
  "arguments": {}
}
```

### 8.6 server_get_project_uuid
Get current project UUID

**Parameters**: None

**Example**:
```json
{
  "tool": "server_get_project_uuid",
  "arguments": {}
}
```

### 8.7 server_restart_editor
Request to restart the editor

**Parameters**: None

**Example**:
```json
{
  "tool": "server_restart_editor",
  "arguments": {}
}
```

### 8.8 server_quit_editor
Request to quit the editor

**Parameters**: None

**Example**:
```json
{
  "tool": "server_quit_editor",
  "arguments": {}
}
```

---

## 9. Broadcast Tools

### 9.1 broadcast_get_broadcast_log
Get recent broadcast messages log

**Parameters**:
- `limit` (number, optional): Number of recent messages to return, default is 50
- `messageType` (string, optional): Filter by message type

**Example**:
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
Start listening for specific broadcast messages

**Parameters**:
- `messageType` (string, required): Message type to listen for

**Example**:
```json
{
  "tool": "broadcast_listen_broadcast",
  "arguments": {
    "messageType": "node_created"
  }
}
```

### 9.3 broadcast_stop_listening
Stop listening for specific broadcast messages

**Parameters**:
- `messageType` (string, required): Message type to stop listening for

**Example**:
```json
{
  "tool": "broadcast_stop_listening",
  "arguments": {
    "messageType": "node_created"
  }
}
```

### 9.4 broadcast_clear_broadcast_log
Clear the broadcast messages log

**Parameters**: None

**Example**:
```json
{
  "tool": "broadcast_clear_broadcast_log",
  "arguments": {}
}
```

### 9.5 broadcast_get_active_listeners
Get list of active broadcast listeners

**Parameters**: None

**Example**:
```json
{
  "tool": "broadcast_get_active_listeners",
  "arguments": {}
}
```

---

## Usage Guidelines

### 1. Tool Call Format

All tool calls use JSON-RPC 2.0 format:

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "tool_name",
    "arguments": {
      // Tool parameters
    }
  },
  "id": 1
}
```

### 2. Common UUID Retrieval Methods

- Use `node_get_all_nodes` to get all node UUIDs
- Use `node_find_node_by_name` to find node UUID by name
- Use `scene_get_current_scene` to get scene UUID
- Use `prefab_get_prefab_list` to get prefab information

### 3. Asset Path Format

Cocos Creator uses `db://` prefixed asset URL format:
- Scenes: `db://assets/scenes/GameScene.scene`
- Prefabs: `db://assets/prefabs/Player.prefab`
- Scripts: `db://assets/scripts/GameManager.ts`
- Textures: `db://assets/textures/player.png`

### 4. Error Handling

If a tool call fails, it will return error information:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32000,
    "message": "Tool execution failed",
    "data": {
      "error": "Detailed error message"
    }
  }
}
```

### 5. Best Practices

1. **Query Before Modify**: Use query tools to get current state before modifying nodes or components
2. **Use UUIDs**: Prefer using UUIDs over names to reference nodes and assets
3. **Error Checking**: Always check tool call return values to ensure operations succeeded
4. **Asset Management**: Ensure no references exist before deleting or moving assets
5. **Performance Considerations**: Avoid frequent tool calls in loops, consider batch operations

---

## Technical Support

If you encounter issues while using the tools, you can:

1. Use `debug_get_console_logs` to view detailed error logs
2. Use `debug_validate_scene` to check for scene issues
3. Use `debug_get_editor_info` to get environment information
4. Check the MCP server's running status and logs

---

*This document is based on Cocos Creator MCP Server v1.0.0. Please refer to the latest version documentation for updates.*