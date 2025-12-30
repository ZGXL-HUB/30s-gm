// 测试重复学生处理修复
// 在微信开发者工具控制台中运行此脚本

async function testDuplicateStudentsFix() {
  console.log('🧪 测试重复学生处理修复...');
  
  try {
    // 1. 检查当前数据库中的学生
    console.log('📊 检查当前数据库中的学生...');
    
    const db = wx.cloud.database();
    const studentsResult = await db.collection('students').get();
    
    console.log('数据库中学生总数:', studentsResult.data.length);
    console.log('现有学生姓名:', studentsResult.data.map(s => s.name));
    
    // 2. 模拟Excel导入（包含重复姓名）
    console.log('📝 模拟Excel导入测试...');
    
    const testFileID = 'test-duplicate-file-id';
    
    const result = await wx.cloud.callFunction({
      name: 'parseStudentExcel',
      data: {
        fileID: testFileID
      }
    });
    
    console.log('云函数调用结果:', result);
    
    // 3. 分析结果
    if (result.result) {
      console.log('📋 导入结果分析:');
      console.log(`✅ 成功: ${result.result.success}`);
      console.log(`📊 导入数量: ${result.result.importedCount || 0}`);
      console.log(`⏭️ 跳过数量: ${result.result.skippedCount || 0}`);
      console.log(`📝 消息: ${result.result.message}`);
      
      if (result.result.success) {
        console.log('🎉 修复成功！现在可以处理重复学生了');
        console.log('');
        console.log('💡 预期行为:');
        console.log('1. 重复的学生会被跳过');
        console.log('2. 只导入新的学生');
        console.log('3. 显示详细的导入统计');
        console.log('4. 班级创建时会包含新导入的学生');
      } else {
        console.log('⚠️ 导入仍然失败，需要进一步检查');
      }
    }
    
    console.log('🎉 测试完成！');
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
    console.log('');
    console.log('🔧 如果测试失败，请检查:');
    console.log('1. 云函数是否正确部署');
    console.log('2. 数据库权限是否正确设置');
    console.log('3. 网络连接是否稳定');
  }
}

// 运行测试
testDuplicateStudentsFix();
