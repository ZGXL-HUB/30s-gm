const fs = require('fs');

console.log('=== 前端左对齐修复验证 ===\n');

// 检查CSS文件是否包含左对齐设置
const cssPath = './miniprogram/pages/exercise-page/index.wxss';
const cssContent = fs.readFileSync(cssPath, 'utf8');

console.log('检查 .note-text 样式:');
const noteTextMatch = cssContent.match(/\.note-text\s*\{[^}]*\}/);
if (noteTextMatch) {
  console.log('✅ 找到 .note-text 样式');
  console.log('样式内容:', noteTextMatch[0]);
  
  if (noteTextMatch[0].includes('text-align: left')) {
    console.log('✅ 已设置 text-align: left');
  } else {
    console.log('❌ 未设置 text-align: left');
  }
} else {
  console.log('❌ 未找到 .note-text 样式');
}

console.log('\n检查 .note-title 样式:');
const noteTitleMatch = cssContent.match(/\.note-title\s*\{[^}]*\}/);
if (noteTitleMatch) {
  console.log('✅ 找到 .note-title 样式');
  console.log('样式内容:', noteTitleMatch[0]);
  
  if (noteTitleMatch[0].includes('text-align: left')) {
    console.log('✅ 已设置 text-align: left');
  } else {
    console.log('❌ 未设置 text-align: left');
  }
} else {
  console.log('❌ 未找到 .note-title 样式');
}

console.log('\n=== 修复完成 ===');
console.log('现在笔记文本应该左对齐显示了！'); 