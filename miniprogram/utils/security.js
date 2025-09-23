// 安全工具函数
class SecurityUtils {
  
  /**
   * 清理用户输入，防止XSS攻击
   * @param {string} input 用户输入
   * @returns {string} 清理后的安全字符串
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      return '';
    }
    
    return input
      .replace(/[<>]/g, '') // 移除HTML标签
      .replace(/javascript:/gi, '') // 移除javascript协议
      .replace(/on\w+=/gi, '') // 移除事件处理器
      .trim()
      .substring(0, 1000); // 限制长度
  }
  
  /**
   * 验证答案输入格式
   * @param {string} answer 用户答案
   * @returns {Object} 验证结果
   */
  static validateAnswer(answer) {
    if (!answer || typeof answer !== 'string') {
      return { isValid: false, message: '答案不能为空' };
    }
    
    const sanitized = this.sanitizeInput(answer);
    
    if (sanitized.length === 0) {
      return { isValid: false, message: '答案格式不正确' };
    }
    
    if (sanitized.length > 500) {
      return { isValid: false, message: '答案过长' };
    }
    
    // 检查是否包含危险字符
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /function\s*\(/i
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(sanitized)) {
        return { isValid: false, message: '答案包含非法字符' };
      }
    }
    
    return { isValid: true, sanitized };
  }
  
  /**
   * 验证反馈内容
   * @param {string} content 反馈内容
   * @returns {Object} 验证结果
   */
  static validateFeedback(content) {
    if (!content || typeof content !== 'string') {
      return { isValid: false, message: '反馈内容不能为空' };
    }
    
    const sanitized = this.sanitizeInput(content);
    
    if (sanitized.length < 5) {
      return { isValid: false, message: '反馈内容至少5个字符' };
    }
    
    if (sanitized.length > 2000) {
      return { isValid: false, message: '反馈内容不能超过2000字符' };
    }
    
    return { isValid: true, sanitized };
  }
  
  /**
   * 验证OpenID格式
   * @param {string} openid OpenID
   * @returns {boolean} 是否有效
   */
  static validateOpenId(openid) {
    if (!openid || typeof openid !== 'string') {
      return false;
    }
    
    // 微信OpenID格式验证
    const openIdPattern = /^[a-zA-Z0-9_-]{28}$/;
    return openIdPattern.test(openid);
  }
  
  /**
   * 生成安全的随机ID
   * @param {number} length ID长度
   * @returns {string} 随机ID
   */
  static generateSecureId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  /**
   * 检查是否为管理员
   * @param {string} openid 用户OpenID
   * @returns {boolean} 是否为管理员
   */
  static async isAdmin(openid) {
    if (!this.validateOpenId(openid)) {
      return false;
    }
    
    try {
      // 这里应该调用云函数验证管理员权限
      // 而不是硬编码OpenID列表
      const result = await wx.cloud.callFunction({
        name: 'adminAuth',
        data: { action: 'checkAdmin', openid }
      });
      
      return result.result && result.result.isAdmin === true;
    } catch (error) {
      console.error('验证管理员权限失败:', error);
      return false;
    }
  }
}

module.exports = SecurityUtils;
