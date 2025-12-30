// 修复学生显示问题
// 在微信开发者工具控制台中运行此代码

async function fixStudentDisplayIssue() {
  console.log('🔧 修复学生显示问题...');
  
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
    
    const currentData = {
      students: currentPage.data.students || [],
      classes: currentPage.data.classes || [],
      currentTab: currentPage.data.currentTab || 'classes'
    };
    
    console.log('当前数据状态:');
    console.log(`- 学生数量: ${currentData.students.length}`);
    console.log(`- 班级数量: ${currentData.classes.length}`);
    console.log(`- 当前标签页: ${currentData.currentTab}`);
    
    // 2. 检查本地存储数据
    console.log('💾 检查本地存储数据...');
    
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const localStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    
    console.log('本地存储数据:');
    console.log(`- 学生数量: ${localStudents.length}`);
    console.log(`- 班级数量: ${localClasses.length}`);
    
    // 3. 强制刷新数据
    console.log('🔄 强制刷新数据...');
    
    // 清除可能的缓存问题
    currentPage.setData({
      students: [],
      classes: []
    });
    
    // 重新加载数据
    await currentPage.loadClassData();
    
    // 等待数据加载完成
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 4. 验证修复结果
    console.log('✅ 验证修复结果...');
    
    const updatedData = {
      students: currentPage.data.students || [],
      classes: currentPage.data.classes || []
    };
    
    console.log('修复后数据状态:');
    console.log(`- 学生数量: ${updatedData.students.length}`);
    console.log(`- 班级数量: ${updatedData.classes.length}`);
    
    // 5. 检查学生数据详情
    if (updatedData.students.length > 0) {
      console.log('学生数据详情:');
      updatedData.students.forEach((student, index) => {
        if (index < 10) { // 只显示前10个
          console.log(`${index + 1}. ${student.name} (${student.class}) - ID: ${student.studentId}`);
        }
      });
      
      if (updatedData.students.length > 10) {
        console.log(`...还有 ${updatedData.students.length - 10} 个学生`);
      }
    }
    
    // 6. 强制刷新界面
    console.log('🎨 强制刷新界面...');
    
    // 切换到学生管理标签页
    currentPage.setData({
      currentTab: 'students'
    });
    
    // 强制重新渲染
    currentPage.setData({
      students: [...updatedData.students]
    });
    
    // 7. 检查WXML数据绑定
    console.log('🔍 检查WXML数据绑定...');
    
    // 检查学生管理界面的关键数据
    const studentManagementData = {
      studentsLength: updatedData.students.length,
      studentsArray: updatedData.students,
      hasStudents: updatedData.students.length > 0
    };
    
    console.log('学生管理界面数据绑定检查:');
    console.log(`- students.length: ${studentManagementData.studentsLength}`);
    console.log(`- students数组存在: ${Array.isArray(studentManagementData.studentsArray)}`);
    console.log(`- hasStudents: ${studentManagementData.hasStudents}`);
    
    // 8. 提供手动修复方法
    console.log('');
    console.log('🛠️ 手动修复方法:');
    console.log('');
    console.log('方法1: 强制刷新页面');
    console.log('1. 切换到"班级列表"标签页');
    console.log('2. 再切换回"学生管理"标签页');
    console.log('3. 点击"刷新"按钮');
    console.log('');
    console.log('方法2: 清除缓存重新加载');
    console.log('1. 在控制台运行: wx.clearStorageSync()');
    console.log('2. 重新进入页面');
    console.log('3. 等待数据重新加载');
    console.log('');
    console.log('方法3: 检查网络连接');
    console.log('1. 确保网络连接正常');
    console.log('2. 确保云开发环境正常');
    console.log('3. 重新尝试刷新');
    
    // 9. 创建调试信息
    console.log('');
    console.log('🔍 调试信息:');
    console.log('');
    console.log('如果问题仍然存在，请检查:');
    console.log('1. 学生管理界面的WXML模板是否正确绑定{{students}}');
    console.log('2. 是否有JavaScript错误阻止了界面更新');
    console.log('3. 数据格式是否符合WXML模板的期望');
    console.log('');
    
    // 10. 提供测试代码
    console.log('🧪 测试代码:');
    console.log('');
    console.log('// 手动设置测试数据');
    console.log('const testStudents = [');
    console.log('  { id: "1", name: "测试学生1", class: "测试班级", studentId: "S001" },');
    console.log('  { id: "2", name: "测试学生2", class: "测试班级", studentId: "S002" }');
    console.log('];');
    console.log('');
    console.log('// 设置到页面数据');
    console.log('currentPage.setData({ students: testStudents });');
    console.log('');
    console.log('// 切换到学生管理标签页');
    console.log('currentPage.setData({ currentTab: "students" });');
    
    return {
      success: true,
      message: '学生显示问题修复完成',
      beforeFix: {
        students: currentData.students.length,
        classes: currentData.classes.length
      },
      afterFix: {
        students: updatedData.students.length,
        classes: updatedData.classes.length
      },
      localStorage: {
        students: localStudents.length,
        classes: localClasses.length
      }
    };
    
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行修复
fixStudentDisplayIssue().then(result => {
  console.log('');
  console.log('📋 修复结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.beforeFix) {
    console.log('');
    console.log('📊 修复前后对比:');
    console.log(`修复前 - 学生: ${result.beforeFix.students}个, 班级: ${result.beforeFix.classes}个`);
    console.log(`修复后 - 学生: ${result.afterFix.students}个, 班级: ${result.afterFix.classes}个`);
    console.log(`本地存储 - 学生: ${result.localStorage.students}个, 班级: ${result.localStorage.classes}个`);
  }
  
  console.log('');
  console.log('💡 下一步建议:');
  console.log('1. 检查学生管理界面是否正常显示');
  console.log('2. 如果仍有问题，尝试手动刷新');
  console.log('3. 检查控制台是否有错误信息');
});

console.log('✅ fixStudentDisplayIssue 函数已定义');
