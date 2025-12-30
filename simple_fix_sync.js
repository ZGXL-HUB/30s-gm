/**
 * 简化的学生数据同步修复脚本
 * 避免复杂语法，确保兼容性
 */

// 修复班级学生人数统计
async function fixClassStudentCount() {
  try {
    console.log('开始修复班级学生人数统计...');
    
    const db = wx.cloud.database();
    
    // 获取所有班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log('找到 ' + classes.length + ' 个班级');
    
    let fixedCount = 0;
    
    for (let i = 0; i < classes.length; i++) {
      const classInfo = classes[i];
      
      // 统计该班级的实际学生数量
      const studentsResult = await db.collection('students').where({
        classId: classInfo._id,
        status: 'active'
      }).count();
      
      const actualStudentCount = studentsResult.total;
      const currentStudentCount = classInfo.currentStudents || 0;
      
      console.log('班级 ' + classInfo.name + ': 当前显示 ' + currentStudentCount + ' 人，实际 ' + actualStudentCount + ' 人');
      
      // 如果数量不一致，更新班级数据
      if (actualStudentCount !== currentStudentCount) {
        await db.collection('classes').doc(classInfo._id).update({
          data: {
            currentStudents: actualStudentCount,
            studentCount: actualStudentCount,
            updatedAt: new Date()
          }
        });
        
        console.log('已更新班级 ' + classInfo.name + ' 的学生数量为 ' + actualStudentCount);
        fixedCount++;
      }
    }
    
    console.log('班级学生人数统计修复完成，共修复 ' + fixedCount + ' 个班级');
    return { success: true, message: '班级学生人数统计修复完成，共修复 ' + fixedCount + ' 个班级' };
    
  } catch (error) {
    console.error('修复班级学生人数统计失败:', error);
    return { success: false, message: error.message };
  }
}

// 修复学生数据同步问题
async function fixStudentDataSync() {
  try {
    console.log('开始修复学生数据同步问题...');
    
    const db = wx.cloud.database();
    
    // 获取所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('找到 ' + students.length + ' 个学生');
    
    let fixedCount = 0;
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      let needUpdate = false;
      const updateData = {};
      
      // 检查学生是否有有效的班级ID
      if (!student.classId) {
        console.log('学生 ' + student.name + ' 没有班级ID，跳过');
        continue;
      }
      
      // 验证班级是否存在
      const classResult = await db.collection('classes').doc(student.classId).get();
      if (!classResult.data) {
        console.log('学生 ' + student.name + ' 的班级 ' + student.classId + ' 不存在，需要处理');
        updateData.status = 'inactive';
        updateData.classId = null;
        updateData.className = '未分配班级';
        needUpdate = true;
      } else {
        // 确保学生数据与班级数据一致
        const classInfo = classResult.data;
        if (student.className !== classInfo.name) {
          updateData.className = classInfo.name;
          needUpdate = true;
        }
        if (student.teacherId !== classInfo.teacherId) {
          updateData.teacherId = classInfo.teacherId;
          needUpdate = true;
        }
      }
      
      // 确保必要字段存在
      if (!student.status) {
        updateData.status = 'active';
        needUpdate = true;
      }
      if (!student.joinedAt) {
        updateData.joinedAt = new Date();
        needUpdate = true;
      }
      if (!student.createdAt) {
        updateData.createdAt = new Date();
        needUpdate = true;
      }
      
      if (needUpdate) {
        updateData.updatedAt = new Date();
        await db.collection('students').doc(student._id).update({
          data: updateData
        });
        fixedCount++;
        console.log('已修复学生 ' + student.name + ' 的数据');
      }
    }
    
    console.log('学生数据同步修复完成，共修复 ' + fixedCount + ' 个学生');
    return { success: true, message: '学生数据同步修复完成，共修复 ' + fixedCount + ' 个学生' };
    
  } catch (error) {
    console.error('修复学生数据同步失败:', error);
    return { success: false, message: error.message };
  }
}

// 主修复函数
async function runAllFixes() {
  try {
    console.log('开始修复学生加入班级数据同步问题...');
    console.log('=====================================');
    
    // 1. 修复班级学生人数统计
    const classCountResult = await fixClassStudentCount();
    console.log('班级学生人数统计修复结果: ' + (classCountResult.success ? '成功' : '失败'));
    console.log('-------------------------------------');
    
    // 2. 修复学生数据同步
    const studentSyncResult = await fixStudentDataSync();
    console.log('学生数据同步修复结果: ' + (studentSyncResult.success ? '成功' : '失败'));
    console.log('-------------------------------------');
    
    console.log('所有修复完成！');
    
    return {
      success: true,
      message: '学生加入班级数据同步问题修复完成',
      results: {
        classCountFix: classCountResult,
        studentSyncFix: studentSyncResult
      }
    };
    
  } catch (error) {
    console.error('修复过程中发生错误:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// 导出函数供外部调用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllFixes: runAllFixes,
    fixClassStudentCount: fixClassStudentCount,
    fixStudentDataSync: fixStudentDataSync
  };
}

// 如果直接运行此脚本
if (typeof window !== 'undefined' && window.wx) {
  // 在微信小程序环境中
  runAllFixes().then(result => {
    console.log('修复完成:', result);
  }).catch(error => {
    console.error('修复失败:', error);
  });
}
