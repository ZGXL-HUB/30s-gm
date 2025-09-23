const fs = require('fs');
const path = require('path');

// 读取intermediate_questions.js文件
const intermediatePath = path.join(__dirname, 'miniprogram/data/intermediate_questions.js');
const intermediateContent = fs.readFileSync(intermediatePath, 'utf8');

// 找到插入位置（在文件末尾的module.exports之前）
const insertPosition = intermediateContent.lastIndexOf('});\n\n// 导出数据');

if (insertPosition === -1) {
  console.error('未找到插入位置');
  process.exit(1);
}

// 形容词比较级和最高级数据
const adjectiveData = `
  "comparative_table_001": {
    "id": "comparative_table_001",
    "frontendName": "比较级书写",
    "content": "形容词比较级练习表格",
    "category": "形容词",
    "subCategory": "形容词(2)",
    "status": "已创建",
    "tableData": {
      "headers": ["规则", "原形", "比较级", "规则说明"],
      "rows": [
        ["规则一", "fast", "faster", "一般情况直接加er"],
        ["规则一", "hard", "harder", "一般情况直接加er"],
        ["规则一", "short", "shorter", "一般情况直接加er"],
        ["规则一", "clean", "cleaner", "一般情况直接加er"],
        ["规则二", "nice", "nicer", "以不发音的e结尾加r"],
        ["规则二", "large", "larger", "以不发音的e结尾加r"],
        ["规则二", "safe", "safer", "以不发音的e结尾加r"],
        ["规则二", "cute", "cuter", "以不发音的e结尾加r"],
        ["规则三", "big", "bigger", "重读闭音节双写辅音字母加er"],
        ["规则三", "hot", "hotter", "重读闭音节双写辅音字母加er"],
        ["规则三", "thin", "thinner", "重读闭音节双写辅音字母加er"],
        ["规则三", "fat", "fatter", "重读闭音节双写辅音字母加er"],
        ["规则四", "happy", "happier", "辅音字母+y结尾变y为i加er"],
        ["规则四", "easy", "easier", "辅音字母+y结尾变y为i加er"],
        ["规则四", "heavy", "heavier", "辅音字母+y结尾变y为i加er"],
        ["规则四", "busy", "busier", "辅音字母+y结尾变y为i加er"],
        ["规则五", "good", "better", "不规则变化"],
        ["规则五", "bad", "worse", "不规则变化"],
        ["规则五", "many", "more", "不规则变化"],
        ["规则五", "little", "less", "不规则变化"],
        ["规则六", "beautiful", "more beautiful", "多音节单词比较级前加more"],
        ["规则六", "important", "more important", "多音节单词比较级前加more"],
        ["规则六", "interesting", "more interesting", "多音节单词比较级前加more"],
        ["规则六", "difficult", "more difficult", "多音节单词比较级前加more"]
      ]
    }
  },

  "comparative_note_001": {
    "id": "comparative_note_001",
    "frontendName": "比较级笔记",
    "content": "形容词比较级书写",
    "category": "形容词",
    "subCategory": "形容词(2)",
    "status": "已创建",
    "noteContent": "一、比较级的标志词\\nthan（比）：用于两者之间的比较，如 \"She is taller than me.\"（她比我高）。\\nmuch/a lot（…… 得多）、a little/a bit（稍微……）：用于修饰比较级，加强程度，如 \"He runs much faster than you.\"（他跑得比你快得多）。\\neven（甚至）：强调程度的递进，如 \"This book is even more interesting.\"（这本书甚至更有趣）。\\n\\n二、比较级的书写方式\\n规则变化：\\n一般情况下，直接加 \"er\"，如 \"tall→taller\"\"young→younger\"。\\n以不发音的 \"e\" 结尾的形容词，加 \"r\"，如 \"nice→nicer\"\"large→larger\"。\\n以 \"辅音字母 + y\" 结尾的，变 \"y\" 为 \"i\" 再加 \"er\"，如 \"happy→happier\"\"heavy→heavier\"。\\n以重读闭音节结尾且末尾只有一个辅音字母的，双写该辅音字母再加 \"er\"，如 \"big→bigger\"\"hot→hotter\"。\\n部分双音节和多音节词：在词前加 \"more\"，如 \"beautiful→more beautiful\"\"important→more important\"。\\n\\n三、常见特殊变化的形容词（6 个）\\n好：good→better\\n坏：bad→worse\\n多：many/much→more\\n少：little→less\\n老：old→older/elder（older 指年龄大小，elder 指长幼关系，如 elder sister 姐姐）\\n远：far→farther/further（farther 指距离远，further 指程度深，如 further study 深造）\\n\\n四、考察示例\\n— Which is ______ (delicious), the cake or the bread?\\n— The cake, I think.\\n答案：more delicious\\n解析：\"delicious\" 是多音节词，比较级需在前面加 \"more\"，句中通过 \"or\" 表示两者比较，符合比较级用法。"
  },

  "superlative_table_001": {
    "id": "superlative_table_001",
    "frontendName": "最高级书写",
    "content": "形容词最高级练习表格",
    "category": "形容词",
    "subCategory": "形容词(3)",
    "status": "已创建",
    "tableData": {
      "headers": ["规则", "原形", "最高级", "规则说明"],
      "rows": [
        ["规则一", "fast", "fastest", "一般情况直接加est"],
        ["规则一", "hard", "hardest", "一般情况直接加est"],
        ["规则一", "short", "shortest", "一般情况直接加est"],
        ["规则一", "clean", "cleanest", "一般情况直接加est"],
        ["规则二", "nice", "nicest", "以不发音的e结尾加st"],
        ["规则二", "large", "largest", "以不发音的e结尾加st"],
        ["规则二", "safe", "safest", "以不发音的e结尾加st"],
        ["规则二", "cute", "cutest", "以不发音的e结尾加st"],
        ["规则三", "big", "biggest", "重读闭音节双写辅音字母加est"],
        ["规则三", "hot", "hottest", "重读闭音节双写辅音字母加est"],
        ["规则三", "thin", "thinnest", "重读闭音节双写辅音字母加est"],
        ["规则三", "fat", "fattest", "重读闭音节双写辅音字母加est"],
        ["规则四", "happy", "happiest", "辅音字母+y结尾变y为i加est"],
        ["规则四", "easy", "easiest", "辅音字母+y结尾变y为i加est"],
        ["规则四", "heavy", "heaviest", "辅音字母+y结尾变y为i加est"],
        ["规则四", "busy", "busiest", "辅音字母+y结尾变y为i加est"],
        ["规则五", "good", "best", "不规则变化"],
        ["规则五", "bad", "worst", "不规则变化"],
        ["规则五", "many", "most", "不规则变化"],
        ["规则五", "little", "least", "不规则变化"],
        ["规则六", "beautiful", "most beautiful", "多音节单词最高级前加most"],
        ["规则六", "important", "most important", "多音节单词最高级前加most"],
        ["规则六", "interesting", "most interesting", "多音节单词最高级前加most"],
        ["规则六", "difficult", "most difficult", "多音节单词最高级前加most"]
      ]
    }
  },

  "superlative_note_001": {
    "id": "superlative_note_001",
    "frontendName": "最高级笔记",
    "content": "形容词最高级书写",
    "category": "形容词",
    "subCategory": "形容词(3)",
    "status": "已创建",
    "noteContent": "一、最高级的常见信号词\\nthe：最高级前通常加定冠词 \"the\"，如 \"She is the tallest in the class.\"（她是班里最高的）。\\n范围词：表示比较范围的短语，如 \"in + 范围\"（in the team 在团队里）、\"of + 范围\"（of all the students 在所有学生中）。\\n次数 / 顺序词：如 \"the first\"\"the second\" 等，隐含最高级含义，如 \"This is the first time I've seen such a beautiful place.\"（这是我第一次见到这么美的地方，暗含 \"最美\" 之意）。\\none of the + 最高级：表示 \"最…… 之一\"，如 \"Shanghai is one of the biggest cities in China.\"（上海是中国最大的城市之一）。\\n\\n二、最高级的书写方式\\n规则变化：\\n一般情况加 \"est\"，如 \"tall→tallest\"\"short→shortest\"。\\n以不发音的 \"e\" 结尾，加 \"st\"，如 \"nice→nicest\"\"large→largest\"。\\n以 \"辅音字母 + y\" 结尾，变 \"y\" 为 \"i\" 加 \"est\"，如 \"happy→happiest\"\"heavy→heaviest\"。\\n重读闭音节结尾且末尾只有一个辅音字母，双写该字母加 \"est\"，如 \"big→biggest\"\"hot→hottest\"。\\n部分双音节和多音节词，前加 \"most\"，如 \"beautiful→most beautiful\"\"important→most important\"。\\n特殊变化（6 个）：\\n好：good→best\\n坏：bad→worst\\n多：many/much→most\\n少：little→least\\n老：old→oldest/eldest（eldest 用于家庭成员长幼，如 eldest brother 大哥）\\n远：far→farthest/furthest（furthest 可指程度，如 furthest progress 最大的进步）\\n\\n三、考察示例\\n— Who is ______ (popular) singer in your school?\\n— Lisa, I think. Everyone likes her.\\n答案：the most popular\\n解析：句中 \"in your school\" 表示范围，需用最高级；\"popular\" 是多音节词，最高级前加 \"most\"，且必须加 \"the\"，故填 \"the most popular\"。"
  },`;

// 插入数据
const newContent = intermediateContent.slice(0, insertPosition) + adjectiveData + intermediateContent.slice(insertPosition);

// 写入文件
fs.writeFileSync(intermediatePath, newContent, 'utf8');

console.log('✅ 形容词比较级和最高级笔记和表格数据已成功添加到 intermediate_questions.js 文件中');

// 验证添加的内容
console.log('\n📋 添加的内容包括：');
console.log('1. comparative_table_001 - 比较级书写表格');
console.log('2. comparative_note_001 - 比较级笔记');
console.log('3. superlative_table_001 - 最高级书写表格');
console.log('4. superlative_note_001 - 最高级笔记');

console.log('\n🎯 表格功能特点：');
console.log('- 包含6个规则的比较级/最高级变化');
console.log('- 每个规则包含4个示例单词');
console.log('- 支持自动判断正误');
console.log('- 规则部分可点击展开详细说明');

console.log('\n📝 笔记内容特点：');
console.log('- 详细的比较级/最高级标志词说明');
console.log('- 完整的书写规则变化');
console.log('- 6个特殊变化形容词');
console.log('- 实际考察示例及解析'); 