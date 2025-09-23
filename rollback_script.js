
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
    console.log(`已删除 ${deleteResult.stats.removed} 条记录`)
    
    // 2. 验证清空结果
    const verifyResult = await questionsCollection.count()
    console.log(`验证结果: 剩余 ${verifyResult.total} 条记录`)
    
    if (verifyResult.total === 0) {
      console.log('✅ 云数据库已成功清空')
    } else {
      console.log('⚠️ 云数据库未完全清空，请手动检查')
    }
    
    console.log('\n📋 回滚完成！')
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
    console.log('\n🎉 回滚成功！')
  } else {
    console.log('\n⚠️ 回滚失败，请检查错误信息')
  }
})
