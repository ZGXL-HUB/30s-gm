// 测试邀请码生成功能修复
// 验证点击确定按钮后是否能正常生成邀请码

console.log('🔧 开始测试邀请码生成功能修复...');

// 模拟用户点击确定按钮的流程
async function testInviteCodeGeneration() {
  try {
    console.log('📋 模拟用户点击确定按钮...');
    
    // 模拟班级ID和教师ID
    const testClassId = 'test-class-123';
    const testTeacherId = 'teacher_123';
    
    console.log('📞 调用云函数获取班级邀请信息...');
    const result = await wx.cloud.callFunction({
      name: 'manageClassInvite',
      data: {
        action: 'getInfo',
        classId: testClassId,
        teacherId: testTeacherId
      }
    });
    
    console.log('📋 获取邀请信息结果:', result);
    
    if (result.result && result.result.success) {
      const inviteInfo = result.result.data;
      
      if (!inviteInfo.inviteCode) {
        console.log('📋 班级没有邀请码，模拟用户点击确定生成...');
        
        // 模拟生成邀请码
        console.log('🔧 开始生成邀请码...');
        const generateResult = await wx.cloud.callFunction({
          name: 'manageClassInvite',
          data: {
            action: 'generate',
            classId: testClassId,
            teacherId: testTeacherId,
            expireDays: 30,
            maxUses: -1
          }
        });
        
        console.log('📋 生成邀请码结果:', generateResult);
        
        if (generateResult.result && generateResult.result.success) {
          console.log('✅ 邀请码生成成功:', generateResult.result.data.inviteCode);
          console.log('💡 现在用户应该能看到邀请码了');
          return true;
        } else {
          console.log('❌ 邀请码生成失败:', generateResult.result);
          return false;
        }
      } else {
        console.log('✅ 班级已有邀请码:', inviteInfo.inviteCode);
        return true;
      }
    } else {
      console.log('❌ 获取邀请信息失败:', result.result);
      return false;
    }
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
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
async function runInviteGenerationTests() {
  console.log('🚀 开始全面测试邀请码生成功能...');
  
  // 1. 测试云开发环境
  const cloudOk = await testCloudEnvironment();
  if (!cloudOk) {
    console.log('❌ 云开发环境异常，请检查云开发配置');
    return;
  }
  
  // 2. 测试邀请码生成
  const generateOk = await testInviteCodeGeneration();
  
  if (generateOk) {
    console.log('🎉 邀请码生成功能测试通过！');
    console.log('💡 现在点击确定按钮应该能正常生成邀请码了');
    console.log('');
    console.log('📋 功能说明：');
    console.log('- 点击班级卡片会显示邀请信息');
    console.log('- 如果班级没有邀请码，会提示生成');
    console.log('- 点击确定后会显示加载提示');
    console.log('- 生成成功后会显示邀请码和复制选项');
  } else {
    console.log('⚠️ 邀请码生成功能仍有问题，请检查：');
    console.log('1. 云函数是否正确部署');
    console.log('2. 前端代码是否正确调用');
    console.log('3. 云开发环境是否正常');
  }
}

// 运行测试
runInviteGenerationTests();
