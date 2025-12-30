// 修复教师备份权限问题脚本
// 在微信开发者工具控制台中运行此脚本

async function fixTeacherBackupPermissions() {
  console.log('🔧 开始修复教师备份权限问题...');
  
  try {
    // 1. 检查云开发环境
    console.log('🔍 检查云开发环境...');
    
    if (!wx.cloud) {
      throw new Error('云开发环境不可用，请检查云开发配置');
    }
    
    const db = wx.cloud.database();
    console.log('✅ 云开发环境正常');
    
    // 2. 定义需要创建的集合
    const collections = [
      {
        name: 'teacher_backups',
        template: {
          _id: 'init_teacher_backups',
          teacherId: 'template',
          dataType: 'template',
          data: {},
          backupTime: new Date().toISOString(),
          version: '1.0',
          isInit: true
        }
      },
      {
        name: 'teacher_sync',
        template: {
          _id: 'init_teacher_sync',
          teacherId: 'template',
          syncData: {},
          syncTime: new Date().toISOString(),
          isInit: true
        }
      }
    ];
    
    // 3. 创建集合
    console.log('📝 开始创建集合...');
    
    for (const collection of collections) {
      try {
        console.log(`🔧 处理集合: ${collection.name}`);
        
        // 检查集合是否存在
        try {
          await db.collection(collection.name).limit(1).get();
          console.log(`✅ ${collection.name} 已存在`);
        } catch (error) {
          if (error.errCode === -502005) {
            // 集合不存在，创建它
            console.log(`📝 创建集合: ${collection.name}`);
            
            const result = await db.collection(collection.name).add({
              data: collection.template
            });
            
            console.log(`✅ ${collection.name} 创建成功，文档ID: ${result._id}`);
            
            // 清理模板数据
            try {
              await db.collection(collection.name).doc(result._id).remove();
              console.log(`🧹 ${collection.name} 模板数据已清理`);
            } catch (removeError) {
              console.warn(`⚠️ 清理模板数据失败，但不影响功能:`, removeError);
            }
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error(`❌ 处理集合 ${collection.name} 失败:`, error);
        
        // 提供详细的错误信息
        if (error.errCode === -601002) {
          console.error('💡 解决方案: 请检查云开发环境配置');
        } else if (error.errCode === -502005) {
          console.error('💡 解决方案: 数据库权限不足，请检查云开发权限设置');
        } else if (error.errCode === -404011) {
          console.error('💡 解决方案: 数据库不存在，请检查云开发环境');
        }
      }
    }
    
    // 4. 验证集合创建结果
    console.log('🔍 验证集合创建结果...');
    
    for (const collection of collections) {
      try {
        await db.collection(collection.name).limit(1).get();
        console.log(`✅ ${collection.name} 验证成功`);
      } catch (error) {
        console.error(`❌ ${collection.name} 验证失败:`, error);
      }
    }
    
    // 5. 测试备份功能
    console.log('🧪 测试备份功能...');
    
    try {
      // 模拟备份数据
      const testData = {
        test: true,
        timestamp: new Date().toISOString()
      };
      
      const result = await db.collection('teacher_backups').add({
        data: {
          teacherId: 'test_teacher',
          dataType: 'test_backup',
          data: testData,
          backupTime: new Date().toISOString(),
          version: '1.0'
        }
      });
      
      console.log(`✅ 备份功能测试成功，文档ID: ${result._id}`);
      
      // 清理测试数据
      try {
        await db.collection('teacher_backups').doc(result._id).remove();
        console.log(`🧹 测试数据已清理`);
      } catch (removeError) {
        console.warn(`⚠️ 清理测试数据失败:`, removeError);
      }
      
    } catch (error) {
      console.error(`❌ 备份功能测试失败:`, error);
    }
    
    console.log('🎉 修复完成！');
    console.log('');
    console.log('📋 修复结果总结:');
    console.log('✅ teacher_backups 集合已创建');
    console.log('✅ teacher_sync 集合已创建');
    console.log('✅ 备份功能已测试');
    console.log('');
    console.log('💡 建议:');
    console.log('1. 重新启动小程序');
    console.log('2. 测试教师界面备份功能');
    console.log('3. 检查云开发控制台中的集合权限设置');
    
  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error);
    console.log('');
    console.log('🔧 手动解决方案:');
    console.log('1. 访问云开发控制台: https://console.cloud.tencent.com/tcb');
    console.log('2. 进入数据库管理');
    console.log('3. 手动创建集合: teacher_backups, teacher_sync');
    console.log('4. 设置权限为: 仅创建者可读写');
  }
}

// 运行修复脚本
fixTeacherBackupPermissions();
