// 创建作业云函数
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { teacherId, title, description, questions, deadline, variantMode, variantRules } = event;
  
  try {
    // 验证教师权限
    const teacher = await db.collection('teachers').doc(teacherId).get();
    if (!teacher.data || teacher.data.status !== 'active') {
      return {
        success: false,
        error: '教师权限验证失败'
      };
    }
    
    // 验证题目存在性
    if (questions && questions.length > 0) {
      const questionPromises = questions.map(questionId => 
        db.collection('questions').doc(questionId).get()
      );
      const questionResults = await Promise.all(questionPromises);
      
      const invalidQuestions = questionResults.filter(result => !result.data);
      if (invalidQuestions.length > 0) {
        return {
          success: false,
          error: '部分题目不存在'
        };
      }
    }
    
    // 生成作业ID
    const assignmentId = `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 创建作业记录
    const assignmentData = {
      _id: assignmentId,
      teacherId: teacherId,
      title: title,
      description: description || '',
      questions: questions || [],
      deadline: new Date(deadline),
      status: 'active',
      variantMode: variantMode || 'auto',
      variantRules: variantRules || {
        "75": 5,  // 75%以上错误率给5题变式
        "50": 4,  // 50%以上错误率给4题变式
        "25": 3,  // 25%以上错误率给3题变式
        "0": 2    // 25%以下错误率给2题变式
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // 保存作业
    await db.collection('assignments').add({
      data: assignmentData
    });
    
    // 保存变式题规则
    if (variantMode !== 'none') {
      await db.collection('variant_rules').add({
        data: {
          _id: `variant_${assignmentId}`,
          assignmentId: assignmentId,
          rules: assignmentData.variantRules,
          createdAt: new Date()
        }
      });
    }
    
    // 更新语法点历史
    if (questions && questions.length > 0) {
      await updateGrammarPointHistory(questions, teacherId);
    }
    
    return {
      success: true,
      data: {
        assignmentId: assignmentId,
        message: '作业创建成功'
      }
    };
    
  } catch (error) {
    console.error('创建作业失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 更新语法点历史
async function updateGrammarPointHistory(questions, teacherId) {
  try {
    // 获取题目信息
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
    
    // 更新每个语法点的历史记录
    for (const [grammarPoint, questionList] of Object.entries(grammarPointMap)) {
      const historyId = `history_${teacherId}_${grammarPoint}_${Date.now()}`;
      
      await db.collection('grammar_point_history').add({
        data: {
          _id: historyId,
          grammarPoint: grammarPoint,
          teacherId: teacherId,
          lastAssigned: new Date(),
          averageAccuracy: 0, // 初始值，后续根据学生答题情况更新
          practiceCount: questionList.length,
          trend: 'stable',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
  } catch (error) {
    console.error('更新语法点历史失败:', error);
  }
}
