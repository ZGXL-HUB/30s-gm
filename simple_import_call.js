// 简化的导入调用脚本 - 避免 await 语法问题

(function() {
  'use strict';

  console.log('=== 简化的导入调用脚本 ===');

  // 检查是否已加载增强版导入脚本
  if (typeof wx === 'undefined' || typeof wx.enhancedUpload === 'undefined') {
    console.error('❌ 请先加载 enhanced_batch_import.js 脚本');
    console.log('💡 请先复制粘贴 enhanced_batch_import.js 的完整内容到控制台');
    return;
  }

  console.log('✅ 检测到增强版导入脚本已加载');

  // 创建同步调用函数
  function safeUpload(questions, options = {}) {
    console.log('🚀 开始安全上传...');

    // 使用 Promise 包装 async 函数
    wx.enhancedUpload(questions, options)
      .then(result => {
        console.log('🎉 上传完成:', result);
      })
      .catch(error => {
        console.error('❌ 上传失败:', error);
      });

    console.log('📝 上传请求已发送，请等待结果...');
  }

  // 挂载到全局
  wx.safeUpload = safeUpload;

  console.log('✅ 安全上传函数已准备');
  console.log('📝 使用方法:');

  console.log('// 初中题目上传');
  console.log('var myMiddleQuestions = [/* 题目数组 */];');
  console.log('wx.safeUpload(myMiddleQuestions, {schoolLevel: "middle"});');

  console.log('');
  console.log('// 高中题目上传');
  console.log('var myHighQuestions = [/* 题目数组 */];');
  console.log('wx.safeUpload(myHighQuestions, {schoolLevel: "high"});');

  console.log('');
  console.log('💡 提示：使用 var 而不是 const 来声明变量，避免重复声明错误');

})();
