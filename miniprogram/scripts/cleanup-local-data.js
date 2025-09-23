// 本地数据清理脚本
// 在确认云端数据迁移成功后运行此脚本

const fs = require('fs');
const path = require('path');

// 需要移动到备份目录的文件
const filesToBackup = [
  'data/grammar_test_sets.js',
  'data/intermediate_questions.js', 
  'data/writing_pronouns.js',
  'data/writing_nouns.js',
  'data/writing_tenses.js',
  'data/writing_voices.js',
  'data/writing_comparisons.js',
  'data/writing_adverbs.js',
  'writing_exercise_questions.js'
];

// 备份目录
const backupDir = '../backup/cloud-migration-backup';

// 创建备份目录
function createBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('📁 创建备份目录:', backupDir);
  }
}

// 备份文件
function backupFiles() {
  console.log('📦 开始备份文件...');
  
  filesToBackup.forEach(filePath => {
    const sourcePath = path.join(__dirname, '..', filePath);
    const backupPath = path.join(__dirname, backupDir, path.basename(filePath));
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, backupPath);
        console.log(`✅ 已备份: ${filePath}`);
      } catch (error) {
        console.error(`❌ 备份失败: ${filePath}`, error);
      }
    } else {
      console.log(`⚠️ 文件不存在: ${filePath}`);
    }
  });
}

// 创建占位文件
function createPlaceholderFiles() {
  console.log('📝 创建占位文件...');
  
  const placeholderContent = `// 此文件已迁移到云端
// 请使用 cloudDataLoader 从云端加载数据
// 备份文件位置: ../backup/cloud-migration-backup/

console.warn('此文件已迁移到云端，请使用 cloudDataLoader 加载数据');

module.exports = {};
`;

  filesToBackup.forEach(filePath => {
    const targetPath = path.join(__dirname, '..', filePath);
    const dir = path.dirname(targetPath);
    
    // 确保目录存在
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    try {
      fs.writeFileSync(targetPath, placeholderContent);
      console.log(`📝 创建占位文件: ${filePath}`);
    } catch (error) {
      console.error(`❌ 创建占位文件失败: ${filePath}`, error);
    }
  });
}

// 生成迁移报告
function generateMigrationReport() {
  const report = {
    migrationDate: new Date().toISOString(),
    filesBackedUp: filesToBackup,
    backupLocation: backupDir,
    estimatedSizeReduction: '约1.5MB',
    nextSteps: [
      '1. 测试云端数据加载功能',
      '2. 确认所有页面正常工作',
      '3. 删除备份文件（可选）',
      '4. 重新编译小程序检查主包大小'
    ]
  };
  
  const reportPath = path.join(__dirname, backupDir, 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('📊 迁移报告已生成:', reportPath);
}

// 主函数
function main() {
  console.log('🧹 开始清理本地数据...');
  
  try {
    createBackupDir();
    backupFiles();
    createPlaceholderFiles();
    generateMigrationReport();
    
    console.log('✅ 本地数据清理完成！');
    console.log('📊 预计主包大小减少: 约1.5MB');
    console.log('📁 备份文件位置:', backupDir);
    
  } catch (error) {
    console.error('❌ 清理过程出错:', error);
  }
}

// 执行清理
main();

module.exports = {
  backupFiles,
  createPlaceholderFiles,
  generateMigrationReport
};
