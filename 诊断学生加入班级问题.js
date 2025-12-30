/**
 * 诊断学生加入班级问题
 * 在微信开发者工具控制台运行
 */

// 检查学生数据
async function checkStudentData() {
  try {
    console.log('开始检查学生数据...');
    
    const db = wx.cloud.database();
    
    // 获取所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('学生数据检查结果:');
    console.log('=====================================');
    console.log('总学生数: ' + students.length);
    
    if (students.length > 0) {
      console.log('学生列表:');
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        console.log('  - ' + student.name + ' (ID: ' + student._id + ')');
        console.log('    班级ID: ' + (student.classId || '未分配'));
        console.log('    班级名称: ' + (student.className || '未知'));
        console.log('    状态: ' + (student.status || '未知'));
        console.log('    加入时间: ' + (student.joinedAt || '未知'));
        console.log('    加入方式: ' + (student.joinMethod || '未知'));
        console.log('-------------------------------------');
      }
    } else {
      console.log('❌ 没有找到任何学生数据');
    }
    
    return students;
  } catch (error) {
    console.error('检查学生数据失败:', error);
    return [];
  }
}

// 检查班级数据
async function checkClassData() {
  try {
    console.log('开始检查班级数据...');
    
    const db = wx.cloud.database();
    
    // 获取所有班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log('班级数据检查结果:');
    console.log('=====================================');
    console.log('总班级数: ' + classes.length);
    
    for (let i = 0; i < classes.length; i++) {
      const classInfo = classes[i];
      console.log('班级: ' + classInfo.name + ' (ID: ' + classInfo._id + ')');
      console.log('  当前学生数: ' + (classInfo.currentStudents || 0));
      console.log('  最大学生数: ' + (classInfo.maxStudents || 0));
      console.log('  教师ID: ' + (classInfo.teacherId || '未知'));
      console.log('  状态: ' + (classInfo.status || '未知'));
      console.log('-------------------------------------');
    }
    
    return classes;
  } catch (error) {
    console.error('检查班级数据失败:', error);
    return [];
  }
}

// 检查邀请码数据
async function checkInviteCodeData() {
  try {
    console.log('开始检查邀请码数据...');
    
    const db = wx.cloud.database();
    
    // 获取所有邀请码
    const invitationsResult = await db.collection('class_invitations').get();
    const invitations = invitationsResult.data;
    
    console.log('邀请码数据检查结果:');
    console.log('=====================================');
    console.log('总邀请码数: ' + invitations.length);
    
    for (let i = 0; i < invitations.length; i++) {
      const invitation = invitations[i];
      console.log('邀请码: ' + invitation.inviteCode);
      console.log('  班级ID: ' + (invitation.classId || '未知'));
      console.log('  是否激活: ' + (invitation.isActive ? '是' : '否'));
      console.log('  使用次数: ' + (invitation.usedCount || 0));
      console.log('  创建时间: ' + (invitation.createdAt || '未知'));
      console.log('-------------------------------------');
    }
    
    return invitations;
  } catch (error) {
    console.error('检查邀请码数据失败:', error);
    return [];
  }
}

// 测试学生加入班级云函数
async function testStudentJoinClassFunction() {
  try {
    console.log('开始测试学生加入班级云函数...');
    
    // 先获取一个班级和邀请码
    const db = wx.cloud.database();
    const classesResult = await db.collection('classes').limit(1).get();
    const invitationsResult = await db.collection('class_invitations').limit(1).get();
    
    if (classesResult.data.length === 0) {
      console.log('❌ 没有找到班级数据');
      return false;
    }
    
    if (invitationsResult.data.length === 0) {
      console.log('❌ 没有找到邀请码数据');
      return false;
    }
    
    const classInfo = classesResult.data[0];
    const invitation = invitationsResult.data[0];
    
    console.log('使用班级: ' + classInfo.name + ' (ID: ' + classInfo._id + ')');
    console.log('使用邀请码: ' + invitation.inviteCode);
    
    // 模拟学生信息
    const studentInfo = {
      openId: 'test_openid_' + Date.now(),
      name: '测试学生',
      avatarUrl: ''
    };
    
    // 调用云函数
    const result = await wx.cloud.callFunction({
      name: 'studentJoinClass',
      data: {
        action: 'joinByInvite',
        inviteCode: invitation.inviteCode,
        studentInfo: studentInfo
      }
    });
    
    console.log('云函数调用结果:', result.result);
    
    if (result.result.success) {
      console.log('✅ 学生加入班级成功');
      return true;
    } else {
      console.log('❌ 学生加入班级失败: ' + result.result.message);
      return false;
    }
    
  } catch (error) {
    console.error('测试学生加入班级云函数失败:', error);
    return false;
  }
}

// 检查学生加入记录
async function checkStudentJoinRecords() {
  try {
    console.log('开始检查学生加入记录...');
    
    const db = wx.cloud.database();
    
    // 获取所有加入记录
    const recordsResult = await db.collection('student_join_records').get();
    const records = recordsResult.data;
    
    console.log('学生加入记录检查结果:');
    console.log('=====================================');
    console.log('总记录数: ' + records.length);
    
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      console.log('记录ID: ' + record._id);
      console.log('  学生ID: ' + (record.studentId || '未知'));
      console.log('  班级ID: ' + (record.classId || '未知'));
      console.log('  教师ID: ' + (record.teacherId || '未知'));
      console.log('  加入方式: ' + (record.joinMethod || '未知'));
      console.log('  邀请码: ' + (record.inviteCode || '无'));
      console.log('  加入时间: ' + (record.joinedAt || '未知'));
      console.log('  是否激活: ' + (record.isActive ? '是' : '否'));
      console.log('-------------------------------------');
    }
    
    return records;
  } catch (error) {
    console.error('检查学生加入记录失败:', error);
    return [];
  }
}

// 综合诊断
async function runFullDiagnosis() {
  try {
    console.log('开始综合诊断学生加入班级问题...');
    console.log('=====================================');
    
    // 1. 检查学生数据
    const students = await checkStudentData();
    console.log('学生数据检查: ' + (students.length > 0 ? '✅ 有数据' : '❌ 无数据'));
    console.log('-------------------------------------');
    
    // 2. 检查班级数据
    const classes = await checkClassData();
    console.log('班级数据检查: ' + (classes.length > 0 ? '✅ 有数据' : '❌ 无数据'));
    console.log('-------------------------------------');
    
    // 3. 检查邀请码数据
    const invitations = await checkInviteCodeData();
    console.log('邀请码数据检查: ' + (invitations.length > 0 ? '✅ 有数据' : '❌ 无数据'));
    console.log('-------------------------------------');
    
    // 4. 检查学生加入记录
    const records = await checkStudentJoinRecords();
    console.log('学生加入记录检查: ' + (records.length > 0 ? '✅ 有数据' : '❌ 无数据'));
    console.log('-------------------------------------');
    
    // 5. 测试云函数
    const functionTest = await testStudentJoinClassFunction();
    console.log('云函数测试: ' + (functionTest ? '✅ 正常' : '❌ 异常'));
    console.log('-------------------------------------');
    
    console.log('综合诊断完成！');
    
    return {
      success: true,
      message: '综合诊断完成',
      results: {
        students: students.length,
        classes: classes.length,
        invitations: invitations.length,
        records: records.length,
        functionTest: functionTest
      }
    };
    
  } catch (error) {
    console.error('综合诊断失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// 将函数添加到全局作用域
window.checkStudentData = checkStudentData;
window.checkClassData = checkClassData;
window.checkInviteCodeData = checkInviteCodeData;
window.testStudentJoinClassFunction = testStudentJoinClassFunction;
window.checkStudentJoinRecords = checkStudentJoinRecords;
window.runFullDiagnosis = runFullDiagnosis;

console.log('学生加入班级问题诊断函数已加载');
console.log('可用函数:');
console.log('- runFullDiagnosis() - 运行综合诊断');
console.log('- checkStudentData() - 检查学生数据');
console.log('- checkClassData() - 检查班级数据');
console.log('- checkInviteCodeData() - 检查邀请码数据');
console.log('- testStudentJoinClassFunction() - 测试云函数');
console.log('- checkStudentJoinRecords() - 检查加入记录');
