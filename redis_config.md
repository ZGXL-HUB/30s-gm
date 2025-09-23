# Redis配置说明

## 概述

本智能题库推荐系统使用Redis作为缓存层，实现去重、内容扰动、难度控制等功能。以下是Redis的配置和使用说明。

## Redis数据结构

### 1. 当日已做题ID集合
- **键格式**: `user:{userId}:today_done_qids`
- **数据类型**: Set
- **过期时间**: 24小时 (86400秒)
- **用途**: 存储用户当日已做过的题目ID，避免重复推荐

```redis
# 示例
SADD user:12345:today_done_qids q_001 q_002 q_003
EXPIRE user:12345:today_done_qids 86400
```

### 2. 语法点上次出现时间
- **键格式**: `user:{userId}:grammar_point_last_show`
- **数据类型**: Hash
- **过期时间**: 无（持久化）
- **用途**: 记录每个语法点上次出现的时间，实现48小时冷却期

```redis
# 示例
HMSET user:12345:grammar_point_last_show preposition 1640995200 pronoun 1640995200
```

## 配置参数

### 环境变量配置
```bash
# Redis连接配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0

# 推荐系统参数
COOLING_PERIOD=172800  # 48小时冷却期（秒）
WARM_UP_RATIO=0.2      # 保温题比例（20%）
MAX_QUESTION_COUNT=20   # 单次最大推荐题目数
```

### 代码配置
```javascript
// utils/redisCache.js
class RedisCache {
  constructor() {
    this.host = process.env.REDIS_HOST || 'localhost';
    this.port = process.env.REDIS_PORT || 6379;
    this.password = process.env.REDIS_PASSWORD || '';
    this.db = process.env.REDIS_DB || 0;
    this.defaultExpire = 86400; // 24小时
  }
}
```

## 部署步骤

### 1. 安装Redis
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# CentOS/RHEL
sudo yum install redis

# macOS
brew install redis

# Docker
docker run -d --name redis -p 6379:6379 redis:alpine
```

### 2. 配置Redis
```bash
# 编辑配置文件
sudo nano /etc/redis/redis.conf

# 主要配置项
bind 127.0.0.1
port 6379
requirepass your_password
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### 3. 启动Redis服务
```bash
# 启动服务
sudo systemctl start redis
sudo systemctl enable redis

# 验证连接
redis-cli ping
```

### 4. Node.js Redis客户端
```bash
# 安装Redis客户端
npm install redis
```

```javascript
// 实际Redis连接代码
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB
});

client.on('connect', () => {
  console.log('Redis连接成功');
});

client.on('error', (err) => {
  console.error('Redis连接错误:', err);
});
```

## 性能优化

### 1. 内存优化
```bash
# Redis配置
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### 2. 连接池配置
```javascript
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('Redis服务器拒绝连接');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('重试时间超限');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});
```

### 3. 批量操作优化
```javascript
// 使用管道批量操作
const pipeline = client.pipeline();
pipeline.sadd('user:123:today_done_qids', 'q1', 'q2', 'q3');
pipeline.expire('user:123:today_done_qids', 86400);
pipeline.exec((err, results) => {
  if (err) throw err;
  console.log('批量操作完成');
});
```

## 监控和维护

### 1. Redis监控命令
```bash
# 查看内存使用
redis-cli info memory

# 查看连接数
redis-cli info clients

# 查看慢查询
redis-cli slowlog get 10

# 查看键空间
redis-cli info keyspace
```

### 2. 数据备份
```bash
# 手动备份
redis-cli BGSAVE

# 定时备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
redis-cli BGSAVE
cp /var/lib/redis/dump.rdb /backup/redis_backup_$DATE.rdb
```

### 3. 清理过期数据
```javascript
// 定期清理脚本
setInterval(async () => {
  const keys = await client.keys('user:*:today_done_qids');
  for (const key of keys) {
    const ttl = await client.ttl(key);
    if (ttl === -1) { // 没有设置过期时间
      await client.expire(key, 86400);
    }
  }
}, 3600000); // 每小时执行一次
```

## 故障排查

### 1. 常见问题
```bash
# 连接被拒绝
Error: Redis connection to localhost:6379 failed - ECONNREFUSED
# 解决：检查Redis服务是否启动

# 内存不足
Error: OOM command not allowed when used memory > 'maxmemory'
# 解决：增加maxmemory或调整内存策略

# 键不存在
Error: key does not exist
# 解决：检查键名是否正确，是否已过期
```

### 2. 日志配置
```javascript
// 启用Redis日志
client.on('connect', () => {
  console.log('Redis连接成功');
});

client.on('ready', () => {
  console.log('Redis准备就绪');
});

client.on('error', (err) => {
  console.error('Redis错误:', err);
});

client.on('end', () => {
  console.log('Redis连接关闭');
});
```

## 安全配置

### 1. 访问控制
```bash
# 设置密码
requirepass your_strong_password

# 绑定IP
bind 127.0.0.1 10.0.0.1

# 禁用危险命令
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command DEBUG ""
```

### 2. 网络安全
```bash
# 使用防火墙
sudo ufw allow from 10.0.0.0/8 to any port 6379

# SSL/TLS加密（Redis 6.0+）
tls-port 6380
tls-cert-file /path/to/cert.pem
tls-key-file /path/to/key.pem
```

## 测试验证

### 1. 连接测试
```bash
# 测试连接
redis-cli -h localhost -p 6379 -a your_password ping

# 测试基本操作
redis-cli -h localhost -p 6379 -a your_password set test_key "test_value"
redis-cli -h localhost -p 6379 -a your_password get test_key
```

### 2. 性能测试
```bash
# 基准测试
redis-benchmark -h localhost -p 6379 -a your_password -q -n 10000 -c 10
```

### 3. 功能测试
```javascript
// 运行测试脚本
node smart_recommendation_example.js
```

## 生产环境建议

1. **高可用配置**: 使用Redis Sentinel或Cluster模式
2. **监控告警**: 集成Prometheus + Grafana监控
3. **数据持久化**: 配置RDB和AOF双重持久化
4. **容量规划**: 根据用户量合理规划内存容量
5. **备份策略**: 定期备份和异地存储
6. **版本管理**: 使用稳定版本的Redis

## 相关文件

- `utils/redisCache.js` - Redis缓存工具类
- `utils/smartQuestionRecommendation.js` - 智能推荐算法
- `utils/recommendationService.js` - 推荐服务接口
- `smart_recommendation_example.js` - 使用示例和测试
