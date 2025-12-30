// 检查作业数据结构
console.log('=== 检查作业数据结构 ===');

const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];

if (homeworks.length > 0) {
  const latestHomework = homeworks[0];
  console.log('\n📋 最新作业完整数据:');
  console.log(JSON.stringify(latestHomework, null, 2));
  
  console.log('\n🔍 关键字段分析:');
  console.log('- 作业ID:', latestHomework._id);
  console.log('- 作业标题:', latestHomework.title);
  console.log('- 作业类型:', latestHomework.type);
  
  if (latestHomework.selectedItems) {
    console.log('\n✅ selectedItems (语法点配置):');
    latestHomework.selectedItems.forEach((item, index) => {
      console.log(`\n  第${index + 1}项:`);
      console.log('  - 名称:', item.name);
      console.log('  - 题目数量:', item.questionCount);
      console.log('  - 完整数据:', JSON.stringify(item, null, 4));
    });
  }
  
  if (latestHomework.selectedGrammarPoints) {
    console.log('\n✅ selectedGrammarPoints:');
    console.log(latestHomework.selectedGrammarPoints);
  }
  
  if (latestHomework.questions) {
    console.log('\n✅ questions (实际题目数据):');
    console.log('  题目总数:', latestHomework.questions.length);
    if (latestHomework.questions.length > 0) {
      console.log('  第一题示例:', JSON.stringify(latestHomework.questions[0], null, 4));
    }
  } else {
    console.log('\n⚠️ 作业中没有 questions 字段');
  }
  
  console.log('\n📊 作业数据的所有字段:');
  console.log(Object.keys(latestHomework));
  
} else {
  console.log('⚠️ 没有找到作业数据');
}

console.log('\n=== 检查完成 ===');
