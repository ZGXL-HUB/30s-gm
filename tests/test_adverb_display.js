const questionsData = require('./miniprogram/data/intermediate_questions.js');

// 模拟前端的数据加载逻辑
function loadNotesAndTablesData() {
  const notesData = {};
  const tablesData = {};
  
  console.log('开始加载笔记和表格数据，questionsData keys:', Object.keys(questionsData));
  
  // 遍历questionsData，找到笔记和表格
  Object.keys(questionsData).forEach(key => {
    if (key.startsWith('tense_note_') || key.startsWith('voice_note_') || key.startsWith('noun_note_') || key.startsWith('pronoun_note_') || key.startsWith('preposition_note_') || key.startsWith('comparative_note_') || key.startsWith('superlative_note_') || key.startsWith('participle_note_') || key.startsWith('adverb_note_')) {
      notesData[key] = questionsData[key];
      console.log('找到笔记:', key, '类型:', typeof questionsData[key], '内容:', questionsData[key] ? (typeof questionsData[key] === 'object' ? questionsData[key].id : questionsData[key]) : 'null');
    } else if (key.startsWith('tense_table_') || key.startsWith('voice_table_') || key.startsWith('noun_table_') || key.startsWith('pronoun_table_') || key.startsWith('preposition_table_') || key.startsWith('comparative_table_') || key.startsWith('superlative_table_') || key.startsWith('participle_table_') || key.startsWith('adverb_table_')) {
      tablesData[key] = questionsData[key];
      console.log('找到表格:', key, '类型:', typeof questionsData[key], '内容:', questionsData[key] ? (typeof questionsData[key] === 'object' ? questionsData[key].id : questionsData[key]) : 'null');
    }
  });
  
  return { notesData, tablesData };
}

// 模拟前端的getNoteDataByQuestionType函数
function getNoteDataByQuestionType(questionType, notesData) {
  // 根据题目类型映射到对应的笔记ID
  const noteMapping = {
    // 副词相关映射
    'adverb-overview': 'adverb_note_002', // 副词(1) - 副词笔记(概述) - 使用adverb_note_002作为概述
    'adverb-formation': 'adverb_note_002', // 副词(2) - 副词笔记(修饰动词)
    'adverb-usage': 'adverb_note_003', // 副词(3) - 副词笔记(修饰形容词/副词)
  };
  
  const noteId = noteMapping[questionType];
  let result = noteId ? notesData[noteId] : null;
  
  console.log('getNoteDataByQuestionType 结果:', {
    questionType,
    noteId,
    result: result ? (typeof result === 'object' ? result.id : result) : null
  });
  
  return result;
}

// 测试副词笔记显示
console.log('=== 测试副词笔记显示功能 ===');

// 1. 加载数据
const { notesData, tablesData } = loadNotesAndTablesData();

console.log('笔记和表格数据加载完成:', {
  notesCount: Object.keys(notesData).length,
  tablesCount: Object.keys(tablesData).length,
  notesKeys: Object.keys(notesData),
  tablesKeys: Object.keys(tablesData)
});

// 2. 测试副词笔记获取
const testQuestionTypes = ['adverb-overview', 'adverb-formation', 'adverb-usage'];

testQuestionTypes.forEach(questionType => {
  console.log(`\n--- 测试 ${questionType} ---`);
  
  const noteData = getNoteDataByQuestionType(questionType, notesData);
  
  if (noteData) {
    console.log('笔记数据获取成功:', {
      id: noteData.id,
      frontendName: noteData.frontendName,
      category: noteData.category,
      subCategory: noteData.subCategory,
      hasContent: !!noteData.content,
      contentLength: noteData.content ? noteData.content.length : 0,
      contentPreview: noteData.content ? noteData.content.substring(0, 100) + '...' : '无内容'
    });
    
    // 检查内容是否完整
    if (noteData.content) {
      console.log('✅ 笔记内容完整，可以正常显示');
    } else {
      console.log('❌ 笔记内容为空，无法显示');
    }
  } else {
    console.log('❌ 未找到对应的笔记数据');
  }
});

// 3. 检查副词表格数据
console.log('\n=== 检查副词表格数据 ===');
const adverbTables = ['adverb_table_002', 'adverb_table_003'];

adverbTables.forEach(tableId => {
  const tableData = tablesData[tableId];
  if (tableData) {
    console.log(`${tableId} 表格数据:`, {
      id: tableData.id,
      frontendName: tableData.frontendName,
      category: tableData.category,
      subCategory: tableData.subCategory,
      hasTableData: !!tableData.tableData,
      hasContent: !!tableData.content
    });
  } else {
    console.log(`❌ 未找到 ${tableId} 表格数据`);
  }
});

console.log('\n=== 测试完成 ==='); 