// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const adminCollection = db.collection('admins')

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data } = event || {}
  const wxContext = cloud.getWXContext()
  const OPENID = wxContext.OPENID

  switch (action) {
    case 'checkAdmin':
      return await checkAdmin(OPENID)
    case 'addAdmin':
      return await addAdmin(data, OPENID)
    case 'removeAdmin':
      return await removeAdmin(data, OPENID)
    default:
      return {
        success: false,
        message: '未知的操作类型'
      }
  }
}

// 检查是否为管理员
async function checkAdmin(openid) {
  if (!openid) {
    return {
      success: false,
      message: '无法获取用户身份'
    }
  }

  try {
    const result = await adminCollection.where({
      openid: openid
    }).get()
    
    return {
      success: true,
      isAdmin: result.data.length > 0
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

// 添加管理员
async function addAdmin(data, operatorOpenid) {
  if (!operatorOpenid || !data || !data.openid) {
    return {
      success: false,
      message: '参数不完整'
    }
  }

  try {
    // 检查操作者是否为管理员
    const operator = await adminCollection.where({
      openid: operatorOpenid
    }).get()
    
    if (operator.data.length === 0) {
      return {
        success: false,
        message: '无权限执行此操作'
      }
    }

    // 添加新管理员
    const result = await adminCollection.add({
      data: {
        openid: data.openid,
        name: data.name || '管理员',
        createTime: db.serverDate()
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

// 移除管理员
async function removeAdmin(data, operatorOpenid) {
  if (!operatorOpenid || !data || !data.openid) {
    return {
      success: false,
      message: '参数不完整'
    }
  }

  try {
    // 检查操作者是否为管理员
    const operator = await adminCollection.where({
      openid: operatorOpenid
    }).get()
    
    if (operator.data.length === 0) {
      return {
        success: false,
        message: '无权限执行此操作'
      }
    }

    // 移除管理员
    const result = await adminCollection.where({
      openid: data.openid
    }).remove()

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