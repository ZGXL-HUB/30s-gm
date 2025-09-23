// 云函数：生成Word文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const { questions, template, includeAnswer, includeAnalysis, title, subtitle } = event;
  
  try {
    // 生成Word文档内容
    const wordContent = generateWordContent({
      title,
      subtitle,
      questions,
      template,
      includeAnswer,
      includeAnalysis
    });
    
    // 将内容保存到云存储
    const fileName = `exercise_${Date.now()}.docx`;
    const result = await cloud.uploadFile({
      cloudPath: `exports/${fileName}`,
      fileContent: Buffer.from(wordContent, 'utf8')
    });
    
    return {
      success: true,
      fileId: result.fileID,
      fileName: fileName,
      downloadUrl: result.fileID
    };
    
  } catch (error) {
    console.error('Word生成失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * 生成Word文档内容（简化版本）
 * 实际项目中应该使用专业的Word生成库
 */
function generateWordContent({ title, subtitle, questions, template, includeAnswer, includeAnalysis }) {
  let content = '';
  
  // Word文档头部
  content += `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n`;
  content += `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n`;
  content += `<w:body>\n`;
  
  // 标题
  content += `<w:p>\n`;
  content += `<w:r>\n`;
  content += `<w:rPr>\n`;
  content += `<w:b/>\n`;
  content += `<w:sz w:val="32"/>\n`;
  content += `</w:rPr>\n`;
  content += `<w:t>${title}</w:t>\n`;
  content += `</w:r>\n`;
  content += `</w:p>\n`;
  
  // 副标题
  content += `<w:p>\n`;
  content += `<w:r>\n`;
  content += `<w:rPr>\n`;
  content += `<w:sz w:val="24"/>\n`;
  content += `</w:rPr>\n`;
  content += `<w:t>${subtitle}</w:t>\n`;
  content += `</w:r>\n`;
  content += `</w:p>\n`;
  
  // 添加题目
  questions.forEach((q, index) => {
    // 题号
    content += `<w:p>\n`;
    content += `<w:r>\n`;
    content += `<w:rPr>\n`;
    content += `<w:b/>\n`;
    content += `<w:sz w:val="24"/>\n`;
    content += `</w:rPr>\n`;
    content += `<w:t>${index + 1}. ${q.question}</w:t>\n`;
    content += `</w:r>\n`;
    content += `</w:p>\n`;
    
    // 选项
    q.options.forEach((option, optIndex) => {
      content += `<w:p>\n`;
      content += `<w:r>\n`;
      content += `<w:rPr>\n`;
      content += `<w:sz w:val="20"/>\n`;
      content += `</w:rPr>\n`;
      content += `<w:t>   ${option}</w:t>\n`;
      content += `</w:r>\n`;
      content += `</w:p>\n`;
    });
    
    // 答案（如果需要）
    if (includeAnswer) {
      content += `<w:p>\n`;
      content += `<w:r>\n`;
      content += `<w:rPr>\n`;
      content += `<w:b/>\n`;
      content += `<w:color w:val="008000"/>\n`;
      content += `<w:sz w:val="20"/>\n`;
      content += `</w:rPr>\n`;
      content += `<w:t>答案: ${q.correctAnswer}</w:t>\n`;
      content += `</w:r>\n`;
      content += `</w:p>\n`;
    }
    
    // 解析（如果需要）
    if (includeAnalysis && q.analysis) {
      content += `<w:p>\n`;
      content += `<w:r>\n`;
      content += `<w:rPr>\n`;
      content += `<w:sz w:val="18"/>\n`;
      content += `<w:color w:val="666666"/>\n`;
      content += `</w:rPr>\n`;
      content += `<w:t>解析: ${q.analysis}</w:t>\n`;
      content += `</w:r>\n`;
      content += `</w:p>\n`;
    }
    
    // 题目间距
    content += `<w:p>\n`;
    content += `<w:r>\n`;
    content += `<w:t></w:t>\n`;
    content += `</w:r>\n`;
    content += `</w:p>\n`;
  });
  
  // 文档结尾
  content += `</w:body>\n`;
  content += `</w:document>\n`;
  
  return content;
}
