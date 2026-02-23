// 第五环节：书写名词复数·单选题（2组，es规则，正确率不存云端）
const liveService = require('../../utils/liveService.js');
const sound = require('../../../utils/sound.js');

function getEncourage(rate) {
  return rate > 60 ? '表现不错，继续保持！' : '再练几遍会更熟练哦～';
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

Page({
  data: {
    activityId: '',
    sectionTitle: '第五环节：单选题，复数以es结尾的情况',
    groups: [],
    groupIndex: 0,
    questions: [],
    currentIndex: 0,
    score: 0,
    groupScore: 0,
    totalInGroup: 5,
    userAnswers: [],
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
    const groups = liveService.getEsChoiceGroups(activityId);
    if (!groups || groups.length === 0) {
      this.setData({ loading: false });
      wx.showToast({ title: '暂无题目', icon: 'none' });
      return;
    }
    const first = groups[0];
    const questions = (first.questions || []).map(q => ({
      ...q,
      option: shuffleArray(q.option || [])
    }));

    this.setData({
      activityId,
      groups,
      groupIndex: 0,
      questions,
      currentIndex: 0,
      hintContent: first.hint || '',
      totalInGroup: questions.length,
      userAnswers: [],
      loading: false
    });
    wx.setNavigationBarTitle({ title: '第五环节·书写名词复数' });
  },

  selectAnswer(e) {
    const answer = e.currentTarget.dataset.answer;
    const { questions, currentIndex, userAnswers, score } = this.data;
    if (userAnswers[currentIndex] !== undefined) return;
    const q = questions[currentIndex];
    const isCorrect = answer === q.answer;
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = answer;
    const newScore = score + (isCorrect ? 1 : 0);

    this.setData({
      userAnswers: newAnswers,
      score: newScore,
      groupScore: newScore
    });
    const next = currentIndex + 1;
    if (next >= questions.length) {
      const rate = questions.length > 0 ? Math.round((newScore / questions.length) * 100) : 0;
      sound.playToast();
      this.setData({
        showGroupResult: true,
        groupResultRate: rate,
        groupEncourage: getEncourage(rate)
      });
    } else {
      this.setData({ currentIndex: next });
    }
  },

  nextGroup() {
    const { groups, groupIndex, totalCorrect, totalQuestions } = this.data;
    const currentGroup = groups[groupIndex];
    const addTotal = (currentGroup.questions || []).length;
    const newTotalCorrect = totalCorrect + this.data.groupScore;
    const newTotalQuestions = totalQuestions + addTotal;

    const next = groupIndex + 1;
    if (next >= groups.length) {
      const finalRate = newTotalQuestions > 0 ? Math.round((newTotalCorrect / newTotalQuestions) * 100) : 0;
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.ES_PLURAL_CHOICE, { completed: true });
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
      option: shuffleArray(q.option || [])
    }));

    this.setData({
      groupIndex: next,
      questions,
      currentIndex: 0,
      hintContent: nextGroup.hint || '',
      totalInGroup: questions.length,
      userAnswers: [],
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
      skipConfirmMsg: isLastGroup ? '恭喜你完成了所有es规则的选择题！' : '是否进入下一组es规则的选择题？'
    });
  },

  skipConfirm() {
    const { groups, groupIndex, totalCorrect, totalQuestions } = this.data;
    const isLastGroup = groupIndex >= groups.length - 1;
    this.setData({ showSkipConfirm: false });

    if (isLastGroup) {
      const total = totalQuestions + (groups[groupIndex].questions || []).length;
      const finalRate = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.ES_PLURAL_CHOICE, { completed: true });
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

    const currentGroup = groups[groupIndex];
    const addTotal = (currentGroup.questions || []).length;
    const newTotalQuestions = totalQuestions + addTotal;
    const next = groupIndex + 1;
    const nextGroup = groups[next];
    const questions = (nextGroup.questions || []).map(q => ({
      ...q,
      option: shuffleArray(q.option || [])
    }));

    this.setData({
      groupIndex: next,
      questions,
      currentIndex: 0,
      hintContent: nextGroup.hint || '',
      totalInGroup: questions.length,
      userAnswers: [],
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

  goToNextSegment() {
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.ES_PLURAL_CHOICE, this.data.activityId);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    wx.redirectTo({ url: `${path}?activityId=${this.data.activityId}` });
  },

  backToActivity() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  }
});
