// 简化的测试文件
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 简单测试副词数据 ===');

// 直接检查副词笔记是否存在
console.log('检查 adverb_note_002:');
if (questionsData['adverb_note_002']) {
  console.log('✅ 找到 adverb_note_002');
  console.log('ID:', questionsData['adverb_note_002'].id);
  console.log('名称:', questionsData['adverb_note_002'].frontendName);
  console.log('有内容:', !!questionsData['adverb_note_002'].content);
  console.log('内容长度:', questionsData['adverb_note_002'].content ? questionsData['adverb_note_002'].content.length : 0);
} else {
  console.log('❌ 未找到 adverb_note_002');
}

console.log('\n检查 adverb_note_003:');
if (questionsData['adverb_note_003']) {
  console.log('✅ 找到 adverb_note_003');
  console.log('ID:', questionsData['adverb_note_003'].id);
  console.log('名称:', questionsData['adverb_note_003'].frontendName);
  console.log('有内容:', !!questionsData['adverb_note_003'].content);
  console.log('内容长度:', questionsData['adverb_note_003'].content ? questionsData['adverb_note_003'].content.length : 0);
} else {
  console.log('❌ 未找到 adverb_note_003');
}

console.log('\n检查 adverb_table_002:');
if (questionsData['adverb_table_002']) {
  console.log('✅ 找到 adverb_table_002');
  console.log('ID:', questionsData['adverb_table_002'].id);
  console.log('名称:', questionsData['adverb_table_002'].frontendName);
  console.log('有表格数据:', !!questionsData['adverb_table_002'].tableData);
} else {
  console.log('❌ 未找到 adverb_table_002');
}

console.log('\n检查 adverb_table_003:');
if (questionsData['adverb_table_003']) {
  console.log('✅ 找到 adverb_table_003');
  console.log('ID:', questionsData['adverb_table_003'].id);
  console.log('名称:', questionsData['adverb_table_003'].frontendName);
  console.log('有表格数据:', !!questionsData['adverb_table_003'].tableData);
} else {
  console.log('❌ 未找到 adverb_table_003');
}

// 检查所有以adverb开头的键
console.log('\n=== 所有adverb相关的键 ===');
const adverbKeys = Object.keys(questionsData).filter(key => key.startsWith('adverb'));
console.log('adverb相关键:', adverbKeys);

console.log('\n=== 测试完成 ==='); 