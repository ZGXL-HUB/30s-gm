// 导出逻辑管理工具类
class ExportLogic {
  constructor() {
    this.templates = {
      ppt: {
        name: 'PPT格式',
        description: '适合课堂讲评，不显示答案',
        showAnswer: false,
        showAnalysis: false,
        showErrorRate: true,
        showVariants: true
      },
      word: {
        name: 'Word格式',
        description: '适合打印分发，显示答案和解析',
        showAnswer: true,
        showAnalysis: true,
        showErrorRate: true,
        showVariants: true
      }
    };
  }

  /**
   * 生成PPT内容
   * @param {Array} questionStats - 题目统计列表
   * @param {Object} assignment - 作业信息
   * @param {Object} teacher - 教师信息
   * @returns {Object} PPT内容结构
   */
  generatePPTContent(questionStats, assignment, teacher) {
    const template = this.templates.ppt;
    
    return {
      coverSlide: this.createCoverSlide(assignment, teacher, 'PPT'),
      questionSlides: this.createQuestionSlides(questionStats, template),
      answerSlide: this.createAnswerSlide(questionStats, template),
      variantSlides: this.createVariantSlides(questionStats, template),
      summarySlide: this.createSummarySlide(questionStats, assignment)
    };
  }

  /**
   * 生成Word内容
   * @param {Array} questionStats - 题目统计列表
   * @param {Object} assignment - 作业信息
   * @param {Object} teacher - 教师信息
   * @returns {Object} Word内容结构
   */
  generateWordContent(questionStats, assignment, teacher) {
    const template = this.templates.word;
    
    return {
      titlePage: this.createTitlePage(assignment, teacher, 'Word'),
      contentPages: this.createContentPages(questionStats, template),
      variantPages: this.createVariantPages(questionStats, template),
      summaryPage: this.createSummaryPage(questionStats, assignment)
    };
  }

  /**
   * 创建封面页
   * @param {Object} assignment - 作业信息
   * @param {Object} teacher - 教师信息
   * @param {string} format - 格式类型
   * @returns {Object} 封面页内容
   */
  createCoverSlide(assignment, teacher, format) {
    return {
      type: 'cover',
      title: '语法讲评习题',
      subtitle: assignment.title,
      teacher: teacher.name || '教师',
      class: teacher.school || '班级',
      date: new Date().toLocaleDateString(),
      format: format
    };
  }

  /**
   * 创建标题页
   * @param {Object} assignment - 作业信息
   * @param {Object} teacher - 教师信息
   * @param {string} format - 格式类型
   * @returns {Object} 标题页内容
   */
  createTitlePage(assignment, teacher, format) {
    return {
      type: 'title',
      title: '语法讲评习题',
      subtitle: assignment.title,
      teacher: teacher.name || '教师',
      class: teacher.school || '班级',
      date: new Date().toLocaleDateString(),
      totalQuestions: assignment.questions ? assignment.questions.length : 0,
      format: format
    };
  }

  /**
   * 创建题目幻灯片
   * @param {Array} questionStats - 题目统计列表
   * @param {Object} template - 模板配置
   * @returns {Array} 题目幻灯片列表
   */
  createQuestionSlides(questionStats, template) {
    return questionStats.map((stat, index) => ({
      type: 'question',
      number: index + 1,
      question: stat.question.question || stat.question.text,
      options: stat.question.options || [],
      errorRate: stat.errorRate,
      showAnswer: template.showAnswer,
      showAnalysis: template.showAnalysis,
      showErrorRate: template.showErrorRate
    }));
  }

  /**
   * 创建内容页面
   * @param {Array} questionStats - 题目统计列表
   * @param {Object} template - 模板配置
   * @returns {Array} 内容页面列表
   */
  createContentPages(questionStats, template) {
    return questionStats.map((stat, index) => ({
      type: 'content',
      number: index + 1,
      question: stat.question.question || stat.question.text,
      options: stat.question.options || [],
      answer: stat.question.answer || stat.question.correctAnswer,
      analysis: stat.question.analysis,
      errorRate: stat.errorRate,
      showAnswer: template.showAnswer,
      showAnalysis: template.showAnalysis,
      showErrorRate: template.showErrorRate
    }));
  }

  /**
   * 创建答案汇总页
   * @param {Array} questionStats - 题目统计列表
   * @param {Object} template - 模板配置
   * @returns {Object} 答案汇总页内容
   */
  createAnswerSlide(questionStats, template) {
    const answers = questionStats.map((stat, index) => ({
      number: index + 1,
      answer: stat.question.answer || stat.question.correctAnswer,
      analysis: stat.question.analysis,
      errorRate: stat.errorRate
    }));

    return {
      type: 'answer',
      title: '答案汇总',
      answers: answers,
      showAnalysis: template.showAnalysis,
      showErrorRate: template.showErrorRate
    };
  }

  /**
   * 创建变式题幻灯片
   * @param {Array} questionStats - 题目统计列表
   * @param {Object} template - 模板配置
   * @returns {Array} 变式题幻灯片列表
   */
  createVariantSlides(questionStats, template) {
    const slides = [];
    
    questionStats.forEach((stat, index) => {
      if (stat.variants && stat.variants.length > 0) {
        stat.variants.forEach((variant, vIndex) => {
          slides.push({
            type: 'variant',
            originalNumber: index + 1,
            variantNumber: vIndex + 1,
            question: variant.question || variant.text,
            options: variant.options || [],
            answer: variant.answer || variant.correctAnswer,
            analysis: variant.analysis,
            showAnswer: template.showAnswer,
            showAnalysis: template.showAnalysis
          });
        });
      }
    });
    
    return slides;
  }

  /**
   * 创建变式题页面
   * @param {Array} questionStats - 题目统计列表
   * @param {Object} template - 模板配置
   * @returns {Array} 变式题页面列表
   */
  createVariantPages(questionStats, template) {
    const pages = [];
    
    questionStats.forEach((stat, index) => {
      if (stat.variants && stat.variants.length > 0) {
        pages.push({
          type: 'variant_group',
          originalNumber: index + 1,
          originalQuestion: stat.question.question || stat.question.text,
          variants: stat.variants.map((variant, vIndex) => ({
            number: vIndex + 1,
            question: variant.question || variant.text,
            options: variant.options || [],
            answer: variant.answer || variant.correctAnswer,
            analysis: variant.analysis,
            showAnswer: template.showAnswer,
            showAnalysis: template.showAnalysis
          }))
        });
      }
    });
    
    return pages;
  }

  /**
   * 创建汇总幻灯片
   * @param {Array} questionStats - 题目统计列表
   * @param {Object} assignment - 作业信息
   * @returns {Object} 汇总幻灯片内容
   */
  createSummarySlide(questionStats, assignment) {
    const totalQuestions = questionStats.length;
    const averageErrorRate = questionStats.reduce((sum, stat) => sum + stat.errorRate, 0) / totalQuestions;
    const highErrorQuestions = questionStats.filter(stat => stat.errorRate >= 75).length;
    
    return {
      type: 'summary',
      title: '错题分析汇总',
      totalQuestions: totalQuestions,
      averageErrorRate: averageErrorRate.toFixed(1),
      highErrorQuestions: highErrorQuestions,
      recommendations: this.generateRecommendations(questionStats)
    };
  }

  /**
   * 创建汇总页面
   * @param {Array} questionStats - 题目统计列表
   * @param {Object} assignment - 作业信息
   * @returns {Object} 汇总页面内容
   */
  createSummaryPage(questionStats, assignment) {
    const totalQuestions = questionStats.length;
    const averageErrorRate = questionStats.reduce((sum, stat) => sum + stat.errorRate, 0) / totalQuestions;
    const highErrorQuestions = questionStats.filter(stat => stat.errorRate >= 75).length;
    
    return {
      type: 'summary',
      title: '错题分析汇总',
      totalQuestions: totalQuestions,
      averageErrorRate: averageErrorRate.toFixed(1),
      highErrorQuestions: highErrorQuestions,
      recommendations: this.generateRecommendations(questionStats),
      detailedStats: this.generateDetailedStats(questionStats)
    };
  }

  /**
   * 生成学习建议
   * @param {Array} questionStats - 题目统计列表
   * @returns {Array} 建议列表
   */
  generateRecommendations(questionStats) {
    const recommendations = [];
    
    const highErrorQuestions = questionStats.filter(stat => stat.errorRate >= 75);
    if (highErrorQuestions.length > 0) {
      recommendations.push(`重点关注${highErrorQuestions.length}道高错误率题目`);
    }
    
    const categories = {};
    questionStats.forEach(stat => {
      const category = stat.question.category;
      if (!categories[category]) {
        categories[category] = { total: 0, errors: 0 };
      }
      categories[category].total++;
      if (stat.errorRate >= 50) {
        categories[category].errors++;
      }
    });
    
    Object.entries(categories).forEach(([category, stats]) => {
      const errorRate = (stats.errors / stats.total) * 100;
      if (errorRate >= 50) {
        recommendations.push(`加强${category}专项练习`);
      }
    });
    
    return recommendations;
  }

  /**
   * 生成详细统计
   * @param {Array} questionStats - 题目统计列表
   * @returns {Object} 详细统计数据
   */
  generateDetailedStats(questionStats) {
    const stats = {
      byErrorRate: {
        high: 0,    // 75%以上
        medium: 0,  // 50-75%
        low: 0      // 50%以下
      },
      byCategory: {},
      totalVariants: 0
    };
    
    questionStats.forEach(stat => {
      // 按错误率分类
      if (stat.errorRate >= 75) {
        stats.byErrorRate.high++;
      } else if (stat.errorRate >= 50) {
        stats.byErrorRate.medium++;
      } else {
        stats.byErrorRate.low++;
      }
      
      // 按语法点分类
      const category = stat.question.category;
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = { total: 0, errors: 0 };
      }
      stats.byCategory[category].total++;
      if (stat.errorRate >= 50) {
        stats.byCategory[category].errors++;
      }
      
      // 统计变式题数量
      if (stat.variants) {
        stats.totalVariants += stat.variants.length;
      }
    });
    
    return stats;
  }

  /**
   * 获取模板配置
   * @param {string} format - 格式类型
   * @returns {Object} 模板配置
   */
  getTemplate(format) {
    return this.templates[format] || this.templates.word;
  }

  /**
   * 验证导出内容
   * @param {Array} questionStats - 题目统计列表
   * @returns {Object} 验证结果
   */
  validateExportContent(questionStats) {
    const result = {
      valid: true,
      issues: []
    };
    
    if (!questionStats || questionStats.length === 0) {
      result.valid = false;
      result.issues.push('没有题目数据');
      return result;
    }
    
    questionStats.forEach((stat, index) => {
      if (!stat.question) {
        result.issues.push(`第${index + 1}题缺少题目信息`);
      }
      
      if (stat.errorRate < 0 || stat.errorRate > 100) {
        result.issues.push(`第${index + 1}题错误率数据异常`);
      }
    });
    
    if (result.issues.length > 0) {
      result.valid = false;
    }
    
    return result;
  }
}

module.exports = ExportLogic;
