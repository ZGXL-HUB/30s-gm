// 使用示例 - 如何在微信开发者工具控制台中正确执行

/*
=== 正确的使用步骤 ===

第一步：清除控制台历史
在微信开发者工具控制台中按 Ctrl+L 清除所有历史记录

第二步：运行基础测试脚本
复制粘贴 fresh_console_test.js 的内容到控制台，执行

第三步：运行数据测试脚本
复制粘贴 fresh_data_test.js 的内容到控制台，执行

第四步：准备测试数据
*/

// 示例数据 - 复制到控制台使用
var sampleData = [
  {
    "text": "English ____ by millions of students in middle schools across the country these days. A. learn  B. learned  C. is learned  D. was learned",
    "answer": "C",
    "grammarPoint": "一般时态的被动语态",
    "category": "被动语态",
    "type": "choice",
    "analysis": "本题考查一般现在时的被动语态，难度中等。主语English与动词learn是被动关系（英语被学习），时间状语'these days'表示当前的情况，需用一般现在时的被动语态，结构为'am/is/are+过去分词'，learn的过去分词是learned，故正确答案为C。",
    "difficulty": "medium",
    "province": "云南",
    "year": 2024,
    "source": "变式题"
  },
  {
    "text": "Yoga ____ by more and more people for keeping healthy these days. A. practice  B. practiced  C. is practiced  D. was practiced",
    "answer": "C",
    "grammarPoint": "一般时态的被动语态",
    "category": "被动语态",
    "type": "choice",
    "analysis": "本题考查一般现在时被动语态的用法，难度中等。主语Yoga与动词practice是被动关系（瑜伽被练习），'these days'提示时态为一般现在时，被动语态结构为'am/is/are+过去分词'，practice的过去分词是practiced，因此选C。",
    "difficulty": "medium",
    "province": "云南",
    "year": 2024,
    "source": "变式题"
  }
];

/*
第五步：执行测试
在控制台中运行：

// 测试数据格式
wx.dataTest.testUpload(sampleData);

// 或者测试单个题目
wx.dataTest.validateQuestion(sampleData[0], 0);

第六步：如果测试通过，使用完整导入脚本
复制粘贴 enhanced_batch_import.js 的内容，然后运行：

// 初中题目导入
await enhancedUpload(sampleData, {schoolLevel: "middle"});

// 或者高中题目导入
await enhancedUpload(sampleData, {schoolLevel: "high"});
*/

/*
=== 故障排除 ===

如果仍然遇到 "Identifier has already been declared" 错误：

1. 完全重启微信开发者工具
2. 或者在新标签页中打开控制台
3. 或者使用不同的变量名

如果遇到其他错误，请告诉我具体的错误信息。
*/

console.log('📚 使用示例已准备，请按照上述步骤执行');




