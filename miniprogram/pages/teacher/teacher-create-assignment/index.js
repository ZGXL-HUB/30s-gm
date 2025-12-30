// 教师端作业创建页面

Page({
  data: {
    // 基础信息
    assignmentTitle: '',
    assignmentDescription: '',
    deadline: '',
    deadlineDate: '',
    deadlineTime: '',
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
    console.log('教师端作业创建页面加载');
    this.loadGrammarPoints();
    this.loadGrammarPointHistory();
  },

  // 加载语法点列表
  async loadGrammarPoints() {
    try {
      wx.showLoading({ title: '加载中...' });
      
      // 直接使用默认语法点，避免云函数调用错误
      const defaultGrammarPoints = [
        { id: '定语从句', name: '定语从句', questionCount: 15, selected: false },
        { id: '非谓语动词', name: '非谓语动词', questionCount: 12, selected: false },
        { id: '时态语态', name: '时态语态', questionCount: 20, selected: false },
        { id: '虚拟语气', name: '虚拟语气', questionCount: 8, selected: false },
        { id: '名词性从句', name: '名词性从句', questionCount: 10, selected: false },
        { id: '状语从句', name: '状语从句', questionCount: 18, selected: false },
        { id: '情态动词', name: '情态动词', questionCount: 14, selected: false },
        { id: '被动语态', name: '被动语态', questionCount: 16, selected: false }
      ];
      
      this.setData({ availableGrammarPoints: defaultGrammarPoints });
      console.log('使用默认语法点:', defaultGrammarPoints);
      
      wx.hideLoading();
    } catch (error) {
      console.error('加载语法点失败:', error);
      wx.hideLoading();
    }
  },

  // 加载语法点历史信息
  async loadGrammarPointHistory() {
    try {
      // 获取教师ID（从本地存储或登录信息）
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      // 暂时使用模拟数据，避免云函数调用错误
      const mockHistory = {
        '定语从句': {
          daysAgo: 3,
          classAccuracy: 75,
          accuracyClass: 'medium'
        },
        '非谓语动词': {
          daysAgo: 7,
          classAccuracy: 60,
          accuracyClass: 'low'
        },
        '时态语态': {
          daysAgo: 1,
          classAccuracy: 85,
          accuracyClass: 'high'
        }
      };
      
      this.setData({ grammarPointHistory: mockHistory });
      console.log('使用模拟语法点历史数据:', mockHistory);
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

  // 设置截止日期
  setDeadlineDate(e) {
    const date = e.detail.value;
    console.log('设置截止日期:', date);
    
    this.setData({ deadlineDate: date });
    this.updateDeadline();
  },

  // 设置截止时间
  setDeadlineTime(e) {
    const time = e.detail.value;
    console.log('设置截止时间:', time);
    
    this.setData({ deadlineTime: time });
    this.updateDeadline();
  },

  // 更新完整的截止时间
  updateDeadline() {
    const { deadlineDate, deadlineTime } = this.data;
    
    if (deadlineDate && deadlineTime) {
      const deadline = `${deadlineDate} ${deadlineTime}`;
      this.setData({ deadline: deadline });
      console.log('完整截止时间:', deadline);
    }
  },

  // 选择语法点
  selectGrammarPoint(e) {
    const grammarPointId = e.currentTarget.dataset.id;
    console.log('选择语法点:', grammarPointId);
    
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
    
    // 计算已选语法点的题目总数
    let totalQuestions = 0;
    for (const point of selectedPoints) {
      const grammarPoint = this.data.availableGrammarPoints.find(p => p.id === point);
      if (grammarPoint) {
        totalQuestions += grammarPoint.questionCount;
      }
    }
    
    this.setData({ questionCount: totalQuestions });
    console.log('已选语法点:', selectedPoints, '题目总数:', totalQuestions);
  },

  // 设置变式题模式
  setVariantMode(e) {
    const mode = e.detail.value;
    this.setData({ variantMode: mode });
    
    if (mode === 'manual') {
      this.setData({ showVariantSettings: true });
    } else {
      this.setData({ showVariantSettings: false });
    }
  },

  // 设置变式题规则
  setVariantRule(e) {
    const rule = e.currentTarget.dataset.rule;
    const value = e.detail.value;
    const variantRules = { ...this.data.variantRules };
    variantRules[rule] = parseInt(value) || 0;
    this.setData({ variantRules });
  },

  // 一键添加上次错题
  async addLastMistakes() {
    try {
      wx.showLoading({ title: '获取错题中...' });
      
      // 暂时使用模拟数据，避免云函数调用错误
      const mockMistakes = [
        { grammarPoint: '定语从句', questionId: 'q1', studentId: 's1' },
        { grammarPoint: '定语从句', questionId: 'q2', studentId: 's2' },
        { grammarPoint: '非谓语动词', questionId: 'q3', studentId: 's1' },
        { grammarPoint: '时态语态', questionId: 'q4', studentId: 's3' },
        { grammarPoint: '时态语态', questionId: 'q5', studentId: 's2' }
      ];
      
      // 按语法点分组错题
      const mistakesByGrammar = {};
      mockMistakes.forEach(mistake => {
        if (!mistakesByGrammar[mistake.grammarPoint]) {
          mistakesByGrammar[mistake.grammarPoint] = [];
        }
        mistakesByGrammar[mistake.grammarPoint].push(mistake);
      });
      
      // 显示错题统计
      this.showMistakeStats(mistakesByGrammar);
      
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
      
      // 创建作业数据
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      const newAssignment = {
        _id: `assignment_${Date.now()}`,
        title: assignmentTitle,
        description: assignmentDescription,
        teacherId: teacherId,
        questions: questionIds,
        deadline: deadline,
        variantMode: variantMode,
        variantRules: variantRules,
        status: 'active',
        createdAt: new Date().toISOString(),
        questionCount: questionIds.length,
        studentCount: 0,
        completionRate: 0,
        averageAccuracy: 0
      };
      
      // 保存到本地存储
      const existingAssignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
      existingAssignments.unshift(newAssignment); // 添加到开头
      wx.setStorageSync(`assignments_${teacherId}`, existingAssignments);
      
      // 同时为学生端添加作业
      this.addAssignmentToStudents(newAssignment);
      
      console.log('作业创建成功:', newAssignment);
      
      // 成功响应
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
    
    // 生成模拟题目ID
    for (const point of grammarPoints) {
      const grammarPoint = this.data.availableGrammarPoints.find(p => p.id === point);
      if (grammarPoint) {
        // 为每个语法点生成模拟题目ID
        for (let i = 1; i <= Math.min(grammarPoint.questionCount, 10); i++) {
          questionIds.push(`${point}_q${i}`);
        }
      }
    }
    
    console.log('生成的题目ID列表:', questionIds);
    return questionIds;
  },

  // 关闭预览
  closePreview() {
    this.setData({ showPreview: false });
  },

  // 防止弹窗内容点击时关闭弹窗
  preventClose() {
    // 空方法，用于阻止事件冒泡
  },

  // 为学生端添加作业
  addAssignmentToStudents(assignment) {
    // 模拟学生ID列表
    const studentIds = ['student_123', 'student_456', 'student_789'];
    
    studentIds.forEach(studentId => {
      const studentAssignment = {
        ...assignment,
        status: 'pending',
        studentAccuracy: null,
        completedAt: null
      };
      
      const existingStudentAssignments = wx.getStorageSync(`student_assignments_${studentId}`) || [];
      existingStudentAssignments.unshift(studentAssignment);
      wx.setStorageSync(`student_assignments_${studentId}`, existingStudentAssignments);
    });
    
    console.log('作业已添加到学生端');
  }
});
