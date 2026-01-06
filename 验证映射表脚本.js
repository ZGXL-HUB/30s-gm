/**
 * 验证初高中自选模块映射表脚本
 * 为每个映射查找一道示例题目进行验证
 */

// 初中模块映射表
const middleMapping = {
  // 名词
  "名词所有格": { category: "名词", grammarPoint: "名词所有格", schoolLevel: "middle" },
  "名词的复数": { category: "名词", grammarPoint: "名词的复数", schoolLevel: "middle" },
  "名词辨析": { category: "名词", grammarPoint: "名词的复数", schoolLevel: "middle" },
  
  // 代词
  "人称代词": { category: "代词", grammarPoint: "人称代词", schoolLevel: "middle" },
  "物主代词": { category: "代词", grammarPoint: "物主代词", schoolLevel: "middle" },
  "反身代词": { category: "代词", grammarPoint: "反身代词", schoolLevel: "middle" },
  "不定代词": { category: "代词", grammarPoint: "不定代词", schoolLevel: "middle" },
  "关系代词": { category: "代词", grammarPoint: "关系代词", schoolLevel: "middle" },
  
  // 形容词与副词
  "形容词作定语": { category: "形容词与副词", grammarPoint: "形容词作定语", schoolLevel: "middle" },
  "副词的基本用法": { category: "形容词与副词", grammarPoint: "副词的基本用法", schoolLevel: "middle" },
  "比较级和最高级": { category: "形容词与副词", grammarPoint: "比较级和最高级", schoolLevel: "middle" },
  "位置与用法": { category: "形容词与副词", grammarPoint: "副词的基本用法", schoolLevel: "middle" },
  
  // 动词
  "动词的形式": { category: "动词", grammarPoint: "动词的形式", schoolLevel: "middle" },
  "情态动词": { category: "动词", grammarPoint: "情态动词", schoolLevel: "middle" },
  "can/could": { category: "动词", grammarPoint: "情态动词", schoolLevel: "middle" },
  "must/need": { category: "动词", grammarPoint: "情态动词", schoolLevel: "middle" },
  "非谓语动词": { category: "动词", grammarPoint: "非谓语动词", schoolLevel: "middle" },
  "动名词": { category: "动词", grammarPoint: "非谓语动词", schoolLevel: "middle" },
  "动词不定式": { category: "动词", grammarPoint: "非谓语动词", schoolLevel: "middle" },
  
  // 介词
  "时间介词": { category: "介词", grammarPoint: "时间介词", schoolLevel: "middle" },
  "地点介词": { category: "介词", grammarPoint: "地点介词", schoolLevel: "middle" },
  "其他介词": { category: "介词", grammarPoint: "其他介词", schoolLevel: "middle" },
  "地点/方式介词": { category: "介词", grammarPoint: "其他介词", schoolLevel: "middle" },
  
  // 冠词
  "不定冠词": { category: "冠词", grammarPoint: "不定冠词", schoolLevel: "middle" },
  "定冠词": { category: "冠词", grammarPoint: "定冠词", schoolLevel: "middle" },
  "零冠词": { category: "冠词", grammarPoint: "零冠词", schoolLevel: "middle" },
  
  // 数词
  "基数词与序数词": { category: "数词", grammarPoint: "基数词与序数词", schoolLevel: "middle" },
  "数词的应用": { category: "数词", grammarPoint: "数词的应用", schoolLevel: "middle" },
  
  // 连词
  "并列连词": { category: "连词", grammarPoint: "并列连词", schoolLevel: "middle" },
  "从属连词": { category: "连词", grammarPoint: "从属连词", schoolLevel: "middle" },
  "连接词": { category: "连词", grammarPoint: "从属连词", schoolLevel: "middle" },
  
  // 句子成分与基本句型
  "主谓宾结构": { category: "句子成分与基本句型", grammarPoint: "主谓宾结构", schoolLevel: "middle" },
  "主系表结构": { category: "句子成分与基本句型", grammarPoint: "主系表结构", schoolLevel: "middle" },
  
  // 动词时态
  "一般现在时": { category: "动词时态", grammarPoint: "一般现在时", schoolLevel: "middle" },
  "一般过去时": { category: "动词时态", grammarPoint: "一般过去时", schoolLevel: "middle" },
  "一般将来时": { category: "动词时态", grammarPoint: "一般将来时", schoolLevel: "middle" },
  "现在进行时": { category: "动词时态", grammarPoint: "现在进行时", schoolLevel: "middle" },
  "过去进行时": { category: "动词时态", grammarPoint: "过去进行时", schoolLevel: "middle" },
  "现在完成时": { category: "动词时态", grammarPoint: "现在完成时", schoolLevel: "middle" },
  "过去完成时": { category: "动词时态", grammarPoint: "过去完成时", schoolLevel: "middle" },
  
  // 被动语态
  "一般时被动": { category: "被动语态", grammarPoint: "一般时态的被动语态", schoolLevel: "middle" },
  "一般时态的被动语态": { category: "被动语态", grammarPoint: "一般时态的被动语态", schoolLevel: "middle" },
  "完成时态的被动语态": { category: "被动语态", grammarPoint: "完成时态的被动语态", schoolLevel: "middle" },
  
  // 主谓一致
  "语法一致原则": { category: "主谓一致", grammarPoint: "语法一致原则", schoolLevel: "middle" },
  "意义一致原则": { category: "主谓一致", grammarPoint: "意义一致原则", schoolLevel: "middle" },
  "就近原则": { category: "主谓一致", grammarPoint: "就近原则", schoolLevel: "middle" },
  "时态一致": { category: "主谓一致", grammarPoint: "语法一致原则", schoolLevel: "middle" },
  
  // 复合句
  "宾语从句": { category: "复合句", grammarPoint: "宾语从句", schoolLevel: "middle" },
  "定语从句": { category: "复合句", grammarPoint: "定语从句", schoolLevel: "middle" },
  "状语从句": { category: "复合句", grammarPoint: "状语从句", schoolLevel: "middle" },
  "时间状语从句": { category: "复合句", grammarPoint: "状语从句", schoolLevel: "middle" },
  "条件状语从句": { category: "复合句", grammarPoint: "状语从句", schoolLevel: "middle" },
  
  // 特殊句式
  "There be句型": { category: "特殊句式", grammarPoint: "There be 句型", schoolLevel: "middle" },
  "感叹句": { category: "特殊句式", grammarPoint: "感叹句", schoolLevel: "middle" },
  "祈使句": { category: "特殊句式", grammarPoint: "祈使句", schoolLevel: "middle" },
  "倒装句": { category: "特殊句式", grammarPoint: "倒装句", schoolLevel: "middle" },
  "疑问句": { category: "特殊句式", grammarPoint: "疑问句", schoolLevel: "middle" }
};

// 高中模块映射表
const highMapping = {
  // 时态
  "一般过去时": { category: "时态综合", schoolLevel: "high" },
  "一般将来时": { category: "时态综合", schoolLevel: "high" },
  "过去将来时": { category: "时态综合", schoolLevel: "high" },
  "现在进行时": { category: "时态综合", schoolLevel: "high" },
  "过去进行时": { category: "时态综合", schoolLevel: "high" },
  "现在完成时": { category: "时态综合", schoolLevel: "high" },
  "过去完成时": { category: "时态综合", schoolLevel: "high" },
  "时态(一般过去时)": { category: "时态综合", schoolLevel: "high" },
  "时态(一般将来时)": { category: "时态综合", schoolLevel: "high" },
  "时态(过去将来时)": { category: "时态综合", schoolLevel: "high" },
  "时态(现在进行时)": { category: "时态综合", schoolLevel: "high" },
  "时态(过去进行时)": { category: "时态综合", schoolLevel: "high" },
  "时态(现在完成时)": { category: "时态综合", schoolLevel: "high" },
  "时态(过去完成时)": { category: "时态综合", schoolLevel: "high" },
  
  // 语态
  "被动语态": { category: "语态综合", schoolLevel: "high" },
  "语态(被动+八大时态)": { category: "语态综合", schoolLevel: "high" },
  
  // 谓语
  "谓语": { category: "谓语综合", schoolLevel: "high" },
  
  // 名词
  "单复数同形": { category: "单复数同形", schoolLevel: "high" },
  "f/fe结尾": { category: "f/fe结尾", schoolLevel: "high" },
  "以f/fe结尾": { category: "f/fe结尾", schoolLevel: "high" },
  "s/sh/ch/x结尾": { category: "s/sh/ch/x结尾", schoolLevel: "high" },
  "复合词和外来词": { category: "复合词和外来词", schoolLevel: "high" },
  "泛指与特指": { category: "泛指与特指", schoolLevel: "high" },
  "不规则复数": { category: "不规则复数", schoolLevel: "high" },
  "以o结尾": { category: "以o结尾", schoolLevel: "high" },
  "以y结尾": { category: "以y结尾", schoolLevel: "high" },
  
  // 代词
  "关系代词": { category: "关系代词", schoolLevel: "high" },
  "反身代词": { category: "反身代词", schoolLevel: "high" },
  "人称代词": { category: "人称代词", schoolLevel: "high" },
  
  // 介词
  "介词综合": { category: "介词综合", schoolLevel: "high" },
  "固定搭配": { category: "固定搭配", schoolLevel: "high" },
  
  // 连词
  "连词综合": { category: "连词综合", schoolLevel: "high" },
  "连词与名词": { category: "连词综合", schoolLevel: "high" },
  "连词与动词": { category: "连词综合", schoolLevel: "high" },
  "连词与形容词": { category: "连词综合", schoolLevel: "high" },
  
  // 冠词
  "a和an": { category: "冠词综合", schoolLevel: "high" },
  "the的特殊用法": { category: "冠词综合", schoolLevel: "high" },
  
  // 动词
  "动词综合": { category: "动词综合", schoolLevel: "high" },
  "插入语与动词": { category: "动词综合", schoolLevel: "high" },
  "主从句与动词": { category: "动词综合", schoolLevel: "high" },
  "并列句与动词": { category: "动词综合", schoolLevel: "high" },
  
  // 非谓语
  "现在分词综合": { category: "现在分词综合", schoolLevel: "high" },
  "过去分词综合": { category: "过去分词综合", schoolLevel: "high" },
  "不定式综合": { category: "不定式综合", schoolLevel: "high" },
  
  // 形容词
  "比较级": { category: "形容词综合", schoolLevel: "high" },
  "最高级": { category: "形容词综合", schoolLevel: "high" },
  
  // 副词
  "副词修饰句子": { category: "副词修饰句子", schoolLevel: "high" },
  "副词修饰形容词/副词": { category: "副词综合", schoolLevel: "high" },
  "副词修饰动词": { category: "副词综合", schoolLevel: "high" },
  
  // 从句
  "定语从句综合": { category: "定语从句综合", schoolLevel: "high" },
  "状语从句综合": { category: "状语从句综合", schoolLevel: "high" }
};

// 查询单个映射的示例题目
async function verifyMapping(grammarPoint, mapping) {
  try {
    const db = wx.cloud.database();
    let query = db.collection('questions');
    
    // 构建查询条件
    const condition = { schoolLevel: mapping.schoolLevel };
    
    // 初中模块：优先使用 grammarPoint 精确匹配
    if (mapping.schoolLevel === 'middle' && mapping.grammarPoint) {
      condition.grammarPoint = mapping.grammarPoint;
      const result = await query.where(condition).limit(1).get();
      if (result.data.length > 0) {
        return {
          success: true,
          grammarPoint: grammarPoint,
          mapping: mapping,
          question: result.data[0],
          matchType: 'grammarPoint'
        };
      }
    }
    
    // 使用 category 匹配
    condition.category = mapping.category;
    if (mapping.grammarPoint) {
      delete condition.grammarPoint; // 移除 grammarPoint，改用 category
    }
    
    const result = await query.where(condition).limit(1).get();
    
    if (result.data.length > 0) {
      return {
        success: true,
        grammarPoint: grammarPoint,
        mapping: mapping,
        question: result.data[0],
        matchType: 'category'
      };
    } else {
      return {
        success: false,
        grammarPoint: grammarPoint,
        mapping: mapping,
        error: '未找到匹配的题目'
      };
    }
  } catch (error) {
    return {
      success: false,
      grammarPoint: grammarPoint,
      mapping: mapping,
      error: error.message
    };
  }
}

// 验证所有映射
async function verifyAllMappings() {
  console.log('📋 开始验证初高中自选模块映射表...\n');
  
  const results = {
    middle: { success: [], failed: [] },
    high: { success: [], failed: [] }
  };
  
  // 验证初中模块
  console.log('🔍 验证初中模块映射表...');
  for (const [grammarPoint, mapping] of Object.entries(middleMapping)) {
    const result = await verifyMapping(grammarPoint, mapping);
    if (result.success) {
      results.middle.success.push(result);
      console.log(`✅ ${grammarPoint}`);
      console.log(`   映射: category="${mapping.category}", grammarPoint="${mapping.grammarPoint || 'N/A'}"`);
      console.log(`   匹配方式: ${result.matchType}`);
      console.log(`   示例题目: ${result.question.text.substring(0, 50)}...`);
      console.log(`   题目category: ${result.question.category}, grammarPoint: ${result.question.grammarPoint}\n`);
    } else {
      results.middle.failed.push(result);
      console.log(`❌ ${grammarPoint}`);
      console.log(`   映射: category="${mapping.category}", grammarPoint="${mapping.grammarPoint || 'N/A'}"`);
      console.log(`   错误: ${result.error}\n`);
    }
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // 验证高中模块
  console.log('\n🔍 验证高中模块映射表...');
  for (const [grammarPoint, mapping] of Object.entries(highMapping)) {
    const result = await verifyMapping(grammarPoint, mapping);
    if (result.success) {
      results.high.success.push(result);
      console.log(`✅ ${grammarPoint}`);
      console.log(`   映射: category="${mapping.category}"`);
      console.log(`   匹配方式: ${result.matchType}`);
      console.log(`   示例题目: ${result.question.text.substring(0, 50)}...`);
      console.log(`   题目category: ${result.question.category}, grammarPoint: ${result.question.grammarPoint || 'N/A'}\n`);
    } else {
      results.high.failed.push(result);
      console.log(`❌ ${grammarPoint}`);
      console.log(`   映射: category="${mapping.category}"`);
      console.log(`   错误: ${result.error}\n`);
    }
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // 输出统计
  console.log('\n📊 验证结果统计:');
  console.log(`初中模块: ✅ ${results.middle.success.length} 个成功, ❌ ${results.middle.failed.length} 个失败`);
  console.log(`高中模块: ✅ ${results.high.success.length} 个成功, ❌ ${results.high.failed.length} 个失败`);
  
  if (results.middle.failed.length > 0) {
    console.log('\n❌ 初中模块失败的映射:');
    results.middle.failed.forEach(r => {
      console.log(`   - ${r.grammarPoint}: ${r.error}`);
    });
  }
  
  if (results.high.failed.length > 0) {
    console.log('\n❌ 高中模块失败的映射:');
    results.high.failed.forEach(r => {
      console.log(`   - ${r.grammarPoint}: ${r.error}`);
    });
  }
  
  return results;
}

// 导出函数（如果是在小程序中使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    verifyMapping,
    verifyAllMappings,
    middleMapping,
    highMapping
  };
}

// 如果直接运行，执行验证
if (typeof wx !== 'undefined' && wx.cloud) {
  verifyAllMappings().catch(console.error);
}

