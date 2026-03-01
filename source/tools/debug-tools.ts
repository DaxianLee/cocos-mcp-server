import { ToolDefinition, ToolResponse, ToolExecutor, ConsoleMessage } from '../types';
import * as fs from 'fs';
import * as path from 'path';

declare const Editor: any;

export class DebugTools implements ToolExecutor {
    private consoleMessages: ConsoleMessage[] = [];
    private maxMessages: number = 1000;

    constructor() {
        this.setupConsoleCapture();
    }

    private setupConsoleCapture(): void {
        // Console capture setup - implementation depends on Editor API availability
        console.log('Console capture setup initialized');
    }

    public addConsoleMessage(message: ConsoleMessage): void {
        this.consoleMessages.push({
            timestamp: new Date().toISOString(),
            ...message
        });
        if (this.consoleMessages.length > this.maxMessages) {
            this.consoleMessages.shift();
        }
    }

    getTools(): ToolDefinition[] {
        return [
            {
                name: 'debug_console',
                description: 'CONSOLE MANAGEMENT: Get console logs or clear console. Use this for monitoring editor output and debugging messages.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['get_logs', 'clear'],
                            description: 'Action: "get_logs" = retrieve recent console messages | "clear" = clear console history'
                        },
                        limit: {
                            type: 'number',
                            description: 'Number of recent logs to retrieve (get_logs action only)',
                            default: 100,
                            minimum: 1,
                            maximum: 1000
                        },
                        filter: {
                            type: 'string',
                            description: 'Filter logs by type (get_logs action only)',
                            enum: ['all', 'log', 'warn', 'error', 'info'],
                            default: 'all'
                        }
                    },
                    required: ['action']
                }
            },
            {
                name: 'debug_logs',
                description: 'PROJECT LOG ANALYSIS: Read, search, and analyze project log files. Use this for troubleshooting errors and monitoring system activity.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['read', 'search', 'info'],
                            description: 'Action: "read" = get recent log entries | "search" = find specific patterns/errors | "info" = get log file information'
                        },
                        // For read action
                        lines: {
                            type: 'number',
                            description: 'Number of recent lines to read (read action only)',
                            default: 100,
                            minimum: 1,
                            maximum: 10000
                        },
                        filterKeyword: {
                            type: 'string',
                            description: 'Filter logs containing specific keyword (read action only)'
                        },
                        logLevel: {
                            type: 'string',
                            description: 'Filter by log level (read action only)',
                            enum: ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'ALL'],
                            default: 'ALL'
                        },
                        // For search action
                        pattern: {
                            type: 'string',
                            description: 'Search pattern - supports regex (search action only)'
                        },
                        maxResults: {
                            type: 'number',
                            description: 'Maximum number of search results (search action only)',
                            default: 20,
                            minimum: 1,
                            maximum: 100
                        },
                        contextLines: {
                            type: 'number',
                            description: 'Context lines around each match (search action only)',
                            default: 2,
                            minimum: 0,
                            maximum: 10
                        }
                    },
                    required: ['action']
                }
            },
            {
                name: 'debug_system',
                description: 'SYSTEM INFORMATION: Get editor version, project details, memory usage, and performance stats. Use this for environment debugging and system monitoring.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['editor_info', 'performance'],
                            description: 'Action: "editor_info" = get editor and project information | "performance" = get performance statistics'
                        }
                    },
                    required: ['action']
                }
            }
            // NOTE: Node tree functionality moved to node-tools.ts as it's more appropriate there
        ];
    }

    async execute(toolName: string, args: any): Promise<ToolResponse> {
        switch (toolName) {
            case 'debug_console':
                return await this.handleDebugConsole(args);
            case 'debug_logs':
                return await this.handleDebugLogs(args);
            case 'debug_system':
                return await this.handleDebugSystem(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    // New integrated handlers
    private async handleDebugConsole(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'get_logs':
                return await this.getConsoleLogs(args.limit, args.filter);
            case 'clear':
                return await this.clearConsole();
            default:
                return { success: false, error: `Unknown debug console action: ${action}` };
        }
    }

    private async handleDebugLogs(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'read':
                return await this.getProjectLogs(args.lines, args.filterKeyword, args.logLevel);
            case 'search':
                return await this.searchProjectLogs(args.pattern, args.maxResults, args.contextLines);
            case 'info':
                return await this.getLogFileInfo();
            default:
                return { success: false, error: `Unknown debug logs action: ${action}` };
        }
    }

    private async handleDebugSystem(args: any): Promise<ToolResponse> {
        const { action } = args;
        
        switch (action) {
            case 'editor_info':
                return await this.getEditorInfo();
            case 'performance':
                return await this.getPerformanceStats();
            default:
                return { success: false, error: `Unknown debug system action: ${action}` };
        }
    }

    // Original implementation methods (preserved for backward compatibility)
    private async getConsoleLogs(limit: number = 100, filter: string = 'all'): Promise<ToolResponse> {
        let logs = this.consoleMessages;
        
        if (filter !== 'all') {
            logs = logs.filter(log => log.type === filter);
        }
        
        const recentLogs = logs.slice(-limit);
        
        return {
            success: true,
            message: `✅ Retrieved ${recentLogs.length} console logs`,
            data: {
                total: logs.length,
                returned: recentLogs.length,
                logs: recentLogs
            }
        };
    }

    private async clearConsole(): Promise<ToolResponse> {
        this.consoleMessages = [];
        
        try {
            Editor.Message.send('console', 'clear');
            return {
                success: true,
                message: '✅ Console cleared successfully'
            };
        } catch (err: any) {
            return {
                success: false,
                error: `Failed to clear console: ${err.message}`
            };
        }
    }

    private async getEditorInfo(): Promise<ToolResponse> {
        const info = {
            editor: {
                version: Editor.versions?.editor || 'Unknown',
                cocosVersion: Editor.versions?.cocos || 'Unknown',
                platform: process.platform,
                arch: process.arch,
                nodeVersion: process.version
            },
            project: {
                name: Editor.Project.name,
                path: Editor.Project.path,
                uuid: Editor.Project.uuid
            },
            memory: process.memoryUsage(),
            uptime: process.uptime()
        };

        return {
            success: true,
            message: '✅ Editor information retrieved',
            data: info
        };
    }

    private async getPerformanceStats(): Promise<ToolResponse> {
        try {
            const stats = await Editor.Message.request('scene', 'query-performance');
            
            return {
                success: true,
                message: '✅ Performance statistics retrieved',
                data: {
                    nodeCount: stats.nodeCount || 0,
                    componentCount: stats.componentCount || 0,
                    drawCalls: stats.drawCalls || 0,
                    triangles: stats.triangles || 0,
                    memory: stats.memory || {}
                }
            };
        } catch {
            return {
                success: true,
                message: '⚠️ Performance stats not available in edit mode',
                data: {
                    message: 'Performance statistics are only available during runtime/preview mode'
                }
            };
        }
    }

    private async getProjectLogs(lines: number = 100, filterKeyword?: string, logLevel: string = 'ALL'): Promise<ToolResponse> {
        try {
            const logFilePath = this.findLogFilePath();
            
            if (!logFilePath) {
                return {
                    success: false,
                    error: 'Project log file not found. Make sure the project is properly initialized.'
                };
            }

            const logContent = fs.readFileSync(logFilePath, 'utf8');
            const logLines = logContent.split('\n').filter(line => line.trim() !== '');
            
            const recentLines = logLines.slice(-lines);
            let filteredLines = recentLines;
            
            if (logLevel !== 'ALL') {
                filteredLines = filteredLines.filter(line => 
                    line.includes(`[${logLevel}]`) || line.includes(logLevel.toLowerCase())
                );
            }
            
            if (filterKeyword) {
                filteredLines = filteredLines.filter(line => 
                    line.toLowerCase().includes(filterKeyword.toLowerCase())
                );
            }
            
            return {
                success: true,
                message: `✅ Retrieved ${filteredLines.length} log entries`,
                data: {
                    totalLines: logLines.length,
                    requestedLines: lines,
                    filteredLines: filteredLines.length,
                    logLevel: logLevel,
                    filterKeyword: filterKeyword || null,
                    logs: filteredLines,
                    logFilePath: logFilePath
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Failed to read project logs: ${error.message}`
            };
        }
    }

    private async getLogFileInfo(): Promise<ToolResponse> {
        try {
            const logFilePath = this.findLogFilePath();
            
            if (!logFilePath) {
                return {
                    success: false,
                    error: 'Project log file not found. Make sure the project is properly initialized.'
                };
            }

            const stats = fs.statSync(logFilePath);
            const logContent = fs.readFileSync(logFilePath, 'utf8');
            const lineCount = logContent.split('\n').filter(line => line.trim() !== '').length;
            
            return {
                success: true,
                message: '✅ Log file information retrieved',
                data: {
                    filePath: logFilePath,
                    fileSize: stats.size,
                    fileSizeFormatted: this.formatFileSize(stats.size),
                    lastModified: stats.mtime.toISOString(),
                    lineCount: lineCount,
                    created: stats.birthtime.toISOString(),
                    accessible: true
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Failed to get log file info: ${error.message}`
            };
        }
    }

    private async searchProjectLogs(pattern: string, maxResults: number = 20, contextLines: number = 2): Promise<ToolResponse> {
        try {
            const logFilePath = this.findLogFilePath();
            
            if (!logFilePath) {
                return {
                    success: false,
                    error: 'Project log file not found. Make sure the project is properly initialized.'
                };
            }

            const logContent = fs.readFileSync(logFilePath, 'utf8');
            const logLines = logContent.split('\n');
            
            let regex: RegExp;
            try {
                regex = new RegExp(pattern, 'gi');
            } catch {
                regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            }
            
            const matches: any[] = [];
            let resultCount = 0;
            
            for (let i = 0; i < logLines.length && resultCount < maxResults; i++) {
                const line = logLines[i];
                if (regex.test(line)) {
                    const contextStart = Math.max(0, i - contextLines);
                    const contextEnd = Math.min(logLines.length - 1, i + contextLines);
                    
                    const contextLinesArray = [];
                    for (let j = contextStart; j <= contextEnd; j++) {
                        contextLinesArray.push({
                            lineNumber: j + 1,
                            content: logLines[j],
                            isMatch: j === i
                        });
                    }
                    
                    matches.push({
                        lineNumber: i + 1,
                        matchedLine: line,
                        context: contextLinesArray
                    });
                    
                    resultCount++;
                    regex.lastIndex = 0;
                }
            }
            
            return {
                success: true,
                message: `✅ Found ${matches.length} matches for pattern "${pattern}"`,
                data: {
                    pattern: pattern,
                    totalMatches: matches.length,
                    maxResults: maxResults,
                    contextLines: contextLines,
                    logFilePath: logFilePath,
                    matches: matches
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Failed to search project logs: ${error.message}`
            };
        }
    }

    // Helper methods
    private findLogFilePath(): string | null {
        const possiblePaths = [
            Editor.Project ? Editor.Project.path : null,
            process.env.PROJECT_PATH || '', // Fallback for current project
            process.cwd()
        ].filter(p => p !== null);

        for (const basePath of possiblePaths) {
            const testPath = path.join(basePath as string, 'temp/logs/project.log');
            if (fs.existsSync(testPath)) {
                return testPath;
            }
        }
        
        return null;
    }

    private formatFileSize(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
}