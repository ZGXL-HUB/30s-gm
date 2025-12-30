// 上传缺失的分类到云数据库
console.log('=== 上传缺失的"固定搭配"分类 ===\n');

// 从本地备份读取"固定搭配"的题目
const backupData = require('./backup/intermediate_questions_before_migration.js');

const gudingdapei = backupData["固定搭配"] || [];

console.log(`📚 "固定搭配"题目数: ${gudingdapei.length}`);

if (gudingdapei.length === 0) {
  console.log('❌ 本地备份中没有"固定搭配"分类');
} else {
  console.log('✅ 准备上传...\n');
  
  const uploadGudingdapei = async () => {
    let uploaded = 0;
    
    for (const question of gudingdapei) {
      try {
        await wx.cloud.database().collection('questions').add({
          data: {
            text: question.text,
            answer: question.answer,
            analysis: question.analysis || '',
            category: "固定搭配",  // 使用精确的分类名
            grammarPoint: question.tag || "固定搭配",
            type: 'fill_blank',
            difficulty: question.difficulty || 'medium',
            createdAt: new Date().toISOString()
          }
        });
        
        uploaded++;
        
        if (uploaded % 5 === 0) {
          console.log(`   已上传 ${uploaded}/${gudingdapei.length} 题`);
        }
        
      } catch (error) {
        console.error('上传失败:', error.message);
      }
    }
    
    console.log(`\n✅ 上传完成！成功 ${uploaded}/${gudingdapei.length} 题`);
    
    // 验证
    const verifyResult = await wx.cloud.database()
      .collection('questions')
      .where({ category: "固定搭配" })
      .count();
    
    console.log(`✅ 验证: 云数据库现有"固定搭配" ${verifyResult.total} 题`);
  };
  
  // 执行上传
  console.log('💡 请在控制台运行: uploadGudingdapei()');
  
  // 在小程序环境中自动暴露函数
  if (typeof window !== 'undefined') {
    window.uploadGudingdapei = uploadGudingdapei;
  }
}

