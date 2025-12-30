# API服务层使用指南

## 概述

统一的API服务层封装了所有云函数调用，提供：
- 统一的错误处理
- 自动加载提示
- 统一的返回格式
- 日志记录

## 服务列表

### CloudApi
基础云函数调用封装，所有其他服务都基于此。

### UserService
用户相关API：
- `getOpenId()` - 获取用户OpenID
- `login()` - 用户登录
- `getUserInfo()` - 获取本地用户信息
- `saveUserInfo()` - 保存用户信息

### ClassService
班级相关API：
- `manageClassInvite()` - 管理班级邀请
- `studentJoinClass()` - 学生加入班级
- `syncClassStudentCount()` - 同步班级学生人数
- `parseStudentExcel()` - 解析学生Excel

### QuestionService
题目相关API：
- `getQuestionsData()` - 获取题目数据
- `getQuestionsByGrammarPoint()` - 根据语法点获取题目
- `loadGrammarTestSets()` - 加载语法测试套题
- `loadWritingExerciseQuestions()` - 加载书写练习题目

### AssignmentService
作业相关API：
- `createAssignment()` - 创建作业
- `getAssignments()` - 获取作业列表（教师端）
- `getStudentAssignments()` - 获取学生作业列表
- `submitAssignmentResult()` - 提交作业结果

### FeedbackService
反馈相关API：
- `submitFeedback()` - 提交反馈
- `getFeedbackList()` - 获取反馈列表
- `getFeedbackDetail()` - 获取反馈详情

### PracticeService
练习相关API：
- `saveProgress()` - 保存练习进度
- `getProgress()` - 获取练习进度
- `getPracticeTables()` - 获取练习表格数据

## 使用示例

### 基础用法

```javascript
// 引入服务
const { UserService, ClassService } = require('../../services/index.js');

// 获取用户OpenID
const result = await UserService.getOpenId();
if (result.success) {
  console.log('OpenID:', result.openid);
}

// 学生加入班级
const joinResult = await ClassService.studentJoinClass('INVITE_CODE_123');
if (joinResult.success) {
  console.log('加入成功');
}
```

### 自定义选项

```javascript
// 不显示加载提示
const result = await UserService.getOpenId({
  showLoading: false
});

// 自定义加载文本
const result = await ClassService.syncClassStudentCount({
  loadingText: '正在同步...'
});

// 不显示错误提示（自行处理）
const result = await UserService.login({
  showError: false
});
if (!result.success) {
  // 自定义错误处理
  console.error('登录失败:', result.error);
}
```

### 迁移现有代码

**重构前：**
```javascript
wx.cloud.callFunction({
  name: 'login',
  data: {}
}).then(res => {
  const { openid } = res.result;
  // 处理成功
}).catch(err => {
  console.error('登录失败:', err);
  wx.showToast({
    title: '登录失败',
    icon: 'none'
  });
});
```

**重构后：**
```javascript
const { UserService } = require('../../services/index.js');

const result = await UserService.login();
if (result.success) {
  const { openid } = result;
  // 处理成功
} else {
  // 错误已自动处理，如需自定义处理：
  console.error('登录失败:', result.error);
}
```

## 返回格式

所有服务方法返回统一格式：

```javascript
{
  success: true,  // 是否成功
  data: {},       // 返回数据（成功时）
  error: Error,   // 错误对象（失败时）
  code: 'ERROR_CODE',  // 错误代码（失败时）
  message: '错误信息'  // 错误信息（失败时）
}
```

## 注意事项

1. 所有服务方法都是异步的，需要使用 `await` 或 `.then()`
2. 默认会显示加载提示和错误提示，可通过选项关闭
3. 云开发不可用时会自动降级处理
4. 所有错误都会自动记录日志


