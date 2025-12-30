/**
 * 练习相关API服务
 */
const CloudApi = require('./cloudApi.js');

class PracticeService {
  /**
   * 保存练习进度
   * @param {Object} progressData 进度数据
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async saveProgress(progressData, options = {}) {
    const result = await CloudApi.callFunction('practiceProgress', {
      action: 'save',
      ...progressData
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '保存中...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 获取练习进度
   * @param {Object} params 查询参数
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async getProgress(params = {}, options = {}) {
    const result = await CloudApi.callFunction('practiceProgress', {
      action: 'get',
      ...params
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '加载进度...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 获取练习表格数据
   * @param {Object} params 查询参数
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async getPracticeTables(params = {}, options = {}) {
    const result = await CloudApi.callFunction('practiceProgress', {
      action: 'getTables',
      ...params
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '加载数据...',
      showError: options.showError !== false
    });

    return result;
  }
}

module.exports = PracticeService;


