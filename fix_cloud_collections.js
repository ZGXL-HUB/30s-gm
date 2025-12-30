// 修复云数据库集合缺失问题
// 在微信开发者工具控制台中运行此脚本

async function fixCloudCollections() {
  console.log('🚀 开始修复云数据库集合缺失问题...');
  
  try {
    const db = wx.cloud.database();
    
    // 需要创建的集合列表
    const collections = [
      'classes',           // 班级数据
      'students',          // 学生数据
      'teacher_backups',   // 教师备份数据
      'teacher_sync',      // 教师同步数据
      'student_homeworks', // 学生作业数据
      'homework_assignments', // 作业分配数据
      'teacher_materials', // 教师材料数据
      'comprehensive_tests', // 综合测试数据
      'user_feedbacks'     // 用户反馈数据
    ];
    
    console.log('📝 检查并创建必要的数据库集合...');
    
    for (const collectionName of collections) {
      try {
        // 尝试查询集合，如果不存在会抛出错误
        await db.collection(collectionName).limit(1).get();
        console.log(`✅ ${collectionName} 集合已存在`);
      } catch (error) {
        if (error.errCode === -502005) {
          // 集合不存在，创建它
          console.log(`📝 创建 ${collectionName} 集合...`);
          try {
            const result = await db.collection(collectionName).add({
              data: {
                _id: 'init_' + Date.now(),
                createTime: new Date().toISOString(),
                isInit: true,
                collectionType: collectionName
              }
            });
            console.log(`✅ ${collectionName} 集合创建成功，文档ID: ${result._id}`);
            
            // 清理初始化文档
            try {
              await db.collection(collectionName).doc(result._id).remove();
              console.log(`🧹 ${collectionName} 初始化文档已清理`);
            } catch (removeError) {
              console.warn(`⚠️ 清理 ${collectionName} 初始化文档失败，但不影响功能:`, removeError);
            }
          } catch (createError) {
            console.error(`❌ 创建 ${collectionName} 集合失败:`, createError);
          }
        } else {
          console.error(`❌ 检查 ${collectionName} 集合时发生错误:`, error);
        }
      }
    }
    
    console.log('🎉 云数据库集合修复完成！');
    console.log('💡 现在可以正常使用班级数据上传功能了。');
    
    // 验证修复结果
    console.log('🔍 验证修复结果...');
    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).limit(1).get();
        console.log(`✅ ${collectionName} 验证通过`);
      } catch (error) {
        console.warn(`⚠️ ${collectionName} 验证失败:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
    console.log('💡 请检查云开发环境配置是否正确');
    console.log('💡 确保已正确初始化云开发环境');
  }
}

// 运行修复
fixCloudCollections();