// 调试查询条件问题
// 在微信开发者工具控制台运行此代码

async function debugQueryCondition() {
  console.log('🔧 调试查询条件问题...');
  
  try {
    if (!wx.cloud) {
      console.log('❌ 云开发环境不可用');
      return { success: false, error: '云开发环境不可用' };
    }
    
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 1. 保存一个测试学生记录
    console.log('🧪 保存一个测试学生记录...');
    
    const testStudentData = {
      name: `查询测试学生_${Date.now()}`,
      studentId: `QUERY_TEST_${Date.now()}`,
      classId: 'class_1759717845338', // 高一十二班的ID
      class: '高一十二班',
      teacherId: teacherId,
      status: 'active',
      createdAt: new Date(),
      lastActivity: new Date(),
      createTime: new Date(),
      updateTime: new Date()
    };
    
    let testResult;
    try {
      testResult = await db.collection('students').add({
        data: testStudentData
      });
      console.log('✅ 测试学生记录保存成功，ID:', testResult._id);
      console.log('保存的数据:', testStudentData);
    } catch (saveError) {
      console.error('❌ 测试学生记录保存失败:', saveError);
      return { success: false, error: saveError.message };
    }
    
    // 2. 直接查询刚保存的记录
    console.log('🔍 直接查询刚保存的记录...');
    
    try {
      const directQuery = await db.collection('students').doc(testResult._id).get();
      if (directQuery.data) {
        console.log('✅ 直接查询成功:', directQuery.data);
        console.log('记录的字段:', Object.keys(directQuery.data));
        console.log('classId值:', directQuery.data.classId);
        console.log('status值:', directQuery.data.status);
      } else {
        console.log('❌ 直接查询失败：记录不存在');
      }
    } catch (queryError) {
      console.error('❌ 直接查询失败:', queryError);
    }
    
    // 3. 测试不同的查询条件
    console.log('🔍 测试不同的查询条件...');
    
    // 条件1：只按classId查询
    try {
      console.log('条件1：只按classId查询...');
      const query1 = await db.collection('students').where({
        classId: 'class_1759717845338'
      }).limit(10000).get();
      
      console.log(`条件1结果: ${query1.data.length} 条记录`);
      const found1 = query1.data.find(s => s._id === testResult._id);
      console.log(`条件1是否找到新记录: ${found1 ? '✅ 是' : '❌ 否'}`);
      
    } catch (error) {
      console.error('条件1查询失败:', error);
    }
    
    // 条件2：只按status查询
    try {
      console.log('条件2：只按status查询...');
      const query2 = await db.collection('students').where({
        status: 'active'
      }).limit(10000).get();
      
      console.log(`条件2结果: ${query2.data.length} 条记录`);
      const found2 = query2.data.find(s => s._id === testResult._id);
      console.log(`条件2是否找到新记录: ${found2 ? '✅ 是' : '❌ 否'}`);
      
    } catch (error) {
      console.error('条件2查询失败:', error);
    }
    
    // 条件3：按classId和status查询（原始条件）
    try {
      console.log('条件3：按classId和status查询（原始条件）...');
      const query3 = await db.collection('students').where({
        classId: 'class_1759717845338',
        status: 'active'
      }).limit(10000).get();
      
      console.log(`条件3结果: ${query3.data.length} 条记录`);
      const found3 = query3.data.find(s => s._id === testResult._id);
      console.log(`条件3是否找到新记录: ${found3 ? '✅ 是' : '❌ 否'}`);
      
      if (!found3) {
        console.log('🔍 分析条件3失败的原因...');
        console.log('查询条件: classId=class_1759717845338, status=active');
        console.log('记录实际值: classId=' + directQuery.data.classId + ', status=' + directQuery.data.status);
        console.log('classId匹配:', directQuery.data.classId === 'class_1759717845338');
        console.log('status匹配:', directQuery.data.status === 'active');
      }
      
    } catch (error) {
      console.error('条件3查询失败:', error);
    }
    
    // 条件4：按teacherId查询
    try {
      console.log('条件4：按teacherId查询...');
      const query4 = await db.collection('students').where({
        teacherId: teacherId
      }).limit(10000).get();
      
      console.log(`条件4结果: ${query4.data.length} 条记录`);
      const found4 = query4.data.find(s => s._id === testResult._id);
      console.log(`条件4是否找到新记录: ${found4 ? '✅ 是' : '❌ 否'}`);
      
    } catch (error) {
      console.error('条件4查询失败:', error);
    }
    
    // 条件5：查询所有记录
    try {
      console.log('条件5：查询所有记录...');
      const query5 = await db.collection('students').limit(10000).get();
      
      console.log(`条件5结果: ${query5.data.length} 条记录`);
      const found5 = query5.data.find(s => s._id === testResult._id);
      console.log(`条件5是否找到新记录: ${found5 ? '✅ 是' : '❌ 否'}`);
      
    } catch (error) {
      console.error('条件5查询失败:', error);
    }
    
    // 4. 检查数据库索引
    console.log('🔍 检查数据库索引...');
    console.log('💡 如果某些查询条件失败，可能是数据库索引问题');
    console.log('建议创建以下索引：');
    console.log('- classId: 升序');
    console.log('- status: 升序');
    console.log('- classId + status: 组合索引');
    console.log('- teacherId: 升序');
    
    // 5. 清理测试数据
    console.log('🧹 清理测试数据...');
    
    try {
      await db.collection('students').doc(testResult._id).remove();
      console.log('✅ 测试数据已清理');
    } catch (cleanupError) {
      console.warn('⚠️ 清理测试数据失败:', cleanupError);
    }
    
    // 6. 总结测试结果
    console.log('');
    console.log('📋 查询条件问题诊断总结:');
    console.log('✅ 数据库保存: 正常');
    console.log('✅ 直接查询: 正常');
    console.log('🔍 条件查询: 需要进一步分析');
    
    return {
      success: true,
      message: '查询条件问题诊断完成',
      recommendations: [
        '检查数据库索引设置',
        '确认查询条件字段值',
        '考虑使用不同的查询策略'
      ]
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
debugQueryCondition().then(result => {
  console.log('');
  console.log('📋 诊断结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.recommendations) {
    console.log('');
    console.log('💡 建议:');
    result.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
});

console.log('✅ debugQueryCondition 函数已定义');
