/**
 * 清理无效数据
 * 删除指向不存在班级的学生数据
 */

// 清理无效学生数据
async function cleanInvalidStudentData() {
  try {
    console.log('开始清理无效学生数据...');
    
    const db = wx.cloud.database();
    
    // 1. 获取所有有效班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    const validClassIds = classes.map(cls => cls._id);
    
    console.log('有效班级: ' + classes.length + ' 个');
    for (let i = 0; i < classes.length; i++) {
      console.log('  - ' + classes[i].name + ' (ID: ' + classes[i]._id + ')');
    }
    
    // 2. 获取所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('总学生数: ' + students.length + ' 个');
    
    // 3. 分类学生数据
    const validStudents = [];
    const invalidStudents = [];
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const classId = student.classId;
      
      if (classId && validClassIds.includes(classId)) {
        validStudents.push(student);
        console.log('✅ 有效学生: ' + student.name + ' (班级: ' + classId + ')');
      } else {
        invalidStudents.push(student);
        console.log('❌ 无效学生: ' + student.name + ' (班级: ' + (classId || '未分配') + ')');
      }
    }
    
    console.log('学生分类结果:');
    console.log('  有效学生: ' + validStudents.length + ' 人');
    console.log('  无效学生: ' + invalidStudents.length + ' 人');
    
    // 4. 确认是否删除无效学生
    if (invalidStudents.length > 0) {
      console.log('准备删除的无效学生:');
      for (let i = 0; i < invalidStudents.length; i++) {
        const student = invalidStudents[i];
        console.log('  - ' + student.name + ' (ID: ' + student._id + ')');
      }
      
      // 删除无效学生数据
      let deletedCount = 0;
      for (let i = 0; i < invalidStudents.length; i++) {
        const student = invalidStudents[i];
        try {
          await db.collection('students').doc(student._id).remove();
          console.log('✅ 已删除学生: ' + student.name);
          deletedCount++;
        } catch (error) {
          console.log('❌ 删除学生 ' + student.name + ' 失败: ' + error.message);
        }
      }
      
      console.log('删除完成，共删除 ' + deletedCount + ' 个无效学生');
    } else {
      console.log('没有无效学生需要删除');
    }
    
    return {
      validStudents: validStudents,
      invalidStudents: invalidStudents,
      deletedCount: invalidStudents.length
    };
    
  } catch (error) {
    console.error('清理无效学生数据失败:', error);
    return null;
  }
}

// 清理学生加入记录
async function cleanStudentJoinRecords() {
  try {
    console.log('开始清理学生加入记录...');
    
    const db = wx.cloud.database();
    
    // 获取所有学生加入记录
    const recordsResult = await db.collection('student_join_records').get();
    const records = recordsResult.data;
    
    console.log('找到 ' + records.length + ' 条学生加入记录');
    
    // 获取所有有效学生ID
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    const validStudentIds = students.map(student => student._id);
    
    console.log('有效学生ID数量: ' + validStudentIds.length);
    
    // 清理无效记录
    let cleanedCount = 0;
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      if (!validStudentIds.includes(record.studentId)) {
        try {
          await db.collection('student_join_records').doc(record._id).remove();
          console.log('✅ 已删除无效记录: 学生ID ' + record.studentId);
          cleanedCount++;
        } catch (error) {
          console.log('❌ 删除记录失败: ' + error.message);
        }
      }
    }
    
    console.log('学生加入记录清理完成，共清理 ' + cleanedCount + ' 条记录');
    return cleanedCount;
    
  } catch (error) {
    console.error('清理学生加入记录失败:', error);
    return 0;
  }
}

// 更新班级学生数量统计
async function updateClassStudentCount() {
  try {
    console.log('开始更新班级学生数量统计...');
    
    const db = wx.cloud.database();
    
    // 获取所有班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log('找到 ' + classes.length + ' 个班级');
    
    for (let i = 0; i < classes.length; i++) {
      const classInfo = classes[i];
      
      // 统计该班级的实际学生数量
      const studentsResult = await db.collection('students').where({
        classId: classInfo._id,
        status: 'active'
      }).count();
      
      const actualStudentCount = studentsResult.total;
      
      // 更新班级学生数量
      await db.collection('classes').doc(classInfo._id).update({
        data: {
          currentStudents: actualStudentCount,
          studentCount: actualStudentCount,
          updatedAt: new Date()
        }
      });
      
      console.log('✅ 已更新班级 ' + classInfo.name + ' 的学生数量为 ' + actualStudentCount);
    }
    
    return true;
    
  } catch (error) {
    console.error('更新班级学生数量统计失败:', error);
    return false;
  }
}

// 综合清理
async function runComprehensiveCleanup() {
  try {
    console.log('开始综合清理无效数据...');
    console.log('=====================================');
    
    // 1. 清理无效学生数据
    const studentCleanup = await cleanInvalidStudentData();
    console.log('无效学生数据清理: ' + (studentCleanup ? '✅ 完成' : '❌ 失败'));
    console.log('-------------------------------------');
    
    // 2. 清理学生加入记录
    const recordCleanup = await cleanStudentJoinRecords();
    console.log('学生加入记录清理: ' + (recordCleanup > 0 ? '✅ 完成' : '✅ 无需清理'));
    console.log('-------------------------------------');
    
    // 3. 更新班级学生数量统计
    const countUpdate = await updateClassStudentCount();
    console.log('班级学生数量统计更新: ' + (countUpdate ? '✅ 完成' : '❌ 失败'));
    console.log('-------------------------------------');
    
    console.log('综合清理完成！');
    console.log('建议：刷新教师端页面查看清理效果');
    
    return {
      success: true,
      message: '无效数据清理完成',
      results: {
        studentCleanup: studentCleanup,
        recordCleanup: recordCleanup,
        countUpdate: countUpdate
      }
    };
    
  } catch (error) {
    console.error('综合清理失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// 将函数添加到全局作用域
window.cleanInvalidStudentData = cleanInvalidStudentData;
window.cleanStudentJoinRecords = cleanStudentJoinRecords;
window.updateClassStudentCount = updateClassStudentCount;
window.runComprehensiveCleanup = runComprehensiveCleanup;

console.log('无效数据清理函数已加载');
console.log('可用函数:');
console.log('- runComprehensiveCleanup() - 运行综合清理');
console.log('- cleanInvalidStudentData() - 清理无效学生数据');
console.log('- cleanStudentJoinRecords() - 清理学生加入记录');
console.log('- updateClassStudentCount() - 更新班级学生数量');
