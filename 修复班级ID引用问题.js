/**
 * 修复班级ID引用问题
 * 解决学生数据中classId指向不存在班级的问题
 */

// 检查并修复班级ID引用问题
async function fixClassIdReferences() {
  try {
    console.log('开始检查并修复班级ID引用问题...');
    
    const db = wx.cloud.database();
    
    // 1. 获取所有班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    const validClassIds = classes.map(cls => cls._id);
    
    console.log('有效班级ID列表:');
    for (let i = 0; i < validClassIds.length; i++) {
      console.log('  - ' + validClassIds[i]);
    }
    
    // 2. 获取所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('找到 ' + students.length + ' 个学生');
    
    let fixedCount = 0;
    let invalidCount = 0;
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const classId = student.classId;
      
      console.log('检查学生: ' + student.name + ' (班级ID: ' + classId + ')');
      
      if (classId && !validClassIds.includes(classId)) {
        console.log('  ❌ 班级ID无效: ' + classId);
        invalidCount++;
        
        // 尝试根据学生名称或其他信息找到正确的班级
        let correctClassId = null;
        
        // 如果学生名称包含班级信息，尝试匹配
        if (student.name && student.name.includes('13')) {
          const class13 = classes.find(cls => cls.name === '13');
          if (class13) {
            correctClassId = class13._id;
            console.log('  🔍 根据学生名称推断班级: ' + correctClassId);
          }
        }
        
        // 如果没有找到正确班级，设置为未分配班级
        if (!correctClassId) {
          console.log('  ⚠️ 无法确定正确班级，设置为未分配');
        }
        
        // 更新学生数据
        const updateData = {
          classId: correctClassId || null,
          className: correctClassId ? classes.find(cls => cls._id === correctClassId)?.name : '未分配班级',
          teacherId: correctClassId ? classes.find(cls => cls._id === correctClassId)?.teacherId : null,
          updatedAt: new Date()
        };
        
        await db.collection('students').doc(student._id).update({
          data: updateData
        });
        
        console.log('  ✅ 已修复学生 ' + student.name + ' 的班级引用');
        fixedCount++;
      } else if (classId && validClassIds.includes(classId)) {
        console.log('  ✅ 班级ID有效');
      } else {
        console.log('  ⚠️ 学生未分配班级');
      }
    }
    
    console.log('班级ID引用修复完成:');
    console.log('  修复学生数: ' + fixedCount);
    console.log('  无效班级ID数: ' + invalidCount);
    
    return {
      fixedCount: fixedCount,
      invalidCount: invalidCount
    };
    
  } catch (error) {
    console.error('修复班级ID引用问题失败:', error);
    return null;
  }
}

// 安全地修复学生数据字段
async function safeFixStudentDataFields() {
  try {
    console.log('开始安全地修复学生数据字段...');
    
    const db = wx.cloud.database();
    
    // 1. 先获取所有有效班级
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    const validClassIds = classes.map(cls => cls._id);
    
    console.log('有效班级数量: ' + classes.length);
    
    // 2. 获取所有学生
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('找到 ' + students.length + ' 个学生');
    
    let fixedCount = 0;
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      let needUpdate = false;
      const updateData = {};
      
      console.log('处理学生: ' + student.name);
      
      // 检查班级ID是否有效
      if (student.classId && !validClassIds.includes(student.classId)) {
        console.log('  ⚠️ 班级ID无效: ' + student.classId);
        updateData.classId = null;
        updateData.className = '未分配班级';
        updateData.teacherId = null;
        needUpdate = true;
      }
      
      // 检查并修复必要字段
      if (student.classId && validClassIds.includes(student.classId)) {
        // 班级ID有效，检查其他字段
        const classInfo = classes.find(cls => cls._id === student.classId);
        
        if (!student.className && classInfo) {
          updateData.className = classInfo.name;
          needUpdate = true;
        }
        
        if (!student.teacherId && classInfo) {
          updateData.teacherId = classInfo.teacherId;
          needUpdate = true;
        }
      }
      
      if (!student.status) {
        updateData.status = 'active';
        needUpdate = true;
      }
      
      if (!student.joinedAt) {
        updateData.joinedAt = new Date();
        needUpdate = true;
      }
      
      if (needUpdate) {
        updateData.updatedAt = new Date();
        
        try {
          await db.collection('students').doc(student._id).update({
            data: updateData
          });
          
          console.log('  ✅ 已修复学生 ' + student.name + ' 的数据字段');
          fixedCount++;
        } catch (updateError) {
          console.log('  ❌ 修复学生 ' + student.name + ' 失败: ' + updateError.message);
        }
      } else {
        console.log('  ✅ 学生 ' + student.name + ' 数据完整');
      }
    }
    
    console.log('学生数据字段安全修复完成，共修复 ' + fixedCount + ' 个学生');
    return true;
    
  } catch (error) {
    console.error('安全修复学生数据字段失败:', error);
    return false;
  }
}

// 检查数据完整性
async function checkDataIntegrity() {
  try {
    console.log('开始检查数据完整性...');
    
    const db = wx.cloud.database();
    
    // 1. 检查班级数据
    const classesResult = await db.collection('classes').get();
    const classes = classesResult.data;
    
    console.log('班级数据完整性:');
    console.log('  总班级数: ' + classes.length);
    
    for (let i = 0; i < classes.length; i++) {
      const classInfo = classes[i];
      console.log('  班级 ' + classInfo.name + ' (ID: ' + classInfo._id + ')');
    }
    
    // 2. 检查学生数据
    const studentsResult = await db.collection('students').get();
    const students = studentsResult.data;
    
    console.log('学生数据完整性:');
    console.log('  总学生数: ' + students.length);
    
    let validStudents = 0;
    let invalidStudents = 0;
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const classId = student.classId;
      
      if (classId) {
        const classExists = classes.some(cls => cls._id === classId);
        if (classExists) {
          validStudents++;
        } else {
          invalidStudents++;
          console.log('  ❌ 学生 ' + student.name + ' 的班级ID无效: ' + classId);
        }
      } else {
        console.log('  ⚠️ 学生 ' + student.name + ' 未分配班级');
      }
    }
    
    console.log('  有效学生: ' + validStudents + ' 人');
    console.log('  无效学生: ' + invalidStudents + ' 人');
    
    return {
      classes: classes,
      students: students,
      validStudents: validStudents,
      invalidStudents: invalidStudents
    };
    
  } catch (error) {
    console.error('检查数据完整性失败:', error);
    return null;
  }
}

// 综合修复
async function runComprehensiveFix() {
  try {
    console.log('开始综合修复数据问题...');
    console.log('=====================================');
    
    // 1. 检查数据完整性
    const integrityCheck = await checkDataIntegrity();
    console.log('数据完整性检查: ' + (integrityCheck ? '✅ 完成' : '❌ 失败'));
    console.log('-------------------------------------');
    
    // 2. 修复班级ID引用问题
    const classIdFix = await fixClassIdReferences();
    console.log('班级ID引用修复: ' + (classIdFix ? '✅ 完成' : '❌ 失败'));
    console.log('-------------------------------------');
    
    // 3. 安全修复学生数据字段
    const fieldFix = await safeFixStudentDataFields();
    console.log('学生数据字段修复: ' + (fieldFix ? '✅ 完成' : '❌ 失败'));
    console.log('-------------------------------------');
    
    console.log('综合修复完成！');
    
    return {
      success: true,
      message: '数据问题综合修复完成',
      results: {
        integrityCheck: integrityCheck,
        classIdFix: classIdFix,
        fieldFix: fieldFix
      }
    };
    
  } catch (error) {
    console.error('综合修复失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// 将函数添加到全局作用域
window.fixClassIdReferences = fixClassIdReferences;
window.safeFixStudentDataFields = safeFixStudentDataFields;
window.checkDataIntegrity = checkDataIntegrity;
window.runComprehensiveFix = runComprehensiveFix;

console.log('班级ID引用问题修复函数已加载');
console.log('可用函数:');
console.log('- runComprehensiveFix() - 运行综合修复');
console.log('- fixClassIdReferences() - 修复班级ID引用问题');
console.log('- safeFixStudentDataFields() - 安全修复学生数据字段');
console.log('- checkDataIntegrity() - 检查数据完整性');
