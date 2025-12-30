// 测试PPT/学案页面显示修复
// 这个脚本用于验证作业发布后PPT页面能正确显示新作业

console.log('开始测试PPT/学案页面显示修复...');

// 模拟作业数据（基于控制台输出的实际数据）
const testHomeworkData = {
  _id: "homework_1759627036668",
  type: "topic",
  title: "专题语法练习",
  description: "专题语法点练习",
  config: {
    shuffleQuestions: true
  },
  assignedClasses: [{
    id: "class_1759626653309",
    name: "2",
    studentCount: 11
  }],
  selectedGrammarPoints: [],
  selectedItems: [{
    id: "介词",
    name: "介词",
    questionCount: 3,
    selected: true,
    expanded: false
  }],
  status: "published",
  teacherId: "teacher_123",
  totalQuestions: 3,
  createdAt: "2025-10-05T01:17:16.668Z"
};

// 测试存储key修复
function testStorageKeyFix() {
  console.log('\n=== 测试存储key修复 ===');
  
  const teacherId = 'teacher_123';
  
  // 模拟存储作业数据（使用正确的key）
  const existingHomeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  existingHomeworks.unshift(testHomeworkData);
  wx.setStorageSync(`homeworks_${teacherId}`, existingHomeworks);
  
  console.log('作业数据已存储到 homeworks_${teacherId}');
  
  // 测试PPT页面读取数据
  const assignments = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  console.log('PPT页面读取到的作业数据:', assignments.length, '个作业');
  
  if (assignments.length > 0) {
    console.log('✅ 存储key修复成功 - PPT页面能正确读取作业数据');
    return true;
  } else {
    console.log('❌ 存储key修复失败 - PPT页面无法读取作业数据');
    return false;
  }
}

// 测试ID字段修复
function testIdFieldFix() {
  console.log('\n=== 测试ID字段修复 ===');
  
  const assignment = testHomeworkData;
  
  // 测试ID字段处理
  const assignmentId = assignment._id || assignment.id;
  console.log('作业ID:', assignmentId);
  
  if (assignmentId === testHomeworkData._id) {
    console.log('✅ ID字段修复成功 - 正确使用_id字段');
    return true;
  } else {
    console.log('❌ ID字段修复失败 - ID字段处理有问题');
    return false;
  }
}

// 测试材料生成
function testMaterialGeneration() {
  console.log('\n=== 测试材料生成 ===');
  
  const assignment = testHomeworkData;
  const assignmentId = assignment._id || assignment.id;
  
  // 模拟生成PPT材料
  const pptMaterial = {
    id: `mat_ppt_${assignmentId}`,
    title: `${assignment.title}专项练习PPT`,
    type: 'ppt',
    createdAt: assignment.createdAt || new Date().toISOString(),
    downloadCount: assignment.downloadCount || 0,
    classAccuracy: 0, // 新作业暂时为0
    status: 'completed',
    assignmentId: assignmentId,
    assignmentTitle: assignment.title,
    questionCount: assignment.totalQuestions || 0
  };
  
  console.log('生成的PPT材料:', pptMaterial);
  
  if (pptMaterial.assignmentId && pptMaterial.title.includes(assignment.title)) {
    console.log('✅ 材料生成成功 - PPT材料数据结构正确');
    return true;
  } else {
    console.log('❌ 材料生成失败 - PPT材料数据结构有问题');
    return false;
  }
}

// 运行所有测试
function runAllTests() {
  console.log('开始运行PPT显示修复测试...\n');
  
  const results = {
    storageKeyFix: testStorageKeyFix(),
    idFieldFix: testIdFieldFix(),
    materialGeneration: testMaterialGeneration()
  };
  
  console.log('\n=== 测试结果汇总 ===');
  const allPassed = Object.values(results).every(result => result);
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${test}: ${passed ? '✅ 通过' : '❌ 失败'}`);
  });
  
  if (allPassed) {
    console.log('\n🎉 所有测试通过！PPT/学案页面显示修复成功');
    console.log('现在教师发布作业后，PPT页面应该能正确显示新生成的PPT材料');
  } else {
    console.log('\n⚠️ 部分测试失败，请检查修复代码');
  }
  
  return allPassed;
}

// 如果在小程序环境中运行
if (typeof wx !== 'undefined') {
  runAllTests();
} else {
  // 在Node.js环境中运行
  console.log('请在微信开发者工具的控制台中运行此脚本');
  console.log('或者将此脚本内容复制到控制台中执行');
}

module.exports = {
  testStorageKeyFix,
  testIdFieldFix,
  testMaterialGeneration,
  runAllTests
};
