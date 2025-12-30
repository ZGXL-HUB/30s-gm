// 测试头像文件和云函数的脚本
// 在微信开发者工具控制台运行此脚本

console.log('🚀 开始测试头像文件和云函数...');

async function testAvatarAndCloudFunctions() {
  try {
    // 1. 测试头像文件访问
    console.log('📝 测试头像文件访问...');
    
    // 方法1: 使用相对路径测试
    try {
      const fs = wx.getFileSystemManager();
      await new Promise((resolve, reject) => {
        fs.access({
          filePath: 'images/default-avatar.png',
          success: () => {
            console.log('✅ 头像文件存在 (相对路径)');
            resolve();
          },
          fail: () => {
            console.log('❌ 头像文件不存在 (相对路径)');
            reject();
          }
        });
      });
    } catch (error) {
      console.log('⚠️ 相对路径访问失败');
    }
    
    // 方法2: 使用绝对路径测试
    try {
      const fs2 = wx.getFileSystemManager();
      await new Promise((resolve, reject) => {
        fs2.access({
          filePath: '/images/default-avatar.png',
          success: () => {
            console.log('✅ 头像文件存在 (绝对路径)');
            resolve();
          },
          fail: () => {
            console.log('❌ 头像文件不存在 (绝对路径)');
            reject();
          }
        });
      });
    } catch (error) {
      console.log('⚠️ 绝对路径访问失败');
    }
    
    // 2. 测试云函数调用
    console.log('📝 测试云函数调用...');
    
    // 测试 studentJoinClass 云函数
    try {
      const result1 = await wx.cloud.callFunction({
        name: 'studentJoinClass',
        data: { 
          action: 'test',
          inviteCode: 'test123',
          studentInfo: { name: '测试学生', openId: 'test_openid' }
        }
      });
      console.log('✅ studentJoinClass 云函数调用成功:', result1.result);
    } catch (error) {
      console.log('❌ studentJoinClass 云函数调用失败:', error.message);
    }
    
    // 测试 manageClassInvite 云函数
    try {
      const result2 = await wx.cloud.callFunction({
        name: 'manageClassInvite',
        data: { 
          action: 'test',
          classId: 'test_class_id',
          teacherId: 'test_teacher_id'
        }
      });
      console.log('✅ manageClassInvite 云函数调用成功:', result2.result);
    } catch (error) {
      console.log('❌ manageClassInvite 云函数调用失败:', error.message);
    }
    
    console.log('🎉 测试完成！');
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  }
}

// 运行测试
testAvatarAndCloudFunctions();
