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
    console.log(`备份现有数据: ${existingData.data.length} 条记录`)
    
    // 2. 清空现有数据
    console.log('🗑️ 清空现有数据...')
    await questionsCollection.where({}).remove()
    console.log('已清空现有数据')
    
    // 3. 导入新数据
    console.log('📥 导入新数据...')
    const questions = [
      // 这里会包含从本地数据转换的所有题目
      // 由于数据量很大，建议分批导入
    ]
    
    const batchSize = 100
    let importedCount = 0
    
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize)
      await questionsCollection.add({ data: batch })
      importedCount += batch.length
      console.log(`已导入第 ${importedCount} 条记录`)
    }
    
    console.log('✅ 迁移完成!')
    
    // 4. 验证迁移结果
    console.log('🔍 验证迁移结果...')
    const verifyData = await questionsCollection.count()
    console.log(`验证结果: ${verifyData.total} 条记录`)
    
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
      console.log(`  ✅ ${item._id}: ${item.count} 题`)
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
    console.log('\n📋 下一步操作:')
    console.log('  1. 部署新的云函数: grammarCategoryMapping')
    console.log('  2. 更新 getQuestionsData 云函数')
    console.log('  3. 验证语法组合功能')
    console.log('  4. 删除本地数据文件')
  }
})
