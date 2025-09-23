// 添加管理员脚本
// 在微信开发者工具控制台运行

// 你的 OpenID
const YOUR_OPENID = 'o3TSs7c2SISOeO1b4mi0SEEQ1QaY';

// 添加管理员到数据库
async function addAdminToDatabase() {
  try {
    console.log('🔄 开始添加管理员...');
    console.log('📝 OpenID:', YOUR_OPENID);
    
    // 调用 adminAuth 云函数添加管理员
    const result = await wx.cloud.callFunction({
      name: 'adminAuth',
      data: {
        action: 'addAdmin',
        data: {
          openid: YOUR_OPENID,
          name: '主管理员' // 你可以修改这个名称
        }
      }
    });
    
    console.log('📊 云函数返回结果:', result);
    
    if (result.result.success) {
      console.log('✅ 管理员添加成功！');
      console.log('🎉 你现在拥有管理员权限了');
    } else {
      console.error('❌ 添加失败:', result.result.message);
      
      // 如果是权限问题，可能需要手动初始化第一个管理员
      if (result.result.message.includes('无权限')) {
        console.log('💡 提示：这可能是第一个管理员，需要手动初始化');
        console.log('🔧 请使用下面的手动初始化脚本');
      }
    }
    
  } catch (error) {
    console.error('❌ 调用云函数失败:', error);
  }
}

// 手动初始化第一个管理员（如果上面的方法失败）
async function initializeFirstAdmin() {
  try {
    console.log('🔄 手动初始化第一个管理员...');
    
    // 直接操作数据库添加管理员
    const db = wx.cloud.database();
    const adminCollection = db.collection('admins');
    
    const result = await adminCollection.add({
      data: {
        openid: YOUR_OPENID,
        name: '主管理员',
        createTime: db.serverDate(),
        isFirstAdmin: true
      }
    });
    
    console.log('✅ 第一个管理员初始化成功！');
    console.log('📊 数据库结果:', result);
    
  } catch (error) {
    console.error('❌ 初始化失败:', error);
  }
}

// 检查当前用户是否为管理员
async function checkAdminStatus() {
  try {
    console.log('🔍 检查管理员状态...');
    
    const result = await wx.cloud.callFunction({
      name: 'adminAuth',
      data: {
        action: 'checkAdmin'
      }
    });
    
    console.log('📊 检查结果:', result);
    
    if (result.result.success) {
      if (result.result.isAdmin) {
        console.log('✅ 你是管理员！');
      } else {
        console.log('❌ 你不是管理员');
      }
    } else {
      console.error('❌ 检查失败:', result.result.message);
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
}

// 运行脚本
console.log('🚀 管理员设置脚本');
console.log('📝 你的 OpenID:', YOUR_OPENID);
console.log('');
console.log('📋 可用的函数：');
console.log('1. addAdminToDatabase() - 添加管理员');
console.log('2. initializeFirstAdmin() - 手动初始化第一个管理员');
console.log('3. checkAdminStatus() - 检查管理员状态');
console.log('');
console.log('💡 建议先运行 checkAdminStatus() 检查当前状态');
