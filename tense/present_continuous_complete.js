// 现在进行时笔记内容
const tenseNote = {
  id: "tense_note_005",
  frontendName: "时态(现在进行时)",
  content: `现在进行时讲解内容

一、基本概念与标志词
现在进行时表示 "此时此刻正在进行的动作"，或 "现阶段正在进行的动作(不一定此刻正在做)"。
常见标志词：now(现在)、look(看)、listen(听)、at the moment(此刻)等。

二、基本结构及现在分词变化规则
结构：主语 + be 动词(am/is/are)+ 动词现在分词(doing)
be 动词随主语变化：I→am，he/she/it→is，you/we/they→are。

核心是掌握现在分词(doing)的变化规则：
• 一般情况：直接加 - ing
  例：try→trying(尝试)、work→working(工作)、play→playing(玩)
• 以不发音的 e 结尾：去 e 加 - ing
  例：save→saving(节省)、write→writing(写)、live→living(居住)
• 以重读闭音节结尾且末尾只有一个辅音字母：双写辅音字母加 - ing
  例：plan→planning(计划)、stop→stopping(停止)、run→running(跑)
• 以 "ie" 结尾：变 ie 为 y 加 - ing(高中常考)
  例：die→dying(死亡)、lie→lying(躺；说谎)、tie→tying(系；捆绑)

三、考察示例
用所给动词的适当形式填空：
(1)Look! They ______ (run) on the playground.(答案：are running，重读闭音节结尾双写 n 加 - ing)
(2)The patient ______ (die) now.(答案：is dying，ie 结尾变 y 加 - ing)
(3)She ______ (lie) on the sofa at the moment.(答案：is lying，ie 结尾变 y 加 - ing)

改错：
He is write a letter.(错误：write → 改正：writing，去 e 加 - ing)
They are tieing the box.(错误：tieing → 改正：tying，ie 结尾变 y 加 - ing)`,
  category: "谓语",
  subCategory: "谓语(5)",
  status: "已创建"
};

// 现在进行时表格内容(带完整分割线)
const tenseTable = {
  id: "tense_table_005",
  frontendName: "时态(现在进行时)",
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
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (play) football now.</td>
<td style="border: 1px solid #ddd; padding: 8px;">now(现在)</td>
<td style="border: 1px solid #ddd; padding: 8px;">are + 现在分词(直接加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">are playing</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">We ______ (watch) TV now.</td>
<td style="border: 1px solid #ddd; padding: 8px;">now(现在)</td>
<td style="border: 1px solid #ddd; padding: 8px;">are + 现在分词(直接加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">are watching</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (write) a letter look!</td>
<td style="border: 1px solid #ddd; padding: 8px;">look(看)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is + 现在分词(去 e 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is writing</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He ______ (live) here at the moment.</td>
<td style="border: 1px solid #ddd; padding: 8px;">at the moment(此刻)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is + 现在分词(去 e 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is living</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">The boy ______ (stop) here listen!</td>
<td style="border: 1px solid #ddd; padding: 8px;">listen(听)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is + 现在分词(双写 p 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is stopping</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (plan) a trip now.</td>
<td style="border: 1px solid #ddd; padding: 8px;">now(现在)</td>
<td style="border: 1px solid #ddd; padding: 8px;">are + 现在分词(双写 n 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">are planning</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">She ______ (die) at the moment.</td>
<td style="border: 1px solid #ddd; padding: 8px;">at the moment(此刻)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is + 现在分词(ie 变 y 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is dying</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">The girl ______ (lie) on the bed now.</td>
<td style="border: 1px solid #ddd; padding: 8px;">now(现在)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is + 现在分词(ie 变 y 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is lying</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">He ______ (tie) the box look!</td>
<td style="border: 1px solid #ddd; padding: 8px;">look(看)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is + 现在分词(ie 变 y 加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">is tying</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">They ______ (try) their best listen!</td>
<td style="border: 1px solid #ddd; padding: 8px;">listen(听)</td>
<td style="border: 1px solid #ddd; padding: 8px;">are + 现在分词(直接加 - ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">are trying</td>
</tr>
</tbody>
</table>`,
  category: "谓语",
  subCategory: "谓语(5)",
  status: "已创建"
};

// 生成完整的结构对象
const tenseStructure = {
  "tense_table_005": tenseTable,
  "tense_note_005": tenseNote,
  "谓语(5)": {
    category: "谓语",
    subCategory: "谓语(5)",
    description: "时态(现在进行时)",
    relatedNotes: ["tense_note_005"],
    relatedTables: ["tense_table_005"],
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