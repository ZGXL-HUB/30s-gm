const fs = require('fs');
const path = require('path');

// 生成云数据库备份脚本
function generateBackupScript() {
  const script = `
// 云数据库备份脚本
// 请在云开发控制台执行以下代码

const db = wx.cloud.database();
const questionsCollection = db.collection('questions');

// 获取所有数据
async function backupData() {
  const allData = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    const result = await questionsCollection
      .skip(offset)
      .limit(limit)
      .get();
    
    if (result.data.length === 0) {
      break;
    }
    
    allData.push(...result.data);
    offset += limit;
    
    console.log(\`已获取 \${allData.length} 条数据\`);
  }
  
  console.log('备份数据:', JSON.stringify(allData, null, 2));
  return allData;
}

// 执行备份
backupData().then(data => {
  console.log(\`✅ 备份完成，共 \${data.length} 条数据\`);
}).catch(error => {
  console.error('❌ 备份失败:', error);
});
`;

  const scriptPath = path.join(__dirname, 'backup_cloud_data.js');
  fs.writeFileSync(scriptPath, script);
  console.log(`✅ 云数据库备份脚本已生成: ${scriptPath}`);
}

// 生成数据合并脚本
function generateMergeScript() {
  const script = `
// 数据合并脚本
// 将本地新数据与云数据库数据合并

const db = wx.cloud.database();
const questionsCollection = db.collection('questions');

// 合并策略：
// 1. 对于题目数据：按 category 和 text 去重
// 2. 对于笔记数据：添加 type: "note" 标识
// 3. 对于表格数据：添加 type: "table" 标识

async function mergeData() {
  // 这里需要将本地数据转换为云数据库格式
  const localData = []; // 从本地文件读取的数据
  
  for (const item of localData) {
    // 检查是否已存在相同数据
    const existing = await questionsCollection
      .where({
        category: item.category,
        text: item.text
      })
      .get();
    
    if (existing.data.length === 0) {
      // 添加新数据
      await questionsCollection.add({
        data: {
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'local_merge'
        }
      });
      console.log(\`添加新数据: \${item.text.substring(0, 30)}...\`);
    } else {
      console.log(\`数据已存在: \${item.text.substring(0, 30)}...\`);
    }
  }
}

console.log('开始合并数据...');
mergeData().then(() => {
  console.log('✅ 数据合并完成');
}).catch(error => {
  console.error('❌ 合并失败:', error);
});
`;

  const scriptPath = path.join(__dirname, 'merge_cloud_data.js');
  fs.writeFileSync(scriptPath, script);
  console.log(`✅ 数据合并脚本已生成: ${scriptPath}`);
}

// 主函数
function main() {
  console.log('🔄 准备数据备份和合并工具...');
  
  generateBackupScript();
  generateMergeScript();
  
  console.log('\n✅ 工具准备完成！');
  console.log('📋 建议操作顺序:');
  console.log('1. 在云开发控制台执行 backup_cloud_data.js 备份现有数据');
  console.log('2. 运行 migrate_data_to_cloud.js 准备本地数据');
  console.log('3. 执行 merge_cloud_data.js 合并数据');
  console.log('4. 验证数据完整性');
  console.log('5. 删除本地 intermediate_questions.js 文件');
}

main();
