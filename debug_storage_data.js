// 调试存储数据脚本
// 检查作业数据是否正确存储和读取

console.log('开始调试存储数据...');

const teacherId = 'teacher_123';

// 检查所有相关的存储key
function debugStorageData() {
  console.log('\n=== 调试存储数据 ===');
  
  // 检查homeworks存储
  const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  console.log('homeworks_${teacherId}:', homeworks);
  console.log('homeworks数量:', homeworks.length);
  
  // 检查assignments存储
  const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
  console.log('assignments_${teacherId}:', assignments);
  console.log('assignments数量:', assignments.length);
  
  // 检查是否有最新发布的作业
  const latestHomework = homeworks.find(h => h._id === 'homework_1760044974765');
  if (latestHomework) {
    console.log('找到最新发布的作业:', latestHomework);
  } else {
    console.log('未找到最新发布的作业 homework_1760044974765');
    
    // 检查是否有类似的作业ID
    const similarHomework = homeworks.find(h => h._id && h._id.includes('homework_1760044'));
    if (similarHomework) {
      console.log('找到类似的作业:', similarHomework);
    }
  }
  
  // 合并数据测试
  const allAssignments = [...homeworks, ...assignments];
  console.log('合并后的作业总数:', allAssignments.length);
  
  // 检查每个作业的状态
  allAssignments.forEach((assignment, index) => {
    console.log(`作业${index + 1}:`, {
      id: assignment._id || assignment.id,
      title: assignment.title,
      status: assignment.status,
      type: assignment.type
    });
  });
  
  return {
    homeworks,
    assignments,
    allAssignments,
    latestHomework
  };
}

// 测试材料生成逻辑
function testMaterialGeneration() {
  console.log('\n=== 测试材料生成逻辑 ===');
  
  const { homeworks, assignments, allAssignments } = debugStorageData();
  
  if (allAssignments.length === 0) {
    console.log('❌ 没有找到任何作业数据');
    return [];
  }
  
  const materials = [];
  
  // 模拟材料生成逻辑
  for (const assignment of allAssignments) {
    console.log('处理作业:', assignment.title, '状态:', assignment.status);
    
    // 检查作业状态
    if (assignment.status === 'completed' || assignment.status === 'published' || assignment.status === 'active' || !assignment.status) {
      const assignmentId = assignment._id || assignment.id;
      
      // 生成PPT材料
      const pptMaterial = {
        id: `mat_ppt_${assignmentId}`,
        title: `${assignment.title}专项练习PPT`,
        type: 'ppt',
        createdAt: assignment.createdAt || new Date().toISOString(),
        downloadCount: 0,
        classAccuracy: 0,
        status: 'pending',
        assignmentId: assignmentId,
        assignmentTitle: assignment.title,
        questionCount: assignment.totalQuestions || assignment.questionCount || 0
      };
      
      // 生成学案材料
      const wordMaterial = {
        id: `mat_word_${assignmentId}`,
        title: `${assignment.title}综合练习学案`,
        type: 'word',
        createdAt: assignment.createdAt || new Date().toISOString(),
        downloadCount: 0,
        classAccuracy: 0,
        status: 'pending',
        assignmentId: assignmentId,
        assignmentTitle: assignment.title,
        questionCount: assignment.totalQuestions || assignment.questionCount || 0
      };
      
      materials.push(pptMaterial, wordMaterial);
      console.log('生成材料:', pptMaterial.title, wordMaterial.title);
    } else {
      console.log('跳过作业:', assignment.title, '状态不符合:', assignment.status);
    }
  }
  
  console.log('总共生成材料数量:', materials.length);
  console.log('材料列表:', materials.map(m => m.title));
  
  return materials;
}

// 检查页面跳转参数
function checkPageParams() {
  console.log('\n=== 检查页面跳转参数 ===');
  
  // 模拟页面参数
  const params = {
    fromHomework: "true",
    homeworkId: "homework_1760044974765",
    homeworkTitle: "%E9%AB%98%E8%80%83%E9%85%8D%E6%AF%94%E7%BB%83%E4%B9%A0"
  };
  
  console.log('页面参数:', params);
  console.log('解码后的标题:', decodeURIComponent(params.homeworkTitle));
  
  // 检查是否能找到对应的作业
  const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
  const targetHomework = homeworks.find(h => h._id === params.homeworkId);
  
  if (targetHomework) {
    console.log('✅ 找到目标作业:', targetHomework);
  } else {
    console.log('❌ 未找到目标作业:', params.homeworkId);
    console.log('可用的作业ID:', homeworks.map(h => h._id));
  }
}

// 运行所有调试
function runAllDebug() {
  console.log('开始运行存储数据调试...\n');
  
  try {
    const storageData = debugStorageData();
    const materials = testMaterialGeneration();
    checkPageParams();
    
    console.log('\n=== 调试结果汇总 ===');
    console.log('存储的作业总数:', storageData.allAssignments.length);
    console.log('生成的配套材料数:', materials.length);
    
    if (materials.length > 0) {
      console.log('✅ 数据正常，应该能显示配套材料');
    } else {
      console.log('❌ 没有生成配套材料，需要检查数据');
    }
    
  } catch (error) {
    console.error('调试过程中出错:', error);
  }
}

// 如果在小程序环境中运行
if (typeof wx !== 'undefined') {
  runAllDebug();
} else {
  console.log('请在微信开发者工具的控制台中运行此脚本');
}

// 在微信小程序环境中不需要导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debugStorageData,
    testMaterialGeneration,
    checkPageParams,
    runAllDebug
  };
}
