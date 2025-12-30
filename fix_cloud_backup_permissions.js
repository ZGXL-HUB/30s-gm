/**
 * 云开发备份权限修复脚本
 * 解决 teacher_backups 集合创建失败的问题
 */

// 在微信开发者工具控制台中运行此脚本

console.log('🚀 开始修复云开发备份权限问题...');

async function fixCloudBackupPermissions() {
  try {
    // 1. 检查云开发环境是否可用
    console.log('📋 检查云开发环境...');
    
    if (!wx.cloud) {
      console.error('❌ 云开发环境不可用，请检查基础库版本');
      return;
    }
    
    // 2. 检查当前环境ID
    const envId = wx.cloud.env;
    console.log(`🌐 当前云环境ID: ${envId}`);
    
    // 3. 创建必要的数据库集合
    console.log('📝 创建教师备份相关集合...');
    
    const collections = [
      {
        name: 'teacher_backups',
        description: '教师数据备份集合',
        template: {
          teacherId: 'template',
          dataType: 'template',
          data: {},
          backupTime: new Date().toISOString(),
          version: '1.0',
          createTime: new Date().toISOString()
        }
      },
      {
        name: 'teacher_sync',
        description: '教师数据同步集合',
        template: {
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
      }
    ];
    
    for (const collection of collections) {
      try {
        console.log(`🔧 处理集合: ${collection.name}`);
        
        // 检查集合是否存在
        try {
          await wx.cloud.database().collection(collection.name).limit(1).get();
          console.log(`✅ ${collection.name} 已存在`);
        } catch (error) {
          if (error.errCode === -502005) {
            // 集合不存在，创建它
            console.log(`📝 创建集合: ${collection.name}`);
            
            const result = await wx.cloud.database().collection(collection.name).add({
              data: collection.template
            });
            
            console.log(`✅ ${collection.name} 创建成功，文档ID: ${result._id}`);
            
            // 清理模板数据
            try {
              await wx.cloud.database().collection(collection.name).doc(result._id).remove();
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
        const result = await wx.cloud.database().collection(collection.name).limit(1).get();
        console.log(`✅ ${collection.name}: 存在 (${result.data.length} 条记录)`);
      } catch (error) {
        console.log(`❌ ${collection.name}: 不存在或无法访问`);
      }
    }
    
    // 5. 测试备份功能
    console.log('🧪 测试备份功能...');
    
    try {
      const testData = {
        teacherId: 'test_teacher',
        dataType: 'test',
        data: { test: true },
        backupTime: new Date().toISOString()
      };
      
      const result = await wx.cloud.database().collection('teacher_backups').add({
        data: testData
      });
      
      console.log('✅ 备份功能测试成功');
      
      // 清理测试数据
      await wx.cloud.database().collection('teacher_backups').doc(result._id).remove();
      console.log('🧹 测试数据已清理');
      
    } catch (error) {
      console.error('❌ 备份功能测试失败:', error);
    }
    
    console.log('🎉 云开发备份权限修复完成！');
    
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
  }
}

// 运行修复脚本
fixCloudBackupPermissions();

// 提供手动解决方案
console.log(`
📋 如果自动修复失败，请尝试以下手动解决方案：

1. 云开发控制台手动创建集合：
   - 访问: https://console.cloud.tencent.com/tcb
   - 选择环境: ${wx.cloud?.env || '请检查环境ID'}
   - 进入数据库 → 新建集合
   - 创建集合: teacher_backups, teacher_sync
   - 设置权限: 仅创建者可读写

2. 检查云开发权限：
   - 确认小程序有该环境的访问权限
   - 检查云开发环境状态是否正常
   - 验证网络连接是否稳定

3. 重新部署云函数：
   - 右键 cloudfunctions/helloCloud → 上传并部署
   - 等待部署完成后再测试

4. 联系技术支持：
   - 保存完整的错误信息
   - 截图显示错误详情
   - 提供环境ID和AppID信息
`);
