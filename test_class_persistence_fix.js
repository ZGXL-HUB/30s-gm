// 测试班级数据持久化修复脚本
// 在微信开发者工具控制台中运行此脚本

async function testClassPersistenceFix() {
  console.log('🧪 开始测试班级数据持久化修复...');
  
  try {
    // 检查云开发环境
    console.log('📡 检查云开发环境...');
    const cloud = wx.cloud;
    if (!cloud) {
      throw new Error('云开发环境未初始化');
    }
    
    const db = cloud.database();
    console.log('✅ 云开发环境正常');
    
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    console.log('👨‍🏫 当前教师ID:', teacherId);
    
    // 1. 检查本地存储中的班级数据
    console.log('\n📋 检查本地存储中的班级数据...');
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    console.log('本地班级数量:', localClasses.length);
    localClasses.forEach((cls, index) => {
      console.log(`  ${index + 1}. ${cls.name} (ID: ${cls.id})`);
    });
    
    // 2. 检查云端存储中的班级数据
    console.log('\n☁️ 检查云端存储中的班级数据...');
    try {
      const cloudClasses = await db.collection('classes').where({
        teacherId: teacherId
      }).get();
      
      console.log('云端班级数量:', cloudClasses.data.length);
      cloudClasses.data.forEach((cls, index) => {
        console.log(`  ${index + 1}. ${cls.name} (ID: ${cls._id})`);
      });
      
      // 比较本地和云端数据
      console.log('\n🔄 数据一致性检查...');
      if (localClasses.length === cloudClasses.data.length) {
        console.log('✅ 本地和云端班级数量一致');
      } else {
        console.log('⚠️ 本地和云端班级数量不一致');
        console.log(`本地: ${localClasses.length}, 云端: ${cloudClasses.data.length}`);
      }
      
    } catch (cloudError) {
      console.warn('⚠️ 无法访问云端班级数据:', cloudError.message);
    }
    
    // 3. 检查学生数据中的班级关联
    console.log('\n👥 检查学生数据中的班级关联...');
    try {
      const cloudStudents = await db.collection('students').get();
      
      if (cloudStudents.data.length > 0) {
        console.log('学生总数:', cloudStudents.data.length);
        
        // 统计各班级的学生数量
        const classStudentCount = {};
        cloudStudents.data.forEach(student => {
          const className = student.class || '未分配班级';
          classStudentCount[className] = (classStudentCount[className] || 0) + 1;
        });
        
        console.log('各班级学生分布:');
        Object.entries(classStudentCount).forEach(([className, count]) => {
          console.log(`  ${className}: ${count}人`);
        });
        
        // 检查是否有122班的学生
        const class122Students = cloudStudents.data.filter(s => s.class === '122' || s.class === '122班');
        if (class122Students.length > 0) {
          console.log(`\n🎯 找到122班学生 ${class122Students.length}人:`);
          class122Students.forEach(student => {
            console.log(`  - ${student.name} (ID: ${student._id})`);
          });
        } else {
          console.log('\n❌ 未找到122班的学生数据');
        }
      } else {
        console.log('❌ 云端没有学生数据');
      }
      
    } catch (cloudError) {
      console.warn('⚠️ 无法访问云端学生数据:', cloudError.message);
    }
    
    // 4. 测试班级创建功能
    console.log('\n🔧 测试班级创建功能...');
    const testClassData = {
      name: `测试班级_${Date.now()}`,
      classType: '普通班',
      subjectType: '英语',
      grade: '高三',
      semester: '上学期'
    };
    
    try {
      const db = wx.cloud.database();
      const createResult = await db.collection('classes').add({
        data: {
          ...testClassData,
          teacherId: teacherId,
          studentCount: 0,
          teacher: '张老师',
          createdAt: new Date().toISOString().slice(0, 10),
          lastActivity: new Date().toISOString(),
          status: 'active',
          averageAccuracy: 0,
          completedAssignments: 0,
          totalAssignments: 0
        }
      });
      
      console.log('✅ 测试班级创建成功:', testClassData.name);
      console.log('云端ID:', createResult._id);
      
      // 更新本地存储
      const existingClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
      const newClass = {
        id: createResult._id,
        ...testClassData,
        studentCount: 0,
        teacher: '张老师',
        createdAt: new Date().toISOString().slice(0, 10),
        lastActivity: new Date().toISOString(),
        status: 'active',
        averageAccuracy: 0,
        completedAssignments: 0,
        totalAssignments: 0
      };
      existingClasses.unshift(newClass);
      wx.setStorageSync(`teacher_classes_${teacherId}`, existingClasses);
      
      console.log('✅ 本地存储已更新');
      
    } catch (createError) {
      console.error('❌ 测试班级创建失败:', createError.message);
    }
    
    // 5. 最终验证
    console.log('\n🎯 最终验证...');
    const finalLocalClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    console.log('修复后本地班级数量:', finalLocalClasses.length);
    
    try {
      const finalCloudClasses = await db.collection('classes').where({
        teacherId: teacherId
      }).get();
      console.log('修复后云端班级数量:', finalCloudClasses.data.length);
    } catch (error) {
      console.warn('无法验证云端数据:', error.message);
    }
    
    console.log('\n✅ 班级数据持久化修复测试完成');
    
    return {
      success: true,
      localClasses: finalLocalClasses.length,
      message: '测试完成，请检查控制台输出'
    };
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    return {
      success: false,
      error: error.message,
      message: '测试过程中发生错误'
    };
  }
}

// 运行测试
testClassPersistenceFix().then(result => {
  console.log('🏁 测试结果:', result);
}).catch(error => {
  console.error('💥 测试异常:', error);
});

// 导出函数供手动调用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testClassPersistenceFix };
}
