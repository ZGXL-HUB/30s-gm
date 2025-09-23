// pages/level-test/index.js
// 水平测试页面 - 包含语法选择题和书写填空题测试

const { writingExerciseQuestions } = require('../../writing_exercise_questions.js');

// 引入语法测试题库
const grammarTestSets = require('../../data/grammar_test_sets.js');

Page({
  data: {
    // 测试状态
    testState: 'welcome', // welcome, grammar-test, writing-test, result
    currentQuestionIndex: 0,
    
    // 题目数据
    grammarQuestions: [],
    writingQuestions: [],
    
    // 用户答案
    userAnswers: {
      grammar: [],
      writing: []
    },
    
    // 测试结果
    testResults: {
      grammarCorrect: 0,
      writingCorrect: 0,
      totalCorrect: 0,
      grammarLevel: '',
      writingLevel: '',
      totalLevel: '',
      recommendation: '',
      suggestion: '',
      userLevel: '',
      nextSteps: [],
      specificRecommendations: []
    },
    
    // 当前题目
    currentQuestion: null,
    userInput: '',
    showAnswer: false,
    isCorrect: false,
    
    // 进度条
    progress: 0,
    totalQuestions: 10,
    
    // 预览数据
    previewLevels: []
  },

  onLoad: function (options) {
    this.initTest();
  },

  // 初始化测试
  initTest: function() {
    // 随机抽取5道语法选择题
    this.selectGrammarQuestions();
    // 随机抽取5道书写填空题
    this.selectWritingQuestions();
  },

  // 选择语法题目 - 从语法测试题库中随机抽取
  selectGrammarQuestions: function() {
    // 从语法测试题库中随机选择一套题目
    const randomSetIndex = Math.floor(Math.random() * grammarTestSets.length);
    const selectedSet = grammarTestSets[randomSetIndex];
    
    // 从选中的套题中随机抽取5道题目
    const shuffledQuestions = this.shuffleArray([...selectedSet.questions]);
    const selectedQuestions = shuffledQuestions.slice(0, 5);
    
    // 转换为水平测试需要的格式
    const formattedQuestions = selectedQuestions.map((q, index) => ({
      id: `grammar_${randomSetIndex}_${index}`,
      question: q.text,
      options: q.option.map((opt, optIndex) => ({
        label: String.fromCharCode(65 + optIndex), // A, B, C...
        text: opt,
        isCorrect: opt === q.answer
      })),
      analysis: q.analysis,
      tag: q.tag,
      setInfo: selectedSet.name
    }));
    
    this.setData({
      grammarQuestions: formattedQuestions
    });
    
    console.log(`已从${selectedSet.name}中随机抽取5道语法选择题`);
  },

  // 选择书写题目 - 从书写规范题库中随机抽取
  selectWritingQuestions: function() {
    // 从所有表格中随机抽取题目
    const allQuestions = [];
    Object.keys(writingExerciseQuestions).forEach(tableId => {
      const questions = writingExerciseQuestions[tableId];
      // 确保questions是数组
      if (Array.isArray(questions)) {
        questions.forEach(q => {
          // 检查题目是否有必要的属性
          if (q && q.question && q.answer) {
            allQuestions.push({
              ...q,
              tableId: tableId
            });
          } else {
            console.warn(`题目数据不完整，跳过:`, q);
          }
        });
      } else {
        console.warn(`表格 ${tableId} 的题目不是数组:`, questions);
      }
    });
    
    console.log(`总共找到 ${allQuestions.length} 道有效的书写题目`);
    
    // 随机抽取5道题
    const selectedQuestions = this.getRandomQuestions(allQuestions, 5);
    console.log('选中的书写题目:', selectedQuestions);
    
    this.setData({
      writingQuestions: selectedQuestions
    });
  },

  // 随机抽取题目
  getRandomQuestions: function(questions, count) {
    // 添加安全检查
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      console.warn('getRandomQuestions: 传入的questions不是有效数组:', questions);
      return [];
    }
    
    const shuffled = this.shuffleArray([...questions]);
    return shuffled.slice(0, count);
  },

  // Fisher-Yates 洗牌算法
  shuffleArray: function(array) {
    // 添加安全检查
    if (!array || !Array.isArray(array)) {
      console.warn('shuffleArray: 传入的array不是有效数组:', array);
      return [];
    }
    
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // 开始语法测试
  startGrammarTest: function() {
    this.setData({
      testState: 'grammar-test',
      currentQuestionIndex: 0,
      progress: 0
    });
    this.showCurrentGrammarQuestion();
  },

  // 开始书写测试
  startWritingTest: function() {
    console.log('开始书写测试，重置索引为0');
    this.setData({
      testState: 'writing-test',
      currentQuestionIndex: 0,
      progress: 0,
      userInput: '',
      showAnswer: false,
      isCorrect: false
    });
    this.showCurrentWritingQuestion();
  },

  // 显示当前语法题目
  showCurrentGrammarQuestion: function() {
    const { grammarQuestions, currentQuestionIndex } = this.data;
    console.log('显示语法题目:', { currentQuestionIndex, grammarQuestionsLength: grammarQuestions.length });
    
    if (currentQuestionIndex < grammarQuestions.length) {
      const question = grammarQuestions[currentQuestionIndex];
      console.log('当前题目数据:', question);
      
      // 计算正确答案文本
      const correctOption = question.options.find(opt => opt.isCorrect);
      const correctAnswerText = correctOption ? correctOption.text : '';
      
      console.log('正确答案:', correctAnswerText);
      console.log('选项数据:', question.options);
      
      // 验证选项数据格式
      if (question.options && question.options.length > 0) {
        question.options.forEach((option, index) => {
          console.log(`选项${index}:`, {
            label: option.label,
            text: option.text,
            isCorrect: option.isCorrect
          });
        });
      } else {
        console.error('选项数据为空或格式错误');
      }
      
      this.setData({
        currentQuestion: question,
        correctAnswerText: correctAnswerText,
        userInput: '',
        showAnswer: false,
        isCorrect: false
      });
      
      console.log('题目数据已设置到页面');
    } else {
      // 语法测试完成，开始书写测试
      console.log('语法测试完成，开始书写测试');
      this.startWritingTest();
    }
  },

  // 显示当前书写题目
  showCurrentWritingQuestion: function() {
    const { writingQuestions, currentQuestionIndex } = this.data;
    console.log('显示书写题目:', { currentQuestionIndex, writingQuestionsLength: writingQuestions.length });
    
    if (currentQuestionIndex < writingQuestions.length) {
      const question = writingQuestions[currentQuestionIndex];
      console.log('当前题目数据:', question);
      
      // 检查题目数据是否完整
      if (!question || !question.answer) {
        console.error('书写题目数据不完整:', question);
        wx.showToast({
          title: '题目数据错误，请重新开始测试',
          icon: 'none'
        });
        return;
      }
      
      console.log('正确答案:', question.answer);
      console.log('选项数据:', question.options);
      if (question.options) {
        question.options.forEach((option, index) => {
          console.log(`选项${index}:`, option);
        });
      }
      
      this.setData({
        currentQuestion: question,
        userInput: '',
        showAnswer: false,
        isCorrect: false
      });
      
      console.log('题目数据已设置到页面');
    } else {
      // 所有测试完成，计算结果
      console.log('书写测试完成，开始计算结果');
      this.calculateResults();
    }
  },

  // 选择语法题答案
  selectGrammarAnswer: function(e) {
    console.log('=== 选项被点击了 ===');
    console.log('事件对象:', e);
    console.log('当前题目数据:', this.data.currentQuestion);
    
    const { index } = e.currentTarget.dataset;
    const { currentQuestion, userAnswers, grammarQuestions, currentQuestionIndex } = this.data;
    
    console.log('点击的选项索引:', index);
    console.log('当前题目:', currentQuestion);
    
    if (!currentQuestion || !currentQuestion.options) {
      console.error('当前题目数据无效');
      wx.showToast({
        title: '题目数据无效',
        icon: 'error'
      });
      return;
    }
    
    const selectedOption = currentQuestion.options[index];
    if (!selectedOption) {
      console.error('选中的选项无效:', index);
      wx.showToast({
        title: '选项无效',
        icon: 'error'
      });
      return;
    }
    
    const isCorrect = selectedOption.isCorrect;
    
    console.log('选中的选项:', selectedOption);
    console.log('是否正确:', isCorrect);
    
    // 显示选择结果
    wx.showToast({
      title: isCorrect ? '回答正确！' : '回答错误',
      icon: isCorrect ? 'success' : 'error'
    });
    
    // 保存答案
    userAnswers.grammar[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption.text,
      isCorrect: isCorrect,
      correctAnswer: currentQuestion.options.find(opt => opt.isCorrect).text
    };
    
    this.setData({
      userAnswers: userAnswers,
      isCorrect: isCorrect,
      showAnswer: true,
      correctAnswerText: currentQuestion.options.find(opt => opt.isCorrect).text
    });
    
    // 更新进度
    const progress = ((currentQuestionIndex + 1) / grammarQuestions.length) * 100;
    this.setData({ progress: progress });
    
    // 延迟进入下一题
    setTimeout(() => {
      this.nextGrammarQuestion();
    }, 1500);
  },

  // 下一道语法题
  nextGrammarQuestion: function() {
    const { currentQuestionIndex, grammarQuestions } = this.data;
    this.setData({
      currentQuestionIndex: currentQuestionIndex + 1
    });
    this.showCurrentGrammarQuestion();
  },

  // 输入书写题答案
  inputWritingAnswer: function(e) {
    this.setData({
      userInput: e.detail.value
    });
  },

  // 提交书写题答案
  submitWritingAnswer: function() {
    const { currentQuestion, userInput, userAnswers, writingQuestions, currentQuestionIndex } = this.data;
    
    console.log('=== 提交书写答案 ===');
    console.log('用户输入:', userInput);
    console.log('当前题目:', currentQuestion);
    console.log('当前题目索引:', currentQuestionIndex);
    console.log('书写题目总数:', writingQuestions.length);
    
    // 检查用户输入 - 空答案直接按答错处理，不中断测试
    if (!userInput || !userInput.trim()) {
      console.log('用户提交空答案，直接按答错处理');
      this.handleEmptyWritingAnswer();
      return;
    }
    
    // 检查当前题目和答案是否存在
    if (!currentQuestion || !currentQuestion.answer) {
      console.error('当前题目或答案不存在:', currentQuestion);
      wx.showModal({
        title: '数据错误',
        content: '题目数据异常，是否重新开始测试？',
        confirmText: '重新开始',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.initTest();
            this.setData({
              testState: 'welcome',
              currentQuestionIndex: 0,
              userAnswers: { grammar: [], writing: [] },
              progress: 0
            });
          }
        }
      });
      return;
    }
    
    // 支持多答案判断：如果答案包含斜杠分隔符，则答对其中任何一个就算正确
    let isCorrect = false;
    const userAnswer = userInput.trim().toLowerCase();
    
    if (currentQuestion.answer.includes('/')) {
      // 多答案情况：检查用户答案是否匹配其中任何一个
      const possibleAnswers = currentQuestion.answer.split('/').map(ans => ans.trim().toLowerCase());
      isCorrect = possibleAnswers.some(answer => answer === userAnswer);
    } else {
      // 单答案情况：直接比较（去除空格后比较）
      isCorrect = userAnswer === currentQuestion.answer.trim().toLowerCase();
    }
    
    console.log('正确答案:', currentQuestion.answer);
    console.log('用户答案:', userAnswer);
    console.log('是否正确:', isCorrect);
    
    // 保存答案
    userAnswers.writing[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      userAnswer: userInput.trim(),
      isCorrect: isCorrect,
      correctAnswer: currentQuestion.answer
    };
    
    this.setData({
      userAnswers: userAnswers,
      isCorrect: isCorrect,
      showAnswer: true
    });
    
    // 更新进度
    const progress = ((currentQuestionIndex + 1) / writingQuestions.length) * 100;
    this.setData({ progress: progress });
    
    // 延迟进入下一题
    setTimeout(() => {
      this.nextWritingQuestion();
    }, 1500);
  },

  // 处理空书写答案
  handleEmptyWritingAnswer: function() {
    const { currentQuestion, userAnswers, writingQuestions, currentQuestionIndex } = this.data;
    
    console.log('处理空书写答案');
    
    // 保存空答案（按答错处理）
    userAnswers.writing[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      userAnswer: '',
      isCorrect: false,
      correctAnswer: currentQuestion.answer,
      isEmpty: true
    };
    
    this.setData({
      userAnswers: userAnswers,
      isCorrect: false,
      showAnswer: true
    });
    
    // 显示空答案提示
    wx.showToast({
      title: '未填写答案，记为错误',
      icon: 'none',
      duration: 1500
    });
    
    // 更新进度
    const progress = ((currentQuestionIndex + 1) / writingQuestions.length) * 100;
    this.setData({ progress: progress });
    
    // 延迟进入下一题
    setTimeout(() => {
      this.nextWritingQuestion();
    }, 1500);
  },

  // 下一道书写题
  nextWritingQuestion: function() {
    const { currentQuestionIndex, writingQuestions } = this.data;
    const nextIndex = currentQuestionIndex + 1;
    
    console.log('下一道书写题:', { currentIndex: currentQuestionIndex, nextIndex, totalQuestions: writingQuestions.length });
    
    if (nextIndex >= writingQuestions.length) {
      // 书写测试完成，计算结果
      console.log('书写测试完成，开始计算结果');
      this.calculateResults();
    } else {
      this.setData({
        currentQuestionIndex: nextIndex,
        userInput: '',
        showAnswer: false,
        isCorrect: false
      });
      this.showCurrentWritingQuestion();
    }
  },

  // 计算测试结果
  calculateResults: function() {
    const { userAnswers, grammarQuestions, writingQuestions } = this.data;
    
    // 计算语法题正确数
    const grammarCorrect = userAnswers.grammar.filter(answer => answer && answer.isCorrect).length;
    
    // 计算书写题正确数
    const writingCorrect = userAnswers.writing.filter(answer => answer && answer.isCorrect).length;
    
    const totalCorrect = grammarCorrect + writingCorrect;
    const totalQuestions = grammarQuestions.length + writingQuestions.length;
    
    // 计算等级
    const grammarLevel = this.calculateLevel(grammarCorrect, grammarQuestions.length);
    const writingLevel = this.calculateLevel(writingCorrect, writingQuestions.length);
    const totalLevel = this.calculateLevel(totalCorrect, totalQuestions);
    
    // 生成推荐和建议
    const { recommendation, suggestion, userLevel, nextSteps, specificRecommendations } = this.generateRecommendation(
      totalCorrect, totalQuestions, grammarCorrect, grammarQuestions.length, writingCorrect, writingQuestions.length
    );
    
    this.setData({
      testResults: {
        grammarCorrect,
        writingCorrect,
        totalCorrect,
        grammarLevel,
        writingLevel,
        totalLevel,
        recommendation,
        suggestion,
        userLevel,
        nextSteps,
        specificRecommendations
      },
      testState: 'result'
    });
  },

  // 计算等级
  calculateLevel: function(correct, total) {
    const percentage = (correct / total) * 100;
    if (percentage >= 100) return 'level5';
    if (percentage >= 80) return 'level4';
    if (percentage >= 60) return 'level3';
    if (percentage >= 40) return 'level2';
    return 'level1';
  },

  // 生成推荐和建议
  generateRecommendation: function(totalCorrect, totalQuestions, grammarCorrect, grammarTotal, writingCorrect, writingTotal) {
    const totalPercentage = (totalCorrect / totalQuestions) * 100;
    const grammarPercentage = (grammarCorrect / grammarTotal) * 100;
    const writingPercentage = (writingCorrect / writingTotal) * 100;
    
    let recommendation, suggestion, userLevel, nextSteps, specificRecommendations;
    
    if (totalPercentage > 81) {
      userLevel = '高级用户';
      recommendation = '系统推荐模块';
      suggestion = '建议搭配主页的进阶之旅，更快发现薄弱点，将薄弱点放进专属组合每天练，下个语法大神就是你';
      nextSteps = ['进入综合练习', '自由组合语法专题', '高考模拟练习'];
      specificRecommendations = [
        {
          type: 'comprehensive_practice',
          title: '综合语法练习',
          description: '点击直接开始20题综合练习',
          targetUrl: '/pages/grammar-overview/index',
          icon: '🎯'
        },
        {
          type: 'custom_combination',
          title: '自由组合练习',
          description: '点击进入语法点选择页面',
          targetUrl: '/pages/grammar-select/index',
          icon: '🔧'
        },
        {
          type: 'exam_simulation',
          title: '高考模拟测试',
          description: '点击开始24题全面测试',
          targetUrl: '/pages/ability-test/comprehensive-writing-test',
          icon: '📝'
        }
      ];
    } else if (totalPercentage > 61) {
      userLevel = '中级用户';
      recommendation = '进阶之旅';
      suggestion = '建议每周突破一个小点，超稳的';
      nextSteps = ['简易版书写测试', '针对性练习薄弱环节', '每周突破一个小点'];
      specificRecommendations = [
        {
          type: 'grammar_overview',
          title: '进阶之旅',
          description: '点击直接开始15题专项练习',
          targetUrl: '/pages/grammar-overview/index',
          icon: '🚀'
        },
        {
          type: 'focused_practice',
          title: '薄弱点专项练习',
          description: '点击直接开始针对性练习',
          targetUrl: this.getWeakPointUrl(grammarPercentage, writingPercentage),
          icon: '🎯'
        },
        {
          type: 'writing_practice',
          title: '书写规范练习',
          description: '点击进入书写规范学习',
          targetUrl: '/pages/grammar-writing/index',
          icon: '✍️'
        }
      ];
    } else if (totalPercentage > 41) {
      userLevel = '初级用户';
      if (writingPercentage > grammarPercentage) {
        recommendation = '进阶之旅';
        suggestion = '建议每周突破一个小点，超稳的';
        nextSteps = ['简易版书写测试', '针对性练习薄弱环节', '每周突破一个小点'];
        specificRecommendations = [
          {
            type: 'grammar_overview',
            title: '进阶之旅',
            description: '点击直接开始基础练习',
            targetUrl: '/pages/grammar-overview/index',
            icon: '🚀'
          },
          {
            type: 'basic_grammar_practice',
            title: '基础语法练习',
            description: '点击直接开始代词、名词练习',
            targetUrl: '/pages/grammar-writing/index?tables=pronoun_001,pronoun_002,noun_001',
            icon: '📚'
          }
        ];
      } else {
        recommendation = '书写规范界面';
        suggestion = '建议每周练会一个表格，配上您的绝佳理解力，后续进步会超快';
        nextSteps = ['进入书写规范界面', '从基础表格开始', '定期复习练习'];
        specificRecommendations = [
        {
          type: 'writing_standard',
          title: '书写规范界面',
          description: '点击进入书写规范学习',
          targetUrl: '/pages/grammar-writing/index',
          icon: '📝'
        },
          {
            type: 'basic_writing_practice',
            title: '基础书写练习',
            description: '点击直接开始代词、名词练习',
            targetUrl: '/pages/grammar-writing/index?tables=pronoun_001,noun_001',
            icon: '✍️'
          }
        ];
      }
    } else {
      userLevel = '基础用户';
      recommendation = '书写规范界面';
      suggestion = '建议从基础表格开始系统学习，每周练会一个表格，配上您的绝佳理解力，前期稳后续进步会超快';
      nextSteps = ['进入书写规范界面', '从基础表格开始', '系统学习相关表格'];
      specificRecommendations = [
        {
          type: 'writing_standard',
          title: '书写规范界面',
          description: '点击进入书写规范学习',
          targetUrl: '/pages/grammar-writing/index',
          icon: '📝'
        },
        {
          type: 'pronoun_practice',
          title: '代词基础练习',
          description: '点击直接开始代词练习',
          targetUrl: '/pages/grammar-writing/index?tables=pronoun_001',
          icon: '🔤'
        },
        {
          type: 'noun_practice',
          title: '名词基础练习',
          description: '点击直接开始名词练习',
          targetUrl: '/pages/grammar-writing/index?tables=noun_001',
          icon: '📖'
        }
      ];
    }
    
    return { recommendation, suggestion, userLevel, nextSteps, specificRecommendations };
  },

  // 获取薄弱点推荐描述
  getWeakPointRecommendation: function(grammarCorrect, writingCorrect) {
    if (grammarCorrect < writingCorrect) {
      return '重点练习语法薄弱环节';
    } else if (writingCorrect < grammarCorrect) {
      return '重点练习书写薄弱环节';
    } else {
      return '平衡发展语法和书写能力';
    }
  },

  // 获取薄弱点练习URL
  getWeakPointUrl: function(grammarPercentage, writingPercentage) {
    if (grammarPercentage < writingPercentage) {
      return '/pages/grammar-overview/index';
    } else {
      return '/pages/grammar-writing/index?tables=pronoun_001,pronoun_002,noun_001';
    }
  },

  // 查看测试结果
  viewTestResults: function() {
    console.log('测试结果:', this.data.testResults);
  },

  // 退出测试
  exitTest: function() {
    wx.navigateBack();
  },

  // 重新测试
  retakeTest: function() {
    wx.showModal({
      title: '重新测试',
      content: '确定要重新开始测试吗？当前结果将丢失。',
      confirmText: '确定重测',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 重新初始化测试
          this.initTest();
          this.setData({
            testState: 'welcome',
            currentQuestionIndex: 0,
            userAnswers: { grammar: [], writing: [] },
            progress: 0,
            currentQuestion: null,
            userInput: '',
            showAnswer: false,
            isCorrect: false,
            testResults: {
              grammarCorrect: 0,
              writingCorrect: 0,
              totalCorrect: 0,
              grammarLevel: '',
              writingLevel: '',
              totalLevel: '',
              recommendation: '',
              suggestion: '',
              userLevel: '',
              nextSteps: [],
              specificRecommendations: []
            }
          });
          
          wx.showToast({
            title: '测试已重置',
            icon: 'success'
          });
        }
      }
    });
  },

  // 完成测试
  completeTest: function() {
    // 保存测试结果到本地存储，添加时间戳
    const testResults = {
      ...this.data.testResults,
      timestamp: Date.now()
    };
    
    wx.setStorageSync('levelTestCompleted', true);
    wx.setStorageSync('levelTestResults', testResults);
    
    console.log('语法水平测试结果已保存:', testResults);
    
    // 返回首页
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 跳转到24题完整版测试
  goToComprehensiveTest: function() {
    wx.navigateTo({
      url: '/pages/ability-test/comprehensive-writing-test'
    });
  },

  // 开始推荐的学习内容
  startRecommendedLearning: function(e) {
    const type = e.currentTarget.dataset.type;
    const testResults = this.data.testResults;
    
    // 根据推荐类型跳转到不同页面
    switch(type) {
      case '系统推荐模块':
        // 跳转到系统组合页面
        wx.switchTab({
          url: '/pages/index/index'
        });
        break;
      case '进阶之旅':
        // 跳转到进阶之旅页面
        wx.navigateTo({
          url: '/pages/grammar-overview/index'
        });
        break;
      case '书写规范界面':
        // 跳转到书写规范界面
        wx.navigateTo({
          url: '/pages/writing-standard/index'
        });
        break;
      default:
        // 默认跳转到主页
        wx.switchTab({
          url: '/pages/index/index'
        });
    }
  },

  // 查看学习路径
  viewLearningPath: function() {
    const testResults = this.data.testResults;
    wx.navigateTo({
      url: `/pages/learning-path/index?level=${encodeURIComponent(testResults.userLevel)}`
    });
  },

  // 点击具体推荐练习
  startSpecificRecommendation: function(e) {
    const index = e.currentTarget.dataset.index;
    const testResults = this.data.testResults;
    
    console.log('点击推荐练习:', index, testResults.specificRecommendations);
    
    if (testResults.specificRecommendations && testResults.specificRecommendations[index]) {
      const recommendation = testResults.specificRecommendations[index];
      console.log('推荐练习详情:', recommendation);
      
      // 根据推荐类型直接生成练习题目
      if (recommendation.type === 'comprehensive_practice' || recommendation.type === 'grammar_overview') {
        // 综合语法练习 - 直接生成题目
        console.log('开始生成综合语法练习');
        this.generateRecommendedQuestions('intermediate', 'comprehensive', 20, recommendation.title);
      } else if (recommendation.type === 'focused_practice' || recommendation.type === 'basic_grammar_practice') {
        // 专项练习 - 根据用户水平生成题目
        const difficulty = this.getRecommendedDifficulty(testResults.totalLevel);
        console.log('开始生成专项练习:', difficulty);
        this.generateRecommendedQuestions(difficulty, 'focused', 15, recommendation.title);
      } else if (recommendation.type === 'writing_practice' || recommendation.type === 'writing_standard') {
        // 书写练习 - 跳转到书写规范页面（tabbar页面）
        console.log('跳转到书写规范页面:', recommendation.targetUrl);
        wx.switchTab({
          url: recommendation.targetUrl,
          success: function() {
            console.log('成功跳转到书写规范页面');
          },
          fail: function(error) {
            console.error('跳转书写规范页面失败:', error);
            wx.showToast({
              title: '页面跳转失败',
              icon: 'none'
            });
          }
        });
      } else if (recommendation.type === 'exam_simulation') {
        // 考试模拟 - 跳转到综合测试
        console.log('跳转到考试模拟:', recommendation.targetUrl);
        wx.navigateTo({
          url: recommendation.targetUrl,
          success: function() {
            console.log('成功跳转到考试模拟页面');
          },
          fail: function(error) {
            console.error('跳转考试模拟页面失败:', error);
            wx.showToast({
              title: '页面跳转失败',
              icon: 'none'
            });
          }
        });
      } else if (recommendation.type === 'pronoun_practice' || recommendation.type === 'noun_practice' || recommendation.type === 'basic_writing_practice') {
        // 基础练习 - 跳转到书写练习页面（tabbar页面）
        console.log('跳转到基础练习页面:', recommendation.targetUrl);
        wx.switchTab({
          url: '/pages/grammar-writing/index',
          success: function() {
            console.log('成功跳转到基础练习页面');
            // 延迟处理URL参数，因为switchTab不支持参数
            setTimeout(() => {
              this.handleTablesParameterAfterSwitch(recommendation.targetUrl);
            }, 500);
          }.bind(this),
          fail: function(error) {
            console.error('跳转基础练习页面失败:', error);
            wx.showToast({
              title: '页面跳转失败',
              icon: 'none'
            });
          }
        });
      } else if (recommendation.type === 'custom_combination') {
        // 自由组合练习 - 跳转到语法选择页面
        console.log('跳转到语法选择页面:', recommendation.targetUrl);
        wx.navigateTo({
          url: recommendation.targetUrl,
          success: function() {
            console.log('成功跳转到语法选择页面');
          },
          fail: function(error) {
            console.error('跳转语法选择页面失败:', error);
            wx.showToast({
              title: '页面跳转失败',
              icon: 'none'
            });
          }
        });
      } else {
        // 其他类型 - 使用原来的跳转逻辑
        console.log('其他类型跳转:', recommendation.targetUrl);
        if (recommendation.targetUrl.includes('?')) {
          wx.navigateTo({
            url: recommendation.targetUrl
          });
        } else {
          if (recommendation.targetUrl === '/pages/index/index') {
            wx.switchTab({
              url: recommendation.targetUrl
            });
          } else {
            wx.navigateTo({
              url: recommendation.targetUrl
            });
          }
        }
      }
      
      // 显示跳转提示
      wx.showToast({
        title: `正在生成${recommendation.title}`,
        icon: 'success',
        duration: 1500
      });
    } else {
      console.error('推荐练习数据不存在:', index, testResults.specificRecommendations);
      wx.showToast({
        title: '推荐练习数据错误',
        icon: 'none'
      });
    }
  },

  // 处理switchTab后的参数传递
  handleTablesParameterAfterSwitch: function(targetUrl) {
    console.log('处理switchTab后的参数:', targetUrl);
    
    // 从URL中提取tables参数（手动解析，不使用URLSearchParams）
    const urlParts = targetUrl.split('?');
    if (urlParts.length > 1) {
      const queryString = urlParts[1];
      const params = this.parseQueryString(queryString);
      const tables = params.tables;
      
      if (tables) {
        console.log('提取到tables参数:', tables);
        
        // 将参数存储到全局数据中，供目标页面使用
        wx.setStorageSync('pendingTablesParameter', tables);
        
        // 通知目标页面处理参数
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        
        if (currentPage && currentPage.handleTablesParameter) {
          currentPage.handleTablesParameter(tables);
        }
      }
    }
  },

  // 解析查询字符串
  parseQueryString: function(queryString) {
    const params = {};
    if (queryString) {
      const pairs = queryString.split('&');
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        if (pair.length === 2) {
          params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
      }
    }
    return params;
  },

  // 生成推荐练习题目
  generateRecommendedQuestions: function(difficulty, mode, count, title) {
    console.log('开始生成推荐题目:', { difficulty, mode, count, title });
    
    wx.showLoading({
      title: '生成题目中...'
    });

    try {
      // 加载题库
      console.log('加载题库数据...');
      const questionsData = require('../../data/intermediate_questions.js');
      console.log('题库数据加载成功:', Object.keys(questionsData).length, '个语法点');
      
      // 获取所有可用的语法点
      const allPoints = Object.keys(questionsData);
      console.log('可用语法点:', allPoints);
      
      // 随机选择多个语法点
      const selectedPoints = this.getRandomPoints(allPoints, Math.min(5, allPoints.length));
      console.log('选中的语法点:', selectedPoints);
      
      // 从选中的语法点中随机抽取题目
      const questions = [];
      const questionsPerPoint = Math.ceil(count / selectedPoints.length);
      console.log('每个语法点题目数:', questionsPerPoint);
      
      selectedPoints.forEach(point => {
        const pointQuestions = questionsData[point] || [];
        console.log(`语法点 ${point} 有 ${pointQuestions.length} 道题目`);
        const randomQuestions = this.getRandomQuestions(pointQuestions, questionsPerPoint);
        questions.push(...randomQuestions);
      });

      console.log('收集到的题目总数:', questions.length);

      // 随机打乱题目顺序
      const shuffledQuestions = this.shuffleArray(questions.slice(0, count));
      console.log('最终题目数量:', shuffledQuestions.length);

      wx.hideLoading();

      // 跳转到练习页面
      const practiceTitle = title || `${this.getDifficultyName(difficulty)} - ${this.getModeName(mode)}`;
      const url = `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(shuffledQuestions))}&level=${difficulty}&mode=${mode}&title=${encodeURIComponent(practiceTitle)}`;
      
      console.log('准备跳转到练习页面:', url);
      
      wx.navigateTo({
        url: url,
        success: function() {
          console.log('成功跳转到练习页面');
        },
        fail: function(error) {
          console.error('跳转练习页面失败:', error);
          wx.showToast({
            title: '跳转失败',
            icon: 'none'
          });
        }
      });

    } catch (error) {
      wx.hideLoading();
      console.error('生成推荐题目失败:', error);
      wx.showToast({
        title: '生成题目失败: ' + error.message,
        icon: 'none',
        duration: 3000
      });
    }
  },

  // 获取推荐难度
  getRecommendedDifficulty: function(totalLevel) {
    switch(totalLevel) {
      case 'level1':
      case 'level2':
        return 'beginner';
      case 'level3':
        return 'intermediate';
      case 'level4':
      case 'level5':
        return 'advanced';
      default:
        return 'intermediate';
    }
  },

  // 获取难度名称
  getDifficultyName: function(difficulty) {
    const difficultyMap = {
      'beginner': '初级',
      'intermediate': '中级',
      'advanced': '高级'
    };
    return difficultyMap[difficulty] || '中级';
  },

  // 获取模式名称
  getModeName: function(mode) {
    const modeMap = {
      'quick': '快速练习',
      'comprehensive': '综合练习',
      'focused': '专项练习',
      'challenge': '挑战模式'
    };
    return modeMap[mode] || '综合练习';
  },


  // 测试选项点击功能
  testOptionClick: function() {
    console.log('测试选项点击功能');
    
    // 检查当前数据状态
    console.log('当前数据状态:', {
      testState: this.data.testState,
      grammarQuestions: this.data.grammarQuestions,
      currentQuestion: this.data.currentQuestion,
      currentQuestionIndex: this.data.currentQuestionIndex
    });
    
    // 如果还没有题目数据，先初始化
    if (this.data.grammarQuestions.length === 0) {
      console.log('题目数据为空，重新初始化');
      this.initTest();
    }
    
    // 如果还没有开始测试，先开始测试
    if (this.data.testState !== 'grammar-test') {
      console.log('开始测试');
      this.startGrammarTest();
    }
    
    // 模拟点击第一个选项
    setTimeout(() => {
      console.log('模拟点击第一个选项');
      const mockEvent = {
        currentTarget: {
          dataset: { index: 0 }
        }
      };
      this.selectGrammarAnswer(mockEvent);
    }, 1000);
  },

  // 调试选项点击问题
  debugOptionClick: function() {
    console.log('=== 调试选项点击问题 ===');
    console.log('当前测试状态:', this.data.testState);
    console.log('语法题目数量:', this.data.grammarQuestions.length);
    console.log('当前题目索引:', this.data.currentQuestionIndex);
    console.log('当前题目数据:', this.data.currentQuestion);
    
    if (this.data.currentQuestion && this.data.currentQuestion.options) {
      console.log('选项数据:', this.data.currentQuestion.options);
      this.data.currentQuestion.options.forEach((option, index) => {
        console.log(`选项${index}:`, option);
      });
    } else {
      console.log('当前题目或选项数据为空');
    }
    
    // 强制重新初始化并开始测试
    console.log('强制重新初始化测试');
    this.initTest();
    setTimeout(() => {
      this.startGrammarTest();
    }, 500);
  },

  // 预览各等级结果
  previewLevelResults: function() {
    console.log('预览各等级结果');
    
    // 生成各等级的预览数据
    const previewLevels = [
      {
        level: 'level1',
        title: 'Level 1 - 较为薄弱',
        subtitle: '基础用户 (0-39%)',
        grammarCorrect: 1,
        writingCorrect: 1,
        totalCorrect: 2,
        grammarLevel: 'level1',
        writingLevel: 'level1',
        totalLevel: 'level1',
        userLevel: '基础用户',
        recommendation: '书写规范界面',
        suggestion: '建议从基础表格开始系统学习，每周练会一个表格，配上您的绝佳理解力，前期稳后续进步会超快',
        nextSteps: ['进入书写规范界面', '从基础表格开始', '系统学习相关表格']
      },
      {
        level: 'level2',
        title: 'Level 2 - 稍弱',
        subtitle: '初级用户 (40-59%)',
        grammarCorrect: 2,
        writingCorrect: 2,
        totalCorrect: 4,
        grammarLevel: 'level2',
        writingLevel: 'level2',
        totalLevel: 'level2',
        userLevel: '初级用户',
        recommendation: '进阶之旅',
        suggestion: '建议每周突破一个小点，超稳的',
        nextSteps: ['简易版书写测试', '针对性练习薄弱环节', '每周突破一个小点']
      },
      {
        level: 'level3',
        title: 'Level 3 - 不错哦',
        subtitle: '中级用户 (60-79%)',
        grammarCorrect: 3,
        writingCorrect: 3,
        totalCorrect: 6,
        grammarLevel: 'level3',
        writingLevel: 'level3',
        totalLevel: 'level3',
        userLevel: '中级用户',
        recommendation: '进阶之旅',
        suggestion: '建议每周突破一个小点，超稳的',
        nextSteps: ['简易版书写测试', '针对性练习薄弱环节', '每周突破一个小点']
      },
      {
        level: 'level4',
        title: 'Level 4 - 超棒的',
        subtitle: '高级用户 (80-99%)',
        grammarCorrect: 4,
        writingCorrect: 4,
        totalCorrect: 8,
        grammarLevel: 'level4',
        writingLevel: 'level4',
        totalLevel: 'level4',
        userLevel: '高级用户',
        recommendation: '系统推荐模块',
        suggestion: '建议搭配主页的进阶之旅，更快发现薄弱点，将薄弱点放进专属组合每天练，下个语法大神就是你',
        nextSteps: ['进入综合练习', '自由组合语法专题', '高考模拟练习']
      },
      {
        level: 'level5',
        title: 'Level 5 - 简直完美',
        subtitle: '高级用户 (100%)',
        grammarCorrect: 5,
        writingCorrect: 5,
        totalCorrect: 10,
        grammarLevel: 'level5',
        writingLevel: 'level5',
        totalLevel: 'level5',
        userLevel: '高级用户',
        recommendation: '系统推荐模块',
        suggestion: '建议搭配主页的进阶之旅，更快发现薄弱点，将薄弱点放进专属组合每天练，下个语法大神就是你',
        nextSteps: ['进入综合练习', '自由组合语法专题', '高考模拟练习']
      }
    ];
    
    this.setData({
      previewLevels: previewLevels,
      testState: 'preview'
    });
  },

  // 关闭预览
  closePreview: function() {
    this.setData({
      testState: 'welcome',
      previewLevels: []
    });
  }
});
