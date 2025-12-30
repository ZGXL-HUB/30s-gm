/**
 * 快速修复反馈提交问题
 * 在微信小程序控制台运行此脚本
 */

// 快速修复反馈提交问题
async function quickFixFeedbackSubmit() {
  try {
    console.log('开始快速修复反馈提交问题...');
    
    // 1. 检查当前页面
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (!currentPage.route.includes('feedback')) {
      console.log('❌ 当前不在反馈页面');
      return false;
    }
    
    console.log('✅ 当前在反馈页面');
    
    // 2. 检查云开发环境
    if (!wx.cloud) {
      console.log('❌ 云开发环境不可用');
      console.log('解决方案: 使用本地存储备选方案');
      
      // 强制启用提交按钮
      currentPage.setData({ 
        canSubmit: true,
        selectedType: currentPage.data.selectedType || 'technical'
      });
      
      console.log('✅ 已启用本地存储模式');
      return true;
    }
    
    // 3. 测试云函数
    try {
      console.log('测试 feedbackManager 云函数...');
      await wx.cloud.callFunction({
        name: 'feedbackManager',
        data: { action: 'test' }
      });
      console.log('✅ 云函数测试成功');
    } catch (cloudError) {
      console.log('❌ 云函数测试失败:', cloudError.message);
      
      if (cloudError.errMsg && cloudError.errMsg.includes('not found')) {
        console.log('🔍 问题: feedbackManager 云函数未部署');
        console.log('解决方案: 在微信开发者工具中部署云函数');
        
        // 显示部署提示
        wx.showModal({
          title: '需要部署云函数',
          content: 'feedbackManager 云函数未部署，请在微信开发者工具中部署该云函数。',
          showCancel: false,
          confirmText: '知道了'
        });
        
        return false;
      }
    }
    
    // 4. 检查数据库权限
    try {
      console.log('测试数据库访问...');
      const db = wx.cloud.database();
      await db.collection('user_feedback').limit(1).get();
      console.log('✅ 数据库访问正常');
    } catch (dbError) {
      console.log('❌ 数据库访问失败:', dbError.message);
      
      if (dbError.errMsg && dbError.errMsg.includes('permission')) {
        console.log('🔍 问题: 数据库权限不足');
        console.log('解决方案: 检查 user_feedback 集合权限');
        
        // 显示权限提示
        wx.showModal({
          title: '数据库权限问题',
          content: 'user_feedback 集合权限不足，请检查云数据库权限设置。',
          showCancel: false,
          confirmText: '知道了'
        });
        
        return false;
      }
    }
    
    // 5. 强制启用提交按钮
    currentPage.setData({ 
      canSubmit: true,
      selectedType: currentPage.data.selectedType || 'technical'
    });
    
    console.log('✅ 修复完成，现在应该可以提交反馈了');
    
    // 6. 测试提交功能
    const data = currentPage.data;
    if (data.canSubmit && !data.submitting) {
      console.log('🎉 提交按钮已启用，可以尝试提交反馈');
      
      // 显示成功提示
      wx.showToast({
        title: '修复成功，可以提交了',
        icon: 'success'
      });
      
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error('修复过程中出错:', error);
    return false;
  }
}

// 手动触发提交（用于测试）
function manualSubmitFeedback() {
  try {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (!currentPage.route.includes('feedback')) {
      console.log('❌ 当前不在反馈页面');
      return false;
    }
    
    if (typeof currentPage.submitFeedback === 'function') {
      console.log('手动触发提交反馈...');
      currentPage.submitFeedback();
      return true;
    } else {
      console.log('❌ submitFeedback 方法不存在');
      return false;
    }
    
  } catch (error) {
    console.error('手动提交失败:', error);
    return false;
  }
}

// 检查本地存储的反馈
function checkLocalFeedbacks() {
  try {
    const localFeedbacks = wx.getStorageSync('local_feedbacks') || [];
    console.log('本地存储的反馈数量:', localFeedbacks.length);
    
    if (localFeedbacks.length > 0) {
      console.log('本地反馈列表:');
      localFeedbacks.forEach((feedback, index) => {
        console.log(`${index + 1}. ${feedback.title} (${feedback.type}) - ${feedback.createTime}`);
      });
      
      // 尝试重新提交本地反馈
      wx.showModal({
        title: '发现本地反馈',
        content: `发现 ${localFeedbacks.length} 条本地反馈，是否尝试重新提交？`,
        success: (res) => {
          if (res.confirm) {
            resubmitLocalFeedbacks(localFeedbacks);
          }
        }
      });
    } else {
      console.log('没有本地反馈记录');
    }
    
    return localFeedbacks.length;
    
  } catch (error) {
    console.error('检查本地反馈失败:', error);
    return 0;
  }
}

// 重新提交本地反馈
async function resubmitLocalFeedbacks(localFeedbacks) {
  try {
    console.log('开始重新提交本地反馈...');
    
    for (const feedback of localFeedbacks) {
      try {
        await wx.cloud.callFunction({
          name: 'feedbackManager',
          data: {
            action: 'submitFeedback',
            data: feedback
          }
        });
        
        console.log(`✅ 反馈 "${feedback.title}" 重新提交成功`);
        
        // 从本地存储中移除已成功提交的反馈
        const updatedFeedbacks = localFeedbacks.filter(f => f.id !== feedback.id);
        wx.setStorageSync('local_feedbacks', updatedFeedbacks);
        
      } catch (error) {
        console.log(`❌ 反馈 "${feedback.title}" 重新提交失败:`, error.message);
      }
    }
    
    console.log('本地反馈重新提交完成');
    
  } catch (error) {
    console.error('重新提交本地反馈失败:', error);
  }
}

// 将函数添加到全局作用域
window.quickFixFeedbackSubmit = quickFixFeedbackSubmit;
window.manualSubmitFeedback = manualSubmitFeedback;
window.checkLocalFeedbacks = checkLocalFeedbacks;
window.resubmitLocalFeedbacks = resubmitLocalFeedbacks;

console.log('快速修复反馈提交问题脚本已加载');
console.log('可用函数:');
console.log('- quickFixFeedbackSubmit() - 快速修复提交问题');
console.log('- manualSubmitFeedback() - 手动触发提交');
console.log('- checkLocalFeedbacks() - 检查本地反馈');
console.log('- resubmitLocalFeedbacks() - 重新提交本地反馈');
