const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复表格文本自动换行问题...');

// 读取CSS文件
const cssPath = path.join(__dirname, 'miniprogram/pages/exercise-page/index.wxss');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// 1. 修复表格单元格样式 - 允许文本自动换行
cssContent = cssContent.replace(
  /\.table-cell\s*{[^}]*}/g,
  `.table-cell {
  flex: 1;
  min-width: 120rpx;
  padding: 16rpx 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1rpx solid #e9ecef;
  font-size: 24rpx;
  text-align: center;
  word-break: break-word;
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;
  overflow: hidden;
  min-height: 60rpx;
  max-width: 100%;
  white-space: normal;
  line-height: 1.4;
}`
);

// 2. 修复表格文本样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.table-text\s*{[^}]*}/g,
  `.table-text {
  font-size: 24rpx;
  color: #333;
  text-align: center;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 3. 修复表格答案样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.table-answer\s*{[^}]*}/g,
  `.table-answer {
  font-size: 28rpx;
  font-weight: bold;
  text-align: center;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 4. 修复问题文本样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.question-text\s*{[^}]*}/g,
  `.question-text {
  font-size: 22rpx;
  color: #333;
  text-align: center;
  font-weight: 500;
  margin-bottom: 4rpx;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 5. 修复表头文本样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.header-text\s*{[^}]*}/g,
  `.header-text {
  font-size: 24rpx;
  font-weight: bold;
  color: white;
  text-align: center;
  word-break: break-word;
  white-space: normal;
  line-height: 1.3;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 6. 修复规则文本样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.rule-text\s*{[^}]*}/g,
  `.rule-text {
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
  word-break: break-word;
  white-space: normal;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 7. 修复单词提示样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.word-hint\s*{[^}]*}/g,
  `.word-hint {
  font-size: 24rpx;
  font-weight: bold;
  color: #1890ff;
  text-align: center;
  margin-bottom: 4rpx;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 8. 修复代词标签样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.pronoun-label\s*{[^}]*}/g,
  `.pronoun-label {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
  text-align: center;
  width: 100%;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 9. 修复语态单词样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.voice-word\s*{[^}]*}/g,
  `.voice-word {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 10. 修复名词文本样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.noun002-text\s*{[^}]*}/g,
  `.noun002-text {
  font-size: 28rpx;
  color: #222;
  font-weight: 500;
  display: inline;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 11. 修复名词003文本样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.noun003-text\s*{[^}]*}/g,
  `.noun003-text {
  font-size: 28rpx;
  color: #222;
  font-weight: 500;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 12. 修复选项文本样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.option-text\s*{[^}]*}/g,
  `.option-text {
  font-size: 26rpx;
  color: #333;
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 13. 修复前缀后缀示例样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.prefix-suffix-examples\s*{[^}]*}/g,
  `.prefix-suffix-examples {
  flex: 2;
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  font-weight: 500;
  min-width: 0;
  word-break: break-word;
  white-space: normal;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 14. 修复比较级规则样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.comparative-rule,\s*\.superlative-rule\s*{[^}]*}/g,
  `.comparative-rule, .superlative-rule {
  flex: 1.2;
  display: flex;
  align-items: center;
  gap: 10rpx;
  cursor: pointer;
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
  min-width: 0;
  word-break: break-word;
  white-space: normal;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 15. 修复副词规则样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.adverb-rule\s*{[^}]*}/g,
  `.adverb-rule {
  flex: 1.2;
  display: flex;
  align-items: center;
  gap: 10rpx;
  cursor: pointer;
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
  min-width: 0;
  word-break: break-word;
  white-space: normal;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 16. 修复时态写作规则样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.tense-writing-rule\s*{[^}]*}/g,
  `.tense-writing-rule {
  flex: 1.2;
  min-width: 120rpx;
  box-sizing: border-box;
  word-break: break-word;
  white-space: normal;
  padding: 12rpx 8rpx;
  color: #1890ff;
  font-size: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.2s ease;
  border-right: 1rpx solid #e9ecef;
  background-color: #f0f5ff;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 17. 修复现在分词规则样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.present-participle-rule\s*{[^}]*}/g,
  `.present-participle-rule {
  width: 33.33%;
  min-width: 100rpx;
  max-width: 40%;
  box-sizing: border-box;
  word-break: break-word;
  white-space: normal;
  padding-right: 8rpx;
  color: #52c41a;
  font-size: 26rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 18. 修复过去分词规则样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.past-participle-rule\s*{[^}]*}/g,
  `.past-participle-rule {
  width: 33.33%;
  min-width: 100rpx;
  max-width: 40%;
  box-sizing: border-box;
  word-break: break-word;
  white-space: normal;
  padding-right: 8rpx;
  color: #fa8c16;
  font-size: 26rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 19. 修复名词004规则样式 - 允许自动换行
cssContent = cssContent.replace(
  /\.noun004-rule\s*{[^}]*}/g,
  `.noun004-rule {
  width: 33.33%;
  min-width: 100rpx;
  max-width: 40%;
  box-sizing: border-box;
  word-break: break-word;
  white-space: normal;
  padding-right: 8rpx;
  color: #faad14;
  font-size: 26rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}`
);

// 20. 移除之前的通用样式规则中的 white-space: nowrap
cssContent = cssContent.replace(
  /\/\* 表格单元格内容溢出处理 \*\/[\s\S]*?\.table-grid\s*{\s*min-width:\s*600rpx;\s*max-width:\s*100%;\s*}/g,
  ''
);

// 21. 添加新的通用样式规则，允许文本自动换行
const newStyles = `
/* 表格文本自动换行处理 */
.table-cell {
  white-space: normal !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  word-wrap: break-word !important;
  line-height: 1.4 !important;
}

.table-cell .table-text,
.table-cell .table-answer,
.table-cell .question-text,
.table-cell .header-text,
.table-cell .rule-text,
.table-cell .word-hint,
.table-cell .pronoun-label,
.table-cell .voice-word,
.table-cell .noun002-text,
.table-cell .noun003-text,
.table-cell .option-text {
  white-space: normal !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  word-wrap: break-word !important;
  line-height: 1.4 !important;
  max-width: 100% !important;
}

/* 表格输入框保持不换行（输入框内容不需要换行） */
.table-input,
.adjective-table-input,
.adverb-input,
.comparative-input,
.superlative-input,
.prefix-suffix-input,
.tense-writing-input,
.voice-writing-input,
.present-participle-input,
.past-participle-input,
.pronoun-input,
.noun004-input {
  max-width: 100% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  box-sizing: border-box !important;
}

/* 表格单元格最小宽度设置 */
.table-cell {
  min-width: 80rpx !important;
  max-width: 100% !important;
}

/* 确保表格行不会因为内容过长而变形 */
.table-row {
  min-height: 60rpx;
  align-items: stretch;
}

/* 表格容器响应式处理 */
.table-container {
  overflow-x: auto;
  max-width: 100%;
}

.table-grid {
  min-width: 600rpx;
  max-width: 100%;
}

/* 表格文本内容自动换行优化 */
.table-text,
.table-answer,
.question-text,
.header-text,
.rule-text,
.word-hint,
.pronoun-label,
.voice-word,
.noun002-text,
.noun003-text,
.option-text,
.prefix-suffix-examples,
.comparative-rule,
.superlative-rule,
.adverb-rule,
.tense-writing-rule,
.present-participle-rule,
.past-participle-rule,
.noun004-rule {
  white-space: normal !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  word-wrap: break-word !important;
  line-height: 1.4 !important;
  max-width: 100% !important;
}
`;

// 在CSS文件末尾添加新的样式
cssContent += newStyles;

// 保存修改后的CSS文件
fs.writeFileSync(cssPath, cssContent, 'utf8');

console.log('✅ 表格文本自动换行修复完成');

// 验证修复结果
console.log('\n🔍 验证修复结果...');

const verificationChecks = [
  { name: '表格单元格', pattern: /\.table-cell\s*{[^}]*white-space:\s*normal[^}]*}/ },
  { name: '表格文本', pattern: /\.table-text\s*{[^}]*white-space:\s*normal[^}]*}/ },
  { name: '表格答案', pattern: /\.table-answer\s*{[^}]*white-space:\s*normal[^}]*}/ },
  { name: '问题文本', pattern: /\.question-text\s*{[^}]*white-space:\s*normal[^}]*}/ },
  { name: '表头文本', pattern: /\.header-text\s*{[^}]*white-space:\s*normal[^}]*}/ },
  { name: '规则文本', pattern: /\.rule-text\s*{[^}]*white-space:\s*normal[^}]*}/ },
  { name: '通用样式规则', pattern: /\.table-cell\s*{\s*white-space:\s*normal\s*!important[^}]*}/ }
];

let passedChecks = 0;
verificationChecks.forEach(check => {
  if (check.pattern.test(cssContent)) {
    console.log(`  ✅ ${check.name} - 修复成功`);
    passedChecks++;
  } else {
    console.log(`  ❌ ${check.name} - 修复失败`);
  }
});

console.log(`\n📊 验证结果: ${passedChecks}/${verificationChecks.length} 项修复成功`);

if (passedChecks === verificationChecks.length) {
  console.log('\n🎉 所有表格文本自动换行问题已修复！');
} else {
  console.log('\n⚠️  部分修复失败，请手动检查');
}

console.log('\n📝 修复内容总结:');
console.log('  1. 移除了所有表格文本的 white-space: nowrap 限制');
console.log('  2. 添加了 white-space: normal 允许自动换行');
console.log('  3. 设置了 word-break: break-word 和 overflow-wrap: break-word');
console.log('  4. 优化了 line-height 提高可读性');
console.log('  5. 保持输入框不换行（输入框内容不需要换行）');
console.log('  6. 确保所有表格文本都能根据列宽自动换行');

console.log('\n✨ 表格文本自动换行修复完成！'); 