// 每日卡片系统页面
Page({
  data: {
    todayCards: [],
    unlockedCards: [],
    lockedCards: [],
    userLevel: '基础用户',
    streakDays: 0,
    todayProgress: 0,
    loading: true,
    selectedCard: null,
    showCardDetail: false
  },

  onLoad() {
    this.loadUserData();
    this.generateTodayCards();
  },

  // 加载用户数据
  loadUserData() {
    // 从本地存储获取用户等级和连续天数
    const testResults = wx.getStorageSync('levelTestResults');
    const userLevel = testResults ? testResults.userLevel : '基础用户';
    const streakDays = wx.getStorageSync('streakDays') || 0;
    const todayProgress = wx.getStorageSync('todayProgress') || 0;

    this.setData({
      userLevel,
      streakDays,
      todayProgress
    });
  },

  // 生成今日卡片
  generateTodayCards() {
    const { userLevel } = this.data;
    const today = new Date().toDateString();
    const lastGenerated = wx.getStorageSync('lastCardGeneration');
    
    // 如果是新的一天，重新生成卡片
    if (lastGenerated !== today) {
      this.generateNewDayCards(userLevel);
      wx.setStorageSync('lastCardGeneration', today);
    } else {
      // 加载今日已有卡片
      const todayCards = wx.getStorageSync('todayCards') || [];
      this.setData({ todayCards });
    }
    
    this.setData({ loading: false });
  },

  // 生成新一天的卡片
  generateNewDayCards(userLevel) {
    // 尝试使用个性化推荐系统
    try {
      const UserAbilityProfile = require('../../utils/userAbilityProfile.js');
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.updateProfile();
      
      // 生成个性化推荐
      const recommendations = abilityProfile.generatePersonalizedRecommendations();
      
      // 将推荐转换为卡片格式
      const todayCards = this.convertRecommendationsToCards(recommendations, userLevel);
      
      this.setData({ todayCards });
      wx.setStorageSync('todayCards', todayCards);
      return;
    } catch (error) {
      console.log('个性化推荐失败，使用默认模板:', error);
    }
    
    // 回退到原始模板系统
    const cardTemplates = this.getCardTemplates(userLevel);
    const todayCards = [];
    
    // 根据用户等级决定今日解锁卡片数量
    const unlockCount = this.getUnlockCount(userLevel);
    
    for (let i = 0; i < unlockCount; i++) {
      const template = cardTemplates[i % cardTemplates.length];
      const card = {
        id: `card_${Date.now()}_${i}`,
        type: template.type,
        title: template.title,
        description: template.description,
        difficulty: template.difficulty,
        estimatedTime: template.estimatedTime,
        icon: template.icon,
        xpReward: template.xpReward,
        isUnlocked: true,
        isCompleted: false,
        unlockTime: Date.now(),
        order: i + 1
      };
      todayCards.push(card);
    }
    
    // 生成锁定卡片
    const lockedCount = 3 - unlockCount;
    for (let i = 0; i < lockedCount; i++) {
      const template = cardTemplates[(unlockCount + i) % cardTemplates.length];
      const card = {
        id: `locked_card_${Date.now()}_${i}`,
        type: template.type,
        title: template.title,
        description: template.description,
        difficulty: template.difficulty,
        estimatedTime: template.estimatedTime,
        icon: template.icon,
        xpReward: template.xpReward,
        isUnlocked: false,
        isCompleted: false,
        unlockCondition: template.unlockCondition,
        order: unlockCount + i + 1
      };
      todayCards.push(card);
    }
    
    this.setData({ todayCards });
    wx.setStorageSync('todayCards', todayCards);
  },

  // 将推荐转换为卡片格式
  convertRecommendationsToCards(recommendations, userLevel) {
    const todayCards = [];
    const dailyTasks = recommendations.dailyTasks || [];
    
    // 转换每日任务为卡片
    dailyTasks.forEach((task, index) => {
      const card = {
        id: `personalized_card_${Date.now()}_${index}`,
        type: task.type,
        title: task.title,
        description: task.description,
        difficulty: task.difficulty,
        estimatedTime: this.getEstimatedTime(task.questionCount),
        icon: this.getTaskIcon(task.type),
        xpReward: task.xpReward,
        isUnlocked: true,
        isCompleted: false,
        unlockTime: Date.now(),
        order: index + 1,
        questionCount: task.questionCount,
        priority: task.priority,
        targetPoint: task.targetPoint,
        targetArea: task.targetArea
      };
      todayCards.push(card);
    });
    
    // 如果推荐任务不足3个，补充一些基础任务
    if (todayCards.length < 3) {
      const additionalTasks = this.getAdditionalTasks(userLevel, 3 - todayCards.length);
      additionalTasks.forEach((task, index) => {
        const card = {
          id: `additional_card_${Date.now()}_${index}`,
          type: task.type,
          title: task.title,
          description: task.description,
          difficulty: task.difficulty,
          estimatedTime: task.estimatedTime,
          icon: task.icon,
          xpReward: task.xpReward,
          isUnlocked: true,
          isCompleted: false,
          unlockTime: Date.now(),
          order: todayCards.length + index + 1
        };
        todayCards.push(card);
      });
    }
    
    return todayCards;
  },

  // 获取预估时间
  getEstimatedTime(questionCount) {
    const timePerQuestion = 1.5; // 每题约1.5分钟
    const totalMinutes = Math.ceil(questionCount * timePerQuestion);
    return `${totalMinutes}分钟`;
  },

  // 获取任务图标
  getTaskIcon(taskType) {
    const iconMap = {
      'weak_point_grammar': '🎯',
      'balanced_grammar': '📝',
      'comprehensive_grammar': '🎯',
      'writing_practice': '✍️',
      'writing_focused': '✍️',
      'advanced_comprehensive': '🚀',
      'intermediate_comprehensive': '🎯',
      'basic_comprehensive': '📚'
    };
    return iconMap[taskType] || '📝';
  },

  // 获取补充任务
  getAdditionalTasks(userLevel, count) {
    const baseTemplates = this.getCardTemplates(userLevel);
    return baseTemplates.slice(0, count);
  },

  // 获取卡片模板
  getCardTemplates(userLevel) {
    const baseTemplates = [
      {
        type: 'grammar_practice',
        title: '语法选择题',
        description: '练习基础语法知识点',
        difficulty: 'easy',
        estimatedTime: '10分钟',
        icon: '📝',
        xpReward: 50,
        unlockCondition: '完成前置任务'
      },
      {
        type: 'writing_practice',
        title: '书写规范练习',
        description: '巩固单词书写规范',
        difficulty: 'easy',
        estimatedTime: '15分钟',
        icon: '✍️',
        xpReward: 60,
        unlockCondition: '完成语法练习'
      },
      {
        type: 'comprehensive_test',
        title: '综合能力测试',
        description: '全面检测学习效果',
        difficulty: 'medium',
        estimatedTime: '20分钟',
        icon: '🎯',
        xpReward: 100,
        unlockCondition: '完成前两项任务'
      },
      {
        type: 'weak_point_review',
        title: '薄弱点复习',
        description: '针对性强化练习',
        difficulty: 'medium',
        estimatedTime: '25分钟',
        icon: '🔍',
        xpReward: 80,
        unlockCondition: '连续学习3天'
      },
      {
        type: 'advanced_challenge',
        title: '进阶挑战',
        description: '高难度综合练习',
        difficulty: 'hard',
        estimatedTime: '30分钟',
        icon: '🚀',
        xpReward: 150,
        unlockCondition: '用户等级达到中级'
      }
    ];

    // 根据用户等级调整卡片内容
    return this.adjustTemplatesByLevel(baseTemplates, userLevel);
  },

  // 根据用户等级调整模板
  adjustTemplatesByLevel(templates, userLevel) {
    return templates.map(template => {
      switch(userLevel) {
        case '基础用户':
          return {
            ...template,
            difficulty: 'easy',
            xpReward: Math.floor(template.xpReward * 0.8)
          };
        case '初级用户':
          return {
            ...template,
            difficulty: template.difficulty === 'hard' ? 'medium' : template.difficulty,
            xpReward: Math.floor(template.xpReward * 0.9)
          };
        case '中级用户':
        case '高级用户':
          return template;
        default:
          return template;
      }
    });
  },

  // 获取解锁卡片数量
  getUnlockCount(userLevel) {
    switch(userLevel) {
      case '基础用户': return 1;
      case '初级用户': return 2;
      case '中级用户': return 2;
      case '高级用户': return 3;
      default: return 1;
    }
  },

  // 点击卡片
  onCardTap(e) {
    const cardId = e.currentTarget.dataset.cardId;
    const card = this.data.todayCards.find(c => c.id === cardId);
    
    if (!card.isUnlocked) {
      wx.showToast({
        title: card.unlockCondition,
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (card.isCompleted) {
      wx.showToast({
        title: '今日已完成',
        icon: 'none'
      });
      return;
    }

    this.setData({
      selectedCard: card,
      showCardDetail: true
    });
  },

  // 开始卡片任务
  startCardTask() {
    const { selectedCard } = this.data;
    
    // 检查是否为个性化推荐任务
    if (selectedCard.questionCount && selectedCard.targetPoint) {
      // 个性化语法专项练习
      wx.navigateTo({
        url: `/pages/exercise-page/index?mode=focused&targetPoint=${encodeURIComponent(selectedCard.targetPoint)}&count=${selectedCard.questionCount}&difficulty=${selectedCard.difficulty}`
      });
    } else if (selectedCard.questionCount && selectedCard.targetArea) {
      // 个性化书写专项练习
      wx.navigateTo({
        url: `/pages/ability-test/simple-writing-test?mode=focused&targetArea=${encodeURIComponent(selectedCard.targetArea)}&count=${selectedCard.questionCount}`
      });
    } else {
      // 根据卡片类型跳转到对应页面
      switch(selectedCard.type) {
        case 'grammar_practice':
        case 'balanced_grammar':
        case 'comprehensive_grammar':
          wx.switchTab({
            url: '/pages/index/index'
          });
          break;
        case 'writing_practice':
        case 'writing_focused':
          wx.navigateTo({
            url: '/pages/ability-test/simple-writing-test'
          });
          break;
        case 'comprehensive_test':
        case 'advanced_comprehensive':
        case 'intermediate_comprehensive':
        case 'basic_comprehensive':
          wx.navigateTo({
            url: '/pages/ability-test/comprehensive-writing-test'
          });
          break;
        case 'weak_point_review':
        case 'weak_point_grammar':
          wx.navigateTo({
            url: '/pages/grammar-overview/index'
          });
          break;
        case 'advanced_challenge':
          wx.navigateTo({
            url: '/pages/grammar-overview/index'
          });
          break;
        default:
          // 默认跳转到个性化练习页面
          wx.navigateTo({
            url: '/pages/personalized-practice/index'
          });
      }
    }
    
    this.closeCardDetail();
  },

  // 关闭卡片详情
  closeCardDetail() {
    this.setData({
      showCardDetail: false,
      selectedCard: null
    });
  },

  // 完成任务（从其他页面返回时调用）
  completeCardTask(cardType) {
    const todayCards = this.data.todayCards.map(card => {
      if (card.type === cardType && card.isUnlocked && !card.isCompleted) {
        // 更新进度和奖励
        const newProgress = this.data.todayProgress + card.xpReward;
        this.setData({ todayProgress: newProgress });
        wx.setStorageSync('todayProgress', newProgress);
        
        return { ...card, isCompleted: true, completedTime: Date.now() };
      }
      return card;
    });
    
    this.setData({ todayCards });
    wx.setStorageSync('todayCards', todayCards);
    
    // 检查是否完成所有今日任务
    this.checkDailyCompletion();
  },

  // 检查每日完成情况
  checkDailyCompletion() {
    const unlockedCards = this.data.todayCards.filter(card => card.isUnlocked);
    const completedCards = unlockedCards.filter(card => card.isCompleted);
    
    if (completedCards.length === unlockedCards.length) {
      // 更新连续天数
      const newStreakDays = this.data.streakDays + 1;
      this.setData({ streakDays: newStreakDays });
      wx.setStorageSync('streakDays', newStreakDays);
      
      wx.showModal({
        title: '🎉 今日任务完成！',
        content: `恭喜您完成今日所有任务！连续学习${newStreakDays}天`,
        showCancel: false,
        success: () => {
          // 可以在这里添加奖励逻辑
        }
      });
    }
  },

  // 查看成就
  viewAchievements() {
    wx.navigateTo({
      url: '/pages/achievements/index'
    });
  },

  // 刷新任务
  refreshTasks() {
    wx.showModal({
      title: '刷新任务',
      content: '确定要刷新今日任务吗？已完成的任务将保留。',
      success: (res) => {
        if (res.confirm) {
          this.generateNewDayCards(this.data.userLevel);
          wx.showToast({
            title: '任务已刷新',
            icon: 'success'
          });
        }
      }
    });
  }
});
