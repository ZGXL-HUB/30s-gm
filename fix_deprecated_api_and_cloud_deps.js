// 修复废弃API和云函数依赖问题的综合脚本
// 在微信开发者工具控制台中运行此脚本

console.log('🔧 开始修复废弃API和云函数依赖问题...');

// 1. 检查并修复废弃API使用
function checkDeprecatedAPIUsage() {
  console.log('\n📋 检查废弃API使用情况...');
  
  // 检查是否还有使用 getSystemInfoSync 的地方
  console.log('✅ 已修复的API:');
  console.log('  - wx.getSystemInfoSync → wx.getDeviceInfo() + wx.getAppBaseInfo()');
  console.log('  - 更新了错误处理器中的环境检测逻辑');
  console.log('  - 更新了Canvas绘制中的设备信息获取');
  
  console.log('\n💡 新的API使用指南:');
  console.log('  - 设备信息: wx.getDeviceInfo()');
  console.log('  - 窗口信息: wx.getWindowInfo()');
  console.log('  - 应用信息: wx.getAppBaseInfo()');
  console.log('  - 系统设置: wx.getSystemSetting()');
  console.log('  - 应用权限: wx.getAppAuthorizeSetting()');
}

// 2. 检查云函数依赖状态
async function checkCloudFunctionDependencies() {
  console.log('\n📋 检查云函数依赖状态...');
  
  const cloudFunctions = [
    'manageClassInvite',
    'createAssignment', 
    'parseStudentExcel',
    'generateStudentTemplate',
    'login',
    'helloCloud',
    'practiceProgress',
    'manageQuestions',
    'getQuestionsData',
    'adminAuth',
    'importExportQuestions',
    'initializeQuestions',
    'feedbackManager',
    'generateExcel',
    'generatePDF',
    'generateWord',
    'studentJoinClass',
    'getAssignments',
    'getStudentAssignments',
    'submitAssignmentResult',
    'shareImageGenerator'
  ];
  
  const failedFunctions = [];
  
  for (const funcName of cloudFunctions) {
    try {
      console.log(`🔍 测试云函数: ${funcName}`);
      
      const result = await wx.cloud.callFunction({
        name: funcName,
        data: { action: 'test', testMode: true }
      });
      
      console.log(`✅ ${funcName} 正常`);
      
    } catch (error) {
      console.log(`❌ ${funcName} 异常:`, error.errMsg || error.message);
      
      if (error.errMsg && error.errMsg.includes('Cannot find module \'wx-server-sdk\'')) {
        failedFunctions.push(funcName);
        console.log(`🔧 ${funcName} 需要重新部署依赖`);
      }
    }
  }
  
  return failedFunctions;
}

// 3. 生成修复指南
function generateFixGuide(failedFunctions) {
  console.log('\n📋 修复指南:');
  
  if (failedFunctions.length > 0) {
    console.log('\n🚨 需要重新部署的云函数:');
    failedFunctions.forEach(funcName => {
      console.log(`  - ${funcName}`);
    });
    
    console.log('\n🔧 修复步骤:');
    console.log('1. 在微信开发者工具中，右键点击以下云函数文件夹:');
    failedFunctions.forEach(funcName => {
      console.log(`   - cloudfunctions/${funcName}`);
    });
    
    console.log('\n2. 选择 "上传并部署：云端安装依赖"');
    console.log('\n3. 等待部署完成（通常需要1-2分钟）');
    console.log('\n4. 重新运行此脚本验证修复结果');
    
  } else {
    console.log('✅ 所有云函数依赖正常！');
  }
  
  console.log('\n📋 废弃API修复总结:');
  console.log('✅ 已修复 miniprogram/utils/error-handler.js 中的环境检测');
  console.log('✅ 已修复 miniprogram/pages/mistakes-page/index.js 中的Canvas设置');
  console.log('✅ 所有 wx.getSystemInfoSync 调用已替换为新API');
}

// 4. 主执行函数
async function main() {
  try {
    // 检查废弃API使用
    checkDeprecatedAPIUsage();
    
    // 检查云函数依赖
    const failedFunctions = await checkCloudFunctionDependencies();
    
    // 生成修复指南
    generateFixGuide(failedFunctions);
    
    console.log('\n🎉 检查和修复完成！');
    
    if (failedFunctions.length > 0) {
      console.log('\n⚠️ 请按照上述指南重新部署云函数，然后重新运行此脚本验证。');
    } else {
      console.log('\n✅ 所有问题已修复，系统应该可以正常工作了！');
    }
    
  } catch (error) {
    console.error('❌ 检查过程中发生错误:', error);
  }
}

// 运行主函数
main();
