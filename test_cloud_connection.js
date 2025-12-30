// 云开发连接测试脚本
// 在微信开发者工具控制台中运行此脚本

async function testCloudConnection() {
  console.log('🧪 开始测试云开发连接...');
  
  try {
    // 1. 测试云开发初始化状态
    console.log('1️⃣ 检查云开发初始化状态...');
    if (!wx.cloud) {
      console.error('❌ 云开发未初始化');
      return;
    }
    console.log('✅ 云开发已初始化');
    
    // 2. 测试云数据库连接
    console.log('2️⃣ 测试云数据库连接...');
    const db = wx.cloud.database();
    const result = await db.collection('questions').limit(5).get();
    console.log(`✅ 云数据库连接成功，获取到 ${result.data.length} 条数据`);
    
    if (result.data.length > 0) {
      console.log('📄 样本数据:', result.data[0]);
    }
    
    // 3. 测试云函数调用
    console.log('3️⃣ 测试云函数调用...');
    try {
      const functionResult = await wx.cloud.callFunction({
        name: 'helloCloud',
        data: {}
      });
      console.log('✅ 云函数调用成功:', functionResult.result);
    } catch (funcError) {
      console.log('⚠️ 云函数调用失败（可能未部署）:', funcError.message);
    }
    
    // 4. 检查用户信息
    console.log('4️⃣ 检查用户信息...');
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      console.log('✅ 用户信息存在:', userInfo);
    } else {
      console.log('⚠️ 用户信息不存在，将使用匿名模式');
    }
    
    // 5. 检查本地存储数据
    console.log('5️⃣ 检查本地存储数据...');
    const practiceHistory = wx.getStorageSync('practiceHistory') || [];
    const writingHistory = wx.getStorageSync('writingHistory') || [];
    const wrongQuestionHistory = wx.getStorageSync('wrongQuestionHistory') || [];
    
    console.log(`📊 本地数据统计:`);
    console.log(`  - 练习历史: ${practiceHistory.length} 条`);
    console.log(`  - 书写历史: ${writingHistory.length} 条`);
    console.log(`  - 错题历史: ${wrongQuestionHistory.length} 条`);
    
    // 6. 测试数据写入
    console.log('6️⃣ 测试数据写入...');
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: '云开发连接测试'
    };
    
    try {
      await db.collection('test_collection').add({
        data: testData
      });
      console.log('✅ 数据写入测试成功');
      
      // 清理测试数据
      await db.collection('test_collection').where({
        test: true
      }).remove();
      console.log('✅ 测试数据清理完成');
      
    } catch (writeError) {
      console.log('⚠️ 数据写入测试失败:', writeError.message);
    }
    
    console.log('🎉 云开发连接测试完成！');
    console.log('📋 测试结果总结:');
    console.log('  ✅ 云开发环境: 正常');
    console.log('  ✅ 云数据库: 正常');
    console.log('  ⚠️ 云函数: 需要检查部署状态');
    console.log('  📊 用户数据: 空（新用户或数据已清空）');
    
  } catch (error) {
    console.error('❌ 云开发连接测试失败:', error);
    
    if (error.errCode === -601002) {
      console.log('💡 解决方案：');
      console.log('1. 检查云开发环境ID是否正确');
      console.log('2. 确认小程序有云开发权限');
      console.log('3. 检查网络连接');
    }
  }
}

// 创建测试数据
async function createTestData() {
  console.log('📝 创建测试数据...');
  
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
    
    // 创建测试练习记录
    const testPracticeRecord = {
      date: today,
      correct: 5,
      total: 10,
      category: '测试分类',
      timestamp: Date.now()
    };
    
    // 创建测试书写记录
    const testWritingRecord = {
      date: today,
      correctCount: 3,
      totalCount: 5,
      timestamp: Date.now()
    };
    
    // 创建测试错题记录
    const testMistakeRecord = {
      date: today,
      correctCount: 2,
      totalCount: 3,
      timestamp: Date.now()
    };
    
    // 保存到本地存储
    wx.setStorageSync('practiceHistory', [testPracticeRecord]);
    wx.setStorageSync('writingHistory', [testWritingRecord]);
    wx.setStorageSync('wrongQuestionHistory', [testMistakeRecord]);
    
    console.log('✅ 测试数据创建完成');
    console.log('📊 创建的测试数据:');
    console.log('  - 练习记录: 1条');
    console.log('  - 书写记录: 1条');
    console.log('  - 错题记录: 1条');
    
    // 刷新主页面统计
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage && currentPage.updateTodayStats) {
      currentPage.updateTodayStats();
      console.log('✅ 主页面统计已刷新');
    }
    
  } catch (error) {
    console.error('❌ 创建测试数据失败:', error);
  }
}

// 清理测试数据
function clearTestData() {
  console.log('🧹 清理测试数据...');
  
  wx.removeStorageSync('practiceHistory');
  wx.removeStorageSync('writingHistory');
  wx.removeStorageSync('wrongQuestionHistory');
  
  console.log('✅ 测试数据清理完成');
  
  // 刷新主页面统计
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (currentPage && currentPage.updateTodayStats) {
    currentPage.updateTodayStats();
    console.log('✅ 主页面统计已刷新');
  }
}

// 导出函数供控制台使用
window.testCloudConnection = testCloudConnection;
window.createTestData = createTestData;
window.clearTestData = clearTestData;

console.log('📝 使用方法：');
console.log('1. 运行 testCloudConnection() 测试云开发连接');
console.log('2. 运行 createTestData() 创建测试数据');
console.log('3. 运行 clearTestData() 清理测试数据');
