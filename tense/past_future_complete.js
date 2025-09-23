// 过去将来时笔记内容
const tenseNote = {
  id: "tense_note_004",
  frontendName: "时态(过去将来时)",
  content: `一、基本概念与标志词
过去将来时表示 "从过去的某一时间来看，将要发生的动作或存在的状态"，即 "过去的将来"。它以 "过去的某个时间" 为参照点，描述之后要发生的事。

常见标志词 / 场景：
• 主句为过去时的宾语从句中：当主句动词是过去时(如 said、thought、hoped 等)，从句描述 "过去看来将要发生的事"。
  例：He said he would come.(他说他会来 ——"说" 是过去时，"来" 是过去看来的将来)
• 时间 / 条件状语从句中：与过去时配合，描述 "过去计划中未来的动作"。
  例：She told me she would go if it stopped raining.(她告诉我如果雨停了她就去)
• 其他标志词：would(会)、was/were going to(打算)、soon(很快，相对于过去而言)、the next day(第二天，相对于过去某一天而言)等。

二、基本结构及变化规则
过去将来时主要有两种结构，动词用原形：

主语 + would + 动词原形
would 无单复数变化，适用于所有主语；否定形式为 would not(=wouldn't)。
例：
He said he would write a letter.(他说他会写一封信。)
They wouldn't try this method.(他们不会尝试这个方法。)

主语 + was/were going to + 动词原形
was/were 随主语变化(单数主语用 was，复数主语用 were)，体现 "过去的计划或打算"。
例：
She was going to leave the next day.(她打算第二天离开。)
They were going to start the project soon.(他们打算很快启动项目。)

三、常见易错点及示例
混淆 "过去将来时" 与 "一般将来时"
错误：He says he would come.(主句是现在时 says，不能用过去将来时 would)
正确：He says he will come.(主句现在时，用一般将来时 will)
正确：He said he would come.(主句过去时 said，用过去将来时 would)

was/were going to 与 would 的混用
差异：was/were going to 强调 "过去的计划"，would 更侧重 "过去的预测或意愿"。
例：She was going to buy a book(她原计划买一本书，强调计划)；She thought she would buy a book(她觉得自己会买一本书，强调预测)。

四、考察示例
用所给动词的适当形式填空：
(1)He hoped he ______ (finish) the work the next week.(答案：would finish /was going to finish，主句 hoped 是过去时，the next week 表过去将来)
(2)They said they ______ (not go) to the party.(答案：wouldn't go /weren't going to go，否定形式)
(3)She ______ (visit) her grandma soon, according to her plan.(答案：was going to visit，强调过去的计划，主语单数用 was)

改错：
I thought I will pass the exam.(错误：will → 改正：would，主句 thought 是过去时，用过去将来时)
They was going to start tomorrow.(错误：was → 改正：were，主语复数用 were)`,
  category: "谓语",
  subCategory: "谓语(4)",
  status: "已创建"
};

// 过去将来时表格内容(带完整分割线)
const tenseTable = {
  id: "tense_table_004",
  frontendName: "时态(过去将来时)",
  content: `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
<thead>
<tr>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">例句</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">标志词</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">书写提示</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">填写正确的过去将来时形态</th>
</tr>
</thead>
<tbody>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He said they ______ (stop) here the next day.</td>
<td style="border: 1px solid #ddd; padding: 8px;">过去动作 said(说)+the next day(第二天)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语复数 they→would + 原形 /were going to + 原形，stop 为原形(无需变分词)</td>
<td style="border: 1px solid #ddd; padding: 8px;">would stop / were going to stop</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She thought I ______ (live) there soon.</td>
<td style="border: 1px solid #ddd; padding: 8px;">过去动作 thought(认为)+soon(很快)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语 I→would + 原形 /was going to + 原形，live 为原形(无需变分词)</td>
<td style="border: 1px solid #ddd; padding: 8px;">would live / was going to live</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They told us she ______ (die) soon after that.</td>
<td style="border: 1px solid #ddd; padding: 8px;">过去动作 told(告诉)+soon after that(在那之后很快)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 she→would + 原形 /was going to + 原形，die 为原形(ie 无需变 y，因用原形)</td>
<td style="border: 1px solid #ddd; padding: 8px;">would die / was going to die</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">The boy said he ______ (plan) a trip the next week.</td>
<td style="border: 1px solid #ddd; padding: 8px;">过去动作 said(说)+the next week(第二周)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 the boy→would + 原形 /was going to + 原形，plan 为原形(无需双写，因用原形)</td>
<td style="border: 1px solid #ddd; padding: 8px;">would plan / was going to plan</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We heard she ______ (write) a letter that night.</td>
<td style="border: 1px solid #ddd; padding: 8px;">过去动作 heard(听见)+that night(那晚)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 she→would + 原形 /was going to + 原形，write 为原形(无需去 e，因用原形)</td>
<td style="border: 1px solid #ddd; padding: 8px;">would write / was going to write</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He hoped they ______ (try) their best soon.</td>
<td style="border: 1px solid #ddd; padding: 8px;">过去动作 hoped(希望)+soon(很快)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语复数 they→would + 原形 /were going to + 原形，try 为原形(无需变 y，因用原形)</td>
<td style="border: 1px solid #ddd; padding: 8px;">would try / were going to try</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She thought I ______ (tie) the box the next morning.</td>
<td style="border: 1px solid #ddd; padding: 8px;">过去动作 thought(认为)+the next morning(第二天早上)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语 I→would + 原形 /was going to + 原形，tie 为原形(ie 无需变 y，因用原形)</td>
<td style="border: 1px solid #ddd; padding: 8px;">would tie / was going to tie</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They said the girl ______ (lie) there soon.</td>
<td style="border: 1px solid #ddd; padding: 8px;">过去动作 said(说)+soon(很快)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 the girl→would + 原形 /was going to + 原形，lie 为原形(ie 无需变 y，因用原形)</td>
<td style="border: 1px solid #ddd; padding: 8px;">would lie / was going to lie</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He told us he ______ (go) abroad the next month.</td>
<td style="border: 1px solid #ddd; padding: 8px;">过去动作 told(告诉)+the next month(下个月)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 he→would + 原形 /was going to + 原形，go 为原形(不规则动词用原形)</td>
<td style="border: 1px solid #ddd; padding: 8px;">would go / was going to go</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We knew they ______ (finish) the work soon after.</td>
<td style="border: 1px solid #ddd; padding: 8px;">过去动作 knew(知道)+soon after(在那之后很快)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语复数 they→would + 原形 /were going to + 原形，finish 为原形(无需变分词)</td>
<td style="border: 1px solid #ddd; padding: 8px;">would finish / were going to finish</td>
</tr>
</tbody>
</table>`,
  category: "谓语",
  subCategory: "谓语(4)",
  status: "已创建"
};

// 生成完整的结构对象
const tenseStructure = {
  "tense_table_004": tenseTable,
  "tense_note_004": tenseNote,
  "谓语(4)": {
    category: "谓语",
    subCategory: "谓语(4)",
    description: "时态(过去将来时)",
    relatedNotes: ["tense_note_004"],
    relatedTables: ["tense_table_004"],
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