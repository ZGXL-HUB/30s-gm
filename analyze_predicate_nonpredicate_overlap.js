const fs = require('fs');

// 读取清理后的数据文件
const data = require('./intermediate_questions_verb_cleaned.js');

console.log('=== 分析"谓语(1)"和"非谓语综合"重合情况 ===');

// 获取两个子类
const predicate1 = data['谓语(1)'];
const nonPredicateComprehensive = data['非谓语综合'];

if (!predicate1) {
  console.log('未找到"谓语(1)"子类');
  process.exit(1);
}

if (!nonPredicateComprehensive) {
  console.log('未找到"非谓语综合"子类');
  process.exit(1);
}

console.log(`"谓语(1)"子类共有 ${predicate1.length} 题`);
console.log(`"非谓语综合"子类共有 ${nonPredicateComprehensive.length} 题`);

// 分析重合情况
const overlapAnalysis = {
  predicate1ToNonPredicate: [],
  nonPredicateToPredicate1: [],
  totalOverlap: 0
};

// 检查"谓语(1)"中与"非谓语综合"重复的题目
for (const predQuestion of predicate1) {
  if (!predQuestion || !predQuestion.text || !predQuestion.answer) continue;
  
  for (const nonPredQuestion of nonPredicateComprehensive) {
    if (!nonPredQuestion || !nonPredQuestion.text || !nonPredQuestion.answer) continue;
    
    if (predQuestion.text === nonPredQuestion.text && 
        predQuestion.answer === nonPredQuestion.answer) {
      overlapAnalysis.predicate1ToNonPredicate.push({
        question: predQuestion,
        duplicateIn: nonPredQuestion
      });
      break;
    }
  }
}

// 检查"非谓语综合"中与"谓语(1)"重复的题目
for (const nonPredQuestion of nonPredicateComprehensive) {
  if (!nonPredQuestion || !nonPredQuestion.text || !nonPredQuestion.answer) continue;
  
  for (const predQuestion of predicate1) {
    if (!predQuestion || !predQuestion.text || !predQuestion.answer) continue;
    
    if (nonPredQuestion.text === predQuestion.text && 
        nonPredQuestion.answer === predQuestion.answer) {
      overlapAnalysis.nonPredicateToPredicate1.push({
        question: nonPredQuestion,
        duplicateIn: predQuestion
      });
      break;
    }
  }
}

// 计算总重合数（应该相等）
overlapAnalysis.totalOverlap = overlapAnalysis.predicate1ToNonPredicate.length;

console.log('\n=== 重合情况统计 ===');
console.log(`总重合题目数: ${overlapAnalysis.totalOverlap}`);
console.log(`重合率 (相对于"谓语(1)"): ${((overlapAnalysis.totalOverlap / predicate1.length) * 100).toFixed(2)}%`);
console.log(`重合率 (相对于"非谓语综合"): ${((overlapAnalysis.totalOverlap / nonPredicateComprehensive.length) * 100).toFixed(2)}%`);

// 显示重合题目的详细信息
console.log('\n=== 重合题目详情 ===');
if (overlapAnalysis.totalOverlap > 0) {
  overlapAnalysis.predicate1ToNonPredicate.forEach((item, index) => {
    console.log(`\n${index + 1}. 题目: ${item.question.text.substring(0, 60)}...`);
    console.log(`   答案: ${item.question.answer}`);
    console.log(`   在"谓语(1)"中的标签: ${item.question.tag || '无'}`);
    console.log(`   在"非谓语综合"中的标签: ${item.duplicateIn.tag || '无'}`);
  });
} else {
  console.log('没有发现重合题目');
}

// 保存分析结果
const result = {
  timestamp: new Date().toISOString(),
  predicate1Count: predicate1.length,
  nonPredicateComprehensiveCount: nonPredicateComprehensive.length,
  overlapCount: overlapAnalysis.totalOverlap,
  overlapRatePredicate1: (overlapAnalysis.totalOverlap / predicate1.length * 100).toFixed(2),
  overlapRateNonPredicate: (overlapAnalysis.totalOverlap / nonPredicateComprehensive.length * 100).toFixed(2),
  detailedOverlap: overlapAnalysis.predicate1ToNonPredicate.map(item => ({
    questionText: item.question.text,
    answer: item.question.answer,
    predicate1Tag: item.question.tag || '无',
    nonPredicateTag: item.duplicateIn.tag || '无'
  }))
};

fs.writeFileSync('predicate_nonpredicate_overlap_analysis.json', JSON.stringify(result, null, 2), 'utf8');
console.log('\n详细分析结果已保存到 predicate_nonpredicate_overlap_analysis.json');

console.log('\n=== 分析完成 ===');
