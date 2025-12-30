const { envList } = require("../../envList");
const { QuickStartPoints, QuickStartSteps } = require("./constants");
// 引入云数据加载器
const cloudDataLoader = require('../../utils/cloudDataLoader.js');

Page({
  data: {
    showGuide: false,
    isCustomComboSet: false,
    customComboCount: 0,
    hasWrongQuestions: false,
    wrongQuestionsCount: 0,
    todayStats: {
      grammarCount: 0,
      writingCount: 0,
      wrongQuestionCount: 0
    },
    progressWidth: '0%',
    // 每日任务相关数据
    streakDays: 0,
    todayProgress: 0,
    // 学习计划相关数据
    learningPlan: null,
    hasLearningPlan: false,
    reviewReminder: null,
    // 新增：弹窗相关数据
    showModuleModal: false,
    currentModule: {},
    // 新增：语法功能大厅弹窗
    showGrammarHallModal: false,
    // 新增：选择卡片相关数据
    showSelectionCard: false,
    selectedModule: 'module1', // 当前选中的模块：'module1' 或 'module2'
    selectedCategories: [], // 选中的语法大类
    // 模块配置
    moduleConfigs: {
      system: {
        icon: '🎯',
        title: '系统组合',
        description: '贴近高考语法题配比的十道题',
        actions: [
          {
            text: '快速练习',
            type: 'primary',
            handler: 'startSystemComboQuick'
          },
          {
            text: '调整',
            type: 'secondary',
            handler: 'goToGrammarSelect'
          }
        ],
        // 新增：选择卡片配置
        selectionCard: {
          module1: {
            title: '高考常见配比',
            description: '十道题',
            type: 'single',
            selected: true
          },
          module2: {
            title: '选择语法大类',
            description: '可多选',
            categories: [
              "介词", "代词", "连词", "冠词", "名词", "动词",
              "谓语", "非谓语", "形容词", "副词", "定语从句", "状语和从句"
            ],
            selected: []
          }
        }
      },
      custom: {
        icon: '⚙️',
        title: '专属组合',
        description: '自定义语法点组合，个性化练习',
        actions: [
          {
            text: '快速练习',
            type: 'primary',
            handler: 'startCustomComboQuick',
            disabled: false
          },
          {
            text: '设置',
            type: 'secondary',
            handler: 'goToCustomComboSetting'
          }
        ]
      },
      wrong: {
        icon: '❌',
        title: '错题特训',
        description: '智能分析错题模式，生成针对性变式训练',
        actions: [
          {
            text: '错题变式',
            type: 'primary',
            handler: 'startWrongQuestionVariant',
            disabled: false
          },
          {
            text: '消灭错题',
            type: 'secondary',
            handler: 'goToWrongQuestionEliminate'
          }
        ]
      },
      photo: {
        icon: '📸',
        title: '拍照选题',
        description: '拍照识别语法点，快速找到同类题\n🚀 智能识别，即将上线',
        actions: [
          {
            text: '敬请期待',
            type: 'disabled',
            handler: 'showComingSoon'
          }
        ]
      },
      grammar: {
        icon: '📚',
        title: '语法分点',
        description: '自由选择语法点，无限制组合练习',
        actions: [
          {
            text: '开始练习',
            type: 'primary',
            handler: 'goToGrammarSelect'
          }
        ]
      },
      advanced: {
        icon: '🚀',
        title: '进阶之旅',
        description: '个性化学习推荐，根据你的练习记录提供针对性的学习内容',
        actions: [
          {
            text: '开始练习',
            type: 'secondary',
            handler: 'goToGrammarSelect'
          }
        ]
      }
    }
  },

  onLoad() {
    // 检查是否是首次启动
    const hasLaunched = wx.getStorageSync('hasLaunched');
    if (!hasLaunched) {
      this.setData({ showGuide: true });
      wx.setStorageSync('hasLaunched', true);
    }
    
    // 检查专属组合是否已设置
    this.checkCustomComboStatus();
    
    // 加载每日任务数据
    this.loadDailyMissionData();
    
    // 初始化学习计划
    this.initLearningPlan();
  },

  onShow() {
    console.log('主页面显示，开始更新统计...');
    
    // 每次显示页面时重新检查专属组合状态
    this.checkCustomComboStatus();
    
    // 检查错题状态
    this.checkWrongQuestionsStatus();
    
    // 更新今日成就统计
    this.updateTodayStats();
    
    // 延迟再次更新统计，确保所有统计已保存
    setTimeout(() => {
      console.log('延迟更新统计...');
      this.updateTodayStats();
    }, 1000);
    
    // 再次延迟更新，确保单题练习记录已保存
    setTimeout(() => {
      console.log('第二次延迟更新统计...');
      this.updateTodayStats();
    }, 2000);
  },

  // 加载每日任务数据
  loadDailyMissionData() {
    const streakDays = wx.getStorageSync('streakDays') || 0;
    const todayProgress = wx.getStorageSync('todayProgress') || 0;
    
    this.setData({
      streakDays,
      todayProgress
    });
  },

  // 生成智能推荐内容
  generateSmartRecommendations() {
    try {
      // 获取用户测试结果
      const grammarTestResults = wx.getStorageSync('grammarTestResults');
      const writingTestResults = wx.getStorageSync('writingTestResults');
      const practiceHistory = wx.getStorageSync('practiceHistory') || [];
      
      // 分析用户能力水平
      const userLevel = this.analyzeUserLevel(grammarTestResults, writingTestResults);
      
      // 分析薄弱环节
      const weakPoints = this.analyzeWeakPoints(practiceHistory);
      
      // 生成个性化推荐
      const recommendations = this.generatePersonalizedRecommendations(userLevel, weakPoints);
      
      return recommendations;
    } catch (error) {
      console.error('生成智能推荐失败:', error);
      return this.getDefaultRecommendations();
    }
  },

  // 分析用户能力水平
  analyzeUserLevel(grammarResults, writingResults) {
    let level = 'beginner';
    
    if (grammarResults && writingResults) {
      const grammarScore = grammarResults.correctRate || 0;
      const writingScore = writingResults.score || 0;
      const avgScore = (grammarScore + writingScore) / 2;
      
      if (avgScore >= 90) level = 'expert';
      else if (avgScore >= 80) level = 'advanced';
      else if (avgScore >= 70) level = 'intermediate';
      else if (avgScore >= 60) level = 'elementary';
    } else if (grammarResults) {
      const grammarScore = grammarResults.correctRate || 0;
      if (grammarScore >= 80) level = 'advanced';
      else if (grammarScore >= 60) level = 'intermediate';
    }
    
    return level;
  },

  // 分析薄弱环节
  analyzeWeakPoints(practiceHistory) {
    const weakPoints = [];
    const today = this.getTodayDateString();
    
    // 分析最近7天的错题
    const recentHistory = practiceHistory.filter(record => {
      const recordDate = new Date(record.date);
      const todayDate = new Date(today);
      const diffTime = todayDate - recordDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });
    
    // 统计错题类型
    const errorTypes = {};
    recentHistory.forEach(record => {
      if (record.category) {
        errorTypes[record.category] = (errorTypes[record.category] || 0) + 1;
      }
    });
    
    // 找出错误最多的类型
    Object.keys(errorTypes).forEach(category => {
      if (errorTypes[category] >= 2) {
        weakPoints.push({
          category: category,
          errorCount: errorTypes[category],
          priority: errorTypes[category] >= 5 ? 'high' : 'medium'
        });
      }
    });
    
    return weakPoints.sort((a, b) => b.errorCount - a.errorCount);
  },

  // 生成个性化推荐
  generatePersonalizedRecommendations(userLevel, weakPoints) {
    const recommendations = {
      level: userLevel,
      weakPoints: weakPoints,
      suggestions: [],
      nextSteps: []
    };
    
    // 根据能力水平生成建议
    switch (userLevel) {
      case 'expert':
        recommendations.suggestions.push('您的语法水平已经很高，建议挑战更难的题目');
        recommendations.nextSteps.push('尝试专属组合练习');
        recommendations.nextSteps.push('挑战高难度练习');
        break;
      case 'advanced':
        recommendations.suggestions.push('您的语法水平良好，可以加强薄弱环节');
        recommendations.nextSteps.push('进行错题特训');
        recommendations.nextSteps.push('尝试系统组合练习');
        break;
      case 'intermediate':
        recommendations.suggestions.push('您的语法水平中等，建议系统练习');
        recommendations.nextSteps.push('从系统组合开始');
        recommendations.nextSteps.push('重点练习薄弱环节');
        break;
      case 'elementary':
        recommendations.suggestions.push('建议从基础语法点开始系统学习');
        recommendations.nextSteps.push('选择基础语法点练习');
        recommendations.nextSteps.push('多做语法分点练习');
        break;
      default:
        recommendations.suggestions.push('建议从基础语法开始练习');
        recommendations.nextSteps.push('开始语法练习');
        recommendations.nextSteps.push('查看每日推荐任务');
    }
    
    // 根据薄弱环节添加针对性建议
    if (weakPoints.length > 0) {
      const topWeakPoint = weakPoints[0];
      recommendations.suggestions.push(`重点关注${topWeakPoint.category}相关练习`);
      recommendations.nextSteps.push(`专项练习${topWeakPoint.category}`);
    }
    
    return recommendations;
  },

  // 获取默认推荐
  getDefaultRecommendations() {
    return {
      level: 'beginner',
      weakPoints: [],
      suggestions: ['建议从基础语法开始练习，逐步提升'],
      nextSteps: ['开始语法练习', '查看每日推荐任务']
    };
  },


  // 跳转到每日任务页面
  goToDailyCards() {
    wx.navigateTo({
      url: '/pages/daily-cards/index'
    });
  },

  // 检查专属组合状态
  checkCustomComboStatus() {
    try {
      const savedCombos = wx.getStorageSync('customCombos') || [];
      const isSet = savedCombos.length > 0;
      
      this.setData({
        isCustomComboSet: isSet,
        customComboCount: savedCombos.length
      });
      
      console.log('专属组合状态检查完成:', isSet, '组合数量:', savedCombos.length);
    } catch (error) {
      console.error('检查专属组合状态失败:', error);
      this.setData({
        isCustomComboSet: false,
        customComboCount: 0
      });
    }
  },

  // 检查错题状态
  checkWrongQuestionsStatus() {
    try {
      const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
      this.setData({
        hasWrongQuestions: wrongQuestions.length > 0,
        wrongQuestionsCount: wrongQuestions.length
      });
    } catch (error) {
      console.error('检查错题状态失败:', error);
    }
  },

  // 关闭引导弹窗
  closeGuide() {
    this.setData({ showGuide: false });
  },

  // 显示模块详情弹窗
  showModuleDetail(e) {
    const moduleType = e.currentTarget.dataset.module;
    console.log('点击的模块类型:', moduleType);
    
    const moduleConfig = JSON.parse(JSON.stringify(this.data.moduleConfigs[moduleType]));
    
    if (!moduleConfig) {
      console.error('未找到模块配置:', moduleType);
      return;
    }
    
    console.log('模块配置:', moduleConfig);
    
    // 动态更新按钮状态
    if (moduleType === 'custom') {
      moduleConfig.actions[0].disabled = !this.data.isCustomComboSet;
    } else if (moduleType === 'wrong') {
      moduleConfig.actions[0].disabled = !this.data.hasWrongQuestions;
    }
    
    // 系统组合模块显示选择卡片
    if (moduleType === 'system') {
      console.log('显示系统组合选择卡片');
      this.setData({
        showSelectionCard: true,
        currentModule: moduleConfig
      });
      return;
    }
    
    console.log('显示普通模块弹窗');
    this.setData({
      showModuleModal: true,
      currentModule: moduleConfig
    });
  },

  // 隐藏模块详情弹窗
  hideModuleDetail() {
    this.setData({
      showModuleModal: false,
      currentModule: {}
    });
  },

  // 显示语法功能大厅弹窗
  showGrammarHall() {
    this.setData({
      showGrammarHallModal: true
    });
  },

  // 隐藏语法功能大厅弹窗
  hideGrammarHall() {
    this.setData({
      showGrammarHallModal: false
    });
  },

  // 跳转到错题本
  goToMistakes() {
    console.log('点击错题本，准备跳转...');
    wx.navigateTo({
      url: '/pages/mistakes-page/index',
      success: (res) => {
        console.log('跳转到错题本成功:', res);
      },
      fail: (error) => {
        console.error('跳转到错题本失败:', error);
        wx.showToast({
          title: '跳转失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 阻止弹窗内容点击事件冒泡
  stopPropagation() {
    // 空方法，用于阻止事件冒泡
  },

  // 新增：隐藏选择卡片
  hideSelectionCard() {
    this.setData({
      showSelectionCard: false,
      currentModule: {},
      selectedModule: 'module1',
      selectedCategories: []
    });
  },

  // 新增：选择模块
  selectModule(e) {
    const moduleType = e.currentTarget.dataset.module;
    console.log('选择模块:', moduleType);
    console.log('选择前的状态:', {
      selectedModule: this.data.selectedModule,
      selectedCategories: this.data.selectedCategories
    });
    
    this.setData({
      selectedModule: moduleType,
      selectedCategories: moduleType === 'module1' ? [] : this.data.selectedCategories
    });
    
    console.log('选择后的状态:', {
      selectedModule: this.data.selectedModule,
      selectedCategories: this.data.selectedCategories
    });
  },

  // 新增：切换语法大类选择
  toggleCategory(e) {
    const category = e.currentTarget.dataset.category;
    console.log('切换语法大类:', category);
    console.log('切换前的状态:', {
      selectedCategories: this.data.selectedCategories,
      selectedCategoriesLength: this.data.selectedCategories.length
    });
    
    const selectedCategories = [...this.data.selectedCategories];
    
    const index = selectedCategories.indexOf(category);
    if (index > -1) {
      selectedCategories.splice(index, 1);
      console.log('移除语法大类:', category);
    } else {
      selectedCategories.push(category);
      console.log('添加语法大类:', category);
    }
    
    console.log('切换后的数组:', selectedCategories);
    console.log('切换后的数组长度:', selectedCategories.length);
    
    // 强制页面重新渲染，确保选中状态正确显示
    this.setData({
      selectedCategories: selectedCategories
    }, () => {
      // 在回调中再次设置，确保数据绑定正确
      this.setData({
        selectedCategories: selectedCategories
      });
      
      console.log('强制重新渲染后的状态:', {
        selectedCategories: this.data.selectedCategories,
        selectedCategoriesLength: this.data.selectedCategories.length
      });
    });
    
    console.log('切换后的状态:', {
      selectedCategories: this.data.selectedCategories,
      selectedCategoriesLength: this.data.selectedCategories.length
    });
    
    // 验证数据绑定
    setTimeout(() => {
      console.log('延迟验证 - 当前选中状态:', {
        selectedCategories: this.data.selectedCategories,
        selectedCategoriesLength: this.data.selectedCategories.length
      });
    }, 100);
  },

  // 新增：处理选择卡片的快速练习
  handleSelectionQuickPractice() {
    if (this.data.selectedModule === 'module1') {
      // 高考常见配比模块
      this.hideSelectionCard();
      this.startSystemComboQuick();
    } else {
      // 选择语法大类模块
      if (this.data.selectedCategories.length === 0) {
        wx.showToast({
          title: '请至少选择一个语法大类',
          icon: 'none'
        });
        return;
      }
      
      // 直接使用当前页面的状态，避免数据绑定问题
      const currentSelectedCategories = [...this.data.selectedCategories];
      console.log('快速练习 - 传递的语法大类:', currentSelectedCategories);
      
      this.hideSelectionCard();
      this.startCustomCategoryComboWithCategories(currentSelectedCategories);
    }
  },

  // 新增：处理选择卡片的调整功能
  handleSelectionAdjust() {
    if (this.data.selectedModule === 'module1') {
      // 高考常见配比模块
      this.hideSelectionCard();
      this.goToGrammarSelect();
    } else {
      // 选择语法大类模块
      if (this.data.selectedCategories.length === 0) {
        wx.showToast({
          title: '请至少选择一个语法大类',
          icon: 'none'
        });
        return;
      }
      
      // 直接使用当前页面的状态，避免数据绑定问题
      const currentSelectedCategories = [...this.data.selectedCategories];
      console.log('调整功能 - 传递的语法大类:', currentSelectedCategories);
      
      this.hideSelectionCard();
      this.goToGrammarSelectWithCategories(currentSelectedCategories);
    }
  },

  // 新增：开始自定义大类组合练习
  startCustomCategoryCombo() {
    wx.showLoading({
      title: '生成题目中...'
    });
    
    try {
      // 生成基于选择大类的题目
      const customCategoryData = this.generateCustomCategoryCombo();
      
      // 将数据存储到本地
      wx.setStorageSync('customCategoryData', customCategoryData);
      
      wx.hideLoading();
      
      // 跳转到练习页面
      wx.navigateTo({
        url: '/pages/exercise-page/index?source=customCategory'
      });
      
    } catch (error) {
      console.error('生成自定义大类组合失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      });
    }
  },

  // 新增：开始自定义大类组合练习（带参数）
  startCustomCategoryComboWithCategories(selectedCategories) {
    wx.showLoading({
      title: '生成题目中...'
    });
    
    try {
      console.log('开始生成自定义大类组合，选中的语法大类:', selectedCategories);
      
      // 生成基于选择大类的题目
      const customCategoryData = this.generateCustomCategoryComboWithCategories(selectedCategories);
      
      // 将数据存储到本地
      wx.setStorageSync('customCategoryData', customCategoryData);
      
      wx.hideLoading();
      
      // 跳转到练习页面
      wx.navigateTo({
        url: '/pages/exercise-page/index?source=customCategory'
      });
      
    } catch (error) {
      console.error('生成自定义大类组合失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      });
    }
  },

  // 新增：生成自定义大类组合数据
  generateCustomCategoryCombo() {
    try {
      const selectedCategories = this.data.selectedCategories;
      console.log('用户选择的语法大类:', selectedCategories);
      
      if (selectedCategories.length === 0) {
        throw new Error('未选择任何语法大类');
      }
      
      // 为每个选中的大类分配题目数量
      const questionsPerCategory = Math.floor(10 / selectedCategories.length);
      const remainingQuestions = 10 % selectedCategories.length;
      
      const categoryQuestionCounts = {};
      
      selectedCategories.forEach((category, index) => {
        let questionCount = questionsPerCategory;
        
        // 将剩余的题目分配给前几个大类
        if (index < remainingQuestions) {
          questionCount += 1;
        }
        
        categoryQuestionCounts[category] = questionCount;
      });
      
      console.log('大类题目分配:', categoryQuestionCounts);
      
      // 将分配结果存储到本地，供练习页面使用
      const customCategoryData = {
        selectedCategories: selectedCategories,
        categoryQuestionCounts: categoryQuestionCounts,
        totalQuestions: 10
      };
      
      console.log('生成的自定义大类组合数据:', customCategoryData);
      return customCategoryData;
      
    } catch (error) {
      console.error('生成自定义大类组合数据失败:', error);
      throw error;
    }
  },

  // 新增：生成自定义大类组合数据（带参数）
  generateCustomCategoryComboWithCategories(selectedCategories) {
    try {
      console.log('生成自定义大类组合数据，传入的语法大类:', selectedCategories);
      
      if (!selectedCategories || selectedCategories.length === 0) {
        throw new Error('未选择任何语法大类');
      }
      
      // 为每个选中的大类分配题目数量
      const questionsPerCategory = Math.floor(10 / selectedCategories.length);
      const remainingQuestions = 10 % selectedCategories.length;
      
      const categoryQuestionCounts = {};
      
      selectedCategories.forEach((category, index) => {
        let questionCount = questionsPerCategory;
        
        // 将剩余的题目分配给前几个大类
        if (index < remainingQuestions) {
          questionCount += 1;
        }
        
        categoryQuestionCounts[category] = questionCount;
      });
      
      console.log('大类题目分配:', categoryQuestionCounts);
      
      // 将分配结果存储到本地，供练习页面使用
      const customCategoryData = {
        selectedCategories: selectedCategories,
        categoryQuestionCounts: categoryQuestionCounts,
        totalQuestions: 10
      };
      
      console.log('生成的自定义大类组合数据:', customCategoryData);
      return customCategoryData;
      
    } catch (error) {
      console.error('生成自定义大类组合数据失败:', error);
      throw error;
    }
  },

  // 新增：跳转到语法点选择页面（带预选大类）
  goToGrammarSelectWithCategories(selectedCategories) {
    // 将选择的大类存储到本地
    wx.setStorageSync('preSelectedCategories', selectedCategories);
    
    // 跳转到语法点选择页面
    wx.navigateTo({
      url: '/pages/grammar-select/index?fromCustomCategory=true'
    });
  },

  // 处理弹窗按钮点击
  handleModalAction(e) {
    const actionHandler = e.currentTarget.dataset.action;
    if (actionHandler && typeof this[actionHandler] === 'function') {
      // 先隐藏弹窗
      this.hideModuleDetail();
      // 然后调用对应的方法
      this[actionHandler]();
    } else {
      console.error('未找到对应的方法:', actionHandler);
    }
  },

  // 导航到语法分点页面
  goToGrammarSelect() {
    // 先生成系统推荐组合，然后跳转到调整页面
    wx.showLoading({
      title: '生成系统组合中...'
    });
    
    try {
      // 生成系统组合数据
      const systemComboData = this.generateSystemComboData();
      
      // 将数据存储到本地，供语法点选择页面使用
      wx.setStorageSync('systemComboData', systemComboData);
      
      wx.hideLoading();
      
      // 跳转到语法点选择页面
      wx.navigateTo({
        url: '/pages/grammar-select/index?fromSystemCombo=true'
      });
      
    } catch (error) {
      console.error('生成系统组合失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      });
    }
  },

  // 导航到专属组合页面
  goToCustomCombo() {
    // 检查是否已设置专属组合
    const savedCombos = wx.getStorageSync('customCombos') || [];
    if (savedCombos.length > 0) {
      // 已设置，直接开始练习
      wx.showModal({
        title: '专属组合练习',
        content: '使用已设置的专属组合开始练习，或者重新设置？',
        confirmText: '开始练习',
        cancelText: '重新设置',
        success: (res) => {
          if (res.confirm) {
            this.startCustomComboQuick();
          } else {
            this.goToCustomComboSetting();
          }
        }
      });
    } else {
      // 未设置，跳转到设置页面
      this.goToCustomComboSetting();
    }
  },

  // 导航到自定义组合设置页面
  goToCustomComboSetting() {
    wx.navigateTo({
      url: '/pages/custom-combo-setting/index',
      events: {
        // 监听专属组合设置事件
        customComboSet: (combos) => {
          console.log('收到专属组合设置事件:', combos);
          this.setData({
            isCustomComboSet: combos.length > 0,
            customComboCount: combos.length
          });
          console.log('专属组合状态已更新:', combos.length > 0, '组合数量:', combos.length);
        }
      }
    });
  },


  // 编辑专属组合
  editCustomCombo(e) {
    // 阻止事件冒泡
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    this.goToCustomComboSetting();
  },

  // 系统组合快速练习
  startSystemComboQuick() {
    wx.showLoading({
      title: '生成系统组合中...'
    });
    
    // 直接生成系统组合题目
    this.generateSystemComboQuestions().catch(error => {
      console.error('生成系统组合题目失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成失败',
        icon: 'none'
      });
    });
  },

  // 生成系统组合数据（用于调整页面）
  generateSystemComboData() {
    try {
      // 系统组合规则：每个大类选择1道题，总共12道题
      const systemComboRules = {
        "介词": 1,
        "代词": 1,
        "连词": 1,
        "冠词": 1,
        "名词": 1,
        "动词": 1,
        "谓语": 1,
        "非谓语": 1,
        "形容词": 1,
        "副词": 1,
        "定语从句": 1,
        "状语和从句": 1
      };

      const selectedPoints = {};
      const usedGrammarPoints = new Set();

      // 根据规则选择语法点
      Object.keys(systemComboRules).forEach(category => {
        const count = systemComboRules[category];
        
        // 获取该分类下的所有语法点
        const grammarPoints = this.getGrammarPointsByCategory(category);
        
        // 随机选择一个语法点
        if (grammarPoints.length > 0) {
          const randomGrammarPoint = grammarPoints[Math.floor(Math.random() * grammarPoints.length)];
          
          // 如果该语法点未被使用
          if (!usedGrammarPoints.has(randomGrammarPoint)) {
            selectedPoints[randomGrammarPoint] = count;
            usedGrammarPoints.add(randomGrammarPoint);
          }
        }
      });

      // 如果题目不够10道，从其他语法点补充
      while (Object.keys(selectedPoints).length < 10) {
        const availablePoints = this.getAllAvailableGrammarPoints();
        const unusedPoints = availablePoints.filter(point => !usedGrammarPoints.has(point));
        
        if (unusedPoints.length === 0) break;
        
        const randomPoint = unusedPoints[Math.floor(Math.random() * unusedPoints.length)];
        selectedPoints[randomPoint] = 1;
        usedGrammarPoints.add(randomPoint);
      }

      console.log('生成的系统组合数据:', selectedPoints);
      return selectedPoints;

    } catch (error) {
      console.error('生成系统组合数据失败:', error);
      throw error;
    }
  },

  // 获取所有可用的语法点
  getAllAvailableGrammarPoints() {
    const allPoints = [];
    
    // 从各个分类中收集所有语法点
    const categories = ["介词", "代词", "连词", "冠词", "名词", "动词", "谓语", "非谓语", "形容词", "副词"];
    categories.forEach(category => {
      const points = this.getGrammarPointsByCategory(category);
      allPoints.push(...points);
    });
    
    return allPoints;
  },

  // 生成系统组合题目
  async generateSystemComboQuestions() {
    try {
      // 从云数据库加载题库数据
      const questionsData = await cloudDataLoader.loadIntermediateQuestions();
      
      // 系统组合规则：每个大类选择1道题，总共12道题
      const systemComboRules = {
        "介词": 1,
        "代词": 1,
        "连词": 1,
        "冠词": 1,
        "名词": 1,
        "动词": 1,
        "谓语": 1,
        "非谓语": 1,
        "形容词": 1,
        "副词": 1,
        "定语从句": 1,
        "状语和从句": 1
      };

      const selectedQuestions = [];
      const usedGrammarPoints = new Set();

      // 根据规则选择题目
      Object.keys(systemComboRules).forEach(category => {
        const count = systemComboRules[category];
        
        // 获取该分类下的所有语法点
        const grammarPoints = this.getGrammarPointsByCategory(category);
        
        // 随机选择一个语法点
        if (grammarPoints.length > 0) {
          const randomGrammarPoint = grammarPoints[Math.floor(Math.random() * grammarPoints.length)];
          
          // 如果该语法点有题目且未被使用
          if (questionsData[randomGrammarPoint] && questionsData[randomGrammarPoint].length > 0 && !usedGrammarPoints.has(randomGrammarPoint)) {
            const questions = questionsData[randomGrammarPoint];
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            
            // 确保题目数据格式统一
            const normalizedQuestion = this.normalizeQuestionFormat(randomQuestion);
            selectedQuestions.push(normalizedQuestion);
            usedGrammarPoints.add(randomGrammarPoint);
          }
        }
      });

      // 如果题目不够10道，从其他语法点补充
      while (selectedQuestions.length < 10) {
        const availablePoints = Object.keys(questionsData).filter(point => 
          !usedGrammarPoints.has(point) && questionsData[point] && questionsData[point].length > 0
        );
        
        if (availablePoints.length === 0) break;
        
        const randomPoint = availablePoints[Math.floor(Math.random() * availablePoints.length)];
        const questions = questionsData[randomPoint];
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        
        // 确保题目数据格式统一
        const normalizedQuestion = this.normalizeQuestionFormat(randomQuestion);
        selectedQuestions.push(normalizedQuestion);
        usedGrammarPoints.add(randomPoint);
      }

      wx.hideLoading();

      if (selectedQuestions.length === 0) {
        wx.showToast({
          title: '无法生成系统组合',
          icon: 'none'
        });
        return;
      }

      // 跳转到练习页面
      const url = `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(selectedQuestions))}&level=中级&hasSpecialCategory=false`;
      
      console.log('系统组合生成的题目:', selectedQuestions);
      console.log('题目数量:', selectedQuestions.length);
      
      wx.navigateTo({
        url: url,
        success: () => {
          console.log('跳转到系统组合练习页面成功');
        },
        fail: (error) => {
          console.error('跳转到系统组合练习页面失败:', error);
          wx.showToast({
            title: '跳转失败',
            icon: 'none'
          });
        }
      });

    } catch (error) {
      console.error('生成系统组合失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成练习失败',
        icon: 'none'
      });
    }
  },

  // 根据分类获取语法点
  getGrammarPointsByCategory(category) {
    const categoryMap = {
      "介词": ["介词综合", "固定搭配", "介词 + 名词/动名词"],
      "代词": ["代词综合", "人称代词", "物主代词", "反身代词", "关系代词", "it相关"],
      "连词": ["并列连词综合", "从属连词综合", "连词与名/动/形/副综合", "连词与名词", "连词与动词", "连词与形容词"],
      "冠词": ["冠词综合", "泛指与特指", "a和an", "the的特殊用法"],
      "名词": ["名词综合", "复合词和外来词", "单复数同形", "不规则复数", "以o结尾", "以y结尾", "s/sh/ch/x结尾", "以f/fe结尾"],
      "动词": ["被动写be吗", "并列句与动词", "主从句与动词", "插入语与动词"],
      "谓语": ["谓语", "时态(一般过去时)", "时态(一般将来时)", "时态(过去将来时)", "时态(现在进行时)", "时态(过去进行时)", "时态(现在完成时)", "时态(过去完成时)", "语态(被动+八大时态)"],
      "非谓语": ["现在分词综合", "过去分词综合", "不定式综合"],
      "形容词": ["形容词综合", "比较级", "最高级"],
      "副词": ["副词综合", "副词修饰动词", "副词修饰句子", "副词修饰形容词/副词"]
    };
    
    return categoryMap[category] || [];
  },

  // 标准化题目格式
  normalizeQuestionFormat(question) {
    // 确保题目数据格式统一
    const normalized = {
      text: question.text || question.题目 || '',
      answer: question.answer || question.答案 || '',
      analysis: question.analysis || question.explanation || '',
      category: question.category || question.grammarPoint || '' // 保留分类信息
    };
    
    // 如果text字段为空，尝试其他可能的字段
    if (!normalized.text) {
      normalized.text = question.question || question.content || '';
    }
    
    return normalized;
  },

  // 专属组合快速练习
  startCustomComboQuick() {
    const savedCombos = wx.getStorageSync('customCombos') || [];
    
    if (savedCombos.length === 0) {
      wx.showModal({
        title: '提示',
        content: '您还未设置专属组合，请先设置后再进行快速练习',
        confirmText: '去设置',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.goToCustomComboSetting();
          }
        }
      });
      return;
    }

    if (savedCombos.length === 1) {
      // 只有一个组合，直接使用
      wx.showLoading({
        title: '生成专属组合中...'
      });
      this.generateCustomComboQuestions(savedCombos[0].config);
    } else {
      // 多个组合，显示选择界面
      this.showComboSelection(savedCombos);
    }
  },

  // 显示组合选择界面
  showComboSelection(combos) {
    const comboList = combos.map((combo, index) => ({
      name: combo.name,
      count: combo.totalCount,
      index: index
    }));

    wx.showActionSheet({
      itemList: comboList.map(combo => `${combo.name} (${combo.count}题)`),
      success: (res) => {
        const selectedCombo = combos[res.tapIndex];
        if (selectedCombo) {
          wx.showLoading({
            title: '生成专属组合中...'
          });
          this.generateCustomComboQuestions(selectedCombo.config);
        }
      },
      fail: (res) => {
        console.log('用户取消选择组合');
      }
    });
  },

  // 生成专属组合题目
  async generateCustomComboQuestions(config) {
    try {
      // 从云数据库加载题库数据
      const questionsData = await cloudDataLoader.loadIntermediateQuestions();
      
      const selectedQuestions = [];
      const usedGrammarPoints = new Set();

      // 根据配置生成题目
      Object.keys(config).forEach(category => {
        const categoryConfig = config[category];
        
        // 处理新格式：大类下包含小类对象
        if (typeof categoryConfig === 'object' && categoryConfig !== null) {
          Object.keys(categoryConfig).forEach(subPoint => {
            const countToSelect = categoryConfig[subPoint];
            if (countToSelect && countToSelect > 0) {
              // 检查小类是否存在
              if (questionsData[subPoint] && questionsData[subPoint].length > 0) {
                const questions = questionsData[subPoint];
                // 随机选择指定数量的题目
                const shuffled = [...questions].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, Math.min(countToSelect, questions.length));
                // 确保题目数据格式统一
                const normalizedSelected = selected.map(q => this.normalizeQuestionFormat(q));
                selectedQuestions.push(...normalizedSelected);
              }
            }
          });
        } else if (typeof categoryConfig === 'number' && categoryConfig > 0) {
          // 兼容旧格式：大类直接对应数字
          const grammarPoints = this.getGrammarPointsByCategory(category);
          if (grammarPoints.length > 0) {
            const shuffled = [...grammarPoints].sort(() => 0.5 - Math.random());
            const pointsToSelect = shuffled.slice(0, categoryConfig);
            pointsToSelect.forEach(point => {
              if (questionsData[point] && questionsData[point].length > 0) {
                const questions = questionsData[point];
                const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
                // 确保题目数据格式统一
                const normalizedQuestion = this.normalizeQuestionFormat(randomQuestion);
                selectedQuestions.push(normalizedQuestion);
              }
            });
          }
        }
      });

      wx.hideLoading();

      if (selectedQuestions.length === 0) {
        wx.showToast({
          title: '无法生成专属组合',
          icon: 'none'
        });
        return;
      }

      // 跳转到练习页面
      const url = `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(selectedQuestions))}&level=中级&hasSpecialCategory=false`;
      
      console.log('专属组合生成的题目:', selectedQuestions);
      console.log('题目数量:', selectedQuestions.length);
      
      wx.navigateTo({
        url: url,
        success: () => {
          console.log('跳转到专属组合练习页面成功');
        },
        fail: (error) => {
          console.error('跳转到专属组合练习页面失败:', error);
          wx.showToast({
            title: '跳转失败',
            icon: 'none'
          });
        }
      });

    } catch (error) {
      console.error('生成专属组合失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成练习失败',
        icon: 'none'
      });
    }
  },

  // 开始专属组合练习(保留原有方法，适配多组合)
  startCustomComboExercise() {
    try {
      const savedCombos = wx.getStorageSync('customCombos') || [];
      if (savedCombos.length === 0) {
        wx.showToast({
          title: '专属组合未设置',
          icon: 'none'
        });
        return;
      }

      // 如果有多个组合，显示选择界面
      if (savedCombos.length > 1) {
        this.showComboSelection(savedCombos);
      } else {
        // 只有一个组合，直接使用
        this.generateCustomComboQuestions(savedCombos[0].config);
      }
    } catch (error) {
      console.error('开始专属组合练习失败:', error);
      wx.showToast({
        title: '启动练习失败',
        icon: 'none'
      });
    }
  },



  // 拍照选题(即将推出)
  showComingSoon() {
    wx.showToast({
      title: '即将推出，敬请期待',
      icon: 'none',
      duration: 2000
    })
  },







  // 阻止事件冒泡
  stopPropagation(e) {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
  },

  // 获取统一格式的今日日期
  getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  },

  // 更新今日成就统计
  updateTodayStats() {
    try {
      const today = this.getTodayDateString();
      const practiceHistory = wx.getStorageSync('practiceHistory') || [];
      const writingHistory = wx.getStorageSync('writingHistory') || [];
      const wrongQuestionHistory = wx.getStorageSync('wrongQuestionHistory') || [];
      
      console.log('今日统计调试信息:');
      console.log('今天日期:', today);
      console.log('练习历史记录:', practiceHistory);
      console.log('书写历史记录:', writingHistory);
      console.log('错题历史记录:', wrongQuestionHistory);
      
      // 筛选今日的练习记录
      const todayPractices = practiceHistory.filter(practice => {
        console.log('练习记录日期:', practice.date, '匹配结果:', practice.date === today);
        return practice.date === today;
      });
      
      const todayWriting = writingHistory.filter(record => {
        console.log('书写记录日期:', record.date, '匹配结果:', record.date === today);
        return record.date === today;
      });
      
      const todayWrongQuestions = wrongQuestionHistory.filter(record => {
        console.log('错题记录日期:', record.date, '匹配结果:', record.date === today);
        return record.date === today;
      });
      
      console.log('今日练习记录:', todayPractices);
      console.log('今日书写记录:', todayWriting);
      console.log('今日书写记录详情:', todayWriting.map(record => ({
        date: record.date,
        correctCount: record.correctCount,
        totalCount: record.totalCount,
        hasCorrectCount: 'correctCount' in record,
        correctCountType: typeof record.correctCount
      })));
      console.log('今日错题记录:', todayWrongQuestions);
      
      // 计算语法题统计（只统计正确的题目）
      const grammarCount = todayPractices.reduce((sum, practice) => {
        console.log('语法题统计:', practice.correct, '当前累计:', sum);
        return sum + (practice.correct || 0);
      }, 0);
      
      // 计算书写题统计
      const writingCount = todayWriting.reduce((sum, record) => {
        console.log('书写题统计:', record.correctCount, '当前累计:', sum);
        return sum + (record.correctCount || 0);
      }, 0);
      
      // 计算错题特训统计
      const wrongQuestionCount = todayWrongQuestions.reduce((sum, record) => {
        console.log('错题特训统计:', record.correctCount, '当前累计:', sum);
        return sum + (record.correctCount || 0);
      }, 0);
      
      console.log('错题特训统计计算详情:', {
        今日错题记录数量: todayWrongQuestions.length,
        今日错题记录: todayWrongQuestions,
        计算出的错题数量: wrongQuestionCount
      });
      
      // 获取语法水平评级
      const levelTestResults = wx.getStorageSync('levelTestResults');
      const grammarTestResults = wx.getStorageSync('grammarTestResults');
      
      // 优先使用最新的测试结果
      let grammarLevel = '';
      let grammarLevelText = '';
      
      if (grammarTestResults && grammarTestResults.timestamp) {
        // 使用重测结果（优先级更高）
        grammarLevel = grammarTestResults.level;
        grammarLevelText = this.getLevelText(grammarTestResults.level);
      } else if (levelTestResults) {
        // 使用首次水平测试结果
        grammarLevel = levelTestResults.totalLevel;
        grammarLevelText = this.getLevelText(levelTestResults.totalLevel);
      }
      
      console.log('语法水平评级信息:', {
        levelTestResults,
        grammarTestResults,
        grammarLevel,
        grammarLevelText
      });
      
      console.log('最终统计结果:', {
        grammarCount,
        writingCount,
        wrongQuestionCount,
        grammarLevel,
        grammarLevelText
      });
      
      // 计算进度条宽度百分比
      const progressWidth = Math.min(grammarCount / 20 * 100, 100) + '%';
      
      this.setData({
        todayStats: {
          grammarCount: grammarCount,
          writingCount: writingCount,
          wrongQuestionCount: wrongQuestionCount,
          grammarLevel: grammarLevel,
          grammarLevelText: grammarLevelText
        },
        progressWidth: progressWidth
      });
      
    } catch (error) {
      console.error('更新今日统计失败:', error);
      this.setData({
        todayStats: {
          grammarCount: 0,
          writingCount: 0,
          wrongQuestionCount: 0,
          grammarLevel: '',
          grammarLevelText: ''
        },
        progressWidth: '0%'
      });
    }
  },

  // 获取语法水平评级文本
  getLevelText(level) {
    const levelTexts = {
      'level1': '较为薄弱',
      'level2': '稍弱',
      'level3': '不错哦',
      'level4': '超棒的',
      'level5': '简直完美'
    };
    return levelTexts[level] || '未测试';
  },

  // 错题变式训练(功能二：高频错题自动训练)
  startWrongQuestionVariant() {
    const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
    if (wrongQuestions.length === 0) {
      wx.showModal({
        title: '提示',
        content: '您还没有错题记录，请先进行其他练习积累错题后再使用此功能',
        showCancel: false,
        confirmText: '确定'
      });
      return;
    }

    // 初始化错题特训统计
    this.initWrongQuestionStats();

    wx.showLoading({
      title: '分析错题模式中...'
    });

    // 生成基于错题的高频考点变式练习
    this.generateHighFrequencyWrongQuestionVariants(wrongQuestions).catch(error => {
      console.error('生成高频错题变式练习失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成失败',
        icon: 'none'
      });
    });
  },

  // 生成高频错题变式练习(功能二：高频错题自动训练)
  async generateHighFrequencyWrongQuestionVariants(wrongQuestions) {
    try {
      // 从云数据库加载题库数据
      const questionsData = await cloudDataLoader.loadIntermediateQuestions();
      
      // 分析错题的细分考点分布(语法填空专用)
      const grammarPointCount = {};
      const grammarPointErrorCount = {}; // 记录每个考点的错误频次
      const grammarPointDifficulty = {}; // 记录每个考点的难度分布
      
      // 分类映射表
      const categoryMapping = {
        // 介词相关分类
        "介词(1)": "介词", "介词(2)": "介词", "介词(3)": "介词",
        // 代词相关分类
        "代词(1)": "代词", "代词(2)": "代词", "代词(3)": "代词", 
        "代词(4)": "代词", "代词(5)": "代词", "代词(6)": "代词",
        // 连词相关分类
        "连词(1)": "连词", "连词(2)": "连词", "连词(3)": "连词",
        "连词(4)": "连词", "连词(5)": "连词", "连词(6)": "连词",
        // 冠词相关分类
        "冠词(1)": "冠词", "冠词(2)": "冠词", "冠词(3)": "冠词", "冠词(4)": "冠词",
        // 名词相关分类
        "名词(1)": "名词", "名词(2)": "名词", "名词(3)": "名词", "名词(4)": "名词", "名词(5)": "名词", "名词(6)": "名词",
        // 动词相关分类
        "动词(1)": "动词", "动词(2)": "动词", "动词(3)": "动词", 
        "动词(4)": "动词", "动词(5)": "动词",
        // 谓语相关分类
              "谓语(1)": "谓语", "谓语(2)": "谓语", "谓语(3)": "谓语",
      "谓语(4)": "谓语", "谓语(5)": "谓语", "谓语(6)": "谓语", "谓语(7)": "谓语",
      "谓语(8)": "谓语", "谓语(9)": "谓语",
      "谓语(1)": "谓语", "谓语(2)": "谓语", "谓语(3)": "谓语",
      "谓语(4)": "谓语", "谓语(5)": "谓语", "谓语(6)": "谓语", "谓语(7)": "谓语",
      "谓语(8)": "谓语", "谓语(9)": "谓语",
        // 非谓语相关分类
        "非谓语(1)": "非谓语", "非谓语(2)": "非谓语", "非谓语(3)": "非谓语", "非谓语(4)": "非谓语",
        // 形容词相关分类
        "形容词(1)": "形容词", "形容词(2)": "形容词", "形容词(3)": "形容词",
        // 副词相关分类
        "副词(1)": "副词", "副词(2)": "副词", "副词(3)": "副词", "副词(4)": "副词",
        "副词综合": "副词", "副词修饰句子": "副词", "副词修饰动词": "副词", "副词修饰形容词/副词": "副词",
        // 定语从句相关分类
        "定语从句(1)": "定语从句", "定语从句(2)": "定语从句", "定语从句(3)": "定语从句",
        "定语从句(4)": "定语从句", "定语从句(5)": "定语从句",
        // 状语从句相关分类
        "状语和从句(1)": "状语从句", "状语和从句(2)": "状语从句", "状语和从句(3)": "状语从句",
        "状语和从句(4)": "状语从句", "状语和从句(5)": "状语从句"
      };
      
      // 题库分类映射表
      const questionBankMapping = {
        '介词': ['介词综合', '固定搭配', '介词 + 名词/动名词'],
        '代词': ['代词综合', '人称代词', '物主代词', '反身代词', '关系代词', 'it相关'],
        '连词': ['并列连词综合', '从属连词综合', '连词与名/动/形/副综合', '连词与名词', '连词与动词', '连词与形容词'],
        '冠词': ['冠词综合', '泛指与特指', 'a和an', 'the的特殊用法'],
        '名词': ['名词综合', '名词复数书写综合', '以o结尾', '以y结尾', 's/sh/ch/x结尾', 'f/fe结尾'],
        '动词': ['动词综合', '谓语(1)', '非谓语综合', '被动写be吗', '并列句与动词', '主从句与动词', '插入语与动词'],
        '谓语': ['时态综合', '现在时', '过去时', '完成时', '进行时', '被动语态'],
        '非谓语': ['现在分词综合', '过去分词综合', '不定式综合'],
        '形容词': ['形容词综合', '比较级', '最高级'],
        '副词': ['副词综合', '副词修饰动词', '副词修饰句子', '副词修饰形容词/副词'],
        '定语从句': ['定语从句综合', 'that能填吗', 'who和which选哪个', 'whose', 'which和when/where混淆'],
        '状语从句': ['状语从句综合', 'when', 'where', 'how', 'why']
      };
      
      wrongQuestions.forEach(question => {
        const originalCategory = question.grammarPoint || question.category || '综合练习';
        const mappedCategory = categoryMapping[originalCategory] || originalCategory;
        
        grammarPointCount[mappedCategory] = (grammarPointCount[mappedCategory] || 0) + 1;
        // 同一题错N次算N次错误频次
        grammarPointErrorCount[mappedCategory] = (grammarPointErrorCount[mappedCategory] || 0) + (question.errorCount || 1);
        
        // 分析难度分布
        if (!grammarPointDifficulty[mappedCategory]) {
          grammarPointDifficulty[mappedCategory] = {
            easy: 0,
            medium: 0,
            hard: 0
          };
        }
        // 根据错误次数判断难度(错误次数越多，说明越难)
        const errorCount = question.errorCount || 1;
        if (errorCount >= 3) {
          grammarPointDifficulty[mappedCategory].hard++;
        } else if (errorCount >= 2) {
          grammarPointDifficulty[mappedCategory].medium++;
        } else {
          grammarPointDifficulty[mappedCategory].easy++;
        }
      });

      // 按错误频次排序，取前N类高频考点(N为实际类别数量，最多3类，排除"综合"分类)
      const sortedPoints = Object.keys(grammarPointErrorCount)
        .filter(point => point !== '综合' && point !== '综合练习' && point !== '其他')
        .sort((a, b) => grammarPointErrorCount[b] - grammarPointErrorCount[a])
        .slice(0, Math.min(3, Object.keys(grammarPointErrorCount).length));

      console.log('高频考点分析:', {
        totalWrongQuestions: wrongQuestions.length,
        grammarPointCount: grammarPointCount,
        grammarPointErrorCount: grammarPointErrorCount,
        grammarPointDifficulty: grammarPointDifficulty,
        topPoints: sortedPoints,
        actualCategories: sortedPoints.length
      });

      // 生成变式练习题目
      const variantQuestions = [];
      let totalGenerated = 0;
      
      // 根据实际类别数量调整生成策略
      const actualCategoryCount = sortedPoints.length;
      let questionsPerCategory;
      
      if (actualCategoryCount >= 3) {
        // 3类或以上：每类生成2-3道题
        questionsPerCategory = 3;
      } else if (actualCategoryCount === 2) {
        // 2类：每类生成3-4道题
        questionsPerCategory = 4;
      } else {
        // 1类：生成5-6道题
        questionsPerCategory = 6;
      }
      
      // 使用题库分类映射表

      // 为每个高频考点生成题目
      sortedPoints.forEach(grammarPoint => {
        const errorCount = grammarPointErrorCount[grammarPoint];
        const difficulty = grammarPointDifficulty[grammarPoint];
        const questionsToGenerate = Math.min(questionsPerCategory, Math.max(2, Math.ceil(errorCount / 2)));
        
        // 获取该分类对应的题库键名
        const mappedCategories = questionBankMapping[grammarPoint] || [grammarPoint];
        let availableQuestions = [];
        
        // 从映射的分类中收集题目
        mappedCategories.forEach(category => {
          const categoryQuestions = questionsData[category];
          if (Array.isArray(categoryQuestions) && categoryQuestions.length > 0) {
            // 确保只添加有效的题目数据
            const validQuestions = categoryQuestions.filter(q => q && (q.text || q.question));
            availableQuestions = availableQuestions.concat(validQuestions);
            console.log(`分类 ${category} 添加了 ${validQuestions.length} 道有效题目`);
          } else {
            console.warn(`分类 ${category} 没有有效的题目数据或不是数组`);
          }
        });
        
        if (availableQuestions.length > 0) {
          // 智能选择题目：根据难度分布选择不同难度的题目
          const selectedQuestions = this.selectQuestionsByDifficulty(
            availableQuestions, 
            questionsToGenerate, 
            difficulty,
            wrongQuestions
          );
          
          const normalizedSelected = selectedQuestions.map(q => this.normalizeQuestionFormat(q));
          variantQuestions.push(...normalizedSelected);
          totalGenerated += selectedQuestions.length;
          
          console.log(`为分类 ${grammarPoint} 生成了 ${selectedQuestions.length} 道题，可用题目总数: ${availableQuestions.length}`);
        } else {
          console.warn(`分类 ${grammarPoint} 没有找到可用题目，映射的分类: ${mappedCategories.join(', ')}`);
        }
      });

      // 如果生成的题目不够，从其他语法点补充
      const minQuestions = Math.max(6, actualCategoryCount * 2);
      if (totalGenerated < minQuestions) {
        const remainingCount = minQuestions - totalGenerated;
        const supplementaryQuestions = this.generateSupplementaryQuestions(
          questionsData, 
          remainingCount, 
          sortedPoints,
          wrongQuestions
        );
        variantQuestions.push(...supplementaryQuestions);
        totalGenerated += supplementaryQuestions.length;
      }

      wx.hideLoading();

      console.log('变式练习生成结果:', {
        totalGenerated: totalGenerated,
        variantQuestionsCount: variantQuestions.length,
        sortedPoints: sortedPoints,
        questionsPerCategory: questionsPerCategory
      });

      if (variantQuestions.length === 0) {
        console.error('无法生成变式练习，可能的原因:', {
          sortedPoints: sortedPoints,
          questionsDataKeys: Object.keys(questionsData),
          availableQuestionsForPoints: sortedPoints.map(point => ({
            point: point,
            availableCount: questionsData[point] ? questionsData[point].length : 0
          }))
        });
        
        wx.showToast({
          title: '无法生成变式练习',
          icon: 'none'
        });
        return;
      }

      // 智能提示：显示覆盖的考点类别
      const coveredPoints = sortedPoints.join('、');
      let promptMessage;
      
      if (sortedPoints.length >= 3) {
        promptMessage = `本次特训覆盖您错题本中高频错误的${sortedPoints.length}类考点(${coveredPoints})，针对性强化！`;
      } else if (sortedPoints.length === 2) {
        promptMessage = `本次特训覆盖您错题本中的${sortedPoints.length}类高频考点(${coveredPoints})，每类生成更多练习题目！`;
      } else {
        promptMessage = `当前错题本主要包含${sortedPoints[0]}类错题，已生成同类题强化训练，并补充其他语法点练习！`;
      }

      wx.showModal({
        title: '智能特训',
        content: promptMessage,
        confirmText: '开始练习',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 跳转到练习页面
            const url = `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(variantQuestions))}&level=中级&hasSpecialCategory=false&isWrongQuestionVariant=true`;
            
            wx.navigateTo({
              url: url,
              success: () => {
                console.log('跳转到错题变式练习页面成功');
              },
              fail: (error) => {
                console.error('跳转到错题变式练习页面失败:', error);
                wx.showToast({
                  title: '跳转失败',
                  icon: 'none'
                });
              }
            });
          }
        }
      });

    } catch (error) {
      console.error('生成高频错题变式练习失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成练习失败',
        icon: 'none'
      });
    }
  },

  // 新增：根据难度分布选择题目
  selectQuestionsByDifficulty(availableQuestions, count, difficulty, wrongQuestions) {
    try {
      console.log('开始根据难度分布选择题目:', { 
        availableQuestionsCount: availableQuestions.length, 
        count, 
        difficulty 
      });
      
      // 确保availableQuestions是数组
      if (!Array.isArray(availableQuestions)) {
        console.warn('availableQuestions不是数组，返回空数组');
        return [];
      }
      
      // 避免与错题重复
      const wrongQuestionTexts = wrongQuestions.map(q => q.question);
      const filteredQuestions = availableQuestions.filter(q => 
        q && (q.text || q.question) && !wrongQuestionTexts.includes(q.text || q.question)
      );
      
      console.log('过滤后可用题目数量:', filteredQuestions.length);
      
      if (filteredQuestions.length === 0) {
        console.warn('没有可用的题目，返回原始题目的一部分');
        return availableQuestions.slice(0, count);
      }
      
      // 根据难度分布选择题目
      const totalDifficulty = difficulty.easy + difficulty.medium + difficulty.hard;
      const easyCount = Math.round((difficulty.easy / totalDifficulty) * count);
      const mediumCount = Math.round((difficulty.medium / totalDifficulty) * count);
      const hardCount = count - easyCount - mediumCount;
      
      const selectedQuestions = [];
      
      // 随机打乱题目
      const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
      
      // 按难度比例选择题目(这里简化处理，实际可以根据题目特征判断难度)
      selectedQuestions.push(...shuffled.slice(0, count));
      
      console.log('选择题目完成:', selectedQuestions.length);
      return selectedQuestions;
      
    } catch (error) {
      console.error('根据难度分布选择题目失败:', error);
      return [];
    }
  },

  // 新增：生成补充题目
  generateSupplementaryQuestions(questionsData, count, usedPoints, wrongQuestions) {
    try {
      console.log('开始生成补充题目:', { count, usedPoints, wrongQuestionsCount: wrongQuestions.length });
      
      const allGrammarPoints = Object.keys(questionsData);
      const usedPointsSet = new Set(usedPoints);
      const availablePoints = allGrammarPoints.filter(point => !usedPointsSet.has(point));
      
      console.log('可用语法点:', availablePoints);
      
      const supplementaryQuestions = [];
      const wrongQuestionTexts = wrongQuestions.map(q => q.question);
      
      for (let i = 0; i < count && availablePoints.length > 0; i++) {
        const randomPoint = availablePoints[Math.floor(Math.random() * availablePoints.length)];
        const pointQuestions = questionsData[randomPoint];
        
        console.log(`处理语法点 ${randomPoint}:`, {
          pointQuestionsType: typeof pointQuestions,
          isArray: Array.isArray(pointQuestions),
          length: pointQuestions ? pointQuestions.length : 'undefined'
        });
        
        // 确保pointQuestions是数组，并且包含题目数据
        if (!Array.isArray(pointQuestions) || pointQuestions.length === 0) {
          console.warn(`语法点 ${randomPoint} 的题目不是数组或为空，跳过`);
          continue;
        }
        
        // 检查是否包含有效的题目数据（至少有一个题目有text字段）
        const hasValidQuestions = pointQuestions.some(q => q && (q.text || q.question));
        if (!hasValidQuestions) {
          console.warn(`语法点 ${randomPoint} 没有有效的题目数据，跳过`);
          continue;
        }
        
        // 过滤掉与错题重复的题目
        const filteredQuestions = pointQuestions.filter(q => 
          q && (q.text || q.question) && !wrongQuestionTexts.includes(q.text || q.question)
        );
        
        console.log(`语法点 ${randomPoint} 过滤后题目数量:`, filteredQuestions.length);
        
        if (filteredQuestions.length > 0) {
          const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
          const normalizedQuestion = this.normalizeQuestionFormat(randomQuestion);
          supplementaryQuestions.push(normalizedQuestion);
        }
      }
      
      console.log('补充题目生成完成:', supplementaryQuestions.length);
      return supplementaryQuestions;
      
    } catch (error) {
      console.error('生成补充题目失败:', error);
      return [];
    }
  },

  // 消灭错题(功能一：做对题自动移出错题本)
  goToWrongQuestionEliminate() {
    const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
    if (wrongQuestions.length === 0) {
      wx.showModal({
        title: '消灭错题',
        content: '您还没有错题记录，请先进行练习积累错题后再使用此功能',
        showCancel: false,
        confirmText: '确定'
      });
      return;
    }

    // 获取用户设置的自动移除规则
    const autoRemoveConfig = wx.getStorageSync('autoRemoveConfig') || { enabled: true, correctCount: 3 };
    
    // 检查用户是否已经设置过规则(通过检查是否有autoRemoveConfig存储来判断)
    const hasSetupConfig = wx.getStorageSync('autoRemoveConfig') !== '';
    
    if (hasSetupConfig) {
      // 用户已经设置过规则，直接进入错题练习
      wx.showModal({
        title: '消灭错题',
        content: `当前设置：做对${autoRemoveConfig.correctCount}次自动移出错题本\n\n开始练习来消灭错题吧！`,
        confirmText: '开始练习',
        cancelText: '重新设置',
        success: (res) => {
          if (res.confirm) {
            // 开始错题练习
            this.startWrongQuestionElimination();
          } else {
            // 重新设置规则
            this.showAutoRemoveRuleSettings();
          }
        }
      });
    } else {
      // 首次使用，显示设置界面
      wx.showModal({
        title: '消灭错题',
        content: `当前设置：做对${autoRemoveConfig.correctCount}次自动移出错题本\n\n点击"设置规则"可自定义移除条件`,
        confirmText: '设置规则',
        cancelText: '查看错题',
        success: (res) => {
          if (res.confirm) {
            // 显示规则设置选项
            this.showAutoRemoveRuleSettings();
          } else {
            // 跳转到错题本页面
            wx.switchTab({
              url: '/pages/mistakes-page/index',
              success: () => {
                console.log('跳转到错题本页面成功');
              },
              fail: (error) => {
                console.error('跳转到错题本页面失败:', error);
                wx.showToast({
                  title: '跳转失败',
                  icon: 'none'
                });
              }
            });
          }
        }
      });
    }
  },

  // 显示自动移除规则设置
  showAutoRemoveRuleSettings() {
    const autoRemoveConfig = wx.getStorageSync('autoRemoveConfig') || { enabled: true, correctCount: 3 };
    const options = [
      { text: '做对1次自动移除', value: 1 },
      { text: '做对2次自动移除', value: 2 },
      { text: '做对3次自动移除', value: 3 },
      { text: '做对5次自动移除', value: 5 }
    ];

    wx.showActionSheet({
      itemList: options.map(option => option.text),
      success: (res) => {
        const selectedOption = options[res.tapIndex];
        const newConfig = {
          enabled: true,
          correctCount: selectedOption.value
        };
        
        wx.setStorageSync('autoRemoveConfig', newConfig);
        
        wx.showToast({
          title: `已设置为${selectedOption.text}`,
          icon: 'success',
          duration: 2000
        });
        
        console.log('自动移除规则已更新:', newConfig);
        
        // 设置完成后询问是否立即开始练习
        setTimeout(() => {
          wx.showModal({
            title: '设置完成',
            content: '规则设置完成，现在开始练习来消灭错题吧！',
            confirmText: '开始练习',
            cancelText: '稍后练习',
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.startWrongQuestionElimination();
              }
            }
          });
        }, 2500);
      },
      fail: (error) => {
        console.log('用户取消设置');
      }
    });
  },

  // 开始错题消灭练习
  startWrongQuestionElimination() {
    const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
    
    if (wrongQuestions.length === 0) {
      wx.showToast({
        title: '暂无错题',
        icon: 'none'
      });
      return;
    }

    // 转换错题格式以适配练习页面
    const questions = wrongQuestions.map(mistake => ({
      text: mistake.question,
      answer: mistake.correctAnswer,
      category: mistake.category || '未知',
      analysis: mistake.analysis || '', // 添加解析信息
      id: mistake.id
    }));

    // 随机打乱错题顺序
    const shuffledQuestions = this.shuffleArray(questions);
    
    // 限制题目数量(最多20道)
    const limitedQuestions = shuffledQuestions.slice(0, 20);

    console.log('开始错题消灭练习:', limitedQuestions.length, '道题');

    // 跳转到练习页面
    const url = `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(limitedQuestions))}&level=错题消灭&mode=elimination&title=${encodeURIComponent('错题消灭练习')}&isWrongQuestionElimination=true`;
    
    wx.navigateTo({
      url: url,
      success: () => {
        console.log('跳转到错题消灭练习页面成功');
      },
      fail: (error) => {
        console.error('跳转到错题消灭练习页面失败:', error);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 工具方法：打乱数组
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // 初始化错题特训统计
  initWrongQuestionStats() {
    try {
      const today = this.getTodayDateString();
      const wrongQuestionHistory = wx.getStorageSync('wrongQuestionHistory') || [];
      
      // 检查是否已有今日记录
      const todayRecord = wrongQuestionHistory.find(record => record.date === today);
      if (!todayRecord) {
        // 创建今日记录
        const newRecord = {
          date: today,
          correctCount: 0,
          totalCount: 0
        };
        wrongQuestionHistory.push(newRecord);
        wx.setStorageSync('wrongQuestionHistory', wrongQuestionHistory);
      }
    } catch (error) {
      console.error('初始化错题特训统计失败:', error);
    }
  },

  // 更新错题特训统计
  updateWrongQuestionStats(isCorrect) {
    try {
      const today = this.getTodayDateString();
      const wrongQuestionHistory = wx.getStorageSync('wrongQuestionHistory') || [];
      
      // 查找今日记录
      let todayRecord = wrongQuestionHistory.find(record => record.date === today);
      if (!todayRecord) {
        todayRecord = {
          date: today,
          correctCount: 0,
          totalCount: 0
        };
        wrongQuestionHistory.push(todayRecord);
      }
      
      // 更新统计
      todayRecord.totalCount += 1;
      if (isCorrect) {
        todayRecord.correctCount += 1;
      }
      
      // 保存更新
      wx.setStorageSync('wrongQuestionHistory', wrongQuestionHistory);
      console.log('错题特训统计已更新:', todayRecord);
    } catch (error) {
      console.error('更新错题特训统计失败:', error);
    }
  },


  // 重测我的语法水平
  updateAbilityMap() {
    // 检查是否有未完成的测试
    const grammarTestProgress = wx.getStorageSync('grammarTestProgress') || {};
    const writingTestProgress = wx.getStorageSync('writingTestProgress') || {};
    
    const hasGrammarProgress = Object.keys(grammarTestProgress).length > 0;
    const hasWritingProgress = Object.keys(writingTestProgress).length > 0;
    
    if (hasGrammarProgress || hasWritingProgress) {
      // 有未完成的测试，显示继续选项
      wx.showActionSheet({
        itemList: ['继续上一次的测试', '重测', '查看能力图谱'],
        success: (res) => {
          switch (res.tapIndex) {
            case 0: // 继续上一次的测试
              this.continueLastTest();
              break;
            case 1: // 重测
              this.startNewTest();
              break;
            case 2: // 查看能力图谱
              this.showAbilityMap();
              break;
          }
        }
      });
    } else {
      // 没有测试记录，直接开始新测试
      this.startNewTest();
    }
  },


  // 直接跳转到书写测试页面（保持兼容性）
  goToWritingTest() {
    wx.navigateTo({
      url: '/pages/ability-test/writing-test'
    });
  },

  // 开始新测试
  startNewTest() {
    wx.showActionSheet({
      itemList: ['语法检测', '书写检测'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0: // 语法检测
            this.startGrammarTest();
            break;
          case 1: // 书写检测
            this.startWritingTest();
            break;
        }
      }
    });
  },

  // 继续上一次的测试
  continueLastTest() {
    const grammarTestProgress = wx.getStorageSync('grammarTestProgress') || {};
    const writingTestProgress = wx.getStorageSync('writingTestProgress') || {};
    
    const grammarCompleted = this.isTestCompleted(grammarTestProgress, 'grammar');
    const writingCompleted = this.isTestCompleted(writingTestProgress, 'writing');
    
    if (grammarCompleted && writingCompleted) {
      wx.showModal({
        title: '测试完成',
        content: '厉害呀，您已测试过一轮语法点和书写规范了，可以点击重测或者查看能力图谱哦~',
        confirmText: '查看图谱',
        cancelText: '重测',
        success: (res) => {
          if (res.confirm) {
            this.showAbilityMap();
          } else {
            this.startNewTest();
          }
        }
      });
      return;
    }
    
    // 选择继续哪个测试
    const availableTests = [];
    if (!grammarCompleted) availableTests.push('语法检测');
    if (!writingCompleted) availableTests.push('书写检测');
    
    wx.showActionSheet({
      itemList: availableTests,
      success: (res) => {
        const testType = availableTests[res.tapIndex];
        if (testType === '语法检测') {
          this.continueGrammarTest();
        } else if (testType === '书写检测') {
          this.continueWritingTest();
        }
      }
    });
  },

  // 检查测试是否完成
  isTestCompleted(progress, testType) {
    if (testType === 'grammar') {
      // 检查语法测试是否完成
      const totalGrammarPoints = this.getTotalGrammarPoints();
      const testedPoints = Object.keys(progress).length;
      return testedPoints >= totalGrammarPoints;
    } else if (testType === 'writing') {
      // 检查书写测试是否完成
      const totalWritingTables = this.getTotalWritingTables();
      const testedTables = Object.keys(progress).length;
      return testedTables >= totalWritingTables;
    }
    return false;
  },

  // 获取语法点总数
  getTotalGrammarPoints() {
    // 这里可以根据实际的语法点分类来计算总数
    const grammarCategories = [
      "介词", "代词", "连词", "冠词", "名词", "动词",
      "谓语", "非谓语", "形容词", "副词", "定语从句", "状语和从句"
    ];
    return grammarCategories.length;
  },

  // 获取书写表格总数
  getTotalWritingTables() {
    // 这里可以根据实际的书写表格来计算总数
    return 20; // 示例数量
  },

  // 开始语法测试
  startGrammarTest() {
    // 初始化语法测试进度
    const progress = {};
    wx.setStorageSync('grammarTestProgress', progress);
    
    // 跳转到语法测试页面
    wx.navigateTo({
      url: '/pages/ability-test/grammar-test'
    });
  },

  // 继续语法测试
  continueGrammarTest() {
    wx.navigateTo({
      url: '/pages/ability-test/grammar-test'
    });
  },

  // 开始书写测试
  startWritingTest() {
    // 初始化书写测试进度
    const progress = {};
    wx.setStorageSync('writingTestProgress', progress);
    
    // 跳转到书写测试页面
    wx.navigateTo({
      url: '/pages/ability-test/writing-test'
    });
  },

  // 继续书写测试
  continueWritingTest() {
    wx.navigateTo({
      url: '/pages/ability-test/writing-test'
    });
  },

  // 显示能力图谱
  showAbilityMap() {
    wx.navigateTo({
      url: '/pages/ability-test/ability-map'
    });
  },


  // 计算语法水平评级
  calculateGrammarLevel(grammarCount) {
    if (grammarCount < 10) return 1;
    if (grammarCount < 20) return 2;
    if (grammarCount < 30) return 3;
    if (grammarCount < 40) return 4;
    return 5;
  },

  // 获取语法水平文本
  getGrammarLevelText(level) {
    const levels = ["初级", "中级", "高级", "专家", "大师"];
    return levels[level - 1];
  },

  // 初始化学习计划
  initLearningPlan() {
    const learningPlan = wx.getStorageSync('learningPlan');
    const reviewReminder = wx.getStorageSync('reviewReminder');
    
    this.setData({
      learningPlan: learningPlan,
      hasLearningPlan: !!learningPlan,
      reviewReminder: reviewReminder
    });
    
    // 检查复习提醒
    if (reviewReminder && reviewReminder.reminderSet) {
      this.checkReviewReminder(reviewReminder);
    }
  },

  // 检查复习提醒
  checkReviewReminder(reminder) {
    const now = Date.now();
    if (now >= reminder.nextReviewTime) {
      // 提醒时间到了
      this.showReviewReminder(reminder);
    }
  },

  // 显示复习提醒
  showReviewReminder(reminder) {
    const errorTables = reminder.errorTables || [];
    if (errorTables.length === 0) return;
    
    const tableNames = errorTables.slice(0, 3).map(t => t.name).join('、');
    
    wx.showModal({
      title: '复习提醒',
      content: `您之前在这些表格上出错较多：\n${tableNames}\n\n建议现在进行复习练习。`,
      confirmText: '开始复习',
      cancelText: '稍后提醒',
      success: (res) => {
        if (res.confirm) {
          // 跳转到第一个错误表格进行练习
          this.jumpToTablePractice(errorTables[0].id);
        } else {
          // 重新设置提醒（24小时后）
          this.resetReviewReminder();
        }
      }
    });
  },

  // 重新设置复习提醒
  resetReviewReminder() {
    const reminder = wx.getStorageSync('reviewReminder');
    if (reminder) {
      reminder.nextReviewTime = Date.now() + (24 * 60 * 60 * 1000);
      wx.setStorageSync('reviewReminder', reminder);
    }
  },

  // 跳转到表格练习
  jumpToTablePractice(tableId) {
    wx.navigateTo({
      url: `/pages/grammar-writing/index?practiceTable=${tableId}`,
      success: () => {
        wx.showToast({
          title: '已跳转到相关表格练习',
          icon: 'success'
        });
      }
    });
  },

  // 查看学习计划
  viewLearningPlan() {
    const learningPlan = this.data.learningPlan;
    if (!learningPlan) {
      wx.showToast({
        title: '暂无学习计划',
        icon: 'none'
      });
      return;
    }
    
    // 显示学习计划详情
    this.showLearningPlanDetails(learningPlan);
  },

  // 显示学习计划详情
  showLearningPlanDetails(plan) {
    let content = '📚 今日重点练习：\n';
    plan.daily.forEach((item, index) => {
      content += `${index + 1}. ${item.name} (${item.duration})\n`;
    });
    
    content += '\n📅 本周练习安排：\n';
    plan.weekly.forEach((item, index) => {
      content += `${index + 1}. ${item.name} (${item.frequency})\n`;
    });
    
    wx.showModal({
      title: '学习计划',
      content: content,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 清除学习计划
  clearLearningPlan() {
    wx.removeStorageSync('learningPlan');
    wx.removeStorageSync('reviewReminder');
    
    this.setData({
      learningPlan: null,
      hasLearningPlan: false,
      reviewReminder: null
    });
    
    wx.showToast({
      title: '学习计划已清除',
      icon: 'success'
    });
  }
});
