# 书写规范表格转填空题转换模板

## 概述

这个模板用于将"书写规范"界面的表格内容批量改编成一题一题的填空题。原本的表格形式需要用户看到表格的表头（如"人称"和"主格"）填出对应的答案（如"I"），现在转换为更直观的填空题形式（如"我的主格是_____"）。

## 转换原理

### 原始表格格式
```
| 人称 | 主格 | 宾格 | 形容词性物主代词 | 名词性物主代词 | 反身代词 |
|------|------|------|------------------|----------------|----------|
| 我   | I    | me   | my               | mine           | myself   |
| 你   | you  | you  | your             | yours          | yourself |
```

### 转换后填空题
1. 我的主格是_____ (答案: I)
2. 我的宾格是_____ (答案: me)
3. 我的形容词性物主代词是_____ (答案: my)
4. 我的名词性物主代词是_____ (答案: mine)
5. 我的反身代词是_____ (答案: myself)
6. 你的主格是_____ (答案: you)
7. 你的宾格是_____ (答案: you)
...

## 支持的表格类型

### 1. 代词表格
- **pronoun_table_001**: 人称物主反身代词整表（5列结构）
- **pronoun_table_002**: 人称代词练习表格（3列结构）
- **pronoun_table_003**: 物主代词练习表格（3列结构）
- **pronoun_table_004**: 反身代词练习表格（2列结构）

### 2. 介词表格
- **preposition_table_001**: 常见介词中译英表格（2列结构）
- **preposition_table_002**: 常见介词词组练习（2列结构）
- **preposition_table_003**: 介词+名词/动名词表格（2列结构）

### 3. 时态表格
- **tense_writing_001**: 时态书写练习表格（动态列结构）

### 4. 语态表格
- **voice_writing_001**: 语态书写练习表格（3列结构）

## 使用方法

### 1. 基本用法

```javascript
const converter = require('./writing_exercise_converter_template.js');

// 转换单个表格
const exercises = converter.convertTableToExercises(tableData, 'pronoun_table_001');

// 查看转换结果
exercises.forEach((exercise, index) => {
  console.log(`${index + 1}. ${exercise.question}`);
  console.log(`   答案: ${exercise.correctAnswer}`);
  console.log(`   解析: ${exercise.explanation}`);
});
```

### 2. 批量转换

```javascript
const allTableData = {
  'pronoun_table_001': pronounTableData,
  'preposition_table_001': prepositionTableData,
  'pronoun_table_002': pronounSimpleTableData
};

let totalExercises = 0;
for (const tableId in allTableData) {
  const exercises = converter.convertTableToExercises(allTableData[tableId], tableId);
  totalExercises += exercises.length;
  console.log(`表格 ${tableId} 生成了 ${exercises.length} 道题`);
}

console.log(`总计生成 ${totalExercises} 道填空题`);
```

### 3. 生成文件

```javascript
const fs = require('fs');

// 转换所有表格
const allExercises = [];
for (const tableId in allTableData) {
  const exercises = converter.convertTableToExercises(allTableData[tableId], tableId);
  allExercises.push(...exercises);
}

// 生成文件内容
const fileContent = {
  metadata: {
    title: "书写规范填空题集合",
    description: "从书写规范界面表格转换而来的填空题",
    totalCount: allExercises.length,
    generatedAt: new Date().toISOString(),
    source: "书写规范界面表格转换"
  },
  exercises: allExercises
};

// 保存到文件
fs.writeFileSync('writing_exercises.json', JSON.stringify(fileContent, null, 2));
```

## 转换模板配置

### 代词表格模板

```javascript
pronoun_table_001: {
  description: "人称物主反身代词整表转换",
  template: "{{person}}的{{grammar_point}}是_____",
  personMapping: {
    "I": "我", "you": "你", "he": "他", "she": "她", "it": "它",
    "we": "我们", "you": "你们", "they": "他们"
  }
}
```

### 介词表格模板

```javascript
preposition_table_001: {
  description: "常见介词中译英表格转换",
  template: "{{meaning}}的介词是_____"
}
```

## 输出格式

每个转换后的填空题包含以下信息：

```javascript
{
  id: "pronoun_001_0_1",           // 唯一标识符
  type: "pronoun_fill_blank",      // 题目类型
  question: "我的主格是_____",     // 题目内容
  correctAnswer: "I",              // 正确答案
  category: "代词",                // 语法分类
  subCategory: "代词(1)",          // 子分类
  explanation: "我的主格是I"       // 解析说明
}
```

## 转换规则详解

### 1. 代词表格转换规则

**pronoun_table_001 (整表)**:
- 输入：5列结构（人称、主格、宾格、形容词性物主代词、名词性物主代词、反身代词）
- 输出：为每个语法点生成填空题
- 模板：`{{person}}的{{grammar_point}}是_____`

**pronoun_table_002 (人称代词)**:
- 输入：3列结构（人称、主格、宾格）
- 输出：为每个语法点生成填空题
- 模板：`{{person}}的{{grammar_point}}是_____`

### 2. 介词表格转换规则

**preposition_table_001 (常见介词)**:
- 输入：2列结构（意思、介词）
- 输出：每行生成一道填空题
- 模板：`{{meaning}}的介词是_____`

### 3. 时态表格转换规则

**tense_writing_001 (时态书写)**:
- 输入：动态列结构（时态名称、规则、动词形式1-4）
- 输出：为每个动词形式生成填空题
- 模板：`{{tense_name}}的{{grammar_point}}是_____`

## 扩展自定义

### 添加新的表格类型

1. 在 `conversionTemplates` 中添加新模板
2. 在 `convertTableToExercises` 函数中添加新的转换逻辑
3. 创建对应的转换函数

```javascript
// 添加新模板
conversionTemplates.new_table_type = {
  description: "新表格类型转换",
  template: "{{custom_placeholder}}是_____"
};

// 添加转换逻辑
if (tableId.startsWith('new_table_')) {
  exercises.push(...convertNewTable(tableData, template));
}

// 创建转换函数
function convertNewTable(tableData, template) {
  // 实现转换逻辑
}
```

### 自定义转换模板

可以修改模板中的占位符来适应不同的题目格式：

```javascript
// 原模板
template: "{{person}}的{{grammar_point}}是_____"

// 自定义模板
template: "请填写{{person}}的{{grammar_point}}: _____"
template: "{{person}}的{{grammar_point}}是什么？_____"
```

## 注意事项

1. **数据格式要求**: 确保表格数据符合预期的结构，包含必要的 `headers`、`rows` 和 `answers` 字段
2. **模板匹配**: 表格ID必须与转换模板中的ID完全匹配
3. **错误处理**: 转换过程中会输出警告信息，建议检查控制台输出
4. **性能考虑**: 对于大量表格数据，建议分批处理以避免内存问题

## 示例运行

运行示例文件查看转换效果：

```bash
node writing_exercise_converter_example.js
```

这将展示各种表格类型的转换过程和结果。

## 文件结构

```
├── writing_exercise_converter_template.js    # 核心转换模板
├── writing_exercise_converter_example.js     # 使用示例
└── README_书写规范表格转填空题模板.md       # 说明文档
```

## 技术支持

如果在使用过程中遇到问题，请检查：

1. 表格数据格式是否正确
2. 表格ID是否与模板匹配
3. 控制台是否有错误信息
4. 数据字段是否完整

这个模板为"书写规范"界面的表格内容提供了灵活的转换方案，可以根据实际需求进行扩展和定制。
