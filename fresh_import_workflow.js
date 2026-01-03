// 全新导入工作流 - 每次导入前自动清理

(function() {
  'use strict';

  console.log('🚀 全新导入工作流启动...');

  // 步骤1: 深度清理
  console.log('1️⃣ 深度清理会话...');

  // 清理常见变量
  const commonVars = [
    'myMiddleSchoolQuestions', 'myHighSchoolQuestions',
    'middleQuestions', 'highQuestions', 'questions',
    'testQuestions', 'sampleData', 'sampleQuestions',
    'data', 'questionsArray', 'batch1', 'batch2', 'batch3'
  ];

  commonVars.forEach(varName => {
    try {
      if (typeof window !== 'undefined') {
        delete window[varName];
      }
      if (typeof global !== 'undefined') {
        delete global[varName];
      }
    } catch (e) {
      // 忽略清理失败
    }
  });

  // 清理 wx 对象
  if (typeof wx !== 'undefined') {
    const wxProps = [
      'testUpload', 'validateQuestion', 'analyzeQuestions',
      'checkDuplicate', 'safeUpload', 'dataTest', 'consoleTest',
      'enhancedUpload', 'smartBatchUpload', 'directUpload'
    ];

    wxProps.forEach(prop => {
      try {
        delete wx[prop];
      } catch (e) {
        // 忽略清理失败
      }
    });
  }

  console.log('✅ 会话清理完成');

  // 步骤2: 验证环境
  console.log('2️⃣ 验证小程序环境...');

  if (typeof wx === 'undefined') {
    console.error('❌ 未检测到小程序环境');
    console.log('💡 请在微信开发者工具控制台中运行此脚本');
    return;
  }

  if (typeof wx.cloud === 'undefined') {
    console.error('❌ 未检测到云开发环境');
    console.log('💡 请确保小程序已开启云开发');
    return;
  }

  console.log('✅ 环境验证通过');

  // 步骤3: 提供导入模板
  console.log('3️⃣ 导入模板已准备');

  // 创建安全的导入函数
  function createSafeImporter() {
    return {
      // 准备数据的函数
      prepareData: function(dataArray, schoolLevel = 'middle') {
        if (!Array.isArray(dataArray)) {
          throw new Error('数据必须是数组格式');
        }

        if (dataArray.length === 0) {
          throw new Error('数据数组不能为空');
        }

        console.log(`📚 准备导入 ${dataArray.length} 道${schoolLevel === 'middle' ? '初中' : '高中'}题目`);
        return {
          questions: dataArray,
          schoolLevel: schoolLevel,
          timestamp: new Date().toISOString()
        };
      },

      // 执行导入的函数
      executeImport: async function(preparedData) {
        console.log('🚀 开始执行导入...');

        try {
          // 这里需要先加载 enhanced_batch_import.js
          if (typeof wx.enhancedUpload === 'undefined') {
            throw new Error('请先加载 enhanced_batch_import.js 脚本');
          }

          const result = await wx.enhancedUpload(preparedData.questions, {
            schoolLevel: preparedData.schoolLevel
          });

          console.log('🎉 导入完成:', result);
          return result;

        } catch (error) {
          console.error('❌ 导入失败:', error);
          throw error;
        }
      }
    };
  }

  // 挂载导入器
  wx.importer = createSafeImporter();

  console.log('✅ 安全导入器已创建');
  console.log('');
  console.log('📝 完整导入流程:');
  console.log('');
  console.log('// 第一步：复制粘贴 enhanced_batch_import.js 的完整内容');
  console.log('');
  console.log('// 第二步：准备数据（使用唯一的变量名）');
  console.log('var importData20241201 = [');
  console.log('  {');
  console.log('    "text": "题目内容...",');
  console.log('    "answer": "A",');
  console.log('    "grammarPoint": "语法点",');
  console.log('    "category": "分类",');
  console.log('    "type": "choice",');
  console.log('    "difficulty": "medium",');
  console.log('    "province": "云南",');
  console.log('    "year": 2024,');
  console.log('    "source": "变式题"');
  console.log('  }');
  console.log('  // ... 更多题目');
  console.log('];');
  console.log('');
  console.log('// 第三步：准备导入数据');
  console.log('var prepared = wx.importer.prepareData(importData20241201, "middle");');
  console.log('');
  console.log('// 第四步：执行导入');
  console.log('wx.importer.executeImport(prepared).then(result => {');
  console.log('  console.log("导入成功:", result);');
  console.log('}).catch(error => {');
  console.log('  console.error("导入失败:", error);');
  console.log('});');
  console.log('');
  console.log('💡 提示：每次导入使用不同的变量名，如 importData20241201, importData20241202 等');

})();

