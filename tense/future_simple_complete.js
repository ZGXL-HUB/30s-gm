// 一般将来时笔记内容
const tenseNote = {
  id: "tense_note_003",
  frontendName: "时态(一般将来时)",
  content: `一般将来时讲解内容

一、基本概念与标志词
一般将来时表示将要发生的动作或存在的状态，常搭配表示将来的时间标志词。
常见标志词：tomorrow(明天)、next week(下周)、soon(很快)、in 3 days(三天后)、will(将)、be going to(打算)等。

二、基本结构及变化规则
一般将来时主要有两种结构，动词均用原形(无需随主语单复数变化)：

主语 + will + 动词原形
适用于所有主语，will 本身无单复数变化，否定形式在 will 后加 not(=won't)。
例：
I will save money.(我将存钱。)
She will plan a trip.(她将计划一次旅行。)
They won't try again.(他们不会再尝试了。)

主语 + be going to + 动词原形
be 动词需随主语变化(am/is/are)，体现 "打算、计划做某事"。
例：
I am going to try hard.(我打算努力试试。)
He is going to write a letter.(他打算写一封信。)
They are going to save time.(他们打算节省时间。)

三、考察示例
用所给动词的适当形式填空：
(1)We ______ (plan) a party next Sunday.(答案：will plan /are going to plan，next Sunday 是将来时标志)
(2)She ______ (write) an email tomorrow morning.(答案：will write /is going to write，tomorrow morning 表将来)
(3)They ______ (not try) this method.(答案：won't try /aren't going to try，否定形式)

改错：
He will goes to school tomorrow.(错误：goes → 改正：go，will 后接动词原形)
I am going to saving money.(错误：saving → 改正：save，be going to 后接动词原形)`,
  category: "谓语",
  subCategory: "谓语(3)",
  status: "已创建"
};

// 一般将来时表格内容(带完整分割线)
const tenseTable = {
  id: "tense_table_003",
  frontendName: "时态(一般将来时)",
  content: `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
<thead>
<tr>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">例句</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">标志词</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">书写提示</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">填写正确的一般将来时形态</th>
</tr>
</thead>
<tbody>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (play) football tomorrow.</td>
<td style="border: 1px solid #ddd; padding: 8px;">tomorrow(明天)</td>
<td style="border: 1px solid #ddd; padding: 8px;">will + 动词原形 /are going to + 原形</td>
<td style="border: 1px solid #ddd; padding: 8px;">will play / are going to play</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We ______ (watch) TV next week.</td>
<td style="border: 1px solid #ddd; padding: 8px;">next week(下周)</td>
<td style="border: 1px solid #ddd; padding: 8px;">will + 动词原形 /are going to + 原形</td>
<td style="border: 1px solid #ddd; padding: 8px;">will watch / are going to watch</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (like) the film in 2025.</td>
<td style="border: 1px solid #ddd; padding: 8px;">in 2025(在 2025 年)</td>
<td style="border: 1px solid #ddd; padding: 8px;">will + 动词原形 /is going to + 原形</td>
<td style="border: 1px solid #ddd; padding: 8px;">will like / is going to like</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He ______ (live) here soon.</td>
<td style="border: 1px solid #ddd; padding: 8px;">soon(很快)</td>
<td style="border: 1px solid #ddd; padding: 8px;">will + 动词原形 /is going to + 原形</td>
<td style="border: 1px solid #ddd; padding: 8px;">will live / is going to live</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">The girl ______ (stop) here in 5 minutes.</td>
<td style="border: 1px solid #ddd; padding: 8px;">in 5 minutes(5分钟后)</td>
<td style="border: 1px solid #ddd; padding: 8px;">will + 动词原形 /is going to + 原形</td>
<td style="border: 1px solid #ddd; padding: 8px;">will stop / is going to stop</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (plan) a trip next month.</td>
<td style="border: 1px solid #ddd; padding: 8px;">next month(下个月)</td>
<td style="border: 1px solid #ddd; padding: 8px;">will + 动词原形 /are going to + 原形</td>
<td style="border: 1px solid #ddd; padding: 8px;">will plan / are going to plan</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (try) her best tomorrow morning.</td>
<td style="border: 1px solid #ddd; padding: 8px;">tomorrow morning(明天早上)</td>
<td style="border: 1px solid #ddd; padding: 8px;">will + 动词原形 /is going to + 原形</td>
<td style="border: 1px solid #ddd; padding: 8px;">will try / is going to try</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We ______ (study) hard next term.</td>
<td style="border: 1px solid #ddd; padding: 8px;">next term(下学期)</td>
<td style="border: 1px solid #ddd; padding: 8px;">will + 动词原形 /are going to + 原形</td>
<td style="border: 1px solid #ddd; padding: 8px;">will study / are going to study</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He ______ (go) to Shanghai next year.</td>
<td style="border: 1px solid #ddd; padding: 8px;">next year(明年)</td>
<td style="border: 1px solid #ddd; padding: 8px;">will + 动词原形 /is going to + 原形(go 为原形)</td>
<td style="border: 1px solid #ddd; padding: 8px;">will go / is going to go</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (write) a poem soon.</td>
<td style="border: 1px solid #ddd; padding: 8px;">soon(很快)</td>
<td style="border: 1px solid #ddd; padding: 8px;">will + 动词原形 /is going to + 原形</td>
<td style="border: 1px solid #ddd; padding: 8px;">will write / is going to write</td>
</tr>
</tbody>
</table>`,
  category: "谓语",
  subCategory: "谓语(3)",
  status: "已创建"
};

// 生成完整的结构对象
const tenseStructure = {
  "tense_table_003": tenseTable,
  "tense_note_003": tenseNote,
  "谓语(3)": {
    category: "谓语",
    subCategory: "谓语(3)",
    description: "时态(一般将来时)",
    relatedNotes: ["tense_note_003"],
    relatedTables: ["tense_table_003"],
    status: "已创建"
  }
};

// 生成可以直接添加到questions.js的代码
function generateStructureJS() {
  return JSON.stringify(tenseStructure, null, 2);
}

console.log('生成的完整结构:');
console.log(generateStructureJS());

module.exports = { tenseNote, tenseTable, tenseStructure, generateStructureJS }; 