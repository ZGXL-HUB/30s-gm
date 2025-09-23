# 知识点双向联动模块功能说明

## 功能概述

知识点双向联动模块是语法专项练习小程序的核心功能之一，实现了"错题触发专项练习+双图标知识卡片"的智能学习模式。

## 核心功能

### 1. 双功能图标
在做题页面每道题目旁边添加了两个功能按钮：
- **📖 后缀小字典图标**：点击显示后缀识别知识卡片
- **❓ 书写规则图标**：点击显示书写规则知识卡片

### 2. 错题统计与触发
- 自动统计各类语法点的错误次数
- 当某类语法点错误达到3次时，自动弹出确认弹窗
- 用户确认后跳转到对应的专项练习页面

### 3. 知识卡片弹窗
- 后缀知识卡片：展示名词变复数等后缀规则
- 书写规则卡片：展示动词分词等书写规范
- 卡片内提供"进入专项练习"按钮，可直接跳转

### 4. 专项练习页面
- 展示各类语法点的专项练习表格
- 显示用户的学习进度和错误统计
- 提供针对性的练习内容

## 技术实现

### 前端实现

#### 1. 页面结构
```
miniprogram/pages/
├── exercise-page/          # 做题页面(主要功能)
│   ├── index.js           # 逻辑处理
│   ├── index.wxml         # 页面模板
│   └── index.wxss         # 样式文件
└── special-practice/      # 专项练习页面
    ├── index.js           # 逻辑处理
    ├── index.wxml         # 页面模板
    └── index.wxss         # 样式文件
```

#### 2. 核心方法
- `handleWrongQuestion()`: 处理错题统计
- `getQuestionType()`: 获取题目类型
- `confirmSpecialPractice()`: 确认专项练习
- `showSuffixCard()` / `showRuleCard()`: 显示知识卡片
- `goSpecialPractice()`: 跳转专项练习

#### 3. 数据结构
```javascript
data: {
  // 知识点双向联动模块相关
  showSuffixCard: false,    // 后缀知识卡片显示状态
  showRuleCard: false,      // 书写规则卡片显示状态
  errorCounts: {},          // 各语法点错误次数统计
  currentQuestionIndex: 0,  // 当前题目索引
  currentQuestionType: '',  // 当前题目类型
}
```

### 后端实现

#### 1. 云函数
```
cloudfunctions/practiceProgress/
├── index.js               # 云函数主文件
└── package.json           # 依赖配置
```

#### 2. 数据库集合
- `practice_progress`: 存储用户练习进度
  - userId: 用户ID
  - grammarType: 语法点类型
  - progress: 练习进度
  - errorCount: 错误次数
  - createTime: 创建时间
  - updateTime: 更新时间

#### 3. 云函数接口
- `save`: 保存练习进度
- `get`: 获取指定语法点进度
- `getAll`: 获取所有进度
- `getPracticeTables`: 获取专项练习表格列表

## 使用流程

### 1. 做题流程
1. 用户在做题页面答题
2. 提交答案后系统自动判题
3. 错题自动统计到对应语法点
4. 达到3次错误时弹出专项练习提醒

### 2. 知识卡片使用
1. 点击题目旁的📖图标查看后缀知识
2. 点击❓图标查看书写规则
3. 在卡片内点击"进入专项练习"直接跳转

### 3. 专项练习流程
1. 从错题提醒或知识卡片进入专项练习页面
2. 查看该语法点的所有练习表格
3. 选择具体的练习表格开始练习
4. 练习进度自动保存到云端

## 语法点分类

系统支持以下语法点分类：
- `noun-plural`: 名词变复数
- `verb-participle`: 动词分词
- `pronoun`: 代词
- `tense`: 时态
- `voice`: 语态
- `adjective`: 形容词
- `adverb`: 副词
- `preposition`: 介词
- `article`: 冠词
- `conjunction`: 连词

## 配置说明

### 1. 题目分类映射
在 `getQuestionType()` 方法中配置题目分类到语法点的映射关系：

```javascript
const categoryMapping = {
  '名词(1)': 'noun-plural',
  '动词(1)': 'verb-participle',
  // ... 更多映射
};
```

### 2. 专项练习表格配置
在云函数的 `getPracticeTables()` 方法中配置专项练习表格：

```javascript
const practiceTables = [
  {
    id: 1,
    type: "noun-plural",
    name: "名词变复数专项",
    tables: [
      { id: "noun_001", title: "一般情况加s练习", questions: 20 },
      // ... 更多表格
    ]
  }
];
```

## 部署说明

### 1. 云函数部署
```bash
# 进入云函数目录
cd cloudfunctions/practiceProgress

# 安装依赖
npm install

# 上传云函数
# 在微信开发者工具中右键云函数文件夹，选择"上传并部署"
```

### 2. 数据库初始化
在云开发控制台创建 `practice_progress` 集合，设置权限为"所有用户可读，仅创建者可写"。

### 3. 页面注册
确保在 `app.json` 中注册了新页面：
```json
{
  "pages": [
    "pages/special-practice/index"
  ]
}
```

## 注意事项

1. **错误次数统计**：目前只要答案错误就计数，暂未实现"粗心错误过滤"
2. **用户标识**：未登录用户使用 'anonymous' 作为用户ID
3. **网络异常**：云函数调用失败时会降级到本地存储
4. **数据同步**：练习进度会同时保存到本地和云端

## 后续优化

1. **智能推荐**：根据用户学习历史推荐练习内容
2. **进度分析**：提供更详细的学习进度分析
3. **错题过滤**：实现粗心错误的智能过滤
4. **个性化**：根据用户水平调整练习难度 