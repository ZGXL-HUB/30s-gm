// 回滚迁移脚本
// 当云数据库迁移出现问题时的安全回滚方案

const fs = require('fs')
const path = require('path')

// 生成回滚脚本
function generateRollbackScript() {
  const script = `
// 回滚迁移脚本
// 请在云开发控制台执行

const db = wx.cloud.database()
const questionsCollection = db.collection('questions')

async function rollbackMigration() {
  try {
    console.log('🔄 开始回滚迁移...')
    
    // 1. 清空云数据库
    console.log('🗑️ 清空云数据库...')
    const deleteResult = await questionsCollection.where({}).remove()
    console.log(\`已删除 \${deleteResult.stats.removed} 条记录\`)
    
    // 2. 验证清空结果
    const verifyResult = await questionsCollection.count()
    console.log(\`验证结果: 剩余 \${verifyResult.total} 条记录\`)
    
    if (verifyResult.total === 0) {
      console.log('✅ 云数据库已成功清空')
    } else {
      console.log('⚠️ 云数据库未完全清空，请手动检查')
    }
    
    console.log('\\n📋 回滚完成！')
    console.log('📋 请手动执行以下操作:')
    console.log('  1. 恢复前端代码中的本地数据加载逻辑')
    console.log('  2. 确保 miniprogram/data/intermediate_questions.js 文件存在')
    console.log('  3. 测试语法组合功能是否正常')
    console.log('  4. 如有问题，请联系技术支持')
    
    return { success: true, deletedCount: deleteResult.stats.removed }
    
  } catch (error) {
    console.error('❌ 回滚失败:', error)
    return { success: false, error: error.message }
  }
}

// 执行回滚
rollbackMigration().then(result => {
  if (result.success) {
    console.log('\\n🎉 回滚成功！')
  } else {
    console.log('\\n⚠️ 回滚失败，请检查错误信息')
  }
})
`
  
  return script
}

// 生成前端代码恢复指南
function generateFrontendRestoreGuide() {
  const guide = `
# 前端代码恢复指南

## 需要恢复的文件和代码

### 1. 恢复语法选择页面的本地逻辑

文件: miniprogram/pages/grammar-select/index.js

需要恢复的关键函数:
\`\`\`javascript
// 恢复本地获取子点的函数
getSubPointsByCategory: function(category) {
  const categoryIndex = this.data.categories.indexOf(category);
  if (categoryIndex === -1) return [];
  
  const subPoints = this.data.rightPanel[categoryIndex] || [];
  return subPoints.filter(point => this.isPointExists(point));
},

// 恢复本地系统组合逻辑
executeSystemCombo: function(isPreview = false) {
  const systemComboRules = {
    "介词": 1,
    "代词": 1,
    "连词": 1,
    "冠词": 1,
    "名词": 1,
    "动词": 1,
    "谓语": 1,
    "非谓语": { "现在分词综合": 1, "过去分词综合": 1, "不定式综合": 1 },
    "形容词/副词": 1,
    "定语从句/状语和从句": 1
  };
  
  // 恢复原有的系统组合逻辑...
}
\`\`\`

### 2. 恢复主页面的本地逻辑

文件: miniprogram/pages/index/index.js

需要恢复的关键函数:
\`\`\`javascript
// 恢复本地获取语法点的函数
getGrammarPointsByCategory(category) {
  const categoryMap = {
    "介词": ["介词综合", "固定搭配", "介词 + 名词/动名词"],
    // ... 其他映射
  };
  return categoryMap[category] || [];
}
\`\`\`

### 3. 恢复练习页面的本地逻辑

文件: miniprogram/pages/exercise-page/index.js

需要恢复本地数据加载逻辑，确保从 intermediate_questions.js 加载数据。

### 4. 移除云服务相关代码

移除以下导入和调用:
- const grammarCategoryService = require('../../utils/grammarCategoryService')
- 所有 wx.cloud.callFunction 调用
- 云服务相关的错误处理逻辑

## 验证步骤

1. 确保 intermediate_questions.js 文件存在且完整
2. 测试语法点选择功能
3. 测试系统默认组合功能
4. 测试自定义组合功能
5. 测试练习功能

## 注意事项

- 回滚后需要重新测试所有功能
- 确保本地数据文件完整
- 如有问题，检查控制台错误日志
`
  
  return guide
}

// 生成完整的回滚方案
function generateCompleteRollbackPlan() {
  const rollbackScript = generateRollbackScript()
  const frontendGuide = generateFrontendRestoreGuide()
  
  const completePlan = `
# 完整的回滚方案

## 问题诊断

如果遇到以下情况，需要执行回滚:
1. 语法组合功能无法正常工作
2. 系统推荐组合找不到对应的语法点
3. 云函数调用失败
4. 数据迁移后功能异常

## 回滚步骤

### 步骤1: 清空云数据库

在云开发控制台执行以下脚本:

\`\`\`javascript
${rollbackScript}
\`\`\`

### 步骤2: 恢复前端代码

${frontendGuide}

### 步骤3: 验证功能

1. 测试语法点选择页面
2. 测试系统默认组合
3. 测试自定义组合
4. 测试练习功能

### 步骤4: 清理云函数（可选）

如果确定不再使用云数据库，可以删除以下云函数:
- grammarCategoryMapping
- getQuestionsData (或恢复原版本)

## 预防措施

为避免类似问题，建议:
1. 在测试环境先验证迁移
2. 保留完整的本地数据备份
3. 制定详细的测试计划
4. 准备回滚方案

## 技术支持

如果回滚后仍有问题，请提供:
1. 控制台错误日志
2. 具体的功能异常描述
3. 数据文件完整性检查结果
`
  
  return completePlan
}

// 主函数
function main() {
  console.log('🔄 生成回滚方案...')
  
  const rollbackScript = generateRollbackScript()
  const frontendGuide = generateFrontendRestoreGuide()
  const completePlan = generateCompleteRollbackPlan()
  
  // 保存文件
  fs.writeFileSync('./rollback_script.js', rollbackScript, 'utf8')
  fs.writeFileSync('./frontend_restore_guide.md', frontendGuide, 'utf8')
  fs.writeFileSync('./complete_rollback_plan.md', completePlan, 'utf8')
  
  console.log('✅ 回滚方案已生成:')
  console.log('  📄 rollback_script.js - 云数据库回滚脚本')
  console.log('  📄 frontend_restore_guide.md - 前端代码恢复指南')
  console.log('  📄 complete_rollback_plan.md - 完整回滚方案')
  console.log('')
  console.log('⚠️ 回滚说明:')
  console.log('  - 只有在迁移出现严重问题时才执行回滚')
  console.log('  - 回滚前请确保本地数据文件完整')
  console.log('  - 回滚后将恢复到本地数据加载模式')
  console.log('  - 建议先在测试环境验证回滚方案')
}

// 执行主函数
if (require.main === module) {
  main()
}

module.exports = {
  generateRollbackScript,
  generateFrontendRestoreGuide,
  generateCompleteRollbackPlan
}
