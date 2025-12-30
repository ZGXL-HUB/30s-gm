# Phase 2: 变式题实施方案

## 目标
为每个原题查找并显示同语法点的变式题（填空题格式）

## 关键发现

### 映射表位置
从代码搜索发现，系统中有一个**分类映射表**用于查找变式题：

```javascript
// miniprogram/pages/index/index.js (line 1481-1517)
const categoryMapping = {
  "介词(1)": "介词", "介词(2)": "介词", "介词(3)": "介词",
  "代词(1)": "代词", "代词(2)": "代词", "代词(3)": "代词",
  "连词(1)": "连词", "连词(2)": "连词", "连词(3)": "连词",
  // ... 更多映射
};
```

### 变式题查找逻辑（已有实现）
在 `exercise-page/index.js` 中已有变式题生成逻辑：

1. 根据原题的 `category` 查找映射
2. 从映射的分类中获取题库中的题目
3. 过滤掉与原题重复的题目
4. 随机选择变式题

## Phase 2 实施步骤

### Step 1: 提取映射表到独立文件

创建 `utils/questionMapping.js`，统一管理映射关系

### Step 2: 实现变式题查找方法

在 `teacher-materials/index.js` 中添加：
```javascript
async getVariantQuestions(originalQuestion) {
  // 1. 根据原题的category查找映射分类
  // 2. 从云数据库获取该分类的题目
  // 3. 过滤掉原题
  // 4. 随机选择2-3题作为变式
}
```

### Step 3: 更新学案生成逻辑

修改 `generateLocalWordContent()`:
```javascript
// 原题部分（已完成）
assignment.questions.forEach((question, index) => {
  practiceContent += `原题内容...`;
});

// ✅ 变式题部分（Phase 2新增）
practiceContent += `\n## 变式练习题\n\n`;

for (const question of assignment.questions) {
  const variants = await this.getVariantQuestions(question);
  
  variants.forEach((variant, index) => {
    practiceContent += `#### 变式题：${question.grammarPoint}
**题目**: ${variant.text}
**答案**: ${variant.answer}
**解析**: ${variant.analysis}
`;
  });
}
```

## 实施细节

### 1. 映射表结构

```javascript
// utils/questionMapping.js
const questionMapping = {
  // 云数据库category → 语法点名称映射
  categoryToGrammarPoint: {
    "介词(1)": "介词",
    "介词(2)": "介词",
    "介词综合": "介词",
    "介词 + 名词/动名词": "介词",
    // ...
  },
  
  // 语法点 → 云数据库category映射（反向）
  grammarPointToCategories: {
    "介词": ["介词(1)", "介词(2)", "介词(3)", "介词综合", "介词 + 名词/动名词"],
    "代词": ["代词(1)", "代词(2)", "代词(3)", "代词综合", "it相关", "人称代词"],
    // ...
  }
};
```

### 2. 变式题查找算法

```javascript
async getVariantQuestions(originalQuestion, count = 2) {
  try {
    const cloudDataLoader = require('../../utils/cloudDataLoader.js');
    const questionMapping = require('../../utils/questionMapping.js');
    
    // 1. 获取原题的语法点
    const grammarPoint = originalQuestion.grammarPoint || originalQuestion.category;
    
    // 2. 查找映射的所有category
    const mappedCategories = questionMapping.grammarPointToCategories[grammarPoint] || [grammarPoint];
    
    console.log(`查找 "${grammarPoint}" 的变式题，映射分类:`, mappedCategories);
    
    // 3. 从云数据库获取所有相关题目
    const allQuestions = [];
    for (const cat of mappedCategories) {
      const questions = await cloudDataLoader.getQuestionsByCategory(cat);
      if (questions && questions.length > 0) {
        allQuestions.push(...questions);
      }
    }
    
    // 4. 过滤掉原题
    const filteredQuestions = allQuestions.filter(q => 
      q._id !== originalQuestion._id && 
      q.text !== originalQuestion.text
    );
    
    // 5. 随机选择变式题
    const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
    const variants = shuffled.slice(0, count);
    
    console.log(`找到 ${variants.length} 个变式题`);
    
    return variants;
    
  } catch (error) {
    console.error('获取变式题失败:', error);
    return [];
  }
}
```

### 3. 性能优化策略

**方案A: 批量加载（推荐）**
```javascript
// 一次性获取所有语法点的题目
async loadAllVariantsForAssignment(assignment) {
  const allGrammarPoints = [...new Set(assignment.questions.map(q => q.grammarPoint))];
  const variantsCache = {};
  
  // 批量加载
  for (const point of allGrammarPoints) {
    const categories = questionMapping.grammarPointToCategories[point];
    const questions = await cloudDataLoader.getQuestionsByCategories(categories);
    variantsCache[point] = questions;
  }
  
  return variantsCache;
}
```

**方案B: 异步加载**
```javascript
// 先显示原题，变式题异步加载
generateLocalWordContent(material) {
  // 1. 立即显示原题
  let content = this.generateOriginalQuestions(material);
  
  // 2. 添加变式题加载提示
  content += `\n## 变式练习题\n\n（正在加载变式题...）\n`;
  
  // 3. 异步加载变式题（不阻塞）
  this.loadVariantsAsync(material).then(variants => {
    // 更新内容
  });
  
  return content;
}
```

### 4. 降级方案

如果找不到变式题：
```javascript
if (variants.length === 0) {
  // 选项1: 使用相近语法点的题目
  const similarPoints = this.getSimilarGrammarPoints(grammarPoint);
  variants = await this.getVariantQuestions({...originalQuestion, grammarPoint: similarPoints[0]});
}

if (variants.length === 0) {
  // 选项2: 显示提示信息
  practiceContent += `\n（该语法点暂无变式题）\n`;
}
```

## 处理语法点不匹配问题

### 问题：语法点命名不一致

**示例**：
- 系统界面: "介词 + 名词/动名词"
- 云数据库: "介词(3)" 或 "介词综合"

### 解决方案：扩展映射表

```javascript
const grammarPointToCategories = {
  "介词 + 名词/动名词": [
    "介词(3)",
    "介词综合",
    "固定搭配",
    "介词"  // 大类兜底
  ],
  "时态(过去进行时)": [
    "时态(过去进行时)",
    "谓语(2)",  // 可能的映射
    "时态综合",  // 相近分类
    "谓语"  // 大类兜底
  ],
  // ... 更多映射
};
```

## 测试验证

### Step 1: 创建映射表文件
- 创建 `utils/questionMapping.js`
- 定义完整的映射关系

### Step 2: 实现变式题查找
- 添加 `getVariantQuestions()` 方法
- 添加批量加载优化

### Step 3: 更新学案生成
- 修改 `generateLocalWordContent()`
- 添加变式题部分

### Step 4: 测试
1. 发布作业
2. 生成学案
3. 查看是否有变式题
4. 验证变式题格式

## 预期效果

### 学案内容示例

```markdown
### 练习内容

#### 练习1：it相关
**题目**: __ was in the park that I met my old friend.
**答案**: It
**解析**: 该句为强调句型...

## 变式练习题

#### 变式题1-1：it相关
**题目**: __ is important to learn English well.
**答案**: It
**解析**: 本题考查it作形式主语的用法...

#### 变式题1-2：it相关
**题目**: I find __ difficult to understand this passage.
**答案**: it
**解析**: 本题考查it作形式宾语的用法...

#### 练习2：连词与形容词
**题目**: The sunset painted the sky a ____ (vibrancy) and orange-hued masterpiece.
**答案**: vibrant
**解析**: ...

#### 变式题2-1：连词与形容词
**题目**: She is ____ (beauty) and intelligent.
**答案**: beautiful
**解析**: ...
```

---

**立即开始实施？** 我会先创建映射表文件，然后实现变式题查找逻辑。
