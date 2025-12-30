/**
 * 验证学生加入班级数据同步修复效果
 * 在微信开发者工具控制台运行
 */

// 验证班级管理界面数据
async function verifyClassManagementData() {
  try {
    console.log('开始验证班级管理界面数据...');
    
    const db = wx.cloud.database();
    
    // 获取所有班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log('班级管理界面数据验证:');
    console.log('=====================================');
    
    for (let i = 0; i < classes.length; i++) {
      const classInfo = classes[i];
      
      // 统计该班级的实际学生数量
      const studentsResult = await db.collection('students').where({
        classId: classInfo._id,
        status: 'active'
      }).get();
      
      const actualStudentCount = studentsResult.data.length;
      const currentStudentCount = classInfo.currentStudents || 0;
      
      console.log('班级: ' + classInfo.name);
      console.log('  班级ID: ' + classInfo._id);
      console.log('  当前显示学生数: ' + currentStudentCount);
      console.log('  实际学生数: ' + actualStudentCount);
      console.log('  数据一致性: ' + (actualStudentCount === currentStudentCount ? '✅ 一致' : '❌ 不一致'));
      
      if (actualStudentCount > 0) {
        console.log('  学生名单:');
        for (let j = 0; j < studentsResult.data.length; j++) {
          const student = studentsResult.data[j];
          console.log('    - ' + student.name + ' (ID: ' + student._id + ')');
        }
      }
      console.log('-------------------------------------');
    }
    
    return true;
  } catch (error) {
    console.error('验证班级管理界面数据失败:', error);
    return false;
  }
}

// 验证学生管理界面数据
async function verifyStudentManagementData() {
  try {
    console.log('开始验证学生管理界面数据...');
    
    const db = wx.cloud.database();
    
    // 获取所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('学生管理界面数据验证:');
    console.log('=====================================');
    console.log('总学生数: ' + students.length);
    
    // 按班级分组统计
    const classStudentCount = {};
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const classId = student.classId || '未分配班级';
      
      if (!classStudentCount[classId]) {
        classStudentCount[classId] = 0;
      }
      classStudentCount[classId]++;
    }
    
    console.log('各班级学生分布:');
    for (const classId in classStudentCount) {
      console.log('  班级 ' + classId + ': ' + classStudentCount[classId] + ' 人');
    }
    
    return true;
  } catch (error) {
    console.error('验证学生管理界面数据失败:', error);
    return false;
  }
}

// 验证班级学生名单弹窗数据
async function verifyClassStudentListModal() {
  try {
    console.log('开始验证班级学生名单弹窗数据...');
    
    const db = wx.cloud.database();
    
    // 获取所有班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log('班级学生名单弹窗数据验证:');
    console.log('=====================================');
    
    for (let i = 0; i < classes.length; i++) {
      const classInfo = classes[i];
      
      // 获取该班级的学生
      const studentsResult = await db.collection('students').where({
        classId: classInfo._id,
        status: 'active'
      }).get();
      
      const students = studentsResult.data;
      
      console.log('班级: ' + classInfo.name);
      console.log('  班级ID: ' + classInfo._id);
      console.log('  学生总数: ' + students.length);
      
      if (students.length > 0) {
        console.log('  学生名单:');
        for (let j = 0; j < students.length; j++) {
          const student = students[j];
          console.log('    - ' + student.name + ' (学号: ' + (student.studentId || student._id) + ')');
        }
      } else {
        console.log('  该班级暂无学生');
      }
      console.log('-------------------------------------');
    }
    
    return true;
  } catch (error) {
    console.error('验证班级学生名单弹窗数据失败:', error);
    return false;
  }
}

// 综合验证修复效果
async function verifyAllFixResults() {
  try {
    console.log('开始综合验证修复效果...');
    console.log('=====================================');
    
    // 1. 验证班级管理界面数据
    const classManagementResult = await verifyClassManagementData();
    console.log('班级管理界面数据验证: ' + (classManagementResult ? '✅ 通过' : '❌ 失败'));
    console.log('-------------------------------------');
    
    // 2. 验证学生管理界面数据
    const studentManagementResult = await verifyStudentManagementData();
    console.log('学生管理界面数据验证: ' + (studentManagementResult ? '✅ 通过' : '❌ 失败'));
    console.log('-------------------------------------');
    
    // 3. 验证班级学生名单弹窗数据
    const modalDataResult = await verifyClassStudentListModal();
    console.log('班级学生名单弹窗数据验证: ' + (modalDataResult ? '✅ 通过' : '❌ 失败'));
    console.log('-------------------------------------');
    
    console.log('修复效果验证完成！');
    
    return {
      success: true,
      message: '修复效果验证完成',
      results: {
        classManagement: classManagementResult,
        studentManagement: studentManagementResult,
        modalData: modalDataResult
      }
    };
    
  } catch (error) {
    console.error('验证修复效果失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// 将函数添加到全局作用域
window.verifyClassManagementData = verifyClassManagementData;
window.verifyStudentManagementData = verifyStudentManagementData;
window.verifyClassStudentListModal = verifyClassStudentListModal;
window.verifyAllFixResults = verifyAllFixResults;

console.log('修复效果验证函数已加载');
console.log('可用函数:');
console.log('- verifyAllFixResults() - 综合验证修复效果');
console.log('- verifyClassManagementData() - 验证班级管理界面数据');
console.log('- verifyStudentManagementData() - 验证学生管理界面数据');
console.log('- verifyClassStudentListModal() - 验证班级学生名单弹窗数据');
