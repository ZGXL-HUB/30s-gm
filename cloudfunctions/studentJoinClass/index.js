// 学生加入班级云函数
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

/**
 * 学生加入班级
 * 功能：
 * 1. 通过邀请码加入班级
 * 2. 教师直接添加学生
 * 3. 学生转班
 */
exports.main = async (event, context) => {
  const { action, inviteCode, classId, studentInfo, teacherId } = event;
  
  try {
    switch (action) {
      case 'joinByInvite':
        return await joinClassByInvite(inviteCode, studentInfo);
      case 'directAdd':
        return await teacherDirectAddStudent(classId, studentInfo, teacherId);
      case 'transfer':
        return await transferStudent(studentInfo, classId, teacherId);
      case 'leaveClass':
        return await leaveClass(studentInfo, classId);
      default:
        return { success: false, message: '无效的操作类型' };
    }
  } catch (error) {
    console.error('学生加入班级错误:', error);
    return { success: false, message: error.message };
  }
};

/**
 * 通过邀请码加入班级
 */
async function joinClassByInvite(inviteCode, studentInfo) {
  console.log('开始处理学生加入班级请求');
  console.log('邀请码:', inviteCode);
  console.log('学生信息:', JSON.stringify(studentInfo));
  
  // 验证学生信息完整性
  if (!studentInfo || !studentInfo.openId) {
    console.error('学生openId缺失');
    return { success: false, message: '学生信息不完整：缺少openId' };
  }
  
  if (!studentInfo.name || studentInfo.name.trim() === '') {
    console.error('学生姓名缺失');
    return { success: false, message: '学生信息不完整：缺少姓名' };
  }
  
  // 1. 验证邀请码
  const validateResult = await validateInviteCode(inviteCode);
  if (!validateResult.success) {
    console.log('邀请码验证失败:', validateResult.message);
    return validateResult;
  }
  
  const classInfo = validateResult.data;
  console.log('邀请码验证成功，班级信息:', JSON.stringify(classInfo));
  
  // 2. 检查学生是否已在其他班级
  const existingStudentResult = await db.collection('students').where({
    openId: studentInfo.openId
  }).get();
  
  console.log('查询到的学生记录数:', existingStudentResult.data.length);
  
  let studentId;
  let joinMethod = 'invite';
  let previousClassId = null;
  
  if (existingStudentResult.data.length > 0) {
    // 学生已存在，更新班级信息
    const existingStudent = existingStudentResult.data[0];
    studentId = existingStudent._id;
    previousClassId = existingStudent.classId;
    
    console.log('学生已存在，ID:', studentId, '原班级:', previousClassId);
    
    // 如果学生已在同一班级，返回提示
    if (existingStudent.classId === classInfo.classId) {
      console.log('学生已在目标班级中');
      return { 
        success: false, 
        message: '您已经在此班级中',
        data: { classInfo: classInfo }
      };
    }
    
    // 更新学生信息
    console.log('更新学生班级信息');
    const updateResult = await db.collection('students').doc(studentId).update({
      data: {
        name: studentInfo.name.trim(), // 更新姓名
        avatarUrl: studentInfo.avatarUrl || existingStudent.avatarUrl || '',
        classId: classInfo.classId,
        className: classInfo.className,
        teacherId: classInfo.teacherId,
        joinedAt: new Date(),
        joinMethod: 'invite',
        previousClassId: previousClassId,
        status: 'active',
        updatedAt: new Date()
      }
    });
    console.log('学生信息更新结果:', JSON.stringify(updateResult));
    
    // 如果学生之前在其他班级，更新之前班级的学生数量
    if (previousClassId && previousClassId !== classInfo.classId) {
      console.log('减少原班级学生数量');
      await db.collection('classes').doc(previousClassId).update({
        data: {
          currentStudents: db.command.inc(-1)
        }
      });
    }
    
  } else {
    // 新学生，创建学生记录
    console.log('创建新学生记录');
    const createResult = await db.collection('students').add({
      data: {
        openId: studentInfo.openId,
        name: studentInfo.name.trim(),
        avatarUrl: studentInfo.avatarUrl || '',
        classId: classInfo.classId,
        className: classInfo.className,
        teacherId: classInfo.teacherId,
        joinedAt: new Date(),
        joinMethod: 'invite',
        status: 'active',
        totalAssignments: 0,
        completedAssignments: 0,
        averageAccuracy: 0,
        weakGrammarPoints: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    studentId = createResult._id;
    console.log('学生记录创建成功，ID:', studentId);
  }
  
  // 3. 更新班级学生数量
  console.log('更新班级学生数量');
  const classUpdateResult = await db.collection('classes').doc(classInfo.classId).update({
    data: {
      currentStudents: db.command.inc(1),
      updatedAt: new Date()
    }
  });
  console.log('班级学生数量更新结果:', JSON.stringify(classUpdateResult));
  
  // 4. 更新邀请码使用次数（如果使用class_invitations集合）
  try {
    const inviteUpdateResult = await db.collection('class_invitations').where({
      inviteCode: inviteCode,
      isActive: true
    }).update({
      data: {
        usedCount: db.command.inc(1)
      }
    });
    console.log('邀请码使用次数更新结果:', JSON.stringify(inviteUpdateResult));
  } catch (inviteError) {
    console.warn('更新邀请码使用次数失败（可能集合不存在）:', inviteError.message);
  }
  
  // 5. 记录加入历史
  try {
    const recordResult = await db.collection('student_join_records').add({
      data: {
        studentId: studentId,
        classId: classInfo.classId,
        teacherId: classInfo.teacherId,
        joinMethod: 'invite',
        inviteCode: inviteCode,
        joinedAt: new Date(),
        isActive: true
      }
    });
    console.log('加入历史记录创建结果:', JSON.stringify(recordResult));
  } catch (recordError) {
    console.warn('创建加入历史记录失败（可能集合不存在）:', recordError.message);
  }
  
  // 6. 同步班级学生数量统计
  try {
    const syncResult = await cloud.callFunction({
      name: 'syncClassStudentCount',
      data: {
        classId: classInfo.classId,
        action: 'student_joined'
      }
    });
    console.log('班级学生数量同步结果:', syncResult.result);
  } catch (syncError) {
    console.warn('同步班级学生数量失败:', syncError.message);
  }
  
  console.log('学生加入班级流程完成');
  return {
    success: true,
    message: '成功加入班级',
    data: {
      studentId: studentId,
      classInfo: classInfo,
      joinMethod: 'invite',
      previousClassId: previousClassId
    }
  };
}

/**
 * 教师直接添加学生
 */
async function teacherDirectAddStudent(classId, studentInfo, teacherId) {
  // 1. 验证教师权限
  const classResult = await db.collection('classes').doc(classId).get();
  if (!classResult.data || classResult.data.teacherId !== teacherId) {
    throw new Error('无权限操作此班级');
  }
  
  const classInfo = classResult.data;
  
  // 2. 检查班级人数限制
  if (classInfo.currentStudents >= classInfo.maxStudents) {
    throw new Error('班级人数已满');
  }
  
  // 3. 检查学生是否已存在
  const existingStudentResult = await db.collection('students').where({
    openId: studentInfo.openId
  }).get();
  
  let studentId;
  
  if (existingStudentResult.data.length > 0) {
    // 学生已存在，更新班级信息
    const existingStudent = existingStudentResult.data[0];
    studentId = existingStudent._id;
    
    // 如果学生已在同一班级，返回提示
    if (existingStudent.classId === classId) {
      return { 
        success: false, 
        message: '学生已在此班级中' 
      };
    }
    
    // 更新学生信息
    await db.collection('students').doc(studentId).update({
      data: {
        classId: classId,
        className: classInfo.name,
        teacherId: teacherId,
        joinedAt: new Date(),
        joinMethod: 'direct',
        previousClassId: existingStudent.classId,
        status: 'active'
      }
    });
    
    // 更新之前班级的学生数量
    if (existingStudent.classId) {
      await db.collection('classes').doc(existingStudent.classId).update({
        data: {
          currentStudents: db.command.inc(-1)
        }
      });
    }
    
  } else {
    // 新学生，创建学生记录
    const createResult = await db.collection('students').add({
      data: {
        openId: studentInfo.openId,
        name: studentInfo.name,
        avatarUrl: studentInfo.avatarUrl || '',
        classId: classId,
        className: classInfo.name,
        teacherId: teacherId,
        joinedAt: new Date(),
        joinMethod: 'direct',
        status: 'active',
        totalAssignments: 0,
        completedAssignments: 0,
        averageAccuracy: 0,
        weakGrammarPoints: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    studentId = createResult._id;
  }
  
  // 4. 更新班级学生数量
  await db.collection('classes').doc(classId).update({
    data: {
      currentStudents: db.command.inc(1)
    }
  });
  
  // 5. 记录加入历史
  await db.collection('student_join_records').add({
    data: {
      studentId: studentId,
      classId: classId,
      teacherId: teacherId,
      joinMethod: 'direct',
      joinedAt: new Date(),
      isActive: true
    }
  });
  
  // 6. 同步班级学生数量统计
  try {
    const syncResult = await cloud.callFunction({
      name: 'syncClassStudentCount',
      data: {
        classId: classId,
        action: 'student_added_by_teacher'
      }
    });
    console.log('班级学生数量同步结果:', syncResult.result);
  } catch (syncError) {
    console.warn('同步班级学生数量失败:', syncError);
  }
  
  return {
    success: true,
    message: '学生添加成功',
    data: {
      studentId: studentId,
      classInfo: classInfo,
      joinMethod: 'direct'
    }
  };
}

/**
 * 学生转班
 */
async function transferStudent(studentInfo, targetClassId, teacherId) {
  // 1. 验证教师权限
  const classResult = await db.collection('classes').doc(targetClassId).get();
  if (!classResult.data || classResult.data.teacherId !== teacherId) {
    throw new Error('无权限操作此班级');
  }
  
  const targetClass = classResult.data;
  
  // 2. 检查目标班级人数限制
  if (targetClass.currentStudents >= targetClass.maxStudents) {
    throw new Error('目标班级人数已满');
  }
  
  // 3. 查找学生当前班级
  const studentResult = await db.collection('students').where({
    openId: studentInfo.openId
  }).get();
  
  if (studentResult.data.length === 0) {
    throw new Error('学生不存在');
  }
  
  const student = studentResult.data[0];
  const currentClassId = student.classId;
  
  // 4. 更新学生班级信息
  await db.collection('students').doc(student._id).update({
    data: {
      classId: targetClassId,
      className: targetClass.name,
      teacherId: teacherId,
      joinedAt: new Date(),
      joinMethod: 'transfer',
      previousClassId: currentClassId,
      status: 'active'
    }
  });
  
  // 5. 更新班级学生数量
  if (currentClassId) {
    await db.collection('classes').doc(currentClassId).update({
      data: {
        currentStudents: db.command.inc(-1)
      }
    });
  }
  
  await db.collection('classes').doc(targetClassId).update({
    data: {
      currentStudents: db.command.inc(1)
    }
  });
  
  // 6. 记录转班历史
  await db.collection('student_join_records').add({
    data: {
      studentId: student._id,
      classId: targetClassId,
      teacherId: teacherId,
      joinMethod: 'transfer',
      joinedAt: new Date(),
      isActive: true
    }
  });
  
  return {
    success: true,
    message: '学生转班成功',
    data: {
      studentId: student._id,
      targetClass: targetClass,
      previousClassId: currentClassId,
      joinMethod: 'transfer'
    }
  };
}

/**
 * 学生离开班级
 */
async function leaveClass(studentInfo, classId) {
  // 1. 查找学生
  const studentResult = await db.collection('students').where({
    openId: studentInfo.openId,
    classId: classId
  }).get();
  
  if (studentResult.data.length === 0) {
    throw new Error('学生不在该班级中');
  }
  
  const student = studentResult.data[0];
  
  // 2. 更新学生状态
  await db.collection('students').doc(student._id).update({
    data: {
      classId: null,
      className: null,
      teacherId: null,
      status: 'inactive',
      leftAt: new Date()
    }
  });
  
  // 3. 更新班级学生数量
  await db.collection('classes').doc(classId).update({
    data: {
      currentStudents: db.command.inc(-1)
    }
  });
  
  // 4. 记录离开历史
  await db.collection('student_join_records').where({
    studentId: student._id,
    classId: classId,
    isActive: true
  }).update({
    data: {
      isActive: false,
      leftAt: new Date()
    }
  });
  
  return {
    success: true,
    message: '已离开班级',
    data: {
      studentId: student._id,
      classId: classId
    }
  };
}

/**
 * 验证邀请码（复用manageClassInvite云函数的逻辑）
 */
async function validateInviteCode(inviteCode) {
  const classResult = await db.collection('classes').where({
    inviteCode: inviteCode,
    status: 'active'
  }).get();
  
  if (classResult.data.length === 0) {
    return { success: false, message: '邀请码无效' };
  }
  
  const classInfo = classResult.data[0];
  
  if (new Date() > new Date(classInfo.inviteCodeExpiry)) {
    return { success: false, message: '邀请码已过期' };
  }
  
  if (classInfo.currentStudents >= classInfo.maxStudents) {
    return { success: false, message: '班级人数已满' };
  }
  
  return {
    success: true,
    data: {
      classId: classInfo._id,
      className: classInfo.name,
      teacherId: classInfo.teacherId,
      teacherName: classInfo.teacherName || '教师',
      maxStudents: classInfo.maxStudents,
      currentStudents: classInfo.currentStudents
    }
  };
}
