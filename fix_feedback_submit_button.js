/**
 * 修复反馈页面提交按钮无法点击的问题
 * 在微信小程序控制台运行此脚本
 */

// 修复反馈页面提交按钮
function fixFeedbackSubmitButton() {
  try {
    console.log('开始修复反馈页面提交按钮...');
    
    // 获取当前页面
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (!currentPage.route.includes('feedback')) {
      console.log('❌ 当前不在反馈页面');
      console.log('请先导航到反馈页面，然后运行此脚本');
      return false;
    }
    
    console.log('✅ 当前在反馈页面');
    
    // 获取当前页面数据
    const data = currentPage.data;
    console.log('当前页面数据:', data);
    
    // 检查并修复数据
    let needsFix = false;
    
    // 1. 检查反馈类型
    if (!data.selectedType) {
      console.log('⚠️ 反馈类型未设置，设置为technical');
      currentPage.setData({ selectedType: 'technical' });
      needsFix = true;
    }
    
    // 2. 检查反馈内容
    if (!data.feedbackContent || data.feedbackContent.trim().length === 0) {
      console.log('⚠️ 反馈内容为空，设置默认内容');
      currentPage.setData({ 
        feedbackContent: '班级解散申请\n\n请管理员处理班级解散请求。' 
      });
      needsFix = true;
    }
    
    // 3. 强制启用提交按钮
    if (!data.canSubmit) {
      console.log('⚠️ 提交按钮被禁用，强制启用');
      currentPage.setData({ canSubmit: true });
      needsFix = true;
    }
    
    // 4. 如果正在提交，重置状态
    if (data.submitting) {
      console.log('⚠️ 正在提交状态，重置为未提交');
      currentPage.setData({ submitting: false });
      needsFix = true;
    }
    
    if (needsFix) {
      console.log('✅ 已修复提交按钮问题');
      console.log('修复后的数据:', currentPage.data);
    } else {
      console.log('✅ 提交按钮状态正常，无需修复');
    }
    
    // 5. 验证修复结果
    const finalData = currentPage.data;
    const canSubmitNow = finalData.selectedType && 
                        finalData.feedbackContent && 
                        finalData.feedbackContent.trim().length > 0 &&
                        finalData.canSubmit &&
                        !finalData.submitting;
    
    console.log('\n修复结果验证:');
    console.log('- selectedType:', finalData.selectedType);
    console.log('- feedbackContent长度:', finalData.feedbackContent ? finalData.feedbackContent.length : 0);
    console.log('- canSubmit:', finalData.canSubmit);
    console.log('- submitting:', finalData.submitting);
    console.log('- 最终可提交状态:', canSubmitNow);
    
    if (canSubmitNow) {
      console.log('🎉 修复成功！现在应该可以点击提交按钮了');
    } else {
      console.log('❌ 修复失败，请检查控制台错误信息');
    }
    
    return canSubmitNow;
    
  } catch (error) {
    console.error('修复过程中出错:', error);
    return false;
  }
}

// 手动测试提交功能
function testSubmitFunction() {
  try {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (!currentPage.route.includes('feedback')) {
      console.log('❌ 当前不在反馈页面');
      return false;
    }
    
    console.log('测试提交功能...');
    
    // 检查提交方法是否存在
    if (typeof currentPage.submitFeedback === 'function') {
      console.log('✅ submitFeedback方法存在');
      
      // 检查是否可以提交
      const data = currentPage.data;
      if (data.canSubmit && !data.submitting) {
        console.log('✅ 提交条件满足，可以调用提交方法');
        console.log('⚠️ 注意：实际调用会触发真实的提交流程');
        return true;
      } else {
        console.log('❌ 提交条件不满足:');
        console.log('  - canSubmit:', data.canSubmit);
        console.log('  - submitting:', data.submitting);
        return false;
      }
    } else {
      console.log('❌ submitFeedback方法不存在');
      return false;
    }
    
  } catch (error) {
    console.error('测试提交功能失败:', error);
    return false;
  }
}

// 重置反馈页面状态
function resetFeedbackPage() {
  try {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (!currentPage.route.includes('feedback')) {
      console.log('❌ 当前不在反馈页面');
      return false;
    }
    
    console.log('重置反馈页面状态...');
    
    // 重置为初始状态
    currentPage.setData({
      selectedType: '',
      feedbackTitle: '',
      feedbackContent: '',
      contactInfo: '',
      uploadedImages: [],
      canSubmit: false,
      submitting: false,
      showSuccessModal: false,
      feedbackId: ''
    });
    
    console.log('✅ 反馈页面状态已重置');
    return true;
    
  } catch (error) {
    console.error('重置失败:', error);
    return false;
  }
}

// 将函数添加到全局作用域
window.fixFeedbackSubmitButton = fixFeedbackSubmitButton;
window.testSubmitFunction = testSubmitFunction;
window.resetFeedbackPage = resetFeedbackPage;

console.log('反馈页面提交按钮修复脚本已加载');
console.log('可用函数:');
console.log('- fixFeedbackSubmitButton() - 修复提交按钮问题');
console.log('- testSubmitFunction() - 测试提交功能');
console.log('- resetFeedbackPage() - 重置页面状态');
console.log('\n使用方法:');
console.log('1. 在反馈页面打开控制台');
console.log('2. 运行 fixFeedbackSubmitButton()');
console.log('3. 如果还有问题，运行 testSubmitFunction() 查看详情');
