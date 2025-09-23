// 测试副词数据加载逻辑
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 测试副词数据加载逻辑 ===');

// 模拟前端数据加载逻辑
const notesData = {};
const tablesData = {};

console.log('开始加载笔记和表格数据，questionsData keys:', Object.keys(questionsData));

// 遍历questionsData，找到笔记和表格
Object.keys(questionsData).forEach(key => {
  const item = questionsData[key];
  
  // 检查是否是笔记（有id、frontendName、content但没有tableData）
  if (item && typeof item === 'object' && item.id && item.frontendName && item.content && !item.tableData) {
    if (key.startsWith('tense_note_') || key.startsWith('voice_note_') || key.startsWith('noun_note_') || key.startsWith('pronoun_note_') || key.startsWith('preposition_note_') || key.startsWith('comparative_note_') || key.startsWith('superlative_note_') || key.startsWith('participle_note_') || key.startsWith('adverb_note_')) {
      notesData[key] = item;
      console.log('找到笔记:', key, '类型:', typeof item, '内容:', item ? item.id : 'null');
    }
  }
  // 检查是否是表格（有id、frontendName、tableData）
  else if (item && typeof item === 'object' && item.id && item.frontendName && item.tableData) {
    if (key.startsWith('tense_table_') || key.startsWith('voice_table_') || key.startsWith('noun_table_') || key.startsWith('pronoun_table_') || key.startsWith('preposition_table_') || key.startsWith('comparative_table_') || key.startsWith('superlative_table_') || key.startsWith('participle_table_') || key.startsWith('adverb_table_')) {
      tablesData[key] = item;
      console.log('找到表格:', key, '类型:', typeof item, '内容:', item ? item.id : 'null');
    }
  }
});

console.log('笔记和表格数据加载完成:', {
  notesCount: Object.keys(notesData).length,
  tablesCount: Object.keys(tablesData).length,
  notesKeys: Object.keys(notesData),
  tablesKeys: Object.keys(tablesData)
});

// 检查副词相关的笔记和表格
console.log('=== 检查副词相关数据 ===');
console.log('adverb_note_002 是否存在:', !!notesData['adverb_note_002']);
if (notesData['adverb_note_002']) {
  console.log('adverb_note_002 详细信息:', {
    id: notesData['adverb_note_002'].id,
    frontendName: notesData['adverb_note_002'].frontendName,
    category: notesData['adverb_note_002'].category,
    subCategory: notesData['adverb_note_002'].subCategory,
    hasContent: !!notesData['adverb_note_002'].content
  });
}

console.log('adverb_table_002 是否存在:', !!tablesData['adverb_table_002']);
if (tablesData['adverb_table_002']) {
  console.log('adverb_table_002 详细信息:', {
    id: tablesData['adverb_table_002'].id,
    frontendName: tablesData['adverb_table_002'].frontendName,
    category: tablesData['adverb_table_002'].category,
    subCategory: tablesData['adverb_table_002'].subCategory,
    hasTableData: !!tablesData['adverb_table_002'].tableData
  });
}

// 测试映射逻辑
const noteMapping = {
  'adverb-overview': 'adverb_note_002',
  'adverb-formation': 'adverb_note_002',
  'adverb-usage': 'adverb_note_003',
};

const tableMapping = {
  'adverb-overview': ['adverb_table_002'],
  'adverb-formation': ['adverb_table_002'],
  'adverb-usage': ['adverb_table_003'],
};

function getNoteDataByQuestionType(questionType) {
  const noteId = noteMapping[questionType];
  const result = noteId ? notesData[noteId] : null;
  
  console.log('getNoteDataByQuestionType 结果:', {
    questionType,
    noteId,
    result: result ? result.id : null
  });
  
  return result;
}

function getTableIdsByQuestionType(questionType) {
  return tableMapping[questionType] || [];
}

// 测试用例
console.log('=== 测试映射逻辑 ===');
const testQuestionType = 'adverb-formation';
const noteData = getNoteDataByQuestionType(testQuestionType);
const tableIds = getTableIdsByQuestionType(testQuestionType);

console.log('测试结果:');
console.log('期望笔记ID: adverb_note_002');
console.log('实际笔记ID:', noteData ? noteData.id : null);
console.log('笔记测试通过:', noteData && noteData.id === 'adverb_note_002');

console.log('期望表格ID: adverb_table_002');
console.log('实际表格ID:', tableIds[0]);
console.log('表格测试通过:', tableIds[0] === 'adverb_table_002'); 