// 意见反馈页面
const { FeedbackService } = require('../../services/index.js');

Page({
  data: {
    selectedType: '', // 选中的反馈类型
    feedbackTitle: '', // 反馈标题
    feedbackContent: '', // 反馈内容
    contactInfo: '', // 联系方式
    uploadedImages: [], // 上传的图片
    canSubmit: false, // 是否可以提交
    submitting: false, // 是否正在提交
    showSuccessModal: false, // 显示成功模态框
    feedbackId: '' // 反馈编号
  },

  onLoad(options) {
    console.log('反馈页面加载，URL参数:', options);
    
    // 处理URL参数
    if (options.type) {
      this.setData({
        selectedType: options.type
      });
      console.log('设置反馈类型:', options.type);
    }
    
    // 处理URL参数自动填写
    if (options.title) {
      this.setData({
        feedbackTitle: decodeURIComponent(options.title)
      });
      console.log('设置反馈标题:', decodeURIComponent(options.title));
    }
    
    if (options.content) {
      this.setData({
        feedbackContent: decodeURIComponent(options.content)
      });
      console.log('设置反馈内容，长度:', decodeURIComponent(options.content).length);
    }
    
    if (options.contact) {
      this.setData({
        contactInfo: decodeURIComponent(options.contact)
      });
      console.log('设置联系方式:', decodeURIComponent(options.contact));
    }
    
    // 根据上下文预填充内容
    if (options.context) {
      this.setContextualContent(options.context);
    }
    
    // 延迟检查提交状态，确保所有数据都已设置
    setTimeout(() => {
      this.checkSubmitStatus();
    }, 100);
  },

  // 选择反馈类型
  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedType: type
    });
    this.checkSubmitStatus();
  },

  // 输入反馈内容
  onContentInput(e) {
    this.setData({
      feedbackContent: e.detail.value
    });
    this.checkSubmitStatus();
  },

  // 输入联系方式
  onContactInput(e) {
    this.setData({
      contactInfo: e.detail.value
    });
  },

  // 检查是否可以提交
  checkSubmitStatus() {
    const { selectedType, feedbackContent } = this.data;
    const canSubmit = selectedType && feedbackContent && feedbackContent.trim().length > 0;
    
    // 调试信息
    console.log('检查提交状态:', {
      selectedType: selectedType,
      feedbackContent: feedbackContent,
      contentLength: feedbackContent ? feedbackContent.trim().length : 0,
      canSubmit: canSubmit
    });
    
    this.setData({ canSubmit });
  },

  // 选择图片
  chooseImage() {
    const { uploadedImages } = this.data;
    const remainingCount = 3 - uploadedImages.length;
    
    wx.chooseImage({
      count: remainingCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        const newImages = [...uploadedImages, ...tempFilePaths];
        this.setData({
          uploadedImages: newImages
        });
      },
      fail: (error) => {
        console.error('选择图片失败:', error);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const { uploadedImages } = this.data;
    uploadedImages.splice(index, 1);
    this.setData({
      uploadedImages: uploadedImages
    });
  },

  // 提交反馈
  async submitFeedback() {
    if (!this.data.canSubmit || this.data.submitting) {
      return;
    }

    this.setData({ submitting: true });

    try {
      // 先上传图片
      const imageUrls = await this.uploadImages();
      // 提交反馈数据
      await this.submitFeedbackData(imageUrls);
    } catch (error) {
      console.error('提交反馈失败:', error);
      this.setData({ submitting: false });
      wx.showToast({
        title: '提交失败，请重试',
        icon: 'none'
      });
    }
  },

  // 上传图片到云存储
  uploadImages() {
    const { uploadedImages } = this.data;
    
    if (uploadedImages.length === 0) {
      return Promise.resolve([]);
    }

    const uploadPromises = uploadedImages.map((filePath, index) => {
      return new Promise((resolve, reject) => {
        const fileName = `feedback/${Date.now()}_${index}.jpg`;
        wx.cloud.uploadFile({
          cloudPath: fileName,
          filePath: filePath,
          success: (res) => {
            resolve(res.fileID);
          },
          fail: (error) => {
            console.error('上传图片失败:', error);
            reject(error);
          }
        });
      });
    });

    return Promise.all(uploadPromises);
  },

  // 提交反馈数据到云数据库
  async submitFeedbackData(imageUrls) {
    const { selectedType, feedbackTitle, feedbackContent, contactInfo } = this.data;
    
    // 生成反馈编号
    const feedbackId = 'FB' + Date.now().toString().slice(-8);
    
    const feedbackData = {
      feedbackId: feedbackId,
      type: selectedType,
      title: feedbackTitle || this.getFeedbackTitle(selectedType),
      content: feedbackContent.trim(),
      contact: contactInfo.trim(),
      images: imageUrls
    };

    // 使用统一API服务提交反馈
    const result = await FeedbackService.submitFeedback(feedbackData, {
      showLoading: true,
      loadingText: '提交中...'
    });
    
    if (result.success) {
      console.log('反馈提交成功:', result.data);
      this.setData({
        submitting: false,
        showSuccessModal: true,
        feedbackId: result.data?.feedbackId || feedbackId
      });
    } else {
      // 提交失败，尝试本地存储备选方案
      console.error('提交反馈失败:', result.error);
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
      const feedbackRecord = {
        ...feedbackData,
        id: Date.now(),
        status: 'pending',
        createTime: new Date().toISOString(),
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

  // 根据类型生成反馈标题
  getFeedbackTitle(type) {
    const titles = {
      'function': '功能问题反馈',
      'content': '内容质量反馈',
      'experience': '用户体验反馈',
      'technical': '技术问题反馈'
    };
    return titles[type] || '用户反馈';
  },

  // 隐藏成功模态框
  hideSuccessModal() {
    this.setData({
      showSuccessModal: false
    });
  },

  // 根据上下文预填充内容
  setContextualContent(context) {
    const contextualTemplates = {
      'comprehensive_writing_test': '全面版书写能力测试体验反馈',
      'simple_writing_test': '简易版书写能力测试体验反馈',
      'grammar_test': '语法水平测试体验反馈'
    };
    
    const template = contextualTemplates[context] || '';
    if (template) {
      this.setData({
        feedbackContent: `关于${template}：\n\n`
      });
    }
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
  }
});
