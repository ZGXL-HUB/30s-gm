const fs = require('fs');

// 读取questions.js文件
const filePath = './cloudfunctions/initializeQuestions/questions.js';
let content = fs.readFileSync(filePath, 'utf8');

// 提取questions对象
const questionsMatch = content.match(/const questions = ({[\s\S]*?});/);
if (!questionsMatch) {
  console.error('无法找到questions对象');
  process.exit(1);
}

// 解析questions对象
let questionsStr = questionsMatch[1];
let questions;
try {
  // 使用Function构造器来安全地解析对象
  questions = Function('return ' + questionsStr)();
} catch (error) {
  console.error('解析questions对象失败:', error.message);
  process.exit(1);
}

// 定义分类映射
const categoryMappings = {
  "状语从句综合": "状语和从句(1)",
  "when": "状语和从句(2)",
  "where": "状语和从句(3)",
  "how": "状语和从句(4)",
  "why": "状语和从句(5)"
};

// 为每个分类添加category字段
let addedCount = 0;
for (const [categoryName, categoryValue] of Object.entries(categoryMappings)) {
  if (questions[categoryName]) {
    questions[categoryName].forEach(question => {
      if (!question.category) {
        question.category = categoryValue;
        addedCount++;
      }
    });
    console.log(`已为"${categoryName}"添加category: "${categoryValue}"`);
  } else {
    console.log(`警告: 未找到分类"${categoryName}"`);
  }
}

// 重新生成questions对象字符串
const questionsStrNew = JSON.stringify(questions, null, 2);

// 替换原文件中的questions对象
const newContent = content.replace(
  /const questions = {[\s\S]*?};/,
  `const questions = ${questionsStrNew};`
);

// 写回文件
fs.writeFileSync(filePath, newContent, 'utf8');

console.log(`\n完成！共为 ${addedCount} 个题目添加了category字段`);
console.log('文件已更新:', filePath); 