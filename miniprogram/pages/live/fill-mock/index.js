// 第六环节：模拟演练（2组填空，每组10空，正确率不存云端）
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
    sectionTitle: '第六环节：模拟演练',
    groups: [],
    groupIndex: 0,
    questions: [],
    currentIndex: 0,
    answers: [],
    checked: [],
    totalBlanks: 0,
    score: 0,
    groupScore: 0,
    showGroupResult: false,
    groupResultRate: 0,
    groupEncourage: '',
    showHint: false,
    hintContent: '',
    showSkipConfirm: false,
    skipConfirmMsg: '',
    allDone: false,
    totalCorrect: 0,
    totalQuestions: 0,
    finalRate: 0,
    finalEncourage: '',
    loading: true
  },

  onLoad(options) {
    const activityId = options.activityId || 'lesson1';
    const groups = liveService.getFillMockGroups(activityId);
    if (!groups || groups.length === 0) {
      this.setData({ loading: false });
      wx.showToast({ title: '暂无题目', icon: 'none' });
      return;
    }
    const first = groups[0];
    const questions = (first.questions || []).map(q => ({
      ...q,
      blanks: Array.isArray(q.blanks) ? q.blanks : [q.blanks]
    }));
    const totalBlanks = questions.reduce((sum, q) => sum + (q.blanks && q.blanks.length || 0), 0);
    const answers = questions.map(q => (q.blanks || []).map(() => ''));
    const checked = questions.map(q => (q.blanks || []).map(() => false));

    this.setData({
      activityId,
      groups,
      groupIndex: 0,
      questions,
      currentIndex: 0,
      answers,
      checked,
      totalBlanks,
      hintContent: first.hint || '',
      loading: false
    });
    wx.setNavigationBarTitle({ title: '第六环节·模拟演练' });
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
    const groupDone = nextIndex >= questions.length;

    if (groupDone) {
      const rate = totalBlanks > 0 ? Math.round((newScore / totalBlanks) * 100) : 0;
      sound.playToast();
      this.setData({
        checked: newChecked,
        score: newScore,
        groupScore: newScore,
        showGroupResult: true,
        groupResultRate: rate,
        groupEncourage: getEncourage(rate)
      });
    } else {
      this.setData({
        checked: newChecked,
        score: newScore,
        groupScore: newScore,
        currentIndex: nextIndex
      });
    }
  },

  nextGroup() {
    const { groups, groupIndex, totalCorrect, totalQuestions } = this.data;
    const currentGroup = groups[groupIndex];
    const addTotal = this.data.totalBlanks || 0;
    const newTotalCorrect = totalCorrect + this.data.groupScore;
    const newTotalQuestions = totalQuestions + addTotal;

    const next = groupIndex + 1;
    if (next >= groups.length) {
      const finalRate = newTotalQuestions > 0 ? Math.round((newTotalCorrect / newTotalQuestions) * 100) : 0;
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.FILL_MOCK, { completed: true });
      sound.playToast();
      this.setData({
        allDone: true,
        totalCorrect: newTotalCorrect,
        totalQuestions: newTotalQuestions,
        finalRate,
        finalEncourage: getEncourage(finalRate),
        showGroupResult: false
      });
      return;
    }

    const nextGroup = groups[next];
    const questions = (nextGroup.questions || []).map(q => ({
      ...q,
      blanks: Array.isArray(q.blanks) ? q.blanks : [q.blanks]
    }));
    const totalBlanks = questions.reduce((sum, q) => sum + (q.blanks && q.blanks.length || 0), 0);
    const answers = questions.map(q => (q.blanks || []).map(() => ''));
    const checked = questions.map(q => (q.blanks || []).map(() => false));

    this.setData({
      groupIndex: next,
      questions,
      currentIndex: 0,
      answers,
      checked,
      totalBlanks,
      hintContent: nextGroup.hint || '',
      groupScore: 0,
      score: 0,
      totalCorrect: newTotalCorrect,
      totalQuestions: newTotalQuestions,
      showGroupResult: false
    });
  },

  showHint() {
    this.setData({ showHint: true });
  },

  hideHint() {
    this.setData({ showHint: false });
  },

  skipSegment() {
    const { groupIndex, groups } = this.data;
    const isLastGroup = groupIndex >= groups.length - 1;
    this.setData({
      showSkipConfirm: true,
      skipConfirmMsg: isLastGroup ? '恭喜你完成名词复数规则的模拟题！' : '是否进入下一组名词复数规则的改错题？'
    });
  },

  skipConfirm() {
    const { groups, groupIndex, totalCorrect, totalQuestions } = this.data;
    const isLastGroup = groupIndex >= groups.length - 1;
    this.setData({ showSkipConfirm: false });

    if (isLastGroup) {
      const total = totalQuestions + (this.data.totalBlanks || 0);
      const finalRate = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.FILL_MOCK, { completed: true });
      sound.playToast();
      this.setData({
        allDone: true,
        totalCorrect,
        totalQuestions: total,
        finalRate,
        finalEncourage: getEncourage(finalRate)
      });
      return;
    }

    const addTotal = this.data.totalBlanks || 0;
    const newTotalQuestions = totalQuestions + addTotal;
    const next = groupIndex + 1;
    const nextGroup = groups[next];
    const questions = (nextGroup.questions || []).map(q => ({
      ...q,
      blanks: Array.isArray(q.blanks) ? q.blanks : [q.blanks]
    }));
    const totalBlanks = questions.reduce((sum, q) => sum + (q.blanks && q.blanks.length || 0), 0);
    const answers = questions.map(q => (q.blanks || []).map(() => ''));
    const checked = questions.map(q => (q.blanks || []).map(() => false));

    this.setData({
      groupIndex: next,
      questions,
      currentIndex: 0,
      answers,
      checked,
      totalBlanks,
      hintContent: nextGroup.hint || '',
      groupScore: 0,
      score: 0,
      totalCorrect,
      totalQuestions: newTotalQuestions,
      showGroupResult: false
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
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.FILL_MOCK, this.data.activityId);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    wx.redirectTo({ url: `${path}?activityId=${this.data.activityId}` });
  },

  backToActivity() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  }
});
