// 测试教师备份功能修复
// 在微信开发者工具控制台中运行此脚本

async function testBackupFix() {
  console.log('🧪 测试教师备份功能修复...');
  
  try {
    const db = wx.cloud.database();
    
    // 1. 检查集合是否存在
    console.log('🔍 检查集合状态...');
    
    try {
      await db.collection('teacher_backups').limit(1).get();
      console.log('✅ teacher_backups 集合存在');
    } catch (error) {
      if (error.errCode === -502005) {
        console.log('❌ teacher_backups 集合不存在');
        return false;
      }
    }
    
    try {
      await db.collection('teacher_sync').limit(1).get();
      console.log('✅ teacher_sync 集合存在');
    } catch (error) {
      if (error.errCode === -502005) {
        console.log('❌ teacher_sync 集合不存在');
        return false;
      }
    }
    
    // 2. 测试备份功能
    console.log('📝 测试备份功能...');
    
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      teacherId: 'test_teacher_123'
    };
    
    // 测试 teacher_backups 集合
    try {
      const backupResult = await db.collection('teacher_backups').add({
        data: {
          teacherId: 'test_teacher_123',
          dataType: 'test_backup',
          data: testData,
          backupTime: new Date().toISOString(),
          version: '1.0'
        }
      });
      console.log('✅ teacher_backups 备份测试成功，文档ID:', backupResult._id);
      
      // 清理测试数据
      try {
        await db.collection('teacher_backups').doc(backupResult._id).remove();
        console.log('🧹 测试数据已清理');
      } catch (removeError) {
        console.warn('⚠️ 清理测试数据失败:', removeError);
      }
      
    } catch (error) {
      console.error('❌ teacher_backups 备份测试失败:', error);
      return false;
    }
    
    // 测试 teacher_sync 集合
    try {
      const syncResult = await db.collection('teacher_sync').add({
        data: {
          teacherId: 'test_teacher_123',
          syncData: testData,
          syncTime: new Date().toISOString()
        }
      });
      console.log('✅ teacher_sync 同步测试成功，文档ID:', syncResult._id);
      
      // 清理测试数据
      try {
        await db.collection('teacher_sync').doc(syncResult._id).remove();
        console.log('🧹 测试数据已清理');
      } catch (removeError) {
        console.warn('⚠️ 清理测试数据失败:', removeError);
      }
      
    } catch (error) {
      console.error('❌ teacher_sync 同步测试失败:', error);
      return false;
    }
    
    console.log('🎉 所有测试通过！备份功能已修复。');
    console.log('');
    console.log('📋 测试结果:');
    console.log('✅ teacher_backups 集合正常');
    console.log('✅ teacher_sync 集合正常');
    console.log('✅ 备份功能正常');
    console.log('✅ 同步功能正常');
    console.log('');
    console.log('💡 建议:');
    console.log('1. 重新启动小程序');
    console.log('2. 测试教师界面的实际备份功能');
    console.log('3. 检查备份数据是否正确保存');
    
    return true;
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
    console.log('');
    console.log('🔧 如果测试失败，请运行:');
    console.log('1. quick_fix_backup.js - 快速修复脚本');
    console.log('2. fix_teacher_backup_permissions.js - 完整修复脚本');
    return false;
  }
}

// 运行测试
testBackupFix();
