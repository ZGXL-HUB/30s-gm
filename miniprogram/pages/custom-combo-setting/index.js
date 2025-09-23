// 引入隐藏语法点配置
const hiddenPointsConfig = require('../../config/hidden-points.js');

Page({
  data: {
    // 不包含"综合"大类，只包含其他12个大类
    categories: [
      "介词", "代词", "连词", "冠词", "名词", "动词",
      "谓语", "非谓语", "形容词", "副词", "定语从句", "状语和从句"
    ],
    // 每个大类对应的小类列表(不包含"综合"大类)
    subCategories: [
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
    // 手风琴展开状态
    expandedCategories: {},
    // 小类配置：{ "小类名": 数量 }
    subCategoryConfigs: {},
    // 存储每个大类的选中题数，用于模板显示
    categoryCounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 12个大类，初始化为0
    totalCount: 0,
    maxTotalCount: 20, // 最大总题数限制
    loading: true,
    
    // 新增：多组合管理相关
    comboName: '', // 当前组合名称
    savedCombos: [], // 已保存的组合列表
    showComboList: false, // 是否显示组合列表
    showNameInput: false, // 是否显示名称输入框
    showNewComboModal: false, // 是否显示新建组合提示弹窗
    editingComboIndex: -1 // 正在编辑的组合索引，-1表示新建
  },

  onLoad: function() {
    this.loadSavedCombos();
    this.initSubCategoryConfigs(() => {
      this.setData({ 
        loading: false,
        // 默认展开第一个大类，让用户能看到手风琴效果
        expandedCategories: { 0: true }
      });
    });
  },

  onHide: function() {
    // 页面隐藏时，如果有未保存的编辑，提示用户
    if (this.data.editingComboIndex >= 0 && this.data.totalCount > 0) {
      // 静默处理，不显示提示
    }
  },

  onShow: function() {
    // 页面显示时重新加载组合数据
    this.loadSavedCombos();
    
    // 如果正在编辑，检查编辑的组合是否还存在
    if (this.data.editingComboIndex >= 0) {
      const savedCombos = wx.getStorageSync('customCombos') || [];
      if (this.data.editingComboIndex >= savedCombos.length) {
        // 编辑的组合已被删除，重置编辑状态
        this.cancelEdit();
      }
    }
    
    // 强制更新一次计数，确保显示正确
    this.updateCategoryCounts();
  },

  // 检查语法点是否被隐藏
  isHiddenPoint: function(point) {
    return hiddenPointsConfig.isHidden(point);
  },

  // 初始化小类配置
  initSubCategoryConfigs: function(callback) {
    const subCategoryConfigs = {};
    this.data.subCategories.forEach(categorySubs => {
      categorySubs.forEach(sub => {
        const subName = typeof sub === 'object' ? sub.name : sub;
        // 过滤掉被隐藏的语法点
        if (!hiddenPointsConfig.isHidden(subName)) {
          subCategoryConfigs[subName] = 0;
        }
      });
    });
    this.setData({ subCategoryConfigs }, callback);
  },

  // 加载现有配置
  loadExistingConfig: function() {
    let hasLoadedConfig = false;
    
    try {
      const customCombo = wx.getStorageSync('customCombo');
      if (customCombo && customCombo.isSet && customCombo.config) {
        const subCategoryConfigs = { ...this.data.subCategoryConfigs };
        let totalCount = 0;

        // 处理现有配置，将其转换为小类配置
        Object.keys(customCombo.config).forEach(category => {
          const count = customCombo.config[category];
          if (typeof count === 'number' && count > 0) {
            // 找到该大类下的小类，随机分配题目数量
            const categoryIndex = this.data.categories.indexOf(category);
            if (categoryIndex !== -1) {
              const subCats = this.data.subCategories[categoryIndex];
              const validSubCats = subCats.filter(sub => {
                const subName = typeof sub === 'object' ? sub.name : sub;
                return this.isPointExists(subName);
              });
              
              if (validSubCats.length > 0) {
                // 随机分配题目数量到小类
                let remainingCount = count;
                const shuffled = [...validSubCats].sort(() => 0.5 - Math.random());
                
                shuffled.forEach((sub, index) => {
                  const subName = typeof sub === 'object' ? sub.name : sub;
                  if (remainingCount > 0) {
                    const assignCount = index === shuffled.length - 1 ? remainingCount : Math.ceil(remainingCount / (shuffled.length - index));
                    subCategoryConfigs[subName] = assignCount;
                    totalCount += assignCount;
                    remainingCount -= assignCount;
                  }
                });
              }
            }
          } else if (typeof count === 'object') {
            // 处理复杂配置(如非谓语)
            Object.keys(count).forEach(subPoint => {
              if (count[subPoint] > 0) {
                subCategoryConfigs[subPoint] = count[subPoint];
                totalCount += count[subPoint];
              }
            });
          }
        });

        this.setData({ subCategoryConfigs, totalCount }, () => {
          this.updateCategoryCounts();
        });
        hasLoadedConfig = true;
      }
    } catch (error) {
      console.error('加载现有配置失败:', error);
    }
    
    // 如果没有加载到现有配置，也要初始化计数
    if (!hasLoadedConfig) {
      this.updateCategoryCounts();
    }
  },

  // 加载已保存的组合
  loadSavedCombos: function() {
    try {
      const savedCombos = wx.getStorageSync('customCombos') || [];
      this.setData({ savedCombos });
    } catch (error) {
      console.error('加载保存的组合失败:', error);
    }
  },

  // 显示组合列表
  showComboList: function() {
    if (this.data.editingComboIndex >= 0) {
      wx.showToast({
        title: '请先完成当前编辑',
        icon: 'none'
      });
      return;
    }
    this.setData({ showComboList: true });
  },

  // 隐藏组合列表
  hideComboList: function() {
    this.setData({ showComboList: false });
  },

  // 显示新建组合提示弹窗
  showNewComboModal: function() {
    this.setData({ showNewComboModal: true });
  },

  // 隐藏新建组合提示弹窗
  hideNewComboModal: function() {
    this.setData({ showNewComboModal: false });
  },

  // 开始新建组合
  startNewCombo: function() {
    this.hideNewComboModal();
    this.hideComboList();
    // 清空当前设置，准备新建
    this.initSubCategoryConfigs(() => {
      this.setData({ 
        totalCount: 0,
        editingComboIndex: -1,
        comboName: ''
      }, () => {
        this.updateCategoryCounts();
        wx.showToast({
          title: '开始新建组合',
          icon: 'success'
        });
      });
    });
  },

  // 显示名称输入框
  showNameInput: function() {
    if (this.data.editingComboIndex >= 0) {
      wx.showToast({
        title: '请先完成当前编辑',
        icon: 'none'
      });
      return;
    }
    this.setData({ 
      showNameInput: true,
      comboName: '',
      editingComboIndex: -1
    });
  },

  // 隐藏名称输入框
  hideNameInput: function() {
    this.setData({ showNameInput: false });
  },

  // 输入组合名称
  onComboNameInput: function(e) {
    this.setData({ comboName: e.detail.value });
  },

  // 确认组合名称
  confirmComboName: function() {
    const { comboName, editingComboIndex, savedCombos } = this.data;
    if (!comboName.trim()) {
      wx.showToast({
        title: '请输入组合名称',
        icon: 'none'
      });
      return;
    }
    
    // 检查名称是否重复(编辑时排除自己)
    const existingNames = savedCombos
      .filter((_, index) => index !== editingComboIndex)
      .map(combo => combo.name);
    
    if (existingNames.includes(comboName.trim())) {
      wx.showToast({
        title: '组合名称已存在',
        icon: 'none'
      });
      return;
    }
    
    this.hideNameInput();
    this.saveCombo();
  },

  // 取消组合名称输入
  cancelComboName: function() {
    this.hideNameInput();
  },

  // 确认保存
  confirmSave: function() {
    if (this.data.totalCount === 0) {
      wx.showToast({
        title: '请至少选择1题',
        icon: 'none'
      });
      return;
    }
    
    // 直接保存当前编辑的组合
    this.saveCombo();
  },

  // 取消编辑
  cancelEdit: function() {
    this.initSubCategoryConfigs(() => {
      this.setData({ 
        totalCount: 0,
        editingComboIndex: -1,
        comboName: '',
        showComboList: false
      }, () => {
        this.updateCategoryCounts();
        wx.showToast({
          title: '已取消编辑',
          icon: 'success'
        });
      });
    });
  },

  // 编辑已有组合
  editCombo: function(e) {
    const index = e.currentTarget.dataset.index;
    const combo = this.data.savedCombos[index];
    
    if (!combo) return;
    
    if (this.data.editingComboIndex >= 0 && this.data.editingComboIndex !== index) {
      wx.showToast({
        title: '请先完成当前编辑',
        icon: 'none'
      });
      return;
    }
    
    // 加载组合配置
    this.setData({
      subCategoryConfigs: combo.config,
      totalCount: this.calculateTotalCount(combo.config),
      editingComboIndex: index,
      comboName: combo.name
    }, () => {
      this.updateCategoryCounts();
      this.hideComboList();
      wx.showToast({
        title: '已加载组合配置',
        icon: 'success'
      });
    });
  },

  // 删除组合
  deleteCombo: function(e) {
    const index = e.currentTarget.dataset.index;
    const combo = this.data.savedCombos[index];
    
    if (!combo) return;
    
    if (this.data.editingComboIndex >= 0) {
      wx.showToast({
        title: '请先完成当前编辑',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除组合"${combo.name}"吗？`,
      confirmText: '删除',
      cancelText: '取消',
      confirmColor: '#fa5151',
      success: (res) => {
        if (res.confirm) {
          const savedCombos = [...this.data.savedCombos];
          savedCombos.splice(index, 1);
          
          try {
            wx.setStorageSync('customCombos', savedCombos);
            
            // 如果删除的是正在编辑的组合，重置编辑状态
            let newEditingIndex = this.data.editingComboIndex;
            if (index === this.data.editingComboIndex) {
              newEditingIndex = -1;
              this.initSubCategoryConfigs(() => {
                this.setData({ 
                  savedCombos,
                  editingComboIndex: newEditingIndex,
                  comboName: '',
                  totalCount: 0
                }, () => {
                  this.updateCategoryCounts();
                });
              });
            } else {
              this.setData({ savedCombos });
            }
            
            wx.showToast({
              title: '组合已删除',
              icon: 'success'
            });
          } catch (error) {
            console.error('删除组合失败:', error);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 计算总题数
  calculateTotalCount: function(config) {
    let total = 0;
    Object.keys(config).forEach(subCategory => {
      total += config[subCategory] || 0;
    });
    return total;
  },

  // 切换手风琴展开状态
  toggleCategory: function(e) {
    const index = e.currentTarget.dataset.index;
    const { expandedCategories } = this.data;
    const newExpandedState = { ...expandedCategories };
    
    if (newExpandedState[index]) {
      delete newExpandedState[index];
    } else {
      newExpandedState[index] = true;
    }
    
    this.setData({ expandedCategories: newExpandedState });
  },

  // 增加小类题数
  increaseSubCount: function(e) {
    const subCategory = e.currentTarget.dataset.subCategory;
    const { subCategoryConfigs, totalCount, maxTotalCount } = this.data;
    
    if (totalCount >= maxTotalCount) {
      wx.showToast({
        title: `最多只能设置${maxTotalCount}题`,
        icon: 'none'
      });
      return;
    }

    subCategoryConfigs[subCategory] = (subCategoryConfigs[subCategory] || 0) + 1;
    this.setData({ 
      subCategoryConfigs,
      totalCount: totalCount + 1
    }, () => {
      this.updateCategoryCounts();
    });
  },

  // 减少小类题数
  decreaseSubCount: function(e) {
    const subCategory = e.currentTarget.dataset.subCategory;
    const { subCategoryConfigs, totalCount } = this.data;
    
    if ((subCategoryConfigs[subCategory] || 0) <= 0) return;

    subCategoryConfigs[subCategory] -= 1;
    this.setData({ 
      subCategoryConfigs,
      totalCount: totalCount - 1
    }, () => {
      this.updateCategoryCounts();
    });
  },

  // 获取大类下已选中的小类数量
  getCategorySelectedCount: function(categoryIndex) {
    const { subCategoryConfigs } = this.data;
    const subCats = this.data.subCategories[categoryIndex];
    let count = 0;
    
    subCats.forEach(sub => {
      const subName = typeof sub === 'object' ? sub.name : sub;
      const subCount = subCategoryConfigs[subName] || 0;
      count += subCount;
    });
    
    return count;
  },

  // 更新所有大类的选中题数
  updateCategoryCounts: function() {
    const categoryCounts = [];
    
    for (let i = 0; i < this.data.categories.length; i++) {
      const categoryName = this.data.categories[i];
      const count = this.getCategorySelectedCount(i);
      categoryCounts[i] = count;
    }
    
    // 强制更新，确保数据同步
    this.setData({ 
      categoryCounts: categoryCounts
    });
  },

  // 检查语法点是否存在(与语法分点页面保持一致)
  isPointExists: function(pointName) {
    // 首先检查是否被隐藏
    if (hiddenPointsConfig.isHidden(pointName)) {
      return false;
    }
    
    const validPoints = [
      // 所有综合类知识点
      "介词综合", "代词综合", "连词综合", "冠词综合", "名词综合", "动词综合", 
      "谓语", "非谓语", "形容词综合", "副词综合", "定语从句综合", "状语和从句",
      "综合练习", "并列连词综合", "从属连词综合", "复合词和外来词", "单复数同形", "不规则复数", "以f/fe结尾",

      // 原有知识点
      "固定搭配", "介词 + 名词/动名词", "人称代词", "物主代词", "反身代词", "关系代词", "it相关",
      "连词与名/动/形/副综合", "连词与名词", "连词与动词", "连词与形容词",
      "泛指与特指", "a和an", "the的特殊用法", 
      "以o结尾", "以y结尾", "s/sh/ch/x结尾",
      "被动写be吗", "并列句与动词", "主从句与动词", "插入语与动词",
      "时态(一般过去时)", "时态(一般将来时)", "时态(过去将来时)", "时态(现在进行时)", "时态(过去进行时)", "时态(现在完成时)", "时态(过去完成时)", "语态(被动+八大时态)",
      "现在分词综合", "过去分词综合", "不定式综合",
      "比较级", "最高级",
      "副词修饰动词", "副词修饰句子", "副词修饰形容词/副词", 
      "that能填吗", "who和which选哪个", "whose", 
      "which和when/where混淆", "when", "where", "how", "why"
    ];
    
    return validPoints.includes(pointName);
  },

  // 清空所有设置
  clearAll: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空当前设置吗？',
      confirmText: '确定清空',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.initSubCategoryConfigs(() => {
            this.setData({ 
              totalCount: 0,
              editingComboIndex: -1,
              comboName: ''
            }, () => {
              this.updateCategoryCounts();
              wx.showToast({
                title: '已清空当前设置',
                icon: 'success'
              });
            });
          });
        }
      }
    });
  },

  // 保存专属组合
  saveCombo: function() {
    const { subCategoryConfigs, totalCount, comboName, editingComboIndex } = this.data;
    
    if (totalCount === 0) {
      wx.showToast({
        title: '请至少选择1题',
        icon: 'none'
      });
      return;
    }

    // 构建配置对象：按大类分组
    const config = {};
    this.data.categories.forEach((category, categoryIndex) => {
      const subCats = this.data.subCategories[categoryIndex];
      let categoryTotal = 0;
      const categoryConfig = {};
      
      subCats.forEach(sub => {
        const subName = typeof sub === 'object' ? sub.name : sub;
        const count = subCategoryConfigs[subName] || 0;
        if (count > 0) {
          categoryConfig[subName] = count;
          categoryTotal += count;
        }
      });
      
      if (categoryTotal > 0) {
        config[category] = categoryConfig;
      }
    });

    // 保存配置到多组合存储
    try {
      const savedCombos = [...this.data.savedCombos];
      const comboData = {
        name: comboName || `专属组合${savedCombos.length + 1}`,
        config: config,
        totalCount: totalCount,
        createTime: new Date().toISOString()
      };

      if (editingComboIndex >= 0) {
        // 编辑现有组合
        savedCombos[editingComboIndex] = comboData;
      } else {
        // 新建组合
        savedCombos.push(comboData);
      }

      wx.setStorageSync('customCombos', savedCombos);

      // 更新页面状态
      this.setData({ 
        savedCombos,
        editingComboIndex: -1,
        comboName: '',
        showComboList: false,
        showNameInput: false
      });

      wx.showToast({
        title: editingComboIndex >= 0 ? '组合更新成功' : '组合保存成功',
        icon: 'success',
        duration: 1500
      });

      // 通知上一页
      const eventChannel = this.getOpenerEventChannel();
      if (eventChannel) {
        eventChannel.emit('customComboSet', savedCombos);
      }



    } catch (error) {
      console.error('保存配置失败:', error);
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      });
    }
  },

  // 阻止事件冒泡
  stopPropagation: function(e) {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
  },

  // 返回上一页
  goBack: function() {
    if (this.data.editingComboIndex >= 0) {
      wx.showModal({
        title: '确认离开',
        content: '您正在编辑组合，离开将丢失未保存的修改，确定要离开吗？',
        confirmText: '离开',
        cancelText: '继续编辑',
        confirmColor: '#fa5151',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  }
}); 