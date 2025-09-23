// 学生端作业列表页面
Page({
  data: {
    assignments: [],
    loading: false,
    refreshing: false,
    currentTab: 'pending', // pending, completed
    studentId: ''
  },

  onLoad() {
    this.getStudentId();
    this.loadAssignments();
  },

  onShow() {
    this.loadAssignments();
  },

  // 获取学生ID
  getStudentId() {
    const studentId = wx.getStorageSync('studentId') || 'student_123';
    this.setData({ studentId: studentId });
  },

  // 加载作业列表
  async loadAssignments() {
    try {
      this.setData({ loading: true });
      
      const { studentId } = this.data;
      
      const result = await wx.cloud.callFunction({
        name: 'getStudentAssignments',
        data: { studentId: studentId }
      });
      
      if (result.result.success) {
        const assignments = result.result.data.map(assignment => ({
          ...assignment,
          statusText: this.getStatusText(assignment.status, assignment.deadline),
          isExpired: this.isExpired(assignment.deadline),
          canSubmit: this.canSubmit(assignment.status, assignment.deadline)
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
      return '待完成';
    }
  },

  // 是否过期
  isExpired(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return now > deadlineDate;
  },

  // 是否可以提交
  canSubmit(status, deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return status !== 'completed' && now <= deadlineDate;
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
      case 'pending':
        return assignments.filter(assignment => 
          assignment.status !== 'completed' && !this.isExpired(assignment.deadline)
        );
      case 'completed':
        return assignments.filter(assignment => assignment.status === 'completed');
      default:
        return assignments;
    }
  },

  // 开始作业
  startAssignment(e) {
    const assignmentId = e.currentTarget.dataset.id;
    const assignment = this.data.assignments.find(a => a._id === assignmentId);
    
    if (!assignment) {
      wx.showToast({
        title: '作业不存在',
        icon: 'none'
      });
      return;
    }
    
    if (!this.canSubmit(assignment.status, assignment.deadline)) {
      wx.showToast({
        title: '作业已过期或已完成',
        icon: 'none'
      });
      return;
    }
    
    // 跳转到作业练习页面
    wx.navigateTo({
      url: `/pages/student-assignment-practice/index?assignmentId=${assignmentId}&title=${encodeURIComponent(assignment.title)}`
    });
  },

  // 查看作业结果
  viewAssignmentResult(e) {
    const assignmentId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/student-assignment-result/index?assignmentId=${assignmentId}`
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
  },

  // 格式化剩余时间
  formatRemainingTime(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    
    if (diff <= 0) {
      return '已过期';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `剩余${days}天${hours}小时`;
    } else if (hours > 0) {
      return `剩余${hours}小时${minutes}分钟`;
    } else {
      return `剩余${minutes}分钟`;
    }
  }
});
