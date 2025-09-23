// 一般过去时笔记内容
const tenseNote = {
  id: "tense_note_002",
  frontendName: "时态(一般过去时)",
  content: `一、基本概念与标志词
一般过去时表示过去某个时间发生的动作或存在的状态，常搭配明确的过去时间标志词。
常见标志词：yesterday(昨天)、last week(上周)、ago(…… 以前)、just now(刚才)、in 2020(在 2020 年)等。

二、动词过去式的变化规则及示例
动词过去式分为规则变化和不规则变化，重点掌握规则变化，不规则变化需单独记忆。

规则变化：
• 一般情况：直接加 - ed
  例：save → saved(节省)、work → worked(工作)、play → played(玩)
• 以不发音的 e 结尾：加 - d
  例：like → liked(喜欢)、live → lived(居住)
• 以重读闭音节结尾且末尾只有一个辅音字母：双写辅音字母加 - ed
  例：plan → planned(计划)、stop → stopped(停止)、drop → dropped(掉落)
• 以 "辅音字母 + y" 结尾：变 y 为 i 加 - ed(元音字母 + y 结尾直接加 - ed)
  例：try → tried(尝试)、study → studied(学习)；play → played(玩，元音 + y)

不规则变化(需特殊记忆)：
例：write → wrote(写)、go → went(去)、see → saw(看见)、eat → ate(吃)

三、考察示例
用所给动词的适当形式填空：
(1)She ______ (plan) a trip last month.(答案：planned，重读闭音节结尾双写 n 加 - ed)
(2)They ______ (try) their best yesterday.(答案：tried，辅音 + y 结尾变 y 为 i 加 - ed)
(3)He ______ (write) a letter just now.(答案：wrote，不规则变化)

改错：
I study English last night.(错误：study → 改正：studied，last night 是过去时标志，用过去式)
She stoped here 5 minutes ago.(错误：stoped → 改正：stopped，重读闭音节结尾需双写 p)`,
  category: "谓语",
  subCategory: "谓语(2)",
  status: "已创建"
};

// 一般过去时表格内容(带完整分割线)
const tenseTable = {
  id: "tense_table_002",
  frontendName: "时态(一般过去时)",
  content: `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
<thead>
<tr>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">例句</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">标志词</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">书写提示</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">填写正确的过去时形态</th>
</tr>
</thead>
<tbody>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (play) football yesterday.</td>
<td style="border: 1px solid #ddd; padding: 8px;">yesterday(昨天)</td>
<td style="border: 1px solid #ddd; padding: 8px;">一般情况加 - ed</td>
<td style="border: 1px solid #ddd; padding: 8px;">played</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We ______ (watch) TV last week.</td>
<td style="border: 1px solid #ddd; padding: 8px;">last week(上周)</td>
<td style="border: 1px solid #ddd; padding: 8px;">一般情况加 - ed</td>
<td style="border: 1px solid #ddd; padding: 8px;">watched</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (like) the book in 2022.</td>
<td style="border: 1px solid #ddd; padding: 8px;">in 2022(在 2022 年)</td>
<td style="border: 1px solid #ddd; padding: 8px;">以不发音 e 结尾加 - d</td>
<td style="border: 1px solid #ddd; padding: 8px;">liked</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He ______ (live) here three years ago.</td>
<td style="border: 1px solid #ddd; padding: 8px;">ago(以前)</td>
<td style="border: 1px solid #ddd; padding: 8px;">以不发音 e 结尾加 - d</td>
<td style="border: 1px solid #ddd; padding: 8px;">lived</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">The boy ______ (stop) to rest just now.</td>
<td style="border: 1px solid #ddd; padding: 8px;">just now(刚才)</td>
<td style="border: 1px solid #ddd; padding: 8px;">重读闭音节结尾双写辅音加 - ed</td>
<td style="border: 1px solid #ddd; padding: 8px;">stopped</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (plan) a party last night.</td>
<td style="border: 1px solid #ddd; padding: 8px;">last night(昨晚)</td>
<td style="border: 1px solid #ddd; padding: 8px;">重读闭音节结尾双写 n 加 - ed</td>
<td style="border: 1px solid #ddd; padding: 8px;">planned</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (try) to cook yesterday morning.</td>
<td style="border: 1px solid #ddd; padding: 8px;">yesterday morning(昨天早上)</td>
<td style="border: 1px solid #ddd; padding: 8px;">辅音 + y 结尾变 y 为 i 加 - ed</td>
<td style="border: 1px solid #ddd; padding: 8px;">tried</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We ______ (study) hard last term.</td>
<td style="border: 1px solid #ddd; padding: 8px;">last term(上学期)</td>
<td style="border: 1px solid #ddd; padding: 8px;">辅音 + y 结尾变 y 为 i 加 - ed</td>
<td style="border: 1px solid #ddd; padding: 8px;">studied</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He ______ (go) to Beijing last month.</td>
<td style="border: 1px solid #ddd; padding: 8px;">last month(上个月)</td>
<td style="border: 1px solid #ddd; padding: 8px;">不规则变化(go→went)</td>
<td style="border: 1px solid #ddd; padding: 8px;">went</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (write) a story last week.</td>
<td style="border: 1px solid #ddd; padding: 8px;">last week(上周)</td>
<td style="border: 1px solid #ddd; padding: 8px;">不规则变化(write→wrote)</td>
<td style="border: 1px solid #ddd; padding: 8px;">wrote</td>
</tr>
</tbody>
</table>`,
  category: "谓语",
  subCategory: "谓语(2)",
  status: "已创建"
};

// 生成完整的结构对象
const tenseStructure = {
  "tense_table_002": tenseTable,
  "tense_note_002": tenseNote,
  "谓语(2)": {
    category: "谓语",
    subCategory: "谓语(2)",
    description: "时态(一般过去时)",
    relatedNotes: ["tense_note_002"],
    relatedTables: ["tense_table_002"],
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