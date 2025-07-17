import * as http from 'http';
import * as url from 'url';
import { v4 as uuidv4 } from 'uuid';
import { MCPServerSettings, ServerStatus, MCPClient, ToolDefinition } from './types';
import { SceneTools } from './tools/scene-tools';
import { NodeTools } from './tools/node-tools';
import { ComponentTools } from './tools/component-tools';
import { PrefabTools } from './tools/prefab-tools';
import { ProjectTools } from './tools/project-tools';
import { DebugTools } from './tools/debug-tools';
import { PreferencesTools } from './tools/preferences-tools';
import { ServerTools } from './tools/server-tools';
import { BroadcastTools } from './tools/broadcast-tools';

export class MCPServer {
    private settings: MCPServerSettings;
    private httpServer: http.Server | null = null;
    private clients: Map<string, MCPClient> = new Map();
    private tools: Record<string, any> = {};
    private toolsList: ToolDefinition[] = [];

    constructor(settings: MCPServerSettings) {
        this.settings = settings;
        this.initializeTools();
    }

    private initializeTools(): void {
        try {
            console.log('[MCPServer] Initializing tools...');
            this.tools.scene = new SceneTools();
            this.tools.node = new NodeTools();
            this.tools.component = new ComponentTools();
            this.tools.prefab = new PrefabTools();
            this.tools.project = new ProjectTools();
            this.tools.debug = new DebugTools();
            this.tools.preferences = new PreferencesTools();
            this.tools.server = new ServerTools();
            this.tools.broadcast = new BroadcastTools();
            console.log('[MCPServer] Tools initialized successfully');
        } catch (error) {
            console.error('[MCPServer] Error initializing tools:', error);
            throw error;
        }
    }

    public async start(): Promise<void> {
        if (this.httpServer) {
            console.log('[MCPServer] Server is already running');
            return;
        }

        try {
            console.log(`[MCPServer] Starting HTTP server on port ${this.settings.port}...`);
            this.httpServer = http.createServer(this.handleHttpRequest.bind(this));

            await new Promise<void>((resolve, reject) => {
                this.httpServer!.listen(this.settings.port, '127.0.0.1', () => {
                    console.log(`[MCPServer] ✅ HTTP server started successfully on http://127.0.0.1:${this.settings.port}`);
                    console.log(`[MCPServer] Health check: http://127.0.0.1:${this.settings.port}/health`);
                    console.log(`[MCPServer] MCP endpoint: http://127.0.0.1:${this.settings.port}/mcp`);
                    resolve();
                });
                this.httpServer!.on('error', (err: any) => {
                    console.error('[MCPServer] ❌ Failed to start server:', err);
                    if (err.code === 'EADDRINUSE') {
                        console.error(`[MCPServer] Port ${this.settings.port} is already in use. Please change the port in settings.`);
                    }
                    reject(err);
                });
            });

            this.setupTools();
            console.log('[MCPServer] 🚀 MCP Server is ready for connections');
        } catch (error) {
            console.error('[MCPServer] ❌ Failed to start server:', error);
            throw error;
        }
    }

    private setupTools(): void {
        this.toolsList = [];
        
        for (const [category, toolSet] of Object.entries(this.tools)) {
            const tools = toolSet.getTools();
            for (const tool of tools) {
                this.toolsList.push({
                    name: `${category}_${tool.name}`,
                    description: tool.description,
                    inputSchema: tool.inputSchema
                });
            }
        }

    }

    public async executeToolCall(toolName: string, args: any): Promise<any> {
        const parts = toolName.split('_');
        const category = parts[0];
        const toolMethodName = parts.slice(1).join('_');
        
        if (this.tools[category]) {
            return await this.tools[category].execute(toolMethodName, args);
        }
        
        throw new Error(`Tool ${toolName} not found`);
    }

    public getClients(): MCPClient[] {
        return Array.from(this.clients.values());
    }
    public getAvailableTools(): ToolDefinition[] {
        return this.toolsList;
    }

    public getSettings(): MCPServerSettings {
        return this.settings;
    }

    private async handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        const parsedUrl = url.parse(req.url || '', true);
        const pathname = parsedUrl.pathname;
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'application/json');
        
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        try {
            if (pathname === '/mcp' && req.method === 'POST') {
                await this.handleMCPRequest(req, res);
            } else if (pathname === '/health' && req.method === 'GET') {
                res.writeHead(200);
                res.end(JSON.stringify({ status: 'ok', tools: this.toolsList.length }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Not found' }));
            }
        } catch (error) {
            console.error('HTTP request error:', error);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    }
    
    private async handleMCPRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        let body = '';
        
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const message = JSON.parse(body);
                const response = await this.handleMessage(message);
                res.writeHead(200);
                res.end(JSON.stringify(response));
            } catch (error) {
                console.error('Error handling MCP request:', error);
                res.writeHead(400);
                res.end(JSON.stringify({
                    jsonrpc: '2.0',
                    id: null,
                    error: {
                        code: -32700,
                        message: 'Parse error'
                    }
                }));
            }
        });
    }

    private async handleMessage(message: any): Promise<any> {
        const { id, method, params } = message;

        try {
            let result: any;

            switch (method) {
                case 'tools/list':
                    result = { tools: this.getAvailableTools() };
                    break;
                case 'tools/call':
                    const { name, arguments: args } = params;
                    const toolResult = await this.executeToolCall(name, args);
                    result = { content: [{ type: 'text', text: JSON.stringify(toolResult) }] };
                    break;
                case 'initialize':
                    // MCP initialization
                    result = {
                        protocolVersion: '2024-11-05',
                        capabilities: {
                            tools: {}
                        },
                        serverInfo: {
                            name: 'cocos-mcp-server',
                            version: '1.0.0'
                        }
                    };
                    break;
                default:
                    throw new Error(`Unknown method: ${method}`);
            }

            return {
                jsonrpc: '2.0',
                id,
                result
            };
        } catch (error: any) {
            return {
                jsonrpc: '2.0',
                id,
                error: {
                    code: -32603,
                    message: error.message
                }
            };
        }
    }

    public stop(): void {
        if (this.httpServer) {
            this.httpServer.close();
            this.httpServer = null;
            console.log('[MCPServer] HTTP server stopped');
        }

        this.clients.clear();
    }

    public getStatus(): ServerStatus {
        return {
            running: !!this.httpServer,
            port: this.settings.port,
            clients: 0 // HTTP is stateless, no persistent clients
        };
    }

    public updateSettings(settings: MCPServerSettings) {
        this.settings = settings;
        if (this.httpServer) {
            this.stop();
            this.start();
        }
    }
}

// HTTP transport doesn't need persistent connections
// MCP over HTTP uses request-response pattern