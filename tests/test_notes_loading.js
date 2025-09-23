const fs = require('fs');
const path = require('path');

// 加载前端数据
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 笔记数据加载测试 ===');

// 检查笔记数据是否存在
const noteKeys = Object.keys(questionsData).filter(key => 
  key.startsWith('noun_note_') || 
  key.startsWith('tense_note_') || 
  key.startsWith('voice_note_') || 
  key.startsWith('pronoun_note_') || 
  key.startsWith('preposition_note_')
);

console.log(`找到 ${noteKeys.length} 个笔记:`);
noteKeys.forEach(key => {
  const note = questionsData[key];
  if (note && typeof note === 'object' && note.content) {
    console.log(`✅ ${key}: ${note.frontendName || key}`);
    
    // 检查是否包含表格格式
    const hasTable = note.content.includes('|') && note.content.includes('─');
    const hasHtmlTable = note.content.includes('<table');
    
    if (hasTable && !hasHtmlTable) {
      console.log(`   ✅ 已转换为文本表格格式`);
    } else if (hasHtmlTable) {
      console.log(`   ❌ 仍包含HTML表格格式`);
    } else {
      console.log(`   ℹ️  无表格内容`);
    }
  } else {
    console.log(`❌ ${key}: 数据格式错误`);
  }
});

// 特别检查几个关键笔记
const keyNotes = ['noun_note_001', 'noun_note_003', 'tense_note_001'];
console.log('\n=== 关键笔记详细检查 ===');

keyNotes.forEach(noteId => {
  const note = questionsData[noteId];
  if (note && typeof note === 'object' && note.content) {
    console.log(`\n📝 ${noteId}: ${note.frontendName}`);
    console.log(`内容长度: ${note.content.length} 字符`);
    
    // 检查表格格式
    const lines = note.content.split('\n');
    const tableLines = lines.filter(line => line.includes('|'));
    
    if (tableLines.length > 0) {
      console.log(`找到 ${tableLines.length} 行表格内容:`);
      tableLines.slice(0, 3).forEach((line, index) => {
        console.log(`  ${index + 1}. ${line.substring(0, 80)}${line.length > 80 ? '...' : ''}`);
      });
    }
    
    // 检查是否包含HTML
    if (note.content.includes('<table')) {
      console.log(`❌ 警告: 仍包含HTML表格标签`);
    } else {
      console.log(`✅ 无HTML表格标签`);
    }
  } else {
    console.log(`❌ ${noteId}: 未找到或格式错误`);
  }
});

console.log('\n=== 测试完成 ==='); 