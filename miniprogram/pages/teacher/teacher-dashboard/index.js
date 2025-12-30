// 教师端主界面
Page({
  data: {
    teacherInfo: {
      name: '张老师',
      school: 'XX中学',
      avatar: '/images/icons/avatar.webp'
    },
    quickStats: {
      totalStudents: 125,
      activeAssignments: 3,
      completedToday: 45,
      averageAccuracy: 78
    },
    recentActivities: [
      {
        id: 1,
        type: 'assignment',
        title: '定语从句专项练习',
        time: '2小时前',
        status: 'completed',
        studentCount: 25
      },
      {
        id: 2,
        type: 'material',
        title: '时态语态学案生成',
        time: '4小时前',
        status: 'success',
        downloadCount: 1
      }
    ],
    menuItems: [
      {
        id: 'homework',
        title: '布置语法作业',
        subtitle: '智能推荐、高考配比、专题练习',
        icon: '📝',
        color: '#667eea',
        path: '/pages/teacher/teacher-homework/index'
      },
      {
        id: 'materials',
        title: '我的学案',
        subtitle: '配套材料管理',
        icon: '📊',
        color: '#f093fb',
        path: '/pages/teacher/teacher-materials/index'
      }
    ]
  },

  onLoad() {
    console.log('教师端主界面加载');
    this.loadTeacherData();
  },

  onShow() {
    this.loadTeacherData();
  },

  // 加载教师数据
  async loadTeacherData() {
    try {
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      // 模拟加载教师信息
      const teacherInfo = {
        name: '张老师',
        school: 'XX中学',
        avatar: '/images/icons/avatar.webp'
      };
      
      // 模拟加载统计数据
      const quickStats = {
        totalStudents: 125,
        activeAssignments: 3,
        completedToday: 45,
        averageAccuracy: 78
      };
      
      this.setData({ teacherInfo, quickStats });
      
      // 加载最近活动
      this.loadRecentActivities();
      
    } catch (error) {
      console.error('加载教师数据失败:', error);
    }
  },

  // 加载最近活动
  async loadRecentActivities() {
    try {
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      // 从本地存储获取活动数据
      const activities = wx.getStorageSync(`teacher_activities_${teacherId}`) || [];
      
      // 添加一些模拟数据
      const mockActivities = [
        {
          id: 1,
          type: 'assignment',
          title: '定语从句专项练习',
          time: '2小时前',
          status: 'completed',
          studentCount: 25
        },
        {
          id: 2,
          type: 'material',
          title: '时态语态PPT生成',
          time: '4小时前',
          status: 'success',
          downloadCount: 1
        },
        {
          id: 3,
          type: 'class',
          title: '高三(1)班摸底测试',
          time: '1天前',
          status: 'completed',
          accuracy: 82
        }
      ];
      
      const allActivities = [...activities, ...mockActivities].slice(0, 5);
      this.setData({ recentActivities: allActivities });
      
    } catch (error) {
      console.error('加载最近活动失败:', error);
    }
  },

  // 导航到功能页面
  navigateToFeature(e) {
    const path = e.currentTarget.dataset.path;
    console.log('导航到功能页面:', path);
    
    if (path) {
      wx.navigateTo({
        url: path,
        success: () => {
          console.log('导航成功:', path);
        },
        fail: (error) => {
          console.error('导航失败:', error);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    } else {
      console.error('路径为空');
      wx.showToast({
        title: '路径配置错误',
        icon: 'none'
      });
    }
  },

  // 查看活动详情
  viewActivityDetail(e) {
    const activityId = e.currentTarget.dataset.id;
    const activity = this.data.recentActivities.find(a => a.id === activityId);
    
    if (activity) {
      wx.showModal({
        title: '活动详情',
        content: `标题：${activity.title}\n时间：${activity.time}\n状态：${activity.status}`,
        showCancel: false
      });
    }
  },

  // 刷新数据
  onPullDownRefresh() {
    this.loadTeacherData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 格式化时间
  formatTime(timeString) {
    const now = new Date();
    const time = new Date(timeString);
    const diff = now - time;
    
    if (diff < 60000) {
      return '刚刚';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`;
    } else {
      return `${Math.floor(diff / 86400000)}天前`;
    }
  }
});
