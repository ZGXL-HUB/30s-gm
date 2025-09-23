// 智能推荐API接口
// 为小程序提供推荐服务接口

const RecommendationService = require('../../utils/recommendationService');

class RecommendationApi {
  constructor() {
    this.recommendationService = new RecommendationService();
  }

  // 获取去重题目（兼容Vue组件调用）
  async getNoDuplicateQuestions(userId, practiceEntry, tabType, questionCount) {
    try {
      console.log(`API调用：获取去重题目 - 用户${userId}，入口${practiceEntry}，类型${tabType}，数量${questionCount}`);
      
      const result = await this.recommendationService.getNoDuplicateQuestions(
        userId, 
        practiceEntry, 
        tabType, 
        questionCount
      );
      
      if (result.success) {
        return {
          code: 200,
          message: '获取成功',
          data: result.data
        };
      } else {
        return {
          code: 500,
          message: result.error || '获取失败',
          data: null
        };
      }
      
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        code: 500,
        message: '服务器内部错误',
        data: null
      };
    }
  }

  // 获取用户近7天活跃占比
  async getUserActiveRatio(userId) {
    try {
      console.log(`API调用：获取用户${userId}近7天活跃占比`);
      
      const result = await this.recommendationService.getUserActiveRatio(userId);
      
      if (result.success) {
        return {
          code: 200,
          message: '获取成功',
          data: result.data
        };
      } else {
        return {
          code: 500,
          message: result.error || '获取失败',
          data: null
        };
      }
      
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        code: 500,
        message: '服务器内部错误',
        data: null
      };
    }
  }

  // 获取每日推荐
  async getDailyRecommendation(userId, questionCount = 10, tabType = '语法') {
    try {
      console.log(`API调用：获取每日推荐 - 用户${userId}，数量${questionCount}，类型${tabType}`);
      
      const result = await this.recommendationService.getDailyRecommendation(
        userId, 
        questionCount, 
        tabType
      );
      
      if (result.success) {
        return {
          code: 200,
          message: '获取成功',
          data: result.data
        };
      } else {
        return {
          code: 500,
          message: result.error || '获取失败',
          data: null
        };
      }
      
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        code: 500,
        message: '服务器内部错误',
        data: null
      };
    }
  }

  // 获取进阶之旅推荐
  async getAdvancedJourneyRecommendation(userId, questionCount = 15) {
    try {
      console.log(`API调用：获取进阶之旅推荐 - 用户${userId}，数量${questionCount}`);
      
      const result = await this.recommendationService.getAdvancedJourneyRecommendation(
        userId, 
        questionCount
      );
      
      if (result.success) {
        return {
          code: 200,
          message: '获取成功',
          data: result.data
        };
      } else {
        return {
          code: 500,
          message: result.error || '获取失败',
          data: null
        };
      }
      
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        code: 500,
        message: '服务器内部错误',
        data: null
      };
    }
  }

  // 获取个性化推荐
  async getPersonalizedRecommendation(userId, questionCount = 12) {
    try {
      console.log(`API调用：获取个性化推荐 - 用户${userId}，数量${questionCount}`);
      
      const result = await this.recommendationService.getPersonalizedRecommendation(
        userId, 
        questionCount
      );
      
      if (result.success) {
        return {
          code: 200,
          message: '获取成功',
          data: result.data
        };
      } else {
        return {
          code: 500,
          message: result.error || '获取失败',
          data: null
        };
      }
      
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        code: 500,
        message: '服务器内部错误',
        data: null
      };
    }
  }

  // 获取今日统计
  async getTodayStats(userId) {
    try {
      console.log(`API调用：获取今日统计 - 用户${userId}`);
      
      const result = await this.recommendationService.getTodayStats(userId);
      
      if (result.success) {
        return {
          code: 200,
          message: '获取成功',
          data: result.data
        };
      } else {
        return {
          code: 500,
          message: result.error || '获取失败',
          data: null
        };
      }
      
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        code: 500,
        message: '服务器内部错误',
        data: null
      };
    }
  }

  // 清除今日进度
  async clearTodayProgress(userId) {
    try {
      console.log(`API调用：清除今日进度 - 用户${userId}`);
      
      const result = await this.recommendationService.clearTodayProgress(userId);
      
      if (result.success) {
        return {
          code: 200,
          message: '清除成功',
          data: result.data
        };
      } else {
        return {
          code: 500,
          message: result.error || '清除失败',
          data: null
        };
      }
      
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        code: 500,
        message: '服务器内部错误',
        data: null
      };
    }
  }

  // 获取语法点冷却状态
  async getGrammarPointCoolingStatus(userId) {
    try {
      console.log(`API调用：获取语法点冷却状态 - 用户${userId}`);
      
      const result = await this.recommendationService.getGrammarPointCoolingStatus(userId);
      
      if (result.success) {
        return {
          code: 200,
          message: '获取成功',
          data: result.data
        };
      } else {
        return {
          code: 500,
          message: result.error || '获取失败',
          data: null
        };
      }
      
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        code: 500,
        message: '服务器内部错误',
        data: null
      };
    }
  }

  // 突破冷却的专项练习接口
  async getPracticeByWeakPoint(userId, pointName, questionCount = 5, isWhitelist = true) {
    try {
      console.log(`API调用：获取专项练习 - 用户${userId}，语法点${pointName}，数量${questionCount}，白名单${isWhitelist}`);
      
      const result = await this.recommendationService.getPracticeByWeakPoint(
        userId, 
        pointName, 
        questionCount, 
        isWhitelist
      );
      
      if (result.success) {
        return {
          code: 200,
          message: '获取成功',
          data: result.data
        };
      } else {
        return {
          code: 500,
          message: result.error || '获取失败',
          data: null
        };
      }
      
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        code: 500,
        message: '服务器内部错误',
        data: null
      };
    }
  }

  // 获取7天学习路径
  async getSevenDayPlan(userId) {
    try {
      console.log(`API调用：获取7天学习路径 - 用户${userId}`);
      
      const result = await this.recommendationService.getSevenDayPlan(userId);
      
      if (result.success) {
        return {
          code: 200,
          message: '获取成功',
          data: result.data
        };
      } else {
        return {
          code: 500,
          message: result.error || '获取失败',
          data: null
        };
      }
      
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        code: 500,
        message: '服务器内部错误',
        data: null
      };
    }
  }
}

// 创建单例实例
const recommendationApi = new RecommendationApi();

// 导出API方法
module.exports = {
  // 主要API方法（兼容Vue组件）
  getNoDuplicateQuestions: recommendationApi.getNoDuplicateQuestions.bind(recommendationApi),
  getUserActiveRatio: recommendationApi.getUserActiveRatio.bind(recommendationApi),
  
  // 扩展API方法
  getDailyRecommendation: recommendationApi.getDailyRecommendation.bind(recommendationApi),
  getAdvancedJourneyRecommendation: recommendationApi.getAdvancedJourneyRecommendation.bind(recommendationApi),
  getPersonalizedRecommendation: recommendationApi.getPersonalizedRecommendation.bind(recommendationApi),
  getTodayStats: recommendationApi.getTodayStats.bind(recommendationApi),
  clearTodayProgress: recommendationApi.clearTodayProgress.bind(recommendationApi),
  getGrammarPointCoolingStatus: recommendationApi.getGrammarPointCoolingStatus.bind(recommendationApi),
  
  // 新增：突破冷却的专项练习接口
  getPracticeByWeakPoint: recommendationApi.getPracticeByWeakPoint.bind(recommendationApi),
  getSevenDayPlan: recommendationApi.getSevenDayPlan.bind(recommendationApi),
  
  // 导出类实例（用于高级用法）
  api: recommendationApi
};
