// 测试专属组合和错题特训状态显示
console.log('=== 测试专属组合和错题特训状态显示 ===');

// 检查专属组合存储
console.log('1. 检查专属组合存储:');
try {
  const customCombos = wx.getStorageSync('customCombos') || [];
  console.log('   customCombos:', customCombos);
  console.log('   组合数量:', customCombos.length);
  console.log('   是否已设置:', customCombos.length > 0);
} catch (error) {
  console.error('   读取专属组合失败:', error);
}

// 检查错题存储
console.log('\n2. 检查错题存储:');
try {
  const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
  console.log('   wrongQuestions:', wrongQuestions);
  console.log('   错题数量:', wrongQuestions.length);
  console.log('   是否有错题:', wrongQuestions.length > 0);
} catch (error) {
  console.error('   读取错题失败:', error);
}

// 检查错题历史统计
console.log('\n3. 检查错题历史统计:');
try {
  const wrongQuestionHistory = wx.getStorageSync('wrongQuestionHistory') || [];
  console.log('   wrongQuestionHistory:', wrongQuestionHistory);
  console.log('   历史记录数量:', wrongQuestionHistory.length);
  
  if (wrongQuestionHistory.length > 0) {
    const today = new Date().toDateString();
    const todayRecord = wrongQuestionHistory.find(record => record.date === today);
    console.log('   今日记录:', todayRecord);
  }
} catch (error) {
  console.error('   读取错题历史失败:', error);
}

// 检查练习历史
console.log('\n4. 检查练习历史:');
try {
  const practiceHistory = wx.getStorageSync('practiceHistory') || [];
  console.log('   practiceHistory:', practiceHistory);
  console.log('   练习记录数量:', practiceHistory.length);
} catch (error) {
  console.error('   读取练习历史失败:', error);
}

console.log('\n=== 测试完成 ===');
