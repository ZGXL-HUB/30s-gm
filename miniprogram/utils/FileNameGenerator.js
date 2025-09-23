// 文件命名生成器工具类
class FileNameGenerator {
  constructor() {
    this.dateFormat = 'YYYYMMDD';
    this.timeFormat = 'HHmmss';
  }

  /**
   * 生成导出文件名
   * @param {string} type - 文件类型 (ppt, word)
   * @param {Object} userInfo - 用户信息
   * @param {Date} date - 日期
   * @param {Object} content - 内容信息
   * @returns {string} 文件名
   */
  generateFileName(type, userInfo, date, content) {
    const dateStr = this.formatDate(date);
    const userName = this.sanitizeFileName(userInfo.name || '教师');
    const grammarPoint = this.extractGrammarPoint(content);
    const extension = this.getFileExtension(type);
    
    return `${dateStr}_${userName}_${grammarPoint}讲评习题.${extension}`;
  }

  /**
   * 生成作业文件名
   * @param {string} type - 文件类型
   * @param {Object} assignment - 作业信息
   * @param {Object} teacher - 教师信息
   * @returns {string} 文件名
   */
  generateAssignmentFileName(type, assignment, teacher) {
    const dateStr = this.formatDate(new Date(assignment.createdAt));
    const userName = this.sanitizeFileName(teacher.name || '教师');
    const grammarPoint = this.extractGrammarPointFromTitle(assignment.title);
    const extension = this.getFileExtension(type);
    
    return `${dateStr}_${userName}_${grammarPoint}作业.${extension}`;
  }

  /**
   * 生成错题分析文件名
   * @param {string} type - 文件类型
   * @param {Object} assignment - 作业信息
   * @param {Object} teacher - 教师信息
   * @param {Object} stats - 统计信息
   * @returns {string} 文件名
   */
  generateErrorAnalysisFileName(type, assignment, teacher, stats) {
    const dateStr = this.formatDate(new Date());
    const userName = this.sanitizeFileName(teacher.name || '教师');
    const grammarPoint = this.extractGrammarPointFromTitle(assignment.title);
    const extension = this.getFileExtension(type);
    
    let fileName = `${dateStr}_${userName}_${grammarPoint}错题分析`;
    
    if (stats && stats.averageAccuracy) {
      fileName += `_正确率${stats.averageAccuracy}%`;
    }
    
    return `${fileName}.${extension}`;
  }

  /**
   * 格式化日期
   * @param {Date} date - 日期对象
   * @returns {string} 格式化后的日期字符串
   */
  formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  /**
   * 格式化时间
   * @param {Date} date - 日期对象
   * @returns {string} 格式化后的时间字符串
   */
  formatTime(date) {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${hours}${minutes}${seconds}`;
  }

  /**
   * 获取文件扩展名
   * @param {string} type - 文件类型
   * @returns {string} 扩展名
   */
  getFileExtension(type) {
    const extensions = {
      'ppt': 'pptx',
      'word': 'docx',
      'pdf': 'pdf',
      'excel': 'xlsx'
    };
    
    return extensions[type] || 'txt';
  }

  /**
   * 提取语法点
   * @param {Object} content - 内容信息
   * @returns {string} 语法点名称
   */
  extractGrammarPoint(content) {
    if (content.grammarPoint) {
      return content.grammarPoint;
    }
    
    if (content.title) {
      return this.extractGrammarPointFromTitle(content.title);
    }
    
    return '综合';
  }

  /**
   * 从标题中提取语法点
   * @param {string} title - 标题
   * @returns {string} 语法点名称
   */
  extractGrammarPointFromTitle(title) {
    if (!title) return '综合';
    
    const grammarPoints = [
      '定语从句', '非谓语动词', '时态', '语态', '虚拟语气', 
      '倒装', '强调', '主谓一致', '情态动词', '被动语态',
      '名词性从句', '状语从句', '形容词性从句', '介词', '连词'
    ];
    
    for (const point of grammarPoints) {
      if (title.includes(point)) {
        return point;
      }
    }
    
    return '综合';
  }

  /**
   * 清理文件名中的非法字符
   * @param {string} fileName - 原始文件名
   * @returns {string} 清理后的文件名
   */
  sanitizeFileName(fileName) {
    if (!fileName) return '未知';
    
    // 移除或替换非法字符
    return fileName
      .replace(/[<>:"/\\|?*]/g, '') // 移除Windows非法字符
      .replace(/\s+/g, '_') // 空格替换为下划线
      .substring(0, 20); // 限制长度
  }

  /**
   * 生成唯一文件名
   * @param {string} baseName - 基础文件名
   * @param {string} extension - 扩展名
   * @returns {string} 唯一文件名
   */
  generateUniqueFileName(baseName, extension) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    return `${baseName}_${timestamp}_${random}.${extension}`;
  }

  /**
   * 生成批量文件名
   * @param {Array} items - 项目列表
   * @param {string} type - 文件类型
   * @param {Object} userInfo - 用户信息
   * @returns {Array} 文件名列表
   */
  generateBatchFileNames(items, type, userInfo) {
    return items.map((item, index) => {
      const dateStr = this.formatDate(new Date());
      const userName = this.sanitizeFileName(userInfo.name || '教师');
      const extension = this.getFileExtension(type);
      
      return `${dateStr}_${userName}_${item.name || `文件${index + 1}`}.${extension}`;
    });
  }

  /**
   * 验证文件名
   * @param {string} fileName - 文件名
   * @returns {Object} 验证结果
   */
  validateFileName(fileName) {
    const result = {
      valid: true,
      issues: []
    };
    
    if (!fileName) {
      result.valid = false;
      result.issues.push('文件名为空');
      return result;
    }
    
    // 检查长度
    if (fileName.length > 255) {
      result.valid = false;
      result.issues.push('文件名过长');
    }
    
    // 检查非法字符
    const illegalChars = /[<>:"/\\|?*]/;
    if (illegalChars.test(fileName)) {
      result.valid = false;
      result.issues.push('包含非法字符');
    }
    
    // 检查扩展名
    const hasExtension = fileName.includes('.');
    if (!hasExtension) {
      result.issues.push('缺少文件扩展名');
    }
    
    return result;
  }

  /**
   * 生成文件路径
   * @param {string} fileName - 文件名
   * @param {string} folder - 文件夹
   * @returns {string} 完整文件路径
   */
  generateFilePath(fileName, folder = 'exports') {
    const cleanFolder = this.sanitizeFileName(folder);
    return `${cleanFolder}/${fileName}`;
  }
}

module.exports = FileNameGenerator;
