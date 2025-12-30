// 快速修复学生查询不完整问题
// 在微信开发者工具控制台中运行此代码

async function quickFixQueryCompleteness() {
  console.log('🔧 快速修复学生查询不完整问题...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    // 1. 检查当前查询到的学生数量
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const currentStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log(`📊 当前查询到的学生数量: ${currentStudents.length}`);
    
    // 2. 重新从云端查询所有学生数据
    console.log('☁️ 重新从云端查询所有学生数据...');
    
    if (!wx.cloud) {
      console.log('❌ 云开发环境不可用');
      return { success: false, error: '云开发环境不可用' };
    }
    
    const db = wx.cloud.database();
    
    // 方法1: 分页查询所有学生数据
    console.log('🔍 开始分页查询所有学生数据...');
    let allStudents = [];
    const batchSize = 100;
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
    
    console.log(`✅ 分页查询完成，总共查询到 ${allStudents.length} 个学生`);
    
    // 3. 如果分页查询结果仍然只有20个，尝试其他查询方法
    if (allStudents.length <= 20) {
      console.log('🔍 分页查询结果较少，尝试其他查询方法...');
      
      // 方法2: 查询所有学生然后过滤
      try {
        console.log('🔄 方法2: 查询所有学生记录然后过滤...');
        const allRecords = await db.collection('students').limit(10000).get();
        console.log(`查询到所有学生记录: ${allRecords.data.length} 条`);
        
        const filteredStudents = allRecords.data.filter(student => {
          return student.teacherId === teacherId;
        });
        
        console.log(`过滤后属于当前教师的学生: ${filteredStudents.length} 个`);
        
        if (filteredStudents.length > allStudents.length) {
          console.log('✅ 方法2找到更多学生，使用此结果');
          allStudents = filteredStudents;
        }
        
      } catch (backupError) {
        console.warn('方法2查询失败:', backupError);
      }
      
      // 方法3: 检查是否有其他teacherId
      try {
        console.log('🔍 方法3: 检查所有不同的teacherId...');
        const allRecords = await db.collection('students').limit(10000).get();
        const teacherIds = [...new Set(allRecords.data.map(s => s.teacherId))];
        console.log('数据库中的所有teacherId:', teacherIds);
        
        // 检查是否有类似的学生
        const similarStudents = allRecords.data.filter(student => {
          return student.name === '赵凤' || student.name.includes('赵') || student.name.includes('凤');
        });
        
        if (similarStudents.length > 0) {
          console.log('找到相似学生:', similarStudents);
          console.log('这些学生的teacherId:', similarStudents.map(s => s.teacherId));
        }
        
      } catch (checkError) {
        console.warn('方法3检查失败:', checkError);
      }
    }
    
    // 4. 检查是否包含"赵凤"等缺失的学生
    console.log('🔍 检查是否包含缺失的学生...');
    
    const zhaoFeng = allStudents.find(student => student.name === '赵凤');
    if (zhaoFeng) {
      console.log('✅ 找到赵凤:', zhaoFeng);
    } else {
      console.log('❌ 未找到赵凤');
      
      // 检查是否有类似姓名的学生
      const similarNames = allStudents.filter(student => 
        student.name.includes('赵') || student.name.includes('凤')
      );
      if (similarNames.length > 0) {
        console.log('找到相似姓名的学生:', similarNames);
      }
    }
    
    // 5. 显示所有学生信息
    console.log('📋 所有查询到的学生:');
    allStudents.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name} (${student.class || '未分配班级'}) - ${student.teacherId}`);
    });
    
    // 6. 格式化并更新数据
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
    
    // 9. 显示修复结果
    console.log('');
    console.log('🎉 学生查询完整性检查完成！');
    console.log('');
    console.log('📊 检查结果:');
    console.log(`查询到的学生数量: ${formattedStudents.length}`);
    console.log(`是否找到赵凤: ${zhaoFeng ? '✅ 是' : '❌ 否'}`);
    console.log('');
    
    if (zhaoFeng) {
      console.log('✅ 赵凤等缺失学生已找到');
    } else {
      console.log('❌ 未找到赵凤，可能的原因:');
      console.log('1. 数据库中学生确实只有20个');
      console.log('2. 赵凤的teacherId与当前teacherId不匹配');
      console.log('3. 学生数据在其他地方');
    }
    
    return {
      success: true,
      message: '学生查询完整性检查完成',
      totalStudents: formattedStudents.length,
      foundZhaoFeng: !!zhaoFeng,
      allStudents: formattedStudents
    };
    
  } catch (error) {
    console.error('❌ 检查过程中发生错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行检查
quickFixQueryCompleteness().then(result => {
  console.log('');
  console.log('📋 检查结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  console.log(`总学生数: ${result.totalStudents} 个`);
  console.log(`是否找到赵凤: ${result.foundZhaoFeng ? '✅ 是' : '❌ 否'}`);
  
  if (!result.foundZhaoFeng) {
    console.log('');
    console.log('💡 建议:');
    console.log('1. 检查数据库中赵凤的teacherId是否正确');
    console.log('2. 确认赵凤是否在students集合中');
    console.log('3. 检查是否有其他teacherId的学生数据');
  }
});

console.log('✅ quickFixQueryCompleteness 函数已定义');
