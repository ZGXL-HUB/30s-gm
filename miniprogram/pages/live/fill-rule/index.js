// 填空运用规则：10 题填空、即时核对、鼓励话术、中途退出挽留
const liveService = require('../../../utils/liveService.js');

const ENCOURAGE = {
  low: '别灰心，直播里再听一遍规则，下次一定更好～',
  mid: '不错哦，继续听直播巩固一下～',
  high: '很棒！保持住，直播见～'
};

Page({
  data: {
    activityId: '',
    questions: [],
    currentIndex: 0,
    answers: [],
    checked: [],
    score: 0,
    totalBlanks: 0,
    correctRate: 0,
    completed: false,
    loading: true,
    showLeave: false,
    questionResults: []
  },

  onLoad(options) {
    const activityId = options.activityId || 'lesson1';
    this.setData({ activityId });
    wx.setNavigationBarTitle({ title: '填空运用规则' });
    this.loadQuestions(activityId);
  },

  async loadQuestions(activityId) {
    wx.showLoading({ title: '加载中...' });
    try {
      const list = await liveService.getFillQuestions(activityId, liveService.SEGMENT_TYPES.FILL_RULE);
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
    const userBlanks = (answers[currentIndex] || []);
    const correctBlanks = q.blanks || [];
    let ok = 0;
    const checked = [...(this.data.checked[currentIndex] || [])];
    for (let i = 0; i < correctBlanks.length; i++) {
      const u = (userBlanks[i] || '').trim().toLowerCase();
      const c = (correctBlanks[i] || '').trim().toLowerCase();
      const right = u === c;
      checked[i] = true;
      if (right) ok++;
    }
    const newChecked = [...this.data.checked];
    newChecked[currentIndex] = checked;
    let score = this.data.score + ok;
    const nextIndex = currentIndex + 1;
    const completed = nextIndex >= questions.length;
    if (completed) {
      const rate = this.data.totalBlanks > 0 ? (score / this.data.totalBlanks) * 100 : 0;
      const copy = rate < 60 ? ENCOURAGE.low : rate < 80 ? ENCOURAGE.mid : ENCOURAGE.high;
      const questionResults = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const userBlanks = (this.data.answers[i] || []);
        const correctBlanks = q.blanks || [];
        let allRight = true;
        for (let j = 0; j < correctBlanks.length; j++) {
          const u = (userBlanks[j] || '').trim().toLowerCase();
          const c = (correctBlanks[j] || '').trim().toLowerCase();
          if (u !== c) { allRight = false; break; }
        }
        questionResults.push({
          text: q.text,
          userAnswer: userBlanks.join(' / '),
          correctAnswer: correctBlanks.join(' / '),
          isCorrect: allRight,
          analysis: q.analysis || ''
        });
      }
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.FILL_RULE, {
        score,
        total: this.data.totalBlanks,
        correctRate: Math.round(rate)
      });
      this.setData({
        checked: newChecked,
        score,
        completed: true,
        correctRate: Math.round(rate),
        encourageCopy: copy,
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
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.FILL_RULE);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    const url = path ? `${path}?activityId=${this.data.activityId}` : `/pages/live/activity-index/index?activityId=${this.data.activityId}`;
    wx.redirectTo({ url });
  }
});
