// 修复所有云函数依赖问题的综合脚本
// 在微信开发者工具控制台中运行此脚本

async function fixAllCloudFunctionDependencies() {
  console.log('🔧 开始修复所有云函数依赖问题...');
  
  const cloudFunctions = [
    'manageClassInvite',
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
    'createAssignment',
    'getAssignments',
    'getStudentAssignments',
    'submitAssignmentResult'
  ];
  
  console.log(`📝 需要检查的云函数数量: ${cloudFunctions.length}`);
  
  for (const funcName of cloudFunctions) {
    console.log(`\n🔍 检查云函数: ${funcName}`);
    
    try {
      // 测试云函数调用
      const result = await wx.cloud.callFunction({
        name: funcName,
        data: { action: 'test' }
      });
      
      console.log(`✅ ${funcName} 云函数正常`);
      
    } catch (error) {
      console.log(`❌ ${funcName} 云函数异常:`, error.errMsg || error.message);
      
      if (error.errMsg && error.errMsg.includes('Cannot find module \'wx-server-sdk\'')) {
        console.log(`🔧 ${funcName} 需要重新部署依赖`);
        console.log(`   解决方案: 右键 cloudfunctions/${funcName} → 上传并部署：云端安装依赖`);
      }
    }
  }
  
  console.log('\n📋 修复步骤总结:');
  console.log('1. 对于显示 "Cannot find module \'wx-server-sdk\'" 错误的云函数:');
  console.log('   - 右键点击对应的 cloudfunctions/[函数名] 文件夹');
  console.log('   - 选择 "上传并部署：云端安装依赖"');
  console.log('   - 等待部署完成');
  console.log('');
  console.log('2. 部署完成后，重新运行此脚本验证修复结果');
  console.log('');
  console.log('3. 如果问题仍然存在，请检查:');
  console.log('   - 云环境配置是否正确');
  console.log('   - 网络连接是否正常');
  console.log('   - 云函数代码是否有语法错误');
}

// 运行修复
fixAllCloudFunctionDependencies();
