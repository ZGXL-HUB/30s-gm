// 批量修复未分类题目的脚本
// 根据 grammarPoint/tag 自动分配 category
// 在微信开发者工具控制台运行

// 定义 grammarPoint/tag 到 category 的映射规则
const GRAMMAR_POINT_TO_CATEGORY = {
  // 连词相关
  '连词综合': '连词与名/动/形/副综合',
  '并列连词综合': '并列连词综合',
  '从属连词综合': '从属连词综合',
  '连词与名词': '连词与名词',
  '连词与动词': '连词与动词',
  '连词与形容词': '连词与形容词',
  '连词与名/动/形/副综合': '连词与名/动/形/副综合',
  
  // 时态/谓语相关
  '时态综合': '时态综合',
  '谓语综合': '谓语综合',
  '谓语(1)': '谓语(1)',
  '谓语(2)': '谓语(2)',
  '谓语(3)': '谓语(3)',
  '谓语(4)': '谓语(4)',
  '谓语(5)': '谓语(5)',
  '谓语(6)': '谓语(6)',
  '谓语(7)': '谓语(7)',
  '谓语(8)': '谓语(8)',
  '谓语(9)': '谓语(9)',
  
  // 代词相关
  '代词综合': '代词综合',
  '人称代词': '人称代词',
  '物主代词': '物主代词',
  '反身代词': '反身代词',
  '关系代词': '关系代词',
  'it相关': 'it相关',
  
  // 冠词相关
  '冠词综合': '冠词综合',
  '泛指与特指': '泛指与特指',
  'a和an': 'a和an',
  'the的特殊用法': 'the的特殊用法',
  
  // 动词相关
  '动词综合': '动词综合',
  '并列句与动词': '并列句与动词',
  '主从句与动词': '主从句与动词',
  '插入语与动词': '插入语与动词',
  '被动语态': '被动语态',
  
  // 非谓语相关
  '非谓语综合': '非谓语综合',
  '现在分词综合': '现在分词综合',
  '过去分词综合': '过去分词综合',
  '不定式综合': '不定式综合',
  
  // 从句相关
  '定语从句综合': '定语从句综合',
  '状语从句综合': '状语从句综合',
  
  // 其他
  '副词综合': '副词综合',
  '副词修饰句子': '副词修饰句子',
  '副词修饰动词': '副词修饰动词',
  '副词修饰形容词/副词': '副词修饰形容词/副词',
  '名词综合': '名词综合',
  '形容词综合': '形容词综合',
  '介词综合': '介词综合',
  '介词 + 名词/动名词': '介词 + 名词/动名词',
  '固定搭配': '固定搭配',
  // 名词复数相关
  'f/fe结尾': 'f/fe结尾',  // 数据库中的category就是"f/fe结尾"
  '以o结尾': '以o结尾',
  '以y结尾': '以y结尾',
  's/sh/ch/x结尾': 's/sh/ch/x结尾'
};

// 模糊匹配规则（当精确匹配失败时使用）
function fuzzyMatchCategory(grammarPoint) {
  if (!grammarPoint) return null;
  
  const gp = grammarPoint.toLowerCase();
  
  // 连词相关
  if (gp.includes('连词')) {
    if (gp.includes('并列')) return '并列连词综合';
    if (gp.includes('从属')) return '从属连词综合';
    if (gp.includes('名词')) return '连词与名词';
    if (gp.includes('动词')) return '连词与动词';
    if (gp.includes('形容词')) return '连词与形容词';
    return '连词与名/动/形/副综合';
  }
  
  // 时态/谓语相关
  if (gp.includes('时态')) return '时态综合';
  if (gp.includes('谓语')) {
    const match = gp.match(/谓语[（(]?(\d+)[）)]?/);
    if (match && match[1]) {
      return `谓语(${match[1]})`;
    }
    return '谓语综合';
  }
  
  // 代词相关
  if (gp.includes('代词')) {
    if (gp.includes('人称')) return '人称代词';
    if (gp.includes('物主')) return '物主代词';
    if (gp.includes('反身')) return '反身代词';
    if (gp.includes('关系')) return '关系代词';
    if (gp.includes('it')) return 'it相关';
    return '代词综合';
  }
  
  // 冠词相关
  if (gp.includes('冠词')) {
    if (gp.includes('泛指') || gp.includes('特指')) return '泛指与特指';
    if (gp.includes('a') && gp.includes('an')) return 'a和an';
    if (gp.includes('the') || gp.includes('特殊')) return 'the的特殊用法';
    return '冠词综合';
  }
  
  // 动词相关
  if (gp.includes('动词')) {
    if (gp.includes('并列')) return '并列句与动词';
    if (gp.includes('主从') || gp.includes('从句')) return '主从句与动词';
    if (gp.includes('插入')) return '插入语与动词';
    if (gp.includes('被动')) return '被动语态';
    return '动词综合';
  }
  
  // 非谓语相关
  if (gp.includes('非谓语')) {
    if (gp.includes('现在分词')) return '现在分词综合';
    if (gp.includes('过去分词')) return '过去分词综合';
    if (gp.includes('不定式')) return '不定式综合';
    return '非谓语综合';
  }
  
  // 从句相关
  if (gp.includes('定语从句')) return '定语从句综合';
  if (gp.includes('状语从句')) return '状语从句综合';
  if (gp.includes('从句')) return '定语从句综合'; // 默认到定语从句
  
  // 其他
  if (gp.includes('副词')) {
    if (gp.includes('修饰句子')) return '副词修饰句子';
    if (gp.includes('修饰动词')) return '副词修饰动词';
    if (gp.includes('修饰形容词') || gp.includes('修饰副词')) return '副词修饰形容词/副词';
    return '副词综合';
  }
  if (gp.includes('名词')) {
    if (gp.includes('f/fe') || gp.includes('f结尾') || gp.includes('fe结尾')) return 'f/fe结尾';
    if (gp.includes('以o结尾') || gp.includes('o结尾')) return '以o结尾';
    if (gp.includes('以y结尾') || gp.includes('y结尾')) return '以y结尾';
    if (gp.includes('s/sh/ch/x') || gp.includes('s结尾') || gp.includes('sh结尾') || gp.includes('ch结尾') || gp.includes('x结尾')) return 's/sh/ch/x结尾';
    return '名词综合';
  }
  if (gp.includes('形容词')) return '形容词综合';
  if (gp.includes('介词')) {
    if (gp.includes('名词') || gp.includes('动名词')) return '介词 + 名词/动名词';
    return '介词综合';
  }
  if (gp.includes('固定搭配')) return '固定搭配';
  
  // 名词复数特殊处理
  if (gp.includes('f/fe') || (gp.includes('f') && gp.includes('结尾'))) return 'f/fe结尾';
  
  return null;
}

async function batchFixUncategorizedQuestions(dryRun = true) {
  try {
    console.log(`🔧 开始${dryRun ? '模拟' : ''}批量修复未分类题目...\n`);
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    const _ = db.command;
    
    // 1. 获取所有未分类题目（分批获取，避免查询限制）
    console.log('📥 获取未分类题目...');
    
    // 先统计总数
    const countResult = await questionsCollection
      .where({
        category: _.exists(false)
      })
      .count();
    
    const total = countResult.total;
    console.log(`   总计: ${total} 道未分类题目\n`);
    
    // 分批获取
    const MAX_BATCH = 20;
    const batches = Math.ceil(total / MAX_BATCH);
    const uncategorizedQuestions = [];
    
    for (let i = 0; i < batches; i++) {
      const result = await questionsCollection
        .where({
          category: _.exists(false)
        })
        .field({
          _id: true,
          grammarPoint: true,
          tag: true
        })
        .skip(i * MAX_BATCH)
        .limit(MAX_BATCH)
        .get();
      
      uncategorizedQuestions.push(...result.data);
      
      if ((i + 1) % 10 === 0 || (i + 1) === batches) {
        console.log(`   已获取 ${uncategorizedQuestions.length}/${total} 题...`);
      }
    }
    
    console.log(`✅ 已获取所有 ${uncategorizedQuestions.length} 道未分类题目\n`);
    
    // 2. 分析并分配category
    const fixPlan = {
      exactMatch: [],      // 精确匹配
      fuzzyMatch: [],      // 模糊匹配
      noMatch: []          // 无法匹配
    };
    
    uncategorizedQuestions.forEach(q => {
      const grammarPoint = q.grammarPoint || q.tag;
      
      if (!grammarPoint) {
        fixPlan.noMatch.push({
          _id: q._id,
          reason: '无grammarPoint和tag'
        });
        return;
      }
      
      // 尝试精确匹配
      if (GRAMMAR_POINT_TO_CATEGORY[grammarPoint]) {
        fixPlan.exactMatch.push({
          _id: q._id,
          grammarPoint: grammarPoint,
          category: GRAMMAR_POINT_TO_CATEGORY[grammarPoint]
        });
        return;
      }
      
      // 尝试模糊匹配
      const fuzzyCategory = fuzzyMatchCategory(grammarPoint);
      if (fuzzyCategory) {
        fixPlan.fuzzyMatch.push({
          _id: q._id,
          grammarPoint: grammarPoint,
          category: fuzzyCategory
        });
        return;
      }
      
      // 无法匹配
      fixPlan.noMatch.push({
        _id: q._id,
        grammarPoint: grammarPoint,
        reason: '无法匹配到已知category'
      });
    });
    
    // 3. 显示修复计划
    console.log('📋 修复计划:');
    console.log(`   精确匹配: ${fixPlan.exactMatch.length} 题`);
    console.log(`   模糊匹配: ${fixPlan.fuzzyMatch.length} 题`);
    console.log(`   无法匹配: ${fixPlan.noMatch.length} 题\n`);
    
    // 显示无法匹配的grammarPoint
    if (fixPlan.noMatch.length > 0) {
      console.log('⚠️ 无法匹配的 grammarPoint/tag:');
      const uniqueGP = [...new Set(fixPlan.noMatch.map(q => q.grammarPoint || q.reason))];
      uniqueGP.slice(0, 20).forEach(gp => {
        const count = fixPlan.noMatch.filter(q => (q.grammarPoint || q.reason) === gp).length;
        console.log(`   "${gp}": ${count} 题`);
      });
      if (uniqueGP.length > 20) {
        console.log(`   ... 还有 ${uniqueGP.length - 20} 个不同的值`);
      }
      console.log('');
    }
    
    // 4. 执行修复（如果不是dry run）
    if (dryRun) {
      console.log('💡 这是模拟运行，不会实际修改数据');
      console.log('   如需实际执行，请调用: batchFixUncategorizedQuestions(false)\n');
    } else {
      console.log('🚀 开始执行批量更新...\n');
      
      const allToFix = [...fixPlan.exactMatch, ...fixPlan.fuzzyMatch];
      const BATCH_SIZE = 20;
      let updated = 0;
      
      for (let i = 0; i < allToFix.length; i += BATCH_SIZE) {
        const batch = allToFix.slice(i, i + BATCH_SIZE);
        
        const updatePromises = batch.map(item => 
          questionsCollection.doc(item._id).update({
            data: {
              category: item.category
            }
          })
        );
        
        await Promise.all(updatePromises);
        updated += batch.length;
        
        console.log(`   已更新 ${updated}/${allToFix.length} 题...`);
      }
      
      console.log(`\n✅ 批量更新完成！共更新 ${updated} 题\n`);
      
      // 验证结果
      const verifyResult = await questionsCollection
        .where({
          category: _.exists(false)
        })
        .count();
      
      console.log(`📊 验证结果: 仍有 ${verifyResult.total} 道未分类题目`);
    }
    
    return {
      success: true,
      dryRun: dryRun,
      plan: fixPlan,
      total: uncategorizedQuestions.length
    };
    
  } catch (error) {
    console.error('❌ 修复失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行模拟（不实际修改数据）
console.log('🚀 未分类题目批量修复工具\n');
console.log('💡 提示: 这是模拟运行，不会修改数据');
console.log('   查看修复计划后，如需实际执行，请调用: batchFixUncategorizedQuestions(false)\n');
batchFixUncategorizedQuestions(true);
