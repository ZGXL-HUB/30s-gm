/**
 * 用户相关API服务
 */
const CloudApi = require('./cloudApi.js');
const ErrorHandler = require('../utils/error-handler.js');

class UserService {
  /**
   * 获取用户OpenID
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async getOpenId(options = {}) {
    const result = await CloudApi.callFunction('quickstartFunctions', {
      type: 'getOpenId'
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '获取用户信息...',
      showError: options.showError !== false
    });

    if (result.success && result.data) {
      return {
        success: true,
        openid: result.data.openid
      };
    }

    return result;
  }

  /**
   * 用户登录
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async login(options = {}) {
    const result = await CloudApi.callFunction('login', {}, {
      showLoading: options.showLoading !== false,
      loadingText: '登录中...',
      showError: options.showError !== false
    });

    if (result.success && result.data) {
      return {
        success: true,
        openid: result.data.openid,
        appid: result.data.appid,
        unionid: result.data.unionid
      };
    }

    return result;
  }

  /**
   * 获取用户信息（从本地存储）
   * @returns {Object|null}
   */
  static getUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      return userInfo || null;
    } catch (error) {
      ErrorHandler.logError(error, 'getUserInfo');
      return null;
    }
  }

  /**
   * 保存用户信息到本地存储
   * @param {Object} userInfo 用户信息
   * @returns {boolean}
   */
  static saveUserInfo(userInfo) {
    try {
      wx.setStorageSync('userInfo', userInfo);
      return true;
    } catch (error) {
      ErrorHandler.logError(error, 'saveUserInfo');
      return false;
    }
  }
}

module.exports = UserService;


