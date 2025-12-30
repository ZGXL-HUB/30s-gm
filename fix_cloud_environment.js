// 云开发环境检查和修复脚本
// 在微信开发者工具控制台中运行此脚本

async function fixCloudEnvironment() {
  console.log('🔧 开始检查和修复云开发环境...');
  
  try {
    // 检查云开发环境
    console.log('📡 检查云开发环境...');
    const cloud = wx.cloud;
    if (!cloud) {
      throw new Error('云开发环境未初始化');
    }
    
    const db = cloud.database();
    console.log('✅ 云开发环境正常');
    
    // 检查云开发环境ID
    const config = require('./miniprogram/config/env.js');
    console.log('📋 当前云开发环境ID:', config.cloudEnvId);
    
    // 需要创建的集合列表
    const collections = [
      {
        name: 'teacher_backups',
        description: '教师备份数据集合',
        template: {
          teacherId: 'template',
          dataType: 'template',
          data: {},
          backupTime: new Date().toISOString(),
          version: '1.0'
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
          syncTime: new Date().toISOString()
        }
      }
    ];
    
    // 创建每个集合
    for (const collection of collections) {
      console.log(`🔨 正在创建集合: ${collection.name}`);
      
      try {
        // 尝试查询集合是否存在
        await db.collection(collection.name).limit(1).get();
        console.log(`✅ 集合 ${collection.name} 已存在`);
      } catch (error) {
        if (error.errCode === -502005) {
          // 集合不存在，创建它
          console.log(`📝 集合 ${collection.name} 不存在，正在创建...`);
          
          try {
            // 添加一个初始化文档来创建集合
            const result = await db.collection(collection.name).add({
              data: collection.template
            });
            
            console.log(`✅ 集合 ${collection.name} 创建成功，文档ID: ${result._id}`);
            
            // 删除初始化文档
            try {
              await db.collection(collection.name).doc(result._id).remove();
              console.log(`🗑️ 初始化文档已清理`);
            } catch (removeError) {
              console.warn(`⚠️ 清理初始化文档失败，但不影响功能:`, removeError);
            }
            
          } catch (createError) {
            console.error(`❌ 创建集合 ${collection.name} 失败:`, createError);
            
            if (createError.errCode === -404011) {
              console.error('❌ 数据库不存在，请检查云开发环境配置');
            } else if (createError.errCode === -601002) {
              console.error('❌ 云开发环境未初始化，请检查云开发配置');
            } else if (createError.errCode === -502005) {
              console.error('❌ 数据库权限不足，请检查云开发权限设置');
            }
          }
        } else {
          console.error(`❌ 检查集合 ${collection.name} 时出错:`, error);
        }
      }
    }
    
    // 测试云函数连接
    console.log('🧪 测试云函数连接...');
    try {
      await cloud.callFunction({
        name: 'helloCloud'
      });
      console.log('✅ 云函数连接正常');
    } catch (error) {
      console.warn('⚠️ 云函数连接失败，但不影响数据库功能:', error);
    }
    
    console.log('🎉 云开发环境检查和修复完成！');
    
    // 提供修复建议
    console.log('\n📋 修复建议:');
    console.log('1. 确保云开发环境ID正确配置');
    console.log('2. 检查云开发数据库权限设置');
    console.log('3. 确保云函数已正确部署');
    console.log('4. 如果仍有问题，请检查微信开发者工具的云开发控制台');
    
  } catch (error) {
    console.error('❌ 云开发环境检查失败:', error);
    console.log('\n🔧 故障排除步骤:');
    console.log('1. 检查微信开发者工具是否已登录');
    console.log('2. 检查云开发环境是否已开通');
    console.log('3. 检查云开发环境ID是否正确');
    console.log('4. 重新编译并运行小程序');
  }
}

// 运行修复脚本
fixCloudEnvironment();
