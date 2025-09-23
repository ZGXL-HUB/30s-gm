// 生产环境日志清理脚本
// 用于移除生产环境中的console.log语句

const fs = require('fs');
const path = require('path');

// 需要清理的文件类型
const fileExtensions = ['.js', '.wxs'];

// 需要清理的目录
const directories = [
  'miniprogram/pages',
  'miniprogram/components',
  'miniprogram/utils'
];

// 清理规则
const cleanRules = [
  // 移除console.log
  {
    pattern: /console\.log\([^)]*\);?\s*\n?/g,
    replacement: ''
  },
  // 移除console.error（保留错误处理但移除调试信息）
  {
    pattern: /console\.error\([^)]*\);?\s*\n?/g,
    replacement: ''
  },
  // 移除console.warn
  {
    pattern: /console\.warn\([^)]*\);?\s*\n?/g,
    replacement: ''
  },
  // 移除console.info
  {
    pattern: /console\.info\([^)]*\);?\s*\n?/g,
    replacement: ''
  },
  // 移除console.debug
  {
    pattern: /console\.debug\([^)]*\);?\s*\n?/g,
    replacement: ''
  },
  // 移除空行（连续的空行）
  {
    pattern: /\n\s*\n\s*\n/g,
    replacement: '\n\n'
  }
];

function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // 应用清理规则
    cleanRules.forEach(rule => {
      content = content.replace(rule.pattern, rule.replacement);
    });
    
    // 如果内容有变化，写回文件
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已清理: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ 清理失败: ${filePath}`, error.message);
    return false;
  }
}

function cleanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️ 目录不存在: ${dirPath}`);
    return;
  }
  
  const files = fs.readdirSync(dirPath);
  let cleanedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      cleanedCount += cleanDirectory(filePath);
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (fileExtensions.includes(ext)) {
        if (cleanFile(filePath)) {
          cleanedCount++;
        }
      }
    }
  });
  
  return cleanedCount;
}

// 主函数
function main() {
  console.log('🧹 开始清理生产环境日志...');
  
  let totalCleaned = 0;
  
  directories.forEach(dir => {
    console.log(`\n📁 清理目录: ${dir}`);
    const cleaned = cleanDirectory(dir);
    totalCleaned += cleaned;
    console.log(`   清理了 ${cleaned} 个文件`);
  });
  
  console.log(`\n🎉 清理完成！总共清理了 ${totalCleaned} 个文件`);
  console.log('\n⚠️ 注意：请检查清理后的代码，确保没有破坏重要功能');
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { cleanFile, cleanDirectory, main };
