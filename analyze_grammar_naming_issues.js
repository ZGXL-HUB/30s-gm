// 分析语法点名称一致性问题
console.log('=== 语法点名称一致性分析 ===\n');

// 1. 前端界面语法点名称（来自 grammar-select/index.js）
const frontendGrammarPoints = [
  // 介词类
  "介词综合", "固定搭配", "介词 + 名词/动名词",
  
  // 代词类
  "代词综合", "人称代词", "物主代词", "反身代词", "关系代词", "it相关",
  
  // 连词类
  "并列连词综合", "从属连词综合", "连词与名/动/形/副综合", "连词与名词", "连词与动词", "连词与形容词",
  
  // 冠词类
  "冠词综合", "泛指与特指", "a和an", "the的特殊用法",
  
  // 名词类
  "名词综合", "复合词和外来词", "单复数同形", "不规则复数", "以o结尾", "以y结尾", "s/sh/ch/x结尾", "以f/fe结尾",
  
  // 动词类
  "被动写be吗", "并列句与动词", "主从句与动词", "插入语与动词",
  
  // 谓语类
  "谓语", "时态(一般过去时)", "时态(一般将来时)", "时态(过去将来时)", "时态(现在进行时)", "时态(过去进行时)", "时态(现在完成时)", "时态(过去完成时)", "语态(被动+八大时态)",
  
  // 非谓语类
  "现在分词综合", "过去分词综合", "不定式综合",
  
  // 形容词类
  "形容词综合", "比较级", "最高级",
  
  // 副词类
  "副词综合", "副词修饰动词", "副词修饰句子", "副词修饰形容词/副词",
  
  // 定语从句类
  "定语从句综合", "that能填吗", "who和which选哪个", "whose", "which和when/where混淆",
  
  // 状语从句类
  "状语从句综合", "when", "where", "how", "why"
];

// 2. 云数据库可能的分类名称（基于历史数据推测）
const possibleCloudCategories = [
  // 介词相关
  "介词综合", "固定搭配", "介词(1)", "介词(2)", "介词(3)",
  
  // 代词相关
  "代词综合", "人称代词", "物主代词", "反身代词", "关系代词", "it相关", "代词(1)", "代词(2)", "代词(3)", "代词(4)", "代词(5)", "代词(6)",
  
  // 连词相关
  "连词综合", "连词(1)", "连词(2)", "连词(3)", "连词(4)", "连词(5)", "连词(6)", "连词与名词", "连词与动词", "连词与形容词",
  
  // 冠词相关
  "冠词综合", "冠词(1)", "冠词(2)", "冠词(3)", "冠词(4)", "泛指与特指", "a和an", "the的特殊用法",
  
  // 名词相关
  "名词综合", "名词(1)", "名词(2)", "名词(3)", "名词(4)", "名词(5)", "名词(6)", "复合词和外来词", "不规则复数", "以o结尾", "以y结尾", "s/sh/ch/x结尾", "以f/fe结尾",
  
  // 动词相关
  "动词综合", "动词(1)", "动词(2)", "动词(3)", "动词(4)", "动词(5)", "被动写be吗", "并列句与动词", "主从句与动词", "插入语与动词",
  
  // 谓语相关
  "谓语", "谓语(1)", "谓语(2)", "谓语(3)", "谓语(4)", "谓语(5)", "谓语(6)", "谓语(7)", "谓语(8)", "谓语(9)", "时态综合", "语态综合", "过去时", "进行时", "完成时",
  
  // 非谓语相关
  "非谓语综合", "非谓语(1)", "非谓语(2)", "非谓语(3)", "现在分词综合", "过去分词综合", "不定式综合",
  
  // 形容词相关
  "形容词综合", "形容词(1)", "形容词(2)", "形容词(3)", "比较级", "最高级",
  
  // 副词相关
  "副词综合", "副词(1)", "副词(2)", "副词修饰动词", "副词修饰句子", "副词修饰形容词/副词",
  
  // 从句相关
  "定语从句综合", "状语从句综合", "that能填吗", "who和which选哪个", "whose", "which和when/where混淆", "when", "where", "how", "why"
];

// 3. 分析问题
console.log('📊 前端语法点总数:', frontendGrammarPoints.length);
console.log('📊 可能的云数据库分类数:', possibleCloudCategories.length);

console.log('\n🔍 潜在的不一致问题:');

// 检查前端语法点是否在云数据库分类中
const inconsistentPoints = [];
const missingPoints = [];

frontendGrammarPoints.forEach(point => {
  const found = possibleCloudCategories.includes(point);
  if (!found) {
    // 尝试模糊匹配
    const fuzzyMatch = possibleCloudCategories.find(cat => 
      cat.includes(point) || point.includes(cat) ||
      cat.toLowerCase().includes(point.toLowerCase()) ||
      point.toLowerCase().includes(cat.toLowerCase())
    );
    
    if (fuzzyMatch) {
      inconsistentPoints.push({
        frontend: point,
        cloud: fuzzyMatch,
        type: 'fuzzy_match'
      });
    } else {
      missingPoints.push(point);
    }
  }
});

console.log('\n❌ 完全找不到的语法点:');
missingPoints.forEach(point => {
  console.log(`   - "${point}"`);
});

console.log('\n⚠️ 需要映射的语法点:');
inconsistentPoints.forEach(item => {
  console.log(`   - 前端: "${item.frontend}" → 云数据库: "${item.cloud}"`);
});

// 4. 特殊问题分析
console.log('\n🔍 特殊问题分析:');

const specialIssues = [
  {
    frontend: "单复数同形",
    issue: "可能不存在，需要映射到'名词综合'或'名词复数书写综合'",
    suggestion: "检查云数据库中是否有此分类，或使用映射"
  },
  {
    frontend: "语态(被动+八大时态)",
    issue: "名称过长，可能映射到'被动语态'或'语态综合'",
    suggestion: "简化名称或使用映射表"
  },
  {
    frontend: "时态(一般过去时)",
    issue: "可能映射到'过去时'或'谓语(2)'",
    suggestion: "统一时态命名规范"
  },
  {
    frontend: "副词修饰形容词/副词",
    issue: "名称包含特殊字符，可能影响查询",
    suggestion: "考虑简化名称"
  }
];

specialIssues.forEach(issue => {
  console.log(`\n   📝 "${issue.frontend}":`);
  console.log(`      问题: ${issue.issue}`);
  console.log(`      建议: ${issue.suggestion}`);
});

// 5. 建议的解决方案
console.log('\n💡 建议的解决方案:');

console.log('\n1. 立即检查云数据库实际分类:');
console.log('   - 运行 check_cloud_categories.js');
console.log('   - 查看云数据库中的真实分类名称');

console.log('\n2. 创建映射表（临时方案）:');
console.log('   - 为不一致的语法点创建映射');
console.log('   - 在 cloudDataLoader.js 中使用映射表');

console.log('\n3. 长期规范化（推荐）:');
console.log('   - 统一前端和云数据库的命名');
console.log('   - 使用 displayName 字段存储前端显示名称');
console.log('   - 简化查询逻辑');

console.log('\n4. 特殊处理:');
console.log('   - 为不存在的语法点添加题目');
console.log('   - 或映射到相近的现有分类');

console.log('\n=== 分析完成 ===');
