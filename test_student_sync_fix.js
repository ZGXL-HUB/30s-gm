/**
 * 测试学生加入班级数据同步修复效果
 */

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

/**
 * 测试班级学生数量统计
 */
async function testClassStudentCount() {
  try {
    console.log('开始测试班级学生数量统计...');
    
    // 获取所有班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log('找到 ' + classes.length + ' 个班级');
    
    for (const classInfo of classes) {
      // 统计该班级的实际学生数量
      const studentsResult = await db.collection('students').where({
        classId: classInfo._id,
        status: 'active'
      }).count();
      
      const actualStudentCount = studentsResult.total;
      const currentStudentCount = classInfo.currentStudents || 0;
      
      console.log('班级 ' + classInfo.name + ' (' + classInfo._id + '):');
      console.log('  当前显示: ' + currentStudentCount + ' 人');
      console.log('  实际学生: ' + actualStudentCount + ' 人');
      console.log('  状态: ' + (actualStudentCount === currentStudentCount ? '✓ 一致' : '✗ 不一致'));
      
      if (actualStudentCount !== currentStudentCount) {
        console.log('  ⚠️  需要修复: 更新班级学生数量为 ' + actualStudentCount);
      }
    }
    
    return { success: true, message: '班级学生数量统计测试完成' };
    
  } catch (error) {
    console.error('测试班级学生数量统计失败:', error);
    return { success: false, message: error.message };
  }
}

/**
 * 测试学生数据完整性
 */
async function testStudentDataIntegrity() {
  try {
    console.log('开始测试学生数据完整性...');
    
    // 获取所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('找到 ' + students.length + ' 个学生');
    
    let validStudents = 0;
    let invalidStudents = 0;
    
    for (const student of students) {
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
      } else {
        // 验证班级是否存在
        const classResult = await db.collection('classes').doc(student.classId).get();
        if (!classResult.data) {
          issues.push('班级不存在');
          isValid = false;
        }
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
    
    return { 
      success: true, 
      message: '学生数据完整性测试完成',
      data: { validStudents, invalidStudents }
    };
    
  } catch (error) {
    console.error('测试学生数据完整性失败:', error);
    return { success: false, message: error.message };
  }
}

/**
 * 测试云函数同步功能
 */
async function testSyncFunction() {
  try {
    console.log('开始测试云函数同步功能...');
    
    // 获取一个班级进行测试
    const classesResult = await db.collection('classes').limit(1).get();
    if (classesResult.data.length === 0) {
      console.log('没有找到班级，跳过云函数测试');
      return { success: true, message: '没有班级可测试' };
    }
    
    const classInfo = classesResult.data[0];
    
    // 调用同步云函数
    const syncResult = await cloud.callFunction({
      name: 'syncClassStudentCount',
      data: {
        classId: classInfo._id,
        action: 'test_sync'
      }
    });
    
    console.log('云函数同步结果:', syncResult.result);
    
    return { 
      success: true, 
      message: '云函数同步测试完成',
      data: syncResult.result
    };
    
  } catch (error) {
    console.error('测试云函数同步功能失败:', error);
    return { success: false, message: error.message };
  }
}

/**
 * 主测试函数
 */
async function main() {
  try {
    console.log('开始测试学生加入班级数据同步修复效果...');
    console.log('='.repeat(50));
    
    // 1. 测试班级学生数量统计
    const countTest = await testClassStudentCount();
    console.log('班级学生数量统计测试结果:', countTest);
    console.log('-'.repeat(30));
    
    // 2. 测试学生数据完整性
    const integrityTest = await testStudentDataIntegrity();
    console.log('学生数据完整性测试结果:', integrityTest);
    console.log('-'.repeat(30));
    
    // 3. 测试云函数同步功能
    const syncTest = await testSyncFunction();
    console.log('云函数同步测试结果:', syncTest);
    console.log('-'.repeat(30));
    
    console.log('所有测试完成！');
    
    return {
      success: true,
      message: '学生加入班级数据同步修复效果测试完成',
      results: {
        countTest,
        integrityTest,
        syncTest
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

// 导出函数
module.exports = {
  main,
  testClassStudentCount,
  testStudentDataIntegrity,
  testSyncFunction
};

// 如果直接运行此脚本
if (require.main === module) {
  main().then(result => {
    console.log('测试完成:', result);
  }).catch(error => {
    console.error('测试失败:', error);
  });
}
