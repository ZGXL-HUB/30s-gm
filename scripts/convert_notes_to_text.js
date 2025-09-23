const fs = require('fs');
const path = require('path');

// 读取前端数据源
const frontendPath = path.join(__dirname, '../miniprogram/data/intermediate_questions.js');
const frontendContent = fs.readFileSync(frontendPath, 'utf8');

// 读取云端数据源
const cloudPath = path.join(__dirname, '../cloudfunctions/initializeQuestions/questions.js');
const cloudContent = fs.readFileSync(cloudPath, 'utf8');

// HTML表格转文本格式的函数
function convertHtmlTableToText(htmlContent) {
  // 如果内容不包含HTML表格，直接返回
  if (!htmlContent.includes('<table')) {
    return htmlContent;
  }

  // 提取表格内容
  const tableMatch = htmlContent.match(/<table[^>]*>([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    return htmlContent;
  }

  const tableHtml = tableMatch[1];
  
  // 提取表头
  const headerMatch = tableHtml.match(/<thead>([\s\S]*?)<\/thead>/);
  let headers = [];
  if (headerMatch) {
    const headerHtml = headerMatch[1];
    const thMatches = headerHtml.match(/<th[^>]*>([^<]*)<\/th>/g);
    if (thMatches) {
      headers = thMatches.map(th => th.replace(/<[^>]*>/g, '').trim());
    }
  }

  // 提取表格行
  const tbodyMatch = tableHtml.match(/<tbody>([\s\S]*?)<\/tbody>/);
  let rows = [];
  if (tbodyMatch) {
    const tbodyHtml = tbodyMatch[1];
    const trMatches = tbodyHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g);
    if (trMatches) {
      rows = trMatches.map(tr => {
        const tdMatches = tr.match(/<td[^>]*>([^<]*)<\/td>/g);
        if (tdMatches) {
          return tdMatches.map(td => td.replace(/<[^>]*>/g, '').trim());
        }
        return [];
      }).filter(row => row.length > 0);
    }
  }

  // 如果没有找到tbody，尝试直接从table中提取tr
  if (rows.length === 0) {
    const trMatches = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g);
    if (trMatches) {
      rows = trMatches.map(tr => {
        const tdMatches = tr.match(/<td[^>]*>([^<]*)<\/td>/g);
        if (tdMatches) {
          return tdMatches.map(td => td.replace(/<[^>]*>/g, '').trim());
        }
        return [];
      }).filter(row => row.length > 0);
    }
  }

  // 生成文本格式表格
  let textTable = '';
  
  if (headers.length > 0) {
    // 添加表头
    textTable += headers.join('  |  ') + '\n';
    textTable += '─'.repeat(headers.join('  |  ').length) + '\n';
  }

  // 添加表格行
  rows.forEach(row => {
    textTable += row.join('  |  ') + '\n';
  });

  // 替换原HTML表格
  return htmlContent.replace(/<table[^>]*>[\s\S]*?<\/table>/, textTable.trim());
}

// 处理数据源中的笔记内容
function processNotes(content) {
  let processedContent = content;
  
  // 查找所有笔记条目
  const noteMatches = content.match(/"([^"]*_note_[^"]*)":\s*{[^}]*"content":\s*"([^"]*(?:\\.[^"]*)*)"[^}]*}/g);
  
  if (noteMatches) {
    noteMatches.forEach(match => {
      const idMatch = match.match(/"([^"]*_note_[^"]*)":/);
      const contentMatch = match.match(/"content":\s*"([^"]*(?:\\.[^"]*)*)"/);
      
      if (idMatch && contentMatch) {
        const noteId = idMatch[1];
        let noteContent = contentMatch[1];
        
        // 解码转义字符
        noteContent = noteContent.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        
        // 转换HTML表格
        const convertedContent = convertHtmlTableToText(noteContent);
        
        if (convertedContent !== noteContent) {
          console.log(`转换笔记: ${noteId}`);
          
          // 重新编码内容
          const encodedContent = convertedContent.replace(/\n/g, '\\n').replace(/"/g, '\\"');
          
          // 替换原内容
          const oldPattern = new RegExp(`"${noteId}":\\s*{[^}]*"content":\\s*"([^"]*(?:\\\\.[^"]*)*)"[^}]*}`, 'g');
          const newContent = `"${noteId}": {
    "id": "${noteId}",
    "frontendName": "${noteId.replace(/_/g, ' ')}",
    "content": "${encodedContent}",
    "category": "笔记",
    "subCategory": "笔记",
    "status": "已创建"
  }`;
          
          processedContent = processedContent.replace(oldPattern, newContent);
        }
      }
    });
  }
  
  return processedContent;
}

// 处理前端数据源
console.log('开始处理前端数据源...');
const processedFrontend = processNotes(frontendContent);

// 处理云端数据源
console.log('开始处理云端数据源...');
const processedCloud = processNotes(cloudContent);

// 写入文件
fs.writeFileSync(frontendPath, processedFrontend, 'utf8');
fs.writeFileSync(cloudPath, processedCloud, 'utf8');

console.log('✅ 批量转换完成！');
console.log('📁 前端数据源已更新:', frontendPath);
console.log('📁 云端数据源已更新:', cloudPath);
console.log('�� 请重新启动小程序以查看效果'); 