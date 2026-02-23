// 云数据库迁移设置脚本
// 用于将本地数据文件迁移到云数据库

const cloud = require('wx-server-sdk');

// 初始化云开发
cloud.init({
  env: 'your-cloud-env-id' // 替换为您的云环境ID
});

const db = cloud.database();

// 数据迁移函数
async function migrateDataToCloud() {
  try {
    console.log('开始迁移数据到云数据库...');
    
    // 1. 迁移语法测试题库
    const grammarTestSets = require('./data/grammar_test_sets.js');
    await db.collection('grammar_test_sets').add({
      data: {
        data: grammarTestSets,
        version: '1.0.0',
        createTime: new Date(),
        updateTime: new Date()
      }
    });
    console.log('语法测试题库迁移完成');
    
    // 2. 迁移书写练习题库
    const writingExerciseQuestions = require('./writing_exercise_questions.js');
    await db.collection('writing_exercise_questions').add({
      data: {
        data: writingExerciseQuestions,
        version: '1.0.0',
        createTime: new Date(),
        updateTime: new Date()
      }
    });
    console.log('书写练习题库迁移完成');
    
    // 3. 迁移综合练习题库
    const intermediateQuestions = require('./data/intermediate_questions.js');
    await db.collection('intermediate_questions').add({
      data: {
        data: intermediateQuestions,
        version: '1.0.0',
        createTime: new Date(),
        updateTime: new Date()
      }
    });
    console.log('综合练习题库迁移完成');
    
    // 4. 迁移书写规则数据
    const writingDataFiles = [
      { fileName: 'writing_pronouns.js', data: require('./data/writing_pronouns.js') },
      { fileName: 'writing_nouns.js', data: require('./data/writing_nouns.js') },
      { fileName: 'writing_tenses.js', data: require('./data/writing_tenses.js') },
      { fileName: 'writing_voices.js', data: require('./data/writing_voices.js') },
      { fileName: 'writing_comparisons.js', data: require('./data/writing_comparisons.js') },
      { fileName: 'writing_adverbs.js', data: require('./data/writing_adverbs.js') }
    ];
    
    for (const { fileName, data } of writingDataFiles) {
      await db.collection('writing_rules').add({
        data: {
          fileName: fileName,
          data: data,
          version: '1.0.0',
          createTime: new Date(),
          updateTime: new Date()
        }
      });
      console.log(`${fileName} 迁移完成`);
    }
    
    console.log('所有数据迁移完成！');
    
  } catch (error) {
    console.error('数据迁移失败:', error);
  }
}

// 执行迁移
migrateDataToCloud();

module.exports = {
  migrateDataToCloud
};
