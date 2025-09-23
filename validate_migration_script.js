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
    console.log(`✅ 数据库连接正常，共 ${count.total} 条记录`)
    
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
        console.log(`   支持的分类: ${categories.length} 个`)
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
        console.log(`   生成题目数量: ${comboResult.result.data.length}`)
        
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
        console.log(`   介词综合题目数量: ${categoryResult.result.data.length}`)
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
    console.log('\n🎯 迁移验证成功！可以安全删除本地数据文件。')
  } else {
    console.log('\n⚠️ 迁移验证失败，请检查云函数和数据。')
  }
})
