"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
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
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
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
        async updateServerStatus() {
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
                }
                else {
                    this.httpUrl = '';
                    this.$.httpUrlInput.value = '';
                }
            }
            catch (err) {
                console.error('Failed to update server status:', err);
            }
        },
        async toggleServer() {
            this.isProcessing = true;
            try {
                if (this.serverRunning) {
                    await this.stopServer();
                }
                else {
                    await this.startServer();
                }
            }
            finally {
                this.isProcessing = false;
            }
        },
        async startServer() {
            try {
                await Editor.Message.request('cocos-mcp-server', 'start-server');
                Editor.Dialog.info(Editor.I18n.t('cocos-mcp-server.server_started'), {
                    detail: Editor.I18n.t('cocos-mcp-server.server_running').replace('{0}', this.settings.port.toString())
                });
                await this.updateServerStatus();
            }
            catch (err) {
                Editor.Dialog.error(Editor.I18n.t('cocos-mcp-server.failed_to_start'), err.message);
            }
        },
        async stopServer() {
            try {
                await Editor.Message.request('cocos-mcp-server', 'stop-server');
                Editor.Dialog.info(Editor.I18n.t('cocos-mcp-server.server_stopped_msg'), {
                    detail: Editor.I18n.t('cocos-mcp-server.server_stopped')
                });
                await this.updateServerStatus();
            }
            catch (err) {
                Editor.Dialog.error(Editor.I18n.t('cocos-mcp-server.failed_to_stop'), err.message);
            }
        },
        async saveSettings() {
            try {
                // 直接用 this.$ 获取所有输入控件的当前值
                const port = this.$.portInput ? Number(this.$.portInput.value) : 3000;
                const maxConnections = this.$.maxConnInput ? Number(this.$.maxConnInput.value) : 10;
                const autoStart = this.$.autoStartInput ? !!this.$.autoStartInput.checked : false;
                const enableDebugLog = this.$.debugLogInput ? !!this.$.debugLogInput.checked : false;
                // 组装 settings
                const settings = Object.assign(Object.assign({}, this.settings), { port,
                    maxConnections,
                    autoStart,
                    enableDebugLog });
                await Editor.Message.request('cocos-mcp-server', 'update-settings', settings);
                // 重新拉取设置
                const newSettings = await Editor.Message.request('cocos-mcp-server', 'get-server-settings');
                this.settings = newSettings;
                this.originalSettings = JSON.stringify(newSettings);
                Editor.Dialog.info(Editor.I18n.t('cocos-mcp-server.settings_saved'));
            }
            catch (err) {
                Editor.Dialog.error(Editor.I18n.t('cocos-mcp-server.failed_to_save'), err.message);
            }
        },
        copyUrl() {
            Editor.Clipboard.write('text', this.httpUrl);
            Editor.Dialog.info(Editor.I18n.t('cocos-mcp-server.url_copied'));
        },
        settingsChanged() {
            return JSON.stringify(this.settings) !== this.originalSettings;
        },
        bindSettingsEvents() {
            // 端口输入框
            const portInput = document.querySelectorAll('ui-num-input[slot="content"]')[0];
            if (portInput) {
                portInput.addEventListener('change', (e) => {
                    this.settings.port = Number(e.detail.value);
                });
            }
            // 最大连接数
            const maxConnInput = document.querySelectorAll('ui-num-input[slot="content"]')[1];
            if (maxConnInput) {
                maxConnInput.addEventListener('change', (e) => {
                    this.settings.maxConnections = Number(e.detail.value);
                });
            }
            // 复选框
            const checkboxes = document.querySelectorAll('ui-checkbox[slot="content"]');
            if (checkboxes && checkboxes.length >= 2) {
                checkboxes[0].addEventListener('change', (e) => {
                    this.settings.autoStart = !!e.detail.value;
                });
                checkboxes[1].addEventListener('change', (e) => {
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
            this.statusInterval = setInterval(() => {
                this.updateServerStatus();
            }, 2000);
            // 不再自动启动服务器，用户点击才启动
            this.updateServerStatus();
        });
    },
    beforeClose() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
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
    statusInterval: null,
    originalSettings: ''
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvcGFuZWxzL2RlZmF1bHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx1Q0FBd0M7QUFDeEMsK0JBQTRCO0FBRTVCOzs7R0FHRztBQUNILHlGQUF5RjtBQUV6RixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2pDLFNBQVMsRUFBRTtRQUNQLElBQUksS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELElBQUksS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3JEO0lBQ0QsUUFBUSxFQUFFLElBQUEsdUJBQVksRUFBQyxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsNkNBQTZDLENBQUMsRUFBRSxPQUFPLENBQUM7SUFDL0YsS0FBSyxFQUFFLElBQUEsdUJBQVksRUFBQyxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUseUNBQXlDLENBQUMsRUFBRSxPQUFPLENBQUM7SUFDeEYsQ0FBQyxFQUFFO1FBQ0MsVUFBVSxFQUFFLGFBQWE7UUFDekIsaUJBQWlCLEVBQUUsb0JBQW9CO1FBQ3ZDLHFCQUFxQixFQUFFLHdCQUF3QjtRQUMvQyxpQkFBaUIsRUFBRSxvQkFBb0I7UUFDdkMsY0FBYyxFQUFFLGlCQUFpQjtRQUNqQyxnQkFBZ0IsRUFBRSxtQkFBbUI7UUFDckMsZUFBZSxFQUFFLGtCQUFrQjtRQUNuQyxhQUFhLEVBQUUsZ0JBQWdCO1FBQy9CLFNBQVMsRUFBRSxZQUFZO1FBQ3ZCLGNBQWMsRUFBRSxpQkFBaUI7UUFDakMsYUFBYSxFQUFFLGdCQUFnQjtRQUMvQixtQkFBbUIsRUFBRSxzQkFBc0I7UUFDM0MsbUJBQW1CLEVBQUUsc0JBQXNCO1FBQzNDLFlBQVksRUFBRSxlQUFlO1FBQzdCLFlBQVks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QUMsQ0FBQyxDQUFDO1lBQ2pGLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLHFCQUFxQjtZQUNyQixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNaLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzlCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNSLGlDQUFpQztZQUNoQyxJQUFZLENBQUMsY0FBYyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUU7Z0JBQzNDLElBQVksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3ZDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNULG9CQUFvQjtZQUNuQixJQUFZLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCxXQUFXO1FBQ1AsSUFBSyxJQUFZLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDL0IsYUFBYSxDQUFFLElBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNoRCxDQUFDO0lBQ0wsQ0FBQztJQUNELEtBQUs7UUFDRCxzQkFBc0I7SUFDMUIsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxhQUFhLEVBQUUsS0FBSztJQUNwQixnQkFBZ0IsRUFBRSxDQUFDO0lBQ25CLFlBQVksRUFBRSxFQUFFO0lBQ2hCLFdBQVcsRUFBRSxTQUFTO0lBQ3RCLFVBQVUsRUFBRSxFQUFFO0lBQ2QsWUFBWSxFQUFFLEtBQUs7SUFDbkIsUUFBUSxFQUFFLEVBQUU7SUFDWixPQUFPLEVBQUUsRUFBRTtJQUNYLGNBQWMsRUFBRSxJQUFXO0lBQzNCLGdCQUFnQixFQUFFLEVBQUU7Q0FDaEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVhZFNldHRpbmdzIH0gZnJvbSAnLi4vLi4vc2V0dGluZ3MnO1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuXG4vKipcbiAqIEB6aCDlpoLmnpzluIzmnJvlhbzlrrkgMy4zIOS5i+WJjeeahOeJiOacrOWPr+S7peS9v+eUqOS4i+aWueeahOS7o+eggVxuICogQGVuIFlvdSBjYW4gYWRkIHRoZSBjb2RlIGJlbG93IGlmIHlvdSB3YW50IGNvbXBhdGliaWxpdHkgd2l0aCB2ZXJzaW9ucyBwcmlvciB0byAzLjNcbiAqL1xuLy8gRWRpdG9yLlBhbmVsLmRlZmluZSA9IEVkaXRvci5QYW5lbC5kZWZpbmUgfHwgZnVuY3Rpb24ob3B0aW9uczogYW55KSB7IHJldHVybiBvcHRpb25zIH1cblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3IuUGFuZWwuZGVmaW5lKHtcbiAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICAgc2hvdygpIHsgY29uc29sZS5sb2coJ01DUCBTZXJ2ZXIgcGFuZWwgc2hvd24nKTsgfSxcbiAgICAgICAgaGlkZSgpIHsgY29uc29sZS5sb2coJ01DUCBTZXJ2ZXIgcGFuZWwgaGlkZGVuJyk7IH1cbiAgICB9LFxuICAgIHRlbXBsYXRlOiByZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9zdGF0aWMvdGVtcGxhdGUvZGVmYXVsdC9pbmRleC5odG1sJyksICd1dGYtOCcpLFxuICAgIHN0eWxlOiByZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9zdGF0aWMvc3R5bGUvZGVmYXVsdC9pbmRleC5jc3MnKSwgJ3V0Zi04JyksXG4gICAgJDoge1xuICAgICAgICBwYW5lbFRpdGxlOiAnI3BhbmVsVGl0bGUnLFxuICAgICAgICBzZXJ2ZXJTdGF0dXNMYWJlbDogJyNzZXJ2ZXJTdGF0dXNMYWJlbCcsXG4gICAgICAgIHNlcnZlclN0YXR1c0xhYmVsUHJvcDogJyNzZXJ2ZXJTdGF0dXNMYWJlbFByb3AnLFxuICAgICAgICBzZXJ2ZXJTdGF0dXNWYWx1ZTogJyNzZXJ2ZXJTdGF0dXNWYWx1ZScsXG4gICAgICAgIGNvbm5lY3RlZExhYmVsOiAnI2Nvbm5lY3RlZExhYmVsJyxcbiAgICAgICAgY29ubmVjdGVkQ2xpZW50czogJyNjb25uZWN0ZWRDbGllbnRzJyxcbiAgICAgICAgdG9nZ2xlU2VydmVyQnRuOiAnI3RvZ2dsZVNlcnZlckJ0bicsXG4gICAgICAgIHNldHRpbmdzTGFiZWw6ICcjc2V0dGluZ3NMYWJlbCcsXG4gICAgICAgIHBvcnRMYWJlbDogJyNwb3J0TGFiZWwnLFxuICAgICAgICBhdXRvU3RhcnRMYWJlbDogJyNhdXRvU3RhcnRMYWJlbCcsXG4gICAgICAgIGRlYnVnTG9nTGFiZWw6ICcjZGVidWdMb2dMYWJlbCcsXG4gICAgICAgIG1heENvbm5lY3Rpb25zTGFiZWw6ICcjbWF4Q29ubmVjdGlvbnNMYWJlbCcsXG4gICAgICAgIGNvbm5lY3Rpb25JbmZvTGFiZWw6ICcjY29ubmVjdGlvbkluZm9MYWJlbCcsXG4gICAgICAgIGh0dHBVcmxMYWJlbDogJyNodHRwVXJsTGFiZWwnLFxuICAgICAgICBodHRwVXJsSW5wdXQ6ICcjaHR0cFVybElucHV0JyxcbiAgICAgICAgY29weUJ0bjogJyNjb3B5QnRuJyxcbiAgICAgICAgc2F2ZVNldHRpbmdzQnRuOiAnI3NhdmVTZXR0aW5nc0J0bicsXG4gICAgICAgIC8vIOaWsOWinui+k+WFpeaOp+S7tmlkXG4gICAgICAgIHBvcnRJbnB1dDogJyNwb3J0SW5wdXQnLFxuICAgICAgICBtYXhDb25uSW5wdXQ6ICcjbWF4Q29ubklucHV0JyxcbiAgICAgICAgYXV0b1N0YXJ0SW5wdXQ6ICcjYXV0b1N0YXJ0SW5wdXQnLFxuICAgICAgICBkZWJ1Z0xvZ0lucHV0OiAnI2RlYnVnTG9nSW5wdXQnLFxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBhc3luYyB1cGRhdGVTZXJ2ZXJTdGF0dXModGhpczogYW55KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2NvY29zLW1jcC1zZXJ2ZXInLCAnZ2V0LXNlcnZlci1zdGF0dXMnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlclJ1bm5pbmcgPSBzdGF0dXMucnVubmluZztcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RlZENsaWVudHMgPSBzdGF0dXMuY2xpZW50cyB8fCAwO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyU3RhdHVzID0gdGhpcy5zZXJ2ZXJSdW5uaW5nID8gXG4gICAgICAgICAgICAgICAgICAgIEVkaXRvci5JMThuLnQoJ2NvY29zLW1jcC1zZXJ2ZXIuY29ubmVjdGVkJykgOiBcbiAgICAgICAgICAgICAgICAgICAgRWRpdG9yLkkxOG4udCgnY29jb3MtbWNwLXNlcnZlci5kaXNjb25uZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c0NsYXNzID0gdGhpcy5zZXJ2ZXJSdW5uaW5nID8gJ3J1bm5pbmcnIDogJ3N0b3BwZWQnO1xuICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uVGV4dCA9IHRoaXMuc2VydmVyUnVubmluZyA/IFxuICAgICAgICAgICAgICAgICAgICBFZGl0b3IuSTE4bi50KCdjb2Nvcy1tY3Atc2VydmVyLnN0b3Bfc2VydmVyJykgOiBcbiAgICAgICAgICAgICAgICAgICAgRWRpdG9yLkkxOG4udCgnY29jb3MtbWNwLXNlcnZlci5zdGFydF9zZXJ2ZXInKTtcbiAgICAgICAgICAgICAgICAvLyDliLfmlrBVSVxuICAgICAgICAgICAgICAgIHRoaXMuJC5zZXJ2ZXJTdGF0dXNWYWx1ZS5pbm5lclRleHQgPSB0aGlzLnNlcnZlclN0YXR1cztcbiAgICAgICAgICAgICAgICB0aGlzLiQuY29ubmVjdGVkQ2xpZW50cy5pbm5lclRleHQgPSB0aGlzLmNvbm5lY3RlZENsaWVudHM7XG4gICAgICAgICAgICAgICAgdGhpcy4kLnRvZ2dsZVNlcnZlckJ0bi5pbm5lclRleHQgPSB0aGlzLmJ1dHRvblRleHQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VydmVyUnVubmluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBVcmwgPSBgaHR0cDovL2xvY2FsaG9zdDoke3RoaXMuc2V0dGluZ3MucG9ydH0vbWNwYDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kLmh0dHBVcmxJbnB1dC52YWx1ZSA9IHRoaXMuaHR0cFVybDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBVcmwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kLmh0dHBVcmxJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byB1cGRhdGUgc2VydmVyIHN0YXR1czonLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGFzeW5jIHRvZ2dsZVNlcnZlcih0aGlzOiBhbnkpIHtcbiAgICAgICAgICAgIHRoaXMuaXNQcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VydmVyUnVubmluZykge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnN0b3BTZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnN0YXJ0U2VydmVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzUHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGFzeW5jIHN0YXJ0U2VydmVyKHRoaXM6IGFueSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdjb2Nvcy1tY3Atc2VydmVyJywgJ3N0YXJ0LXNlcnZlcicpO1xuICAgICAgICAgICAgICAgIEVkaXRvci5EaWFsb2cuaW5mbyhFZGl0b3IuSTE4bi50KCdjb2Nvcy1tY3Atc2VydmVyLnNlcnZlcl9zdGFydGVkJyksIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBFZGl0b3IuSTE4bi50KCdjb2Nvcy1tY3Atc2VydmVyLnNlcnZlcl9ydW5uaW5nJykucmVwbGFjZSgnezB9JywgdGhpcy5zZXR0aW5ncy5wb3J0LnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy51cGRhdGVTZXJ2ZXJTdGF0dXMoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgRWRpdG9yLkRpYWxvZy5lcnJvcihFZGl0b3IuSTE4bi50KCdjb2Nvcy1tY3Atc2VydmVyLmZhaWxlZF90b19zdGFydCcpLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXN5bmMgc3RvcFNlcnZlcih0aGlzOiBhbnkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnY29jb3MtbWNwLXNlcnZlcicsICdzdG9wLXNlcnZlcicpO1xuICAgICAgICAgICAgICAgIEVkaXRvci5EaWFsb2cuaW5mbyhFZGl0b3IuSTE4bi50KCdjb2Nvcy1tY3Atc2VydmVyLnNlcnZlcl9zdG9wcGVkX21zZycpLCB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogRWRpdG9yLkkxOG4udCgnY29jb3MtbWNwLXNlcnZlci5zZXJ2ZXJfc3RvcHBlZCcpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy51cGRhdGVTZXJ2ZXJTdGF0dXMoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgRWRpdG9yLkRpYWxvZy5lcnJvcihFZGl0b3IuSTE4bi50KCdjb2Nvcy1tY3Atc2VydmVyLmZhaWxlZF90b19zdG9wJyksIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBhc3luYyBzYXZlU2V0dGluZ3ModGhpczogYW55KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIOebtOaOpeeUqCB0aGlzLiQg6I635Y+W5omA5pyJ6L6T5YWl5o6n5Lu255qE5b2T5YmN5YC8XG4gICAgICAgICAgICAgICAgY29uc3QgcG9ydCA9IHRoaXMuJC5wb3J0SW5wdXQgPyBOdW1iZXIoKHRoaXMuJC5wb3J0SW5wdXQgYXMgYW55KS52YWx1ZSkgOiAzMDAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1heENvbm5lY3Rpb25zID0gdGhpcy4kLm1heENvbm5JbnB1dCA/IE51bWJlcigodGhpcy4kLm1heENvbm5JbnB1dCBhcyBhbnkpLnZhbHVlKSA6IDEwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGF1dG9TdGFydCA9IHRoaXMuJC5hdXRvU3RhcnRJbnB1dCA/ICEhKHRoaXMuJC5hdXRvU3RhcnRJbnB1dCBhcyBhbnkpLmNoZWNrZWQgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmFibGVEZWJ1Z0xvZyA9IHRoaXMuJC5kZWJ1Z0xvZ0lucHV0ID8gISEodGhpcy4kLmRlYnVnTG9nSW5wdXQgYXMgYW55KS5jaGVja2VkIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8g57uE6KOFIHNldHRpbmdzXG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuc2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgICAgIHBvcnQsXG4gICAgICAgICAgICAgICAgICAgIG1heENvbm5lY3Rpb25zLFxuICAgICAgICAgICAgICAgICAgICBhdXRvU3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZURlYnVnTG9nLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnY29jb3MtbWNwLXNlcnZlcicsICd1cGRhdGUtc2V0dGluZ3MnLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgLy8g6YeN5paw5ouJ5Y+W6K6+572uXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U2V0dGluZ3MgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdjb2Nvcy1tY3Atc2VydmVyJywgJ2dldC1zZXJ2ZXItc2V0dGluZ3MnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzID0gbmV3U2V0dGluZ3M7XG4gICAgICAgICAgICAgICAgdGhpcy5vcmlnaW5hbFNldHRpbmdzID0gSlNPTi5zdHJpbmdpZnkobmV3U2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIEVkaXRvci5EaWFsb2cuaW5mbyhFZGl0b3IuSTE4bi50KCdjb2Nvcy1tY3Atc2VydmVyLnNldHRpbmdzX3NhdmVkJykpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgICAgICBFZGl0b3IuRGlhbG9nLmVycm9yKEVkaXRvci5JMThuLnQoJ2NvY29zLW1jcC1zZXJ2ZXIuZmFpbGVkX3RvX3NhdmUnKSwgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvcHlVcmwodGhpczogYW55KSB7XG4gICAgICAgICAgICBFZGl0b3IuQ2xpcGJvYXJkLndyaXRlKCd0ZXh0JywgdGhpcy5odHRwVXJsKTtcbiAgICAgICAgICAgIEVkaXRvci5EaWFsb2cuaW5mbyhFZGl0b3IuSTE4bi50KCdjb2Nvcy1tY3Atc2VydmVyLnVybF9jb3BpZWQnKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0dGluZ3NDaGFuZ2VkKHRoaXM6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuc2V0dGluZ3MpICE9PSB0aGlzLm9yaWdpbmFsU2V0dGluZ3M7XG4gICAgICAgIH0sXG4gICAgICAgIGJpbmRTZXR0aW5nc0V2ZW50cyh0aGlzOiBhbnkpIHtcbiAgICAgICAgICAgIC8vIOerr+WPo+i+k+WFpeahhlxuICAgICAgICAgICAgY29uc3QgcG9ydElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndWktbnVtLWlucHV0W3Nsb3Q9XCJjb250ZW50XCJdJylbMF07XG4gICAgICAgICAgICBpZiAocG9ydElucHV0KSB7XG4gICAgICAgICAgICAgICAgcG9ydElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5wb3J0ID0gTnVtYmVyKGUuZGV0YWlsLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIOacgOWkp+i/nuaOpeaVsFxuICAgICAgICAgICAgY29uc3QgbWF4Q29ubklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndWktbnVtLWlucHV0W3Nsb3Q9XCJjb250ZW50XCJdJylbMV07XG4gICAgICAgICAgICBpZiAobWF4Q29ubklucHV0KSB7XG4gICAgICAgICAgICAgICAgbWF4Q29ubklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5tYXhDb25uZWN0aW9ucyA9IE51bWJlcihlLmRldGFpbC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDlpI3pgInmoYZcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrYm94ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd1aS1jaGVja2JveFtzbG90PVwiY29udGVudFwiXScpO1xuICAgICAgICAgICAgaWYgKGNoZWNrYm94ZXMgJiYgY2hlY2tib3hlcy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICAgIGNoZWNrYm94ZXNbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGU6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLmF1dG9TdGFydCA9ICEhZS5kZXRhaWwudmFsdWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY2hlY2tib3hlc1sxXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZW5hYmxlRGVidWdMb2cgPSAhIWUuZGV0YWlsLnZhbHVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcbiAgICB9LFxuICAgIHJlYWR5KCkge1xuICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdjb2Nvcy1tY3Atc2VydmVyJywgJ2dldC1zZXJ2ZXItc2V0dGluZ3MnKS50aGVuKChzZXR0aW5ncykgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbFNldHRpbmdzID0gSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpO1xuICAgICAgICAgICAgLy8g5pys5Zyw5YyWbGFiZWzotYvlgLxcbiAgICAgICAgICAgIHRoaXMuJC5wYW5lbFRpdGxlLmlubmVyVGV4dCA9IEVkaXRvci5JMThuLnQoJ2NvY29zLW1jcC1zZXJ2ZXIucGFuZWxfdGl0bGUnKTtcbiAgICAgICAgICAgIHRoaXMuJC5zZXJ2ZXJTdGF0dXNMYWJlbC5pbm5lclRleHQgPSBFZGl0b3IuSTE4bi50KCdjb2Nvcy1tY3Atc2VydmVyLnNlcnZlcl9zdGF0dXMnKTtcbiAgICAgICAgICAgIHRoaXMuJC5zZXJ2ZXJTdGF0dXNMYWJlbFByb3AuaW5uZXJUZXh0ID0gRWRpdG9yLkkxOG4udCgnY29jb3MtbWNwLXNlcnZlci5zZXJ2ZXJfc3RhdHVzJyk7XG4gICAgICAgICAgICB0aGlzLiQuY29ubmVjdGVkTGFiZWwuaW5uZXJUZXh0ID0gRWRpdG9yLkkxOG4udCgnY29jb3MtbWNwLXNlcnZlci5jb25uZWN0ZWQnKTtcbiAgICAgICAgICAgIHRoaXMuJC5zZXR0aW5nc0xhYmVsLmlubmVyVGV4dCA9IEVkaXRvci5JMThuLnQoJ2NvY29zLW1jcC1zZXJ2ZXIuc2V0dGluZ3MnKTtcbiAgICAgICAgICAgIHRoaXMuJC5wb3J0TGFiZWwuaW5uZXJUZXh0ID0gRWRpdG9yLkkxOG4udCgnY29jb3MtbWNwLXNlcnZlci5wb3J0Jyk7XG4gICAgICAgICAgICB0aGlzLiQuYXV0b1N0YXJ0TGFiZWwuaW5uZXJUZXh0ID0gRWRpdG9yLkkxOG4udCgnY29jb3MtbWNwLXNlcnZlci5hdXRvX3N0YXJ0Jyk7XG4gICAgICAgICAgICB0aGlzLiQuZGVidWdMb2dMYWJlbC5pbm5lclRleHQgPSBFZGl0b3IuSTE4bi50KCdjb2Nvcy1tY3Atc2VydmVyLmRlYnVnX2xvZycpO1xuICAgICAgICAgICAgdGhpcy4kLm1heENvbm5lY3Rpb25zTGFiZWwuaW5uZXJUZXh0ID0gRWRpdG9yLkkxOG4udCgnY29jb3MtbWNwLXNlcnZlci5tYXhfY29ubmVjdGlvbnMnKTtcbiAgICAgICAgICAgIHRoaXMuJC5jb25uZWN0aW9uSW5mb0xhYmVsLmlubmVyVGV4dCA9IEVkaXRvci5JMThuLnQoJ2NvY29zLW1jcC1zZXJ2ZXIuY29ubmVjdGlvbl9pbmZvJyk7XG4gICAgICAgICAgICB0aGlzLiQuaHR0cFVybExhYmVsLmlubmVyVGV4dCA9IEVkaXRvci5JMThuLnQoJ2NvY29zLW1jcC1zZXJ2ZXIuaHR0cF91cmwnKTtcbiAgICAgICAgICAgIHRoaXMuJC5jb3B5QnRuLmlubmVyVGV4dCA9IEVkaXRvci5JMThuLnQoJ2NvY29zLW1jcC1zZXJ2ZXIuY29weScpO1xuICAgICAgICAgICAgdGhpcy4kLnNhdmVTZXR0aW5nc0J0bi5pbm5lclRleHQgPSBFZGl0b3IuSTE4bi50KCdjb2Nvcy1tY3Atc2VydmVyLnNhdmVfc2V0dGluZ3MnKTtcbiAgICAgICAgICAgIC8vIOWKqOaAgeWGheWuueWIneWni+WMllxuICAgICAgICAgICAgdGhpcy4kLnNlcnZlclN0YXR1c1ZhbHVlLmlubmVyVGV4dCA9ICcnO1xuICAgICAgICAgICAgdGhpcy4kLmNvbm5lY3RlZENsaWVudHMuaW5uZXJUZXh0ID0gJyc7XG4gICAgICAgICAgICB0aGlzLiQudG9nZ2xlU2VydmVyQnRuLmlubmVyVGV4dCA9ICcnO1xuICAgICAgICAgICAgdGhpcy4kLmh0dHBVcmxJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgLy8g57uR5a6a5oyJ6ZKu5LqL5Lu2XG4gICAgICAgICAgICB0aGlzLiQudG9nZ2xlU2VydmVyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbmZpcm0nLCB0aGlzLnRvZ2dsZVNlcnZlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuJC5zYXZlU2V0dGluZ3NCdG4uYWRkRXZlbnRMaXN0ZW5lcignY29uZmlybScsIHRoaXMuc2F2ZVNldHRpbmdzLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy4kLmNvcHlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY29uZmlybScsIHRoaXMuY29weVVybC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIC8vIOW7tui/n+e7keWumuS6i+S7tu+8jOehruS/nSBVSSDnu4Tku7blt7LmuLLmn5NcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZFNldHRpbmdzRXZlbnRzKCk7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgLy8gU2V0IHVwIHBlcmlvZGljIHN0YXR1cyB1cGRhdGVzXG4gICAgICAgICAgICAodGhpcyBhcyBhbnkpLnN0YXR1c0ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSkudXBkYXRlU2VydmVyU3RhdHVzKCk7XG4gICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICAgIC8vIOS4jeWGjeiHquWKqOWQr+WKqOacjeWKoeWZqO+8jOeUqOaIt+eCueWHu+aJjeWQr+WKqFxuICAgICAgICAgICAgKHRoaXMgYXMgYW55KS51cGRhdGVTZXJ2ZXJTdGF0dXMoKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBiZWZvcmVDbG9zZSgpIHtcbiAgICAgICAgaWYgKCh0aGlzIGFzIGFueSkuc3RhdHVzSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoKHRoaXMgYXMgYW55KS5zdGF0dXNJbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNsb3NlKCkge1xuICAgICAgICAvLyBQYW5lbCBjbG9zZSBjbGVhbnVwXG4gICAgfSxcbiAgICBcbiAgICAvLyBEaXJlY3QgcHJvcGVydGllcyBmb3IgZGF0YSBhY2Nlc3NcbiAgICBzZXJ2ZXJSdW5uaW5nOiBmYWxzZSxcbiAgICBjb25uZWN0ZWRDbGllbnRzOiAwLFxuICAgIHNlcnZlclN0YXR1czogJycsXG4gICAgc3RhdHVzQ2xhc3M6ICdzdG9wcGVkJyxcbiAgICBidXR0b25UZXh0OiAnJyxcbiAgICBpc1Byb2Nlc3Npbmc6IGZhbHNlLFxuICAgIHNldHRpbmdzOiB7fSxcbiAgICBodHRwVXJsOiAnJyxcbiAgICBzdGF0dXNJbnRlcnZhbDogbnVsbCBhcyBhbnksXG4gICAgb3JpZ2luYWxTZXR0aW5nczogJydcbn0gYXMgYW55KTsiXX0=