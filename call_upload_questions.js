// 在小程序控制台中调用云函数上传题库
// 此脚本不会增加小程序包大小，因为题目数据存储在云端

console.log('=== 上传题库到云数据库 ===\n');

// 读取本地备份数据
const questionsData = require('./backup/intermediate_questions_before_migration.js');

console.log('📚 准备上传数据:');
const categories = Object.keys(questionsData);
const cloudQuestions = [];

// 转换为云数据库格式
categories.forEach(category => {
  if (Array.isArray(questionsData[category]) && questionsData[category].length > 0) {
    questionsData[category].forEach((q, index) => {
      cloudQuestions.push({
        text: q.text,
        answer: q.answer,
        analysis: q.analysis || q.explanation || '',
        category: category,
        grammarPoint: q.tag || category,
        type: 'fill_blank',
        difficulty: q.difficulty || 'medium'
      });
    });
  }
});

console.log(`   题目总数: ${cloudQuestions.length}`);
console.log(`   分类数: ${new Set(cloudQuestions.map(q => q.category)).size}\n`);

// 方案A: 分批调用云函数（推荐，稳定）
async function uploadViaCloudFunction() {
  console.log('📤 使用云函数分批上传...\n');
  
  const batchSize = 50;  // 每批50题
  const batches = Math.ceil(cloudQuestions.length / batchSize);
  
  let totalUploaded = 0;
  
  for (let i = 0; i < batches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, cloudQuestions.length);
    const batch = cloudQuestions.slice(start, end);
    
    console.log(`上传第 ${i + 1}/${batches} 批（${start + 1}-${end}）...`);
    
    try {
      const result = await wx.cloud.callFunction({
        name: 'uploadQuestions',
        data: {
          action: 'upload',
          questions: batch
        }
      });
      
      if (result.result.success) {
        totalUploaded += result.result.uploaded;
        console.log(`✅ 成功上传 ${result.result.uploaded} 题`);
      } else {
        console.log(`❌ 上传失败:`, result.result.message);
      }
      
    } catch (error) {
      console.error(`❌ 批次 ${i + 1} 失败:`, error);
    }
    
    // 延迟避免频率限制
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n🎉 上传完成！成功 ${totalUploaded}/${cloudQuestions.length} 题`);
  
  // 验证上传结果
  const countResult = await wx.cloud.callFunction({
    name: 'uploadQuestions',
    data: { action: 'count' }
  });
  
  console.log(`\n✅ 云数据库当前题目数: ${countResult.result.count}`);
}

// 方案B: 直接操作数据库（快速，但可能不稳定）
async function uploadDirectly() {
  console.log('📤 直接上传到云数据库...\n');
  
  const batchSize = 20;
  let uploaded = 0;
  
  for (let i = 0; i < cloudQuestions.length; i += batchSize) {
    const batch = cloudQuestions.slice(i, i + batchSize);
    
    console.log(`上传 ${i + 1}-${Math.min(i + batchSize, cloudQuestions.length)}...`);
    
    for (const question of batch) {
      try {
        await wx.cloud.database().collection('questions').add({
          data: question
        });
        uploaded++;
        
        if (uploaded % 100 === 0) {
          console.log(`   已上传 ${uploaded} 题`);
        }
      } catch (error) {
        console.error('添加失败:', error.message);
      }
    }
    
    // 延迟避免频率限制
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n🎉 上传完成！成功 ${uploaded}/${cloudQuestions.length} 题`);
}

// 选择上传方式
console.log('📋 请选择上传方式:\n');
console.log('1. uploadViaCloudFunction() - 使用云函数（推荐，更稳定）');
console.log('2. uploadDirectly() - 直接上传（更快，但可能不稳定）\n');
console.log('💡 建议：在控制台运行 uploadViaCloudFunction()');

// 导出函数供手动调用
if (typeof window !== 'undefined') {
  window.uploadViaCloudFunction = uploadViaCloudFunction;
  window.uploadDirectly = uploadDirectly;
}

