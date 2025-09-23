const fs = require('fs');
const path = require('path');

// 读取题库数据
const choiceQuestionsPath = path.join(__dirname, 'miniprogram/data/choice_questions.js');
const choiceQuestionsContent = fs.readFileSync(choiceQuestionsPath, 'utf8');

// 提取题库对象
function extractChoiceQuestions(content) {
  // 移除注释和module.exports部分
  const cleanContent = content
    .replace(/\/\/.*$/gm, '') // 移除单行注释
    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
    .replace(/module\.exports.*$/gm, ''); // 移除module.exports
  
  // 提取const choiceQuestions = {...}部分
  const match = cleanContent.match(/const choiceQuestions = ([\s\S]*?);/);
  if (match) {
    try {
      return eval('(' + match[1] + ')');
    } catch (error) {
      console.error('解析题库数据失败:', error);
      return {};
    }
  }
  return {};
}

// 语法测试页面中定义的分类
const grammarTestCategories = [
  "介词", "代词", "连词", "冠词", "名词", "动词",
  "谓语", "非谓语", "形容词", "副词", "定语从句", "状语和从句"
];

// 分类映射表（将语法测试分类映射到题库分类）
const categoryMapping = {
  "介词": ["介词综合", "固定搭配", "介词 + 名词/动名词"],
  "代词": ["代词综合", "人称代词", "物主代词", "反身代词", "关系代词", "it相关"],
  "连词": ["并列连词综合", "从属连词综合", "连词与名/动/形/副综合", "连词与名词", "连词与动词", "连词与形容词"],
  "冠词": ["冠词综合", "泛指与特指", "a和an", "the的特殊用法"],
  "名词": ["名词综合", "复合词和外来词", "单复数同形", "不规则复数", "以o结尾", "以y结尾", "s/sh/ch/x结尾", "以f/fe结尾", "f/fe结尾"],
  "动词": ["被动写be吗", "并列句与动词", "主从句与动词", "插入语与动词"],
  "谓语": ["时态综合", "现在时", "过去时", "进行时", "被动语态", "时态(一般过去时)", "时态(一般将来时)", "时态(过去将来时)", "时态(现在进行时)", "时态(过去进行时)", "时态(现在完成时)", "时态(过去完成时)", "语态(被动+八大时态)"],
  "非谓语": ["现在分词综合", "过去分词综合", "不定式综合"],
  "形容词": ["形容词综合", "比较级", "最高级"],
  "副词": ["副词修饰动词", "副词修饰句子", "副词修饰形容词/副词"],
  "定语从句": ["定语从句综合", "that能填吗", "who和which选哪个", "whose", "which和when/where混淆"],
  "状语和从句": ["状语从句综合", "when", "where", "how", "why"]
};

// 检查每个语法测试分类的题目数量
function checkGrammarTestCategories() {
  console.log('🔍 检查语法测试分类的题目数量...\n');
  
  const choiceQuestions = extractChoiceQuestions(choiceQuestionsContent);
  const results = {};
  
  grammarTestCategories.forEach(testCategory => {
    const mappedCategories = categoryMapping[testCategory] || [];
    let totalQuestions = 0;
    const availableCategories = [];
    
    mappedCategories.forEach(category => {
      if (choiceQuestions[category]) {
        totalQuestions += choiceQuestions[category].length;
        availableCategories.push(`${category}(${choiceQuestions[category].length}题)`);
      }
    });
    
    results[testCategory] = {
      totalQuestions,
      availableCategories,
      hasQuestions: totalQuestions > 0
    };
  });
  
  return results;
}

// 生成报告
function generateReport(results) {
  console.log('📊 语法测试分类题目统计报告\n');
  console.log('=' .repeat(60));
  
  let totalTestQuestions = 0;
  const missingCategories = [];
  const availableCategories = [];
  
  Object.keys(results).forEach(category => {
    const result = results[category];
    const status = result.hasQuestions ? '✅' : '❌';
    const questionCount = result.totalQuestions;
    
    console.log(`${status} ${category.padEnd(8)}: ${questionCount.toString().padStart(4)} 题`);
    
    if (result.hasQuestions) {
      availableCategories.push(category);
      totalTestQuestions += questionCount;
    } else {
      missingCategories.push(category);
    }
    
    if (result.availableCategories.length > 0) {
      console.log(`    └─ 包含: ${result.availableCategories.join(', ')}`);
    }
  });
  
  console.log('\n' + '=' .repeat(60));
  console.log(`📈 总计: ${totalTestQuestions} 题`);
  console.log(`✅ 有题目的分类: ${availableCategories.length} 个`);
  console.log(`❌ 缺少题目的分类: ${missingCategories.length} 个`);
  
  if (missingCategories.length > 0) {
    console.log(`\n⚠️  缺少题目的分类: ${missingCategories.join(', ')}`);
  }
  
  return {
    totalQuestions: totalTestQuestions,
    availableCategories,
    missingCategories
  };
}

// 生成解决方案建议
function generateSolutions(results) {
  console.log('\n💡 解决方案建议\n');
  console.log('=' .repeat(60));
  
  Object.keys(results).forEach(category => {
    const result = results[category];
    
    if (!result.hasQuestions) {
      console.log(`\n🔧 ${category} 分类缺少题目:`);
      
      // 检查是否有相似的分类可以映射
      const choiceQuestions = extractChoiceQuestions(choiceQuestionsContent);
      const allCategories = Object.keys(choiceQuestions);
      
      // 查找可能相关的分类
      const relatedCategories = allCategories.filter(cat => 
        cat.toLowerCase().includes(category.toLowerCase()) ||
        category.toLowerCase().includes(cat.toLowerCase())
      );
      
      if (relatedCategories.length > 0) {
        console.log(`   建议映射以下分类:`);
        relatedCategories.forEach(cat => {
          const questionCount = choiceQuestions[cat].length;
          console.log(`   - ${cat} (${questionCount}题)`);
        });
      } else {
        console.log(`   未找到相关分类，需要手动添加题目`);
      }
      
      // 提供具体的映射建议
      switch (category) {
        case "谓语":
          console.log(`   建议映射: 时态综合, 现在时, 过去时, 进行时, 被动语态`);
          break;
        case "非谓语":
          console.log(`   建议映射: 现在分词综合, 过去分词综合, 不定式综合`);
          break;
        case "状语和从句":
          console.log(`   建议映射: 状语从句综合, when, where, how, why`);
          break;
        default:
          console.log(`   建议检查题库中是否有相关的 ${category} 分类`);
      }
    }
  });
}

// 生成修复后的分类映射
function generateFixedCategoryMapping(results) {
  console.log('\n🔧 修复后的分类映射建议\n');
  console.log('=' .repeat(60));
  
  const fixedMapping = {};
  
  Object.keys(results).forEach(category => {
    const result = results[category];
    
    if (result.hasQuestions) {
      fixedMapping[category] = result.availableCategories.map(cat => 
        cat.replace(/\(\d+题\)/, '').trim()
      );
    } else {
      // 为缺少题目的分类提供修复建议
      switch (category) {
        case "谓语":
          fixedMapping[category] = ["时态综合", "现在时", "过去时", "进行时", "被动语态"];
          break;
        case "非谓语":
          fixedMapping[category] = ["现在分词综合", "过去分词综合", "不定式综合"];
          break;
        case "状语和从句":
          fixedMapping[category] = ["状语从句综合", "when", "where", "how", "why"];
          break;
        default:
          fixedMapping[category] = [];
      }
    }
  });
  
  console.log('const categoryMapping = {');
  Object.keys(fixedMapping).forEach(category => {
    const categories = fixedMapping[category];
    if (categories.length > 0) {
      console.log(`  "${category}": [${categories.map(cat => `"${cat}"`).join(', ')}],`);
    } else {
      console.log(`  "${category}": [], // 需要添加题目`);
    }
  });
  console.log('};');
  
  return fixedMapping;
}

// 主函数
function main() {
  console.log('🚀 开始检查语法测试分类题目...\n');
  
  const results = checkGrammarTestCategories();
  const report = generateReport(results);
  generateSolutions(results);
  generateFixedCategoryMapping(results);
  
  console.log('\n✅ 检查完成！');
  
  if (report.missingCategories.length > 0) {
    console.log(`\n⚠️  需要修复 ${report.missingCategories.length} 个分类的题目问题`);
  } else {
    console.log('\n🎉 所有语法测试分类都有题目！');
  }
}

// 运行检查
main();
