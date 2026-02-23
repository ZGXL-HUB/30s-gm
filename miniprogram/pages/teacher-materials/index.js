// 教师端我的学案页面
const { stripMarkdown } = require('./utils/markdown.js');

Page({
  data: {
    // 当前标签页
    currentTab: 'materials', // materials, rollcall, test, library
    
    // 刷新状态
    isRefreshing: false,
    
    // 全语法点摸底测试增强功能
    comprehensiveTestData: {
      estimatedQuestions: 40,
      estimatedTime: '60-90',
      coveredPoints: 25
    },
    showTestConfig: false,
    testTitle: '全语法点测试',
    testRemark: '',
    isGeneratingTest: false,
    generationProgress: 0,
    generationStatus: '正在准备测试...',
    
    // 反馈界面
    showFeedbackModal: false,
    feedbackContent: '',
    
    
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

    // 点名器数据
    rollcallData: {
      currentClass: '高三(1)班',
      currentQuestion: 1,
      totalQuestions: 0,
      currentAssignment: null,
      currentQuestionData: null,
      students: [
        { id: 's1', name: '张三', status: 'correct', answerTime: '00:15', isMarked: true },
        { id: 's2', name: '李四', status: 'wrong', answerTime: '00:23', isMarked: true },
        { id: 's3', name: '王五', status: 'correct', answerTime: '00:18', isMarked: true },
        { id: 's4', name: '赵六', status: 'pending', answerTime: '00:00', isMarked: false },
        { id: 's5', name: '钱七', status: 'correct', answerTime: '00:12', isMarked: true }
      ],
      statistics: {
        totalStudents: 5,
        answeredStudents: 4,
        correctCount: 3,
        accuracy: 75
      }
    },
    
    // 点名器增强功能
    showQuestionList: false,
    questionList: [
      { id: 1, title: '定语从句关系代词', status: 'current' },
      { id: 2, title: '非谓语动词不定式', status: 'pending' },
      { id: 3, title: '时态语态现在完成时', status: 'pending' },
      { id: 4, title: '虚拟语气条件句', status: 'pending' },
      { id: 5, title: '名词性从句主语从句', status: 'pending' }
    ],
    
    // 随机点名
    isRandomCalling: false,
    selectedStudent: { name: '' },
    randomCallTimer: null,
    
    // 统计结果
    statisticsResults: [
      { id: 1, knowledgePoint: '介词-固定搭配', homeworkAccuracy: 20, explanationAccuracy: 50 },
      { id: 2, knowledgePoint: '定语从句-关系代词', homeworkAccuracy: 35, explanationAccuracy: 65 },
      { id: 3, knowledgePoint: '非谓语动词-不定式', homeworkAccuracy: 28, explanationAccuracy: 58 },
      { id: 4, knowledgePoint: '时态语态-现在完成时', homeworkAccuracy: 42, explanationAccuracy: 72 }
    ],

    // 摸底测试数据
    testData: {
      availableTests: [
        {
          id: 'test_1',
          title: '全语法点摸底测试',
          description: '覆盖所有语法点的综合测试',
          questionCount: 50,
          estimatedTime: '60分钟',
          difficulty: 'comprehensive'
        },
        {
          id: 'test_2',
          title: '高考语法点专项测试',
          description: '针对高考重点语法点的测试',
          questionCount: 30,
          estimatedTime: '40分钟',
          difficulty: 'gaokao'
        }
      ],
      
      testResults: [
        {
          id: 'result_1',
          testTitle: '全语法点摸底测试',
          className: '高三(1)班',
          testDate: '2024-12-20',
          totalStudents: 25,
          averageAccuracy: 72,
          topGrammarPoints: ['定语从句', '非谓语动词', '时态语态'],
          weakGrammarPoints: ['虚拟语气', '名词性从句']
        }
      ]
    },

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
    showRollcallModal: false,
    showTestModal: false,
    showMaterialModal: false,
    showAssignmentDetail: false,
    selectedAssignment: null,
    showAssignmentSelector: false,
    availableAssignments: [],
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
    }
    
    // 延迟加载数据，确保存储操作完成
    setTimeout(() => {
    this.loadMaterialsData();
    }, 100);
    
    this.initCloudBackup();
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
  },

  // 手动刷新材料
  async refreshMaterials() {
    try {
      this.setData({ isRefreshing: true });
      
      // 显示刷新提示
      wx.showLoading({
        title: '刷新中...',
        mask: true
      });
      
      // 重新加载数据
      await this.loadMaterialsData();
      
      // 检查是否有新作业需要生成材料
      await this.checkAndGenerateNewMaterials();
      
      wx.hideLoading();
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
      
    } catch (error) {
      console.error('刷新失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '刷新失败',
        icon: 'error'
      });
    } finally {
      this.setData({ isRefreshing: false });
      wx.stopPullDownRefresh();
    }
  },

  // 检查并生成新材料
  async checkAndGenerateNewMaterials() {
    try {
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
      const existingMaterials = wx.getStorageSync(`teacher_materials_${teacherId}`) || [];
      
      // 查找没有对应材料的作业
      const newAssignments = assignments.filter(assignment => {
        return !existingMaterials.some(material => 
          material.assignmentId === assignment._id || material.assignmentId === assignment.id
        );
      });
      
      // 为新作业生成材料条目
      if (newAssignments.length > 0) {
        const newMaterials = newAssignments.map(assignment => ({
          id: `mat_${assignment._id || assignment.id}`,
          title: `${assignment.title}配套材料`,
          type: 'ppt',
          createdAt: assignment.createdAt,
          downloadCount: 0,
          classAccuracy: 0,
          status: 'pending',
          assignmentId: assignment._id || assignment.id,
          assignmentTitle: assignment.title,
          questionCount: assignment.questionCount || 0
        }));
        
        // 保存新材料
        const updatedMaterials = [...newMaterials, ...existingMaterials];
        wx.setStorageSync(`teacher_materials_${teacherId}`, updatedMaterials);
        
        // 更新界面数据
        this.setData({
          recentMaterials: updatedMaterials.slice(0, 10)
        });
      }
      
    } catch (error) {
      console.error('检查新材料失败:', error);
    }
  },

  // 跳转到布置作业页面
  goToHomework() {
    wx.navigateTo({
      url: '/pages/teacher-homework/index'
    });
  },

  // 加载材料数据
  async loadMaterialsData() {
    try {
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      // 从本地存储加载数据
      const materials = wx.getStorageSync(`teacher_materials_${teacherId}`) || [];
      const rollcallData = wx.getStorageSync(`rollcall_data_${teacherId}`) || this.data.rollcallData;
      const testData = wx.getStorageSync(`test_data_${teacherId}`) || this.data.testData;
      const materialLibrary = wx.getStorageSync(`material_library_${teacherId}`) || this.data.materialLibrary;
      
      // 加载作业数据用于点名器
      await this.loadAssignmentData();
      
      // 基于实际作业数据生成配套材料列表
      const realMaterials = await this.generateMaterialsFromAssignments(teacherId);
      console.log('生成的配套材料:', realMaterials.length, '个');
      
      // 如果是从作业发布页面跳转过来，优先显示新作业的材料
      if (this.data.fromHomework && this.data.homeworkId) {
        console.log('从作业发布页面跳转，查找作业ID:', this.data.homeworkId);
        const newMaterials = realMaterials.filter(m => 
          m.assignmentId === this.data.homeworkId
        );
        console.log('找到的新作业材料:', newMaterials.length, '个');
        
        if (newMaterials.length > 0) {
          console.log('显示新作业材料:', newMaterials.map(m => m.title));
          this.setData({
            recentMaterials: newMaterials,
            rollcallData: rollcallData,
            testData: testData,
            materialLibrary: materialLibrary
          });
          console.log('✅ 已设置新作业材料到界面，数量:', newMaterials.length);
          return;
        } else {
          console.log('未找到新作业材料，显示所有材料');
        }
      }
      
      // 显示所有生成的配套材料，如果没有则使用默认数据
      console.log('设置材料数据:', realMaterials.length > 0 ? realMaterials.map(m => m.title) : '使用默认数据');
      this.setData({
        recentMaterials: realMaterials.length > 0 ? realMaterials : this.data.recentMaterials,
        rollcallData: rollcallData,
        testData: testData,
        materialLibrary: materialLibrary
      });
      
      // 确保新增的数据不被覆盖
      this.setData({
        comprehensiveTestData: this.data.comprehensiveTestData,
        showTestConfig: this.data.showTestConfig,
        testTitle: this.data.testTitle,
        testRemark: this.data.testRemark,
        isGeneratingTest: this.data.isGeneratingTest,
        generationProgress: this.data.generationProgress,
        generationStatus: this.data.generationStatus,
        showFeedbackModal: this.data.showFeedbackModal,
        feedbackContent: this.data.feedbackContent,
        cloudBackupStatus: this.data.cloudBackupStatus,
        lastBackupTime: this.data.lastBackupTime,
        autoBackupEnabled: this.data.autoBackupEnabled,
        showBackupModal: this.data.showBackupModal,
        backupHistory: this.data.backupHistory
      });
      
    } catch (error) {
      console.error('加载材料数据失败:', error);
    }
  },

  // 基于实际作业数据生成配套材料
  async generateMaterialsFromAssignments(teacherId) {
    try {
      // 获取教师发布的作业数据 - 修复：同时从两个存储key读取
      const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
      const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
      
      // 合并两种类型的作业数据
      const allAssignments = [...homeworks, ...assignments];
      console.log('从存储加载的作业数据:', {
        homeworks: homeworks.length,
        assignments: assignments.length,
        total: allAssignments.length
      });
      
      // 详细调试信息
      console.log('homeworks详情:', homeworks);
      console.log('assignments详情:', assignments);
      console.log('合并后的allAssignments:', allAssignments);
      
      // 如果没有作业数据，返回空数组
      if (allAssignments.length === 0) {
        console.log('没有找到作业数据，返回空材料列表');
        return [];
      }
      const materials = [];
      
      // 为每个作业生成学案材料（只保留学案功能）
      for (const assignment of allAssignments) {
        console.log('处理作业:', assignment.title, '状态:', assignment.status);
        
        // 检查作业状态，包括新发布的作业
        if (assignment.status === 'completed' || assignment.status === 'published' || assignment.status === 'active' || !assignment.status) {
          // 计算作业统计信息
          const stats = await this.calculateAssignmentStats(assignment);
          
          // 生成学案材料（只保留word格式）
          const assignmentId = assignment._id || assignment.id;
          const wordMaterial = {
            id: `mat_word_${assignmentId}`,
            title: `${assignment.title}综合练习学案`,
            type: 'word',
            createdAt: assignment.createdAt || new Date().toISOString(),
            downloadCount: assignment.downloadCount || 0,
            classAccuracy: stats.averageAccuracy,
            status: 'pending', // 新作业材料状态为待生成
            assignmentId: assignmentId,
            assignmentTitle: assignment.title,
            questionCount: assignment.totalQuestions || assignment.questionCount || 0
          };
          
          materials.push(wordMaterial);
          console.log('生成学案材料:', wordMaterial.title);
        } else {
          console.log('跳过作业:', assignment.title, '状态不符合:', assignment.status);
        }
      }
      
      console.log('总共生成材料数量:', materials.length);
      console.log('材料列表:', materials.map(m => m.title));
      
      // 按创建时间排序，最新的在前
      materials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return materials.slice(0, 10); // 只显示最近10个材料
      
    } catch (error) {
      console.error('生成配套材料失败:', error);
      return [];
    }
  },

  // 计算作业统计信息
  async calculateAssignmentStats(assignment) {
    try {
      // 获取作业结果数据 - 修复：使用正确的ID字段
      const assignmentId = assignment._id || assignment.id;
      const results = wx.getStorageSync(`assignment_results_${assignmentId}`) || [];
      
      if (results.length === 0) {
        return {
          averageAccuracy: 0,
          totalStudents: 0,
          completedStudents: 0
        };
      }
      
      // 计算平均正确率
      const totalAccuracy = results.reduce((sum, result) => sum + (result.accuracy || 0), 0);
      const averageAccuracy = Math.round(totalAccuracy / results.length);
      
      return {
        averageAccuracy: averageAccuracy,
        totalStudents: assignment.studentCount || 0,
        completedStudents: results.length
      };
      
    } catch (error) {
      console.error('计算作业统计失败:', error);
      return {
        averageAccuracy: 0,
        totalStudents: 0,
        completedStudents: 0
      };
    }
  },

  // 加载作业数据
  async loadAssignmentData() {
    try {
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
      const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
      const allAssignments = [...homeworks, ...assignments];
      
      if (allAssignments.length > 0) {
        // 选择最新的活跃作业
        const activeAssignment = allAssignments.find(a => a.status === 'active') || allAssignments[0];
        if (activeAssignment) {
          await this.loadAssignmentQuestions(activeAssignment);
        }
      } else {
        // 如果没有作业数据，加载默认的语法填空题
        await this.loadDefaultQuestions();
      }
    } catch (error) {
      console.error('加载作业数据失败:', error);
      // 加载默认题目
      await this.loadDefaultQuestions();
    }
  },

  // 加载作业题目
  async loadAssignmentQuestions(assignment) {
    try {
      // 从语法填空题数据中获取题目
      const writingQuestions = require('../../writing_exercise_questions.js').writingExerciseQuestions;
      
      // 根据作业的语法点筛选题目
      const allQuestions = [];
      Object.values(writingQuestions).forEach(categoryQuestions => {
        allQuestions.push(...categoryQuestions);
      });
      
      // 随机选择题目
      const selectedQuestions = this.shuffleArray(allQuestions).slice(0, 10);
      
      this.setData({
        'rollcallData.currentAssignment': assignment,
        'rollcallData.totalQuestions': selectedQuestions.length,
        'rollcallData.currentQuestion': 1,
        'rollcallData.currentQuestionData': selectedQuestions[0],
        questionList: selectedQuestions.map((q, index) => ({
          id: index + 1,
          title: q.category + '-' + q.subCategory,
          status: index === 0 ? 'current' : 'pending'
        }))
      });
      
    } catch (error) {
      console.error('加载作业题目失败:', error);
      await this.loadDefaultQuestions();
    }
  },

  // 加载默认题目
  async loadDefaultQuestions() {
    try {
      const writingQuestions = require('../../writing_exercise_questions.js').writingExerciseQuestions;
      
      // 选择一些默认题目
      const defaultQuestions = [
        writingQuestions.pronoun_001[0],
        writingQuestions.noun_001[0],
        writingQuestions.present_participle_001[0],
        writingQuestions.tense_writing_001[0],
        writingQuestions.voice_writing_001[0]
      ];
      
      this.setData({
        'rollcallData.totalQuestions': defaultQuestions.length,
        'rollcallData.currentQuestion': 1,
        'rollcallData.currentQuestionData': defaultQuestions[0],
        questionList: defaultQuestions.map((q, index) => ({
          id: index + 1,
          title: q.category + '-' + q.subCategory,
          status: index === 0 ? 'current' : 'pending'
        }))
      });
      
    } catch (error) {
      console.error('加载默认题目失败:', error);
    }
  },

  // 数组洗牌函数
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
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
      
      // 弹出拓展题数量选择器
      wx.showActionSheet({
        itemList: ['不生成拓展题', '每题1道拓展题', '每题2道拓展题', '每题3道拓展题'],
        success: async (res) => {
          const variantCount = res.tapIndex; // 0, 1, 2, 3
          
          wx.showLoading({
            title: '正在生成学案...',
            mask: true
          });
          
          try {
            // 生成无答案版本的学案内容（Markdown）
            const markdownContent = await this.generateLocalWordContentWithoutAnswers(material, variantCount);
            const plainTextContent = stripMarkdown(markdownContent);
            
            wx.hideLoading();
            
            // 显示学案内容（可以选择复制为纯文本或预览）
            wx.showModal({
              title: '学生学案生成成功',
              content: `已生成学生练习学案（无答案），每题${variantCount}道拓展题。是否复制为纯文本到剪贴板？`,
              confirmText: '复制',
              cancelText: '预览',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  // 复制纯文本到剪贴板
                  wx.setClipboardData({
                    data: plainTextContent,
                    success: () => {
                      wx.showToast({
                        title: '已复制到剪贴板',
                        icon: 'success'
                      });
                    }
                  });
                } else if (modalRes.cancel) {
                  // 显示预览（保留基本结构，可视需要选择 markdownContent 或 plainTextContent）
                  wx.showModal({
                    title: '学生学案预览',
                    content: plainTextContent.substring(0, 500) + '...\n\n（内容过长，已截断）',
                    showCancel: false
                  });
                }
              }
            });
          } catch (error) {
            wx.hideLoading();
            console.error('生成学生学案失败:', error);
            wx.showToast({
              title: '生成失败',
              icon: 'error'
            });
          }
        }
      });
      
    } catch (error) {
      console.error('生成材料失败:', error);
      wx.showToast({
        title: '生成失败',
        icon: 'error'
      });
    }
  },

  // 模拟材料生成过程
  async simulateMaterialGeneration(materialId, format) {
    return new Promise((resolve) => {
      // 模拟生成进度
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        
        // 更新材料状态
        const updatedMaterials = this.data.recentMaterials.map(m => {
          if (m.id === materialId) {
            return { 
              ...m, 
              status: progress < 100 ? 'generating' : 'completed',
              generationProgress: progress
            };
          }
          return m;
        });
        
        this.setData({ recentMaterials: updatedMaterials });
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // 更新本地存储
          const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
          const existingMaterials = wx.getStorageSync(`teacher_materials_${teacherId}`) || [];
          const materialIndex = existingMaterials.findIndex(m => m.id === materialId);
          if (materialIndex >= 0) {
            existingMaterials[materialIndex] = {
              ...existingMaterials[materialIndex],
              status: 'completed',
              generationProgress: 100
            };
            wx.setStorageSync(`teacher_materials_${teacherId}`, existingMaterials);
          }
          
          wx.showToast({
            title: '材料生成完成',
            icon: 'success'
          });
          
          resolve();
        }
      }, 500);
    });
  },

  // 下载材料
  async downloadMaterial(e) {
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
      // 显示下载进度
      wx.showLoading({
        title: '正在生成文件...',
        mask: true
      });

      // 直接使用本地下载方案（云函数暂未部署）
      console.log('使用本地下载方案');
      await this.downloadMaterialLocally(material);

    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '下载失败',
        icon: 'error'
      });
      console.error('下载材料失败:', error);
    }
  },

  // 本地下载备用方案（含答案版本-教师用）
  async downloadMaterialLocally(material) {
    // 弹出拓展题数量选择器
    wx.showActionSheet({
      itemList: ['不生成拓展题', '每题1道拓展题', '每题2道拓展题', '每题3道拓展题'],
      success: async (res) => {
        const variantCount = res.tapIndex; // 0, 1, 2, 3
        
        try {
          // 生成文件内容（只支持学案格式）
          let content;
          let fileName;
          
          if (material.type === 'word') {
            content = await this.generateLocalWordContentWithAnswers(material, variantCount);
            fileName = `${material.title}_教师版_${Date.now()}.txt`;
          } else {
            wx.showToast({
              title: '不支持的文件格式',
              icon: 'error'
            });
            return;
          }

          // 使用文件系统API保存文件
          const fs = wx.getFileSystemManager();
          const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
          
          try {
            // 写入文件到本地存储
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('文件写入成功:', filePath);
          
            wx.hideLoading();
          
            // 更新下载次数
            this.updateDownloadCount(material.id);
            
            // 尝试打开文件
            wx.openDocument({
              filePath: filePath,
              fileType: 'txt',
              showMenu: true,
              success: () => {
                console.log('文件打开成功');
                wx.showToast({
                  title: '教师学案已生成',
                  icon: 'success'
                });
              },
              fail: (openErr) => {
                console.log('文件打开失败，尝试其他方式:', openErr);
                
                // 如果打开失败，提供分享或复制选项
                wx.showModal({
                  title: '文件已生成',
                  content: '文件已保存到本地，但无法自动打开。是否复制内容到剪贴板？',
                  confirmText: '复制内容',
                  cancelText: '我知道了',
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      wx.setClipboardData({
                        data: content,
                        success: () => {
                          wx.showToast({
                            title: '已复制到剪贴板',
                            icon: 'success'
                          });
                        }
                      });
                    } else {
                      wx.showToast({
                        title: '文件已保存',
                        icon: 'success'
                      });
                    }
                  }
                });
              }
            });
          } catch (writeErr) {
            console.error('文件写入失败，尝试复制到剪贴板:', writeErr);
            
            // 如果写入失败，直接复制到剪贴板
            wx.setClipboardData({
              data: content,
              success: () => {
                wx.hideLoading();
                wx.showModal({
                  title: '内容已复制到剪贴板',
                  content: '由于存储限制，文件内容已复制到剪贴板。您可以粘贴到记事本或其他应用中保存。',
                  showCancel: false,
                  confirmText: '知道了'
                });
                this.updateDownloadCount(material.id);
              },
              fail: (clipErr) => {
                wx.hideLoading();
                wx.showModal({
                  title: '保存失败',
                  content: '文件保存和复制都失败，请检查存储权限或稍后重试。错误信息：' + (clipErr.errMsg || '未知错误'),
                  showCancel: false,
                  confirmText: '确定'
                });
                console.error('写入和复制都失败:', writeErr, clipErr);
              }
            });
          }
        } catch (error) {
          wx.hideLoading();
          wx.showToast({
            title: '生成文件失败',
            icon: 'error'
          });
          console.error('本地下载失败:', error);
        }
      }
    });
  },

  // PPT内容生成函数已删除（已移除PPT功能，只保留学案功能）

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
        title: '正在生成学案...',
        mask: true
      });

      // 生成学案内容
      const content = this.generateLocalWordContent(material);
      const fileName = `${material.title}_${Date.now()}.txt`;
      
      // 保存文件到本地
      const fs = wx.getFileSystemManager();
      const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
      
      fs.writeFileSync(filePath, content, 'utf8');
      
      wx.hideLoading();
      
      // 显示分享选项
      wx.showActionSheet({
        itemList: ['分享给微信好友', '保存到手机', '复制文本内容'],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 分享给微信好友
            this.shareToWechatFriend(material, filePath, content);
          } else if (res.tapIndex === 1) {
            // 保存到手机
            this.saveToPhone(filePath, fileName);
          } else if (res.tapIndex === 2) {
            // 复制文本内容
            wx.setClipboardData({
              data: content,
              success: () => {
                wx.showToast({
                  title: '内容已复制',
                  icon: 'success'
                });
              }
            });
          }
        }
      });
      
    } catch (error) {
      wx.hideLoading();
      console.error('分享学案失败:', error);
      wx.showToast({
        title: '分享失败',
        icon: 'error'
      });
    }
  },

  // 分享给微信好友
  shareToWechatFriend(material, filePath, content) {
    // 尝试打开文档
    wx.openDocument({
      filePath: filePath,
      fileType: 'txt',
      showMenu: true,
      success: () => {
        wx.showToast({
          title: '请在打开的文档中点击右上角分享',
          icon: 'none',
          duration: 3000
        });
      },
      fail: (err) => {
        console.log('打开文档失败，提供其他分享方式:', err);
        
        // 如果无法打开文档，提供转发小程序卡片的选项
        wx.showModal({
          title: '分享学案',
          content: '是否通过小程序卡片分享此学案？接收方可在小程序中查看完整内容。',
          confirmText: '分享卡片',
          cancelText: '复制内容',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 设置分享信息
              this.setData({
                shareInfo: {
                  materialId: material.id,
                  title: material.title,
                  content: content
                }
              });
              
              wx.showToast({
                title: '请点击右上角分享按钮',
                icon: 'none',
                duration: 2000
              });
            } else {
              // 复制内容
              wx.setClipboardData({
                data: content,
                success: () => {
                  wx.showToast({
                    title: '内容已复制，可在微信中粘贴分享',
                    icon: 'success',
                    duration: 2000
                  });
                }
              });
            }
          }
        });
      }
    });
  },

  // 保存到手机
  saveToPhone(filePath, fileName) {
    wx.saveFile({
      tempFilePath: filePath,
      success: (res) => {
        const savedFilePath = res.savedFilePath;
        wx.showModal({
          title: '保存成功',
          content: `文件已保存，文件名：${fileName}`,
          confirmText: '打开文件',
          cancelText: '知道了',
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.openDocument({
                filePath: savedFilePath,
                fileType: 'txt',
                showMenu: true,
                success: () => {
                  console.log('文件打开成功');
                },
                fail: (err) => {
                  console.error('文件打开失败:', err);
                  wx.showToast({
                    title: '文件已保存但无法打开',
                    icon: 'none'
                  });
                }
              });
            }
          }
        });
      },
      fail: (err) => {
        console.error('保存文件失败:', err);
        wx.showToast({
          title: '保存失败',
          icon: 'error'
        });
      }
    });
  },

  // 页面分享配置（用于小程序卡片分享）
  onShareAppMessage() {
    const { shareInfo } = this.data;
    
    if (shareInfo) {
      return {
        title: `【学案分享】${shareInfo.title}`,
        path: `/pages/teacher-materials/index?shareId=${shareInfo.materialId}`,
        imageUrl: '' // 可以设置分享图片
      };
    }
    
    return {
      title: '教学学案分享',
      path: '/pages/teacher-materials/index'
    };
  },

  // 生成本地Word内容（含答案版本 - 教师用）
  async generateLocalWordContentWithAnswers(material, variantCountPerQuestion = 2) {
    // 获取关联的作业数据
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
    const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
    const allAssignments = [...homeworks, ...assignments];
    const assignment = allAssignments.find(a => (a._id || a.id) === material.assignmentId);
    
    console.log('生成教师学案（含答案），作业数据:', assignment);
    
    let practiceContent = '';
    let knowledgePoints = [];
    
    // ✅ 使用保存的完整题目（教师版）
    if (assignment && assignment.questions && assignment.questions.length > 0) {
      console.log('✅ 使用作业中保存的题目（教师版），数量:', assignment.questions.length);
      
      let totalVariantCount = 0;
      
      for (let i = 0; i < assignment.questions.length; i++) {
        const question = assignment.questions[i];
        
        // 原题（含答案和解析）
        practiceContent += `#### 练习${i + 1}：${question.grammarPoint || question.category}
**题目**: ${question.text}

**答案**: ${question.answer}
**解析**: ${this.simplifyAnalysis(question.analysis || question.explanation || '请参考语法规则')}

`;
        
        const grammarPoint = question.grammarPoint || question.category;
        if (grammarPoint && !knowledgePoints.includes(grammarPoint)) {
          knowledgePoints.push(grammarPoint);
        }
        
        // 紧跟该题的拓展题（如果有）
        if (variantCountPerQuestion > 0) {
          try {
            const variants = await this.getVariantQuestions(question, variantCountPerQuestion);
            
            if (variants && variants.length > 0) {
              practiceContent += `
**【拓展练习】**

`;
              variants.forEach((variant, vIndex) => {
                practiceContent += `${i + 1}-${vIndex + 1}. ${variant.text}
   答案：${variant.answer}
   ${this.simplifyAnalysis(variant.analysis || variant.explanation || '')}

`;
                totalVariantCount++;
              });
              
              practiceContent += `
`;
            }
          } catch (error) {
            console.error(`   获取练习${i + 1}的拓展题失败:`, error);
          }
        }
        
        // 题目之间添加分隔
        practiceContent += `---

`;
      }
      
      console.log(`✅ 共加载 ${totalVariantCount} 道拓展题（教师版）`);
      
    } else {
      // 如果没有题目数据，显示提示
      console.warn('⚠️ 作业中没有保存题目数据');
      practiceContent = `暂无题目数据，请确保作业已正确保存题目信息。

`;
      knowledgePoints = ['暂无数据'];
    }
    
    return `# ${material.title}

## 教师教学学案（含答案）

### 班级表现分析
本次练习的班级正确率为 **${material.classAccuracy}%**，整体表现${material.classAccuracy >= 80 ? '良好' : material.classAccuracy >= 60 ? '一般' : '需要加强'}。

**作业信息**:
- 作业类型: ${assignment ? (assignment.type === 'gaokao' ? '高考配比练习' : assignment.type === 'topic' ? '专题练习' : '自选练习') : '语法练习'}
- 考查知识点: ${knowledgePoints.join('、')}
- 题目数量: ${material.questionCount || 0}题
- 拓展题数量: ${variantCountPerQuestion}题/原题

### 练习内容

${practiceContent}

---
**生成时间**: ${new Date().toLocaleString('zh-CN')}
**班级正确率**: ${material.classAccuracy}%
**作业标题**: ${material.assignmentTitle || '语法练习'}
**材料类型**: 教学学案（教师版）
**作业ID**: ${material.assignmentId}`;
  },

  // 简化解析内容（避免过长）
  simplifyAnalysis(analysis) {
    if (!analysis) return '';
    
    // 如果解析超过150字，截取并添加省略号
    if (analysis.length > 150) {
      return analysis.substring(0, 150) + '...';
    }
    
    return analysis;
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
    
    let practiceContent = '';
    let knowledgePoints = [];
    
    // ✅ 使用保存的完整题目（学生版）
    if (assignment && assignment.questions && assignment.questions.length > 0) {
      console.log('✅ 使用作业中保存的题目（学生版），数量:', assignment.questions.length);
      
      let totalVariantCount = 0;
      
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
        
        // 紧跟该题的拓展题（如果有）
        if (variantCountPerQuestion > 0) {
          try {
            const variants = await this.getVariantQuestions(question, variantCountPerQuestion);
            
            if (variants && variants.length > 0) {
              practiceContent += `
**【拓展练习】**

`;
              variants.forEach((variant, vIndex) => {
                practiceContent += `${i + 1}-${vIndex + 1}. ${variant.text}

`;
                totalVariantCount++;
              });
              
              practiceContent += `
`;
            }
          } catch (error) {
            console.error(`   获取练习${i + 1}的拓展题失败:`, error);
          }
        }
        
        // 题目之间添加分隔
        practiceContent += `---

`;
      }
      
      console.log(`✅ 共加载 ${totalVariantCount} 道拓展题（学生版）`);
      
    } else {
      // 如果没有题目数据，显示提示
      console.warn('⚠️ 作业中没有保存题目数据');
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

  // 开始点名器
  startRollcall() {
    this.setData({ showRollcallModal: true });
  },

  // 关闭点名器
  closeRollcallModal() {
    this.setData({ showRollcallModal: false });
  },

  // 点名器操作
  rollcallAction(e) {
    const action = e.currentTarget.dataset.action;
    const studentId = e.currentTarget.dataset.studentId;
    
    switch (action) {
      case 'next':
        this.nextQuestion();
        break;
      case 'previous':
        this.previousQuestion();
        break;
      case 'mark':
        this.markStudentAnswer(studentId);
        break;
      case 'random':
        this.randomCall();
        break;
    }
  },

  // 下一题
  nextQuestion() {
    const { currentQuestion, totalQuestions } = this.data.rollcallData;
    if (currentQuestion < totalQuestions) {
      const newQuestionIndex = currentQuestion;
      const questionData = this.getCurrentQuestionData(newQuestionIndex);
      
      this.setData({
        'rollcallData.currentQuestion': currentQuestion + 1,
        'rollcallData.currentQuestionData': questionData
      });
      
      // 更新题目列表状态
      this.updateQuestionListStatus(currentQuestion, 'completed');
      this.updateQuestionListStatus(currentQuestion + 1, 'current');
    }
  },

  // 上一题
  previousQuestion() {
    const { currentQuestion } = this.data.rollcallData;
    if (currentQuestion > 1) {
      const newQuestionIndex = currentQuestion - 2;
      const questionData = this.getCurrentQuestionData(newQuestionIndex);
      
      this.setData({
        'rollcallData.currentQuestion': currentQuestion - 1,
        'rollcallData.currentQuestionData': questionData
      });
      
      // 更新题目列表状态
      this.updateQuestionListStatus(currentQuestion, 'pending');
      this.updateQuestionListStatus(currentQuestion - 1, 'current');
    }
  },

  // 获取当前题目数据
  getCurrentQuestionData(questionIndex) {
    const questionList = this.data.questionList;
    if (questionList && questionList[questionIndex]) {
      // 从题目列表中获取对应的语法填空题数据
      const questionTitle = questionList[questionIndex].title;
      const writingQuestions = require('../../writing_exercise_questions.js').writingExerciseQuestions;
      
      // 根据题目标题查找对应的题目数据
      for (const categoryQuestions of Object.values(writingQuestions)) {
        for (const question of categoryQuestions) {
          if (questionTitle.includes(question.category) && questionTitle.includes(question.subCategory)) {
            return question;
          }
        }
      }
    }
    
    // 如果没有找到，返回默认题目
    const writingQuestions = require('../../writing_exercise_questions.js').writingExerciseQuestions;
    return writingQuestions.pronoun_001[0];
  },

  // 更新题目列表状态
  updateQuestionListStatus(questionId, status) {
    const questionList = this.data.questionList.map(q => {
      if (q.id === questionId) {
        return { ...q, status };
      }
      return q;
    });
    
    this.setData({ questionList });
  },

  // 标记学生答题
  markStudentAnswer(e) {
    const studentId = e.currentTarget.dataset.studentId;
    const action = e.currentTarget.dataset.action;
    
    let newStatus;
    if (action === 'mark-correct') {
      newStatus = 'correct';
    } else if (action === 'mark-wrong') {
      newStatus = 'wrong';
    } else {
      // 兼容旧的点击切换逻辑
      newStatus = this.data.rollcallData.students.find(s => s.id === studentId)?.status === 'correct' ? 'wrong' : 'correct';
    }
    
    const students = this.data.rollcallData.students.map(student => {
      if (student.id === studentId) {
        return { 
          ...student, 
          status: newStatus,
          isMarked: true
        };
      }
      return student;
    });
    
    this.setData({
      'rollcallData.students': students
    });
    
    this.updateRollcallStatistics();
    
    // 显示标记成功的提示
    const student = students.find(s => s.id === studentId);
    wx.showToast({
      title: `${student.name} 标记为${newStatus === 'correct' ? '正确' : '错误'}`,
      icon: 'success',
      duration: 1500
    });
  },

  // 随机点名
  randomCall() {
    const students = this.data.rollcallData.students;
    const randomIndex = Math.floor(Math.random() * students.length);
    const selectedStudent = students[randomIndex];
    
    wx.showModal({
      title: '随机点名',
      content: `请 ${selectedStudent.name} 回答问题`,
      showCancel: false
    });
  },

  // 更新点名统计
  updateRollcallStatistics() {
    const students = this.data.rollcallData.students;
    const answeredStudents = students.filter(s => s.answerTime !== '00:00').length;
    const markedStudents = students.filter(s => s.isMarked).length;
    const correctCount = students.filter(s => s.status === 'correct').length;
    const wrongCount = students.filter(s => s.status === 'wrong').length;
    const accuracy = markedStudents > 0 ? Math.round((correctCount / markedStudents) * 100) : 0;
    
    this.setData({
      'rollcallData.statistics.answeredStudents': answeredStudents,
      'rollcallData.statistics.markedStudents': markedStudents,
      'rollcallData.statistics.correctCount': correctCount,
      'rollcallData.statistics.wrongCount': wrongCount,
      'rollcallData.statistics.accuracy': accuracy
    });
  },

  // 开始摸底测试
  startTest(e) {
    const testId = e.currentTarget.dataset.id;
    this.setData({ showTestModal: true });
  },

  // 关闭摸底测试
  closeTestModal() {
    this.setData({ showTestModal: false });
  },

  // 创建摸底测试
  createTest(e) {
    const testId = e.currentTarget.dataset.id;
    const test = this.data.testData.availableTests.find(t => t.id === testId);
    
    if (test) {
      wx.showModal({
        title: '创建摸底测试',
        content: `测试名称：${test.title}\n题目数量：${test.questionCount}题\n预计时间：${test.estimatedTime}`,
        confirmText: '开始创建',
        success: (res) => {
          if (res.confirm) {
            this.generateTest(test);
          }
        }
      });
    }
  },

  // 生成摸底测试
  async generateTest(test) {
    try {
      this.setData({ loading: true });
      
      // 模拟生成测试
      setTimeout(() => {
        this.setData({ loading: false });
        wx.showToast({
          title: '摸底测试创建成功',
          icon: 'success'
        });
        this.closeTestModal();
      }, 2000);
      
    } catch (error) {
      console.error('生成摸底测试失败:', error);
      this.setData({ loading: false });
    }
  },

  // 查看测试结果
  viewTestResult(e) {
    const resultId = e.currentTarget.dataset.id;
    const result = this.data.testData.testResults.find(r => r.id === resultId);
    
    if (result) {
      wx.showModal({
        title: '测试结果详情',
        content: `班级：${result.className}\n测试日期：${result.testDate}\n平均正确率：${result.averageAccuracy}%\n优势语法点：${result.topGrammarPoints.join('、')}\n薄弱语法点：${result.weakGrammarPoints.join('、')}`,
        showCancel: false
      });
    }
  },

  // 使用模板
  useTemplate(e) {
    const templateId = e.currentTarget.dataset.id;
    const template = this.data.materialLibrary.templates.find(t => t.id === templateId);
    
    if (template) {
      wx.showModal({
        title: '使用模板',
        content: `模板名称：${template.name}\n类型：${template.type.toUpperCase()}\n使用次数：${template.downloadCount}`,
        confirmText: '使用',
        success: (res) => {
          if (res.confirm) {
            this.applyTemplate(template);
          }
        }
      });
    }
  },

  // 应用模板
  applyTemplate(template) {
    // 更新模板使用次数
    const templates = this.data.materialLibrary.templates.map(t => {
      if (t.id === template.id) {
        return { ...t, downloadCount: t.downloadCount + 1, lastUsed: new Date().toISOString().slice(0, 10) };
      }
      return t;
    });
    
    this.setData({
      'materialLibrary.templates': templates
    });
    
    wx.showToast({
      title: '模板应用成功',
      icon: 'success'
    });
  },

  // 下载历史材料
  downloadHistoryMaterial(e) {
    const materialId = e.currentTarget.dataset.id;
    const material = this.data.materialLibrary.history.find(m => m.id === materialId);
    
    if (material) {
      wx.showModal({
        title: '下载材料',
        content: `文件名：${material.name}\n格式：${material.type.toUpperCase()}\n大小：${material.size}`,
        showCancel: false
      });
    }
  },

  // 查看作业详情
  viewAssignmentDetail(e) {
    const materialId = e.currentTarget.dataset.id;
    const material = this.data.recentMaterials.find(m => m.id === materialId);
    
    if (!material) {
      wx.showToast({
        title: '材料不存在',
        icon: 'error'
      });
      return;
    }
    
    // 获取关联的作业数据 - 修复：同时从两个存储key查找
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
    const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
    const allAssignments = [...homeworks, ...assignments];
    const assignment = allAssignments.find(a => (a._id || a.id) === material.assignmentId);
    
    if (!assignment) {
      wx.showToast({
        title: '关联作业不存在',
        icon: 'error'
      });
      return;
    }
    
    // 获取作业结果统计
    const results = wx.getStorageSync(`assignment_results_${assignment.id}`) || [];
    
    const assignmentDetail = {
      title: assignment.title,
      remark: assignment.remark || '基于学生答题情况自动生成的配套材料',
      deadline: assignment.deadline || '2024-12-25 23:59',
      completedCount: results.length,
      totalCount: assignment.studentCount || 0,
      averageAccuracy: material.classAccuracy,
      createdAt: assignment.createdAt || material.createdAt,
      questionCount: assignment.questions ? assignment.questions.length : 0,
      category: assignment.category || '语法练习'
    };
    
    this.setData({
      selectedAssignment: assignmentDetail,
      showAssignmentDetail: true
    });
  },

  // 关闭作业详情
  closeAssignmentDetail() {
    this.setData({
      showAssignmentDetail: false,
      selectedAssignment: null
    });
  },

  // 防止弹窗内容点击时关闭弹窗
  preventClose() {
    // 空方法，用于阻止事件冒泡
  },

  // 显示题目列表
  showQuestionList() {
    this.setData({ showQuestionList: true });
  },

  // 关闭题目列表
  closeQuestionList() {
    this.setData({ showQuestionList: false });
  },

  // 跳转到指定题目
  jumpToQuestion(e) {
    const questionId = parseInt(e.currentTarget.dataset.questionId);
    const questionIndex = questionId - 1;
    const questionData = this.getCurrentQuestionData(questionIndex);
    
    // 更新当前题目状态
    this.updateQuestionListStatus(this.data.rollcallData.currentQuestion, 'pending');
    this.updateQuestionListStatus(questionId, 'current');
    
    this.setData({
      'rollcallData.currentQuestion': questionId,
      'rollcallData.currentQuestionData': questionData,
      showQuestionList: false
    });
    console.log('跳转到第', questionId, '题');
  },

  // 上一题
  previousQuestion() {
    const current = this.data.rollcallData.currentQuestion;
    if (current > 1) {
      this.setData({
        'rollcallData.currentQuestion': current - 1
      });
    }
  },

  // 下一题
  nextQuestion() {
    const current = this.data.rollcallData.currentQuestion;
    const total = this.data.rollcallData.totalQuestions;
    if (current < total) {
      this.setData({
        'rollcallData.currentQuestion': current + 1
      });
    }
  },

  // 开始随机点名
  startRandomCall() {
    const students = this.data.rollcallData.students;
    if (students.length === 0) {
      wx.showToast({
        title: '没有学生数据',
        icon: 'none'
      });
      return;
    }

    this.setData({ isRandomCalling: true });
    
    // 随机滚动效果
    this.randomCallTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * students.length);
      this.setData({
        selectedStudent: students[randomIndex]
      });
    }, 200);
  },

  // 停止随机点名
  stopRandomCall() {
    if (this.randomCallTimer) {
      clearInterval(this.randomCallTimer);
      this.randomCallTimer = null;
      this.setData({
        isRandomCalling: false
      });
      
      wx.showToast({
        title: `选中: ${this.data.selectedStudent.name}`,
        icon: 'success'
      });
    }
  },

  // 导出统计结果
  exportResults() {
    const results = this.data.statisticsResults;
    let content = '知识点统计结果\n\n';
    
    results.forEach(item => {
      content += `知识点: ${item.knowledgePoint}（作业正确率${item.homeworkAccuracy}% 讲评正确率${item.explanationAccuracy}%）\n`;
    });
    
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({
          title: '结果已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  // 切换测试配置显示
  toggleTestConfig() {
    this.setData({
      showTestConfig: !this.data.showTestConfig
    });
  },

  // 设置测试标题
  setTestTitle(e) {
    this.setData({
      testTitle: e.detail.value
    });
  },

  // 设置测试备注
  setTestRemark(e) {
    this.setData({
      testRemark: e.detail.value
    });
  },

  // 生成全语法点摸底测试
  generateComprehensiveTest() {
    this.setData({
      isGeneratingTest: true,
      generationProgress: 0,
      generationStatus: '正在准备测试...'
    });

    // 模拟生成进度
    const progressInterval = setInterval(() => {
      const currentProgress = this.data.generationProgress;
      if (currentProgress < 100) {
        const newProgress = Math.min(currentProgress + Math.random() * 20, 100);
        let status = '正在准备测试...';
        
        if (newProgress > 20) status = '正在收集语法点...';
        if (newProgress > 50) status = '正在随机选题...';
        if (newProgress > 80) status = '正在生成测试...';
        if (newProgress >= 100) status = '测试生成完成！';

        this.setData({
          generationProgress: newProgress,
          generationStatus: status
        });

        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            this.publishComprehensiveTest();
          }, 1000);
        }
      }
    }, 200);
  },

  // 发布摸底测试
  publishComprehensiveTest() {
    this.setData({
      isGeneratingTest: false,
      showFeedbackModal: true
    });

    // 模拟发布测试
    const testData = {
      id: 'comprehensive_test_' + Date.now(),
      title: this.data.testTitle,
      remark: this.data.testRemark,
      questionCount: this.data.comprehensiveTestData.estimatedQuestions,
      createdAt: new Date().toISOString()
    };

    // 保存到本地存储
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const tests = wx.getStorageSync(`comprehensive_tests_${teacherId}`) || [];
    tests.push(testData);
    wx.setStorageSync(`comprehensive_tests_${teacherId}`, tests);

    console.log('摸底测试已发布:', testData);
  },

  // 提交反馈
  submitFeedback() {
    if (!this.data.feedbackContent.trim()) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none'
      });
      return;
    }

    // 模拟提交反馈
    const feedback = {
      id: 'feedback_' + Date.now(),
      content: this.data.feedbackContent,
      submittedAt: new Date().toISOString()
    };

    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const feedbacks = wx.getStorageSync(`user_feedbacks_${teacherId}`) || [];
    feedbacks.push(feedback);
    wx.setStorageSync(`user_feedbacks_${teacherId}`, feedbacks);

    wx.showToast({
      title: '反馈提交成功',
      icon: 'success'
    });

    this.setData({
      showFeedbackModal: false,
      feedbackContent: ''
    });
  },

  // 关闭反馈弹窗
  closeFeedbackModal() {
    this.setData({
      showFeedbackModal: false,
      feedbackContent: ''
    });
  },

  // 设置反馈内容
  setFeedbackContent(e) {
    this.setData({
      feedbackContent: e.detail.value
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
  },

  // 初始化云端备份
  async initCloudBackup() {
    this.setData({ cloudBackupStatus: 'connecting' });
    
    try {
      // 检查云开发环境是否可用
      if (!wx.cloud) {
        console.log('云开发不可用，将使用本地存储');
        this.setData({ 
          cloudBackupStatus: 'disconnected',
          lastBackupTime: wx.getStorageSync('lastBackupTime')
        });
        return;
      }

      const connectionResult = await cloudBackupManager.checkCloudConnection();
      if (connectionResult.success) {
        this.setData({ 
          cloudBackupStatus: 'connected',
          lastBackupTime: wx.getStorageSync('lastBackupTime')
        });
        
        // 如果启用自动备份，执行自动备份
        if (this.data.autoBackupEnabled) {
          this.autoBackup();
        }
      } else {
        console.log('云端连接失败，将使用本地存储:', connectionResult.message);
        this.setData({ 
          cloudBackupStatus: 'disconnected',
          lastBackupTime: wx.getStorageSync('lastBackupTime')
        });
      }
    } catch (error) {
      console.error('云端连接初始化失败:', error);
      this.setData({ 
        cloudBackupStatus: 'disconnected',
        lastBackupTime: wx.getStorageSync('lastBackupTime')
      });
    }
  },

  // 手动备份到云端
  async manualBackup() {
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    wx.showLoading({
      title: '正在备份...'
    });

    try {
      const result = await cloudBackupManager.autoBackup(teacherId);
      
      if (result.success) {
        const now = new Date().toISOString();
        wx.setStorageSync('lastBackupTime', now);
        this.setData({ lastBackupTime: now });
        
        wx.hideLoading();
        wx.showToast({
          title: '备份成功',
          icon: 'success'
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '备份失败',
        icon: 'error'
      });
      console.error('手动备份失败:', error);
    }
  },

  // 自动备份
  async autoBackup() {
    if (!this.data.autoBackupEnabled) return;
    
    // 检查云开发环境是否可用
    if (!wx.cloud) {
      console.log('云开发不可用，跳过自动备份');
      return;
    }
    
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const lastBackup = wx.getStorageSync('lastBackupTime');
    const now = new Date();
    
    // 如果距离上次备份超过1小时，执行自动备份
    if (!lastBackup || (now - new Date(lastBackup)) > 3600000) {
      try {
        const result = await cloudBackupManager.autoBackup(teacherId);
        if (result.success) {
          const backupTime = now.toISOString();
          wx.setStorageSync('lastBackupTime', backupTime);
          this.setData({ lastBackupTime: backupTime });
          console.log('自动备份完成');
        } else {
          console.log('自动备份失败，将使用本地存储:', result.message);
        }
      } catch (error) {
        console.error('自动备份失败:', error);
      }
    }
  },

  // 从云端恢复数据
  async restoreFromCloud() {
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    wx.showModal({
      title: '确认恢复',
      content: '这将覆盖当前本地数据，是否继续？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在恢复...'
          });

          try {
            const result = await cloudBackupManager.syncFromCloud(teacherId);
            
            if (result.success) {
              wx.hideLoading();
              wx.showToast({
                title: '恢复成功',
                icon: 'success'
              });
              
              // 重新加载页面数据
              this.loadMaterialsData();
            } else {
              throw new Error(result.message);
            }
          } catch (error) {
            wx.hideLoading();
            wx.showToast({
              title: '恢复失败',
              icon: 'error'
            });
            console.error('数据恢复失败:', error);
          }
        }
      }
    });
  },

  // 显示备份管理界面
  showBackupManagement() {
    this.setData({ showBackupModal: true });
    this.loadBackupHistory();
  },

  // 关闭备份管理界面
  closeBackupModal() {
    this.setData({ showBackupModal: false });
  },

  // 加载备份历史
  async loadBackupHistory() {
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    try {
      const result = await cloudBackupManager.getBackupHistory(teacherId, 'homework_assignments');
      if (result.success) {
        this.setData({ backupHistory: result.history });
      }
    } catch (error) {
      console.error('加载备份历史失败:', error);
    }
  },

  // 切换自动备份
  toggleAutoBackup() {
    this.setData({
      autoBackupEnabled: !this.data.autoBackupEnabled
    });
    
    wx.setStorageSync('autoBackupEnabled', this.data.autoBackupEnabled);
    
    wx.showToast({
      title: this.data.autoBackupEnabled ? '已启用自动备份' : '已关闭自动备份',
      icon: 'success'
    });
  },

  // 同步到云端
  async syncToCloud() {
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    wx.showLoading({
      title: '正在同步...'
    });

    try {
      const result = await cloudBackupManager.syncToCloud(teacherId);
      
      if (result.success) {
        wx.hideLoading();
        wx.showToast({
          title: '同步成功',
          icon: 'success'
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '同步失败',
        icon: 'error'
      });
      console.error('同步失败:', error);
    }
  },

  // 显示作业选择器
  showAssignmentSelector() {
    this.setData({ showAssignmentSelector: true });
  },

  // 关闭作业选择器
  closeAssignmentSelector() {
    this.setData({ showAssignmentSelector: false });
  },

  // 选择作业
  selectAssignment(e) {
    const assignmentId = e.currentTarget.dataset.id;
    const assignment = this.data.availableAssignments.find(a => a._id === assignmentId);
    
    if (assignment) {
      this.loadAssignmentQuestions(assignment);
      this.setData({ showAssignmentSelector: false });
      
      wx.showToast({
        title: '已切换作业',
        icon: 'success'
      });
    }
  },

  // Phase 2: 获取变式题（简化版，无需映射表）
  async getVariantQuestions(originalQuestion, count = 2) {
    try {
      const cloudDataLoader = require('../../utils/cloudDataLoader.js');
      
      // 1. 获取原题的语法点
      const grammarPoint = originalQuestion.grammarPoint || originalQuestion.category;
      console.log(`🔍 查找 "${grammarPoint}" 的变式题...`);
      
      // 2. 直接从云数据库获取同语法点的题目（无需映射）
      const allQuestions = await cloudDataLoader.getQuestionsByGrammarPoint(grammarPoint);
      
      if (!allQuestions || allQuestions.length === 0) {
        console.log(`   ⚠️ "${grammarPoint}" 未找到题目`);
        return [];
      }
      
      console.log(`   ✅ 找到 ${allQuestions.length} 题`);
      
      // 3. 过滤掉原题
      const filteredQuestions = allQuestions.filter(q => 
        q._id !== originalQuestion._id && 
        (q.text || q.question) !== (originalQuestion.text || originalQuestion.question)
      );
      
      console.log(`   过滤后剩余 ${filteredQuestions.length} 题`);
      
      // 4. 随机选择变式题
      const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
      const variants = shuffled.slice(0, count);
      
      console.log(`   ✅ 选择 ${variants.length} 个变式题`);
      
      return variants;
      
    } catch (error) {
      console.error('获取变式题失败:', error);
      return [];
    }
  },

  // 从作业数据中获取真实题目
  getRealQuestionsFromAssignment(assignment) {
    try {
      console.log('🔍 开始获取真实题目，作业数据:', {
        title: assignment.title,
        selectedItems: assignment.selectedItems,
        selectedItemsCount: assignment.selectedItems ? assignment.selectedItems.length : 0
      });
      
      const allQuestions = [];
      
      // 尝试从选择题题库获取题目
      try {
        const { choiceQuestionsBank } = require('../../choice_questions_bank.js');
        const choiceQuestions = choiceQuestionsBank;
        console.log('✅ 选择题题库加载成功，题目总数:', choiceQuestions.questions ? choiceQuestions.questions.length : 0);
        
        if (choiceQuestions && choiceQuestions.questions) {
          assignment.selectedItems.forEach(item => {
            // 根据语法点名称匹配题目 - 使用更宽松的匹配策略
            const matchingQuestions = choiceQuestions.questions.filter(q => {
              const itemNameLower = (item.name || '').toLowerCase();
              const grammarPointLower = (q.grammarPoint || '').toLowerCase();
              const categoryLower = (q.category || '').toLowerCase();
              
              // 精确匹配
              if (q.grammarPoint === item.name) return true;
              
              // 双向包含匹配
              if (grammarPointLower.includes(itemNameLower) || itemNameLower.includes(grammarPointLower)) return true;
              
              // 类别匹配
              if (categoryLower.includes(itemNameLower) || itemNameLower.includes(categoryLower)) return true;
              
              return false;
            });
            
            console.log(`语法点 "${item.name}" 匹配到 ${matchingQuestions.length} 个题目`);
            
            // 每个语法点最多取3题
            const selectedQuestions = this.shuffleArray(matchingQuestions).slice(0, Math.min(3, item.questionCount || 3));
            allQuestions.push(...selectedQuestions);
          });
        }
      } catch (error) {
        console.log('选择题题库加载失败，尝试填空题题库:', error);
      }
      
      // 如果选择题题库没有足够题目，从填空题题库补充
      if (allQuestions.length < assignment.selectedItems.length) {
        try {
          const writingQuestions = require('../../writing_exercise_questions.js').writingExerciseQuestions;
          const remainingCount = assignment.selectedItems.length - allQuestions.length;
          
          assignment.selectedItems.slice(0, remainingCount).forEach((item, index) => {
            // 查找匹配的填空题 - 使用更宽松的匹配策略
            Object.values(writingQuestions).forEach(categoryQuestions => {
              const matchingQuestions = categoryQuestions.filter(q => {
                const itemNameLower = (item.name || '').toLowerCase();
                const categoryLower = (q.category || '').toLowerCase();
                const subCategoryLower = (q.subCategory || '').toLowerCase();
                
                // 精确匹配
                if (q.category === item.name || q.subCategory === item.name) return true;
                
                // 双向包含匹配
                if (categoryLower.includes(itemNameLower) || itemNameLower.includes(categoryLower)) return true;
                if (subCategoryLower.includes(itemNameLower) || itemNameLower.includes(subCategoryLower)) return true;
                
                return false;
              });
              
              if (matchingQuestions.length > 0) {
                const selectedQuestion = matchingQuestions[0];
                // 将填空题转换为选择题格式
                const choiceFormat = {
                  id: selectedQuestion.id,
                  grammarPoint: selectedQuestion.category,
                  question: selectedQuestion.question,
                  options: [
                    { label: "A", text: selectedQuestion.answer, isCorrect: true },
                    { label: "B", text: "干扰选项B", isCorrect: false },
                    { label: "C", text: "干扰选项C", isCorrect: false },
                    { label: "D", text: "干扰选项D", isCorrect: false }
                  ],
                  correctAnswer: selectedQuestion.answer,
                  correctOption: "A",
                  analysis: selectedQuestion.analysis,
                  category: selectedQuestion.category
                };
                allQuestions.push(choiceFormat);
              }
            });
          });
        } catch (error) {
          console.log('填空题题库加载失败:', error);
        }
      }
      
      // 如果还是没有足够题目，生成默认题目
      if (allQuestions.length === 0) {
        console.log('⚠️ 未找到匹配的题目，使用默认生成');
        assignment.selectedItems.forEach((item, index) => {
          allQuestions.push({
            id: `default_${index}`,
            grammarPoint: item.name,
            question: `请根据${item.name}的语法规则选择正确答案`,
            options: [
              { label: "A", text: `${item.name}选项A`, isCorrect: true },
              { label: "B", text: `${item.name}选项B`, isCorrect: false },
              { label: "C", text: `${item.name}选项C`, isCorrect: false },
              { label: "D", text: `${item.name}选项D`, isCorrect: false }
            ],
            correctAnswer: `${item.name}选项A`,
            correctOption: "A",
            analysis: `本题考查${item.name}的语法规则，正确答案是A。`,
            category: item.name
          });
        });
      }
      
      const finalQuestions = allQuestions.slice(0, Math.min(10, allQuestions.length)); // 最多返回10题
      console.log(`✅ 从作业数据最终获取到 ${finalQuestions.length} 个题目`);
      
      if (finalQuestions.length > 0) {
        console.log('📝 题目示例:', {
          grammarPoint: finalQuestions[0].grammarPoint,
          question: finalQuestions[0].question.substring(0, 50) + '...',
          hasOptions: !!finalQuestions[0].options
        });
      }
      
      return finalQuestions;
      
    } catch (error) {
      console.error('获取真实题目失败:', error);
      return [];
    }
  },

  // 从语法点列表中获取真实题目
  getRealQuestionsFromGrammarPoints(grammarPoints) {
    try {
      const allQuestions = [];
      
      // 尝试从选择题题库获取题目
      try {
        const { choiceQuestionsBank } = require('../../choice_questions_bank.js');
        const choiceQuestions = choiceQuestionsBank;
        console.log('✅ 选择题题库加载成功（语法点模式），题目总数:', choiceQuestions.questions ? choiceQuestions.questions.length : 0);
        
        if (choiceQuestions && choiceQuestions.questions) {
          grammarPoints.forEach(grammarPoint => {
            // 根据语法点名称匹配题目 - 使用更宽松的匹配策略
            const matchingQuestions = choiceQuestions.questions.filter(q => {
              const grammarPointLower = (grammarPoint || '').toLowerCase();
              const qGrammarPointLower = (q.grammarPoint || '').toLowerCase();
              const categoryLower = (q.category || '').toLowerCase();
              
              // 精确匹配
              if (q.grammarPoint === grammarPoint) return true;
              
              // 双向包含匹配
              if (qGrammarPointLower.includes(grammarPointLower) || grammarPointLower.includes(qGrammarPointLower)) return true;
              
              // 类别匹配
              if (categoryLower.includes(grammarPointLower) || grammarPointLower.includes(categoryLower)) return true;
              
              return false;
            });
            
            console.log(`语法点 "${grammarPoint}" 匹配到 ${matchingQuestions.length} 个题目`);
            
            // 每个语法点最多取2题
            const selectedQuestions = this.shuffleArray(matchingQuestions).slice(0, 2);
            allQuestions.push(...selectedQuestions);
          });
        }
      } catch (error) {
        console.log('选择题题库加载失败:', error);
      }
      
      // 如果选择题题库没有足够题目，从填空题题库补充
      if (allQuestions.length < grammarPoints.length) {
        try {
          const writingQuestions = require('../../writing_exercise_questions.js').writingExerciseQuestions;
          
          grammarPoints.forEach(grammarPoint => {
            // 查找匹配的填空题 - 使用更宽松的匹配策略
            Object.values(writingQuestions).forEach(categoryQuestions => {
              const matchingQuestions = categoryQuestions.filter(q => {
                const grammarPointLower = (grammarPoint || '').toLowerCase();
                const categoryLower = (q.category || '').toLowerCase();
                const subCategoryLower = (q.subCategory || '').toLowerCase();
                
                // 精确匹配
                if (q.category === grammarPoint || q.subCategory === grammarPoint) return true;
                
                // 双向包含匹配
                if (categoryLower.includes(grammarPointLower) || grammarPointLower.includes(categoryLower)) return true;
                if (subCategoryLower.includes(grammarPointLower) || grammarPointLower.includes(subCategoryLower)) return true;
                
                return false;
              });
              
              if (matchingQuestions.length > 0 && !allQuestions.find(q => q.category === grammarPoint)) {
                const selectedQuestion = matchingQuestions[0];
                // 将填空题转换为选择题格式
                const choiceFormat = {
                  id: selectedQuestion.id,
                  grammarPoint: selectedQuestion.category,
                  question: selectedQuestion.question,
                  options: [
                    { label: "A", text: selectedQuestion.answer, isCorrect: true },
                    { label: "B", text: "干扰选项B", isCorrect: false },
                    { label: "C", text: "干扰选项C", isCorrect: false },
                    { label: "D", text: "干扰选项D", isCorrect: false }
                  ],
                  correctAnswer: selectedQuestion.answer,
                  correctOption: "A",
                  analysis: selectedQuestion.analysis,
                  category: selectedQuestion.category
                };
                allQuestions.push(choiceFormat);
              }
            });
          });
        } catch (error) {
          console.log('填空题题库加载失败:', error);
        }
      }
      
      // 如果还是没有足够题目，生成默认题目
      if (allQuestions.length === 0) {
        grammarPoints.forEach((grammarPoint, index) => {
          allQuestions.push({
            id: `default_${index}`,
            grammarPoint: grammarPoint,
            question: `请根据${grammarPoint}的语法规则选择正确答案`,
            options: [
              { label: "A", text: `${grammarPoint}选项A`, isCorrect: true },
              { label: "B", text: `${grammarPoint}选项B`, isCorrect: false },
              { label: "C", text: `${grammarPoint}选项C`, isCorrect: false },
              { label: "D", text: `${grammarPoint}选项D`, isCorrect: false }
            ],
            correctAnswer: `${grammarPoint}选项A`,
            correctOption: "A",
            analysis: `本题考查${grammarPoint}的语法规则，正确答案是A。`,
            category: grammarPoint
          });
        });
      }
      
      return allQuestions.slice(0, Math.min(10, allQuestions.length)); // 最多返回10题
      
    } catch (error) {
      console.error('获取真实题目失败:', error);
      return [];
    }
  },

  // 生成变式题目
  generateVariantQuestion(originalQuestion) {
    try {
      // 基于原题生成变式，主要通过改变语境、选项顺序或增加干扰项
      const variantTypes = ['语境变化', '选项调整', '难度提升'];
      const variantType = variantTypes[Math.floor(Math.random() * variantTypes.length)];
      
      let variantQuestion = { ...originalQuestion };
      
      switch (variantType) {
        case '语境变化':
          // 在原题基础上增加语境
          variantQuestion.question = `在以下语境中：${originalQuestion.question.replace(/^请根据.*?选择/, '请选择')}`;
          break;
          
        case '选项调整':
          // 调整选项顺序
          if (variantQuestion.options && variantQuestion.options.length > 1) {
            const correctOption = variantQuestion.options.find(opt => opt.isCorrect);
            const wrongOptions = variantQuestion.options.filter(opt => !opt.isCorrect);
            variantQuestion.options = this.shuffleArray([correctOption, ...wrongOptions]);
            // 更新正确答案
            variantQuestion.correctOption = variantQuestion.options.findIndex(opt => opt.isCorrect) + 1;
            variantQuestion.correctOption = String.fromCharCode(65 + variantQuestion.correctOption - 1); // 转换为A、B、C、D
          }
          break;
          
        case '难度提升':
          // 增加干扰项或改变题目表述
          variantQuestion.question = `【进阶题】${originalQuestion.question}`;
          if (variantQuestion.options) {
            // 增加一个更接近正确答案的干扰项
            const correctOption = variantQuestion.options.find(opt => opt.isCorrect);
            if (correctOption) {
              const newWrongOption = {
                label: String.fromCharCode(65 + variantQuestion.options.length),
                text: `${correctOption.text}的相似形式`,
                isCorrect: false
              };
              variantQuestion.options.push(newWrongOption);
            }
          }
          break;
      }
      
      // 更新解析
      variantQuestion.analysis = `【变式题解析】${originalQuestion.analysis} 本题在原题基础上进行了${variantType}，增加了题目的灵活性。`;
      
      return variantQuestion;
      
    } catch (error) {
      console.error('生成变式题目失败:', error);
      return originalQuestion; // 如果生成失败，返回原题
    }
  }
});
