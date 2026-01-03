// 最小化测试脚本 - 一步步排查问题

(function() {
  'use strict';

  console.log('🎯 最小化测试脚本');

  // 步骤1: 检查环境
  console.log('1️⃣ 检查小程序环境...');
  if (typeof wx === 'undefined') {
    console.error('❌ 没有检测到 wx 对象');
    return;
  }
  console.log('✅ wx 对象存在');

  // 步骤2: 检查云开发
  console.log('2️⃣ 检查云开发...');
  if (!wx.cloud) {
    console.error('❌ 没有检测到云开发');
    return;
  }
  console.log('✅ 云开发可用');

  // 步骤3: 检查导入函数
  console.log('3️⃣ 检查导入函数...');
  if (!wx.enhancedUpload) {
    console.error('❌ 没有检测到 enhancedUpload 函数');
    console.log('💡 请先加载 enhanced_batch_import.js');
    return;
  }
  console.log('✅ enhancedUpload 函数存在');

  // 步骤4: 测试最小数据集
  console.log('4️⃣ 测试最小数据集...');

  // 使用最简单的数据结构
  var testData = [
    {
      text: "Test question A. option1 B. option2 C. option3 D. option4",
      answer: "A",
      grammarPoint: "测试语法点",
      category: "测试分类",
      type: "choice",
      analysis: "测试解析",
      difficulty: "easy",
      province: "云南",
      year: 2024,
      source: "测试"
    }
  ];

  console.log('✅ 测试数据创建成功，包含', testData.length, '道题目');

  // 步骤5: 验证数据格式
  console.log('5️⃣ 验证数据格式...');
  try {
    var validation = wx.analyzeQuestions(testData);
    console.log('✅ 数据验证通过:', validation);
  } catch (error) {
    console.error('❌ 数据验证失败:', error);
    return;
  }

  // 步骤6: 尝试上传（同步方式）
  console.log('6️⃣ 尝试同步上传...');

  // 创建同步上传函数
  function syncUpload(data, options) {
    console.log('🚀 开始同步上传测试...');

    // 直接调用，不使用 await
    wx.enhancedUpload(data, options)
      .then(function(result) {
        console.log('🎉 上传成功:', result);
      })
      .catch(function(error) {
        console.error('❌ 上传失败:', error);
      });

    console.log('📤 上传请求已发送');
  }

  // 挂载同步函数
  wx.syncUpload = syncUpload;

  console.log('✅ 同步上传函数已准备');
  console.log('');
  console.log('🧪 测试命令:');
  console.log('wx.syncUpload(testData, {schoolLevel: "middle"})');
  console.log('');
  console.log('📊 当前状态:');
  console.log('- 环境检查: ✅');
  console.log('- 云开发: ✅');
  console.log('- 导入函数: ✅');
  console.log('- 测试数据: ✅');
  console.log('- 数据验证: ✅');
  console.log('- 同步上传: ✅');

})();
