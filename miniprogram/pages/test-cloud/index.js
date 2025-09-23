// 云函数测试页面
const testFunctions = require('../../../test_cloudfunctions.js');

Page({
  data: {
    testResults: null,
    isLoading: false
  },

  onLoad() {
    console.log('云函数测试页面加载完成');
  },

  // 运行综合测试
  async runTest() {
    this.setData({ isLoading: true });
    
    try {
      console.log('开始运行云函数测试...');
      const results = await testFunctions.runComprehensiveTest();
      
      this.setData({
        testResults: results,
        isLoading: false
      });
      
      console.log('测试完成:', results);
    } catch (error) {
      console.error('测试失败:', error);
      this.setData({ isLoading: false });
      
      wx.showModal({
        title: '测试失败',
        content: error.message || '未知错误',
        showCancel: false
      });
    }
  },

  // 测试云函数
  async testCloudFunctions() {
    this.setData({ isLoading: true });
    
    try {
      const results = await testFunctions.testCloudFunctions();
      this.setData({
        testResults: results,
        isLoading: false
      });
    } catch (error) {
      console.error('云函数测试失败:', error);
      this.setData({ isLoading: false });
    }
  },

  // 测试云数据库
  async testCloudDatabase() {
    this.setData({ isLoading: true });
    
    try {
      const results = await testFunctions.testCloudDatabase();
      this.setData({
        testResults: results,
        isLoading: false
      });
    } catch (error) {
      console.error('云数据库测试失败:', error);
      this.setData({ isLoading: false });
    }
  },

  // 清除测试结果
  clearResults() {
    this.setData({ testResults: null });
  }
});

