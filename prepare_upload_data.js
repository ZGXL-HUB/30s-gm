// 准备上传数据：从本地备份提取缺失分类的数据
const fs = require('fs');
const path = require('path');

console.log('=== 准备上传数据 ===\n');

// 读取备份数据
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

// 提取缺失分类的数据
const missingData = {};
let totalQuestions = 0;

console.log('📊 提取缺失分类数据:\n');

missingCategories.forEach(category => {
  const questions = backupData[category] || [];
  missingData[category] = questions;
  totalQuestions += questions.length;
  console.log(`  ${category}: ${questions.length} 题`);
});

console.log(`\n✅ 总共提取 ${totalQuestions} 题\n`);

// 将数据保存为 JSON 文件
const outputPath = path.join(__dirname, 'missing_categories_data.json');
fs.writeFileSync(outputPath, JSON.stringify(missingData, null, 2), 'utf8');

console.log(`📁 数据已保存到: ${outputPath}`);
console.log(`📦 文件大小: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);

// 生成上传脚本
const uploadScriptContent = `// 自动生成的上传脚本
// 在小程序控制台直接运行

const missingData = ${JSON.stringify(missingData)};

(async function() {
  console.log('=== 开始上传 ${missingCategories.length} 个缺失分类 (共 ${totalQuestions} 题) ===\\n');
  
  const categories = ${JSON.stringify(missingCategories)};
  let totalUploaded = 0;
  let totalFailed = 0;
  
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const questions = missingData[category];
    
    if (!questions || questions.length === 0) {
      console.log(\`⚠️  [\${i+1}/\${categories.length}] "\${category}" 没有题目，跳过\`);
      totalFailed++;
      continue;
    }
    
    console.log(\`🚀 [\${i+1}/\${categories.length}] 上传 "\${category}" (\${questions.length} 题)...\`);
    
    try {
      const result = await wx.cloud.callFunction({
        name: 'uploadMissingCategories',
        data: {
          category: category,
          questions: questions
        }
      });
      
      if (result.result.success) {
        console.log(\`✅ \${result.result.message}\`);
        totalUploaded += result.result.uploaded || 0;
      } else {
        console.error(\`❌ "\${category}": \${result.result.message}\`);
        totalFailed++;
      }
      
    } catch (error) {
      console.error(\`❌ "\${category}" 上传失败:\`, error.message);
      totalFailed++;
    }
    
    // 等待500ms避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(\`\\n\${'='.repeat(60)}\`);
  console.log('🎉 批量上传完成！');
  console.log(\`\${'='.repeat(60)}\`);
  console.log(\`✅ 成功上传: \${totalUploaded} 题\`);
  console.log(\`❌ 失败分类: \${totalFailed} 个\`);
  console.log(\`📊 成功率: \${Math.round((categories.length - totalFailed) / categories.length * 100)}%\`);
  
  console.log(\`\\n🎯 上传完成！云数据库现在应该有完整的 66 个分类\`);
  
})();
`;

const scriptPath = path.join(__dirname, 'console_upload_with_data.js');
fs.writeFileSync(scriptPath, uploadScriptContent, 'utf8');

console.log(`📝 上传脚本已生成: ${scriptPath}`);
console.log(`📦 脚本大小: ${(fs.statSync(scriptPath).size / 1024).toFixed(2)} KB\n`);

console.log('✅ 准备完成！');
console.log('\n💡 下一步：');
console.log('1. 确保云函数 uploadMissingCategories 已部署');
console.log('2. 在小程序开发者工具控制台复制粘贴 console_upload_with_data.js 的内容');
console.log('3. 按回车执行上传\n');

