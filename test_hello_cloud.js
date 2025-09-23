// 测试 helloCloud 云函数的脚本
// 在微信开发者工具控制台运行

// 测试云函数调用
async function testHelloCloud() {
  try {
    console.log('🔄 开始测试 helloCloud 云函数...');
    
    // 检查云开发是否可用
    if (!wx.cloud) {
      console.error('❌ 云开发不可用');
      return;
    }
    
    // 调用云函数
    const result = await wx.cloud.callFunction({
      name: 'helloCloud',
      data: {
        test: 'hello from test script'
      }
    });
    
    console.log('✅ 云函数调用成功！');
    console.log('📊 返回结果:', result);
    console.log('🆔 OpenID:', result.result.openid);
    console.log('📱 AppID:', result.result.appid);
    console.log('🔗 UnionID:', result.result.unionid);
    
    return result;
    
  } catch (error) {
    console.error('❌ 云函数调用失败:', error);
    console.error('错误详情:', error.errMsg);
    return null;
  }
}

// 检查云开发状态
function checkCloudStatus() {
  console.log('🔍 检查云开发状态...');
  
  if (!wx.cloud) {
    console.error('❌ wx.cloud 不可用');
    return false;
  }
  
  console.log('✅ wx.cloud 可用');
  
  if (!wx.cloud.callFunction) {
    console.error('❌ wx.cloud.callFunction 不可用');
    return false;
  }
  
  console.log('✅ wx.cloud.callFunction 可用');
  return true;
}

// 运行测试
console.log('🚀 开始 helloCloud 云函数测试...');
console.log('📝 请确保：');
console.log('1. 云开发环境已开通');
console.log('2. helloCloud 云函数已上传部署');
console.log('3. 环境ID配置正确');
console.log('');

if (checkCloudStatus()) {
  testHelloCloud();
} else {
  console.error('❌ 云开发状态检查失败，无法进行测试');
}
