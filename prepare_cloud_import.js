// 准备云数据库导入文件
const fs = require('fs');
const path = require('path');

console.log('=== 准备云数据库导入文件 ===\n');

// 读取缺失分类数据
const missingData = JSON.parse(
  fs.readFileSync('./missing_categories_data.json', 'utf8')
);

// 将所有题目转换为云数据库格式
const allQuestions = [];

Object.keys(missingData).forEach(categoryName => {
  const questions = missingData[categoryName];
  
  questions.forEach(q => {
    allQuestions.push({
      text: q.text,
      answer: q.answer,
      analysis: q.analysis || '',
      category: categoryName,
      grammarPoint: q.tag || categoryName,
      type: 'fill_blank',
      difficulty: q.difficulty || 'medium',
      createdAt: new Date().toISOString()
    });
  });
  
  console.log(`✅ "${categoryName}": ${questions.length} 题`);
});

console.log(`\n📊 总计: ${allQuestions.length} 题\n`);

// 保存为云数据库导入格式
const outputPath = path.join(__dirname, 'cloud_import_questions.json');
fs.writeFileSync(
  outputPath,
  JSON.stringify(allQuestions, null, 2),
  'utf8'
);

console.log(`📁 已生成云数据库导入文件:`);
console.log(`   ${outputPath}`);
console.log(`📦 文件大小: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);

console.log(`✅ 准备完成！\n`);
console.log(`💡 使用方法：`);
console.log(`1. 打开微信云开发控制台`);
console.log(`2. 选择 "数据库" → "questions" 集合`);
console.log(`3. 点击 "导入"`);
console.log(`4. 选择文件: cloud_import_questions.json`);
console.log(`5. 点击 "确定" 开始导入\n`);

