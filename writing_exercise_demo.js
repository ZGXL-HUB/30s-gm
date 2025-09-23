// 书写规范填空题练习系统使用演示
// 展示如何使用系统进行练习、查看进度和统计

const { WritingExercisePractice } = require('./writing_exercise_practice.js');

// 创建练习系统实例
const practiceSystem = new WritingExercisePractice();

// 演示函数
function demonstrateSystem() {
  console.log('=== 书写规范填空题练习系统演示 ===\n');

  // 1. 查看所有可用的表格
  console.log('1. 可用的练习表格:');
  const tableIds = practiceSystem.getAllTableIds();
  tableIds.forEach((tableId, index) => {
    const questions = practiceSystem.getTableQuestions(tableId);
    console.log(`   ${index + 1}. ${practiceSystem.getTableDisplayName(tableId)} (${questions.length}题)`);
  });
  console.log('');

  // 2. 查看表格分类
  console.log('2. 表格分类:');
  const categories = practiceSystem.getTableCategories();
  Object.keys(categories).forEach(category => {
    console.log(`   ${category}:`);
    categories[category].forEach(table => {
      console.log(`     - ${table.name}: ${table.completedCount}/${table.questionCount}题完成, 正确率${table.accuracy}%`);
    });
  });
  console.log('');

  // 3. 开始练习示例
  console.log('3. 开始练习示例 (代词书写):');
  const firstQuestion = practiceSystem.startPractice('pronoun_001');
  if (firstQuestion) {
    console.log(`   题目 ${firstQuestion.questionNumber}/${firstQuestion.totalQuestions}: ${firstQuestion.question}`);
    console.log(`   进度: ${firstQuestion.progress}%`);
    console.log('');

    // 模拟用户答题
    console.log('4. 模拟答题过程:');
    
    // 第一题：正确答案
    console.log('   第一题 - 用户答案: "I"');
    const result1 = practiceSystem.submitAnswer('I');
    console.log(`   结果: ${result1.isCorrect ? '✓ 正确' : '✗ 错误'}`);
    console.log(`   正确答案: ${result1.correctAnswer}`);
    console.log(`   解析: ${result1.analysis}`);
    console.log('');

    // 第二题：错误答案
    console.log('   第二题 - 用户答案: "him"');
    const result2 = practiceSystem.submitAnswer('him');
    console.log(`   结果: ${result2.isCorrect ? '✓ 正确' : '✗ 错误'}`);
    console.log(`   正确答案: ${result2.correctAnswer}`);
    console.log(`   解析: ${result2.analysis}`);
    console.log('');

    // 第三题：正确答案
    console.log('   第三题 - 用户答案: "their"');
    const result3 = practiceSystem.submitAnswer('their');
    console.log(`   结果: ${result3.isCorrect ? '✓ 正确' : '✗ 错误'}`);
    console.log(`   正确答案: ${result3.correctAnswer}`);
    console.log(`   解析: ${result3.analysis}`);
    console.log('');

    // 完成练习
    const sessionStats = practiceSystem.finishPractice();
    console.log('5. 练习完成统计:');
    console.log(`   总题数: ${sessionStats.totalQuestions}`);
    console.log(`   已答题数: ${sessionStats.answeredQuestions}`);
    console.log(`   正确答案数: ${sessionStats.correctAnswers}`);
    console.log(`   正确率: ${sessionStats.accuracy}%`);
    console.log(`   练习时长: ${sessionStats.duration}`);
    console.log('');
  }

  // 6. 查看练习历史
  console.log('6. 练习历史:');
  const history = practiceSystem.getPracticeHistory('pronoun_001');
  if (history.length > 0) {
    history.forEach((session, index) => {
      console.log(`   第${index + 1}次练习: ${session.accuracy}%正确率, 用时${session.duration}`);
    });
  } else {
    console.log('   暂无练习历史');
  }
  console.log('');

  // 7. 查看总体统计
  console.log('7. 总体统计:');
  const overallStats = practiceSystem.getOverallStats();
  console.log(`   总表格数: ${overallStats.totalTables}`);
  console.log(`   总题目数: ${overallStats.totalQuestions}`);
  console.log(`   已完成题目: ${overallStats.totalAnswered}`);
  console.log(`   总体正确率: ${overallStats.overallAccuracy}%`);
  console.log(`   完成率: ${overallStats.completionRate}%`);
  console.log('');

  // 8. 演示其他表格的练习
  console.log('8. 演示其他表格练习:');
  
  // 名词后缀识别练习
  console.log('   开始名词后缀识别练习:');
  const nounQuestion = practiceSystem.startPractice('noun_001');
  if (nounQuestion) {
    console.log(`   题目: ${nounQuestion.question}`);
    const nounResult = practiceSystem.submitAnswer('-ness');
    console.log(`   答案: "-ness" - ${nounResult.isCorrect ? '✓ 正确' : '✗ 错误'}`);
    practiceSystem.finishPractice();
  }
  console.log('');

  // 9. 导出进度数据
  console.log('9. 导出进度数据:');
  const exportedData = practiceSystem.exportProgress();
  console.log(`   导出时间: ${exportedData.exportTime}`);
  console.log(`   数据大小: ${JSON.stringify(exportedData).length} 字符`);
  console.log('');

  // 10. 重置进度演示
  console.log('10. 重置进度演示:');
  console.log('   重置前完成题目数:', practiceSystem.getCompletedCount('pronoun_001'));
  practiceSystem.resetProgress('pronoun_001');
  console.log('   重置后完成题目数:', practiceSystem.getCompletedCount('pronoun_001'));
  console.log('');

  console.log('=== 演示完成 ===');
}

// 如果直接运行此文件，执行演示
if (require.main === module) {
  demonstrateSystem();
}

// 导出演示函数
module.exports = {
  demonstrateSystem
};

// 如果是在浏览器环境中使用
if (typeof window !== 'undefined') {
  window.demonstrateSystem = demonstrateSystem;
}
