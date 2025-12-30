// 初始化用户相关集合脚本
// 在微信开发者工具控制台中运行此脚本

async function initUserCollections() {
  console.log('🚀 开始初始化用户相关集合...');
  
  try {
    // 1. 创建用户练习记录集合
    console.log('📝 创建用户练习记录集合...');
    await wx.cloud.database().collection('user_practice_records').add({
      data: {
        _id: 'template_record',
        openid: 'template',
        practiceType: 'grammar',
        questions: [],
        correctAnswers: 0,
        totalQuestions: 0,
        accuracy: 0,
        practiceDate: new Date().toISOString(),
        duration: 0,
        createTime: new Date().toISOString()
      }
    });
    console.log('✅ 用户练习记录集合创建成功');
    
    // 2. 创建用户测试记录集合
    console.log('📊 创建用户测试记录集合...');
    await wx.cloud.database().collection('user_test_records').add({
      data: {
        _id: 'template_test',
        openid: 'template',
        testType: 'grammar_level',
        score: 0,
        totalScore: 0,
        level: '',
        levelText: '',
        testDate: new Date().toISOString(),
        questions: [],
        answers: [],
        createTime: new Date().toISOString()
      }
    });
    console.log('✅ 用户测试记录集合创建成功');
    
    // 3. 创建用户错题记录集合
    console.log('❌ 创建用户错题记录集合...');
    await wx.cloud.database().collection('user_mistakes').add({
      data: {
        _id: 'template_mistake',
        openid: 'template',
        questionId: 'template',
        questionText: 'template',
        userAnswer: 'template',
        correctAnswer: 'template',
        category: 'template',
        mistakeDate: new Date().toISOString(),
        isReviewed: false,
        reviewCount: 0,
        createTime: new Date().toISOString()
      }
    });
    console.log('✅ 用户错题记录集合创建成功');
    
    // 4. 创建用户进度集合
    console.log('📈 创建用户进度集合...');
    await wx.cloud.database().collection('user_progress').add({
      data: {
        _id: 'template_progress',
        openid: 'template',
        grammarLevel: '',
        grammarLevelText: '',
        totalPracticeCount: 0,
        totalWritingCount: 0,
        totalMistakeCount: 0,
        lastPracticeDate: null,
        lastTestDate: null,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    });
    console.log('✅ 用户进度集合创建成功');
    
    // 5. 创建用户书写记录集合
    console.log('✍️ 创建用户书写记录集合...');
    await wx.cloud.database().collection('user_writing_records').add({
      data: {
        _id: 'template_writing',
        openid: 'template',
        questionId: 'template',
        questionText: 'template',
        userAnswer: 'template',
        correctAnswer: 'template',
        isCorrect: false,
        writingDate: new Date().toISOString(),
        duration: 0,
        createTime: new Date().toISOString()
      }
    });
    console.log('✅ 用户书写记录集合创建成功');
    
    // 6. 设置集合权限
    console.log('🔐 设置集合权限...');
    console.log('请在云开发控制台中手动设置以下集合的权限：');
    console.log('- user_practice_records: 仅创建者可读写');
    console.log('- user_test_records: 仅创建者可读写');
    console.log('- user_mistakes: 仅创建者可读写');
    console.log('- user_progress: 仅创建者可读写');
    console.log('- user_writing_records: 仅创建者可读写');
    
    // 7. 删除模板数据
    console.log('🧹 清理模板数据...');
    await wx.cloud.database().collection('user_practice_records').doc('template_record').remove();
    await wx.cloud.database().collection('user_test_records').doc('template_test').remove();
    await wx.cloud.database().collection('user_mistakes').doc('template_mistake').remove();
    await wx.cloud.database().collection('user_progress').doc('template_progress').remove();
    await wx.cloud.database().collection('user_writing_records').doc('template_writing').remove();
    console.log('✅ 模板数据清理完成');
    
    console.log('🎉 所有用户集合初始化完成！');
    console.log('📋 已创建的集合：');
    console.log('  - user_practice_records (用户练习记录)');
    console.log('  - user_test_records (用户测试记录)');
    console.log('  - user_mistakes (用户错题记录)');
    console.log('  - user_progress (用户进度)');
    console.log('  - user_writing_records (用户书写记录)');
    
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    
    if (error.errCode === -601002) {
      console.log('💡 解决方案：');
      console.log('1. 检查云开发环境ID是否正确');
      console.log('2. 确认小程序有云开发权限');
      console.log('3. 检查网络连接');
    }
  }
}

// 检查现有集合
async function checkExistingCollections() {
  console.log('🔍 检查现有集合...');
  
  const collections = [
    'questions',
    'user_practice_records',
    'user_test_records', 
    'user_mistakes',
    'user_progress',
    'user_writing_records'
  ];
  
  for (const collectionName of collections) {
    try {
      const result = await wx.cloud.database().collection(collectionName).limit(1).get();
      console.log(`✅ ${collectionName}: 存在 (${result.data.length} 条数据)`);
    } catch (error) {
      console.log(`❌ ${collectionName}: 不存在`);
    }
  }
}

// 运行检查
checkExistingCollections();

// 导出函数供控制台使用
window.initUserCollections = initUserCollections;
window.checkExistingCollections = checkExistingCollections;

console.log('📝 使用方法：');
console.log('1. 运行 checkExistingCollections() 检查现有集合');
console.log('2. 运行 initUserCollections() 初始化缺失的集合');
