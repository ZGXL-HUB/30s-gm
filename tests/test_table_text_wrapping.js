const fs = require('fs');
const path = require('path');

console.log('🧪 测试表格文本自动换行修复效果...');

// 读取CSS文件
const cssPath = path.join(__dirname, 'miniprogram/pages/exercise-page/index.wxss');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// 测试项目
const testItems = [
  {
    name: '表格单元格',
    selector: '.table-cell',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '表格文本',
    selector: '.table-text',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '表格答案',
    selector: '.table-answer',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '问题文本',
    selector: '.question-text',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '表头文本',
    selector: '.header-text',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.3']
  },
  {
    name: '规则文本',
    selector: '.rule-text',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '单词提示',
    selector: '.word-hint',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '代词标签',
    selector: '.pronoun-label',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '语态单词',
    selector: '.voice-word',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '名词文本',
    selector: '.noun002-text',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '名词003文本',
    selector: '.noun003-text',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '选项文本',
    selector: '.option-text',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '前缀后缀示例',
    selector: '.prefix-suffix-examples',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '比较级规则',
    selector: '.comparative-rule, .superlative-rule',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '副词规则',
    selector: '.adverb-rule',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '时态写作规则',
    selector: '.tense-writing-rule',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '现在分词规则',
    selector: '.present-participle-rule',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '过去分词规则',
    selector: '.past-participle-rule',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  },
  {
    name: '名词004规则',
    selector: '.noun004-rule',
    requiredProps: ['white-space: normal', 'word-break: break-word', 'overflow-wrap: break-word', 'line-height: 1.4']
  }
];

let passedTests = 0;
let totalTests = 0;

console.log('\n📋 测试结果:');

testItems.forEach(item => {
  totalTests++;
  
  // 查找选择器的样式规则
  const selectorRegex = new RegExp(`${item.selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*{[^}]*}`, 'g');
  const matches = cssContent.match(selectorRegex);
  
  if (!matches || matches.length === 0) {
    console.log(`  ❌ ${item.name} - 未找到样式规则`);
    return;
  }
  
  // 检查每个匹配的样式规则
  let allPropsFound = true;
  const foundProps = [];
  
  item.requiredProps.forEach(prop => {
    const propFound = matches.some(match => match.includes(prop));
    if (propFound) {
      foundProps.push(prop);
    } else {
      allPropsFound = false;
    }
  });
  
  if (allPropsFound) {
    console.log(`  ✅ ${item.name} - 所有必需属性已设置`);
    console.log(`     找到属性: ${foundProps.join(', ')}`);
    passedTests++;
  } else {
    console.log(`  ❌ ${item.name} - 缺少必需属性`);
    console.log(`     找到属性: ${foundProps.join(', ')}`);
    console.log(`     缺少属性: ${item.requiredProps.filter(prop => !foundProps.includes(prop)).join(', ')}`);
  }
});

// 检查通用样式规则
console.log('\n🔍 检查通用样式规则:');

const generalStyles = [
  '/* 表格文本自动换行处理 */',
  '.table-cell {',
  'white-space: normal !important;',
  'word-break: break-word !important;',
  'overflow-wrap: break-word !important;',
  'word-wrap: break-word !important;',
  'line-height: 1.4 !important;',
  '}',
  '/* 表格输入框保持不换行（输入框内容不需要换行） */',
  '.table-input,',
  '.adjective-table-input,',
  '.adverb-input,',
  '.comparative-input,',
  '.superlative-input,',
  '.prefix-suffix-input,',
  '.tense-writing-input,',
  '.voice-writing-input,',
  '.present-participle-input,',
  '.past-participle-input,',
  '.pronoun-input,',
  '.noun004-input {',
  'white-space: nowrap !important;',
  '}',
  '/* 表格文本内容自动换行优化 */',
  '.table-text,',
  '.table-answer,',
  '.question-text,',
  '.header-text,',
  '.rule-text,',
  '.word-hint,',
  '.pronoun-label,',
  '.voice-word,',
  '.noun002-text,',
  '.noun003-text,',
  '.option-text,',
  '.prefix-suffix-examples,',
  '.comparative-rule,',
  '.superlative-rule,',
  '.adverb-rule,',
  '.tense-writing-rule,',
  '.present-participle-rule,',
  '.past-participle-rule,',
  '.noun004-rule {',
  'white-space: normal !important;',
  'word-break: break-word !important;',
  'overflow-wrap: break-word !important;',
  'word-wrap: break-word !important;',
  'line-height: 1.4 !important;',
  'max-width: 100% !important;',
  '}'
];

let generalStylesFound = 0;
generalStyles.forEach(style => {
  if (cssContent.includes(style)) {
    generalStylesFound++;
  }
});

if (generalStylesFound === generalStyles.length) {
  console.log('  ✅ 所有通用样式规则都已正确添加');
} else {
  console.log(`  ⚠️  找到 ${generalStylesFound}/${generalStyles.length} 个通用样式规则`);
}

// 检查是否还有 white-space: nowrap 在表格文本中
console.log('\n🔍 检查是否还有不正确的 white-space: nowrap:');

const nowrapCheck = [
  { name: '表格单元格', pattern: /\.table-cell\s*{[^}]*white-space:\s*nowrap[^}]*}/ },
  { name: '表格文本', pattern: /\.table-text\s*{[^}]*white-space:\s*nowrap[^}]*}/ },
  { name: '表格答案', pattern: /\.table-answer\s*{[^}]*white-space:\s*nowrap[^}]*}/ },
  { name: '问题文本', pattern: /\.question-text\s*{[^}]*white-space:\s*nowrap[^}]*}/ },
  { name: '表头文本', pattern: /\.header-text\s*{[^}]*white-space:\s*nowrap[^}]*}/ },
  { name: '规则文本', pattern: /\.rule-text\s*{[^}]*white-space:\s*nowrap[^}]*}/ }
];

let nowrapIssues = 0;
nowrapCheck.forEach(check => {
  if (check.pattern.test(cssContent)) {
    console.log(`  ⚠️  ${check.name} - 仍包含 white-space: nowrap`);
    nowrapIssues++;
  } else {
    console.log(`  ✅ ${check.name} - 已移除 white-space: nowrap`);
  }
});

// 统计结果
console.log('\n📊 测试统计:');
console.log(`  - 总测试数: ${totalTests}`);
console.log(`  - 通过测试: ${passedTests}`);
console.log(`  - 失败测试: ${totalTests - passedTests}`);
console.log(`  - 通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log(`  - 通用样式规则: ${generalStylesFound}/${generalStyles.length}`);
console.log(`  - 不正确的 nowrap: ${nowrapIssues} 个`);

if (passedTests === totalTests && generalStylesFound === generalStyles.length && nowrapIssues === 0) {
  console.log('\n🎉 所有测试通过！表格文本自动换行修复成功！');
} else {
  console.log('\n⚠️  部分测试失败，请检查修复效果');
}

console.log('\n📝 修复效果说明:');
console.log('  1. 所有表格文本现在都支持自动换行');
console.log('  2. 使用 white-space: normal 允许文本换行');
console.log('  3. 设置 word-break: break-word 和 overflow-wrap: break-word 优化换行');
console.log('  4. 优化了 line-height 提高可读性');
console.log('  5. 保持输入框不换行（输入框内容不需要换行）');
console.log('  6. 确保所有表格文本都能根据列宽自动换行');
console.log('  7. 使用 !important 确保样式优先级');

console.log('\n✨ 测试完成！'); 