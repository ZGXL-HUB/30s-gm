// 题库上传到云数据库脚本
// 在微信开发者工具控制台运行

// 上传题库到云数据库
async function uploadQuestionsToCloud() {
  try {
    console.log('🔄 开始上传题库到云数据库...');
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    
    // 调用云函数进行上传
    const result = await wx.cloud.callFunction({
      name: 'initializeQuestions',
      data: {
        action: 'uploadAllQuestions'
      }
    });
    
    console.log('📊 上传结果:', result);
    
    if (result.result.success) {
      console.log('✅ 上传成功！');
      console.log(`📈 总共上传了 ${result.result.totalImported} 道题目`);
    } else {
      console.error('❌ 上传失败:', result.result.message);
    }
    
    return result.result;
    
  } catch (error) {
    console.error('❌ 上传失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 验证上传结果
async function verifyUpload() {
  try {
    console.log('🔍 验证上传结果...');
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    
    // 获取总数
    const countResult = await questionsCollection.count();
    console.log(`📊 云数据库中总题目数: ${countResult.total}`);
    
    // 获取分类统计
    const categoriesResult = await questionsCollection
      .aggregate()
      .group({
        _id: '$category',
        count: db.command.aggregate.sum(1)
      })
      .end();
    
    console.log('📋 各分类题目数量:');
    categoriesResult.list.forEach(item => {
      console.log(`  ${item._id}: ${item.count} 题`);
    });
    
    return {
      success: true,
      totalCount: countResult.total,
      categories: categoriesResult.list
    };
    
  } catch (error) {
    console.error('❌ 验证失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 清空云数据库（谨慎使用）
async function clearCloudDatabase() {
  try {
    console.log('⚠️ 开始清空云数据库...');
    
    const db = wx.cloud.database();
    const questionsCollection = db.collection('questions');
    
    let deletedCount = 0;
    let hasMore = true;
    
    while (hasMore) {
      const result = await questionsCollection.limit(100).get();
      
      if (result.data.length === 0) {
        hasMore = false;
        break;
      }
      
      // 批量删除
      const deletePromises = result.data.map(doc => 
        questionsCollection.doc(doc._id).remove()
      );
      
      await Promise.all(deletePromises);
      deletedCount += result.data.length;
      
      console.log(`🗑️ 已删除 ${deletedCount} 条数据`);
    }
    
    console.log(`✅ 清空完成，共删除 ${deletedCount} 条数据`);
    return {
      success: true,
      deletedCount: deletedCount
    };
    
  } catch (error) {
    console.error('❌ 清空失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行脚本
console.log('🚀 题库上传脚本');
console.log('');
console.log('📋 可用的函数：');
console.log('1. uploadQuestionsToCloud() - 上传题库到云数据库');
console.log('2. verifyUpload() - 验证上传结果');
console.log('3. clearCloudDatabase() - 清空云数据库（谨慎使用）');
console.log('');
console.log('💡 建议执行顺序：');
console.log('   1. 先运行 verifyUpload() 检查当前状态');
console.log('   2. 如果需要清空，运行 clearCloudDatabase()');
console.log('   3. 运行 uploadQuestionsToCloud() 上传数据');
console.log('   4. 再次运行 verifyUpload() 验证结果');
