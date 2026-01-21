// 题库重复题目批量筛查并删减脚本
// 在微信开发者工具控制台运行

/**
 * 检测并删除重复题目
 * @param {Object} options 配置选项
 * @param {boolean} options.dryRun - 是否模拟运行（不实际删除）
 * @param {string} options.keepStrategy - 保留策略: 'oldest'（保留最早的）或 'newest'（保留最新的）
 * @param {boolean} options.considerSchoolLevel - 是否考虑学段（schoolLevel）作为重复判断条件
 * @param {boolean} options.considerCategory - 是否考虑分类（category）作为重复判断条件
 * @param {number} options.batchSize - 批处理大小（默认20）
 */
async function detectAndRemoveDuplicates(options = {}) {
  const {
    dryRun = true,
    keepStrategy = 'oldest', // 'oldest' 或 'newest'
    considerSchoolLevel = false, // 是否按学段区分重复
    considerCategory = false, // 是否按分类区分重复
    batchSize = 20
  } = options;

  try {
    console.log('🔍 开始检测重复题目...\n');
    console.log(`📋 配置:`);
    console.log(`   运行模式: ${dryRun ? '模拟运行（不删除）' : '实际删除'}`);
    console.log(`   保留策略: ${keepStrategy === 'oldest' ? '保留最早创建的' : '保留最新创建的'}`);
    console.log(`   考虑学段: ${considerSchoolLevel ? '是' : '否'}`);
    console.log(`   考虑分类: ${considerCategory ? '是' : '否'}\n`);

    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    const _ = db.command;

    // 1. 获取所有题目（分批获取）
    console.log('📥 正在获取所有题目数据...');
    let allQuestions = [];
    let offset = 0;
    const MAX_BATCH = 20;

    while (true) {
      const result = await questionsCollection
        .field({
          _id: true,
          text: true,
          answer: true,
          schoolLevel: true,
          category: true,
          createdAt: true,
          updatedAt: true
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

    // 2. 检测重复题目
    console.log('🔍 正在检测重复题目...');
    const duplicateGroups = {};
    const duplicateMap = new Map(); // 用于快速查找

    // 构建重复检测的key
    function getDuplicateKey(question) {
      let key = `${question.text || ''}|||${question.answer || ''}`;
      if (considerSchoolLevel) {
        key += `|||${question.schoolLevel || ''}`;
      }
      if (considerCategory) {
        key += `|||${question.category || ''}`;
      }
      return key;
    }

    // 分组重复题目
    allQuestions.forEach(q => {
      const key = getDuplicateKey(q);
      
      if (!duplicateGroups[key]) {
        duplicateGroups[key] = [];
      }
      duplicateGroups[key].push(q);
    });

    // 找出真正的重复组（至少2个题目）
    const realDuplicates = {};
    let totalDuplicateCount = 0;
    let totalToDelete = 0;

    Object.entries(duplicateGroups).forEach(([key, questions]) => {
      if (questions.length > 1) {
        // 按创建时间排序
        questions.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeA - timeB;
        });

        // 确定要保留的题目
        const keepIndex = keepStrategy === 'oldest' ? 0 : questions.length - 1;
        const toKeep = questions[keepIndex];
        const toDelete = questions.filter((_, index) => index !== keepIndex);

        realDuplicates[key] = {
          keep: toKeep,
          delete: toDelete,
          count: questions.length
        };

        totalDuplicateCount += questions.length;
        totalToDelete += toDelete.length;
      }
    });

    console.log(`✅ 检测完成！\n`);

    // 3. 显示统计信息
    console.log('📊 重复题目统计:');
    console.log(`   重复组数: ${Object.keys(realDuplicates).length}`);
    console.log(`   重复题目总数: ${totalDuplicateCount}`);
    console.log(`   将删除题目数: ${totalToDelete}`);
    console.log(`   将保留题目数: ${totalDuplicateCount - totalToDelete}`);
    console.log(`   重复率: ${((totalToDelete / allQuestions.length) * 100).toFixed(2)}%\n`);

    // 4. 显示重复题目详情（前10组）
    const duplicateEntries = Object.entries(realDuplicates);
    if (duplicateEntries.length > 0) {
      console.log('📝 重复题目示例（前10组）:\n');
      duplicateEntries.slice(0, 10).forEach(([key, group], index) => {
        const [text, answer] = key.split('|||');
        console.log(`${index + 1}. 题目: ${(text || '').substring(0, 60)}...`);
        console.log(`   答案: ${answer || '无'}`);
        console.log(`   重复数量: ${group.count} 题`);
        console.log(`   保留: ${group.keep._id} (${group.keep.createdAt ? new Date(group.keep.createdAt).toLocaleString() : '无创建时间'})`);
        console.log(`   删除: ${group.delete.map(q => q._id).join(', ')}`);
        console.log('');
      });

      if (duplicateEntries.length > 10) {
        console.log(`   ... 还有 ${duplicateEntries.length - 10} 组重复题目\n`);
      }
    }

    // 5. 执行删除（如果不是dry run）
    if (dryRun) {
      console.log('💡 这是模拟运行，不会实际删除数据');
      console.log('   如需实际执行删除，请调用:');
      console.log('   detectAndRemoveDuplicates({ dryRun: false })\n');
    } else {
      console.log('🚀 开始执行批量删除...\n');

      let deletedCount = 0;
      let failedCount = 0;
      const allToDelete = [];

      // 收集所有要删除的题目ID
      Object.values(realDuplicates).forEach(group => {
        allToDelete.push(...group.delete.map(q => q._id));
      });

      // 使用云函数批量删除（避免权限问题）
      console.log('   使用云函数批量删除（避免权限问题）...\n');
      
      // 先测试云函数是否支持 batchDelete
      try {
        const testResult = await wx.cloud.callFunction({
          name: 'manageQuestions',
          data: {
            action: 'batchDelete',
            data: {
              ids: []
            }
          }
        });
        
        if (!testResult.result || !testResult.result.success) {
          if (testResult.result && testResult.result.message === '未知的操作类型') {
            console.error('❌ 错误: 云函数不支持 batchDelete 操作！');
            console.error('   请确保已重新部署 manageQuestions 云函数');
            console.error('   部署步骤: 右键 cloudfunctions/manageQuestions -> 上传并部署：云端安装依赖\n');
            return {
              success: false,
              error: '云函数未部署 batchDelete 功能，请先部署云函数'
            };
          }
        }
      } catch (testError) {
        console.error('❌ 测试云函数失败:', testError);
        console.error('   请检查云函数是否已部署\n');
        return {
          success: false,
          error: '云函数调用失败: ' + testError.message
        };
      }
      
      for (let i = 0; i < allToDelete.length; i += batchSize) {
        const batch = allToDelete.slice(i, i + batchSize);

        try {
          const result = await wx.cloud.callFunction({
            name: 'manageQuestions',
            data: {
              action: 'batchDelete',
              data: {
                ids: batch
              }
            }
          });

          if (result.result && result.result.success) {
            deletedCount += result.result.deleted || 0;
            failedCount += result.result.failed || 0;
            
            if (result.result.errors && result.result.errors.length > 0) {
              result.result.errors.forEach(err => {
                console.error(`   删除题目 ${err.id} 失败: ${err.error}`);
              });
            }
          } else {
            console.error(`   批次 ${i / batchSize + 1} 删除失败:`, result.result?.message || '未知错误');
            console.error(`   返回结果:`, JSON.stringify(result.result));
            failedCount += batch.length;
          }
        } catch (error) {
          console.error(`   批次 ${i / batchSize + 1} 调用云函数失败:`, error);
          failedCount += batch.length;
        }

        console.log(`   已处理 ${Math.min(i + batchSize, allToDelete.length)}/${allToDelete.length} 题... (成功: ${deletedCount}, 失败: ${failedCount})`);
      }

      console.log(`\n✅ 批量删除完成！`);
      console.log(`   成功删除: ${deletedCount} 题`);
      console.log(`   删除失败: ${failedCount} 题\n`);

      // 验证结果
      const verifyResult = await questionsCollection.count();
      console.log(`📊 验证结果: 当前题库共有 ${verifyResult.total} 道题目`);
    }

    return {
      success: true,
      dryRun: dryRun,
      totalQuestions: allQuestions.length,
      duplicateGroups: Object.keys(realDuplicates).length,
      totalDuplicates: totalDuplicateCount,
      toDelete: totalToDelete,
      toKeep: totalDuplicateCount - totalToDelete,
      duplicateDetails: realDuplicates
    };

  } catch (error) {
    console.error('❌ 操作失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 按分类统计重复情况
 */
async function analyzeDuplicatesByCategory() {
  try {
    console.log('📊 按分类分析重复情况...\n');

    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    const _ = db.command;

    // 获取所有题目
    let allQuestions = [];
    let offset = 0;
    const MAX_BATCH = 20;

    while (true) {
      const result = await questionsCollection
        .field({
          _id: true,
          text: true,
          answer: true,
          category: true,
          schoolLevel: true
        })
        .skip(offset)
        .limit(MAX_BATCH)
        .get();

      if (result.data.length === 0) break;
      allQuestions.push(...result.data);
      offset += MAX_BATCH;
      if (result.data.length < MAX_BATCH) break;
    }

    // 按分类分组
    const byCategory = {};
    allQuestions.forEach(q => {
      const category = q.category || '未分类';
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      byCategory[category].push(q);
    });

    // 检测每个分类内的重复
    const categoryStats = {};
    Object.entries(byCategory).forEach(([category, questions]) => {
      const duplicateGroups = {};
      
      questions.forEach(q => {
        const key = `${q.text || ''}|||${q.answer || ''}`;
        if (!duplicateGroups[key]) {
          duplicateGroups[key] = [];
        }
        duplicateGroups[key].push(q);
      });

      const realDuplicates = Object.entries(duplicateGroups)
        .filter(([_, group]) => group.length > 1);

      if (realDuplicates.length > 0) {
        const totalDup = realDuplicates.reduce((sum, [_, group]) => sum + group.length, 0);
        const toDelete = realDuplicates.reduce((sum, [_, group]) => sum + group.length - 1, 0);

        categoryStats[category] = {
          total: questions.length,
          duplicateGroups: realDuplicates.length,
          duplicateCount: totalDup,
          toDelete: toDelete
        };
      }
    });

    // 显示统计
    const sortedCategories = Object.entries(categoryStats)
      .sort((a, b) => b[1].toDelete - a[1].toDelete);

    console.log('📋 各分类重复情况:');
    sortedCategories.forEach(([category, stats]) => {
      console.log(`\n${category}:`);
      console.log(`   总题目数: ${stats.total}`);
      console.log(`   重复组数: ${stats.duplicateGroups}`);
      console.log(`   重复题目数: ${stats.duplicateCount}`);
      console.log(`   可删除数: ${stats.toDelete}`);
      console.log(`   重复率: ${((stats.toDelete / stats.total) * 100).toFixed(2)}%`);
    });

    return {
      success: true,
      categoryStats: categoryStats
    };

  } catch (error) {
    console.error('❌ 分析失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行模拟（不实际删除数据）
console.log('🚀 题库重复题目检测与删除工具\n');
console.log('💡 提示: 这是模拟运行，不会删除数据');
console.log('   查看检测结果后，如需实际执行删除，请调用:');
console.log('   detectAndRemoveDuplicates({ dryRun: false })\n');
console.log('📖 使用说明:');
console.log('   1. 默认检测: detectAndRemoveDuplicates()');
console.log('   2. 实际删除: detectAndRemoveDuplicates({ dryRun: false })');
console.log('   3. 保留最新: detectAndRemoveDuplicates({ keepStrategy: "newest" })');
console.log('   4. 考虑学段: detectAndRemoveDuplicates({ considerSchoolLevel: true })');
console.log('   5. 考虑分类: detectAndRemoveDuplicates({ considerCategory: true })');
console.log('   6. 按分类分析: analyzeDuplicatesByCategory()\n');

// 默认运行模拟检测
detectAndRemoveDuplicates({ dryRun: true });
