// 测试考察示例标题识别功能
const testNoteContent = `一、基本概念与标志词
一般过去时表示过去某个时间发生的动作或存在的状态，常搭配明确的过去时间标志词。
常见标志词：yesterday(昨天)、last week(上周)、ago(…… 以前)、just now(刚才)、in 2020(在 2020 年)等。

二、考察示例:
数词提示：前面有one以外的数词(如two, three, five等)。
例：three books(三本书)、five cities(五个城市)

修饰词提示：被 many, different, several, a lot of 等词修饰。
例：many heroes(许多英雄)、different knives(不同的刀)

无冠词提示：可数名词前无 a/an, 且表泛指(常出现在括号提示中)。
例：Please pass me (box) → boxes(提示box 需用复数)

三、动词提示
例：The tomatoes are red.(tomato 用复数，对应 are)
These children play...(children 用复数，对应原形 play)`;

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
    // 检查是否是表格标题（包含"表格"关键词）
    else if (line.includes('表格') && i + 1 < lines.length && lines[i + 1].includes('|')) {
      // 收集表格行
      const tableRows = [];
      let j = i + 1; // 从下一行开始收集
      while (j < lines.length && lines[j].includes('|') && lines[j].split('|').length >= 3) {
        tableRows.push(lines[j].trim());
        j++;
      }
      
      const tableData = parseTableRows(tableRows);
      if (tableData && tableData.headers.length > 0) {
        const tableItem = {
          type: 'table',
          title: line,
          data: tableData
        };
        
        if (currentSubsection) {
          currentSubsection.items.push(tableItem);
        } else if (currentSection) {
          currentSection.items.push(tableItem);
        }
      }
      
      i = j - 1; // 跳过已处理的表格行
    }
    // 检查是否是表格（包含|符号，更宽松的识别条件）
    else if (line.includes('|') && line.split('|').length >= 3) {
      // 收集表格行
      const tableRows = [];
      let j = i;
      while (j < lines.length && lines[j].includes('|') && lines[j].split('|').length >= 3) {
        tableRows.push(lines[j].trim());
        j++;
      }
      
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
      
      i = j - 1; // 跳过已处理的表格行
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
  
  // 后处理：合并相关的规则和例子、题目和答案
  return mergeRelatedItems(sections);
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

// 合并相关的规则和例子、题目和答案
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

// 在数组中合并相关项目
function mergeItemsInArray(items) {
  if (items.length <= 1) return items;
  
  const mergedItems = [];
  let i = 0;
  
  while (i < items.length) {
    const currentItem = items[i];
    
    // 检查是否是考察示例标题
    if (isExamExampleTitle(currentItem)) {
      // 将考察示例作为标题处理，不参与循环结构识别
      mergedItems.push(currentItem);
      i++;
      continue;
    }
    
    // 检查是否是循环结构：提示+题目+答案 或 提示+例子
    if (isCycleStart(currentItem)) {
      // 先尝试提取完整的循环结构（提示+题目+答案）
      let cycleGroup = extractCycleGroup(items, i);
      
      // 如果没有找到完整结构，尝试提取简单结构（提示+例子）
      if (!cycleGroup) {
        cycleGroup = extractSimpleCycleGroup(items, i);
      }
      
      // 如果找到了循环结构，检查是否有连续的循环组
      if (cycleGroup) {
        const consecutiveGroups = extractConsecutiveCycleGroups(items, i);
        if (consecutiveGroups && consecutiveGroups.type === 'consecutive-cycle-groups') {
          mergedItems.push(consecutiveGroups);
          i = consecutiveGroups.endIndex + 1;
        } else {
          mergedItems.push(cycleGroup);
          i = cycleGroup.endIndex + 1;
        }
        continue;
      }
    }
    
    // 检查当前项目是否是规则或说明
    if (currentItem.type === 'text' && isRuleOrDescription(currentItem.content)) {
      // 查找相关的例子（包括多个例子）
      const relatedExamples = [];
      let j = i + 1;
      
      // 继续查找例子，直到遇到下一个规则或循环开始
      while (j < items.length) {
        const nextItem = items[j];
        
        // 如果遇到下一个规则或循环开始，停止查找
        if ((nextItem.type === 'text' && isRuleOrDescription(nextItem.content)) || 
            isCycleStart(nextItem) || isExamExampleTitle(nextItem)) {
          break;
        }
        
        // 如果是例子，添加到相关例子中
        if (isRelatedExample(nextItem, currentItem.content)) {
          relatedExamples.push(nextItem);
          j++;
        } else {
          // 如果不是例子，停止查找
          break;
        }
      }
      
      if (relatedExamples.length > 0) {
        // 创建组合项目
        const combinedItem = {
          type: 'rule-with-examples',
          rule: currentItem,
          examples: relatedExamples
        };
        mergedItems.push(combinedItem);
        i = j; // 跳过已处理的例子
      } else {
        mergedItems.push(currentItem);
        i++;
      }
    }
    // 检查当前项目是否是题目
    else if (currentItem.type === 'text' && isQuestion(currentItem.content)) {
      // 查找相关的答案
      const relatedAnswer = findRelatedAnswer(items, i + 1);
      
      if (relatedAnswer) {
        // 创建组合项目
        const combinedItem = {
          type: 'question-with-answer',
          question: currentItem,
          answer: relatedAnswer
        };
        mergedItems.push(combinedItem);
        i = relatedAnswer.index + 1; // 跳过答案
      } else {
        mergedItems.push(currentItem);
        i++;
      }
    }
    // 其他项目直接添加
    else {
      mergedItems.push(currentItem);
      i++;
    }
  }
  
  return mergedItems;
}

// 判断是否是规则或说明
function isRuleOrDescription(content) {
  const ruleKeywords = ['提示', '规则', '情况', '结尾', '变化', '记忆', '考查', '重点'];
  return ruleKeywords.some(keyword => content.includes(keyword));
}

// 判断是否是相关例子
function isRelatedExample(item, ruleContent) {
  if (item.type !== 'text' && item.type !== 'list') return false;
  
  const exampleKeywords = ['例：', '例如：', '例', '示例'];
  return exampleKeywords.some(keyword => item.content.includes(keyword));
}

// 判断是否是题目
function isQuestion(content) {
  const questionKeywords = ['题目：', '填空：', '选择：', '改错：', '用所给'];
  return questionKeywords.some(keyword => content.includes(keyword));
}

// 查找相关答案
function findRelatedAnswer(items, startIndex) {
  for (let i = startIndex; i < items.length; i++) {
    const item = items[i];
    if (item.type === 'text' && (item.content.includes('答案：') || item.content.includes('解析：'))) {
      return { ...item, index: i };
    }
  }
  return null;
}

// 检查是否是循环结构的开始
function isCycleStart(item) {
  if (item.type !== 'text') return false;
  
  const cycleStartKeywords = ['数词提示', '修饰词提示', '无冠词提示', '动词提示', '提示'];
  return cycleStartKeywords.some(keyword => item.content.includes(keyword));
}

// 检查是否是考察示例标题
function isExamExampleTitle(item) {
  if (item.type !== 'text') return false;
  
  return item.content.includes('考察示例');
}

// 提取循环结构组
function extractCycleGroup(items, startIndex) {
  const cycleItems = [];
  let currentIndex = startIndex;
  
  // 添加提示
  cycleItems.push(items[currentIndex]);
  currentIndex++;
  
  // 查找题目
  while (currentIndex < items.length) {
    const item = items[currentIndex];
    if (isQuestion(item.content)) {
      cycleItems.push(item);
      currentIndex++;
      break;
    } else if (isCycleStart(item) || isExamExampleTitle(item)) {
      // 遇到下一个循环开始或考察示例标题，结束当前循环
      break;
    } else {
      currentIndex++;
    }
  }
  
  // 查找答案
  while (currentIndex < items.length) {
    const item = items[currentIndex];
    if (item.type === 'text' && (item.content.includes('答案：') || item.content.includes('解析：'))) {
      cycleItems.push(item);
      currentIndex++;
      break;
    } else if (isCycleStart(item) || isExamExampleTitle(item)) {
      // 遇到下一个循环开始或考察示例标题，结束当前循环
      break;
    } else {
      currentIndex++;
    }
  }
  
  // 检查是否形成了完整的循环结构
  if (cycleItems.length >= 3) {
    return {
      type: 'cycle-group',
      items: cycleItems,
      endIndex: currentIndex - 1
    };
  }
  
  // 如果只有提示和题目，也认为是有效的循环结构
  if (cycleItems.length >= 2) {
    return {
      type: 'cycle-group',
      items: cycleItems,
      endIndex: currentIndex - 1
    };
  }
  
  return null;
}

// 提取连续的循环结构组
function extractConsecutiveCycleGroups(items, startIndex) {
  const groups = [];
  let currentIndex = startIndex;
  
  while (currentIndex < items.length) {
    const item = items[currentIndex];
    
    // 检查是否是循环开始
    if (isCycleStart(item)) {
      const cycleGroup = extractCycleGroup(items, currentIndex);
      if (cycleGroup) {
        groups.push(cycleGroup);
        currentIndex = cycleGroup.endIndex + 1;
      } else {
        currentIndex++;
      }
    } else {
      break;
    }
  }
  
  // 如果有多个连续的循环组，返回组合结构
  if (groups.length > 1) {
    return {
      type: 'consecutive-cycle-groups',
      groups: groups,
      endIndex: currentIndex - 1
    };
  } else if (groups.length === 1) {
    return groups[0];
  }
  
  return null;
}

// 改进的循环结构识别：处理提示+例子的简单结构
function extractSimpleCycleGroup(items, startIndex) {
  const cycleItems = [];
  let currentIndex = startIndex;
  
  // 添加提示
  cycleItems.push(items[currentIndex]);
  currentIndex++;
  
  // 查找例子
  while (currentIndex < items.length) {
    const item = items[currentIndex];
    if (isRelatedExample(item, items[startIndex].content)) {
      cycleItems.push(item);
      currentIndex++;
    } else if (isCycleStart(item) || isExamExampleTitle(item)) {
      // 遇到下一个循环开始或考察示例标题，结束当前循环
      break;
    } else {
      break;
    }
  }
  
  // 如果形成了提示+例子的结构
  if (cycleItems.length >= 2) {
    return {
      type: 'cycle-group',
      items: cycleItems,
      endIndex: currentIndex - 1
    };
  }
  
  return null;
}

// 测试解析
console.log('测试考察示例标题识别功能:');
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
      if (item.type === 'table') {
        console.log(`  - 项目${itemIndex + 1}: ${item.type} - ${item.data.headers.length}列, ${item.data.rows.length}行`);
      } else if (item.type === 'rule-with-examples') {
        console.log(`  - 项目${itemIndex + 1}: ${item.type} - 规则+${item.examples.length}个例子`);
      } else if (item.type === 'consecutive-cycle-groups') {
        console.log(`  - 项目${itemIndex + 1}: ${item.type} - ${item.groups.length}个连续循环组`);
        item.groups.forEach((group, groupIndex) => {
          console.log(`    - 循环组${groupIndex + 1}: ${group.items.length}个元素`);
        });
      } else if (item.type === 'cycle-group') {
        console.log(`  - 项目${itemIndex + 1}: ${item.type} - ${item.items.length}个元素`);
      } else if (item.content && item.content.includes('考察示例')) {
        console.log(`  - 项目${itemIndex + 1}: 考察示例标题 - ${item.content}`);
      } else {
        console.log(`  - 项目${itemIndex + 1}: ${item.type} - ${item.content ? item.content.substring(0, 50) : 'N/A'}...`);
      }
    });
  });
} 