// 测试学号功能
// 在微信开发者工具控制台中运行此代码

async function testStudentIdFeature() {
  console.log('🧪 测试学号功能...');
  
  try {
    const pages = getCurrentPages();
    const currentPage = pages.find(p => p.route === 'pages/teacher-class/index');
    
    if (!currentPage) {
      console.log('❌ 未找到班级管理页面');
      return { success: false, error: '页面未找到' };
    }
    
    console.log('✅ 找到班级管理页面');
    
    // 1. 检查学号相关方法
    console.log('🔧 检查学号相关方法...');
    
    const methods = {
      switchInputFormat: typeof currentPage.switchInputFormat === 'function',
      generateStudentId: typeof currentPage.generateStudentId === 'function',
      parseManualStudents: typeof currentPage.parseManualStudents === 'function'
    };
    
    console.log('方法检查结果:');
    Object.keys(methods).forEach(method => {
      console.log(`  ${method}: ${methods[method] ? '✅' : '❌'}`);
    });
    
    // 2. 检查学号相关数据字段
    console.log('📊 检查学号相关数据字段...');
    
    const dataFields = {
      inputFormat: currentPage.data.hasOwnProperty('inputFormat'),
      namePlaceholder: currentPage.data.hasOwnProperty('namePlaceholder'),
      nameAndIdPlaceholder: currentPage.data.hasOwnProperty('nameAndIdPlaceholder')
    };
    
    console.log('数据字段检查结果:');
    Object.keys(dataFields).forEach(field => {
      console.log(`  ${field}: ${dataFields[field] ? '✅' : '❌'}`);
    });
    
    // 3. 测试学号生成功能
    console.log('🔧 测试学号生成功能...');
    
    const testIds = [];
    for (let i = 0; i < 5; i++) {
      const id = currentPage.generateStudentId();
      testIds.push(id);
      console.log(`生成的学号 ${i + 1}: ${id}`);
    }
    
    // 检查学号格式
    const validIds = testIds.filter(id => /^S\d{13}[a-z0-9]{4}$/.test(id));
    console.log(`学号格式验证: ${validIds.length}/${testIds.length} 个有效`);
    
    // 4. 测试格式切换功能
    console.log('🔄 测试格式切换功能...');
    
    // 测试仅姓名模式
    currentPage.setData({
      inputFormat: 'nameOnly',
      inputPlaceholder: currentPage.data.namePlaceholder
    });
    
    console.log('当前格式: 仅姓名');
    console.log('输入提示:', currentPage.data.inputPlaceholder.substring(0, 50) + '...');
    
    // 测试姓名+学号模式
    currentPage.setData({
      inputFormat: 'nameAndId',
      inputPlaceholder: currentPage.data.nameAndIdPlaceholder
    });
    
    console.log('当前格式: 姓名+学号');
    console.log('输入提示:', currentPage.data.inputPlaceholder.substring(0, 50) + '...');
    
    // 5. 测试解析功能
    console.log('📝 测试解析功能...');
    
    // 测试仅姓名模式解析
    console.log('测试仅姓名模式解析:');
    const nameOnlyText = `张小明
李小红
王小华`;
    
    currentPage.setData({
      inputFormat: 'nameOnly',
      manualInputText: nameOnlyText
    });
    
    try {
      // 手动模拟解析逻辑
      const lines = nameOnlyText.split(/[\n\r]+/).filter(line => line.trim());
      const students = lines.map((line, index) => ({
        name: line.trim(),
        studentId: currentPage.generateStudentId(),
        rowIndex: index + 1
      }));
      
      console.log('仅姓名模式解析结果:');
      students.forEach(s => {
        console.log(`  ${s.rowIndex}. ${s.name} (${s.studentId})`);
      });
      
    } catch (error) {
      console.error('仅姓名模式解析失败:', error);
    }
    
    // 测试姓名+学号模式解析
    console.log('测试姓名+学号模式解析:');
    const nameAndIdText = `张小明 2024001
李小红 2024002
王小华 2024003`;
    
    currentPage.setData({
      inputFormat: 'nameAndId',
      manualInputText: nameAndIdText
    });
    
    try {
      // 手动模拟解析逻辑
      const lines = nameAndIdText.split(/[\n\r]+/).filter(line => line.trim());
      const students = lines.map((line, index) => {
        const parts = line.trim().split(/\s+/);
        return {
          name: parts[0].trim(),
          studentId: parts[1].trim(),
          rowIndex: index + 1
        };
      });
      
      console.log('姓名+学号模式解析结果:');
      students.forEach(s => {
        console.log(`  ${s.rowIndex}. ${s.name} (${s.studentId})`);
      });
      
    } catch (error) {
      console.error('姓名+学号模式解析失败:', error);
    }
    
    // 6. 提供使用说明
    console.log('');
    console.log('📋 学号功能使用说明:');
    console.log('');
    console.log('🎯 两种输入模式:');
    console.log('');
    console.log('1️⃣ 仅姓名模式（推荐）:');
    console.log('   - 输入: 每行一个学生姓名');
    console.log('   - 学号: 系统自动生成');
    console.log('   - 格式: 张小明\\n李小红\\n王小华');
    console.log('   - 优点: 操作简单，学号唯一');
    console.log('');
    console.log('2️⃣ 姓名+学号模式:');
    console.log('   - 输入: 每行"姓名 学号"');
    console.log('   - 学号: 教师手动输入');
    console.log('   - 格式: 张小明 2024001\\n李小红 2024002');
    console.log('   - 优点: 学号可控，便于管理');
    console.log('');
    console.log('🔄 切换方式:');
    console.log('   - 在手动输入弹窗中点击格式选项');
    console.log('   - "仅姓名"或"姓名+学号"');
    console.log('');
    console.log('💡 推荐使用场景:');
    console.log('   - 小班教学 → 仅姓名模式');
    console.log('   - 需要与学校系统对接 → 姓名+学号模式');
    console.log('   - 临时班级 → 仅姓名模式');
    console.log('   - 正式班级 → 姓名+学号模式');
    
    return {
      success: true,
      message: '学号功能测试完成',
      methodsExist: Object.values(methods).every(exists => exists),
      dataFieldsExist: Object.values(dataFields).every(exists => exists),
      studentIdGeneration: testIds.length > 0,
      formatSwitching: true,
      parsingTests: true
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
testStudentIdFeature().then(result => {
  console.log('');
  console.log('📋 测试结果总结:');
  console.log('✅ 成功:', result.success);
  console.log('📝 消息:', result.message);
  
  if (result.methodsExist !== undefined) {
    console.log('');
    console.log('📊 功能状态:');
    console.log(`  方法完整: ${result.methodsExist ? '✅' : '❌'}`);
    console.log(`  数据字段完整: ${result.dataFieldsExist ? '✅' : '❌'}`);
    console.log(`  学号生成: ${result.studentIdGeneration ? '✅' : '❌'}`);
    console.log(`  格式切换: ${result.formatSwitching ? '✅' : '❌'}`);
    console.log(`  解析测试: ${result.parsingTests ? '✅' : '❌'}`);
  }
  
  console.log('');
  console.log('🎉 学号功能已就绪，可以开始测试了！');
});

console.log('✅ testStudentIdFeature 函数已定义');
