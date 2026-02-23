/**
 * 本地数据分析脚本
 * 基于去重后的题库.json文件进行分析
 * 
 * 使用方法：
 * node scripts/analyzeLocalData.js
 */

const fs = require('fs');
const path = require('path');

// 标准分类体系
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

/**
 * 读取并解析 JSON 文件
 */
function loadQuestions() {
  const filePath = path.join(__dirname, '..', '去重后的题库.json');
  console.log(`📂 读取文件: ${filePath}\n`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // JSON 文件可能是每行一个 JSON 对象（JSONL 格式）
    const lines = content.trim().split('\n');
    const questions = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        console.warn(`⚠️  解析失败的行: ${line.substring(0, 50)}...`);
        return null;
      }
    }).filter(q => q !== null);
    
    console.log(`✅ 成功加载 ${questions.length} 道题目\n`);
    return questions;
  } catch (error) {
    console.error('❌ 读取文件失败:', error.message);
    throw error;
  }
}

/**
 * 分析数据结构
 */
function analyzeDataStructure(questions) {
  console.log('📊 开始分析数据结构...\n');
  
  // 1. 统计 category
  const categoryStats = {};
  questions.forEach(q => {
    const cat = q.category || '未分类';
    if (!categoryStats[cat]) {
      categoryStats[cat] = {
        count: 0,
        hasGrammarPoint: 0,
        hasTag: 0,
        grammarPoints: new Set(),
        tags: new Set(),
        schoolLevels: new Set()
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
    if (q.schoolLevel) {
      categoryStats[cat].schoolLevels.add(q.schoolLevel);
    }
  });
  
  // 2. 统计 grammarPoint
  const grammarPointStats = {};
  questions.forEach(q => {
    const gp = q.grammarPoint || q.tag;
    if (gp) {
      if (!grammarPointStats[gp]) {
        grammarPointStats[gp] = {
          count: 0,
          categories: new Set(),
          schoolLevels: new Set()
        };
      }
      grammarPointStats[gp].count++;
      if (q.category) {
        grammarPointStats[gp].categories.add(q.category);
      }
      if (q.schoolLevel) {
        grammarPointStats[gp].schoolLevels.add(q.schoolLevel);
      }
    }
  });
  
  // 3. 统计 tag
  const tagStats = {};
  questions.forEach(q => {
    if (q.tag) {
      if (!tagStats[q.tag]) {
        tagStats[q.tag] = {
          count: 0,
          categories: new Set()
        };
      }
      tagStats[q.tag].count++;
      if (q.category) {
        tagStats[q.tag].categories.add(q.category);
      }
    }
  });
  
  return {
    categoryStats,
    grammarPointStats,
    tagStats,
    totalQuestions: questions.length
  };
}

/**
 * 生成报告
 */
function generateReport(analysisResult, questions) {
  const { categoryStats, grammarPointStats, tagStats, totalQuestions } = analysisResult;
  
  console.log('='.repeat(80));
  console.log('📈 数据统计报告');
  console.log('='.repeat(80));
  console.log(`\n总题目数: ${totalQuestions}\n`);
  
  // Category 统计
  console.log('\n' + '='.repeat(80));
  console.log('📁 Category 统计');
  console.log('='.repeat(80));
  
  const sortedCategories = Object.entries(categoryStats)
    .sort((a, b) => b[1].count - a[1].count);
  
  let standardCount = 0;
  let nonStandardCount = 0;
  
  sortedCategories.forEach(([cat, stats]) => {
    const isStandard = STANDARD_CATEGORIES.includes(cat);
    const status = isStandard ? '✅' : '⚠️';
    const percentage = ((stats.count / totalQuestions) * 100).toFixed(2);
    
    if (isStandard) standardCount += stats.count;
    else nonStandardCount += stats.count;
    
    console.log(`\n${status} "${cat}"`);
    console.log(`   题目数: ${stats.count} (${percentage}%)`);
    console.log(`   有 grammarPoint: ${stats.hasGrammarPoint} (${(stats.hasGrammarPoint/stats.count*100).toFixed(1)}%)`);
    console.log(`   有 tag: ${stats.hasTag} (${(stats.hasTag/stats.count*100).toFixed(1)}%)`);
    
    if (stats.schoolLevels.size > 0) {
      console.log(`   学段: ${Array.from(stats.schoolLevels).join(', ')}`);
    }
    
    if (stats.grammarPoints.size > 0) {
      const gps = Array.from(stats.grammarPoints).slice(0, 5);
      console.log(`   grammarPoints (前5个): ${gps.join(', ')}${stats.grammarPoints.size > 5 ? '...' : ''}`);
    }
    
    if (stats.tags.size > 0) {
      const tags = Array.from(stats.tags).slice(0, 5);
      console.log(`   tags (前5个): ${tags.join(', ')}${stats.tags.size > 5 ? '...' : ''}`);
    }
  });
  
  console.log(`\n📊 标准分类覆盖: ${standardCount} 题 (${(standardCount/totalQuestions*100).toFixed(2)}%)`);
  console.log(`📊 非标准分类: ${nonStandardCount} 题 (${(nonStandardCount/totalQuestions*100).toFixed(2)}%)`);
  
  // GrammarPoint 统计
  console.log('\n' + '='.repeat(80));
  console.log('📌 GrammarPoint 统计 (Top 30)');
  console.log('='.repeat(80));
  
  const sortedGrammarPoints = Object.entries(grammarPointStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 30);
  
  sortedGrammarPoints.forEach(([gp, stats], index) => {
    const percentage = ((stats.count / totalQuestions) * 100).toFixed(2);
    console.log(`\n${index + 1}. "${gp}"`);
    console.log(`   题目数: ${stats.count} (${percentage}%)`);
    if (stats.categories.size > 0) {
      console.log(`   出现在 categories: ${Array.from(stats.categories).join(', ')}`);
    }
    if (stats.schoolLevels.size > 0) {
      console.log(`   学段: ${Array.from(stats.schoolLevels).join(', ')}`);
    }
  });
  
  // Tag 统计（如果存在）
  if (Object.keys(tagStats).length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('🏷️  Tag 统计 (Top 20)');
    console.log('='.repeat(80));
    
    const sortedTags = Object.entries(tagStats)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20);
    
    sortedTags.forEach(([tag, stats], index) => {
      console.log(`\n${index + 1}. "${tag}"`);
      console.log(`   题目数: ${stats.count}`);
      if (stats.categories.size > 0) {
        console.log(`   出现在 categories: ${Array.from(stats.categories).join(', ')}`);
      }
    });
  }
  
  // 数据质量分析
  console.log('\n' + '='.repeat(80));
  console.log('🔍 数据质量分析');
  console.log('='.repeat(80));
  
  let hasCategory = 0;
  let hasGrammarPoint = 0;
  let hasTag = 0;
  let hasBothCategoryAndGrammarPoint = 0;
  let missingBoth = 0;
  
  questions.forEach(q => {
    if (q.category) hasCategory++;
    if (q.grammarPoint) hasGrammarPoint++;
    if (q.tag) hasTag++;
    if (q.category && q.grammarPoint) hasBothCategoryAndGrammarPoint++;
    if (!q.category && !q.grammarPoint && !q.tag) missingBoth++;
  });
  
  console.log(`\n有 category: ${hasCategory} (${(hasCategory/totalQuestions*100).toFixed(2)}%)`);
  console.log(`有 grammarPoint: ${hasGrammarPoint} (${(hasGrammarPoint/totalQuestions*100).toFixed(2)}%)`);
  console.log(`有 tag: ${hasTag} (${(hasTag/totalQuestions*100).toFixed(2)}%)`);
  console.log(`同时有 category 和 grammarPoint: ${hasBothCategoryAndGrammarPoint} (${(hasBothCategoryAndGrammarPoint/totalQuestions*100).toFixed(2)}%)`);
  console.log(`两者都没有: ${missingBoth} (${(missingBoth/totalQuestions*100).toFixed(2)}%)`);
  
  // 生成迁移建议
  console.log('\n' + '='.repeat(80));
  console.log('💡 迁移建议');
  console.log('='.repeat(80));
  
  const migrationSuggestions = [];
  
  // 找出需要迁移的非标准分类
  Object.entries(categoryStats).forEach(([cat, stats]) => {
    if (!STANDARD_CATEGORIES.includes(cat) && cat !== '未分类') {
      migrationSuggestions.push({
        oldCategory: cat,
        count: stats.count,
        hasGrammarPoint: stats.hasGrammarPoint,
        grammarPoints: Array.from(stats.grammarPoints),
        suggestedCategory: inferCategory(cat, stats)
      });
    }
  });
  
  if (migrationSuggestions.length > 0) {
    console.log('\n需要迁移的分类（按题目数排序）:');
    migrationSuggestions
      .sort((a, b) => b.count - a.count)
      .forEach((item, index) => {
        console.log(`\n${index + 1}. "${item.oldCategory}" (${item.count} 题)`);
        console.log(`   建议迁移到: "${item.suggestedCategory}"`);
        if (item.grammarPoints.length > 0) {
          console.log(`   已有 grammarPoints: ${item.grammarPoints.slice(0, 3).join(', ')}${item.grammarPoints.length > 3 ? '...' : ''}`);
        } else {
          console.log(`   ⚠️  缺少 grammarPoint，需要补充`);
        }
      });
  }
  
  return {
    analysisResult,
    migrationSuggestions
  };
}

/**
 * 推断分类（简单规则）
 */
function inferCategory(category, stats) {
  const lowerCat = category.toLowerCase();
  
  if (lowerCat.includes('名词') || lowerCat.includes('noun')) return '名词';
  if (lowerCat.includes('代词') || lowerCat.includes('pronoun')) return '代词';
  if (lowerCat.includes('动词') || lowerCat.includes('verb')) return '动词';
  if (lowerCat.includes('形容词') || lowerCat.includes('副词') || lowerCat.includes('adjective') || lowerCat.includes('adverb')) return '形容词与副词';
  if (lowerCat.includes('介词') || lowerCat.includes('preposition')) return '介词';
  if (lowerCat.includes('冠词') || lowerCat.includes('article') || lowerCat.includes('the') || lowerCat.includes('a') || lowerCat.includes('an')) return '冠词';
  if (lowerCat.includes('数词') || lowerCat.includes('numeral')) return '数词';
  if (lowerCat.includes('连词') || lowerCat.includes('conjunction')) return '连词';
  if (lowerCat.includes('时态') || lowerCat.includes('tense')) return '动词时态';
  if (lowerCat.includes('被动') || lowerCat.includes('passive')) return '被动语态';
  if (lowerCat.includes('主谓') || lowerCat.includes('agreement')) return '主谓一致';
  if (lowerCat.includes('非谓语') || lowerCat.includes('分词') || lowerCat.includes('不定式') || lowerCat.includes('non-finite')) return '非谓语';
  if (lowerCat.includes('从句') || lowerCat.includes('复合句') || lowerCat.includes('clause')) return '复合句';
  if (lowerCat.includes('句型') || lowerCat.includes('sentence')) return '特殊句式';
  
  // 根据 grammarPoint 推断
  if (stats.grammarPoints.size > 0) {
    const gp = Array.from(stats.grammarPoints)[0];
    // 可以添加更复杂的推断逻辑
  }
  
  return '待确认';
}

/**
 * 保存报告到文件
 */
function saveReport(report, outputPath) {
  const reportData = {
    summary: {
      totalQuestions: report.analysisResult.totalQuestions,
      categoryCount: Object.keys(report.analysisResult.categoryStats).length,
      grammarPointCount: Object.keys(report.analysisResult.grammarPointStats).length,
      tagCount: Object.keys(report.analysisResult.tagStats).length
    },
    categoryStats: Object.fromEntries(
      Object.entries(report.analysisResult.categoryStats).map(([cat, stats]) => [
        cat,
        {
          count: stats.count,
          hasGrammarPoint: stats.hasGrammarPoint,
          hasTag: stats.hasTag,
          grammarPoints: Array.from(stats.grammarPoints),
          tags: Array.from(stats.tags),
          schoolLevels: Array.from(stats.schoolLevels)
        }
      ])
    ),
    grammarPointStats: Object.fromEntries(
      Object.entries(report.analysisResult.grammarPointStats).map(([gp, stats]) => [
        gp,
        {
          count: stats.count,
          categories: Array.from(stats.categories),
          schoolLevels: Array.from(stats.schoolLevels)
        }
      ])
    ),
    migrationSuggestions: report.migrationSuggestions,
    generatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(reportData, null, 2), 'utf-8');
  console.log(`\n✅ 报告已保存到: ${outputPath}`);
}

/**
 * 主函数
 */
function main() {
  try {
    console.log('🚀 开始数据分析...\n');
    
    // 1. 加载数据
    const questions = loadQuestions();
    
    // 2. 分析数据
    const analysisResult = analyzeDataStructure(questions);
    
    // 3. 生成报告
    const report = generateReport(analysisResult, questions);
    
    // 4. 保存报告
    const outputPath = path.join(__dirname, '..', '数据分析报告.json');
    saveReport(report, outputPath);
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ 分析完成！');
    console.log('='.repeat(80));
    console.log('\n下一步：');
    console.log('1. 查看数据分析报告.json 了解详细数据');
    console.log('2. 根据迁移建议制定迁移计划');
    console.log('3. 完善 config/grammarTaxonomy.js 配置');
    console.log('4. 开始分批迁移数据\n');
    
  } catch (error) {
    console.error('\n❌ 分析失败:', error);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  loadQuestions,
  analyzeDataStructure,
  generateReport,
  inferCategory
};
