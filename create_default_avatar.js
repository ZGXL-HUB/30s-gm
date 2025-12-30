// 创建默认头像文件的脚本
// 在微信开发者工具控制台运行此脚本

console.log('🚀 开始创建默认头像文件...');

async function createDefaultAvatar() {
  try {
    // 方法1: 尝试从现有文件复制
    console.log('📝 尝试从现有头像文件复制...');
    
    try {
      const fs = wx.getFileSystemManager();
      
      // 读取现有的头像文件
      const avatarData = await new Promise((resolve, reject) => {
        fs.readFile({
          filePath: 'images/icons/avatar.webp',
          success: (res) => resolve(res.data),
          fail: reject
        });
      });
      
      // 写入到默认头像位置
      await new Promise((resolve, reject) => {
        fs.writeFile({
          filePath: 'images/default-avatar.png',
          data: avatarData,
          success: () => {
            console.log('✅ 默认头像文件创建成功');
            resolve();
          },
          fail: reject
        });
      });
      
    } catch (error) {
      console.log('⚠️ 从现有文件复制失败:', error.message);
      
      // 方法2: 创建一个简单的默认头像
      console.log('📝 创建简单的默认头像...');
      
      try {
        // 创建一个简单的base64编码的默认头像
        const defaultAvatarBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        
        // 这里我们只是创建一个占位符文件
        const fs = wx.getFileSystemManager();
        await new Promise((resolve, reject) => {
          fs.writeFile({
            filePath: 'images/default-avatar.png',
            data: new ArrayBuffer(1), // 创建一个最小的文件
            success: () => {
              console.log('✅ 默认头像占位符创建成功');
              resolve();
            },
            fail: reject
          });
        });
        
      } catch (error2) {
        console.log('❌ 创建默认头像失败:', error2.message);
      }
    }
    
    // 验证文件是否创建成功
    console.log('📝 验证文件创建结果...');
    
    try {
      const fs = wx.getFileSystemManager();
      await new Promise((resolve, reject) => {
        fs.access({
          filePath: 'images/default-avatar.png',
          success: () => {
            console.log('✅ 默认头像文件验证成功');
            resolve();
          },
          fail: () => {
            console.log('❌ 默认头像文件验证失败');
            reject();
          }
        });
      });
    } catch (error) {
      console.log('⚠️ 文件验证失败');
    }
    
    console.log('🎉 默认头像文件创建完成！');
    
  } catch (error) {
    console.error('❌ 创建默认头像文件失败:', error);
  }
}

// 运行创建
createDefaultAvatar();
