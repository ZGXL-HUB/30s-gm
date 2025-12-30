/**
 * 题目相关API服务
 */
const CloudApi = require('./cloudApi.js');
const cloudDataLoader = require('../utils/cloudDataLoader.js');

class QuestionService {
  /**
   * 获取题目数据
   * @param {Object} params 查询参数
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async getQuestionsData(params = {}, options = {}) {
    const result = await CloudApi.callFunction('getQuestionsData', params, {
      showLoading: options.showLoading !== false,
      loadingText: '加载题目...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 根据语法点获取题目（使用cloudDataLoader）
   * @param {string} grammarPoint 语法点
   * @returns {Promise<Array>}
   */
  static async getQuestionsByGrammarPoint(grammarPoint) {
    try {
      const questions = await cloudDataLoader.getQuestionsByGrammarPoint(grammarPoint);
      return {
        success: true,
        data: questions
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        data: []
      };
    }
  }

  /**
   * 加载语法测试套题
   * @returns {Promise<Array>}
   */
  static async loadGrammarTestSets() {
    try {
      const data = await cloudDataLoader.loadGrammarTestSets();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        data: []
      };
    }
  }

  /**
   * 加载书写练习题目
   * @returns {Promise<Array>}
   */
  static async loadWritingExerciseQuestions() {
    try {
      const data = await cloudDataLoader.loadWritingExerciseQuestions();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        data: []
      };
    }
  }

  /**
   * 加载中级题目
   * @returns {Promise<Array>}
   */
  static async loadIntermediateQuestions() {
    try {
      const data = await cloudDataLoader.loadIntermediateQuestions();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        data: []
      };
    }
  }
}

module.exports = QuestionService;


