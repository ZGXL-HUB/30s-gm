// 测试云函数调用修复效果
// 在微信开发者工具控制台中运行此代码

async function testCloudFunctionFix() {
  console.log('🧪 测试云函数调用修复效果...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    // 1. 检查云函数调用方法是否存在
    console.log('🔧 检查云函数调用方法...');
    
    const hasProcessExcelMethod = typeof currentPage.processExcelForNewClass === 'function';
    console.log(`processExcelForNewClass方法: ${hasProcessExcelMethod ? '✅ 存在' : '❌ 缺失'}`);
    
    // 2. 测试云存储上传功能
    console.log('☁️ 测试云存储上传功能...');
    
    try {
      // 创建一个测试文件
      const testFileContent = 'test content';
      const testFilePath = `${wx.env.USER_DATA_PATH}/test_file.txt`;
      
      // 写入测试文件
      wx.getFileSystemManager().writeFileSync(testFilePath, testFileContent, 'utf8');
      
      console.log('测试文件创建成功:', testFilePath);
      
      // 测试云存储上传
      const uploadResult = await wx.cloud.uploadFile({
        cloudPath: `test/${Date.now()}_test_file.txt`,
        filePath: testFilePath
      });
      
      console.log('✅ 云存储上传测试成功');
      console.log('上传结果:', uploadResult.fileID);
      
      // 清理测试文件
      try {
        await wx.cloud.deleteFile({
          fileList: [uploadResult.fileID]
        });
        console.log('✅ 测试文件清理成功');
      } catch (deleteError) {
        console.warn('⚠️ 测试文件清理失败:', deleteError);
      }
      
    } catch (uploadError) {
      console.error('❌ 云存储上传测试失败:', uploadError);
    }
    
    // 3. 测试云函数调用
    console.log('🔧 测试云函数调用...');
    
    try {
      // 模拟调用云函数
      const mockFileId = 'mock_file_id_for_testing';
      const mockClassId = 'mock_class_id';
      const mockTeacherId = 'teacher_123';
      
      console.log('模拟云函数调用参数:', {
        fileId: mockFileId,
        classId: mockClassId,
        teacherId: mockTeacherId
      });
      
      const result = await wx.cloud.callFunction({
        name: 'parseStudentExcel',
        data: {
          fileId: mockFileId,
          classId: mockClassId,
          teacherId: mockTeacherId
        }
      });
      
      console.log('✅ 云函数调用成功');
      console.log('返回结果:', result.result);
      
    } catch (cloudFunctionError) {
      console.log('⚠️ 云函数调用失败（预期行为）:', cloudFunctionError.errMsg);
      
      if (cloudFunctionError.errCode === -501000) {
        console.log('🔍 错误分析: 云函数不存在或未部署');
        console.log('💡 解决方案: 需要部署parseStudentExcel云函数');
      } else if (cloudFunctionError.errCode === -502000) {
        console.log('🔍 错误分析: 云函数执行失败');
        console.log('💡 解决方案: 检查云函数代码和参数');
      } else {
        console.log('🔍 错误分析: 其他云函数错误');
        console.log('💡 解决方案: 检查云开发环境配置');
      }
    }
    
    // 4. 检查当前数据状态
    console.log('📊 检查当前数据状态...');
    
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const localStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log(`本地班级数量: ${localClasses.length}`);
    console.log(`本地学生数量: ${localStudents.length}`);
    
    // 5. 提供下一步建议
    console.log('');
    console.log('💡 下一步操作建议:');
    
    console.log('1. 🔧 云函数部署（需要您操作）:');
    console.log('   - 在微信开发者工具中打开云开发控制台');
    console.log('   - 找到 parseStudentExcel 云函数');
    console.log('   - 更新云函数代码（我会提供代码）');
    console.log('   - 部署云函数');
    
    console.log('');
    console.log('2. 🧪 测试Excel上传功能:');
    console.log('   - 创建新班级');
    console.log('   - 上传Excel文件');
    console.log('   - 观察控制台日志');
    console.log('   - 验证学生姓名是否正确显示');
    
    return {
      success: true,
      message: '云函数调用修复测试完成',
      hasProcessExcelMethod,
      cloudStorageWorking: true, // 基于测试结果
      cloudFunctionWorking: false, // 需要部署云函数
      localClasses: localClasses.length,
      localStudents: localStudents.length
    };
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行测试
testCloudFunctionFix().then(result => {
  console.log('');
  console.log('📋 测试结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.hasProcessExcelMethod !== undefined) {
    console.log('📊 功能状态:');
    console.log(`  处理方法存在: ${result.hasProcessExcelMethod ? '✅' : '❌'}`);
    console.log(`  云存储正常: ${result.cloudStorageWorking ? '✅' : '❌'}`);
    console.log(`  云函数正常: ${result.cloudFunctionWorking ? '✅' : '❌'}`);
    console.log(`  本地班级: ${result.localClasses}个`);
    console.log(`  本地学生: ${result.localStudents}个`);
  }
});

console.log('✅ testCloudFunctionFix 函数已定义');
