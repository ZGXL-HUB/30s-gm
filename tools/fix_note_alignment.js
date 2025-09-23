const fs = require('fs');

// 加载前端数据
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 彻底修复笔记对齐问题 ===\n');

// 彻底修复笔记内容对齐的函数
function fixNoteAlignment(content) {
  if (!content) return content;
  
  // 按行处理
  const lines = content.split('\n');
  const fixedLines = lines.map(line => {
    // 完全移除行首的所有空格
    let trimmedLine = line.trimStart();
    
    // 如果原行有缩进，根据内容类型添加适当的缩进
    if (line.startsWith('  ') || line.startsWith('    ')) {
      // 检查是否是规则行（包含"规则："）
      if (trimmedLine.includes('规则：')) {
        trimmedLine = '  ' + trimmedLine; // 规则行保留2个空格缩进
      }
      // 检查是否是示例行（包含"→"或"、"）
      else if (trimmedLine.includes('→') || trimmedLine.includes('、')) {
        trimmedLine = '  ' + trimmedLine; // 示例行保留2个空格缩进
      }
      // 其他行不添加缩进
    }
    
    return trimmedLine;
  });
  
  return fixedLines.join('\n');
}

// 处理所有笔记
let modifiedCount = 0;
const noteKeys = Object.keys(questionsData).filter(key => key.includes('_note_'));

noteKeys.forEach(key => {
  const note = questionsData[key];
  if (note && note.content) {
    const originalContent = note.content;
    const fixedContent = fixNoteAlignment(originalContent);
    
    // 检查是否有变化
    if (originalContent !== fixedContent) {
      console.log(`🔧 修复 ${key}: ${note.frontendName || key}`);
      
      // 更新内容
      note.content = fixedContent;
      modifiedCount++;
    }
  }
});

if (modifiedCount > 0) {
  // 保存修改后的数据
  const outputPath = './miniprogram/data/intermediate_questions_aligned.js';
  const outputContent = `module.exports = ${JSON.stringify(questionsData, null, 2)};`;
  
  fs.writeFileSync(outputPath, outputContent, 'utf8');
  console.log(`\n✅ 成功修复 ${modifiedCount} 个笔记的对齐问题`);
  console.log(`📁 已保存到: ${outputPath}`);
  
  // 直接替换原文件
  fs.copyFileSync(outputPath, './miniprogram/data/intermediate_questions.js');
  console.log('✅ 已更新 intermediate_questions.js 文件');
} else {
  console.log('✅ 所有笔记对齐正常，无需修复');
}

console.log('\n=== 修复完成 ==='); 