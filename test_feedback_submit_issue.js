/**
 * 测试反馈页面提交问题
 * 在微信小程序控制台运行此脚本
 */

// 测试反馈页面提交状态
async function testFeedbackSubmitIssue() {
  try {
    console.log('开始测试反馈页面提交问题...');
    console.log('=====================================');
    
    // 1. 检查当前页面
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    console.log('当前页面:', currentPage.route);
    
    if (!currentPage.route.includes('feedback')) {
      console.log('❌ 当前不在反馈页面');
      console.log('请先导航到反馈页面');
      return { success: false, message: '当前不在反馈页面' };
    }
    
    console.log('✅ 当前在反馈页面');
    
    // 2. 检查页面数据
    const pageData = currentPage.data;
    console.log('\n页面数据检查:');
    console.log('selectedType:', pageData.selectedType);
    console.log('feedbackContent:', pageData.feedbackContent);
    console.log('feedbackContent长度:', pageData.feedbackContent ? pageData.feedbackContent.length : 0);
    console.log('canSubmit:', pageData.canSubmit);
    console.log('submitting:', pageData.submitting);
    
    // 3. 手动检查提交条件
    const hasType = !!pageData.selectedType;
    const hasContent = pageData.feedbackContent && pageData.feedbackContent.trim().length > 0;
    const shouldBeEnabled = hasType && hasContent;
    
    console.log('\n提交条件检查:');
    console.log('hasType:', hasType);
    console.log('hasContent:', hasContent);
    console.log('shouldBeEnabled:', shouldBeEnabled);
    console.log('实际canSubmit:', pageData.canSubmit);
    
    // 4. 如果条件不满足，尝试修复
    if (!shouldBeEnabled) {
      console.log('\n尝试修复提交条件...');
      
      // 如果没有选择类型，选择技术问题
      if (!hasType) {
        console.log('设置反馈类型为technical');
        currentPage.setData({ selectedType: 'technical' });
      }
      
      // 如果没有内容，设置测试内容
      if (!hasContent) {
        console.log('设置测试内容');
        currentPage.setData({ 
          feedbackContent: '测试反馈内容 - 班级解散申请测试' 
        });
      }
      
      // 手动调用检查提交状态
      if (typeof currentPage.checkSubmitStatus === 'function') {
        currentPage.checkSubmitStatus();
        console.log('✅ 已调用checkSubmitStatus方法');
      } else {
        console.log('❌ checkSubmitStatus方法不存在');
      }
      
      // 重新检查状态
      setTimeout(() => {
        const newData = currentPage.data;
        console.log('\n修复后的状态:');
        console.log('selectedType:', newData.selectedType);
        console.log('feedbackContent:', newData.feedbackContent);
        console.log('canSubmit:', newData.canSubmit);
      }, 100);
    }
    
    // 5. 检查提交方法是否存在
    console.log('\n方法检查:');
    console.log('submitFeedback方法存在:', typeof currentPage.submitFeedback === 'function');
    console.log('checkSubmitStatus方法存在:', typeof currentPage.checkSubmitStatus === 'function');
    
    // 6. 如果仍然无法提交，尝试手动触发
    if (shouldBeEnabled && !pageData.canSubmit) {
      console.log('\n⚠️ 条件满足但按钮仍然禁用，尝试强制启用');
      currentPage.setData({ canSubmit: true });
      console.log('✅ 已强制启用提交按钮');
    }
    
    console.log('\n测试完成！');
    console.log('=====================================');
    
    return {
      success: true,
      data: {
        hasType: hasType,
        hasContent: hasContent,
        canSubmit: pageData.canSubmit,
        shouldBeEnabled: shouldBeEnabled
      }
    };
    
  } catch (error) {
    console.error('测试失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 手动启用提交按钮
function forceEnableSubmit() {
  try {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (currentPage.route.includes('feedback')) {
      currentPage.setData({ 
        canSubmit: true,
        selectedType: currentPage.data.selectedType || 'technical',
        feedbackContent: currentPage.data.feedbackContent || '测试内容'
      });
      console.log('✅ 已强制启用提交按钮');
      return true;
    } else {
      console.log('❌ 当前不在反馈页面');
      return false;
    }
  } catch (error) {
    console.error('强制启用失败:', error);
    return false;
  }
}

// 检查页面数据完整性
function checkPageDataIntegrity() {
  try {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (!currentPage.route.includes('feedback')) {
      console.log('❌ 当前不在反馈页面');
      return false;
    }
    
    const data = currentPage.data;
    console.log('页面数据完整性检查:');
    console.log('- selectedType:', data.selectedType || '未设置');
    console.log('- feedbackContent:', data.feedbackContent || '未设置');
    console.log('- feedbackTitle:', data.feedbackTitle || '未设置');
    console.log('- contactInfo:', data.contactInfo || '未设置');
    console.log('- canSubmit:', data.canSubmit);
    console.log('- submitting:', data.submitting);
    
    return true;
  } catch (error) {
    console.error('检查失败:', error);
    return false;
  }
}

// 将函数添加到全局作用域
window.testFeedbackSubmitIssue = testFeedbackSubmitIssue;
window.forceEnableSubmit = forceEnableSubmit;
window.checkPageDataIntegrity = checkPageDataIntegrity;

console.log('反馈页面提交问题测试脚本已加载');
console.log('可用函数:');
console.log('- testFeedbackSubmitIssue() - 测试提交问题');
console.log('- forceEnableSubmit() - 强制启用提交按钮');
console.log('- checkPageDataIntegrity() - 检查页面数据完整性');
