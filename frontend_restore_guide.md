
# 前端代码恢复指南

## 需要恢复的文件和代码

### 1. 恢复语法选择页面的本地逻辑

文件: miniprogram/pages/grammar-select/index.js

需要恢复的关键函数:
```javascript
// 恢复本地获取子点的函数
getSubPointsByCategory: function(category) {
  const categoryIndex = this.data.categories.indexOf(category);
  if (categoryIndex === -1) return [];
  
  const subPoints = this.data.rightPanel[categoryIndex] || [];
  return subPoints.filter(point => this.isPointExists(point));
},

// 恢复本地系统组合逻辑
executeSystemCombo: function(isPreview = false) {
  const systemComboRules = {
    "介词": 1,
    "代词": 1,
    "连词": 1,
    "冠词": 1,
    "名词": 1,
    "动词": 1,
    "谓语": 1,
    "非谓语": { "现在分词综合": 1, "过去分词综合": 1, "不定式综合": 1 },
    "形容词/副词": 1,
    "定语从句/状语和从句": 1
  };
  
  // 恢复原有的系统组合逻辑...
}
```

### 2. 恢复主页面的本地逻辑

文件: miniprogram/pages/index/index.js

需要恢复的关键函数:
```javascript
// 恢复本地获取语法点的函数
getGrammarPointsByCategory(category) {
  const categoryMap = {
    "介词": ["介词综合", "固定搭配", "介词 + 名词/动名词"],
    // ... 其他映射
  };
  return categoryMap[category] || [];
}
```

### 3. 恢复练习页面的本地逻辑

文件: miniprogram/pages/exercise-page/index.js

需要恢复本地数据加载逻辑，确保从 intermediate_questions.js 加载数据。

### 4. 移除云服务相关代码

移除以下导入和调用:
- const grammarCategoryService = require('../../utils/grammarCategoryService')
- 所有 wx.cloud.callFunction 调用
- 云服务相关的错误处理逻辑

## 验证步骤

1. 确保 intermediate_questions.js 文件存在且完整
2. 测试语法点选择功能
3. 测试系统默认组合功能
4. 测试自定义组合功能
5. 测试练习功能

## 注意事项

- 回滚后需要重新测试所有功能
- 确保本地数据文件完整
- 如有问题，检查控制台错误日志
