// 转换为 JSON Lines 格式（每行一个 JSON 对象）
const fs = require('fs');
const path = require('path');

console.log('=== 转换为 JSON Lines 格式 ===\n');

// 读取缺失分类数据
const missingData = JSON.parse(
  fs.readFileSync('./missing_categories_data.json', 'utf8')
);

// 转换为 JSON Lines 格式
const jsonlLines = [];

Object.keys(missingData).forEach(categoryName => {
  const questions = missingData[categoryName];
  
  questions.forEach(q => {
    const questionObj = {
      text: q.text,
      answer: q.answer,
      analysis: q.analysis || '',
      category: categoryName,
      grammarPoint: q.tag || categoryName,
      type: 'fill_blank',
      difficulty: q.difficulty || 'medium',
      createdAt: new Date().toISOString()
    };
    
    // 每行一个 JSON 对象
    jsonlLines.push(JSON.stringify(questionObj));
  });
  
  console.log(`✅ "${categoryName}": ${questions.length} 题`);
});

console.log(`\n📊 总计: ${jsonlLines.length} 题\n`);

// 保存为 JSON Lines 格式
const outputPath = path.join(__dirname, 'questions_import.jsonl');
fs.writeFileSync(
  outputPath,
  jsonlLines.join('\n'),
  'utf8'
);

console.log(`📁 已生成 JSON Lines 格式文件:`);
console.log(`   ${outputPath}`);
console.log(`📦 文件大小: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);

// 显示前几行示例
console.log(`📋 文件格式示例（前3行）:`);
console.log(`   ${jsonlLines[0]}`);
console.log(`   ${jsonlLines[1]}`);
console.log(`   ${jsonlLines[2]}`);
console.log(`   ...\n`);

console.log(`✅ 转换完成！\n`);
console.log(`💡 使用方法：`);
console.log(`1. 打开微信云开发控制台`);
console.log(`2. 选择 "数据库" → "questions" 集合`);
console.log(`3. 点击 "导入"`);
console.log(`4. 选择文件: questions_import.jsonl`);
console.log(`5. 选择格式: JSON Lines`);
console.log(`6. 点击 "确定" 开始导入\n`);

