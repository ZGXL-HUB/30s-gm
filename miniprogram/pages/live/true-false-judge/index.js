// 第四环节：正误判断（3组，√×判断句子是否符合 some/many/数字+名词复数，正确率不存云端）
const liveService = require('../../utils/liveService.js');
const sound = require('../../../utils/sound.js');

function getEncourage(rate) {
  return rate > 60 ? '表现不错，继续保持！' : '再练几遍会更熟练哦～';
}

Page({
  data: {
    activityId: '',
    sectionTitle: '第四环节：正误判断，符合some、many和数字+名词复数的题目打勾，错误打叉，注意there are+名词复数',
    groups: [],
    groupIndex: 0,
    sentenceIndex: 0,
    sentences: [],
    currentSentence: null,
    score: 0,
    groupScore: 0,
    totalInGroup: 10,
    answered: [],
    userChoice: [],
    showFeedback: false,
    feedbackCorrect: false,
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
    const groups = liveService.getTrueFalseGroups(activityId);
    if (!groups || groups.length === 0) {
      this.setData({ loading: false });
      wx.showToast({ title: '暂无题目', icon: 'none' });
      return;
    }
    const first = groups[0];
    const sentences = first.sentences || [];

    this.setData({
      activityId,
      groups,
      groupIndex: 0,
      sentenceIndex: 0,
      sentences,
      currentSentence: sentences[0] || null,
      hintContent: first.hint || '',
      totalInGroup: sentences.length,
      answered: [],
      userChoice: [],
      loading: false
    });
    wx.setNavigationBarTitle({ title: '第四环节·正误判断' });
  },

  tapRight(e) {
    this._tapChoice(true);
  },

  tapWrong(e) {
    this._tapChoice(false);
  },

  _tapChoice(userSaidRight) {
    const { answered, sentences, sentenceIndex, score, userChoice } = this.data;
    if (answered[sentenceIndex]) return;
    const item = sentences[sentenceIndex];
    const correct = item && item.correct === true;
    const isCorrect = userSaidRight === correct;
    const newAnswered = [...answered];
    newAnswered[sentenceIndex] = true;
    const newChoice = [...userChoice];
    newChoice[sentenceIndex] = userSaidRight;
    const newScore = isCorrect ? score + 1 : score;

    this.setData({
      answered: newAnswered,
      userChoice: newChoice,
      showFeedback: true,
      feedbackCorrect: isCorrect,
      score: newScore,
      groupScore: newScore
    });
    const that = this;
    setTimeout(function () { that.nextSentence(); }, 1500);
  },

  nextSentence() {
    const { sentenceIndex, sentences, groupScore, totalInGroup } = this.data;
    const next = sentenceIndex + 1;
    if (next >= sentences.length) {
      const rate = totalInGroup > 0 ? Math.round((groupScore / totalInGroup) * 100) : 0;
      sound.playToast();
      this.setData({
        showGroupResult: true,
        groupResultRate: rate,
        groupEncourage: getEncourage(rate),
        showFeedback: false
      });
      return;
    }
    this.setData({
      sentenceIndex: next,
      currentSentence: this.data.sentences[next] || null,
      showFeedback: false
    });
  },

  nextGroup() {
    const { groups, groupIndex, totalCorrect, totalQuestions } = this.data;
    const currentGroup = groups[groupIndex];
    const addTotal = (currentGroup.sentences || []).length;
    const newTotalCorrect = totalCorrect + this.data.groupScore;
    const newTotalQuestions = totalQuestions + addTotal;

    const next = groupIndex + 1;
    if (next >= groups.length) {
      const finalRate = newTotalQuestions > 0 ? Math.round((newTotalCorrect / newTotalQuestions) * 100) : 0;
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.TRUE_FALSE_JUDGE, { completed: true });
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
    const sentences = nextGroup.sentences || [];

    this.setData({
      groupIndex: next,
      sentenceIndex: 0,
      sentences,
      currentSentence: sentences[0] || null,
      hintContent: nextGroup.hint || '',
      totalInGroup: sentences.length,
      answered: [],
      userChoice: [],
      groupScore: 0,
      score: 0,
      totalCorrect: newTotalCorrect,
      totalQuestions: newTotalQuestions,
      showGroupResult: false,
      showFeedback: false
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
      skipConfirmMsg: isLastGroup ? '恭喜你完成所有复数规则的判断题！' : '是否进入下一组复数规则的判断题？'
    });
  },

  skipConfirm() {
    const { groups, groupIndex, totalCorrect, totalQuestions } = this.data;
    const isLastGroup = groupIndex >= groups.length - 1;
    this.setData({ showSkipConfirm: false });

    if (isLastGroup) {
      const total = totalQuestions + (groups[groupIndex].sentences || []).length;
      const finalRate = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.TRUE_FALSE_JUDGE, { completed: true });
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
    const addTotal = (currentGroup.sentences || []).length;
    const newTotalQuestions = totalQuestions + addTotal;
    const next = groupIndex + 1;
    const nextGroup = groups[next];
    const sentences = nextGroup.sentences || [];

    this.setData({
      groupIndex: next,
      sentenceIndex: 0,
      sentences,
      currentSentence: sentences[0] || null,
      hintContent: nextGroup.hint || '',
      totalInGroup: sentences.length,
      answered: [],
      userChoice: [],
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
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.TRUE_FALSE_JUDGE, this.data.activityId);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    wx.redirectTo({ url: `${path}?activityId=${this.data.activityId}` });
  },

  backToActivity() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  }
});
