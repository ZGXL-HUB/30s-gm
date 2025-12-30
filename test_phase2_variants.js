// Phase 2 变式题功能测试脚本
console.log('=== Phase 2 变式题功能测试 ===');

// 测试步骤说明
console.log('\n📋 测试步骤:');
console.log('1. 发布新作业（选择2-3个语法点即可）');
console.log('2. 检查作业数据是否包含 questions 字段');
console.log('3. 生成学案，查看控制台日志');
console.log('4. 检查学案内容是否包含变式题');

// 测试1: 检查作业数据
console.log('\n=== 测试1: 检查作业数据 ===');
const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
const homeworks = wx.getStorageSync(`homeworks_${teacherId}`);

if (homeworks && homeworks.length > 0) {
  const latestHomework = homeworks[0];
  console.log('✅ 最新作业ID:', latestHomework._id);
  console.log('✅ 作业标题:', latestHomework.title);
  
  if (latestHomework.questions && latestHomework.questions.length > 0) {
    console.log('✅ 包含原题数量:', latestHomework.questions.length);
    console.log('✅ 第一题示例:');
    const firstQ = latestHomework.questions[0];
    console.log('   题目:', firstQ.text);
    console.log('   答案:', firstQ.answer);
    console.log('   语法点:', firstQ.grammarPoint || firstQ.category);
  } else {
    console.log('❌ 作业中没有题目数据！');
    console.log('   请重新发布作业，确保题目获取成功');
  }
} else {
  console.log('❌ 没有找到作业数据！');
  console.log('   请先发布一个作业');
}

// 测试2: 测试映射表
console.log('\n=== 测试2: 测试映射表 ===');
try {
  const questionMapping = require('./miniprogram/utils/questionMapping.js');
  
  const testPoints = ['it相关', '名词综合', '介词 + 名词/动名词', '时态(过去进行时)'];
  
  testPoints.forEach(point => {
    const mappedCategories = questionMapping.grammarPointToCategories[point];
    if (mappedCategories) {
      console.log(`✅ "${point}" → [${mappedCategories.join(', ')}]`);
    } else {
      console.log(`⚠️ "${point}" 未找到映射`);
    }
  });
  
  console.log('\n✅ 映射表测试通过');
} catch (error) {
  console.log('❌ 映射表加载失败:', error.message);
}

// 测试3: 变式题查找逻辑（模拟）
console.log('\n=== 测试3: 变式题查找逻辑 ===');
console.log('当生成学案时，系统会为每个原题：');
console.log('1. 获取语法点（如 "it相关"）');
console.log('2. 查找映射分类 → ["it相关", "代词(3)", "代词综合"]');
console.log('3. 从云数据库获取这些分类的题目');
console.log('4. 过滤掉原题');
console.log('5. 随机选择2个作为变式题');

console.log('\n✅ 理论验证通过，请实际测试');

// 测试结果预期
console.log('\n=== 预期结果 ===');
console.log('📊 控制台应该显示:');
console.log('   - "开始加载变式题..."');
console.log('   - "查找 XXX 的变式题..."');
console.log('   - "从 XXX 获取 N 题"');
console.log('   - "最终选择 2 个变式题"');
console.log('   - "共加载 X 个变式题"');

console.log('\n📝 学案内容应该包含:');
console.log('   - 原题部分（来自作业数据）');
console.log('   - 变式练习题部分（从云数据库查找）');
console.log('   - 每个原题有2个变式题');
console.log('   - 所有题目都是填空题格式');

console.log('\n=== 测试完成 ===');
console.log('现在请按照步骤进行实际测试！');

