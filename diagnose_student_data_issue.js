// 诊断学生管理界面数据问题
// 在微信开发者工具控制台中运行此脚本

async function diagnoseStudentDataIssue() {
  console.log('🔍 开始诊断学生管理界面数据问题...');
  
  try {
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    console.log(`👤 当前教师ID: ${teacherId}`);
    
    // 1. 检查本地存储状态
    console.log('\n📱 检查本地存储状态:');
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const localStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log(`- 本地班级数据: ${localClasses.length} 个`);
    console.log(`- 本地学生数据: ${localStudents.length} 个`);
    
    if (localStudents.length > 0) {
      console.log('本地学生列表:');
      localStudents.forEach(student => {
        console.log(`  - ${student.name} (${student.studentId}) 班级: ${student.class}`);
      });
    }
    
    // 2. 检查云端班级数据
    console.log('\n☁️ 检查云端班级数据:');
    const cloudClasses = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    console.log(`- 云端班级数量: ${cloudClasses.data.length} 个`);
    cloudClasses.data.forEach(cls => {
      console.log(`  - ${cls.name} (ID: ${cls._id}, 学生数: ${cls.studentCount || 0})`);
    });
    
    // 3. 检查云端学生数据
    console.log('\n☁️ 检查云端学生数据:');
    const cloudStudents = await db.collection('students').where({
      teacherId: teacherId
    }).get();
    
    console.log(`- 云端学生数量: ${cloudStudents.data.length} 个`);
    cloudStudents.data.forEach(student => {
      console.log(`  - ${student.name} (ID: ${student._id}, 班级ID: ${student.classId})`);
    });
    
    // 4. 检查数据一致性
    console.log('\n🔍 检查数据一致性:');
    
    // 检查是否有孤立的学生数据（班级不存在）
    const orphanStudents = cloudStudents.data.filter(student => {
      if (!student.classId) return true;
      return !cloudClasses.data.some(cls => cls._id === student.classId);
    });
    
    if (orphanStudents.length > 0) {
      console.log(`⚠️ 发现 ${orphanStudents.length} 个孤立学生:`);
      orphanStudents.forEach(student => {
        console.log(`  - ${student.name} (班级ID: ${student.classId || '未分配'})`);
      });
    } else {
      console.log('✅ 所有学生都有对应的班级');
    }
    
    // 检查班级学生数量统计
    console.log('\n📊 检查班级学生数量统计:');
    cloudClasses.data.forEach(cls => {
      const actualStudentCount = cloudStudents.data.filter(s => s.classId === cls._id).length;
      const recordedCount = cls.studentCount || 0;
      
      if (actualStudentCount !== recordedCount) {
        console.log(`⚠️ ${cls.name}: 记录数量 ${recordedCount}, 实际数量 ${actualStudentCount}`);
      } else {
        console.log(`✅ ${cls.name}: 数量一致 (${actualStudentCount})`);
      }
    });
    
    // 5. 检查页面当前显示的数据
    console.log('\n🖥️ 检查页面当前显示的数据:');
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (currentPage && currentPage.route === 'pages/teacher-class/index') {
      const pageData = currentPage.data;
      console.log(`- 页面班级数据: ${pageData.classes ? pageData.classes.length : 0} 个`);
      console.log(`- 页面学生数据: ${pageData.students ? pageData.students.length : 0} 个`);
      
      if (pageData.students && pageData.students.length > 0) {
        console.log('页面学生列表:');
        pageData.students.forEach(student => {
          console.log(`  - ${student.name} (${student.studentId}) 班级: ${student.class}`);
        });
      }
    } else {
      console.log('ℹ️ 当前不在教师班级管理页面');
    }
    
    // 6. 生成诊断报告
    console.log('\n📋 诊断报告:');
    
    const issues = [];
    
    if (localStudents.length !== cloudStudents.data.length) {
      issues.push(`本地存储学生数量(${localStudents.length})与云端(${cloudStudents.data.length})不一致`);
    }
    
    if (localClasses.length !== cloudClasses.data.length) {
      issues.push(`本地存储班级数量(${localClasses.length})与云端(${cloudClasses.data.length})不一致`);
    }
    
    if (orphanStudents.length > 0) {
      issues.push(`${orphanStudents.length}个学生没有对应的班级`);
    }
    
    const inconsistentClasses = cloudClasses.data.filter(cls => {
      const actualCount = cloudStudents.data.filter(s => s.classId === cls._id).length;
      return actualCount !== (cls.studentCount || 0);
    });
    
    if (inconsistentClasses.length > 0) {
      issues.push(`${inconsistentClasses.length}个班级的学生数量统计不准确`);
    }
    
    if (issues.length === 0) {
      console.log('✅ 没有发现数据一致性问题');
    } else {
      console.log('❌ 发现以下问题:');
      issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    return {
      success: true,
      issues: issues,
      stats: {
        localClasses: localClasses.length,
        localStudents: localStudents.length,
        cloudClasses: cloudClasses.data.length,
        cloudStudents: cloudStudents.data.length,
        orphanStudents: orphanStudents.length
      }
    };
    
  } catch (error) {
    console.error('❌ 诊断过程中发生错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行诊断
diagnoseStudentDataIssue().then(result => {
  if (result.success) {
    console.log('\n🎯 诊断完成！');
    if (result.issues.length > 0) {
      console.log('建议运行修复脚本: fixStudentManagementDataSync()');
    }
  } else {
    console.log('❌ 诊断失败:', result.error);
  }
});

// 导出函数供手动调用
window.diagnoseStudentDataIssue = diagnoseStudentDataIssue;
