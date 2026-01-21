// 改进的查询逻辑示例：使用 OR 查询同时匹配 category 和 grammarPoint
// 这是一个示例文件，展示如何修改 cloudDataLoader.js 中的查询逻辑

/**
 * 改进的查询函数：同时支持 category 和 grammarPoint
 * 
 * 优势：
 * 1. 使用 OR 查询，同时匹配 category 和 grammarPoint
 * 2. 即使题目只有其中一个字段，也能查询到
 * 3. 向后兼容，不影响现有功能
 * 
 * 使用场景：
 * - 当用户选择"关系代词"时，可以查询到：
 *   - category = "关系代词" 的题目
 *   - grammarPoint = "关系代词" 的题目
 *   - category = "代词" 且 grammarPoint = "关系代词" 的题目
 */

async function getQuestionsByGrammarPointImproved(grammarPoint, schoolLevel = null, type = null, limit = 20) {
  try {
    const db = wx.cloud.database();
    const _ = db.command;
    const questionsCollection = db.collection('questions');
    
    // 构建基础查询条件
    const baseConditions = [];
    
    // 条件1：category 精确匹配
    baseConditions.push({ category: grammarPoint });
    
    // 条件2：grammarPoint 精确匹配
    baseConditions.push({ grammarPoint: grammarPoint });
    
    // 条件3：tag 精确匹配（兼容旧数据）
    baseConditions.push({ tag: grammarPoint });
    
    // 如果有学段限制
    if (schoolLevel) {
      // 为每个条件添加 schoolLevel
      baseConditions.forEach(condition => {
        condition.schoolLevel = schoolLevel;
      });
    }
    
    // 构建最终查询条件
    let whereCondition = {
      $or: baseConditions
    };
    
    // 如果有 type 限制，需要在 OR 条件内部添加
    if (type) {
      // 重新构建条件，每个条件都包含 type
      const conditionsWithType = baseConditions.map(condition => ({
        ...condition,
        type: type
      }));
      whereCondition = {
        $or: conditionsWithType
      };
    }
    
    console.log('🔍 改进查询条件:', JSON.stringify(whereCondition, null, 2));
    
    // 执行查询
    const result = await questionsCollection
      .where(whereCondition)
      .limit(limit)
      .get();
    
    console.log(`✅ 找到 ${result.data.length} 题（使用 OR 查询）`);
    
    return result.data;
    
  } catch (error) {
    console.error('❌ 查询失败:', error);
    throw error;
  }
}

/**
 * 更灵活的查询函数：支持层级查询
 * 
 * 查询策略：
 * 1. 先尝试精确匹配（category 或 grammarPoint）
 * 2. 如果结果不足，尝试父类查询
 * 3. 如果还不足，尝试模糊匹配
 */
async function getQuestionsByGrammarPointFlexible(grammarPoint, schoolLevel = null, type = null, limit = 20) {
  try {
    const db = wx.cloud.database();
    const _ = db.command;
    const questionsCollection = db.collection('questions');
    
    // 定义父类映射（示例）
    const parentCategoryMapping = {
      '关系代词': '代词',
      '物主代词': '代词',
      '反身代词': '代词',
      '人称代词': '代词',
      'it相关': '代词',
      '一般现在时': '动词时态',
      '一般过去时': '动词时态',
      '现在完成时': '动词时态',
      '定语从句': '复合句',
      '状语从句': '复合句',
      '宾语从句': '复合句',
      // ... 更多映射
    };
    
    // 步骤1：精确匹配（OR 查询）
    const exactConditions = [
      { category: grammarPoint },
      { grammarPoint: grammarPoint },
      { tag: grammarPoint }
    ];
    
    if (schoolLevel) {
      exactConditions.forEach(condition => {
        condition.schoolLevel = schoolLevel;
      });
    }
    
    if (type) {
      exactConditions.forEach(condition => {
        condition.type = type;
      });
    }
    
    let result = await questionsCollection
      .where(_.or(exactConditions))
      .limit(limit)
      .get();
    
    console.log(`🔍 步骤1（精确匹配）: 找到 ${result.data.length} 题`);
    
    // 如果结果足够，直接返回
    if (result.data.length >= limit * 0.8) {
      return result.data;
    }
    
    // 步骤2：尝试父类查询
    const parentCategory = parentCategoryMapping[grammarPoint];
    if (parentCategory && result.data.length < limit) {
      const parentConditions = [
        { category: parentCategory },
        { category: parentCategory, grammarPoint: grammarPoint }
      ];
      
      if (schoolLevel) {
        parentConditions.forEach(condition => {
          condition.schoolLevel = schoolLevel;
        });
      }
      
      if (type) {
        parentConditions.forEach(condition => {
          condition.type = type;
        });
      }
      
      const parentResult = await questionsCollection
        .where(_.or(parentConditions))
        .limit(limit - result.data.length)
        .get();
      
      console.log(`🔍 步骤2（父类查询）: 找到 ${parentResult.data.length} 题`);
      
      // 合并结果，去重
      const existingIds = new Set(result.data.map(q => q._id));
      const newQuestions = parentResult.data.filter(q => !existingIds.has(q._id));
      result.data = [...result.data, ...newQuestions];
    }
    
    // 步骤3：如果结果还是不足，尝试模糊匹配
    if (result.data.length < limit) {
      console.log(`⚠️ 结果不足，尝试模糊匹配...`);
      // 这里可以添加模糊匹配逻辑
    }
    
    return result.data.slice(0, limit);
    
  } catch (error) {
    console.error('❌ 查询失败:', error);
    throw error;
  }
}

/**
 * 在 cloudDataLoader.js 中的实际修改示例
 * 
 * 修改位置：getQuestionsByGrammarPoint 函数
 * 
 * 原代码（步骤1b）:
 * ```javascript
 * let result = await wx.cloud.database()
 *   .collection('questions')
 *   .where(buildWhereCondition(actualCategory, type))
 *   .limit(limit)
 *   .get();
 * ```
 * 
 * 修改为:
 * ```javascript
 * // 使用 OR 查询同时匹配 category 和 grammarPoint
 * const orConditions = [
 *   { category: actualCategory },
 *   { grammarPoint: actualGrammarPoint || actualCategory },
 *   { tag: actualGrammarPoint || actualCategory }
 * ];
 * 
 * // 添加其他条件
 * if (schoolLevel) {
 *   orConditions.forEach(condition => {
 *     condition.schoolLevel = schoolLevel;
 *   });
 * }
 * 
 * if (type) {
 *   orConditions.forEach(condition => {
 *     condition.type = type;
 *   });
 * }
 * 
 * let result = await wx.cloud.database()
 *   .collection('questions')
 *   .where(db.command.or(orConditions))
 *   .limit(limit)
 *   .get();
 * ```
 */

// 导出函数（如果在 Node.js 环境中）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getQuestionsByGrammarPointImproved,
    getQuestionsByGrammarPointFlexible
  };
}

console.log('📝 改进的查询逻辑示例已加载');
console.log('💡 使用方法:');
console.log('   1. 查看 getQuestionsByGrammarPointImproved - 简单的 OR 查询');
console.log('   2. 查看 getQuestionsByGrammarPointFlexible - 带层级查询的版本');
console.log('   3. 参考注释中的修改建议，更新 cloudDataLoader.js');
