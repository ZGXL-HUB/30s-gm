# 直播课习题存储说明

## 第一课习题（当前使用）

**文件路径：** `miniprogram/data/liveLesson1Exercises.js`

修改此文件即可更新**第1课**各环节题目，提高题目质量。无需改其他页面逻辑。

### 文件结构说明

| 变量名 | 环节 | 题量 | 格式说明 |
|--------|------|------|----------|
| `PRE_TEST` | 课前·真题检测 | 6道 | 改错题以选择题形式：`{ text, option: ['A项','B项',...], answer: '正确选项原文', analysis, tag }` |
| `KEYWORD_CHOICE` | 课中·关键词识别（选择题） | 8道 | 同上，option 与 answer 必须完全一致 |
| `KEYWORD_FEEDBACK` | 课中·关键词识别（调研题） | 2道 | `type: 'feedback'`，option 为选项数组，answer 可为空 |
| `FILL_RULE` | 课中·填空运用规则 | 10道 | `{ text: '题干含______', blanks: ['答案'] }`，一空一题则 blanks 长度为 1 |
| `FILL_REAL` | 课中·真题填空 | 5道 | 同上 |
| `TRANSLATION_CORE` | 课中·翻译题（核心句） | 5句 | `{ zh: '中文', en: '英文' }` |
| `TRANSLATION_EXTRA` | 课中·翻译题（加练） | 2句 | 同上 |
| `TRANSLATION_ALL` | 合并 | 7句 | 核心+加练，小程序随机抽一句，加练时也从 7 句中抽 |

### 格式注意

- **选择题**：`answer` 必须与 `option` 中某一项**逐字相同**，否则判错。
- **填空题**：`blanks` 为数组，一题多空则多个元素；判题时按顺序比对（已做 trim、小写处理）。
- **翻译题**：判题会做宽松匹配（去空格、忽略大小写、标点统一），可酌情在 `liveService.matchTranslation` 中扩展同义表达。

### 其他课（第2–14课）

- 当前未配置专属习题时，会走**云题库**（按 `config/liveActivityConfig.js` 中该课的 `grammarPoint` 拉题）或 **liveService 内兜底题**。
- 若需为第2课、第3课等也做专属题，可新增 `liveLesson2Exercises.js`、`liveLesson3Exercises.js`，并在 `miniprogram/utils/liveService.js` 中按 `activityId === 'lesson2'` 等分支加载对应文件（逻辑与 lesson1 一致）。

## 活动与环节配置（题量、环节名等）

**文件路径：** `miniprogram/config/liveActivityConfig.js`

- 每课的 `grammarPoint`、`segments[].limit`、`segments[].sentences`（翻译默认句）在此配置。
- 第1课因使用 `liveLesson1Exercises.js`，其翻译句以习题文件中的 `TRANSLATION_ALL` 为准，此处 sentences 仅对未配置专属翻译的课生效。

## 小结

| 想改的内容 | 编辑文件 |
|------------|----------|
| 第1课 课前检测/关键词/填空/真题填空/翻译 题目 | `miniprogram/data/liveLesson1Exercises.js` |
| 第1课 环节数量、名称、默认题量、语法点 | `miniprogram/config/liveActivityConfig.js` |
| 判题规则（如翻译同义、填空忽略大小写） | `miniprogram/utils/liveService.js` |
