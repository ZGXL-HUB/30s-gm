// 步骤1：获取现有的邀请码
// 复制此代码到微信开发者工具控制台运行

(async () => {
  console.log('===== 查找现有班级和邀请码 =====\n');
  
  try {
    const db = wx.cloud.database();
    
    // 查询所有活跃的班级
    const classResult = await db.collection('classes').where({
      status: 'active'
    }).limit(10).get();
    
    if (classResult.data.length === 0) {
      console.log('❌ 未找到活跃的班级');
      console.log('\n需要先创建班级。请执行以下操作：');
      console.log('1. 以教师身份登录小程序');
      console.log('2. 进入班级管理页面');
      console.log('3. 创建一个测试班级');
      console.log('4. 生成邀请码');
      console.log('5. 然后重新运行此脚本\n');
      return;
    }
    
    console.log(`✓ 找到 ${classResult.data.length} 个活跃班级\n`);
    
    // 显示所有班级信息
    let hasInviteCode = false;
    let selectedClass = null;
    
    classResult.data.forEach((cls, index) => {
      console.log(`班级 ${index + 1}:`);
      console.log(`  - ID: ${cls._id}`);
      console.log(`  - 名称: ${cls.name}`);
      console.log(`  - 教师ID: ${cls.teacherId}`);
      console.log(`  - 当前学生数: ${cls.currentStudents || 0}`);
      console.log(`  - 最大学生数: ${cls.maxStudents || 50}`);
      console.log(`  - 邀请码: ${cls.inviteCode || '未生成'}`);
      
      if (cls.inviteCode) {
        console.log(`  - 邀请码过期时间: ${cls.inviteCodeExpiry || '未设置'}`);
        hasInviteCode = true;
        if (!selectedClass) {
          selectedClass = cls;
        }
      }
      console.log('');
    });
    
    // 如果有邀请码，提供测试命令
    if (hasInviteCode && selectedClass) {
      console.log('===== 找到可用的邀请码 =====');
      console.log(`班级名称: ${selectedClass.name}`);
      console.log(`邀请码: ${selectedClass.inviteCode}`);
      console.log('\n下一步：运行简化测试');
      console.log('复制并运行以下命令：\n');
      console.log(`testInviteCodeValidation("${selectedClass.inviteCode}")`);
      console.log('\n================================\n');
    } else {
      console.log('===== 未找到邀请码 =====');
      console.log('所有班级都没有邀请码，需要生成。\n');
      
      // 选择第一个班级
      const firstClass = classResult.data[0];
      console.log(`将为班级"${firstClass.name}"生成邀请码...\n`);
      
      // 生成邀请码
      const generateResult = await wx.cloud.callFunction({
        name: 'manageClassInvite',
        data: {
          action: 'generate',
          classId: firstClass._id,
          teacherId: firstClass.teacherId,
          expireDays: 7
        }
      });
      
      if (generateResult.result.success) {
        const inviteCode = generateResult.result.data.inviteCode;
        console.log('✓ 邀请码生成成功！');
        console.log(`班级名称: ${firstClass.name}`);
        console.log(`邀请码: ${inviteCode}`);
        console.log(`有效期: ${generateResult.result.data.expiresAt}`);
        console.log('\n下一步：运行简化测试');
        console.log('复制并运行以下命令：\n');
        console.log(`testInviteCodeValidation("${inviteCode}")`);
        console.log('\n================================\n');
      } else {
        console.error('❌ 邀请码生成失败:', generateResult.result.message);
      }
    }
    
  } catch (error) {
    console.error('❌ 查询过程中发生错误:', error);
    console.error('错误详情:', error.message);
    console.log('\n可能的原因：');
    console.log('1. 云开发环境未初始化');
    console.log('2. 数据库权限设置问题');
    console.log('3. classes集合不存在');
  }
})();

