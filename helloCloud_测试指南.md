# helloCloud 云函数测试指南

## 概述

`helloCloud` 是一个简单的云函数，用于测试 openid 获取功能。该云函数会返回当前用户的 openid、appid 和 unionid。

## 文件结构

```
cloudfunctions/helloCloud/
├── index.js          # 云函数主文件
└── package.json      # 依赖配置

miniprogram/pages/test-hello-cloud/
├── index.js          # 测试页面逻辑
├── index.wxml        # 测试页面结构
├── index.wxss        # 测试页面样式
└── index.json        # 页面配置
```

## 部署步骤

### 1. 上传云函数

在微信开发者工具中：

1. 右键点击 `cloudfunctions/helloCloud` 目录
2. 选择【上传并部署：云端安装依赖】
3. 等待上传完成

### 2. 配置云开发环境

确保 `miniprogram/app.js` 中的云开发环境ID正确：

```javascript
wx.cloud.init({
  traceUser: true,
  env: 'your-env-id', // 替换为您的环境ID
});
```

### 3. 测试云函数

#### 方法一：使用测试页面

1. 在微信开发者工具中编译项目
2. 导航到测试页面：`pages/test-hello-cloud/index`
3. 点击"测试获取 openid"按钮
4. 查看返回结果

#### 方法二：使用控制台脚本

1. 在微信开发者工具控制台中运行 `test_hello_cloud.js` 脚本
2. 查看控制台输出

## 预期结果

成功调用后，应该返回类似以下的结果：

```javascript
{
  event: { test: 'hello' },
  openid: 'oX8Yt5Q...',  // 用户的唯一标识
  appid: 'wx123456...',  // 小程序的 AppID
  unionid: 'oX8Yt5Q...'  // 用户的 UnionID（如果有）
}
```

## 常见问题

### 1. 云函数调用失败

**错误信息**：`FunctionName parameter could not be found`

**解决方案**：
- 确保云函数已正确上传
- 检查云函数名称是否正确（helloCloud）
- 确保云开发环境配置正确

### 2. 环境未找到

**错误信息**：`Environment not found`

**解决方案**：
- 检查 `app.js` 中的环境ID是否正确
- 确保云开发环境已开通
- 确保环境ID与云开发控制台中的一致

### 3. openid 为空

**可能原因**：
- 用户未授权登录
- 云开发权限配置问题

**解决方案**：
- 确保小程序已获得用户授权
- 检查云开发权限设置

## 代码说明

### 云函数代码 (index.js)

```javascript
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
```

### 测试页面调用

```javascript
wx.cloud.callFunction({
  name: 'helloCloud',
  data: {
    test: 'hello'
  }
}).then((res) => {
  console.log('OpenID:', res.result.openid);
}).catch((err) => {
  console.error('调用失败:', err);
});
```

## 注意事项

1. **环境ID**：请确保使用正确的云开发环境ID
2. **权限**：确保云函数有足够的权限访问用户信息
3. **网络**：确保网络连接正常
4. **版本**：确保微信开发者工具版本支持云开发功能

## 下一步

测试成功后，您可以：

1. 在其他页面中使用相同的模式获取 openid
2. 基于 openid 实现用户数据存储和查询
3. 开发更多云函数功能
