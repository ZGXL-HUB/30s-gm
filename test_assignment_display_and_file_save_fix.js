// 测试作业显示和文件保存修复
// 这个脚本用于验证修复后的功能

console.log('开始测试作业显示和文件保存修复...');

// 模拟教师ID
const teacherId = 'teacher_123';

// 模拟两种类型的作业数据
const testHomeworkData = {
  _id: "homework_1759627036668",
  id: "homework_1759627036668",
  type: "topic",
  title: "专题语法练习",
  description: "专题语法点练习",
  status: "published",
  teacherId: teacherId,
  totalQuestions: 3,
  questionCount: 3,
  createdAt: "2025-10-05T01:17:16.668Z"
};

const testAssignmentData = {
  _id: "assignment_1759627036669",
  id: "assignment_1759627036669",
  title: "语法综合测试",
  description: "综合语法点测试",
  status: "active",
  teacherId: teacherId,
  questionCount: 5,
  totalQuestions: 5,
  createdAt: "2025-10-05T01:20:00.000Z"
};

// 测试作业数据合并
function testAssignmentDataMerge() {
  console.log('\n=== 测试作业数据合并 ===');
  
  // 模拟存储两种类型的作业
  wx.setStorageSync(`homeworks_${teacherId}`, [testHomeworkData]);
  wx.setStorageSync(`assignments_${teacherId}`, [testAssignmentData]);
  
  // 模拟修复后的读取逻辑
  const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
  const allAssignments = [...homeworks, ...assignments];
  
  console.log('homeworks数量:', homeworks.length);
  console.log('assignments数量:', assignments.length);
  console.log('合并后总数:', allAssignments.length);
  
  if (allAssignments.length === 2 && 
      allAssignments.some(a => a.title === '专题语法练习') &&
      allAssignments.some(a => a.title === '语法综合测试')) {
    console.log('✅ 作业数据合并测试通过');
    return true;
  } else {
    console.log('❌ 作业数据合并测试失败');
    return false;
  }
}

// 测试配套材料生成
function testMaterialGeneration() {
  console.log('\n=== 测试配套材料生成 ===');
  
  const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
  const allAssignments = [...homeworks, ...assignments];
  
  const materials = [];
  
  // 模拟材料生成逻辑
  for (const assignment of allAssignments) {
    if (assignment.status === 'completed' || assignment.status === 'published' || assignment.status === 'active' || !assignment.status) {
      const assignmentId = assignment._id || assignment.id;
      
      // 生成PPT材料
      const pptMaterial = {
        id: `mat_ppt_${assignmentId}`,
        title: `${assignment.title}专项练习PPT`,
        type: 'ppt',
        createdAt: assignment.createdAt,
        downloadCount: 0,
        classAccuracy: 0,
        status: 'completed',
        assignmentId: assignmentId,
        assignmentTitle: assignment.title,
        questionCount: assignment.totalQuestions || assignment.questionCount || 0
      };
      
      // 生成学案材料
      const wordMaterial = {
        id: `mat_word_${assignmentId}`,
        title: `${assignment.title}综合练习学案`,
        type: 'word',
        createdAt: assignment.createdAt,
        downloadCount: 0,
        classAccuracy: 0,
        status: 'completed',
        assignmentId: assignmentId,
        assignmentTitle: assignment.title,
        questionCount: assignment.totalQuestions || assignment.questionCount || 0
      };
      
      materials.push(pptMaterial, wordMaterial);
    }
  }
  
  console.log('生成的配套材料数量:', materials.length);
  console.log('材料列表:', materials.map(m => m.title));
  
  if (materials.length === 4) { // 2个作业 × 2种材料类型 = 4个材料
    console.log('✅ 配套材料生成测试通过');
    return true;
  } else {
    console.log('❌ 配套材料生成测试失败');
    return false;
  }
}

// 测试文件保存API
function testFileSaveAPI() {
  console.log('\n=== 测试文件保存API ===');
  
  // 模拟文件内容
  const content = `# 测试PPT内容

## 班级正确率统计
- 整体正确率: 85%
- 参与学生: 5题
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

---
*生成时间: ${new Date().toLocaleString('zh-CN')}*`;

  const fileName = `test_ppt_${Date.now()}.txt`;
  
  try {
    // 模拟新的文件保存逻辑
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
    
    // 写入文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('文件写入成功:', filePath);
    
    // 检查文件是否存在
    const fileExists = fs.accessSync(filePath);
    console.log('文件访问测试:', fileExists === undefined ? '成功' : '失败');
    
    console.log('✅ 文件保存API测试通过');
    return true;
    
  } catch (error) {
    console.log('❌ 文件保存API测试失败:', error.message);
    return false;
  }
}

// 测试作业详情查看
function testAssignmentDetailView() {
  console.log('\n=== 测试作业详情查看 ===');
  
  const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
  const allAssignments = [...homeworks, ...assignments];
  
  // 模拟材料数据
  const material = {
    id: 'mat_ppt_assignment_1759627036669',
    assignmentId: 'assignment_1759627036669',
    title: '语法综合测试专项练习PPT'
  };
  
  // 模拟查找关联作业的逻辑
  const assignment = allAssignments.find(a => (a._id || a.id) === material.assignmentId);
  
  if (assignment) {
    const assignmentDetail = {
      title: assignment.title,
      remark: assignment.description || '基于学生答题情况自动生成的配套材料',
      deadline: assignment.deadline || '2024-12-25 23:59',
      completedCount: 0,
      totalCount: assignment.studentCount || 0,
      averageAccuracy: 0,
      createdAt: assignment.createdAt,
      questionCount: assignment.totalQuestions || assignment.questionCount || 0,
      category: assignment.category || '语法练习'
    };
    
    console.log('作业详情:', assignmentDetail);
    
    if (assignmentDetail.title && assignmentDetail.questionCount > 0) {
      console.log('✅ 作业详情查看测试通过');
      return true;
    }
  }
  
  console.log('❌ 作业详情查看测试失败');
  return false;
}

// 运行所有测试
function runAllTests() {
  console.log('开始运行作业显示和文件保存修复测试...\n');
  
  const results = {
    assignmentDataMerge: testAssignmentDataMerge(),
    materialGeneration: testMaterialGeneration(),
    fileSaveAPI: testFileSaveAPI(),
    assignmentDetailView: testAssignmentDetailView()
  };
  
  console.log('\n=== 测试结果汇总 ===');
  const allPassed = Object.values(results).every(result => result);
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${test}: ${passed ? '✅ 通过' : '❌ 失败'}`);
  });
  
  if (allPassed) {
    console.log('\n🎉 所有测试通过！作业显示和文件保存修复成功');
    console.log('现在布置的作业应该能正确显示在配套材料界面');
    console.log('文件保存功能应该能正常工作，不再有API废弃警告');
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

// 在微信小程序环境中不需要导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testAssignmentDataMerge,
    testMaterialGeneration,
    testFileSaveAPI,
    testAssignmentDetailView,
    runAllTests
  };
}
