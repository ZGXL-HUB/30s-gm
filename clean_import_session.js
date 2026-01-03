// 清理导入会话脚本 - 解决重复声明问题

(function() {
  'use strict';

  console.log('🧹 清理导入会话...');

  // 定义需要清理的变量列表
  const variablesToClean = [
    'myMiddleSchoolQuestions',
    'myHighSchoolQuestions',
    'middleQuestions',
    'highQuestions',
    'questions',
    'testQuestions',
    'sampleData',
    'sampleQuestions'
  ];

  // 尝试清理全局变量
  let cleanedCount = 0;
  variablesToClean.forEach(varName => {
    try {
      if (typeof window !== 'undefined' && window[varName]) {
        delete window[varName];
        cleanedCount++;
        console.log(`✅ 已清理变量: ${varName}`);
      }
    } catch (e) {
      // 忽略清理失败的变量
    }
  });

  // 清理 wx 对象上的测试函数
  if (typeof wx !== 'undefined') {
    const wxFunctionsToClean = [
      'testUpload',
      'validateQuestion',
      'analyzeQuestions',
      'checkDuplicate',
      'safeUpload',
      'dataTest',
      'consoleTest'
    ];

    wxFunctionsToClean.forEach(funcName => {
      try {
        if (wx[funcName]) {
          delete wx[funcName];
          cleanedCount++;
          console.log(`✅ 已清理 wx 函数: ${funcName}`);
        }
      } catch (e) {
        // 忽略清理失败的函数
      }
    });
  }

  console.log(`🎉 会话清理完成，共清理 ${cleanedCount} 个项目`);
  console.log('📝 现在可以重新开始导入流程了');

  // 显示重新开始的步骤
  console.log('');
  console.log('🔄 重新开始导入的步骤:');
  console.log('1️⃣ 复制粘贴 enhanced_batch_import.js');
  console.log('2️⃣ 复制粘贴 simple_import_call.js');
  console.log('3️⃣ 准备数据: var myQuestions = [/* 题目数组 */];');
  console.log('4️⃣ 执行导入: wx.safeUpload(myQuestions, {schoolLevel: "middle"});');

})();
