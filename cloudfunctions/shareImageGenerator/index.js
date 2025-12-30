const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { inviteCode, className, expiryDate, pagePath } = event;
  
  try {
    let qrCodeUrl = null;
    
    // 尝试生成小程序码（仅在小程序上线后有效）
    try {
      const qrCodeResp = await cloud.openapi.wxacode.get({
        path: pagePath || 'pages/student-join-class/index',
        width: 200
      });
      
      if (qrCodeResp.buffer) {
        // 上传小程序码到云存储
        const qrCodeUpload = await cloud.uploadFile({
          cloudPath: `qrcodes/invite_${inviteCode}_${Date.now()}.png`,
          fileContent: qrCodeResp.buffer
        });
        qrCodeUrl = qrCodeUpload.fileID;
      }
    } catch (error) {
      console.log('小程序码生成失败（开发环境或未上线）:', error.message);
      // 在开发环境或未上线时，返回null，前端将使用占位符
    }
    
    return {
      success: true,
      qrCodeUrl: qrCodeUrl,
      inviteCode: inviteCode,
      className: className,
      expiryDate: expiryDate,
      isProduction: !!qrCodeUrl
    };
  } catch (error) {
    console.error('生成分享图片失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
