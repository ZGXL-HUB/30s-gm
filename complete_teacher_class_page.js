// 完整的教师端班级管理页面 - 合并版本
// 包含班级管理功能 + 新的学生管理界面
const ShareImageGenerator = require('../../utils/shareImageGenerator.js');

Page({
  data: {
    // 当前标签页
    currentTab: 'classes', // classes, students, templates
    
    // 分享图片相关
    showShareImageModal: false,
    shareImageUrl: '',
    shareImageGenerator: null,
    
    // 班级列表数据
    classes: [],

    // 学生管理数据
    classOptions: [],
    statusOptions: ['活跃', '离线'],
    students: [],

    // 班级模板数据
    classTemplates: [],

    // 界面状态
    showCreateClass: false,
    showCreateStudent: false,
    showCreateTemplate: false,
    showClassDetail: false,
    showStudentDetail: false,
    showClassSelection: false,
    showDuplicateConfirm: false,
    showImportedList: false,
    selectedClass: null,
    selectedStudent: null,
    selectedClassId: null,
    selectedClassName: '',
    duplicateStudent: null,
    
    // 班级学生数据
    classStudents: [],
    importedStudents: [],
    parsedStudents: [],
    loading: false,

    // 表单数据
    newClass: {
      name: '',
      classType: '',
      subjectType: '',
      grade: '高三',
      semester: ''
    },
    newStudent: {
      name: ''
    },
    newTemplate: {
      name: '',
      description: '',
      grade: '高三',
      studentCount: 30,
      subjects: [],
      settings: {
        assignmentFrequency: 'daily',
        difficultyLevel: 'medium',
        autoGrading: true,
        progressTracking: true
      }
    }
  },

  // 页面加载
  async onLoad() {
    console.log('教师端班级管理页面加载');
    
    try {
      // 强制清除可能过时的本地存储数据，确保从云端重新加载
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      wx.removeStorageSync(`teacher_students_${teacherId}`);
      wx.removeStorageSync(`teacher_classes_${teacherId}`);
      
      console.log('🔄 页面加载时清除本地存储，强制从云端重新加载数据');
      
      // 先同步班级学生人数统计
      await this.syncClassStudentCount();
      
      // 然后加载数据
      await this.loadClassData();
    } catch (error) {
      console.error('页面初始化数据加载失败:', error);
      // 即使同步失败，也要加载基本数据
      await this.loadClassData();
    }
    
    // 初始化分享图片生成器
    this.setData({
      shareImageGenerator: new ShareImageGenerator()
    });
  },

  // 页面显示
  async onShow() {
    try {
      // 先同步班级学生人数统计
      await this.syncClassStudentCount();
      
      // 然后加载数据
      await this.loadClassData();
    } catch (error) {
      console.error('页面显示数据加载失败:', error);
      // 即使同步失败，也要加载基本数据
      await this.loadClassData();
    }
  },

  // 加载班级数据（保留原有逻辑，但优化学生数据加载）
  async loadClassData() {
    try {
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      // 从本地存储加载数据（作为备用）
      let classes = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
      let students = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
      const templates = wx.getStorageSync(`class_templates_${teacherId}`) || this.data.classTemplates;
      
      console.log('📊 本地存储数据:', {
        classes: classes.length,
        students: students.length,
        templates: templates.length
      });
      
      // 如果有云开发环境，尝试从云端同步班级和学生数据
      if (wx.cloud) {
        try {
          const db = wx.cloud.database();
          let cloudStudents = { data: [] };
          
          // 同步班级数据
          const cloudClasses = await db.collection('classes').where({
            teacherId: teacherId
          }).get();
          
          // 处理云端班级数据
          if (cloudClasses.data && cloudClasses.data.length > 0) {
            const formattedClasses = cloudClasses.data.map(cls => ({
              id: cls._id,
              name: cls.name,
              studentCount: cls.studentCount || 0,
              teacher: cls.teacher || '张老师',
              createdAt: cls.createdAt || new Date().toISOString().slice(0, 10),
              lastActivity: cls.lastActivity || new Date().toISOString(),
              status: cls.status || 'active',
              averageAccuracy: cls.averageAccuracy || 0,
              completedAssignments: cls.completedAssignments || 0,
              totalAssignments: cls.totalAssignments || 0,
              classType: cls.classType || '',
              subjectType: cls.subjectType || '',
              grade: cls.grade || '',
              semester: cls.semester || '',
              inviteCode: cls.inviteCode || '',
              inviteCodeExpiry: cls.inviteCodeExpiry || ''
            }));
            
            // 更新本地存储
            wx.setStorageSync(`teacher_classes_${teacherId}`, formattedClasses);
            classes = formattedClasses;
            
            console.log('从云端同步班级数据成功:', formattedClasses.length);
            
            // 直接查询属于当前教师的所有学生数据（使用新的优化查询方式）
            try {
              // 方法1：直接通过teacherId查询所有学生
              cloudStudents = await db.collection('students').where({
                teacherId: teacherId
              }).get();
              console.log('通过teacherId查询到的学生数量:', cloudStudents.data.length);
              
              // 如果通过teacherId查询不到，尝试通过班级ID查询
              if (cloudStudents.data.length === 0) {
                const teacherClassIds = formattedClasses.map(cls => cls.id);
                if (teacherClassIds.length > 0) {
                  cloudStudents = await db.collection('students').where({
                    classId: db.command.in(teacherClassIds)
                  }).get();
                  console.log('通过classId查询到的学生数量:', cloudStudents.data.length);
                }
              }
            } catch (studentQueryError) {
              console.warn('查询学生数据失败，尝试备用查询方法:', studentQueryError);
              // 备用方法：获取所有学生然后过滤
              const allStudents = await db.collection('students').limit(1000).get();
              cloudStudents.data = allStudents.data.filter(student => {
                // 优先匹配teacherId，如果没有则匹配classId
                return student.teacherId === teacherId || 
                       (formattedClasses.length > 0 && formattedClasses.some(cls => cls.id === student.classId));
              });
              console.log('通过过滤得到的学生数量:', cloudStudents.data.length);
            }
          } else {
            // 如果没有班级数据，设置空的学生查询结果
            cloudStudents = { data: [] };
          }
          
          // 处理云端学生数据（使用新的格式化方式）
          if (cloudStudents.data && cloudStudents.data.length > 0) {
            // 创建班级映射
            const classMap = {};
            classes.forEach(cls => {
              classMap[cls.id] = cls.name;
            });
            
            const formattedStudents = cloudStudents.data.map(student => {
              const className = classMap[student.classId] || '未分配班级';
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
            
            // 更新本地存储
            wx.setStorageSync(`teacher_students_${teacherId}`, formattedStudents);
            
            this.setData({
              classes: classes,
              students: formattedStudents,
              classTemplates: templates
            });
            
            console.log('从云端同步学生数据成功:', formattedStudents.length);
            console.log('学生班级关联:', formattedStudents.map(s => ({ name: s.name, class: s.class, classId: s.classId })));
            return;
          }
        } catch (cloudError) {
          console.warn('从云端同步数据失败，使用本地数据:', cloudError);
        }
      }
      
      // 如果没有云端数据或同步失败，使用本地数据
      if (classes.length === 0) {
        // 再次检查云端是否有班级数据，避免在解散班级后回退到示例数据
        if (wx.cloud) {
          try {
            const db = wx.cloud.database();
            const cloudClasses = await db.collection('classes').where({
              teacherId: teacherId
            }).get();
            
            if (cloudClasses.data && cloudClasses.data.length > 0) {
              // 云端有数据，使用云端数据
              const formattedClasses = cloudClasses.data.map(cls => ({
                id: cls._id,
                name: cls.name,
                studentCount: cls.studentCount || 0,
                teacher: cls.teacher || '张老师',
                createdAt: cls.createdAt || new Date().toISOString().slice(0, 10),
                lastActivity: cls.lastActivity || new Date().toISOString(),
                status: cls.status || 'active',
                averageAccuracy: cls.averageAccuracy || 0,
                completedAssignments: cls.completedAssignments || 0,
                totalAssignments: cls.totalAssignments || 0,
                classType: cls.classType || '',
                subjectType: cls.subjectType || '',
                grade: cls.grade || '',
                semester: cls.semester || '',
                inviteCode: cls.inviteCode || '',
                inviteCodeExpiry: cls.inviteCodeExpiry || ''
              }));
              classes = formattedClasses;
              wx.setStorageSync(`teacher_classes_${teacherId}`, formattedClasses);
              console.log('从云端重新加载班级数据:', formattedClasses.length);
            } else {
              // 云端也没有数据，说明用户确实没有班级，使用空数组而不是示例数据
              classes = [];
              console.log('用户没有班级数据，显示空列表');
            }
          } catch (cloudError) {
            console.warn('二次云端查询失败，使用空列表:', cloudError);
            classes = [];
          }
        } else {
          // 没有云开发环境，使用空数组而不是示例数据
          classes = [];
          console.log('无云开发环境，显示空列表');
        }
      }
      
      this.setData({
        classes: classes,
        students: students,
        classTemplates: templates
      });
      
    } catch (error) {
      console.error('加载班级数据失败:', error);
      // 发生错误时使用空数据，避免显示示例数据
      this.setData({
        classes: [],
        students: [],
        classTemplates: []
      });
    }
  },

  // 修复班级学生人数统计同步
  async syncClassStudentCount() {
    try {
      if (!wx.cloud) {
        console.warn('云开发环境不可用，跳过班级学生人数同步');
        return;
      }

      const db = wx.cloud.database();
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      // 获取所有班级
      const classesResult = await db.collection('classes').where({
        teacherId: teacherId
      }).get();
      
      console.log(`找到 ${classesResult.data.length} 个班级，开始同步学生人数...`);
      
      // 统计每个班级的实际学生数量并更新
      for (const classInfo of classesResult.data) {
        const studentsResult = await db.collection('students').where({
          classId: classInfo._id,
          status: 'active'
        }).get();
        
        const actualStudentCount = studentsResult.data.length;
        const recordedCount = classInfo.studentCount || 0;
        
        console.log(`班级 ${classInfo.name}: 当前显示 ${recordedCount} 人，实际 ${actualStudentCount} 人`);
        
        // 如果数量不一致，更新班级数据
        if (actualStudentCount !== recordedCount) {
          await db.collection('classes').doc(classInfo._id).update({
            data: {
              studentCount: actualStudentCount,
              updatedAt: new Date()
            }
          });
          
          console.log(`已更新班级 ${classInfo.name} 的学生数量为 ${actualStudentCount}`);
        }
      }
      
      // 重新加载数据
      await this.loadClassData();
      
    } catch (error) {
      console.error('同步班级学生人数失败:', error);
    }
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  // ========== 班级管理功能 ==========

  // 创建班级
  showCreateClassModal() {
    this.setData({ showCreateClass: true });
  },

  // 关闭创建班级弹窗
  closeCreateClassModal() {
    this.setData({ 
      showCreateClass: false,
      newClass: {
        name: '',
        classType: '',
        subjectType: '',
        grade: '高三',
        semester: ''
      }
    });
  },

  // 输入班级信息
  onClassInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`newClass.${field}`]: value
    });
  },

  // 提交创建班级
  async createClass() {
    const { newClass } = this.data;
    
    if (!newClass.name) {
      wx.showToast({
        title: '请输入班级名称',
        icon: 'none'
      });
      return;
    }

    try {
      wx.showLoading({
        title: '创建中...'
      });

      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      if (wx.cloud) {
        const db = wx.cloud.database();
        
        // 创建班级记录
        const classData = {
          name: newClass.name,
          teacherId: teacherId,
          teacher: '张老师',
          classType: newClass.classType || '常规班级',
          subjectType: newClass.subjectType || '英语',
          grade: newClass.grade || '高三',
          semester: newClass.semester || '上学期',
          status: 'active',
          studentCount: 0,
          averageAccuracy: 0,
          completedAssignments: 0,
          totalAssignments: 0,
          createdAt: new Date(),
          lastActivity: new Date()
        };

        const result = await db.collection('classes').add({
          data: classData
        });

        console.log('班级创建成功:', result._id);
        
        // 更新本地存储
        const existingClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
        const newClassRecord = {
          id: result._id,
          ...classData
        };
        existingClasses.push(newClassRecord);
        wx.setStorageSync(`teacher_classes_${teacherId}`, existingClasses);
        
        this.setData({
          classes: existingClasses,
          showCreateClass: false,
          newClass: {
            name: '',
            classType: '',
            subjectType: '',
            grade: '高三',
            semester: ''
          }
        });

        wx.hideLoading();
        wx.showToast({
          title: '班级创建成功',
          icon: 'success'
        });
      } else {
        // 本地模式
        const newClassRecord = {
          id: `class_${Date.now()}`,
          name: newClass.name,
          teacher: '张老师',
          studentCount: 0,
          averageAccuracy: 0,
          completedAssignments: 0,
          totalAssignments: 0,
          createdAt: new Date().toISOString().slice(0, 10),
          lastActivity: new Date().toISOString(),
          status: 'active'
        };

        const existingClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
        existingClasses.push(newClassRecord);
        wx.setStorageSync(`teacher_classes_${teacherId}`, existingClasses);
        
        this.setData({
          classes: existingClasses,
          showCreateClass: false,
          newClass: {
            name: '',
            classType: '',
            subjectType: '',
            grade: '高三',
            semester: ''
          }
        });

        wx.hideLoading();
        wx.showToast({
          title: '班级创建成功',
          icon: 'success'
        });
      }
    } catch (error) {
      console.error('创建班级失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '创建失败',
        icon: 'none'
      });
    }
  },

  // 查看班级详情
  async viewClassDetail(e) {
    const classId = e.currentTarget.dataset.id;
    const classData = this.data.classes.find(c => c.id === classId);
    
    if (classData) {
      this.setData({
        selectedClass: classData,
        showClassDetail: true
      });
      
      // 加载班级学生数据
      await this.loadClassStudents(classId);
    }
  },

  // 关闭班级详情
  closeClassDetail() {
    this.setData({
      showClassDetail: false,
      selectedClass: null,
      classStudents: []
    });
  },

  // 加载班级学生数据
  async loadClassStudents(classId) {
    try {
      wx.showLoading({
        title: '加载学生数据...'
      });

      if (wx.cloud) {
        const db = wx.cloud.database();
        const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
        
        // 优先通过teacherId查询，确保能查到所有学生
        let result;
        try {
          result = await db.collection('students').where({
            teacherId: teacherId,
            status: 'active'
          }).get();
          console.log('通过teacherId查询到学生数量:', result.data.length);
          
          // 如果有classId，进一步过滤
          if (classId && result.data.length > 0) {
            result.data = result.data.filter(student => student.classId === classId);
            console.log('按classId过滤后学生数量:', result.data.length);
          }
        } catch (teacherQueryError) {
          console.warn('通过teacherId查询失败，尝试classId查询:', teacherQueryError);
          // 备用方法：通过classId查询
          result = await db.collection('students').where({
            classId: classId,
            status: 'active'
          }).get();
          console.log('通过classId查询到学生数量:', result.data.length);
        }
        
        const classStudents = result.data.map(student => ({
          id: student._id,
          name: student.name,
          studentId: student.studentId || student._id,
          status: student.status || 'active',
          joinedAt: student.joinedAt || student.createTime,
          classId: student.classId,
          teacherId: student.teacherId
        }));
        
        this.setData({
          classStudents: classStudents
        });
        
        // 缓存到本地
        wx.setStorageSync(`class_students_${classId}`, classStudents);
        
        // 同时更新班级学生数量统计
        await this.syncClassStudentCount();
        
      } else {
        // 本地模式
        const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
        const classStudents = wx.getStorageSync(`class_students_${classId}`) || [];
        this.setData({
          classStudents: classStudents
        });
      }
      
      wx.hideLoading();
    } catch (error) {
      console.error('加载班级学生数据失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '加载学生数据失败',
        icon: 'none'
      });
    }
  },

  // 复制并分享邀请码
  async copyAndShareInvite(e) {
    const classId = e.currentTarget.dataset.classId;
    const classData = this.data.classes.find(c => c.id === classId);
    
    if (!classData) {
      wx.showToast({
        title: '班级信息不存在',
        icon: 'none'
      });
      return;
    }

    try {
      wx.showLoading({
        title: '生成邀请码...'
      });

      let inviteInfo;
      
      if (wx.cloud) {
        // 调用云函数生成邀请码
        const result = await wx.cloud.callFunction({
          name: 'manageClassInvite',
          data: {
            action: 'generate',
            classId: classId,
            teacherId: wx.getStorageSync('teacherId') || 'teacher_123'
          }
        });

        if (result.result && result.result.success) {
          inviteInfo = result.result.inviteInfo;
        } else {
          throw new Error(result.result?.message || '生成邀请码失败');
        }
      } else {
        // 本地模式生成邀请码
        const inviteCode = Math.random().toString(36).substr(2, 8).toUpperCase();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // 30天有效期
        
        inviteInfo = {
          inviteCode: inviteCode,
          inviteCodeExpiry: expiryDate,
          classId: classId,
          classData: classData
        };
      }

      wx.hideLoading();

      // 显示分享选项
      wx.showActionSheet({
        itemList: ['生成分享图片', '复制邀请码'],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 生成分享图片
            this.generateShareImage(inviteInfo);
          } else if (res.tapIndex === 1) {
            // 复制邀请码
            this.shareInviteCode(inviteInfo);
          }
        }
      });

    } catch (error) {
      console.error('生成邀请码失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成邀请码失败',
        icon: 'none'
      });
    }
  },

  // 生成分享图片
  generateShareImage(inviteInfo) {
    try {
      if (this.data.shareImageGenerator) {
        this.data.shareImageGenerator.generateClassInviteImage(inviteInfo, (imageUrl) => {
          this.setData({
            shareImageUrl: imageUrl,
            showShareImageModal: true
          });
        });
      } else {
        wx.showToast({
          title: '分享图片生成器未初始化',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('生成分享图片失败:', error);
      wx.showToast({
        title: '生成分享图片失败',
        icon: 'none'
      });
    }
  },

  // 直接分享邀请码
  shareInviteCode(inviteInfo) {
    const shareContent = `班级邀请码：${inviteInfo.inviteCode}\n\n请使用此邀请码加入班级。\n有效期至：${new Date(inviteInfo.inviteCodeExpiry).toLocaleDateString()}`;
    
    wx.showModal({
      title: '班级邀请码',
      content: shareContent,
      confirmText: '复制',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: shareContent,
            success: () => {
              wx.showToast({
                title: '已复制到剪贴板',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  // 申请解散班级
  requestDismissClass(e) {
    const classId = e.currentTarget.dataset.classId;
    const className = e.currentTarget.dataset.className;
    const classData = this.data.classes.find(c => c.id === classId);
    
    if (!classData) {
      wx.showToast({
        title: '班级信息不存在',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '申请解散班级',
      content: `确定要申请解散班级"${className}"吗？\n\n解散后班级数据将无法恢复，请谨慎操作。`,
      confirmText: '确认申请',
      confirmColor: '#ff4d4f',
      cancelText: '取消',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({
              title: '提交申请中...'
            });

            if (wx.cloud) {
              // 调用云函数提交解散申请
              const result = await wx.cloud.callFunction({
                name: 'manageClassInvite',
                data: {
                  action: 'dismiss',
                  classId: classId,
                  teacherId: wx.getStorageSync('teacherId') || 'teacher_123'
                }
              });

              wx.hideLoading();

              if (result.result && result.result.success) {
                wx.showToast({
                  title: '解散申请已提交',
                  icon: 'success'
                });
              } else {
                throw new Error(result.result?.message || '提交解散申请失败');
              }
            } else {
              // 本地模式
              wx.hideLoading();
              wx.showToast({
                title: '解散申请已提交（本地模式）',
                icon: 'success'
              });
            }
          } catch (error) {
            console.error('提交解散申请失败:', error);
            wx.hideLoading();
            wx.showToast({
              title: '提交申请失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 刷新班级列表
  async refreshClassList() {
    wx.showLoading({
      title: '刷新中...'
    });
    
    try {
      // 先同步班级学生人数统计
      await this.syncClassStudentCount();
      
      // 然后加载最新数据
      await this.loadClassData();
      
      wx.hideLoading();
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
    } catch (error) {
      console.error('刷新班级列表失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '刷新失败',
        icon: 'none'
      });
    }
  },

  // ========== 学生管理功能 ==========

  // 刷新学生列表
  async refreshStudentList() {
    wx.showLoading({
      title: '刷新中...'
    });
    
    try {
      // 清除本地缓存
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      wx.removeStorageSync(`teacher_students_${teacherId}`);
      
      // 重新加载数据
      await this.loadClassData();
      
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

  // 导入学生
  importStudents() {
    wx.showModal({
      title: '导入学生',
      content: '支持Excel文件导入，请确保文件格式正确',
      confirmText: '选择文件',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.importStudentsInClass();
        }
      }
    });
  },

  // 在班级创建时导入学生
  importStudentsInClass() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['xlsx', 'xls'],
      success: async (res) => {
        const file = res.tempFiles[0];
        console.log('选择的文件:', file);
        
        try {
          wx.showLoading({
            title: '解析文件中...'
          });

          // 调用云函数解析Excel文件
          const result = await wx.cloud.callFunction({
            name: 'parseExcelFile',
            data: {
              fileId: file.path
            }
          });

          wx.hideLoading();

          if (result.result && res.result.success) {
            // 直接导入成功，刷新学生列表
            wx.showToast({
              title: res.result.message || `成功导入${res.result.importedCount}名学生`,
              icon: 'success'
            });
            
            // 自动刷新学生列表
            setTimeout(async () => {
              await this.loadClassData();
              console.log('学生列表已自动刷新');
            }, 1000);
          } else {
            const errorMessage = res.result ? res.result.message : '解析失败';
            wx.showToast({
              title: errorMessage,
              icon: 'none'
            });
          }
        } catch (error) {
          console.error('导入学生失败:', error);
          wx.hideLoading();
          wx.showToast({
            title: '导入失败',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        console.error('选择文件失败:', error);
        wx.showToast({
          title: '选择文件失败',
          icon: 'none'
        });
      }
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
  },

  // ========== 工具函数 ==========

  // 格式化时间
  formatTime(timeStr) {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleString();
  },

  // 格式化日期
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  },

  // 关闭分享图片弹窗
  closeShareImageModal() {
    this.setData({
      showShareImageModal: false,
      shareImageUrl: ''
    });
  }
});

// 导出供其他页面使用
module.exports = {
  loadClassData: function() {
    return this.loadClassData();
  },
  refreshClassList: function() {
    return this.refreshClassList();
  },
  refreshStudentList: function() {
    return this.refreshStudentList();
  }
};
