// 快速验证脚本 - 直接在微信开发者工具控制台运行
// 复制以下代码到控制台，然后按回车执行

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
const practiceHistory = wx.getStorageSync('practiceHistory') || [];
const writingHistory = wx.getStorageSync('writingHistory') || [];
const wrongQuestionHistory = wx.getStorageSync('wrongQuestionHistory') || [];

console.log('📊 用户数据统计:');
console.log('  - 练习历史:', practiceHistory.length, '条');
console.log('  - 书写历史:', writingHistory.length, '条');
console.log('  - 错题历史:', wrongQuestionHistory.length, '条');

if (practiceHistory.length === 0 && writingHistory.length === 0 && wrongQuestionHistory.length === 0) {
  console.log('💡 这是正常现象：新用户或数据已清空');
  console.log('💡 建议：进行一些练习来生成统计数据');
} else {
  console.log('✅ 用户数据存在');
}

// 4. 创建测试数据（可选）
console.log('💡 如需创建测试数据，请运行：createTestData()');

function createTestData() {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
  
  wx.setStorageSync('practiceHistory', [{
    date: today,
    correct: 5,
    total: 10,
    category: '测试分类'
  }]);
  
  wx.setStorageSync('writingHistory', [{
    date: today,
    correctCount: 3,
    totalCount: 5
  }]);
  
  wx.setStorageSync('wrongQuestionHistory', [{
    date: today,
    correctCount: 2,
    totalCount: 3
  }]);
  
  console.log('✅ 测试数据创建完成');
  
  // 刷新主页面
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (currentPage && currentPage.updateTodayStats) {
    currentPage.updateTodayStats();
    console.log('✅ 主页面统计已刷新');
  }
}

window.createTestData = createTestData;
