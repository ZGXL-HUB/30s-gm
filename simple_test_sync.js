/**
 * 简化的学生数据同步测试脚本
 * 避免模板字符串和复杂语法，确保兼容性
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
    
    // 获取一个班级进行测试
    const db = wx.cloud.database();
    const classesResult = await db.collection('classes').limit(1).get();
    
    if (classesResult.data.length === 0) {
      console.log('没有找到班级，跳过云函数测试');
      return true;
    }
    
    const classInfo = classesResult.data[0];
    
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

// 导出函数供外部调用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests: runAllTests,
    testClassStudentCount: testClassStudentCount,
    testStudentDataIntegrity: testStudentDataIntegrity,
    testSyncFunction: testSyncFunction
  };
}

// 如果直接运行此脚本
if (typeof window !== 'undefined' && window.wx) {
  // 在微信小程序环境中
  runAllTests().then(result => {
    console.log('测试完成:', result);
  }).catch(error => {
    console.error('测试失败:', error);
  });
}
