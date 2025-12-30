// 调用云函数批量上传缺失分类
console.log('=== 调用云函数批量上传缺失分类 ===\n');

// 从本地备份读取数据
const backupData = require('./backup/intermediate_questions_before_migration.js');

// 缺失的分类列表
const missingCategories = [
  "介词综合",
  "固定搭配", 
  "介词 + 名词/动名词",
  "f/fe结尾",
  "谓语(1)",
  "副词修饰句子",
  "谓语(2)",
  "谓语(3)",
  "谓语(4)",
  "谓语(5)",
  "谓语(6)",
  "谓语(7)",
  "谓语(8)",
  "谓语(9)"
];

// 调用云函数上传单个分类
const uploadCategoryViaCloudFunction = async (categoryName) => {
  const questions = backupData[categoryName] || [];
  
  if (questions.length === 0) {
    console.log(`⚠️  "${categoryName}" 没有题目，跳过`);
    return { success: false, message: '没有题目' };
  }
  
  console.log(`🚀 上传 "${categoryName}" (${questions.length} 题)...`);
  
  try {
    const result = await wx.cloud.callFunction({
      name: 'uploadMissingCategories',
      data: {
        category: categoryName,
        questions: questions
      }
    });
    
    console.log(`✅ ${result.result.message}`);
    return result.result;
    
  } catch (error) {
    console.error(`❌ 上传 "${categoryName}" 失败:`, error.message);
    return { success: false, error: error.message };
  }
};

// 批量上传所有分类
const uploadAllMissingCategories = async () => {
  console.log(`📚 开始上传 ${missingCategories.length} 个缺失分类\n`);
  
  let totalUploaded = 0;
  let totalFailed = 0;
  const results = [];
  
  for (const category of missingCategories) {
    const result = await uploadCategoryViaCloudFunction(category);
    results.push({ category, result });
    
    if (result.success) {
      totalUploaded += result.uploaded || 0;
    } else {
      totalFailed++;
    }
    
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n🎉 批量上传完成！`);
  console.log(`✅ 总成功: ${totalUploaded} 题`);
  console.log(`❌ 总失败: ${totalFailed} 个分类`);
  console.log(`📊 成功率: ${Math.round((missingCategories.length - totalFailed) / missingCategories.length * 100)}%`);
  
  console.log(`\n📋 详细结果:`);
  results.forEach(({ category, result }) => {
    if (result.success) {
      console.log(`  ✅ "${category}": ${result.uploaded} 题`);
    } else {
      console.log(`  ❌ "${category}": ${result.message || result.error}`);
    }
  });
  
  console.log(`\n🎯 下一步：移除映射表，实现直接匹配！`);
  return results;
};

// 验证上传结果
const verifyUploadResults = async () => {
  console.log(`\n🔍 验证上传结果...`);
  
  for (const category of missingCategories) {
    try {
      const result = await wx.cloud.database()
        .collection('questions')
        .where({ category: category })
        .count();
      
      console.log(`  - "${category}": ${result.total} 题`);
    } catch (error) {
      console.error(`  - "${category}": 验证失败 - ${error.message}`);
    }
  }
};

// 在小程序环境中自动暴露函数
if (typeof window !== 'undefined') {
  window.uploadAllMissingCategories = uploadAllMissingCategories;
  window.verifyUploadResults = verifyUploadResults;
}

console.log('💡 请在控制台运行:');
console.log('1. uploadAllMissingCategories() - 批量上传所有缺失分类');
console.log('2. verifyUploadResults() - 验证上传结果');
