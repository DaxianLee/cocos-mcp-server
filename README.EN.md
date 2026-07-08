# Cocos Creator MCP Server Plugin

🌐 [简体中文](README.md) · **English** · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português](README.pt.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md)

A comprehensive MCP (Model Context Protocol) server plugin for Cocos Creator 3.8+ that lets AI assistants interact with the Cocos Creator editor through a standardized protocol. One-click installation and use — no tedious environment setup or configuration required. Tested with the Claude desktop client, Claude CLI, and Cursor; other editors should theoretically work perfectly as well.

**🚀 Now offering 50 powerful, consolidated tools for 99% editor control!**

## The PRO version has been updated to 1.7.8

| Type | Link |
|------|------|
| **Video Preview** | [Bilibili Video](https://www.bilibili.com/video/BV1rTAXzuEH3/) |
| **Free Trial** | [VberAI Cocos Creator 3.x MCP Pro Trial](https://www.vberai.com/game-engines/cocos) |
| **Free Trial** | [VberAI Cocos Creator 2.x MCP Pro Trial](https://www.vberai.com/game-engines/cocos2x) |
| **AI Design Canvas** | [VberAI Studio — The World's First AI-Native Design Platform for Games](https://studio.vberai.com) |
| **Official Website** | [VberAI Official Website vberai.com](https://www.vberai.com) |

## Cocos MCP 3.x Pro Edition Features

> 🚀 The Pro edition is built and continuously maintained by **VberAI** — [Try the Pro Edition Now](https://www.vberai.com/game-engines/cocos) ｜ [Watch the Video Demo](https://www.bilibili.com/video/BV1rTAXzuEH3/)

A professional-grade MCP (Model Context Protocol) plugin built for **Cocos Creator 3.8.6+**, giving AI assistants direct control over the editor through a standardized protocol. **16 intent-level tools** cover **231 operations** across **12 major capability modules**, spanning the entire Cocos Creator 3.x development workflow. Built on the Streamable HTTP protocol with a token-optimized design for lower token usage and more stable calls, with one-click configuration support for mainstream AI clients (Cursor, Claude, Windsurf, etc.).

| Intent-Level Tools | Operations Covered | Modules Covered | Communication Protocol |
|:---:|:---:|:---:|:---:|
| **16** | **231** | **12 Major Modules** | **Streamable HTTP** |

### Twelve Capability Modules

| Module | Operations | Description |
|------|---:|------|
| Scene Management | 24 | Opening, saving, creating, and switching scenes; hierarchy queries and snapshots; supports undo operations and script execution. |
| Node Operations | 18 | Full CRUD for nodes, with support for batch modification, script attachment, node type detection, and clipboard operations. |
| Component System | 8 | Add/remove/query/modify components and set properties; supports click event binding and batch event configuration. |
| Prefab System | 13 | Prefab creation, instantiation, and edit-mode switching; supports applying/reverting changes and prefab validation. |
| Asset Management | 19 | Asset querying, searching, CRUD, and import; supports dependency analysis and UUID/path conversion. |
| Editor Control | 33 | Editor-level operations such as project settings, logs, preferences, building, and preview. |
| Scene View | 32 | Gizmo, camera, grid, and reference images, providing viewport context and boundary-aware control. |
| UI & Template Building | 13 | One-click creation of UI components; build complete node hierarchies from a JSON tree; built-in UI templates. |
| Animation System | 39 | Keyframe editing, curve adjustment, animation events, preset application, and Spine skeletal animation management. |
| Knowledge Base Queries | 8 | A built-in knowledge base covering component properties, UI design rules, layout patterns, and best practices, giving AI precise development assistance. |
| Validation & Snapshots | 6 | Scene layout checks, asset reference validation, and hierarchy analysis, together with scene snapshots for regression checking. |
| Fonts & Labels | 9 | Font asset management and rich-text Label operations, covering text typography settings. |

#### Smart Features

- **Smart Path Resolution** — All node parameters accept a UUID, a path (e.g. `Canvas/Panel/Button`), or a name, and are resolved automatically
- **Automatic UI Detection** — Automatically adds `cc.UITransform` when creating a node under a UI parent node
- **Viewport Context** — Returns the design resolution and visible range when creating/modifying nodes, with automatic warnings when out of bounds
- **Built-in Knowledge Base** — AI can query component property tables, coordinate system rules, layout patterns, and other knowledge
- **Scene Builder** — Describe a complete UI hierarchy in JSON and build it in a single call, with automatic handling of Canvas/Camera/component configuration
- **Reference Image System** — Overlay UI design mockups on the scene view so AI can build interfaces while looking at the design
- **Node Tree Caching** — A 2-second TTL cache avoids redundant queries and is automatically invalidated after change operations
- **Atomic Operations** — builder/composite use a snapshot mechanism that automatically rolls back on failure

### Pro Edition vs. Open-Source Edition

| Feature | Open-Source Edition | Pro Edition |
|------|:---:|:---:|
| Communication Protocol | HTTP protocol | **Streamable HTTP** |
| Token Optimization | Basic design | Optimized design, lower token usage and more stable |
| Opcode Method | ✕ | ✅ |
| One-Click Configuration | ✕ | ✅ |
| Tool Customization | ✕ | ✅ |
| Intent-Recognition-Level Tools | Basic tools | 16 tools, covering 231 operations |
| One-Shot Scene Creation | ✕ | ✅ |
| Built-in Knowledge Base | ✕ | ✅ |
| Animation / Spine System | ✕ | ✅ 39 animation operations |

---

## 🌐 About VberAI — AI-Native Game Production Platform

**VberAI** is an **AI-native game production platform** for game developers, art teams, and content teams, and is the developer and maintainer of the Pro edition of this Cocos MCP plugin. VberAI is currently the **only vendor providing MCP plugins for all three mainstream engines — Unity, Godot, and Cocos Creator** — simultaneously, building three product lines around the mission of "truly integrating AI into the game production pipeline":

- **🎮 Game Engine MCP Plugins** — Run an MCP service inside the engine editor, letting AI clients such as Claude Desktop, Claude Code, Cursor, Windsurf, and Cline directly read and manipulate scenes, components, assets, animations, and scripts.
- **🎨 AI Studio** — An AI-native game design canvas: import PSD / Figma / engine projects on one side, and export Unity / Cocos / Godot scenes and prefabs on the other.
- **✂️ AI Super Matting** — Browser-based one-click background removal with hair-strand-level precision and true alpha-channel output, billed on a pay-as-you-go basis.

### Engine MCP Plugin Family

| Plugin | Description |
|------|------|
| **Unity MCP** | Enterprise-grade MCP plugin covering scenes / GameObjects / components / prefabs / materials / animation / shaders, supporting Unity 2022.3+ and Unity 6 |
| **Cocos MCP 3.x Pro** | The Pro edition of this project — 16 intent-level tools / 231 operations, Cocos Creator 3.8.6+, Streamable HTTP |
| **Cocos MCP 2.x Pro** | Purpose-built for legacy Cocos Creator 2.4.x+ projects (2.x titles still live in production) |
| **Godot MCP** | Completely free and MIT open-source, with 100+ tool commands covering 21 systems, for Godot 4.x, compatible with GDScript and C# |


---

## 🎨 VberAI Studio — The World's First AI-Native Design Platform for Games

> **An AI-native design platform built for games.** Compatible with the Unity, Cocos, and Godot engines from the ground up, with a wide range of high-frequency AI tools and automated workflows for art generation, one-click re-skinning, asset management, and end-to-end delivery from design mockups to the engine — plus reverse sync back from the engine — completely connecting the full development chain from "AI design → in-engine AI."
>
> 👉 **[Enter AI Studio Now](https://studio.vberai.com)** ｜ [Learn More](https://www.vberai.com/studio)


### Complete Production Pipeline

**Import design and project assets → high-frequency AI generation and editing → componentized engine delivery → real-time sync to the engine via Engine MCP → reverse sync back from the engine**

Working together with this Cocos MCP plugin, AI Studio writes scenes, prefabs, components, and art assets back into the project, after which Engine MCP lets AI continue handling scripting, component configuration, asset management, and debugging inside Cocos Creator — forming an end-to-end development loop that dramatically boosts team efficiency, to the point where a single person can work like an entire team.

**🔗 Related Links**: [VberAI Official Website](https://www.vberai.com) ｜ [AI Studio](https://studio.vberai.com) ｜ [AI Super Matting](https://www.vberai.com/ai-studio/bg-removal) ｜ [Platform Pricing](https://www.vberai.com/pricing) ｜ Contact Support: support@vberai.com

---


## Open-Source Version Changelog

## 🚀 Major Update v1.5.4

## Current Open-Source Version Video Demo

[<img width="503" height="351" alt="视频演示" src="https://github.com/user-attachments/assets/f186ce14-9ffc-4a29-8761-48bdd7c1ea16" />](https://www.bilibili.com/video/BV1mB8dzfEw8?spm_id_from=333.788.recommend_more_video.0&vd_source=6b1ff659dd5f04a92cc6d14061e8bb92)

- **Tool Consolidation & Refactoring**: Condensed the original 150+ tools into 50 highly reusable, high-coverage core tools, removing all dead and redundant code to greatly improve usability and maintainability.
- **Unified Opcodes**: All tools now use an "opcode + parameters" pattern, greatly simplifying the AI calling process, improving AI call success rates, reducing the number of AI calls, and cutting token consumption by 50%.
- **Comprehensive Prefab Upgrade**: Thoroughly fixed and refined all core prefab functionality — creation, instantiation, syncing, and referencing — with support for complex reference relationships, fully aligned with the official format.
- **Event Binding & Legacy Feature Completion**: Added and implemented event binding and other legacy features for nodes/components/assets, with all methods fully aligned with the official implementation.
- **Interface Optimization**: All interface parameters are clearer and better documented, making them easier for AI to understand and call.
- **Plugin Panel Optimization**: A cleaner panel UI with more intuitive operation.
- **Performance & Compatibility Improvements**: A more efficient overall architecture, compatible with all versions of Cocos Creator 3.8.6 and above.


## Tool System & Opcodes

- All tools are named using a "category_operation" convention, with parameters following a unified schema and support for switching between multiple opcodes (`action`), greatly improving flexibility and extensibility.
- The 50 core tools cover the full range of editor operations, including scenes, nodes, components, prefabs, assets, projects, debugging, preferences, the server, and message broadcasting.
- Example tool call:

```json
{
  "tool": "node_lifecycle",
  "arguments": {
    "action": "create",
    "name": "MyNode",
    "parentUuid": "parent-uuid",
    "nodeType": "2DNode"
  }
}
```

---

## Main Feature Categories (Partial Examples)

- **scene_management**: Scene management (get/open/save/create/close scenes)
- **node_query / node_lifecycle / node_transform**: Node querying, creation, deletion, and property changes
- **component_manage / component_script / component_query**: Adding/removing components, attaching scripts, component information
- **prefab_browse / prefab_lifecycle / prefab_instance**: Prefab browsing, creation, instantiation, syncing
- **asset_manage / asset_analyze**: Asset import, deletion, dependency analysis
- **project_manage / project_build_system**: Running and building the project, configuration information
- **debug_console / debug_logs**: Console and log management
- **preferences_manage**: Preferences
- **server_info**: Server information
- **broadcast_message**: Message broadcasting


### v1.4.0 - July 26, 2025

#### 🎯 Major Feature Fixes
- **Completely Fixed Prefab Creation**: Thoroughly resolved the issue of component/node/asset type references being lost during prefab creation
- **Correct Reference Handling**: Implemented a reference format fully consistent with manually created prefabs
  - **Internal References**: Node and component references inside the prefab are correctly converted to the `{"__id__": x}` format
  - **External References**: Node and component references outside the prefab are correctly set to `null`
  - **Asset References**: References to prefabs, textures, sprite frames, and other assets fully preserve the UUID format
- **Standardized Component/Script Removal API**: Removing a component/script now requires passing the component's cid (the `type` field) — the script name or class name can no longer be used. AI and users should first call `getComponents` to get the `type` field (cid), then pass it to `removeComponent`. This ensures 100% accurate removal of all component and script types and is compatible with all Cocos Creator versions.

#### 🔧 Core Improvements
- **Index Order Optimization**: Adjusted the prefab object creation order to ensure consistency with the standard Cocos Creator format
- **Component Type Support**: Extended component reference detection to support all component types prefixed with cc. (Label, Button, Sprite, etc.)
- **UUID Mapping Mechanism**: Refined the internal UUID-to-index mapping system to ensure reference relationships are correctly established
- **Property Format Standardization**: Fixed component property order and format, eliminating engine parsing errors

#### 🐛 Bug Fixes
- **Fixed Prefab Import Error**: Resolved the `Cannot read properties of undefined (reading '_name')` error
- **Fixed Engine Compatibility**: Resolved the `placeHolder.initDefault is not a function` error
- **Fixed Property Overwriting**: Prevented critical properties such as `_objFlags` from being overwritten by component data
- **Fixed Reference Loss**: Ensured references of all types are correctly saved and loaded

#### 📈 Feature Enhancements
- **Complete Component Property Preservation**: All component properties are preserved, including private properties (such as `_group`, `_density`, etc.)
- **Child Node Structure Support**: Correctly handles prefab hierarchy structures and parent-child relationships
- **Transform Property Handling**: Preserves node position, rotation, scale, and hierarchy information
- **Debug Information Optimization**: Added detailed reference-handling logs to make issue tracking easier

#### 💡 Technical Breakthroughs
- **Reference Type Recognition**: Intelligently distinguishes between internal and external references to avoid invalid references
- **Format Compatibility**: Generated prefabs are 100% compatible with the format of manually created prefabs
- **Engine Integration**: Prefabs can be attached to scenes normally with no runtime errors whatsoever
- **Performance Optimization**: Optimized the prefab creation process, improving processing efficiency for large prefabs

**🎉 Prefab creation is now fully functional, supporting complex component reference relationships and complete prefab structures!**

### v1.3.0 - July 25, 2024

#### 🆕 New Features
- **Integrated Tool Management Panel**: Added comprehensive tool management functionality directly into the main control panel
- **Tool Configuration System**: Implemented selective tool enabling/disabling, with persistent configuration support
- **Dynamic Tool Loading**: Enhanced tool discovery, enabling dynamic loading of all 158 available tools in the MCP server
- **Real-Time Tool State Management**: Added real-time updates for tool counts and status, reflected immediately when a single tool is toggled
- **Configuration Persistence**: Automatically saves and loads tool configuration across editor sessions

#### 🔧 Improvements
- **Unified Panel Interface**: Merged tool management into the main MCP server panel as a tab, eliminating the need for a separate panel
- **Enhanced Server Settings**: Improved server configuration management with better persistence and loading
- **Vue 3 Integration**: Upgraded to the Vue 3 Composition API for better reactivity and performance
- **Better Error Handling**: Added comprehensive error handling, including rollback mechanisms for failed operations
- **Improved UI/UX**: Enhanced visual design with proper separators, distinct block styling, and opaque modal backgrounds

#### 🐛 Bug Fixes
- **Fixed Tool State Persistence**: Resolved an issue where tool state would reset when switching tabs or reopening the panel
- **Fixed Configuration Loading**: Corrected server settings loading issues and message registration issues
- **Fixed Checkbox Interaction**: Resolved checkbox deselection issues and improved responsiveness
- **Fixed Panel Scrolling**: Ensured correct scrolling behavior in the tool management panel
- **Fixed IPC Communication**: Resolved various IPC communication issues between the frontend and backend

#### 🏗️ Technical Improvements
- **Simplified Architecture**: Removed multi-configuration complexity to focus on single-configuration management
- **Better Type Safety**: Enhanced TypeScript type definitions and interfaces
- **Improved Data Sync**: Better synchronization between frontend UI state and the backend tool manager
- **Enhanced Debugging**: Added comprehensive logging and debugging capabilities

#### 📊 Statistics
- **Total Tools**: Increased from 151 to 158 tools
- **Categories**: 13 tool categories, with comprehensive coverage
- **Editor Control**: Achieves 98% editor feature coverage

### v1.2.0 - Previous Version
- Initial release, including 151 tools
- Basic MCP server functionality
- Scene, node, component, and prefab operations
- Project control and debugging tools



## Quick Start

**Claude CLI configuration:**

```
claude mcp add --transport http cocos-creator http://127.0.0.1:3000/mcp (use your own configured port)
```

**Claude client configuration:**

```
{

  "mcpServers": {

		"cocos-creator": {

 		"type": "http",

		"url": "http://127.0.0.1:3000/mcp"

		 }

	  }

}
```

**Cursor or VS-family MCP configuration**

```
{

  "mcpServers": { 

   "cocos-creator": {
      "url": "http://localhost:3000/mcp"
   }
  }

}
```

## Features

### 🎯 Scene Operations (scene_*)
- **scene_management**: Scene management - get the current scene, open/save/create/close scenes, supports scene list queries
- **scene_hierarchy**: Scene hierarchy - get the complete scene structure, with optional inclusion of component information
- **scene_execution_control**: Execution control - execute component methods, scene scripts, and prefab syncing

### 🎮 Node Operations (node_*)
- **node_query**: Node query - find nodes by name/pattern, get node information, detect 2D/3D type
- **node_lifecycle**: Node lifecycle - create/delete nodes, with support for pre-installed components and prefab instantiation
- **node_transform**: Node transform - modify node name, position, rotation, scale, visibility, and other properties
- **node_hierarchy**: Node hierarchy - move, duplicate, and paste nodes, with support for hierarchy structure operations
- **node_clipboard**: Node clipboard - copy/paste/cut node operations
- **node_property_management**: Property management - reset node properties, component properties, and transform properties

### 🔧 Component Operations (component_*)
- **component_manage**: Component management - add/remove engine components (cc.Sprite, cc.Button, etc.)
- **component_script**: Script components - attach/remove custom script components
- **component_query**: Component query - get component lists, detailed information, and available component types
- **set_component_property**: Property setting - set one or multiple component property values

### 📦 Prefab Operations (prefab_*)
- **prefab_browse**: Prefab browsing - list prefabs, view information, validate files
- **prefab_lifecycle**: Prefab lifecycle - create prefabs from nodes, delete prefabs
- **prefab_instance**: Prefab instances - instantiate into the scene, unlink, apply changes, revert to original
- **prefab_edit**: Prefab editing - enter/exit edit mode, save prefabs, test changes

### 🚀 Project Control (project_*)
- **project_manage**: Project management - run the project, build the project, get project information and settings
- **project_build_system**: Build system - control the build panel, check build status, manage the preview server

### 🔍 Debug Tools (debug_*)
- **debug_console**: Console management - get/clear console logs, with support for filtering and limits
- **debug_logs**: Log analysis - read/search/analyze project log files, with support for pattern matching
- **debug_system**: System debugging - get editor information, performance statistics, environment information

### 📁 Asset Management (asset_*)
- **asset_manage**: Asset management - batch import/delete assets, save metadata, generate URLs
- **asset_analyze**: Asset analysis - get dependency relationships, export asset manifests
- **asset_system**: Asset system - refresh assets, query asset database status
- **asset_query**: Asset query - query assets by type/folder, get detailed information
- **asset_operations**: Asset operations - create/copy/move/delete/save/reimport assets

### ⚙️ Preferences (preferences_*)
- **preferences_manage**: Preferences management - get/set editor preferences
- **preferences_global**: Global settings - manage global configuration and system settings

### 🌐 Server & Broadcasting (server_* / broadcast_*)
- **server_info**: Server information - get server status, project details, environment information
- **broadcast_message**: Message broadcasting - listen for and broadcast custom messages

### 🖼️ Reference Images (referenceImage_*)
- **reference_image_manage**: Reference image management - add/remove/manage reference images in the scene view
- **reference_image_view**: Reference image view - control the display and editing of reference images

### 🎨 Scene View (sceneView_*)
- **scene_view_control**: Scene view control - control Gizmo tools, coordinate systems, view modes
- **scene_view_tools**: Scene view tools - manage various scene view tools and options

### ✅ Validation Tools (validation_*)
- **validation_scene**: Scene validation - validate scene integrity, check for missing assets
- **validation_asset**: Asset validation - validate asset references, check asset integrity

### 🛠️ Tool Management
- **Tool Configuration System**: Selectively enable/disable tools, with support for multiple configuration sets
- **Configuration Persistence**: Automatically save and load tool configuration
- **Configuration Import/Export**: Support for importing and exporting tool configuration
- **Real-Time State Management**: Real-time updates and synchronization of tool status

### 🚀 Core Advantages
- **Unified Opcodes**: All tools follow a "category_operation" naming convention, with a unified parameter schema
- **High Reusability**: 50 core tools cover 99% of editor functionality
- **AI-Friendly**: Clear parameters, thorough documentation, simple calling
- **Performance Optimization**: 50% reduction in token consumption, improved AI call success rate
- **Full Compatibility**: 100% aligned with the official Cocos Creator API

## ⚠️ Read Before Installing (Important)

> **Before installing for the first time or upgrading, be sure to delete the two files `mcp-server.json` and `tool-manager.json` from your current project's `settings/` directory, otherwise the plugin's tool list may display incorrectly!**
>
> File paths: `YourProject/settings/mcp-server.json` and `YourProject/settings/tool-manager.json`
> After deleting these two files, simply reopen the plugin panel to restore normal behavior.

## Installation

### 1. Copy the Plugin Files

Copy the entire `cocos-mcp-server` folder into the `extensions` directory of your Cocos Creator project. Alternatively, you can import it directly via the Extension Manager:

```
YourProject/
├── assets/
├── extensions/
│   └── cocos-mcp-server/          <- Place plugin here
│       ├── source/
│       ├── dist/
│       ├── package.json
│       └── ...
├── settings/
└── ...
```

### 2. Install Dependencies

```bash
cd extensions/cocos-mcp-server
npm install
```

### 3. Build the Plugin

```bash
npm run build
```

### 4. Enable the Plugin

1. Restart Cocos Creator or refresh extensions
2. The plugin will appear in the Extensions menu
3. Click `Extension > Cocos MCP Server` to open the control panel

## Usage

### Starting the Server

1. Open the MCP Server panel from `Extension > Cocos MCP Server`
2. Configure the settings:
   - **Port**: The HTTP server port (default: 3000)
   - **Auto-Start**: Automatically start the server when the editor launches
   - **Debug Logging**: Enable verbose logging for development and debugging
   - **Max Connections**: The maximum number of concurrent connections allowed

3. Click "Start Server" to begin accepting connections

### Connecting an AI Assistant

The server exposes an HTTP endpoint at `http://localhost:3000/mcp` (or your configured port).

AI assistants can connect using the MCP protocol and access all available tools.


## Development

### Project Structure
```
cocos-mcp-server/
├── source/                    # TypeScript source files
│   ├── main.ts               # Plugin entry point
│   ├── mcp-server.ts         # MCP server implementation
│   ├── settings.ts           # Settings management
│   ├── types/                # TypeScript type definitions
│   ├── tools/                # Tool implementations
│   │   ├── scene-tools.ts
│   │   ├── node-tools.ts
│   │   ├── component-tools.ts
│   │   ├── prefab-tools.ts
│   │   ├── project-tools.ts
│   │   ├── debug-tools.ts
│   │   ├── preferences-tools.ts
│   │   ├── server-tools.ts
│   │   ├── broadcast-tools.ts
│   │   ├── scene-advanced-tools.ts (integrated into node-tools.ts and scene-tools.ts)
│   │   ├── scene-view-tools.ts
│   │   ├── reference-image-tools.ts
│   │   └── asset-advanced-tools.ts
│   ├── panels/               # UI panel implementation
│   └── test/                 # Test files
├── dist/                     # Compiled JavaScript output
├── static/                   # Static assets (icons, etc.)
├── i18n/                     # Internationalization files
├── package.json              # Plugin configuration
└── tsconfig.json             # TypeScript configuration
```

### Building from Source

```bash
# Install dependencies
npm install

# Build for development (watch mode)
npm run watch

# Build for production
npm run build
```

### Adding New Tools

1. Create a new tool class in `source/tools/`
2. Implement the `ToolExecutor` interface
3. Register the tool in the `mcp-server.ts` initialization
4. The tool will automatically be exposed through the MCP protocol

### TypeScript Support

The plugin is written entirely in TypeScript, featuring:
- Strict type checking enabled
- Comprehensive type definitions for all APIs
- IntelliSense support during development
- Automatic compilation to JavaScript

## Troubleshooting

### Common Issues

1. **Server won't start**: Check port availability and firewall settings
2. **Tools not working**: Make sure a scene is loaded and the UUID is valid
3. **Build errors**: Run `npm run build` to check for TypeScript errors
4. **Connection issues**: Verify the HTTP URL and server status

### Debug Mode

Enable debug logging in the plugin panel to get detailed operation logs.

### Using Debug Tools

```json
{
  "tool": "debug_get_console_logs",
  "arguments": {"limit": 50, "filter": "error"}
}
```

```json
{
  "tool": "debug_validate_scene",
  "arguments": {"checkMissingAssets": true}
}
```

## System Requirements

- Cocos Creator 3.8.6 or higher
- Node.js (bundled with Cocos Creator)
- TypeScript (installed as a dev dependency)

## License

This plugin is for use with Cocos Creator projects, and the source code is included for learning and reference purposes. It is not encrypted, so you are free to modify and improve it for your own use. However, neither this project's code nor any derivative code may be used for commercial purposes or resale. If you need a commercial license, please contact the author.

## Contact Me to Join the Group
<img alt="image" src="https://github.com/user-attachments/assets/a276682c-4586-480c-90e5-6db132e89e0f" width="400" height="400" />
