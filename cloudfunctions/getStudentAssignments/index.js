// 获取学生作业列表云函数
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { studentId } = event;
  
  try {
    // 获取所有作业
    const assignmentsResult = await db.collection('assignments')
      .where({ status: 'active' })
      .orderBy('createdAt', 'desc')
      .get();
    
    // 获取学生已完成的作业结果
    const completedResults = await db.collection('assignment_results')
      .where({ studentId: studentId })
      .get();
    
    const completedAssignmentIds = completedResults.data.map(r => r.assignmentId);
    
    // 为每个作业添加学生完成状态
    const assignmentsWithStatus = assignmentsResult.data.map(assignment => {
      const isCompleted = completedAssignmentIds.includes(assignment._id);
      const result = completedResults.data.find(r => r.assignmentId === assignment._id);
      
      return {
        ...assignment,
        status: isCompleted ? 'completed' : 'pending',
        score: result ? result.score : 0,
        totalScore: result ? result.totalScore : assignment.questions.length,
        accuracy: result ? result.accuracy : 0,
        submittedAt: result ? result.submittedAt : null
      };
    });
    
    return {
      success: true,
      data: assignmentsWithStatus
    };
    
  } catch (error) {
    console.error('获取学生作业列表失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
