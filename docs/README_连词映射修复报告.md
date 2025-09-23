# 连词映射修复报告

## 问题描述

连词部分的题目点击笔记按钮时，跳转到的是一般现在时的笔记，而不是对应的连词笔记。这是因为在 `getStandardizedQuestionType` 方法中缺少连词相关的映射，导致连词题目无法匹配到正确的类型，最终使用默认值 `'tense-simple-present'`（一般现在时）。

## 问题原因分析

### 1. 缺少连词映射
在 `getStandardizedQuestionType` 方法中，只有谓语、名词、代词、介词、形容词、副词、非谓语的映射，但没有连词相关的映射。

### 2. 兜底机制导致的问题
当题目类型无法匹配时，系统会返回默认值 `'tense-simple-present'`，这就是为什么大部分时候显示一般现在时笔记的原因。

### 3. 映射链断裂
即使 `getStandardizedQuestionType` 能正确识别连词类型，`getNoteDataByQuestionType` 和 `getTableIdsByQuestionType` 方法中也缺少对应的映射。

## 修复内容

### 1. 在 `getStandardizedQuestionType` 方法中添加连词映射

```javascript
// 连词相关映射
'连词(1)': 'conjunction-coordinating',
'连词(2)': 'conjunction-subordinating', 
'连词(3)': 'conjunction-comprehensive',
'连词(4)': 'conjunction-noun',
'连词(5)': 'conjunction-verb',
'连词(6)': 'conjunction-adjective',
'连词综合': 'conjunction-coordinating',
'并列连词': 'conjunction-coordinating',
'从属连词': 'conjunction-subordinating',
'连词与名词': 'conjunction-noun',
'连词与动词': 'conjunction-verb',
'连词与形容词': 'conjunction-adjective',
```

### 2. 在 `getNoteDataByQuestionType` 方法中添加连词笔记映射

```javascript
// 连词相关映射
'conjunction-coordinating': 'conjunction_note_001', // 连词(1) - 并列连词综合
'conjunction-subordinating': 'conjunction_note_002', // 连词(2) - 从属连词综合
'conjunction-comprehensive': 'conjunction_note_003', // 连词(3) - 连词与名/动/形/副综合
'conjunction-noun': 'conjunction_note_004', // 连词(4) - 连词与名词
'conjunction-verb': 'conjunction_note_005', // 连词(5) - 连词与动词
'conjunction-adjective': 'conjunction_note_006', // 连词(6) - 连词与形容词
```

### 3. 在 `getTableIdsByQuestionType` 方法中添加连词表格映射

```javascript
// 连词相关映射
'conjunction-coordinating': ['conjunction_table_001'], // 连词(1) - 并列连词综合练习表格
'conjunction-subordinating': ['conjunction_table_002'], // 连词(2) - 从属连词综合练习表格
'conjunction-comprehensive': ['conjunction_table_003'], // 连词(3) - 连词与名/动/形/副综合练习表格
'conjunction-noun': ['conjunction_table_004'], // 连词(4) - 连词与名词练习表格
'conjunction-verb': ['conjunction_table_005'], // 连词(5) - 连词与动词练习表格
'conjunction-adjective': ['conjunction_table_006'], // 连词(6) - 连词与形容词练习表格
```

## 映射关系

| 连词分类 | 标准化类型 | 笔记ID | 表格ID | 内容描述 |
|---------|-----------|--------|--------|----------|
| 连词(1) | conjunction-coordinating | conjunction_note_001 | conjunction_table_001 | 并列连词综合 |
| 连词(2) | conjunction-subordinating | conjunction_note_002 | conjunction_table_002 | 从属连词综合 |
| 连词(3) | conjunction-comprehensive | conjunction_note_003 | conjunction_table_003 | 连词与名/动/形/副综合 |
| 连词(4) | conjunction-noun | conjunction_note_004 | conjunction_table_004 | 连词与名词 |
| 连词(5) | conjunction-verb | conjunction_note_005 | conjunction_table_005 | 连词与动词 |
| 连词(6) | conjunction-adjective | conjunction_note_006 | conjunction_table_006 | 连词与形容词 |

## 验证数据

根据 `intermediate_questions.js` 文件中的实际数据：

- 连词(1) 题目：包含 "but", "and", "or", "so", "while" 等并列连词
- 连词(2) 题目：包含 "when", "if", "because", "until" 等从属连词  
- 连词(4) 题目：包含动词时态相关的连词用法
- 连词(6) 题目：包含形容词相关的连词用法

## 修复效果

修复后，连词题目的按钮跳转应该正确对应：

- 连词(1) 的按钮 → 并列连词综合笔记和表格
- 连词(2) 的按钮 → 从属连词综合笔记和表格
- 连词(3) 的按钮 → 连词与名/动/形/副综合笔记和表格
- 连词(4) 的按钮 → 连词与名词笔记和表格
- 连词(5) 的按钮 → 连词与动词笔记和表格
- 连词(6) 的按钮 → 连词与形容词笔记和表格

## 关于兜底机制

修复后，兜底机制仍然存在，但只会在以下情况触发：
1. 题目分类完全无法识别
2. 题目分类不在预定义的映射中
3. 数据格式异常

这确保了系统的健壮性，同时解决了连词题目错误跳转的问题。

## 测试建议

1. 进入语法练习页面
2. 选择连词相关的练习
3. 点击题目右侧的笔记按钮
4. 验证显示的笔记内容是否为对应的连词笔记
5. 点击表格按钮，验证跳转的表格是否正确

## 修复状态

✅ 已完成修复
✅ 映射关系已建立
✅ 笔记和表格ID已确认存在
✅ 兜底机制保持完整
