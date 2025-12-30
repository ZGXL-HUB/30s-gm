Page({
  data: {
    mistakes: [],
    filteredMistakes: [],
    removedMistakes: [], // 新增：已移除错题列表
    showRemovedMistakes: false, // 新增：是否显示已移除错题
    
    // 更新：按照用户要求的12个分类体系
    categories: [
      "介词", "代词", "连词", "冠词", "名词", "动词",
      "谓语", "非谓语", "形容词", "副词", "定语从句", "状语从句", "综合练习"
    ],
    
    // 新增：分类统计数据
    categoryCounts: {},
    
    // 新增：分类映射表，将题目中的具体分类映射到大类
    categoryMapping: {
      // 介词相关分类
      "介词(1)": "介词", "介词(2)": "介词", "介词(3)": "介词",
      "介词综合": "介词", "介词 + 名词/动名词": "介词",
      // 代词相关分类
      "代词(1)": "代词", "代词(2)": "代词", "代词(3)": "代词", 
      "代词(4)": "代词", "代词(5)": "代词", "代词(6)": "代词",
      "代词综合": "代词", "人称代词": "代词", "物主代词": "代词",
      // 连词相关分类
      "连词(1)": "连词", "连词(2)": "连词", "连词(3)": "连词",
      "连词(4)": "连词", "连词(5)": "连词", "连词(6)": "连词",
      "连词与名词": "连词", "连词与动词": "连词", "连词与形容词": "连词",
      "连词与名/动/形/副综合": "连词", "并列连词综合": "连词", "从属连词综合": "连词",
      // 冠词相关分类
      "冠词(1)": "冠词", "冠词(2)": "冠词", "冠词(3)": "冠词", "冠词(4)": "冠词",
      // 名词相关分类
      "名词(1)": "名词", "名词(2)": "名词", "名词(3)": "名词", "名词(4)": "名词", "名词(5)": "名词", "名词(6)": "名词", 
      // 动词相关分类
      "动词(1)": "动词", "动词(2)": "动词", "动词(3)": "动词", 
      "动词(4)": "动词", "动词(5)": "动词",
      // 谓语相关分类
      "谓语(1)": "谓语", "谓语(2)": "谓语", "谓语(3)": "谓语", 
      "谓语(4)": "谓语", "谓语(5)": "谓语", "谓语(6)": "谓语", "谓语(7)": "谓语",
      "谓语(8)": "谓语", "谓语(9)": "谓语",
      // 非谓语相关分类
      "非谓语(1)": "非谓语", "非谓语(2)": "非谓语", "非谓语(3)": "非谓语", "非谓语(4)": "非谓语",
      // 形容词相关分类
      "形容词(1)": "形容词", "形容词(2)": "形容词", "形容词(3)": "形容词",
      // 副词相关分类
      "副词(1)": "副词", "副词(2)": "副词", "副词(3)": "副词", "副词(4)": "副词",
      "副词综合": "副词", "副词修饰句子": "副词", "副词修饰动词": "副词", "副词修饰形容词/副词": "副词",
      // 定语从句相关分类
      "定语从句(1)": "定语从句", "定语从句(2)": "定语从句", "定语从句(3)": "定语从句",
      "定语从句(4)": "定语从句", "定语从句(5)": "定语从句",
      // 状语从句相关分类
      "状语和从句(1)": "状语从句", "状语和从句(2)": "状语从句", "状语和从句(3)": "状语从句",
      "状语和从句(4)": "状语从句", "状语和从句(5)": "状语从句",
      // 固定搭配相关分类
      "固定搭配": "综合练习",
      // 综合练习相关分类
      "综合练习": "综合练习"
    },
    
    currentCategory: 'all',
    searchKeyword: '',
    showPieChart: true,
    chartWidth: 300,
    chartHeight: 300,
    chartData: [],
    categoryColors: {
      "介词": "#1890ff",
      "代词": "#52c41a",
      "连词": "#faad14",
      "冠词": "#f5222d",
      "名词": "#722ed1",
      "动词": "#13c2c2",
      "谓语": "#eb2f96",
      "非谓语": "#fa8c16",
      "形容词": "#a0d911",
      "副词": "#bfbfbf",
      "定语从句": "#d9d9d9",
      "状语从句": "#8c8c8c",
      "综合练习": "#ff7a45",
      "其他": "#d9d9d9"
    },
    
    // 新增：UI状态
    showAnalysis: false,
    showProgress: false,
    loading: false,
    
    // 新增：自动移除配置
    autoRemoveConfig: { enabled: true, correctCount: 3 }
  },

  onLoad() {
    try {
      console.log('[错题本] 页面加载开始...');
      wx.setNavigationBarTitle({
        title: ''
      });
      this.loadMistakes();
      // 移除图表初始化，因为当前页面没有图表功能
      // this.initChart();
      // 移除重复调用，loadMistakes中已经调用了analyzeLearningData
      // this.analyzeLearningData();
      console.log('[错题本] 页面加载完成');
    } catch (error) {
      console.error('[错题本] 页面加载失败:', error);
      wx.showToast({
        title: '页面加载失败',
        icon: 'none'
      });
    }
  },

  onShow() {
    try {
      console.log('[错题本] 页面显示开始...');
      // 每次页面显示时重新加载数据，确保正确次数等信息是最新的
      this.loadMistakes();
      // 移除重复调用，loadMistakes中已经调用了analyzeLearningData
      // this.analyzeLearningData();
      console.log('[错题本] 页面显示完成');
    } catch (error) {
      console.error('[错题本] 页面显示失败:', error);
      wx.showToast({
        title: '页面显示失败',
        icon: 'none'
      });
    }
  },


  // 新增：分类归一化函数
  normalizeCategory(category) {
    if (!category) return '其他';
    
    // 去除所有空格
    let normalized = category.replace(/\s+/g, '');
    
    // 英文括号转中文括号
    normalized = normalized.replace(/\((\d+)\)/g, '($1)');
    
    // 处理特殊情况：如果分类名以"综合"结尾，保持不变
    if (normalized.endsWith('综合')) {
      return normalized;
    }
    
    // 处理特殊情况：如果分类名包含"+"，保持不变
    if (normalized.includes('+')) {
      return normalized;
    }
    
    return normalized;
  },

  loadMistakes() {
    try {
      console.log('[错题本] 开始加载错题数据...');
      const mistakes = wx.getStorageSync('wrongQuestions') || [];
      const removedMistakes = wx.getStorageSync('removedWrongQuestions') || [];
      const autoRemoveConfig = wx.getStorageSync('autoRemoveConfig') || { enabled: true, correctCount: 3 };
    
    // 清理和修复错误数据，并为每个错题添加 showAnswer 属性和映射分类
    const mistakesWithShowAnswer = mistakes.map(m => {
      let questionText = '';
      
      // 修复question字段
      if (typeof m.question === 'string') {
        questionText = m.question;
      } else if (typeof m.question === 'object' && m.question) {
        questionText = m.question.question || m.question.text || '题目解析中...';
      } else {
        questionText = '未知题目';
      }
      
      // 优先使用tag进行映射，如果没有tag则使用category
      const originalCategory = m.tag || m.category || '其他';
      
      // 归一化分类名称
      const normalizedCategory = this.normalizeCategory(originalCategory);
      
      // 使用归一化后的分类进行映射
      const mappedCategory = this.data.categoryMapping[normalizedCategory] || normalizedCategory;
      
      return {
        ...m,
        question: questionText,
        showAnswer: false,
        originalCategory: originalCategory, // 保留原始分类用于调试
        normalizedCategory: normalizedCategory, // 归一化后的分类
        mappedCategory: mappedCategory
      };
    });
    
    // 如果有数据被修复，更新存储
    const hasChanges = mistakesWithShowAnswer.some((m, index) => m.question !== mistakes[index].question);
    if (hasChanges) {
      wx.setStorageSync('wrongQuestions', mistakesWithShowAnswer);
    }
    
    // 添加调试信息
    console.log('[错题本] 加载错题数据:', mistakesWithShowAnswer.length, '题');
    mistakesWithShowAnswer.forEach((m, index) => {
      console.log(`[错题本] 第${index + 1}题:`, {
        question: m.question.substring(0, 30) + '...',
        originalCategory: m.originalCategory,
        normalizedCategory: m.normalizedCategory,
        mappedCategory: m.mappedCategory
      });
    });
    
    console.log('[错题本] 已移除错题数据:', removedMistakes.length, '题');
    removedMistakes.forEach((m, index) => {
      console.log(`[错题本] 已移除第${index + 1}题:`, {
        question: m.question ? m.question.substring(0, 30) + '...' : '未知题目',
        removeReason: m.removeReason || '因做对1次被移除'
      });
    });
    
    console.log('[错题本] 准备设置数据到页面，错题数量:', mistakesWithShowAnswer.length);
    
    this.setData({ 
      mistakes: mistakesWithShowAnswer,
      filteredMistakes: mistakesWithShowAnswer,
      removedMistakes: removedMistakes,
      autoRemoveConfig: autoRemoveConfig
    }, () => {
      console.log('[错题本] 数据设置完成，当前this.data.mistakes长度:', this.data.mistakes.length);
    });
    
    // 在数据设置完成后再计算统计（避免递归更新）
    setTimeout(() => {
      this.calculateStats();
      this.analyzeLearningData();
      
      // 添加调试信息，确认统计计算完成
      console.log('[错题本] 统计计算完成，当前统计数据:', {
        totalMistakes: this.data.learningProgress?.totalMistakes || 0,
        masteredMistakes: this.data.learningProgress?.masteredMistakes || 0,
        masteryRate: this.data.learningProgress?.masteryRate || 0,
        categoryCounts: this.data.categoryCounts || {}
      });
    }, 0);
    } catch (error) {
      console.error('[错题本] 加载错题数据失败:', error);
      // 设置默认数据，确保页面能正常显示
      this.setData({
        mistakes: [],
        filteredMistakes: [],
        removedMistakes: [],
        autoRemoveConfig: { enabled: true, correctCount: 3 }
      });
      wx.showToast({
        title: '加载错题数据失败',
        icon: 'none'
      });
    }
  },

  calculateStats() {
    const stats = {};
    this.data.mistakes.forEach(m => {
      // 优先使用已映射的分类
      const mappedCategory = m.mappedCategory || '其他';
      stats[mappedCategory] = (stats[mappedCategory] || 0) + 1;
    });

    const chartData = Object.entries(stats).map(([category, count]) => ({
      category,
      count,
      color: this.data.categoryColors[category] || this.data.categoryColors['其他']
    }));

    // 计算所有分类的数量
    const categoryCounts = {};
    this.data.categories.forEach(category => {
      categoryCounts[category] = stats[category] || 0;
    });

    console.log('[分类统计] 计算完成:', categoryCounts);

    this.setData({ 
      chartData,
      categoryCounts: categoryCounts
    }, () => {
      // 确认数据设置成功
      console.log('[分类统计] 数据设置完成，当前categoryCounts:', this.data.categoryCounts);
      console.log('[分类统计] 详细统计信息:', {
        mistakesLength: this.data.mistakes.length,
        stats: stats,
        chartDataLength: this.data.chartData.length,
        categoryCountsKeys: Object.keys(this.data.categoryCounts)
      });
    });
  },

  async initChart() {
    const query = wx.createSelectorQuery();
    query.select('#statsChart')
      .fields({ node: true, size: true })
      .exec((res) => {
        // 检查Canvas元素是否存在
        if (!res || !res[0] || !res[0].node) {
          console.warn('Canvas元素不存在，跳过图表初始化');
          return;
        }
        
        try {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          
          // 设置canvas大小 - 使用新的API
          const deviceInfo = wx.getDeviceInfo();
          const windowInfo = wx.getWindowInfo();
          const dpr = windowInfo.pixelRatio || deviceInfo.pixelRatio || 1;
          canvas.width = this.data.chartWidth * dpr;
          canvas.height = this.data.chartHeight * dpr;
          ctx.scale(dpr, dpr);

          this.canvas = canvas;
          this.ctx = ctx;
          this.updateChart();
        } catch (error) {
          console.error('图表初始化失败:', error);
        }
      });
  },

  updateChart() {
    if (!this.ctx || !this.data.chartData.length) return;

    const ctx = this.ctx;
    const width = this.data.chartWidth;
    const height = this.data.chartHeight;
    const data = this.data.chartData;
    const total = data.reduce((sum, item) => sum + item.count, 0);

    ctx.clearRect(0, 0, width, height);

    if (this.data.showPieChart) {
      this.drawPieChart(ctx, width, height, data, total);
    } else {
      this.drawBarChart(ctx, width, height, data, total);
    }
  },

  drawPieChart(ctx, width, height, data, total) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;
    let startAngle = 0;

    data.forEach(item => {
      const sliceAngle = (item.count / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = item.color;
      ctx.fill();
      
      startAngle += sliceAngle;
    });
  },

  drawBarChart(ctx, width, height, data, total) {
    const barWidth = width / data.length * 0.6;
    const maxHeight = height * 0.8;
    const startX = width * 0.1;
    const startY = height * 0.9;

    data.forEach((item, index) => {
      const barHeight = (item.count / total) * maxHeight;
      const x = startX + (width * 0.8 / data.length) * index;
      const y = startY - barHeight;

      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // 绘制数值标签
      ctx.fillStyle = '#666';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.count.toString(), x + barWidth / 2, y - 5);
    });
  },

  toggleStatsView() {
    this.setData({
      showPieChart: !this.data.showPieChart
    }, () => {
      this.updateChart();
    });
  },

  getCategoryColor(category) {
    return this.data.categoryColors[category] || this.data.categoryColors['其他'];
  },

  // 新增：搜索功能
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.filterMistakes();
  },

  // 新增：清除搜索
  clearSearch() {
    this.setData({ searchKeyword: '' });
    this.filterMistakes();
  },





  // 新增：切换已移除错题显示
  toggleRemovedMistakes() {
    this.setData({ showRemovedMistakes: !this.data.showRemovedMistakes });
  },

  // 新增：恢复错题
  restoreMistake(e) {
    const id = e.currentTarget.dataset.id;
    const { removedMistakes, mistakes } = this.data;
    
    const mistakeToRestore = removedMistakes.find(m => m.id === id);
    if (!mistakeToRestore) {
      wx.showToast({
        title: '错题不存在',
        icon: 'none'
      });
      return;
    }
    
    // 移除已移除标记
    const restoredMistake = {
      ...mistakeToRestore,
      removedReason: undefined,
      removedDate: undefined
    };
    
    const updatedRemovedMistakes = removedMistakes.filter(m => m.id !== id);
    const updatedMistakes = [...mistakes, restoredMistake];
    
    this.setData({
      removedMistakes: updatedRemovedMistakes,
      mistakes: updatedMistakes
    });
    
    // 更新存储
    wx.setStorageSync('wrongQuestions', updatedMistakes);
    wx.setStorageSync('removedWrongQuestions', updatedRemovedMistakes);
    
    // 重新分析数据
    this.analyzeLearningData();
    this.filterMistakes();
    
    wx.showToast({
      title: '已恢复',
      icon: 'success'
    });
  },

  // 新增：练习单道错题
  practiceMistake(e) {
    const index = e.currentTarget.dataset.index;
    const mistake = this.data.filteredMistakes[index];
    const questions = [{
      text: mistake.question,
      answer: mistake.correctAnswer,
      category: mistake.category,
      analysis: mistake.analysis || '', // 添加解析信息
      id: mistake.id
    }];
    
    wx.navigateTo({
      url: `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(questions))}&mode=practice&title=${encodeURIComponent('错题练习')}`
    });
  },

  // 新增：全部练习
  allPractice() {
    if (this.data.filteredMistakes.length === 0) {
      wx.showToast({
        title: '暂无错题',
        icon: 'none'
      });
      return;
    }

    const questions = this.data.filteredMistakes.map(m => ({
      text: m.question,
      answer: m.correctAnswer,
      category: m.category,
      analysis: m.analysis || '', // 添加解析信息
      id: m.id
    }));

    wx.navigateTo({
      url: `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(questions))}&mode=practice&title=${encodeURIComponent('错题练习')}`
    });
  },

  // 新增：分类练习
  categoryPractice() {
    if (this.data.currentCategory === 'all') {
      wx.showToast({
        title: '请先选择分类',
        icon: 'none'
      });
      return;
    }

    const categoryMistakes = this.data.mistakes.filter(m => {
      const originalCategory = m.category || '其他';
      const mappedCategory = this.data.categoryMapping[originalCategory] || originalCategory;
      return mappedCategory === this.data.currentCategory;
    });
    
    if (categoryMistakes.length === 0) {
      wx.showToast({
        title: '该分类暂无错题',
        icon: 'none'
      });
      return;
    }

    const questions = categoryMistakes.map(m => ({
      text: m.question,
      answer: m.correctAnswer,
      category: m.category,
      analysis: m.analysis || '', // 添加解析信息
      id: m.id
    }));

    wx.navigateTo({
      url: `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(questions))}&mode=practice&title=${encodeURIComponent(`${this.data.currentCategory}练习`)}`
    });
  },

  // 新增：切换答案显示状态
  toggleAnswer(e) {
    const index = e.currentTarget.dataset.index;
    const mistakes = this.data.mistakes;
    const filteredMistakes = this.data.filteredMistakes;
    
    // 更新原始错题列表中的显示状态
    const originalIndex = mistakes.findIndex(m => 
      m.question === filteredMistakes[index].question && 
      m.correctAnswer === filteredMistakes[index].correctAnswer
    );
    
    if (originalIndex !== -1) {
      mistakes[originalIndex].showAnswer = !mistakes[originalIndex].showAnswer;
    }
    
    // 更新过滤后的错题列表中的显示状态
    filteredMistakes[index].showAnswer = !filteredMistakes[index].showAnswer;
    
    this.setData({ 
      mistakes,
      filteredMistakes
    });
  },

  // 新增：获取分类错题数量
  getCategoryCount(category) {
    // 使用预计算的统计数据
    const count = this.data.categoryCounts[category] || 0;
    console.log(`[分类统计] ${category}: ${count}题`);
    return count;
  },

  // 新增：分类练习方法
  practiceCategory(e) {
    const category = e.currentTarget.dataset.category;
    console.log("分类练习触发:", category);

    const categoryMistakes = this.data.mistakes.filter(m => {
      // 优先使用已映射的分类
      const mappedCategory = m.mappedCategory || m.category || '其他';
      return mappedCategory === category;
    });
    console.log("过滤后的错题:", categoryMistakes);

    if (categoryMistakes.length === 0) {
      wx.showToast({
        title: '该分类暂无错题',
        icon: 'none'
      });
      return;
    }

    const questions = categoryMistakes.map(m => ({
      text: m.question,
      answer: m.correctAnswer,
      category: m.category,
      analysis: m.analysis || '', // 添加解析信息
      id: m.id
    }));

    wx.navigateTo({
      url: `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(questions))}&mode=practice&title=${encodeURIComponent(`${category}练习`)}`
    });
  },




  // 新增：分类筛选方法
  filterByCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ currentCategory: category });
    this.filterMistakes();
  },

  // 修改：过滤错题方法
  filterMistakes() {
    let filtered = [...this.data.mistakes];

    // 按分类筛选
    if (this.data.currentCategory !== 'all') {
      filtered = filtered.filter(m => {
        // 优先使用已映射的分类
        const mappedCategory = m.mappedCategory || m.category || '其他';
        return mappedCategory === this.data.currentCategory;
      });
    }

    // 按关键词搜索
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filtered = filtered.filter(m => 
        m.question.toLowerCase().includes(keyword) ||
        m.correctAnswer.toLowerCase().includes(keyword) ||
        (m.category && m.category.toLowerCase().includes(keyword))
      );
    }

    this.setData({ filteredMistakes: filtered });
  },

  // 新增：分析学习数据
  analyzeLearningData() {
    const mistakes = this.data.mistakes;
    const removedMistakes = this.data.removedMistakes;
    
    console.log(`[学习分析] 开始分析，当前错题: ${mistakes.length}题，已移除错题: ${removedMistakes.length}题`);
    console.log('[学习分析] mistakes数据详情:', mistakes);
    console.log('[学习分析] removedMistakes数据详情:', removedMistakes);
    
    // 计算总数和已掌握数
    const totalMistakes = mistakes.length + removedMistakes.length;
    const masteredMistakes = removedMistakes.length;
    
    console.log(`[学习分析] 计算结果: totalMistakes=${totalMistakes}, masteredMistakes=${masteredMistakes}`);
    
    // 如果没有错题也没有已移除错题，设置默认值
    if (totalMistakes === 0) {
      console.log('[学习分析] 既无错题也无已移除错题，设置默认值');
      this.setData({
        learningProgress: {
          totalMistakes: 0,
          masteredMistakes: 0,
          masteryRate: 0,
          recentProgress: [],
          weakPoints: [],
          strongPoints: []
        },
        analysisData: {
          mostErrorCategory: '',
          mostErrorCount: 0,
          averageErrorCount: 0,
          improvementTrend: 'stable',
          recommendedFocus: []
        }
      });
      return;
    }
    
    // 分析错误分布
    const categoryCounts = {};
    const categoryErrorCounts = {};
    
    mistakes.forEach(mistake => {
      // 优先使用已映射的分类
      const mappedCategory = mistake.mappedCategory || mistake.category || '其他';
      categoryCounts[mappedCategory] = (categoryCounts[mappedCategory] || 0) + 1;
      categoryErrorCounts[mappedCategory] = (categoryErrorCounts[mappedCategory] || 0) + (mistake.errorCount || 1);
    });
    
    // 找出最常出错的类别(排除"综合"分类)
    let mostErrorCategory = '';
    let mostErrorCount = 0;
    
    Object.entries(categoryErrorCounts).forEach(([category, count]) => {
      if (count > mostErrorCount && category !== '综合' && category !== '其他') {
        mostErrorCount = count;
        mostErrorCategory = category;
      }
    });
    
    // 计算平均错误次数
    const totalErrorCount = mistakes.reduce((sum, mistake) => sum + (mistake.errorCount || 1), 0);
    const averageErrorCount = mistakes.length > 0 ? Math.round((totalErrorCount / mistakes.length) * 10) / 10 : 0;
    
    // 分析薄弱点和强项(排除"综合"分类，因为它是兜底分类)
    const weakPoints = Object.entries(categoryErrorCounts)
      .filter(([category]) => category !== '综合' && category !== '其他') // 排除兜底分类
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
    
    const strongPoints = Object.entries(categoryCounts)
      .filter(([category]) => !weakPoints.includes(category) && category !== '综合' && category !== '其他')
      .sort(([,a], [,b]) => a - b)
      .slice(0, 3)
      .map(([category]) => category);
    
    // 分析改进趋势(基于最近7天的数据)
    const recentMistakes = mistakes.filter(mistake => {
      const mistakeDate = new Date(mistake.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return mistakeDate >= weekAgo;
    });
    
    const oldMistakes = mistakes.filter(mistake => {
      const mistakeDate = new Date(mistake.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return mistakeDate < weekAgo;
    });
    
    let improvementTrend = 'stable';
    if (recentMistakes.length < oldMistakes.length * 0.7) {
      improvementTrend = 'improving';
    } else if (recentMistakes.length > oldMistakes.length * 1.3) {
      improvementTrend = 'declining';
    }
    
    // 计算掌握率
    const masteryRate = totalMistakes > 0 ? Math.round((masteredMistakes / totalMistakes) * 100) : 0;
    
    console.log(`[学习分析] 计算结果: 总错题=${totalMistakes}, 已掌握=${masteredMistakes}, 掌握率=${masteryRate}%`);
    
    // 生成推荐重点
    const recommendedFocus = this.generateRecommendedFocus(weakPoints, categoryErrorCounts);
    
    this.setData({
      learningProgress: {
        totalMistakes,
        masteredMistakes,
        masteryRate,
        recentProgress: this.calculateRecentProgress(mistakes),
        weakPoints,
        strongPoints
      },
      analysisData: {
        mostErrorCategory,
        mostErrorCount,
        averageErrorCount,
        improvementTrend,
        recommendedFocus
      }
    }, () => {
      // 添加调试信息，确认统计数据设置成功
      console.log('[学习分析] 统计数据设置完成:', {
        totalMistakes: this.data.learningProgress.totalMistakes,
        masteredMistakes: this.data.learningProgress.masteredMistakes,
        masteryRate: this.data.learningProgress.masteryRate,
        mostErrorCategory: this.data.analysisData.mostErrorCategory,
        mostErrorCount: this.data.analysisData.mostErrorCount,
        recommendedFocusLength: this.data.analysisData.recommendedFocus.length
      });
    });
  },

  // 新增：计算最近进度
  calculateRecentProgress(mistakes) {
    const today = new Date();
    const progress = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      
      const dayMistakes = mistakes.filter(mistake => 
        mistake.date === dateStr
      ).length;
      
      progress.push({
        date: dateStr,
        count: dayMistakes
      });
    }
    
    return progress;
  },

  // 新增：生成推荐重点
  generateRecommendedFocus(weakPoints, categoryErrorCounts) {
    const recommendations = [];
    
    weakPoints.forEach((category, index) => {
      const errorCount = categoryErrorCounts[category];
      let recommendation = '';
      
      if (index === 0) {
        recommendation = `重点攻克${category}类题目，您在此类题目上出错${errorCount}次`;
      } else if (index === 1) {
        recommendation = `加强${category}练习，巩固基础`;
      } else {
        recommendation = `适当复习${category}相关内容`;
      }
      
      recommendations.push({
        category,
        errorCount,
        recommendation,
        priority: index + 1
      });
    });
    
    return recommendations;
  },

  // 新增：显示学习分析
  showLearningAnalysis() {
    this.setData({ showAnalysis: !this.data.showAnalysis });
  },

  // 新增：显示学习进度
  showLearningProgress() {
    this.setData({ showProgress: !this.data.showProgress });
  },

  // 新增：智能练习推荐
  startRecommendedPractice() {
    const { recommendedFocus } = this.data.analysisData;
    
    if (recommendedFocus.length === 0) {
      wx.showToast({
        title: '暂无推荐练习',
        icon: 'none'
      });
      return;
    }
    
    const topCategory = recommendedFocus[0]?.category || '其他';
    const categoryMistakes = this.data.mistakes.filter(m => {
      const originalCategory = m.category || '其他';
      const mappedCategory = this.data.categoryMapping[originalCategory] || originalCategory;
      return mappedCategory === topCategory;
    });
    
    if (categoryMistakes.length === 0) {
      wx.showToast({
        title: '该分类暂无错题',
        icon: 'none'
      });
      return;
    }
    
    const questions = categoryMistakes.map(m => ({
      text: m.question,
      answer: m.correctAnswer,
      category: m.category,
      analysis: m.analysis || '', // 添加解析信息
      id: m.id
    }));
    
    wx.navigateTo({
      url: `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(questions))}&mode=practice&title=${encodeURIComponent(`推荐练习：${topCategory}`)}`
    });
  },





  // 新增：删除错题
  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这道错题吗？',
      confirmText: '删除',
      cancelText: '取消',
      confirmColor: '#fa5151',
      success: (res) => {
        if (res.confirm) {
          const { mistakes, filteredMistakes } = this.data;
          const updatedMistakes = mistakes.filter(m => m.id !== id);
          const updatedFilteredMistakes = filteredMistakes.filter(m => m.id !== id);
          
          this.setData({
            mistakes: updatedMistakes,
            filteredMistakes: updatedFilteredMistakes
          });
          
          // 更新存储
          wx.setStorageSync('wrongQuestions', updatedMistakes);
          
          // 重新分析数据
          this.analyzeLearningData();
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 新增：开始错题消灭练习
  startEliminationPractice() {
    const wrongQuestions = this.data.mistakes;
    
    if (wrongQuestions.length === 0) {
      wx.showToast({
        title: '暂无错题',
        icon: 'none'
      });
      return;
    }

    // 转换错题格式以适配练习页面
    const questions = wrongQuestions.map(mistake => ({
      text: mistake.question,
      answer: mistake.correctAnswer,
      category: mistake.mappedCategory || mistake.category || '未知',
      analysis: mistake.analysis || '', // 添加解析信息
      id: mistake.id
    }));

    // 随机打乱错题顺序
    const shuffledQuestions = this.shuffleArray(questions);
    
    // 限制题目数量(最多20道)
    const limitedQuestions = shuffledQuestions.slice(0, 20);

    console.log('从错题本开始错题消灭练习:', limitedQuestions.length, '道题');

    // 跳转到练习页面
    const url = `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(limitedQuestions))}&level=错题消灭&mode=elimination&title=${encodeURIComponent('错题消灭练习')}&isWrongQuestionElimination=true`;
    
    wx.navigateTo({
      url: url,
      success: () => {
        console.log('跳转到错题消灭练习页面成功');
      },
      fail: (error) => {
        console.error('跳转到错题消灭练习页面失败:', error);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 新增：显示自动移除设置
  showAutoRemoveSettings() {
    const autoRemoveConfig = this.data.autoRemoveConfig;
    const options = [
      { text: '做对1次自动移除', value: 1 },
      { text: '做对2次自动移除', value: 2 },
      { text: '做对3次自动移除', value: 3 },
      { text: '做对5次自动移除', value: 5 }
    ];

    wx.showActionSheet({
      itemList: options.map(option => option.text),
      success: (res) => {
        const selectedOption = options[res.tapIndex];
        const newConfig = {
          enabled: true,
          correctCount: selectedOption.value
        };
        
        wx.setStorageSync('autoRemoveConfig', newConfig);
        
        this.setData({
          autoRemoveConfig: newConfig
        });
        
        wx.showToast({
          title: `已设置为${selectedOption.text}`,
          icon: 'success',
          duration: 2000
        });
        
        console.log('自动移除规则已更新:', newConfig);
      },
      fail: (error) => {
        console.log('用户取消设置');
      }
    });
  },

  // 新增：显示消灭进度
  showEliminationProgress() {
    const { mistakes, autoRemoveConfig } = this.data;
    
    if (mistakes.length === 0) {
      wx.showToast({
        title: '暂无错题',
        icon: 'none'
      });
      return;
    }

    // 统计各种进度情况
    const progressStats = mistakes.reduce((stats, mistake) => {
      const correctCount = mistake.correctCount || 0;
      const remaining = autoRemoveConfig.correctCount - correctCount;
      
      if (remaining <= 0) {
        stats.completed++;
      } else if (remaining === 1) {
        stats.almostDone++;
      } else if (remaining === 2) {
        stats.halfway++;
      } else {
        stats.justStarted++;
      }
      
      return stats;
    }, { completed: 0, almostDone: 0, halfway: 0, justStarted: 0 });

    const content = `📊 错题消灭进度统计：
    
✅ 即将移除：${progressStats.almostDone}道
🎯 进行中：${progressStats.halfway}道  
🔥 刚开始：${progressStats.justStarted}道

继续练习，让更多错题被消灭！`;

    wx.showModal({
      title: '消灭进度',
      content: content,
      showCancel: false,
      confirmText: '继续练习',
      success: (res) => {
        if (res.confirm) {
          this.startEliminationPractice();
        }
      }
    });
  },

  // 新增：工具方法：打乱数组
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // 新增：显示练习帮助
  showPracticeHelp() {
    wx.showModal({
      title: '📚 练习中心使用说明',
      content: `🎯 智能推荐练习：
• 系统分析您的错题，找出薄弱语法点
• 推荐针对性练习，帮助巩固基础
• 适合：想要系统提升语法能力的用户

⚔️ 错题消灭练习：
• 重复练习错题，直到完全掌握
• 做对设定次数后自动从错题本移除
• 适合：想要彻底解决错题的用户

💡 建议：
• 新手建议先使用智能推荐练习
• 有错题积累后使用错题消灭练习
• 两种方式可以交替使用，效果更佳`,
      showCancel: false,
      confirmText: '明白了',
      confirmColor: '#1890ff'
    });
  },

  // 新增：清空所有错题
  clearAllMistakes() {
    if (this.data.mistakes.length === 0) {
      wx.showToast({
        title: '暂无错题可清空',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认清空',
      content: `确定要清空所有${this.data.mistakes.length}道错题吗？\n\n⚠️ 此操作不可恢复！`,
      confirmText: '确认清空',
      cancelText: '取消',
      confirmColor: '#fa5151',
      success: (res) => {
        if (res.confirm) {
          // 清空错题数据
          this.setData({
            mistakes: [],
            filteredMistakes: []
          });
          
          // 清空本地存储
          wx.setStorageSync('wrongQuestions', []);
          
          // 重新分析数据
          this.analyzeLearningData();
          this.calculateStats();
          
          wx.showToast({
            title: '已清空所有错题',
            icon: 'success',
            duration: 2000
          });
          
          console.log('[错题本] 已清空所有错题');
        }
      }
    });
  }
}); 