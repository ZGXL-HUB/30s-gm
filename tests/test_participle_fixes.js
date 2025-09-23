// 测试非谓语部分的笔记格式和表格显示问题修复
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 测试非谓语部分修复 ===\n');

// 1. 检查非谓语（1）的笔记内容
console.log('1. 检查非谓语（1）的笔记内容:');
const participleNote001 = questionsData['participle_note_001'];
if (participleNote001) {
  console.log('✅ 找到 participle_note_001');
  console.log('   frontendName:', participleNote001.frontendName);
  console.log('   content 长度:', participleNote001.content.length);
  console.log('   content 前100字符:', participleNote001.content.substring(0, 100));
  console.log('   content 是否包含章节结构:', participleNote001.content.includes('现在分词的分类') && participleNote001.content.includes('现在分词的写法'));
} else {
  console.log('❌ 未找到 participle_note_001');
}

// 2. 检查非谓语（2）的笔记内容
console.log('\n2. 检查非谓语（2）的笔记内容:');
const participleNote002 = questionsData['participle_note_002'];
if (participleNote002) {
  console.log('✅ 找到 participle_note_002');
  console.log('   frontendName:', participleNote002.frontendName);
  console.log('   content 长度:', participleNote002.content.length);
  console.log('   content 前100字符:', participleNote002.content.substring(0, 100));
  console.log('   content 是否包含章节结构:', participleNote002.content.includes('过去分词的分类') && participleNote002.content.includes('过去分词的写法'));
} else {
  console.log('❌ 未找到 participle_note_002');
}

// 3. 检查非谓语（3）的笔记内容
console.log('\n3. 检查非谓语（3）的笔记内容:');
const participleNote003 = questionsData['participle_note_003'];
if (participleNote003) {
  console.log('✅ 找到 participle_note_003');
  console.log('   frontendName:', participleNote003.frontendName);
  console.log('   content 长度:', participleNote003.content.length);
  console.log('   content 前100字符:', participleNote003.content.substring(0, 100));
  console.log('   content 是否包含章节结构:', participleNote003.content.includes('不定式的基本概念') && participleNote003.content.includes('不定式的用法'));
} else {
  console.log('❌ 未找到 participle_note_003');
}

// 4. 检查非谓语（1）的表格内容
console.log('\n4. 检查非谓语（1）的表格内容:');
const participleTable001 = questionsData['participle_table_001'];
if (participleTable001) {
  console.log('✅ 找到 participle_table_001');
  console.log('   frontendName:', participleTable001.frontendName);
  console.log('   tableData 存在:', !!participleTable001.tableData);
  if (participleTable001.tableData) {
    console.log('   headers:', participleTable001.tableData.headers);
    console.log('   rows 数量:', participleTable001.tableData.rows.length);
    console.log('   前3行:', participleTable001.tableData.rows.slice(0, 3));
  }
} else {
  console.log('❌ 未找到 participle_table_001');
}

// 5. 检查非谓语（2）的表格内容
console.log('\n5. 检查非谓语（2）的表格内容:');
const participleTable002 = questionsData['participle_table_002'];
if (participleTable002) {
  console.log('✅ 找到 participle_table_002');
  console.log('   frontendName:', participleTable002.frontendName);
  console.log('   tableData 存在:', !!participleTable002.tableData);
  if (participleTable002.tableData) {
    console.log('   headers:', participleTable002.tableData.headers);
    console.log('   rows 数量:', participleTable002.tableData.rows.length);
    console.log('   前3行:', participleTable002.tableData.rows.slice(0, 3));
  }
} else {
  console.log('❌ 未找到 participle_table_002');
}

// 6. 检查非谓语（3）的表格内容
console.log('\n6. 检查非谓语（3）的表格内容:');
const participleTable003 = questionsData['participle_table_003'];
if (participleTable003) {
  console.log('✅ 找到 participle_table_003');
  console.log('   frontendName:', participleTable003.frontendName);
  console.log('   tableData 存在:', !!participleTable003.tableData);
  if (participleTable003.tableData) {
    console.log('   headers:', participleTable003.tableData.headers);
    console.log('   rows 数量:', participleTable003.tableData.rows.length);
    console.log('   前3行:', participleTable003.tableData.rows.slice(0, 3));
  }
} else {
  console.log('❌ 未找到 participle_table_003');
}

// 7. 检查章节结构
console.log('\n7. 检查章节结构:');
const participleStructure1 = questionsData['非谓语(1)'];
const participleStructure2 = questionsData['非谓语(2)'];
const participleStructure3 = questionsData['非谓语(3)'];

if (participleStructure1) {
  console.log('✅ 找到 非谓语(1) 章节结构');
  console.log('   description:', participleStructure1.description);
  console.log('   relatedNotes:', participleStructure1.relatedNotes);
  console.log('   relatedTables:', participleStructure1.relatedTables);
}

if (participleStructure2) {
  console.log('✅ 找到 非谓语(2) 章节结构');
  console.log('   description:', participleStructure2.description);
  console.log('   relatedNotes:', participleStructure2.relatedNotes);
  console.log('   relatedTables:', participleStructure2.relatedTables);
}

if (participleStructure3) {
  console.log('✅ 找到 非谓语(3) 章节结构');
  console.log('   description:', participleStructure3.description);
  console.log('   relatedNotes:', participleStructure3.relatedNotes);
  console.log('   relatedTables:', participleStructure3.relatedTables);
}

// 8. 模拟 getStandardizedQuestionType 函数
console.log('\n8. 模拟 getStandardizedQuestionType 函数:');
const mockQuestion = {
  category: "非谓语",
  subCategory: "",
  tag: "过去分词综合",
  text: "The food ____ (cook) by my mother tastes delicious.",
  answer: "cooked"
};

// 模拟映射逻辑
const typeMapping = {
  '过去分词综合': 'participle-past',
  '现在分词综合': 'participle-present',
  '不定式综合': 'participle-infinitive'
};

const standardizedType = typeMapping[mockQuestion.tag] || 'participle-past';
console.log('   输入:', mockQuestion);
console.log('   输出:', standardizedType);

// 9. 模拟表格数据获取
console.log('\n9. 模拟表格数据获取:');
const tableMapping = {
  'participle-past': ['participle_table_002'],
  'participle-present': ['participle_table_001'],
  'participle-infinitive': ['participle_table_003']
};

const tableIds = tableMapping[standardizedType] || [];
const tableData = tableIds.length > 0 ? questionsData[tableIds[0]] : null;

console.log('   standardizedType:', standardizedType);
console.log('   tableIds:', tableIds);
console.log('   tableData 存在:', !!tableData);
if (tableData) {
  console.log('   tableData.id:', tableData.id);
  console.log('   tableData.frontendName:', tableData.frontendName);
  console.log('   tableData.tableData 存在:', !!tableData.tableData);
}

console.log('\n=== 测试完成 ==='); 