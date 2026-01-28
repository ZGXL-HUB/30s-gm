/**
 * 语法分类标准配置
 * 
 * 用途：
 * 1. 定义标准的一级分类（category）列表
 * 2. 定义二级分类（grammarPoint）的映射关系
 * 3. 提供数据验证和规范化工具
 * 
 * 使用方式：
 * import { GRAMMAR_TAXONOMY, validateQuestion, normalizeQuestion } from './config/grammarTaxonomy.js';
 */

/**
 * 标准一级分类列表
 * 这些是固定的分类，不应该随意添加
 */
export const STANDARD_CATEGORIES = [
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
 * 分类到语法点的映射
 * 每个 category 下包含哪些 grammarPoint
 */
export const CATEGORY_TO_GRAMMAR_POINTS = {
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

/**
 * 语法点到分类的反向映射
 * 用于快速查找某个 grammarPoint 属于哪个 category
 */
export const GRAMMAR_POINT_TO_CATEGORY = (() => {
  const mapping = {};
  Object.entries(CATEGORY_TO_GRAMMAR_POINTS).forEach(([category, grammarPoints]) => {
    grammarPoints.forEach(gp => {
      mapping[gp] = category;
    });
  });
  return mapping;
})();

/**
 * 验证 category 是否在标准列表中
 */
export function isValidCategory(category) {
  return STANDARD_CATEGORIES.includes(category);
}

/**
 * 验证 grammarPoint 是否属于对应的 category
 */
export function isValidGrammarPoint(category, grammarPoint) {
  const grammarPoints = CATEGORY_TO_GRAMMAR_POINTS[category] || [];
  return grammarPoints.includes(grammarPoint);
}

/**
 * 获取某个 category 下的所有 grammarPoint
 */
export function getGrammarPointsByCategory(category) {
  return CATEGORY_TO_GRAMMAR_POINTS[category] || [];
}

/**
 * 获取某个 grammarPoint 所属的 category
 */
export function getCategoryByGrammarPoint(grammarPoint) {
  return GRAMMAR_POINT_TO_CATEGORY[grammarPoint] || null;
}

/**
 * 验证题目数据格式
 * 
 * @param {Object} question - 题目对象
 * @returns {Object} - { valid: boolean, errors: string[], warnings: string[] }
 */
export function validateQuestion(question) {
  const errors = [];
  const warnings = [];
  
  // 1. 检查 category
  if (!question.category) {
    errors.push('缺少 category 字段');
  } else if (!isValidCategory(question.category)) {
    errors.push(`category "${question.category}" 不在标准分类列表中`);
  }
  
  // 2. 检查 grammarPoint
  if (!question.grammarPoint) {
    warnings.push('缺少 grammarPoint 字段');
  } else if (question.category && !isValidGrammarPoint(question.category, question.grammarPoint)) {
    errors.push(`grammarPoint "${question.grammarPoint}" 不属于 category "${question.category}"`);
  }
  
  // 3. 检查 tag 字段（应该废弃）
  if (question.tag) {
    warnings.push('存在 tag 字段，建议迁移到 grammarPoint');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 规范化题目数据
 * 将旧格式转换为新格式
 * 
 * @param {Object} question - 题目对象（可能包含旧格式）
 * @returns {Object} - 规范化后的题目对象
 */
export function normalizeQuestion(question) {
  const normalized = { ...question };
  
  // 1. 处理 grammarPoint：优先使用 grammarPoint，如果没有则使用 tag
  if (!normalized.grammarPoint && normalized.tag) {
    normalized.grammarPoint = normalized.tag;
    // 不删除 tag，保留用于兼容
  }
  
  // 2. 如果只有 grammarPoint 没有 category，尝试推断
  if (normalized.grammarPoint && !normalized.category) {
    const inferredCategory = getCategoryByGrammarPoint(normalized.grammarPoint);
    if (inferredCategory) {
      normalized.category = inferredCategory;
    }
  }
  
  // 3. 验证规范化后的数据
  const validation = validateQuestion(normalized);
  if (!validation.valid) {
    console.warn('规范化后的数据仍有错误:', validation.errors);
  }
  
  return normalized;
}

/**
 * 获取所有分类的完整信息
 */
export function getAllCategories() {
  return STANDARD_CATEGORIES.map(category => ({
    category,
    grammarPoints: CATEGORY_TO_GRAMMAR_POINTS[category] || []
  }));
}

/**
 * 搜索语法点（支持模糊匹配）
 */
export function searchGrammarPoint(keyword) {
  const results = [];
  Object.entries(CATEGORY_TO_GRAMMAR_POINTS).forEach(([category, grammarPoints]) => {
    grammarPoints.forEach(gp => {
      if (gp.includes(keyword) || category.includes(keyword)) {
        results.push({
          category,
          grammarPoint: gp
        });
      }
    });
  });
  return results;
}

/**
 * 导出完整的分类体系对象
 */
export const GRAMMAR_TAXONOMY = {
  categories: STANDARD_CATEGORIES,
  categoryToGrammarPoints: CATEGORY_TO_GRAMMAR_POINTS,
  grammarPointToCategory: GRAMMAR_POINT_TO_CATEGORY,
  isValidCategory,
  isValidGrammarPoint,
  getGrammarPointsByCategory,
  getCategoryByGrammarPoint,
  validateQuestion,
  normalizeQuestion,
  getAllCategories,
  searchGrammarPoint
};

// 默认导出
export default GRAMMAR_TAXONOMY;
