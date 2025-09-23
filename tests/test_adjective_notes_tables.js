const fs = require('fs');
const path = require('path');

// 模拟前端的数据加载逻辑
function testAdjectiveNotesTables() {
  console.log('🧪 测试形容词比较级和最高级笔记表格加载...\n');
  
  try {
    // 加载数据
    const questionsData = require('./miniprogram/data/intermediate_questions.js');
    
    // 模拟前端的loadNotesAndTablesData逻辑
    const notesData = {};
    const tablesData = {};
    
    // 遍历questionsData，找到笔记和表格
    Object.keys(questionsData).forEach(key => {
      if (key.startsWith('tense_note_') || key.startsWith('voice_note_') || key.startsWith('noun_note_') || key.startsWith('pronoun_note_') || key.startsWith('preposition_note_') || key.startsWith('comparative_note_') || key.startsWith('superlative_note_')) {
        notesData[key] = questionsData[key];
      } else if (key.startsWith('tense_table_') || key.startsWith('voice_table_') || key.startsWith('noun_table_') || key.startsWith('pronoun_table_') || key.startsWith('preposition_table_') || key.startsWith('comparative_table_') || key.startsWith('superlative_table_')) {
        tablesData[key] = questionsData[key];
      }
    });
    
    console.log('✅ 数据加载结果:');
    console.log(`- 笔记数量: ${Object.keys(notesData).length}`);
    console.log(`- 表格数量: ${Object.keys(tablesData).length}`);
    
    // 检查形容词相关数据
    console.log('\n📋 形容词相关数据检查:');
    
    // 检查比较级数据
    if (notesData['comparative_note_001']) {
      console.log('✅ comparative_note_001 已加载');
      console.log(`  - 标题: ${notesData['comparative_note_001'].frontendName}`);
      console.log(`  - 分类: ${notesData['comparative_note_001'].category}`);
      console.log(`  - 子分类: ${notesData['comparative_note_001'].subCategory}`);
    } else {
      console.log('❌ comparative_note_001 未找到');
    }
    
    if (tablesData['comparative_table_001']) {
      console.log('✅ comparative_table_001 已加载');
      console.log(`  - 标题: ${tablesData['comparative_table_001'].frontendName}`);
      console.log(`  - 分类: ${tablesData['comparative_table_001'].category}`);
      console.log(`  - 子分类: ${tablesData['comparative_table_001'].subCategory}`);
      console.log(`  - 表格行数: ${tablesData['comparative_table_001'].tableData.rows.length}`);
    } else {
      console.log('❌ comparative_table_001 未找到');
    }
    
    // 检查最高级数据
    if (notesData['superlative_note_001']) {
      console.log('✅ superlative_note_001 已加载');
      console.log(`  - 标题: ${notesData['superlative_note_001'].frontendName}`);
      console.log(`  - 分类: ${notesData['superlative_note_001'].category}`);
      console.log(`  - 子分类: ${notesData['superlative_note_001'].subCategory}`);
    } else {
      console.log('❌ superlative_note_001 未找到');
    }
    
    if (tablesData['superlative_table_001']) {
      console.log('✅ superlative_table_001 已加载');
      console.log(`  - 标题: ${tablesData['superlative_table_001'].frontendName}`);
      console.log(`  - 分类: ${tablesData['superlative_table_001'].category}`);
      console.log(`  - 子分类: ${tablesData['superlative_table_001'].subCategory}`);
      console.log(`  - 表格行数: ${tablesData['superlative_table_001'].tableData.rows.length}`);
    } else {
      console.log('❌ superlative_table_001 未找到');
    }
    
    // 模拟题目类型映射测试
    console.log('\n🎯 题目类型映射测试:');
    
    const typeMapping = {
      '形容词(1)': 'adjective-comparative',
      '形容词(2)': 'adjective-superlative',
      '形容词(3)': 'adjective-superlative',
      '比较级': 'adjective-comparative',
      '最高级': 'adjective-superlative'
    };
    
    const noteMapping = {
      'adjective-comparative': 'comparative_note_001',
      'adjective-superlative': 'superlative_note_001'
    };
    
    const tableMapping = {
      'adjective-comparative': ['comparative_table_001'],
      'adjective-superlative': ['superlative_table_001']
    };
    
    // 测试映射
    Object.entries(typeMapping).forEach(([input, expectedType]) => {
      console.log(`\n测试输入: "${input}"`);
      console.log(`期望类型: "${expectedType}"`);
      
      const noteId = noteMapping[expectedType];
      const tableIds = tableMapping[expectedType];
      
      if (notesData[noteId]) {
        console.log(`✅ 笔记映射成功: ${noteId}`);
      } else {
        console.log(`❌ 笔记映射失败: ${noteId} 未找到`);
      }
      
      if (tableIds.every(id => tablesData[id])) {
        console.log(`✅ 表格映射成功: ${tableIds.join(', ')}`);
      } else {
        console.log(`❌ 表格映射失败: ${tableIds.join(', ')} 未找到`);
      }
    });
    
    console.log('\n🎉 测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testAdjectiveNotesTables(); 