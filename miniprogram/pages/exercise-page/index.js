// 引入云数据加载器
const cloudDataLoader = require('../../utils/cloudDataLoader.js');
const writingNouns = require('../../data/writing_nouns.js');
const writingTenses = require('../../data/writing_tenses.js');
const TableUtils = require('./table-utils.js');
const TableHandler = require('./table-handler.js');
const ExportService = require('./export-service.js');

// 固定名词后缀提示内容
const NOUN_SUFFIX_HINT = "常见的名词后缀有-ness、-th、-ment、-ion、-ure、-ity、-or、-er、-ist、-ism、-al、-hood、-ship、-dom等。";

Page({
  data: {
    level: '',
    grammarPoint: '',
    questions: [],
    answers: [],
    results: [],
    submitting: false,
    correctionCompleted: false, // 批改完成状态
    wrongQuestions: [],
    mode: 'normal', // normal, practice, review
    selectedPoints: [],
    
    // 表格优化相关
    tableStateManager: null, // 表格状态管理器
    tableHandler: null, // 统一表格处理器
    tableProgress: { // 表格进度信息
      totalCells: 0,
      completedCells: 0,
      correctCells: 0,
      completionRate: 0,
      accuracyRate: 0
    },
    showProgress: true, // 是否显示进度
    showDetailedStats: false, // 是否显示详细统计
    
    // 导出功能相关
    showExportModal: false, // 是否显示导出模态框
    showExportProgress: false, // 是否显示导出进度
    exportFormat: 'pdf', // 导出格式
    exportTemplate: 'standard', // 导出模板
    exportQuantity: 10, // 导出题目数量
    maxExportQuantity: 20, // 最大导出数量
    selectedDifficulties: ['easy', 'medium', 'hard'], // 选中的难度
    estimatedPages: 0, // 预计页数
    estimatedSize: '0KB', // 预计文件大小
    previewContent: '', // 预览内容
    userExportLimit: null, // 用户导出限制
    exportProgress: 0, // 导出进度
    exportStatus: '', // 导出状态
    canExport: false, // 是否可以导出
    
    // 新增：解析展开状态
    analysisExpanded: {}, // 存储每个题目解析的展开状态
    
    // 表格练习相关
    exerciseType: '', // 'grammar' 或 'writing'
    tableData: null,
    tableAnswers: {},
    correctAnswers: {},
    showCorrect: {},
    
    // 提示相关
    showHintModal: false,
    hintOptions: ["宾格", "形容词性物主代词", "名词性物主代词", "反身代词"],
    currentHint: "",

    // 答案相关
    showAnswerModal: false,
    currentAnswer: null,
    // 新增：提示内容弹窗
    showHintContentModal: false,
    hintContent: "",

    // 新增：行状态
    rowStatus: {},

    // 新增：noun_004相关
    noun004ShowFullRule: [false, false, false, false, false],
    noun004InputStatus: {},

    // 代词表格相关
    pronounUserInputs: {}, // 存储用户输入
    pronounInputStatus: {}, // 存储输入状态：correct/wrong/空
    
    // 介词表格相关
    prepositionUserInputs: {}, // 存储用户输入
    prepositionInputStatus: {}, // 存储输入状态：correct/wrong/空
    
    // 现在分词表格相关
    presentParticipleShowFullRule: [false, false, false, false, false],
    presentParticipleInputStatus: {},
    
    // 过去分词表格相关
    pastParticipleShowFullRule: [false, false, false, false, false],
    pastParticipleInputStatus: {},
    
    // 时态书写表格相关
    tenseWritingShowFullRule: [false, false, false, false, false, false, false, false], // 8行规则全文显示状态
    tenseWritingInputStatus: {},
    
    // 比较级最高级表格相关
    prefixSuffixInputStatus: {},
    comparativeInputStatus: {},
    superlativeInputStatus: {},
    comparativeShowFullRule: [false, false, false, false, false],
    superlativeShowFullRule: [false, false, false, false, false],
    
    // 副词表格相关
    adverbInputStatus: {},
    adverbShowFullRule: [false, false, false, false, false, false],
    
    // 特殊类别引导相关
    hasSpecialCategory: false,
    showSpecialGuide: false,
    
    // 错题变式练习相关
    isWrongQuestionVariant: false,
    
    // 错题消灭练习相关
    isWrongQuestionElimination: false,
    
    // 新增：是否有错题的标志
    hasWrongQuestions: false,

    // 新增：知识点双向联动模块相关
    showSuffixCard: false, // 后缀知识卡片显示状态
    showRuleCard: false, // 书写规则卡片显示状态
    showTableCard: false, // 表格卡片显示状态
    errorCounts: {}, // 各语法点错误次数统计，如 { 'noun-plural': 3 }
    currentQuestionIndex: 0, // 当前题目索引
    currentQuestionType: '', // 当前题目类型
    
    // 新增：笔记和表格数据
    notesData: {}, // 存储笔记数据
    tablesData: {}, // 存储表格数据
    
    // 新增：动态知识卡片相关
    currentNoteData: null, // 当前显示的笔记数据
    currentTableData: null, // 当前显示的表格数据
    originalTableData: null, // 原始表格数据（用于显示答案）
    currentTableIds: [], // 当前关联的表格ID列表
    currentGrammarType: '', // 当前语法类型
    
    // 新增：表格练习相关
    tableUserInputs: {}, // 用户输入的表格答案
    tableInputStatus: {}, // 表格输入状态：correct/wrong/空
    showTableAnswers: false, // 是否显示表格答案
  },

  async getRandomQuestionsFromSubClass(subClassKey, count = 5) {
    let questionsData;
    try {
      // 统一使用云数据库加载题目
      questionsData = await cloudDataLoader.loadIntermediateQuestions();
    } catch (error) {
      console.error('加载题目数据失败:', error);
      return [];
    }
    
    // 根据分类筛选题目
    const filteredQuestions = questionsData.filter(q => q.category === subClassKey);
    const shuffled = filteredQuestions.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

  onLoad(options) {
    const { questions, mode, level, tables, type, hasSpecialCategory, isWrongQuestionVariant, isWrongQuestionElimination, source } = options;
    this.dataSourceType = type; // 保存类型
    
    // 初始化表格状态管理器和处理器
    this.setData({
      tableStateManager: new TableUtils.TableStateManager(),
      tableHandler: new TableHandler(this)
    });
    
    // 初始化导出服务
    this.exportService = new ExportService();
    this.updateExportPreview();
    
    console.log('🚀 页面加载参数:', options);
    
    // 检查是否包含特殊类别
    const hasSpecial = hasSpecialCategory === 'true';
    // 检查是否为错题变式练习
    const isWrongVariant = isWrongQuestionVariant === 'true';
    // 检查是否为错题消灭练习
    const isWrongElimination = isWrongQuestionElimination === 'true';
    
    console.log('错题消灭练习参数:', {
      isWrongQuestionElimination,
      isWrongElimination,
      mode,
      level
    });
    
    console.log('错题特训标志设置:', {
      isWrongQuestionVariant: isWrongVariant,
      isWrongQuestionElimination: isWrongElimination,
      originalParams: {
        isWrongQuestionVariant,
        isWrongQuestionElimination
      }
    });
    
    this.setData({
      hasSpecialCategory: hasSpecial,
      isWrongQuestionVariant: isWrongVariant,
      isWrongQuestionElimination: isWrongElimination
    });
    
    // 判断是否为表格练习
    if (type && tables) {
      this.initTableExercise(tables);
    } else if (source === 'customCategory') {
      // 处理自定义语法大类组合
      this.initCustomCategoryExercise();
    } else {
      this.initGrammarExercise(questions, mode, level);
    }
    
    // 加载笔记和表格数据
    this.loadNotesAndTablesData();
  },

  onShow() {
    console.log('📱 页面显示时的数据状态:', {
      exerciseType: this.data.exerciseType,
      questionsLength: this.data.questions ? this.data.questions.length : 0,
      questions: this.data.questions,
      hasQuestions: !!this.data.questions && this.data.questions.length > 0
    });
  },
  
  // 新增：加载笔记和表格数据
  loadNotesAndTablesData() {
    try {
      // 从questionsData中提取笔记和表格数据
      const notesData = {};
      const tablesData = {};
      
      console.log('开始加载笔记和表格数据，questionsData keys:', Object.keys(questionsData));
      
      // 遍历questionsData，只处理笔记和表格数据
      Object.keys(questionsData).forEach(key => {
        const item = questionsData[key];
        
        // 只处理以特定前缀开头的笔记和表格数据
        if (key.startsWith('tense_note_') || key.startsWith('voice_note_') || key.startsWith('noun_note_') || key.startsWith('pronoun_note_') || key.startsWith('preposition_note_') || key.startsWith('comparative_note_') || key.startsWith('superlative_note_') || key.startsWith('participle_note_') || key.startsWith('adverb_note_') || key.startsWith('article_note_')) {
          // 检查笔记数据完整性和有效性
          if (item && typeof item === 'object' && item.frontendName && item.content) {
            // 如果状态为"已创建"，但内容不为空，则强制设置为"已创建"
            if (item.status === "已创建" && item.content && item.content.trim() !== "") {
              item.status = "已创建";
              console.log('自动修复笔记状态:', key, '从"已创建"改为"已创建"');
            }
            
            // 只有状态为"已创建"或内容不为空的数据才加载
            if (item.status === "已创建" || (item.content && item.content.trim() !== "")) {
              notesData[key] = item;
              console.log('加载笔记:', key, '状态:', item.status, '内容长度:', item.content ? item.content.length : 0);
            } else {
              console.warn('跳过不完整的笔记:', key, '状态:', item.status, '内容:', item.content ? '有内容' : '无内容');
            }
          } else {
            console.warn('跳过无效笔记数据:', key, '类型:', typeof item, 'frontendName:', item ? item.frontendName : 'null', 'content:', item ? (item.content ? '有内容' : '无内容') : 'null');
          }
        } 
        // 检查表格数据
        else if (key.startsWith('tense_table_') || key.startsWith('voice_table_') || key.startsWith('noun_table_') || key.startsWith('pronoun_table_') || key.startsWith('preposition_table_') || key.startsWith('comparative_table_') || key.startsWith('superlative_table_') || key.startsWith('participle_table_') || key.startsWith('adverb_table_') || key.startsWith('article_table_')) {
          // 检查表格数据完整性和有效性
          if (item && typeof item === 'object' && item.frontendName && item.content) {
            // 如果状态为"已创建"，但内容不为空，则强制设置为"已创建"
            if (item.status === "已创建" && item.content && item.content.trim() !== "") {
              item.status = "已创建";
              console.log('自动修复表格状态:', key, '从"已创建"改为"已创建"');
            }
            
            // 只有状态为"已创建"或内容不为空的数据才加载
            if (item.status === "已创建" || (item.content && item.content.trim() !== "")) {
              tablesData[key] = item;
              console.log('加载表格:', key, '状态:', item.status, '内容长度:', item.content ? item.content.length : 0);
            } else {
              console.warn('跳过不完整的表格:', key, '状态:', item.status, '内容:', item.content ? '有内容' : '无内容');
            }
          } else {
            console.warn('跳过无效表格数据:', key, '类型:', typeof item, 'frontendName:', item ? item.frontendName : 'null', 'content:', item ? (item.content ? '有内容' : '无内容') : 'null');
          }
        }
        // 其他类型的数据（如题目数组）直接跳过，不输出警告
      });
      
      this.setData({
        notesData,
        tablesData
      });
      
      console.log('笔记和表格数据加载完成:', {
        notesCount: Object.keys(notesData).length,
        tablesCount: Object.keys(tablesData).length,
        notesKeys: Object.keys(notesData),
        tablesKeys: Object.keys(tablesData)
      });
      
      // 特别检查noun_note_003
      if (notesData['noun_note_003']) {
        console.log('noun_note_003 详细信息:', {
          type: typeof notesData['noun_note_003'],
          status: notesData['noun_note_003'].status,
          content: notesData['noun_note_003'].content ? '有内容' : '无内容',
          contentLength: notesData['noun_note_003'].content ? notesData['noun_note_003'].content.length : 0
        });
      } else {
        console.warn('未找到 noun_note_003');
      }
    } catch (error) {
      console.error('加载笔记和表格数据失败:', error);
    }
  },

  // 初始化表格练习
  initTableExercise(tables) {
    const tableIds = tables.split(',');
    let dataSource = null;
    
    // 处理混合类型的情况
    if (this.dataSourceType === 'mixed') {
      // 对于混合类型，我们需要根据每个表格ID来确定其数据源
      // 这里我们将使用一个统一的数据源对象来存储所有表格数据
      const pronounData = require('../../data/writing_pronouns.js');
      const nounData = require('../../data/writing_nouns.js');
      const tenseData = require('../../data/writing_tenses.js');
      const voiceData = require('../../data/writing_voices.js');
      const comparisonData = require('../../data/writing_comparisons.js');
      const adverbData = require('../../data/writing_adverbs.js');
      
      // 合并所有数据源，避免属性冲突
      dataSource = {
        // 代词数据
        ...pronounData,
        // 名词和动词数据
        ...nounData,
        // 时态数据
        ...tenseData,
        // 语态数据
        ...voiceData,
        // 比较级数据
        ...comparisonData,
        // 副词数据
        ...adverbData,
        // 合并所有questions数组
        questions: [
          ...(pronounData.questions || []),
          ...(nounData.questions || []),
          ...(tenseData.questions || []),
          ...(voiceData.questions || []),
          ...(comparisonData.questions || []),
          ...(adverbData.questions || [])
        ]
      };
    } else if (this.dataSourceType === 'noun') {
      dataSource = require('../../data/writing_nouns.js');
    } else if (this.dataSourceType === 'pronoun') {
      dataSource = require('../../data/writing_pronouns.js');
    } else if (this.dataSourceType === 'verb') {
      dataSource = require('../../data/writing_nouns.js'); // 动词数据也在这个文件中
    } else if (this.dataSourceType === 'tense') {
      dataSource = require('../../data/writing_tenses.js');
    } else if (this.dataSourceType === 'voice') {
      dataSource = require('../../data/writing_voices.js');
    } else if (this.dataSourceType === 'comparison') {
      dataSource = require('../../data/writing_comparisons.js');
    } else if (this.dataSourceType === 'adverb') {
      dataSource = require('../../data/writing_adverbs.js');
    }
    // 获取表格数据
    const tableData = {};
    const correctAnswers = {};
    const tableAnswers = {}; // 初始化tableAnswers
    const showCorrect = {}; // 初始化showCorrect

    tableIds.forEach(tableId => {
      let tableDataSource = null;
      
      // 统一数据访问方式 - 根据数据源类型处理
      if (dataSource) {
        if (this.dataSourceType === 'mixed') {
          // 混合类型需要从所有数据源中查找对应的表格数据
          // 首先尝试直接访问
          if (dataSource[tableId]) {
            tableDataSource = dataSource[tableId];
          } else {
            // 如果直接访问失败，尝试从questions数组中过滤
            const allQuestions = [];
            // 收集所有数据源中的questions数组
            if (dataSource.questions) {
              allQuestions.push(...dataSource.questions);
            }
            // 查找对应table_id的数据
            tableDataSource = allQuestions.filter(item => item.table_id === tableId);
            
            // 如果还是没有找到，尝试从各个独立的数据源中查找
            if (!tableDataSource || tableDataSource.length === 0) {
              const pronounData = require('../../data/writing_pronouns.js');
              const nounData = require('../../data/writing_nouns.js');
              const tenseData = require('../../data/writing_tenses.js');
              const voiceData = require('../../data/writing_voices.js');
              const comparisonData = require('../../data/writing_comparisons.js');
              const adverbData = require('../../data/writing_adverbs.js');
              
              // 依次检查每个数据源
              if (pronounData[tableId]) {
                tableDataSource = pronounData[tableId];
              } else if (nounData[tableId]) {
                tableDataSource = nounData[tableId];
              } else if (tenseData[tableId]) {
                tableDataSource = tenseData[tableId];
              } else if (voiceData[tableId]) {
                tableDataSource = voiceData[tableId];
              } else if (comparisonData[tableId]) {
                tableDataSource = comparisonData[tableId];
              } else if (adverbData[tableId]) {
                tableDataSource = adverbData[tableId];
              } else {
                // 最后尝试从各个数据源的questions数组中查找
                const allDataSources = [pronounData, nounData, tenseData, voiceData, comparisonData, adverbData];
                for (const source of allDataSources) {
                  if (source.questions) {
                    const found = source.questions.filter(item => item.table_id === tableId);
                    if (found.length > 0) {
                      tableDataSource = found;
                      break;
                    }
                  }
                }
              }
            }
          }
        } else if (this.dataSourceType === 'adverb') {
          // 副词数据从questions数组中过滤出对应table_id的数据
          tableDataSource = dataSource.questions.filter(item => item.table_id === tableId);
        } else if (dataSource[tableId]) {
          // 其他数据源直接访问属性
          tableDataSource = dataSource[tableId];
        }
      }
      
      if (tableDataSource && Array.isArray(tableDataSource)) {
        tableData[tableId] = tableDataSource;
        // 初始化答案
        const answers = {};
        const correct = {};
        const showCorrectForTable = {};
        tableDataSource.forEach(cell => {
          if (!cell.is_header) {
            answers[cell.cell_id] = '';
            correct[cell.cell_id] = cell.correctAnswer || cell.answer;
            showCorrectForTable[cell.cell_id] = null;
          }
        });
        tableAnswers[tableId] = answers;
        correctAnswers[tableId] = correct;
        showCorrect[tableId] = showCorrectForTable;
      }
    });

    // 设置语态表格的规则数据
    const questionsData = {};
    if (dataSource && dataSource.questions) {
      dataSource.questions.forEach(question => {
        if (question.table_id && question.rules) {
          questionsData[question.table_id] = question;
        }
      });
    }

    this.setData({
      exerciseType: 'writing',
      tableData,
      correctAnswers,
      tableAnswers,
      showCorrect,
      questionsData
    });

    // 生成 noun_001_rows 用于渲染
    if (tableData['noun_001']) {
      const rows = [];
      const cells = tableData['noun_001'];
      for (let i = 0; i < cells.length; i += 2) {
        rows.push({
          left: cells[i].question,
          cell_id: cells[i+1].cell_id
        });
      }
      this.setData({
        ['tableData.noun_001_rows']: rows
      });
    }

    console.log('=== 数据加载调试信息 ===');
    console.log('dataSourceType:', this.dataSourceType);
    console.log('tableIds:', tableIds);
    console.log('dataSource keys:', dataSource ? Object.keys(dataSource) : 'null');
    console.log('tableData keys:', Object.keys(tableData));
    console.log('tableAnswers keys:', Object.keys(tableAnswers));
    
    // 详细检查每个表格的数据
    tableIds.forEach(tableId => {
      console.log(`表格 ${tableId}:`, {
        exists: !!tableData[tableId],
        length: tableData[tableId] ? tableData[tableId].length : 0,
        firstCell: tableData[tableId] ? tableData[tableId][0] : null
      });
    });

    // 添加setData后的验证
    console.log('=== setData后验证 ===');
    console.log('this.data.exerciseType:', this.data.exerciseType);
    console.log('this.data.tableData keys:', this.data.tableData ? Object.keys(this.data.tableData) : 'null');
    console.log('this.data.tableAnswers keys:', this.data.tableAnswers ? Object.keys(this.data.tableAnswers) : 'null');
    
    // 检查第一个表格的具体数据
    const firstTableId = tableIds[0];
    if (firstTableId) {
      console.log(`第一个表格 ${firstTableId} 的数据:`, {
        inTableData: !!this.data.tableData[firstTableId],
        dataLength: this.data.tableData[firstTableId] ? this.data.tableData[firstTableId].length : 0,
        sampleData: this.data.tableData[firstTableId] ? this.data.tableData[firstTableId].slice(0, 3) : null
      });
    }

    if (tableData['noun_004']) {
      this.setData({
        noun004ShowFullRule: [false, false, false, false, false],
        noun004InputStatus: {}
      });
    }

    if (tableData['present_participle_001']) {
      this.setData({
        presentParticipleShowFullRule: [false, false, false, false, false],
        presentParticipleInputStatus: {}
      });
    }

    if (tableData['past_participle_001']) {
      this.setData({
        pastParticipleShowFullRule: [false, false, false, false, false],
        pastParticipleInputStatus: {}
      });
    }
    
    if (tableData['tense_writing_001']) {
      this.setData({
        tenseWritingShowFullRule: [false, false, false, false, false, false, false, false],
        tenseWritingInputStatus: {}
      });
    }

    if (tableData['adverb_writing_001']) {
      this.setData({
        adverbShowFullRule: [false, false, false, false, false, false],
        adverbInputStatus: {}
      });
    }
  },

  // 从云数据库获取题目
  async getQuestionsFromCloud(categories = [], count = 10) {
    try {
      console.log('从云数据库获取题目，分类：', categories, '数量：', count);
      
      // 检查云开发是否可用
      if (!wx.cloud || !wx.cloud.database) {
        console.log('云开发不可用，使用本地数据');
        return this.getLocalQuestions(categories, count);
      }
      
      let query = wx.cloud.database().collection('questions');
      
      // 如果指定了分类，则按分类查询
      if (categories && categories.length > 0) {
        query = query.where({
          category: wx.cloud.database().command.in(categories)
        });
      }
      
      const result = await query.get();
      console.log('✅ 云数据库查询成功，获得', result.data.length, '条数据');
      
      if (result.data && result.data.length > 0) {
        // 显示前3条数据的analysis字段状态
        console.log('前3条数据的analysis字段：', result.data.slice(0, 3).map(doc => ({
          text: doc.text,
          hasAnalysis: !!doc.analysis,
          hasExplanation: !!doc.explanation,
          analysis: doc.analysis ? doc.analysis.substring(0, 50) + '...' : '无',
          explanation: doc.explanation ? doc.explanation.substring(0, 50) + '...' : '无'
        })));
      
        // 扁平化题目数据 - 每个文档包含一个题目
        let allQuestions = result.data.map(doc => {
          // 处理 analysis 字段：优先使用 analysis，如果没有则使用 explanation
          let analysis = doc.analysis || doc.explanation || '';
          
          // 如果是 explanation 字段且以 "analysis:" 开头，则去掉这个前缀
          if (analysis && analysis.startsWith('analysis:')) {
            analysis = analysis.substring(9).trim(); // 去掉 "analysis:" 前缀
          }
          
          return {
            text: doc.text,
            answer: doc.answer,
            analysis: analysis,
            category: doc.category
          };
        });
        
        // 随机打乱并取指定数量
        allQuestions = this.shuffleArray(allQuestions);
        allQuestions = allQuestions.slice(0, count);
        
        console.log('处理后的题目：', allQuestions);
        return allQuestions;
      } else {
        console.log('云数据库中没有找到题目，使用本地数据');
        return this.getLocalQuestions(categories, count);
      }
    } catch (error) {
      console.error('从云数据库获取题目失败：', error);
      console.log('降级使用本地数据');
      return this.getLocalQuestions(categories, count);
    }
  },

  // 获取本地题目数据(降级方案)
  async getLocalQuestions(categories = [], count = 10) {
    let questionsData;
    try {
      // 统一使用云数据库加载题目
      questionsData = await cloudDataLoader.loadIntermediateQuestions();
    } catch (error) {
      console.error('加载题目数据失败:', error);
      return [];
    }
    
    let allQuestions = [];
    if (categories && categories.length > 0) {
      // 根据分类筛选题目
      allQuestions = questionsData.filter(q => categories.includes(q.category));
    } else {
      // 如果没有指定分类，获取所有题目
      allQuestions = questionsData;
    }
    
    // 随机打乱并取指定数量
    allQuestions = this.shuffleArray(allQuestions);
    allQuestions = allQuestions.slice(0, count);
    
    return allQuestions;
  },

  // 初始化语法练习
  async initGrammarExercise(questions, mode, level) {
    wx.showLoading({
      title: '加载题目中...'
    });

    try {
      if (questions) {
        const parsedQuestions = JSON.parse(decodeURIComponent(questions));
        console.log('✅ 使用传入的题目参数:', parsedQuestions);
        
        console.log('🔧 设置数据前的状态检查:', {
          exerciseType: 'grammar',
          questionsLength: parsedQuestions.length,
          questions: parsedQuestions
        });
        
        this.setData({
          exerciseType: 'grammar',
          questions: parsedQuestions,
          answers: new Array(parsedQuestions.length).fill(''),
          mode: mode || 'normal',
          level: level || '中级',
          realTimeMode: true, // 启用实时批改模式
          results: new Array(parsedQuestions.length).fill(null) // 初始化结果数组
        });
        
        console.log('✅ 数据设置完成，当前状态:', {
          exerciseType: this.data.exerciseType,
          questionsLength: this.data.questions ? this.data.questions.length : 0,
          questions: this.data.questions
        });
      } else {
        console.log('🔄 没有传入题目参数，从云数据库获取题目...');
        
        // 从云数据库获取题目
        const cloudQuestions = await this.getQuestionsFromCloud(['综合练习', '介词综合', '名词复数书写综合'], 10);
        
        // 检查题目来源
        const hasAnalysis = cloudQuestions.some(q => q.analysis);
        console.log('📊 题目统计:', {
          总数: cloudQuestions.length,
          有解析: cloudQuestions.filter(q => q.analysis).length,
          无解析: cloudQuestions.filter(q => !q.analysis).length,
          数据来源: hasAnalysis ? '云数据库' : '本地数据(降级)'
        });
        
        // 显示前3题的解析状态
        console.log('📝 前3题解析状态:', cloudQuestions.slice(0, 3).map(q => ({
          题目: q.text.substring(0, 30) + '...',
          有解析: !!q.analysis,
          解析: q.analysis ? q.analysis.substring(0, 50) + '...' : '无'
        })));
        
        console.log('🔧 设置云数据库题目前的状态检查:', {
          exerciseType: 'grammar',
          questionsLength: cloudQuestions.length,
          questions: cloudQuestions
        });
        
        this.setData({ 
          exerciseType: 'grammar',
          questions: cloudQuestions,
          answers: new Array(cloudQuestions.length).fill(''),
          mode: 'normal',
          level: level || '中级',
          realTimeMode: true, // 启用实时批改模式
          results: new Array(cloudQuestions.length).fill(null) // 初始化结果数组
        });
        
        console.log('✅ 云数据库题目设置完成，当前状态:', {
          exerciseType: this.data.exerciseType,
          questionsLength: this.data.questions ? this.data.questions.length : 0,
          questions: this.data.questions
        });
      }
    } catch (error) {
      console.error('❌ 初始化题目失败：', error);
      wx.showToast({
        title: '加载题目失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 新增：初始化自定义语法大类组合练习
  async initCustomCategoryExercise() {
    wx.showLoading({
      title: '加载自定义组合中...'
    });

    try {
      // 从本地存储获取自定义大类组合数据
      const customCategoryData = wx.getStorageSync('customCategoryData');
      
      if (!customCategoryData) {
        throw new Error('未找到自定义大类组合数据');
      }
      
      console.log('📋 自定义大类组合数据:', customCategoryData);
      
      const { selectedCategories, categoryQuestionCounts, totalQuestions } = customCategoryData;
      
      // 按大类分别获取题目，确保均匀分配
      const allQuestions = [];
      
      for (const category of selectedCategories) {
        const questionCount = categoryQuestionCounts[category];
        console.log(`📚 为 ${category} 大类获取 ${questionCount} 道题`);
        
        // 获取该大类下的具体语法点
        const grammarPoints = this.getGrammarPointsByCategory(category);
        console.log(`🎯 ${category} 大类的语法点:`, grammarPoints);
        
        // 从云数据库获取该大类的题目
        const categoryQuestions = await this.getQuestionsFromCloud(grammarPoints, questionCount);
        console.log(`✅ ${category} 大类获取到 ${categoryQuestions.length} 道题`);
        
        // 将题目添加到总题目列表
        allQuestions.push(...categoryQuestions);
      }
      
      console.log('📊 最终题目统计:', {
        总数: allQuestions.length,
        有解析: allQuestions.filter(q => q.analysis).length,
        无解析: allQuestions.filter(q => !q.analysis).length,
        数据来源: '云数据库'
      });
      
      // 打乱题目顺序，避免同类题目集中
      const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
      
      this.setData({ 
        exerciseType: 'grammar',
        questions: shuffledQuestions,
        answers: new Array(shuffledQuestions.length).fill(''),
        mode: 'normal',
        level: '中级',
        realTimeMode: true,
        results: new Array(shuffledQuestions.length).fill(null)
      });
      
      console.log('✅ 自定义大类组合题目设置完成，题目已打乱');
      
    } catch (error) {
      console.error('❌ 初始化自定义大类组合失败：', error);
      wx.showToast({
        title: '加载自定义组合失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 新增：根据分类获取语法点
  getGrammarPointsByCategory(category) {
    const categoryMap = {
      "介词": ["介词综合", "固定搭配", "介词 + 名词/动名词"],
      "代词": ["代词综合", "人称代词", "物主代词", "反身代词", "关系代词", "it相关"],
      "连词": ["并列连词综合", "从属连词综合", "连词与名/动/形/副综合", "连词与名词", "连词与动词", "连词与形容词"],
      "冠词": ["冠词综合", "泛指与特指", "a和an", "the的特殊用法"],
      "名词": ["名词综合", "复合词和外来词", "单复数同形", "不规则复数", "以o结尾", "以y结尾", "s/sh/ch/x结尾", "以f/fe结尾"],
      "动词": ["被动写be吗", "并列句与动词", "主从句与动词", "插入语与动词"],
      "谓语": ["谓语", "时态(一般过去时)", "时态(一般将来时)", "时态(过去将来时)", "时态(现在进行时)", "时态(过去进行时)", "时态(现在完成时)", "时态(过去完成时)", "语态(被动+八大时态)"],
      "非谓语": ["现在分词综合", "过去分词综合", "不定式综合"],
      "形容词": ["形容词综合", "比较级", "最高级"],
      "副词": ["副词综合", "副词修饰动词", "副词修饰句子", "副词修饰形容词/副词"],
      "定语从句": ["定语从句综合", "that能填吗", "who和which选哪个", "whose", "which和when/where混淆"],
      "状语和从句": ["状语从句综合", "when", "where", "how", "why"]
    };
    
    return categoryMap[category] || [];
  },

  // 工具函数：去除前后短横线并小写
  normalizeSuffix(str) {
    return (str || '').replace(/^-+/, '').replace(/-+$/, '').toLowerCase();
  },

  // 检查答案是否正确(支持多答案格式和变体)
  checkAnswer(userAnswer, correctAnswer) {
    if (!userAnswer || !correctAnswer) return false;
    
    const userInput = userAnswer.trim().toLowerCase();
    const correct = correctAnswer.trim().toLowerCase();
    
    console.log(`[答案判定] 用户答案: "${userAnswer}" -> "${userInput}"`);
    console.log(`[答案判定] 正确答案: "${correctAnswer}" -> "${correct}"`);
    
    // 支持多答案格式，如 "which / that"
    if (correct.includes(' / ')) {
      // 多答案格式，检查用户答案是否匹配其中任一答案
      const correctAnswers = correct.split(' / ').map(ans => ans.trim());
      console.log(`[答案判定] 多答案格式，正确答案列表: [${correctAnswers.join(', ')}]`);
      
      // 检查每个答案的变体
      for (const answer of correctAnswers) {
        if (this.checkAnswerVariant(userInput, answer)) {
          console.log(`[答案判定] 匹配变体答案: "${answer}"`);
          return true;
        }
      }
      return false;
    } else {
      // 单答案格式，检查变体
      const result = this.checkAnswerVariant(userInput, correct);
      console.log(`[答案判定] 单答案格式，结果: ${result}`);
      return result;
    }
  },

  // 检查答案变体（支持大小写、缩写、短横线等）
  checkAnswerVariant(userInput, correctAnswer) {
    const user = userInput.trim().toLowerCase();
    const correct = correctAnswer.trim().toLowerCase();
    
    // 直接匹配
    if (user === correct) {
      return true;
    }
    
    // 处理大小写变体
    if (user === correct.toLowerCase() || user === correct.toUpperCase()) {
      return true;
    }
    
    // 处理短横线变体（有无短横线都算正确）
    const userWithoutDash = user.replace(/-/g, '');
    const correctWithoutDash = correct.replace(/-/g, '');
    if (userWithoutDash === correctWithoutDash) {
      return true;
    }
    
    // 处理缩写变体（如 -s 和 s 都算正确）
    if (correct.startsWith('-') && user === correct.substring(1)) {
      return true;
    }
    if (user.startsWith('-') && correct === user.substring(1)) {
      return true;
    }
    
    // 处理后缀匹配（用户可能只输入后缀）
    if (correct.startsWith('-') && user === correct) {
      return true;
    }
    
    // 处理前缀匹配（用户可能只输入前缀）
    if (correct.endsWith('-') && user === correct) {
      return true;
    }
    
    // 处理空格变体
    const userWithoutSpace = user.replace(/\s+/g, '');
    const correctWithoutSpace = correct.replace(/\s+/g, '');
    if (userWithoutSpace === correctWithoutSpace) {
      return true;
    }
    
    // 新增：处理前缀后缀核心部分匹配
    if (this.checkPrefixSuffixMatch(user, correct)) {
      return true;
    }
    
    return false;
  },

  // 检查前缀后缀核心部分匹配
  checkPrefixSuffixMatch(user, correct) {
    // 去除所有短横线，只比较核心部分
    const userCore = user.replace(/-/g, '');
    const correctCore = correct.replace(/-/g, '');
    
    // 核心部分完全匹配
    if (userCore === correctCore) {
      return true;
    }
    
    // 处理特殊的前缀后缀变体
    const prefixSuffixVariants = {
      'ful': ['-ful', 'ful'],
      'ble': ['-ble', 'ble', 'ible', '-ible'],
      'ness': ['-ness', 'ness'],
      'ment': ['-ment', 'ment'],
      'er': ['-er', 'er'],
      'or': ['-or', 'or'],
      'th': ['-th', 'th'],
      'ion': ['-ion', 'ion'],
      'un': ['un-', 'un'],
      'im': ['im-', 'im'],
      'il': ['il-', 'il'],
      'ir': ['ir-', 'ir'],
      'in': ['in-', 'in']
    };
    
    // 检查用户答案是否在变体列表中
    for (const [core, variants] of Object.entries(prefixSuffixVariants)) {
      if (variants.includes(user) && variants.includes(correct)) {
        return true;
      }
    }
    
    return false;
  },



  // 点击选择处理(用于noun_002)
  onChoiceSelect(e) {
    const { tableId, cellId, option, word } = e.currentTarget.dataset;
    
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) {
      tableAnswers[tableId] = {};
    }
    tableAnswers[tableId][cellId] = option;
    
    // 检查答案是否正确或错误
    const showCorrect = { ...this.data.showCorrect };
    if (!showCorrect[tableId]) {
      showCorrect[tableId] = {};
    }
    const correctAnswer = this.data.correctAnswers[tableId][cellId];
    
    // 验证选择的单词是否正确
    const isCorrect = this.checkAnswer(word, correctAnswer);
    showCorrect[tableId][cellId] = isCorrect;

    // 新增：更新书写题统计
    this.updateWritingStatsFromTable(tableId, cellId, isCorrect);

    // 计算当前行号
    let rowStatus = this.data.rowStatus || {};
    if (tableId === 'noun_002') {
      const cellIdx = Object.keys(this.data.tableAnswers[tableId]).indexOf(cellId);
      const allCells = this.data.tableData[tableId];
      // 通过cell_id解析行号
      const rowIdx = parseInt(cellId.split('_')[1]) ? Math.floor((parseInt(cellId.split('_')[1])-1)/4) : 0;
      // 找到该行的4个cell_id
      const rowCellIds = allCells.slice(rowIdx*4, rowIdx*4+4).map(cell => cell.cell_id);
      // 判断本行是否有选中且是否正确
      let found = false;
      for (let i = 0; i < 4; i++) {
        const cid = rowCellIds[i];
        if (tableAnswers[tableId][cid]) {
          found = true;
          if (showCorrect[tableId][cid] === true) {
            rowStatus[rowIdx] = 'correct';
            break;
          } else if (showCorrect[tableId][cid] === false) {
            rowStatus[rowIdx] = 'wrong';
          }
        }
      }
      if (!found) rowStatus[rowIdx] = 'wrong';
    }
    
    this.setData({
      tableAnswers,
      showCorrect,
      rowStatus
    });
  },

  // 提交表格答案
  submitTableAnswers() {
    const tableAnswers = this.data.tableAnswers;
    const correctAnswers = this.data.correctAnswers;
    const showCorrect = { ...this.data.showCorrect };
    let rowStatus = {};
    
    // 检查所有表格的所有答案
    Object.keys(tableAnswers).forEach(tableId => {
      Object.keys(tableAnswers[tableId]).forEach(cellId => {
        const userAnswer = tableAnswers[tableId][cellId];
        const correctAnswer = correctAnswers[tableId][cellId];
        
        if (!userAnswer || userAnswer.trim() === '') {
          showCorrect[tableId][cellId] = null; // 未答
        } else {
          let isCorrect = false;
          
          if (tableId === 'noun_002') {
            // noun_002特殊处理：用户选择的是选项字母，需要转换为对应单词
            const userInput = userAnswer.trim().toUpperCase();
            if (userInput >= 'A' && userInput <= 'D') {
              const optionIndex = userInput.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
              const cellIndex = parseInt(cellId.split('_')[1]) - 1; // 获取行号
              const rowStartIndex = Math.floor(cellIndex / 4) * 4; // 每行4个选项
              const targetCellIndex = rowStartIndex + optionIndex;
              
              if (this.data.tableData[tableId][targetCellIndex]) {
                const selectedWord = this.data.tableData[tableId][targetCellIndex].question;
                isCorrect = this.checkAnswer(selectedWord, correctAnswer);
              }
            }
          } else {
            // 其他表格的常规验证
            if (correctAnswer) {
              isCorrect = this.checkAnswer(userAnswer, correctAnswer);
            }
          }
          
          showCorrect[tableId][cellId] = isCorrect;
        }
      });
      // 处理noun_002整行高亮
      if (tableId === 'noun_002') {
        const allCells = this.data.tableData[tableId];
        for (let rowIdx = 0; rowIdx < 16; rowIdx++) {
          const rowCellIds = allCells.slice(rowIdx*4, rowIdx*4+4).map(cell => cell.cell_id);
          let found = false;
          for (let i = 0; i < 4; i++) {
            const cid = rowCellIds[i];
            if (tableAnswers[tableId][cid]) {
              found = true;
              if (showCorrect[tableId][cid] === true) {
                rowStatus[rowIdx] = 'correct';
                break;
              } else if (showCorrect[tableId][cid] === false) {
                rowStatus[rowIdx] = 'wrong';
              }
            }
          }
          if (!found) rowStatus[rowIdx] = null;
        }
      }
    });
    
    this.setData({
      showCorrect,
      submitting: true,
      rowStatus
    });
    
    // 计算正确率
    let totalCells = 0;
    let correctCells = 0;
    
    console.log('=== 计算正确率调试 ===');
    console.log('showCorrect对象:', showCorrect);
    
    Object.keys(showCorrect).forEach(tableId => {
      console.log(`处理表格 ${tableId}:`);
      Object.keys(showCorrect[tableId]).forEach(cellId => {
        const cellResult = showCorrect[tableId][cellId];
        console.log(`  单元格 ${cellId}: ${cellResult}`);
        if (cellResult !== null) {
          totalCells++;
          if (cellResult === true) {
            correctCells++;
          }
        }
      });
    });
    
    console.log('计算完成 - 总单元格数:', totalCells, '正确单元格数:', correctCells);
    
    const accuracy = totalCells > 0 ? (correctCells / totalCells * 100).toFixed(1) : 0;
    
    console.log('=== 表格练习统计调试 ===');
    console.log('正确单元格数:', correctCells);
    console.log('总单元格数:', totalCells);
    console.log('正确率:', accuracy);
    
    // 注意：由于实时统计已经在用户输入时完成，这里不再重复统计
    // 只显示统计结果，不重复保存到writingHistory
    console.log('实时统计已完成，跳过重复统计');
    
    // 显示当前统计状态
    const today = this.getTodayDateString();
    const writingHistory = wx.getStorageSync('writingHistory') || [];
    const todayRecord = writingHistory.find(record => record.date === today);
    if (todayRecord) {
      console.log('当前今日书写统计:', todayRecord);
    }
    
    // 延迟设置，模拟批改过程
    setTimeout(() => {
      this.setData({
        submitting: false,
        correctionCompleted: true, // 批改完成，显示双按钮
        hasWrongQuestions: false // 表格练习不产生错题
      });
      
      // 显示批改完成提示
      wx.showToast({
        title: `批改完成！正确率：${accuracy}%`,
        icon: 'success',
        duration: 2000
      });
      
      // 检测解析内容滚动
      this.onCorrectionComplete();
    }, 1500); // 1.5秒后显示批改完成
  },

  generateQuestions() {
    const selectedPoints = this.data.selectedPoints;
    if (selectedPoints.length === 0) {
      wx.showToast({
        title: '请选择至少一个语法点',
        icon: 'none'
      });
      return;
    }

    this.generateQuestionsFromCloud(selectedPoints);
  },

  async generateQuestionsFromCloud(categories) {
    wx.showLoading({
      title: '生成题目中...'
    });

    try {
      const generatedQuestions = await this.getQuestionsFromCloud(categories, 10);
      
      this.setData({
        questions: generatedQuestions,
        answers: new Array(generatedQuestions.length).fill(''),
        results: [],
        submitting: false
      });
    } catch (error) {
      console.error('生成题目失败：', error);
      wx.showToast({
        title: '生成题目失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  useLocalQuestions() {
    // 现在也从云数据库获取题目
    this.generateQuestionsFromCloud(this.data.selectedPoints || ['综合练习']);
  },

  shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  onInput(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    const answers = [...this.data.answers];
    answers[index] = value;
    
    // 更新当前题目索引
    this.setData({ 
      answers,
      currentQuestionIndex: index
    });
    
    // 移除实时批改，改为在失去焦点时批改
    // this.realTimeCheck(index, value);
  },

  // 新增：失去焦点时进行批改
  onInputBlur(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    
    // 只有当用户输入了内容且失去焦点时才进行批改
    if (value && value.trim() !== '') {
      this.realTimeCheck(index, value);
    }
  },

  // 新增：检测解析内容是否需要滚动
  checkAnalysisScroll() {
    // 使用setTimeout确保DOM更新后再检测
    setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.selectAll('.analysis-text').boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          res[0].forEach((rect, index) => {
            if (rect) {
              const analysisText = this.data.results[index]?.analysis || '';
              const needsScroll = analysisText.length > 150; // 超过150字符显示滚动指示器
              
              // 动态添加样式类
              if (needsScroll) {
                console.log(`第${index + 1}题解析需要滚动`);
              }
            }
          });
        }
      });
    }, 100); // 100ms延迟确保DOM更新
  },

  // 新增：在批改完成后调用滚动检测
  onCorrectionComplete() {
    // 延迟执行，确保DOM完全渲染
    setTimeout(() => {
      this.checkAnalysisScroll();
    }, 300);
  },

  // 新增：失去焦点时批改方法
  realTimeCheck(index, value) {
    // 如果用户输入为空，不进行批改
    if (!value || value.trim() === '') {
      return;
    }
    
    const question = this.data.questions[index];
    if (!question) {
      return;
    }
    
    const correctAnswer = question.answer || '';
    const isCorrect = this.checkAnswer(value, correctAnswer);
    
    console.log(`[失去焦点批改] 第${index + 1}题: 用户答案"${value}" vs 正确答案"${correctAnswer}" -> ${isCorrect ? '正确' : '错误'}`);
    
    // 更新结果数组
    const results = [...this.data.results];
    results[index] = {
      correct: isCorrect,
      answer: correctAnswer,
      analysis: question.analysis || question.explanation || ''
    };
    
    this.setData({ results });
    
    // 如果答案错误，进行错题统计
    if (!isCorrect) {
      console.log(`[失去焦点批改] 第${index + 1}题错误，开始统计`);
      
      // 处理 analysis 字段
      let analysis = question.analysis || question.explanation || '';
      if (analysis && analysis.startsWith('analysis:')) {
        analysis = analysis.substring(9).trim();
      }
      
      // 创建错题对象
      const wrongQuestion = {
        question: question.question || question.text || question,
        userAnswer: value,
        correctAnswer: correctAnswer,
        analysis: analysis,
        category: question.category,
        grammarPoint: question.grammarPoint
      };
      
      // 进行错题统计和专项练习触发
      this.handleWrongQuestionWithProgress(wrongQuestion, index);
    } else {
      // 如果答案正确，保存单题练习记录
      console.log(`[失去焦点批改] 第${index + 1}题正确，保存单题练习记录`);
      this.saveSingleQuestionPractice(index, value, correctAnswer, isCorrect);
    }
  },

  submitAnswers() {
    if (this.data.submitting) return;
    
    this.setData({ submitting: true });
    
    const questions = this.data.questions;
    const answers = this.data.answers;
    const results = [];
    let correctCount = 0;
    const wrongQuestions = [];
    
    questions.forEach((question, index) => {
      const userAnswer = answers[index] || '';
      const correctAnswer = question.answer || '';
      
      console.log(`[提交答案] 第${index + 1}题:`);
      console.log(`[提交答案] 题目: ${question.text || question.question}`);
      console.log(`[提交答案] 用户答案: "${userAnswer}"`);
      console.log(`[提交答案] 正确答案: "${correctAnswer}"`);
      
      // 使用统一的答案判定函数
      const isCorrect = this.checkAnswer(userAnswer, correctAnswer);
      
      console.log(`[提交答案] 判定结果: ${isCorrect}`);
      
      if (isCorrect) {
        correctCount++;
      } else {
        // 处理 analysis 字段：优先使用 analysis，如果没有则使用 explanation
        let analysis = question.analysis || question.explanation || '';
        
        // 如果是 explanation 字段且以 "analysis:" 开头，则去掉这个前缀
        if (analysis && analysis.startsWith('analysis:')) {
          analysis = analysis.substring(9).trim(); // 去掉 "analysis:" 前缀
        }
        
        wrongQuestions.push({
          question: question.question || question.text || question,
          userAnswer: answers[index],
          correctAnswer: question.answer,
          analysis: analysis, // 添加解析字段
          category: question.category, // 保存原始分类信息
          grammarPoint: question.grammarPoint // 保存语法点信息
        });

        // 注意：实时批改已经处理了错题统计，这里不再重复处理
        // 只有在非实时批改模式下才需要处理
        if (!this.data.realTimeMode) {
          this.handleWrongQuestionWithProgress(question, index);
        }
      }
      
      // 处理 analysis 字段：优先使用 analysis，如果没有则使用 explanation
      let analysis = question.analysis || question.explanation || '';
      
      // 如果是 explanation 字段且以 "analysis:" 开头，则去掉这个前缀
      if (analysis && analysis.startsWith('analysis:')) {
        analysis = analysis.substring(9).trim(); // 去掉 "analysis:" 前缀
      }
      
      results.push({
        correct: isCorrect,
        answer: question.answer,
        analysis: analysis // 添加解析字段
      });
    });
    
    const accuracy = (correctCount / questions.length * 100).toFixed(1);
    
    // 延迟设置，模拟批改过程
    setTimeout(() => {
      this.setData({
        results,
        wrongQuestions,
        submitting: false,
        correctionCompleted: true, // 批改完成，显示双按钮
        hasWrongQuestions: wrongQuestions.length > 0, // 更新是否有错题的标志
        // 如果有特殊类别，显示引导
        showSpecialGuide: this.data.hasSpecialCategory
      });

      // 保存错题到本地存储
      if (wrongQuestions.length > 0) {
        this.saveWrongQuestions(wrongQuestions);
      }

      // 新增：更新错题正确次数(当用户做对题目时)
      const correctQuestions = questions.filter((question, index) => {
        const userAnswer = answers[index] || '';
        const correctAnswer = question.answer || '';
        return this.checkAnswer(userAnswer, correctAnswer);
      });
      
      if (correctQuestions.length > 0) {
        this.updateWrongQuestionCorrectCount(correctQuestions);
      }

      // 错题特训统计：如果是错题特训模式，更新统计
      console.log('错题特训统计调试:', {
        isWrongQuestionElimination: this.data.isWrongQuestionElimination,
        isWrongQuestionVariant: this.data.isWrongQuestionVariant,
        correctCount,
        totalCount: questions.length
      });
      
      // 检查是否为错题特训模式
      const isWrongQuestionMode = this.data.isWrongQuestionElimination || this.data.isWrongQuestionVariant;
      
      if (isWrongQuestionMode) {
        console.log('开始更新错题特训统计...');
        this.updateWrongQuestionStats(correctCount, questions.length);
      } else {
        console.log('不是错题特训模式，跳过统计更新');
        
        // 临时修复：检查页面标题或模式，如果是错题相关，强制更新统计
        const pageTitle = this.data.level || '';
        const isWrongQuestionByTitle = pageTitle.includes('错题') || pageTitle.includes('特训');
        
        if (isWrongQuestionByTitle && correctCount > 0) {
          console.log('检测到错题相关标题，强制更新错题特训统计...');
          this.updateWrongQuestionStats(correctCount, questions.length);
        }
      }

      // 保存练习记录（错题特训模式下不保存到语法题统计）
      if (!isWrongQuestionMode) {
        console.log('准备调用savePracticeHistory，参数:', {
          total: questions.length,
          correct: correctCount,
          score: Math.round(accuracy),
          date: this.getTodayDateString(),
          title: this.data.level ? `${this.data.level}练习` : '语法练习'
        });
        
        this.savePracticeHistory({
          total: questions.length,
          correct: correctCount,
          score: Math.round(accuracy),
          date: this.getTodayDateString(),
          title: this.data.level ? `${this.data.level}练习` : '语法练习'
        });

        // 新增：同步语法功能大厅数据
        this.syncGrammarHallData(correctCount, questions.length, accuracy, questions);
        
        // 新增：更新日常练习实时分
        this.updateDailyPracticeScore('grammar', parseFloat(accuracy), questions);
        
        // 新增：动态更新能力等级
        this.updateAbilityLevelDynamic('grammar');
        
      } else {
        console.log('错题特训模式，跳过保存练习记录到语法题统计');
        
        // 新增：同步错题特训数据
        this.syncErrorQuestionData(wrongQuestions, parseFloat(accuracy));
      }
      
      // 显示批改完成提示
      wx.showToast({
        title: `批改完成！正确率：${accuracy}%`,
        icon: 'success',
        duration: 2000
      });
      
      // 检测解析内容滚动
      this.onCorrectionComplete();
    }, 1500); // 1.5秒后显示批改完成
  },

  // 跳转到书写规范页面
  navigateToWritingRules() {
    wx.switchTab({
      url: '/pages/grammar-writing/index'
    });
  },



  // 显示提示选项
  showHintOptions() {
    console.log('showHintOptions called');
    
    // 根据当前表格类型提供不同的提示选项
    const tableIds = Object.keys(this.data.tableData);
    console.log('Current tableIds:', tableIds);
    
    let hintOptions = [];
    
    if (tableIds.length > 0) {
      const firstTableId = tableIds[0];
      console.log('Processing hints for tableId:', firstTableId);
      
      if (firstTableId.startsWith('pronoun_')) {
        // 代词表格 - 使用writing_pronouns.js中的hints键名
        const writingPronouns = require('../../data/writing_pronouns.js');
        hintOptions = Object.keys(writingPronouns.hints);
        console.log('Pronoun hint options:', hintOptions);
      } else if (firstTableId.startsWith('noun_')) {
        // 名词表格
        const writingNouns = require('../../data/writing_nouns.js');
        hintOptions = Object.keys(writingNouns.hints);
      } else if (firstTableId.includes('present_participle')) {
        hintOptions = ["现在分词构成规则"];
      } else if (firstTableId.includes('past_participle')) {
        hintOptions = ["过去分词构成规则"];
      } else if (firstTableId.includes('comparison')) {
        if (firstTableId.includes('comparative')) {
          hintOptions = ["比较级构成规则"];
        } else if (firstTableId.includes('superlative')) {
          hintOptions = ["最高级构成规则"];
        } else {
          hintOptions = ["比较级构成规则", "最高级构成规则"];
        }
      } else if (firstTableId.includes('adverb')) {
        hintOptions = ["副词构成规则"];
      } else {
        // 通用选项
        hintOptions = ["语法规则提示", "练习技巧", "常见错误"];
      }
    } else {
      // 没有表格数据时的默认选项
      hintOptions = ["语法规则提示", "练习技巧", "常见错误"];
    }
    
    console.log('Final hintOptions:', hintOptions);
    
    this.setData({
      showHintModal: true,
      hintOptions: hintOptions
    });
  },

  // 关闭提示选项弹窗
  closeHintModal() {
    this.setData({
      showHintModal: false
    });
  },

  // 选择提示类型
  selectHintType(e) {
    const hintType = e.currentTarget.dataset.type;
    console.log('selectHintType called with:', hintType);
    
    let hintContent = "";
    
    // 根据当前表格类型显示不同的提示
    const tableIds = Object.keys(this.data.tableData);
    console.log('Current tableIds:', tableIds);
    
    if (tableIds.length > 0) {
      const firstTableId = tableIds[0];
      console.log('Processing hints for tableId:', firstTableId);
      
      if (firstTableId.startsWith('pronoun_')) {
        // 代词表格 - 使用writing_pronouns.js中的hints数据
        const writingPronouns = require('../../data/writing_pronouns.js');
        console.log('Pronoun hints available:', Object.keys(writingPronouns.hints));
        hintContent = writingPronouns.hints[hintType];
        
        if (!hintContent) {
          console.log('未找到提示内容，hintType:', hintType);
          hintContent = "暂无此类型的提示";
        }
      } else if (firstTableId.startsWith('noun_')) {
        // 名词后缀表格
        const writingNouns = require('../../data/writing_nouns.js');
        hintContent = writingNouns.hints[hintType] || "暂无此类型的提示";
      } else if (hintType === "现在分词构成规则") {
        // 现在分词规则
        hintContent = "现在分词构成规则：\n1. 一般动词直接加-ing\n2. 以不发音的e结尾，去e加-ing\n3. 以重读闭音节结尾，双写最后一个辅音字母再加-ing\n4. 以ie结尾，变ie为y再加-ing";
      } else if (hintType === "过去分词构成规则") {
        // 过去分词规则
        hintContent = "过去分词构成规则：\n1. 规则动词加-ed\n2. 以e结尾只加-d\n3. 以辅音字母+y结尾，变y为i再加-ed\n4. 重读闭音节双写最后辅音字母再加-ed\n5. 不规则动词需要记忆";
      } else if (hintType === "比较级构成规则" || hintType === "最高级构成规则") {
        // 比较级最高级规则
        const type = hintType.includes("比较级") ? "比较级" : "最高级";
        const suffix = hintType.includes("比较级") ? "-er" : "-est";
        hintContent = `${type}构成规则：\n1. 单音节形容词直接加${suffix}\n2. 以e结尾只加-r或-st\n3. 以辅音字母+y结尾，变y为i再加${suffix}\n4. 重读闭音节双写最后辅音字母再加${suffix}\n5. 多音节用more/most`;
      } else if (hintType === "副词构成规则") {
        // 副词构成规则
        hintContent = "副词构成规则：\n1. 大多数形容词直接加-ly\n2. 以y结尾的形容词，变y为i再加-ly\n3. 以le结尾的形容词，去e加-y\n4. 部分形容词与副词同形\n5. 特殊变化需要记忆";
      } else {
        // 通用提示
        hintContent = "请查看对应的学习资料或联系老师获取更多帮助。";
      }
    } else {
      hintContent = "暂无提示内容";
    }
    
    console.log('Final hintContent:', hintContent);
    
    this.setData({
      showHintModal: false,
      showHintContentModal: true,
      hintContent: hintContent
    });
  },

  // 关闭提示内容弹窗
  closeHintContentModal() {
    this.setData({
      showHintContentModal: false
    });
  },

  // 保存错题到本地存储(新增自动移除逻辑)
  saveWrongQuestions(wrongQuestions) {
    try {
      const existingWrongQuestions = wx.getStorageSync('wrongQuestions') || [];
      const removedWrongQuestions = wx.getStorageSync('removedWrongQuestions') || [];
      
      // 为每个错题添加时间戳和分类信息
      const newWrongQuestions = wrongQuestions.map(wrongQ => {
        // 正确提取题目内容
        let questionText = '';
        if (typeof wrongQ.question === 'string') {
          questionText = wrongQ.question;
        } else if (typeof wrongQ.question === 'object' && wrongQ.question) {
          questionText = wrongQ.question.question || wrongQ.question.text || JSON.stringify(wrongQ.question);
        } else {
          questionText = '未知题目';
        }
        
        // 创建包含答案信息的题目对象用于分类
        const questionWithAnswer = {
          question: questionText,
          answer: wrongQ.correctAnswer,
          userAnswer: wrongQ.userAnswer,
          tag: wrongQ.tag || wrongQ.category, // 优先使用tag，否则使用category
          category: wrongQ.category // 临时保留用于映射
        };
        
        return {
          id: Date.now() + Math.random(),
          question: questionText,
          userAnswer: wrongQ.userAnswer,
          correctAnswer: wrongQ.correctAnswer,
          analysis: wrongQ.analysis || '', // 新增：解析信息
          tag: wrongQ.tag || wrongQ.category, // 保存原始分类
          category: this.getCategoryFromQuestion(questionWithAnswer), // 使用映射后的分类
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString(),
          correctCount: 0, // 新增：正确次数计数
          errorCount: 1 // 新增：错误次数计数
        };
      });
      
      // 检查是否有重复错题，更新计数
      const updatedWrongQuestions = [];
      const questionsToRemove = [];
      
      // 处理现有错题
      existingWrongQuestions.forEach(existingQ => {
        const isDuplicate = newWrongQuestions.some(newQ => 
          newQ.question === existingQ.question && newQ.correctAnswer === existingQ.correctAnswer
        );
        
        if (isDuplicate) {
          // 找到重复的错题，增加错误计数
          const duplicateNewQ = newWrongQuestions.find(newQ => 
            newQ.question === existingQ.question && newQ.correctAnswer === existingQ.correctAnswer
          );
          
          const updatedQ = {
            ...existingQ,
            errorCount: (existingQ.errorCount || 0) + 1,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
          };
          
          updatedWrongQuestions.push(updatedQ);
          
          // 从新错题列表中移除重复项
          const newQIndex = newWrongQuestions.findIndex(newQ => 
            newQ.question === existingQ.question && newQ.correctAnswer === existingQ.correctAnswer
          );
          if (newQIndex !== -1) {
            newWrongQuestions.splice(newQIndex, 1);
          }
        } else {
          updatedWrongQuestions.push(existingQ);
        }
      });
      
      // 添加新的错题
      updatedWrongQuestions.push(...newWrongQuestions);
      
      // 检查自动移除条件
      const autoRemoveConfig = wx.getStorageSync('autoRemoveConfig') || { enabled: true, correctCount: 3 };
      
      if (autoRemoveConfig.enabled) {
        updatedWrongQuestions.forEach((question, index) => {
          if (question.correctCount >= autoRemoveConfig.correctCount) {
            // 达到移除条件，移动到已移除列表
            const removedQuestion = {
              ...question,
              removedReason: {
                correctCount: question.correctCount,
                autoRemove: true
              },
              removedDate: new Date().toLocaleDateString()
            };
            
            questionsToRemove.push(index);
            removedWrongQuestions.push(removedQuestion);
          }
        });
        
        // 从错题本中移除达到条件的错题
        questionsToRemove.reverse().forEach(index => {
          updatedWrongQuestions.splice(index, 1);
        });
      }
      
      // 限制错题总数，避免存储过多(最多保留500题)
      const limitedWrongQuestions = updatedWrongQuestions.slice(-500);
      
      wx.setStorageSync('wrongQuestions', limitedWrongQuestions);
      wx.setStorageSync('removedWrongQuestions', removedWrongQuestions);
      
      console.log('错题已保存:', newWrongQuestions.length, '题');
      if (questionsToRemove.length > 0) {
        console.log('自动移除错题:', questionsToRemove.length, '题');
      }
    } catch (error) {
      console.error('保存错题失败:', error);
    }
  },

  // 获取统一格式的今日日期
  getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  },

  // 保存单题练习记录
  saveSingleQuestionPractice(index, userAnswer, correctAnswer, isCorrect) {
    try {
      console.log('保存单题练习记录:', { index, userAnswer, correctAnswer, isCorrect });
      
      // 检查是否为错题特训模式
      const isWrongQuestionMode = this.data.isWrongQuestionElimination || this.data.isWrongQuestionVariant;
      
      if (isWrongQuestionMode) {
        console.log('错题特训模式，跳过保存单题练习记录到语法题统计');
        console.log('错题特训模式单题练习详情:', { isCorrect, index, userAnswer, correctAnswer });
        
        // 错题特训模式下，更新错题特训统计
        if (isCorrect) {
          console.log('错题特训模式单题正确，更新错题特训统计...');
          this.updateWrongQuestionStats(1, 1);
        } else {
          console.log('错题特训模式单题错误，不更新统计');
        }
        
        return;
      }
      
      const today = this.getTodayDateString();
      const practiceHistory = wx.getStorageSync('practiceHistory') || [];
      
      // 查找今日记录
      let todayRecord = practiceHistory.find(record => record.date === today);
      if (!todayRecord) {
        todayRecord = {
          date: today,
          total: 0,
          correct: 0,
          score: 0,
          title: this.data.level ? `${this.data.level}练习` : '语法练习'
        };
        practiceHistory.push(todayRecord);
      }
      
      // 更新统计
      todayRecord.total += 1;
      if (isCorrect) {
        todayRecord.correct += 1;
      }
      todayRecord.score = Math.round((todayRecord.correct / todayRecord.total) * 100);
      
      // 保存更新
      wx.setStorageSync('practiceHistory', practiceHistory);
      console.log('单题练习记录已保存:', todayRecord);
      
      // 验证保存结果
      const verifyHistory = wx.getStorageSync('practiceHistory') || [];
      const verifyTodayRecord = verifyHistory.find(record => record.date === today);
      console.log('验证单题练习记录保存结果:', verifyTodayRecord);
      
    } catch (error) {
      console.error('保存单题练习记录失败:', error);
    }
  },

  // 保存练习记录
  savePracticeHistory(record) {
    try {
      const existingHistory = wx.getStorageSync('practiceHistory') || [];
      
      const newRecord = {
        id: Date.now(),
        ...record,
        timestamp: new Date().toISOString()
      };
      
      console.log('准备保存练习记录:', newRecord);
      console.log('现有练习历史:', existingHistory);
      
      // 添加新记录
      const allHistory = [...existingHistory, newRecord];
      
      // 限制记录总数(最多保留100条)
      const limitedHistory = allHistory.slice(-100);
      
      wx.setStorageSync('practiceHistory', limitedHistory);
      console.log('练习记录已保存:', newRecord);
      console.log('保存后的完整历史:', limitedHistory);
      
      // 立即验证保存是否成功
      const verifyHistory = wx.getStorageSync('practiceHistory') || [];
      console.log('验证保存结果:', verifyHistory);
    } catch (error) {
      console.error('保存练习记录失败:', error);
    }
  },

  // 新增：更新错题正确次数(当用户做对题目时调用)
  updateWrongQuestionCorrectCount(correctQuestions) {
    try {
      const existingWrongQuestions = wx.getStorageSync('wrongQuestions') || [];
      const removedWrongQuestions = wx.getStorageSync('removedWrongQuestions') || [];
      const autoRemoveConfig = wx.getStorageSync('autoRemoveConfig') || { enabled: true, correctCount: 3 };
      
      const updatedWrongQuestions = [];
      const questionsToRemove = [];
      
      console.log('开始更新错题正确次数:', correctQuestions.length, '道正确题目');
      console.log('错题消灭练习模式:', this.data.isWrongQuestionElimination);
      
      existingWrongQuestions.forEach(question => {
        // 改进题目匹配逻辑
        const isCorrect = correctQuestions.some(correctQ => {
          // 获取题目文本
          const correctQText = correctQ.question || correctQ.text || correctQ;
          const questionText = question.question;
          
          // 获取正确答案
          const correctQAnswer = correctQ.answer || correctQ.correctAnswer;
          const questionAnswer = question.correctAnswer;
          
          console.log('题目匹配比较:', {
            correctQText: correctQText.substring(0, 50),
            questionText: questionText.substring(0, 50),
            correctQAnswer,
            questionAnswer,
            correctQId: correctQ.id,
            questionId: question.id
          });
          
          // 如果有ID字段，优先使用ID匹配(适用于错题消灭练习)
          if (correctQ.id && question.id) {
            const idMatch = correctQ.id === question.id;
            console.log('ID匹配结果:', idMatch);
            return idMatch;
          }
          
          // 否则使用题目文本和答案匹配
          const textMatch = correctQText === questionText && correctQAnswer === questionAnswer;
          console.log('文本匹配结果:', textMatch);
          return textMatch;
        });
        
        if (isCorrect) {
          // 用户做对了这道错题，增加正确次数
          const updatedQuestion = {
            ...question,
            correctCount: (question.correctCount || 0) + 1
          };
          
          console.log(`题目 "${question.question}" 正确次数更新为: ${updatedQuestion.correctCount}`);
          
          // 检查是否达到自动移除条件
          if (autoRemoveConfig.enabled && updatedQuestion.correctCount >= autoRemoveConfig.correctCount) {
            // 达到移除条件，移动到已移除列表
            const removedQuestion = {
              ...updatedQuestion,
              removedReason: {
                correctCount: updatedQuestion.correctCount,
                autoRemove: true
              },
              removedDate: new Date().toLocaleDateString()
            };
            
            questionsToRemove.push(removedQuestion);
            console.log(`题目 "${question.question}" 达到移除条件，正确次数: ${updatedQuestion.correctCount}`);
          } else {
            updatedWrongQuestions.push(updatedQuestion);
          }
        } else {
          updatedWrongQuestions.push(question);
        }
      });
      
      // 更新已移除错题列表
      const updatedRemovedWrongQuestions = [...removedWrongQuestions, ...questionsToRemove];
      
      // 保存更新后的数据
      wx.setStorageSync('wrongQuestions', updatedWrongQuestions);
      wx.setStorageSync('removedWrongQuestions', updatedRemovedWrongQuestions);
      
      if (questionsToRemove.length > 0) {
        console.log('自动移除错题:', questionsToRemove.length, '题');
        wx.showToast({
          title: `${questionsToRemove.length}道错题已自动移除`,
          icon: 'none',
          duration: 2000
        });
      }
      
      // 如果是错题消灭练习，显示特殊提示
      if (this.data.isWrongQuestionElimination) {
        const updatedCount = correctQuestions.length;
        if (updatedCount > 0) {
          setTimeout(() => {
            wx.showModal({
              title: '错题消灭进度',
              content: `本次练习中您做对了${updatedCount}道错题，这些题目的正确次数已更新。\n\n继续练习，达到设定次数后错题将自动移除！`,
              showCancel: false,
              confirmText: '知道了'
            });
          }, 2500);
        }
      }
      
      console.log('错题正确次数更新完成');
      
    } catch (error) {
      console.error('更新错题正确次数失败:', error);
    }
  },

  // 从题目获取分类信息(修复版 - 基于精确答案匹配)
  getCategoryFromQuestion(question) {
    // 优先使用tag进行映射
    if (typeof question === 'object' && question.tag) {
      const categoryMapping = {
        // 介词相关分类
        "介词(1)": "介词", "介词(2)": "介词", "介词(3)": "介词",
        // 代词相关分类
        "代词(1)": "代词", "代词(2)": "代词", "代词(3)": "代词", 
        "代词(4)": "代词", "代词(5)": "代词", "代词(6)": "代词",
        // 连词相关分类
        "连词(1)": "连词", "连词(2)": "连词", "连词(3)": "连词",
        "连词(4)": "连词", "连词(5)": "连词", "连词(6)": "连词",
        "连词与名词": "连词", "连词与动词": "连词", "连词与形容词": "连词",
        "连词与名/动/形/副综合": "连词", "并列连词综合": "连词", "从属连词综合": "连词",
        // 冠词相关分类
        "冠词(1)": "冠词", "冠词(2)": "冠词", "冠词(3)": "冠词", "冠词(4)": "冠词",
        // 名词相关分类
        "名词(1)": "名词", "名词(2)": "名词", "名词(3)": "名词", 
        "名词(4)": "名词", "名词(5)": "名词", "名词(6)": "名词",
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
        "状语和从句(4)": "状语从句", "状语和从句(5)": "状语从句"
      };
      
      return categoryMapping[question.category] || question.category;
    }
    
    // 获取题目文本和答案
    const questionText = typeof question === 'string' ? question : (question.question || '');
    const answer = typeof question === 'object' ? question.answer : '';
    const analysis = typeof question === 'object' ? question.analysis || '' : '';
    const lowerText = questionText.toLowerCase();
    const lowerAnswer = answer.toLowerCase().trim();
    const lowerAnalysis = analysis.toLowerCase();
    
    console.log(`[分类调试] 题目: "${questionText}", 答案: "${answer}"`);
    
    // === 修复：按优先级进行分类判断 ===
    
    // 1. 冠词类(最高优先级，因为词汇有限)
    if (['a', 'an', 'the'].includes(lowerAnswer)) {
      console.log(`[分类调试] 冠词匹配成功: ${lowerAnswer}`);
      return '冠词';
    }
    
    // 2. 代词类
    const pronounPatterns = [
      // 人称代词
      'i', 'me', 'you', 'he', 'him', 'she', 'her', 'it', 'we', 'us', 'they', 'them',
      // 物主代词
      'my', 'your', 'his', 'her', 'its', 'our', 'their',
      'mine', 'yours', 'hers', 'ours', 'theirs',
      // 反身代词
      'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves',
      // 指示代词
      'this', 'that', 'these', 'those',
      // 关系代词
      'who', 'whom', 'whose', 'which', 'what'
    ];
    
    if (pronounPatterns.includes(lowerAnswer)) {
      console.log(`[分类调试] 代词匹配成功: ${lowerAnswer}`);
      return '代词';
    }
    
    // 3. 介词类
    const prepositionPatterns = [
      'in', 'on', 'at', 'for', 'with', 'by', 'from', 'to', 'of', 'about', 
      'against', 'among', 'between', 'during', 'except', 'into', 'like', 
      'near', 'over', 'since', 'through', 'under', 'until', 'upon', 
      'within', 'without', 'above', 'below', 'beside', 'beyond', 'across',
      'behind', 'before', 'after', 'inside', 'outside', 'along', 'around'
    ];
    
    if (prepositionPatterns.includes(lowerAnswer)) {
      console.log(`[分类调试] 介词匹配成功: ${lowerAnswer}`);
      return '介词';
    }
    
    // 4. 连词类
    const conjunctionPatterns = [
      // 并列连词
      'and', 'but', 'or', 'nor', 'for', 'so', 'yet',
      // 从属连词
      'because', 'since', 'as', 'when', 'while', 'where', 'if', 'unless', 
      'although', 'though', 'however', 'therefore', 'moreover', 'furthermore',
      'before', 'after', 'until', 'whether', 'that',
      // 疑问词(常用作连词)
      'why', 'how', 'what', 'when', 'where'
    ];
    
    if (conjunctionPatterns.includes(lowerAnswer)) {
      console.log(`[分类调试] 连词匹配成功: ${lowerAnswer}`);
      return '连词';
    }
    
    // 5. 形容词类(包括比较级、最高级)
    const adjectivePatterns = [
      // 最高级
      'biggest', 'smallest', 'fastest', 'slowest', 'tallest', 'shortest',
      'best', 'worst', 'most', 'least', 'happiest', 'saddest', 'busiest', 'easiest',
      'funniest', 'prettiest', 'ugliest', 'smartest', 'kindest', 'hardest',
      'largest', 'greatest', 'strongest', 'weakest', 'richest', 'poorest',
      'youngest', 'oldest', 'newest', 'oldest', 'cleanest', 'dirtiest',
      'safest', 'dangerous', 'healthiest', 'sickest', 'freshest', 'stale',
      // 比较级
      'bigger', 'smaller', 'faster', 'slower', 'taller', 'shorter',
      'better', 'worse', 'more', 'less', 'happier', 'sadder', 'busier', 'easier',
      'funnier', 'prettier', 'uglier', 'smarter', 'kinder', 'harder',
      'larger', 'greater', 'stronger', 'weaker', 'richer', 'poorer',
      'younger', 'older', 'newer', 'cleaner', 'dirtier', 'safer', 'healthier',
      'fresher', 'sweet', 'bitter', 'warmer', 'colder', 'hotter', 'cooler',
      // 普通形容词
      'good', 'bad', 'big', 'small', 'fast', 'slow', 'tall', 'short', 'lazy', 'busy',
      'happy', 'sad', 'easy', 'difficult', 'hard', 'soft', 'hot', 'cold', 'warm', 'cool',
      'funny', 'pretty', 'ugly', 'smart', 'kind', 'nice', 'beautiful', 'interesting',
      'large', 'great', 'strong', 'weak', 'rich', 'poor', 'young', 'old', 'new',
      'clean', 'dirty', 'safe', 'dangerous', 'healthy', 'sick', 'fresh', 'stale',
      'sweet', 'bitter', 'sour', 'spicy', 'salty', 'delicious', 'tasty', 'awful',
      'wonderful', 'amazing', 'terrible', 'excellent', 'perfect', 'awful', 'horrible',
      'lovely', 'wonderful', 'fantastic', 'brilliant', 'clever', 'stupid', 'foolish',
      'wise', 'brave', 'cowardly', 'honest', 'dishonest', 'polite', 'rude', 'friendly',
      'unfriendly', 'generous', 'selfish', 'patient', 'impatient', 'careful', 'careless',
      'quiet', 'noisy', 'loud', 'silent', 'bright', 'dark', 'light', 'heavy', 'light',
      'thick', 'thin', 'wide', 'narrow', 'long', 'short', 'high', 'low', 'deep', 'shallow',
      'full', 'empty', 'open', 'closed', 'free', 'busy', 'available', 'unavailable',
      'possible', 'impossible', 'necessary', 'unnecessary', 'important', 'unimportant',
      'special', 'ordinary', 'normal', 'strange', 'usual', 'unusual', 'common', 'rare',
      'simple', 'complex', 'easy', 'hard', 'difficult', 'simple', 'complicated'
    ];
    
    // 检查形容词(包括后缀判断)
    if (adjectivePatterns.includes(lowerAnswer) || 
        lowerAnswer.endsWith('est') || 
        lowerAnswer.endsWith('er') ||
        lowerAnswer.endsWith('ful') || 
        lowerAnswer.endsWith('less') || 
        lowerAnswer.endsWith('ous') ||
        lowerAnswer.endsWith('ive') ||
        lowerAnswer.endsWith('able') ||
        lowerAnswer.endsWith('ible')) {
      console.log(`[分类调试] 形容词匹配成功: ${lowerAnswer}`);
      return '形容词';
    }
    
    // 6. 副词类
    const adverbPatterns = [
      'quickly', 'slowly', 'carefully', 'easily', 'hardly', 'really', 'very', 'quite',
      'often', 'always', 'never', 'sometimes', 'usually', 'seldom', 'frequently',
      'well', 'badly', 'fast', 'slow', 'early', 'late', 'soon', 'now', 'then',
      'here', 'there', 'everywhere', 'nowhere', 'somewhere', 'anywhere',
      'today', 'yesterday', 'tomorrow', 'immediately', 'suddenly', 'finally'
    ];
    
    // 检查副词(包括-ly后缀，但排除一些特殊情况)
    if (adverbPatterns.includes(lowerAnswer) || 
        (lowerAnswer.endsWith('ly') && !['early', 'daily', 'monthly', 'yearly', 'family', 'lovely', 'lonely', 'likely'].includes(lowerAnswer))) {
      console.log(`[分类调试] 副词匹配成功: ${lowerAnswer}`);
      return '副词';
    }
    
    // 7. 名词类(包括复数形式)
    const nounPatterns = [
      // 常见名词复数
      'books', 'students', 'teachers', 'children', 'people', 'friends', 'families',
      'houses', 'cars', 'dogs', 'cats', 'trees', 'flowers', 'schools', 'hospitals',
      'churches', 'boxes', 'glasses', 'dishes', 'watches', 'buses', 'classes',
      'stories', 'cities', 'countries', 'companies', 'parties', 'babies', 'ladies',
      'men', 'women', 'feet', 'teeth', 'mice', 'geese', 'sheep', 'deer',
      'knives', 'lives', 'wives', 'leaves', 'thieves', 'wolves', 'halves',
      'potatoes', 'tomatoes', 'heroes', 'echoes', 'volcanoes', 'pianos', 'photos',
      'radios', 'zoos', 'kangaroos', 'bamboos', 'studios', 'videos',
      // 常见名词单数
      'book', 'student', 'teacher', 'child', 'person', 'friend', 'family',
      'house', 'car', 'dog', 'cat', 'tree', 'flower', 'school', 'hospital',
      'church', 'box', 'glass', 'dish', 'watch', 'bus', 'class',
      'story', 'city', 'country', 'company', 'party', 'baby', 'lady',
      'man', 'woman', 'foot', 'tooth', 'mouse', 'goose', 'sheep', 'deer',
      'knife', 'life', 'wife', 'leaf', 'thief', 'wolf', 'half',
      'potato', 'tomato', 'hero', 'echo', 'volcano', 'piano', 'photo',
      'radio', 'zoo', 'kangaroo', 'bamboo', 'studio', 'video'
    ];
    
    // 检查名词(包括复数判断)
    if (nounPatterns.includes(lowerAnswer) || 
        (lowerAnswer.endsWith('s') && !['yes', 'this', 'his', 'its', 'us', 'as', 'was', 'has', 'does', 'says', 'goes', 'comes', 'takes', 'makes', 'gives', 'sees', 'knows', 'thinks', 'works', 'lives', 'gets', 'puts', 'wants', 'needs', 'likes', 'loves', 'hates', 'plays', 'reads', 'writes', 'speaks', 'talks', 'walks', 'runs', 'eats', 'drinks', 'sleeps', 'wakes', 'buys', 'sells', 'finds', 'keeps', 'brings', 'sends', 'shows', 'tells', 'asks', 'answers', 'calls', 'meets', 'helps', 'starts', 'stops', 'opens', 'closes', 'moves', 'changes', 'turns', 'looks', 'feels', 'sounds', 'smells', 'tastes', 'seems', 'appears', 'becomes', 'remains', 'stays', 'leaves', 'arrives', 'returns', 'reaches', 'passes', 'crosses', 'follows', 'leads', 'carries', 'holds', 'catches', 'throws', 'catches', 'catches', 'catches'].includes(lowerAnswer) && 
         (lowerText.includes('复数') || lowerText.includes('plural') || lowerText.includes('noun') || lowerText.includes('名词')))) {
      console.log(`[分类调试] 名词匹配成功: ${lowerAnswer}`);
      return '名词';
    }
    
    // 8. 动词类(包括时态、语态、非谓语)
    const verbPatterns = [
      // 现在分词/动名词
      'helping', 'cooking', 'running', 'working', 'playing', 'reading', 'writing', 'swimming',
      'studying', 'living', 'talking', 'walking', 'eating', 'drinking', 'sleeping', 'thinking',
      'remembering', 'learning', 'teaching', 'singing', 'dancing', 'watching', 'listening',
      'speaking', 'looking', 'feeling', 'sounding', 'smelling', 'tasting', 'seeming', 'appearing',
      'becoming', 'remaining', 'staying', 'leaving', 'arriving', 'returning', 'reaching',
      'passing', 'crossing', 'following', 'leading', 'carrying', 'holding', 'catching', 'throwing',
      'buying', 'selling', 'finding', 'keeping', 'bringing', 'sending', 'showing', 'telling',
      'asking', 'answering', 'calling', 'meeting', 'starting', 'stopping', 'opening', 'closing',
      'moving', 'changing', 'turning', 'getting', 'putting', 'wanting', 'needing', 'liking',
      'loving', 'hating', 'knowing', 'understanding', 'believing', 'hoping', 'wishing', 'expecting',
      // 过去分词/过去式
      'cooked', 'worked', 'helped', 'played', 'finished', 'studied', 'lived', 'talked',
      'walked', 'eaten', 'drunk', 'slept', 'thought', 'gone', 'come', 'seen', 'done', 'made',
      'worn', 'taken', 'given', 'written', 'spoken', 'broken', 'chosen', 'frozen',
      'spoken', 'looked', 'felt', 'sounded', 'smelled', 'tasted', 'seemed', 'appeared',
      'became', 'remained', 'stayed', 'left', 'arrived', 'returned', 'reached', 'passed',
      'crossed', 'followed', 'led', 'carried', 'held', 'caught', 'threw', 'bought', 'sold',
      'found', 'kept', 'brought', 'sent', 'showed', 'told', 'asked', 'answered', 'called',
      'met', 'started', 'stopped', 'opened', 'closed', 'moved', 'changed', 'turned', 'got',
      'put', 'wanted', 'needed', 'liked', 'loved', 'hated', 'knew', 'understood', 'believed',
      'hoped', 'wished', 'expected',
      // 基本动词形式
      'get', 'gets', 'got', 'getting',
      'live', 'lives', 'lived', 'living',
      'have', 'has', 'had', 'having',
      'am', 'is', 'are', 'was', 'were', 'be', 'being', 'been',
      'will', 'would', 'shall', 'should',
      'can', 'could', 'may', 'might', 'must',
      'do', 'does', 'did', 'doing', 'done',
      'go', 'goes', 'went', 'going',
      'come', 'comes', 'came', 'coming',
      'see', 'sees', 'saw', 'seeing',
      'take', 'takes', 'took', 'taking',
      'give', 'gives', 'gave', 'giving',
      'make', 'makes', 'made', 'making',
      'wear', 'wears', 'wore', 'wearing',
      'speak', 'speaks', 'spoke', 'speaking',
      'look', 'looks', 'looked', 'looking',
      'feel', 'feels', 'felt', 'feeling',
      'sound', 'sounds', 'sounded', 'sounding',
      'smell', 'smells', 'smelled', 'smelling',
      'taste', 'tastes', 'tasted', 'tasting',
      'seem', 'seems', 'seemed', 'seeming',
      'appear', 'appears', 'appeared', 'appearing',
      'become', 'becomes', 'became', 'becoming',
      'remain', 'remains', 'remained', 'remaining',
      'stay', 'stays', 'stayed', 'staying',
      'leave', 'leaves', 'left', 'leaving',
      'arrive', 'arrives', 'arrived', 'arriving',
      'return', 'returns', 'returned', 'returning',
      'reach', 'reaches', 'reached', 'reaching',
      'pass', 'passes', 'passed', 'passing',
      'cross', 'crosses', 'crossed', 'crossing',
      'follow', 'follows', 'followed', 'following',
      'lead', 'leads', 'led', 'leading',
      'carry', 'carries', 'carried', 'carrying',
      'hold', 'holds', 'held', 'holding',
      'catch', 'catches', 'caught', 'catching',
      'throw', 'throws', 'threw', 'throwing',
      'buy', 'buys', 'bought', 'buying',
      'sell', 'sells', 'sold', 'selling',
      'find', 'finds', 'found', 'finding',
      'keep', 'keeps', 'kept', 'keeping',
      'bring', 'brings', 'brought', 'bringing',
      'send', 'sends', 'sent', 'sending',
      'show', 'shows', 'showed', 'showing',
      'tell', 'tells', 'told', 'telling',
      'ask', 'asks', 'asked', 'asking',
      'answer', 'answers', 'answered', 'answering',
      'call', 'calls', 'called', 'calling',
      'meet', 'meets', 'met', 'meeting',
      'start', 'starts', 'started', 'starting',
      'stop', 'stops', 'stopped', 'stopping',
      'open', 'opens', 'opened', 'opening',
      'close', 'closes', 'closed', 'closing',
      'move', 'moves', 'moved', 'moving',
      'change', 'changes', 'changed', 'changing',
      'turn', 'turns', 'turned', 'turning',
      'put', 'puts', 'put', 'putting',
      'want', 'wants', 'wanted', 'wanting',
      'need', 'needs', 'needed', 'needing',
      'like', 'likes', 'liked', 'liking',
      'love', 'loves', 'loved', 'loving',
      'hate', 'hates', 'hated', 'hating',
      'know', 'knows', 'knew', 'knowing',
      'understand', 'understands', 'understood', 'understanding',
      'believe', 'believes', 'believed', 'believing',
      'hope', 'hopes', 'hoped', 'hoping',
      'wish', 'wishes', 'wished', 'wishing',
      'expect', 'expects', 'expected', 'expecting'
    ];
    
    // 检查动词(包括时态短语)
    if (verbPatterns.includes(lowerAnswer) || 
        lowerAnswer.includes('has ') || 
        lowerAnswer.includes('have ') || 
        lowerAnswer.includes('had ') ||
        lowerAnswer.includes('will ') || 
        lowerAnswer.includes('would ') || 
        (lowerAnswer.endsWith('ing') && !['during', 'nothing', 'something', 'anything', 'everything', 'morning', 'evening'].includes(lowerAnswer)) || 
        (lowerAnswer.endsWith('ed') && !['bed', 'red', 'wed', 'used', 'based', 'called'].includes(lowerAnswer))) {
      
      // 进一步区分谓语和非谓语
      if (lowerAnswer.endsWith('ing') && !lowerAnswer.includes(' ')) {
        console.log(`[分类调试] 非谓语动词匹配成功: ${lowerAnswer}`);
        return '非谓语';
      } else if (lowerAnswer.endsWith('ed') && !lowerAnswer.includes(' ')) {
        console.log(`[分类调试] 非谓语动词匹配成功: ${lowerAnswer}`);
        return '非谓语';
      } else {
        console.log(`[分类调试] 动词匹配成功: ${lowerAnswer}`);
        return '动词';
      }
    }
    
    // 9. 特殊情况：完成时态
    if (lowerAnswer.includes('has ') || lowerAnswer.includes('have ') || lowerAnswer.includes('had ')) {
      console.log(`[分类调试] 谓语动词匹配成功: ${lowerAnswer}`);
      return '谓语';
    }
    
    // 10. 上下文关键词匹配
    const contextKeywords = {
      '定语从句': ['定语从句', '定语', 'that', 'which', 'who', 'whose', 'relative clause'],
      '状语从句': ['状语从句', '状语', 'when', 'where', 'how', 'why', 'because', 'adverbial clause']
    };
    
    for (const [category, keywords] of Object.entries(contextKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          console.log(`[分类调试] 上下文匹配成功: ${category}`);
          return category;
        }
      }
    }
    
    // === 新增：二次分类优化 ===
    // 如果前面的分类都失败，尝试基于解析内容进行二次分类
    const refinedCategory = this.performSecondaryClassification(lowerText, lowerAnswer, lowerAnalysis);
    if (refinedCategory && refinedCategory !== '综合') {
      console.log(`[分类调试] 二次分类成功: ${refinedCategory}`);
      return refinedCategory;
    }
    
    // === 最终兜底策略 ===
    console.warn(`[分类警告] 无法准确分类的题目:`, {
      question: questionText,
      answer: answer,
      lowerAnswer: lowerAnswer
    });
    
    return '综合';
  },

  // 新增：二次分类函数
  performSecondaryClassification(questionText, answer, analysis) {
    const allText = `${questionText} ${answer} ${analysis}`.toLowerCase();
    
    // 1. 基于解析关键词的分类
    const keywordMapping = {
      // 名词相关
      '名词': ['复数', '名词', 'noun', '单数', '可数名词', '不可数名词', '可数', '不可数', '复数形式', '单数形式', '名词复数', '名词单数'],
      // 谓语相关
      '谓语': ['谓语', '时态', '过去时', '现在时', '将来时', '完成时', '进行时', '被动语态', '主动语态', 'predicate', 'tense', '谓语动词', '主句', '从句', '主谓', '谓宾'],
      // 非谓语相关
      '非谓语': ['非谓语', '现在分词', '过去分词', '不定式', '动名词', '非谓语动词', 'participle', 'infinitive', 'gerund', '分词', '不定式', '动名词', '非谓语形式'],
      // 形容词相关
      '形容词': ['形容词', '比较级', '最高级', '修饰名词', 'adjective', 'comparative', 'superlative', '形容词性', '修饰性', '性质', '特征'],
      // 副词相关
      '副词': ['副词', '修饰动词', '修饰形容词', 'adverb', '副词性', '修饰副词', '程度', '方式', '时间', '地点'],
      // 从句相关
      '定语从句': ['定语从句', '关系代词', 'that', 'which', 'who', 'whose', 'relative clause', '定语', '修饰', '限定'],
      '状语从句': ['状语从句', '时间状语', '条件状语', '原因状语', 'adverbial clause', 'when', 'where', 'how', 'why', 'because', 'if', 'unless', 'although', 'though', '状语', '时间', '条件', '原因', '让步']
    };
    
    // 检查关键词匹配
    for (const [category, keywords] of Object.entries(keywordMapping)) {
      for (const keyword of keywords) {
        if (allText.includes(keyword)) {
          console.log(`[二次分类] 关键词匹配: ${keyword} -> ${category}`);
          return category;
        }
      }
    }
    
    // 2. 基于答案形式的特殊判断
    // 检查 to be done 形式(被动不定式)
    if (answer.includes('to be ') && (answer.includes('ed') || answer.includes('en'))) {
      console.log(`[二次分类] 被动不定式匹配: ${answer}`);
      return '非谓语';
    }
    
    // 检查 to do 形式(不定式)
    if (answer.startsWith('to ') && !answer.includes('be ')) {
      console.log(`[二次分类] 不定式匹配: ${answer}`);
      return '非谓语';
    }
    
    // 检查 be done 形式(被动语态)
    if (answer.includes('be ') && (answer.includes('ed') || answer.includes('en'))) {
      console.log(`[二次分类] 被动语态匹配: ${answer}`);
      return '谓语';
    }
    
    // 检查 have/has/had done 形式(完成时态)
    if ((answer.includes('have ') || answer.includes('has ') || answer.includes('had ')) && 
        (answer.includes('ed') || answer.includes('en'))) {
      console.log(`[二次分类] 完成时态匹配: ${answer}`);
      return '谓语';
    }
    
    // 检查 will/would do 形式(将来时态)
    if ((answer.includes('will ') || answer.includes('would ')) && !answer.includes('be ')) {
      console.log(`[二次分类] 将来时态匹配: ${answer}`);
      return '谓语';
    }
    
    // 检查 am/is/are doing 形式(现在进行时)
    if ((answer.includes('am ') || answer.includes('is ') || answer.includes('are ')) && answer.includes('ing')) {
      console.log(`[二次分类] 现在进行时匹配: ${answer}`);
      return '谓语';
    }
    
    // 检查 was/were doing 形式(过去进行时)
    if ((answer.includes('was ') || answer.includes('were ')) && answer.includes('ing')) {
      console.log(`[二次分类] 过去进行时匹配: ${answer}`);
      return '谓语';
    }
    
    // 检查单独的 -ing 形式(现在分词/动名词)
    if (answer.endsWith('ing') && !answer.includes(' ')) {
      console.log(`[二次分类] 现在分词/动名词匹配: ${answer}`);
      return '非谓语';
    }
    
    // 检查单独的 -ed 形式(过去分词/过去式)
    if (answer.endsWith('ed') && !answer.includes(' ') && !['bed', 'red', 'wed', 'used', 'based', 'called'].includes(answer)) {
      console.log(`[二次分类] 过去分词/过去式匹配: ${answer}`);
      // 需要进一步判断是谓语还是非谓语
      if (analysis.includes('过去时') || analysis.includes('时态') || analysis.includes('谓语')) {
        return '谓语';
      } else if (analysis.includes('过去分词') || analysis.includes('非谓语')) {
        return '非谓语';
      }
      // 默认作为谓语处理
      return '谓语';
    }
    
    // 3. 基于题目结构的判断
    // 检查是否包含时间状语(暗示时态)
    const timeIndicators = ['yesterday', 'tomorrow', 'now', 'ago', 'last', 'next', 'before', 'after', 'when', 'while', 'since', 'until', 'during', 'already', 'yet', 'just', 'recently', 'lately'];
    for (const indicator of timeIndicators) {
      if (questionText.toLowerCase().includes(indicator)) {
        console.log(`[二次分类] 时间指示词匹配: ${indicator}`);
        return '谓语';
      }
    }
    
    // 检查是否包含比较结构
    if (questionText.includes('than') || questionText.includes('more') || questionText.includes('most') || 
        questionText.includes('er') || questionText.includes('est') || questionText.includes('better') || 
        questionText.includes('worse') || questionText.includes('best') || questionText.includes('worst')) {
      console.log(`[二次分类] 比较结构匹配`);
      return '形容词';
    }
    
    // 检查是否包含从句引导词
    const clauseIndicators = {
      '定语从句': ['that', 'which', 'who', 'whom', 'whose', 'where', 'when'],
      '状语从句': ['when', 'where', 'how', 'why', 'because', 'if', 'unless', 'although', 'though', 'while', 'since', 'until', 'before', 'after', 'as', 'so that', 'in order that']
    };
    
    for (const [clauseType, indicators] of Object.entries(clauseIndicators)) {
      for (const indicator of indicators) {
        if (questionText.toLowerCase().includes(indicator)) {
          console.log(`[二次分类] 从句引导词匹配: ${indicator} -> ${clauseType}`);
          return clauseType;
        }
      }
    }
    
    // 检查是否包含被动语态结构
    if (questionText.includes('by ') || questionText.includes('need ') || questionText.includes('want ') || 
        questionText.includes('require ') || questionText.includes('expect ')) {
      console.log(`[二次分类] 被动语态结构匹配`);
      return '谓语';
    }
    
    // 检查是否包含情态动词
    const modalVerbs = ['can', 'could', 'may', 'might', 'will', 'would', 'shall', 'should', 'must', 'need', 'dare'];
    for (const modal of modalVerbs) {
      if (answer.includes(modal)) {
        console.log(`[二次分类] 情态动词匹配: ${modal}`);
        return '谓语';
      }
    }
    
    return null; // 返回null表示二次分类也失败
  },

  // 测试分类算法准确性
  testCategoryClassification() {
    const testCases = [
      { question: 'There are some ___ (church) in this small town.', answer: 'churches', expected: '名词', analysis: '该题考查名词复数形式，church的复数形式是churches' },
      { question: '___ (remember) seeing a breathtaking dance performance in Beijing, she decided to learn more about traditional Chinese dance.', answer: 'Remembering', expected: '非谓语', analysis: '该题考查现在分词作主语，remembering是现在分词形式' },
      { question: 'She ___ (wear) that dress several times already.', answer: 'has worn', expected: '谓语', analysis: '该题考查现在完成时，has worn是现在完成时形式' },
      { question: 'This is the ___ (funny) story I\'ve heard.', answer: 'funniest', expected: '形容词', analysis: '该题考查形容词最高级，funniest是funny的最高级形式' },
      { question: 'I don\'t understand ___ she is afraid of dogs.', answer: 'why', expected: '连词', analysis: '该题考查连词why引导宾语从句' },
      { question: 'I have ___ apple.', answer: 'an', expected: '冠词', analysis: '该题考查冠词用法' },
      { question: 'She is ___ student.', answer: 'a', expected: '冠词', analysis: '该题考查冠词用法' },
      { question: '___ book is on the table.', answer: 'The', expected: '冠词', analysis: '该题考查冠词用法' },
      { question: 'I saw ___ yesterday.', answer: 'him', expected: '代词', analysis: '该题考查代词用法' },
      { question: 'She runs ___.', answer: 'quickly', expected: '副词', analysis: '该题考查副词用法' },
      { question: 'The cat is ___ the table.', answer: 'on', expected: '介词', analysis: '该题考查介词用法' },
      // 新增测试用例(基于你提供的截图)
      { question: 'The trees in the park need ____ (take) good care of.', answer: 'to be taken', expected: '非谓语', analysis: '该题考查被动不定式，need后接被动不定式to be taken' },
      { question: 'I like to collect different kinds of ____ (toy).', answer: 'toys', expected: '名词', analysis: '该题考查名词复数，toy的复数形式是toys' },
      { question: 'As the sun ____ (set), the sky turned orange and red.', answer: 'set', expected: '谓语', analysis: '该题考查过去时态，set是过去时形式' },
      { question: 'They ____ (start) the project two months ago.', answer: 'started', expected: '谓语', analysis: '该题考查过去时态，started是过去时形式' }
    ];
    
    console.log('=== 开始测试分类算法 ===');
    let correctCount = 0;
    let totalCount = testCases.length;
    
    testCases.forEach((testCase, index) => {
      const result = this.getCategoryFromQuestion({
        question: testCase.question,
        answer: testCase.answer,
        analysis: testCase.analysis
      });
      
      const isCorrect = result === testCase.expected;
      if (isCorrect) {
        correctCount++;
      }
      
      console.log(`测试 ${index + 1}: ${isCorrect ? '✅' : '❌'} 
        题目: ${testCase.question}
        答案: ${testCase.answer}
        期望: ${testCase.expected}
        实际: ${result}`);
    });
    
    const accuracy = (correctCount / totalCount * 100).toFixed(1);
    console.log(`=== 测试结果 ===`);
    console.log(`正确: ${correctCount}/${totalCount}`);
    console.log(`准确率: ${accuracy}%`);
    
    return {
      correctCount,
      totalCount,
      accuracy: parseFloat(accuracy)
    };
  },

  // 显示完整答案
  showFullAnswer(e) {
    const dataset = e.currentTarget.dataset;
    const tableId = dataset.tableId;
    console.log('showFullAnswer called with tableId:', tableId);
    
    let answerData = null;
    
    if (tableId && tableId.startsWith('pronoun_')) {
      // 代词表格 - 支持新旧两种数据结构
      if (tableId.startsWith('pronoun_table_')) {
        // 新的代词表格数据结构
        const tableData = this.data.tableData[tableId];
        if (tableData && tableData.tableData) {
          answerData = {
            title: tableData.frontendName || tableId,
            headers: tableData.tableData.headers,
            data: tableData.tableData.rows
          };
          
          this.setData({
            showAnswerModal: true,
            currentAnswer: answerData
          });
        } else {
          wx.showToast({
            title: '答案数据加载失败',
            icon: 'error',
            duration: 2000
          });
        }
      } else {
        // 旧的代词表格数据结构
        const writingPronouns = require('../../data/writing_pronouns.js');
        const answerKey = tableId === 'pronoun_001' ? 'pronoun_001' : 'pronoun_002';
        answerData = writingPronouns.answers[answerKey];
        
        if (answerData) {
          this.setData({
            showAnswerModal: true,
            currentAnswer: answerData
          });
        } else {
          wx.showToast({
            title: '答案数据加载失败',
            icon: 'error',
            duration: 2000
          });
        }
      }
    } else if (tableId && tableId.startsWith('noun_')) {
      // 名词表格
      const writingNouns = require('../../data/writing_nouns.js');
      answerData = writingNouns.answers[tableId];
      
      if (answerData) {
        this.setData({
          showAnswerModal: true,
          currentAnswer: answerData
        });
      } else {
        this.setData({
          showAnswerModal: true,
          currentAnswer: {
            title: '名词学习指南',
            headers: ['要点', '说明'],
            data: [
              ['后缀规律', '不同的后缀有不同的词性倾向'],
              ['记忆技巧', '结合单词的构词法来记忆'],
              ['练习建议', '多做练习，加深印象']
            ]
          }
        });
      }
    } else {
      // 其他表格类型的通用处理
      console.log('Processing other table types');
      
      // 检查是否有当前表格数据
      const tableIds = Object.keys(this.data.tableData);
      if (tableIds.length > 0) {
        const firstTableId = tableIds[0];
        console.log('Showing answers for:', firstTableId);
        
        let title = '学习指南';
        let headers = ['要点', '说明'];
        let data = [
          ['学习方法', '理解语法规则和变化模式'],
          ['记忆技巧', '结合例句和实际应用'],
          ['练习建议', '反复练习，加深印象']
        ];
        
        if (firstTableId.includes('present_participle')) {
          title = '现在分词学习指南';
          data = [
            ['一般规则', '动词后直接加-ing'],
            ['去e规则', '以不发音e结尾的动词，去e加-ing'],
            ['双写规则', '重读闭音节，双写末尾辅音字母再加-ing'],
            ['ie变y', '以ie结尾的动词，变ie为y再加-ing']
          ];
        } else if (firstTableId.includes('past_participle')) {
          title = '过去分词学习指南';
          data = [
            ['规则变化', '一般动词直接加-ed'],
            ['去e加d', '以e结尾的动词只加-d'],
            ['变y为i', '以辅音+y结尾，变y为i再加-ed'],
            ['双写规则', '重读闭音节双写末尾辅音再加-ed'],
            ['不规则', '不规则动词需要单独记忆']
          ];
        } else if (firstTableId.includes('comparison')) {
          title = '比较级最高级学习指南';
          data = [
            ['单音节', '直接加-er/-est'],
            ['以e结尾', '只加-r/-st'],
            ['辅音+y', '变y为i再加-er/-est'],
            ['重读闭音节', '双写末尾辅音再加-er/-est'],
            ['多音节', '用more/most']
          ];
        } else if (firstTableId.includes('adverb')) {
          title = '副词构成学习指南';
          data = [
            ['一般规则', '形容词后加-ly'],
            ['以y结尾', '变y为i再加-ly'],
            ['以le结尾', '去e加-y'],
            ['同形词', '部分形容词副词同形'],
            ['特殊变化', '需要单独记忆']
          ];
        }
        
        this.setData({
          showAnswerModal: true,
          currentAnswer: {
            title: title,
            headers: headers,
            data: data
          }
        });
      } else {
        wx.showToast({
          title: '暂无答案数据',
          icon: 'none',
          duration: 2000
        });
      }
    }
  },

  // 关闭答案弹窗
  closeAnswerModal() {
    this.setData({
      showAnswerModal: false
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，用于阻止事件冒泡
  },

  // noun_003点击处理
  onNoun003CellTap(e) {
    const { tableId, cellId, word } = e.currentTarget.dataset;
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = true; // 标记已点

    // 判断是否为名词后缀结尾
    const nounSuffixes = [
      'ness','th','ment','ion','ure','ance','ence','ity','or','er','ist','ism','al','hood','ship','dom'
    ];
    const lowerWord = (word || '').toLowerCase();
    let isCorrect = false;
    for (let i = 0; i < nounSuffixes.length; i++) {
      if (lowerWord.endsWith(nounSuffixes[i])) {
        isCorrect = true;
        break;
      }
    }
    const showCorrect = { ...this.data.showCorrect };
    if (!showCorrect[tableId]) showCorrect[tableId] = {};
    showCorrect[tableId][cellId] = isCorrect;
    
    // 新增：更新书写题统计
    this.updateWritingStatsFromTable(tableId, cellId, isCorrect);
    
    this.setData({
      tableAnswers,
      showCorrect
    });
  },

  // 名词表头提示按钮弹窗
  showNounHint() {
    wx.showModal({
      title: '提示',
      content: NOUN_SUFFIX_HINT,
      showCancel: false
    });
  },

  // noun_004规则点击切换全文/简略
  onNoun004RuleTap(e) {
    const row = e.currentTarget.dataset.row;
    const arr = [...this.data.noun004ShowFullRule];
    arr[row] = !arr[row];
    this.setData({ noun004ShowFullRule: arr });
  },

  // noun_004输入处理
  onNoun004Input(e) {
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value;
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;

    // 获取正确答案
    const correct = this.data.correctAnswers[tableId][cellId];
    let status = null;
    let isCorrect = false;
    if (!value) {
      status = null;
    } else if (this.checkAnswer(value, correct)) {
      status = 'correct';
      isCorrect = true;
    } else {
      status = 'wrong';
      isCorrect = false;
    }
    const noun004InputStatus = { ...this.data.noun004InputStatus, [`${row*5+col}`]: status };

    // 新增：更新书写题统计（只在有输入时统计）
    if (value && value.trim() !== '') {
      this.updateWritingStatsFromTable(tableId, cellId, isCorrect);
    }

    // 新增：处理placeholder清除逻辑（仅对带有"_table_"的id生效）
    if (tableId.includes('_table_')) {
      // 获取当前单元格的placeholder内容
      const currentCell = this.data.tableData[tableId].find(cell => cell.cell_id === cellId);
      if (currentCell && currentCell.placeholder) {
        // 如果用户输入的内容与placeholder内容一致，则清除placeholder
        if (value === currentCell.placeholder) {
          // 更新单元格的placeholder为空
          const updatedTableData = [...this.data.tableData[tableId]];
          const cellIndex = updatedTableData.findIndex(cell => cell.cell_id === cellId);
          if (cellIndex !== -1) {
            updatedTableData[cellIndex] = {
              ...updatedTableData[cellIndex],
              placeholder: ''
            };
            
            this.setData({
              [`tableData.${tableId}`]: updatedTableData
            });
          }
        }
      }
    }

    this.setData({
      tableAnswers,
      noun004InputStatus
    });
  },

  // 代词表格输入处理（统一处理器版）
  onPronounInput(e) {
    if (this.data.tableHandler) {
      this.data.tableHandler.handleInput(e, 'pronoun');
    } else {
      // 降级到原始处理逻辑
      this.handlePronounInputLegacy(e);
    }
  },

  // 代词表格输入处理（原始逻辑，作为降级方案）
  handlePronounInputLegacy(e) {
    const { table, row, col } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    TableUtils.adjustInputHeight(e, '.table-input', this);
    
    const key = `${table}_${row}_${col}`;
    const pronounUserInputs = { ...this.data.pronounUserInputs };
    const previousValue = pronounUserInputs[key] || '';
    pronounUserInputs[key] = value;
    
    let correctAnswer;
    if (table.startsWith('pronoun_table_')) {
      const tableData = this.data.tableData[table];
      if (tableData && tableData.tableData && tableData.tableData.rows) {
        correctAnswer = tableData.tableData.rows[row][col];
      }
    } else {
      const cellIndex = row * 6 + col;
      const cellData = this.data.tableData[table][cellIndex];
      correctAnswer = cellData ? cellData.answer : '';
    }
    
    const validation = TableUtils.validateTableInput(value, correctAnswer);
    const pronounInputStatus = { ...this.data.pronounInputStatus };
    
    if (validation.status === 'empty') {
      delete pronounInputStatus[key];
    } else {
      pronounInputStatus[key] = validation.status;
      
      const inputElement = e.currentTarget;
      if (validation.status === 'correct') {
        TableUtils.TableAnimations.correctAnimation(inputElement);
      } else if (validation.status === 'wrong') {
        TableUtils.TableAnimations.wrongAnimation(inputElement);
      }
    }
    
    if (this.data.tableStateManager) {
      this.data.tableStateManager.saveState(table, key, value, previousValue);
    }
    
    if (value && value.trim() !== '') {
      const virtualCellId = `pronoun_${table}_${row}_${col}`;
      this.updateWritingStatsFromTable(table, virtualCellId, validation.isValid);
    }
    
    this.updateTableProgress();
    
    this.setData({
      pronounUserInputs,
      pronounInputStatus
    });
  },

  // 更新表格进度
  updateTableProgress() {
    const progress = TableUtils.calculateTableProgress(this.data.tableData, this.data.pronounUserInputs);
    this.setData({
      tableProgress: progress
    });
  },

  // 切换详细统计显示
  toggleDetailedStats() {
    this.setData({
      showDetailedStats: !this.data.showDetailedStats
    });
  },

  // 重置表格进度
  resetTableProgress() {
    wx.showModal({
      title: '重置进度',
      content: '确定要重置所有表格的练习进度吗？此操作不可撤销。',
      success: (res) => {
        if (res.confirm) {
          // 清空所有用户输入
          this.setData({
            pronounUserInputs: {},
            pronounInputStatus: {},
            prepositionUserInputs: {},
            prepositionInputStatus: {},
            tableUserInputs: {},
            tableInputStatus: {},
            tableAnswers: {},
            tenseWritingInputStatus: {},
            tableProgress: {
              totalCells: 0,
              completedCells: 0,
              correctCells: 0,
              completionRate: 0,
              accuracyRate: 0
            }
          });
          
          // 清空历史记录
          if (this.data.tableStateManager) {
            this.data.tableStateManager.undoStack = [];
            this.data.tableStateManager.redoStack = [];
          }
          
          wx.showToast({
            title: '进度已重置',
            icon: 'success'
          });
        }
      }
    });
  },

  // 隐藏/显示进度
  toggleProgress() {
    this.setData({
      showProgress: !this.data.showProgress
    });
  },

  // ========== 导出功能相关方法 ==========

  // 显示导出模态框
  showExportModal() {
    const userLimit = this.exportService.getUserExportLimit();
    this.setData({
      showExportModal: true,
      userExportLimit: userLimit,
      maxExportQuantity: userLimit.maxQuestions
    });
    this.updateExportPreview();
  },

  // 关闭导出模态框
  closeExportModal() {
    this.setData({
      showExportModal: false
    });
  },

  // 选择导出格式
  selectFormat(e) {
    const format = e.currentTarget.dataset.format;
    this.setData({
      exportFormat: format
    });
    this.updateExportPreview();
  },

  // 选择导出模板
  selectTemplate(e) {
    const template = e.currentTarget.dataset.template;
    this.setData({
      exportTemplate: template
    });
    this.updateExportPreview();
  },

  // 调整导出数量
  decreaseQuantity() {
    if (this.data.exportQuantity > 1) {
      this.setData({
        exportQuantity: this.data.exportQuantity - 1
      });
      this.updateExportPreview();
    }
  },

  increaseQuantity() {
    if (this.data.exportQuantity < this.data.maxExportQuantity) {
      this.setData({
        exportQuantity: this.data.exportQuantity + 1
      });
      this.updateExportPreview();
    }
  },

  // 切换难度选择
  toggleDifficulty(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    const selectedDifficulties = [...this.data.selectedDifficulties];
    const index = selectedDifficulties.indexOf(difficulty);
    
    if (index > -1) {
      selectedDifficulties.splice(index, 1);
    } else {
      selectedDifficulties.push(difficulty);
    }
    
    this.setData({
      selectedDifficulties: selectedDifficulties
    });
    this.updateExportPreview();
  },

  // 更新导出预览
  updateExportPreview() {
    const { exportQuantity, exportTemplate, exportFormat, selectedDifficulties } = this.data;
    
    // 获取当前题目数据
    const currentQuestions = this.getCurrentQuestions();
    const filteredQuestions = this.exportService.filterQuestions(currentQuestions, {
      quantity: exportQuantity,
      difficulties: selectedDifficulties
    });
    
    // 计算预计页数和文件大小
    const estimatedPages = this.exportService.estimatePages(filteredQuestions, exportTemplate);
    const estimatedSize = this.exportService.estimateFileSize(filteredQuestions, exportFormat);
    
    // 生成预览内容描述
    const template = this.exportService.exportTemplates[exportTemplate];
    let previewContent = template.name;
    if (template.includeAnswer) previewContent += ' + 答案';
    if (template.includeAnalysis) previewContent += ' + 解析';
    
    // 检查是否可以导出
    const canExport = this.data.userExportLimit && 
                     this.data.userExportLimit.remaining > 0 && 
                     filteredQuestions.length > 0;
    
    this.setData({
      estimatedPages,
      estimatedSize,
      previewContent,
      canExport
    });
  },

  // 获取当前题目数据
  getCurrentQuestions() {
    // 这里需要根据实际的题目数据结构来获取
    // 暂时返回示例数据
    return this.data.questions || [];
  },

  // 开始导出
  async startExport() {
    if (!this.data.canExport) {
      wx.showToast({
        title: '无法导出，请检查权限和题目数量',
        icon: 'none'
      });
      return;
    }

    try {
      this.setData({
        showExportModal: false,
        showExportProgress: true,
        exportProgress: 0,
        exportStatus: '准备导出数据...'
      });

      // 获取题目数据
      const currentQuestions = this.getCurrentQuestions();
      const filteredQuestions = this.exportService.filterQuestions(currentQuestions, {
        quantity: this.data.exportQuantity,
        difficulties: this.data.selectedDifficulties
      });

      this.setData({
        exportProgress: 20,
        exportStatus: '正在生成文件...'
      });

      // 根据格式生成文件
      let result;
      const options = {
        template: this.data.exportTemplate,
        format: this.data.exportFormat,
        includeAnswer: this.exportService.exportTemplates[this.data.exportTemplate].includeAnswer,
        includeAnalysis: this.exportService.exportTemplates[this.data.exportTemplate].includeAnalysis
      };

      if (this.data.exportFormat === 'pdf') {
        result = await this.exportService.generatePDF(filteredQuestions, options);
      } else if (this.data.exportFormat === 'word') {
        result = await this.exportService.generateWord(filteredQuestions, options);
      } else if (this.data.exportFormat === 'excel') {
        result = await this.exportService.generateExcel(filteredQuestions, options);
      }

      this.setData({
        exportProgress: 80,
        exportStatus: '文件生成完成，准备下载...'
      });

      // 记录导出操作
      this.exportService.recordExport(filteredQuestions.length);

      this.setData({
        exportProgress: 100,
        exportStatus: '导出完成！'
      });

      // 自动下载文件
      setTimeout(() => {
        this.downloadFile(result.downloadUrl, result.fileName);
      }, 1000);

    } catch (error) {
      console.error('导出失败:', error);
      wx.showToast({
        title: error.message || '导出失败',
        icon: 'error'
      });
      this.setData({
        showExportProgress: false
      });
    }
  },

  // 下载文件
  async downloadFile(fileUrl, fileName) {
    try {
      await this.exportService.downloadFile(fileUrl, fileName);
      this.setData({
        showExportProgress: false
      });
    } catch (error) {
      console.error('下载失败:', error);
      this.setData({
        showExportProgress: false
      });
    }
  },

  // 取消导出
  cancelExport() {
    this.setData({
      showExportProgress: false,
      exportProgress: 0,
      exportStatus: ''
    });
  },

  // 显示升级模态框
  showUpgradeModal() {
    wx.showModal({
      title: '升级会员',
      content: '升级为VIP会员可享受更多导出次数和更大导出数量限制',
      confirmText: '立即升级',
      success: (res) => {
        if (res.confirm) {
          // 跳转到会员页面
          wx.navigateTo({
            url: '/pages/membership/index'
          });
        }
      }
    });
  },

  // 撤销表格操作
  undoTableAction() {
    if (!this.data.tableStateManager || !this.data.tableStateManager.canUndo()) {
      wx.showToast({
        title: '没有可撤销的操作',
        icon: 'none'
      });
      return;
    }

    const state = this.data.tableStateManager.undo();
    if (state) {
      // 恢复状态
      const pronounUserInputs = { ...this.data.pronounUserInputs };
      pronounUserInputs[state.cellId] = state.previousValue;
      
      this.setData({
        pronounUserInputs
      });
      
      // 更新进度
      this.updateTableProgress();
      
      wx.showToast({
        title: '已撤销',
        icon: 'success'
      });
    }
  },

  // 重做表格操作
  redoTableAction() {
    if (!this.data.tableStateManager || !this.data.tableStateManager.canRedo()) {
      wx.showToast({
        title: '没有可重做的操作',
        icon: 'none'
      });
      return;
    }

    const state = this.data.tableStateManager.redo();
    if (state) {
      // 恢复状态
      const pronounUserInputs = { ...this.data.pronounUserInputs };
      pronounUserInputs[state.cellId] = state.value;
      
      this.setData({
        pronounUserInputs
      });
      
      // 更新进度
      this.updateTableProgress();
      
      wx.showToast({
        title: '已重做',
        icon: 'success'
      });
    }
  },

  // 介词表格输入处理
  onPrepositionInput(e) {
    const { table, row, col } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    const key = `${table}_${row}_${col}`;
    
    // 更新用户输入
    const prepositionUserInputs = { ...this.data.prepositionUserInputs };
    prepositionUserInputs[key] = value;
    
    // 获取正确答案 - 从提示文字中提取答案
    let correctAnswer = '';
    const tableData = this.data.tablesData[table];
    if (tableData && tableData.tableData && tableData.tableData.rows) {
      const hintText = tableData.tableData.rows[row][0]; // 第一列是提示文字
      // 从提示文字中提取答案，例如 "break_______" -> "down"
      correctAnswer = this.getPrepositionAnswers(hintText, row);
    }
    
    // 检查答案并更新状态
    const prepositionInputStatus = { ...this.data.prepositionInputStatus };
    let isCorrect = false;
    
    if (value.trim() === '') {
      // 空输入，移除状态
      delete prepositionInputStatus[key];
    } else if (this.checkAnswer(value, correctAnswer)) {
      // 正确
      prepositionInputStatus[key] = 'correct';
      isCorrect = true;
    } else {
      // 错误
      prepositionInputStatus[key] = 'wrong';
      isCorrect = false;
    }
    
    // 新增：更新书写题统计（只在有输入时统计）
    if (value && value.trim() !== '') {
      // 为介词表格创建一个虚拟的cellId用于统计
      const virtualCellId = `preposition_${table}_${row}_${col}`;
      this.updateWritingStatsFromTable(table, virtualCellId, isCorrect);
    }
    
    this.setData({
      prepositionUserInputs,
      prepositionInputStatus
    });
  },

  // 获取介词答案映射
  getPrepositionAnswers(hintText, rowIndex) {
    const answerMap = {
      'break_______': ['down', 'into', 'out', 'up'],
      'put_______': ['away', 'down', 'off', 'on', 'up'],
      'take_______': ['after', 'apart', 'away', 'down', 'in', 'off', 'on', 'over', 'up'],
      'look_______': ['after', 'at', 'for', 'into', 'up'],
      'look forward_______': ['to'],
      'get along_______': ['with'],
      'get_______': ['away', 'back', 'off', 'through'],
      'get down_______': ['to'],
      'give_______': ['away', 'back', 'in', 'up', 'out']
    };
    
    const answers = answerMap[hintText] || [];
    return answers[rowIndex] || '';
  },

  // 现在分词规则点击切换全文/简略
  onPresentParticipleRuleTap(e) {
    const row = e.currentTarget.dataset.row;
    const arr = [...this.data.presentParticipleShowFullRule];
    arr[row] = !arr[row];
    this.setData({ presentParticipleShowFullRule: arr });
  },

  // 现在分词输入处理
  onPresentParticipleInput(e) {
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
    } else {
      status = 'wrong';
    }
    const presentParticipleInputStatus = { ...this.data.presentParticipleInputStatus, [`${row*5+col}`]: status };

    // 新增：处理placeholder清除逻辑（仅对带有"_table_"的id生效）
    if (tableId.includes('_table_')) {
      // 获取当前单元格的placeholder内容
      const currentCell = this.data.tableData[tableId].find(cell => cell.cell_id === cellId);
      if (currentCell && currentCell.placeholder) {
        // 如果用户输入的内容与placeholder内容一致，则清除placeholder
        if (value === currentCell.placeholder) {
          // 更新单元格的placeholder为空
          const updatedTableData = [...this.data.tableData[tableId]];
          const cellIndex = updatedTableData.findIndex(cell => cell.cell_id === cellId);
          if (cellIndex !== -1) {
            updatedTableData[cellIndex] = {
              ...updatedTableData[cellIndex],
              placeholder: ''
            };
            
            this.setData({
              [`tableData.${tableId}`]: updatedTableData
            });
          }
        }
      }
    }

    this.setData({
      tableAnswers,
      presentParticipleInputStatus
    });
  },

  // 过去分词规则点击切换全文/简略
  onPastParticipleRuleTap(e) {
    const row = e.currentTarget.dataset.row;
    const arr = [...this.data.pastParticipleShowFullRule];
    arr[row] = !arr[row];
    this.setData({ pastParticipleShowFullRule: arr });
  },

  // 过去分词输入处理
  onPastParticipleInput(e) {
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
    } else {
      status = 'wrong';
    }
    const pastParticipleInputStatus = { ...this.data.pastParticipleInputStatus, [`${row*5+col}`]: status };

    // 新增：处理placeholder清除逻辑（仅对带有"_table_"的id生效）
    if (tableId.includes('_table_')) {
      // 获取当前单元格的placeholder内容
      const currentCell = this.data.tableData[tableId].find(cell => cell.cell_id === cellId);
      if (currentCell && currentCell.placeholder) {
        // 如果用户输入的内容与placeholder内容一致，则清除placeholder
        if (value === currentCell.placeholder) {
          // 更新单元格的placeholder为空
          const updatedTableData = [...this.data.tableData[tableId]];
          const cellIndex = updatedTableData.findIndex(cell => cell.cell_id === cellId);
          if (cellIndex !== -1) {
            updatedTableData[cellIndex] = {
              ...updatedTableData[cellIndex],
              placeholder: ''
            };
            
            this.setData({
              [`tableData.${tableId}`]: updatedTableData
            });
          }
        }
      }
    }

    this.setData({
      tableAnswers,
      pastParticipleInputStatus
    });
  },

  // 时态书写规则点击切换全文/简略
  onTenseWritingRuleTap(e) {
    console.log('点击时态书写规则', e);
    const row = e.currentTarget.dataset.row;
    const arr = [...this.data.tenseWritingShowFullRule];
    arr[row] = !arr[row];
    this.setData({ tenseWritingShowFullRule: arr });
  },

  // 跳转到时态标志词卡片页面
  navigateToTenseSignalCards() {
    wx.navigateTo({
      url: '/pages/tense-signal-cards/index'
    });
  },

  // 时态书写输入处理
  onTenseWritingInput(e) {
    console.log('时态书写输入框输入', e);
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
    } else {
      status = 'wrong';
    }
    const tenseWritingInputStatus = { ...this.data.tenseWritingInputStatus, [`${row*5+col}`]: status };

    // 新增：处理placeholder清除逻辑（仅对带有"_table_"的id生效）
    if (tableId.includes('_table_')) {
      // 获取当前单元格的placeholder内容
      if (cell && cell.hintWord) {
        // 如果用户输入的内容与placeholder内容一致，则清除placeholder
        if (value === cell.hintWord) {
          // 更新单元格的hintWord为空
          const updatedTableData = [...this.data.tableData[tableId]];
          const cellIndex = updatedTableData.findIndex(c => c.cell_id === cellId);
          if (cellIndex !== -1) {
            updatedTableData[cellIndex] = {
              ...updatedTableData[cellIndex],
              hintWord: ''
            };
            
            this.setData({
              [`tableData.${tableId}`]: updatedTableData
            });
          }
        }
      }
    }

    this.setData({
      tableAnswers,
      tenseWritingInputStatus
    });
  },

  // 前后缀识别输入处理
  onPrefixSuffixInput(e) {
    const { tableId, cellId, row } = e.currentTarget.dataset;
    const value = e.detail.value.trim();
    
    // 更新答案
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;

    if (!value) {
      this.setData({
        tableAnswers,
        [`prefixSuffixInputStatus.${row}`]: null
      });
      return;
    }

    // 获取正确答案数组
    const tableData = this.data.tableData[tableId];
    const cellData = tableData.find(cell => cell.cell_id === cellId);
    const acceptedAnswers = cellData.acceptedAnswers || [cellData.correctAnswer || cellData.answer];
    
    // 检查答案是否正确
    const isCorrect = acceptedAnswers.some(ans => 
      ans.toLowerCase() === value.toLowerCase()
    );
    
    // 新增：更新书写题统计
    this.updateWritingStatsFromTable(tableId, cellId, isCorrect);
    
    // 新增：处理placeholder清除逻辑（仅对带有"_table_"的id生效）
    if (tableId.includes('_table_')) {
      // 获取当前单元格的placeholder内容
      if (cellData && cellData.question) {
        // 如果用户输入的内容与placeholder内容一致，则清除placeholder
        if (value === cellData.question) {
          // 更新单元格的question为空
          const updatedTableData = [...this.data.tableData[tableId]];
          const cellIndex = updatedTableData.findIndex(cell => cell.cell_id === cellId);
          if (cellIndex !== -1) {
            updatedTableData[cellIndex] = {
              ...updatedTableData[cellIndex],
              question: ''
            };
            
            this.setData({
              [`tableData.${tableId}`]: updatedTableData
            });
          }
        }
      }
    }
    
    // 更新输入状态
    this.setData({
      tableAnswers,
      [`prefixSuffixInputStatus.${row}`]: isCorrect ? 'correct' : 'wrong'
    });
  },

  // 比较级输入处理
  onComparativeInput(e) {
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value.trim();
    
    // 更新答案
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;

    if (!value) {
      this.setData({
        tableAnswers,
        [`comparativeInputStatus.${cellId}`]: null
      });
      return;
    }

    // 获取正确答案
    const tableData = this.data.tableData[tableId];
    const cellData = tableData.find(cell => cell.cell_id === cellId);
    const correctAnswer = cellData.correctAnswer || cellData.answer;
    
    // 检查答案是否正确
    const isCorrect = this.checkAnswer(value, correctAnswer);
    
    // 新增：更新书写题统计
    this.updateWritingStatsFromTable(tableId, cellId, isCorrect);
    
    // 新增：处理placeholder清除逻辑（仅对带有"_table_"的id生效）
    if (tableId.includes('_table_')) {
      // 获取当前单元格的placeholder内容
      if (cellData && cellData.placeholder) {
        // 如果用户输入的内容与placeholder内容一致，则清除placeholder
        if (value === cellData.placeholder) {
          // 更新单元格的placeholder为空
          const updatedTableData = [...this.data.tableData[tableId]];
          const cellIndex = updatedTableData.findIndex(cell => cell.cell_id === cellId);
          if (cellIndex !== -1) {
            updatedTableData[cellIndex] = {
              ...updatedTableData[cellIndex],
              placeholder: ''
            };
            
            this.setData({
              [`tableData.${tableId}`]: updatedTableData
            });
          }
        }
      }
    }
    
    // 更新输入状态
    this.setData({
      tableAnswers,
      [`comparativeInputStatus.${cellId}`]: isCorrect ? 'correct' : 'wrong'
    });
  },

  // 最高级规则点击切换
  onSuperlativeRuleTap(e) {
    const { row } = e.currentTarget.dataset;
    const key = `superlativeShowFullRule[${row}]`;
    this.setData({
      [key]: !this.data.superlativeShowFullRule[row]
    });
  },

  // 最高级输入处理
  onSuperlativeInput(e) {
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value.trim();
    
    // 更新答案
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;

    if (!value) {
      this.setData({
        tableAnswers,
        [`superlativeInputStatus.${cellId}`]: null
      });
      return;
    }

    // 获取正确答案
    const tableData = this.data.tableData[tableId];
    const cellData = tableData.find(cell => cell.cell_id === cellId);
    const correctAnswer = cellData.correctAnswer || cellData.answer;
    
    // 检查答案是否正确
    const isCorrect = this.checkAnswer(value, correctAnswer);
    
    // 新增：处理placeholder清除逻辑（仅对带有"_table_"的id生效）
    if (tableId.includes('_table_')) {
      // 获取当前单元格的placeholder内容
      if (cellData && cellData.placeholder) {
        // 如果用户输入的内容与placeholder内容一致，则清除placeholder
        if (value === cellData.placeholder) {
          // 更新单元格的placeholder为空
          const updatedTableData = [...this.data.tableData[tableId]];
          const cellIndex = updatedTableData.findIndex(cell => cell.cell_id === cellId);
          if (cellIndex !== -1) {
            updatedTableData[cellIndex] = {
              ...updatedTableData[cellIndex],
              placeholder: ''
            };
            
            this.setData({
              [`tableData.${tableId}`]: updatedTableData
            });
          }
        }
      }
    }
    
    // 更新输入状态
    this.setData({
      tableAnswers,
      [`superlativeInputStatus.${cellId}`]: isCorrect ? 'correct' : 'wrong'
    });
  },

  // 副词规则点击切换
  onAdverbRuleTap(e) {
    const { row } = e.currentTarget.dataset;
    const key = `adverbShowFullRule[${row}]`;
    this.setData({
      [key]: !this.data.adverbShowFullRule[row]
    });
  },

  // 副词输入处理
  onAdverbInput(e) {
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value.trim();
    
    // 更新答案
    const tableAnswers = { ...this.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;

    if (!value) {
      this.setData({
        tableAnswers,
        [`adverbInputStatus.${cellId}`]: null
      });
      return;
    }

    // 获取正确答案
    const tableData = this.data.tableData[tableId];
    const cellData = tableData.find(cell => cell.cell_id === cellId);
    const correctAnswer = cellData.correctAnswer || cellData.answer;
    
    // 检查答案是否正确
    const isCorrect = this.checkAnswer(value, correctAnswer);
    
    // 新增：处理placeholder清除逻辑（仅对带有"_table_"的id生效）
    if (tableId.includes('_table_')) {
      // 获取当前单元格的placeholder内容
      if (cellData && cellData.placeholder) {
        // 如果用户输入的内容与placeholder内容一致，则清除placeholder
        if (value === cellData.placeholder) {
          // 更新单元格的placeholder为空
          const updatedTableData = [...this.data.tableData[tableId]];
          const cellIndex = updatedTableData.findIndex(cell => cell.cell_id === cellId);
          if (cellIndex !== -1) {
            updatedTableData[cellIndex] = {
              ...updatedTableData[cellIndex],
              placeholder: ''
            };
            
            this.setData({
              [`tableData.${tableId}`]: updatedTableData
            });
          }
        }
      }
    }
    
    // 更新输入状态
    this.setData({
      tableAnswers,
      [`adverbInputStatus.${cellId}`]: isCorrect ? 'correct' : 'wrong'
    });
  },

  // 开始错题变式训练
  startVariantTraining() {
    const wrongQuestions = this.data.wrongQuestions;
    if (wrongQuestions.length === 0) {
      wx.showToast({
        title: '恭喜！没有错题，无需变式训练',
        icon: 'success',
        duration: 2000
      });
      return;
    }

    // 直接开始生成变式题目，无需二次确认
    wx.showLoading({
      title: '生成变式题目中...'
    });

    // 调用错题变式训练逻辑
    this.generateVariantQuestionsFromWrongQuestions(wrongQuestions).catch(error => {
      console.error('生成变式题目失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成变式题目失败',
        icon: 'none'
      });
    });
  },

  // 根据错题生成变式题目
  async generateVariantQuestionsFromWrongQuestions(wrongQuestions) {
    try {
      // 从云数据库加载题库数据
      const questionsData = await cloudDataLoader.loadIntermediateQuestions();
      
      // 分析错题的分类分布
      const categoryCount = {};
      const categoryErrorCount = {};
      
      // 分类映射表(与首页保持一致)
      const categoryMapping = {
        // 介词相关分类
        "介词(1)": "介词", "介词(2)": "介词", "介词(3)": "介词",
        // 代词相关分类
        "代词(1)": "代词", "代词(2)": "代词", "代词(3)": "代词", 
        "代词(4)": "代词", "代词(5)": "代词", "代词(6)": "代词",
        // 连词相关分类
        "连词(1)": "连词", "连词(2)": "连词", "连词(3)": "连词",
        "连词(4)": "连词", "连词(5)": "连词", "连词(6)": "连词",
        // 冠词相关分类
        "冠词(1)": "冠词", "冠词(2)": "冠词", "冠词(3)": "冠词", "冠词(4)": "冠词",
        // 名词相关分类
        "名词(1)": "名词", "名词(2)": "名词", "名词(3)": "名词", 
        "名词(4)": "名词", "名词(5)": "名词",
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
        "状语和从句(4)": "状语从句", "状语和从句(5)": "状语从句"
      };
      
      // 题库分类映射表(包含具体语法点映射)
      const questionBankMapping = {
        // 具体语法点直接映射
        '代词(1)': ['代词(1)'],
        '代词(2)': ['代词(2)'],
        '代词(3)': ['代词(3)'],
        '代词(4)': ['代词(4)'],
        '代词(5)': ['代词(5)'],
        '代词(6)': ['代词(6)'],
        '动词(1)': ['动词(1)'],
        '动词(2)': ['动词(2)'],
        '动词(3)': ['动词(3)'],
        '动词(4)': ['动词(4)'],
        '动词(5)': ['动词(5)'],
        '介词(1)': ['介词(1)'],
        '介词(2)': ['介词(2)'],
        '介词(3)': ['介词(3)'],
        '连词(1)': ['连词(1)'],
        '连词(2)': ['连词(2)'],
        '连词(3)': ['连词(3)'],
        '连词(4)': ['连词(4)'],
        '连词(5)': ['连词(5)'],
        '连词(6)': ['连词(6)'],
        '冠词(1)': ['冠词(1)'],
        '冠词(2)': ['冠词(2)'],
        '冠词(3)': ['冠词(3)'],
        '冠词(4)': ['冠词(4)'],
        '名词(1)': ['名词(1)'],
        '名词(2)': ['名词(2)'],
        '名词(3)': ['名词(3)'],
        '名词(4)': ['名词(4)'],
        '名词(5)': ['名词(5)'],
        '名词(6)': ['名词(6)'],
        '谓语(1)': ['谓语(1)'],
        '谓语(2)': ['谓语(2)'],
        '谓语(3)': ['谓语(3)'],
        '谓语(4)': ['谓语(4)'],
        '谓语(5)': ['谓语(5)'],
        '谓语(6)': ['谓语(6)'],
        '谓语(7)': ['谓语(7)'],
        '谓语(8)': ['谓语(8)'],
        '谓语(9)': ['谓语(9)'],
        '非谓语(1)': ['非谓语(1)'],
        '非谓语(2)': ['非谓语(2)'],
        '非谓语(3)': ['非谓语(3)'],
        '非谓语(4)': ['非谓语(4)'],
        '形容词(1)': ['形容词(1)'],
        '形容词(2)': ['形容词(2)'],
        '形容词(3)': ['形容词(3)'],
        '副词(1)': ['副词(1)'],
        '副词(2)': ['副词(2)'],
        '副词(3)': ['副词(3)'],
        '副词(4)': ['副词(4)'],
        '定语从句(1)': ['定语从句(1)'],
        '定语从句(2)': ['定语从句(2)'],
        '定语从句(3)': ['定语从句(3)'],
        '定语从句(4)': ['定语从句(4)'],
        '定语从句(5)': ['定语从句(5)'],
        '状语和从句(1)': ['状语和从句(1)'],
        '状语和从句(2)': ['状语和从句(2)'],
        '状语和从句(3)': ['状语和从句(3)'],
        '状语和从句(4)': ['状语和从句(4)'],
        '状语和从句(5)': ['状语和从句(5)'],
        // 大类映射(兜底)
        '介词': ['介词综合', '固定搭配', '介词 + 名词/动名词'],
        '代词': ['代词综合', '人称代词', '物主代词', '反身代词', '关系代词', 'it相关'],
        '连词': ['并列连词综合', '从属连词综合', '连词与名/动/形/副综合', '连词与名词', '连词与动词', '连词与形容词'],
        '冠词': ['冠词综合', '泛指与特指', 'a和an', 'the的特殊用法'],
        '名词': ['名词综合', '名词复数书写综合', '以o结尾', '以y结尾', 's/sh/ch/x结尾', 'f/fe结尾'],
        '动词': ['动词综合', '谓语(1)', '非谓语综合', '被动写be吗', '并列句与动词', '主从句与动词', '插入语与动词'],
        '谓语': ['时态综合', '现在时', '过去时', '完成时', '进行时', '被动语态'],
        '非谓语': ['非谓语(1)', '非谓语(2)', '非谓语(3)'],
        '形容词': ['形容词综合', '比较级', '最高级'],
        '副词': ['副词综合', '副词修饰动词', '副词修饰句子', '副词修饰形容词/副词'],
        '定语从句': ['定语从句综合', 'that能填吗', 'who和which选哪个', 'whose', 'which和when/where混淆'],
        '状语从句': ['状语从句综合', 'when', 'where', 'how', 'why']
      };
      
      // 统计错题分类
      wrongQuestions.forEach(question => {
        // 优先使用原始分类信息，如果没有则使用映射后的分类
        const originalCategory = question.category || question.grammarPoint || '综合练习';
        console.log(`错题原始分类: ${originalCategory}, 题目: ${question.question}`);
        
        // 如果原始分类是具体的语法点(如"代词(1)")，直接使用
        if (originalCategory && originalCategory !== '综合练习' && originalCategory !== '综合') {
          categoryCount[originalCategory] = (categoryCount[originalCategory] || 0) + 1;
          categoryErrorCount[originalCategory] = (categoryErrorCount[originalCategory] || 0) + (question.errorCount || 1);
        } else {
          // 如果原始分类不明确，使用映射后的分类
          const mappedCategory = categoryMapping[originalCategory] || originalCategory;
          categoryCount[mappedCategory] = (categoryCount[mappedCategory] || 0) + 1;
          categoryErrorCount[mappedCategory] = (categoryErrorCount[mappedCategory] || 0) + (question.errorCount || 1);
        }
      });

      // 按错误频次排序，取前3类高频考点(排除"综合"分类)
      const sortedCategories = Object.keys(categoryErrorCount)
        .filter(category => category !== '综合' && category !== '综合练习' && category !== '其他')
        .sort((a, b) => categoryErrorCount[b] - categoryErrorCount[a])
        .slice(0, Math.min(3, Object.keys(categoryErrorCount).length));

      console.log('错题分类分析:', {
        totalWrongQuestions: wrongQuestions.length,
        categoryCount: categoryCount,
        categoryErrorCount: categoryErrorCount,
        topCategories: sortedCategories
      });

      // 生成变式题目
      const variantQuestions = [];
      const wrongQuestionTexts = wrongQuestions.map(q => q.question || q.text);
      
      // 为每个高频分类生成变式题目
      sortedCategories.forEach(category => {
        const errorCount = categoryErrorCount[category];
        const questionsToGenerate = Math.min(3, Math.max(2, Math.ceil(errorCount / 2)));
        
        console.log(`处理分类: ${category}, 错误次数: ${errorCount}, 计划生成: ${questionsToGenerate} 道题`);
        
        // 获取该分类对应的题库键名
        const mappedCategories = questionBankMapping[category] || [category];
        console.log(`分类 ${category} 映射到题库分类: ${mappedCategories.join(', ')}`);
        
        let availableQuestions = [];
        
        // 从映射的分类中收集题目
        mappedCategories.forEach(cat => {
          if (questionsData[cat] && Array.isArray(questionsData[cat]) && questionsData[cat].length > 0) {
            console.log(`从分类 ${cat} 找到 ${questionsData[cat].length} 道题`);
            availableQuestions = availableQuestions.concat(questionsData[cat]);
          } else {
            console.log(`分类 ${cat} 没有找到题目`);
          }
        });
        
        // 如果直接分类没有找到题目，从所有题目中筛选出对应category的题目
        if (availableQuestions.length === 0) {
          console.log(`尝试从所有题目中筛选category为 ${category} 的题目`);
          Object.keys(questionsData).forEach(bigCategory => {
            const bigCategoryQuestions = questionsData[bigCategory];
            // 检查是否为数组，只有数组才能调用filter方法
            if (Array.isArray(bigCategoryQuestions)) {
              const filteredQuestions = bigCategoryQuestions.filter(q => 
                q.category === category
              );
              if (filteredQuestions.length > 0) {
                console.log(`从大类 ${bigCategory} 中筛选出 ${filteredQuestions.length} 道category为 ${category} 的题目`);
                availableQuestions = availableQuestions.concat(filteredQuestions);
              }
            }
          });
        }
        
        if (availableQuestions.length > 0) {
          // 过滤掉与错题重复的题目
          const filteredQuestions = availableQuestions.filter(q => 
            !wrongQuestionTexts.includes(q.text || q.question)
          );
          
          console.log(`过滤重复题目后剩余: ${filteredQuestions.length} 道题`);
          
          // 如果过滤后题目不够，使用原题目
          const questionsToUse = filteredQuestions.length >= questionsToGenerate ? 
            filteredQuestions : availableQuestions;
          
          // 随机选择题目
          const shuffled = [...questionsToUse].sort(() => 0.5 - Math.random());
          const selectedQuestions = shuffled.slice(0, questionsToGenerate);
          
          // 标准化题目格式
          const normalizedSelected = selectedQuestions.map(q => ({
            text: q.text || q.question,
            answer: q.answer,
            analysis: q.analysis || q.explanation || '',
            category: q.category || category
          }));
          
          variantQuestions.push(...normalizedSelected);
          
          console.log(`为分类 ${category} 生成了 ${selectedQuestions.length} 道变式题`);
        } else {
          console.warn(`分类 ${category} 没有找到可用题目，映射的分类: ${mappedCategories.join(', ')}`);
        }
      });

      // 根据错题分类和数量生成对应的变式题目
      console.log('开始根据错题分类和数量生成变式题目...');
      
      // 统计每个具体分类的错题数量
      const categoryWrongCount = {};
      wrongQuestions.forEach(question => {
        const originalCategory = question.category || question.grammarPoint || '综合练习';
        categoryWrongCount[originalCategory] = (categoryWrongCount[originalCategory] || 0) + 1;
      });
      
      console.log('错题分类统计:', categoryWrongCount);
      
      // 为每个错题分类生成对应数量的变式题目
      const finalVariantQuestions = [];
      Object.keys(categoryWrongCount).forEach(category => {
        const wrongCount = categoryWrongCount[category];
        console.log(`为分类 ${category} 生成 ${wrongCount} 道变式题(对应错题数量)`);
        
        // 从已生成的变式题目中筛选出该分类的题目
        const categoryQuestions = variantQuestions.filter(q => 
          q.category === category || q.category === categoryMapping[category]
        );
        
        // 如果该分类的题目不够，从题库中补充
        if (categoryQuestions.length < wrongCount) {
          console.log(`分类 ${category} 的变式题目不足，需要补充 ${wrongCount - categoryQuestions.length} 道题`);
          
          // 获取该分类对应的题库键名
          const mappedCategories = questionBankMapping[category] || [category];
          let availableQuestions = [];
          
          // 从映射的分类中收集题目
          mappedCategories.forEach(cat => {
            if (questionsData[cat] && Array.isArray(questionsData[cat]) && questionsData[cat].length > 0) {
              availableQuestions = availableQuestions.concat(questionsData[cat]);
            }
          });
          
          // 如果直接分类没有找到题目，从所有题目中筛选出对应category的题目
          if (availableQuestions.length === 0) {
            Object.keys(questionsData).forEach(bigCategory => {
              const bigCategoryQuestions = questionsData[bigCategory];
              // 检查是否为数组，只有数组才能调用filter方法
              if (Array.isArray(bigCategoryQuestions)) {
                const filteredQuestions = bigCategoryQuestions.filter(q => 
                  q.category === category
                );
                if (filteredQuestions.length > 0) {
                  availableQuestions = availableQuestions.concat(filteredQuestions);
                }
              }
            });
          }
          
          // 过滤掉与错题重复的题目
          const filteredQuestions = availableQuestions.filter(q => 
            !wrongQuestionTexts.includes(q.text || q.question)
          );
          
          // 随机选择补充题目
          const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
          const supplementaryQuestions = shuffled.slice(0, wrongCount - categoryQuestions.length);
          
          // 标准化题目格式
          const normalizedSupplementary = supplementaryQuestions.map(q => ({
            text: q.text || q.question,
            answer: q.answer,
            analysis: q.analysis || q.explanation || '',
            category: q.category || category
          }));
          
          categoryQuestions.push(...normalizedSupplementary);
        }
        
        // 选择指定数量的题目(不超过错题数量)
        const selectedQuestions = categoryQuestions.slice(0, wrongCount);
        finalVariantQuestions.push(...selectedQuestions);
        
        console.log(`分类 ${category} 最终生成 ${selectedQuestions.length} 道变式题`);
      });
      
      // 使用最终生成的变式题目
      variantQuestions.splice(0, variantQuestions.length, ...finalVariantQuestions);

      wx.hideLoading();
      
      console.log('变式练习生成结果:', {
        totalGenerated: variantQuestions.length,
        sortedCategories: sortedCategories
      });

      if (variantQuestions.length === 0) {
            wx.showToast({
          title: '无法生成变式练习',
              icon: 'none'
            });
        return;
      }

      // 直接开始变式练习，无需二次确认
      this.startVariantExercise(variantQuestions);
      
    } catch (error) {
      console.error('生成错题变式练习失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成练习失败',
        icon: 'none'
      });
    }
  },

  // 开始变式练习
  startVariantExercise(variantQuestions) {
    // 重置状态，开始新的练习
    this.setData({
      questions: variantQuestions,
      answers: new Array(variantQuestions.length).fill(''),
      results: [],
      correctionCompleted: false,
      submitting: false,
      mode: 'variant',
      isWrongQuestionVariant: true
    });
    
    wx.showToast({
      title: `开始变式训练，共${variantQuestions.length}道题`,
      icon: 'success',
      duration: 2000
    });
  },

  // 开始书写规范训练
  startStandardTraining() {
    // 开始标准训练
    console.log('开始标准训练');
    
    // 跳转到练习页面，使用标准模式
    const url = `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(this.data.questions))}&level=${this.data.level}&mode=standard&title=${encodeURIComponent('标准训练')}`;
    
    wx.navigateTo({
      url: url,
      success: () => {
        console.log('跳转到标准训练页面成功');
      },
      fail: (error) => {
        console.error('跳转到标准训练页面失败:', error);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 新增：知识点双向联动模块相关方法

  // 处理错题统计和触发专项练习
  handleWrongQuestion(question, index) {
    // 获取题目类型(语法点分类)
    const grammarType = this.getQuestionType(question);
    
    if (grammarType) {
      // 累加错误次数
      const currentCount = this.data.errorCounts[grammarType] || 0;
      const newCount = currentCount + 1;
      
      const newErrorCounts = { ...this.data.errorCounts };
      newErrorCounts[grammarType] = newCount;
      
      this.setData({
        errorCounts: newErrorCounts,
        currentQuestionIndex: index,
        currentQuestionType: grammarType
      });
      
      console.log(`[错题统计] ${grammarType} 错误次数: ${newCount}`);
      
      // 检查是否触发专项练习(错误3次或以上)
      if (newCount >= 3) {
        this.confirmSpecialPractice(grammarType);
      }
    }
  },

  // 获取题目类型
  getQuestionType(question) {
    // 优先使用题目数据中的type字段
    if (question.type) {
      return question.type;
    }
    
    // 直接使用题目的category字段，这是最准确的方式
    const category = question.category || question.grammarPoint || '';
    
    // 如果category存在且不为空，直接返回原始分类名称
    if (category && category.trim() !== '') {
      return category;
    }
    
    // 如果没有category，返回默认值
    return '综合练习';
  },

  // 新增：获取标准化的题目类型（用于映射笔记和表格）
  getStandardizedQuestionType(question) {
    const category = question.category || question.grammarPoint || question.type || '';
    const subCategory = question.subCategory || '';
    const tag = question.tag || '';
    const text = question.text || '';
    const answer = question.answer || '';
    
    console.log('getStandardizedQuestionType 输入:', {
      category,
      subCategory,
      tag,
      text,
      answer,
      question
    });
    
    // 根据category和subCategory映射到标准化的类型
    const typeMapping = {
      // 谓语相关映射（保持原有映射以兼容题目数据）
      '谓语(1)': 'tense-simple-present',
      '谓语(2)': 'tense-simple-past', 
      '谓语(3)': 'tense-simple-future',
      '谓语(4)': 'tense-past-future',
      '谓语(5)': 'tense-present-continuous',
      '谓语(6)': 'tense-past-continuous',
      '谓语(7)': 'tense-present-perfect',
      '谓语(8)': 'tense-past-perfect',
      '谓语(9)': 'passive-voice',
      
      // 新增：前端显示名称映射（与frontendName保持一致）
      '时态(一般现在时)': 'tense-simple-present',
      '时态(一般过去时)': 'tense-simple-past',
      '时态(一般将来时)': 'tense-simple-future',
      '时态(过去将来时)': 'tense-past-future',
      '时态(现在进行时)': 'tense-present-continuous',
      '时态(过去进行时)': 'tense-past-continuous',
      '时态(现在完成时)': 'tense-present-perfect',
      '时态(过去完成时)': 'tense-past-perfect',
      '语态(被动+八大时态)': 'passive-voice',
      
      // 名词相关映射
      '名词(1)': 'noun-overview',
      '名词(2)': 'noun-plural-rules',
      '名词(3)': 'noun-o-ending',
      '名词(4)': 'noun-y-ending',
      '名词(5)': 'noun-s-sh-ch-x-ending',
      '名词(6)': 'noun-f-fe-ending',
      '名词综合': 'noun-overview',
      '名词复数书写综合': 'noun-plural-rules',
      '以o结尾': 'noun-o-ending',
      '以y结尾': 'noun-y-ending',
      's/sh/ch/x结尾': 'noun-s-sh-ch-x-ending',
      'f/fe结尾': 'noun-f-fe-ending',
      
      // 代词相关映射
      '代词(1)': 'pronoun-overview',
      '代词(2)': 'pronoun-personal',
      '代词(3)': 'pronoun-possessive',
      '代词(4)': 'pronoun-reflexive',
      '代词(5)': 'pronoun-relative',
      '代词(6)': 'pronoun-it',
      '代词综合': 'pronoun-overview',
      '人称代词': 'pronoun-personal',
      '物主代词': 'pronoun-possessive',
      '反身代词': 'pronoun-reflexive',
      '关系代词': 'pronoun-relative',
      'it相关': 'pronoun-it',
      
      // 连词相关映射
      '连词(1)': 'conjunction-coordinating',
      '连词(2)': 'conjunction-subordinating',
      '连词(3)': 'conjunction-comprehensive',
      '连词(4)': 'conjunction-noun',
      '连词(5)': 'conjunction-verb',
      '连词(6)': 'conjunction-adjective',
      '连词综合': 'conjunction-coordinating',
      '并列连词': 'conjunction-coordinating',
      '从属连词': 'conjunction-subordinating',
      '连词与名词': 'conjunction-noun',
      '连词与动词': 'conjunction-verb',
      '连词与形容词': 'conjunction-adjective',
      
      // 介词相关映射
      '介词(1)': 'preposition-overview',
      '介词(2)': 'preposition-phrases',
      '介词(3)': 'preposition-gerund',
      '介词综合': 'preposition-overview',
      '固定搭配': 'preposition-phrases',
      '介词+名词/动名词': 'preposition-gerund',
      
      // 形容词相关映射
      '形容词(1)': 'adjective-comparative',
      '形容词(2)': 'adjective-superlative',
      '形容词(3)': 'adjective-superlative',
      '比较级': 'adjective-comparative',
      '最高级': 'adjective-superlative',
      
      // 副词相关映射
      '副词(1)': 'adverb-overview',
      '副词(2)': 'adverb-formation',
      '副词(3)': 'adverb-usage',
      '副词(4)': 'adverb-sentence',
      '副词综合': 'adverb-overview',
      '副词修饰动词': 'adverb-formation',
      '副词修饰形容词': 'adverb-usage',
      '副词修饰句子': 'adverb-sentence',
      '副词': 'adverb-overview',
      
      // 冠词相关映射
      '冠词(1)': 'article-overview',
      '冠词(2)': 'article-specific',
      '冠词(3)': 'article-a-an',
      '冠词(4)': 'article-the',
      '冠词综合': 'article-overview',
      '泛指与特指': 'article-specific',
      'a和an': 'article-a-an',
      'the的特殊用法': 'article-the',
      '冠词': 'article-overview',
      
      // 非谓语相关映射
      '非谓语(1)': 'participle-present',
      '非谓语(2)': 'participle-past',
      '非谓语(3)': 'participle-infinitive',
      '现在分词综合': 'participle-present',
      '过去分词综合': 'participle-past',
      '不定式综合': 'participle-infinitive',
      
      // 定语从句相关映射
      '定语从句': 'relative-clause-overview',
      '定语从句(1)': 'relative-clause-basic',
      '定语从句(2)': 'relative-clause-advanced',
      '定语从句(3)': 'relative-clause-restrictive',
      '定语从句(4)': 'relative-clause-non-restrictive',
      '定语从句(5)': 'relative-clause-overview',
      
      // 状语从句相关映射
      '状语从句': 'adverbial-clause-overview',
      '状语从句(1)': 'adverbial-clause-time',
      '状语从句(2)': 'adverbial-clause-condition',
      '状语从句(3)': 'adverbial-clause-cause',
      '状语从句(4)': 'adverbial-clause-concession',
      '状语从句(5)': 'adverbial-clause-overview',
      
      // 其他语法点映射
      '名词': 'noun-overview',
      '代词': 'pronoun-overview',
      '连词': 'conjunction-coordinating',
      '介词': 'preposition-overview',
      '非谓语': 'participle-present',
      '定语从句': 'relative-clause-overview',
      '状语从句': 'adverbial-clause-overview',
      '动词': 'verb-tense',
      '时态': 'verb-tense',
      '一般将来时': 'tense-simple-future',
      '现在进行时': 'tense-present-continuous',
      '过去进行时': 'tense-past-continuous',
      '现在完成时': 'tense-present-perfect',
      '过去完成时': 'tense-past-perfect',
      '被动语态': 'passive-voice',
      '语态': 'passive-voice',
    };
    
    // 优先使用tag进行精确匹配（tag通常包含完整的分类信息）
    if (typeMapping[tag]) {
      console.log('通过tag匹配:', tag, '->', typeMapping[tag]);
      return typeMapping[tag];
    }
    
    // 优先使用subCategory进行精确匹配
    if (typeMapping[subCategory]) {
      console.log('通过subCategory匹配:', subCategory, '->', typeMapping[subCategory]);
      return typeMapping[subCategory];
    }
    
    // 尝试直接匹配category
    if (typeMapping[category]) {
      console.log('通过category匹配:', category, '->', typeMapping[category]);
      return typeMapping[category];
    }
    
    // 新增：根据题目内容智能识别类型
    if (category === '名词' || category.includes('名词')) {
      // 检查是否是复数相关题目
      if (text.includes('(piece)') || text.includes('(stamp)') || 
          text.includes('(box)') || text.includes('(child)') ||
          text.includes('(tooth)') || text.includes('(goose)') ||
          text.includes('(mouse)') || text.includes('(city)') ||
          text.includes('(boy)') || text.includes('(book)') ||
          text.includes('(shoe)') || text.includes('(radio)')) {
        console.log('通过内容识别为名词复数题目 -> noun-plural-rules');
        return 'noun-plural-rules';
      }
      
      // 检查是否是以o结尾的题目
      if (text.includes('(potato)') || text.includes('(tomato)') || 
          text.includes('(hero)') || text.includes('(photo)') ||
          text.includes('(radio)') || text.includes('(video)')) {
        console.log('通过内容识别为以o结尾名词题目 -> noun-o-ending');
        return 'noun-o-ending';
      }
      
      // 检查是否是以y结尾的题目
      if (text.includes('(city)') || text.includes('(baby)') || 
          text.includes('(family)') || text.includes('(story)') ||
          text.includes('(boy)') || text.includes('(toy)') ||
          text.includes('(key)') || text.includes('(day)')) {
        console.log('通过内容识别为以y结尾名词题目 -> noun-y-ending');
        return 'noun-y-ending';
      }
      
      // 检查是否是以s/sh/ch/x结尾的题目
      if (text.includes('(bus)') || text.includes('(brush)') || 
          text.includes('(watch)') || text.includes('(box)') ||
          text.includes('(dish)') || text.includes('(church)')) {
        console.log('通过内容识别为s/sh/ch/x结尾名词题目 -> noun-s-sh-ch-x-ending');
        return 'noun-s-sh-ch-x-ending';
      }
      
      // 检查是否是以f/fe结尾的题目
      if (text.includes('(leaf)') || text.includes('(knife)') || 
          text.includes('(wife)') || text.includes('(life)') ||
          text.includes('(thief)') || text.includes('(wolf)') ||
          text.includes('(half)') || text.includes('(roof)')) {
        console.log('通过内容识别为f/fe结尾名词题目 -> noun-f-fe-ending');
        return 'noun-f-fe-ending';
      }
    }
    
    // 新增：根据题目内容智能识别连词类型
    if (category === '连词' || category.includes('连词')) {
      // 检查是否是并列连词题目
      if (text.includes('and') || text.includes('or') || text.includes('but') ||
          text.includes('both') || text.includes('either') || text.includes('neither') ||
          text.includes('not only') || text.includes('as well as')) {
        console.log('通过内容识别为并列连词题目 -> conjunction-coordinating');
        return 'conjunction-coordinating';
      }
      
      // 检查是否是从属连词题目
      if (text.includes('when') || text.includes('if') || text.includes('because') ||
          text.includes('though') || text.includes('although') || text.includes('since') ||
          text.includes('until') || text.includes('while') || text.includes('unless')) {
        console.log('通过内容识别为从属连词题目 -> conjunction-subordinating');
        return 'conjunction-subordinating';
      }
      
      // 检查是否是连词与名词题目
      if (text.includes('(be)') || text.includes('(have)') || text.includes('(go)') ||
          text.includes('(play)') || text.includes('(study)') || text.includes('(work)')) {
        console.log('通过内容识别为连词与名词题目 -> conjunction-noun');
        return 'conjunction-noun';
      }
      
      // 检查是否是连词与动词题目
      if (text.includes('(go)') || text.includes('(buy)') || text.includes('(stay)') ||
          text.includes('(rain)') || text.includes('(come)') || text.includes('(finish)')) {
        console.log('通过内容识别为连词与动词题目 -> conjunction-verb');
        return 'conjunction-verb';
      }
      
      // 检查是否是连词与形容词题目
      if (text.includes('(beautiful)') || text.includes('(interesting)') || text.includes('(tall)') ||
          text.includes('(clever)') || text.includes('(hard-working)') || text.includes('(fast)')) {
        console.log('通过内容识别为连词与形容词题目 -> conjunction-adjective');
        return 'conjunction-adjective';
      }
      
      // 默认返回并列连词
      console.log('通过内容识别为连词综合题目 -> conjunction-coordinating');
      return 'conjunction-coordinating';
    }
    
    // 新增：根据题目内容智能识别副词类型
    if (category === '副词' || category.includes('副词')) {
      // 检查是否是副词修饰动词的题目
      if (text.includes('(systematic)') || text.includes('(careful)') || 
          text.includes('(quick)') || text.includes('(slow)') ||
          text.includes('(happy)') || text.includes('(sad)') ||
          text.includes('(loud)') || text.includes('(quiet)') ||
          text.includes('(brave)') || text.includes('(wise)')) {
        console.log('通过内容识别为副词修饰动词题目 -> adverb-formation');
        return 'adverb-formation';
      }
      
      // 检查是否是副词修饰形容词的题目
      if (text.includes('(very)') || text.includes('(quite)') || 
          text.includes('(rather)') || text.includes('(extremely)') ||
          text.includes('(fairly)') || text.includes('(pretty)') ||
          text.includes('(really)') || text.includes('(too)') ||
          text.includes('(so)') || text.includes('(enough)')) {
        console.log('通过内容识别为副词修饰形容词题目 -> adverb-usage');
        return 'adverb-usage';
      }
      
      // 默认返回副词概述
      console.log('通过内容识别为副词概述题目 -> adverb-overview');
      return 'adverb-overview';
    }
    
    // 新增：根据题目内容智能识别非谓语类型
    if (category === '非谓语' || category.includes('非谓语')) {
      // 检查是否是现在分词题目
      if (text.includes('(be)') || text.includes('(have)') || text.includes('(do)') ||
          text.includes('(go)') || text.includes('(come)') || text.includes('(see)') ||
          text.includes('(hear)') || text.includes('(feel)') || text.includes('(smell)')) {
        console.log('通过内容识别为现在分词题目 -> participle-present');
        return 'participle-present';
      }
      
      // 检查是否是过去分词题目
      if (text.includes('(be)') || text.includes('(have)') || text.includes('(do)') ||
          text.includes('(go)') || text.includes('(come)') || text.includes('(see)') ||
          text.includes('(hear)') || text.includes('(feel)') || text.includes('(smell)')) {
        console.log('通过内容识别为过去分词题目 -> participle-past');
        return 'participle-past';
      }
      
      // 默认返回现在分词
      console.log('通过内容识别为非谓语概述题目 -> participle-present');
      return 'participle-present';
    }
    
    // 新增：根据题目内容智能识别定语从句类型
    if (category === '定语从句' || category.includes('定语从句')) {
      // 检查是否是关系代词题目
      if (text.includes('who') || text.includes('which') || text.includes('that') ||
          text.includes('whose') || text.includes('whom') || text.includes('where') ||
          text.includes('when') || text.includes('why')) {
        console.log('通过内容识别为定语从句题目 -> relative-clause-overview');
        return 'relative-clause-overview';
      }
      
      // 默认返回定语从句概述
      console.log('通过内容识别为定语从句概述题目 -> relative-clause-overview');
      return 'relative-clause-overview';
    }
    
    // 新增：根据题目内容智能识别状语从句类型
    if (category === '状语从句' || category.includes('状语从句')) {
      // 检查是否是时间状语从句题目
      if (text.includes('when') || text.includes('while') || text.includes('before') ||
          text.includes('after') || text.includes('since') || text.includes('until') ||
          text.includes('as soon as') || text.includes('once')) {
        console.log('通过内容识别为时间状语从句题目 -> adverbial-clause-time');
        return 'adverbial-clause-time';
      }
      
      // 检查是否是条件状语从句题目
      if (text.includes('if') || text.includes('unless') || text.includes('provided') ||
          text.includes('supposing') || text.includes('in case') || text.includes('as long as')) {
        console.log('通过内容识别为条件状语从句题目 -> adverbial-clause-condition');
        return 'adverbial-clause-condition';
      }
      
      // 检查是否是原因状语从句题目
      if (text.includes('because') || text.includes('since') || text.includes('as') ||
          text.includes('for') || text.includes('now that') || text.includes('seeing that')) {
        console.log('通过内容识别为原因状语从句题目 -> adverbial-clause-cause');
        return 'adverbial-clause-cause';
      }
      
      // 检查是否是让步状语从句题目
      if (text.includes('though') || text.includes('although') || text.includes('even though') ||
          text.includes('even if') || text.includes('while') || text.includes('whereas')) {
        console.log('通过内容识别为让步状语从句题目 -> adverbial-clause-concession');
        return 'adverbial-clause-concession';
      }
      
      // 默认返回状语从句概述
      console.log('通过内容识别为状语从句概述题目 -> adverbial-clause-overview');
      return 'adverbial-clause-overview';
    }
    
    // 尝试部分匹配（优先匹配更具体的分类）
    const partialMatches = [];
    for (const [key, value] of Object.entries(typeMapping)) {
      if (category.includes(key) || key.includes(category) || 
          tag.includes(key) || key.includes(tag) ||
          subCategory.includes(key) || key.includes(subCategory)) {
        partialMatches.push({ key, value });
      }
    }
    
    // 如果有多个匹配，优先选择更具体的匹配
    if (partialMatches.length > 0) {
      // 优先选择与category完全匹配的
      const exactCategoryMatch = partialMatches.find(match => 
        match.key === category || category === match.key
      );
      if (exactCategoryMatch) {
        console.log('通过精确category匹配:', exactCategoryMatch.key, '->', exactCategoryMatch.value);
        return exactCategoryMatch.value;
      }
      
      // 优先选择与tag完全匹配的
      const exactTagMatch = partialMatches.find(match => 
        match.key === tag || tag === match.key
      );
      if (exactTagMatch) {
        console.log('通过精确tag匹配:', exactTagMatch.key, '->', exactTagMatch.value);
        return exactTagMatch.value;
      }
      
      // 选择第一个匹配（保持原有逻辑）
      console.log('通过部分匹配:', partialMatches[0].key, '->', partialMatches[0].value);
      return partialMatches[0].value;
    }
    
    // 默认返回
    console.log('使用默认值: tense-simple-present');
    return 'tense-simple-present';
  },

  // 检查是否是循环开始
  isCycleStart(item) {
    if (item.type !== 'text') return false;
    const cycleStartKeywords = ['数词提示', '修饰词提示', '无冠词提示', '动词提示', '提示'];
    return cycleStartKeywords.some(keyword => item.content.includes(keyword));
  },

  // 检查是否是考察示例标题
  isExamExampleTitle(item) {
    if (item.type !== 'text') return false;
    return item.content.includes('考察示例');
  },

  // 检查是否是规则或说明
  isRuleOrDescription(content) {
    return content.includes('规则') || content.includes('说明') || content.includes('注意');
  },

  // 检查是否是相关例子
  isRelatedExample(item, ruleContent) {
    if (item.type !== 'text') return false;
    return item.content.includes('例如') || item.content.includes('比如') || item.content.includes('例：');
  },

  // 检查是否是题目
  isQuestion(content) {
    return content.includes('题目') || content.includes('练习') || content.includes('填空');
  },

  // 查找相关答案
  findRelatedAnswer(items, startIndex) {
    for (let i = startIndex; i < items.length; i++) {
      const item = items[i];
      if (item.type === 'text' && (item.content.includes('答案：') || item.content.includes('解析：'))) {
        return { ...item, index: i };
      }
    }
    return null;
  },

  // 提取循环结构组
  extractCycleGroup(items, startIndex) {
    const cycleItems = [];
    let currentIndex = startIndex;
    
    // 添加提示
    cycleItems.push(items[currentIndex]);
    currentIndex++;
    
    // 查找题目
    while (currentIndex < items.length) {
      const item = items[currentIndex];
      if (this.isQuestion(item.content)) {
        cycleItems.push(item);
        currentIndex++;
        break;
      } else if (this.isCycleStart(item) || this.isExamExampleTitle(item)) {
        // 遇到下一个循环开始或考察示例标题，结束当前循环
        break;
      } else {
        currentIndex++;
      }
    }
    
    // 查找答案
    while (currentIndex < items.length) {
      const item = items[currentIndex];
      if (item.type === 'text' && (item.content.includes('答案：') || item.content.includes('解析：'))) {
        cycleItems.push(item);
        currentIndex++;
        break;
      } else if (this.isCycleStart(item) || this.isExamExampleTitle(item)) {
        // 遇到下一个循环开始或考察示例标题，结束当前循环
        break;
      } else {
        currentIndex++;
      }
    }
    
    // 检查是否形成了完整的循环结构
    if (cycleItems.length >= 3) {
      return {
        type: 'cycle-group',
        items: cycleItems,
        endIndex: currentIndex - 1
      };
    }
    
    // 如果只有提示和题目，也认为是有效的循环结构
    if (cycleItems.length >= 2) {
      return {
        type: 'cycle-group',
        items: cycleItems,
        endIndex: currentIndex - 1
      };
    }
    
    return null;
  },

  // 改进的循环结构识别：处理提示+例子的简单结构
  extractSimpleCycleGroup(items, startIndex) {
    const cycleItems = [];
    let currentIndex = startIndex;
    
    // 添加提示
    cycleItems.push(items[currentIndex]);
    currentIndex++;
    
    // 查找例子
    while (currentIndex < items.length) {
      const item = items[currentIndex];
      if (this.isRelatedExample(item, items[startIndex].content)) {
        cycleItems.push(item);
        currentIndex++;
      } else if (this.isCycleStart(item) || this.isExamExampleTitle(item)) {
        // 遇到下一个循环开始或考察示例标题，结束当前循环
        break;
      } else {
        break;
      }
    }
    
    // 如果形成了提示+例子的结构
    if (cycleItems.length >= 2) {
      return {
        type: 'cycle-group',
        items: cycleItems,
        endIndex: currentIndex - 1
      };
    }
    
    return null;
  },

  // 确认是否进入专项练习
  confirmSpecialPractice(grammarType) {
    // 直接使用原始分类名称，不再进行映射
    const typeName = grammarType || '综合练习';
    
    wx.showModal({
      title: '专项练习提醒',
      content: `同类语法点(${typeName})错误三次，是否进入专项练习补漏？`,
      confirmText: '进入练习',
      cancelText: '稍后再说',
      success: (res) => {
        if (res.confirm) {
          this.goSpecialPractice(grammarType);
        }
      }
    });
  },

  // 跳转到专项练习
  goSpecialPractice(grammarType) {
    // 跳转到专项练习页面
    const url = `/pages/special-practice/index?type=${grammarType}`;
    wx.navigateTo({
      url: url,
      success: () => {
        console.log(`跳转到${grammarType}专项练习成功`);
      },
      fail: (error) => {
        console.error(`跳转到${grammarType}专项练习失败:`, error);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 显示后缀知识卡片
  showSuffixCard(e) {
    const index = e.currentTarget.dataset.index || this.data.currentQuestionIndex;
    
    // 获取指定题目的标准化类型
    const currentQuestion = this.data.questions[index];
    const standardizedType = this.getStandardizedQuestionType(currentQuestion);
    
    console.log('点击笔记按钮:', {
      index,
      currentQuestion,
      standardizedType,
      subCategory: currentQuestion.subCategory,
      category: currentQuestion.category
    });
    
    // 根据当前题目类型获取对应的笔记数据
    const noteData = this.getNoteDataByQuestionType(standardizedType);
    const tableIds = this.getTableIdsByQuestionType(standardizedType);
    
    console.log('获取到的数据:', {
      noteData: noteData ? noteData.id : null,
      tableIds,
      notesDataKeys: Object.keys(this.data.notesData || {})
    });
    
    // 解析笔记内容为结构化数据，用于原生WXML组件显示
    let structuredContent = null;
    if (noteData && (noteData.noteContent || noteData.content)) {
      const contentToParse = noteData.noteContent || noteData.content;
      structuredContent = this.parseNoteContentToStructuredData(contentToParse);
      console.log('解析后的结构化内容:', structuredContent);
    }
    
    // 保留原有的HTML转换，作为备用
    if (noteData && (noteData.noteContent || noteData.content)) {
      const contentToConvert = noteData.noteContent || noteData.content;
      noteData.htmlContent = this.convertMarkdownToHtml(contentToConvert);
    }
    
    this.setData({
      showSuffixCard: true,
      currentNoteData: noteData,
      currentStructuredContent: structuredContent,
      currentTableIds: tableIds,
      currentGrammarType: standardizedType,
      currentQuestionType: standardizedType,
      currentQuestionIndex: index
    });
  },

  // 显示书写规则卡片
  showRuleCard(e) {
    const index = e.currentTarget.dataset.index || this.data.currentQuestionIndex;
    
    // 获取指定题目的标准化类型
    const currentQuestion = this.data.questions[index];
    const standardizedType = this.getStandardizedQuestionType(currentQuestion);
    
    // 根据当前题目类型获取对应的笔记数据
    const noteData = this.getNoteDataByQuestionType(standardizedType);
    const tableIds = this.getTableIdsByQuestionType(standardizedType);
    
    console.log('获取到的数据:', {
      noteData: noteData ? noteData.id : null,
      tableIds,
      notesDataKeys: Object.keys(this.data.notesData || {})
    });
    
    // 详细调试noteData
    console.log('noteData 详细信息:', {
      noteData: noteData,
      type: typeof noteData,
      hasContent: noteData && noteData.content,
      contentLength: noteData && noteData.content ? noteData.content.length : 0
    });
    
    // 解析笔记内容为结构化数据，用于原生WXML组件显示
    let structuredContent = null;
    if (noteData && (noteData.noteContent || noteData.content)) {
      const contentToParse = noteData.noteContent || noteData.content;
      structuredContent = this.parseNoteContentToStructuredData(contentToParse);
      console.log('解析后的结构化内容:', structuredContent);
    }
    
    // 保留原有的HTML转换，作为备用
    if (noteData && (noteData.noteContent || noteData.content)) {
      const contentToConvert = noteData.noteContent || noteData.content;
      noteData.htmlContent = this.convertMarkdownToHtml(contentToConvert);
    } else {
      console.warn('noteData 或 content 为空:', {
        noteData: !!noteData,
        hasContent: noteData && (!!noteData.noteContent || !!noteData.content)
      });
    }
    
    this.setData({
      showRuleCard: true,
      currentNoteData: noteData,
      currentStructuredContent: structuredContent,
      currentTableIds: tableIds,
      currentGrammarType: standardizedType,
      currentQuestionType: standardizedType,
      currentQuestionIndex: index
    });
  },

  // 新增：显示表格卡片
  showTableCard(e) {
    const index = e.currentTarget.dataset.index || this.data.currentQuestionIndex;
    
    // 获取指定题目的标准化类型
    const currentQuestion = this.data.questions[index];
    const standardizedType = this.getStandardizedQuestionType(currentQuestion);
    
    console.log('点击表格按钮:', {
      index,
      currentQuestion,
      standardizedType,
      subCategory: currentQuestion.subCategory,
      category: currentQuestion.category,
      tag: currentQuestion.tag
    });
    
    // 根据当前题目类型获取对应的表格数据
    const tableIds = this.getTableIdsByQuestionType(standardizedType);
    const tableData = this.getTableDataByQuestionType(standardizedType);
    
    console.log('获取到的表格数据:', {
      tableIds,
      tableData: tableData ? tableData.id : null,
      tablesDataKeys: Object.keys(this.data.tablesData || {})
    });
    
    // 处理表格数据，创建练习版本（隐藏答案）
    let exerciseTableData = null;
    if (tableData) {
      exerciseTableData = this.createExerciseTableData(tableData);
      console.log('处理新的表格数据格式:', exerciseTableData);
    }
    
    this.setData({
      showTableCard: true,
      currentTableData: exerciseTableData,
      originalTableData: tableData, // 保存原始数据用于显示答案
      currentTableIds: tableIds,
      currentGrammarType: standardizedType,
      currentQuestionType: standardizedType,
      currentQuestionIndex: index,
      showTableAnswers: false, // 默认不显示答案
      tableUserInputs: {}, // 清除之前的用户输入
      tableInputStatus: {}, // 清除之前的输入状态
      ruleShowFullContent: {} // 初始化规则显示状态
    });
  },

  // 关闭知识卡片
  closeCard(type) {
    if (type === 'suffix') {
      this.setData({ showSuffixCard: false });
    } else if (type === 'rule') {
      this.setData({ showRuleCard: false });
    }
  },

  // 关闭后缀知识卡片
  closeSuffixCard() {
    this.setData({ showSuffixCard: false });
  },

  // 关闭书写规则知识卡片
  closeRuleCard() {
    this.setData({ showRuleCard: false });
  },

  // 新增：关闭表格卡片
  closeTableCard() {
    // 清除表格相关的状态数据
    this.setData({ 
      showTableCard: false,
      tableUserInputs: {},
      tableInputStatus: {},
      showTableAnswers: false
    });
  },

  // 新增：查看答案
  showTableAnswers() {
    this.setData({
      showTableAnswers: true
    });
  },

  // 新增：隐藏答案
  hideTableAnswers() {
    this.setData({
      showTableAnswers: false
    });
  },

  // 新增：跳转到表格练习
  goTablePractice() {
    this.closeTableCard();
    
    // 使用动态获取的表格ID
    const tableIds = this.data.currentTableIds.join(',');
    const grammarType = this.data.currentGrammarType;
    
    const url = `/pages/exercise-page/index?tables=${tableIds}&type=${grammarType}&mode=special`;
    wx.navigateTo({
      url: url,
      success: () => {
        console.log('跳转到表格练习成功');
      },
      fail: (error) => {
        console.error('跳转失败:', error);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 跳转到后缀集训表格
  goSuffixTable() {
    this.closeSuffixCard();
    
    // 使用动态获取的表格ID
    const tableIds = this.data.currentTableIds.join(',');
    const grammarType = this.data.currentGrammarType;
    
    const url = `/pages/exercise-page/index?tables=${tableIds}&type=${grammarType}&mode=special`;
    wx.navigateTo({
      url: url,
      success: () => {
        console.log('跳转到后缀集训表格成功');
      },
      fail: (error) => {
        console.error('跳转失败:', error);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 跳转到书写规范训练
  goRuleTable() {
    this.closeRuleCard();
    
    // 使用动态获取的表格ID
    const tableIds = this.data.currentTableIds.join(',');
    const grammarType = this.data.currentGrammarType;
    
    const url = `/pages/exercise-page/index?tables=${tableIds}&type=${grammarType}&mode=special`;
    wx.navigateTo({
      url: url,
      success: () => {
        console.log('跳转到书写规范训练成功');
      },
      fail: (error) => {
        console.error('跳转失败:', error);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 新增：根据题目类型获取笔记数据
  getNoteDataByQuestionType(questionType) {
    const notesData = this.data.notesData;
    
    console.log('getNoteDataByQuestionType 调用:', {
      questionType,
      notesDataKeys: Object.keys(notesData || {})
    });
    
    // 根据题目类型映射到对应的笔记ID
    const noteMapping = {
      // 谓语相关映射（与getStandardizedQuestionType保持一致）
      'tense-simple-present': 'tense_note_001', // 谓语(1) - 一般现在时
      'tense-simple-past': 'tense_note_002', // 谓语(2) - 一般过去时
      'tense-simple-future': 'tense_note_003', // 谓语(3) - 一般将来时
      'tense-past-future': 'tense_note_004', // 谓语(4) - 过去将来时
      'tense-present-continuous': 'tense_note_005', // 谓语(5) - 现在进行时
      'tense-past-continuous': 'tense_note_006', // 谓语(6) - 过去进行时
      'tense-present-perfect': 'tense_note_007', // 谓语(7) - 现在完成时
      'tense-past-perfect': 'tense_note_008', // 谓语(8) - 过去完成时
      'passive-voice': 'voice_note_001', // 谓语(9) - 被动语态
      
      // 名词相关映射
      'noun-overview': 'noun_note_001', // 名词(1) - 名词笔记(概述)
      'noun-plural-rules': 'noun_note_002', // 名词(2) - 名词笔记(复数规则)
      'noun-o-ending': 'noun_note_003', // 名词(3) - 名词笔记(以o结尾)
      'noun-y-ending': 'noun_note_004', // 名词(4) - 名词笔记(以y结尾)
      'noun-s-sh-ch-x-ending': 'noun_note_005', // 名词(5) - 名词笔记(s/sh/ch/x结尾)
      'noun-f-fe-ending': 'noun_note_006', // 名词(6) - 名词笔记(f/fe结尾)
      
      // 代词相关映射
      'pronoun-overview': 'pronoun_note_001', // 代词(1) - 代词笔记(综合)
      'pronoun-personal': 'pronoun_note_002', // 代词(2) - 代词笔记(人称代词)
      'pronoun-possessive': 'pronoun_note_003', // 代词(3) - 代词笔记(物主代词)
      'pronoun-reflexive': 'pronoun_note_004', // 代词(4) - 代词笔记(反身代词)
      'pronoun-relative': 'pronoun_note_005', // 代词(5) - 代词笔记(关系代词)
      'pronoun-it': 'pronoun_note_006', // 代词(6) - 代词笔记(it相关)
      
      // 形容词相关映射
      'adjective-comparative': 'comparative_note_001', // 形容词(1) - 比较级笔记
      'adjective-superlative': 'superlative_note_001', // 形容词(2) - 最高级笔记
      
      // 副词相关映射
      'adverb-overview': 'adverb_note_002', // 副词(1) - 副词笔记(概述) - 使用adverb_note_002作为概述
      'adverb-formation': 'adverb_note_002', // 副词(2) - 副词笔记(修饰动词)
      'adverb-usage': 'adverb_note_003', // 副词(3) - 副词笔记(修饰形容词/副词)
      'adverb-sentence': 'adverb_note_004', // 副词(4) - 副词笔记(修饰句子)
      
      // 非谓语相关映射
      'participle-present': 'participle_note_001', // 非谓语(1) - 现在分词笔记
      'participle-past': 'participle_note_002', // 非谓语(2) - 过去分词笔记
      'participle-infinitive': 'participle_note_003', // 非谓语(3) - 不定式笔记
      
      // 连词相关映射
      'conjunction-coordinating': 'conjunction_note_001', // 连词(1) - 并列连词综合
      'conjunction-subordinating': 'conjunction_note_002', // 连词(2) - 从属连词综合
      'conjunction-comprehensive': 'conjunction_note_003', // 连词(3) - 连词与名/动/形/副综合
      'conjunction-noun': 'conjunction_note_004', // 连词(4) - 连词与名词
      'conjunction-verb': 'conjunction_note_005', // 连词(5) - 连词与动词
      'conjunction-adjective': 'conjunction_note_006', // 连词(6) - 连词与形容词
      
      // 介词相关映射
      'preposition-overview': 'preposition_note_001', // 介词(1) - 介词笔记(常见介词)
      'preposition-phrases': 'preposition_note_002', // 介词(2) - 介词笔记(常见搭配)
      'preposition-gerund': 'preposition_note_003', // 介词(3) - 介词笔记(介词+名词/动名词)
      
      // 定语从句相关映射
      'relative-clause-overview': 'relative_clause_note_001', // 定语从句(1) - 定语从句概述
      'relative-clause-basic': 'relative_clause_note_002', // 定语从句(2) - 定语从句基础
      'relative-clause-advanced': 'relative_clause_note_003', // 定语从句(3) - 定语从句进阶
      'relative-clause-restrictive': 'relative_clause_note_004', // 定语从句(4) - 限制性定语从句
      'relative-clause-non-restrictive': 'relative_clause_note_005', // 定语从句(5) - 非限制性定语从句
      
      // 状语从句相关映射
      'adverbial-clause-overview': 'adverbial_clause_note_001', // 状语从句(1) - 状语从句概述
      'adverbial-clause-time': 'adverbial_clause_note_002', // 状语从句(2) - 时间状语从句
      'adverbial-clause-condition': 'adverbial_clause_note_003', // 状语从句(3) - 条件状语从句
      'adverbial-clause-cause': 'adverbial_clause_note_004', // 状语从句(4) - 原因状语从句
      'adverbial-clause-concession': 'adverbial_clause_note_005', // 状语从句(5) - 让步状语从句
      
      // 冠词相关映射
      'article-overview': 'article_note_001', // 冠词(1) - 冠词笔记(冠词综合)
      'article-specific': 'article_note_002', // 冠词(2) - 冠词笔记(泛指与特指)
      'article-a-an': 'article_note_003', // 冠词(3) - 冠词笔记(a和an)
      'article-the': 'article_note_004', // 冠词(4) - 冠词笔记(the的特殊用法)
      
      // 其他语法点映射（保持向后兼容）
      'noun-plural': 'noun_note_002', // 名词复数
      'verb-tense': 'tense_note_002', // 动词时态
      'pronoun': 'pronoun_note_001', // 代词
      'preposition': 'preposition_note_001', // 介词
      'future-simple': 'tense_note_003', // 一般将来时
      'present-continuous': 'tense_note_005', // 现在进行时
      'past-continuous': 'tense_note_006', // 过去进行时
      'present-perfect': 'tense_note_007', // 现在完成时
      'past-perfect': 'tense_note_008', // 过去完成时
    };
    
    const noteId = noteMapping[questionType];
    let result = noteId ? notesData[noteId] : null;
    
    console.log('getNoteDataByQuestionType 结果:', {
      questionType,
      noteId,
      result: result ? (typeof result === 'object' ? result.id : result) : null
    });
    
    // 确保返回的是对象而不是字符串
    if (result && typeof result === 'string') {
      console.warn('笔记数据是字符串，尝试从notesData中获取对象:', result);
      result = notesData[result] || null;
      console.log('从notesData获取的结果:', result);
    }
    
    return result;
  },

  // 新增：根据题目类型获取表格ID列表
  getTableIdsByQuestionType(questionType) {
    // 根据题目类型映射到对应的表格ID
    const tableMapping = {
      // 谓语相关映射（与getStandardizedQuestionType保持一致）
      'tense-simple-present': ['tense_table_001'], // 谓语(1) - 一般现在时表格
      'tense-simple-past': ['tense_table_002'], // 谓语(2) - 一般过去时表格
      'tense-simple-future': ['tense_table_003'], // 谓语(3) - 一般将来时表格
      'tense-past-future': ['tense_table_004'], // 谓语(4) - 过去将来时表格
      'tense-present-continuous': ['tense_table_005'], // 谓语(5) - 现在进行时表格
      'tense-past-continuous': ['tense_table_006'], // 谓语(6) - 过去进行时表格
      'tense-present-perfect': ['tense_table_007'], // 谓语(7) - 现在完成时表格
      'tense-past-perfect': ['tense_table_008'], // 谓语(8) - 过去完成时表格
      'passive-voice': ['voice_table_001'], // 谓语(9) - 被动语态表格
      
      // 名词相关映射
      'noun-overview': ['noun_table_001'], // 名词(1) - 名词后缀识别表格
      'noun-plural-rules': ['noun_table_002'], // 名词(2) - 名词复数规则练习表格
      'noun-o-ending': ['noun_table_003'], // 名词(3) - 以o结尾名词复数练习表格
      'noun-y-ending': ['noun_table_004'], // 名词(4) - 以y结尾名词复数练习表格
      'noun-s-sh-ch-x-ending': ['noun_table_005'], // 名词(5) - s/sh/ch/x结尾名词复数练习表格
      'noun-f-fe-ending': ['noun_table_006'], // 名词(6) - f/fe结尾名词复数练习表格
      
      // 代词相关映射
      'pronoun-overview': ['pronoun_table_001'], // 代词(1) - 人称物主反身代词整表
      'pronoun-personal': ['pronoun_table_002'], // 代词(2) - 人称代词练习表格
      'pronoun-possessive': ['pronoun_table_003'], // 代词(3) - 物主代词练习表格
      'pronoun-reflexive': ['pronoun_table_004'], // 代词(4) - 反身代词练习表格
      'pronoun-relative': ['pronoun_table_005'], // 代词(5) - 关系代词练习表格
      'pronoun-it': ['pronoun_table_006'], // 代词(6) - it相关用法练习表格
      
      // 连词相关映射
      'conjunction-coordinating': ['conjunction_table_001'], // 连词(1) - 并列连词综合练习表格
      'conjunction-subordinating': ['conjunction_table_002'], // 连词(2) - 从属连词综合练习表格
      'conjunction-comprehensive': ['conjunction_table_003'], // 连词(3) - 连词与名/动/形/副综合练习表格
      'conjunction-noun': ['conjunction_table_004'], // 连词(4) - 连词与名词练习表格
      'conjunction-verb': ['conjunction_table_005'], // 连词(5) - 连词与动词练习表格
      'conjunction-adjective': ['conjunction_table_006'], // 连词(6) - 连词与形容词练习表格
      
      // 介词相关映射
      'preposition-overview': ['preposition_table_001'], // 介词(1) - 介词书写(常见介词)
      'preposition-phrases': ['preposition_table_002'], // 介词(2) - 介词书写(常见搭配)
      'preposition-gerund': ['preposition_table_003'], // 介词(3) - 介词书写(介词+名词/动名词)
      
      // 定语从句相关映射
      'relative-clause-overview': ['relative_clause_table_001'], // 定语从句(1) - 定语从句概述表格
      'relative-clause-basic': ['relative_clause_table_002'], // 定语从句(2) - 定语从句基础表格
      'relative-clause-advanced': ['relative_clause_table_003'], // 定语从句(3) - 定语从句进阶表格
      'relative-clause-restrictive': ['relative_clause_table_004'], // 定语从句(4) - 限制性定语从句表格
      'relative-clause-non-restrictive': ['relative_clause_table_005'], // 定语从句(5) - 非限制性定语从句表格
      
      // 状语从句相关映射
      'adverbial-clause-overview': ['adverbial_clause_table_001'], // 状语从句(1) - 状语从句概述表格
      'adverbial-clause-time': ['adverbial_clause_table_002'], // 状语从句(2) - 时间状语从句表格
      'adverbial-clause-condition': ['adverbial_clause_table_003'], // 状语从句(3) - 条件状语从句表格
      'adverbial-clause-cause': ['adverbial_clause_table_004'], // 状语从句(4) - 原因状语从句表格
      'adverbial-clause-concession': ['adverbial_clause_table_005'], // 状语从句(5) - 让步状语从句表格
      
      // 形容词相关映射
      'adjective-comparative': ['comparative_table_001'], // 形容词(1) - 比较级书写表格
      'adjective-superlative': ['superlative_table_001'], // 形容词(2) - 最高级书写表格
      
      // 副词相关映射
      'adverb-overview': ['adverb_table_002'], // 副词(1) - 副词概述表格 - 使用adverb_table_002作为概述
      'adverb-formation': ['adverb_table_002'], // 副词(2) - 副词书写(修饰动词)表格
      'adverb-usage': ['adverb_table_003'], // 副词(3) - 副词书写(修饰形容词/副词)表格
      'adverb-sentence': ['adverb_table_004'], // 副词(4) - 副词书写(修饰句子)表格
      
      // 非谓语相关映射
      'participle-present': ['participle_table_001'], // 非谓语(1) - 现在分词书写表格
      'participle-past': ['participle_table_002'], // 非谓语(2) - 过去分词书写表格
      'participle-infinitive': ['participle_table_003'], // 非谓语(3) - 不定式书写表格
      
      // 冠词相关映射
      'article-overview': ['article_table_001'], // 冠词(1) - 冠词练习(冠词综合)
      'article-specific': ['article_table_002'], // 冠词(2) - 冠词练习(泛指与特指)
      'article-a-an': ['article_table_003'], // 冠词(3) - 冠词练习(a和an)
      'article-the': ['article_table_004'], // 冠词(4) - 冠词练习(the的特殊用法)
      
      // 其他语法点映射（保持向后兼容）
      'noun-plural': ['noun_table_002'], // 名词复数表格
      'verb-tense': ['tense_table_002'], // 动词时态表格
      'pronoun': ['pronoun_table_001'], // 代词表格
      'future-simple': ['tense_table_003'], // 一般将来时表格
      'present-continuous': ['tense_table_005'], // 现在进行时表格
      'past-continuous': ['tense_table_006'], // 过去进行时表格
      'present-perfect': ['tense_table_007'], // 现在完成时表格
      'past-perfect': ['tense_table_008'], // 过去完成时表格
    };
    
    return tableMapping[questionType] || [];
  },

  // 新增：根据题目类型获取表格数据
  getTableDataByQuestionType(questionType) {
    const tablesData = this.data.tablesData;
    const tableIds = this.getTableIdsByQuestionType(questionType);
    
    // 返回第一个表格的数据（如果有多个表格，可以后续扩展）
    if (tableIds.length > 0) {
      return tablesData[tableIds[0]] || null;
    }
    
    return null;
  },

  // 新增：处理表格输入
  onTableInput(e) {
    const { tableId, cellId, row, col, answerIndex } = e.currentTarget.dataset;
    const value = e.detail.value;

    // 检查是否为旧的表格数据结构（使用tableId和cellId）
    if (tableId && cellId) {
      // 使用旧的表格输入处理逻辑
      const tableAnswers = { ...this.data.tableAnswers };
      if (!tableAnswers[tableId]) {
        tableAnswers[tableId] = {};
      }
      tableAnswers[tableId][cellId] = value;
      
      // 检查答案是否正确或错误
      const showCorrect = { ...this.data.showCorrect };
      if (!showCorrect[tableId]) {
        showCorrect[tableId] = {};
      }
      const correctAnswer = this.data.correctAnswers[tableId][cellId];
      
      if (!value || value.trim() === '') {
        showCorrect[tableId][cellId] = null; // 未答
      } else {
        let isCorrect = false;
        
        if (tableId === 'noun_002') {
          // noun_002特殊处理：用户输入选项字母，需要转换为对应单词
          const userInput = value.trim().toUpperCase();
          if (userInput >= 'A' && userInput <= 'D') {
            const optionIndex = userInput.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
            const cellIndex = parseInt(cellId.split('_')[1]) - 1; // 获取行号
            const rowStartIndex = Math.floor(cellIndex / 4) * 4; // 每行4个选项
            const targetCellIndex = rowStartIndex + optionIndex;
            
                          if (this.data.tableData[tableId][targetCellIndex]) {
                const selectedWord = this.data.tableData[tableId][targetCellIndex].question;
                isCorrect = this.checkAnswer(selectedWord, correctAnswer);
              }
          }
        } else {
          // 其他表格的常规验证
          if (correctAnswer) {
            isCorrect = this.checkAnswer(value, correctAnswer);
          }
        }
        
        showCorrect[tableId][cellId] = isCorrect;
      }
      
      // 新增：处理placeholder清除逻辑（仅对带有"_table_"的id生效）
      if (tableId.includes('_table_')) {
        // 获取当前单元格的placeholder内容
        const currentCell = this.data.tableData[tableId].find(cell => cell.cell_id === cellId);
        if (currentCell && currentCell.placeholder) {
          // 如果用户输入的内容与placeholder内容一致，则清除placeholder
          if (value === currentCell.placeholder) {
            // 更新单元格的placeholder为空
            const updatedTableData = [...this.data.tableData[tableId]];
            const cellIndex = updatedTableData.findIndex(cell => cell.cell_id === cellId);
            if (cellIndex !== -1) {
              updatedTableData[cellIndex] = {
                ...updatedTableData[cellIndex],
                placeholder: ''
              };
              
              this.setData({
                [`tableData.${tableId}`]: updatedTableData
              });
            }
          }
        }
      }
      
      // 清除之前的延迟判断定时器
      const inputKey = `${tableId}_${cellId}`;
      if (this.inputDelayTimers && this.inputDelayTimers[inputKey]) {
        clearTimeout(this.inputDelayTimers[inputKey]);
      }
      
      // 初始化延迟判断定时器对象
      if (!this.inputDelayTimers) {
        this.inputDelayTimers = {};
      }
      
      // 设置延迟判断（1秒后判断，避免频繁判断）
      this.inputDelayTimers[inputKey] = setTimeout(() => {
        this.delayedAnswerCheckOldTable(inputKey, value, tableId, cellId, correctAnswer);
      }, 1000);
      
      this.setData({
        tableAnswers,
        showCorrect
      });
      
      console.log(`表格输入: 表格${tableId}行${row || 'undefined'}列${col || 'undefined'}答案${answerIndex || 0}, 用户答案"${value}", 延迟判断中...`);
      return;
    }
    
    // 新的表格数据结构处理逻辑
    // 获取当前表格ID作为状态标识
    const currentTableId = this.data.currentTableData ? this.data.currentTableData.id : 'default';
    
    // 构建输入键，包含表格ID以区分不同表格的状态
    const inputKey = answerIndex !== undefined ? `${currentTableId}_${row}_${col}_${answerIndex}` : `${currentTableId}_${row}_${col}`;
    
    // 更新用户输入
    const tableUserInputs = { ...this.data.tableUserInputs };
    tableUserInputs[inputKey] = value;
    
    // 清除之前的延迟判断定时器
    if (this.inputDelayTimers && this.inputDelayTimers[inputKey]) {
      clearTimeout(this.inputDelayTimers[inputKey]);
    }
    
    // 初始化延迟判断定时器对象
    if (!this.inputDelayTimers) {
      this.inputDelayTimers = {};
    }
    
    // 设置延迟判断（1秒后判断，避免频繁判断）
    this.inputDelayTimers[inputKey] = setTimeout(() => {
      this.delayedAnswerCheck(inputKey, value, row, col, answerIndex, currentTableId);
    }, 1000);
    
    // 立即更新输入状态为中性（不清除之前的正确状态）
    const tableInputStatus = { ...this.data.tableInputStatus };
    if (value && !tableInputStatus[inputKey]) {
      // 只有在有输入且之前没有状态时才设置为中性状态
      tableInputStatus[inputKey] = '';
    }
    
    // 新增：处理placeholder清除逻辑（仅对带有"_table_"的id生效）
    if (currentTableId.includes('_table_')) {
      // 获取当前单元格的placeholder内容
      const currentCell = this.data.currentTableData.exerciseRows[row][col];
      const placeholderText = currentCell.placeholder || '请输入答案';
      
      // 如果用户输入的内容与placeholder内容一致，则清除placeholder
      if (value === placeholderText) {
        // 更新单元格的placeholder为空
        const updatedExerciseRows = [...this.data.currentTableData.exerciseRows];
        updatedExerciseRows[row][col] = {
          ...updatedExerciseRows[row][col],
          placeholder: ''
        };
        
        this.setData({
          currentTableData: {
            ...this.data.currentTableData,
            exerciseRows: updatedExerciseRows
          }
        });
      }
    }
    
    this.setData({
      tableUserInputs,
      tableInputStatus
    });
    
    console.log(`表格输入: 表格${currentTableId}行${row}列${col}答案${answerIndex || 0}, 用户答案"${value}", 延迟判断中...`);
  },

  // 新增：延迟答案检查方法
  delayedAnswerCheck(inputKey, value, row, col, answerIndex, currentTableId) {
    // 获取正确答案
    const correctAnswer = this.getTableCorrectAnswer(row, col, answerIndex);
    
    // 判断答案是否正确（使用完整的答案验证逻辑）
    const isCorrect = this.checkAnswer(value, correctAnswer);
    
    // 更新输入状态
    const tableInputStatus = { ...this.data.tableInputStatus };
    tableInputStatus[inputKey] = isCorrect ? 'correct' : (value ? 'wrong' : '');
    
    this.setData({
      tableInputStatus
    });
    
    console.log(`延迟判断: 表格${currentTableId}行${row}列${col}答案${answerIndex || 0}, 用户答案"${value}", 正确答案"${correctAnswer}", 结果${isCorrect ? '正确' : '错误'}`);
    
    // 自动更新书写题统计（不需要等待提交批改）
    this.updateWritingStatsFromNewTable(currentTableId, row, col, answerIndex, isCorrect);
  },

  // 新增：旧表格数据结构的延迟答案检查方法
  delayedAnswerCheckOldTable(inputKey, value, tableId, cellId, correctAnswer) {
    // 重新计算答案是否正确
    const isCorrect = this.checkAnswer(value, correctAnswer);
    
    // 更新showCorrect状态
    const showCorrect = { ...this.data.showCorrect };
    if (!showCorrect[tableId]) {
      showCorrect[tableId] = {};
    }
    showCorrect[tableId][cellId] = isCorrect;
    
    this.setData({
      showCorrect
    });
    
    console.log(`延迟判断(旧表格): 表格${tableId}单元格${cellId}, 用户答案"${value}", 正确答案"${correctAnswer}", 结果${isCorrect ? '正确' : '错误'}`);
    
    // 自动更新书写题统计（不需要等待提交批改）
    this.updateWritingStatsFromTable(tableId, cellId, isCorrect);
  },

  // 新增：获取表格正确答案
  getTableCorrectAnswer(row, col, answerIndex = 0) {
    const tableData = this.data.currentTableData;
    if (tableData && tableData.exerciseRows && tableData.exerciseRows[row]) {
      const cell = tableData.exerciseRows[row][col];
      if (cell) {
        // 处理分离显示模式
        if (cell.type === 'separated-input' && cell.answers && cell.answers[answerIndex]) {
          return cell.answers[answerIndex];
        }
        // 处理多输入框模式
        if (cell.type === 'multi-input' && cell.answers && cell.answers[answerIndex]) {
          return cell.answers[answerIndex];
        }
        // 处理普通输入框模式
        if (cell.type === 'input' && cell.answer) {
          return cell.answer;
        }
        // 处理单词输入框模式（形容词表格）
        if (cell.type === 'word-input' && cell.answer) {
          return cell.answer;
        }
      }
    }
    return '';
  },

  // 新增：获取表格输入键
  getTableInputKey(row, col, answerIndex = null) {
    const currentTableId = this.data.currentTableData ? this.data.currentTableData.id : 'default';
    return answerIndex !== null ? `${currentTableId}_${row}_${col}_${answerIndex}` : `${currentTableId}_${row}_${col}`;
  },

  // 新增：获取表格输入值
  getTableInputValue(row, col, answerIndex = null) {
    const key = this.getTableInputKey(row, col, answerIndex);
    return this.data.tableUserInputs[key] || '';
  },

  // 新增：获取表格输入状态
  getTableInputStatus(row, col, answerIndex = null) {
    const key = this.getTableInputKey(row, col, answerIndex);
    return this.data.tableInputStatus[key] || '';
  },

  // 新增：创建练习表格数据（隐藏答案）
  createExerciseTableData(tableData) {
    if (!tableData) {
      return tableData;
    }

    // 处理新的表格数据格式（tableData.headers 和 tableData.rows）
    if (tableData.tableData && tableData.tableData.headers && tableData.tableData.rows) {
      console.log('处理新的表格数据格式:', tableData.tableData);
      
      const exerciseRows = [];
      
      // 智能判断表头是否为练习内容
      const shouldRemoveHeader = this.isHeaderActuallyContent(tableData.tableData.headers, tableData.tableData.rows);
      
      if (!shouldRemoveHeader) {
        // 添加表头行
        const headerRow = tableData.tableData.headers.map(header => ({
          type: 'text',
          text: header
        }));
        exerciseRows.push(headerRow);
      }
      
      // 添加数据行 - 创建练习版本
      tableData.tableData.rows.forEach(row => {
        // 对于形容词比较级和最高级表格，需要重新组织数据结构
        if (tableData.id === 'comparative_table_001' || tableData.id === 'superlative_table_001') {
          // 每行包含5列：4个单词+输入框组合 + 1个规则
          const word1 = row[0]; // fast
          const word2 = row[1]; // hard
          const word3 = row[2]; // short
          const word4 = row[3]; // clean
          const rule = row[4]; // 规则一：一般情况直接加er
          
          // 创建单词到答案的映射
          const wordAnswerMap = this.getWordAnswerMap(tableData.id);
          
          // 创建新行：5列（4个单词+输入框组合 + 1个规则）
          const newRow = [
            // 第1列：单词+输入框
            { 
              type: 'word-input', 
              word: word1,
              answer: wordAnswerMap[word1] || '',
              placeholder: '请输入答案'
            },
            // 第2列：单词+输入框
            { 
              type: 'word-input', 
              word: word2,
              answer: wordAnswerMap[word2] || '',
              placeholder: '请输入答案'
            },
            // 第3列：单词+输入框
            { 
              type: 'word-input', 
              word: word3,
              answer: wordAnswerMap[word3] || '',
              placeholder: '请输入答案'
            },
            // 第4列：单词+输入框
            { 
              type: 'word-input', 
              word: word4,
              answer: wordAnswerMap[word4] || '',
              placeholder: '请输入答案'
            },
            // 第5列：规则
            { 
              type: 'clickable-rule', 
              text: rule,
              fullContent: this.getRuleFullContent(rule, tableData.id)
            }
          ];
          
          exerciseRows.push(newRow);
          return; // 跳过原来的处理逻辑
        }
        
        const exerciseRow = row.map((cell, index) => {
          // 第一列通常是题目或说明，作为文本显示
          if (index === 0) {
            return { type: 'text', text: cell };
      } else {
            // 其他列需要特殊处理
            if (typeof cell === 'string') {
              // 对于副词(4)表格的特殊处理
              if (tableData.id === 'adverb_table_004') {
                // 第二列：只显示"整个句子"作为提示，不显示答案
                if (index === 1) {
                  return { 
                    type: 'text', 
                    text: cell,
                    style: 'font-weight: bold; color: #1890ff;'
                  };
                }
                // 第三列：直接展示规则内容，不做交互
                else if (index === 2) {
                  return { 
                    type: 'text', 
                    text: cell,
                    style: 'font-size: 14px; color: #333;'
                  };
                }
                // 第四列：保留答案供用户输入
                else if (index === 3) {
                  return {
                    type: 'input',
                    placeholder: '请输入答案',
                    answer: cell
                  };
                }
              }
              
              // 对于形容词比较级和最高级表格的特殊处理
              if (tableData.id === 'comparative_table_001' || tableData.id === 'superlative_table_001') {
                // 每行包含4个单词+4个输入框+1个规则，需要重新组织数据结构
                // 这里先按原逻辑处理，后面会重新组织
                if (index === 0) {
                  return { 
                    type: 'clickable-rule', 
                    text: cell,
                    fullContent: this.getRuleFullContent(cell, tableData.id)
                  };
                }
                // 第二列是原形，显示为提示词
                else if (index === 1) {
                  return { 
                    type: 'text', 
                    text: cell,
                    style: 'font-weight: bold; color: #1890ff;'
                  };
                }
                // 第三列是比较级/最高级，需要输入
                else if (index === 2) {
                  return {
                    type: 'input',
                    placeholder: '请输入答案',
                    answer: cell
                  };
                }
                // 第四列是规则说明，显示为文本
                else if (index === 3) {
                  return { type: 'text', text: cell };
                }
              }
              
              // 对于代词表格的特殊处理
              if (tableData.id.startsWith('pronoun_table_')) {
                // 第一列是人称，作为提示词显示
                if (index === 0) {
                  return { 
                    type: 'text', 
                    text: cell,
                    style: 'font-weight: bold; color: #1890ff;'
                  };
                }
                // 其他列都是答案，需要输入
                else {
                  return {
                    type: 'input',
                    placeholder: '请输入答案',
                    answer: cell
                  };
                }
              }
              
              // 对于介词表格的特殊处理
              if (tableData.id.startsWith('preposition_table_')) {
                // 第一列是意思，作为文本显示（左对齐）
                if (index === 0) {
                  return { 
                    type: 'text', 
                    text: cell
                  };
                }
                // 第二列是介词，只显示输入框，不显示答案提示
                else if (index === 1) {
                  return {
                    type: 'input',
                    placeholder: '请输入答案',
                    answer: cell
                  };
                }
              }
              
              // 对于非谓语表格的特殊处理（现在分词、过去分词、不定式）
              if (tableData.id === 'participle_table_001' || tableData.id === 'participle_table_002' || tableData.id === 'participle_table_003') {
                // 第一列是动词原形，作为提示词显示
                if (index === 0) {
                  return { 
                    type: 'text', 
                    text: cell,
                    style: 'font-weight: bold; color: #1890ff;'
                  };
                }
                // 第二列是答案，需要输入
                else if (index === 1) {
                  return {
                    type: 'input',
                    placeholder: '请输入答案',
                    answer: cell
                  };
                }
              }
              
              // 第二列（变化规则）使用智能规则解析
              if (index === 1) {
                const parsedData = this.parseRuleTextWithUnderscore(cell);
                return {
                  type: 'separated-input',
                  question: parsedData.question,
                  answers: parsedData.answers,
                  originalText: cell
                };
              }
              // 检查是否包含箭头或下划线（表示需要填空的题目）
              else if (cell.includes('→') || cell.includes('_')) {
                // 解析题目和答案
                const parsedData = this.parseQuestionWithAnswers(cell);
                return {
                  type: 'separated-input',
                  question: parsedData.question,
                  answers: parsedData.answers,
                  originalText: cell
                };
              } else if (cell.includes('；')) {
                // 多个答案（用分号分隔）
                const answers = cell.split('；');
                return {
                  type: 'multi-input',
                  placeholder: '请输入答案',
                  answers: answers,
                  originalText: cell
                };
        } else {
                // 单个答案
                return {
                  type: 'input',
                  placeholder: '请输入答案',
                  answer: cell
                };
              }
            } else {
              // 非字符串类型，作为普通输入框
              return {
                type: 'input',
                placeholder: '请输入答案',
                answer: cell
              };
            }
          }
        });
        exerciseRows.push(exerciseRow);
      });
      
      const exerciseData = {
        ...tableData,
        exerciseRows: exerciseRows,
        hasHeader: !shouldRemoveHeader
      };
      
      console.log('生成的练习数据:', exerciseData);
      return exerciseData;
    }
    
    // 处理旧的HTML格式
    if (tableData.content) {
      const exerciseData = {
        ...tableData,
        exerciseRows: this.parseTableContent(tableData.content)
      };
      return exerciseData;
    }

    return tableData;
  },

  // 新增：智能判断表头是否为练习内容
  isHeaderActuallyContent(headers, rows) {
    if (!headers || !rows || rows.length === 0) {
      return false;
    }
    
    // 检查表头是否看起来像具体的单词而不是描述性文字
    const headerText = headers.join(' ').toLowerCase();
    
    // 如果表头包含常见的描述性词汇，则认为是真正的表头
    const descriptiveWords = [
      '规则', '分类', '变化', '示例', '形式', '原形', '复数', '单数', '例句', '先行词', '答案',
      'rule', 'category', 'change', 'example', 'form', 'singular', 'plural',
      '名词', '动词', '形容词', '副词', '介词', '连词', '人称', '关系代词',
      'noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction'
    ];
    
    const hasDescriptiveWords = descriptiveWords.some(word => 
      headerText.includes(word)
    );
    
    if (hasDescriptiveWords) {
      return false; // 有描述性词汇，认为是真正的表头
    }
    
    // 检查表头是否与第一行数据在结构上相似
    if (rows.length > 0) {
      const firstRow = rows[0];
      if (headers.length === firstRow.length) {
        // 检查表头和第一行是否都是简单的单词（没有特殊字符）
        const headerWords = headers.every(header => 
          /^[a-zA-Z\u4e00-\u9fa5]+$/.test(header.trim())
        );
        const firstRowWords = firstRow.every(cell => 
          /^[a-zA-Z\u4e00-\u9fa5]+$/.test(cell.trim())
        );
        
        // 如果表头和第一行都是简单单词，且表头没有描述性词汇，则认为是练习内容
        if (headerWords && firstRowWords && !hasDescriptiveWords) {
          console.log('检测到表头为练习内容，将移除表头显示');
          return true;
        }
      }
    }
    
    // 新增：检查表头是否看起来像具体的英语单词（而不是描述性文字）
    const commonEnglishWords = [
      'boy', 'girl', 'man', 'woman', 'child', 'book', 'pen', 'car', 'house',
      'cat', 'dog', 'bird', 'fish', 'tree', 'flower', 'water', 'food',
      'toy', 'key', 'day', 'city', 'baby', 'family', 'story', 'photo',
      'radio', 'video', 'piano', 'kilo', 'potato', 'tomato', 'hero'
    ];
    
    const headerIsCommonWord = headers.some(header => 
      commonEnglishWords.includes(header.toLowerCase().trim())
    );
    
    if (headerIsCommonWord) {
      console.log('检测到表头包含常见英语单词，将移除表头显示');
      return true;
    }
    
    return false;
  },

  // 新增：解析包含答案的题目
  parseQuestionWithAnswers(cellText) {
    console.log('解析题目和答案:', cellText);
    
    // 处理 "book→books" 格式
    if (cellText.includes('→')) {
      const parts = cellText.split('→');
      if (parts.length === 2) {
        return {
          question: `${parts[0]} → _____`,
          answers: [parts[1]]
        };
      }
    }
    
    // 处理包含下划线的格式
    if (cellText.includes('_')) {
      // 简单的下划线处理，将下划线替换为空格，答案就是下划线部分
      const question = cellText.replace(/_+/g, '_____');
      const answers = [];
      
      // 提取下划线部分作为答案
      const underscoreMatches = cellText.match(/_+/g);
      if (underscoreMatches) {
        // 这里需要根据实际的下划线位置来提取答案
        // 暂时使用简单的逻辑
        const parts = cellText.split(/_+/);
        if (parts.length > 1) {
          // 假设下划线部分被分割出来
          answers.push(parts[1] || '');
        }
      }
      
      return {
        question: question,
        answers: answers.length > 0 ? answers : [cellText]
      };
    }
    
    // 处理包含分号的多个答案格式
    if (cellText.includes('；')) {
      const parts = cellText.split('；');
      const questions = [];
      const answers = [];
      
      parts.forEach(part => {
        if (part.includes('→')) {
          const subParts = part.split('→');
          if (subParts.length === 2) {
            questions.push(`${subParts[0]} → _____`);
            answers.push(subParts[1]);
          }
        } else {
          questions.push(part);
          answers.push(part);
        }
      });
      
      return {
        question: questions.join('；'),
        answers: answers
      };
    }
    
    // 默认处理
    return {
      question: cellText,
      answers: [cellText]
    };
  },

  // 新增：智能解析规则文本，处理下划线后的内容
  parseRuleTextWithUnderscore(cellText) {
    console.log('智能解析规则文本:', cellText);
    
    // 处理包含下划线的规则文本
    if (cellText.includes('_____')) {
      const parts = cellText.split('_____');
      if (parts.length >= 2) {
        const beforeUnderscore = parts[0];
        const afterUnderscore = parts[1];
        
        // 检查下划线后的内容
        const afterMatch = afterUnderscore.match(/^([^\u4e00-\u9fff]*)([\u4e00-\u9fff].*)?$/);
        if (afterMatch) {
          const nonChinesePart = afterMatch[1]; // 非中文部分（可能是答案）
          const chinesePart = afterMatch[2] || ''; // 中文部分（应该显示）
          
          // 验证非中文部分是否为有效答案
          if (nonChinesePart && this.isValidAnswer(nonChinesePart)) {
            return {
              question: beforeUnderscore + '_____' + chinesePart,
              answers: [nonChinesePart]
            };
          }
        }
      }
    }
    
    // 如果没有下划线，使用原来的解析逻辑
    return this.parseRuleText(cellText);
  },

  // 新增：解析规则文本，识别需要填空的位置
  parseRuleText(cellText) {
    console.log('解析规则文本:', cellText);
    
    // 定义需要填空的关键词模式
    const fillPatterns = [
      // 定义词后面
      { pattern: /(是|为)\s*([^，。；\s]+)/g, replace: '$1 _____' },
      // 动词后面
      { pattern: /(变为|加)\s*([^，。；\s]+)/g, replace: '$1 _____' },
      // 象征变化的箭头后面
      { pattern: /(→)\s*([^，。；\s]+)/g, replace: '$1 _____' },
      // 祈使句用词后面
      { pattern: /(需|需要|应该)\s*([^，。；\s]+)/g, replace: '$1 _____' }
    ];
    
    let question = cellText;
    const answers = [];
    
    // 应用每个模式
    fillPatterns.forEach(({ pattern, replace }) => {
      const matches = cellText.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // 提取答案部分
          const answerMatch = match.match(/\s*([^，。；\s]+)$/);
          if (answerMatch) {
            const answer = answerMatch[1];
            // 验证答案的有效性
            if (this.isValidAnswer(answer)) {
              answers.push(answer);
              // 替换为下划线
              question = question.replace(match, match.replace(answer, '_____'));
            }
          }
        });
      }
    });
    
    // 如果没有找到匹配的模式，尝试其他方法
    if (answers.length === 0) {
      // 检查是否包含常见的规则关键词
      const ruleKeywords = ['直接加', '加', '变', '变为', '变成', '需要', '应该'];
      const hasRuleKeyword = ruleKeywords.some(keyword => cellText.includes(keyword));
      
      if (hasRuleKeyword) {
        // 尝试提取最后一个词作为答案
        const words = cellText.split(/[\s，。；]+/);
        const lastWord = words[words.length - 1];
        if (lastWord && lastWord.length > 0 && this.isValidAnswer(lastWord)) {
          answers.push(lastWord);
          question = cellText.replace(lastWord, '_____');
        }
      }
    }
    
    // 如果还是没有找到答案，返回原文本
    if (answers.length === 0) {
      return {
        question: cellText,
        answers: [cellText]
      };
    }
    
    return {
      question: question,
      answers: answers
    };
  },

  // 新增：验证答案的有效性
  isValidAnswer(answer) {
    if (!answer || answer.length === 0) return false;
    
    // 单独的符号不能作为答案
    if (/^[^\w\u4e00-\u9fff]+$/.test(answer)) {
      return false;
    }
    
    // 答案应该包含英文字母或中文
    if (!/[a-zA-Z\u4e00-\u9fff]/.test(answer)) {
      return false;
    }
    
    // 如果是纯符号（如"-"），不算有效答案
    if (/^[^\w\u4e00-\u9fff]+$/.test(answer)) {
      return false;
    }
    
    return true;
  },

  // 新增：格式化笔记内容，将Markdown表格转换为更易读的格式
  formatNoteContent(content) {
    if (!content) return '';
    
    // 将Markdown表格转换为更易读的格式
    let formattedContent = content;
    
    // 匹配Markdown表格的正则表达式
    const tableRegex = /\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]*)\|/g;
    
    // 替换表格分隔符行为分隔线
    formattedContent = formattedContent.replace(/\|------\|/g, '─────────');
    
    // 将表格行转换为更易读的格式
    formattedContent = formattedContent.replace(tableRegex, (match, col1, col2, col3, col4) => {
      const cell1 = col1.trim();
      const cell2 = col2.trim();
      const cell3 = col3.trim();
      const cell4 = col4.trim();
      
      if (cell4) {
        // 4列表格
        return `${cell1}  |  ${cell2}  |  ${cell3}  |  ${cell4}`;
      } else {
        // 3列表格
        return `${cell1}  |  ${cell2}  |  ${cell3}`;
      }
    });
    
    return formattedContent;
  },

  // 新增：解析表格内容
  parseTableContent(htmlContent) {
    console.log('解析表格内容:', htmlContent);
    
    // 简单的表格解析逻辑
    // 这里需要根据实际的HTML结构来解析
    const rows = [];
    
    // 如果HTML内容为空，返回空数组
    if (!htmlContent) {
      console.log('HTML内容为空，返回空数组');
      return rows;
    }
    
    // 尝试解析HTML表格内容
    try {
      console.log('开始解析HTML表格内容');
      
      // 首先尝试解析2列表格（名词原形 | 复数形式）
      const twoColRowRegex = /<tr>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<\/tr>/g;
      let match;
      
      while ((match = twoColRowRegex.exec(htmlContent)) !== null) {
        const col1 = match[1].trim();
        const col2 = match[2].trim();
        
        console.log('解析到2列表格行:', { col1, col2 });
        
        rows.push([
          { type: 'text', text: col1 },
          { 
            type: 'input', 
            placeholder: '请输入复数形式', 
            answer: col2
          }
        ]);
      }
      
      // 如果没有解析到2列表格，尝试解析4列表格
      if (rows.length === 0) {
        const fourColRowRegex = /<tr>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<\/tr>/g;
        
        while ((match = fourColRowRegex.exec(htmlContent)) !== null) {
          const sentence = match[1].trim();
          const marker = match[2].trim();
          const rule = match[3].trim();
          const answer = match[4].trim();
          
          console.log('解析到4列表格行:', { sentence, marker, rule, answer });
          
          // 处理标志词，提取英文部分和中文提示
          let markerAnswer = marker;
          let markerHint = '';
          
          // 检查是否包含中文翻译（括号格式）
          const markerMatch = marker.match(/^(.+?)\((.+)\)$/);
          if (markerMatch) {
            markerAnswer = markerMatch[1].trim(); // 英文部分
            markerHint = markerMatch[2].trim();   // 中文提示
          }
          
          rows.push([
            { type: 'text', text: sentence },
            { 
              type: 'input', 
              placeholder: '请输入标志词', 
              answer: markerAnswer,
              hint: markerHint // 添加提示信息
            },
            { type: 'text', text: rule },
            { type: 'input', placeholder: '请输入答案', answer: answer }
          ]);
        }
      }
      
      // 如果还是没有解析到，尝试更宽松的正则表达式
      if (rows.length === 0) {
        console.log('尝试更宽松的正则表达式解析');
        
        // 匹配所有td标签内容
        const tdRegex = /<td[^>]*>([^<]*)<\/td>/g;
        const tdMatches = [];
        let tdMatch;
        
        while ((tdMatch = tdRegex.exec(htmlContent)) !== null) {
          tdMatches.push(tdMatch[1].trim());
        }
        
        console.log('找到的td内容:', tdMatches);
        
        // 如果是2列表格，每2个td为一组
        if (tdMatches.length % 2 === 0) {
          for (let i = 0; i < tdMatches.length; i += 2) {
            const col1 = tdMatches[i];
            const col2 = tdMatches[i + 1];
            
            console.log('解析到2列表格行:', { col1, col2 });
            
            rows.push([
              { type: 'text', text: col1 },
              { 
                type: 'input', 
                placeholder: '请输入复数形式', 
                answer: col2
              }
            ]);
          }
        }
        // 如果是4列表格，每4个td为一组
        else if (tdMatches.length % 4 === 0) {
          for (let i = 0; i < tdMatches.length; i += 4) {
            const sentence = tdMatches[i];
            const marker = tdMatches[i + 1];
            const rule = tdMatches[i + 2];
            const answer = tdMatches[i + 3];
            
            console.log('解析到4列表格行:', { sentence, marker, rule, answer });
            
            rows.push([
              { type: 'text', text: sentence },
              { 
                type: 'input', 
                placeholder: '请输入标志词', 
                answer: marker
              },
              { type: 'text', text: rule },
              { type: 'input', placeholder: '请输入答案', answer: answer }
            ]);
          }
        }
      }
      
      console.log('解析结果:', rows);
      return rows;
    } catch (error) {
      console.error('解析表格内容失败:', error);
      return rows;
    }
  },

  // 新增：云函数调用方法

  // 保存练习进度到云端
  async saveProgressToCloud(grammarType, progress, errorCount) {
    try {
      // 检查云开发是否可用
      if (!wx.cloud) {
        console.log('云开发不可用，跳过云端进度保存');
        return true;
      }
      
      // 获取用户ID(如果有登录态)
      const userInfo = wx.getStorageSync('userInfo') || {};
      const userId = userInfo.openid || 'anonymous';
      
      const result = await wx.cloud.callFunction({
        name: 'practiceProgress',
        data: {
          action: 'save',
          userId: userId,
          grammarType: grammarType,
          progress: progress,
          errorCount: errorCount
        }
      });
      
      if (result.result.code === 200) {
        console.log('进度保存成功:', grammarType, progress);
        return true;
      } else {
        console.error('进度保存失败:', result.result.message);
        return false;
      }
    } catch (error) {
      console.error('调用云函数失败:', error);
      // 在本地模式下，云函数调用失败是正常的，不返回false
      return true;
    }
  },

  // 获取练习进度
  async getProgressFromCloud(grammarType) {
    try {
      // 检查云开发是否可用
      if (!wx.cloud) {
        console.log('云开发不可用，返回默认进度');
        return { progress: 0, errorCount: 0 };
      }
      
      const userInfo = wx.getStorageSync('userInfo') || {};
      const userId = userInfo.openid || 'anonymous';
      
      const result = await wx.cloud.callFunction({
        name: 'practiceProgress',
        data: {
          action: 'get',
          userId: userId,
          grammarType: grammarType
        }
      });
      
      if (result.result.code === 200) {
        console.log('获取进度成功:', result.result.data);
        return result.result.data;
      } else {
        console.error('获取进度失败:', result.result.message);
        return { progress: 0, errorCount: 0 };
      }
    } catch (error) {
      console.error('调用云函数失败:', error);
      return { progress: 0, errorCount: 0 };
    }
  },

  // 获取专项练习表格列表
  async getPracticeTablesFromCloud() {
    try {
      // 检查云开发是否可用
      if (!wx.cloud) {
        console.log('云开发不可用，返回空表格列表');
        return [];
      }
      
      const result = await wx.cloud.callFunction({
        name: 'practiceProgress',
        data: {
          action: 'getPracticeTables'
        }
      });
      
      if (result.result.code === 200) {
        console.log('获取练习表格成功:', result.result.data);
        return result.result.data;
      } else {
        console.error('获取练习表格失败:', result.result.message);
        return [];
      }
    } catch (error) {
      console.error('调用云函数失败:', error);
      return [];
    }
  },

  // 在错题处理中保存进度
  async handleWrongQuestionWithProgress(question, index) {
    // 先执行原有的错题处理逻辑
    this.handleWrongQuestion(question, index);
    
    // 获取题目类型
    const grammarType = this.getQuestionType(question);
    
    if (grammarType) {
      // 获取当前错误次数
      const currentCount = this.data.errorCounts[grammarType] || 0;
      
      // 保存进度到云端
      await this.saveProgressToCloud(grammarType, 0, currentCount);
    }
  },

  // 新增：处理实时批改的错题统计(重载方法)
  async handleWrongQuestionWithProgress(wrongQuestion, index) {
    // 获取题目类型
    const grammarType = this.getQuestionType(wrongQuestion);
    
    if (grammarType) {
      // 累加错误次数
      const currentCount = this.data.errorCounts[grammarType] || 0;
      const newCount = currentCount + 1;
      
      const newErrorCounts = { ...this.data.errorCounts };
      newErrorCounts[grammarType] = newCount;
    
    this.setData({
        errorCounts: newErrorCounts,
        currentQuestionIndex: index,
        currentQuestionType: grammarType
      });
      
      console.log(`[失去焦点批改错题统计] ${grammarType} 错误次数: ${newCount}`);
      
      // 检查是否触发专项练习(错误3次或以上)
      if (newCount >= 3) {
        this.confirmSpecialPractice(grammarType);
      }
      
      // 保存错题到本地存储
      this.saveWrongQuestions([wrongQuestion]);
      
      // 保存进度到云端
      await this.saveProgressToCloud(grammarType, 0, newCount);
    }
  },

  // 新增：将Markdown格式转换为HTML格式
  convertMarkdownToHtml(content) {
    if (!content) return '';
    
    let htmlContent = content;
    
    // 处理粗体文本
    htmlContent = htmlContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 处理斜体文本
    htmlContent = htmlContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 转换Markdown表格为HTML表格
    // 使用更简单的方法：先按行分割，然后识别表格区域
    const lines = htmlContent.split('\n');
    let result = [];
    let inTable = false;
    let tableRows = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 检查是否是表格行（包含|符号）
      if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        tableRows.push(line);
      } else {
        // 不是表格行
        if (inTable) {
          // 结束当前表格
          result.push(this.convertTableRowsToHtml(tableRows));
          inTable = false;
          tableRows = [];
        }
        result.push(line);
      }
    }
    
    // 处理最后一个表格
    if (inTable && tableRows.length > 0) {
      result.push(this.convertTableRowsToHtml(tableRows));
    }
    
    // 重新组合内容
    htmlContent = result.join('\n');
    
    // 处理换行符
    htmlContent = htmlContent.replace(/\n/g, '<br>');
    
    return htmlContent;
  },

  // 转换表格行为HTML
  convertTableRowsToHtml(rows) {
    if (rows.length === 0) return '';
    
    let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 20rpx 0; border: 1rpx solid #e0e0e0; border-radius: 8rpx; overflow: hidden; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);">';
    let isFirstRow = true;
    let headers = [];
    let rowIndex = 0;
    
    rows.forEach((row) => {
      // 跳过分隔符行
      if (row.includes('------') || /^[\s\-\|]+$/.test(row)) {
        return;
      }
      
      const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
      if (cells.length === 0) return;
      
      if (isFirstRow) {
        headers = cells;
        tableHtml += '<thead><tr>';
        headers.forEach(header => {
          tableHtml += `<th style="color: white; font-weight: bold; padding: 20rpx 15rpx; font-size: 24rpx; text-align: center; border-right: 1rpx solid #e0e0e0; line-height: 1.3; word-break: break-word; min-height: 60rpx; background-color: #1890ff;">${header}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
        isFirstRow = false;
      } else {
        tableHtml += '<tr>';
        cells.forEach((cell, cellIndex) => {
          const cellContent = cell.trim();
          // 使用行索引来确定背景色，确保每行交替
          const bgColor = (rowIndex % 2 === 0) ? '#f9f9f9' : '#ffffff';
          tableHtml += `<td style="padding: 20rpx 15rpx; font-size: 24rpx; text-align: center; border-right: 1rpx solid #e0e0e0; line-height: 1.3; word-break: break-word; min-height: 60rpx; vertical-align: middle; background-color: ${bgColor};">${cellContent}</td>`;
        });
        tableHtml += '</tr>';
        rowIndex++;
      }
    });
    
    tableHtml += '</tbody></table>';
    return tableHtml;
  },

  // 新增：格式化笔记内容，将Markdown表格转换为更易读的格式
  formatNoteContent(content) {
    if (!content) return '';
    
    // 将Markdown表格转换为更易读的格式
    let formattedContent = content;
    
    // 匹配Markdown表格的正则表达式
    const tableRegex = /\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]*)\|/g;
    
    // 替换表格分隔符行为分隔线
    formattedContent = formattedContent.replace(/\|------\|/g, '─────────');
    
    // 将表格行转换为更易读的格式
    formattedContent = formattedContent.replace(tableRegex, (match, col1, col2, col3, col4) => {
      const cell1 = col1.trim();
      const cell2 = col2.trim();
      const cell3 = col3.trim();
      const cell4 = col4.trim();
      
      if (cell4) {
        // 4列表格
        return `${cell1}  |  ${cell2}  |  ${cell3}  |  ${cell4}`;
      } else {
        // 3列表格
        return `${cell1}  |  ${cell2}  |  ${cell3}`;
      }
    });
    
    return formattedContent;
  },

  // 新增：将笔记内容解析为结构化数据，用于原生WXML组件显示
  parseNoteContentToStructuredData(content) {
    if (!content) return null;
    
    const sections = [];
    const lines = content.split('\n');
    let currentSection = null;
    let currentSubsection = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // 检查是否是主标题（以数字开头，如"一、"、"二、"等）
      if (/^[一二三四五六七八九十]+、/.test(line) || /^## [一二三四五六七八九十]+、/.test(line)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line,
          subsections: [],
          items: []
        };
        currentSubsection = null;
      }
      // 检查是否是子标题（以数字开头，如"1."、"2."等）
      else if (/^\d+\./.test(line)) {
        if (currentSection) {
          currentSubsection = {
            title: line,
            items: []
          };
          currentSection.subsections.push(currentSubsection);
        }
      }
      // 检查是否是考察示例标题
      else if (line.includes('考察示例')) {
        const item = {
          type: 'exam-example-title',
          content: line
        };
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是题目（以"—"开头）
      else if (line.startsWith('—') || line.startsWith('-')) {
        const item = {
          type: 'question',
          content: line
        };
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是答案（包含"答案："）
      else if (line.includes('答案：')) {
        const item = {
          type: 'answer',
          content: line
        };
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是解析（包含"解析："）
      else if (line.includes('解析：')) {
        const item = {
          type: 'analysis',
          content: line
        };
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是列表项（以"•"开头或包含"→"）
      else if (line.startsWith('•') || line.includes('→')) {
        const item = {
          type: 'list',
          content: line
        };
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
          // 检查是否是🔹开头的行（可能是表格的一部分）
    else if (line.startsWith('🔹')) {
      // 检查下一行是否是"规则："开头
      if (i + 1 < lines.length && lines[i + 1].trim().startsWith('规则：')) {
        // 收集特殊格式表格行
        const tableRows = [];
        let j = i;
        
        // 查找表格开始（包含"详细规则"的行）
        while (j >= 0 && !lines[j].includes('📋 详细规则：')) {
          j--;
        }
        
        if (j >= 0) {
          // 从"详细规则"开始收集到表格结束
          j++;
          while (j < lines.length) {
            const currentLine = lines[j].trim();
            
            // 如果遇到新的章节标题或其他内容，停止收集
            if ((currentLine && /^[一二三四五六七八九十]+、/.test(currentLine)) ||
                (currentLine && /^## [一二三四五六七八九十]+、/.test(currentLine)) ||
                (currentLine && /^\d+\./.test(currentLine)) ||
                (currentLine && currentLine.includes('考察示例')) ||
                (currentLine && currentLine.includes('解析：')) ||
                (currentLine && currentLine.includes('说明：'))) {
              break;
            }
            
            // 如果是🔹格式的行，检查下一行是否是规则行
            if (currentLine.startsWith('🔹') && j + 1 < lines.length) {
              const nextLine = lines[j + 1].trim();
              if (nextLine.startsWith('规则：')) {
                const leftContent = currentLine.replace('🔹', '').trim();
                const rightContent = nextLine.replace('规则：', '').trim();
                
                // 跳过分隔符行
                if (leftContent === '------' || rightContent === '------') {
                  j += 2;
                  continue;
                }
                
                tableRows.push(`| ${leftContent} | ${rightContent} |`);
                j++; // 跳过规则行
              }
            }
            
            j++;
          }
        }
        
        if (tableRows.length > 0) {
          const tableData = this.parseTableRows(tableRows);
          if (tableData && tableData.headers.length > 0) {
            const tableItem = {
              type: 'table',
              data: tableData
            };
            
            if (currentSubsection) {
              currentSubsection.items.push(tableItem);
            } else if (currentSection) {
              currentSection.items.push(tableItem);
            }
          }
        }
        
        i = j - 1; // 跳过已处理的表格行
        } else {
        // 不是表格的一部分，作为普通文本处理
        const item = {
          type: 'text',
          content: line
        };
        
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
    }
      // 检查是否是表格标题（包含"表格"关键词）
      else if (line.includes('表格') && i + 1 < lines.length && lines[i + 1].includes('|')) {
        // 收集表格行
        const tableRows = [];
        let j = i + 1; // 从下一行开始收集
        while (j < lines.length && lines[j].includes('|') && lines[j].split('|').length >= 3) {
          tableRows.push(lines[j].trim());
          j++;
        }
        
        const tableData = this.parseTableRows(tableRows);
        if (tableData && tableData.headers.length > 0) {
          const tableItem = {
            type: 'table',
            title: line,
            data: tableData
          };
          
          if (currentSubsection) {
            currentSubsection.items.push(tableItem);
          } else if (currentSection) {
            currentSection.items.push(tableItem);
          }
        }
        
        i = j - 1; // 跳过已处理的表格行
      }
      // 检查是否是表格（包含|符号，更宽松的识别条件）
      else if (line.includes('|') && line.split('|').length >= 3) {
        // 收集表格行
        const tableRows = [];
        let j = i;
        while (j < lines.length && lines[j].includes('|') && lines[j].split('|').length >= 3) {
          tableRows.push(lines[j].trim());
          j++;
        }
        
        const tableData = this.parseTableRows(tableRows);
        if (tableData && tableData.headers.length > 0) {
          const tableItem = {
            type: 'table',
            data: tableData
          };
          
          if (currentSubsection) {
            currentSubsection.items.push(tableItem);
          } else if (currentSection) {
            currentSection.items.push(tableItem);
          }
        }
        
        i = j - 1; // 跳过已处理的表格行
      }
      // 检查是否是列表项（以•开头）
      else if (line.startsWith('•')) {
        const item = {
          type: 'list',
          content: line.substring(1).trim()
        };
        
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是考察示例标题
      else if (line.includes('考察示例')) {
        // 标准化考察示例标题
        let examTitle = line;
        
        // 如果标题后面还有其他内容，分离出来
        if (line.includes('考察示例') && line.length > 4) {
          const titleMatch = line.match(/.*?考察示例.*?/);
          if (titleMatch) {
            examTitle = titleMatch[0].trim();
            const remainingContent = line.substring(titleMatch[0].length).trim();
            
            if (remainingContent) {
              // 先添加考察示例标题
              const examExampleTitleItem = {
                type: 'exam-example-title',
                content: examTitle
              };
              
              if (currentSubsection) {
                currentSubsection.items.push(examExampleTitleItem);
              } else if (currentSection) {
                currentSection.items.push(examExampleTitleItem);
              }
              
              // 将剩余内容作为普通文本处理
              const remainingTextItem = {
                type: 'text',
                content: remainingContent
              };
              
              if (currentSubsection) {
                currentSubsection.items.push(remainingTextItem);
              } else if (currentSection) {
                currentSection.items.push(remainingTextItem);
              }
              
              i++;
              continue;
            }
          }
        }
        
        const examExampleTitleItem = {
          type: 'exam-example-title',
          content: examTitle
        };
        
        if (currentSubsection) {
          currentSubsection.items.push(examExampleTitleItem);
        } else if (currentSection) {
          currentSection.items.push(examExampleTitleItem);
        }
      }
      // 检查是否是连续题目（包含(1)、(2)、(3)等编号的题目）
      else if (/^\(\d+\).*\(答案：/.test(line)) {
        const item = {
          type: 'continuous-question',
          content: line
        };
        
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是题目（包含题目：标识）
      else if (line.includes('题目：')) {
        const item = {
          type: 'question',
          content: line
        };
        
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是答案（包含答案：标识）
      else if (line.includes('答案：')) {
        const item = {
          type: 'answer',
          content: line
        };
        
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是改错题（包含"应改为"或"错误"标识）
      else if (line.includes('应改为：') || line.includes('错误：') || (line.includes('He has three tomato') && line.includes('tomatoes'))) {
        const item = {
          type: 'correction',
          content: line
        };
        
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是示例（包含括号的题目）
      else if (line.includes('(') && line.includes(')') && (line.includes('答案：') || line.includes('错误：'))) {
        const item = {
          type: 'example',
          content: line
        };
        
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是练习表格标题（包含"练习表格"关键词）
      else if (line.includes('练习表格') || line.includes('四、练习表格')) {
        // 收集表格行
        const tableRows = [];
        let j = i + 1; // 从下一行开始收集
        
        // 查找表格内容，包括详细规则、名词原形、复数形式等
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          
          // 如果遇到下一个章节标题，停止收集
          if (/^[一二三四五六七八九十]+、/.test(nextLine) || /^## [一二三四五六七八九十]+、/.test(nextLine)) {
            break;
          }
          
          // 收集包含规则、名词原形、复数形式的行
          if (nextLine.includes('详细规则：') || 
              nextLine.includes('名词原形') || 
              nextLine.includes('复数形式') || 
              nextLine.includes('规则：') ||
              nextLine.includes('------') ||
              /^[a-zA-Z]+$/.test(nextLine) || // 单个英文单词
              /^[a-zA-Z]+s$/.test(nextLine) || // 复数形式
              nextLine.includes('•')) {
            tableRows.push(nextLine);
          }
          
          j++;
        }
        
        // 如果找到了表格内容，创建表格结构
        if (tableRows.length > 0) {
          const tableData = this.parsePracticeTableRows(tableRows);
          if (tableData) {
            const tableItem = {
              type: 'practice-table',
              title: line,
              data: tableData
            };
            
            if (currentSubsection) {
              currentSubsection.items.push(tableItem);
            } else if (currentSection) {
              currentSection.items.push(tableItem);
            }
          }
        }
        
        i = j - 1; // 跳过已处理的表格行
      }
      // 检查是否是表格（包含|符号，更宽松的识别条件）
      else if (line.includes('|') && line.split('|').length >= 3) {
        // 收集表格行
        const tableRows = [];
        let j = i;
        while (j < lines.length && lines[j].includes('|') && lines[j].split('|').length >= 3) {
          tableRows.push(lines[j].trim());
          j++;
        }
        
        const tableData = this.parseTableRows(tableRows);
        if (tableData && tableData.headers.length > 0) {
          const tableItem = {
            type: 'table',
            data: tableData
          };
          
          if (currentSubsection) {
            currentSubsection.items.push(tableItem);
          } else if (currentSection) {
            currentSection.items.push(tableItem);
          }
        }
        
        i = j - 1; // 跳过已处理的表格行
      }
      // 普通文本
      else {
        const textItem = {
          type: 'text',
          content: line
        };
        
        if (currentSubsection) {
          currentSubsection.items.push(textItem);
        } else if (currentSection) {
          currentSection.items.push(textItem);
        }
      }
    }
    
    // 添加最后一个section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    // 后处理：处理练习表格
    sections.forEach(section => {
      if (section.title.includes('练习表格')) {
        const tableRows = [];
        section.items.forEach(item => {
          if (item.type === 'text') {
            tableRows.push(item.content);
          }
        });
        
        const tableData = this.parsePracticeTableRows(tableRows);
        if (tableData) {
          section.items = [{
            type: 'practice-table',
            title: '练习表格',
            data: tableData
          }];
        }
      }
    });
    
    // 后处理：合并相关的规则和例子、题目和答案
    return this.mergeRelatedItems(sections);
  },

  // 获取规则的完整内容
  getRuleFullContent(ruleText, tableId) {
    // 处理新的规则格式（包含冒号的规则）
    if (ruleText.includes('：')) {
      return ruleText; // 已经是完整格式，直接返回
    }
    
    // 处理旧的规则格式
    const ruleMap = {
      '规则一': '一般情况直接加' + (tableId === 'comparative_table_001' ? 'er' : 'est'),
      '规则二': '以不发音的e结尾加' + (tableId === 'comparative_table_001' ? 'r' : 'st'),
      '规则三': '重读闭音节双写辅音字母加' + (tableId === 'comparative_table_001' ? 'er' : 'est'),
      '规则四': '辅音字母+y结尾变y为i加' + (tableId === 'comparative_table_001' ? 'er' : 'est'),
      '规则五': '不规则变化',
      '规则六': '多音节单词' + (tableId === 'comparative_table_001' ? '比较级前加more' : '最高级前加most')
    };
    
    return ruleMap[ruleText] || ruleText;
  },

  // 获取单词到答案的映射
  getWordAnswerMap(tableId) {
    // 创建单词到答案的映射
    if (tableId === 'comparative_table_001') {
      return {
        'fast': 'faster',
        'hard': 'harder',
        'short': 'shorter',
        'clean': 'cleaner',
        'nice': 'nicer',
        'large': 'larger',
        'safe': 'safer',
        'cute': 'cuter',
        'big': 'bigger',
        'hot': 'hotter',
        'thin': 'thinner',
        'fat': 'fatter',
        'happy': 'happier',
        'easy': 'easier',
        'heavy': 'heavier',
        'busy': 'busier',
        'good': 'better',
        'bad': 'worse',
        'many': 'more',
        'little': 'less',
        'beautiful': 'more beautiful',
        'important': 'more important',
        'interesting': 'more interesting',
        'difficult': 'more difficult'
      };
    } else if (tableId === 'superlative_table_001') {
      return {
        'fast': 'fastest',
        'hard': 'hardest',
        'short': 'shortest',
        'clean': 'cleanest',
        'nice': 'nicest',
        'large': 'largest',
        'safe': 'safest',
        'cute': 'cutest',
        'big': 'biggest',
        'hot': 'hottest',
        'thin': 'thinnest',
        'fat': 'fattest',
        'happy': 'happiest',
        'easy': 'easiest',
        'heavy': 'heaviest',
        'busy': 'busiest',
        'good': 'best',
        'bad': 'worst',
        'many': 'most',
        'little': 'least',
        'beautiful': 'most beautiful',
        'important': 'most important',
        'interesting': 'most interesting',
        'difficult': 'most difficult'
      };
    }
    return {};
  },

  // 处理规则点击事件
  onRuleTap(e) {
    const { row, col } = e.currentTarget.dataset;
    const key = `ruleShowFullContent[${row}_${col}]`;
    this.setData({
      [key]: !this.data.ruleShowFullContent[`${row}_${col}`]
    });
  },

  // 解析表格行数据
  parseTableRows(rows) {
    if (rows.length === 0) return null;
    
    const tableData = {
      headers: [],
      rows: []
    };
    
    let isFirstRow = true;
    let hasHeaders = false;
    
    rows.forEach((row, index) => {
      // 跳过分隔符行（包含多个-符号的行）
      if (row.includes('------') || /^[\s\-\|]+$/.test(row)) {
        return;
      }
      
      const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
      if (cells.length === 0) return;
      
      // 检查是否所有单元格都为空
      const hasContent = cells.some(cell => cell.length > 0);
      if (!hasContent) return;
      
      if (isFirstRow) {
        tableData.headers = cells;
        isFirstRow = false;
        hasHeaders = true;
      } else {
        // 确保数据行的列数与表头一致
        const paddedCells = [...cells];
        while (paddedCells.length < tableData.headers.length) {
          paddedCells.push('');
        }
        tableData.rows.push(paddedCells.slice(0, tableData.headers.length));
      }
    });
    
    // 如果没有找到表头，使用第一行数据作为表头
    if (!hasHeaders && tableData.rows.length > 0) {
      tableData.headers = tableData.rows[0];
      tableData.rows = tableData.rows.slice(1);
    }
    
    return tableData.headers.length > 0 ? tableData : null;
  },

  // 解析练习表格行数据
  parsePracticeTableRows(rows) {
    if (rows.length === 0) return null;
    
    const tableData = {
      headers: ['名词原形', '复数形式'],
      rows: []
    };
    
    let currentRow = [];
    let isCollectingExamples = false;
    
    rows.forEach((row, index) => {
      const trimmedRow = row.trim();
      
      // 跳过分隔符行
      if (trimmedRow.includes('------') || /^[\s\-\-]+$/.test(trimmedRow)) {
        return;
      }
      
      // 检查是否是详细规则行
      if (trimmedRow.includes('详细规则：')) {
        return;
      }
      
      // 检查是否是名词原形行
      if (trimmedRow.includes('名词原形')) {
        isCollectingExamples = true;
        return;
      }
      
      // 检查是否是复数形式行
      if (trimmedRow.includes('复数形式')) {
        isCollectingExamples = true;
        return;
      }
      
      // 检查是否是规则行
      if (trimmedRow.includes('规则：')) {
        isCollectingExamples = true;
        return;
      }
      
      // 如果正在收集例子，处理英文单词
      if (isCollectingExamples) {
        // 检查是否是单个英文单词（名词原形）
        if (/^[a-zA-Z]+$/.test(trimmedRow) && !trimmedRow.endsWith('s')) {
          currentRow = [trimmedRow, ''];
        }
        // 检查是否是复数形式（以s结尾）
        else if (/^[a-zA-Z]+s$/.test(trimmedRow) && currentRow.length > 0) {
          currentRow[1] = trimmedRow;
          if (currentRow[0] && currentRow[1]) {
            tableData.rows.push([...currentRow]);
            currentRow = [];
          }
        }
        // 检查是否是包含•的行（可能是例子）
        else if (trimmedRow.includes('•')) {
          const match = trimmedRow.match(/•\s*([a-zA-Z]+)\s*→\s*([a-zA-Z]+)/);
          if (match) {
            tableData.rows.push([match[1], match[2]]);
          }
        }
      }
    });
    
    return tableData.rows.length > 0 ? tableData : null;
  },

  // 合并相关的规则和例子、题目和答案
  mergeRelatedItems(sections) {
    sections.forEach(section => {
      // 处理直接项目
      section.items = this.mergeItemsInArray(section.items);
      
      // 处理子章节项目
      section.subsections.forEach(subsection => {
        subsection.items = this.mergeItemsInArray(subsection.items);
      });
    });
    
    return sections;
  },

  // 在数组中合并相关项目
  mergeItemsInArray(items) {
    if (items.length <= 1) return items;
    
    const mergedItems = [];
    let i = 0;
    
    while (i < items.length) {
      const currentItem = items[i];
      
      // 检查是否是表格，如果是表格直接保留
      if (currentItem.type === 'table') {
        mergedItems.push(currentItem);
        i++;
        continue;
      }
      
      // 检查是否是考察示例标题
      if (this.isExamExampleTitle(currentItem)) {
        // 将考察示例作为标题处理，不参与循环结构识别
        mergedItems.push(currentItem);
        i++;
        continue;
      }
    
      // 检查是否是循环结构：提示+题目+答案 或 提示+例子
      if (this.isCycleStart(currentItem)) {
        // 先尝试提取完整的循环结构（提示+题目+答案）
        let cycleGroup = this.extractCycleGroup(items, i);
        
        // 如果没有找到完整结构，尝试提取简单结构（提示+例子）
        if (!cycleGroup) {
          cycleGroup = this.extractSimpleCycleGroup(items, i);
        }
        
        // 如果找到了循环结构，检查是否有连续的循环组
        if (cycleGroup) {
          const consecutiveGroups = this.extractConsecutiveCycleGroups(items, i);
          if (consecutiveGroups && consecutiveGroups.type === 'consecutive-cycle-groups') {
            mergedItems.push(consecutiveGroups);
            i = consecutiveGroups.endIndex + 1;
        } else {
            mergedItems.push(cycleGroup);
            i = cycleGroup.endIndex + 1;
          }
          continue;
        }
      }
      
      // 检查当前项目是否是规则或说明
      if (currentItem.type === 'text' && this.isRuleOrDescription(currentItem.content)) {
        // 查找相关的例子（包括多个例子）
        const relatedExamples = [];
        let j = i + 1;
        
        // 继续查找例子，直到遇到下一个规则或循环开始
        while (j < items.length) {
          const nextItem = items[j];
          
          // 如果遇到下一个规则或循环开始，停止查找
          if ((nextItem.type === 'text' && this.isRuleOrDescription(nextItem.content)) || 
              this.isCycleStart(nextItem)) {
            break;
          }
          
          // 如果是例子，添加到相关例子中
          if (this.isRelatedExample(nextItem, currentItem.content)) {
            relatedExamples.push(nextItem);
            j++;
          } else {
            // 如果不是例子，停止查找
            break;
          }
        }
        
        if (relatedExamples.length > 0) {
          // 创建组合项目
          const combinedItem = {
            type: 'rule-with-examples',
            rule: currentItem,
            examples: relatedExamples
          };
          mergedItems.push(combinedItem);
          i = j; // 跳过已处理的例子
        } else {
          mergedItems.push(currentItem);
          i++;
        }
      }
      // 检查当前项目是否是题目
      else if (currentItem.type === 'text' && this.isQuestion(currentItem.content)) {
        // 查找相关的答案
        const relatedAnswer = this.findRelatedAnswer(items, i + 1);
        
        if (relatedAnswer) {
          // 创建组合项目
          const combinedItem = {
            type: 'question-with-answer',
            question: currentItem,
            answer: relatedAnswer
          };
          mergedItems.push(combinedItem);
          i = relatedAnswer.index + 1; // 跳过答案
        } else {
          mergedItems.push(currentItem);
          i++;
        }
      }
      // 其他项目直接添加
      else {
        mergedItems.push(currentItem);
        i++;
      }
    }
    
    return mergedItems;
  },

  // 提取连续的循环结构组
  extractConsecutiveCycleGroups(items, startIndex) {
    const groups = [];
    let currentIndex = startIndex;
    
    while (currentIndex < items.length) {
      const item = items[currentIndex];
      
      // 检查是否是循环开始
      if (this.isCycleStart(item)) {
        const cycleGroup = this.extractCycleGroup(items, currentIndex);
        if (cycleGroup) {
          groups.push(cycleGroup);
          currentIndex = cycleGroup.endIndex + 1;
        } else {
          currentIndex++;
        }
      } else {
        break;
      }
    }
    
    // 如果有多个连续的循环组，返回组合结构
    if (groups.length > 1) {
      return {
        type: 'consecutive-cycle-groups',
        groups: groups,
        endIndex: currentIndex - 1
      };
    } else if (groups.length === 1) {
      return groups[0];
    }
    
    return null;
  },

  // 改进的循环结构识别：处理提示+例子的简单结构
  extractSimpleCycleGroup(items, startIndex) {
    const cycleItems = [];
    let currentIndex = startIndex;
    
    // 添加提示
    cycleItems.push(items[currentIndex]);
    currentIndex++;
    
    // 查找例子（包括多个例子）
    while (currentIndex < items.length) {
      const item = items[currentIndex];
      
      // 检查是否是相关例子
      if (this.isRelatedExample(item, items[startIndex].content)) {
        cycleItems.push(item);
        currentIndex++;
        
        // 继续查找更多相关例子
        while (currentIndex < items.length) {
          const nextItem = items[currentIndex];
          
          // 如果下一个也是相关例子，继续添加
          if (this.isRelatedExample(nextItem, items[startIndex].content)) {
            cycleItems.push(nextItem);
            currentIndex++;
          } else {
            break;
          }
        }
      } 
      // 检查是否是题目（考察示例中的题目）
      else if (this.isQuestion(item.content)) {
        cycleItems.push(item);
        currentIndex++;
        
        // 查找答案
        const answerItem = this.findRelatedAnswer(items, currentIndex);
        if (answerItem) {
          cycleItems.push(answerItem);
          currentIndex = answerItem.index + 1;
        }
        
        // 继续查找更多题目和答案
        while (currentIndex < items.length) {
          const nextItem = items[currentIndex];
          
          if (this.isQuestion(nextItem.content)) {
            cycleItems.push(nextItem);
            currentIndex++;
            
            const nextAnswerItem = this.findRelatedAnswer(items, currentIndex);
            if (nextAnswerItem) {
              cycleItems.push(nextAnswerItem);
              currentIndex = nextAnswerItem.index + 1;
            }
          } else {
            break;
          }
        }
      }
      // 检查是否是答案
      else if (item.type === 'text' && (item.content.includes('答案：') || item.content.includes('答案是'))) {
        cycleItems.push(item);
        currentIndex++;
      }
      // 如果遇到下一个循环开始或考察示例标题，结束当前循环
      else if (this.isCycleStart(item) || this.isExamExampleTitle(item)) {
        break;
      }
      // 如果遇到新的章节标题，结束当前循环
      else if (/^[一二三四五六七八九十]+、/.test(item.content)) {
        break;
      }
      // 其他情况，继续查找
      else {
        currentIndex++;
      }
    }
    
    // 如果形成了提示+例子的结构
    if (cycleItems.length >= 2) {
      return {
        type: 'cycle-group',
        items: cycleItems,
        endIndex: currentIndex - 1
      };
    }
    
    return null;
  },

  // 新增：从表格单个答案更新书写题统计
  updateWritingStatsFromTable(tableId, cellId, isCorrect) {
    try {
      console.log('开始更新单个答案的书写题统计:', { tableId, cellId, isCorrect });
      
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
      
      // 更新统计（只统计已答的题目）
      todayRecord.totalCount += 1;
      if (isCorrect) {
        todayRecord.correctCount += 1;
      }
      
      // 保存更新
      wx.setStorageSync('writingHistory', writingHistory);
      console.log('单个答案书写题统计已更新:', todayRecord);
      
    } catch (error) {
      console.error('更新单个答案书写题统计失败:', error);
    }
  },

  // 新增：从新表格数据结构更新书写题统计
  updateWritingStatsFromNewTable(currentTableId, row, col, answerIndex, isCorrect) {
    try {
      console.log('开始更新新表格单个答案的书写题统计:', { currentTableId, row, col, answerIndex, isCorrect });
      
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
      
      // 更新统计（只统计已答的题目）
      todayRecord.totalCount += 1;
      if (isCorrect) {
        todayRecord.correctCount += 1;
      }
      
      // 保存更新
      wx.setStorageSync('writingHistory', writingHistory);
      console.log('新表格单个答案书写题统计已更新:', todayRecord);
      
    } catch (error) {
      console.error('更新新表格单个答案书写题统计失败:', error);
    }
  },

  // 新增：保存书写题统计
  saveWritingStats(correctCount, totalCount) {
    try {
      console.log('开始保存书写题统计:', { correctCount, totalCount });
      
      const today = this.getTodayDateString();
      const writingHistory = wx.getStorageSync('writingHistory') || [];
      
      console.log('当前日期:', today);
      console.log('现有书写历史记录:', writingHistory);
      
      // 查找今日记录
      let todayRecord = writingHistory.find(record => record.date === today);
      if (!todayRecord) {
        console.log('未找到今日记录，创建新记录');
        todayRecord = {
          date: today,
          correctCount: 0,
          totalCount: 0
        };
        writingHistory.push(todayRecord);
      } else {
        console.log('找到今日记录:', todayRecord);
      }
      
      // 更新统计
      const oldCorrectCount = todayRecord.correctCount;
      const oldTotalCount = todayRecord.totalCount;
      
      todayRecord.totalCount += totalCount;
      todayRecord.correctCount += correctCount;
      
      console.log('书写统计更新详情:', {
        旧正确数: oldCorrectCount,
        旧总数: oldTotalCount,
        新增正确数: correctCount,
        新增总数: totalCount,
        新正确数: todayRecord.correctCount,
        新总数: todayRecord.totalCount
      });
      
      // 保存更新
      wx.setStorageSync('writingHistory', writingHistory);
      console.log('书写题统计已保存:', todayRecord);
      
      // 验证保存结果
      const verifyHistory = wx.getStorageSync('writingHistory') || [];
      const verifyTodayRecord = verifyHistory.find(record => record.date === today);
      console.log('验证保存结果:', verifyTodayRecord);
      
    } catch (error) {
      console.error('保存书写题统计失败:', error);
    }
  },

  // 更新错题特训统计
  updateWrongQuestionStats(correctCount, totalCount) {
    try {
      console.log('开始更新错题特训统计:', { correctCount, totalCount });
      
      const today = this.getTodayDateString();
      const wrongQuestionHistory = wx.getStorageSync('wrongQuestionHistory') || [];
      
      console.log('当前日期:', today);
      console.log('现有错题历史记录:', wrongQuestionHistory);
      
      // 查找今日记录
      let todayRecord = wrongQuestionHistory.find(record => record.date === today);
      if (!todayRecord) {
        console.log('未找到今日记录，创建新记录');
        todayRecord = {
          date: today,
          correctCount: 0,
          totalCount: 0
        };
        wrongQuestionHistory.push(todayRecord);
      } else {
        console.log('找到今日记录:', todayRecord);
      }
      
      // 更新统计
      const oldCorrectCount = todayRecord.correctCount;
      const oldTotalCount = todayRecord.totalCount;
      
      todayRecord.totalCount += totalCount;
      todayRecord.correctCount += correctCount;
      
      console.log('统计更新详情:', {
        旧正确数: oldCorrectCount,
        旧总数: oldTotalCount,
        新增正确数: correctCount,
        新增总数: totalCount,
        新正确数: todayRecord.correctCount,
        新总数: todayRecord.totalCount
      });
      
      // 保存更新
      wx.setStorageSync('wrongQuestionHistory', wrongQuestionHistory);
      console.log('错题特训统计已更新:', todayRecord);
      
      // 验证保存结果
      const verifyHistory = wx.getStorageSync('wrongQuestionHistory') || [];
      const verifyTodayRecord = verifyHistory.find(record => record.date === today);
      console.log('验证保存结果:', verifyTodayRecord);
      
    } catch (error) {
      console.error('更新错题特训统计失败:', error);
    }
  },

  // 新增：同步语法功能大厅数据
  syncGrammarHallData(correctCount, totalCount, accuracy, questions) {
    try {
      const UserAbilityProfile = require('../../utils/userAbilityProfile');
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();

      // 分析练习类型和内容
      const practiceModule = this.detectPracticeModule(questions);
      const practiceData = {
        accuracy: parseFloat(accuracy)
      };

      // 根据练习模块类型分析特定数据
      switch (practiceModule) {
        case 'systemCombination':
          practiceData.highFreqErrors = this.analyzeHighFreqErrors(questions);
          break;
        case 'grammarPoint':
          practiceData.repeatPoints = this.analyzeRepeatPoints(questions);
          break;
        case 'customCombination':
          practiceData.customPreferences = this.analyzeCustomPreferences(questions);
          break;
      }

      // 同步数据
      abilityProfile.syncGrammarHallData(practiceModule, practiceData);
      
      console.log('语法功能大厅数据同步完成:', practiceModule, practiceData);
    } catch (error) {
      console.error('同步语法功能大厅数据失败:', error);
    }
  },

  // 新增：检测练习模块类型
  detectPracticeModule(questions) {
    // 通过URL参数或题目特征判断练习类型
    const pageOptions = getCurrentPages()[getCurrentPages().length - 1].options;
    
    // 检查是否来自系统组合
    if (pageOptions.source === 'systemCombo' || this.data.level === '系统组合') {
      return 'systemCombination';
    }
    
    // 检查是否来自专属组合
    if (pageOptions.source === 'customCombo' || this.data.level === '专属组合') {
      return 'customCombination';
    }
    
    // 检查是否来自语法分点练习
    if (questions.length > 0) {
      const categories = new Set();
      questions.forEach(q => {
        if (q.category) categories.add(q.category);
      });
      
      // 如果涉及多个语法大类，可能是系统组合
      if (categories.size >= 8) {
        return 'systemCombination';
      }
      // 如果涉及少数几个语法点，可能是语法分点练习
      else if (categories.size <= 3) {
        return 'grammarPoint';
      }
    }
    
    // 默认返回语法分点练习
    return 'grammarPoint';
  },

  // 新增：分析高频错题大类
  analyzeHighFreqErrors(questions) {
    const errorCategories = {};
    
    questions.forEach(q => {
      if (q.category) {
        errorCategories[q.category] = (errorCategories[q.category] || 0) + 1;
      }
    });
    
    return Object.keys(errorCategories)
      .sort((a, b) => errorCategories[b] - errorCategories[a])
      .slice(0, 5)
      .map(category => ({
        category: category,
        count: errorCategories[category]
      }));
  },

  // 新增：分析重复练习语法点
  analyzeRepeatPoints(questions) {
    const pointCount = {};
    
    questions.forEach(q => {
      if (q.grammarPoint || q.category) {
        const point = q.grammarPoint || q.category;
        pointCount[point] = (pointCount[point] || 0) + 1;
      }
    });
    
    return Object.keys(pointCount)
      .filter(point => pointCount[point] > 1)
      .sort((a, b) => pointCount[b] - pointCount[a])
      .map(point => ({
        point: point,
        practiceCount: pointCount[point]
      }));
  },

  // 新增：分析自定义组合偏好
  analyzeCustomPreferences(questions) {
    const combinations = [];
    
    questions.forEach(q => {
      if (q.category) {
        combinations.push(q.category);
      }
    });
    
    const combinationStr = combinations.sort().join('+');
    return [{
      combination: combinationStr,
      usageCount: 1
    }];
  },

  // 新增：更新日常练习实时分
  updateDailyPracticeScore(practiceType, accuracy, questions) {
    try {
      const UserAbilityProfile = require('../../utils/userAbilityProfile');
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();

      // 分析语法点分布
      if (practiceType === 'grammar' && questions) {
        const grammarPoints = {};
        questions.forEach(q => {
          const point = q.grammarPoint || q.category || '其他';
          grammarPoints[point] = (grammarPoints[point] || 0) + 1;
        });

        // 为每个语法点更新分数
        Object.keys(grammarPoints).forEach(point => {
          abilityProfile.updateDailyPracticeScore(practiceType, accuracy, point, null);
        });
      }

      console.log('日常练习实时分更新完成:', practiceType, accuracy);
    } catch (error) {
      console.error('更新日常练习实时分失败:', error);
    }
  },

  // 新增：动态更新能力等级
  updateAbilityLevelDynamic(practiceType) {
    try {
      const UserAbilityProfile = require('../../utils/userAbilityProfile');
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();

      abilityProfile.updateAbilityLevelDynamic(practiceType);
      
      console.log('能力等级动态更新完成:', practiceType);
    } catch (error) {
      console.error('动态更新能力等级失败:', error);
    }
  },

  // 新增：同步错题特训数据
  syncErrorQuestionData(wrongQuestions, accuracy) {
    try {
      const UserAbilityProfile = require('../../utils/userAbilityProfile');
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();

      // 分析错题类型和错误原因
      wrongQuestions.forEach(wrongQ => {
        const errorQuestion = {
          errorType: wrongQ.category || wrongQ.grammarPoint || '未知类型',
          variantAccuracy: accuracy,
          errorReason: this.analyzeErrorReason(wrongQ)
        };

        abilityProfile.syncErrorQuestionData(errorQuestion);
      });

      console.log('错题特训数据同步完成:', wrongQuestions.length, '道错题');
    } catch (error) {
      console.error('同步错题特训数据失败:', error);
    }
  },

  // 新增：分析错误原因
  analyzeErrorReason(wrongQuestion) {
    // 简单的错误原因分析逻辑
    if (wrongQuestion.category === '非谓语动词') {
      return '时态判断错误';
    } else if (wrongQuestion.category === '定语从句') {
      return '关系词选择错误';
    } else if (wrongQuestion.category === '介词') {
      return '固定搭配记忆错误';
    } else {
      return '语法规则理解错误';
    }
  }

}); 