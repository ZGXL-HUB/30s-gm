// 检查介词相关数据的脚本
// 在微信开发者工具控制台运行

async function checkPrepositionData() {
  try {
    console.log('🔍 检查介词相关数据...');
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    
    // 1. 检查所有包含"介词"的分类
    console.log('\n📝 检查包含"介词"的分类:');
    const prepositionCategories = await questionsCollection
      .where({
        category: db.RegExp({
          regexp: '介词',
          options: 'i'
        })
      })
      .get();
    
    console.log(`找到 ${prepositionCategories.data.length} 道介词相关题目`);
    
    if (prepositionCategories.data.length > 0) {
      const categoryMap = {};
      prepositionCategories.data.forEach(question => {
        const category = question.category || '未分类';
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      });
      
      console.log('介词相关分类统计:');
      Object.entries(categoryMap).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} 题`);
      });
    }
    
    // 2. 检查所有分类名称
    console.log('\n📋 检查所有分类名称:');
    const allCategories = await questionsCollection
      .aggregate()
      .group({
        _id: '$category',
        count: db.command.aggregate.sum(1)
      })
      .sort({
        _id: 1
      })
      .end();
    
    console.log('所有分类列表:');
    allCategories.list.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item._id || '空分类'}: ${item.count} 题`);
    });
    
    // 3. 检查是否有空分类
    const emptyCategoryQuestions = await questionsCollection
      .where({
        category: ''
      })
      .get();
    
    if (emptyCategoryQuestions.data.length > 0) {
      console.log(`\n⚠️ 发现 ${emptyCategoryQuestions.data.length} 道题目没有分类`);
    }
    
    // 4. 检查是否有null分类
    const nullCategoryQuestions = await questionsCollection
      .where({
        category: null
      })
      .get();
    
    if (nullCategoryQuestions.data.length > 0) {
      console.log(`\n⚠️ 发现 ${nullCategoryQuestions.data.length} 道题目分类为null`);
    }
    
    // 5. 检查数据源中的分类
    console.log('\n📊 数据源中的分类检查:');
    console.log('根据数据源文件，应该包含以下介词相关分类:');
    console.log('  - "介词综合" (包含介词(1), 介词(2)等子分类)');
    console.log('  - "介词 + 名词/动名词" (包含介词(3)子分类)');
    console.log('  - "固定搭配" (包含介词(2)子分类)');
    
    return {
      success: true,
      prepositionQuestions: prepositionCategories.data,
      allCategories: allCategories.list,
      emptyCategoryCount: emptyCategoryQuestions.data.length,
      nullCategoryCount: nullCategoryQuestions.data.length
    };
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 重新上传介词相关数据
async function reuploadPrepositionData() {
  try {
    console.log('🔄 重新上传介词相关数据...');
    
    // 调用云函数重新上传
    const result = await wx.cloud.callFunction({
      name: 'initializeQuestions',
      data: {
        action: 'uploadAllQuestions'
      }
    });
    
    console.log('📊 重新上传结果:', result);
    
    if (result.result.success) {
      console.log('✅ 重新上传成功！');
      console.log(`📈 总共上传了 ${result.result.totalImported} 道题目`);
      
      // 重新检查介词数据
      await checkPrepositionData();
    } else {
      console.error('❌ 重新上传失败:', result.result.message);
    }
    
    return result.result;
    
  } catch (error) {
    console.error('❌ 重新上传失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行检查
console.log('🚀 介词数据检查脚本');
console.log('');
console.log('📋 可用的函数：');
console.log('1. checkPrepositionData() - 检查介词相关数据');
console.log('2. reuploadPrepositionData() - 重新上传介词相关数据');
console.log('');
console.log('💡 建议执行顺序：');
console.log('   1. 运行 checkPrepositionData() 检查当前状态');
console.log('   2. 如果发现问题，运行 reuploadPrepositionData() 重新上传');
console.log('   3. 再次运行 checkPrepositionData() 验证结果');
