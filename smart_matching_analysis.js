// 智能匹配分析
console.log('=== 智能匹配分析 ===\n');

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

console.log('🎯 智能匹配建议：\n');

// 1. "介词 + 名词/动名词" 可能匹配
console.log('1. "介词 + 名词/动名词":');
console.log('   可能匹配: "介词综合" (如果存在)');
console.log('   或者: "名词综合" (介词通常涉及名词)');
console.log('   建议: 检查是否有"介词综合"分类\n');

// 2. "以f/fe结尾" 可能匹配
console.log('2. "以f/fe结尾":');
const feRelated = cloudCategories.filter(cat => cat.includes('f') || cat.includes('复数'));
console.log(`   相关分类: ${feRelated.join(', ')}`);
console.log('   可能匹配: "名词综合" (复数变化属于名词范畴)\n');

// 3. "语态(被动+八大时态)" 已知映射
console.log('3. "语态(被动+八大时态)":');
console.log('   已映射: "被动语态" ✅\n');

// 4. "副词修饰句子" 可能匹配
console.log('4. "副词修饰句子":');
const adverbRelated = cloudCategories.filter(cat => cat.includes('副词'));
console.log(`   副词相关: ${adverbRelated.join(', ')}`);
console.log('   最可能匹配: "副词综合" (句子修饰属于副词综合用法)\n');

console.log('📝 建议的完整映射表：');
console.log('const specialMapping = {');
console.log('  "单复数同形": "名词综合",');
console.log('  "语态(被动+八大时态)": "被动语态",');
console.log('  "固定搭配": "介词综合",');
console.log('  "介词 + 名词/动名词": "名词综合",  // 临时映射到名词综合');
console.log('  "以f/fe结尾": "名词综合",         // 复数变化属于名词');
console.log('  "副词修饰句子": "副词综合"        // 句子修饰属于副词综合');
console.log('};');
