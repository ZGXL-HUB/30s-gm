// 测试所有10个语法点的匹配情况
console.log('=== 测试所有10个语法点匹配 ===\n');

// 模拟云数据库查询函数
const mockCloudQuery = async (category) => {
  // 模拟云数据库中的分类
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
  
  const found = cloudCategories.includes(category);
  const questionCount = found ? Math.floor(Math.random() * 20) + 1 : 0;
  
  return {
    success: true,
    data: found ? Array(questionCount).fill().map((_, i) => ({
      _id: `q${i}`,
      text: `测试题目 ${i + 1}`,
      answer: `答案${i + 1}`,
      category: category
    })) : [],
    total: questionCount
  };
};

// 模拟 cloudDataLoader 的 getQuestionsByGrammarPoint 函数
const getQuestionsByGrammarPoint = async (grammarPoint) => {
  console.log(`📚 根据语法点获取题目: ${grammarPoint}`);
  
  const specialMapping = {
    "单复数同形": "名词综合",
    "语态(被动+八大时态)": "被动语态",
    "固定搭配": "介词综合",
    "介词 + 名词/动名词": "名词综合",
    "以f/fe结尾": "名词综合",
    "副词修饰句子": "副词综合"
  };
  
  const actualCategory = specialMapping[grammarPoint] || grammarPoint;
  
  if (specialMapping[grammarPoint]) {
    console.log(`   📝 映射: "${grammarPoint}" → "${actualCategory}"`);
  }
  
  try {
    const result = await mockCloudQuery(actualCategory);
    
    if (result.data.length > 0) {
      console.log(`   ✅ 找到 ${result.total} 题`);
      return result.data;
    } else {
      console.log(`   ❌ 未找到题目`);
      return [];
    }
  } catch (error) {
    console.log(`   ❌ 查询失败: ${error.message}`);
    return [];
  }
};

// 测试所有10个语法点
const testAllPoints = async () => {
  const selectedPoints = [
    "介词 + 名词/动名词",
    "it相关", 
    "连词与名词",
    "the的特殊用法",
    "以f/fe结尾",
    "被动写be吗",
    "语态(被动+八大时态)",
    "过去分词综合", 
    "最高级",
    "副词修饰句子"
  ];
  
  console.log(`🎯 测试 ${selectedPoints.length} 个语法点：\n`);
  
  let successCount = 0;
  let totalQuestions = 0;
  
  for (const point of selectedPoints) {
    const questions = await getQuestionsByGrammarPoint(point);
    
    if (questions.length > 0) {
      successCount++;
      totalQuestions += questions.length;
    }
    
    console.log(''); // 空行分隔
  }
  
  console.log('📊 测试结果汇总：');
  console.log(`✅ 成功匹配: ${successCount}/${selectedPoints.length} 个语法点`);
  console.log(`📚 总题目数: ${totalQuestions} 题`);
  console.log(`📈 成功率: ${Math.round(successCount / selectedPoints.length * 100)}%`);
  
  if (successCount === selectedPoints.length) {
    console.log('\n🎉 所有语法点都能匹配！现在应该能显示10个语法点的题目了！');
  } else {
    console.log(`\n⚠️  还有 ${selectedPoints.length - successCount} 个语法点需要进一步处理`);
  }
};

// 执行测试
testAllPoints().catch(console.error);
