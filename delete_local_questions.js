// 删除本地题库文件脚本
// 在微信开发者工具控制台运行

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
    console.log('💡 建议手动复制这些文件到 backup 目录');
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

// 检查本地文件大小
async function checkLocalFileSizes() {
  try {
    console.log('📊 检查本地题库文件大小...');
    
    const filesToCheck = [
      'miniprogram/data/intermediate_questions.js',
      'miniprogram/data/writing_nouns.js',
      'miniprogram/data/writing_voices.js',
      'miniprogram/data/writing_adverbs.js',
      'miniprogram/data/writing_comparisons.js',
      'miniprogram/data/writing_tenses.js',
      'miniprogram/data/writing_pronouns.js'
    ];
    
    console.log('📋 文件列表:');
    filesToCheck.forEach(file => console.log(`  - ${file}`));
    
    console.log('');
    console.log('💡 请手动检查这些文件的大小');
    console.log('📊 预计可节省空间: 1-2MB');
    
    return {
      success: true,
      message: '请手动检查文件大小'
    };
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行脚本
console.log('🗑️ 本地题库文件管理脚本');
console.log('');
console.log('📋 可用的函数：');
console.log('1. checkLocalFileSizes() - 检查本地文件大小');
console.log('2. backupLocalQuestionFiles() - 备份本地题库文件（推荐先执行）');
console.log('3. deleteLocalQuestionFiles() - 删除本地题库文件');
console.log('');
console.log('💡 建议执行顺序：');
console.log('   1. 先运行 checkLocalFileSizes() 查看文件');
console.log('   2. 运行 backupLocalQuestionFiles() 备份文件');
console.log('   3. 确认云数据库上传成功后，手动删除文件');
console.log('');
console.log('⚠️ 注意：删除操作不可逆，请确保已备份和上传成功！');
