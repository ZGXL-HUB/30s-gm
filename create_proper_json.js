// 创建云数据库支持的 JSON 数组格式
const fs = require('fs');
const path = require('path');

console.log('=== 创建云数据库支持的 JSON 格式 ===\n');

// 读取缺失分类数据
const missingData = JSON.parse(
  fs.readFileSync('./missing_categories_data.json', 'utf8')
);

// 转换为 JSON 数组格式
const questionsArray = [];

Object.keys(missingData).forEach(categoryName => {
  const questions = missingData[categoryName];
  
  questions.forEach(q => {
    questionsArray.push({
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

console.log(`\n📊 总计: ${questionsArray.length} 题\n`);

// 保存为标准的 JSON 数组格式
const outputPath = path.join(__dirname, 'questions_for_import.json');
fs.writeFileSync(
  outputPath,
  JSON.stringify(questionsArray, null, 2),
  'utf8'
);

console.log(`📁 已生成云数据库导入文件:`);
console.log(`   ${outputPath}`);
console.log(`📦 文件大小: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);

// 显示文件格式示例
console.log(`📋 文件格式示例（前3个对象）:`);
console.log(`   [`);
console.log(`     {`);
console.log(`       "text": "${questionsArray[0].text}",`);
console.log(`       "answer": "${questionsArray[0].answer}",`);
console.log(`       "category": "${questionsArray[0].category}",`);
console.log(`       ...`);
console.log(`     },`);
console.log(`     {`);
console.log(`       "text": "${questionsArray[1].text}",`);
console.log(`       "answer": "${questionsArray[1].answer}",`);
console.log(`       "category": "${questionsArray[1].category}",`);
console.log(`       ...`);
console.log(`     }`);
console.log(`     ...`);
console.log(`   ]\n`);

console.log(`✅ 转换完成！\n`);
console.log(`💡 使用方法：`);
console.log(`1. 打开微信云开发控制台`);
console.log(`2. 选择 "数据库" → "questions" 集合`);
console.log(`3. 点击 "导入"`);
console.log(`4. 选择文件: questions_for_import.json`);
console.log(`5. 选择格式: JSON`);
console.log(`6. 点击 "确定" 开始导入\n`);

