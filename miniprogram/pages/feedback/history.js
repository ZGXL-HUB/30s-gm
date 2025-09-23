// 反馈历史页面
Page({
  data: {
    feedbackList: [],
    loading: true,
    showDetailModal: false,
    selectedFeedback: {}
  },

  onLoad() {
    this.loadFeedbackList();
  },

  onShow() {
    // 页面显示时刷新列表
    this.loadFeedbackList();
  },

  // 加载反馈列表
  loadFeedbackList() {
    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'getFeedbackList',
        data: {
          page: 1,
          limit: 50
        }
      }
    }).then((res) => {
      if (res.result.success) {
        const feedbackList = res.result.data.map(item => {
          return {
            ...item,
            statusText: this.getStatusText(item.status),
            typeText: this.getTypeText(item.type),
            createTimeText: this.formatTime(item.createTime),
            replyTimeText: item.replyTime ? this.formatTime(item.replyTime) : ''
          };
        });
        
        this.setData({
          feedbackList: feedbackList,
          loading: false
        });
      } else {
        throw new Error(res.result.message);
      }
    }).catch((error) => {
      console.error('加载反馈列表失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    });
  },

  // 获取状态文本
  getStatusText(status) {
    const statusMap = {
      'pending': '待处理',
      'processing': '处理中',
      'resolved': '已解决'
    };
    return statusMap[status] || '未知';
  },

  // 获取类型文本
  getTypeText(type) {
    const typeMap = {
      'function': '功能问题',
      'content': '内容质量',
      'experience': '用户体验',
      'technical': '技术问题'
    };
    return typeMap[type] || '其他';
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // 小于1分钟
    if (diff < 60000) {
      return '刚刚';
    }
    
    // 小于1小时
    if (diff < 3600000) {
      return Math.floor(diff / 60000) + '分钟前';
    }
    
    // 小于1天
    if (diff < 86400000) {
      return Math.floor(diff / 3600000) + '小时前';
    }
    
    // 小于7天
    if (diff < 604800000) {
      return Math.floor(diff / 86400000) + '天前';
    }
    
    // 超过7天显示具体日期
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  // 查看反馈详情
  viewFeedbackDetail(e) {
    const feedback = e.currentTarget.dataset.feedback;
    this.setData({
      selectedFeedback: feedback,
      showDetailModal: true
    });
  },

  // 隐藏详情模态框
  hideDetailModal() {
    this.setData({
      showDetailModal: false,
      selectedFeedback: {}
    });
  },

  // 跳转到反馈页面
  goToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/index'
    });
  }
});
