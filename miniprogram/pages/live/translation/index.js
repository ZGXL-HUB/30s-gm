// 翻译题：随机抽一句 → 书写 → 核对 → 加练 → 完成页（打卡/分享）
const liveService = require('../../utils/liveService.js');

const MAX_EXTRA = 2; // 最多加练 2 句

Page({
  data: {
    activityId: '',
    activity: null,
    sentences: [],
    current: null,
    userAnswer: '',
    checked: false,
    isCorrect: false,
    correctEn: '',
    translationHint: [],
    extraCount: 0,
    done: false,
    loading: true
  },

  onLoad(options) {
    const activityId = options.activityId || 'lesson1';
    const activity = liveService.getActivityConfig(activityId);
    const sentences = liveService.getTranslationSentences(activityId);
    const current = liveService.pickOneTranslation(sentences);

    this.setData({
      activityId,
      activity,
      sentences,
      current,
      loading: false
    });
    wx.setNavigationBarTitle({ title: '翻译题' });
  },

  onInput(e) {
    this.setData({ userAnswer: e.detail.value, checked: false });
  },

  submitCheck() {
    const { current, userAnswer } = this.data;
    if (!current) return;
    const { match: isCorrect, hint } = liveService.matchTranslationWithHint(userAnswer, current.en);
    this.setData({
      checked: true,
      isCorrect,
      correctEn: current.en,
      translationHint: hint || []
    });
  },

  goExtra() {
    const { sentences, extraCount } = this.data;
    if (extraCount >= MAX_EXTRA) {
      wx.showToast({ title: '已达加练上限', icon: 'none' });
      this.goDone();
      return;
    }
    const current = liveService.pickOneTranslation(sentences);
    this.setData({
      current,
      userAnswer: '',
      checked: false,
      extraCount: extraCount + 1
    });
  },

  goDone() {
    liveService.saveResult(this.data.activityId, 'translation', {
      completed: true,
      extraCount: this.data.extraCount
    });
    this.setData({ done: true });
  },

  backToActivity() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  },

  backToCourseList() {
    wx.redirectTo({ url: '/pages/live/course-list/index' });
  },

  onShareAppMessage() {
    const { activityId } = this.data;
    return {
      title: '我完成了今日语法学习，一起来打卡吧',
      path: `/pages/live/activity-index/index?activityId=${activityId || 'lesson1'}`
    };
  },

  onShareTimeline() {
    const { activityId } = this.data;
    return {
      title: '我完成了今日语法学习，一起来打卡吧',
      query: `activityId=${activityId || 'lesson1'}`
    };
  }
});
