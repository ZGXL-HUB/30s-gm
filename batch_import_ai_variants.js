/**
 * AI生成变式题批量导入脚本
 * 用于将AI生成的变式题批量导入到云数据库
 * 
 * 使用方法：
 * 1. 在微信开发者工具控制台中运行此脚本
 * 2. 将AI生成的JSON数组赋值给 questions 变量
 * 3. 调用 uploadAIVariants() 函数开始导入
 */

console.log('=== AI变式题批量导入工具 ===\n');

/**
 * 验证题目字段完整性
 */
function validateQuestion(question, index) {
  const requiredFields = [
    'text', 'answer', 'grammarPoint', 'category', 
    'type', 'analysis', 'difficulty', 'province', 'year', 'source'
  ];
  
  const missingFields = requiredFields.filter(field => !question.hasOwnProperty(field));
  
  if (missingFields.length > 0) {
    console.warn(`⚠️ 题目 ${index + 1} 缺少字段: ${missingFields.join(', ')}`);
    return false;
  }
  
  // 验证字段值
  if (!question.text || question.text.trim() === '') {
    console.warn(`⚠️ 题目 ${index + 1} text字段为空`);
    return false;
  }
  
  if (!['A', 'B', 'C', 'D'].includes(question.answer)) {
    console.warn(`⚠️ 题目 ${index + 1} answer字段无效: ${question.answer}`);
    return false;
  }
  
  if (!['choice', 'fill_blank'].includes(question.type)) {
    console.warn(`⚠️ 题目 ${index + 1} type字段无效: ${question.type}`);
    return false;
  }
  
  if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
    console.warn(`⚠️ 题目 ${index + 1} difficulty字段无效: ${question.difficulty}`);
    return false;
  }
  
  return true;
}

/**
 * 格式化题目数据，确保符合数据库格式
 */
function formatQuestion(question) {
  return {
    text: question.text.trim(),
    answer: question.answer,
    grammarPoint: question.grammarPoint,
    category: question.category,
    type: question.type,
    analysis: question.analysis || '',
    difficulty: question.difficulty,
    province: question.province || '云南',
    year: typeof question.year === 'number' ? question.year : parseInt(question.year) || 2025,
    source: question.source || '变式题',
    createdAt: new Date().toISOString()
  };
}

/**
 * 统计题目信息
 */
function analyzeQuestions(questions) {
  const stats = {
    total: questions.length,
    valid: 0,
    invalid: 0,
    byCategory: {},
    byGrammarPoint: {},
    byDifficulty: {},
    byType: {}
  };
  
  questions.forEach((q, index) => {
    if (validateQuestion(q, index)) {
      stats.valid++;
      
      // 统计分类
      stats.byCategory[q.category] = (stats.byCategory[q.category] || 0) + 1;
      stats.byGrammarPoint[q.grammarPoint] = (stats.byGrammarPoint[q.grammarPoint] || 0) + 1;
      stats.byDifficulty[q.difficulty] = (stats.byDifficulty[q.difficulty] || 0) + 1;
      stats.byType[q.type] = (stats.byType[q.type] || 0) + 1;
    } else {
      stats.invalid++;
    }
  });
  
  return stats;
}

/**
 * 方案A: 使用云函数上传（推荐，更稳定）
 */
async function uploadViaCloudFunction(questions) {
  console.log('📤 使用云函数分批上传...\n');
  
  // 验证并格式化题目
  const validQuestions = [];
  questions.forEach((q, index) => {
    if (validateQuestion(q, index)) {
      validQuestions.push(formatQuestion(q));
    }
  });
  
  if (validQuestions.length === 0) {
    console.error('❌ 没有有效的题目可以上传');
    return { success: false, message: '没有有效的题目' };
  }
  
  console.log(`✅ 验证通过: ${validQuestions.length}/${questions.length} 题有效\n`);
  
  const batchSize = 50;  // 每批50题
  const batches = Math.ceil(validQuestions.length / batchSize);
  
  let totalUploaded = 0;
  let totalFailed = 0;
  
  for (let i = 0; i < batches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, validQuestions.length);
    const batch = validQuestions.slice(start, end);
    
    console.log(`📦 上传第 ${i + 1}/${batches} 批（${start + 1}-${end}）...`);
    
    try {
      const result = await wx.cloud.callFunction({
        name: 'uploadQuestions',
        data: {
          action: 'upload',
          questions: batch
        }
      });
      
      if (result.result && result.result.success) {
        const uploaded = result.result.uploaded || batch.length;
        totalUploaded += uploaded;
        console.log(`✅ 成功上传 ${uploaded} 题`);
      } else {
        console.log(`❌ 上传失败:`, result.result?.message || '未知错误');
        totalFailed += batch.length;
      }
      
    } catch (error) {
      console.error(`❌ 批次 ${i + 1} 失败:`, error);
      totalFailed += batch.length;
    }
    
    // 延迟避免频率限制
    if (i < batches - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`\n📊 上传统计:`);
  console.log(`   ✅ 成功: ${totalUploaded} 题`);
  console.log(`   ❌ 失败: ${totalFailed} 题`);
  console.log(`   📈 总计: ${validQuestions.length} 题\n`);
  
  // 验证上传结果
  try {
    const countResult = await wx.cloud.callFunction({
      name: 'uploadQuestions',
      data: { action: 'count' }
    });
    
    if (countResult.result && countResult.result.count !== undefined) {
      console.log(`✅ 云数据库当前题目总数: ${countResult.result.count}`);
    }
  } catch (error) {
    console.log('⚠️ 无法获取数据库统计信息');
  }
  
  return {
    success: totalFailed === 0,
    uploaded: totalUploaded,
    failed: totalFailed,
    total: validQuestions.length
  };
}

/**
 * 方案B: 直接操作数据库（快速，但可能不稳定）
 */
async function uploadDirectly(questions) {
  console.log('📤 直接上传到云数据库...\n');
  
  if (!wx || !wx.cloud || !wx.cloud.database) {
    console.error('❌ 未检测到云开发环境');
    return { success: false, message: '未检测到云开发环境' };
  }
  
  // 验证并格式化题目
  const validQuestions = [];
  questions.forEach((q, index) => {
    if (validateQuestion(q, index)) {
      validQuestions.push(formatQuestion(q));
    }
  });
  
  if (validQuestions.length === 0) {
    console.error('❌ 没有有效的题目可以上传');
    return { success: false, message: '没有有效的题目' };
  }
  
  console.log(`✅ 验证通过: ${validQuestions.length}/${questions.length} 题有效\n`);
  
  const batchSize = 20;  // 每批20题，避免超时
  let uploaded = 0;
  let failed = 0;
  
  for (let i = 0; i < validQuestions.length; i += batchSize) {
    const batch = validQuestions.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(validQuestions.length / batchSize);
    
    console.log(`📦 上传第 ${batchNum}/${totalBatches} 批（${i + 1}-${Math.min(i + batchSize, validQuestions.length)}）...`);
    
    for (const question of batch) {
      try {
        await wx.cloud.database().collection('questions').add({
          data: question
        });
        uploaded++;
        
        if (uploaded % 50 === 0) {
          console.log(`   ✅ 已上传 ${uploaded} 题`);
        }
      } catch (error) {
        console.error(`   ❌ 添加失败:`, error.message);
        failed++;
      }
    }
    
    // 延迟避免频率限制
    if (i + batchSize < validQuestions.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`\n📊 上传统计:`);
  console.log(`   ✅ 成功: ${uploaded} 题`);
  console.log(`   ❌ 失败: ${failed} 题`);
  console.log(`   📈 总计: ${validQuestions.length} 题\n`);
  
  return {
    success: failed === 0,
    uploaded: uploaded,
    failed: failed,
    total: validQuestions.length
  };
}

/**
 * 主导入函数（自动选择最佳方式）
 */
async function uploadAIVariants(questions) {
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    console.error('❌ 请提供有效的题目数组');
    return { success: false, message: '无效的题目数据' };
  }
  
  console.log(`📚 准备导入 ${questions.length} 道题目\n`);
  
  // 分析题目
  const stats = analyzeQuestions(questions);
  console.log('📊 题目统计:');
  console.log(`   总题数: ${stats.total}`);
  console.log(`   有效: ${stats.valid}`);
  console.log(`   无效: ${stats.invalid}`);
  console.log(`   分类数: ${Object.keys(stats.byCategory).length}`);
  console.log(`   语法点数: ${Object.keys(stats.byGrammarPoint).length}`);
  console.log(`   难度分布:`, stats.byDifficulty);
  console.log(`   题型分布:`, stats.byType);
  console.log('');
  
  if (stats.valid === 0) {
    console.error('❌ 没有有效的题目可以上传');
    return { success: false, message: '没有有效的题目' };
  }
  
  // 优先使用云函数方式
  if (wx && wx.cloud && wx.cloud.callFunction) {
    return await uploadViaCloudFunction(questions);
  } else if (wx && wx.cloud && wx.cloud.database) {
    return await uploadDirectly(questions);
  } else {
    console.error('❌ 未检测到云开发环境');
    console.log('💡 请在微信开发者工具中运行此脚本');
    return { success: false, message: '未检测到云开发环境' };
  }
}

// 导出函数供使用
if (typeof wx !== 'undefined') {
  // 小程序环境
  wx.uploadAIVariants = uploadAIVariants;
  wx.uploadViaCloudFunction = uploadViaCloudFunction;
  wx.uploadDirectly = uploadDirectly;
  wx.validateQuestion = validateQuestion;
  wx.analyzeQuestions = analyzeQuestions;
  
  console.log('✅ 脚本已加载，可以使用以下函数:');
  console.log('   uploadAIVariants(questions) - 自动选择最佳方式导入');
  console.log('   uploadViaCloudFunction(questions) - 使用云函数导入（推荐）');
  console.log('   uploadDirectly(questions) - 直接导入数据库');
  console.log('   validateQuestion(question, index) - 验证单个题目');
  console.log('   analyzeQuestions(questions) - 分析题目统计信息\n');
  console.log('📝 使用示例:');
  console.log('   const questions = [/* AI生成的JSON数组 */];');
  console.log('   await uploadAIVariants(questions);\n');
} else {
  // Node.js环境
  module.exports = {
    uploadAIVariants,
    uploadViaCloudFunction,
    uploadDirectly,
    validateQuestion,
    formatQuestion,
    analyzeQuestions
  };
  
  console.log('✅ 脚本已导出为Node.js模块');
}

