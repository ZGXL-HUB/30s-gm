const fs = require('fs');

// 读取清理后的数据文件
const data = require('./intermediate_questions_cleaned.js');

console.log('=== 分析"动词综合"子类重复内容 ===');

// 获取"动词综合"子类
const verbComprehensive = data['动词综合'];
if (!verbComprehensive) {
  console.log('未找到"动词综合"子类');
  process.exit(1);
}

console.log(`"动词综合"子类共有 ${verbComprehensive.length} 题`);

// 找出所有与动词相关的子类
const verbRelatedCategories = [];
for (const [categoryName, questions] of Object.entries(data)) {
  if (categoryName.includes('谓语') || 
      categoryName.includes('非谓语') || 
      categoryName.includes('动词') ||
      categoryName.includes('被动') ||
      categoryName.includes('时态')) {
    if (categoryName !== '动词综合') {
      verbRelatedCategories.push(categoryName);
    }
  }
}

console.log('\n相关的动词子类:');
verbRelatedCategories.forEach(cat => console.log(`  - ${cat}`));

// 分析重复情况
const duplicateAnalysis = {};

for (const verbQuestion of verbComprehensive) {
  // 检查题目对象是否有效
  if (!verbQuestion || !verbQuestion.text || !verbQuestion.answer) {
    console.log('跳过无效题目对象:', verbQuestion);
    continue;
  }
  
  const duplicates = [];
  
  for (const category of verbRelatedCategories) {
    const categoryQuestions = data[category];
    if (!Array.isArray(categoryQuestions)) continue;
    
    for (const otherQuestion of categoryQuestions) {
      // 检查其他题目对象是否有效
      if (!otherQuestion || !otherQuestion.text || !otherQuestion.answer) {
        continue;
      }
      
      // 比较题目文本和答案
      if (verbQuestion.text === otherQuestion.text && 
          verbQuestion.answer === otherQuestion.answer) {
        duplicates.push({
          category: category,
          question: otherQuestion
        });
        break; // 找到一个重复就跳出内层循环
      }
    }
  }
  
  if (duplicates.length > 0) {
    duplicateAnalysis[verbQuestion.text] = {
      verbComprehensiveQuestion: verbQuestion,
      duplicates: duplicates
    };
  }
}

// 统计重复情况
const duplicateStats = {};
let totalDuplicates = 0;

for (const [questionText, dupInfo] of Object.entries(duplicateAnalysis)) {
  for (const dup of dupInfo.duplicates) {
    if (!duplicateStats[dup.category]) {
      duplicateStats[dup.category] = 0;
    }
    duplicateStats[dup.category]++;
    totalDuplicates++;
  }
}

console.log('\n=== 重复内容统计 ===');
console.log(`总重复题目数: ${totalDuplicates}`);
console.log(`重复率: ${((totalDuplicates / verbComprehensive.length) * 100).toFixed(2)}%`);

console.log('\n各子类重复数量:');
Object.entries(duplicateStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([category, count]) => {
    console.log(`  ${category}: ${count}题`);
  });

// 保存详细分析结果
const result = {
  timestamp: new Date().toISOString(),
  verbComprehensiveTotal: verbComprehensive.length,
  duplicateStats: duplicateStats,
  totalDuplicates: totalDuplicates,
  duplicateRate: (totalDuplicates / verbComprehensive.length * 100).toFixed(2),
  detailedDuplicates: duplicateAnalysis
};

fs.writeFileSync('verb_comprehensive_duplicates_analysis.json', JSON.stringify(result, null, 2), 'utf8');
console.log('\n详细分析结果已保存到 verb_comprehensive_duplicates_analysis.json');

// 显示一些重复题目的例子
console.log('\n=== 重复题目示例 ===');
let exampleCount = 0;
for (const [questionText, dupInfo] of Object.entries(duplicateAnalysis)) {
  if (exampleCount >= 5) break;
  
  console.log(`\n题目: ${questionText.substring(0, 50)}...`);
  console.log(`答案: ${dupInfo.verbComprehensiveQuestion.answer}`);
  console.log(`重复于: ${dupInfo.duplicates.map(d => d.category).join(', ')}`);
  exampleCount++;
}

console.log('\n=== 分析完成 ===');
