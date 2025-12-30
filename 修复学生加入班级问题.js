/**
 * 修复学生加入班级问题
 * 在微信开发者工具控制台运行
 */

// 创建测试学生数据
async function createTestStudent() {
  try {
    console.log('开始创建测试学生数据...');
    
    const db = wx.cloud.database();
    
    // 获取班级"1"的信息
    const classesResult = await db.collection('classes').where({
      name: '1'
    }).get();
    
    if (classesResult.data.length === 0) {
      console.log('❌ 没有找到班级"1"');
      return false;
    }
    
    const classInfo = classesResult.data[0];
    console.log('找到班级: ' + classInfo.name + ' (ID: ' + classInfo._id + ')');
    
    // 创建测试学生
    const studentData = {
      openId: 'test_student_' + Date.now(),
      name: '测试学生',
      avatarUrl: '',
      classId: classInfo._id,
      className: classInfo.name,
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
    };
    
    const createResult = await db.collection('students').add({
      data: studentData
    });
    
    console.log('✅ 测试学生创建成功，ID: ' + createResult._id);
    
    // 更新班级学生数量
    await db.collection('classes').doc(classInfo._id).update({
      data: {
        currentStudents: db.command.inc(1),
        studentCount: db.command.inc(1),
        updatedAt: new Date()
      }
    });
    
    console.log('✅ 班级学生数量已更新');
    
    // 创建加入记录
    await db.collection('student_join_records').add({
      data: {
        studentId: createResult._id,
        classId: classInfo._id,
        teacherId: classInfo.teacherId,
        joinMethod: 'invite',
        inviteCode: '553553',
        joinedAt: new Date(),
        isActive: true
      }
    });
    
    console.log('✅ 学生加入记录已创建');
    
    return true;
    
  } catch (error) {
    console.error('创建测试学生失败:', error);
    return false;
  }
}

// 修复班级学生数量统计
async function fixClassStudentCount() {
  try {
    console.log('开始修复班级学生数量统计...');
    
    const db = wx.cloud.database();
    
    // 获取所有班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log('找到 ' + classes.length + ' 个班级');
    
    for (let i = 0; i < classes.length; i++) {
      const classInfo = classes[i];
      
      // 统计该班级的实际学生数量
      const studentsResult = await db.collection('students').where({
        classId: classInfo._id,
        status: 'active'
      }).count();
      
      const actualStudentCount = studentsResult.total;
      const currentStudentCount = classInfo.currentStudents || 0;
      
      console.log('班级 ' + classInfo.name + ': 当前显示 ' + currentStudentCount + ' 人，实际 ' + actualStudentCount + ' 人');
      
      // 如果数量不一致，更新班级数据
      if (actualStudentCount !== currentStudentCount) {
        await db.collection('classes').doc(classInfo._id).update({
          data: {
            currentStudents: actualStudentCount,
            studentCount: actualStudentCount,
            updatedAt: new Date()
          }
        });
        
        console.log('✅ 已更新班级 ' + classInfo.name + ' 的学生数量为 ' + actualStudentCount);
      } else {
        console.log('✅ 班级 ' + classInfo.name + ' 的学生数量已正确');
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('修复班级学生数量统计失败:', error);
    return false;
  }
}

// 检查学生加入班级云函数
async function checkStudentJoinClassFunction() {
  try {
    console.log('开始检查学生加入班级云函数...');
    
    // 获取班级"1"的信息
    const db = wx.cloud.database();
    const classesResult = await db.collection('classes').where({
      name: '1'
    }).get();
    
    if (classesResult.data.length === 0) {
      console.log('❌ 没有找到班级"1"');
      return false;
    }
    
    const classInfo = classesResult.data[0];
    
    // 获取邀请码
    const invitationsResult = await db.collection('class_invitations').where({
      classId: classInfo._id
    }).get();
    
    if (invitationsResult.data.length === 0) {
      console.log('❌ 没有找到班级"1"的邀请码');
      return false;
    }
    
    const invitation = invitationsResult.data[0];
    
    console.log('使用班级: ' + classInfo.name + ' (ID: ' + classInfo._id + ')');
    console.log('使用邀请码: ' + invitation.inviteCode);
    
    // 模拟学生信息
    const studentInfo = {
      openId: 'test_openid_' + Date.now(),
      name: '测试学生_' + Date.now(),
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
      console.log('✅ 学生加入班级云函数正常工作');
      return true;
    } else {
      console.log('❌ 学生加入班级云函数异常: ' + result.result.message);
      return false;
    }
    
  } catch (error) {
    console.error('检查学生加入班级云函数失败:', error);
    return false;
  }
}

// 综合修复
async function runFullFix() {
  try {
    console.log('开始综合修复学生加入班级问题...');
    console.log('=====================================');
    
    // 1. 修复班级学生数量统计
    const countFix = await fixClassStudentCount();
    console.log('班级学生数量统计修复: ' + (countFix ? '✅ 成功' : '❌ 失败'));
    console.log('-------------------------------------');
    
    // 2. 检查云函数
    const functionCheck = await checkStudentJoinClassFunction();
    console.log('云函数检查: ' + (functionCheck ? '✅ 正常' : '❌ 异常'));
    console.log('-------------------------------------');
    
    // 3. 创建测试学生（可选）
    const createTest = await createTestStudent();
    console.log('测试学生创建: ' + (createTest ? '✅ 成功' : '❌ 失败'));
    console.log('-------------------------------------');
    
    console.log('综合修复完成！');
    
    return {
      success: true,
      message: '学生加入班级问题修复完成',
      results: {
        countFix: countFix,
        functionCheck: functionCheck,
        createTest: createTest
      }
    };
    
  } catch (error) {
    console.error('综合修复失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// 将函数添加到全局作用域
window.createTestStudent = createTestStudent;
window.fixClassStudentCount = fixClassStudentCount;
window.checkStudentJoinClassFunction = checkStudentJoinClassFunction;
window.runFullFix = runFullFix;

console.log('学生加入班级问题修复函数已加载');
console.log('可用函数:');
console.log('- runFullFix() - 运行综合修复');
console.log('- createTestStudent() - 创建测试学生');
console.log('- fixClassStudentCount() - 修复班级学生数量');
console.log('- checkStudentJoinClassFunction() - 检查云函数');
