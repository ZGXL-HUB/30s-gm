// 选择题题库使用示例
// 展示如何在小程序中使用退阶版选择题题库

// 引入选择题题库
const choiceQuestions = require('./miniprogram/data/choice_questions.js');

// 示例1: 获取特定分类的题目
function getQuestionsByCategory(categoryName) {
  if (choiceQuestions[categoryName]) {
    return choiceQuestions[categoryName];
  }
  return [];
}

// 示例2: 随机获取题目
function getRandomQuestion(categoryName = null) {
  if (categoryName && choiceQuestions[categoryName]) {
    const questions = choiceQuestions[categoryName];
    return questions[Math.floor(Math.random() * questions.length)];
  }
  
  // 随机选择一个分类
  const categories = Object.keys(choiceQuestions);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const questions = choiceQuestions[randomCategory];
  return questions[Math.floor(Math.random() * questions.length)];
}

// 示例3: 检查答案
function checkAnswer(question, selectedAnswer) {
  return {
    isCorrect: selectedAnswer === question.correctAnswer,
    correctAnswer: question.correctAnswer,
    analysis: question.analysis
  };
}

// 示例4: 获取所有分类
function getAllCategories() {
  return Object.keys(choiceQuestions);
}

// 示例5: 获取题目统计信息
function getQuestionStats() {
  const stats = {};
  let total = 0;
  
  for (const category in choiceQuestions) {
    const count = choiceQuestions[category].length;
    stats[category] = count;
    total += count;
  }
  
  stats.total = total;
  return stats;
}

// 使用示例
console.log('=== 选择题题库使用示例 ===\n');

// 1. 查看所有分类
console.log('📚 所有分类:');
const categories = getAllCategories();
categories.forEach(category => {
  const count = choiceQuestions[category].length;
  console.log(`   ${category}: ${count} 题`);
});

// 2. 获取综合练习的题目
console.log('\n🔍 综合练习题目示例:');
const practiceQuestions = getQuestionsByCategory('综合练习');
if (practiceQuestions.length > 0) {
  const question = practiceQuestions[0];
  console.log(`题目: ${question.text}`);
  console.log(`选项: ${question.options.join(' / ')}`);
  console.log(`正确答案: ${question.correctAnswer}`);
  console.log(`解析: ${question.analysis.substring(0, 100)}...`);
}

// 3. 随机获取一道题
console.log('\n🎲 随机题目示例:');
const randomQuestion = getRandomQuestion();
console.log(`分类: ${randomQuestion.category}`);
console.log(`题目: ${randomQuestion.text}`);
console.log(`选项: ${randomQuestion.options.join(' / ')}`);

// 4. 模拟答题
console.log('\n✅ 答题示例:');
const selectedAnswer = randomQuestion.options[0]; // 选择第一个选项
const result = checkAnswer(randomQuestion, selectedAnswer);
console.log(`选择的答案: ${selectedAnswer}`);
console.log(`是否正确: ${result.isCorrect ? '✅ 正确' : '❌ 错误'}`);
console.log(`正确答案: ${result.correctAnswer}`);

// 5. 统计信息
console.log('\n📊 题库统计:');
const stats = getQuestionStats();
console.log(`总题目数: ${stats.total}`);
console.log(`分类数量: ${categories.length}`);

// 在小程序中的使用方式
console.log('\n💡 在小程序中的使用方式:');
console.log(`
// 在页面的 .js 文件中:
const choiceQuestions = require('../../data/choice_questions.js');

Page({
  data: {
    currentQuestion: null,
    options: [],
    selectedAnswer: '',
    showResult: false
  },
  
  onLoad() {
    this.loadRandomQuestion();
  },
  
  loadRandomQuestion() {
    const categories = Object.keys(choiceQuestions);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const questions = choiceQuestions[randomCategory];
    const question = questions[Math.floor(Math.random() * questions.length)];
    
    this.setData({
      currentQuestion: question,
      options: question.options,
      selectedAnswer: '',
      showResult: false
    });
  },
  
  selectAnswer(e) {
    const selected = e.currentTarget.dataset.answer;
    this.setData({
      selectedAnswer: selected,
      showResult: true
    });
  }
});
`);

console.log('\n🎉 退阶版选择题题库创建完成！');
console.log('现在你可以在小程序中使用这个更简单的选择题形式了。');

