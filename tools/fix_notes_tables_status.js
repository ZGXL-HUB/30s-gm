const fs = require('fs');
const path = require('path');

// 修复笔记和表格数据状态的脚本
function fixNotesTablesStatus() {
  console.log('🔧 开始修复笔记和表格数据状态...');
  
  // 读取数据文件
  const dataPath = path.join(__dirname, '../miniprogram/data/intermediate_questions.js');
  
  try {
    // 读取文件内容
    let content = fs.readFileSync(dataPath, 'utf8');
    
    // 统计修复数量
    let fixedCount = 0;
    
    // 修复笔记数据状态
    const notePattern = /("(?:tense|voice|noun|pronoun|preposition|comparative|superlative|participle|adverb|article)_note_\d+":\s*{[^}]*"status":\s*)"已创建"/g;
    content = content.replace(notePattern, (match, prefix) => {
      fixedCount++;
      console.log(`修复笔记状态: ${match.match(/"([^"]+)":/)[1]}`);
      return prefix + '"已创建"';
    });
    
    // 修复表格数据状态
    const tablePattern = /("(?:tense|voice|noun|pronoun|preposition|comparative|superlative|participle|adverb|article)_table_\d+":\s*{[^}]*"status":\s*)"已创建"/g;
    content = content.replace(tablePattern, (match, prefix) => {
      fixedCount++;
      console.log(`修复表格状态: ${match.match(/"([^"]+)":/)[1]}`);
      return prefix + '"已创建"';
    });
    
    // 写回文件
    fs.writeFileSync(dataPath, content, 'utf8');
    
    console.log(`✅ 修复完成！共修复了 ${fixedCount} 个数据项的状态`);
    
    // 验证修复结果
    const verifyContent = fs.readFileSync(dataPath, 'utf8');
    const remainingPending = (verifyContent.match(/"status":\s*"已创建"/g) || []).length;
    console.log(`📊 验证结果：剩余 "已创建" 状态的数据项：${remainingPending} 个`);
    
    if (remainingPending > 0) {
      console.log('⚠️  仍有部分数据状态为"已创建"，可能需要手动检查');
    } else {
      console.log('🎉 所有笔记和表格数据状态已修复为"已创建"');
    }
    
  } catch (error) {
    console.error('❌ 修复失败:', error.message);
  }
}

// 运行修复脚本
if (require.main === module) {
  fixNotesTablesStatus();
}

module.exports = { fixNotesTablesStatus };

