// 题目格式处理脚本
function formatQuestionText(text) {
  return text
    // 移除Markdown加粗语法
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // 替换中文引号为英文引号
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    // 处理可能的其他特殊字符
    .replace(/…/g, '...')
    .replace(/—/g, '-')
    .replace(/–/g, '-')
    // 确保字符串正确转义
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

// 示例使用
const rawQuestion = {
  "text": "He ____ (read) an interesting book last night.",
  "answer": "read",
  "analysis": "该句中需填入动词\"read\"的过去式\"read\"。此处考查**同形异音的不规则动词变化**,具体analysis如下：\n1. **时态判断**：\n   - \"last night\"(昨晚)表示过去的具体时间,明确指向一般过去时。\n2. **特殊的不规则动词变化**：\n   - \"read\"是不规则动词：read/riːd/→read/red/→read/red/\n   - 拼写相同但发音不同：原形读/riːd/,过去式和过去分词读/red/\n   - 这是英语中较为特殊的变化类型\n3. **同形异音的识别**：\n   - 需要通过语境和时间状语判断具体的时态和读音\n   - 写作时拼写相同,但发音和意义不同\n   - 类似词汇较少,需要特别注意\n4. **阅读活动的描述**：\n   - \"read a book\"是常见的学习活动表达\n   - \"interesting\"增加了对书籍的评价\n   - 适合用一般过去时描述完整的阅读经历\n5. **记忆要点**：\"read过去还是read,发音变成/red/音；拼写相同音不同,语境时态要分清。\"",
  "category": "谓语(2)"
};

// 处理后的题目
const formattedQuestion = {
  text: rawQuestion.text,
  answer: rawQuestion.answer,
  analysis: formatQuestionText(rawQuestion.analysis),
  category: rawQuestion.category
};

console.log('处理后的题目:');
console.log(JSON.stringify(formattedQuestion, null, 2));

// 生成可以直接粘贴到questions.js的代码
function generateJSObject(questions) {
  let jsCode = '[\n';
  questions.forEach((q, index) => {
    jsCode += `  {\n`;
    jsCode += `    "text": "${q.text}",\n`;
    jsCode += `    "answer": "${q.answer}",\n`;
    jsCode += `    "analysis": "${formatQuestionText(q.analysis)}",\n`;
    jsCode += `    "category": "${q.category}"\n`;
    jsCode += `  }${index < questions.length - 1 ? ',' : ''}\n`;
  });
  jsCode += ']';
  return jsCode;
}

module.exports = { formatQuestionText, generateJSObject }; 