// 浮动反馈按钮组件
Component({
  properties: {
    show: {
      type: Boolean,
      value: true
    }
  },

  data: {
    expanded: false
  },

  methods: {
    // 切换反馈选项显示
    toggleFeedback() {
      this.setData({
        expanded: !this.data.expanded
      });
    },

    // 快速反馈
    quickFeedback(e) {
      const type = e.currentTarget.dataset.type;
      
      // 收起选项
      this.setData({
        expanded: false
      });
      
      // 跳转到反馈页面
      wx.navigateTo({
        url: `/pages/feedback/index?type=${type}`
      });
    },

    // 查看全部反馈
    viewAllFeedback() {
      // 收起选项
      this.setData({
        expanded: false
      });
      
      // 跳转到反馈页面
      wx.navigateTo({
        url: '/pages/feedback/index'
      });
    }
  },

  // 点击外部收起选项
  attached() {
    // 监听页面点击事件 - 使用正确的事件监听方式
    this.touchStartHandler = () => {
      if (this.data.expanded) {
        this.setData({
          expanded: false
        });
      }
    };
    
    // 在页面级别监听触摸事件
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      if (currentPage && currentPage.onTouchStart) {
        // 如果页面已有onTouchStart，则保存原有方法
        this.originalTouchStart = currentPage.onTouchStart;
        currentPage.onTouchStart = (e) => {
          this.touchStartHandler();
          if (this.originalTouchStart) {
            this.originalTouchStart.call(currentPage, e);
          }
        };
      }
    }
  },

  detached() {
    // 清理事件监听
    if (this.originalTouchStart) {
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        if (currentPage) {
          currentPage.onTouchStart = this.originalTouchStart;
        }
      }
    }
  }
});
