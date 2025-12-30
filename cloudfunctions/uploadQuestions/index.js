// 云函数：上传题库数据到云数据库
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  const { action, questions, batchIndex, batchSize } = event;
  
  try {
    switch (action) {
      case 'upload':
        return await uploadQuestions(questions);
        
      case 'uploadBatch':
        return await uploadBatch(questions, batchIndex, batchSize);
        
      case 'clearAll':
        return await clearAllQuestions();
        
      case 'count':
        return await getQuestionCount();
        
      default:
        return { success: false, message: '无效的操作' };
    }
  } catch (error) {
    console.error('云函数执行失败:', error);
    return { success: false, message: error.message };
  }
};

// 上传题目
async function uploadQuestions(questions) {
  if (!questions || questions.length === 0) {
    return { success: false, message: '没有题目数据' };
  }
  
  let successCount = 0;
  let failCount = 0;
  
  // 分批添加（每次20题，避免超时）
  const batchSize = 20;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    for (const question of batch) {
      try {
        await db.collection('questions').add({
          data: {
            text: question.text,
            answer: question.answer,
            analysis: question.analysis || '',
            category: question.category,
            grammarPoint: question.grammarPoint || question.category,
            type: 'fill_blank',
            difficulty: question.difficulty || 'medium',
            createdAt: db.serverDate()
          }
        });
        successCount++;
      } catch (error) {
        console.error('添加题目失败:', error);
        failCount++;
      }
    }
    
    console.log(`已上传 ${successCount}/${questions.length} 题`);
  }
  
  return {
    success: true,
    uploaded: successCount,
    failed: failCount,
    total: questions.length
  };
}

// 分批上传
async function uploadBatch(questions, batchIndex, batchSize) {
  const start = batchIndex * batchSize;
  const end = Math.min(start + batchSize, questions.length);
  const batch = questions.slice(start, end);
  
  let successCount = 0;
  
  for (const question of batch) {
    try {
      await db.collection('questions').add({
        data: {
          text: question.text,
          answer: question.answer,
          analysis: question.analysis || '',
          category: question.category,
          grammarPoint: question.grammarPoint || question.category,
          type: 'fill_blank',
          difficulty: question.difficulty || 'medium',
          createdAt: db.serverDate()
        }
      });
      successCount++;
    } catch (error) {
      console.error('添加题目失败:', error);
    }
  }
  
  return {
    success: true,
    batchIndex: batchIndex,
    uploaded: successCount,
    total: batch.length
  };
}

// 清空所有题目
async function clearAllQuestions() {
  const result = await db.collection('questions').where({}).remove();
  return {
    success: true,
    removed: result.stats.removed,
    message: `已删除 ${result.stats.removed} 道题目`
  };
}

// 统计题目数量
async function getQuestionCount() {
  const result = await db.collection('questions').count();
  return {
    success: true,
    count: result.total,
    message: `当前有 ${result.total} 道题目`
  };
}

