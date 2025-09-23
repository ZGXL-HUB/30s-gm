const fs = require('fs');

console.log('=== CSS左对齐验证测试 ===\n');

// 检查CSS文件
const cssPath = './miniprogram/pages/exercise-page/index.wxss';
const cssContent = fs.readFileSync(cssPath, 'utf8');

console.log('1. 检查 .note-text 样式:');
const noteTextMatch = cssContent.match(/\.note-text\s*\{[^}]*\}/);
if (noteTextMatch) {
  console.log('✅ 找到 .note-text 样式');
  console.log('样式内容:', noteTextMatch[0]);
  
  if (noteTextMatch[0].includes('text-align: left')) {
    console.log('✅ 已设置 text-align: left');
  } else {
    console.log('❌ 未设置 text-align: left');
  }
} else {
  console.log('❌ 未找到 .note-text 样式');
}

console.log('\n2. 检查响应式样式中的 .note-text:');
const mediaMatch = cssContent.match(/@media[^}]*\.note-text\s*\{[^}]*\}/);
if (mediaMatch) {
  console.log('✅ 找到响应式 .note-text 样式');
  console.log('样式内容:', mediaMatch[0]);
  
  if (mediaMatch[0].includes('text-align: left')) {
    console.log('✅ 响应式样式中已设置 text-align: left');
  } else {
    console.log('❌ 响应式样式中未设置 text-align: left');
  }
} else {
  console.log('❌ 未找到响应式 .note-text 样式');
}

console.log('\n3. 检查是否有其他样式覆盖:');
const centerAlignMatches = cssContent.match(/text-align:\s*center/g);
if (centerAlignMatches) {
  console.log(`⚠️  发现 ${centerAlignMatches.length} 个 text-align: center 设置`);
  console.log('这些可能会影响文本对齐');
} else {
  console.log('✅ 未发现 text-align: center 设置');
}

console.log('\n4. 建议的解决方案:');
console.log('如果CSS设置正确但显示仍有问题，可能的原因:');
console.log('- 数据内容本身包含空格前缀');
console.log('- 其他CSS样式优先级更高');
console.log('- 浏览器缓存问题');
console.log('- 小程序缓存问题');

console.log('\n5. 建议操作:');
console.log('- 清除小程序缓存');
console.log('- 重新编译小程序');
console.log('- 检查数据内容格式');

console.log('\n=== 验证完成 ==='); 