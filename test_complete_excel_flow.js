// 测试完整的Excel导入流程
// 在微信开发者工具控制台中运行此脚本

async function testCompleteExcelFlow() {
  console.log('🧪 测试完整的Excel导入流程...');
  
  try {
    // 1. 检查云函数状态
    console.log('📝 检查云函数状态...');
    
    const testResult = await wx.cloud.callFunction({
      name: 'parseStudentExcel',
      data: {
        fileID: 'test-file-id'
      }
    });
    
    console.log('云函数测试结果:', testResult);
    
    // 2. 检查数据库中的学生数据
    console.log('🔍 检查数据库中的学生数据...');
    
    const db = wx.cloud.database();
    const studentsResult = await db.collection('students').limit(10).get();
    
    console.log('数据库中的学生数据:', studentsResult.data);
    console.log('学生总数:', studentsResult.data.length);
    
    // 3. 检查本地存储
    console.log('💾 检查本地存储...');
    
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const localStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log('本地存储的学生数据:', localStudents);
    console.log('本地学生总数:', localStudents.length);
    
    // 4. 分析结果
    console.log('📊 分析结果...');
    
    if (studentsResult.data.length > 0) {
      console.log('✅ 数据库中有学生数据');
      console.log('最新导入的学生:', studentsResult.data.slice(-3));
    } else {
      console.log('⚠️ 数据库中没有学生数据');
    }
    
    if (localStudents.length > 0) {
      console.log('✅ 本地存储中有学生数据');
    } else {
      console.log('⚠️ 本地存储中没有学生数据');
    }
    
    console.log('🎉 测试完成！');
    console.log('');
    console.log('📋 测试结果总结:');
    console.log(`✅ 云函数调用: ${testResult.result ? '正常' : '异常'}`);
    console.log(`✅ 数据库学生数: ${studentsResult.data.length}`);
    console.log(`✅ 本地存储学生数: ${localStudents.length}`);
    console.log('');
    console.log('💡 下一步建议:');
    if (studentsResult.data.length === 0) {
      console.log('1. 检查Excel文件格式是否正确');
      console.log('2. 确认云函数是否正确处理了数据');
      console.log('3. 检查数据库权限设置');
    } else {
      console.log('1. 检查前端是否正确刷新了学生列表');
      console.log('2. 确认学生数据是否正确显示');
      console.log('3. 测试其他Excel文件导入');
    }
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
    console.log('');
    console.log('🔧 错误排查:');
    console.log('1. 检查云开发环境是否正常');
    console.log('2. 确认网络连接是否稳定');
    console.log('3. 检查云函数是否正确部署');
  }
}

// 运行测试
testCompleteExcelFlow();
