/**
 * 统一云函数调用封装
 * 提供统一的错误处理和日志记录
 */
const ErrorHandler = require('../utils/error-handler.js');

class CloudApi {
  /**
   * 检查云开发是否可用
   * @returns {boolean}
   */
  static isCloudAvailable() {
    return !!(wx.cloud && wx.cloud.callFunction);
  }

  /**
   * 调用云函数（统一封装）
   * @param {string} name 云函数名称
   * @param {Object} data 请求数据
   * @param {Object} options 可选配置
   * @param {boolean} options.showLoading 是否显示加载提示
   * @param {string} options.loadingText 加载提示文本
   * @param {boolean} options.showError 是否显示错误提示
   * @returns {Promise<Object>}
   */
  static async callFunction(name, data = {}, options = {}) {
    const {
      showLoading = false,
      loadingText = '加载中...',
      showError = true
    } = options;

    // 检查云开发是否可用
    if (!this.isCloudAvailable()) {
      const error = new Error('云开发不可用');
      ErrorHandler.logError(error, `callFunction: ${name}`);
      
      if (showError) {
        ErrorHandler.showError({
          success: false,
          message: '云开发服务不可用，请检查网络连接',
          code: 'CLOUD_UNAVAILABLE'
        });
      }
      
      return {
        success: false,
        error: error,
        code: 'CLOUD_UNAVAILABLE'
      };
    }

    // 显示加载提示
    if (showLoading) {
      wx.showLoading({
        title: loadingText,
        mask: true
      });
    }

    try {
      const result = await wx.cloud.callFunction({
        name: name,
        data: data
      });

      // 隐藏加载提示
      if (showLoading) {
        wx.hideLoading();
      }

      // 检查云函数返回的错误
      if (result.result && result.result.error) {
        const error = new Error(result.result.error);
        ErrorHandler.logError(error, `callFunction: ${name}`);
        
        if (showError) {
          ErrorHandler.showError({
            success: false,
            message: result.result.error || '操作失败',
            code: 'CLOUD_FUNCTION_ERROR'
          });
        }
        
        return {
          success: false,
          error: error,
          code: 'CLOUD_FUNCTION_ERROR',
          data: result.result
        };
      }

      return {
        success: true,
        data: result.result,
        result: result.result
      };

    } catch (error) {
      // 隐藏加载提示
      if (showLoading) {
        wx.hideLoading();
      }

      // 处理错误
      const errorResult = ErrorHandler.handleCloudFunctionError(error, name);
      ErrorHandler.logError(error, `callFunction: ${name}`);

      if (showError) {
        ErrorHandler.showError(errorResult);
      }

      return {
        success: false,
        error: error,
        ...errorResult
      };
    }
  }

  /**
   * 批量调用云函数
   * @param {Array<{name: string, data: Object}>} calls 调用列表
   * @returns {Promise<Array>}
   */
  static async callBatch(calls) {
    const promises = calls.map(call => 
      this.callFunction(call.name, call.data, { showLoading: false, showError: false })
    );
    
    return Promise.all(promises);
  }
}

module.exports = CloudApi;


