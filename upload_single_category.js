// 单个分类上传脚本
// 使用方法：在控制台复制粘贴并修改 categoryIndex，然后运行

(async function() {
  
  // ============ 配置区域：修改这里选择要上传的分类 ============
  const categoryIndex = 0; // 修改这个数字：0-13 选择要上传的分类
  // ==========================================================
  
  const categories = [
    { name: "介词综合", count: 28 },
    { name: "固定搭配", count: 25 },
    { name: "介词 + 名词/动名词", count: 30 },
    { name: "f/fe结尾", count: 16 },
    { name: "谓语(1)", count: 57 },
    { name: "副词修饰句子", count: 29 },
    { name: "谓语(2)", count: 19 },
    { name: "谓语(3)", count: 27 },
    { name: "谓语(4)", count: 20 },
    { name: "谓语(5)", count: 42 },
    { name: "谓语(6)", count: 16 },
    { name: "谓语(7)", count: 24 },
    { name: "谓语(8)", count: 15 },
    { name: "谓语(9)", count: 33 }
  ];
  
  if (categoryIndex < 0 || categoryIndex >= categories.length) {
    console.error(`❌ 错误：categoryIndex 必须在 0-${categories.length - 1} 之间`);
    return;
  }
  
  const currentCategory = categories[categoryIndex];
  
  console.log(`📋 准备上传第 ${categoryIndex + 1}/${categories.length} 个分类`);
  console.log(`📦 分类名称: "${currentCategory.name}"`);
  console.log(`📊 题目数量: ${currentCategory.count} 题`);
  console.log(`\n⚠️ 由于控制台限制，请使用以下方法之一：\n`);
  
  console.log(`【方法一】使用小程序云开发控制台上传（推荐）`);
  console.log(`1. 打开云开发控制台: https://console.cloud.tencent.com/tcb`);
  console.log(`2. 选择数据库 → questions 集合`);
  console.log(`3. 点击"导入" → 选择 JSON 文件`);
  console.log(`4. 导入文件: missing_categories_data.json`);
  console.log(``);
  
  console.log(`【方法二】使用云函数批量上传`);
  console.log(`运行以下命令调用云函数上传当前分类：`);
  console.log(``);
  console.log(`// 步骤1：读取数据`);
  console.log(`const fs = require('fs');`);
  console.log(`const data = JSON.parse(fs.readFileSync('./missing_categories_data.json', 'utf8'));`);
  console.log(``);
  console.log(`// 步骤2：上传 "${currentCategory.name}"`);
  console.log(`wx.cloud.callFunction({`);
  console.log(`  name: 'uploadMissingCategories',`);
  console.log(`  data: {`);
  console.log(`    category: "${currentCategory.name}",`);
  console.log(`    questions: data["${currentCategory.name}"]`);
  console.log(`  }`);
  console.log(`}).then(res => console.log('上传结果:', res));`);
  console.log(``);
  
  console.log(`【方法三】逐个调用云函数（手动）`);
  console.log(`修改下面的 categoryIndex 为 ${categoryIndex + 1} 上传下一个分类`);
  
})();

