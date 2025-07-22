"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefabInstantiationExample = void 0;
const prefab_tools_1 = require("../tools/prefab-tools");
/**
 * 预制体实例化使用示例
 * 展示如何在实际项目中使用预制体工具
 */
class PrefabInstantiationExample {
    constructor() {
        this.prefabTools = new prefab_tools_1.PrefabTools();
    }
    /**
     * 示例1: 基本预制体实例化
     */
    async basicInstantiationExample() {
        console.log('=== 基本预制体实例化示例 ===');
        try {
            const result = await this.prefabTools.execute('instantiate_prefab', {
                prefabPath: 'db://assets/prefabs/Player.prefab',
                position: { x: 0, y: 0, z: 0 }
            });
            if (result.success) {
                console.log('✅ 预制体实例化成功');
                console.log(`节点UUID: ${result.data.nodeUuid}`);
                console.log(`节点名称: ${result.data.name}`);
                console.log('使用的API: create-node with assetUuid');
            }
            else {
                console.log('❌ 预制体实例化失败');
                console.log(`错误: ${result.error}`);
                if (result.instruction) {
                    console.log(`建议: ${result.instruction}`);
                }
            }
        }
        catch (error) {
            console.error('实例化过程中发生错误:', error);
        }
    }
    /**
     * 示例2: 在指定父节点下实例化预制体
     */
    async instantiateWithParentExample() {
        console.log('=== 在父节点下实例化预制体示例 ===');
        try {
            const result = await this.prefabTools.execute('instantiate_prefab', {
                prefabPath: 'db://assets/prefabs/Enemy.prefab',
                parentUuid: 'canvas-uuid-here',
                position: { x: 100, y: 200, z: 0 }
            });
            if (result.success) {
                console.log('✅ 在父节点下实例化成功');
                console.log(`节点UUID: ${result.data.nodeUuid}`);
            }
            else {
                console.log('❌ 实例化失败');
                console.log(`错误: ${result.error}`);
            }
        }
        catch (error) {
            console.error('实例化过程中发生错误:', error);
        }
    }
    /**
     * 示例3: 批量实例化预制体
     */
    async batchInstantiationExample() {
        console.log('=== 批量实例化预制体示例 ===');
        const prefabPaths = [
            'db://assets/prefabs/Item1.prefab',
            'db://assets/prefabs/Item2.prefab',
            'db://assets/prefabs/Item3.prefab'
        ];
        const positions = [
            { x: 0, y: 0, z: 0 },
            { x: 100, y: 0, z: 0 },
            { x: 200, y: 0, z: 0 }
        ];
        const results = [];
        for (let i = 0; i < prefabPaths.length; i++) {
            try {
                const result = await this.prefabTools.execute('instantiate_prefab', {
                    prefabPath: prefabPaths[i],
                    position: positions[i]
                });
                results.push({
                    index: i,
                    prefabPath: prefabPaths[i],
                    success: result.success,
                    data: result.data,
                    error: result.error
                });
                if (result.success) {
                    console.log(`✅ 预制体 ${i + 1} 实例化成功`);
                }
                else {
                    console.log(`❌ 预制体 ${i + 1} 实例化失败: ${result.error}`);
                }
            }
            catch (error) {
                console.error(`预制体 ${i + 1} 实例化时发生错误:`, error);
                results.push({
                    index: i,
                    prefabPath: prefabPaths[i],
                    success: false,
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        }
        const successCount = results.filter(r => r.success).length;
        console.log(`批量实例化完成: ${successCount}/${results.length} 成功`);
        return results;
    }
    /**
     * 示例4: 错误处理和重试机制
     */
    async instantiationWithRetryExample() {
        console.log('=== 带重试机制的实例化示例 ===');
        const maxRetries = 3;
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                const result = await this.prefabTools.execute('instantiate_prefab', {
                    prefabPath: 'db://assets/prefabs/ComplexPrefab.prefab',
                    position: { x: 0, y: 0, z: 0 }
                });
                if (result.success) {
                    console.log(`✅ 预制体实例化成功 (尝试 ${attempt + 1})`);
                    return result;
                }
                else {
                    console.log(`❌ 尝试 ${attempt + 1} 失败: ${result.error}`);
                    attempt++;
                    if (attempt < maxRetries) {
                        console.log(`等待 1 秒后重试...`);
                        await this.delay(1000);
                    }
                }
            }
            catch (error) {
                console.error(`尝试 ${attempt + 1} 时发生错误:`, error);
                attempt++;
                if (attempt < maxRetries) {
                    console.log(`等待 1 秒后重试...`);
                    await this.delay(1000);
                }
            }
        }
        console.log('❌ 所有重试都失败了');
        return { success: false, error: '达到最大重试次数' };
    }
    /**
     * 示例5: 预制体实例化前的验证
     */
    async instantiationWithValidationExample() {
        console.log('=== 带验证的实例化示例 ===');
        const prefabPath = 'db://assets/prefabs/ValidatedPrefab.prefab';
        try {
            // 首先验证预制体
            const validationResult = await this.prefabTools.execute('validate_prefab', {
                prefabPath: prefabPath
            });
            if (validationResult.success && validationResult.data.isValid) {
                console.log('✅ 预制体验证通过');
                console.log(`节点数量: ${validationResult.data.nodeCount}`);
                console.log(`组件数量: ${validationResult.data.componentCount}`);
                // 验证通过后实例化
                const instantiationResult = await this.prefabTools.execute('instantiate_prefab', {
                    prefabPath: prefabPath,
                    position: { x: 0, y: 0, z: 0 }
                });
                if (instantiationResult.success) {
                    console.log('✅ 预制体实例化成功');
                    return instantiationResult;
                }
                else {
                    console.log('❌ 预制体实例化失败:', instantiationResult.error);
                    return instantiationResult;
                }
            }
            else {
                console.log('❌ 预制体验证失败');
                if (validationResult.data && validationResult.data.issues) {
                    console.log('问题列表:');
                    validationResult.data.issues.forEach((issue, index) => {
                        console.log(`  ${index + 1}. ${issue}`);
                    });
                }
                return validationResult;
            }
        }
        catch (error) {
            console.error('验证和实例化过程中发生错误:', error);
            return { success: false, error: error instanceof Error ? error.message : String(error) };
        }
    }
    /**
     * 示例6: API参数构建示例
     */
    demonstrateAPIParameters() {
        console.log('=== API参数构建示例 ===');
        // 模拟从asset-db获取的预制体信息
        const assetInfo = {
            uuid: 'prefab-uuid-123',
            name: 'PlayerCharacter'
        };
        // 基本实例化参数
        const basicOptions = {
            assetUuid: assetInfo.uuid,
            name: assetInfo.name
        };
        console.log('基本实例化参数:', JSON.stringify(basicOptions, null, 2));
        // 带父节点的实例化参数
        const withParentOptions = {
            assetUuid: assetInfo.uuid,
            name: assetInfo.name,
            parent: 'canvas-uuid-456'
        };
        console.log('带父节点参数:', JSON.stringify(withParentOptions, null, 2));
        // 带位置设置的实例化参数
        const withPositionOptions = {
            assetUuid: assetInfo.uuid,
            name: assetInfo.name,
            dump: {
                position: { x: 100, y: 200, z: 0 }
            }
        };
        console.log('带位置参数:', JSON.stringify(withPositionOptions, null, 2));
        // 完整实例化参数
        const fullOptions = {
            assetUuid: assetInfo.uuid,
            name: assetInfo.name,
            parent: 'canvas-uuid-456',
            dump: {
                position: { x: 100, y: 200, z: 0 }
            },
            keepWorldTransform: false,
            unlinkPrefab: false
        };
        console.log('完整参数:', JSON.stringify(fullOptions, null, 2));
        console.log('这些参数将传递给 Editor.Message.request("scene", "create-node", options)');
    }
    /**
     * 延迟函数
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * 运行所有示例
     */
    async runAllExamples() {
        console.log('🚀 开始运行预制体实例化示例...\n');
        await this.basicInstantiationExample();
        console.log('');
        await this.instantiateWithParentExample();
        console.log('');
        await this.batchInstantiationExample();
        console.log('');
        await this.instantiationWithRetryExample();
        console.log('');
        await this.instantiationWithValidationExample();
        console.log('');
        this.demonstrateAPIParameters();
        console.log('');
        console.log('🎉 所有示例运行完成！');
    }
}
exports.PrefabInstantiationExample = PrefabInstantiationExample;
// 如果直接运行此文件
if (typeof module !== 'undefined' && module.exports) {
    const example = new PrefabInstantiationExample();
    example.runAllExamples();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmFiLWluc3RhbnRpYXRpb24tZXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9leGFtcGxlcy9wcmVmYWItaW5zdGFudGlhdGlvbi1leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdEQUFvRDtBQUVwRDs7O0dBR0c7QUFDSCxNQUFhLDBCQUEwQjtJQUduQztRQUNJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSwwQkFBVyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLHlCQUF5QjtRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFbEMsSUFBSSxDQUFDO1lBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRTtnQkFDaEUsVUFBVSxFQUFFLG1DQUFtQztnQkFDL0MsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFDakMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUN0RCxDQUFDO2lCQUFNLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDMUIsT0FBTyxDQUFDLEdBQUcs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O1FBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFaEIsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVoQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQXZTRCxnRUF1U0M7QUFFRCxZQUFZO0FBQ1osSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2xELE1BQU0sT0FBTyxHQUFHLElBQUksMEJBQTBCLEVBQUUsQ0FBQztJQUNqRCxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDN0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByZWZhYlRvb2xzIH0gZnJvbSAnLi4vdG9vbHMvcHJlZmFiLXRvb2xzJztcblxuLyoqXG4gKiDpooTliLbkvZPlrp7kvovljJbkvb/nlKjnpLrkvotcbiAqIOWxleekuuWmguS9leWcqOWunumZhemhueebruS4reS9v+eUqOmihOWItuS9k+W3peWFt1xuICovXG5leHBvcnQgY2xhc3MgUHJlZmFiSW5zdGFudGlhdGlvbkV4YW1wbGUge1xuICAgIHByaXZhdGUgcHJlZmFiVG9vbHM6IFByZWZhYlRvb2xzO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucHJlZmFiVG9vbHMgPSBuZXcgUHJlZmFiVG9vbHMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnpLrkvosxOiDln7rmnKzpooTliLbkvZPlrp7kvovljJZcbiAgICAgKi9cbiAgICBhc3luYyBiYXNpY0luc3RhbnRpYXRpb25FeGFtcGxlKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnPT09IOWfuuacrOmihOWItuS9k+WunuS+i+WMluekuuS+iyA9PT0nKTtcbiAgICAgICAgXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnByZWZhYlRvb2xzLmV4ZWN1dGUoJ2luc3RhbnRpYXRlX3ByZWZhYicsIHtcbiAgICAgICAgICAgICAgICBwcmVmYWJQYXRoOiAnZGI6Ly9hc3NldHMvcHJlZmFicy9QbGF5ZXIucHJlZmFiJyxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogeyB4OiAwLCB5OiAwLCB6OiAwIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn4pyFIOmihOWItuS9k+WunuS+i+WMluaIkOWKnycpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDoioLngrlVVUlEOiAke3Jlc3VsdC5kYXRhLm5vZGVVdWlkfWApO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDoioLngrnlkI3np7A6ICR7cmVzdWx0LmRhdGEubmFtZX1gKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5L2/55So55qEQVBJOiBjcmVhdGUtbm9kZSB3aXRoIGFzc2V0VXVpZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn4p2MIOmihOWItuS9k+WunuS+i+WMluWksei0pScpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDplJnor686ICR7cmVzdWx0LmVycm9yfWApO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuaW5zdHJ1Y3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYOW7uuiurjogJHtyZXN1bHQuaW5zdHJ1Y3Rpb259YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcign5a6e5L6L5YyW6L+H56iL5Lit5Y+R55Sf6ZSZ6K+vOicsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOekuuS+izI6IOWcqOaMh+WumueItuiKgueCueS4i+WunuS+i+WMlumihOWItuS9k1xuICAgICAqL1xuICAgIGFzeW5jIGluc3RhbnRpYXRlV2l0aFBhcmVudEV4YW1wbGUoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCc9PT0g5Zyo54i26IqC54K55LiL5a6e5L6L5YyW6aKE5Yi25L2T56S65L6LID09PScpO1xuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucHJlZmFiVG9vbHMuZXhlY3V0ZSgnaW5zdGFudGlhdGVfcHJlZmFiJywge1xuICAgICAgICAgICAgICAgIHByZWZhYlBhdGg6ICdkYjovL2Fzc2V0cy9wcmVmYWJzL0VuZW15LnByZWZhYicsXG4gICAgICAgICAgICAgICAgcGFyZW50VXVpZDogJ2NhbnZhcy11dWlkLWhlcmUnLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7IHg6IDEwMCwgeTogMjAwLCB6OiAwIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn4pyFIOWcqOeItuiKgueCueS4i+WunuS+i+WMluaIkOWKnycpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDoioLngrlVVUlEOiAke3Jlc3VsdC5kYXRhLm5vZGVVdWlkfWApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn4p2MIOWunuS+i+WMluWksei0pScpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDplJnor686ICR7cmVzdWx0LmVycm9yfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcign5a6e5L6L5YyW6L+H56iL5Lit5Y+R55Sf6ZSZ6K+vOicsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOekuuS+izM6IOaJuemHj+WunuS+i+WMlumihOWItuS9k1xuICAgICAqL1xuICAgIGFzeW5jIGJhdGNoSW5zdGFudGlhdGlvbkV4YW1wbGUoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCc9PT0g5om56YeP5a6e5L6L5YyW6aKE5Yi25L2T56S65L6LID09PScpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcHJlZmFiUGF0aHMgPSBbXG4gICAgICAgICAgICAnZGI6Ly9hc3NldHMvcHJlZmFicy9JdGVtMS5wcmVmYWInLFxuICAgICAgICAgICAgJ2RiOi8vYXNzZXRzL3ByZWZhYnMvSXRlbTIucHJlZmFiJyxcbiAgICAgICAgICAgICdkYjovL2Fzc2V0cy9wcmVmYWJzL0l0ZW0zLnByZWZhYidcbiAgICAgICAgXTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBbXG4gICAgICAgICAgICB7IHg6IDAsIHk6IDAsIHo6IDAgfSxcbiAgICAgICAgICAgIHsgeDogMTAwLCB5OiAwLCB6OiAwIH0sXG4gICAgICAgICAgICB7IHg6IDIwMCwgeTogMCwgejogMCB9XG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJlZmFiUGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5wcmVmYWJUb29scy5leGVjdXRlKCdpbnN0YW50aWF0ZV9wcmVmYWInLCB7XG4gICAgICAgICAgICAgICAgICAgIHByZWZhYlBhdGg6IHByZWZhYlBhdGhzW2ldLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb25zW2ldXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgICAgICAgICAgcHJlZmFiUGF0aDogcHJlZmFiUGF0aHNbaV0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlc3VsdC5zdWNjZXNzLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXN1bHQuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHJlc3VsdC5lcnJvclxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDinIUg6aKE5Yi25L2TICR7aSArIDF9IOWunuS+i+WMluaIkOWKn2ApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDinYwg6aKE5Yi25L2TICR7aSArIDF9IOWunuS+i+WMluWksei0pTogJHtyZXN1bHQuZXJyb3J9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGDpooTliLbkvZMgJHtpICsgMX0g5a6e5L6L5YyW5pe25Y+R55Sf6ZSZ6K+vOmAsIGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgICAgICAgICAgcHJlZmFiUGF0aDogcHJlZmFiUGF0aHNbaV0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdWNjZXNzQ291bnQgPSByZXN1bHRzLmZpbHRlcihyID0+IHIuc3VjY2VzcykubGVuZ3RoO1xuICAgICAgICBjb25zb2xlLmxvZyhg5om56YeP5a6e5L6L5YyW5a6M5oiQOiAke3N1Y2Nlc3NDb3VudH0vJHtyZXN1bHRzLmxlbmd0aH0g5oiQ5YqfYCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnpLrkvos0OiDplJnor6/lpITnkIblkozph43or5XmnLrliLZcbiAgICAgKi9cbiAgICBhc3luYyBpbnN0YW50aWF0aW9uV2l0aFJldHJ5RXhhbXBsZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJz09PSDluKbph43or5XmnLrliLbnmoTlrp7kvovljJbnpLrkvosgPT09Jyk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBtYXhSZXRyaWVzID0gMztcbiAgICAgICAgbGV0IGF0dGVtcHQgPSAwO1xuXG4gICAgICAgIHdoaWxlIChhdHRlbXB0IDwgbWF4UmV0cmllcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnByZWZhYlRvb2xzLmV4ZWN1dGUoJ2luc3RhbnRpYXRlX3ByZWZhYicsIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlZmFiUGF0aDogJ2RiOi8vYXNzZXRzL3ByZWZhYnMvQ29tcGxleFByZWZhYi5wcmVmYWInLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogeyB4OiAwLCB5OiAwLCB6OiAwIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg4pyFIOmihOWItuS9k+WunuS+i+WMluaIkOWKnyAo5bCd6K+VICR7YXR0ZW1wdCArIDF9KWApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDinYwg5bCd6K+VICR7YXR0ZW1wdCArIDF9IOWksei0pTogJHtyZXN1bHQuZXJyb3J9YCk7XG4gICAgICAgICAgICAgICAgICAgIGF0dGVtcHQrKztcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRlbXB0IDwgbWF4UmV0cmllcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYOetieW+hSAxIOenkuWQjumHjeivlS4uLmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kZWxheSgxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihg5bCd6K+VICR7YXR0ZW1wdCArIDF9IOaXtuWPkeeUn+mUmeivrzpgLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgYXR0ZW1wdCsrO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChhdHRlbXB0IDwgbWF4UmV0cmllcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg562J5b6FIDEg56eS5ZCO6YeN6K+VLi4uYCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGVsYXkoMTAwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ+KdjCDmiYDmnInph43or5Xpg73lpLHotKXkuoYnKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAn6L6+5Yiw5pyA5aSn6YeN6K+V5qyh5pWwJyB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOekuuS+izU6IOmihOWItuS9k+WunuS+i+WMluWJjeeahOmqjOivgVxuICAgICAqL1xuICAgIGFzeW5jIGluc3RhbnRpYXRpb25XaXRoVmFsaWRhdGlvbkV4YW1wbGUoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCc9PT0g5bim6aqM6K+B55qE5a6e5L6L5YyW56S65L6LID09PScpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcHJlZmFiUGF0aCA9ICdkYjovL2Fzc2V0cy9wcmVmYWJzL1ZhbGlkYXRlZFByZWZhYi5wcmVmYWInO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyDpppblhYjpqozor4HpooTliLbkvZNcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRpb25SZXN1bHQgPSBhd2FpdCB0aGlzLnByZWZhYlRvb2xzLmV4ZWN1dGUoJ3ZhbGlkYXRlX3ByZWZhYicsIHtcbiAgICAgICAgICAgICAgICBwcmVmYWJQYXRoOiBwcmVmYWJQYXRoXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHZhbGlkYXRpb25SZXN1bHQuc3VjY2VzcyAmJiB2YWxpZGF0aW9uUmVzdWx0LmRhdGEuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfinIUg6aKE5Yi25L2T6aqM6K+B6YCa6L+HJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYOiKgueCueaVsOmHjzogJHt2YWxpZGF0aW9uUmVzdWx0LmRhdGEubm9kZUNvdW50fWApO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDnu4Tku7bmlbDph486ICR7dmFsaWRhdGlvblJlc3VsdC5kYXRhLmNvbXBvbmVudENvdW50fWApO1xuXG4gICAgICAgICAgICAgICAgLy8g6aqM6K+B6YCa6L+H5ZCO5a6e5L6L5YyWXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFudGlhdGlvblJlc3VsdCA9IGF3YWl0IHRoaXMucHJlZmFiVG9vbHMuZXhlY3V0ZSgnaW5zdGFudGlhdGVfcHJlZmFiJywge1xuICAgICAgICAgICAgICAgICAgICBwcmVmYWJQYXRoOiBwcmVmYWJQYXRoLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogeyB4OiAwLCB5OiAwLCB6OiAwIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW50aWF0aW9uUmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+KchSDpooTliLbkvZPlrp7kvovljJbmiJDlip8nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbnRpYXRpb25SZXN1bHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+KdjCDpooTliLbkvZPlrp7kvovljJblpLHotKU6JywgaW5zdGFudGlhdGlvblJlc3VsdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW50aWF0aW9uUmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+KdjCDpooTliLbkvZPpqozor4HlpLHotKUnKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdGlvblJlc3VsdC5kYXRhICYmIHZhbGlkYXRpb25SZXN1bHQuZGF0YS5pc3N1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+mXrumimOWIl+ihqDonKTtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvblJlc3VsdC5kYXRhLmlzc3Vlcy5mb3JFYWNoKChpc3N1ZTogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgICAke2luZGV4ICsgMX0uICR7aXNzdWV9YCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsaWRhdGlvblJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ+mqjOivgeWSjOWunuS+i+WMlui/h+eoi+S4reWPkeeUn+mUmeivrzonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog56S65L6LNjogQVBJ5Y+C5pWw5p6E5bu656S65L6LXG4gICAgICovXG4gICAgZGVtb25zdHJhdGVBUElQYXJhbWV0ZXJzKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnPT09IEFQSeWPguaVsOaehOW7uuekuuS+iyA9PT0nKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOaooeaLn+S7jmFzc2V0LWRi6I635Y+W55qE6aKE5Yi25L2T5L+h5oGvXG4gICAgICAgIGNvbnN0IGFzc2V0SW5mbyA9IHtcbiAgICAgICAgICAgIHV1aWQ6ICdwcmVmYWItdXVpZC0xMjMnLFxuICAgICAgICAgICAgbmFtZTogJ1BsYXllckNoYXJhY3RlcidcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIOWfuuacrOWunuS+i+WMluWPguaVsFxuICAgICAgICBjb25zdCBiYXNpY09wdGlvbnMgPSB7XG4gICAgICAgICAgICBhc3NldFV1aWQ6IGFzc2V0SW5mby51dWlkLFxuICAgICAgICAgICAgbmFtZTogYXNzZXRJbmZvLm5hbWVcbiAgICAgICAgfTtcbiAgICAgICAgY29uc29sZS5sb2coJ+WfuuacrOWunuS+i+WMluWPguaVsDonLCBKU09OLnN0cmluZ2lmeShiYXNpY09wdGlvbnMsIG51bGwsIDIpKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOW4pueItuiKgueCueeahOWunuS+i+WMluWPguaVsFxuICAgICAgICBjb25zdCB3aXRoUGFyZW50T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGFzc2V0VXVpZDogYXNzZXRJbmZvLnV1aWQsXG4gICAgICAgICAgICBuYW1lOiBhc3NldEluZm8ubmFtZSxcbiAgICAgICAgICAgIHBhcmVudDogJ2NhbnZhcy11dWlkLTQ1NidcbiAgICAgICAgfTtcbiAgICAgICAgY29uc29sZS5sb2coJ+W4pueItuiKgueCueWPguaVsDonLCBKU09OLnN0cmluZ2lmeSh3aXRoUGFyZW50T3B0aW9ucywgbnVsbCwgMikpO1xuICAgICAgICBcbiAgICAgICAgLy8g5bim5L2N572u6K6+572u55qE5a6e5L6L5YyW5Y+C5pWwXG4gICAgICAgIGNvbnN0IHdpdGhQb3NpdGlvbk9wdGlvbnMgPSB7XG4gICAgICAgICAgICBhc3NldFV1aWQ6IGFzc2V0SW5mby51dWlkLFxuICAgICAgICAgICAgbmFtZTogYXNzZXRJbmZvLm5hbWUsXG4gICAgICAgICAgICBkdW1wOiB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHsgeDogMTAwLCB5OiAyMDAsIHo6IDAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zb2xlLmxvZygn5bim5L2N572u5Y+C5pWwOicsIEpTT04uc3RyaW5naWZ5KHdpdGhQb3NpdGlvbk9wdGlvbnMsIG51bGwsIDIpKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOWujOaVtOWunuS+i+WMluWPguaVsFxuICAgICAgICBjb25zdCBmdWxsT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGFzc2V0VXVpZDogYXNzZXRJbmZvLnV1aWQsXG4gICAgICAgICAgICBuYW1lOiBhc3NldEluZm8ubmFtZSxcbiAgICAgICAgICAgIHBhcmVudDogJ2NhbnZhcy11dWlkLTQ1NicsXG4gICAgICAgICAgICBkdW1wOiB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHsgeDogMTAwLCB5OiAyMDAsIHo6IDAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGtlZXBXb3JsZFRyYW5zZm9ybTogZmFsc2UsXG4gICAgICAgICAgICB1bmxpbmtQcmVmYWI6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIGNvbnNvbGUubG9nKCflrozmlbTlj4LmlbA6JywgSlNPTi5zdHJpbmdpZnkoZnVsbE9wdGlvbnMsIG51bGwsIDIpKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKCfov5nkupvlj4LmlbDlsIbkvKDpgJLnu5kgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdChcInNjZW5lXCIsIFwiY3JlYXRlLW5vZGVcIiwgb3B0aW9ucyknKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlu7bov5/lh73mlbBcbiAgICAgKi9cbiAgICBwcml2YXRlIGRlbGF5KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOi/kOihjOaJgOacieekuuS+i1xuICAgICAqL1xuICAgIGFzeW5jIHJ1bkFsbEV4YW1wbGVzKCkge1xuICAgICAgICBjb25zb2xlLmxvZygn8J+agCDlvIDlp4vov5DooYzpooTliLbkvZPlrp7kvovljJbnpLrkvosuLi5cXG4nKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmJhc2ljSW5zdGFudGlhdGlvbkV4YW1wbGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coJycpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuaW5zdGFudGlhdGVXaXRoUGFyZW50RXhhbXBsZSgpO1xuICAgICAgICBjb25zb2xlLmxvZygnJyk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5iYXRjaEluc3RhbnRpYXRpb25FeGFtcGxlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCcnKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmluc3RhbnRpYXRpb25XaXRoUmV0cnlFeGFtcGxlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCcnKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmluc3RhbnRpYXRpb25XaXRoVmFsaWRhdGlvbkV4YW1wbGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coJycpO1xuXG4gICAgICAgIHRoaXMuZGVtb25zdHJhdGVBUElQYXJhbWV0ZXJzKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCcnKTtcblxuICAgICAgICBjb25zb2xlLmxvZygn8J+OiSDmiYDmnInnpLrkvovov5DooYzlrozmiJDvvIEnKTtcbiAgICB9XG59XG5cbi8vIOWmguaenOebtOaOpei/kOihjOatpOaWh+S7tlxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgY29uc3QgZXhhbXBsZSA9IG5ldyBQcmVmYWJJbnN0YW50aWF0aW9uRXhhbXBsZSgpO1xuICAgIGV4YW1wbGUucnVuQWxsRXhhbXBsZXMoKTtcbn0gIl19