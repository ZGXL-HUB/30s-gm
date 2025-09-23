// 测试新的形容词表格格式
const questions = require('./miniprogram/data/intermediate_questions.js');

// 测试比较级表格
console.log('=== 测试比较级表格 ===');
const comparativeTable = questions['comparative_table_001'];
console.log('表格ID:', comparativeTable.id);
console.log('表头:', comparativeTable.tableData.headers);
console.log('数据行数:', comparativeTable.tableData.rows.length);
console.log('第一行数据:', comparativeTable.tableData.rows[0]);

// 测试最高级表格
console.log('\n=== 测试最高级表格 ===');
const superlativeTable = questions['superlative_table_001'];
console.log('表格ID:', superlativeTable.id);
console.log('表头:', superlativeTable.tableData.headers);
console.log('数据行数:', superlativeTable.tableData.rows.length);
console.log('第一行数据:', superlativeTable.tableData.rows[0]);

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

// 测试数据处理
console.log('\n=== 测试数据处理 ===');
const exerciseComparativeData = createExerciseTableData(comparativeTable);
console.log('比较级练习数据:');
console.log('行数:', exerciseComparativeData.exerciseRows.length);
console.log('表头:', exerciseComparativeData.exerciseRows[0]);
console.log('第一行数据:', exerciseComparativeData.exerciseRows[1]);

const exerciseSuperlativeData = createExerciseTableData(superlativeTable);
console.log('\n最高级练习数据:');
console.log('行数:', exerciseSuperlativeData.exerciseRows.length);
console.log('表头:', exerciseSuperlativeData.exerciseRows[0]);
console.log('第一行数据:', exerciseSuperlativeData.exerciseRows[1]);

console.log('\n=== 测试完成 ==='); 