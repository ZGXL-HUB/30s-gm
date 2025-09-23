// 测试新增的语法测试题
const grammarTestSets = require('./miniprogram/data/grammar_test_sets.js');

console.log('=== 新增语法测试题验证 ===');

// 检查总套数
console.log(`总共 ${grammarTestSets.length} 套测试题`);

// 检查新增的套题
for (let i = 5; i < grammarTestSets.length; i++) {
  const set = grammarTestSets[i];
  console.log(`\n第${set.id}套: ${set.name}`);
  console.log(`题目数量: ${set.questions.length}`);
  
  // 检查每道题目的完整性
  set.questions.forEach((question, qIndex) => {
    const requiredFields = ['text', 'option', 'answer', 'analysis', 'tag'];
    const missingFields = requiredFields.filter(field => !question[field]);
    
    if (missingFields.length > 0) {
      console.error(`  题目${qIndex + 1}缺少字段: ${missingFields.join(', ')}`);
    }
    
    // 检查选项数量
    if (question.option.length !== 3) {
      console.error(`  题目${qIndex + 1}选项数量不正确: ${question.option.length}`);
    }
    
    // 检查答案是否在选项中
    if (!question.option.includes(question.answer)) {
      console.error(`  题目${qIndex + 1}答案不在选项中: ${question.answer}`);
    }
  });
}

console.log('\n=== 验证完成 ===');

// 显示第六套第一题作为示例
const sixthSet = grammarTestSets.find(set => set.id === 6);
if (sixthSet) {
  const firstQuestion = sixthSet.questions[0];
  console.log('\n=== 第六套第一题示例 ===');
  console.log('题目:', firstQuestion.text);
  console.log('选项:', firstQuestion.option);
  console.log('答案:', firstQuestion.answer);
  console.log('解析:', firstQuestion.analysis);
  console.log('标签:', firstQuestion.tag);
}
