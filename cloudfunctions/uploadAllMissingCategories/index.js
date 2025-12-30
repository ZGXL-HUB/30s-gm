// 云函数：一次性上传所有缺失分类
// 这个云函数直接读取备份文件并上传所有缺失的分类

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 嵌入备份数据（从 backup/intermediate_questions_before_migration.js 中提取）
// 注意：由于数据量较大，这里只包含缺失的14个分类

const getMissingCategoriesData = () => {
  // 这个函数需要返回所有缺失分类的数据
  // 由于控制台环境限制，我们需要手动将数据嵌入云函数
  
  return {
    categories: [
      "介词综合",
      "固定搭配", 
      "介词 + 名词/动名词",
      "f/fe结尾",
      "谓语(1)",
      "副词修饰句子",
      "谓语(2)",
      "谓语(3)",
      "谓语(4)",
      "谓语(5)",
      "谓语(6)",
      "谓语(7)",
      "谓语(8)",
      "谓语(9)"
    ]
  };
};

// 上传单个分类
async function uploadCategory(categoryName, questions) {
  console.log(`开始上传: ${categoryName}, 题目数: ${questions.length}`);
  
  const batchSize = 20;
  let uploaded = 0;
  
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    const addPromises = batch.map(question => 
      db.collection('questions').add({
        data: {
          text: question.text,
          answer: question.answer,
          analysis: question.analysis || '',
          category: categoryName,
          grammarPoint: question.tag || categoryName,
          type: 'fill_blank',
          difficulty: question.difficulty || 'medium',
          createdAt: new Date().toISOString()
        }
      })
    );
    
    await Promise.all(addPromises);
    uploaded += batch.length;
    
    console.log(`  ${categoryName}: ${uploaded}/${questions.length} 题`);
  }
  
  return uploaded;
}

exports.main = async (event, context) => {
  const { action } = event;
  
  // 如果只是测试云函数是否存在
  if (action === 'test') {
    return {
      success: true,
      message: '云函数运行正常'
    };
  }
  
  // 如果提供了具体的分类数据
  if (event.category && event.questions) {
    const { category, questions } = event;
    
    try {
      const uploaded = await uploadCategory(category, questions);
      
      // 验证
      const verify = await db.collection('questions')
        .where({ category })
        .count();
      
      return {
        success: true,
        category,
        uploaded,
        verified: verify.total,
        message: `成功上传 ${uploaded} 题到 "${category}"`
      };
    } catch (error) {
      return {
        success: false,
        category,
        error: error.message
      };
    }
  }
  
  return {
    success: false,
    message: '请提供 category 和 questions 参数，或使用 action: "test" 进行测试'
  };
};

