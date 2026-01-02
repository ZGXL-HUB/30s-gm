/**
 * 教师端布置语法作业页面（初中版）
 * 
 * ============================================
 * 【初中版独立实现 - 与高中版完全隔离】
 * ============================================
 * 
 * 本文件包含三种作业模式（初中版）：
 * 1. 'zhongkao' - 中考配比15题（10选择+5填空）
 * 2. 'topic-middle' - 专题20题（选择二级菜单）
 * 3. 'custom-middle' - 自选20题（选择三级菜单）
 * 
 * 【重要提示】：
 * 
 * 1. 本文件与高中版完全独立，互不影响
 * 2. 所有函数和数据结构都使用独立的命名空间
 * 3. 使用三级菜单结构：一级（词法/句法）作为分组标签，二级（专题模式选择），三级（自选模式选择）
 * 4. 题目获取逻辑需要指向初中题库
 * 
 * ============================================
 */

// 引入新的三级菜单数据结构
// 注意：由于分包引用主包文件可能有路径问题，将数据文件复制到分包内
let grammarData;
try {
  grammarData = require('../config/middle-school-grammar-data.js');
} catch (error) {
  console.error('加载语法数据失败:', error);
  grammarData = null;
}

Page({
  data: {
    // 作业类型选择
    homeworkType: '', // zhongkao, topic-middle, custom-middle
    showTypeSelector: false,
    homeworkTypes: [
      {
        id: 'zhongkao',
        title: '中考配比15题',
        subtitle: '10选择+5填空，按中考比例配置',
        icon: '📚',
        color: '#4CAF50'
      },
      {
        id: 'topic-middle',
        title: '专题20题',
        subtitle: '选择语法大点专题练习',
        icon: '🎯',
        color: '#2196F3'
      },
      {
        id: 'custom-middle',
        title: '自选20题',
        subtitle: '自由选择语法小点',
        icon: '✏️',
        color: '#FF9800'
      }
    ],

    // 中考配比数据（系统组合逻辑）
    zhongkaoRatio: {
      total: 15,  // 中考配比15题：10选择+5填空
      choiceCount: 10,  // 选择题10题
      fillCount: 5,     // 填空题5题
      yearPackage: '2025',  // 默认年份套餐
      systemComboRules: {
        "时态": 2,        // 必考，2题（1选择+1填空）
        "语态": 1,        // 必考，1题（1选择）
        "代词": 1,
        "介词": 1,
        "形容词/副词": 1,
        "名词": 1,
        "连词": 1,
        "宾语从句": 1,
        "定语从句": 1,
        "状语从句": 1
      },
      selectedGrammarPoints: [], // 动态生成的语法点
      distribution: [] // 动态生成的分发数据
    },

    // 考情分析数据（用于展示）
    examAnalysis: {
      total: 45,  // 总题数（30选择+15填空）
      categories: [
        { name: '动词系统', choice: 13, fill: 8, total: 21, percentage: 46.7, frequency: '⭐⭐⭐⭐⭐' },
        { name: '基础词法', choice: 8, fill: 4, total: 12, percentage: 26.7, frequency: '⭐⭐⭐' },
        { name: '复合句', choice: 6, fill: 2, total: 8, percentage: 17.8, frequency: '⭐⭐⭐⭐' },
        { name: '句子结构', choice: 2, fill: 1, total: 3, percentage: 6.7, frequency: '⭐⭐' },
        { name: '特殊句式', choice: 1, fill: 0, total: 1, percentage: 2.2, frequency: '⭐' }
      ]
    },

    // 使用新的三级菜单数据结构
    grammarMenuData: grammarData ? (grammarData.grammarMenuData || []) : [],
    
    // 专题模式：二级菜单列表（可直接选择）
    level2Topics: [],
    
    // 自选模式：三级菜单列表（可直接选择）
    level3Points: [],
    
    // 当前选中的年份（中考配比模式和自选模式筛选）
    selectedYear: null, // null表示全部，2023/2024/2025表示筛选特定年份
    
    // 当前选中的考频（自选模式筛选）
    selectedFrequency: null, // null表示全部，'low'/'medium'/'high'表示低频/中频/高频
    
    // 中考配比模式：已生成的知识点列表
    zhongkaoGeneratedPoints: [],
    
    // 旧版数据结构（保留用于兼容，后续可删除）
    grammarTopics: [
      {
        id: '基础词法',
        name: '基础词法',
        level: 1,
        status: 'active',
        examFrequency: '⭐⭐⭐',
        examData: { choice: 8, fill: 4, total: 12, percentage: 26.7 },
        questionCount: 0,
        selected: false,
        expanded: false,
        points: [
          {
            id: '名词',
            name: '名词',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐⭐',
            years: [2024, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '可数与不可数名词', name: '可数与不可数名词', status: 'covered', years: [2024], questionCount: { choice: 20, fill: 20 } },
              { id: '名词所有格', name: '名词所有格', status: 'covered', years: [2024], questionCount: { choice: 20, fill: 20 } }
            ]
          },
          {
            id: '代词',
            name: '代词',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐⭐⭐',
            years: [2023, 2024, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '人称代词', name: '人称代词', status: 'covered', years: [2025], questionCount: { choice: 20, fill: 20 } },
              { id: '物主代词', name: '物主代词', status: 'covered', years: [2024, 2025], questionCount: { choice: 20, fill: 20 } },
              { id: '反身代词', name: '反身代词', status: 'covered', years: [2024], questionCount: { choice: 20, fill: 20 } },
              { id: '不定代词', name: '不定代词', status: 'covered', years: [2023, 2025], questionCount: { choice: 20, fill: 20 } }
            ]
          },
          {
            id: '冠词',
            name: '冠词',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐',
            years: [2023, 2024],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '不定冠词a/an', name: '不定冠词a/an', status: 'covered', years: [2024], questionCount: { choice: 20, fill: 20 } },
              { id: '定冠词the', name: '定冠词the', status: 'covered', years: [2023], questionCount: { choice: 20, fill: 20 } },
              { id: '零冠词', name: '零冠词', status: 'extended', years: [], questionCount: { choice: 20, fill: 20 } }
            ]
          },
          {
            id: '数词',
            name: '数词',
            level: 2,
            status: 'hidden',
            examFrequency: '⭐',
            years: [],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: true
          },
          {
            id: '介词',
            name: '介词',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐⭐',
            years: [2023, 2024, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '时间介词', name: '时间介词', status: 'covered', years: [2023, 2024, 2025], questionCount: { choice: 20, fill: 20 } },
              { id: '地点/方式介词', name: '地点/方式介词', status: 'covered', years: [2025], questionCount: { choice: 20, fill: 20 } }
            ]
          },
          {
            id: '连词',
            name: '连词',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐',
            years: [2023, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '并列连词', name: '并列连词', status: 'covered', years: [2025], questionCount: { choice: 20, fill: 20 } },
              { id: '从属连词', name: '从属连词', status: 'covered', years: [2023], questionCount: { choice: 20, fill: 20 } }
            ]
          },
          {
            id: '形容词/副词',
            name: '形容词/副词',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐⭐',
            years: [2023, 2024, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '比较级/最高级', name: '比较级/最高级', status: 'covered', years: [2023, 2024], questionCount: { choice: 20, fill: 20 } },
              { id: '位置与用法', name: '位置与用法', status: 'covered', years: [2025], questionCount: { choice: 20, fill: 20 } }
            ]
          }
        ]
      },
      {
        id: '动词系统',
        name: '动词系统',
        level: 1,
        status: 'active',
        examFrequency: '⭐⭐⭐⭐⭐',
        examData: { choice: 13, fill: 8, total: 21, percentage: 46.7 },
        questionCount: 0,
        selected: false,
        expanded: false,
        points: [
          {
            id: '时态',
            name: '时态',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐⭐⭐⭐',
            years: [2023, 2024, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '一般现在时', name: '一般现在时', status: 'covered', years: [2023], questionCount: { choice: 20, fill: 20 } },
              { id: '一般过去时', name: '一般过去时', status: 'covered', years: [2025], questionCount: { choice: 20, fill: 20 } },
              { id: '一般将来时', name: '一般将来时', status: 'extended', years: [], questionCount: { choice: 20, fill: 20 } },
              { id: '现在进行时', name: '现在进行时', status: 'covered', years: [2024], questionCount: { choice: 20, fill: 20 } },
              { id: '过去进行时', name: '过去进行时', status: 'covered', years: [2024, 2025], questionCount: { choice: 20, fill: 20 } },
              { id: '现在完成时', name: '现在完成时', status: 'covered', years: [2023, 2024, 2025], questionCount: { choice: 20, fill: 20 } }
            ]
          },
          {
            id: '被动语态',
            name: '被动语态',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐⭐',
            years: [2023, 2024, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '一般时被动', name: '一般时被动', status: 'covered', years: [2024, 2025], questionCount: { choice: 20, fill: 20 } }
            ]
          },
          {
            id: '情态动词',
            name: '情态动词',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐⭐⭐',
            years: [2024, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: 'can/could', name: 'can/could', status: 'covered', years: [2025], questionCount: { choice: 20, fill: 20 } },
              { id: 'must/need', name: 'must/need', status: 'covered', years: [2024, 2025], questionCount: { choice: 20, fill: 20 } },
              { id: 'should/had better', name: 'should/had better', status: 'extended', years: [], questionCount: { choice: 20, fill: 20 } }
            ]
          },
          {
            id: '非谓语动词',
            name: '非谓语动词',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐⭐',
            years: [2023, 2024, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '动词不定式', name: '动词不定式', status: 'covered', years: [2023, 2024, 2025], questionCount: { choice: 20, fill: 20 } },
              { id: '动名词', name: '动名词', status: 'covered', years: [2023, 2025], questionCount: { choice: 20, fill: 20 } },
              { id: '分词', name: '分词', status: 'extended', years: [], questionCount: { choice: 20, fill: 20 } }
            ]
          }
        ]
      },
      {
        id: '句子结构',
        name: '句子结构',
        level: 1,
        status: 'active',
        examFrequency: '⭐⭐',
        examData: { choice: 2, fill: 1, total: 3, percentage: 6.7 },
        questionCount: 0,
        selected: false,
        expanded: false,
        points: [
          {
            id: '主谓一致',
            name: '主谓一致',
            level: 2,
            status: 'covered',
            examFrequency: '⭐',
            years: [2024],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false
          },
          {
            id: 'There be句型',
            name: 'There be句型',
            level: 2,
            status: 'covered',
            examFrequency: '⭐',
            years: [2024],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false
          },
          {
            id: '疑问句',
            name: '疑问句',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐',
            years: [2024],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false
          },
          {
            id: '感叹句',
            name: '感叹句',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐',
            years: [2024, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false
          }
        ]
      },
      {
        id: '复合句',
        name: '复合句',
        level: 1,
        status: 'active',
        examFrequency: '⭐⭐⭐⭐',
        examData: { choice: 6, fill: 2, total: 8, percentage: 17.8 },
        questionCount: 0,
        selected: false,
        expanded: false,
        points: [
          {
            id: '宾语从句',
            name: '宾语从句',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐⭐⭐',
            years: [2023, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '连接词', name: '连接词', status: 'covered', years: [2023, 2025], questionCount: { choice: 20, fill: 20 } },
              { id: '语序', name: '语序', status: 'covered', years: [2023], questionCount: { choice: 20, fill: 20 } },
              { id: '时态一致', name: '时态一致', status: 'covered', years: [2025], questionCount: { choice: 20, fill: 20 } }
            ]
          },
          {
            id: '定语从句',
            name: '定语从句',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐⭐',
            years: [2024, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '关系代词', name: '关系代词', status: 'covered', years: [2024, 2025], questionCount: { choice: 20, fill: 20 } },
              { id: '关系副词', name: '关系副词', status: 'extended', years: [], questionCount: { choice: 20, fill: 20 } }
            ]
          },
          {
            id: '状语从句',
            name: '状语从句',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐⭐',
            years: [2023, 2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false,
            points: [
              { id: '时间状语从句', name: '时间状语从句', status: 'covered', years: [2025], questionCount: { choice: 20, fill: 20 } },
              { id: '条件状语从句', name: '条件状语从句', status: 'covered', years: [2025], questionCount: { choice: 20, fill: 20 } },
              { id: '让步状语从句', name: '让步状语从句', status: 'covered', years: [2023], questionCount: { choice: 20, fill: 20 } }
            ]
          }
        ]
      },
      {
        id: '特殊句式',
        name: '特殊句式',
        level: 1,
        status: 'active',
        examFrequency: '⭐',
        examData: { choice: 1, fill: 0, total: 1, percentage: 2.2 },
        questionCount: 0,
        selected: false,
        expanded: false,
        points: [
          {
            id: '祈使句',
            name: '祈使句',
            level: 2,
            status: 'covered',
            examFrequency: '⭐',
            years: [2024],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false
          },
          {
            id: '同义句转换',
            name: '同义句转换',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐',
            years: [2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false
          }
        ]
      },
      {
        id: '应用与辨析',
        name: '应用与辨析',
        level: 1,
        status: 'active',
        examFrequency: '⭐',
        examData: { choice: 0, fill: 0, total: 0, percentage: 0 },
        questionCount: 0,
        selected: false,
        expanded: false,
        points: [
          {
            id: '动词短语',
            name: '动词短语',
            level: 2,
            status: 'covered',
            examFrequency: '⭐',
            years: [2024],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false
          },
          {
            id: '近义词辨析',
            name: '近义词辨析',
            level: 2,
            status: 'covered',
            examFrequency: '⭐⭐',
            years: [2025],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false
          },
          {
            id: '情景交际',
            name: '情景交际',
            level: 2,
            status: 'covered',
            examFrequency: '⭐',
            years: [2023],
            questionCount: { choice: 20, fill: 20 },
            selected: false,
            disabled: false
          }
        ]
      }
    ],

    // 其他数据字段（复用高中版结构，但独立）
    selectedTags: [],
    selectedTopics: [],
    totalQuestions: 0,
    totalChoiceQuestions: 0,  // 选择题总数
    totalFillQuestions: 0,     // 填空题总数
    shuffleQuestions: false,
    categoryCounts: [],
    smartTitle: '',
    smartRemark: '',
    showPreview: false,
    variantCount: 0,
    
    // 专题模式题型控制
    topicModeTypeControl: {
      choice: {
        options: [5, 10, 15],
        current: 10,
        default: 10
      },
      fill: {
        options: [5, 10, 15],
        current: 5,
        default: 5
      }
    },
    
    // 自选模式题型控制
    customModeTypeControl: {
      choice: {
        options: [5, 10, 15],
        current: 10,
        default: 10
      },
      fill: {
        options: [5, 10, 15],
        current: 5,
        default: 5
      }
    },
    
    // 知识点题型分配（用于显示和微调）
    pointTypeDistribution: {},  // { pointId: { choice: 3, fill: 2 } }
    
    // 专题模式下的知识点列表（用于显示）
    topicPointsList: []  // 当前选中专题的所有子知识点
  },

  onLoad(options) {
    try {
      // 设置页面标题
      wx.setNavigationBarTitle({
        title: '布置语法作业（初中）'
      });
      
      // 初始化数据结构
      this.initGrammarData();
    } catch (error) {
      console.error('页面加载失败:', error);
      wx.showModal({
        title: '页面加载失败',
        content: '请刷新页面重试',
        showCancel: false
      });
    }
  },
  
  /**
   * 初始化语法数据
   */
  initGrammarData() {
    try {
      if (!grammarData) {
        console.error('语法数据未加载');
        wx.showToast({
          title: '数据加载失败',
          icon: 'error'
        });
        return;
      }
      
      // 获取所有二级菜单（专题模式的选择目标）
      const level2Topics = grammarData.getAllLevel2Topics();
      
      // 获取所有三级菜单（自选模式的选择目标）
      const level3Points = grammarData.getAllLevel3Points();
      
      // 为专题模式添加选中状态
      const topicsWithSelection = level2Topics.map(topic => ({
        ...topic,
        selected: false,
        expanded: false
      }));
      
      // 为自选模式添加选中状态
      const pointsWithSelection = level3Points.map(point => ({
        ...point,
        selected: false
      }));
      
      // 为grammarMenuData添加展开状态（用于自选模式）
      const menuDataWithExpanded = grammarData.grammarMenuData.map(level1 => ({
        ...level1,
        children: level1.children.map(level2 => ({
          ...level2,
          expanded: false // 默认折叠
        }))
      }));
      
      this.setData({
        level2Topics: topicsWithSelection,
        level3Points: pointsWithSelection,
        grammarMenuData: menuDataWithExpanded,
        originalGrammarMenuData: menuDataWithExpanded // 保存原始数据副本
      });
    } catch (error) {
      console.error('初始化语法数据失败:', error);
      wx.showToast({
        title: '初始化失败: ' + error.message,
        icon: 'error',
        duration: 3000
      });
    }
  },

  // 选择作业类型
  async selectHomeworkType(e) {
    const type = e.currentTarget.dataset.type;
    
    // 确保数据已初始化
    if (!this.data.grammarMenuData || this.data.grammarMenuData.length === 0) {
      this.initGrammarData();
      // 等待一下确保数据设置完成
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.setData({ 
      homeworkType: type,
      showTypeSelector: false
    });

    // 根据类型执行相应逻辑
    if (type === 'zhongkao') {
      await this.executeZhongkaoSystemCombo();
    } else if (type === 'topic-middle') {
      // 专题模式：初始化题型控制
      this.initTopicMode();
    } else if (type === 'custom-middle') {
      // 自选模式：初始化题型控制
      this.initCustomMode();
    }
  },

  /**
   * 初始化专题模式
   */
  initTopicMode() {
    const { topicModeTypeControl } = this.data;
    this.setData({
      totalChoiceQuestions: topicModeTypeControl.choice.current,
      totalFillQuestions: topicModeTypeControl.fill.current,
      totalQuestions: topicModeTypeControl.choice.current + topicModeTypeControl.fill.current
    });
  },

  /**
   * 初始化自选模式
   */
  initCustomMode() {
    const { customModeTypeControl } = this.data;
    this.setData({
      totalChoiceQuestions: customModeTypeControl.choice.current,
      totalFillQuestions: customModeTypeControl.fill.current,
      totalQuestions: customModeTypeControl.choice.current + customModeTypeControl.fill.current
    });
  },

  /**
   * 切换专题模式选择题数量
   */
  switchTopicChoiceCount(e) {
    const count = parseInt(e.currentTarget.dataset.count);
    this.setData({
      'topicModeTypeControl.choice.current': count,
      totalChoiceQuestions: count,
      totalQuestions: count + this.data.totalFillQuestions
    }, () => {
      this.redistributeTopicQuestions();
    });
  },

  /**
   * 切换专题模式填空题数量
   */
  switchTopicFillCount(e) {
    const count = parseInt(e.currentTarget.dataset.count);
    this.setData({
      'topicModeTypeControl.fill.current': count,
      totalFillQuestions: count,
      totalQuestions: this.data.totalChoiceQuestions + count
    }, () => {
      this.redistributeTopicQuestions();
    });
  },

  /**
   * 切换自选模式选择题数量
   */
  switchCustomChoiceCount(e) {
    const count = parseInt(e.currentTarget.dataset.count);
    const currentFill = this.data.customModeTypeControl ? this.data.customModeTypeControl.fill.current : this.data.totalFillQuestions;
    this.setData({
      'customModeTypeControl.choice.current': count,
      totalChoiceQuestions: count,
      totalQuestions: count + currentFill
    }, () => {
      // 重新分配题目到已选知识点
      this.redistributeCustomQuestions();
    });
  },

  /**
   * 切换自选模式填空题数量
   */
  switchCustomFillCount(e) {
    const count = parseInt(e.currentTarget.dataset.count);
    const currentChoice = this.data.customModeTypeControl ? this.data.customModeTypeControl.choice.current : this.data.totalChoiceQuestions;
    this.setData({
      'customModeTypeControl.fill.current': count,
      totalFillQuestions: count,
      totalQuestions: currentChoice + count
    }, () => {
      // 重新分配题目到已选知识点
      this.redistributeCustomQuestions();
    });
  },

  /**
   * 重新分配专题模式题目（智能均分到子知识点 - 重构版）
   * 使用新的数据结构：从二级菜单获取其下的三级菜单
   */
  redistributeTopicQuestions() {
    const { selectedTopics, totalChoiceQuestions, totalFillQuestions } = this.data;
    
    if (selectedTopics.length === 0) {
      this.setData({ 
        pointTypeDistribution: {},
        topicPointsList: []
      });
      return;
    }
    
    // 专题模式只允许选择一个专题（二级菜单）
    const topicName = selectedTopics[0];
    const selectedTopic = this.data.level2Topics.find(t => t.name === topicName);
    
    if (!selectedTopic || !selectedTopic.children || selectedTopic.children.length === 0) {
      this.setData({ 
        pointTypeDistribution: {},
        topicPointsList: []
      });
      return;
    }
    
    // 获取该二级菜单下的所有三级菜单（子知识点）
    const allPoints = selectedTopic.children || [];
    
    if (allPoints.length === 0) {
      this.setData({ 
        pointTypeDistribution: {},
        topicPointsList: []
      });
      return;
    }
    
    // 智能均分选择题和填空题
    const distribution = this.distributeQuestionsByType(allPoints, totalChoiceQuestions, totalFillQuestions);
    
    // 更新知识点列表（用于显示，包含题型数量）
    const pointsList = allPoints.map(p => {
      const pointName = p.name || p.id;
      const dist = distribution[pointName] || { choice: 0, fill: 0 };
      return {
        id: p.id || pointName,
        name: pointName,
        choiceCount: dist.choice,
        fillCount: dist.fill
      };
    });
    
    this.setData({ 
      pointTypeDistribution: distribution,
      topicPointsList: pointsList
    });
    this.updateCategoryCounts();
  },

  /**
   * 重新分配自选模式题目（均分到所有已选知识点）
   * 除不尽的优先分配给先选的知识点
   */
  redistributeCustomQuestions() {
    const { selectedTags, totalChoiceQuestions, totalFillQuestions, customModeTypeControl } = this.data;
    
    // 使用用户设定的总题量（而不是实际分配的总数）
    const targetChoice = customModeTypeControl ? customModeTypeControl.choice.current : totalChoiceQuestions;
    const targetFill = customModeTypeControl ? customModeTypeControl.fill.current : totalFillQuestions;
    
    if (selectedTags.length === 0) {
      this.setData({ 
        pointTypeDistribution: {},
        selectedTags: [],
        totalChoiceQuestions: 0,
        totalFillQuestions: 0,
        totalQuestions: 0
      });
      return;
    }
    
    // 均分到所有已选知识点，除不尽的优先分配给先选的知识点
    const distribution = {};
    const baseChoice = Math.floor(targetChoice / selectedTags.length);
    const baseFill = Math.floor(targetFill / selectedTags.length);
    const choiceRemainder = targetChoice % selectedTags.length;
    const fillRemainder = targetFill % selectedTags.length;
    
    const updatedTags = selectedTags.map((tag, index) => {
      // 优先分配给先选的知识点（index小的）
      const choiceCount = baseChoice + (index < choiceRemainder ? 1 : 0);
      const fillCount = baseFill + (index < fillRemainder ? 1 : 0);
      
      distribution[tag.name] = {
        choice: choiceCount,
        fill: fillCount
      };
      
      return {
        ...tag,
        choiceCount: choiceCount,
        fillCount: fillCount
      };
    });
    
    this.setData({ 
      pointTypeDistribution: distribution,
      selectedTags: updatedTags
    }, () => {
      // 更新总题数显示（应该等于用户设定的总数）
      this.setData({
        totalChoiceQuestions: targetChoice,
        totalFillQuestions: targetFill,
        totalQuestions: targetChoice + targetFill
      });
    });
  },

  /**
   * 智能分配题目到知识点（区分题型）
   */
  distributeQuestionsByType(points, totalChoice, totalFill) {
    if (points.length === 0) return {};
    
    const distribution = {};
    const pointCount = points.length;
    
    // 均分选择题
    const baseChoice = Math.floor(totalChoice / pointCount);
    const choiceRemainder = totalChoice % pointCount;
    
    // 均分填空题
    const baseFill = Math.floor(totalFill / pointCount);
    const fillRemainder = totalFill % pointCount;
    
    // 随机分配余数
    const shuffledIndices = points.map((_, index) => index).sort(() => Math.random() - 0.5);
    
    points.forEach((point, index) => {
      const pointName = point.name || point.id;
      const choiceExtra = shuffledIndices.indexOf(index) < choiceRemainder ? 1 : 0;
      const fillExtra = shuffledIndices.indexOf(index) < fillRemainder ? 1 : 0;
      
      distribution[pointName] = {
        choice: baseChoice + choiceExtra,
        fill: baseFill + fillExtra
      };
    });
    
    return distribution;
  },

  /**
   * 【中考配比专用函数】
   * 执行中考配比系统组合逻辑
   * 功能：生成正好15题（10选择+5填空），其中"时态"必选2题，"语态"必选1题
   */
  async executeZhongkaoSystemCombo() {
    try {
      wx.showLoading({ title: '正在生成中考配比...' });
      
      const yearPackage = this.data.zhongkaoRatio.yearPackage || '2025';
      const choiceCount = this.data.zhongkaoRatio.choiceCount || 10;
      const fillCount = this.data.zhongkaoRatio.fillCount || 5;
      
      console.log(`生成${yearPackage}年套餐，${choiceCount}选择+${fillCount}填空`);
      
      // 根据年份套餐筛选知识点（优先选择该年份考过的）
      const selectedPoints = {
        choice: [],  // 选择题语法点
        fill: []     // 填空题语法点
      };
      const usedGrammarPoints = new Set();
      
      // 第一步：必选"时态"2题（1选择+1填空）和"语态"1题（1选择）
      const requiredRules = [
        { category: '时态', choice: 1, fill: 1 },
        { category: '被动语态', choice: 1, fill: 0 }
      ];
      
      for (const rule of requiredRules) {
        const grammarPoints = this.getGrammarPointsByCategory(rule.category, yearPackage);
        
        // 选择选择题语法点
        if (rule.choice > 0 && grammarPoints.length > 0) {
          const availablePoints = grammarPoints.filter(p => !usedGrammarPoints.has(p));
          if (availablePoints.length > 0) {
            const randomPoint = availablePoints[Math.floor(Math.random() * availablePoints.length)];
            selectedPoints.choice.push(randomPoint);
            usedGrammarPoints.add(randomPoint);
          }
        }
        
        // 选择填空题语法点
        if (rule.fill > 0 && grammarPoints.length > 0) {
          const availablePoints = grammarPoints.filter(p => !usedGrammarPoints.has(p));
          if (availablePoints.length > 0) {
            const randomPoint = availablePoints[Math.floor(Math.random() * availablePoints.length)];
            selectedPoints.fill.push(randomPoint);
            usedGrammarPoints.add(randomPoint);
          }
        }
      }
      
      // 第二步：从其他分类中随机选择剩余题目
      const remainingChoiceCount = choiceCount - selectedPoints.choice.length;
      const remainingFillCount = fillCount - selectedPoints.fill.length;
      
      // 获取所有可用分类（排除已选的必选分类）
      const allCategories = this.getAllCategories(yearPackage);
      const usedCategories = new Set(['时态', '被动语态']);
      const availableCategories = allCategories.filter(cat => !usedCategories.has(cat));
      
      // 随机选择分类并分配题目
      const shuffledCategories = [...availableCategories].sort(() => Math.random() - 0.5);
      
      // 分配选择题
      let choiceIndex = 0;
      for (let i = 0; i < remainingChoiceCount && choiceIndex < shuffledCategories.length; i++) {
        const category = shuffledCategories[choiceIndex % shuffledCategories.length];
        const grammarPoints = this.getGrammarPointsByCategory(category, yearPackage);
        const availablePoints = grammarPoints.filter(p => !usedGrammarPoints.has(p));
        
        if (availablePoints.length > 0) {
          const randomPoint = availablePoints[Math.floor(Math.random() * availablePoints.length)];
          selectedPoints.choice.push(randomPoint);
          usedGrammarPoints.add(randomPoint);
        }
        choiceIndex++;
      }
      
      // 分配填空题
      let fillIndex = 0;
      for (let i = 0; i < remainingFillCount && fillIndex < shuffledCategories.length; i++) {
        const category = shuffledCategories[fillIndex % shuffledCategories.length];
        const grammarPoints = this.getGrammarPointsByCategory(category, yearPackage);
        const availablePoints = grammarPoints.filter(p => !usedGrammarPoints.has(p));
        
        if (availablePoints.length > 0) {
          const randomPoint = availablePoints[Math.floor(Math.random() * availablePoints.length)];
          selectedPoints.fill.push(randomPoint);
          usedGrammarPoints.add(randomPoint);
        }
        fillIndex++;
      }
      
      // 更新界面显示
      const allSelectedPoints = [...selectedPoints.choice, ...selectedPoints.fill];
      const topics = this.data.grammarTopics.map(topic => {
        const updatedPoints = topic.points ? topic.points.map(point => {
          const pointName = point.name || point.id;
          return {
            ...point,
            selected: allSelectedPoints.includes(pointName)
          };
        }) : [];
        
        return {
          ...topic,
          points: updatedPoints
        };
      });
      
      // 更新中考配比数据
      this.setData({ 
        grammarTopics: topics,
        'zhongkaoRatio.selectedGrammarPoints': allSelectedPoints,
        'zhongkaoRatio.distribution': {
          choice: selectedPoints.choice,
          fill: selectedPoints.fill
        }
      });
      
      wx.hideLoading();
      wx.showToast({
        title: '中考配比生成成功',
        icon: 'success'
      });
      
    } catch (error) {
      console.error('生成中考配比失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成失败',
        icon: 'error'
      });
    }
  },

  /**
   * 切换年份套餐
   */
  switchYearPackage(e) {
    const year = e.currentTarget.dataset.year;
    
    this.setData({
      'zhongkaoRatio.yearPackage': year
    }, () => {
      // 重新生成配比
      this.executeZhongkaoSystemCombo();
    });
  },

  /**
   * 重选一批（中考配比）
   */
  regenerateZhongkaoCombo() {
    this.executeZhongkaoSystemCombo();
  },

  /**
   * 获取指定分类下的所有语法点（根据年份筛选）
   */
  getGrammarPointsByCategory(category, yearPackage = null) {
    // 遍历所有一级分类
    for (const topic of this.data.grammarTopics) {
      // 查找匹配的二级分类
      if (topic.points) {
        const matchedPoint = topic.points.find(p => p.name === category || p.id === category);
        if (matchedPoint) {
          // 如果有三级知识点，返回三级知识点
          if (matchedPoint.points && matchedPoint.points.length > 0) {
            let points = matchedPoint.points;
            // 如果指定了年份，优先选择该年份考过的
            if (yearPackage && matchedPoint.years) {
              const year = parseInt(yearPackage);
              const yearPoints = points.filter(p => p.years && p.years.includes(year));
              if (yearPoints.length > 0) {
                return yearPoints.map(p => p.name || p.id);
              }
            }
            return points.map(p => p.name || p.id);
          }
          // 否则返回二级分类本身
          return [matchedPoint.name || matchedPoint.id];
        }
      }
    }
    return [];
  },

  /**
   * 获取所有可用分类（根据年份筛选）
   */
  getAllCategories(yearPackage = null) {
    const categories = [];
    for (const topic of this.data.grammarTopics) {
      if (topic.points) {
        for (const point of topic.points) {
          // 如果指定了年份，只返回该年份考过的分类
          if (yearPackage && point.years) {
            const year = parseInt(yearPackage);
            if (point.years.includes(year)) {
              categories.push(point.name || point.id);
            }
          } else {
            // 否则返回所有已考的分类
            if (point.status === 'covered') {
              categories.push(point.name || point.id);
            }
          }
        }
      }
    }
    return categories;
  },

  /**
   * 选择语法大点（专题模式 - 初中版 - 重构版）
   * 选中二级菜单后，智能均分题目到三级知识点
   */
  selectGrammarTopic(e) {
    const topicId = e.currentTarget.dataset.id;
    
    // 从新的数据结构中查找二级菜单
    const selectedTopic = this.data.level2Topics.find(t => t.id === topicId);
    if (!selectedTopic) {
      console.warn('未找到二级菜单:', topicId);
      return;
    }
    
    // 单选逻辑：取消其他所有选择，只保留当前选择的专题
    const topics = this.data.level2Topics.map(topic => ({
      ...topic,
      selected: topic.id === topicId
    }));
    
    const selectedTopics = [selectedTopic.name];
    
    // 重新分配题目到子知识点（三级菜单）
    this.setData({ 
      level2Topics: topics,
      selectedTopics: selectedTopics
    }, () => {
      this.redistributeTopicQuestions();
    });
  },

  /**
   * 选择语法小点（自选模式 - 初中版 - 重构版）
   * 选择三级菜单（具体知识点）
   */
  selectPoint(e) {
    const pointId = e.currentTarget.dataset.pointId;
    const { homeworkType } = this.data;
    
    // 专题模式：三级菜单不可选择
    if (homeworkType === 'topic-middle') {
      wx.showToast({
        title: '专题模式下请选择二级菜单',
        icon: 'none'
      });
      return;
    }
    
    // 从新的数据结构中查找并切换三级菜单的选中状态
    const points = this.data.level3Points.map(point => {
      if (point.id === pointId) {
        return { 
          ...point, 
          selected: !point.selected
        };
      }
      return point;
    });
    
    this.setData({ level3Points: points }, () => {
      // 先更新已选标签，然后重新分配题目
      this.updateSelectedTags();
      this.updateCategoryCounts();
    });
  },

  /**
   * 展开/收起二级菜单（自选模式）
   */
  toggleLevel2(e) {
    const level2Id = e.currentTarget.dataset.level2Id;
    const menuData = this.data.grammarMenuData.map(level1 => {
      const updatedChildren = level1.children.map(level2 => {
        if (level2.id === level2Id) {
          return { ...level2, expanded: !(level2.expanded || false) };
        }
        return level2;
      });
      return { ...level1, children: updatedChildren };
    });
    this.setData({ grammarMenuData: menuData });
  },
  
  /**
   * 按考频筛选（自选模式）
   * 低频：0次（⭐或空）
   * 中频：1-2次（⭐⭐或⭐⭐⭐）
   * 高频：3次及以上（⭐⭐⭐⭐或⭐⭐⭐⭐⭐）
   */
  filterByFrequency(e) {
    const frequency = e.currentTarget.dataset.frequency === 'null' ? null : e.currentTarget.dataset.frequency;
    
    // 根据考频字符串判断考频等级
    // 根据calculateFrequency函数：
    // 0次 -> '⭐'
    // 1次 -> '⭐⭐'
    // 2次 -> '⭐⭐⭐'
    // 3-4次 -> '⭐⭐⭐⭐'
    // 5次及以上 -> '⭐⭐⭐⭐⭐'
    const getFrequencyLevel = (examFrequency) => {
      if (!examFrequency || examFrequency === '') return 'low'; // 无考频或空字符串为低频
      const starCount = examFrequency.length; // 星星数量（每个⭐占1个字符）
      if (starCount === 1) return 'low'; // ⭐ = 0次，低频
      if (starCount === 2) return 'medium'; // ⭐⭐ = 1次，中频
      if (starCount === 3) return 'medium'; // ⭐⭐⭐ = 2次，中频
      if (starCount >= 4) return 'high'; // ⭐⭐⭐⭐及以上 = 3次及以上，高频
      return 'low';
    };
    
    // 使用原始数据进行筛选，确保每次筛选都基于完整数据
    const sourceData = this.data.originalGrammarMenuData.length > 0 
      ? this.data.originalGrammarMenuData 
      : this.data.grammarMenuData;
    
    // 更新菜单数据，筛选并自动展开符合条件的二级菜单
    const menuData = sourceData.map(level1 => ({
      ...level1,
      children: level1.children.map(level2 => {
        // 筛选三级菜单（知识点）
        const filteredChildren = frequency ? 
          level2.children.filter(point => {
            const pointFrequency = getFrequencyLevel(point.examFrequency);
            return pointFrequency === frequency;
          }) : 
          level2.children;
        
        // 如果筛选后还有知识点，且当前筛选不是"全部"，则自动展开
        // 如果选择"全部"，则收起所有二级菜单
        const shouldExpand = frequency !== null && filteredChildren.length > 0;
        
        return {
          ...level2,
          expanded: frequency === null ? false : (shouldExpand || (level2.expanded || false)),
          children: filteredChildren
        };
      }).filter(level2 => level2.children.length > 0) // 过滤掉没有知识点的二级菜单
    }));
    
    this.setData({ 
      selectedFrequency: frequency,
      grammarMenuData: menuData
    });
  },

  /**
   * 更新已选标签（自选模式 - 重构版）
   * 使用新的三级菜单数据结构
   */
  updateSelectedTags() {
    const { level3Points, pointTypeDistribution } = this.data;
    const selectedTags = [];
    
    // 遍历三级菜单，找出所有选中的知识点（保持选择顺序）
    level3Points.forEach(point => {
      if (point.selected) {
        const pointName = point.name || point.id;
        const dist = pointTypeDistribution[pointName] || { choice: 0, fill: 0 };
        selectedTags.push({
          name: pointName,
          id: point.id || pointName,
          choiceCount: dist.choice,
          fillCount: dist.fill,
          examFrequency: point.examFrequency,
          examYears: point.examYears,
          level1Name: point.level1Name,
          level2Name: point.level2Name
        });
      }
    });
    
    this.setData({ selectedTags }, () => {
      // 自选模式下，重新分配题目数量（实时更新）
      if (this.data.homeworkType === 'custom-middle') {
        this.redistributeCustomQuestions();
      }
    });
  },

  /**
   * 更新总题数
   */
  updateSelectedCount() {
    const { pointTypeDistribution } = this.data;
    let totalChoice = 0;
    let totalFill = 0;
    
    Object.values(pointTypeDistribution).forEach(dist => {
      totalChoice += dist.choice || 0;
      totalFill += dist.fill || 0;
    });
    
    this.setData({
      totalChoiceQuestions: totalChoice,
      totalFillQuestions: totalFill,
      totalQuestions: totalChoice + totalFill
    });
  },

  /**
   * 更新分类计数
   */
  updateCategoryCounts() {
    const { grammarTopics, pointTypeDistribution } = this.data;
    const categoryCounts = [];
    
    grammarTopics.forEach(topic => {
      let count = 0;
      if (topic.points) {
        topic.points.forEach(point => {
          const pointName = point.name || point.id;
          if (pointTypeDistribution[pointName]) {
            const dist = pointTypeDistribution[pointName];
            count += (dist.choice || 0) + (dist.fill || 0);
          }
          // 检查三级知识点
          if (point.points) {
            point.points.forEach(subPoint => {
              const subPointName = subPoint.name || subPoint.id;
              if (pointTypeDistribution[subPointName]) {
                const dist = pointTypeDistribution[subPointName];
                count += (dist.choice || 0) + (dist.fill || 0);
              }
            });
          }
        });
      }
      categoryCounts.push(count);
    });
    
    this.setData({ categoryCounts });
  },

  /**
   * 移除选中的标签（重构版）
   * 使用新的三级菜单数据结构
   */
  removeSelectedTag(e) {
    const index = e.currentTarget.dataset.index;
    const selectedTags = [...this.data.selectedTags];
    const removedTag = selectedTags[index];
    
    selectedTags.splice(index, 1);
    
    // 更新level3Points中的选中状态
    const points = this.data.level3Points.map(point => {
      if (point.id === removedTag.id || point.name === removedTag.name) {
        return { ...point, selected: false };
      }
      return point;
    });
    
    this.setData({ level3Points: points }, () => {
      // 更新已选标签，会自动触发重新分配
      this.updateSelectedTags();
      this.updateCategoryCounts();
    });
  },
  
  /**
   * 全选某个二级菜单下的所有三级菜单（自选模式）
   */
  selectAllPoints(e) {
    const level2Id = e.currentTarget.dataset.level2Id;
    if (!level2Id) return;
    
    // 找到该二级菜单下的所有三级菜单
    const points = this.data.level3Points.map(point => {
      if (point.level2Id === level2Id) {
        return { ...point, selected: true };
      }
      return point;
    });
    
    this.setData({ level3Points: points }, () => {
      this.updateSelectedTags();
      this.updateSelectedCount();
      this.updateCategoryCounts();
      if (this.data.homeworkType === 'custom-middle') {
        this.redistributeCustomQuestions();
      }
    });
  },
  
  /**
   * 筛选知识点（自选模式）
   * @param {number|null} year - 年份筛选（2023/2024/2025/null表示全部）
   * @param {string|null} frequency - 考频筛选（'high'/'medium'/'low'/null表示全部）
   */
  filterPoints(year = null, frequency = null) {
    let filteredPoints = [...this.data.level3Points];
    
    // 按年份筛选
    if (year) {
      filteredPoints = filteredPoints.filter(point => 
        point.examYears && point.examYears.includes(year)
      );
    }
    
    // 按考频筛选
    if (frequency) {
      filteredPoints = filteredPoints.filter(point => {
        const stars = point.examFrequency || '';
        if (frequency === 'high') {
          return stars.length >= 4; // ⭐⭐⭐⭐及以上
        } else if (frequency === 'medium') {
          return stars.length === 3; // ⭐⭐⭐
        } else if (frequency === 'low') {
          return stars.length <= 2; // ⭐⭐及以下
        }
        return true;
      });
    }
    
    return filteredPoints;
  },

  /**
   * 调整知识点题型数量（微调功能）
   */
  adjustPointTypeCount(e) {
    const { pointId, type, delta } = e.currentTarget.dataset;
    const distribution = { ...this.data.pointTypeDistribution };
    
    if (!distribution[pointId]) {
      distribution[pointId] = { choice: 0, fill: 0 };
    }
    
    const currentCount = distribution[pointId][type] || 0;
    const deltaValue = parseInt(delta);
    const newCount = Math.max(0, currentCount + deltaValue);
    
    // 计算当前所有知识点的总数（不包括当前要修改的知识点）
    let totalChoice = 0;
    let totalFill = 0;
    Object.keys(distribution).forEach(key => {
      if (key !== pointId) {
        totalChoice += distribution[key].choice || 0;
        totalFill += distribution[key].fill || 0;
      }
    });
    
    // 加上新值后计算总数
    if (type === 'choice') {
      totalChoice += newCount;
      totalFill += distribution[pointId].fill || 0; // 保持填空题不变
    } else {
      totalFill += newCount;
      totalChoice += distribution[pointId].choice || 0; // 保持选择题不变
    }
    
    // 获取用户设定的上限（专题模式使用topicModeTypeControl，自选模式使用customModeTypeControl）
    let maxChoice = 0;
    let maxFill = 0;
    if (this.data.homeworkType === 'topic-middle') {
      maxChoice = this.data.topicModeTypeControl.choice.current || 0;
      maxFill = this.data.topicModeTypeControl.fill.current || 0;
    } else if (this.data.homeworkType === 'custom-middle') {
      maxChoice = this.data.customModeTypeControl.choice.current || 0;
      maxFill = this.data.customModeTypeControl.fill.current || 0;
    } else {
      // 中考配比模式使用实际分配的总数
      maxChoice = this.data.totalChoiceQuestions;
      maxFill = this.data.totalFillQuestions;
    }
    
    // 检查上限：只有当增加数量（delta > 0）且总数超过上限时才提示
    if (deltaValue > 0) {
      if (type === 'choice' && totalChoice > maxChoice) {
        wx.showToast({ title: '选择题总数已达上限', icon: 'none' });
        return;
      }
      if (type === 'fill' && totalFill > maxFill) {
        wx.showToast({ title: '填空题总数已达上限', icon: 'none' });
        return;
      }
    }
    
    distribution[pointId][type] = newCount;
    
    // 更新显示列表（专题模式）
    const { topicPointsList } = this.data;
    const updatedPointsList = topicPointsList.map(p => {
      if (p.name === pointId) {
        return {
          ...p,
          choiceCount: type === 'choice' ? newCount : (p.choiceCount || 0),
          fillCount: type === 'fill' ? newCount : (p.fillCount || 0)
        };
      }
      return p;
    });
    
    // 更新显示列表（自选模式）
    const { selectedTags } = this.data;
    const updatedTags = selectedTags.map(tag => {
      if (tag.name === pointId) {
        return {
          ...tag,
          choiceCount: type === 'choice' ? newCount : (tag.choiceCount || 0),
          fillCount: type === 'fill' ? newCount : (tag.fillCount || 0)
        };
      }
      return tag;
    });
    
    this.setData({ 
      pointTypeDistribution: distribution,
      topicPointsList: updatedPointsList,
      selectedTags: updatedTags
    }, () => {
      this.updateSelectedCount();
      this.updateCategoryCounts();
    });
  },

  /**
   * 切换乱序开关
   */
  toggleShuffle(e) {
    this.setData({
      shuffleQuestions: e.detail.value
    });
  },

  /**
   * 显示变式题选择器（跳转到预览）
   */
  showVariantSelector() {
    // 初中版暂不支持变式题，直接跳转预览
    this.goToPreview();
  },


  /**
   * 跳转到预览页面
   */
  async goToPreview() {
    try {
      wx.showLoading({ title: '准备题目数据...' });
      
      const { homeworkType, selectedTopics, selectedTags, zhongkaoRatio, pointTypeDistribution, totalChoiceQuestions, totalFillQuestions } = this.data;
      
      // 根据模式生成题目数据
      let questions = [];
      
      if (homeworkType === 'zhongkao') {
        // 中考配比模式：生成题目
        questions = await this.generateZhongkaoQuestions();
      } else if (homeworkType === 'topic-middle') {
        // 专题模式：根据pointTypeDistribution生成题目
        questions = await this.generateTopicQuestions();
      } else if (homeworkType === 'custom-middle') {
        // 自选模式：根据pointTypeDistribution生成题目
        questions = await this.generateCustomQuestions();
      }
      
      // 构建作业数据
      const assignmentData = {
        id: `assignment_middle_${Date.now()}`,
        type: homeworkType,
        title: this.getAssignmentTitle(),
        selectedTopics: selectedTopics || [],
        selectedTags: selectedTags || [],
        pointTypeDistribution: pointTypeDistribution || {},
        zhongkaoRatio: homeworkType === 'zhongkao' ? zhongkaoRatio : null,
        totalChoiceQuestions: totalChoiceQuestions || 0,
        totalFillQuestions: totalFillQuestions || 0,
        questions: questions,
        totalQuestions: questions.length,
        shuffleQuestions: this.data.shuffleQuestions,
        createdAt: new Date().toISOString()
      };
      
      
      wx.hideLoading();
      
      wx.navigateTo({
        url: `/pages/teacher/teacher-generate-material/index?data=${encodeURIComponent(JSON.stringify(assignmentData))}`
      });
    } catch (error) {
      wx.hideLoading();
      console.error('准备题目数据失败:', error);
      wx.showToast({
        title: '准备数据失败',
        icon: 'error'
      });
    }
  },

  /**
   * 获取作业标题
   */
  getAssignmentTitle() {
    const { homeworkType } = this.data;
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
    
    switch (homeworkType) {
      case 'zhongkao':
        return `中考配比练习${today}`;
      case 'topic-middle':
        return `专题练习${today}`;
      case 'custom-middle':
        return `自选语法练习${today}`;
      default:
        return `语法练习${today}`;
    }
  },

  /**
   * 生成中考配比题目
   */
  async generateZhongkaoQuestions() {
    const { zhongkaoRatio } = this.data;
    const questions = [];
    
    // 从selectedGrammarPoints生成题目
    if (zhongkaoRatio.selectedGrammarPoints && zhongkaoRatio.selectedGrammarPoints.length > 0) {
      const distribution = zhongkaoRatio.distribution || {};
      const choicePoints = distribution.choice || [];
      const fillPoints = distribution.fill || [];
      
      // 生成选择题
      for (const point of choicePoints) {
        questions.push({
          id: `question_${Date.now()}_${Math.random()}`,
          grammarPoint: point,
          category: point,
          type: '选择题',
          text: `[选择题] ${point} 相关题目`,
          answer: 'A',
          analysis: `${point} 选择题解析`
        });
      }
      
      // 生成填空题
      for (const point of fillPoints) {
        questions.push({
          id: `question_${Date.now()}_${Math.random()}`,
          grammarPoint: point,
          category: point,
          type: '填空题',
          text: `[填空题] ${point} 相关题目`,
          answer: '答案',
          analysis: `${point} 填空题解析`
        });
      }
    }
    
    return questions;
  },

  /**
   * 生成专题模式题目
   */
  async generateTopicQuestions() {
    const { selectedTopics, pointTypeDistribution } = this.data;
    const questions = [];
    
    if (selectedTopics.length === 0 || !pointTypeDistribution) {
      return questions;
    }
    
    // 根据pointTypeDistribution生成题目
    for (const [pointName, dist] of Object.entries(pointTypeDistribution)) {
      // 生成选择题
      for (let i = 0; i < (dist.choice || 0); i++) {
        questions.push({
          id: `question_${Date.now()}_${Math.random()}`,
          grammarPoint: pointName,
          category: pointName,
          type: '选择题',
          text: `[选择题] ${pointName} 相关题目 ${i + 1}`,
          answer: 'A',
          analysis: `${pointName} 选择题解析`
        });
      }
      
      // 生成填空题
      for (let i = 0; i < (dist.fill || 0); i++) {
        questions.push({
          id: `question_${Date.now()}_${Math.random()}`,
          grammarPoint: pointName,
          category: pointName,
          type: '填空题',
          text: `[填空题] ${pointName} 相关题目 ${i + 1}`,
          answer: '答案',
          analysis: `${pointName} 填空题解析`
        });
      }
    }
    
    return questions;
  },

  /**
   * 生成自选模式题目
   */
  async generateCustomQuestions() {
    const { selectedTags, pointTypeDistribution } = this.data;
    const questions = [];
    
    if (selectedTags.length === 0 || !pointTypeDistribution) {
      return questions;
    }
    
    // 根据pointTypeDistribution生成题目
    for (const tag of selectedTags) {
      const pointName = tag.name;
      const dist = pointTypeDistribution[pointName] || { choice: 0, fill: 0 };
      
      // 生成选择题
      for (let i = 0; i < (dist.choice || 0); i++) {
        questions.push({
          id: `question_${Date.now()}_${Math.random()}`,
          grammarPoint: pointName,
          category: pointName,
          type: '选择题',
          text: `[选择题] ${pointName} 相关题目 ${i + 1}`,
          answer: 'A',
          analysis: `${pointName} 选择题解析`
        });
      }
      
      // 生成填空题
      for (let i = 0; i < (dist.fill || 0); i++) {
        questions.push({
          id: `question_${Date.now()}_${Math.random()}`,
          grammarPoint: pointName,
          category: pointName,
          type: '填空题',
          text: `[填空题] ${pointName} 相关题目 ${i + 1}`,
          answer: '答案',
          analysis: `${pointName} 填空题解析`
        });
      }
    }
    
    return questions;
  },

  // TODO: 实现其他必要的方法
  // - 获取语法点列表（从初中题库）
  // - 生成题目逻辑
  // - 构建作业数据
  // - 跳转到预览页面
});

