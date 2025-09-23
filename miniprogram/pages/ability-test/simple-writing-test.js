// 简易版书写能力测试页面
const { writingExerciseQuestions } = require('../../writing_exercise_questions.js');

Page({
  data: {
    questions: [],
    currentQuestionIndex: 0,
    currentQuestion: null,
    userAnswers: {},
    testState: 'welcome', // welcome, testing, result
    score: 0,
    totalQuestions: 12,
    showAnswer: false,
    userAnswer: '',
    isCorrect: false,
    testComplete: false,
    loading: true,
    userLevel: '', // 用户分层结果
    recommendation: '', // 推荐学习路径
    weakPoints: [], // 薄弱环节
    correctCount: 0
  },

  onLoad() {
    this.loadTestData();
  },

  // 加载测试数据
  loadTestData() {
    // 从现有题目中抽取12道题，涵盖6个核心表格
    const selectedQuestions = this.selectQuestionsFromExisting();
    
    this.setData({
      questions: selectedQuestions,
      currentQuestion: selectedQuestions[0],
      loading: false
    });
  },

  // 从现有题目中选择12道题
  selectQuestionsFromExisting() {
    const selectedQuestions = [];
    const questionPools = [
      // 代词书写 - 2题
      writingExerciseQuestions.pronoun_001.slice(0, 2),
      // 名词变复数 - 2题  
      writingExerciseQuestions.noun_001.slice(0, 1),
      writingExerciseQuestions.noun_004.slice(0, 1),
      // 动词分词书写 - 2题
      writingExerciseQuestions.present_participle_001.slice(0, 1),
      writingExerciseQuestions.past_participle_001.slice(0, 1),
      // 时态书写 - 2题
      writingExerciseQuestions.tense_writing_001.slice(0, 2),
      // 语态书写 - 2题
      writingExerciseQuestions.voice_writing_001.slice(0, 1),
      writingExerciseQuestions.voice_writing_002.slice(0, 1),
      // 比较级最高级书写 - 2题
      writingExerciseQuestions.comparison_comparative_001.slice(0, 1),
      writingExerciseQuestions.comparison_superlative_001.slice(0, 1),
      // 形容词变副词书写 - 2题
      writingExerciseQuestions.adverb_writing_001.slice(0, 2)
    ];

    // 展平并选择题目
    questionPools.forEach(pool => {
      pool.forEach(question => {
        if (selectedQuestions.length < 12) {
          selectedQuestions.push({
            ...question,
            id: selectedQuestions.length + 1,
            tags: [question.table_id],
            difficulty: this.getDifficultyByCategory(question.category)
          });
        }
      });
    });

    return selectedQuestions;
  },

  // 根据分类确定难度
  getDifficultyByCategory(category) {
    const difficultyMap = {
      '代词书写': 'easy',
      '名词变复数': 'medium', 
      '动词分词书写': 'medium',
      '时态书写': 'medium',
      '语态书写': 'hard',
      '比较级最高级书写': 'medium',
      '形容词变副词书写': 'medium'
    };
    return difficultyMap[category] || 'medium';
  },

  // 开始测试
  startTest() {
    this.setData({
      testState: 'testing'
    });
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
                     this.data.currentQuestion.answer.toLowerCase();
    
    this.setData({
      isCorrect: isCorrect,
      showAnswer: true
    });

    // 保存用户答案
    const userAnswers = { ...this.data.userAnswers };
    userAnswers[this.data.currentQuestion.id] = {
      answer: this.data.userAnswer,
      isCorrect: isCorrect,
      question: this.data.currentQuestion
    };
    
    this.setData({ userAnswers });
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
        isCorrect: false
      });
    }
  },

  // 完成测试
  completeTest() {
    // 计算得分
    const correctCount = Object.values(this.data.userAnswers).filter(answer => answer.isCorrect).length;
    const score = Math.round((correctCount / this.data.totalQuestions) * 100);
    
    // 分析薄弱环节
    const weakPoints = this.analyzeWeakPoints();
    
    // 确定用户分层
    const userLevel = this.determineUserLevel(score);
    
    // 生成推荐学习路径
    const recommendation = this.generateRecommendation(score, weakPoints);
    
    this.setData({
      testState: 'result',
      score: score,
      correctCount: correctCount,
      testComplete: true,
      userLevel: userLevel,
      recommendation: recommendation,
      weakPoints: weakPoints
    });

    // 保存测试结果
    this.saveTestResult(score, userLevel, weakPoints);
  },

  // 分析薄弱环节
  analyzeWeakPoints() {
    const weakPoints = [];
    const tagCount = {};
    
    // 统计各标签的错误率
    Object.values(this.data.userAnswers).forEach(answer => {
      if (!answer.isCorrect && answer.question.tags) {
        answer.question.tags.forEach(tag => {
          if (!tagCount[tag]) {
            tagCount[tag] = { total: 0, wrong: 0 };
          }
          tagCount[tag].total++;
          tagCount[tag].wrong++;
        });
      } else if (answer.isCorrect && answer.question.tags) {
        answer.question.tags.forEach(tag => {
          if (!tagCount[tag]) {
            tagCount[tag] = { total: 0, wrong: 0 };
          }
          tagCount[tag].total++;
        });
      }
    });
    
    // 找出错误率超过50%的标签
    Object.keys(tagCount).forEach(tag => {
      const errorRate = tagCount[tag].wrong / tagCount[tag].total;
      if (errorRate > 0.5) {
        weakPoints.push({
          tag: tag,
          errorRate: errorRate,
          errorRatePercent: Math.round(errorRate * 100),
          name: this.getTagName(tag)
        });
      }
    });
    
    return weakPoints;
  },

  // 获取标签名称
  getTagName(tag) {
    const tagNames = {
      'pronoun_table_001': '人称代词主格宾格',
      'pronoun_table_002': '形容词性物主代词',
      'pronoun_table_003': '名词性物主代词反身代词',
      'noun_001': '名词复数规则',
      'noun_002': '名词复数特殊变化',
      'tense_writing_001': '时态书写',
      'adjective_001': '形容词比较级最高级',
      'adjective_002': '形容词变副词',
      'preposition_table_001': '常见介词',
      'preposition_table_002': '介词固定搭配',
      'preposition_table_003': '介词后加动词ing',
      'voice_writing_001': '语态书写',
      'voice_writing_002': '语态转换'
    };
    return tagNames[tag] || tag;
  },

  // 确定用户分层
  determineUserLevel(score) {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 60) return 'pass';
    return 'fail';
  },

  // 生成推荐学习路径
  generateRecommendation(score, weakPoints) {
    if (score >= 85) {
      return {
        level: '高级用户',
        message: '书写能力优秀！您已掌握大部分书写规范。',
        suggestion: '可以进入高级练习或帮助其他用户。',
        nextSteps: ['进入综合练习', '自由组合语法专题', '高考模拟练习']
      };
    } else if (score >= 70) {
      return {
        level: '中级用户',
        message: '书写能力良好，还有提升空间。',
        suggestion: '建议重点练习薄弱环节的表格。',
        nextSteps: ['针对性练习薄弱环节', '进入进阶之旅', '每周突破一个小点']
      };
    } else if (score >= 60) {
      return {
        level: '初级用户',
        message: '书写能力基本合格，需要加强练习。',
        suggestion: '建议系统学习相关表格内容。',
        nextSteps: ['系统学习相关表格', '从基础开始巩固', '定期复习练习']
      };
    } else {
      return {
        level: '基础用户',
        message: '书写能力需要大幅提升。',
        suggestion: '建议从基础表格开始系统学习。',
        nextSteps: ['从基础表格开始', '每周练会一个表格', '配合理解力提升']
      };
    }
  },

  // 保存测试结果
  saveTestResult(score, userLevel, weakPoints) {
    const testResult = {
      score: score,
      totalQuestions: this.data.totalQuestions,
      userAnswers: this.data.userAnswers,
      userLevel: userLevel,
      weakPoints: weakPoints,
      recommendation: this.data.recommendation,
      timestamp: Date.now(),
      testType: 'simple_writing'
    };
    
    wx.setStorageSync('simpleWritingTestResult', testResult);
  },

  // 查看详细报告
  viewDetailedReport() {
    const result = this.data;
    const reportContent = `
测试结果：${result.score}分
用户等级：${result.recommendation.level}
${result.recommendation.message}

${result.recommendation.suggestion}

薄弱环节：
${result.weakPoints.length > 0 ? result.weakPoints.map(point => `• ${point.name} (错误率: ${Math.round(point.errorRate * 100)}%)`).join('\n') : '无特别薄弱环节'}

建议学习路径：
${result.recommendation.nextSteps.map(step => `• ${step}`).join('\n')}
    `;
    
    wx.showModal({
      title: '详细测试报告',
      content: reportContent,
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
        source: 'simple_test'
      });
    });
    
    wx.setStorageSync('dailyTasks', dailyTasks);
    
    wx.showToast({
      title: `已保存${wrongQuestions.length}道错题`,
      icon: 'success'
    });
  },

  // 进入进阶之旅
  enterAdvancedJourney() {
    wx.navigateTo({
      url: '/pages/ability-test/writing-test'
    });
  },

  // 进入综合练习
  enterComprehensivePractice() {
    wx.navigateTo({
      url: '/pages/ability-test/comprehensive-writing-test'
    });
  },

  // 进入书写规范界面
  enterWritingStandards() {
    wx.navigateTo({
      url: '/pages/grammar-writing/index'
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
            userLevel: '',
            recommendation: '',
            weakPoints: []
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
