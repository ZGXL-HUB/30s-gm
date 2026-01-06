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
  // 支持按知识点+type+数量查询
  async getQuestionsByGrammarPoint(grammarPoint, schoolLevel = null, type = null, limit = 20) {
    try {
      console.log('📚 根据语法点获取题目:', grammarPoint, 
        schoolLevel ? `(学段: ${schoolLevel})` : '',
        type ? `(题型: ${type})` : '',
        `(数量: ${limit})`
      );
      
      if (!wx.cloud) {
        throw new Error('云开发不可用');
      }
      
      // 构建查询条件
      const buildWhereCondition = (category, questionType = null) => {
        const condition = { category };
        if (schoolLevel) {
          condition.schoolLevel = schoolLevel;
        }
        // 支持按type字段筛选
        if (questionType) {
          condition.type = questionType;
        }
        return condition;
      };
      
      // ✅ 分离的映射表架构：初中和高中独立管理
      // 根据实际知识点菜单结构重新构建
      const mappingTables = {
        // ========== 初中模块映射表 ==========
        // 基于知识点菜单：一级菜单 -> 二级菜单(category) -> 三级菜单(grammarPoint)
        middle: {
          // ========== 1. 词法 ==========
          
          // 1.1 名词
          noun: {
            "名词所有格": { category: "名词", grammarPoint: "名词所有格" },
            "名词的复数": { category: "名词", grammarPoint: "名词的复数" },
            "名词辨析": { category: "名词", grammarPoint: "名词的复数" } // 名词辨析模糊匹配到名词的复数
          },

          // 1.2 代词
          pronoun: {
            "人称代词": { category: "代词", grammarPoint: "人称代词" },
            "物主代词": { category: "代词", grammarPoint: "物主代词" },
            "反身代词": { category: "代词", grammarPoint: "反身代词" },
            "不定代词": { category: "代词", grammarPoint: "不定代词" },
            "关系代词": { category: "代词", grammarPoint: "关系代词" } // 定语从句中的关系代词
          },

          // 1.3 形容词与副词
          adjective_adverb: {
            "形容词作定语": { category: "形容词与副词", grammarPoint: "形容词作定语" },
            "副词的基本用法": { category: "形容词与副词", grammarPoint: "副词的基本用法" },
            "比较级和最高级": { category: "形容词与副词", grammarPoint: "比较级和最高级" },
            "位置与用法": { category: "形容词与副词", grammarPoint: "副词的基本用法" } // 归类到副词的基本用法
          },

          // 1.4 动词
          verb: {
            "动词的形式": { category: "动词", grammarPoint: "动词的形式" },
            "情态动词": { category: "动词", grammarPoint: "情态动词" },
            "can/could": { category: "动词", grammarPoint: "情态动词" },
            "must/need": { category: "动词", grammarPoint: "情态动词" },
            "非谓语动词": { category: "动词", grammarPoint: "非谓语动词" },
            "动名词": { category: "动词", grammarPoint: "非谓语动词" },
            "动词不定式": { category: "动词", grammarPoint: "非谓语动词" }
          },

          // 1.5 介词
          preposition: {
            "时间介词": { category: "介词", grammarPoint: "时间介词" },
            "地点介词": { category: "介词", grammarPoint: "地点介词" },
            "其他介词": { category: "介词", grammarPoint: "其他介词" },
            "地点/方式介词": { category: "介词", grammarPoint: "其他介词" } // 归类到其他介词
          },

          // 1.6 冠词
          article: {
            "不定冠词": { category: "冠词", grammarPoint: "不定冠词" },
            "定冠词": { category: "冠词", grammarPoint: "定冠词" },
            "零冠词": { category: "冠词", grammarPoint: "零冠词" }
          },

          // 1.7 数词（暂未在示例中出现，保留结构）
          numeral: {
            "基数词与序数词": { category: "数词", grammarPoint: "基数词与序数词" },
            "数词的应用": { category: "数词", grammarPoint: "数词的应用" }
          },

          // 1.8 连词
          conjunction: {
            "并列连词": { category: "连词", grammarPoint: "并列连词" },
            "从属连词": { category: "连词", grammarPoint: "从属连词" },
            "连接词": { category: "连词", grammarPoint: "从属连词" } // 归类到从属连词
          },

          // ========== 2. 句法 ==========

          // 2.1 句子成分与基本句型（暂未在示例中出现，保留结构）
          sentence_structure: {
            "主谓宾结构": { category: "句子成分与基本句型", grammarPoint: "主谓宾结构" },
            "主系表结构": { category: "句子成分与基本句型", grammarPoint: "主系表结构" }
          },

          // 2.2 动词时态
          tense: {
            "一般现在时": { category: "动词时态", grammarPoint: "一般现在时" },
            "一般过去时": { category: "动词时态", grammarPoint: "一般过去时" },
            "一般将来时": { category: "动词时态", grammarPoint: "一般将来时" },
            "现在进行时": { category: "动词时态", grammarPoint: "现在进行时" },
            "过去进行时": { category: "动词时态", grammarPoint: "过去进行时" },
            "现在完成时": { category: "动词时态", grammarPoint: "现在完成时" },
            "过去完成时": { category: "动词时态", grammarPoint: "过去完成时" }
          },

          // 2.3 被动语态
          voice: {
            "一般时被动": { category: "被动语态", grammarPoint: "一般时态的被动语态" },
            "一般时态的被动语态": { category: "被动语态", grammarPoint: "一般时态的被动语态" },
            "完成时态的被动语态": { category: "被动语态", grammarPoint: "完成时态的被动语态" }
          },

          // 2.4 主谓一致
          subject_verb_agreement: {
            "语法一致原则": { category: "主谓一致", grammarPoint: "语法一致原则" },
            "意义一致原则": { category: "主谓一致", grammarPoint: "意义一致原则" },
            "就近原则": { category: "主谓一致", grammarPoint: "就近原则" },
            "时态一致": { category: "主谓一致", grammarPoint: "语法一致原则" } // 归类到语法一致原则
          },

          // 2.5 复合句
          complex_sentence: {
            "宾语从句": { category: "复合句", grammarPoint: "宾语从句" },
            "定语从句": { category: "复合句", grammarPoint: "定语从句" },
            "状语从句": { category: "复合句", grammarPoint: "状语从句" },
            "时间状语从句": { category: "复合句", grammarPoint: "状语从句" },
            "条件状语从句": { category: "复合句", grammarPoint: "状语从句" }
          },

          // 2.6 特殊句式
          special_sentence: {
            "There be句型": { category: "特殊句式", grammarPoint: "There be 句型" },
            "感叹句": { category: "特殊句式", grammarPoint: "感叹句" },
            "祈使句": { category: "特殊句式", grammarPoint: "祈使句" },
            "倒装句": { category: "特殊句式", grammarPoint: "倒装句" },
            "疑问句": { category: "特殊句式", grammarPoint: "疑问句" } // 可能归类到特殊句式
          }
        },

        // ========== 高中模块映射表 ==========
        high: {
          // 高中时态映射：规范化命名
          tense: {
            "一般过去时": "过去时",
            "一般将来时": "谓语(3)",
            "过去将来时": "谓语(4)",
            "现在进行时": "进行时",
            "过去进行时": "谓语(6)",
            "现在完成时": "谓语(7)",
            "过去完成时": "谓语(8)"
          },

          // 高中语态映射
          voice: {
            "被动语态": "谓语(9)"
          },

          // 高名词相关映射
          noun: {
            "单复数同形": "单复数同形",
            "f/fe结尾": "f/fe结尾",
            "以f/fe结尾": "f/fe结尾",
            "s/sh/ch/x结尾": "s/sh/ch/x结尾",
            "复合词和外来词": "复合词和外来词",
            "泛指与特指": "泛指与特指",
            "不规则复数": "不规则复数",
            "以o结尾": "以o结尾",
            "以y结尾": "以y结尾"
          },

          // 高代词相关映射
          pronoun: {
            "关系代词": "关系代词",
            "反身代词": "反身代词",
            "人称代词": "人称代词"
          },

          // 高介词相关映射
          preposition: {
            "介词综合": "介词综合",
            "固定搭配": "固定搭配"
          },

          // 高连词相关映射
          conjunction: {
            "连词综合": "连词综合",
            "连词与名词": "连词综合",
            "连词与动词": "连词综合",
            "连词与形容词": "连词综合"
          },

          // 高冠词相关映射
          article: {
            "a和an": "冠词综合",
            "the的特殊用法": "冠词综合"
          },

          // 高动词相关映射
          verb: {
            "动词综合": "动词综合",
            "插入语与动词": "动词综合",
            "主从句与动词": "动词综合",
            "并列句与动词": "动词综合"
          },

          // 高非谓语映射
          nonfinite: {
            "现在分词综合": "现在分词综合",
            "过去分词综合": "过去分词综合",
            "不定式综合": "不定式综合"
          },

          // 高形容词映射
          adjective: {
            "比较级": "形容词综合",
            "最高级": "形容词综合"
          },

          // 高副词映射
          adverb: {
            "副词修饰句子": "副词修饰句子",
            "副词修饰形容词/副词": "副词综合",
            "副词修饰动词": "副词综合"
          },

          // 高从句映射
          clause: {
            "定语从句综合": "定语从句综合",
            "状语从句综合": "状语从句综合"
          }
        }
      };

      // 根据学段选择对应的映射表
      console.log('🔍 CloudDataLoader 接收到的 schoolLevel 参数:', schoolLevel);
      const finalSchoolLevel = schoolLevel || 'high'; // 默认使用 high
      console.log('📚 确定的学段:', finalSchoolLevel);
      const levelMapping = mappingTables[finalSchoolLevel] || mappingTables.high;

      // 合并所有子映射表为一个平面映射
      // 初中模块：{ grammarPoint: { category, grammarPoint } }
      // 高中模块：{ grammarPoint: category } (保持原有格式)
      const specialMapping = {};
      const grammarPointMapping = {}; // 存储grammarPoint映射（仅初中模块）
      
      Object.values(levelMapping).forEach(subMapping => {
        Object.keys(subMapping).forEach(key => {
          const value = subMapping[key];
          if (finalSchoolLevel === 'middle' && typeof value === 'object' && value.category) {
            // 初中模块：存储完整的映射信息
            specialMapping[key] = value.category; // category用于查询
            grammarPointMapping[key] = value.grammarPoint; // grammarPoint用于精确匹配
          } else {
            // 高中模块：保持原有格式
            specialMapping[key] = value;
          }
        });
      });
      
      // ✅ 父分类映射（当精确分类找不到时，回退到父分类）
      const parentCategoryMapping = {
        // 名词子分类 -> 名词
        "名词所有格": "名词",
        "名词的复数": "名词",
        "名词辨析": "名词",
        // 代词子分类 -> 代词
        "人称代词": "代词",
        "物主代词": "代词",
        "反身代词": "代词",
        "不定代词": "代词",
        "关系代词": "代词",
        // 动词子分类 -> 动词
        "动词的形式": "动词",
        "情态动词": "动词",
        "非谓语动词": "动词",
        // 介词子分类 -> 介词
        "时间介词": "介词",
        "地点介词": "介词",
        "其他介词": "介词",
        // 连词子分类 -> 连词
        "并列连词": "连词",
        "从属连词": "连词",
        // 时态子分类 -> 动词时态
        "一般现在时": "动词时态",
        "一般过去时": "动词时态",
        "一般将来时": "动词时态",
        "现在进行时": "动词时态",
        "过去进行时": "动词时态",
        "现在完成时": "动词时态",
        "过去完成时": "动词时态",
        // 被动语态子分类 -> 被动语态
        "一般时态的被动语态": "被动语态",
        "完成时态的被动语态": "被动语态",
        // 主谓一致子分类 -> 主谓一致
        "语法一致原则": "主谓一致",
        "意义一致原则": "主谓一致",
        "就近原则": "主谓一致",
        // 复合句子分类 -> 复合句
        "宾语从句": "复合句",
        "定语从句": "复合句",
        "状语从句": "复合句",
        // 特殊句式子分类 -> 特殊句式
        "There be 句型": "特殊句式",
        "感叹句": "特殊句式",
        "祈使句": "特殊句式",
        "倒装句": "特殊句式",
        // 高中模块的父分类映射（保持原有）
        "单复数同形": "名词综合",
        "f/fe结尾": "名词综合",
        "以f/fe结尾": "名词综合",
        "s/sh/ch/x结尾": "名词综合",
        "复合词和外来词": "名词综合",
        "泛指与特指": "名词综合",
        "不规则复数": "名词综合",
        "以o结尾": "名词综合",
        "以y结尾": "名词综合",
        "并列连词综合": "连词综合",
        "连词综合": "连词综合",
        "不定式综合": "非谓语动词",
        "非谓语动词": "非谓语动词",
        "状语从句综合": "状语从句综合"
      };
      
      // 确定查询条件
      let actualCategory = specialMapping[grammarPoint] || grammarPoint;
      let actualGrammarPoint = grammarPointMapping[grammarPoint] || grammarPoint;
      
      if (specialMapping[grammarPoint]) {
        if (finalSchoolLevel === 'middle') {
          console.log(`   📝 映射: "${grammarPoint}" → category: "${actualCategory}", grammarPoint: "${actualGrammarPoint}"`);
        } else {
          console.log(`   📝 映射: "${grammarPoint}" → "${actualCategory}"`);
        }
      }
      
      // ✅ 步骤1：优先使用 grammarPoint 进行精确匹配（仅初中模块）
      if (finalSchoolLevel === 'middle' && actualGrammarPoint && actualGrammarPoint !== grammarPoint) {
        const grammarPointCondition = { grammarPoint: actualGrammarPoint };
        if (schoolLevel) {
          grammarPointCondition.schoolLevel = schoolLevel;
        }
        // 支持按type字段筛选
        if (type) {
          grammarPointCondition.type = type;
        }
        console.log(`   🔍 步骤1a: 使用 grammarPoint 精确查询:`, grammarPointCondition);
        let result = await wx.cloud.database()
          .collection('questions')
          .where(grammarPointCondition)
          .limit(limit)
          .get();
        
        if (result.data.length > 0) {
          console.log(`   ✅ 找到 ${result.data.length} 题（grammarPoint: ${actualGrammarPoint}, type: ${type || '全部'}）`);
          return result.data;
        }
      }
      
      // ✅ 步骤1b：使用 category 进行精确匹配
      console.log(`   🔍 步骤1b: 使用 category 精确查询:`, buildWhereCondition(actualCategory, type));
      let result = await wx.cloud.database()
        .collection('questions')
        .where(buildWhereCondition(actualCategory, type))
        .limit(limit)
        .get();
      
      if (result.data.length > 0) {
        console.log(`   ✅ 找到 ${result.data.length} 题（category: ${actualCategory}, type: ${type || '全部'}）`);
        // 如果同时有 grammarPoint，进一步过滤
        if (finalSchoolLevel === 'middle' && actualGrammarPoint && actualGrammarPoint !== grammarPoint) {
          const filtered = result.data.filter(q => {
            const qGrammarPoint = (q.grammarPoint || '').trim();
            const targetGrammarPoint = actualGrammarPoint.trim();
            
            // 排除包含"可数与不可数名词"的错误匹配
            if (qGrammarPoint.includes('可数与不可数') || qGrammarPoint.includes('不可数与可数')) {
              return false;
            }
            
            // 精确匹配：grammarPoint 必须完全相等
            const exactMatch = qGrammarPoint === targetGrammarPoint;
            
            // 如果指定了type，还需要匹配type
            if (type) {
              return exactMatch && q.type === type;
            }
            return exactMatch;
          });
          if (filtered.length > 0) {
            console.log(`   ✅ 进一步过滤后找到 ${filtered.length} 题（grammarPoint精确匹配, type: ${type || '全部'}）`);
            return filtered;
          }
        }
        return result.data;
      }
      
      // ✅ 步骤2：如果精确分类找不到，尝试查询父分类
      const parentCategory = parentCategoryMapping[actualCategory] || parentCategoryMapping[grammarPoint];
      if (parentCategory && parentCategory !== actualCategory) {
        console.log(`   ⚠️ "${actualCategory}" 精确匹配失败，尝试父分类: "${parentCategory}"`);
        result = await wx.cloud.database()
          .collection('questions')
          .where(buildWhereCondition(parentCategory))
          .limit(20)
          .get();
        
        if (result.data.length > 0) {
          console.log(`   ✅ 找到 ${result.data.length} 题（父分类: ${parentCategory}）`);
          return result.data;
        }
      }
      
      // ✅ 步骤3：如果父分类也找不到，尝试模糊匹配（兜底）
      console.log(`   ⚠️ "${actualCategory}" 和父分类都匹配失败，尝试模糊匹配...`);
      console.log(`   📋 模糊匹配使用的 schoolLevel:`, schoolLevel);
      let query = wx.cloud.database().collection('questions');
      if (schoolLevel) {
        query = query.where({ schoolLevel });
        console.log(`   🔍 添加 schoolLevel 过滤: ${schoolLevel}`);
      } else {
        console.log(`   ⚠️ 未传递 schoolLevel 参数，将查询所有题目`);
      }
      const allResult = await query.get();
      console.log(`   📊 模糊查询返回 ${allResult.data.length} 道题目`);
      if (allResult.data.length > 0) {
        // 检查前3道题目的 schoolLevel 字段
        const sampleQuestions = allResult.data.slice(0, 3);
        sampleQuestions.forEach((q, index) => {
          console.log(`   🔍 题目${index + 1} schoolLevel: ${q.schoolLevel || 'undefined'}`);
        });
      }
      
      const filteredQuestions = allResult.data.filter(question => {
        // 排除包含"可数与不可数名词"的错误匹配
        const qGrammarPoint = (question.grammarPoint || '').trim();
        if (qGrammarPoint.includes('可数与不可数') || qGrammarPoint.includes('不可数与可数')) {
          return false;
        }
        
        const category = (question.category || '').toLowerCase();
        const grammarPointField = (question.grammarPoint || '').toLowerCase();
        const text = (question.text || '') + ' ' + (question.analysis || '');
        const keywords = this.getGrammarPointKeywords(grammarPoint, schoolLevel);

        // 优先匹配category和grammarPoint字段（精确匹配优先）
        const exactGrammarPointMatch = grammarPointField === grammarPoint.toLowerCase();
        const categoryMatch = keywords.some(keyword =>
          category.includes(keyword.toLowerCase()) ||
          (grammarPointField.includes(keyword.toLowerCase()) && !grammarPointField.includes('可数与不可数') && !grammarPointField.includes('不可数与可数'))
        );

        // 其次匹配题目文本
        const textMatch = keywords.some(keyword => {
          const lowerKeyword = keyword.toLowerCase();
          const lowerText = text.toLowerCase();
          return lowerText.includes(lowerKeyword);
        });

        // 增强匹配：检查题目是否包含语法点相关特征
        const enhancedMatch = this.checkGrammarPointFeatures(question, grammarPoint);

        // 精确匹配优先，然后是其他匹配方式
        return exactGrammarPointMatch || categoryMatch || textMatch || enhancedMatch;
      });
      
      console.log(`   ${filteredQuestions.length > 0 ? '✅' : '⚠️'} 模糊匹配找到 ${filteredQuestions.length} 道 ${grammarPoint} 题目`);

      // 如果仍然找不到题目，尝试更宽泛的搜索
      if (filteredQuestions.length === 0) {
        console.log(`   🔄 尝试更宽泛的搜索策略...`);
        const broadSearchResults = this.performBroadSearch(allResult.data, grammarPoint);
        if (broadSearchResults.length > 0) {
          console.log(`   ✅ 宽泛搜索找到 ${broadSearchResults.length} 道 ${grammarPoint} 题目`);
          return broadSearchResults;
        }
      }

      return filteredQuestions;
        
      } catch (error) {
        console.error('获取', grammarPoint, '题目失败:', error);
        return [];
      }
    }
  
     // 检查题目是否包含语法点特征
     checkGrammarPointFeatures(question, grammarPoint) {
       const text = (question.text || '').toLowerCase();
       const analysis = (question.analysis || '').toLowerCase();

       switch (grammarPoint) {
         case 'must/need':
           return text.includes('must') || text.includes('need') ||
                  analysis.includes('must') || analysis.includes('need');

         case '时间介词':
           return text.includes(' at ') || text.includes(' on ') || text.includes(' in ') ||
                  text.includes(' during ') || text.includes(' for ') || text.includes(' since ') ||
                  analysis.includes('时间介词') || analysis.includes('介词');

         case '感叹句':
           return text.includes('what ') || text.includes('how ') ||
                  text.startsWith('what') || text.startsWith('how') ||
                  analysis.includes('感叹句') || analysis.includes('what') || analysis.includes('how');

         case '疑问句':
           return text.includes('?') ||
                  text.includes('what ') || text.includes('how ') || text.includes('why ') ||
                  text.includes('when ') || text.includes('where ') || text.includes('who ') ||
                  analysis.includes('疑问句') || analysis.includes('疑问');

         case 'There be句型':
           return text.includes('there is') || text.includes('there are') ||
                  text.includes('there was') || text.includes('there were') ||
                  text.includes('there be') ||
                  analysis.includes('there be') || analysis.includes('存在句');

         case '关系代词':
           return text.includes(' who ') || text.includes(' whom ') || text.includes(' whose ') ||
                  text.includes(' which ') || text.includes(' that ') ||
                  analysis.includes('关系代词') || analysis.includes('定语从句');

         case '祈使句':
           return !text.includes('?') && (
             text.includes('please') || text.includes('don\'t') ||
             text.includes('let\'s') || text.includes('let us') ||
             analysis.includes('祈使句') || analysis.includes('命令句')
           );

         default:
           return false;
       }
     }

    // 执行更宽泛的搜索策略
     performBroadSearch(allQuestions, grammarPoint) {
       // 策略1：按大类搜索
       const broadCategories = this.getBroadCategoryMapping(grammarPoint);
       let results = [];

       for (const broadCategory of broadCategories) {
         const matched = allQuestions.filter(q =>
           (q.category || '').toLowerCase().includes(broadCategory.toLowerCase()) ||
           (q.grammarPoint || '').toLowerCase().includes(broadCategory.toLowerCase())
         );
         results.push(...matched);
       }

       // 策略2：随机选择一些题目作为备选
       if (results.length === 0 && allQuestions.length > 0) {
         // 从所有题目中随机选择1-2道作为备选
         const randomIndices = this.getRandomIndices(allQuestions.length, Math.min(2, allQuestions.length));
         results = randomIndices.map(index => allQuestions[index]);
         console.log(`   📊 随机备选 ${results.length} 道题目作为 ${grammarPoint} 的替代`);
       }

       return results;
     }

    // 获取大类映射
     getBroadCategoryMapping(grammarPoint) {
       const mapping = {
         'must/need': ['情态动词', '动词', '谓语'],
         '时间介词': ['介词', '介词综合', '时间', '状语'],
         '感叹句': ['特殊句式', '句子', '句型'],
         '疑问句': ['特殊句式', '句子', '句型'],
         'There be句型': ['特殊句式', '句子', '句型', '存在句'],
         '关系代词': ['代词', '定语从句'],
         '祈使句': ['特殊句式', '句子', '句型']
       };
       return mapping[grammarPoint] || [grammarPoint];
     }

    // 获取随机索引
     getRandomIndices(maxLength, count) {
       const indices = [];
       const available = Array.from({length: maxLength}, (_, i) => i);

       for (let i = 0; i < count && available.length > 0; i++) {
         const randomIndex = Math.floor(Math.random() * available.length);
         indices.push(available.splice(randomIndex, 1)[0]);
       }

       return indices;
     }

    // 获取语法点关键词 - 分离架构
     getGrammarPointKeywords(grammarPoint, schoolLevel = null) {
       const keywordTables = {
         // ========== 初中模块关键词表 ==========
         // 基于实际知识点菜单结构
         middle: {
           // 1.1 名词
           '名词所有格': ['名词所有格', 'possessive', '所有格', "'s", 'of', '所有'],
           '名词的复数': ['名词的复数', '复数', 'plural', '名词复数', '复数形式'],
           '名词辨析': ['名词', '名词辨析', 'noun', '名词选择'],

           // 1.2 代词
           '人称代词': ['人称代词', 'personal pronoun', 'I', 'you', 'he', 'she', 'it', 'we', 'they'],
           '物主代词': ['物主代词', 'possessive pronoun', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers'],
           '反身代词': ['反身代词', 'reflexive pronoun', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves'],
           '不定代词': ['不定代词', 'indefinite pronoun', 'some', 'any', 'no', 'every', 'someone', 'anyone', 'nothing'],
           '关系代词': ['关系代词', 'relative pronoun', 'who', 'whom', 'whose', 'which', 'that'],

           // 1.3 形容词与副词
           '形容词作定语': ['形容词作定语', '形容词', 'adjective', '定语', '修饰名词'],
           '副词的基本用法': ['副词的基本用法', '副词', 'adverb', '位置', '用法', '副词位置'],
           '比较级和最高级': ['比较级和最高级', '比较级', '最高级', 'comparative', 'superlative', 'more', 'most', 'er', 'est'],
           '位置与用法': ['位置', '用法', '副词', 'adverb', 'position', '副词位置'],

           // 1.4 动词
           '动词的形式': ['动词的形式', '动词', 'verb', '动词原形', '过去式', '过去分词', '现在分词'],
           '情态动词': ['情态动词', 'modal verb', 'can', 'could', 'may', 'might', 'must', 'should', 'will', 'would', 'need'],
           'can/could': ['can', 'could', '情态动词', 'modal verb', '能力', '可能'],
           'must/need': ['must', 'need', '情态动词', 'modal verb', '必须', '需要', '必要'],
           '非谓语动词': ['非谓语动词', 'non-finite verb', '动名词', '不定式', '分词'],
           '动名词': ['动名词', 'gerund', 'doing', '动名词形式', '非谓语动词'],
           '动词不定式': ['不定式', '动词不定式', 'infinitive', 'to do', 'to + 动词'],

           // 1.5 介词
           '时间介词': ['时间介词', '介词', 'preposition', 'at', 'on', 'in', 'during', 'for', 'since', 'before', 'after'],
           '地点介词': ['地点介词', '介词', 'preposition', 'in', 'on', 'at', 'under', 'over', 'above', 'below', 'beside'],
           '其他介词': ['其他介词', '介词', 'preposition', 'by', 'with', 'without', 'about', 'for', 'of'],
           '地点/方式介词': ['地点介词', '方式介词', '介词', 'preposition', 'in', 'on', 'at', 'by'],

           // 1.6 冠词
           '不定冠词': ['不定冠词', 'a', 'an', 'article', '冠词'],
           '定冠词': ['定冠词', 'the', 'article', '特指'],
           '零冠词': ['零冠词', '零冠词', '不用冠词', '无冠词'],

           // 1.7 数词
           '基数词与序数词': ['基数词', '序数词', 'cardinal', 'ordinal', 'first', 'second', 'third'],
           '数词的应用': ['数词的应用', '数词', 'number', '应用'],

           // 1.8 连词
           '并列连词': ['并列连词', '连词', 'conjunction', 'coordinating conjunction', 'and', 'but', 'or', 'so'],
           '从属连词': ['从属连词', '连词', 'conjunction', 'subordinating conjunction', 'because', 'if', 'when', 'although'],
           '连接词': ['连词', 'conjunction', '连接词', '连接', '并列连词', '从属连词'],

           // 2.2 动词时态
           '一般现在时': ['一般现在时', '现在时', 'present tense', 'simple present'],
           '一般过去时': ['一般过去时', '过去时', 'past tense', 'simple past', '过去式', '动词过去式'],
           '一般将来时': ['一般将来时', '将来时', 'future tense', 'will', 'be going to'],
           '现在进行时': ['现在进行时', '进行时', 'present continuous', 'present progressive', 'am/is/are doing'],
           '过去进行时': ['过去进行时', 'past continuous', 'past progressive', 'was/were doing'],
           '现在完成时': ['现在完成时', 'present perfect', 'have/has done'],
           '过去完成时': ['过去完成时', 'past perfect', 'had done'],

           // 2.3 被动语态
           '一般时被动': ['一般时被动', '被动语态', 'passive voice', '被动', 'be done', '被动形式'],
           '一般时态的被动语态': ['一般时态的被动语态', '被动语态', 'passive voice', 'am/is/are done'],
           '完成时态的被动语态': ['完成时态的被动语态', '被动语态', 'passive voice', 'have/has been done'],

           // 2.4 主谓一致
           '语法一致原则': ['语法一致原则', '主谓一致', 'subject-verb agreement', '一致', '单复数'],
           '意义一致原则': ['意义一致原则', '主谓一致', 'subject-verb agreement', '意义一致'],
           '就近原则': ['就近原则', '主谓一致', 'subject-verb agreement', '就近', 'there be'],
           '时态一致': ['时态一致', '主谓一致', 'tense agreement', 'subject-verb agreement', '一致'],

           // 2.5 复合句
           '宾语从句': ['宾语从句', 'object clause', '宾语', '从句', 'that', 'if', 'whether'],
           '定语从句': ['定语从句', 'attributive clause', '定语', '从句', 'that', 'which', 'who', 'whom', 'whose'],
           '状语从句': ['状语从句', 'adverbial clause', '时间', '条件', '原因', '结果', 'when', 'if', 'because'],
           '时间状语从句': ['时间状语从句', '状语从句', 'adverbial clause', 'when', 'while', 'as', 'before', 'after'],
           '条件状语从句': ['条件状语从句', '状语从句', 'adverbial clause', 'if', 'unless', '条件'],

           // 2.6 特殊句式
           'There be句型': ['There be', 'there be', 'there is', 'there are', '存在句', 'there be句型', 'There be 句型'],
           '感叹句': ['感叹句', 'exclamatory sentence', 'what', 'how', '感叹', '惊叹'],
           '祈使句': ['祈使句', 'imperative sentence', '祈使', '命令句', 'don\'t', 'please', '命令'],
           '倒装句': ['倒装句', 'inversion', '倒装', '倒置'],
           '疑问句': ['疑问句', 'question', '疑问', '问句', 'what', 'how', 'why', 'when', 'where', 'who']
         },

         // ========== 高中模块关键词表 ==========
         high: {
           // 高中时态关键词（规范化命名）
           '一般过去时': ['一般过去时', '过去时', 'past tense', 'simple past'],
           '一般将来时': ['一般将来时', '将来时', 'will', 'be going to'],

           // 高中语法点关键词
           '介词综合': ['介词', 'preposition'],
           '代词综合': ['代词', 'pronoun', '人称代词', '物主代词', '反身代词', '关系代词'],
           'it相关': ['it', 'it相关', 'it的用法', 'it作形式主语', 'it作形式宾语'],
           '连词综合': ['连词', 'conjunction'],
           '连词与名/动/形/副综合': ['连词', 'conjunction', '连词与', '并列连词', '从属连词'],
           '冠词综合': ['冠词', 'article', 'a', 'an', 'the'],
           'the的特殊用法': ['the', 'the的特殊用法', '定冠词', '特指'],
           '名词综合': ['名词', 'noun', '复数', '单复数', '名词复数', '复数形式'],
           '动词综合': ['动词', 'verb'],
           '并列句与动词': ['并列句', '动词', 'and', 'but', 'or'],
           '谓语': ['谓语', 'predicate'],
           '非谓语': ['非谓语', '非限定动词'],
           '现在分词综合': ['现在分词', 'ing', '非谓语', '分词'],
           '形容词综合': ['形容词', 'adjective', '比较级', '最高级'],
           '副词综合': ['副词', 'adverb'],
           '副词修饰动词': ['副词', 'adverb', '修饰动词', '副词修饰'],
           '定语从句综合': ['定语从句', 'attributive clause', 'that', 'which', 'who'],
           '状语从句综合': ['状语从句', 'adverbial clause', 'when', 'where', 'how', 'why'],

           // 高中名词子分类关键词
           '复合词和外来词': ['复合词', '外来词', 'compound', 'loanword', '复合', '外来'],
           '单复数同形': ['单复数同形', '单复数相同', '同形'],
           '不规则复数': ['不规则复数', '不规则', 'irregular plural'],
           '以o结尾': ['o结尾', '以o结尾', 'o ending'],
           '以y结尾': ['y结尾', '以y结尾', 'y ending'],
           's/sh/ch/x结尾': ['s结尾', 'sh结尾', 'ch结尾', 'x结尾', 's/sh/ch/x结尾']
         },

         // ========== 通用关键词（高中初中都可能用到） ==========
         common: {
           '固定搭配': ['固定搭配', '固定短语', '固定用法'],
           '以f/fe结尾': ['f结尾', 'fe结尾', '以f结尾', '以fe结尾', 'f/fe结尾', 'f/fe'],
           'f/fe结尾': ['f结尾', 'fe结尾', '以f结尾', '以fe结尾', 'f/fe结尾', 'f/fe']
         }
       };

       // 根据参数确定学段
       const finalSchoolLevel = schoolLevel || 'high'; // 如果传递 null 或 undefined，使用 high

       // 合并对应学段的关键词表
       const keywordMap = {
         ...keywordTables.common,
         ...keywordTables[finalSchoolLevel]
       };

       return keywordMap[grammarPoint] || [grammarPoint];
      
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