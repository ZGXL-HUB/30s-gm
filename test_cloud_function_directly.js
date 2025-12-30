// 直接测试云函数调用
// 在微信开发者工具控制台中运行此代码

async function testCloudFunctionDirectly() {
  console.log('🧪 直接测试parseStudentExcel云函数...');
  
  try {
    // 1. 检查云函数是否存在
    console.log('🔍 检查云函数是否存在...');
    
    // 创建一个模拟的Excel文件路径
    const mockFileId = 'cloud://test-env/test-file.xlsx';
    
    console.log('📝 准备调用云函数...');
    console.log('云函数名称: parseStudentExcel');
    console.log('参数:', {
      fileId: mockFileId,
      classId: 'test_class_id',
      teacherId: 'teacher_123'
    });
    
    // 2. 尝试直接调用云函数
    console.log('🔄 尝试调用云函数...');
    
    try {
      const result = await wx.cloud.callFunction({
        name: 'parseStudentExcel',
        data: {
          fileId: mockFileId,
          classId: 'test_class_id',
          teacherId: 'teacher_123'
        }
      });
      
      console.log('✅ 云函数调用成功');
      console.log('返回结果:', result);
      console.log('result.result:', result.result);
      
      if (result.result) {
        console.log('result.result.success:', result.result.success);
        console.log('result.result.message:', result.result.message);
        console.log('result.result.importedCount:', result.result.importedCount);
      }
      
    } catch (cloudError) {
      console.log('❌ 云函数调用失败');
      console.log('错误信息:', cloudError);
      console.log('错误代码:', cloudError.errCode);
      console.log('错误消息:', cloudError.errMsg);
      
      // 分析错误类型
      if (cloudError.errCode === -501000) {
        console.log('🔍 错误分析: 云函数不存在或名称错误');
      } else if (cloudError.errCode === -502000) {
        console.log('🔍 错误分析: 云函数执行失败');
      } else {
        console.log('🔍 错误分析: 其他云函数错误');
      }
    }
    
    // 3. 检查云函数列表
    console.log('📋 检查可用的云函数...');
    
    try {
      // 尝试调用一个已知存在的云函数来验证云开发环境
      const testResult = await wx.cloud.callFunction({
        name: 'login', // 假设这个云函数存在
        data: {}
      });
      console.log('✅ 云开发环境正常，login函数调用成功');
    } catch (testError) {
      console.log('⚠️ 云开发环境可能有问题:', testError.errMsg);
    }
    
    // 4. 提供解决方案
    console.log('');
    console.log('💡 解决方案建议:');
    console.log('1. 检查云函数 parseStudentExcel 是否正确部署');
    console.log('2. 检查云函数的参数格式是否正确');
    console.log('3. 检查云函数的返回值格式');
    console.log('4. 如果云函数有问题，系统会自动使用本地模式');
    
    return {
      success: true,
      message: '云函数测试完成'
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
testCloudFunctionDirectly().then(result => {
  console.log('');
  console.log('📋 测试结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
});

console.log('✅ testCloudFunctionDirectly 函数已定义');
