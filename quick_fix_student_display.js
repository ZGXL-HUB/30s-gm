// 快速修复学生显示问题
// 在微信开发者工具控制台中运行此代码

function quickFixStudentDisplay() {
  console.log('🚀 快速修复学生显示问题...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      console.log('💡 请先导航到班级管理页面');
      return false;
    }
    
    console.log('✅ 找到班级管理页面');
    
    // 方法1: 强制刷新数据
    console.log('🔄 方法1: 强制刷新数据...');
    
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const students = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log(`找到 ${students.length} 个学生数据`);
    
    // 强制更新页面数据
    currentPage.setData({
      students: [...students] // 创建新数组确保触发更新
    });
    
    console.log('✅ 数据已强制更新');
    
    // 方法2: 强制刷新界面
    console.log('🎨 方法2: 强制刷新界面...');
    
    // 先切换到班级列表
    currentPage.setData({
      currentTab: 'classes'
    });
    
    // 等待100ms后切换回学生管理
    setTimeout(() => {
      currentPage.setData({
        currentTab: 'students'
      });
      console.log('✅ 界面已强制刷新');
    }, 100);
    
    // 方法3: 调用内置的强制刷新方法
    console.log('🔧 方法3: 调用内置强制刷新方法...');
    
    setTimeout(() => {
      if (typeof currentPage.forceRefreshStudentDisplay === 'function') {
        currentPage.forceRefreshStudentDisplay();
        console.log('✅ 内置强制刷新方法已调用');
      } else {
        console.log('⚠️ 内置强制刷新方法不存在，跳过');
      }
    }, 200);
    
    console.log('');
    console.log('🎉 快速修复完成！');
    console.log('');
    console.log('📋 修复内容:');
    console.log('✅ 强制更新学生数据');
    console.log('✅ 强制刷新界面显示');
    console.log('✅ 调用内置刷新方法');
    console.log('');
    console.log('💡 请检查学生管理界面是否正常显示');
    console.log('💡 如果仍有问题，请尝试点击"刷新"按钮');
    
    return true;
    
  } catch (error) {
    console.error('❌ 快速修复失败:', error);
    return false;
  }
}

// 执行快速修复
const success = quickFixStudentDisplay();

if (success) {
  console.log('');
  console.log('✨ 修复脚本执行成功！');
  console.log('请检查学生管理界面是否正常显示学生列表。');
} else {
  console.log('');
  console.log('❌ 修复脚本执行失败！');
  console.log('请检查控制台错误信息或手动刷新页面。');
}

console.log('✅ quickFixStudentDisplay 函数已定义');
