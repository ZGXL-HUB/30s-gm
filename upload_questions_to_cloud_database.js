// 将本地题库上传到云数据库
// 在控制台或Node.js环境运行

console.log('=== 上传题库到云数据库 ===\n');

// 读取本地备份数据
const questions = require('./backup/intermediate_questions_before_migration.js');

console.log('📚 本地题库统计:');
const categories = Object.keys(questions);
let totalQuestions = 0;

categories.forEach(cat => {
  if (Array.isArray(questions[cat]) && questions[cat].length > 0) {
    totalQuestions += questions[cat].length;
  }
});

console.log(`   分类数: ${categories.length}`);
console.log(`   总题数: ${totalQuestions}`);

// 转换为云数据库格式
const cloudQuestions = [];
categories.forEach(category => {
  if (Array.isArray(questions[category])) {
    questions[category].forEach((q, index) => {
      cloudQuestions.push({
        text: q.text,
        answer: q.answer,
        analysis: q.analysis || q.explanation || '',
        category: category,
        grammarPoint: q.tag || category,  // 使用tag或category作为grammarPoint
        type: 'fill_blank',
        difficulty: q.difficulty || 'medium',
        createdAt: new Date().toISOString()
      });
    });
  }
});

console.log(`\n📦 转换完成: ${cloudQuestions.length} 题\n`);

// 在微信小程序控制台中运行上传
if (typeof wx !== 'undefined' && wx.cloud) {
  console.log('检测到小程序环境，开始上传...\n');
  
  // 分批上传（每批100题）
  const batchSize = 100;
  const batches = Math.ceil(cloudQuestions.length / batchSize);
  
  let uploaded = 0;
  
  const uploadBatch = async (batchIndex) => {
    const start = batchIndex * batchSize;
    const end = Math.min(start + batchSize, cloudQuestions.length);
    const batch = cloudQuestions.slice(start, end);
    
    console.log(`上传第 ${batchIndex + 1}/${batches} 批，题目 ${start + 1}-${end}...`);
    
    try {
      // 逐个添加（云数据库不支持批量添加太多）
      for (const question of batch) {
        await wx.cloud.database().collection('questions').add({
          data: question
        });
        uploaded++;
      }
      
      console.log(`✅ 第 ${batchIndex + 1} 批上传成功（${batch.length}题）`);
      
      // 继续下一批
      if (batchIndex + 1 < batches) {
        setTimeout(() => uploadBatch(batchIndex + 1), 1000);  // 延迟1秒避免频率限制
      } else {
        console.log(`\n🎉 上传完成！总计 ${uploaded}/${cloudQuestions.length} 题`);
        console.log('请运行验证脚本检查数据完整性');
      }
      
    } catch (error) {
      console.error(`❌ 第 ${batchIndex + 1} 批上传失败:`, error);
      console.log('请检查云开发权限和网络连接');
    }
  };
  
  // 开始上传
  uploadBatch(0);
  
} else {
  console.log('⚠️ 未检测到小程序环境');
  console.log('\n使用方法:');
  console.log('1. 在微信开发者工具控制台中运行此脚本');
  console.log('2. 或使用云函数 uploadQuestions');
  console.log('\n准备上传的数据已转换完成，包含:');
  console.log(`   - ${cloudQuestions.length} 道题目`);
  console.log(`   - ${new Set(cloudQuestions.map(q => q.category)).size} 个分类`);
}

// 如果在Node.js环境，导出数据供云函数使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cloudQuestions,
    totalCount: cloudQuestions.length
  };
}

