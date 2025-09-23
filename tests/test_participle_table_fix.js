// 测试非谓语表格的提示内容问题修复
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 测试非谓语表格提示内容修复 ===\n');

// 模拟 createExerciseTableData 方法的核心逻辑
function createExerciseTableData(tableData) {
  if (!tableData) {
    return tableData;
  }

  // 处理新的表格数据格式（tableData.headers 和 tableData.rows）
  if (tableData.tableData && tableData.tableData.headers && tableData.tableData.rows) {
    console.log('处理表格数据:', tableData.id);
    
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
        // 第一列通常是题目或说明，作为文本显示
        if (index === 0) {
          return { type: 'text', text: cell };
        } else {
          // 其他列需要特殊处理
          if (typeof cell === 'string') {
            // 对于非谓语表格的特殊处理（现在分词、过去分词、不定式）
            if (tableData.id === 'participle_table_001' || tableData.id === 'participle_table_002' || tableData.id === 'participle_table_003') {
              // 第一列是动词原形，作为提示词显示
              if (index === 0) {
                return { 
                  type: 'text', 
                  text: cell,
                  style: 'font-weight: bold; color: #1890ff;'
                };
              }
              // 第二列是答案，需要输入
              else if (index === 1) {
                return {
                  type: 'input',
                  placeholder: '请输入答案',
                  answer: cell
                };
              }
            }
            
            // 其他情况的处理...
            return {
              type: 'input',
              placeholder: '请输入答案',
              answer: cell
            };
          } else {
            // 非字符串类型，作为普通输入框
            return {
              type: 'input',
              placeholder: '请输入答案',
              answer: cell
            };
          }
        }
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

// 测试非谓语（1）表格
console.log('1. 测试非谓语（1）表格:');
const participleTable001 = questionsData['participle_table_001'];
if (participleTable001) {
  const exerciseData = createExerciseTableData(participleTable001);
  console.log('✅ 表格处理成功');
  console.log('   表头:', exerciseData.exerciseRows[0].map(cell => cell.text));
  console.log('   第一行数据:');
  exerciseData.exerciseRows[1].forEach((cell, index) => {
    if (cell.type === 'text') {
      console.log(`     第${index + 1}列: 文本 "${cell.text}"`);
    } else if (cell.type === 'input') {
      console.log(`     第${index + 1}列: 输入框 (答案: "${cell.answer}")`);
    }
  });
  
  // 检查是否还有答案显示问题
  const hasAnswerDisplayIssue = exerciseData.exerciseRows.some(row => 
    row.some(cell => cell.type === 'input' && cell.answer && cell.text === cell.answer)
  );
  console.log('   是否存在答案显示问题:', hasAnswerDisplayIssue ? '❌ 是' : '✅ 否');
} else {
  console.log('❌ 未找到 participle_table_001');
}

// 测试非谓语（2）表格
console.log('\n2. 测试非谓语（2）表格:');
const participleTable002 = questionsData['participle_table_002'];
if (participleTable002) {
  const exerciseData = createExerciseTableData(participleTable002);
  console.log('✅ 表格处理成功');
  console.log('   表头:', exerciseData.exerciseRows[0].map(cell => cell.text));
  console.log('   第一行数据:');
  exerciseData.exerciseRows[1].forEach((cell, index) => {
    if (cell.type === 'text') {
      console.log(`     第${index + 1}列: 文本 "${cell.text}"`);
    } else if (cell.type === 'input') {
      console.log(`     第${index + 1}列: 输入框 (答案: "${cell.answer}")`);
    }
  });
  
  // 检查是否还有答案显示问题
  const hasAnswerDisplayIssue = exerciseData.exerciseRows.some(row => 
    row.some(cell => cell.type === 'input' && cell.answer && cell.text === cell.answer)
  );
  console.log('   是否存在答案显示问题:', hasAnswerDisplayIssue ? '❌ 是' : '✅ 否');
} else {
  console.log('❌ 未找到 participle_table_002');
}

// 测试非谓语（3）表格
console.log('\n3. 测试非谓语（3）表格:');
const participleTable003 = questionsData['participle_table_003'];
if (participleTable003) {
  const exerciseData = createExerciseTableData(participleTable003);
  console.log('✅ 表格处理成功');
  console.log('   表头:', exerciseData.exerciseRows[0].map(cell => cell.text));
  console.log('   第一行数据:');
  exerciseData.exerciseRows[1].forEach((cell, index) => {
    if (cell.type === 'text') {
      console.log(`     第${index + 1}列: 文本 "${cell.text}"`);
    } else if (cell.type === 'input') {
      console.log(`     第${index + 1}列: 输入框 (答案: "${cell.answer}")`);
    }
  });
  
  // 检查是否还有答案显示问题
  const hasAnswerDisplayIssue = exerciseData.exerciseRows.some(row => 
    row.some(cell => cell.type === 'input' && cell.answer && cell.text === cell.answer)
  );
  console.log('   是否存在答案显示问题:', hasAnswerDisplayIssue ? '❌ 是' : '✅ 否');
} else {
  console.log('❌ 未找到 participle_table_003');
}

console.log('\n=== 测试完成 ==='); 