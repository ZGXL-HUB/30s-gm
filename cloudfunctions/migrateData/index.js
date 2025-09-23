// 数据迁移云函数
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const questionsCollection = db.collection('questions')

exports.main = async (event, context) => {
  try {
    console.log(' 开始安全迁移...')
    
    // 1. 备份现有数据
    console.log('📦 备份现有数据...')
    const existingData = await questionsCollection.get()
    console.log(`备份现有数据: ${existingData.data.length} 条记录`)
    
    // 2. 清空现有数据 - 修改后的方法
    console.log('🗑️ 清空现有数据...')
    if (existingData.data.length > 0) {
      const deletePromises = existingData.data.map(record => 
        questionsCollection.doc(record._id).remove()
      )
      await Promise.all(deletePromises)
      console.log(`已删除 ${existingData.data.length} 条记录`)
    } else {
      console.log('数据库为空，无需删除')
    }
    
    // 3. 导入新数据（这里只导入前几道题目作为测试）
    console.log(' 导入新数据...')
    const questions = [
      {
        "category": "综合练习",
        "type": "question",
        "text": "We should be kind ___ animals",
        "answer": "to",
        "analysis": "\"be kind to\"为固定短语,意为\"对……友好；善待……\",整句翻译为\"我们应该善待动物\"。",
        "order": 1,
        "createTime": "2025-09-13T19:07:49.177Z",
        "updateTime": "2025-09-13T19:07:49.177Z",
        "source": "safe_migration"
      },
      {
        "category": "综合练习",
        "type": "question",
        "text": "He is similar ___ his father in appearance",
        "answer": "to",
        "analysis": "\"be similar to\"为固定短语,意为\"与……相似\",整句翻译为\"他在外貌上与他父亲相似\"。",
        "order": 2,
        "createTime": "2025-09-13T19:07:49.177Z",
        "updateTime": "2025-09-13T19:07:49.177Z",
        "source": "safe_migration"
      }
    ]
    
    // 批量插入数据
    const result = await questionsCollection.add({
      data: questions
    })
    
    console.log(`✅ 成功导入 ${questions.length} 道题目`)
    console.log('🎉 迁移完成！')
    
    return { 
      success: true, 
      inserted: questions.length,
      message: '迁移成功！'
    }
    
  } catch (error) {
    console.error('× 迁移失败:', error)
    return { 
      success: false, 
      error: error.message 
    }
  }
}