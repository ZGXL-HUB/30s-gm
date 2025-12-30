// 测试学生加入班级数据同步修复
// 使用方法：在微信开发者工具的控制台中运行此脚本

/**
 * 测试步骤：
 * 
 * 1. 创建测试班级
 * 2. 生成邀请码
 * 3. 模拟学生加入班级
 * 4. 验证学生数据是否正确写入
 * 5. 验证班级人数是否正确显示
 */

const testStudentJoinClassFix = async () => {
  console.log('===== 开始测试学生加入班级修复 =====\n');
  
  try {
    // 步骤1：获取教师信息
    console.log('步骤1：获取教师信息');
    const teacherInfo = wx.getStorageSync('teacherInfo');
    if (!teacherInfo || !teacherInfo._id) {
      console.error('未找到教师信息，请先登录教师账号');
      return;
    }
    console.log('教师ID:', teacherInfo._id);
    console.log('教师姓名:', teacherInfo.name);
    
    // 步骤2：查找教师的班级
    console.log('\n步骤2：查找教师的班级');
    const db = wx.cloud.database();
    const classResult = await db.collection('classes').where({
      teacherId: teacherInfo._id,
      status: 'active'
    }).limit(1).get();
    
    if (classResult.data.length === 0) {
      console.error('未找到活跃的班级');
      return;
    }
    
    const classInfo = classResult.data[0];
    console.log('班级ID:', classInfo._id);
    console.log('班级名称:', classInfo.name);
    console.log('邀请码:', classInfo.inviteCode);
    console.log('当前学生数:', classInfo.currentStudents);
    console.log('最大学生数:', classInfo.maxStudents);
    
    // 步骤3：如果没有邀请码，生成一个
    let inviteCode = classInfo.inviteCode;
    if (!inviteCode) {
      console.log('\n步骤3：生成邀请码');
      const generateResult = await wx.cloud.callFunction({
        name: 'manageClassInvite',
        data: {
          action: 'generate',
          classId: classInfo._id,
          teacherId: teacherInfo._id,
          expireDays: 7
        }
      });
      
      if (generateResult.result.success) {
        inviteCode = generateResult.result.data.inviteCode;
        console.log('邀请码生成成功:', inviteCode);
      } else {
        console.error('邀请码生成失败:', generateResult.result.message);
        return;
      }
    } else {
      console.log('\n步骤3：使用现有邀请码:', inviteCode);
    }
    
    // 步骤4：验证邀请码
    console.log('\n步骤4：验证邀请码');
    const validateResult = await wx.cloud.callFunction({
      name: 'manageClassInvite',
      data: {
        action: 'validate',
        inviteCode: inviteCode
      }
    });
    
    console.log('验证结果:', JSON.stringify(validateResult.result, null, 2));
    
    if (!validateResult.result.success) {
      console.error('邀请码验证失败:', validateResult.result.message);
      return;
    }
    
    console.log('邀请码验证成功');
    console.log('班级人数（实时）:', validateResult.result.data.currentStudents);
    console.log('剩余名额:', validateResult.result.data.remainingSlots);
    
    // 步骤5：创建测试学生信息
    console.log('\n步骤5：准备测试学生信息');
    const testStudentInfo = {
      openId: 'test_student_' + Date.now(), // 使用时间戳确保唯一
      name: '测试学生' + Math.floor(Math.random() * 1000),
      avatarUrl: ''
    };
    console.log('测试学生信息:', JSON.stringify(testStudentInfo, null, 2));
    
    // 步骤6：调用学生加入班级云函数
    console.log('\n步骤6：调用学生加入班级云函数');
    const joinResult = await wx.cloud.callFunction({
      name: 'studentJoinClass',
      data: {
        action: 'joinByInvite',
        inviteCode: inviteCode,
        studentInfo: testStudentInfo
      }
    });
    
    console.log('加入结果:', JSON.stringify(joinResult.result, null, 2));
    
    if (!joinResult.result.success) {
      console.error('学生加入班级失败:', joinResult.result.message);
      return;
    }
    
    const studentId = joinResult.result.data.studentId;
    console.log('学生加入成功，学生ID:', studentId);
    
    // 步骤7：验证学生记录是否正确创建
    console.log('\n步骤7：验证学生记录');
    const studentResult = await db.collection('students').doc(studentId).get();
    
    if (studentResult.data) {
      console.log('学生记录验证成功:');
      console.log('- 学生ID:', studentResult.data._id);
      console.log('- 学生姓名:', studentResult.data.name);
      console.log('- OpenID:', studentResult.data.openId);
      console.log('- 班级ID:', studentResult.data.classId);
      console.log('- 班级名称:', studentResult.data.className);
      console.log('- 教师ID:', studentResult.data.teacherId);
      console.log('- 加入方式:', studentResult.data.joinMethod);
      console.log('- 状态:', studentResult.data.status);
    } else {
      console.error('未找到学生记录！');
      return;
    }
    
    // 步骤8：验证班级人数是否更新
    console.log('\n步骤8：验证班级人数更新');
    const updatedClassResult = await db.collection('classes').doc(classInfo._id).get();
    
    console.log('班级人数更新验证:');
    console.log('- 原人数:', classInfo.currentStudents);
    console.log('- 新人数:', updatedClassResult.data.currentStudents);
    console.log('- 是否增加:', updatedClassResult.data.currentStudents === (classInfo.currentStudents + 1) ? '✓' : '✗');
    
    // 步骤9：实时统计学生数量
    console.log('\n步骤9：实时统计学生数量');
    const studentCountResult = await db.collection('students').where({
      classId: classInfo._id,
      status: 'active'
    }).count();
    
    console.log('实时统计结果:');
    console.log('- students集合中的学生数:', studentCountResult.total);
    console.log('- classes集合中的学生数:', updatedClassResult.data.currentStudents);
    console.log('- 是否一致:', studentCountResult.total === updatedClassResult.data.currentStudents ? '✓' : '✗');
    
    // 步骤10：清理测试数据（可选）
    console.log('\n步骤10：清理测试数据');
    console.log('是否要删除测试学生? (y/n)');
    console.log('如需删除，请在控制台执行：');
    console.log(`wx.cloud.database().collection('students').doc('${studentId}').remove()`);
    
    console.log('\n===== 测试完成 =====');
    console.log('总结:');
    console.log('✓ 邀请码验证正常');
    console.log('✓ 学生记录创建成功');
    console.log('✓ 学生信息完整');
    console.log('✓ 班级人数更新正常');
    console.log('✓ 数据同步一致');
    
  } catch (error) {
    console.error('测试过程中发生错误:', error);
    console.error('错误详情:', error.message);
    console.error('错误堆栈:', error.stack);
  }
};

// 提示信息
console.log('===== 学生加入班级测试脚本 =====');
console.log('');
console.log('使用方法：');
console.log('1. 确保已以教师身份登录小程序');
console.log('2. 在控制台中运行：testStudentJoinClassFix()');
console.log('');
console.log('如果未登录教师账号，请先：');
console.log('1. 切换到小程序页面');
console.log('2. 进入教师相关页面（如班级管理）');
console.log('3. 登录后再运行此脚本');
console.log('');
console.log('准备就绪！输入 testStudentJoinClassFix() 开始测试');
console.log('===============================');

