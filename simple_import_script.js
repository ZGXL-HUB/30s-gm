// 简化的数据导入脚本
// 可以直接在微信开发者工具控制台运行

// 第一步：清空现有数据
async function clearData() {
  try {
    const result = await wx.cloud.database().collection('questions').where({}).remove();
    console.log('✅ 数据清空成功，删除了', result.stats.removed, '条记录');
    return true;
  } catch (error) {
    console.error('❌ 清空数据失败:', error);
    return false;
  }
}

// 第二步：导入数据（分批）
async function importData() {
  try {
    // 这里需要手动复制 cloud_import_script.js 中的 questions 数组
    // 由于数据量很大，建议分批导入
    console.log('📝 请手动复制 cloud_import_script.js 中的 questions 数组内容');
    console.log('📝 然后替换下面的 questions 变量');
    
    // 示例：第一批数据（前100条）
    const questions = [
      // 在这里粘贴 cloud_import_script.js 中的 questions 数组内容
      // 建议每次粘贴 100-200 条数据
    ];
    
    if (questions.length === 0) {
      console.log('⚠️ 请先添加数据到 questions 数组');
      return;
    }
    
    console.log(`📊 准备导入 ${questions.length} 条数据...`);
    
    // 分批导入
    const batchSize = 50;
    let importedCount = 0;
    
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      // 为每条数据添加时间戳
      const batchWithTime = batch.map(item => ({
        ...item,
        createTime: new Date(),
        updateTime: new Date()
      }));
      
      // 批量添加
      const tasks = batchWithTime.map(item => {
        return wx.cloud.database().collection('questions').add({
          data: item
        });
      });
      
      await Promise.all(tasks);
      importedCount += batch.length;
      console.log(`✅ 已导入第 ${i + 1} 到 ${Math.min(i + batchSize, questions.length)} 条数据`);
    }
    
    console.log(`🎉 数据导入完成！共导入 ${importedCount} 条数据`);
    
  } catch (error) {
    console.error('❌ 导入失败:', error);
  }
}

// 主函数
async function main() {
  console.log('🔄 开始数据迁移...');
  
  // 1. 清空现有数据
  const cleared = await clearData();
  if (!cleared) {
    console.log('❌ 清空数据失败，停止导入');
    return;
  }
  
  // 2. 导入新数据
  await importData();
  
  console.log('🎉 数据迁移完成！');
}

// 导出函数供控制台使用
window.clearData = clearData;
window.importData = importData;
window.main = main;

console.log('📋 可用的函数:');
console.log('- clearData() - 清空现有数据');
console.log('- importData() - 导入数据（需要先添加数据到 questions 数组）');
console.log('- main() - 执行完整的迁移流程');
