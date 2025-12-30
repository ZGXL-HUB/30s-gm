// 验证云数据库完整性
console.log('=== 验证云数据库 ===\n');

// 统计总题目数
wx.cloud.database()
  .collection('questions')
  .count()
  .then(countRes => {
    console.log(`✅ 题目总数: ${countRes.total}\n`);
    
    // 获取所有分类（分页查询）
    const getAllCategories = async () => {
      const MAX = 20;  // 每次最多20条
      const total = countRes.total;
      const batches = Math.ceil(total / MAX);
      
      console.log(`📊 分批获取分类信息（共${batches}批）...\n`);
      
      const allCategories = new Set();
      
      for (let i = 0; i < batches; i++) {
        const result = await wx.cloud.database()
          .collection('questions')
          .field({ category: true })
          .skip(i * MAX)
          .limit(MAX)
          .get();
        
        result.data.forEach(q => {
          if (q.category) {
            allCategories.add(q.category);
          }
        });
        
        if ((i + 1) % 10 === 0) {
          console.log(`   已扫描 ${(i + 1) * MAX}/${total} 题...`);
        }
      }
      
      const categories = Array.from(allCategories).sort();
      
      console.log(`\n✅ 分类统计完成:`);
      console.log(`   总分类数: ${categories.length}`);
      console.log(`\n📋 所有分类列表:`);
      categories.forEach((cat, i) => {
        console.log(`   ${i + 1}. "${cat}"`);
      });
      
      // 检查界面语法点的匹配情况
      console.log(`\n🔍 检查界面语法点匹配情况:\n`);
      
      const uiPoints = [
        "介词综合", "固定搭配", "介词 + 名词/动名词",
        "代词综合", "人称代词", "it相关",
        "连词综合", "从属连词综合", "连词与形容词",
        "冠词综合", "泛指与特指", "the的特殊用法",
        "名词综合", "不规则复数", "f/fe结尾",
        "时态综合", "时态(过去完成时)", "语态综合",
        "现在分词综合", "过去分词综合", "不定式综合",
        "形容词综合", "比较级", "最高级",
        "副词综合", "副词修饰句子"
      ];
      
      let matched = 0;
      let unmatched = [];
      
      uiPoints.forEach(point => {
        if (categories.includes(point)) {
          console.log(`   ✅ "${point}"`);
          matched++;
        } else {
          console.log(`   ❌ "${point}"`);
          unmatched.push(point);
        }
      });
      
      console.log(`\n📊 匹配结果:`);
      console.log(`   ✅ 匹配: ${matched}/${uiPoints.length} (${(matched/uiPoints.length*100).toFixed(1)}%)`);
      console.log(`   ❌ 未匹配: ${unmatched.length}/${uiPoints.length}`);
      
      if (unmatched.length > 0) {
        console.log(`\n❌ 未匹配的语法点:`);
        unmatched.forEach(point => console.log(`   - "${point}"`));
      }
    };
    
    getAllCategories();
  });

