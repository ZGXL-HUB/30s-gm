const fs = require('fs');

// 读取分析结果
const analysis = JSON.parse(fs.readFileSync('comprehensive_duplicates_analysis.json', 'utf8'));

// 读取原始数据
const data = require('./backup/local_questions_backup/intermediate_questions.js');

console.log('=== 开始删除完全重复的"XX综合"子类 ===');

// 找出完全重复的"XX综合"子类
const fullyDuplicateCategories = [];
for (const [compCategory, compAnalysis] of Object.entries(analysis.duplicateAnalysis)) {
  let totalDuplicates = 0;
  for (const dupInfo of Object.values(compAnalysis.duplicates)) {
    totalDuplicates += dupInfo.count;
  }
  
  if (totalDuplicates === compAnalysis.totalQuestions) {
    fullyDuplicateCategories.push({
      category: compCategory,
      totalQuestions: compAnalysis.totalQuestions,
      duplicateWith: Object.keys(compAnalysis.duplicates)
    });
  }
}

console.log(`找到 ${fullyDuplicateCategories.length} 个完全重复的"XX综合"子类:`);
fullyDuplicateCategories.forEach(item => {
  console.log(`  ${item.category}: 共${item.totalQuestions}题，与以下子类完全重复:`);
  item.duplicateWith.forEach(cat => console.log(`    - ${cat}`));
});

// 创建备份
const backupData = { ...data };
fs.writeFileSync(`backup_before_removal_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`, JSON.stringify(backupData, null, 2), 'utf8');
console.log('\n已创建备份文件');

// 删除完全重复的"XX综合"子类
let removedCount = 0;
for (const item of fullyDuplicateCategories) {
  if (data[item.category]) {
    delete data[item.category];
    removedCount++;
    console.log(`已删除: ${item.category}`);
  }
}

console.log(`\n总共删除了 ${removedCount} 个完全重复的"XX综合"子类`);

// 保存清理后的数据
fs.writeFileSync('intermediate_questions_cleaned.js', `const questions = ${JSON.stringify(data, null, 2)};\n\nmodule.exports = questions;`, 'utf8');
console.log('清理后的数据已保存到 intermediate_questions_cleaned.js');

// 生成清理报告
const cleanupReport = {
  timestamp: new Date().toISOString(),
  removedCategories: fullyDuplicateCategories,
  totalRemoved: removedCount,
  remainingComprehensiveCategories: Object.keys(data).filter(name => name.includes('综合'))
};

fs.writeFileSync('cleanup_report.json', JSON.stringify(cleanupReport, null, 2), 'utf8');
console.log('清理报告已保存到 cleanup_report.json');

console.log('\n=== 清理完成 ===');
console.log('剩余"XX综合"子类:');
cleanupReport.remainingComprehensiveCategories.forEach(cat => {
  console.log(`  - ${cat}`);
});
