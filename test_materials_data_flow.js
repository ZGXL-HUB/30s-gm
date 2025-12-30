// 测试配套材料数据流
// 这个脚本用于调试配套材料界面的数据加载问题

console.log('=== 配套材料数据流测试 ===');

// 模拟教师ID
const teacherId = 'teacher_123';

// 1. 检查作业数据存储
console.log('\n1. 检查作业数据存储:');
const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
console.log('作业数据:', homeworks);
console.log('作业数量:', homeworks.length);

if (homeworks.length > 0) {
  console.log('最新作业:', homeworks[0]);
  console.log('最新作业ID:', homeworks[0]._id || homeworks[0].id);
  console.log('最新作业标题:', homeworks[0].title);
  console.log('最新作业状态:', homeworks[0].status);
}

// 2. 检查材料数据存储
console.log('\n2. 检查材料数据存储:');
const materials = wx.getStorageSync(`teacher_materials_${teacherId}`) || [];
console.log('材料数据:', materials);
console.log('材料数量:', materials.length);

// 3. 模拟生成材料逻辑
console.log('\n3. 模拟生成材料逻辑:');
const generatedMaterials = [];

for (const homework of homeworks) {
  if (homework.status === 'completed' || homework.status === 'published' || homework.status === 'active' || !homework.status) {
    const assignmentId = homework._id || homework.id;
    
    // 生成PPT材料
    const pptMaterial = {
      id: `mat_ppt_${assignmentId}`,
      title: `${homework.title}专项练习PPT`,
      type: 'ppt',
      createdAt: homework.createdAt || new Date().toISOString(),
      downloadCount: 0,
      classAccuracy: 0,
      status: 'pending',
      assignmentId: assignmentId,
      assignmentTitle: homework.title,
      questionCount: homework.totalQuestions || homework.questionCount || 0
    };
    
    // 生成学案材料
    const wordMaterial = {
      id: `mat_word_${assignmentId}`,
      title: `${homework.title}综合练习学案`,
      type: 'word',
      createdAt: homework.createdAt || new Date().toISOString(),
      downloadCount: 0,
      classAccuracy: 0,
      status: 'pending',
      assignmentId: assignmentId,
      assignmentTitle: homework.title,
      questionCount: homework.totalQuestions || homework.questionCount || 0
    };
    
    generatedMaterials.push(pptMaterial, wordMaterial);
  }
}

console.log('生成的材料数量:', generatedMaterials.length);
console.log('生成的材料:', generatedMaterials);

// 4. 检查存储key的一致性
console.log('\n4. 检查存储key一致性:');
const allStorageKeys = [];
for (let i = 0; i < wx.getStorageInfoSync().keys.length; i++) {
  const key = wx.getStorageInfoSync().keys[i];
  if (key.includes(teacherId)) {
    allStorageKeys.push(key);
  }
}
console.log('包含教师ID的存储key:', allStorageKeys);

// 5. 提供修复建议
console.log('\n5. 修复建议:');
if (homeworks.length === 0) {
  console.log('❌ 没有找到作业数据，请检查作业发布流程');
} else {
  console.log('✅ 找到作业数据，数量:', homeworks.length);
}

if (generatedMaterials.length === 0) {
  console.log('❌ 没有生成材料，请检查作业状态');
} else {
  console.log('✅ 成功生成材料，数量:', generatedMaterials.length);
}

console.log('\n=== 测试完成 ===');
