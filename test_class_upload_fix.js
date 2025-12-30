// 测试班级数据上传修复
// 在微信开发者工具控制台中运行此脚本

async function testClassUploadFix() {
  console.log('🧪 开始测试班级数据上传修复...');
  
  try {
    const db = wx.cloud.database();
    
    // 测试数据
    const testClass = {
      id: 'test_class_' + Date.now(),
      name: '测试班级',
      classType: '普通班',
      subjectType: '英语',
      grade: '高三',
      semester: '上学期',
      teacherId: 'test_teacher_123',
      createdAt: new Date().toISOString().slice(0, 10),
      lastActivity: new Date().toISOString(),
      status: 'active',
      averageAccuracy: 0,
      completedAssignments: 0,
      totalAssignments: 0
    };
    
    const testStudent = {
      id: 'test_student_' + Date.now(),
      name: '测试学生',
      studentId: 'S' + Date.now(),
      phone: '13800138000',
      email: 'test@example.com',
      class: testClass.name,
      classId: testClass.id,
      teacherId: testClass.teacherId,
      status: 'active',
      completedAssignments: 0,
      totalAssignments: 0,
      averageAccuracy: 0,
      weakGrammarPoints: [],
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    console.log('📝 测试班级数据上传...');
    
    // 测试班级数据上传
    try {
      await db.collection('classes').add({
        data: testClass
      });
      console.log('✅ 班级数据上传成功');
    } catch (error) {
      if (error.errCode === -502005) {
        console.log('❌ 班级数据上传失败: 集合不存在');
        console.log('💡 请先运行 fix_cloud_collections.js 脚本');
        return;
      } else {
        console.log('❌ 班级数据上传失败:', error.message);
        return;
      }
    }
    
    console.log('👥 测试学生数据上传...');
    
    // 测试学生数据上传
    try {
      await db.collection('students').add({
        data: testStudent
      });
      console.log('✅ 学生数据上传成功');
    } catch (error) {
      if (error.errCode === -502005) {
        console.log('❌ 学生数据上传失败: 集合不存在');
        console.log('💡 请先运行 fix_cloud_collections.js 脚本');
        return;
      } else {
        console.log('❌ 学生数据上传失败:', error.message);
        return;
      }
    }
    
    console.log('🔍 验证数据是否正确保存...');
    
    // 验证班级数据
    const classResult = await db.collection('classes').where({
      id: testClass.id
    }).get();
    
    if (classResult.data.length > 0) {
      console.log('✅ 班级数据验证成功');
    } else {
      console.log('❌ 班级数据验证失败');
    }
    
    // 验证学生数据
    const studentResult = await db.collection('students').where({
      id: testStudent.id
    }).get();
    
    if (studentResult.data.length > 0) {
      console.log('✅ 学生数据验证成功');
    } else {
      console.log('❌ 学生数据验证失败');
    }
    
    console.log('🧹 清理测试数据...');
    
    // 清理测试数据
    try {
      if (classResult.data.length > 0) {
        await db.collection('classes').doc(classResult.data[0]._id).remove();
        console.log('✅ 测试班级数据已清理');
      }
      
      if (studentResult.data.length > 0) {
        await db.collection('students').doc(studentResult.data[0]._id).remove();
        console.log('✅ 测试学生数据已清理');
      }
    } catch (cleanupError) {
      console.warn('⚠️ 清理测试数据时发生错误:', cleanupError);
    }
    
    console.log('🎉 测试完成！班级数据上传功能正常工作。');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
testClassUploadFix();
