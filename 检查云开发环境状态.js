// 检查云开发环境状态脚本
// 复制到微信开发者工具控制台运行

(function() {
  console.log('🔍 检查云开发环境状态...');
  
  // 1. 检查云开发初始化状态
  console.log('1️⃣ 云开发初始化状态:');
  try {
    const app = getApp();
    console.log('  - app.globalData.useCloud:', app.globalData.useCloud);
    console.log('  - app.globalData.userInfo:', app.globalData.userInfo);
  } catch (error) {
    console.log('  - 获取app状态失败:', error.message);
  }
  
  // 2. 检查wx.cloud对象
  console.log('2️⃣ wx.cloud对象状态:');
  console.log('  - wx.cloud存在:', !!wx.cloud);
  if (wx.cloud) {
    console.log('  - wx.cloud.database存在:', !!wx.cloud.database);
    console.log('  - wx.cloud.callFunction存在:', !!wx.cloud.callFunction);
    console.log('  - wx.cloud.init存在:', !!wx.cloud.init);
  }
  
  // 3. 测试云数据库连接
  console.log('3️⃣ 测试云数据库连接:');
  wx.cloud.database().collection('questions').limit(1).get()
    .then(res => {
      console.log('  - ✅ 数据库连接成功');
      console.log('  - 数据条数:', res.data.length);
      if (res.data.length > 0) {
        console.log('  - 样本数据ID:', res.data[0]._id);
      }
    })
    .catch(err => {
      console.log('  - ❌ 数据库连接失败:', err.message);
      console.log('  - 错误代码:', err.errCode);
    });
  
  // 4. 测试云函数调用
  console.log('4️⃣ 测试云函数调用:');
  wx.cloud.callFunction({
    name: 'helloCloud',
    data: {}
  }).then(res => {
    console.log('  - ✅ 云函数调用成功');
    console.log('  - 用户OpenID:', res.result.openid);
    console.log('  - 用户AppID:', res.result.appid);
  }).catch(err => {
    console.log('  - ❌ 云函数调用失败:', err.message);
    console.log('  - 错误代码:', err.errCode);
  });
  
  // 5. 检查本地存储
  console.log('5️⃣ 检查本地存储:');
  const userInfo = wx.getStorageSync('userInfo');
  console.log('  - 用户信息存在:', !!userInfo);
  if (userInfo) {
    console.log('  - 用户OpenID:', userInfo.openid);
    console.log('  - 是否匿名:', userInfo.isAnonymous);
  }
  
  console.log('🎯 检查完成！');
  
  // 6. 提供修复建议
  console.log('💡 修复建议:');
  console.log('1. 如果数据库连接失败，可能是环境ID问题');
  console.log('2. 如果云函数调用失败，可能需要重新部署云函数');
  console.log('3. 如果都是匿名用户，可能需要重新配置云开发环境');
  
})();
