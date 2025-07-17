# Cocos Creator MCP Server Plugin
**[📖 English](README.md)** **[📖 中文](README.zh-CN.md)**
A comprehensive MCP (Model Context Protocol) server plugin for Cocos Creator 3.8+, enabling AI assistants to interact with the Cocos Creator editor through standardized protocols. One-click installation and use, eliminating all cumbersome environments and configurations. Claude clients Claude CLI and Cursor have been tested, and other editors are also perfectly supported in theory.

**🚀 Now provides 80 tools in 9 categories, achieving 95% editor control! (Prefabs cannot be manipulated for the time being)**

## Quick Links

- **[📖 Complete Feature Guide (English)](FEATURE_GUIDE_EN.md)** - Detailed documentation for all 80 tools
- **[📖 完整功能指南 (中文)](FEATURE_GUIDE_CN.md)** - 所有80个工具的详细文档
- **[🧪 Testing Guide](TEST_GUIDE.md)** - How to test the MCP server
**Claude cli configuration:**

```
claude mcp add --transport http http://localhost:3000/mcp (use the port number you configured yourself)
```

**Claude client configuration:**

```
{

"mcpServers": {

"cocos-creator": {

"type": "http",

"url": "http://localhost:3000/mcp"

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
<img width="1166" height="693" alt="image" src="https://github.com/user-attachments/assets/ecc30596-2e81-4123-b3fd-9e2cf08e5863" />
<img width="470" height="622" alt="image" src="https://github.com/user-attachments/assets/504fa39b-4f43-4cc4-a912-28654c488072" />
<img width="466" height="499" alt="image" src="https://github.com/user-attachments/assets/e5f73aa2-068f-457f-94fd-02f52084d6f4" />

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
   - **Port**: WebSocket server port (default: 3000)
   - **Auto Start**: Automatically start server when editor opens
   - **Debug Logging**: Enable detailed logging for development
   - **Max Connections**: Maximum concurrent connections allowed

3. Click "Start Server" to begin accepting connections

### Connecting AI Assistants

The server exposes a WebSocket endpoint at `ws://localhost:3000` (or your configured port).

AI assistants can connect using the MCP protocol and access all available tools.

### Tool Categories

Tools are organized by category with naming convention: `category_toolname`

- **scene_\***: Scene-related operations (8 tools)
- **node_\***: Node manipulation (9 tools)
- **component_\***: Component management (7 tools)
- **prefab_\***: Prefab operations (8 tools)
- **project_\***: Project control (22 tools)
- **debug_\***: Debugging utilities (7 tools)
- **preferences_\***: Editor preferences (6 tools)
- **server_\***: Server information (8 tools)
- **broadcast_\***: Message broadcasting (5 tools)

**Total: 80 tools** for comprehensive editor control.

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
│   └── panels/               # UI panel implementation
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

## Testing

The project includes comprehensive testing tools:

- **[Manual Testing Guide](TEST_GUIDE.md)** - Step-by-step testing procedures
- **Automated Test Scripts**: `test-mcp-server.js`, `test-all-features.sh`, `test_mcp_server.py`
- **Comprehensive Test Suite**: `comprehensive-test.js` - Tests all 80 tools

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
4. **Connection issues**: Verify WebSocket URL and server status

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

This plugin uses a simplified MCP protocol implementation that is compatible with Cocos Creator's CommonJS environment. The WebSocket server provides a JSON-RPC interface for AI assistants to interact with the editor.

### Protocol Support
- **WebSocket Connection**: `ws://localhost:3000` (configurable port)
- **JSON-RPC 2.0**: Standard request/response format
- **Tool Discovery**: `tools/list` method returns available tools
- **Tool Execution**: `tools/call` method executes specific tools

## License

This plug-in is for Cocos Creator project, and the source code is packaged together, which can be used for learning and communication. It is not encrypted. It can support your own secondary development and optimization. Any code of this project or its derivative code cannot be used for any commercial purpose or resale. If you need commercial use, please contact me.
