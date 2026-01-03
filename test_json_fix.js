/**
 * 简单的JSON转义问题测试脚本
 */

// 测试数据（模拟用户提供的JSON数据）
const testData = [
  {
    "text": "____ beautiful painting! The colors are so bright and full of life.",
    "answer": "C",
    "grammarPoint": "感叹句",
    "category": "特殊句式",
    "type": "choice",
    "analysis": "本题考查感叹句的结构。中心词是名词短语'beautiful painting'，其中painting是可数名词单数，beautiful以辅音音素开头，因此感叹句结构为'What a + adj. + 可数名词单数！'。选项C 'What a' 符合此结构。",
    "difficulty": "medium",
    "province": "云南",
    "year": 2024,
    "source": "变式题"
  },
  {
    "text": "My sister ________ (visit) the zoo with her friends yesterday afternoon.",
    "answer": "visited",
    "grammarPoint": "一般过去时",
    "category": "动词时态",
    "type": "fill_blank",
    "analysis": "本题考查一般过去时的用法。句中有明确表示过去的时间状语'yesterday afternoon'（昨天下午），因此谓语动词需用过去式。",
    "difficulty": "easy",
    "province": "云南",
    "year": 2025,
    "source": "变式题"
  },
  {
    "text": "The girl ________ won the singing competition is my best friend.",
    "answer": "who/that",
    "grammarPoint": "定语从句",
    "category": "复合句",
    "type": "fill_blank",
    "analysis": "本题考查定语从句关系代词的用法。先行词是'The girl'（女孩），指人。定语从句'won the singing competition'中缺少主语。",
    "difficulty": "medium",
    "province": "云南",
    "year": 2025,
    "source": "变式题"
  }
];

console.log('🔍 开始验证JSON数据...\n');

// 验证函数
function validateQuestion(question, index) {
  const issues = [];

  // 检查答案格式
  if (question.type === 'choice') {
    if (!['A', 'B', 'C', 'D'].includes(question.answer)) {
      issues.push(`choice类型答案无效: ${question.answer} (应为A/B/C/D)`);
    }
  } else if (question.type === 'fill_blank') {
    if (!question.answer || typeof question.answer !== 'string' || question.answer.trim() === '') {
      issues.push(`fill_blank类型答案无效: ${question.answer}`);
    }
  }

  // 检查JSON转义问题
  try {
    JSON.stringify(question);
  } catch (error) {
    issues.push(`JSON序列化失败: ${error.message}`);
  }

  // 检查文本中的特殊字符
  if (question.text && question.text.includes('"')) {
    // 检查双引号是否正确转义
    const textInJson = JSON.stringify(question.text);
    if (textInJson.includes('\\"')) {
      // 已经转义，没问题
    } else {
      issues.push('text字段包含未正确处理的双引号');
    }
  }

  return issues;
}

// 运行验证
let totalIssues = 0;
testData.forEach((question, index) => {
  const issues = validateQuestion(question, index);
  if (issues.length > 0) {
    console.log(`❌ 题目 ${index + 1}:`);
    issues.forEach(issue => console.log(`   - ${issue}`));
    totalIssues += issues.length;
  } else {
    console.log(`✅ 题目 ${index + 1}: 验证通过`);
  }
});

console.log(`\n📊 验证完成，共发现 ${totalIssues} 个问题`);

if (totalIssues === 0) {
  console.log('🎉 所有题目验证通过！');
} else {
  console.log('\n🔧 主要问题及解决方案:');
  console.log('1. fill_blank类型题目支持字符串答案（包括多选项如"who/that"）');
  console.log('2. choice类型题目答案必须是A/B/C/D之一');
  console.log('3. 文本中的特殊字符已正确处理');
}
