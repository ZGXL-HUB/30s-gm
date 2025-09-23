// 生成多个小批次的导入文件
const fs = require('fs');
const path = require('path');

// 引入题目数据
const questions = require('./cloudfunctions/initializeQuestions/questions.js');

// 生成小批次文件
function generateSmallBatches() {
  const questionsData = questions.intermediate_questions;
  const batchSize = 100; // 每个文件100题
  let allQuestions = [];
  
  // 收集所有题目
  Object.entries(questionsData).forEach(([category, questionList]) => {
    questionList.forEach(question => {
      allQuestions.push({
        text: question.text,
        answer: question.answer,
        analysis: question.analysis || question.explanation || '',
        category: category,
        source: 'import',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  });
  
  // 分批生成文件
  const totalBatches = Math.ceil(allQuestions.length / batchSize);
  
  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, allQuestions.length);
    const batch = allQuestions.slice(start, end);
    
    // 转换为JSON Lines格式
    const lines = batch.map(doc => JSON.stringify(doc));
    const jsonLinesData = lines.join('\n');
    
    // 写入文件
    const filename = `questions_batch_${i + 1}.json`;
    fs.writeFileSync(filename, jsonLinesData, 'utf8');
    
    console.log(`✅ 生成批次 ${i + 1}/${totalBatches}: ${filename} (${batch.length} 题)`);
  }
  
  console.log(`\n📊 生成完成：`);
  console.log(`   - 总题数：${allQuestions.length}`);
  console.log(`   - 分批数：${totalBatches}`);
  console.log(`   - 每批：${batchSize} 题`);
  console.log(`\n📋 导入方法：`);
  console.log(`1. 逐个导入每个批次文件`);
  console.log(`2. 从 questions_batch_1.json 开始`);
  console.log(`3. 依次导入到 questions_batch_${totalBatches}.json`);
}

try {
  generateSmallBatches();
} catch (error) {
  console.error('❌ 生成失败：', error);
} 