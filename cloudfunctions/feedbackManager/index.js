// 反馈管理云函数
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 生成安全ID
function generateSecureId(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

exports.main = async (event, context) => {
  const { action, data } = event;
  const { OPENID } = cloud.getWXContext();

  // 调试信息
  console.log('云函数接收到的参数:', { action, data, OPENID });

  try {
    switch (action) {
      case 'submitFeedback':
        return await submitFeedback(data, OPENID);
      case 'getFeedbackList':
        return await getFeedbackList(OPENID, data);
      case 'updateFeedbackStatus':
        return await updateFeedbackStatus(data);
      case 'getFeedbackStats':
        return await getFeedbackStats(OPENID);
      case 'getFeedbackByPriority':
        return await getFeedbackByPriority(data);
      default:
        return {
          success: false,
          message: '未知操作类型'
        };
    }
  } catch (error) {
    console.error('云函数执行错误:', error);
    return {
      success: false,
      message: '服务器错误: ' + error.message
    };
  }
};

// 提交反馈
async function submitFeedback(data, openId) {
  // 验证OpenID
  if (!openId || typeof openId !== 'string' || openId.length !== 28) {
    return {
      success: false,
      message: '用户身份验证失败'
    };
  }

  const {
    feedbackId,
    type,
    title,
    content,
    contact,
    images
  } = data;

  // 验证必填字段
  if (!content) {
    return {
      success: false,
      message: '反馈内容不能为空'
    };
  }

  // 输入验证和清理
  const allowedTypes = ['technical', 'function', 'content', 'experience', 'other', 'general'];
  // 如果没有提供类型或类型不在允许列表中，使用 'general'
  const validType = type && allowedTypes.includes(type) ? type : 'general';

  // 清理用户输入
  const sanitizedContent = content.replace(/[<>]/g, '').trim();
  if (sanitizedContent.length < 5 || sanitizedContent.length > 2000) {
    return {
      success: false,
      message: '反馈内容长度必须在5-2000字符之间'
    };
  }

  const sanitizedTitle = title ? title.replace(/[<>]/g, '').trim().substring(0, 100) : '';
  const sanitizedContact = contact ? contact.replace(/[<>]/g, '').trim().substring(0, 100) : '';

  // 智能分类和优先级分析
  const analysisResult = await analyzeFeedback(content, validType);
  
  // 创建反馈记录
  const feedbackData = {
    feedbackId: feedbackId || generateSecureId(),
    openId,
    type: analysisResult.suggestedType || validType,
    title: sanitizedTitle || getFeedbackTitle(analysisResult.suggestedType || validType),
    content: sanitizedContent,
    contact: sanitizedContact,
    images: Array.isArray(images) ? images.slice(0, 5) : [], // 限制图片数量
    status: 'pending',
    priority: analysisResult.priority,
    urgency: analysisResult.urgency,
    keywords: analysisResult.keywords,
    sentiment: analysisResult.sentiment,
    createTime: new Date(),
    updateTime: new Date()
  };
  
  // 如果提供了 existingIssues 或 unmetNeeds，也保存
  if (data.existingIssues) {
    feedbackData.existingIssues = data.existingIssues;
  }
  if (data.unmetNeeds) {
    feedbackData.unmetNeeds = data.unmetNeeds;
  }

  try {
    const result = await db.collection('user_feedback').add({
      data: feedbackData
    });

    return {
      success: true,
      message: '反馈提交成功',
      data: {
        _id: result._id,
        feedbackId: feedbackData.feedbackId
      }
    };
  } catch (error) {
    console.error('提交反馈失败:', error);
    return {
      success: false,
      message: '提交失败，请重试'
    };
  }
}

// 获取反馈列表
async function getFeedbackList(openId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  const skip = (page - 1) * limit;

  try {
    let query = db.collection('user_feedback').where({
      openId: openId
    });

    if (status) {
      query = query.where({
        status: status
      });
    }

    const result = await query
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(limit)
      .get();

    return {
      success: true,
      data: result.data,
      total: result.data.length
    };
  } catch (error) {
    console.error('获取反馈列表失败:', error);
    return {
      success: false,
      message: '获取反馈列表失败'
    };
  }
}

// 更新反馈状态
async function updateFeedbackStatus(data) {
  const { feedbackId, status, reply } = data;

  if (!feedbackId || !status) {
    return {
      success: false,
      message: '反馈ID和状态不能为空'
    };
  }

  try {
    const updateData = {
      status,
      updateTime: new Date()
    };

    if (reply) {
      updateData.reply = reply;
      updateData.replyTime = new Date();
    }

    await db.collection('user_feedback').where({
      feedbackId: feedbackId
    }).update({
      data: updateData
    });

    return {
      success: true,
      message: '状态更新成功'
    };
  } catch (error) {
    console.error('更新反馈状态失败:', error);
    return {
      success: false,
      message: '更新失败，请重试'
    };
  }
}

// 根据类型生成反馈标题
function getFeedbackTitle(type) {
  const titles = {
    'function': '功能问题反馈',
    'content': '内容质量反馈',
    'experience': '用户体验反馈',
    'technical': '技术问题反馈',
    'general': '功能反馈',
    'other': '其他反馈'
  };
  return titles[type] || '用户反馈';
}

// 智能分析反馈内容
async function analyzeFeedback(content, originalType) {
  const analysisResult = {
    suggestedType: originalType,
    priority: getPriority(originalType),
    urgency: 'normal',
    keywords: [],
    sentiment: 'neutral'
  };

  // 关键词匹配和类型建议
  const keywordPatterns = {
    'technical': [
      '加载', '卡顿', '崩溃', '闪退', '网络', '连接', '同步', '数据丢失',
      '无法', '错误', '异常', 'bug', '问题', '故障', '慢', '延迟'
    ],
    'function': [
      '功能', '按钮', '点击', '操作', '流程', '步骤', '无法使用',
      '不工作', '失效', '失灵', '响应', '交互', '界面'
    ],
    'content': [
      '答案', '解析', '题目', '错误', '不对', '不准确', '有误',
      '内容', '文字', '语法', '拼写', '标点', '格式'
    ],
    'experience': [
      '建议', '改进', '优化', '体验', '界面', '设计', '布局',
      '颜色', '字体', '大小', '美观', '易用', '方便'
    ]
  };

  // 情感分析关键词
  const sentimentKeywords = {
    positive: ['好', '棒', '赞', '优秀', '满意', '喜欢', '感谢'],
    negative: ['差', '烂', '糟糕', '失望', '愤怒', '不满', '讨厌', '垃圾'],
    urgent: ['紧急', '急', '马上', '立即', '尽快', '严重', '影响使用']
  };

  // 分析内容
  const lowerContent = content.toLowerCase();
  
  // 类型建议
  let maxMatches = 0;
  for (const [type, keywords] of Object.entries(keywordPatterns)) {
    const matches = keywords.filter(keyword => lowerContent.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      analysisResult.suggestedType = type;
    }
  }

  // 提取关键词
  for (const [type, keywords] of Object.entries(keywordPatterns)) {
    const matchedKeywords = keywords.filter(keyword => lowerContent.includes(keyword));
    analysisResult.keywords.push(...matchedKeywords);
  }

  // 情感分析
  for (const [sentiment, keywords] of Object.entries(sentimentKeywords)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      analysisResult.sentiment = sentiment;
      break;
    }
  }

  // 紧急程度分析
  if (sentimentKeywords.urgent.some(keyword => lowerContent.includes(keyword))) {
    analysisResult.urgency = 'high';
  } else if (analysisResult.sentiment === 'negative') {
    analysisResult.urgency = 'medium';
  }

  // 重新计算优先级
  analysisResult.priority = getPriority(analysisResult.suggestedType);
  
  // 根据紧急程度调整优先级
  if (analysisResult.urgency === 'high') {
    analysisResult.priority = Math.max(1, analysisResult.priority - 1);
  }

  return analysisResult;
}

// 根据类型设置优先级
function getPriority(type) {
  const priorities = {
    'technical': 1, // 技术问题优先级最高
    'function': 2,  // 功能问题
    'content': 3,   // 内容问题
    'experience': 4 // 体验建议
  };
  return priorities[type] || 5;
}

// 获取反馈统计信息
async function getFeedbackStats(openId) {
  try {
    const result = await db.collection('user_feedback').where({
      openId: openId
    }).get();

    const feedbacks = result.data;
    
    // 统计各状态数量
    const stats = {
      total: feedbacks.length,
      pending: feedbacks.filter(f => f.status === 'pending').length,
      processing: feedbacks.filter(f => f.status === 'processing').length,
      resolved: feedbacks.filter(f => f.status === 'resolved').length,
      byType: {},
      byPriority: {},
      byUrgency: {}
    };

    // 按类型统计
    feedbacks.forEach(feedback => {
      const type = feedback.type || 'other';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      
      const priority = feedback.priority || 5;
      stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
      
      const urgency = feedback.urgency || 'normal';
      stats.byUrgency[urgency] = (stats.byUrgency[urgency] || 0) + 1;
    });

    return {
      success: true,
      data: stats
    };
  } catch (error) {
    console.error('获取反馈统计失败:', error);
    return {
      success: false,
      message: '获取统计信息失败'
    };
  }
}

// 按优先级获取反馈列表
async function getFeedbackByPriority(options = {}) {
  const { page = 1, limit = 10, status, priority } = options;
  const skip = (page - 1) * limit;

  try {
    let query = db.collection('user_feedback');

    // 添加筛选条件
    if (status) {
      query = query.where({
        status: status
      });
    }

    if (priority) {
      query = query.where({
        priority: priority
      });
    }

    const result = await query
      .orderBy('priority', 'asc')  // 按优先级升序
      .orderBy('createTime', 'desc')  // 同优先级按时间降序
      .skip(skip)
      .limit(limit)
      .get();

    return {
      success: true,
      data: result.data,
      total: result.data.length
    };
  } catch (error) {
    console.error('按优先级获取反馈失败:', error);
    return {
      success: false,
      message: '获取反馈列表失败'
    };
  }
}
