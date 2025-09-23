// 能力图谱页面
Page({
  data: {
    grammarProgress: {},
    writingProgress: {},
    overallScore: 0,
    grammarScore: 0,
    writingScore: 0,
    totalGrammarPoints: 12,
    totalWritingTables: 14,
    testedGrammarPoints: 0,
    testedWritingTables: 0,
    grammarCategories: [
      "介词", "代词", "连词", "冠词", "名词", "动词",
      "谓语", "非谓语", "形容词", "副词", "定语从句", "状语和从句"
    ],
    writingTables: [
      "pronoun_table_001", "pronoun_table_002", "pronoun_table_003",
      "preposition_table_001", "preposition_table_003",
      "tense_writing_001", "voice_writing_001", "voice_writing_002",
      "noun_001", "noun_002", "adjective_001", "adjective_002",
      "verb_001", "verb_002"
    ],
    categoryScores: {},
    tableScores: {},
    loading: true,
    showDetailModal: false,
    showContinueModal: false,
    hasIncompleteTests: false,
    incompleteGrammarCount: 0,
    incompleteWritingCount: 0
  },

  onLoad() {
    this.loadAbilityData();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadAbilityData();
  },

  // 加载能力数据
  loadAbilityData() {
    const grammarProgress = wx.getStorageSync('grammarTestProgress') || {};
    const writingProgress = wx.getStorageSync('writingTestProgress') || {};
    
    // 计算语法测试分数
    const grammarScore = this.calculateGrammarScore(grammarProgress);
    const testedGrammarPoints = this.calculateTestedGrammarPoints(grammarProgress);
    
    // 计算书写测试分数
    const writingScore = this.calculateWritingScore(writingProgress);
    const testedWritingTables = this.calculateTestedWritingTables(writingProgress);
    
    // 计算总体分数
    const overallScore = this.calculateOverallScore(grammarScore, writingScore);
    
    // 计算各分类分数
    const categoryScores = this.calculateCategoryScores(grammarProgress);
    const tableScores = this.calculateTableScores(writingProgress);
    
    // 计算未完成的测试数量
    const incompleteGrammarCount = this.data.totalGrammarPoints - testedGrammarPoints;
    const incompleteWritingCount = this.data.totalWritingTables - testedWritingTables;
    const hasIncompleteTests = incompleteGrammarCount > 0 || incompleteWritingCount > 0;
    
    this.setData({
      grammarProgress,
      writingProgress,
      grammarScore,
      writingScore,
      overallScore,
      testedGrammarPoints,
      testedWritingTables,
      categoryScores,
      tableScores,
      incompleteGrammarCount,
      incompleteWritingCount,
      hasIncompleteTests,
      loading: false
    });
  },

  // 计算语法测试分数
  calculateGrammarScore(progress) {
    if (Object.keys(progress).length === 0) return 0;
    
    let correctCount = 0;
    let totalCount = 0;
    
    Object.keys(progress).forEach(key => {
      const record = progress[key];
      if (record.isCorrect !== undefined) {
        totalCount++;
        if (record.isCorrect) {
          correctCount++;
        }
      }
    });
    
    return totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  },

  // 计算已测试的语法点数量
  calculateTestedGrammarPoints(progress) {
    const testedCategories = new Set();
    Object.keys(progress).forEach(key => {
      const record = progress[key];
      if (record.category) {
        testedCategories.add(record.category);
      }
    });
    return testedCategories.size;
  },

  // 计算书写测试分数
  calculateWritingScore(progress) {
    if (Object.keys(progress).length === 0) return 0;
    
    let correctCount = 0;
    let totalCount = 0;
    
    Object.keys(progress).forEach(key => {
      const record = progress[key];
      if (record.isCorrect !== undefined) {
        totalCount++;
        if (record.isCorrect) {
          correctCount++;
        }
      }
    });
    
    return totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  },

  // 计算已测试的书写表格数量
  calculateTestedWritingTables(progress) {
    const testedTables = new Set();
    Object.keys(progress).forEach(key => {
      const record = progress[key];
      if (record.table) {
        testedTables.add(record.table);
      }
    });
    return testedTables.size;
  },

  // 计算总体分数
  calculateOverallScore(grammarScore, writingScore) {
    // 如果两个测试都完成了，取平均值；否则返回已完成的测试分数
    if (this.data.testedGrammarPoints > 0 && this.data.testedWritingTables > 0) {
      return Math.round((grammarScore + writingScore) / 2);
    } else if (this.data.testedGrammarPoints > 0) {
      return grammarScore;
    } else if (this.data.testedWritingTables > 0) {
      return writingScore;
    }
    return 0;
  },

  // 计算各分类分数
  calculateCategoryScores(progress) {
    const categoryScores = {};
    
    this.data.grammarCategories.forEach(category => {
      const categoryRecords = Object.keys(progress).filter(key => 
        progress[key].category === category
      );
      
      if (categoryRecords.length > 0) {
        let correctCount = 0;
        categoryRecords.forEach(key => {
          if (progress[key].isCorrect) {
            correctCount++;
          }
        });
        
        categoryScores[category] = Math.round((correctCount / categoryRecords.length) * 100);
      } else {
        categoryScores[category] = -1; // 未测试
      }
    });
    
    return categoryScores;
  },

  // 计算各表格分数
  calculateTableScores(progress) {
    const tableScores = {};
    
    this.data.writingTables.forEach(table => {
      const tableRecords = Object.keys(progress).filter(key => 
        progress[key].table === table
      );
      
      if (tableRecords.length > 0) {
        let correctCount = 0;
        tableRecords.forEach(key => {
          if (progress[key].isCorrect) {
            correctCount++;
          }
        });
        
        tableScores[table] = Math.round((correctCount / tableRecords.length) * 100);
      } else {
        tableScores[table] = -1; // 未测试
      }
    });
    
    return tableScores;
  },

  // 获取分数等级
  getScoreLevel(score) {
    if (score >= 90) return { level: '优秀', color: '#4CAF50', icon: '🏆' };
    if (score >= 80) return { level: '良好', color: '#8BC34A', icon: '🥈' };
    if (score >= 70) return { level: '中等', color: '#FFC107', icon: '🥉' };
    if (score >= 60) return { level: '及格', color: '#FF9800', icon: '📝' };
    if (score >= 0) return { level: '需加强', color: '#f44336', icon: '💪' };
    return { level: '未测试', color: '#9e9e9e', icon: '⏳' };
  },

  // 开始语法测试
  startGrammarTest() {
    wx.navigateTo({
      url: '/pages/ability-test/grammar-test'
    });
  },

  // 跳转到书写测试页面
  navigateToWritingTest() {
    wx.navigateTo({
      url: '/pages/ability-test/writing-test'
    });
  },

  // 开始书写测试
  startWritingTest() {
    wx.navigateTo({
      url: '/pages/ability-test/writing-test'
    });
  },

  // 重测所有
  retestAll() {
    wx.showModal({
      title: '重测确认',
      content: '确定要清除所有测试记录并重新开始吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('grammarTestProgress');
          wx.removeStorageSync('writingTestProgress');
          this.loadAbilityData();
          wx.showToast({
            title: '已清除测试记录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 返回主页
  goBack() {
    wx.navigateBack();
  },

  // 显示详情模态框
  showDetailModal() {
    this.setData({
      showDetailModal: true
    });
  },

  // 隐藏详情模态框
  hideDetailModal() {
    this.setData({
      showDetailModal: false
    });
  },

  // 显示继续完成模态框
  showContinueModal() {
    this.setData({
      showContinueModal: true
    });
  },

  // 隐藏继续完成模态框
  hideContinueModal() {
    this.setData({
      showContinueModal: false
    });
  },

  // 继续语法测试
  continueGrammarTest() {
    this.hideContinueModal();
    wx.navigateTo({
      url: '/pages/ability-test/grammar-test'
    });
  },

  // 继续书写测试
  continueWritingTest() {
    this.hideContinueModal();
    wx.navigateTo({
      url: '/pages/ability-test/writing-test'
    });
  }
});
