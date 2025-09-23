// 生成错题分析PPT云函数
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { assignmentId, teacherId, format = 'ppt' } = event;
  
  try {
    // 验证教师权限
    const teacher = await db.collection('teachers').doc(teacherId).get();
    if (!teacher.data || teacher.data.status !== 'active') {
      return {
        success: false,
        error: '教师权限验证失败'
      };
    }
    
    // 获取作业信息
    const assignment = await db.collection('assignments').doc(assignmentId).get();
    if (!assignment.data) {
      return {
        success: false,
        error: '作业不存在'
      };
    }
    
    // 获取作业结果统计
    const statsResult = await calculateAssignmentStats(assignmentId);
    if (!statsResult.success) {
      return statsResult;
    }
    
    const questionStats = statsResult.data.questionStats;
    
    // 生成文件名
    const fileName = generateFileName(format, teacher.data.name, new Date(), assignment.data.title);
    
    // 根据格式生成文件
    let fileResult;
    if (format === 'ppt') {
      fileResult = await generatePPT(questionStats, assignment.data, teacher.data, fileName);
    } else if (format === 'word') {
      fileResult = await generateWord(questionStats, assignment.data, teacher.data, fileName);
    } else {
      return {
        success: false,
        error: '不支持的文件格式'
      };
    }
    
    if (!fileResult.success) {
      return fileResult;
    }
    
    // 保存导出记录
    await saveExportRecord(teacherId, assignmentId, fileName, format, fileResult.data);
    
    return {
      success: true,
      data: {
        fileName: fileName,
        downloadUrl: fileResult.data.downloadUrl,
        fileId: fileResult.data.fileId,
        message: '文件生成成功'
      }
    };
    
  } catch (error) {
    console.error('生成错题分析文件失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 计算作业统计
async function calculateAssignmentStats(assignmentId) {
  try {
    // 获取作业结果
    const results = await db.collection('assignment_results')
      .where({ assignmentId: assignmentId })
      .get();
    
    if (results.data.length === 0) {
      return {
        success: false,
        error: '暂无学生提交作业'
      };
    }
    
    // 计算每道题的错误率
    const questionStats = {};
    const totalStudents = results.data.length;
    
    results.data.forEach(result => {
      result.wrongQuestions.forEach(questionId => {
        if (!questionStats[questionId]) {
          questionStats[questionId] = { wrong: 0, total: 0 };
        }
        questionStats[questionId].wrong++;
      });
      
      // 统计总答题数
      result.answers.forEach((answer, index) => {
        const questionId = result.answers[index];
        if (!questionStats[questionId]) {
          questionStats[questionId] = { wrong: 0, total: 0 };
        }
        questionStats[questionId].total++;
      });
    });
    
    // 计算错误率并排序
    const sortedQuestions = Object.entries(questionStats)
      .map(([questionId, stats]) => ({
        questionId,
        errorRate: (stats.wrong / stats.total) * 100,
        wrongCount: stats.wrong,
        totalCount: stats.total
      }))
      .sort((a, b) => b.errorRate - a.errorRate);
    
    // 获取题目详细信息
    const questionPromises = sortedQuestions.map(stat => 
      db.collection('questions').doc(stat.questionId).get()
    );
    const questionResults = await Promise.all(questionPromises);
    
    const questionDetails = questionResults.map((result, index) => ({
      ...sortedQuestions[index],
      question: result.data,
      variants: [] // 变式题将在后续生成
    }));
    
    return {
      success: true,
      data: {
        questionStats: questionDetails,
        totalStudents: totalStudents,
        averageAccuracy: calculateAverageAccuracy(results.data)
      }
    };
    
  } catch (error) {
    console.error('计算作业统计失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 生成PPT文件
async function generatePPT(questionStats, assignment, teacher, fileName) {
  try {
    // 这里使用简化的PPT生成方案
    // 实际项目中可以使用 puppeteer 或其他PPT生成库
    
    const pptContent = generatePPTContent(questionStats, assignment, teacher);
    
    // 将内容保存到云存储
    const result = await cloud.uploadFile({
      cloudPath: `exports/${fileName}`,
      fileContent: Buffer.from(pptContent, 'utf8')
    });
    
    return {
      success: true,
      data: {
        fileId: result.fileID,
        downloadUrl: result.fileID,
        fileName: fileName
      }
    };
    
  } catch (error) {
    console.error('生成PPT失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 生成Word文件
async function generateWord(questionStats, assignment, teacher, fileName) {
  try {
    // 这里使用简化的Word生成方案
    // 实际项目中可以使用 docx 库
    
    const wordContent = generateWordContent(questionStats, assignment, teacher);
    
    // 将内容保存到云存储
    const result = await cloud.uploadFile({
      cloudPath: `exports/${fileName}`,
      fileContent: Buffer.from(wordContent, 'utf8')
    });
    
    return {
      success: true,
      data: {
        fileId: result.fileID,
        downloadUrl: result.fileID,
        fileName: fileName
      }
    };
    
  } catch (error) {
    console.error('生成Word失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 生成PPT内容
function generatePPTContent(questionStats, assignment, teacher) {
  let content = `# 语法讲评习题\n\n`;
  content += `**教师：** ${teacher.name}\n`;
  content += `**作业：** ${assignment.title}\n`;
  content += `**生成时间：** ${new Date().toLocaleString()}\n\n`;
  
  content += `## 错题分析报告\n\n`;
  
  questionStats.forEach((stat, index) => {
    content += `### 第${index + 1}题 (错误率: ${stat.errorRate.toFixed(1)}%)\n\n`;
    content += `**题目：** ${stat.question.question || stat.question.text}\n\n`;
    
    if (stat.question.options) {
      stat.question.options.forEach((option, optIndex) => {
        content += `${String.fromCharCode(65 + optIndex)}. ${option}\n`;
      });
    }
    
    content += `\n**答案：** ${stat.question.answer || stat.question.correctAnswer}\n`;
    content += `**解析：** ${stat.question.analysis || '暂无解析'}\n\n`;
    
    // 变式题
    if (stat.variants && stat.variants.length > 0) {
      content += `**变式题：**\n`;
      stat.variants.forEach((variant, vIndex) => {
        content += `${vIndex + 1}. ${variant.question || variant.text}\n`;
        if (variant.options) {
          variant.options.forEach((option, optIndex) => {
            content += `   ${String.fromCharCode(65 + optIndex)}. ${option}\n`;
          });
        }
        content += `   答案：${variant.answer || variant.correctAnswer}\n\n`;
      });
    }
    
    content += `---\n\n`;
  });
  
  return content;
}

// 生成Word内容
function generateWordContent(questionStats, assignment, teacher) {
  let content = `# 语法讲评习题\n\n`;
  content += `**教师：** ${teacher.name}\n`;
  content += `**作业：** ${assignment.title}\n`;
  content += `**生成时间：** ${new Date().toLocaleString()}\n\n`;
  
  content += `## 错题分析报告\n\n`;
  
  questionStats.forEach((stat, index) => {
    content += `### 第${index + 1}题 (错误率: ${stat.errorRate.toFixed(1)}%)\n\n`;
    content += `**题目：** ${stat.question.question || stat.question.text}\n\n`;
    
    if (stat.question.options) {
      stat.question.options.forEach((option, optIndex) => {
        content += `${String.fromCharCode(65 + optIndex)}. ${option}\n`;
      });
    }
    
    content += `\n**答案：** ${stat.question.answer || stat.question.correctAnswer}\n`;
    content += `**解析：** ${stat.question.analysis || '暂无解析'}\n\n`;
    
    // 变式题（Word版本显示答案和解析）
    if (stat.variants && stat.variants.length > 0) {
      content += `**变式题：**\n`;
      stat.variants.forEach((variant, vIndex) => {
        content += `${vIndex + 1}. ${variant.question || variant.text}\n`;
        if (variant.options) {
          variant.options.forEach((option, optIndex) => {
            content += `   ${String.fromCharCode(65 + optIndex)}. ${option}\n`;
          });
        }
        content += `   答案：${variant.answer || variant.correctAnswer}\n`;
        content += `   解析：${variant.analysis || '暂无解析'}\n\n`;
      });
    }
    
    content += `---\n\n`;
  });
  
  return content;
}

// 生成文件名
function generateFileName(format, teacherName, date, assignmentTitle) {
  const dateStr = formatDate(date);
  const grammarPoint = extractGrammarPoint(assignmentTitle);
  const extension = format === 'ppt' ? 'pptx' : 'docx';
  return `${dateStr}_${teacherName}_${grammarPoint}讲评习题.${extension}`;
}

// 格式化日期
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 提取语法点
function extractGrammarPoint(title) {
  // 简单的语法点提取逻辑
  const grammarPoints = ['定语从句', '非谓语动词', '时态', '语态', '虚拟语气', '倒装', '强调', '综合'];
  for (const point of grammarPoints) {
    if (title.includes(point)) {
      return point;
    }
  }
  return '综合';
}

// 计算平均正确率
function calculateAverageAccuracy(results) {
  if (results.length === 0) return 0;
  const totalAccuracy = results.reduce((sum, result) => sum + result.accuracy, 0);
  return (totalAccuracy / results.length).toFixed(2);
}

// 保存导出记录
async function saveExportRecord(teacherId, assignmentId, fileName, fileType, fileData) {
  try {
    await db.collection('export_records').add({
      data: {
        _id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        teacherId: teacherId,
        assignmentId: assignmentId,
        fileName: fileName,
        fileType: fileType,
        fileSize: 0, // 实际项目中应该计算文件大小
        downloadUrl: fileData.downloadUrl,
        content: {
          questionCount: 0, // 实际项目中应该统计题目数量
          variantCount: 0,
          averageAccuracy: 0
        },
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('保存导出记录失败:', error);
  }
}
