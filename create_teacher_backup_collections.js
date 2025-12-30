// 创建教师备份相关集合的脚本
// 在微信开发者工具控制台中运行此脚本

async function createTeacherBackupCollections() {
  console.log('🚀 开始创建教师备份相关集合...');
  
  try {
    // 1. 创建教师备份集合
    console.log('📝 创建教师备份集合...');
    await wx.cloud.database().collection('teacher_backups').add({
      data: {
        _id: 'template_backup',
        teacherId: 'template',
        dataType: 'template',
        data: {},
        backupTime: new Date().toISOString(),
        version: '1.0',
        createTime: new Date().toISOString()
      }
    });
    console.log('✅ 教师备份集合创建成功');
    
    // 2. 创建教师同步集合
    console.log('🔄 创建教师同步集合...');
    await wx.cloud.database().collection('teacher_sync').add({
      data: {
        _id: 'template_sync',
        teacherId: 'template',
        syncData: {
          homeworkAssignments: [],
          teacherMaterials: [],
          comprehensiveTests: [],
          userFeedbacks: [],
          lastSyncTime: new Date().toISOString()
        },
        syncTime: new Date().toISOString(),
        createTime: new Date().toISOString()
      }
    });
    console.log('✅ 教师同步集合创建成功');
    
    // 清理模板数据
    console.log('🧹 清理模板数据...');
    await wx.cloud.database().collection('teacher_backups').doc('template_backup').remove();
    await wx.cloud.database().collection('teacher_sync').doc('template_sync').remove();
    console.log('✅ 模板数据清理完成');
    
    console.log('🎉 教师备份相关集合创建完成！');
    console.log('📋 已创建的集合：');
    console.log('  - teacher_backups (教师备份数据)');
    console.log('  - teacher_sync (教师数据同步)');
    
  } catch (error) {
    console.error('❌ 创建集合失败:', error);
    
    if (error.errCode === -601002) {
      console.log('💡 解决方案：');
      console.log('1. 检查云开发环境ID是否正确');
      console.log('2. 确保已开启云开发服务');
      console.log('3. 检查网络连接');
    }
  }
}

// 检查现有集合
async function checkTeacherBackupCollections() {
  console.log('🔍 检查教师备份相关集合...');
  
  const collections = [
    'teacher_backups',
    'teacher_sync'
  ];
  
  for (const collectionName of collections) {
    try {
      const result = await wx.cloud.database().collection(collectionName).limit(1).get();
      console.log(`✅ ${collectionName}: 存在 (${result.data.length} 条数据)`);
    } catch (error) {
      console.log(`❌ ${collectionName}: 不存在`);
    }
  }
}

// 运行检查
checkTeacherBackupCollections();

// 如果需要创建集合，请取消注释下面的行
// createTeacherBackupCollections();
