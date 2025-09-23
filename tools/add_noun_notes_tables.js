const fs = require('fs');

// 加载前端数据
const questionsData = require('./miniprogram/data/intermediate_questions.js');

console.log('=== 为名词题目添加笔记和表格关联 ===\n');

// 名词题目与笔记和表格的映射关系
const nounMappings = {
  // 名词概述相关题目
  'noun-overview': {
    relatedNotes: ['noun_note_001'],
    relatedTables: ['noun_table_001']
  },
  // 名词复数规则相关题目
  'noun-plural-rules': {
    relatedNotes: ['noun_note_002'],
    relatedTables: ['noun_table_002']
  },
  // 以o结尾名词相关题目
  'noun-o-ending': {
    relatedNotes: ['noun_note_003'],
    relatedTables: ['noun_table_003']
  },
  // 以y结尾名词相关题目
  'noun-y-ending': {
    relatedNotes: ['noun_note_004'],
    relatedTables: ['noun_table_004']
  },
  // 以s/sh/ch/x结尾名词相关题目
  'noun-s-sh-ch-x-ending': {
    relatedNotes: ['noun_note_005'],
    relatedTables: ['noun_table_005']
  },
  // 以f/fe结尾名词相关题目
  'noun-f-fe-ending': {
    relatedNotes: ['noun_note_006'],
    relatedTables: ['noun_table_006']
  }
};

// 处理所有题目
let modifiedCount = 0;
const questionKeys = Object.keys(questionsData).filter(key => 
  key.includes('_question_') && 
  questionsData[key].category === '名词'
);

console.log(`找到 ${questionKeys.length} 个名词相关题目`);

questionKeys.forEach(key => {
  const question = questionsData[key];
  if (question && question.category === '名词') {
    // 根据题目内容判断属于哪个子类别
    let questionType = null;
    
    // 检查题目内容来确定类型
    const content = question.question || '';
    const answer = question.answer || '';
    
    if (content.includes('German') || content.includes('名词') || content.includes('分类')) {
      questionType = 'noun-overview';
    } else if (content.includes('strawberry') || content.includes('复数') || content.includes('cities')) {
      questionType = 'noun-plural-rules';
    } else if (content.includes('potato') || content.includes('tomato') || content.includes('photo')) {
      questionType = 'noun-o-ending';
    } else if (content.includes('city') || content.includes('baby') || content.includes('boy')) {
      questionType = 'noun-y-ending';
    } else if (content.includes('bus') || content.includes('box') || content.includes('brush')) {
      questionType = 'noun-s-sh-ch-x-ending';
    } else if (content.includes('leaf') || content.includes('knife') || content.includes('wife')) {
      questionType = 'noun-f-fe-ending';
    }
    
    if (questionType && nounMappings[questionType]) {
      const mapping = nounMappings[questionType];
      
      // 检查是否已经有相关字段
      if (!question.relatedNotes && !question.relatedTables) {
        question.relatedNotes = mapping.relatedNotes;
        question.relatedTables = mapping.relatedTables;
        
        console.log(`🔧 为 ${key} 添加关联:`);
        console.log(`   笔记: ${mapping.relatedNotes.join(', ')}`);
        console.log(`   表格: ${mapping.relatedTables.join(', ')}`);
        
        modifiedCount++;
      } else {
        console.log(`⚠️  ${key} 已有关联字段，跳过`);
      }
    } else {
      console.log(`❓ ${key} 无法确定类型，跳过`);
    }
  }
});

if (modifiedCount > 0) {
  // 保存修改后的数据
  const outputPath = './miniprogram/data/intermediate_questions_with_noun_notes.js';
  const outputContent = `module.exports = ${JSON.stringify(questionsData, null, 2)};`;
  
  fs.writeFileSync(outputPath, outputContent, 'utf8');
  console.log(`\n✅ 成功为 ${modifiedCount} 个名词题目添加笔记和表格关联`);
  console.log(`📁 已保存到: ${outputPath}`);
  
  // 直接替换原文件
  fs.copyFileSync(outputPath, './miniprogram/data/intermediate_questions.js');
  console.log('✅ 已更新 intermediate_questions.js 文件');
} else {
  console.log('✅ 所有名词题目已有关联，无需修改');
}

console.log('\n=== 关联添加完成 ==='); 