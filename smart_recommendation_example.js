// 智能题库推荐系统使用示例
// 演示去重、内容扰动、难度控制等功能

const SmartQuestionRecommendation = require('./utils/smartQuestionRecommendation');
const RecommendationService = require('./utils/recommendationService');
const RedisCache = require('./utils/redisCache');

// 示例1：基本推荐流程演示
async function demonstrateBasicRecommendation() {
  console.log('=== 基本推荐流程演示 ===\n');
  
  const recommendationService = new RecommendationService();
  const userId = 'user_12345';
  
  // 1. 生成每日推荐
  console.log('1. 生成每日推荐');
  const dailyResult = await recommendationService.getDailyRecommendation(userId, 10);
  if (dailyResult.success) {
    console.log(`每日推荐成功：${dailyResult.data.count}道题目`);
    console.log('题目ID:', dailyResult.data.questions.map(q => q.qid).join(', '));
  }
  
  console.log('\n2. 生成进阶之旅推荐');
  const advancedResult = await recommendationService.getAdvancedJourneyRecommendation(userId, 15);
  if (advancedResult.success) {
    console.log(`进阶之旅推荐成功：${advancedResult.data.count}道题目`);
    console.log('题目ID:', advancedResult.data.questions.map(q => q.qid).join(', '));
  }
  
  console.log('\n3. 生成个性化推荐');
  const personalizedResult = await recommendationService.getPersonalizedRecommendation(userId, 12);
  if (personalizedResult.success) {
    console.log(`个性化推荐成功：${personalizedResult.data.count}道题目`);
    console.log('推荐类型:', personalizedResult.data.type);
    console.log('用户等级:', personalizedResult.data.userLevel);
  }
}

// 示例2：去重功能演示
async function demonstrateDuplicateRemoval() {
  console.log('\n=== 去重功能演示 ===\n');
  
  const smartRecommendation = new SmartQuestionRecommendation();
  const userId = 'user_67890';
  
  // 第一次推荐
  console.log('第一次推荐：');
  const firstRecommendation = await smartRecommendation.getNoDuplicateQuestions(
    userId, 
    'daily_recommend', 
    5
  );
  console.log('推荐题目ID:', firstRecommendation.map(q => q.qid).join(', '));
  
  // 第二次推荐（应该避免重复）
  console.log('\n第二次推荐（去重后）：');
  const secondRecommendation = await smartRecommendation.getNoDuplicateQuestions(
    userId, 
    'daily_recommend', 
    5
  );
  console.log('推荐题目ID:', secondRecommendation.map(q => q.qid).join(', '));
  
  // 检查去重效果
  const firstQids = firstRecommendation.map(q => q.qid);
  const secondQids = secondRecommendation.map(q => q.qid);
  const duplicates = firstQids.filter(qid => secondQids.includes(qid));
  
  console.log(`\n去重效果：重复题目数量 ${duplicates.length}`);
  if (duplicates.length === 0) {
    console.log('✅ 去重功能正常工作');
  } else {
    console.log('❌ 去重功能异常，存在重复题目');
  }
}

// 示例3：内容扰动演示
async function demonstrateContentPerturbation() {
  console.log('\n=== 内容扰动演示 ===\n');
  
  const smartRecommendation = new SmartQuestionRecommendation();
  const userId = 'user_11111';
  
  // 生成候选题目
  const candidateQuestions = smartRecommendation.generateMockQuestions().slice(0, 20);
  console.log(`候选题目数量：${candidateQuestions.length}`);
  
  // 内容扰动过滤
  const filteredQuestions = await smartRecommendation.filterGrammarPointByCooling(
    userId, 
    candidateQuestions
  );
  console.log(`过滤后题目数量：${filteredQuestions.length}`);
  
  // 分析语法点分布
  const grammarPointCount = {};
  filteredQuestions.forEach(q => {
    const point = q.grammar_point || q.category || 'other';
    grammarPointCount[point] = (grammarPointCount[point] || 0) + 1;
  });
  
  console.log('\n语法点分布：');
  Object.entries(grammarPointCount).forEach(([point, count]) => {
    console.log(`${point}: ${count}道题`);
  });
}

// 示例4：难度控制演示
async function demonstrateDifficultyControl() {
  console.log('\n=== 难度控制演示 ===\n');
  
  const smartRecommendation = new SmartQuestionRecommendation();
  const userId = 'user_22222';
  
  // 生成候选题目
  const candidateQuestions = smartRecommendation.generateMockQuestions().slice(0, 30);
  
  // 模拟不同正确率下的难度调整
  const accuracyLevels = [45, 70, 90]; // 低、中、高正确率
  
  for (const accuracy of accuracyLevels) {
    console.log(`\n正确率 ${accuracy}% 的难度调整：`);
    
    const adjustedQuestions = await smartRecommendation.adjustQuestionDifficulty(
      userId, 
      accuracy, 
      candidateQuestions
    );
    
    // 分析难度分布
    const difficultyCount = {};
    adjustedQuestions.forEach(q => {
      const difficulty = q.difficulty_level || smartRecommendation.getDifficultyFromLevel(q.level) || 3;
      difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
    });
    
    console.log('难度分布：');
    Object.entries(difficultyCount).forEach(([level, count]) => {
      console.log(`  难度${level}: ${count}道题`);
    });
  }
}

// 示例5：语法点冷却状态演示
async function demonstrateCoolingStatus() {
  console.log('\n=== 语法点冷却状态演示 ===\n');
  
  const recommendationService = new RecommendationService();
  const userId = 'user_33333';
  
  // 获取语法点冷却状态
  const coolingResult = await recommendationService.getGrammarPointCoolingStatus(userId);
  
  if (coolingResult.success) {
    console.log('语法点冷却状态：');
    Object.entries(coolingResult.data.grammarPointStatus).forEach(([point, status]) => {
      const statusText = status.canRecommend ? '✅可推荐' : '❌冷却中';
      console.log(`${point}: ${statusText} (${Math.floor(status.timeDiff/3600)}小时前)`);
    });
  }
  
  // 手动更新某个语法点的时间（模拟48小时前）
  console.log('\n手动更新"介词"语法点时间为48小时前：');
  const updateResult = await recommendationService.updateGrammarPointTime(userId, 'preposition', 48);
  if (updateResult.success) {
    console.log('更新成功：', updateResult.data);
  }
}

// 示例6：综合推荐流程演示
async function demonstrateCompleteFlow() {
  console.log('\n=== 综合推荐流程演示 ===\n');
  
  const recommendationService = new RecommendationService();
  const userId = 'user_44444';
  
  // 获取今日统计
  console.log('1. 获取今日统计：');
  const statsResult = await recommendationService.getTodayStats(userId);
  if (statsResult.success) {
    console.log(`今日已做题数量：${statsResult.data.todayDoneCount}`);
  }
  
  // 生成个性化推荐
  console.log('\n2. 生成个性化推荐：');
  const personalizedResult = await recommendationService.getPersonalizedRecommendation(userId, 8);
  if (personalizedResult.success) {
    const questions = personalizedResult.data.questions;
    console.log(`推荐成功：${questions.length}道题目`);
    
    // 分析推荐结果
    const grammarPointAnalysis = {};
    const difficultyAnalysis = {};
    
    questions.forEach(q => {
      const point = q.grammar_point || q.category || 'other';
      const difficulty = q.difficulty_level || 3;
      
      grammarPointAnalysis[point] = (grammarPointAnalysis[point] || 0) + 1;
      difficultyAnalysis[difficulty] = (difficultyAnalysis[difficulty] || 0) + 1;
    });
    
    console.log('\n推荐分析：');
    console.log('语法点分布：', grammarPointAnalysis);
    console.log('难度分布：', difficultyAnalysis);
  }
  
  // 清除今日进度（重置功能）
  console.log('\n3. 清除今日进度：');
  const clearResult = await recommendationService.clearTodayProgress(userId);
  if (clearResult.success) {
    console.log(`清除成功：${clearResult.data.clearedCount}道题`);
  }
}

// 主函数：运行所有演示
async function runAllDemonstrations() {
  console.log('🚀 开始运行智能题库推荐系统演示\n');
  
  try {
    await demonstrateBasicRecommendation();
    await demonstrateDuplicateRemoval();
    await demonstrateContentPerturbation();
    await demonstrateDifficultyControl();
    await demonstrateCoolingStatus();
    await demonstrateCompleteFlow();
    
    console.log('\n✅ 所有演示完成！');
    
  } catch (error) {
    console.error('演示过程中出现错误:', error);
  }
}

// 如果直接运行此文件，执行演示
if (require.main === module) {
  runAllDemonstrations();
}

module.exports = {
  demonstrateBasicRecommendation,
  demonstrateDuplicateRemoval,
  demonstrateContentPerturbation,
  demonstrateDifficultyControl,
  demonstrateCoolingStatus,
  demonstrateCompleteFlow,
  runAllDemonstrations
};
