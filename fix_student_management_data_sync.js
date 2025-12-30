// 修复学生管理界面数据同步问题
// 在微信开发者工具控制台中运行此脚本

async function fixStudentManagementDataSync() {
  console.log('🔧 开始修复学生管理界面数据同步问题...');
  
  try {
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 1. 彻底清除所有相关的本地存储
    console.log('🧹 清除所有相关本地存储...');
    const storageKeys = [
      `teacher_students_${teacherId}`,
      `teacher_classes_${teacherId}`,
      `class_templates_${teacherId}`
    ];
    
    storageKeys.forEach(key => {
      wx.removeStorageSync(key);
      console.log(`✅ 已清除: ${key}`);
    });
    
    // 2. 重新从云端获取最新的班级数据
    console.log('📚 从云端获取最新班级数据...');
    const classesResult = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    console.log(`找到 ${classesResult.data.length} 个班级`);
    classesResult.data.forEach(cls => {
      console.log(`- ${cls.name} (ID: ${cls._id}, 学生数: ${cls.studentCount || 0})`);
    });
    
    // 3. 重新从云端获取最新的学生数据
    console.log('👥 从云端获取最新学生数据...');
    const studentsResult = await db.collection('students').where({
      teacherId: teacherId,
      status: 'active'
    }).get();
    
    console.log(`找到 ${studentsResult.data.length} 个学生`);
    studentsResult.data.forEach(student => {
      console.log(`- ${student.name} (ID: ${student._id}, 班级ID: ${student.classId})`);
    });
    
    // 4. 格式化学生数据
    console.log('🔄 格式化学生数据...');
    const formattedStudents = studentsResult.data.map(student => {
      // 查找对应的班级信息
      const classInfo = classesResult.data.find(cls => cls._id === student.classId);
      
      return {
        id: student._id,
        name: student.name,
        studentId: student.studentId || student._id,
        phone: student.phone || '',
        email: student.email || '',
        class: classInfo ? classInfo.name : '未分配班级',
        classId: student.classId || null,
        status: student.status || 'active',
        completedAssignments: student.completedAssignments || 0,
        totalAssignments: student.totalAssignments || 0,
        averageAccuracy: student.averageAccuracy || 0,
        weakGrammarPoints: student.weakGrammarPoints || [],
        createTime: student.createTime || new Date(),
        updateTime: student.updateTime || new Date()
      };
    });
    
    // 5. 格式化班级数据
    const formattedClasses = classesResult.data.map(cls => ({
      id: cls._id,
      name: cls.name,
      studentCount: cls.studentCount || 0,
      teacher: cls.teacher || '张老师',
      createdAt: cls.createdAt || new Date().toISOString().slice(0, 10),
      lastActivity: cls.lastActivity || new Date().toISOString(),
      status: cls.status || 'active',
      averageAccuracy: cls.averageAccuracy || 0,
      completedAssignments: cls.completedAssignments || 0,
      totalAssignments: cls.totalAssignments || 0,
      classType: cls.classType || '',
      subjectType: cls.subjectType || '',
      grade: cls.grade || '',
      semester: cls.semester || ''
    }));
    
    // 6. 更新本地存储
    console.log('💾 更新本地存储...');
    wx.setStorageSync(`teacher_classes_${teacherId}`, formattedClasses);
    wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
    
    console.log('✅ 本地存储更新完成');
    console.log(`📊 更新后的数据统计:`);
    console.log(`- 班级数量: ${formattedClasses.length}`);
    console.log(`- 学生数量: ${formattedStudents.length}`);
    
    // 7. 验证数据一致性
    console.log('🔍 验证数据一致性...');
    formattedStudents.forEach(student => {
      const classExists = formattedClasses.some(cls => cls.id === student.classId);
      if (!classExists && student.classId) {
        console.warn(`⚠️ 学生 ${student.name} 的班级ID ${student.classId} 在班级列表中不存在`);
      }
    });
    
    // 8. 强制刷新页面数据
    console.log('🔄 强制刷新页面数据...');
    
    // 获取当前页面实例
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (currentPage && currentPage.route === 'pages/teacher-class/index') {
      // 直接更新页面数据
      currentPage.setData({
        classes: formattedClasses,
        students: formattedStudents,
        classTemplates: []
      });
      
      console.log('✅ 页面数据已强制更新');
    } else {
      console.log('ℹ️ 当前不在教师班级管理页面，请手动刷新页面');
    }
    
    console.log('🎉 学生管理界面数据同步问题修复完成！');
    console.log('📋 修复总结:');
    console.log(`- 清除了所有相关本地存储缓存`);
    console.log(`- 重新从云端获取了 ${formattedClasses.length} 个班级数据`);
    console.log(`- 重新从云端获取了 ${formattedStudents.length} 个学生数据`);
    console.log(`- 更新了本地存储`);
    console.log(`- 强制刷新了页面数据`);
    
    return {
      success: true,
      classesCount: formattedClasses.length,
      studentsCount: formattedStudents.length,
      message: '数据同步问题修复成功'
    };
    
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
    return {
      success: false,
      error: error.message,
      message: '修复失败，请检查云开发环境'
    };
  }
}

// 执行修复
fixStudentManagementDataSync().then(result => {
  if (result.success) {
    console.log('✅ 修复成功！学生管理界面现在应该显示正确的数据');
  } else {
    console.log('❌ 修复失败:', result.message);
  }
});

// 导出函数供手动调用
window.fixStudentManagementDataSync = fixStudentManagementDataSync;
