// 在微信开发者工具控制台运行的测试脚本
// 这个脚本会在真实的小程序环境中执行

console.log('🚀 开始真实环境测试 helloCloud 云函数...');

// 检查云开发是否可用
if (!wx.cloud) {
  console.error('❌ wx.cloud 不可用');
} else {
  console.log('✅ wx.cloud 可用');
  
  // 调用云函数
  wx.cloud.callFunction({
    name: 'helloCloud',
    data: {
      test: 'hello from real environment'
    }
  }).then((res) => {
    console.log('✅ 云函数调用成功！');
    console.log('📊 完整返回结果:', res);
    console.log('🆔 OpenID:', res.result.openid);
    console.log('📱 AppID:', res.result.appid);
    console.log('🔗 UnionID:', res.result.unionid);
    
    // 检查是否成功获取到 openid
    if (res.result.openid) {
      console.log('🎉 成功获取到 OpenID！');
    } else {
      console.warn('⚠️  OpenID 为空，可能的原因：');
      console.warn('1. 用户未登录或未授权');
      console.warn('2. 云开发环境配置问题');
      console.warn('3. 云函数权限问题');
    }
    
  }).catch((err) => {
    console.error('❌ 云函数调用失败:', err);
    console.error('错误详情:', err.errMsg);
  });
}
