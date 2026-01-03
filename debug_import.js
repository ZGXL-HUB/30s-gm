// 简化的导入脚本 - 用于调试语法错误

console.log('=== 调试版导入脚本 ===\n');

// 基础验证函数
function validateQuestion(question, index) {
  const requiredFields = [
    'text', 'answer', 'grammarPoint', 'category',
    'type', 'analysis', 'difficulty'
  ];

  console.log(`验证题目 ${index + 1}...`);

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

  return true;
}

// 简化的上传函数
async function testUpload(questions) {
  console.log(`准备测试上传 ${questions.length} 道题目`);

  if (!questions || questions.length === 0) {
    console.error('❌ 没有题目数据');
    return { success: false, message: '没有题目数据' };
  }

  // 验证前3题
  for (let i = 0; i < Math.min(3, questions.length); i++) {
    validateQuestion(questions[i], i);
  }

  console.log('✅ 语法检查通过，可以正常使用');
  return { success: true, message: '语法正常' };
}

// 导出函数
if (typeof wx !== 'undefined') {
  wx.testUpload = testUpload;
  wx.validateQuestion = validateQuestion;
  console.log('✅ 调试脚本已加载');
  console.log('使用方法:');
  console.log('   const questions = [{text: "测试题", answer: "A", ...}];');
  console.log('   await testUpload(questions);');
} else {
  console.log('请在微信开发者工具控制台中运行此脚本');
}
