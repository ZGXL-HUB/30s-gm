// 生成完整的数据迁移脚本
const fs = require('fs');
const path = require('path');

// 读取本地数据
function readLocalData() {
  try {
    const filePath = './miniprogram/data/intermediate_questions.js';
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 提取questions对象
    const questionsMatch = content.match(/const questions = ({[\s\S]*?});/);
    if (!questionsMatch) {
      throw new Error('无法找到questions对象');
    }
    
    const questionsStr = questionsMatch[1];
    const questions = Function('return ' + questionsStr)();
    
    console.log('✅ 成功读取本地数据，共', Object.keys(questions).length, '个分类');
    return questions;
  } catch (error) {
    console.error('❌ 读取本地数据失败:', error.message);
    return null;
  }
}

// 转换数据格式
function convertToCloudFormat(questions) {
  const cloudData = [];
  let totalQuestions = 0;
  const categoryStats = {};
  
  console.log('🔄 转换数据格式...');
  
  Object.keys(questions).forEach(category => {
    const categoryQuestions = questions[category];
    
    if (!Array.isArray(categoryQuestions)) {
      console.warn('⚠️ 跳过非数组格式的分类:', category);
      return;
    }
    
    categoryStats[category] = 0;
    
    categoryQuestions.forEach((question, index) => {
      if (!question || typeof question !== 'object') {
        console.warn('⚠️ 跳过无效的题目数据:', category + '[' + index + ']');
        return;
      }
      
      // 判断数据类型
      let type = 'question'; // 默认为题目
      let additionalFields = {};
      
      // 检查是否为笔记数据
      if (question.notes || question.note) {
        type = 'note';
        additionalFields = {
          notes: question.notes || question.note,
          tables: question.tables || null
        };
      }
      
      // 检查是否为表格数据
      if (question.table || question.tables) {
        type = 'table';
        additionalFields = {
          table: question.table || question.tables,
          interactive: question.interactive || false
        };
      }
      
      cloudData.push({
        category: category,
        type: type,
        text: question.text || '',
        answer: question.answer || '',
        analysis: question.analysis || '',
        order: index + 1,
        createTime: new Date(),
        updateTime: new Date(),
        source: 'safe_migration',
        ...additionalFields
      });
      
      categoryStats[category]++;
      totalQuestions++;
    });
  });
  
  console.log('✅ 转换完成，共', totalQuestions, '道题目');
  console.log('📊 分类统计:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log('  ' + category + ': ' + count + ' 题');
  });
  
  return { cloudData, categoryStats, totalQuestions };
}

// 生成迁移脚本
function generateMigrationScript(cloudData, categoryStats, totalQuestions) {
  const script = `// 安全的数据迁移脚本
// 请在云开发控制台执行

const db = wx.cloud.database()
const questionsCollection = db.collection('questions')

async function safeMigration() {
  try {
    console.log('🚀 开始安全迁移...')
    
    // 1. 备份现有数据
    console.log('📦 备份现有数据...')
    const existingData = await questionsCollection.get()
    console.log(\`备份现有数据: \${existingData.data.length} 条记录\`)
    
    // 2. 清空现有数据
    console.log('🗑️ 清空现有数据...')
    await questionsCollection.where({}).remove()
    console.log('已清空现有数据')
    
    // 3. 导入新数据
    console.log('📥 导入新数据...')
    const questions = ${JSON.stringify(cloudData, null, 2)}
    
    const batchSize = 100
    let importedCount = 0
    
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize)
      await questionsCollection.add({ data: batch })
      importedCount += batch.length
      console.log(\`已导入第 \${importedCount} 条记录 (共 ${totalQuestions} 条)\`)
    }
    
    console.log('✅ 迁移完成!')
    
    // 4. 验证迁移结果
    console.log('🔍 验证迁移结果...')
    const verifyData = await questionsCollection.count()
    console.log(\`验证结果: \${verifyData.total} 条记录\`)
    
    // 5. 验证分类完整性
    console.log('📊 验证分类完整性...')
    const categoryVerify = await questionsCollection
      .aggregate()
      .group({
        _id: '$category',
        count: db.command.aggregate.sum(1)
      })
      .end()
    
    console.log('分类统计:')
    categoryVerify.list.forEach(item => {
      const expected = ${JSON.stringify(categoryStats)}[item._id] || 0
      const status = item.count === expected ? '✅' : '⚠️'
      console.log(\`  \${status} \${item._id}: \${item.count} 题 (预期: \${expected})\`)
    })
    
    return { 
      success: true, 
      total: verifyData.total,
      categories: categoryVerify.list.length
    }
  } catch (error) {
    console.error('❌ 迁移失败:', error)
    return { success: false, error: error.message }
  }
}

// 执行迁移
safeMigration().then(result => {
  console.log('🎉 迁移结果:', result)
  
  if (result.success) {
    console.log('\\n📋 下一步操作:')
    console.log('  1. 部署新的云函数: grammarCategoryMapping')
    console.log('  2. 更新 getQuestionsData 云函数')
    console.log('  3. 验证语法组合功能')
    console.log('  4. 删除本地数据文件')
  }
})
`;
  
  return script;
}

// 主函数
function main() {
  console.log('🚀 开始生成完整迁移脚本...');
  
  // 1. 读取本地数据
  const localData = readLocalData();
  if (!localData) {
    console.error('❌ 无法读取本地数据，脚本生成终止');
    process.exit(1);
  }
  
  // 2. 转换数据格式
  const { cloudData, categoryStats, totalQuestions } = convertToCloudFormat(localData);
  
  // 3. 生成迁移脚本
  const migrationScript = generateMigrationScript(cloudData, categoryStats, totalQuestions);
  
  // 4. 保存脚本文件
  fs.writeFileSync('./complete_migration_script.js', migrationScript, 'utf8');
  
  console.log('');
  console.log('✅ 完整迁移脚本已生成: complete_migration_script.js');
  console.log('📊 数据统计:');
  console.log('  总分类数:', Object.keys(categoryStats).length);
  console.log('  总题目数:', totalQuestions);
  console.log('');
  console.log('📋 下一步操作:');
  console.log('  1. 部署云函数: grammarCategoryMapping 和 getQuestionsData');
  console.log('  2. 在云开发控制台执行 complete_migration_script.js');
  console.log('  3. 执行验证脚本 validate_migration_script.js');
  console.log('  4. 测试语法组合功能');
}

// 执行主函数
main();
