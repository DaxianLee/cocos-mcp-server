"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugTools = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class DebugTools {
    constructor() {
        this.consoleMessages = [];
        this.maxMessages = 1000;
        this.setupConsoleCapture();
    }
    setupConsoleCapture() {
        // Intercept Editor console messages
        // Note: Editor.Message.addBroadcastListener may not be available in all versions
        // This is a placeholder for console capture implementation
        console.log('Console capture setup - implementation depends on Editor API availability');
    }
    addConsoleMessage(message) {
        this.consoleMessages.push(Object.assign({ timestamp: new Date().toISOString() }, message));
        // Keep only latest messages
        if (this.consoleMessages.length > this.maxMessages) {
            this.consoleMessages.shift();
        }
    }
    getTools() {
        return [
            {
                name: 'get_console_logs',
                description: 'Get editor console logs',
                inputSchema: {
                    type: 'object',
                    properties: {
                        limit: {
                            type: 'number',
                            description: 'Number of recent logs to retrieve',
                            default: 100
                        },
                        filter: {
                            type: 'string',
                            description: 'Filter logs by type',
                            enum: ['all', 'log', 'warn', 'error', 'info'],
                            default: 'all'
                        }
                    }
                }
            },
            {
                name: 'clear_console',
                description: 'Clear editor console',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'execute_script',
                description: 'Execute JavaScript in scene context',
                inputSchema: {
                    type: 'object',
                    properties: {
                        script: {
                            type: 'string',
                            description: 'JavaScript code to execute'
                        }
                    },
                    required: ['script']
                }
            },
            {
                name: 'get_node_tree',
                description: 'Get detailed node tree for debugging',
                inputSchema: {
                    type: 'object',
                    properties: {
                        rootUuid: {
                            type: 'string',
                            description: 'Root node UUID (optional, uses scene root if not provided)'
                        },
                        maxDepth: {
                            type: 'number',
                            description: 'Maximum tree depth',
                            default: 10
                        }
                    }
                }
            },
            {
                name: 'get_performance_stats',
                description: 'Get performance statistics',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'validate_scene',
                description: 'Validate current scene for issues',
                inputSchema: {
                    type: 'object',
                    properties: {
                        checkMissingAssets: {
                            type: 'boolean',
                            description: 'Check for missing asset references',
                            default: true
                        },
                        checkPerformance: {
                            type: 'boolean',
                            description: 'Check for performance issues',
                            default: true
                        }
                    }
                }
            },
            {
                name: 'get_editor_info',
                description: 'Get editor and environment information',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'get_project_logs',
                description: 'Get project logs from temp/logs/project.log file',
                inputSchema: {
                    type: 'object',
                    properties: {
                        lines: {
                            type: 'number',
                            description: 'Number of lines to read from the end of the log file (default: 100)',
                            default: 100,
                            minimum: 1,
                            maximum: 10000
                        },
                        filterKeyword: {
                            type: 'string',
                            description: 'Filter logs containing specific keyword (optional)'
                        },
                        logLevel: {
                            type: 'string',
                            description: 'Filter by log level',
                            enum: ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'ALL'],
                            default: 'ALL'
                        }
                    }
                }
            },
            {
                name: 'get_log_file_info',
                description: 'Get information about the project log file',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'search_project_logs',
                description: 'Search for specific patterns or errors in project logs',
                inputSchema: {
                    type: 'object',
                    properties: {
                        pattern: {
                            type: 'string',
                            description: 'Search pattern (supports regex)'
                        },
                        maxResults: {
                            type: 'number',
                            description: 'Maximum number of matching results',
                            default: 20,
                            minimum: 1,
                            maximum: 100
                        },
                        contextLines: {
                            type: 'number',
                            description: 'Number of context lines to show around each match',
                            default: 2,
                            minimum: 0,
                            maximum: 10
                        }
                    },
                    required: ['pattern']
                }
            }
        ];
    }
    async execute(toolName, args) {
        switch (toolName) {
            case 'get_console_logs':
                return await this.getConsoleLogs(args.limit, args.filter);
            case 'clear_console':
                return await this.clearConsole();
            case 'execute_script':
                return await this.executeScript(args.script);
            case 'get_node_tree':
                return await this.getNodeTree(args.rootUuid, args.maxDepth);
            case 'get_performance_stats':
                return await this.getPerformanceStats();
            case 'validate_scene':
                return await this.validateScene(args);
            case 'get_editor_info':
                return await this.getEditorInfo();
            case 'get_project_logs':
                return await this.getProjectLogs(args.lines, args.filterKeyword, args.logLevel);
            case 'get_log_file_info':
                return await this.getLogFileInfo();
            case 'search_project_logs':
                return await this.searchProjectLogs(args.pattern, args.maxResults, args.contextLines);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
    async getConsoleLogs(limit = 100, filter = 'all') {
        let logs = this.consoleMessages;
        if (filter !== 'all') {
            logs = logs.filter(log => log.type === filter);
        }
        const recentLogs = logs.slice(-limit);
        return {
            success: true,
            data: {
                total: logs.length,
                returned: recentLogs.length,
                logs: recentLogs
            }
        };
    }
    async clearConsole() {
        this.consoleMessages = [];
        try {
            // Note: Editor.Message.send may not return a promise in all versions
            Editor.Message.send('console', 'clear');
            return {
                success: true,
                message: 'Console cleared successfully'
            };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async executeScript(script) {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'execute-scene-script', {
                name: 'console',
                method: 'eval',
                args: [script]
            }).then((result) => {
                resolve({
                    success: true,
                    data: {
                        result: result,
                        message: 'Script executed successfully'
                    }
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async getNodeTree(rootUuid, maxDepth = 10) {
        return new Promise((resolve) => {
            const buildTree = async (nodeUuid, depth = 0) => {
                if (depth >= maxDepth) {
                    return { truncated: true };
                }
                try {
                    const nodeData = await Editor.Message.request('scene', 'query-node', nodeUuid);
                    const tree = {
                        uuid: nodeData.uuid,
                        name: nodeData.name,
                        active: nodeData.active,
                        components: nodeData.components ? nodeData.components.map((c) => c.__type__) : [],
                        childCount: nodeData.children ? nodeData.children.length : 0,
                        children: []
                    };
                    if (nodeData.children && nodeData.children.length > 0) {
                        for (const childId of nodeData.children) {
                            const childTree = await buildTree(childId, depth + 1);
                            tree.children.push(childTree);
                        }
                    }
                    return tree;
                }
                catch (err) {
                    return { error: err.message };
                }
            };
            if (rootUuid) {
                buildTree(rootUuid).then(tree => {
                    resolve({ success: true, data: tree });
                });
            }
            else {
                Editor.Message.request('scene', 'query-hierarchy').then(async (hierarchy) => {
                    const trees = [];
                    for (const rootNode of hierarchy.children) {
                        const tree = await buildTree(rootNode.uuid);
                        trees.push(tree);
                    }
                    resolve({ success: true, data: trees });
                }).catch((err) => {
                    resolve({ success: false, error: err.message });
                });
            }
        });
    }
    async getPerformanceStats() {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-performance').then((stats) => {
                const perfStats = {
                    nodeCount: stats.nodeCount || 0,
                    componentCount: stats.componentCount || 0,
                    drawCalls: stats.drawCalls || 0,
                    triangles: stats.triangles || 0,
                    memory: stats.memory || {}
                };
                resolve({ success: true, data: perfStats });
            }).catch(() => {
                // Fallback to basic stats
                resolve({
                    success: true,
                    data: {
                        message: 'Performance stats not available in edit mode'
                    }
                });
            });
        });
    }
    async validateScene(options) {
        const issues = [];
        try {
            // Check for missing assets
            if (options.checkMissingAssets) {
                const assetCheck = await Editor.Message.request('scene', 'check-missing-assets');
                if (assetCheck && assetCheck.missing) {
                    issues.push({
                        type: 'error',
                        category: 'assets',
                        message: `Found ${assetCheck.missing.length} missing asset references`,
                        details: assetCheck.missing
                    });
                }
            }
            // Check for performance issues
            if (options.checkPerformance) {
                const hierarchy = await Editor.Message.request('scene', 'query-hierarchy');
                const nodeCount = this.countNodes(hierarchy.children);
                if (nodeCount > 1000) {
                    issues.push({
                        type: 'warning',
                        category: 'performance',
                        message: `High node count: ${nodeCount} nodes (recommended < 1000)`,
                        suggestion: 'Consider using object pooling or scene optimization'
                    });
                }
            }
            const result = {
                valid: issues.length === 0,
                issueCount: issues.length,
                issues: issues
            };
            return { success: true, data: result };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    countNodes(nodes) {
        let count = nodes.length;
        for (const node of nodes) {
            if (node.children) {
                count += this.countNodes(node.children);
            }
        }
        return count;
    }
    async getEditorInfo() {
        var _a, _b;
        const info = {
            editor: {
                version: ((_a = Editor.versions) === null || _a === void 0 ? void 0 : _a.editor) || 'Unknown',
                cocosVersion: ((_b = Editor.versions) === null || _b === void 0 ? void 0 : _b.cocos) || 'Unknown',
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
        return { success: true, data: info };
    }
    async getProjectLogs(lines = 100, filterKeyword, logLevel = 'ALL') {
        try {
            // Try multiple possible project paths
            let logFilePath = '';
            const possiblePaths = [
                Editor.Project ? Editor.Project.path : null,
                '/Users/lizhiyong/NewProject_3',
                process.cwd(),
            ].filter(p => p !== null);
            for (const basePath of possiblePaths) {
                const testPath = path.join(basePath, 'temp/logs/project.log');
                if (fs.existsSync(testPath)) {
                    logFilePath = testPath;
                    break;
                }
            }
            if (!logFilePath) {
                return {
                    success: false,
                    error: `Project log file not found. Tried paths: ${possiblePaths.map(p => path.join(p, 'temp/logs/project.log')).join(', ')}`
                };
            }
            // Read the file content
            const logContent = fs.readFileSync(logFilePath, 'utf8');
            const logLines = logContent.split('\n').filter(line => line.trim() !== '');
            // Get the last N lines
            const recentLines = logLines.slice(-lines);
            // Apply filters
            let filteredLines = recentLines;
            // Filter by log level if not 'ALL'
            if (logLevel !== 'ALL') {
                filteredLines = filteredLines.filter(line => line.includes(`[${logLevel}]`) || line.includes(logLevel.toLowerCase()));
            }
            // Filter by keyword if provided
            if (filterKeyword) {
                filteredLines = filteredLines.filter(line => line.toLowerCase().includes(filterKeyword.toLowerCase()));
            }
            return {
                success: true,
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
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to read project logs: ${error.message}`
            };
        }
    }
    async getLogFileInfo() {
        try {
            // Try multiple possible project paths
            let logFilePath = '';
            const possiblePaths = [
                Editor.Project ? Editor.Project.path : null,
                '/Users/lizhiyong/NewProject_3',
                process.cwd(),
            ].filter(p => p !== null);
            for (const basePath of possiblePaths) {
                const testPath = path.join(basePath, 'temp/logs/project.log');
                if (fs.existsSync(testPath)) {
                    logFilePath = testPath;
                    break;
                }
            }
            if (!logFilePath) {
                return {
                    success: false,
                    error: `Project log file not found. Tried paths: ${possiblePaths.map(p => path.join(p, 'temp/logs/project.log')).join(', ')}`
                };
            }
            const stats = fs.statSync(logFilePath);
            const logContent = fs.readFileSync(logFilePath, 'utf8');
            const lineCount = logContent.split('\n').filter(line => line.trim() !== '').length;
            return {
                success: true,
                data: {
                    filePath: logFilePath,
                    fileSize: stats.size,
                    fileSizeFormatted: this.formatFileSize(stats.size),
                    lastModified: stats.mtime.toISOString(),
                    lineCount: lineCount,
                    created: stats.birthtime.toISOString(),
                    accessible: fs.constants.R_OK
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to get log file info: ${error.message}`
            };
        }
    }
    async searchProjectLogs(pattern, maxResults = 20, contextLines = 2) {
        try {
            // Try multiple possible project paths
            let logFilePath = '';
            const possiblePaths = [
                Editor.Project ? Editor.Project.path : null,
                '/Users/lizhiyong/NewProject_3',
                process.cwd(),
            ].filter(p => p !== null);
            for (const basePath of possiblePaths) {
                const testPath = path.join(basePath, 'temp/logs/project.log');
                if (fs.existsSync(testPath)) {
                    logFilePath = testPath;
                    break;
                }
            }
            if (!logFilePath) {
                return {
                    success: false,
                    error: `Project log file not found. Tried paths: ${possiblePaths.map(p => path.join(p, 'temp/logs/project.log')).join(', ')}`
                };
            }
            const logContent = fs.readFileSync(logFilePath, 'utf8');
            const logLines = logContent.split('\n');
            // Create regex pattern (support both string and regex patterns)
            let regex;
            try {
                regex = new RegExp(pattern, 'gi');
            }
            catch (_a) {
                // If pattern is not valid regex, treat as literal string
                regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            }
            const matches = [];
            let resultCount = 0;
            for (let i = 0; i < logLines.length && resultCount < maxResults; i++) {
                const line = logLines[i];
                if (regex.test(line)) {
                    // Get context lines
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
                    // Reset regex lastIndex for global search
                    regex.lastIndex = 0;
                }
            }
            return {
                success: true,
                data: {
                    pattern: pattern,
                    totalMatches: matches.length,
                    maxResults: maxResults,
                    contextLines: contextLines,
                    logFilePath: logFilePath,
                    matches: matches
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to search project logs: ${error.message}`
            };
        }
    }
    formatFileSize(bytes) {
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
exports.DebugTools = DebugTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWctdG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb3VyY2UvdG9vbHMvZGVidWctdG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsdUNBQXlCO0FBQ3pCLDJDQUE2QjtBQUU3QixNQUFhLFVBQVU7SUFJbkI7UUFIUSxvQkFBZSxHQUFxQixFQUFFLENBQUM7UUFDOUIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFHaEMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVPLG1CQUFtQjtRQUN2QixvQ0FBb0M7UUFDcEMsaUZBQWlGO1FBQ2pGLDJEQUEyRDtRQUMzRCxPQUFPLENBQUMsR0FBRyxDQUFDLDJFQUEyRSxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVPLGlCQUFpQixDQUFDLE9BQVk7UUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLGlCQUNyQixTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFDaEMsT0FBTyxFQUNaLENBQUM7UUFFSCw0QkFBNEI7UUFDNUIsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDakQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPO1lBQ0g7Z0JBQ0ksSUFBSSxFQUFFLGtCQUFrQjtnQkFDeEIsV0FBVyxFQUFFLHlCQUF5QjtnQkFDdEMsV0FBVyxFQUFFO29CQUNULElBQUksRUFBRSxRQUFRO29CQUNkLFVBQVUsRUFBRTt3QkFDUixLQUFLLEVBQUU7NEJBQ0gsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLG1DQUFtQzs0QkFDaEQsT0FBTyxFQUFFLEdBQUc7eUJBQ2Y7d0JBQ0QsTUFBTSxFQUFF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RyxDQUFDLENBQUM7UUFFbEIsT0FBTyxJQUFJLElBQUksSUFBSSxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2xELElBQUksSUFBSSxJQUFJLENBQUM7WUFDYixTQUFTLEVBQUUsQ0FBQztRQUNoQixDQUFDO1FBRUQsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7SUFDcEQsQ0FBQztDQUNKO0FBN25CRCxnQ0E2bkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVG9vbERlZmluaXRpb24sIFRvb2xSZXNwb25zZSwgVG9vbEV4ZWN1dG9yLCBDb25zb2xlTWVzc2FnZSwgUGVyZm9ybWFuY2VTdGF0cywgVmFsaWRhdGlvblJlc3VsdCwgVmFsaWRhdGlvbklzc3VlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGNsYXNzIERlYnVnVG9vbHMgaW1wbGVtZW50cyBUb29sRXhlY3V0b3Ige1xuICAgIHByaXZhdGUgY29uc29sZU1lc3NhZ2VzOiBDb25zb2xlTWVzc2FnZVtdID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXhNZXNzYWdlcyA9IDEwMDA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zZXR1cENvbnNvbGVDYXB0dXJlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cENvbnNvbGVDYXB0dXJlKCk6IHZvaWQge1xuICAgICAgICAvLyBJbnRlcmNlcHQgRWRpdG9yIGNvbnNvbGUgbWVzc2FnZXNcbiAgICAgICAgLy8gTm90ZTogRWRpdG9yLk1lc3NhZ2UuYWRkQnJvYWRjYXN0TGlzdGVuZXIgbWF5IG5vdCBiZSBhdmFpbGFibGUgaW4gYWxsIHZlcnNpb25zXG4gICAgICAgIC8vIFRoaXMgaXMgYSBwbGFjZWhvbGRlciBmb3IgY29uc29sZSBjYXB0dXJlIGltcGxlbWVudGF0aW9uXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb25zb2xlIGNhcHR1cmUgc2V0dXAgLSBpbXBsZW1lbnRhdGlvbiBkZXBlbmRzIG9uIEVkaXRvciBBUEkgYXZhaWxhYmlsaXR5Jyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRDb25zb2xlTWVzc2FnZShtZXNzYWdlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb25zb2xlTWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgIC4uLm1lc3NhZ2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gS2VlcCBvbmx5IGxhdGVzdCBtZXNzYWdlc1xuICAgICAgICBpZiAodGhpcy5jb25zb2xlTWVzc2FnZXMubGVuZ3RoID4gdGhpcy5tYXhNZXNzYWdlcykge1xuICAgICAgICAgICAgdGhpcy5jb25zb2xlTWVzc2FnZXMuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFRvb2xzKCk6IFRvb2xEZWZpbml0aW9uW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdnZXRfY29uc29sZV9sb2dzJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0dldCBlZGl0b3IgY29uc29sZSBsb2dzJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ051bWJlciBvZiByZWNlbnQgbG9ncyB0byByZXRyaWV2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogMTAwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdGaWx0ZXIgbG9ncyBieSB0eXBlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2FsbCcsICdsb2cnLCAnd2FybicsICdlcnJvcicsICdpbmZvJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogJ2FsbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NsZWFyX2NvbnNvbGUnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ2xlYXIgZWRpdG9yIGNvbnNvbGUnLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2V4ZWN1dGVfc2NyaXB0JyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0V4ZWN1dGUgSmF2YVNjcmlwdCBpbiBzY2VuZSBjb250ZXh0JyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdKYXZhU2NyaXB0IGNvZGUgdG8gZXhlY3V0ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnc2NyaXB0J11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdnZXRfbm9kZV90cmVlJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0dldCBkZXRhaWxlZCBub2RlIHRyZWUgZm9yIGRlYnVnZ2luZycsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RVdWlkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdSb290IG5vZGUgVVVJRCAob3B0aW9uYWwsIHVzZXMgc2NlbmUgcm9vdCBpZiBub3QgcHJvdmlkZWQpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heERlcHRoOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdNYXhpbXVtIHRyZWUgZGVwdGgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdnZXRfcGVyZm9ybWFuY2Vfc3RhdHMnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnR2V0IHBlcmZvcm1hbmNlIHN0YXRpc3RpY3MnLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3ZhbGlkYXRlX3NjZW5lJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1ZhbGlkYXRlIGN1cnJlbnQgc2NlbmUgZm9yIGlzc3VlcycsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrTWlzc2luZ0Fzc2V0czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NoZWNrIGZvciBtaXNzaW5nIGFzc2V0IHJlZmVyZW5jZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja1BlcmZvcm1hbmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ2hlY2sgZm9yIHBlcmZvcm1hbmNlIGlzc3VlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnZ2V0X2VkaXRvcl9pbmZvJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0dldCBlZGl0b3IgYW5kIGVudmlyb25tZW50IGluZm9ybWF0aW9uJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdnZXRfcHJvamVjdF9sb2dzJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0dldCBwcm9qZWN0IGxvZ3MgZnJvbSB0ZW1wL2xvZ3MvcHJvamVjdC5sb2cgZmlsZScsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdOdW1iZXIgb2YgbGluZXMgdG8gcmVhZCBmcm9tIHRoZSBlbmQgb2YgdGhlIGxvZyBmaWxlIChkZWZhdWx0OiAxMDApJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiAxMDAwMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcktleXdvcmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0ZpbHRlciBsb2dzIGNvbnRhaW5pbmcgc3BlY2lmaWMga2V5d29yZCAob3B0aW9uYWwpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0xldmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdGaWx0ZXIgYnkgbG9nIGxldmVsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ0VSUk9SJywgJ1dBUk4nLCAnSU5GTycsICdERUJVRycsICdUUkFDRScsICdBTEwnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAnQUxMJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnZ2V0X2xvZ19maWxlX2luZm8nLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnR2V0IGluZm9ybWF0aW9uIGFib3V0IHRoZSBwcm9qZWN0IGxvZyBmaWxlJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdzZWFyY2hfcHJvamVjdF9sb2dzJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NlYXJjaCBmb3Igc3BlY2lmaWMgcGF0dGVybnMgb3IgZXJyb3JzIGluIHByb2plY3QgbG9ncycsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NlYXJjaCBwYXR0ZXJuIChzdXBwb3J0cyByZWdleCknXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4UmVzdWx0czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWF4aW11bSBudW1iZXIgb2YgbWF0Y2hpbmcgcmVzdWx0cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiAxMDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0TGluZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ051bWJlciBvZiBjb250ZXh0IGxpbmVzIHRvIHNob3cgYXJvdW5kIGVhY2ggbWF0Y2gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydwYXR0ZXJuJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZSh0b29sTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBzd2l0Y2ggKHRvb2xOYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdnZXRfY29uc29sZV9sb2dzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRDb25zb2xlTG9ncyhhcmdzLmxpbWl0LCBhcmdzLmZpbHRlcik7XG4gICAgICAgICAgICBjYXNlICdjbGVhcl9jb25zb2xlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGVhckNvbnNvbGUoKTtcbiAgICAgICAgICAgIGNhc2UgJ2V4ZWN1dGVfc2NyaXB0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlU2NyaXB0KGFyZ3Muc2NyaXB0KTtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9ub2RlX3RyZWUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldE5vZGVUcmVlKGFyZ3Mucm9vdFV1aWQsIGFyZ3MubWF4RGVwdGgpO1xuICAgICAgICAgICAgY2FzZSAnZ2V0X3BlcmZvcm1hbmNlX3N0YXRzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRQZXJmb3JtYW5jZVN0YXRzKCk7XG4gICAgICAgICAgICBjYXNlICd2YWxpZGF0ZV9zY2VuZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMudmFsaWRhdGVTY2VuZShhcmdzKTtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9lZGl0b3JfaW5mbyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0RWRpdG9ySW5mbygpO1xuICAgICAgICAgICAgY2FzZSAnZ2V0X3Byb2plY3RfbG9ncyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0UHJvamVjdExvZ3MoYXJncy5saW5lcywgYXJncy5maWx0ZXJLZXl3b3JkLCBhcmdzLmxvZ0xldmVsKTtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9sb2dfZmlsZV9pbmZvJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRMb2dGaWxlSW5mbygpO1xuICAgICAgICAgICAgY2FzZSAnc2VhcmNoX3Byb2plY3RfbG9ncyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2VhcmNoUHJvamVjdExvZ3MoYXJncy5wYXR0ZXJuLCBhcmdzLm1heFJlc3VsdHMsIGFyZ3MuY29udGV4dExpbmVzKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHRvb2w6ICR7dG9vbE5hbWV9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGdldENvbnNvbGVMb2dzKGxpbWl0OiBudW1iZXIgPSAxMDAsIGZpbHRlcjogc3RyaW5nID0gJ2FsbCcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBsZXQgbG9ncyA9IHRoaXMuY29uc29sZU1lc3NhZ2VzO1xuICAgICAgICBcbiAgICAgICAgaWYgKGZpbHRlciAhPT0gJ2FsbCcpIHtcbiAgICAgICAgICAgIGxvZ3MgPSBsb2dzLmZpbHRlcihsb2cgPT4gbG9nLnR5cGUgPT09IGZpbHRlcik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWNlbnRMb2dzID0gbG9ncy5zbGljZSgtbGltaXQpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgdG90YWw6IGxvZ3MubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHJldHVybmVkOiByZWNlbnRMb2dzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBsb2dzOiByZWNlbnRMb2dzXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBjbGVhckNvbnNvbGUoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgdGhpcy5jb25zb2xlTWVzc2FnZXMgPSBbXTtcbiAgICAgICAgXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBOb3RlOiBFZGl0b3IuTWVzc2FnZS5zZW5kIG1heSBub3QgcmV0dXJuIGEgcHJvbWlzZSBpbiBhbGwgdmVyc2lvbnNcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnNlbmQoJ2NvbnNvbGUnLCAnY2xlYXInKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnQ29uc29sZSBjbGVhcmVkIHN1Y2Nlc3NmdWxseSdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4ZWN1dGVTY3JpcHQoc2NyaXB0OiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ2V4ZWN1dGUtc2NlbmUtc2NyaXB0Jywge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdjb25zb2xlJyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdldmFsJyxcbiAgICAgICAgICAgICAgICBhcmdzOiBbc2NyaXB0XVxuICAgICAgICAgICAgfSkudGhlbigocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnU2NyaXB0IGV4ZWN1dGVkIHN1Y2Nlc3NmdWxseSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGdldE5vZGVUcmVlKHJvb3RVdWlkPzogc3RyaW5nLCBtYXhEZXB0aDogbnVtYmVyID0gMTApOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJ1aWxkVHJlZSA9IGFzeW5jIChub2RlVXVpZDogc3RyaW5nLCBkZXB0aDogbnVtYmVyID0gMCk6IFByb21pc2U8YW55PiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRlcHRoID49IG1heERlcHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHRydW5jYXRlZDogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVEYXRhID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncXVlcnktbm9kZScsIG5vZGVVdWlkKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyZWUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1dWlkOiBub2RlRGF0YS51dWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbm9kZURhdGEubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogbm9kZURhdGEuYWN0aXZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50czogKG5vZGVEYXRhIGFzIGFueSkuY29tcG9uZW50cyA/IChub2RlRGF0YSBhcyBhbnkpLmNvbXBvbmVudHMubWFwKChjOiBhbnkpID0+IGMuX190eXBlX18pIDogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZENvdW50OiBub2RlRGF0YS5jaGlsZHJlbiA/IG5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aCA6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10gYXMgYW55W11cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZURhdGEuY2hpbGRyZW4gJiYgbm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZElkIG9mIG5vZGVEYXRhLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRUcmVlID0gYXdhaXQgYnVpbGRUcmVlKGNoaWxkSWQsIGRlcHRoICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJlZS5jaGlsZHJlbi5wdXNoKGNoaWxkVHJlZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJlZTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAocm9vdFV1aWQpIHtcbiAgICAgICAgICAgICAgICBidWlsZFRyZWUocm9vdFV1aWQpLnRoZW4odHJlZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB0cmVlIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdxdWVyeS1oaWVyYXJjaHknKS50aGVuKGFzeW5jIChoaWVyYXJjaHk6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmVlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHJvb3ROb2RlIG9mIGhpZXJhcmNoeS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJlZSA9IGF3YWl0IGJ1aWxkVHJlZShyb290Tm9kZS51dWlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyZWVzLnB1c2godHJlZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHRyZWVzIH0pO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGdldFBlcmZvcm1hbmNlU3RhdHMoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdxdWVyeS1wZXJmb3JtYW5jZScpLnRoZW4oKHN0YXRzOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwZXJmU3RhdHM6IFBlcmZvcm1hbmNlU3RhdHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVDb3VudDogc3RhdHMubm9kZUNvdW50IHx8IDAsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudENvdW50OiBzdGF0cy5jb21wb25lbnRDb3VudCB8fCAwLFxuICAgICAgICAgICAgICAgICAgICBkcmF3Q2FsbHM6IHN0YXRzLmRyYXdDYWxscyB8fCAwLFxuICAgICAgICAgICAgICAgICAgICB0cmlhbmdsZXM6IHN0YXRzLnRyaWFuZ2xlcyB8fCAwLFxuICAgICAgICAgICAgICAgICAgICBtZW1vcnk6IHN0YXRzLm1lbW9yeSB8fCB7fVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHBlcmZTdGF0cyB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBGYWxsYmFjayB0byBiYXNpYyBzdGF0c1xuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnUGVyZm9ybWFuY2Ugc3RhdHMgbm90IGF2YWlsYWJsZSBpbiBlZGl0IG1vZGUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHZhbGlkYXRlU2NlbmUob3B0aW9uczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgaXNzdWVzOiBWYWxpZGF0aW9uSXNzdWVbXSA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgbWlzc2luZyBhc3NldHNcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNoZWNrTWlzc2luZ0Fzc2V0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFzc2V0Q2hlY2sgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdjaGVjay1taXNzaW5nLWFzc2V0cycpO1xuICAgICAgICAgICAgICAgIGlmIChhc3NldENoZWNrICYmIGFzc2V0Q2hlY2subWlzc2luZykge1xuICAgICAgICAgICAgICAgICAgICBpc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6ICdhc3NldHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYEZvdW5kICR7YXNzZXRDaGVjay5taXNzaW5nLmxlbmd0aH0gbWlzc2luZyBhc3NldCByZWZlcmVuY2VzYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbHM6IGFzc2V0Q2hlY2subWlzc2luZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBwZXJmb3JtYW5jZSBpc3N1ZXNcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNoZWNrUGVyZm9ybWFuY2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBoaWVyYXJjaHkgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdxdWVyeS1oaWVyYXJjaHknKTtcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlQ291bnQgPSB0aGlzLmNvdW50Tm9kZXMoaGllcmFyY2h5LmNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAobm9kZUNvdW50ID4gMTAwMCkge1xuICAgICAgICAgICAgICAgICAgICBpc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogJ3BlcmZvcm1hbmNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBIaWdoIG5vZGUgY291bnQ6ICR7bm9kZUNvdW50fSBub2RlcyAocmVjb21tZW5kZWQgPCAxMDAwKWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uOiAnQ29uc2lkZXIgdXNpbmcgb2JqZWN0IHBvb2xpbmcgb3Igc2NlbmUgb3B0aW1pemF0aW9uJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogVmFsaWRhdGlvblJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICB2YWxpZDogaXNzdWVzLmxlbmd0aCA9PT0gMCxcbiAgICAgICAgICAgICAgICBpc3N1ZUNvdW50OiBpc3N1ZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGlzc3VlczogaXNzdWVzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHQgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY291bnROb2Rlcyhub2RlczogYW55W10pOiBudW1iZXIge1xuICAgICAgICBsZXQgY291bnQgPSBub2Rlcy5sZW5ndGg7XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBjb3VudCArPSB0aGlzLmNvdW50Tm9kZXMobm9kZS5jaGlsZHJlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0RWRpdG9ySW5mbygpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCBpbmZvID0ge1xuICAgICAgICAgICAgZWRpdG9yOiB7XG4gICAgICAgICAgICAgICAgdmVyc2lvbjogKEVkaXRvciBhcyBhbnkpLnZlcnNpb25zPy5lZGl0b3IgfHwgJ1Vua25vd24nLFxuICAgICAgICAgICAgICAgIGNvY29zVmVyc2lvbjogKEVkaXRvciBhcyBhbnkpLnZlcnNpb25zPy5jb2NvcyB8fCAnVW5rbm93bicsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm06IHByb2Nlc3MucGxhdGZvcm0sXG4gICAgICAgICAgICAgICAgYXJjaDogcHJvY2Vzcy5hcmNoLFxuICAgICAgICAgICAgICAgIG5vZGVWZXJzaW9uOiBwcm9jZXNzLnZlcnNpb25cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9qZWN0OiB7XG4gICAgICAgICAgICAgICAgbmFtZTogRWRpdG9yLlByb2plY3QubmFtZSxcbiAgICAgICAgICAgICAgICBwYXRoOiBFZGl0b3IuUHJvamVjdC5wYXRoLFxuICAgICAgICAgICAgICAgIHV1aWQ6IEVkaXRvci5Qcm9qZWN0LnV1aWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZW1vcnk6IHByb2Nlc3MubWVtb3J5VXNhZ2UoKSxcbiAgICAgICAgICAgIHVwdGltZTogcHJvY2Vzcy51cHRpbWUoKVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGluZm8gfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGdldFByb2plY3RMb2dzKGxpbmVzOiBudW1iZXIgPSAxMDAsIGZpbHRlcktleXdvcmQ/OiBzdHJpbmcsIGxvZ0xldmVsOiBzdHJpbmcgPSAnQUxMJyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBUcnkgbXVsdGlwbGUgcG9zc2libGUgcHJvamVjdCBwYXRoc1xuICAgICAgICAgICAgbGV0IGxvZ0ZpbGVQYXRoID0gJyc7XG4gICAgICAgICAgICBjb25zdCBwb3NzaWJsZVBhdGhzID0gW1xuICAgICAgICAgICAgICAgIEVkaXRvci5Qcm9qZWN0ID8gRWRpdG9yLlByb2plY3QucGF0aCA6IG51bGwsXG4gICAgICAgICAgICAgICAgJy9Vc2Vycy9saXpoaXlvbmcvTmV3UHJvamVjdF8zJyxcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmN3ZCgpLFxuICAgICAgICAgICAgXS5maWx0ZXIocCA9PiBwICE9PSBudWxsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIChjb25zdCBiYXNlUGF0aCBvZiBwb3NzaWJsZVBhdGhzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdFBhdGggPSBwYXRoLmpvaW4oYmFzZVBhdGgsICd0ZW1wL2xvZ3MvcHJvamVjdC5sb2cnKTtcbiAgICAgICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyh0ZXN0UGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nRmlsZVBhdGggPSB0ZXN0UGF0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWxvZ0ZpbGVQYXRoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBgUHJvamVjdCBsb2cgZmlsZSBub3QgZm91bmQuIFRyaWVkIHBhdGhzOiAke3Bvc3NpYmxlUGF0aHMubWFwKHAgPT4gcGF0aC5qb2luKHAsICd0ZW1wL2xvZ3MvcHJvamVjdC5sb2cnKSkuam9pbignLCAnKX1gXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVhZCB0aGUgZmlsZSBjb250ZW50XG4gICAgICAgICAgICBjb25zdCBsb2dDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGxvZ0ZpbGVQYXRoLCAndXRmOCcpO1xuICAgICAgICAgICAgY29uc3QgbG9nTGluZXMgPSBsb2dDb250ZW50LnNwbGl0KCdcXG4nKS5maWx0ZXIobGluZSA9PiBsaW5lLnRyaW0oKSAhPT0gJycpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGxhc3QgTiBsaW5lc1xuICAgICAgICAgICAgY29uc3QgcmVjZW50TGluZXMgPSBsb2dMaW5lcy5zbGljZSgtbGluZXMpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBBcHBseSBmaWx0ZXJzXG4gICAgICAgICAgICBsZXQgZmlsdGVyZWRMaW5lcyA9IHJlY2VudExpbmVzO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBGaWx0ZXIgYnkgbG9nIGxldmVsIGlmIG5vdCAnQUxMJ1xuICAgICAgICAgICAgaWYgKGxvZ0xldmVsICE9PSAnQUxMJykge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkTGluZXMgPSBmaWx0ZXJlZExpbmVzLmZpbHRlcihsaW5lID0+IFxuICAgICAgICAgICAgICAgICAgICBsaW5lLmluY2x1ZGVzKGBbJHtsb2dMZXZlbH1dYCkgfHwgbGluZS5pbmNsdWRlcyhsb2dMZXZlbC50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEZpbHRlciBieSBrZXl3b3JkIGlmIHByb3ZpZGVkXG4gICAgICAgICAgICBpZiAoZmlsdGVyS2V5d29yZCkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkTGluZXMgPSBmaWx0ZXJlZExpbmVzLmZpbHRlcihsaW5lID0+IFxuICAgICAgICAgICAgICAgICAgICBsaW5lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZmlsdGVyS2V5d29yZC50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsTGluZXM6IGxvZ0xpbmVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdGVkTGluZXM6IGxpbmVzLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZExpbmVzOiBmaWx0ZXJlZExpbmVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgbG9nTGV2ZWw6IGxvZ0xldmVsLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJLZXl3b3JkOiBmaWx0ZXJLZXl3b3JkIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGxvZ3M6IGZpbHRlcmVkTGluZXMsXG4gICAgICAgICAgICAgICAgICAgIGxvZ0ZpbGVQYXRoOiBsb2dGaWxlUGF0aFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGBGYWlsZWQgdG8gcmVhZCBwcm9qZWN0IGxvZ3M6ICR7ZXJyb3IubWVzc2FnZX1gXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRMb2dGaWxlSW5mbygpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gVHJ5IG11bHRpcGxlIHBvc3NpYmxlIHByb2plY3QgcGF0aHNcbiAgICAgICAgICAgIGxldCBsb2dGaWxlUGF0aCA9ICcnO1xuICAgICAgICAgICAgY29uc3QgcG9zc2libGVQYXRocyA9IFtcbiAgICAgICAgICAgICAgICBFZGl0b3IuUHJvamVjdCA/IEVkaXRvci5Qcm9qZWN0LnBhdGggOiBudWxsLFxuICAgICAgICAgICAgICAgICcvVXNlcnMvbGl6aGl5b25nL05ld1Byb2plY3RfMycsXG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5jd2QoKSxcbiAgICAgICAgICAgIF0uZmlsdGVyKHAgPT4gcCAhPT0gbnVsbCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmFzZVBhdGggb2YgcG9zc2libGVQYXRocykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RQYXRoID0gcGF0aC5qb2luKGJhc2VQYXRoLCAndGVtcC9sb2dzL3Byb2plY3QubG9nJyk7XG4gICAgICAgICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmModGVzdFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ0ZpbGVQYXRoID0gdGVzdFBhdGg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFsb2dGaWxlUGF0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogYFByb2plY3QgbG9nIGZpbGUgbm90IGZvdW5kLiBUcmllZCBwYXRoczogJHtwb3NzaWJsZVBhdGhzLm1hcChwID0+IHBhdGguam9pbihwLCAndGVtcC9sb2dzL3Byb2plY3QubG9nJykpLmpvaW4oJywgJyl9YFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXRzID0gZnMuc3RhdFN5bmMobG9nRmlsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgbG9nQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhsb2dGaWxlUGF0aCwgJ3V0ZjgnKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVDb3VudCA9IGxvZ0NvbnRlbnQuc3BsaXQoJ1xcbicpLmZpbHRlcihsaW5lID0+IGxpbmUudHJpbSgpICE9PSAnJykubGVuZ3RoO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aDogbG9nRmlsZVBhdGgsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVTaXplOiBzdGF0cy5zaXplLFxuICAgICAgICAgICAgICAgICAgICBmaWxlU2l6ZUZvcm1hdHRlZDogdGhpcy5mb3JtYXRGaWxlU2l6ZShzdGF0cy5zaXplKSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBzdGF0cy5tdGltZS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICBsaW5lQ291bnQ6IGxpbmVDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZDogc3RhdHMuYmlydGh0aW1lLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc2libGU6IGZzLmNvbnN0YW50cy5SX09LXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byBnZXQgbG9nIGZpbGUgaW5mbzogJHtlcnJvci5tZXNzYWdlfWBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHNlYXJjaFByb2plY3RMb2dzKHBhdHRlcm46IHN0cmluZywgbWF4UmVzdWx0czogbnVtYmVyID0gMjAsIGNvbnRleHRMaW5lczogbnVtYmVyID0gMik6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBUcnkgbXVsdGlwbGUgcG9zc2libGUgcHJvamVjdCBwYXRoc1xuICAgICAgICAgICAgbGV0IGxvZ0ZpbGVQYXRoID0gJyc7XG4gICAgICAgICAgICBjb25zdCBwb3NzaWJsZVBhdGhzID0gW1xuICAgICAgICAgICAgICAgIEVkaXRvci5Qcm9qZWN0ID8gRWRpdG9yLlByb2plY3QucGF0aCA6IG51bGwsXG4gICAgICAgICAgICAgICAgJy9Vc2Vycy9saXpoaXlvbmcvTmV3UHJvamVjdF8zJyxcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmN3ZCgpLFxuICAgICAgICAgICAgXS5maWx0ZXIocCA9PiBwICE9PSBudWxsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIChjb25zdCBiYXNlUGF0aCBvZiBwb3NzaWJsZVBhdGhzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdFBhdGggPSBwYXRoLmpvaW4oYmFzZVBhdGgsICd0ZW1wL2xvZ3MvcHJvamVjdC5sb2cnKTtcbiAgICAgICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyh0ZXN0UGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nRmlsZVBhdGggPSB0ZXN0UGF0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWxvZ0ZpbGVQYXRoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBgUHJvamVjdCBsb2cgZmlsZSBub3QgZm91bmQuIFRyaWVkIHBhdGhzOiAke3Bvc3NpYmxlUGF0aHMubWFwKHAgPT4gcGF0aC5qb2luKHAsICd0ZW1wL2xvZ3MvcHJvamVjdC5sb2cnKSkuam9pbignLCAnKX1gXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbG9nQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhsb2dGaWxlUGF0aCwgJ3V0ZjgnKTtcbiAgICAgICAgICAgIGNvbnN0IGxvZ0xpbmVzID0gbG9nQ29udGVudC5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIENyZWF0ZSByZWdleCBwYXR0ZXJuIChzdXBwb3J0IGJvdGggc3RyaW5nIGFuZCByZWdleCBwYXR0ZXJucylcbiAgICAgICAgICAgIGxldCByZWdleDogUmVnRXhwO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAocGF0dGVybiwgJ2dpJyk7XG4gICAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBwYXR0ZXJuIGlzIG5vdCB2YWxpZCByZWdleCwgdHJlYXQgYXMgbGl0ZXJhbCBzdHJpbmdcbiAgICAgICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAocGF0dGVybi5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpLCAnZ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgbWF0Y2hlczogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGxldCByZXN1bHRDb3VudCA9IDA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9nTGluZXMubGVuZ3RoICYmIHJlc3VsdENvdW50IDwgbWF4UmVzdWx0czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGluZSA9IGxvZ0xpbmVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChyZWdleC50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBjb250ZXh0IGxpbmVzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRleHRTdGFydCA9IE1hdGgubWF4KDAsIGkgLSBjb250ZXh0TGluZXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZXh0RW5kID0gTWF0aC5taW4obG9nTGluZXMubGVuZ3RoIC0gMSwgaSArIGNvbnRleHRMaW5lcyk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZXh0TGluZXNBcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gY29udGV4dFN0YXJ0OyBqIDw9IGNvbnRleHRFbmQ7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dExpbmVzQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogaiArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogbG9nTGluZXNbal0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNNYXRjaDogaiA9PT0gaVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBpICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWRMaW5lOiBsaW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dExpbmVzQXJyYXlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXN1bHRDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVzZXQgcmVnZXggbGFzdEluZGV4IGZvciBnbG9iYWwgc2VhcmNoXG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4Lmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBwYXR0ZXJuLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbE1hdGNoZXM6IG1hdGNoZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBtYXhSZXN1bHRzOiBtYXhSZXN1bHRzLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0TGluZXM6IGNvbnRleHRMaW5lcyxcbiAgICAgICAgICAgICAgICAgICAgbG9nRmlsZVBhdGg6IGxvZ0ZpbGVQYXRoLFxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzOiBtYXRjaGVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byBzZWFyY2ggcHJvamVjdCBsb2dzOiAke2Vycm9yLm1lc3NhZ2V9YFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZm9ybWF0RmlsZVNpemUoYnl0ZXM6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHVuaXRzID0gWydCJywgJ0tCJywgJ01CJywgJ0dCJ107XG4gICAgICAgIGxldCBzaXplID0gYnl0ZXM7XG4gICAgICAgIGxldCB1bml0SW5kZXggPSAwO1xuICAgICAgICBcbiAgICAgICAgd2hpbGUgKHNpemUgPj0gMTAyNCAmJiB1bml0SW5kZXggPCB1bml0cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBzaXplIC89IDEwMjQ7XG4gICAgICAgICAgICB1bml0SW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGAke3NpemUudG9GaXhlZCgyKX0gJHt1bml0c1t1bml0SW5kZXhdfWA7XG4gICAgfVxufSJdfQ==