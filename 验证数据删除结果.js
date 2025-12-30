/**
 * 验证数据删除结果
 * 检查删除操作是否真正成功
 */

// 验证学生数据删除结果
async function verifyStudentDeletion() {
  try {
    console.log('开始验证学生数据删除结果...');
    
    const db = wx.cloud.database();
    
    // 1. 获取当前所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('当前学生数据验证:');
    console.log('=====================================');
    console.log('总学生数: ' + students.length);
    
    if (students.length > 0) {
      console.log('剩余学生列表:');
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        console.log('  - ' + student.name + ' (ID: ' + student._id + ')');
        console.log('    班级ID: ' + (student.classId || '未分配'));
        console.log('    班级名称: ' + (student.className || '未知'));
        console.log('    状态: ' + (student.status || '未知'));
        console.log('-------------------------------------');
      }
    } else {
      console.log('✅ 所有学生数据已成功删除');
    }
    
    // 2. 检查有效班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log('有效班级: ' + classes.length + ' 个');
    for (let i = 0; i < classes.length; i++) {
      const classInfo = classes[i];
      console.log('  - ' + classInfo.name + ' (ID: ' + classInfo._id + ')');
      console.log('    当前学生数: ' + (classInfo.currentStudents || 0));
    }
    
    return {
      students: students,
      classes: classes
    };
    
  } catch (error) {
    console.error('验证学生数据删除结果失败:', error);
    return null;
  }
}

// 强制刷新数据库连接
async function forceRefreshDatabase() {
  try {
    console.log('开始强制刷新数据库连接...');
    
    const db = wx.cloud.database();
    
    // 1. 尝试重新获取学生数据
    console.log('重新获取学生数据...');
    const studentsResult = await db.collection('students').get();
    console.log('获取到学生数: ' + studentsResult.data.length);
    
    // 2. 尝试重新获取班级数据
    console.log('重新获取班级数据...');
    const classesResult = await db.collection('classes').get();
    console.log('获取到班级数: ' + classesResult.data.length);
    
    // 3. 检查特定学生是否存在
    const specificStudents = ['小1', '小2', '小3', '小红', '小白'];
    console.log('检查特定学生是否存在:');
    
    for (let i = 0; i < specificStudents.length; i++) {
      const studentName = specificStudents[i];
      const result = await db.collection('students').where({
        name: studentName
      }).get();
      
      if (result.data.length > 0) {
        console.log('❌ 学生 "' + studentName + '" 仍然存在');
      } else {
        console.log('✅ 学生 "' + studentName + '" 已删除');
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('强制刷新数据库连接失败:', error);
    return false;
  }
}

// 检查数据库环境
async function checkDatabaseEnvironment() {
  try {
    console.log('开始检查数据库环境...');
    
    const db = wx.cloud.database();
    
    // 1. 检查云开发环境
    console.log('云开发环境信息:');
    console.log('  环境ID: ' + (wx.cloud.env || '未知'));
    
    // 2. 检查数据库连接
    console.log('测试数据库连接...');
    const testResult = await db.collection('students').limit(1).get();
    console.log('数据库连接: ' + (testResult ? '正常' : '异常'));
    
    // 3. 检查权限
    console.log('检查数据库权限...');
    try {
      const countResult = await db.collection('students').count();
      console.log('读取权限: 正常');
    } catch (error) {
      console.log('读取权限: 异常 - ' + error.message);
    }
    
    return true;
    
  } catch (error) {
    console.error('检查数据库环境失败:', error);
    return false;
  }
}

// 手动删除特定学生
async function manuallyDeleteSpecificStudents() {
  try {
    console.log('开始手动删除特定学生...');
    
    const db = wx.cloud.database();
    
    // 要删除的学生名称列表
    const studentsToDelete = ['小1', '小2', '小3', '小红', '小白', '小黄', '小蓝', '小绿', '小黑', '小灰', '小棕', '小紫', '小橙', '小粉', '小4', '小5', '小6', '小7', '小8', '李同学'];
    
    let deletedCount = 0;
    
    for (let i = 0; i < studentsToDelete.length; i++) {
      const studentName = studentsToDelete[i];
      
      try {
        // 查找该学生
        const result = await db.collection('students').where({
          name: studentName
        }).get();
        
        if (result.data.length > 0) {
          // 删除找到的学生
          for (let j = 0; j < result.data.length; j++) {
            const student = result.data[j];
            await db.collection('students').doc(student._id).remove();
            console.log('✅ 手动删除学生: ' + studentName + ' (ID: ' + student._id + ')');
            deletedCount++;
          }
        } else {
          console.log('ℹ️ 学生 "' + studentName + '" 不存在或已删除');
        }
      } catch (error) {
        console.log('❌ 删除学生 "' + studentName + '" 失败: ' + error.message);
      }
    }
    
    console.log('手动删除完成，共删除 ' + deletedCount + ' 个学生');
    return deletedCount;
    
  } catch (error) {
    console.error('手动删除特定学生失败:', error);
    return 0;
  }
}

// 综合验证
async function runComprehensiveVerification() {
  try {
    console.log('开始综合验证数据删除结果...');
    console.log('=====================================');
    
    // 1. 检查数据库环境
    const envCheck = await checkDatabaseEnvironment();
    console.log('数据库环境检查: ' + (envCheck ? '✅ 正常' : '❌ 异常'));
    console.log('-------------------------------------');
    
    // 2. 验证学生数据删除结果
    const deletionVerify = await verifyStudentDeletion();
    console.log('学生数据删除验证: ' + (deletionVerify ? '✅ 完成' : '❌ 失败'));
    console.log('-------------------------------------');
    
    // 3. 强制刷新数据库连接
    const refreshResult = await forceRefreshDatabase();
    console.log('数据库连接刷新: ' + (refreshResult ? '✅ 完成' : '❌ 失败'));
    console.log('-------------------------------------');
    
    // 4. 如果还有数据，尝试手动删除
    if (deletionVerify && deletionVerify.students.length > 0) {
      console.log('发现仍有学生数据，尝试手动删除...');
      const manualDelete = await manuallyDeleteSpecificStudents();
      console.log('手动删除结果: ' + (manualDelete > 0 ? '✅ 删除了 ' + manualDelete + ' 个学生' : '❌ 删除失败'));
    }
    
    console.log('综合验证完成！');
    
    return {
      success: true,
      message: '数据删除结果验证完成'
    };
    
  } catch (error) {
    console.error('综合验证失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// 将函数添加到全局作用域
window.verifyStudentDeletion = verifyStudentDeletion;
window.forceRefreshDatabase = forceRefreshDatabase;
window.checkDatabaseEnvironment = checkDatabaseEnvironment;
window.manuallyDeleteSpecificStudents = manuallyDeleteSpecificStudents;
window.runComprehensiveVerification = runComprehensiveVerification;

console.log('数据删除结果验证函数已加载');
console.log('可用函数:');
console.log('- runComprehensiveVerification() - 运行综合验证');
console.log('- verifyStudentDeletion() - 验证学生数据删除结果');
console.log('- forceRefreshDatabase() - 强制刷新数据库连接');
console.log('- manuallyDeleteSpecificStudents() - 手动删除特定学生');
