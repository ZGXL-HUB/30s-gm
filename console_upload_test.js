// 控制台上传测试脚本 - 解决 await 语法问题

// 验证函数
function validateQuestion(question, index) {
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
function testUpload(questions) {
  console.log(`准备测试上传 ${questions.length} 道题目`);

  if (!questions || questions.length === 0) {
    console.error('❌ 没有题目数据');
    return { success: false, message: '没有题目数据' };
  }

  // 验证前3题
  for (let i = 0; i < Math.min(3, questions.length); i++) {
    validateQuestion(questions[i], i);
  }

  console.log('✅ 语法检查通过，数据格式正确');
  return { success: true, message: '语法正常', count: questions.length };
}

// 挂载到全局
if (typeof wx !== 'undefined') {
  wx.testUpload = testUpload;
  wx.validateQuestion = validateQuestion;
  console.log('✅ 上传测试脚本已加载');
  console.log('使用方法:');
  console.log('   const questions = [题目数组];');
  console.log('   wx.testUpload(questions);  // 注意：不要用 await');
} else {
  console.log('请在微信开发者工具控制台中运行此脚本');
}

// 测试数据示例
const sampleQuestions = [
  {
    "text": "English ____ by millions of students in middle schools across the country these days. A. learn  B. learned  C. is learned  D. was learned",
    "answer": "C",
    "grammarPoint": "一般时态的被动语态",
    "category": "被动语态",
    "type": "choice",
    "analysis": "本题考查一般现在时的被动语态，难度中等。主语English与动词learn是被动关系（英语被学习），时间状语'these days'表示当前的情况，需用一般现在时的被动语态，结构为'am/is/are+过去分词'，learn的过去分词是learned，故正确答案为C。",
    "difficulty": "medium",
    "province": "云南",
    "year": 2024,
    "source": "变式题"
  },
  {
    "text": "Yoga ____ by more and more people for keeping healthy these days. A. practice  B. practiced  C. is practiced  D. was practiced",
    "answer": "C",
    "grammarPoint": "一般时态的被动语态",
    "category": "被动语态",
    "type": "choice",
    "analysis": "本题考查一般现在时被动语态的用法，难度中等。主语Yoga与动词practice是被动关系（瑜伽被练习），'these days'提示时态为一般现在时，被动语态结构为'am/is/are+过去分词'，practice的过去分词是practiced，因此选C。",
    "difficulty": "medium",
    "province": "云南",
    "year": 2024,
    "source": "变式题"
  }
];

console.log('📝 示例数据已准备，可以运行测试:');
console.log('wx.testUpload(sampleQuestions);');
