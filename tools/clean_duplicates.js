const fs = require('fs');

// 读取文件
const filePath = 'cloudfunctions/initializeQuestions/questions.js';
let content = fs.readFileSync(filePath, 'utf8');

// 定义需要清理的重复范围
const duplicatesToRemove = [
  { start: 11147, end: 11313, name: '谓语(3)' },
  // 可以添加更多重复定义的范围
];

// 按行分割内容
let lines = content.split('\n');

// 从后往前删除重复定义（避免行号变化）
for (let i = duplicatesToRemove.length - 1; i >= 0; i--) {
  const duplicate = duplicatesToRemove[i];
  console.log(`删除重复的${duplicate.name}定义，范围：${duplicate.start}-${duplicate.end}`);
  
  // 删除指定范围的行
  lines.splice(duplicate.start - 1, duplicate.end - duplicate.start + 1);
}

// 重新组合内容
const cleanedContent = lines.join('\n');

// 写回文件
fs.writeFileSync(filePath, cleanedContent, 'utf8');

console.log('重复定义清理完成！'); 