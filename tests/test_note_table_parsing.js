// 测试笔记表格解析功能
const fs = require('fs');

// 模拟 parseNoteContentToStructuredData 函数
function parseNoteContentToStructuredData(content) {
  if (!content) return null;
  
  const sections = [];
  const lines = content.split('\n');
  let currentSection = null;
  let currentSubsection = null;
  
  console.log('=== 开始解析 ===');
  console.log(`总行数: ${lines.length}`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    console.log(`处理第 ${i} 行: "${line}"`);
    
    // 检查是否是主标题（以数字开头，如"一、"、"二、"等）
    if (/^[一二三四五六七八九十]+、/.test(line) || /^## [一二三四五六七八九十]+、/.test(line)) {
      console.log(`  识别为主标题: ${line}`);
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line,
        subsections: [],
        items: []
      };
      currentSubsection = null;
    }
    // 检查是否是子标题（以数字开头，如"1."、"2."等）
    else if (/^\d+\./.test(line)) {
      console.log(`  识别为子标题: ${line}`);
      if (currentSection) {
        currentSubsection = {
          title: line,
          items: []
        };
        currentSection.subsections.push(currentSubsection);
      }
    }
    // 检查是否是特殊格式表格（🔹 规则：格式）
    else if (line.includes('🔹') && line.includes('规则：')) {
      console.log(`  识别为特殊格式表格行: ${line}`);
      
      // 收集特殊格式表格行
      const tableRows = [];
      let j = i;
      
      // 查找表格开始（包含"详细规则"的行）
      while (j >= 0 && !lines[j].includes('📋 详细规则：')) {
        j--;
      }
      
      console.log(`  找到详细规则位置: ${j}`);
      
      if (j >= 0) {
        // 从"详细规则"开始收集到表格结束
        j++;
        while (j < lines.length) {
          const currentLine = lines[j].trim();
          
          // 如果遇到新的章节标题或其他内容，停止收集
          if ((currentLine && /^[一二三四五六七八九十]+、/.test(currentLine)) ||
              (currentLine && /^## [一二三四五六七八九十]+、/.test(currentLine)) ||
              (currentLine && /^\d+\./.test(currentLine)) ||
              (currentLine && currentLine.includes('考察示例')) ||
              (currentLine && currentLine.includes('解析：')) ||
              (currentLine && currentLine.includes('说明：'))) {
            console.log(`  遇到结束条件: ${currentLine}`);
            break;
          }
          
          // 如果是🔹格式的行，转换为表格行
          if (currentLine.includes('🔹') && currentLine.includes('规则：')) {
            const parts = currentLine.split('规则：');
            if (parts.length === 2) {
              const leftContent = parts[0].replace('🔹', '').trim();
              const rightContent = parts[1].trim();
              
              // 跳过分隔符行
              if (leftContent === '------' || rightContent === '------') {
                console.log(`  跳过分隔符行: ${currentLine}`);
                j++;
                continue;
              }
              
              const tableRow = `| ${leftContent} | ${rightContent} |`;
              tableRows.push(tableRow);
              console.log(`  添加表格行: ${tableRow}`);
            }
          }
          
          j++;
        }
      }
      
      console.log(`  收集到 ${tableRows.length} 行表格数据`);
      
      if (tableRows.length > 0) {
        const tableData = parseTableRows(tableRows);
        if (tableData && tableData.headers.length > 0) {
          const tableItem = {
            type: 'table',
            data: tableData
          };
          
          if (currentSubsection) {
            currentSubsection.items.push(tableItem);
            console.log(`  表格添加到子章节: ${currentSubsection.title}`);
          } else if (currentSection) {
            currentSection.items.push(tableItem);
            console.log(`  表格添加到章节: ${currentSection.title}`);
          }
        }
      }
      
      i = j - 1; // 跳过已处理的表格行
    }
    // 检查是否是🔹开头的行（可能是表格的一部分）
    else if (line.startsWith('🔹')) {
      console.log(`  识别为🔹开头行: ${line}`);
      
      // 检查下一行是否是"规则："开头
      if (i + 1 < lines.length && lines[i + 1].trim().startsWith('规则：')) {
        console.log(`  下一行是规则行: ${lines[i + 1].trim()}`);
        
        // 收集特殊格式表格行
        const tableRows = [];
        let j = i;
        
        // 查找表格开始（包含"详细规则"的行）
        while (j >= 0 && !lines[j].includes('📋 详细规则：')) {
          j--;
        }
        
        console.log(`  找到详细规则位置: ${j}`);
        
        if (j >= 0) {
          // 从"详细规则"开始收集到表格结束
          j++;
          while (j < lines.length) {
            const currentLine = lines[j].trim();
            
            // 如果遇到新的章节标题或其他内容，停止收集
            if ((currentLine && /^[一二三四五六七八九十]+、/.test(currentLine)) ||
                (currentLine && /^## [一二三四五六七八九十]+、/.test(currentLine)) ||
                (currentLine && /^\d+\./.test(currentLine)) ||
                (currentLine && currentLine.includes('考察示例')) ||
                (currentLine && currentLine.includes('解析：')) ||
                (currentLine && currentLine.includes('说明：'))) {
              console.log(`  遇到结束条件: ${currentLine}`);
              break;
            }
            
            // 如果是🔹格式的行，检查下一行是否是规则行
            if (currentLine.startsWith('🔹') && j + 1 < lines.length) {
              const nextLine = lines[j + 1].trim();
              if (nextLine.startsWith('规则：')) {
                const leftContent = currentLine.replace('🔹', '').trim();
                const rightContent = nextLine.replace('规则：', '').trim();
                
                // 跳过分隔符行
                if (leftContent === '------' || rightContent === '------') {
                  console.log(`  跳过分隔符行: ${currentLine} + ${nextLine}`);
                  j += 2;
                  continue;
                }
                
                const tableRow = `| ${leftContent} | ${rightContent} |`;
                tableRows.push(tableRow);
                console.log(`  添加表格行: ${tableRow}`);
                j++; // 跳过规则行
              }
            }
            
            j++;
          }
        }
        
        console.log(`  收集到 ${tableRows.length} 行表格数据`);
        
        if (tableRows.length > 0) {
          const tableData = parseTableRows(tableRows);
          if (tableData && tableData.headers.length > 0) {
            const tableItem = {
              type: 'table',
              data: tableData
            };
            
            if (currentSubsection) {
              currentSubsection.items.push(tableItem);
              console.log(`  表格添加到子章节: ${currentSubsection.title}`);
            } else if (currentSection) {
              currentSection.items.push(tableItem);
              console.log(`  表格添加到章节: ${currentSection.title}`);
            }
          }
        }
        
        i = j - 1; // 跳过已处理的表格行
      } else {
        // 不是表格的一部分，作为普通文本处理
        console.log(`  不是表格的一部分，作为普通文本处理`);
        const item = {
          type: 'text',
          content: line
        };
        
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.items.push(item);
        }
      }
    }
    // 检查是否是列表项（以•开头）
    else if (line.startsWith('•')) {
      console.log(`  识别为列表项: ${line}`);
      const item = {
        type: 'list',
        content: line.substring(1).trim()
      };
      
      if (currentSubsection) {
        currentSubsection.items.push(item);
      } else if (currentSection) {
        currentSection.items.push(item);
      }
    }
    // 其他内容作为普通文本
    else {
      console.log(`  识别为普通文本: ${line}`);
      const item = {
        type: 'text',
        content: line
      };
      
      if (currentSubsection) {
        currentSubsection.items.push(item);
      } else if (currentSection) {
        currentSection.items.push(item);
      }
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  console.log('=== 解析完成 ===');
  return sections;
}

// 模拟 parseTableRows 函数
function parseTableRows(rows) {
  if (!rows || rows.length === 0) return null;
  
  console.log('=== 解析表格行 ===');
  console.log(`输入行数: ${rows.length}`);
  
  const headers = [];
  const tableRows = [];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].trim();
    if (!row) continue;
    
    console.log(`处理表格行 ${i}: ${row}`);
    
    // 跳过分隔符行
    if (row.includes('|') && row.replace(/[|\-\s]/g, '') === '') {
      console.log(`  跳过分隔符行`);
      continue;
    }
    
    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
    console.log(`  解析出单元格: ${cells.join(' | ')}`);
    
    if (i === 0) {
      // 第一行作为表头
      headers.push(...cells);
      console.log(`  设置为表头: ${headers.join(' | ')}`);
    } else {
      // 其他行作为数据行
      tableRows.push(cells);
      console.log(`  添加数据行: ${cells.join(' | ')}`);
    }
  }
  
  const result = {
    headers: headers,
    rows: tableRows
  };
  
  console.log(`表格解析结果: ${headers.length} 列, ${tableRows.length} 行`);
  return result;
}

// 测试数据
const testContent = `一、名词的分类

📋 详细规则：

🔹 举例(中文 + 英文)
规则：类别名称

🔹 李白(Li Bai)、北京(Beijing)、春节(Spring Festival)
规则：专有名词

🔹 学生(student)、电脑(computer)、树(tree)
规则：个体名词(可数)

🔹 家庭(family)、团队(team)、班级(class)
规则：集体名词(可单可复)

🔹 水(water)、钢铁(steel)、空气(air)
规则：物质名词(不可数)

🔹 幸福(happiness)、勇气(courage)、知识(knowledge)
规则：抽象名词(不可数)

二、名词的识别与书写(后缀示例)

📋 详细规则：

🔹 举例(动词 / 形容词→名词)
规则：名词后缀

🔹 失败(fail→failure)、压力(press→pressure)
规则：-ure

🔹 死亡(die→death)、真相(true→truth)
规则：-th

三、考察示例
数词提示
题目：I bought two ______ (apple) this morning.
答案：apples(数词 two 提示用复数，符合 "一般情况加 -s" 规则)`;

console.log('=== 测试笔记中的表格解析 ===');

const result = parseNoteContentToStructuredData(testContent);

console.log(`解析出 ${result.length} 个章节\n`);

result.forEach((section, index) => {
  console.log(`章节 ${index + 1}: ${section.title}`);
  
  // 检查直接项目中的表格
  const directTables = section.items.filter(item => item.type === 'table');
  console.log(`直接项目中的表格数量: ${directTables.length}`);
  
  directTables.forEach((table, tableIndex) => {
    console.log(`  表格 ${tableIndex + 1}:`);
    console.log(`    标题: ${table.title || '无标题'}`);
    console.log(`    表头: ${table.data.headers.join(' | ')}`);
    console.log(`    行数: ${table.data.rows.length}`);
    table.data.rows.forEach((row, rowIndex) => {
      console.log(`      行 ${rowIndex + 1}: ${row.join(' | ')}`);
    });
  });
  
  // 检查子章节中的表格
  section.subsections.forEach((subsection, subIndex) => {
    const subTables = subsection.items.filter(item => item.type === 'table');
    if (subTables.length > 0) {
      console.log(`  子章节 ${subIndex + 1} (${subsection.title}) 中的表格数量: ${subTables.length}`);
      subTables.forEach((table, tableIndex) => {
        console.log(`    表格 ${tableIndex + 1}:`);
        console.log(`      标题: ${table.title || '无标题'}`);
        console.log(`      表头: ${table.data.headers.join(' | ')}`);
        console.log(`      行数: ${table.data.rows.length}`);
      });
    }
  });
  
  console.log('');
});

console.log('=== 测试完成 ==='); 