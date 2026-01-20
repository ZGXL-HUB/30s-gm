/**
 * 教师端布置语法作业页面
 * 
 * ============================================
 * 【代码保护策略 - 重要提示】
 * ============================================
 * 
 * 本文件包含三种作业模式：
 * 1. 'gaokao' - 高考配比10题（已测试通过，请勿修改）
 * 2. 'topic' - 专题20题（待修改）
 * 3. 'custom' - 自选20题（待修改）
 * 
 * 【修改"专题20题"和"自选20题"时的注意事项】：
 * 
 * 1. 请勿修改以下标记为【高考配比专用】的函数和逻辑：
 *    - executeGaokaoSystemCombo() - 高考配比题目生成逻辑
 *    - generateGaokaoQuestions() - 高考配比题目构建逻辑
 *    - buildAssignmentData() 中的 homeworkType === 'gaokao' 分支
 *    - generateHomeworkData() 中的 homeworkType === 'gaokao' 分支
 * 
 * 2. 修改其他模式时，请使用严格的条件判断：
 *    - 使用 if (homeworkType === 'topic') { ... }
 *    - 使用 if (homeworkType === 'custom') { ... }
 *    - 避免使用 else if，确保高考配比逻辑独立
 * 
 * 3. 共享逻辑提取原则：
 *    - 如果需要在多个模式间共享逻辑，请提取为独立函数
 *    - 不要修改高考配比专用的数据结构和逻辑
 * 
 * 4. 测试建议：
 *    - 修改后务必测试高考配比10题功能是否正常
 *    - 确保高考配比仍然生成正好10题
 *    - 确保"谓语"和"非谓语"仍然必选
 * 
 * ============================================
 */
Page({
  data: {
    // 作业类型选择
    homeworkType: '', // gaokao, topic, custom
    showTypeSelector: false,
    homeworkTypes: [
      {
        id: 'gaokao',
        title: '高考配比10题',
        subtitle: '按高考比例配置题目',
        icon: '📚',
        color: '#f093fb'
      },
      {
        id: 'topic',
        title: '专题20题',
        subtitle: '选择语法大点专题练习',
        icon: '🎯',
        color: '#4facfe'
      },
      {
        id: 'custom',
        title: '自选20题',
        subtitle: '自由选择语法小点',
        icon: '✏️',
        color: '#43e97b'
      }
    ],


    // 高考配比数据（系统组合逻辑）
    gaokaoRatio: {
      total: 10,
      systemComboRules: {
        "介词": 1,
        "代词": 1,
        "连词": 1,
        "冠词": 1,
        "名词": 1,
        "动词": 1,
        "谓语": 1,
        "非谓语": 1,
        "形容词": 1,
        "副词": 1,
        "定语从句": 1,
        "状语和从句": 1
      },
      selectedGrammarPoints: [], // 动态生成的语法点
      distribution: [] // 动态生成的分发数据
    },

    // 语法大点列表（手风琴结构）- 基于数据库实际数据
    grammarTopics: [
      { 
        id: '介词', 
        name: '介词', 
        questionCount: 3, 
        selected: false, 
        expanded: false,
        points: [
          { id: '介词综合', name: '介词综合', questionCount: 1, selected: false, disabled: false },
          { id: '固定搭配', name: '固定搭配', questionCount: 1, selected: false, disabled: false },
          { id: '介词 + 名词/动名词', name: '介词 + 名词/动名词', questionCount: 1, selected: false, disabled: false }
        ]
      },
      { 
        id: '代词', 
        name: '代词', 
        questionCount: 6, 
        selected: false, 
        expanded: false,
        points: [
          { id: '代词综合', name: '代词综合', questionCount: 1, selected: false, disabled: false },
          { id: '人称代词', name: '人称代词', questionCount: 1, selected: false, disabled: false },
          { id: '物主代词', name: '物主代词', questionCount: 1, selected: false, disabled: false },
          { id: '反身代词', name: '反身代词', questionCount: 1, selected: false, disabled: false },
          { id: '关系代词', name: '关系代词', questionCount: 1, selected: false, disabled: false },
          { id: 'it相关', name: 'it相关', questionCount: 1, selected: false, disabled: false }
        ]
      },
      { 
        id: '连词', 
        name: '连词', 
        questionCount: 6, 
        selected: false, 
        expanded: false,
        points: [
          { id: '并列连词综合', name: '并列连词综合', questionCount: 1, selected: false, disabled: false },
          { id: '从属连词综合', name: '从属连词综合', questionCount: 1, selected: false, disabled: false },
          { id: '连词与名/动/形/副综合', name: '连词与名/动/形/副综合', questionCount: 1, selected: false, disabled: false },
          { id: '连词与名词', name: '连词与名词', questionCount: 1, selected: false, disabled: false },
          { id: '连词与动词', name: '连词与动词', questionCount: 1, selected: false, disabled: false },
          { id: '连词与形容词', name: '连词与形容词', questionCount: 1, selected: false, disabled: false }
        ]
      },
      { 
        id: '冠词', 
        name: '冠词', 
        questionCount: 4, 
        selected: false, 
        expanded: false,
        points: [
          { id: '冠词综合', name: '冠词综合', questionCount: 1, selected: false, disabled: false },
          { id: '泛指与特指', name: '泛指与特指', questionCount: 1, selected: false, disabled: false },
          { id: 'a和an', name: 'a和an', questionCount: 1, selected: false, disabled: false },
          { id: 'the的特殊用法', name: 'the的特殊用法', questionCount: 1, selected: false, disabled: false }
        ]
      },
      { 
        id: '名词', 
        name: '名词', 
        questionCount: 8, 
        selected: false, 
        expanded: false,
        points: [
          { id: '名词综合', name: '名词综合', questionCount: 1, selected: false, disabled: false },
          { id: '复合词和外来词', name: '复合词和外来词', questionCount: 1, selected: false, disabled: false },
          { id: '单复数同形', name: '单复数同形', questionCount: 1, selected: false, disabled: false },
          { id: '不规则复数', name: '不规则复数', questionCount: 1, selected: false, disabled: false },
          { id: '以o结尾', name: '以o结尾', questionCount: 1, selected: false, disabled: false },
          { id: '以y结尾', name: '以y结尾', questionCount: 1, selected: false, disabled: false },
          { id: 's/sh/ch/x结尾', name: 's/sh/ch/x结尾', questionCount: 1, selected: false, disabled: false },
          { id: '以f/fe结尾', name: '以f/fe结尾', questionCount: 1, selected: false, disabled: false }
        ]
      },
      { 
        id: '动词', 
        name: '动词', 
        questionCount: 4, 
        selected: false, 
        expanded: false,
        points: [
          { id: '被动写be吗', name: '被动写be吗', questionCount: 1, selected: false, disabled: false },
          { id: '并列句与动词', name: '并列句与动词', questionCount: 1, selected: false, disabled: false },
          { id: '主从句与动词', name: '主从句与动词', questionCount: 1, selected: false, disabled: false },
          { id: '插入语与动词', name: '插入语与动词', questionCount: 1, selected: false, disabled: false }
        ]
      },
      { 
        id: '谓语', 
        name: '谓语', 
        questionCount: 9, 
        selected: false, 
        expanded: false,
        points: [
          { id: '谓语', name: '谓语', questionCount: 1, selected: false, disabled: false },
          { id: '时态(一般过去时)', name: '时态(一般过去时)', questionCount: 1, selected: false, disabled: false },
          { id: '时态(一般将来时)', name: '时态(一般将来时)', questionCount: 1, selected: false, disabled: false },
          { id: '时态(过去将来时)', name: '时态(过去将来时)', questionCount: 1, selected: false, disabled: false },
          { id: '时态(现在进行时)', name: '时态(现在进行时)', questionCount: 1, selected: false, disabled: false },
          { id: '时态(过去进行时)', name: '时态(过去进行时)', questionCount: 1, selected: false, disabled: false },
          { id: '时态(现在完成时)', name: '时态(现在完成时)', questionCount: 1, selected: false, disabled: false },
          { id: '时态(过去完成时)', name: '时态(过去完成时)', questionCount: 1, selected: false, disabled: false },
          { id: '语态(被动+八大时态)', name: '语态(被动+八大时态)', questionCount: 1, selected: false, disabled: false }
        ]
      },
      { 
        id: '非谓语', 
        name: '非谓语', 
        questionCount: 3, 
        selected: false, 
        expanded: false,
        points: [
          { id: '现在分词综合', name: '现在分词综合', questionCount: 1, selected: false, disabled: false },
          { id: '过去分词综合', name: '过去分词综合', questionCount: 1, selected: false, disabled: false },
          { id: '不定式综合', name: '不定式综合', questionCount: 1, selected: false, disabled: false }
        ]
      },
      { 
        id: '形容词', 
        name: '形容词', 
        questionCount: 3, 
        selected: false, 
        expanded: false,
        points: [
          { id: '形容词综合', name: '形容词综合', questionCount: 1, selected: false, disabled: false },
          { id: '比较级', name: '比较级', questionCount: 1, selected: false, disabled: false },
          { id: '最高级', name: '最高级', questionCount: 1, selected: false, disabled: false }
        ]
      },
      { 
        id: '副词', 
        name: '副词', 
        questionCount: 4, 
        selected: false, 
        expanded: false,
        points: [
          { id: '副词综合', name: '副词综合', questionCount: 1, selected: false, disabled: false },
          { id: '副词修饰动词', name: '副词修饰动词', questionCount: 1, selected: false, disabled: false },
          { id: '副词修饰句子', name: '副词修饰句子', questionCount: 1, selected: false, disabled: false },
          { id: '副词修饰形容词/副词', name: '副词修饰形容词/副词', questionCount: 1, selected: false, disabled: false }
        ]
      },
      { 
        id: '定语从句', 
        name: '定语从句', 
        questionCount: 5, 
        selected: false, 
        expanded: false,
        points: [
          { id: '定语从句综合', name: '定语从句综合', questionCount: 1, selected: false, disabled: false },
          { id: 'that能填吗', name: 'that能填吗', questionCount: 1, selected: false, disabled: false },
          { id: 'who和which选哪个', name: 'who和which选哪个', questionCount: 1, selected: false, disabled: false },
          { id: 'whose', name: 'whose', questionCount: 1, selected: false, disabled: false },
          { id: 'which和when/where混淆', name: 'which和when/where混淆', questionCount: 1, selected: false, disabled: false }
        ]
      },
      { 
        id: '状语和从句', 
        name: '状语和从句', 
        questionCount: 5, 
        selected: false, 
        expanded: false,
        points: [
          { id: '状语从句综合', name: '状语从句综合', questionCount: 1, selected: false, disabled: false },
          { id: 'when', name: 'when', questionCount: 1, selected: false, disabled: false },
          { id: 'where', name: 'where', questionCount: 1, selected: false, disabled: false },
          { id: 'how', name: 'how', questionCount: 1, selected: false, disabled: false },
          { id: 'why', name: 'why', questionCount: 1, selected: false, disabled: false }
        ]
      }
    ],

    // 语法小点列表（自选）- 基于数据库实际数据
    grammarPoints: [
      // 介词类
      { id: '介词综合', name: '介词综合', parent: '介词', selected: false },
      { id: '固定搭配', name: '固定搭配', parent: '介词', selected: false },
      { id: '介词 + 名词/动名词', name: '介词 + 名词/动名词', parent: '介词', selected: false },
      
      // 代词类
      { id: '代词综合', name: '代词综合', parent: '代词', selected: false },
      { id: '人称代词', name: '人称代词', parent: '代词', selected: false },
      { id: '物主代词', name: '物主代词', parent: '代词', selected: false },
      { id: '反身代词', name: '反身代词', parent: '代词', selected: false },
      { id: '关系代词', name: '关系代词', parent: '代词', selected: false },
      { id: 'it相关', name: 'it相关', parent: '代词', selected: false },
      
      // 连词类
      { id: '并列连词综合', name: '并列连词综合', parent: '连词', selected: false },
      { id: '从属连词综合', name: '从属连词综合', parent: '连词', selected: false },
      { id: '连词与名/动/形/副综合', name: '连词与名/动/形/副综合', parent: '连词', selected: false },
      { id: '连词与名词', name: '连词与名词', parent: '连词', selected: false },
      { id: '连词与动词', name: '连词与动词', parent: '连词', selected: false },
      { id: '连词与形容词', name: '连词与形容词', parent: '连词', selected: false },
      
      // 冠词类
      { id: '冠词综合', name: '冠词综合', parent: '冠词', selected: false },
      { id: '泛指与特指', name: '泛指与特指', parent: '冠词', selected: false },
      { id: 'a和an', name: 'a和an', parent: '冠词', selected: false },
      { id: 'the的特殊用法', name: 'the的特殊用法', parent: '冠词', selected: false },
      
      // 名词类
      { id: '名词综合', name: '名词综合', parent: '名词', selected: false },
      { id: '复合词和外来词', name: '复合词和外来词', parent: '名词', selected: false },
      { id: '单复数同形', name: '单复数同形', parent: '名词', selected: false },
      { id: '不规则复数', name: '不规则复数', parent: '名词', selected: false },
      { id: '以o结尾', name: '以o结尾', parent: '名词', selected: false },
      { id: '以y结尾', name: '以y结尾', parent: '名词', selected: false },
      { id: 's/sh/ch/x结尾', name: 's/sh/ch/x结尾', parent: '名词', selected: false },
      { id: '以f/fe结尾', name: '以f/fe结尾', parent: '名词', selected: false },
      
      // 动词类
      { id: '被动写be吗', name: '被动写be吗', parent: '动词', selected: false },
      { id: '并列句与动词', name: '并列句与动词', parent: '动词', selected: false },
      { id: '主从句与动词', name: '主从句与动词', parent: '动词', selected: false },
      { id: '插入语与动词', name: '插入语与动词', parent: '动词', selected: false },
      
      // 谓语类
      { id: '谓语', name: '谓语', parent: '谓语', selected: false },
      { id: '时态(一般过去时)', name: '时态(一般过去时)', parent: '谓语', selected: false },
      { id: '时态(一般将来时)', name: '时态(一般将来时)', parent: '谓语', selected: false },
      { id: '时态(过去将来时)', name: '时态(过去将来时)', parent: '谓语', selected: false },
      { id: '时态(现在进行时)', name: '时态(现在进行时)', parent: '谓语', selected: false },
      { id: '时态(过去进行时)', name: '时态(过去进行时)', parent: '谓语', selected: false },
      { id: '时态(现在完成时)', name: '时态(现在完成时)', parent: '谓语', selected: false },
      { id: '时态(过去完成时)', name: '时态(过去完成时)', parent: '谓语', selected: false },
      { id: '语态(被动+八大时态)', name: '语态(被动+八大时态)', parent: '谓语', selected: false },
      
      // 非谓语类
      { id: '现在分词综合', name: '现在分词综合', parent: '非谓语', selected: false },
      { id: '过去分词综合', name: '过去分词综合', parent: '非谓语', selected: false },
      { id: '不定式综合', name: '不定式综合', parent: '非谓语', selected: false },
      
      // 形容词类
      { id: '形容词综合', name: '形容词综合', parent: '形容词', selected: false },
      { id: '比较级', name: '比较级', parent: '形容词', selected: false },
      { id: '最高级', name: '最高级', parent: '形容词', selected: false },
      
      // 副词类
      { id: '副词综合', name: '副词综合', parent: '副词', selected: false },
      { id: '副词修饰动词', name: '副词修饰动词', parent: '副词', selected: false },
      { id: '副词修饰句子', name: '副词修饰句子', parent: '副词', selected: false },
      { id: '副词修饰形容词/副词', name: '副词修饰形容词/副词', parent: '副词', selected: false },
      
      // 定语从句类
      { id: '定语从句综合', name: '定语从句综合', parent: '定语从句', selected: false },
      { id: 'that能填吗', name: 'that能填吗', parent: '定语从句', selected: false },
      { id: 'who和which选哪个', name: 'who和which选哪个', parent: '定语从句', selected: false },
      { id: 'whose', name: 'whose', parent: '定语从句', selected: false },
      { id: 'which和when/where混淆', name: 'which和when/where混淆', parent: '定语从句', selected: false },
      
      // 状语从句类
      { id: '状语从句综合', name: '状语从句综合', parent: '状语和从句', selected: false },
      { id: 'when', name: 'when', parent: '状语和从句', selected: false },
      { id: 'where', name: 'where', parent: '状语和从句', selected: false },
      { id: 'how', name: 'how', parent: '状语和从句', selected: false },
      { id: 'why', name: 'why', parent: '状语和从句', selected: false }
    ],

    // 界面状态
    showPreview: false,
    showPublishConfirm: false,
    showPublishSuccess: false,
    previewData: null,
    loading: false,
    
    // 乱序开关（从作业配置中移出）
    shuffleQuestions: true,
    
    // 已选内容标签
    selectedTags: [],
    // 专题模式：已选择的专题
    selectedTopics: [],
    // 专题模式：选择的题目总数（专题20题模式固定为20题）
    selectedTotalCount: 20,
    
    // 每个大类的选中题数（用于同步计数显示）
    categoryCounts: [],
    
    // 智能任务名称
    smartTitle: '',
    smartRemark: '',
    
    
    // 当前选中的作业类型信息
    currentHomeworkType: null,
    
    
    // 班级选择相关
    showClassSelection: false,
    availableClasses: [],
    selectedClasses: [],
    selectedClassIds: [],
    
    // 发布模式
    publishMode: 'generate' // 'generate' 或 'class'
  },

  onLoad() {
    console.log('教师端布置作业页面加载');
    this.loadGrammarData();
    // 初始化大类计数数组
    this.initializeCategoryCounts();
    // 验证数据结构
    this.validateGrammarData();
    // 强制重新设置数据
    this.forceDataRefresh();
    // 添加数据监听
    this.addDataWatcher();
  },

  // 初始化大类计数数组
  initializeCategoryCounts() {
    const categoryCounts = new Array(this.data.grammarTopics.length).fill(0);
    this.setData({ categoryCounts });
  },

  // 验证语法数据结构
  validateGrammarData() {
    console.log('验证语法数据结构...');
    const { grammarTopics } = this.data;
    
    if (!grammarTopics || grammarTopics.length === 0) {
      console.error('语法数据为空');
      return;
    }
    
    console.log(`总共有 ${grammarTopics.length} 个语法大点`);
    
    grammarTopics.forEach((topic, index) => {
      console.log(`大点 ${index + 1}: ${topic.name}`);
      console.log(`- ID: ${topic.id}`);
      console.log(`- 题目数量: ${topic.questionCount}`);
      console.log(`- 展开状态: ${topic.expanded}`);
      
      if (topic.points && topic.points.length > 0) {
        console.log(`- 小点数量: ${topic.points.length}`);
        topic.points.forEach((point, pointIndex) => {
          console.log(`  小点 ${pointIndex + 1}: ${point.name}`);
          console.log(`  - ID: ${point.id}`);
          console.log(`  - 题目数量: ${point.questionCount}`);
        });
      } else {
        console.warn(`- 警告: ${topic.name} 没有小点数据`);
      }
    });
  },




  // 添加数据监听
  addDataWatcher() {
    // 监听数据变化
    const originalSetData = this.setData;
    this.setData = (data) => {
      console.log('setData 被调用:', data);
      if (data.grammarTopics) {
        console.log('grammarTopics 数据更新:', data.grammarTopics);
        // 验证数据完整性
        data.grammarTopics.forEach((topic, topicIndex) => {
          if (topic.points && topic.points.length > 0) {
            topic.points.forEach((point, pointIndex) => {
              if (!point.name || point.name === '' || point.name === '未命名小点') {
                console.error(`数据监听发现问题: 大点 ${topic.name} 的小点 ${pointIndex + 1} 名称为空或未命名`);
              }
            });
          }
        });
      }
      return originalSetData.call(this, data);
    };
  },

  // 根据大点名称生成小点数据
  generatePointsForTopic(topicName) {
    const pointMappings = {
      '介词': [
        { id: '介词综合', name: '介词综合', questionCount: 1, selected: false, disabled: false },
        { id: '固定搭配', name: '固定搭配', questionCount: 1, selected: false, disabled: false },
        { id: '介词 + 名词/动名词', name: '介词 + 名词/动名词', questionCount: 1, selected: false, disabled: false }
      ],
      '代词': [
        { id: '代词综合', name: '代词综合', questionCount: 1, selected: false, disabled: false },
        { id: '人称代词', name: '人称代词', questionCount: 1, selected: false, disabled: false },
        { id: '物主代词', name: '物主代词', questionCount: 1, selected: false, disabled: false },
        { id: '反身代词', name: '反身代词', questionCount: 1, selected: false, disabled: false },
        { id: '关系代词', name: '关系代词', questionCount: 1, selected: false, disabled: false },
        { id: 'it相关', name: 'it相关', questionCount: 1, selected: false, disabled: false }
      ],
      '连词': [
        { id: '并列连词综合', name: '并列连词综合', questionCount: 1, selected: false, disabled: false },
        { id: '从属连词综合', name: '从属连词综合', questionCount: 1, selected: false, disabled: false },
        { id: '连词与名/动/形/副综合', name: '连词与名/动/形/副综合', questionCount: 1, selected: false, disabled: false },
        { id: '连词与名词', name: '连词与名词', questionCount: 1, selected: false, disabled: false },
        { id: '连词与动词', name: '连词与动词', questionCount: 1, selected: false, disabled: false },
        { id: '连词与形容词', name: '连词与形容词', questionCount: 1, selected: false, disabled: false }
      ]
    };
    
    return pointMappings[topicName] || [];
  },

  // 加载语法数据
  async loadGrammarData() {
    try {
      // 加载智能推荐服务
      const RecommendationService = require('../../../utils/recommendationService');
      
      this.recommendationService = new RecommendationService();
      
      // 测试云数据库连接和语法点映射
      await this.testCloudDatabaseMapping();
      
      // 初始化专题模式数据
      this.updateSelectedTags();
      
      console.log('语法数据和推荐服务加载完成');
    } catch (error) {
      console.error('加载语法数据失败:', error);
    }
  },

  // 测试云数据库映射关系
  async testCloudDatabaseMapping() {
    try {
      if (!wx.cloud || !wx.cloud.database) {
        console.log('云开发不可用，跳过数据库映射测试');
        return;
      }

      // 测试几个关键语法点
      const testPoints = ['介词综合', '固定搭配', '代词综合', '定语从句综合'];
      
      for (const point of testPoints) {
        try {
          const result = await wx.cloud.database()
            .collection('questions')
            .where({ category: point })
            .limit(1)
            .get();
          
          console.log(`语法点 "${point}" 在云数据库中的题目数量:`, result.data.length);
        } catch (error) {
          console.warn(`测试语法点 "${point}" 失败:`, error);
        }
      }
    } catch (error) {
      console.error('测试云数据库映射失败:', error);
    }
  },

  // 显示作业类型选择器
  showTypeSelector() {
    this.setData({ showTypeSelector: true });
  },

  // 关闭作业类型选择器
  closeTypeSelector() {
    this.setData({ showTypeSelector: false });
  },

  // 选择作业类型
  async selectHomeworkType(e) {
    const type = e.currentTarget.dataset.type;
    const selectedType = this.data.homeworkTypes.find(item => item.id === type);
    
    // 专题20题模式：固定为20题
    const initialData = {
      homeworkType: type,
      currentHomeworkType: selectedType,
      showTypeSelector: false,
      showSmartRecommendations: type === 'custom' // 自选模式时显示智能推荐
    };
    
    // 专题模式固定为20题
    if (type === 'topic') {
      initialData.selectedTotalCount = 20;
    }
    
    this.setData(initialData);
    console.log('选择作业类型:', type);
    
    // 【高考配比专用逻辑 - 请勿修改】
    // 如果是高考配比模式，直接执行系统组合选择
    // 注意：此逻辑已测试通过，修改其他模式时请勿改动
    if (type === 'gaokao') {
      await this.executeGaokaoSystemCombo();
      return; // 高考配比模式执行后直接返回，不执行后续逻辑
    }
    
    this.generateSmartTitle();
  },



  // 从推荐结果更新已选语法点

  /**
   * 【高考配比专用函数 - 请勿修改】
   * 执行高考配比系统组合逻辑
   * 功能：生成正好10题，其中"谓语"和"非谓语"必选，其余8题从其他分类随机选择
   * 注意：此函数已测试通过，修改"专题20题"和"自选20题"时请勿改动此函数
   */
  async executeGaokaoSystemCombo() {
    try {
      wx.showLoading({ title: '正在生成高考配比...' });
      
      // 所有可用的分类（共12个）
      const allCategories = [
        "介词",
        "代词",
        "连词",
        "冠词",
        "名词",
        "动词",
        "谓语",
        "非谓语",
        "形容词",
        "副词",
        "定语从句",
        "状语和从句"
      ];

      const selectedPoints = {};
      const usedGrammarPoints = new Set();

      // 第一步：必选"谓语"和"非谓语"，各选1题
      const requiredCategories = ["谓语", "非谓语"];
      for (const category of requiredCategories) {
        const grammarPoints = this.getGrammarPointsByCategory(category);
        console.log(`必选分类 ${category} 下的语法点:`, grammarPoints);
        
        if (grammarPoints.length > 0) {
          const randomGrammarPoint = grammarPoints[Math.floor(Math.random() * grammarPoints.length)];
          selectedPoints[randomGrammarPoint] = 1;
          usedGrammarPoints.add(randomGrammarPoint);
          console.log(`✅ 必选 ${randomGrammarPoint}`);
        } else {
          console.log(`❌ ${category} 分类下没有语法点`);
        }
      }

      // 第二步：从剩余的10个分类中随机选8个分类
      const remainingCategories = allCategories.filter(cat => !requiredCategories.includes(cat));
      console.log('剩余分类:', remainingCategories);
      
      // 随机打乱剩余分类，取前8个
      const shuffledRemaining = [...remainingCategories].sort(() => Math.random() - 0.5);
      const selectedCategories = shuffledRemaining.slice(0, 8);
      console.log('随机选中的8个分类:', selectedCategories);

      // 从选中的8个分类中各选1个语法点
      for (const category of selectedCategories) {
        const grammarPoints = this.getGrammarPointsByCategory(category);
        console.log(`分类 ${category} 下的语法点:`, grammarPoints);
        
        if (grammarPoints.length > 0) {
          const randomGrammarPoint = grammarPoints[Math.floor(Math.random() * grammarPoints.length)];
          
          // 如果该语法点未被使用
          if (!usedGrammarPoints.has(randomGrammarPoint)) {
            selectedPoints[randomGrammarPoint] = 1;
            usedGrammarPoints.add(randomGrammarPoint);
            console.log(`✅ 成功选择 ${randomGrammarPoint}`);
          } else {
            // 如果已被使用，尝试选择其他语法点
            const unusedPoints = grammarPoints.filter(p => !usedGrammarPoints.has(p));
            if (unusedPoints.length > 0) {
              const alternativePoint = unusedPoints[Math.floor(Math.random() * unusedPoints.length)];
              selectedPoints[alternativePoint] = 1;
              usedGrammarPoints.add(alternativePoint);
              console.log(`✅ 选择替代语法点 ${alternativePoint}`);
            }
          }
        } else {
          console.log(`❌ ${category} 分类下没有语法点`);
        }
      }

      // 确保正好是10题（2题必选 + 8题随机选）
      const finalCount = Object.keys(selectedPoints).length;
      console.log(`最终选中 ${finalCount} 个语法点（目标：10个）`);
      
      if (finalCount !== 10) {
        console.warn(`⚠️ 语法点数量不符合预期：${finalCount}，应该是10个`);
      }

      // 更新界面显示
      const topics = this.data.grammarTopics.map(topic => {
        const updatedPoints = topic.points.map(point => {
          return {
            ...point,
            selected: selectedPoints.hasOwnProperty(point.name)
          };
        });
        
        // 如果有点被选中，大点也标记为选中
        const hasSelectedPoints = updatedPoints.some(p => p.selected);
        
        return {
          ...topic,
          selected: hasSelectedPoints,
          points: updatedPoints
        };
      });
      
      // 更新高考配比数据
      const selectedGrammarPoints = Object.keys(selectedPoints);
      const distribution = selectedGrammarPoints.map(point => ({
        category: point,
        ratio: Math.round(100 / selectedGrammarPoints.length),
        count: 1,
        selected: true
      }));
      
      this.setData({ 
        grammarTopics: topics,
        'gaokaoRatio.selectedGrammarPoints': selectedGrammarPoints,
        'gaokaoRatio.distribution': distribution
      });
      
      this.updateSelectedTags();
      this.updateCategoryCounts();
      this.updateSmartTitle();
      this.updateSelectedCount(); // 更新总题数（考虑变式题数量）
      
      wx.hideLoading();
      wx.showToast({
        title: '高考配比生成成功',
        icon: 'success'
      });
      
      console.log('高考配比系统组合已生成:', selectedPoints);
      
    } catch (error) {
      console.error('生成高考配比失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成失败',
        icon: 'none'
      });
    }
  },

  // 获取指定分类下的所有语法点
  getGrammarPointsByCategory(category) {
    const topic = this.data.grammarTopics.find(t => t.name === category);
    if (topic && topic.points) {
      return topic.points.map(point => point.name);
    }
    return [];
  },

  // 获取所有可用的语法点
  getAllAvailableGrammarPoints() {
    const allPoints = [];
    this.data.grammarTopics.forEach(topic => {
      if (topic.points) {
        topic.points.forEach(point => {
          allPoints.push(point.name);
        });
      }
    });
    return allPoints;
  },

  // 重新生成高考配比组合
  async regenerateGaokaoCombo() {
    wx.showModal({
      title: '重选一批语法点',
      content: '确定要重新生成语法点组合吗？当前选择将被覆盖。',
      success: (res) => {
        if (res.confirm) {
          // 清除当前选择，重新生成
          this.setData({
            'gaokaoRatio.selectedGrammarPoints': [],
            'gaokaoRatio.distribution': []
          });
          
          // 重新生成并确保数据同步
          this.executeGaokaoSystemCombo().then(() => {
            // 强制更新界面显示
            this.updateSelectedTags();
            this.updateCategoryCounts();
            this.updateSmartTitle();
            this.updateSelectedCount(); // 更新总题数（考虑变式题数量）
            
            // 清除可能存在的旧数据
            this.setData({
              selectedTags: [],
              selectedTopics: [],
              selectedTotalCount: 10
            });
            
            console.log('重新生成完成，数据已同步');
          });
        }
      }
    });
  },

  // 手动添加语法点到高考配比
  addGaokaoPoint(grammarPointName) {
    const { gaokaoRatio } = this.data;
    
    // 检查是否已经存在
    if (gaokaoRatio.selectedGrammarPoints.includes(grammarPointName)) {
      wx.showToast({
        title: '该语法点已存在',
        icon: 'none'
      });
      return;
    }
    
    // 添加到selectedGrammarPoints
    const newSelectedPoints = [...gaokaoRatio.selectedGrammarPoints, grammarPointName];
    
    // 更新高考配比数据
    this.setData({
      'gaokaoRatio.selectedGrammarPoints': newSelectedPoints
    });
    
    // 同步更新grammarTopics中的选中状态
    const topics = this.data.grammarTopics.map(topic => {
      const updatedPoints = topic.points.map(point => {
        if (point.name === grammarPointName) {
          return { ...point, selected: true };
        }
        return point;
      });
      return { ...topic, points: updatedPoints };
    });
    
    this.setData({ grammarTopics: topics });
    
    this.updateSelectedTags();
    this.updateCategoryCounts();
    this.updateSmartTitle();
    this.updateSelectedCount(); // 更新总题数（考虑变式题数量）
    
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  // 删除高考配比中的语法点
  removeGaokaoPoint(e) {
    const pointToRemove = e.currentTarget.dataset.point;
    const { gaokaoRatio } = this.data;
    
    // 从selectedGrammarPoints中移除
    const newSelectedPoints = gaokaoRatio.selectedGrammarPoints.filter(point => point !== pointToRemove);
    
    // 更新高考配比数据
    this.setData({
      'gaokaoRatio.selectedGrammarPoints': newSelectedPoints
    });
    
    // 同步更新grammarTopics中的选中状态
    const topics = this.data.grammarTopics.map(topic => {
      const updatedPoints = topic.points.map(point => {
        if (point.name === pointToRemove) {
          return { ...point, selected: false };
        }
        return point;
      });
      
      // 检查是否还有选中的小点
      const hasSelectedPoints = updatedPoints.some(p => p.selected);
      
      return {
        ...topic,
        selected: hasSelectedPoints,
        points: updatedPoints
      };
    });
    
    this.setData({ grammarTopics: topics });
    
    // 更新大类计数和智能标题
    this.updateCategoryCounts();
    this.updateSmartTitle();
    this.updateSelectedCount(); // 更新总题数（考虑变式题数量）
    
    wx.showToast({
      title: '已删除语法点',
      icon: 'success'
    });
  },

  // 生成系统组合选择（保留原方法用于兼容性）
  async generateSystemComboSelection() {
    return await this.executeGaokaoSystemCombo();
  },

  // 选择高考配比项目（现在用于手动调整）
  toggleGaokaoRatio(e) {
    const index = e.currentTarget.dataset.index;
    const distribution = [...this.data.gaokaoRatio.distribution];
    distribution[index].selected = !distribution[index].selected;
    
    this.setData({
      'gaokaoRatio.distribution': distribution
    });
    
    // 同步更新语法点选择状态
    this.syncGaokaoRatioToGrammarTopics();
  },

  // 同步高考配比选择到语法点
  syncGaokaoRatioToGrammarTopics() {
    const selectedPoints = this.data.gaokaoRatio.distribution
      .filter(item => item.selected)
      .map(item => item.category);
    
    const topics = this.data.grammarTopics.map(topic => {
      const updatedPoints = topic.points.map(point => {
        return {
          ...point,
          selected: selectedPoints.includes(point.name)
        };
      });
      
      const hasSelectedPoints = updatedPoints.some(p => p.selected);
      
      return {
        ...topic,
        selected: hasSelectedPoints,
        points: updatedPoints
      };
    });
    
    this.setData({ grammarTopics: topics });
    this.updateSelectedTags();
    this.updateCategoryCounts();
    this.updateSmartTitle();
  },

  // 切换语法大点展开/收起
  toggleTopic(e) {
    const topicId = e.currentTarget.dataset.topicId;
    const topics = this.data.grammarTopics.map(topic => {
      if (topic.id === topicId) {
        const newExpanded = !topic.expanded;
        console.log(`切换大点 ${topic.name} 展开状态: ${newExpanded}`);
        console.log(`该大点的小点数量: ${topic.points ? topic.points.length : 0}`);
        if (topic.points && topic.points.length > 0) {
          console.log('小点列表:', topic.points.map(p => p.name));
          // 验证小点数据完整性
          topic.points.forEach((point, index) => {
            console.log(`小点 ${index + 1}: name="${point.name}", questionCount=${point.questionCount}`);
            if (!point.name || point.name === '') {
              console.error(`小点 ${index + 1} 名称为空！`);
            }
          });
        }
        return { ...topic, expanded: newExpanded };
      }
      return topic;
    });
    
    this.setData({ grammarTopics: topics }, () => {
      console.log('数据更新完成，当前展开状态:');
      topics.forEach(topic => {
        console.log(`  ${topic.name}: expanded=${topic.expanded}`);
      });
    });
    
    // 强制重新渲染数据
    setTimeout(() => {
      this.forceDataSync();
      // 如果是展开状态，强制重新渲染小点数据
      if (topics.find(t => t.id === topicId)?.expanded) {
        this.forceRenderPoints();
      }
    }, 50);
  },

  // 选择语法大点（专题模式）- 改为单选，选中后直接进入预览
  selectGrammarTopic(e) {
    const topicId = e.currentTarget.dataset.id;
    console.log('【专题模式】选择专题, topicId:', topicId);
    
    // 找到选中的专题
    const selectedTopic = this.data.grammarTopics.find(t => t.id === topicId);
    if (!selectedTopic) {
      console.warn('未找到专题:', topicId);
      return;
    }
    
    // 单选逻辑：取消其他所有选择，只保留当前选择的专题
    const topics = this.data.grammarTopics.map(topic => ({
      ...topic,
      selected: topic.id === topicId // 只有当前选择的专题为true，其他都为false
    }));
    
    // 更新selectedTopics数组（只包含一个专题）
    const selectedTopics = [selectedTopic.name];
    
    console.log('【专题模式】单选专题:', selectedTopic.name);
    
    // 先同步更新本地数据（确保立即可用）
    this.data.grammarTopics = topics;
    this.data.selectedTopics = selectedTopics;
    this.data.selectedTags = selectedTopics;
    this.data.variantCount = 0;
    
    // 然后调用setData更新界面
    this.setData({ 
      grammarTopics: topics,
      selectedTopics: selectedTopics,
      selectedTags: selectedTopics,  // 专题模式下selectedTags就是专题名称数组
      variantCount: 0  // 专题模式固定为0道变式题
    });
    
    console.log('【专题模式】专题选择后 - selectedTopics:', selectedTopics);
    
    // 直接跳转到预览界面（goToPreviewDirectly会使用this.data中的数据，已经同步更新）
    setTimeout(() => {
      console.log('【专题模式】准备跳转，当前selectedTopics:', this.data.selectedTopics);
      this.goToPreviewDirectly();
    }, 150);
  },

  // 选择语法小点
  selectPoint(e) {
    const pointId = e.currentTarget.dataset.pointId;
    const { homeworkType } = this.data;
    
    // 专题模式：小点不可选择
    if (homeworkType === 'topic') {
      wx.showToast({
        title: '专题模式下请选择大点',
        icon: 'none'
      });
      return;
    }
    
    const topics = this.data.grammarTopics.map(topic => {
      const updatedPoints = topic.points.map(point => {
        if (point.id === pointId) {
          const newSelected = !point.selected;
          return { 
            ...point, 
            selected: newSelected,
            selectedCount: newSelected ? 1 : 0
          };
        }
        return point;
      });
      return { ...topic, points: updatedPoints };
    });
    
    this.setData({ grammarTopics: topics });
    this.updateSelectedCount();
    this.updateSelectedTags();
    this.updateCategoryCounts();
    this.updateSmartTitle();
    
    // 自选模式下，重新分配题目数量
    if (homeworkType === 'custom') {
      this.redistributeQuestions();
    }
    
    // 确保总题数正确更新
    this.updateSelectedCount();
  },

  // 减少数值
  decreaseSliderValue(e) {
    const index = e.currentTarget.dataset.index;
    const selectedTags = [...this.data.selectedTags];
    
    if (selectedTags[index] && selectedTags[index].count > 1) {
      selectedTags[index].count = selectedTags[index].count - 1;
      this.setData({ selectedTags });
      
      // 更新对应的语法点数据
      this.updateGrammarTopicsFromTags(selectedTags);
      this.updateSelectedCount();
      this.updateCategoryCounts();
    }
  },

  // 增加数值
  increaseSliderValue(e) {
    const index = e.currentTarget.dataset.index;
    const selectedTags = [...this.data.selectedTags];
    const maxCount = this.getSliderMax(index);
    const totalQuestions = this.data.totalQuestions || 0;
    
    // 如果总题数已经达到20，不允许再增加
    if (totalQuestions >= 20) {
      wx.showToast({
        title: '总题数不能超过20题',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    if (selectedTags[index] && selectedTags[index].count < maxCount) {
      selectedTags[index].count = selectedTags[index].count + 1;
      this.setData({ selectedTags });
      
      // 更新对应的语法点数据
      this.updateGrammarTopicsFromTags(selectedTags);
      this.updateSelectedCount();
      this.updateCategoryCounts();
    }
  },

  // 设置具体数值
  setSliderValue(e) {
    const index = e.currentTarget.dataset.index;
    const value = parseInt(e.currentTarget.dataset.value);
    const selectedTags = [...this.data.selectedTags];
    const totalQuestions = this.data.totalQuestions || 0;
    const currentCount = selectedTags[index] ? (selectedTags[index].count || 1) : 0;
    const otherTotal = totalQuestions - currentCount;
    
    // 如果设置新值后总题数会超过20，则不允许
    if (otherTotal + value > 20) {
      wx.showToast({
        title: '总题数不能超过20题',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    if (selectedTags[index]) {
      selectedTags[index].count = value;
      this.setData({ selectedTags });
      
      // 更新对应的语法点数据
      this.updateGrammarTopicsFromTags(selectedTags);
      this.updateSelectedCount();
      this.updateCategoryCounts();
    }
  },

  // ===== 专题模式控制函数 =====
  
  // 选择题目总数
  selectTotalCount(e) {
    const count = parseInt(e.currentTarget.dataset.count);
    this.setData({ selectedTotalCount: count }, () => {
      this.updateTopicModeCounts();
    });
  },
  
  // 移除选中的专题
  removeSelectedTopic(e) {
    const topic = e.currentTarget.dataset.topic;
    const selectedTopics = this.data.selectedTopics.filter(t => t !== topic);
    this.setData({ selectedTopics }, () => {
      this.updateTopicModeCounts();
      this.updateGrammarTopicsSelection();
    });
  },
  
  // 更新专题模式的计数（专题20题：20题平均分配到选中专题的所有小点上）
  updateTopicModeCounts() {
    const { selectedTopics, selectedTotalCount } = this.data;
    
    if (selectedTopics.length === 0) {
      this.setData({ totalQuestions: 0, distributedQuestions: [] });
      return;
    }
    
    // 专题模式只允许选择一个专题
    const topicName = selectedTopics[0];
    const topic = this.data.grammarTopics.find(t => t.name === topicName);
    
    if (!topic || !topic.points || topic.points.length === 0) {
      console.warn('【专题模式】未找到专题或专题下没有小点:', topicName);
      this.setData({ totalQuestions: 0, distributedQuestions: [] });
      return;
    }
    
    // 获取该专题下的所有小点
    const allSelectedPoints = [...topic.points];
    console.log(`【专题模式】专题 "${topicName}" 下有 ${allSelectedPoints.length} 个小点:`, allSelectedPoints.map(p => p.name));
    
    // 20题平均分配到所有小点
    const totalCount = selectedTotalCount || 20;
    const distributedQuestions = this.distributeQuestionsToPoints(allSelectedPoints, totalCount);
    const totalQuestions = distributedQuestions.reduce((sum, point) => sum + point.count, 0);
    
    console.log(`【专题模式】分配结果: 共${totalQuestions}题，分配到${distributedQuestions.filter(p => p.count > 0).length}个小点`);
    distributedQuestions.filter(p => p.count > 0).forEach(p => {
      console.log(`  - ${p.name}: ${p.count}题`);
    });
    
    this.setData({ 
      totalQuestions,
      distributedQuestions // 存储分配结果
    });
  },
  
  // 更新语法专题的选中状态
  updateGrammarTopicsSelection() {
    const { selectedTopics, grammarTopics } = this.data;
    const updatedTopics = grammarTopics.map(topic => ({
      ...topic,
      selected: selectedTopics.includes(topic.name)
    }));
    this.setData({ grammarTopics: updatedTopics });
  },
  
  // 智能分配题目到小点
  // 优化：确保每个子知识点至少分配1题（如果题目数>=子知识点数），然后平均分配剩余题目
  distributeQuestionsToPoints(points, totalCount) {
    if (points.length === 0) return [];
    
    // 如果题目数 <= 小点数，每个小点1题（前totalCount个小点各1题）
    if (totalCount <= points.length) {
      return points.map((point, index) => ({
        ...point,
        count: index < totalCount ? 1 : 0
      }));
    }
    
    // 如果题目数 > 小点数，确保每个子知识点至少1题，然后平均分配剩余题目
    // 步骤1：每个子知识点先分配1题
    const guaranteedCount = 1;
    const remainingCount = totalCount - (points.length * guaranteedCount);
    
    // 步骤2：将剩余题目平均分配到各个子知识点
    const baseExtraCount = Math.floor(remainingCount / points.length);
    const extraRemainder = remainingCount % points.length;
    
    // 步骤3：随机选择子知识点分配余数
    const shuffledIndices = points.map((_, index) => index).sort(() => Math.random() - 0.5);
    
    return points.map((point, index) => {
      // 基础分配：每个子知识点至少1题
      // 额外分配：平均分配剩余题目
      // 余数分配：随机分配给部分子知识点
      const extraCount = baseExtraCount + (shuffledIndices.indexOf(index) < extraRemainder ? 1 : 0);
      return {
        ...point,
        count: guaranteedCount + extraCount
      };
    });
  },
  
  // ===== 自选模式增强函数 =====
  
  // 防止事件冒泡
  preventEventBubble(e) {
    console.log('阻止事件冒泡');
  },
  
  // 全选某个专题的所有小点
  selectAllPoints(e) {
    console.log('🎯 全选按钮被点击');
    console.log('🎯 事件对象:', e);
    console.log('🎯 事件目标:', e.currentTarget);
    const topicId = e.currentTarget.dataset.topicId;
    console.log('📋 目标专题ID:', topicId);
    console.log('📋 当前homeworkType:', this.data.homeworkType);
    const { grammarTopics, homeworkType, selectedTags } = this.data;
    
    // 防止重复点击
    if (this.selectAllProcessing) {
      console.log('🔄 全选操作正在进行中，忽略重复点击');
      return;
    }
    this.selectAllProcessing = true;
    
    // 更新grammarTopics，标记当前专题的所有小点为选中
    const updatedTopics = grammarTopics.map(topic => {
      if (topic.id === topicId) {
        const updatedPoints = topic.points.map(point => ({
          ...point,
          selected: true,
          selectedCount: 1 // 临时值，后续会重新分配
        }));
        
        return {
          ...topic,
          expanded: true, // 全选后自动展开专题子菜单
          points: updatedPoints
        };
      }
      return topic;
    });
    
    // 收集所有选中的小点（包括新选中的和之前已选中的其他专题的知识点）
    let allSelectedPoints = [];
    if (homeworkType !== 'topic') {
      updatedTopics.forEach(topic => {
        topic.points.forEach(point => {
          if (point.selected) {
            // 所有选中的知识点都加入列表，数量会在后续重新分配
            allSelectedPoints.push({
              name: point.name,
              count: 1 // 临时值，后续会重新分配
            });
          }
        });
      });
      console.log('🎯 全选后收集的所有选中小点:', allSelectedPoints.map(p => p.name));
    }
    
    // 自选模式：先计算重新分配后的题目数量
    let finalTags = allSelectedPoints;
    if (homeworkType === 'custom' && allSelectedPoints.length > 0) {
      console.log('🎯 自选模式：开始重新分配题目，当前标签数量:', allSelectedPoints.length);
      const maxTotal = 20;
      const perTag = Math.floor(maxTotal / allSelectedPoints.length);
      const remainder = maxTotal % allSelectedPoints.length;
      
      finalTags = allSelectedPoints.map((tag, index) => ({
        ...tag,
        count: perTag + (index < remainder ? 1 : 0)
      }));
      
      console.log('🎯 重新分配后的标签:', finalTags);
      console.log('🎯 总题数:', finalTags.reduce((sum, tag) => sum + tag.count, 0));
    }
    
    // 更新数据，包括重新分配后的题目数量
    this.setData({ 
      grammarTopics: updatedTopics,
      selectedTags: finalTags
    }, () => {
      // 确保数据更新完成后再执行后续操作
      setTimeout(() => {
        if (homeworkType === 'custom' && finalTags.length > 0) {
          // 自选模式：同步更新grammarTopics中的selectedCount
          this.updateGrammarTopicsFromTags(finalTags);
          this.updateSelectedCount();
          this.updateCategoryCounts();
        } else {
          // 非自选模式，直接更新标签和计数
          this.updateSelectedTags();
          this.updateSelectedCount();
          this.updateCategoryCounts();
        }
        
        // 重置处理标志
        this.selectAllProcessing = false;
        console.log('🎯 全选操作完成，最终selectedTags:', this.data.selectedTags);
        console.log('🎯 最终总题数:', this.data.totalQuestions);
      }, 50);
    });
    
    wx.showToast({
      title: '已全选该专题',
      icon: 'success',
      duration: 1000
    });
  },

  // 获取滑动条最大值
  getSliderMax(index) {
    const selectedTags = this.data.selectedTags;
    if (!selectedTags[index]) return 10;
    
    const currentCount = selectedTags[index].count || 1;
    const otherTotal = selectedTags.reduce((sum, tag, i) => {
      return i !== index ? (sum + (tag.count || 1)) : sum;
    }, 0);
    const maxTotal = 20;
    const available = maxTotal - otherTotal + currentCount;
    
    // 如果总题数已经达到20，则返回当前值（不允许再增加）
    const totalQuestions = this.data.totalQuestions || 0;
    if (totalQuestions >= 20) {
      return currentCount;
    }
    
    // 确保最大值至少为当前值，并且不超过10
    return Math.max(currentCount, Math.min(10, available));
  },

  // 阻止事件冒泡
  stopPropagation(e) {
    // 空函数，仅用于阻止事件冒泡
  },

  // 获取滑动条刻度
  getSliderTicks(index) {
    const max = this.getSliderMax(index);
    const ticks = [];
    for (let i = 1; i <= max; i++) {
      ticks.push(i);
    }
    return ticks;
  },

  // 重新分配题目数量
  redistributeQuestions() {
    const selectedTags = this.data.selectedTags;
    if (selectedTags.length === 0) return;
    
    const maxTotal = 20;
    const perTag = Math.floor(maxTotal / selectedTags.length);
    const remainder = maxTotal % selectedTags.length;
    
    const newTags = selectedTags.map((tag, index) => ({
      ...tag,
      count: perTag + (index < remainder ? 1 : 0)
    }));
    
    this.setData({ selectedTags: newTags });
    this.updateGrammarTopicsFromTags(newTags);
    this.updateSelectedCount();
    this.updateCategoryCounts();
  },

  // 从标签数据更新语法点数据
  updateGrammarTopicsFromTags(selectedTags) {
    const topics = this.data.grammarTopics.map(topic => {
      const updatedPoints = topic.points.map(point => {
        const tag = selectedTags.find(tag => tag.name === point.name);
        if (tag) {
          return {
            ...point,
            selected: true,
            selectedCount: tag.count
          };
        } else {
          return {
            ...point,
            selected: false,
            selectedCount: 0
          };
        }
      });
      return { ...topic, points: updatedPoints };
    });
    
    this.setData({ grammarTopics: topics });
  },

  // 选择语法小点（自选）
  selectGrammarPoint(e) {
    const pointId = e.currentTarget.dataset.id;
    const points = this.data.grammarPoints.map(point => {
      if (point.id === pointId) {
        return { ...point, selected: !point.selected };
      }
      return point;
    });
    
    this.setData({ grammarPoints: points });
    this.updateSelectedCount();
    this.updateSelectedTags();
    this.updateCategoryCounts();
    this.updateSmartTitle();
  },

  // 生成智能任务名称
  generateSmartTitle() {
    const { homeworkType } = this.data;
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
    
    let title = '';
    let remark = '';
    
    switch (homeworkType) {
      case 'gaokao':
        title = `高考配比十题${today}`;
        remark = this.getSelectedGrammarPoints();
        break;
      case 'topic':
        title = `专题十题${today}`;
        remark = this.getSelectedGrammarTopics();
        break;
      case 'custom':
        title = `自选十题${today}`;
        remark = this.getSelectedGrammarPoints();
        break;
    }
    
    this.setData({
      smartTitle: title,
      smartRemark: remark
    });
    
    // 当选择发生变化时，自动更新标题
    this.updateSmartTitle();
  },

  // 更新智能标题（根据当前选择动态更新）
  updateSmartTitle() {
    const { homeworkType, grammarTopics } = this.data;
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
    
    let title = '';
    let remark = '';
    
    switch (homeworkType) {
      case 'gaokao':
        title = `高考配比十题${today}`;
        // 高考配比模式：显示选中的小点
        const gaokaoPoints = [];
        grammarTopics.forEach(topic => {
          topic.points.forEach(point => {
            if (point.selected) {
              gaokaoPoints.push(point.name);
            }
          });
        });
        remark = gaokaoPoints.join('、');
        break;
      case 'topic':
        title = `专题十题${today}`;
        // 专题模式：显示选中的大点
        const topicSelected = grammarTopics.filter(t => t.selected);
        remark = topicSelected.map(t => t.name).join('、');
        break;
      case 'custom':
        title = `自选十题${today}`;
        // 自选模式：显示选中的小点
        const customPoints = [];
        grammarTopics.forEach(topic => {
          topic.points.forEach(point => {
            if (point.selected) {
              customPoints.push(point.name);
            }
          });
        });
        remark = customPoints.join('、');
        break;
    }
    
    this.setData({
      smartTitle: title,
      smartRemark: remark
    });
  },

  // 获取已选语法点（小点）
  getSelectedGrammarPoints() {
    const selectedPoints = this.data.grammarPoints.filter(p => p.selected);
    return selectedPoints.map(p => p.name).join('、');
  },

  // 获取已选语法大点
  getSelectedGrammarTopics() {
    const selectedTopics = this.data.grammarTopics.filter(t => t.selected);
    return selectedTopics.map(t => t.name).join('、');
  },

  // 更新已选内容标签
  updateSelectedTags() {
    const { homeworkType } = this.data;
    // 确保获取最新的grammarTopics数据
    const grammarTopics = this.data.grammarTopics;
    let tags = [];
    
    console.log('🔄 updateSelectedTags 被调用');
    console.log('🔄 当前homeworkType:', homeworkType);
    console.log('🔄 grammarTopics:', grammarTopics);
    
    if (homeworkType === 'topic') {
      // 专题模式：更新selectedTopics和selectedTags
      const selectedTopics = grammarTopics.filter(t => t.selected);
      const topicNames = selectedTopics.map(t => t.name);
      
      console.log('专题模式 - 选中的专题:', topicNames);
      console.log('专题模式 - grammarTopics选中状态:', grammarTopics.map(t => ({name: t.name, selected: t.selected})));
      
      // 同时更新selectedTopics和selectedTags
      this.setData({ 
        selectedTopics: topicNames,
        selectedTags: topicNames 
      }, () => {
        this.updateTopicModeCounts();
        console.log('专题模式 - 更新后selectedTopics:', this.data.selectedTopics);
      });
      return;
    } else {
      // 高考配比和自选模式：显示选中的小点，包含题目数量
      const selectedPoints = [];
      console.log('🔄 自选模式 - 开始收集选中的小点');
      grammarTopics.forEach(topic => {
        console.log(`🔄 检查专题: ${topic.name}`);
        topic.points.forEach(point => {
          console.log(`🔄 小点: ${point.name}, selected: ${point.selected}, selectedCount: ${point.selectedCount}`);
          if (point.selected && (point.selectedCount || 0) > 0) {
            selectedPoints.push({
              name: point.name,
              count: point.selectedCount || 1
            });
          }
        });
      });
      console.log('🔄 收集到的选中小点:', selectedPoints);
      tags = selectedPoints;
    }
    
    this.setData({ selectedTags: tags }, () => {
      console.log('🔄 selectedTags 更新完成:', this.data.selectedTags);
    });
  },

  // 编辑已选标签
  editSelectedTag(e) {
    const { homeworkType } = this.data;
    
    // 专题模式下不允许编辑标签
    if (homeworkType === 'topic') {
      wx.showToast({
        title: '专题模式下不能编辑标签',
        icon: 'none'
      });
      return;
    }
    
    const tagIndex = e.currentTarget.dataset.index;
    const tag = this.data.selectedTags[tagIndex];
    
    wx.showModal({
      title: '编辑标签',
      content: `当前标签：${tag}`,
      editable: true,
      placeholderText: '请输入新标签',
      success: (res) => {
        if (res.confirm && res.content) {
          const newTags = [...this.data.selectedTags];
          newTags[tagIndex] = res.content;
          this.setData({ selectedTags: newTags });
        }
      }
    });
  },

  // 删除已选标签
  removeSelectedTag(e) {
    const tagIndex = e.currentTarget.dataset.index;
    const tagToRemove = this.data.selectedTags[tagIndex];
    const { homeworkType } = this.data;
    
    if (homeworkType === 'topic') {
      // 专题模式：移除选中的大点
      const newTopics = this.data.selectedTopics.filter(topic => topic !== tagToRemove);
      this.setData({ selectedTopics: newTopics }, () => {
        this.updateGrammarTopicsSelection();
        this.updateTopicModeCounts();
        this.updateSelectedCount();
      });
      return;
    }
    
    // 自选模式：移除选中的小点
    const newTags = this.data.selectedTags.filter((_, index) => index !== tagIndex);
    
    // 同步更新grammarTopics中的选中状态
    const topics = this.data.grammarTopics.map(topic => {
      const updatedPoints = topic.points.map(point => {
        if (point.name === tagToRemove.name || point.name === tagToRemove) {
          return { ...point, selected: false };
        }
        return point;
      });
      
      // 检查是否还有选中的小点
      const hasSelectedPoints = updatedPoints.some(p => p.selected);
      
      return {
        ...topic,
        selected: hasSelectedPoints,
        points: updatedPoints
      };
    });
    
    this.setData({ 
      selectedTags: newTags,
      grammarTopics: topics
    });
    
    // 更新大类计数和智能标题
    this.updateCategoryCounts();
    this.updateSmartTitle();
    
    wx.showToast({
      title: '已删除标签',
      icon: 'success'
    });
  },

  // 清空所有选择（自选模式）
  clearAllSelections() {
    const { homeworkType } = this.data;
    
    if (homeworkType !== 'custom') {
      return;
    }
    
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有已选择的语法点吗？',
      success: (res) => {
        if (res.confirm) {
          // 清空所有选中的语法点
          const topics = this.data.grammarTopics.map(topic => {
            const updatedPoints = topic.points.map(point => ({
              ...point,
              selected: false
            }));
            return {
              ...topic,
              selected: false,
              points: updatedPoints
            };
          });
          
          this.setData({
            selectedTags: [],
            grammarTopics: topics,
            totalQuestions: 0
          });
          
          // 更新大类计数和智能标题
          this.updateCategoryCounts();
          this.updateSmartTitle();
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  // 更新选中数量和总题数
  updateSelectedCount() {
    const { homeworkType, grammarTopics, grammarPoints, selectedTags } = this.data;
    let selectedCount = 0;
    let totalQuestions = 0;
    
    if (homeworkType === 'topic') {
      selectedCount = grammarTopics.filter(t => t.selected).length;
      // 专题模式：总题数 = 选择的题目总数
      totalQuestions = this.data.totalQuestions || 0;
    } else if (homeworkType === 'custom') {
      selectedCount = grammarTopics.reduce((count, topic) => {
        return count + topic.points.filter(p => p.selected).length;
      }, 0);
      
      // 计算总题数（从selectedTags或grammarTopics）
      if (selectedTags && selectedTags.length > 0) {
        totalQuestions = selectedTags.reduce((sum, tag) => {
          return sum + (tag.count || 1);
        }, 0);
      } else {
        totalQuestions = grammarTopics.reduce((sum, topic) => {
          return sum + topic.points.reduce((pointSum, point) => {
            return pointSum + (point.selected ? (point.selectedCount || 1) : 0);
          }, 0);
        }, 0);
      }
    } else if (homeworkType === 'gaokao') {
      selectedCount = this.data.gaokaoRatio.selectedGrammarPoints.length;
      const variantCount = this.data.variantCount || 0;
      // 高考配比：10个原题 + 每个原题的变式题数量
      // 如果选择了2个变式题，应该是 10个原题 + 20个变式题 = 30题
      // 公式：总题数 = 原题数量 * (1 + 变式题数量)
      totalQuestions = selectedCount * (1 + variantCount);
    }
    
    this.setData({ 
      selectedCount,
      totalQuestions
    });
    
    console.log('已选择数量:', selectedCount, '总题数:', totalQuestions);
  },

  // 计算每个大类别下选中的小点数量（复用系统专属组合逻辑）
  getCategorySelectedCount(categoryIndex) {
    const { grammarTopics } = this.data;
    const topic = grammarTopics[categoryIndex];
    if (!topic || !topic.points) return 0;
    
    let count = 0;
    topic.points.forEach(point => {
      if (point.selected) {
        count += point.questionCount || 1; // 每个小点的题目数量
      }
    });
    
    return count;
  },

  // 更新所有大类的选中题数（复用系统专属组合逻辑）
  updateCategoryCounts() {
    const categoryCounts = [];
    
    for (let i = 0; i < this.data.grammarTopics.length; i++) {
      const count = this.getCategorySelectedCount(i);
      categoryCounts[i] = count;
    }
    
    this.setData({ 
      categoryCounts: categoryCounts
    });
    
    console.log('大类选中题数更新:', categoryCounts);
  },

  // 切换乱序开关
  toggleShuffle(e) {
    this.setData({
      shuffleQuestions: e.detail.value
    });
  },

  // 预览作业
  previewHomework() {
    const { homeworkType } = this.data;
    
    // 验证选择
    let hasSelection = false;
    if (homeworkType === 'topic') {
      const selectedTopics = this.data.grammarTopics.filter(t => t.selected);
      hasSelection = selectedTopics.length > 0;
      if (!hasSelection) {
        wx.showToast({
          title: '请选择语法大点',
          icon: 'none'
        });
        return;
      }
    } else if (homeworkType === 'gaokao' || homeworkType === 'custom') {
      const selectedPoints = [];
      this.data.grammarTopics.forEach(topic => {
        topic.points.forEach(point => {
          if (point.selected) {
            selectedPoints.push(point);
          }
        });
      });
      hasSelection = selectedPoints.length > 0;
      if (!hasSelection) {
        wx.showToast({
          title: '请选择语法小点',
          icon: 'none'
        });
        return;
      }
    }
    
    // 生成预览数据
    const previewData = this.generatePreviewData();
    this.setData({
      previewData: previewData,
      showPreview: true
    });
  },

  // 生成预览数据
  generatePreviewData() {
    const { homeworkType } = this.data;
    
    let selectedItems = [];
    let totalQuestions = 0;
    
    switch (homeworkType) {
      case 'gaokao':
        // 高考配比模式：显示选中的小点
        selectedItems = [];
        this.data.grammarTopics.forEach(topic => {
          topic.points.forEach(point => {
            if (point.selected) {
              selectedItems.push({
                category: topic.name,
                name: point.name,
                questionCount: point.questionCount
              });
            }
          });
        });
        totalQuestions = selectedItems.reduce((sum, item) => sum + item.questionCount, 0);
        break;
      case 'topic':
        // 专题模式：显示选中的大点
        selectedItems = this.data.grammarTopics.filter(t => t.selected);
        totalQuestions = selectedItems.reduce((sum, item) => sum + item.questionCount, 0);
        break;
      case 'custom':
        // 自选模式：显示选中的小点
        selectedItems = [];
        this.data.grammarTopics.forEach(topic => {
          topic.points.forEach(point => {
            if (point.selected) {
              selectedItems.push({
                category: topic.name,
                name: point.name,
                questionCount: point.questionCount
              });
            }
          });
        });
        totalQuestions = selectedItems.reduce((sum, item) => sum + item.questionCount, 0);
        break;
    }
    
    return {
      type: homeworkType,
      selectedItems: selectedItems,
      totalQuestions: totalQuestions,
      config: {
        shuffleQuestions: this.data.shuffleQuestions || true
      }
    };
  },

  // 关闭预览
  closePreview() {
    this.setData({ showPreview: false });
  },

  // 防止弹窗内容点击时关闭弹窗
  preventClose() {
    // 空方法，用于阻止事件冒泡
  },


  // 显示发布确认弹窗
  showPublishConfirm() {
    // 加载可用班级
    this.loadAvailableClasses();
    this.setData({ 
      showPublishConfirm: true,
      publishMode: 'generate' // 默认选择直接生成学案
    });
  },

  // 选择发布模式
  selectPublishMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ publishMode: mode });
  },

  // 关闭发布确认弹窗
  closePublishConfirm() {
    this.setData({ showPublishConfirm: false });
  },

  // 从云数据库获取题目（Phase 1）
  async fetchQuestionsForHomework(selectedGrammarPoints, selectedItems) {
    try {
      console.log('📚 开始从云数据库获取题目...');
      console.log('语法点:', selectedGrammarPoints);
      
      const cloudDataLoader = require('../../../utils/cloudDataLoader.js');
      const allQuestions = [];
      
      // 为每个语法点获取题目
      for (const point of selectedGrammarPoints) {
        try {
          const questions = await cloudDataLoader.getQuestionsByGrammarPoint(point);
          
          if (questions && questions.length > 0) {
            // 找到该语法点配置的题目数量
            const item = selectedItems.find(i => i.name === point);
            const count = item ? item.questionCount : 1;
            
            // 随机选择指定数量的题目
            const selected = this.getRandomQuestions(questions, count);
            allQuestions.push(...selected);
            
            console.log(`✅ 语法点 "${point}" 获取 ${selected.length}/${count} 题`);
          } else {
            console.warn(`⚠️ 语法点 "${point}" 未找到题目`);
          }
        } catch (error) {
          console.error(`❌ 获取语法点 "${point}" 题目失败:`, error);
        }
      }
      
      // 去重：确保同一道题目不会出现两次
      const uniqueQuestions = this.removeDuplicateQuestions(allQuestions);
      
      console.log(`✅ 共获取 ${uniqueQuestions.length} 道题目（去重后）`);
      return uniqueQuestions;
      
    } catch (error) {
      console.error('❌ 获取题目失败:', error);
      wx.showToast({
        title: '题目加载失败，请重试',
        icon: 'none'
      });
      return [];
    }
  },

  // 随机选择题目
  getRandomQuestions(questions, count) {
    if (!questions || questions.length === 0) return [];
    
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, questions.length));
  },

  // 去重题目列表（基于题目的唯一标识）
  removeDuplicateQuestions(questions) {
    if (!questions || questions.length === 0) return [];
    
    const seen = new Set();
    const uniqueQuestions = [];
    
    for (const question of questions) {
      // 优先使用 _id，其次使用 id，最后使用 text 作为唯一标识
      const uniqueKey = question._id || question.id || question.text;
      
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        uniqueQuestions.push(question);
      } else {
        console.log(`⚠️ 发现重复题目，已跳过: ${uniqueKey}`);
      }
    }
    
    if (questions.length !== uniqueQuestions.length) {
      console.log(`✅ 去重完成: 原始 ${questions.length} 道题目，去重后 ${uniqueQuestions.length} 道题目`);
    }
    
    return uniqueQuestions;
  },

  // 发布作业
  async publishHomework() {
    const { homeworkType, smartTitle, smartRemark, selectedClasses, publishMode } = this.data;
    
    // 根据发布模式验证
    if (publishMode === 'class' && (!selectedClasses || selectedClasses.length === 0)) {
      wx.showToast({
        title: '请选择发布班级',
        icon: 'none'
      });
      return;
    }
    
    try {
      this.setData({ loading: true });
      
      // 生成作业数据
      const homeworkData = this.generateHomeworkData();
      
      // ✅ Phase 1: 从云数据库获取完整题目
      wx.showLoading({ title: '正在获取题目...' });
      const questions = await this.fetchQuestionsForHomework(
        homeworkData.selectedGrammarPoints,
        homeworkData.selectedItems
      );
      wx.hideLoading();
      
      // 添加题目到作业数据
      homeworkData.questions = questions;
      console.log('✅ 作业数据包含题目数量:', questions.length);
      
      // 保存到本地存储
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      const existingHomeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
      existingHomeworks.unshift(homeworkData);
      wx.setStorageSync(`homeworks_${teacherId}`, existingHomeworks);
      
      // 根据发布模式处理
      if (publishMode === 'class') {
        // 发布到班级模式：为每个选中的班级创建作业副本
        await this.createHomeworkForClasses(homeworkData, selectedClasses);
        console.log('作业发布成功:', homeworkData);
        
        // 显示发布成功弹窗
        this.setData({
          showPublishConfirm: false,
          showPublishSuccess: true,
          loading: false
        });
      } else {
        // 直接生成学案模式：立即跳转到学案生成
        console.log('作业数据准备完成，跳转到学案生成:', homeworkData);
        
        // 直接跳转到学案生成页面
        this.setData({
          showPublishConfirm: false,
          loading: false
        });
        
        // 跳转到学案生成页面，传递作业数据
        wx.navigateTo({
          url: `/pages/teacher/teacher-materials/index?fromHomework=true&homeworkId=${homeworkData._id}&homeworkTitle=${encodeURIComponent(homeworkData.title)}`,
          success: () => {
            console.log('跳转到学案生成页面成功');
          }
        });
      }
      
    } catch (error) {
      console.error('发布作业失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '发布失败',
        icon: 'none'
      });
    }
  },

  // 关闭发布成功弹窗
  closePublishSuccess() {
    this.setData({ showPublishSuccess: false });
  },

  // 显示变式题选择器
  showVariantSelector() {
    const { homeworkType } = this.data;
    
    // 自选20题模式：直接进入预览界面，跳过变式题弹窗
    if (homeworkType === 'custom') {
      this.setData({ variantCount: 0 });
      this.goToPreview();
      return;
    }
    
    // 其他模式：显示变式题选择弹窗
    this.setData({ 
      showPreview: true,
      variantCount: 0 
    });
  },

  // 增加变式题
  addVariants() {
    // 显示变式题数量选择弹窗
    wx.showActionSheet({
      itemList: ['1道变式题', '2道变式题', '3道变式题'],
      success: (res) => {
        const variantCount = res.tapIndex + 1;
        this.setData({ variantCount });
        
        // 更新总题数（高考配比模式需要考虑变式题数量）
        this.updateSelectedCount();
        
        // 显示提示
        wx.showToast({
          title: `已选${variantCount}道变式题，即将进入预览`,
          icon: 'success',
          duration: 1500
        });
        
        // 延迟跳转，让用户看到提示
        setTimeout(() => {
          this.goToPreview();
        }, 1500);
      }
    });
  },

  // 专题模式：直接跳转到预览界面（不需要"我选好了"按钮和变式题弹窗）
  goToPreviewDirectly() {
    console.log('【专题模式】开始直接跳转到预览界面');
    
    const { selectedTopics, grammarTopics, selectedTotalCount } = this.data;
    
    // 检查是否有选中的专题
    if (!selectedTopics || selectedTopics.length === 0) {
      console.warn('【专题模式】未选择专题，无法跳转');
      wx.showToast({
        title: '请先选择专题',
        icon: 'none'
      });
      return;
    }
    
    // 直接重新计算分配数据，确保数据是最新的
    const topicName = selectedTopics[0];
    const topic = grammarTopics.find(t => t.name === topicName);
    
    if (!topic || !topic.points || topic.points.length === 0) {
      console.error('【专题模式】专题下没有小点:', topicName);
      wx.showToast({
        title: '专题下没有可用的小点',
        icon: 'none'
      });
      return;
    }
    
    // 直接计算分配，不依赖 this.data.distributedQuestions
    const allSelectedPoints = [...topic.points];
    const totalCount = selectedTotalCount || 20;
    const distributedQuestions = this.distributeQuestionsToPoints(allSelectedPoints, totalCount);
    
    console.log('【专题模式】分配数据计算完成:', {
      topicName,
      pointsCount: allSelectedPoints.length,
      totalCount,
      distributedCount: distributedQuestions.filter(p => p.count > 0).length
    });
    
    // 同步更新数据，用于构建作业数据
    this.data.distributedQuestions = distributedQuestions;
    this.setData({ distributedQuestions });
    
    // 直接构建作业数据（不等待setData回调）
    const assignmentData = this.buildAssignmentData();
    
    if (!assignmentData || !assignmentData.questions || assignmentData.questions.length === 0) {
      console.error('【专题模式】构建作业数据失败:', assignmentData);
      wx.showToast({
        title: '生成题目失败，请重试',
        icon: 'none'
      });
      return;
    }
    
    console.log('【专题模式】作业数据构建成功:', {
      title: assignmentData.title,
      questionsCount: assignmentData.questions.length,
      grammarPoints: [...new Set(assignmentData.questions.map(q => q.grammarPoint || q.category))]
    });
    
    // 专题模式固定为0道变式题
    const variantCount = 0;
    
    // 跳转到统一学案生成流程
    const url = `/pages/teacher/teacher-generate-material/index?assignmentData=${encodeURIComponent(JSON.stringify(assignmentData))}&variantCount=${variantCount}`;
    
    console.log('【专题模式】准备跳转，URL长度:', url.length);
    
    wx.navigateTo({
      url: url,
      success: () => {
        console.log('【专题模式】跳转到预览界面成功');
      },
      fail: (error) => {
        console.error('【专题模式】跳转失败:', error);
        wx.showToast({
          title: '跳转失败，请重试',
          icon: 'error',
          duration: 2000
        });
      }
    });
  },

  // 无变式题，直接进入预览（保留给其他模式使用）
  goToPreview() {
    // 获取当前选择的题目数据
    const { homeworkType, selectedTags, selectedTopics, gaokaoRatio, variantCount } = this.data;
    
    // 构建作业数据
    const assignmentData = this.buildAssignmentData();
    
    if (!assignmentData || !assignmentData.questions || assignmentData.questions.length === 0) {
      wx.showToast({
        title: '请先选择题目',
        icon: 'none'
      });
      return;
    }
    
    // 关闭预览弹窗
    this.setData({ showPreview: false });
    
    // 跳转到统一学案生成流程
    const url = `/pages/teacher/teacher-generate-material/index?assignmentData=${encodeURIComponent(JSON.stringify(assignmentData))}&variantCount=${variantCount}`;
    
    setTimeout(() => {
      wx.navigateTo({
        url: url,
        success: () => {
          console.log('跳转成功');
        },
        fail: (error) => {
          console.error('跳转失败:', error);
          wx.showToast({
            title: '跳转失败，请重试',
            icon: 'error'
          });
        }
      });
    }, 1500);
  },

  // 跳转到统一学案生成流程（保留原方法以兼容）
  goToUnifiedGenerate(e) {
    this.goToPreview();
  },

  // 构建作业数据
  buildAssignmentData() {
    const { homeworkType, selectedTags, selectedTopics, gaokaoRatio, smartTitle } = this.data;
    
    console.log('【buildAssignmentData】开始构建作业数据，homeworkType:', homeworkType);
    console.log('【buildAssignmentData】selectedTags:', selectedTags);
    console.log('【buildAssignmentData】selectedTopics:', selectedTopics);
    
    let questions = [];
    let title = smartTitle || '语法练习学案';
    
    // 【高考配比专用逻辑 - 请勿修改】
    if (homeworkType === 'gaokao') {
      // 高考配比模式：使用已生成的 gaokaoRatio.selectedGrammarPoints
      questions = this.generateGaokaoQuestions();
      title = '高考配比练习';
    } else if (homeworkType === 'topic') {
      // 专题模式：确保分配数据已更新
      if (!this.data.distributedQuestions || this.data.distributedQuestions.length === 0) {
        console.log('【专题模式】分配数据未设置，重新计算...');
        this.updateTopicModeCounts();
      }
      questions = this.generateTopicQuestions();
      title = '专题练习';
    } else if (homeworkType === 'custom') {
      // 自选模式
      console.log('【自选模式】调用generateCustomQuestions，selectedTags:', selectedTags);
      questions = this.generateCustomQuestions();
      console.log('【自选模式】generateCustomQuestions返回题目数量:', questions.length);
      title = '自选语法练习';
    }
    
    // 对所有模式的题目进行去重，确保同一道题目不会出现两次
    const uniqueQuestions = this.removeDuplicateQuestions(questions);
    
    return {
      id: `assignment_${Date.now()}`,
      title: title,
      type: homeworkType,
      questions: uniqueQuestions,
      totalQuestions: uniqueQuestions.length,
      createdAt: new Date().toISOString()
    };
  },

  /**
   * 【高考配比专用函数 - 请勿修改】
   * 根据 gaokaoRatio.selectedGrammarPoints 生成题目
   * 注意：此函数依赖 executeGaokaoSystemCombo() 生成的数据结构
   */
  generateGaokaoQuestions() {
    const { gaokaoRatio } = this.data;
    const questions = [];
    
    // 根据高考配比规则生成题目
    if (gaokaoRatio && gaokaoRatio.selectedGrammarPoints) {
      gaokaoRatio.selectedGrammarPoints.forEach((point, index) => {
        // 生成完整的题目内容
        const questionContent = this.generateQuestionContent(point, index + 1);
        questions.push({
          id: `gaokao_q${index + 1}`,
          text: questionContent,
          grammarPoint: point,
          category: point,
          answer: 'A',
          analysis: `这是${point}的解析`
        });
      });
    }
    
    // 如果没有数据，返回默认题目
    if (questions.length === 0) {
      return [
        {
          id: 'gaokao_q1',
          text: '高考配比题目 1：介词综合',
          grammarPoint: '介词',
          category: '介词综合',
          answer: 'A',
          analysis: '这是介词综合的解析'
        },
        {
          id: 'gaokao_q2',
          text: '高考配比题目 2：代词综合',
          grammarPoint: '代词',
          category: '代词综合',
          answer: 'B',
          analysis: '这是代词综合的解析'
        }
      ];
    }
    
    return questions;
  },

  // 生成题目内容
  generateQuestionContent(grammarPoint, questionNumber) {
    // 根据语法点生成对应的题目内容
    const questionTemplates = {
      '介词 + 名词/动名词': `高考配比题目 ${questionNumber}：介词 + 名词/动名词

请选择正确的介词填空：
The book is ___ the table.
A. on    B. in    C. at    D. by

解析：本题考查介词与名词的搭配用法。`,

      'it相关': `高考配比题目 ${questionNumber}：it相关

请选择正确的答案：
___ is important to study hard.
A. It    B. This    C. That    D. There

解析：本题考查it作形式主语的用法。`,

      '从属连词综合': `高考配比题目 ${questionNumber}：从属连词综合

请选择正确的从属连词：
___ it's raining, we'll stay inside.
A. Because    B. Although    C. If    D. When

解析：本题考查从属连词的用法和逻辑关系。`,

      'a和an': `高考配比题目 ${questionNumber}：a和an

请选择正确的冠词：
I have ___ apple and ___ orange.
A. a, an    B. an, a    C. a, a    D. an, an

解析：本题考查不定冠词a和an的用法区别。`,

      '复合词和外来词': `高考配比题目 ${questionNumber}：复合词和外来词

请选择正确的复合词：
This is a ___ story.
A. well-known    B. well known    C. wellknown    D. well_known

解析：本题考查复合词的构成和用法。`,

      '主从句与动词': `高考配比题目 ${questionNumber}：主从句与动词

请选择正确的动词形式：
I suggest that he ___ the work.
A. do    B. does    C. did    D. will do

解析：本题考查主从句中动词的时态和语态。`,

      '时态(过去进行时)': `高考配比题目 ${questionNumber}：时态(过去进行时)

请选择正确的时态：
I ___ TV when you called.
A. watched    B. was watching    C. watch    D. am watching

解析：本题考查过去进行时的用法。`,

      '不定式综合': `高考配比题目 ${questionNumber}：不定式综合

请选择正确的动词形式：
I want ___ English well.
A. learn    B. to learn    C. learning    D. learned

解析：本题考查不定式的用法。`,

      '比较级': `高考配比题目 ${questionNumber}：比较级

请选择正确的比较级形式：
This book is ___ than that one.
A. good    B. better    C. best    D. well

解析：本题考查形容词比较级的用法。`,

      '副词修饰形容词/副词': `高考配比题目 ${questionNumber}：副词修饰形容词/副词

请选择正确的副词：
The weather is ___ cold today.
A. very    B. much    C. many    D. more

解析：本题考查副词修饰形容词的用法。`,

      'whose': `高考配比题目 ${questionNumber}：whose

请选择正确的关系代词：
This is the student ___ book was lost.
A. who    B. whom    C. whose    D. which

解析：本题考查whose作为关系代词的用法。`,

      'where': `高考配比题目 ${questionNumber}：where

请选择正确的关系副词：
This is the place ___ we met last year.
A. which    B. that    C. where    D. when

解析：本题考查where作为关系副词的用法。`
    };

    return questionTemplates[grammarPoint] || `高考配比题目 ${questionNumber}：${grammarPoint}

请根据${grammarPoint}完成以下练习：
A. 选项A    B. 选项B    C. 选项C    D. 选项D

解析：本题考查${grammarPoint}的相关知识。`;
  },

  // 生成专题题目
  /**
   * 生成专题模式题目
   * 根据选中的专题（selectedTopics）和分配的题目数量（distributedQuestions）生成题目数据
   */
  generateTopicQuestions() {
    const { selectedTopics, distributedQuestions, selectedTotalCount, grammarTopics } = this.data;
    
    console.log('【专题模式】开始生成题目，参数:', {
      selectedTopics,
      distributedQuestions: distributedQuestions ? distributedQuestions.length : 0,
      selectedTotalCount,
      grammarTopicsCount: grammarTopics ? grammarTopics.length : 0
    });
    
    // 如果没有选中的专题，返回空数组
    if (!selectedTopics || selectedTopics.length === 0) {
      console.warn('专题模式：未选择任何专题');
      return [];
    }
    
    // 如果没有分配数据，重新计算分配
    let questions = [];
    let pointsWithCount = [];
    
    if (distributedQuestions && distributedQuestions.length > 0) {
      // 使用已有的分配结果
      pointsWithCount = distributedQuestions.filter(p => p.count > 0);
      console.log('【专题模式】使用已有分配结果:', pointsWithCount.map(p => ({ name: p.name, count: p.count })));
    } else {
      // 重新计算分配：从选中的专题中获取所有小点
      const allSelectedPoints = [];
      selectedTopics.forEach(topicName => {
        const topic = grammarTopics.find(t => t.name === topicName);
        console.log(`【专题模式】查找专题 "${topicName}":`, topic ? `找到，包含 ${topic.points ? topic.points.length : 0} 个小点` : '未找到');
        if (topic && topic.points) {
          allSelectedPoints.push(...topic.points);
          console.log(`【专题模式】从专题 "${topicName}" 获取到小点:`, topic.points.map(p => p.name));
        }
      });
      
      console.log('【专题模式】所有选中的小点:', allSelectedPoints.map(p => p.name));
      
      const distributed = this.distributeQuestionsToPoints(allSelectedPoints, selectedTotalCount || 20);
      pointsWithCount = distributed.filter(p => p.count > 0);
      console.log('【专题模式】分配后的结果:', pointsWithCount.map(p => ({ name: p.name, count: p.count })));
    }
    
    // 根据分配结果生成题目数据
    pointsWithCount.forEach((point, index) => {
      // 为每个语法点生成对应数量的题目占位数据
      // 实际题目会在学案生成时从数据库获取
      for (let i = 0; i < point.count; i++) {
        questions.push({
          id: `topic_q${index}_${i}`,
          text: `专题题目占位 ${point.name}`, // 占位文本，实际会在学案生成时替换
          grammarPoint: point.name, // 语法点名称，用于从数据库查询
          category: point.name, // 分类名称
          answer: '', // 答案会在从数据库获取时填充
          analysis: '' // 解析会在从数据库获取时填充
        });
      }
    });
    
    console.log('【专题模式】最终生成的题目数据:', {
      selectedTopics,
      totalQuestions: questions.length,
      grammarPoints: questions.map(q => q.grammarPoint),
      pointsWithCount: pointsWithCount.map(p => ({ name: p.name, count: p.count }))
    });
    
    return questions;
  },

  // 生成自选题目
  generateCustomQuestions() {
    // 根据用户选择的语法点生成题目
    const { selectedTags } = this.data;
    const questions = [];
    
    if (!selectedTags || selectedTags.length === 0) {
      console.warn('【自选模式】selectedTags为空，无法生成题目');
      return [];
    }
    
    console.log('【自选模式】开始生成题目，selectedTags:', selectedTags);
    
    // 遍历每个选中的语法点
    selectedTags.forEach((tag, tagIndex) => {
      const grammarPoint = tag.name || tag;
      const count = tag.count || 1;
      
      console.log(`【自选模式】为语法点 "${grammarPoint}" 生成 ${count} 道题目`);
      
      // 为每个语法点生成指定数量的题目
      for (let i = 0; i < count; i++) {
        questions.push({
          id: `custom_q${tagIndex}_${i + 1}`,
          text: `${grammarPoint} 练习题 ${i + 1}`,
          grammarPoint: grammarPoint,
          category: grammarPoint,
          answer: 'A',
          analysis: `这是${grammarPoint}的解析`
        });
      }
    });
    
    console.log('【自选模式】生成题目完成，共', questions.length, '道');
    return questions;
  },

  // 跳转到配套材料
  goToMaterials() {
    this.setData({ showPublishSuccess: false });
    
    // 获取最新发布的作业信息
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
    const latestHomework = homeworks[0]; // 最新的作业
    
    // 传递作业信息到配套材料界面
    const params = {
      fromHomework: true,
      homeworkId: latestHomework ? (latestHomework._id || latestHomework.id) : null,
      homeworkTitle: latestHomework ? latestHomework.title : null
    };
    
    const queryString = Object.keys(params)
      .filter(key => params[key] !== null)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    wx.navigateTo({
      url: `/pages/teacher/teacher-materials/index?${queryString}`
    });
  },


  // 生成作业数据
  generateHomeworkData() {
    const { homeworkType, selectedClasses } = this.data;
    const previewData = this.generatePreviewData();
    
    // 获取选中的语法点名称（用于云数据库查询）
    let selectedGrammarPoints = [];
    // 【高考配比专用逻辑 - 请勿修改】
    if (homeworkType === 'gaokao') {
      // 高考配比模式：直接使用 gaokaoRatio.selectedGrammarPoints（由 executeGaokaoSystemCombo 生成）
      selectedGrammarPoints = this.data.gaokaoRatio.selectedGrammarPoints || [];
    } else {
      // 从grammarTopics中提取选中的小点名称
      this.data.grammarTopics.forEach(topic => {
        topic.points.forEach(point => {
          if (point.selected) {
            selectedGrammarPoints.push(point.name);
          }
        });
      });
    }
    
    return {
      _id: `homework_${Date.now()}`,
      type: homeworkType,
      title: this.getHomeworkTitle(),
      description: this.getHomeworkDescription(),
      config: {
        shuffleQuestions: this.data.shuffleQuestions
      },
      selectedItems: previewData.selectedItems,
      selectedGrammarPoints: selectedGrammarPoints, // 添加语法点名称数组
      totalQuestions: previewData.totalQuestions,
      assignedClasses: selectedClasses.map(cls => ({
        id: cls.id,
        name: cls.name,
        studentCount: cls.studentCount
      })),
      status: 'published',
      createdAt: new Date().toISOString(),
      teacherId: wx.getStorageSync('teacherId') || 'teacher_123'
    };
  },

  // 获取作业标题
  getHomeworkTitle() {
    const { homeworkType } = this.data;
    const titles = {
      smart: '智能推荐作业',
      gaokao: '高考配比练习',
      topic: '专题语法练习',
      custom: '自选语法练习'
    };
    return titles[homeworkType] || '语法练习';
  },

  // 获取作业描述
  getHomeworkDescription() {
    const { homeworkType, homeworkConfig } = this.data;
    const descriptions = {
      smart: '基于教学进度智能推荐的语法练习',
      gaokao: '按高考比例配置的语法练习',
      topic: '专题语法点练习',
      custom: '自选语法小点练习'
    };
    return descriptions[homeworkType] || '语法练习';
  },

  // 加载可用班级
  loadAvailableClasses() {
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const classes = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    
    // 如果没有班级数据，创建一些示例数据
    if (classes.length === 0) {
      const defaultClasses = [
        {
          id: 'class_1',
          name: '高三(1)班',
          studentCount: 25,
          teacher: '张老师',
          createdAt: '2024-09-01',
          lastActivity: '2024-12-20 10:30',
          status: 'active',
          averageAccuracy: 78,
          completedAssignments: 12,
          totalAssignments: 15
        },
        {
          id: 'class_2',
          name: '高三(2)班',
          studentCount: 23,
          teacher: '张老师',
          createdAt: '2024-09-01',
          lastActivity: '2024-12-19 16:45',
          status: 'active',
          averageAccuracy: 82,
          completedAssignments: 14,
          totalAssignments: 15
        },
        {
          id: 'class_3',
          name: '高二(1)班',
          studentCount: 28,
          teacher: '张老师',
          createdAt: '2024-09-01',
          lastActivity: '2024-12-18 14:20',
          status: 'active',
          averageAccuracy: 75,
          completedAssignments: 10,
          totalAssignments: 12
        }
      ];
      
      // 保存示例数据
      wx.setStorageSync(`teacher_classes_${teacherId}`, defaultClasses);
      this.setData({ availableClasses: defaultClasses });
    } else {
      this.setData({ availableClasses: classes });
    }
  },

  // 显示班级选择弹窗
  showClassSelection() {
    this.setData({ showClassSelection: true });
  },

  // 关闭班级选择弹窗
  closeClassSelection() {
    this.setData({ showClassSelection: false });
  },

  // 切换班级选择
  toggleClassSelection(e) {
    const classId = e.currentTarget.dataset.classId;
    const { selectedClassIds, availableClasses } = this.data;
    
    let newSelectedIds = [...selectedClassIds];
    const index = newSelectedIds.indexOf(classId);
    
    if (index > -1) {
      // 取消选择
      newSelectedIds.splice(index, 1);
    } else {
      // 选择班级
      newSelectedIds.push(classId);
    }
    
    // 更新选中的班级信息
    const selectedClasses = availableClasses.filter(cls => newSelectedIds.includes(cls.id));
    
    this.setData({
      selectedClassIds: newSelectedIds,
      selectedClasses: selectedClasses
    });
  },

  // 确认班级选择
  confirmClassSelection() {
    if (this.data.selectedClasses.length === 0) {
      wx.showToast({
        title: '请至少选择一个班级',
        icon: 'none'
      });
      return;
    }
    
    this.setData({ showClassSelection: false });
  },

  // 移除选中的班级
  removeSelectedClass(e) {
    const classId = e.currentTarget.dataset.classId;
    const { selectedClassIds, availableClasses } = this.data;
    
    const newSelectedIds = selectedClassIds.filter(id => id !== classId);
    const selectedClasses = availableClasses.filter(cls => newSelectedIds.includes(cls.id));
    
    this.setData({
      selectedClassIds: newSelectedIds,
      selectedClasses: selectedClasses
    });
  },

  // 为选中的班级创建作业
  async createHomeworkForClasses(homeworkData, selectedClasses) {
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    for (const classInfo of selectedClasses) {
      // 获取该班级的所有学生
      const students = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
      const classStudents = students.filter(student => student.classId === classInfo.id);
      
      console.log(`为班级 ${classInfo.name} 创建作业，学生数量: ${classStudents.length}`);
      
      // 为每个学生创建作业记录
      for (const student of classStudents) {
        const studentHomework = {
          _id: `student_homework_${Date.now()}_${student.id}`,
          homeworkId: homeworkData._id,
          studentId: student.id,
          studentName: student.name,
          classId: classInfo.id,
          className: classInfo.name,
          teacherId: teacherId,
          title: homeworkData.title,
          description: homeworkData.description,
          selectedGrammarPoints: homeworkData.selectedGrammarPoints,
          totalQuestions: homeworkData.totalQuestions,
          status: 'assigned', // assigned, in_progress, completed
          assignedAt: new Date().toISOString(),
          deadline: this.getHomeworkDeadline(),
          completedAt: null,
          score: null,
          accuracy: null,
          answers: [],
          createdAt: new Date().toISOString()
        };
        
        // 保存学生作业记录
        const existingStudentHomeworks = wx.getStorageSync(`student_homeworks_${student.id}`) || [];
        existingStudentHomeworks.unshift(studentHomework);
        wx.setStorageSync(`student_homeworks_${student.id}`, existingStudentHomeworks);
        
        // 如果有云开发环境，也保存到云端
        if (wx.cloud) {
          try {
            const db = wx.cloud.database();
            await db.collection('student_homeworks').add({
              data: studentHomework
            });
          } catch (cloudError) {
            console.warn('同步学生作业到云端失败:', cloudError);
          }
        }
      }
    }
  },

  // 获取作业截止时间
  getHomeworkDeadline() {
    // 默认设置为明天18:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);
    return tomorrow.toISOString();
  },

  // 强制数据刷新
  forceDataRefresh() {
    console.log('强制刷新数据...');
    
    // 先验证当前数据状态
    console.log('当前数据状态验证:');
    this.data.grammarTopics.forEach((topic, topicIndex) => {
      console.log(`大点 ${topicIndex + 1}: ${topic.name}`);
      if (topic.points && topic.points.length > 0) {
        topic.points.forEach((point, pointIndex) => {
          console.log(`  小点 ${pointIndex + 1}: name="${point.name}", questionCount=${point.questionCount}`);
        });
      }
    });
    
    // 重新设置数据以触发重新渲染
    this.setData({ 
      grammarTopics: [...this.data.grammarTopics],
      forceUpdate: Date.now()
    });
    
    console.log('数据刷新完成');
  },

  // 强制数据同步
  forceDataSync() {
    console.log('强制数据同步...');
    
    // 获取当前数据
    const currentTopics = this.data.grammarTopics;
    console.log('当前数据状态:', currentTopics);
    
    // 验证数据完整性
    let hasDataIssue = false;
    currentTopics.forEach((topic, topicIndex) => {
      if (topic.points && topic.points.length > 0) {
        topic.points.forEach((point, pointIndex) => {
          if (!point.name || point.name === '' || point.name === '未命名小点') {
            console.error(`发现数据问题: 大点 ${topic.name} 的小点 ${pointIndex + 1} 名称为空或未命名`);
            hasDataIssue = true;
          }
        });
      }
    });
    
    if (hasDataIssue) {
      console.log('检测到数据问题，执行强制修复...');
      this.forceDataRefresh();
    } else {
      console.log('数据正常，执行强制重新渲染...');
      // 强制重新设置数据以触发重新渲染
      this.setData({ 
        grammarTopics: [...currentTopics],
        forceUpdate: Date.now() // 添加时间戳强制更新
      });
    }
  },

  // 强制重新渲染小点数据
  forceRenderPoints() {
    console.log('强制重新渲染小点数据...');
    
    // 获取当前数据并强制重新设置
    const currentTopics = this.data.grammarTopics;
    const newTopics = currentTopics.map(topic => {
      if (topic.points && topic.points.length > 0) {
        const newPoints = topic.points.map(point => ({
          ...point,
          name: point.name || '未命名小点',
          questionCount: point.questionCount || 0
        }));
        return { ...topic, points: newPoints };
      }
      return topic;
    });
    
    this.setData({ grammarTopics: newTopics });
    console.log('小点数据重新渲染完成');
  }
});
