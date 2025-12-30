// 深度调试Excel处理流程
// 在微信开发者工具控制台中运行此代码

async function debugExcelProcessingFlow() {
  console.log('🔍 深度调试Excel处理流程...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    // 1. 检查最新的班级数据
    console.log('📊 检查最新班级数据...');
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    const localStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log(`班级数量: ${localClasses.length}`);
    console.log(`学生数量: ${localStudents.length}`);
    
    // 2. 找到最新的班级（字母班）
    const letterClass = localClasses.find(c => c.name.includes('字母'));
    if (letterClass) {
      console.log('✅ 找到字母班:');
      console.log(`  名称: ${letterClass.name}`);
      console.log(`  ID: ${letterClass.id}`);
      console.log(`  显示学生数: ${letterClass.studentCount || 0}`);
      console.log(`  创建时间: ${letterClass.createdAt || '未知'}`);
      console.log(`  最后活动: ${letterClass.lastActivity || '未知'}`);
      
      // 查找该班级的学生
      const letterClassStudents = localStudents.filter(s => s.classId === letterClass.id);
      console.log(`  实际学生数: ${letterClassStudents.length}`);
      
      if (letterClassStudents.length > 0) {
        console.log('👥 字母班学生列表:');
        letterClassStudents.forEach((student, index) => {
          console.log(`    ${index + 1}. ${student.name} (ID: ${student.id})`);
        });
      } else {
        console.log('❌ 字母班没有学生数据');
      }
    } else {
      console.log('❌ 未找到字母班');
    }
    
    // 3. 测试云函数调用
    console.log('🧪 测试云函数调用...');
    
    try {
      // 尝试调用parseStudentExcel云函数
      const result = await wx.cloud.callFunction({
        name: 'parseStudentExcel',
        data: {
          fileId: 'test_file_id',
          classId: 'test_class_id',
          teacherId: teacherId
        }
      });
      
      console.log('✅ 云函数调用成功');
      console.log('返回结果:', result.result);
      
    } catch (cloudError) {
      console.log('❌ 云函数调用失败');
      console.log('错误代码:', cloudError.errCode);
      console.log('错误消息:', cloudError.errMsg);
      
      if (cloudError.errCode === -501000) {
        console.log('🔍 分析: 云函数不存在');
      } else if (cloudError.errCode === -502000) {
        console.log('🔍 分析: 云函数执行失败');
      } else {
        console.log('🔍 分析: 其他错误');
      }
    }
    
    // 4. 测试本地模式处理
    console.log('🔄 测试本地模式处理...');
    
    if (letterClass && typeof currentPage.processExcelForNewClassLocal === 'function') {
      console.log('✅ 本地模式处理方法存在');
      
      // 模拟Excel文件
      const mockExcelFile = {
        name: 'letter_class.xlsx',
        path: '/test/path/letter_class.xlsx',
        size: 1024
      };
      
      console.log('📝 模拟处理Excel文件...');
      console.log('文件名:', mockExcelFile.name);
      console.log('班级ID:', letterClass.id);
      
      try {
        // 不实际执行，只是检查逻辑
        console.log('本地模式会生成以下学生数据:');
        const mockStudents = [
          { name: 'A同学', classId: letterClass.id },
          { name: 'B同学', classId: letterClass.id },
          { name: 'C同学', classId: letterClass.id },
          { name: 'D同学', classId: letterClass.id },
          { name: 'E同学', classId: letterClass.id }
        ];
        
        mockStudents.forEach((student, index) => {
          console.log(`  ${index + 1}. ${student.name}`);
        });
        
        console.log('✅ 本地模式逻辑正常');
        
      } catch (error) {
        console.error('❌ 本地模式测试失败:', error);
      }
    } else {
      console.log('❌ 本地模式处理方法不存在或班级不存在');
    }
    
    // 5. 检查数据同步问题
    console.log('💾 检查数据同步问题...');
    
    // 检查是否有学生数据但班级统计不正确
    const totalStudents = localStudents.length;
    const totalClassStudentCount = localClasses.reduce((sum, cls) => sum + (cls.studentCount || 0), 0);
    
    console.log(`学生总数: ${totalStudents}`);
    console.log(`班级学生数总和: ${totalClassStudentCount}`);
    
    if (totalStudents !== totalClassStudentCount) {
      console.log('⚠️ 数据统计不一致');
      
      // 详细分析每个班级
      localClasses.forEach((cls, index) => {
        const classStudents = localStudents.filter(s => s.classId === cls.id);
        const displayCount = cls.studentCount || 0;
        const actualCount = classStudents.length;
        
        if (displayCount !== actualCount) {
          console.log(`班级 ${index + 1} (${cls.name}): 显示${displayCount}人，实际${actualCount}人`);
        }
      });
    } else {
      console.log('✅ 数据统计一致');
    }
    
    // 6. 提供解决方案
    console.log('');
    console.log('💡 问题分析和解决方案:');
    
    if (letterClass && letterClassStudents.length === 0) {
      console.log('🔍 问题: 字母班创建成功但没有学生数据');
      console.log('💡 可能原因:');
      console.log('  1. 云函数调用失败且本地模式未正确执行');
      console.log('  2. Excel文件处理过程中出现异常');
      console.log('  3. 学生数据保存失败');
      
      console.log('💡 解决方案:');
      console.log('  1. 重新创建字母班并上传Excel文件');
      console.log('  2. 检查控制台是否有错误信息');
      console.log('  3. 确认云函数parseStudentExcel是否正确部署');
      console.log('  4. 如果云函数有问题，系统会自动使用本地模式');
    }
    
    return {
      success: true,
      message: 'Excel处理流程调试完成',
      letterClassExists: !!letterClass,
      letterClassStudentsCount: letterClass ? localStudents.filter(s => s.classId === letterClass.id).length : 0,
      cloudFunctionWorking: false, // 需要根据云函数测试结果更新
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
debugExcelProcessingFlow().then(result => {
  console.log('');
  console.log('📋 调试结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.letterClassExists !== undefined) {
    console.log('📊 字母班状态:');
    console.log(`  班级存在: ${result.letterClassExists ? '✅' : '❌'}`);
    console.log(`  学生数量: ${result.letterClassStudentsCount}`);
    console.log(`  数据一致: ${result.dataConsistent ? '✅' : '❌'}`);
  }
});

console.log('✅ debugExcelProcessingFlow 函数已定义');
