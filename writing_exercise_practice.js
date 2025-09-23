// 书写规范填空题练习系统
// 包含自动正误判断和进度保存功能

const { writingExerciseQuestions } = require('./writing_exercise_questions.js');

class WritingExercisePractice {
  constructor() {
    this.questions = writingExerciseQuestions;
    this.userProgress = this.loadProgress();
    this.currentSession = {
      tableId: null,
      questionIndex: 0,
      answers: {},
      startTime: null,
      endTime: null
    };
  }

  // 加载用户进度
  loadProgress() {
    try {
      const savedProgress = localStorage.getItem('writing_exercise_progress');
      return savedProgress ? JSON.parse(savedProgress) : {};
    } catch (error) {
      console.error('加载进度失败:', error);
      return {};
    }
  }

  // 保存用户进度
  saveProgress() {
    try {
      localStorage.setItem('writing_exercise_progress', JSON.stringify(this.userProgress));
    } catch (error) {
      console.error('保存进度失败:', error);
    }
  }

  // 获取指定表格的题目
  getTableQuestions(tableId) {
    return this.questions[tableId] || [];
  }

  // 获取所有表格ID
  getAllTableIds() {
    return Object.keys(this.questions);
  }

  // 获取表格分类信息
  getTableCategories() {
    const categories = {};
    Object.keys(this.questions).forEach(tableId => {
      const questions = this.questions[tableId];
      if (questions && questions.length > 0) {
        const category = questions[0].category;
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push({
          tableId,
          name: this.getTableDisplayName(tableId),
          questionCount: questions.length,
          completedCount: this.getCompletedCount(tableId),
          accuracy: this.getAccuracy(tableId)
        });
      }
    });
    return categories;
  }

  // 获取表格显示名称
  getTableDisplayName(tableId) {
    const nameMap = {
      'pronoun_001': '代词书写(有序)',
      'pronoun_002': '代词书写(乱序)',
      'noun_001': '名词后缀识别(一)',
      'noun_002': '名词后缀识别(二)',
      'noun_003': '名词后缀识别(三)',
      'noun_004': '规则变复数',
      'present_participle_001': '现在分词书写',
      'past_participle_001': '过去分词书写',
      'tense_writing_001': '时态书写练习',
      'voice_writing_001': '语态练习(一般现在时)',
      'voice_writing_002': '语态练习(一般过去时)',
      'voice_writing_003': '语态练习(一般将来时)',
      'comparison_prefix_suffix_001': '形容词前后缀识别',
      'comparison_comparative_001': '比较级书写',
      'comparison_superlative_001': '最高级书写',
      'adverb_writing_001': '形容词变副词书写'
    };
    return nameMap[tableId] || tableId;
  }

  // 获取完成题目数量
  getCompletedCount(tableId) {
    if (!this.userProgress[tableId]) return 0;
    return Object.keys(this.userProgress[tableId].answers).length;
  }

  // 获取正确率
  getAccuracy(tableId) {
    if (!this.userProgress[tableId]) return 0;
    const answers = this.userProgress[tableId].answers;
    const total = Object.keys(answers).length;
    if (total === 0) return 0;
    
    const correct = Object.values(answers).filter(answer => answer.correct).length;
    return Math.round((correct / total) * 100);
  }

  // 开始练习
  startPractice(tableId) {
    this.currentSession = {
      tableId,
      questionIndex: 0,
      answers: {},
      startTime: new Date().toISOString(),
      endTime: null
    };
    
    // 初始化进度记录
    if (!this.userProgress[tableId]) {
      this.userProgress[tableId] = {
        answers: {},
        totalAttempts: 0,
        correctAttempts: 0,
        lastPracticed: null
      };
    }
    
    return this.getCurrentQuestion();
  }

  // 获取当前题目
  getCurrentQuestion() {
    const questions = this.getTableQuestions(this.currentSession.tableId);
    if (this.currentSession.questionIndex >= questions.length) {
      return null; // 练习完成
    }
    
    const question = questions[this.currentSession.questionIndex];
    return {
      ...question,
      questionNumber: this.currentSession.questionIndex + 1,
      totalQuestions: questions.length,
      progress: Math.round(((this.currentSession.questionIndex + 1) / questions.length) * 100)
    };
  }

  // 提交答案
  submitAnswer(userAnswer) {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return null;

    const isCorrect = this.checkAnswer(userAnswer, currentQuestion.answer);
    
    // 记录答案
    this.currentSession.answers[currentQuestion.id] = {
      userAnswer,
      correctAnswer: currentQuestion.answer,
      correct: isCorrect,
      timestamp: new Date().toISOString()
    };

    // 更新进度
    if (!this.userProgress[this.currentSession.tableId]) {
      this.userProgress[this.currentSession.tableId] = {
        answers: {},
        totalAttempts: 0,
        correctAttempts: 0,
        lastPracticed: null
      };
    }

    this.userProgress[this.currentSession.tableId].answers[currentQuestion.id] = {
      userAnswer,
      correctAnswer: currentQuestion.answer,
      correct: isCorrect,
      timestamp: new Date().toISOString(),
      attempts: (this.userProgress[this.currentSession.tableId].answers[currentQuestion.id]?.attempts || 0) + 1
    };

    this.userProgress[this.currentSession.tableId].totalAttempts++;
    if (isCorrect) {
      this.userProgress[this.currentSession.tableId].correctAttempts++;
    }
    this.userProgress[this.currentSession.tableId].lastPracticed = new Date().toISOString();

    // 保存进度
    this.saveProgress();

    return {
      isCorrect,
      correctAnswer: currentQuestion.answer,
      analysis: currentQuestion.analysis,
      nextQuestion: this.nextQuestion()
    };
  }

  // 检查答案是否正确
  checkAnswer(userAnswer, correctAnswer) {
    if (!userAnswer || !correctAnswer) return false;
    
    const userInput = userAnswer.trim().toLowerCase();
    const correct = correctAnswer.trim().toLowerCase();
    
    // 支持多答案格式，如 "which / that"
    if (correct.includes(' / ')) {
      const correctAnswers = correct.split(' / ').map(ans => ans.trim());
      for (const answer of correctAnswers) {
        if (this.checkAnswerVariant(userInput, answer)) {
          return true;
        }
      }
      return false;
    } else {
      // 单答案格式，使用变体检查
      return this.checkAnswerVariant(userInput, correct);
    }
  }

  // 检查答案变体（支持大小写、缩写、短横线等）
  checkAnswerVariant(userInput, correctAnswer) {
    const user = userInput.trim().toLowerCase();
    const correct = correctAnswer.trim().toLowerCase();
    
    // 直接匹配
    if (user === correct) {
      return true;
    }
    
    // 处理短横线变体（有无短横线都算正确）
    const userWithoutDash = user.replace(/-/g, '');
    const correctWithoutDash = correct.replace(/-/g, '');
    if (userWithoutDash === correctWithoutDash) {
      return true;
    }
    
    // 处理前缀后缀核心部分匹配
    if (this.checkPrefixSuffixMatch(user, correct)) {
      return true;
    }
    
    return false;
  }

  // 检查前缀后缀核心部分匹配
  checkPrefixSuffixMatch(user, correct) {
    // 去除所有短横线，只比较核心部分
    const userCore = user.replace(/-/g, '');
    const correctCore = correct.replace(/-/g, '');
    
    // 核心部分完全匹配
    if (userCore === correctCore) {
      return true;
    }
    
    // 处理特殊的前缀后缀变体
    const prefixSuffixVariants = {
      'ful': ['-ful', 'ful'],
      'ble': ['-ble', 'ble', 'ible', '-ible'],
      'ness': ['-ness', 'ness'],
      'ment': ['-ment', 'ment'],
      'er': ['-er', 'er'],
      'or': ['-or', 'or'],
      'th': ['-th', 'th'],
      'ion': ['-ion', 'ion'],
      'un': ['un-', 'un'],
      'im': ['im-', 'im'],
      'il': ['il-', 'il'],
      'ir': ['ir-', 'ir'],
      'in': ['in-', 'in']
    };
    
    // 检查用户答案是否在变体列表中
    for (const [core, variants] of Object.entries(prefixSuffixVariants)) {
      if (variants.includes(user) && variants.includes(correct)) {
        return true;
      }
    }
    
    return false;
  }

  // 下一题
  nextQuestion() {
    this.currentSession.questionIndex++;
    return this.getCurrentQuestion();
  }

  // 上一题
  previousQuestion() {
    if (this.currentSession.questionIndex > 0) {
      this.currentSession.questionIndex--;
    }
    return this.getCurrentQuestion();
  }

  // 完成练习
  finishPractice() {
    this.currentSession.endTime = new Date().toISOString();
    
    // 计算练习统计
    const questions = this.getTableQuestions(this.currentSession.tableId);
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(this.currentSession.answers).length;
    const correctAnswers = Object.values(this.currentSession.answers).filter(answer => answer.correct).length;
    
    const sessionStats = {
      tableId: this.currentSession.tableId,
      startTime: this.currentSession.startTime,
      endTime: this.currentSession.endTime,
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      accuracy: Math.round((correctAnswers / answeredQuestions) * 100),
      duration: this.calculateDuration(this.currentSession.startTime, this.currentSession.endTime)
    };

    // 保存练习记录
    if (!this.userProgress[this.currentSession.tableId].sessions) {
      this.userProgress[this.currentSession.tableId].sessions = [];
    }
    this.userProgress[this.currentSession.tableId].sessions.push(sessionStats);
    
    this.saveProgress();
    
    return sessionStats;
  }

  // 计算练习时长
  calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end - start;
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}分${seconds}秒`;
  }

  // 获取练习历史
  getPracticeHistory(tableId) {
    if (!this.userProgress[tableId] || !this.userProgress[tableId].sessions) {
      return [];
    }
    return this.userProgress[tableId].sessions.sort((a, b) => 
      new Date(b.startTime) - new Date(a.startTime)
    );
  }

  // 重置进度
  resetProgress(tableId) {
    if (tableId) {
      delete this.userProgress[tableId];
    } else {
      this.userProgress = {};
    }
    this.saveProgress();
  }

  // 获取总体统计
  getOverallStats() {
    const tableIds = this.getAllTableIds();
    let totalQuestions = 0;
    let totalAnswered = 0;
    let totalCorrect = 0;
    let totalAttempts = 0;

    tableIds.forEach(tableId => {
      const questions = this.getTableQuestions(tableId);
      totalQuestions += questions.length;
      
      if (this.userProgress[tableId]) {
        totalAnswered += Object.keys(this.userProgress[tableId].answers).length;
        totalCorrect += this.userProgress[tableId].correctAttempts;
        totalAttempts += this.userProgress[tableId].totalAttempts;
      }
    });

    return {
      totalTables: tableIds.length,
      totalQuestions,
      totalAnswered,
      totalCorrect,
      totalAttempts,
      overallAccuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
      completionRate: totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0
    };
  }

  // 导出进度数据
  exportProgress() {
    return {
      userProgress: this.userProgress,
      overallStats: this.getOverallStats(),
      exportTime: new Date().toISOString()
    };
  }

  // 导入进度数据
  importProgress(data) {
    try {
      if (data.userProgress && data.overallStats) {
        this.userProgress = data.userProgress;
        this.saveProgress();
        return true;
      }
      return false;
    } catch (error) {
      console.error('导入进度失败:', error);
      return false;
    }
  }
}

// 导出类
module.exports = {
  WritingExercisePractice
};

// 如果是在浏览器环境中使用
if (typeof window !== 'undefined') {
  window.WritingExercisePractice = WritingExercisePractice;
}
