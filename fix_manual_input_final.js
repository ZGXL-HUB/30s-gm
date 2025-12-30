// 最终修复手动输入功能 - 使用延迟刷新和强制重新加载策略
// 在微信开发者工具控制台运行此代码

async function fixManualInputFinal() {
  console.log('🔧 最终修复手动输入功能...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    // 修改 confirmManualImport 方法
    const originalConfirmManualImport = currentPage.confirmManualImport;
    
    currentPage.confirmManualImport = async function() {
      try {
        wx.showLoading({
          title: '导入中...'
        });

        const classId = this.data.currentClassId;
        const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';

        if (!classId) {
          throw new Error('班级ID不存在');
        }

        // 获取班级信息
        const classInfo = this.data.classes.find(c => c.id === classId);
        const className = classInfo?.name || '未知班级';
        
        console.log(`📝 开始手动导入学生到班级: ${className} (ID: ${classId})`);
        
        // 从数据库重新获取最新的班级信息，确保studentCount是最新的
        const db = wx.cloud.database();
        let latestClassInfo;
        try {
          const classResult = await db.collection('classes').doc(classId).get();
          latestClassInfo = classResult.data;
          console.log(`获取最新班级信息: ${latestClassInfo.name}, 当前学生数: ${latestClassInfo.studentCount || 0}`);
        } catch (error) {
          console.warn('获取最新班级信息失败，使用本地数据:', error);
          latestClassInfo = classInfo;
        }

        // 保存学生数据到数据库
        const savedStudents = [];
        const savedStudentIds = [];

        for (const student of this.data.manualStudents) {
          try {
            const result = await db.collection('students').add({
              data: {
                name: student.name,
                studentId: student.studentId,
                classId: classId,
                class: className,
                teacherId: teacherId,
                status: 'active',
                createdAt: new Date(),
                lastActivity: new Date(),
                createTime: new Date(),
                updateTime: new Date()
              }
            });

            savedStudents.push({
              id: result._id,
              name: student.name,
              studentId: student.studentId,
              classId: classId,
              class: className,
              teacherId: teacherId,
              status: 'active',
              createdAt: new Date().toISOString(),
              lastActivity: new Date().toISOString()
            });
            
            savedStudentIds.push(result._id);

            console.log('✅ 学生保存成功:', student.name, '学号:', student.studentId, 'ID:', result._id);
          } catch (saveError) {
            console.error('❌ 保存学生失败:', student.name, saveError);
          }
        }

        if (savedStudents.length === 0) {
          throw new Error('没有成功保存任何学生');
        }

        console.log(`✅ 成功保存 ${savedStudents.length} 个学生`);

        // 更新班级学生人数
        const currentStudentCount = latestClassInfo?.studentCount || 0;
        const newStudentCount = currentStudentCount + savedStudents.length;
        
        await db.collection('classes').doc(classId).update({
          data: {
            studentCount: newStudentCount,
            lastActivity: new Date()
          }
        });
        
        console.log(`✅ 班级学生数量已更新: ${currentStudentCount} → ${newStudentCount}`);

        // 等待500ms确保数据库写入完成
        console.log('⏳ 等待数据库写入完成...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // 强制重新从数据库加载所有学生数据
        console.log('🔄 强制重新加载学生数据...');
        
        let allStudents = [];
        const existingIds = new Set();
        
        try {
          // 策略1：按teacherId查询
          const teacherStudents = await db.collection('students')
            .where({
              teacherId: teacherId
            })
            .limit(10000)
            .get();
          
          teacherStudents.data.forEach(student => {
            if (!existingIds.has(student._id)) {
              allStudents.push({
                id: student._id,
                name: student.name,
                studentId: student.studentId || student._id,
                status: student.status || 'active',
                joinedAt: student.joinedAt || student.createTime,
                classId: student.classId,
                class: student.class,
                teacherId: student.teacherId
              });
              existingIds.add(student._id);
            }
          });
          console.log(`策略1查询到学生数量: ${allStudents.length}`);
        } catch (error) {
          console.warn('策略1查询失败:', error);
        }
        
        // 策略2：查询所有学生然后过滤
        try {
          const allRecords = await db.collection('students').limit(10000).get();
          allRecords.data.forEach(student => {
            if (!existingIds.has(student._id) && student.teacherId === teacherId) {
              allStudents.push({
                id: student._id,
                name: student.name,
                studentId: student.studentId || student._id,
                status: student.status || 'active',
                joinedAt: student.joinedAt || student.createTime,
                classId: student.classId,
                class: student.class,
                teacherId: student.teacherId
              });
              existingIds.add(student._id);
            }
          });
          console.log(`策略2合并后学生数量: ${allStudents.length}`);
        } catch (error) {
          console.warn('策略2查询失败:', error);
        }
        
        // 验证新保存的学生是否存在
        const foundNewStudents = savedStudentIds.filter(id => existingIds.has(id));
        console.log(`✅ 在查询结果中找到新学生: ${foundNewStudents.length}/${savedStudents.length}`);
        
        if (foundNewStudents.length < savedStudents.length) {
          console.warn(`⚠️ 有 ${savedStudents.length - foundNewStudents.length} 个学生未在查询结果中找到`);
          
          // 尝试直接查询每个新学生
          for (const studentId of savedStudentIds) {
            if (!existingIds.has(studentId)) {
              try {
                const directResult = await db.collection('students').doc(studentId).get();
                if (directResult.data) {
                  const student = directResult.data;
                  allStudents.push({
                    id: student._id,
                    name: student.name,
                    studentId: student.studentId || student._id,
                    status: student.status || 'active',
                    joinedAt: student.joinedAt || student.createTime,
                    classId: student.classId,
                    class: student.class,
                    teacherId: student.teacherId
                  });
                  existingIds.add(student._id);
                  console.log(`✅ 通过直接查询找到学生: ${student.name}`);
                }
              } catch (error) {
                console.warn(`直接查询学生 ${studentId} 失败:`, error);
              }
            }
          }
        }

        // 更新本地存储
        wx.setStorageSync(`teacher_students_${teacherId}`, allStudents);
        console.log(`✅ 本地存储已更新，共 ${allStudents.length} 个学生`);

        // 更新本地班级信息
        const existingClasses = wx.getStorageSync(`teacher_classes_${teacherId}`) || [];
        const updatedClasses = existingClasses.map(cls => {
          if (cls.id === classId) {
            return { ...cls, studentCount: newStudentCount };
          }
          return cls;
        });
        wx.setStorageSync(`teacher_classes_${teacherId}`, updatedClasses);

        // 更新页面数据 - 使用新数组引用
        this.setData({
          students: [...allStudents],
          classes: [...updatedClasses]
        });
        
        console.log('✅ 页面数据已更新');

        wx.hideLoading();

        // 显示成功提示
        wx.showToast({
          title: `成功添加${savedStudents.length}名学生`,
          icon: 'success',
          duration: 2000
        });

        this.closeManualStudentInput();

        // 如果当前在学生管理标签，强制刷新显示
        if (this.data.activeTab === 'students') {
          console.log('🔄 强制刷新学生显示...');
          
          // 临时切换到班级管理标签
          this.setData({ activeTab: 'classes' });
          
          // 等待100ms
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // 切换回学生管理标签
          this.setData({ 
            activeTab: 'students',
            students: [...allStudents]
          });
          
          console.log('✅ 学生显示已刷新');
        }

        console.log('🎉 手动导入完成！');

      } catch (error) {
        console.error('❌ 手动导入失败:', error);
        wx.hideLoading();
        wx.showToast({
          title: error.message || '导入失败',
          icon: 'none',
          duration: 2000
        });
      }
    };
    
    console.log('✅ confirmManualImport 方法已修复');
    
    return {
      success: true,
      message: 'confirmManualImport 方法已修复'
    };
    
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行修复
fixManualInputFinal().then(result => {
  console.log('');
  console.log('📋 修复结果:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.success) {
    console.log('');
    console.log('🎉 手动输入功能已修复！');
    console.log('💡 现在可以测试手动输入学生功能');
    console.log('');
    console.log('📝 修复内容:');
    console.log('1. 保存学生后等待500ms确保数据库写入完成');
    console.log('2. 使用多策略查询确保所有学生都被找到');
    console.log('3. 如果条件查询失败，使用直接查询补充');
    console.log('4. 强制刷新页面数据和本地存储');
    console.log('5. 使用标签切换强制UI重新渲染');
  } else {
    console.log('❌ 修复失败:', result.error);
  }
});

console.log('✅ fixManualInputFinal 函数已定义');
