/**
 * 检查班级"13"的具体问题
 * 在微信开发者工具控制台运行
 */

// 检查班级"13"的详细信息
async function checkClass13Details() {
  try {
    console.log('开始检查班级"13"的详细信息...');
    
    const db = wx.cloud.database();
    
    // 1. 查找班级"13"
    const classesResult = await db.collection('classes').where({
      name: '13'
    }).get();
    
    console.log('班级"13"查询结果:');
    console.log('=====================================');
    console.log('找到班级数: ' + classesResult.data.length);
    
    if (classesResult.data.length > 0) {
      const classInfo = classesResult.data[0];
      console.log('班级详情:');
      console.log('  ID: ' + classInfo._id);
      console.log('  名称: ' + classInfo.name);
      console.log('  当前学生数: ' + (classInfo.currentStudents || 0));
      console.log('  最大学生数: ' + (classInfo.maxStudents || 0));
      console.log('  教师ID: ' + (classInfo.teacherId || '未知'));
      console.log('  状态: ' + (classInfo.status || '未知'));
      console.log('  创建时间: ' + (classInfo.createTime || '未知'));
      
      // 2. 查找属于班级"13"的学生
      const studentsResult = await db.collection('students').where({
        classId: classInfo._id
      }).get();
      
      console.log('班级"13"的学生:');
      console.log('  学生数量: ' + studentsResult.data.length);
      
      for (let i = 0; i < studentsResult.data.length; i++) {
        const student = studentsResult.data[i];
        console.log('    - ' + student.name + ' (ID: ' + student._id + ')');
        console.log('      班级ID: ' + student.classId);
        console.log('      班级名称: ' + student.className);
        console.log('      状态: ' + student.status);
        console.log('      加入时间: ' + (student.joinedAt || '未知'));
      }
      
      return {
        classInfo: classInfo,
        students: studentsResult.data
      };
    } else {
      console.log('❌ 没有找到班级"13"');
      return null;
    }
    
  } catch (error) {
    console.error('检查班级"13"详细信息失败:', error);
    return null;
  }
}

// 检查所有班级信息
async function checkAllClasses() {
  try {
    console.log('开始检查所有班级信息...');
    
    const db = wx.cloud.database();
    
    // 获取所有班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log('所有班级信息:');
    console.log('=====================================');
    console.log('总班级数: ' + classes.length);
    
    for (let i = 0; i < classes.length; i++) {
      const classInfo = classes[i];
      console.log('班级 ' + (i + 1) + ':');
      console.log('  ID: ' + classInfo._id);
      console.log('  名称: ' + classInfo.name);
      console.log('  当前学生数: ' + (classInfo.currentStudents || 0));
      console.log('  最大学生数: ' + (classInfo.maxStudents || 0));
      console.log('  教师ID: ' + (classInfo.teacherId || '未知'));
      console.log('  状态: ' + (classInfo.status || '未知'));
      console.log('-------------------------------------');
    }
    
    return classes;
    
  } catch (error) {
    console.error('检查所有班级信息失败:', error);
    return null;
  }
}

// 修复班级"13"的学生数量统计
async function fixClass13StudentCount() {
  try {
    console.log('开始修复班级"13"的学生数量统计...');
    
    const db = wx.cloud.database();
    
    // 1. 查找班级"13"
    const classesResult = await db.collection('classes').where({
      name: '13'
    }).get();
    
    if (classesResult.data.length === 0) {
      console.log('❌ 没有找到班级"13"');
      return false;
    }
    
    const classInfo = classesResult.data[0];
    console.log('找到班级"13": ' + classInfo._id);
    
    // 2. 统计该班级的实际学生数量
    const studentsResult = await db.collection('students').where({
      classId: classInfo._id,
      status: 'active'
    }).count();
    
    const actualStudentCount = studentsResult.total;
    const currentStudentCount = classInfo.currentStudents || 0;
    
    console.log('班级"13"学生数量统计:');
    console.log('  当前显示: ' + currentStudentCount + ' 人');
    console.log('  实际学生: ' + actualStudentCount + ' 人');
    
    // 3. 如果数量不一致，更新班级数据
    if (actualStudentCount !== currentStudentCount) {
      await db.collection('classes').doc(classInfo._id).update({
        data: {
          currentStudents: actualStudentCount,
          studentCount: actualStudentCount,
          updatedAt: new Date()
        }
      });
      
      console.log('✅ 已更新班级"13"的学生数量为 ' + actualStudentCount);
    } else {
      console.log('✅ 班级"13"的学生数量已正确');
    }
    
    return true;
    
  } catch (error) {
    console.error('修复班级"13"学生数量统计失败:', error);
    return false;
  }
}

// 检查学生数据中的班级ID映射
async function checkStudentClassMapping() {
  try {
    console.log('开始检查学生数据中的班级ID映射...');
    
    const db = wx.cloud.database();
    
    // 获取所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('学生班级ID映射检查:');
    console.log('=====================================');
    console.log('总学生数: ' + students.length);
    
    // 统计班级ID分布
    const classIdCount = {};
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const classId = student.classId || '未分配班级';
      
      if (!classIdCount[classId]) {
        classIdCount[classId] = 0;
      }
      classIdCount[classId]++;
    }
    
    console.log('班级ID分布:');
    for (const classId in classIdCount) {
      console.log('  ' + classId + ': ' + classIdCount[classId] + ' 人');
    }
    
    // 查找可能属于班级"13"的学生
    const possibleClass13Students = [];
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      if (student.className === '13' || student.class === '13') {
        possibleClass13Students.push(student);
      }
    }
    
    if (possibleClass13Students.length > 0) {
      console.log('可能属于班级"13"的学生:');
      for (let i = 0; i < possibleClass13Students.length; i++) {
        const student = possibleClass13Students[i];
        console.log('  - ' + student.name + ' (ID: ' + student._id + ')');
        console.log('    班级ID: ' + student.classId);
        console.log('    班级名称: ' + student.className);
        console.log('    班级: ' + student.class);
      }
    } else {
      console.log('没有找到可能属于班级"13"的学生');
    }
    
    return {
      classIdCount: classIdCount,
      possibleClass13Students: possibleClass13Students
    };
    
  } catch (error) {
    console.error('检查学生数据中的班级ID映射失败:', error);
    return null;
  }
}

// 将函数添加到全局作用域
window.checkClass13Details = checkClass13Details;
window.checkAllClasses = checkAllClasses;
window.fixClass13StudentCount = fixClass13StudentCount;
window.checkStudentClassMapping = checkStudentClassMapping;

console.log('班级"13"问题检查函数已加载');
console.log('可用函数:');
console.log('- checkClass13Details() - 检查班级"13"详细信息');
console.log('- checkAllClasses() - 检查所有班级信息');
console.log('- fixClass13StudentCount() - 修复班级"13"学生数量');
console.log('- checkStudentClassMapping() - 检查学生班级ID映射');
