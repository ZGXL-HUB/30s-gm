// 分析备份数据结构
const fs = require('fs');

try {
  console.log('=== 分析本地备份题库 ===\n');
  
  const data = require('./backup/intermediate_questions_before_migration.js');
  const keys = Object.keys(data);
  
  console.log('📊 题库统计:');
  console.log(`   分类数量: ${keys.length}`);
  
  let total = 0;
  keys.forEach(k => {
    if (Array.isArray(data[k])) {
      total += data[k].length;
    }
  });
  
  console.log(`   总题目数: ${total}\n`);
  
  console.log('📋 所有分类列表:');
  keys.forEach((k, i) => {
    const count = Array.isArray(data[k]) ? data[k].length : 0;
    console.log(`   ${i + 1}. "${k}": ${count}题`);
  });
  
  console.log('\n✅ 本地有完整的题库数据！');
  console.log('   建议：将这些数据重新上传到云数据库\n');
  
} catch (error) {
  console.error('❌ 分析失败:', error.message);
}

