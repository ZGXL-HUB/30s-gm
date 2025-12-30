// 诊断学生加入班级数据同步问题的脚本

/**
 * 问题分析：
 * 
 * 1. 学生端显示的班级人数少于真实人数
 *    - 原因：验证邀请码时从classes集合读取的currentStudents可能未同步
 *    - 位置：manageClassInvite云函数的validate action
 * 
 * 2. 学生通过邀请码加入班级后云数据库students集合没有记录
 *    - 原因可能：
 *      a) studentInfo对象传参不完整（缺少name、openId等）
 *      b) 云函数执行失败但前端没有正确处理错误
 *      c) studentInfo.openId字段名不匹配（前端用openId，云函数期望openId）
 * 
 * 关键代码位置：
 * - 学生端：miniprogram/pages/student-join-class/index.js
 *   - getUserInfo()方法：第34-69行，获取openid并存储到studentInfo.openId
 *   - confirmJoinClass()方法：第200-251行，调用云函数
 * 
 * - 云函数：cloudfunctions/studentJoinClass/index.js
 *   - joinClassByInvite()函数：第39-173行
 *   - 新建学生记录：第96-117行，使用studentInfo.openId、studentInfo.name等
 * 
 * 诊断步骤：
 */

// 1. 检查学生端传递的studentInfo对象结构
console.log('===== 学生端应传递的studentInfo格式 =====');
const expectedStudentInfo = {
  openId: 'student_openid_from_wx_login',  // 必需
  name: '学生姓名',                         // 必需
  avatarUrl: 'https://...'                 // 可选
};
console.log(JSON.stringify(expectedStudentInfo, null, 2));

// 2. 检查云函数接收到的参数
console.log('\n===== 云函数应接收的参数格式 =====');
const expectedCloudFunctionParams = {
  action: 'joinByInvite',
  inviteCode: '123456',
  studentInfo: {
    openId: 'student_openid',
    name: '学生姓名',
    avatarUrl: 'https://...'
  }
};
console.log(JSON.stringify(expectedCloudFunctionParams, null, 2));

// 3. 可能的问题点
console.log('\n===== 可能的问题点 =====');
console.log('1. 学生端getUserInfo()方法中，从wx.login获取的是openid，但存储时用的key是openId（大小写）');
console.log('   - 检查：userInfo.openid vs studentInfo.openId');
console.log('   - 位置：index.js 第48-50行');
console.log('');
console.log('2. 学生姓名可能未正确获取');
console.log('   - wx.getUserProfile可能失败（需要用户授权）');
console.log('   - 如果失败，studentInfo.name会是空字符串');
console.log('   - 位置：index.js 第54-64行');
console.log('');
console.log('3. 云函数可能因为必需字段缺失而创建失败');
console.log('   - 检查students集合是否有必填字段验证');
console.log('   - 检查云函数日志是否有错误');

// 4. 修复建议
console.log('\n===== 修复建议 =====');
console.log('修复1：确保学生必须输入姓名才能加入班级');
console.log('  - 在confirmJoinClass前检查studentInfo.name是否为空');
console.log('  - 如果为空，强制显示姓名输入框');
console.log('');
console.log('修复2：改进错误处理和日志');
console.log('  - 在云函数中添加详细的console.log');
console.log('  - 在前端添加更详细的错误提示');
console.log('');
console.log('修复3：修复班级人数显示');
console.log('  - 确保manageClassInvite返回最新的currentStudents');
console.log('  - 或者实时查询students集合统计人数');

console.log('\n===== 测试步骤 =====');
console.log('1. 在云开发控制台查看students集合，确认是否有学生记录');
console.log('2. 在云函数日志中查看studentJoinClass的执行记录');
console.log('3. 在前端控制台查看studentInfo对象的完整内容');
console.log('4. 检查classes集合的currentStudents字段是否正确');

module.exports = {
  expectedStudentInfo,
  expectedCloudFunctionParams
};

