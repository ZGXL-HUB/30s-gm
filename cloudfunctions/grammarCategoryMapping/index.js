// 语法点分类映射云函数
// 解决语法组合功能的前后端分类映射问题

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 语法点分类映射表（保持与本地一致）
const CATEGORY_MAPPING = {
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

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, category } = event
  
  try {
    switch (action) {
      case 'getCategoryMapping':
        return await getCategoryMapping()
      
      case 'getSubPointsByCategory':
        return await getSubPointsByCategory(category)
      
      case 'getAllCategories':
        return await getAllCategories()
      
      case 'validateGrammarPoint':
        return await validateGrammarPoint(category)
      
      case 'getSystemComboRules':
        return await getSystemComboRules()
      
      case 'validateSystemCombo':
        return await validateSystemCombo()
      
      default:
        return {
          success: false,
          error: 'Invalid action',
          supportedActions: [
            'getCategoryMapping',
            'getSubPointsByCategory', 
            'getAllCategories',
            'validateGrammarPoint',
            'getSystemComboRules',
            'validateSystemCombo'
          ]
        }
    }
  } catch (error) {
    console.error('语法分类映射云函数错误:', error)
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
}

// 获取完整的分类映射表
async function getCategoryMapping() {
  return {
    success: true,
    data: CATEGORY_MAPPING,
    total: Object.keys(CATEGORY_MAPPING).length
  }
}

// 根据分类获取子点列表
async function getSubPointsByCategory(category) {
  if (!category) {
    return {
      success: false,
      error: 'Category parameter is required'
    }
  }
  
  const subPoints = CATEGORY_MAPPING[category] || []
  
  // 验证每个子点是否在云数据库中存在
  const validSubPoints = []
  for (const subPoint of subPoints) {
    try {
      const count = await db.collection('questions')
        .where({ category: subPoint })
        .count()
      
      if (count.total > 0) {
        validSubPoints.push(subPoint)
      }
    } catch (error) {
      console.warn(`验证语法点 ${subPoint} 时出错:`, error.message)
      // 如果验证失败，仍然包含该语法点（降级策略）
      validSubPoints.push(subPoint)
    }
  }
  
  return {
    success: true,
    data: validSubPoints,
    category: category,
    total: validSubPoints.length,
    allSubPoints: subPoints,
    invalidSubPoints: subPoints.filter(p => !validSubPoints.includes(p))
  }
}

// 获取所有分类
async function getAllCategories() {
  const categories = Object.keys(CATEGORY_MAPPING)
  
  // 统计每个分类下的题目数量
  const categoryStats = []
  for (const category of categories) {
    const subPoints = CATEGORY_MAPPING[category]
    let totalQuestions = 0
    
    for (const subPoint of subPoints) {
      try {
        const count = await db.collection('questions')
          .where({ category: subPoint })
          .count()
        totalQuestions += count.total
      } catch (error) {
        console.warn(`统计分类 ${category} 的 ${subPoint} 题目数量时出错:`, error.message)
      }
    }
    
    categoryStats.push({
      category: category,
      subPointsCount: subPoints.length,
      totalQuestions: totalQuestions
    })
  }
  
  return {
    success: true,
    data: categories,
    stats: categoryStats,
    total: categories.length
  }
}

// 验证语法点是否存在
async function validateGrammarPoint(grammarPoint) {
  if (!grammarPoint) {
    return {
      success: false,
      error: 'Grammar point parameter is required'
    }
  }
  
  // 检查是否在映射表中
  const allSubPoints = Object.values(CATEGORY_MAPPING).flat()
  const isInMapping = allSubPoints.includes(grammarPoint)
  
  // 检查是否在云数据库中存在
  let existsInDatabase = false
  let questionCount = 0
  
  try {
    const count = await db.collection('questions')
      .where({ category: grammarPoint })
      .count()
    existsInDatabase = count.total > 0
    questionCount = count.total
  } catch (error) {
    console.warn(`验证语法点 ${grammarPoint} 在数据库中的存在性时出错:`, error.message)
  }
  
  return {
    success: true,
    data: {
      grammarPoint: grammarPoint,
      isValid: isInMapping && existsInDatabase,
      isInMapping: isInMapping,
      existsInDatabase: existsInDatabase,
      questionCount: questionCount
    }
  }
}

// 获取系统组合规则
async function getSystemComboRules() {
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
  
  // 验证每个分类是否有可用的语法点
  const validatedRules = {}
  for (const [category, count] of Object.entries(systemComboRules)) {
    const subPoints = CATEGORY_MAPPING[category] || []
    let availableSubPoints = 0
    
    for (const subPoint of subPoints) {
      try {
        const questionCount = await db.collection('questions')
          .where({ category: subPoint })
          .count()
        if (questionCount.total > 0) {
          availableSubPoints++
        }
      } catch (error) {
        console.warn(`验证系统组合规则时出错:`, error.message)
      }
    }
    
    if (availableSubPoints > 0) {
      validatedRules[category] = count
    }
  }
  
  return {
    success: true,
    data: {
      rules: validatedRules,
      originalRules: systemComboRules,
      totalCategories: Object.keys(validatedRules).length
    }
  }
}

// 验证系统组合功能
async function validateSystemCombo() {
  const validation = {
    categoryMappingValid: false,
    systemComboValid: false,
    databaseConnection: false,
    issues: []
  }
  
  try {
    // 1. 验证分类映射
    if (Object.keys(CATEGORY_MAPPING).length > 0) {
      validation.categoryMappingValid = true
    } else {
      validation.issues.push('分类映射表为空')
    }
    
    // 2. 验证数据库连接
    try {
      await db.collection('questions').limit(1).get()
      validation.databaseConnection = true
    } catch (error) {
      validation.issues.push(`数据库连接失败: ${error.message}`)
    }
    
    // 3. 验证系统组合规则
    const rulesResult = await getSystemComboRules()
    if (rulesResult.success && rulesResult.data.totalCategories > 0) {
      validation.systemComboValid = true
    } else {
      validation.issues.push('系统组合规则验证失败')
    }
    
    // 4. 统计总体情况
    const totalSubPoints = Object.values(CATEGORY_MAPPING).flat().length
    let validSubPoints = 0
    
    for (const subPoint of Object.values(CATEGORY_MAPPING).flat()) {
      try {
        const count = await db.collection('questions')
          .where({ category: subPoint })
          .count()
        if (count.total > 0) {
          validSubPoints++
        }
      } catch (error) {
        // 忽略单个语法点的验证错误
      }
    }
    
    validation.totalSubPoints = totalSubPoints
    validation.validSubPoints = validSubPoints
    validation.coverage = totalSubPoints > 0 ? (validSubPoints / totalSubPoints * 100).toFixed(2) : 0
    
  } catch (error) {
    validation.issues.push(`验证过程出错: ${error.message}`)
  }
  
  return {
    success: true,
    data: validation
  }
}
