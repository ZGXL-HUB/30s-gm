// 专项练习表格页面
Page({
  data: {
    practiceTables: [],
    loading: true,
    currentType: '',
    userProgress: {}
  },

  onLoad(options) {
    const { type } = options;
    this.setData({
      currentType: type || ''
    });
    
    this.loadPracticeTables();
    this.loadUserProgress();
  },

  // 加载专项练习表格列表
  async loadPracticeTables() {
    try {
      this.setData({ loading: true });
      
      // 检查云开发是否可用
      if (!wx.cloud) {
        console.log('云开发不可用，使用本地数据');
        this.setData({
          practiceTables: [],
          loading: false
        });
        return;
      }
      
      // 调用云函数获取练习表格
      const result = await wx.cloud.callFunction({
        name: 'practiceProgress',
        data: {
          action: 'getPracticeTables'
        }
      });
      
      if (result.result.code === 200) {
        let tables = result.result.data;
        
        // 如果指定了类型，只显示该类型的表格
        if (this.data.currentType) {
          tables = tables.filter(table => table.type === this.data.currentType);
        }
        
        this.setData({
          practiceTables: tables,
          loading: false
        });
      } else {
        console.error('获取练习表格失败:', result.result.message);
        this.setData({ loading: false });
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('调用云函数失败:', error);
      this.setData({ 
        practiceTables: [],
        loading: false 
      });
      // 在本地模式下，云函数调用失败是正常的，不显示错误提示
    }
  },

  // 加载用户进度
  async loadUserProgress() {
    try {
      // 检查云开发是否可用
      if (!wx.cloud) {
        console.log('云开发不可用，使用本地进度数据');
        this.setData({
          userProgress: {}
        });
        return;
      }
      
      const userInfo = wx.getStorageSync('userInfo') || {};
      const userId = userInfo.openid || 'anonymous';
      
      const result = await wx.cloud.callFunction({
        name: 'practiceProgress',
        data: {
          action: 'getAll',
          userId: userId
        }
      });
      
      if (result.result.code === 200) {
        const progressMap = {};
        result.result.data.forEach(item => {
          progressMap[item.grammarType] = {
            progress: item.progress,
            errorCount: item.errorCount
          };
        });
        
        this.setData({
          userProgress: progressMap
        });
      }
    } catch (error) {
      console.error('获取用户进度失败:', error);
      // 在本地模式下，云函数调用失败是正常的
      this.setData({
        userProgress: {}
      });
    }
  },

  // 开始专项练习
  startPractice(e) {
    const { tableIds, type } = e.currentTarget.dataset;
    
    if (!tableIds) {
      wx.showToast({
        title: '练习内容暂未开放',
        icon: 'none'
      });
      return;
    }
    
    const url = `/pages/exercise-page/index?tables=${tableIds}&type=${type}&mode=special`;
    
    wx.navigateTo({
      url: url,
      success: () => {
        console.log('跳转到专项练习成功');
      },
      fail: (error) => {
        console.error('跳转失败:', error);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 获取进度显示文本
  getProgressText(grammarType) {
    const progress = this.data.userProgress[grammarType];
    if (progress) {
      if (progress.errorCount >= 3) {
        return `错误${progress.errorCount}次 - 建议练习`;
      } else if (progress.errorCount > 0) {
        return `错误${progress.errorCount}次`;
      }
    }
    return '暂无记录';
  },

  // 获取进度状态样式
  getProgressStatus(grammarType) {
    const progress = this.data.userProgress[grammarType];
    if (progress && progress.errorCount >= 3) {
      return 'urgent';
    } else if (progress && progress.errorCount > 0) {
      return 'warning';
    }
    return 'normal';
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
}); 