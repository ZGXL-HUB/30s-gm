// 检查"固定搭配"的问题
console.log('=== 检查"固定搭配"问题 ===\n');

// 直接查询
wx.cloud.database()
  .collection('questions')
  .where({ category: "固定搭配" })
  .get()
  .then(res => {
    console.log('直接查询"固定搭配":', res.data.length, '题');
    
    if (res.data.length > 0) {
      console.log('示例题目:', res.data[0]);
    }
  });

// 模糊查询
wx.cloud.database()
  .collection('questions')
  .limit(1000)
  .get()
  .then(res => {
    const matches = res.data.filter(q => 
      (q.category || '').includes('固定') || 
      (q.category || '').includes('搭配')
    );
    
    console.log('\n模糊查询包含"固定"或"搭配":', matches.length, '题');
    
    if (matches.length > 0) {
      const categories = [...new Set(matches.map(q => q.category))];
      console.log('相关分类:', categories);
      console.log('第一题category:', `"${matches[0].category}"`);
      console.log('category字符编码:', matches[0].category.split('').map(c => c.charCodeAt(0)));
    }
  });

// 检查字符差异
const uiName = "固定搭配";
console.log('\n界面名称"固定搭配":');
console.log('  长度:', uiName.length);
console.log('  字符编码:', uiName.split('').map(c => c.charCodeAt(0)));

