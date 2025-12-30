// 修复 manageClassInvite 云函数依赖问题
// 在微信开发者工具控制台中运行此脚本

async function fixManageClassInviteDeps() {
  console.log('🔧 修复 manageClassInvite 云函数依赖问题...');
  
  try {
    // 检查云函数是否存在
    console.log('📝 检查 manageClassInvite 云函数...');
    
    // 测试云函数调用
    const testResult = await wx.cloud.callFunction({
      name: 'manageClassInvite',
      data: {
        action: 'getInfo',
        classId: 'test'
      }
    });
    
    console.log('✅ manageClassInvite 云函数调用成功');
    console.log('📊 测试结果:', testResult);
    
  } catch (error) {
    console.error('❌ manageClassInvite 云函数调用失败:', error);
    
    if (error.errMsg && error.errMsg.includes('Cannot find module \'wx-server-sdk\'')) {
      console.log('💡 问题诊断: wx-server-sdk 依赖缺失');
      console.log('🔧 解决方案:');
      console.log('1. 在微信开发者工具中，右键点击 cloudfunctions/manageClassInvite 文件夹');
      console.log('2. 选择 "上传并部署：云端安装依赖"');
      console.log('3. 等待部署完成');
      console.log('4. 重新测试云函数调用');
      
      // 提供手动修复步骤
      console.log('\n📋 手动修复步骤:');
      console.log('1. 打开微信开发者工具');
      console.log('2. 在项目文件树中找到 cloudfunctions/manageClassInvite');
      console.log('3. 右键点击该文件夹');
      console.log('4. 选择 "上传并部署：云端安装依赖"');
      console.log('5. 等待部署完成（通常需要1-2分钟）');
      console.log('6. 部署完成后，重新运行此脚本测试');
      
    } else {
      console.log('💡 其他可能的解决方案:');
      console.log('1. 检查云环境配置是否正确');
      console.log('2. 确认云函数代码没有语法错误');
      console.log('3. 检查云函数权限设置');
    }
  }
}

// 运行修复
fixManageClassInviteDeps();