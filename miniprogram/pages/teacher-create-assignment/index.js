// 教师端作业创建页面
const cloud = require('wx-server-sdk');

Page({
  data: {
    // 基础信息
    assignmentTitle: '',
    assignmentDescription: '',
    deadline: '',
    variantMode: 'auto', // auto, manual, none
    
    // 题目选择
    selectedGrammarPoints: [],
    selectedQuestions: [],
    availableGrammarPoints: [],
    questionCount: 0,
    
    // 变式题设置
    variantRules: {
      "75": 5,  // 75%以上错误率给5题变式
      "50": 4,  // 50%以上错误率给4题变式
      "25": 3,  // 25%以上错误率给3题变式
      "0": 2    // 25%以下错误率给2题变式
    },
    
    // 历史信息
    grammarPointHistory: {},
    
    // 界面状态
    loading: false,
    showVariantSettings: false,
    showPreview: false,
    previewData: null
  },

  onLoad() {
    this.loadGrammarPoints();
    this.loadGrammarPointHistory();
  },

  // 加载语法点列表
  async loadGrammarPoints() {
    try {
      wx.showLoading({ title: '加载中...' });
      
      // 从云数据库获取语法点
      const result = await wx.cloud.callFunction({
        name: 'getQuestionsData',
        data: { type: 'categories' }
      });
      
      if (result.result.success) {
        const grammarPoints = result.result.data.map(category => ({
          id: category,
          name: category,
          questionCount: 0, // 后续可以统计题目数量
          selected: false
        }));
        
        this.setData({ availableGrammarPoints: grammarPoints });
      }
      
      wx.hideLoading();
    } catch (error) {
      console.error('加载语法点失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 加载语法点历史信息
  async loadGrammarPointHistory() {
    try {
      // 获取教师ID（从本地存储或登录信息）
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      const result = await wx.cloud.callFunction({
        name: 'getGrammarPointHistory',
        data: { teacherId: teacherId }
      });
      
      if (result.result.success) {
        this.setData({ grammarPointHistory: result.result.data });
      }
    } catch (error) {
      console.error('加载语法点历史失败:', error);
    }
  },

  // 设置作业标题
  setAssignmentTitle(e) {
    this.setData({ assignmentTitle: e.detail.value });
  },

  // 设置作业描述
  setAssignmentDescription(e) {
    this.setData({ assignmentDescription: e.detail.value });
  },

  // 设置截止时间
  setDeadline(e) {
    this.setData({ deadline: e.detail.value });
  },

  // 选择语法点
  selectGrammarPoint(e) {
    const grammarPointId = e.currentTarget.dataset.id;
    const grammarPoints = this.data.availableGrammarPoints.map(point => {
      if (point.id === grammarPointId) {
        return { ...point, selected: !point.selected };
      }
      return point;
    });
    
    this.setData({ availableGrammarPoints: grammarPoints });
    this.updateSelectedQuestions();
  },

  // 更新已选题目
  async updateSelectedQuestions() {
    const selectedPoints = this.data.availableGrammarPoints
      .filter(point => point.selected)
      .map(point => point.id);
    
    this.setData({ selectedGrammarPoints: selectedPoints });
    
    // 获取每个语法点的题目数量
    let totalQuestions = 0;
    for (const point of selectedPoints) {
      try {
        const result = await wx.cloud.callFunction({
          name: 'getQuestionsData',
          data: { 
            type: 'questions',
            category: point,
            limit: 100
          }
        });
        
        if (result.result.success) {
          totalQuestions += result.result.data.length;
        }
      } catch (error) {
        console.error(`获取${point}题目失败:`, error);
      }
    }
    
    this.setData({ questionCount: totalQuestions });
  },

  // 设置变式题模式
  setVariantMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ variantMode: mode });
    
    if (mode === 'manual') {
      this.setData({ showVariantSettings: true });
    } else {
      this.setData({ showVariantSettings: false });
    }
  },

  // 设置变式题规则
  setVariantRule(e) {
    const { rule, value } = e.currentTarget.dataset;
    const variantRules = { ...this.data.variantRules };
    variantRules[rule] = parseInt(value);
    this.setData({ variantRules });
  },

  // 一键添加上次错题
  async addLastMistakes() {
    try {
      wx.showLoading({ title: '获取错题中...' });
      
      const result = await wx.cloud.callFunction({
        name: 'getStudentMistakes',
        data: { 
          studentId: 'all', // 获取所有学生的错题
          timeRange: 7 // 最近7天
        }
      });
      
      if (result.result.success) {
        const mistakes = result.result.data;
        // 按语法点分组错题
        const mistakesByGrammar = {};
        mistakes.forEach(mistake => {
          if (!mistakesByGrammar[mistake.grammarPoint]) {
            mistakesByGrammar[mistake.grammarPoint] = [];
          }
          mistakesByGrammar[mistake.grammarPoint].push(mistake);
        });
        
        // 显示错题统计
        this.showMistakeStats(mistakesByGrammar);
      }
      
      wx.hideLoading();
    } catch (error) {
      console.error('获取错题失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '获取错题失败',
        icon: 'none'
      });
    }
  },

  // 显示错题统计
  showMistakeStats(mistakesByGrammar) {
    let content = '学生错题统计：\n\n';
    Object.entries(mistakesByGrammar).forEach(([grammarPoint, mistakes]) => {
      content += `${grammarPoint}: ${mistakes.length}题错题\n`;
    });
    
    wx.showModal({
      title: '错题统计',
      content: content,
      confirmText: '添加错题',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.addMistakeQuestions(mistakesByGrammar);
        }
      }
    });
  },

  // 添加错题到作业
  addMistakeQuestions(mistakesByGrammar) {
    const selectedPoints = Object.keys(mistakesByGrammar);
    const grammarPoints = this.data.availableGrammarPoints.map(point => {
      if (selectedPoints.includes(point.id)) {
        return { ...point, selected: true };
      }
      return point;
    });
    
    this.setData({ availableGrammarPoints: grammarPoints });
    this.updateSelectedQuestions();
    
    wx.showToast({
      title: '错题已添加',
      icon: 'success'
    });
  },

  // 预览作业
  previewAssignment() {
    const { assignmentTitle, selectedGrammarPoints, questionCount, variantMode } = this.data;
    
    if (!assignmentTitle) {
      wx.showToast({
        title: '请输入作业标题',
        icon: 'none'
      });
      return;
    }
    
    if (selectedGrammarPoints.length === 0) {
      wx.showToast({
        title: '请选择语法点',
        icon: 'none'
      });
      return;
    }
    
    const previewData = {
      title: assignmentTitle,
      description: this.data.assignmentDescription,
      deadline: this.data.deadline,
      grammarPoints: selectedGrammarPoints,
      questionCount: questionCount,
      variantMode: variantMode,
      variantRules: this.data.variantRules
    };
    
    this.setData({ 
      previewData: previewData,
      showPreview: true 
    });
  },

  // 创建作业
  async createAssignment() {
    const { assignmentTitle, assignmentDescription, deadline, selectedGrammarPoints, variantMode, variantRules } = this.data;
    
    if (!assignmentTitle || !deadline || selectedGrammarPoints.length === 0) {
      wx.showToast({
        title: '请完善作业信息',
        icon: 'none'
      });
      return;
    }
    
    try {
      this.setData({ loading: true });
      
      // 获取题目ID列表
      const questionIds = await this.getQuestionIds(selectedGrammarPoints);
      
      // 调用云函数创建作业
      const result = await wx.cloud.callFunction({
        name: 'createAssignment',
        data: {
          teacherId: wx.getStorageSync('teacherId') || 'teacher_123',
          title: assignmentTitle,
          description: assignmentDescription,
          questions: questionIds,
          deadline: deadline,
          variantMode: variantMode,
          variantRules: variantRules
        }
      });
      
      if (result.result.success) {
        wx.showToast({
          title: '作业创建成功',
          icon: 'success'
        });
        
        // 跳转到作业管理页面
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/teacher-assignment-list/index'
          });
        }, 1500);
      } else {
        wx.showToast({
          title: result.result.error || '创建失败',
          icon: 'none'
        });
      }
      
      this.setData({ loading: false });
    } catch (error) {
      console.error('创建作业失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '创建失败',
        icon: 'none'
      });
    }
  },

  // 获取题目ID列表
  async getQuestionIds(grammarPoints) {
    const questionIds = [];
    
    for (const point of grammarPoints) {
      try {
        const result = await wx.cloud.callFunction({
          name: 'getQuestionsData',
          data: { 
            type: 'questions',
            category: point,
            limit: 50 // 每个语法点最多50题
          }
        });
        
        if (result.result.success) {
          const questions = result.result.data;
          questions.forEach(question => {
            questionIds.push(question._id);
          });
        }
      } catch (error) {
        console.error(`获取${point}题目失败:`, error);
      }
    }
    
    return questionIds;
  },

  // 关闭预览
  closePreview() {
    this.setData({ showPreview: false });
  }
});
