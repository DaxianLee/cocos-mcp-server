# Cocos Creator MCP 服务器插件

**[📖 English](README.md)**  **[📖 中文](README.zh-CN.md)**

一个适用于 Cocos Creator 3.8+ 的综合性 MCP（模型上下文协议）服务器插件，使 AI 助手能够通过标准化协议与 Cocos Creator 编辑器进行交互。一键安装和使用，省去所有繁琐环境和配置。已经测试过Claude客户端Claude CLI和Cursor，其他的编辑器理论上也完美支持。

**🚀 现在提供 13 个类别的 151 个工具，实现98%的编辑器控制！（预制体实例化存在子节点恢复问题）**

##快速链接

- **[📖 Complete Feature Guide (English)](FEATURE_GUIDE_EN.md)** - Detailed documentation for all 151 tools（待补充）
- **[📖 完整功能指南 (中文)](FEATURE_GUIDE_CN.md)** - 所有151工具的详细文档（待补充）

## 快速使用

**Claude cli配置：**

```
claude mcp add --transport http cocos-creator http://127.0.0.1:3000/mcp（使用你自己配置的端口号）
```

**Claude客户端配置：**

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

**Cursor或VS类MCP配置**

```
{

  "mcpServers": { 

   "cocos-creator": {
      "url": "http://localhost:3000/mcp"
   }
  }

}
```

**效果：**

<img width="1166" height="693" alt="image" src="https://github.com/user-attachments/assets/ecc30596-2e81-4123-b3fd-9e2cf08e5863" />
<img width="470" height="622" alt="image" src="https://github.com/user-attachments/assets/504fa39b-4f43-4cc4-a912-28654c488072" />
<img width="466" height="499" alt="image" src="https://github.com/user-attachments/assets/e5f73aa2-068f-457f-94fd-02f52084d6f4" />

## 功能特性

### 🎯 场景操作
- 获取当前场景信息和完整场景列表
- 通过路径打开场景并保存当前场景
- 创建自定义名称的新场景
- 获取完整场景层级结构及组件信息

### 🎮 节点操作
- 创建不同类型的节点（Node、2DNode、3DNode）
- 通过 UUID 获取节点信息，按名称模式查找节点
- 设置节点属性（位置、旋转、缩放、激活状态）
- 删除、移动和复制节点，完整支持层级结构

### 🔧 组件操作
- 向节点添加/删除组件
- 获取节点的所有组件及属性
- 动态设置组件属性
- 从资源路径挂载脚本组件
- 按类别列出可用的组件类型

### 📦 预制体操作
- 列出项目中的所有预制体，支持文件夹组织
- 加载、实例化和创建预制体
- 更新现有预制体并还原预制体实例
- 获取详细的预制体信息，包括依赖关系

### 🚀 项目控制
- 在预览模式下运行项目（浏览器/模拟器）
- 为不同平台构建项目（Web、移动端、桌面端）
- 获取项目信息和设置
- 刷新资源数据库并导入新资源
- 获取详细的资源信息

### 🔍 调试工具
- 获取编辑器控制台日志，支持过滤
- 清空控制台并在场景上下文中执行 JavaScript
- 获取详细的节点树用于调试
- 性能统计和场景验证
- 获取编辑器和环境信息

### ⚙️ 其他功能
- **偏好设置管理**: 获取/设置编辑器偏好和全局设置
- **服务器控制**: 服务器信息、项目详情和编辑器控制
- **消息广播**: 监听和广播自定义消息
- **资源管理**: 创建、复制、移动、删除和查询资源
- **构建系统**: 项目构建和预览服务器控制
- **参考图片管理**: 在场景视图中添加、删除和管理参考图片
- **场景视图控制**: 控制Gizmo工具、坐标系和视图模式
- **高级场景操作**: 撤销/重做、快照和高级节点操作

## 安装说明

### 1. 复制插件文件

将整个 `cocos-mcp-server` 文件夹复制到您的 Cocos Creator 项目的 `extensions` 目录中：

```
您的项目/
├── assets/
├── extensions/
│   └── cocos-mcp-server/          <- 将插件放在这里
│       ├── source/
│       ├── dist/
│       ├── package.json
│       └── ...
├── settings/
└── ...
```

### 2. 安装依赖

```bash
cd extensions/cocos-mcp-server
npm install
```

### 3. 构建插件

```bash
npm run build
```

### 4. 启用插件

1. 重启 Cocos Creator 或刷新扩展
2. 插件将出现在扩展菜单中
3. 点击 `扩展 > Cocos MCP Server` 打开控制面板

## 使用方法

### 启动服务器

1. 从 `扩展 > Cocos MCP Server` 打开 MCP 服务器面板
2. 配置设置：
   - **端口**: HTTP 服务器端口（默认：3000）
   - **自动启动**: 编辑器启动时自动启动服务器
   - **调试日志**: 启用详细日志以便开发调试
   - **最大连接数**: 允许的最大并发连接数

3. 点击"启动服务器"开始接受连接

### 连接 AI 助手

服务器在 `http://localhost:3000/mcp`（或您配置的端口）上提供 HTTP 端点。

AI 助手可以使用 MCP 协议连接并访问所有可用工具。

### 工具分类

工具按类别组织，命名约定为：`category_toolname`

- **scene_\***: 场景相关操作 (8个工具)
- **node_\***: 节点操作 (9个工具)
- **component_\***: 组件管理 (7个工具)
- **prefab_\***: 预制体操作 (11个工具)
- **project_\***: 项目控制 (22个工具)
- **debug_\***: 调试工具 (10个工具)
- **preferences_\***: 编辑器偏好设置 (7个工具)
- **server_\***: 服务器信息 (6个工具)
- **broadcast_\***: 消息广播 (5个工具)
- **assetAdvanced_\***: 高级资源操作 (10个工具)
- **referenceImage_\***: 参考图片管理 (12个工具)
- **sceneAdvanced_\***: 高级场景操作 (23个工具)
- **sceneView_\***: 场景视图控制 (14个工具)


📖 **[查看完整工具文档](FEATURE_GUIDE_CN.md)** 了解详细的使用示例和参数。

## 工具使用示例

### 创建新的精灵节点
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

### 添加 Sprite 组件
```json
{
  "tool": "component_add_component",
  "arguments": {
    "nodeUuid": "node-uuid",
    "componentType": "cc.Sprite"
  }
}
```

### 实例化预制体
```json
{
  "tool": "prefab_instantiate_prefab",
  "arguments": {
    "prefabPath": "db://assets/prefabs/Enemy.prefab",
    "position": { "x": 100, "y": 200, "z": 0 }
  }
}
```

### 在浏览器中运行项目
```json
{
  "tool": "project_run_project",
  "arguments": {
    "platform": "browser"
  }
}
```

## 配置

设置存储在 `您的项目/settings/mcp-server.json` 中：

```json
{
  "port": 3000,
  "autoStart": false,
  "enableDebugLog": true,
  "allowedOrigins": ["*"],
  "maxConnections": 10
}
```

## 图标设置

为插件面板添加图标：

1. 创建 PNG 图标文件（推荐尺寸：32x32 或 64x64）
2. 将其放在 `static/` 目录中：`static/icon.png`
3. 图标路径已在 `package.json` 中配置

## 开发

### 项目结构
```
cocos-mcp-server/
├── source/                    # TypeScript 源文件
│   ├── main.ts               # 插件入口点
│   ├── mcp-server.ts         # MCP 服务器实现
│   ├── settings.ts           # 设置管理
│   ├── types/                # TypeScript 类型定义
│   ├── tools/                # 工具实现
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
│   ├── panels/               # UI 面板实现
│   └── test/                 # 测试文件
├── dist/                     # 编译后的 JavaScript 输出
├── static/                   # 静态资源（图标等）
├── i18n/                     # 国际化文件
├── package.json              # 插件配置
└── tsconfig.json             # TypeScript 配置
```

### 从源码构建

```bash
# 安装依赖
npm install

# 开发构建（监视模式）
npm run watch

# 生产构建
npm run build
```

### 添加新工具

1. 在 `source/tools/` 中创建新的工具类
2. 实现 `ToolExecutor` 接口
3. 将工具添加到 `mcp-server.ts` 初始化中
4. 工具会自动通过 MCP 协议暴露

### TypeScript 支持

插件完全使用 TypeScript 编写，具备：
- 启用严格类型检查
- 为所有 API 提供全面的类型定义
- 开发时的 IntelliSense 支持
- 自动编译为 JavaScript

## 故障排除

### 常见问题

1. **服务器无法启动**: 检查端口可用性和防火墙设置
2. **工具不工作**: 确保场景已加载且 UUID 有效
3. **构建错误**: 运行 `npm run build` 检查 TypeScript 错误
4. **连接问题**: 验证 HTTP URL 和服务器状态

### 调试模式

在插件面板中启用调试日志以获取详细的操作日志。

### 使用调试工具

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

## 系统要求

- Cocos Creator 3.8.6 或更高版本
- Node.js（Cocos Creator 自带）
- TypeScript（作为开发依赖安装）

## 许可证

本插件供 Cocos Creator 项目使用,并且源代码一并打包，可以用于学习和交流。没有加密。可以支持你自己二次开发优化，任何本项目代码或者衍生代码均不能用于任何商用、转售，如果需要商用，请联系本人。
