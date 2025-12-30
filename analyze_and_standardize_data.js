// 数据分析和标准化脚本
const fs = require('fs');
const path = require('path');

// 标准化分类映射
const STANDARD_CATEGORIES = {
  // 名词类
  '名词': {
    '单复数同形': '单复数同形',
    'f/fe结尾': 'f/fe结尾', 
    's/sh/ch/x结尾': 's/sh/ch/x结尾',
    '复合词和外来词': '复合词和外来词',
    '泛指与特指': '泛指与特指',
    '名词综合': '名词综合'
  },
  
  // 代词类
  '代词': {
    '人称代词': '人称代词',
    '反身代词': '反身代词', 
    '关系代词': '关系代词',
    '代词综合': '代词综合'
  },
  
  // 动词类
  '动词': {
    '一般过去时': '一般过去时',
    '一般将来时': '一般将来时',
    '过去将来时': '过去将来时',
    '现在进行时': '现在进行时',
    '过去进行时': '过去进行时',
    '现在完成时': '现在完成时',
    '过去完成时': '过去完成时',
    '被动语态': '被动语态',
    '现在分词综合': '现在分词综合',
    '过去分词综合': '过去分词综合',
    '不定式综合': '不定式综合',
    '动词综合': '动词综合'
  },
  
  // 介词类
  '介词': {
    '介词综合': '介词综合',
    '固定搭配': '固定搭配'
  },
  
  // 连词类
  '连词': {
    '连词综合': '连词综合',
    '连词与名词': '连词综合',
    '连词与动词': '连词综合',
    '连词与形容词': '连词综合',
    '连词与副词': '连词综合'
  },
  
  // 冠词类
  '冠词': {
    'a和an': 'a和an',
    'the的特殊用法': 'the的特殊用法',
    '冠词综合': '冠词综合'
  },
  
  // 形容词类
  '形容词': {
    '比较级': '比较级',
    '最高级': '最高级',
    '形容词综合': '形容词综合'
  },
  
  // 副词类
  '副词': {
    '副词修饰句子': '副词修饰句子',
    '副词修饰形容词': '副词综合',
    '副词修饰动词': '副词综合',
    '副词综合': '副词综合'
  },
  
  // 从句类
  '从句': {
    '定语从句综合': '定语从句综合',
    '状语从句综合': '状语从句综合'
  }
};

// 目标题目数量
const TARGET_QUESTIONS_PER_CATEGORY = 20;
const MIN_QUESTIONS = 10;
const MAX_QUESTIONS = 30;

async function analyzeData() {
  console.log('🔍 开始分析数据...');
  
  // 这里需要连接云数据库进行分析
  // 由于这是本地脚本，我们创建一个分析报告模板
  
  const analysisReport = {
    timestamp: new Date().toISOString(),
    totalQuestions: 0,
    categories: {},
    recommendations: []
  };
  
  console.log('📊 分析完成，生成报告...');
  
  // 生成分析报告
  fs.writeFileSync(
    path.join(__dirname, 'data_analysis_report.json'),
    JSON.stringify(analysisReport, null, 2)
  );
  
  console.log('✅ 分析报告已生成: data_analysis_report.json');
}

async function generateStandardizationPlan() {
  console.log('📋 生成标准化计划...');
  
  const plan = {
    phase1: '数据清理',
    phase2: '分类重构', 
    phase3: '题目重新分配',
    phase4: '测试验证',
    estimatedTime: '2周',
    targetCategories: Object.keys(STANDARD_CATEGORIES).length,
    targetQuestions: Object.values(STANDARD_CATEGORIES).flat().length * TARGET_QUESTIONS_PER_CATEGORY
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'standardization_plan.json'),
    JSON.stringify(plan, null, 2)
  );
  
  console.log('✅ 标准化计划已生成: standardization_plan.json');
}

// 主函数
async function main() {
  try {
    await analyzeData();
    await generateStandardizationPlan();
    console.log('🎉 数据分析和标准化计划生成完成！');
  } catch (error) {
    console.error('❌ 执行失败:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeData,
  generateStandardizationPlan,
  STANDARD_CATEGORIES,
  TARGET_QUESTIONS_PER_CATEGORY
};
