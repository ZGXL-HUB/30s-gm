// 课前真题检测：做题 + 提交 + 结果（防重复）
const liveService = require('../../utils/liveService.js');
const sound = require('../../../utils/sound.js');

Page({
  data: {
    activityId: '',
    activity: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    total: 0,
    correctRate: 0,
    userAnswers: [],
    questionResults: [],
    testCompleted: false,
    alreadySubmitted: false,
    prevResult: null,
    loading: true,
    error: ''
  },

  onLoad(options) {
    const activityId = options.activityId || 'lesson1';
    const activity = liveService.getActivityConfig(activityId);
    const prevResult = liveService.getPreTestResult(activityId);

    this.setData({
      activityId,
      activity,
      prevResult,
      alreadySubmitted: false,
      loading: !!activity
    });
    if (activity) {
      wx.setNavigationBarTitle({ title: '课前·真题检测' });
      this.loadQuestions();
    } else {
      this.setData({ error: '未找到活动', loading: false });
    }
  },

  async loadQuestions() {
    const { activityId } = this.data;
    wx.showLoading({ title: '加载题目...' });
    try {
      let questions = await liveService.getPreTestQuestions(activityId);
      if (!questions || questions.length === 0) {
        this.setData({
          loading: false,
          error: '暂无题目，请稍后再试。'
        });
        wx.hideLoading();
        return;
      }
      // 打乱每题选项顺序，避免正确答案始终在第一位
      questions = questions.map(q => ({
        ...q,
        option: this._shuffleArray(Array.isArray(q.option) ? [...q.option] : [])
      }));
      this.setData({
        questions,
        total: questions.length,
        userAnswers: [],
        questionResults: [],
        loading: false
      });
    } catch (e) {
      this.setData({
        loading: false,
        error: '加载失败，请重试。'
      });
    }
    wx.hideLoading();
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
    const isCorrect = answer === q.answer;

    const newUserAnswers = [...userAnswers];
    const newResults = [...questionResults];
    newUserAnswers[currentIndex] = answer;
    newResults[currentIndex] = {
      question: q.text,
      correctAnswer: q.answer,
      userAnswer: answer,
      isCorrect,
      analysis: q.analysis,
      tag: q.tag
    };
    const nextIndex = currentIndex + 1;
    const newScore = score + (isCorrect ? 1 : 0);

    if (nextIndex >= questions.length) {
      liveService.savePreTestResult(this.data.activityId, newScore, questions.length, newResults);
      const correctRate = questions.length > 0 ? Math.round((newScore / questions.length) * 100) : 0;
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
    const nextType = liveService.getNextSegmentType(liveService.SEGMENT_TYPES.PRE_CLASS_TEST, this.data.activityId);
    const path = nextType ? liveService.getSegmentPagePath(nextType) : '/pages/live/activity-index/index';
    const url = path ? `${path}?activityId=${this.data.activityId}` : `/pages/live/activity-index/index?activityId=${this.data.activityId}`;
    wx.redirectTo({ url });
  },

});
