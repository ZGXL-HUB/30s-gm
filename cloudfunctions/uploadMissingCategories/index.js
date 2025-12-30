// 云函数：批量上传缺失分类
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { category, categoryName, questions } = event;
  const actualCategory = category || categoryName; // 兼容两种参数名
  
  console.log(`开始上传分类: ${actualCategory}, 题目数: ${questions ? questions.length : 0}`);
  
  try {
    // 批量添加题目到数据库
    const batchSize = 20; // 每批20题
    let uploaded = 0;
    
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      const addPromises = batch.map(question => 
        db.collection('questions').add({
          data: {
            text: question.text,
            answer: question.answer,
            analysis: question.analysis || '',
            category: actualCategory,
            grammarPoint: question.tag || actualCategory,
            type: 'fill_blank',
            difficulty: question.difficulty || 'medium',
            createdAt: new Date().toISOString()
          }
        })
      );
      
      await Promise.all(addPromises);
      uploaded += batch.length;
      
      console.log(`已上传 ${uploaded}/${questions.length} 题`);
    }
    
    // 验证上传结果
    const verifyResult = await db.collection('questions')
      .where({ category: actualCategory })
      .count();
    
    return {
      success: true,
      category: actualCategory,
      uploaded: uploaded,
      verified: verifyResult.total,
      message: `成功上传 ${uploaded} 题到 "${actualCategory}"，验证 ${verifyResult.total} 题`
    };
    
  } catch (error) {
    console.error('上传失败:', error);
    return {
      success: false,
      category: actualCategory,
      error: error.message,
      message: `上传 ${actualCategory} 失败: ${error.message}`
    };
  }
};
