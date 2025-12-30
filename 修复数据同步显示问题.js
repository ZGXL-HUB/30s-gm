/**
 * 修复数据同步显示问题
 * 解决教师端界面显示与学生数据不一致的问题
 */

// 检查教师端数据加载问题
async function checkTeacherDataLoading() {
  try {
    console.log('开始检查教师端数据加载问题...');
    
    const db = wx.cloud.database();
    
    // 1. 检查数据库中的学生数据
    const allStudentsResult = await db.collection('students').get();
    const allStudents = allStudentsResult.data;
    
    console.log('数据库中学生数据检查:');
    console.log('=====================================');
    console.log('总学生数: ' + allStudents.length);
    
    // 按班级分组
    const studentsByClass = {};
    for (let i = 0; i < allStudents.length; i++) {
      const student = allStudents[i];
      const classId = student.classId || '未分配班级';
      
      if (!studentsByClass[classId]) {
        studentsByClass[classId] = [];
      }
      studentsByClass[classId].push(student);
    }
    
    console.log('各班级学生分布:');
    for (const classId in studentsByClass) {
      console.log('  班级 ' + classId + ': ' + studentsByClass[classId].length + ' 人');
      for (let j = 0; j < studentsByClass[classId].length; j++) {
        const student = studentsByClass[classId][j];
        console.log('    - ' + student.name + ' (ID: ' + student._id + ')');
      }
    }
    
    // 2. 检查班级"13"的学生
    const class13Students = studentsByClass['class_1759668109836'] || [];
    console.log('班级"13"学生详情:');
    console.log('  学生数量: ' + class13Students.length);
    for (let i = 0; i < class13Students.length; i++) {
      const student = class13Students[i];
      console.log('    - ' + student.name + ' (ID: ' + student._id + ')');
      console.log('      班级ID: ' + student.classId);
      console.log('      班级名称: ' + student.className);
      console.log('      状态: ' + student.status);
    }
    
    return {
      allStudents: allStudents,
      studentsByClass: studentsByClass,
      class13Students: class13Students
    };
    
  } catch (error) {
    console.error('检查教师端数据加载问题失败:', error);
    return null;
  }
}

// 修复教师端数据同步
async function fixTeacherDataSync() {
  try {
    console.log('开始修复教师端数据同步...');
    
    const db = wx.cloud.database();
    
    // 1. 获取所有学生数据
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('找到 ' + students.length + ' 个学生');
    
    // 2. 格式化学生数据，确保字段完整
    const formattedStudents = [];
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      
      // 确保必要字段存在
      const formattedStudent = {
        id: student._id,
        name: student.name || '未知学生',
        studentId: student.studentId || student._id,
        phone: student.phone || '',
        email: student.email || '',
        class: student.className || student.class || '未分配班级',
        classId: student.classId || null,
        status: student.status || 'active',
        completedAssignments: student.completedAssignments || 0,
        totalAssignments: student.totalAssignments || 0,
        averageAccuracy: student.averageAccuracy || 0,
        weakGrammarPoints: student.weakGrammarPoints || [],
        createTime: student.createTime || student.createdAt || new Date(),
        updateTime: student.updateTime || student.updatedAt || new Date(),
        joinedAt: student.joinedAt || student.createTime || new Date()
      };
      
      formattedStudents.push(formattedStudent);
    }
    
    console.log('格式化后的学生数据: ' + formattedStudents.length + ' 个');
    
    // 3. 更新本地存储（模拟教师端数据加载）
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    wx.setStorageSync('teacher_students_' + teacherId, formattedStudents);
    
    console.log('✅ 教师端学生数据已更新到本地存储');
    
    // 4. 按班级分组显示
    const studentsByClass = {};
    for (let i = 0; i < formattedStudents.length; i++) {
      const student = formattedStudents[i];
      const classId = student.classId || '未分配班级';
      
      if (!studentsByClass[classId]) {
        studentsByClass[classId] = [];
      }
      studentsByClass[classId].push(student);
    }
    
    console.log('按班级分组的学生数据:');
    for (const classId in studentsByClass) {
      console.log('  班级 ' + classId + ': ' + studentsByClass[classId].length + ' 人');
    }
    
    return formattedStudents;
    
  } catch (error) {
    console.error('修复教师端数据同步失败:', error);
    return null;
  }
}

// 修复班级学生数量统计
async function fixClassStudentCount() {
  try {
    console.log('开始修复班级学生数量统计...');
    
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
      const currentStudentCount = classInfo.currentStudents || 0;
      
      console.log('班级 ' + classInfo.name + ' (ID: ' + classInfo._id + '):');
      console.log('  当前显示: ' + currentStudentCount + ' 人');
      console.log('  实际学生: ' + actualStudentCount + ' 人');
      
      // 如果数量不一致，更新班级数据
      if (actualStudentCount !== currentStudentCount) {
        await db.collection('classes').doc(classInfo._id).update({
          data: {
            currentStudents: actualStudentCount,
            studentCount: actualStudentCount,
            updatedAt: new Date()
          }
        });
        
        console.log('✅ 已更新班级 ' + classInfo.name + ' 的学生数量为 ' + actualStudentCount);
      } else {
        console.log('✅ 班级 ' + classInfo.name + ' 的学生数量已正确');
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('修复班级学生数量统计失败:', error);
    return false;
  }
}

// 检查学生数据完整性
async function checkStudentDataIntegrity() {
  try {
    console.log('开始检查学生数据完整性...');
    
    const db = wx.cloud.database();
    
    // 获取所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('学生数据完整性检查:');
    console.log('=====================================');
    console.log('总学生数: ' + students.length);
    
    let validStudents = 0;
    let invalidStudents = 0;
    const issues = [];
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      let isValid = true;
      const studentIssues = [];
      
      // 检查必要字段
      if (!student.name) {
        studentIssues.push('缺少姓名');
        isValid = false;
      }
      
      if (!student.classId) {
        studentIssues.push('缺少班级ID');
        isValid = false;
      }
      
      if (!student.status) {
        studentIssues.push('缺少状态');
        isValid = false;
      }
      
      if (isValid) {
        validStudents++;
      } else {
        invalidStudents++;
        issues.push('学生 ' + student.name + ': ' + studentIssues.join(', '));
      }
    }
    
    console.log('有效学生: ' + validStudents + ' 人');
    console.log('无效学生: ' + invalidStudents + ' 人');
    
    if (issues.length > 0) {
      console.log('发现的问题:');
      for (let i = 0; i < issues.length; i++) {
        console.log('  - ' + issues[i]);
      }
    }
    
    return {
      validStudents: validStudents,
      invalidStudents: invalidStudents,
      issues: issues
    };
    
  } catch (error) {
    console.error('检查学生数据完整性失败:', error);
    return null;
  }
}

// 综合修复数据同步显示问题
async function runFullDataSyncFix() {
  try {
    console.log('开始综合修复数据同步显示问题...');
    console.log('=====================================');
    
    // 1. 检查教师端数据加载问题
    const dataCheck = await checkTeacherDataLoading();
    console.log('教师端数据加载检查: ' + (dataCheck ? '✅ 完成' : '❌ 失败'));
    console.log('-------------------------------------');
    
    // 2. 检查学生数据完整性
    const integrityCheck = await checkStudentDataIntegrity();
    console.log('学生数据完整性检查: ' + (integrityCheck ? '✅ 完成' : '❌ 失败'));
    console.log('-------------------------------------');
    
    // 3. 修复教师端数据同步
    const syncFix = await fixTeacherDataSync();
    console.log('教师端数据同步修复: ' + (syncFix ? '✅ 完成' : '❌ 失败'));
    console.log('-------------------------------------');
    
    // 4. 修复班级学生数量统计
    const countFix = await fixClassStudentCount();
    console.log('班级学生数量统计修复: ' + (countFix ? '✅ 完成' : '❌ 失败'));
    console.log('-------------------------------------');
    
    console.log('数据同步显示问题修复完成！');
    
    return {
      success: true,
      message: '数据同步显示问题修复完成',
      results: {
        dataCheck: dataCheck,
        integrityCheck: integrityCheck,
        syncFix: syncFix,
        countFix: countFix
      }
    };
    
  } catch (error) {
    console.error('综合修复数据同步显示问题失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// 将函数添加到全局作用域
window.checkTeacherDataLoading = checkTeacherDataLoading;
window.fixTeacherDataSync = fixTeacherDataSync;
window.fixClassStudentCount = fixClassStudentCount;
window.checkStudentDataIntegrity = checkStudentDataIntegrity;
window.runFullDataSyncFix = runFullDataSyncFix;

console.log('数据同步显示问题修复函数已加载');
console.log('可用函数:');
console.log('- runFullDataSyncFix() - 运行综合修复');
console.log('- checkTeacherDataLoading() - 检查教师端数据加载');
console.log('- fixTeacherDataSync() - 修复教师端数据同步');
console.log('- fixClassStudentCount() - 修复班级学生数量');
console.log('- checkStudentDataIntegrity() - 检查学生数据完整性');
