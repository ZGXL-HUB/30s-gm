const fs = require('fs');

// 读取文件
let content = fs.readFileSync('comprehensive_writing_test.json', 'utf8');

// 恢复所有被错误转义的英文双引号
content = content.replace(/\\"/g, '"');

// 写回文件
fs.writeFileSync('comprehensive_writing_test.json', content, 'utf8');

console.log('JSON格式修正完成');

