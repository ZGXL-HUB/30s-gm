// 云端数据加载工具
// 用于从云数据库按需加载数据

// 小程序端使用 wx.cloud，不需要 require
// 云环境ID在 app.js 中初始化

class CloudDataLoader {
  constructor() {
    this.cache = new Map(); // 本地缓存
    this.loading = new Map(); // 加载状态
  }

  // 加载语法测试题库
  async loadGrammarTestSets() {
    const cacheKey = 'grammar_test_sets';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    if (this.loading.has(cacheKey)) {
      return this.loading.get(cacheKey);
    }
    
    const loadingPromise = this._loadFromCloud('grammar_test_sets');
    this.loading.set(cacheKey, loadingPromise);
    
    try {
      const result = await loadingPromise;
      this.cache.set(cacheKey, result);
      this.loading.delete(cacheKey);
      return result;
    } catch (error) {
      this.loading.delete(cacheKey);
      throw error;
    }
  }

  // 加载书写练习题库
  async loadWritingExerciseQuestions() {
    const cacheKey = 'writing_exercise_questions';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    if (this.loading.has(cacheKey)) {
      return this.loading.get(cacheKey);
    }
    
    const loadingPromise = this._loadFromCloud('writing_exercise_questions');
    this.loading.set(cacheKey, loadingPromise);
    
    try {
      const result = await loadingPromise;
      this.cache.set(cacheKey, result);
      this.loading.delete(cacheKey);
      return result;
    } catch (error) {
      this.loading.delete(cacheKey);
      throw error;
    }
  }

  // 加载综合练习题库
  async loadIntermediateQuestions() {
    const cacheKey = 'intermediate_questions';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    if (this.loading.has(cacheKey)) {
      return this.loading.get(cacheKey);
    }
    
    const loadingPromise = this._loadQuestionsFromCloud();
    this.loading.set(cacheKey, loadingPromise);
    
    try {
      const result = await loadingPromise;
      this.cache.set(cacheKey, result);
      this.loading.delete(cacheKey);
      return result;
    } catch (error) {
      this.loading.delete(cacheKey);
      throw error;
    }
  }

  // 根据语法点获取题目
  async getQuestionsByGrammarPoint(grammarPoint) {
    try {
      console.log(`根据语法点获取题目: ${grammarPoint}`);
      
      // 检查云开发是否可用
      if (!wx.cloud) {
        throw new Error('云开发不可用');
      }
      
      // 首先尝试直接匹配
      let result = await wx.cloud.database().collection('questions')
        .where({
          category: grammarPoint
        })
        .get();
      
      if (result.data.length > 0) {
        console.log(`直接匹配找到 ${result.data.length} 道 ${grammarPoint} 题目`);
        return result.data;
      }
      
      // 如果直接匹配失败，尝试从所有题目中筛选
      console.log(`直接匹配失败，尝试从所有题目中筛选: ${grammarPoint}`);
      const allResult = await wx.cloud.database().collection('questions').get();
      
      // 根据语法点内容筛选题目
      const filteredQuestions = allResult.data.filter(question => {
        // 检查题目内容是否包含语法点关键词
        const questionText = question.text || '';
        const analysis = question.analysis || '';
        const combinedText = questionText + ' ' + analysis;
        
        // 定义关键词映射
        const keywordMap = {
          '固定搭配': ['固定搭配', '固定短语', '固定用法'],
          '以f/fe结尾': ['f结尾', 'fe结尾', '以f结尾', '以fe结尾', 'f/fe结尾'],
          '时态(一般将来时)': ['一般将来时', '将来时', 'will', 'be going to'],
          '介词综合': ['介词', 'preposition'],
          '代词综合': ['代词', 'pronoun', '人称代词', '物主代词', '反身代词', '关系代词'],
          'it相关': ['it', 'it相关', 'it的用法', 'it作形式主语', 'it作形式宾语'],
          '连词综合': ['连词', 'conjunction'],
          '连词与名/动/形/副综合': ['连词', 'conjunction', '连词与', '并列连词', '从属连词'],
          '冠词综合': ['冠词', 'article', 'a', 'an', 'the'],
          'the的特殊用法': ['the', 'the的特殊用法', '定冠词', '特指'],
          '名词综合': ['名词', 'noun', '复数', '单复数'],
          '动词综合': ['动词', 'verb'],
          '并列句与动词': ['并列句', '动词', 'and', 'but', 'or'],
          '谓语': ['谓语', 'predicate'],
          '非谓语': ['非谓语', '非限定动词'],
          '现在分词综合': ['现在分词', 'ing', '非谓语', '分词'],
          '形容词综合': ['形容词', 'adjective', '比较级', '最高级'],
          '副词综合': ['副词', 'adverb'],
          '副词修饰动词': ['副词', 'adverb', '修饰动词', '副词修饰'],
          '定语从句综合': ['定语从句', 'attributive clause', 'that', 'which', 'who'],
          '状语从句综合': ['状语从句', 'adverbial clause', 'when', 'where', 'how', 'why']
        };
        
        const keywords = keywordMap[grammarPoint] || [grammarPoint];
        
        // 更智能的匹配逻辑
        const isMatch = keywords.some(keyword => {
          const lowerKeyword = keyword.toLowerCase();
          const lowerText = combinedText.toLowerCase();
          
          // 直接包含匹配
          if (lowerText.includes(lowerKeyword)) {
            return true;
          }
          
          // 特殊匹配规则
          if (grammarPoint === '以f/fe结尾') {
            return lowerText.includes('f结尾') || lowerText.includes('fe结尾') || 
                   lowerText.includes('以f') || lowerText.includes('以fe') ||
                   lowerText.includes('f/fe');
          }
          
          if (grammarPoint === 'it相关') {
            return lowerText.includes('it') && (
              lowerText.includes('形式主语') || lowerText.includes('形式宾语') ||
              lowerText.includes('it的') || lowerText.includes('it作')
            );
          }
          
          if (grammarPoint === '连词与名/动/形/副综合') {
            return lowerText.includes('连词') && (
              lowerText.includes('名词') || lowerText.includes('动词') ||
              lowerText.includes('形容词') || lowerText.includes('副词')
            );
          }
          
          if (grammarPoint === 'the的特殊用法') {
            return lowerText.includes('the') && (
              lowerText.includes('特殊') || lowerText.includes('定冠词') ||
              lowerText.includes('特指')
            );
          }
          
          if (grammarPoint === '并列句与动词') {
            return lowerText.includes('并列') && lowerText.includes('动词');
          }
          
          if (grammarPoint === '现在分词综合') {
            return lowerText.includes('现在分词') || lowerText.includes('ing') ||
                   (lowerText.includes('分词') && lowerText.includes('非谓语'));
          }
          
          if (grammarPoint === '副词修饰动词') {
            return lowerText.includes('副词') && lowerText.includes('动词');
          }
          
          return false;
        });
        
        return isMatch;
      });
      
      console.log(`筛选找到 ${filteredQuestions.length} 道 ${grammarPoint} 题目`);
      return filteredQuestions;
      
    } catch (error) {
      console.error(`获取 ${grammarPoint} 题目失败:`, error);
      return [];
    }
  }

  // 加载书写规则数据
  async loadWritingRules(fileName) {
    const cacheKey = `writing_rules_${fileName}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    if (this.loading.has(cacheKey)) {
      return this.loading.get(cacheKey);
    }
    
    const loadingPromise = this._loadWritingRuleFromCloud(fileName);
    this.loading.set(cacheKey, loadingPromise);
    
    try {
      const result = await loadingPromise;
      this.cache.set(cacheKey, result);
      this.loading.delete(cacheKey);
      return result;
    } catch (error) {
      this.loading.delete(cacheKey);
      throw error;
    }
  }

  // 从云端加载题目数据
  async _loadQuestionsFromCloud() {
    try {
      console.log('从云数据库加载题目数据...');
      
      // 检查云开发是否可用
      if (!wx.cloud) {
        throw new Error('云开发不可用');
      }
      
      const result = await wx.cloud.database().collection('questions').get();
      
      if (result.data.length > 0) {
        console.log(`成功加载 ${result.data.length} 道题目`);
        return result.data;
      } else {
        console.log('云数据库为空，使用本地数据');
        return this._loadFromLocal('intermediate_questions');
      }
    } catch (error) {
      console.error('从云数据库加载题目失败:', error);
      console.log('降级使用本地数据');
      // 如果云端加载失败，尝试从本地加载
      return this._loadFromLocal('intermediate_questions');
    }
  }

  // 从云端加载数据的通用方法
  async _loadFromCloud(collectionName) {
    try {
      // 检查云开发是否可用
      if (!wx.cloud) {
        throw new Error('云开发不可用');
      }
      
      const result = await wx.cloud.database().collection(collectionName)
        .orderBy('createTime', 'desc')
        .limit(1)
        .get();
      
      if (result.data.length > 0) {
        return result.data[0].data;
      } else {
        throw new Error(`未找到 ${collectionName} 数据`);
      }
    } catch (error) {
      console.error(`加载 ${collectionName} 失败:`, error);
      // 如果云端加载失败，尝试从本地加载
      return this._loadFromLocal(collectionName);
    }
  }

  // 从云端加载书写规则数据
  async _loadWritingRuleFromCloud(fileName) {
    try {
      // 检查云开发是否可用
      if (!wx.cloud) {
        throw new Error('云开发不可用');
      }
      
      const result = await wx.cloud.database().collection('writing_rules')
        .where({
          fileName: fileName
        })
        .orderBy('createTime', 'desc')
        .limit(1)
        .get();
      
      if (result.data.length > 0) {
        return result.data[0].data;
      } else {
        throw new Error(`未找到 ${fileName} 数据`);
      }
    } catch (error) {
      console.error(`加载 ${fileName} 失败:`, error);
      // 如果云端加载失败，尝试从本地加载
      return this._loadFromLocal(fileName);
    }
  }

  // 从本地加载数据的备用方法
  _loadFromLocal(dataName) {
    try {
      switch (dataName) {
        case 'grammar_test_sets':
          return require('../data/grammar_test_sets.js');
        case 'writing_exercise_questions':
          return require('../writing_exercise_questions.js');
        case 'intermediate_questions':
          return require('../data/intermediate_questions.js');
        default:
          if (dataName.startsWith('writing_rules_')) {
            const fileName = dataName.replace('writing_rules_', '');
            return require(`../data/${fileName}`);
          }
          throw new Error(`未知的数据类型: ${dataName}`);
      }
    } catch (error) {
      console.error(`本地加载 ${dataName} 失败:`, error);
      throw error;
    }
  }

  // 清除缓存
  clearCache() {
    this.cache.clear();
  }

  // 预加载常用数据
  async preloadCommonData() {
    try {
      await Promise.all([
        this.loadGrammarTestSets(),
        this.loadWritingExerciseQuestions()
      ]);
      console.log('常用数据预加载完成');
    } catch (error) {
      console.error('预加载失败:', error);
    }
  }
}

// 创建单例实例
const cloudDataLoader = new CloudDataLoader();

module.exports = cloudDataLoader;
