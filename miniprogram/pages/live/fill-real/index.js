// 真题填空：填空 + 即时核对 + 与课前正确率对比 + 挽留
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

function getEncourage(rate, preRate) {
  if (preRate == null) return rate >= 80 ? '很棒！' : rate >= 60 ? '不错哦，继续加油～' : '再听一遍直播，下次会更好～';
  const diff = rate - preRate;
  if (diff >= 15) return '提升很明显，继续保持！';
  if (diff >= 0) return '有进步，直播没白听～';
  return '别灰心，多练几遍会更好～';
}

Page({
  data: {
    activityId: '',
    questions: [],
    currentIndex: 0,
    answers: [],
    checked: [],
    score: 0,
    totalBlanks: 0,
    completed: false,
    loading: true,
    showLeave: false,
    preRate: null,
    preRateLabel: '课前',
    currentRate: 0,
    correctRate: 0,
    encourageCopy: '',
    questionResults: []
  },

  onLoad(options) {
    const activityId = options.activityId || 'lesson1';
    const prepracticeResult = activityId === 'lesson1' ? liveService.getRealExamPrepracticeResult(activityId) : null;
    const prevResult = liveService.getPreTestResult(activityId);
    const preRate = (prepracticeResult && prepracticeResult.correctRate != null)
      ? prepracticeResult.correctRate
      : (prevResult ? prevResult.correctRate : null);
    const preRateLabel = activityId === 'lesson1' && prepracticeResult ? '第一环节' : '课前';
    this.setData({ activityId, preRate, preRateLabel });
    wx.setNavigationBarTitle({ title: '真题填空' });
    this.loadQuestions(activityId);
  },

  async loadQuestions(activityId) {
    wx.showLoading({ title: '加载中...' });
    try {
      const list = await liveService.getFillQuestions(activityId, liveService.SEGMENT_TYPES.FILL_REAL);
      const questions = (list || []).map(q => ({
        ...q,
        blanks: Array.isArray(q.blanks) ? q.blanks : [q.answer || q.blanks]
      }));
      const totalBlanks = questions.reduce((sum, q) => sum + (q.blanks && q.blanks.length || 0), 0);
      const answers = questions.map(q => (q.blanks || []).map(() => ''));
      const checked = questions.map(q => (q.blanks || []).map(() => false));
      this.setData({
        questions,
        answers,
        checked,
        totalBlanks,
        loading: false
      });
    } catch (e) {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
    wx.hideLoading();
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
    const { questions, currentIndex, answers } = this.data;
    const q = questions[currentIndex];
    const userBlanks = (answers[currentIndex] || []).map(x => (x || '').trim().toLowerCase());
    const correctBlanks = (q.blanks || []).map(x => (x || '').trim().toLowerCase());
    const ok = countMatchOrderIndependent(userBlanks, correctBlanks);
    const checked = (q.blanks || []).map(() => true);
    const newChecked = [...this.data.checked];
    newChecked[currentIndex] = checked;
    let score = this.data.score + ok;
    const nextIndex = currentIndex + 1;
    const completed = nextIndex >= questions.length;
    if (completed) {
      const currentRate = this.data.totalBlanks > 0 ? Math.round((score / this.data.totalBlanks) * 100) : 0;
      const encourageCopy = getEncourage(currentRate, this.data.preRate);
      const questionResults = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const ub = (this.data.answers[i] || []).map(x => (x || '').trim().toLowerCase());
        const cb = (q.blanks || []).map(x => (x || '').trim().toLowerCase());
        const allRight = countMatchOrderIndependent(ub, cb) === cb.length;
        questionResults.push({
          text: q.text,
          userAnswer: (this.data.answers[i] || []).join(' / '),
          correctAnswer: (q.blanks || []).join(' / '),
          isCorrect: allRight,
          analysis: q.analysis || ''
        });
      }
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.FILL_REAL, {
        score,
        total: this.data.totalBlanks,
        correctRate: currentRate,
        preRate: this.data.preRate
      });
      sound.playToast();
      this.setData({
        checked: newChecked,
        score,
        completed: true,
        currentRate,
        correctRate: currentRate,
        encourageCopy,
        questionResults
      });
    } else {
      this.setData({
        checked: newChecked,
        score,
        currentIndex: nextIndex
      });
    }
  },

  prevQuestion() {
    const idx = Math.max(0, this.data.currentIndex - 1);
    this.setData({ currentIndex: idx });
  },

  nextQuestion() {
    const idx = Math.min(this.data.questions.length - 1, this.data.currentIndex + 1);
    this.setData({ currentIndex: idx });
  },

  backToActivity() {
    if (!this.data.completed && this.data.questions.length > 0) {
      this.setData({ showLeave: true });
      return;
    }
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  },

  leaveConfirm() {
    this.setData({ showLeave: false });
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  },

  leaveCancel() {
    this.setData({ showLeave: false });
  },

  goToNextSegment() {
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.FILL_REAL, this.data.activityId);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    const url = path ? `${path}?activityId=${this.data.activityId}` : `/pages/live/activity-index/index?activityId=${this.data.activityId}`;
    wx.redirectTo({ url });
  }
});
