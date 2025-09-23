// 测试介词表格修复
const testPrepositionTableFix = () => {
  console.log('=== 测试介词表格修复 ===');
  
  // 模拟介词表格数据
  const prepositionTableData = {
    id: 'preposition_table_001',
    frontendName: '介词书写(常见介词)',
    content: '常见介词的中译英表格，包含自动判断功能',
    category: '介词',
    subCategory: '介词(1)',
    status: '已创建',
    tableData: {
      headers: ['意思', '介词'],
      rows: [
        ['用于小地点(具体位置点)', 'at'],
        ['用于大地点(空间内部)', 'in'],
        ['用于表面接触', 'on'],
        ['在…… 下方', 'under'],
        ['在…… 上方(不接触)', 'above'],
        ['在…… 下方(不接触)', 'below'],
        ['在…… 旁边', 'beside'],
        ['在两者之间', 'between'],
        ['在三者及以上之间', 'among'],
        ['在…… 后面', 'behind'],
        ['在…… 前面(外部)', 'in front of'],
        ['在…… 内部', 'inside'],
        ['在…… 外部', 'outside'],
        ['具体时间点', 'at'],
        ['较长时间(年 / 月 / 季节 / 世纪)', 'in'],
        ['具体某天及某天的片段', 'on'],
        ['在…… 之后', 'after'],
        ['在…… 之前', 'before'],
        ['到…… 为止', 'by'],
        ['在…… 期间', 'during'],
        ['持续一段时间', 'for'],
        ['自从…… 以来', 'since'],
        ['关于', 'about'],
        ['反对；靠着', 'against'],
        ['伴随；用；和…… 一起', 'with'],
        ['没有', 'without'],
        ['为了；因为', 'for'],
        ['来自；从', 'from'],
        ['向；对', 'to'],
        ['…… 的；关于', 'of'],
        ['通过；被', 'by'],
        ['因为(后接名词)', 'because of'],
        ['代替', 'instead of']
      ]
    }
  };

  // 模拟createExerciseTableData函数
  const createExerciseTableData = (tableData) => {
    if (tableData.tableData && tableData.tableData.headers && tableData.tableData.rows) {
      console.log('处理新的表格数据格式:', tableData.tableData);
      
      const exerciseRows = [];
      
      // 添加表头行
      const headerRow = tableData.tableData.headers.map(header => ({
        type: 'text',
        text: header
      }));
      exerciseRows.push(headerRow);
      
      // 添加数据行 - 创建练习版本
      tableData.tableData.rows.forEach(row => {
        const exerciseRow = row.map((cell, index) => {
          // 对于介词表格的特殊处理
          if (tableData.id.startsWith('preposition_table_')) {
            // 第一列是意思，作为文本显示（左对齐）
            if (index === 0) {
              return { 
                type: 'text', 
                text: cell
              };
            }
            // 第二列是介词，只显示输入框，不显示答案提示
            else if (index === 1) {
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
      
      const exerciseData = {
        ...tableData,
        exerciseRows: exerciseRows,
        hasHeader: true
      };
      
      return exerciseData;
    }
    
    return tableData;
  };

  // 测试介词表格处理
  const result = createExerciseTableData(prepositionTableData);
  
  console.log('生成的练习数据:');
  console.log('表格ID:', result.id);
  console.log('行数:', result.exerciseRows.length);
  console.log('表头:', result.exerciseRows[0].map(cell => cell.text));
  
  // 检查前几行数据
  console.log('\n前3行数据:');
  for (let i = 1; i <= 3; i++) {
    const row = result.exerciseRows[i];
    console.log(`第${i}行:`);
    row.forEach((cell, index) => {
      if (cell.type === 'text') {
        console.log(`  列${index + 1}: 文本 "${cell.text}"`);
      } else if (cell.type === 'input') {
        console.log(`  列${index + 1}: 输入框 (答案: "${cell.answer}")`);
      }
    });
  }
  
  // 验证修复效果
  console.log('\n=== 验证修复效果 ===');
  
  // 检查第一列是否为文本类型
  const firstColumnText = result.exerciseRows.slice(1).every(row => 
    row[0].type === 'text' && typeof row[0].text === 'string'
  );
  console.log('✓ 第一列都是文本类型:', firstColumnText);
  
  // 检查第二列是否为输入框类型
  const secondColumnInput = result.exerciseRows.slice(1).every(row => 
    row[1].type === 'input' && row[1].placeholder === '请输入答案'
  );
  console.log('✓ 第二列都是输入框类型:', secondColumnInput);
  
  // 检查是否有答案提示
  const hasAnswerHints = result.exerciseRows.slice(1).some(row => 
    row[1].type === 'text' || row[1].type === 'answer'
  );
  console.log('✓ 第二列没有答案提示:', !hasAnswerHints);
  
  console.log('\n=== 测试完成 ===');
  
  return {
    success: firstColumnText && secondColumnInput && !hasAnswerHints,
    data: result
  };
};

// 运行测试
const testResult = testPrepositionTableFix();
console.log('测试结果:', testResult.success ? '通过' : '失败');

module.exports = { testPrepositionTableFix };
