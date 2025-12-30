// 修复缺失学生查询问题
// 在微信开发者工具控制台中运行此代码

async function fixMissingStudentsQuery() {
  console.log('🔧 修复缺失学生查询问题...');
  
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
    
    // 1. 使用更宽松的查询条件获取所有学生
    console.log('🔍 使用多种查询方式获取所有学生...');
    
    let allStudents = [];
    
    // 方法1: 查询所有学生（不限制任何条件）
    try {
      console.log('方法1: 查询所有学生记录...');
      let skip = 0;
      const batchSize = 100;
      let hasMore = true;
      
      while (hasMore) {
        const batchResult = await db.collection('students')
          .skip(skip)
          .limit(batchSize)
          .get();
        
        console.log(`查询第 ${Math.floor(skip / batchSize) + 1} 批: ${batchResult.data.length} 个学生`);
        
        allStudents = allStudents.concat(batchResult.data);
        
        if (batchResult.data.length < batchSize) {
          hasMore = false;
        } else {
          skip += batchSize;
        }
      }
      
      console.log(`方法1查询到学生总数: ${allStudents.length}`);
      
    } catch (error) {
      console.error('方法1查询失败:', error);
    }
    
    // 方法2: 按teacherId查询（包含所有可能的情况）
    try {
      console.log('方法2: 按teacherId查询...');
      const teacherStudents = await db.collection('students')
        .where({
          teacherId: teacherId
        })
        .get();
      
      console.log(`方法2查询到学生数量: ${teacherStudents.data.length}`);
      
      // 合并结果，去重
      const existingIds = new Set(allStudents.map(s => s._id));
      teacherStudents.data.forEach(student => {
        if (!existingIds.has(student._id)) {
          allStudents.push(student);
        }
      });
      
    } catch (error) {
      console.error('方法2查询失败:', error);
    }
    
    // 方法3: 按classId查询高一十二班的学生
    try {
      console.log('方法3: 查询高一十二班的学生...');
      const classStudents = await db.collection('students')
        .where({
          classId: 'class_1759717845338'
        })
        .get();
      
      console.log(`方法3查询到高一十二班学生数量: ${classStudents.data.length}`);
      
      // 合并结果，去重
      const existingIds = new Set(allStudents.map(s => s._id));
      classStudents.data.forEach(student => {
        if (!existingIds.has(student._id)) {
          allStudents.push(student);
        }
      });
      
    } catch (error) {
      console.error('方法3查询失败:', error);
    }
    
    console.log(`✅ 总共查询到学生数量: ${allStudents.length}`);
    
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
          console.log(`    ${index + 1}. ${student.name} - ${student.studentId || '无学号'} - ${student.createdAt || student.createTime || '无时间'}`);
        });
      }
    });
    
    // 3. 查找手动输入的学生（赵凤等）
    console.log('🔍 查找手动输入的学生...');
    
    const manualStudents = allStudents.filter(student => {
      const name = student.name || '';
      const createdAt = student.createdAt || student.createTime;
      
      // 查找最近手动输入的学生
      return name === '赵凤' || 
             name === '昂贵强' || 
             name === '陈国斌' || 
             name === '杨静琪' || 
             name === '白蕊婷' || 
             name === '黄健翔' || 
             name === '李海艳';
    });
    
    if (manualStudents.length > 0) {
      console.log('✅ 找到手动输入的学生:');
      manualStudents.forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.name} - ${student.class || '未分配班级'} - ${student.studentId || '无学号'}`);
      });
    } else {
      console.log('❌ 未找到手动输入的学生');
    }
    
    // 4. 格式化学生数据
    console.log('📝 格式化学生数据...');
    
    const classes = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const classMap = {};
    classes.forEach(cls => {
      classMap[cls.id] = cls.name;
    });
    
    const formattedStudents = allStudents.map(student => {
      const className = classMap[student.classId] || student.class || student.className || '未分配班级';
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
    
    console.log(`✅ 格式化完成，共 ${formattedStudents.length} 个学生`);
    
    // 5. 更新前端数据
    console.log('💾 更新前端数据...');
    
    // 更新本地存储
    wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
    
    // 更新页面数据
    currentPage.setData({
      students: [...formattedStudents]
    });
    
    // 6. 强制刷新界面
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
    
    // 7. 显示修复结果
    console.log('');
    console.log('🎉 缺失学生查询问题修复完成！');
    console.log('');
    console.log('📊 修复结果:');
    console.log(`查询到的学生总数: ${formattedStudents.length}`);
    console.log(`高一十二班学生数: ${classStats['class_1759717845338']?.count || 0}`);
    console.log(`找到的手动输入学生: ${manualStudents.length} 个`);
    console.log(`是否找到赵凤: ${manualStudents.some(s => s.name === '赵凤') ? '✅ 是' : '❌ 否'}`);
    console.log('');
    
    return {
      success: true,
      message: '缺失学生查询问题修复完成',
      totalStudents: formattedStudents.length,
      class12Students: classStats['class_1759717845338']?.count || 0,
      manualStudents: manualStudents.length,
      foundZhaoFeng: manualStudents.some(s => s.name === '赵凤'),
      allStudents: formattedStudents,
      classStats: classStats
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
fixMissingStudentsQuery().then(result => {
  console.log('');
  console.log('📋 修复结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.totalStudents !== undefined) {
    console.log('');
    console.log('📊 修复详情:');
    console.log(`学生总数: ${result.totalStudents}`);
    console.log(`高一十二班学生数: ${result.class12Students}`);
    console.log(`手动输入学生数: ${result.manualStudents}`);
    console.log(`是否找到赵凤: ${result.foundZhaoFeng ? '✅ 是' : '❌ 否'}`);
  }
  
  console.log('');
  console.log('💡 现在请检查:');
  console.log('1. 学生管理界面是否显示了更多学生');
  console.log('2. 高一十二班是否显示了18个学生');
  console.log('3. 是否包含了赵凤等手动输入的学生');
});

console.log('✅ fixMissingStudentsQuery 函数已定义');
