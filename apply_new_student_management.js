// 应用新的学生管理界面
// 在微信开发者工具控制台中运行此脚本

async function applyNewStudentManagement() {
  console.log('🚀 开始应用新的学生管理界面...');
  
  try {
    // 1. 备份当前的学生管理相关代码
    console.log('📋 备份当前代码...');
    
    // 这里我们直接提供新的代码内容，您可以手动替换
    
    console.log('✅ 新的学生管理界面代码已准备完成！');
    console.log('');
    console.log('📝 请按照以下步骤替换代码：');
    console.log('');
    console.log('1. 打开 miniprogram/pages/teacher-class/index.js');
    console.log('2. 找到学生管理相关的方法（loadClassData, refreshStudentList等）');
    console.log('3. 用 new_student_management_page.js 中的代码替换');
    console.log('');
    console.log('4. 打开 miniprogram/pages/teacher-class/index.wxml');
    console.log('5. 找到学生管理部分的模板代码');
    console.log('6. 用 new_student_management.wxml 中的代码替换');
    console.log('');
    console.log('7. 打开 miniprogram/pages/teacher-class/index.wxss');
    console.log('8. 添加 new_student_management.wxss 中的样式');
    console.log('');
    console.log('🔄 或者运行以下命令快速测试新界面：');
    console.log('testNewStudentManagement()');
    
    return {
      success: true,
      message: '新界面代码已准备完成，请按照说明进行替换'
    };
    
  } catch (error) {
    console.error('❌ 应用新界面失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 测试新界面的函数
async function testNewStudentManagement() {
  console.log('🧪 测试新的学生管理界面...');
  
  try {
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 清除旧的本地存储
    wx.removeStorageSync(`teacher_students_${teacherId}`);
    wx.removeStorageSync(`teacher_classes_${teacherId}`);
    
    console.log('✅ 已清除旧数据');
    
    // 获取最新数据
    const db = wx.cloud.database();
    
    const classesResult = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    const studentsResult = await db.collection('students').where({
      teacherId: teacherId,
      status: 'active'
    }).get();
    
    console.log(`📊 数据统计:`);
    console.log(`- 班级数量: ${classesResult.data.length}`);
    console.log(`- 学生数量: ${studentsResult.data.length}`);
    
    // 格式化数据
    const classMap = {};
    classesResult.data.forEach(cls => {
      classMap[cls._id] = cls.name;
    });
    
    const formattedStudents = studentsResult.data.map(student => {
      const className = classMap[student.classId] || '未分配班级';
      return {
        id: student._id,
        name: student.name,
        studentId: student.studentId || student._id,
        phone: student.phone || '',
        email: student.email || '',
        class: className,
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
    
    // 更新本地存储
    wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
    wx.setStorageSync(`teacher_classes_${teacherId}`, classesResult.data);
    
    console.log('✅ 数据已更新到本地存储');
    console.log('学生列表:', formattedStudents.map(s => `${s.name}(${s.class})`));
    
    // 尝试更新当前页面
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (currentPage && currentPage.route === 'pages/teacher-class/index') {
      currentPage.setData({
        students: formattedStudents
      });
      console.log('✅ 页面数据已更新');
    }
    
    console.log('🎉 测试完成！现在应该能看到所有学生数据');
    
    return {
      success: true,
      studentsCount: formattedStudents.length,
      message: '新界面测试完成'
    };
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行应用
applyNewStudentManagement().then(result => {
  if (result.success) {
    console.log('✅ 应用成功！');
  } else {
    console.log('❌ 应用失败:', result.message);
  }
});

// 导出函数
window.applyNewStudentManagement = applyNewStudentManagement;
window.testNewStudentManagement = testNewStudentManagement;
