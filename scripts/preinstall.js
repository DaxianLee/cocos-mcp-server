const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const PATH = {
    packageJSON: path.join(__dirname, "../package.json")
};

function checkCreatorTypesVersion(version) {
    try {
        // 根据平台选择合适的npm命令
        const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
        
        // 检查npm命令是否可用
        const npmCheck = spawnSync(npmCmd, ["--version"], { 
            stdio: 'pipe',
            shell: process.platform === "win32"
        });
        
        if (npmCheck.error || npmCheck.status !== 0) {
            console.warn("Warning: npm command not available, skipping version check");
            return true; // 如果npm不可用，跳过检查
        }
        
        // 获取版本列表
        const result = spawnSync(npmCmd, ["view", "@cocos/creator-types", "versions"], { 
            stdio: 'pipe',
            shell: process.platform === "win32"
        });
        
        if (result.error || result.status !== 0) {
            console.warn("Warning: Failed to fetch @cocos/creator-types versions, skipping check");
            return true; // 如果获取失败，跳过检查
        }
        
        let output = result.stdout.toString().trim();
        
        // 尝试解析JSON
        try {
            const versions = JSON.parse(output);
            if (Array.isArray(versions)) {
                return versions.includes(version);
            } else if (typeof versions === 'string') {
                return versions.includes(version);
            }
        } catch (parseError) {
            // 如果JSON解析失败，尝试作为字符串处理
            return output.includes(version);
        }
        
        return false;
    } catch (error) {
        console.warn("Warning: Version check failed:", error.message);
        return true; // 出错时跳过检查
    }
}

function getCreatorTypesVersion() {
    try {
        // 检查package.json文件是否存在
        if (!fs.existsSync(PATH.packageJSON)) {
            console.warn("Warning: package.json not found");
            return null;
        }
        
        const packageContent = fs.readFileSync(PATH.packageJSON, "utf8");
        const packageJson = JSON.parse(packageContent);
        
        // 检查devDependencies是否存在
        if (!packageJson.devDependencies || !packageJson.devDependencies["@cocos/creator-types"]) {
            console.warn("Warning: @cocos/creator-types not found in devDependencies");
            return null;
        }
        
        const versionString = packageJson.devDependencies["@cocos/creator-types"];
        return versionString.replace(/^[^\d]+/, "");
    } catch (error) {
        console.warn("Warning: Failed to read package.json:", error.message);
        return null;
    }
}

function main() {
    try {
        const creatorTypesVersion = getCreatorTypesVersion();
        
        if (!creatorTypesVersion) {
            console.log("Skipping @cocos/creator-types version check");
            return;
        }
        
        if (!checkCreatorTypesVersion(creatorTypesVersion)) {
            console.log("\x1b[33mWarning:\x1b[0m");
            console.log("  @en");
            console.log("    Version check of @cocos/creator-types failed.");
            console.log(`    The definition of ${creatorTypesVersion} has not been released yet. Please export the definition to the ./node_modules directory by selecting "Developer -> Export Interface Definition" in the menu of the Creator editor.`);
            console.log("    The definition of the corresponding version will be released on npm after the editor is officially released.");
            console.log("  @zh");
            console.log("    @cocos/creator-types 版本检查失败。");
            console.log(`    ${creatorTypesVersion} 定义还未发布，请先通过 Creator 编辑器菜单 "开发者 -> 导出接口定义"，导出定义到 ./node_modules 目录。`);
            console.log("    对应版本的定义会在编辑器正式发布后同步发布到 npm 上。");
        }
    } catch (error) {
        console.error("Preinstall script error:", error.message);
        // 不要抛出错误，让安装继续进行
        process.exit(0);
    }
}

// 执行主函数
main();