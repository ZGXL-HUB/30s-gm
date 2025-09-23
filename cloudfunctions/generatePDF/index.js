// 云函数：生成PDF文件
const cloud = require('wx-server-sdk');
const fs = require('fs');
const path = require('path');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { questions, template, includeAnswer, includeAnalysis, title, subtitle } = event;
  
  try {
    // 这里使用一个简化的PDF生成方案
    // 实际项目中可以使用 puppeteer 或其他PDF生成库
    
    const pdfContent = generatePDFContent({
      title,
      subtitle,
      questions,
      template,
      includeAnswer,
      includeAnalysis
    });
    
    // 将内容保存到云存储
    const fileName = `exercise_${Date.now()}.pdf`;
    const result = await cloud.uploadFile({
      cloudPath: `exports/${fileName}`,
      fileContent: Buffer.from(pdfContent, 'utf8')
    });
    
    return {
      success: true,
      fileId: result.fileID,
      fileName: fileName,
      downloadUrl: result.fileID
    };
    
  } catch (error) {
    console.error('PDF生成失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * 生成PDF内容（简化版本）
 * 实际项目中应该使用专业的PDF生成库
 */
function generatePDFContent({ title, subtitle, questions, template, includeAnswer, includeAnalysis }) {
  let content = '';
  
  // PDF头部
  content += `%PDF-1.4\n`;
  content += `1 0 obj\n`;
  content += `<<\n`;
  content += `/Type /Catalog\n`;
  content += `/Pages 2 0 R\n`;
  content += `>>\n`;
  content += `endobj\n\n`;
  
  // 页面对象
  content += `2 0 obj\n`;
  content += `<<\n`;
  content += `/Type /Pages\n`;
  content += `/Kids [3 0 R]\n`;
  content += `/Count 1\n`;
  content += `>>\n`;
  content += `endobj\n\n`;
  
  // 页面内容
  content += `3 0 obj\n`;
  content += `<<\n`;
  content += `/Type /Page\n`;
  content += `/Parent 2 0 R\n`;
  content += `/MediaBox [0 0 612 792]\n`;
  content += `/Contents 4 0 R\n`;
  content += `>>\n`;
  content += `endobj\n\n`;
  
  // 内容流
  let pageContent = '';
  pageContent += `BT\n`;
  pageContent += `/F1 24 Tf\n`;
  pageContent += `50 750 Td\n`;
  pageContent += `(${title}) Tj\n`;
  pageContent += `0 -30 Td\n`;
  pageContent += `/F1 16 Tf\n`;
  pageContent += `(${subtitle}) Tj\n`;
  pageContent += `0 -50 Td\n`;
  
  // 添加题目
  questions.forEach((q, index) => {
    pageContent += `/F1 14 Tf\n`;
    pageContent += `(${index + 1}. ${q.question}) Tj\n`;
    pageContent += `0 -20 Td\n`;
    
    // 添加选项
    q.options.forEach((option, optIndex) => {
      pageContent += `/F1 12 Tf\n`;
      pageContent += `(${option}) Tj\n`;
      pageContent += `0 -15 Td\n`;
    });
    
    // 添加答案（如果需要）
    if (includeAnswer) {
      pageContent += `/F1 12 Tf\n`;
      pageContent += `(答案: ${q.correctAnswer}) Tj\n`;
      pageContent += `0 -15 Td\n`;
    }
    
    // 添加解析（如果需要）
    if (includeAnalysis && q.analysis) {
      pageContent += `/F1 10 Tf\n`;
      pageContent += `(解析: ${q.analysis}) Tj\n`;
      pageContent += `0 -20 Td\n`;
    }
    
    pageContent += `0 -20 Td\n`; // 题目间距
  });
  
  pageContent += `ET\n`;
  
  // 内容流对象
  const contentLength = pageContent.length;
  content += `4 0 obj\n`;
  content += `<<\n`;
  content += `/Length ${contentLength}\n`;
  content += `>>\n`;
  content += `stream\n`;
  content += pageContent;
  content += `\nendstream\n`;
  content += `endobj\n\n`;
  
  // 字体对象
  content += `5 0 obj\n`;
  content += `<<\n`;
  content += `/Type /Font\n`;
  content += `/Subtype /Type1\n`;
  content += `/BaseFont /Helvetica\n`;
  content += `>>\n`;
  content += `endobj\n\n`;
  
  // 交叉引用表
  content += `xref\n`;
  content += `0 6\n`;
  content += `0000000000 65535 f \n`;
  content += `0000000009 00000 n \n`;
  content += `0000000058 00000 n \n`;
  content += `0000000115 00000 n \n`;
  content += `0000000204 00000 n \n`;
  content += `0000000${contentLength + 300} 00000 n \n`;
  content += `trailer\n`;
  content += `<<\n`;
  content += `/Size 6\n`;
  content += `/Root 1 0 R\n`;
  content += `>>\n`;
  content += `startxref\n`;
  content += `${content.length}\n`;
  content += `%%EOF\n`;
  
  return content;
}
