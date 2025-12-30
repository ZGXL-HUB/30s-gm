const cloud = require('wx-server-sdk');
const { generateStudentTemplate } = require('./generateTemplate');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  try {
    console.log('开始生成学生导入模板');
    
    // 生成Excel模板
    const excelBuffer = generateStudentTemplate();
    
    // 上传到云存储
    const fileName = `学生导入模板_${Date.now()}.xlsx`;
    const result = await cloud.uploadFile({
      cloudPath: `templates/${fileName}`,
      fileContent: excelBuffer
    });
    
    console.log('模板生成成功:', result);
    
    return {
      success: true,
      fileId: result.fileID,
      fileName: fileName,
      downloadUrl: result.fileID
    };
    
  } catch (error) {
    console.error('生成模板失败:', error);
    return {
      success: false,
      message: '生成模板失败: ' + error.message
    };
  }
};
