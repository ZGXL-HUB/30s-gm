// 分析未分类题目的脚本
// 在微信开发者工具控制台运行

async function analyzeUncategorizedQuestions() {
  try {
    console.log('🔍 开始分析未分类题目...\n');
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    
    // 1. 统计未分类题目总数
    const countResult = await questionsCollection
      .where({
        category: db.command.exists(false)
      })
      .count();
    
    console.log(`📊 未分类题目总数: ${countResult.total} 题\n`);
    
    // 2. 获取未分类题目的详细信息（分批获取）
    const MAX_BATCH = 20;
    const total = countResult.total;
    const batches = Math.ceil(total / MAX_BATCH);
    
    console.log(`📥 分批获取未分类题目详情（共${batches}批）...\n`);
    
    const uncategorizedQuestions = [];
    
    for (let i = 0; i < batches; i++) {
      const result = await questionsCollection
        .where({
          category: db.command.exists(false)
        })
        .field({
          text: true,
          grammarPoint: true,
          tag: true,
          analysis: true,
          answer: true,
          schoolLevel: true
        })
        .skip(i * MAX_BATCH)
        .limit(MAX_BATCH)
        .get();
      
      uncategorizedQuestions.push(...result.data);
      
      if ((i + 1) % 10 === 0) {
        console.log(`   已获取 ${uncategorizedQuestions.length}/${total} 题...`);
      }
    }
    
    console.log(`✅ 已获取所有未分类题目\n`);
    
    // 3. 分析grammarPoint字段
    console.log('📋 分析 grammarPoint 字段分布:');
    const grammarPointCount = {};
    const hasGrammarPoint = [];
    const noGrammarPoint = [];
    
    uncategorizedQuestions.forEach(q => {
      const gp = q.grammarPoint || q.tag || '无';
      grammarPointCount[gp] = (grammarPointCount[gp] || 0) + 1;
      
      if (q.grammarPoint || q.tag) {
        hasGrammarPoint.push(q);
      } else {
        noGrammarPoint.push(q);
      }
    });
    
    const sortedGP = Object.entries(grammarPointCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20);
    
    sortedGP.forEach(([gp, count]) => {
      console.log(`   "${gp}": ${count} 题`);
    });
    
    console.log(`\n📈 统计:`);
    console.log(`   有 grammarPoint/tag: ${hasGrammarPoint.length} 题`);
    console.log(`   无 grammarPoint/tag: ${noGrammarPoint.length} 题\n`);
    
    // 4. 分析题目内容关键词（尝试推断分类）
    console.log('🔍 分析题目内容关键词（尝试推断可能分类）:\n');
    
    const keywordPatterns = {
      '连词': ['but', 'and', 'or', 'so', 'because', 'although', 'though', 'while', 'when', 'if', '连词', '并列', '从属'],
      '时态': ['时态', 'tense', '过去', '现在', '将来', '完成', '进行', 'was', 'were', 'had', 'will', 'would'],
      '谓语': ['谓语', 'predicate', '动词', 'verb'],
      '冠词': ['a', 'an', 'the', '冠词', 'article'],
      '代词': ['代词', 'pronoun', 'he', 'she', 'it', 'they', 'this', 'that', 'which', 'who', 'whose'],
      '介词': ['介词', 'preposition', 'in', 'on', 'at', 'with', 'by', 'for', 'from', 'to'],
      '形容词': ['形容词', 'adjective', '比较级', '最高级', 'more', 'most', 'er', 'est'],
      '副词': ['副词', 'adverb', 'ly', 'very', 'quite', 'too'],
      '名词': ['名词', 'noun', '复数', '单数', '可数', '不可数'],
      '非谓语': ['非谓语', '不定式', '分词', 'to do', 'doing', 'done', 'infinitive', 'participle'],
      '从句': ['从句', 'clause', '定语从句', '状语从句', '宾语从句', 'that', 'which', 'where', 'when']
    };
    
    const inferredCategories = {};
    
    uncategorizedQuestions.forEach(q => {
      const text = (q.text || '').toLowerCase();
      const analysis = (q.analysis || '').toLowerCase();
      const combined = text + ' ' + analysis;
      
      const matches = [];
      Object.keys(keywordPatterns).forEach(category => {
        const keywords = keywordPatterns[category];
        if (keywords.some(keyword => combined.includes(keyword.toLowerCase()))) {
          matches.push(category);
        }
      });
      
      if (matches.length > 0) {
        matches.forEach(cat => {
          inferredCategories[cat] = (inferredCategories[cat] || 0) + 1;
        });
      }
    });
    
    const sortedInferred = Object.entries(inferredCategories)
      .sort(([,a], [,b]) => b - a);
    
    if (sortedInferred.length > 0) {
      console.log('   根据题目内容推断的可能分类:');
      sortedInferred.forEach(([cat, count]) => {
        console.log(`   - ${cat}: ${count} 题`);
      });
    } else {
      console.log('   ⚠️ 无法从题目内容推断分类');
    }
    
    // 5. 显示示例题目
    console.log('\n📝 未分类题目示例（前10题）:\n');
    uncategorizedQuestions.slice(0, 10).forEach((q, index) => {
      console.log(`${index + 1}. 题目: ${(q.text || '').substring(0, 60)}...`);
      console.log(`   grammarPoint: ${q.grammarPoint || '无'}`);
      console.log(`   tag: ${q.tag || '无'}`);
      console.log(`   schoolLevel: ${q.schoolLevel || '无'}`);
      console.log('');
    });
    
    // 6. 生成处理建议
    console.log('\n💡 处理建议:\n');
    console.log('1. 有 grammarPoint/tag 的题目:');
    console.log(`   - 共 ${hasGrammarPoint.length} 题，可以根据 grammarPoint/tag 映射到对应的 category`);
    console.log('   - 建议：创建映射脚本，根据 grammarPoint/tag 自动分配 category\n');
    
    console.log('2. 无 grammarPoint/tag 的题目:');
    console.log(`   - 共 ${noGrammarPoint.length} 题，需要人工审核或根据内容推断`);
    console.log('   - 建议：');
    console.log('     a) 查看题目内容，手动分类');
    console.log('     b) 使用关键词匹配（如上面的推断结果）');
    console.log('     c) 如果无法分类，可以考虑创建"其他"或"综合"分类\n');
    
    console.log('3. 批量处理方案:');
    console.log('   - 方案A：根据 grammarPoint/tag 自动映射（推荐）');
    console.log('   - 方案B：根据题目内容关键词匹配');
    console.log('   - 方案C：导出为Excel，人工分类后批量导入\n');
    
    return {
      success: true,
      total: total,
      hasGrammarPoint: hasGrammarPoint.length,
      noGrammarPoint: noGrammarPoint.length,
      grammarPointCount: grammarPointCount,
      inferredCategories: inferredCategories,
      questions: uncategorizedQuestions
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
console.log('🚀 未分类题目分析工具\n');
analyzeUncategorizedQuestions();
