# Cocos Creator MCP Server Plugin
**[📖 English](README.EN.md)** **[📖 中文](README.md)**


A comprehensive MCP (Model Context Protocol) server plugin for Cocos Creator 3.8+, enabling AI assistants to interact with the Cocos Creator editor through standardized protocols. One-click installation and use, eliminating all cumbersome environments and configurations. Claude clients Claude CLI and Cursor have been tested, and other editors are also perfectly supported in theory.

**🚀 Now provides 158 tools in 13 categories, achieving 98% editor control!**

## Video Demonstrations and Tutorials
[<img width="503" height="351" alt="image" src="https://github.com/user-attachments/assets/f186ce14-9ffc-4a29-8761-48bdd7c1ea16" />](https://www.bilibili.com/video/BV1uzgVz8EyQ/?vd_source=6b1ff659dd5f04a92cc6d14061e8bb92)

## Video Demonstration Configuration Tool List
[<img width="502" height="345" alt="image" src="https://github.com/user-attachments/assets/c5bfe1ed-8946-42a7-ac50-d86dd177e496" />](https://www.bilibili.com/video/BV1kfbyzQEAS/?vd_source=6b1ff659dd5f04a92cc6d14061e8bb92)

## Quick Links

- **[📖 Complete Feature Guide (English)](FEATURE_GUIDE_EN.md)** - Detailed documentation for all 158 tools(To be completed)
- **[📖 完整功能指南 (中文)](FEATURE_GUIDE_CN.md)** - 所有158个工具的详细文档(To be completed)


## Changelog

### v1.4.0 - July  26, 2025 (Already updated in the cocos store, the github version will be synchronized in the near future)
cocos store：https://store.cocos.com/app/detail/7941
If you don't want to buy it, join the communication group and I can send you the latest version directly!

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


**Claude cli configuration:**

```
claude mcp add --transport http cocos-creator http://127.0.0.1:3000/mcp (use the port number you configured yourself)
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

### 🎯 Scene Operations
- Get current scene information and complete scene list
- Open scenes by path and save current scene
- Create new scenes with custom names
- Get complete scene hierarchy with component information

### 🎮 Node Operations
- Create nodes with different types (Node, 2DNode, 3DNode)
- Get node information by UUID and find nodes by name pattern
- Set node properties (position, rotation, scale, active)
- Delete, move, and duplicate nodes with full hierarchy support

### 🔧 Component Operations
- Add/remove components from nodes
- Get all components of a node with properties
- Set component properties dynamically
- Attach script components from asset paths
- List available component types by category

### 📦 Prefab Operations
- List all prefabs in project with folder organization
- Load, instantiate, and create prefabs
- Update existing prefabs and revert prefab instances
- Get detailed prefab information including dependencies
- **⚠️ Known Issue**: Prefab instantiation may not properly restore child nodes due to Cocos Creator API limitations

### 🚀 Project Control
- Run project in preview mode (browser/simulator)
- Build project for different platforms (web, mobile, desktop)
- Get project information and settings
- Refresh asset database and import new assets
- Get detailed asset information

### 🔍 Debug Tools
- Get editor console logs with filtering
- Clear console and execute JavaScript in scene context
- Get detailed node tree for debugging
- Performance statistics and scene validation
- Get editor and environment information

### ⚙️ Additional Features
- **Preferences Management**: Get/set editor preferences and global settings
- **Server Control**: Server information, project details, and editor control
- **Message Broadcasting**: Listen to and broadcast custom messages
- **Asset Management**: Create, copy, move, delete, and query assets
- **Build System**: Project building and preview server control
- **Reference Image Management**: Add, remove, and manage reference images in scene view
- **Scene View Controls**: Control gizmo tools, coordinate systems, and view modes
- **Advanced Scene Operations**: Undo/redo, snapshots, and advanced node manipulation
- **🆕 Tool Management**: Selectively enable/disable tools, save configurations, and manage tool states

## Installation

### 1. Copy Plugin Files

Copy the entire `cocos-mcp-server` folder to your Cocos Creator project's `extensions` directory:

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

### Tool Categories

Tools are organized by category with naming convention: `category_toolname`

- **scene_\***: Scene-related operations (8 tools)
- **node_\***: Node manipulation (9 tools)  
- **component_\***: Component management (7 tools)
- **prefab_\***: Prefab operations (11 tools)
- **project_\***: Project control (22 tools)
- **debug_\***: Debugging utilities (10 tools)
- **preferences_\***: Editor preferences (7 tools)
- **server_\***: Server information (6 tools)
- **broadcast_\***: Message broadcasting (5 tools)
- **assetAdvanced_\***: Advanced asset operations (10 tools)
- **referenceImage_\***: Reference image management (12 tools)
- **sceneAdvanced_\***: Advanced scene operations (23 tools)
- **sceneView_\***: Scene view controls (14 tools)


📖 **[View Complete Tool Documentation](FEATURE_GUIDE_EN.md)** for detailed usage examples and parameters.

## Example Tool Usage

### Create a new sprite node
```json
{
  "tool": "node_create_node",
  "arguments": {
    "name": "MySprite",
    "nodeType": "2DNode",
    "parentUuid": "parent-node-uuid"
  }
}
```

### Add a Sprite component
```json
{
  "tool": "component_add_component", 
  "arguments": {
    "nodeUuid": "node-uuid",
    "componentType": "cc.Sprite"
  }
}
```

### Instantiate a prefab
```json
{
  "tool": "prefab_instantiate_prefab",
  "arguments": {
    "prefabPath": "db://assets/prefabs/Enemy.prefab",
    "position": { "x": 100, "y": 200, "z": 0 }
  }
}
```
**⚠️ Note**: Complex prefabs with child nodes may not instantiate correctly due to Cocos Creator API limitations. Child nodes may be missing in the instantiated prefab.

### Run project in browser
```json
{
  "tool": "project_run_project",
  "arguments": {
    "platform": "browser"
  }
}
```

## Configuration

Settings are stored in `YourProject/settings/mcp-server.json`:

```json
{
  "port": 3000,
  "autoStart": false,
  "enableDebugLog": true,
  "allowedOrigins": ["*"],
  "maxConnections": 10
}
```

Tool configurations are stored in `YourProject/settings/tool-manager.json`:

```json
{
  "currentConfigId": "default",
  "configurations": {
    "default": {
      "id": "default",
      "name": "默认配置",
      "description": "默认工具配置",
      "tools": [
        {
          "category": "scene",
          "name": "get_current_scene",
          "enabled": true,
          "description": "Get current scene information"
        }
      ]
    }
  }
}
```

## Icon Setup

To add an icon for the plugin panel:

1. Create a PNG icon file (recommended size: 32x32 or 64x64)
2. Place it in the `static/` directory: `static/icon.png`
3. The icon path is already configured in `package.json`

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
│   │   ├── scene-advanced-tools.ts
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

### Running Tests

```bash
# Run comprehensive test suite
node comprehensive-test.js

# Run feature-specific tests
./test-all-features.sh

# Run Node.js test script
node test-mcp-server.js
```

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

## Architecture Notes

This plugin uses a simplified MCP protocol implementation that is compatible with Cocos Creator's CommonJS environment. The HTTP server provides a JSON-RPC interface for AI assistants to interact with the editor.

### Protocol Support
- **HTTP Connection**: `http://localhost:3000/mcp` (configurable port)
- **JSON-RPC 2.0**: Standard request/response format
- **Tool Discovery**: `tools/list` method returns available tools
- **Tool Execution**: `tools/call` method executes specific tools

## License

This plug-in is for Cocos Creator project, and the source code is packaged together, which can be used for learning and communication. It is not encrypted. It can support your own secondary development and optimization. Any code of this project or its derivative code cannot be used for any commercial purpose or resale. If you need commercial use, please contact me.


## Contact me to join the group

<img src="https://github.com/user-attachments/assets/2e3f043a-0b03-4b27-a175-e9c31fbed981" style="max-width: 400px; border-radius: 8px;"/>

<img src="https://github.com/user-attachments/assets/5ef6172c-2968-499e-9edf-7da133016cd2" style="max-width: 400px; border-radius: 8px;" />