// 查找语法点在云数据库中的确切名称
console.log('=== 查找语法点的确切名称 ===\n');

const problemPoints = [
  "固定搭配",
  "单复数同形", 
  "语态(被动+八大时态)"
];

const findExactNames = async () => {
  // 获取所有题目的category（需要分页）
  const getAllCategories = async () => {
    const MAX = 20;
    let skip = 0;
    const allCategories = new Set();
    
    console.log('📊 扫描云数据库所有分类...\n');
    
    while (true) {
      const result = await wx.cloud.database()
        .collection('questions')
        .field({ category: true, text: true })
        .skip(skip)
        .limit(MAX)
        .get();
      
      if (result.data.length === 0) break;
      
      result.data.forEach(q => {
        if (q.category) {
          allCategories.add(q.category);
        }
      });
      
      skip += MAX;
      
      if (skip % 200 === 0) {
        console.log(`   已扫描 ${skip} 题...`);
      }
    }
    
    return Array.from(allCategories).sort();
  };
  
  const allCategories = await getAllCategories();
  
  console.log(`✅ 扫描完成，找到 ${allCategories.length} 个分类\n`);
  console.log('📋 所有分类列表:');
  allCategories.forEach((cat, i) => {
    console.log(`   ${i + 1}. "${cat}"`);
  });
  
  console.log('\n🔍 查找问题语法点的可能匹配:\n');
  
  problemPoints.forEach(point => {
    console.log(`"${point}":`);
    
    // 精确匹配
    if (allCategories.includes(point)) {
      console.log(`   ✅ 精确匹配: "${point}"`);
      return;
    }
    
    // 模糊匹配
    const fuzzyMatches = allCategories.filter(cat => {
      const pointLower = point.toLowerCase().replace(/[()（）+]/g, '');
      const catLower = cat.toLowerCase().replace(/[()（）+]/g, '');
      
      return catLower.includes(pointLower) || 
             pointLower.includes(catLower) ||
             cat.includes(point) ||
             point.includes(cat);
    });
    
    if (fuzzyMatches.length > 0) {
      console.log(`   ⚠️ 可能的匹配:`);
      fuzzyMatches.forEach(match => console.log(`      - "${match}"`));
    } else {
      console.log(`   ❌ 完全未找到`);
    }
    
    console.log('');
  });
  
  // 查找具体题目
  console.log('📝 查找具体题目内容:\n');
  
  for (const point of problemPoints) {
    const keywords = point.split(/[()（）+]/)[0];  // 提取主要关键词
    
    const result = await wx.cloud.database()
      .collection('questions')
      .limit(1000)
      .get();
    
    const matches = result.data.filter(q => 
      (q.text || '').includes(keywords) ||
      (q.analysis || '').includes(keywords) ||
      (q.category || '').includes(keywords)
    );
    
    if (matches.length > 0) {
      console.log(`"${point}" 可能在以下分类中:`);
      const cats = [...new Set(matches.map(q => q.category))];
      cats.forEach(cat => {
        const count = matches.filter(q => q.category === cat).length;
        console.log(`   - "${cat}": ${count}题`);
      });
      console.log(`   示例题目: ${matches[0].text.substring(0, 50)}...`);
    } else {
      console.log(`"${point}": 未找到相关题目`);
    }
    
    console.log('');
  }
};

findExactNames();

