// 验证AppID和云环境配置脚本
// 复制到微信开发者工具控制台运行

(function() {
  console.log('🔍 验证AppID和云环境配置...');
  
  // 1. 检查配置文件中的设置
  console.log('1️⃣ 配置文件设置:');
  console.log('  - 项目AppID: wx0aabac4fe3b9cca7');
  console.log('  - 云环境ID: cloud1-4gyu3i1id5f4e2fa');
  
  // 2. 检查当前小程序实际使用的AppID
  console.log('2️⃣ 当前小程序AppID:');
  try {
    const accountInfo = wx.getAccountInfoSync();
    console.log('  - 小程序AppID:', accountInfo.miniProgram.appId);
    console.log('  - 环境:', accountInfo.miniProgram.envVersion);
    console.log('  - 版本:', accountInfo.miniProgram.version);
  } catch (error) {
    console.log('  - 获取账号信息失败:', error.message);
  }
  
  // 3. 检查云开发环境状态
  console.log('3️⃣ 云开发环境状态:');
  wx.cloud.callFunction({
    name: 'helloCloud',
    data: {}
  }).then(res => {
    console.log('  - 云函数调用成功');
    console.log('  - 返回的AppID:', res.result.appid);
    console.log('  - 用户OpenID:', res.result.openid);
    
    // 验证AppID匹配
    const configAppId = 'wx0aabac4fe3b9cca7';
    const cloudAppId = res.result.appid;
    
    if (configAppId === cloudAppId) {
      console.log('  - ✅ AppID匹配正确');
    } else {
      console.log('  - ❌ AppID不匹配');
      console.log('    - 配置文件AppID:', configAppId);
      console.log('    - 云环境AppID:', cloudAppId);
    }
    
  }).catch(err => {
    console.log('  - ❌ 云函数调用失败:', err.message);
    console.log('  - 错误代码:', err.errCode);
  });
  
  // 4. 测试云数据库连接
  console.log('4️⃣ 测试云数据库连接:');
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
  
  // 5. 检查云开发环境ID格式
  console.log('5️⃣ 检查云环境ID格式:');
  const envId = 'cloud1-4gyu3i1id5f4e2fa';
  const envIdPattern = /^cloud[0-9]-[a-z0-9]+$/;
  
  if (envIdPattern.test(envId)) {
    console.log('  - ✅ 云环境ID格式正确');
  } else {
    console.log('  - ❌ 云环境ID格式不正确');
  }
  
  console.log('  - 环境ID:', envId);
  console.log('  - 长度:', envId.length);
  
  // 6. 提供诊断建议
  console.log('6️⃣ 诊断建议:');
  console.log('  - 如果AppID不匹配，请检查项目配置');
  console.log('  - 如果云函数调用失败，可能需要重新部署云函数');
  console.log('  - 如果数据库连接失败，请检查云环境ID是否正确');
  console.log('  - 如果云环境ID格式不正确，请检查腾讯云控制台');
  
  console.log('🎯 验证完成！');
  
})();
