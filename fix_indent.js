// 修复缩进问题的脚本
const fs = require('fs');

try {
  console.log('🔧 开始修复缩进问题...');

  let content = fs.readFileSync('validate_and_upload_questions.js', 'utf8');

  // 修复缩进问题：将所有多余的缩进（3个以上空格）调整为2个空格
  // 但是要小心，不要影响正常的代码结构

  // 查找并修复对象属性行的缩进
  content = content.replace(/^\s{4,}"([^"]+)": /gm, '  "$1": ');

  // 修复对象开始和结束的缩进
  content = content.replace(/^\s{4,}\{\s*$/gm, '  {\n');
  content = content.replace(/^\s{4,}\}\s*,?\s*$/gm, '  },\n');

  fs.writeFileSync('validate_and_upload_questions_fixed.js', content, 'utf8');

  console.log('✅ 缩进修复完成！');
  console.log('📄 修复后的文件已保存为: validate_and_upload_questions_fixed.js');

} catch (error) {
  console.error('❌ 修复失败:', error);
}
