import { PrefabTools } from '../tools/prefab-tools';

/**
 * 预制体实例化使用示例
 * 展示如何在实际项目中使用预制体工具
 */
export class PrefabInstantiationExample {
    private prefabTools: PrefabTools;

    constructor() {
        this.prefabTools = new PrefabTools();
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
            } else {
                console.log('❌ 预制体实例化失败');
                console.log(`错误: ${result.error}`);
                if (result.instruction) {
                    console.log(`建议: ${result.instruction}`);
                }
            }
        } catch (error) {
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
            } else {
                console.log('❌ 实例化失败');
                console.log(`错误: ${result.error}`);
            }
        } catch (error) {
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
                } else {
                    console.log(`❌ 预制体 ${i + 1} 实例化失败: ${result.error}`);
                }
            } catch (error) {
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
                } else {
                    console.log(`❌ 尝试 ${attempt + 1} 失败: ${result.error}`);
                    attempt++;
                    
                    if (attempt < maxRetries) {
                        console.log(`等待 1 秒后重试...`);
                        await this.delay(1000);
                    }
                }
            } catch (error) {
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
                } else {
                    console.log('❌ 预制体实例化失败:', instantiationResult.error);
                    return instantiationResult;
                }
            } else {
                console.log('❌ 预制体验证失败');
                if (validationResult.data && validationResult.data.issues) {
                    console.log('问题列表:');
                    validationResult.data.issues.forEach((issue: string, index: number) => {
                        console.log(`  ${index + 1}. ${issue}`);
                    });
                }
                return validationResult;
            }
        } catch (error) {
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
    private delay(ms: number): Promise<void> {
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

// 如果直接运行此文件
if (typeof module !== 'undefined' && module.exports) {
    const example = new PrefabInstantiationExample();
    example.runAllExamples();
} 