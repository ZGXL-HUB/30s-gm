// app.js
const { UserService, FeedbackService } = require('./services/index.js');

App({
  onLaunch: function () {
    this.globalData = {};
    this.initCloud();
    
    // 静默登录
    this.silentLogin();
    
    // 尝试同步本地反馈到云端
    this.syncLocalFeedbacks();
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
    
    // 优化查询，避免全表扫描，只查询一条记录测试连接
    wx.cloud.database().collection('questions').limit(1).field({
      _id: true,
      text: true,
      category: true
    }).get({
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
    
    // 尝试调用云函数获取用户信息（使用统一API服务）
    UserService.login({
      showLoading: false,
      showError: false
    }).then(result => {
      if (result.success) {
        const { openid, appid, unionid } = result;
        
        // 保存用户信息到全局数据
        this.globalData.userInfo = {
          openid,
          appid,
          unionid,
          loginTime: new Date().toISOString()
        };
        
        this.globalData.isLoggedIn = true;
        
        // 保存到本地存储
        UserService.saveUserInfo(this.globalData.userInfo);
        
        console.log('✅ 静默登录成功:', this.globalData.userInfo);
        
        // 触发登录成功事件
        this.onLoginSuccess();
      } else {
        // 登录失败，使用匿名模式
        this.handleLoginFailure();
      }
    }).catch(err => {
      console.error('❌ 静默登录异常:', err);
      this.handleLoginFailure();
    });
  },
  
  // 处理登录失败
  handleLoginFailure: function() {
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
    UserService.saveUserInfo(this.globalData.userInfo);
    console.log('📱 使用匿名用户信息:', this.globalData.userInfo);
  },
  
  // 登录成功回调
  onLoginSuccess: function() {
    console.log('🎉 用户登录成功，可以开始使用需要用户身份的功能');
    // 这里可以添加登录成功后的逻辑，比如同步用户数据等
  },
  
  // 获取用户信息
  getUserInfo: function() {
    return this.globalData.userInfo || UserService.getUserInfo();
  },
  
  // 检查是否已登录
  isUserLoggedIn: function() {
    return this.globalData.isLoggedIn && this.globalData.userInfo;
  },
  
  // 同步本地反馈到云端
  syncLocalFeedbacks: function() {
    // 延迟执行，确保云开发已初始化
    setTimeout(async () => {
      try {
        if (!wx.cloud || !this.globalData.useCloud) {
          console.log('云开发不可用，跳过反馈同步');
          return;
        }

        const result = await FeedbackService.syncLocalFeedbacksToCloud({
          showLoading: false,
          showError: false
        });

        if (result.success && result.syncedCount > 0) {
          console.log(`✅ 应用启动时成功同步 ${result.syncedCount} 条反馈到云端`);
        }
      } catch (error) {
        console.error('应用启动时同步反馈失败:', error);
        // 静默失败，不影响应用启动
      }
    }, 2000); // 延迟2秒，确保云开发已完全初始化
  },
  
});
