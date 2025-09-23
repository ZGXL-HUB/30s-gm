// 调用云函数导入数据的脚本
// 这个脚本需要在微信开发者工具的控制台中运行

// 首先读取生成的云数据库导入脚本中的数据
const fs = require('fs');
const path = require('path');

// 读取cloud_import_script.js文件中的数据
function readCloudImportData() {
  try {
    const scriptPath = path.join(__dirname, 'cloud_import_script.js');
    const content = fs.readFileSync(scriptPath, 'utf8');
    
    // 提取questions数组
    const match = content.match(/const questions = (\[[\s\S]*?\]);/);
    if (!match) {
      throw new Error('无法解析questions数据');
    }
    
    // 使用Function构造函数安全地执行代码
    const questionsCode = `return ${match[1]};`;
    const questions = new Function(questionsCode)();
    
    return questions;
  } catch (error) {
    console.error('读取数据失败:', error.message);
    return null;
  }
}

// 调用云函数导入数据
async function importDataToCloud() {
  try {
    // 读取数据
    const questions = readCloudImportData();
    if (!questions) {
      console.error('❌ 无法读取数据');
      return;
    }
    
    console.log(`📊 准备导入 ${questions.length} 条数据...`);
    
    // 调用云函数
    const result = await wx.cloud.callFunction({
      name: 'importExportQuestions',
      data: {
        action: 'importFromMigration',
        data: {
          questions: questions
        }
      }
    });
    
    if (result.result.success) {
      console.log('✅ 数据导入成功！');
      console.log('📝 导入结果:', result.result.message);
      console.log('📊 导入统计:', result.result.data);
    } else {
      console.error('❌ 数据导入失败:', result.result.message);
    }
    
  } catch (error) {
    console.error('❌ 调用云函数失败:', error);
  }
}

// 清空现有数据（可选）
async function clearExistingData() {
  try {
    console.log('🗑️ 正在清空现有数据...');
    
    const result = await wx.cloud.callFunction({
      name: 'importExportQuestions',
      data: {
        action: 'clearAll'
      }
    });
    
    if (result.result.success) {
      console.log('✅ 数据清空成功！');
      console.log('📝 清空结果:', result.result.message);
    } else {
      console.error('❌ 数据清空失败:', result.result.message);
    }
    
  } catch (error) {
    console.error('❌ 清空数据失败:', error);
  }
}

// 主函数
async function main() {
  console.log('🔄 开始数据迁移到云数据库...');
  
  // 可选：先清空现有数据
  // await clearExistingData();
  
  // 导入新数据
  await importDataToCloud();
  
  console.log('🎉 数据迁移完成！');
}

// 如果直接运行此脚本
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { importDataToCloud, clearExistingData };
} else {
  // 在微信开发者工具控制台中运行
  main();
}
