// 云函数部署脚本
// 在微信开发者工具控制台中运行此脚本

console.log('🚀 开始部署云函数...');

async function deployCloudFunctions() {
  try {
    // 部署 studentJoinClass 云函数
    console.log('📝 部署 studentJoinClass 云函数...');
    const result1 = await wx.cloud.callFunction({
      name: 'studentJoinClass',
      data: { action: 'deploy' }
    });
    console.log('✅ studentJoinClass 部署完成');

    // 部署 manageClassInvite 云函数
    console.log('📝 部署 manageClassInvite 云函数...');
    const result2 = await wx.cloud.callFunction({
      name: 'manageClassInvite',
      data: { action: 'deploy' }
    });
    console.log('✅ manageClassInvite 部署完成');

    console.log('🎉 所有云函数部署完成！');
    
  } catch (error) {
    console.error('❌ 云函数部署失败:', error);
    console.log('💡 请手动在微信开发者工具中部署云函数');
    console.log('1. 右键点击 cloudfunctions/studentJoinClass 文件夹');
    console.log('2. 选择"上传并部署：云端安装依赖"');
    console.log('3. 对 manageClassInvite 重复相同操作');
  }
}

// 运行部署
deployCloudFunctions();
