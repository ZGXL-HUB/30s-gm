// 数据迁移脚本：将 category 中的小类迁移到 grammarPoint
// 在微信开发者工具控制台运行

// 定义小类到父类的映射关系
const CATEGORY_TO_PARENT_MAPPING = {
  // 关系词 → 关系代词（grammarPoint），代词（category）
  'whose': { category: '代词', grammarPoint: 'whose' },
  'how': { category: '代词', grammarPoint: 'how' },
  'why': { category: '代词', grammarPoint: 'why' },
  'when': { category: '代词', grammarPoint: 'when' },
  'where': { category: '代词', grammarPoint: 'where' },
  'that能填吗': { category: '代词', grammarPoint: 'that能填吗' },
  'who和which选哪个': { category: '代词', grammarPoint: 'who和which选哪个' },
  'which和when/where混淆': { category: '代词', grammarPoint: 'which和when/where混淆' },
  
  // 代词小类 → 代词（category）
  '物主代词': { category: '代词', grammarPoint: '物主代词' },
  '关系代词': { category: '代词', grammarPoint: '关系代词' },
  '反身代词': { category: '代词', grammarPoint: '反身代词' },
  '人称代词': { category: '代词', grammarPoint: '人称代词' },
  'it相关': { category: '代词', grammarPoint: 'it相关' },
  
  // 时态小类 → 动词时态（category）
  '过去时': { category: '动词时态', grammarPoint: '过去时' },
  '现在时': { category: '动词时态', grammarPoint: '现在时' },
  '进行时': { category: '动词时态', grammarPoint: '进行时' },
  '完成时': { category: '动词时态', grammarPoint: '完成时' },
  
  // 形容词副词小类 → 形容词与副词（category）
  '比较级': { category: '形容词与副词', grammarPoint: '比较级' },
  '最高级': { category: '形容词与副词', grammarPoint: '最高级' },
  
  // 冠词小类 → 冠词（category）
  'a和an': { category: '冠词', grammarPoint: 'a和an' },
  '泛指与特指': { category: '冠词', grammarPoint: '泛指与特指' },
  'the的特殊用法': { category: '冠词', grammarPoint: 'the的特殊用法' },
  
  // 非谓语小类 → 非谓语综合（category）
  '现在分词综合': { category: '非谓语综合', grammarPoint: '现在分词' },
  '过去分词综合': { category: '非谓语综合', grammarPoint: '过去分词' },
  '不定式综合': { category: '非谓语综合', grammarPoint: '不定式' },
  
  // 副词修饰 → 副词综合（category）
  '副词修饰动词': { category: '副词综合', grammarPoint: '副词修饰动词' },
  '副词修饰形容词/副词': { category: '副词综合', grammarPoint: '副词修饰形容词/副词' },
  
  // 名词复数 → 名词综合（category）
  '以y结尾': { category: '名词综合', grammarPoint: '以y结尾' },
  '以o结尾': { category: '名词综合', grammarPoint: '以o结尾' },
  's/sh/ch/x结尾': { category: '名词综合', grammarPoint: 's/sh/ch/x结尾' },
  'f/fe结尾': { category: '名词综合', grammarPoint: 'f/fe结尾' },
  '名词复数书写综合': { category: '名词综合', grammarPoint: '名词复数' },
  
  // 被动语态相关
  '被动写be吗': { category: '被动语态', grammarPoint: '被动写be吗' },
  
  // 谓语相关
  '谓语(8)': { category: '谓语综合', grammarPoint: '谓语(8)' },
  '谓语(9)': { category: '谓语综合', grammarPoint: '谓语(9)' },
  
  // 连词组合 → 连词（category）
  '连词与名词': { category: '连词', grammarPoint: '连词与名词' },
  '连词与动词': { category: '连词', grammarPoint: '连词与动词' },
  '连词与形容词': { category: '连词', grammarPoint: '连词与形容词' },
  '连词与名/动/形/副综合': { category: '连词', grammarPoint: '连词与名/动/形/副综合' },
  
  // 动词组合 → 动词综合（category）
  '主从句与动词': { category: '动词综合', grammarPoint: '主从句与动词' },
  '插入语与动词': { category: '动词综合', grammarPoint: '插入语与动词' },
  '并列句与动词': { category: '动词综合', grammarPoint: '并列句与动词' },
  
  // 从句综合 → 复合句（category）
  '定语从句综合': { category: '复合句', grammarPoint: '定语从句' },
  '状语从句综合': { category: '复合句', grammarPoint: '状语从句' }
};

async function migrateCategoryToGrammarPoint(dryRun = true) {
  try {
    console.log(`🔄 开始${dryRun ? '模拟' : ''}迁移 category 到 grammarPoint...\n`);
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    const _ = db.command;
    
    // 1. 获取所有需要迁移的题目
    console.log('📥 获取需要迁移的题目...');
    
    const categoriesToMigrate = Object.keys(CATEGORY_TO_PARENT_MAPPING);
    console.log(`   需要迁移的分类: ${categoriesToMigrate.length} 个\n`);
    
    const migrationPlan = {};
    let totalQuestions = 0;
    
    // 2. 分析每个需要迁移的分类
    for (const oldCategory of categoriesToMigrate) {
      const mapping = CATEGORY_TO_PARENT_MAPPING[oldCategory];
      
      // 查询该分类下的所有题目
      const result = await questionsCollection
        .where({
          category: oldCategory
        })
        .field({
          _id: true,
          category: true,
          grammarPoint: true,
          tag: true
        })
        .get();
      
      if (result.data.length > 0) {
        migrationPlan[oldCategory] = {
          oldCategory,
          newCategory: mapping.category,
          newGrammarPoint: mapping.grammarPoint,
          count: result.data.length,
          questions: result.data
        };
        totalQuestions += result.data.length;
        console.log(`   "${oldCategory}": ${result.data.length} 题 → category: "${mapping.category}", grammarPoint: "${mapping.grammarPoint}"`);
      }
    }
    
    console.log(`\n✅ 共找到 ${totalQuestions} 道需要迁移的题目\n`);
    
    // 3. 显示迁移计划
    console.log('📋 迁移计划:\n');
    Object.values(migrationPlan).forEach((plan, index) => {
      console.log(`${(index + 1).toString().padStart(2)}. ${plan.oldCategory.padEnd(25)} ${plan.count.toString().padStart(4)} 题`);
      console.log(`    → category: "${plan.newCategory}"`);
      console.log(`    → grammarPoint: "${plan.newGrammarPoint}"\n`);
    });
    
    // 4. 执行迁移（如果不是 dry run）
    if (dryRun) {
      console.log('💡 这是模拟运行，不会实际修改数据');
      console.log('   如需实际执行，请调用: migrateCategoryToGrammarPoint(false)\n');
    } else {
      console.log('🚀 开始执行批量迁移...\n');
      
      let updated = 0;
      let failed = 0;
      const BATCH_SIZE = 20;
      
      for (const [oldCategory, plan] of Object.entries(migrationPlan)) {
        console.log(`\n📝 迁移 "${oldCategory}" (${plan.count} 题)...`);
        
        for (let i = 0; i < plan.questions.length; i += BATCH_SIZE) {
          const batch = plan.questions.slice(i, i + BATCH_SIZE);
          
          const updatePromises = batch.map(q => {
            // 构建更新数据
            const updateData = {
              category: plan.newCategory
            };
            
            // 如果题目没有 grammarPoint，则设置新的 grammarPoint
            // 如果已有 grammarPoint，保留原有值（不覆盖）
            if (!q.grammarPoint && !q.tag) {
              updateData.grammarPoint = plan.newGrammarPoint;
            }
            
            return questionsCollection.doc(q._id).update({
              data: updateData
            });
          });
          
          try {
            await Promise.all(updatePromises);
            updated += batch.length;
            console.log(`   已更新 ${Math.min(i + BATCH_SIZE, plan.questions.length)}/${plan.questions.length} 题...`);
          } catch (error) {
            console.error(`   批次更新失败:`, error);
            failed += batch.length;
          }
        }
      }
      
      console.log(`\n✅ 批量迁移完成！`);
      console.log(`   成功更新: ${updated} 题`);
      console.log(`   更新失败: ${failed} 题\n`);
      
      // 验证结果
      console.log('📊 验证迁移结果...');
      let remainingCount = 0;
      for (const oldCategory of categoriesToMigrate) {
        const result = await questionsCollection
          .where({ category: oldCategory })
          .count();
        if (result.total > 0) {
          remainingCount += result.total;
          console.log(`   ⚠️ "${oldCategory}" 仍有 ${result.total} 题未迁移`);
        }
      }
      
      if (remainingCount === 0) {
        console.log('   ✅ 所有分类已成功迁移！');
      } else {
        console.log(`   ⚠️ 仍有 ${remainingCount} 题未迁移`);
      }
    }
    
    return {
      success: true,
      dryRun: dryRun,
      totalQuestions: totalQuestions,
      migrationPlan: migrationPlan
    };
    
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行模拟（不实际修改数据）
console.log('🚀 Category 到 GrammarPoint 迁移工具\n');
console.log('💡 提示: 这是模拟运行，不会修改数据');
console.log('   查看迁移计划后，如需实际执行，请调用: migrateCategoryToGrammarPoint(false)\n');
migrateCategoryToGrammarPoint(true);
