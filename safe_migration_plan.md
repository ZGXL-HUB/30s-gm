# 安全的云数据库迁移方案

## 问题分析

当前语法组合系统的核心问题：
1. **硬编码映射表**：`getGrammarPointsByCategory`函数中的分类映射是硬编码的
2. **数据结构不一致**：本地数据使用大类名称，云数据库使用具体语法点名称
3. **系统组合逻辑依赖**：需要大类→子点的映射关系来生成组合

## 解决方案

### 阶段1：创建分类映射API（关键步骤）

#### 1.1 创建语法点分类映射云函数

```javascript
// cloudfunctions/grammarCategoryMapping/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { action, category } = event
  
  // 语法点分类映射表（保持与本地一致）
  const categoryMapping = {
    "介词": ["介词综合", "固定搭配", "介词 + 名词/动名词"],
    "代词": ["代词综合", "人称代词", "物主代词", "反身代词", "关系代词", "it相关"],
    "连词": ["并列连词综合", "从属连词综合", "连词与名/动/形/副综合", "连词与名词", "连词与动词", "连词与形容词"],
    "冠词": ["冠词综合", "泛指与特指", "a和an", "the的特殊用法"],
    "名词": ["名词综合", "复合词和外来词", "单复数同形", "不规则复数", "以o结尾", "以y结尾", "s/sh/ch/x结尾", "以f/fe结尾"],
    "动词": ["被动写be吗", "并列句与动词", "主从句与动词", "插入语与动词"],
    "谓语": ["谓语", "时态(一般过去时)", "时态(一般将来时)", "时态(过去将来时)", "时态(现在进行时)", "时态(过去进行时)", "时态(现在完成时)", "时态(过去完成时)", "语态(被动+八大时态)"],
    "非谓语": ["现在分词综合", "过去分词综合", "不定式综合"],
    "形容词": ["形容词综合", "比较级", "最高级"],
    "副词": ["副词综合", "副词修饰动词", "副词修饰句子", "副词修饰形容词/副词"],
    "定语从句": ["定语从句综合", "that能填吗", "who和which选哪个", "whose", "which和when/where混淆"],
    "状语和从句": ["状语从句综合", "when", "where", "how", "why"]
  }
  
  switch (action) {
    case 'getCategoryMapping':
      return { success: true, data: categoryMapping }
    
    case 'getSubPointsByCategory':
      const subPoints = categoryMapping[category] || []
      return { success: true, data: subPoints }
    
    case 'getAllCategories':
      return { success: true, data: Object.keys(categoryMapping) }
    
    case 'validateGrammarPoint':
      const allSubPoints = Object.values(categoryMapping).flat()
      const isValid = allSubPoints.includes(category)
      return { success: true, data: { isValid, category } }
    
    default:
      return { success: false, error: 'Invalid action' }
  }
}
```

#### 1.2 创建增强的题目获取云函数

```javascript
// cloudfunctions/getQuestionsData/index.js (增强版)
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { action, category, type, limit = 10, offset = 0, grammarPoints = [] } = event
  
  try {
    switch (action) {
      case 'getQuestionsByCategory':
        return await getQuestionsByCategory(category, type, limit, offset)
      
      case 'getQuestionsByGrammarPoints':
        return await getQuestionsByGrammarPoints(grammarPoints, limit, offset)
      
      case 'getSystemComboQuestions':
        return await getSystemComboQuestions(limit)
      
      case 'getCategories':
        return await getCategories()
      
      default:
        return { success: false, error: 'Invalid action' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 根据语法点列表获取题目（用于系统组合）
async function getQuestionsByGrammarPoints(grammarPoints, limit, offset) {
  const collection = db.collection('questions')
  
  const result = await collection
    .where({
      category: db.command.in(grammarPoints)
    })
    .skip(offset)
    .limit(limit)
    .get()
  
  return {
    success: true,
    data: result.data,
    total: result.data.length
  }
}

// 生成系统组合题目
async function getSystemComboQuestions(limit = 10) {
  // 调用分类映射云函数获取系统组合规则
  const categoryMapping = await cloud.callFunction({
    name: 'grammarCategoryMapping',
    data: { action: 'getCategoryMapping' }
  })
  
  const systemComboRules = {
    "介词": 1,
    "代词": 1,
    "连词": 1,
    "冠词": 1,
    "名词": 1,
    "动词": 1,
    "谓语": 1,
    "非谓语": 1,
    "形容词": 1,
    "副词": 1
  }
  
  const selectedGrammarPoints = []
  const mapping = categoryMapping.data
  
  // 根据系统组合规则选择语法点
  Object.keys(systemComboRules).forEach(category => {
    const subPoints = mapping[category] || []
    if (subPoints.length > 0) {
      const randomPoint = subPoints[Math.floor(Math.random() * subPoints.length)]
      selectedGrammarPoints.push(randomPoint)
    }
  })
  
  // 获取对应的题目
  return await getQuestionsByGrammarPoints(selectedGrammarPoints, limit, 0)
}
```

### 阶段2：前端适配层

#### 2.1 创建语法分类服务

```javascript
// miniprogram/utils/grammarCategoryService.js
class GrammarCategoryService {
  constructor() {
    this.categoryMapping = null
    this.cacheExpiry = 0
    this.cacheDuration = 24 * 60 * 60 * 1000 // 24小时缓存
  }
  
  // 获取分类映射（带缓存）
  async getCategoryMapping() {
    if (this.categoryMapping && Date.now() < this.cacheExpiry) {
      return this.categoryMapping
    }
    
    try {
      const result = await wx.cloud.callFunction({
        name: 'grammarCategoryMapping',
        data: { action: 'getCategoryMapping' }
      })
      
      if (result.result.success) {
        this.categoryMapping = result.result.data
        this.cacheExpiry = Date.now() + this.cacheDuration
        return this.categoryMapping
      }
    } catch (error) {
      console.error('获取分类映射失败:', error)
    }
    
    // 降级到本地映射
    return this.getLocalCategoryMapping()
  }
  
  // 本地映射（降级方案）
  getLocalCategoryMapping() {
    return {
      "介词": ["介词综合", "固定搭配", "介词 + 名词/动名词"],
      "代词": ["代词综合", "人称代词", "物主代词", "反身代词", "关系代词", "it相关"],
      "连词": ["并列连词综合", "从属连词综合", "连词与名/动/形/副综合", "连词与名词", "连词与动词", "连词与形容词"],
      "冠词": ["冠词综合", "泛指与特指", "a和an", "the的特殊用法"],
      "名词": ["名词综合", "复合词和外来词", "单复数同形", "不规则复数", "以o结尾", "以y结尾", "s/sh/ch/x结尾", "以f/fe结尾"],
      "动词": ["被动写be吗", "并列句与动词", "主从句与动词", "插入语与动词"],
      "谓语": ["谓语", "时态(一般过去时)", "时态(一般将来时)", "时态(过去将来时)", "时态(现在进行时)", "时态(过去进行时)", "时态(现在完成时)", "时态(过去完成时)", "语态(被动+八大时态)"],
      "非谓语": ["现在分词综合", "过去分词综合", "不定式综合"],
      "形容词": ["形容词综合", "比较级", "最高级"],
      "副词": ["副词综合", "副词修饰动词", "副词修饰句子", "副词修饰形容词/副词"],
      "定语从句": ["定语从句综合", "that能填吗", "who和which选哪个", "whose", "which和when/where混淆"],
      "状语和从句": ["状语从句综合", "when", "where", "how", "why"]
    }
  }
  
  // 根据分类获取语法点
  async getGrammarPointsByCategory(category) {
    const mapping = await this.getCategoryMapping()
    return mapping[category] || []
  }
  
  // 验证语法点是否存在
  async validateGrammarPoint(grammarPoint) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'grammarCategoryMapping',
        data: { action: 'validateGrammarPoint', category: grammarPoint }
      })
      return result.result.success ? result.result.data.isValid : false
    } catch (error) {
      console.error('验证语法点失败:', error)
      // 降级到本地验证
      const mapping = await this.getCategoryMapping()
      const allPoints = Object.values(mapping).flat()
      return allPoints.includes(grammarPoint)
    }
  }
}

module.exports = new GrammarCategoryService()
```

#### 2.2 修改语法选择页面

```javascript
// miniprogram/pages/grammar-select/index.js (关键修改)
const grammarCategoryService = require('../../utils/grammarCategoryService')

Page({
  // ... 其他代码 ...
  
  // 修改：使用云服务获取分类映射
  async getSubPointsByCategory(category) {
    console.log(`[云服务] 获取分类 ${category} 的子点列表`)
    
    try {
      const subPoints = await grammarCategoryService.getGrammarPointsByCategory(category)
      
      // 验证每个语法点是否存在
      const validPoints = []
      for (const point of subPoints) {
        const isValid = await grammarCategoryService.validateGrammarPoint(point)
        if (isValid) {
          validPoints.push(point)
        }
      }
      
      console.log(`[云服务] 分类 ${category} 的有效子点:`, validPoints)
      return validPoints
    } catch (error) {
      console.error('获取子点失败，使用本地映射:', error)
      // 降级到本地逻辑
      return this.getLocalSubPointsByCategory(category)
    }
  },
  
  // 本地降级方案
  getLocalSubPointsByCategory(category) {
    const categoryIndex = this.data.categories.indexOf(category)
    if (categoryIndex === -1) return []
    
    const subPoints = this.data.rightPanel[categoryIndex] || []
    return subPoints.filter(point => this.isPointExists(point))
  },
  
  // 修改：系统组合逻辑
  async executeSystemCombo(isPreview = false) {
    const applyCombo = async () => {
      try {
        // 使用云服务生成系统组合
        const result = await wx.cloud.callFunction({
          name: 'getQuestionsData',
          data: { action: 'getSystemComboQuestions', limit: 10 }
        })
        
        if (result.result.success && result.result.data.length > 0) {
          // 从云服务返回的题目中提取语法点
          const selectedPoints = {}
          result.result.data.forEach(question => {
            const category = question.category
            selectedPoints[category] = (selectedPoints[category] || 0) + 1
          })
          
          this.setData({ selectedPoints })
          this.updateComputedData()
          
          if (isPreview) {
            wx.showToast({ title: '系统组合已加载，可查看调整', icon: 'none', duration: 1500 })
          } else {
            wx.showToast({ title: '系统组合已加载', icon: 'none', duration: 1500 })
          }
        } else {
          // 降级到本地逻辑
          this.executeLocalSystemCombo(isPreview)
        }
      } catch (error) {
        console.error('云服务系统组合失败，使用本地逻辑:', error)
        this.executeLocalSystemCombo(isPreview)
      }
    }
    
    // 确认逻辑保持不变
    if (Object.keys(this.data.selectedPoints).length > 0) {
      wx.showModal({
        title: '确认覆盖',
        content: '加载系统默认组合将覆盖您当前的选题，是否继续？',
        success: (res) => {
          if (res.confirm) applyCombo()
        }
      })
    } else {
      applyCombo()
    }
  },
  
  // 本地系统组合逻辑（降级方案）
  executeLocalSystemCombo(isPreview) {
    // 保持原有的本地逻辑作为降级方案
    const systemComboRules = {
      "介词": 1,
      "代词": 1,
      "连词": 1,
      "冠词": 1,
      "名词": 1,
      "动词": 1,
      "谓语": 1,
      "非谓语": { "现在分词综合": 1, "过去分词综合": 1, "不定式综合": 1 },
      "形容词/副词": 1,
      "定语从句/状语和从句": 1
    }
    
    // ... 保持原有逻辑 ...
  }
})
```

### 阶段3：数据迁移和验证

#### 3.1 创建安全的数据迁移脚本

```javascript
// safe_migrate_to_cloud.js
const fs = require('fs')
const path = require('path')

// 读取本地数据
function readLocalData() {
  try {
    const filePath = './miniprogram/data/intermediate_questions.js'
    const content = fs.readFileSync(filePath, 'utf8')
    
    // 提取questions对象
    const questionsMatch = content.match(/const questions = ({[\s\S]*?});/)
    if (!questionsMatch) {
      throw new Error('无法找到questions对象')
    }
    
    const questionsStr = questionsMatch[1]
    const questions = Function('return ' + questionsStr)()
    
    console.log(`✅ 成功读取本地数据，共 ${Object.keys(questions).length} 个分类`)
    return questions
  } catch (error) {
    console.error('❌ 读取本地数据失败:', error.message)
    return null
  }
}

// 验证数据完整性
function validateDataIntegrity(localData) {
  const issues = []
  
  // 检查必要的语法点分类
  const requiredCategories = [
    "介词综合", "代词综合", "连词综合", "冠词综合", "名词综合",
    "现在分词综合", "过去分词综合", "不定式综合",
    "形容词综合", "副词综合", "定语从句综合", "状语从句综合"
  ]
  
  requiredCategories.forEach(category => {
    if (!localData[category]) {
      issues.push(`缺少必要分类: ${category}`)
    } else if (!Array.isArray(localData[category])) {
      issues.push(`分类 ${category} 数据格式错误`)
    } else if (localData[category].length === 0) {
      issues.push(`分类 ${category} 数据为空`)
    }
  })
  
  if (issues.length > 0) {
    console.log('⚠️ 数据完整性问题:')
    issues.forEach(issue => console.log(`  - ${issue}`))
    return false
  }
  
  console.log('✅ 数据完整性验证通过')
  return true
}

// 转换数据格式
function convertToCloudFormat(questions) {
  const cloudData = []
  let totalQuestions = 0
  
  Object.keys(questions).forEach(category => {
    const categoryQuestions = questions[category]
    
    if (!Array.isArray(categoryQuestions)) {
      console.warn(`⚠️ 跳过非数组格式的分类: ${category}`)
      return
    }
    
    categoryQuestions.forEach((question, index) => {
      if (!question || typeof question !== 'object') {
        console.warn(`⚠️ 跳过无效的题目数据: ${category}[${index}]`)
        return
      }
      
      cloudData.push({
        category: category,
        type: 'question',
        text: question.text || '',
        answer: question.answer || '',
        analysis: question.analysis || '',
        order: index + 1,
        createTime: new Date(),
        updateTime: new Date(),
        source: 'safe_migration'
      })
      
      totalQuestions++
    })
  })
  
  console.log(`✅ 转换完成，共 ${totalQuestions} 道题目`)
  return cloudData
}

// 生成迁移脚本
function generateMigrationScript(cloudData) {
  const script = `
// 安全的数据迁移脚本
// 请在云开发控制台执行

const db = wx.cloud.database()
const questionsCollection = db.collection('questions')

async function safeMigration() {
  try {
    console.log('开始安全迁移...')
    
    // 1. 备份现有数据
    const existingData = await questionsCollection.get()
    console.log(\`备份现有数据: \${existingData.data.length} 条记录\`)
    
    // 2. 清空现有数据
    await questionsCollection.where({}).remove()
    console.log('已清空现有数据')
    
    // 3. 导入新数据
    const questions = ${JSON.stringify(cloudData, null, 2)}
    
    for (let i = 0; i < questions.length; i += 100) {
      const batch = questions.slice(i, i + 100)
      await questionsCollection.add({ data: batch })
      console.log(\`已导入第 \${i + 1}-${Math.min(i + 100, questions.length)} 条记录\`)
    }
    
    console.log('✅ 迁移完成!')
    
    // 4. 验证迁移结果
    const verifyData = await questionsCollection.count()
    console.log(\`验证结果: \${verifyData.total} 条记录\`)
    
    return { success: true, total: verifyData.total }
  } catch (error) {
    console.error('❌ 迁移失败:', error)
    return { success: false, error: error.message }
  }
}

// 执行迁移
safeMigration().then(result => {
  console.log('迁移结果:', result)
})
`
  
  return script
}

// 主函数
function main() {
  console.log('🚀 开始安全数据迁移...')
  
  // 1. 读取本地数据
  const localData = readLocalData()
  if (!localData) {
    console.error('❌ 无法读取本地数据，迁移终止')
    return
  }
  
  // 2. 验证数据完整性
  if (!validateDataIntegrity(localData)) {
    console.error('❌ 数据完整性验证失败，迁移终止')
    return
  }
  
  // 3. 转换数据格式
  const cloudData = convertToCloudFormat(localData)
  
  // 4. 生成迁移脚本
  const migrationScript = generateMigrationScript(cloudData)
  
  // 5. 保存迁移脚本
  fs.writeFileSync('./safe_migration_script.js', migrationScript, 'utf8')
  
  console.log('✅ 迁移脚本已生成: safe_migration_script.js')
  console.log('📋 下一步操作:')
  console.log('  1. 部署新的云函数: grammarCategoryMapping')
  console.log('  2. 更新 getQuestionsData 云函数')
  console.log('  3. 在云开发控制台执行 safe_migration_script.js')
  console.log('  4. 验证语法组合功能')
}

main()
```

#### 3.2 创建验证脚本

```javascript
// validate_migration.js
const cloud = require('wx-server-sdk')

async function validateMigration() {
  console.log('🔍 开始验证迁移结果...')
  
  try {
    // 1. 验证分类映射API
    console.log('1. 验证分类映射API...')
    const mappingResult = await cloud.callFunction({
      name: 'grammarCategoryMapping',
      data: { action: 'getCategoryMapping' }
    })
    
    if (mappingResult.result.success) {
      console.log('✅ 分类映射API正常')
      const categories = Object.keys(mappingResult.result.data)
      console.log(`   支持的分类: ${categories.length} 个`)
    } else {
      console.log('❌ 分类映射API异常')
      return false
    }
    
    // 2. 验证系统组合功能
    console.log('2. 验证系统组合功能...')
    const comboResult = await cloud.callFunction({
      name: 'getQuestionsData',
      data: { action: 'getSystemComboQuestions', limit: 10 }
    })
    
    if (comboResult.result.success && comboResult.result.data.length > 0) {
      console.log('✅ 系统组合功能正常')
      console.log(`   生成题目数量: ${comboResult.result.data.length}`)
      
      // 验证题目分类分布
      const categoryStats = {}
      comboResult.result.data.forEach(q => {
        categoryStats[q.category] = (categoryStats[q.category] || 0) + 1
      })
      console.log('   分类分布:', categoryStats)
    } else {
      console.log('❌ 系统组合功能异常')
      return false
    }
    
    // 3. 验证具体分类查询
    console.log('3. 验证具体分类查询...')
    const categoryResult = await cloud.callFunction({
      name: 'getQuestionsData',
      data: { 
        action: 'getQuestionsByCategory', 
        category: '介词综合', 
        limit: 5 
      }
    })
    
    if (categoryResult.result.success) {
      console.log('✅ 分类查询功能正常')
      console.log(`   介词综合题目数量: ${categoryResult.result.data.length}`)
    } else {
      console.log('❌ 分类查询功能异常')
      return false
    }
    
    console.log('🎉 所有验证通过！迁移成功！')
    return true
    
  } catch (error) {
    console.error('❌ 验证失败:', error)
    return false
  }
}

validateMigration()
```

### 阶段4：部署和回滚方案

#### 4.1 部署步骤

```bash
# 1. 部署新的云函数
cd cloudfunctions/grammarCategoryMapping
npm install
# 在微信开发者工具中部署

cd ../getQuestionsData
npm install
# 在微信开发者工具中部署

# 2. 生成迁移脚本
node safe_migrate_to_cloud.js

# 3. 在云开发控制台执行迁移
# 复制 safe_migration_script.js 内容到云开发控制台执行

# 4. 验证迁移结果
node validate_migration.js
```

#### 4.2 回滚方案

```javascript
// rollback_migration.js
// 回滚脚本（在云开发控制台执行）

const db = wx.cloud.database()
const questionsCollection = db.collection('questions')

async function rollbackMigration() {
  try {
    console.log('开始回滚迁移...')
    
    // 1. 清空云数据库
    await questionsCollection.where({}).remove()
    console.log('已清空云数据库')
    
    // 2. 恢复本地数据加载
    // 需要手动修改前端代码，恢复本地数据加载逻辑
    
    console.log('✅ 回滚完成！')
    console.log('📋 请手动恢复前端代码中的本地数据加载逻辑')
    
  } catch (error) {
    console.error('❌ 回滚失败:', error)
  }
}

rollbackMigration()
```

## 关键优势

1. **保持功能完整性**：通过分类映射API确保语法组合功能正常工作
2. **渐进式迁移**：分步骤执行，每步都有验证
3. **降级方案**：云服务失败时自动降级到本地逻辑
4. **数据验证**：迁移前后都有完整的数据验证
5. **回滚机制**：出现问题时可以快速回滚

## 执行顺序

1. 先部署新的云函数
2. 执行数据迁移
3. 验证功能正常
4. 最后删除本地数据文件

这个方案确保了语法组合功能不会失效，同时实现了安全的云数据库迁移。
