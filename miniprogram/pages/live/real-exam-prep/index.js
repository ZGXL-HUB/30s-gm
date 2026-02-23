// 第一环节：真题预练（填空，正确率仅存本地供最后环节对比，无解析）
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

function getEncourageByTier(rate) {
  if (rate >= 80) return '表现很棒，继续保持！';
  if (rate >= 60) return '不错哦，继续加油～';
  return '再听一遍直播，下次会更好～';
}

Page({
  data: {
    activityId: '',
    sectionTitle: '第一环节：真题预练',
    questions: [],
    currentIndex: 0,
    answers: [],
    checked: [],
    score: 0,
    total: 0,
    completed: false,
    loading: true,
    correctRate: 0,
    encourageCopy: '',
    showHint: false,
    hintContent: '',
    showSkipConfirm: false,
    showResult: false
  },

  onLoad(options) {
    const activityId = options.activityId || 'lesson1';
    const questions = liveService.getRealExamPrepracticeQuestions(activityId);
    const hintContent = liveService.getRealExamPrepracticeHint(activityId);
    const total = questions.length;
    const answers = questions.map(() => ['']);
    const checked = questions.map(() => [false]);

    this.setData({
      activityId,
      questions,
      total,
      answers,
      checked,
      hintContent,
      loading: false
    });
    wx.setNavigationBarTitle({ title: '第一环节·真题预练' });
  },

  onBlankInput(e) {
    const { qi, bi } = e.currentTarget.dataset;
    const val = e.detail.value;
    const answers = [...this.data.answers];
    if (!answers[qi]) answers[qi] = [];
    answers[qi][bi] = val;
    this.setData({ answers });
  },

  /** 对当前题判分（多空时顺序无关：同一分句内答案集合一致即对）；若已判过则不再重复加分 */
  scoreCurrentQuestion() {
    const { questions, currentIndex, answers, checked, score } = this.data;
    const q = questions[currentIndex];
    const alreadyChecked = (checked[currentIndex] || []).every(Boolean);
    if (alreadyChecked && (checked[currentIndex] || []).length === (q.blanks || []).length) {
      return { score, nextIndex: currentIndex + 1, questionsLength: questions.length };
    }
    const userBlanks = (answers[currentIndex] || []).map(x => (x || '').trim().toLowerCase());
    const correctBlanks = (q.blanks || []).map(x => (x || '').trim().toLowerCase());
    const ok = countMatchOrderIndependent(userBlanks, correctBlanks);
    const newCheckedRow = (q.blanks || []).map(() => true);
    const newChecked = [...checked];
    newChecked[currentIndex] = newCheckedRow;
    const newScore = score + ok;
    this.setData({ checked: newChecked, score: newScore });
    return { score: newScore, nextIndex: currentIndex + 1, questionsLength: questions.length };
  },

  submitOrNext() {
    const { questions, currentIndex } = this.data;
    const { score, nextIndex, questionsLength } = this.scoreCurrentQuestion();
    const completed = nextIndex >= questionsLength;
    if (completed) {
      const correctRate = this.data.total > 0 ? Math.round((score / this.data.total) * 100) : 0;
      liveService.saveRealExamPrepracticeResult(this.data.activityId, correctRate, score, this.data.total);
      sound.playToast();
      this.setData({
        score,
        completed: true,
        correctRate,
        encourageCopy: getEncourageByTier(correctRate),
        showResult: true
      });
    } else {
      this.setData({ score, currentIndex: nextIndex });
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
    liveService.saveRealExamPrepracticeResult(this.data.activityId, correctRate, score, total);
    sound.playToast();
    this.setData({
      completed: true,
      showResult: true,
      score: 0,
      correctRate: 0,
      encourageCopy: getEncourageByTier(0)
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
    this.submitOrNext();
  },

  backToActivity() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  },

  goToNextSegment() {
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.REAL_EXAM_PREPRACTICE, this.data.activityId);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    wx.redirectTo({ url: `${path}?activityId=${this.data.activityId}` });
  }
});
