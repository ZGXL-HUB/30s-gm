/**
 * 直接测试反馈提交
 * 在微信小程序控制台运行此脚本
 */

// 直接测试反馈提交
async function testFeedbackSubmitDirect() {
  try {
    console.log('开始直接测试反馈提交...');
    
    // 准备测试数据
    const testData = {
      feedbackId: 'FB' + Date.now().toString().slice(-8),
      type: 'technical',
      title: '班级解散申请',
      content: '测试反馈内容 - 班级解散申请测试',
      contact: 'test@example.com',
      images: []
    };
    
    console.log('测试数据:', testData);
    
    // 调用云函数
    const result = await wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'submitFeedback',
        data: testData
      }
    });
    
    console.log('云函数返回结果:', result);
    
    if (result.result.success) {
      console.log('✅ 测试提交成功');
      return true;
    } else {
      console.log('❌ 测试提交失败:', result.result.message);
      return false;
    }
    
  } catch (error) {
    console.log('❌ 测试过程中出错:', error);
    return false;
  }
}

// 测试不同的action参数
async function testDifferentActions() {
  try {
    console.log('测试不同的action参数...');
    
    const actions = ['submitFeedback', 'test', 'getFeedbackList'];
    
    for (const action of actions) {
      try {
        console.log(`测试action: ${action}`);
        const result = await wx.cloud.callFunction({
          name: 'feedbackManager',
          data: {
            action: action,
            data: {}
          }
        });
        console.log(`${action} 结果:`, result.result);
      } catch (error) {
        console.log(`${action} 错误:`, error.message);
      }
    }
    
  } catch (error) {
    console.log('测试action参数时出错:', error);
  }
}

// 检查当前页面数据
function checkCurrentPageData() {
  try {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (currentPage.route.includes('feedback')) {
      console.log('当前页面数据:', currentPage.data);
      return currentPage.data;
    } else {
      console.log('当前不在反馈页面');
      return null;
    }
  } catch (error) {
    console.log('检查页面数据时出错:', error);
    return null;
  }
}

// 手动提交当前页面的反馈
async function submitCurrentPageFeedback() {
  try {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (!currentPage.route.includes('feedback')) {
      console.log('❌ 当前不在反馈页面');
      return false;
    }
    
    const data = currentPage.data;
    
    // 准备提交数据
    const feedbackData = {
      feedbackId: 'FB' + Date.now().toString().slice(-8),
      type: data.selectedType || 'technical',
      title: data.feedbackTitle || '班级解散申请',
      content: data.feedbackContent || '测试内容',
      contact: data.contactInfo || '',
      images: data.uploadedImages || []
    };
    
    console.log('准备提交的数据:', feedbackData);
    
    // 验证数据
    if (!feedbackData.type || !feedbackData.content) {
      console.log('❌ 数据不完整:', {
        hasType: !!feedbackData.type,
        hasContent: !!feedbackData.content,
        contentLength: feedbackData.content ? feedbackData.content.length : 0
      });
      return false;
    }
    
    // 提交数据
    const result = await wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'submitFeedback',
        data: feedbackData
      }
    });
    
    console.log('提交结果:', result);
    
    if (result.result.success) {
      console.log('✅ 提交成功');
      
      // 更新页面状态
      currentPage.setData({
        submitting: false,
        showSuccessModal: true,
        feedbackId: feedbackData.feedbackId
      });
      
      return true;
    } else {
      console.log('❌ 提交失败:', result.result.message);
      return false;
    }
    
  } catch (error) {
    console.log('❌ 提交过程中出错:', error);
    return false;
  }
}

// 将函数添加到全局作用域
window.testFeedbackSubmitDirect = testFeedbackSubmitDirect;
window.testDifferentActions = testDifferentActions;
window.checkCurrentPageData = checkCurrentPageData;
window.submitCurrentPageFeedback = submitCurrentPageFeedback;

console.log('反馈提交直接测试脚本已加载');
console.log('可用函数:');
console.log('- testFeedbackSubmitDirect() - 直接测试反馈提交');
console.log('- testDifferentActions() - 测试不同的action参数');
console.log('- checkCurrentPageData() - 检查当前页面数据');
console.log('- submitCurrentPageFeedback() - 提交当前页面的反馈');
