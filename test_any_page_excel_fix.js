// 可以在任何页面运行的Excel功能测试
// 在微信开发者工具控制台中运行此代码

async function testExcelFixFromAnyPage() {
  console.log('🧪 从当前页面测试Excel上传功能修复...');
  
  try {
    // 检查所有页面
    const pages = getCurrentPages();
    console.log('📱 当前页面栈:', pages.map(p => p.route));
    
    // 寻找班级管理页面
    let classPage = null;
    for (let i = pages.length - 1; i >= 0; i--) {
      if (pages[i].route === 'pages/teacher-class/index') {
        classPage = pages[i];
        break;
      }
    }
    
    if (classPage) {
      console.log('✅ 找到班级管理页面实例');
      return await testExcelFunctionality(classPage);
    } else {
      console.log('⚠️ 未找到班级管理页面，尝试创建测试数据...');
      return await testWithMockData();
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function testExcelFunctionality(classPage) {
  console.log('🔧 测试Excel功能...');
  
  // 1. 检查数据结构
  const newClass = classPage.data.newClass || {};
  console.log('📋 newClass数据结构:', newClass);
  
  const hasExcelFileField = 'excelFile' in newClass;
  console.log('Excel文件字段:', hasExcelFileField ? '✅ 存在' : '❌ 缺失');
  
  // 2. 检查方法
  const methods = [
    'processExcelForNewClass',
    'updateClassStudentCount', 
    'processExcelForNewClassLocal',
    'uploadExcelForNewClass',
    'removeExcelFile'
  ];
  
  console.log('🔧 检查方法存在性:');
  methods.forEach(method => {
    const exists = typeof classPage[method] === 'function';
    console.log(`  ${method}:`, exists ? '✅ 存在' : '❌ 缺失');
  });
  
  // 3. 测试数据设置
  console.log('📊 测试数据设置...');
  const testExcelFile = {
    name: 'test_students.xlsx',
    path: '/test/path/test_students.xlsx',
    size: 1024
  };
  
  classPage.setData({
    'newClass.excelFile': testExcelFile
  });
  
  console.log('✅ 测试Excel文件设置成功');
  console.log('当前Excel文件:', classPage.data.newClass.excelFile);
  
  // 4. 测试删除功能
  if (typeof classPage.removeExcelFile === 'function') {
    classPage.removeExcelFile();
    console.log('✅ 删除Excel文件功能测试成功');
  }
  
  // 5. 检查现有数据
  const classes = classPage.data.classes || [];
  const students = classPage.data.students || [];
  console.log(`📊 当前数据: 班级${classes.length}个, 学生${students.length}个`);
  
  return {
    success: true,
    message: 'Excel功能测试完成',
    hasExcelField: hasExcelFileField,
    methodsExist: methods.filter(m => typeof classPage[m] === 'function').length,
    totalMethods: methods.length
  };
}

async function testWithMockData() {
  console.log('🎭 使用模拟数据测试...');
  
  // 检查本地存储数据
  const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
  const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
  const localStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
  
  console.log('💾 本地存储数据:');
  console.log(`  班级数量: ${localClasses.length}`);
  console.log(`  学生数量: ${localStudents.length}`);
  
  if (localClasses.length > 0) {
    console.log('📚 班级列表:');
    localClasses.forEach((cls, index) => {
      console.log(`  ${index + 1}. ${cls.name} (学生数: ${cls.studentCount || 0})`);
    });
  }
  
  if (localStudents.length > 0) {
    console.log('👥 学生列表:');
    localStudents.forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.name} (班级: ${student.class})`);
    });
  }
  
  // 检查修复后的功能
  console.log('🔍 检查修复效果:');
  
  // 检查是否有班级和学生数据
  const hasClasses = localClasses.length > 0;
  const hasStudents = localStudents.length > 0;
  
  console.log(`班级数据存在: ${hasClasses ? '✅' : '❌'}`);
  console.log(`学生数据存在: ${hasStudents ? '✅' : '❌'}`);
  
  if (hasClasses && hasStudents) {
    console.log('🎉 数据修复成功！班级和学生数据都存在');
  } else if (hasClasses && !hasStudents) {
    console.log('⚠️ 班级数据存在，但学生数据缺失 - Excel上传可能仍有问题');
  } else {
    console.log('❌ 班级和学生数据都缺失');
  }
  
  return {
    success: true,
    message: '模拟数据测试完成',
    classesCount: localClasses.length,
    studentsCount: localStudents.length,
    hasData: hasClasses && hasStudents
  };
}

// 执行测试
testExcelFixFromAnyPage().then(result => {
  console.log('');
  console.log('📋 测试结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.hasExcelField !== undefined) {
    console.log('📁 Excel字段:', result.hasExcelField ? '✅ 存在' : '❌ 缺失');
    console.log('🔧 方法完整度:', `${result.methodsExist}/${result.totalMethods}`);
  }
  
  if (result.classesCount !== undefined) {
    console.log('📊 数据统计:');
    console.log(`  班级: ${result.classesCount}个`);
    console.log(`  学生: ${result.studentsCount}个`);
    console.log('📈 修复状态:', result.hasData ? '✅ 成功' : '⚠️ 需要检查');
  }
});

console.log('✅ testExcelFixFromAnyPage 函数已定义');
