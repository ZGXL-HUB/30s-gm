// 一键导入脚本 - 彻底解决重复声明问题

(function() {
  'use strict';

  console.log('🎯 一键导入脚本启动...');

  // 强制清理所有可能存在的变量和函数
  function deepClean() {
    console.log('🧹 执行深度清理...');

    // 清理全局变量
    const globalVars = [
      'myMiddleSchoolQuestions', 'myHighSchoolQuestions',
      'middleQuestions', 'highQuestions', 'questions',
      'testQuestions', 'sampleData', 'sampleQuestions',
      'data', 'questionsArray', 'batch1', 'batch2', 'batch3',
      'importData', 'preparedData', 'currentBatch'
    ];

    let cleaned = 0;
    globalVars.forEach(varName => {
      try {
        if (typeof window !== 'undefined' && window[varName] !== undefined) {
          delete window[varName];
          cleaned++;
        }
      } catch (e) {
        // 忽略清理失败
      }
    });

    // 清理 wx 对象的所有导入相关函数
    if (typeof wx !== 'undefined') {
      const wxFunctions = [
        'testUpload', 'validateQuestion', 'analyzeQuestions',
        'checkDuplicate', 'safeUpload', 'dataTest', 'consoleTest',
        'enhancedUpload', 'smartBatchUpload', 'directUpload',
        'importer', 'prepareData', 'executeImport'
      ];

      wxFunctions.forEach(funcName => {
        try {
          if (wx[funcName] !== undefined) {
            delete wx[funcName];
            cleaned++;
          }
        } catch (e) {
          // 忽略清理失败
        }
      });
    }

    console.log(`✅ 清理完成，共清理 ${cleaned} 项`);
    return cleaned;
  }

  // 执行清理
  deepClean();

  // 重新开始
  console.log('🔄 重新初始化导入环境...');

  // 检查环境
  if (typeof wx === 'undefined') {
    console.error('❌ 请在微信开发者工具控制台中运行');
    return;
  }

  // 创建全新的导入函数
  const ImportManager = {
    // 存储待导入的数据
    pendingData: null,

    // 设置导入数据
    setData: function(dataArray, schoolLevel = 'middle') {
      if (!Array.isArray(dataArray)) {
        throw new Error('数据必须是数组格式');
      }

      this.pendingData = {
        questions: dataArray,
        schoolLevel: schoolLevel,
        timestamp: new Date().toISOString(),
        count: dataArray.length
      };

      console.log(`📝 已设置 ${this.pendingData.count} 道${schoolLevel === 'middle' ? '初中' : '高中'}题目待导入`);
      return this.pendingData;
    },

    // 执行导入（需要先加载主脚本）
    execute: async function() {
      if (!this.pendingData) {
        console.error('❌ 请先调用 setData() 设置要导入的数据');
        console.log('💡 示例: importManager.setData(yourQuestionsArray, "middle")');
        return;
      }

      if (typeof wx.enhancedUpload === 'undefined') {
        console.error('❌ 请先加载 enhanced_batch_import.js 脚本');
        console.log('💡 请复制粘贴 enhanced_batch_import.js 的完整内容到控制台');
        return;
      }

      console.log('🚀 开始导入...');

      try {
        const result = await wx.enhancedUpload(
          this.pendingData.questions,
          { schoolLevel: this.pendingData.schoolLevel }
        );

        console.log('🎉 导入成功:', result);

        // 清理已导入的数据
        this.pendingData = null;

        return result;

      } catch (error) {
        console.error('❌ 导入失败:', error);
        throw error;
      }
    },

    // 获取状态
    getStatus: function() {
      if (this.pendingData) {
        return {
          ready: true,
          count: this.pendingData.count,
          schoolLevel: this.pendingData.schoolLevel,
          timestamp: this.pendingData.timestamp
        };
      } else {
        return {
          ready: false,
          message: '未设置导入数据'
        };
      }
    }
  };

  // 挂载到全局
  wx.importManager = ImportManager;

  console.log('✅ 一键导入管理器已准备就绪');
  console.log('');
  console.log('📚 使用方法:');
  console.log('');
  console.log('// 0. 复制粘贴 enhanced_batch_import.js 到控制台');
  console.log('');
  console.log('// 1. 准备数据（使用唯一变量名）');
  console.log('var batch_001 = [  // 使用不同的变量名');
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
  console.log('// 2. 设置导入数据');
  console.log('wx.importManager.setData(batch_001, "middle");  // middle=初中, high=高中');
  console.log('');
  console.log('// 3. 执行导入');
  console.log('wx.importManager.execute();');
  console.log('');
  console.log('// 4. 检查状态（可选）');
  console.log('wx.importManager.getStatus();');
  console.log('');
  console.log('💡 重要提示:');
  console.log('- 每次导入使用不同的变量名 (batch_001, batch_002, etc.)');
  console.log('- 如果遇到错误，重新运行此脚本清理环境');
  console.log('- 导入完成后会自动清理数据，避免重复导入');

})();
