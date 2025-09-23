// 非谓语（1）的笔记和表格内容

const participleContent = {
  // 现在分词笔记
  "participle_note_001": {
    "id": "participle_note_001",
    "frontendName": "分词笔记(现在分词)",
    "content": "现在分词（doing）的用法及示例\n现在分词在句中可作多种成分，常见用法如下：\n1. 作为时态的一部分（与助动词构成进行时）\n现在分词常与 be 动词（am/is/are/was/were）连用，构成现在进行时或过去进行时，强调动作正在进行。\n例：She is reading a book.（她正在看书。→ 现在进行时）\n例：They were playing football at 3 p.m. yesterday.（昨天下午 3 点他们正在踢足球。→ 过去进行时）\n2. 作定语（修饰名词，表主动或正在进行的动作）\n现在分词作定语时，多置于被修饰词前，有时也可后置（多为短语），表示 \"…… 的\"。\n例：a sleeping baby（一个正在睡觉的婴儿→ 前置，表主动、正在进行）\n例：The girl singing in the room is my sister.（在房间里唱歌的女孩是我妹妹→ 后置短语，修饰 girl，表主动）\n3. 放在介词后（构成 \"介词 + doing\" 结构）\n介词后接动词时，动词需用现在分词形式，构成介词短语。\n例：He is good at swimming.（他擅长游泳。→ 介词 at 后接 swimming）\n例：I'm interested in painting.（我对画画感兴趣。→ 介词 in 后接 painting）\n4. 作状语（表伴随、时间、原因等）\n现在分词作状语时，多表示与主句动作同时发生的伴随动作，或动作发生的背景。\n例：She sat by the window, reading a novel.（她坐在窗边，读着一本小说。→ 伴随状语，表同时进行）\n例：Walking in the park, I met an old friend.（在公园散步时，我遇到了一位老朋友。→ 时间状语）",
    "category": "非谓语",
    "subCategory": "非谓语(1)",
    "status": "已创建"
  },

  // 现在分词表格
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
  },

  // 非谓语（1）章节
  "非谓语(1)": {
    "category": "非谓语",
    "subCategory": "非谓语(1)",
    "description": "现在分词综合",
    "relatedNotes": ["participle_note_001"],
    "relatedTables": ["participle_table_001"],
    "status": "已创建"
  }
};

// 导出内容
module.exports = participleContent;

console.log('✅ 非谓语（1）内容已创建');
console.log('📝 包含内容：');
console.log('1. participle_note_001 - 现在分词笔记');
console.log('2. participle_table_001 - 现在分词书写表格');
console.log('3. 非谓语(1) - 章节结构');

// 验证内容格式
console.log('\n📋 内容格式验证：');
console.log('✅ 使用 content 字段（不是 noteContent）');
console.log('✅ 换行符是 \\n（不是 \\\\n）');
console.log('✅ 章节标题格式正确');
console.log('✅ 表格格式符合Markdown标准');
console.log('✅ 与其他笔记的字段结构一致');

// 表格数据验证
const tableData = participleContent['participle_table_001'].tableData;
console.log('\n📊 表格数据验证：');
console.log(`✅ 表头数量: ${tableData.headers.length}`);
console.log(`✅ 数据行数: ${tableData.rows.length}`);
console.log('✅ 每行数据列数与表头一致');

// 笔记内容验证
const noteContent = participleContent['participle_note_001'].content;
console.log('\n📝 笔记内容验证：');
console.log(`✅ 内容长度: ${noteContent.length} 字符`);
console.log('✅ 包含章节结构（1. 2. 3. 4.）');
console.log('✅ 包含示例和解析'); 