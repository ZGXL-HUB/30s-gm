// 内容迁移实施脚本
const fs = require('fs');
const path = require('path');

class ContentMigrationManager {
  constructor() {
    this.backupDir = './backup';
    this.newContentDir = './new_content';
    this.migrationLogDir = './migration_log';
    this.ensureDirectories();
  }

  // 确保目录存在
  ensureDirectories() {
    const dirs = [
      this.backupDir,
      `${this.backupDir}/original_content`,
      `${this.backupDir}/original_content/writing_rules_notes`,
      `${this.backupDir}/original_content/writing_rules_tables`,
      this.newContentDir,
      `${this.newContentDir}/preposition`,
      this.migrationLogDir
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // 备份原有内容
  async backupOriginalContent() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${this.backupDir}/original_content/backup_${timestamp}`;
    
    console.log('开始备份原有内容...');
    
    try {
      // 这里需要根据你的实际文件结构来备份
      // 示例：备份现有的笔记和表格文件
      const filesToBackup = [
        // 添加你需要备份的文件路径
        // './miniprogram/data/writing_*.js',
        // './miniprogram/pages/writing-rules/*.js'
      ];
      
      // 创建备份记录
      const backupRecord = {
        timestamp: timestamp,
        files: filesToBackup,
        description: '原有内容备份'
      };
      
      fs.writeFileSync(
        `${backupPath}/backup_record.json`, 
        JSON.stringify(backupRecord, null, 2)
      );
      
      console.log(`备份完成: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('备份失败:', error);
      throw error;
    }
  }

  // 部署新内容
  async deployNewContent(category = 'preposition') {
    console.log(`开始部署新内容: ${category}`);
    
    try {
      // 读取新内容数据
      const newContentData = JSON.parse(
        fs.readFileSync(`./preposition_complete_data.json`, 'utf8')
      );
      
      // 为新内容添加版本标记
      const versionedContent = this.addVersionMarkers(newContentData, 'v2');
      
      // 保存到新内容目录
      const outputPath = `${this.newContentDir}/${category}/complete_data_v2.json`;
      fs.writeFileSync(outputPath, JSON.stringify(versionedContent, null, 2));
      
      console.log(`新内容部署完成: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('部署失败:', error);
      throw error;
    }
  }

  // 添加版本标记
  addVersionMarkers(content, version) {
    const versionedContent = { ...content };
    
    // 为tables添加版本标记
    if (versionedContent.tables) {
      Object.keys(versionedContent.tables).forEach(key => {
        versionedContent.tables[key].version = version;
        versionedContent.tables[key].deploymentDate = new Date().toISOString();
      });
    }
    
    // 为notes添加版本标记
    if (versionedContent.notes) {
      Object.keys(versionedContent.notes).forEach(key => {
        versionedContent.notes[key].version = version;
        versionedContent.notes[key].deploymentDate = new Date().toISOString();
      });
    }
    
    // 为exerciseCategories添加版本标记
    if (versionedContent.exerciseCategories) {
      Object.keys(versionedContent.exerciseCategories).forEach(key => {
        versionedContent.exerciseCategories[key].version = version;
        versionedContent.exerciseCategories[key].deploymentDate = new Date().toISOString();
      });
    }
    
    return versionedContent;
  }

  // 创建迁移日志
  async createMigrationLog(action, details) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action,
      details,
      status: 'completed'
    };
    
    const logFile = `${this.migrationLogDir}/migration_log.json`;
    let logs = [];
    
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }
    
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    
    console.log(`迁移日志已记录: ${action}`);
  }

  // 验证迁移结果
  async validateMigration(category = 'preposition') {
    console.log(`验证迁移结果: ${category}`);
    
    try {
      // 检查新内容文件是否存在
      const newContentPath = `${this.newContentDir}/${category}/complete_data_v2.json`;
      if (!fs.existsSync(newContentPath)) {
        throw new Error('新内容文件不存在');
      }
      
      // 验证数据结构
      const newContent = JSON.parse(fs.readFileSync(newContentPath, 'utf8'));
      
      // 验证必要字段
      const requiredFields = ['tables', 'notes', 'exerciseCategories'];
      requiredFields.forEach(field => {
        if (!newContent[field]) {
          throw new Error(`缺少必要字段: ${field}`);
        }
      });
      
      // 验证表格数据完整性
      Object.keys(newContent.tables).forEach(tableKey => {
        const table = newContent.tables[tableKey];
        if (!table.tableData || !table.tableData.headers || !table.tableData.rows) {
          throw new Error(`表格数据不完整: ${tableKey}`);
        }
      });
      
      console.log('迁移验证通过');
      return true;
    } catch (error) {
      console.error('迁移验证失败:', error);
      throw error;
    }
  }

  // 执行完整迁移流程
  async executeFullMigration(category = 'preposition') {
    try {
      console.log('=== 开始完整迁移流程 ===');
      
      // 1. 备份原有内容
      const backupPath = await this.backupOriginalContent();
      await this.createMigrationLog('backup', { backupPath });
      
      // 2. 部署新内容
      const deployPath = await this.deployNewContent(category);
      await this.createMigrationLog('deploy', { deployPath, category });
      
      // 3. 验证迁移结果
      await this.validateMigration(category);
      await this.createMigrationLog('validate', { category, status: 'success' });
      
      console.log('=== 迁移流程完成 ===');
      return {
        backupPath,
        deployPath,
        status: 'success'
      };
    } catch (error) {
      console.error('迁移流程失败:', error);
      await this.createMigrationLog('error', { error: error.message });
      throw error;
    }
  }

  // 生成迁移报告
  async generateMigrationReport() {
    const logFile = `${this.migrationLogDir}/migration_log.json`;
    if (!fs.existsSync(logFile)) {
      console.log('没有找到迁移日志');
      return;
    }
    
    const logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    
    const report = {
      totalMigrations: logs.length,
      successfulMigrations: logs.filter(log => log.status === 'completed').length,
      failedMigrations: logs.filter(log => log.status === 'error').length,
      lastMigration: logs[logs.length - 1],
      migrationTimeline: logs.map(log => ({
        timestamp: log.timestamp,
        action: log.action,
        status: log.status
      }))
    };
    
    const reportPath = `${this.migrationLogDir}/migration_report.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('迁移报告已生成:', reportPath);
    return report;
  }
}

// 使用示例
async function main() {
  const migrationManager = new ContentMigrationManager();
  
  try {
    // 执行完整迁移
    const result = await migrationManager.executeFullMigration('preposition');
    console.log('迁移结果:', result);
    
    // 生成报告
    const report = await migrationManager.generateMigrationReport();
    console.log('迁移报告:', report);
  } catch (error) {
    console.error('迁移失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = ContentMigrationManager; 