// 检查缺失的语法点
console.log('=== 检查缺失的语法点 ===\n');

// 根据您选择的10个语法点，检查云数据库中的实际名称
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

// 从之前的扫描结果看，云数据库中有54个分类
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

console.log('🔍 分析匹配情况：\n');

selectedPoints.forEach(point => {
  const exactMatch = cloudCategories.find(cat => cat === point);
  const fuzzyMatch = cloudCategories.filter(cat => 
    cat.includes(point) || point.includes(cat)
  );
  
  if (exactMatch) {
    console.log(`✅ "${point}" → 完全匹配: "${exactMatch}"`);
  } else if (fuzzyMatch.length > 0) {
    console.log(`⚠️  "${point}" → 模糊匹配: ${fuzzyMatch.map(m => `"${m}"`).join(', ')}`);
  } else {
    console.log(`❌ "${point}" → 未找到匹配`);
  }
});

console.log('\n📝 建议的映射表更新：');

// 分析需要添加的映射
const newMappings = {};

selectedPoints.forEach(point => {
  const exactMatch = cloudCategories.find(cat => cat === point);
  if (!exactMatch) {
    // 寻找最相似的匹配
    let bestMatch = null;
    let maxSimilarity = 0;
    
    cloudCategories.forEach(cat => {
      // 计算相似度（简单的包含关系）
      if (cat.includes(point) || point.includes(cat)) {
        const similarity = Math.min(cat.length, point.length) / Math.max(cat.length, point.length);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          bestMatch = cat;
        }
      }
    });
    
    if (bestMatch) {
      newMappings[point] = bestMatch;
      console.log(`"${point}": "${bestMatch}",`);
    } else {
      console.log(`"${point}": "未找到合适映射",`);
    }
  }
});

console.log('\n🎯 需要立即修复的映射：');
Object.entries(newMappings).forEach(([key, value]) => {
  console.log(`"${key}" → "${value}"`);
});