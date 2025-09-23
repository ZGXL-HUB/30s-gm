// 每日任务页面
// 演示DailyTaskCard组件的使用

Page({
  data: {
    userId: 'user_12345',
    continueStudyDays: 5
  },

  onLoad(options) {
    console.log('每日任务页面加载');
    
    // 可以从页面参数获取用户信息
    if (options.userId) {
      this.setData({ userId: options.userId });
    }
    if (options.continueStudyDays) {
      this.setData({ continueStudyDays: parseInt(options.continueStudyDays) });
    }
  },

  onShow() {
    console.log('每日任务页面显示');
  },

  // 处理题目更新事件
  onQuestionsUpdated(e) {
    const { tabType, questions, questionCount, estimatedTime } = e.detail;
    console.log(`题目更新: ${tabType} - ${questionCount}道题，预计${estimatedTime}分钟`);
    
    // 可以在这里处理题目更新逻辑
    // 比如更新页面状态、记录日志等
  },

  // 处理开始练习事件
  onStartPractice(e) {
    const { tabType, questions, questionCount, estimatedTime } = e.detail;
    console.log(`开始练习: ${tabType} - ${questionCount}道题`);
    
    // 跳转到练习页面
    wx.navigateTo({
      url: `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(questions))}&type=${tabType}&estimatedTime=${estimatedTime}`,
      success: () => {
        console.log('跳转到练习页面成功');
      },
      fail: (error) => {
        console.error('跳转到练习页面失败:', error);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 手动刷新组件
  refreshComponent() {
    const dailyTaskCard = this.selectComponent('#dailyTaskCard');
    if (dailyTaskCard) {
      dailyTaskCard.refreshQuestions();
    }
  },

  // 获取组件数据
  getComponentData() {
    const dailyTaskCard = this.selectComponent('#dailyTaskCard');
    if (dailyTaskCard) {
      const data = dailyTaskCard.getComponentData();
      console.log('组件数据:', data);
      
      wx.showModal({
        title: '组件数据',
        content: JSON.stringify(data, null, 2),
        showCancel: false
      });
    }
  },

  // 测试不同连续天数
  testDifferentDays() {
    wx.showActionSheet({
      itemList: ['3天以内 (8题)', '3-7天 (10题)', '7天以上 (15题)'],
      success: (res) => {
        const days = [2, 5, 10];
        const selectedDays = days[res.tapIndex];
        
        this.setData({ continueStudyDays: selectedDays });
        
        wx.showToast({
          title: `已设置为${selectedDays}天`,
          icon: 'success'
        });
      }
    });
  },

  // 测试不同用户
  testDifferentUsers() {
    wx.showActionSheet({
      itemList: ['用户A (语法活跃)', '用户B (书写活跃)', '用户C (平衡活跃)'],
      success: (res) => {
        const users = ['user_grammar_active', 'user_writing_active', 'user_balanced'];
        const selectedUser = users[res.tapIndex];
        
        this.setData({ userId: selectedUser });
        
        wx.showToast({
          title: `已切换到${selectedUser}`,
          icon: 'success'
        });
      }
    });
  }
});
