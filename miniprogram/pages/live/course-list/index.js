// 雅雅会考配套练习 · 课堂配套练习列表（带已完成对勾）
const liveService = require('../../utils/liveService.js');

Page({
  data: {
    lessons: [],
    completedIds: []
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '雅雅会考配套练习' });
  },

  onShow() {
    const completedIds = liveService.getCompletedLessonIds();
    const lesson1Stars = liveService.getLesson1Stars('lesson1');
    const lessons = [];
    // 仅展示第1课，第2–14课卡片暂时隐藏
    for (let i = 1; i <= 1; i++) {
      const id = `lesson${i}`;
      lessons.push({
        id,
        name: `第${i}课`,
        completed: completedIds.indexOf(id) !== -1,
        stars: id === 'lesson1' ? lesson1Stars : null
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
