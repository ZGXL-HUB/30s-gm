Page({
  data: {
    selectedDifficulty: '',
    selectedMode: '',
    completedQuestions: 0,
    totalQuestions: 1000,
    progressPercent: 0,
    accuracyRate: 0,
    recentPractices: []
  },

  onLoad: function (options) {
    // 页面加载时初始化数据
    this.initializeData();
  },

  onShow: function () {
    // 页面显示时更新数据
    this.updateStatistics();
  },

  // 初始化数据
  initializeData: function() {
    // 设置默认难度为中级
    this.setData({
      selectedDifficulty: 'intermediate',
      selectedMode: 'quick'
    });
    
    // 加载统计数据
    this.updateStatistics();
    
    // 加载最近练习记录
    this.loadRecentPractices();
  },

  // 更新统计数据
  updateStatistics: function() {
    try {
      // 从本地存储获取练习记录
      const practiceHistory = wx.getStorageSync('practiceHistory') || [];
      const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
      
      // 计算已完成题目数
      const completedQuestions = practiceHistory.reduce((total, practice) => {
        return total + (practice.total || 0);
      }, 0);
      
      // 计算正确率
      const totalAnswered = practiceHistory.reduce((total, practice) => {
        return total + (practice.total || 0);
      }, 0);
      
      const totalCorrect = practiceHistory.reduce((total, practice) => {
        return total + (practice.correct || 0);
      }, 0);
      
      const accuracyRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
      
      // 计算进度百分比
      const progressPercent = Math.min((completedQuestions / this.data.totalQuestions) * 100, 100);
      
      this.setData({
        completedQuestions,
        accuracyRate,
        progressPercent
      });
      
    } catch (error) {
      console.error('更新统计数据失败:', error);
    }
  },

  // 加载最近练习记录
  loadRecentPractices: function() {
    try {
      const practiceHistory = wx.getStorageSync('practiceHistory') || [];
      
      // 取最近5条记录
      const recentPractices = practiceHistory
        .slice(-5)
        .reverse()
        .map(practice => ({
          id: practice.id || Date.now(),
          title: practice.title || '综合练习',
          correct: practice.correct || 0,
          total: practice.total || 0,
          score: practice.score || 0,
          date: practice.date || new Date().toLocaleDateString()
        }));
      
      this.setData({ recentPractices });
      
    } catch (error) {
      console.error('加载最近练习记录失败:', error);
    }
  },

  // 选择难度
  selectDifficulty: function(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    this.setData({ selectedDifficulty: difficulty });
  },

  // 选择模式
  selectMode: function(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ selectedMode: mode });
  },

  // 开始练习
  startPractice: function() {
    const { selectedDifficulty, selectedMode } = this.data;
    
    if (!selectedDifficulty || !selectedMode) {
      wx.showToast({
        title: '请选择难度和模式',
        icon: 'none'
      });
      return;
    }

    // 根据模式确定题目数量
    let questionCount = 10;
    if (selectedMode === 'comprehensive') {
      questionCount = 20;
    } else if (selectedMode === 'challenge') {
      questionCount = 15;
    }

    // 生成综合练习题目
    this.generateComprehensiveQuestions(selectedDifficulty, selectedMode, questionCount);
  },

  // 生成综合练习题目
  generateComprehensiveQuestions: function(difficulty, mode, count) {
    wx.showLoading({
      title: '生成题目中...'
    });

    try {
      // 加载题库
      let questionsData;
      switch(difficulty) {
        case 'beginner':
          questionsData = require('../../data/intermediate_questions.js'); // 暂时使用中级题库
          break;
        case 'advanced':
          questionsData = require('../../data/intermediate_questions.js'); // 暂时使用中级题库
          break;
        default:
          questionsData = require('../../data/intermediate_questions.js');
      }

      // 检查题库数据是否有效
      if (!questionsData || typeof questionsData !== 'object') {
        throw new Error('题库数据格式错误');
      }

      // 获取所有可用的语法点
      const allPoints = Object.keys(questionsData);
      
      // 检查是否有可用的语法点
      if (allPoints.length === 0) {
        throw new Error('题库中没有可用的语法点');
      }
      
      // 随机选择多个语法点
      const selectedPoints = this.getRandomPoints(allPoints, Math.min(5, allPoints.length));
      
      // 从选中的语法点中随机抽取题目
      const questions = [];
      const questionsPerPoint = Math.ceil(count / selectedPoints.length);
      
      selectedPoints.forEach(point => {
        const pointQuestions = questionsData[point] || [];
        const randomQuestions = this.getRandomQuestions(pointQuestions, questionsPerPoint);
        questions.push(...randomQuestions);
      });

      // 随机打乱题目顺序
      const shuffledQuestions = this.shuffleArray(questions.slice(0, count));

      wx.hideLoading();

      // 跳转到练习页面
      const practiceTitle = `${this.getDifficultyName(difficulty)} - ${this.getModeName(mode)}`;
      const url = `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(shuffledQuestions))}&level=${difficulty}&mode=${mode}&title=${encodeURIComponent(practiceTitle)}`;
      
      wx.navigateTo({
        url: url
      });

    } catch (error) {
      wx.hideLoading();
      console.error('生成题目失败:', error);
      wx.showToast({
        title: '生成题目失败',
        icon: 'none'
      });
    }
  },

  // 开始推荐练习
  startRecommendedPractice: function(e) {
    const type = e.currentTarget.dataset.type;
    
    if (type === 'weak') {
      // 基于错题的薄弱语法点练习
      this.startWeakPointPractice();
    } else if (type === 'mixed') {
      // 混合练习
      this.startMixedPractice();
    }
  },

  // 开始薄弱语法点练习
  startWeakPointPractice: function() {
    try {
      const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
      
      if (wrongQuestions.length === 0) {
        wx.showModal({
          title: '提示',
          content: '暂无错题记录，建议先完成一些练习',
          showCancel: false
        });
        return;
      }

      // 分析错题中的语法点
      const weakPoints = this.analyzeWeakPoints(wrongQuestions);
      
      if (weakPoints.length === 0) {
        wx.showToast({
          title: '分析错题失败',
          icon: 'none'
        });
        return;
      }

      // 生成针对薄弱语法点的练习
      this.generateWeakPointQuestions(weakPoints);
      
    } catch (error) {
      console.error('开始薄弱语法点练习失败:', error);
      wx.showToast({
        title: '启动练习失败',
        icon: 'none'
      });
    }
  },

  // 开始混合练习
  startMixedPractice: function() {
    // 使用中级难度的综合模式
    this.setData({
      selectedDifficulty: 'intermediate',
      selectedMode: 'comprehensive'
    });
    
    this.generateComprehensiveQuestions('intermediate', 'comprehensive', 20);
  },

  // 分析薄弱语法点
  analyzeWeakPoints: function(wrongQuestions) {
    const pointCounts = {};
    
    wrongQuestions.forEach(question => {
      const category = question.category || '未知';
      pointCounts[category] = (pointCounts[category] || 0) + 1;
    });
    
    // 按错题数量排序，取前3个（排除"综合"分类）
    return Object.entries(pointCounts)
      .filter(([category]) => category !== '综合' && category !== '综合练习' && category !== '其他' && category !== '未知')
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([point]) => point);
  },

  // 生成薄弱语法点题目
  generateWeakPointQuestions: function(weakPoints) {
    wx.showLoading({
      title: '生成题目中...'
    });

    try {
      const questionsData = require('../../data/intermediate_questions.js');
      
      // 检查题库数据是否有效
      if (!questionsData || typeof questionsData !== 'object') {
        throw new Error('题库数据格式错误');
      }

      const questions = [];
      
      weakPoints.forEach(point => {
        const pointQuestions = questionsData[point] || [];
        if (pointQuestions.length > 0) {
          const randomQuestions = this.getRandomQuestions(pointQuestions, 7);
          questions.push(...randomQuestions);
        }
      });

      if (questions.length === 0) {
        throw new Error('无法找到相关题目');
      }

      const shuffledQuestions = this.shuffleArray(questions);
      
      wx.hideLoading();
      
      const url = `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(shuffledQuestions))}&level=intermediate&mode=weak&title=${encodeURIComponent('薄弱语法点练习')}`;
      
      wx.navigateTo({
        url: url
      });
      
    } catch (error) {
      wx.hideLoading();
      console.error('生成薄弱语法点题目失败:', error);
      wx.showToast({
        title: '生成题目失败',
        icon: 'none'
      });
    }
  },

  // 工具方法：随机选择语法点
  getRandomPoints: function(points, count) {
    const shuffled = [...points].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  // 工具方法：随机选择题目
  getRandomQuestions: function(questions, count) {
    if (questions.length <= count) return questions;
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  // 工具方法：打乱数组
  shuffleArray: function(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // 获取难度名称
  getDifficultyName: function(difficulty) {
    const names = {
      'beginner': '初级',
      'intermediate': '中级',
      'advanced': '高级'
    };
    return names[difficulty] || '中级';
  },

  // 获取模式名称
  getModeName: function(mode) {
    const names = {
      'quick': '快速练习',
      'comprehensive': '综合练习',
      'challenge': '挑战模式'
    };
    return names[mode] || '快速练习';
  }
}); 