// 简单的云函数调用脚本
// 在微信开发者工具控制台运行

// 调用云函数导入数据
async function importToCloud() {
  try {
    console.log('🔄 开始调用云函数导入数据...');
    
    // 这里需要手动添加数据
    const questions = [
      // 请将 cloud_import_script.js 中的 questions 数组内容粘贴到这里
      // 建议每次粘贴 200-300 条数据
    ];
    
    if (questions.length === 0) {
      console.log('⚠️ 请先在 questions 数组中添加数据');
      return;
    }
    
    console.log(`📊 准备导入 ${questions.length} 条数据...`);
    
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
      console.log('📝 结果:', result.result.message);
    } else {
      console.error('❌ 导入失败:', result.result.message);
    }
    
  } catch (error) {
    console.error('❌ 调用失败:', error);
  }
}

// 清空数据
async function clearCloudData() {
  try {
    console.log('🗑️ 正在清空云数据库...');
    
    const result = await wx.cloud.callFunction({
      name: 'importExportQuestions',
      data: {
        action: 'clearAll'
      }
    });
    
    if (result.result.success) {
      console.log('✅ 数据清空成功！');
      console.log('📝 结果:', result.result.message);
    } else {
      console.error('❌ 清空失败:', result.result.message);
    }
    
  } catch (error) {
    console.error('❌ 清空失败:', error);
  }
}

// 导出函数
window.importToCloud = importToCloud;
window.clearCloudData = clearCloudData;

console.log('📋 可用的函数:');
console.log('- clearCloudData() - 清空云数据库');
console.log('- importToCloud() - 导入数据到云数据库（需要先添加数据）');
