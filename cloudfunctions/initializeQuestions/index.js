// 初始化题目数据云函数
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 导入题目数据
const questions = require('./questions.js');

/**
 * 初始化题目数据到云数据库
 */
exports.main = async (event, context) => {
  const { action } = event;
  
  try {
    switch (action) {
      case 'init':
        return await initializeQuestions();
      case 'test':
        return { success: true, message: 'initializeQuestions 云函数正常' };
      default:
        return { success: false, message: '无效的操作类型' };
    }
  } catch (error) {
    console.error('初始化题目数据错误:', error);
    return { success: false, message: error.message };
  }
};

/**
 * 初始化题目数据
 */
async function initializeQuestions() {
  try {
    console.log('开始初始化题目数据...');
    
    // 检查是否已经初始化过
    const existingResult = await db.collection('questions').limit(1).get();
    if (existingResult.data.length > 0) {
      return {
        success: true,
        message: '题目数据已存在，跳过初始化',
        count: existingResult.data.length
      };
    }
    
    // 批量添加题目数据
    const questionsData = questions.intermediate_questions['综合练习'];
    const batchSize = 100; // 每批处理100条
    let totalAdded = 0;
    
    for (let i = 0; i < questionsData.length; i += batchSize) {
      const batch = questionsData.slice(i, i + batchSize);
      
      // 准备批量添加的数据
      const batchData = batch.map((question, index) => ({
        ...question,
        category: '综合练习',
        level: 'intermediate',
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: `question_${i + index}_${Date.now()}`
      }));
      
      // 批量添加
      const result = await db.collection('questions').add({
        data: batchData
      });
      
      totalAdded += batch.length;
      console.log(`已添加 ${totalAdded}/${questionsData.length} 条题目`);
    }
    
    return {
      success: true,
      message: `题目数据初始化完成，共添加 ${totalAdded} 条题目`,
      count: totalAdded
    };
    
  } catch (error) {
    console.error('初始化题目数据失败:', error);
    throw error;
  }
}
