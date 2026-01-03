// 全新数据测试脚本 - 避免变量冲突

(function() {
  'use strict';

  console.log('=== 全新数据测试脚本 ===');

  // 定义验证函数
  function validateQuestion(question, index) {
    console.log(`🔍 验证题目 ${index + 1}...`);

    // 检查必需字段
    const requiredFields = ['text', 'answer', 'grammarPoint', 'category', 'type', 'difficulty'];
    for (const field of requiredFields) {
      if (!question.hasOwnProperty(field)) {
        console.warn(`⚠️ 题目 ${index + 1} 缺少字段: ${field}`);
        return false;
      }
    }

    // 根据题目类型验证答案格式
    if (question.type === 'choice') {
      if (!['A', 'B', 'C', 'D'].includes(question.answer)) {
        console.warn(`⚠️ 题目 ${index + 1} choice类型答案无效: ${question.answer} (应为A/B/C/D)`);
        return false;
      }
    } else if (question.type === 'fill_blank') {
      // fill_blank类型允许字符串答案，包括多选项（如"who/that"）
      if (!question.answer || typeof question.answer !== 'string' || question.answer.trim() === '') {
        console.warn(`⚠️ 题目 ${index + 1} fill_blank类型答案无效: ${question.answer}`);
        return false;
      }
    } else {
      console.warn(`⚠️ 题目 ${index + 1} 未知题目类型: ${question.type}`);
      return false;
    }

    console.log(`✅ 题目 ${index + 1} 验证通过`);
    return true;
  }

  // 定义测试上传函数
  function testUpload(data) {
    console.log(`📤 准备测试上传 ${data.length} 道题目`);

    if (!Array.isArray(data) || data.length === 0) {
      console.error('❌ 数据格式错误或为空');
      return { success: false, message: '数据格式错误' };
    }

    let validCount = 0;
    let invalidCount = 0;

    // 验证每道题目
    for (let i = 0; i < data.length; i++) {
      if (validateQuestion(data[i], i)) {
        validCount++;
      } else {
        invalidCount++;
      }
    }

    const result = {
      success: invalidCount === 0,
      total: data.length,
      valid: validCount,
      invalid: invalidCount,
      message: invalidCount === 0 ? '所有题目验证通过' : `${invalidCount} 道题目验证失败`
    };

    console.log(`📊 验证结果:`, result);
    return result;
  }

  // 挂载函数到全局
  if (typeof wx !== 'undefined') {
    wx.dataTest = {
      validateQuestion: validateQuestion,
      testUpload: testUpload
    };
    console.log('✅ 数据测试函数已挂载到 wx.dataTest');
  } else {
    console.log('❌ 未检测到小程序环境');
  }

  console.log('🎯 数据测试脚本加载完成！');
  console.log('📝 使用方法:');
  console.log('   // 定义数据');
  console.log('   var myQuestions = [题目数组];');
  console.log('   // 测试上传');
  console.log('   wx.dataTest.testUpload(myQuestions);');

})();
