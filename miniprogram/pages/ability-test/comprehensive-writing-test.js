// 全面版书写能力测试页面
Page({
  data: {
    questions: [],
    currentQuestionIndex: 0,
    currentQuestion: null,
    userAnswers: {},
    testState: 'welcome', // welcome, testing, result
    score: 0,
    totalQuestions: 24,
    showAnswer: false,
    userAnswer: '',
    isCorrect: false,
    testComplete: false,
    loading: true,
    correctCount: 0,
    emptyAnswerCount: 0, // 空答案计数
    canGoBack: false // 是否可以返回上一题
  },

  onLoad() {
    this.loadTestData();
    this.checkTestProgress();
  },

  onShow() {
    // 页面显示时检查是否需要恢复测试进度
    this.checkTestProgress();
  },

  // 加载测试数据
  loadTestData() {
    // 从JS模块加载完整数据
    const testData = require('../../data/comprehensive_writing_test.js');
    
    console.log('加载的测试数据:', testData);
    console.log('题目数量:', testData.questions ? testData.questions.length : 0);
    if (testData.questions && testData.questions.length > 0) {
      console.log('第一题数据:', testData.questions[0]);
      console.log('第一题选项:', testData.questions[0].options);
    }

    this.setData({
      questions: testData.questions,
      currentQuestion: testData.questions[0],
      loading: false
    });
  },

  // 开始测试
  startTest() {
    this.setData({
      testState: 'testing'
    });
  },

  // 选择答案
  selectOption(e) {
    if (this.data.showAnswer) return;
    
    const option = e.currentTarget.dataset.option;
    const questionId = this.data.currentQuestion.id;
    
    // 处理空答案情况
    if (!option || option.trim() === '') {
      console.log('用户点击了空白处，将作为空答案处理');
      this.handleEmptyAnswer();
      return;
    }
    
    const isCorrect = option === this.data.currentQuestion.correctAnswer;
    
    this.setData({
      userAnswer: option,
      showAnswer: true,
      isCorrect: isCorrect
    });

    // 保存用户答案
    const userAnswers = { ...this.data.userAnswers };
    userAnswers[questionId] = {
      answer: option,
      isCorrect: isCorrect,
      question: this.data.currentQuestion,
      isEmpty: false
    };
    
    this.setData({ userAnswers });
    
    // 如果答错了，显示错误处理选项
    if (!isCorrect) {
      this.handleWrongAnswer(option);
    }
  },

  // 处理空答案
  handleEmptyAnswer() {
    const questionId = this.data.currentQuestion.id;
    
    // 显示空答案提示
    wx.showModal({
      title: '空答案提示',
      content: '您没有选择答案，将默认记为答错。确定要继续吗？',
      confirmText: '确定',
      cancelText: '重新选择',
      success: (res) => {
        if (res.confirm) {
          // 用户确认空答案
          this.setData({
            userAnswer: '',
            showAnswer: true,
            isCorrect: false,
            emptyAnswerCount: this.data.emptyAnswerCount + 1
          });

          // 保存空答案
          const userAnswers = { ...this.data.userAnswers };
          userAnswers[questionId] = {
            answer: '',
            isCorrect: false,
            question: this.data.currentQuestion,
            isEmpty: true
          };
          
          this.setData({ userAnswers });
          
          // 空答案也按错误处理
          this.handleWrongAnswer('');
        }
        // 如果用户取消，不做任何操作，让用户重新选择
      }
    });
  },

  // 处理答错情况
  handleWrongAnswer(userAnswer) {
    const question = this.data.currentQuestion;
    const relatedTables = this.getRelatedTables(question.tags);
    
    if (relatedTables.length === 0) {
      // 没有相关表格，直接继续
      this.recordError(question, userAnswer, []);
      return;
    }
    
    const tableNames = relatedTables.map(t => t.name).join('、');
    
    wx.showModal({
      title: '答错了，要立即练习吗？',
      content: `这道题涉及：${tableNames}\n\n您可以选择立即练习相关表格，或继续测试稍后练习。`,
      confirmText: '立即练习',
      cancelText: '继续测试',
      success: (res) => {
        if (res.confirm) {
          // 跳转到第一个相关表格进行练习
          this.jumpToTablePractice(relatedTables[0].id);
        } else {
          // 记录错误，继续测试
          this.recordError(question, userAnswer, relatedTables);
        }
      }
    });
  },

  // 获取相关表格信息
  getRelatedTables(tags) {
    const testData = require('../../data/comprehensive_writing_test.js');
    const tableMapping = testData.tableMapping;
    const relatedTables = [];
    
    tags.forEach(tag => {
      if (tableMapping[tag]) {
        relatedTables.push({
          id: tag,
          name: tableMapping[tag].name,
          description: tableMapping[tag].description
        });
      }
    });
    
    return relatedTables;
  },

  // 跳转到表格练习
  jumpToTablePractice(tableId) {
    // 先保存当前测试进度
    this.saveTestProgress();
    
    // 跳转到书写规范界面，并指定要练习的表格
    wx.navigateTo({
      url: `/pages/grammar-writing/index?practiceTable=${tableId}`,
      success: () => {
        wx.showToast({
          title: '已跳转到相关表格练习',
          icon: 'success'
        });
      },
      fail: (error) => {
        console.error('跳转失败:', error);
        wx.showToast({
          title: '跳转失败，请手动进入书写规范界面',
          icon: 'none'
        });
      }
    });
  },

  // 记录错误信息
  recordError(question, userAnswer, relatedTables) {
    const errorRecord = {
      questionId: question.id,
      userAnswer: userAnswer,
      correctAnswer: question.correctAnswer,
      relatedTables: relatedTables.map(t => t.id),
      timestamp: Date.now(),
      testType: 'comprehensive_writing'
    };
    
    // 保存到本地存储
    const errors = wx.getStorageSync('writingErrors') || [];
    errors.push(errorRecord);
    wx.setStorageSync('writingErrors', errors);
    
    // 更新表格错误统计
    this.updateTableErrorStats(relatedTables);
  },

  // 更新表格错误统计
  updateTableErrorStats(relatedTables) {
    const errorStats = wx.getStorageSync('errorStats') || {};
    
    relatedTables.forEach(table => {
      if (!errorStats[table.id]) {
        errorStats[table.id] = {
          count: 0,
          lastError: null,
          tableName: table.name
        };
      }
      errorStats[table.id].count += 1;
      errorStats[table.id].lastError = Date.now();
    });
    
    wx.setStorageSync('errorStats', errorStats);
    
    // 更新错误表格列表
    const errorTables = wx.getStorageSync('errorTables') || [];
    relatedTables.forEach(table => {
      if (!errorTables.includes(table.id)) {
        errorTables.push(table.id);
      }
    });
    wx.setStorageSync('errorTables', errorTables);
  },

  // 保存测试进度
  saveTestProgress() {
    const progress = {
      currentQuestionIndex: this.data.currentQuestionIndex,
      userAnswers: this.data.userAnswers,
      testType: 'comprehensive_writing',
      timestamp: Date.now()
    };
    wx.setStorageSync('testProgress', progress);
  },

  // 检查测试进度
  checkTestProgress() {
    const progress = wx.getStorageSync('testProgress');
    if (progress && progress.testType === 'comprehensive_writing') {
      // 检查进度是否过期（超过1小时）
      const now = Date.now();
      const progressAge = now - progress.timestamp;
      const oneHour = 60 * 60 * 1000;
      
      if (progressAge < oneHour) {
        // 恢复测试进度
        this.setData({
          currentQuestionIndex: progress.currentQuestionIndex,
          currentQuestion: this.data.questions[progress.currentQuestionIndex],
          userAnswers: progress.userAnswers,
          testState: 'testing',
          canGoBack: progress.currentQuestionIndex > 0
        });
        
        // 恢复当前题目的答案显示
        const questionId = this.data.currentQuestion.id;
        const savedAnswer = progress.userAnswers[questionId];
        if (savedAnswer) {
          this.setData({
            userAnswer: savedAnswer.answer,
            showAnswer: true,
            isCorrect: savedAnswer.isCorrect
          });
        }
        
        wx.showToast({
          title: '已恢复测试进度',
          icon: 'success'
        });
      } else {
        // 进度过期，清除
        wx.removeStorageSync('testProgress');
      }
    }
  },

  // 下一题
  nextQuestion() {
    const nextIndex = this.data.currentQuestionIndex + 1;
    
    if (nextIndex >= this.data.totalQuestions) {
      // 测试完成
      this.completeTest();
    } else {
      this.setData({
        currentQuestionIndex: nextIndex,
        currentQuestion: this.data.questions[nextIndex],
        showAnswer: false,
        userAnswer: '',
        isCorrect: false,
        canGoBack: nextIndex > 0 // 不是第一题时可以返回
      });
    }
  },

  // 返回上一题
  prevQuestion() {
    if (this.data.currentQuestionIndex <= 0) {
      wx.showToast({
        title: '已经是第一题了',
        icon: 'none'
      });
      return;
    }

    const prevIndex = this.data.currentQuestionIndex - 1;
    this.setData({
      currentQuestionIndex: prevIndex,
      currentQuestion: this.data.questions[prevIndex],
      showAnswer: false,
      userAnswer: '',
      isCorrect: false,
      canGoBack: prevIndex > 0
    });

    // 恢复之前保存的答案
    const questionId = this.data.currentQuestion.id;
    const savedAnswer = this.data.userAnswers[questionId];
    if (savedAnswer) {
      this.setData({
        userAnswer: savedAnswer.answer,
        showAnswer: true,
        isCorrect: savedAnswer.isCorrect
      });
    }
  },

  // 完成测试
  completeTest() {
    // 计算得分
    const correctCount = Object.values(this.data.userAnswers).filter(answer => answer.isCorrect).length;
    const score = Math.round((correctCount / this.data.totalQuestions) * 100);
    
    // 清除测试进度
    wx.removeStorageSync('testProgress');
    
    // 分析错误表格
    const errorTables = this.analyzeErrorTables();
    
    this.setData({
      testState: 'result',
      score: score,
      correctCount: correctCount,
      testComplete: true,
      errorTables: errorTables
    });

    // 保存测试结果
    this.saveTestResult(score);
    
    // 生成学习计划
    this.saveLearningPlan();
    
    // 如果有错误表格，显示建议
    if (errorTables.length > 0) {
      this.showErrorRecommendations(errorTables);
    }
  },

  // 分析错误表格
  analyzeErrorTables() {
    const errorStats = wx.getStorageSync('errorStats') || {};
    const errorTables = [];
    
    Object.keys(errorStats).forEach(tableId => {
      const stats = errorStats[tableId];
      if (stats.count > 0) {
        errorTables.push({
          id: tableId,
          name: stats.tableName,
          errorCount: stats.count,
          lastError: stats.lastError
        });
      }
    });
    
    // 按错误次数排序
    return errorTables.sort((a, b) => b.errorCount - a.errorCount);
  },

  // 显示错误建议
  showErrorRecommendations(errorTables) {
    const topErrors = errorTables.slice(0, 3);
    const tableNames = topErrors.map(t => t.name).join('、');
    
    setTimeout(() => {
      wx.showModal({
        title: '发现薄弱环节',
        content: `您在以下表格上出错较多：\n${tableNames}\n\n建议重点练习这些表格以提高书写能力。`,
        confirmText: '开始练习',
        cancelText: '稍后练习',
        success: (res) => {
          if (res.confirm) {
            this.jumpToTablePractice(topErrors[0].id);
          } else {
            // 用户选择稍后练习，设置复习提醒
            this.setReviewReminder(errorTables);
          }
        }
      });
    }, 1000);
  },

  // 设置复习提醒
  setReviewReminder(errorTables) {
    const reminder = {
      errorTables: errorTables,
      timestamp: Date.now(),
      nextReviewTime: Date.now() + (24 * 60 * 60 * 1000), // 24小时后提醒
      reminderSet: true
    };
    
    wx.setStorageSync('reviewReminder', reminder);
    
    wx.showToast({
      title: '已设置复习提醒',
      icon: 'success'
    });
  },

  // 生成智能学习计划
  generateLearningPlan() {
    const errorStats = wx.getStorageSync('errorStats') || {};
    const plan = {
      daily: [],
      weekly: [],
      priority: []
    };
    
    // 按错误次数排序
    const sortedTables = Object.entries(errorStats)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5);
    
    // 生成每日练习计划（前3个错误最多的表格）
    plan.daily = sortedTables.slice(0, 3).map(([tableId, stats]) => ({
      tableId,
      name: stats.tableName,
      priority: 'high',
      duration: '15分钟',
      reason: `错误${stats.count}次`
    }));
    
    // 生成每周练习计划（所有错误表格）
    plan.weekly = sortedTables.map(([tableId, stats]) => ({
      tableId,
      name: stats.tableName,
      frequency: stats.count > 2 ? '每天' : '每周2次',
      duration: stats.count > 2 ? '20分钟' : '10分钟'
    }));
    
    // 优先级排序
    plan.priority = sortedTables.map(([tableId, stats], index) => ({
      tableId,
      name: stats.tableName,
      priority: index + 1,
      urgency: stats.count > 3 ? '紧急' : stats.count > 1 ? '重要' : '一般'
    }));
    
    return plan;
  },

  // 保存学习计划
  saveLearningPlan() {
    const plan = this.generateLearningPlan();
    wx.setStorageSync('learningPlan', plan);
    
    console.log('学习计划已生成:', plan);
    return plan;
  },

  // 保存测试结果
  saveTestResult(score) {
    const testResult = {
      score: score,
      totalQuestions: this.data.totalQuestions,
      userAnswers: this.data.userAnswers,
      timestamp: Date.now(),
      testType: 'comprehensive_writing'
    };
    
    wx.setStorageSync('comprehensiveWritingTestResult', testResult);
  },

  // 查看解析
  viewAnalysis() {
    wx.showModal({
      title: '测试解析',
      content: '这里将显示详细的题目解析和错误分析',
      showCancel: false
    });
  },

  // 查看报告
  viewReport() {
    wx.showModal({
      title: '测试报告',
      content: '这里将显示完整的能力评估报告和练习建议',
      showCancel: false
    });
  },

  // 保存错题到每日任务
  saveWrongQuestions() {
    const wrongQuestions = Object.values(this.data.userAnswers)
      .filter(answer => !answer.isCorrect)
      .map(answer => answer.question);
    
    if (wrongQuestions.length === 0) {
      wx.showToast({
        title: '没有错题需要保存',
        icon: 'none'
      });
      return;
    }

    // 保存错题到每日任务
    const dailyTasks = wx.getStorageSync('dailyTasks') || [];
    wrongQuestions.forEach(question => {
      dailyTasks.push({
        type: 'writing_practice',
        question: question,
        timestamp: Date.now(),
        source: 'comprehensive_test'
      });
    });
    
    wx.setStorageSync('dailyTasks', dailyTasks);
    
    wx.showToast({
      title: `已保存${wrongQuestions.length}道错题`,
      icon: 'success'
    });
  },

  // 重新测试
  retakeTest() {
    wx.showModal({
      title: '重新测试',
      content: '确定要重新开始测试吗？当前进度将丢失。',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            currentQuestionIndex: 0,
            currentQuestion: this.data.questions[0],
            userAnswers: {},
            testState: 'testing',
            showAnswer: false,
            userAnswer: '',
            isCorrect: false,
            testComplete: false,
            score: 0,
            emptyAnswerCount: 0,
            canGoBack: false
          });
        }
      }
    });
  },

  // 返回主页
  goHome() {
    wx.navigateBack();
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
  }
});

