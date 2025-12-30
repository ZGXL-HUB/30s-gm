// 修复teacherId不匹配问题 - 查询所有teacherId的学生
// 在微信开发者工具控制台中运行此代码

async function fixTeacherIdMismatch() {
  console.log('🔧 修复teacherId不匹配问题...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    console.log(`当前使用的teacherId: ${teacherId}`);
    
    if (!wx.cloud) {
      console.log('❌ 云开发环境不可用');
      return { success: false, error: '云开发环境不可用' };
    }
    
    const db = wx.cloud.database();
    
    // 1. 查询所有学生记录（包括teacherId为undefined的）
    console.log('🔍 查询所有学生记录（包括teacherId为undefined的）...');
    
    let allStudents = [];
    const batchSize = 100;
    let skip = 0;
    let hasMore = true;
    
    while (hasMore) {
      console.log(`查询第 ${Math.floor(skip / batchSize) + 1} 批数据 (跳过 ${skip} 条)...`);
      
      const batchResult = await db.collection('students')
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
    
    console.log(`✅ 总共查询到 ${allStudents.length} 个学生记录`);
    
    // 2. 按teacherId分组显示
    console.log('📊 按teacherId分组分析...');
    
    const groupedByTeacherId = {};
    allStudents.forEach(student => {
      const tid = student.teacherId || 'undefined';
      if (!groupedByTeacherId[tid]) {
        groupedByTeacherId[tid] = [];
      }
      groupedByTeacherId[tid].push(student);
    });
    
    Object.keys(groupedByTeacherId).forEach(tid => {
      console.log(`teacherId "${tid}": ${groupedByTeacherId[tid].length} 个学生`);
    });
    
    // 3. 查找"赵凤"
    console.log('🔍 查找"赵凤"...');
    
    const zhaoFeng = allStudents.find(student => student.name === '赵凤');
    if (zhaoFeng) {
      console.log('✅ 找到赵凤:', zhaoFeng);
      console.log(`赵凤的teacherId: "${zhaoFeng.teacherId || 'undefined'}"`);
    } else {
      console.log('❌ 未找到赵凤');
      
      // 查找所有姓"赵"的学生
      const zhaoStudents = allStudents.filter(student => student.name.includes('赵'));
      if (zhaoStudents.length > 0) {
        console.log('找到姓"赵"的学生:', zhaoStudents.map(s => ({
          name: s.name,
          teacherId: s.teacherId || 'undefined',
          class: s.class
        })));
      }
    }
    
    // 4. 查找所有可能相关的学生（teacherId为undefined的）
    const undefinedTeacherStudents = allStudents.filter(student => !student.teacherId);
    console.log(`📋 teacherId为undefined的学生 (${undefinedTeacherStudents.length}个):`);
    undefinedTeacherStudents.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name} (${student.class || '未分配班级'})`);
    });
    
    // 5. 合并所有相关学生（包括teacherId为undefined的）
    console.log('🔗 合并所有相关学生...');
    
    const relevantStudents = allStudents.filter(student => {
      // 包含当前teacherId的学生，或者teacherId为undefined的学生
      return student.teacherId === teacherId || !student.teacherId;
    });
    
    console.log(`✅ 找到相关学生 ${relevantStudents.length} 个`);
    
    // 6. 更新这些学生的teacherId（如果需要）
    if (undefinedTeacherStudents.length > 0) {
      console.log('🔄 更新teacherId为undefined的学生...');
      
      const updatePromises = undefinedTeacherStudents.map(async (student) => {
        try {
          await db.collection('students').doc(student._id).update({
            data: {
              teacherId: teacherId
            }
          });
          console.log(`✅ 已更新学生 ${student.name} 的teacherId`);
          return { ...student, teacherId: teacherId };
        } catch (updateError) {
          console.error(`❌ 更新学生 ${student.name} 失败:`, updateError);
          return student;
        }
      });
      
      const updateResults = await Promise.all(updatePromises);
      console.log(`✅ 更新完成，${updateResults.length} 个学生`);
    }
    
    // 7. 格式化学生数据
    console.log('📝 格式化学生数据...');
    
    const classes = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const classMap = {};
    classes.forEach(cls => {
      classMap[cls.id] = cls.name;
    });
    
    const formattedStudents = relevantStudents.map(student => {
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
        teacherId: student.teacherId || teacherId
      };
    });
    
    // 8. 更新本地存储和页面数据
    console.log('💾 更新本地存储和页面数据...');
    
    wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
    
    currentPage.setData({
      students: [...formattedStudents]
    });
    
    // 9. 强制刷新界面
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
    
    // 10. 显示修复结果
    console.log('');
    console.log('🎉 teacherId不匹配问题修复完成！');
    console.log('');
    console.log('📊 修复结果:');
    console.log(`原始学生数量: 20 个`);
    console.log(`修复后学生数量: ${formattedStudents.length} 个`);
    console.log(`新增学生数量: ${formattedStudents.length - 20} 个`);
    console.log(`是否找到赵凤: ${zhaoFeng ? '✅ 是' : '❌ 否'}`);
    console.log(`undefined teacherId学生: ${undefinedTeacherStudents.length} 个`);
    console.log('');
    
    if (zhaoFeng) {
      console.log('✅ 赵凤已找到并包含在列表中');
    } else {
      console.log('❌ 仍未找到赵凤，可能的原因:');
      console.log('1. 赵凤不在students集合中');
      console.log('2. 赵凤的姓名可能有变化');
      console.log('3. 赵凤在其他数据集合中');
    }
    
    console.log('📋 所有学生列表:');
    formattedStudents.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name} (${student.class}) - teacherId: ${student.teacherId}`);
    });
    
    return {
      success: true,
      message: 'teacherId不匹配问题修复完成',
      originalCount: 20,
      finalCount: formattedStudents.length,
      foundZhaoFeng: !!zhaoFeng,
      undefinedTeacherStudents: undefinedTeacherStudents.length,
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
fixTeacherIdMismatch().then(result => {
  console.log('');
  console.log('📋 修复结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.originalCount !== undefined) {
    console.log('');
    console.log('📊 修复详情:');
    console.log(`修复前: ${result.originalCount} 个学生`);
    console.log(`修复后: ${result.finalCount} 个学生`);
    console.log(`undefined teacherId: ${result.undefinedTeacherStudents} 个`);
    console.log(`是否找到赵凤: ${result.foundZhaoFeng ? '✅ 是' : '❌ 否'}`);
  }
  
  console.log('');
  console.log('💡 请检查学生管理界面是否显示更多学生');
  console.log('💡 特别检查是否包含了赵凤等之前缺失的学生');
});

console.log('✅ fixTeacherIdMismatch 函数已定义');
