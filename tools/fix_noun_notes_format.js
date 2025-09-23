const fs = require('fs');

// 加载前端数据
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 名词笔记格式统一修复脚本 ===\n');

// 修复名词笔记格式的函数
function fixNounNotesFormat(content, noteId) {
  if (!content) return content;
  
  // 根据不同的笔记ID进行不同的格式修复
  switch (noteId) {
    case 'noun_note_003':
      return fixNounNote003(content);
    case 'noun_note_005':
      return fixNounNote005(content);
    default:
      return content;
  }
}

// 修复 noun_note_003 格式
function fixNounNote003(content) {
  // 将内容重新格式化为标准格式
  const fixedContent = `一、基本概念与规则

在英语中，以 o 结尾的名词复数形式，通常会依据其是否具有生命来划分规则，但这一划分并非绝对，存在例外情况。不过，在高中阶段的习题中，遵循 "有生命的加 - es，无生命的加 - s" 这一规则来解题是没有问题的。

二、变化规则及示例

1. 有生命的以 o 结尾的名词
变化规则：加 - es
常见例子：
potato(土豆)→ potatoes
tomato(西红柿)→ tomatoes
hero(英雄)→ heroes
Negro(黑人)→ Negroes
mango(芒果)→ mangoes

2. 无生命的以 o 结尾的名词
变化规则：加 - s
常见例子：
photo(照片)→ photos
radio(收音机)→ radios
video(视频)→ videos
piano(钢琴)→ pianos
kilo(公斤)→ kilos

三、考察示例

选择题：What are those? They are _______.
A. potato  B. potatoes  C. potatos
答案：B，因为 "potato" 是有生命的名词(这里可理解为植物类有生命)，复数加 "-es"。

填空题：There are many _______(radio) in the shop.
答案：radios，"radio" 是无生命名词，复数加 "-s"。

改错题：He has three tomato.
应改为：He has three tomatoes.，"tomato" 是有生命的名词，复数形式错误，需加 "-es"。

四、练习表格

📋 详细规则：

🔹 名词原形
规则：复数形式

🔹 ------
规则：------

🔹 potato
规则：potatoes

🔹 tomato
规则：tomatoes

🔹 hero
规则：heroes

🔹 Negro
规则：Negroes

🔹 mango
规则：mangoes(注：mangos 也被接受，为美式拼写变体)

🔹 photo
规则：photos

🔹 radio
规则：radios

🔹 video
规则：videos

🔹 piano
规则：pianos

🔹 kilo
规则：kilos

解析：
前四个(potato, tomato, hero, Negro)均为有生命类名词(或传统规则中归类为需加 -es 的词)，复数加 -es；
后六个(photo, radio, video, piano, kilo, mango)多为无生命名词，复数加 -s(mango 为特殊情况，两种形式均可)。`;

  return fixedContent;
}

// 修复 noun_note_005 格式
function fixNounNote005(content) {
  // 将内容重新格式化为标准格式
  const fixedContent = `一、基本概念与规则

以 "s, sh, ch, x" 结尾的名词变复数，规则较为统一：直接加 "-es"。

二、常见例子

bus(公共汽车)→ buses
brush(刷子)→ brushes
watch(手表)→ watches
box(盒子)→ boxes
dish(盘子)→ dishes
church(教堂)→ churches

三、考察示例

填空题：There are many ______ (bus) at the station during rush hour.
答案：buses("bus" 以 s 结尾，加 - es)

填空题：She bought three ______ (brush) in the supermarket.
答案：brushes("brush" 以 sh 结尾，加 - es)

填空题：My grandpa has two ______ (watch) collection.
答案：watches("watch" 以 ch 结尾，加 - es)

填空题：The teacher put some ______ (box) in the corner of the classroom.
答案：boxes("box" 以 x 结尾，加 - es)

四、练习表格

📋 详细规则：

🔹 名词原形
规则：复数形式

🔹 ------
规则：------

🔹 bus
规则：buses

🔹 brush
规则：brushes

🔹 watch
规则：watches

🔹 box
规则：boxes

🔹 dish
规则：dishes

🔹 church
规则：churches

解析：这些名词均以 -s、-x、-ch、-sh 结尾，根据规则，其复数形式需加 -es。`;

  return fixedContent;
}

// 处理名词笔记
const nounNoteKeys = ['noun_note_003', 'noun_note_005'];

console.log(`开始修复 ${nounNoteKeys.length} 个名词笔记的格式...\n`);

let fixedCount = 0;

nounNoteKeys.forEach(key => {
  const note = questionsData[key];
  if (note && note.content) {
    const originalContent = note.content;
    const fixedContent = fixNounNotesFormat(originalContent, key);
    
    if (fixedContent !== originalContent) {
      console.log(`✅ 修复 ${key}: ${note.frontendName || key}`);
      fixedCount++;
      
      questionsData[key].content = fixedContent;
    }
  }
});

console.log(`\n修复完成！共修复了 ${fixedCount} 个名词笔记。`);

// 保存修复后的数据
const outputPath = './miniprogram/data/intermediate_questions_fixed.js';
const outputContent = `module.exports = ${JSON.stringify(questionsData, null, 2)};`;

fs.writeFileSync(outputPath, outputContent, 'utf8');
console.log(`\n修复后的数据已保存到: ${outputPath}`);

// 显示修复示例
console.log('\n=== 修复示例 ===');
const sampleNote = questionsData.noun_note_003;
if (sampleNote) {
  console.log('修复后的 noun_note_003 内容预览:');
  const lines = sampleNote.content.split('\n');
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    console.log(`${i + 1}. ${lines[i]}`);
  }
} 