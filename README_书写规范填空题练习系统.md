# 书写规范填空题练习系统

## 系统概述

本系统将书写规范界面的表格内容转换为"XX的XX是______"格式的填空题，提供自动正误判断和进度保存功能。每个表格抽取三个不同的考点组成一套题，帮助用户系统性地练习各种语法规则。

## 系统特点

- ✅ **考点抽取**：每个表格抽取三个不同考点，避免重复
- ✅ **格式统一**：所有题目采用"XX的XX是______"的填空题格式
- ✅ **自动判断**：实时判断答案正确性，支持多答案格式
- ✅ **进度保存**：自动保存用户练习进度和正确率
- ✅ **分类管理**：按语法类别组织题目，便于针对性练习
- ✅ **统计分析**：提供详细的练习统计和历史记录

## 文件结构

```
├── writing_exercise_questions.js      # 题目数据文件
├── writing_exercise_practice.js       # 练习系统核心
├── writing_exercise_demo.js          # 使用演示文件
└── README_书写规范填空题练习系统.md    # 说明文档
```

## 支持的表格类型

### 1. 代词书写 (2个表格)
- **pronoun_001**: 代词书写(有序) - 3题
- **pronoun_002**: 代词书写(乱序) - 3题

### 2. 名词变复数 (4个表格)
- **noun_001**: 名词后缀识别(一) - 3题
- **noun_002**: 名词后缀识别(二) - 3题
- **noun_003**: 名词后缀识别(三) - 3题
- **noun_004**: 规则变复数 - 3题

### 3. 动词分词书写 (2个表格)
- **present_participle_001**: 现在分词书写 - 3题
- **past_participle_001**: 过去分词书写 - 3题

### 4. 时态书写 (1个表格)
- **tense_writing_001**: 时态书写练习 - 3题

### 5. 语态书写 (3个表格)
- **voice_writing_001**: 语态练习(一般现在时) - 3题
- **voice_writing_002**: 语态练习(一般过去时) - 3题
- **voice_writing_003**: 语态练习(一般将来时) - 3题

### 6. 比较级最高级书写 (3个表格)
- **comparison_prefix_suffix_001**: 形容词前后缀识别 - 3题
- **comparison_comparative_001**: 比较级书写 - 3题
- **comparison_superlative_001**: 最高级书写 - 3题

### 7. 形容词变副词书写 (1个表格)
- **adverb_writing_001**: 形容词变副词书写 - 3题

## 题目格式示例

### 代词书写
```
我的主格是______ (答案: I)
她的宾格是______ (答案: her)
他们的形容词性物主代词是______ (答案: their)
```

### 名词后缀识别
```
happiness, kindness, darkness的后缀是______ (答案: -ness)
development, agreement, improvement的后缀是______ (答案: -ment)
worker, teacher, painter的后缀是______ (答案: -er)
```

### 时态书写
```
一般现在时中，do的第三人称单数形式是______ (答案: does)
一般过去时中，work的过去式是______ (答案: worked)
现在进行时中，study的现在分词是______ (答案: studying)
```

## 使用方法

### 1. 基本使用

```javascript
const { WritingExercisePractice } = require('./writing_exercise_practice.js');

// 创建练习系统实例
const practiceSystem = new WritingExercisePractice();

// 开始练习
const question = practiceSystem.startPractice('pronoun_001');

// 提交答案
const result = practiceSystem.submitAnswer('I');

// 完成练习
const stats = practiceSystem.finishPractice();
```

### 2. 查看可用表格

```javascript
// 获取所有表格ID
const tableIds = practiceSystem.getAllTableIds();

// 获取表格分类信息
const categories = practiceSystem.getTableCategories();

// 获取指定表格的题目
const questions = practiceSystem.getTableQuestions('pronoun_001');
```

### 3. 练习流程

```javascript
// 1. 开始练习
const firstQuestion = practiceSystem.startPractice('pronoun_001');

// 2. 获取当前题目
const currentQuestion = practiceSystem.getCurrentQuestion();

// 3. 提交答案
const result = practiceSystem.submitAnswer('user answer');

// 4. 下一题
const nextQuestion = practiceSystem.nextQuestion();

// 5. 完成练习
const sessionStats = practiceSystem.finishPractice();
```

### 4. 进度管理

```javascript
// 查看完成题目数量
const completedCount = practiceSystem.getCompletedCount('pronoun_001');

// 查看正确率
const accuracy = practiceSystem.getAccuracy('pronoun_001');

// 查看练习历史
const history = practiceSystem.getPracticeHistory('pronoun_001');

// 重置进度
practiceSystem.resetProgress('pronoun_001');
```

### 5. 统计分析

```javascript
// 获取总体统计
const overallStats = practiceSystem.getOverallStats();

// 导出进度数据
const exportedData = practiceSystem.exportProgress();

// 导入进度数据
const success = practiceSystem.importProgress(data);
```

## 数据结构

### 题目数据结构

```javascript
{
  id: "pronoun_001_1",                    // 唯一标识
  question: "我的主格是______",            // 题目内容
  answer: "I",                            // 正确答案
  category: "代词书写",                    // 分类
  subCategory: "人称代词",                 // 子分类
  table_id: "pronoun_001",                // 所属表格ID
  analysis: "第一人称单数的主格形式是I"     // 解析说明
}
```

### 练习会话数据结构

```javascript
{
  tableId: "pronoun_001",                 // 表格ID
  startTime: "2024-01-01T00:00:00.000Z", // 开始时间
  endTime: "2024-01-01T00:05:00.000Z",   // 结束时间
  totalQuestions: 3,                      // 总题数
  answeredQuestions: 3,                   // 已答题数
  correctAnswers: 2,                      // 正确答案数
  accuracy: 67,                           // 正确率(%)
  duration: "5分0秒"                      // 练习时长
}
```

### 用户进度数据结构

```javascript
{
  "pronoun_001": {
    answers: {                             // 答案记录
      "pronoun_001_1": {
        userAnswer: "I",                   // 用户答案
        correctAnswer: "I",                // 正确答案
        correct: true,                     // 是否正确
        timestamp: "2024-01-01T00:00:00.000Z", // 答题时间
        attempts: 1                        // 尝试次数
      }
    },
    totalAttempts: 3,                     // 总尝试次数
    correctAttempts: 2,                   // 正确尝试次数
    lastPracticed: "2024-01-01T00:05:00.000Z", // 最后练习时间
    sessions: []                           // 练习会话记录
  }
}
```

## 运行演示

运行演示文件查看系统功能：

```bash
node writing_exercise_demo.js
```

演示内容包括：
1. 查看所有可用表格
2. 查看表格分类
3. 开始练习示例
4. 模拟答题过程
5. 查看练习统计
6. 查看练习历史
7. 查看总体统计
8. 演示其他表格练习
9. 导出进度数据
10. 重置进度演示

## 浏览器环境使用

在浏览器环境中，系统会自动检测并挂载到全局对象：

```javascript
// 创建练习系统实例
const practiceSystem = new window.WritingExercisePractice();

// 运行演示
window.demonstrateSystem();
```

## 扩展功能

### 添加新表格

1. 在 `writing_exercise_questions.js` 中添加新的表格数据
2. 确保每个表格包含3个不同的考点
3. 遵循"XX的XX是______"的题目格式
4. 提供完整的分类和解析信息

### 自定义题目格式

可以修改 `WritingExercisePractice` 类中的 `checkAnswer` 方法来支持不同的答案格式：

```javascript
checkAnswer(userAnswer, correctAnswer) {
  // 自定义答案检查逻辑
  // 例如：支持大小写不敏感、支持部分匹配等
}
```

## 注意事项

1. **数据持久化**：系统使用 `localStorage` 保存进度，清除浏览器数据会丢失进度
2. **答案格式**：系统支持多答案格式（用" / "分隔），如 "which / that"
3. **进度同步**：可以通过导入/导出功能在不同设备间同步进度
4. **错误处理**：系统包含完整的错误处理机制，确保稳定性

## 技术支持

如有问题或建议，请检查：
1. 文件路径是否正确
2. Node.js 版本是否兼容
3. 浏览器是否支持 localStorage
4. 控制台是否有错误信息

## 更新日志

- **v1.0.0**: 初始版本，支持16个表格的填空题练习
- 包含完整的进度保存和统计分析功能
- 支持多答案格式和智能答案判断
