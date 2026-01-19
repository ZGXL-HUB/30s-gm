/**
 * 测试初中模块习题预览界面选择题option字段显示
 * 
 * 测试场景：
 * 1. type为'choice'且有options字段的题目
 * 2. type为'选择题'且有options字段的题目
 * 3. type不是'choice'但有options字段的题目（这是需要修复的情况）
 * 4. type为'choice'但options字段为空的情况
 * 5. type为'choice'但options字段不存在的情况
 */

// 模拟formatQuestionText函数（从teacher-generate-material/index.js复制）
function formatQuestionText(question) {
  if (!question) return '';
  
  const questionType = (question.type || '').toLowerCase();
  let questionText = question.text || '';
  
  // 判断是否选择题：与splitPointQuestionsByType中的判断逻辑保持一致
  // 选择题的判断条件：type为'choice'或'选择题'，或者有options字段
  const isChoice = questionType === 'choice' || questionType === '选择题' || 
                  (question.options && Array.isArray(question.options) && question.options.length > 0);
  
  // 如果是选择题，需要检查文本中是否已包含选项
  if (isChoice) {
    // 检查文本中是否已经包含选项（格式如 "A. xxx B. xxx" 或 "A. xxx  B. xxx"）
    const hasOptionsInText = /[A-D]\.\s+[A-Z]/.test(questionText) || 
                              /[A-D]\.\s{2,}[A-Z]/.test(questionText) ||
                              /选项\s*[A-D]/.test(questionText);
    
    // 如果没有选项，尝试从options字段添加
    if (!hasOptionsInText) {
      if (question.options && Array.isArray(question.options) && question.options.length > 0) {
        // 选项可能是字符串数组或对象数组
        const optionsText = question.options.map((opt, index) => {
          const label = String.fromCharCode(65 + index); // A, B, C, D
          // 处理选项格式：可能是字符串或对象
          let optionText = typeof opt === 'string' ? opt : (opt.text || opt.label || opt);
          
          // 检查选项是否已经包含标签（如 "A. xxx"），如果包含就不重复添加
          const labelPattern = new RegExp(`^${label}\\.\\s*`, 'i');
          if (!labelPattern.test(optionText)) {
            // 选项不包含标签，添加标签
            optionText = `${label}. ${optionText}`;
          }
          // 如果已经包含标签，直接使用
          
          return optionText;
        }).join('\n');
        questionText = `${questionText}\n${optionsText}`;
      } else {
        // 无法提取选项，保持原样但给出警告
        console.log('⚠️ 选择题缺少选项字段且无法从text中提取:', question);
      }
    }
  }
  
  // 填空题或其他类型，直接返回文本（不添加选项）
  return questionText;
}

// 测试用例
console.log('=== 测试初中模块习题预览界面选择题option字段显示 ===\n');

// 测试用例1: type为'choice'且有options字段（字符串数组）
console.log('测试用例1: type为\'choice\'且有options字段（字符串数组）');
const test1 = {
  type: 'choice',
  text: 'What is the capital of France?',
  options: ['Paris', 'London', 'Berlin', 'Madrid'],
  answer: 'A'
};
const result1 = formatQuestionText(test1);
console.log('输入:', JSON.stringify(test1, null, 2));
console.log('输出:', result1);
console.log('预期: 题目文本 + 选项（A. Paris\nB. London\nC. Berlin\nD. Madrid）');
console.log('结果:', result1.includes('A. Paris') && result1.includes('B. London') ? '✅ 通过' : '❌ 失败');
console.log('');

// 测试用例2: type为'选择题'且有options字段（对象数组）
console.log('测试用例2: type为\'选择题\'且有options字段（对象数组）');
const test2 = {
  type: '选择题',
  text: 'Which is correct?',
  options: [
    { text: 'I am a student', label: 'A' },
    { text: 'I is a student', label: 'B' },
    { text: 'I are a student', label: 'C' },
    { text: 'I be a student', label: 'D' }
  ],
  answer: 'A'
};
const result2 = formatQuestionText(test2);
console.log('输入:', JSON.stringify(test2, null, 2));
console.log('输出:', result2);
console.log('预期: 题目文本 + 选项');
console.log('结果:', result2.includes('I am a student') ? '✅ 通过' : '❌ 失败');
console.log('');

// 测试用例3: type不是'choice'但有options字段（这是需要修复的情况）
console.log('测试用例3: type不是\'choice\'但有options字段（关键测试）');
const test3 = {
  type: 'multiple_choice', // 不是'choice'，但有options字段
  text: 'Choose the correct answer.',
  options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  answer: 'A'
};
const result3 = formatQuestionText(test3);
console.log('输入:', JSON.stringify(test3, null, 2));
console.log('输出:', result3);
console.log('预期: 题目文本 + 选项（因为options字段存在，应该被识别为选择题）');
console.log('结果:', result3.includes('A. Option 1') && result3.includes('B. Option 2') ? '✅ 通过' : '❌ 失败');
console.log('');

// 测试用例4: type为空但有options字段
console.log('测试用例4: type为空但有options字段');
const test4 = {
  type: '',
  text: 'Select the best answer.',
  options: ['Answer A', 'Answer B', 'Answer C'],
  answer: 'A'
};
const result4 = formatQuestionText(test4);
console.log('输入:', JSON.stringify(test4, null, 2));
console.log('输出:', result4);
console.log('预期: 题目文本 + 选项（因为options字段存在）');
console.log('结果:', result4.includes('A. Answer A') ? '✅ 通过' : '❌ 失败');
console.log('');

// 测试用例5: type为'choice'但options字段为空数组
console.log('测试用例5: type为\'choice\'但options字段为空数组');
const test5 = {
  type: 'choice',
  text: 'This is a choice question without options.',
  options: [],
  answer: 'A'
};
const result5 = formatQuestionText(test5);
console.log('输入:', JSON.stringify(test5, null, 2));
console.log('输出:', result5);
console.log('预期: 只显示题目文本（因为options为空）');
console.log('结果:', result5 === test5.text ? '✅ 通过' : '❌ 失败');
console.log('');

// 测试用例6: type为'choice'但options字段不存在
console.log('测试用例6: type为\'choice\'但options字段不存在');
const test6 = {
  type: 'choice',
  text: 'This is a choice question without options field.',
  answer: 'A'
};
const result6 = formatQuestionText(test6);
console.log('输入:', JSON.stringify(test6, null, 2));
console.log('输出:', result6);
console.log('预期: 只显示题目文本（因为options不存在）');
console.log('结果:', result6 === test6.text ? '✅ 通过' : '❌ 失败');
console.log('');

// 测试用例7: 填空题（不应该显示选项）
console.log('测试用例7: 填空题（不应该显示选项）');
const test7 = {
  type: 'fill_blank',
  text: 'Fill in the blank: I ___ a student.',
  answer: 'am'
};
const result7 = formatQuestionText(test7);
console.log('输入:', JSON.stringify(test7, null, 2));
console.log('输出:', result7);
console.log('预期: 只显示题目文本（填空题不显示选项）');
console.log('结果:', result7 === test7.text ? '✅ 通过' : '❌ 失败');
console.log('');

// 测试用例8: 选项已经包含在text中
console.log('测试用例8: 选项已经包含在text中');
const test8 = {
  type: 'choice',
  text: 'What is 2+2? A. 3 B. 4 C. 5 D. 6',
  options: ['3', '4', '5', '6'],
  answer: 'B'
};
const result8 = formatQuestionText(test8);
console.log('输入:', JSON.stringify(test8, null, 2));
console.log('输出:', result8);
console.log('预期: 保持原样（因为text中已包含选项）');
console.log('结果:', result8 === test8.text ? '✅ 通过' : '❌ 失败');
console.log('');

console.log('=== 测试完成 ===');
