/**
 * 检查小语法点数量不足20题的脚本
 * 
 * 功能说明：
 * 1. 查询数据库中所有语法点（grammarPoint 和 category 字段）
 * 2. 对每个语法点，使用 OR 查询统计题目数量（匹配 category 或 grammarPoint）
 * 3. 找出数量不足指定数量（默认20题）的语法点
 * 4. 输出详细的统计报告
 * 
 * 使用方法：
 * 在微信开发者工具控制台运行此脚本，然后调用：
 * - checkInsufficientGrammarPoints('high', 20)   // 检查高中学段，最少20题
 * - checkInsufficientGrammarPoints('middle', 20) // 检查初中学段，最少20题
 * - checkHighSchool()                            // 快速检查高中
 * - checkMiddleSchool()                           // 快速检查初中
 * 
 * 注意：
 * - 查询逻辑与 cloudDataLoader.js 中的查询逻辑一致，使用 OR 查询同时匹配 category 和 grammarPoint
 * - 统计时会过滤学段（schoolLevel），确保只统计指定学段的题目
 */

async function checkInsufficientGrammarPoints(schoolLevel = 'high', minCount = 20) {
  try {
    console.log(`📊 开始检查 ${schoolLevel} 学段下数量不足 ${minCount} 题的语法点...\n`);
    
    if (!wx.cloud) {
      throw new Error('云开发不可用，请确保已初始化云开发环境');
    }
    
    const db = wx.cloud.database();
    const _ = db.command;
    const questionsCollection = db.collection('questions');
    
    // 1. 获取所有题目（分批获取，只获取必要字段）
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
          tag: true,
          schoolLevel: true
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
    
    // 2. 收集所有唯一的 grammarPoint 值
    // 注意：优先收集 grammarPoint 字段的值，因为这是小语法点的标识
    // 同时也会收集 category 字段的值，因为有些题目可能只有 category 没有 grammarPoint
    console.log('📋 收集所有语法点...');
    const grammarPointSet = new Set();
    const categorySet = new Set();
    
    allQuestions.forEach(q => {
      // 收集 grammarPoint（优先）
      if (q.grammarPoint && q.grammarPoint.trim()) {
        grammarPointSet.add(q.grammarPoint.trim());
      }
      // 收集 tag（兼容旧数据）
      if (q.tag && q.tag.trim()) {
        grammarPointSet.add(q.tag.trim());
      }
      // 收集 category（作为备选，但需要过滤掉大类）
      if (q.category && q.category.trim()) {
        categorySet.add(q.category.trim());
      }
    });
    
    // 合并所有可能的语法点值
    // 优先使用 grammarPoint，然后使用 category 中不在 grammarPoint 中的值
    const allGrammarPoints = Array.from(grammarPointSet);
    categorySet.forEach(cat => {
      if (!grammarPointSet.has(cat)) {
        allGrammarPoints.push(cat);
      }
    });
    
    console.log(`✅ 找到 ${allGrammarPoints.length} 个不同的语法点`);
    console.log(`   - grammarPoint/tag: ${grammarPointSet.size} 个`);
    console.log(`   - category: ${categorySet.size} 个\n`);
    
    // 3. 对每个 grammarPoint，统计题目数量（使用 OR 查询：category 或 grammarPoint）
    console.log('🔍 开始统计每个语法点的题目数量...\n');
    const grammarPointStats = [];
    
    for (let i = 0; i < allGrammarPoints.length; i++) {
      const grammarPoint = allGrammarPoints[i];
      
      // 使用 OR 查询同时匹配 category 和 grammarPoint
      const orConditions = [
        { category: grammarPoint },
        { grammarPoint: grammarPoint },
        { tag: grammarPoint }
      ];
      
      // 添加学段过滤
      if (schoolLevel) {
        orConditions.forEach(condition => {
          condition.schoolLevel = schoolLevel;
        });
      }
      
      // 执行查询
      const result = await questionsCollection
        .where(_.or(orConditions))
        .count();
      
      const count = result.total;
      
      grammarPointStats.push({
        grammarPoint,
        count
      });
      
      // 显示进度
      if ((i + 1) % 10 === 0 || count < minCount) {
        const status = count < minCount ? '⚠️' : '✅';
        console.log(`${status} [${i + 1}/${allGrammarPoints.length}] "${grammarPoint}": ${count} 题`);
      }
    }
    
    // 4. 筛选出数量不足的语法点
    const insufficientGrammarPoints = grammarPointStats
      .filter(stat => stat.count < minCount)
      .sort((a, b) => a.count - b.count); // 按数量从少到多排序
    
    // 5. 输出结果
    console.log('\n' + '='.repeat(80));
    console.log(`📊 检查结果汇总（${schoolLevel} 学段，最少需要 ${minCount} 题）`);
    console.log('='.repeat(80));
    console.log(`\n总语法点数: ${allGrammarPoints.length}`);
    console.log(`数量不足 ${minCount} 题的语法点: ${insufficientGrammarPoints.length} 个\n`);
    
    if (insufficientGrammarPoints.length > 0) {
      console.log('⚠️ 数量不足的语法点列表：\n');
      console.log('序号'.padEnd(6) + '语法点名称'.padEnd(40) + '题目数量'.padEnd(12) + '缺少数量');
      console.log('-'.repeat(80));
      
      insufficientGrammarPoints.forEach((stat, index) => {
        const missing = minCount - stat.count;
        const indexStr = (index + 1).toString().padEnd(6);
        const nameStr = `"${stat.grammarPoint}"`.padEnd(40);
        const countStr = `${stat.count} 题`.padEnd(12);
        const missingStr = `${missing} 题`;
        console.log(`${indexStr}${nameStr}${countStr}${missingStr}`);
      });
      
      console.log('\n' + '='.repeat(80));
      console.log('📋 详细统计（JSON格式，便于后续处理）：');
      console.log('='.repeat(80));
      console.log(JSON.stringify({
        schoolLevel,
        minCount,
        totalGrammarPoints: allGrammarPoints.length,
        insufficientCount: insufficientGrammarPoints.length,
        insufficientGrammarPoints: insufficientGrammarPoints.map(stat => ({
          grammarPoint: stat.grammarPoint,
          count: stat.count,
          missing: minCount - stat.count
        }))
      }, null, 2));
      
      // 生成便于复制的列表
      console.log('\n' + '='.repeat(80));
      console.log('📝 语法点名称列表（便于复制）：');
      console.log('='.repeat(80));
      insufficientGrammarPoints.forEach((stat, index) => {
        console.log(`${index + 1}. "${stat.grammarPoint}" (${stat.count} 题，缺少 ${minCount - stat.count} 题)`);
      });
      
    } else {
      console.log('✅ 所有语法点的题目数量都满足要求！\n');
    }
    
    // 6. 返回统计结果
    return {
      success: true,
      schoolLevel,
      minCount,
      totalGrammarPoints: allGrammarPoints.length,
      insufficientCount: insufficientGrammarPoints.length,
      insufficientGrammarPoints: insufficientGrammarPoints.map(stat => ({
        grammarPoint: stat.grammarPoint,
        count: stat.count,
        missing: minCount - stat.count
      })),
      allStats: grammarPointStats.sort((a, b) => b.count - a.count) // 按数量从多到少排序
    };
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
    console.error('错误详情:', error.stack);
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
}

// 便捷函数：检查高中学段
async function checkHighSchool() {
  return await checkInsufficientGrammarPoints('high', 20);
}

// 便捷函数：检查初中学段
async function checkMiddleSchool() {
  return await checkInsufficientGrammarPoints('middle', 20);
}

// 运行检查（默认检查高中）
console.log('🚀 语法点数量检查工具\n');
console.log('使用方法：');
console.log('  - checkInsufficientGrammarPoints("high", 20)  // 检查高中，最少20题');
console.log('  - checkInsufficientGrammarPoints("middle", 20)  // 检查初中，最少20题');
console.log('  - checkHighSchool()  // 快速检查高中');
console.log('  - checkMiddleSchool()  // 快速检查初中');
console.log('\n开始检查高中学段...\n');

// 默认执行高中检查
checkHighSchool();
