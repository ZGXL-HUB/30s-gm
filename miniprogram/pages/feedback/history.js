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
    // 尝试同步本地反馈到云端
    this.syncLocalFeedbacks();
  },

  onShow() {
    // 页面显示时刷新列表
    this.loadFeedbackList();
    // 尝试同步本地反馈到云端
    this.syncLocalFeedbacks();
  },

  // 加载反馈列表
  async loadFeedbackList() {
    this.setData({ loading: true });

    try {
      // 同时加载云数据库和本地存储的数据
      const cloudFeedbacks = await this.loadFeedbackListFromCloud();
      const localFeedbacks = this.loadFeedbackListFromLocalStorage();
      
      // 合并两个数据源
      const mergedFeedbacks = this.mergeFeedbackLists(cloudFeedbacks, localFeedbacks);
      
      // 格式化并排序
      const feedbackList = mergedFeedbacks.map(item => {
        return {
          ...item,
          statusText: this.getStatusText(item.status),
          typeText: this.getTypeText(item.type),
          createTimeText: this.formatTime(item.createTime),
          replyTimeText: item.replyTime ? this.formatTime(item.replyTime) : '',
          // 保存原始时间用于排序
          _sortTime: this.getTimestamp(item)
        };
      }).sort((a, b) => {
        // 按时间倒序排列（最新的在前）
        return (b._sortTime || 0) - (a._sortTime || 0);
      }).map(item => {
        // 移除临时排序字段
        const { _sortTime, ...rest } = item;
        return rest;
      });
      
      this.setData({
        feedbackList: feedbackList,
        loading: false
      });
    } catch (error) {
      console.error('加载反馈列表失败:', error);
      // 如果出错，至少尝试从本地存储加载
      this.loadFeedbackListFromLocal();
    }
  },

  // 从云数据库加载反馈列表
  async loadFeedbackListFromCloud() {
    try {
      const { FeedbackService } = require('../../services/index.js');
      const result = await FeedbackService.getFeedbackList({
        page: 1,
        limit: 50
      }, {
        showLoading: false,
        showError: false
      });

      if (result.success && result.data) {
        const feedbackData = result.data.data || result.data || [];
        return feedbackData.map(item => ({
          ...item,
          source: 'cloud'
        }));
      }
      return [];
    } catch (error) {
      console.error('从云数据库加载失败:', error);
      return [];
    }
  },

  // 从本地存储加载反馈列表（返回原始数据）
  loadFeedbackListFromLocalStorage() {
    try {
      const localFeedbacks = wx.getStorageSync('local_feedbacks') || [];
      return localFeedbacks.map(item => ({
        ...item,
        source: 'local_storage'
      }));
    } catch (error) {
      console.error('从本地存储加载失败:', error);
      return [];
    }
  },

  // 合并反馈列表（去重）
  mergeFeedbackLists(cloudFeedbacks, localFeedbacks) {
    const feedbackMap = new Map();
    
    // 先添加云数据库的反馈（优先级高）
    cloudFeedbacks.forEach(item => {
      const key = item.feedbackId || item._id || item.id;
      if (key) {
        feedbackMap.set(key, item);
      }
    });
    
    // 再添加本地存储的反馈（如果不存在且未同步）
    localFeedbacks.forEach(item => {
      const key = item.feedbackId || item._id || item.id;
      // 只添加未同步的本地反馈，已同步的应该已经在云数据库中
      if (key && !feedbackMap.has(key) && !item.synced) {
        feedbackMap.set(key, item);
      }
    });
    
    return Array.from(feedbackMap.values());
  },

  // 获取时间戳（用于排序）
  getTimestamp(item) {
    if (!item) return 0;
    
    // 优先使用时间戳字段
    if (item.createTimeTimestamp) {
      return item.createTimeTimestamp;
    }
    
    // 处理时间字段
    const timeValue = item.createTime;
    if (!timeValue) return 0;
    
    if (timeValue instanceof Date) {
      return timeValue.getTime();
    }
    if (typeof timeValue === 'string') {
      const timestamp = new Date(timeValue).getTime();
      return isNaN(timestamp) ? 0 : timestamp;
    }
    if (typeof timeValue === 'number') {
      return timeValue;
    }
    return 0;
  },

  // 从本地存储加载反馈列表
  loadFeedbackListFromLocal() {
    try {
      const localFeedbacks = wx.getStorageSync('local_feedbacks') || [];
      const feedbackList = localFeedbacks.map(item => {
        return {
          ...item,
          statusText: this.getStatusText(item.status),
          typeText: this.getTypeText(item.type || 'general'),
          createTimeText: this.formatTime(item.createTime),
          replyTimeText: item.replyTime ? this.formatTime(item.replyTime) : ''
        };
      });
      
      this.setData({
        feedbackList: feedbackList,
        loading: false
      });
    } catch (error) {
      console.error('从本地存储加载失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    }
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
      'technical': '技术问题',
      'general': '功能反馈',
      'other': '其他'
    };
    return typeMap[type] || '其他';
  },

  // 格式化时间
  formatTime(timestamp) {
    if (!timestamp) return '未知时间';
    
    // 处理各种时间格式
    let date;
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      // 如果是 ISO 字符串格式
      date = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
      // 如果是时间戳
      date = new Date(timestamp);
    } else {
      return '未知时间';
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '未知时间';
    }
    
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
  },

  // 同步本地反馈到云端
  async syncLocalFeedbacks() {
    try {
      const { FeedbackService } = require('../../services/index.js');
      const result = await FeedbackService.syncLocalFeedbacksToCloud({
        showLoading: false,
        showError: false
      });

      if (result.success && result.syncedCount > 0) {
        console.log(`成功同步 ${result.syncedCount} 条反馈到云端`);
        // 同步成功后刷新列表
        this.loadFeedbackList();
      }
    } catch (error) {
      console.error('同步本地反馈失败:', error);
      // 静默失败，不影响用户体验
    }
  }
});
