import { readSettings } from '../../settings';
import { readFileSync } from 'fs-extra';
import { join } from 'path';

/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }

module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('MCP Server panel shown'); },
        hide() { console.log('MCP Server panel hidden'); }
    },
    template: readFileSync(join(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        panelTitle: '#panelTitle',
        serverStatusLabel: '#serverStatusLabel',
        serverStatusLabelProp: '#serverStatusLabelProp',
        serverStatusValue: '#serverStatusValue',
        connectedLabel: '#connectedLabel',
        connectedClients: '#connectedClients',
        toggleServerBtn: '#toggleServerBtn',
        settingsLabel: '#settingsLabel',
        portLabel: '#portLabel',
        autoStartLabel: '#autoStartLabel',
        debugLogLabel: '#debugLogLabel',
        maxConnectionsLabel: '#maxConnectionsLabel',
        connectionInfoLabel: '#connectionInfoLabel',
        httpUrlLabel: '#httpUrlLabel',
        httpUrlInput: '#httpUrlInput',
        copyBtn: '#copyBtn',
        saveSettingsBtn: '#saveSettingsBtn',
        // 新增输入控件id
        portInput: '#portInput',
        maxConnInput: '#maxConnInput',
        autoStartInput: '#autoStartInput',
        debugLogInput: '#debugLogInput',
    },
    methods: {
        async updateServerStatus(this: any) {
            try {
                const status = await Editor.Message.request('cocos-mcp-server', 'get-server-status');
                this.serverRunning = status.running;
                this.connectedClients = status.clients || 0;
                this.serverStatus = this.serverRunning ? 
                    Editor.I18n.t('cocos-mcp-server.connected') : 
                    Editor.I18n.t('cocos-mcp-server.disconnected');
                this.statusClass = this.serverRunning ? 'running' : 'stopped';
                this.buttonText = this.serverRunning ? 
                    Editor.I18n.t('cocos-mcp-server.stop_server') : 
                    Editor.I18n.t('cocos-mcp-server.start_server');
                // 刷新UI
                this.$.serverStatusValue.innerText = this.serverStatus;
                this.$.connectedClients.innerText = this.connectedClients;
                this.$.toggleServerBtn.innerText = this.buttonText;
                if (this.serverRunning) {
                    this.httpUrl = `http://localhost:${this.settings.port}/mcp`;
                    this.$.httpUrlInput.value = this.httpUrl;
                } else {
                    this.httpUrl = '';
                    this.$.httpUrlInput.value = '';
                }
            } catch (err) {
                console.error('Failed to update server status:', err);
            }
        },

        async toggleServer(this: any) {
            this.isProcessing = true;
            try {
                if (this.serverRunning) {
                    await this.stopServer();
                } else {
                    await this.startServer();
                }
            } finally {
                this.isProcessing = false;
            }
        },

        async startServer(this: any) {
            try {
                await Editor.Message.request('cocos-mcp-server', 'start-server');
                Editor.Dialog.info(Editor.I18n.t('cocos-mcp-server.server_started'), {
                    detail: Editor.I18n.t('cocos-mcp-server.server_running').replace('{0}', this.settings.port.toString())
                });
                await this.updateServerStatus();
            } catch (err: any) {
                Editor.Dialog.error(Editor.I18n.t('cocos-mcp-server.failed_to_start'), err.message);
            }
        },

        async stopServer(this: any) {
            try {
                await Editor.Message.request('cocos-mcp-server', 'stop-server');
                Editor.Dialog.info(Editor.I18n.t('cocos-mcp-server.server_stopped_msg'), {
                    detail: Editor.I18n.t('cocos-mcp-server.server_stopped')
                });
                await this.updateServerStatus();
            } catch (err: any) {
                Editor.Dialog.error(Editor.I18n.t('cocos-mcp-server.failed_to_stop'), err.message);
            }
        },

        async saveSettings(this: any) {
            try {
                // 直接用 this.$ 获取所有输入控件的当前值
                const port = this.$.portInput ? Number((this.$.portInput as any).value) : 3000;
                const maxConnections = this.$.maxConnInput ? Number((this.$.maxConnInput as any).value) : 10;
                const autoStart = this.$.autoStartInput ? !!(this.$.autoStartInput as any).checked : false;
                const enableDebugLog = this.$.debugLogInput ? !!(this.$.debugLogInput as any).checked : false;
                // 组装 settings
                const settings = {
                    ...this.settings,
                    port,
                    maxConnections,
                    autoStart,
                    enableDebugLog,
                };
                await Editor.Message.request('cocos-mcp-server', 'update-settings', settings);
                // 重新拉取设置
                const newSettings = await Editor.Message.request('cocos-mcp-server', 'get-server-settings');
                this.settings = newSettings;
                this.originalSettings = JSON.stringify(newSettings);
                Editor.Dialog.info(Editor.I18n.t('cocos-mcp-server.settings_saved'));
            } catch (err: any) {
                Editor.Dialog.error(Editor.I18n.t('cocos-mcp-server.failed_to_save'), err.message);
            }
        },

        copyUrl(this: any) {
            Editor.Clipboard.write('text', this.httpUrl);
            Editor.Dialog.info(Editor.I18n.t('cocos-mcp-server.url_copied'));
        },

        settingsChanged(this: any) {
            return JSON.stringify(this.settings) !== this.originalSettings;
        },
        bindSettingsEvents(this: any) {
            // 端口输入框
            const portInput = document.querySelectorAll('ui-num-input[slot="content"]')[0];
            if (portInput) {
                portInput.addEventListener('change', (e: any) => {
                    this.settings.port = Number(e.detail.value);
                });
            }
            // 最大连接数
            const maxConnInput = document.querySelectorAll('ui-num-input[slot="content"]')[1];
            if (maxConnInput) {
                maxConnInput.addEventListener('change', (e: any) => {
                    this.settings.maxConnections = Number(e.detail.value);
                });
            }
            // 复选框
            const checkboxes = document.querySelectorAll('ui-checkbox[slot="content"]');
            if (checkboxes && checkboxes.length >= 2) {
                checkboxes[0].addEventListener('change', (e: any) => {
                    this.settings.autoStart = !!e.detail.value;
                });
                checkboxes[1].addEventListener('change', (e: any) => {
                    this.settings.enableDebugLog = !!e.detail.value;
                });
            }
        },
        
    },
    ready() {
        Editor.Message.request('cocos-mcp-server', 'get-server-settings').then((settings) => {
            this.settings = settings;
            this.originalSettings = JSON.stringify(settings);
            // 本地化label赋值
            this.$.panelTitle.innerText = Editor.I18n.t('cocos-mcp-server.panel_title');
            this.$.serverStatusLabel.innerText = Editor.I18n.t('cocos-mcp-server.server_status');
            this.$.serverStatusLabelProp.innerText = Editor.I18n.t('cocos-mcp-server.server_status');
            this.$.connectedLabel.innerText = Editor.I18n.t('cocos-mcp-server.connected');
            this.$.settingsLabel.innerText = Editor.I18n.t('cocos-mcp-server.settings');
            this.$.portLabel.innerText = Editor.I18n.t('cocos-mcp-server.port');
            this.$.autoStartLabel.innerText = Editor.I18n.t('cocos-mcp-server.auto_start');
            this.$.debugLogLabel.innerText = Editor.I18n.t('cocos-mcp-server.debug_log');
            this.$.maxConnectionsLabel.innerText = Editor.I18n.t('cocos-mcp-server.max_connections');
            this.$.connectionInfoLabel.innerText = Editor.I18n.t('cocos-mcp-server.connection_info');
            this.$.httpUrlLabel.innerText = Editor.I18n.t('cocos-mcp-server.http_url');
            this.$.copyBtn.innerText = Editor.I18n.t('cocos-mcp-server.copy');
            this.$.saveSettingsBtn.innerText = Editor.I18n.t('cocos-mcp-server.save_settings');
            // 动态内容初始化
            this.$.serverStatusValue.innerText = '';
            this.$.connectedClients.innerText = '';
            this.$.toggleServerBtn.innerText = '';
            this.$.httpUrlInput.value = '';
            // 绑定按钮事件
            this.$.toggleServerBtn.addEventListener('confirm', this.toggleServer.bind(this));
            this.$.saveSettingsBtn.addEventListener('confirm', this.saveSettings.bind(this));
            this.$.copyBtn.addEventListener('confirm', this.copyUrl.bind(this));
            // 延迟绑定事件，确保 UI 组件已渲染
            setTimeout(() => {
                this.bindSettingsEvents();
            }, 100);
            // Set up periodic status updates
            (this as any).statusInterval = setInterval(() => {
                (this as any).updateServerStatus();
            }, 2000);
            // 不再自动启动服务器，用户点击才启动
            (this as any).updateServerStatus();
        });
    },
    beforeClose() {
        if ((this as any).statusInterval) {
            clearInterval((this as any).statusInterval);
        }
    },
    close() {
        // Panel close cleanup
    },
    
    // Direct properties for data access
    serverRunning: false,
    connectedClients: 0,
    serverStatus: '',
    statusClass: 'stopped',
    buttonText: '',
    isProcessing: false,
    settings: {},
    httpUrl: '',
    statusInterval: null as any,
    originalSettings: ''
} as any);