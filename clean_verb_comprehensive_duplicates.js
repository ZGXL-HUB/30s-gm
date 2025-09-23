const fs = require('fs');

// 读取分析结果
const analysis = JSON.parse(fs.readFileSync('verb_comprehensive_duplicates_analysis.json', 'utf8'));

// 读取清理后的数据
const data = require('./intermediate_questions_cleaned.js');

console.log('=== 开始清理"动词综合"子类重复题目 ===');

// 获取"动词综合"子类
const verbComprehensive = data['动词综合'];
if (!verbComprehensive) {
  console.log('未找到"动词综合"子类');
  process.exit(1);
}

console.log(`原始"动词综合"子类题目数: ${verbComprehensive.length}`);

// 找出所有重复的题目
const duplicateQuestions = new Set();
for (const [questionText, dupInfo] of Object.entries(analysis.detailedDuplicates)) {
  duplicateQuestions.add(questionText);
}

console.log(`发现重复题目数: ${duplicateQuestions.size}`);

// 创建备份
const backupData = { ...data };
fs.writeFileSync(`backup_before_verb_cleanup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`, JSON.stringify(backupData, null, 2), 'utf8');
console.log('\n已创建备份文件');

// 过滤掉重复的题目
const cleanedVerbComprehensive = verbComprehensive.filter(question => {
  if (!question || !question.text) return false;
  return !duplicateQuestions.has(question.text);
});

console.log(`清理后"动词综合"子类题目数: ${cleanedVerbComprehensive.length}`);
console.log(`删除重复题目数: ${verbComprehensive.length - cleanedVerbComprehensive.length}`);

// 更新数据
data['动词综合'] = cleanedVerbComprehensive;

// 保存清理后的数据
fs.writeFileSync('intermediate_questions_verb_cleaned.js', `const questions = ${JSON.stringify(data, null, 2)};\n\nmodule.exports = questions;`, 'utf8');
console.log('\n清理后的数据已保存到 intermediate_questions_verb_cleaned.js');

// 生成清理报告
const cleanupReport = {
  timestamp: new Date().toISOString(),
  originalCount: verbComprehensive.length,
  duplicateCount: duplicateQuestions.size,
  cleanedCount: cleanedVerbComprehensive.length,
  removedCount: verbComprehensive.length - cleanedVerbComprehensive.length,
  duplicateRate: analysis.duplicateRate,
  duplicateStats: analysis.duplicateStats,
  remainingQuestions: cleanedVerbComprehensive.map(q => ({
    text: q.text.substring(0, 50) + '...',
    answer: q.answer,
    category: q.category
  }))
};

fs.writeFileSync('verb_comprehensive_cleanup_report.json', JSON.stringify(cleanupReport, null, 2), 'utf8');
console.log('清理报告已保存到 verb_comprehensive_cleanup_report.json');

console.log('\n=== 清理完成 ===');
console.log('剩余"动词综合"题目示例:');
cleanupReport.remainingQuestions.slice(0, 5).forEach((q, index) => {
  console.log(`  ${index + 1}. ${q.text}`);
  console.log(`     答案: ${q.answer}`);
});

console.log(`\n总共保留了 ${cleanedVerbComprehensive.length} 道独特的题目`);
