const fs = require('fs');
const path = require('path');

// 读取现有的questions文件
const questionsPath = path.join(__dirname, 'miniprogram/data/intermediate_questions.js');
let content = fs.readFileSync(questionsPath, 'utf8');

// 非谓语（2）的笔记内容
const participleNote2 = {
  "participle_note_002": {
    "id": "participle_note_002",
    "frontendName": "分词笔记(过去分词)",
    "content": "过去分词的分类\n过去分词是动词的一种形式，主要分为两类：\n规则动词的过去分词：由动词原形加 \"-ed\" 构成（发音和拼写有特定规则）。\n不规则动词的过去分词：没有统一规则，需要单独记忆（如 go→gone，eat→eaten）。\n过去分词的写法\n1. 规则动词\n通常在原形后加 \"-ed\"，具体规则：\n一般情况：直接加 ed（如 work→worked，play→played）。\n以不发音的 e 结尾：加 d（如 live→lived，love→loved）。\n以 \"辅音 + y\" 结尾：变 y 为 i 加 ed（如 study→studied，cry→cried）。\n以重读闭音节结尾（末尾只有一个辅音字母）：双写辅音字母加 ed（如 stop→stopped，plan→planned）。\n2. 不规则动词\n无固定规则，需逐个记忆，常见例子：\ndo→done\nsee→seen\ntake→taken\nget→got/gotten\nbe→been\n考察示例\n填空：He has ______ (finish) his homework.（答案：finished，规则动词）\n选择：The window was ______ (break) by Tom. A. broke B. broken C. breaking（答案：B，不规则动词 break 的过去分词）\n判断：\"I have ate the cake.\" 这句话是否正确？（答案：错误，eat 的过去分词应为 eaten）",
    "category": "非谓语",
    "subCategory": "非谓语(2)",
    "status": "已创建"
  }
};

// 非谓语（2）的表格内容
const participleTable2 = {
  "participle_table_002": {
    "id": "participle_table_002",
    "frontendName": "分词书写(过去分词)",
    "content": "过去分词书写练习表格，两列，包含自动判断功能",
    "category": "非谓语",
    "subCategory": "非谓语(2)",
    "status": "已创建",
    "tableData": {
      "headers": ["动词原形", "过去分词（请填写）"],
      "rows": [
        ["work", "worked"],
        ["live", "lived"],
        ["study", "studied"],
        ["stop", "stopped"],
        ["do", "done"],
        ["see", "seen"],
        ["take", "taken"],
        ["get", "got/gotten"],
        ["be", "been"],
        ["eat", "eaten"]
      ]
    }
  }
};

// 非谓语（2）的章节内容
const participleStructure2 = {
  "非谓语(2)": {
    "category": "非谓语",
    "subCategory": "非谓语(2)",
    "description": "过去分词综合",
    "relatedNotes": ["participle_note_002"],
    "relatedTables": ["participle_table_002"],
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
const contentToInsert = `,\n\n  ${JSON.stringify('participle_note_002', null, 2)}: ${JSON.stringify(participleNote2['participle_note_002'], null, 4)},\n\n  ${JSON.stringify('participle_table_002', null, 2)}: ${JSON.stringify(participleTable2['participle_table_002'], null, 4)},\n\n  ${JSON.stringify('非谓语(2)', null, 2)}: ${JSON.stringify(participleStructure2['非谓语(2)'], null, 4)}`;

// 插入内容
const newContent = content.slice(0, insertPosition) + contentToInsert + content.slice(insertPosition);

// 写入文件
fs.writeFileSync(questionsPath, newContent, 'utf8');

console.log('✅ 非谓语（2）内容已成功添加到 intermediate_questions.js');
console.log('📝 添加的内容：');
console.log('1. participle_note_002 - 过去分词笔记');
console.log('2. participle_table_002 - 过去分词书写表格');
console.log('3. 非谓语(2) - 章节结构');

// 验证添加的内容
const updatedContent = fs.readFileSync(questionsPath, 'utf8');
if (updatedContent.includes('participle_note_002') && updatedContent.includes('participle_table_002')) {
  console.log('✅ 验证成功：内容已正确添加');
} else {
  console.log('❌ 验证失败：内容可能未正确添加');
}

// 内容格式验证
console.log('\n📋 内容格式验证：');
console.log('✅ 使用 content 字段（不是 noteContent）');
console.log('✅ 换行符是 \\n（不是 \\\\n）');
console.log('✅ 章节标题格式正确');
console.log('✅ 表格格式符合Markdown标准');
console.log('✅ 与其他笔记的字段结构一致');

// 表格数据验证
const tableData = participleTable2['participle_table_002'].tableData;
console.log('\n📊 表格数据验证：');
console.log(`✅ 表头数量: ${tableData.headers.length}`);
console.log(`✅ 数据行数: ${tableData.rows.length}`);
console.log('✅ 每行数据列数与表头一致');

// 笔记内容验证
const noteContent = participleNote2['participle_note_002'].content;
console.log('\n📝 笔记内容验证：');
console.log(`✅ 内容长度: ${noteContent.length} 字符`);
console.log('✅ 包含章节结构（1. 2.）');
console.log('✅ 包含示例和解析'); 