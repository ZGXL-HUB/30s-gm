// 直接复制这个脚本到微信开发者工具控制台运行

// 备份本地题库文件
async function backupLocalQuestionFiles() {
  try {
    console.log('📦 开始备份本地题库文件...');
    
    console.log('📋 需要备份的文件:');
    const filesToBackup = [
      'miniprogram/data/intermediate_questions.js',
      'miniprogram/data/writing_nouns.js',
      'miniprogram/data/writing_voices.js',
      'miniprogram/data/writing_adverbs.js',
      'miniprogram/data/writing_comparisons.js',
      'miniprogram/data/writing_tenses.js',
      'miniprogram/data/writing_pronouns.js'
    ];
    
    filesToBackup.forEach(file => console.log(`  - ${file}`));
    
    console.log('');
    console.log('💡 请手动复制这些文件到 backup 目录');
    console.log('📁 备份目录建议: backup/local_questions_backup/');
    
    return {
      success: true,
      message: '请手动备份上述文件'
    };
    
  } catch (error) {
    console.error('❌ 备份失败:', error);
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

// 上传题库到云数据库
async function uploadQuestionsToCloud() {
  try {
    console.log('🔄 开始上传题库到云数据库...');
    
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

// 删除本地题库文件
async function deleteLocalQuestionFiles() {
  try {
    console.log('🗑️ 开始删除本地题库文件...');
    
    // 要删除的文件列表
    const filesToDelete = [
      'miniprogram/data/intermediate_questions.js',
      'miniprogram/data/writing_nouns.js',
      'miniprogram/data/writing_voices.js',
      'miniprogram/data/writing_adverbs.js',
      'miniprogram/data/writing_comparisons.js',
      'miniprogram/data/writing_tenses.js',
      'miniprogram/data/writing_pronouns.js'
    ];
    
    console.log('📋 将要删除的文件:');
    filesToDelete.forEach(file => console.log(`  - ${file}`));
    
    console.log('');
    console.log('⚠️ 注意：此操作不可逆，请确保已备份和上传成功！');
    console.log('💡 建议先运行 backupLocalQuestionFiles() 进行备份');
    
    return {
      success: true,
      message: '请手动删除上述文件，或使用备份脚本'
    };
    
  } catch (error) {
    console.error('❌ 操作失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 显示可用函数
console.log('🚀 题库迁移脚本已加载');
console.log('');
console.log('📋 可用的函数：');
console.log('1. backupLocalQuestionFiles() - 备份本地题库文件');
console.log('2. verifyUpload() - 验证云数据库状态');
console.log('3. uploadQuestionsToCloud() - 上传题库到云数据库');
console.log('4. deleteLocalQuestionFiles() - 删除本地题库文件');
console.log('');
console.log('💡 建议执行顺序：');
console.log('   1. backupLocalQuestionFiles() - 先备份');
console.log('   2. verifyUpload() - 检查云数据库状态');
console.log('   3. uploadQuestionsToCloud() - 上传数据');
console.log('   4. verifyUpload() - 再次验证');
console.log('   5. deleteLocalQuestionFiles() - 最后删除本地文件');
console.log('');
console.log('⚠️ 注意：删除操作不可逆，请确保已备份和上传成功！');

