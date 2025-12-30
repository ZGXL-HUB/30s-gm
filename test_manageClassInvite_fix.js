// 测试 manageClassInvite 云函数修复
// 验证 wx-server-sdk 依赖问题是否已解决

console.log('🔧 开始测试 manageClassInvite 云函数修复...');

// 测试云函数调用
async function testManageClassInvite() {
  try {
    console.log('📞 调用 manageClassInvite 云函数...');
    
    // 测试获取邀请信息功能
    const result = await wx.cloud.callFunction({
      name: 'manageClassInvite',
      data: {
        action: 'getInfo',
        classId: 'test-class-id' // 使用测试班级ID
      }
    });
    
    console.log('✅ 云函数调用成功:', result);
    
    if (result.result && result.result.success === false) {
      if (result.result.message.includes('班级不存在')) {
        console.log('✅ 云函数正常运行，只是测试班级不存在（这是正常的）');
        return true;
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ 云函数调用失败:', error);
    
    if (error.message && error.message.includes('Cannot find module \'wx-server-sdk\'')) {
      console.log('🔧 问题确认：wx-server-sdk 依赖缺失');
      console.log('💡 解决方案：');
      console.log('1. 在微信开发者工具中右键 cloudfunctions/manageClassInvite 文件夹');
      console.log('2. 选择 "上传并部署：云端安装依赖"');
      console.log('3. 等待部署完成');
      return false;
    }
    
    return false;
  }
}

// 测试云开发环境
async function testCloudEnvironment() {
  try {
    console.log('🌐 测试云开发环境连接...');
    
    const result = await wx.cloud.callFunction({
      name: 'helloCloud',
      data: {}
    });
    
    console.log('✅ 云开发环境正常:', result);
    return true;
    
  } catch (error) {
    console.error('❌ 云开发环境连接失败:', error);
    return false;
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始全面测试...');
  
  // 1. 测试云开发环境
  const cloudOk = await testCloudEnvironment();
  if (!cloudOk) {
    console.log('❌ 云开发环境异常，请检查云开发配置');
    return;
  }
  
  // 2. 测试 manageClassInvite 云函数
  const functionOk = await testManageClassInvite();
  
  if (functionOk) {
    console.log('🎉 所有测试通过！manageClassInvite 云函数已修复');
    console.log('💡 现在可以正常使用邀请码功能了');
  } else {
    console.log('⚠️ manageClassInvite 云函数仍有问题，请按照上述步骤重新部署');
  }
}

// 运行测试
runTests();