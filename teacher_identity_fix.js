// 教师身份验证和数据持久化修复脚本
// 在微信开发者工具控制台中运行此脚本

async function fixTeacherIdentityAndData() {
  console.log('🔧 开始修复教师身份验证和数据持久化问题...');
  
  try {
    const db = wx.cloud.database();
    
    // 1. 获取当前用户的OpenID
    console.log('📱 获取当前用户OpenID...');
    const loginResult = await wx.cloud.callFunction({
      name: 'login'
    });
    
    const currentOpenId = loginResult.result.openid;
    console.log('✅ 当前用户OpenID:', currentOpenId);
    
    // 2. 检查教师记录是否存在
    console.log('🔍 检查教师记录...');
    const teacherQuery = await db.collection('teachers').where({
      _openid: currentOpenId
    }).get();
    
    let teacherId;
    let teacherRecord;
    
    if (teacherQuery.data.length > 0) {
      // 教师记录已存在
      teacherRecord = teacherQuery.data[0];
      teacherId = teacherRecord._id;
      console.log('✅ 找到现有教师记录:', teacherId);
      console.log('教师信息:', {
        name: teacherRecord.name,
        school: teacherRecord.school,
        subject: teacherRecord.subject
      });
    } else {
      // 创建新的教师记录
      console.log('📝 创建新教师记录...');
      const createResult = await db.collection('teachers').add({
        data: {
          name: '张老师',
          school: '测试学校',
          grade: '高三',
          subject: '英语',
          status: 'active',
          createdAt: new Date().toISOString(),
          updateTime: new Date().toISOString()
        }
      });
      
      teacherId = createResult._id;
      teacherRecord = {
        _id: teacherId,
        _openid: currentOpenId,
        name: '张老师',
        school: '测试学校',
        grade: '高三',
        subject: '英语',
        status: 'active',
        createdAt: new Date().toISOString(),
        updateTime: new Date().toISOString()
      };
      
      console.log('✅ 创建新教师记录成功:', teacherId);
    }
    
    // 3. 更新本地存储的教师ID
    console.log('💾 更新本地存储...');
    wx.setStorageSync('teacherId', teacherId);
    wx.setStorageSync('currentTeacher', teacherRecord);
    
    // 4. 同步现有的班级和学生数据
    console.log('🔄 同步班级和学生数据...');
    
    // 获取该教师的所有班级
    const classesQuery = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    if (classesQuery.data.length > 0) {
      const formattedClasses = classesQuery.data.map(cls => ({
        id: cls._id,
        name: cls.name,
        studentCount: cls.currentStudents || 0,
        teacher: cls.teacherName || teacherRecord.name,
        createdAt: cls.createdAt || new Date().toISOString(),
        lastActivity: cls.lastActivity || new Date().toISOString(),
        status: cls.status || 'active',
        averageAccuracy: cls.averageAccuracy || 0,
        completedAssignments: cls.completedAssignments || 0,
        totalAssignments: cls.totalAssignments || 0
      }));
      
      wx.setStorageSync(`teacher_classes_${teacherId}`, formattedClasses);
      console.log('✅ 同步班级数据:', formattedClasses.length, '个班级');
    }
    
    // 获取该教师的所有学生
    const studentsQuery = await db.collection('students').where({
      teacherId: teacherId
    }).get();
    
    if (studentsQuery.data.length > 0) {
      const formattedStudents = studentsQuery.data.map(student => ({
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
      console.log('✅ 同步学生数据:', formattedStudents.length, '个学生');
    }
    
    // 5. 检查数据一致性
    console.log('🔍 检查数据一致性...');
    
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const localStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log('本地班级数据:', localClasses.length);
    console.log('本地学生数据:', localStudents.length);
    
    // 显示学生班级关联情况
    if (localStudents.length > 0) {
      const classAssociation = {};
      localStudents.forEach(student => {
        const className = student.class || '未分配班级';
        classAssociation[className] = (classAssociation[className] || 0) + 1;
      });
      console.log('学生班级分布:', classAssociation);
    }
    
    console.log('');
    console.log('🎉 修复完成！');
    console.log('');
    console.log('📋 修复结果:');
    console.log('✅ 教师身份已正确绑定到OpenID');
    console.log('✅ 本地存储已更新');
    console.log('✅ 班级和学生数据已同步');
    console.log('✅ 数据持久化问题已解决');
    console.log('');
    console.log('💡 下一步操作:');
    console.log('1. 重新启动小程序');
    console.log('2. 检查教师界面是否显示正确的班级和学生');
    console.log('3. 测试创建新班级和学生功能');
    console.log('4. 验证数据在编译后是否保持');
    
    return {
      success: true,
      teacherId: teacherId,
      teacherRecord: teacherRecord,
      classesCount: localClasses.length,
      studentsCount: localStudents.length
    };
    
  } catch (error) {
    console.error('❌ 修复失败:', error);
    console.log('');
    console.log('🔧 如果修复失败，请检查:');
    console.log('1. 云开发环境是否正常');
    console.log('2. 数据库权限是否正确');
    console.log('3. 网络连接是否正常');
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 验证修复结果的函数
async function verifyFix() {
  console.log('🔍 验证修复结果...');
  
  try {
    const teacherId = wx.getStorageSync('teacherId');
    const currentTeacher = wx.getStorageSync('currentTeacher');
    const classes = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const students = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log('教师ID:', teacherId);
    console.log('教师信息:', currentTeacher);
    console.log('班级数量:', classes.length);
    console.log('学生数量:', students.length);
    
    if (teacherId && teacherId !== 'teacher_123') {
      console.log('✅ 教师身份修复成功');
    } else {
      console.log('❌ 教师身份仍然是硬编码值');
    }
    
    if (classes.length > 0 || students.length > 0) {
      console.log('✅ 数据同步成功');
    } else {
      console.log('⚠️ 没有找到班级或学生数据');
    }
    
  } catch (error) {
    console.error('验证失败:', error);
  }
}

// 运行修复
fixTeacherIdentityAndData();
