// 修复学生查询不完整问题
// 在微信开发者工具控制台中运行此代码

async function fixStudentQueryCompleteness() {
  console.log('🔧 修复学生查询不完整问题...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    // 1. 检查当前查询到的学生数量
    console.log('📊 检查当前查询结果...');
    
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const currentStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log(`当前查询到的学生数量: ${currentStudents.length}`);
    console.log('当前学生列表:');
    currentStudents.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name} (${student.class}) - ${student.classId}`);
    });
    
    // 2. 重新从云端查询所有学生数据
    console.log('☁️ 重新从云端查询所有学生数据...');
    
    if (!wx.cloud) {
      console.log('❌ 云开发环境不可用');
      return { success: false, error: '云开发环境不可用' };
    }
    
    const db = wx.cloud.database();
    
    // 方法1: 直接查询所有学生（不限制数量）
    console.log('🔍 方法1: 查询所有学生数据...');
    let allStudents = [];
    
    try {
      // 分页查询所有学生数据
      const batchSize = 100; // 每批查询100条
      let skip = 0;
      let hasMore = true;
      
      while (hasMore) {
        console.log(`查询第 ${Math.floor(skip / batchSize) + 1} 批数据 (跳过 ${skip} 条)...`);
        
        const batchResult = await db.collection('students')
          .where({
            teacherId: teacherId
          })
          .skip(skip)
          .limit(batchSize)
          .get();
        
        console.log(`第 ${Math.floor(skip / batchSize) + 1} 批查询到 ${batchResult.data.length} 个学生`);
        
        allStudents = allStudents.concat(batchResult.data);
        
        if (batchResult.data.length < batchSize) {
          hasMore = false;
        } else {
          skip += batchSize;
        }
      }
      
      console.log(`✅ 总共查询到 ${allStudents.length} 个学生`);
      
    } catch (queryError) {
      console.error('分页查询失败，尝试备用方法:', queryError);
      
      // 备用方法: 查询所有学生然后过滤
      try {
        console.log('🔄 备用方法: 查询所有学生然后过滤...');
        const allRecords = await db.collection('students').limit(10000).get();
        console.log(`查询到所有学生记录: ${allRecords.data.length} 条`);
        
        allStudents = allRecords.data.filter(student => {
          return student.teacherId === teacherId;
        });
        
        console.log(`过滤后属于当前教师的学生: ${allStudents.length} 个`);
        
      } catch (backupError) {
        console.error('备用查询方法也失败:', backupError);
        return { success: false, error: backupError.message };
      }
    }
    
    // 3. 检查是否包含"赵凤"等缺失的学生
    console.log('🔍 检查是否包含缺失的学生...');
    
    const zhaoFeng = allStudents.find(student => student.name === '赵凤');
    if (zhaoFeng) {
      console.log('✅ 找到赵凤:', zhaoFeng);
    } else {
      console.log('❌ 未找到赵凤');
    }
    
    // 4. 格式化学生数据
    console.log('📝 格式化学生数据...');
    
    // 获取班级信息用于映射
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
        teacherId: student.teacherId
      };
    });
    
    console.log(`✅ 格式化完成，共 ${formattedStudents.length} 个学生`);
    
    // 5. 更新本地存储和页面数据
    console.log('💾 更新本地存储和页面数据...');
    
    wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
    
    currentPage.setData({
      students: [...formattedStudents] // 创建新数组确保触发更新
    });
    
    // 6. 强制刷新界面
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
    
    // 7. 显示修复结果
    console.log('');
    console.log('🎉 学生查询完整性修复完成！');
    console.log('');
    console.log('📊 修复结果:');
    console.log(`修复前学生数量: ${currentStudents.length}`);
    console.log(`修复后学生数量: ${formattedStudents.length}`);
    console.log(`新增学生数量: ${formattedStudents.length - currentStudents.length}`);
    console.log('');
    
    if (zhaoFeng) {
      console.log('✅ 赵凤等缺失学生已找回');
    }
    
    console.log('📋 完整学生列表:');
    formattedStudents.forEach((student, index) => {
      if (index < 30) { // 只显示前30个
        console.log(`${index + 1}. ${student.name} (${student.class})`);
      }
    });
    
    if (formattedStudents.length > 30) {
      console.log(`...还有 ${formattedStudents.length - 30} 个学生`);
    }
    
    return {
      success: true,
      message: '学生查询完整性修复完成',
      beforeFix: currentStudents.length,
      afterFix: formattedStudents.length,
      foundZhaoFeng: !!zhaoFeng,
      totalStudents: formattedStudents.length
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
fixStudentQueryCompleteness().then(result => {
  console.log('');
  console.log('📋 修复结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.beforeFix !== undefined) {
    console.log('');
    console.log('📊 修复详情:');
    console.log(`修复前: ${result.beforeFix} 个学生`);
    console.log(`修复后: ${result.afterFix} 个学生`);
    console.log(`是否找到赵凤: ${result.foundZhaoFeng ? '✅ 是' : '❌ 否'}`);
    console.log(`总学生数: ${result.totalStudents} 个`);
  }
  
  console.log('');
  console.log('💡 请检查学生管理界面是否显示所有学生');
  console.log('💡 特别检查是否包含了赵凤等之前缺失的学生');
});

console.log('✅ fixStudentQueryCompleteness 函数已定义');
