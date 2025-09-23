// 现在完成时笔记内容
const tenseNote = {
  id: "tense_note_007",
  frontendName: "时态(现在完成时)",
  content: `现在完成时讲解内容

一、重要提醒
现在完成时的标志词是判断时态的核心，即使能翻译句子，若忽略标志词也容易出错。务必先通过标志词锁定时态，再结合规则变形。

二、基本概念与标志词
现在完成时表示 "过去发生的动作对现在造成的影响或结果"，或 "从过去持续到现在的动作 / 状态"，强调 "与现在的联系"。

常见标志词(按含义分类)：
• 表示 "已经 / 曾经"：already(已经，肯定句)、yet(已经 / 还，否定句 / 疑问句)、ever(曾经)、never(从不)
• 表示 "动作完成"：just(刚刚)、recently(最近)、lately(近来)
• 表示 "持续到现在"：for + 时间段(for 3 years)、since + 时间点(since 2020 /since he came)
• 其他：so far(到目前为止)、up to now(直到现在)、in the past 5 years(过去 5 年里)

三、基本结构
主语 + have/has + 动词过去分词(done)
have/has 随主语变化：第三人称单数(he/she/it/ 单数名词)用 has；其他主语(I/you/we/they/ 复数名词)用 have。
否定形式：haven't/hasn't + 过去分词；疑问形式：Have/Has + 主语 + 过去分词？

四、常见误区及示例
误区 1：混淆 "现在完成时" 与 "一般过去时"(是否与现在有关)
错误逻辑：认为 "完成的动作就是过去的"，直接用一般过去时。
区分：现在完成时强调 "与现在的联系"(无具体过去时间)；一般过去时仅表示 "过去发生的动作"(有具体过去时间)。
正确：I have finished my homework.(现在完成时，强调 "作业已完成" 对现在的影响，如可以玩了，无具体时间)
正确：I finished my homework yesterday.(一般过去时，仅说明 "昨天完成"，与现在无关，有具体时间 yesterday)

误区 2：have/has 与 had 混淆(时态与主语的匹配)
错误逻辑：不分时态乱用 had，或忽略主语单复数对 have/has 的影响。
区分：现在完成时用 have/has(与现在时三单规则一致)；过去完成时用 had(无单复数变化)。
正确：She has lived here for 10 years.(现在完成时，主语三单用 has)
错误：She had lived here for 10 years.(误用于现在完成时，had 是过去完成时标志)

误区 3：过去分词与过去式混淆(用法与变形)
错误逻辑：认为 "过去式 = 过去分词"，忽略两者用法差异。
区分：
• 过去式：仅用于一般过去时(如 He played yesterday.)。
• 过去分词：用于现在完成时、过去完成时、被动语态(如 He has played for 2 hours. / The ball was played with.)。
• 变形差异：规则动词的过去式和过去分词相同(如 play→played)，但不规则动词需单独记忆(如 go→过去式 went / 过去分词 gone；see→过去式 saw / 过去分词 seen)。
错误：He has went to Beijing.(误将过去式 went 当过去分词，正确：gone)

五、考察示例
用所给动词的适当形式填空：
(1)They ______ (live) here since 2018.(答案：have lived，since + 时间点用现在完成时，主语复数用 have)
(2)She ______ (never see) this film before.(答案：has never seen，never 是标志词，主语三单用 has，see 的过去分词是 seen)
(3)______ you ______ (finish) your work yet?(答案：Have；finished，yet 用于疑问句，主语 you 用 have)

改错：
He has buy a car last week.(错误：buy→bought，过去分词错误；last week 是过去时标志，应改为 He bought a car last week.)
She haven't eaten breakfast yet.(错误：haven't→hasn't，主语三单需用 hasn't)`,
  category: "谓语",
  subCategory: "谓语(7)",
  status: "已创建"
};

// 现在完成时表格内容(带完整分割线)
const tenseTable = {
  id: "tense_table_007",
  frontendName: "时态(现在完成时)",
  content: `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
<thead>
<tr>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">例句</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">标志词</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">书写提示</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">填写正确的现在完成时形态</th>
</tr>
</thead>
<tbody>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (live) here since 2018.</td>
<td style="border: 1px solid #ddd; padding: 8px;">since 2018(自从 2018 年)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语复数 they→have + 过去分词(live 的过去分词为 lived)</td>
<td style="border: 1px solid #ddd; padding: 8px;">have lived</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (live) here for 10 years.</td>
<td style="border: 1px solid #ddd; padding: 8px;">for 10 years(长达 10 年)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 she→has + 过去分词(live 的过去分词为 lived)</td>
<td style="border: 1px solid #ddd; padding: 8px;">has lived</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We ______ (finish) the work already.</td>
<td style="border: 1px solid #ddd; padding: 8px;">already(已经)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语复数 we→have + 过去分词(finish 的过去分词为 finished)</td>
<td style="border: 1px solid #ddd; padding: 8px;">have finished</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He ______ (finish) the work yet?</td>
<td style="border: 1px solid #ddd; padding: 8px;">yet(已经)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 he→Has + 过去分词(finish 的过去分词为 finished)</td>
<td style="border: 1px solid #ddd; padding: 8px;">Has；finished</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">You ______ (never see) such a beautiful place.</td>
<td style="border: 1px solid #ddd; padding: 8px;">never(从不)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语 you→have + 过去分词(see 的过去分词为 seen)</td>
<td style="border: 1px solid #ddd; padding: 8px;">have never seen</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">The girl ______ (ever visit) Beijing?</td>
<td style="border: 1px solid #ddd; padding: 8px;">ever(曾经)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 the girl→Has + 过去分词(visit 的过去分词为 visited)</td>
<td style="border: 1px solid #ddd; padding: 8px;">Has；ever visited</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (just come) back from school.</td>
<td style="border: 1px solid #ddd; padding: 8px;">just(刚刚)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语复数 they→have + 过去分词(come 的过去分词为 come)</td>
<td style="border: 1px solid #ddd; padding: 8px;">have just come</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (recently read) this book.</td>
<td style="border: 1px solid #ddd; padding: 8px;">recently(最近)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 she→has + 过去分词(read 的过去分词为 read)</td>
<td style="border: 1px solid #ddd; padding: 8px;">has recently read</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We ______ (not go) to the cinema lately.</td>
<td style="border: 1px solid #ddd; padding: 8px;">lately(近来)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语复数 we→haven't + 过去分词(go 的过去分词为 gone)</td>
<td style="border: 1px solid #ddd; padding: 8px;">haven't gone</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He ______ (not eat) breakfast yet.</td>
<td style="border: 1px solid #ddd; padding: 8px;">yet(还)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 he→hasn't + 过去分词(eat 的过去分词为 eaten)</td>
<td style="border: 1px solid #ddd; padding: 8px;">hasn't eaten</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">______ you ______ (learn) English for 5 years?</td>
<td style="border: 1px solid #ddd; padding: 8px;">for 5 years(长达 5 年)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语 you→Have + 过去分词(learn 的过去分词为 learned/learnt)</td>
<td style="border: 1px solid #ddd; padding: 8px;">Have；learned/learnt</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">The team ______ (win) three games so far.</td>
<td style="border: 1px solid #ddd; padding: 8px;">so far(到目前为止)</td>
<td style="border: 1px solid #ddd; padding: 8px;">主语单数 the team→has + 过去分词(win 的过去分词为 won)</td>
<td style="border: 1px solid #ddd; padding: 8px;">has won</td>
</tr>
</tbody>
</table>`,
  category: "谓语",
  subCategory: "谓语(7)",
  status: "已创建"
};

// 生成完整的结构对象
const tenseStructure = {
  "tense_table_007": tenseTable,
  "tense_note_007": tenseNote,
  "谓语(7)": {
    category: "谓语",
    subCategory: "谓语(7)",
    description: "时态(现在完成时)",
    relatedNotes: ["tense_note_007"],
    relatedTables: ["tense_table_007"],
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