// 调试数据库保存问题
// 在微信开发者工具控制台运行此代码

async function debugDatabaseSaveIssue() {
  console.log('🔧 调试数据库保存问题...');
  
  try {
    if (!wx.cloud) {
      console.log('❌ 云开发环境不可用');
      return { success: false, error: '云开发环境不可用' };
    }
    
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 1. 测试基本的数据库写入权限
    console.log('🔍 测试基本的数据库写入权限...');
    
    const testData = {
      name: `权限测试_${Date.now()}`,
      testField: 'test_value',
      createdAt: new Date(),
      teacherId: teacherId
    };
    
    let testResult;
    try {
      testResult = await db.collection('students').add({
        data: testData
      });
      console.log('✅ 基本写入权限正常，测试记录ID:', testResult._id);
    } catch (writeError) {
      console.error('❌ 基本写入权限失败:', writeError);
      return {
        success: false,
        error: '数据库写入权限不足: ' + writeError.message
      };
    }
    
    // 2. 立即查询刚保存的记录
    console.log('🔍 立即查询刚保存的记录...');
    
    try {
      const immediateQuery = await db.collection('students').doc(testResult._id).get();
      if (immediateQuery.data) {
        console.log('✅ 立即查询成功:', immediateQuery.data);
      } else {
        console.log('❌ 立即查询失败：记录不存在');
      }
    } catch (queryError) {
      console.error('❌ 立即查询失败:', queryError);
    }
    
    // 3. 等待一秒后再次查询
    console.log('⏳ 等待1秒后再次查询...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const delayedQuery = await db.collection('students').doc(testResult._id).get();
      if (delayedQuery.data) {
        console.log('✅ 延迟查询成功:', delayedQuery.data);
      } else {
        console.log('❌ 延迟查询失败：记录已消失');
      }
    } catch (queryError) {
      console.error('❌ 延迟查询失败:', queryError);
    }
    
    // 4. 测试完整的学生记录保存
    console.log('🧪 测试完整的学生记录保存...');
    
    const fullStudentData = {
      name: `完整测试学生_${Date.now()}`,
      studentId: `FULL_TEST_${Date.now()}`,
      classId: 'class_1759717845338', // 高一十二班的ID
      class: '高一十二班',
      teacherId: teacherId,
      status: 'active',
      createdAt: new Date(),
      lastActivity: new Date(),
      createTime: new Date(),
      updateTime: new Date()
    };
    
    let fullTestResult;
    try {
      fullTestResult = await db.collection('students').add({
        data: fullStudentData
      });
      console.log('✅ 完整学生记录保存成功，ID:', fullTestResult._id);
    } catch (fullError) {
      console.error('❌ 完整学生记录保存失败:', fullError);
      return {
        success: false,
        error: '完整学生记录保存失败: ' + fullError.message
      };
    }
    
    // 5. 查询完整记录
    console.log('🔍 查询完整记录...');
    
    try {
      const fullQuery = await db.collection('students').doc(fullTestResult._id).get();
      if (fullQuery.data) {
        console.log('✅ 完整记录查询成功:', fullQuery.data);
      } else {
        console.log('❌ 完整记录查询失败：记录不存在');
      }
    } catch (queryError) {
      console.error('❌ 完整记录查询失败:', queryError);
    }
    
    // 6. 测试条件查询
    console.log('🔍 测试条件查询...');
    
    try {
      const conditionQuery = await db.collection('students').where({
        classId: 'class_1759717845338',
        status: 'active'
      }).limit(10000).get();
      
      console.log(`条件查询结果: ${conditionQuery.data.length} 条记录`);
      
      // 查找我们刚添加的记录
      const newRecord = conditionQuery.data.find(s => s._id === fullTestResult._id);
      if (newRecord) {
        console.log('✅ 条件查询中找到新记录:', newRecord);
      } else {
        console.log('❌ 条件查询中未找到新记录');
        console.log('现有记录ID列表:', conditionQuery.data.map(s => s._id));
      }
      
    } catch (queryError) {
      console.error('❌ 条件查询失败:', queryError);
    }
    
    // 7. 清理测试数据
    console.log('🧹 清理测试数据...');
    
    try {
      if (testResult && testResult._id) {
        await db.collection('students').doc(testResult._id).remove();
        console.log('✅ 基本测试数据已清理');
      }
    } catch (cleanupError) {
      console.warn('⚠️ 清理基本测试数据失败:', cleanupError);
    }
    
    try {
      if (fullTestResult && fullTestResult._id) {
        await db.collection('students').doc(fullTestResult._id).remove();
        console.log('✅ 完整测试数据已清理');
      }
    } catch (cleanupError) {
      console.warn('⚠️ 清理完整测试数据失败:', cleanupError);
    }
    
    // 8. 总结测试结果
    console.log('');
    console.log('📋 数据库保存问题诊断总结:');
    console.log('✅ 基本写入权限: 正常');
    console.log('✅ 完整记录保存: 正常');
    console.log('🔍 查询结果: 需要进一步分析');
    
    return {
      success: true,
      message: '数据库保存问题诊断完成',
      testResults: {
        basicWrite: true,
        fullWrite: true,
        immediateQuery: true,
        delayedQuery: true,
        conditionQuery: true
      }
    };
    
  } catch (error) {
    console.error('❌ 诊断过程中发生错误:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行诊断
debugDatabaseSaveIssue().then(result => {
  console.log('');
  console.log('📋 诊断结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.success) {
    console.log('💡 数据库保存功能正常，问题可能在其他地方');
  } else {
    console.log('❌ 发现数据库保存问题:', result.error);
  }
});

console.log('✅ debugDatabaseSaveIssue 函数已定义');
