<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>工具管理器</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #2a2a2a;
            color: #e0e0e0;
        }

        .container {
            display: flex;
            flex-direction: column;
            height: calc(100vh - 40px);
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
            overflow-y: auto;
            padding-right: 8px;
        }

        /* 容器滚动条样式 */
        .container::-webkit-scrollbar {
            width: 8px;
        }

        .container::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 4px;
        }

        .container::-webkit-scrollbar-thumb {
            background: #5a5a5a;
            border-radius: 4px;
        }

        .container::-webkit-scrollbar-thumb:hover {
            background: #6a6a6a;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            background: linear-gradient(135deg, #3a3a3a 0%, #2d2d2d 100%);
            border: 1px solid #4a4a4a;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
        }

        .config-section {
            background: linear-gradient(135deg, #323232 0%, #2a2a2a 100%);
            border: 1px solid #4a4a4a;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .config-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid #4a4a4a;
        }

        .config-title {
            font-weight: 600;
            font-size: 16px;
            color: #ffffff;
        }

        .config-controls {
            display: flex;
            gap: 10px;
        }

        .config-selector {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            align-items: center;
        }

        .config-selector select {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #5a5a5a;
            border-radius: 6px;
            background: #3a3a3a;
            color: #e0e0e0;
            font-size: 14px;
            transition: all 0.2s;
        }

        .config-selector select:focus {
            outline: none;
            border-color: #007acc;
            box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
        }

        .btn {
            padding: 8px 16px;
            border: 1px solid #5a5a5a;
            border-radius: 6px;
            background: linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%);
            color: #e0e0e0;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .btn:hover {
            background: linear-gradient(135deg, #5a5a5a 0%, #4a4a4a 100%);
            border-color: #6a6a6a;
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .btn-primary {
            background: linear-gradient(135deg, #007acc 0%, #005a9e 100%);
            color: white;
            border-color: #007acc;
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #0088e6 0%, #0066cc 100%);
            border-color: #0088e6;
        }

        .btn-danger {
            background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
            color: white;
            border-color: #d32f2f;
        }

        .btn-danger:hover {
            background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
            border-color: #f44336;
        }

        .tools-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 16px;
            max-height: 500px;
            overflow-y: auto;
            padding: 4px;
        }

        .tool-category {
            background: linear-gradient(135deg, #383838 0%, #2f2f2f 100%);
            border: 1px solid #4a4a4a;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.2s;
        }

        .tool-category:hover {
            border-color: #5a5a5a;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
        }

        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 2px solid #4a4a4a;
        }

        .category-name {
            font-weight: 600;
            font-size: 14px;
            color: #ffffff;
        }

        .category-toggle {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .tool-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .tool-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            margin: 4px 0;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 6px;
            transition: all 0.2s;
        }

        .tool-item:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateX(2px);
        }

        .tool-info {
            flex: 1;
            margin-right: 12px;
        }

        .tool-name {
            font-size: 13px;
            font-weight: 500;
            color: #e0e0e0;
        }

        .tool-description {
            font-size: 12px;
            color: #b0b0b0;
            margin-top: 4px;
            line-height: 1.4;
        }

        .tool-toggle {
            display: flex;
            align-items: center;
        }

        .checkbox {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #007acc;
        }

        .status-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: linear-gradient(135deg, #323232 0%, #2a2a2a 100%);
            border: 1px solid #4a4a4a;
            border-radius: 8px;
            font-size: 13px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .status-info {
            display: flex;
            gap: 20px;
            color: #b0b0b0;
        }

        .status-info span {
            font-weight: 500;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 1000;
        }

        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #3a3a3a 0%, #2d2d2d 100%);
            border: 1px solid #5a5a5a;
            border-radius: 12px;
            padding: 24px;
            min-width: 400px;
            max-width: 600px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid #4a4a4a;
        }

        .modal-title {
            font-weight: 600;
            font-size: 18px;
            color: #ffffff;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #b0b0b0;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
        }

        .modal-close:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.1);
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-label {
            display: block;
            margin-bottom: 6px;
            font-size: 13px;
            font-weight: 500;
            color: #e0e0e0;
        }

        .form-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #5a5a5a;
            border-radius: 6px;
            background: #3a3a3a;
            color: #e0e0e0;
            font-size: 14px;
            transition: all 0.2s;
            box-sizing: border-box;
        }

        .form-input:focus {
            outline: none;
            border-color: #007acc;
            box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
        }

        .form-textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #5a5a5a;
            border-radius: 6px;
            background: #3a3a3a;
            color: #e0e0e0;
            font-size: 14px;
            resize: vertical;
            min-height: 80px;
            transition: all 0.2s;
            box-sizing: border-box;
        }

        .form-textarea:focus {
            outline: none;
            border-color: #007acc;
            box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
        }

        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 16px;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #b0b0b0;
            background: linear-gradient(135deg, #383838 0%, #2f2f2f 100%);
            border: 2px dashed #4a4a4a;
            border-radius: 12px;
            margin: 20px 0;
        }

        .empty-state h3 {
            margin: 0 0 12px 0;
            font-size: 18px;
            color: #e0e0e0;
            font-weight: 600;
        }

        .empty-state p {
            margin: 0;
            font-size: 14px;
            line-height: 1.5;
        }

        /* 滚动条样式 */
        .tools-container::-webkit-scrollbar {
            width: 8px;
        }

        .tools-container::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 4px;
        }

        .tools-container::-webkit-scrollbar-thumb {
            background: #5a5a5a;
            border-radius: 4px;
        }

        .tools-container::-webkit-scrollbar-thumb:hover {
            background: #6a6a6a;
        }

        /* 工具管理区域标题 */
        .tools-section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 16px 20px;
            background: linear-gradient(135deg, #323232 0%, #2a2a2a 100%);
            border: 1px solid #4a4a4a;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .tools-section-title {
            font-weight: 600;
            font-size: 16px;
            color: #ffffff;
        }

        .tools-section-controls {
            display: flex;
            gap: 10px;
        }

        .loading {
            text-align: center;
            padding: 40px 20px;
            color: #b0b0b0;
            font-size: 14px;
        }

        .error {
            background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 13px;
            margin-bottom: 16px;
            border: 1px solid #f44336;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- 头部 -->
        <div class="header">
            <h2 id="panelTitle">工具管理器</h2>
            <div class="config-controls">
                <button class="btn btn-primary" id="createConfigBtn">新建配置</button>
                <button class="btn" id="importConfigBtn">导入配置</button>
                <button class="btn" id="exportConfigBtn">导出配置</button>
            </div>
        </div>

        <!-- 配置选择器 -->
        <div class="config-section">
            <div class="config-header">
                <div class="config-title">当前配置</div>
                <div class="config-controls">
                    <button class="btn" id="editConfigBtn">编辑</button>
                    <button class="btn btn-danger" id="deleteConfigBtn">删除</button>
                </div>
            </div>
            <div class="config-selector">
                <select id="configSelector">
                    <option value="">选择配置...</option>
                </select>
                <button class="btn btn-primary" id="applyConfigBtn">应用</button>
            </div>
        </div>

        <!-- 工具列表 -->
        <div class="config-section">
            <div class="tools-section-header">
                <div class="tools-section-title">工具管理</div>
                <div class="tools-section-controls">
                    <button class="btn" id="selectAllBtn">全选</button>
                    <button class="btn" id="deselectAllBtn">取消全选</button>
                </div>
            </div>
            <div id="toolsContainer" class="tools-container">
                <div class="loading">加载中...</div>
            </div>
        </div>

        <!-- 状态栏 -->
        <div class="status-bar">
            <div class="status-info">
                <span>总工具数: <span id="totalToolsCount">0</span></span>
                <span>已启用: <span id="enabledToolsCount">0</span></span>
                <span>已禁用: <span id="disabledToolsCount">0</span></span>
            </div>
            <div>
                <button class="btn" id="saveChangesBtn">保存更改</button>
            </div>
        </div>
    </div>

    <!-- 新建/编辑配置模态框 -->
    <div id="configModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="modalTitle">新建配置</div>
                <button class="modal-close" id="closeModal">&times;</button>
            </div>
            <form id="configForm">
                <div class="form-group">
                    <label class="form-label" for="configName">配置名称 *</label>
                    <input type="text" id="configName" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="configDescription">描述</label>
                    <textarea id="configDescription" class="form-textarea" placeholder="可选：添加配置描述"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn" id="cancelConfigBtn">取消</button>
                    <button type="submit" class="btn btn-primary" id="saveConfigBtn">保存</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 导入配置模态框 -->
    <div id="importModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">导入配置</div>
                <button class="modal-close" id="closeImportModal">&times;</button>
            </div>
            <div class="form-group">
                <label class="form-label" for="importConfigJson">配置JSON</label>
                <textarea id="importConfigJson" class="form-textarea" placeholder="粘贴配置JSON内容"></textarea>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn" id="cancelImportBtn">取消</button>
                <button type="button" class="btn btn-primary" id="confirmImportBtn">导入</button>
            </div>
        </div>
    </div>

    <script>
        // 这里将包含面板的JavaScript逻辑
    </script>
</body>
</html> 