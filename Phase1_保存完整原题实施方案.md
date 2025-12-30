# Phase 1: 保存完整原题实施方案

## 目标
修改作业发布逻辑，确保作业数据中保存完整的原题内容（填空题）

## 当前问题

### generateHomeworkData() 只保存语法点配置
```javascript
return {
  _id: `homework_${Date.now()}`,
  selectedItems: previewData.selectedItems,  // 只有 {category, name, questionCount}
  selectedGrammarPoints: selectedGrammarPoints,  // 只有语法点名称数组
  // ❌ 没有保存实际题目！
}
```

## 解决方案

### 1. 在发布作业前获取完整题目

修改 `publishHomework()` 方法，在保存作业前从云数据库获取题目：

```javascript
async publishHomework() {
  // ... 现有验证逻辑 ...
  
  try {
    // ✅ 新增：从云数据库获取完整题目
    const homeworkData = this.generateHomeworkData();
    const questions = await this.fetchQuestionsForHomework(homeworkData.selectedGrammarPoints);
    
    // ✅ 添加题目到作业数据
    homeworkData.questions = questions;
    
    // 保存到本地和云端
    await this.saveHomework(homeworkData);
    
  } catch (error) {
    console.error('发布作业失败:', error);
  }
}
```

### 2. 实现题目获取方法

```javascript
// 从云数据库获取题目
async fetchQuestionsForHomework(grammarPoints) {
  try {
    const cloudDataLoader = require('../../utils/cloudDataLoader.js');
    const allQuestions = [];
    
    // 为每个语法点获取题目
    for (const point of grammarPoints) {
      const questions = await cloudDataLoader.getQuestionsByGrammarPoint(point);
      
      // 根据作业配置的题目数量选择
      const item = this.data.selectedItems.find(i => i.name === point);
      const count = item ? item.questionCount : 1;
      
      // 随机选择指定数量的题目
      const selected = this.getRandomQuestions(questions, count);
      allQuestions.push(...selected);
    }
    
    return allQuestions;
    
  } catch (error) {
    console.error('获取题目失败:', error);
    return [];
  }
}
```

### 3. 修改数据结构

**新的作业数据结构**：
```javascript
{
  _id: "homework_xxx",
  type: "gaokao",
  title: "高考配比练习",
  selectedItems: [...],  // 语法点配置
  selectedGrammarPoints: [...],  // 语法点名称
  questions: [  // ✅ 新增：完整的题目数据
    {
      _id: "q_xxx",
      text: "work的过去分词是______",
      answer: "worked",
      grammarPoint: "动词分词书写",
      category: "动词",
      analysis: "work是规则动词..."
    },
    // ... 更多题目
  ],
  totalQuestions: 10,
  createdAt: "...",
  // ...
}
```

## 实施步骤

### Step 1: 修改 teacher-homework/index.js

1. 添加 `fetchQuestionsForHomework()` 方法
2. 修改 `publishHomework()` 方法
3. 确保题目数据保存到本地存储和云端

### Step 2: 修改学案生成逻辑

在 `teacher-materials/index.js` 中：

```javascript
generateLocalWordContent(material) {
  // 获取作业数据
  const assignment = allAssignments.find(a => (a._id || a.id) === material.assignmentId);
  
  // ✅ 直接使用保存的题目
  if (assignment && assignment.questions && assignment.questions.length > 0) {
    assignment.questions.forEach((question, index) => {
      practiceContent += `#### 练习${index + 1}：${question.grammarPoint}
**知识点**: ${question.grammarPoint}
**题目**: ${question.text}

**答案**: ${question.answer}
**解析**: ${question.analysis || '...'}

`;
    });
  }
  
  // 变式题暂时留空或显示"正在加载..."
  practiceContent += `
## 变式练习题

（变式题将在 Phase 2 实现）
`;
  
  return content;
}
```

### Step 3: 测试验证

1. 发布新作业
2. 检查本地存储中的作业数据是否包含 `questions` 字段
3. 生成学案，查看是否显示真实题目

## 降级方案

如果云数据库加载失败：

```javascript
async fetchQuestionsForHomework(grammarPoints) {
  try {
    // 尝试从云端获取
    return await this._fetchFromCloud(grammarPoints);
  } catch (error) {
    console.log('云端加载失败，使用本地题库');
    // 降级到本地题库
    return this._fetchFromLocal(grammarPoints);
  }
}
```

## 注意事项

1. **性能优化**：
   - 一次性获取所有语法点的题目（批量查询）
   - 使用 loading 提示用户

2. **数据一致性**：
   - 教师看到的题目 = 学生做的题目
   - 保存时间戳，确保数据不被覆盖

3. **映射表**：
   - 暂时不修改映射表
   - Phase 2 再处理变式题

## 预期效果

**发布作业后**：
- 作业数据包含完整题目
- 教师可以预览原题
- 学生答题使用相同的题目

**生成学案后**：
- 显示真实的填空题
- 原题部分完整准确
- 变式题暂时显示占位文本

---

**立即开始实施？**
