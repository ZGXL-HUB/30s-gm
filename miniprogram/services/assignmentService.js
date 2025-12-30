/**
 * 作业相关API服务
 */
const CloudApi = require('./cloudApi.js');

class AssignmentService {
  /**
   * 创建作业
   * @param {Object} assignmentData 作业数据
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async createAssignment(assignmentData, options = {}) {
    const result = await CloudApi.callFunction('createAssignment', assignmentData, {
      showLoading: options.showLoading !== false,
      loadingText: '创建作业中...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 获取作业列表（教师端）
   * @param {Object} params 查询参数
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async getAssignments(params = {}, options = {}) {
    const result = await CloudApi.callFunction('getAssignments', params, {
      showLoading: options.showLoading !== false,
      loadingText: '加载作业列表...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 获取学生作业列表
   * @param {Object} params 查询参数
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async getStudentAssignments(params = {}, options = {}) {
    const result = await CloudApi.callFunction('getStudentAssignments', params, {
      showLoading: options.showLoading !== false,
      loadingText: '加载作业列表...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 提交作业结果
   * @param {Object} resultData 作业结果数据
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async submitAssignmentResult(resultData, options = {}) {
    const result = await CloudApi.callFunction('submitAssignmentResult', resultData, {
      showLoading: options.showLoading !== false,
      loadingText: '提交中...',
      showError: options.showError !== false
    });

    return result;
  }
}

module.exports = AssignmentService;


