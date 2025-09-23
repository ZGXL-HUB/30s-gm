// 书写测试页面

Page({
  data: {
    currentExercise: null,
    currentTable: '',
    testProgress: {},
    totalTables: 0,
    showAnswer: false,
    userAnswer: '',
    isCorrect: false,
    progressPercentage: 0,
    tables: [
      "pronoun_table_001", "pronoun_table_002", "pronoun_table_003",
      "preposition_table_001", "preposition_table_003",
      "tense_writing_001", "voice_writing_001", "voice_writing_002",
      "noun_001", "noun_002", "adjective_001", "adjective_002",
      "verb_001", "verb_002"
    ],
    tableProgress: {},
    loading: true,
    showProgressModal: false
  },

  onLoad() {
    this.initTest();
  },

  onShow() {
    // 页面显示时刷新进度
    this.loadTestProgress();
  },

  // 初始化测试
  initTest() {
    this.loadTestProgress();
    this.loadNextExercise();
  },

  // 加载测试进度
  loadTestProgress() {
    const progress = wx.getStorageSync('writingTestProgress') || {};
    const tableProgress = {};
    
    // 计算每个表格的进度
    this.data.tables.forEach(table => {
      const testedCount = Object.keys(progress).filter(key => 
        progress[key].table === table
      ).length;
      
      tableProgress[table] = {
        tested: testedCount > 0,
        percentage: testedCount > 0 ? 100 : 0
      };
    });

    this.setData({
      testProgress: progress,
      tableProgress: tableProgress,
      totalTables: Object.keys(progress).length
    });
  },

  // 加载下一个练习
  loadNextExercise() {
    // 找到下一个未测试的表格
    const nextTable = this.findNextUntestedTable();
    
    if (!nextTable) {
      // 所有表格都测试完了
      this.showTestComplete();
      return;
    }

    // 生成该表格的练习题目
    const exercise = this.generateExerciseFromTable(nextTable);
    if (!exercise) {
      // 该表格无法生成题目，标记为已完成
      this.markTableComplete(nextTable);
      this.loadNextExercise();
      return;
    }

    this.setData({
      currentExercise: exercise,
      currentTable: nextTable,
      loading: false
    });
  },

  // 找到下一个未测试的表格
  findNextUntestedTable() {
    for (const table of this.data.tables) {
      const testedCount = Object.keys(this.data.testProgress).filter(key => 
        this.data.testProgress[key].table === table
      ).length;
      
      if (testedCount === 0) {
        return table;
      }
    }
    return null;
  },

  // 标记表格为已完成
  markTableComplete(table) {
    const progress = { ...this.data.testProgress };
    progress[`${table}_complete`] = {
      table: table,
      completed: true,
      timestamp: Date.now()
    };
    
    this.setData({ testProgress: progress });
    wx.setStorageSync('writingTestProgress', progress);
  },

  // 从表格生成练习题目
  generateExerciseFromTable(tableId) {
    try {
      // 使用内联转换逻辑生成真实的练习题目
      const exercise = this.convertTableToExercise(tableId);
      if (exercise) {
        return exercise;
      }
      
      // 如果转换失败，使用备用数据
      console.warn('转换失败，使用备用数据');
      return this.getFallbackExercise(tableId);
      
    } catch (error) {
      console.error('生成练习题目失败:', error);
      return this.getFallbackExercise(tableId);
    }
  },

  // 内联转换逻辑：将表格转换为填空题
  convertTableToExercise(tableId) {
    try {
      // 获取表格数据
      const tableData = this.getTableData(tableId);
      if (!tableData) {
        return null;
      }

      // 根据表格类型进行转换
      switch (tableId) {
        case 'pronoun_table_001':
          return this.convertPronounTable001(tableData);
        case 'pronoun_table_002':
          return this.convertPronounTable002(tableData);
        case 'pronoun_table_003':
          return this.convertPronounTable003(tableData);
        case 'preposition_table_001':
          return this.convertPrepositionTable001(tableData);
        case 'tense_writing_001':
          return this.convertTenseWriting001(tableData);
        case 'voice_writing_001':
          return this.convertVoiceWriting001(tableData);
        case 'voice_writing_002':
          return this.convertVoiceWriting002(tableData);
        case 'noun_001':
          return this.convertNoun001(tableData);
        case 'noun_002':
          return this.convertNoun002(tableData);
        case 'adjective_001':
          return this.convertAdjective001(tableData);
        case 'adjective_002':
          return this.convertAdjective002(tableData);
        case 'verb_001':
          return this.convertVerb001(tableData);
        case 'verb_002':
          return this.convertVerb002(tableData);
        default:
          return null;
      }
    } catch (error) {
      console.error('转换表格失败:', error);
      return null;
    }
  },

  // 获取表格数据
  getTableData(tableId) {
    // 内联的表格数据
    const tableDataMap = {
      'pronoun_table_001': {
        headers: ["人称", "主格", "宾格", "形容词性物主代词", "名词性物主代词", "反身代词"],
        rows: [
          ["I", "", "", "", ""],
          ["you", "", "", "", ""],
          ["he", "", "", "", ""],
          ["she", "", "", "", ""],
          ["it", "", "", "", ""],
          ["we", "", "", "", ""],
          ["you", "", "", "", ""],
          ["they", "", "", "", ""]
        ],
        answers: [
          ["I", "me", "my", "mine", "myself"],
          ["you", "you", "your", "yours", "yourself"],
          ["he", "him", "his", "his", "himself"],
          ["she", "her", "her", "hers", "herself"],
          ["it", "it", "its", "its", "itself"],
          ["we", "us", "our", "ours", "ourselves"],
          ["you", "you", "your", "yours", "yourselves"],
          ["they", "them", "their", "theirs", "themselves"]
        ]
      },
      'preposition_table_001': {
        headers: ["意思", "介词"],
        rows: [
          ["用于小地点(具体位置点)", "at"],
          ["用于大地点(空间内部)", "in"],
          ["用于表面接触", "on"],
          ["在…… 下方", "under"],
          ["在…… 上方(不接触)", "above"]
        ]
      },
      'tense_writing_001': {
        headers: ["时态名称", "规则", "动词形式1", "动词形式2", "动词形式3", "动词形式4"],
        rows: [
          ["一般现在时", "主语+动词原形", "work", "work", "works", "work"],
          ["一般过去时", "主语+动词过去式", "worked", "worked", "worked", "worked"],
          ["一般将来时", "will+动词原形", "will work", "will work", "will work", "will work"]
        ]
      }
    };

    return tableDataMap[tableId];
  },

  // 转换代词表格001
  convertPronounTable001(tableData) {
    const personMapping = {
      "I": "我", "you": "你", "he": "他", "she": "她", "it": "它",
      "we": "我们", "you": "你们", "they": "他们"
    };

    // 随机选择一个人称和语法点
    const randomRowIndex = Math.floor(Math.random() * tableData.rows.length);
    const randomColIndex = Math.floor(Math.random() * 5) + 1; // 跳过人称列
    
    const person = tableData.rows[randomRowIndex][0];
    const grammarPoint = tableData.headers[randomColIndex];
    const correctAnswer = tableData.answers[randomRowIndex][randomColIndex];
    
    if (!correctAnswer || correctAnswer === '') {
      return null;
    }

    const chinesePerson = personMapping[person] || person;
    
    return {
      question: `${chinesePerson}的${grammarPoint}是_____`,
      correctAnswer: correctAnswer,
      analysis: `${chinesePerson}的${grammarPoint}是${correctAnswer}`
    };
  },

  // 转换介词表格001
  convertPrepositionTable001(tableData) {
    const randomIndex = Math.floor(Math.random() * tableData.rows.length);
    const meaning = tableData.rows[randomIndex][0];
    const preposition = tableData.rows[randomIndex][1];
    
    return {
      question: `${meaning}的介词是_____`,
      correctAnswer: preposition,
      analysis: `${meaning}的介词是${preposition}`
    };
  },

  // 转换时态表格001
  convertTenseWriting001(tableData) {
    const randomRowIndex = Math.floor(Math.random() * tableData.rows.length);
    const randomColIndex = Math.floor(Math.random() * 4) + 2; // 跳过时态名称和规则列
    
    const tenseName = tableData.rows[randomRowIndex][0];
    const grammarPoint = tableData.headers[randomColIndex];
    const correctAnswer = tableData.rows[randomRowIndex][randomColIndex];
    
    return {
      question: `${tenseName}的${grammarPoint}是_____`,
      correctAnswer: correctAnswer,
      analysis: `${tenseName}的${grammarPoint}是${correctAnswer}`
    };
  },

  // 其他转换方法（简化版）
  convertPronounTable002(tableData) {
    return {
      question: "你的宾格是_____",
      correctAnswer: "you",
      analysis: "第二人称'你'的宾格是you"
    };
  },

  convertPronounTable003(tableData) {
    return {
      question: "我的形容词性物主代词是_____",
      correctAnswer: "my",
      analysis: "第一人称单数'我'的形容词性物主代词是my"
    };
  },


  convertVoiceWriting001(tableData) {
    return {
      question: "write（一般现在时原形）的主动语态是_____",
      correctAnswer: "I write a letter",
      analysis: "write的主动语态是I write a letter"
    };
  },

  convertVoiceWriting002(tableData) {
    return {
      question: "write（一般现在时原形）的被动语态是_____",
      correctAnswer: "A letter is written by me",
      analysis: "write的被动语态是A letter is written by me"
    };
  },

  convertNoun001(tableData) {
    return {
      question: "happiness的名词后缀是_____",
      correctAnswer: "ness",
      analysis: "happiness的名词后缀是ness"
    };
  },

  convertNoun002(tableData) {
    return {
      question: "book的复数形式是_____",
      correctAnswer: "books",
      analysis: "book的复数形式是books"
    };
  },

  convertAdjective001(tableData) {
    return {
      question: "big的比较级是_____",
      correctAnswer: "bigger",
      analysis: "big的比较级是bigger"
    };
  },

  convertAdjective002(tableData) {
    return {
      question: "big的最高级是_____",
      correctAnswer: "biggest",
      analysis: "big的最高级是biggest"
    };
  },

  convertVerb001(tableData) {
    return {
      question: "go的过去式是_____",
      correctAnswer: "went",
      analysis: "go的过去式是went"
    };
  },

  convertVerb002(tableData) {
    return {
      question: "go的过去分词是_____",
      correctAnswer: "gone",
      analysis: "go的过去分词是gone"
    };
  },

  // 获取备用练习题目
  getFallbackExercise(tableId) {
    const fallbackExercises = {
      "pronoun_table_001": {
        question: "我的主格是_____",
        correctAnswer: "I",
        analysis: "第一人称单数'我'的主格是I"
      },
      "pronoun_table_002": {
        question: "你的宾格是_____",
        correctAnswer: "you",
        analysis: "第二人称'你'的宾格是you"
      },
      "pronoun_table_003": {
        question: "我的形容词性物主代词是_____",
        correctAnswer: "my",
        analysis: "第一人称单数'我'的形容词性物主代词是my"
      },
      "preposition_table_001": {
        question: "用于小地点(具体位置点)的介词是_____",
        correctAnswer: "at",
        analysis: "用于小地点(具体位置点)的介词是at"
      },
      "preposition_table_003": {
        question: "紧挨着的介词是_____",
        correctAnswer: "next to",
        analysis: "表示'紧挨着'的介词是next to"
      },
      "tense_writing_001": {
        question: "一般现在时的动词形式1是_____",
        correctAnswer: "work",
        analysis: "一般现在时第一人称单数用动词原形work"
      },
      "voice_writing_001": {
        question: "write（一般现在时原形）的主动语态是_____",
        correctAnswer: "I write a letter",
        analysis: "write的主动语态是I write a letter"
      },
      "voice_writing_002": {
        question: "write（一般现在时原形）的被动语态是_____",
        correctAnswer: "A letter is written by me",
        analysis: "write的被动语态是A letter is written by me"
      },
      "noun_001": {
        question: "happiness的名词后缀是_____",
        correctAnswer: "ness",
        analysis: "happiness的名词后缀是ness"
      },
      "noun_002": {
        question: "book的复数形式是_____",
        correctAnswer: "books",
        analysis: "book的复数形式是books"
      },
      "adjective_001": {
        question: "big的比较级是_____",
        correctAnswer: "bigger",
        analysis: "big的比较级是bigger"
      },
      "adjective_002": {
        question: "big的最高级是_____",
        correctAnswer: "biggest",
        analysis: "big的最高级是biggest"
      },
      "verb_001": {
        question: "go的过去式是_____",
        correctAnswer: "went",
        analysis: "go的过去式是went"
      },
      "verb_002": {
        question: "go的过去分词是_____",
        correctAnswer: "gone",
        analysis: "go的过去分词是gone"
      }
    };

    return fallbackExercises[tableId] || {
      question: "请根据表格填写正确的答案",
      correctAnswer: "example",
      analysis: "这是一个示例题目"
    };
  },

  // 输入变化
  onInputChange(e) {
    this.setData({
      userAnswer: e.detail.value
    });
  },

  // 提交答案
  submitAnswer() {
    if (!this.data.userAnswer.trim()) {
      wx.showToast({
        title: '请输入答案',
        icon: 'none'
      });
      return;
    }

    const isCorrect = this.data.userAnswer.trim().toLowerCase() === 
                     this.data.currentExercise.correctAnswer.toLowerCase();
    
    this.setData({
      isCorrect: isCorrect,
      showAnswer: true
    });

    // 保存答案记录
    this.saveAnswer(isCorrect);
  },

  // 保存答案记录
  saveAnswer(isCorrect) {
    const progress = { ...this.data.testProgress };
    const exerciseId = `${this.data.currentTable}_${Date.now()}`;
    
    progress[exerciseId] = {
      table: this.data.currentTable,
      question: this.data.currentExercise.question,
      userAnswer: this.data.userAnswer,
      correctAnswer: this.data.currentExercise.correctAnswer,
      isCorrect: isCorrect,
      timestamp: Date.now()
    };
    
    this.setData({ testProgress: progress });
    wx.setStorageSync('writingTestProgress', progress);
    
    // 更新进度
    this.loadTestProgress();
  },

  // 下一题
  nextExercise() {
    this.setData({
      showAnswer: false,
      userAnswer: '',
      isCorrect: false,
      loading: true
    });
    
    setTimeout(() => {
      this.loadNextExercise();
    }, 500);
  },

  // 显示测试完成
  showTestComplete() {
    wx.showActionSheet({
      itemList: ['查看能力图谱', '进行更全面的书写能力测试（24题）', '开始语法测试'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0: // 查看能力图谱
            wx.redirectTo({
              url: '/pages/ability-test/ability-map'
            });
            break;
          case 1: // 进行更全面的书写能力测试
            wx.redirectTo({
              url: '/pages/ability-test/comprehensive-writing-test'
            });
            break;
          case 2: // 开始语法测试
            wx.redirectTo({
              url: '/pages/ability-test/grammar-test'
            });
            break;
        }
      }
    });
  },

  // 保存并退出
  saveAndExit() {
    wx.showModal({
      title: '保存进度',
      content: '确定要保存当前进度并退出吗？下次可以继续测试。',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack();
        }
      }
    });
  },

  // 重测当前表格
  retestTable() {
    wx.showModal({
      title: '重测表格',
      content: `确定要重测"${this.data.currentTable}"表格吗？`,
      success: (res) => {
        if (res.confirm) {
          // 清除该表格的测试记录
          const progress = { ...this.data.testProgress };
          Object.keys(progress).forEach(key => {
            if (progress[key].table === this.data.currentTable) {
              delete progress[key];
            }
          });
          
          this.setData({ testProgress: progress });
          wx.setStorageSync('writingTestProgress', progress);
          
          // 重新加载题目
          this.loadTestProgress();
          this.loadNextExercise();
        }
      }
    });
  },

  // 显示能力图谱
  showAbilityMap() {
    wx.navigateTo({
      url: '/pages/ability-test/ability-map'
    });
  },

  // 显示进度模态框
  showProgressModal() {
    this.setData({
      showProgressModal: true
    });
  },

  // 隐藏进度模态框
  hideProgressModal() {
    this.setData({
      showProgressModal: false
    });
  }
});
