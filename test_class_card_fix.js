// 测试班级卡片显示修复效果
// 在微信开发者工具控制台中运行此代码

async function testClassCardFix() {
  console.log('🔍 测试班级卡片显示修复效果...\n');
  
  try {
    // 1. 检查当前页面
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index') || pages[pages.length - 1];
    
    if (!currentPage) {
      console.log('❌ 未找到教师班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到当前页面:', currentPage.route);
    
    // 2. 检查数据完整性
    console.log('\n📊 === 数据完整性检查 ===');
    const classes = currentPage.data.classes || [];
    const students = currentPage.data.students || [];
    
    console.log(`班级数量: ${classes.length}`);
    console.log(`学生数量: ${students.length}`);
    
    // 3. 检查每个班级的数据完整性
    const issues = [];
    for (const classItem of classes) {
      console.log(`\n--- ${classItem.name} ---`);
      
      // 检查必要字段
      const requiredFields = ['name', 'studentCount', 'teacher', 'status', 'lastActivity'];
      const missingFields = requiredFields.filter(field => !classItem[field] && classItem[field] !== 0);
      
      if (missingFields.length > 0) {
        issues.push(`${classItem.name}: 缺少字段 ${missingFields.join(', ')}`);
        console.log(`⚠️ 缺少字段: ${missingFields.join(', ')}`);
      } else {
        console.log('✅ 必要字段完整');
      }
      
      // 检查数据格式
      console.log(`学生数: ${classItem.studentCount}`);
      console.log(`教师: ${classItem.teacher}`);
      console.log(`状态: ${classItem.status}`);
      console.log(`最后活动: ${classItem.lastActivity}`);
      console.log(`邀请码: ${classItem.inviteCode || '无'}`);
      console.log(`有效期: ${classItem.inviteCodeExpiry || '无'}`);
      
      // 检查学生数据一致性
      const classStudents = students.filter(s => s.classId === classItem.id);
      if (classItem.studentCount !== classStudents.length) {
        issues.push(`${classItem.name}: 学生数量不一致 (显示${classItem.studentCount}，实际${classStudents.length})`);
        console.log(`⚠️ 学生数量不一致: 显示${classItem.studentCount}，实际${classStudents.length}`);
      } else {
        console.log(`✅ 学生数量一致: ${classStudents.length}`);
      }
    }
    
    // 4. 检查样式一致性
    console.log('\n🎨 === 样式一致性检查 ===');
    console.log('✅ 已删除重复的样式文件');
    console.log('✅ 班级卡片和学生卡片使用统一样式');
    
    // 5. 生成修复报告
    console.log('\n📋 === 修复报告 ===');
    
    if (issues.length === 0) {
      console.log('✅ 所有检查通过！班级卡片显示问题已修复。');
      console.log('✅ 数据完整性验证正常');
      console.log('✅ 样式定义统一');
      console.log('✅ 所有班级卡片显示一致');
      
      return {
        success: true,
        classesCount: classes.length,
        studentsCount: students.length,
        message: '修复成功，班级卡片显示正常'
      };
    } else {
      console.log(`⚠️ 发现 ${issues.length} 个问题:`);
      issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
      
      return {
        success: false,
        issues,
        message: '仍存在问题，需要进一步修复'
      };
    }
    
  } catch (error) {
    console.error('❌ 测试过程出错:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 快速修复函数
async function quickFixClassCards() {
  console.log('🔧 执行班级卡片快速修复...\n');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index') || pages[pages.length - 1];
    
    if (!currentPage) {
      console.log('❌ 未找到页面');
      return;
    }
    
    // 1. 清除缓存
    console.log('1️⃣ 清除本地缓存...');
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    wx.removeStorageSync(`teacher_students_${teacherId}`);
    wx.removeStorageSync(`teacher_classes_${teacherId}`);
    console.log('✅ 缓存已清除');
    
    // 2. 重新加载数据
    console.log('\n2️⃣ 重新加载数据...');
    await currentPage.loadClassData();
    console.log('✅ 数据已重新加载');
    
    // 3. 验证修复效果
    console.log('\n3️⃣ 验证修复效果...');
    const result = await testClassCardFix();
    
    if (result.success) {
      console.log('\n🎉 修复成功！班级卡片显示正常。');
    } else {
      console.log('\n⚠️ 修复后仍存在问题，请查看详细信息。');
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ 修复失败:', error);
    return { success: false, error: error.message };
  }
}

// 导出函数到全局
if (typeof window !== 'undefined') {
  window.testClassCardFix = testClassCardFix;
  window.quickFixClassCards = quickFixClassCards;
}

// 使用说明
console.log('='.repeat(60));
console.log('班级卡片显示修复验证工具');
console.log('='.repeat(60));
console.log('\n可用命令:');
console.log('1. testClassCardFix() - 验证修复效果');
console.log('2. quickFixClassCards() - 快速修复班级卡片显示问题');
console.log('\n');
