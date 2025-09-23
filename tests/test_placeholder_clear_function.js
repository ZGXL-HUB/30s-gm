// 测试placeholder清除功能
console.log('=== 测试placeholder清除功能 ===');

// 模拟表格数据结构
const mockTableData = {
  'adverb_table_004': {
    id: 'adverb_table_004',
    tableData: {
      headers: ['例题', '找副词修饰的动词', '书写规则(形容词变副词)', '答案'],
      rows: [
        ['She runs ___ (quick) in the park.', 'runs', '形容词+ly', 'quickly'],
        ['He speaks ___ (happy) every day.', 'speaks', '形容词+ly', 'happily'],
        ['The kite flies ___ (true) high in the sky.', 'flies', '形容词+ly', 'truly'],
        ['He solved the problem ___ (terrible) well.', 'solved', '形容词+ly', 'terribly'],
        ['She sings ___ (basic) in tune.', 'sings', '形容词+ly', 'basically']
      ]
    }
  }
};

// 模拟用户输入事件
function simulateUserInput(tableId, cellId, value, placeholder) {
  console.log(`\n--- 模拟用户输入 ---`);
  console.log(`表格ID: ${tableId}`);
  console.log(`单元格ID: ${cellId}`);
  console.log(`用户输入: "${value}"`);
  console.log(`原始placeholder: "${placeholder}"`);
  
  // 检查是否应该清除placeholder
  if (tableId.includes('_table_') && value === placeholder) {
    console.log('✅ 触发placeholder清除逻辑');
    console.log('✅ placeholder将被清除');
    return '';
  } else {
    console.log('❌ 不满足清除条件');
    console.log(`- 表格ID包含"_table_": ${tableId.includes('_table_')}`);
    console.log(`- 输入内容与placeholder一致: ${value === placeholder}`);
    return placeholder;
  }
}

// 测试用例
const testCases = [
  {
    tableId: 'adverb_table_004',
    cellId: 'cell_1',
    userInput: '请输入答案',
    placeholder: '请输入答案',
    expected: '应该清除placeholder'
  },
  {
    tableId: 'adverb_table_004',
    cellId: 'cell_2',
    userInput: 'quickly',
    placeholder: '请输入答案',
    expected: '不应该清除placeholder'
  },
  {
    tableId: 'adverb_table_004',
    cellId: 'cell_3',
    userInput: '请输入答案',
    placeholder: '填写后缀',
    expected: '不应该清除placeholder'
  },
  {
    tableId: 'noun_001', // 不包含_table_
    cellId: 'cell_4',
    userInput: '请输入答案',
    placeholder: '请输入答案',
    expected: '不应该清除placeholder（表格ID不包含_table_）'
  }
];

// 执行测试
testCases.forEach((testCase, index) => {
  console.log(`\n=== 测试用例 ${index + 1} ===`);
  const result = simulateUserInput(
    testCase.tableId,
    testCase.cellId,
    testCase.userInput,
    testCase.placeholder
  );
  
  console.log(`期望结果: ${testCase.expected}`);
  console.log(`实际结果: ${result === '' ? 'placeholder已清除' : 'placeholder未清除'}`);
  
  // 验证结果
  if (testCase.expected.includes('应该清除') && result === '') {
    console.log('✅ 测试通过');
  } else if (testCase.expected.includes('不应该清除') && result !== '') {
    console.log('✅ 测试通过');
  } else {
    console.log('❌ 测试失败');
  }
});

console.log('\n=== 测试完成 ===');
console.log('\n功能说明:');
console.log('1. 仅对ID包含"_table_"的表格生效');
console.log('2. 仅当用户输入内容与placeholder内容完全一致时清除');
console.log('3. 只对带有键入框的单元格生效');
console.log('4. 清除后placeholder变为空字符串'); 