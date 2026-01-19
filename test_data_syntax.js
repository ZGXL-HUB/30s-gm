// 测试数据语法检查脚本
const fs = require('fs');

try {
  console.log('🔍 开始检查数据文件语法...\n');

  // 读取文件内容
  const content = fs.readFileSync('validate_and_upload_questions.js', 'utf8');

  // 提取数组部分（从 const yourQuestionsData = [ 开始到 ]; 结束）
  const arrayMatch = content.match(/const yourQuestionsData = (\[[\s\S]*?\]);/);

  if (!arrayMatch) {
    console.log('❌ 无法找到 yourQuestionsData 数组');
    process.exit(1);
  }

  const arrayString = arrayMatch[1];
  console.log('📄 成功提取数组字符串，长度:', arrayString.length);

  // 尝试解析JSON
  let questions;
  try {
    questions = eval('(' + arrayString + ')');
    console.log('✅ 数组语法正确');
    console.log('📊 数组长度:', questions.length);

    // 检查前几个题目
    console.log('\n🔍 检查前5个题目:');
    for (let i = 0; i < Math.min(5, questions.length); i++) {
      console.log(`题目 ${i + 1}: ${questions[i].text ? '✓' : '✗'} text字段`);
    }

    // 检查是否有格式问题的题目
    console.log('\n🔍 检查题目格式:');
    questions.forEach((q, index) => {
      if (!q.text || !q.answer || !q.type) {
        console.log(`❌ 题目 ${index + 1} 缺少必要字段:`, { text: !!q.text, answer: !!q.answer, type: !!q.type });
      }
    });

  } catch (parseError) {
    console.log('❌ 数组语法错误:', parseError.message);

    // 尝试找到问题位置
    const lines = arrayString.split('\n');
    for (let i = 0; i < lines.length; i++) {
      try {
        JSON.parse(lines.slice(0, i + 1).join('\n') + ']');
      } catch (e) {
        if (i > 0) {
          console.log(`⚠️  可能的问题行 ${i}: ${lines[i].substring(0, 100)}...`);
          break;
        }
      }
    }
  }

} catch (error) {
  console.error('❌ 检查过程中出错:', error);
}



