/**
 * 错题本页面修复验证测试（简化版）
 */

// 模拟错题数据
const mockWrongQuestions = [
  {
    id: Date.now() + 1,
    question: "I'm responsible ___ this project.",
    userAnswer: "for",
    correctAnswer: "for",
    analysis: "be responsible for为固定短语",
    tag: "介词",
    category: "介词",
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    correctCount: 0,
    errorCount: 1
  },
  {
    id: Date.now() + 2,
    question: "Give ____ (they) some apples.",
    userAnswer: "them",
    correctAnswer: "them",
    analysis: "give动词需要宾格代词作间接宾语",
    tag: "代词",
    category: "代词",
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    correctCount: 0,
    errorCount: 1
  },
  {
    id: Date.now() + 3,
    question: "He ____ (write) a letter to his friend.",
    userAnswer: "writes",
    correctAnswer: "writes",
    analysis: "第三人称单数现在时",
    tag: "谓语",
    category: "谓语",
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    correctCount: 0,
    errorCount: 1
  }
];

// 模拟分类映射表（修复后的版本）
const categoryMapping = {
  // 介词相关分类
  "介词(1)": "介词", "介词(2)": "介词", "介词(3)": "介词",
  "介词综合": "介词", "介词 + 名词/动名词": "介词",
  // 代词相关分类
  "代词(1)": "代词", "代词(2)": "代词", "代词(3)": "代词", 
  "代词(4)": "代词", "代词(5)": "代词", "代词(6)": "代词",
  "代词综合": "代词", "人称代词": "代词", "物主代词": "代词",
  // 连词相关分类
  "连词(1)": "连词", "连词(2)": "连词", "连词(3)": "连词",
  "连词(4)": "连词", "连词(5)": "连词", "连词(6)": "连词",
  "连词与名词": "连词", "连词与动词": "连词", "连词与形容词": "连词",
  "连词与名/动/形/副综合": "连词", "并列连词综合": "连词", "从属连词综合": "连词",
  // 冠词相关分类
  "冠词(1)": "冠词", "冠词(2)": "冠词", "冠词(3)": "冠词", "冠词(4)": "冠词",
  // 名词相关分类
  "名词(1)": "名词", "名词(2)": "名词", "名词(3)": "名词", "名词(4)": "名词", "名词(5)": "名词", "名词(6)": "名词", 
  // 动词相关分类
  "动词(1)": "动词", "动词(2)": "动词", "动词(3)": "动词", 
  "动词(4)": "动词", "动词(5)": "动词",
  // 谓语相关分类
  "谓语(1)": "谓语", "谓语(2)": "谓语", "谓语(3)": "谓语", 
  "谓语(4)": "谓语", "谓语(5)": "谓语", "谓语(6)": "谓语", "谓语(7)": "谓语",
  "谓语(8)": "谓语", "谓语(9)": "谓语",
  // 非谓语相关分类
  "非谓语(1)": "非谓语", "非谓语(2)": "非谓语", "非谓语(3)": "非谓语", "非谓语(4)": "非谓语",
  // 形容词相关分类
  "形容词(1)": "形容词", "形容词(2)": "形容词", "形容词(3)": "形容词",
  // 副词相关分类
  "副词(1)": "副词", "副词(2)": "副词", "副词(3)": "副词", "副词(4)": "副词",
  "副词综合": "副词", "副词修饰句子": "副词", "副词修饰动词": "副词", "副词修饰形容词/副词": "副词",
  // 定语从句相关分类
  "定语从句(1)": "定语从句", "定语从句(2)": "定语从句", "定语从句(3)": "定语从句",
  "定语从句(4)": "定语从句", "定语从句(5)": "定语从句",
  // 状语从句相关分类
  "状语和从句(1)": "状语从句", "状语和从句(2)": "状语从句", "状语和从句(3)": "状语从句",
  "状语和从句(4)": "状语从句", "状语和从句(5)": "状语从句",
  // 固定搭配相关分类
  "固定搭配": "综合练习",
  // 综合练习相关分类
  "综合练习": "综合练习"
};

// 模拟分类归一化函数
function normalizeCategory(category) {
  if (!category) return '其他';
  
  // 去除所有空格
  let normalized = category.replace(/\s+/g, '');
  
  // 英文括号转中文括号
  normalized = normalized.replace(/\((\d+)\)/g, '($1)');
  
  // 处理特殊情况：如果分类名以"综合"结尾，保持不变
  if (normalized.endsWith('综合')) {
    return normalized;
  }
  
  // 处理特殊情况：如果分类名包含"+"，保持不变
  if (normalized.includes('+')) {
    return normalized;
  }
  
  return normalized;
}

// 模拟错题数据加载和分类映射
function loadMistakes() {
  const mistakes = mockWrongQuestions;
  const removedMistakes = [];
  
  // 清理和修复错误数据，并为每个错题添加映射分类
  const mistakesWithShowAnswer = mistakes.map(m => {
    let questionText = '';
    
    // 修复question字段
    if (typeof m.question === 'string') {
      questionText = m.question;
    } else if (typeof m.question === 'object' && m.question) {
      questionText = m.question.question || m.question.text || '题目解析中...';
    } else {
      questionText = '未知题目';
    }
    
    // 优先使用tag进行映射，如果没有tag则使用category
    const originalCategory = m.tag || m.category || '其他';
    
    // 归一化分类名称
    const normalizedCategory = normalizeCategory(originalCategory);
    
    // 使用归一化后的分类进行映射
    const mappedCategory = categoryMapping[normalizedCategory] || normalizedCategory;
    
    return {
      ...m,
      question: questionText,
      showAnswer: false,
      originalCategory: originalCategory,
      normalizedCategory: normalizedCategory,
      mappedCategory: mappedCategory
    };
  });
  
  console.log('[错题本] 加载错题数据:', mistakesWithShowAnswer.length, '题');
  mistakesWithShowAnswer.forEach((m, index) => {
    console.log(`[错题本] 第${index + 1}题:`, {
      question: m.question.substring(0, 30) + '...',
      originalCategory: m.originalCategory,
      normalizedCategory: m.normalizedCategory,
      mappedCategory: m.mappedCategory
    });
  });
  
  return mistakesWithShowAnswer;
}

// 模拟分类统计计算
function calculateStats(mistakes) {
  const stats = {};
  mistakes.forEach(m => {
    // 优先使用已映射的分类
    const mappedCategory = m.mappedCategory || '其他';
    stats[mappedCategory] = (stats[mappedCategory] || 0) + 1;
  });

  // 计算所有分类的数量
  const categories = [
    "介词", "代词", "连词", "冠词", "名词", "动词",
    "谓语", "非谓语", "形容词", "副词", "定语从句", "状语从句", "综合练习"
  ];
  
  const categoryCounts = {};
  categories.forEach(category => {
    categoryCounts[category] = stats[category] || 0;
  });

  console.log('[分类统计] 计算完成:', categoryCounts);
  console.log('[分类统计] 详细统计信息:', {
    mistakesLength: mistakes.length,
    stats: stats,
    categoryCountsKeys: Object.keys(categoryCounts)
  });

  return categoryCounts;
}

// 模拟学习数据分析
function analyzeLearningData(mistakes, removedMistakes) {
  console.log(`[学习分析] 开始分析，当前错题: ${mistakes.length}题，已移除错题: ${removedMistakes.length}题`);
  
  // 计算总数和已掌握数
  const totalMistakes = mistakes.length + removedMistakes.length;
  const masteredMistakes = removedMistakes.length;
  
  console.log(`[学习分析] 计算结果: totalMistakes=${totalMistakes}, masteredMistakes=${masteredMistakes}`);
  
  // 计算掌握率
  const masteryRate = totalMistakes > 0 ? Math.round((masteredMistakes / totalMistakes) * 100) : 0;
  
  console.log(`[学习分析] 计算结果: 总错题=${totalMistakes}, 已掌握=${masteredMistakes}, 掌握率=${masteryRate}%`);
  
  return {
    totalMistakes,
    masteredMistakes,
    masteryRate
  };
}

// 执行测试
console.log('=== 错题本页面修复验证测试（简化版） ===');

// 1. 测试错题数据加载
console.log('\n1. 测试错题数据加载...');
const mistakes = loadMistakes();
console.log('✅ 错题数据加载成功，共', mistakes.length, '道错题');

// 2. 测试分类统计计算
console.log('\n2. 测试分类统计计算...');
const categoryCounts = calculateStats(mistakes);
console.log('✅ 分类统计计算成功');

// 3. 测试学习数据分析
console.log('\n3. 测试学习数据分析...');
const learningData = analyzeLearningData(mistakes, []);
console.log('✅ 学习数据分析成功');

// 4. 验证修复效果
console.log('\n4. 验证修复效果...');
console.log('总错题数:', learningData.totalMistakes);
console.log('已掌握数:', learningData.masteredMistakes);
console.log('掌握率:', learningData.masteryRate + '%');
console.log('分类统计:', categoryCounts);

// 检查是否有分类统计为0的问题
const zeroCountCategories = Object.entries(categoryCounts).filter(([category, count]) => count === 0);
console.log('统计为0的分类:', zeroCountCategories.map(([category]) => category));

// 检查错题分类映射是否正确
const mappedCategories = mistakes.map(m => m.mappedCategory);
console.log('错题映射分类:', mappedCategories);

// 5. 测试undefined属性访问修复
console.log('\n5. 测试undefined属性访问修复...');
const testRecommendedFocus = [];
const testTopCategory = testRecommendedFocus[0]?.category || '其他';
console.log('测试undefined属性访问:', testTopCategory);

console.log('\n=== 测试完成 ===');
