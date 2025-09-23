// 时态笔记内容
const tenseNote = {
  id: "tense_note_006",
  frontendName: "时态(过去进行时)",
  content: `过去进行时讲解内容(补充标志词)

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
They was tying the box at that moment.(错误：was→改正：were，主语 they 是复数，用 were)`,
  category: "谓语",
  subCategory: "谓语(6)",
  status: "已创建"
};

// 时态表格内容(带完整分割线)
const tenseTable = {
  id: "tense_table_006",
  frontendName: "时态(过去进行时)",
  content: `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
<thead>
<tr>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">例句</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">标志词</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">书写提示</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">填写正确的现在时形态</th>
</tr>
</thead>
<tbody>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (play) football at that moment.</td>
<td style="border: 1px solid #ddd; padding: 8px;">at that moment(在那一刻)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语复数 they→were + 现在分词(直接加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">were playing</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We ______ (watch) TV then.</td>
<td style="border: 1px solid #ddd; padding: 8px;">then(那时)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语复数 we→were + 现在分词(直接加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">were watching</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (write) a letter at 8 pm last night.</td>
<td style="border: 1px solid #ddd; padding: 8px;">at 8 pm last night(在昨晚 8 点)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 she→was + 现在分词(去 e 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">was writing</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He ______ (live) here at that time.</td>
<td style="border: 1px solid #ddd; padding: 8px;">at that time(在那时)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 he→was + 现在分词(去 e 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">was living</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">The boy ______ (stop) here when I rang.</td>
<td style="border: 1px solid #ddd; padding: 8px;">when(当…… 时)+rang(响)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 the boy→was + 现在分词(双写 p 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">was stopping</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (plan) a trip while I read.</td>
<td style="border: 1px solid #ddd; padding: 8px;">while(当…… 时)+read(读)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语复数 they→were + 现在分词(双写 n 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">were planning</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (die) at that moment.</td>
<td style="border: 1px solid #ddd; padding: 8px;">at that moment(在那一刻)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 she→was + 现在分词(ie 变 y 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">was dying</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">The girl ______ (lie) on the bed at 9 pm yesterday.</td>
<td style="border: 1px solid #ddd; padding: 8px;">at 9 pm yesterday(在昨晚 9 点)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 the girl→was + 现在分词(ie 变 y 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">was lying</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He ______ (tie) the box when the phone rang.</td>
<td style="border: 1px solid #ddd; padding: 8px;">when(当…… 时)+rang(响)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 he→was + 现在分词(ie 变 y 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">was tying</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (try) their best then.</td>
<td style="border: 1px solid #ddd; padding: 8px;">then(那时)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语复数 they→were + 现在分词(直接加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">were trying</td>
</tr>
</tbody>
</table>`,
  category: "谓语",
  subCategory: "谓语(6)",
  status: "已创建"
};

// 生成完整的结构对象
const tenseStructure = {
  "tense_table_006": tenseTable,
  "tense_note_006": tenseNote,
  "谓语(6)": {
    category: "谓语",
    subCategory: "谓语(6)",
    description: "时态(过去进行时)",
    relatedNotes: ["tense_note_006"],
    relatedTables: ["tense_table_006"],
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