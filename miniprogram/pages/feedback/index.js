// 意见反馈页面
Page({
  data: {
    selectedType: '', // 选中的反馈类型
    feedbackContent: '', // 反馈内容
    contactInfo: '', // 联系方式
    uploadedImages: [], // 上传的图片
    canSubmit: false, // 是否可以提交
    submitting: false, // 是否正在提交
    showSuccessModal: false, // 显示成功模态框
    feedbackId: '' // 反馈编号
  },

  onLoad(options) {
    // 页面加载时的初始化
    this.checkSubmitStatus();
    
    // 处理URL参数
    if (options.type) {
      this.setData({
        selectedType: options.type
      });
    }
    
    // 根据上下文预填充内容
    if (options.context) {
      this.setContextualContent(options.context);
    }
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
    const canSubmit = selectedType && feedbackContent.trim().length > 0;
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
  submitFeedback() {
    if (!this.data.canSubmit || this.data.submitting) {
      return;
    }

    this.setData({ submitting: true });

    // 先上传图片
    this.uploadImages().then((imageUrls) => {
      // 提交反馈数据
      this.submitFeedbackData(imageUrls);
    }).catch((error) => {
      console.error('上传图片失败:', error);
      this.setData({ submitting: false });
      wx.showToast({
        title: '提交失败，请重试',
        icon: 'none'
      });
    });
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
  submitFeedbackData(imageUrls) {
    const { selectedType, feedbackContent, contactInfo } = this.data;
    
    // 生成反馈编号
    const feedbackId = 'FB' + Date.now().toString().slice(-8);
    
    const feedbackData = {
      feedbackId: feedbackId,
      type: selectedType,
      title: this.getFeedbackTitle(selectedType),
      content: feedbackContent.trim(),
      contact: contactInfo.trim(),
      images: imageUrls
    };

    // 调用云函数提交反馈
    wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'submitFeedback',
        data: feedbackData
      }
    }).then((res) => {
      if (res.result.success) {
        console.log('反馈提交成功:', res.result);
        this.setData({
          submitting: false,
          showSuccessModal: true,
          feedbackId: feedbackId
        });
      } else {
        throw new Error(res.result.message);
      }
    }).catch((error) => {
      console.error('提交反馈失败:', error);
      this.setData({ submitting: false });
      wx.showToast({
        title: error.message || '提交失败，请重试',
        icon: 'none'
      });
    });
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
