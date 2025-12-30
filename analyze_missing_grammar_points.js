// 分析缺失的语法点
console.log('=== 分析缺失的语法点 ===\n');

// 从本地备份读取所有语法点
const backupData = require('./backup/intermediate_questions_before_migration.js');

// 云数据库中的54个分类
const cloudCategories = [
  "a和an", "how", "it相关", "s/sh/ch/x结尾", "that能填吗", "the的特殊用法", "when", "where", 
  "which和when/where混淆", "whose", "who和which选哪个", "why", "不定式综合", "主从句与动词", 
  "人称代词", "从属连词综合", "代词综合", "以o结尾", "以y结尾", "关系代词", "冠词综合", 
  "副词修饰动词", "副词修饰形容词/副词", "副词综合", "动词综合", "反身代词", 
  "名词复数书写综合", "名词综合", "完成时", "定语从句综合", "并列句与动词", "并列连词综合", 
  "形容词综合", "插入语与动词", "时态综合", "最高级", "比较级", "泛指与特指", "物主代词", 
  "状语从句综合", "现在分词综合", "现在时", "综合练习", "被动写be吗", "被动语态", "谓语综合", 
  "过去分词综合", "过去时", "进行时", "连词与动词", "连词与名/动/形/副综合", "连词与名词", 
  "连词与形容词", "非谓语综合"
];

console.log('📚 本地备份中的语法点：');
const localCategories = Object.keys(backupData);
console.log(`总数: ${localCategories.length} 个\n`);

// 找出缺失的分类
const missingCategories = [];
const existingCategories = [];

localCategories.forEach(category => {
  if (cloudCategories.includes(category)) {
    existingCategories.push(category);
  } else {
    missingCategories.push(category);
  }
});

console.log('✅ 云数据库中已存在的分类：');
console.log(`数量: ${existingCategories.length} 个`);
existingCategories.forEach((cat, index) => {
  const questionCount = backupData[cat] ? backupData[cat].length : 0;
  console.log(`  ${index + 1}. "${cat}" (${questionCount}题)`);
});

console.log('\n❌ 云数据库中缺失的分类：');
console.log(`数量: ${missingCategories.length} 个`);
missingCategories.forEach((cat, index) => {
  const questionCount = backupData[cat] ? backupData[cat].length : 0;
  console.log(`  ${index + 1}. "${cat}" (${questionCount}题)`);
});

// 计算缺失的题目总数
const totalMissingQuestions = missingCategories.reduce((total, cat) => {
  return total + (backupData[cat] ? backupData[cat].length : 0);
}, 0);

console.log(`\n📊 统计信息：`);
console.log(`本地备份总分类: ${localCategories.length} 个`);
console.log(`云数据库现有分类: ${cloudCategories.length} 个`);
console.log(`缺失分类: ${missingCategories.length} 个`);
console.log(`缺失题目总数: ${totalMissingQuestions} 题`);

console.log(`\n🎯 建议：`);
if (missingCategories.length > 0) {
  console.log(`1. 上传缺失的 ${missingCategories.length} 个分类到云数据库`);
  console.log(`2. 这样可以完全移除映射表，实现直接匹配`);
  console.log(`3. 提升查询性能，避免映射开销`);
  console.log(`4. 确保界面和数据库完全一致`);
} else {
  console.log(`✅ 所有分类都已存在，无需上传`);
}
