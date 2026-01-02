# AI变式题批量导入使用指南

## 📋 概述

本指南介绍如何使用 `batch_import_ai_variants.js` 脚本将AI生成的变式题批量导入到云数据库。

## 🚀 快速开始

### 步骤1：准备AI生成的题目数据

将AI生成的JSON数组保存为变量，例如：

```javascript
// 示例：AI生成的变式题数据
const questions = [
  {
    "text": "—Have you seen the new movie? —Yes. I ____ it with my cousin yesterday. A. see B. saw C. have seen D. will see",
    "answer": "B",
    "grammarPoint": "一般过去时",
    "category": "动词时态",
    "type": "choice",
    "analysis": "题干中的时间状语yesterday（昨天）表明动作发生在过去，需用一般过去时。选项B saw为see的过去式，符合语境。",
    "difficulty": "easy",
    "province": "云南",
    "year": 2025,
    "source": "变式题"
  },
  // ... 更多题目
];
```

### 步骤2：在微信开发者工具中运行

1. 打开微信开发者工具
2. 打开项目
3. 在控制台中运行：

```javascript
// 加载脚本（如果还没加载）
// 将 batch_import_ai_variants.js 的内容复制到控制台

// 准备题目数据
const questions = [/* 你的AI生成的题目数组 */];

// 开始导入
await uploadAIVariants(questions);
```

## 📝 详细使用方法

### 方法1：自动选择最佳方式（推荐）

```javascript
const questions = [/* AI生成的题目数组 */];
const result = await uploadAIVariants(questions);

if (result.success) {
  console.log(`✅ 成功导入 ${result.uploaded} 题`);
} else {
  console.log(`❌ 导入失败: ${result.message}`);
}
```

### 方法2：使用云函数导入（最稳定）

```javascript
const questions = [/* AI生成的题目数组 */];
const result = await uploadViaCloudFunction(questions);
```

### 方法3：直接导入数据库（最快）

```javascript
const questions = [/* AI生成的题目数组 */];
const result = await uploadDirectly(questions);
```

## 🔍 验证题目数据

在导入前，可以先验证题目数据：

```javascript
// 验证单个题目
const question = {
  text: "...",
  answer: "B",
  // ... 其他字段
};
const isValid = validateQuestion(question, 0);
console.log(isValid ? '✅ 有效' : '❌ 无效');

// 分析所有题目
const stats = analyzeQuestions(questions);
console.log('统计信息:', stats);
```

## 📊 字段要求

每个题目必须包含以下字段：

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| text | string | ✅ | 题目文本（包含题干和选项） |
| answer | string | ✅ | 答案（A/B/C/D） |
| grammarPoint | string | ✅ | 三级知识点 |
| category | string | ✅ | 二级知识点 |
| type | string | ✅ | 题目类型（choice/fill_blank） |
| analysis | string | ✅ | 解析 |
| difficulty | string | ✅ | 难度（easy/medium/hard） |
| province | string | ✅ | 省份（如"云南"） |
| year | number | ✅ | 年份（如2025） |
| source | string | ✅ | 来源（如"变式题"） |

## ⚙️ 配置说明

### 批量大小

- **云函数方式**：每批50题（可在脚本中修改 `batchSize`）
- **直接导入**：每批20题（可在脚本中修改 `batchSize`）

### 延迟设置

为避免频率限制，每批之间会有500ms延迟。如需调整，修改脚本中的：

```javascript
await new Promise(resolve => setTimeout(resolve, 500));
```

## 🐛 常见问题

### 1. 提示"未检测到云开发环境"

**解决方法**：
- 确保在微信开发者工具中运行
- 确保已开通云开发服务
- 确保已初始化云开发

### 2. 部分题目导入失败

**可能原因**：
- 字段不完整或格式错误
- 网络问题
- 数据库权限问题

**解决方法**：
- 检查控制台错误信息
- 使用 `validateQuestion()` 验证题目
- 检查云开发权限设置

### 3. 导入速度慢

**解决方法**：
- 使用 `uploadDirectly()` 方法（更快但可能不稳定）
- 减少批量大小
- 检查网络连接

## 📈 导入结果

导入完成后会显示：

```
📊 上传统计:
   ✅ 成功: 150 题
   ❌ 失败: 0 题
   📈 总计: 150 题

✅ 云数据库当前题目总数: 1234
```

## 💡 最佳实践

1. **导入前验证**：使用 `analyzeQuestions()` 先分析题目
2. **分批导入**：大量题目建议分批导入
3. **保留备份**：导入前保存原始数据
4. **验证结果**：导入后检查数据库中的题目数量
5. **错误处理**：关注失败题目的错误信息

## 🔗 相关文档

- [AI提示词模板-中考变式题生成.md](./AI提示词模板-中考变式题生成.md)
- [AI生成中考变式题指南.md](./AI生成中考变式题指南.md)

## 📞 技术支持

如遇到问题，请检查：
1. 题目字段是否完整
2. 云开发服务是否正常
3. 网络连接是否稳定
4. 数据库权限是否正确

