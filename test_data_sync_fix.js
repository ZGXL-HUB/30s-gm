// 测试数据同步修复
// 在微信开发者工具控制台中运行此代码

async function testDataSyncFix() {
  console.log('🧪 测试数据同步修复...');
  
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
    
    console.log(`本地班级数量: ${localClasses.length}`);
    console.log(`本地学生数量: ${localStudents.length}`);
    
    // 2. 检查云端数据
    console.log('☁️ 检查云端数据...');
    
    if (wx.cloud) {
      try {
        const db = wx.cloud.database();
        
        // 查询云端班级数据
        const cloudClassesResult = await db.collection('classes')
          .where({ teacherId: teacherId })
          .get();
        
        console.log(`云端班级数量: ${cloudClassesResult.data.length}`);
        
        // 查询云端学生数据
        const cloudStudentsResult = await db.collection('students')
          .where({ teacherId: teacherId })
          .get();
        
        console.log(`云端学生数量: ${cloudStudentsResult.data.length}`);
        
        // 3. 对比数据一致性
        console.log('🔍 数据一致性检查...');
        
        const localClassCount = localClasses.length;
        const cloudClassCount = cloudClassesResult.data.length;
        const localStudentCount = localStudents.length;
        const cloudStudentCount = cloudStudentsResult.data.length;
        
        console.log(`班级数据一致性: ${localClassCount === cloudClassCount ? '✅ 一致' : '❌ 不一致'}`);
        console.log(`学生数据一致性: ${localStudentCount === cloudStudentCount ? '✅ 一致' : '❌ 不一致'}`);
        
        // 4. 详细分析班级数据
        console.log('📚 详细班级数据分析:');
        
        localClasses.forEach((localClass, index) => {
          const cloudClass = cloudClassesResult.data.find(c => c.id === localClass.id);
          
          console.log(`班级 ${index + 1}: ${localClass.name}`);
          console.log(`  本地学生数: ${localClass.studentCount || 0}`);
          console.log(`  云端学生数: ${cloudClass?.studentCount || 0}`);
          console.log(`  云端存在: ${cloudClass ? '✅' : '❌'}`);
          
          // 检查该班级的学生
          const classStudents = localStudents.filter(s => s.classId === localClass.id);
          console.log(`  本地实际学生数: ${classStudents.length}`);
          
          if (classStudents.length > 0) {
            console.log('  学生列表:');
            classStudents.forEach((student, sIndex) => {
              console.log(`    ${sIndex + 1}. ${student.name}`);
            });
          }
          console.log('');
        });
        
        // 5. 提供修复建议
        console.log('💡 修复建议:');
        
        const missingClasses = localClasses.filter(localClass => 
          !cloudClassesResult.data.find(cloudClass => cloudClass.id === localClass.id)
        );
        
        if (missingClasses.length > 0) {
          console.log('🔍 发现云端缺失的班级:');
          missingClasses.forEach(cls => {
            console.log(`  - ${cls.name} (ID: ${cls.id})`);
          });
          console.log('💡 建议: 这些班级需要同步到云端数据库');
        }
        
        const missingStudents = localStudents.filter(localStudent => 
          !cloudStudentsResult.data.find(cloudStudent => cloudStudent.id === localStudent.id)
        );
        
        if (missingStudents.length > 0) {
          console.log('🔍 发现云端缺失的学生:');
          missingStudents.forEach(student => {
            console.log(`  - ${student.name} (班级: ${student.class})`);
          });
          console.log('💡 建议: 这些学生需要同步到云端数据库');
        }
        
        if (missingClasses.length === 0 && missingStudents.length === 0) {
          console.log('✅ 数据同步正常，本地和云端数据一致');
        }
        
        return {
          success: true,
          message: '数据同步检查完成',
          localClasses: localClassCount,
          cloudClasses: cloudClassCount,
          localStudents: localStudentCount,
          cloudStudents: cloudStudentCount,
          classesConsistent: localClassCount === cloudClassCount,
          studentsConsistent: localStudentCount === cloudStudentCount,
          missingClasses: missingClasses.length,
          missingStudents: missingStudents.length
        };
        
      } catch (cloudError) {
        console.error('❌ 云端数据检查失败:', cloudError);
        return {
          success: false,
          error: cloudError.message
        };
      }
    } else {
      console.log('⚠️ 云开发环境不可用，仅检查本地数据');
      return {
        success: true,
        message: '仅本地数据检查完成',
        localClasses: localClasses.length,
        localStudents: localStudents.length
      };
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行测试
testDataSyncFix().then(result => {
  console.log('');
  console.log('📋 测试结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.localClasses !== undefined) {
    console.log('📊 数据统计:');
    console.log(`  本地班级: ${result.localClasses}`);
    console.log(`  云端班级: ${result.cloudClasses || 'N/A'}`);
    console.log(`  本地学生: ${result.localStudents}`);
    console.log(`  云端学生: ${result.cloudStudents || 'N/A'}`);
    
    if (result.classesConsistent !== undefined) {
      console.log(`  班级一致: ${result.classesConsistent ? '✅' : '❌'}`);
      console.log(`  学生一致: ${result.studentsConsistent ? '✅' : '❌'}`);
      console.log(`  缺失班级: ${result.missingClasses}`);
      console.log(`  缺失学生: ${result.missingStudents}`);
    }
  }
});

console.log('✅ testDataSyncFix 函数已定义');
