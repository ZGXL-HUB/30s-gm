// 控制台专用测试脚本 - 解决重复声明问题

// 清除之前可能存在的变量
if (typeof obj !== 'undefined') delete obj;
if (typeof arr !== 'undefined') delete arr;

// 重新声明变量
console.log('测试脚本加载成功');

// 测试基本语法
function test() {
  console.log('函数定义正常');
  return true;
}

// 测试对象
var obj = {  // 改用 var 避免重复声明问题
  name: 'test',
  value: 123
};

console.log('对象定义正常:', obj);

// 测试数组
var arr = [1, 2, 3, 'test'];  // 改用 var
console.log('数组定义正常:', arr);

// 测试async函数
async function asyncTest() {
  console.log('async函数定义正常');
  return 'success';
}

console.log('✅ 所有语法检查通过');

// 导出测试
if (typeof wx !== 'undefined') {
  wx.test = test;
  wx.asyncTest = asyncTest;
  console.log('✅ 小程序环境检测正常');
  console.log('可以运行: wx.asyncTest().then(result => console.log(result))');
} else {
  console.log('❌ 不在小程序环境中，请在微信开发者工具控制台中运行');
}

