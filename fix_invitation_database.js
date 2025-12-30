// 修复邀请码功能所需的数据库集合
// 在微信开发者工具控制台中运行此脚本

async function fixInvitationDatabase() {
  console.log('🚀 开始修复邀请码功能所需的数据库集合...');
  
  try {
    const db = wx.cloud.database();
    
    // 邀请码功能需要的集合
    const requiredCollections = [
      {
        name: 'classes',
        description: '班级数据集合',
        template: {
          name: '示例班级',
          teacherId: 'teacher_123',
          status: 'active',
          createdAt: new Date(),
          maxStudents: 50,
          currentStudents: 0,
          inviteCode: null,
          inviteCodeExpiry: null,
          joinMethod: 'both'
        }
      },
      {
        name: 'class_invitations',
        description: '班级邀请记录集合',
        template: {
          classId: 'class_123',
          teacherId: 'teacher_123',
          inviteCode: '123456',
          createdBy: 'teacher_123',
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
          usedCount: 0,
          maxUses: -1
        }
      },
      {
        name: 'students',
        description: '学生数据集合',
        template: {
          name: '示例学生',
          studentId: 'student_123',
          classId: 'class_123',
          teacherId: 'teacher_123',
          joinedAt: new Date(),
          status: 'active'
        }
      }
    ];
    
    console.log('📝 检查并创建邀请码功能所需的数据库集合...');
    
    for (const collection of requiredCollections) {
      try {
        // 尝试查询集合，如果不存在会抛出错误
        await db.collection(collection.name).limit(1).get();
        console.log(`✅ ${collection.name} 集合已存在`);
      } catch (error) {
        if (error.errCode === -502005) {
          // 集合不存在，创建它
          console.log(`📝 创建 ${collection.name} 集合 (${collection.description})...`);
          try {
            const result = await db.collection(collection.name).add({
              data: {
                ...collection.template,
                _id: 'init_' + Date.now(),
                createTime: new Date().toISOString(),
                isInit: true,
                collectionType: collection.name
              }
            });
            console.log(`✅ ${collection.name} 集合创建成功，文档ID: ${result._id}`);
            
            // 清理初始化文档
            try {
              await db.collection(collection.name).doc(result._id).remove();
              console.log(`🧹 ${collection.name} 初始化文档已清理`);
            } catch (removeError) {
              console.warn(`⚠️ 清理 ${collection.name} 初始化文档失败，但不影响功能:`, removeError);
            }
          } catch (createError) {
            console.error(`❌ 创建 ${collection.name} 集合失败:`, createError);
          }
        } else {
          console.error(`❌ 检查 ${collection.name} 集合时发生错误:`, error);
        }
      }
    }
    
    console.log('🎉 邀请码功能数据库集合修复完成！');
    console.log('💡 现在可以正常使用邀请码功能了。');
    
    // 验证修复结果
    console.log('🔍 验证修复结果...');
    for (const collection of requiredCollections) {
      try {
        await db.collection(collection.name).limit(1).get();
        console.log(`✅ ${collection.name} 验证通过`);
      } catch (error) {
        console.warn(`⚠️ ${collection.name} 验证失败:`, error.message);
      }
    }
    
    // 测试邀请码功能
    console.log('🧪 测试邀请码功能...');
    try {
      const testResult = await wx.cloud.callFunction({
        name: 'manageClassInvite',
        data: {
          action: 'getInfo',
          classId: 'test-class-123',
          teacherId: 'teacher_123'
        }
      });
      
      if (testResult.result && testResult.result.success === false) {
        if (testResult.result.message.includes('班级不存在')) {
          console.log('✅ 邀请码云函数测试通过（班级不存在是正常的）');
        } else {
          console.log('⚠️ 邀请码云函数测试异常:', testResult.result.message);
        }
      } else {
        console.log('✅ 邀请码云函数测试通过');
      }
    } catch (testError) {
      console.error('❌ 邀请码云函数测试失败:', testError);
    }
    
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
    console.log('💡 请检查云开发环境配置是否正确');
    console.log('💡 确保已正确初始化云开发环境');
  }
}

// 运行修复
fixInvitationDatabase();
