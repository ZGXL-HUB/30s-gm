const fs = require('fs');
const path = require('path');

// 读取intermediate_questions.js文件
const intermediatePath = path.join(__dirname, 'miniprogram/data/intermediate_questions.js');
const intermediateContent = fs.readFileSync(intermediatePath, 'utf8');

// 找到第一个名词数据的开始位置
const firstNounStart = intermediateContent.indexOf('"noun_note_001": {');
if (firstNounStart === -1) {
  console.error('未找到名词数据');
  process.exit(1);
}

// 找到第二个名词数据的开始位置（重复的部分）
const secondNounStart = intermediateContent.indexOf('"noun_note_001": {', firstNounStart + 1);
if (secondNounStart === -1) {
  console.log('没有重复的名词数据');
  process.exit(0);
}

// 找到介词数据的开始位置
const prepositionStart = intermediateContent.indexOf('"preposition_table_001": {');
if (prepositionStart === -1) {
  console.error('未找到介词数据');
  process.exit(1);
}

// 删除重复的名词数据（从第二个名词数据开始到介词数据之前）
const newContent = intermediateContent.slice(0, secondNounStart) + 
  intermediateContent.slice(prepositionStart);

// 写入文件
fs.writeFileSync(intermediatePath, newContent, 'utf8');

console.log('重复的名词数据已清理完成'); 