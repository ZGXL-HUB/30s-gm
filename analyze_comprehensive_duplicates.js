const fs = require('fs');

// 读取数据文件
const data = require('./backup/local_questions_backup/intermediate_questions.js');

// 找出所有"XX综合"子类
const comprehensiveCategories = [];
const otherCategories = [];

for (const [categoryName, questions] of Object.entries(data)) {
  if (categoryName.includes('综合')) {
    comprehensiveCategories.push(categoryName);
  } else {
    otherCategories.push(categoryName);
  }
}

console.log('找到的"XX综合"子类:');
console.log(comprehensiveCategories);
console.log('\n其他子类:');
console.log(otherCategories);

// 分析每个"XX综合"子类的内容
const duplicateAnalysis = {};

for (const compCategory of comprehensiveCategories) {
  const compQuestions = data[compCategory];
  const duplicates = {};
  
  // 确保compQuestions是数组
  if (!Array.isArray(compQuestions)) {
    console.log(`警告: ${compCategory} 不是数组，跳过分析`);
    continue;
  }
  
  // 检查与其他子类的重复情况
  for (const otherCategory of otherCategories) {
    if (otherCategory === compCategory) continue;
    
    const otherQuestions = data[otherCategory];
    
    // 确保otherQuestions是数组
    if (!Array.isArray(otherQuestions)) {
      continue;
    }
    
    let duplicateCount = 0;
    const duplicateQuestions = [];
    
    // 比较题目内容
    for (const compQ of compQuestions) {
      // 确保题目对象有效
      if (!compQ || !compQ.text) continue;
      
      for (const otherQ of otherQuestions) {
        // 确保题目对象有效
        if (!otherQ || !otherQ.text) continue;
        
        if (compQ.text === otherQ.text) {
          duplicateCount++;
          duplicateQuestions.push({
            text: compQ.text,
            answer: compQ.answer,
            compCategory: compCategory,
            otherCategory: otherCategory
          });
        }
      }
    }
    
    if (duplicateCount > 0) {
      duplicates[otherCategory] = {
        count: duplicateCount,
        questions: duplicateQuestions
      };
    }
  }
  
  if (Object.keys(duplicates).length > 0) {
    duplicateAnalysis[compCategory] = {
      totalQuestions: compQuestions.length,
      duplicates: duplicates
    };
  }
}

console.log('\n=== 重复内容分析结果 ===');
for (const [compCategory, analysis] of Object.entries(duplicateAnalysis)) {
  console.log(`\n${compCategory} (共${analysis.totalQuestions}题):`);
  
  for (const [otherCategory, dupInfo] of Object.entries(analysis.duplicates)) {
    console.log(`  与 ${otherCategory} 重复: ${dupInfo.count}题`);
    
    // 显示前几个重复的题目
    if (dupInfo.count <= 5) {
      dupInfo.questions.forEach(q => {
        console.log(`    - "${q.text}" (答案: ${q.answer})`);
      });
    } else {
      console.log(`    前3个重复题目:`);
      dupInfo.questions.slice(0, 3).forEach(q => {
        console.log(`    - "${q.text}" (答案: ${q.answer})`);
      });
    }
  }
}

// 找出完全重复的"XX综合"子类
const fullyDuplicateCategories = [];
for (const [compCategory, analysis] of Object.entries(duplicateAnalysis)) {
  let totalDuplicates = 0;
  for (const dupInfo of Object.values(analysis.duplicates)) {
    totalDuplicates += dupInfo.count;
  }
  
  if (totalDuplicates === analysis.totalQuestions) {
    fullyDuplicateCategories.push({
      category: compCategory,
      totalQuestions: analysis.totalQuestions,
      duplicateWith: Object.keys(analysis.duplicates)
    });
  }
}

console.log('\n=== 完全重复的"XX综合"子类 ===');
if (fullyDuplicateCategories.length === 0) {
  console.log('没有找到完全重复的"XX综合"子类');
} else {
  fullyDuplicateCategories.forEach(item => {
    console.log(`${item.category}: 共${item.totalQuestions}题，与以下子类完全重复:`);
    item.duplicateWith.forEach(cat => console.log(`  - ${cat}`));
  });
}

// 保存分析结果到文件
const result = {
  comprehensiveCategories,
  duplicateAnalysis,
  fullyDuplicateCategories
};

fs.writeFileSync('comprehensive_duplicates_analysis.json', JSON.stringify(result, null, 2), 'utf8');
console.log('\n分析结果已保存到 comprehensive_duplicates_analysis.json');
