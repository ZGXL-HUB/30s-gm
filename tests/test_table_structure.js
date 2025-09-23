// 测试表格行列结构显示
const testTableData = {
  // 时态标志词表格（类似图二的结构）
  tenseMarkers: `| 时态 | 时间标志词 (举例) | 核心功能 |
|------|------------------|----------|
| 一般现在时 | every day, usually, on Sundays | 经常性动作/客观事实 |
| 一般过去时 | yesterday, last week, ago | 过去具体时间点的动作 |
| 一般将来时 | tomorrow, next month, in the future | 将来时间的动作 |
| 现在进行时 | now, at the moment, look | 现在正在进行的动作 |
| 过去进行时 | at 8 pm yesterday, when I called | 过去某刻正在进行的动作 |
| 现在完成时 | for 3 years, since 2020, already | 过去动作对现在的影响/持续 |
| 过去完成时 | by last year, before he left | "过去的过去"的动作 |
| 将来进行时 | at 5 pm tomorrow, this time next week | 将来某刻正在进行的动作 |`,

  // 名词分类表格
  nounClassification: `| 举例(中文 + 英文) | 类别名称 |
|---------------------|----------|
| 李白(Li Bai)、北京(Beijing)、春节(Spring Festival) | 专有名词 |
| 学生(student)、电脑(computer)、树(tree) | 个体名词(可数) |
| 家庭(family)、团队(team)、班级(class) | 集体名词(可单可复) |
| 水(water)、钢铁(steel)、空气(air) | 物质名词(不可数) |
| 幸福(happiness)、勇气(courage)、知识(knowledge) | 抽象名词(不可数) |`,

  // 名词后缀表格
  nounSuffix: `| 举例(动词 / 形容词→名词) | 名词后缀 |
|---------------------------|----------|
| 失败(fail→failure)、压力(press→pressure) | -ure |
| 死亡(die→death)、真相(true→truth) | -th |
| 发展(develop→development)、管理(manage→management) | -ment |
| 行动(act→action)、讨论(discuss→discussion) | -ion |
| 善良(kind→kindness)、黑暗(dark→darkness) | -ness |
| 拒绝(refuse→refusal)、批准(approve→approval) | -al |`
};

// 表格解析函数
function parseTableRows(rows) {
  if (rows.length === 0) return null;
  
  const tableData = {
    headers: [],
    rows: []
  };
  
  let isFirstRow = true;
  let hasHeaders = false;
  
  rows.forEach((row, index) => {
    // 跳过分隔符行（包含多个-符号的行）
    if (row.includes('------') || /^[\s\-\|]+$/.test(row)) {
      return;
    }
    
    const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
    if (cells.length === 0) return;
    
    // 检查是否所有单元格都为空
    const hasContent = cells.some(cell => cell.length > 0);
    if (!hasContent) return;
    
    if (isFirstRow) {
      tableData.headers = cells;
      isFirstRow = false;
      hasHeaders = true;
    } else {
      // 确保数据行的列数与表头一致
      const paddedCells = [...cells];
      while (paddedCells.length < tableData.headers.length) {
        paddedCells.push('');
      }
      tableData.rows.push(paddedCells.slice(0, tableData.headers.length));
    }
  });
  
  // 如果没有找到表头，使用第一行数据作为表头
  if (!hasHeaders && tableData.rows.length > 0) {
    tableData.headers = tableData.rows[0];
    tableData.rows = tableData.rows.slice(1);
  }
  
  return tableData.headers.length > 0 ? tableData : null;
}

// HTML转换函数
function convertTableRowsToHtml(rows) {
  if (rows.length === 0) return '';
  
  let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 20rpx 0; border: 1rpx solid #e0e0e0; border-radius: 8rpx; overflow: hidden; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);">';
  let isFirstRow = true;
  let headers = [];
  let rowIndex = 0;
  
  rows.forEach((row) => {
    // 跳过分隔符行
    if (row.includes('------') || /^[\s\-\|]+$/.test(row)) {
      return;
    }
    
    const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
    if (cells.length === 0) return;
    
    if (isFirstRow) {
      headers = cells;
      tableHtml += '<thead><tr>';
      headers.forEach(header => {
        tableHtml += `<th style="color: white; font-weight: bold; padding: 20rpx 15rpx; font-size: 24rpx; text-align: center; border-right: 1rpx solid #e0e0e0; line-height: 1.3; word-break: break-word; min-height: 60rpx; background-color: #1890ff;">${header}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';
      isFirstRow = false;
    } else {
      tableHtml += '<tr>';
      cells.forEach((cell, cellIndex) => {
        const cellContent = cell.trim();
        // 使用行索引来确定背景色，确保每行交替
        const bgColor = (rowIndex % 2 === 0) ? '#f9f9f9' : '#ffffff';
        tableHtml += `<td style="padding: 20rpx 15rpx; font-size: 24rpx; text-align: center; border-right: 1rpx solid #e0e0e0; line-height: 1.3; word-break: break-word; min-height: 60rpx; vertical-align: middle; background-color: ${bgColor};">${cellContent}</td>`;
      });
      tableHtml += '</tr>';
      rowIndex++;
    }
  });
  
  tableHtml += '</tbody></table>';
  return tableHtml;
}

// 测试表格结构
function testTableStructure() {
  console.log('=== 测试表格行列结构 ===');
  
  Object.keys(testTableData).forEach(key => {
    console.log(`\n测试表格: ${key}`);
    const rows = testTableData[key].split('\n');
    
    // 解析表格数据
    const parsedData = parseTableRows(rows);
    if (parsedData) {
      console.log('表头:', parsedData.headers);
      console.log('数据行数:', parsedData.rows.length);
      console.log('表格结构:');
      console.log('┌' + '─'.repeat(50) + '┐');
      console.log('│ ' + parsedData.headers.join(' │ ') + ' │');
      console.log('├' + '─'.repeat(50) + '┤');
      parsedData.rows.forEach((row, index) => {
        console.log('│ ' + row.join(' │ ') + ' │');
      });
      console.log('└' + '─'.repeat(50) + '┘');
    }
    
    // 生成HTML
    const html = convertTableRowsToHtml(rows);
    console.log('\n生成的HTML长度:', html.length);
    console.log('HTML预览:');
    console.log(html.substring(0, 500) + '...');
  });
}

// 验证表格是否正确显示为行列结构
function validateTableStructure() {
  console.log('\n=== 验证表格行列结构 ===');
  
  const testCases = [
    {
      name: '时态标志词表格',
      data: testTableData.tenseMarkers,
      expectedColumns: 3,
      expectedRows: 8
    },
    {
      name: '名词分类表格',
      data: testTableData.nounClassification,
      expectedColumns: 2,
      expectedRows: 5
    },
    {
      name: '名词后缀表格',
      data: testTableData.nounSuffix,
      expectedColumns: 2,
      expectedRows: 6
    }
  ];
  
  testCases.forEach(testCase => {
    console.log(`\n验证: ${testCase.name}`);
    const rows = testCase.data.split('\n');
    const parsedData = parseTableRows(rows);
    
    if (parsedData) {
      const actualColumns = parsedData.headers.length;
      const actualRows = parsedData.rows.length;
      
      console.log(`期望列数: ${testCase.expectedColumns}, 实际列数: ${actualColumns}`);
      console.log(`期望行数: ${testCase.expectedRows}, 实际行数: ${actualRows}`);
      
      if (actualColumns === testCase.expectedColumns && actualRows === testCase.expectedRows) {
        console.log('✅ 表格结构正确');
      } else {
        console.log('❌ 表格结构错误');
      }
      
      // 检查每行的列数是否一致
      const allRowsConsistent = parsedData.rows.every(row => row.length === actualColumns);
      console.log(`列数一致性: ${allRowsConsistent ? '✅' : '❌'}`);
    } else {
      console.log('❌ 表格解析失败');
    }
  });
}

// 运行测试
if (typeof console !== 'undefined') {
  testTableStructure();
  validateTableStructure();
}

module.exports = {
  testTableData,
  parseTableRows,
  convertTableRowsToHtml,
  testTableStructure,
  validateTableStructure
}; 