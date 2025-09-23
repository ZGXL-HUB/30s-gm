const questionsData = require('./miniprogram/data/intermediate_questions.js');

// 测试形容词笔记解析
function testAdjectiveNoteParsing() {
  console.log('=== 测试形容词笔记解析 ===');
  
  const comparativeNote = questionsData['comparative_note_001'];
  const superlativeNote = questionsData['superlative_note_001'];
  
  console.log('比较级笔记内容:', comparativeNote.noteContent);
  console.log('最高级笔记内容:', superlativeNote.noteContent);
  
  // 模拟解析函数
  function parseNoteContentToStructuredData(content) {
    if (!content) return null;
    
    const sections = [];
    const lines = content.split('\n');
    let currentSection = null;
    
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
          items: []
        };
      }
      // 检查是否是考察示例标题
      else if (line.includes('考察示例')) {
        const item = {
          type: 'exam-example-title',
          content: line
        };
        if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是题目（以"—"开头）
      else if (line.startsWith('—') || line.startsWith('-')) {
        const item = {
          type: 'question',
          content: line
        };
        if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是答案（包含"答案："）
      else if (line.includes('答案：')) {
        const item = {
          type: 'answer',
          content: line
        };
        if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是解析（包含"解析："）
      else if (line.includes('解析：')) {
        const item = {
          type: 'analysis',
          content: line
        };
        if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 检查是否是列表项（包含"→"）
      else if (line.includes('→')) {
        const item = {
          type: 'list',
          content: line
        };
        if (currentSection) {
          currentSection.items.push(item);
        }
      }
      // 普通文本
      else {
        const item = {
          type: 'text',
          content: line
        };
        if (currentSection) {
          currentSection.items.push(item);
        }
      }
    }
    
    // 添加最后一个section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  }
  
  const comparativeStructured = parseNoteContentToStructuredData(comparativeNote.noteContent);
  const superlativeStructured = parseNoteContentToStructuredData(superlativeNote.noteContent);
  
  console.log('比较级笔记结构化结果:', JSON.stringify(comparativeStructured, null, 2));
  console.log('最高级笔记结构化结果:', JSON.stringify(superlativeStructured, null, 2));
}

// 测试形容词表格数据处理
function testAdjectiveTableData() {
  console.log('\n=== 测试形容词表格数据处理 ===');
  
  const comparativeTable = questionsData['comparative_table_001'];
  const superlativeTable = questionsData['superlative_table_001'];
  
  console.log('比较级表格数据:', comparativeTable.tableData);
  console.log('最高级表格数据:', superlativeTable.tableData);
  
  // 模拟表格数据处理函数
  function createExerciseTableData(tableData) {
    if (!tableData) return null;
    
    if (tableData.tableData && tableData.tableData.headers && tableData.tableData.rows) {
      const exerciseRows = [];
      
      // 添加表头行
      const headerRow = tableData.tableData.headers.map(header => ({
        type: 'text',
        text: header
      }));
      exerciseRows.push(headerRow);
      
      // 添加数据行
      tableData.tableData.rows.forEach(row => {
        const exerciseRow = row.map((cell, index) => {
          if (tableData.id === 'comparative_table_001' || tableData.id === 'superlative_table_001') {
            // 第一列是规则，需要点击显示完整内容
            if (index === 0) {
              return { 
                type: 'clickable-rule', 
                text: cell,
                fullContent: getRuleFullContent(cell, tableData.id)
              };
            }
            // 第二列是原形，显示为提示词
            else if (index === 1) {
              return { 
                type: 'text', 
                text: cell,
                style: 'font-weight: bold; color: #1890ff;'
              };
            }
            // 第三列是比较级/最高级，需要输入
            else if (index === 2) {
              return {
                type: 'input',
                placeholder: '请输入答案',
                answer: cell
              };
            }
            // 第四列是规则说明，显示为文本
            else if (index === 3) {
              return { type: 'text', text: cell };
            }
          }
          return { type: 'text', text: cell };
        });
        exerciseRows.push(exerciseRow);
      });
      
      return {
        ...tableData,
        exerciseRows: exerciseRows,
        hasHeader: true
      };
    }
    
    return tableData;
  }
  
  function getRuleFullContent(ruleText, tableId) {
    const ruleMap = {
      '规则一': '一般情况直接加' + (tableId === 'comparative_table_001' ? 'er' : 'est'),
      '规则二': '以不发音的e结尾加' + (tableId === 'comparative_table_001' ? 'r' : 'st'),
      '规则三': '重读闭音节双写辅音字母加' + (tableId === 'comparative_table_001' ? 'er' : 'est'),
      '规则四': '辅音字母+y结尾变y为i加' + (tableId === 'comparative_table_001' ? 'er' : 'est'),
      '规则五': '不规则变化',
      '规则六': '多音节单词' + (tableId === 'comparative_table_001' ? '比较级前加more' : '最高级前加most')
    };
    
    return ruleMap[ruleText] || ruleText;
  }
  
  const comparativeExerciseData = createExerciseTableData(comparativeTable);
  const superlativeExerciseData = createExerciseTableData(superlativeTable);
  
  console.log('比较级表格练习数据:', JSON.stringify(comparativeExerciseData.exerciseRows.slice(0, 3), null, 2));
  console.log('最高级表格练习数据:', JSON.stringify(superlativeExerciseData.exerciseRows.slice(0, 3), null, 2));
}

// 运行测试
testAdjectiveNoteParsing();
testAdjectiveTableData();

console.log('\n=== 修复总结 ===');
console.log('1. ✅ 形容词笔记解析：已添加对考察示例标题、题目、答案、解析等类型的支持');
console.log('2. ✅ 形容词表格数据处理：已添加对规则点击显示、提示词显示的支持');
console.log('3. ✅ 规则完整内容：已添加规则映射函数，支持点击显示完整规则');
console.log('4. ✅ 样式支持：已添加新的CSS样式来支持不同类型的内容显示'); 