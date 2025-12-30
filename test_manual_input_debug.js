// 测试手动输入功能调试脚本
// 在微信开发者工具控制台运行此代码

async function testManualInputDebug() {
  console.log('🔧 测试手动输入功能调试...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    if (!wx.cloud) {
      console.log('❌ 云开发环境不可用');
      return { success: false, error: '云开发环境不可用' };
    }
    
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 1. 检查高一十二班的当前学生数量
    console.log('🔍 检查高一十二班的当前学生数量...');
    
    const classes = currentPage.data.classes || [];
    const targetClass = classes.find(c => c.name === '高一十二班');
    
    if (!targetClass) {
      console.log('❌ 未找到高一十二班');
      return { success: false, error: '未找到目标班级' };
    }
    
    console.log(`目标班级: ${targetClass.name}`);
    console.log(`班级ID: ${targetClass.id}`);
    console.log(`当前显示学生数: ${targetClass.studentCount}`);
    
    // 2. 从数据库查询该班级的实际学生数量
    console.log('🔍 从数据库查询该班级的实际学生数量...');
    
    const studentsResult = await db.collection('students').where({
      classId: targetClass.id,
      status: 'active'
    }).limit(10000).get();
    
    console.log(`数据库中学生数量: ${studentsResult.data.length}`);
    
    // 3. 显示所有学生信息
    console.log('📋 所有学生信息:');
    studentsResult.data.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name} (ID: ${student._id})`);
    });
    
    // 4. 检查手动输入功能的数据
    console.log('🔍 检查手动输入功能的数据...');
    
    const manualStudents = currentPage.data.manualStudents || [];
    const currentClassId = currentPage.data.currentClassId;
    
    console.log(`当前班级ID: ${currentClassId}`);
    console.log(`待导入学生数: ${manualStudents.length}`);
    
    if (manualStudents.length > 0) {
      console.log('待导入学生列表:');
      manualStudents.forEach((student, index) => {
        console.log(`${index + 1}. ${student.name} (学号: ${student.studentId})`);
      });
    }
    
    // 5. 测试手动输入功能
    console.log('🧪 测试手动输入功能...');
    
    // 模拟手动输入一个测试学生
    const testStudent = {
      name: `测试学生_${Date.now()}`,
      studentId: `TEST_${Date.now()}`,
      rowIndex: 1
    };
    
    console.log('模拟添加测试学生:', testStudent);
    
    // 设置手动输入数据
    currentPage.setData({
      manualStudents: [testStudent],
      currentClassId: targetClass.id
    });
    
    console.log('✅ 测试数据已设置');
    
    // 6. 检查confirmManualImport方法是否存在
    console.log('🔍 检查confirmManualImport方法...');
    
    if (typeof currentPage.confirmManualImport === 'function') {
      console.log('✅ confirmManualImport方法存在');
      
      // 检查方法是否正确
      console.log('🔍 检查方法实现...');
      
      // 这里我们不会实际调用方法，只是检查
      console.log('方法可用，可以手动测试');
      
    } else {
      console.log('❌ confirmManualImport方法不存在');
    }
    
    // 7. 提供测试建议
    console.log('');
    console.log('💡 测试建议:');
    console.log('1. 手动输入一个学生姓名');
    console.log('2. 点击"确认导入"');
    console.log('3. 观察控制台输出');
    console.log('4. 检查数据库中的学生数量');
    console.log('5. 刷新页面，检查学生数量是否保持');
    
    return {
      success: true,
      message: '手动输入功能调试完成',
      classInfo: {
        name: targetClass.name,
        id: targetClass.id,
        displayCount: targetClass.studentCount,
        actualCount: studentsResult.data.length
      },
      students: studentsResult.data.map(s => ({
        name: s.name,
        id: s._id,
        studentId: s.studentId
      }))
    };
    
  } catch (error) {
    console.error('❌ 调试过程中发生错误:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行调试
testManualInputDebug().then(result => {
  console.log('');
  console.log('📋 调试结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.success) {
    console.log('');
    console.log('📊 班级信息:');
    console.log(`- 班级名称: ${result.classInfo.name}`);
    console.log(`- 班级ID: ${result.classInfo.id}`);
    console.log(`- 显示学生数: ${result.classInfo.displayCount}`);
    console.log(`- 实际学生数: ${result.classInfo.actualCount}`);
    
    if (result.students.length > 0) {
      console.log('');
      console.log('📋 学生列表:');
      result.students.forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.name} (${student.studentId})`);
      });
    }
    
    console.log('');
    console.log('🎯 现在请手动输入一个学生进行测试！');
  }
  
  console.log('');
  console.log('💡 如果问题仍然存在，请提供手动输入时的控制台输出');
});

console.log('✅ testManualInputDebug 函数已定义');
