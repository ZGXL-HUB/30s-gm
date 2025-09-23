const fs = require('fs');

// 读取文件
const miniprogramPath = 'miniprogram/data/intermediate_questions.js';
const cloudfunctionsPath = 'cloudfunctions/initializeQuestions/questions.js';

// 为每个谓语分类添加关联的笔记和表格
const predicateMappings = {
  "谓语(1)": {
    relatedNotes: ["tense_note_001"],
    relatedTables: ["tense_table_001"]
  },
  "谓语(2)": {
    relatedNotes: ["tense_note_002"],
    relatedTables: ["tense_table_002"]
  },
  "谓语(3)": {
    relatedNotes: ["tense_note_003"],
    relatedTables: ["tense_table_003"]
  },
  "谓语(4)": {
    relatedNotes: ["tense_note_004"],
    relatedTables: ["tense_table_004"]
  },
  "谓语(5)": {
    relatedNotes: ["tense_note_005"],
    relatedTables: ["tense_table_005"]
  },
  "谓语(6)": {
    relatedNotes: ["tense_note_006"],
    relatedTables: ["tense_table_006"]
  },
  "谓语(7)": {
    relatedNotes: ["tense_note_007"],
    relatedTables: ["tense_table_007"]
  },
  "谓语(8)": {
    relatedNotes: ["tense_note_008"],
    relatedTables: ["tense_table_008"]
  },
  "谓语(9)": {
    relatedNotes: ["voice_note_001"],
    relatedTables: ["voice_table_001"]
  }
};

// 为指定文件添加关联关系
function addPredicateMappings(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`文件不存在: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 为每个题目添加关联的笔记和表格
  Object.keys(predicateMappings).forEach(category => {
    const mapping = predicateMappings[category];
    
    // 查找该分类下的所有题目
    const categoryPattern = new RegExp(`"category": "${category}"`, 'g');
    let match;
    
    while ((match = categoryPattern.exec(content)) !== null) {
      const startIndex = match.index;
      
      // 向前查找题目对象的开始位置
      let objectStart = startIndex;
      while (objectStart > 0 && content[objectStart] !== '{') {
        objectStart--;
      }
      
      // 向后查找题目对象的结束位置
      let braceCount = 0;
      let objectEnd = startIndex;
      let foundStart = false;
      
      for (let i = objectStart; i < content.length; i++) {
        if (content[i] === '{') {
          braceCount++;
          foundStart = true;
        } else if (content[i] === '}') {
          braceCount--;
          if (foundStart && braceCount === 0) {
            objectEnd = i;
            break;
          }
        }
      }
      
      if (objectEnd > startIndex) {
        // 检查是否已经添加过关联关系
        const objectContent = content.substring(objectStart, objectEnd);
        if (!objectContent.includes('"relatedNotes"')) {
          // 在题目对象中添加关联的笔记和表格
          const insertIndex = objectEnd;
          const insertContent = `,\n      "relatedNotes": ${JSON.stringify(mapping.relatedNotes)},\n      "relatedTables": ${JSON.stringify(mapping.relatedTables)}`;
          
          content = content.substring(0, insertIndex) + insertContent + content.substring(insertIndex);
          
          // 更新正则表达式的位置，因为内容长度发生了变化
          categoryPattern.lastIndex = insertIndex + insertContent.length;
        }
      }
    }
  });
  
  // 写回文件
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`已为 ${filePath} 添加谓语关联关系！`);
}

// 处理两个文件
addPredicateMappings(miniprogramPath);
addPredicateMappings(cloudfunctionsPath);

console.log('所有文件处理完成！'); 