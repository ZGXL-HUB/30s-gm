/**
 * AI变式题批量导入 - 快速使用示例
 * 
 * 使用方法：
 * 1. 将AI生成的JSON数组复制到下面的 questions 变量中
 * 2. 在微信开发者工具控制台中运行此脚本
 * 3. 或者先加载 batch_import_ai_variants.js，然后运行此示例
 */

// ============================================
// 步骤1：将AI生成的题目数据粘贴到这里
// ============================================

const questions = [
  // 示例：AI A生成的题目
  {
    "text": "—Have you seen the new movie? —Yes. I ____ it with my cousin yesterday. A. see B. saw C. have seen D. will see",
    "answer": "B",
    "grammarPoint": "一般过去时",
    "category": "动词时态",
    "type": "choice",
    "analysis": "题干中的时间状语yesterday（昨天）表明动作发生在过去，需用一般过去时。选项B saw为see的过去式，符合语境。A see为原形，用于现在时；C have seen为现在完成时，强调过去动作与现在的联系；D will see为一般将来时，均与yesterday矛盾。",
    "difficulty": "easy",
    "province": "云南",
    "year": 2025,
    "source": "变式题"
  },
  {
    "text": "—Did you hand in your report? —Sure. I ____ it to the teacher an hour ago. A. hand B. handed C. have handed D. am handing",
    "answer": "B",
    "grammarPoint": "一般过去时",
    "category": "动词时态",
    "type": "choice",
    "analysis": "时间状语an hour ago（一小时前）提示动作发生在过去，需用一般过去时。选项B handed为hand的过去式，正确。A hand为原形；C have handed为现在完成时；D am handing为现在进行时，均与ago矛盾。",
    "difficulty": "easy",
    "province": "云南",
    "year": 2025,
    "source": "变式题"
  }
  // ... 继续添加更多题目
];

// ============================================
// 步骤2：选择导入方式
// ============================================

// 方式1：自动选择最佳方式（推荐）
async function startImport() {
  console.log('🚀 开始导入...\n');
  
  // 确保已加载 batch_import_ai_variants.js
  if (typeof uploadAIVariants === 'undefined') {
    console.error('❌ 请先加载 batch_import_ai_variants.js 脚本');
    return;
  }
  
  const result = await uploadAIVariants(questions);
  
  if (result.success) {
    console.log(`\n🎉 导入成功！共导入 ${result.uploaded} 题`);
  } else {
    console.log(`\n❌ 导入失败: ${result.message}`);
    console.log(`   成功: ${result.uploaded} 题`);
    console.log(`   失败: ${result.failed} 题`);
  }
}

// 方式2：使用云函数导入（最稳定）
async function importViaCloudFunction() {
  if (typeof uploadViaCloudFunction === 'undefined') {
    console.error('❌ 请先加载 batch_import_ai_variants.js 脚本');
    return;
  }
  
  const result = await uploadViaCloudFunction(questions);
  console.log('导入结果:', result);
}

// 方式3：直接导入数据库（最快）
async function importDirectly() {
  if (typeof uploadDirectly === 'undefined') {
    console.error('❌ 请先加载 batch_import_ai_variants.js 脚本');
    return;
  }
  
  const result = await uploadDirectly(questions);
  console.log('导入结果:', result);
}

// ============================================
// 步骤3：在导入前可以先验证数据
// ============================================

function validateBeforeImport() {
  if (typeof analyzeQuestions === 'undefined') {
    console.error('❌ 请先加载 batch_import_ai_variants.js 脚本');
    return;
  }
  
  console.log('🔍 验证题目数据...\n');
  const stats = analyzeQuestions(questions);
  
  console.log('📊 统计结果:');
  console.log(`   总题数: ${stats.total}`);
  console.log(`   ✅ 有效: ${stats.valid}`);
  console.log(`   ❌ 无效: ${stats.invalid}`);
  console.log(`   分类: ${Object.keys(stats.byCategory).length} 个`);
  console.log(`   语法点: ${Object.keys(stats.byGrammarPoint).length} 个`);
  console.log(`   难度分布:`, stats.byDifficulty);
  console.log(`   题型分布:`, stats.byType);
  
  if (stats.invalid > 0) {
    console.log('\n⚠️ 发现无效题目，请检查后再导入');
  } else {
    console.log('\n✅ 所有题目验证通过，可以开始导入');
  }
}

// ============================================
// 使用说明
// ============================================

console.log('📝 使用说明:');
console.log('1. 将AI生成的题目数据粘贴到 questions 变量中');
console.log('2. 运行 validateBeforeImport() 验证数据');
console.log('3. 运行 startImport() 开始导入');
console.log('\n或者直接运行:');
console.log('   await startImport();\n');

// 如果直接运行此文件，自动开始导入
if (typeof wx !== 'undefined' && typeof uploadAIVariants !== 'undefined') {
  // 自动验证
  validateBeforeImport();
  
  // 提示用户确认
  console.log('\n💡 运行 startImport() 开始导入');





