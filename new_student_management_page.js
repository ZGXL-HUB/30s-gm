// 全新的学生管理页面 - 简化版本
// 替换 miniprogram/pages/teacher-class/index.js 中的学生管理部分

Page({
  data: {
    // 当前标签页
    currentTab: 'students', // 直接设置为学生管理
    
    // 学生数据
    students: [],
    loading: false,
    
    // 界面状态
    showCreateStudent: false,
    showStudentDetail: false,
    selectedStudent: null,
    
    // 表单数据
    newStudent: {
      name: ''
    }
  },

  // 页面加载
  async onLoad() {
    console.log('🔄 新学生管理页面加载');
    await this.loadStudentData();
  },

  // 页面显示
  async onShow() {
    console.log('🔄 新学生管理页面显示');
    await this.loadStudentData();
  },

  // 直接加载学生数据 - 简化版本
  async loadStudentData() {
    try {
      console.log('📊 开始加载学生数据...');
      this.setData({ loading: true });

      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      console.log(`👤 教师ID: ${teacherId}`);

      if (!wx.cloud) {
        console.warn('云开发环境不可用');
        this.setData({ 
          students: [],
          loading: false 
        });
        return;
      }

      const db = wx.cloud.database();
      
      // 1. 获取班级数据
      console.log('📚 获取班级数据...');
      const classesResult = await db.collection('classes').where({
        teacherId: teacherId
      }).get();
      
      console.log(`找到 ${classesResult.data.length} 个班级`);
      const classMap = {};
      classesResult.data.forEach(cls => {
        classMap[cls._id] = cls.name;
        console.log(`- ${cls.name} (ID: ${cls._id})`);
      });

      // 2. 获取学生数据
      console.log('👥 获取学生数据...');
      const studentsResult = await db.collection('students').where({
        teacherId: teacherId,
        status: 'active'
      }).get();
      
      console.log(`找到 ${studentsResult.data.length} 个学生`);

      // 3. 格式化学生数据
      const formattedStudents = studentsResult.data.map(student => {
        const className = classMap[student.classId] || '未分配班级';
        console.log(`- ${student.name} -> ${className}`);
        
        return {
          id: student._id,
          name: student.name,
          studentId: student.studentId || student._id,
          phone: student.phone || '',
          email: student.email || '',
          class: className,
          classId: student.classId || null,
          status: student.status || 'active',
          completedAssignments: student.completedAssignments || 0,
          totalAssignments: student.totalAssignments || 0,
          averageAccuracy: student.averageAccuracy || 0,
          weakGrammarPoints: student.weakGrammarPoints || [],
          createTime: student.createTime || new Date(),
          updateTime: student.updateTime || new Date()
        };
      });

      // 4. 直接设置页面数据
      console.log(`✅ 设置页面数据: ${formattedStudents.length} 个学生`);
      this.setData({
        students: formattedStudents,
        loading: false
      });

      // 5. 更新本地存储
      wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
      
      console.log('🎉 学生数据加载完成！');
      console.log('学生列表:', formattedStudents.map(s => `${s.name}(${s.class})`));

    } catch (error) {
      console.error('❌ 加载学生数据失败:', error);
      this.setData({
        students: [],
        loading: false
      });
      
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 刷新学生列表
  async refreshStudentList() {
    console.log('🔄 刷新学生列表');
    wx.showLoading({
      title: '刷新中...'
    });
    
    try {
      // 清除本地缓存
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      wx.removeStorageSync(`teacher_students_${teacherId}`);
      
      // 重新加载数据
      await this.loadStudentData();
      
      wx.hideLoading();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('刷新失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '刷新失败',
        icon: 'none'
      });
    }
  },

  // 显示使用说明
  showUsageGuide() {
    wx.showModal({
      title: '学生管理使用说明',
      content: '📊 学生管理功能说明：\n\n✅ 功能：\n• 查看所有学生信息\n• 显示学生作业完成情况\n• 查看学生薄弱语法点\n\n💡 操作：\n• 点击"刷新"按钮更新数据\n• 点击学生卡片查看详细信息\n\n🎯 数据来源：\n• 直接从云端数据库获取\n• 实时同步最新信息',
      confirmText: '我知道了',
      showCancel: false
    });
  },

  // 查看学生详情
  viewStudentDetail(e) {
    const studentId = e.currentTarget.dataset.id;
    const student = this.data.students.find(s => s.id === studentId);
    
    if (student) {
      this.setData({
        selectedStudent: student,
        showStudentDetail: true
      });
    }
  },

  // 关闭学生详情
  closeStudentDetail() {
    this.setData({
      showStudentDetail: false,
      selectedStudent: null
    });
  },

  // 显示创建学生弹窗
  showCreateStudentModal() {
    this.setData({
      showCreateStudent: true,
      newStudent: { name: '' }
    });
  },

  // 关闭创建学生弹窗
  closeCreateStudentModal() {
    this.setData({
      showCreateStudent: false,
      newStudent: { name: '' }
    });
  },

  // 输入学生姓名
  onStudentInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`newStudent.${field}`]: value
    });
  },

  // 创建学生
  async createStudent() {
    const { name } = this.data.newStudent;
    
    if (!name.trim()) {
      wx.showToast({
        title: '请输入学生姓名',
        icon: 'none'
      });
      return;
    }

    try {
      wx.showLoading({
        title: '创建中...'
      });

      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      // 这里可以调用云函数创建学生
      // 暂时先添加到本地列表
      const newStudent = {
        id: `student_${Date.now()}`,
        name: name.trim(),
        studentId: `S${Date.now()}`,
        phone: '',
        email: '',
        class: '未分配班级',
        classId: null,
        status: 'active',
        completedAssignments: 0,
        totalAssignments: 0,
        averageAccuracy: 0,
        weakGrammarPoints: [],
        createTime: new Date(),
        updateTime: new Date()
      };

      const students = [...this.data.students, newStudent];
      this.setData({
        students: students
      });

      // 更新本地存储
      wx.setStorageSync(`teacher_students_${teacherId}`, students);

      wx.hideLoading();
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      });

      this.closeCreateStudentModal();

    } catch (error) {
      console.error('创建学生失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '创建失败',
        icon: 'none'
      });
    }
  }
});

// 导出供其他页面使用
module.exports = {
  loadStudentData: function() {
    return this.loadStudentData();
  },
  refreshStudentList: function() {
    return this.refreshStudentList();
  }
};
