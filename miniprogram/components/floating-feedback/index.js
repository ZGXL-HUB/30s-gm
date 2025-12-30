// 浮动反馈按钮组件
Component({
  properties: {
    show: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    // 跳转到反馈页面
    goToFeedback() {
      wx.navigateTo({
        url: '/pages/feedback/index'
      });
    }
  }
});
