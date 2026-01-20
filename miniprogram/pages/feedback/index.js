// 意见反馈页面
const { FeedbackService } = require('../../services/index.js');

Page({
  data: {
    existingIssues: '', // 现有功能的不足之处
    unmetNeeds: '', // 未被满足的需求
    canSubmit: false, // 是否可以提交
    submitting: false, // 是否正在提交
    showSuccessModal: false, // 显示成功模态框
    feedbackId: '' // 反馈编号
  },

  onLoad(options) {
    console.log('反馈页面加载，URL参数:', options);
    
    // 延迟检查提交状态
    setTimeout(() => {
      this.checkSubmitStatus();
    }, 100);
    
    // 尝试同步本地反馈到云端
    this.syncLocalFeedbacks();
  },

  // 输入现有功能不足
  onExistingIssuesInput(e) {
    this.setData({
      existingIssues: e.detail.value
    });
    this.checkSubmitStatus();
  },

  // 输入未被满足的需求
  onUnmetNeedsInput(e) {
    this.setData({
      unmetNeeds: e.detail.value
    });
    this.checkSubmitStatus();
  },

  // 检查是否可以提交（至少填写一个文本框）
  checkSubmitStatus() {
    const { existingIssues, unmetNeeds } = this.data;
    const hasExistingIssues = existingIssues && existingIssues.trim().length > 0;
    const hasUnmetNeeds = unmetNeeds && unmetNeeds.trim().length > 0;
    const canSubmit = hasExistingIssues || hasUnmetNeeds;
    
    this.setData({ canSubmit });
  },

  // 提交反馈
  async submitFeedback() {
    if (!this.data.canSubmit || this.data.submitting) {
      return;
    }

    this.setData({ submitting: true });

    try {
      // 提交反馈数据
      await this.submitFeedbackData();
    } catch (error) {
      console.error('提交反馈失败:', error);
      this.setData({ submitting: false });
      wx.showToast({
        title: '提交失败，请重试',
        icon: 'none'
      });
    }
  },

  // 提交反馈数据到云数据库
  async submitFeedbackData() {
    const { existingIssues, unmetNeeds } = this.data;
    
    // 生成反馈编号
    const feedbackId = 'FB' + Date.now().toString().slice(-8);
    
    // 构建反馈内容
    let content = '';
    if (existingIssues && existingIssues.trim()) {
      content += '【现有功能的不足之处】\n' + existingIssues.trim();
    }
    if (unmetNeeds && unmetNeeds.trim()) {
      if (content) content += '\n\n';
      content += '【未被满足的需求】\n' + unmetNeeds.trim();
    }
    
    // 确保内容不为空
    const finalContent = content.trim();
    if (!finalContent || finalContent.length < 5) {
      this.setData({ submitting: false });
      wx.showToast({
        title: '反馈内容至少需要5个字符',
        icon: 'none'
      });
      return;
    }
    
    const feedbackData = {
      feedbackId: feedbackId,
      type: 'general', // 统一类型
      title: '功能反馈',
      content: finalContent,
      existingIssues: existingIssues ? existingIssues.trim() : '',
      unmetNeeds: unmetNeeds ? unmetNeeds.trim() : ''
    };

    // 使用统一API服务提交反馈
    const result = await FeedbackService.submitFeedback(feedbackData, {
      showLoading: true,
      loadingText: '提交中...'
    });
    
    if (result.success && result.data) {
      console.log('反馈提交成功:', result.data);
      const responseData = result.data.data || result.data;
      this.setData({
        submitting: false,
        showSuccessModal: true,
        feedbackId: responseData?.feedbackId || feedbackId
      });
      
      // 提交成功后，也保存到本地存储作为备份（标记为已同步）
      const now = new Date();
      const feedbackRecord = {
        ...feedbackData,
        id: Date.now(),
        status: 'pending',
        createTime: now.toISOString(),
        createTimeTimestamp: now.getTime(),
        source: 'local_storage',
        synced: true, // 标记为已同步
        syncedTime: now.toISOString()
      };
      const existingFeedbacks = wx.getStorageSync('local_feedbacks') || [];
      existingFeedbacks.push(feedbackRecord);
      wx.setStorageSync('local_feedbacks', existingFeedbacks);
      
      // 提交成功后，尝试同步所有本地未同步的反馈
      this.syncLocalFeedbacks();
    } else {
      // 提交失败，尝试本地存储备选方案
      console.error('提交反馈失败:', result.error || result.message);
      console.log('尝试使用本地存储备选方案...');
      this.submitFeedbackToLocalStorage(feedbackData);
    }
  },

  // 本地存储备选方案
  submitFeedbackToLocalStorage(feedbackData) {
    try {
      console.log('使用本地存储保存反馈数据...');
      
      // 获取现有的反馈记录
      const existingFeedbacks = wx.getStorageSync('local_feedbacks') || [];
      
      // 添加新的反馈记录
      const now = new Date();
      const feedbackRecord = {
        ...feedbackData,
        id: Date.now(),
        status: 'pending',
        createTime: now.toISOString(),
        createTimeTimestamp: now.getTime(), // 添加时间戳用于排序
        source: 'local_storage'
      };
      
      existingFeedbacks.push(feedbackRecord);
      
      // 保存到本地存储
      wx.setStorageSync('local_feedbacks', existingFeedbacks);
      
      console.log('反馈已保存到本地存储:', feedbackRecord);
      
      // 显示成功提示
      this.setData({
        submitting: false,
        showSuccessModal: true,
        feedbackId: feedbackData.feedbackId
      });
      
      // 显示特殊提示
      wx.showModal({
        title: '反馈已保存',
        content: '由于网络问题，反馈已保存到本地。我们会在网络恢复后自动提交。',
        showCancel: false,
        confirmText: '知道了'
      });
      
    } catch (error) {
      console.error('本地存储也失败:', error);
      this.setData({ submitting: false });
      wx.showToast({
        title: '保存失败，请稍后重试',
        icon: 'none'
      });
    }
  },

  // 隐藏成功模态框
  hideSuccessModal() {
    this.setData({
      showSuccessModal: false,
      existingIssues: '',
      unmetNeeds: ''
    });
  },

  // 查看历史记录
  viewHistory() {
    wx.navigateTo({
      url: '/pages/feedback/history'
    });
  },

  // 返回首页
  goBack() {
    this.setData({
      showSuccessModal: false
    });
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 同步本地反馈到云端
  async syncLocalFeedbacks() {
    try {
      const result = await FeedbackService.syncLocalFeedbacksToCloud({
        showLoading: false,
        showError: false
      });

      if (result.success && result.syncedCount > 0) {
        console.log(`成功同步 ${result.syncedCount} 条反馈到云端`);
      }
    } catch (error) {
      console.error('同步本地反馈失败:', error);
      // 静默失败，不影响用户体验
    }
  }
});
