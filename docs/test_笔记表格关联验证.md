# 笔记表格关联功能测试验证

## 测试目标
验证谓语（1）到（9）下方的两个按钮和笔记表格一一关联的功能是否正常工作。

## 修改内容总结

### 1. 修复了questions.js文件中的语法错误
- 移除了多余的逗号
- 修复了JSON格式错误

### 2. 前端代码修改

#### 2.1 数据结构增强
- 添加了 `currentNoteData`：当前显示的笔记数据
- 添加了 `currentTableIds`：当前关联的表格ID列表
- 添加了 `currentGrammarType`：当前语法类型

#### 2.2 核心方法修改
- `showSuffixCard(e)`：显示后缀知识卡片，支持传递题目索引
- `showRuleCard(e)`：显示书写规则卡片，支持传递题目索引
- `getStandardizedQuestionType(question)`：获取标准化的题目类型
- `getNoteDataByQuestionType(questionType)`：根据题目类型获取笔记数据
- `getTableIdsByQuestionType(questionType)`：根据题目类型获取表格ID列表

#### 2.3 题目类型映射
```javascript
const typeMapping = {
  '名词': 'noun-plural',
  '代词': 'pronoun',
  '动词': 'verb-tense',
  '时态': 'verb-tense',
  '一般将来时': 'future-simple',
  '现在进行时': 'present-continuous',
  '过去进行时': 'past-continuous',
  '现在完成时': 'present-perfect',
  '过去完成时': 'past-perfect',
  '被动语态': 'passive-voice',
  '语态': 'passive-voice',
};
```

#### 2.4 笔记和表格映射
```javascript
// 笔记映射
const noteMapping = {
  'noun-plural': 'tense_note_001',
  'verb-tense': 'tense_note_002',
  'pronoun': 'tense_note_003',
  'future-simple': 'tense_note_004',
  'present-continuous': 'tense_note_005',
  'past-continuous': 'tense_note_006',
  'present-perfect': 'tense_note_007',
  'past-perfect': 'tense_note_008',
  'passive-voice': 'voice_note_001',
};

// 表格映射
const tableMapping = {
  'noun-plural': ['tense_table_001'],
  'verb-tense': ['tense_table_002'],
  'pronoun': ['tense_table_003'],
  'future-simple': ['tense_table_004'],
  'present-continuous': ['tense_table_005'],
  'past-continuous': ['tense_table_006'],
  'present-perfect': ['tense_table_007'],
  'past-perfect': ['tense_table_008'],
  'passive-voice': ['voice_table_001'],
};
```

#### 2.5 WXML模板修改
- 知识卡片标题动态显示：`{{currentNoteData.frontendName || '语法知识卡'}}`
- 知识卡片内容动态显示：`{{currentNoteData.content}}`
- 按钮文本统一为："进入专项练习表格"

## 测试步骤

### 1. 基础功能测试
1. 打开语法专项练习页面
2. 检查页面是否正常加载
3. 验证笔记和表格数据是否正确加载

### 2. 知识卡片显示测试
1. 点击任意题目旁的📖按钮
2. 检查知识卡片是否正确弹出
3. 验证卡片标题是否为对应语法点的名称
4. 验证卡片内容是否为对应的笔记内容

### 3. 题目类型识别测试
1. 选择不同类型的题目（名词、代词、时态等）
2. 点击知识卡片按钮
3. 验证是否正确识别题目类型
4. 验证是否正确显示对应的笔记内容

### 4. 表格跳转测试
1. 在知识卡片中点击"进入专项练习表格"按钮
2. 检查是否正确跳转到对应的表格页面
3. 验证表格内容是否为对应的练习内容

### 5. 动态关联测试
1. 在不同题目间切换
2. 点击知识卡片按钮
3. 验证每次显示的内容是否正确对应当前题目

## 预期结果

### 成功标准
- [ ] 知识卡片能够正确显示对应语法点的笔记内容
- [ ] 知识卡片标题显示正确的语法点名称
- [ ] 点击"进入专项练习表格"能够正确跳转
- [ ] 不同题目类型能够正确映射到对应的笔记和表格
- [ ] 页面加载时笔记和表格数据正确加载

### 错误处理
- [ ] 当没有对应笔记数据时，显示默认内容
- [ ] 当跳转失败时，显示错误提示
- [ ] 当题目类型无法识别时，使用默认映射

## 测试数据

### 测试题目类型
1. 名词复数题目 → 应显示 tense_note_001 和 tense_table_001
2. 代词题目 → 应显示 tense_note_003 和 tense_table_003
3. 时态题目 → 应显示对应的时态笔记和表格
4. 被动语态题目 → 应显示 voice_note_001 和 voice_table_001

### 验证要点
- 笔记内容是否正确显示
- 表格跳转是否正确
- 题目类型识别是否准确
- 动态切换是否正常

## 问题排查

### 常见问题
1. 笔记数据未加载：检查 loadNotesAndTablesData 方法
2. 题目类型识别错误：检查 getStandardizedQuestionType 方法
3. 跳转失败：检查 goSuffixTable 和 goRuleTable 方法
4. 卡片内容为空：检查 getNoteDataByQuestionType 方法

### 调试方法
1. 查看控制台日志输出
2. 检查 data 中的数据状态
3. 验证映射关系是否正确
4. 确认数据源是否完整 