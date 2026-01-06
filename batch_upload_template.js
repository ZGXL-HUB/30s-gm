// 批量上传模板 - 用于导入您的初中习题

(function() {
  'use strict';

  console.log('📚 批量上传模板已准备');
  console.log('=====================================');

  // 示例数据结构 - 替换为您的数据
  var batch_template = [
    {
      "text": "—Is this Tom's notebook? —Yes, it's ____. Look, there's a 'T' on it. A. he  B. his  C. him  D. himself",
      "answer": "B",
      "grammarPoint": "物主代词",
      "category": "代词",
      "type": "choice",
      "analysis": "本题考查物主代词的基础用法，难度简单。题干空格后无名词，需用名词性物主代词指代'Tom's notebook'，his既可以是形容词性物主代词（后接名词），也可作名词性物主代词，相当于his notebook，符合题意。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    }
    // 在这里添加更多题目...
  ];

  // 批量上传函数
  function uploadBatch(batchData, batchName, schoolLevel = 'middle') {
    console.log(`🚀 开始上传批次: ${batchName}`);
    console.log(`📊 批次包含: ${batchData.length} 道题目`);

    if (!Array.isArray(batchData) || batchData.length === 0) {
      console.error('❌ 批次数据无效');
      return;
    }

    // 验证数据
    let validCount = 0;
    let invalidCount = 0;

    batchData.forEach((item, index) => {
      const requiredFields = ['text', 'answer', 'grammarPoint', 'category', 'type', 'difficulty'];
      let isValid = true;

      requiredFields.forEach(field => {
        if (!item.hasOwnProperty(field)) {
          console.warn(`⚠️ 题目 ${index + 1} 缺少字段: ${field}`);
          isValid = false;
        }
      });

      if (isValid) {
        validCount++;
      } else {
        invalidCount++;
      }
    });

    if (invalidCount > 0) {
      console.error(`❌ 批次 ${batchName} 有 ${invalidCount} 道题目验证失败，请修复后再上传`);
      return;
    }

    console.log(`✅ 批次 ${batchName} 验证通过 (${validCount} 道有效题目)`);

    // 执行上传
    wx.syncUpload(batchData, {schoolLevel: schoolLevel})
      .then(result => {
        console.log(`🎉 批次 ${batchName} 上传完成:`, result);
      })
      .catch(error => {
        console.error(`❌ 批次 ${batchName} 上传失败:`, error);
      });
  }

  // 挂载函数
  wx.uploadBatch = uploadBatch;

  console.log('✅ 批量上传函数已准备');
  console.log('');
  console.log('📝 使用方法:');
  console.log('');
  console.log('// 1. 定义您的批次数据（使用不同的变量名）');
  console.log('var myBatch_001 = [/* 您的题目数组 */];');
  console.log('');
  console.log('// 2. 上传批次');
  console.log('wx.uploadBatch(myBatch_001, "初中语法题_第一批", "middle");');
  console.log('');
  console.log('// 3. 继续下一批');
  console.log('var myBatch_002 = [/* 下一批题目 */];');
  console.log('wx.uploadBatch(myBatch_002, "初中语法题_第二批", "middle");');
  console.log('');
  console.log('💡 提示:');
  console.log('- 每批建议 50-100 道题目');
  console.log('- 每次使用不同的变量名和批次名称');
  console.log('- 可以分多次运行，逐步导入');

})();


