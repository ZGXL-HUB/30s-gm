const fs = require('fs');
const path = require('path');

// 读取前端数据源
const frontendPath = path.join(__dirname, '../miniprogram/data/intermediate_questions.js');
let frontendContent = fs.readFileSync(frontendPath, 'utf8');

// 读取云端数据源
const cloudPath = path.join(__dirname, '../cloudfunctions/initializeQuestions/questions.js');
let cloudContent = fs.readFileSync(cloudPath, 'utf8');

// 手动转换函数
function convertMarkdownTableToText(content) {
  // 查找markdown表格格式 |...|...|
  const tableRegex = /\|([^|]+)\|([^|]+)\|\n\|[-\s|]+\|\n((?:\|[^|]+\|[^|]+\|\n?)+)/g;
  
  return content.replace(tableRegex, (match, header1, header2, rows) => {
    // 提取表头
    const col1 = header1.trim();
    const col2 = header2.trim();
    
    // 提取表格行
    const rowMatches = rows.match(/\|([^|]+)\|([^|]+)\|/g);
    const tableRows = rowMatches.map(row => {
      const cells = row.match(/\|([^|]+)\|([^|]+)\|/);
      return [cells[1].trim(), cells[2].trim()];
    });
    
    // 生成文本格式表格
    let textTable = `${col1}  |  ${col2}\n`;
    textTable += '─'.repeat(col1.length + col2.length + 6) + '\n';
    
    tableRows.forEach(row => {
      textTable += `${row[0].padEnd(col1.length)}  |  ${row[1]}\n`;
    });
    
    return textTable.trim();
  });
}

// 需要处理的笔记列表
const notesToConvert = [
  'noun_note_001',
  'noun_note_002', 
  'noun_note_003',
  'noun_note_004',
  'noun_note_005',
  'noun_note_006',
  'tense_note_001',
  'tense_note_002',
  'tense_note_003',
  'tense_note_004',
  'tense_note_005',
  'tense_note_006',
  'tense_note_007',
  'tense_note_008',
  'voice_note_001',
  'pronoun_note_001',
  'pronoun_note_002',
  'pronoun_note_003',
  'pronoun_note_004',
  'pronoun_note_005',
  'preposition_note_001',
  'preposition_note_002',
  'preposition_note_003'
];

// 处理每个笔记
notesToConvert.forEach(noteId => {
  console.log(`处理笔记: ${noteId}`);
  
  // 查找笔记内容
  const noteRegex = new RegExp(`"${noteId}":\\s*{[^}]*"content":\\s*"([^"]*(?:\\\\.[^"]*)*)"[^}]*}`, 'g');
  
  // 处理前端数据源
  frontendContent = frontendContent.replace(noteRegex, (match, content) => {
    // 解码内容
    let decodedContent = content.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    
    // 转换表格
    const convertedContent = convertMarkdownTableToText(decodedContent);
    
    // 重新编码
    const encodedContent = convertedContent.replace(/\n/g, '\\n').replace(/"/g, '\\"');
    
    // 返回新的笔记内容
    return match.replace(content, encodedContent);
  });
  
  // 处理云端数据源
  cloudContent = cloudContent.replace(noteRegex, (match, content) => {
    // 解码内容
    let decodedContent = content.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    
    // 转换表格
    const convertedContent = convertMarkdownTableToText(decodedContent);
    
    // 重新编码
    const encodedContent = convertedContent.replace(/\n/g, '\\n').replace(/"/g, '\\"');
    
    // 返回新的笔记内容
    return match.replace(content, encodedContent);
  });
});

// 写入文件
fs.writeFileSync(frontendPath, frontendContent, 'utf8');
fs.writeFileSync(cloudPath, cloudContent, 'utf8');

console.log('✅ 手动转换完成！');
console.log('📁 前端数据源已更新:', frontendPath);
console.log('📁 云端数据源已更新:', cloudPath);
console.log('�� 请重新启动小程序以查看效果'); 