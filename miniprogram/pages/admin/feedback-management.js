// 管理员反馈管理页面
Page({
  data: {
    feedbackList: [],
    stats: {
      total: 0,
      pending: 0,
      processing: 0,
      resolved: 0
    },
    loading: true,
    showDetailModal: false,
    showReplyModal: false,
    selectedFeedback: {},
    replyContent: '',
    currentFeedbackId: '',
    
    // 筛选器
    statusIndex: 0,
    statusOptions: ['全部', '待处理', '处理中', '已解决'],
    priorityIndex: 0,
    priorityOptions: ['全部', '高优先级', '中优先级', '低优先级']
  },

  onLoad() {
    this.loadStats();
    this.loadFeedbackList();
  },

  // 加载统计信息
  loadStats() {
    wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'getFeedbackStats'
      }
    }).then((res) => {
      if (res.result.success) {
        this.setData({
          stats: res.result.data
        });
      }
    }).catch((error) => {
      console.error('加载统计信息失败:', error);
    });
  },

  // 加载反馈列表
  loadFeedbackList() {
    this.setData({ loading: true });

    const options = {
      page: 1,
      limit: 50
    };

    // 添加状态筛选
    if (this.data.statusIndex > 0) {
      const statusMap = ['', 'pending', 'processing', 'resolved'];
      options.status = statusMap[this.data.statusIndex];
    }

    // 添加优先级筛选
    if (this.data.priorityIndex > 0) {
      const priorityMap = ['', 1, 2, 3];
      options.priority = priorityMap[this.data.priorityIndex];
    }

    wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'getFeedbackByPriority',
        data: options
      }
    }).then((res) => {
      if (res.result.success) {
        const feedbackList = res.result.data.map(item => {
          return {
            ...item,
            statusText: this.getStatusText(item.status),
            typeText: this.getTypeText(item.type),
            createTimeText: this.formatTime(item.createTime),
            urgencyText: this.getUrgencyText(item.urgency)
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

  // 状态筛选变化
  onStatusChange(e) {
    this.setData({
      statusIndex: e.detail.value
    });
    this.loadFeedbackList();
  },

  // 优先级筛选变化
  onPriorityChange(e) {
    this.setData({
      priorityIndex: e.detail.value
    });
    this.loadFeedbackList();
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

  // 获取紧急程度文本
  getUrgencyText(urgency) {
    const urgencyMap = {
      'high': '高',
      'medium': '中',
      'normal': '低'
    };
    return urgencyMap[urgency] || '低';
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp);
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

  // 更新反馈状态
  updateStatus(e) {
    const feedbackId = e.currentTarget.dataset.feedbackId;
    const action = e.currentTarget.dataset.action;
    
    const statusMap = {
      'processing': 'processing',
      'resolved': 'resolved'
    };
    
    const status = statusMap[action];
    
    wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'updateFeedbackStatus',
        data: {
          feedbackId: feedbackId,
          status: status
        }
      }
    }).then((res) => {
      if (res.result.success) {
        wx.showToast({
          title: '状态更新成功',
          icon: 'success'
        });
        this.loadStats();
        this.loadFeedbackList();
      } else {
        throw new Error(res.result.message);
      }
    }).catch((error) => {
      console.error('更新状态失败:', error);
      wx.showToast({
        title: '更新失败，请重试',
        icon: 'none'
      });
    });
  },

  // 回复反馈
  replyFeedback(e) {
    const feedbackId = e.currentTarget.dataset.feedbackId;
    this.setData({
      currentFeedbackId: feedbackId,
      showReplyModal: true,
      replyContent: ''
    });
  },

  // 隐藏回复模态框
  hideReplyModal() {
    this.setData({
      showReplyModal: false,
      currentFeedbackId: '',
      replyContent: ''
    });
  },

  // 输入回复内容
  onReplyInput(e) {
    this.setData({
      replyContent: e.detail.value
    });
  },

  // 提交回复
  submitReply() {
    if (!this.data.replyContent.trim()) {
      wx.showToast({
        title: '请输入回复内容',
        icon: 'none'
      });
      return;
    }

    wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'updateFeedbackStatus',
        data: {
          feedbackId: this.data.currentFeedbackId,
          status: 'resolved',
          reply: this.data.replyContent.trim()
        }
      }
    }).then((res) => {
      if (res.result.success) {
        wx.showToast({
          title: '回复发送成功',
          icon: 'success'
        });
        this.hideReplyModal();
        this.loadStats();
        this.loadFeedbackList();
      } else {
        throw new Error(res.result.message);
      }
    }).catch((error) => {
      console.error('发送回复失败:', error);
      wx.showToast({
        title: '发送失败，请重试',
        icon: 'none'
      });
    });
  }
});
