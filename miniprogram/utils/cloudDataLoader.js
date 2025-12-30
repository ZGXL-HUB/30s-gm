// 云数据加载器
class CloudDataLoader {
    constructor() {
      this.cache = new Map();
      this.loading = new Map();
    }
  
    // 加载语法测试套题
    async loadGrammarTestSets() {
      const key = 'grammar_test_sets';
      
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }
      
      if (this.loading.has(key)) {
        return this.loading.get(key);
      }
      
      const promise = this._loadFromCloud('grammar_test_sets');
      this.loading.set(key, promise);
      
      try {
        const result = await promise;
        this.cache.set(key, result);
        this.loading.delete(key);
        return result;
      } catch (error) {
        this.loading.delete(key);
        throw error;
      }
    }
  
    // 加载书写练习题目
    async loadWritingExerciseQuestions() {
      const key = 'writing_exercise_questions';
      
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }
      
      if (this.loading.has(key)) {
        return this.loading.get(key);
      }
      
      const promise = this._loadFromCloud('writing_exercise_questions');
      this.loading.set(key, promise);
      
      try {
        const result = await promise;
        this.cache.set(key, result);
        this.loading.delete(key);
        return result;
      } catch (error) {
        this.loading.delete(key);
        throw error;
      }
    }
  
    // 加载中级题目
    async loadIntermediateQuestions() {
      const key = 'intermediate_questions';
      
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }
      
      if (this.loading.has(key)) {
        return this.loading.get(key);
      }
      
      const promise = this._loadQuestionsFromCloud();
      this.loading.set(key, promise);
      
      try {
        const result = await promise;
        this.cache.set(key, result);
        this.loading.delete(key);
        return result;
      } catch (error) {
        this.loading.delete(key);
        throw error;
      }
    }
  
  // 根据语法点获取题目（直接查询 + 特殊情况映射）
  async getQuestionsByGrammarPoint(grammarPoint) {
    try {
      console.log('📚 根据语法点获取题目:', grammarPoint);
      
      if (!wx.cloud) {
        throw new Error('云开发不可用');
      }
      
      // ✅ 特殊情况映射（处理前端显示名称与数据库分类名称的不一致）
      const specialMapping = {
        // 时态映射：前端显示 -> 数据库分类
        "时态(一般过去时)": "过去时",
        "时态(一般将来时)": "谓语(3)",
        "时态(过去将来时)": "谓语(4)", 
        "时态(现在进行时)": "进行时",
        "时态(过去进行时)": "谓语(6)",
        "时态(现在完成时)": "谓语(7)",
        "时态(过去完成时)" : "谓语(8)",
        
        // 语态映射
        "语态(被动+八大时态)": "谓语(9)",
        
        // 名词相关映射
        "单复数同形": "单复数同形",
        "f/fe结尾": "f/fe结尾",
        "s/sh/ch/x结尾": "s/sh/ch/x结尾",
        "复合词和外来词": "复合词和外来词",
        "泛指与特指": "泛指与特指",
        
        // 代词相关映射
        "关系代词": "关系代词",
        "反身代词": "反身代词",
        "人称代词": "人称代词",
        
        // 介词相关映射
        "介词 + 名词/动名词": "介词综合",
        "固定搭配": "固定搭配",
        
        // 连词相关映射
        "连词与名/动/形/副综合": "连词综合",
        "连词与名词": "连词综合",
        "连词与动词": "连词综合",
        "连词与形容词": "连词综合",
        
        // 冠词相关映射
        "a和an": "冠词综合",
        "the的特殊用法": "冠词综合",
        
        // 动词相关映射
        "插入语与动词": "动词综合",
        "主从句与动词": "动词综合",
        "并列句与动词": "动词综合",
        
        // 非谓语映射
        "现在分词综合": "现在分词综合",
        "过去分词综合": "过去分词综合",
        "不定式综合": "不定式综合",
        
        // 形容词映射
        "比较级": "形容词综合",
        "最高级": "形容词综合",
        
        // 副词映射
        "副词修饰句子": "副词修饰句子",
        "副词修饰形容词/副词": "副词综合",
        "副词修饰动词": "副词综合",
        
        // 从句映射
        "定语从句综合": "定语从句综合",
        "状语从句综合": "状语从句综合"
      };
      
      const actualCategory = specialMapping[grammarPoint] || grammarPoint;
      
      if (specialMapping[grammarPoint]) {
        console.log(`   📝 映射: "${grammarPoint}" → "${actualCategory}"`);
      }
      
      // ✅ 直接查询
      const result = await wx.cloud.database()
        .collection('questions')
        .where({ category: actualCategory })
        .limit(20)  // 每个语法点最多20题
        .get();
      
      if (result.data.length > 0) {
        console.log(`   ✅ 找到 ${result.data.length} 题`);
        return result.data;
      }
      
      // 如果直接查询没找到，尝试模糊匹配（兜底）
      console.log(`   ⚠️ "${actualCategory}" 直接匹配失败，尝试模糊匹配...`);
      const allResult = await wx.cloud.database()
        .collection('questions')
        .get();
      
      const filteredQuestions = allResult.data.filter(question => {
        const text = (question.text || '') + ' ' + (question.analysis || '');
        const keywords = this.getGrammarPointKeywords(grammarPoint);
        
        return keywords.some(keyword => {
          const lowerKeyword = keyword.toLowerCase();
          const lowerText = text.toLowerCase();
          return lowerText.includes(lowerKeyword);
        });
      });
      
      console.log(`筛选找到 ${filteredQuestions.length} 道 ${grammarPoint} 题目`);
      return filteredQuestions;
        
      } catch (error) {
        console.error('获取', grammarPoint, '题目失败:', error);
        return [];
      }
    }
  
    // 获取语法点关键词
    getGrammarPointKeywords(grammarPoint) {
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
      
      return keywordMap[grammarPoint] || [grammarPoint];
    }
  
    // 从云数据库加载题目
    async _loadQuestionsFromCloud() {
      try {
        console.log('从云数据库加载题目数据...');
        
        if (!wx.cloud) {
          throw new Error('云开发不可用');
        }
        
        // 优化查询，避免全量扫描，只获取必要字段
        const result = await wx.cloud.database()
          .collection('questions')
          .field({
            _id: true,
            text: true,
            category: true,
            type: true,
            options: true,
            answer: true,
            analysis: true,
            explanation: true,
            difficulty: true,
            grammarPoint: true
          })
          .limit(1000) // 限制查询数量，避免一次性加载过多数据
          .get();
        
        if (result.data.length > 0) {
          console.log(`成功加载 ${result.data.length} 道题目`);
          return result.data;
        } else {
          console.log('云数据库为空，返回空数组');
          return [];
        }
        
      } catch (error) {
        console.error('从云数据库加载题目失败:', error);
        console.log('返回空数组');
        return [];
      }
    }
  
    // 从云数据库加载数据
    async _loadFromCloud(collectionName) {
      try {
        if (!wx.cloud) {
          throw new Error('云开发不可用');
        }
        
        const result = await wx.cloud.database()
          .collection(collectionName)
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
        return [];
      }
  }

    // 根据关键词过滤题目
    _filterQuestionsByKeywords(questions, keywords) {
      if (!questions || questions.length === 0) return [];
      
      const filtered = questions.filter(question => {
        // 检查题目文本
        const text = (question.text || '').toLowerCase();
        const category = (question.category || '').toLowerCase();
        
        return keywords.some(keyword => 
          text.includes(keyword.toLowerCase()) || 
          category.includes(keyword.toLowerCase())
        );
      });
      
      console.log(`📊 找到 ${filtered.length} 道匹配题目`);
      return filtered;
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
  
  module.exports = new CloudDataLoader();