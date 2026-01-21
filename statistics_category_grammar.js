// 统计所有 category 和 grammarPoint 的脚本
// 在微信开发者工具控制台运行

async function statisticsCategoryAndGrammar() {
  try {
    console.log('📊 开始统计 category 和 grammarPoint...\n');
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    
    // 1. 获取所有题目（分批获取）
    console.log('📥 正在获取所有题目数据...');
    let allQuestions = [];
    let offset = 0;
    const MAX_BATCH = 20;
    
    while (true) {
      const result = await questionsCollection
        .field({
          _id: true,
          category: true,
          grammarPoint: true,
          tag: true
        })
        .skip(offset)
        .limit(MAX_BATCH)
        .get();
      
      if (result.data.length === 0) break;
      
      allQuestions.push(...result.data);
      offset += MAX_BATCH;
      
      if (result.data.length < MAX_BATCH) break;
      
      if (allQuestions.length % 100 === 0) {
        console.log(`   已获取 ${allQuestions.length} 题...`);
      }
    }
    
    console.log(`✅ 共获取 ${allQuestions.length} 道题目\n`);
    
    // 2. 统计 category
    console.log('📋 统计 category 分布:');
    const categoryCount = {};
    let noCategoryCount = 0;
    
    allQuestions.forEach(q => {
      const category = q.category || '未分类';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      if (!q.category) {
        noCategoryCount++;
      }
    });
    
    // 按数量排序
    const sortedCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a);
    
    console.log(`\n📊 Category 统计结果（共 ${sortedCategories.length} 个分类）:\n`);
    sortedCategories.forEach(([category, count]) => {
      const percentage = ((count / allQuestions.length) * 100).toFixed(2);
      console.log(`   "${category}": ${count} 题 (${percentage}%)`);
    });
    
    console.log(`\n📈 Category 汇总:`);
    console.log(`   总题目数: ${allQuestions.length}`);
    console.log(`   有分类: ${allQuestions.length - noCategoryCount} 题`);
    console.log(`   未分类: ${noCategoryCount} 题`);
    console.log(`   分类总数: ${sortedCategories.length} 个\n`);
    
    // 3. 统计 grammarPoint（优先使用 grammarPoint，如果没有则使用 tag）
    console.log('📋 统计 grammarPoint 分布:');
    const grammarPointCount = {};
    let noGrammarPointCount = 0;
    
    allQuestions.forEach(q => {
      // 优先使用 grammarPoint，如果没有则使用 tag
      const grammarPoint = q.grammarPoint || q.tag || '无';
      grammarPointCount[grammarPoint] = (grammarPointCount[grammarPoint] || 0) + 1;
      if (!q.grammarPoint && !q.tag) {
        noGrammarPointCount++;
      }
    });
    
    // 按数量排序
    const sortedGrammarPoints = Object.entries(grammarPointCount)
      .sort(([,a], [,b]) => b - a);
    
    console.log(`\n📊 GrammarPoint 统计结果（共 ${sortedGrammarPoints.length} 个语法点）:\n`);
    sortedGrammarPoints.forEach(([grammarPoint, count]) => {
      const percentage = ((count / allQuestions.length) * 100).toFixed(2);
      console.log(`   "${grammarPoint}": ${count} 题 (${percentage}%)`);
    });
    
    console.log(`\n📈 GrammarPoint 汇总:`);
    console.log(`   总题目数: ${allQuestions.length}`);
    console.log(`   有 grammarPoint/tag: ${allQuestions.length - noGrammarPointCount} 题`);
    console.log(`   无 grammarPoint/tag: ${noGrammarPointCount} 题`);
    console.log(`   语法点总数: ${sortedGrammarPoints.length} 个\n`);
    
    // 4. 生成详细报告
    console.log('📄 详细统计报告:\n');
    console.log('='.repeat(60));
    console.log('CATEGORY 统计');
    console.log('='.repeat(60));
    sortedCategories.forEach(([category, count], index) => {
      const percentage = ((count / allQuestions.length) * 100).toFixed(2);
      console.log(`${(index + 1).toString().padStart(3)}. ${category.padEnd(30)} ${count.toString().padStart(5)} 题 (${percentage}%)`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('GRAMMARPOINT 统计');
    console.log('='.repeat(60));
    sortedGrammarPoints.forEach(([grammarPoint, count], index) => {
      const percentage = ((count / allQuestions.length) * 100).toFixed(2);
      console.log(`${(index + 1).toString().padStart(3)}. ${grammarPoint.padEnd(30)} ${count.toString().padStart(5)} 题 (${percentage}%)`);
    });
    console.log('='.repeat(60) + '\n');
    
    // 5. 返回统计结果
    return {
      success: true,
      totalQuestions: allQuestions.length,
      categoryStats: {
        total: sortedCategories.length,
        noCategory: noCategoryCount,
        details: sortedCategories.map(([category, count]) => ({
          category,
          count,
          percentage: ((count / allQuestions.length) * 100).toFixed(2)
        }))
      },
      grammarPointStats: {
        total: sortedGrammarPoints.length,
        noGrammarPoint: noGrammarPointCount,
        details: sortedGrammarPoints.map(([grammarPoint, count]) => ({
          grammarPoint,
          count,
          percentage: ((count / allQuestions.length) * 100).toFixed(2)
        }))
      }
    };
    
  } catch (error) {
    console.error('❌ 统计失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行统计
console.log('🚀 Category 和 GrammarPoint 统计工具\n');
statisticsCategoryAndGrammar();
