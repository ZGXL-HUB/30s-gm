/**
 * 增强版批量导入脚本
 * 支持自动统计、分批上传、去重和初高中区分
 *
 * 使用方法：
 * 1. 在微信开发者工具控制台中运行此脚本
 * 2. 将AI生成的JSON数组赋值给 questions 变量
 * 3. 设置 schoolLevel: 'middle' 或 'high'
 * 4. 调用 enhancedUpload() 函数开始导入
 */

console.log('=== 增强版AI变式题批量导入工具 ===\n');

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

  // 根据题目类型验证答案格式
  if (question.type === 'choice') {
    if (!['A', 'B', 'C', 'D'].includes(question.answer)) {
      console.warn(`⚠️ 题目 ${index + 1} choice类型答案无效: ${question.answer} (应为A/B/C/D)`);
      return false;
    }
  } else if (question.type === 'fill_blank') {
    // fill_blank类型允许字符串答案，包括多选项（如"who/that"）
    if (!question.answer || typeof question.answer !== 'string' || question.answer.trim() === '') {
      console.warn(`⚠️ 题目 ${index + 1} fill_blank类型答案无效: ${question.answer}`);
      return false;
    }
  } else {
    console.warn(`⚠️ 题目 ${index + 1} 未知题目类型: ${question.type}`);
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
function formatQuestion(question, schoolLevel = 'middle') {
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
    schoolLevel: schoolLevel, // 新增：初高中区分字段
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
 * 检查题目是否已存在（去重）
 */
async function checkDuplicate(question) {
  try {
    const db = wx.cloud.database();

    // 通过题干和答案组合来检查重复
    const result = await db.collection('questions')
      .where({
        text: question.text,
        answer: question.answer,
        schoolLevel: question.schoolLevel // 确保在同一学段内检查重复
      })
      .limit(1)
      .get();

    return result.data.length > 0;
  } catch (error) {
    console.warn('检查重复失败:', error.message);
    return false; // 出错时假设不重复，继续上传
  }
}

/**
 * 智能分批上传（自动调整批次大小）
 */
async function smartBatchUpload(questions, schoolLevel = 'middle', options = {}) {
  const {
    batchSize = 20,      // 默认批次大小
    maxRetries = 3,      // 最大重试次数
    skipDuplicates = true // 是否跳过重复题目
  } = options;

  console.log(`📤 智能分批上传 (${schoolLevel === 'middle' ? '初中' : '高中'})...\n`);

  // 验证并格式化题目
  const validQuestions = [];
  questions.forEach((q, index) => {
    if (validateQuestion(q, index)) {
      validQuestions.push(formatQuestion(q, schoolLevel));
    }
  });

  if (validQuestions.length === 0) {
    console.error('❌ 没有有效的题目可以上传');
    return { success: false, message: '没有有效的题目' };
  }

  console.log(`✅ 验证通过: ${validQuestions.length}/${questions.length} 题有效\n`);

  let totalUploaded = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  let batchIndex = 0;

  // 动态批次大小（根据网络状况调整）
  let currentBatchSize = batchSize;

  for (let i = 0; i < validQuestions.length; i += currentBatchSize) {
    const batch = validQuestions.slice(i, Math.min(i + currentBatchSize, validQuestions.length));
    batchIndex++;

    console.log(`📦 上传第 ${batchIndex} 批（${i + 1}-${Math.min(i + currentBatchSize, validQuestions.length)}，大小：${batch.length}）...`);

    // 过滤重复题目
    const uniqueBatch = [];
    if (skipDuplicates) {
      for (const question of batch) {
        const isDuplicate = await checkDuplicate(question);
        if (isDuplicate) {
          console.log(`   ⏭️ 跳过重复题目: ${question.text.substring(0, 30)}...`);
          totalSkipped++;
        } else {
          uniqueBatch.push(question);
        }
      }
    } else {
      uniqueBatch.push(...batch);
    }

    if (uniqueBatch.length === 0) {
      console.log(`   ⚠️ 批次 ${batchIndex} 全为重复题目，跳过`);
      continue;
    }

    // 上传批次
    let success = false;
    for (let retry = 0; retry < maxRetries && !success; retry++) {
      try {
        const result = await wx.cloud.callFunction({
          name: 'uploadQuestions',
          data: {
            action: 'upload',
            questions: uniqueBatch
          }
        });

        if (result.result && result.result.success) {
          const uploaded = result.result.uploaded || uniqueBatch.length;
          totalUploaded += uploaded;
          console.log(`   ✅ 成功上传 ${uploaded}/${uniqueBatch.length} 题`);

          // 上传成功，增加批次大小
          currentBatchSize = Math.min(currentBatchSize + 5, 50);
          success = true;
        } else {
          throw new Error(result.result?.message || '上传失败');
        }

      } catch (error) {
        console.error(`   ❌ 批次 ${batchIndex} 第 ${retry + 1} 次重试失败:`, error.message);

        if (retry === maxRetries - 1) {
          totalFailed += uniqueBatch.length;
          // 多次失败，减小批次大小
          currentBatchSize = Math.max(currentBatchSize - 5, 5);
        }
      }
    }

    // 批次间延迟，避免频率限制
    if (i + currentBatchSize < validQuestions.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  console.log(`\n📊 上传统计:`);
  console.log(`   ✅ 成功: ${totalUploaded} 题`);
  console.log(`   ⏭️ 跳过重复: ${totalSkipped} 题`);
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
    skipped: totalSkipped,
    failed: totalFailed,
    total: validQuestions.length
  };
}

/**
 * 直接数据库上传（快速模式，不检查重复）
 */
async function directUpload(questions, schoolLevel = 'middle', options = {}) {
  const { batchSize = 20 } = options;

  console.log(`📤 直接上传到云数据库 (${schoolLevel === 'middle' ? '初中' : '高中'})...\n`);

  if (!wx || !wx.cloud || !wx.cloud.database) {
    console.error('❌ 未检测到云开发环境');
    return { success: false, message: '未检测到云开发环境' };
  }

  // 验证并格式化题目
  const validQuestions = [];
  questions.forEach((q, index) => {
    if (validateQuestion(q, index)) {
      validQuestions.push(formatQuestion(q, schoolLevel));
    }
  });

  if (validQuestions.length === 0) {
    console.error('❌ 没有有效的题目可以上传');
    return { success: false, message: '没有有效的题目' };
  }

  console.log(`✅ 验证通过: ${validQuestions.length}/${questions.length} 题有效\n`);

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
      await new Promise(resolve => setTimeout(resolve, 300));
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
async function enhancedUpload(questions, options = {}) {
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    console.error('❌ 请提供有效的题目数组');
    return { success: false, message: '无效的题目数据' };
  }

  const {
    schoolLevel = 'middle',    // 'middle' 或 'high'
    useSmartUpload = true,     // 是否使用智能分批上传
    skipDuplicates = true,     // 是否跳过重复题目
    batchSize = 20            // 默认批次大小
  } = options;

  console.log(`📚 准备导入 ${questions.length} 道题目 (${schoolLevel === 'middle' ? '初中' : '高中'})\n`);

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

  // 选择上传方式
  if (useSmartUpload && wx && wx.cloud && wx.cloud.callFunction) {
    return await smartBatchUpload(questions, schoolLevel, { batchSize, skipDuplicates });
  } else if (wx && wx.cloud && wx.cloud.database) {
    return await directUpload(questions, schoolLevel, { batchSize });
  } else {
    console.error('❌ 未检测到云开发环境');
    console.log('💡 请在微信开发者工具中运行此脚本');
    return { success: false, message: '未检测到云开发环境' };
  }
}

// 导出函数供使用
if (typeof wx !== 'undefined') {
  // 小程序环境
  wx.enhancedUpload = enhancedUpload;
  wx.smartBatchUpload = smartBatchUpload;
  wx.directUpload = directUpload;
  wx.validateQuestion = validateQuestion;
  wx.analyzeQuestions = analyzeQuestions;
  wx.checkDuplicate = checkDuplicate;

  console.log('✅ 增强版脚本已加载，可以使用以下函数:');
  console.log('   enhancedUpload(questions, {schoolLevel: "middle|high"}) - 自动选择最佳方式导入');
  console.log('   smartBatchUpload(questions, schoolLevel, options) - 智能分批上传（推荐）');
  console.log('   directUpload(questions, schoolLevel, options) - 直接数据库上传');
  console.log('   validateQuestion(question, index) - 验证单个题目');
  console.log('   analyzeQuestions(questions) - 分析题目统计信息');
  console.log('   checkDuplicate(question) - 检查题目是否重复\n');
  console.log('📝 使用示例:');
  console.log('   // 初中题目');
  console.log('   const middleQuestions = [/* AI生成的JSON数组 */];');
  console.log('   await enhancedUpload(middleQuestions, {schoolLevel: "middle"});');
  console.log('');
  console.log('   // 高中题目');
  console.log('   const highQuestions = [/* AI生成的JSON数组 */];');
  console.log('   await enhancedUpload(highQuestions, {schoolLevel: "high"});\n');
} else {
  // Node.js环境
  module.exports = {
    enhancedUpload,
    smartBatchUpload,
    directUpload,
    validateQuestion,
    formatQuestion,
    analyzeQuestions,
    checkDuplicate
  };

  console.log('✅ 增强版脚本已导出为Node.js模块');
}
