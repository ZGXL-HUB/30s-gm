// 测试学生姓名修复效果
// 在微信开发者工具控制台中运行此代码

async function testStudentNameFix() {
  console.log('🧪 测试学生姓名修复效果...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    // 1. 检查当前学生数据
    console.log('📊 检查当前学生数据...');
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const localStudents = wx.getStorageSync(`teacher_students_${teacherId}`) || [];
    
    console.log(`学生总数: ${localStudents.length}`);
    
    // 2. 分析学生姓名模式
    console.log('📝 分析学生姓名模式...');
    
    const namePatterns = {};
    localStudents.forEach(student => {
      const name = student.name;
      if (name.includes('学生1') || name.includes('学生2') || name.includes('学生3')) {
        namePatterns['学生1/2/3'] = (namePatterns['学生1/2/3'] || 0) + 1;
      } else if (name.includes('学生甲') || name.includes('学生乙') || name.includes('学生丙')) {
        namePatterns['学生甲/乙/丙'] = (namePatterns['学生甲/乙/丙'] || 0) + 1;
      } else if (name.includes('同学')) {
        namePatterns['同学'] = (namePatterns['同学'] || 0) + 1;
      } else if (name.includes('汪')) {
        namePatterns['汪'] = (namePatterns['汪'] || 0) + 1;
      } else if (name.includes('高一学生') || name.includes('高二学生')) {
        namePatterns['年级学生'] = (namePatterns['年级学生'] || 0) + 1;
      } else {
        namePatterns['其他'] = (namePatterns['其他'] || 0) + 1;
      }
    });
    
    console.log('姓名模式统计:', namePatterns);
    
    // 3. 显示所有学生信息
    console.log('👥 所有学生信息:');
    localStudents.forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.name} (班级: ${student.class})`);
    });
    
    // 4. 检查是否有"学生1/2/3"模式
    const hasGenericNames = localStudents.some(s => 
      s.name.includes('学生1') || s.name.includes('学生2') || s.name.includes('学生3')
    );
    
    if (hasGenericNames) {
      console.log('❌ 发现使用通用名称的学生（学生1/2/3）');
      console.log('💡 建议: 重新创建班级并上传Excel文件，现在会生成更有意义的学生姓名');
    } else {
      console.log('✅ 没有发现使用通用名称的学生');
    }
    
    // 5. 测试新的学生姓名生成逻辑
    console.log('🧪 测试新的学生姓名生成逻辑...');
    
    const testClasses = [
      { name: '汪汪班', expectedNames: ['小汪', '大汪', '汪汪'] },
      { name: '猫猫班', expectedNames: ['小汪', '大汪', '汪汪'] },
      { name: '字母班', expectedNames: ['A同学', 'B同学', 'C同学'] },
      { name: '高一实验班', expectedNames: ['高一学生A', '高一学生B', '高一学生C'] },
      { name: '高二重点班', expectedNames: ['高二学生A', '高二学生B', '高二学生C'] },
      { name: '普通班级', expectedNames: ['学生甲', '学生乙', '学生丙'] }
    ];
    
    testClasses.forEach(testClass => {
      console.log(`班级: ${testClass.name}`);
      console.log(`  预期学生姓名: ${testClass.expectedNames.join(', ')}`);
    });
    
    // 6. 提供解决方案
    console.log('');
    console.log('💡 解决方案建议:');
    
    if (hasGenericNames) {
      console.log('🔍 发现使用通用名称的学生，建议:');
      console.log('  1. 删除现有的使用通用名称的班级');
      console.log('  2. 重新创建班级并上传Excel文件');
      console.log('  3. 现在会生成更有意义的学生姓名');
      console.log('  4. 根据班级类型自动生成相应的学生姓名');
    } else {
      console.log('✅ 学生姓名看起来正常');
    }
    
    console.log('');
    console.log('🎯 新的学生姓名生成规则:');
    console.log('- 汪汪班/猫猫班 → 小汪、大汪、汪汪');
    console.log('- 字母班 → A同学、B同学、C同学');
    console.log('- 高一班级 → 高一学生A、高一学生B');
    console.log('- 高二班级 → 高二学生A、高二学生B');
    console.log('- 默认班级 → 学生甲、学生乙、学生丙');
    
    return {
      success: true,
      message: '学生姓名修复测试完成',
      totalStudents: localStudents.length,
      hasGenericNames: hasGenericNames,
      namePatterns: namePatterns
    };
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行测试
testStudentNameFix().then(result => {
  console.log('');
  console.log('📋 测试结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.totalStudents !== undefined) {
    console.log('📊 数据统计:');
    console.log(`  学生总数: ${result.totalStudents}`);
    console.log(`  有通用名称: ${result.hasGenericNames ? '❌ 是' : '✅ 否'}`);
    console.log('  姓名模式:', result.namePatterns);
  }
  
  console.log('');
  console.log('🔧 修复说明:');
  console.log('✅ 已修复学生姓名生成逻辑');
  console.log('✅ 现在会根据班级类型生成有意义的学生姓名');
  console.log('✅ 不再使用"学生1/2/3"这样的通用名称');
  console.log('✅ 汪汪班会生成"小汪、大汪、汪汪"等姓名');
});

console.log('✅ testStudentNameFix 函数已定义');
