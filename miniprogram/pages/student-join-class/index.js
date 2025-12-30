// 学生加入班级页面逻辑
Page({
  data: {
    inviteCode: '',
    classInfo: null,
    studentInfo: {
      name: '',
      avatarUrl: '',
      openId: ''
    },
    loading: false,
    joining: false,
    errorMessage: '',
    successMessage: '',
    showStudentInfo: false
  },

  onLoad(options) {
    console.log('学生加入班级页面加载', options);
    
    // 从URL参数获取邀请码
    if (options.code) {
      this.setData({
        inviteCode: options.code
      });
      // 自动验证邀请码
      this.validateInviteCode();
    }
    
    // 获取用户信息
    this.getUserInfo();
  },

  // 获取用户信息
  async getUserInfo() {
    try {
      // 尝试从本地存储获取用户信息
      let userInfo = wx.getStorageSync('userInfo');
      
      if (!userInfo || !userInfo.openid) {
        // 如果没有用户信息，尝试获取微信用户信息
        const loginResult = await this.wxLogin();
        if (loginResult.success) {
          userInfo = loginResult.data;
          // 保存到本地存储
          wx.setStorageSync('userInfo', userInfo);
        }
      }
      
      if (userInfo && userInfo.openid) {
        console.log('获取到用户openid:', userInfo.openid);
        this.setData({
          'studentInfo.openId': userInfo.openid
        });
        
        // 尝试从本地存储获取已保存的学生信息
        const savedStudentInfo = wx.getStorageSync('studentInfo');
        if (savedStudentInfo && savedStudentInfo.name) {
          console.log('从本地存储恢复学生信息:', savedStudentInfo.name);
          this.setData({
            'studentInfo.name': savedStudentInfo.name,
            'studentInfo.avatarUrl': savedStudentInfo.avatarUrl || ''
          });
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  },

  // 微信登录
  wxLogin() {
    return new Promise((resolve) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 调用云函数获取openid
            wx.cloud.callFunction({
              name: 'login',
              data: {}
            }).then(result => {
              resolve({
                success: true,
                data: {
                  openid: result.result.openid,
                  appid: result.result.appid
                }
              });
            }).catch(error => {
              console.error('云函数登录失败:', error);
              resolve({ success: false, error: error.message });
            });
          } else {
            resolve({ success: false, error: '微信登录失败' });
          }
        },
        fail: (error) => {
          resolve({ success: false, error: error.message });
        }
      });
    });
  },

  // 获取用户资料
  getUserProfile() {
    return new Promise((resolve) => {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          resolve({
            success: true,
            data: {
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl
            }
          });
        },
        fail: (error) => {
          resolve({ success: false, error: error.message });
        }
      });
    });
  },

  // 邀请码输入
  onInviteCodeInput(e) {
    const value = e.detail.value.replace(/\D/g, ''); // 只允许数字
    this.setData({
      inviteCode: value,
      errorMessage: '',
      classInfo: null
    });
  },

  // 验证邀请码
  async validateInviteCode() {
    const { inviteCode } = this.data;
    
    if (!inviteCode || inviteCode.length !== 6) {
      this.setData({
        errorMessage: '请输入6位数字邀请码'
      });
      return;
    }

    this.setData({ loading: true, errorMessage: '' });

    try {
      const result = await wx.cloud.callFunction({
        name: 'manageClassInvite',
        data: {
          action: 'validate',
          inviteCode: inviteCode
        }
      });

      if (result.result.success) {
        this.setData({
          classInfo: result.result.data,
          loading: false
        });
      } else {
        this.setData({
          errorMessage: result.result.message,
          loading: false
        });
      }
    } catch (error) {
      console.error('验证邀请码失败:', error);
      this.setData({
        errorMessage: '网络错误，请重试',
        loading: false
      });
    }
  },

  // 加入班级
  joinClass() {
    const { inviteCode } = this.data;
    
    if (!inviteCode || inviteCode.length !== 6) {
      this.setData({
        errorMessage: '请输入6位数字邀请码'
      });
      return;
    }

    // 检查学生信息是否完整
    if (!this.data.studentInfo.name) {
      this.setData({
        showStudentInfo: true
      });
      return;
    }

    this.validateInviteCode();
  },

  // 确认加入班级
  async confirmJoinClass() {
    const { classInfo, studentInfo } = this.data;
    
    // 验证必要信息
    if (!classInfo) {
      this.setData({
        errorMessage: '请先验证邀请码'
      });
      return;
    }
    
    if (!studentInfo.openId) {
      this.setData({
        errorMessage: '获取用户信息失败，请重新打开页面'
      });
      return;
    }
    
    if (!studentInfo.name || studentInfo.name.trim() === '') {
      this.setData({
        errorMessage: '请输入您的姓名',
        showStudentInfo: true
      });
      return;
    }

    console.log('准备加入班级，学生信息:', JSON.stringify(studentInfo));
    this.setData({ joining: true, errorMessage: '' });

    try {
      const result = await wx.cloud.callFunction({
        name: 'studentJoinClass',
        data: {
          action: 'joinByInvite',
          inviteCode: this.data.inviteCode,
          studentInfo: {
            openId: studentInfo.openId,
            name: studentInfo.name.trim(),
            avatarUrl: studentInfo.avatarUrl || ''
          }
        }
      });

      console.log('云函数返回结果:', JSON.stringify(result.result));

      if (result.result.success) {
        this.setData({
          successMessage: `成功加入班级：${classInfo.className}`,
          joining: false,
          classInfo: null
        });
        
        // 保存学生信息到本地存储
        const savedStudentInfo = {
          openId: studentInfo.openId,
          name: studentInfo.name.trim(),
          avatarUrl: studentInfo.avatarUrl || '',
          classId: result.result.data.classInfo.classId,
          className: result.result.data.classInfo.className,
          teacherId: result.result.data.classInfo.teacherId,
          joinedAt: new Date().toISOString()
        };
        console.log('保存学生信息到本地:', JSON.stringify(savedStudentInfo));
        wx.setStorageSync('studentInfo', savedStudentInfo);
        
        wx.showToast({
          title: '加入成功',
          icon: 'success',
          duration: 2000
        });
        
      } else {
        this.setData({
          errorMessage: result.result.message || '加入班级失败',
          joining: false
        });
      }
    } catch (error) {
      console.error('加入班级失败:', error);
      this.setData({
        errorMessage: '网络错误，请重试：' + (error.message || '未知错误'),
        joining: false
      });
    }
  },

  // 学生姓名输入
  onStudentNameInput(e) {
    this.setData({
      'studentInfo.name': e.detail.value.trim()
    });
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        
        // 上传头像到云存储
        wx.cloud.uploadFile({
          cloudPath: `avatars/${this.data.studentInfo.openId}_${Date.now()}.jpg`,
          filePath: tempFilePath,
          success: (uploadResult) => {
            this.setData({
              'studentInfo.avatarUrl': uploadResult.fileID
            });
            wx.showToast({
              title: '头像上传成功',
              icon: 'success'
            });
          },
          fail: (error) => {
            console.error('头像上传失败:', error);
            wx.showToast({
              title: '头像上传失败',
              icon: 'none'
            });
          }
        });
      },
      fail: (error) => {
        console.error('选择头像失败:', error);
      }
    });
  },

  // 确认学生信息
  confirmStudentInfo() {
    const { studentInfo } = this.data;
    
    if (!studentInfo.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
      return;
    }

    this.setData({
      showStudentInfo: false
    });

    // 验证邀请码并加入班级
    this.validateInviteCode();
  },

  // 进入学生中心
  goToStudentCenter() {
    wx.switchTab({
      url: '/pages/user-center/index'
    });
  },

  // 重新输入邀请码
  retry() {
    this.setData({
      inviteCode: '',
      classInfo: null,
      errorMessage: '',
      successMessage: '',
      showStudentInfo: false
    });
  },

  // 分享邀请码
  shareInviteCode() {
    const { classInfo } = this.data;
    
    if (!classInfo) {
      wx.showToast({
        title: '请先验证邀请码',
        icon: 'none'
      });
      return;
    }

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 页面分享
  onShareAppMessage() {
    const { classInfo, inviteCode } = this.data;
    
    return {
      title: `邀请您加入班级：${classInfo ? classInfo.className : '未知班级'}`,
      path: `/pages/student-join-class/index?code=${inviteCode}`,
      imageUrl: classInfo ? classInfo.teacherAvatar : ''
    };
  }
});
