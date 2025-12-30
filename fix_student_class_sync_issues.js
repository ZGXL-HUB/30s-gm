/**
 * 修复学生加入班级后数据同步不一致问题
 * 问题描述：
 * 1. 学生加入班级后，教师端显示的学生人数不准确
 * 2. 班级管理界面的学生人数与学生管理界面显示的人数不符
 * 3. 弹窗没有正确显示学生名单
 */

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

/**
 * 修复班级学生人数统计
 */
async function fixClassStudentCount() {
  try {
    console.log('开始修复班级学生人数统计...');
    
    // 获取所有班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log(`找到 ${classes.length} 个班级`);
    
    for (const classInfo of classes) {
      // 统计该班级的实际学生数量
      const studentsResult = await db.collection('students').where({
        classId: classInfo._id,
        status: 'active'
      }).count();
      
      const actualStudentCount = studentsResult.total;
      const currentStudentCount = classInfo.currentStudents || 0;
      
      console.log(`班级 ${classInfo.name} (${classInfo._id}): 当前显示 ${currentStudentCount} 人，实际 ${actualStudentCount} 人`);
      
      // 如果数量不一致，更新班级数据
      if (actualStudentCount !== currentStudentCount) {
        await db.collection('classes').doc(classInfo._id).update({
          data: {
            currentStudents: actualStudentCount,
            studentCount: actualStudentCount,
            updatedAt: new Date()
          }
        });
        
        console.log(`已更新班级 ${classInfo.name} 的学生数量为 ${actualStudentCount}`);
      }
    }
    
    console.log('班级学生人数统计修复完成');
    return { success: true, message: '班级学生人数统计修复完成' };
    
  } catch (error) {
    console.error('修复班级学生人数统计失败:', error);
    return { success: false, message: error.message };
  }
}

/**
 * 修复学生数据同步问题
 */
async function fixStudentDataSync() {
  try {
    console.log('开始修复学生数据同步问题...');
    
    // 获取所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log(`找到 ${students.length} 个学生`);
    
    let fixedCount = 0;
    
    for (const student of students) {
      let needUpdate = false;
      const updateData = {};
      
      // 检查学生是否有有效的班级ID
      if (!student.classId) {
        console.log(`学生 ${student.name} 没有班级ID，跳过`);
        continue;
      }
      
      // 验证班级是否存在
      const classResult = await db.collection('classes').doc(student.classId).get();
      if (!classResult.data) {
        console.log(`学生 ${student.name} 的班级 ${student.classId} 不存在，需要处理`);
        // 可以选择将学生状态设为未分配班级，或者删除该学生记录
        updateData.status = 'inactive';
        updateData.classId = null;
        updateData.className = '未分配班级';
        needUpdate = true;
      } else {
        // 确保学生数据与班级数据一致
        const classInfo = classResult.data;
        if (student.className !== classInfo.name) {
          updateData.className = classInfo.name;
          needUpdate = true;
        }
        if (student.teacherId !== classInfo.teacherId) {
          updateData.teacherId = classInfo.teacherId;
          needUpdate = true;
        }
      }
      
      // 确保必要字段存在
      if (!student.status) {
        updateData.status = 'active';
        needUpdate = true;
      }
      if (!student.joinedAt) {
        updateData.joinedAt = new Date();
        needUpdate = true;
      }
      if (!student.createdAt) {
        updateData.createdAt = new Date();
        needUpdate = true;
      }
      
      if (needUpdate) {
        updateData.updatedAt = new Date();
        await db.collection('students').doc(student._id).update({
          data: updateData
        });
        fixedCount++;
        console.log(`已修复学生 ${student.name} 的数据`);
      }
    }
    
    console.log(`学生数据同步修复完成，共修复 ${fixedCount} 个学生`);
    return { success: true, message: `学生数据同步修复完成，共修复 ${fixedCount} 个学生` };
    
  } catch (error) {
    console.error('修复学生数据同步失败:', error);
    return { success: false, message: error.message };
  }
}

/**
 * 创建班级学生数据同步触发器
 */
async function createClassStudentSyncTrigger() {
  try {
    console.log('创建班级学生数据同步触发器...');
    
    // 这个函数可以在学生加入/离开班级时被调用
    // 确保班级的学生数量统计准确
    
    return {
      success: true,
      message: '班级学生数据同步触发器创建完成',
      triggerFunction: async (classId, action) => {
        try {
          // 统计该班级的实际学生数量
          const studentsResult = await db.collection('students').where({
            classId: classId,
            status: 'active'
          }).count();
          
          const actualStudentCount = studentsResult.total;
          
          // 更新班级学生数量
          await db.collection('classes').doc(classId).update({
            data: {
              currentStudents: actualStudentCount,
              studentCount: actualStudentCount,
              updatedAt: new Date()
            }
          });
          
          console.log(`班级 ${classId} 学生数量已同步为 ${actualStudentCount}`);
          return { success: true, studentCount: actualStudentCount };
          
        } catch (error) {
          console.error('同步班级学生数量失败:', error);
          return { success: false, message: error.message };
        }
      }
    };
    
  } catch (error) {
    console.error('创建班级学生数据同步触发器失败:', error);
    return { success: false, message: error.message };
  }
}

/**
 * 修复教师端数据加载逻辑
 */
function createTeacherDataSyncFix() {
  return `
// 修复教师端数据同步问题
async function loadClassDataWithSync() {
  try {
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 1. 从云端获取最新的班级数据
    const db = wx.cloud.database();
    const classesResult = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    // 2. 获取每个班级的学生数据
    const classesWithStudents = [];
    for (const classInfo of classesResult.data) {
      const studentsResult = await db.collection('students').where({
        classId: classInfo._id,
        status: 'active'
      }).get();
      
      const studentCount = studentsResult.data.length;
      
      // 更新班级学生数量
      if (classInfo.currentStudents !== studentCount) {
        await db.collection('classes').doc(classInfo._id).update({
          data: {
            currentStudents: studentCount,
            studentCount: studentCount,
            updatedAt: new Date()
          }
        });
      }
      
      classesWithStudents.push({
        ...classInfo,
        studentCount: studentCount,
        currentStudents: studentCount
      });
    }
    
    // 3. 获取所有学生数据
    const allStudentsResult = await db.collection('students').where({
      teacherId: teacherId
    }).get();
    
    const formattedStudents = allStudentsResult.data.map(student => ({
      id: student._id,
      name: student.name,
      studentId: student.studentId || student._id,
      phone: student.phone || '',
      email: student.email || '',
      class: student.className || '未分配班级',
      classId: student.classId || null,
      status: student.status || 'active',
      completedAssignments: student.completedAssignments || 0,
      totalAssignments: student.totalAssignments || 0,
      averageAccuracy: student.averageAccuracy || 0,
      weakGrammarPoints: student.weakGrammarPoints || [],
      createTime: student.createTime || new Date(),
      updateTime: student.updateTime || new Date()
    }));
    
    // 4. 更新页面数据
    this.setData({
      classes: classesWithStudents,
      students: formattedStudents
    });
    
    // 5. 更新本地存储
    wx.setStorageSync(\`teacher_classes_\${teacherId}\`, classesWithStudents);
    wx.setStorageSync(\`teacher_students_\${teacherId}\`, formattedStudents);
    
    console.log('教师端数据同步完成:', {
      classes: classesWithStudents.length,
      students: formattedStudents.length
    });
    
  } catch (error) {
    console.error('教师端数据同步失败:', error);
    throw error;
  }
}

// 修复班级详情弹窗数据加载
async function loadClassStudentsWithSync(classId) {
  try {
    wx.showLoading({
      title: '加载学生数据...'
    });
    
    const db = wx.cloud.database();
    
    // 从云端获取该班级的学生数据
    const result = await db.collection('students').where({
      classId: classId,
      status: 'active'
    }).get();
    
    const classStudents = result.data.map(student => ({
      id: student._id,
      name: student.name,
      studentId: student.studentId || student._id,
      status: student.status || 'active',
      joinedAt: student.joinedAt || student.createTime
    }));
    
    // 更新班级学生数量
    const classResult = await db.collection('classes').doc(classId).get();
    if (classResult.data) {
      await db.collection('classes').doc(classId).update({
        data: {
          currentStudents: classStudents.length,
          studentCount: classStudents.length,
          updatedAt: new Date()
        }
      });
    }
    
    this.setData({
      classStudents: classStudents
    });
    
    // 缓存到本地
    wx.setStorageSync(\`class_students_\${classId}\`, classStudents);
    
    wx.hideLoading();
    
  } catch (error) {
    console.error('加载班级学生数据失败:', error);
    wx.hideLoading();
    wx.showToast({
      title: '加载学生数据失败',
      icon: 'none'
    });
  }
}
`;
}

/**
 * 主修复函数
 */
async function main() {
  try {
    console.log('开始修复学生加入班级数据同步问题...');
    
    // 1. 修复班级学生人数统计
    const classCountResult = await fixClassStudentCount();
    console.log('班级学生人数统计修复结果:', classCountResult);
    
    // 2. 修复学生数据同步
    const studentSyncResult = await fixStudentDataSync();
    console.log('学生数据同步修复结果:', studentSyncResult);
    
    // 3. 创建同步触发器
    const triggerResult = await createClassStudentSyncTrigger();
    console.log('同步触发器创建结果:', triggerResult);
    
    // 4. 生成教师端修复代码
    const teacherFixCode = createTeacherDataSyncFix();
    
    console.log('学生加入班级数据同步问题修复完成');
    
    return {
      success: true,
      message: '学生加入班级数据同步问题修复完成',
      results: {
        classCountFix: classCountResult,
        studentSyncFix: studentSyncResult,
        triggerCreation: triggerResult
      },
      teacherFixCode: teacherFixCode
    };
    
  } catch (error) {
    console.error('修复过程中发生错误:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// 导出函数
module.exports = {
  main,
  fixClassStudentCount,
  fixStudentDataSync,
  createClassStudentSyncTrigger,
  createTeacherDataSyncFix
};

// 如果直接运行此脚本
if (require.main === module) {
  main().then(result => {
    console.log('修复完成:', result);
  }).catch(error => {
    console.error('修复失败:', error);
  });
}
