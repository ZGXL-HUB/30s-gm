// 云函数：生成Excel文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const { questions, includeAnswer, includeAnalysis, title } = event;
  
  try {
    // 生成Excel内容
    const excelContent = generateExcelContent({
      title,
      questions,
      includeAnswer,
      includeAnalysis
    });
    
    // 将内容保存到云存储
    const fileName = `exercise_${Date.now()}.xlsx`;
    const result = await cloud.uploadFile({
      cloudPath: `exports/${fileName}`,
      fileContent: Buffer.from(excelContent, 'utf8')
    });
    
    return {
      success: true,
      fileId: result.fileID,
      fileName: fileName,
      downloadUrl: result.fileID
    };
    
  } catch (error) {
    console.error('Excel生成失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * 生成Excel内容（简化版本）
 * 实际项目中应该使用专业的Excel生成库
 */
function generateExcelContent({ title, questions, includeAnswer, includeAnalysis }) {
  let content = '';
  
  // Excel XML头部
  content += `<?xml version="1.0" encoding="UTF-8"?>\n`;
  content += `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n`;
  content += `xmlns:o="urn:schemas-microsoft-com:office:office"\n`;
  content += `xmlns:x="urn:schemas-microsoft-com:office:excel"\n`;
  content += `xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n`;
  content += `xmlns:html="http://www.w3.org/TR/REC-html40">\n`;
  
  // 工作表
  content += `<Worksheet ss:Name="${title}">\n`;
  content += `<Table>\n`;
  
  // 表头
  content += `<Row>\n`;
  content += `<Cell><Data ss:Type="String">题号</Data></Cell>\n`;
  content += `<Cell><Data ss:Type="String">题目</Data></Cell>\n`;
  content += `<Cell><Data ss:Type="String">选项A</Data></Cell>\n`;
  content += `<Cell><Data ss:Type="String">选项B</Data></Cell>\n`;
  content += `<Cell><Data ss:Type="String">选项C</Data></Cell>\n`;
  content += `<Cell><Data ss:Type="String">选项D</Data></Cell>\n`;
  content += `<Cell><Data ss:Type="String">选项E</Data></Cell>\n`;
  
  if (includeAnswer) {
    content += `<Cell><Data ss:Type="String">正确答案</Data></Cell>\n`;
  }
  
  if (includeAnalysis) {
    content += `<Cell><Data ss:Type="String">解析</Data></Cell>\n`;
  }
  
  content += `<Cell><Data ss:Type="String">难度</Data></Cell>\n`;
  content += `</Row>\n`;
  
  // 数据行
  questions.forEach((q, index) => {
    content += `<Row>\n`;
    content += `<Cell><Data ss:Type="Number">${index + 1}</Data></Cell>\n`;
    content += `<Cell><Data ss:Type="String">${q.question}</Data></Cell>\n`;
    
    // 选项
    for (let i = 0; i < 5; i++) {
      const option = q.options[i] || '';
      content += `<Cell><Data ss:Type="String">${option}</Data></Cell>\n`;
    }
    
    // 答案
    if (includeAnswer) {
      content += `<Cell><Data ss:Type="String">${q.correctAnswer}</Data></Cell>\n`;
    }
    
    // 解析
    if (includeAnalysis) {
      content += `<Cell><Data ss:Type="String">${q.analysis || ''}</Data></Cell>\n`;
    }
    
    // 难度
    content += `<Cell><Data ss:Type="String">${q.difficulty || 'medium'}</Data></Cell>\n`;
    content += `</Row>\n`;
  });
  
  content += `</Table>\n`;
  content += `</Worksheet>\n`;
  content += `</Workbook>\n`;
  
  return content;
}
