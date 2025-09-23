// 专项练习进度管理云函数
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, userId, grammarType, progress, errorCount, testType, score, fromModule } = event
  
  try {
    switch (action) {
      case 'save':
        return await saveProgress(userId, grammarType, progress, errorCount)
      case 'get':
        return await getProgress(userId, grammarType)
      case 'getAll':
        return await getAllProgress(userId)
      case 'getPracticeTables':
        return await getPracticeTables()
      case 'saveTestRecord':
        return await saveTestRecord(testType, score, fromModule)
      default:
        return {
          code: 400,
          message: '无效的操作类型'
        }
    }
  } catch (error) {
    console.error('专项练习进度管理错误:', error)
    return {
      code: 500,
      message: '服务器内部错误',
      error: error.message
    }
  }
}

// 保存练习进度
async function saveProgress(userId, grammarType, progress, errorCount) {
  try {
    const collection = db.collection('practice_progress')
    
    // 检查是否已存在该用户的该语法点进度记录
    const existingRecord = await collection.where({
      userId: userId,
      grammarType: grammarType
    }).get()
    
    if (existingRecord.data.length > 0) {
      // 更新现有记录
      await collection.doc(existingRecord.data[0]._id).update({
        data: {
          progress: progress,
          errorCount: errorCount || existingRecord.data[0].errorCount,
          updateTime: new Date()
        }
      })
    } else {
      // 创建新记录
      await collection.add({
        data: {
          userId: userId,
          grammarType: grammarType,
          progress: progress,
          errorCount: errorCount || 0,
          createTime: new Date(),
          updateTime: new Date()
        }
      })
    }
    
    return {
      code: 200,
      message: '进度保存成功'
    }
  } catch (error) {
    console.error('保存进度失败:', error)
    throw error
  }
}

// 获取练习进度
async function getProgress(userId, grammarType) {
  try {
    const collection = db.collection('practice_progress')
    
    const result = await collection.where({
      userId: userId,
      grammarType: grammarType
    }).get()
    
    if (result.data.length > 0) {
      return {
        code: 200,
        data: {
          progress: result.data[0].progress,
          errorCount: result.data[0].errorCount
        }
      }
    } else {
      return {
        code: 200,
        data: {
          progress: 0,
          errorCount: 0
        }
      }
    }
  } catch (error) {
    console.error('获取进度失败:', error)
    throw error
  }
}

// 获取所有练习进度
async function getAllProgress(userId) {
  try {
    const collection = db.collection('practice_progress')
    
    const result = await collection.where({
      userId: userId
    }).get()
    
    return {
      code: 200,
      data: result.data
    }
  } catch (error) {
    console.error('获取所有进度失败:', error)
    throw error
  }
}

// 获取专项练习表格列表
async function getPracticeTables() {
  try {
    // 返回静态的专项练习表格数据
    const practiceTables = [
      {
        id: 1,
        type: "noun-plural",
        name: "名词变复数专项",
        tables: [
          { id: "noun_001", title: "一般情况加s练习", questions: 20 },
          { id: "noun_002", title: "特殊结尾加es练习", questions: 15 },
          { id: "noun_003", title: "后缀识别练习", questions: 16 },
          { id: "noun_004", title: "规则变复数练习", questions: 20 }
        ]
      },
      {
        id: 2,
        type: "verb-participle",
        name: "动词分词专项",
        tables: [
          { id: "present_participle_001", title: "现在分词练习", questions: 20 },
          { id: "past_participle_001", title: "过去分词练习", questions: 20 }
        ]
      },
      {
        id: 3,
        type: "pronoun",
        name: "代词专项",
        tables: [
          { id: "pronoun_001", title: "代词表格练习(顺序)", questions: 48 },
          { id: "pronoun_002", title: "代词表格练习(乱序)", questions: 48 }
        ]
      },
      {
        id: 4,
        type: "tense",
        name: "时态专项",
        tables: [
          { id: "tense_writing_001", title: "时态书写练习", questions: 40 },
          { id: "tense_signal_001", title: "时态信号词练习", questions: 20 }
        ]
      },
      {
        id: 5,
        type: "voice",
        name: "语态专项",
        tables: [
          { id: "voice_001", title: "语态基础练习", questions: 20 },
          { id: "voice_002", title: "语态进阶练习", questions: 20 }
        ]
      },
      {
        id: 6,
        type: "adjective",
        name: "形容词专项",
        tables: [
          { id: "adjective_001", title: "形容词基础练习", questions: 20 },
          { id: "comparative_001", title: "比较级练习", questions: 20 },
          { id: "superlative_001", title: "最高级练习", questions: 20 }
        ]
      },
      {
        id: 7,
        type: "adverb",
        name: "副词专项",
        tables: [
          { id: "adverb_001", title: "副词基础练习", questions: 20 },
          { id: "adverb_002", title: "副词进阶练习", questions: 20 }
        ]
      }
    ]
    
    return {
      code: 200,
      data: practiceTables
    }
  } catch (error) {
    console.error('获取练习表格失败:', error)
    throw error
  }
}

// 保存测试记录（新增功能）
async function saveTestRecord(testType, score, fromModule) {
  try {
    const collection = db.collection('user_progress')
    
    // 获取用户OpenID
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    
    if (!openid) {
      return {
        code: 401,
        message: '用户未登录'
      }
    }
    
    // 保存测试记录
    await collection.add({
      data: {
        userId: openid,
        testType: testType,
        score: score,
        module: testType === 'grammar' ? 'grammar' : 'writing',
        fromModule: fromModule || false,
        timestamp: new Date(),
        createTime: new Date()
      }
    })
    
    return {
      code: 200,
      message: '测试记录保存成功'
    }
  } catch (error) {
    console.error('保存测试记录失败:', error)
    throw error
  }
} 