const fs = require('fs');
const path = require('path');

// 读取现有的questions文件
const questionsPath = path.join(__dirname, 'miniprogram/data/intermediate_questions.js');
let content = fs.readFileSync(questionsPath, 'utf8');

// 非谓语（1）的笔记内容
const participleNote = {
  "participle_note_001": {
    "id": "participle_note_001",
    "frontendName": "分词笔记(现在分词)",
    "content": "现在分词（doing）的用法及示例\n现在分词在句中可作多种成分，常见用法如下：\n1. 作为时态的一部分（与助动词构成进行时）\n现在分词常与 be 动词（am/is/are/was/were）连用，构成现在进行时或过去进行时，强调动作正在进行。\n例：She is reading a book.（她正在看书。→ 现在进行时）\n例：They were playing football at 3 p.m. yesterday.（昨天下午 3 点他们正在踢足球。→ 过去进行时）\n2. 作定语（修饰名词，表主动或正在进行的动作）\n现在分词作定语时，多置于被修饰词前，有时也可后置（多为短语），表示 \"…… 的\"。\n例：a sleeping baby（一个正在睡觉的婴儿→ 前置，表主动、正在进行）\n例：The girl singing in the room is my sister.（在房间里唱歌的女孩是我妹妹→ 后置短语，修饰 girl，表主动）\n3. 放在介词后（构成 \"介词 + doing\" 结构）\n介词后接动词时，动词需用现在分词形式，构成介词短语。\n例：He is good at swimming.（他擅长游泳。→ 介词 at 后接 swimming）\n例：I'm interested in painting.（我对画画感兴趣。→ 介词 in 后接 painting）\n4. 作状语（表伴随、时间、原因等）\n现在分词作状语时，多表示与主句动作同时发生的伴随动作，或动作发生的背景。\n例：She sat by the window, reading a novel.（她坐在窗边，读着一本小说。→ 伴随状语，表同时进行）\n例：Walking in the park, I met an old friend.（在公园散步时，我遇到了一位老朋友。→ 时间状语）",
    "category": "非谓语",
    "subCategory": "非谓语(1)",
    "status": "已创建"
  }
};

// 非谓语（1）的表格内容
const participleTable = {
  "participle_table_001": {
    "id": "participle_table_001",
    "frontendName": "分词书写(现在分词)",
    "content": "现在分词书写练习表格，两列，包含自动判断功能",
    "category": "非谓语",
    "subCategory": "非谓语(1)",
    "status": "已创建",
    "tableData": {
      "headers": ["动词原形", "现在分词（请填写）"],
      "rows": [
        ["work", "working"],
        ["study", "studying"],
        ["play", "playing"],
        ["run", "running"],
        ["swim", "swimming"],
        ["sit", "sitting"],
        ["make", "making"],
        ["have", "having"],
        ["go", "going"],
        ["eat", "eating"]
      ]
    }
  }
};

// 非谓语（1）的章节内容
const participleStructure = {
  "非谓语(1)": {
    "category": "非谓语",
    "subCategory": "非谓语(1)",
    "description": "现在分词综合",
    "relatedNotes": ["participle_note_001"],
    "relatedTables": ["participle_table_001"],
    "status": "已创建"
  }
};

// 找到插入位置（在文件末尾的module.exports之前）
const insertPosition = content.lastIndexOf('});\n\n// 导出数据\nmodule.exports = questions;');

if (insertPosition === -1) {
  console.error('无法找到插入位置');
  process.exit(1);
}

// 构建要插入的内容
const contentToInsert = `,\n\n  ${JSON.stringify('participle_note_001', null, 2)}: ${JSON.stringify(participleNote['participle_note_001'], null, 4)},\n\n  ${JSON.stringify('participle_table_001', null, 2)}: ${JSON.stringify(participleTable['participle_table_001'], null, 4)},\n\n  ${JSON.stringify('非谓语(1)', null, 2)}: ${JSON.stringify(participleStructure['非谓语(1)'], null, 4)}`;

// 插入内容
const newContent = content.slice(0, insertPosition) + contentToInsert + content.slice(insertPosition);

// 写入文件
fs.writeFileSync(questionsPath, newContent, 'utf8');

console.log('✅ 非谓语（1）内容已成功添加到 intermediate_questions.js');
console.log('📝 添加的内容：');
console.log('1. participle_note_001 - 现在分词笔记');
console.log('2. participle_table_001 - 现在分词书写表格');
console.log('3. 非谓语(1) - 章节结构');

// 验证添加的内容
const updatedContent = fs.readFileSync(questionsPath, 'utf8');
if (updatedContent.includes('participle_note_001') && updatedContent.includes('participle_table_001')) {
  console.log('✅ 验证成功：内容已正确添加');
} else {
  console.log('❌ 验证失败：内容可能未正确添加');
} 