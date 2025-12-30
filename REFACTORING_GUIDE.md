# 代码重构指南

## 已完成的重构工作

### 1. 统一API服务层 ✅

已创建 `miniprogram/services/` 目录，包含以下服务：

- **CloudApi** - 基础云函数调用封装
- **UserService** - 用户相关API
- **ClassService** - 班级相关API
- **QuestionService** - 题目相关API
- **AssignmentService** - 作业相关API
- **FeedbackService** - 反馈相关API
- **PracticeService** - 练习相关API

### 2. 已重构的页面示例

- ✅ `miniprogram/app.js` - 登录逻辑已重构
- ✅ `miniprogram/pages/feedback/index.js` - 反馈提交已重构

## 如何迁移现有代码

### 步骤1：引入服务

在页面文件顶部引入需要的服务：

```javascript
const { UserService, ClassService, FeedbackService } = require('../../services/index.js');
```

### 步骤2：替换云函数调用

**重构前：**
```javascript
wx.cloud.callFunction({
  name: 'login',
  data: {}
}).then(res => {
  // 处理成功
}).catch(err => {
  // 处理错误
});
```

**重构后：**
```javascript
const result = await UserService.login();
if (result.success) {
  // 处理成功
} else {
  // 处理错误（已自动显示提示）
}
```

### 步骤3：需要重构的页面列表

以下页面需要逐步迁移到新的API服务层：

#### 高优先级
- [ ] `miniprogram/pages/student-join-class/index.js` - 使用 `ClassService`
- [ ] `miniprogram/pages/teacher/teacher-class/index.js` - 使用 `ClassService`
- [ ] `miniprogram/pages/exercise-page/index.js` - 使用 `PracticeService`, `QuestionService`
- [ ] `miniprogram/pages/special-practice/index.js` - 使用 `PracticeService`

#### 中优先级
- [ ] `miniprogram/pages/user-center/index.js` - 使用 `UserService`
- [ ] `miniprogram/pages/teacher/teacher-create-assignment/index.js` - 使用 `AssignmentService`
- [ ] `miniprogram/pages/teacher/teacher-assignment-list/index.js` - 使用 `AssignmentService`
- [ ] `miniprogram/pages/student/student-assignment-list/index.js` - 使用 `AssignmentService`

#### 低优先级
- [ ] `miniprogram/pages/sumRecord/index.js` - 使用 `CloudApi`
- [ ] `miniprogram/pages/updateRecord/index.js` - 使用 `CloudApi`
- [ ] `miniprogram/pages/goods-list/index.js` - 使用 `CloudApi`

## 重构检查清单

迁移代码时，请确保：

- [ ] 引入正确的服务
- [ ] 使用 `await` 处理异步调用
- [ ] 检查 `result.success` 判断成功/失败
- [ ] 移除原有的 `wx.showLoading` / `wx.hideLoading`（服务层已处理）
- [ ] 移除原有的错误处理代码（服务层已处理）
- [ ] 测试功能是否正常

## 注意事项

1. **向后兼容**：新的API服务层完全兼容现有功能，可以逐步迁移
2. **错误处理**：默认会显示错误提示，如需自定义处理，设置 `showError: false`
3. **加载提示**：默认会显示加载提示，可通过 `showLoading: false` 关闭
4. **云开发检查**：服务层会自动检查云开发是否可用，无需手动检查

## 下一步计划

1. 继续迁移其他页面到新的API服务层
2. 优化工具类使用，统一使用 `cloudDataLoader`
3. 配置管理优化，统一配置文件组织
4. 页面代码拆分，将大文件拆分为更小的模块

