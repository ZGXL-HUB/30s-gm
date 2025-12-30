/**
 * 同步班级学生数量统计云函数
 * 当学生加入或离开班级时，自动更新班级的学生数量统计
 */

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { classId, action } = event;
  
  try {
    if (!classId) {
      return { success: false, message: '班级ID不能为空' };
    }
    
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
    
    return {
      success: true,
      message: '班级学生数量同步成功',
      data: {
        classId: classId,
        studentCount: actualStudentCount,
        action: action
      }
    };
    
  } catch (error) {
    console.error('同步班级学生数量失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
};
