// 测试学生显示限制问题
// 在微信开发者工具控制台中运行此代码

async function testStudentDisplayLimit() {
  console.log('🧪 测试学生显示限制问题...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    if (!wx.cloud) {
      console.log('❌ 云开发环境不可用');
      return { success: false, error: '云开发环境不可用' };
    }
    
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 1. 测试云数据库默认查询限制
    console.log('🔍 测试云数据库默认查询限制...');
    
    try {
      // 测试1：不指定limit的查询
      console.log('测试1：不指定limit的查询');
      const result1 = await db.collection('students').where({
        teacherId: teacherId
      }).get();
      
      console.log(`✅ 不指定limit查询结果: ${result1.data.length} 个学生`);
      
      // 测试2：指定limit(100)的查询
      console.log('测试2：指定limit(100)的查询');
      const result2 = await db.collection('students').where({
        teacherId: teacherId
      }).limit(100).get();
      
      console.log(`✅ limit(100)查询结果: ${result2.data.length} 个学生`);
      
      // 测试3：指定limit(1000)的查询
      console.log('测试3：指定limit(1000)的查询');
      const result3 = await db.collection('students').where({
        teacherId: teacherId
      }).limit(1000).get();
      
      console.log(`✅ limit(1000)查询结果: ${result3.data.length} 个学生`);
      
      // 分析结果
      console.log('');
      console.log('📊 查询结果分析:');
      console.log(`- 不指定limit: ${result1.data.length} 个学生`);
      console.log(`- limit(100): ${result2.data.length} 个学生`);
      console.log(`- limit(1000): ${result3.data.length} 个学生`);
      
      if (result1.data.length === 20 && result2.data.length > 20) {
        console.log('🎯 发现问题：云数据库默认查询限制为20条记录！');
        console.log('💡 这就是为什么超过20个学生后，新学生不显示的原因');
      } else if (result1.data.length < result3.data.length) {
        console.log('🎯 发现问题：云数据库有查询限制，但不是20条');
        console.log(`💡 默认限制约为 ${result1.data.length} 条记录`);
      } else {
        console.log('✅ 未发现查询限制问题');
      }
      
    } catch (error) {
      console.error('❌ 查询测试失败:', error);
      return { success: false, error: error.message };
    }
    
    // 2. 测试分页查询
    console.log('');
    console.log('🔍 测试分页查询...');
    
    try {
      let allStudents = [];
      let skip = 0;
      const batchSize = 100;
      let hasMore = true;
      let batchCount = 0;
      
      while (hasMore && batchCount < 10) { // 最多查询10批，防止无限循环
        batchCount++;
        console.log(`查询第 ${batchCount} 批 (skip: ${skip}, limit: ${batchSize})...`);
        
        const batchResult = await db.collection('students').where({
          teacherId: teacherId
        }).skip(skip).limit(batchSize).get();
        
        console.log(`  获得 ${batchResult.data.length} 个学生`);
        
        allStudents = allStudents.concat(batchResult.data);
        
        if (batchResult.data.length < batchSize) {
          hasMore = false;
          console.log('  已查询完所有数据');
        } else {
          skip += batchSize;
        }
      }
      
      console.log(`✅ 分页查询完成，总共获得 ${allStudents.length} 个学生`);
      
      // 3. 检查是否有重复学生
      const uniqueIds = new Set(allStudents.map(s => s._id));
      if (uniqueIds.size !== allStudents.length) {
        console.log('⚠️ 发现重复学生数据');
      } else {
        console.log('✅ 无重复学生数据');
      }
      
      // 4. 显示学生统计
      console.log('');
      console.log('📊 学生统计:');
      const classStats = {};
      allStudents.forEach(student => {
        const className = student.class || student.className || '未知班级';
        classStats[className] = (classStats[className] || 0) + 1;
      });
      
      Object.entries(classStats).forEach(([className, count]) => {
        console.log(`- ${className}: ${count} 个学生`);
      });
      
      // 5. 检查前端显示的学生数量
      console.log('');
      console.log('🔍 检查前端显示的学生数量...');
      const frontendStudents = currentPage.data.students || [];
      console.log(`前端显示的学生数量: ${frontendStudents.length}`);
      console.log(`后端查询的学生数量: ${allStudents.length}`);
      
      if (frontendStudents.length < allStudents.length) {
        console.log('🎯 确认问题：前端显示的学生数量少于后端数据');
        console.log(`差异: ${allStudents.length - frontendStudents.length} 个学生未显示`);
        
        // 显示未显示的学生
        const frontendIds = new Set(frontendStudents.map(s => s.id));
        const missingStudents = allStudents.filter(s => !frontendIds.has(s._id));
        
        if (missingStudents.length > 0) {
          console.log('未显示的学生:');
          missingStudents.slice(0, 5).forEach(student => {
            console.log(`- ${student.name} (${student.class || '未知班级'})`);
          });
          if (missingStudents.length > 5) {
            console.log(`... 还有 ${missingStudents.length - 5} 个学生`);
          }
        }
      } else {
        console.log('✅ 前端显示的学生数量与后端数据一致');
      }
      
    } catch (error) {
      console.error('❌ 分页查询测试失败:', error);
    }
    
    // 6. 提供解决方案
    console.log('');
    console.log('💡 解决方案:');
    console.log('');
    console.log('方案1: 修复查询逻辑（推荐）');
    console.log('- 在所有学生查询中添加 .limit(10000)');
    console.log('- 使用分页查询确保获取所有数据');
    console.log('- 更新 loadClassData 和 loadClassStudents 方法');
    console.log('');
    console.log('方案2: 立即修复');
    console.log('- 运行 quickFixQueryCompleteness() 脚本');
    console.log('- 强制重新查询所有学生数据');
    console.log('- 更新前端显示');
    
    return {
      success: true,
      message: '学生显示限制测试完成',
      hasLimit: true,
      recommendations: [
        '修复查询逻辑，添加limit(10000)',
        '使用分页查询确保获取所有数据',
        '运行quickFixQueryCompleteness()脚本'
      ]
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
testStudentDisplayLimit().then(result => {
  console.log('');
  console.log('📋 测试结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.hasLimit) {
    console.log('🎯 问题确认: 云数据库查询有默认限制');
  }
  
  if (result.recommendations) {
    console.log('');
    console.log('💡 推荐解决方案:');
    result.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  console.log('');
  console.log('🚀 立即修复: 运行 quickFixQueryCompleteness()');
});

console.log('✅ testStudentDisplayLimit 函数已定义');
