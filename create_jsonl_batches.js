// 创建分批的 JSON Lines 格式文件
const fs = require('fs');
const path = require('path');

console.log('=== 创建分批 JSON Lines 格式文件 ===\n');

// 读取缺失分类数据
const missingData = JSON.parse(
  fs.readFileSync('./missing_categories_data.json', 'utf8')
);

// 转换为数组
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
});

console.log(`📊 总计: ${allQuestions.length} 题\n`);

// 分批处理（每批50题）
const batchSize = 50;
let batchIndex = 0;

for (let i = 0; i < allQuestions.length; i += batchSize) {
  const batch = allQuestions.slice(i, i + batchSize);
  
  // 转换为 JSON Lines 格式
  const jsonlLines = batch.map(q => JSON.stringify(q));
  
  const batchPath = path.join(__dirname, `questions_jsonl_batch_${batchIndex + 1}.json`);
  fs.writeFileSync(
    batchPath,
    jsonlLines.join('\n'),
    'utf8'
  );
  
  console.log(`📁 批次 ${batchIndex + 1}: ${batch.length} 题 → ${path.basename(batchPath)} (${(fs.statSync(batchPath).size / 1024).toFixed(2)} KB)`);
  batchIndex++;
}

console.log(`\n✅ 已创建 ${batchIndex} 个分批 JSON Lines 文件\n`);

console.log(`💡 导入方案：`);
console.log(`方案一：完整导入（推荐）`);
console.log(`  文件: questions_jsonl_format.json`);
console.log(`  格式: JSON Lines\n`);

console.log(`方案二：分批导入（备用）`);
for (let i = 1; i <= batchIndex; i++) {
  console.log(`  ${i}. questions_jsonl_batch_${i}.json`);
}

console.log(`\n🔍 重要提醒：`);
console.log(`- 文件格式：JSON Lines（每行一个 JSON 对象）`);
console.log(`- 文件扩展名：.json`);
console.log(`- 导入时选择：JSON Lines 格式`);
