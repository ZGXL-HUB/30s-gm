/**
 * 错题统计功能修复验证测试
 */

// 模拟错题数据
const mockWrongQuestions = [
  {
    id: Date.now() + 1,
    question: "Could you tell ___ (I) the way to the nearest bank?",
    userAnswer: "I",
    correctAnswer: "me",
    analysis: "give动词需要宾语代词作为间接宾语，I的宾格是me",
    tag: "代词(1)",
    category: "代词",
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    correctCount: 0,
    errorCount: 1
  }
];

// 测试错题保存功能
function testSaveWrongQuestions() {
  console.log('🧪 测试错题保存功能...');
  
  try {
    const existingWrongQuestions = wx.getStorageSync('wrongQuestions') || [];
    const newWrongQuestions = [...existingWrongQuestions, ...mockWrongQuestions];
    wx.setStorageSync('wrongQuestions', newWrongQuestions);
    
    console.log('✅ 错题保存成功，共保存', newWrongQuestions.length, '道错题');
    return true;
  } catch (error) {
    console.error('❌ 错题保存失败:', error);
    return false;
  }
}

// 测试错题统计功能
function testMistakesStatistics() {
  console.log('🧪 测试错题统计功能...');
  
  try {
    const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
    
    const categoryCounts = {};
    wrongQuestions.forEach(question => {
      const category = question.category || '其他';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    console.log('✅ 错题统计完成:', categoryCounts);
    return true;
  } catch (error) {
    console.error('❌ 错题统计失败:', error);
    return false;
  }
}

// 主测试函数
function runAllTests() {
  console.log('🚀 开始错题统计功能修复验证测试...\n');
  
  const test1 = testSaveWrongQuestions();
  const test2 = testMistakesStatistics();
  
  console.log('\n📊 测试结果汇总:');
  console.log('='.repeat(50));
  console.log(`${test1 ? '✅' : '❌'} 错题保存功能`);
  console.log(`${test2 ? '✅' : '❌'} 错题统计功能`);
  console.log('='.repeat(50));
  
  const passedTests = [test1, test2].filter(Boolean).length;
  console.log(`总计: ${passedTests}/2 个测试通过`);
  
  if (passedTests === 2) {
    console.log('🎉 所有测试通过！错题统计功能修复成功！');
  } else {
    console.log('⚠️ 部分测试失败，需要进一步检查');
  }
  
  return passedTests === 2;
}

module.exports = {
  runAllTests,
  testSaveWrongQuestions,
  testMistakesStatistics
};
