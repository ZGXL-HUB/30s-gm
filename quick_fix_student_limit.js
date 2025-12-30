// 快速修复学生显示限制问题
// 在微信开发者工具控制台中运行此代码

async function quickFixStudentLimit() {
  console.log('🔧 快速修复学生显示限制问题...');
  
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
    
    // 1. 清除本地缓存
    console.log('🧹 清除本地缓存...');
    wx.removeStorageSync(`teacher_students_${teacherId}`);
    wx.removeStorageSync(`teacher_classes_${teacherId}`);
    wx.removeStorageSync(`class_templates_${teacherId}`);
    
    // 清除所有班级学生缓存
    try {
      const classesResult = await db.collection('classes').where({
        teacherId: teacherId
      }).get();
      
      classesResult.data.forEach(classInfo => {
        wx.removeStorageSync(`class_students_${classInfo._id}`);
      });
      
      console.log(`✅ 已清除 ${classesResult.data.length} 个班级的学生缓存`);
    } catch (error) {
      console.warn('清除班级缓存失败:', error);
    }
    
    // 2. 使用修复后的查询方法重新获取所有学生数据
    console.log('🔍 重新查询所有学生数据（使用limit(10000)）...');
    
    let allStudents = [];
    const existingIds = new Set();
    
    try {
      // 方法1：分页查询teacherId匹配的学生
      console.log('方法1：分页查询...');
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
      console.log(`方法1查询到学生数量: ${allStudents.length}`);
    } catch (error) {
      console.warn('方法1查询失败:', error);
    }
    
    // 方法2：查询所有学生然后过滤
    try {
      console.log('方法2：查询所有学生...');
      const allRecords = await db.collection('students').limit(10000).get();
      console.log(`方法2查询到所有学生记录: ${allRecords.data.length}`);
      
      allRecords.data.forEach(student => {
        if (!existingIds.has(student._id)) {
          // 匹配条件：teacherId匹配
          if (student.teacherId === teacherId) {
            allStudents.push(student);
            existingIds.add(student._id);
          }
        }
      });
      console.log(`方法2合并后学生数量: ${allStudents.length}`);
    } catch (error) {
      console.warn('方法2查询失败:', error);
    }
    
    // 3. 获取班级数据
    console.log('📚 获取班级数据...');
    const classesResult = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
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
      totalAssignments: cls.totalAssignments || 0
    }));
    
    // 4. 格式化学生数据
    console.log('🔄 格式化学生数据...');
    const formattedStudents = allStudents.map(student => ({
      id: student._id,
      name: student.name,
      studentId: student.studentId || student._id,
      class: student.class || student.className || '未知班级',
      classId: student.classId,
      teacherId: student.teacherId,
      status: student.status || 'active',
      phone: student.phone || '',
      email: student.email || '',
      joinedAt: student.joinedAt || student.createTime,
      completedAssignments: student.completedAssignments || 0,
      totalAssignments: student.totalAssignments || 0,
      averageAccuracy: student.averageAccuracy || 0,
      weakGrammarPoints: student.weakGrammarPoints || []
    }));
    
    // 5. 更新本地存储
    console.log('💾 更新本地存储...');
    wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
    wx.setStorageSync(`teacher_classes_${teacherId}`, formattedClasses);
    
    // 6. 更新页面数据
    console.log('🔄 更新页面数据...');
    currentPage.setData({
      students: [...formattedStudents], // 使用展开运算符确保触发更新
      classes: [...formattedClasses]
    });
    
    // 7. 强制刷新显示
    console.log('🔄 强制刷新显示...');
    if (currentPage.data.currentTab === 'students') {
      // 如果当前在学生管理页面，切换到班级列表再切换回来
      currentPage.setData({ currentTab: 'classes' });
      setTimeout(() => {
        currentPage.setData({ currentTab: 'students' });
      }, 100);
    }
    
    // 8. 显示修复结果
    console.log('');
    console.log('🎉 学生显示限制问题修复完成！');
    console.log('');
    console.log('📊 修复结果:');
    console.log(`- 班级数量: ${formattedClasses.length}`);
    console.log(`- 学生数量: ${formattedStudents.length}`);
    console.log(`- 前端显示: ${currentPage.data.students.length} 个学生`);
    console.log(`- 前端班级: ${currentPage.data.classes.length} 个班级`);
    
    // 9. 显示学生统计
    const classStats = {};
    formattedStudents.forEach(student => {
      const className = student.class;
      classStats[className] = (classStats[className] || 0) + 1;
    });
    
    console.log('');
    console.log('📊 班级学生统计:');
    Object.entries(classStats).forEach(([className, count]) => {
      console.log(`- ${className}: ${count} 个学生`);
    });
    
    // 10. 验证修复效果
    if (currentPage.data.students.length === formattedStudents.length) {
      console.log('✅ 修复成功：前端显示的学生数量与后端数据一致');
    } else {
      console.log('⚠️ 修复可能不完整：前端显示数量与后端数据不一致');
      console.log(`前端: ${currentPage.data.students.length}, 后端: ${formattedStudents.length}`);
    }
    
    wx.showToast({
      title: `修复完成，显示${formattedStudents.length}个学生`,
      icon: 'success',
      duration: 3000
    });
    
    return {
      success: true,
      message: '学生显示限制问题修复完成',
      studentsCount: formattedStudents.length,
      classesCount: formattedClasses.length,
      classStats: classStats
    };
    
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
    wx.showToast({
      title: '修复失败: ' + error.message,
      icon: 'none',
      duration: 3000
    });
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行修复
quickFixStudentLimit().then(result => {
  console.log('');
  console.log('📋 修复结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.success) {
    console.log(`📊 学生数量: ${result.studentsCount}`);
    console.log(`📚 班级数量: ${result.classesCount}`);
    
    if (result.classStats) {
      console.log('');
      console.log('📊 班级学生分布:');
      Object.entries(result.classStats).forEach(([className, count]) => {
        console.log(`  - ${className}: ${count} 个学生`);
      });
    }
  }
  
  console.log('');
  console.log('🎯 现在请检查前端界面，确认所有学生是否正确显示！');
});

console.log('✅ quickFixStudentLimit 函数已定义');
