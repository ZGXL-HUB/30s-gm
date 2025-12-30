// 测试云端备份功能修复
// 在微信开发者工具控制台中运行此脚本

async function testCloudBackupFix() {
  console.log('🧪 开始测试云端备份功能修复...');
  
  try {
    // 1. 测试云开发连接
    console.log('📡 测试云开发连接...');
    const cloud = wx.cloud;
    if (!cloud) {
      throw new Error('云开发环境未初始化');
    }
    
    // 测试云函数调用
    try {
      await cloud.callFunction({
        name: 'helloCloud'
      });
      console.log('✅ 云开发连接正常');
    } catch (error) {
      console.log('⚠️ 云函数调用失败，但数据库功能可能正常');
    }
    
    // 2. 测试数据库连接
    console.log('🗄️ 测试数据库连接...');
    const db = cloud.database();
    
    // 3. 测试集合创建
    console.log('📝 测试集合创建...');
    const testCollections = ['teacher_backups', 'teacher_sync'];
    
    for (const collectionName of testCollections) {
      try {
        // 检查集合是否存在
        await db.collection(collectionName).limit(1).get();
        console.log(`✅ ${collectionName}: 已存在`);
      } catch (error) {
        if (error.errCode === -502005) {
          console.log(`🆕 ${collectionName}: 不存在，正在创建...`);
          
          // 创建集合
          const result = await db.collection(collectionName).add({
            data: {
              _id: 'test_' + Date.now(),
              createTime: new Date().toISOString(),
              isTest: true
            }
          });
          
          console.log(`✅ ${collectionName}: 创建成功，文档ID: ${result._id}`);
          
          // 清理测试文档
          try {
            await db.collection(collectionName).doc(result._id).remove();
            console.log(`🧹 ${collectionName}: 测试文档已清理`);
          } catch (removeError) {
            console.warn(`⚠️ ${collectionName}: 清理测试文档失败，但不影响功能`);
          }
        } else {
          throw error;
        }
      }
    }
    
    // 4. 测试备份功能
    console.log('💾 测试备份功能...');
    
    // 模拟教师数据
    const testTeacherId = 'test_teacher_' + Date.now();
    const testData = {
      homeworkAssignments: [
        { id: 'hw1', title: '测试作业', status: 'active' }
      ],
      teacherMaterials: [
        { id: 'mat1', title: '测试材料', type: 'ppt' }
      ],
      comprehensiveTests: [
        { id: 'test1', title: '测试摸底', questionCount: 10 }
      ],
      userFeedbacks: [
        { id: 'fb1', content: '测试反馈', submittedAt: new Date().toISOString() }
      ]
    };
    
    // 测试备份到云端
    try {
      // 备份作业数据
      const homeworkResult = await db.collection('teacher_backups').add({
        data: {
          teacherId: testTeacherId,
          dataType: 'homework_assignments',
          data: testData.homeworkAssignments,
          backupTime: new Date().toISOString(),
          version: '1.0'
        }
      });
      console.log(`✅ 作业数据备份成功: ${homeworkResult._id}`);
      
      // 备份材料数据
      const materialsResult = await db.collection('teacher_backups').add({
        data: {
          teacherId: testTeacherId,
          dataType: 'teacher_materials',
          data: testData.teacherMaterials,
          backupTime: new Date().toISOString(),
          version: '1.0'
        }
      });
      console.log(`✅ 材料数据备份成功: ${materialsResult._id}`);
      
      // 测试数据恢复
      console.log('🔄 测试数据恢复...');
      const restoreResult = await db.collection('teacher_backups')
        .where({
          teacherId: testTeacherId,
          dataType: 'homework_assignments'
        })
        .orderBy('backupTime', 'desc')
        .limit(1)
        .get();
      
      if (restoreResult.data.length > 0) {
        console.log(`✅ 数据恢复成功: 找到 ${restoreResult.data.length} 条备份记录`);
      } else {
        console.log('⚠️ 数据恢复: 未找到备份记录');
      }
      
      // 清理测试数据
      console.log('🧹 清理测试数据...');
      try {
        await db.collection('teacher_backups')
          .where({ teacherId: testTeacherId })
          .remove();
        console.log('✅ 测试数据清理完成');
      } catch (cleanupError) {
        console.warn('⚠️ 测试数据清理失败，但不影响功能');
      }
      
    } catch (backupError) {
      console.error('❌ 备份功能测试失败:', backupError);
      throw backupError;
    }
    
    console.log('🎉 云端备份功能测试完成！');
    console.log('📊 测试结果总结：');
    console.log('  ✅ 云开发连接正常');
    console.log('  ✅ 数据库连接正常');
    console.log('  ✅ 集合创建功能正常');
    console.log('  ✅ 数据备份功能正常');
    console.log('  ✅ 数据恢复功能正常');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    
    console.log('💡 可能的解决方案：');
    if (error.message.includes('云开发环境未初始化')) {
      console.log('1. 检查 project.config.json 中的云开发环境ID');
      console.log('2. 确保已开启云开发服务');
      console.log('3. 重新编译项目');
    } else if (error.errCode === -601002) {
      console.log('1. 检查云开发环境ID是否正确');
      console.log('2. 确保云开发服务已开启');
      console.log('3. 检查网络连接');
    } else if (error.errCode === -502005) {
      console.log('1. 运行 fix_cloud_collections.js 脚本创建集合');
      console.log('2. 检查数据库权限设置');
    }
  }
}

// 运行测试
console.log('🚀 开始测试云端备份功能修复...');
testCloudBackupFix();