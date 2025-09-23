// pages/grammar-test/grammar-test.js
const grammarTestSets = require('../../data/grammar_test_sets.js');

Page({
  data: {
    currentSet: null,
    currentQuestionIndex: 0,
    selectedAnswer: '',
    score: 0,
    totalQuestions: 0,
    testCompleted: false,
    testSets: grammarTestSets,
    showSetSelection: true,
    scorePercentage: '0.0',
    userAnswers: [], // 存储用户的所有答案
    questionResults: [] // 存储所有题目的结果
  },

  onLoad: function (options) {
    // 页面加载时的初始化
  },

  // 选择测试套题
  selectTestSet: function(e) {
    const setId = e.currentTarget.dataset.id;
    const testSet = this.data.testSets.find(set => set.id == setId);
    
    this.setData({
      currentSet: testSet,
      currentQuestionIndex: 0,
      selectedAnswer: '',
      score: 0,
      totalQuestions: testSet.questions.length,
      testCompleted: false,
      showSetSelection: false,
      userAnswers: [],
      questionResults: []
    });
  },

  // 选择答案并自动跳转下一题
  selectAnswer: function(e) {
    const answer = e.currentTarget.dataset.answer;
    const currentQuestion = this.data.currentSet.questions[this.data.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.answer;
    
    // 记录用户答案和题目结果
    const userAnswers = [...this.data.userAnswers];
    const questionResults = [...this.data.questionResults];
    
    userAnswers[this.data.currentQuestionIndex] = answer;
    questionResults[this.data.currentQuestionIndex] = {
      question: currentQuestion.text,
      correctAnswer: currentQuestion.answer,
      userAnswer: answer,
      isCorrect: isCorrect,
      analysis: currentQuestion.analysis,
      tag: currentQuestion.tag
    };
    
    // 更新分数
    let newScore = this.data.score;
    if (isCorrect) {
      newScore += 1;
    }
    
    // 检查是否是最后一题
    const nextIndex = this.data.currentQuestionIndex + 1;
    
    if (nextIndex >= this.data.totalQuestions) {
      // 测试完成
      const percentage = (newScore / this.data.totalQuestions * 100).toFixed(1);
      this.setData({
        testCompleted: true,
        scorePercentage: percentage,
        score: newScore,
        userAnswers: userAnswers,
        questionResults: questionResults
      });
    } else {
      // 继续下一题
      this.setData({
        currentQuestionIndex: nextIndex,
        selectedAnswer: '',
        score: newScore,
        userAnswers: userAnswers,
        questionResults: questionResults
      });
    }
  },

  // 返回套题选择
  backToSetSelection: function() {
    this.setData({
      currentSet: null,
      currentQuestionIndex: 0,
      selectedAnswer: '',
      score: 0,
      totalQuestions: 0,
      testCompleted: false,
      showSetSelection: true,
      scorePercentage: '0.0',
      userAnswers: [],
      questionResults: []
    });
  },

  // 重新开始当前套题
  restartTest: function() {
    this.setData({
      currentQuestionIndex: 0,
      selectedAnswer: '',
      score: 0,
      testCompleted: false,
      scorePercentage: '0.0',
      userAnswers: [],
      questionResults: []
    });
  }
});
