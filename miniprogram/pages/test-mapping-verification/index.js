// 映射验证测试页面
Page({
  data: {
    testResults: [],
    isRunning: false
  },

  onLoad() {
    console.log('📋 映射验证测试页面已加载');
    // 自动运行测试
    this.runAllTests();
  },

  // 运行所有测试
  async runAllTests() {
    this.setData({ isRunning: true, testResults: [] });
    
    console.log('🚀 开始执行映射验证测试...\n');
    console.log('='.repeat(80));
    
    try {
      // 测试1: 统计所有 category 唯一值
      await this.test1_CountAllCategories();
      
      // 测试2: 验证关键映射
      await this.test2_VerifyKeyMappings();
      
      // 测试3: 查看专题与子知识点的对应关系
      await this.test3_CheckTopicMapping();
      
      console.log('\n' + '='.repeat(80));
      console.log('✅ 所有测试完成！');
      
    } catch (error) {
      console.error('❌ 测试执行失败:', error);
    } finally {
      this.setData({ isRunning: false });
    }
  },

  // 测试1: 统计高中题库中所有 category 字段的唯一值
  async test1_CountAllCategories() {
    console.log('\n📊 测试1: 统计高中题库中所有 category 字段的唯一值');
    console.log('-'.repeat(80));
    
    try {
      if (!wx.cloud) {
        throw new Error('云开发不可用');
      }

      // 先获取总数
      const countResult = await wx.cloud.database()
        .collection('questions')
        .where({ schoolLevel: 'high' })
        .count();
      
      const totalCount = countResult.total;
      console.log(`📊 数据库中总共有 ${totalCount} 道高中题目`);
      
      // 分批查询所有高中题目（云数据库默认 limit 是 20，需要分批查询）
      // 注意：微信云数据库使用 skip 时，建议添加 orderBy 以确保结果稳定
      console.log('⏳ 正在分批查询所有高中题目...');
      let allQuestions = [];
      const MAX_LIMIT = 20; // 每次查询20条（微信云数据库的默认限制，更安全）
      let skip = 0;
      let consecutiveEmptyResults = 0; // 连续空结果计数
      
      while (allQuestions.length < totalCount) {
        try {
          const result = await wx.cloud.database()
            .collection('questions')
            .where({ schoolLevel: 'high' })
            .field({ category: true, grammarPoint: true })
            .orderBy('_id', 'asc') // 添加排序，确保 skip 正常工作
            .skip(skip)
            .limit(MAX_LIMIT)
            .get();
          
          if (result.data.length === 0) {
            consecutiveEmptyResults++;
            if (consecutiveEmptyResults >= 3) {
              console.log(`  ⚠️  连续3次查询到空结果，停止查询`);
              break;
            }
            // 即使为空也增加 skip，继续尝试
            skip += MAX_LIMIT;
            continue;
          }
          
          consecutiveEmptyResults = 0; // 重置计数
          allQuestions.push(...result.data);
          console.log(`  已查询 ${allQuestions.length}/${totalCount} 道题目... (本次: ${result.data.length} 道)`);
          
          // 如果返回的数据少于限制，可能已经查完，但继续尝试一次
          if (result.data.length < MAX_LIMIT) {
            skip += MAX_LIMIT;
            // 再查询一次确认是否真的查完了
            const nextResult = await wx.cloud.database()
              .collection('questions')
              .where({ schoolLevel: 'high' })
              .field({ category: true, grammarPoint: true })
              .orderBy('_id', 'asc')
              .skip(skip)
              .limit(MAX_LIMIT)
              .get();
            
            if (nextResult.data.length === 0) {
              // 确认查完了
              break;
            } else {
              // 还有数据，继续
              allQuestions.push(...nextResult.data);
              console.log(`  已查询 ${allQuestions.length}/${totalCount} 道题目... (本次: ${nextResult.data.length} 道)`);
              skip += MAX_LIMIT;
            }
          } else {
            skip += MAX_LIMIT;
          }
          
          // 防止无限循环
          if (skip > totalCount * 1.5) {
            console.log(`  ⚠️  跳过数量超过总数的1.5倍，停止查询`);
            break;
          }
        } catch (error) {
          console.error(`  ❌ 查询失败 (skip=${skip}):`, error);
          // 如果 skip 太大导致错误，尝试减小批次
          if (error.errMsg && error.errMsg.includes('skip')) {
            console.log(`  ⚠️  skip 值可能过大，尝试减小批次...`);
            break;
          }
          throw error;
        }
      }

      console.log(`📦 共查询到 ${allQuestions.length} 道高中题目`);

      // 统计 category 唯一值
      const categorySet = new Set();
      const categoryCount = {};
      const categoryWithGrammarPoint = {};

      allQuestions.forEach(q => {
        const cat = q.category || '未分类';
        categorySet.add(cat);
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        
        // 记录每个 category 对应的 grammarPoint 示例
        if (!categoryWithGrammarPoint[cat]) {
          categoryWithGrammarPoint[cat] = new Set();
        }
        if (q.grammarPoint) {
          categoryWithGrammarPoint[cat].add(q.grammarPoint);
        }
      });

      const uniqueCategories = Array.from(categorySet).sort();
      
      console.log(`\n📋 高中题库中 category 的唯一值（共 ${uniqueCategories.length} 个）:`);
      console.log('-'.repeat(80));
      
      // 按分类分组显示
      const categoryGroups = {
        '连词相关': [],
        '时态/谓语相关': [],
        '冠词相关': [],
        '形容词相关': [],
        '副词相关': [],
        '名词相关': [],
        '代词相关': [],
        '介词相关': [],
        '动词相关': [],
        '非谓语相关': [],
        '从句相关': [],
        '其他': []
      };

      uniqueCategories.forEach(cat => {
        const count = categoryCount[cat];
        const grammarPoints = Array.from(categoryWithGrammarPoint[cat] || []).slice(0, 3);
        const grammarPointStr = grammarPoints.length > 0 
          ? ` (grammarPoint示例: ${grammarPoints.join(', ')})` 
          : '';
        
        console.log(`  "${cat}": ${count} 题${grammarPointStr}`);

        // 分组
        if (cat.includes('连词')) {
          categoryGroups['连词相关'].push({ cat, count });
        } else if (cat.includes('时态') || cat.includes('谓语')) {
          categoryGroups['时态/谓语相关'].push({ cat, count });
        } else if (cat.includes('冠词')) {
          categoryGroups['冠词相关'].push({ cat, count });
        } else if (cat.includes('形容词')) {
          categoryGroups['形容词相关'].push({ cat, count });
        } else if (cat.includes('副词')) {
          categoryGroups['副词相关'].push({ cat, count });
        } else if (cat.includes('名词')) {
          categoryGroups['名词相关'].push({ cat, count });
        } else if (cat.includes('代词')) {
          categoryGroups['代词相关'].push({ cat, count });
        } else if (cat.includes('介词')) {
          categoryGroups['介词相关'].push({ cat, count });
        } else if (cat.includes('动词') && !cat.includes('非谓语')) {
          categoryGroups['动词相关'].push({ cat, count });
        } else if (cat.includes('非谓语') || cat.includes('分词') || cat.includes('不定式')) {
          categoryGroups['非谓语相关'].push({ cat, count });
        } else if (cat.includes('从句') || cat.includes('定语') || cat.includes('状语')) {
          categoryGroups['从句相关'].push({ cat, count });
        } else {
          categoryGroups['其他'].push({ cat, count });
        }
      });

      // 按分组显示
      console.log('\n📂 按分类分组:');
      Object.keys(categoryGroups).forEach(group => {
        if (categoryGroups[group].length > 0) {
          console.log(`\n  【${group}】`);
          categoryGroups[group].forEach(({ cat, count }) => {
            console.log(`    - "${cat}": ${count} 题`);
          });
        }
      });

      // 保存结果
      this.setData({
        testResults: [...this.data.testResults, {
          test: '测试1: 统计所有category',
          total: allQuestions.length,
          uniqueCount: uniqueCategories.length,
          categories: uniqueCategories,
          categoryCount: categoryCount
        }]
      });

    } catch (error) {
      console.error('❌ 测试1失败:', error);
      throw error;
    }
  },

  // 测试2: 验证关键映射
  async test2_VerifyKeyMappings() {
    console.log('\n\n🔍 测试2: 验证关键映射');
    console.log('-'.repeat(80));

    const keyMappings = [
      { name: '连词综合', description: '映射表目标值: "连词综合"' },
      { name: '时态综合', description: '映射表目标值: "时态综合"' },
      { name: '谓语综合', description: '映射表目标值: "谓语综合"' },
      { name: '冠词综合', description: '映射表目标值: "冠词综合"' },
      { name: '形容词综合', description: '映射表目标值: "形容词综合"' },
      { name: '副词综合', description: '映射表目标值: "副词综合"' },
      { name: '名词综合', description: '映射表目标值: "名词综合"' },
      { name: '代词综合', description: '映射表目标值: "代词综合"' },
      { name: '动词综合', description: '映射表目标值: "动词综合"' }
    ];

    const results = [];

    for (const mapping of keyMappings) {
      try {
        // 精确匹配
        const exactResult = await wx.cloud.database()
          .collection('questions')
          .where({ 
            category: mapping.name,
            schoolLevel: 'high'
          })
          .count();

        // 模糊匹配（包含关键词）
        // 注意：小程序中不支持 RegExp，需要分批查询所有数据后过滤
        const keyword = mapping.name.replace('综合', '');
        
        // 先获取总数
        const fuzzyCountResult = await wx.cloud.database()
          .collection('questions')
          .where({ schoolLevel: 'high' })
          .count();
        
        const fuzzyTotalCount = fuzzyCountResult.total;
        let allQuestionsForFuzzy = [];
        let skip = 0;
        const MAX_LIMIT = 100;
        
        while (allQuestionsForFuzzy.length < fuzzyTotalCount) {
          const result = await wx.cloud.database()
            .collection('questions')
            .where({ schoolLevel: 'high' })
            .field({ category: true })
            .orderBy('_id', 'asc') // 添加排序
            .skip(skip)
            .limit(MAX_LIMIT)
            .get();
          
          if (result.data.length === 0) {
            // 连续空结果，可能查完了
            break;
          }
          
          allQuestionsForFuzzy.push(...result.data);
          
          if (result.data.length < MAX_LIMIT) {
            // 返回数据少于限制，可能查完了，但再试一次确认
            skip += MAX_LIMIT;
            const nextResult = await wx.cloud.database()
              .collection('questions')
              .where({ schoolLevel: 'high' })
              .field({ category: true })
              .orderBy('_id', 'asc')
              .skip(skip)
              .limit(MAX_LIMIT)
              .get();
            
            if (nextResult.data.length === 0) {
              break;
            } else {
              allQuestionsForFuzzy.push(...nextResult.data);
              skip += MAX_LIMIT;
            }
          } else {
            skip += MAX_LIMIT;
          }
          
          if (skip > fuzzyTotalCount * 1.5) break;
        }
        
        const fuzzyResult = {
          data: allQuestionsForFuzzy.filter(q => 
            q.category && q.category.includes(keyword)
          )
        };

        // 去重获取所有匹配的 category
        const matchedCategories = [...new Set(fuzzyResult.data.map(q => q.category))];

        const result = {
          mapping: mapping.name,
          exactMatch: exactResult.total,
          fuzzyMatch: fuzzyResult.data.length,
          matchedCategories: matchedCategories
        };

        results.push(result);

        console.log(`\n📌 ${mapping.name} (${mapping.description})`);
        console.log(`  精确匹配 (category = "${mapping.name}"): ${exactResult.total} 题`);
        
        if (exactResult.total === 0) {
          console.log(`  ⚠️  精确匹配失败！`);
        }

        if (fuzzyResult.data.length > 0) {
          console.log(`  模糊匹配 (category 包含 "${mapping.name.replace('综合', '')}"): ${fuzzyResult.data.length} 题`);
          console.log(`  匹配到的 category 值: ${matchedCategories.join(', ')}`);
        } else {
          console.log(`  ⚠️  模糊匹配也失败！`);
        }

      } catch (error) {
        console.error(`  ❌ 查询 ${mapping.name} 失败:`, error);
      }
    }

    // 保存结果
    this.setData({
      testResults: [...this.data.testResults, {
        test: '测试2: 验证关键映射',
        results: results
      }]
    });
  },

  // 测试3: 查看专题与子知识点的对应关系
  async test3_CheckTopicMapping() {
    console.log('\n\n📚 测试3: 查看专题与子知识点的对应关系');
    console.log('-'.repeat(80));

    const topics = [
      { name: '连词', keywords: ['连词'] },
      { name: '时态/谓语', keywords: ['时态', '谓语'] },
      { name: '冠词', keywords: ['冠词'] },
      { name: '形容词', keywords: ['形容词'] },
      { name: '副词', keywords: ['副词'] },
      { name: '名词', keywords: ['名词'] },
      { name: '代词', keywords: ['代词'] },
      { name: '介词', keywords: ['介词'] },
      { name: '动词', keywords: ['动词'] },
      { name: '非谓语', keywords: ['非谓语', '分词', '不定式'] },
      { name: '从句', keywords: ['从句', '定语', '状语'] }
    ];

    const topicResults = [];

    for (const topic of topics) {
      try {
        console.log(`\n📖 【${topic.name}】专题:`);
        
        // 分批查询所有高中题目，然后过滤
        console.log(`  ⏳ 正在查询 ${topic.name} 相关题目...`);
        
        // 先获取总数（只查询一次，避免重复查询）
        if (!this._allHighQuestionsCache) {
          const countResult = await wx.cloud.database()
            .collection('questions')
            .where({ schoolLevel: 'high' })
            .count();
          
          const totalCount = countResult.total;
          console.log(`    数据库中总共有 ${totalCount} 道高中题目`);
          
          let allHighQuestions = [];
          let skip = 0;
          const MAX_LIMIT = 100;
          
          while (allHighQuestions.length < totalCount) {
            const result = await wx.cloud.database()
              .collection('questions')
              .where({ schoolLevel: 'high' })
              .field({ category: true, grammarPoint: true })
              .orderBy('_id', 'asc') // 添加排序
              .skip(skip)
              .limit(MAX_LIMIT)
              .get();
            
            if (result.data.length === 0) {
              // 连续空结果，可能查完了
              break;
            }
            
            allHighQuestions.push(...result.data);
            console.log(`      已查询 ${allHighQuestions.length}/${totalCount} 道题目...`);
            
            if (result.data.length < MAX_LIMIT) {
              // 返回数据少于限制，再试一次确认
              skip += MAX_LIMIT;
              const nextResult = await wx.cloud.database()
                .collection('questions')
                .where({ schoolLevel: 'high' })
                .field({ category: true, grammarPoint: true })
                .orderBy('_id', 'asc')
                .skip(skip)
                .limit(MAX_LIMIT)
                .get();
              
              if (nextResult.data.length === 0) {
                break;
              } else {
                allHighQuestions.push(...nextResult.data);
                console.log(`      已查询 ${allHighQuestions.length}/${totalCount} 道题目...`);
                skip += MAX_LIMIT;
              }
            } else {
              skip += MAX_LIMIT;
            }
            
            if (skip > totalCount * 1.5) break;
          }
          
          this._allHighQuestionsCache = allHighQuestions;
          console.log(`    已缓存 ${allHighQuestions.length} 道高中题目`);
        }
        
        const allHighQuestions = this._allHighQuestionsCache;
        
        // 过滤包含关键词的题目
        const allResults = allHighQuestions.filter(q => {
          const cat = q.category || '';
          return topic.keywords.some(keyword => cat.includes(keyword));
        });

        // 统计每个 category 的数量
        const categoryStats = {};
        const grammarPointStats = {};

        allResults.forEach(q => {
          const cat = q.category || '未分类';
          categoryStats[cat] = (categoryStats[cat] || 0) + 1;
          
          if (q.grammarPoint) {
            const gp = q.grammarPoint;
            grammarPointStats[gp] = (grammarPointStats[gp] || 0) + 1;
          }
        });

        const uniqueCategories = Object.keys(categoryStats).sort((a, b) => 
          categoryStats[b] - categoryStats[a]
        );

        console.log(`  共找到 ${allResults.length} 道相关题目`);
        console.log(`  涉及 ${uniqueCategories.length} 个不同的 category:`);
        
        uniqueCategories.forEach(cat => {
          console.log(`    - "${cat}": ${categoryStats[cat]} 题`);
        });

        // 显示 grammarPoint 统计（前5个）
        const topGrammarPoints = Object.entries(grammarPointStats)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        
        if (topGrammarPoints.length > 0) {
          console.log(`  主要 grammarPoint (前5个):`);
          topGrammarPoints.forEach(([gp, count]) => {
            console.log(`    - "${gp}": ${count} 题`);
          });
        }

        // 生成建议的查询 category 列表
        const suggestedCategories = uniqueCategories.filter(cat => {
          // 排除太宽泛的分类
          return !cat.includes('综合') || categoryStats[cat] > 10;
        });

        console.log(`\n  💡 建议查询的 category 列表:`);
        if (suggestedCategories.length > 0) {
          suggestedCategories.forEach(cat => {
            console.log(`    - "${cat}" (${categoryStats[cat]} 题)`);
          });
        } else {
          console.log(`    ⚠️  没有找到合适的 category，可能需要使用模糊匹配`);
        }

        topicResults.push({
          topic: topic.name,
          totalQuestions: allResults.length,
          categories: uniqueCategories,
          categoryStats: categoryStats,
          suggestedCategories: suggestedCategories
        });

      } catch (error) {
        console.error(`  ❌ 查询 ${topic.name} 专题失败:`, error);
      }
    }

    // 保存结果
    this.setData({
      testResults: [...this.data.testResults, {
        test: '测试3: 专题与子知识点对应关系',
        results: topicResults
      }]
    });
  },

  // 手动重新运行测试
  async rerunTests() {
    wx.showModal({
      title: '重新运行测试',
      content: '确定要重新运行所有测试吗？',
      success: (res) => {
        if (res.confirm) {
          this.runAllTests();
        }
      }
    });
  },

  // 导出结果
  exportResults() {
    const results = this.data.testResults;
    const jsonStr = JSON.stringify(results, null, 2);
    
    console.log('\n📄 测试结果 JSON:');
    console.log(jsonStr);
    
    wx.setClipboardData({
      data: jsonStr,
      success: () => {
        wx.showToast({
          title: '结果已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  }
});
