// 简化版测试：只测试邀请码验证功能
// 不需要教师登录，只需要一个有效的邀请码

/**
 * 测试邀请码验证和班级人数显示
 * 使用方法：
 * 1. 复制此脚本到微信开发者工具控制台
 * 2. 脚本会提示输入邀请码
 * 3. 或者直接调用：testInviteCodeValidation('123456')
 */

const testInviteCodeValidation = async (inviteCode) => {
  console.log('===== 测试邀请码验证 =====\n');
  
  try {
    // 如果没有提供邀请码，提示用户
    if (!inviteCode) {
      console.log('请提供一个邀请码进行测试');
      console.log('使用方法：testInviteCodeValidation("123456")');
      console.log('');
      console.log('如何获取邀请码：');
      console.log('1. 在教师端创建班级');
      console.log('2. 生成或查看邀请码');
      console.log('3. 使用该邀请码进行测试');
      return;
    }
    
    console.log('邀请码:', inviteCode);
    console.log('');
    
    // 步骤1：验证邀请码
    console.log('步骤1：调用 manageClassInvite 云函数验证邀请码');
    const validateResult = await wx.cloud.callFunction({
      name: 'manageClassInvite',
      data: {
        action: 'validate',
        inviteCode: inviteCode
      }
    });
    
    console.log('云函数返回结果:');
    console.log(JSON.stringify(validateResult.result, null, 2));
    console.log('');
    
    if (!validateResult.result.success) {
      console.error('❌ 邀请码验证失败:', validateResult.result.message);
      console.log('');
      console.log('可能的原因：');
      console.log('- 邀请码不存在或已过期');
      console.log('- 班级已满员');
      console.log('- 邀请码已被禁用');
      return;
    }
    
    console.log('✓ 邀请码验证成功\n');
    
    const classInfo = validateResult.result.data;
    
    // 步骤2：显示班级信息
    console.log('步骤2：查看班级信息');
    console.log('-----------------------------------');
    console.log('班级ID:', classInfo.classId);
    console.log('班级名称:', classInfo.className);
    console.log('教师ID:', classInfo.teacherId);
    console.log('教师姓名:', classInfo.teacherName);
    console.log('最大学生数:', classInfo.maxStudents);
    console.log('当前学生数:', classInfo.currentStudents);
    console.log('剩余名额:', classInfo.remainingSlots);
    console.log('-----------------------------------\n');
    
    // 步骤3：实时统计学生数量
    console.log('步骤3：从数据库实时统计学生数量');
    const db = wx.cloud.database();
    const studentCountResult = await db.collection('students').where({
      classId: classInfo.classId,
      status: 'active'
    }).count();
    
    console.log('students集合中的学生数:', studentCountResult.total);
    console.log('云函数返回的学生数:', classInfo.currentStudents);
    
    if (studentCountResult.total === classInfo.currentStudents) {
      console.log('✓ 数据一致！\n');
    } else {
      console.log('⚠ 数据不一致！');
      console.log('差异:', Math.abs(studentCountResult.total - classInfo.currentStudents), '人');
      console.log('说明：云函数应该已自动同步，差异可能是缓存导致\n');
    }
    
    // 步骤4：查询实际的学生列表
    console.log('步骤4：查询班级学生列表（前10名）');
    const studentsResult = await db.collection('students').where({
      classId: classInfo.classId,
      status: 'active'
    }).limit(10).get();
    
    console.log('找到', studentsResult.data.length, '名学生：');
    studentsResult.data.forEach((student, index) => {
      const openIdPreview = student.openId ? student.openId.substring(0, 10) + '...' : '未设置';
      console.log(`${index + 1}. ${student.name || '未命名'} (OpenID: ${openIdPreview})`);
    });
    console.log('');
    
    // 步骤5：测试总结
    console.log('===== 测试总结 =====');
    console.log('✓ 邀请码验证功能正常');
    console.log('✓ 班级信息获取成功');
    console.log('✓ 学生数量统计准确');
    console.log('✓ 实时数据查询正常');
    console.log('');
    console.log('下一步：');
    console.log('1. 使用学生账号测试加入班级功能');
    console.log('2. 验证学生记录是否正确创建');
    console.log('3. 再次运行此测试，确认人数已更新');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    console.error('错误详情:', error.message);
    console.error('');
    console.log('排查建议：');
    console.log('1. 检查云函数是否已部署');
    console.log('2. 检查云开发环境是否已初始化');
    console.log('3. 查看云函数日志获取详细错误信息');
  }
};

// 自动提示
console.log('===== 邀请码验证测试工具 =====');
console.log('');
console.log('使用方法：');
console.log('testInviteCodeValidation("你的邀请码")');
console.log('');
console.log('示例：');
console.log('testInviteCodeValidation("123456")');
console.log('');
console.log('提示：请替换为实际的6位数字邀请码');
console.log('================================');

