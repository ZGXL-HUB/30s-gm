// 综合命名系统分析
console.log('=== 综合命名系统分析 ===\n');

// ==================== 第一部分：界面语法点分析 ====================
console.log('📱 第一部分：界面显示的语法点');
console.log('来源: teacher-homework/index.js 的 grammarTopics\n');

const uiGrammarTopics = [
  { 
    name: '介词', 
    points: [
      { name: '介词综合' },
      { name: '固定搭配' },
      { name: '介词 + 名词/动名词' }
    ]
  },
  { 
    name: '代词', 
    points: [
      { name: '代词综合' },
      { name: '人称代词' },
      { name: '物主代词' },
      { name: '反身代词' },
      { name: '关系代词' },
      { name: 'it相关' }
    ]
  },
  { 
    name: '连词', 
    points: [
      { name: '连词综合' },
      { name: '并列连词' },
      { name: '从属连词综合' },
      { name: '连词与动词' },
      { name: '连词与形容词' },
      { name: '连词与名词' }
    ]
  },
  { 
    name: '冠词', 
    points: [
      { name: '冠词综合' },
      { name: 'a和an' },
      { name: '泛指与特指' },
      { name: 'the的特殊用法' }
    ]
  },
  { 
    name: '名词', 
    points: [
      { name: '名词综合' },
      { name: '不规则复数' },
      { name: 'f/fe结尾' },
      { name: '辅音字母+y' },
      { name: 's/x/ch/sh' },
      { name: 'o结尾' },
      { name: '规则变复数' }
    ]
  },
  { 
    name: '动词', 
    points: [
      { name: '动词综合' },
      { name: 'be' },
      { name: 'have/has' },
      { name: '助动词' },
      { name: '情态动词' }
    ]
  },
  { 
    name: '谓语', 
    points: [
      { name: '时态综合' },
      { name: '时态(过去完成时)' },
      { name: '时态(过去进行时)' },
      { name: '语态综合' },
      { name: '语态(被动+八大时态)' },
      { name: '主从句与动词' },
      { name: '插入语与动词' },
      { name: '并列主语与动词' },
      { name: '倒装与动词' }
    ]
  },
  { 
    name: '非谓语', 
    points: [
      { name: '非谓语综合' },
      { name: '现在分词综合' },
      { name: '过去分词综合' }
    ]
  },
  { 
    name: '形容词', 
    points: [
      { name: '形容词综合' },
      { name: '比较级' },
      { name: '最高级' }
    ]
  },
  { 
    name: '副词', 
    points: [
      { name: '副词综合' },
      { name: '副词修饰形容词/副词' },
      { name: '副词修饰句子' }
    ]
  }
];

let totalPoints = 0;
uiGrammarTopics.forEach(topic => {
  console.log(`${topic.name} (${topic.points.length}个小点):`);
  topic.points.forEach((point, index) => {
    console.log(`  ${index + 1}. "${point.name}"`);
  });
  totalPoints += topic.points.length;
  console.log('');
});

console.log(`总计: ${uiGrammarTopics.length} 个大类, ${totalPoints} 个小语法点\n`);

// ==================== 第二部分：云数据库分析 ====================
console.log('☁️ 第二部分：云数据库实际分类');
console.log('正在查询云数据库...\n');

wx.cloud.database()
  .collection('questions')
  .field({ category: true, grammarPoint: true, text: true })
  .limit(1000)
  .get()
  .then(result => {
    console.log(`✅ 查询成功，总题目数: ${result.data.length}\n`);
    
    // 统计 category 字段
    const categoryCount = {};
    const grammarPointCount = {};
    
    result.data.forEach(q => {
      const cat = q.category || '未分类';
      const gp = q.grammarPoint || '未设置';
      
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      grammarPointCount[gp] = (grammarPointCount[gp] || 0) + 1;
    });
    
    console.log('📊 category 字段分布:');
    const sortedCats = Object.keys(categoryCount).sort();
    sortedCats.forEach(cat => {
      console.log(`   "${cat}": ${categoryCount[cat]} 题`);
    });
    
    console.log(`\n总计: ${sortedCats.length} 个不同的 category\n`);
    
    console.log('📊 grammarPoint 字段分布（前30个）:');
    const sortedGPs = Object.keys(grammarPointCount)
      .sort((a, b) => grammarPointCount[b] - grammarPointCount[a])
      .slice(0, 30);
    
    sortedGPs.forEach(gp => {
      console.log(`   "${gp}": ${grammarPointCount[gp]} 题`);
    });
    
    console.log(`\n总计: ${Object.keys(grammarPointCount).length} 个不同的 grammarPoint\n`);
    
    // ==================== 第三部分：匹配分析 ====================
    console.log('🔍 第三部分：命名匹配分析\n');
    
    // 检查界面语法点在云数据库中的匹配情况
    const allUIPoints = [];
    uiGrammarTopics.forEach(topic => {
      topic.points.forEach(point => {
        allUIPoints.push({ big: topic.name, small: point.name });
      });
    });
    
    console.log('界面语法点 vs 云数据库匹配情况:\n');
    
    const matched = [];
    const unmatched = [];
    
    allUIPoints.forEach(point => {
      const exactMatchCat = sortedCats.includes(point.small);
      const exactMatchGP = sortedGPs.includes(point.small);
      
      if (exactMatchCat || exactMatchGP) {
        matched.push(point.small);
        const count = categoryCount[point.small] || grammarPointCount[point.small] || 0;
        console.log(`✅ "${point.small}" (${count}题) - 在${exactMatchCat ? 'category' : 'grammarPoint'}中找到`);
      } else {
        unmatched.push(point);
        
        // 尝试模糊匹配
        const fuzzyMatchCat = sortedCats.filter(cat => 
          cat.includes(point.small) || point.small.includes(cat) ||
          cat.toLowerCase().includes(point.small.toLowerCase()) ||
          point.small.toLowerCase().includes(cat.toLowerCase())
        );
        
        const fuzzyMatchGP = sortedGPs.filter(gp => 
          gp.includes(point.small) || point.small.includes(gp) ||
          gp.toLowerCase().includes(point.small.toLowerCase()) ||
          point.small.toLowerCase().includes(gp.toLowerCase())
        );
        
        if (fuzzyMatchCat.length > 0 || fuzzyMatchGP.length > 0) {
          console.log(`⚠️ "${point.small}" - 未精确匹配，可能的模糊匹配:`);
          if (fuzzyMatchCat.length > 0) {
            console.log(`     category: [${fuzzyMatchCat.slice(0, 3).join(', ')}]`);
          }
          if (fuzzyMatchGP.length > 0) {
            console.log(`     grammarPoint: [${fuzzyMatchGP.slice(0, 3).join(', ')}]`);
          }
        } else {
          console.log(`❌ "${point.small}" - 完全未找到`);
        }
      }
    });
    
    console.log(`\n📊 匹配统计:`);
    console.log(`   ✅ 精确匹配: ${matched.length}/${allUIPoints.length} (${(matched.length/allUIPoints.length*100).toFixed(1)}%)`);
    console.log(`   ❌ 未匹配: ${unmatched.length}/${allUIPoints.length} (${(unmatched.length/allUIPoints.length*100).toFixed(1)}%)`);
    
    // ==================== 第四部分：命名规范建议 ====================
    console.log('\n\n💡 第四部分：命名规范建议\n');
    
    console.log('方案A: 分层命名（大类-小类）');
    console.log('示例:');
    uiGrammarTopics.slice(0, 3).forEach(topic => {
      topic.points.slice(0, 3).forEach(point => {
        const oldName = point.name;
        const newName = `${topic.name}-${point.name.replace(/综合$/, '综合').replace(/\+/g, '').replace(/\//g, '').replace(/\(/g, '').replace(/\)/g, '')}`;
        console.log(`   "${oldName}" → "${newName}"`);
      });
    });
    
    console.log('\n方案B: 使用 grammarPoint 字段');
    console.log('   将界面的名称作为 grammarPoint，category 保持编号');
    console.log('   查询时：where({ grammarPoint: "介词综合" })');
    
    console.log('\n方案C: 完全统一命名');
    console.log('   云数据库、界面、查询都使用相同的名称');
    console.log('   优点：无需转换，缺点：需要批量更新数据库');
    
    // ==================== 第五部分：迁移计划 ====================
    console.log('\n\n📋 第五部分：建议的迁移计划\n');
    
    console.log('步骤1: 创建命名对照表（1小时）');
    console.log('   - 列出所有40个小语法点');
    console.log('   - 定义新旧命名对应关系');
    console.log('   - 确定使用 category 还是 grammarPoint 字段\n');
    
    console.log('步骤2: 小范围试验（2小时）');
    console.log('   - 选择"介词"大类（3个小点）先迁移');
    console.log('   - 更新云数据库、界面、查询逻辑');
    console.log('   - 测试发布作业、生成学案功能\n');
    
    console.log('步骤3: 逐步推广（每天1-2个大类）');
    console.log('   - 按大类逐个迁移');
    console.log('   - 每次迁移后测试验证');
    console.log('   - 保留回滚方案\n');
    
    console.log('步骤4: 清理优化（1小时）');
    console.log('   - 移除映射表代码');
    console.log('   - 简化查询逻辑');
    console.log('   - 更新文档\n');
    
    console.log('=== 分析完成 ===');
    console.log('\n📧 请将以上分析结果发给我，我会根据实际情况制定详细的迁移方案！');
    
  })
  .catch(error => {
    console.error('❌ 云数据库查询失败:', error);
    console.log('\n如果云数据库连接失败，请：');
    console.log('1. 检查云开发配置');
    console.log('2. 确认网络连接');
    console.log('3. 或提供云数据库的导出文件');
  });

