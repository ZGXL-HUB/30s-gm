// 在小程序控制台运行此脚本来上传缺失的分类
// 使用方法：复制整个文件内容到小程序开发者工具的控制台，然后按回车

(async function() {
  console.log('=== 开始上传 14 个缺失分类 (共 381 题) ===\n');
  
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
  
  let totalUploaded = 0;
  let totalFailed = 0;
  const results = [];
  
  for (let i = 0; i < missingCategories.length; i++) {
    const categoryName = missingCategories[i];
    const questions = backupData[categoryName] || [];
    
    if (questions.length === 0) {
      console.log(`⚠️  [${i+1}/${missingCategories.length}] "${categoryName}" 没有题目，跳过`);
      totalFailed++;
      results.push({ category: categoryName, success: false, message: '没有题目' });
      continue;
    }
    
    console.log(`🚀 [${i+1}/${missingCategories.length}] 上传 "${categoryName}" (${questions.length} 题)...`);
    
    try {
      const result = await wx.cloud.callFunction({
        name: 'uploadMissingCategories',
        data: {
          category: categoryName,
          questions: questions
        }
      });
      
      if (result.result.success) {
        console.log(`✅ "${categoryName}": ${result.result.message}`);
        totalUploaded += result.result.uploaded || questions.length;
        results.push({ category: categoryName, success: true, uploaded: result.result.uploaded });
      } else {
        console.error(`❌ "${categoryName}": ${result.result.message}`);
        totalFailed++;
        results.push({ category: categoryName, success: false, message: result.result.message });
      }
      
    } catch (error) {
      console.error(`❌ "${categoryName}" 上传失败:`, error.message);
      totalFailed++;
      results.push({ category: categoryName, success: false, error: error.message });
    }
    
    // 避免请求过快，等待500ms
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('🎉 批量上传完成！');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ 成功上传: ${totalUploaded} 题`);
  console.log(`❌ 失败分类: ${totalFailed} 个`);
  console.log(`📊 成功率: ${Math.round((missingCategories.length - totalFailed) / missingCategories.length * 100)}%`);
  
  console.log(`\n📋 详细结果:`);
  results.forEach(({ category, success, uploaded, message, error }) => {
    if (success) {
      console.log(`  ✅ "${category}": ${uploaded} 题`);
    } else {
      console.log(`  ❌ "${category}": ${message || error}`);
    }
  });
  
  // 验证上传结果
  console.log(`\n🔍 验证上传结果...`);
  for (const categoryName of missingCategories) {
    try {
      const result = await wx.cloud.database()
        .collection('questions')
        .where({ category: categoryName })
        .count();
      
      console.log(`  - "${categoryName}": ${result.total} 题 ${result.total > 0 ? '✅' : '❌'}`);
    } catch (error) {
      console.error(`  - "${categoryName}": 验证失败 - ${error.message}`);
    }
  }
  
  console.log(`\n🎯 上传完成！云数据库现在应该有完整的 66 个分类`);
  console.log(`💡 下一步：移除映射表，实现 100% 直接匹配！`);
  
})();

