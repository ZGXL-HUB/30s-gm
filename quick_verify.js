// 快速验证脚本 - 复制粘贴到控制台运行

// 验证前端显示
(function quickVerify() {
  console.log('🔍 快速验证学生显示情况...\n');
  
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  if (!currentPage || !currentPage.data) {
    console.log('❌ 未找到页面数据');
    return;
  }
  
  const classes = currentPage.data.classes || [];
  const students = currentPage.data.students || [];
  
  console.log(`📊 总览:`);
  console.log(`班级总数: ${classes.length}`);
  console.log(`学生总数: ${students.length}\n`);
  
  console.log(`📋 各班级学生数量:`);
  classes.forEach(cls => {
    const classStudents = students.filter(s => s.classId === cls.id);
    const status = classStudents.length > 20 ? '✅' : (classStudents.length === 20 ? '⚠️' : '✅');
    console.log(`${status} ${cls.name}: ${classStudents.length}人 (卡片显示${cls.studentCount}人)`);
  });
  
  // 检查是否有超过20人的班级
  const largeClasses = classes.filter(cls => {
    const classStudents = students.filter(s => s.classId === cls.id);
    return classStudents.length > 20;
  });
  
  if (largeClasses.length > 0) {
    console.log(`\n🎉 发现 ${largeClasses.length} 个班级学生超过20人，修复成功！`);
    largeClasses.forEach(cls => {
      const count = students.filter(s => s.classId === cls.id).length;
      console.log(`  - ${cls.name}: ${count}人`);
    });
  } else {
    console.log(`\n✅ 所有班级学生数据正常显示`);
  }
  
  // 检查数据一致性
  console.log(`\n🔍 数据一致性检查:`);
  let hasInconsistency = false;
  classes.forEach(cls => {
    const actualCount = students.filter(s => s.classId === cls.id).length;
    if (actualCount !== cls.studentCount) {
      hasInconsistency = true;
      console.log(`⚠️ ${cls.name}: 显示${cls.studentCount}人，实际${actualCount}人`);
    }
  });
  
  if (!hasInconsistency) {
    console.log(`✅ 所有班级数据一致`);
  } else {
    console.log(`\n💡 建议运行同步脚本更新班级人数统计:`);
    console.log(`currentPage.syncClassStudentCount()`);
  }
})();

