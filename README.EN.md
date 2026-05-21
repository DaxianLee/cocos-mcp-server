# Cocos Creator MCP Server Plugin

**[📖 English](README.EN.md)**  **[📖 Chinese](README.md)**

A comprehensive MCP (Model Context Protocol) server plugin for Cocos Creator 3.8+, enabling AI assistants to interact with the Cocos Creator editor through standardized protocols. One-click installation and use, eliminating all cumbersome environments and configurations. Claude clients Claude CLI and Cursor have been tested, and other editors are also perfectly supported in theory.

**🚀 Now provides 50 powerful integrated tools, achieving 99% editor control!**

## Video Demonstrations and Tutorials

[<img width="503" height="351" alt="image" src="https://github.com/user-attachments/assets/f186ce14-9ffc-4a29-8761-48bdd7c1ea16" />](https://www.bilibili.com/video/BV1mB8dzfEw8?spm_id_from=333.788.recommend_more_video.0&vd_source=6b1ff659dd5f04a92cc6d14061e8bb92)



## Quick Links

- **[📖 Complete Feature Guide (English)](FEATURE_GUIDE_EN.md)** - Detailed documentation for all 50 tools (to be completed)
- **[📖 Complete Feature Guide (Chinese)](FEATURE_GUIDE_CN.md)** - Detailed documentation for all 50 tools (to be completed)


## Changelog

## 🚀 Major Update v1.5.0 (July 29, 2024) (Already updated in Cocos Store, GitHub version will be synchronized in next version)

Cocos store: https://store.cocos.com/app/detail/7941

- **Tool Streamlining and Refactoring**: Condensed the original 150+ tools into 50 high-reuse, high-coverage core tools, removing all invalid redundant code, greatly improving usability and maintainability.
- **Unified Operation Codes**: All tools adopt "operation code + parameters" mode, greatly simplifying AI calling process, improving AI calling success rate, reducing AI calling times, and lowering 50% token consumption.
- **Comprehensive Prefab Function Upgrade**: Completely fixed and perfected all core prefab functions including creation, instantiation, synchronization, references, etc., supporting complex reference relationships, 100% aligned with official format.
- **Event Binding and Legacy Function Completion**: Added and implemented event binding, node/component/asset legacy functions, all methods completely aligned with official implementation.
- **Interface Optimization**: All interface parameters are clearer, documentation is more complete, AI can understand and call more easily.
- **Plugin Panel Optimization**: Panel UI is more concise, operations are more intuitive.
- **Performance and Compatibility Improvements**: Overall architecture is more efficient, compatible with Cocos Creator 3.8.6 and all versions above.


## Tool System and Operation Codes

- All tools are named with "category_operation", parameters use unified Schema, support multiple operation code (action) switching, greatly improving flexibility and extensibility.
- 50 core tools cover scene, node, component, prefab, asset, project, debugging, preferences, server, message broadcasting and all other editor operations.
- Tool calling example:

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

## Main Function Categories (Partial Examples)

- **scene_management**: Scene management (get/open/save/create/close scenes)
- **node_query / node_lifecycle / node_transform**: Node query, creation, deletion, property changes
- **component_manage / component_script / component_query**: Component add/remove, script mounting, component information
- **prefab_browse / prefab_lifecycle / prefab_instance**: Prefab browsing, creation, instantiation, synchronization
- **asset_manage / asset_analyze**: Asset import, deletion, dependency analysis
- **project_manage / project_build_system**: Project running, building, configuration information
- **debug_console / debug_logs**: Console and log management
- **preferences_manage**: Preferences settings
- **server_info**: Server information
- **broadcast_message**: Message broadcasting


### v1.4.0 - July 26, 2025 (Current github version)

#### 🎯 Major Functionality Fixes
- **Complete Prefab Creation Fix**: Thoroughly resolved the issue of component/node/resource type reference loss during prefab creation
- **Proper Reference Handling**: Implemented reference formats completely consistent with manually created prefabs
  - **Internal References**: Node and component references within prefabs correctly converted to `{"__id__": x}` format
  - **External References**: Node and component references outside prefabs correctly set to `null`
  - **Resource References**: Prefab, texture, sprite frame and other resource references fully preserved in UUID format
- **Component/Script Removal API Standardization**: Now, when removing a component or script, you must provide the component's cid (type field), not the script name or class name. AI and users should first use getComponents to get the type field (cid), then pass it to removeComponent. This ensures 100% accurate removal of all component and script types, compatible with all Cocos Creator versions.

#### 🔧 Core Improvements
- **Index Order Optimization**: Adjusted prefab object creation order to ensure consistency with Cocos Creator standard format
- **Component Type Support**: Extended component reference detection to support all cc. prefixed component types (Label, Button, Sprite, etc.)
- **UUID Mapping Mechanism**: Perfected internal UUID to index mapping system, ensuring correct reference relationships
- **Property Format Standardization**: Fixed component property order and format, eliminating engine parsing errors

#### 🐛 Bug Fixes
- **Fixed Prefab Import Errors**: Resolved `Cannot read properties of undefined (reading '_name')` error
- **Fixed Engine Compatibility**: Resolved `placeHolder.initDefault is not a function` error
- **Fixed Property Overwriting**: Prevented critical properties like `_objFlags` from being overwritten by component data
- **Fixed Reference Loss**: Ensured all types of references are correctly saved and loaded

#### 📈 Feature Enhancements
- **Complete Component Property Preservation**: All component properties including private properties (like _group, _density, etc.)
- **Child Node Structure Support**: Proper handling of prefab hierarchical structures and child node relationships
- **Transform Property Processing**: Preserved node position, rotation, scale, and layer information
- **Debug Information Optimization**: Added detailed reference processing logs for easier issue tracking

#### 💡 Technical Breakthroughs
- **Reference Type Identification**: Intelligently distinguish between internal and external references, avoiding invalid references
- **Format Compatibility**: Generated prefabs are 100% compatible with manually created prefab formats
- **Engine Integration**: Prefabs can be properly mounted to scenes without any runtime errors
- **Performance Optimization**: Optimized prefab creation workflow, improving processing efficiency for large prefabs

**🎉 Prefab creation functionality is now fully operational, supporting complex component reference relationships and complete prefab structures!**

### v1.3.0 - July 25, 2024

#### 🆕 New Features
- **Integrated Tool Management Panel**: Added comprehensive tool management functionality directly into the main control panel
- **Tool Configuration System**: Implemented selective tool enabling/disabling with persistent configurations
- **Dynamic Tool Loading**: Enhanced tool discovery to dynamically load all 158 available tools from the MCP server
- **Real-time Tool State Management**: Added real-time updates for tool counts and status when individual tools are toggled
- **Configuration Persistence**: Automatic saving and loading of tool configurations across editor sessions

#### 🔧 Improvements
- **Unified Panel Interface**: Merged tool management into the main MCP server panel as a tab, eliminating the need for separate panels
- **Enhanced Server Settings**: Improved server configuration management with better persistence and loading
- **Vue 3 Integration**: Upgraded to Vue 3 Composition API for better reactivity and performance
- **Better Error Handling**: Added comprehensive error handling with rollback mechanisms for failed operations
- **Improved UI/UX**: Enhanced visual design with proper dividers, distinct block styles, and non-transparent modal backgrounds

#### 🐛 Bug Fixes
- **Fixed Tool State Persistence**: Resolved issues where tool states would reset upon tab switching or panel re-opening
- **Fixed Configuration Loading**: Corrected server settings loading issues and message registration problems
- **Fixed Checkbox Interactions**: Resolved checkbox unchecking issues and improved reactivity
- **Fixed Panel Scrolling**: Ensured proper scrolling functionality in the tool management panel
- **Fixed IPC Communication**: Resolved various IPC communication issues between frontend and backend

#### 🏗️ Technical Improvements
- **Simplified Architecture**: Removed multi-configuration complexity, focusing on single configuration management
- **Better Type Safety**: Enhanced TypeScript type definitions and interfaces
- **Improved Data Synchronization**: Better synchronization between frontend UI state and backend tool manager
- **Enhanced Debugging**: Added comprehensive logging and debugging capabilities

#### 📊 Statistics
- **Total Tools**: Increased from 151 to 158 tools
- **Categories**: 13 tool categories with comprehensive coverage
- **Editor Control**: Achieved 98% editor functionality coverage

### v1.2.0 - Previous Version
- Initial release with 151 tools
- Basic MCP server functionality
- Scene, node, component, and prefab operations
- Project control and debugging tools



## Quick Usage

**Claude CLI configuration:**

```
claude mcp add --transport http cocos-creator http://127.0.0.1:3000/mcp (use your configured port number)
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

**Cursor or VS class MCP configuration**

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
- **scene_management**: Scene management - Get current scene, open/save/create/close scenes, support scene list query
- **scene_hierarchy**: Scene hierarchy - Get complete scene structure, support component information inclusion
- **scene_execution_control**: Execution control - Execute component methods, scene scripts, prefab synchronization

### 🎮 Node Operations (node_*)
- **node_query**: Node query - Find nodes by name/pattern, get node information, detect 2D/3D types
- **node_lifecycle**: Node lifecycle - Create/delete nodes, support component pre-installation, prefab instantiation
- **node_transform**: Node transform - Modify node name, position, rotation, scale, visibility and other properties
- **node_hierarchy**: Node hierarchy - Move, copy, paste nodes, support hierarchical structure operations
- **node_clipboard**: Node clipboard - Copy/paste/cut node operations
- **node_property_management**: Property management - Reset node properties, component properties, transform properties

### 🔧 Component Operations (component_*)
- **component_manage**: Component management - Add/remove engine components (cc.Sprite, cc.Button, etc.)
- **component_script**: Script components - Mount/remove custom script components
- **component_query**: Component query - Get component list, detailed information, available component types
- **set_component_property**: Property setting - Set single or multiple component property values

### 📦 Prefab Operations (prefab_*)
- **prefab_browse**: Prefab browsing - List prefabs, view information, validate files
- **prefab_lifecycle**: Prefab lifecycle - Create prefabs from nodes, delete prefabs
- **prefab_instance**: Prefab instances - Instantiate to scene, unlink, apply changes, restore original
- **prefab_edit**: Prefab editing - Enter/exit edit mode, save prefabs, test changes

### 🚀 Project Control (project_*)
- **project_manage**: Project management - Run project, build project, get project information and settings
- **project_build_system**: Build system - Control build panel, check build status, preview server management

### 🔍 Debug Tools (debug_*)
- **debug_console**: Console management - Get/clear console logs, support filtering and limiting
- **debug_logs**: Log analysis - Read/search/analyze project log files, support pattern matching
- **debug_system**: System debugging - Get editor information, performance statistics, environment information

### 📁 Asset Management (asset_*)
- **asset_manage**: Asset management - Batch import/delete assets, save metadata, generate URLs
- **asset_analyze**: Asset analysis - Get dependency relationships, export asset manifests
- **asset_system**: Asset system - Refresh assets, query asset database status
- **asset_query**: Asset query - Query assets by type/folder, get detailed information
- **asset_operations**: Asset operations - Create/copy/move/delete/save/re-import assets

### ⚙️ Preferences (preferences_*)
- **preferences_manage**: Preferences management - Get/set editor preferences
- **preferences_global**: Global settings - Manage global configuration and system settings

### 🌐 Server and Broadcasting (server_* / broadcast_*)
- **server_info**: Server information - Get server status, project details, environment information
- **broadcast_message**: Message broadcasting - Listen and broadcast custom messages

### 🖼️ Reference Images (referenceImage_*)
- **reference_image_manage**: Reference image management - Add/delete/manage reference images in scene view
- **reference_image_view**: Reference image view - Control reference image display and editing

### 🎨 Scene View (sceneView_*)
- **scene_view_control**: Scene view control - Control Gizmo tools, coordinate systems, view modes
- **scene_view_tools**: Scene view tools - Manage various scene view tools and options

### ✅ Validation Tools (validation_*)
- **validation_scene**: Scene validation - Validate scene integrity, check missing assets
- **validation_asset**: Asset validation - Validate asset references, check asset integrity

### 🛠️ Tool Management
- **Tool Configuration System**: Selectively enable/disable tools, support multiple configurations
- **Configuration Persistence**: Automatically save and load tool configurations
- **Configuration Import/Export**: Support tool configuration import/export functionality
- **Real-time State Management**: Real-time tool state updates and synchronization

### 🚀 Core Advantages
- **Unified Operation Codes**: All tools adopt "category_operation" naming, unified parameter Schema
- **High Reusability**: 50 core tools cover 99% editor functionality
- **AI-Friendly**: Clear parameters, complete documentation, simple calling
- **Performance Optimization**: Reduce 50% token consumption, improve AI calling success rate
- **Complete Compatibility**: 100% aligned with Cocos Creator official API

## Installation

### 1. Copy Plugin Files

Copy the entire `cocos-mcp-server` folder to your Cocos Creator project's `extensions` directory, or you can directly import the project in the extension manager:

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

### 4. Enable Plugin

1. Restart Cocos Creator or refresh extensions
2. The plugin will appear in the Extension menu
3. Click `Extension > Cocos MCP Server` to open the control panel

## Usage

### Starting the Server

1. Open the MCP Server panel from `Extension > Cocos MCP Server`
2. Configure settings:
   - **Port**: HTTP server port (default: 3000)
   - **Auto Start**: Automatically start server when editor opens
   - **Debug Logging**: Enable detailed logging for development
   - **Max Connections**: Maximum concurrent connections allowed

3. Click "Start Server" to begin accepting connections

### Connecting AI Assistants

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

# Build for development with watch mode
npm run watch

# Build for production
npm run build
```

### Adding New Tools

1. Create a new tool class in `source/tools/`
2. Implement the `ToolExecutor` interface
3. Add tool to `mcp-server.ts` initialization
4. Tools are automatically exposed via MCP protocol

### TypeScript Support

The plugin is fully written in TypeScript with:
- Strict type checking enabled
- Comprehensive type definitions for all APIs
- IntelliSense support for development
- Automatic compilation to JavaScript

## Troubleshooting

### Common Issues

1. **Server won't start**: Check port availability and firewall settings
2. **Tools not working**: Ensure scene is loaded and UUIDs are valid
3. **Build errors**: Run `npm run build` to check for TypeScript errors
4. **Connection issues**: Verify HTTP URL and server status

### Debug Mode

Enable debug logging in the plugin panel for detailed operation logs.

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

## Requirements

- Cocos Creator 3.8.6 or later
- Node.js (bundled with Cocos Creator)
- TypeScript (installed as dev dependency)

## License

This plug-in is for Cocos Creator project use, and the source code is packaged together, which can be used for learning and communication. It is not encrypted. It can support your own secondary development and optimization. Any code of this project or its derivative code cannot be used for any commercial purpose or resale. If you need commercial use, please contact me.

## Contact me to join the group
<img alt="image" src="https://github.com/user-attachments/assets/a276682c-4586-480c-90e5-6db132e89e0f" width="400" height="400" />

