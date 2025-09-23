// 新功能集成测试
// 测试突破冷却专项练习接口和7天学习路径接口

const RecommendationService = require('./utils/recommendationService');
const recommendationApi = require('./miniprogram/api/recommendationApi');

async function testNewFeatures() {
  console.log('🚀 开始测试新功能集成...\n');
  
  const userId = 'test_user_12345';
  
  try {
    // 测试1: 突破冷却专项练习接口（白名单模式）
    console.log('📋 测试1: 突破冷却专项练习接口（白名单模式）');
    console.log('='.repeat(50));
    
    const practiceResult = await recommendationApi.getPracticeByWeakPoint(
      userId,
      '定语从句',
      5,
      true  // 白名单模式
    );
    
    console.log('API调用结果:', practiceResult.code === 200 ? '✅ 成功' : '❌ 失败');
    console.log('返回数据:', practiceResult.data);
    
    if (practiceResult.code === 200) {
      console.log(`✅ 获取到${practiceResult.data.count}道专项题目`);
      console.log(`✅ 语法点: ${practiceResult.data.pointName}`);
      console.log(`✅ 白名单模式: ${practiceResult.data.isWhitelist}`);
    }
    
    console.log('\n');
    
    // 测试2: 突破冷却专项练习接口（正常模式）
    console.log('📋 测试2: 突破冷却专项练习接口（正常模式）');
    console.log('='.repeat(50));
    
    const normalPracticeResult = await recommendationApi.getPracticeByWeakPoint(
      userId,
      '非谓语动词',
      5,
      false  // 正常模式
    );
    
    console.log('API调用结果:', normalPracticeResult.code === 200 ? '✅ 成功' : '❌ 失败');
    console.log('返回数据:', normalPracticeResult.data);
    
    console.log('\n');
    
    // 测试3: 7天学习路径接口
    console.log('📋 测试3: 7天学习路径接口');
    console.log('='.repeat(50));
    
    const planResult = await recommendationApi.getSevenDayPlan(userId);
    
    console.log('API调用结果:', planResult.code === 200 ? '✅ 成功' : '❌ 失败');
    console.log('返回数据:', planResult.data);
    
    if (planResult.code === 200) {
      console.log(`✅ 生成${planResult.data.plan.length}天学习计划`);
      console.log(`✅ 目标正确率: ${planResult.data.targetAccuracy}%`);
      console.log(`✅ 薄弱点数量: ${planResult.data.weakPoints.length}个`);
      
      // 显示7天计划详情
      console.log('\n📅 7天学习计划详情:');
      planResult.data.plan.forEach((day, index) => {
        console.log(`  Day${index + 1}: ${day.content} - ${day.target}`);
      });
    }
    
    console.log('\n');
    
    // 测试4: 推荐服务直接调用
    console.log('📋 测试4: 推荐服务直接调用');
    console.log('='.repeat(50));
    
    const recommendationService = new RecommendationService();
    
    // 测试每日挑战
    const dailyChallengeResult = await recommendationService.getDailyChallenge(
      userId, 
      10, 
      '语法'
    );
    console.log('每日挑战结果:', dailyChallengeResult.success ? '✅ 成功' : '❌ 失败');
    
    // 测试学习路径推荐
    const learningPathResult = await recommendationService.getLearningPathRecommendation(
      userId, 
      12
    );
    console.log('学习路径推荐结果:', learningPathResult.success ? '✅ 成功' : '❌ 失败');
    
    console.log('\n');
    
    // 测试5: 模拟Vue组件调用
    console.log('📋 测试5: 模拟Vue组件调用');
    console.log('='.repeat(50));
    
    // 模拟Vue组件调用getNoDuplicateQuestions
    const noDuplicateResult = await recommendationApi.getNoDuplicateQuestions(
      userId,
      'daily_recommend',
      '语法',
      10
    );
    console.log('去重题目获取结果:', noDuplicateResult.code === 200 ? '✅ 成功' : '❌ 失败');
    
    // 模拟Vue组件调用getUserActiveRatio
    const activeRatioResult = await recommendationApi.getUserActiveRatio(userId);
    console.log('用户活跃占比结果:', activeRatioResult.code === 200 ? '✅ 成功' : '❌ 失败');
    
    console.log('\n🎉 所有测试完成！');
    
    // 生成测试报告
    generateTestReport({
      practiceResult,
      normalPracticeResult,
      planResult,
      dailyChallengeResult,
      learningPathResult,
      noDuplicateResult,
      activeRatioResult
    });
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  }
}

// 生成测试报告
function generateTestReport(results) {
  console.log('\n📊 测试报告');
  console.log('='.repeat(50));
  
  const testCases = [
    { name: '突破冷却专项练习(白名单)', result: results.practiceResult },
    { name: '突破冷却专项练习(正常)', result: results.normalPracticeResult },
    { name: '7天学习路径', result: results.planResult },
    { name: '每日挑战推荐', result: results.dailyChallengeResult },
    { name: '学习路径推荐', result: results.learningPathResult },
    { name: '去重题目获取', result: results.noDuplicateResult },
    { name: '用户活跃占比', result: results.activeRatioResult }
  ];
  
  let successCount = 0;
  let totalCount = testCases.length;
  
  testCases.forEach(test => {
    const isSuccess = test.result.code === 200 || test.result.success === true;
    console.log(`${isSuccess ? '✅' : '❌'} ${test.name}: ${isSuccess ? '通过' : '失败'}`);
    if (isSuccess) successCount++;
  });
  
  console.log('\n📈 测试统计:');
  console.log(`总测试数: ${totalCount}`);
  console.log(`通过数: ${successCount}`);
  console.log(`失败数: ${totalCount - successCount}`);
  console.log(`通过率: ${(successCount / totalCount * 100).toFixed(1)}%`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 所有测试通过！新功能集成成功！');
  } else {
    console.log('\n⚠️ 部分测试失败，需要检查相关功能。');
  }
}

// 运行测试
if (require.main === module) {
  testNewFeatures();
}

module.exports = {
  testNewFeatures,
  generateTestReport
};
