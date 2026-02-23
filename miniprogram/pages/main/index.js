// 极简主界面
Page({
  data: {
    // 不需要复杂的数据，保持极简
  },

  onLoad() {
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: '30s语法组题'
    });
  },

  // 跳转到高中语法组卷（直接进入布置作业页面，跳过工作台界面）
  goToHighSchool() {
    wx.navigateTo({
      url: '/pages/teacher/teacher-homework/index'
    });
  },

  // 跳转到初中语法组卷（独立页面）
  goToMiddleSchool() {
    wx.navigateTo({
      url: '/pages/teacher/teacher-homework-middle/index'
    });
  },

  // 跳转到雅雅会考直播配套：十四节课列表
  goToLiveCourseList() {
    wx.navigateTo({
      url: '/pages/live-course-list/index'
    });
  }
});
