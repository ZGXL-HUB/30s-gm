# cloudDataLoader.js 映射逻辑深度分析报告

## 📋 一、高中模块映射表完整结构

### 1.1 映射表格式

高中模块的映射表采用 **`"语法点名称": "数据库category值"`** 的格式，位于 `cloudDataLoader.js` 第237-343行。

### 1.2 完整映射表内容

```javascript
high: {
  // 时态映射
  tense: {
    "一般过去时": "时态综合",
    "一般将来时": "时态综合",
    "过去将来时": "时态综合",
    "现在进行时": "时态综合",
    "过去进行时": "时态综合",
    "现在完成时": "时态综合",
    "过去完成时": "时态综合",
    "时态(一般过去时)": "时态综合",
    "时态(一般将来时)": "时态综合",
    "时态(过去将来时)": "时态综合",
    "时态(现在进行时)": "时态综合",
    "时态(过去进行时)": "时态综合",
    "时态(现在完成时)": "时态综合",
    "时态(过去完成时)": "时态综合"
  },

  // 语态映射
  voice: {
    "被动语态": "语态综合",
    "语态(被动+八大时态)": "语态综合"
  },

  // 谓语映射
  predicate: {
    "谓语": "谓语综合"
  },

  // 名词映射
  noun: {
    "单复数同形": "单复数同形",
    "f/fe结尾": "f/fe结尾",
    "以f/fe结尾": "f/fe结尾",
    "s/sh/ch/x结尾": "s/sh/ch/x结尾",
    "复合词和外来词": "复合词和外来词",
    "泛指与特指": "泛指与特指",
    "不规则复数": "不规则复数",
    "以o结尾": "以o结尾",
    "以y结尾": "以y结尾"
  },

  // 代词映射
  pronoun: {
    "关系代词": "关系代词",
    "反身代词": "反身代词",
    "人称代词": "人称代词"
  },

  // 介词映射
  preposition: {
    "介词综合": "介词综合",
    "固定搭配": "固定搭配"
  },

  // 连词映射 ⚠️ 重点分析
  conjunction: {
    "连词综合": "连词综合",
    "连词与名词": "连词综合",      // ← 映射到 "连词综合"
    "连词与动词": "连词综合",      // ← 映射到 "连词综合"
    "连词与形容词": "连词综合"     // ← 映射到 "连词综合"
  },

  // 冠词映射
  article: {
    "a和an": "冠词综合",
    "the的特殊用法": "冠词综合"
  },

  // 动词映射
  verb: {
    "动词综合": "动词综合",
    "插入语与动词": "动词综合",
    "主从句与动词": "动词综合",
    "并列句与动词": "动词综合"
  },

  // 非谓语映射
  nonfinite: {
    "现在分词综合": "现在分词综合",
    "过去分词综合": "过去分词综合",
    "不定式综合": "不定式综合"
  },

  // 形容词映射
  adjective: {
    "比较级": "形容词综合",
    "最高级": "形容词综合"
  },

  // 副词映射
  adverb: {
    "副词修饰句子": "副词修饰句子",
    "副词修饰形容词/副词": "副词综合",
    "副词修饰动词": "副词综合"
  },

  // 从句映射
  clause: {
    "定语从句综合": "定语从句综合",
    "状语从句综合": "状语从句综合"
  }
}
```

---

## 🔍 二、grammarPoint 参数来源分析

### 2.1 在 `teacher-generate-material/index.js` 中的来源

**位置**: 第298-299行

```javascript
questions.forEach(q => {
  const point = q.grammarPoint || q.category;  // ← grammarPoint 来自这里
  pointCountMap[point] = (pointCountMap[point] || 0) + 1;
  // ...
});
```

**说明**:
- `questions` 数组来自 `assignmentData.questions`（作业数据）
- 每个题目对象 `q` 包含 `grammarPoint` 或 `category` 字段
- 优先使用 `grammarPoint`，如果没有则使用 `category`

### 2.2 在 `teacher-homework/index.js` 中的来源

**位置**: 第2614-2629行

```javascript
// 获取选中的语法点名称（用于云数据库查询）
let selectedGrammarPoints = [];
if (homeworkType === 'gaokao') {
  // 高考配比模式：使用 gaokaoRatio.selectedGrammarPoints
  selectedGrammarPoints = this.data.gaokaoRatio.selectedGrammarPoints || [];
} else {
  // 从grammarTopics中提取选中的小点名称
  this.data.grammarTopics.forEach(topic => {
    topic.points.forEach(point => {
      if (point.selected) {
        selectedGrammarPoints.push(point.name);  // ← grammarPoint 来自 point.name
      }
    });
  });
}
```

**说明**:
- **高考配比模式**: grammarPoint 来自 `gaokaoRatio.selectedGrammarPoints`（系统自动生成）
- **自选模式**: grammarPoint 来自用户选择的 `point.name`（语法小点的名称）
- **专题模式**: grammarPoint 来自专题下的所有子点名称

### 2.3 grammarPoint 的典型值示例

根据代码分析，grammarPoint 可能是以下值：

**高中模块**:
- `"连词与名词"`
- `"连词与动词"`
- `"连词与形容词"`
- `"连词综合"`
- `"时态综合"`
- `"语态综合"`
- `"谓语综合"`
- `"介词综合"`
- `"固定搭配"`
- `"a和an"`
- `"the的特殊用法"`
- `"比较级"`
- `"最高级"`
- `"副词修饰句子"`
- `"副词修饰形容词/副词"`
- `"定语从句综合"`
- `"状语从句综合"`

**初中模块**:
- `"名词所有格"`
- `"名词的复数"`
- `"人称代词"`
- `"物主代词"`
- `"反身代词"`
- `"时间介词"`
- `"地点介词"`
- `"一般过去时"`
- `"现在完成时"`
- 等等...

---

## 🔄 三、映射到数据库查询的逻辑

### 3.1 映射处理流程

**位置**: `cloudDataLoader.js` 第352-450行

```javascript
// 步骤1: 合并所有子映射表为一个平面映射
const specialMapping = {};
Object.values(levelMapping).forEach(subMapping => {
  Object.keys(subMapping).forEach(key => {
    const value = subMapping[key];
    if (finalSchoolLevel === 'middle' && typeof value === 'object' && value.category) {
      // 初中模块：存储完整的映射信息
      specialMapping[key] = value.category;
    } else {
      // 高中模块：保持原有格式 { grammarPoint: category }
      specialMapping[key] = value;  // 例如: "连词与名词" -> "连词综合"
    }
  });
});

// 步骤2: 确定查询条件
let actualCategory = specialMapping[grammarPoint] || grammarPoint;
// 如果映射表中存在 grammarPoint，使用映射后的 category
// 否则直接使用 grammarPoint 作为 category
```

### 3.2 查询逻辑（第483-519行）

```javascript
// 步骤1b：使用 category 进行精确匹配
let result = await wx.cloud.database()
  .collection('questions')
  .where(buildWhereCondition(actualCategory, type))
  .limit(limit)
  .get();

// buildWhereCondition 构建的查询条件：
// {
//   category: actualCategory,  // 例如: "连词综合"
//   schoolLevel: schoolLevel,  // 例如: "high"
//   type: type                 // 可选: "choice" 或 "fill_blank"
// }
```

### 3.3 回退机制

如果精确匹配失败，会尝试：

1. **父分类回退**（第522-535行）:
   ```javascript
   const parentCategory = parentCategoryMapping[actualCategory] || parentCategoryMapping[grammarPoint];
   // 例如: "连词综合" -> "连词综合" (无父分类)
   // 例如: "时态综合" -> "谓语综合" (有父分类)
   ```

2. **模糊匹配**（第537-602行）:
   - 使用关键词匹配
   - 检查题目文本和解析
   - 作为最后的兜底方案

---

## ⚠️ 四、关键问题：映射值与实际数据库的匹配性

### 4.1 实际数据库中的 category 值（从示例数据推断）

#### 高中模块（从 `questions_jsonl_batch_5.json` 抽样）:

| 题目序号 | category 值 | grammarPoint 值 |
|---------|------------|----------------|
| 1-4 | `"谓语(2)"` | `"谓语(2)"` |
| 5-23 | `"谓语(3)"` | `"谓语(3)"` |

**发现**: 高中模块实际使用的是 **编号格式**，如 `"谓语(2)"`、`"谓语(3)"`，而不是 `"时态综合"` 或 `"谓语综合"`。

#### 初中模块（从 `middle_school_questions.json` 抽样）:

| 题目序号 | category 值 | grammarPoint 值 |
|---------|------------|----------------|
| 1-3 | `"名词"` | `"名词所有格"` |
| 4-6 | `"名词"` | `"名词的复数"` |
| 7-9 | `"代词"` | `"人称代词"` |
| 10-12 | `"代词"` | `"物主代词"` |

**发现**: 初中模块使用 **大类名称** 作为 category，如 `"名词"`、`"代词"`，这与映射表一致。

### 4.2 映射冲突分析

#### ❌ 问题1: "连词与名词" → "连词综合" 映射可能不匹配

**映射表说**:
```javascript
"连词与名词": "连词综合"
```

**实际情况**:
- 数据库中可能没有 `"连词综合"` 这个 category
- 更可能的是 `"连词(1)"`、`"连词(2)"`、`"连词(3)"` 等编号格式
- 或者根本没有对应的题目

**验证方法**:
需要查询数据库确认是否存在 `category = "连词综合"` 的题目。

#### ❌ 问题2: "时态综合" 映射可能不匹配

**映射表说**:
```javascript
"一般过去时": "时态综合"
"一般将来时": "时态综合"
// ...
```

**实际情况**:
- 从 `questions_jsonl_batch_5.json` 看到，实际 category 是 `"谓语(2)"`、`"谓语(3)"`
- 没有看到 `"时态综合"` 这个 category
- 可能时态相关的题目都归类在 `"谓语(X)"` 下

#### ⚠️ 问题3: 父分类映射可能不准确

**映射表说**（第435行）:
```javascript
"时态综合": "谓语综合"
```

**实际情况**:
- 数据库中可能没有 `"谓语综合"` 这个 category
- 实际使用的是 `"谓语(1)"`、`"谓语(2)"`、`"谓语(3)"` 等编号格式

---

## 🔬 五、验证建议

### 5.1 需要验证的映射关系

| 映射表中的 grammarPoint | 映射到的 category | 需要验证 |
|------------------------|------------------|---------|
| `"连词与名词"` | `"连词综合"` | ⚠️ 数据库中是否存在 `category = "连词综合"` 的题目？ |
| `"连词与动词"` | `"连词综合"` | ⚠️ 同上 |
| `"连词与形容词"` | `"连词综合"` | ⚠️ 同上 |
| `"一般过去时"` | `"时态综合"` | ⚠️ 数据库中是否存在 `category = "时态综合"` 的题目？ |
| `"时态综合"` | `"谓语综合"` | ⚠️ 数据库中是否存在 `category = "谓语综合"` 的题目？ |
| `"a和an"` | `"冠词综合"` | ⚠️ 数据库中是否存在 `category = "冠词综合"` 的题目？ |
| `"比较级"` | `"形容词综合"` | ⚠️ 数据库中是否存在 `category = "形容词综合"` 的题目？ |

### 5.2 建议的验证SQL查询

```javascript
// 验证 "连词综合" 是否存在
const result1 = await wx.cloud.database()
  .collection('questions')
  .where({ category: '连词综合', schoolLevel: 'high' })
  .count();

// 验证 "时态综合" 是否存在
const result2 = await wx.cloud.database()
  .collection('questions')
  .where({ category: '时态综合', schoolLevel: 'high' })
  .count();

// 验证 "谓语综合" 是否存在
const result3 = await wx.cloud.database()
  .collection('questions')
  .where({ category: '谓语综合', schoolLevel: 'high' })
  .count();

// 查看实际存在的连词相关 category
const result4 = await wx.cloud.database()
  .collection('questions')
  .where({ 
    schoolLevel: 'high',
    category: db.RegExp({
      regexp: '连词',
      options: 'i'
    })
  })
  .field({ category: true })
  .get();

// 查看实际存在的谓语相关 category
const result5 = await wx.cloud.database()
  .collection('questions')
  .where({ 
    schoolLevel: 'high',
    category: db.RegExp({
      regexp: '谓语',
      options: 'i'
    })
  })
  .field({ category: true })
  .get();
```

### 5.3 实际数据库 category 值统计（需要执行查询）

建议执行以下查询，统计数据库中实际存在的 category 值：

```javascript
// 统计所有高中题目的 category 值
const allHighQuestions = await wx.cloud.database()
  .collection('questions')
  .where({ schoolLevel: 'high' })
  .field({ category: true, grammarPoint: true })
  .get();

// 统计所有初中题目的 category 值
const allMiddleQuestions = await wx.cloud.database()
  .collection('questions')
  .where({ schoolLevel: 'middle' })
  .field({ category: true, grammarPoint: true })
  .get();

// 去重统计
const highCategories = [...new Set(allHighQuestions.data.map(q => q.category))];
const middleCategories = [...new Set(allMiddleQuestions.data.map(q => q.category))];

console.log('高中模块实际存在的 category:', highCategories);
console.log('初中模块实际存在的 category:', middleCategories);
```

---

## 📊 六、总结与建议

### 6.1 核心发现

1. **映射表结构清晰**: 高中模块使用 `"语法点": "category"` 格式，结构合理
2. **映射逻辑完整**: 包含精确匹配、父分类回退、模糊匹配三层机制
3. **⚠️ 潜在问题**: 映射的目标值（如 `"连词综合"`、`"时态综合"`）可能与实际数据库中的 category 值不匹配

### 6.2 关键问题

**最可能的情况**:
- 数据库中实际使用的是 **编号格式**（如 `"连词(1)"`、`"谓语(2)"`）
- 而映射表使用的是 **综合格式**（如 `"连词综合"`、`"时态综合"`）
- 这会导致查询失败，只能依赖模糊匹配或父分类回退

### 6.3 建议的解决方案

#### 方案1: 修正映射表（推荐）

如果数据库中实际使用的是编号格式，应该修改映射表：

```javascript
conjunction: {
  "连词综合": "连词(1)",  // 或 "连词(2)"、"连词(3)" 等
  "连词与名词": "连词(1)",
  "连词与动词": "连词(2)",
  "连词与形容词": "连词(3)"
}
```

#### 方案2: 统一数据库 category 值

如果希望使用 `"连词综合"` 这样的格式，需要：
1. 批量更新数据库中的 category 值
2. 将 `"连词(1)"`、`"连词(2)"` 等统一改为 `"连词综合"`

#### 方案3: 增强模糊匹配

如果无法修改映射表或数据库，可以：
1. 增强模糊匹配逻辑
2. 在模糊匹配中支持编号格式的识别
3. 例如：`"连词综合"` 可以匹配 `"连词(1)"`、`"连词(2)"` 等

### 6.4 下一步行动

1. **立即执行**: 运行验证查询，确认数据库中实际存在的 category 值
2. **对比分析**: 将映射表的目标值与实际数据库值进行对比
3. **修正映射**: 根据实际数据修正映射表
4. **测试验证**: 修正后测试查询功能是否正常

---

## 📝 附录：完整的映射流程示例

### 示例1: 查询 "连词与名词" 的题目

```javascript
// 1. 用户选择 grammarPoint = "连词与名词"
const grammarPoint = "连词与名词";
const schoolLevel = "high";

// 2. 在映射表中查找
const specialMapping = {
  "连词与名词": "连词综合",
  // ...
};
const actualCategory = specialMapping[grammarPoint] || grammarPoint;
// actualCategory = "连词综合"

// 3. 构建查询条件
const condition = {
  category: "连词综合",  // ← 这里可能查不到数据
  schoolLevel: "high"
};

// 4. 执行查询
const result = await wx.cloud.database()
  .collection('questions')
  .where(condition)
  .limit(20)
  .get();

// 5. 如果查询失败，尝试父分类回退
// parentCategoryMapping["连词综合"] = "连词综合" (无父分类)

// 6. 如果还是失败，使用模糊匹配
// 关键词: ["连词", "conjunction"]
// 匹配 category 或 grammarPoint 包含 "连词" 的题目
```

### 示例2: 查询 "一般过去时" 的题目

```javascript
// 1. grammarPoint = "一般过去时"
const grammarPoint = "一般过去时";
const schoolLevel = "high";

// 2. 映射
const actualCategory = "时态综合";

// 3. 查询 category = "时态综合"
// 如果失败，父分类回退到 "谓语综合"
// 如果还是失败，模糊匹配 "一般过去时" 关键词
```

---

**报告生成时间**: 2025-01-XX
**分析文件**: `miniprogram/utils/cloudDataLoader.js`
**关键行数**: 237-343 (映射表), 352-450 (映射逻辑), 483-602 (查询逻辑)
