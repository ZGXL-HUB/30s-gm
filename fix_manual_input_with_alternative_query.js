// 修复手动输入功能 - 使用替代查询策略
// 在微信开发者工具控制台运行此代码

async function fixManualInputWithAlternativeQuery() {
  console.log('🔧 修复手动输入功能 - 使用替代查询策略...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    if (!wx.cloud) {
      console.log('❌ 云开发环境不可用');
      return { success: false, error: '云开发环境不可用' };
    }
    
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 1. 获取高一十二班信息
    const classes = currentPage.data.classes || [];
    const targetClass = classes.find(c => c.name === '高一十二班');
    
    if (!targetClass) {
      console.log('❌ 未找到高一十二班');
      return { success: false, error: '未找到目标班级' };
    }
    
    console.log(`目标班级: ${targetClass.name} (ID: ${targetClass.id})`);
    
    // 2. 记录导入前的学生数量
    console.log('📊 导入前状态:');
    
    // 使用替代查询策略：先查询所有学生，然后过滤
    let beforeStudents = [];
    try {
      // 策略1：查询所有学生然后过滤
      const allStudents = await db.collection('students').limit(10000).get();
      beforeStudents = allStudents.data.filter(s => 
        s.classId === targetClass.id && (!s.status || s.status === 'active')
      );
      console.log(`策略1查询结果: ${beforeStudents.length} 个学生`);
    } catch (error) {
      console.warn('策略1查询失败:', error);
    }
    
    if (beforeStudents.length === 0) {
      try {
        // 策略2：按teacherId查询然后过滤
        const teacherStudents = await db.collection('students').where({
          teacherId: teacherId
        }).limit(10000).get();
        beforeStudents = teacherStudents.data.filter(s => 
          s.classId === targetClass.id && (!s.status || s.status === 'active')
        );
        console.log(`策略2查询结果: ${beforeStudents.length} 个学生`);
      } catch (error) {
        console.warn('策略2查询失败:', error);
      }
    }
    
    console.log(`导入前学生数: ${beforeStudents.length}`);
    console.log(`班级显示学生数: ${targetClass.studentCount}`);
    
    // 3. 模拟手动输入过程
    console.log('🧪 模拟手动输入过程...');
    
    const testStudent = {
      name: `修复测试学生_${Date.now()}`,
      studentId: `FIX_TEST_${Date.now()}`,
      rowIndex: 1
    };
    
    console.log('测试学生信息:', testStudent);
    
    // 4. 设置手动输入数据
    console.log('🔧 设置手动输入数据...');
    
    currentPage.setData({
      manualStudents: [testStudent],
      currentClassId: targetClass.id
    });
    
    console.log('✅ 手动输入数据已设置');
    
    // 5. 获取最新的班级信息
    console.log('🔍 获取最新的班级信息...');
    
    let latestClassInfo;
    try {
      const classResult = await db.collection('classes').doc(targetClass.id).get();
      latestClassInfo = classResult.data;
      console.log(`最新班级信息: ${latestClassInfo.name}, 当前学生数: ${latestClassInfo.studentCount || 0}`);
    } catch (error) {
      console.warn('获取最新班级信息失败:', error);
      latestClassInfo = targetClass;
    }
    
    // 6. 保存学生到数据库
    console.log('💾 保存学生到数据库...');
    
    let saveSuccess = false;
    let savedStudentId = null;
    
    try {
      const result = await db.collection('students').add({
        data: {
          name: testStudent.name,
          studentId: testStudent.studentId,
          classId: targetClass.id,
          class: targetClass.name,
          teacherId: teacherId,
          status: 'active',
          createdAt: new Date(),
          lastActivity: new Date(),
          createTime: new Date(),
          updateTime: new Date()
        }
      });
      
      savedStudentId = result._id;
      saveSuccess = true;
      
      console.log('✅ 学生保存成功:', {
        name: testStudent.name,
        studentId: testStudent.studentId,
        dbId: savedStudentId
      });
      
    } catch (saveError) {
      console.error('❌ 学生保存失败:', saveError);
      return {
        success: false,
        error: '学生保存失败: ' + saveError.message
      };
    }
    
    // 7. 更新班级学生数量
    console.log('📊 更新班级学生数量...');
    
    const currentStudentCount = latestClassInfo?.studentCount || 0;
    const newStudentCount = currentStudentCount + 1;
    
    try {
      await db.collection('classes').doc(targetClass.id).update({
        data: {
          studentCount: newStudentCount,
          lastActivity: new Date()
        }
      });
      
      console.log(`✅ 班级学生数量已更新: ${currentStudentCount} → ${newStudentCount}`);
      
    } catch (updateError) {
      console.error('❌ 班级学生数量更新失败:', updateError);
      return {
        success: false,
        error: '班级学生数量更新失败: ' + updateError.message
      };
    }
    
    // 8. 使用替代查询策略验证保存结果
    console.log('🔍 使用替代查询策略验证保存结果...');
    
    let afterStudents = [];
    try {
      // 策略1：查询所有学生然后过滤
      const allStudents = await db.collection('students').limit(10000).get();
      afterStudents = allStudents.data.filter(s => 
        s.classId === targetClass.id && (!s.status || s.status === 'active')
      );
      console.log(`策略1查询结果: ${afterStudents.length} 个学生`);
    } catch (error) {
      console.warn('策略1查询失败:', error);
    }
    
    if (afterStudents.length === 0) {
      try {
        // 策略2：按teacherId查询然后过滤
        const teacherStudents = await db.collection('students').where({
          teacherId: teacherId
        }).limit(10000).get();
        afterStudents = teacherStudents.data.filter(s => 
          s.classId === targetClass.id && (!s.status || s.status === 'active')
        );
        console.log(`策略2查询结果: ${afterStudents.length} 个学生`);
      } catch (error) {
        console.warn('策略2查询失败:', error);
      }
    }
    
    // 9. 检查新添加的学生是否存在
    const newStudent = afterStudents.find(s => s._id === savedStudentId);
    
    if (newStudent) {
      console.log('✅ 新学生已成功保存并可通过替代查询找到:', {
        name: newStudent.name,
        studentId: newStudent.studentId,
        id: newStudent._id
      });
    } else {
      console.log('❌ 新学生未找到 in 替代查询结果');
    }
    
    // 10. 检查班级信息是否更新
    console.log('🔍 检查班级信息是否更新...');
    
    const updatedClassResult = await db.collection('classes').doc(targetClass.id).get();
    const updatedClassInfo = updatedClassResult.data;
    
    console.log(`更新后班级学生数: ${updatedClassInfo.studentCount}`);
    
    // 11. 总结测试结果
    console.log('');
    console.log('📋 替代查询策略测试结果总结:');
    console.log(`- 导入前学生数: ${beforeStudents.length}`);
    console.log(`- 导入后学生数: ${afterStudents.length}`);
    console.log(`- 学生数量变化: ${afterStudents.length - beforeStudents.length}`);
    console.log(`- 班级显示学生数: ${updatedClassInfo.studentCount}`);
    console.log(`- 保存是否成功: ${saveSuccess ? '✅ 是' : '❌ 否'}`);
    console.log(`- 新学生是否存在: ${newStudent ? '✅ 是' : '❌ 否'}`);
    
    if (saveSuccess && newStudent && (afterStudents.length === beforeStudents.length + 1)) {
      console.log('🎉 替代查询策略测试成功！');
      
      // 清理测试数据
      console.log('🧹 清理测试数据...');
      try {
        await db.collection('students').doc(savedStudentId).remove();
        await db.collection('classes').doc(targetClass.id).update({
          data: {
            studentCount: currentStudentCount,
            lastActivity: new Date()
          }
        });
        console.log('✅ 测试数据已清理');
      } catch (cleanupError) {
        console.warn('⚠️ 清理测试数据失败:', cleanupError);
      }
      
    } else {
      console.log('❌ 替代查询策略测试失败！');
    }
    
    return {
      success: saveSuccess && newStudent,
      message: saveSuccess && newStudent ? '替代查询策略正常' : '替代查询策略异常',
      beforeCount: beforeStudents.length,
      afterCount: afterStudents.length,
      classCount: updatedClassInfo.studentCount,
      newStudent: newStudent ? {
        name: newStudent.name,
        id: newStudent._id
      } : null,
      alternativeQuery: true
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
fixManualInputWithAlternativeQuery().then(result => {
  console.log('');
  console.log('📋 最终测试结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.success) {
    console.log('🎉 替代查询策略正常工作！');
    console.log('💡 建议修改loadClassStudents方法使用替代查询策略');
  } else {
    console.log('❌ 替代查询策略存在问题！');
    console.log('💡 需要进一步调试数据库索引问题');
  }
});

console.log('✅ fixManualInputWithAlternativeQuery 函数已定义');
