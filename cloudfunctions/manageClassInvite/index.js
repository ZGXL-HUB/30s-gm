// 班级邀请码管理云函数
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

/**
 * 班级邀请码管理
 * 功能：
 * 1. 生成班级邀请码
 * 2. 验证邀请码有效性
 * 3. 更新邀请码设置
 * 4. 获取班级邀请信息
 */
exports.main = async (event, context) => {
  const { action, classId, teacherId, inviteCode, expireDays = 7, maxUses = -1 } = event;
  
  try {
    switch (action) {
      case 'generate':
        return await generateInviteCode(classId, teacherId, expireDays, maxUses);
      case 'validate':
        return await validateInviteCode(inviteCode);
      case 'getInfo':
        return await getClassInviteInfo(classId);
      case 'regenerate':
        return await regenerateInviteCode(classId, teacherId, expireDays, maxUses);
      case 'deactivate':
        return await deactivateInviteCode(classId, teacherId);
      default:
        return { success: false, message: '无效的操作类型' };
    }
  } catch (error) {
    console.error('班级邀请码管理错误:', error);
    return { success: false, message: error.message };
  }
};

/**
 * 生成班级邀请码
 */
async function generateInviteCode(classId, teacherId, expireDays, maxUses) {
  // 1. 检查班级是否存在
  const classResult = await db.collection('classes').doc(classId).get();
  if (!classResult.data) {
    throw new Error('班级不存在');
  }
  
  // 2. 检查教师权限
  if (classResult.data.teacherId !== teacherId) {
    throw new Error('无权限操作此班级');
  }
  
  // 3. 生成唯一邀请码
  const inviteCode = await generateUniqueInviteCode();
  const expiresAt = new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000);
  
  // 4. 更新班级邀请码信息
  await db.collection('classes').doc(classId).update({
    data: {
      inviteCode: inviteCode,
      inviteCodeExpiry: expiresAt,
      maxStudents: classResult.data.maxStudents || 50,
      joinMethod: 'both' // 支持邀请码和直接添加两种方式
    }
  });
  
  // 5. 创建邀请记录
  await db.collection('class_invitations').add({
    data: {
      classId: classId,
      teacherId: teacherId,
      inviteCode: inviteCode,
      createdBy: teacherId,
      createdAt: new Date(),
      expiresAt: expiresAt,
      isActive: true,
      usedCount: 0,
      maxUses: maxUses
    }
  });
  
  return {
    success: true,
    data: {
      inviteCode: inviteCode,
      expiresAt: expiresAt,
      maxUses: maxUses,
      inviteUrl: `pages/student-join-class/index?code=${inviteCode}`
    }
  };
}

/**
 * 验证邀请码有效性
 */
async function validateInviteCode(inviteCode) {
  console.log('验证邀请码:', inviteCode);
  
  // 1. 查找邀请码对应的班级
  const classResult = await db.collection('classes').where({
    inviteCode: inviteCode,
    status: 'active'
  }).get();
  
  if (classResult.data.length === 0) {
    console.log('邀请码无效');
    return { success: false, message: '邀请码无效' };
  }
  
  const classInfo = classResult.data[0];
  console.log('找到班级:', classInfo.name, 'ID:', classInfo._id);
  
  // 2. 检查邀请码是否过期
  if (new Date() > new Date(classInfo.inviteCodeExpiry)) {
    console.log('邀请码已过期');
    return { success: false, message: '邀请码已过期' };
  }
  
  // 3. 实时统计班级学生数量
  const studentCountResult = await db.collection('students').where({
    classId: classInfo._id,
    status: 'active'
  }).count();
  
  const currentStudents = studentCountResult.total;
  console.log('班级当前学生数（实时统计）:', currentStudents);
  console.log('classes集合记录的学生数:', classInfo.currentStudents);
  
  // 如果实时统计的数量与classes集合不一致，更新classes集合
  if (currentStudents !== classInfo.currentStudents) {
    console.log('学生数量不一致，更新classes集合');
    try {
      await db.collection('classes').doc(classInfo._id).update({
        data: {
          currentStudents: currentStudents,
          updatedAt: new Date()
        }
      });
    } catch (updateError) {
      console.warn('更新班级学生数量失败:', updateError.message);
    }
  }
  
  // 检查班级人数限制
  if (currentStudents >= classInfo.maxStudents) {
    console.log('班级人数已满');
    return { success: false, message: '班级人数已满' };
  }
  
  // 4. 检查邀请记录
  const inviteResult = await db.collection('class_invitations').where({
    inviteCode: inviteCode,
    isActive: true
  }).get();
  
  if (inviteResult.data.length === 0) {
    console.log('邀请码已被禁用');
    return { success: false, message: '邀请码已被禁用' };
  }
  
  const inviteInfo = inviteResult.data[0];
  
  // 5. 检查使用次数限制
  if (inviteInfo.maxUses > 0 && inviteInfo.usedCount >= inviteInfo.maxUses) {
    console.log('邀请码使用次数已达上限');
    return { success: false, message: '邀请码使用次数已达上限' };
  }
  
  console.log('邀请码验证成功');
  return {
    success: true,
    data: {
      classId: classInfo._id,
      className: classInfo.name,
      teacherId: classInfo.teacherId,
      teacherName: classInfo.teacherName || '教师',
      maxStudents: classInfo.maxStudents,
      currentStudents: currentStudents, // 使用实时统计的数量
      remainingSlots: classInfo.maxStudents - currentStudents
    }
  };
}

/**
 * 获取班级邀请信息
 */
async function getClassInviteInfo(classId) {
  const classResult = await db.collection('classes').doc(classId).get();
  if (!classResult.data) {
    throw new Error('班级不存在');
  }
  
  const classInfo = classResult.data;
  const inviteResult = await db.collection('class_invitations').where({
    classId: classId,
    isActive: true
  }).orderBy('createdAt', 'desc').get();
  
  return {
    success: true,
    data: {
      classId: classId,
      className: classInfo.name,
      inviteCode: classInfo.inviteCode,
      inviteCodeExpiry: classInfo.inviteCodeExpiry,
      maxStudents: classInfo.maxStudents,
      currentStudents: classInfo.currentStudents,
      joinMethod: classInfo.joinMethod,
      inviteUrl: classInfo.inviteCode ? `pages/student-join-class/index?code=${classInfo.inviteCode}` : null,
      inviteHistory: inviteResult.data.map(invite => ({
        inviteCode: invite.inviteCode,
        createdAt: invite.createdAt,
        expiresAt: invite.expiresAt,
        usedCount: invite.usedCount,
        maxUses: invite.maxUses,
        isActive: invite.isActive
      }))
    }
  };
}

/**
 * 重新生成邀请码
 */
async function regenerateInviteCode(classId, teacherId, expireDays, maxUses) {
  // 1. 先禁用旧的邀请码
  await deactivateInviteCode(classId, teacherId);
  
  // 2. 生成新的邀请码
  return await generateInviteCode(classId, teacherId, expireDays, maxUses);
}

/**
 * 禁用邀请码
 */
async function deactivateInviteCode(classId, teacherId) {
  // 1. 更新班级邀请码状态
  await db.collection('classes').doc(classId).update({
    data: {
      inviteCode: null,
      inviteCodeExpiry: null
    }
  });
  
  // 2. 禁用所有相关的邀请记录
  await db.collection('class_invitations').where({
    classId: classId,
    isActive: true
  }).update({
    data: {
      isActive: false,
      deactivatedAt: new Date()
    }
  });
  
  return { success: true, message: '邀请码已禁用' };
}

/**
 * 生成唯一的邀请码
 */
async function generateUniqueInviteCode() {
  let inviteCode;
  let isUnique = false;
  let attempts = 0;
  
  while (!isUnique && attempts < 10) {
    // 生成6位数字邀请码
    inviteCode = Math.random().toString().slice(2, 8);
    
    // 检查是否已存在
    const existingResult = await db.collection('classes').where({
      inviteCode: inviteCode
    }).get();
    
    if (existingResult.data.length === 0) {
      isUnique = true;
    }
    
    attempts++;
  }
  
  if (!isUnique) {
    throw new Error('无法生成唯一邀请码，请重试');
  }
  
  return inviteCode;
}
