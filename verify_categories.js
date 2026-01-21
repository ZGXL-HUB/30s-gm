// 验证需要映射的category是否在数据库中存在
// 在微信开发者工具控制台运行

async function verifyCategories() {
  try {
    console.log('🔍 验证category是否存在...\n');
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    
    // 需要验证的category列表（从未分类题目中提取）
    const categoriesToVerify = [
      // 谓语相关
      '谓语(1)', '谓语(2)', '谓语(3)', '谓语(4)', '谓语(5)', '谓语(6)',
      // 介词相关
      '介词综合', '介词 + 名词/动名词', '固定搭配',
      // 副词相关
      '副词综合', '副词修饰句子',
      // 名词相关
      '名词综合', 'f/fe结尾', '以f/fe结尾',
      // 其他
      '固定搭配'
    ];
    
    console.log('📋 检查以下category是否存在:\n');
    
    const results = {};
    
    for (const category of categoriesToVerify) {
      try {
        const result = await questionsCollection
          .where({
            category: category
          })
          .count();
        
        results[category] = {
          exists: result.total > 0,
          count: result.total
        };
        
        const status = result.total > 0 ? '✅' : '❌';
        console.log(`   ${status} "${category}": ${result.total} 题`);
      } catch (error) {
        results[category] = {
          exists: false,
          error: error.message
        };
        console.log(`   ❌ "${category}": 查询失败 - ${error.message}`);
      }
    }
    
    // 查找所有包含"f"或"fe"的category
    console.log('\n🔍 查找所有包含"f"或"fe"的category:');
    const allCategoriesResult = await questionsCollection
      .field({ category: true })
      .limit(1000)
      .get();
    
    const uniqueCategories = [...new Set(allCategoriesResult.data.map(q => q.category).filter(Boolean))];
    const fCategories = uniqueCategories.filter(cat => 
      cat && (cat.includes('f') || cat.includes('F') || cat.includes('fe') || cat.includes('Fe'))
    );
    
    if (fCategories.length > 0) {
      console.log('   找到以下相关category:');
      for (const cat of fCategories) {
        const count = await questionsCollection.where({ category: cat }).count();
        console.log(`   - "${cat}": ${count.total} 题`);
      }
    } else {
      console.log('   ⚠️ 未找到包含"f"或"fe"的category');
    }
    
    // 查找所有包含"副词"的category
    console.log('\n🔍 查找所有包含"副词"的category:');
    const adverbCategories = uniqueCategories.filter(cat => 
      cat && cat.includes('副词')
    );
    
    if (adverbCategories.length > 0) {
      console.log('   找到以下相关category:');
      for (const cat of adverbCategories) {
        const count = await questionsCollection.where({ category: cat }).count();
        console.log(`   - "${cat}": ${count.total} 题`);
      }
    } else {
      console.log('   ⚠️ 未找到包含"副词"的category');
    }
    
    // 查找所有包含"介词"的category
    console.log('\n🔍 查找所有包含"介词"的category:');
    const prepositionCategories = uniqueCategories.filter(cat => 
      cat && cat.includes('介词')
    );
    
    if (prepositionCategories.length > 0) {
      console.log('   找到以下相关category:');
      for (const cat of prepositionCategories) {
        const count = await questionsCollection.where({ category: cat }).count();
        console.log(`   - "${cat}": ${count.total} 题`);
      }
    } else {
      console.log('   ⚠️ 未找到包含"介词"的category');
    }
    
    console.log('\n💡 建议:');
    console.log('   根据验证结果，更新 batch_fix_uncategorized_questions.js 中的映射规则');
    
    return {
      success: true,
      results: results
    };
    
  } catch (error) {
    console.error('❌ 验证失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行验证
console.log('🚀 Category验证工具\n');
verifyCategories();
