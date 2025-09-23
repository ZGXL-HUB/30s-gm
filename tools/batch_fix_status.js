const fs = require('fs');
const path = require('path');

// 批量修复笔记和表格数据状态的脚本
function batchFixStatus() {
  console.log('🔧 开始批量修复笔记和表格数据状态...');
  
  // 读取数据文件
  const dataPath = path.join(__dirname, '../miniprogram/data/intermediate_questions.js');
  
  try {
    // 读取文件内容
    let content = fs.readFileSync(dataPath, 'utf8');
    
    // 统计修复数量
    let fixedCount = 0;
    
    // 使用正则表达式批量替换所有"已创建"为"已创建"
    const pattern = /"status":\s*"已创建"/g;
    content = content.replace(pattern, (match) => {
      fixedCount++;
      return '"status": "已创建"';
    });
    
    // 写回文件
    fs.writeFileSync(dataPath, content, 'utf8');
    
    console.log(`✅ 批量修复完成！共修复了 ${fixedCount} 个数据项的状态`);
    
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
    console.error('❌ 批量修复失败:', error.message);
  }
}

// 运行批量修复脚本
if (require.main === module) {
  batchFixStatus();
}

module.exports = { batchFixStatus };

