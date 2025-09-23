# 谓语按钮关联修复验证

## 问题描述
谓语（1）到（9）下方的两个按钮（笔记和表格）都错误地关联到了谓语（1）的笔记和表格，而不是按照习题categories一一对应。

## 问题原因
映射关系不匹配：
1. `getStandardizedQuestionType` 方法将谓语（1）到（9）映射为：
   - 谓语(1) → 'tense-simple-present'
   - 谓语(2) → 'tense-simple-past'
   - 谓语(3) → 'tense-simple-future'
   - 谓语(4) → 'tense-past-future'
   - 谓语(5) → 'tense-present-continuous'
   - 谓语(6) → 'tense-past-continuous'
   - 谓语(7) → 'tense-present-perfect'
   - 谓语(8) → 'tense-past-perfect'
   - 谓语(9) → 'passive-voice'

2. 但是 `getNoteDataByQuestionType` 和 `getTableIdsByQuestionType` 方法中的映射键名不匹配，导致所有谓语分类都映射到了错误的笔记和表格。

## 修复内容

### 1. 更新 `getNoteDataByQuestionType` 方法
添加了与 `getStandardizedQuestionType` 一致的映射关系：
```javascript
const noteMapping = {
  // 谓语相关映射（与getStandardizedQuestionType保持一致）
  'tense-simple-present': 'tense_note_001', // 谓语(1) - 一般现在时
  'tense-simple-past': 'tense_note_002', // 谓语(2) - 一般过去时
  'tense-simple-future': 'tense_note_003', // 谓语(3) - 一般将来时
  'tense-past-future': 'tense_note_004', // 谓语(4) - 过去将来时
  'tense-present-continuous': 'tense_note_005', // 谓语(5) - 现在进行时
  'tense-past-continuous': 'tense_note_006', // 谓语(6) - 过去进行时
  'tense-present-perfect': 'tense_note_007', // 谓语(7) - 现在完成时
  'tense-past-perfect': 'tense_note_008', // 谓语(8) - 过去完成时
  'passive-voice': 'voice_note_001', // 谓语(9) - 被动语态
  // ... 其他映射保持不变
};
```

### 2. 更新 `getTableIdsByQuestionType` 方法
添加了与 `getStandardizedQuestionType` 一致的映射关系：
```javascript
const tableMapping = {
  // 谓语相关映射（与getStandardizedQuestionType保持一致）
  'tense-simple-present': ['tense_table_001'], // 谓语(1) - 一般现在时表格
  'tense-simple-past': ['tense_table_002'], // 谓语(2) - 一般过去时表格
  'tense-simple-future': ['tense_table_003'], // 谓语(3) - 一般将来时表格
  'tense-past-future': ['tense_table_004'], // 谓语(4) - 过去将来时表格
  'tense-present-continuous': ['tense_table_005'], // 谓语(5) - 现在进行时表格
  'tense-past-continuous': ['tense_table_006'], // 谓语(6) - 过去进行时表格
  'tense-present-perfect': ['tense_table_007'], // 谓语(7) - 现在完成时表格
  'tense-past-perfect': ['tense_table_008'], // 谓语(8) - 过去完成时表格
  'passive-voice': ['voice_table_001'], // 谓语(9) - 被动语态表格
  // ... 其他映射保持不变
};
```

## 验证映射关系

### 笔记ID验证
通过搜索确认以下笔记ID存在且内容正确：
- `tense_note_001` - 一般现在时笔记 ✓
- `tense_note_002` - 一般过去时笔记 ✓
- `tense_note_003` - 一般将来时笔记 ✓
- `tense_note_004` - 过去将来时笔记 ✓
- `tense_note_005` - 现在进行时笔记 ✓
- `tense_note_006` - 过去进行时笔记 ✓
- `tense_note_007` - 现在完成时笔记 ✓
- `tense_note_008` - 过去完成时笔记 ✓
- `voice_note_001` - 被动语态笔记 ✓

### 表格ID验证
通过搜索确认以下表格ID存在且内容正确：
- `tense_table_001` - 一般现在时表格 ✓
- `tense_table_002` - 一般过去时表格 ✓
- `tense_table_003` - 一般将来时表格 ✓
- `tense_table_004` - 过去将来时表格 ✓
- `tense_table_005` - 现在进行时表格 ✓
- `tense_table_006` - 过去进行时表格 ✓
- `tense_table_007` - 现在完成时表格 ✓
- `tense_table_008` - 过去完成时表格 ✓
- `voice_table_001` - 被动语态表格 ✓

## 预期效果
修复后，谓语（1）到（9）的按钮应该正确关联：
- 谓语(1) 的按钮 → 一般现在时笔记和表格
- 谓语(2) 的按钮 → 一般过去时笔记和表格
- 谓语(3) 的按钮 → 一般将来时笔记和表格
- 谓语(4) 的按钮 → 过去将来时笔记和表格
- 谓语(5) 的按钮 → 现在进行时笔记和表格
- 谓语(6) 的按钮 → 过去进行时笔记和表格
- 谓语(7) 的按钮 → 现在完成时笔记和表格
- 谓语(8) 的按钮 → 过去完成时笔记和表格
- 谓语(9) 的按钮 → 被动语态笔记和表格

## 测试步骤
1. 进入语法练习页面
2. 选择不同的谓语分类进行练习
3. 点击题目右侧的"笔记"和"表格"按钮
4. 验证显示的笔记和表格内容是否与当前谓语分类匹配

## 修复状态
✅ 已完成修复
✅ 映射关系已验证
✅ 笔记和表格ID已确认存在 