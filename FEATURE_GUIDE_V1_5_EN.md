# Cocos Creator MCP Server 1.5.0 Tool Guide

## Overview

This document is the AI-oriented guide for the 1.5.0 tool system.

- Legacy 1.4 reference: [FEATURE_GUIDE_EN.md](FEATURE_GUIDE_EN.md)
- The 1.4 guide is based on the old fine-grained tool surface
- The 1.5 guide is based on 50 unified tools plus the `action` pattern

The goal of 1.5.0 is not to preserve every old tool name. It is to merge frequent editor operations into a smaller, more reusable interface with fewer round trips and less parameter guessing.

## Unified Call Format

All 1.5 tools use the same request shape:

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

## General Rules

- Always pass `action`
- Query identifiers such as `uuid`, `nodeUuid`, `parentUuid`, `assetUuid`, `prefabPath`, and `url` before using them unless the docs explicitly say otherwise
- When creating nodes, pass `parentUuid` whenever possible
- When removing components, prefer the real component type or cid returned by `component_query`
- For resource and prefab operations, prefer `uuid` or `assetUuid` over names
- Event binding and prefab editing are high-risk operations, so inspect the target node and component first

## Recommended Query Order

1. Scene: `scene_management` or `scene_hierarchy`
2. Node: `node_query`
3. Component: `component_query`
4. Asset: `asset_query` or `project_query`
5. Prefab: `prefab_browse`

## Tool Groups

### Scene

- `scene_management`
  Actions: `get_current`, `list`, `open`, `save`, `create`, `save_as`, `close`
- `scene_hierarchy`
  Actions: `get`
- `scene_execution_control`
  Actions: `execute_component_method`, `execute_scene_script`, `restore_prefab`, `soft_reload`, `query_ready`, `query_dirty`
- `scene_snapshot`
  Actions: `create`, `abort`
- `scene_query`
  Actions: `classes`, `components`, `nodes_by_asset_uuid`, `component_has_script`
- `scene_view_control`
  Actions: `change_gizmo_tool`, `change_gizmo_pivot`, `change_gizmo_coordinate`, `change_view_mode`, `set_grid_visible`, `set_icon_gizmo_3d`, `set_icon_gizmo_size`, `focus_camera_on_nodes`, `align_camera_with_view`, `align_view_with_node`, `reset`
- `scene_view_query`
  Actions: `get_status`, `gizmo_tool`, `gizmo_pivot`, `gizmo_view_mode`, `gizmo_coordinate`, `view_mode`, `grid_visible`, `icon_gizmo_3d`, `icon_gizmo_size`
- `scene_undo_manage`
  Actions: `begin`, `end`, `cancel`

### Node

- `node_query`
  Actions: `get_info`, `find`, `find_by_name`, `get_all`, `detect_type`
- `node_lifecycle`
  Actions: `create`, `delete`, `duplicate`
- `node_transform`
  Actions: `set_transform`, `set_property`
- `node_hierarchy`
  Actions: `move`, `copy`, `paste`, `cut`
- `node_clipboard`
  Actions: `copy`, `paste`, `cut`
- `node_property_management`
  Actions: `reset_property`, `reset_transform`, `move_array_element`, `remove_array_element`
- `node_reference`
  Actions: `nodes_by_asset_uuid`, `restore_prefab`

### Component

- `component_manage`
  Actions: `add`, `remove`
- `component_script`
  Actions: `attach`, `detach`
- `component_query`
  Actions: `get_components`, `get_info`
- `component_property`
  Actions: `set`
- `component_event_binding`
  Actions: `get_button_events`, `clear_button_events`, `set_button_events`, `append_button_event`
- `component_available`
  Actions: `list`

### Prefab

- `prefab_browse`
  Actions: `list`, `load`, `info`, `validate`
- `prefab_lifecycle`
  Actions: `create`, `duplicate`
- `prefab_instance`
  Actions: `instantiate`, `revert`, `restore_node`, `restore`
- `prefab_edit`
  Actions: `update`, `revert`
- `prefab_reference`
  Actions: `restore_node`, `nodes_by_asset_uuid`

### Asset and Project

- `asset_manage`
  Actions: `import`, `create`, `copy`, `move`, `delete`, `save`, `reimport`, `open_external`
- `asset_query`
  Actions: `get_info`, `list`, `query_path`, `query_uuid`, `query_url`, `find_by_name`, `details`, `generate_available_url`, `db_ready`
- `asset_analyze`
  Actions: `validate_references`, `dependencies`, `unused`
- `asset_batch`
  Actions: `batch_import`, `batch_delete`, `compress_textures`, `export_manifest`
- `asset_meta`
  Actions: `save_meta`
- `project_manage`
  Actions: `get_info`, `get_settings`, `refresh_assets`
- `project_build_system`
  Actions: `build`, `get_build_settings`, `open_build_panel`, `check_builder_status`
- `project_runtime`
  Actions: `run`, `start_preview_server`, `stop_preview_server`
- `project_asset_system`
  Actions: `import`, `create`, `copy`, `move`, `delete`, `save`, `reimport`
- `project_query`
  Actions: `assets`, `asset_info`, `asset_details`, `asset_path`, `asset_uuid`, `asset_url`, `find_asset_by_name`

### Debug, Preferences, and Server

- `debug_console`
  Actions: `get`, `clear`
- `debug_logs`
  Actions: `get_project_logs`, `get_log_file_info`, `search`
- `debug_execute`
  Actions: `script`
- `debug_scene`
  Actions: `node_tree`, `validate`, `editor_info`
- `debug_performance`
  Actions: `stats`
- `preferences_manage`
  Actions: `open`, `query`, `set`, `get_all`, `reset`, `export`, `import`
- `server_info`
  Actions: `ip_list`, `sorted_ip_list`, `port`, `status`
- `server_network`
  Actions: `connectivity`, `interfaces`
- `server_control`
  Actions: `health`, `settings`, `available_tools`
- `broadcast_message`
  Actions: `get_log`, `listen`, `stop_listening`, `clear_log`, `active_listeners`

### Reference and Helper Tools

- `reference_image_manage`
  Actions: `add`, `remove`, `switch`, `set_data`, `query_config`, `query_current`, `refresh`, `set_position`, `set_scale`, `set_opacity`, `list`, `clear_all`
- `validation_params`
  Actions: `validate_json`, `safe_string`, `format_mcp_request`
- `resource_reference`
  Actions: `nodes_by_asset_uuid`, `asset_dependencies`, `validate_asset_references`
- `tool_registry`
  Actions: `list`, `describe`, `actions`

## High-Frequency Examples

Create a 2D node under a parent:

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

Set a Label string:

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

List available tools from the server itself:

```json
{
  "tool": "tool_registry",
  "arguments": {
    "action": "list"
  }
}
```

Read server metadata:

```json
{
  "tool": "server_control",
  "arguments": {
    "action": "health"
  }
}
```

## Practical Advice

- Start with query tools before mutation tools
- Prefer the smallest action that can complete the task
- Re-query nodes or components after structure-changing operations
- Use `tool_registry` when the agent is unsure which tool or action to call
- Use `server_control.available_tools` to inspect the runtime tool list exposed by the current server
