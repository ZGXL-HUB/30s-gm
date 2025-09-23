// 教师端作业管理页面
Page({
  data: {
    assignments: [],
    loading: false,
    refreshing: false,
    currentTab: 'active', // active, completed, expired
    showExportModal: false,
    currentAssignment: null,
    exportFormat: 'ppt'
  },

  onLoad() {
    this.loadAssignments();
  },

  onShow() {
    this.loadAssignments();
  },

  // 加载作业列表
  async loadAssignments() {
    try {
      this.setData({ loading: true });
      
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      const result = await wx.cloud.callFunction({
        name: 'getAssignments',
        data: { teacherId: teacherId }
      });
      
      if (result.result.success) {
        const assignments = result.result.data.map(assignment => ({
          ...assignment,
          statusText: this.getStatusText(assignment.status, assignment.deadline),
          studentCount: assignment.studentCount || 0,
          completionRate: assignment.completionRate || 0,
          averageAccuracy: assignment.averageAccuracy || 0
        }));
        
        this.setData({ assignments: assignments });
      }
      
      this.setData({ loading: false });
    } catch (error) {
      console.error('加载作业列表失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 获取状态文本
  getStatusText(status, deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    
    if (status === 'completed') {
      return '已完成';
    } else if (now > deadlineDate) {
      return '已过期';
    } else {
      return '进行中';
    }
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  // 获取当前标签页的作业
  getCurrentAssignments() {
    const { assignments, currentTab } = this.data;
    
    switch (currentTab) {
      case 'active':
        return assignments.filter(assignment => assignment.status === 'active');
      case 'completed':
        return assignments.filter(assignment => assignment.status === 'completed');
      case 'expired':
        return assignments.filter(assignment => {
          const now = new Date();
          const deadline = new Date(assignment.deadline);
          return assignment.status === 'active' && now > deadline;
        });
      default:
        return assignments;
    }
  },

  // 查看作业详情
  viewAssignmentDetail(e) {
    const assignmentId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/teacher-assignment-detail/index?id=${assignmentId}`
    });
  },

  // 生成错题分析PPT/Word
  showExportModal(e) {
    const assignmentId = e.currentTarget.dataset.id;
    const assignment = this.data.assignments.find(a => a._id === assignmentId);
    
    this.setData({
      showExportModal: true,
      currentAssignment: assignment
    });
  },

  // 选择导出格式
  selectExportFormat(e) {
    const format = e.currentTarget.dataset.format;
    this.setData({ exportFormat: format });
  },

  // 生成导出文件
  async generateExport() {
    const { currentAssignment, exportFormat } = this.data;
    
    if (!currentAssignment) {
      wx.showToast({
        title: '请选择作业',
        icon: 'none'
      });
      return;
    }
    
    try {
      wx.showLoading({ title: '生成中...' });
      
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      const result = await wx.cloud.callFunction({
        name: 'generateErrorAnalysisPPT',
        data: {
          assignmentId: currentAssignment._id,
          teacherId: teacherId,
          format: exportFormat
        }
      });
      
      if (result.result.success) {
        wx.hideLoading();
        wx.showToast({
          title: '生成成功',
          icon: 'success'
        });
        
        // 下载文件
        this.downloadFile(result.result.data.downloadUrl, result.result.data.fileName);
        
        this.setData({ showExportModal: false });
      } else {
        wx.hideLoading();
        wx.showToast({
          title: result.result.error || '生成失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('生成文件失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成失败',
        icon: 'none'
      });
    }
  },

  // 下载文件
  downloadFile(fileUrl, fileName) {
    wx.downloadFile({
      url: fileUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.openDocument({
            filePath: res.tempFilePath,
            success: () => {
              console.log('文件打开成功');
            },
            fail: (error) => {
              console.error('文件打开失败:', error);
              wx.showToast({
                title: '文件打开失败',
                icon: 'none'
              });
            }
          });
        }
      },
      fail: (error) => {
        console.error('文件下载失败:', error);
        wx.showToast({
          title: '文件下载失败',
          icon: 'none'
        });
      }
    });
  },

  // 关闭导出弹窗
  closeExportModal() {
    this.setData({ showExportModal: false });
  },

  // 创建新作业
  createAssignment() {
    wx.navigateTo({
      url: '/pages/teacher-create-assignment/index'
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ refreshing: true });
    this.loadAssignments().then(() => {
      this.setData({ refreshing: false });
      wx.stopPullDownRefresh();
    });
  },

  // 格式化时间
  formatTime(time) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
});
