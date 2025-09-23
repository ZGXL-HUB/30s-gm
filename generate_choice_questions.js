const fs = require('fs');
const path = require('path');

// 读取原始题库
const originalQuestionsPath = path.join(__dirname, 'miniprogram/data/intermediate_questions.js');
const originalContent = fs.readFileSync(originalQuestionsPath, 'utf8');

// 使用正则表达式提取题目数据
function extractQuestionsFromContent(content) {
  const questions = {};
  
  // 匹配每个分类的题目
  const categoryMatches = content.match(/"([^"]+)":\s*\[([\s\S]*?)\]/g);
  
  if (categoryMatches) {
    categoryMatches.forEach(match => {
      // 提取分类名
      const categoryNameMatch = match.match(/"([^"]+)":\s*\[/);
      if (!categoryNameMatch) return;
      
      const categoryName = categoryNameMatch[1];
      
      // 提取题目数组内容
      const arrayContentMatch = match.match(/\[([\s\S]*)\]/);
      if (!arrayContentMatch) return;
      
      const arrayContent = arrayContentMatch[1];
      
      // 解析题目对象
      const questionObjects = [];
      const questionMatches = arrayContent.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
      
      if (questionMatches) {
        questionMatches.forEach(questionStr => {
          try {
            // 清理字符串，使其成为有效的JSON
            let cleanStr = questionStr
              .replace(/\n/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            // 处理可能的JSON格式问题
            if (cleanStr.includes('"analysis":')) {
              // 提取各个字段
              const textMatch = cleanStr.match(/"text":\s*"([^"]+)"/);
              const answerMatch = cleanStr.match(/"answer":\s*"([^"]+)"/);
              const analysisMatch = cleanStr.match(/"analysis":\s*"([^"]+)"/);
              const categoryMatch = cleanStr.match(/"category":\s*"([^"]+)"/);
              
              if (textMatch && answerMatch) {
                const question = {
                  text: textMatch[1],
                  answer: answerMatch[1],
                  analysis: analysisMatch ? analysisMatch[1] : '',
                  category: categoryMatch ? categoryMatch[1] : categoryName
                };
                questionObjects.push(question);
              }
            }
          } catch (e) {
            // 忽略解析错误的题目
            console.log('跳过解析错误的题目:', questionStr.substring(0, 50) + '...');
          }
        });
      }
      
      if (questionObjects.length > 0) {
        questions[categoryName] = questionObjects;
      }
    });
  }
  
  return questions;
}

// 生成错误选项的函数
function generateWrongOption(correctAnswer, questionText) {
  const wrongOptions = {
    // 介词类错误选项
    'to': ['for', 'with', 'of', 'in', 'at', 'by', 'from', 'about', 'on'],
    'for': ['to', 'with', 'of', 'in', 'at', 'by', 'from', 'about', 'on'],
    'with': ['to', 'for', 'of', 'in', 'at', 'by', 'from', 'about', 'on'],
    'of': ['to', 'for', 'with', 'in', 'at', 'by', 'from', 'about', 'on'],
    'in': ['to', 'for', 'with', 'of', 'at', 'by', 'from', 'about', 'on'],
    'at': ['to', 'for', 'with', 'of', 'in', 'by', 'from', 'about', 'on'],
    'by': ['to', 'for', 'with', 'of', 'in', 'at', 'from', 'about', 'on'],
    'from': ['to', 'for', 'with', 'of', 'in', 'at', 'by', 'about', 'on'],
    'about': ['to', 'for', 'with', 'of', 'in', 'at', 'by', 'from', 'on'],
    'on': ['to', 'for', 'with', 'of', 'in', 'at', 'by', 'from', 'about'],
    
    // 代词类错误选项
    'me': ['I', 'my', 'mine', 'myself'],
    'I': ['me', 'my', 'mine', 'myself'],
    'my': ['me', 'I', 'mine', 'myself'],
    'him': ['he', 'his', 'himself'],
    'he': ['him', 'his', 'himself'],
    'his': ['him', 'he', 'himself'],
    'her': ['she', 'hers', 'herself'],
    'she': ['her', 'hers', 'herself'],
    'hers': ['her', 'she', 'herself'],
    'us': ['we', 'our', 'ours', 'ourselves'],
    'we': ['us', 'our', 'ours', 'ourselves'],
    'our': ['us', 'we', 'ours', 'ourselves'],
    'them': ['they', 'their', 'theirs', 'themselves'],
    'they': ['them', 'their', 'theirs', 'themselves'],
    'their': ['them', 'they', 'theirs', 'themselves'],
    
    // 动名词类错误选项
    'arguing': ['argue', 'argued', 'argues'],
    'painting': ['paint', 'painted', 'paints'],
    'organizing': ['organize', 'organized', 'organizes'],
    'going': ['go', 'went', 'goes'],
    'creating': ['create', 'created', 'creates'],
    'missing': ['miss', 'missed', 'misses'],
    
    // 其他常见错误选项
    'before': ['after', 'during', 'while'],
    'earlier': ['later', 'after', 'before'],
    'as': ['like', 'than', 'for'],
    'due': ['because', 'since', 'as'],
  };
  
  // 如果答案在预定义错误选项中，随机选择一个
  if (wrongOptions[correctAnswer]) {
    const options = wrongOptions[correctAnswer];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // 如果没有预定义选项，生成一些通用错误选项
  const genericWrongOptions = ['not', 'wrong', 'incorrect', 'different', 'other'];
  return genericWrongOptions[Math.floor(Math.random() * genericWrongOptions.length)];
}

// 转换填空题为选择题
function convertToChoiceQuestion(originalQuestion) {
  const correctAnswer = originalQuestion.answer;
  const wrongOption = generateWrongOption(correctAnswer, originalQuestion.text);
  
  // 随机决定选项顺序
  const options = [correctAnswer, wrongOption];
  if (Math.random() > 0.5) {
    options.reverse();
  }
  
  return {
    text: originalQuestion.text,
    options: options,
    correctAnswer: correctAnswer,
    analysis: originalQuestion.analysis,
    category: originalQuestion.category || '综合练习'
  };
}

// 解析题库
console.log('正在解析题库文件...');
const questions = extractQuestionsFromContent(originalContent);

if (Object.keys(questions).length === 0) {
  console.error('❌ 无法解析到任何题目，请检查题库文件格式');
  process.exit(1);
}

// 转换整个题库
const choiceQuestions = {};

for (const category in questions) {
  choiceQuestions[category] = questions[category].map(convertToChoiceQuestion);
}

// 生成新的题库文件内容
const newFileContent = `// 退阶版选择题题库 - 基于 intermediate_questions.js 生成
// 生成时间: ${new Date().toLocaleString()}
// 每个题目包含正确答案和一个错误答案

const choiceQuestions = ${JSON.stringify(choiceQuestions, null, 2)};

module.exports = choiceQuestions;
`;

// 保存到新文件
const outputPath = path.join(__dirname, 'miniprogram/data/choice_questions.js');
fs.writeFileSync(outputPath, newFileContent, 'utf8');

console.log('✅ 退阶版选择题题库生成完成！');
console.log(`📁 文件保存位置: ${outputPath}`);
console.log(`📊 统计信息:`);

let totalQuestions = 0;
for (const category in choiceQuestions) {
  const count = choiceQuestions[category].length;
  totalQuestions += count;
  console.log(`   ${category}: ${count} 题`);
}
console.log(`   总计: ${totalQuestions} 题`);

console.log('\n💡 使用说明:');
console.log('1. 每个题目都有两个选项：正确答案和一个错误答案');
console.log('2. 选项顺序是随机的，避免固定模式');
console.log('3. 保留了原有的解析和分类信息');
console.log('4. 可以直接在小程序中使用这个新题库');
