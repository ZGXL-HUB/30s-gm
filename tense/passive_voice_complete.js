// 被动语态+八大时态笔记内容
const voiceNote = {
  id: "voice_note_001",
  frontendName: "语态(被动+八大时态)",
  content: `被动语态极简学习指南

一、八大时态被动语态对照表
|主动句|被动句|例句|
|will + 动词|will + be + 过去分词|He will save → He will be saved.|
|would + 动词|would + be + 过去分词|He would save → He would be saved.|
|am/is/are + 动词 ing|am/is/are + being + 过去分词|They are saving → He is being saved.|
|was/were + 动词 ing|was/were + being + 过去分词|They were saving → He was being saved.|
|have/has + 动词 ed|have/has + been + 过去分词|She has saved → He has been saved.|
|had + 动词 ed|had + been + 过去分词|She had saved → He had been saved.|
|动词原形(现复)/s(现单)|am/is/are + 过去分词|They save → He is saved.|
|动词 ed(过去时)|was/were + 过去分词|He saved → He was saved.|

二、3 句口诀(秒记转换逻辑)
• 助动词不变，抄下来(will/would/was/had 等，主动句有什么助动词，被动句就保留什么)
• 动词变 "be + 过去分词"(不管主动句动词是原形、ing 形式还是 ed 形式，统一替换成 "be + 过去分词")
• be 的形式看前面(前面是 will/would 就用 be；是 am/is/are/was/were 就用 being；是 have/has/had 就用 been)

三、被动语态常见信号(一眼识别是否用被动)
• 主语是 "物体 / 事件 / 无法主动做动作的对象"：
  例：The window was broken.(窗户自己不会打破，必用被动)
• 出现介词 by/as(by 引出动作发出者，as 引出身份)：
  例：This song is loved by teenagers.(被青少年喜爱)；He was known as a poet.(被称为诗人)
• 翻译含 "被 / 由 / 受 / 从… 中"：
  例：经过三小时的手术，这个孩子被从死神那里救了回来。
  → The child was saved from death after the three-hour operation.(含 "被"，用被动)

四、八大时态被动语态练习(含信号词 + 过去分词变化)
|主动句|时态标志词|被动信号词 / 翻译|主语单复数→be 动词形式 + 过去分词变化提示|被动句答案|
|1. They will help her.(一般将来时)|will(将来时标志)|主语 her(人，语境需被动)|主语 she(单数)→be 用原形；help→helped(+ed)|She will be helped.|
|2. He is stopping the car.(现在进行时)|is+stopping(现在进行时标志)|出现 by him|主语 the car(单数)→be 用 being(因前有 is)；stop→stopped(双写 p+ed)|The car is being stopped by him.|
|3. We have studied the plan.(现在完成时)|have(现在完成时标志)|翻译 "被研究"|主语 the plan(单数)→be 用 been(因前有 have)；study→studied(变 y 为 i+ed)|The plan has been studied.|
|4. Workers build houses.(一般现在时)|build(原形，现复标志)|主语 houses(物体)|主语 houses(复数)→be 用 are；build→built(特殊变化)|Houses are built by workers.|
|5. She teaches English.(一般现在时)|teaches(单三，现单标志)|出现 by her|主语 English(单数)→be 用 is；teach→taught(特殊变化)|English is taught by her.|
|6. They were making cakes.(过去进行时)|were+making(过去进行时标志)|主语 cakes(物体)|主语 cakes(复数)→be 用 being(因前有 were)；make→made(特殊变化)|Cakes were being made by them.|
|7. He had finished the task.(过去完成时)|had(过去完成时标志)|翻译 "被完成"|主语 the task(单数)→be 用 been(因前有 had)；finish→finished(+ed)|The task had been finished.|
|8. People saw the accident.(一般过去时)|saw(过去式，过去时标志)|出现 by people|主语 the accident(单数)→be 用 was；see→seen(特殊变化)|The accident was seen by people.|`,
  category: "谓语",
  subCategory: "谓语(9)",
  status: "已创建"
};

// 被动语态+八大时态表格内容(带完整分割线)
const voiceTable = {
  id: "voice_table_001",
  frontendName: "语态(被动+八大时态)",
  content: `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
<thead>
<tr>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">主动句</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">拆分提示(助动词 + 动词形式)</th>
<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">被动句</th>
</tr>
</thead>
<tbody>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">1. She will help me.</td>
<td style="border: 1px solid #ddd; padding: 8px;">助动词：will；动词：help(原形)</td>
<td style="border: 1px solid #ddd; padding: 8px;">I will be helped.(be+helped)</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">2. They are building it.</td>
<td style="border: 1px solid #ddd; padding: 8px;">助动词：are；动词：building(ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">It is being built.(are+being+built)</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">3. He has finished it.</td>
<td style="border: 1px solid #ddd; padding: 8px;">助动词：has；动词：finished(ed)</td>
<td style="border: 1px solid #ddd; padding: 8px;">It has been finished.(been+finished)</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">4. We save the cat.</td>
<td style="border: 1px solid #ddd; padding: 8px;">助动词(隐含)：现复；动词：save</td>
<td style="border: 1px solid #ddd; padding: 8px;">The cat is saved.(are+saved→简化为 is/are，根据主语单复数)</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">5. She saves the dog.</td>
<td style="border: 1px solid #ddd; padding: 8px;">助动词(隐含)：现单；动词：saves</td>
<td style="border: 1px solid #ddd; padding: 8px;">The dog is saved.(is+saved)</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">6. They saved the bird.</td>
<td style="border: 1px solid #ddd; padding: 8px;">助动词(隐含)：过复；动词：saved</td>
<td style="border: 1px solid #ddd; padding: 8px;">The bird were saved.(were+saved)</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">7. He would take it.</td>
<td style="border: 1px solid #ddd; padding: 8px;">助动词：would；动词：take(原形)</td>
<td style="border: 1px solid #ddd; padding: 8px;">It would be taken.(be+taken)</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 8px;">8. You were cleaning it.</td>
<td style="border: 1px solid #ddd; padding: 8px;">助动词：were；动词：cleaning(ing)</td>
<td style="border: 1px solid #ddd; padding: 8px;">It was being cleaned.(were+being+cleaned)</td>
</tr>
</tbody>
</table>

小提示：
填的时候盯着 "拆分提示" 里的助动词和括号里的提示词(如 be/being/been + 过去分词)，直接套就行～答案最后可以核对：
1. be helped 2. is being built 3. been finished 4. is saved(因主语 the cat 是单数) 5. is saved 6. were saved 7. be taken 8. was being cleaned`,
  category: "谓语",
  subCategory: "谓语(9)",
  status: "已创建"
};

// 生成完整的结构对象
const voiceStructure = {
  "voice_table_001": voiceTable,
  "voice_note_001": voiceNote,
  "谓语(9)": {
    category: "谓语",
    subCategory: "谓语(9)",
    description: "语态(被动+八大时态)",
    relatedNotes: ["voice_note_001"],
    relatedTables: ["voice_table_001"],
    status: "已创建"
  }
};

// 生成可以直接添加到questions.js的代码
function generateStructureJS() {
  return JSON.stringify(voiceStructure, null, 2);
}

console.log('生成的完整结构:');
console.log(generateStructureJS());

module.exports = { voiceNote, voiceTable, voiceStructure, generateStructureJS }; 