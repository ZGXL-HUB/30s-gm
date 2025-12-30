/**
 * 修复前端显示问题
 * 解决教师端界面显示学生数量不完整的问题
 */

// 强制刷新教师端数据
async function forceRefreshTeacherData() {
  try {
    console.log('开始强制刷新教师端数据...');
    
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 1. 清除本地缓存
    wx.removeStorageSync('teacher_students_' + teacherId);
    wx.removeStorageSync('teacher_classes_' + teacherId);
    console.log('✅ 已清除本地缓存');
    
    // 2. 从云端重新获取班级数据
    const classesResult = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    console.log('从云端获取班级数据: ' + classesResult.data.length + ' 个');
    
    // 3. 从云端重新获取学生数据
    const studentsResult = await db.collection('students').where({
      teacherId: teacherId
    }).get();
    
    console.log('从云端获取学生数据: ' + studentsResult.data.length + ' 个');
    
    // 4. 格式化学生数据
    const formattedStudents = studentsResult.data.map(student => ({
      id: student._id,
      name: student.name,
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
      updateTime: student.updateTime || student.updatedAt || new Date()
    }));
    
    console.log('格式化后的学生数据: ' + formattedStudents.length + ' 个');
    
    // 5. 按班级分组显示
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
      for (let j = 0; j < studentsByClass[classId].length; j++) {
        const student = studentsByClass[classId][j];
        console.log('    - ' + student.name + ' (ID: ' + student.id + ')');
      }
    }
    
    // 6. 更新本地存储
    wx.setStorageSync('teacher_students_' + teacherId, formattedStudents);
    wx.setStorageSync('teacher_classes_' + teacherId, classesResult.data);
    
    console.log('✅ 教师端数据已强制刷新并更新到本地存储');
    
    return {
      classes: classesResult.data,
      students: formattedStudents,
      studentsByClass: studentsByClass
    };
    
  } catch (error) {
    console.error('强制刷新教师端数据失败:', error);
    return null;
  }
}

// 检查教师端页面数据加载逻辑
async function checkTeacherPageDataLoading() {
  try {
    console.log('开始检查教师端页面数据加载逻辑...');
    
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 1. 检查本地存储的数据
    const localStudents = wx.getStorageSync('teacher_students_' + teacherId) || [];
    const localClasses = wx.getStorageSync('teacher_classes_' + teacherId) || [];
    
    console.log('本地存储数据检查:');
    console.log('  本地学生数: ' + localStudents.length);
    console.log('  本地班级数: ' + localClasses.length);
    
    // 2. 检查云端数据
    const cloudStudentsResult = await db.collection('students').where({
      teacherId: teacherId
    }).get();
    
    const cloudClassesResult = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    console.log('云端数据检查:');
    console.log('  云端学生数: ' + cloudStudentsResult.data.length);
    console.log('  云端班级数: ' + cloudClassesResult.data.length);
    
    // 3. 比较数据差异
    if (localStudents.length !== cloudStudentsResult.data.length) {
      console.log('⚠️ 本地学生数据与云端不一致');
      console.log('  本地: ' + localStudents.length + ' 人');
      console.log('  云端: ' + cloudStudentsResult.data.length + ' 人');
    } else {
      console.log('✅ 本地学生数据与云端一致');
    }
    
    if (localClasses.length !== cloudClassesResult.data.length) {
      console.log('⚠️ 本地班级数据与云端不一致');
      console.log('  本地: ' + localClasses.length + ' 个');
      console.log('  云端: ' + cloudClassesResult.data.length + ' 个');
    } else {
      console.log('✅ 本地班级数据与云端一致');
    }
    
    return {
      localStudents: localStudents,
      localClasses: localClasses,
      cloudStudents: cloudStudentsResult.data,
      cloudClasses: cloudClassesResult.data
    };
    
  } catch (error) {
    console.error('检查教师端页面数据加载逻辑失败:', error);
    return null;
  }
}

// 修复学生数据字段问题
async function fixStudentDataFields() {
  try {
    console.log('开始修复学生数据字段问题...');
    
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
      
      // 检查并修复必要字段
      if (!student.className && student.classId) {
        // 根据班级ID获取班级名称
        const classResult = await db.collection('classes').doc(student.classId).get();
        if (classResult.data) {
          updateData.className = classResult.data.name;
          needUpdate = true;
        }
      }
      
      if (!student.teacherId && student.classId) {
        // 根据班级ID获取教师ID
        const classResult = await db.collection('classes').doc(student.classId).get();
        if (classResult.data) {
          updateData.teacherId = classResult.data.teacherId;
          needUpdate = true;
        }
      }
      
      if (!student.status) {
        updateData.status = 'active';
        needUpdate = true;
      }
      
      if (!student.joinedAt) {
        updateData.joinedAt = new Date();
        needUpdate = true;
      }
      
      if (needUpdate) {
        updateData.updatedAt = new Date();
        await db.collection('students').doc(student._id).update({
          data: updateData
        });
        
        console.log('✅ 已修复学生 ' + student.name + ' 的数据字段');
        fixedCount++;
      }
    }
    
    console.log('学生数据字段修复完成，共修复 ' + fixedCount + ' 个学生');
    return true;
    
  } catch (error) {
    console.error('修复学生数据字段问题失败:', error);
    return false;
  }
}

// 模拟教师端页面刷新
async function simulateTeacherPageRefresh() {
  try {
    console.log('开始模拟教师端页面刷新...');
    
    // 1. 强制刷新数据
    const refreshResult = await forceRefreshTeacherData();
    if (!refreshResult) {
      console.log('❌ 数据刷新失败');
      return false;
    }
    
    // 2. 修复学生数据字段
    const fieldFix = await fixStudentDataFields();
    if (!fieldFix) {
      console.log('❌ 学生数据字段修复失败');
      return false;
    }
    
    // 3. 再次刷新数据
    const finalRefresh = await forceRefreshTeacherData();
    if (!finalRefresh) {
      console.log('❌ 最终数据刷新失败');
      return false;
    }
    
    console.log('✅ 教师端页面刷新模拟完成');
    console.log('请手动刷新教师端页面查看效果');
    
    return true;
    
  } catch (error) {
    console.error('模拟教师端页面刷新失败:', error);
    return false;
  }
}

// 将函数添加到全局作用域
window.forceRefreshTeacherData = forceRefreshTeacherData;
window.checkTeacherPageDataLoading = checkTeacherPageDataLoading;
window.fixStudentDataFields = fixStudentDataFields;
window.simulateTeacherPageRefresh = simulateTeacherPageRefresh;

console.log('前端显示问题修复函数已加载');
console.log('可用函数:');
console.log('- simulateTeacherPageRefresh() - 模拟教师端页面刷新');
console.log('- forceRefreshTeacherData() - 强制刷新教师端数据');
console.log('- checkTeacherPageDataLoading() - 检查教师端页面数据加载');
console.log('- fixStudentDataFields() - 修复学生数据字段');
