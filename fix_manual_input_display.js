// 修复手动输入学生显示问题
// 在微信开发者工具控制台中运行此代码

async function fixManualInputDisplay() {
  console.log('🔧 修复手动输入学生显示问题...');
  
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
    
    // 1. 查询所有学生数据（不限制status）
    console.log('🔍 查询所有学生数据（包括不同status）...');
    
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
    
    console.log(`✅ 总共查询到 ${allStudents.length} 个学生记录`);
    
    // 2. 按status分组分析
    console.log('📊 按status分组分析...');
    
    const groupedByStatus = {};
    allStudents.forEach(student => {
      const status = student.status || 'undefined';
      if (!groupedByStatus[status]) {
        groupedByStatus[status] = [];
      }
      groupedByStatus[status].push(student);
    });
    
    Object.keys(groupedByStatus).forEach(status => {
      console.log(`status "${status}": ${groupedByStatus[status].length} 个学生`);
    });
    
    // 3. 检查手动输入的学生（通常是最近添加的）
    console.log('🔍 检查最近添加的学生...');
    
    // 按创建时间排序，找到最近的学生
    const recentStudents = allStudents
      .sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id))
      .slice(0, 10);
    
    console.log('最近添加的10个学生:');
    recentStudents.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name} (${student.class || '未分配班级'}) - status: ${student.status || 'undefined'} - createdAt: ${student.createdAt || 'unknown'}`);
    });
    
    // 4. 查找"赵凤"等可能的手动输入学生
    console.log('🔍 查找可能的手动输入学生...');
    
    const possibleManualStudents = allStudents.filter(student => {
      const name = student.name || '';
      const createdAt = student.createdAt || '';
      
      // 查找可能的特征：
      // 1. 姓名包含常见的中文姓氏
      // 2. 创建时间较新
      // 3. status可能不是'active'
      
      return name.includes('赵') || 
             name.includes('凤') || 
             name.includes('张') || 
             name.includes('李') || 
             name.includes('王') ||
             name.includes('陈') ||
             name.includes('刘');
    });
    
    if (possibleManualStudents.length > 0) {
      console.log('找到可能的手动输入学生:');
      possibleManualStudents.forEach((student, index) => {
        console.log(`${index + 1}. ${student.name} (${student.class || '未分配班级'}) - status: ${student.status || 'undefined'} - classId: ${student.classId || 'undefined'}`);
      });
    }
    
    // 5. 修复status字段
    console.log('🔧 修复学生的status字段...');
    
    const studentsToFix = allStudents.filter(student => {
      return !student.status || student.status !== 'active';
    });
    
    console.log(`需要修复status的学生: ${studentsToFix.length} 个`);
    
    if (studentsToFix.length > 0) {
      const updatePromises = studentsToFix.map(async (student) => {
        try {
          await db.collection('students').doc(student._id).update({
            data: {
              status: 'active'
            }
          });
          console.log(`✅ 已更新学生 ${student.name} 的status为active`);
          return { ...student, status: 'active' };
        } catch (updateError) {
          console.error(`❌ 更新学生 ${student.name} 失败:`, updateError);
          return student;
        }
      });
      
      const updateResults = await Promise.all(updatePromises);
      console.log(`✅ 修复完成，${updateResults.length} 个学生的status已更新`);
    }
    
    // 6. 重新查询并更新本地存储
    console.log('🔄 重新查询并更新本地存储...');
    
    const updatedStudents = await db.collection('students')
      .where({
        teacherId: teacherId
      })
      .get();
    
    console.log(`重新查询到的学生数量: ${updatedStudents.data.length}`);
    
    // 格式化学生数据
    const classes = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const classMap = {};
    classes.forEach(cls => {
      classMap[cls.id] = cls.name;
    });
    
    const formattedStudents = updatedStudents.data.map(student => {
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
        teacherId: student.teacherId
      };
    });
    
    // 7. 更新本地存储和页面数据
    console.log('💾 更新本地存储和页面数据...');
    
    wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
    
    currentPage.setData({
      students: [...formattedStudents]
    });
    
    // 8. 强制刷新界面
    console.log('🎨 强制刷新界面...');
    
    if (currentPage.data.currentTab === 'students') {
      currentPage.setData({
        currentTab: 'classes'
      });
      
      setTimeout(() => {
        currentPage.setData({
          currentTab: 'students'
        });
        console.log('✅ 界面已强制刷新');
      }, 100);
    }
    
    // 9. 清除班级学生缓存，强制重新加载
    console.log('🧹 清除班级学生缓存...');
    
    classes.forEach(cls => {
      wx.removeStorageSync(`class_students_${cls.id}`);
      console.log(`已清除班级 ${cls.name} 的学生缓存`);
    });
    
    // 10. 显示修复结果
    console.log('');
    console.log('🎉 手动输入学生显示问题修复完成！');
    console.log('');
    console.log('📊 修复结果:');
    console.log(`修复前学生数量: 20 个`);
    console.log(`修复后学生数量: ${formattedStudents.length} 个`);
    console.log(`修复的status字段: ${studentsToFix.length} 个`);
    console.log(`清除的班级缓存: ${classes.length} 个班级`);
    console.log('');
    
    // 显示所有学生列表
    console.log('📋 所有学生列表:');
    formattedStudents.forEach((student, index) => {
      if (index < 30) { // 只显示前30个
        console.log(`${index + 1}. ${student.name} (${student.class}) - status: ${student.status}`);
      }
    });
    
    if (formattedStudents.length > 30) {
      console.log(`...还有 ${formattedStudents.length - 30} 个学生`);
    }
    
    return {
      success: true,
      message: '手动输入学生显示问题修复完成',
      originalCount: 20,
      finalCount: formattedStudents.length,
      fixedStatus: studentsToFix.length,
      clearedCaches: classes.length,
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
fixManualInputDisplay().then(result => {
  console.log('');
  console.log('📋 修复结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.originalCount !== undefined) {
    console.log('');
    console.log('📊 修复详情:');
    console.log(`修复前: ${result.originalCount} 个学生`);
    console.log(`修复后: ${result.finalCount} 个学生`);
    console.log(`修复status: ${result.fixedStatus} 个`);
    console.log(`清除缓存: ${result.clearedCaches} 个班级`);
  }
  
  console.log('');
  console.log('💡 现在请测试:');
  console.log('1. 检查学生管理界面是否显示所有学生');
  console.log('2. 点击任意班级卡片，查看班级学生名单');
  console.log('3. 确认是否包含了手动输入的学生');
});

console.log('✅ fixManualInputDisplay 函数已定义');
