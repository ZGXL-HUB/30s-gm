const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 副词(4) 简单验证 ===');

// 检查副词(4)笔记
console.log('\n1. adverb_note_004 存在:', !!questionsData['adverb_note_004']);
if (questionsData['adverb_note_004']) {
  console.log('   ID:', questionsData['adverb_note_004'].id);
  console.log('   名称:', questionsData['adverb_note_004'].frontendName);
  console.log('   子分类:', questionsData['adverb_note_004'].subCategory);
  console.log('   有内容:', !!questionsData['adverb_note_004'].content);
}

// 检查副词(4)表格
console.log('\n2. adverb_table_004 存在:', !!questionsData['adverb_table_004']);
if (questionsData['adverb_table_004']) {
  console.log('   ID:', questionsData['adverb_table_004'].id);
  console.log('   名称:', questionsData['adverb_table_004'].frontendName);
  console.log('   子分类:', questionsData['adverb_table_004'].subCategory);
  console.log('   有表格数据:', !!questionsData['adverb_table_004'].tableData);
  if (questionsData['adverb_table_004'].tableData) {
    console.log('   表格行数:', questionsData['adverb_table_004'].tableData.rows.length);
  }
}

// 检查副词(4)分类
console.log('\n3. 副词(4) 分类存在:', !!questionsData['副词(4)']);
if (questionsData['副词(4)']) {
  console.log('   描述:', questionsData['副词(4)'].description);
  console.log('   相关笔记:', questionsData['副词(4)'].relatedNotes);
  console.log('   相关表格:', questionsData['副词(4)'].relatedTables);
}

console.log('\n=== 验证完成 ==='); 