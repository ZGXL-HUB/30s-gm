// 第七环节：真题再练（填空，与第一环节对比，存本地+星级，无解析）
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

function getEncourageByStars(stars) {
  if (stars === 1) return '降低一颗星，多练几遍会更好～';
  if (stars === 2) return '持平两颗星，保持住～';
  return '进步三颗星，继续保持！';
}

Page({
  data: {
    activityId: '',
    sectionTitle: '第七环节：真题再练',
    questions: [],
    currentIndex: 0,
    answers: [],
    checked: [],
    score: 0,
    total: 0,
    completed: false,
    loading: true,
    correctRate: 0,
    firstRate: null,
    stars: null,
    encourageCopy: '',
    showHint: false,
    hintContent: '',
    showSkipConfirm: false,
    showResult: false
  },

  onLoad(options) {
    const activityId = options.activityId || 'lesson1';
    const questions = liveService.getRealRetestQuestions(activityId);
    const hintContent = liveService.getRealRetestHint(activityId);
    const total = questions.length;
    const answers = questions.map(q => Array.isArray(q.blanks) ? q.blanks.map(() => '') : ['']);
    const checked = questions.map(q => Array.isArray(q.blanks) ? q.blanks.map(() => false) : [false]);

    this.setData({
      activityId,
      questions,
      total,
      answers,
      checked,
      hintContent,
      loading: false
    });
    wx.setNavigationBarTitle({ title: '第七环节·真题再练' });
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
    const score = this.data.score + ok;
    const nextIndex = currentIndex + 1;
    const completed = nextIndex >= questions.length;

    if (completed) {
      const total = this.data.total;
      const correctRate = total > 0 ? Math.round((score / total) * 100) : 0;
      liveService.saveRealRetestResult(this.data.activityId, correctRate, score, total);
      const firstResult = liveService.getRealExamPrepracticeResult(this.data.activityId);
      const firstRate = firstResult && firstResult.correctRate != null ? firstResult.correctRate : null;
      const stars = liveService.getLesson1Stars(this.data.activityId);
      sound.playToast();
      this.setData({
        checked: newChecked,
        score,
        completed: true,
        correctRate,
        firstRate,
        stars: stars != null ? stars : 2,
        encourageCopy: getEncourageByStars(stars),
        showResult: true
      });
    } else {
      this.setData({
        checked: newChecked,
        score,
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
    const total = this.data.total || 7;
    const score = 0;
    const correctRate = 0;
    liveService.saveRealRetestResult(this.data.activityId, correctRate, score, total);
    const firstResult = liveService.getRealExamPrepracticeResult(this.data.activityId);
    const firstRate = firstResult && firstResult.correctRate != null ? firstResult.correctRate : null;
    const stars = liveService.getLesson1Stars(this.data.activityId);
    sound.playToast();
    this.setData({
      completed: true,
      showResult: true,
      score: 0,
      correctRate: 0,
      firstRate,
      stars: stars != null ? stars : 1,
      encourageCopy: getEncourageByStars(stars)
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

  backToActivity() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  },

  goToNextSegment() {
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.REAL_RETEST, this.data.activityId);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    wx.redirectTo({ url: `${path}?activityId=${this.data.activityId}` });
  }
});
