// 语法分类服务
// 解决云数据库迁移后语法组合功能的分类映射问题

class GrammarCategoryService {
  constructor() {
    this.categoryMapping = null
    this.cacheExpiry = 0
    this.cacheDuration = 24 * 60 * 60 * 1000 // 24小时缓存
    this.isCloudAvailable = false
  }
  
  // 初始化服务
  async init() {
    try {
      // 测试云函数是否可用
      await this.testCloudFunction()
      this.isCloudAvailable = true
      console.log('[语法分类服务] 云服务初始化成功')
    } catch (error) {
      this.isCloudAvailable = false
      console.warn('[语法分类服务] 云服务不可用，将使用本地映射:', error.message)
    }
  }
  
  // 测试云函数可用性
  async testCloudFunction() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'grammarCategoryMapping',
        data: { action: 'getCategoryMapping' },
        success: (res) => {
          if (res.result && res.result.success) {
            resolve(res.result)
          } else {
            reject(new Error('云函数返回错误'))
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }
  
  // 获取分类映射（带缓存和降级）
  async getCategoryMapping() {
    // 如果缓存有效，直接返回
    if (this.categoryMapping && Date.now() < this.cacheExpiry) {
      return this.categoryMapping
    }
    
    // 尝试从云函数获取
    if (this.isCloudAvailable) {
      try {
        const result = await this.callCloudFunction('getCategoryMapping')
        if (result.success) {
          this.categoryMapping = result.data
          this.cacheExpiry = Date.now() + this.cacheDuration
          console.log('[语法分类服务] 从云服务获取分类映射成功')
          return this.categoryMapping
        }
      } catch (error) {
        console.warn('[语法分类服务] 云服务获取分类映射失败:', error.message)
        this.isCloudAvailable = false
      }
    }
    
    // 降级到本地映射
    console.log('[语法分类服务] 使用本地分类映射')
    return this.getLocalCategoryMapping()
  }
  
  // 本地映射（降级方案）
  getLocalCategoryMapping() {
    return {
      "介词": ["介词综合", "固定搭配", "介词 + 名词/动名词"],
      "代词": ["代词综合", "人称代词", "物主代词", "反身代词", "关系代词", "it相关"],
      "连词": ["并列连词综合", "从属连词综合", "连词与名/动/形/副综合", "连词与名词", "连词与动词", "连词与形容词"],
      "冠词": ["冠词综合", "泛指与特指", "a和an", "the的特殊用法"],
      "名词": ["名词综合", "复合词和外来词", "单复数同形", "不规则复数", "以o结尾", "以y结尾", "s/sh/ch/x结尾", "以f/fe结尾"],
      "动词": ["被动写be吗", "并列句与动词", "主从句与动词", "插入语与动词"],
      "谓语": ["谓语", "时态(一般过去时)", "时态(一般将来时)", "时态(过去将来时)", "时态(现在进行时)", "时态(过去进行时)", "时态(现在完成时)", "时态(过去完成时)", "语态(被动+八大时态)"],
      "非谓语": ["现在分词综合", "过去分词综合", "不定式综合"],
      "形容词": ["形容词综合", "比较级", "最高级"],
      "副词": ["副词综合", "副词修饰动词", "副词修饰句子", "副词修饰形容词/副词"],
      "定语从句": ["定语从句综合", "that能填吗", "who和which选哪个", "whose", "which和when/where混淆"],
      "状语和从句": ["状语从句综合", "when", "where", "how", "why"]
    }
  }
  
  // 根据分类获取语法点
  async getGrammarPointsByCategory(category) {
    if (!category) {
      console.warn('[语法分类服务] 分类参数为空')
      return []
    }
    
    const mapping = await this.getCategoryMapping()
    const subPoints = mapping[category] || []
    
    console.log(`[语法分类服务] 获取分类 ${category} 的子点:`, subPoints)
    return subPoints
  }
  
  // 验证语法点是否存在
  async validateGrammarPoint(grammarPoint) {
    if (!grammarPoint) {
      return false
    }
    
    // 尝试从云服务验证
    if (this.isCloudAvailable) {
      try {
        const result = await this.callCloudFunction('validateGrammarPoint', { category: grammarPoint })
        if (result.success) {
          return result.data.isValid
        }
      } catch (error) {
        console.warn('[语法分类服务] 云服务验证语法点失败:', error.message)
      }
    }
    
    // 降级到本地验证
    const mapping = await this.getCategoryMapping()
    const allPoints = Object.values(mapping).flat()
    return allPoints.includes(grammarPoint)
  }
  
  // 获取系统组合语法点
  async getSystemComboGrammarPoints() {
    const mapping = await this.getCategoryMapping()
    const systemComboRules = {
      "介词": 1,
      "代词": 1,
      "连词": 1,
      "冠词": 1,
      "名词": 1,
      "动词": 1,
      "谓语": 1,
      "非谓语": 1,
      "形容词": 1,
      "副词": 1
    }
    
    const selectedGrammarPoints = []
    const categoryStats = {}
    
    // 根据系统组合规则选择语法点
    Object.keys(systemComboRules).forEach(category => {
      const subPoints = mapping[category] || []
      if (subPoints.length > 0) {
        // 随机选择一个子点
        const randomPoint = subPoints[Math.floor(Math.random() * subPoints.length)]
        selectedGrammarPoints.push(randomPoint)
        categoryStats[category] = randomPoint
      }
    })
    
    // 如果选择的语法点不足10个，从其他分类补充
    while (selectedGrammarPoints.length < 10) {
      const allCategories = Object.keys(mapping)
      const unusedCategories = allCategories.filter(cat => !categoryStats[cat])
      
      if (unusedCategories.length === 0) break
      
      const randomCategory = unusedCategories[Math.floor(Math.random() * unusedCategories.length)]
      const subPoints = mapping[randomCategory] || []
      
      if (subPoints.length > 0) {
        const randomPoint = subPoints[Math.floor(Math.random() * subPoints.length)]
        selectedGrammarPoints.push(randomPoint)
        categoryStats[randomCategory] = randomPoint
      }
    }
    
    return {
      selectedGrammarPoints,
      categoryStats,
      systemComboRules
    }
  }
  
  // 调用云函数（统一接口）
  async callCloudFunction(action, data = {}) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'grammarCategoryMapping',
        data: { action, ...data },
        success: (res) => {
          if (res.result) {
            resolve(res.result)
          } else {
            reject(new Error('云函数返回空结果'))
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }
  
  // 获取所有分类
  async getAllCategories() {
    const mapping = await this.getCategoryMapping()
    return Object.keys(mapping)
  }
  
  // 获取分类统计信息
  async getCategoryStats() {
    if (this.isCloudAvailable) {
      try {
        const result = await this.callCloudFunction('getAllCategories')
        if (result.success) {
          return result.stats || []
        }
      } catch (error) {
        console.warn('[语法分类服务] 获取分类统计失败:', error.message)
      }
    }
    
    // 降级到本地统计
    const mapping = await this.getCategoryMapping()
    return Object.keys(mapping).map(category => ({
      category,
      subPointsCount: mapping[category].length,
      totalQuestions: 0 // 本地无法获取准确数量
    }))
  }
  
  // 清除缓存
  clearCache() {
    this.categoryMapping = null
    this.cacheExpiry = 0
    console.log('[语法分类服务] 缓存已清除')
  }
  
  // 重新初始化
  async reinit() {
    this.clearCache()
    this.isCloudAvailable = false
    await this.init()
  }
  
  // 获取服务状态
  getStatus() {
    return {
      isCloudAvailable: this.isCloudAvailable,
      hasCache: this.categoryMapping !== null,
      cacheExpiry: this.cacheExpiry,
      cacheValid: Date.now() < this.cacheExpiry
    }
  }
}

// 创建单例实例
const grammarCategoryService = new GrammarCategoryService()

module.exports = grammarCategoryService
