// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, category, type, limit = 10, offset = 0, grammarPoints = [] } = event
  
  try {
    switch (action) {
      case 'getQuestionsByCategory':
        return await getQuestionsByCategory(category, type, limit, offset)
      case 'getQuestionsByGrammarPoints':
        return await getQuestionsByGrammarPoints(grammarPoints, limit, offset)
      case 'getSystemComboQuestions':
        return await getSystemComboQuestions(limit)
      case 'getCategories':
        return await getCategories()
      case 'getQuestionCount':
        return await getQuestionCount(category, type)
      case 'getByType':
        return await getByType(type, limit, offset)
      case 'getNotes':
        return await getByType('note', limit, offset)
      case 'getTables':
        return await getByType('table', limit, offset)
      default:
        return {
          success: false,
          error: 'Invalid action',
          supportedActions: [
            'getQuestionsByCategory',
            'getQuestionsByGrammarPoints',
            'getSystemComboQuestions',
            'getCategories',
            'getQuestionCount',
            'getByType',
            'getNotes',
            'getTables'
          ]
        }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// 按分类获取题目
async function getQuestionsByCategory(category, type, limit, offset) {
  const collection = db.collection('questions')
  
  let query = collection
  const whereCondition = {}
  
  if (category && category !== 'all') {
    whereCondition.category = category
  }
  
  if (type && type !== 'all') {
    whereCondition.type = type
  }
  
  if (Object.keys(whereCondition).length > 0) {
    query = query.where(whereCondition)
  }
  
  const result = await query
    .skip(offset)
    .limit(limit)
    .get()
  
  return {
    success: true,
    data: result.data,
    total: result.data.length
  }
}

// 获取所有分类
async function getCategories() {
  const collection = db.collection('questions')
  
  const result = await collection
    .aggregate()
    .group({
      _id: '$category',
      count: db.command.aggregate.sum(1)
    })
    .end()
  
  return {
    success: true,
    data: result.list.map(item => ({
      category: item._id,
      count: item.count
    }))
  }
}

// 获取题目数量
async function getQuestionCount(category, type) {
  const collection = db.collection('questions')
  
  let query = collection
  const whereCondition = {}
  
  if (category && category !== 'all') {
    whereCondition.category = category
  }
  
  if (type && type !== 'all') {
    whereCondition.type = type
  }
  
  if (Object.keys(whereCondition).length > 0) {
    query = query.where(whereCondition)
  }
  
  const result = await query.count()
  
  return {
    success: true,
    count: result.total
  }
}

// 根据语法点列表获取题目（用于系统组合）
async function getQuestionsByGrammarPoints(grammarPoints, limit, offset) {
  if (!grammarPoints || grammarPoints.length === 0) {
    return {
      success: false,
      error: 'Grammar points array is required'
    }
  }
  
  const collection = db.collection('questions')
  
  const result = await collection
    .where({
      category: db.command.in(grammarPoints)
    })
    .skip(offset)
    .limit(limit)
    .get()
  
  return {
    success: true,
    data: result.data,
    total: result.data.length,
    grammarPoints: grammarPoints
  }
}

// 生成系统组合题目
async function getSystemComboQuestions(limit = 10) {
  try {
    // 调用分类映射云函数获取系统组合规则
    const categoryMappingResult = await cloud.callFunction({
      name: 'grammarCategoryMapping',
      data: { action: 'getCategoryMapping' }
    })
    
    if (!categoryMappingResult.result.success) {
      throw new Error('获取分类映射失败')
    }
    
    const categoryMapping = categoryMappingResult.result.data
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
      const subPoints = categoryMapping[category] || []
      if (subPoints.length > 0) {
        // 随机选择一个子点
        const randomPoint = subPoints[Math.floor(Math.random() * subPoints.length)]
        selectedGrammarPoints.push(randomPoint)
        categoryStats[category] = randomPoint
      }
    })
    
    // 如果选择的语法点不足10个，从其他分类补充
    while (selectedGrammarPoints.length < 10) {
      const allCategories = Object.keys(categoryMapping)
      const unusedCategories = allCategories.filter(cat => !categoryStats[cat])
      
      if (unusedCategories.length === 0) break
      
      const randomCategory = unusedCategories[Math.floor(Math.random() * unusedCategories.length)]
      const subPoints = categoryMapping[randomCategory] || []
      
      if (subPoints.length > 0) {
        const randomPoint = subPoints[Math.floor(Math.random() * subPoints.length)]
        selectedGrammarPoints.push(randomPoint)
        categoryStats[randomCategory] = randomPoint
      }
    }
    
    // 获取对应的题目
    const questionsResult = await getQuestionsByGrammarPoints(selectedGrammarPoints, limit, 0)
    
    return {
      success: true,
      data: questionsResult.data,
      total: questionsResult.total,
      selectedGrammarPoints: selectedGrammarPoints,
      categoryStats: categoryStats,
      systemComboRules: systemComboRules
    }
    
  } catch (error) {
    console.error('生成系统组合题目失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 按类型获取数据
async function getByType(type, limit, offset) {
  const collection = db.collection('questions')
  
  const result = await collection
    .where({
      type: type
    })
    .skip(offset)
    .limit(limit)
    .get()
  
  return {
    success: true,
    data: result.data,
    total: result.data.length
  }
}
