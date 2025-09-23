// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const questionsCollection = db.collection('questions')
const adminCollection = db.collection('admins')

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data } = event
  const { OPENID } = cloud.getWXContext()

  // 检查管理员权限
  const isAdmin = await checkAdmin(OPENID)
  if (!isAdmin) {
    return {
      success: false,
      message: '无权限执行此操作'
    }
  }

  switch (action) {
    case 'export':
      return await exportQuestions(data)
    case 'import':
      return await importQuestions(data)
    default:
      return {
        success: false,
        message: '未知的操作类型'
      }
  }
}

// 检查管理员权限
async function checkAdmin(openid) {
  try {
    const result = await adminCollection.where({
      openid: openid
    }).get()
    return result.data.length > 0
  } catch (error) {
    return false
  }
}

// 导出题目
async function exportQuestions(data) {
  try {
    const { category } = data
    const query = category ? { category } : {}
    
    const result = await questionsCollection.where(query).get()
    
    // 格式化导出数据
    const exportData = result.data.map(item => ({
      category: item.category,
      questions: item.questions,
      source: item.source
    }))

    return {
      success: true,
      data: exportData
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

// 导入题目
async function importQuestions(data) {
  try {
    const { questions } = data
    
    // 批量添加题目
    const tasks = questions.map(item => {
      return questionsCollection.add({
        data: {
          category: item.category,
          questions: item.questions,
          source: item.source || 'cloud',
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })
    })

    const results = await Promise.all(tasks)

    return {
      success: true,
      data: results
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
} 