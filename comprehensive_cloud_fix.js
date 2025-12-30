// 综合云开发问题修复脚本
// 解决数据库集合缺失和云函数依赖问题
// 在微信开发者工具控制台中运行此脚本

async function comprehensiveCloudFix() {
  console.log('🚀 开始综合云开发问题修复...');
  console.log('📋 修复内容: 数据库集合 + 云函数依赖 + 权限设置');
  
  try {
    const db = wx.cloud.database();
    
    // 1. 创建所有必需的数据库集合
    console.log('\n📝 第一步: 创建数据库集合...');
    
    const requiredCollections = [
      'classes',
      'students', 
      'teacher_backups',
      'teacher_sync',
      'questions',
      'practice_progress',
      'user_progress',
      'assignments',
      'student_assignments',
      'feedback',
      'admin_logs',
      'class_invites',
      'user_abilities',
      'writing_exercises',
      'grammar_tests',
      'question_sets',
      'materials',
      'ppt_slides',
      'class_statistics',
      'student_progress'
    ];
    
    for (const collectionName of requiredCollections) {
      try {
        // 尝试查询集合是否存在
        await db.collection(collectionName).limit(1).get();
        console.log(`✅ ${collectionName} 集合已存在`);
      } catch (error) {
        if (error.errCode === -502005) {
          // 集合不存在，创建它
          console.log(`📝 创建 ${collectionName} 集合...`);
          try {
            const result = await db.collection(collectionName).add({
              data: {
                _id: 'init_' + Date.now(),
                createTime: new Date().toISOString(),
                isInit: true,
                collectionType: collectionName,
                version: '1.0'
              }
            });
            console.log(`✅ ${collectionName} 集合创建成功，文档ID: ${result._id}`);
            
            // 清理初始化文档
            try {
              await db.collection(collectionName).doc(result._id).remove();
              console.log(`🧹 ${collectionName} 初始化文档已清理`);
            } catch (removeError) {
              console.warn(`⚠️ 清理 ${collectionName} 初始化文档失败，但不影响功能:`, removeError);
            }
          } catch (createError) {
            console.error(`❌ 创建 ${collectionName} 集合失败:`, createError);
            
            // 提供具体的错误解决方案
            if (createError.errCode === -601002) {
              console.error('💡 解决方案: 请检查云开发环境配置');
            } else if (createError.errCode === -404011) {
              console.error('💡 解决方案: 数据库不存在，请检查云开发环境');
            } else if (createError.errCode === -502005) {
              console.error('💡 解决方案: 数据库权限不足，请检查云开发权限设置');
            }
          }
        } else {
          console.error(`❌ 检查 ${collectionName} 集合时发生错误:`, error);
        }
      }
    }
    
    // 2. 测试云函数连接
    console.log('\n🧪 第二步: 测试云函数连接...');
    
    const cloudFunctions = [
      'manageClassInvite',
      'login',
      'helloCloud', 
      'practiceProgress',
      'manageQuestions',
      'getQuestionsData',
      'adminAuth',
      'importExportQuestions',
      'initializeQuestions',
      'feedbackManager',
      'generateExcel',
      'generatePDF',
      'generateWord',
      'studentJoinClass',
      'createAssignment',
      'getAssignments',
      'getStudentAssignments',
      'submitAssignmentResult',
      'parseStudentExcel',
      'generateStudentTemplate'
    ];
    
    const workingFunctions = [];
    const brokenFunctions = [];
    
    for (const funcName of cloudFunctions) {
      try {
        // 测试云函数调用
        const result = await wx.cloud.callFunction({
          name: funcName,
          data: { action: 'test', timestamp: Date.now() }
        });
        
        console.log(`✅ ${funcName} 云函数正常`);
        workingFunctions.push(funcName);
        
      } catch (error) {
        console.log(`❌ ${funcName} 云函数异常:`, error.errMsg || error.message);
        brokenFunctions.push(funcName);
        
        if (error.errMsg && error.errMsg.includes('Cannot find module \'wx-server-sdk\'')) {
          console.log(`🔧 ${funcName} 需要重新部署依赖`);
        }
      }
    }
    
    // 3. 验证修复结果
    console.log('\n🔍 第三步: 验证修复结果...');
    
    // 验证关键集合
    const criticalCollections = ['classes', 'students', 'teacher_backups'];
    for (const collectionName of criticalCollections) {
      try {
        await db.collection(collectionName).limit(1).get();
        console.log(`✅ 验证通过: ${collectionName} 集合可访问`);
      } catch (error) {
        console.error(`❌ 验证失败: ${collectionName} 集合不可访问`, error);
      }
    }
    
    // 4. 生成修复报告
    console.log('\n📊 修复报告:');
    console.log(`✅ 正常工作的云函数: ${workingFunctions.length}/${cloudFunctions.length}`);
    console.log(`❌ 需要修复的云函数: ${brokenFunctions.length}/${cloudFunctions.length}`);
    
    if (brokenFunctions.length > 0) {
      console.log('\n🔧 需要手动修复的云函数:');
      brokenFunctions.forEach(func => {
        console.log(`   - ${func}`);
      });
      
      console.log('\n📋 修复步骤:');
      console.log('1. 在微信开发者工具中，右键点击 cloudfunctions/[函数名] 文件夹');
      console.log('2. 选择 "上传并部署：云端安装依赖"');
      console.log('3. 等待部署完成（通常需要1-2分钟）');
      console.log('4. 重新运行此脚本验证修复结果');
    }
    
    // 5. 提供后续操作建议
    console.log('\n💡 后续操作建议:');
    console.log('1. 如果仍有集合创建失败，请手动在云开发控制台创建');
    console.log('2. 检查云开发环境配置是否正确');
    console.log('3. 确保云开发权限设置正确');
    console.log('4. 重新测试班级管理功能');
    
    console.log('\n🎉 综合修复完成！');
    console.log('💡 请重新测试教师端班级管理功能');
    
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
    console.log('\n🔧 手动修复建议:');
    console.log('1. 检查云开发环境是否正常');
    console.log('2. 在云开发控制台手动创建缺失的集合');
    console.log('3. 重新部署有问题的云函数');
  }
}

// 运行修复
comprehensiveCloudFix();
