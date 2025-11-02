# Cocos Creator MCP 服务器插件

**[📖 English](README.EN.md)**  **[📖 中文](README.md)**

一个适用于 Cocos Creator 3.8+ 的综合性 MCP（模型上下文协议）服务器插件，使 AI 助手能够通过标准化协议与 Cocos Creator 编辑器进行交互。一键安装和使用，省去所有繁琐环境和配置。已经测试过Claude客户端Claude CLI和Cursor，其他的编辑器理论上也完美支持。

**🚀 现在提供 50 个强力融合工具，实现99%的编辑器控制！**

## 视频演示和教学

[<img width="503" height="351" alt="image" src="https://github.com/user-attachments/assets/f186ce14-9ffc-4a29-8761-48bdd7c1ea16" />](https://www.bilibili.com/video/BV1mB8dzfEw8?spm_id_from=333.788.recommend_more_video.0&vd_source=6b1ff659dd5f04a92cc6d14061e8bb92)


##快速链接

- **[📖 Complete Feature Guide (English)](FEATURE_GUIDE_EN.md)** - Detailed documentation for all 158 tools（待补充）
- **[📖 完整功能指南 (中文)](FEATURE_GUIDE_CN.md)** - 所有158工具的详细文档（待补充）


## 更新日志

## 🚀 重大更新 v1.5.0（2024年7月29日）（已经在cocos 商城更新，github版本将在下个版本同步更新）

cocos store：https://store.cocos.com/app/detail/7941

- **工具精简与重构**：将原有150+工具浓缩规整为50个高复用、高覆盖率的核心工具，去除所有无效冗余代码，极大提升易用性和可维护性。
- **操作码统一**：所有工具均采用“操作码+参数”模式，极大简化AI调用流程，提升AI调用成功率，减少AI调用次数，降低50% token消耗。
- **预制体功能全面升级**：彻底修复和完善预制体的创建、实例化、同步、引用等所有核心功能，支持复杂引用关系，100%对齐官方格式。
- **事件绑定与老功能补全**：补充并实现了事件绑定、节点/组件/资源等老功能，所有方法与官方实现完全对齐。
- **接口优化**：所有接口参数更清晰，文档更完善，AI更容易理解和调用。
- **插件面板优化**：面板UI更简洁，操作更直观。
- **性能与兼容性提升**：整体架构更高效，兼容Cocos Creator 3.8.6及以上所有版本。


## 工具体系与操作码

- 所有工具均以“类别_操作”命名，参数采用统一Schema，支持多操作码（action）切换，极大提升灵活性和可扩展性。
- 50个核心工具涵盖场景、节点、组件、预制体、资源、项目、调试、偏好设置、服务器、消息广播等全部编辑器操作。
- 工具调用示例：

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

## 主要功能类别（部分示例）

- **scene_management**：场景管理（获取/打开/保存/新建/关闭场景）
- **node_query / node_lifecycle / node_transform**：节点查询、创建、删除、属性变更
- **component_manage / component_script / component_query**：组件增删、脚本挂载、组件信息
- **prefab_browse / prefab_lifecycle / prefab_instance**：预制体浏览、创建、实例化、同步
- **asset_manage / asset_analyze**：资源导入、删除、依赖分析
- **project_manage / project_build_system**：项目运行、构建、配置信息
- **debug_console / debug_logs**：控制台与日志管理
- **preferences_manage**：偏好设置
- **server_info**：服务器信息
- **broadcast_message**：消息广播


### v1.4.0 - 2025年7月26日（当前github版本）

#### 🎯 重大功能修复
- **完全修复预制体创建功能**: 彻底解决了预制体创建时组件/节点/资源类型引用丢失的问题
- **正确的引用处理**: 实现了与手动创建预制体完全一致的引用格式
  - **内部引用**: 预制体内部的节点和组件引用正确转换为 `{"__id__": x}` 格式
  - **外部引用**: 预制体外部的节点和组件引用正确设置为 `null`
  - **资源引用**: 预制体、纹理、精灵帧等资源引用完整保留UUID格式
- **组件/脚本移除API规范化**: 现在移除组件/脚本时，必须传入组件的cid（type字段），不能用脚本名或类名。AI和用户应先用getComponents获取type字段（cid），再传给removeComponent。这样能100%准确移除所有类型组件和脚本，兼容所有Cocos Creator版本。

#### 🔧 核心改进
- **索引顺序优化**: 调整预制体对象创建顺序，确保与Cocos Creator标准格式一致
- **组件类型支持**: 扩展组件引用检测，支持所有cc.开头的组件类型（Label、Button、Sprite等）
- **UUID映射机制**: 完善内部UUID到索引的映射系统，确保引用关系正确建立
- **属性格式标准化**: 修复组件属性顺序和格式，消除引擎解析错误

#### 🐛 错误修复
- **修复预制体导入错误**: 解决 `Cannot read properties of undefined (reading '_name')` 错误
- **修复引擎兼容性**: 解决 `placeHolder.initDefault is not a function` 错误
- **修复属性覆盖**: 防止 `_objFlags` 等关键属性被组件数据覆盖
- **修复引用丢失**: 确保所有类型的引用都能正确保存和加载

#### 📈 功能增强
- **完整组件属性保留**: 包括私有属性（如_group、_density等）在内的所有组件属性
- **子节点结构支持**: 正确处理预制体的层级结构和子节点关系
- **变换属性处理**: 保留节点的位置、旋转、缩放和层级信息
- **调试信息优化**: 添加详细的引用处理日志，便于问题追踪

#### 💡 技术突破
- **引用类型识别**: 智能区分内部引用和外部引用，避免无效引用
- **格式兼容性**: 生成的预制体与手动创建的预制体格式100%兼容
- **引擎集成**: 预制体可以正常挂载到场景中，无任何运行时错误
- **性能优化**: 优化预制体创建流程，提高大型预制体的处理效率

**🎉 现在预制体创建功能已完全可用，支持复杂的组件引用关系和完整的预制体结构！**

### v1.3.0 - 2024年7月25日

#### 🆕 新功能
- **集成工具管理面板**: 在主控制面板中直接添加了全面的工具管理功能
- **工具配置系统**: 实现了选择性工具启用/禁用，支持持久化配置
- **动态工具加载**: 增强了工具发现功能，能够动态加载MCP服务器中的所有158个可用工具
- **实时工具状态管理**: 添加了工具计数和状态的实时更新，当单个工具切换时立即反映
- **配置持久化**: 在编辑器会话间自动保存和加载工具配置

#### 🔧 改进
- **统一面板界面**: 将工具管理合并到主MCP服务器面板作为标签页，消除了对单独面板的需求
- **增强服务器设置**: 改进了服务器配置管理，具有更好的持久化和加载功能
- **Vue 3集成**: 升级到Vue 3 Composition API，提供更好的响应性和性能
- **更好的错误处理**: 添加了全面的错误处理，包含失败操作的回滚机制
- **改进的UI/UX**: 增强了视觉设计，包含适当的分隔符、独特的块样式和非透明模态背景

#### 🐛 错误修复
- **修复工具状态持久化**: 解决了工具状态在标签页切换或面板重新打开时重置的问题
- **修复配置加载**: 纠正了服务器设置加载问题和消息注册问题
- **修复复选框交互**: 解决了复选框取消选中问题并改进了响应性
- **修复面板滚动**: 确保工具管理面板中的正确滚动功能
- **修复IPC通信**: 解决了前端和后端之间的各种IPC通信问题

#### 🏗️ 技术改进
- **简化架构**: 移除了多配置复杂性，专注于单一配置管理
- **更好的类型安全**: 增强了TypeScript类型定义和接口
- **改进数据同步**: 前端UI状态和后端工具管理器之间更好的同步
- **增强调试**: 添加了全面的日志记录和调试功能

#### 📊 统计信息
- **总工具数**: 从151个增加到158个工具
- **类别**: 13个工具类别，全面覆盖
- **编辑器控制**: 实现98%的编辑器功能覆盖

### v1.2.0 - 之前版本
- 初始发布，包含151个工具
- 基本MCP服务器功能
- 场景、节点、组件和预制体操作
- 项目控制和调试工具



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

## 功能特性

### 🎯 场景操作 (scene_*)
- **scene_management**: 场景管理 - 获取当前场景、打开/保存/创建/关闭场景，支持场景列表查询
- **scene_hierarchy**: 场景层级 - 获取完整场景结构，支持组件信息包含
- **scene_execution_control**: 执行控制 - 执行组件方法、场景脚本、预制体同步

### 🎮 节点操作 (node_*)
- **node_query**: 节点查询 - 按名称/模式查找节点，获取节点信息，检测2D/3D类型
- **node_lifecycle**: 节点生命周期 - 创建/删除节点，支持组件预装、预制体实例化
- **node_transform**: 节点变换 - 修改节点名称、位置、旋转、缩放、可见性等属性
- **node_hierarchy**: 节点层级 - 移动、复制、粘贴节点，支持层级结构操作
- **node_clipboard**: 节点剪贴板 - 复制/粘贴/剪切节点操作
- **node_property_management**: 属性管理 - 重置节点属性、组件属性、变换属性

### 🔧 组件操作 (component_*)
- **component_manage**: 组件管理 - 添加/删除引擎组件（cc.Sprite、cc.Button等）
- **component_script**: 脚本组件 - 挂载/移除自定义脚本组件
- **component_query**: 组件查询 - 获取组件列表、详细信息、可用组件类型
- **set_component_property**: 属性设置 - 设置单个或多个组件属性值

### 📦 预制体操作 (prefab_*)
- **prefab_browse**: 预制体浏览 - 列出预制体、查看信息、验证文件
- **prefab_lifecycle**: 预制体生命周期 - 从节点创建预制体、删除预制体
- **prefab_instance**: 预制体实例 - 实例化到场景、解除链接、应用更改、还原原始
- **prefab_edit**: 预制体编辑 - 进入/退出编辑模式、保存预制体、测试更改

### 🚀 项目控制 (project_*)
- **project_manage**: 项目管理 - 运行项目、构建项目、获取项目信息和设置
- **project_build_system**: 构建系统 - 控制构建面板、检查构建状态、预览服务器管理

### 🔍 调试工具 (debug_*)
- **debug_console**: 控制台管理 - 获取/清空控制台日志，支持过滤和限制
- **debug_logs**: 日志分析 - 读取/搜索/分析项目日志文件，支持模式匹配
- **debug_system**: 系统调试 - 获取编辑器信息、性能统计、环境信息

### 📁 资源管理 (asset_*)
- **asset_manage**: 资源管理 - 批量导入/删除资源、保存元数据、生成URL
- **asset_analyze**: 资源分析 - 获取依赖关系、导出资源清单
- **asset_system**: 资源系统 - 刷新资源、查询资源数据库状态
- **asset_query**: 资源查询 - 按类型/文件夹查询资源、获取详细信息
- **asset_operations**: 资源操作 - 创建/复制/移动/删除/保存/重新导入资源

### ⚙️ 偏好设置 (preferences_*)
- **preferences_manage**: 偏好管理 - 获取/设置编辑器偏好设置
- **preferences_global**: 全局设置 - 管理全局配置和系统设置

### 🌐 服务器与广播 (server_* / broadcast_*)
- **server_info**: 服务器信息 - 获取服务器状态、项目详情、环境信息
- **broadcast_message**: 消息广播 - 监听和广播自定义消息

### 🖼️ 参考图片 (referenceImage_*)
- **reference_image_manage**: 参考图片管理 - 添加/删除/管理场景视图中的参考图片
- **reference_image_view**: 参考图片视图 - 控制参考图片的显示和编辑

### 🎨 场景视图 (sceneView_*)
- **scene_view_control**: 场景视图控制 - 控制Gizmo工具、坐标系、视图模式
- **scene_view_tools**: 场景视图工具 - 管理场景视图的各种工具和选项

### ✅ 验证工具 (validation_*)
- **validation_scene**: 场景验证 - 验证场景完整性、检查缺失资源
- **validation_asset**: 资源验证 - 验证资源引用、检查资源完整性

### 🛠️ 工具管理
- **工具配置系统**: 选择性启用/禁用工具，支持多套配置
- **配置持久化**: 自动保存和加载工具配置
- **配置导入导出**: 支持工具配置的导入导出功能
- **实时状态管理**: 工具状态实时更新和同步

### 🚀 核心优势
- **操作码统一**: 所有工具采用"类别_操作"命名，参数Schema统一
- **高复用性**: 50个核心工具覆盖99%编辑器功能
- **AI友好**: 参数清晰、文档完善、调用简单
- **性能优化**: 降低50% token消耗，提升AI调用成功率
- **完全兼容**: 与Cocos Creator官方API 100%对齐

## 安装说明

### 1. 复制插件文件

将整个 `cocos-mcp-server` 文件夹复制到您的 Cocos Creator 项目的 `extensions` 目录中，您也可以直接在扩展管理器中导入项目：

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
│   │   ├── scene-advanced-tools.ts (已整合到 node-tools.ts 和 scene-tools.ts)
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

## 联系我加入群
<img src="https://github.com/user-attachments/assets/2e3f043a-0b03-4b27-a175-e9c31fbed981" width="400" height="400"/>

