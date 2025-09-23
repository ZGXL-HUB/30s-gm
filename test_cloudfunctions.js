// 云函数测试脚本
// 在小程序端运行，用于测试云函数调用

// 测试云函数调用
async function testCloudFunctions() {
  console.log('🧪 开始测试云函数调用...');
  
  try {
    // 1. 测试登录云函数
    console.log('1️⃣ 测试登录云函数...');
    const loginResult = await wx.cloud.callFunction({
      name: 'login',
      data: {}
    });
    console.log('✅ 登录云函数调用成功:', loginResult.result);
    
    // 2. 测试helloCloud云函数
    console.log('2️⃣ 测试helloCloud云函数...');
    const helloResult = await wx.cloud.callFunction({
      name: 'helloCloud',
      data: { message: '测试云开发连通性' }
    });
    console.log('✅ helloCloud云函数调用成功:', helloResult.result);
    
    // 3. 测试练习进度云函数
    console.log('3️⃣ 测试练习进度云函数...');
    const progressResult = await wx.cloud.callFunction({
      name: 'practiceProgress',
      data: {
        action: 'getPracticeTables'
      }
    });
    console.log('✅ 练习进度云函数调用成功:', progressResult.result);
    
    // 4. 测试题目管理云函数
    console.log('4️⃣ 测试题目管理云函数...');
    const manageResult = await wx.cloud.callFunction({
      name: 'manageQuestions',
      data: {
        action: 'getAllCategories'
      }
    });
    console.log('✅ 题目管理云函数调用成功:', manageResult.result);
    
    // 5. 测试题目数据云函数
    console.log('5️⃣ 测试题目数据云函数...');
    const dataResult = await wx.cloud.callFunction({
      name: 'getQuestionsData',
      data: {
        action: 'getCategories'
      }
    });
    console.log('✅ 题目数据云函数调用成功:', dataResult.result);
    
    console.log('🎉 所有云函数测试通过！');
    return {
      success: true,
      message: '所有云函数测试通过',
      results: {
        login: loginResult.result,
        helloCloud: helloResult.result,
        practiceProgress: progressResult.result,
        manageQuestions: manageResult.result,
        getQuestionsData: dataResult.result
      }
    };
    
  } catch (error) {
    console.error('❌ 云函数测试失败:', error);
    return {
      success: false,
      message: '云函数测试失败',
      error: error.message
    };
  }
}

// 测试云数据库连接
async function testCloudDatabase() {
  console.log('🗄️ 开始测试云数据库连接...');
  
  try {
    const db = wx.cloud.database();
    
    // 测试questions集合
    console.log('测试questions集合...');
    const questionsResult = await db.collection('questions').limit(1).get();
    console.log('✅ questions集合连接成功，数据条数:', questionsResult.data.length);
    
    // 测试practice_progress集合
    console.log('测试practice_progress集合...');
    const progressResult = await db.collection('practice_progress').limit(1).get();
    console.log('✅ practice_progress集合连接成功，数据条数:', progressResult.data.length);
    
    // 测试user_progress集合
    console.log('测试user_progress集合...');
    const userProgressResult = await db.collection('user_progress').limit(1).get();
    console.log('✅ user_progress集合连接成功，数据条数:', userProgressResult.data.length);
    
    console.log('🎉 云数据库连接测试通过！');
    return {
      success: true,
      message: '云数据库连接测试通过',
      results: {
        questions: questionsResult.data.length,
        practice_progress: progressResult.data.length,
        user_progress: userProgressResult.data.length
      }
    };
    
  } catch (error) {
    console.error('❌ 云数据库连接测试失败:', error);
    return {
      success: false,
      message: '云数据库连接测试失败',
      error: error.message
    };
  }
}

// 综合测试函数
async function runComprehensiveTest() {
  console.log('🚀 开始综合测试...');
  
  const results = {
    cloudFunctions: null,
    cloudDatabase: null,
    timestamp: new Date().toISOString()
  };
  
  // 测试云函数
  results.cloudFunctions = await testCloudFunctions();
  
  // 测试云数据库
  results.cloudDatabase = await testCloudDatabase();
  
  // 输出测试结果
  console.log('📊 综合测试结果:', results);
  
  // 显示测试结果
  const allTestsPassed = results.cloudFunctions.success && results.cloudDatabase.success;
  
  wx.showModal({
    title: allTestsPassed ? '✅ 测试通过' : '❌ 测试失败',
    content: allTestsPassed ? 
      '所有云函数和云数据库测试通过！' : 
      '部分测试失败，请检查控制台日志',
    showCancel: false
  });
  
  return results;
}

// 导出测试函数
module.exports = {
  testCloudFunctions,
  testCloudDatabase,
  runComprehensiveTest
};

// 如果在页面中使用，可以直接调用
if (typeof Page !== 'undefined') {
  // 页面级别的测试函数
  Page({
    onLoad() {
      console.log('页面加载完成，可以开始测试云函数');
    },
    
    // 测试云函数按钮点击事件
    async testCloudFunctions() {
      const results = await runComprehensiveTest();
      console.log('测试完成:', results);
    }
  });
}

