const { envList } = require('../../envList');

// pages/me/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    showTip: false,
    title:"",
    content:"",
    // 学习统计数据
    studyStats: {
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      studyDays: 0,
      todayQuestions: 0,
      wrongQuestions: 0
    },
    // 今日成就数据
    todayStats: {
      grammarCount: 0,
      writingCount: 0,
      wrongQuestionCount: 0,
      grammarLevel: '',
      grammarLevelText: ''
    },
    progressWidth: '0%',
    isAdmin: false, // 管理员标识，实际项目中应该从服务器获取
    // 用户信息
    userInfo: null,
    isLoggedIn: false
  },

  /**
   * 页面加载时的生命周期回调函数
   */
  onLoad() {
    console.log('用户中心页面加载');
    this.loadUserInfo();
    this.loadStudyStats();
  },

  /**
   * 页面显示时的生命周期回调函数
   */
  onShow() {
    // 每次显示页面时刷新数据
    this.loadUserInfo();
    this.loadStudyStats();
    this.updateTodayStats();
  },

  // 加载用户信息
  loadUserInfo() {
    const app = getApp();
    const userInfo = app.getUserInfo();
    const isLoggedIn = app.isUserLoggedIn();
    
    this.setData({
      userInfo: userInfo,
      isLoggedIn: isLoggedIn,
      openId: userInfo ? userInfo.openid : ''
    });
    
    console.log('用户信息加载完成:', userInfo);
  },

  // 加载学习统计数据
  loadStudyStats() {
    try {
      // 获取错题数据
      const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
      
      // 获取练习进度数据
      const practiceProgress = wx.getStorageSync('practiceProgress') || {};
      
      // 计算统计数据
      const totalQuestions = this.calculateTotalQuestions();
      const correctAnswers = this.calculateCorrectAnswers();
      const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      const studyDays = this.calculateStudyDays();
      const todayQuestions = this.calculateTodayQuestions();
      
      const studyStats = {
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
        accuracy: accuracy,
        studyDays: studyDays,
        todayQuestions: todayQuestions,
        wrongQuestions: wrongQuestions.length
      };
      
      this.setData({
        studyStats: studyStats
      });
      
      console.log('学习统计数据加载完成:', studyStats);
      
    } catch (error) {
      console.error('加载学习统计数据失败:', error);
    }
  },

  // 计算总题目数
  calculateTotalQuestions() {
    try {
      const practiceProgress = wx.getStorageSync('practiceProgress') || {};
      let total = 0;
      
      Object.values(practiceProgress).forEach(progress => {
        if (progress.totalQuestions) {
          total += progress.totalQuestions;
        }
      });
      
      return total;
    } catch (error) {
      console.error('计算总题目数失败:', error);
      return 0;
    }
  },

  // 计算正确答案数
  calculateCorrectAnswers() {
    try {
      const practiceProgress = wx.getStorageSync('practiceProgress') || {};
      let correct = 0;
      
      Object.values(practiceProgress).forEach(progress => {
        if (progress.correctAnswers) {
          correct += progress.correctAnswers;
        }
      });
      
      return correct;
    } catch (error) {
      console.error('计算正确答案数失败:', error);
      return 0;
    }
  },

  // 计算学习天数
  calculateStudyDays() {
    try {
      const firstStudyDate = wx.getStorageSync('firstStudyDate');
      if (!firstStudyDate) {
        return 0;
      }
      
      const firstDate = new Date(firstStudyDate);
      const today = new Date();
      const diffTime = Math.abs(today - firstDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error('计算学习天数失败:', error);
      return 0;
    }
  },

  // 计算今日题目数
  calculateTodayQuestions() {
    try {
      const today = new Date().toDateString();
      const todayProgress = wx.getStorageSync(`practiceProgress_${today}`) || {};
      
      let todayQuestions = 0;
      Object.values(todayProgress).forEach(progress => {
        if (progress.totalQuestions) {
          todayQuestions += progress.totalQuestions;
        }
      });
      
      return todayQuestions;
    } catch (error) {
      console.error('计算今日题目数失败:', error);
      return 0;
    }
  },

  getOpenId() {
    wx.showLoading({
      title: '获取用户信息...',
    });
    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getOpenId',
        },
      })
      .then((resp) => {
        this.setData({
          haveGetOpenId: true,
          openId: resp.result.openid,
        });
        wx.hideLoading();
        
        // 刷新用户信息
        this.loadUserInfo();
      })
      .catch((e) => {
        wx.hideLoading();
        const { errCode, errMsg } = e
        if (errMsg.includes('Environment not found')) {
          this.setData({
            showTip: true,
            title: "云开发环境未找到",
            content: "如果已经开通云开发，请检查环境ID与 `miniprogram/app.js` 中的 `env` 参数是否一致。"
          });
          return
        }
        if (errMsg.includes('FunctionName parameter could not be found')) {
          this.setData({
            showTip: true,
            title: "请上传云函数",
            content: "在'cloudfunctions/quickstartFunctions'目录右键，选择【上传并部署-云端安装依赖】，等待云函数上传完成后重试。"
          });
          return
        }
      });
  },

  gotoWxCodePage() {
    wx.navigateTo({
      url: `/pages/exampleDetail/index?envId=${envList?.[0]?.envId}&type=getMiniProgramCode`,
    });
  },

  // 跳转到加入班级页面
  goToJoinClass() {
    wx.navigateTo({
      url: '/pages/student-join-class/index'
    });
  },

  // 跳转到直播课活动首页（学生端，默认第1课，实际扫码会带 activityId）
  goToLiveActivity() {
    wx.navigateTo({
      url: '/pages/live/activity-index/index?activityId=lesson1'
    });
  },

  // 跳转到意见反馈页面
  goToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/index'
    });
  },

  // 跳转到管理员页面
  goToAdmin() {
    wx.navigateTo({
      url: '/pages/admin/feedback-management'
    });
  },

  // 获取今日日期字符串
  getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
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
      console.log('今日错题记录:', todayWrongQuestions);
      
      // 计算语法题统计（只统计正确的题目）
      const grammarCount = todayPractices.reduce((total, practice) => {
        return total + (practice.correct || 0);
      }, 0);
      
      // 计算书写题统计
      const writingCount = todayWriting.reduce((total, record) => {
        return total + (record.correctCount || 0);
      }, 0);
      
      // 计算错题统计
      const wrongQuestionCount = todayWrongQuestions.reduce((total, record) => {
        return total + (record.correctCount || 0);
      }, 0);
      
      // 获取语法水平
      const grammarLevel = wx.getStorageSync('grammarLevel') || '';
      const grammarLevelText = wx.getStorageSync('grammarLevelText') || '';
      
      // 计算进度条宽度
      const progressWidth = grammarCount > 0 ? `${Math.min((grammarCount / 20) * 100, 100)}%` : '0%';
      
      console.log('今日成就统计结果:', {
        grammarCount,
        writingCount,
        wrongQuestionCount,
        grammarLevel,
        grammarLevelText,
        progressWidth
      });
      
      this.setData({
        todayStats: {
          grammarCount,
          writingCount,
          wrongQuestionCount,
          grammarLevel,
          grammarLevelText
        },
        progressWidth
      });
      
    } catch (error) {
      console.error('更新今日成就统计失败:', error);
    }
  },
});
