// 快速修复教师备份权限问题
// 在微信开发者工具控制台中运行此脚本

async function quickFixBackup() {
  console.log('🚀 快速修复教师备份权限问题...');
  
  try {
    const db = wx.cloud.database();
    
    // 创建 teacher_backups 集合
    console.log('📝 创建 teacher_backups 集合...');
    try {
      await db.collection('teacher_backups').limit(1).get();
      console.log('✅ teacher_backups 已存在');
    } catch (error) {
      if (error.errCode === -502005) {
        const result = await db.collection('teacher_backups').add({
          data: {
            _id: 'init_' + Date.now(),
            teacherId: 'init',
            dataType: 'init',
            data: {},
            backupTime: new Date().toISOString(),
            version: '1.0',
            isInit: true
          }
        });
        console.log('✅ teacher_backups 创建成功');
        
        // 清理初始化数据
        try {
          await db.collection('teacher_backups').doc(result._id).remove();
        } catch (e) {}
      }
    }
    
    // 创建 teacher_sync 集合
    console.log('📝 创建 teacher_sync 集合...');
    try {
      await db.collection('teacher_sync').limit(1).get();
      console.log('✅ teacher_sync 已存在');
    } catch (error) {
      if (error.errCode === -502005) {
        const result = await db.collection('teacher_sync').add({
          data: {
            _id: 'init_' + Date.now(),
            teacherId: 'init',
            syncData: {},
            syncTime: new Date().toISOString(),
            isInit: true
          }
        });
        console.log('✅ teacher_sync 创建成功');
        
        // 清理初始化数据
        try {
          await db.collection('teacher_sync').doc(result._id).remove();
        } catch (e) {}
      }
    }
    
    console.log('🎉 修复完成！请重新启动小程序测试备份功能。');
    
  } catch (error) {
    console.error('❌ 修复失败:', error);
    console.log('💡 请手动在云开发控制台创建集合: teacher_backups, teacher_sync');
  }
}

// 运行修复
quickFixBackup();
