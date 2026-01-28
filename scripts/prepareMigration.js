/**
 * 数据迁移准备脚本
 * 
 * 功能：
 * 1. 分析现有数据结构
 * 2. 生成迁移映射表
 * 3. 生成迁移计划
 * 
 * 使用方法：
 * 在微信开发者工具控制台运行：
 * const script = require('./scripts/prepareMigration.js');
 * await script.analyzeAndPrepare();
 */

// 标准分类体系（需要根据实际情况调整）
const STANDARD_CATEGORIES = [
  "名词",
  "代词",
  "动词",
  "形容词与副词",
  "介词",
  "冠词",
  "数词",
  "连词",
  "句子成分与基本句型",
  "动词时态",
  "被动语态",
  "主谓一致",
  "非谓语",
  "复合句",
  "特殊句式"
];

// 分类到语法点的映射（需要根据实际情况补充）
const CATEGORY_TO_GRAMMAR_POINTS = {
  "名词": [
    "名词所有格",
    "名词的复数",
    "名词辨析"
  ],
  "代词": [
    "人称代词",
    "物主代词",
    "反身代词",
    "不定代词",
    "关系代词"
  ],
  "动词": [
    "动词的形式",
    "情态动词",
    "非谓语动词"
  ],
  "形容词与副词": [
    "形容词作定语",
    "副词的基本用法",
    "比较级和最高级"
  ],
  "介词": [
    "时间介词",
    "地点介词",
    "其他介词"
  ],
  "冠词": [
    "不定冠词",
    "定冠词",
    "零冠词"
  ],
  "数词": [
    "基数词与序数词",
    "数词的应用"
  ],
  "连词": [
    "并列连词",
    "从属连词"
  ],
  "句子成分与基本句型": [
    "主谓宾结构",
    "主系表结构"
  ],
  "动词时态": [
    "一般现在时",
    "一般过去时",
    "一般将来时",
    "现在进行时",
    "过去进行时",
    "现在完成时",
    "过去完成时"
  ],
  "被动语态": [
    "一般时态的被动语态",
    "完成时态的被动语态"
  ],
  "主谓一致": [
    "语法一致原则",
    "意义一致原则",
    "就近原则"
  ],
  "非谓语": [
    "现在分词综合",
    "过去分词综合",
    "不定式综合"
  ],
  "复合句": [
    "定语从句",
    "状语从句",
    "宾语从句"
  ],
  "特殊句式": [
    "There be 句型",
    "感叹句",
    "祈使句",
    "倒装句",
    "疑问句"
  ]
};

// 迁移映射规则（需要根据实际情况补充）
const MIGRATION_RULES = {
  // 示例：将 "the的特殊用法" 迁移到 "冠词" -> "定冠词"
  "the的特殊用法": {
    category: "冠词",
    grammarPoint: "定冠词"
  },
  // 示例：将 "f/fe结尾" 迁移到 "名词" -> "名词的复数"
  "f/fe结尾": {
    category: "名词",
    grammarPoint: "名词的复数"
  },
  // 示例：将 "名词综合" 中的题目根据 grammarPoint 分配到具体分类
  "名词综合": {
    // 需要根据 grammarPoint 进一步分类
    strategy: "by_grammar_point"
  },
  // 可以添加更多映射规则...
};

/**
 * 分析现有数据结构
 */
async function analyzeDataStructure() {
  console.log('📊 开始分析数据结构...\n');
  
  const db = wx.cloud.database();
  const questionsCollection = db.collection('questions');
  
  // 1. 获取所有题目
  let allQuestions = [];
  let offset = 0;
  const MAX_BATCH = 20;
  
  while (true) {
    const result = await questionsCollection
      .field({
        _id: true,
        category: true,
        grammarPoint: true,
        tag: true,
        schoolLevel: true
      })
      .skip(offset)
      .limit(MAX_BATCH)
      .get();
    
    if (result.data.length === 0) break;
    
    allQuestions.push(...result.data);
    offset += MAX_BATCH;
    
    if (result.data.length < MAX_BATCH) break;
    
    if (allQuestions.length % 100 === 0) {
      console.log(`   已获取 ${allQuestions.length} 题...`);
    }
  }
  
  console.log(`✅ 共获取 ${allQuestions.length} 道题目\n`);
  
  // 2. 统计 category
  const categoryStats = {};
  allQuestions.forEach(q => {
    const cat = q.category || '未分类';
    if (!categoryStats[cat]) {
      categoryStats[cat] = {
        count: 0,
        hasGrammarPoint: 0,
        hasTag: 0,
        grammarPoints: new Set(),
        tags: new Set()
      };
    }
    categoryStats[cat].count++;
    if (q.grammarPoint) {
      categoryStats[cat].hasGrammarPoint++;
      categoryStats[cat].grammarPoints.add(q.grammarPoint);
    }
    if (q.tag) {
      categoryStats[cat].hasTag++;
      categoryStats[cat].tags.add(q.tag);
    }
  });
  
  // 3. 统计 grammarPoint
  const grammarPointStats = {};
  allQuestions.forEach(q => {
    const gp = q.grammarPoint || q.tag;
    if (gp) {
      if (!grammarPointStats[gp]) {
        grammarPointStats[gp] = {
          count: 0,
          categories: new Set()
        };
      }
      grammarPointStats[gp].count++;
      if (q.category) {
        grammarPointStats[gp].categories.add(q.category);
      }
    }
  });
  
  // 4. 生成报告
  console.log('📈 数据统计报告\n');
  console.log('=== Category 统计 ===');
  const sortedCategories = Object.entries(categoryStats)
    .sort((a, b) => b[1].count - a[1].count);
  
  sortedCategories.forEach(([cat, stats]) => {
    const isStandard = STANDARD_CATEGORIES.includes(cat);
    const status = isStandard ? '✅' : '⚠️';
    console.log(`${status} "${cat}": ${stats.count} 题`);
    console.log(`    - 有 grammarPoint: ${stats.hasGrammarPoint} (${(stats.hasGrammarPoint/stats.count*100).toFixed(1)}%)`);
    console.log(`    - 有 tag: ${stats.hasTag} (${(stats.hasTag/stats.count*100).toFixed(1)}%)`);
    if (stats.grammarPoints.size > 0) {
      console.log(`    - grammarPoints: ${Array.from(stats.grammarPoints).join(', ')}`);
    }
    if (stats.tags.size > 0) {
      console.log(`    - tags: ${Array.from(stats.tags).join(', ')}`);
    }
    console.log('');
  });
  
  console.log('\n=== GrammarPoint 统计（Top 20）===');
  const sortedGrammarPoints = Object.entries(grammarPointStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20);
  
  sortedGrammarPoints.forEach(([gp, stats]) => {
    console.log(`"${gp}": ${stats.count} 题`);
    console.log(`    - 出现在 categories: ${Array.from(stats.categories).join(', ')}`);
    console.log('');
  });
  
  return {
    totalQuestions: allQuestions.length,
    categoryStats,
    grammarPointStats,
    allQuestions
  };
}

/**
 * 生成迁移映射表
 */
function generateMigrationMapping(analysisResult) {
  console.log('🗺️  生成迁移映射表...\n');
  
  const { categoryStats } = analysisResult;
  const migrationMap = {};
  
  // 1. 处理已有映射规则的分类
  Object.keys(MIGRATION_RULES).forEach(oldCategory => {
    const rule = MIGRATION_RULES[oldCategory];
    if (rule.strategy === 'by_grammar_point') {
      // 需要根据 grammarPoint 进一步分类的情况
      migrationMap[oldCategory] = {
        strategy: 'by_grammar_point',
        note: '需要根据 grammarPoint 进一步分类'
      };
    } else {
      migrationMap[oldCategory] = rule;
    }
  });
  
  // 2. 分析其他分类
  Object.keys(categoryStats).forEach(category => {
    // 如果已经在映射表中，跳过
    if (migrationMap[category]) return;
    
    // 如果是标准分类，检查是否需要迁移
    if (STANDARD_CATEGORIES.includes(category)) {
      // 标准分类，可能需要补充 grammarPoint
      const stats = categoryStats[category];
      if (stats.hasGrammarPoint === 0) {
        migrationMap[category] = {
          category: category,
          grammarPoint: null,
          note: '需要补充 grammarPoint'
        };
      }
    } else {
      // 非标准分类，需要迁移
      // 尝试推断应该迁移到哪个标准分类
      const suggestedCategory = inferCategory(category, categoryStats[category]);
      migrationMap[category] = {
        category: suggestedCategory,
        grammarPoint: category, // 默认将原 category 作为 grammarPoint
        note: `建议迁移到 "${suggestedCategory}"，需要人工确认`
      };
    }
  });
  
  console.log('✅ 迁移映射表生成完成\n');
  console.log('=== 迁移映射表 ===');
  Object.entries(migrationMap).forEach(([oldCat, mapping]) => {
    console.log(`"${oldCat}"`);
    if (mapping.strategy) {
      console.log(`  → 策略: ${mapping.strategy}`);
      console.log(`  → 说明: ${mapping.note}`);
    } else {
      console.log(`  → category: "${mapping.category}"`);
      console.log(`  → grammarPoint: "${mapping.grammarPoint || '待补充'}"`);
      if (mapping.note) {
        console.log(`  → 说明: ${mapping.note}`);
      }
    }
    console.log('');
  });
  
  return migrationMap;
}

/**
 * 推断分类（简单规则，需要人工确认）
 */
function inferCategory(category, stats) {
  // 简单的推断规则
  if (category.includes('名词')) return '名词';
  if (category.includes('代词')) return '代词';
  if (category.includes('动词')) return '动词';
  if (category.includes('形容词') || category.includes('副词')) return '形容词与副词';
  if (category.includes('介词')) return '介词';
  if (category.includes('冠词') || category.includes('the') || category.includes('a') || category.includes('an')) return '冠词';
  if (category.includes('数词')) return '数词';
  if (category.includes('连词')) return '连词';
  if (category.includes('时态')) return '动词时态';
  if (category.includes('被动')) return '被动语态';
  if (category.includes('主谓')) return '主谓一致';
  if (category.includes('非谓语') || category.includes('分词') || category.includes('不定式')) return '非谓语';
  if (category.includes('从句') || category.includes('复合句')) return '复合句';
  
  // 根据 grammarPoint 推断
  if (stats.grammarPoints.size > 0) {
    const gp = Array.from(stats.grammarPoints)[0];
    // 可以添加更复杂的推断逻辑
  }
  
  return '待确认';
}

/**
 * 生成迁移计划
 */
function generateMigrationPlan(migrationMap, analysisResult) {
  console.log('📋 生成迁移计划...\n');
  
  const { categoryStats } = analysisResult;
  
  // 按数据量排序，优先迁移数据量大的分类
  const sortedCategories = Object.keys(migrationMap)
    .map(cat => ({
      category: cat,
      count: categoryStats[cat]?.count || 0,
      mapping: migrationMap[cat]
    }))
    .sort((a, b) => b.count - a.count);
  
  console.log('=== 迁移计划（按优先级排序）===');
  console.log('\n建议分批迁移顺序：\n');
  
  let week = 1;
  let currentWeekCount = 0;
  const QUESTIONS_PER_WEEK = 500; // 每周迁移的题目数量
  
  sortedCategories.forEach((item, index) => {
    if (currentWeekCount + item.count > QUESTIONS_PER_WEEK && currentWeekCount > 0) {
      week++;
      currentWeekCount = 0;
      console.log(`\n--- Week ${week} ---`);
    }
    
    currentWeekCount += item.count;
    console.log(`${index + 1}. "${item.category}" (${item.count} 题)`);
    if (item.mapping.strategy) {
      console.log(`   策略: ${item.mapping.strategy}`);
    } else {
      console.log(`   → category: "${item.mapping.category}"`);
      console.log(`   → grammarPoint: "${item.mapping.grammarPoint || '待补充'}"`);
    }
  });
  
  console.log(`\n预计总周数: ${week} 周`);
  console.log(`预计总题目数: ${sortedCategories.reduce((sum, item) => sum + item.count, 0)} 题`);
  
  return {
    plan: sortedCategories,
    estimatedWeeks: week,
    totalQuestions: sortedCategories.reduce((sum, item) => sum + item.count, 0)
  };
}

/**
 * 主函数：分析并准备迁移
 */
async function analyzeAndPrepare() {
  try {
    console.log('🚀 开始数据迁移准备...\n');
    
    // 1. 分析数据结构
    const analysisResult = await analyzeDataStructure();
    
    // 2. 生成迁移映射表
    const migrationMap = generateMigrationMapping(analysisResult);
    
    // 3. 生成迁移计划
    const migrationPlan = generateMigrationPlan(migrationMap, analysisResult);
    
    // 4. 保存结果（可以导出为 JSON 文件）
    const result = {
      analysis: {
        totalQuestions: analysisResult.totalQuestions,
        categoryCount: Object.keys(analysisResult.categoryStats).length,
        grammarPointCount: Object.keys(analysisResult.grammarPointStats).length
      },
      migrationMap,
      migrationPlan: {
        estimatedWeeks: migrationPlan.estimatedWeeks,
        totalQuestions: migrationPlan.totalQuestions,
        categories: migrationPlan.plan.map(item => ({
          category: item.category,
          count: item.count,
          mapping: item.mapping
        }))
      },
      generatedAt: new Date().toISOString()
    };
    
    console.log('\n✅ 迁移准备完成！');
    console.log('\n下一步：');
    console.log('1. 检查并完善迁移映射表');
    console.log('2. 根据迁移计划开始分批迁移');
    console.log('3. 使用迁移脚本执行迁移（先 dryRun）');
    
    return result;
    
  } catch (error) {
    console.error('❌ 错误:', error);
    throw error;
  }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeAndPrepare,
    analyzeDataStructure,
    generateMigrationMapping,
    generateMigrationPlan
  };
}

// 如果在微信开发者工具中运行
if (typeof wx !== 'undefined') {
  // 可以直接调用
  // await analyzeAndPrepare();
}
