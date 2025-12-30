// 测试教师学生关联修复效果
// 在微信开发者工具控制台中运行此脚本

async function testTeacherStudentAssociationFix() {
  console.log('=== 教师学生关联修复测试 ===');
  
  try {
    // 1. 检查云开发环境
    if (!wx.cloud) {
      console.error('❌ 云开发环境不可用');
      return;
    }
    
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    console.log('当前教师ID:', teacherId);
    
    // 2. 查询教师的班级数据
    console.log('\n📚 检查班级数据...');
    const classesResult = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    console.log('查询到的班级数量:', classesResult.data.length);
    if (classesResult.data.length > 0) {
      classesResult.data.forEach(cls => {
        console.log(`- 班级: ${cls.name} (ID: ${cls._id})`);
      });
      
      // 3. 测试新的学生查询逻辑
      console.log('\n👥 测试学生查询逻辑...');
      const teacherClassIds = classesResult.data.map(cls => cls._id);
      console.log('教师班级ID列表:', teacherClassIds);
      
      if (teacherClassIds.length > 0) {
        try {
          // 使用新的查询逻辑
          const studentsResult = await db.collection('students').where({
            classId: db.command.in(teacherClassIds)
          }).get();
          
          console.log('✅ 新查询逻辑成功');
          console.log('查询到的学生数量:', studentsResult.data.length);
          
          if (studentsResult.data.length > 0) {
            console.log('\n学生列表:');
            studentsResult.data.forEach(student => {
              console.log(`- ${student.name} (班级: ${student.class || '未分配'}, classId: ${student.classId})`);
            });
            
            // 4. 验证关联关系
            console.log('\n🔗 验证关联关系...');
            const classStudentMap = {};
            studentsResult.data.forEach(student => {
              if (!classStudentMap[student.classId]) {
                classStudentMap[student.classId] = [];
              }
              classStudentMap[student.classId].push(student.name);
            });
            
            Object.keys(classStudentMap).forEach(classId => {
              const className = classesResult.data.find(c => c._id === classId)?.name || '未知班级';
              console.log(`${className} (${classId}): ${classStudentMap[classId].join(', ')}`);
            });
            
          } else {
            console.log('⚠️ 没有找到属于这些班级的学生');
          }
          
        } catch (queryError) {
          console.error('❌ 新查询逻辑失败:', queryError);
          
          // 尝试备用方法
          console.log('\n🔄 尝试备用查询方法...');
          const allStudentsResult = await db.collection('students').get();
          const filteredStudents = allStudentsResult.data.filter(student => 
            teacherClassIds.includes(student.classId)
          );
          
          console.log('备用方法查询到的学生数量:', filteredStudents.data.length);
        }
        
      } else {
        console.log('⚠️ 没有找到教师的班级，无法测试学生查询');
      }
      
    } else {
      console.log('⚠️ 没有找到教师的班级数据');
      console.log('建议：先创建班级或检查teacherId是否正确');
    }
    
    // 5. 检查本地存储
    console.log('\n💾 检查本地存储...');
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const localStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log('本地班级数量:', localClasses.length);
    console.log('本地学生数量:', localStudents.length);
    
    // 6. 测试页面加载逻辑
    console.log('\n🔄 测试页面数据加载...');
    console.log('建议：重新编译小程序并查看教师端班级管理页面');
    console.log('预期结果：');
    console.log('- 122班应该重新出现');
    console.log('- 学生数据应该正确关联到班级');
    console.log('- 控制台应该显示正确的查询日志');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
testTeacherStudentAssociationFix();

console.log('\n=== 测试完成 ===');
console.log('如果测试显示问题，请按照以下步骤操作：');
console.log('1. 确保云数据库中有正确的班级数据');
console.log('2. 确保学生记录中有正确的classId字段');
console.log('3. 使用邀请码系统让学生重新加入班级');
console.log('4. 重新编译小程序测试效果');
