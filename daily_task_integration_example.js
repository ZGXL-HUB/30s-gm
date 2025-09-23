// 每日任务卡片集成示例
// 演示Vue组件到小程序组件的完整集成流程

const RecommendationService = require('./utils/recommendationService');
const recommendationApi = require('./miniprogram/api/recommendationApi');

// 示例1：模拟Vue组件的数据流
async function simulateVueComponentFlow() {
  console.log('=== 模拟Vue组件数据流 ===\n');
  
  const userId = 'user_vue_test';
  const continueStudyDays = 5;
  
  // 1. 获取近7天活跃占比
  console.log('1. 获取近7天活跃占比');
  const activeRatioResult = await recommendationApi.getUserActiveRatio(userId);
  if (activeRatioResult.code === 200) {
    const { grammarRatio, writingRatio } = activeRatioResult.data;
    const defaultTabIndex = grammarRatio > 60 ? 0 : 1;
    const selectedTab = defaultTabIndex === 0 ? '语法' : '书写';
    
    console.log(`活跃占比 - 语法:${grammarRatio}%, 书写:${writingRatio}%`);
    console.log(`默认标签: ${selectedTab} (索引: ${defaultTabIndex})`);
  }
  
  // 2. 计算推荐题量
  console.log('\n2. 计算推荐题量');
  const questionCount = getQuestionCountByDay(continueStudyDays);
  console.log(`连续学习${continueStudyDays}天，推荐题量: ${questionCount}题`);
  
  // 3. 获取语法题目
  console.log('\n3. 获取语法题目');
  const grammarResult = await recommendationApi.getNoDuplicateQuestions(
    userId, 'daily_recommend', '语法', questionCount
  );
  
  if (grammarResult.code === 200) {
    const grammarQuestions = grammarResult.data.questions;
    const grammarEstimatedTime = Math.ceil(questionCount * 0.7);
    
    console.log(`语法题目: ${grammarQuestions.length}道`);
    console.log(`预计时间: ${grammarEstimatedTime}分钟`);
    console.log('题目ID:', grammarQuestions.map(q => q.qid).join(', '));
  }
  
  // 4. 获取书写题目
  console.log('\n4. 获取书写题目');
  const writingResult = await recommendationApi.getNoDuplicateQuestions(
    userId, 'daily_recommend', '书写', questionCount
  );
  
  if (writingResult.code === 200) {
    const writingQuestions = writingResult.data.questions;
    const writingEstimatedTime = Math.ceil(questionCount * 1.5);
    
    console.log(`书写题目: ${writingQuestions.length}道`);
    console.log(`预计时间: ${writingEstimatedTime}分钟`);
    console.log('题目ID:', writingQuestions.map(q => q.qid).join(', '));
  }
}

// 示例2：测试不同连续天数的题量
function testQuestionCountByDay() {
  console.log('\n=== 测试不同连续天数的题量 ===\n');
  
  const testCases = [
    { days: 1, expected: 8 },
    { days: 2, expected: 8 },
    { days: 3, expected: 10 },
    { days: 5, expected: 10 },
    { days: 7, expected: 10 },
    { days: 8, expected: 15 },
    { days: 15, expected: 15 }
  ];
  
  testCases.forEach(testCase => {
    const actual = getQuestionCountByDay(testCase.days);
    const status = actual === testCase.expected ? '✅' : '❌';
    
    console.log(`${status} ${testCase.days}天 -> 期望:${testCase.expected}题, 实际:${actual}题`);
  });
}

// 示例3：测试标签切换逻辑
async function testTabSwitching() {
  console.log('\n=== 测试标签切换逻辑 ===\n');
  
  const userId = 'user_tab_test';
  
  // 模拟语法活跃用户
  console.log('模拟语法活跃用户:');
  const grammarActiveResult = await recommendationApi.getUserActiveRatio('user_grammar_active');
  if (grammarActiveResult.code === 200) {
    const { grammarRatio, writingRatio } = grammarActiveResult.data;
    const defaultTab = grammarRatio > 60 ? '语法' : '书写';
    console.log(`语法活跃度:${grammarRatio}%, 默认标签:${defaultTab}`);
  }
  
  // 模拟书写活跃用户
  console.log('\n模拟书写活跃用户:');
  const writingActiveResult = await recommendationApi.getUserActiveRatio('user_writing_active');
  if (writingActiveResult.code === 200) {
    const { grammarRatio, writingRatio } = writingActiveResult.data;
    const defaultTab = grammarRatio > 60 ? '语法' : '书写';
    console.log(`语法活跃度:${grammarRatio}%, 默认标签:${defaultTab}`);
  }
}

// 示例4：测试去重功能
async function testDuplicateRemoval() {
  console.log('\n=== 测试去重功能 ===\n');
  
  const userId = 'user_duplicate_test';
  const questionCount = 5;
  
  // 第一次获取
  console.log('第一次获取语法题目:');
  const firstResult = await recommendationApi.getNoDuplicateQuestions(
    userId, 'daily_recommend', '语法', questionCount
  );
  
  if (firstResult.code === 200) {
    const firstQuestions = firstResult.data.questions;
    console.log(`获取到${firstQuestions.length}道题目`);
    console.log('题目ID:', firstQuestions.map(q => q.qid).join(', '));
    
    // 第二次获取（应该避免重复）
    console.log('\n第二次获取语法题目（去重后）:');
    const secondResult = await recommendationApi.getNoDuplicateQuestions(
      userId, 'daily_recommend', '语法', questionCount
    );
    
    if (secondResult.code === 200) {
      const secondQuestions = secondResult.data.questions;
      console.log(`获取到${secondQuestions.length}道题目`);
      console.log('题目ID:', secondQuestions.map(q => q.qid).join(', '));
      
      // 检查重复
      const firstQids = firstQuestions.map(q => q.qid);
      const secondQids = secondQuestions.map(q => q.qid);
      const duplicates = firstQids.filter(qid => secondQids.includes(qid));
      
      console.log(`\n去重效果: 重复题目数量 ${duplicates.length}`);
      if (duplicates.length === 0) {
        console.log('✅ 去重功能正常工作');
      } else {
        console.log('❌ 去重功能异常，存在重复题目:', duplicates);
      }
    }
  }
}

// 示例5：模拟小程序组件生命周期
async function simulateMiniProgramComponentLifecycle() {
  console.log('\n=== 模拟小程序组件生命周期 ===\n');
  
  const userId = 'user_mp_test';
  const continueStudyDays = 6;
  
  console.log('组件初始化阶段:');
  console.log('1. attached() - 组件初始化');
  console.log('2. 获取用户活跃占比');
  
  const activeRatioResult = await recommendationApi.getUserActiveRatio(userId);
  if (activeRatioResult.code === 200) {
    const { grammarRatio, writingRatio } = activeRatioResult.data;
    const defaultTabIndex = grammarRatio > 60 ? 0 : 1;
    const selectedTab = defaultTabIndex === 0 ? '语法' : '书写';
    
    console.log(`   默认标签: ${selectedTab}`);
    console.log('3. 获取默认标签题目');
    
    const questionCount = getQuestionCountByDay(continueStudyDays);
    const questionsResult = await recommendationApi.getNoDuplicateQuestions(
      userId, 'daily_recommend', selectedTab, questionCount
    );
    
    if (questionsResult.code === 200) {
      const questions = questionsResult.data.questions;
      const estimatedTime = Math.ceil(
        selectedTab === '语法' ? questions.length * 0.7 : questions.length * 1.5
      );
      
      console.log(`   获取到${questions.length}道${selectedTab}题目`);
      console.log(`   预计时间: ${estimatedTime}分钟`);
      
      console.log('\n用户交互阶段:');
      console.log('4. 用户切换到书写标签');
      
      const writingResult = await recommendationApi.getNoDuplicateQuestions(
        userId, 'daily_recommend', '书写', questionCount
      );
      
      if (writingResult.code === 200) {
        const writingQuestions = writingResult.data.questions;
        const writingEstimatedTime = Math.ceil(writingQuestions.length * 1.5);
        
        console.log(`   获取到${writingQuestions.length}道书写题目`);
        console.log(`   预计时间: ${writingEstimatedTime}分钟`);
        
        console.log('\n5. 用户点击开始练习');
        console.log('   触发startPractice事件');
        console.log('   跳转到练习页面');
      }
    }
  }
}

// 辅助函数：按连续天数定题量
function getQuestionCountByDay(continueDays) {
  if (continueDays < 3) {
    return 8;
  } else if (continueDays > 7) {
    return 15;
  } else {
    return 10;
  }
}

// 主函数：运行所有示例
async function runAllExamples() {
  console.log('🚀 开始运行每日任务卡片集成示例\n');
  
  try {
    await simulateVueComponentFlow();
    testQuestionCountByDay();
    await testTabSwitching();
    await testDuplicateRemoval();
    await simulateMiniProgramComponentLifecycle();
    
    console.log('\n✅ 所有示例运行完成！');
    
  } catch (error) {
    console.error('示例运行过程中出现错误:', error);
  }
}

// 如果直接运行此文件，执行示例
if (require.main === module) {
  runAllExamples();
}

module.exports = {
  simulateVueComponentFlow,
  testQuestionCountByDay,
  testTabSwitching,
  testDuplicateRemoval,
  simulateMiniProgramComponentLifecycle,
  getQuestionCountByDay,
  runAllExamples
};
