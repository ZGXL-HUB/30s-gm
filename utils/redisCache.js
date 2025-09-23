// Redis缓存管理工具类
// 用于智能题库去重和推荐系统

class RedisCache {
  constructor() {
    // 模拟Redis操作（实际项目中需要连接真实Redis）
    this.cache = new Map();
    this.defaultExpire = 86400; // 24小时过期时间
  }

  // 模拟Redis操作
  async exists(key) {
    return this.cache.has(key);
  }

  async sadd(key, members) {
    if (!this.cache.has(key)) {
      this.cache.set(key, new Set());
    }
    const set = this.cache.get(key);
    members.forEach(member => set.add(member));
    this.cache.set(key, set);
    return members.length;
  }

  async smembers(key) {
    const set = this.cache.get(key);
    return set ? Array.from(set) : [];
  }

  async hmset(key, data) {
    this.cache.set(key, new Map(Object.entries(data)));
  }

  async hget(key, field) {
    const hash = this.cache.get(key);
    return hash ? hash.get(field) : null;
  }

  async hset(key, field, value) {
    if (!this.cache.has(key)) {
      this.cache.set(key, new Map());
    }
    const hash = this.cache.get(key);
    hash.set(field, value);
    this.cache.set(key, hash);
  }

  async expire(key, seconds) {
    // 模拟过期时间设置
    setTimeout(() => {
      this.cache.delete(key);
    }, seconds * 1000);
  }

  // 获取当前时间戳（秒）
  getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  // 初始化当日已做题ID集合
  async initTodayDoneQids(userId) {
    const redisKey = `user:${userId}:today_done_qids`;
    
    if (!(await this.exists(redisKey))) {
      await this.sadd(redisKey, []);
      await this.expire(redisKey, 86400); // 24小时过期
      console.log(`初始化用户${userId}当日已做题ID集合`);
    }
  }

  // 初始化语法点上次出现时间
  async initGrammarPointTime(userId) {
    const redisKey = `user:${userId}:grammar_point_last_show`;
    
    if (!(await this.exists(redisKey))) {
      // 初始化所有语法点（项目12个语法大类）为当前时间-48h（默认可推）
      const currentTime = this.getCurrentTimestamp();
      const initTime = currentTime - 172800; // 48小时前
      
      const grammarPoints = [
        "preposition", "pronoun", "conjunction", "article", 
        "noun", "verb", "predicate", "non_predicate", 
        "adjective", "adverb", "attributive_clause", "adverbial_clause"
      ];
      
      const initData = {};
      grammarPoints.forEach(point => {
        initData[point] = initTime;
      });
      
      await this.hmset(redisKey, initData);
      console.log(`初始化用户${userId}语法点上次出现时间`);
    }
  }

  // 获取当日已做题ID集合
  async getTodayDoneQids(userId) {
    const redisKey = `user:${userId}:today_done_qids`;
    return await this.smembers(redisKey);
  }

  // 添加已做题ID
  async addDoneQids(userId, qids) {
    const redisKey = `user:${userId}:today_done_qids`;
    return await this.sadd(redisKey, qids);
  }

  // 获取语法点上次出现时间
  async getGrammarPointLastShow(userId, grammarPoint) {
    const redisKey = `user:${userId}:grammar_point_last_show`;
    return await this.hget(redisKey, grammarPoint);
  }

  // 更新语法点上次出现时间
  async updateGrammarPointLastShow(userId, grammarPoint, timestamp = null) {
    const redisKey = `user:${userId}:grammar_point_last_show`;
    const time = timestamp || this.getCurrentTimestamp();
    await this.hset(redisKey, grammarPoint, time);
  }

  // 检查题目是否在冷却期内
  async isInCoolingPeriod(userId, grammarPoint, coolingPeriod = 172800) {
    const lastShowTime = await this.getGrammarPointLastShow(userId, grammarPoint);
    if (!lastShowTime) return false;
    
    const currentTime = this.getCurrentTimestamp();
    return (currentTime - parseInt(lastShowTime)) < coolingPeriod;
  }

  // 清除过期缓存
  clearExpiredCache() {
    // 实际项目中Redis会自动处理过期，这里只是演示
    console.log('清除过期缓存');
  }

  // 获取缓存统计信息
  getCacheStats() {
    return {
      totalKeys: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

module.exports = RedisCache;
