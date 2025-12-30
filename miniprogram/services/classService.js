/**
 * 班级相关API服务
 */
const CloudApi = require('./cloudApi.js');

class ClassService {
  /**
   * 管理班级邀请（生成/验证邀请码）
   * @param {string} action 操作类型：'generate' | 'validate' | 'revoke'
   * @param {Object} data 请求数据
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async manageClassInvite(action, data = {}, options = {}) {
    const result = await CloudApi.callFunction('manageClassInvite', {
      action: action,
      ...data
    }, {
      showLoading: options.showLoading !== false,
      loadingText: options.loadingText || '处理中...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 学生加入班级
   * @param {string} inviteCode 邀请码
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async studentJoinClass(inviteCode, options = {}) {
    const result = await CloudApi.callFunction('studentJoinClass', {
      inviteCode: inviteCode
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '加入班级中...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 同步班级学生人数统计
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async syncClassStudentCount(options = {}) {
    const result = await CloudApi.callFunction('syncClassStudentCount', {}, {
      showLoading: options.showLoading !== false,
      loadingText: '同步中...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 解析学生Excel文件
   * @param {string} fileId 云文件ID
   * @param {string} classId 班级ID
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async parseStudentExcel(fileId, classId, options = {}) {
    const result = await CloudApi.callFunction('parseStudentExcel', {
      fileId: fileId,
      classId: classId
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '解析中...',
      showError: options.showError !== false
    });

    return result;
  }
}

module.exports = ClassService;


