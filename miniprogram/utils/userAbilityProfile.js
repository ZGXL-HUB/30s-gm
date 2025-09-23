// 用户能力画像管理工具
class UserAbilityProfile {
  constructor() {
    this.abilityData = {
      // 基础能力评估
      grammarLevel: '', // level1-level5
      writingLevel: '', // level1-level5
      overallLevel: '', // level1-level5
      
      // 详细能力分析
      grammarPoints: {}, // 各语法点掌握情况
      writingTables: {}, // 各书写表格掌握情况
      
      // 薄弱点分析
      weakGrammarPoints: [], // 薄弱语法点
      weakWritingAreas: [], // 薄弱书写领域
      
      // 学习进度
      learningProgress: {
        totalPracticeCount: 0,
        correctRate: 0,
        streakDays: 0,
        lastTestDate: null
      },
      
      // 个性化推荐配置
      recommendationConfig: {
        difficulty: 'medium', // easy, medium, hard
        focusAreas: [], // 重点练习领域
        dailyTarget: 10, // 每日目标题数
        practiceMode: 'balanced' // balanced, weak-focused, comprehensive
      },

      // 新增：语法功能大厅数据
      grammarHallData: {
        systemCombination: {
          highFreqErrors: [], // 高考配比高频错题大类
          lastUpdateTime: null,
          practiceCount: 0,
          accuracy: 0
        },
        grammarPoint: {
          repeatPoints: [], // 重复练习语法点
          lastUpdateTime: null,
          practiceCount: 0,
          accuracy: 0
        },
        customCombination: {
          customPreferences: [], // 用户自定义组合偏好
          lastUpdateTime: null,
          practiceCount: 0,
          accuracy: 0
        }
      },

      // 新增：错题特训数据
      errorQuestionData: {
        errorTypes: [], // 错题类型统计
        variantAccuracy: [], // 变式训练正确率历史
        errorReasons: {}, // 错误原因分析
        improvementTrend: 0 // 改进趋势（正数表示改善）
      },

      // 新增：日常练习实时分
      dailyPracticeScore: {
        grammarPointsAccuracy: {}, // 语法各点正确率
        writingModulesAccuracy: {}, // 书写模块正确率
        recentAccuracyHistory: [], // 近3次练习正确率历史
        lastUpdateTime: null,
        totalPracticeCount: 0
      }
    };
  }

  // 更新能力画像
  updateProfile() {
    this.loadTestResults();
    this.analyzeWeakPoints();
    this.generateRecommendationConfig();
    this.saveProfile();
  }

  // 加载测试结果
  loadTestResults() {
    // 加载水平测试结果
    const levelTestResults = wx.getStorageSync('levelTestResults');
    if (levelTestResults) {
      this.abilityData.grammarLevel = levelTestResults.grammarLevel;
      this.abilityData.writingLevel = levelTestResults.writingLevel;
      this.abilityData.overallLevel = levelTestResults.totalLevel;
    }

    // 加载语法重测结果
    const grammarTestResults = wx.getStorageSync('grammarTestResults');
    if (grammarTestResults && grammarTestResults.timestamp) {
      this.abilityData.grammarLevel = grammarTestResults.level;
    }

    // 加载书写测试结果
    const simpleWritingResults = wx.getStorageSync('simpleWritingTestResults');
    const comprehensiveWritingResults = wx.getStorageSync('comprehensiveWritingTestResults');
    
    if (comprehensiveWritingResults && comprehensiveWritingResults.timestamp) {
      this.abilityData.writingLevel = comprehensiveWritingResults.level;
    } else if (simpleWritingResults && simpleWritingResults.timestamp) {
      this.abilityData.writingLevel = simpleWritingResults.level;
    }
  }

  // 分析薄弱点
  analyzeWeakPoints() {
    // 分析错题数据
    const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
    const weakPoints = this.analyzeWrongQuestions(wrongQuestions);
    this.abilityData.weakGrammarPoints = weakPoints.grammar;
    this.abilityData.weakWritingAreas = weakPoints.writing;

    // 分析练习历史
    this.analyzePracticeHistory();
  }

  // 分析错题薄弱点
  analyzeWrongQuestions(wrongQuestions) {
    const grammarPointCount = {};
    const writingAreaCount = {};

    wrongQuestions.forEach(question => {
      if (question.type === 'grammar') {
        const point = question.grammarPoint || question.category || '其他';
        grammarPointCount[point] = (grammarPointCount[point] || 0) + 1;
      } else if (question.type === 'writing') {
        const area = question.table || question.category || '其他';
        writingAreaCount[area] = (writingAreaCount[area] || 0) + 1;
      }
    });

    // 按错误次数排序，取前3个薄弱点
    const weakGrammar = Object.keys(grammarPointCount)
      .sort((a, b) => grammarPointCount[b] - grammarPointCount[a])
      .slice(0, 3);

    const weakWriting = Object.keys(writingAreaCount)
      .sort((a, b) => writingAreaCount[b] - writingAreaCount[a])
      .slice(0, 3);

    return {
      grammar: weakGrammar,
      writing: weakWriting
    };
  }

  // 分析练习历史
  analyzePracticeHistory() {
    const todayPractices = wx.getStorageSync('todayPractices') || [];
    const todayWriting = wx.getStorageSync('todayWriting') || [];
    
    const totalCount = todayPractices.length + todayWriting.length;
    const correctCount = todayPractices.reduce((sum, p) => sum + (p.correct || 0), 0) +
                       todayWriting.reduce((sum, w) => sum + (w.correctCount || 0), 0);
    
    this.abilityData.learningProgress.totalPracticeCount = totalCount;
    this.abilityData.learningProgress.correctRate = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
    this.abilityData.learningProgress.streakDays = wx.getStorageSync('streakDays') || 0;
  }

  // 生成推荐配置
  generateRecommendationConfig() {
    const { grammarLevel, writingLevel, overallLevel, weakGrammarPoints, learningProgress } = this.abilityData;
    
    // 根据整体水平确定难度
    let difficulty = 'medium';
    if (overallLevel === 'level1' || overallLevel === 'level2') {
      difficulty = 'easy';
    } else if (overallLevel === 'level4' || overallLevel === 'level5') {
      difficulty = 'hard';
    }

    // 根据薄弱点确定重点领域
    const focusAreas = [...weakGrammarPoints];
    
    // 根据语法和书写水平差异调整重点
    if (this.getLevelValue(grammarLevel) < this.getLevelValue(writingLevel)) {
      focusAreas.unshift('语法综合');
    } else if (this.getLevelValue(writingLevel) < this.getLevelValue(grammarLevel)) {
      focusAreas.unshift('书写规范');
    }

    // 根据学习进度调整练习模式
    let practiceMode = 'balanced';
    if (learningProgress.correctRate < 60) {
      practiceMode = 'weak-focused';
    } else if (learningProgress.correctRate > 85) {
      practiceMode = 'comprehensive';
    }

    // 根据连续学习天数调整每日目标
    let dailyTarget = 10;
    if (learningProgress.streakDays > 7) {
      dailyTarget = 15;
    } else if (learningProgress.streakDays < 3) {
      dailyTarget = 8;
    }

    this.abilityData.recommendationConfig = {
      difficulty,
      focusAreas: focusAreas.slice(0, 3), // 最多3个重点领域
      dailyTarget,
      practiceMode
    };
  }

  // 获取等级数值
  getLevelValue(level) {
    const levelMap = {
      'level1': 1,
      'level2': 2,
      'level3': 3,
      'level4': 4,
      'level5': 5
    };
    return levelMap[level] || 0;
  }

  // 生成个性化练习推荐
  generatePersonalizedRecommendations() {
    const { recommendationConfig, weakGrammarPoints, weakWritingAreas } = this.abilityData;
    
    const recommendations = {
      // 每日任务推荐
      dailyTasks: this.generateDailyTaskRecommendations(),
      
      // 专项练习推荐
      focusedPractice: this.generateFocusedPracticeRecommendations(),
      
      // 综合练习推荐
      comprehensivePractice: this.generateComprehensivePracticeRecommendations(),
      
      // 学习路径推荐
      learningPath: this.generateLearningPathRecommendations()
    };

    return recommendations;
  }

  // 生成每日任务推荐
  generateDailyTaskRecommendations() {
    const { difficulty, focusAreas, dailyTarget, practiceMode } = this.abilityData.recommendationConfig;
    
    const tasks = [];
    
    // 根据练习模式生成任务
    if (practiceMode === 'weak-focused') {
      // 薄弱点专项练习
      tasks.push({
        type: 'weak_point_grammar',
        title: '薄弱语法点练习',
        description: `重点练习：${focusAreas.slice(0, 2).join('、')}`,
        difficulty: difficulty,
        questionCount: Math.min(dailyTarget, 8),
        xpReward: 60,
        priority: 'high'
      });
    } else if (practiceMode === 'comprehensive') {
      // 综合能力练习
      tasks.push({
        type: 'comprehensive_grammar',
        title: '综合语法练习',
        description: '全面提升语法能力',
        difficulty: difficulty,
        questionCount: dailyTarget,
        xpReward: 80,
        priority: 'high'
      });
    } else {
      // 平衡练习
      tasks.push({
        type: 'balanced_grammar',
        title: '语法选择题',
        description: '基础语法知识点练习',
        difficulty: difficulty,
        questionCount: Math.floor(dailyTarget * 0.6),
        xpReward: 50,
        priority: 'medium'
      });
      
      tasks.push({
        type: 'writing_practice',
        title: '书写规范练习',
        description: '巩固单词书写规范',
        difficulty: difficulty,
        questionCount: Math.floor(dailyTarget * 0.4),
        xpReward: 40,
        priority: 'medium'
      });
    }

    return tasks;
  }

  // 生成专项练习推荐
  generateFocusedPracticeRecommendations() {
    const { weakGrammarPoints, weakWritingAreas } = this.abilityData;
    
    const recommendations = [];
    
    // 语法薄弱点专项练习
    weakGrammarPoints.forEach((point, index) => {
      recommendations.push({
        type: 'grammar_focused',
        title: `${point}专项练习`,
        description: `针对${point}的强化练习`,
        difficulty: 'medium',
        questionCount: 15,
        xpReward: 70,
        priority: 'high',
        targetPoint: point
      });
    });

    // 书写薄弱点专项练习
    weakWritingAreas.forEach((area, index) => {
      recommendations.push({
        type: 'writing_focused',
        title: `${area}书写练习`,
        description: `针对${area}的书写规范练习`,
        difficulty: 'medium',
        questionCount: 12,
        xpReward: 60,
        priority: 'medium',
        targetArea: area
      });
    });

    return recommendations;
  }

  // 生成综合练习推荐
  generateComprehensivePracticeRecommendations() {
    const { overallLevel, recommendationConfig } = this.abilityData;
    
    const recommendations = [];
    
    // 根据整体水平推荐综合练习
    if (this.getLevelValue(overallLevel) >= 4) {
      recommendations.push({
        type: 'advanced_comprehensive',
        title: '高级综合练习',
        description: '高难度综合语法和书写练习',
        difficulty: 'hard',
        questionCount: 20,
        xpReward: 100,
        priority: 'high'
      });
    } else if (this.getLevelValue(overallLevel) >= 2) {
      recommendations.push({
        type: 'intermediate_comprehensive',
        title: '中级综合练习',
        description: '中等难度综合练习',
        difficulty: 'medium',
        questionCount: 15,
        xpReward: 80,
        priority: 'medium'
      });
    } else {
      recommendations.push({
        type: 'basic_comprehensive',
        title: '基础综合练习',
        description: '基础语法和书写综合练习',
        difficulty: 'easy',
        questionCount: 10,
        xpReward: 60,
        priority: 'high'
      });
    }

    return recommendations;
  }

  // 生成学习路径推荐
  generateLearningPathRecommendations() {
    const { grammarLevel, writingLevel, overallLevel } = this.abilityData;
    
    const grammarValue = this.getLevelValue(grammarLevel);
    const writingValue = this.getLevelValue(writingLevel);
    
    let path = [];
    
    // 根据语法和书写水平差异制定学习路径
    if (grammarValue < writingValue - 1) {
      // 语法明显弱于书写
      path = [
        { step: 1, action: '语法基础强化', target: '提升语法基础能力' },
        { step: 2, action: '语法专项练习', target: '针对薄弱语法点练习' },
        { step: 3, action: '综合能力提升', target: '语法书写综合练习' }
      ];
    } else if (writingValue < grammarValue - 1) {
      // 书写明显弱于语法
      path = [
        { step: 1, action: '书写规范强化', target: '提升书写规范能力' },
        { step: 2, action: '书写专项练习', target: '针对薄弱书写领域练习' },
        { step: 3, action: '综合能力提升', target: '语法书写综合练习' }
      ];
    } else {
      // 语法和书写水平相对平衡
      path = [
        { step: 1, action: '综合基础练习', target: '全面提升基础能力' },
        { step: 2, action: '薄弱点专项突破', target: '重点攻克薄弱环节' },
        { step: 3, action: '高级综合训练', target: '达到高级水平' }
      ];
    }

    return path;
  }

  // 保存能力画像
  saveProfile() {
    wx.setStorageSync('userAbilityProfile', this.abilityData);
  }

  // 加载能力画像
  loadProfile() {
    const profile = wx.getStorageSync('userAbilityProfile');
    if (profile) {
      this.abilityData = { ...this.abilityData, ...profile };
    }
  }

  // 获取当前能力画像
  getProfile() {
    return this.abilityData;
  }

  // 新增：同步语法功能大厅数据
  syncGrammarHallData(practiceModule, practiceData) {
    if (!this.abilityData.grammarHallData[practiceModule]) {
      console.error(`未知的练习模块: ${practiceModule}`);
      return;
    }

    const moduleData = this.abilityData.grammarHallData[practiceModule];
    
    // 更新练习次数和正确率
    moduleData.practiceCount += 1;
    moduleData.accuracy = practiceData.accuracy || 0;
    moduleData.lastUpdateTime = new Date().toISOString();

    // 根据模块类型更新特定数据
    switch (practiceModule) {
      case 'systemCombination':
        // 更新高频错题大类
        if (practiceData.highFreqErrors) {
          moduleData.highFreqErrors = this.mergeHighFreqErrors(
            moduleData.highFreqErrors, 
            practiceData.highFreqErrors
          );
        }
        break;
        
      case 'grammarPoint':
        // 更新重复练习语法点
        if (practiceData.repeatPoints) {
          moduleData.repeatPoints = this.mergeRepeatPoints(
            moduleData.repeatPoints, 
            practiceData.repeatPoints
          );
        }
        break;
        
      case 'customCombination':
        // 更新用户自定义组合偏好
        if (practiceData.customPreferences) {
          moduleData.customPreferences = this.mergeCustomPreferences(
            moduleData.customPreferences, 
            practiceData.customPreferences
          );
        }
        break;
    }

    this.saveProfile();
    console.log(`语法功能大厅数据已同步: ${practiceModule}`, moduleData);
  }

  // 新增：同步错题特训数据
  syncErrorQuestionData(errorQuestion) {
    const { errorType, variantAccuracy, errorReason } = errorQuestion;
    
    // 更新错题类型统计
    const existingErrorType = this.abilityData.errorQuestionData.errorTypes.find(
      et => et.type === errorType
    );
    
    if (existingErrorType) {
      existingErrorType.count += 1;
      existingErrorType.lastOccurrence = new Date().toISOString();
    } else {
      this.abilityData.errorQuestionData.errorTypes.push({
        type: errorType,
        count: 1,
        firstOccurrence: new Date().toISOString(),
        lastOccurrence: new Date().toISOString()
      });
    }

    // 更新变式训练正确率历史
    this.abilityData.errorQuestionData.variantAccuracy.push({
      errorType: errorType,
      accuracy: variantAccuracy,
      timestamp: new Date().toISOString()
    });

    // 保持最近50条记录
    if (this.abilityData.errorQuestionData.variantAccuracy.length > 50) {
      this.abilityData.errorQuestionData.variantAccuracy = 
        this.abilityData.errorQuestionData.variantAccuracy.slice(-50);
    }

    // 更新错误原因分析
    if (errorReason) {
      if (!this.abilityData.errorQuestionData.errorReasons[errorReason]) {
        this.abilityData.errorQuestionData.errorReasons[errorReason] = 0;
      }
      this.abilityData.errorQuestionData.errorReasons[errorReason] += 1;
    }

    // 计算改进趋势
    this.calculateImprovementTrend();

    this.saveProfile();
    console.log('错题特训数据已同步:', errorQuestion);
  }

  // 新增：更新日常练习实时分
  updateDailyPracticeScore(practiceType, accuracy, grammarPoint = null, writingModule = null) {
    const scoreData = this.abilityData.dailyPracticeScore;
    
    // 更新总练习次数
    scoreData.totalPracticeCount += 1;
    scoreData.lastUpdateTime = new Date().toISOString();

    // 根据练习类型更新相应数据
    if (practiceType === 'grammar' && grammarPoint) {
      // 更新语法点正确率
      if (!scoreData.grammarPointsAccuracy[grammarPoint]) {
        scoreData.grammarPointsAccuracy[grammarPoint] = {
          totalCount: 0,
          correctCount: 0,
          accuracy: 0,
          lastUpdateTime: null
        };
      }
      
      const pointData = scoreData.grammarPointsAccuracy[grammarPoint];
      pointData.totalCount += 1;
      if (accuracy >= 80) { // 假设80%以上为正确
        pointData.correctCount += 1;
      }
      pointData.accuracy = (pointData.correctCount / pointData.totalCount) * 100;
      pointData.lastUpdateTime = new Date().toISOString();
      
    } else if (practiceType === 'writing' && writingModule) {
      // 更新书写模块正确率
      if (!scoreData.writingModulesAccuracy[writingModule]) {
        scoreData.writingModulesAccuracy[writingModule] = {
          totalCount: 0,
          correctCount: 0,
          accuracy: 0,
          lastUpdateTime: null
        };
      }
      
      const moduleData = scoreData.writingModulesAccuracy[writingModule];
      moduleData.totalCount += 1;
      if (accuracy >= 80) { // 假设80%以上为正确
        moduleData.correctCount += 1;
      }
      moduleData.accuracy = (moduleData.correctCount / moduleData.totalCount) * 100;
      moduleData.lastUpdateTime = new Date().toISOString();
    }

    // 更新近3次练习正确率历史
    scoreData.recentAccuracyHistory.push({
      practiceType: practiceType,
      accuracy: accuracy,
      timestamp: new Date().toISOString()
    });

    // 保持最近3次记录
    if (scoreData.recentAccuracyHistory.length > 3) {
      scoreData.recentAccuracyHistory = scoreData.recentAccuracyHistory.slice(-3);
    }

    this.saveProfile();
    console.log('日常练习实时分已更新:', { practiceType, accuracy, grammarPoint, writingModule });
  }

  // 新增：动态更新能力等级
  updateAbilityLevelDynamic(practiceType) {
    const recentAccuracy = this.abilityData.dailyPracticeScore.recentAccuracyHistory
      .filter(record => record.practiceType === practiceType)
      .slice(-3)
      .map(record => record.accuracy);

    if (recentAccuracy.length < 3) {
      console.log('练习次数不足，无法进行等级评估');
      return;
    }

    const currentLevel = practiceType === 'grammar' 
      ? this.getLevelValue(this.abilityData.grammarLevel)
      : this.getLevelValue(this.abilityData.writingLevel);

    if (currentLevel >= 5) {
      console.log('已达到最高等级');
      return;
    }

    // 等级升级规则
    const levelUpStandard = {
      1: 40, 2: 60, 3: 80, 4: 90
    };

    const requiredAccuracy = levelUpStandard[currentLevel];
    const allMeetStandard = recentAccuracy.every(acc => acc >= requiredAccuracy);

    if (allMeetStandard) {
      const newLevel = currentLevel + 1;
      const newLevelKey = `level${newLevel}`;
      
      if (practiceType === 'grammar') {
        this.abilityData.grammarLevel = newLevelKey;
        console.log(`语法等级提升: level${currentLevel} -> ${newLevelKey}`);
      } else {
        this.abilityData.writingLevel = newLevelKey;
        console.log(`书写等级提升: level${currentLevel} -> ${newLevelKey}`);
      }

      // 更新整体等级
      this.updateOverallLevel();
      this.saveProfile();
    }
  }

  // 辅助方法：合并高频错题
  mergeHighFreqErrors(existing, newErrors) {
    const merged = [...existing];
    newErrors.forEach(error => {
      const existingIndex = merged.findIndex(e => e.category === error.category);
      if (existingIndex >= 0) {
        merged[existingIndex].count += error.count || 1;
        merged[existingIndex].lastUpdate = new Date().toISOString();
      } else {
        merged.push({
          category: error.category,
          count: error.count || 1,
          lastUpdate: new Date().toISOString()
        });
      }
    });
    return merged.sort((a, b) => b.count - a.count);
  }

  // 辅助方法：合并重复练习语法点
  mergeRepeatPoints(existing, newPoints) {
    const merged = [...existing];
    newPoints.forEach(point => {
      const existingIndex = merged.findIndex(p => p.point === point.point);
      if (existingIndex >= 0) {
        merged[existingIndex].practiceCount += point.practiceCount || 1;
        merged[existingIndex].lastPractice = new Date().toISOString();
      } else {
        merged.push({
          point: point.point,
          practiceCount: point.practiceCount || 1,
          lastPractice: new Date().toISOString()
        });
      }
    });
    return merged.sort((a, b) => b.practiceCount - a.practiceCount);
  }

  // 辅助方法：合并自定义组合偏好
  mergeCustomPreferences(existing, newPreferences) {
    const merged = [...existing];
    newPreferences.forEach(pref => {
      const existingIndex = merged.findIndex(p => p.combination === pref.combination);
      if (existingIndex >= 0) {
        merged[existingIndex].usageCount += pref.usageCount || 1;
        merged[existingIndex].lastUsed = new Date().toISOString();
      } else {
        merged.push({
          combination: pref.combination,
          usageCount: pref.usageCount || 1,
          lastUsed: new Date().toISOString()
        });
      }
    });
    return merged.sort((a, b) => b.usageCount - a.usageCount);
  }

  // 辅助方法：计算改进趋势
  calculateImprovementTrend() {
    const accuracyHistory = this.abilityData.errorQuestionData.variantAccuracy;
    if (accuracyHistory.length < 10) return;

    const recent = accuracyHistory.slice(-10);
    const older = accuracyHistory.slice(-20, -10);
    
    if (older.length === 0) return;

    const recentAvg = recent.reduce((sum, r) => sum + r.accuracy, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.accuracy, 0) / older.length;
    
    this.abilityData.errorQuestionData.improvementTrend = recentAvg - olderAvg;
  }

  // 辅助方法：更新整体等级
  updateOverallLevel() {
    const grammarValue = this.getLevelValue(this.abilityData.grammarLevel);
    const writingValue = this.getLevelValue(this.abilityData.writingLevel);
    const overallValue = Math.round((grammarValue + writingValue) / 2);
    
    this.abilityData.overallLevel = `level${overallValue}`;
  }

  // 新增：获取语法功能大厅数据
  getGrammarHallData() {
    return this.abilityData.grammarHallData;
  }

  // 新增：获取错题特训数据
  getErrorQuestionData() {
    return this.abilityData.errorQuestionData;
  }

  // 新增：获取日常练习实时分
  getDailyPracticeScore() {
    return this.abilityData.dailyPracticeScore;
  }
}

module.exports = UserAbilityProfile;
