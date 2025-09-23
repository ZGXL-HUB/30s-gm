const fs = require('fs');
const path = require('path');

// 读取本地数据文件
function readLocalData() {
  const dataPath = path.join(__dirname, 'miniprogram', 'data', 'intermediate_questions.js');
  
  try {
    const content = fs.readFileSync(dataPath, 'utf8');
    
    // 提取questions对象 - 使用更精确的正则表达式
    const match = content.match(/const questions = ({[\s\S]*?});/);
    if (!match) {
      throw new Error('无法解析questions数据');
    }
    
    // 使用Function构造函数安全地执行代码
    const questionsCode = `return ${match[1]};`;
    const questions = new Function(questionsCode)();
    
    return questions;
  } catch (error) {
    console.error('读取本地数据失败:', error.message);
    console.error('错误详情:', error);
    return null;
  }
}

// 转换数据格式为云数据库格式
function convertToCloudFormat(questions) {
  const cloudData = [];
  
  Object.keys(questions).forEach(category => {
    const categoryQuestions = questions[category];
    
    // 检查categoryQuestions是否为数组
    if (!Array.isArray(categoryQuestions)) {
      console.warn(`跳过非数组格式的分类: ${category}`);
      return;
    }
    
    categoryQuestions.forEach((question, index) => {
      // 检查question是否为有效对象
      if (!question || typeof question !== 'object') {
        console.warn(`跳过无效的题目数据: ${category}[${index}]`);
        return;
      }
      
      // 判断数据类型
      let type = 'question'; // 默认为题目
      let additionalFields = {};
      
      // 检查是否为笔记数据
      if (question.notes || question.note) {
        type = 'note';
        additionalFields = {
          notes: question.notes || question.note,
          tables: question.tables || null
        };
      }
      
      // 检查是否为表格数据
      if (question.table || question.tables) {
        type = 'table';
        additionalFields = {
          table: question.table || question.tables,
          interactive: question.interactive || false
        };
      }
      
      cloudData.push({
        category: category,
        type: type,
        text: question.text || '',
        answer: question.answer || '',
        analysis: question.analysis || '',
        order: index + 1,
        createTime: new Date(),
        updateTime: new Date(),
        source: 'local_migration',
        ...additionalFields
      });
    });
  });
  
  return cloudData;
}

// 生成云数据库导入脚本
function generateCloudImportScript(cloudData) {
  const script = `
// 云数据库数据导入脚本
// 请在云开发控制台执行以下代码

const db = wx.cloud.database();
const questionsCollection = db.collection('questions');

// 清空现有数据
await questionsCollection.where({}).remove();

// 导入新数据
const questions = ${JSON.stringify(cloudData, null, 2)};

for (let i = 0; i < questions.length; i += 100) {
  const batch = questions.slice(i, i + 100);
  await questionsCollection.add({
    data: batch
  });
  console.log(\`已导入第 \${i + 1} 到 \${Math.min(i + 100, questions.length)} 条数据\`);
}

console.log('数据导入完成！');
`;

  const scriptPath = path.join(__dirname, 'cloud_import_script.js');
  fs.writeFileSync(scriptPath, script);
  console.log(`✅ 云数据库导入脚本已生成: ${scriptPath}`);
}

// 生成前端调用示例
function generateFrontendExample() {
  const example = `
// 前端调用云函数示例
// 在需要获取题目的页面中使用

// 获取指定分类的题目
async function getQuestionsByCategory(category, limit = 10, offset = 0) {
  try {
    const result = await wx.cloud.callFunction({
      name: 'getQuestionsData',
      data: {
        action: 'getQuestionsByCategory',
        category: category,
        limit: limit,
        offset: offset
      }
    });
    
    if (result.result.success) {
      return result.result.data;
    } else {
      throw new Error(result.result.error);
    }
  } catch (error) {
    console.error('获取题目失败:', error);
    return [];
  }
}

// 获取所有分类
async function getCategories() {
  try {
    const result = await wx.cloud.callFunction({
      name: 'getQuestionsData',
      data: {
        action: 'getCategories'
      }
    });
    
    if (result.result.success) {
      return result.result.data;
    } else {
      throw new Error(result.result.error);
    }
  } catch (error) {
    console.error('获取分类失败:', error);
    return [];
  }
}

// 使用示例
Page({
  data: {
    questions: [],
    categories: [],
    currentCategory: 'all'
  },
  
  onLoad() {
    this.loadCategories();
    this.loadQuestions();
  },
  
  async loadCategories() {
    const categories = await getCategories();
    this.setData({ categories });
  },
  
  async loadQuestions(category = 'all') {
    const questions = await getQuestionsByCategory(category, 20, 0);
    this.setData({ 
      questions,
      currentCategory: category
    });
  },
  
  onCategoryChange(e) {
    const category = e.detail.value;
    this.loadQuestions(category);
  }
});
`;

  const examplePath = path.join(__dirname, 'frontend_example.js');
  fs.writeFileSync(examplePath, example);
  console.log(`✅ 前端调用示例已生成: ${examplePath}`);
}

// 主函数
function main() {
  console.log('🔄 开始数据迁移准备...');
  
  // 读取本地数据
  const localData = readLocalData();
  if (!localData) {
    console.error('❌ 无法读取本地数据，迁移失败');
    return;
  }
  
  console.log(`📊 读取到 ${Object.keys(localData).length} 个分类的数据`);
  
  // 转换数据格式
  const cloudData = convertToCloudFormat(localData);
  console.log(`📝 转换为云数据库格式，共 ${cloudData.length} 条记录`);
  
  // 生成导入脚本
  generateCloudImportScript(cloudData);
  
  // 生成前端示例
  generateFrontendExample();
  
  console.log('\n✅ 数据迁移准备完成！');
  console.log('📋 下一步操作:');
  console.log('1. 部署 getQuestionsData 云函数');
  console.log('2. 在云开发控制台执行 cloud_import_script.js');
  console.log('3. 修改前端代码使用云函数获取数据');
  console.log('4. 删除本地的 intermediate_questions.js 文件');
  console.log('5. 重新打包小程序');
}

main();
