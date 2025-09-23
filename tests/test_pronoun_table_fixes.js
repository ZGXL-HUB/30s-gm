// 测试代词表格修复效果
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
  console.log('=== 测试代词表格修复效果 ===\n');
  
  // 测试数据
  const testTables = {
    'pronoun_table_001': {
      id: 'pronoun_table_001',
      frontendName: '代词书写(整表)',
      tableData: {
        headers: ['人称', '人称代词(主格)', '人称代词(宾格)', '物主代词(形容词性)', '物主代词(名词性)', '反身代词'],
        rows: [
          ['你', 'you', 'you', 'your', 'yours', 'yourself'],
          ['我', 'I', 'me', 'my', 'mine', 'myself']
        ]
      }
    },
    'pronoun_table_002': {
      id: 'pronoun_table_002',
      frontendName: '代词书写(人称代词)',
      tableData: {
        headers: ['人称', '人称代词(主格)', '人称代词(宾格)'],
        rows: [
          ['you', 'you', 'you'],
          ['I', 'I', 'me']
        ]
      }
    },
    'pronoun_table_003': {
      id: 'pronoun_table_003',
      frontendName: '代词书写(物主代词)',
      tableData: {
        headers: ['人称', '物主代词(形容词性)', '物主代词(名词性)'],
        rows: [
          ['you', 'your', 'yours'],
          ['I', 'my', 'mine']
        ]
      }
    },
    'pronoun_table_004': {
      id: 'pronoun_table_004',
      frontendName: '代词书写(反身代词)',
      tableData: {
        headers: ['人称', '反身代词'],
        rows: [
          ['you', 'yourself'],
          ['I', 'myself']
        ]
      }
    },
    'pronoun_table_005': {
      id: 'pronoun_table_005',
      frontendName: '代词书写(关系代词)',
      tableData: {
        headers: ['例句', '先行词', '关系代词', '能填写 that 吗'],
        rows: [
          ['The girl ______ is singing is my sister.(限制性)', 'the girl', 'who/that', '能'],
          ['Mr. Li, ______ you met yesterday, is our math teacher.(非限制性)', 'Mr. Li', 'whom', '不能']
        ]
      }
    },
    'pronoun_table_006': {
      id: 'pronoun_table_006',
      frontendName: '代词书写(it相关)',
      tableData: {
        headers: ['例句', '答案'],
        rows: [
          ['______ is necessary for us to learn teamwork.', 'It; for'],
          ['It is ______(impoertance) for children to read more books.', 'important']
        ]
      }
    }
  };
  
  // 测试每个表格
  Object.keys(testTables).forEach(tableId => {
    console.log(`\n--- 测试 ${tableId} ---`);
    const tableData = testTables[tableId];
    const exerciseData = createExerciseTableData(tableData);
    
    console.log('表头数量:', exerciseData.exerciseRows[0].length);
    console.log('数据行数量:', exerciseData.exerciseRows.length - 1);
    
    // 检查每一行的列数
    exerciseData.exerciseRows.forEach((row, rowIndex) => {
      console.log(`第${rowIndex}行列数: ${row.length}`);
      
      // 检查每一列的类型
      row.forEach((cell, colIndex) => {
        if (rowIndex === 0) {
          console.log(`  第${colIndex}列(表头): ${cell.type} - "${cell.text}"`);
        } else {
          console.log(`  第${colIndex}列: ${cell.type} - ${cell.type === 'input' ? `placeholder: "${cell.placeholder}", answer: "${cell.answer}"` : `text: "${cell.text}"`}`);
        }
      });
    });
    
    // 检查是否有空列
    const hasEmptyColumns = exerciseData.exerciseRows.some(row => 
      row.some(cell => cell.type === 'input' && (!cell.answer || cell.answer === ''))
    );
    
    if (hasEmptyColumns) {
      console.log('⚠️  发现空列！');
    } else {
      console.log('✅ 所有列都有内容');
    }
  });
}

// 运行测试
testPronounTables();
