// 分析 category 结构，识别哪些应该作为大类，哪些应该迁移到 grammarPoint
// 在微信开发者工具控制台运行

async function analyzeCategoryStructure() {
  try {
    console.log('📊 开始分析 category 结构...\n');
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    
    // 1. 获取所有题目
    console.log('📥 正在获取所有题目数据...');
    let allQuestions = [];
    let offset = 0;
    const MAX_BATCH = 20;
    
    while (true) {
      const result = await questionsCollection
        .field({
          _id: true,
          category: true,
          grammarPoint: true,
          tag: true
        })
        .skip(offset)
        .limit(MAX_BATCH)
        .get();
      
      if (result.data.length === 0) break;
      
      allQuestions.push(...result.data);
      offset += MAX_BATCH;
      
      if (result.data.length < MAX_BATCH) break;
      
      if (allQuestions.length % 100 === 0) {
        console.log(`   已获取 ${allQuestions.length} 题...`);
      }
    }
    
    console.log(`✅ 共获取 ${allQuestions.length} 道题目\n`);
    
    // 2. 分析每个 category 的特征
    const categoryAnalysis = {};
    
    allQuestions.forEach(q => {
      if (!q.category || q.category === '未分类') return;
      
      const category = q.category;
      if (!categoryAnalysis[category]) {
        categoryAnalysis[category] = {
          count: 0,
          hasGrammarPoint: 0,
          grammarPoints: new Set(),
          shouldBeParent: false,
          shouldBeChild: false,
          reason: ''
        };
      }
      
      categoryAnalysis[category].count++;
      const gp = q.grammarPoint || q.tag;
      if (gp) {
        categoryAnalysis[category].hasGrammarPoint++;
        categoryAnalysis[category].grammarPoints.add(gp);
      }
    });
    
    // 3. 定义标准大类（应该保留在 category）- 只包含真正的大类
    const standardParentCategories = [
      '动词', '动词综合', '动词时态',
      '代词综合', // 注意：不包括"代词"，因为"代词"可能被误判
      '连词', '并列连词综合', '从属连词综合',
      '冠词综合', // 注意：不包括"冠词"
      '介词', '介词综合',
      '名词综合', // 注意：不包括"名词"
      '形容词综合', '形容词与副词',
      '时态综合',
      '被动语态',
      '复合句',
      '特殊句式',
      '主谓一致',
      '非谓语综合',
      '数词',
      '句子成分与基本句型',
      '副词综合' // 注意：不包括"副词"
    ];
    
    // 4. 先识别应该迁移到 grammarPoint 的 category（小类）- 优先级更高
    const smallCategoryKeywords = [
      // 关系词
      'whose', 'how', 'why', 'when', 'where', 'that能填吗',
      // 代词小类
      '物主代词', '关系代词', '反身代词', '人称代词', 'it相关',
      // 时态小类
      '过去时', '现在时', '进行时', '完成时',
      // 形容词副词小类
      '比较级', '最高级',
      // 冠词小类
      'a和an', '泛指与特指', 'the的特殊用法',
      // 从句小类（但"定语从句综合"等带"综合"的保留）
      '定语从句', '状语从句', '宾语从句',
      // 非谓语小类
      '现在分词', '过去分词', '不定式',
      // 副词修饰
      '副词修饰',
      // 名词复数
      '以y结尾', '以o结尾', 's/sh/ch/x结尾', 'f/fe结尾', '名词复数',
      // 特殊问题
      '能填吗', '写be吗', '选哪个', '混淆',
      // 谓语
      '谓语(',
      // 连词组合
      '连词与',
      // 动词组合
      '主从句与', '插入语与', '并列句与'
    ];
    
    Object.keys(categoryAnalysis).forEach(category => {
      const analysis = categoryAnalysis[category];
      
      // 先检查是否是小类（精确匹配或包含匹配）
      const isSmallCategory = smallCategoryKeywords.some(keyword => {
        // 精确匹配
        if (category === keyword) return true;
        // 包含匹配（但排除带"综合"的）
        if (!category.includes('综合') && category.includes(keyword)) return true;
        return false;
      });
      
      if (isSmallCategory) {
        analysis.shouldBeChild = true;
        analysis.reason = '包含小类关键词，应该迁移到 grammarPoint';
        return;
      }
    });
    
    // 5. 识别应该作为大类的 category（在小类识别之后）
    Object.keys(categoryAnalysis).forEach(category => {
      const analysis = categoryAnalysis[category];
      
      if (analysis.shouldBeChild) return; // 已经是小类，跳过
      
      // 检查是否是标准大类（精确匹配）
      if (standardParentCategories.some(parent => category === parent)) {
        analysis.shouldBeParent = true;
        analysis.reason = '标准大类（精确匹配）';
        return;
      }
      
      // 检查是否包含"综合"字样（且不是小类）
      if (category.includes('综合')) {
        analysis.shouldBeParent = true;
        analysis.reason = '包含"综合"字样，通常是大类';
        return;
      }
      
      // 检查是否是基础大类（如"代词"、"动词"、"名词"等，但不包含小类关键词）
      const baseCategories = ['代词', '动词', '名词', '冠词', '副词', '形容词', '连词'];
      if (baseCategories.some(base => category === base)) {
        analysis.shouldBeParent = true;
        analysis.reason = '基础大类';
        return;
      }
      
      // 检查是否包含多个子类（有多个不同的 grammarPoint）
      if (analysis.grammarPoints.size > 3) {
        analysis.shouldBeParent = true;
        analysis.reason = `包含多个子类（${analysis.grammarPoints.size}个不同的grammarPoint）`;
        return;
      }
    });
    
    // 6. 生成分析报告
    const parentCategories = [];
    const childCategories = [];
    const unclearCategories = [];
    
    Object.entries(categoryAnalysis).forEach(([category, analysis]) => {
      const item = {
        category,
        count: analysis.count,
        hasGrammarPoint: analysis.hasGrammarPoint,
        grammarPointCount: analysis.grammarPoints.size,
        reason: analysis.reason
      };
      
      if (analysis.shouldBeParent) {
        parentCategories.push(item);
      } else if (analysis.shouldBeChild) {
        childCategories.push(item);
      } else {
        unclearCategories.push(item);
      }
    });
    
    // 按数量排序
    parentCategories.sort((a, b) => b.count - a.count);
    childCategories.sort((a, b) => b.count - a.count);
    unclearCategories.sort((a, b) => b.count - a.count);
    
    // 7. 输出报告
    console.log('='.repeat(80));
    console.log('📋 CATEGORY 结构分析报告');
    console.log('='.repeat(80));
    
    console.log(`\n✅ 应该保留在 CATEGORY 的大类（${parentCategories.length} 个）:\n`);
    parentCategories.forEach((item, index) => {
      console.log(`${(index + 1).toString().padStart(3)}. ${item.category.padEnd(30)} ${item.count.toString().padStart(4)} 题 | ${item.reason}`);
    });
    
    console.log(`\n🔄 应该迁移到 GRAMMARPOINT 的小类（${childCategories.length} 个）:\n`);
    childCategories.forEach((item, index) => {
      console.log(`${(index + 1).toString().padStart(3)}. ${item.category.padEnd(30)} ${item.count.toString().padStart(4)} 题 | ${item.reason}`);
    });
    
    if (unclearCategories.length > 0) {
      console.log(`\n❓ 需要人工判断的分类（${unclearCategories.length} 个）:\n`);
      unclearCategories.forEach((item, index) => {
        console.log(`${(index + 1).toString().padStart(3)}. ${item.category.padEnd(30)} ${item.count.toString().padStart(4)} 题 | 有grammarPoint: ${item.hasGrammarPoint}/${item.count}`);
      });
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 统计汇总:');
    console.log(`   总分类数: ${Object.keys(categoryAnalysis).length}`);
    console.log(`   应该保留的大类: ${parentCategories.length}`);
    console.log(`   应该迁移的小类: ${childCategories.length}`);
    console.log(`   需要人工判断: ${unclearCategories.length}`);
    console.log('='.repeat(80) + '\n');
    
    // 8. 生成迁移建议
    console.log('💡 迁移建议:\n');
    console.log('1. 对于应该迁移的小类，需要：');
    console.log('   - 确定对应的父类（category）');
    console.log('   - 将小类名称迁移到 grammarPoint 字段');
    console.log('   - 更新 category 为对应的父类\n');
    
    console.log('2. 建议的父类映射（示例）:');
    const parentMapping = {
      'whose': '关系代词',
      'how': '关系代词',
      'why': '关系代词',
      'when': '关系代词',
      'where': '关系代词',
      '物主代词': '代词',
      '关系代词': '代词',
      '反身代词': '代词',
      '人称代词': '代词',
      'it相关': '代词',
      '过去时': '动词时态',
      '现在时': '动词时态',
      '进行时': '动词时态',
      '完成时': '动词时态',
      '比较级': '形容词与副词',
      '最高级': '形容词与副词',
      'a和an': '冠词',
      '泛指与特指': '冠词',
      'the的特殊用法': '冠词',
      '定语从句综合': '复合句',
      '状语从句综合': '复合句',
      '现在分词综合': '非谓语',
      '过去分词综合': '非谓语',
      '不定式综合': '非谓语',
      '副词修饰动词': '副词',
      '副词修饰形容词/副词': '副词',
      '以y结尾': '名词',
      '以o结尾': '名词',
      's/sh/ch/x结尾': '名词',
      'f/fe结尾': '名词',
      '名词复数书写综合': '名词'
    };
    
    const mappingEntries = Object.entries(parentMapping).slice(0, 15);
    mappingEntries.forEach(([child, parent]) => {
      console.log(`   "${child}" → category: "${parent}", grammarPoint: "${child}"`);
    });
    console.log('   ...\n');
    
    return {
      success: true,
      totalCategories: Object.keys(categoryAnalysis).length,
      parentCategories,
      childCategories,
      unclearCategories,
      parentMapping
    };
    
  } catch (error) {
    console.error('❌ 分析失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行分析
console.log('🚀 Category 结构分析工具\n');
analyzeCategoryStructure();
