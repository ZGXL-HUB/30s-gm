// 提交作业结果云函数
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { assignmentId, studentId, answers } = event;
  
  try {
    // 验证作业是否存在且未过期
    const assignment = await db.collection('assignments').doc(assignmentId).get();
    if (!assignment.data) {
      return {
        success: false,
        error: '作业不存在'
      };
    }
    
    if (assignment.data.status !== 'active') {
      return {
        success: false,
        error: '作业已结束'
      };
    }
    
    if (new Date() > new Date(assignment.data.deadline)) {
      return {
        success: false,
        error: '作业已过期'
      };
    }
    
    // 检查是否已经提交过
    const existingResult = await db.collection('assignment_results')
      .where({
        assignmentId: assignmentId,
        studentId: studentId
      })
      .get();
    
    if (existingResult.data.length > 0) {
      return {
        success: false,
        error: '作业已提交，不能重复提交'
      };
    }
    
    // 获取题目信息
    const questions = assignment.data.questions;
    const questionPromises = questions.map(questionId => 
      db.collection('questions').doc(questionId).get()
    );
    const questionResults = await Promise.all(questionPromises);
    
    // 计算得分和错题
    const correctAnswers = [];
    const wrongQuestions = [];
    let correctCount = 0;
    
    questionResults.forEach((result, index) => {
      if (result.data) {
        const correctAnswer = result.data.answer || result.data.correctAnswer;
        correctAnswers.push(correctAnswer);
        
        if (answers[index] === correctAnswer) {
          correctCount++;
        } else {
          wrongQuestions.push(result.data._id);
        }
      }
    });
    
    const totalScore = questions.length;
    const score = correctCount;
    const accuracy = totalScore > 0 ? (correctCount / totalScore * 100).toFixed(2) : 0;
    
    // 生成结果ID
    const resultId = `result_${assignmentId}_${studentId}_${Date.now()}`;
    
    // 保存作业结果
    const resultData = {
      _id: resultId,
      assignmentId: assignmentId,
      studentId: studentId,
      answers: answers,
      correctAnswers: correctAnswers,
      score: score,
      totalScore: totalScore,
      accuracy: parseFloat(accuracy),
      wrongQuestions: wrongQuestions,
      submittedAt: new Date()
    };
    
    await db.collection('assignment_results').add({
      data: resultData
    });
    
    // 更新学生错题记录
    await updateStudentMistakes(studentId, wrongQuestions, questionResults);
    
    // 更新语法点历史统计
    await updateGrammarPointStats(assignmentId, accuracy);
    
    return {
      success: true,
      data: {
        resultId: resultId,
        score: score,
        totalScore: totalScore,
        accuracy: accuracy,
        wrongQuestions: wrongQuestions,
        message: '作业提交成功'
      }
    };
    
  } catch (error) {
    console.error('提交作业结果失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 更新学生错题记录
async function updateStudentMistakes(studentId, wrongQuestions, questionResults) {
  try {
    const wrongQuestionData = questionResults
      .filter((result, index) => wrongQuestions.includes(result.data._id))
      .map(result => ({
        questionId: result.data._id,
        question: result.data.question || result.data.text,
        category: result.data.category,
        grammarPoint: result.data.category,
        timestamp: Date.now(),
        week: getWeekNumber(new Date())
      }));
    
    // 保存到学生错题表
    for (const mistake of wrongQuestionData) {
      await db.collection('student_mistakes').add({
        data: {
          _id: `mistake_${studentId}_${mistake.questionId}_${Date.now()}`,
          studentId: studentId,
          questionId: mistake.questionId,
          question: mistake.question,
          category: mistake.category,
          grammarPoint: mistake.grammarPoint,
          timestamp: mistake.timestamp,
          week: mistake.week,
          createdAt: new Date()
        }
      });
    }
  } catch (error) {
    console.error('更新学生错题记录失败:', error);
  }
}

// 更新语法点统计
async function updateGrammarPointStats(assignmentId, accuracy) {
  try {
    // 获取作业信息
    const assignment = await db.collection('assignments').doc(assignmentId).get();
    if (!assignment.data) return;
    
    // 获取题目信息
    const questions = assignment.data.questions;
    const questionPromises = questions.map(questionId => 
      db.collection('questions').doc(questionId).get()
    );
    const questionResults = await Promise.all(questionPromises);
    
    // 按语法点分组
    const grammarPointMap = {};
    questionResults.forEach(result => {
      if (result.data) {
        const category = result.data.category;
        if (!grammarPointMap[category]) {
          grammarPointMap[category] = [];
        }
        grammarPointMap[category].push(result.data);
      }
    });
    
    // 更新每个语法点的统计
    for (const [grammarPoint, questionList] of Object.entries(grammarPointMap)) {
      const historyQuery = await db.collection('grammar_point_history')
        .where({
          grammarPoint: grammarPoint,
          teacherId: assignment.data.teacherId
        })
        .orderBy('lastAssigned', 'desc')
        .limit(1)
        .get();
      
      if (historyQuery.data.length > 0) {
        const history = historyQuery.data[0];
        const newAccuracy = (history.averageAccuracy + parseFloat(accuracy)) / 2;
        
        await db.collection('grammar_point_history').doc(history._id).update({
          data: {
            averageAccuracy: newAccuracy,
            updatedAt: new Date()
          }
        });
      }
    }
  } catch (error) {
    console.error('更新语法点统计失败:', error);
  }
}

// 获取周数
function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}
