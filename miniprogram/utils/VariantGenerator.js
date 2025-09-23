// 变式题生成器工具类
class VariantGenerator {
  constructor() {
    this.similarityWeights = {
      category: 50,    // 语法点匹配权重
      difficulty: 30,  // 难度匹配权重
      type: 20         // 题型匹配权重
    };
  }

  /**
   * 生成变式题
   * @param {Object} originalQuestion - 原题目
   * @param {number} variantCount - 变式题数量
   * @param {Array} allQuestions - 所有题目列表
   * @returns {Array} 变式题列表
   */
  async generateVariants(originalQuestion, variantCount, allQuestions = []) {
    try {
      // 如果提供了题目列表，直接使用
      if (allQuestions.length > 0) {
        return this.generateFromQuestionList(originalQuestion, variantCount, allQuestions);
      }
      
      // 否则从云数据库获取同分类题目
      const sameCategoryQuestions = await this.getQuestionsByCategory(originalQuestion.category);
      return this.generateFromQuestionList(originalQuestion, variantCount, sameCategoryQuestions);
      
    } catch (error) {
      console.error('生成变式题失败:', error);
      return [];
    }
  }

  /**
   * 从题目列表中生成变式题
   * @param {Object} originalQuestion - 原题目
   * @param {number} variantCount - 变式题数量
   * @param {Array} questionList - 题目列表
   * @returns {Array} 变式题列表
   */
  generateFromQuestionList(originalQuestion, variantCount, questionList) {
    // 排除原题目
    const candidates = questionList.filter(q => q._id !== originalQuestion._id);
    
    if (candidates.length === 0) {
      return [];
    }
    
    // 计算相似度并排序
    const scoredCandidates = candidates.map(question => ({
      question: question,
      similarity: this.calculateSimilarity(originalQuestion, question)
    })).sort((a, b) => b.similarity - a.similarity);
    
    // 选择最相似的题目作为变式题
    const variants = scoredCandidates.slice(0, variantCount).map(item => item.question);
    
    // 如果变式题数量不足，随机补充
    if (variants.length < variantCount) {
      const remainingCount = variantCount - variants.length;
      const usedIds = variants.map(v => v._id);
      const remainingCandidates = candidates.filter(q => !usedIds.includes(q._id));
      
      // 随机选择剩余题目
      const shuffled = remainingCandidates.sort(() => Math.random() - 0.5);
      variants.push(...shuffled.slice(0, remainingCount));
    }
    
    return variants;
  }

  /**
   * 计算题目相似度
   * @param {Object} question1 - 题目1
   * @param {Object} question2 - 题目2
   * @returns {number} 相似度分数
   */
  calculateSimilarity(question1, question2) {
    let score = 0;
    
    // 语法点匹配（权重最高）
    if (question1.category === question2.category) {
      score += this.similarityWeights.category;
    }
    
    // 难度匹配
    if (question1.difficulty === question2.difficulty) {
      score += this.similarityWeights.difficulty;
    }
    
    // 题型匹配
    if (question1.type === question2.type) {
      score += this.similarityWeights.type;
    }
    
    // 文本相似度（简单实现）
    const textSimilarity = this.calculateTextSimilarity(
      question1.question || question1.text,
      question2.question || question2.text
    );
    score += textSimilarity * 10; // 文本相似度权重
    
    return score;
  }

  /**
   * 计算文本相似度（简单实现）
   * @param {string} text1 - 文本1
   * @param {string} text2 - 文本2
   * @returns {number} 相似度分数
   */
  calculateTextSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  }

  /**
   * 从云数据库获取同分类题目
   * @param {string} category - 语法点分类
   * @returns {Array} 题目列表
   */
  async getQuestionsByCategory(category) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'getQuestionsData',
        data: {
          type: 'questions',
          category: category,
          limit: 100
        }
      });
      
      if (result.result.success) {
        return result.result.data;
      }
      
      return [];
    } catch (error) {
      console.error('获取同分类题目失败:', error);
      return [];
    }
  }

  /**
   * 根据错误率获取变式题数量
   * @param {number} errorRate - 错误率
   * @param {Object} rules - 变式题规则
   * @returns {number} 变式题数量
   */
  getVariantCountByErrorRate(errorRate, rules) {
    if (errorRate >= 75) {
      return rules["75"] || 5;
    } else if (errorRate >= 50) {
      return rules["50"] || 4;
    } else if (errorRate >= 25) {
      return rules["25"] || 3;
    } else {
      return rules["0"] || 2;
    }
  }

  /**
   * 批量生成变式题
   * @param {Array} questionStats - 题目统计列表
   * @param {Object} variantRules - 变式题规则
   * @returns {Array} 包含变式题的题目统计列表
   */
  async batchGenerateVariants(questionStats, variantRules) {
    const results = [];
    
    for (const stat of questionStats) {
      const variantCount = this.getVariantCountByErrorRate(stat.errorRate, variantRules);
      
      if (variantCount > 0) {
        const variants = await this.generateVariants(stat.question, variantCount);
        results.push({
          ...stat,
          variants: variants
        });
      } else {
        results.push({
          ...stat,
          variants: []
        });
      }
    }
    
    return results;
  }

  /**
   * 验证变式题质量
   * @param {Object} originalQuestion - 原题目
   * @param {Array} variants - 变式题列表
   * @returns {Object} 质量评估结果
   */
  validateVariants(originalQuestion, variants) {
    const quality = {
      totalVariants: variants.length,
      validVariants: 0,
      averageSimilarity: 0,
      issues: []
    };
    
    if (variants.length === 0) {
      quality.issues.push('没有生成变式题');
      return quality;
    }
    
    let totalSimilarity = 0;
    
    variants.forEach((variant, index) => {
      const similarity = this.calculateSimilarity(originalQuestion, variant);
      totalSimilarity += similarity;
      
      if (similarity > 30) { // 相似度阈值
        quality.validVariants++;
      } else {
        quality.issues.push(`变式题${index + 1}相似度过低`);
      }
    });
    
    quality.averageSimilarity = totalSimilarity / variants.length;
    
    return quality;
  }
}

module.exports = VariantGenerator;
