// 分析真正重要的缺失分类
console.log('=== 分析真正重要的缺失分类 ===\n');

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

// 过滤出真正有题目的分类（排除表格和笔记）
const realCategories = Object.keys(backupData).filter(category => {
  const questions = backupData[category];
  return Array.isArray(questions) && questions.length > 0;
});

console.log('📚 本地备份中真正有题目的分类：');
console.log(`总数: ${realCategories.length} 个\n`);

// 找出缺失的重要分类
const missingImportantCategories = [];
const existingImportantCategories = [];

realCategories.forEach(category => {
  if (cloudCategories.includes(category)) {
    existingImportantCategories.push(category);
  } else {
    missingImportantCategories.push(category);
  }
});

console.log('✅ 云数据库中已存在的重要分类：');
console.log(`数量: ${existingImportantCategories.length} 个`);
existingImportantCategories.forEach((cat, index) => {
  const questionCount = backupData[cat] ? backupData[cat].length : 0;
  console.log(`  ${index + 1}. "${cat}" (${questionCount}题)`);
});

console.log('\n❌ 云数据库中缺失的重要分类：');
console.log(`数量: ${missingImportantCategories.length} 个`);
missingImportantCategories.forEach((cat, index) => {
  const questionCount = backupData[cat] ? backupData[cat].length : 0;
  console.log(`  ${index + 1}. "${cat}" (${questionCount}题)`);
});

// 计算缺失的题目总数
const totalMissingQuestions = missingImportantCategories.reduce((total, cat) => {
  return total + (backupData[cat] ? backupData[cat].length : 0);
}, 0);

console.log(`\n📊 重要统计信息：`);
console.log(`本地备份有题目的分类: ${realCategories.length} 个`);
console.log(`云数据库现有分类: ${cloudCategories.length} 个`);
console.log(`缺失重要分类: ${missingImportantCategories.length} 个`);
console.log(`缺失题目总数: ${totalMissingQuestions} 题`);

console.log(`\n🎯 关键发现：`);
console.log(`1. 您选择的10个语法点中，有3个在云数据库中缺失：`);
console.log(`   - "介词 + 名词/动名词" (30题)`);
console.log(`   - "f/fe结尾" (16题)`);
console.log(`   - "副词修饰句子" (29题)`);
console.log(`2. 还有其他重要分类缺失：`);
console.log(`   - "介词综合" (28题)`);
console.log(`   - "固定搭配" (25题)`);
console.log(`   - "谓语(1)" 到 "谓语(9)" (共9个分类，约300题)`);

console.log(`\n💡 建议方案：`);
console.log(`方案1: 上传所有缺失分类 (${totalMissingQuestions}题)`);
console.log(`  ✅ 完全解决命名不匹配问题`);
console.log(`  ✅ 移除所有映射表`);
console.log(`  ✅ 实现100%直接匹配`);
console.log(`  ❌ 需要上传较多数据`);

console.log(`\n方案2: 只上传用户选择的3个分类 (75题)`);
console.log(`  ✅ 解决当前10个语法点的问题`);
console.log(`  ✅ 数据量小，上传快`);
console.log(`  ❌ 其他语法点仍有映射问题`);

console.log(`\n方案3: 保持当前映射表`);
console.log(`  ✅ 无需上传数据`);
console.log(`  ✅ 当前功能正常`);
console.log(`  ❌ 有映射开销，不够优雅`);
