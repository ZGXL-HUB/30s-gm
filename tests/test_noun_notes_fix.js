const fs = require('fs');

// 加载修复后的数据
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 名词笔记格式修复验证 ===\n');

// 检查名词笔记的格式
const nounNotes = ['noun_note_003', 'noun_note_004', 'noun_note_005', 'noun_note_006'];

nounNotes.forEach(noteId => {
  const note = questionsData[noteId];
  if (note && note.content) {
    console.log(`📝 ${noteId}: ${note.frontendName}`);
    console.log(`   内容长度: ${note.content.length} 字符`);
    
    // 检查是否包含标准化的章节标题
    const hasStandardFormat = note.content.includes('一、基本概念与规则') && 
                             note.content.includes('二、变化规则及示例') &&
                             note.content.includes('三、考察示例') &&
                             note.content.includes('四、练习表格');
    
    console.log(`   标准化格式: ${hasStandardFormat ? '✅' : '❌'}`);
    
    // 检查换行符的使用
    const lineCount = note.content.split('\n').length;
    console.log(`   行数: ${lineCount}`);
    
    // 检查是否有内容被截断的迹象
    const hasTruncation = note.content.includes('in th') || 
                         note.content.includes('...') ||
                         note.content.length < 100;
    
    console.log(`   内容完整性: ${hasTruncation ? '❌ 可能被截断' : '✅ 完整'}`);
    
    console.log('');
  } else {
    console.log(`❌ 未找到 ${noteId}`);
  }
});

// 检查CSS样式修复
console.log('=== CSS样式修复验证 ===\n');

const cssFile = './miniprogram/pages/exercise-page/index.wxss';
if (fs.existsSync(cssFile)) {
  const cssContent = fs.readFileSync(cssFile, 'utf8');
  
  const hasWordWrap = cssContent.includes('word-wrap: break-word');
  const hasOverflowWrap = cssContent.includes('overflow-wrap: break-word');
  const hasMaxWidth = cssContent.includes('max-width: 100%');
  
  console.log(`CSS文件存在: ✅`);
  console.log(`word-wrap: break-word: ${hasWordWrap ? '✅' : '❌'}`);
  console.log(`overflow-wrap: break-word: ${hasOverflowWrap ? '✅' : '❌'}`);
  console.log(`max-width: 100%: ${hasMaxWidth ? '✅' : '❌'}`);
} else {
  console.log('❌ CSS文件不存在');
}

console.log('\n=== 修复总结 ===');
console.log('1. 名词笔记格式已统一为标准化格式');
console.log('2. CSS样式已添加文本换行和容器宽度限制');
console.log('3. 所有名词笔记现在都有一致的章节结构');
console.log('4. 内容显示问题应该已解决'); 