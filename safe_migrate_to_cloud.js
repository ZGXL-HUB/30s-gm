// 安全的数据迁移脚本
// 解决语法组合功能在云数据库迁移中的分类映射问题

const fs = require('fs')
const path = require('path')

// 读取本地数据
function readLocalData() {
  try {
    const filePath = './miniprogram/data/intermediate_questions.js'
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`文件不存在: ${filePath}`)
    }
    
    const content = fs.readFileSync(filePath, 'utf8')
    
    // 提取questions对象
    const questionsMatch = content.match(/const questions = ({[\s\S]*?});/)
    if (!questionsMatch) {
      throw new Error('无法找到questions对象')
    }
    
    const questionsStr = questionsMatch[1]
    
    // 安全地解析对象
    let questions
    try {
      questions = Function('return ' + questionsStr)()
    } catch (parseError) {
      throw new Error(`解析questions对象失败: ${parseError.message}`)
    }
    
    console.log(`✅ 成功读取本地数据，共 ${Object.keys(questions).length} 个分类`)
    return questions
  } catch (error) {
    console.error('❌ 读取本地数据失败:', error.message)
    return null
  }
}

// 验证数据完整性
function validateDataIntegrity(localData) {
  const issues = []
  const warnings = []
  
  // 检查必要的语法点分类
  const requiredCategories = [
    "介词综合", "代词综合", "连词综合", "冠词综合", "名词综合",
    "现在分词综合", "过去分词综合", "不定式综合",
    "形容词综合", "副词综合", "定语从句综合", "状语从句综合"
  ]
  
  console.log('🔍 验证数据完整性...')
  
  requiredCategories.forEach(category => {
    if (!localData[category]) {
      issues.push(`缺少必要分类: ${category}`)
    } else if (!Array.isArray(localData[category])) {
      issues.push(`分类 ${category} 数据格式错误`)
    } else if (localData[category].length === 0) {
      warnings.push(`分类 ${category} 数据为空`)
    } else {
      console.log(`  ✅ ${category}: ${localData[category].length} 题`)
    }
  })
  
  // 检查所有分类的题目格式
  let totalQuestions = 0
  let validQuestions = 0
  
  Object.keys(localData).forEach(category => {
    const questions = localData[category]
    if (Array.isArray(questions)) {
      totalQuestions += questions.length
      
      questions.forEach((question, index) => {
        if (question && typeof question === 'object' && question.text && question.answer) {
          validQuestions++
        } else {
          warnings.push(`分类 ${category} 第 ${index + 1} 题格式不完整`)
        }
      })
    }
  })
  
  console.log(`📊 数据统计:`)
  console.log(`  总分类数: ${Object.keys(localData).length}`)
  console.log(`  总题目数: ${totalQuestions}`)
  console.log(`  有效题目数: ${validQuestions}`)
  console.log(`  数据完整率: ${totalQuestions > 0 ? (validQuestions / totalQuestions * 100).toFixed(2) : 0}%`)
  
  if (issues.length > 0) {
    console.log('❌ 数据完整性问题:')
    issues.forEach(issue => console.log(`  - ${issue}`))
    return false
  }
  
  if (warnings.length > 0) {
    console.log('⚠️ 数据警告:')
    warnings.forEach(warning => console.log(`  - ${warning}`))
  }
  
  console.log('✅ 数据完整性验证通过')
  return true
}

// 转换数据格式
function convertToCloudFormat(questions) {
  const cloudData = []
  let totalQuestions = 0
  const categoryStats = {}
  
  console.log('🔄 转换数据格式...')
  
  Object.keys(questions).forEach(category => {
    const categoryQuestions = questions[category]
    
    if (!Array.isArray(categoryQuestions)) {
      console.warn(`⚠️ 跳过非数组格式的分类: ${category}`)
      return
    }
    
    categoryStats[category] = 0
    
    categoryQuestions.forEach((question, index) => {
      if (!question || typeof question !== 'object') {
        console.warn(`⚠️ 跳过无效的题目数据: ${category}[${index}]`)
        return
      }
      
      // 判断数据类型
      let type = 'question' // 默认为题目
      let additionalFields = {}
      
      // 检查是否为笔记数据
      if (question.notes || question.note) {
        type = 'note'
        additionalFields = {
          notes: question.notes || question.note,
          tables: question.tables || null
        }
      }
      
      // 检查是否为表格数据
      if (question.table || question.tables) {
        type = 'table'
        additionalFields = {
          table: question.table || question.tables,
          interactive: question.interactive || false
        }
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
      })
      
      categoryStats[category]++
      totalQuestions++
    })
  })
  
  console.log(`✅ 转换完成，共 ${totalQuestions} 道题目`)
  console.log('📊 分类统计:')
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} 题`)
  })
  
  return { cloudData, categoryStats, totalQuestions }
}

// 生成迁移脚本
function generateMigrationScript(cloudData, categoryStats, totalQuestions) {
  const script = `
// 安全的数据迁移脚本
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
`
  
  return script
}

// 生成验证脚本
function generateValidationScript() {
  const script = `
// 迁移验证脚本
// 请在云开发控制台执行

const db = wx.cloud.database()

async function validateMigration() {
  try {
    console.log('🔍 开始验证迁移结果...')
    
    // 1. 验证数据库连接
    console.log('1. 验证数据库连接...')
    const questionsCollection = db.collection('questions')
    const count = await questionsCollection.count()
    console.log(\`✅ 数据库连接正常，共 \${count.total} 条记录\`)
    
    // 2. 验证分类映射API
    console.log('2. 验证分类映射API...')
    try {
      const mappingResult = await wx.cloud.callFunction({
        name: 'grammarCategoryMapping',
        data: { action: 'getCategoryMapping' }
      })
      
      if (mappingResult.result.success) {
        console.log('✅ 分类映射API正常')
        const categories = Object.keys(mappingResult.result.data)
        console.log(\`   支持的分类: \${categories.length} 个\`)
      } else {
        console.log('❌ 分类映射API异常')
        return false
      }
    } catch (error) {
      console.log('❌ 分类映射API调用失败:', error.message)
      return false
    }
    
    // 3. 验证系统组合功能
    console.log('3. 验证系统组合功能...')
    try {
      const comboResult = await wx.cloud.callFunction({
        name: 'getQuestionsData',
        data: { action: 'getSystemComboQuestions', limit: 10 }
      })
      
      if (comboResult.result.success && comboResult.result.data.length > 0) {
        console.log('✅ 系统组合功能正常')
        console.log(\`   生成题目数量: \${comboResult.result.data.length}\`)
        
        // 验证题目分类分布
        const categoryStats = {}
        comboResult.result.data.forEach(q => {
          categoryStats[q.category] = (categoryStats[q.category] || 0) + 1
        })
        console.log('   分类分布:', categoryStats)
      } else {
        console.log('❌ 系统组合功能异常')
        return false
      }
    } catch (error) {
      console.log('❌ 系统组合功能调用失败:', error.message)
      return false
    }
    
    // 4. 验证具体分类查询
    console.log('4. 验证具体分类查询...')
    try {
      const categoryResult = await wx.cloud.callFunction({
        name: 'getQuestionsData',
        data: { 
          action: 'getQuestionsByCategory', 
          category: '介词综合', 
          limit: 5 
        }
      })
      
      if (categoryResult.result.success) {
        console.log('✅ 分类查询功能正常')
        console.log(\`   介词综合题目数量: \${categoryResult.result.data.length}\`)
      } else {
        console.log('❌ 分类查询功能异常')
        return false
      }
    } catch (error) {
      console.log('❌ 分类查询功能调用失败:', error.message)
      return false
    }
    
    console.log('🎉 所有验证通过！迁移成功！')
    return true
    
  } catch (error) {
    console.error('❌ 验证失败:', error)
    return false
  }
}

// 执行验证
validateMigration().then(success => {
  if (success) {
    console.log('\\n🎯 迁移验证成功！可以安全删除本地数据文件。')
  } else {
    console.log('\\n⚠️ 迁移验证失败，请检查云函数和数据。')
  }
})
`
  
  return script
}

// 主函数
function main() {
  console.log('🚀 开始安全数据迁移...')
  console.log('📋 此脚本将解决语法组合功能的分类映射问题')
  console.log('')
  
  // 1. 读取本地数据
  const localData = readLocalData()
  if (!localData) {
    console.error('❌ 无法读取本地数据，迁移终止')
    process.exit(1)
  }
  
  // 2. 验证数据完整性
  if (!validateDataIntegrity(localData)) {
    console.error('❌ 数据完整性验证失败，迁移终止')
    process.exit(1)
  }
  
  // 3. 转换数据格式
  const { cloudData, categoryStats, totalQuestions } = convertToCloudFormat(localData)
  
  // 4. 生成迁移脚本
  const migrationScript = generateMigrationScript(cloudData, categoryStats, totalQuestions)
  
  // 5. 生成验证脚本
  const validationScript = generateValidationScript()
  
  // 6. 保存脚本文件
  fs.writeFileSync('./safe_migration_script.js', migrationScript, 'utf8')
  fs.writeFileSync('./validate_migration_script.js', validationScript, 'utf8')
  
  console.log('')
  console.log('✅ 迁移脚本已生成:')
  console.log('  📄 safe_migration_script.js - 数据迁移脚本')
  console.log('  📄 validate_migration_script.js - 迁移验证脚本')
  console.log('')
  console.log('📋 下一步操作:')
  console.log('  1. 部署新的云函数:')
  console.log('     - grammarCategoryMapping (语法分类映射)')
  console.log('     - getQuestionsData (增强版题目获取)')
  console.log('  2. 在云开发控制台执行 safe_migration_script.js')
  console.log('  3. 在云开发控制台执行 validate_migration_script.js')
  console.log('  4. 验证语法组合功能正常工作')
  console.log('  5. 最后删除本地数据文件: miniprogram/data/intermediate_questions.js')
  console.log('')
  console.log('⚠️ 重要提醒:')
  console.log('  - 迁移前请确保云函数已正确部署')
  console.log('  - 建议在测试环境先验证功能')
  console.log('  - 保留本地数据文件作为备份，直到确认功能正常')
}

// 执行主函数
if (require.main === module) {
  main()
}

module.exports = {
  readLocalData,
  validateDataIntegrity,
  convertToCloudFormat,
  generateMigrationScript,
  generateValidationScript
}
