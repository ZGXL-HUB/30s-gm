// 第三环节：复数形式识别（3组，点击句中 some/many/数字 修饰的名词复数，正确率不存云端）
const liveService = require('../../utils/liveService.js');
const sound = require('../../../utils/sound.js');

function normalize(s) {
  return (s || '').trim().toLowerCase().replace(/[.,?!'']+$/g, '');
}

function buildTokens(text, correctWord) {
  const tokens = (text || '').split(/\s+/).filter(Boolean);
  const c = normalize(correctWord);
  return tokens.map(w => ({
    word: w,
    isCorrect: normalize(w) === c
  }));
}

function getEncourage(rate) {
  return rate > 60 ? '表现不错，继续保持！' : '再练几遍会更熟练哦～';
}

Page({
  data: {
    activityId: '',
    sectionTitle: '第三环节：复数形式识别，请点击some、many和数字修饰的名词复数',
    groups: [],
    groupIndex: 0,
    sentenceIndex: 0,
    sentences: [],
    tokensList: [],
    currentTokens: [],
    score: 0,
    groupScore: 0,
    totalInGroup: 10,
    answered: [],
    selectedIndex: -1,
    showFeedback: false,
    feedbackCorrect: false,
    feedbackAnswer: '',
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
    const groups = liveService.getPluralFormGroups(activityId);
    if (!groups || groups.length === 0) {
      this.setData({ loading: false });
      wx.showToast({ title: '暂无题目', icon: 'none' });
      return;
    }
    const first = groups[0];
    const sentences = first.sentences || [];
    const tokensList = sentences.map(s => buildTokens(s.text, s.correctWord));

    this.setData({
      activityId,
      groups,
      groupIndex: 0,
      sentenceIndex: 0,
      sentences,
      tokensList,
      currentTokens: tokensList[0] || [],
      hintContent: first.hint || '',
      totalInGroup: sentences.length,
      answered: [],
      loading: false
    });
    wx.setNavigationBarTitle({ title: '第三环节·复数形式识别' });
  },

  tapWord(e) {
    const ti = e.currentTarget.dataset.ti;
    const { answered, sentences, sentenceIndex, score, currentTokens } = this.data;
    if (answered[sentenceIndex]) return;
    const tokens = currentTokens || [];
    const isCorrect = tokens[ti] && tokens[ti].isCorrect;
    const correctToken = (sentences[sentenceIndex] && sentences[sentenceIndex].correctWord) || '';
    const newAnswered = [...answered];
    newAnswered[sentenceIndex] = true;
    const newScore = isCorrect ? score + 1 : score;

    this.setData({
      answered: newAnswered,
      selectedIndex: parseInt(ti, 10),
      showFeedback: true,
      feedbackCorrect: isCorrect,
      feedbackAnswer: correctToken,
      score: newScore,
      groupScore: newScore
    });
    const that = this;
    setTimeout(function () { that.nextSentence(); }, 1500);
  },

  nextSentence() {
    const { sentenceIndex, sentences, groupScore, totalInGroup, tokensList } = this.data;
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
      currentTokens: tokensList[next] || [],
      showFeedback: false,
      selectedIndex: -1
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
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.PLURAL_FORM_RECOGNITION, { completed: true });
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
    const tokensList = sentences.map(s => buildTokens(s.text, s.correctWord));

    this.setData({
      groupIndex: next,
      sentenceIndex: 0,
      sentences,
      tokensList,
      currentTokens: tokensList[0] || [],
      hintContent: nextGroup.hint || '',
      totalInGroup: sentences.length,
      answered: [],
      groupScore: 0,
      score: 0,
      totalCorrect: newTotalCorrect,
      totalQuestions: newTotalQuestions,
      showGroupResult: false,
      showFeedback: false,
      selectedIndex: -1
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
      skipConfirmMsg: isLastGroup ? '恭喜你完成所有复数形式识别题' : '是否进入下一组复数形式识别？'
    });
  },

  skipConfirm() {
    const { groups, groupIndex, totalCorrect, totalQuestions } = this.data;
    const isLastGroup = groupIndex >= groups.length - 1;
    this.setData({ showSkipConfirm: false });

    if (isLastGroup) {
      const total = totalQuestions + (groups[groupIndex].sentences || []).length;
      const finalRate = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.PLURAL_FORM_RECOGNITION, { completed: true });
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
    const newTotalCorrect = totalCorrect;
    const newTotalQuestions = totalQuestions + addTotal;
    const next = groupIndex + 1;
    const nextGroup = groups[next];
    const sentences = nextGroup.sentences || [];
    const tokensList = sentences.map(s => buildTokens(s.text, s.correctWord));

    this.setData({
      groupIndex: next,
      sentenceIndex: 0,
      sentences,
      tokensList,
      currentTokens: tokensList[0] || [],
      hintContent: nextGroup.hint || '',
      totalInGroup: sentences.length,
      answered: [],
      groupScore: 0,
      score: 0,
      totalCorrect: newTotalCorrect,
      totalQuestions: newTotalQuestions,
      showGroupResult: false
    });
  },

  skipCancel() {
    this.setData({ showSkipConfirm: false });
  },

  goToNextSegment() {
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.PLURAL_FORM_RECOGNITION, this.data.activityId);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    wx.redirectTo({ url: `${path}?activityId=${this.data.activityId}` });
  },

  backToActivity() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  }
});
