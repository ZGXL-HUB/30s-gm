Page({
  data: {
    // 书写规范分类
    categories: [
      "代词书写", "名词变复数", "动词分词书写", "时态书写", 
      "语态书写", "比较级最高级书写", "形容词变副词书写"
    ],
    
    // 代词部分的小类
    pronounSubCategories: [
      "代词一（顺序）", "代词二（乱序）"
    ],
    
    // 名词变复数部分的小类
    nounSubCategories: [
      "名词后缀识别（一）", "名词后缀识别（二）", "名词后缀识别（三）", "规则变复数"
    ],
    
    // 动词分词书写部分的小类
    verbSubCategories: [
      "现在分词书写", "过去分词书写"
    ],
    
    // 时态书写部分的小类
    tenseSubCategories: [
      "时态书写"
    ],
    
    // 语态书写部分的小类
    voiceSubCategories: [
      "语态填表练习（一般现在时）",
      "语态填表练习（一般过去时）",
      "语态填表练习（一般将来时）",
      "语态填表练习（条件时态）",
      "语态填表练习（现在进行时）",
      "语态填表练习（过去进行时）",
      "语态填表练习（现在完成时）",
      "语态填表练习（过去完成时）"
    ],
    
    // 比较级最高级部分的小类
    comparisonSubCategories: [
      "形容词前后缀识别", "比较级书写", "最高级书写"
    ],
    
    // 形容词变副词部分的小类
    adverbSubCategories: [
      "形容词变副词书写"
    ],
    
    // 展开状态
    expandedCategories: {},
    
    // 选中的表格
    selectedTables: {},
    
    // 选中表格数量
    selectedCount: 0,
    
    // 代词表格数据
    pronounTables: [],
    
    // 名词表格数据
    nounTables: [],
    
    // 动词表格数据
    verbTables: [],
    
    // 时态表格数据
    tenseTables: [],
    
    // 语态表格数据
    voiceTables: [],
    
    // 比较级最高级表格数据
    comparisonTables: [],
    
    // 副词表格数据
    adverbTables: [],
    
    // 错误标记相关
    errorTables: [], // 用户错误过的表格ID列表
    errorStats: {}, // 表格错误统计
    showErrorMarking: true, // 是否显示错误标记
    
    // 云开发状态
    cloudStatus: 'checking',

    // 提示相关
    showHintModal: false,
    showHintContentModal: false,
    hintOptions: ["宾格", "形容词性物主代词", "名词性物主代词", "反身代词"],
    hintContent: "",
    currentHint: "",
    currentCategoryIndex: 0,

    // 答案相关
    showAnswerModal: false,
    currentAnswer: null,

    // noun_004专用
    noun004ShowFullRule: [false, false, false, false, false], // 5行规则全文显示状态
    noun004InputStatus: {}, // 每个输入框的状态（correct/wrong/null）
    
    // 现在分词表格专用
    presentParticipleShowFullRule: [false, false, false, false, false], // 5行规则全文显示状态
    presentParticipleInputStatus: {}, // 每个输入框的状态（correct/wrong/null）
    
    // 过去分词表格专用
    pastParticipleShowFullRule: [false, false, false, false, false], // 5行规则全文显示状态
    pastParticipleInputStatus: {}, // 每个输入框的状态（correct/wrong/null）
    
    // 比较级表格专用
    comparativeShowFullRule: [false, false, false, false, false], // 5行规则全文显示状态
    comparativeInputStatus: {}, // 每个输入框的状态（correct/wrong/null）
    
    // 最高级表格专用
    superlativeShowFullRule: [false, false, false, false, false], // 5行规则全文显示状态
    superlativeInputStatus: {}, // 每个输入框的状态（correct/wrong/null）
    
    // 副词表格专用
    adverbShowFullRule: [false, false, false, false, false, false], // 6行规则全文显示状态
    adverbInputStatus: {} // 每个输入框的状态（correct/wrong/null）
  },

  onLoad: function (options) {
    console.log('grammar-writing页面加载，参数:', options);
    
    this.checkCloudStatus();
    this.loadPronounTables();
    this.loadNounTables();
    this.loadVerbTables();
    this.loadTenseTables();
    this.loadVoiceTables();
    this.loadComparisonTables();
    this.loadAdverbTables();
    this.initializeExpandedState();
    this.initWritingStats();
    
    // 初始化错误标记
    this.initErrorMarking();
    
    // 处理URL参数中的tables参数
    if (options.tables) {
      console.log('检测到tables参数:', options.tables);
      this.handleTablesParameter(options.tables);
    }
    
    // 处理URL参数中的practiceTable参数（从测试跳转过来）
    if (options.practiceTable) {
      console.log('检测到practiceTable参数:', options.practiceTable);
      this.handlePracticeTableParameter(options.practiceTable);
    }
  },

  onShow: function() {
    console.log('grammar-writing页面显示');
    
    // 检查是否有待处理的tables参数（来自switchTab跳转）
    const pendingTables = wx.getStorageSync('pendingTablesParameter');
    if (pendingTables) {
      console.log('检测到待处理的tables参数:', pendingTables);
      this.handleTablesParameter(pendingTables);
      // 清除已处理的参数
      wx.removeStorageSync('pendingTablesParameter');
    }
  },

  // 处理tables参数
  handleTablesParameter: function(tablesParam) {
    try {
      // 解析tables参数，支持逗号分隔的多个表格ID
      const tableIds = tablesParam.split(',').map(id => id.trim());
      console.log('解析的表格ID列表:', tableIds);
      
      // 延迟执行，确保表格数据已加载
      setTimeout(() => {
        this.selectTablesByIds(tableIds);
      }, 1000);
    } catch (error) {
      console.error('处理tables参数失败:', error);
    }
  },

  // 根据表格ID选择表格
  selectTablesByIds: function(tableIds) {
    console.log('开始选择表格:', tableIds);
    
    const selectedTables = {};
    let selectedCount = 0;
    
    // 遍历所有表格数据，找到匹配的表格
    const allTables = [
      ...this.data.pronounTables,
      ...this.data.nounTables,
      ...this.data.verbTables,
      ...this.data.tenseTables,
      ...this.data.voiceTables,
      ...this.data.comparisonTables,
      ...this.data.adverbTables
    ];
    
    tableIds.forEach(tableId => {
      const table = allTables.find(t => t.id === tableId);
      if (table) {
        selectedTables[tableId] = true;
        selectedCount++;
        console.log('找到并选择表格:', tableId, table.title);
      } else {
        console.warn('未找到表格:', tableId);
      }
    });
    
    if (selectedCount > 0) {
      this.setData({
        selectedTables: selectedTables,
        selectedCount: selectedCount
      });
      
      // 展开包含选中表格的分类
      this.expandCategoriesWithSelectedTables(tableIds);
      
      wx.showToast({
        title: `已选择${selectedCount}个表格`,
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '未找到指定的表格',
        icon: 'none'
      });
    }
  },

  // 展开包含选中表格的分类
  expandCategoriesWithSelectedTables: function(tableIds) {
    const expandedCategories = { ...this.data.expandedCategories };
    
    // 检查代词表格
    if (this.data.pronounTables.some(table => tableIds.includes(table.id))) {
      expandedCategories[0] = true;
    }
    
    // 检查名词表格
    if (this.data.nounTables.some(table => tableIds.includes(table.id))) {
      expandedCategories[1] = true;
    }
    
    // 检查动词表格
    if (this.data.verbTables.some(table => tableIds.includes(table.id))) {
      expandedCategories[2] = true;
    }
    
    // 检查时态表格
    if (this.data.tenseTables.some(table => tableIds.includes(table.id))) {
      expandedCategories[3] = true;
    }
    
    // 检查语态表格
    if (this.data.voiceTables.some(table => tableIds.includes(table.id))) {
      expandedCategories[4] = true;
    }
    
    // 检查比较级最高级表格
    if (this.data.comparisonTables.some(table => tableIds.includes(table.id))) {
      expandedCategories[5] = true;
    }
    
    // 检查副词表格
    if (this.data.adverbTables.some(table => tableIds.includes(table.id))) {
      expandedCategories[6] = true;
    }
    
    this.setData({
      expandedCategories: expandedCategories
    });
  },

  // 检查答案是否正确（支持多答案格式）
  checkAnswer(userAnswer, correctAnswer) {
    if (!userAnswer || !correctAnswer) return false;
    
    const userInput = userAnswer.trim().toLowerCase();
    const correct = correctAnswer.trim().toLowerCase();
    
    // 支持多答案格式，如 "which / that"
    if (correct.includes(' / ')) {
      // 多答案格式，检查用户答案是否匹配其中任一答案
      const correctAnswers = correct.split(' / ').map(ans => ans.trim());
      return correctAnswers.includes(userInput);
    } else {
      // 单答案格式，直接比较
      return userInput === correct;
    }
  },

  // 检查云开发状态
  checkCloudStatus: function() {
    if (!wx.cloud) {
      console.log('云开发不支持');
      this.setData({ cloudStatus: 'not_supported' });
      return;
    }

    try {
      // 检查云开发是否已初始化
      if (!wx.cloud.env) {
        console.log('云开发未初始化，跳过云开发检查');
        this.setData({ cloudStatus: 'not_initialized' });
        return;
      }

      // 尝试调用一个简单的云函数来测试连接
      wx.cloud.callFunction({
        name: 'login',
        data: {}
      }).then(res => {
        console.log('云开发连接成功:', res);
        this.setData({ cloudStatus: 'connected' });
      }).catch(err => {
        console.error('云开发连接失败:', err);
        this.setData({ cloudStatus: 'error' });
      });
    } catch (error) {
      console.error('云开发检查失败:', error);
      this.setData({ cloudStatus: 'error' });
    }
  },

  // 加载代词表格数据
  loadPronounTables: function() {
    try {
      const writingData = require('../../data/writing_pronouns.js');
      this.setData({
        pronounTables: writingData.questions
      });
    } catch (e) {
      console.error("代词表格数据加载失败:", e);
    }
  },

  // 加载名词表格数据
  loadNounTables: function() {
    try {
      const writingData = require('../../data/writing_nouns.js');
      this.setData({
        nounTables: writingData.questions
      });
    } catch (e) {
      console.error("名词表格数据加载失败:", e);
    }
  },

  // 加载动词表格数据
  loadVerbTables: function() {
    try {
      const writingData = require('../../data/writing_nouns.js');
      // 过滤出动词相关的表格
      const verbTables = writingData.questions.filter(q => 
        q.table_id === 'present_participle_001' || q.table_id === 'past_participle_001'
      );
      this.setData({
        verbTables: verbTables
      });
    } catch (e) {
      console.error("动词表格数据加载失败:", e);
    }
  },

  // 加载时态表格数据
  loadTenseTables: function() {
    try {
      const tenseData = require('../../data/writing_tenses.js');
      this.setData({
        tenseTables: tenseData.questions
      });
    } catch (e) {
      console.error("时态表格数据加载失败:", e);
    }
  },

  // 加载语态表格数据
  loadVoiceTables: function() {
    try {
      const voiceData = require('../../data/writing_voices.js');
      this.setData({
        voiceTables: voiceData.questions
      });
    } catch (e) {
      console.error("语态表格数据加载失败:", e);
    }
  },

  // 加载比较级最高级表格数据
  loadComparisonTables: function() {
    try {
      const comparisonData = require('../../data/writing_comparisons.js');
      this.setData({
        comparisonTables: comparisonData.questions
      });
    } catch (e) {
      console.error("比较级最高级表格数据加载失败:", e);
    }
  },

  // 加载副词表格数据
  loadAdverbTables: function() {
    try {
      const adverbData = require('../../data/writing_adverbs.js');
      // 创建一个表格对象，类似其他表格的结构
      const adverbTable = {
        table_id: 'adverb_writing_001',
        title: '形容词变副词书写'
      };
      this.setData({
        adverbTables: [adverbTable]
      });
    } catch (e) {
      console.error("副词表格数据加载失败:", e);
    }
  },

  // 初始化展开状态
  initializeExpandedState: function() {
    const expandedCategories = {};
    this.data.categories.forEach((category, index) => {
      expandedCategories[index] = false;
    });
    this.setData({ expandedCategories });
  },

  // 切换分类展开状态
  toggleCategory: function(e) {
    const index = e.currentTarget.dataset.index;
    const expandedCategories = { ...this.data.expandedCategories };
    expandedCategories[index] = !expandedCategories[index];
    this.setData({ expandedCategories });
  },

  // 选择表格
  selectTable: function(e) {
    const tableId = e.currentTarget.dataset.tableId;
    const selectedTables = { ...this.data.selectedTables };
    selectedTables[tableId] = !selectedTables[tableId];
    
    // 计算选中的表格数量
    const selectedCount = Object.keys(selectedTables).filter(key => selectedTables[key]).length;
    
    this.setData({ 
      selectedTables,
      selectedCount
    });
  },

  // 开始练习
  startPractice: function() {
    const selectedTables = Object.keys(this.data.selectedTables).filter(
      key => this.data.selectedTables[key]
    );
    
    if (selectedTables.length === 0) {
      wx.showToast({
        title: '请选择至少一个表格',
        icon: 'none'
      });
      return;
    }

    // 判断类型
    let type = '';
    if (this.data.selectedTables) {
      const pronounIds = this.data.pronounTables.map(t => t.table_id);
      const nounIds = this.data.nounTables.map(t => t.table_id);
      const verbIds = this.data.verbTables.map(t => t.table_id);
      const tenseIds = this.data.tenseTables.map(t => t.table_id);
      const voiceIds = this.data.voiceTables.map(t => t.table_id);
      const comparisonIds = this.data.comparisonTables.map(t => t.table_id);
      const adverbIds = this.data.adverbTables.map(t => t.table_id);
      
      if (selectedTables.every(id => pronounIds.includes(id))) {
        type = 'pronoun';
      } else if (selectedTables.every(id => nounIds.includes(id))) {
        type = 'noun';
      } else if (selectedTables.every(id => verbIds.includes(id))) {
        type = 'verb';
      } else if (selectedTables.every(id => tenseIds.includes(id))) {
        type = 'tense';
      } else if (selectedTables.every(id => voiceIds.includes(id))) {
        type = 'voice';
      } else if (selectedTables.every(id => comparisonIds.includes(id))) {
        type = 'comparison';
      } else if (selectedTables.every(id => adverbIds.includes(id))) {
        type = 'adverb';
      } else {
        type = 'mixed';
      }
    }

    // 检查是否有表格练习
    const tableOnlySelection = selectedTables.filter(id => 
      !id.includes('_cards') && !id.includes('_signal')
    );
    
    // 检查是否有卡片内容
    const cardSelection = selectedTables.filter(id => 
      id.includes('_cards') || id.includes('_signal')
    );

    // 如果只选择了卡片，直接跳转到卡片页面
    if (tableOnlySelection.length === 0 && cardSelection.length > 0) {
      if (selectedTables.includes('tense_signal_cards')) {
        wx.navigateTo({
          url: '/pages/tense-signal-cards/index'
        });
        return;
      }
    }

    // 如果有表格练习，跳转到表格练习页面（可以同时包含卡片）
    const allSelectedTables = selectedTables.join(',');
    wx.navigateTo({
      url: `/pages/exercise-page/index?tables=${allSelectedTables}&type=${type}&includeCards=true`
    });
  },

  // 清空选择
  clearSelection: function() {
    this.setData({ 
      selectedTables: {},
      selectedCount: 0
    });
  },

  // 显示提示选项
  showHintOptions: function(e) {
    console.log('🔍 [grammar-writing] showHintOptions 被点击了！');
    
    const categoryIndex = e.currentTarget.dataset.categoryIndex;
    console.log('categoryIndex:', categoryIndex);
    
    let hintOptions = [];
    
    if (categoryIndex === 0) {
      // 代词部分
      hintOptions = ["宾格", "形容词性物主代词", "名词性物主代词", "反身代词"];
    } else if (categoryIndex === 1) {
      // 名词变复数部分
      hintOptions = ["常见名词后缀", "后缀识别技巧", "词性判断"];
    } else if (categoryIndex === 2) {
      // 动词分词书写部分
      hintOptions = ["现在分词书写", "过去分词书写"];
    } else {
      // 兜底选项 - 如果没有正确传递categoryIndex
      hintOptions = ["语法规则提示", "练习技巧", "常见错误"];
    }
    
    console.log('最终设置的 hintOptions:', hintOptions);
    
    this.setData({
      showHintModal: true,
      hintOptions: hintOptions,
      currentCategoryIndex: categoryIndex !== undefined ? categoryIndex : -1
    });
  },

  // 选择提示类型
  selectHintType: function(e) {
    const hintType = e.currentTarget.dataset.type;
    const categoryIndex = this.data.currentCategoryIndex;
    
    console.log('🔍 [grammar-writing] selectHintType 被点击:', hintType, 'categoryIndex:', categoryIndex);
    
    // 检查是否是分词提示，直接跳转到专门页面
    if (hintType === "现在分词书写") {
      this.setData({
        showHintModal: false
      });
      wx.navigateTo({
        url: '/pages/present-participle-rules/index'
      });
      return;
    }
    
    if (hintType === "过去分词书写") {
      this.setData({
        showHintModal: false
      });
      wx.navigateTo({
        url: '/pages/past-participle-rules/index'
      });
      return;
    }
    
    let hint = "";
    
    if (categoryIndex === 0) {
      // 代词部分
      const writingData = require('../../data/writing_pronouns.js');
      hint = writingData.hints[hintType] || "暂无此类型的提示";
    } else if (categoryIndex === 1) {
      // 名词变复数部分
      const writingData = require('../../data/writing_nouns.js');
      hint = writingData.hints[hintType] || "暂无此类型的提示";
    } else {
      // 兜底提示内容
      switch(hintType) {
        case "语法规则提示":
          hint = "请根据每个语法点的基本规则进行练习。注意词形变化的规律，如名词复数、动词时态、形容词比较级等。";
          break;
        case "练习技巧":
          hint = "建议先熟悉基本规则，然后通过大量练习巩固。遇到不确定的地方可以查看相关语法规则页面。";
          break;
        case "常见错误":
          hint = "常见错误包括：词形变化不规范、时态搭配错误、形容词副词混用等。建议多做练习并及时总结错误规律。";
          break;
        default:
          hint = "请查看对应的语法规则页面获取更详细的帮助信息。";
      }
    }
    
    console.log('最终提示内容:', hint);
    
    this.setData({
      currentHint: hint,
      showHintModal: false,
      showHintContentModal: true,
      hintContent: hint
    });
  },

  // 关闭提示弹窗
  closeHintModal: function() {
    this.setData({
      showHintModal: false
    });
  },

  // 关闭提示内容弹窗
  closeHintContentModal: function() {
    this.setData({
      showHintContentModal: false,
      hintContent: ''
    });
  },

  // 显示完整答案
  showFullAnswer: function(e) {
    console.log('🔍 [grammar-writing] showFullAnswer 被点击了！');
    
    const tableId = e.currentTarget.dataset.tableId;
    const categoryIndex = e.currentTarget.dataset.categoryIndex;
    
    console.log('tableId:', tableId, 'categoryIndex:', categoryIndex);
    
    let answer = null;
    
    if (categoryIndex === 0) {
      // 代词部分
      const writingData = require('../../data/writing_pronouns.js');
      if (tableId && tableId.startsWith('pronoun_')) {
        answer = writingData.answers[tableId];
      } else {
        // 如果tableId不正确，显示第一个代词表格的答案
        answer = writingData.answers['pronoun_001'];
      }
    } else if (categoryIndex === 1) {
      // 名词变复数部分
      const writingData = require('../../data/writing_nouns.js');
      answer = writingData.answers[tableId];
    } else {
      // 兜底处理 - 直接显示提示信息
      wx.showModal({
        title: '学习提示',
        content: '建议先查看相关的语法规则页面，了解基本规则后再进行练习。你也可以选择具体的表格开始练习。',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }
    
    console.log('最终答案数据:', answer);
    
    if (answer) {
      this.setData({
        currentAnswer: answer,
        showAnswerModal: true
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '暂无答案数据，请先选择对应的表格进行练习。',
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },

  // 关闭答案弹窗
  closeAnswerModal: function() {
    this.setData({
      showAnswerModal: false,
      currentAnswer: null
    });
  },

  // 阻止事件冒泡
  stopPropagation: function() {
    // 空函数，用于阻止事件冒泡
  },

  // 关于名词后缀提示
  showNounSuffixHint() {
    wx.showModal({
      title: '名词后缀提示',
      content: '常见的名词后缀有-ness、-th、-ment、-ion、-ure、-ity、-or、-er、-ist、-ism、-al、-hood、-ship、-dom等。这些后缀通常表示抽象概念、状态、行为或职业等。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 关于名词复数提示
  showNounPluralHint() {
    wx.navigateTo({
      url: '/pages/noun-rules/index'
    });
  },

  // 显示现在分词规则
  showPresentParticipleRules() {
    wx.navigateTo({
      url: '/pages/present-participle-rules/index'
    });
  },

  // 显示过去分词规则
  showPastParticipleRules() {
    wx.navigateTo({
      url: '/pages/past-participle-rules/index'
    });
  },

  // noun_004输入处理
  onNoun004Input(e) {
    console.log('输入框输入', e);
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value;
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;

    // 获取正确答案
    let correct = this.data.correctAnswers[tableId][cellId];
    // 兼容 noun_004 的 correctAnswer 字段
    if (!correct && tableId === 'noun_004') {
      // 找到当前 cell
      const cell = this.data.tableData[tableId].find(c => c.cell_id === cellId);
      correct = cell && cell.correctAnswer;
    }
    let status = null;
    if (!value) {
      status = null;
    } else if (this.checkAnswer(value, correct)) {
      status = 'correct';
      // 更新书写统计
      this.updateWritingStats(true);
    } else {
      status = 'wrong';
      // 更新书写统计
      this.updateWritingStats(false);
    }
    const noun004InputStatus = { ...this.data.noun004InputStatus, [`${row*5+col}`]: status };

    this.setData({
      tableAnswers,
      noun004InputStatus
    });
  },

  // noun_004规则点击切换全文/简略
  onNoun004RuleTap(e) {
    console.log('点击规则', e);
    const row = e.currentTarget.dataset.row;
    const arr = [...this.data.noun004ShowFullRule];
    arr[row] = !arr[row];
    this.setData({ noun004ShowFullRule: arr });
  },

  // 现在分词输入处理
  onPresentParticipleInput(e) {
    console.log('现在分词输入框输入', e);
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value;
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;

    // 获取正确答案
    const cell = this.data.tableData[tableId].find(c => c.cell_id === cellId);
    const correct = cell && cell.correctAnswer;
    let status = null;
    if (!value) {
      status = null;
    } else if (this.checkAnswer(value, correct)) {
      status = 'correct';
      // 更新书写统计
      this.updateWritingStats(true);
    } else {
      status = 'wrong';
      // 更新书写统计
      this.updateWritingStats(false);
    }
    const presentParticipleInputStatus = { ...this.data.presentParticipleInputStatus, [`${row*5+col}`]: status };

    this.setData({
      tableAnswers,
      presentParticipleInputStatus
    });
  },

  // 现在分词规则点击切换全文/简略
  onPresentParticipleRuleTap(e) {
    console.log('点击现在分词规则', e);
    const row = e.currentTarget.dataset.row;
    const arr = [...this.data.presentParticipleShowFullRule];
    arr[row] = !arr[row];
    this.setData({ presentParticipleShowFullRule: arr });
  },

  // 过去分词输入处理
  onPastParticipleInput(e) {
    console.log('过去分词输入框输入', e);
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value;
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;

    // 获取正确答案
    const cell = this.data.tableData[tableId].find(c => c.cell_id === cellId);
    const correct = cell && cell.correctAnswer;
    let status = null;
    if (!value) {
      status = null;
    } else if (this.checkAnswer(value, correct)) {
      status = 'correct';
      // 更新书写统计
      this.updateWritingStats(true);
    } else {
      status = 'wrong';
      // 更新书写统计
      this.updateWritingStats(false);
    }
    const pastParticipleInputStatus = { ...this.data.pastParticipleInputStatus, [`${row*5+col}`]: status };

    this.setData({
      tableAnswers,
      pastParticipleInputStatus
    });
  },

  // 过去分词规则点击切换全文/简略
  onPastParticipleRuleTap(e) {
    console.log('点击过去分词规则', e);
    const row = e.currentTarget.dataset.row;
    const arr = [...this.data.pastParticipleShowFullRule];
    arr[row] = !arr[row];
    this.setData({ pastParticipleShowFullRule: arr });
  },

  // 显示时态书写规则
  showTenseWritingRules() {
    wx.navigateTo({
      url: '/pages/tense-writing-rules/index'
    });
  },

  // 显示时态标志词规则
  showTenseSignalRules() {
    wx.navigateTo({
      url: '/pages/tense-signal-rules/index'
    });
  },

  // 显示语态规则
  showVoiceRules() {
    wx.navigateTo({
      url: '/pages/voice-rules/index'
    });
  },

  // 显示形容词前后缀规则
  showAdjectivePrefixSuffixRules() {
    wx.navigateTo({
      url: '/pages/adjective-prefix-suffix-rules/index'
    });
  },

  // 显示比较级最高级书写规则
  showComparisonWritingRules() {
    wx.navigateTo({
      url: '/pages/comparison-writing-rules/index'
    });
  },

  // 比较级输入处理
  onComparativeInput(e) {
    console.log('比较级输入框输入', e);
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value;
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;

    // 获取正确答案
    const cell = this.data.tableData[tableId].find(c => c.cell_id === cellId);
    const correct = cell && cell.correctAnswer;
    let status = null;
    if (!value) {
      status = null;
    } else if (this.checkAnswer(value, correct)) {
      status = 'correct';
      // 更新书写统计
      this.updateWritingStats(true);
    } else {
      status = 'wrong';
      // 更新书写统计
      this.updateWritingStats(false);
    }
    const comparativeInputStatus = { ...this.data.comparativeInputStatus, [`${row*5+col}`]: status };

    this.setData({
      tableAnswers,
      comparativeInputStatus
    });
  },

  // 比较级规则点击切换全文/简略
  onComparativeRuleTap(e) {
    console.log('点击比较级规则', e);
    const row = e.currentTarget.dataset.row;
    const arr = [...this.data.comparativeShowFullRule];
    arr[row] = !arr[row];
    this.setData({ comparativeShowFullRule: arr });
  },

  // 最高级输入处理
  onSuperlativeInput(e) {
    console.log('最高级输入框输入', e);
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value;
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;

    // 获取正确答案
    const cell = this.data.tableData[tableId].find(c => c.cell_id === cellId);
    const correct = cell && cell.correctAnswer;
    let status = null;
    if (!value) {
      status = null;
    } else if (this.checkAnswer(value, correct)) {
      status = 'correct';
      // 更新书写统计
      this.updateWritingStats(true);
    } else {
      status = 'wrong';
      // 更新书写统计
      this.updateWritingStats(false);
    }
    const superlativeInputStatus = { ...this.data.superlativeInputStatus, [`${row*5+col}`]: status };

    this.setData({
      tableAnswers,
      superlativeInputStatus
    });
  },

  // 最高级规则点击切换全文/简略
  onSuperlativeRuleTap(e) {
    console.log('点击最高级规则', e);
    const row = e.currentTarget.dataset.row;
    const arr = [...this.data.superlativeShowFullRule];
    arr[row] = !arr[row];
    this.setData({ superlativeShowFullRule: arr });
  },

  // 显示副词书写规则
  showAdverbWritingRules() {
    wx.navigateTo({
      url: '/pages/adverb-writing-rules/index'
    });
  },

  // 副词表格输入处理
  onAdverbInput(e) {
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value;
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;

    // 获取正确答案
    const correct = this.data.correctAnswers[tableId][cellId];
    let status = null;
    if (!value) {
      status = null;
    } else if (this.checkAnswer(value, correct)) {
      status = 'correct';
      // 更新书写统计
      this.updateWritingStats(true);
    } else {
      status = 'wrong';
      // 更新书写统计
      this.updateWritingStats(false);
    }
    const adverbInputStatus = { ...this.data.adverbInputStatus, [`${row*5+col}`]: status };

    this.setData({
      tableAnswers,
      adverbInputStatus
    });
  },

  // 副词规则点击切换全文/简略
  onAdverbRuleTap(e) {
    const row = e.currentTarget.dataset.row;
    const arr = [...this.data.adverbShowFullRule];
    arr[row] = !arr[row];
    this.setData({ adverbShowFullRule: arr });
  },

  // 获取统一格式的今日日期
  getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  },

  // 初始化书写统计
  initWritingStats() {
    try {
      const today = this.getTodayDateString();
      const writingHistory = wx.getStorageSync('writingHistory') || [];
      
      // 检查是否已有今日记录
      const todayRecord = writingHistory.find(record => record.date === today);
      if (!todayRecord) {
        // 创建今日记录
        const newRecord = {
          date: today,
          correctCount: 0,
          totalCount: 0
        };
        writingHistory.push(newRecord);
        wx.setStorageSync('writingHistory', writingHistory);
      }
    } catch (error) {
      console.error('初始化书写统计失败:', error);
    }
  },

  // 更新书写统计
  updateWritingStats(isCorrect) {
    try {
      const today = this.getTodayDateString();
      const writingHistory = wx.getStorageSync('writingHistory') || [];
      
      // 查找今日记录
      let todayRecord = writingHistory.find(record => record.date === today);
      if (!todayRecord) {
        todayRecord = {
          date: today,
          correctCount: 0,
          totalCount: 0
        };
        writingHistory.push(todayRecord);
      }
      
      // 更新统计
      todayRecord.totalCount += 1;
      if (isCorrect) {
        todayRecord.correctCount += 1;
      }
      
      // 保存更新
      wx.setStorageSync('writingHistory', writingHistory);
      console.log('书写统计已更新:', todayRecord);
    } catch (error) {
      console.error('更新书写统计失败:', error);
    }
  },


  // 初始化错误标记
  initErrorMarking: function() {
    const errorTables = wx.getStorageSync('errorTables') || [];
    const errorStats = wx.getStorageSync('errorStats') || {};
    
    this.setData({
      errorTables: errorTables,
      errorStats: errorStats
    });
    
    console.log('错误标记初始化完成:', {
      errorTables: errorTables,
      errorStats: errorStats
    });
  },

  // 处理从测试跳转过来的表格练习
  handlePracticeTableParameter: function(tableId) {
    console.log('处理练习表格参数:', tableId);
    
    // 根据表格ID找到对应的分类和子分类
    const tableInfo = this.getTableInfo(tableId);
    if (tableInfo) {
      // 展开对应的分类
      const expandedCategories = { ...this.data.expandedCategories };
      expandedCategories[tableInfo.categoryIndex] = true;
      
      this.setData({
        expandedCategories: expandedCategories
      });
      
      // 高亮显示对应的表格
      setTimeout(() => {
        this.highlightTable(tableId);
      }, 500);
      
      wx.showToast({
        title: `已定位到${tableInfo.name}`,
        icon: 'success'
      });
    }
  },

  // 获取表格信息
  getTableInfo: function(tableId) {
    const tableMappings = {
      'pronoun_001': { name: '代词一（顺序）', categoryIndex: 0, subCategoryIndex: 0 },
      'pronoun_002': { name: '代词二（乱序）', categoryIndex: 0, subCategoryIndex: 1 },
      'noun_001': { name: '名词后缀识别（一）', categoryIndex: 1, subCategoryIndex: 0 },
      'noun_002': { name: '名词后缀识别（二）', categoryIndex: 1, subCategoryIndex: 1 },
      'noun_003': { name: '名词后缀识别（三）', categoryIndex: 1, subCategoryIndex: 2 },
      'noun_004': { name: '规则变复数', categoryIndex: 1, subCategoryIndex: 3 },
      'tense_writing_001': { name: '时态书写', categoryIndex: 3, subCategoryIndex: 0 },
      'adjective_001': { name: '比较级书写', categoryIndex: 5, subCategoryIndex: 1 },
      'adjective_002': { name: '形容词变副词书写', categoryIndex: 6, subCategoryIndex: 0 }
    };
    
    return tableMappings[tableId] || null;
  },

  // 高亮显示表格
  highlightTable: function(tableId) {
    // 这里可以通过设置特定的样式来高亮显示表格
    // 由于微信小程序的限制，我们通过显示提示信息来实现
    const tableInfo = this.getTableInfo(tableId);
    if (tableInfo) {
      wx.showModal({
        title: '重点练习',
        content: `建议重点练习：${tableInfo.name}\n\n这是您在测试中出错较多的表格。`,
        showCancel: false,
        confirmText: '开始练习'
      });
    }
  },

  // 获取表格状态（是否错误过）
  getTableStatus: function(tableId) {
    const hasError = this.data.errorTables.includes(tableId);
    const errorStats = this.data.errorStats[tableId];
    
    return {
      hasError: hasError,
      errorCount: errorStats ? errorStats.count : 0,
      lastError: errorStats ? errorStats.lastError : null,
      statusText: hasError ? '需要练习' : '已掌握',
      statusColor: hasError ? '#ff6b6b' : '#51cf66'
    };
  },

  // 清除表格错误标记
  clearTableError: function(tableId) {
    const errorTables = [...this.data.errorTables];
    const errorStats = { ...this.data.errorStats };
    
    // 从错误列表中移除
    const index = errorTables.indexOf(tableId);
    if (index > -1) {
      errorTables.splice(index, 1);
    }
    
    // 清除错误统计
    delete errorStats[tableId];
    
    this.setData({
      errorTables: errorTables,
      errorStats: errorStats
    });
    
    // 保存到本地存储
    wx.setStorageSync('errorTables', errorTables);
    wx.setStorageSync('errorStats', errorStats);
    
    wx.showToast({
      title: '已清除错误标记',
      icon: 'success'
    });
  },

  // 切换错误标记显示
  toggleErrorMarking: function() {
    this.setData({
      showErrorMarking: !this.data.showErrorMarking
    });
  }
}); 