// 数据迁移到云端的执行脚本
// 在微信开发者工具中运行此脚本

const cloud = require('wx-server-sdk');

// 初始化云开发
cloud.init({
  env: 'your-cloud-env-id' // 请替换为您的云环境ID
});

const db = cloud.database();

// 迁移配置
const migrationConfig = {
  // 需要迁移的数据文件
  dataFiles: [
    {
      localFile: './data/grammar_test_sets.js',
      collection: 'grammar_test_sets',
      description: '语法测试题库'
    },
    {
      localFile: './writing_exercise_questions.js',
      collection: 'writing_exercise_questions', 
      description: '书写练习题库'
    },
    {
      localFile: './data/intermediate_questions.js',
      collection: 'intermediate_questions',
      description: '综合练习题库'
    },
    {
      localFile: './data/writing_pronouns.js',
      collection: 'writing_rules',
      description: '代词书写规则'
    },
    {
      localFile: './data/writing_nouns.js',
      collection: 'writing_rules',
      description: '名词书写规则'
    },
    {
      localFile: './data/writing_tenses.js',
      collection: 'writing_rules',
      description: '时态书写规则'
    },
    {
      localFile: './data/writing_voices.js',
      collection: 'writing_rules',
      description: '语态书写规则'
    },
    {
      localFile: './data/writing_comparisons.js',
      collection: 'writing_rules',
      description: '比较级书写规则'
    },
    {
      localFile: './data/writing_adverbs.js',
      collection: 'writing_rules',
      description: '副词书写规则'
    }
  ]
};

// 执行迁移
async function migrateAllData() {
  console.log('🚀 开始数据迁移到云端...');
  
  for (const config of migrationConfig.dataFiles) {
    try {
      console.log(`📦 正在迁移: ${config.description}`);
      
      // 加载本地数据
      const localData = require(config.localFile);
      
      // 准备云端数据
      const cloudData = {
        data: localData,
        version: '1.0.0',
        createTime: new Date(),
        updateTime: new Date(),
        fileName: config.localFile.split('/').pop()
      };
      
      // 上传到云端
      if (config.collection === 'writing_rules') {
        // 书写规则数据需要特殊处理
        await db.collection(config.collection).add({
          data: cloudData
        });
      } else {
        // 其他数据直接上传
        await db.collection(config.collection).add({
          data: cloudData
        });
      }
      
      console.log(`✅ ${config.description} 迁移完成`);
      
    } catch (error) {
      console.error(`❌ ${config.description} 迁移失败:`, error);
    }
  }
  
  console.log('🎉 数据迁移完成！');
}

// 验证迁移结果
async function verifyMigration() {
  console.log('🔍 验证迁移结果...');
  
  try {
    // 检查各个集合的数据
    const collections = ['grammar_test_sets', 'writing_exercise_questions', 'intermediate_questions', 'writing_rules'];
    
    for (const collectionName of collections) {
      const result = await db.collection(collectionName).count();
      console.log(`📊 ${collectionName}: ${result.total} 条记录`);
    }
    
    console.log('✅ 验证完成');
  } catch (error) {
    console.error('❌ 验证失败:', error);
  }
}

// 主函数
async function main() {
  try {
    await migrateAllData();
    await verifyMigration();
  } catch (error) {
    console.error('迁移过程出错:', error);
  }
}

// 执行迁移
main();

module.exports = {
  migrateAllData,
  verifyMigration
};
