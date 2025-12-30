// 创建 JSON Lines 格式但使用 .json 扩展名
const fs = require('fs');
const path = require('path');

console.log('=== 创建 JSON Lines 格式（.json 扩展名） ===\n');

// 读取缺失分类数据
const missingData = JSON.parse(
  fs.readFileSync('./missing_categories_data.json', 'utf8')
);

// 转换为 JSON Lines 格式（每行一个 JSON 对象）
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
    
    // 每行一个 JSON 对象（JSON Lines 格式）
    jsonlLines.push(JSON.stringify(questionObj));
  });
  
  console.log(`✅ "${categoryName}": ${questions.length} 题`);
});

console.log(`\n📊 总计: ${jsonlLines.length} 题\n`);

// 保存为 JSON Lines 格式，但使用 .json 扩展名
const outputPath = path.join(__dirname, 'questions_jsonl_format.json');
fs.writeFileSync(
  outputPath,
  jsonlLines.join('\n'), // JSON Lines: 每行一个 JSON 对象
  'utf8'
);

console.log(`📁 已生成 JSON Lines 格式文件（.json 扩展名）:`);
console.log(`   ${outputPath}`);
console.log(`📦 文件大小: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);

// 显示文件格式示例
console.log(`📋 文件格式示例（前3行）:`);
console.log(`   第1行: ${jsonlLines[0].substring(0, 80)}...`);
console.log(`   第2行: ${jsonlLines[1].substring(0, 80)}...`);
console.log(`   第3行: ${jsonlLines[2].substring(0, 80)}...`);
console.log(`   ...\n`);

console.log(`✅ 转换完成！\n`);
console.log(`💡 使用方法：`);
console.log(`1. 打开微信云开发控制台`);
console.log(`2. 选择 "数据库" → "questions" 集合`);
console.log(`3. 点击 "导入"`);
console.log(`4. 选择文件: questions_jsonl_format.json`);
console.log(`5. 选择格式: JSON Lines`);
console.log(`6. 点击 "确定" 开始导入\n`);

console.log(`🔍 关键点：`);
console.log(`- 文件内容：JSON Lines 格式（每行一个 JSON 对象）`);
console.log(`- 文件扩展名：.json（满足云数据库要求）`);
console.log(`- 导入格式：选择 "JSON Lines"`);

