// 测试代词表格显示修复效果
const fs = require('fs');
const path = require('path');

// 模拟前端数据处理逻辑
function createExerciseTableData(tableData) {
  if (!tableData) {
    return tableData;
  }

  if (tableData.tableData && tableData.tableData.headers && tableData.tableData.rows) {
    console.log('处理代词表格数据:', tableData.id);
    
    const exerciseRows = [];
    
    // 添加表头行
    const headerRow = tableData.tableData.headers.map(header => ({
      type: 'text',
      text: header
    }));
    exerciseRows.push(headerRow);
    
    // 添加数据行 - 创建练习版本
    tableData.tableData.rows.forEach((row, rowIndex) => {
      const exerciseRow = row.map((cell, index) => {
        // 对于代词表格的特殊处理
        if (tableData.id.startsWith('pronoun_table_')) {
          // 第一列是人称，作为提示词显示
          if (index === 0) {
            return { 
              type: 'text', 
              text: cell,
              style: 'font-weight: bold; color: #1890ff;'
            };
          }
          // 其他列都是答案，需要输入
          else {
            return {
              type: 'input',
              placeholder: '请输入答案',
              answer: cell
            };
          }
        }
        
        // 默认处理
        return {
          type: 'input',
          placeholder: '请输入答案',
          answer: cell
        };
      });
      exerciseRows.push(exerciseRow);
    });
    
    const exerciseData = {
      ...tableData,
      exerciseRows: exerciseRows,
      hasHeader: true
    };
    
    return exerciseData;
  }
  
  return tableData;
}

// 测试代词表格数据
function testPronounTables() {
  console.log('=== 测试代词表格显示修复效果 ===\n');
  
  // 模拟代词表格数据
  const pronounTables = {
    "pronoun_table_001": {
      "id": "pronoun_table_001",
      "frontendName": "代词书写(整表)",
      "content": "人称物主反身代词书写练习表格，五列，包含自动判断功能",
      "category": "代词",
      "subCategory": "代词(1)",
      "status": "已创建",
      "tableData": {
        "headers": [
          "人称",
          "人称代词(主格)",
          "人称代词(宾格)",
          "物主代词(形容词性)",
          "物主代词(名词性)",
          "反身代词"
        ],
        "rows": [
          ["你", "you", "you", "your", "yours", "yourself"],
          ["我", "I", "me", "my", "mine", "myself"],
          ["他", "he", "him", "his", "his", "himself"],
          ["她", "she", "her", "her", "hers", "herself"],
          ["它", "it", "it", "its", "its", "itself"],
          ["你们", "you", "you", "your", "yours", "yourselves"],
          ["我们", "we", "us", "our", "ours", "ourselves"],
          ["他们", "they", "them", "their", "theirs", "themselves"]
        ]
      }
    },
    "pronoun_table_002": {
      "id": "pronoun_table_002",
      "frontendName": "代词书写(人称代词)",
      "content": "人称代词练习表格，三列结构，包含自动判断功能",
      "category": "代词",
      "subCategory": "代词(2)",
      "status": "已创建",
      "tableData": {
        "headers": [
          "人称",
          "人称代词(主格)",
          "人称代词(宾格)"
        ],
        "rows": [
          ["你", "you", "you"],
          ["我", "I", "me"],
          ["他", "he", "him"],
          ["她", "she", "her"],
          ["它", "it", "it"],
          ["你们", "you", "you"],
          ["我们", "we", "us"],
          ["他们", "they", "them"]
        ]
      }
    }
  };
  
  // 测试每个表格
  Object.keys(pronounTables).forEach(tableId => {
    console.log(`测试表格: ${tableId}`);
    console.log(`表格名称: ${pronounTables[tableId].frontendName}`);
    
    const tableData = pronounTables[tableId];
    const exerciseData = createExerciseTableData(tableData);
    
    if (exerciseData && exerciseData.exerciseRows) {
      console.log(`表头列数: ${exerciseData.exerciseRows[0].length}`);
      console.log(`数据行数: ${exerciseData.exerciseRows.length - 1}`);
      
      // 检查表头是否包含"反身代词"
      const headers = exerciseData.exerciseRows[0].map(cell => cell.text);
      const hasReflexive = headers.includes('反身代词');
      console.log(`表头包含"反身代词": ${hasReflexive ? '✅' : '❌'}`);
      
      // 检查数据完整性
      const dataRows = exerciseData.exerciseRows.slice(1);
      const hasCompleteData = dataRows.every(row => 
        row.every(cell => cell.type === 'text' || (cell.type === 'input' && cell.answer))
      );
      console.log(`数据完整性: ${hasCompleteData ? '✅' : '❌'}`);
      
      console.log('表头内容:', headers);
      console.log('---');
    } else {
      console.log('❌ 表格数据处理失败');
    }
    console.log('');
  });
  
  console.log('=== 测试完成 ===');
}

// 运行测试
testPronounTables();
