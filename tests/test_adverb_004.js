// 测试副词(4)内容是否正确添加
console.log('=== 副词(4) 内容验证测试 ===\n');

try {
  const questionsData = require('./miniprogram/data/intermediate_questions.js');
  
  // 检查副词(4)笔记
  console.log('1. 检查 adverb_note_004:');
  if (questionsData['adverb_note_004']) {
    console.log('✅ 找到 adverb_note_004');
    console.log('ID:', questionsData['adverb_note_004'].id);
    console.log('名称:', questionsData['adverb_note_004'].frontendName);
    console.log('分类:', questionsData['adverb_note_004'].category);
    console.log('子分类:', questionsData['adverb_note_004'].subCategory);
    console.log('状态:', questionsData['adverb_note_004'].status);
    console.log('有内容:', !!questionsData['adverb_note_004'].content);
    console.log('内容长度:', questionsData['adverb_note_004'].content ? questionsData['adverb_note_004'].content.length : 0);
    
    // 检查内容是否包含关键信息
    const content = questionsData['adverb_note_004'].content;
    if (content) {
      console.log('\n内容检查:');
      console.log('包含"修饰句子":', content.includes('修饰句子'));
      console.log('包含"副词(4)":', content.includes('副词(4)'));
      console.log('包含"考察示例":', content.includes('考察示例'));
    }
  } else {
    console.log('❌ 未找到 adverb_note_004');
  }

  console.log('\n2. 检查 adverb_table_004:');
  if (questionsData['adverb_table_004']) {
    console.log('✅ 找到 adverb_table_004');
    console.log('ID:', questionsData['adverb_table_004'].id);
    console.log('名称:', questionsData['adverb_table_004'].frontendName);
    console.log('分类:', questionsData['adverb_table_004'].category);
    console.log('子分类:', questionsData['adverb_table_004'].subCategory);
    console.log('状态:', questionsData['adverb_table_004'].status);
    console.log('有表格数据:', !!questionsData['adverb_table_004'].tableData);
    
    // 检查表格数据
    if (questionsData['adverb_table_004'].tableData) {
      const tableData = questionsData['adverb_table_004'].tableData;
      console.log('表头数量:', tableData.headers ? tableData.headers.length : 0);
      console.log('行数:', tableData.rows ? tableData.rows.length : 0);
      
      if (tableData.headers) {
        console.log('表头:', tableData.headers);
      }
      
      if (tableData.rows && tableData.rows.length > 0) {
        console.log('第一行数据:', tableData.rows[0]);
        console.log('最后一行数据:', tableData.rows[tableData.rows.length - 1]);
      }
    }
  } else {
    console.log('❌ 未找到 adverb_table_004');
  }

  console.log('\n3. 检查 副词(4) 分类:');
  if (questionsData['副词(4)']) {
    console.log('✅ 找到 副词(4) 分类');
    console.log('分类:', questionsData['副词(4)'].category);
    console.log('子分类:', questionsData['副词(4)'].subCategory);
    console.log('描述:', questionsData['副词(4)'].description);
    console.log('相关笔记:', questionsData['副词(4)'].relatedNotes);
    console.log('相关表格:', questionsData['副词(4)'].relatedTables);
    console.log('状态:', questionsData['副词(4)'].status);
  } else {
    console.log('❌ 未找到 副词(4) 分类');
  }

  console.log('\n4. 检查所有副词相关笔记:');
  const adverbNotes = [];
  Object.keys(questionsData).forEach(key => {
    if (key.startsWith('adverb_note_')) {
      adverbNotes.push(key);
    }
  });
  console.log('找到的副词笔记:', adverbNotes);

  console.log('\n5. 检查所有副词相关表格:');
  const adverbTables = [];
  Object.keys(questionsData).forEach(key => {
    if (key.startsWith('adverb_table_')) {
      adverbTables.push(key);
    }
  });
  console.log('找到的副词表格:', adverbTables);

  console.log('\n6. 检查所有副词分类:');
  const adverbCategories = [];
  Object.keys(questionsData).forEach(key => {
    if (key.startsWith('副词(') && key.endsWith(')')) {
      adverbCategories.push(key);
    }
  });
  console.log('找到的副词分类:', adverbCategories);

  console.log('\n=== 测试完成 ===');
  
} catch (error) {
  console.error('测试过程中出现错误:', error.message);
} 