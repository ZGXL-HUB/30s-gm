// 生成可导入云数据库的JSON Lines文件
const fs = require('fs');
const path = require('path');

// 引入题目数据
const questions = require('./cloudfunctions/initializeQuestions/questions.js');

// 转换数据格式为JSON Lines
function convertToJSONLines() {
  const questionsData = questions.intermediate_questions;
  const lines = [];
  
  // 遍历每个分类，将每道题目作为单独的文档
  Object.entries(questionsData).forEach(([category, questionList]) => {
    questionList.forEach(question => {
      const doc = {
        text: question.text,
        answer: question.answer,
        analysis: question.analysis || question.explanation || '',
        category: category,
        source: 'import',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 每行一个JSON对象
      lines.push(JSON.stringify(doc));
    });
  });
  
  return lines;
}

// 生成JSON Lines文件
try {
  const lines = convertToJSONLines();
  const jsonLinesData = lines.join('\n');
  
  // 写入文件
  fs.writeFileSync('questions_import.json', jsonLinesData, 'utf8');
  
  console.log('✅ 生成成功！');
  console.log(`📄 文件：questions_import.json`);
  console.log(`📊 数据统计：`);
  console.log(`   - 总题数：${lines.length}`);
  console.log(`   - 格式：JSON Lines（每行一个JSON对象）`);
  console.log(`\n📋 使用方法：`);
  console.log(`1. 在云数据库中，删除现有的questions集合中的数据`);
  console.log(`2. 点击"导入"按钮，选择questions_import.json文件`);
  console.log(`3. 完成导入！`);
  
  // 显示前3行作为示例
  console.log(`\n📝 文件示例（前3行）：`);
  lines.slice(0, 3).forEach((line, index) => {
    console.log(`${index + 1}. ${line.substring(0, 100)}...`);
  });
  
} catch (error) {
  console.error('❌ 生成失败：', error);
} 