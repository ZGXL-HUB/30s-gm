// 第十环节：一句话卡片（1句10空填空，完成后本课显示为已完成）
const liveService = require('../../../utils/liveService.js');
const sound = require('../../../utils/sound.js');

/** 多空答案顺序无关：同一分句内只要包含所有正确答案即算对，每个标准答案最多匹配一次 */
function countMatchOrderIndependent(userBlanks, correctBlanks) {
  const remain = correctBlanks.slice();
  let ok = 0;
  for (const u of userBlanks) {
    if (!u) continue;
    const idx = remain.indexOf(u);
    if (idx !== -1) {
      remain.splice(idx, 1);
      ok++;
    }
  }
  return ok;
}

function getEncourage(rate) {
  return rate > 60 ? '表现不错，继续保持！' : '再练几遍会更熟练哦～';
}

Page({
  data: {
    activityId: '',
    sectionTitle: '第十环节：一句话卡片',
    text: '',
    blanks: [],
    answers: [],
    checked: [],
    totalBlanks: 10,
    score: 0,
    showHint: false,
    hintContent: '',
    showSkipConfirm: false,
    allDone: false,
    correctRate: 0,
    encourageCopy: '',
    loading: true
  },

  onLoad(options) {
    const activityId = options.activityId || 'lesson1';
    const data = liveService.getSummaryCardData(activityId);
    if (!data || !data.blanks || data.blanks.length === 0) {
      this.setData({ loading: false });
      wx.showToast({ title: '暂无题目', icon: 'none' });
      return;
    }
    const blanks = data.blanks;
    const answers = blanks.map(() => '');
    const checked = blanks.map(() => false);

    this.setData({
      activityId,
      text: data.text || '',
      blanks,
      answers,
      checked,
      totalBlanks: blanks.length,
      hintContent: data.hint || '',
      loading: false
    });
    wx.setNavigationBarTitle({ title: '第十环节·一句话卡片' });
  },

  onBlankInput(e) {
    const bi = e.currentTarget.dataset.bi;
    const val = e.detail.value;
    const answers = [...this.data.answers];
    answers[bi] = val;
    this.setData({ answers });
  },

  checkAll() {
    const { answers, blanks } = this.data;
    const userBlanks = (answers || []).map(x => (x || '').trim().toLowerCase());
    const correctBlanks = (blanks || []).map(x => (x || '').trim().toLowerCase());
    const ok = countMatchOrderIndependent(userBlanks, correctBlanks);
    const newChecked = (blanks || []).map(() => true);
    const correctRate = blanks.length > 0 ? Math.round((ok / blanks.length) * 100) : 0;
    liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.SUMMARY_CARD, { completed: true });
    sound.playToast();
    this.setData({
      checked: newChecked,
      score: ok,
      allDone: true,
      correctRate,
      encourageCopy: getEncourage(correctRate)
    });
  },

  showHint() {
    sound.playTap();
    this.setData({ showHint: true });
  },

  hideHint() {
    sound.playTap();
    this.setData({ showHint: false });
  },

  skipSegment() {
    sound.playTap();
    this.setData({ showSkipConfirm: true });
  },

  skipConfirm() {
    sound.playTap();
    this.setData({ showSkipConfirm: false });
    liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.SUMMARY_CARD, { completed: true });
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  },

  skipCancel() {
    this.setData({ showSkipConfirm: false });
  },

  finishAndExit() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  },

  backToActivity() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  }
});
