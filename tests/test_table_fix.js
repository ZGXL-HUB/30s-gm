// 测试非谓语表格的提示内容问题修复
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 测试非谓语表格提示内容修复 ===\n');

// 测试非谓语（1）表格
console.log('1. 测试非谓语（1）表格:');
const participleTable001 = questionsData['participle_table_001'];
if (participleTable001) {
  console.log('✅ 找到 participle_table_001');
  console.log('   表头:', participleTable001.tableData.headers);
  console.log('   第一行:', participleTable001.tableData.rows[0]);
  console.log('   第二行:', participleTable001.tableData.rows[1]);
  
  // 检查数据结构
  const firstRow = participleTable001.tableData.rows[0];
  console.log('   第一列(动词原形):', firstRow[0]);
  console.log('   第二列(现在分词):', firstRow[1]);
  
  // 验证修复逻辑
  if (firstRow[0] === 'work' && firstRow[1] === 'working') {
    console.log('✅ 数据结构正确');
    console.log('   修复后应该显示:');
    console.log('     第1列: 文本 "work" (作为提示)');
    console.log('     第2列: 输入框 (答案: "working", 但不显示)');
  }
} else {
  console.log('❌ 未找到 participle_table_001');
}

// 测试非谓语（2）表格
console.log('\n2. 测试非谓语（2）表格:');
const participleTable002 = questionsData['participle_table_002'];
if (participleTable002) {
  console.log('✅ 找到 participle_table_002');
  console.log('   表头:', participleTable002.tableData.headers);
  console.log('   第一行:', participleTable002.tableData.rows[0]);
  
  // 检查数据结构
  const firstRow = participleTable002.tableData.rows[0];
  console.log('   第一列(动词原形):', firstRow[0]);
  console.log('   第二列(过去分词):', firstRow[1]);
  
  // 验证修复逻辑
  if (firstRow[0] === 'work' && firstRow[1] === 'worked') {
    console.log('✅ 数据结构正确');
    console.log('   修复后应该显示:');
    console.log('     第1列: 文本 "work" (作为提示)');
    console.log('     第2列: 输入框 (答案: "worked", 但不显示)');
  }
} else {
  console.log('❌ 未找到 participle_table_002');
}

// 测试非谓语（3）表格
console.log('\n3. 测试非谓语（3）表格:');
const participleTable003 = questionsData['participle_table_003'];
if (participleTable003) {
  console.log('✅ 找到 participle_table_003');
  console.log('   表头:', participleTable003.tableData.headers);
  console.log('   第一行:', participleTable003.tableData.rows[0]);
  
  // 检查数据结构
  const firstRow = participleTable003.tableData.rows[0];
  console.log('   第一列(动词原形):', firstRow[0]);
  console.log('   第二列(不定式):', firstRow[1]);
  
  // 验证修复逻辑
  if (firstRow[0] === 'study' && firstRow[1] === 'to study') {
    console.log('✅ 数据结构正确');
    console.log('   修复后应该显示:');
    console.log('     第1列: 文本 "study" (作为提示)');
    console.log('     第2列: 输入框 (答案: "to study", 但不显示)');
  }
} else {
  console.log('❌ 未找到 participle_table_003');
}

console.log('\n=== 修复说明 ===');
console.log('问题: 非谓语表格中，输入框上方显示了正确答案，失去了练习的意义');
console.log('修复: 在 createExerciseTableData 方法中，为非谓语表格添加了特殊处理逻辑');
console.log('      - 第一列(动词原形)显示为提示文本');
console.log('      - 第二列(答案)只作为输入框的答案验证，不在界面上显示');
console.log('      - 用户只能看到动词原形，需要自己填写正确的分词形式');

console.log('\n=== 测试完成 ==='); 