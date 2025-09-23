// 过去完成时笔记内容
const tenseNote = {
  id: "tense_note_008",
  frontendName: "时态(过去完成时)",
  content: `一、基本概念与标志词
过去完成时表示 "过去某个时间点之前已经完成的动作"(即 "过去的过去")，必须以 "一个过去的动作或时间" 为参照点。

核心标志与场景：
• 时间参照标志：by + 过去时间(by last year 到去年为止)、before + 过去时间(before he came 在他来之前)
• 从句引导词：
  when/after/before + 过去时从句(主句动作发生在从句之前)，例：After he had finished work, he left.(完成工作在离开之前，均为过去)
  by the time + 过去时从句(到… 时为止，主句动作已完成)，例：By the time I arrived, they had gone.
• 上下文暗示：无明显标志词，但通过语境可知 "动作发生在另一个过去动作之前"，例：He said he had seen the film.("看电影" 在 "说" 之前，"说" 是过去时)

二、基本结构与书写规范
主语 + had + 动词过去分词(done)
无论主语是单数还是复数，均用 had(无单复数变化)，这是与现在完成时(have/has)的核心区别。
过去分词变化规则与现在完成时完全一致(规则变化加 - ed，不规则变化需单独记忆，如 go→gone、see→seen)。

三、常见易错点提醒
漏看 "过去的过去" 关系：只看到一个过去动作，忽略 "动作先后顺序"。
错误：When he arrived, she left.(未体现 "离开在到达之前")
正确：When he arrived, she had left.(她离开在他到达之前，用过去完成时)

混淆与一般过去时：两个过去动作无先后，均用一般过去时；有先后(先发生的用过去完成时)。
正确：He bought a book and read it.(买和读无明显先后，均用过去时)
正确：He had bought the book before he read it.(买在 read 之前，买用过去完成时)

四、考察示例
用所给动词的适当形式填空：
(1)By the time we ______ (get) there, the bus ______ (leave).(答案：got；had left，get 是过去时，leave 在 get 之前，用过去完成时)
(2)She said she ______ (never visit) the city.(答案：had never visited，"说" 是过去时，"参观" 在说之前)

改错：
He had dinner after he finished his homework.(错误：had→ate，dinner 与 finish 无先后强调，均用过去时)
When I came, they worked for 2 hours.(错误：worked→had worked，"工作" 在 "来" 之前，用过去完成时)`,
  category: "谓语",
  subCategory: "谓语(8)",
  status: "已创建"
};

// 过去完成时表格内容(带完整分割线)
const tenseTable = {
  id: "tense_table_008",
  frontendName: "时态(过去完成时)",
  content: `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
<thead>
<tr>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">例句</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">标志词</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">书写提示</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">填写正确的过去完成时形态</th>
</tr>
</thead>
<tbody>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (live) here for 5 years by 2020.</td>
<td style="border: 1px solid #ddd; padding: 8px;">by(到…… 为止)+ 过去时间 2020</td>
<td style="border: 1px solid #ddd; padding: 8px;">无论主语单复数均用 had，live 过去分词为规则变化(lived)</td>
<td style="border: 1px solid #ddd; padding: 8px;">had lived</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We ______ (finish) the work before he came.</td>
<td style="border: 1px solid #ddd; padding: 8px;">before(在…… 之前)+ 过去动作 came(来)</td>
<td style="border: 1px solid #ddd; padding: 8px;">无论主语单复数均用 had，finish 过去分词为规则变化(finished)</td>
<td style="border: 1px solid #ddd; padding: 8px;">had finished</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (see) the film twice by last week.</td>
<td style="border: 1px solid #ddd; padding: 8px;">by(到…… 为止)+ 过去时间 last week(上周)</td>
<td style="border: 1px solid #ddd; padding: 8px;">无论主语单复数均用 had，see 过去分词为特殊变化(seen)</td>
<td style="border: 1px solid #ddd; padding: 8px;">had seen</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He ______ (never go) abroad before 2019.</td>
<td style="border: 1px solid #ddd; padding: 8px;">before(在…… 之前)+ 过去时间 2019</td>
<td style="border: 1px solid #ddd; padding: 8px;">无论主语单复数均用 had，go 过去分词为特殊变化(gone)</td>
<td style="border: 1px solid #ddd; padding: 8px;">had never gone</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">When I arrived, they already ______ (leave).</td>
<td style="border: 1px solid #ddd; padding: 8px;">完成时标志词 already(已经)+ 过去动作 arrived(到达)</td>
<td style="border: 1px solid #ddd; padding: 8px;">无论主语单复数均用 had，leave 过去分词为特殊变化(left)</td>
<td style="border: 1px solid #ddd; padding: 8px;">had left</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">It ______ (rain) for 3 days when the storm came.</td>
<td style="border: 1px solid #ddd; padding: 8px;">for(长达)+ 时间段 3 days(三天)</td>
<td style="border: 1px solid #ddd; padding: 8px;">无论主语单复数均用 had，rain 过去分词为规则变化(rained)</td>
<td style="border: 1px solid #ddd; padding: 8px;">had rained</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (plan) the trip before the holiday started.</td>
<td style="border: 1px solid #ddd; padding: 8px;">before(在…… 之前)+ 过去动作 started(开始)</td>
<td style="border: 1px solid #ddd; padding: 8px;">无论主语单复数均用 had，plan 过去分词为规则变化(planned)</td>
<td style="border: 1px solid #ddd; padding: 8px;">had planned</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">The girl ______ (die) for 2 hours when we found her.</td>
<td style="border: 1px solid #ddd; padding: 8px;">for(长达)+ 时间段 2 hours(两小时)</td>
<td style="border: 1px solid #ddd; padding: 8px;">无论主语单复数均用 had，die 过去分词为规则变化(died)</td>
<td style="border: 1px solid #ddd; padding: 8px;">had died</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">By the time he called, I ______ (tie) the box.</td>
<td style="border: 1px solid #ddd; padding: 8px;">By the time(到…… 时为止)+ 过去动作 called(打电话)</td>
<td style="border: 1px solid #ddd; padding: 8px;">无论主语单复数均用 had，tie 过去分词为规则变化(tied)</td>
<td style="border: 1px solid #ddd; padding: 8px;">had tied</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We ______ (study) here for 3 years by 2022.</td>
<td style="border: 1px solid #ddd; padding: 8px;">by(到…… 为止)+ 过去时间 2022</td>
<td style="border: 1px solid #ddd; padding: 8px;">无论主语单复数均用 had，study 过去分词为规则变化(studied)</td>
<td style="border: 1px solid #ddd; padding: 8px;">had studied</td>
</tr>
</tbody>
</table>`,
  category: "谓语",
  subCategory: "谓语(8)",
  status: "已创建"
};

// 生成完整的结构对象
const tenseStructure = {
  "tense_table_008": tenseTable,
  "tense_note_008": tenseNote,
  "谓语(8)": {
    category: "谓语",
    subCategory: "谓语(8)",
    description: "时态(过去完成时)",
    relatedNotes: ["tense_note_008"],
    relatedTables: ["tense_table_008"],
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