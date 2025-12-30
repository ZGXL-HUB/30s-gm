# Excel功能部署指南

## 问题说明

当前遇到的错误 `errCode: -501000 | errMsg: FunctionName parameter could not be found` 表示云函数 `generateStudentTemplate` 和 `parseStudentExcel` 还没有部署到云开发环境。

## 解决方案

### 方案一：部署云函数（推荐）

#### 1. 部署步骤

**在微信开发者工具中执行以下操作：**

1. **部署 parseStudentExcel 云函数**
   - 右键点击 `cloudfunctions/parseStudentExcel` 文件夹
   - 选择 "上传并部署：云端安装依赖"
   - 等待部署完成（通常需要1-2分钟）

2. **部署 generateStudentTemplate 云函数**
   - 右键点击 `cloudfunctions/generateStudentTemplate` 文件夹
   - 选择 "上传并部署：云端安装依赖"
   - 等待部署完成

#### 2. 验证部署

部署完成后，在云开发控制台检查：
- 云函数列表中应该包含 `parseStudentExcel` 和 `generateStudentTemplate`
- 状态显示为"正常"

#### 3. 测试功能

1. 点击"下载模板"按钮，应该能正常生成Excel模板
2. 选择Excel文件上传，应该能正常解析和导入

### 方案二：临时解决方案（当前已实现）

如果暂时无法部署云函数，系统已经添加了友好的错误处理：

1. **下载模板功能**：显示Excel格式说明，指导用户手动创建Excel文件
2. **Excel解析功能**：显示友好的错误提示，建议使用手动添加学生功能

## 云函数依赖

### parseStudentExcel 云函数依赖
```json
{
  "dependencies": {
    "wx-server-sdk": "~2.6.3",
    "xlsx": "^0.18.5"
  }
}
```

### generateStudentTemplate 云函数依赖
```json
{
  "dependencies": {
    "wx-server-sdk": "~2.6.3",
    "xlsx": "^0.18.5"
  }
}
```

## 数据库权限设置

确保云数据库的 `students` 集合权限设置正确：

```json
{
  "read": "auth != null",
  "write": "auth != null"
}
```

## 云存储权限设置

确保云存储有上传和下载权限，用于：
- 上传Excel文件
- 生成和下载模板文件

## 故障排除

### 常见问题

1. **部署失败**
   - 检查网络连接
   - 确认云开发环境已开通
   - 检查云函数代码是否有语法错误

2. **依赖安装失败**
   - 确保网络连接正常
   - 尝试重新部署
   - 检查package.json文件格式

3. **权限错误**
   - 检查云数据库权限设置
   - 检查云存储权限设置
   - 确认用户已登录

### 调试方法

1. **查看云函数日志**
   - 在云开发控制台查看云函数执行日志
   - 检查错误信息和堆栈跟踪

2. **测试云函数**
   - 在云开发控制台手动测试云函数
   - 检查输入参数和返回值

## 完整功能流程

### 1. 用户操作流程
```
用户点击"下载模板" → 生成Excel模板 → 用户下载模板
用户填写Excel文件 → 用户点击"导入学生" → 选择Excel文件 → 上传到云存储 → 调用解析云函数 → 导入学生数据
```

### 2. 技术实现流程
```
前端选择文件 → wx.chooseMessageFile → 上传到云存储 → wx.cloud.uploadFile → 调用云函数 → 解析Excel → 验证数据 → 批量插入数据库
```

## 部署检查清单

- [ ] parseStudentExcel 云函数已部署
- [ ] generateStudentTemplate 云函数已部署
- [ ] 云函数依赖已安装
- [ ] 云数据库权限已设置
- [ ] 云存储权限已设置
- [ ] 功能测试通过

## 联系支持

如果部署过程中遇到问题，请：
1. 检查云开发控制台的错误日志
2. 确认网络连接和权限设置
3. 联系技术支持获取帮助
