// 第八环节：帮同学找出表达里的错误（5句，点击句中错误词汇，正确率不存云端）
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
    sectionTitle: '第八环节：帮同学找出他们表达里的错误',
    sentences: [],
    tokensList: [],
    currentTokens: [],
    sentenceIndex: 0,
    score: 0,
    totalInGroup: 5,
    answered: [],
    selectedIndex: -1,
    showFeedback: false,
    feedbackCorrect: false,
    feedbackAnswer: '',
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
    const { sentences, hint } = liveService.getSentenceErrorData(activityId);
    if (!sentences || sentences.length === 0) {
      this.setData({ loading: false });
      wx.showToast({ title: '暂无题目', icon: 'none' });
      return;
    }
    const tokensList = sentences.map(s => buildTokens(s.text, s.correctWord));

    this.setData({
      activityId,
      sentences,
      tokensList,
      currentTokens: tokensList[0] || [],
      hintContent: hint || '',
      totalInGroup: sentences.length,
      answered: [],
      loading: false
    });
    wx.setNavigationBarTitle({ title: '第八环节·帮同学找错' });
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
      score: newScore
    });
    const that = this;
    setTimeout(function () { that.nextSentence(); }, 1500);
  },

  nextSentence() {
    const { sentenceIndex, sentences, score, totalInGroup, tokensList } = this.data;
    const next = sentenceIndex + 1;
    if (next >= sentences.length) {
      const correctRate = totalInGroup > 0 ? Math.round((score / totalInGroup) * 100) : 0;
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.SENTENCE_ERROR_CLICK, { completed: true });
      sound.playToast();
      this.setData({
        allDone: true,
        correctRate,
        encourageCopy: getEncourage(correctRate),
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
    const correctRate = 0;
    liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.SENTENCE_ERROR_CLICK, { completed: true });
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

  goToNextSegment() {
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.SENTENCE_ERROR_CLICK, this.data.activityId);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    wx.redirectTo({ url: `${path}?activityId=${this.data.activityId}` });
  },

  backToActivity() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  }
});
