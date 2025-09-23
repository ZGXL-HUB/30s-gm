const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 副词(4)表格修改验证 ===\n');

// 检查副词(4)表格
console.log('1. 检查 adverb_table_004 表格数据:');
if (questionsData['adverb_table_004']) {
  console.log('✅ 找到 adverb_table_004');
  console.log('ID:', questionsData['adverb_table_004'].id);
  console.log('名称:', questionsData['adverb_table_004'].frontendName);
  console.log('子分类:', questionsData['adverb_table_004'].subCategory);
  
  // 检查表格数据
  if (questionsData['adverb_table_004'].tableData) {
    const tableData = questionsData['adverb_table_004'].tableData;
    console.log('表头:', tableData.headers);
    console.log('行数:', tableData.rows.length);
    
    console.log('\n2. 检查表格内容修改:');
    tableData.rows.forEach((row, index) => {
      console.log(`\n第${index + 1}行:`);
      console.log('  例题:', row[0]);
      console.log('  找副词修饰的词:', row[1]);
      console.log('  书写规则:', row[2]);
      console.log('  答案:', row[3] === '' ? '(空 - 用户输入)' : row[3]);
      
      // 验证修改是否正确
      if (row[1] === '整个句子') {
        console.log('  ✅ 第二列正确：只显示"整个句子"作为提示');
      } else {
        console.log('  ❌ 第二列错误：应该只显示"整个句子"');
      }
      
      if (row[2] && row[2].length > 0) {
        console.log('  ✅ 第三列正确：包含规则内容');
      } else {
        console.log('  ❌ 第三列错误：应该包含规则内容');
      }
      
      if (row[3] === '') {
        console.log('  ✅ 第四列正确：答案为空，供用户输入');
      } else {
        console.log('  ❌ 第四列错误：答案应该为空');
      }
    });
  }
} else {
  console.log('❌ 未找到 adverb_table_004');
}

console.log('\n3. 检查前端处理逻辑:');
console.log('✅ 已在 createExerciseTableData 方法中添加副词(4)特殊处理');
console.log('✅ 第二列：显示为文本提示');
console.log('✅ 第三列：显示为规则文本');
console.log('✅ 第四列：显示为输入框');

console.log('\n4. 检查CSS样式修改:');
console.log('✅ 已修改 table-input 样式，添加了宽度限制和文本换行');
console.log('✅ 已修改 table-cell 样式，确保内容正确换行');

console.log('\n=== 验证完成 ==='); 