// 测试单个班级的学生显示限制
// 在微信开发者工具控制台中运行

async function testSingleClassLimit() {
  console.log('🔍 测试单个班级学生显示限制...\n');
  
  try {
    if (!wx.cloud) {
      console.log('❌ 云开发环境不可用');
      return;
    }
    
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 1. 获取所有班级
    const classesResult = await db.collection('classes')
      .where({ teacherId: teacherId })
      .get();
    
    console.log(`📚 找到 ${classesResult.data.length} 个班级\n`);
    
    // 2. 逐个检查每个班级的学生数量
    for (const classInfo of classesResult.data) {
      console.log(`\n========== ${classInfo.name} ==========`);
      
      // 测试1：不加limit（看是否真的限制20个）
      const noLimitResult = await db.collection('students')
        .where({ classId: classInfo._id })
        .get();
      
      // 测试2：加limit(10000)
      const withLimitResult = await db.collection('students')
        .where({ classId: classInfo._id })
        .limit(10000)
        .get();
      
      // 测试3：分页查询
      let paginatedStudents = [];
      let skip = 0;
      const batchSize = 20;
      let hasMore = true;
      
      while (hasMore) {
        const batch = await db.collection('students')
          .where({ classId: classInfo._id })
          .skip(skip)
          .limit(batchSize)
          .get();
        
        paginatedStudents = paginatedStudents.concat(batch.data);
        
        if (batch.data.length < batchSize) {
          hasMore = false;
        } else {
          skip += batchSize;
        }
      }
      
      console.log(`不加limit查询:   ${noLimitResult.data.length} 个学生`);
      console.log(`加limit(10000):  ${withLimitResult.data.length} 个学生`);
      console.log(`分页查询:        ${paginatedStudents.length} 个学生`);
      console.log(`卡片显示数量:    ${classInfo.studentCount || 0} 个学生`);
      
      // 判断是否有问题
      if (noLimitResult.data.length !== withLimitResult.data.length) {
        console.log(`⚠️ 警告：该班级学生超过20个，不加limit会丢失数据！`);
        console.log(`   丢失学生数: ${withLimitResult.data.length - noLimitResult.data.length}`);
      } else if (withLimitResult.data.length > 20) {
        console.log(`✅ 该班级有 ${withLimitResult.data.length} 个学生，加limit后可以正常查询`);
      } else {
        console.log(`✅ 该班级学生未超过20个，无此问题`);
      }
      
      // 检查前端是否能正确显示
      if (classInfo.studentCount !== withLimitResult.data.length) {
        console.log(`⚠️ 前端显示数量(${classInfo.studentCount})与实际数量(${withLimitResult.data.length})不一致！`);
      }
    }
    
    // 3. 检查当前页面的显示
    console.log('\n========== 前端显示检查 ==========');
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index') || pages[pages.length - 1];
    
    if (currentPage) {
      console.log(`前端班级列表: ${currentPage.data.classes.length} 个班级`);
      console.log(`前端学生列表: ${currentPage.data.students.length} 个学生`);
      
      // 检查每个班级的学生显示
      for (const classInfo of currentPage.data.classes) {
        const classStudents = currentPage.data.students.filter(s => s.classId === classInfo.id);
        console.log(`- ${classInfo.name}: 前端显示${classStudents.length}个，卡片显示${classInfo.studentCount}个`);
      }
    }
    
    console.log('\n✅ 测试完成');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 导出到全局
if (typeof window !== 'undefined') {
  window.testSingleClassLimit = testSingleClassLimit;
}

console.log('='.repeat(60));
console.log('单个班级学生显示限制测试工具');
console.log('='.repeat(60));
console.log('\n使用方法:');
console.log('testSingleClassLimit() - 测试每个班级的学生显示是否正常');
console.log('\n');

