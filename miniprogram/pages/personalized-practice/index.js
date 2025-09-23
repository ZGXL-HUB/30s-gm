// 个性化每日练习页面
const UserAbilityProfile = require('../../utils/userAbilityProfile.js');

Page({
  data: {
    loading: true,
    abilityProfile: null,
    recommendations: {
      dailyTasks: [],
      focusedPractice: [],
      comprehensivePractice: [],
      learningPath: []
    },
    selectedTask: null,
    showTaskDetail: false
  },

  onLoad(options) {
    // 解析推荐数据
    if (options.recommendations) {
      try {
        const recommendations = JSON.parse(decodeURIComponent(options.recommendations));
        this.setData({ recommendations });
      } catch (error) {
        console.error('解析推荐数据失败:', error);
      }
    }
    
    this.loadAbilityProfile();
  },

  // 加载用户能力画像
  loadAbilityProfile() {
    const abilityProfile = new UserAbilityProfile();
    abilityProfile.loadProfile();
    
    this.setData({
      abilityProfile: abilityProfile.getProfile(),
      loading: false
    });
  },

  // 点击每日任务
  onDailyTaskTap(e) {
    const taskIndex = e.currentTarget.dataset.index;
    const task = this.data.recommendations.dailyTasks[taskIndex];
    
    this.setData({
      selectedTask: task,
      showTaskDetail: true
    });
  },

  // 点击专项练习
  onFocusedPracticeTap(e) {
    const practiceIndex = e.currentTarget.dataset.index;
    const practice = this.data.recommendations.focusedPractice[practiceIndex];
    
    this.setData({
      selectedTask: practice,
      showTaskDetail: true
    });
  },

  // 点击综合练习
  onComprehensivePracticeTap(e) {
    const practiceIndex = e.currentTarget.dataset.index;
    const practice = this.data.recommendations.comprehensivePractice[practiceIndex];
    
    this.setData({
      selectedTask: practice,
      showTaskDetail: true
    });
  },

  // 开始练习
  startPractice() {
    const { selectedTask } = this.data;
    
    if (!selectedTask) {
      wx.showToast({
        title: '请选择练习内容',
        icon: 'none'
      });
      return;
    }

    // 根据练习类型跳转到对应页面
    this.navigateToPractice(selectedTask);
  },

  // 导航到练习页面
  navigateToPractice(task) {
    const { type, targetPoint, targetArea, questionCount, difficulty } = task;
    
    switch (type) {
      case 'weak_point_grammar':
      case 'balanced_grammar':
      case 'comprehensive_grammar':
        // 跳转到语法练习页面
        this.startGrammarPractice(task);
        break;
        
      case 'writing_practice':
      case 'writing_focused':
        // 跳转到书写练习页面
        this.startWritingPractice(task);
        break;
        
      case 'advanced_comprehensive':
      case 'intermediate_comprehensive':
      case 'basic_comprehensive':
        // 跳转到综合练习页面
        this.startComprehensivePractice(task);
        break;
        
      default:
        wx.showToast({
          title: '练习类型暂不支持',
          icon: 'none'
        });
    }
    
    this.closeTaskDetail();
  },

  // 开始语法练习
  startGrammarPractice(task) {
    const { targetPoint, questionCount, difficulty } = task;
    
    if (targetPoint) {
      // 专项语法练习
      wx.navigateTo({
        url: `/pages/exercise-page/index?mode=focused&targetPoint=${encodeURIComponent(targetPoint)}&count=${questionCount}&difficulty=${difficulty}`
      });
    } else {
      // 综合语法练习
      wx.navigateTo({
        url: `/pages/exercise-page/index?mode=comprehensive&count=${questionCount}&difficulty=${difficulty}`
      });
    }
  },

  // 开始书写练习
  startWritingPractice(task) {
    const { targetArea, questionCount, difficulty } = task;
    
    if (targetArea) {
      // 专项书写练习
      wx.navigateTo({
        url: `/pages/ability-test/simple-writing-test?mode=focused&targetArea=${encodeURIComponent(targetArea)}&count=${questionCount}`
      });
    } else {
      // 综合书写练习
      wx.navigateTo({
        url: `/pages/ability-test/simple-writing-test?mode=comprehensive&count=${questionCount}`
      });
    }
  },

  // 开始综合练习
  startComprehensivePractice(task) {
    const { questionCount, difficulty } = task;
    
    wx.navigateTo({
      url: `/pages/ability-test/comprehensive-writing-test?mode=personalized&count=${questionCount}&difficulty=${difficulty}`
    });
  },

  // 关闭任务详情
  closeTaskDetail() {
    this.setData({
      showTaskDetail: false,
      selectedTask: null
    });
  },

  // 重新评估能力
  reassessAbility() {
    wx.showModal({
      title: '重新评估能力',
      content: '重新评估将更新您的学习推荐，是否继续？',
      success: (res) => {
        if (res.confirm) {
          // 跳转到能力测试页面
          wx.navigateTo({
            url: '/pages/level-test/index'
          });
        }
      }
    });
  },

  // 查看学习路径
  viewLearningPath() {
    wx.navigateTo({
      url: '/pages/learning-path/index'
    });
  },

  // 刷新推荐
  refreshRecommendations() {
    wx.showLoading({
      title: '更新推荐中...'
    });
    
    // 重新生成推荐
    const abilityProfile = new UserAbilityProfile();
    abilityProfile.updateProfile();
    const recommendations = abilityProfile.generatePersonalizedRecommendations();
    
    this.setData({ recommendations });
    
    wx.hideLoading();
    wx.showToast({
      title: '推荐已更新',
      icon: 'success'
    });
  }
});
