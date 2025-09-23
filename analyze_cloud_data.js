// 分析云数据库中的分类情况
// 在微信开发者工具控制台运行

async function analyzeCloudData() {
  try {
    console.log('🔍 开始分析云数据库中的分类情况...');
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    
    // 获取总数
    const countResult = await questionsCollection.count();
    console.log(`📊 云数据库中总题目数: ${countResult.total}`);
    
    // 获取所有分类统计
    const categoriesResult = await questionsCollection
      .aggregate()
      .group({
        _id: '$category',
        count: db.command.aggregate.sum(1)
      })
      .sort({
        count: -1  // 按数量降序排列
      })
      .end();
    
    console.log('📋 各分类题目数量（按数量降序）:');
    let totalCounted = 0;
    categoriesResult.list.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item._id}: ${item.count} 题`);
      totalCounted += item.count;
    });
    
    console.log(`\n📈 统计结果:`);
    console.log(`  总题目数: ${countResult.total}`);
    console.log(`  已统计题目数: ${totalCounted}`);
    console.log(`  差异: ${countResult.total - totalCounted}`);
    console.log(`  分类总数: ${categoriesResult.list.length}`);
    
    // 检查是否有空分类
    const emptyCategories = categoriesResult.list.filter(item => !item._id || item._id === '');
    if (emptyCategories.length > 0) {
      console.log(`\n⚠️ 发现空分类: ${emptyCategories.length} 个`);
      emptyCategories.forEach(item => {
        console.log(`  空分类: ${item.count} 题`);
      });
    }
    
    // 检查介词相关分类
    const prepositionCategories = categoriesResult.list.filter(item => 
      item._id && item._id.includes('介词')
    );
    
    if (prepositionCategories.length > 0) {
      console.log(`\n📝 介词相关分类:`);
      let prepositionTotal = 0;
      prepositionCategories.forEach(item => {
        console.log(`  ${item._id}: ${item.count} 题`);
        prepositionTotal += item.count;
      });
      console.log(`  介词相关题目总数: ${prepositionTotal}`);
    } else {
      console.log(`\n❌ 未发现介词相关分类`);
    }
    
    return {
      success: true,
      totalCount: countResult.total,
      categories: categoriesResult.list,
      totalCounted: totalCounted,
      prepositionCategories: prepositionCategories
    };
    
  } catch (error) {
    console.error('❌ 分析失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 获取所有题目数据（用于调试）
async function getAllQuestions() {
  try {
    console.log('📥 获取所有题目数据...');
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    
    // 获取所有数据
    const result = await questionsCollection.get();
    
    console.log(`📊 获取到 ${result.data.length} 道题目`);
    
    // 分析分类情况
    const categoryMap = {};
    result.data.forEach(question => {
      const category = question.category || '未分类';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    
    console.log('📋 分类统计:');
    Object.entries(categoryMap)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count} 题`);
      });
    
    return {
      success: true,
      questions: result.data,
      categoryMap: categoryMap
    };
    
  } catch (error) {
    console.error('❌ 获取数据失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行分析
console.log('🚀 云数据库分析脚本');
console.log('');
console.log('📋 可用的函数：');
console.log('1. analyzeCloudData() - 分析云数据库中的分类情况');
console.log('2. getAllQuestions() - 获取所有题目数据（用于调试）');
console.log('');
console.log('💡 建议执行顺序：');
console.log('   1. 运行 analyzeCloudData() 查看分类统计');
console.log('   2. 如果需要详细数据，运行 getAllQuestions()');
