/**
 * 反馈相关API服务
 */
const CloudApi = require('./cloudApi.js');

class FeedbackService {
  /**
   * 提交反馈
   * @param {Object} feedbackData 反馈数据
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async submitFeedback(feedbackData, options = {}) {
    const result = await CloudApi.callFunction('feedbackManager', {
      action: 'submit',
      ...feedbackData
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '提交中...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 获取反馈列表
   * @param {Object} params 查询参数
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async getFeedbackList(params = {}, options = {}) {
    const result = await CloudApi.callFunction('feedbackManager', {
      action: 'list',
      ...params
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '加载反馈列表...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 获取反馈详情
   * @param {string} feedbackId 反馈ID
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async getFeedbackDetail(feedbackId, options = {}) {
    const result = await CloudApi.callFunction('feedbackManager', {
      action: 'detail',
      feedbackId: feedbackId
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '加载详情...',
      showError: options.showError !== false
    });

    return result;
  }
}

module.exports = FeedbackService;


