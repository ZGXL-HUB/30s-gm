// 测试原生WXML组件显示笔记内容的功能
const testNoteContent = `一、基本概念与标志词
一般过去时表示过去某个时间发生的动作或存在的状态，常搭配明确的过去时间标志词。
常见标志词：yesterday(昨天)、last week(上周)、ago(…… 以前)、just now(刚才)、in 2020(在 2020 年)等。

二、动词过去式的变化规则及示例
动词过去式分为规则变化和不规则变化，重点掌握规则变化，不规则变化需单独记忆。

规则变化：
• 一般情况：直接加 - ed
  例：save → saved(节省)、work → worked(工作)、play → played(玩)
• 以不发音的 e 结尾：加 - d
  例：like → liked(喜欢)、live → lived(居住)
• 以重读闭音节结尾且末尾只有一个辅音字母：双写辅音字母加 - ed
  例：plan → planned(计划)、stop → stopped(停止)、drop → dropped(掉落)
• 以 "辅音字母 + y" 结尾：变 y 为 i 加 - ed(元音字母 + y 结尾直接加 - ed)
  例：try → tried(尝试)、study → studied(学习)；play → played(玩，元音 + y)

不规则变化(需特殊记忆)：
例：write → wrote(写)、go → went(去)、see → saw(看见)、eat → ate(吃)

三、考察示例
用所给动词的适当形式填空：
(1)She ______ (plan) a trip last month.(答案：planned，重读闭音节结尾双写 n 加 - ed)
(2)They ______ (try) their best yesterday.(答案：tried，辅音 + y 结尾变 y 为 i 加 - ed)
(3)He ______ (write) a letter just now.(答案：wrote，不规则变化)

改错：
I study English last night.(错误：study → 改正：studied，last night 是过去时标志，用过去式)
She stoped here 5 minutes ago.(错误：stoped → 改正：stopped，重读闭音节结尾需双写 p)`;

// 模拟解析函数
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
    if (/^[一二三四五六七八九十]+、/.test(line)) {
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
    // 检查是否是表格（包含|符号）
    else if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
      // 收集表格行
      const tableRows = [];
      let j = i;
      while (j < lines.length && lines[j].includes('|')) {
        tableRows.push(lines[j].trim());
        j++;
      }
      
      const tableData = parseTableRows(tableRows);
      const tableItem = {
        type: 'table',
        data: tableData
      };
      
      if (currentSubsection) {
        currentSubsection.items.push(tableItem);
      } else if (currentSection) {
        currentSection.items.push(tableItem);
      }
      
      i = j - 1; // 跳过已处理的表格行
    }
    // 检查是否是示例（包含括号的题目）
    else if (line.includes('(') && line.includes(')') && (line.includes('答案：') || line.includes('错误：'))) {
      const item = {
        type: 'example',
        content: line
      };
      
      if (currentSubsection) {
        currentSubsection.items.push(item);
      } else if (currentSection) {
        currentSection.items.push(item);
      }
    }
    // 普通文本
    else {
      const textItem = {
        type: 'text',
        content: line
      };
      
      if (currentSubsection) {
        currentSubsection.items.push(textItem);
      } else if (currentSection) {
        currentSection.items.push(textItem);
      }
    }
  }
  
  // 添加最后一个section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

// 解析表格行数据
function parseTableRows(rows) {
  if (rows.length === 0) return null;
  
  const tableData = {
    headers: [],
    rows: []
  };
  
  let isFirstRow = true;
  
  rows.forEach((row) => {
    // 跳过分隔符行
    if (row.includes('------')) {
      return;
    }
    
    const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
    if (cells.length === 0) return;
    
    if (isFirstRow) {
      tableData.headers = cells;
      isFirstRow = false;
    } else {
      tableData.rows.push(cells);
    }
  });
  
  return tableData;
}

// 测试解析
console.log('测试笔记内容解析:');
const structuredData = parseNoteContentToStructuredData(testNoteContent);
console.log('解析结果:', JSON.stringify(structuredData, null, 2));

// 验证解析结果
if (structuredData) {
  console.log('\n验证结果:');
  console.log(`- 章节数量: ${structuredData.length}`);
  structuredData.forEach((section, index) => {
    console.log(`- 章节${index + 1}: ${section.title}`);
    console.log(`  - 子章节数量: ${section.subsections.length}`);
    console.log(`  - 直接项目数量: ${section.items.length}`);
    
    section.items.forEach((item, itemIndex) => {
      console.log(`  - 项目${itemIndex + 1}: ${item.type} - ${item.content.substring(0, 50)}...`);
    });
  });
} 