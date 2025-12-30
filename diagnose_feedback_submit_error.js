/**
 * 诊断反馈提交错误
 * 在微信小程序控制台运行此脚本
 */

// 诊断反馈提交错误
async function diagnoseFeedbackSubmitError() {
  try {
    console.log('开始诊断反馈提交错误...');
    console.log('=====================================');
    
    // 1. 检查云开发环境
    console.log('1. 检查云开发环境:');
    if (wx.cloud) {
      console.log('✅ wx.cloud 可用');
      
      try {
        // 测试云函数调用
        console.log('测试云函数调用...');
        const testResult = await wx.cloud.callFunction({
          name: 'feedbackManager',
          data: {
            action: 'test'
          }
        });
        console.log('✅ feedbackManager 云函数调用成功:', testResult);
      } catch (cloudError) {
        console.log('❌ feedbackManager 云函数调用失败:', cloudError);
        console.log('错误详情:', cloudError.message);
        
        // 检查是否是部署问题
        if (cloudError.errMsg && cloudError.errMsg.includes('not found')) {
          console.log('🔍 可能的问题: feedbackManager 云函数未部署');
          console.log('解决方案: 需要在微信开发者工具中部署 feedbackManager 云函数');
        }
        
        if (cloudError.errMsg && cloudError.errMsg.includes('permission')) {
          console.log('🔍 可能的问题: 云函数权限不足');
          console.log('解决方案: 检查云函数权限配置');
        }
      }
    } else {
      console.log('❌ wx.cloud 不可用');
      console.log('解决方案: 检查云开发环境配置');
    }
    
    // 2. 检查当前页面数据
    console.log('\n2. 检查当前页面数据:');
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (currentPage.route.includes('feedback')) {
      console.log('✅ 当前在反馈页面');
      const data = currentPage.data;
      console.log('页面数据:', {
        selectedType: data.selectedType,
        feedbackContent: data.feedbackContent ? data.feedbackContent.substring(0, 50) + '...' : '无',
        canSubmit: data.canSubmit,
        submitting: data.submitting
      });
      
      // 检查提交数据格式
      const submitData = {
        feedbackId: 'FB' + Date.now().toString().slice(-8),
        type: data.selectedType,
        title: data.feedbackTitle || '测试标题',
        content: data.feedbackContent || '测试内容',
        contact: data.contactInfo || '',
        images: []
      };
      
      console.log('提交数据格式:', submitData);
      
      // 验证数据
      const validation = {
        hasType: !!submitData.type,
        hasContent: submitData.content && submitData.content.trim().length > 0,
        contentLength: submitData.content ? submitData.content.length : 0,
        isValid: true
      };
      
      if (!validation.hasType) {
        validation.isValid = false;
        console.log('❌ 缺少反馈类型');
      }
      
      if (!validation.hasContent) {
        validation.isValid = false;
        console.log('❌ 缺少反馈内容');
      }
      
      if (validation.contentLength < 5) {
        validation.isValid = false;
        console.log('❌ 反馈内容太短 (少于5字符)');
      }
      
      if (validation.contentLength > 2000) {
        validation.isValid = false;
        console.log('❌ 反馈内容太长 (超过2000字符)');
      }
      
      console.log('数据验证结果:', validation);
      
    } else {
      console.log('❌ 当前不在反馈页面');
    }
    
    // 3. 检查云数据库权限
    console.log('\n3. 检查云数据库权限:');
    try {
      if (wx.cloud) {
        const db = wx.cloud.database();
        const testResult = await db.collection('user_feedback').limit(1).get();
        console.log('✅ user_feedback 集合访问成功');
      } else {
        console.log('❌ 无法访问云数据库');
      }
    } catch (dbError) {
      console.log('❌ user_feedback 集合访问失败:', dbError.message);
      
      if (dbError.errMsg && dbError.errMsg.includes('permission')) {
        console.log('🔍 可能的问题: 数据库权限不足');
        console.log('解决方案: 检查 user_feedback 集合的读写权限');
      }
    }
    
    // 4. 提供修复建议
    console.log('\n4. 修复建议:');
    console.log('基于以上检查结果，可能的解决方案:');
    
    if (!wx.cloud) {
      console.log('- 检查云开发环境配置');
      console.log('- 确保 AppID 正确');
      console.log('- 确保云开发环境已开通');
    }
    
    console.log('- 在微信开发者工具中部署 feedbackManager 云函数');
    console.log('- 检查云数据库 user_feedback 集合的权限设置');
    console.log('- 确保网络连接正常');
    
    console.log('\n诊断完成！');
    console.log('=====================================');
    
    return {
      success: true,
      message: '诊断完成，请查看上述结果'
    };
    
  } catch (error) {
    console.error('诊断过程中出错:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 测试简化的反馈提交
async function testSimpleFeedbackSubmit() {
  try {
    console.log('测试简化的反馈提交...');
    
    const testData = {
      feedbackId: 'FB' + Date.now().toString().slice(-8),
      type: 'technical',
      title: '测试反馈',
      content: '这是一个测试反馈，用于验证云函数是否正常工作。',
      contact: 'test@example.com',
      images: []
    };
    
    console.log('测试数据:', testData);
    
    const result = await wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'submitFeedback',
        data: testData
      }
    });
    
    console.log('✅ 测试提交成功:', result);
    return true;
    
  } catch (error) {
    console.log('❌ 测试提交失败:', error);
    console.log('错误详情:', error.message);
    return false;
  }
}

// 检查云函数部署状态
async function checkCloudFunctionDeployment() {
  try {
    console.log('检查云函数部署状态...');
    
    // 尝试调用一个简单的云函数测试
    const result = await wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'test'
      }
    });
    
    console.log('✅ feedbackManager 云函数已部署并可用');
    return true;
    
  } catch (error) {
    console.log('❌ feedbackManager 云函数部署检查失败:', error.message);
    
    if (error.errMsg && error.errMsg.includes('not found')) {
      console.log('🔍 云函数未部署，需要在微信开发者工具中部署');
    }
    
    return false;
  }
}

// 将函数添加到全局作用域
window.diagnoseFeedbackSubmitError = diagnoseFeedbackSubmitError;
window.testSimpleFeedbackSubmit = testSimpleFeedbackSubmit;
window.checkCloudFunctionDeployment = checkCloudFunctionDeployment;

console.log('反馈提交错误诊断脚本已加载');
console.log('可用函数:');
console.log('- diagnoseFeedbackSubmitError() - 完整诊断');
console.log('- testSimpleFeedbackSubmit() - 测试简化提交');
console.log('- checkCloudFunctionDeployment() - 检查云函数部署');
