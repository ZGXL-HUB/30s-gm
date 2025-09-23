// 测试前端表格显示功能
const fs = require('fs');

// 模拟前端的数据结构
const questionsData = {
  "noun_note_001": {
    "id": "noun_note_001",
    "frontendName": "名词笔记(概述)",
    "content": "一、名词的分类\n\n📋 详细规则：\n\n🔹 举例(中文 + 英文)\n规则：类别名称\n\n🔹 李白(Li Bai)、北京(Beijing)、春节(Spring Festival)\n规则：专有名词\n\n🔹 学生(student)、电脑(computer)、树(tree)\n规则：个体名词(可数)\n\n🔹 家庭(family)、团队(team)、班级(class)\n规则：集体名词(可单可复)\n\n🔹 水(water)、钢铁(steel)、空气(air)\n规则：物质名词(不可数)\n\n🔹 幸福(happiness)、勇气(courage)、知识(knowledge)\n规则：抽象名词(不可数)\n\n二、名词的识别与书写(后缀示例)\n\n📋 详细规则：\n\n🔹 举例(动词 / 形容词→名词)\n规则：名词后缀\n\n🔹 失败(fail→failure)、压力(press→pressure)\n规则：-ure\n\n🔹 死亡(die→death)、真相(true→truth)\n规则：-th"
  }
};

// 模拟 parseNoteContentToStructuredData 函数
function parseNoteContentToStructuredData(content) {
  if (!content) return null;
  
  const sections = [];
  const lines = content.split('\n');
  let currentSection = null;
  let currentSubsection = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // 检查是否是主标题（以数字开头，如"一、"、"二、"等）
    if (/^[一二三四五六七八九十]+、/.test(line) || /^## [一二三四五六七八九十]+、/.test(line)) {
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
      if (currentSection) {
        currentSubsection = {
          title: line,
          items: []
        };
        currentSection.subsections.push(currentSubsection);
      }
    }
    // 检查是否是🔹开头的行（可能是表格的一部分）
    else if (line.startsWith('🔹')) {
      // 检查下一行是否是"规则："开头
      if (i + 1 < lines.length && lines[i + 1].trim().startsWith('规则：')) {
        // 收集特殊格式表格行
        const tableRows = [];
        let j = i;
        
        // 查找表格开始（包含"详细规则"的行）
        while (j >= 0 && !lines[j].includes('📋 详细规则：')) {
          j--;
        }
        
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
                  j += 2;
                  continue;
                }
                
                tableRows.push(`| ${leftContent} | ${rightContent} |`);
                j++; // 跳过规则行
              }
            }
            
            j++;
          }
        }
        
        if (tableRows.length > 0) {
          const tableData = parseTableRows(tableRows);
          if (tableData && tableData.headers.length > 0) {
            const tableItem = {
              type: 'table',
              data: tableData
            };
            
            if (currentSubsection) {
              currentSubsection.items.push(tableItem);
            } else if (currentSection) {
              currentSection.items.push(tableItem);
            }
          }
        }
        
        i = j - 1; // 跳过已处理的表格行
      } else {
        // 不是表格的一部分，作为普通文本处理
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
  
  return sections;
}

// 模拟 parseTableRows 函数
function parseTableRows(rows) {
  if (!rows || rows.length === 0) return null;
  
  const headers = [];
  const tableRows = [];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].trim();
    if (!row) continue;
    
    // 跳过分隔符行
    if (row.includes('|') && row.replace(/[|\-\s]/g, '') === '') {
      continue;
    }
    
    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
    
    if (i === 0) {
      // 第一行作为表头
      headers.push(...cells);
    } else {
      // 其他行作为数据行
      tableRows.push(cells);
    }
  }
  
  return {
    headers: headers,
    rows: tableRows
  };
}

// 模拟 mergeItemsInArray 函数
function mergeItemsInArray(items) {
  if (items.length <= 1) return items;
  
  const mergedItems = [];
  let i = 0;
  
  while (i < items.length) {
    const currentItem = items[i];
    
    // 检查是否是表格，如果是表格直接保留
    if (currentItem.type === 'table') {
      mergedItems.push(currentItem);
      i++;
      continue;
    }
    
    // 其他项目直接保留（简化处理）
    mergedItems.push(currentItem);
    i++;
  }
  
  return mergedItems;
}

// 模拟 mergeRelatedItems 函数
function mergeRelatedItems(sections) {
  sections.forEach(section => {
    // 处理直接项目
    section.items = mergeItemsInArray(section.items);
    
    // 处理子章节项目
    section.subsections.forEach(subsection => {
      subsection.items = mergeItemsInArray(subsection.items);
    });
  });
  
  return sections;
}

// 测试函数
function testFrontendTableDisplay() {
  console.log('=== 测试前端表格显示功能 ===');
  
  // 获取笔记数据
  const noteData = questionsData["noun_note_001"];
  console.log(`测试笔记: ${noteData.frontendName}`);
  console.log(`笔记ID: ${noteData.id}`);
  
  // 解析笔记内容
  const structuredData = parseNoteContentToStructuredData(noteData.content);
  
  if (structuredData) {
    console.log(`解析出 ${structuredData.length} 个章节`);
    
    // 合并相关项目
    const mergedData = mergeRelatedItems(structuredData);
    
    mergedData.forEach((section, sectionIndex) => {
      console.log(`\n章节 ${sectionIndex + 1}: ${section.title}`);
      
      // 检查直接项目中的表格
      const directTables = section.items.filter(item => item.type === 'table');
      console.log(`直接项目中的表格数量: ${directTables.length}`);
      
      directTables.forEach((table, tableIndex) => {
        console.log(`  表格 ${tableIndex + 1}:`);
        console.log(`    标题: ${table.title || '无标题'}`);
        console.log(`    表头: ${table.data.headers.join(' | ')}`);
        console.log(`    行数: ${table.data.rows.length}`);
        console.log(`    表格结构:`);
        console.log('    ┌' + '─'.repeat(80) + '┐');
        console.log('    │ ' + table.data.headers.join(' │ ') + ' │');
        console.log('    ├' + '─'.repeat(80) + '┤');
        table.data.rows.forEach((row, rowIndex) => {
          console.log('    │ ' + row.join(' │ ') + ' │');
        });
        console.log('    └' + '─'.repeat(80) + '┘');
      });
      
      // 检查子章节中的表格
      section.subsections.forEach((subsection, subIndex) => {
        const subTables = subsection.items.filter(item => item.type === 'table');
        if (subTables.length > 0) {
          console.log(`  子章节 ${subIndex + 1} (${subsection.title}) 中的表格数量: ${subTables.length}`);
        }
      });
    });
    
    // 模拟前端渲染
    console.log('\n=== 模拟前端渲染 ===');
    mergedData.forEach((section, sectionIndex) => {
      console.log(`\n渲染章节: ${section.title}`);
      
      section.items.forEach((item, itemIndex) => {
        if (item.type === 'table') {
          console.log(`  渲染表格 ${itemIndex + 1}:`);
          console.log(`    <view class="table-container">`);
          console.log(`      <view class="table-row header">`);
          item.data.headers.forEach((header, headerIndex) => {
            console.log(`        <view class="table-cell header-cell">`);
            console.log(`          <text class="table-text header-text">${header}</text>`);
            console.log(`        </view>`);
          });
          console.log(`      </view>`);
          
          item.data.rows.forEach((row, rowIndex) => {
            console.log(`      <view class="table-row">`);
            row.forEach((cell, cellIndex) => {
              console.log(`        <view class="table-cell">`);
              console.log(`          <text class="table-text">${cell}</text>`);
              console.log(`        </view>`);
            });
            console.log(`      </view>`);
          });
          console.log(`    </view>`);
        } else {
          console.log(`  渲染其他内容: ${item.type} - ${item.content.substring(0, 50)}...`);
        }
      });
    });
    
  } else {
    console.log('解析失败');
  }
}

// 运行测试
testFrontendTableDisplay();

console.log('\n=== 测试完成 ==='); 