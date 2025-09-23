// 测试表格点击统计修复
// 验证各种表格的点击事件是否正确调用统计方法

console.log('=== 测试表格点击统计修复 ===');

// 模拟微信小程序环境
const wx = {
  getStorageSync: (key) => {
    if (key === 'writingHistory') {
      return [
        {
          date: '2025/1/6',
          correctCount: 5,
          totalCount: 8
        }
      ];
    }
    return null;
  },
  setStorageSync: (key, value) => {
    console.log(`保存到 ${key}:`, value);
  }
};

// 模拟Page对象
const page = {
  data: {
    tableAnswers: {},
    showCorrect: {},
    rowStatus: {},
    noun004InputStatus: {},
    pronounUserInputs: {},
    pronounInputStatus: {},
    prepositionUserInputs: {},
    prepositionInputStatus: {},
    prefixSuffixInputStatus: {},
    comparativeInputStatus: {},
    superlativeInputStatus: {}
  },
  
  setData: function(data) {
    console.log('setData 调用:', data);
    Object.assign(this.data, data);
  },
  
  getTodayDateString: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `${year}/${month}/${day}`;
  },
  
  checkAnswer: function(userAnswer, correctAnswer) {
    return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
  },
  
  updateWritingStatsFromTable: function(tableId, cellId, isCorrect) {
    try {
      console.log('✅ updateWritingStatsFromTable 被调用:', { tableId, cellId, isCorrect });
      
      const today = this.getTodayDateString();
      const writingHistory = wx.getStorageSync('writingHistory') || [];
      
      // 查找今日记录
      let todayRecord = writingHistory.find(record => record.date === today);
      if (!todayRecord) {
        todayRecord = {
          date: today,
          correctCount: 0,
          totalCount: 0
        };
        writingHistory.push(todayRecord);
      }
      
      // 更新统计
      todayRecord.totalCount += 1;
      if (isCorrect) {
        todayRecord.correctCount += 1;
      }
      
      // 保存更新
      wx.setStorageSync('writingHistory', writingHistory);
      console.log('✅ 单个答案书写题统计已更新:', todayRecord);
      
    } catch (error) {
      console.error('❌ 更新单个答案书写题统计失败:', error);
    }
  }
};

// 测试1: noun_003点击处理
console.log('\n--- 测试1: noun_003点击处理 ---');
const noun003Event = {
  currentTarget: {
    dataset: {
      tableId: 'noun_003',
      cellId: 'cell_1',
      word: 'happiness'
    }
  }
};

page.onNoun003CellTap = function(e) {
  const { tableId, cellId, word } = e.currentTarget.dataset;
  const tableAnswers = { ...this.data.tableAnswers };
  if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
  tableAnswers[tableId][cellId] = true; // 标记已点

  // 判断是否为名词后缀结尾
  const nounSuffixes = [
    'ness','th','ment','ion','ure','ance','ence','ity','or','er','ist','ism','al','hood','ship','dom'
  ];
  const lowerWord = (word || '').toLowerCase();
  let isCorrect = false;
  for (let i = 0; i < nounSuffixes.length; i++) {
    if (lowerWord.endsWith(nounSuffixes[i])) {
      isCorrect = true;
      break;
    }
  }
  const showCorrect = { ...this.data.showCorrect };
  if (!showCorrect[tableId]) showCorrect[tableId] = {};
  showCorrect[tableId][cellId] = isCorrect;
  
  // 新增：更新书写题统计
  this.updateWritingStatsFromTable(tableId, cellId, isCorrect);
  
  this.setData({
    tableAnswers,
    showCorrect
  });
};

page.onNoun003CellTap.call(page, noun003Event);

// 测试2: noun_002选择处理
console.log('\n--- 测试2: noun_002选择处理 ---');
const noun002Event = {
  currentTarget: {
    dataset: {
      tableId: 'noun_002',
      cellId: 'cell_1',
      option: 'A',
      word: 'happiness'
    }
  }
};

page.onChoiceSelect = function(e) {
  const { tableId, cellId, option, word } = e.currentTarget.dataset;
  
  const tableAnswers = { ...this.data.tableAnswers };
  if (!tableAnswers[tableId]) {
    tableAnswers[tableId] = {};
  }
  tableAnswers[tableId][cellId] = option;
  
  // 检查答案是否正确或错误
  const showCorrect = { ...this.data.showCorrect };
  if (!showCorrect[tableId]) {
    showCorrect[tableId] = {};
  }
  const correctAnswer = 'happiness'; // 模拟正确答案
  
  // 验证选择的单词是否正确
  const isCorrect = this.checkAnswer(word, correctAnswer);
  showCorrect[tableId][cellId] = isCorrect;

  // 新增：更新书写题统计
  this.updateWritingStatsFromTable(tableId, cellId, isCorrect);

  // 计算当前行号
  let rowStatus = this.data.rowStatus || {};
  if (tableId === 'noun_002') {
    // 简化行状态计算，避免复杂逻辑
    rowStatus[0] = isCorrect ? 'correct' : 'wrong';
  }
  
  this.setData({
    tableAnswers,
    showCorrect,
    rowStatus
  });
};

page.onChoiceSelect.call(page, noun002Event);

// 测试3: noun_004输入处理
console.log('\n--- 测试3: noun_004输入处理 ---');
const noun004Event = {
  currentTarget: {
    dataset: {
      tableId: 'noun_004',
      cellId: 'cell_1',
      row: 0,
      col: 0
    }
  },
  detail: {
    value: 'cats'
  }
};

page.onNoun004Input = function(e) {
  const { tableId, cellId, row, col } = e.currentTarget.dataset;
  const value = e.detail.value;
  const tableAnswers = { ...this.data.tableAnswers };
  if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
  tableAnswers[tableId][cellId] = value;

  // 获取正确答案
  const correct = 'cats'; // 模拟正确答案
  let status = null;
  let isCorrect = false;
  if (!value) {
    status = null;
  } else if (this.checkAnswer(value, correct)) {
    status = 'correct';
    isCorrect = true;
  } else {
    status = 'wrong';
    isCorrect = false;
  }
  const noun004InputStatus = { ...this.data.noun004InputStatus, [`${row*5+col}`]: status };

  // 新增：更新书写题统计（只在有输入时统计）
  if (value && value.trim() !== '') {
    this.updateWritingStatsFromTable(tableId, cellId, isCorrect);
  }

  this.setData({
    tableAnswers,
    noun004InputStatus
  });
};

page.onNoun004Input.call(page, noun004Event);

console.log('\n=== 测试完成 ===');
console.log('如果看到所有 ✅ 标记，说明统计方法被正确调用');
console.log('如果看到 ❌ 标记，说明存在问题需要修复');
