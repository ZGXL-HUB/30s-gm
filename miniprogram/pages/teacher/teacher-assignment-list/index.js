// 教师端主界面
Page({
  data: {
    assignments: [],
    loading: false,
    refreshing: false,
    currentTab: 'active', // active, completed, expired
    showExportModal: false,
    currentAssignment: null,
    exportFormat: 'ppt',
    showAssignmentDetail: false,
    selectedAssignment: null,
    recentActivities: [
      {
        id: 1,
        title: '定语从句专项练习',
        description: '高三(1)班 • 25人参与',
        time: '2小时前',
        status: 'completed',
        statusText: '已完成',
        icon: '📝'
      },
      {
        id: 2,
        title: '时态语态PPT生成',
        description: '课堂讲评材料 • 下载1次',
        time: '4小时前',
        status: 'success',
        statusText: '生成成功',
        icon: '📊'
      },
      {
        id: 3,
        title: '高三(1)班摸底测试',
        description: '综合语法测试 • 正确率82%',
        time: '1天前',
        status: 'completed',
        statusText: '已完成',
        icon: '📋'
      }
    ]
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
      
      // 从本地存储获取作业数据
      const storedAssignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
      
      // 添加一些模拟数据用于演示
      const mockAssignments = [
        {
          _id: 'assignment_1',
          title: '定语从句专项练习',
          description: '练习定语从句的基本用法',
          teacherId: teacherId,
          deadline: '2024-12-31 23:59',
          status: 'active',
          createdAt: '2024-12-20 10:00',
          questionCount: 15,
          studentCount: 25,
          completionRate: 80,
          averageAccuracy: 75
        },
        {
          _id: 'assignment_2',
          title: '时态语态综合练习',
          description: '复习各种时态和语态的用法',
          teacherId: teacherId,
          deadline: '2024-12-25 18:00',
          status: 'active',
          createdAt: '2024-12-18 14:30',
          questionCount: 20,
          studentCount: 25,
          completionRate: 60,
          averageAccuracy: 68
        }
      ];
      
      // 合并存储的作业和模拟数据
      const allAssignments = [...storedAssignments, ...mockAssignments];
      
      const assignments = allAssignments.map(assignment => ({
        ...assignment,
        statusText: this.getStatusText(assignment.status, assignment.deadline),
        studentCount: assignment.studentCount || 0,
        completionRate: assignment.completionRate || 0,
        averageAccuracy: assignment.averageAccuracy || 0
      }));
      
      this.setData({ assignments: assignments });
      console.log('教师端作业列表加载成功:', assignments);
      
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
    // 修复iOS日期格式兼容性问题，将 "yyyy-MM-dd HH:mm" 格式转换为iOS支持的格式
    const deadlineDate = this.parseDate(deadline);
    
    if (status === 'completed') {
      return '已完成';
    } else if (now > deadlineDate) {
      return '已过期';
    } else {
      return '进行中';
    }
  },

  // 解析日期字符串，兼容iOS
  parseDate(dateString) {
    if (!dateString) return new Date();
    
    // 如果已经是ISO格式或标准格式，直接解析
    if (dateString.includes('T') || dateString.includes('Z')) {
      return new Date(dateString);
    }
    
    // 将 "yyyy-MM-dd HH:mm" 格式转换为 "yyyy/MM/dd HH:mm:ss" 格式（iOS兼容）
    const formattedDate = dateString.replace(/-/g, '/');
    const dateWithSeconds = formattedDate.includes(':') && !formattedDate.includes(':', formattedDate.indexOf(':') + 1) 
      ? formattedDate + ':00' 
      : formattedDate;
    
    return new Date(dateWithSeconds);
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
          const deadline = this.parseDate(assignment.deadline);
          return assignment.status === 'active' && now > deadline;
        });
      default:
        return assignments;
    }
  },

  // 查看作业详情
  viewAssignment(e) {
    const assignmentId = e.currentTarget.dataset.id;
    const assignment = this.data.assignments.find(a => a._id === assignmentId);
    
    if (assignment) {
      this.setData({
        showAssignmentDetail: true,
        selectedAssignment: assignment
      });
    }
  },

  // 关闭作业详情弹窗
  closeAssignmentDetail() {
    this.setData({
      showAssignmentDetail: false,
      selectedAssignment: null
    });
  },

  // 查看作业详情（跳转页面方式）
  viewAssignmentDetail(e) {
    const assignmentId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/teacher-assignment-detail/index?id=${assignmentId}`
    });
  },

  // 生成错题分析PPT/Word
  showExportModal(e) {
    const assignmentId = e.currentTarget.dataset.id;
    const format = e.currentTarget.dataset.format;
    const assignment = this.data.assignments.find(a => a._id === assignmentId);
    
    this.setData({
      showExportModal: true,
      currentAssignment: assignment,
      exportFormat: format
    });
  },

  // 生成导出文件
  async generateExport(e) {
    const format = e.currentTarget.dataset.format;
    const assignmentId = e.currentTarget.dataset.id || this.data.currentAssignment._id;
    
    if (!assignmentId) {
      wx.showToast({
        title: '请选择作业',
        icon: 'none'
      });
      return;
    }
    
    try {
      wx.showLoading({ title: '生成中...' });
      
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      // 获取作业数据
      const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
      const assignment = assignments.find(a => a._id === assignmentId);
      
      if (!assignment) {
        wx.hideLoading();
        wx.showToast({
          title: '作业不存在',
          icon: 'none'
        });
        return;
      }
      
      // 模拟生成文件
      const fileName = `${assignment.title}_${format.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.${format === 'ppt' ? 'pptx' : 'docx'}`;
      
      console.log('生成文件数据:', {
        assignmentId: assignmentId,
        assignment: assignment,
        format: format,
        fileName: fileName
      });
      
      // 模拟生成成功
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({
          title: `${format.toUpperCase()}生成成功`,
          icon: 'success'
        });
        
        // 模拟下载文件
        this.simulateDownload(fileName, format);
        
        this.setData({ showExportModal: false });
      }, 2000);
      
    } catch (error) {
      console.error('生成文件失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成失败',
        icon: 'none'
      });
    }
  },

  // 模拟下载文件
  simulateDownload(fileName, format) {
    // 显示文件信息
    wx.showModal({
      title: '文件生成成功',
      content: `文件名：${fileName}\n格式：${format.toUpperCase()}\n\n（这是模拟功能，实际应用中会生成真实文件）`,
      showCancel: false,
      confirmText: '确定',
      success: () => {
        console.log('模拟下载完成:', fileName);
      }
    });
  },

  // 下载文件（保留原方法用于将来真实下载）
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

  // 导航到布置语法作业页面
  goToHomework() {
    wx.navigateTo({
      url: '/pages/teacher-homework/index'
    });
  },

  // 导航到我的PPT/学案页面
  goToMaterials() {
    wx.navigateTo({
      url: '/pages/teacher-materials/index'
    });
  },

  // 导航到班级管理页面
  goToClass() {
    wx.navigateTo({
      url: '/pages/teacher-class/index'
    });
  },

  // 查看所有活动
  viewAllActivities() {
    wx.navigateTo({
      url: '/pages/teacher-activities/index'
    });
  },

  // 查看活动详情
  viewActivity(e) {
    const activityId = e.currentTarget.dataset.id;
    const activity = this.data.recentActivities.find(a => a.id == activityId);
    
    if (activity) {
      wx.showModal({
        title: activity.title,
        content: activity.description,
        showCancel: false,
        confirmText: '确定'
      });
    }
  },

  // 创建新作业（保留兼容性）
  createAssignment() {
    this.goToHomework();
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
    const date = this.parseDate(time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
});
