Page({
  onLoad: function() {
    // 直接跳转到语法点选择页面，默认中级
    wx.redirectTo({
      url: '/pages/grammar-select/index?level=中级'
    });
  }
}); 