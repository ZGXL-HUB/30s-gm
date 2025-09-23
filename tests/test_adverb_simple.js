// 简单测试副词数据加载逻辑
console.log('=== 测试副词数据加载逻辑 ===');

// 直接检查数据文件中的副词相关数据
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('数据文件中的所有键:', Object.keys(questionsData));

// 检查副词相关的数据是否存在
console.log('=== 检查副词相关数据 ===');
console.log('adverb_note_002 是否存在:', !!questionsData['adverb_note_002']);
if (questionsData['adverb_note_002']) {
  console.log('adverb_note_002 详细信息:', {
    id: questionsData['adverb_note_002'].id,
    frontendName: questionsData['adverb_note_002'].frontendName,
    category: questionsData['adverb_note_002'].category,
    subCategory: questionsData['adverb_note_002'].subCategory,
    hasContent: !!questionsData['adverb_note_002'].content
  });
}

console.log('adverb_table_002 是否存在:', !!questionsData['adverb_table_002']);
if (questionsData['adverb_table_002']) {
  console.log('adverb_table_002 详细信息:', {
    id: questionsData['adverb_table_002'].id,
    frontendName: questionsData['adverb_table_002'].frontendName,
    category: questionsData['adverb_table_002'].category,
    subCategory: questionsData['adverb_table_002'].subCategory,
    hasTableData: !!questionsData['adverb_table_002'].tableData
  });
}

// 模拟前端数据加载逻辑
const notesData = {};
const tablesData = {};

// 遍历questionsData，找到笔记和表格
Object.keys(questionsData).forEach(key => {
  const item = questionsData[key];
  
  // 检查是否是笔记（有id、frontendName、content但没有tableData）
  if (item && typeof item === 'object' && item.id && item.frontendName && item.content && !item.tableData) {
    if (key.startsWith('adverb_note_')) {
      notesData[key] = item;
      console.log('找到副词笔记:', key);
    }
  }
  // 检查是否是表格（有id、frontendName、tableData）
  else if (item && typeof item === 'object' && item.id && item.frontendName && item.tableData) {
    if (key.startsWith('adverb_table_')) {
      tablesData[key] = item;
      console.log('找到副词表格:', key);
    }
  }
});

console.log('=== 数据加载结果 ===');
console.log('副词笔记数量:', Object.keys(notesData).length);
console.log('副词表格数量:', Object.keys(tablesData).length);
console.log('副词笔记键:', Object.keys(notesData));
console.log('副词表格键:', Object.keys(tablesData));

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