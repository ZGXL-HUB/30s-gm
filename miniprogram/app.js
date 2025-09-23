// app.js
App({
  onLaunch: function () {
    this.initCloud();
    this.globalData = {};
    
    // 静默登录
    this.silentLogin();
    
    // 检查是否需要显示水平测试
    this.checkLevelTest();
  },

  // 初始化云开发
  initCloud: function() {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
      wx.showToast({
        title: '请升级微信版本',
        icon: 'none'
      });
      return;
    }

    try {
      // 启用云开发进行测试
      console.log('🔄 启用云开发进行 helloCloud 测试');
      
      const config = require('./config/env.js');
      
      // 检查是否配置了有效的云开发环境ID
      if (!config.cloudEnvId || config.cloudEnvId === 'your-cloud-env-id') {
        console.log('⚠️ 云开发环境ID未配置，将使用本地数据');
        this.globalData.useCloud = false;
        return;
      }
      
      wx.cloud.init({
        traceUser: true,
        env: config.cloudEnvId,
      });
      console.log('云开发初始化成功');
      this.globalData.useCloud = true;
      
      // 延迟测试云数据库连接
      setTimeout(() => {
        this.testCloudDatabase();
      }, 1000);
      
    } catch (error) {
      console.error('初始化失败:', error);
      console.log('将使用本地数据作为备用方案');
      this.globalData.useCloud = false;
    }
  },

  // 测试云数据库连接
  testCloudDatabase: function() {
    if (!wx.cloud || !wx.cloud.database) {
      console.log('云数据库不可用，将使用本地数据');
      return;
    }
    
    wx.cloud.database().collection('questions').limit(1).get({
      success: (res) => {
        console.log('✅ 云数据库连接成功，数据条数:', res.data.length);
        if (res.data.length > 0) {
          console.log('✅ 样本数据:', res.data[0]);
        }
      },
      fail: (err) => {
        console.error('❌ 云数据库连接失败:', err);
        console.log('将使用本地数据作为备用方案');
      }
    });
  },

  globalData: {
    userInfo: null,
    isLoggedIn: false
  },
  
  // 静默登录
  silentLogin: function() {
    if (!wx.cloud || !this.globalData.useCloud) {
      console.log('云开发不可用，跳过静默登录');
      // 创建匿名用户信息
      this.globalData.userInfo = {
        openid: 'anonymous_' + Date.now(),
        appid: 'anonymous',
        unionid: null,
        loginTime: new Date().toISOString(),
        isAnonymous: true
      };
      this.globalData.isLoggedIn = true;
      wx.setStorageSync('userInfo', this.globalData.userInfo);
      console.log('📱 使用匿名用户信息:', this.globalData.userInfo);
      return;
    }
    
    console.log('🔄 开始静默登录...');
    
    // 先尝试使用本地存储的用户信息
    const localUserInfo = wx.getStorageSync('userInfo');
    if (localUserInfo && localUserInfo.openid) {
      this.globalData.userInfo = localUserInfo;
      this.globalData.isLoggedIn = true;
      console.log('📱 使用本地用户信息:', localUserInfo);
      this.onLoginSuccess();
      return;
    }
    
    // 尝试调用云函数获取用户信息
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res => {
      const { openid, appid, unionid } = res.result;
      
      // 保存用户信息到全局数据
      this.globalData.userInfo = {
        openid,
        appid,
        unionid,
        loginTime: new Date().toISOString()
      };
      
      this.globalData.isLoggedIn = true;
      
      // 保存到本地存储
      wx.setStorageSync('userInfo', this.globalData.userInfo);
      
      console.log('✅ 静默登录成功:', this.globalData.userInfo);
      
      // 触发登录成功事件
      this.onLoginSuccess();
      
    }).catch(err => {
      console.error('❌ 静默登录失败:', err);
      console.log('⚠️ 云函数调用失败，将使用匿名模式');
      this.globalData.isLoggedIn = false;
      
      // 创建匿名用户信息
      this.globalData.userInfo = {
        openid: 'anonymous_' + Date.now(),
        appid: 'anonymous',
        unionid: null,
        loginTime: new Date().toISOString(),
        isAnonymous: true
      };
      
      this.globalData.isLoggedIn = true;
      wx.setStorageSync('userInfo', this.globalData.userInfo);
      console.log('📱 使用匿名用户信息:', this.globalData.userInfo);
    });
  },
  
  // 登录成功回调
  onLoginSuccess: function() {
    console.log('🎉 用户登录成功，可以开始使用需要用户身份的功能');
    // 这里可以添加登录成功后的逻辑，比如同步用户数据等
  },
  
  // 获取用户信息
  getUserInfo: function() {
    return this.globalData.userInfo;
  },
  
  // 检查是否已登录
  isUserLoggedIn: function() {
    return this.globalData.isLoggedIn && this.globalData.userInfo;
  },
  
  // 检查是否需要显示水平测试
  checkLevelTest: function() {
    const levelTestCompleted = wx.getStorageSync('levelTestCompleted');
    
    if (!levelTestCompleted) {
      // 延迟显示，确保页面加载完成
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/level-test/index'
        });
      }, 1000);
    }
  }
});
