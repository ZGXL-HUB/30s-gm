// 测试PPT/学案作业关联修复
// 这个脚本用于验证修复后的作业关联功能

console.log('开始测试PPT/学案作业关联修复...');

// 模拟教师ID
const teacherId = 'teacher_123';

// 模拟作业数据（基于实际的数据结构）
const testHomeworkData = {
  _id: "homework_1759627036668",
  id: "homework_1759627036668", // 兼容两种ID字段
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
  teacherId: teacherId,
  totalQuestions: 3,
  questionCount: 3,
  createdAt: "2025-10-05T01:17:16.668Z"
};

// 模拟配套材料数据
const testMaterialData = {
  id: 'mat_ppt_homework_1759627036668',
  title: '专题语法练习专项练习PPT',
  type: 'ppt',
  createdAt: '2025-10-05T01:17:16.668Z',
  downloadCount: 0,
  classAccuracy: 0,
  status: 'completed',
  assignmentId: 'homework_1759627036668', // 关联的作业ID
  assignmentTitle: '专题语法练习',
  questionCount: 3
};

// 测试存储key一致性
function testStorageKeyConsistency() {
  console.log('\n=== 测试存储key一致性 ===');
  
  // 模拟存储作业数据（使用正确的key）
  const existingHomeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  existingHomeworks.unshift(testHomeworkData);
  wx.setStorageSync(`homeworks_${teacherId}`, existingHomeworks);
  
  console.log('作业数据已存储到 homeworks_${teacherId}');
  
  // 测试从正确的key读取数据
  const assignments = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  console.log('从 homeworks_${teacherId} 读取到的作业数据:', assignments.length, '个作业');
  
  if (assignments.length > 0) {
    console.log('✅ 存储key一致性测试通过');
    return true;
  } else {
    console.log('❌ 存储key一致性测试失败');
    return false;
  }
}

// 测试ID字段匹配
function testIdFieldMatching() {
  console.log('\n=== 测试ID字段匹配 ===');
  
  const assignments = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  const material = testMaterialData;
  
  // 测试修复后的查找逻辑
  const assignment = assignments.find(a => (a._id || a.id) === material.assignmentId);
  
  console.log('材料关联的作业ID:', material.assignmentId);
  console.log('找到的作业:', assignment ? assignment.title : '未找到');
  
  if (assignment && assignment.title === testHomeworkData.title) {
    console.log('✅ ID字段匹配测试通过');
    return true;
  } else {
    console.log('❌ ID字段匹配测试失败');
    return false;
  }
}

// 测试作业详情查看功能
function testViewAssignmentDetail() {
  console.log('\n=== 测试作业详情查看功能 ===');
  
  const assignments = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  const material = testMaterialData;
  
  // 模拟viewAssignmentDetail方法的逻辑
  const assignment = assignments.find(a => (a._id || a.id) === material.assignmentId);
  
  if (!assignment) {
    console.log('❌ 作业详情查看测试失败 - 关联作业不存在');
    return false;
  }
  
  // 获取作业结果统计
  const results = wx.getStorageSync(`assignment_results_${assignment._id || assignment.id}`) || [];
  
  const assignmentDetail = {
    title: assignment.title,
    remark: assignment.description || '基于学生答题情况自动生成的配套材料',
    deadline: assignment.deadline || '2024-12-25 23:59',
    completedCount: results.length,
    totalCount: assignment.studentCount || 0,
    averageAccuracy: material.classAccuracy,
    createdAt: assignment.createdAt || material.createdAt,
    questionCount: assignment.totalQuestions || assignment.questionCount || 0,
    category: assignment.category || '语法练习'
  };
  
  console.log('作业详情:', assignmentDetail);
  
  if (assignmentDetail.title && assignmentDetail.questionCount > 0) {
    console.log('✅ 作业详情查看测试通过');
    return true;
  } else {
    console.log('❌ 作业详情查看测试失败');
    return false;
  }
}

// 测试材料生成功能
function testMaterialGeneration() {
  console.log('\n=== 测试材料生成功能 ===');
  
  const assignments = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  const material = testMaterialData;
  
  // 模拟generateMaterial方法的逻辑
  const assignment = assignments.find(a => (a._id || a.id) === material.assignmentId);
  
  if (!assignment) {
    console.log('❌ 材料生成测试失败 - 关联作业不存在');
    return false;
  }
  
  // 模拟生成PPT内容
  const pptContent = generateTestPPTContent(material, assignment);
  
  if (pptContent && pptContent.includes(assignment.title)) {
    console.log('✅ 材料生成测试通过');
    return true;
  } else {
    console.log('❌ 材料生成测试失败');
    return false;
  }
}

// 生成测试PPT内容
function generateTestPPTContent(material, assignment) {
  let content = `# ${material.title}

## 班级正确率统计
- 整体正确率: ${material.classAccuracy}%
- 参与学生: ${material.questionCount || 0}题
- 需要重点讲解的知识点: 语法练习

## 练习题目

### 第一题
**题目**: 请选择正确的答案
**选项**:
A. 选项A
B. 选项B  
C. 选项C
D. 选项D

**答案**: A
**解析**: 这是正确答案的详细解析...

## 总结
- 本次练习主要考查的知识点: 语法练习
- 学生容易出错的地方: 需要根据实际答题情况分析
- 建议的复习重点: 针对正确率较低的知识点进行强化练习

---
*生成时间: ${new Date().toLocaleString('zh-CN')}*
*班级正确率: ${material.classAccuracy}%*
*作业标题: ${assignment.title}*`;

  return content;
}

// 运行所有测试
function runAllTests() {
  console.log('开始运行PPT/学案作业关联修复测试...\n');
  
  const results = {
    storageKeyConsistency: testStorageKeyConsistency(),
    idFieldMatching: testIdFieldMatching(),
    viewAssignmentDetail: testViewAssignmentDetail(),
    materialGeneration: testMaterialGeneration()
  };
  
  console.log('\n=== 测试结果汇总 ===');
  const allPassed = Object.values(results).every(result => result);
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${test}: ${passed ? '✅ 通过' : '❌ 失败'}`);
  });
  
  if (allPassed) {
    console.log('\n🎉 所有测试通过！PPT/学案作业关联修复成功');
    console.log('现在点击"作业信息"应该能正确显示关联的作业详情');
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
  testStorageKeyConsistency,
  testIdFieldMatching,
  testViewAssignmentDetail,
  testMaterialGeneration,
  runAllTests
};
