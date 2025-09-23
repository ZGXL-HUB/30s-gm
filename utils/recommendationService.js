// 智能推荐服务接口
// 为小程序提供统一的推荐服务接口

const SmartQuestionRecommendation = require('./smartQuestionRecommendation');
const RedisCache = require('./redisCache');

class RecommendationService {
  constructor() {
    this.smartRecommendation = new SmartQuestionRecommendation();
    this.redisCache = new RedisCache();
  }

  // 每日挑战接口（原每日推荐，支持语法/书写分类）
  async getDailyChallenge(userId, questionCount = 10, tabType = '语法') {
    try {
      console.log(`为用户${userId}生成每日挑战，数量：${questionCount}，类型：${tabType}`);
      
      const questions = await this.generateDailyChallengeQuestions(userId, tabType, questionCount);
      
      return {
        success: true,
        data: {
          questions: questions,
          count: questions.length,
          type: 'daily_challenge',
          tabType: tabType,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('生成每日挑战失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 兼容性接口：保留原方法名
  async getDailyRecommendation(userId, questionCount = 10, tabType = '语法') {
    return await this.getDailyChallenge(userId, questionCount, tabType);
  }

  // 去重题目接口（兼容Vue组件调用）
  async getNoDuplicateQuestions(userId, practiceEntry, tabType, questionCount) {
    try {
      console.log(`获取去重题目：用户${userId}，入口${practiceEntry}，类型${tabType}，数量${questionCount}`);
      
      const questions = await this.smartRecommendation.generateSmartRecommendation(
        userId, 
        practiceEntry, 
        questionCount,
        tabType
      );
      
      return {
        success: true,
        data: {
          questions: questions,
          count: questions.length,
          type: practiceEntry,
          tabType: tabType,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('获取去重题目失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 获取用户近7天活跃占比
  async getUserActiveRatio(userId) {
    try {
      console.log(`获取用户${userId}近7天活跃占比`);
      
      const UserAbilityProfile = require('../miniprogram/utils/userAbilityProfile');
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();
      
      // 模拟获取近7天活跃数据（实际项目中应该从数据库获取）
      const recentActivity = await this.getRecent7DayActivity(userId);
      
      const grammarRatio = recentActivity.grammarRatio || 50;
      const writingRatio = recentActivity.writingRatio || 50;
      
      return {
        success: true,
        data: {
          grammarRatio: grammarRatio,
          writingRatio: writingRatio,
          totalDays: recentActivity.totalDays || 7,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('获取活跃占比失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 学习路径推荐接口（原进阶之旅）
  async getLearningPathRecommendation(userId, questionCount = 12) {
    try {
      console.log(`为用户${userId}生成学习路径推荐，数量：${questionCount}`);
      
      const result = await this.generateLearningPathQuestions(userId, questionCount);
      
      return {
        success: true,
        data: {
          dailyQuestions: result.dailyQuestions,
          sevenDayPlan: result.sevenDayPlan,
          target: result.target,
          count: result.dailyQuestions.length,
          type: 'learning_path',
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('生成学习路径推荐失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 兼容性接口：保留原方法名
  async getAdvancedJourneyRecommendation(userId, questionCount = 15) {
    return await this.getLearningPathRecommendation(userId, questionCount);
  }

  // 个性化推荐接口（基于用户能力画像）
  async getPersonalizedRecommendation(userId, questionCount = 12) {
    try {
      console.log(`为用户${userId}生成个性化推荐，数量：${questionCount}`);
      
      // 根据用户能力画像选择推荐类型
      const UserAbilityProfile = require('../miniprogram/utils/userAbilityProfile');
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();
      
      let recommendationType = 'daily_recommend';
      const overallLevel = abilityProfile.getLevelValue(abilityProfile.abilityData.overallLevel);
      
      // 根据整体水平选择推荐类型
      if (overallLevel >= 4) {
        recommendationType = 'advanced_journey';
      } else if (overallLevel >= 3) {
        recommendationType = 'daily_recommend';
        questionCount = Math.min(questionCount, 10); // 中等级别限制题目数量
      } else {
        questionCount = Math.min(questionCount, 8); // 初级级别减少题目数量
      }
      
      const questions = await this.smartRecommendation.generateSmartRecommendation(
        userId, 
        recommendationType, 
        questionCount
      );
      
      return {
        success: true,
        data: {
          questions: questions,
          count: questions.length,
          type: recommendationType,
          userLevel: abilityProfile.abilityData.overallLevel,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('生成个性化推荐失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 获取用户近7天活跃数据
  async getRecent7DayActivity(userId) {
    try {
      // 模拟获取近7天活跃数据
      // 实际项目中应该从数据库查询用户的练习记录
      const mockActivity = {
        totalDays: 7,
        grammarRatio: Math.floor(Math.random() * 40) + 30, // 30-70%
        writingRatio: Math.floor(Math.random() * 40) + 30, // 30-70%
        dailyActivity: []
      };
      
      // 生成7天的模拟数据
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        mockActivity.dailyActivity.push({
          date: date.toISOString().split('T')[0],
          grammarCount: Math.floor(Math.random() * 10),
          writingCount: Math.floor(Math.random() * 8)
        });
      }
      
      return mockActivity;
      
    } catch (error) {
      console.error('获取近7天活跃数据失败:', error);
      return {
        totalDays: 7,
        grammarRatio: 50,
        writingRatio: 50,
        dailyActivity: []
      };
    }
  }

  // 获取用户今日练习统计
  async getTodayStats(userId) {
    try {
      const stats = await this.smartRecommendation.getRecommendationStats(userId);
      
      return {
        success: true,
        data: {
          userId: userId,
          todayDoneCount: stats.todayDoneCount,
          recommendationStats: stats,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('获取今日统计失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 清除用户今日练习记录（重置功能）
  async clearTodayProgress(userId) {
    try {
      const doneQids = await this.redisCache.getTodayDoneQids(userId);
      console.log(`清除用户${userId}今日练习记录，共${doneQids.length}道题`);
      
      // 这里应该清除Redis中的记录，但由于是模拟实现，只记录日志
      console.log(`已清除用户${userId}的今日练习记录`);
      
      return {
        success: true,
        data: {
          clearedCount: doneQids.length,
          message: '今日练习记录已清除'
        }
      };
      
    } catch (error) {
      console.error('清除今日进度失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 获取语法点冷却状态
  async getGrammarPointCoolingStatus(userId) {
    try {
      await this.redisCache.initGrammarPointTime(userId);
      
      const grammarPoints = [
        "preposition", "pronoun", "conjunction", "article", 
        "noun", "verb", "predicate", "non_predicate", 
        "adjective", "adverb", "attributive_clause", "adverbial_clause"
      ];
      
      const coolingStatus = {};
      const currentTime = this.redisCache.getCurrentTimestamp();
      
      for (const point of grammarPoints) {
        const lastShowTime = await this.redisCache.getGrammarPointLastShow(userId, point);
        const timeDiff = currentTime - parseInt(lastShowTime);
        const isInCooling = timeDiff < this.smartRecommendation.coolingPeriod;
        
        coolingStatus[point] = {
          lastShowTime: new Date(parseInt(lastShowTime) * 1000).toISOString(),
          timeDiff: timeDiff,
          isInCooling: isInCooling,
          canRecommend: !isInCooling
        };
      }
      
      return {
        success: true,
        data: {
          userId: userId,
          coolingPeriod: this.smartRecommendation.coolingPeriod,
          grammarPointStatus: coolingStatus,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('获取语法点冷却状态失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 手动更新语法点出现时间（用于测试）
  async updateGrammarPointTime(userId, grammarPoint, hoursAgo = 0) {
    try {
      const currentTime = this.redisCache.getCurrentTimestamp();
      const targetTime = currentTime - (hoursAgo * 3600);
      
      await this.redisCache.updateGrammarPointLastShow(userId, grammarPoint, targetTime);
      
      return {
        success: true,
        data: {
          grammarPoint: grammarPoint,
          updatedTime: new Date(targetTime * 1000).toISOString(),
          hoursAgo: hoursAgo
        }
      };
      
    } catch (error) {
      console.error('更新语法点时间失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 生成每日挑战题目（70%旧知识+30%新知识）
  async generateDailyChallengeQuestions(userId, tabType, questionCount) {
    try {
      console.log(`生成每日挑战题目：用户${userId}，类型${tabType}，数量${questionCount}`);
      
      // 步骤1：按项目现有逻辑定题量
      const finalQuestionCount = questionCount;
      
      // 步骤2：去重+扰动（调用P0-02接口）
      const candidateQuestions = await this.smartRecommendation.getNoDuplicateQuestions(
        userId, 
        "daily_challenge", 
        finalQuestionCount * 2, // 多生成一些用于后续筛选
        tabType
      );
      
      // 步骤3：70%旧知识（错题+低正确率点）+30%新知识（下一等级）
      const oldKnowledgeCount = Math.floor(finalQuestionCount * 0.7);
      const newKnowledgeCount = finalQuestionCount - oldKnowledgeCount;
      
      console.log(`知识分布：旧知识${oldKnowledgeCount}题，新知识${newKnowledgeCount}题`);
      
      // 旧知识题：错题特训数据+语法大厅低正确率点
      const oldQuestions = await this.getOldKnowledgeQuestions(userId, tabType, oldKnowledgeCount);
      
      // 新知识题：下一等级语法点/书写模块
      const newQuestions = await this.getNewKnowledgeQuestions(userId, tabType, newKnowledgeCount);
      
      // 合并题目
      const finalQuestions = [...oldQuestions, ...newQuestions];
      
      // 如果题目不够，从候选题中补充
      if (finalQuestions.length < finalQuestionCount) {
        const remainingCount = finalQuestionCount - finalQuestions.length;
        const usedQids = finalQuestions.map(q => q.qid);
        const remainingQuestions = candidateQuestions
          .filter(q => !usedQids.includes(q.qid))
          .slice(0, remainingCount);
        
        finalQuestions.push(...remainingQuestions);
      }
      
      console.log(`每日挑战题目生成完成：${finalQuestions.length}道题`);
      return finalQuestions.slice(0, finalQuestionCount);
      
    } catch (error) {
      console.error('生成每日挑战题目失败:', error);
      return [];
    }
  }

  // 获取旧知识题目（错题+低正确率点）
  async getOldKnowledgeQuestions(userId, tabType, count) {
    try {
      const UserAbilityProfile = require('../miniprogram/utils/userAbilityProfile');
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();
      
      const oldQuestions = [];
      
      // 1. 获取错题（50%的旧知识题目）
      const wrongQuestionCount = Math.floor(count * 0.5);
      const wrongQuestions = await this.getWrongQuestions(userId, tabType, wrongQuestionCount);
      oldQuestions.push(...wrongQuestions);
      
      // 2. 获取低正确率点题目（50%的旧知识题目）
      const lowAccuracyCount = count - wrongQuestionCount;
      const lowAccuracyQuestions = await this.getLowAccuracyQuestions(userId, tabType, lowAccuracyCount);
      oldQuestions.push(...lowAccuracyQuestions);
      
      console.log(`旧知识题目：错题${wrongQuestions.length}道，低正确率${lowAccuracyQuestions.length}道`);
      return oldQuestions;
      
    } catch (error) {
      console.error('获取旧知识题目失败:', error);
      return [];
    }
  }

  // 获取新知识题目（下一等级）
  async getNewKnowledgeQuestions(userId, tabType, count) {
    try {
      const UserAbilityProfile = require('../miniprogram/utils/userAbilityProfile');
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();
      
      // 获取用户当前等级
      const currentLevel = tabType === '语法' 
        ? abilityProfile.getLevelValue(abilityProfile.abilityData.grammarLevel)
        : abilityProfile.getLevelValue(abilityProfile.abilityData.writingLevel);
      
      // 下一等级
      const nextLevel = Math.min(currentLevel + 1, 5);
      
      console.log(`当前${tabType}等级：${currentLevel}，目标等级：${nextLevel}`);
      
      // 生成下一等级的题目
      const nextLevelQuestions = this.generateQuestionsByLevel(nextLevel, tabType, count);
      
      console.log(`新知识题目：${nextLevelQuestions.length}道`);
      return nextLevelQuestions;
      
    } catch (error) {
      console.error('获取新知识题目失败:', error);
      return [];
    }
  }

  // 获取错题
  async getWrongQuestions(userId, tabType, count) {
    try {
      // 模拟获取错题数据
      const wrongQuestions = [];
      for (let i = 1; i <= count; i++) {
        wrongQuestions.push({
          qid: `wrong_${tabType}_${i}`,
          text: `错题${i}：这是${tabType}相关的错题`,
          answer: 'A',
          category: tabType === '语法' ? 'grammar' : 'writing',
          difficulty_level: 2, // 错题通常是中等难度
          type: 'wrong_question',
          source: '错题特训'
        });
      }
      
      return wrongQuestions;
      
    } catch (error) {
      console.error('获取错题失败:', error);
      return [];
    }
  }

  // 获取低正确率题目
  async getLowAccuracyQuestions(userId, tabType, count) {
    try {
      // 模拟获取低正确率题目
      const lowAccuracyQuestions = [];
      for (let i = 1; i <= count; i++) {
        lowAccuracyQuestions.push({
          qid: `low_acc_${tabType}_${i}`,
          text: `低正确率题${i}：这是${tabType}相关的薄弱点题目`,
          answer: 'B',
          category: tabType === '语法' ? 'grammar' : 'writing',
          difficulty_level: 1, // 低正确率题目通常是基础难度
          type: 'low_accuracy',
          source: '语法大厅低正确率点'
        });
      }
      
      return lowAccuracyQuestions;
      
    } catch (error) {
      console.error('获取低正确率题目失败:', error);
      return [];
    }
  }

  // 按等级生成题目
  generateQuestionsByLevel(level, tabType, count) {
    const questions = [];
    for (let i = 1; i <= count; i++) {
      questions.push({
        qid: `level${level}_${tabType}_${i}`,
        text: `等级${level}题${i}：这是${tabType}相关的进阶题目`,
        answer: 'C',
        category: tabType === '语法' ? 'grammar' : 'writing',
        difficulty_level: level,
        type: 'new_knowledge',
        source: '下一等级知识'
      });
    }
    return questions;
  }

  // 生成学习路径题目（专项攻坚+7天预览）
  async generateLearningPathQuestions(userId, questionCount) {
    try {
      console.log(`生成学习路径题目：用户${userId}，数量${questionCount}`);
      
      // 步骤1：取能力模型薄弱点（语法/书写分别计算）
      const weakPoints = await this.getWeakPoints(userId);
      
      // 步骤2：生成当日专项题（调用P0-02去重接口）
      const dailyQuestions = await this.smartRecommendation.getNoDuplicateQuestions(
        userId, 
        "learning_path", 
        questionCount
      );
      
      // 步骤3：生成未来7天预览路径
      const sevenDayPlan = await this.generateSevenDayPlan(userId, weakPoints);
      
      const targetAccuracy = this.getTargetAccuracy(userId);
      const target = `本周重点攻克${weakPoints[0]}和${weakPoints[1]}，正确率提升至${targetAccuracy}%`;
      
      console.log(`学习路径生成完成：${dailyQuestions.length}道专项题，7天计划`);
      
      return {
        dailyQuestions: dailyQuestions,
        sevenDayPlan: sevenDayPlan,
        target: target
      };
      
    } catch (error) {
      console.error('生成学习路径题目失败:', error);
      return {
        dailyQuestions: [],
        sevenDayPlan: [],
        target: '本周重点攻克薄弱点，提升正确率'
      };
    }
  }

  // 获取薄弱点
  async getWeakPoints(userId) {
    try {
      const UserAbilityProfile = require('../miniprogram/utils/userAbilityProfile');
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();
      
      // 获取语法薄弱点
      const weakGrammarPoints = abilityProfile.abilityData.weakGrammarPoints || [];
      const weakWritingAreas = abilityProfile.abilityData.weakWritingAreas || [];
      
      // 合并薄弱点
      const weakPoints = [...weakGrammarPoints, ...weakWritingAreas];
      
      // 如果薄弱点不够，使用默认薄弱点
      if (weakPoints.length < 2) {
        const defaultWeakPoints = ['定语从句', '非谓语动词', '书写表格3', '时态运用'];
        return defaultWeakPoints.slice(0, 2);
      }
      
      return weakPoints.slice(0, 2);
      
    } catch (error) {
      console.error('获取薄弱点失败:', error);
      return ['定语从句', '非谓语动词'];
    }
  }

  // 生成7天预览路径
  async generateSevenDayPlan(userId, weakPoints) {
    try {
      const sevenDayPlan = [];
      const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      
      // 分配薄弱点到7天
      for (let i = 0; i < 7; i++) {
        const dayIndex = i % weakPoints.length;
        const weakPoint = weakPoints[dayIndex];
        
        sevenDayPlan.push({
          day: dayNames[i],
          focus: `${weakPoint}专项`,
          description: `重点练习${weakPoint}相关题目`,
          targetCount: 10 + Math.floor(Math.random() * 5), // 10-14题
          difficulty: i < 3 ? '基础' : i < 5 ? '进阶' : '挑战'
        });
      }
      
      return sevenDayPlan;
      
    } catch (error) {
      console.error('生成7天预览路径失败:', error);
      return [];
    }
  }

  // 获取目标正确率
  getTargetAccuracy(userId) {
    // 模拟获取目标正确率
    return 75 + Math.floor(Math.random() * 15); // 75-90%
  }

  // 突破冷却的专项练习接口（白名单模式）
  async getPracticeByWeakPoint(userId, pointName, questionCount, isWhitelist = false) {
    try {
      console.log(`获取专项练习：用户${userId}，语法点${pointName}，数量${questionCount}，白名单${isWhitelist}`);
      
      if (isWhitelist) {
        // 白名单：忽略48h冷却，直接取该语法点题目
        const candidateQuestions = await this.getQuestionsByPoint(userId, pointName, questionCount * 2);
        
        // 仅去重，不做冷却过滤
        const doneQids = await this.redisCache.getTodayDoneQids(userId);
        const questions = candidateQuestions
          .filter(q => !doneQids.includes(q.qid))
          .slice(0, questionCount);
        
        console.log(`白名单模式：获取${questions.length}道${pointName}专项题目`);
        
        return {
          success: true,
          data: {
            questions: questions,
            count: questions.length,
            pointName: pointName,
            isWhitelist: true,
            timestamp: new Date().toISOString()
          }
        };
        
      } else {
        // 非白名单：走正常冷却逻辑
        const candidateQuestions = await this.getQuestionsByPoint(userId, pointName, questionCount);
        const questions = await this.smartRecommendation.filterGrammarPointByCooling(userId, candidateQuestions);
        
        console.log(`正常模式：获取${questions.length}道${pointName}专项题目`);
        
        return {
          success: true,
          data: {
            questions: questions,
            count: questions.length,
            pointName: pointName,
            isWhitelist: false,
            timestamp: new Date().toISOString()
          }
        };
      }
      
    } catch (error) {
      console.error('获取专项练习失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 根据语法点获取题目
  async getQuestionsByPoint(userId, pointName, count) {
    try {
      // 模拟根据语法点获取题目
      const questions = [];
      for (let i = 1; i <= count; i++) {
        questions.push({
          qid: `${pointName}_${i}`,
          text: `${pointName}专项题目${i}：这是关于${pointName}的练习题目`,
          answer: 'A',
          grammar_point: pointName,
          category: 'grammar',
          difficulty_level: Math.floor(Math.random() * 3) + 1, // 1-3级难度
          type: 'special_practice',
          source: `${pointName}专项练习`
        });
      }
      
      return questions;
      
    } catch (error) {
      console.error('根据语法点获取题目失败:', error);
      return [];
    }
  }

  // 获取7天学习路径
  async getSevenDayPlan(userId) {
    try {
      console.log(`获取7天学习路径：用户${userId}`);
      
      // 获取用户薄弱点
      const weakPoints = await this.getWeakPoints(userId);
      
      // 生成7天计划
      const sevenDayPlan = await this.generateSevenDayPlan(userId, weakPoints);
      
      // 格式化计划数据（适配Vue组件）
      const formattedPlan = sevenDayPlan.map((item, index) => ({
        day: `Day${index + 1}`,
        content: item.focus,
        target: `目标${item.targetCount}题，${item.difficulty}难度`,
        description: item.description
      }));
      
      console.log(`7天学习路径生成完成：${formattedPlan.length}天计划`);
      
      return {
        success: true,
        data: {
          plan: formattedPlan,
          weakPoints: weakPoints,
          targetAccuracy: this.getTargetAccuracy(userId),
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('获取7天学习路径失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = RecommendationService;
