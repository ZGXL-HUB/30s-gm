# 简单的云数据库备份方法

## 方法一：使用云开发控制台导出功能（推荐）

### 步骤：
1. 打开云开发控制台：https://console.cloud.tencent.com/tcb
2. 选择你的环境：`cloud1-4gyu3i1id5f4e2fa`
3. 点击左侧菜单 **"数据库"**
4. 选择 `questions` 集合
5. 点击右上角 **"导出"** 按钮
6. 选择导出格式（建议选择 JSON）
7. 点击 **"确定"** 开始导出
8. 下载备份文件到本地

## 方法二：使用云开发控制台的代码执行环境

### 步骤：
1. 在云开发控制台中，点击 **"云函数"**
2. 创建一个新的云函数，命名为 `backupData`
3. 将以下代码复制到云函数中：

```javascript
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const questionsCollection = db.collection('questions')
    
    // 获取所有数据
    const allData = []
    let offset = 0
    const limit = 100
    
    while (true) {
      const result = await questionsCollection
        .skip(offset)
        .limit(limit)
        .get()
      
      if (result.data.length === 0) {
        break
      }
      
      allData.push(...result.data)
      offset += limit
      console.log(`已获取 ${allData.length} 条数据`)
    }
    
    console.log(`✅ 备份完成，共 ${allData.length} 条数据`)
    return {
      success: true,
      data: allData,
      count: allData.length
    }
    
  } catch (error) {
    console.error('❌ 备份失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
```

4. 部署云函数
5. 在云开发控制台中测试云函数
6. 查看返回的数据

## 方法三：使用微信开发者工具（需要配置）

### 步骤：
1. 在微信开发者工具中，确保项目已开启云开发
2. 在 `app.js` 中确保已初始化云开发：

```javascript
// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-4gyu3i1id5f4e2fa', // 你的环境ID
        traceUser: true,
      })
    }
  }
})
```

3. 在任意页面的 JS 文件中执行备份代码：

```javascript
// 在页面的 onLoad 或按钮点击事件中执行
async function backupData() {
  try {
    const db = wx.cloud.database()
    const questionsCollection = db.collection('questions')
    
    const allData = []
    let offset = 0
    const limit = 100
    
    while (true) {
      const result = await questionsCollection
        .skip(offset)
        .limit(limit)
        .get()
      
      if (result.data.length === 0) {
        break
      }
      
      allData.push(...result.data)
      offset += limit
      console.log(`已获取 ${allData.length} 条数据`)
    }
    
    console.log('备份数据:', allData)
    return allData
    
  } catch (error) {
    console.error('备份失败:', error)
  }
}

// 调用备份函数
backupData()
```

## 推荐使用方法一

**方法一（导出功能）** 是最简单、最安全的方法，因为：
- 不需要编写代码
- 直接下载 JSON 文件
- 操作简单，不容易出错
- 可以随时恢复数据

## 下一步操作

1. 使用方法一导出现有数据
2. 保存备份文件到安全位置
3. 然后继续执行数据迁移步骤
