// 智能题库推荐系统
// 基于Redis缓存的去重、内容扰动、难度控制算法

const RedisCache = require('./redisCache');
const UserAbilityProfile = require('../miniprogram/utils/userAbilityProfile');

class SmartQuestionRecommendation {
  constructor() {
    this.redisCache = new RedisCache();
    this.coolingPeriod = 172800; // 48小时冷却期
    this.warmUpRatio = 0.2; // 20%保温题比例
  }

  // 1. 双入口去重逻辑（触发时机：生成每日推荐/进阶之旅题单前）
  async getNoDuplicateQuestions(userId, practiceEntry, questionCount, tabType = '语法') {
    try {
      console.log(`开始为用户${userId}生成${practiceEntry}题单，目标数量：${questionCount}，类型：${tabType}`);
      
      // 初始化Redis缓存
      await this.redisCache.initTodayDoneQids(userId);
      
      // 获取已做过的题ID
      const doneQids = await this.redisCache.getTodayDoneQids(userId);
      console.log(`用户${userId}已做题数量：${doneQids.length}`);
      
      // 1. 筛选未做过的题
      const candidateQuestions = await this.getCandidateQuestions(userId, practiceEntry, tabType);
      const noDuplicateCandidates = candidateQuestions.filter(q => 
        !doneQids.includes(q.qid)
      );
      
      console.log(`候选题总数：${candidateQuestions.length}，去重后：${noDuplicateCandidates.length}`);
      
      // 2. 补足题量（若候选不足，从低优先级题库补）
      let finalQuestions = [...noDuplicateCandidates];
      if (noDuplicateCandidates.length < questionCount) {
        const supplementCount = questionCount - noDuplicateCandidates.length;
        const supplementQuestions = await this.getSupplementQuestions(
          userId, 
          practiceEntry, 
          supplementCount,
          tabType
        );
        finalQuestions = [...noDuplicateCandidates, ...supplementQuestions];
        console.log(`补充题目数量：${supplementQuestions.length}`);
      }
      
      // 3. 记录已做题ID（先写后读，保证幂等）
      const selectedQids = finalQuestions.slice(0, questionCount).map(q => q.qid);
      await this.redisCache.addDoneQids(userId, selectedQids);
      
      console.log(`最终推荐题目数量：${selectedQids.length}`);
      return finalQuestions.slice(0, questionCount);
      
    } catch (error) {
      console.error('获取去重题目失败:', error);
      return [];
    }
  }

  // 2. 内容扰动逻辑（触发时机：生成题单时过滤语法点）
  async filterGrammarPointByCooling(userId, candidateQuestions) {
    try {
      console.log(`开始为用户${userId}进行内容扰动过滤，候选题目：${candidateQuestions.length}道`);
      
      // 初始化语法点时间缓存
      await this.redisCache.initGrammarPointTime(userId);
      
      const currentTime = this.redisCache.getCurrentTimestamp();
      const filteredQuestions = [];
      
      for (const question of candidateQuestions) {
        const grammarPoint = question.grammar_point || question.category || 'other';
        const lastShowTime = await this.redisCache.getGrammarPointLastShow(userId, grammarPoint);
        
        // 规则1：48h内未出现 → 可推
        if (currentTime - parseInt(lastShowTime) >= this.coolingPeriod) {
          filteredQuestions.push(question);
          // 更新上次出现时间
          await this.redisCache.updateGrammarPointLastShow(userId, grammarPoint, currentTime);
        }
      }
      
      console.log(`冷却期过滤后题目数量：${filteredQuestions.length}`);
      
      // 规则2：每周强制插入20%已掌握题（保温题）
      const masteredQuestions = await this.getMasteredQuestions(userId);
      const warmUpCount = Math.floor(filteredQuestions.length * this.warmUpRatio);
      
      if (masteredQuestions.length > 0 && warmUpCount > 0) {
        const warmUpQuestions = masteredQuestions.slice(0, warmUpCount);
        // 替换最后20%的题目为保温题
        filteredQuestions.splice(-warmUpCount, warmUpCount, ...warmUpQuestions);
        console.log(`插入保温题数量：${warmUpQuestions.length}`);
      }
      
      return filteredQuestions;
      
    } catch (error) {
      console.error('内容扰动过滤失败:', error);
      return candidateQuestions;
    }
  }

  // 3. 难度跳变控制（坡度因子）
  async adjustQuestionDifficulty(userId, lastAccuracy, candidateQuestions) {
    try {
      console.log(`开始为用户${userId}调整题目难度，上次正确率：${lastAccuracy}%`);
      
      // 获取用户当前等级
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();
      const currentLevel = abilityProfile.getLevelValue(abilityProfile.abilityData.grammarLevel);
      
      console.log(`用户当前语法等级：${currentLevel}`);
      
      // 坡度因子：难度变动≤±1级
      const maxLevel = Math.min(currentLevel + 1, 5);
      const minLevel = Math.max(currentLevel - 1, 1);
      
      // 过滤难度超范围的题
      let adjustedQuestions = candidateQuestions.filter(q => {
        const difficulty = q.difficulty_level || this.getDifficultyFromLevel(q.level) || 3;
        return minLevel <= difficulty && difficulty <= maxLevel;
      });
      
      console.log(`难度范围过滤后题目数量：${adjustedQuestions.length}`);
      
      // 按上次正确率微调占比
      if (lastAccuracy < 60) {
        // <60%→70%低难度
        const lowDiffQuestions = adjustedQuestions.filter(q => {
          const difficulty = q.difficulty_level || this.getDifficultyFromLevel(q.level) || 3;
          return difficulty === minLevel;
        });
        const lowDiffCount = Math.floor(adjustedQuestions.length * 0.7);
        adjustedQuestions = [
          ...lowDiffQuestions.slice(0, lowDiffCount),
          ...adjustedQuestions.filter(q => {
            const difficulty = q.difficulty_level || this.getDifficultyFromLevel(q.level) || 3;
            return difficulty !== minLevel;
          })
        ];
        console.log(`低难度题目占比调整：${lowDiffCount}/${adjustedQuestions.length}`);
        
      } else if (lastAccuracy > 85) {
        // >85%→70%高难度
        const highDiffQuestions = adjustedQuestions.filter(q => {
          const difficulty = q.difficulty_level || this.getDifficultyFromLevel(q.level) || 3;
          return difficulty === maxLevel;
        });
        const highDiffCount = Math.floor(adjustedQuestions.length * 0.7);
        adjustedQuestions = [
          ...highDiffQuestions.slice(0, highDiffCount),
          ...adjustedQuestions.filter(q => {
            const difficulty = q.difficulty_level || this.getDifficultyFromLevel(q.level) || 3;
            return difficulty !== maxLevel;
          })
        ];
        console.log(`高难度题目占比调整：${highDiffCount}/${adjustedQuestions.length}`);
      }
      
      return adjustedQuestions;
      
    } catch (error) {
      console.error('难度调整失败:', error);
      return candidateQuestions;
    }
  }

  // 获取候选题（原推题逻辑）
  async getCandidateQuestions(userId, practiceEntry, tabType = '语法') {
    // 这里应该调用原有的推荐逻辑
    // 模拟返回一些题目数据
    const mockQuestions = this.generateMockQuestions();
    
    // 根据练习入口类型调整题目特征
    let filteredQuestions = mockQuestions;
    
    if (practiceEntry === 'daily_recommend') {
      filteredQuestions = mockQuestions.filter(q => q.type === 'daily');
    } else if (practiceEntry === 'advanced_journey') {
      filteredQuestions = mockQuestions.filter(q => q.type === 'advanced');
    }
    
    // 根据标签类型（语法/书写）进一步过滤
    if (tabType === '语法') {
      filteredQuestions = filteredQuestions.filter(q => q.category === 'grammar');
    } else if (tabType === '书写') {
      filteredQuestions = filteredQuestions.filter(q => q.category === 'writing');
    }
    
    return filteredQuestions;
  }

  // 获取补充题目（低优先级题库）
  async getSupplementQuestions(userId, practiceEntry, count, tabType = '语法') {
    // 模拟从低优先级题库获取题目
    const allQuestions = this.generateMockQuestions();
    let supplementQuestions = allQuestions.filter(q => q.priority === 'low');
    
    // 根据标签类型过滤
    if (tabType === '语法') {
      supplementQuestions = supplementQuestions.filter(q => q.category === 'grammar');
    } else if (tabType === '书写') {
      supplementQuestions = supplementQuestions.filter(q => q.category === 'writing');
    }
    
    return supplementQuestions.slice(0, count);
  }

  // 获取已掌握题目（Level4-5的语法点题目）
  async getMasteredQuestions(userId) {
    try {
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();
      
      // 获取用户掌握的语法点（Level4-5）
      const masteredPoints = [];
      Object.keys(abilityProfile.abilityData.grammarPoints || {}).forEach(point => {
        const level = abilityProfile.abilityData.grammarPoints[point];
        if (level >= 4) {
          masteredPoints.push(point);
        }
      });
      
      console.log(`用户已掌握语法点：${masteredPoints.join(', ')}`);
      
      // 根据已掌握语法点获取保温题
      const allQuestions = this.generateMockQuestions();
      return allQuestions.filter(q => 
        masteredPoints.includes(q.grammar_point || q.category)
      ).slice(0, 10); // 最多返回10道保温题
      
    } catch (error) {
      console.error('获取已掌握题目失败:', error);
      return [];
    }
  }

  // 从等级字符串获取难度数值
  getDifficultyFromLevel(level) {
    const levelMap = {
      '初级': 1,
      '中级': 2,
      '高级': 3,
      '专家': 4,
      '大师': 5
    };
    return levelMap[level] || 3;
  }

  // 生成模拟题目数据
  generateMockQuestions() {
    const grammarPoints = [
      "preposition", "pronoun", "conjunction", "article", 
      "noun", "verb", "predicate", "non_predicate", 
      "adjective", "adverb", "attributive_clause", "adverbial_clause"
    ];
    
    const writingPoints = [
      "时态", "语态", "主谓一致", "非谓语动词", 
      "从句", "虚拟语气", "倒装", "省略"
    ];
    
    const questions = [];
    
    // 生成语法题目
    for (let i = 1; i <= 60; i++) {
      const randomPoint = grammarPoints[Math.floor(Math.random() * grammarPoints.length)];
      questions.push({
        qid: `grammar_${i}`,
        text: `语法题目${i}：这是关于${randomPoint}的题目`,
        answer: 'A',
        grammar_point: randomPoint,
        category: 'grammar',
        difficulty_level: Math.floor(Math.random() * 5) + 1,
        level: ['初级', '中级', '高级', '专家', '大师'][Math.floor(Math.random() * 5)],
        type: Math.random() > 0.5 ? 'daily' : 'advanced',
        priority: Math.random() > 0.7 ? 'low' : 'high'
      });
    }
    
    // 生成书写题目
    for (let i = 1; i <= 40; i++) {
      const randomPoint = writingPoints[Math.floor(Math.random() * writingPoints.length)];
      questions.push({
        qid: `writing_${i}`,
        text: `书写题目${i}：这是关于${randomPoint}的书写练习`,
        answer: 'B',
        grammar_point: randomPoint,
        category: 'writing',
        difficulty_level: Math.floor(Math.random() * 5) + 1,
        level: ['初级', '中级', '高级', '专家', '大师'][Math.floor(Math.random() * 5)],
        type: Math.random() > 0.5 ? 'daily' : 'advanced',
        priority: Math.random() > 0.7 ? 'low' : 'high'
      });
    }
    
    return questions;
  }

  // 综合推荐流程
  async generateSmartRecommendation(userId, practiceEntry, questionCount, tabType = '语法') {
    try {
      console.log(`\n=== 开始为用户${userId}生成智能推荐 ===`);
      console.log(`练习入口：${practiceEntry}，目标数量：${questionCount}，类型：${tabType}`);
      
      // 1. 获取用户最近练习正确率
      const abilityProfile = new UserAbilityProfile();
      abilityProfile.loadProfile();
      const recentAccuracy = abilityProfile.abilityData.learningProgress.correctRate || 70;
      
      console.log(`用户最近正确率：${recentAccuracy}%`);
      
      // 2. 去重处理
      let questions = await this.getNoDuplicateQuestions(userId, practiceEntry, questionCount * 2, tabType); // 多生成一些用于后续过滤
      
      // 3. 内容扰动过滤（仅对语法题目适用）
      if (tabType === '语法') {
        questions = await this.filterGrammarPointByCooling(userId, questions);
      }
      
      // 4. 难度调整
      questions = await this.adjustQuestionDifficulty(userId, recentAccuracy, questions);
      
      // 5. 最终筛选
      const finalQuestions = questions.slice(0, questionCount);
      
      console.log(`\n=== 智能推荐完成 ===`);
      console.log(`最终推荐题目数量：${finalQuestions.length}`);
      console.log(`题目ID列表：${finalQuestions.map(q => q.qid).join(', ')}`);
      
      return finalQuestions;
      
    } catch (error) {
      console.error('生成智能推荐失败:', error);
      return [];
    }
  }

  // 获取推荐统计信息
  async getRecommendationStats(userId) {
    try {
      const doneQids = await this.redisCache.getTodayDoneQids(userId);
      const cacheStats = this.redisCache.getCacheStats();
      
      return {
        userId: userId,
        todayDoneCount: doneQids.length,
        cacheKeys: cacheStats.keys,
        coolingPeriod: this.coolingPeriod,
        warmUpRatio: this.warmUpRatio
      };
    } catch (error) {
      console.error('获取推荐统计失败:', error);
      return null;
    }
  }
}

module.exports = SmartQuestionRecommendation;
