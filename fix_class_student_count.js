// 修复班级学生数量统计问题
// 在微信开发者工具控制台运行此代码

async function fixClassStudentCount() {
  console.log('🔧 修复班级学生数量统计问题...');
  
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
    
    // 1. 获取所有班级
    console.log('📚 获取所有班级...');
    const classesResult = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    console.log(`找到 ${classesResult.data.length} 个班级`);
    
    // 2. 为每个班级重新统计学生数量
    console.log('🔍 重新统计每个班级的学生数量...');
    
    const updatedClasses = [];
    
    for (const classInfo of classesResult.data) {
      console.log(`处理班级: ${classInfo.name}`);
      
      // 统计该班级的实际学生数量
      const studentsResult = await db.collection('students').where({
        classId: classInfo._id,
        status: 'active'
      }).limit(10000).get();
      
      const actualStudentCount = studentsResult.data.length;
      const recordedCount = classInfo.studentCount || 0;
      
      console.log(`  - 记录的学生数: ${recordedCount}`);
      console.log(`  - 实际的学生数: ${actualStudentCount}`);
      
      // 如果数量不一致，更新班级数据
      if (actualStudentCount !== recordedCount) {
        console.log(`  - 需要更新: ${recordedCount} → ${actualStudentCount}`);
        
        await db.collection('classes').doc(classInfo._id).update({
          data: {
            studentCount: actualStudentCount,
            updatedAt: new Date()
          }
        });
        
        console.log(`  ✅ 已更新班级 ${classInfo.name} 的学生数量为 ${actualStudentCount}`);
      } else {
        console.log(`  ✅ 学生数量正确，无需更新`);
      }
      
      // 添加到更新后的班级列表
      updatedClasses.push({
        id: classInfo._id,
        name: classInfo.name,
        studentCount: actualStudentCount,
        teacher: classInfo.teacher || '张老师',
        createdAt: classInfo.createdAt || new Date().toISOString().slice(0, 10),
        lastActivity: classInfo.lastActivity || new Date().toISOString(),
        status: classInfo.status || 'active',
        averageAccuracy: classInfo.averageAccuracy || 0,
        completedAssignments: classInfo.completedAssignments || 0,
        totalAssignments: classInfo.totalAssignments || 0
      });
    }
    
    // 3. 更新本地存储
    console.log('💾 更新本地存储...');
    wx.setStorageSync(`teacher_classes_${teacherId}`, updatedClasses);
    
    // 4. 更新页面数据
    console.log('🔄 更新页面数据...');
    currentPage.setData({
      classes: [...updatedClasses]
    });
    
    // 5. 显示修复结果
    console.log('');
    console.log('🎉 班级学生数量统计修复完成！');
    console.log('');
    console.log('📊 修复结果:');
    
    updatedClasses.forEach(cls => {
      console.log(`- ${cls.name}: ${cls.studentCount} 个学生`);
    });
    
    // 6. 验证修复效果
    console.log('');
    console.log('🔍 验证修复效果...');
    
    const frontendClasses = currentPage.data.classes || [];
    console.log(`前端显示班级数: ${frontendClasses.length}`);
    
    frontendClasses.forEach(cls => {
      console.log(`- ${cls.name}: ${cls.studentCount} 个学生`);
    });
    
    wx.showToast({
      title: `修复完成，更新了${updatedClasses.length}个班级`,
      icon: 'success',
      duration: 3000
    });
    
    return {
      success: true,
      message: '班级学生数量统计修复完成',
      classesCount: updatedClasses.length,
      classes: updatedClasses
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
fixClassStudentCount().then(result => {
  console.log('');
  console.log('📋 修复结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.success) {
    console.log(`📚 班级数量: ${result.classesCount}`);
    
    if (result.classes) {
      console.log('');
      console.log('📊 班级学生统计:');
      result.classes.forEach(cls => {
        console.log(`  - ${cls.name}: ${cls.studentCount} 个学生`);
      });
    }
  }
  
  console.log('');
  console.log('🎯 现在请检查班级卡片，确认学生数量是否正确显示！');
});

console.log('✅ fixClassStudentCount 函数已定义');
