// 处理时态题目的专用脚本
const { formatQuestionText } = require('./format_questions.js');

// 处理习题格式
function processTenseQuestions() {
  const rawQuestions = [
    {
      "text": "While I ______ (cook) dinner last night, the phone suddenly rang.",
      "answer": "was cooking",
      "analysis": "该句需填入过去进行时\"was cooking\"。此处考查过去进行时与一般过去时的搭配使用，具体分析如下：\\n1. 时态判断：句中\"while\"引导时间状语从句，强调\"当一个动作正在进行时，另一个动作突然发生\"。主句\"rang\"为一般过去时，从句需用过去进行时表示持续的背景动作。\\n2. 过去进行时构成：主语\"I\"为第一人称单数，故用\"was + 现在分词\"(cook→cooking)。\\n3. 语境逻辑：\"做饭\"是持续进行的动作，\"电话铃响\"是突发的短暂动作，符合\"过去进行时+一般过去时\"的经典搭配。",
      "category": "谓语(6)"
    },
    // ... 其他题目
  ];

  return rawQuestions.map(q => ({
    text: q.text,
    answer: q.answer,
    analysis: formatQuestionText(q.analysis),
    category: q.category
  }));
}

// 处理表格格式
function processTenseTable() {
  const tableData = [
    {
      example: "They ______ (play) football at that moment.",
      signal: "at that moment(在那一刻)",
      hint: "主语复数 they→were + 现在分词(直接加 - ing)",
      answer: "were playing"
    },
    {
      example: "We ______ (watch) TV then.",
      signal: "then(那时)",
      hint: "主语复数 we→were + 现在分词(直接加 - ing)",
      answer: "were watching"
    },
    {
      example: "She ______ (write) a letter at 8 pm last night.",
      signal: "at 8 pm last night(在昨晚 8 点)",
      hint: "主语单数 she→was + 现在分词(去 e 加 - ing)",
      answer: "was writing"
    },
    {
      example: "He ______ (live) here at that time.",
      signal: "at that time(在那时)",
      hint: "主语单数 he→was + 现在分词(去 e 加 - ing)",
      answer: "was living"
    },
    {
      example: "The boy ______ (stop) here when I rang.",
      signal: "when(当…… 时)+rang(响)",
      hint: "主语单数 the boy→was + 现在分词(双写 p 加 - ing)",
      answer: "was stopping"
    },
    {
      example: "They ______ (plan) a trip while I read.",
      signal: "while(当…… 时)+read(读)",
      hint: "主语复数 they→were + 现在分词(双写 n 加 - ing)",
      answer: "were planning"
    },
    {
      example: "She ______ (die) at that moment.",
      signal: "at that moment(在那一刻)",
      hint: "主语单数 she→was + 现在分词(ie 变 y 加 - ing)",
      answer: "was dying"
    },
    {
      example: "The girl ______ (lie) on the bed at 9 pm yesterday.",
      signal: "at 9 pm yesterday(在昨晚 9 点)",
      hint: "主语单数 the girl→was + 现在分词(ie 变 y 加 - ing)",
      answer: "was lying"
    },
    {
      example: "He ______ (tie) the box when the phone rang.",
      signal: "when(当…… 时)+rang(响)",
      hint: "主语单数 he→was + 现在分词(ie 变 y 加 - ing)",
      answer: "was tying"
    },
    {
      example: "They ______ (try) their best then.",
      signal: "then(那时)",
      hint: "主语复数 they→were + 现在分词(直接加 - ing)",
      answer: "were trying"
    }
  ];

  // 生成带分割线的表格HTML
  let tableHTML = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">\n';
  tableHTML += '<thead>\n<tr>\n';
  tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">例句</th>\n';
  tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">标志词</th>\n';
  tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">书写提示</th>\n';
  tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">填写正确的现在时形态</th>\n';
  tableHTML += '</tr>\n</thead>\n<tbody>\n';

  tableData.forEach(row => {
    tableHTML += '<tr>\n';
    tableHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${row.example}</td>\n`;
    tableHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${row.signal}</td>\n`;
    tableHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${row.hint}</td>\n`;
    tableHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${row.answer}</td>\n`;
    tableHTML += '</tr>\n';
  });

  tableHTML += '</tbody>\n</table>';
  return tableHTML;
}

// 处理笔记格式
function processTenseNote() {
  return `过去进行时讲解内容(补充标志词)

一、基本概念与标志词
过去进行时表示 "过去某个时间点正在进行的动作"，强调动作在过去某一时刻的持续性。
常见标志词：at 8 o'clock yesterday(昨天 8 点)、then(那时)、at that moment(在那一刻)、when(当…… 时，主句为过去时)、while(当…… 时，前后均为延续性动作)等。

二、基本结构及现在分词变化规则
结构：主语 + was/were + 动词现在分词(doing)
人称配合：主语是单数(I/he/she/it/ 单数名词)用 was；主语是复数(you/we/they/ 复数名词)用 were。

现在分词变化规则(与现在进行时一致，含 ie 结尾特殊变化)：
• 一般情况：直接加 - ing
  例：play→playing(玩)、try→trying(尝试)
• 以不发音的 e 结尾：去 e 加 - ing
  例：write→writing(写)、live→living(居住)
• 以重读闭音节结尾且末尾只有一个辅音字母：双写辅音字母加 - ing
  例：stop→stopping(停止)、plan→planning(计划)
• 以 "ie" 结尾：变 ie 为 y 加 - ing
  例：die→dying(死亡)、lie→lying(躺)、tie→tying(系)

三、考察示例
用所给动词的适当形式填空：
(1)She ______ (write) an email at that moment.(答案：was writing，at that moment 是过去时间点，主语单数用 was，去 e 加 - ing)
(2)They ______ (play) football when I called.(答案：were playing，主语复数用 were，直接加 - ing)
(3)The boy ______ (lie) on the bed at 10 pm last night.(答案：was lying，主语单数用 was，ie 变 y 加 - ing)

改错：
He were watching TV then.(错误：were→改正：was，主语 he 是单数，用 was)
They was tying the box at that moment.(错误：was→改正：were，主语 they 是复数，用 were)`;
}

module.exports = {
  processTenseQuestions,
  processTenseTable,
  processTenseNote
}; 