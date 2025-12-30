// 极简主界面
Page({
  data: {
    // 不需要复杂的数据，保持极简
  },

  onLoad() {
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: '语法练习系统'
    });
  },

  // 跳转到语法组卷（直接进入布置作业页面，跳过工作台界面）
  goToTeacherMode() {
    wx.navigateTo({
      url: '/pages/teacher/teacher-homework/index'
    });
  }
});
