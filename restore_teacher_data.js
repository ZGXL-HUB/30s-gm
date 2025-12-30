// 恢复教师班级和学生数据脚本
// 在微信开发者工具控制台中运行此脚本

async function restoreTeacherData() {
  console.log('🔄 开始恢复教师数据...');
  
  try {
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    console.log('当前教师ID:', teacherId);
    
    // 1. 恢复班级数据到云端
    console.log('📝 恢复班级数据...');
    
    // 创建一些示例班级数据（基于你的截图中的信息）
    const sampleClasses = [
      {
        _id: 'class_1759626653309',
        name: '122班',
        teacherId: teacherId,
        teacherName: '张老师',
        currentStudents: 1,
        maxStudents: 50,
        grade: '高三',
        subject: '英语',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        averageAccuracy: 0,
        completedAssignments: 0,
        totalAssignments: 0
      }
    ];
    
    for (const classData of sampleClasses) {
      try {
        // 检查班级是否已存在
        const existingClass = await db.collection('classes').doc(classData._id).get();
        
        if (!existingClass.data) {
          // 班级不存在，创建新班级
          await db.collection('classes').add({
            data: classData
          });
          console.log('✅ 创建班级:', classData.name);
        } else {
          console.log('⚠️ 班级已存在:', classData.name);
        }
      } catch (error) {
        console.warn('创建班级失败:', classData.name, error.message);
      }
    }
    
    // 2. 恢复学生数据到云端
    console.log('👥 恢复学生数据...');
    
    // 基于你的截图创建学生数据
    const sampleStudents = [
      {
        _id: '25b91eb368e1c5a1016f24a03a1d934f',
        name: '小紫',
        studentId: 'S17596266533118',
        class: '2',
        classId: 'class_1759626653309',
        teacherId: teacherId,
        phone: '',
        email: '',
        status: 'active',
        completedAssignments: 0,
        totalAssignments: 0,
        averageAccuracy: 0,
        weakGrammarPoints: [],
        createTime: '2025-10-05T01:10:53.311Z',
        updateTime: '2025-10-05T01:10:53.311Z'
      }
    ];
    
    for (const studentData of sampleStudents) {
      try {
        // 检查学生是否已存在
        const existingStudent = await db.collection('students').doc(studentData._id).get();
        
        if (!existingStudent.data) {
          // 学生不存在，创建新学生
          await db.collection('students').add({
            data: studentData
          });
          console.log('✅ 创建学生:', studentData.name);
        } else {
          console.log('⚠️ 学生已存在:', studentData.name);
        }
      } catch (error) {
        console.warn('创建学生失败:', studentData.name, error.message);
      }
    }
    
    // 3. 同步数据到本地存储
    console.log('💾 同步数据到本地存储...');
    
    // 获取云端班级数据
    const cloudClasses = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    if (cloudClasses.data.length > 0) {
      const formattedClasses = cloudClasses.data.map(cls => ({
        id: cls._id,
        name: cls.name,
        studentCount: cls.currentStudents || 0,
        teacher: cls.teacherName || '张老师',
        createdAt: cls.createdAt || new Date().toISOString(),
        lastActivity: cls.lastActivity || new Date().toISOString(),
        status: cls.status || 'active',
        averageAccuracy: cls.averageAccuracy || 0,
        completedAssignments: cls.completedAssignments || 0,
        totalAssignments: cls.totalAssignments || 0
      }));
      
      wx.setStorageSync(`teacher_classes_${teacherId}`, formattedClasses);
      console.log('✅ 同步班级数据到本地:', formattedClasses.length, '个班级');
    }
    
    // 获取云端学生数据
    const cloudStudents = await db.collection('students').where({
      teacherId: teacherId
    }).get();
    
    if (cloudStudents.data.length > 0) {
      const formattedStudents = cloudStudents.data.map(student => ({
        id: student._id,
        name: student.name,
        studentId: student.studentId || student._id,
        phone: student.phone || '',
        email: student.email || '',
        class: student.class || '未分配班级',
        classId: student.classId || null,
        status: student.status || 'active',
        completedAssignments: student.completedAssignments || 0,
        totalAssignments: student.totalAssignments || 0,
        averageAccuracy: student.averageAccuracy || 0,
        weakGrammarPoints: student.weakGrammarPoints || [],
        createTime: student.createTime || new Date(),
        updateTime: student.updateTime || new Date()
      }));
      
      wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
      console.log('✅ 同步学生数据到本地:', formattedStudents.length, '个学生');
    }
    
    // 4. 验证恢复结果
    console.log('🔍 验证恢复结果...');
    
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const localStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log('');
    console.log('📊 恢复结果统计:');
    console.log('班级数量:', localClasses.length);
    console.log('学生数量:', localStudents.length);
    
    if (localClasses.length > 0) {
      console.log('班级列表:');
      localClasses.forEach(cls => {
        console.log(`- ${cls.name} (${cls.studentCount}人)`);
      });
    }
    
    if (localStudents.length > 0) {
      console.log('学生列表:');
      localStudents.forEach(student => {
        console.log(`- ${student.name} (${student.class})`);
      });
    }
    
    console.log('');
    console.log('🎉 数据恢复完成！');
    console.log('');
    console.log('💡 下一步操作:');
    console.log('1. 重新启动小程序');
    console.log('2. 检查教师界面是否显示恢复的数据');
    console.log('3. 测试添加新班级和学生功能');
    console.log('4. 验证数据持久性');
    
    return {
      success: true,
      classesCount: localClasses.length,
      studentsCount: localStudents.length
    };
    
  } catch (error) {
    console.error('❌ 数据恢复失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行恢复
restoreTeacherData();
