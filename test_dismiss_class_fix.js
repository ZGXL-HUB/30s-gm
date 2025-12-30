/**
 * 测试解散班级修复效果
 * 在微信小程序控制台运行此脚本
 */

// 测试解散班级后的数据同步
async function testDismissClassSync() {
  try {
    console.log('开始测试解散班级数据同步修复...');
    console.log('=====================================');
    
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 1. 检查当前班级数据
    console.log('1. 检查当前云端班级数据:');
    const cloudClasses = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    console.log('云端班级数量:', cloudClasses.data.length);
    cloudClasses.data.forEach(cls => {
      console.log('  - ' + cls.name + ' (ID: ' + cls._id + ')');
    });
    
    // 2. 检查本地存储数据
    console.log('\n2. 检查本地存储班级数据:');
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    console.log('本地班级数量:', localClasses.length);
    localClasses.forEach(cls => {
      console.log('  - ' + cls.name + ' (ID: ' + cls.id + ')');
    });
    
    // 3. 检查学生数据
    console.log('\n3. 检查相关学生数据:');
    const students = await db.collection('students').where({
      teacherId: teacherId
    }).get();
    
    console.log('教师学生总数:', students.data.length);
    students.data.forEach(student => {
      console.log('  - ' + student.name + ' (班级ID: ' + (student.classId || '无') + ')');
    });
    
    // 4. 检查无效学生数据（指向不存在班级的学生）
    console.log('\n4. 检查无效学生数据:');
    const validClassIds = cloudClasses.data.map(cls => cls._id);
    const invalidStudents = students.data.filter(student => 
      student.classId && !validClassIds.includes(student.classId)
    );
    
    console.log('无效学生数量:', invalidStudents.length);
    invalidStudents.forEach(student => {
      console.log('  ❌ ' + student.name + ' (指向不存在的班级: ' + student.classId + ')');
    });
    
    // 5. 数据一致性检查
    console.log('\n5. 数据一致性检查:');
    const isConsistent = cloudClasses.data.length === localClasses.length;
    console.log('云端与本地数据一致:', isConsistent ? '✅' : '❌');
    
    if (!isConsistent) {
      console.log('不一致原因:');
      console.log('  云端班级:', cloudClasses.data.map(c => c.name));
      console.log('  本地班级:', localClasses.map(c => c.name));
    }
    
    // 6. 检查是否有示例数据残留
    console.log('\n6. 检查示例数据残留:');
    const exampleClassNames = ['高三(1)班', '高三(2)班', '高二(1)班'];
    const hasExampleData = localClasses.some(cls => exampleClassNames.includes(cls.name));
    console.log('存在示例数据:', hasExampleData ? '❌ 需要清理' : '✅ 无示例数据');
    
    if (hasExampleData) {
      const exampleClasses = localClasses.filter(cls => exampleClassNames.includes(cls.name));
      console.log('示例班级:');
      exampleClasses.forEach(cls => {
        console.log('  - ' + cls.name + ' (ID: ' + cls.id + ')');
      });
    }
    
    console.log('\n测试完成！');
    
    return {
      success: true,
      cloudClasses: cloudClasses.data.length,
      localClasses: localClasses.length,
      totalStudents: students.data.length,
      invalidStudents: invalidStudents.length,
      isConsistent: isConsistent,
      hasExampleData: hasExampleData
    };
    
  } catch (error) {
    console.error('测试失败:', error);
    return { success: false, error: error.message };
  }
}

// 清理示例数据
async function cleanExampleData() {
  try {
    console.log('开始清理示例数据...');
    
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    const localClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
    
    const exampleClassNames = ['高三(1)班', '高三(2)班', '高二(1)班'];
    const realClasses = localClasses.filter(cls => !exampleClassNames.includes(cls.name));
    
    wx.setStorageSync(`teacher_classes_${teacherId}`, realClasses);
    
    console.log('清理前班级数量:', localClasses.length);
    console.log('清理后班级数量:', realClasses.length);
    console.log('已清理示例数据');
    
    return { success: true, before: localClasses.length, after: realClasses.length };
    
  } catch (error) {
    console.error('清理示例数据失败:', error);
    return { success: false, error: error.message };
  }
}

// 强制同步数据
async function forceSyncData() {
  try {
    console.log('开始强制同步数据...');
    
    const db = wx.cloud.database();
    const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
    
    // 清除本地缓存
    wx.removeStorageSync(`teacher_classes_${teacherId}`);
    wx.removeStorageSync(`teacher_students_${teacherId}`);
    
    // 从云端重新获取数据
    const cloudClasses = await db.collection('classes').where({
      teacherId: teacherId
    }).get();
    
    if (cloudClasses.data && cloudClasses.data.length > 0) {
      const formattedClasses = cloudClasses.data.map(cls => ({
        id: cls._id,
        name: cls.name,
        studentCount: cls.studentCount || 0,
        teacher: cls.teacher || '张老师',
        createdAt: cls.createdAt || new Date().toISOString().slice(0, 10),
        lastActivity: cls.lastActivity || new Date().toISOString(),
        status: cls.status || 'active',
        averageAccuracy: cls.averageAccuracy || 0,
        completedAssignments: cls.completedAssignments || 0,
        totalAssignments: cls.totalAssignments || 0
      }));
      
      wx.setStorageSync(`teacher_classes_${teacherId}`, formattedClasses);
      console.log('已同步云端班级数据:', formattedClasses.length);
    } else {
      wx.setStorageSync(`teacher_classes_${teacherId}`, []);
      console.log('云端无班级数据，设置为空数组');
    }
    
    console.log('强制同步完成');
    return { success: true };
    
  } catch (error) {
    console.error('强制同步失败:', error);
    return { success: false, error: error.message };
  }
}

// 将函数添加到全局作用域
window.testDismissClassSync = testDismissClassSync;
window.cleanExampleData = cleanExampleData;
window.forceSyncData = forceSyncData;

console.log('解散班级修复测试函数已加载');
console.log('可用函数:');
console.log('- testDismissClassSync() - 测试解散班级数据同步');
console.log('- cleanExampleData() - 清理示例数据');
console.log('- forceSyncData() - 强制同步数据');
