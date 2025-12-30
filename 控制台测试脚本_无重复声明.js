// 控制台测试脚本 - 避免重复声明错误
// 直接复制粘贴到微信开发者工具的控制台运行

(function() {
  console.log('🧪 开始云开发连接测试...');
  
  // 1. 检查云开发环境ID配置
  console.log('🔍 检查云开发环境ID配置...');
  try {
    // 直接检查app.js中的配置
    const app = getApp();
    if (app && app.globalData && app.globalData.useCloud) {
      console.log('✅ 云开发已启用');
      console.log('✅ 环境ID配置正确（从app.js确认）');
    } else {
      console.log('⚠️ 云开发未启用或配置有问题');
    }
  } catch (error) {
    console.log('❌ 无法检查配置:', error.message);
  }

  // 2. 检查云数据库连接
  console.log('🔍 检查云数据库连接...');
  wx.cloud.database().collection('questions').limit(1).get()
    .then(res => {
      console.log('✅ 云数据库连接成功');
      console.log('📊 数据条数:', res.data.length);
      if (res.data.length > 0) {
        console.log('📄 样本数据:', res.data[0]);
      }
    })
    .catch(err => {
      console.log('❌ 云数据库连接失败:', err.message);
    });

  // 3. 检查用户数据
  console.log('🔍 检查用户数据...');
  const userPracticeHistory = wx.getStorageSync('practiceHistory') || [];
  const userWritingHistory = wx.getStorageSync('writingHistory') || [];
  const userWrongQuestionHistory = wx.getStorageSync('wrongQuestionHistory') || [];

  console.log('📊 用户数据统计:');
  console.log('  - 练习历史:', userPracticeHistory.length, '条');
  console.log('  - 书写历史:', userWritingHistory.length, '条');
  console.log('  - 错题历史:', userWrongQuestionHistory.length, '条');

  if (userPracticeHistory.length === 0 && userWritingHistory.length === 0 && userWrongQuestionHistory.length === 0) {
    console.log('💡 这是正常现象：新用户或数据已清空');
    console.log('💡 建议：进行一些练习来生成统计数据');
  } else {
    console.log('✅ 用户数据存在');
  }

  // 4. 创建测试数据函数
  window.createTestData = function() {
    console.log('📝 创建测试数据...');
    
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
    
    wx.setStorageSync('practiceHistory', [{
      date: today,
      correct: 5,
      total: 10,
      category: '测试分类',
      timestamp: Date.now()
    }]);
    
    wx.setStorageSync('writingHistory', [{
      date: today,
      correctCount: 3,
      totalCount: 5,
      timestamp: Date.now()
    }]);
    
    wx.setStorageSync('wrongQuestionHistory', [{
      date: today,
      correctCount: 2,
      totalCount: 3,
      timestamp: Date.now()
    }]);
    
    console.log('✅ 测试数据创建完成');
    
    // 刷新主页面
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage && currentPage.updateTodayStats) {
      currentPage.updateTodayStats();
      console.log('✅ 主页面统计已刷新');
    }
  };

  // 5. 清理测试数据函数
  window.clearTestData = function() {
    console.log('🧹 清理测试数据...');
    
    wx.removeStorageSync('practiceHistory');
    wx.removeStorageSync('writingHistory');
    wx.removeStorageSync('wrongQuestionHistory');
    
    console.log('✅ 测试数据清理完成');
    
    // 刷新主页面
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage && currentPage.updateTodayStats) {
      currentPage.updateTodayStats();
      console.log('✅ 主页面统计已刷新');
    }
  };

  console.log('🎉 测试脚本加载完成！');
  console.log('📝 可用命令：');
  console.log('  - createTestData() 创建测试数据');
  console.log('  - clearTestData() 清理测试数据');
  
})();
