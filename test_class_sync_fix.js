// 测试班级数据同步修复
// 验证班级ID在本地和云端是否一致

console.log('🔧 测试班级数据同步修复...');

// 检查现有班级数据
async function checkClassData() {
  console.log('🔍 检查现有班级数据...');
  
  try {
    const db = wx.cloud.database();
    
    // 查询云端班级数据
    const cloudResult = await db.collection('classes').get();
    console.log('📋 云端班级数据:', cloudResult.data);
    
    // 查询本地班级数据
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    console.log('📋 本地班级数据:', localClasses);
    
    // 比较ID是否一致
    if (cloudResult.data.length > 0 && localClasses.length > 0) {
      const cloudIds = cloudResult.data.map(c => c._id);
      const localIds = localClasses.map(c => c.id);
      
      console.log('🔍 云端班级ID:', cloudIds);
      console.log('🔍 本地班级ID:', localIds);
      
      const hasMatchingIds = cloudIds.some(id => localIds.includes(id));
      
      if (hasMatchingIds) {
        console.log('✅ 班级ID匹配，邀请码功能应该正常工作');
        
        // 测试邀请码生成
        const testClassId = localClasses[0].id;
        console.log('🧪 测试邀请码生成，班级ID:', testClassId);
        
        try {
          const inviteResult = await wx.cloud.callFunction({
            name: 'manageClassInvite',
            data: {
              action: 'generate',
              classId: testClassId,
              teacherId: teacherId,
              expireDays: 30,
              maxUses: -1
            }
          });
          
          console.log('✅ 邀请码生成测试结果:', inviteResult);
          
          if (inviteResult.result && inviteResult.result.success) {
            console.log('🎉 邀请码生成成功！邀请码:', inviteResult.result.data.inviteCode);
          } else {
            console.log('⚠️ 邀请码生成失败:', inviteResult.result.message);
          }
          
        } catch (error) {
          console.error('❌ 邀请码生成测试失败:', error);
        }
        
      } else {
        console.log('❌ 班级ID不匹配，需要重新同步数据');
        console.log('💡 建议：删除现有班级，重新创建');
      }
    } else {
      console.log('💡 没有班级数据，请先创建班级');
    }
    
  } catch (error) {
    console.error('❌ 检查班级数据失败:', error);
  }
}

// 运行检查
checkClassData();
