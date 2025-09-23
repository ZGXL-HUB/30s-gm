// 获取作业列表云函数
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { teacherId, status } = event;
  
  try {
    // 构建查询条件
    let whereCondition = { teacherId: teacherId };
    
    if (status) {
      whereCondition.status = status;
    }
    
    // 获取作业列表
    const result = await db.collection('assignments')
      .where(whereCondition)
      .orderBy('createdAt', 'desc')
      .get();
    
    // 为每个作业添加统计信息
    const assignmentsWithStats = await Promise.all(
      result.data.map(async (assignment) => {
        // 获取学生完成情况
        const completionResult = await db.collection('assignment_results')
          .where({ assignmentId: assignment._id })
          .get();
        
        const studentCount = completionResult.data.length;
        const completionRate = studentCount > 0 ? 
          (completionResult.data.filter(r => r.status === 'completed').length / studentCount * 100).toFixed(1) : 0;
        
        // 计算平均正确率
        const averageAccuracy = studentCount > 0 ?
          (completionResult.data.reduce((sum, r) => sum + r.accuracy, 0) / studentCount).toFixed(1) : 0;
        
        return {
          ...assignment,
          studentCount: studentCount,
          completionRate: parseFloat(completionRate),
          averageAccuracy: parseFloat(averageAccuracy)
        };
      })
    );
    
    return {
      success: true,
      data: assignmentsWithStats
    };
    
  } catch (error) {
    console.error('获取作业列表失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
