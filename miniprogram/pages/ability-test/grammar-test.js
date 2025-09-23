// 重测我的语法水平页面
const grammarTestSets = require('../../data/grammar_test_sets.js');

Page({
  data: {
    // 测试状态
    testState: 'welcome', // welcome, testing, result
    currentQuestionIndex: 0,
    
    // 题目数据
    questions: [],
    
    // 用户答案
    userAnswers: [],
    
    // 测试结果
    testResults: {
      correctCount: 0,
      totalQuestions: 0,
      correctRate: 0,
      level: '',
      recommendation: '',
      suggestion: ''
    },
    
    // 当前题目
    currentQuestion: null,
    userAnswer: '',
    showAnswer: false,
    isCorrect: false,
    
    // 进度条
    progress: 0,
    totalQuestions: 2,
    
    // 显示解析
    showAnalysis: false,
    
    // 显示报告
    showReport: false
  },

  onLoad() {
    this.initTest();
  },

  // 初始化测试
  initTest() {
    this.selectQuestions();
  },

  // 选择题目 - 从两个20套语法测试题库中随机抽取各一题
  selectQuestions() {
    // 从第一套语法测试题库中随机选择一套题目
    const firstSetIndex = Math.floor(Math.random() * grammarTestSets.length);
    const firstSet = grammarTestSets[firstSetIndex];
    
    // 从第二套语法测试题库中随机选择另一套题目（确保不同）
    let secondSetIndex;
    do {
      secondSetIndex = Math.floor(Math.random() * grammarTestSets.length);
    } while (secondSetIndex === firstSetIndex);
    const secondSet = grammarTestSets[secondSetIndex];
    
    // 从第一套中随机抽取一题
    const firstQuestion = firstSet.questions[Math.floor(Math.random() * firstSet.questions.length)];
    
    // 从第二套中随机抽取一题
    const secondQuestion = secondSet.questions[Math.floor(Math.random() * secondSet.questions.length)];
    
    // 转换为测试需要的格式
    const formattedQuestions = [
      {
        id: `grammar_${firstSetIndex}_0`,
        text: firstQuestion.text,
        options: firstQuestion.option,
        correctAnswer: firstQuestion.answer,
        analysis: firstQuestion.analysis,
        tag: firstQuestion.tag,
        setInfo: firstSet.name,
        setIndex: firstSetIndex
      },
      {
        id: `grammar_${secondSetIndex}_1`,
        text: secondQuestion.text,
        options: secondQuestion.option,
        correctAnswer: secondQuestion.answer,
        analysis: secondQuestion.analysis,
        tag: secondQuestion.tag,
        setInfo: secondSet.name,
        setIndex: secondSetIndex
      }
    ];
    
    this.setData({
      questions: formattedQuestions,
      totalQuestions: 2
    });
    
    console.log(`已从${firstSet.name}和${secondSet.name}中各随机抽取1道语法选择题`);
  },

  // 开始测试
  startTest() {
    this.setData({
      testState: 'testing',
      currentQuestionIndex: 0,
      progress: 0
    });
    this.showCurrentQuestion();
  },

  // 显示当前题目
  showCurrentQuestion() {
    const { questions, currentQuestionIndex } = this.data;
    if (currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      
      this.setData({
        currentQuestion: question,
        userAnswer: '',
        showAnswer: false,
        isCorrect: false
      });
    } else {
      // 测试完成，计算结果
      this.calculateResults();
    }
  },

  // 选择答案
  selectOption(e) {
    console.log('=== 选项被点击了 ===');
    console.log('事件对象:', e);
    
    const option = e.currentTarget.dataset.option;
    console.log('选中的选项:', option);
    
    // 立即显示点击确认
    wx.showToast({
      title: '选项已选择',
      icon: 'success',
      duration: 500
    });
    
    this.setData({
      userAnswer: option
    });
    
    // 自动提交答案
    setTimeout(() => {
      this.submitAnswer();
    }, 800);
  },

  // 提交答案
  submitAnswer() {
    console.log('=== 提交答案 ===');
    console.log('用户答案:', this.data.userAnswer);
    console.log('当前题目:', this.data.currentQuestion);
    
    if (!this.data.userAnswer.trim()) {
      console.log('用户答案为空');
      wx.showToast({
        title: '请选择答案',
        icon: 'none'
      });
      return;
    }

    const { currentQuestion, userAnswer, currentQuestionIndex, questions } = this.data;
    const isCorrect = userAnswer.trim() === currentQuestion.correctAnswer;
    
    console.log('正确答案:', currentQuestion.correctAnswer);
    console.log('是否正确:', isCorrect);
    
    // 保存答案
    const userAnswers = [...this.data.userAnswers];
    userAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      selectedAnswer: userAnswer.trim(),
      isCorrect: isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
      question: currentQuestion.text,
      analysis: currentQuestion.analysis,
      tag: currentQuestion.tag,
      setInfo: currentQuestion.setInfo
    };
    
    this.setData({
      userAnswers: userAnswers,
      isCorrect: isCorrect,
      showAnswer: true
    });
    
    // 更新进度
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    this.setData({ progress: progress });
    
    // 延迟进入下一题
    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  },

  // 下一题
  nextQuestion() {
    const { currentQuestionIndex, questions } = this.data;
    this.setData({
      currentQuestionIndex: currentQuestionIndex + 1
    });
    this.showCurrentQuestion();
  },

  // 计算测试结果
  calculateResults() {
    const { userAnswers, questions } = this.data;
    
    // 计算正确数
    const correctCount = userAnswers.filter(answer => answer && answer.isCorrect).length;
    const totalQuestions = questions.length;
    const correctRate = (correctCount / totalQuestions) * 100;
    
    // 计算等级
    const level = this.calculateLevel(correctRate);
    
    // 生成推荐和建议
    const { recommendation, suggestion } = this.generateRecommendation(correctRate);
    
    this.setData({
      testResults: {
        correctCount,
        totalQuestions,
        correctRate: Math.round(correctRate * 10) / 10,
        level,
        recommendation,
        suggestion
      },
      testState: 'result'
    });
  },

  // 计算等级
  calculateLevel(correctRate) {
    if (correctRate >= 100) return 'level5';
    if (correctRate >= 80) return 'level4';
    if (correctRate >= 60) return 'level3';
    if (correctRate >= 40) return 'level2';
    return 'level1';
  },

  // 生成推荐和建议
  generateRecommendation(correctRate) {
    let recommendation, suggestion;
    
    if (correctRate > 81) {
      recommendation = '系统推荐模块';
      suggestion = '建议搭配主页的进阶之旅，更快发现薄弱点，将薄弱点放进专属组合每天练，下个语法大神就是你';
    } else if (correctRate > 61) {
      recommendation = '进阶之旅';
      suggestion = '建议每周突破一个小点，超稳的';
    } else if (correctRate > 41) {
      recommendation = '进阶之旅';
      suggestion = '建议每周突破一个小点，超稳的';
    } else {
      recommendation = '书写规范（界面二）';
      suggestion = '建议每周练会一个表格，配上您的绝佳理解力，前期稳后续进步会超快';
    }
    
    return { recommendation, suggestion };
  },

  // 查看解析
  viewAnalysis() {
    this.setData({
      showAnalysis: true,
      showReport: false
    });
  },

  // 查看报告
  viewReport() {
    this.setData({
      showReport: true,
      showAnalysis: false
    });
  },

  // 保存错题到每日任务
  saveToDailyTask() {
    const { userAnswers, testResults } = this.data;
    const wrongQuestions = userAnswers.filter(answer => answer && !answer.isCorrect);
    
    // 保存测试结果到本地存储，添加时间戳
    const grammarTestResults = {
      ...testResults,
      timestamp: Date.now()
    };
    wx.setStorageSync('grammarTestResults', grammarTestResults);
    console.log('重测语法水平结果已保存:', grammarTestResults);
    
    if (wrongQuestions.length === 0) {
      wx.showToast({
        title: '没有错题需要保存',
        icon: 'none'
      });
      
      // 延迟返回主界面
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
      return;
    }
    
    // 保存错题到本地存储
    const dailyTasks = wx.getStorageSync('dailyTasks') || [];
    const newTasks = wrongQuestions.map(q => ({
      id: `daily_${Date.now()}_${Math.random()}`,
      type: 'grammar',
      question: q.question,
      correctAnswer: q.correctAnswer,
      userAnswer: q.selectedAnswer,
      analysis: q.analysis,
      tag: q.tag,
      setInfo: q.setInfo,
      timestamp: Date.now(),
      completed: false
    }));
    
    dailyTasks.push(...newTasks);
    wx.setStorageSync('dailyTasks', dailyTasks);
    
    wx.showToast({
      title: `已保存${wrongQuestions.length}道错题到每日任务`,
      icon: 'success'
    });
    
    // 延迟返回主界面
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }, 1500);
  },

  // 重新测试
  retest() {
    this.setData({
      testState: 'welcome',
      currentQuestionIndex: 0,
      userAnswers: [],
      progress: 0,
      showAnalysis: false,
      showReport: false
    });
    this.selectQuestions();
  },

  // 返回首页
  goHome() {
    // 保存测试结果到本地存储，添加时间戳
    const { testResults } = this.data;
    const grammarTestResults = {
      ...testResults,
      timestamp: Date.now()
    };
    wx.setStorageSync('grammarTestResults', grammarTestResults);
    console.log('重测语法水平结果已保存:', grammarTestResults);
    
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 跳转到反馈页面
  goToFeedback(e) {
    const type = e.currentTarget.dataset.type;
    const context = e.currentTarget.dataset.context;
    
    // 构建反馈页面URL，传递上下文信息
    let url = '/pages/feedback/index';
    if (type && context) {
      url += `?type=${type}&context=${context}`;
    }
    
    wx.navigateTo({
      url: url
    });
  },

  // 强制选择选项（用于测试）
  forceSelectOption(e) {
    console.log('=== 强制选择选项 ===');
    console.log('按钮点击事件:', e);
    
    const option = e.currentTarget.dataset.option;
    console.log('强制选择选项:', option);
    
    // 立即显示点击确认
    wx.showToast({
      title: '选项已选择',
      icon: 'success',
      duration: 500
    });
    
    this.setData({
      userAnswer: option
    });
    
    // 自动提交答案
    setTimeout(() => {
      this.submitAnswer();
    }, 800);
  },

  // 跳转到推荐练习
  goToRecommendedPractice() {
    // 根据测试结果跳转到相应的练习页面
    const level = this.data.testResults.level;
    if (level === 'level1' || level === 'level2') {
      // 基础水平，跳转到系统组合
      wx.switchTab({
        url: '/pages/index/index'
      });
    } else {
      // 中高级水平，跳转到专属组合
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 跳转到每日推荐
  goToDailyRecommendation() {
    wx.navigateTo({
      url: '/pages/daily-cards/index'
    });
  },

  // 跳转到书写测试
  goToWritingTest() {
    wx.navigateTo({
      url: '/pages/ability-test/writing-test'
    });
  }
});
