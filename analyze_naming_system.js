// 分析当前的命名系统
console.log('=== 分析命名系统 ===');

// 1. 界面上的语法点（来自 grammarTopics）
const uiGrammarPoints = {
  "介词": ["介词综合", "固定搭配", "介词 + 名词/动名词"],
  "代词": ["代词综合", "人称代词", "物主代词", "反身代词", "关系代词", "it相关"],
  "连词": ["连词综合", "并列连词", "从属连词综合", "连词与动词", "连词与形容词", "连词与名词"],
  "冠词": ["冠词综合", "a和an", "泛指与特指", "the的特殊用法"],
  "名词": ["名词综合", "不规则复数", "f/fe结尾", "辅音字母+y", "s/x/ch/sh", "o结尾", "规则变复数"],
  "动词": ["动词综合", "be", "have/has", "助动词", "情态动词"],
  "谓语": ["时态综合", "时态(过去完成时)", "时态(过去进行时)", "语态综合", "语态(被动+八大时态)", "主从句与动词", "插入语与动词", "并列主语与动词", "倒装与动词"],
  "非谓语": ["非谓语综合", "现在分词综合", "过去分词综合"],
  "形容词": ["形容词综合", "比较级", "最高级"],
  "副词": ["副词综合", "副词修饰形容词/副词", "副词修饰句子"]
};

console.log('📊 界面语法点统计:');
let totalUI = 0;
Object.keys(uiGrammarPoints).forEach(cat => {
  console.log(`   ${cat}: ${uiGrammarPoints[cat].length} 个小点`);
  totalUI += uiGrammarPoints[cat].length;
});
console.log(`   总计: ${totalUI} 个小语法点`);

// 2. 查看云数据库的实际分类
console.log('\n📊 云数据库分类分析:');
console.log('正在查询...');

wx.cloud.database()
  .collection('questions')
  .field({ category: true, grammarPoint: true })
  .limit(1000)
  .get()
  .then(result => {
    console.log('✅ 查询成功，总题目数:', result.data.length);
    
    // 统计 category 字段
    const categories = {};
    const grammarPoints = {};
    
    result.data.forEach(q => {
      const cat = q.category || '未分类';
      const gp = q.grammarPoint || '未设置';
      
      categories[cat] = (categories[cat] || 0) + 1;
      grammarPoints[gp] = (grammarPoints[gp] || 0) + 1;
    });
    
    console.log('\n📋 云数据库 category 字段分布:');
    const sortedCats = Object.keys(categories).sort();
    sortedCats.forEach(cat => {
      console.log(`   "${cat}": ${categories[cat]} 题`);
    });
    
    console.log('\n📋 云数据库 grammarPoint 字段分布:');
    const sortedGPs = Object.keys(grammarPoints).sort();
    sortedGPs.slice(0, 20).forEach(gp => {
      console.log(`   "${gp}": ${grammarPoints[gp]} 题`);
    });
    
    // 3. 对比分析
    console.log('\n🔍 命名不一致问题:');
    console.log('界面上有但云数据库没有的语法点:');
    
    const unmatchedUI = [];
    Object.values(uiGrammarPoints).flat().forEach(point => {
      if (!sortedCats.includes(point) && !sortedGPs.includes(point)) {
        unmatchedUI.push(point);
      }
    });
    
    console.log(unmatchedUI);
    
    console.log('\n💡 建议:');
    console.log('1. 统一命名规范: 大类-小类 格式（如 "介词-综合"、"介词-固定搭配"）');
    console.log('2. 或使用编号系统: 大类(序号) 格式（如 "介词(1)"、"介词(2)"）');
    console.log('3. 或统一使用中文描述性名称（如当前界面的命名）');
    
  })
  .catch(error => {
    console.error('❌ 查询失败:', error);
  });

