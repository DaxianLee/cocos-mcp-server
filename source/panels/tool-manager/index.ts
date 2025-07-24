import { readFileSync } from 'fs-extra';
import { join } from 'path';

module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('Tool Manager panel shown'); },
        hide() { console.log('Tool Manager panel hidden'); }
    },
    template: readFileSync(join(__dirname, '../../../static/template/default/tool-manager.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        panelTitle: '#panelTitle',
        createConfigBtn: '#createConfigBtn',
        importConfigBtn: '#importConfigBtn',
        exportConfigBtn: '#exportConfigBtn',
        configSelector: '#configSelector',
        applyConfigBtn: '#applyConfigBtn',
        editConfigBtn: '#editConfigBtn',
        deleteConfigBtn: '#deleteConfigBtn',
        toolsContainer: '#toolsContainer',
        selectAllBtn: '#selectAllBtn',
        deselectAllBtn: '#deselectAllBtn',
        saveChangesBtn: '#saveChangesBtn',
        totalToolsCount: '#totalToolsCount',
        enabledToolsCount: '#enabledToolsCount',
        disabledToolsCount: '#disabledToolsCount',
        configModal: '#configModal',
        modalTitle: '#modalTitle',
        configForm: '#configForm',
        configName: '#configName',
        configDescription: '#configDescription',
        closeModal: '#closeModal',
        cancelConfigBtn: '#cancelConfigBtn',
        saveConfigBtn: '#saveConfigBtn',
        importModal: '#importModal',
        importConfigJson: '#importConfigJson',
        closeImportModal: '#closeImportModal',
        cancelImportBtn: '#cancelImportBtn',
        confirmImportBtn: '#confirmImportBtn'
    },
    methods: {
        async loadToolManagerState(this: any) {
            try {
                this.toolManagerState = await Editor.Message.request('cocos-mcp-server', 'getToolManagerState');
                this.currentConfiguration = this.toolManagerState.currentConfiguration;
                this.configurations = this.toolManagerState.configurations;
                this.availableTools = this.toolManagerState.availableTools;
                this.updateUI();
            } catch (error) {
                console.error('Failed to load tool manager state:', error);
                this.showError('加载工具管理器状态失败');
            }
        },

        updateUI(this: any) {
            this.updateConfigSelector();
            this.updateToolsDisplay();
            this.updateStatusBar();
            this.updateButtons();
        },

        updateConfigSelector(this: any) {
            const selector = this.$.configSelector;
            selector.innerHTML = '<option value="">选择配置...</option>';
            
            this.configurations.forEach((config: any) => {
                const option = document.createElement('option');
                option.value = config.id;
                option.textContent = config.name;
                if (this.currentConfiguration && config.id === this.currentConfiguration.id) {
                    option.selected = true;
                }
                selector.appendChild(option);
            });
        },

        updateToolsDisplay(this: any) {
            const container = this.$.toolsContainer;
            
            if (!this.currentConfiguration) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>没有选择配置</h3>
                        <p>请先选择一个配置或创建新配置</p>
                    </div>
                `;
                return;
            }

            const toolsByCategory: any = {};
            this.currentConfiguration.tools.forEach((tool: any) => {
                if (!toolsByCategory[tool.category]) {
                    toolsByCategory[tool.category] = [];
                }
                toolsByCategory[tool.category].push(tool);
            });

            container.innerHTML = '';
            
            Object.entries(toolsByCategory).forEach(([category, tools]: [string, any]) => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'tool-category';
                
                const enabledCount = tools.filter((t: any) => t.enabled).length;
                const totalCount = tools.length;
                
                categoryDiv.innerHTML = `
                    <div class="category-header">
                        <div class="category-name">${this.getCategoryDisplayName(category)}</div>
                        <div class="category-toggle">
                            <span>${enabledCount}/${totalCount}</span>
                            <input type="checkbox" class="checkbox category-checkbox" 
                                   data-category="${category}" 
                                   ${enabledCount === totalCount ? 'checked' : ''}>
                        </div>
                    </div>
                    <div class="tool-list">
                        ${tools.map((tool: any) => `
                            <div class="tool-item">
                                <div class="tool-info">
                                    <div class="tool-name">${tool.name}</div>
                                    <div class="tool-description">${tool.description}</div>
                                </div>
                                <div class="tool-toggle">
                                    <input type="checkbox" class="checkbox tool-checkbox" 
                                           data-category="${tool.category}" 
                                           data-name="${tool.name}" 
                                           ${tool.enabled ? 'checked' : ''}>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                
                container.appendChild(categoryDiv);
            });

            this.bindToolEvents();
        },

        bindToolEvents(this: any) {
            document.querySelectorAll('.category-checkbox').forEach((checkbox: any) => {
                checkbox.addEventListener('change', (e: any) => {
                    const category = e.target.dataset.category;
                    const checked = e.target.checked;
                    this.toggleCategoryTools(category, checked);
                });
            });

            document.querySelectorAll('.tool-checkbox').forEach((checkbox: any) => {
                checkbox.addEventListener('change', (e: any) => {
                    const category = e.target.dataset.category;
                    const name = e.target.dataset.name;
                    const enabled = e.target.checked;
                    this.updateToolStatus(category, name, enabled);
                });
            });
        },

        async toggleCategoryTools(this: any, category: string, enabled: boolean) {
            if (!this.currentConfiguration) return;

            console.log(`Toggling category tools: ${category} = ${enabled}`);

            const categoryTools = this.currentConfiguration.tools.filter((tool: any) => tool.category === category);
            if (categoryTools.length === 0) return;

            const updates = categoryTools.map((tool: any) => ({
                category: tool.category,
                name: tool.name,
                enabled: enabled
            }));

            try {
                // 先更新本地状态
                categoryTools.forEach((tool: any) => {
                    tool.enabled = enabled;
                });
                console.log(`Updated local category state: ${category} = ${enabled}`);
                
                // 立即更新UI
                this.updateStatusBar();
                this.updateCategoryCounts();
                this.updateToolCheckboxes(category, enabled);

                // 然后发送到后端
                await Editor.Message.request('cocos-mcp-server', 'updateToolStatusBatch', 
                    this.currentConfiguration.id, updates);
                
            } catch (error) {
                console.error('Failed to toggle category tools:', error);
                this.showError('切换类别工具失败');
                
                // 如果后端更新失败，回滚本地状态
                categoryTools.forEach((tool: any) => {
                    tool.enabled = !enabled;
                });
                this.updateStatusBar();
                this.updateCategoryCounts();
                this.updateToolCheckboxes(category, !enabled);
            }
        },

        async updateToolStatus(this: any, category: string, name: string, enabled: boolean) {
            if (!this.currentConfiguration) return;

            console.log(`Updating tool status: ${category}.${name} = ${enabled}`);
            console.log(`Current config ID: ${this.currentConfiguration.id}`);

            // 先更新本地状态
            const tool = this.currentConfiguration.tools.find((t: any) => 
                t.category === category && t.name === name);
            if (!tool) {
                console.error(`Tool not found: ${category}.${name}`);
                return;
            }

            try {
                tool.enabled = enabled;
                console.log(`Updated local tool state: ${tool.name} = ${tool.enabled}`);
                
                // 立即更新UI（只更新统计信息，不重新渲染工具列表）
                this.updateStatusBar();
                this.updateCategoryCounts();

                // 然后发送到后端
                console.log(`Sending to backend: configId=${this.currentConfiguration.id}, category=${category}, name=${name}, enabled=${enabled}`);
                const result = await Editor.Message.request('cocos-mcp-server', 'updateToolStatus', 
                    this.currentConfiguration.id, category, name, enabled);
                console.log('Backend response:', result);
                
            } catch (error) {
                console.error('Failed to update tool status:', error);
                this.showError('更新工具状态失败');
                
                // 如果后端更新失败，回滚本地状态
                tool.enabled = !enabled;
                this.updateStatusBar();
                this.updateCategoryCounts();
            }
        },

        updateStatusBar(this: any) {
            if (!this.currentConfiguration) {
                this.$.totalToolsCount.textContent = '0';
                this.$.enabledToolsCount.textContent = '0';
                this.$.disabledToolsCount.textContent = '0';
                return;
            }

            const total = this.currentConfiguration.tools.length;
            const enabled = this.currentConfiguration.tools.filter((t: any) => t.enabled).length;
            const disabled = total - enabled;

            console.log(`Status bar update: total=${total}, enabled=${enabled}, disabled=${disabled}`);

            this.$.totalToolsCount.textContent = total.toString();
            this.$.enabledToolsCount.textContent = enabled.toString();
            this.$.disabledToolsCount.textContent = disabled.toString();
        },

        updateCategoryCounts(this: any) {
            if (!this.currentConfiguration) return;

            // 更新每个类别的计数显示
            document.querySelectorAll('.category-checkbox').forEach((checkbox: any) => {
                const category = checkbox.dataset.category;
                const categoryTools = this.currentConfiguration.tools.filter((t: any) => t.category === category);
                const enabledCount = categoryTools.filter((t: any) => t.enabled).length;
                const totalCount = categoryTools.length;
                
                // 更新计数显示
                const countSpan = checkbox.parentElement.querySelector('span');
                if (countSpan) {
                    countSpan.textContent = `${enabledCount}/${totalCount}`;
                }
                
                // 更新类别复选框状态
                checkbox.checked = enabledCount === totalCount;
            });
        },

        updateToolCheckboxes(this: any, category: string, enabled: boolean) {
            // 更新特定类别的所有工具复选框
            document.querySelectorAll(`.tool-checkbox[data-category="${category}"]`).forEach((checkbox: any) => {
                checkbox.checked = enabled;
            });
        },

        updateButtons(this: any) {
            const hasCurrentConfig = !!this.currentConfiguration;
            this.$.editConfigBtn.disabled = !hasCurrentConfig;
            this.$.deleteConfigBtn.disabled = !hasCurrentConfig;
            this.$.exportConfigBtn.disabled = !hasCurrentConfig;
            this.$.applyConfigBtn.disabled = !hasCurrentConfig;
        },

        async createConfiguration(this: any) {
            this.editingConfig = null;
            this.$.modalTitle.textContent = '新建配置';
            this.$.configName.value = '';
            this.$.configDescription.value = '';
            this.showModal('configModal');
        },

        async editConfiguration(this: any) {
            if (!this.currentConfiguration) return;

            this.editingConfig = this.currentConfiguration;
            this.$.modalTitle.textContent = '编辑配置';
            this.$.configName.value = this.currentConfiguration.name;
            this.$.configDescription.value = this.currentConfiguration.description || '';
            this.showModal('configModal');
        },

        async saveConfiguration(this: any) {
            const name = this.$.configName.value.trim();
            const description = this.$.configDescription.value.trim();

            if (!name) {
                this.showError('配置名称不能为空');
                return;
            }

            try {
                if (this.editingConfig) {
                    await Editor.Message.request('cocos-mcp-server', 'updateToolConfiguration', 
                        this.editingConfig.id, { name, description });
                } else {
                    await Editor.Message.request('cocos-mcp-server', 'createToolConfiguration', name, description);
                }
                
                this.hideModal('configModal');
                await this.loadToolManagerState();
            } catch (error) {
                console.error('Failed to save configuration:', error);
                this.showError('保存配置失败');
            }
        },

        async deleteConfiguration(this: any) {
            if (!this.currentConfiguration) return;

            const confirmed = await Editor.Dialog.warn('确认删除', {
                detail: `确定要删除配置 "${this.currentConfiguration.name}" 吗？此操作不可撤销。`
            });
            
            if (confirmed) {
                try {
                    await Editor.Message.request('cocos-mcp-server', 'deleteToolConfiguration', 
                        this.currentConfiguration.id);
                    await this.loadToolManagerState();
                } catch (error) {
                    console.error('Failed to delete configuration:', error);
                    this.showError('删除配置失败');
                }
            }
        },

        async applyConfiguration(this: any) {
            const configId = this.$.configSelector.value;
            if (!configId) return;

            try {
                await Editor.Message.request('cocos-mcp-server', 'setCurrentToolConfiguration', configId);
                await this.loadToolManagerState();
            } catch (error) {
                console.error('Failed to apply configuration:', error);
                this.showError('应用配置失败');
            }
        },

        async exportConfiguration(this: any) {
            if (!this.currentConfiguration) return;

            try {
                const result = await Editor.Message.request('cocos-mcp-server', 'exportToolConfiguration', 
                    this.currentConfiguration.id);
                
                Editor.Clipboard.write('text', result.configJson);
                Editor.Dialog.info('导出成功', { detail: '配置已复制到剪贴板' });
            } catch (error) {
                console.error('Failed to export configuration:', error);
                this.showError('导出配置失败');
            }
        },

        async importConfiguration(this: any) {
            this.$.importConfigJson.value = '';
            this.showModal('importModal');
        },

        async confirmImport(this: any) {
            const configJson = this.$.importConfigJson.value.trim();
            if (!configJson) {
                this.showError('请输入配置JSON');
                return;
            }

            try {
                await Editor.Message.request('cocos-mcp-server', 'importToolConfiguration', configJson);
                this.hideModal('importModal');
                await this.loadToolManagerState();
                Editor.Dialog.info('导入成功', { detail: '配置已成功导入' });
            } catch (error) {
                console.error('Failed to import configuration:', error);
                this.showError('导入配置失败');
            }
        },

        async selectAllTools(this: any) {
            if (!this.currentConfiguration) return;

            console.log('Selecting all tools');

            const updates = this.currentConfiguration.tools.map((tool: any) => ({
                category: tool.category,
                name: tool.name,
                enabled: true
            }));

            try {
                // 先更新本地状态
                this.currentConfiguration.tools.forEach((tool: any) => {
                    tool.enabled = true;
                });
                console.log('Updated local state: all tools enabled');
                
                // 立即更新UI
                this.updateStatusBar();
                this.updateToolsDisplay();

                // 然后发送到后端
                await Editor.Message.request('cocos-mcp-server', 'updateToolStatusBatch', 
                    this.currentConfiguration.id, updates);
                
            } catch (error) {
                console.error('Failed to select all tools:', error);
                this.showError('全选工具失败');
                
                // 如果后端更新失败，回滚本地状态
                this.currentConfiguration.tools.forEach((tool: any) => {
                    tool.enabled = false;
                });
                this.updateStatusBar();
                this.updateToolsDisplay();
            }
        },

        async deselectAllTools(this: any) {
            if (!this.currentConfiguration) return;

            console.log('Deselecting all tools');

            const updates = this.currentConfiguration.tools.map((tool: any) => ({
                category: tool.category,
                name: tool.name,
                enabled: false
            }));

            try {
                // 先更新本地状态
                this.currentConfiguration.tools.forEach((tool: any) => {
                    tool.enabled = false;
                });
                console.log('Updated local state: all tools disabled');
                
                // 立即更新UI
                this.updateStatusBar();
                this.updateToolsDisplay();

                // 然后发送到后端
                await Editor.Message.request('cocos-mcp-server', 'updateToolStatusBatch', 
                    this.currentConfiguration.id, updates);
                
            } catch (error) {
                console.error('Failed to deselect all tools:', error);
                this.showError('取消全选工具失败');
                
                // 如果后端更新失败，回滚本地状态
                this.currentConfiguration.tools.forEach((tool: any) => {
                    tool.enabled = true;
                });
                this.updateStatusBar();
                this.updateToolsDisplay();
            }
        },

        getCategoryDisplayName(this: any, category: string): string {
            const categoryNames: any = {
                'scene': '场景工具',
                'node': '节点工具',
                'component': '组件工具',
                'prefab': '预制体工具',
                'project': '项目工具',
                'debug': '调试工具',
                'preferences': '偏好设置工具',
                'server': '服务器工具',
                'broadcast': '广播工具',
                'sceneAdvanced': '高级场景工具',
                'sceneView': '场景视图工具',
                'referenceImage': '参考图片工具',
                'assetAdvanced': '高级资源工具',
                'validation': '验证工具'
            };
            return categoryNames[category] || category;
        },

        showModal(this: any, modalId: string) {
            this.$[modalId].style.display = 'block';
        },

        hideModal(this: any, modalId: string) {
            this.$[modalId].style.display = 'none';
        },

        showError(this: any, message: string) {
            Editor.Dialog.error('错误', { detail: message });
        },

        async saveChanges(this: any) {
            if (!this.currentConfiguration) {
                this.showError('没有选择配置');
                return;
            }

            try {
                // 确保当前配置已保存到后端
                await Editor.Message.request('cocos-mcp-server', 'updateToolConfiguration', 
                    this.currentConfiguration.id, {
                        name: this.currentConfiguration.name,
                        description: this.currentConfiguration.description,
                        tools: this.currentConfiguration.tools
                    });
                
                Editor.Dialog.info('保存成功', { detail: '配置更改已保存' });
            } catch (error) {
                console.error('Failed to save changes:', error);
                this.showError('保存更改失败');
            }
        },

        bindEvents(this: any) {
            this.$.createConfigBtn.addEventListener('click', this.createConfiguration.bind(this));
            this.$.editConfigBtn.addEventListener('click', this.editConfiguration.bind(this));
            this.$.deleteConfigBtn.addEventListener('click', this.deleteConfiguration.bind(this));
            this.$.applyConfigBtn.addEventListener('click', this.applyConfiguration.bind(this));
            this.$.exportConfigBtn.addEventListener('click', this.exportConfiguration.bind(this));
            this.$.importConfigBtn.addEventListener('click', this.importConfiguration.bind(this));

            this.$.selectAllBtn.addEventListener('click', this.selectAllTools.bind(this));
            this.$.deselectAllBtn.addEventListener('click', this.deselectAllTools.bind(this));
            this.$.saveChangesBtn.addEventListener('click', this.saveChanges.bind(this));

            this.$.closeModal.addEventListener('click', () => this.hideModal('configModal'));
            this.$.cancelConfigBtn.addEventListener('click', () => this.hideModal('configModal'));
            this.$.configForm.addEventListener('submit', (e: any) => {
                e.preventDefault();
                this.saveConfiguration();
            });

            this.$.closeImportModal.addEventListener('click', () => this.hideModal('importModal'));
            this.$.cancelImportBtn.addEventListener('click', () => this.hideModal('importModal'));
            this.$.confirmImportBtn.addEventListener('click', this.confirmImport.bind(this));

            this.$.configSelector.addEventListener('change', this.applyConfiguration.bind(this));
        }
    },
    ready() {
        (this as any).toolManagerState = null;
        (this as any).currentConfiguration = null;
        (this as any).configurations = [];
        (this as any).availableTools = [];
        (this as any).editingConfig = null;

        (this as any).bindEvents();
        (this as any).loadToolManagerState();
    },
    beforeClose() {
        // 清理工作
    },
    close() {
        // 面板关闭清理
    }
} as any); 