// 导出服务模块
const app = getApp();

class ExportService {
  constructor() {
    this.exportTemplates = {
      standard: {
        name: '标准模板',
        description: '题目+答案+解析',
        includeAnswer: true,
        includeAnalysis: true,
        layout: 'vertical'
      },
      exercise: {
        name: '练习模板',
        description: '仅题目，答案另页',
        includeAnswer: false,
        includeAnalysis: false,
        layout: 'vertical'
      },
      test: {
        name: '测试模板',
        description: '题目+答题卡',
        includeAnswer: false,
        includeAnalysis: false,
        layout: 'horizontal'
      }
    };
    
    this.userLimits = {
      free: { daily: 3, maxQuestions: 20 },
      vip: { daily: 10, maxQuestions: 50 },
      teacher: { daily: 20, maxQuestions: 100 }
    };
  }

  /**
   * 获取用户导出权限
   */
  getUserExportLimit() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    const userType = userInfo.type || 'free';
    const today = new Date().toDateString();
    const exportHistory = wx.getStorageSync('exportHistory') || {};
    
    const todayExports = exportHistory[today] || 0;
    const limit = this.userLimits[userType];
    
    return {
      total: limit.daily,
      used: todayExports,
      remaining: Math.max(0, limit.daily - todayExports),
      maxQuestions: limit.maxQuestions,
      userType: userType
    };
  }

  /**
   * 记录导出操作
   */
  recordExport(questionCount) {
    const today = new Date().toDateString();
    const exportHistory = wx.getStorageSync('exportHistory') || {};
    exportHistory[today] = (exportHistory[today] || 0) + 1;
    wx.setStorageSync('exportHistory', exportHistory);
    
    // 记录详细导出历史
    const detailHistory = wx.getStorageSync('exportDetailHistory') || [];
    detailHistory.push({
      date: new Date().toISOString(),
      questionCount: questionCount,
      timestamp: Date.now()
    });
    
    // 只保留最近30天的记录
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const filteredHistory = detailHistory.filter(record => record.timestamp > thirtyDaysAgo);
    wx.setStorageSync('exportDetailHistory', filteredHistory);
  }

  /**
   * 生成PDF内容
   */
  async generatePDF(questions, options) {
    const { template, format, includeAnswer, includeAnalysis } = options;
    
    // 这里使用第三方PDF生成库，比如 jsPDF
    // 由于小程序限制，我们使用云函数来生成PDF
    
    const pdfData = {
      title: '英语语法练习题目',
      subtitle: `共${questions.length}题 - ${new Date().toLocaleDateString()}`,
      questions: questions.map((q, index) => ({
        number: index + 1,
        question: q.question,
        options: q.options,
        answer: includeAnswer ? q.correctAnswer : null,
        analysis: includeAnalysis ? q.analysis : null,
        difficulty: q.difficulty || 'medium'
      })),
      template: template,
      includeAnswer: includeAnswer,
      includeAnalysis: includeAnalysis
    };

    try {
      // 调用云函数生成PDF
      const result = await wx.cloud.callFunction({
        name: 'generatePDF',
        data: pdfData
      });
      
      return result.result;
    } catch (error) {
      console.error('PDF生成失败:', error);
      throw new Error('PDF生成失败，请稍后重试');
    }
  }

  /**
   * 生成Word内容
   */
  async generateWord(questions, options) {
    const { template, includeAnswer, includeAnalysis } = options;
    
    const wordData = {
      title: '英语语法练习题目',
      subtitle: `共${questions.length}题 - ${new Date().toLocaleDateString()}`,
      questions: questions.map((q, index) => ({
        number: index + 1,
        question: q.question,
        options: q.options,
        answer: includeAnswer ? q.correctAnswer : null,
        analysis: includeAnalysis ? q.analysis : null,
        difficulty: q.difficulty || 'medium'
      })),
      template: template,
      includeAnswer: includeAnswer,
      includeAnalysis: includeAnalysis
    };

    try {
      // 调用云函数生成Word
      const result = await wx.cloud.callFunction({
        name: 'generateWord',
        data: wordData
      });
      
      return result.result;
    } catch (error) {
      console.error('Word生成失败:', error);
      throw new Error('Word生成失败，请稍后重试');
    }
  }

  /**
   * 生成Excel内容
   */
  async generateExcel(questions, options) {
    const { includeAnswer, includeAnalysis } = options;
    
    const excelData = {
      title: '英语语法练习题目',
      questions: questions.map((q, index) => ({
        '题号': index + 1,
        '题目': q.question,
        '选项A': q.options[0] || '',
        '选项B': q.options[1] || '',
        '选项C': q.options[2] || '',
        '选项D': q.options[3] || '',
        '选项E': q.options[4] || '',
        '正确答案': includeAnswer ? q.correctAnswer : '',
        '解析': includeAnalysis ? q.analysis : '',
        '难度': q.difficulty || 'medium',
        '标签': q.tags ? q.tags.join(',') : ''
      }))
    };

    try {
      // 调用云函数生成Excel
      const result = await wx.cloud.callFunction({
        name: 'generateExcel',
        data: excelData
      });
      
      return result.result;
    } catch (error) {
      console.error('Excel生成失败:', error);
      throw new Error('Excel生成失败，请稍后重试');
    }
  }

  /**
   * 估算文件大小
   */
  estimateFileSize(questions, format) {
    const baseSize = {
      pdf: 50, // KB per question
      word: 30, // KB per question
      excel: 20  // KB per question
    };
    
    const estimatedSize = questions.length * baseSize[format];
    
    if (estimatedSize < 1024) {
      return `${estimatedSize}KB`;
    } else {
      return `${(estimatedSize / 1024).toFixed(1)}MB`;
    }
  }

  /**
   * 估算页数
   */
  estimatePages(questions, template) {
    const questionsPerPage = {
      standard: 2, // 标准模板每页2题
      exercise: 3, // 练习模板每页3题
      test: 4      // 测试模板每页4题
    };
    
    return Math.ceil(questions.length / questionsPerPage[template]);
  }

  /**
   * 筛选题目
   */
  filterQuestions(questions, filters) {
    let filtered = [...questions];
    
    // 按难度筛选
    if (filters.difficulties && filters.difficulties.length > 0) {
      filtered = filtered.filter(q => 
        filters.difficulties.includes(q.difficulty || 'medium')
      );
    }
    
    // 按数量限制
    if (filters.quantity && filters.quantity < filtered.length) {
      // 随机选择指定数量的题目
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      filtered = shuffled.slice(0, filters.quantity);
    }
    
    return filtered;
  }

  /**
   * 下载文件
   */
  async downloadFile(fileUrl, fileName) {
    try {
      // 下载文件到本地
      const downloadResult = await wx.downloadFile({
        url: fileUrl
      });
      
      if (downloadResult.statusCode === 200) {
        // 保存到相册或文件管理器
        await wx.saveFile({
          tempFilePath: downloadResult.tempFilePath,
          success: (res) => {
            wx.showToast({
              title: '文件已保存',
              icon: 'success'
            });
          },
          fail: (error) => {
            console.error('保存文件失败:', error);
            wx.showToast({
              title: '保存失败',
              icon: 'error'
            });
          }
        });
      } else {
        throw new Error('下载失败');
      }
    } catch (error) {
      console.error('下载文件失败:', error);
      wx.showToast({
        title: '下载失败',
        icon: 'error'
      });
    }
  }
}

module.exports = ExportService;
