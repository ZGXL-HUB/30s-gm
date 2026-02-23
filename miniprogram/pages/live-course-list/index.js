// 雅雅会考直播配套 · 十四节课列表（带已完成对勾）
const liveService = require('../../utils/liveService.js');

Page({
  data: {
    lessons: [],
    completedIds: []
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '雅雅会考直播配套' });
  },

  onShow() {
    const completedIds = liveService.getCompletedLessonIds();
    const lessons = [];
    for (let i = 1; i <= 14; i++) {
      const id = `lesson${i}`;
      lessons.push({
        id,
        name: `第${i}课`,
        completed: completedIds.indexOf(id) !== -1
      });
    }
    this.setData({ lessons, completedIds });
  },

  goToLesson(e) {
    const activityId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/live/activity-index/index?activityId=${activityId}`
    });
  }
});
