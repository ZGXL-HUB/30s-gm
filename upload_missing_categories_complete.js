// 批量上传所有缺失的分类到云数据库
console.log('=== 批量上传缺失分类 ===\n');

// 从本地备份读取所有数据
const backupData = require('./backup/intermediate_questions_before_migration.js');

// 云数据库中缺失的14个重要分类
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

console.log(`📚 准备上传 ${missingCategories.length} 个缺失分类\n`);

// 统计总题目数
let totalQuestions = 0;
missingCategories.forEach(category => {
  const questions = backupData[category] || [];
  totalQuestions += questions.length;
  console.log(`  - "${category}": ${questions.length} 题`);
});

console.log(`\n📊 总计需要上传: ${totalQuestions} 题\n`);

// 上传函数
const uploadCategory = async (categoryName, questions) => {
  console.log(`\n🚀 开始上传 "${categoryName}" (${questions.length} 题)...`);
  
  let uploaded = 0;
  let failed = 0;
  
  for (const question of questions) {
    try {
      await wx.cloud.database().collection('questions').add({
        data: {
          text: question.text,
          answer: question.answer,
          analysis: question.analysis || '',
          category: categoryName,  // 使用精确的分类名
          grammarPoint: question.tag || categoryName,
          type: 'fill_blank',
          difficulty: question.difficulty || 'medium',
          createdAt: new Date().toISOString()
        }
      });
      
      uploaded++;
      
      if (uploaded % 5 === 0) {
        console.log(`   已上传 ${uploaded}/${questions.length} 题`);
      }
      
    } catch (error) {
      failed++;
      console.error(`   上传失败: ${error.message}`);
    }
  }
  
  console.log(`✅ "${categoryName}" 上传完成: 成功 ${uploaded} 题, 失败 ${failed} 题`);
  return { uploaded, failed };
};

// 批量上传所有分类
const uploadAllCategories = async () => {
  console.log('🎯 开始批量上传...\n');
  
  let totalUploaded = 0;
  let totalFailed = 0;
  
  for (const category of missingCategories) {
    const questions = backupData[category] || [];
    
    if (questions.length === 0) {
      console.log(`⚠️  "${category}" 没有题目，跳过`);
      continue;
    }
    
    const result = await uploadCategory(category, questions);
    totalUploaded += result.uploaded;
    totalFailed += result.failed;
    
    // 避免请求过快，稍作延迟
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n🎉 批量上传完成！`);
  console.log(`✅ 总成功: ${totalUploaded} 题`);
  console.log(`❌ 总失败: ${totalFailed} 题`);
  console.log(`📊 成功率: ${Math.round(totalUploaded / (totalUploaded + totalFailed) * 100)}%`);
  
  // 验证上传结果
  console.log(`\n🔍 验证上传结果...`);
  
  for (const category of missingCategories) {
    try {
      const verifyResult = await wx.cloud.database()
        .collection('questions')
        .where({ category: category })
        .count();
      
      console.log(`  - "${category}": ${verifyResult.total} 题`);
    } catch (error) {
      console.error(`  - "${category}": 验证失败 - ${error.message}`);
    }
  }
  
  console.log(`\n🎯 下一步：移除映射表，实现直接匹配！`);
};

// 在小程序环境中自动暴露函数
if (typeof window !== 'undefined') {
  window.uploadAllCategories = uploadAllCategories;
}

console.log('💡 请在控制台运行: uploadAllCategories()');
