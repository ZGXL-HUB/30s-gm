// 快速测试脚本
try {
  console.log('开始测试...');

  // 直接测试数组长度
  const data = require('./validate_and_upload_questions.js');
  console.log('yourQuestionsData长度:', data.yourQuestionsData.length);

  // 检查前几个和最后几个
  const arr = data.yourQuestionsData;
  console.log('前3个题目:');
  for (let i = 0; i < Math.min(3, arr.length); i++) {
    console.log(`  ${i+1}: ${arr[i].text.substring(0, 30)}...`);
  }

  console.log('最后3个题目:');
  for (let i = Math.max(0, arr.length - 3); i < arr.length; i++) {
    console.log(`  ${i+1}: ${arr[i].text.substring(0, 30)}...`);
  }

} catch (error) {
  console.error('测试失败:', error.message);
}
