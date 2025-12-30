// 学生端个人中心页面
Page({
  data: {
    userInfo: null,
    isLoggedIn: false
  },

  onLoad() {
    this.loadUserInfo();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        isLoggedIn: true
      });
    }
  },

  // 跳转到加入班级页面
  goToJoinClass() {
    wx.navigateTo({
      url: '/pages/student-join-class/index'
    });
  },

  // 跳转到作业列表页面
  goToAssignments() {
    wx.navigateTo({
      url: '/pages/student-assignment-list/index'
    });
  },

  // 跳转到意见反馈页面
  goToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/index'
    });
  }
});
