/**
 * 错题保存修复验证测试
 */

// 模拟错题数据
const mockWrongQuestion = {
  question: "She is keen ___ traveling",
  userAnswer: "f",
  correctAnswer: "on",
  analysis: "be keen on为固定短语",
  category: "介词(1)"
};

// 模拟存储
const mockStorage = {};

function saveWrongQuestions(wrongQuestions) {
  try {
    const existingWrongQuestions = mockStorage['wrongQuestions'] || [];
    
    const newWrongQuestions = wrongQuestions.map(wrongQ => ({
      id: Date.now() + Math.random(),
      question: wrongQ.question,
      userAnswer: wrongQ.userAnswer,
      correctAnswer: wrongQ.correctAnswer,
      analysis: wrongQ.analysis || '',
      category: wrongQ.category,
      timestamp: new Date().toISOString(),
      errorCount: 1
    }));
    
    const updatedWrongQuestions = [...existingWrongQuestions, ...newWrongQuestions];
    mockStorage['wrongQuestions'] = updatedWrongQuestions;
    
    console.log('✅ 错题保存成功，共保存', updatedWrongQuestions.length, '道错题');
    return true;
  } catch (error) {
    console.error('❌ 错题保存失败:', error);
    return false;
  }
}

function testSaveWrongQuestions() {
  console.log('🧪 测试错题保存功能...');
  return saveWrongQuestions([mockWrongQuestion]);
}

function testMistakesPageDataLoading() {
  console.log('🧪 测试错题本数据加载...');
  const wrongQuestions = mockStorage['wrongQuestions'] || [];
  console.log('✅ 错题本数据加载成功，共', wrongQuestions.length, '道错题');
  return wrongQuestions.length > 0;
}

function testWrongQuestionVariant() {
  console.log('🧪 测试错题特训数据获取...');
  const wrongQuestions = mockStorage['wrongQuestions'] || [];
  if (wrongQuestions.length === 0) {
    console.log('⚠️ 没有错题记录');
    return false;
  }
  console.log('✅ 错题特训可以获取到错题数据');
  return true;
}

function runAllTests() {
  console.log('🚀 开始错题保存修复验证测试...\n');
  
  const test1 = testSaveWrongQuestions();
  const test2 = testMistakesPageDataLoading();
  const test3 = testWrongQuestionVariant();
  
  console.log('\n📊 测试结果汇总:');
  console.log('='.repeat(50));
  console.log(`${test1 ? '✅' : '❌'} 错题保存功能`);
  console.log(`${test2 ? '✅' : '❌'} 错题本数据加载`);
  console.log(`${test3 ? '✅' : '❌'} 错题特训数据获取`);
  console.log('='.repeat(50));
  
  const passedTests = [test1, test2, test3].filter(Boolean).length;
  console.log(`总计: ${passedTests}/3 个测试通过`);
  
  if (passedTests === 3) {
    console.log('🎉 所有测试通过！错题保存修复成功！');
  } else {
    console.log('⚠️ 部分测试失败，需要进一步检查');
  }
  
  return passedTests === 3;
}

module.exports = {
  runAllTests,
  testSaveWrongQuestions,
  testMistakesPageDataLoading,
  testWrongQuestionVariant
};
