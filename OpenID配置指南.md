# OpenID 配置指南

## 你的 OpenID 信息
- **OpenID**: `o3TSs7c2SISOeO1b4mi0SEEQ1QaY`
- **AppID**: `wx0aabac4fe3b9cca7`
- **UnionID**: 空（正常）

## 需要配置的地方

### 1. 管理员数据库配置 ⭐ 重要

你的 OpenID 需要添加到云数据库的 `admins` 集合中，以获得管理员权限。

#### 方法一：使用脚本添加（推荐）
在微信开发者工具控制台中运行 `add_admin_script.js` 脚本：

```javascript
// 复制 add_admin_script.js 的内容到控制台
// 然后运行：
checkAdminStatus()  // 先检查当前状态
addAdminToDatabase()  // 添加管理员
```

#### 方法二：手动添加
1. 打开云开发控制台
2. 进入数据库
3. 找到 `admins` 集合（如果没有则创建）
4. 添加一条记录：
   ```json
   {
     "openid": "o3TSs7c2SISOeO1b4mi0SEEQ1QaY",
     "name": "主管理员",
     "createTime": "2025-08-22T13:37:16.000Z",
     "isFirstAdmin": true
   }
   ```

### 2. 用户信息存储

在以下页面中，OpenID 会自动获取并存储：

#### exercise-page（练习页面）
- 自动保存用户练习进度
- 使用 OpenID 作为用户标识

#### special-practice（专项练习）
- 保存专项练习进度
- 使用 OpenID 关联用户数据

#### mistakes-page（错题页面）
- 保存用户错题记录
- 使用 OpenID 识别用户

### 3. 云函数权限验证

以下云函数会验证你的管理员权限：

#### adminAuth（管理员认证）
- 检查用户是否为管理员
- 添加/移除其他管理员

#### importExportQuestions（题目导入导出）
- 只有管理员可以导入导出题目
- 使用 OpenID 验证权限

#### practiceProgress（练习进度）
- 保存和获取用户练习进度
- 使用 OpenID 关联数据

## 配置步骤

### 第一步：添加管理员权限
1. 在微信开发者工具控制台中运行：
   ```javascript
   // 复制 add_admin_script.js 的内容
   // 然后运行：
   checkAdminStatus()
   ```

2. 如果显示不是管理员，运行：
   ```javascript
   addAdminToDatabase()
   ```

3. 如果上面的方法失败，运行：
   ```javascript
   initializeFirstAdmin()
   ```

### 第二步：验证配置
1. 再次运行 `checkAdminStatus()` 确认管理员权限
2. 测试管理员功能（如题目导入导出）

### 第三步：测试用户功能
1. 进入练习页面，完成一些题目
2. 检查进度是否正确保存
3. 进入错题页面，查看错题记录

## 注意事项

1. **OpenID 是唯一的**：每个用户在小程序中的 OpenID 是固定的
2. **权限验证**：管理员功能需要 OpenID 在 `admins` 集合中
3. **数据关联**：用户的所有数据都通过 OpenID 关联
4. **安全性**：不要在其他地方暴露 OpenID

## 常见问题

### Q: 为什么需要管理员权限？
A: 管理员权限允许你：
- 导入/导出题目数据
- 管理其他用户权限
- 访问管理功能

### Q: 如何添加其他管理员？
A: 使用 adminAuth 云函数：
```javascript
wx.cloud.callFunction({
  name: 'adminAuth',
  data: {
    action: 'addAdmin',
    data: {
      openid: '其他用户的OpenID',
      name: '管理员名称'
    }
  }
})
```

### Q: 如何检查用户权限？
A: 运行 `checkAdminStatus()` 函数

## 完成配置后的功能

✅ 管理员权限验证
✅ 题目数据导入导出
✅ 用户练习进度保存
✅ 错题记录管理
✅ 专项练习进度跟踪
