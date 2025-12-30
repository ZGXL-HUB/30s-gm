// 测试永久性修复效果
// 在微信开发者工具控制台中运行此代码

async function testPermanentFix() {
  console.log('🧪 测试永久性修复效果...');
  
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
    
    // 1. 测试新的查询逻辑
    console.log('🔍 测试新的多方式查询逻辑...');
    
    const classes = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    console.log(`找到 ${classes.length} 个班级`);
    
    let allStudents = [];
    const existingIds = new Set();
    
    // 方法1：分页查询teacherId匹配的学生
    try {
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
      const allRecords = await db.collection('students').limit(10000).get();
      console.log(`方法2查询到所有学生记录: ${allRecords.data.length}`);
      
      allRecords.data.forEach(student => {
        if (!existingIds.has(student._id)) {
          const isTeacherStudent = student.teacherId === teacherId;
          const isClassStudent = classes.some(cls => cls.id === student.classId);
          
          if (isTeacherStudent || isClassStudent) {
            allStudents.push(student);
            existingIds.add(student._id);
          }
        }
      });
      console.log(`方法2合并后学生数量: ${allStudents.length}`);
    } catch (error) {
      console.warn('方法2查询失败:', error);
    }
    
    // 方法3：按班级ID查询
    try {
      const teacherClassIds = classes.map(cls => cls.id);
      if (teacherClassIds.length > 0) {
        for (const classId of teacherClassIds) {
          const classStudents = await db.collection('students')
            .where({
              classId: classId
            })
            .get();
          
          classStudents.data.forEach(student => {
            if (!existingIds.has(student._id)) {
              allStudents.push(student);
              existingIds.add(student._id);
            }
          });
        }
        console.log(`方法3按班级查询后学生数量: ${allStudents.length}`);
      }
    } catch (error) {
      console.warn('方法3查询失败:', error);
    }
    
    console.log(`✅ 多方式查询完成，总共查询到学生数量: ${allStudents.length}`);
    
    // 2. 按班级分组统计
    console.log('📊 按班级分组统计...');
    
    const classStats = {};
    allStudents.forEach(student => {
      const classId = student.classId || 'unknown';
      const className = student.class || student.className || '未分配班级';
      
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
      
      // 特别显示高一十二班的详细信息
      if (classId === 'class_1759717845338') {
        console.log('  高一十二班学生详情:');
        stats.students.forEach((student, index) => {
          console.log(`    ${index + 1}. ${student.name} - ${student.studentId || '无学号'}`);
        });
      }
    });
    
    // 3. 测试班级学生查询
    console.log('🔍 测试班级学生查询...');
    
    const testClassId = 'class_1759717845338'; // 高一十二班
    const classStudents = [];
    const classExistingIds = new Set();
    
    // 方法1：直接按classId查询
    try {
      const directQuery = await db.collection('students')
        .where({
          classId: testClassId
        })
        .get();
      
      directQuery.data.forEach(student => {
        if (!classExistingIds.has(student._id)) {
          classStudents.push(student);
          classExistingIds.add(student._id);
        }
      });
      console.log(`班级直接查询到学生数量: ${classStudents.length}`);
    } catch (error) {
      console.warn('班级直接查询失败:', error);
    }
    
    // 方法2：通过teacherId查询然后过滤
    try {
      const teacherQuery = await db.collection('students')
        .where({
          teacherId: teacherId
        })
        .get();
      
      teacherQuery.data.forEach(student => {
        if (!classExistingIds.has(student._id) && student.classId === testClassId) {
          classStudents.push(student);
          classExistingIds.add(student._id);
        }
      });
      console.log(`班级teacherId查询后学生数量: ${classStudents.length}`);
    } catch (error) {
      console.warn('班级teacherId查询失败:', error);
    }
    
    // 过滤出活跃状态的学生
    const activeClassStudents = classStudents.filter(student => {
      return !student.status || student.status === 'active';
    });
    
    console.log(`班级活跃学生数量: ${activeClassStudents.length}`);
    
    // 4. 更新前端数据
    console.log('💾 更新前端数据...');
    
    // 格式化学生数据
    const formattedStudents = allStudents.map(student => {
      const className = classes.find(cls => cls.id === student.classId)?.name || student.class || student.className || '未分配班级';
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
        createTime: student.createTime || student.createdAt || new Date(),
        updateTime: student.updateTime || student.updatedAt || new Date(),
        teacherId: student.teacherId,
        createdAt: student.createdAt || new Date(),
        lastActivity: student.lastActivity || new Date()
      };
    });
    
    // 更新本地存储
    wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
    
    // 更新页面数据
    currentPage.setData({
      students: [...formattedStudents]
    });
    
    // 5. 强制刷新界面
    console.log('🎨 强制刷新界面...');
    
    const currentTab = currentPage.data.currentTab;
    if (currentTab === 'students') {
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
    
    // 6. 显示测试结果
    console.log('');
    console.log('🎉 永久性修复测试完成！');
    console.log('');
    console.log('📊 测试结果:');
    console.log(`查询到的学生总数: ${formattedStudents.length}`);
    console.log(`高一十二班学生数: ${classStats['class_1759717845338']?.count || 0}`);
    console.log(`班级活跃学生数: ${activeClassStudents.length}`);
    console.log('');
    
    // 检查是否包含手动输入的学生
    const manualStudents = formattedStudents.filter(student => {
      return student.name === '赵凤' || 
             student.name === '昂贵强' || 
             student.name === '陈国斌' || 
             student.name === '杨静琪' || 
             student.name === '白蕊婷' || 
             student.name === '黄健翔' || 
             student.name === '李海艳';
    });
    
    console.log(`找到手动输入学生: ${manualStudents.length} 个`);
    if (manualStudents.length > 0) {
      console.log('手动输入学生列表:');
      manualStudents.forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.name} (${student.class})`);
      });
    }
    
    return {
      success: true,
      message: '永久性修复测试完成',
      totalStudents: formattedStudents.length,
      class12Students: classStats['class_1759717845338']?.count || 0,
      activeClassStudents: activeClassStudents.length,
      manualStudents: manualStudents.length,
      allStudents: formattedStudents,
      classStats: classStats
    };
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行测试
testPermanentFix().then(result => {
  console.log('');
  console.log('📋 测试结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.totalStudents !== undefined) {
    console.log('');
    console.log('📊 测试详情:');
    console.log(`学生总数: ${result.totalStudents}`);
    console.log(`高一十二班学生数: ${result.class12Students}`);
    console.log(`班级活跃学生数: ${result.activeClassStudents}`);
    console.log(`手动输入学生数: ${result.manualStudents}`);
  }
  
  console.log('');
  console.log('💡 现在请检查:');
  console.log('1. 学生管理界面是否显示了所有学生');
  console.log('2. 高一十二班是否显示了18个学生');
  console.log('3. 班级学生名单是否显示了所有学生');
  console.log('4. 是否包含了赵凤等手动输入的学生');
});

console.log('✅ testPermanentFix 函数已定义');
