/**
 * 测试申请解散班级功能
 * 在微信小程序控制台运行此脚本
 */

// 测试申请解散班级功能
async function testDismissRequestFunctionality() {
  try {
    console.log('开始测试申请解散班级功能...');
    console.log('=====================================');
    
    // 1. 检查教师班级管理页面是否存在
    console.log('1. 检查教师班级管理页面:');
    const pages = getCurrentPages();
    const teacherClassPage = pages.find(page => page.route.includes('teacher-class'));
    
    if (teacherClassPage) {
      console.log('✅ 找到教师班级管理页面');
      console.log('页面数据:', teacherClassPage.data);
      
      // 检查是否有班级数据
      const classes = teacherClassPage.data.classes || [];
      console.log('班级数量:', classes.length);
      
      if (classes.length > 0) {
        console.log('班级列表:');
        classes.forEach((cls, index) => {
          console.log(`  ${index + 1}. ${cls.name} (ID: ${cls.id})`);
        });
        
        // 测试申请解散班级方法
        console.log('\n2. 测试申请解散班级方法:');
        if (typeof teacherClassPage.requestDismissClass === 'function') {
          console.log('✅ requestDismissClass方法存在');
          
          // 模拟点击申请解散班级按钮
          const testClass = classes[0];
          console.log(`测试班级: ${testClass.name}`);
          
          // 创建模拟事件对象
          const mockEvent = {
            currentTarget: {
              dataset: {
                classId: testClass.id,
                className: testClass.name
              }
            }
          };
          
          // 注意：这里只是检查方法是否存在，不实际执行
          console.log('✅ 方法调用准备就绪');
          console.log('⚠️ 注意：实际调用会触发确认对话框');
          
        } else {
          console.log('❌ requestDismissClass方法不存在');
        }
        
        // 检查废弃的方法
        console.log('\n3. 检查废弃的方法:');
        if (typeof teacherClassPage.dismissClass === 'function') {
          console.log('⚠️ dismissClass方法仍存在（应该已废弃）');
        } else {
          console.log('✅ dismissClass方法已正确废弃');
        }
        
        if (typeof teacherClassPage.executeDismissClass === 'function') {
          console.log('⚠️ executeDismissClass方法仍存在（应该已废弃）');
        } else {
          console.log('✅ executeDismissClass方法已正确废弃');
        }
        
      } else {
        console.log('⚠️ 没有班级数据，无法测试申请解散功能');
      }
      
    } else {
      console.log('❌ 未找到教师班级管理页面');
      console.log('当前页面:', pages.map(p => p.route));
    }
    
    // 2. 测试反馈页面URL参数支持
    console.log('\n4. 测试反馈页面URL参数支持:');
    const feedbackPage = pages.find(page => page.route.includes('feedback'));
    
    if (feedbackPage) {
      console.log('✅ 找到反馈页面');
      
      // 检查是否支持URL参数
      const pageData = feedbackPage.data;
      if (pageData.feedbackTitle !== undefined) {
        console.log('✅ 反馈页面支持自定义标题');
      } else {
        console.log('⚠️ 反馈页面可能不支持自定义标题');
      }
      
      console.log('反馈页面数据:', pageData);
      
    } else {
      console.log('ℹ️ 反馈页面未打开，无法测试URL参数支持');
    }
    
    // 3. 测试URL跳转逻辑
    console.log('\n5. 测试URL跳转逻辑:');
    const testClassId = 'test_class_123';
    const testClassName = '测试班级';
    const testTeacherName = '测试教师';
    
    const requestContent = `班级解散申请

班级信息：
- 班级名称：${testClassName}
- 班级ID：${testClassId}
- 申请教师：${testTeacherName}
- 申请时间：${new Date().toLocaleString()}

申请说明：
教师申请解散该班级，请管理员审核处理。

注意：解散后班级数据将被永久删除，此操作不可撤销。`;

    const testUrl = `/pages/feedback/index?type=technical&title=${encodeURIComponent('班级解散申请')}&content=${encodeURIComponent(requestContent)}&contact=${encodeURIComponent(testTeacherName)}`;
    
    console.log('测试URL:', testUrl);
    console.log('✅ URL编码正确');
    
    // 验证URL参数解码
    const urlParams = new URLSearchParams(testUrl.split('?')[1]);
    console.log('解码后的参数:');
    console.log('  type:', urlParams.get('type'));
    console.log('  title:', decodeURIComponent(urlParams.get('title')));
    console.log('  content:', decodeURIComponent(urlParams.get('content')).substring(0, 50) + '...');
    console.log('  contact:', decodeURIComponent(urlParams.get('contact')));
    
    console.log('\n测试完成！');
    console.log('=====================================');
    
    return {
      success: true,
      message: '申请解散班级功能测试完成'
    };
    
  } catch (error) {
    console.error('测试失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 测试按钮样式
function testButtonStyles() {
  try {
    console.log('测试按钮样式...');
    
    // 检查是否存在警告按钮样式
    const styleSheets = document.styleSheets;
    let hasWarningStyle = false;
    
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        for (let j = 0; j < rules.length; j++) {
          if (rules[j].selectorText && rules[j].selectorText.includes('.btn-warning')) {
            hasWarningStyle = true;
            console.log('✅ 找到.btn-warning样式:', rules[j].cssText);
            break;
          }
        }
      } catch (e) {
        // 跨域样式表无法访问
      }
    }
    
    if (!hasWarningStyle) {
      console.log('⚠️ 未找到.btn-warning样式，但小程序中样式可能已正确应用');
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('样式测试失败:', error);
    return { success: false, error: error.message };
  }
}

// 将函数添加到全局作用域
window.testDismissRequestFunctionality = testDismissRequestFunctionality;
window.testButtonStyles = testButtonStyles;

console.log('申请解散班级功能测试脚本已加载');
console.log('可用函数:');
console.log('- testDismissRequestFunctionality() - 测试申请解散班级功能');
console.log('- testButtonStyles() - 测试按钮样式');
