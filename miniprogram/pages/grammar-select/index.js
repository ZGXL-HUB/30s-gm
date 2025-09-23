// 引入隐藏语法点配置
const hiddenPointsConfig = require('../../config/hidden-points.js');
// 引入云数据加载器
const cloudDataLoader = require('../../utils/cloudDataLoader.js');

Page({
  data: {
    categories: [
      "介词", "代词", "连词", "冠词", "名词", "动词",
      "谓语", "非谓语", "形容词", "副词", "定语从句", "状语和从句"
    ],
    rightPanel: [
      ["介词综合", "固定搭配", "介词 + 名词/动名词"],
      ["代词综合", "人称代词", "物主代词", "反身代词", "关系代词", "it相关"],
      ["并列连词综合", "从属连词综合", "连词与名/动/形/副综合", "连词与名词", "连词与动词", "连词与形容词"],
      ["冠词综合", "泛指与特指", "a和an", "the的特殊用法"],
      ["名词综合", "复合词和外来词", "单复数同形", "不规则复数", "以o结尾", "以y结尾", "s/sh/ch/x结尾", "以f/fe结尾"],
      ["被动写be吗", "并列句与动词", "主从句与动词", "插入语与动词"],
      ["谓语", "时态(一般过去时)", "时态(一般将来时)", "时态(过去将来时)", "时态(现在进行时)", "时态(过去进行时)", "时态(现在完成时)", "时态(过去完成时)", "语态(被动+八大时态)"],
      ["现在分词综合", "过去分词综合", "不定式综合"],
      ["形容词综合", "比较级", "最高级"],
      ["副词综合", "副词修饰动词", "副词修饰句子", "副词修饰形容词/副词"],
      ["定语从句综合", "that能填吗", "who和which选哪个", "whose", "which和when/where混淆"],
      ["状语从句综合", "when", "where", "how", "why"]
    ],
    activeIndex: 0,
    selectedPoints: {},
    totalQuestions: 0,
    loading: true,
    
    // 添加：特殊类别配置(这些类别只能选择1道题，并且有特殊引导)
    specialCategories: [
      // 由于大部分特殊类别都不存在，暂时清空，后续可以根据需要添加
    ],
    
    generating: false,
    level: '',
    selectedQuestions: [],
    selectedList: [],
    parentHasSelected: [],
    isTagsCollapsed: true,
    expandedCategories: {},
    selectedTagsList: [],
    categoryCounts: [],
    pointToCategoryMap: {},
    
    // 新增：综合大类双按钮功能相关数据
    showComboBar: false,
    isCustomComboSet: false,
    customComboConfig: null,
    formattedComboConfig: [],
    
    // 新增：菜单相关数据
    showComboMenu: false,
    
    // 新增：tooltip相关数据
    showTooltip: false,
    
    // 新增：动效提示相关数据
    showTipAnimation: false
  },

  toggleSubmenu: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeIndex: index });
  },

  // 修改：检查是否为特殊类别
  isSpecialCategory: function(point) {
    return this.data.specialCategories.includes(point);
  },

  // 新增：检查语法点是否被隐藏
  isHiddenPoint: function(point) {
    return hiddenPointsConfig.isHidden(point);
  },

  togglePoint: function(e) {
    const point = e.currentTarget.dataset.point;
    const selectedPoints = this.data.selectedPoints;
    
    // 恢复原有的统一切换逻辑，不区分特殊类别
    selectedPoints[point] = !selectedPoints[point];
    
    const totalQuestions = Object.values(selectedPoints).reduce((sum, count) => {
      return sum + (typeof count === 'number' ? count : (count ? 5 : 0));
    }, 0);
    
    this.setData({ selectedPoints, totalQuestions }, () => {
      this.updateSelectedPointsList();
      this.updateParentHasSelected();
    });
  },

  removeSelectedPoint: function(e) {
    const point = e.currentTarget.dataset.point;
    const selectedPoints = this.data.selectedPoints;
    selectedPoints[point] = false;
    const totalQuestions = Object.values(selectedPoints).filter(Boolean).length * 5;
    this.setData({ selectedPoints, totalQuestions }, () => {
      this.updateSelectedPointsList();
      this.updateParentHasSelected();
    });
  },

  updateSelectedPointsList: function() {
    const { selectedPoints, rightPanel, categories } = this.data;
    const selectedList = [];
    Object.keys(selectedPoints).forEach(child => {
      if (selectedPoints[child]) {
        let parent = '';
        for (let i = 0; i < rightPanel.length; i++) {
          if (rightPanel[i].includes(child)) {
            parent = categories[i];
            break;
          }
        }
        selectedList.push({ parent, child });
      }
    });
    this.setData({ selectedList });
  },

  updateParentHasSelected: function() {
    const { rightPanel, selectedPoints } = this.data;
    const parentHasSelected = rightPanel.map(children =>
      children.some(child => selectedPoints[child])
    );
    this.setData({ parentHasSelected });
  },

  generateQuestions: function() {
    if (this.data.totalQuestions === 0) {
      wx.showToast({ title: '请先选择题目', icon: 'none' });
      return;
    }
    this._generateAndNavigate(this.data.selectedPoints).catch(error => {
      console.error('生成题目失败:', error);
      this.setData({ generating: false });
    });
  },

  // 修改：处理特殊类别的题目生成
  _generateAndNavigate: async function(selectedPoints) {
    if (Object.keys(selectedPoints).length === 0) {
      wx.showToast({ title: '没有选中任何题目', icon: 'none' });
      return;
    }

    this.setData({ generating: true });

    // 不再需要预先加载所有题目，而是按需获取
    console.log('开始生成题目，使用云数据库按需获取...');

    let questions = [];
    let hasSpecialCategory = false;
    let missingPoints = []; // 记录缺失的语法点
    let totalExpected = 0; // 记录期望的总题目数
    
    // 计算期望总题目数
    for (const point in selectedPoints) {
      totalExpected += selectedPoints[point];
    }
    
    // 不再需要映射表，直接使用语法点名称从云数据库获取题目

    // 按需获取每个语法点的题目
    for (const point in selectedPoints) {
      const count = selectedPoints[point];
      if (count > 0) {
        try {
          // 使用云数据加载器按语法点获取题目
          const pointQuestions = await cloudDataLoader.getQuestionsByGrammarPoint(point);
          
          if (pointQuestions.length > 0) {
            // 检查是否为特殊类别
            if (this.isSpecialCategory(point)) {
              hasSpecialCategory = true;
              // 对特殊类别，重复使用桥接问题填充到用户选择的数量
              const bridgeQuestions = pointQuestions.slice(0, Math.min(5, pointQuestions.length));
              for (let i = 0; i < count; i++) {
                questions.push(bridgeQuestions[i % bridgeQuestions.length]);
              }
            } else {
              // 普通类别使用原有逻辑
              const randomQuestions = this.getRandomQuestions(pointQuestions, count);
              questions = questions.concat(randomQuestions);
            }
          } else {
            console.warn(`题库中找不到语法点: ${point}，需要 ${count} 道题`);
            missingPoints.push({ point, count });
          }
        } catch (error) {
          console.error(`获取 ${point} 题目失败:`, error);
          missingPoints.push({ point, count });
        }
      }
    }

    // 🔧 新增：如果有缺失的语法点，用其他题目补充
    if (missingPoints.length > 0 && questions.length < totalExpected) {
      console.log('开始补充缺失的题目...');
      
      let missingCount = totalExpected - questions.length;
      
      // 尝试从云数据库获取一些题目来补充
      try {
        const allQuestions = await cloudDataLoader.loadIntermediateQuestions();
        const availableQuestions = allQuestions.filter(q => q.category && q.category !== '综合练习');
        
        // 随机从可用题目中补充
        while (missingCount > 0 && availableQuestions.length > 0) {
          const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
          questions.push(randomQuestion);
          missingCount--;
          
          console.log(`从 ${randomQuestion.category} 补充了1道题目`);
        }
      } catch (error) {
        console.error('补充题目失败:', error);
      }
      
      // 显示补充信息
      const missingPointsText = missingPoints.map(mp => {
        return `${mp.point}(${mp.count}题)`;
      }).join(', ');
      wx.showToast({
        title: `${missingPointsText} 不存在，已用其他题目补充`,
        icon: 'none',
        duration: 3000
      });
    }

    if (questions.length === 0) {
      wx.showToast({ title: '未能根据您的配置生成有效题目', icon: 'none' });
      this.setData({ generating: false });
      return;
    }

    // 确保题目数量正确
    console.log(`期望题目数: ${totalExpected}, 实际生成: ${questions.length}`);

    this.setData({
      selectedQuestions: questions,
      generating: false
    });

    // 如果包含特殊类别，显示额外提示
    if (hasSpecialCategory) {
      wx.showModal({
        title: '练习提示',
        content: '您选择的题目中包含引导性练习，完成后可前往"书写规范"查看完整表格和更多练习。\n\n请选择题目顺序：',
        confirmText: '顺序',
        cancelText: '乱序',
        success: (res) => {
          if (res.confirm) {
            this.navigateToExercisePage(questions, hasSpecialCategory);
          } else {
            const shuffledQuestions = this.shuffleArray(questions);
            this.navigateToExercisePage(shuffledQuestions, hasSpecialCategory);
          }
        }
      });
    } else {
      wx.showModal({
        title: '选择题目顺序',
        content: '请选择题目的显示顺序',
        confirmText: '顺序',
        cancelText: '乱序',
        success: (res) => {
          if (res.confirm) {
            this.navigateToExercisePage(questions, hasSpecialCategory);
          } else {
            const shuffledQuestions = this.shuffleArray(questions);
            this.navigateToExercisePage(shuffledQuestions, hasSpecialCategory);
          }
        }
      });
    }
  },

  getRandomQuestions: function(array, n) {
    // 添加安全检查
    if (!array || !Array.isArray(array) || array.length === 0) {
      console.warn('getRandomQuestions: 传入的array不是有效数组:', array);
      return [];
    }
    
    if (array.length <= n) {
      return array;
    }
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, n);
  },

  shuffleArray: function(array) {
    // 添加安全检查
    if (!array || !Array.isArray(array) || array.length === 0) {
      console.warn('shuffleArray: 传入的array不是有效数组:', array);
      return [];
    }
    
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // 修改：导航到练习页面时传递特殊类别信息
  navigateToExercisePage: function(questions, hasSpecialCategory = false) {
    const url = `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(questions))}&level=${this.data.level}&hasSpecialCategory=${hasSpecialCategory}`;
    
    wx.navigateTo({
      url: url,
      success: () => this.setData({ generating: false })
    });
  },

  toggleTagsCollapse: function() {
    this.setData({ 
      isTagsCollapsed: !this.data.isTagsCollapsed,
      showTipAnimation: false // 用户点击后隐藏提示
    });
  },

  onLoad: function(options) {
    try {
      this.buildPointToCategoryMap();
      
      // 检查是否来自系统组合调整
      let initialSelectedPoints = {};
      if (options.fromSystemCombo === 'true') {
        console.log('检测到来自系统组合调整的请求');
        // 从本地存储获取系统组合数据
        const systemComboData = wx.getStorageSync('systemComboData');
        if (systemComboData && Object.keys(systemComboData).length > 0) {
          initialSelectedPoints = systemComboData;
          console.log('加载系统组合数据:', systemComboData);
          // 清除存储的数据，避免影响后续操作
          wx.removeStorageSync('systemComboData');
        }
      }
      
      this.setData({
        level: options.level || '中级',
        loading: false,
        showComboBar: false, // 默认不显示组合栏
        selectedPoints: initialSelectedPoints,
        totalQuestions: 0,
        selectedTagsList: [],
        categoryCounts: [],
        expandedCategories: {}
      });
      
      // 检查是否从首页传递了使用自定义组合的参数
      if (options.useCustomCombo === 'true') {
        console.log('检测到来自首页的自定义组合请求');
        // 延迟加载自定义组合，确保页面初始化完成
        setTimeout(() => {
          this.loadCustomComboConfig();
          this.generateCustomCombo();
        }, 500);
      }
      
      // 更新计算数据
      this.updateComputedData();
      
      // 显示动效提示(延迟2秒显示，给用户时间先看到界面)
      setTimeout(() => {
        this.setData({ showTipAnimation: true });
        // 5秒后自动隐藏提示
        setTimeout(() => {
          this.setData({ showTipAnimation: false });
        }, 5000);
      }, 2000);
      
      console.log('页面加载成功');
    } catch (error) {
      console.error('页面加载失败:', error);
      // 即使有错误，也要设置基本状态
      this.setData({
        level: '中级',
        loading: false,
        showComboBar: false,
        selectedPoints: {},
        totalQuestions: 0
      });
    }
  },

  onShow: function() {
    // 页面显示时重新加载自定义组合配置
    this.loadCustomComboConfig();
    
    // 检查是否有待处理的自定义组合请求
    const pendingCustomCombo = wx.getStorageSync('pendingCustomCombo');
    if (pendingCustomCombo) {
      // 清除标志
      wx.removeStorageSync('pendingCustomCombo');
      // 延迟执行，确保页面已完全显示
      setTimeout(() => {
        this.generateCustomCombo();
      }, 300);
    }
    
    // 检查是否有待处理的系统组合请求
    const pendingSystemCombo = wx.getStorageSync('pendingSystemCombo');
    if (pendingSystemCombo) {
      // 清除标志
      wx.removeStorageSync('pendingSystemCombo');
      // 延迟执行，确保页面已完全显示
      setTimeout(() => {
        this.executeSystemCombo();
      }, 300);
    }

    // 检查是否需要自动生成系统组合(来自首页快速练习)
    const autoGenerateSystemCombo = wx.getStorageSync('autoGenerateSystemCombo');
    if (autoGenerateSystemCombo) {
      // 清除标志
      wx.removeStorageSync('autoGenerateSystemCombo');
      console.log('检测到系统组合快速练习请求');
      // 延迟执行，确保页面已完全显示
      setTimeout(() => {
        this.executeSystemCombo(false);
        // 生成完成后直接跳转到练习页面
        setTimeout(() => {
          console.log('系统组合生成完成，准备跳转到练习页面');
          this.generateQuestions();
        }, 1500);
      }, 500);
    }

    // 检查是否需要自动生成专属组合(来自首页快速练习)
    const autoGenerateCustomCombo = wx.getStorageSync('autoGenerateCustomCombo');
    if (autoGenerateCustomCombo) {
      // 清除标志
      wx.removeStorageSync('autoGenerateCustomCombo');
      console.log('检测到专属组合快速练习请求');
      // 延迟执行，确保页面已完全显示
      setTimeout(() => {
        this.generateCustomCombo();
        // 生成完成后直接跳转到练习页面
        setTimeout(() => {
          console.log('专属组合生成完成，准备跳转到练习页面');
          this.generateQuestions();
        }, 1500);
      }, 500);
    }
  },

  toggleCategory: function(e, preSetIndex) {
    const index = e ? e.currentTarget.dataset.index : preSetIndex;
    
    const { expandedCategories } = this.data;
    const isCurrentlyExpanded = expandedCategories[index];

    const newExpandedState = { ...expandedCategories };
    if (isCurrentlyExpanded) {
      delete newExpandedState[index];
    } else {
      newExpandedState[index] = true;
    }
    
    this.setData({ expandedCategories: newExpandedState });
  },

  updateTotalQuestions: function() { /* This function is now obsolete */ },

  increaseCount: function(e) {
    const point = e.currentTarget.dataset.point;
    const { selectedPoints } = this.data;
    const currentCount = selectedPoints[point] || 0;
    if (currentCount < 10) {
      selectedPoints[point] = currentCount + 1;
      this.setData({ selectedPoints });
      this.updateComputedData();
      
      // 如果是特殊类别，提供额外说明
      if (this.isSpecialCategory(point)) {
        wx.showToast({
          title: '此类别提供引导题，更多练习请查看"书写规范"',
          icon: 'none',
          duration: 2000
        });
      }
    }
  },

  decreaseCount: function(e) {
    const point = e.currentTarget.dataset.point;
    const { selectedPoints } = this.data;
    const currentCount = selectedPoints[point] || 0;
    if (currentCount > 0) {
      selectedPoints[point] = currentCount - 1;
      if (selectedPoints[point] === 0) {
        delete selectedPoints[point];
      }
      this.setData({ selectedPoints });
      this.updateComputedData();
    }
  },

  clearSelected: function() {
    this.setData({ 
      selectedPoints: {},
      showTipAnimation: false // 用户点击清空后隐藏提示
    });
    this.updateComputedData();
  },

  buildPointToCategoryMap: function() {
    const pointMap = {};
    this.data.rightPanel.forEach((points, catIndex) => {
      points.forEach(point => {
        const pointName = point.name || point;
        pointMap[pointName] = catIndex;
      });
    });
    this.setData({ pointToCategoryMap: pointMap });
  },

  updateComputedData: function() {
    try {
      const { selectedPoints, pointToCategoryMap, categories } = this.data;
      
      // 确保基本数据结构存在
      if (!selectedPoints || !pointToCategoryMap || !categories) {
        console.warn('基本数据结构不完整, 使用默认值');
        this.setData({
          selectedTagsList: [],
          categoryCounts: new Array(this.data.categories.length).fill(0),
          totalQuestions: 0
        });
        return;
      }
      
      const selectedTagsList = Object.keys(selectedPoints);
      const categoryCounts = new Array(categories.length).fill(0);
      let totalQuestions = 0;

      for (const point in selectedPoints) {
        const count = selectedPoints[point];
        if (typeof count === 'number' && count > 0) {
          totalQuestions += count;
          const catIndex = pointToCategoryMap[point];
          if (catIndex !== undefined && catIndex >= 0 && catIndex < categoryCounts.length) {
            categoryCounts[catIndex] = count;
          }
        }
      }
      
      this.setData({ selectedTagsList, categoryCounts, totalQuestions });
      console.log('数据更新完成:', { selectedTagsList, categoryCounts, totalQuestions });
    } catch (error) {
      console.error('更新计算数据失败:', error);
      // 设置安全的默认值
      this.setData({
        selectedTagsList: [],
        categoryCounts: new Array(this.data.categories.length).fill(0),
        totalQuestions: 0
      });
    }
  },

  removeTag: function(e) {
    const point = e.currentTarget.dataset.point;
    const { selectedPoints } = this.data;
    delete selectedPoints[point];
    this.setData({ selectedPoints });
    this.updateComputedData();
  },

  // 新增：格式化专属组合配置用于显示
  getFormattedComboConfig: function() {
    if (!this.data.customComboConfig) {
      this.setData({ formattedComboConfig: [] });
      return [];
    }
    
    const formattedConfig = [];
    
    Object.keys(this.data.customComboConfig).forEach(category => {
      const categoryConfig = this.data.customComboConfig[category];
      
      if (typeof categoryConfig === 'object' && categoryConfig !== null) {
        const subPoints = [];
        Object.keys(categoryConfig).forEach(subPoint => {
          const count = categoryConfig[subPoint];
          if (typeof count === 'number' && count > 0) {
            subPoints.push({
              name: subPoint,
              count: count
            });
          }
        });
        
        if (subPoints.length > 0) {
          formattedConfig.push({
            category: category,
            subPoints: subPoints
          });
        }
      }
    });
    
    console.log('[格式化配置] 格式化后的配置:', formattedConfig);
    this.setData({ formattedComboConfig: formattedConfig });
    return formattedConfig;
  },

  // 新增：计算专属组合总题数
  getCustomComboTotalCount: function() {
    try {
      if (!this.data.customComboConfig) {
        console.log('[计算总题数] 配置不存在');
        return 0;
      }
      
      let totalCount = 0;
      console.log('[计算总题数] 开始计算，配置:', this.data.customComboConfig);
      
      Object.keys(this.data.customComboConfig).forEach(category => {
        const categoryConfig = this.data.customComboConfig[category];
        console.log(`[计算总题数] 处理大类 ${category}:`, categoryConfig);
        
        if (typeof categoryConfig === 'object' && categoryConfig !== null) {
          Object.values(categoryConfig).forEach(count => {
            if (typeof count === 'number' && count > 0) {
              totalCount += count;
              console.log(`[计算总题数] 添加 ${count} 题，当前总计: ${totalCount}`);
            }
          });
        } else if (typeof categoryConfig === 'number' && categoryConfig > 0) {
          totalCount += categoryConfig;
          console.log(`[计算总题数] 添加 ${categoryConfig} 题，当前总计: ${totalCount}`);
        }
      });
      
      console.log(`[计算总题数] 最终总计: ${totalCount} 题`);
      return totalCount;
    } catch (error) {
      console.error('[计算总题数] 计算过程中出现错误:', error);
      return 0;
    }
  },

  // 新增：清除专属组合配置
  clearCustomCombo: function() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除您的专属组合配置吗？此操作不可撤销。',
      confirmText: '确认清除',
      cancelText: '取消',
      confirmColor: '#fa5151',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('customCombo');
            this.setData({
              isCustomComboSet: false,
              customComboConfig: null,
              formattedComboConfig: [],
            });
            wx.showToast({ title: '配置已清除', icon: 'success' });
          } catch (e) {
            wx.showToast({ title: '清除失败', icon: 'none' });
          }
        }
      }
    });
  },

  // 新增：处理综合大类点击
  handleComprehensiveClick: function() {
    console.log('[综合大类] 点击综合大类，显示操作栏');
    this.setData({ showComboBar: true });
    // 加载自定义组合配置
    this.loadCustomComboConfig();
    
    // 调试：检查配置状态
    setTimeout(() => {
      console.log('[综合大类] 配置状态检查:', {
        isCustomComboSet: this.data.isCustomComboSet,
        customComboConfig: this.data.customComboConfig,
        totalCount: this.getCustomComboTotalCount()
      });
    }, 100);
  },

  // 新增：加载自定义组合配置(适配多组合)
  loadCustomComboConfig: function() {
    console.log('=== 开始加载自定义组合配置 ===');
    try {
      const savedCombos = wx.getStorageSync('customCombos') || [];
      console.log('从存储中读取的组合数据:', savedCombos);
      
      if (savedCombos.length > 0) {
        console.log('✅ 组合存在且已设置');
        console.log('组合数量:', savedCombos.length);
        console.log('第一个组合内容:', savedCombos[0]);
        
        // 使用第一个组合作为当前配置
        const currentConfig = savedCombos[0].config;
        
        this.setData({
          isCustomComboSet: true,
          customComboConfig: currentConfig
        }, () => {
          console.log('✅ 状态更新完成');
          console.log('isCustomComboSet:', this.data.isCustomComboSet);
          console.log('customComboConfig:', this.data.customComboConfig);
          
          // 格式化配置用于显示
          this.getFormattedComboConfig();
        });
      } else {
        console.log('❌ 组合不存在或未设置');
        
        this.setData({
          isCustomComboSet: false,
          customComboConfig: null,
          formattedComboConfig: []
        }, () => {
          console.log('✅ 状态重置完成');
          console.log('isCustomComboSet:', this.data.isCustomComboSet);
        });
      }
    } catch (error) {
      console.error('❌ 加载自定义组合配置失败:', error);
      this.setData({
        isCustomComboSet: false,
        customComboConfig: null,
        formattedComboConfig: []
      });
    }
    console.log('=== 加载自定义组合配置结束 ===');
  },

  // 新增：预览系统推荐组合
  previewSystemCombo: function() {
    wx.showModal({
      title: '系统推荐组合',
      content: '将为您展示系统推荐的题目组合，您可以查看并调整选择。',
      confirmText: '查看选题',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 这里可以跳转到预览页面或显示详细信息
          // 目前先调用原有的生成逻辑，但不直接跳转练习页面
          this.executeSystemCombo(true); // 传递preview参数
        }
      }
    });
  },

  // 新增：系统默认组合功能
  generateSystemCombo: function() {
    // 检查是否已有选中的题目
    if (Object.keys(this.data.selectedPoints).length > 0) {
      wx.showModal({
        title: '提示',
        content: '系统默认组合将覆盖已选题，是否继续？',
        confirmText: '继续',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.executeSystemCombo(false);
          }
        }
      });
    } else {
      this.executeSystemCombo(false);
    }
  },

  // 新增：执行系统默认组合逻辑
  executeSystemCombo: function(isPreview = false) {
    const applyCombo = () => {
      const systemComboRules = {
        "介词": 1,
        "代词": 1,
        "连词": 1,
        "冠词": 1,
        "名词": 1,
        "动词": 1,
        "谓语": 1,
        "非谓语": { "现在分词综合": 1, "过去分词综合": 1, "不定式综合": 1 },
        "形容词/副词": 1,
        "定语从句/状语和从句": 1
      };

      const selectedPoints = {};
      const getRandomChoice = (options) => {
        return options[Math.floor(Math.random() * options.length)];
      };

      Object.keys(systemComboRules).forEach(category => {
        const rule = systemComboRules[category];
        if (typeof rule === 'number') {
          let choice = category;
          if (category === "形容词/副词") choice = getRandomChoice(["形容词", "副词"]);
          else if (category === "定语从句/状语和从句") choice = getRandomChoice(["定语从句", "状语和从句"]);
          
          const subPoints = this.getSubPointsByCategory(choice);
          if (subPoints.length > 0) {
            const randomPoint = subPoints[Math.floor(Math.random() * subPoints.length)];
            selectedPoints[randomPoint] = rule;
          }
        } else if (typeof rule === 'object') {
          Object.keys(rule).forEach(subPoint => {
            if (this.isPointExists(subPoint)) selectedPoints[subPoint] = rule[subPoint];
          });
        }
      });
      
      while (Object.keys(selectedPoints).length > 10) {
        const keys = Object.keys(selectedPoints);
        const keyToRemove = keys[Math.floor(Math.random() * keys.length)];
        delete selectedPoints[keyToRemove];
      }

      this.setData({ selectedPoints, showComboBar: false });
      this.updateComputedData();
      
      if (isPreview) {
        wx.showToast({ title: '系统组合已加载，可查看调整', icon: 'none', duration: 1500 });
      } else {
        wx.showToast({ title: '系统组合已加载', icon: 'none', duration: 1500 });
      }
    };

    if (Object.keys(this.data.selectedPoints).length > 0) {
      wx.showModal({
        title: '确认覆盖',
        content: '加载系统默认组合将覆盖您当前的选题，是否继续？',
        success: (res) => {
          if (res.confirm) applyCombo();
        }
      });
    } else {
      applyCombo();
    }
  },

  // 新增：根据大类获取子点列表 (最终正确版)
  getSubPointsByCategory: function(category) {
    console.log(`[FINAL] 获取分类 ${category} 的子点列表`);
    
    const categoryIndex = this.data.categories.indexOf(category);
    if (categoryIndex === -1) {
      console.log(`[FINAL] 未找到分类 ${category} 的索引`);
      return [];
    }

    const subPoints = this.data.rightPanel[categoryIndex];
    if (!subPoints) {
      console.log(`[FINAL] 分类 ${category} 在 rightPanel 中没有子点`);
      return [];
    }
    
    // 最终正确逻辑：返回该分类下所有在白名单中的知识点名称
    const validPointNames = subPoints
      .map(point => (typeof point === 'object' ? point.name : point))
      .filter(pointName => this.isPointExists(pointName));

    console.log(`[FINAL] 分类 ${category} 的有效子点:`, validPointNames);
    return validPointNames;
  },

  // 新增：检查语法点是否存在
  isPointExists: function(pointName) {
    // 根据实际的题目数据结构检查语法点是否存在
    // 这里需要根据questions.js中的实际数据来判断
    const validPoints = [
      // 新增：所有综合类知识点
      "介词综合", "代词综合", "连词综合", "冠词综合", "名词综合", 
      "谓语", "时态(一般过去时)", "时态(一般将来时)", "时态(过去将来时)", 
      "时态(现在进行时)", "时态(过去进行时)", "时态(现在完成时)", "时态(过去完成时)", 
      "语态(被动+八大时态)", "形容词综合", "副词综合", "定语从句综合", "状语从句综合",
      "综合练习", "并列连词综合", "从属连词综合", "复合词和外来词", "单复数同形", "不规则复数", "以f/fe结尾",

      // 原有知识点
      "固定搭配", "介词 + 名词/动名词", "人称代词", "物主代词", "反身代词", "关系代词", "it相关",
      "连词与名/动/形/副综合", "连词与名词", "连词与动词", "连词与形容词",
      "泛指与特指", "a和an", "the的特殊用法", 
      "以o结尾", "以y结尾", "s/sh/ch/x结尾",
      "现在分词综合", "过去分词综合", "不定式综合",
      "比较级", "最高级",
      "副词修饰动词", "副词修饰形容词/副词", 
      "that能填吗", "who和which选哪个", "whose", 
      "which和when/where混淆", "when", "where", "how", "why"
    ];
    
    return validPoints.includes(pointName);
  },

  // 新增：添加系统默认组合标签
  addSystemComboTag: function(totalCount) {
    const systemTag = `系统默认组合(${totalCount}题)`;
    // 这里可以添加特殊的标签显示逻辑
    console.log('添加系统默认组合标签:', systemTag);
  },

  // 新增：获取所有知识点
  getAllPoints: function() {
      const allPoints = [];
      this.data.rightPanel.forEach(subPoints => {
          subPoints.forEach(point => {
              const pointName = typeof point === 'object' ? point.name : point;
              if (this.isPointExists(pointName)) {
                  allPoints.push(pointName);
              }
          });
      });
      return [...new Set(allPoints)]; // 去重
  },

  // 新增：添加专属组合标签
  addCustomComboTag: function(totalCount) {
    const customTag = `我的专属组合(${totalCount}题)`;
    console.log('添加专属组合标签:', customTag);
  },

  // 新增：跳转到专属组合设置页
  navigateToCustomComboSetting: function() {
    const that = this;
    wx.navigateTo({
      url: '/pages/custom-combo-setting/index',
      events: {
        // 监听设置页返回的数据
        customComboSet: (config) => {
          that.saveCustomComboConfig(config);
        }
      },
      success: function() {
        // 页面跳转成功后的回调
        console.log('跳转到专属组合设置页面成功');
      },
      fail: function(error) {
        console.error('跳转到专属组合设置页面失败:', error);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 新增：保存自定义组合配置(适配多组合)
  saveCustomComboConfig: function(combos) {
    console.log('开始保存自定义组合配置:', combos);
    try {
      // 保存到新的多组合存储
      wx.setStorageSync('customCombos', combos);
      console.log('组合已保存到存储:', combos);
      
      // 更新页面状态(使用第一个组合作为当前配置)
      const isSet = combos && combos.length > 0;
      const currentConfig = isSet ? combos[0].config : null;
      
      this.setData({
        isCustomComboSet: isSet,
        customComboConfig: currentConfig
      }, () => {
        console.log('页面状态已更新');
        
        // 格式化配置用于显示
        this.getFormattedComboConfig();
      });
      
      wx.showToast({
        title: '专属组合设置成功',
        icon: 'success'
      });
      
      // 重新加载配置以确保状态正确
      setTimeout(() => {
        this.loadCustomComboConfig();
      }, 100);
      
    } catch (error) {
      console.error('保存自定义组合配置失败:', error);
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      });
    }
  },

  // 新增：生成自定义组合题目(支持多组合选择)
  generateCustomCombo: function() {
    console.log('=== [ULTIMATE] 开始生成自定义组合 ===');
    
    const savedCombos = wx.getStorageSync('customCombos') || [];
    if (savedCombos.length === 0) {
      wx.showToast({ title: '专属组合未设置', icon: 'none' });
      return;
    }

    if (savedCombos.length === 1) {
      // 只有一个组合，直接使用
      this.applyCustomCombo(savedCombos[0].config);
    } else {
      // 多个组合，显示选择界面
      this.showComboSelection(savedCombos);
    }
  },

  // 显示组合选择界面
  showComboSelection: function(combos) {
    const comboList = combos.map((combo, index) => ({
      name: combo.name,
      count: combo.totalCount,
      index: index
    }));

    wx.showActionSheet({
      itemList: comboList.map(combo => `${combo.name} (${combo.count}题)`),
      success: (res) => {
        const selectedCombo = combos[res.tapIndex];
        if (selectedCombo) {
          this.applyCustomCombo(selectedCombo.config);
        }
      },
      fail: (res) => {
        console.log('用户取消选择组合');
      }
    });
  },

  // 应用自定义组合
  applyCustomCombo: function(config) {
    const applyCombo = () => {
      if (!config) {
        wx.showToast({ title: '专属组合配置无效', icon: 'none' });
        return;
      }
      const selectedPoints = {};
      let totalToSelect = 0;
      let totalActuallySelected = 0;
      const notFoundPoints = [];

      // 1. 根据配置生成题目(新格式：大类下包含小类对象)
      Object.keys(config).forEach(category => {
        const categoryConfig = config[category];
        
        // 处理新格式：大类下包含小类对象
        if (typeof categoryConfig === 'object' && categoryConfig !== null) {
          Object.keys(categoryConfig).forEach(subPoint => {
            const countToSelect = categoryConfig[subPoint];
            if (countToSelect && countToSelect > 0) {
              totalToSelect += countToSelect;
              
              // 检查小类是否存在
              if (this.isPointExists(subPoint)) {
                selectedPoints[subPoint] = countToSelect;
                totalActuallySelected += countToSelect;
              } else {
                notFoundPoints.push({ point: subPoint, count: countToSelect });
              }
            }
          });
        } else if (typeof categoryConfig === 'number' && categoryConfig > 0) {
          // 兼容旧格式：大类直接对应数字
          totalToSelect += categoryConfig;
          const availablePoints = this.getSubPointsByCategory(category);
          if (availablePoints && availablePoints.length > 0) {
            const shuffled = [...availablePoints].sort(() => 0.5 - Math.random());
            const pointsToSelect = shuffled.slice(0, categoryConfig);
            pointsToSelect.forEach(point => {
              selectedPoints[point] = 1;
            });
            totalActuallySelected += pointsToSelect.length;
          }
        }
      });
      
      console.log(`[ULTIMATE] 配置要求 ${totalToSelect} 题，实际选中 ${totalActuallySelected} 题`);

      // 2. Fallback机制: 如果初始选中的题目不够，则从全库随机补齐
      const remainingCount = totalToSelect - totalActuallySelected;
      if (remainingCount > 0) {
        console.log(`[ULTIMATE] 题目数量不足，需要补充 ${remainingCount} 题`);
        const allPoints = this.getAllPoints();
        const existingPoints = Object.keys(selectedPoints);
        const pointsPool = allPoints.filter(p => !existingPoints.includes(p));
        
        const shuffledPool = [...pointsPool].sort(() => 0.5 - Math.random());
        const extraPoints = shuffledPool.slice(0, remainingCount);
        extraPoints.forEach(point => {
          selectedPoints[point] = 1;
        });
        console.log(`[ULTIMATE] 已补充 ${extraPoints.length} 题`);
      }

      // 3. 更新状态并通知用户
      this.setData({ selectedPoints: {}, showComboBar: false }, () => {
        this.setData({ selectedPoints }, () => {
          this.updateComputedData();
          let toastTitle = '专属组合已加载';
          if (notFoundPoints.length > 0) {
            toastTitle = '部分题目缺失,已随机补齐';
          }
          wx.showToast({ title: toastTitle, icon: 'none', duration: 2000 });
        });
      });
    };

    if (Object.keys(this.data.selectedPoints).length > 0) {
      wx.showModal({
        title: '确认覆盖',
        content: '加载您的专属组合将覆盖您当前的选题，是否继续？',
        success: (res) => { if (res.confirm) applyCombo(); }
      });
    } else {
      applyCombo();
    }
  },

  // 新增：隐藏操作栏
  hideComboBar: function() {
    this.setData({ 
      showComboBar: false,
      showComboMenu: false,
      showTooltip: false
    });
  },

  // 新增：菜单相关功能
  toggleComboMenu: function() {
    this.setData({ showComboMenu: !this.data.showComboMenu });
  },

  // 新增：显示更多操作提示
  showMoreOpsTooltip: function() {
    this.setData({ showTooltip: true });
    
    // 3秒后自动隐藏tooltip
    setTimeout(() => {
      this.setData({ showTooltip: false });
    }, 3000);
  },

  // 新增：跳转到语法测试
  navigateToGrammarTest: function() {
    wx.navigateTo({
      url: '/pages/ability-test/grammar-test?from=module'
    });
  }
}); 