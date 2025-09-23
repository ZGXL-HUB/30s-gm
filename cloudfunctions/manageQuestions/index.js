// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
const questionsCollection = db.collection('questions')

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data } = event

  switch (action) {
    case 'add':
      return await addQuestions(data)
    case 'get':
      return await getQuestions(data)
    case 'update':
      return await updateQuestions(data)
    case 'delete':
      return await deleteQuestions(data)
    case 'getAllCategories':
      return await getAllCategories()
    default:
      return {
        success: false,
        message: '未知的操作类型'
      }
  }
}

// 获取所有分类
async function getAllCategories() {
  try {
    // 使用distinct获取唯一的分类列表
    const result = await questionsCollection.aggregate()
      .group({
        _id: '$category'
      })
      .end()
    
    const categories = result.list.map(item => item._id).filter(category => category)
    
    return {
      success: true,
      data: categories
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

// 添加题目
async function addQuestions(data) {
  try {
    const result = await questionsCollection.add({
      data: {
        category: data.category,
        questions: data.questions,
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        source: data.source || 'cloud'
      }
    })
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

// 获取题目
async function getQuestions(data) {
  try {
    const { category, source } = data || {}
    const query = {}
    
    if (category) {
      query.category = category
    }
    
    if (source) {
      query.source = source
    }
    
    const result = await questionsCollection.where(query).get()
    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

// 更新题目
async function updateQuestions(data) {
  try {
    const { _id, category, questions, source } = data
    const result = await questionsCollection.doc(_id).update({
      data: {
        category,
        questions,
        source,
        updateTime: db.serverDate()
      }
    })
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

// 删除题目
async function deleteQuestions(data) {
  try {
    const { _id } = data
    const result = await questionsCollection.doc(_id).remove()
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
} 