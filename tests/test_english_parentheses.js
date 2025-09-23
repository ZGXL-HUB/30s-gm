// 测试英文括号的分类映射
const fs = require('fs');

// 分类映射表(修复后，包含英文括号)
const categoryMapping = {
  // 介词相关分类
  "介词(1)": "介词", "介词(2)": "介词", "介词(3)": "介词",
  "介词(1)": "介词", "介词(2)": "介词", "介词(3)": "介词",
  "介词综合": "介词", "介词 + 名词/动名词": "介词",
  // 代词相关分类
  "代词(1)": "代词", "代词(2)": "代词", "代词(3)": "代词", 
  "代词(4)": "代词", "代词(5)": "代词", "代词(6)": "代词",
  "代词(1)": "代词", "代词(2)": "代词", "代词(3)": "代词", 
  "代词(4)": "代词", "代词(5)": "代词", "代词(6)": "代词",
  "代词综合": "代词", "人称代词": "代词", "物主代词": "代词",
  // 连词相关分类
  "连词(1)": "连词", "连词(2)": "连词", "连词(3)": "连词",
  "连词(4)": "连词", "连词(5)": "连词", "连词(6)": "连词",
  "连词(1)": "连词", "连词(2)": "连词", "连词(3)": "连词",
  "连词(4)": "连词", "连词(5)": "连词", "连词(6)": "连词",
  "连词与名词": "连词", "连词与动词": "连词", "连词与形容词": "连词",
  "连词与名/动/形/副综合": "连词", "并列连词综合": "连词", "从属连词综合": "连词",
  // 冠词相关分类
  "冠词(1)": "冠词", "冠词(2)": "冠词", "冠词(3)": "冠词", "冠词(4)": "冠词",
  "冠词(1)": "冠词", "冠词(2)": "冠词", "冠词(3)": "冠词", "冠词(4)": "冠词",
  // 名词相关分类
  "名词(1)": "名词", "名词(2)": "名词", "名词(3)": "名词", "名词(4)": "名词", "名词(5)": "名词", "名词(6)": "名词", 
  "名词(1)": "名词", "名词(2)": "名词", "名词(3)": "名词", "名词(4)": "名词", "名词(5)": "名词", "名词(6)": "名词",
  // 动词相关分类
  "动词(1)": "动词", "动词(2)": "动词", "动词(3)": "动词", 
  "动词(4)": "动词", "动词(5)": "动词",
  "动词(1)": "动词", "动词(2)": "动词", "动词(3)": "动词", 
  "动词(4)": "动词", "动词(5)": "动词",
  // 谓语相关分类
  "谓语(1)": "谓语", "谓语(2)": "谓语", "谓语(3)": "谓语", 
  "谓语(4)": "谓语", "谓语(5)": "谓语", "谓语(6)": "谓语", "谓语(7)": "谓语",
  "谓语(8)": "谓语", "谓语(9)": "谓语",
  "谓语(1)": "谓语", "谓语(2)": "谓语", "谓语(3)": "谓语", 
  "谓语(4)": "谓语", "谓语(5)": "谓语", "谓语(6)": "谓语", "谓语(7)": "谓语",
  "谓语(8)": "谓语", "谓语(9)": "谓语",
  "谓语(1)": "谓语", "谓语(2)": "谓语", "谓语(3)": "谓语", 
  "谓语(4)": "谓语", "谓语(5)": "谓语", "谓语(6)": "谓语", "谓语(7)": "谓语",
  // 非谓语相关分类
  "非谓语(1)": "非谓语", "非谓语(2)": "非谓语", "非谓语(3)": "非谓语", "非谓语(4)": "非谓语",
  "非谓语(1)": "非谓语", "非谓语(2)": "非谓语", "非谓语(3)": "非谓语", "非谓语(4)": "非谓语",
  // 形容词相关分类
  "形容词(1)": "形容词", "形容词(2)": "形容词", "形容词(3)": "形容词",
  "形容词(1)": "形容词", "形容词(2)": "形容词", "形容词(3)": "形容词",
  // 副词相关分类
  "副词(1)": "副词", "副词(2)": "副词", "副词(3)": "副词", "副词(4)": "副词",
  "副词(1)": "副词", "副词(2)": "副词", "副词(3)": "副词", "副词(4)": "副词",
  // 定语从句相关分类
  "定语从句(1)": "定语从句", "定语从句(2)": "定语从句", "定语从句(3)": "定语从句",
  "定语从句(4)": "定语从句", "定语从句(5)": "定语从句",
  "定语从句(1)": "定语从句", "定语从句(2)": "定语从句", "定语从句(3)": "定语从句",
  "定语从句(4)": "定语从句", "定语从句(5)": "定语从句",
  // 状语从句相关分类
  "状语和从句(1)": "状语从句", "状语和从句(2)": "状语从句", "状语和从句(3)": "状语从句",
  "状语和从句(4)": "状语从句", "状语和从句(5)": "状语从句",
  "状语和从句(1)": "状语从句", "状语和从句(2)": "状语从句", "状语和从句(3)": "状语从句",
  "状语和从句(4)": "状语从句", "状语和从句(5)": "状语从句",
  // 固定搭配相关分类
  "固定搭配": "综合练习",
  // 综合练习相关分类
  "综合练习": "综合练习"
};

// 模拟错题数据 - 包含英文括号的分类
const mockMistakes = [
  {
    id: '1',
    question: 'The man was seen ___ (enter) the building last night.',
    correctAnswer: 'to enter',
    analysis: 'see sb. do sth.在被动语态中要还原为 be seen to do sth.,意为"被看见做某事",故',
    tag: '非谓语 (4)', // 英文括号格式
    category: '非谓语 (4)', // 英文括号格式
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    question: 'He has many ____ (hobby), such as painting and singing.',
    correctAnswer: 'hobbies',
    analysis: '该句中需填入名词"hobby"的复数形式"hobbies"。',
    tag: '名词(1)', // 英文括号格式
    category: '名词(1)', // 英文括号格式
    timestamp: new Date().toISOString()
  },
  {
    id: '3',
    question: 'I like reading books ____ (about) science.',
    correctAnswer: 'about',
    analysis: '该句中需填入介词"about"。',
    tag: '介词综合', // 无括号格式
    category: '介词综合', // 无括号格式
    timestamp: new Date().toISOString()
  },
  {
    id: '4',
    question: 'He is fond ___ reading books in his free time.',
    correctAnswer: 'of',
    analysis: '"be fond of"为固定短语,意为"喜欢……；爱好……"。',
    tag: '固定搭配', // 无括号格式
    category: '固定搭配', // 无括号格式
    timestamp: new Date().toISOString()
  },
  {
    id: '5',
    question: 'Give ____ (we) some advice on how to learn English well.',
    correctAnswer: 'us',
    analysis: '动词give后需要宾格代词作间接宾语。we的宾格为us。',
    tag: '人称代词', // 无括号格式
    category: '人称代词', // 无括号格式
    timestamp: new Date().toISOString()
  }
];

// 模拟加载错题的逻辑
function loadMistakes() {
  const mistakes = mockMistakes;
  
  // 清理和修复错误数据，并为每个错题添加 showAnswer 属性和映射分类
  const mistakesWithShowAnswer = mistakes.map(m => {
    let questionText = '';
    
    // 修复question字段
    if (typeof m.question === 'string') {
      questionText = m.question;
    } else if (typeof m.question === 'object' && m.question) {
      questionText = m.question.question || m.question.text || '题目解析中...';
    } else {
      questionText = '未知题目';
    }
    
    // 优先使用tag进行映射，如果没有tag则使用category
    const originalCategory = m.tag || m.category || '其他';
    const mappedCategory = categoryMapping[originalCategory] || originalCategory;
    
    return {
      ...m,
      question: questionText,
      showAnswer: false,
      mappedCategory: mappedCategory
    };
  });
  
  return mistakesWithShowAnswer;
}

// 模拟计算统计数据的逻辑
function calculateStats(mistakes) {
  const stats = {};
  mistakes.forEach(m => {
    // 优先使用已映射的分类，如果没有则进行映射
    const mappedCategory = m.mappedCategory || categoryMapping[m.category] || m.category || '其他';
    stats[mappedCategory] = (stats[mappedCategory] || 0) + 1;
  });
  
  return stats;
}

// 测试
console.log('=== 测试英文括号的分类映射 ===');
const mistakes = loadMistakes();
console.log('加载的错题数据:');
mistakes.forEach((m, index) => {
  console.log(`第${index + 1}题:`, {
    question: m.question.substring(0, 30) + '...',
    tag: m.tag,
    category: m.category,
    mappedCategory: m.mappedCategory
  });
});

const stats = calculateStats(mistakes);
console.log('\n分类统计结果:');
Object.entries(stats).forEach(([category, count]) => {
  console.log(`${category}: ${count}题`);
});

console.log('\n=== 测试完成 ==='); 