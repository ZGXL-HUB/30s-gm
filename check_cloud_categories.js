// 检查云数据库中的实际分类
console.log('=== 检查云数据库分类 ===');

wx.cloud.database()
  .collection('questions')
  .field({ category: true })
  .get()
  .then(result => {
    console.log('✅ 查询成功，数据量:', result.data.length);
    
    // 统计所有分类
    const categories = {};
    result.data.forEach(q => {
      const cat = q.category || '未分类';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    
    console.log('\n📊 云数据库中的所有分类:');
    Object.keys(categories).sort().forEach(cat => {
      console.log(`   "${cat}": ${categories[cat]} 题`);
    });
    
    console.log('\n🔍 需要映射的语法点:');
    const unmapped = [
      "不规则复数",
      "时态(过去完成时)",
      "副词修饰句子",
      "从属连词综合"
    ];
    
    unmapped.forEach(point => {
      console.log(`\n"${point}" 可能映射到:`);
      Object.keys(categories).forEach(cat => {
        if (cat.includes(point) || point.includes(cat) || 
            cat.toLowerCase().includes(point.toLowerCase()) ||
            point.toLowerCase().includes(cat.toLowerCase())) {
          console.log(`   - "${cat}" (${categories[cat]} 题)`);
        }
      });
    });
    
  })
  .catch(error => {
    console.error('❌ 查询失败:', error);
  });

console.log('\n正在查询云数据库...');
