// 直播课 · 活动首页（连贯流程：自动进入第一个未完成环节，全部完成后可再练）
const liveService = require('../../../utils/liveService.js');

Page({
  data: {
    activityId: '',
    activity: null,
    loading: true,
    error: '',
    showCompleted: false  // 本课已全部完成，展示再练列表
  },

  onLoad(options) {
    const scene = options.scene || '';
    const activityId = liveService.parseActivityId(scene, options) || options.activityId || 'lesson1';
    const activity = liveService.getActivityConfig(activityId);
    const showMenu = options.showMenu === '1' || options.showMenu === 'true';

    if (!activity) {
      this.setData({
        loading: false,
        error: '未找到该活动，请检查链接或联系老师。',
        activityId
      });
      return;
    }

    // 仅当从「返回活动首页」进入（showMenu=1）时展示本课已完成列表；从课程列表/扫码进入一律进入完整重练流程
    if (showMenu) {
      this.setData({
        activityId,
        activity,
        loading: false,
        error: '',
        showCompleted: true
      });
      wx.setNavigationBarTitle({ title: activity.lessonName || '直播课' });
      return;
    }

    const path = liveService.getSegmentPagePath(liveService.SEGMENT_TYPES.PRE_CLASS_TEST);
    if (path) {
      wx.redirectTo({
        url: `${path}?activityId=${activityId}`,
        fail: () => {
          this.setData({ activityId, activity, loading: false, showCompleted: true });
        }
      });
    } else {
      this.setData({ activityId, activity, loading: false, showCompleted: true });
    }
  },

  goSegment(e) {
    const { type } = e.currentTarget.dataset;
    const { activityId } = this.data;
    if (!activityId) return;
    const path = liveService.getSegmentPagePath(type);
    if (path) {
      wx.navigateTo({ url: `${path}?activityId=${activityId}&rePractice=1` });
    }
  },

  backToCourseList() {
    wx.navigateBack({ fail: () => wx.reLaunch({ url: '/pages/live-course-list/index' }) });
  },

  onShareAppMessage() {
    const { activityId } = this.data;
    return {
      title: '语法直播课 · 一起来练习',
      path: `/pages/live/activity-index/index?activityId=${activityId || 'lesson1'}`
    };
  }
});
