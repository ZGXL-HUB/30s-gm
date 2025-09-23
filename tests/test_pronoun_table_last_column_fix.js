// 测试代词表格最后一列显示修复
const fs = require('fs');
const path = require('path');

// 模拟数据
const testData = {
  pronoun_table_003: {
    id: "pronoun_table_003",
    frontendName: "代词书写(物主代词)",
    content: "物主代词练习表格，三列结构，包含自动判断功能",
    category: "代词",
    subCategory: "代词(3)",
    status: "已创建",
    tableData: {
      headers: [
        "人称",
        "物主代词(形容词性)",
        "物主代词(名词性)"
      ],
      rows: [
        ["you", "your", "yours"],
        ["I", "my", "mine"],
        ["he", "his", "his"],
        ["she", "her", "hers"],
        ["it", "its", "its"],
        ["you", "your", "yours"],
        ["we", "our", "ours"],
        ["they", "their", "theirs"]
      ]
    }
  }
};

// 模拟createExerciseTableData函数
function createExerciseTableData(tableData) {
  if (!tableData) {
    return tableData;
  }

  if (tableData.tableData && tableData.tableData.headers && tableData.tableData.rows) {
    console.log('处理新的表格数据格式:', tableData.tableData);
    
    const exerciseRows = [];
    
    // 添加表头行
    const headerRow = tableData.tableData.headers.map(header => ({
      type: 'text',
      text: header
    }));
    exerciseRows.push(headerRow);
    
    // 添加数据行
    tableData.tableData.rows.forEach(row => {
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
        if (index === 0) {
          return { type: 'text', text: cell };
        } else {
          return {
            type: 'input',
            placeholder: '请输入答案',
            answer: cell
          };
        }
      });
      
      exerciseRows.push(exerciseRow);
    });
    
    return {
      ...tableData,
      exerciseRows,
      hasHeader: true
    };
  }
  
  return tableData;
}

// 测试函数
function testPronounTableLastColumn() {
  console.log('=== 测试代词表格最后一列显示修复 ===');
  
  const tableData = testData.pronoun_table_003;
  console.log('原始表格数据:');
  console.log('表头:', tableData.tableData.headers);
  console.log('行数:', tableData.tableData.rows.length);
  console.log('第一行数据:', tableData.tableData.rows[0]);
  
  const exerciseData = createExerciseTableData(tableData);
  console.log('\n处理后的练习数据:');
  console.log('练习行数:', exerciseData.exerciseRows.length);
  console.log('表头行:', exerciseData.exerciseRows[0]);
  console.log('第一行练习数据:', exerciseData.exerciseRows[1]);
  
  // 检查最后一列
  const firstDataRow = exerciseData.exerciseRows[1];
  const lastColumn = firstDataRow[firstDataRow.length - 1];
  console.log('\n最后一列数据:');
  console.log('类型:', lastColumn.type);
  console.log('内容:', lastColumn.answer);
  console.log('占位符:', lastColumn.placeholder);
  
  // 验证结果
  const expectedColumns = 3;
  const actualColumns = firstDataRow.length;
  
  console.log('\n=== 验证结果 ===');
  console.log(`期望列数: ${expectedColumns}`);
  console.log(`实际列数: ${actualColumns}`);
  console.log(`列数匹配: ${actualColumns === expectedColumns ? '✅' : '❌'}`);
  
  if (lastColumn.type === 'input' && lastColumn.answer === 'yours') {
    console.log('最后一列内容正确: ✅');
  } else {
    console.log('最后一列内容错误: ❌');
  }
  
  return actualColumns === expectedColumns && lastColumn.answer === 'yours';
}

// 运行测试
if (require.main === module) {
  const result = testPronounTableLastColumn();
  console.log(`\n测试结果: ${result ? '通过' : '失败'}`);
}

module.exports = {
  testPronounTableLastColumn,
  createExerciseTableData
};
