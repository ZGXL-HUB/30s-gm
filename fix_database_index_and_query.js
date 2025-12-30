// 修复数据库索引和查询问题
// 在微信开发者工具控制台运行此代码

async function fixDatabaseIndexAndQuery() {
  console.log('🔧 修复数据库索引和查询问题...');
  
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
    
    // 2. 测试多种查询策略
    console.log('🔍 测试多种查询策略...');
    
    let allStudents = [];
    const existingIds = new Set();
    
    // 策略1：查询所有学生记录
    try {
      console.log('策略1：查询所有学生记录...');
      const allRecords = await db.collection('students').limit(10000).get();
      console.log(`查询到所有学生记录: ${allRecords.data.length}`);
      
      allRecords.data.forEach(student => {
        if (!existingIds.has(student._id)) {
          allStudents.push(student);
          existingIds.add(student._id);
        }
      });
      console.log(`策略1合并后学生数量: ${allStudents.length}`);
    } catch (error) {
      console.warn('策略1查询失败:', error);
    }
    
    // 策略2：按teacherId查询
    try {
      console.log('策略2：按teacherId查询...');
      let skip = 0;
      const batchSize = 100;
      let hasMore = true;
      
      while (hasMore) {
        const batchResult = await db.collection('students')
          .where({
            teacherId: teacherId
          })
          .skip(skip)
          .limit(batchSize)
          .get();
        
        batchResult.data.forEach(student => {
          if (!existingIds.has(student._id)) {
            allStudents.push(student);
            existingIds.add(student._id);
          }
        });
        
        if (batchResult.data.length < batchSize) {
          hasMore = false;
        } else {
          skip += batchSize;
        }
      }
      console.log(`策略2合并后学生数量: ${allStudents.length}`);
    } catch (error) {
      console.warn('策略2查询失败:', error);
    }
    
    // 策略3：按classId查询
    try {
      console.log('策略3：按classId查询...');
      const classStudents = await db.collection('students')
        .where({
          classId: targetClass.id
        })
        .limit(10000)
        .get();
      
      classStudents.data.forEach(student => {
        if (!existingIds.has(student._id)) {
          allStudents.push(student);
          existingIds.add(student._id);
        }
      });
      console.log(`策略3合并后学生数量: ${allStudents.length}`);
    } catch (error) {
      console.warn('策略3查询失败:', error);
    }
    
    // 3. 分析查询结果
    console.log('📊 分析查询结果...');
    
    const targetClassStudents = allStudents.filter(s => s.classId === targetClass.id);
    const activeStudents = targetClassStudents.filter(s => !s.status || s.status === 'active');
    
    console.log(`总学生数: ${allStudents.length}`);
    console.log(`目标班级学生数: ${targetClassStudents.length}`);
    console.log(`活跃学生数: ${activeStudents.length}`);
    
    // 4. 检查是否有新保存的学生
    console.log('🔍 检查是否有新保存的学生...');
    
    const recentStudents = allStudents.filter(s => {
      const createTime = s.createTime || s.createdAt;
      if (!createTime) return false;
      
      const now = new Date();
      const studentTime = new Date(createTime);
      const diffMinutes = (now - studentTime) / (1000 * 60);
      
      return diffMinutes < 10; // 最近10分钟内的学生
    });
    
    console.log(`最近10分钟内的学生: ${recentStudents.length}`);
    recentStudents.forEach(student => {
      console.log(`- ${student.name} (${student.classId}) - ${student.createTime || student.createdAt}`);
    });
    
    // 5. 测试保存新学生
    console.log('🧪 测试保存新学生...');
    
    const testStudent = {
      name: `索引测试学生_${Date.now()}`,
      studentId: `INDEX_TEST_${Date.now()}`,
      classId: targetClass.id,
      class: targetClass.name,
      teacherId: teacherId,
      status: 'active',
      createdAt: new Date(),
      lastActivity: new Date(),
      createTime: new Date(),
      updateTime: new Date()
    };
    
    let saveResult;
    try {
      saveResult = await db.collection('students').add({
        data: testStudent
      });
      
      console.log('✅ 测试学生保存成功:', {
        name: testStudent.name,
        studentId: testStudent.studentId,
        dbId: saveResult._id
      });
      
    } catch (saveError) {
      console.error('❌ 测试学生保存失败:', saveError);
      return {
        success: false,
        error: '测试学生保存失败: ' + saveError.message
      };
    }
    
    // 6. 立即验证新保存的学生
    console.log('🔍 立即验证新保存的学生...');
    
    // 等待1秒确保数据同步
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let foundNewStudent = false;
    
    // 尝试直接查询
    try {
      const directQuery = await db.collection('students').doc(saveResult._id).get();
      if (directQuery.data) {
        console.log('✅ 直接查询找到新学生:', directQuery.data.name);
        foundNewStudent = true;
      }
    } catch (error) {
      console.warn('直接查询失败:', error);
    }
    
    // 尝试条件查询
    try {
      const conditionQuery = await db.collection('students')
        .where({
          classId: targetClass.id,
          status: 'active'
        })
        .limit(10000)
        .get();
      
      const newStudentInCondition = conditionQuery.data.find(s => s._id === saveResult._id);
      if (newStudentInCondition) {
        console.log('✅ 条件查询找到新学生:', newStudentInCondition.name);
        foundNewStudent = true;
      } else {
        console.log('❌ 条件查询未找到新学生');
      }
    } catch (error) {
      console.warn('条件查询失败:', error);
    }
    
    // 7. 清理测试数据
    console.log('🧹 清理测试数据...');
    try {
      await db.collection('students').doc(saveResult._id).remove();
      console.log('✅ 测试数据已清理');
    } catch (cleanupError) {
      console.warn('⚠️ 清理测试数据失败:', cleanupError);
    }
    
    // 8. 总结分析结果
    console.log('');
    console.log('📋 数据库索引和查询问题分析总结:');
    console.log(`- 总学生记录数: ${allStudents.length}`);
    console.log(`- 目标班级学生数: ${targetClassStudents.length}`);
    console.log(`- 活跃学生数: ${activeStudents.length}`);
    console.log(`- 最近10分钟内学生数: ${recentStudents.length}`);
    console.log(`- 新学生保存: ${saveResult ? '✅ 成功' : '❌ 失败'}`);
    console.log(`- 新学生查询: ${foundNewStudent ? '✅ 成功' : '❌ 失败'}`);
    
    // 9. 提供修复建议
    console.log('');
    console.log('💡 修复建议:');
    
    if (!foundNewStudent) {
      console.log('1. 数据库索引问题严重，建议：');
      console.log('   - 在云开发控制台创建以下索引：');
      console.log('     * classId: 升序');
      console.log('     * status: 升序');
      console.log('     * teacherId: 升序');
      console.log('     * classId + status: 组合索引');
      console.log('2. 修改查询策略：');
      console.log('   - 使用多策略查询（已实现）');
      console.log('   - 增加查询重试机制');
      console.log('   - 使用更宽松的查询条件');
    } else {
      console.log('1. 数据库查询基本正常');
      console.log('2. 建议优化查询性能');
    }
    
    return {
      success: foundNewStudent,
      message: foundNewStudent ? '数据库查询正常' : '数据库索引问题需要修复',
      totalStudents: allStudents.length,
      targetClassStudents: targetClassStudents.length,
      activeStudents: activeStudents.length,
      recentStudents: recentStudents.length,
      saveSuccess: !!saveResult,
      querySuccess: foundNewStudent
    };
    
  } catch (error) {
    console.error('❌ 分析过程中发生错误:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行分析
fixDatabaseIndexAndQuery().then(result => {
  console.log('');
  console.log('📋 最终分析结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.success) {
    console.log('🎉 数据库查询基本正常！');
    console.log('💡 建议优化查询性能');
  } else {
    console.log('❌ 数据库索引问题需要修复！');
    console.log('💡 请按照建议创建数据库索引');
  }
});

console.log('✅ fixDatabaseIndexAndQuery 函数已定义');
