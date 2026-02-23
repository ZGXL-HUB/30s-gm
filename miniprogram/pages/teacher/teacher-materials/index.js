// 教师端我的学案页面
const { stripMarkdown } = require('../../../utils/markdown.js');

Page({
  data: {
    // 刷新状态
    isRefreshing: false,
    
    // 配套材料数据（只保留学案）
    recentMaterials: [
      {
        id: 'mat_1',
        title: '定语从句综合练习学案',
        type: 'word',
        createdAt: '2024-12-20 10:00',
        downloadCount: 15,
        classAccuracy: 78,
        status: 'completed'
      },
      {
        id: 'mat_2',
        title: '时态语态综合练习学案',
        type: 'word',
        createdAt: '2024-12-19 14:30',
        downloadCount: 22,
        classAccuracy: 82,
        status: 'completed'
      },
      {
        id: 'mat_3',
        title: '虚拟语气综合练习学案',
        type: 'word',
        createdAt: '2024-12-18 16:45',
        downloadCount: 8,
        classAccuracy: 65,
        status: 'completed'
      }
    ],

    // 材料库数据（只保留学案模板）
    materialLibrary: {
      templates: [
        {
          id: 'template_1',
          name: '学案Word模板',
          type: 'word',
          downloadCount: 89,
          lastUsed: '2024-12-18'
        }
      ],
      history: [
        {
          id: 'hist_1',
          name: '定语从句综合练习学案',
          type: 'word',
          createdAt: '2024-12-20',
          size: '1.8MB',
          status: 'completed'
        },
        {
          id: 'hist_2',
          name: '时态语态综合练习学案',
          type: 'word',
          createdAt: '2024-12-19',
          size: '1.8MB',
          status: 'completed'
        }
      ]
    },

    // 界面状态
    showAssignmentDetail: false,
    selectedAssignment: null,
    loading: false,
    
    // 分享相关
    shareInfo: null
  },

  onLoad(options) {
    console.log('教师端学案页面加载', options);
    
    // 处理从作业发布页面跳转过来的参数
    if (options.fromHomework === 'true') {
      console.log('从作业发布页面跳转过来，作业ID:', options.homeworkId);
      this.setData({
        fromHomework: true,
        homeworkId: options.homeworkId,
        homeworkTitle: options.homeworkTitle
      });
      
      // 立即添加新生成的作业到材料列表
      this.addNewHomeworkToMaterials(options.homeworkId, options.homeworkTitle);
    }
    
    // 延迟加载数据，确保存储操作完成
    setTimeout(() => {
    this.loadMaterialsData();
    }, 100);
  },

  onShow() {
    // 延迟加载数据，避免与onLoad冲突
    setTimeout(() => {
    this.loadMaterialsData();
    }, 50);
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.refreshMaterials();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 添加新生成的作业到材料列表
  addNewHomeworkToMaterials(homeworkId, homeworkTitle) {
    try {
      // 从存储中获取最新的作业数据
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
      const newHomework = homeworks.find(h => h._id === homeworkId);
      
      if (newHomework && newHomework.questions && newHomework.questions.length > 0) {
        console.log('找到新作业数据，题目数量:', newHomework.questions.length);
        
        // 创建新的材料条目
        const newMaterial = {
          id: `mat_${Date.now()}`,
          title: homeworkTitle || newHomework.title,
          type: 'Word学案',
          createdAt: new Date().toISOString(),
          downloadCount: 0,
          classAccuracy: 0,
          status: 'completed',
          assignmentId: homeworkId,
          questionCount: newHomework.questions.length,
          assignmentTitle: newHomework.title
        };
        
        // 确保标题正确显示，避免URL编码问题
        if (newMaterial.title && newMaterial.title.includes('%')) {
          newMaterial.title = decodeURIComponent(newMaterial.title);
        }
        
        // 添加到材料列表
        const currentMaterials = this.data.recentMaterials || [];
        const updatedMaterials = [newMaterial, ...currentMaterials].slice(0, 10); // 最多显示10条
        
          this.setData({
          recentMaterials: updatedMaterials
        });
        
        console.log('新作业已添加到材料列表:', newMaterial);
        } else {
        console.warn('未找到新作业数据或作业中没有题目');
      }
    } catch (error) {
      console.error('添加新作业到材料列表失败:', error);
    }
  },

  // 加载材料数据
  loadMaterialsData() {
    try {
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      const materials = wx.getStorageSync(`materials_${teacherId}`) || [];
      
      if (materials.length > 0) {
      this.setData({
          recentMaterials: materials
        });
      }
    } catch (error) {
      console.error('加载材料数据失败:', error);
    }
  },

  // 刷新材料
  refreshMaterials() {
    this.setData({ isRefreshing: true });
    
    setTimeout(() => {
      this.loadMaterialsData();
      this.setData({ isRefreshing: false });
      
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 生成配套材料（学生版-无答案）
  async generateMaterial(e) {
    const materialId = e.currentTarget.dataset.id;
    const format = e.currentTarget.dataset.format;
    
    try {
      // 获取材料信息
      const material = this.data.recentMaterials.find(m => m.id === materialId);
      if (!material) {
        wx.showToast({
          title: '材料不存在',
          icon: 'error'
        });
        return;
      }
          
          wx.showLoading({
        title: '生成学案中...'
      });

      // 生成学案内容
      const content = await this.generateLocalWordContentWithoutAnswers(material, 2);
      
      // 保存为文件
      const fileName = `${material.title}_学生版_${Date.now()}.txt`;
      const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
      
      const fs = wx.getFileSystemManager();
      fs.writeFileSync(filePath, content, 'utf8');
            
            wx.hideLoading();
            
      // 显示成功提示并告知文件位置
            wx.showModal({
        title: '学案生成成功',
        content: `学案已保存到：${fileName}\n\n文件位置：手机存储/微信小程序/语法练习系统/`,
        confirmText: '打开文件',
        cancelText: '稍后查看',
        success: (res) => {
          if (res.confirm) {
            // 打开文件
            wx.openDocument({
              filePath: filePath,
              showMenu: true, // 显示分享菜单
                    success: () => {
                console.log('学案生成成功');
                this.updateDownloadCount(materialId);
              },
              fail: (error) => {
                console.error('打开文件失败:', error);
                      wx.showToast({
                  title: '文件已保存，请手动打开',
                  icon: 'none'
                      });
                    }
                  });
          } else {
            // 用户选择稍后查看，更新下载次数
            this.updateDownloadCount(materialId);
            wx.showToast({
              title: '学案已保存，可稍后查看',
              icon: 'success'
            });
          }
        }
      });
      
    } catch (error) {
      console.error('生成学案失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成失败',
        icon: 'error'
      });
    }
  },

  // 下载材料（教师版-含答案）
  async downloadMaterial(e) {
    const materialId = e.currentTarget.dataset.id;
    
    try {
      // 获取材料信息
      const material = this.data.recentMaterials.find(m => m.id === materialId);
    if (!material) {
      wx.showToast({
        title: '材料不存在',
        icon: 'error'
      });
      return;
    }

      wx.showLoading({
        title: '生成教师学案中...'
      });

      // 生成教师版学案内容（含答案）
      const content = await this.generateTeacherWordContent(material);
      
      // 保存为文件
      const fileName = `${material.title}_教师版_${Date.now()}.txt`;
          const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
          
      const fs = wx.getFileSystemManager();
            fs.writeFileSync(filePath, content, 'utf8');
          
            wx.hideLoading();
          
      // 显示成功提示并告知文件位置
      wx.showModal({
        title: '教师学案生成成功',
        content: `教师学案已保存到：${fileName}\n\n文件位置：手机存储/微信小程序/语法练习系统/`,
        confirmText: '打开文件',
        cancelText: '稍后查看',
        success: (res) => {
          if (res.confirm) {
            // 打开文件
            wx.openDocument({
              filePath: filePath,
              showMenu: true, // 显示分享菜单
              success: () => {
                console.log('教师学案生成成功');
                this.updateDownloadCount(materialId);
              },
              fail: (error) => {
                console.error('打开文件失败:', error);
                          wx.showToast({
                  title: '文件已保存，请手动打开',
                  icon: 'none'
                          });
                        }
                      });
                    } else {
            // 用户选择稍后查看，更新下载次数
            this.updateDownloadCount(materialId);
                      wx.showToast({
              title: '教师学案已保存，可稍后查看',
                        icon: 'success'
                      });
                    }
                  }
                });

        } catch (error) {
      console.error('生成教师学案失败:', error);
          wx.hideLoading();
          wx.showToast({
        title: '生成失败',
            icon: 'error'
          });
        }
  },

  // 跳转到统一学案生成流程
  goToUnifiedGenerate(e) {
    const materialId = e.currentTarget.dataset.id;
    const material = this.data.recentMaterials.find(m => m.id === materialId);
    
    if (!material) {
      wx.showToast({
        title: '材料不存在',
        icon: 'error'
      });
      return;
    }

    // 跳转到新的统一生成流程页面
    wx.navigateTo({
      url: `/pages/teacher/teacher-generate-material/index?materialId=${materialId}&assignmentId=${material.assignmentId}`
    });
  },

  // 分享学案到微信
  async shareMaterialToWechat(e) {
    const materialId = e.currentTarget.dataset.id;
    const material = this.data.recentMaterials.find(m => m.id === materialId);
    
    if (!material) {
      wx.showToast({
        title: '材料不存在',
        icon: 'error'
      });
      return;
    }

    try {
      wx.showLoading({
        title: '准备分享学案...'
      });

      // 生成学生版学案内容
      const content = await this.generateLocalWordContentWithoutAnswers(material, 2);
      
      // 保存为文件
      const fileName = `${material.title}_分享版_${Date.now()}.txt`;
      const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
      
      const fs = wx.getFileSystemManager();
      fs.writeFileSync(filePath, content, 'utf8');
      
      wx.hideLoading();
      
      // 直接打开文件，让用户通过系统分享菜单分享
      wx.openDocument({
        filePath: filePath,
        showMenu: true, // 显示分享菜单
              success: () => {
          console.log('学案分享准备完成');
          this.updateDownloadCount(materialId);
                wx.showToast({
            title: '学案已准备，请使用右上角分享',
                  icon: 'success'
                });
        },
        fail: (error) => {
          console.error('打开文件失败:', error);
          wx.showToast({
            title: '文件已保存，请手动分享',
            icon: 'none'
          });
        }
      });
      
    } catch (error) {
      console.error('准备分享学案失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '分享失败',
        icon: 'error'
      });
    }
  },

  // 分享给好友
  shareToFriend(material) {
        wx.showToast({
      title: '请使用右上角分享',
      icon: 'none'
        });
      },

  // 保存到手机
  saveToPhone(material) {
              wx.showToast({
      title: '保存成功',
      icon: 'success'
              });
  },

              // 复制内容
  copyContent(material) {
    const markdownContent = `学案标题：${material.title}\n生成时间：${material.createdAt}\n班级正确率：${material.classAccuracy}%`;
    const plainTextContent = stripMarkdown(markdownContent);

    // 直接复制为纯文本
    wx.setClipboardData({
      data: plainTextContent,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
      }
    });
  },

  // 生成教师版学案内容（含答案）
  async generateTeacherWordContent(material) {
    // 获取关联的作业数据
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
    const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
    const allAssignments = [...homeworks, ...assignments];
    const assignment = allAssignments.find(a => (a._id || a.id) === material.assignmentId);
    
    console.log('生成教师学案（含答案），作业数据:', assignment);
    
    let practiceContent = '';
    let knowledgePoints = [];
    
    // 使用保存的完整题目（教师版-含答案）
    if (assignment && assignment.questions && assignment.questions.length > 0) {
      console.log('✅ 使用作业中保存的题目（教师版），数量:', assignment.questions.length);
      
      for (let i = 0; i < assignment.questions.length; i++) {
        const question = assignment.questions[i];
        
        // 原题（含答案）
        practiceContent += `#### 练习${i + 1}：${question.grammarPoint || question.category}
**题目**: ${question.text}
**答案**: ${question.answer}
**解析**: ${question.analysis || '暂无解析'}

`;
        
        const grammarPoint = question.grammarPoint || question.category;
        if (grammarPoint && !knowledgePoints.includes(grammarPoint)) {
          knowledgePoints.push(grammarPoint);
        }
        
        // 题目之间添加分隔
        practiceContent += `---

`;
      }
      
    } else {
      // 如果没有题目数据，显示提示
      console.warn('⚠️ 作业中没有保存题目数据');
      practiceContent = `暂无题目数据，请确保作业已正确保存题目信息。

`;
      knowledgePoints = ['暂无数据'];
    }
    
    return `# ${material.title}

## 教师学案（含答案）

**作业信息**:
- 作业类型: ${assignment ? (assignment.type === 'gaokao' ? '高考配比练习' : assignment.type === 'topic' ? '专题练习' : '自选练习') : '语法练习'}
- 考查知识点: ${knowledgePoints.join('、')}
- 题目数量: ${material.questionCount || 0}题

### 练习内容

${practiceContent}

---

**生成时间**: ${new Date().toLocaleString('zh-CN')}
**作业标题**: ${material.assignmentTitle || '语法练习'}`;
  },

  // 生成本地Word内容（无答案版本 - 学生学案）
  async generateLocalWordContentWithoutAnswers(material, variantCountPerQuestion = 2) {
    // 获取关联的作业数据
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
    const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
    const allAssignments = [...homeworks, ...assignments];
    const assignment = allAssignments.find(a => (a._id || a.id) === material.assignmentId);
    
    console.log('生成学生学案（无答案），作业数据:', assignment);
    console.log('材料信息:', material);
    
    let practiceContent = '';
    let knowledgePoints = [];
    
    // 使用保存的完整题目（学生版）
    if (assignment && assignment.questions && assignment.questions.length > 0) {
      console.log('使用作业中保存的题目（学生版），数量:', assignment.questions.length);
      
      for (let i = 0; i < assignment.questions.length; i++) {
        const question = assignment.questions[i];
        
        // 原题（无答案）
        practiceContent += `#### 练习${i + 1}：${question.grammarPoint || question.category}
**题目**: ${question.text}

`;
        
        const grammarPoint = question.grammarPoint || question.category;
        if (grammarPoint && !knowledgePoints.includes(grammarPoint)) {
          knowledgePoints.push(grammarPoint);
        }
        
        // 题目之间添加分隔
        practiceContent += `---

`;
      }
      
    } else {
      // 如果没有题目数据，显示提示
      console.warn('作业中没有保存题目数据');
      console.log('assignment:', assignment);
      console.log('material.assignmentId:', material.assignmentId);
      console.log('allAssignments:', allAssignments);
      
      practiceContent = `暂无题目数据，请确保作业已正确保存题目信息。

`;
      knowledgePoints = ['暂无数据'];
    }
    
    return `# ${material.title}

## 学生练习学案

**学生信息**:
- 班级：____________    姓名：____________    学号：____________
- 完成日期：____________

**作业信息**:
- 作业类型: ${assignment ? (assignment.type === 'gaokao' ? '高考配比练习' : assignment.type === 'topic' ? '专题练习' : '自选练习') : '语法练习'}
- 考查知识点: ${knowledgePoints.join('、')}
- 题目数量: ${material.questionCount || 0}题

### 练习内容

${practiceContent}

---

## 学生扫码练题

**📱 扫码练习同类题目**

扫描下方二维码，完成3道同类语法练习题，系统会自动记录你的掌握情况。

\`\`\`
┌─────────────────────────────────┐
│                                 │
│        [二维码占位符]            │
│                                 │
│    学生扫码练3道同类题           │
│    (限时试用)                    │
│                                 │
└─────────────────────────────────┘
\`\`\`

**说明**: 
- 扫码后完成3道同类语法练习题
- 系统自动记录掌握情况
- 限时试用，无需注册

---

**生成时间**: ${new Date().toLocaleString('zh-CN')}
**作业标题**: ${material.assignmentTitle || '语法练习'}`;
  },

  // 更新下载次数
  updateDownloadCount(materialId) {
    const materials = this.data.recentMaterials.map(m => {
      if (m.id === materialId) {
        return { ...m, downloadCount: m.downloadCount + 1 };
      }
      return m;
    });
    this.setData({ recentMaterials: materials });
  },

  // 查看作业详情
  viewAssignmentDetail(e) {
    const materialId = e.currentTarget.dataset.id;
    const material = this.data.recentMaterials.find(m => m.id === materialId);
    
    if (material) {
      this.setData({
        showAssignmentDetail: true,
        selectedAssignment: {
          title: material.title,
          remark: '基于作业结果自动生成',
          deadline: '无截止时间',
          completedCount: 25,
          totalCount: 30,
          averageAccuracy: material.classAccuracy,
          createdAt: material.createdAt
        }
      });
    }
  },

  // 关闭作业详情
  closeAssignmentDetail() {
    this.setData({
      showAssignmentDetail: false,
      selectedAssignment: null
    });
  },

  // 跳转到布置作业页面
  goToHomework() {
    wx.navigateTo({
      url: '/pages/teacher/teacher-homework/index'
    });
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