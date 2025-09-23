// 测试形容词表格输入验证逻辑
const questions = require('./miniprogram/data/intermediate_questions.js');

// 模拟前端数据处理逻辑
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
      if (tableData.id === 'comparative_table_001' || tableData.id === 'superlative_table_001') {
        const word1 = row[0];
        const word2 = row[1];
        const word3 = row[2];
        const word4 = row[3];
        const rule = row[4];
        
        // 创建单词到答案的映射
        const wordAnswerMap = getWordAnswerMap(tableData.id);
        
        const newRow = [
          { 
            type: 'word-input', 
            word: word1,
            answer: wordAnswerMap[word1] || '',
            placeholder: '请输入答案'
          },
          { 
            type: 'word-input', 
            word: word2,
            answer: wordAnswerMap[word2] || '',
            placeholder: '请输入答案'
          },
          { 
            type: 'word-input', 
            word: word3,
            answer: wordAnswerMap[word3] || '',
            placeholder: '请输入答案'
          },
          { 
            type: 'word-input', 
            word: word4,
            answer: wordAnswerMap[word4] || '',
            placeholder: '请输入答案'
          },
          { 
            type: 'clickable-rule', 
            text: rule,
            fullContent: getRuleFullContent(rule, tableData.id)
          }
        ];
        
        exerciseRows.push(newRow);
      }
    });
    
    return {
      id: tableData.id,
      exerciseRows: exerciseRows,
      hasHeader: true
    };
  }
  
  return tableData;
}

function getWordAnswerMap(tableId) {
  if (tableId === 'comparative_table_001') {
    return {
      'fast': 'faster',
      'hard': 'harder',
      'short': 'shorter',
      'clean': 'cleaner',
      'nice': 'nicer',
      'large': 'larger',
      'safe': 'safer',
      'cute': 'cuter',
      'big': 'bigger',
      'hot': 'hotter',
      'thin': 'thinner',
      'fat': 'fatter',
      'happy': 'happier',
      'easy': 'easier',
      'heavy': 'heavier',
      'busy': 'busier',
      'good': 'better',
      'bad': 'worse',
      'many': 'more',
      'little': 'less',
      'beautiful': 'more beautiful',
      'important': 'more important',
      'interesting': 'more interesting',
      'difficult': 'more difficult'
    };
  } else if (tableId === 'superlative_table_001') {
    return {
      'fast': 'fastest',
      'hard': 'hardest',
      'short': 'shortest',
      'clean': 'cleanest',
      'nice': 'nicest',
      'large': 'largest',
      'safe': 'safest',
      'cute': 'cutest',
      'big': 'biggest',
      'hot': 'hottest',
      'thin': 'thinnest',
      'fat': 'fattest',
      'happy': 'happiest',
      'easy': 'easiest',
      'heavy': 'heaviest',
      'busy': 'busiest',
      'good': 'best',
      'bad': 'worst',
      'many': 'most',
      'little': 'least',
      'beautiful': 'most beautiful',
      'important': 'most important',
      'interesting': 'most interesting',
      'difficult': 'most difficult'
    };
  }
  return {};
}

function getRuleFullContent(ruleText, tableId) {
  if (ruleText.includes('：')) {
    return ruleText;
  }
  
  const ruleMap = {
    '规则一': '一般情况直接加' + (tableId === 'comparative_table_001' ? 'er' : 'est'),
    '规则二': '以不发音的e结尾加' + (tableId === 'comparative_table_001' ? 'r' : 'st'),
    '规则三': '重读闭音节双写辅音字母加' + (tableId === 'comparative_table_001' ? 'er' : 'est'),
    '规则四': '辅音字母+y结尾变y为i加' + (tableId === 'comparative_table_001' ? 'er' : 'est'),
    '规则五': '不规则变化',
    '规则六': '多音节单词' + (tableId === 'comparative_table_001' ? '比较级前加more' : '最高级前加most')
  };
  
  return ruleMap[ruleText] || ruleText;
}

// 模拟答案验证逻辑
function checkAnswer(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false;
  
  const userInput = userAnswer.trim().toLowerCase();
  const correct = correctAnswer.trim().toLowerCase();
  
  console.log(`[答案判定] 用户答案: "${userAnswer}" -> "${userInput}"`);
  console.log(`[答案判定] 正确答案: "${correctAnswer}" -> "${correct}"`);
  
  // 支持多答案格式，如 "which / that"
  if (correct.includes(' / ')) {
    const correctAnswers = correct.split(' / ').map(ans => ans.trim());
    console.log(`[答案判定] 多答案格式，正确答案列表: [${correctAnswers.join(', ')}]`);
    
    for (const answer of correctAnswers) {
      if (checkAnswerVariant(userInput, answer)) {
        console.log(`[答案判定] 匹配变体答案: "${answer}"`);
        return true;
      }
    }
    return false;
  } else {
    const result = checkAnswerVariant(userInput, correct);
    console.log(`[答案判定] 单答案格式，结果: ${result}`);
    return result;
  }
}

function checkAnswerVariant(userInput, correctAnswer) {
  const user = userInput.trim().toLowerCase();
  const correct = correctAnswer.trim().toLowerCase();
  
  // 直接匹配
  if (user === correct) {
    return true;
  }
  
  // 处理大小写变体
  if (user === correct.toLowerCase() || user === correct.toUpperCase()) {
    return true;
  }
  
  // 处理短横线变体
  const userWithoutDash = user.replace(/-/g, '');
  const correctWithoutDash = correct.replace(/-/g, '');
  if (userWithoutDash === correctWithoutDash) {
    return true;
  }
  
  // 处理空格变体
  const userWithoutSpace = user.replace(/\s+/g, '');
  const correctWithoutSpace = correct.replace(/\s+/g, '');
  if (userWithoutSpace === correctWithoutSpace) {
    return true;
  }
  
  return false;
}

// 模拟获取正确答案
function getTableCorrectAnswer(tableData, row, col) {
  if (tableData && tableData.exerciseRows && tableData.exerciseRows[row]) {
    const cell = tableData.exerciseRows[row][col];
    if (cell && cell.type === 'word-input' && cell.answer) {
      return cell.answer;
    }
  }
  return '';
}

// 测试比较级表格
console.log('=== 测试比较级表格输入验证 ===');
const comparativeTable = questions['comparative_table_001'];
const exerciseComparativeData = createExerciseTableData(comparativeTable);

// 测试第一行第一列（fast -> faster）
const testRow = 1; // 跳过表头
const testCol = 0; // 第一列
const correctAnswer = getTableCorrectAnswer(exerciseComparativeData, testRow, testCol);
console.log('正确答案:', correctAnswer);

// 测试各种输入
const testInputs = [
  'faster',    // 正确
  'Faster',    // 正确（大写）
  'FASTER',    // 正确（全大写）
  'faster ',   // 正确（末尾空格）
  ' faster',   // 正确（开头空格）
  'fasterr',   // 错误
  'fast',      // 错误
  'fastest',   // 错误
  ''           // 空输入
];

testInputs.forEach(input => {
  const isCorrect = checkAnswer(input, correctAnswer);
  console.log(`输入: "${input}" -> ${isCorrect ? '✅ 正确' : '❌ 错误'}`);
});

console.log('\n=== 测试完成 ==='); 