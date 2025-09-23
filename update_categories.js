const fs = require('fs');
const path = require('path');

try {
  console.log('开始执行分类名称更新脚本...');
  
  // 读取数据库文件
  const filePath = path.join(__dirname, 'miniprogram/data/intermediate_questions.js');
  console.log('文件路径:', filePath);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  console.log('文件读取成功，文件大小:', content.length, '字符');
  
  // 定义需要替换的分类名称映射
  const categoryMappings = {
    '"谓语(1)"': '"时态(一般现在时)"',
    '"谓语(2)"': '"时态(一般过去时)"',
    '"谓语(3)"': '"时态(一般将来时)"',
    '"谓语(4)"': '"时态(过去将来时)"',
    '"谓语(5)"': '"时态(现在进行时)"',
    '"谓语(6)"': '"时态(过去进行时)"',
    '"谓语(7)"': '"时态(现在完成时)"',
    '"谓语(8)"': '"时态(过去完成时)"',
    '"谓语(9)"': '"语态(被动+八大时态)"'
  };
  
  // 执行替换
  let updatedContent = content;
  let totalReplacements = 0;
  
  for (const [oldCategory, newCategory] of Object.entries(categoryMappings)) {
    // 使用字符串替换而不是正则表达式
    const matches = (updatedContent.split(oldCategory).length - 1);
    if (matches > 0) {
      updatedContent = updatedContent.replace(new RegExp(oldCategory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newCategory);
      totalReplacements += matches;
      console.log(`替换 ${oldCategory} -> ${newCategory}: ${matches} 次`);
    } else {
      console.log(`未找到 ${oldCategory} 的匹配项`);
    }
  }
  
  // 写回文件
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  
  console.log(`\n总共完成 ${totalReplacements} 次替换`);
  console.log('分类名称更新完成！');
  
} catch (error) {
  console.error('脚本执行出错:', error.message);
  console.error('错误堆栈:', error.stack);
}
