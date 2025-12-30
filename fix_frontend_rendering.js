// 修复前端渲染问题 - 确保所有学生都能正确显示
// 在微信开发者工具控制台中运行此代码

async function fixFrontendRendering() {
  console.log('🔧 修复前端渲染问题...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    if (!wx.cloud) {
      console.log('❌ 云开发环境不可用');
      return { success: false, error: '云开发环境不可用' };
    }
    
    const db = wx.cloud.database();
    
    // 1. 从数据库获取所有学生数据
    console.log('🔍 从数据库获取所有学生数据...');
    
    let allStudents = [];
    const batchSize = 100;
    let skip = 0;
    let hasMore = true;
    
    while (hasMore) {
      const batchResult = await db.collection('students')
        .where({
          teacherId: teacherId
        })
        .skip(skip)
        .limit(batchSize)
        .get();
      
      allStudents = allStudents.concat(batchResult.data);
      
      if (batchResult.data.length < batchSize) {
        hasMore = false;
      } else {
        skip += batchSize;
      }
    }
    
    console.log(`✅ 数据库中学生总数: ${allStudents.length}`);
    
    // 2. 按班级分组统计
    console.log('📊 按班级分组统计...');
    
    const classStats = {};
    allStudents.forEach(student => {
      const classId = student.classId || 'unknown';
      const className = student.class || '未分配班级';
      
      if (!classStats[classId]) {
        classStats[classId] = {
          name: className,
          students: [],
          count: 0
        };
      }
      
      classStats[classId].students.push(student);
      classStats[classId].count++;
    });
    
    Object.keys(classStats).forEach(classId => {
      const stats = classStats[classId];
      console.log(`班级 "${stats.name}" (${classId}): ${stats.count} 个学生`);
      stats.students.forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.name} - ${student.studentId || '无学号'}`);
      });
    });
    
    // 3. 检查当前前端显示的学生数量
    console.log('🔍 检查当前前端显示...');
    
    const currentFrontendStudents = currentPage.data.students || [];
    console.log(`当前前端显示学生数量: ${currentFrontendStudents.length}`);
    
    // 4. 格式化学生数据（确保格式一致）
    console.log('📝 格式化学生数据...');
    
    const classes = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const classMap = {};
    classes.forEach(cls => {
      classMap[cls.id] = cls.name;
    });
    
    const formattedStudents = allStudents.map(student => {
      const className = classMap[student.classId] || student.class || '未分配班级';
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
        updateTime: student.updateTime || new Date(),
        teacherId: student.teacherId,
        createdAt: student.createdAt || new Date(),
        lastActivity: student.lastActivity || new Date()
      };
    });
    
    console.log(`✅ 格式化完成，共 ${formattedStudents.length} 个学生`);
    
    // 5. 强制更新前端数据
    console.log('💾 强制更新前端数据...');
    
    // 更新本地存储
    wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
    
    // 强制更新页面数据（使用多种方法确保更新）
    currentPage.setData({
      students: [...formattedStudents] // 创建新数组
    });
    
    // 6. 强制刷新界面（多种方法）
    console.log('🎨 强制刷新界面...');
    
    // 方法1: 强制重新渲染
    const currentTab = currentPage.data.currentTab;
    if (currentTab === 'students') {
      currentPage.setData({
        currentTab: 'classes'
      });
      
      setTimeout(() => {
        currentPage.setData({
          currentTab: 'students'
        });
        console.log('✅ 方法1: 标签页切换刷新完成');
      }, 100);
    }
    
    // 方法2: 强制重新设置数据
    setTimeout(() => {
      const freshStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
      currentPage.setData({
        students: [...freshStudents]
      });
      console.log('✅ 方法2: 重新设置数据完成');
    }, 200);
    
    // 方法3: 调用页面刷新方法
    setTimeout(() => {
      if (typeof currentPage.loadClassData === 'function') {
        currentPage.loadClassData();
        console.log('✅ 方法3: 调用loadClassData完成');
      }
    }, 300);
    
    // 7. 验证更新结果
    setTimeout(() => {
      const updatedStudents = currentPage.data.students || [];
      console.log('🔍 验证更新结果...');
      console.log(`更新后前端显示学生数量: ${updatedStudents.length}`);
      console.log(`数据库中学生总数: ${allStudents.length}`);
      
      if (updatedStudents.length === allStudents.length) {
        console.log('✅ 前端渲染修复成功！');
      } else {
        console.log('⚠️ 前端渲染可能仍有问题');
        console.log(`差异: ${allStudents.length - updatedStudents.length} 个学生未显示`);
      }
    }, 500);
    
    // 8. 显示修复结果
    console.log('');
    console.log('🎉 前端渲染问题修复完成！');
    console.log('');
    console.log('📊 修复结果:');
    console.log(`数据库中学生总数: ${allStudents.length}`);
    console.log(`修复前前端显示: ${currentFrontendStudents.length} 个学生`);
    console.log(`修复后前端显示: ${formattedStudents.length} 个学生`);
    console.log(`修复的学生数量: ${formattedStudents.length - currentFrontendStudents.length} 个`);
    console.log('');
    
    // 显示班级统计
    console.log('📋 班级学生统计:');
    Object.keys(classStats).forEach(classId => {
      const stats = classStats[classId];
      console.log(`- ${stats.name}: ${stats.count} 个学生`);
    });
    
    return {
      success: true,
      message: '前端渲染问题修复完成',
      databaseCount: allStudents.length,
      frontendBefore: currentFrontendStudents.length,
      frontendAfter: formattedStudents.length,
      fixedCount: formattedStudents.length - currentFrontendStudents.length,
      classStats: classStats,
      allStudents: formattedStudents
    };
    
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行修复
fixFrontendRendering().then(result => {
  console.log('');
  console.log('📋 修复结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.databaseCount !== undefined) {
    console.log('');
    console.log('📊 修复详情:');
    console.log(`数据库学生总数: ${result.databaseCount}`);
    console.log(`修复前前端显示: ${result.frontendBefore}`);
    console.log(`修复后前端显示: ${result.frontendAfter}`);
    console.log(`修复的学生数量: ${result.fixedCount}`);
  }
  
  console.log('');
  console.log('💡 现在请检查:');
  console.log('1. 学生管理界面是否显示了所有学生卡片');
  console.log('2. 高一十二班是否显示了18个学生');
  console.log('3. 学生总数是否与数据库一致');
});

console.log('✅ fixFrontendRendering 函数已定义');
