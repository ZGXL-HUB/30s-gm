/**
 * 简单的反馈测试
 * 在微信小程序控制台运行此脚本
 */

// 简单测试云函数调用
async function simpleTest() {
  try {
    console.log('开始简单测试...');
    
    // 测试1: 最基本的调用
    console.log('测试1: 最基本的调用');
    const result1 = await wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'submitFeedback',
        data: {
          feedbackId: 'test123',
          type: 'technical',
          title: '测试',
          content: '测试内容',
          contact: '',
          images: []
        }
      }
    });
    console.log('结果1:', result1);
    
    // 测试2: 检查action参数
    console.log('测试2: 检查action参数');
    const result2 = await wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'submitFeedback'
      }
    });
    console.log('结果2:', result2);
    
    // 测试3: 检查参数格式
    console.log('测试3: 检查参数格式');
    const result3 = await wx.cloud.callFunction({
      name: 'feedbackManager',
      data: 'submitFeedback'
    });
    console.log('结果3:', result3);
    
  } catch (error) {
    console.log('测试出错:', error);
  }
}

// 检查云函数是否支持test action
async function testTestAction() {
  try {
    console.log('测试test action...');
    const result = await wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'test'
      }
    });
    console.log('test action结果:', result);
  } catch (error) {
    console.log('test action错误:', error);
  }
}

// 手动构造正确的提交数据
async function manualSubmit() {
  try {
    console.log('手动提交反馈...');
    
    const feedbackData = {
      feedbackId: 'FB' + Date.now().toString().slice(-8),
      type: 'technical',
      title: '班级解散申请',
      content: '班级解散申请\n\n班级信息：\n- 班级名称：高一十二班\n- 班级ID：class 1759717845338\n- 申请教师：教师\n- 申请时间：2025-10-06 11:05:34\n\n申请说明：\n教师申请解散该班级，请管理员审核处理。\n\n注意：解散后班级数据将被永久删除，此操作不可撤销。',
      contact: '教师',
      images: []
    };
    
    console.log('提交数据:', feedbackData);
    
    const result = await wx.cloud.callFunction({
      name: 'feedbackManager',
      data: {
        action: 'submitFeedback',
        data: feedbackData
      }
    });
    
    console.log('提交结果:', result);
    
    if (result.result.success) {
      console.log('✅ 提交成功！');
    } else {
      console.log('❌ 提交失败:', result.result.message);
    }
    
  } catch (error) {
    console.log('手动提交出错:', error);
  }
}

// 将函数添加到全局作用域
window.simpleTest = simpleTest;
window.testTestAction = testTestAction;
window.manualSubmit = manualSubmit;

console.log('简单反馈测试脚本已加载');
console.log('可用函数:');
console.log('- simpleTest() - 简单测试云函数调用');
console.log('- testTestAction() - 测试test action');
console.log('- manualSubmit() - 手动提交反馈');
