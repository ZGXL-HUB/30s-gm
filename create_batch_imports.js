// 创建分批导入文件（每批50题）
const fs = require('fs');
const path = require('path');

console.log('=== 创建分批导入文件 ===\n');

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
  
  console.log(`✅ "${categoryName}": ${questions.length} 题`);
});

console.log(`\n📊 总计: ${allQuestions.length} 题\n`);

// 分批处理（每批50题）
const batchSize = 50;
const batches = [];
let batchIndex = 0;

for (let i = 0; i < allQuestions.length; i += batchSize) {
  const batch = allQuestions.slice(i, i + batchSize);
  batches.push(batch);
  
  const batchPath = path.join(__dirname, `questions_batch_${batchIndex + 1}.json`);
  fs.writeFileSync(
    batchPath,
    JSON.stringify(batch, null, 2),
    'utf8'
  );
  
  console.log(`📁 批次 ${batchIndex + 1}: ${batch.length} 题 → ${path.basename(batchPath)} (${(fs.statSync(batchPath).size / 1024).toFixed(2)} KB)`);
  batchIndex++;
}

console.log(`\n✅ 已创建 ${batches.length} 个分批导入文件\n`);

console.log(`💡 分批导入方案：`);
console.log(`方案一：先尝试完整导入`);
console.log(`  1. 导入文件: questions_for_import.json (314KB)`);
console.log(`  2. 如果失败，使用分批导入\n`);

console.log(`方案二：分批导入（推荐）`);
batches.forEach((batch, index) => {
  console.log(`  ${index + 1}. 导入: questions_batch_${index + 1}.json (${batch.length} 题)`);
});

console.log(`\n📋 导入顺序建议：`);
console.log(`1. 先尝试完整导入 questions_for_import.json`);
console.log(`2. 如果失败，按顺序导入 batches 1-${batches.length}`);
console.log(`3. 每批次导入后等待完成再导入下一批`);

