// 统一错误处理工具
class ErrorHandler {
  
  /**
   * 处理云函数调用错误
   * @param {Error} error 错误对象
   * @param {string} functionName 云函数名称
   * @returns {Object} 用户友好的错误信息
   */
  static handleCloudFunctionError(error, functionName = '未知函数') {
    console.error(`云函数 ${functionName} 调用失败:`, error);
    
    // 根据错误类型返回不同的用户提示
    if (error.errCode) {
      switch (error.errCode) {
        case -601002:
          return {
            success: false,
            message: '网络连接失败，请检查网络后重试',
            code: 'NETWORK_ERROR'
          };
        case -601005:
          return {
            success: false,
            message: '服务暂时不可用，请稍后重试',
            code: 'SERVICE_UNAVAILABLE'
          };
        case -601006:
          return {
            success: false,
            message: '权限不足，请重新登录',
            code: 'PERMISSION_DENIED'
          };
        default:
          return {
            success: false,
            message: '操作失败，请重试',
            code: 'UNKNOWN_ERROR'
          };
      }
    }
    
    // 网络错误
    if (error.errMsg && error.errMsg.includes('network')) {
      return {
        success: false,
        message: '网络连接失败，请检查网络后重试',
        code: 'NETWORK_ERROR'
      };
    }
    
    // 权限错误
    if (error.errMsg && error.errMsg.includes('permission')) {
      return {
        success: false,
        message: '权限不足，请重新登录',
        code: 'PERMISSION_DENIED'
      };
    }
    
    // 默认错误
    return {
      success: false,
      message: '操作失败，请重试',
      code: 'UNKNOWN_ERROR'
    };
  }
  
  /**
   * 处理数据库操作错误
   * @param {Error} error 错误对象
   * @param {string} operation 操作类型
   * @returns {Object} 用户友好的错误信息
   */
  static handleDatabaseError(error, operation = '数据库操作') {
    console.error(`${operation}失败:`, error);
    
    if (error.errCode) {
      switch (error.errCode) {
        case -502002:
          return {
            success: false,
            message: '数据不存在',
            code: 'DATA_NOT_FOUND'
          };
        case -502003:
          return {
            success: false,
            message: '数据格式错误',
            code: 'INVALID_DATA_FORMAT'
          };
        case -502004:
          return {
            success: false,
            message: '权限不足，无法访问数据',
            code: 'PERMISSION_DENIED'
          };
        default:
          return {
            success: false,
            message: '数据操作失败，请重试',
            code: 'DATABASE_ERROR'
          };
      }
    }
    
    return {
      success: false,
      message: '数据操作失败，请重试',
      code: 'DATABASE_ERROR'
    };
  }
  
  /**
   * 处理用户输入错误
   * @param {string} field 字段名
   * @param {string} value 输入值
   * @returns {Object} 验证结果
   */
  static handleInputError(field, value) {
    const fieldNames = {
      'answer': '答案',
      'content': '内容',
      'title': '标题',
      'contact': '联系方式'
    };
    
    const fieldName = fieldNames[field] || field;
    
    if (!value || value.trim() === '') {
      return {
        success: false,
        message: `${fieldName}不能为空`,
        code: 'EMPTY_INPUT'
      };
    }
    
    if (value.length > 1000) {
      return {
        success: false,
        message: `${fieldName}过长，请控制在1000字符以内`,
        code: 'INPUT_TOO_LONG'
      };
    }
    
    return {
      success: true,
      message: '输入有效'
    };
  }
  
  /**
   * 显示错误提示
   * @param {Object} errorResult 错误结果对象
   * @param {string} title 提示标题
   */
  static showError(errorResult, title = '操作失败') {
    wx.showToast({
      title: errorResult.message || '操作失败',
      icon: 'none',
      duration: 2000
    });
  }
  
  /**
   * 显示成功提示
   * @param {string} message 成功消息
   */
  static showSuccess(message = '操作成功') {
    wx.showToast({
      title: message,
      icon: 'success',
      duration: 1500
    });
  }
  
  /**
   * 记录错误日志（生产环境不记录敏感信息）
   * @param {Error} error 错误对象
   * @param {string} context 错误上下文
   */
  static logError(error, context = '') {
    // 生产环境只记录错误类型，不记录具体错误信息
    // 使用新的API替代已弃用的getSystemInfoSync
    let isProduction = true;
    try {
      // 使用新的API获取设备信息
      const deviceInfo = wx.getDeviceInfo();
      const appBaseInfo = wx.getAppBaseInfo();
      
      // 检查是否为开发环境
      isProduction = deviceInfo.platform !== 'devtools' && appBaseInfo.envVersion !== 'develop';
    } catch (error) {
      // 如果新API不可用，使用备用方案
      console.warn('使用备用方案检测环境');
      isProduction = true; // 默认认为生产环境
    }
    
    if (isProduction) {
      console.error(`[${context}] 错误类型: ${error.name || 'Unknown'}`);
    } else {
      console.error(`[${context}]`, error);
    }
  }
}

module.exports = ErrorHandler;
