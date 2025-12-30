// 调试题目匹配问题
console.log('=== 调试题目匹配 ===');

const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];

console.log('\n当前作业数量:', homeworks.length);

if (homeworks.length > 0) {
  const latestHomework = homeworks[0];
  console.log('\n最新作业信息:');
  console.log('- 作业ID:', latestHomework._id);
  console.log('- 作业标题:', latestHomework.title);
  console.log('- 作业类型:', latestHomework.type);
  
  if (latestHomework.selectedItems) {
    console.log('\n✅ selectedItems (推荐使用):');
    latestHomework.selectedItems.forEach((item, index) => {
      console.log(`  ${index + 1}. 语法点名称: "${item.name}"`);
      console.log(`     题目数量: ${item.questionCount}`);
      console.log(`     完整对象:`, item);
    });
  }
  
  if (latestHomework.selectedGrammarPoints) {
    console.log('\n✅ selectedGrammarPoints:');
    latestHomework.selectedGrammarPoints.forEach((point, index) => {
      console.log(`  ${index + 1}. "${point}"`);
    });
  }
}

// 测试题库加载
console.log('\n=== 测试题库加载 ===');

// 尝试加载选择题题库
try {
  const choiceQuestions = require('../../语法选择题题库/语法选择题题库.json');
  console.log('✅ 选择题题库加载成功');
  console.log('   题目总数:', choiceQuestions.questions ? choiceQuestions.questions.length : 0);
  
  if (choiceQuestions.questions && choiceQuestions.questions.length > 0) {
    console.log('\n   题库中的语法点示例:');
    const uniqueGrammarPoints = [...new Set(choiceQuestions.questions.map(q => q.grammarPoint))];
    uniqueGrammarPoints.slice(0, 10).forEach((point, index) => {
      console.log(`   ${index + 1}. "${point}"`);
    });
  }
} catch (error) {
  console.log('❌ 选择题题库加载失败:', error.message);
}

// 尝试加载填空题题库
try {
  const writingQuestions = require('./miniprogram/writing_exercise_questions.js').writingExerciseQuestions;
  console.log('\n✅ 填空题题库加载成功');
  const totalQuestions = Object.keys(writingQuestions).length;
  console.log('   表格总数:', totalQuestions);
  
  console.log('\n   填空题类别示例:');
  Object.values(writingQuestions).slice(0, 3).forEach((questions, index) => {
    if (questions && questions.length > 0) {
      console.log(`   ${index + 1}. ${questions[0].category} (${questions.length}题)`);
    }
  });
} catch (error) {
  console.log('❌ 填空题题库加载失败:', error.message);
}

// 测试匹配逻辑
if (homeworks.length > 0 && homeworks[0].selectedItems) {
  console.log('\n=== 测试题目匹配逻辑 ===');
  
  const testItem = homeworks[0].selectedItems[0];
  console.log('\n测试语法点:', testItem.name);
  
  try {
    const choiceQuestions = require('../../语法选择题题库/语法选择题题库.json');
    
    if (choiceQuestions && choiceQuestions.questions) {
      // 测试不同的匹配策略
      const exactMatch = choiceQuestions.questions.filter(q => q.grammarPoint === testItem.name);
      console.log(`\n1. 精确匹配 (grammarPoint === "${testItem.name}"):`, exactMatch.length, '个');
      
      const categoryMatch = choiceQuestions.questions.filter(q => 
        q.category && q.category.includes(testItem.name)
      );
      console.log(`2. 类别包含匹配 (category includes "${testItem.name}"):`, categoryMatch.length, '个');
      
      const reverseMatch = choiceQuestions.questions.filter(q => 
        testItem.name.includes(q.grammarPoint)
      );
      console.log(`3. 反向包含匹配 ("${testItem.name}" includes grammarPoint):`, reverseMatch.length, '个');
      
      // 显示所有可能的语法点
      console.log('\n📋 题库中包含"介词"相关的语法点:');
      const prepRelated = choiceQuestions.questions.filter(q => 
        q.grammarPoint.includes('介词') || q.category && q.category.includes('介词')
      );
      prepRelated.forEach((q, index) => {
        console.log(`   ${index + 1}. grammarPoint: "${q.grammarPoint}", category: "${q.category}"`);
        console.log(`      题目: ${q.question.substring(0, 50)}...`);
      });
    }
  } catch (error) {
    console.log('匹配测试失败:', error.message);
  }
}

console.log('\n=== 调试完成 ===');
