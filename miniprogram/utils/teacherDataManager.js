// 教师端数据管理工具类
class TeacherDataManager {
  constructor() {
    this.teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
  }

  // 获取教师ID
  getTeacherId() {
    return this.teacherId;
  }

  // 设置教师ID
  setTeacherId(teacherId) {
    this.teacherId = teacherId;
    wx.setStorageSync('teacherId', teacherId);
  }

  // 班级数据管理
  classManager = {
    // 获取所有班级
    getAllClasses() {
      return wx.getStorageSync(`teacher_classes_${this.teacherId}`) || [];
    },

    // 根据ID获取班级
    getClassById(classId) {
      const classes = this.getAllClasses();
      return classes.find(c => c.id === classId);
    },

    // 创建班级
    async createClass(classData) {
      const classes = this.getAllClasses();
      const newClass = {
        id: `class_${Date.now()}`,
        ...classData,
        createdAt: new Date().toISOString().slice(0, 10),
        lastActivity: new Date().toISOString(),
        status: 'active',
        averageAccuracy: 0,
        completedAssignments: 0,
        totalAssignments: 0,
        teacherId: this.teacherId
      };
      classes.unshift(newClass);
      wx.setStorageSync(`teacher_classes_${this.teacherId}`, classes);
      
      // 同步到云端
      if (wx.cloud) {
        try {
          const db = wx.cloud.database();
          await db.collection('classes').add({
            data: newClass
          });
          console.log('班级数据已同步到云端:', newClass.name);
        } catch (cloudError) {
          console.warn('同步班级数据到云端失败:', cloudError);
        }
      }
      
      return newClass;
    },

    // 更新班级
    updateClass(classId, updateData) {
      const classes = this.getAllClasses();
      const index = classes.findIndex(c => c.id === classId);
      if (index !== -1) {
        classes[index] = { ...classes[index], ...updateData };
        wx.setStorageSync(`teacher_classes_${this.teacherId}`, classes);
        return classes[index];
      }
      return null;
    },

    // 删除班级
    deleteClass(classId) {
      const classes = this.getAllClasses();
      const filteredClasses = classes.filter(c => c.id !== classId);
      wx.setStorageSync(`teacher_classes_${this.teacherId}`, filteredClasses);
      return true;
    }
  };

  // 学生数据管理
  studentManager = {
    // 获取所有学生
    getAllStudents() {
      return wx.getStorageSync(`teacher_students_${this.teacherId}`) || [];
    },

    // 根据ID获取学生
    getStudentById(studentId) {
      const students = this.getAllStudents();
      return students.find(s => s.id === studentId);
    },

    // 根据班级获取学生
    getStudentsByClass(className) {
      const students = this.getAllStudents();
      return students.filter(s => s.class === className);
    },

    // 创建学生
    createStudent(studentData) {
      const students = this.getAllStudents();
      const newStudent = {
        id: `student_${Date.now()}`,
        ...studentData,
        joinDate: new Date().toISOString().slice(0, 10),
        lastLogin: new Date().toISOString(),
        status: 'active',
        totalAssignments: 0,
        completedAssignments: 0,
        averageAccuracy: 0,
        weakGrammarPoints: []
      };
      students.unshift(newStudent);
      wx.setStorageSync(`teacher_students_${this.teacherId}`, students);
      return newStudent;
    },

    // 更新学生
    updateStudent(studentId, updateData) {
      const students = this.getAllStudents();
      const index = students.findIndex(s => s.id === studentId);
      if (index !== -1) {
        students[index] = { ...students[index], ...updateData };
        wx.setStorageSync(`teacher_students_${this.teacherId}`, students);
        return students[index];
      }
      return null;
    },

    // 删除学生
    deleteStudent(studentId) {
      const students = this.getAllStudents();
      const filteredStudents = students.filter(s => s.id !== studentId);
      wx.setStorageSync(`teacher_students_${this.teacherId}`, filteredStudents);
      return true;
    }
  };

  // 作业数据管理
  assignmentManager = {
    // 获取所有作业
    getAllAssignments() {
      return wx.getStorageSync(`assignments_${this.teacherId}`) || [];
    },

    // 根据ID获取作业
    getAssignmentById(assignmentId) {
      const assignments = this.getAllAssignments();
      return assignments.find(a => a._id === assignmentId);
    },

    // 创建作业
    createAssignment(assignmentData) {
      const assignments = this.getAllAssignments();
      const newAssignment = {
        _id: `assignment_${Date.now()}`,
        ...assignmentData,
        teacherId: this.teacherId,
        status: 'active',
        createdAt: new Date().toISOString(),
        studentCount: 0,
        completionRate: 0,
        averageAccuracy: 0
      };
      assignments.unshift(newAssignment);
      wx.setStorageSync(`assignments_${this.teacherId}`, assignments);
      return newAssignment;
    },

    // 更新作业
    updateAssignment(assignmentId, updateData) {
      const assignments = this.getAllAssignments();
      const index = assignments.findIndex(a => a._id === assignmentId);
      if (index !== -1) {
        assignments[index] = { ...assignments[index], ...updateData };
        wx.setStorageSync(`assignments_${this.teacherId}`, assignments);
        return assignments[index];
      }
      return null;
    },

    // 删除作业
    deleteAssignment(assignmentId) {
      const assignments = this.getAllAssignments();
      const filteredAssignments = assignments.filter(a => a._id !== assignmentId);
      wx.setStorageSync(`assignments_${this.teacherId}`, filteredAssignments);
      return true;
    }
  };

  // 材料数据管理
  materialManager = {
    // 获取所有材料
    getAllMaterials() {
      return wx.getStorageSync(`teacher_materials_${this.teacherId}`) || [];
    },

    // 创建材料
    createMaterial(materialData) {
      const materials = this.getAllMaterials();
      const newMaterial = {
        id: `mat_${Date.now()}`,
        ...materialData,
        createdAt: new Date().toISOString(),
        downloadCount: 0,
        classAccuracy: 0,
        status: 'completed'
      };
      materials.unshift(newMaterial);
      wx.setStorageSync(`teacher_materials_${this.teacherId}`, materials);
      return newMaterial;
    },

    // 更新材料下载次数
    updateMaterialDownloadCount(materialId) {
      const materials = this.getAllMaterials();
      const index = materials.findIndex(m => m.id === materialId);
      if (index !== -1) {
        materials[index].downloadCount += 1;
        wx.setStorageSync(`teacher_materials_${this.teacherId}`, materials);
        return materials[index];
      }
      return null;
    }
  };

  // 模板数据管理
  templateManager = {
    // 获取所有模板
    getAllTemplates() {
      return wx.getStorageSync(`class_templates_${this.teacherId}`) || [];
    },

    // 创建模板
    createTemplate(templateData) {
      const templates = this.getAllTemplates();
      const newTemplate = {
        id: `template_${Date.now()}`,
        ...templateData,
        usageCount: 0,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      templates.unshift(newTemplate);
      wx.setStorageSync(`class_templates_${this.teacherId}`, templates);
      return newTemplate;
    },

    // 更新模板使用次数
    updateTemplateUsage(templateId) {
      const templates = this.getAllTemplates();
      const index = templates.findIndex(t => t.id === templateId);
      if (index !== -1) {
        templates[index].usageCount += 1;
        templates[index].lastUsed = new Date().toISOString().slice(0, 10);
        wx.setStorageSync(`class_templates_${this.teacherId}`, templates);
        return templates[index];
      }
      return null;
    }
  };

  // 活动数据管理
  activityManager = {
    // 获取所有活动
    getAllActivities() {
      return wx.getStorageSync(`teacher_activities_${this.teacherId}`) || [];
    },

    // 添加活动
    addActivity(activityData) {
      const activities = this.getAllActivities();
      const newActivity = {
        id: `activity_${Date.now()}`,
        ...activityData,
        time: new Date().toISOString()
      };
      activities.unshift(newActivity);
      // 只保留最近50条活动
      const limitedActivities = activities.slice(0, 50);
      wx.setStorageSync(`teacher_activities_${this.teacherId}`, limitedActivities);
      return newActivity;
    }
  };

  // 统计数据管理
  statisticsManager = {
    // 获取班级统计
    getClassStatistics(classId) {
      const students = this.studentManager.getStudentsByClass(classId);
      const assignments = this.assignmentManager.getAllAssignments();
      
      return {
        totalStudents: students.length,
        activeStudents: students.filter(s => s.status === 'active').length,
        averageAccuracy: students.length > 0 ? 
          Math.round(students.reduce((sum, s) => sum + s.averageAccuracy, 0) / students.length) : 0,
        totalAssignments: assignments.length,
        completedAssignments: assignments.filter(a => a.status === 'completed').length
      };
    },

    // 获取学生统计
    getStudentStatistics(studentId) {
      const student = this.studentManager.getStudentById(studentId);
      if (!student) return null;

      return {
        totalAssignments: student.totalAssignments,
        completedAssignments: student.completedAssignments,
        averageAccuracy: student.averageAccuracy,
        weakGrammarPoints: student.weakGrammarPoints,
        completionRate: student.totalAssignments > 0 ? 
          Math.round((student.completedAssignments / student.totalAssignments) * 100) : 0
      };
    }
  };

  // 数据导出
  exportData = {
    // 导出班级数据
    exportClassData(classId) {
      const classData = this.classManager.getClassById(classId);
      const students = this.studentManager.getStudentsByClass(classData.name);
      const statistics = this.statisticsManager.getClassStatistics(classId);
      
      return {
        class: classData,
        students: students,
        statistics: statistics,
        exportTime: new Date().toISOString()
      };
    },

    // 导出学生数据
    exportStudentData(studentId) {
      const student = this.studentManager.getStudentById(studentId);
      const statistics = this.statisticsManager.getStudentStatistics(studentId);
      
      return {
        student: student,
        statistics: statistics,
        exportTime: new Date().toISOString()
      };
    }
  };

  // 数据清理
  cleanup = {
    // 清理过期数据
    cleanupExpiredData() {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      // 清理过期活动
      const activities = this.activityManager.getAllActivities();
      const validActivities = activities.filter(activity => {
        const activityTime = new Date(activity.time);
        return activityTime > thirtyDaysAgo;
      });
      wx.setStorageSync(`teacher_activities_${this.teacherId}`, validActivities);
      
      return {
        cleanedActivities: activities.length - validActivities.length
      };
    },

    // 重置所有数据
    resetAllData() {
      const keys = [
        `teacher_classes_${this.teacherId}`,
        `teacher_students_${this.teacherId}`,
        `assignments_${this.teacherId}`,
        `teacher_materials_${this.teacherId}`,
        `class_templates_${this.teacherId}`,
        `teacher_activities_${this.teacherId}`
      ];
      
      keys.forEach(key => {
        wx.removeStorageSync(key);
      });
      
      return true;
    }
  };
}

// 创建单例实例
const teacherDataManager = new TeacherDataManager();

module.exports = teacherDataManager;
