const fs = require('fs');
const path = require('path');

// 加载前端数据
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 前端显示效果测试 ===\n');

// 检查笔记数据
const noteKeys = Object.keys(questionsData).filter(key => key.includes('_note_'));

console.log(`找到 ${noteKeys.length} 个笔记:`);

// 检查前几个笔记的格式
noteKeys.slice(0, 3).forEach(key => {
  const note = questionsData[key];
  if (note && note.content) {
    console.log(`\n📝 ${key}: ${note.frontendName || key}`);
    console.log('内容预览:');
    
    // 显示前300字符
    const preview = note.content.substring(0, 300);
    console.log(preview);
    
    // 检查格式
    const hasTableFormat = note.content.includes('|') && note.content.includes('─');
    const hasHtmlTable = note.content.includes('<table');
    const lineCount = note.content.split('\n').length;
    
    console.log(`\n格式检查:`);
    console.log(`- 包含文本表格格式: ${hasTableFormat ? '✅' : '❌'}`);
    console.log(`- 包含HTML表格: ${hasHtmlTable ? '❌' : '✅'}`);
    console.log(`- 总行数: ${lineCount}`);
    console.log(`- 表格行数: ${note.content.split('\n').filter(line => line.includes('|')).length}`);
    
    if (hasTableFormat && !hasHtmlTable) {
      console.log('✅ 格式正确：已转换为文本表格格式');
    } else if (hasHtmlTable) {
      console.log('❌ 格式错误：仍包含HTML表格');
    } else {
      console.log('⚠️  格式未知：既不是文本表格也不是HTML表格');
    }
  }
});

console.log('\n=== 前端显示说明 ===');
console.log('1. 笔记内容通过 {{notesData[noteId].content}} 显示');
console.log('2. CSS样式 white-space: pre-line 保留换行符');
console.log('3. 文本表格格式应该正确显示分隔符和对齐');
console.log('4. 建议在小程序中测试实际显示效果'); 