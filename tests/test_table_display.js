// 测试表格显示功能
const testTableData = {
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
| 拒绝(refuse→refusal)、批准(approve→approval) | -al |`,

  // 复数变化规则表格
  pluralRules: `| 规则分类 | 变化规则 | 示例(单数→复数) |
|----------|----------|-------------------|
| 一般情况 | 直接加 - s | book→books |
| 以 - s, -x, -ch, -sh 结尾 | 加 - es | bus→buses；box→boxes |
| 以辅音字母 + y 结尾 | 变 y 为 i，再加 - es | city→cities；baby→babies |
| 以元音字母 + y 结尾 | 直接加 - s | boy→boys；toy→toys |
| 以 -f/-fe 结尾 | 多数变 f/fe 为 v 加 -es | leaf→leaves；knife→knives |
| 以 -o 结尾 | 有生命加 -es，无生命加 -s | tomato→tomatoes；photo→photos |
| 不规则变化 | 特殊记忆 | man→men；child→children |`
};

// 测试表格解析函数
function testParseTableRows() {
  console.log('=== 测试表格解析功能 ===');
  
  Object.keys(testTableData).forEach(key => {
    console.log(`\n测试表格: ${key}`);
    const rows = testTableData[key].split('\n');
    const result = parseTableRows(rows);
    
    if (result) {
      console.log('表头:', result.headers);
      console.log('数据行数:', result.rows.length);
      console.log('第一行数据:', result.rows[0]);
    } else {
      console.log('解析失败');
    }
  });
}

// 测试HTML转换函数
function testConvertTableRowsToHtml() {
  console.log('\n=== 测试HTML转换功能 ===');
  
  Object.keys(testTableData).forEach(key => {
    console.log(`\n测试表格: ${key}`);
    const rows = testTableData[key].split('\n');
    const html = convertTableRowsToHtml(rows);
    console.log('生成的HTML长度:', html.length);
    console.log('HTML预览:', html.substring(0, 200) + '...');
  });
}

// 模拟表格解析函数（从exercise-page/index.js复制）
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

// 模拟HTML转换函数（从exercise-page/index.js复制）
function convertTableRowsToHtml(rows) {
  if (rows.length === 0) return '';
  
  let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 20rpx 0; border: 1rpx solid #e0e0e0; border-radius: 8rpx; overflow: hidden; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);">';
  let isFirstRow = true;
  let headers = [];
  
  // 先处理表头
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
      cells.forEach((cell, index) => {
        const cellContent = cell.trim();
        const isEvenRow = (index % 2 === 0);
        const bgColor = isEvenRow ? '#f9f9f9' : '#ffffff';
        tableHtml += `<td style="padding: 20rpx 15rpx; font-size: 24rpx; text-align: center; border-right: 1rpx solid #e0e0e0; line-height: 1.3; word-break: break-word; min-height: 60rpx; vertical-align: middle; background-color: ${bgColor};">${cellContent}</td>`;
      });
      tableHtml += '</tr>';
    }
  });
  
  tableHtml += '</tbody></table>';
  return tableHtml;
}

// 运行测试
if (typeof console !== 'undefined') {
  testParseTableRows();
  testConvertTableRowsToHtml();
}

module.exports = {
  testTableData,
  parseTableRows,
  convertTableRowsToHtml
}; 