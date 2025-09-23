// 学习路径管理页面
Page({
  data: {
    userLevel: '',
    currentPath: [],
    completedSteps: [],
    weakPoints: [],
    recommendations: {},
    loading: true
  },

  onLoad(options) {
    // 从参数或本地存储获取用户等级
    const userLevel = options.level || wx.getStorageSync('userLevel') || '基础用户';
    this.setData({ userLevel });
    this.loadLearningPath();
  },

  // 加载学习路径
  loadLearningPath() {
    const { userLevel } = this.data;
    
    // 根据用户等级生成学习路径
    const learningPath = this.generateLearningPath(userLevel);
    
    // 获取用户已完成的学习步骤
    const completedSteps = wx.getStorageSync('completedSteps') || [];
    
    // 获取用户薄弱环节
    const weakPoints = wx.getStorageSync('weakPoints') || [];
    
    this.setData({
      currentPath: learningPath,
      completedSteps: completedSteps,
      weakPoints: weakPoints,
      loading: false
    });
  },

  // 根据用户等级生成学习路径
  generateLearningPath(userLevel) {
    const pathTemplates = {
      '基础用户': {
        title: '基础巩固阶段',
        duration: '1-2周',
        steps: [
          {
            id: 'step_1',
            title: '代词书写基础',
            description: '掌握人称代词、物主代词的基本用法',
            tables: ['pronoun_table_001', 'pronoun_table_002'],
            difficulty: 'easy',
            estimatedTime: '15-20分钟/天'
          },
          {
            id: 'step_2', 
            title: '名词复数规则',
            description: '学习名词复数的基本变化规则',
            tables: ['noun_001', 'noun_002'],
            difficulty: 'easy',
            estimatedTime: '20-25分钟/天'
          },
          {
            id: 'step_3',
            title: '时态书写基础',
            description: '掌握一般现在时、过去时的基本形式',
            tables: ['tense_writing_001'],
            difficulty: 'medium',
            estimatedTime: '25-30分钟/天'
          }
        ]
      },
      '初级用户': {
        title: '规则扩展阶段',
        duration: '2-3周',
        steps: [
          {
            id: 'step_1',
            title: '名词复数进阶',
            description: '学习特殊变化和复杂规则',
            tables: ['noun_003', 'noun_004', 'noun_005', 'noun_006'],
            difficulty: 'medium',
            estimatedTime: '20-30分钟/天'
          },
          {
            id: 'step_2',
            title: '形容词比较级最高级',
            description: '掌握形容词的变化规则',
            tables: ['adjective_001', 'adjective_002'],
            difficulty: 'medium',
            estimatedTime: '25-35分钟/天'
          },
          {
            id: 'step_3',
            title: '介词基础',
            description: '学习常见介词的用法',
            tables: ['preposition_table_001'],
            difficulty: 'medium',
            estimatedTime: '20-25分钟/天'
          }
        ]
      },
      '中级用户': {
        title: '综合应用阶段',
        duration: '3-4周',
        steps: [
          {
            id: 'step_1',
            title: '语态书写',
            description: '掌握主动语态和被动语态的转换',
            tables: ['voice_writing_001', 'voice_writing_002'],
            difficulty: 'hard',
            estimatedTime: '30-40分钟/天'
          },
          {
            id: 'step_2',
            title: '动词分词',
            description: '学习现在分词和过去分词的用法',
            tables: ['present_participle_001', 'past_participle_001'],
            difficulty: 'hard',
            estimatedTime: '35-45分钟/天'
          },
          {
            id: 'step_3',
            title: '介词搭配',
            description: '掌握介词固定搭配和用法',
            tables: ['preposition_table_002', 'preposition_table_003'],
            difficulty: 'hard',
            estimatedTime: '30-40分钟/天'
          }
        ]
      },
      '高级用户': {
        title: '高级综合阶段',
        duration: '4-6周',
        steps: [
          {
            id: 'step_1',
            title: '全语法点综合',
            description: '综合练习所有语法知识点',
            tables: ['all_tables'],
            difficulty: 'expert',
            estimatedTime: '45-60分钟/天'
          },
          {
            id: 'step_2',
            title: '高考模拟练习',
            description: '按高考真题比例进行综合练习',
            tables: ['exam_simulation'],
            difficulty: 'expert',
            estimatedTime: '60-90分钟/天'
          },
          {
            id: 'step_3',
            title: '自由组合练习',
            description: '个性化定制练习内容',
            tables: ['custom_combination'],
            difficulty: 'expert',
            estimatedTime: '30-60分钟/天'
          }
        ]
      }
    };

    return pathTemplates[userLevel] || pathTemplates['基础用户'];
  },

  // 开始学习步骤
  startStep(e) {
    const stepId = e.currentTarget.dataset.stepId;
    const step = this.data.currentPath.steps.find(s => s.id === stepId);
    
    if (!step) return;

    // 根据步骤类型跳转到相应页面
    if (step.tables.includes('all_tables')) {
      // 综合练习
      wx.navigateTo({
        url: '/pages/grammar-overview/index'
      });
    } else if (step.tables.includes('exam_simulation')) {
      // 高考模拟
      wx.navigateTo({
        url: '/pages/ability-test/comprehensive-writing-test'
      });
    } else if (step.tables.includes('custom_combination')) {
      // 自由组合
      wx.navigateTo({
        url: '/pages/grammar-select/index'
      });
    } else {
      // 具体表格练习
      wx.navigateTo({
        url: `/pages/grammar-writing/index?tables=${step.tables.join(',')}`
      });
    }
  },

  // 标记步骤完成
  completeStep(e) {
    const stepId = e.currentTarget.dataset.stepId;
    const completedSteps = [...this.data.completedSteps];
    
    if (!completedSteps.includes(stepId)) {
      completedSteps.push(stepId);
      this.setData({ completedSteps });
      wx.setStorageSync('completedSteps', completedSteps);
      
      wx.showToast({
        title: '步骤已完成！',
        icon: 'success'
      });
    }
  },

  // 查看薄弱环节
  viewWeakPoints() {
    if (this.data.weakPoints.length === 0) {
      wx.showToast({
        title: '暂无薄弱环节',
        icon: 'none'
      });
      return;
    }

    const weakPointsText = this.data.weakPoints.map(point => `• ${point.name}`).join('\n');
    
    wx.showModal({
      title: '薄弱环节',
      content: weakPointsText,
      showCancel: false
    });
  },

  // 重新评估
  reassess() {
    wx.showActionSheet({
      itemList: ['简易版书写测试', '全面版书写测试', '语法概念测试'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            wx.navigateTo({
              url: '/pages/ability-test/simple-writing-test'
            });
            break;
          case 1:
            wx.navigateTo({
              url: '/pages/ability-test/comprehensive-writing-test'
            });
            break;
          case 2:
            wx.navigateTo({
              url: '/pages/ability-test/grammar-test'
            });
            break;
        }
      }
    });
  },

  // 查看学习统计
  viewStatistics() {
    const stats = {
      totalSteps: this.data.currentPath.steps.length,
      completedSteps: this.data.completedSteps.length,
      completionRate: Math.round((this.data.completedSteps.length / this.data.currentPath.steps.length) * 100),
      weakPointsCount: this.data.weakPoints.length
    };

    const statsText = `学习进度统计：
总步骤：${stats.totalSteps}
已完成：${stats.completedSteps}
完成率：${stats.completionRate}%
薄弱环节：${stats.weakPointsCount}个`;

    wx.showModal({
      title: '学习统计',
      content: statsText,
      showCancel: false
    });
  },

  // 返回主页
  goHome() {
    wx.navigateBack();
  }
});
