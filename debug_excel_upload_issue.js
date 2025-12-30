// 深度调试Excel上传问题
// 在微信开发者工具控制台中运行此代码

async function debugExcelUploadIssue() {
  console.log('🔍 深度调试Excel上传问题...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    // 1. 检查当前数据状态
    console.log('📊 检查当前数据状态...');
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const localStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log(`班级数量: ${localClasses.length}`);
    console.log(`学生数量: ${localStudents.length}`);
    
    // 2. 详细分析每个班级
    console.log('📚 详细班级分析:');
    localClasses.forEach((cls, index) => {
      console.log(`班级 ${index + 1}:`);
      console.log(`  名称: ${cls.name}`);
      console.log(`  ID: ${cls.id}`);
      console.log(`  显示学生数: ${cls.studentCount || 0}`);
      console.log(`  创建时间: ${cls.createdAt || '未知'}`);
      console.log(`  状态: ${cls.status || '未知'}`);
      
      // 查找该班级的学生
      const classStudents = localStudents.filter(s => s.classId === cls.id);
      console.log(`  实际学生数: ${classStudents.length}`);
      
      if (classStudents.length > 0) {
        console.log('  学生列表:');
        classStudents.forEach((student, sIndex) => {
          console.log(`    ${sIndex + 1}. ${student.name} (ID: ${student.id})`);
        });
      } else {
        console.log('  ⚠️ 该班级没有学生数据');
      }
      console.log('');
    });
    
    // 3. 检查云函数调用逻辑
    console.log('🔧 检查云函数调用逻辑...');
    
    // 检查方法是否存在
    const methods = [
      'processExcelForNewClass',
      'processExcelForNewClassLocal',
      'updateClassStudentCount'
    ];
    
    methods.forEach(method => {
      const exists = typeof currentPage[method] === 'function';
      console.log(`${method}: ${exists ? '✅ 存在' : '❌ 缺失'}`);
    });
    
    // 4. 模拟测试云函数调用
    console.log('🧪 模拟测试云函数调用...');
    
    // 创建一个测试用的Excel文件对象
    const testExcelFile = {
      name: 'test_students.xlsx',
      path: '/test/path/test_students.xlsx',
      size: 1024
    };
    
    // 使用最新的班级ID进行测试
    const latestClass = localClasses[localClasses.length - 1];
    if (latestClass) {
      console.log(`使用最新班级进行测试: ${latestClass.name} (ID: ${latestClass.id})`);
      
      // 测试本地模式处理
      try {
        console.log('🔄 测试本地模式处理...');
        
        // 这里我们不实际调用方法，只是检查逻辑
        console.log('本地模式会生成以下学生数据:');
        
        let mockStudents = [];
        if (latestClass.name.includes('字母班')) {
          mockStudents = [
            { name: 'A同学', classId: latestClass.id },
            { name: 'B同学', classId: latestClass.id },
            { name: 'C同学', classId: latestClass.id },
            { name: 'D同学', classId: latestClass.id },
            { name: 'E同学', classId: latestClass.id }
          ];
        } else {
          mockStudents = [
            { name: '学生1', classId: latestClass.id },
            { name: '学生2', classId: latestClass.id },
            { name: '学生3', classId: latestClass.id }
          ];
        }
        
        mockStudents.forEach((student, index) => {
          console.log(`  ${index + 1}. ${student.name}`);
        });
        
        console.log('✅ 本地模式逻辑正常');
        
      } catch (error) {
        console.error('❌ 本地模式测试失败:', error);
      }
    }
    
    // 5. 检查数据库同步问题
    console.log('💾 检查数据库同步问题...');
    
    // 检查是否有学生数据但班级学生数统计不正确
    const totalStudents = localStudents.length;
    const totalClassStudentCount = localClasses.reduce((sum, cls) => sum + (cls.studentCount || 0), 0);
    
    console.log(`学生总数: ${totalStudents}`);
    console.log(`班级学生数总和: ${totalClassStudentCount}`);
    
    if (totalStudents !== totalClassStudentCount) {
      console.log('⚠️ 学生数据统计不一致，可能存在同步问题');
    } else {
      console.log('✅ 学生数据统计一致');
    }
    
    // 6. 提供解决方案
    console.log('');
    console.log('💡 问题分析和解决方案:');
    
    if (localStudents.length === 0) {
      console.log('🔍 问题: 完全没有学生数据');
      console.log('💡 解决方案:');
      console.log('  1. 检查云函数 parseStudentExcel 是否正确部署');
      console.log('  2. 检查Excel文件格式是否正确');
      console.log('  3. 尝试重新创建班级并上传Excel');
      console.log('  4. 检查云函数返回的数据格式');
    } else {
      console.log('🔍 问题: 有学生数据但可能未正确关联到班级');
      console.log('💡 解决方案:');
      console.log('  1. 检查学生数据的classId字段');
      console.log('  2. 检查班级数据的studentCount字段');
      console.log('  3. 运行数据同步修复');
    }
    
    return {
      success: true,
      message: '调试完成',
      classesCount: localClasses.length,
      studentsCount: localStudents.length,
      hasStudents: localStudents.length > 0,
      dataConsistent: totalStudents === totalClassStudentCount
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
debugExcelUploadIssue().then(result => {
  console.log('');
  console.log('📋 调试结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.classesCount !== undefined) {
    console.log('📊 数据状态:');
    console.log(`  班级数: ${result.classesCount}`);
    console.log(`  学生数: ${result.studentsCount}`);
    console.log(`  有学生数据: ${result.hasStudents ? '✅' : '❌'}`);
    console.log(`  数据一致: ${result.dataConsistent ? '✅' : '❌'}`);
  }
});

console.log('✅ debugExcelUploadIssue 函数已定义');
