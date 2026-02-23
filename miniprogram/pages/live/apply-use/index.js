// 第九环节：学以致用（5句填空共10空，正确率不存云端）
const liveService = require('../../utils/liveService.js');
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
    sectionTitle: '第九环节：学以致用',
    questions: [],
    currentIndex: 0,
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
    const { questions, hint } = liveService.getApplyUseData(activityId);
    if (!questions || questions.length === 0) {
      this.setData({ loading: false });
      wx.showToast({ title: '暂无题目', icon: 'none' });
      return;
    }
    const totalBlanks = questions.reduce((sum, q) => sum + (q.blanks && q.blanks.length || 0), 0);
    const answers = questions.map(q => (q.blanks || []).map(() => ''));
    const checked = questions.map(q => (q.blanks || []).map(() => false));

    this.setData({
      activityId,
      questions,
      currentIndex: 0,
      answers,
      checked,
      totalBlanks,
      hintContent: hint || '',
      loading: false
    });
    wx.setNavigationBarTitle({ title: '第九环节·学以致用' });
  },

  onBlankInput(e) {
    const { qi, bi } = e.currentTarget.dataset;
    const val = e.detail.value;
    const answers = [...this.data.answers];
    if (!answers[qi]) answers[qi] = [];
    answers[qi][bi] = val;
    this.setData({ answers });
  },

  checkQuestion() {
    const { questions, currentIndex, answers, checked, score, totalBlanks } = this.data;
    const q = questions[currentIndex];
    const userBlanks = (answers[currentIndex] || []).map(x => (x || '').trim().toLowerCase());
    const correctBlanks = (q.blanks || []).map(x => (x || '').trim().toLowerCase());
    const ok = countMatchOrderIndependent(userBlanks, correctBlanks);
    const newCheckedRow = (q.blanks || []).map(() => true);
    const newChecked = [...checked];
    newChecked[currentIndex] = newCheckedRow;
    const newScore = score + ok;
    const nextIndex = currentIndex + 1;
    const done = nextIndex >= questions.length;

    if (done) {
      const correctRate = totalBlanks > 0 ? Math.round((newScore / totalBlanks) * 100) : 0;
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.APPLY_USE, { completed: true });
      sound.playToast();
      this.setData({
        checked: newChecked,
        score: newScore,
        allDone: true,
        correctRate,
        encourageCopy: getEncourage(correctRate)
      });
    } else {
      this.setData({
        checked: newChecked,
        score: newScore,
        currentIndex: nextIndex
      });
    }
  },

  showHint() {
    this.setData({ showHint: true });
  },

  hideHint() {
    this.setData({ showHint: false });
  },

  skipSegment() {
    this.setData({ showSkipConfirm: true });
  },

  skipConfirm() {
    this.setData({ showSkipConfirm: false });
    liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.APPLY_USE, { completed: true });
    sound.playToast();
    this.setData({
      allDone: true,
      correctRate: 0,
      encourageCopy: getEncourage(0)
    });
  },

  skipCancel() {
    this.setData({ showSkipConfirm: false });
  },

  prevQuestion() {
    const idx = Math.max(0, this.data.currentIndex - 1);
    this.setData({ currentIndex: idx });
  },

  nextQuestion() {
    const idx = Math.min(this.data.questions.length - 1, this.data.currentIndex + 1);
    this.setData({ currentIndex: idx });
  },

  goToNextSegment() {
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.APPLY_USE, this.data.activityId);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    wx.redirectTo({ url: `${path}?activityId=${this.data.activityId}` });
  },

  backToActivity() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  }
});
