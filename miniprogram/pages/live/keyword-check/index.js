// 关键词识别：8 道选择题 + 2 道反馈题
const liveService = require('../../utils/liveService.js');
const sound = require('../../../utils/sound.js');

Page({
  data: {
    activityId: '',
    questions: [],
    totalQuestions: 0,
    choiceCount: 0,
    score: 0,
    correctRate: 0,
    currentIndex: 0,
    userAnswers: [],
    questionResults: [],
    testCompleted: false,
    loading: false
  },

  onLoad(options) {
    const activityId = options.activityId || 'lesson1';
    const { choice, feedback } = liveService.getKeywordCheckQuestions(activityId);
    const choiceList = (choice || []).map(q => ({
      ...q,
      option: this._shuffleArray(Array.isArray(q.option) ? [...q.option] : [])
    }));
    const questions = [...choiceList, ...(feedback || [])];
    const choiceCount = choiceList.length;
    this.setData({
      activityId,
      questions,
      totalQuestions: questions.length,
      choiceCount,
      loading: false
    });
    wx.setNavigationBarTitle({ title: '关键词识别' });
  },

  _shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  selectAnswer(e) {
    const answer = e.currentTarget.dataset.answer;
    const { questions, currentIndex, userAnswers, questionResults, score } = this.data;
    const q = questions[currentIndex];
    const isCorrect = q.type === 'feedback' ? true : (answer === q.answer);
    const newUserAnswers = [...userAnswers];
    const newResults = [...questionResults];
    newUserAnswers[currentIndex] = answer;
    newResults[currentIndex] = {
      question: q.text,
      correctAnswer: q.answer,
      userAnswer: answer,
      isCorrect,
      isFeedback: q.type === 'feedback',
      analysis: q.analysis || ''
    };
    const nextIndex = currentIndex + 1;
    const newScore = score + (q.type === 'feedback' ? 0 : (isCorrect ? 1 : 0));
    const choiceCount = this.data.choiceCount || (questions.filter(qq => qq.type !== 'feedback').length);

    if (nextIndex >= questions.length) {
      const correctRate = choiceCount > 0 ? Math.round((newScore / choiceCount) * 100) : 0;
      liveService.saveResult(this.data.activityId, liveService.SEGMENT_TYPES.KEYWORD_CHECK, {
        score: newScore,
        total: choiceCount,
        userAnswers: newUserAnswers,
        questionResults: newResults
      });
      sound.playToast();
      this.setData({
        score: newScore,
        userAnswers: newUserAnswers,
        questionResults: newResults,
        testCompleted: true,
        correctRate
      });
    } else {
      this.setData({
        currentIndex: nextIndex,
        score: newScore,
        userAnswers: newUserAnswers,
        questionResults: newResults
      });
    }
  },

  backToActivity() {
    wx.redirectTo({ url: `/pages/live/activity-index/index?activityId=${this.data.activityId}&showMenu=1` });
  },

  goToNextSegment() {
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.KEYWORD_CHECK, this.data.activityId);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    const url = path ? `${path}?activityId=${this.data.activityId}` : `/pages/live/activity-index/index?activityId=${this.data.activityId}`;
    wx.redirectTo({ url });
  }
});
