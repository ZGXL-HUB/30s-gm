// Node.js 脚本：批量上传缺失分类到云数据库
// 运行方式：node node_upload_missing_categories.js

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: 'your-env-id' // 请替换为您的云环境 ID
});

const db = cloud.database();
const _ = db.command;

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

// 上传单个分类
async function uploadCategory(categoryName) {
  const questions = backupData[categoryName] || [];
  
  if (questions.length === 0) {
    console.log(`⚠️  "${categoryName}" 没有题目，跳过`);
    return { success: false, message: '没有题目' };
  }
  
  console.log(`🚀 上传 "${categoryName}" (${questions.length} 题)...`);
  
  try {
    // 为每道题添加云数据库所需的字段
    const questionsToUpload = questions.map(q => ({
      ...q,
      category: categoryName,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // 分批上传（每次最多20条）
    const batchSize = 20;
    let uploaded = 0;
    
    for (let i = 0; i < questionsToUpload.length; i += batchSize) {
      const batch = questionsToUpload.slice(i, i + batchSize);
      
      // 批量添加
      const promises = batch.map(question => 
        db.collection('questions').add({
          data: question
        })
      );
      
      await Promise.all(promises);
      uploaded += batch.length;
      
      console.log(`  进度: ${uploaded}/${questionsToUpload.length} 题`);
    }
    
    console.log(`✅ "${categoryName}": 成功上传 ${uploaded} 题`);
    return { success: true, uploaded };
    
  } catch (error) {
    console.error(`❌ "${categoryName}" 上传失败:`, error.message);
    return { success: false, error: error.message };
  }
}

// 批量上传所有分类
async function uploadAllCategories() {
  console.log('=== 开始批量上传缺失分类 ===\n');
  console.log(`📚 共需上传 ${missingCategories.length} 个分类\n`);
  
  let totalUploaded = 0;
  let totalFailed = 0;
  const results = [];
  
  for (let i = 0; i < missingCategories.length; i++) {
    const category = missingCategories[i];
    console.log(`\n[${i + 1}/${missingCategories.length}] 处理分类: ${category}`);
    
    const result = await uploadCategory(category);
    results.push({ category, result });
    
    if (result.success) {
      totalUploaded += result.uploaded || 0;
    } else {
      totalFailed++;
    }
    
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 批量上传完成！');
  console.log('='.repeat(60));
  console.log(`✅ 成功上传: ${totalUploaded} 题`);
  console.log(`❌ 失败分类: ${totalFailed} 个`);
  console.log(`📊 成功率: ${Math.round((missingCategories.length - totalFailed) / missingCategories.length * 100)}%`);
  
  console.log('\n📋 详细结果:');
  results.forEach(({ category, result }) => {
    if (result.success) {
      console.log(`  ✅ "${category}": ${result.uploaded} 题`);
    } else {
      console.log(`  ❌ "${category}": ${result.message || result.error}`);
    }
  });
  
  // 验证上传结果
  console.log('\n🔍 验证上传结果...');
  for (const category of missingCategories) {
    try {
      const count = await db.collection('questions')
        .where({ category })
        .count();
      
      console.log(`  - "${category}": ${count.total} 题 ${count.total > 0 ? '✅' : '❌'}`);
    } catch (error) {
      console.error(`  - "${category}": 验证失败`);
    }
  }
  
  console.log('\n🎯 上传完成！');
  console.log('💡 下一步：移除映射表，实现100%直接匹配');
}

// 执行上传
uploadAllCategories()
  .then(() => {
    console.log('\n✅ 脚本执行完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ 脚本执行失败:', error);
    process.exit(1);
  });

