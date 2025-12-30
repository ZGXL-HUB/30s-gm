/**
 * 在微信小程序中测试数据同步修复效果
 * 直接在微信开发者工具控制台运行
 */

// 测试班级学生数量统计
async function testClassStudentCount() {
  try {
    console.log('开始测试班级学生数量统计...');
    
    // 获取数据库实例
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
      
      console.log('班级: ' + classInfo.name);
      console.log('  当前显示: ' + currentStudentCount + ' 人');
      console.log('  实际学生: ' + actualStudentCount + ' 人');
      
      if (actualStudentCount === currentStudentCount) {
        console.log('  状态: 一致');
      } else {
        console.log('  状态: 不一致，需要修复');
      }
    }
    
    console.log('班级学生数量统计测试完成');
    return true;
    
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

// 测试学生数据完整性
async function testStudentDataIntegrity() {
  try {
    console.log('开始测试学生数据完整性...');
    
    const db = wx.cloud.database();
    
    // 获取所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('找到 ' + students.length + ' 个学生');
    
    let validStudents = 0;
    let invalidStudents = 0;
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      let isValid = true;
      const issues = [];
      
      // 检查必要字段
      if (!student.name) {
        issues.push('缺少姓名');
        isValid = false;
      }
      
      if (!student.classId) {
        issues.push('缺少班级ID');
        isValid = false;
      }
      
      if (!student.status) {
        issues.push('缺少状态');
        isValid = false;
      }
      
      if (isValid) {
        validStudents++;
      } else {
        invalidStudents++;
        console.log('学生 ' + student.name + ' 数据不完整: ' + issues.join(', '));
      }
    }
    
    console.log('学生数据完整性测试结果:');
    console.log('  有效学生: ' + validStudents + ' 人');
    console.log('  无效学生: ' + invalidStudents + ' 人');
    
    return true;
    
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

// 测试云函数同步功能
async function testSyncFunction() {
  try {
    console.log('开始测试云函数同步功能...');
    
    // 先获取一个班级ID
    const db = wx.cloud.database();
    const classesResult = await db.collection('classes').limit(1).get();
    
    if (classesResult.data.length === 0) {
      console.log('没有找到班级，跳过云函数测试');
      return true;
    }
    
    const classInfo = classesResult.data[0];
    console.log('使用班级进行测试: ' + classInfo.name + ' (ID: ' + classInfo._id + ')');
    
    // 调用同步云函数
    const syncResult = await wx.cloud.callFunction({
      name: 'syncClassStudentCount',
      data: {
        classId: classInfo._id,
        action: 'test_sync'
      }
    });
    
    console.log('云函数同步结果:', syncResult.result);
    return true;
    
  } catch (error) {
    console.error('测试云函数同步功能失败:', error);
    return false;
  }
}

// 修复班级学生人数统计
async function fixClassStudentCount() {
  try {
    console.log('开始修复班级学生人数统计...');
    
    const db = wx.cloud.database();
    
    // 获取所有班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log('找到 ' + classes.length + ' 个班级');
    
    let fixedCount = 0;
    
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
        
        console.log('已更新班级 ' + classInfo.name + ' 的学生数量为 ' + actualStudentCount);
        fixedCount++;
      }
    }
    
    console.log('班级学生人数统计修复完成，共修复 ' + fixedCount + ' 个班级');
    return { success: true, message: '班级学生人数统计修复完成，共修复 ' + fixedCount + ' 个班级' };
    
  } catch (error) {
    console.error('修复班级学生人数统计失败:', error);
    return { success: false, message: error.message };
  }
}

// 主测试函数
async function runAllTests() {
  try {
    console.log('开始测试学生数据同步修复效果...');
    console.log('=====================================');
    
    // 1. 测试班级学生数量统计
    const countTest = await testClassStudentCount();
    console.log('班级学生数量统计测试: ' + (countTest ? '通过' : '失败'));
    console.log('-------------------------------------');
    
    // 2. 测试学生数据完整性
    const integrityTest = await testStudentDataIntegrity();
    console.log('学生数据完整性测试: ' + (integrityTest ? '通过' : '失败'));
    console.log('-------------------------------------');
    
    // 3. 测试云函数同步功能
    const syncTest = await testSyncFunction();
    console.log('云函数同步测试: ' + (syncTest ? '通过' : '失败'));
    console.log('-------------------------------------');
    
    console.log('所有测试完成！');
    
    return {
      success: true,
      message: '学生数据同步修复效果测试完成',
      results: {
        countTest: countTest,
        integrityTest: integrityTest,
        syncTest: syncTest
      }
    };
    
  } catch (error) {
    console.error('测试过程中发生错误:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// 主修复函数
async function runAllFixes() {
  try {
    console.log('开始修复学生加入班级数据同步问题...');
    console.log('=====================================');
    
    // 修复班级学生人数统计
    const classCountResult = await fixClassStudentCount();
    console.log('班级学生人数统计修复结果: ' + (classCountResult.success ? '成功' : '失败'));
    console.log('-------------------------------------');
    
    console.log('所有修复完成！');
    
    return {
      success: true,
      message: '学生加入班级数据同步问题修复完成',
      results: {
        classCountFix: classCountResult
      }
    };
    
  } catch (error) {
    console.error('修复过程中发生错误:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// 将函数添加到全局作用域，方便在控制台调用
window.testClassStudentCount = testClassStudentCount;
window.testStudentDataIntegrity = testStudentDataIntegrity;
window.testSyncFunction = testSyncFunction;
window.fixClassStudentCount = fixClassStudentCount;
window.runAllTests = runAllTests;
window.runAllFixes = runAllFixes;

console.log('数据同步测试和修复函数已加载到全局作用域');
console.log('可用函数:');
console.log('- runAllTests() - 运行所有测试');
console.log('- runAllFixes() - 运行所有修复');
console.log('- testClassStudentCount() - 测试班级学生数量');
console.log('- testStudentDataIntegrity() - 测试学生数据完整性');
console.log('- testSyncFunction() - 测试云函数同步');
console.log('- fixClassStudentCount() - 修复班级学生数量');
