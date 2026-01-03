// 测试数组长度脚本
try {
  console.log('🔍 开始测试数据数组...');

  // 直接读取文件内容
  const fs = require('fs');
  const content = fs.readFileSync('./validate_and_upload_questions.js', 'utf8');

  // 提取数组定义
  const arrayMatch = content.match(/const yourQuestionsData = (\[[\s\S]*?\]);/);
  if (!arrayMatch) {
    console.log('❌ 找不到数组定义');
    return;
  }

  console.log('✅ 找到数组定义');

  // 尝试解析数组
  try {
    const arrayCode = arrayMatch[1];
    console.log('数组代码长度:', arrayCode.length);

    // 简单计数左大括号
    const leftBraces = (arrayCode.match(/\{/g) || []).length;
    const rightBraces = (arrayCode.match(/\}/g) || []).length;

    console.log('左大括号数量:', leftBraces);
    console.log('右大括号数量:', rightBraces);

    if (leftBraces !== rightBraces) {
      console.log('❌ 大括号不匹配！');
      return;
    }

    // 尝试eval解析
    const questions = eval('(' + arrayCode + ')');
    console.log('✅ 数组解析成功');
    console.log('实际题目数量:', questions.length);

    // 检查每道题目的基本结构
    let validCount = 0;
    let invalidCount = 0;

    questions.forEach((q, index) => {
      if (q && typeof q === 'object' && q.text && q.answer && q.type) {
        validCount++;
      } else {
        invalidCount++;
        if (index < 5) { // 只显示前5个错误
          console.log(`❌ 题目 ${index + 1} 格式错误:`, q);
        }
      }
    });

    console.log(`📊 有效题目: ${validCount}, 无效题目: ${invalidCount}`);

  } catch (parseError) {
    console.log('❌ 数组解析失败:', parseError.message);
    console.log('错误位置附近代码:');
    const lines = arrayMatch[1].split('\n');
    const errorLine = Math.min(parseError.lineNumber || 0, lines.length - 1);
    for (let i = Math.max(0, errorLine - 2); i <= Math.min(lines.length - 1, errorLine + 2); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }

} catch (error) {
  console.error('❌ 测试失败:', error);
}
