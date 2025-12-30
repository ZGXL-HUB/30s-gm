// 详细云开发状态检查脚本
// 复制到微信开发者工具控制台运行

(function() {
  console.log('🔍 详细云开发状态检查...');
  
  // 1. 检查wx.cloud对象
  console.log('1️⃣ 检查wx.cloud对象:');
  console.log('  - wx.cloud存在:', !!wx.cloud);
  if (wx.cloud) {
    console.log('  - wx.cloud.database存在:', !!wx.cloud.database);
    console.log('  - wx.cloud.callFunction存在:', !!wx.cloud.callFunction);
    console.log('  - wx.cloud.init存在:', !!wx.cloud.init);
  }
  
  // 2. 检查app实例
  console.log('2️⃣ 检查app实例:');
  try {
    const app = getApp();
    console.log('  - app实例存在:', !!app);
    if (app) {
      console.log('  - app.globalData存在:', !!app.globalData);
      if (app.globalData) {
        console.log('  - app.globalData.useCloud:', app.globalData.useCloud);
        console.log('  - app.globalData.userInfo存在:', !!app.globalData.userInfo);
        if (app.globalData.userInfo) {
          console.log('  - 用户信息:', app.globalData.userInfo);
        }
      }
    }
  } catch (error) {
    console.log('  - 获取app实例失败:', error.message);
  }
  
  // 3. 测试云数据库操作
  console.log('3️⃣ 测试云数据库操作:');
  wx.cloud.database().collection('questions').limit(1).get()
    .then(res => {
      console.log('  - 数据库查询成功');
      console.log('  - 数据条数:', res.data.length);
      if (res.data.length > 0) {
        console.log('  - 样本数据ID:', res.data[0]._id);
        console.log('  - 样本数据分类:', res.data[0].category);
      }
    })
    .catch(err => {
      console.log('  - 数据库查询失败:', err.message);
    });
  
  // 4. 测试云函数调用
  console.log('4️⃣ 测试云函数调用:');
  wx.cloud.callFunction({
    name: 'helloCloud',
    data: {}
  }).then(res => {
    console.log('  - 云函数调用成功:', res.result);
  }).catch(err => {
    console.log('  - 云函数调用失败:', err.message);
    console.log('  - 错误代码:', err.errCode);
  });
  
  // 5. 检查本地存储
  console.log('5️⃣ 检查本地存储:');
  const userInfo = wx.getStorageSync('userInfo');
  console.log('  - 用户信息存储:', !!userInfo);
  if (userInfo) {
    console.log('  - 用户OpenID:', userInfo.openid);
    console.log('  - 是否匿名用户:', userInfo.isAnonymous);
  }
  
  // 6. 检查页面状态
  console.log('6️⃣ 检查页面状态:');
  const pages = getCurrentPages();
  console.log('  - 当前页面数量:', pages.length);
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    console.log('  - 当前页面路由:', currentPage.route);
    console.log('  - 页面有updateTodayStats方法:', !!currentPage.updateTodayStats);
  }
  
  console.log('🎯 检查完成！');
  
  // 创建测试数据函数
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
  
  console.log('💡 运行 createTestData() 来创建测试数据');
  
})();
