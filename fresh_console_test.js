// 全新控制台测试脚本 - 完全避免重复声明

(function() {
  'use strict';

  console.log('=== 全新控制台测试脚本 ===');
  console.log('✅ 脚本开始执行');

  // 测试基本语法
  try {
    console.log('1️⃣ 测试函数声明...');
    function testFunction() {
      return '函数正常';
    }
    console.log('✅ 函数声明正常');
  } catch (error) {
    console.error('❌ 函数声明失败:', error.message);
  }

  // 测试对象字面量
  try {
    console.log('2️⃣ 测试对象字面量...');
    var testObj = {
      name: '测试对象',
      value: 42,
      method: function() {
        return '对象方法正常';
      }
    };
    console.log('✅ 对象字面量正常:', testObj.name);
  } catch (error) {
    console.error('❌ 对象字面量失败:', error.message);
  }

  // 测试数组字面量
  try {
    console.log('3️⃣ 测试数组字面量...');
    var testArray = [1, 2, '三', {four: 4}];
    console.log('✅ 数组字面量正常，长度:', testArray.length);
  } catch (error) {
    console.error('❌ 数组字面量失败:', error.message);
  }

  // 测试async/await语法
  try {
    console.log('4️⃣ 测试async函数...');
    async function testAsync() {
      return 'async函数正常';
    }
    console.log('✅ async函数声明正常');

    // 测试Promise
    console.log('5️⃣ 测试Promise...');
    var testPromise = Promise.resolve('Promise正常');
    console.log('✅ Promise创建正常');

  } catch (error) {
    console.error('❌ async/Promise测试失败:', error.message);
  }

  // 测试小程序API
  try {
    console.log('6️⃣ 测试小程序环境...');
    if (typeof wx !== 'undefined') {
      console.log('✅ 小程序环境检测正常');

      // 挂载测试函数到wx对象
      wx.consoleTest = {
        testFunction: function() { return '函数正常'; },
        testObj: testObj,
        testArray: testArray,
        testAsync: async function() { return 'async函数正常'; },
        testPromise: testPromise
      };

      console.log('✅ 函数已挂载到 wx.consoleTest');
      console.log('📝 可以运行以下命令测试:');
      console.log('   wx.consoleTest.testFunction()');
      console.log('   wx.consoleTest.testAsync().then(r => console.log(r))');

    } else {
      console.log('❌ 未检测到小程序环境');
    }
  } catch (error) {
    console.error('❌ 小程序环境测试失败:', error.message);
  }

  console.log('🎉 所有基础语法测试完成！');

})();
