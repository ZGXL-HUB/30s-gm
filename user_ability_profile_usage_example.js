// 用户能力模型扩展功能使用示例
// 演示如何使用新的语法功能大厅数据同步、错题特训数据同步和动态等级更新功能

const UserAbilityProfile = require('./miniprogram/utils/userAbilityProfile');

// 示例1：初始化用户能力画像
function initializeUserProfile() {
  console.log('=== 初始化用户能力画像 ===');
  
  const abilityProfile = new UserAbilityProfile();
  
  // 设置初始能力等级
  abilityProfile.abilityData.grammarLevel = 'level2';
  abilityProfile.abilityData.writingLevel = 'level3';
  abilityProfile.abilityData.overallLevel = 'level2';
  
  // 保存初始配置
  abilityProfile.saveProfile();
  
  console.log('初始能力画像:', abilityProfile.getProfile());
  return abilityProfile;
}

// 示例2：同步语法功能大厅数据 - 系统组合练习
function syncSystemCombinationData(abilityProfile) {
  console.log('\n=== 同步系统组合练习数据 ===');
  
  const systemCombinationData = {
    accuracy: 85.5,
    highFreqErrors: [
      { category: '定语从句', count: 3 },
      { category: '非谓语动词', count: 2 },
      { category: '介词', count: 1 }
    ]
  };
  
  abilityProfile.syncGrammarHallData('systemCombination', systemCombinationData);
  
  console.log('系统组合数据已同步');
  console.log('语法功能大厅数据:', abilityProfile.getGrammarHallData());
}

// 示例3：同步语法功能大厅数据 - 语法分点练习
function syncGrammarPointData(abilityProfile) {
  console.log('\n=== 同步语法分点练习数据 ===');
  
  const grammarPointData = {
    accuracy: 78.0,
    repeatPoints: [
      { point: '非谓语动词', practiceCount: 5 },
      { point: '定语从句', practiceCount: 3 }
    ]
  };
  
  abilityProfile.syncGrammarHallData('grammarPoint', grammarPointData);
  
  console.log('语法分点数据已同步');
  console.log('语法功能大厅数据:', abilityProfile.getGrammarHallData());
}

// 示例4：同步语法功能大厅数据 - 专属组合练习
function syncCustomCombinationData(abilityProfile) {
  console.log('\n=== 同步专属组合练习数据 ===');
  
  const customCombinationData = {
    accuracy: 92.0,
    customPreferences: [
      { combination: '介词+连词', usageCount: 3 },
      { combination: '非谓语+定语从句', usageCount: 2 }
    ]
  };
  
  abilityProfile.syncGrammarHallData('customCombination', customCombinationData);
  
  console.log('专属组合数据已同步');
  console.log('语法功能大厅数据:', abilityProfile.getGrammarHallData());
}

// 示例5：同步错题特训数据
function syncErrorQuestionData(abilityProfile) {
  console.log('\n=== 同步错题特训数据 ===');
  
  const errorQuestions = [
    {
      errorType: '非谓语动词时态错误',
      variantAccuracy: 75.0,
      errorReason: '时态判断错误'
    },
    {
      errorType: '定语从句关系词错误',
      variantAccuracy: 80.0,
      errorReason: '关系词选择错误'
    },
    {
      errorType: '介词固定搭配错误',
      variantAccuracy: 85.0,
      errorReason: '固定搭配记忆错误'
    }
  ];
  
  errorQuestions.forEach(errorQ => {
    abilityProfile.syncErrorQuestionData(errorQ);
  });
  
  console.log('错题特训数据已同步');
  console.log('错题特训数据:', abilityProfile.getErrorQuestionData());
}

// 示例6：更新日常练习实时分
function updateDailyPracticeScore(abilityProfile) {
  console.log('\n=== 更新日常练习实时分 ===');
  
  // 模拟多次语法练习
  const grammarPractices = [
    { practiceType: 'grammar', accuracy: 85.0, grammarPoint: '定语从句' },
    { practiceType: 'grammar', accuracy: 78.0, grammarPoint: '非谓语动词' },
    { practiceType: 'grammar', accuracy: 92.0, grammarPoint: '介词' },
    { practiceType: 'grammar', accuracy: 88.0, grammarPoint: '定语从句' },
    { practiceType: 'grammar', accuracy: 75.0, grammarPoint: '非谓语动词' }
  ];
  
  grammarPractices.forEach(practice => {
    abilityProfile.updateDailyPracticeScore(
      practice.practiceType, 
      practice.accuracy, 
      practice.grammarPoint, 
      null
    );
  });
  
  // 模拟书写练习
  const writingPractices = [
    { practiceType: 'writing', accuracy: 90.0, writingModule: '动词时态' },
    { practiceType: 'writing', accuracy: 85.0, writingModule: '名词单复数' },
    { practiceType: 'writing', accuracy: 88.0, writingModule: '动词时态' }
  ];
  
  writingPractices.forEach(practice => {
    abilityProfile.updateDailyPracticeScore(
      practice.practiceType, 
      practice.accuracy, 
      null, 
      practice.writingModule
    );
  });
  
  console.log('日常练习实时分已更新');
  console.log('日常练习数据:', abilityProfile.getDailyPracticeScore());
}

// 示例7：动态更新能力等级
function updateAbilityLevelDynamic(abilityProfile) {
  console.log('\n=== 动态更新能力等级 ===');
  
  console.log('更新前等级:', {
    grammarLevel: abilityProfile.abilityData.grammarLevel,
    writingLevel: abilityProfile.abilityData.writingLevel,
    overallLevel: abilityProfile.abilityData.overallLevel
  });
  
  // 尝试更新语法等级
  abilityProfile.updateAbilityLevelDynamic('grammar');
  
  // 尝试更新书写等级
  abilityProfile.updateAbilityLevelDynamic('writing');
  
  console.log('更新后等级:', {
    grammarLevel: abilityProfile.abilityData.grammarLevel,
    writingLevel: abilityProfile.abilityData.writingLevel,
    overallLevel: abilityProfile.abilityData.overallLevel
  });
}

// 示例8：获取完整的能力画像分析
function getCompleteAnalysis(abilityProfile) {
  console.log('\n=== 完整能力画像分析 ===');
  
  const profile = abilityProfile.getProfile();
  const grammarHallData = abilityProfile.getGrammarHallData();
  const errorQuestionData = abilityProfile.getErrorQuestionData();
  const dailyPracticeScore = abilityProfile.getDailyPracticeScore();
  
  console.log('基础能力评估:', {
    grammarLevel: profile.grammarLevel,
    writingLevel: profile.writingLevel,
    overallLevel: profile.overallLevel
  });
  
  console.log('语法功能大厅统计:', {
    systemCombination: {
      practiceCount: grammarHallData.systemCombination.practiceCount,
      accuracy: grammarHallData.systemCombination.accuracy,
      highFreqErrors: grammarHallData.systemCombination.highFreqErrors.length
    },
    grammarPoint: {
      practiceCount: grammarHallData.grammarPoint.practiceCount,
      accuracy: grammarHallData.grammarPoint.accuracy,
      repeatPoints: grammarHallData.grammarPoint.repeatPoints.length
    },
    customCombination: {
      practiceCount: grammarHallData.customCombination.practiceCount,
      accuracy: grammarHallData.customCombination.accuracy,
      customPreferences: grammarHallData.customCombination.customPreferences.length
    }
  });
  
  console.log('错题特训分析:', {
    errorTypeCount: errorQuestionData.errorTypes.length,
    improvementTrend: errorQuestionData.improvementTrend,
    variantAccuracyHistory: errorQuestionData.variantAccuracy.length
  });
  
  console.log('日常练习统计:', {
    totalPracticeCount: dailyPracticeScore.totalPracticeCount,
    grammarPointsCount: Object.keys(dailyPracticeScore.grammarPointsAccuracy).length,
    writingModulesCount: Object.keys(dailyPracticeScore.writingModulesAccuracy).length,
    recentAccuracyHistory: dailyPracticeScore.recentAccuracyHistory.length
  });
}

// 主函数：运行所有示例
function runAllExamples() {
  console.log('🚀 开始运行用户能力模型扩展功能示例\n');
  
  // 初始化
  const abilityProfile = initializeUserProfile();
  
  // 同步各种练习数据
  syncSystemCombinationData(abilityProfile);
  syncGrammarPointData(abilityProfile);
  syncCustomCombinationData(abilityProfile);
  syncErrorQuestionData(abilityProfile);
  
  // 更新练习分数和等级
  updateDailyPracticeScore(abilityProfile);
  updateAbilityLevelDynamic(abilityProfile);
  
  // 获取完整分析
  getCompleteAnalysis(abilityProfile);
  
  console.log('\n✅ 所有示例运行完成！');
}

// 如果直接运行此文件，执行示例
if (require.main === module) {
  runAllExamples();
}

module.exports = {
  initializeUserProfile,
  syncSystemCombinationData,
  syncGrammarPointData,
  syncCustomCombinationData,
  syncErrorQuestionData,
  updateDailyPracticeScore,
  updateAbilityLevelDynamic,
  getCompleteAnalysis,
  runAllExamples
};
