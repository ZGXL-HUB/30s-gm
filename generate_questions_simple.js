/**
 * 简化版题目生成脚本 - 直接生成JSON文件
 * 不依赖外部模块，可直接运行
 */

const fs = require('fs');

// 所有35个三级知识点及其题目
const allQuestions = [];

// 定义所有知识点及其题目模板
const questionData = [
  // 词法部分
  { path: '1.1.1', name: '名词所有格', category: '名词', examFrequency: '⭐⭐', examYears: [2024] },
  { path: '1.1.2', name: '名词的复数', category: '名词', examFrequency: '⭐⭐', examYears: [2023, 2025] },
  { path: '1.2.1', name: '人称代词', category: '代词', examFrequency: '⭐⭐', examYears: [2025] },
  { path: '1.2.2', name: '物主代词', category: '代词', examFrequency: '⭐⭐⭐', examYears: [2023, 2025] },
  { path: '1.2.3', name: '反身代词', category: '代词', examFrequency: '⭐⭐', examYears: [2024] },
  { path: '1.2.4', name: '不定代词', category: '代词', examFrequency: '⭐', examYears: [] },
  { path: '1.3.1', name: '形容词作定语', category: '形容词与副词', examFrequency: '⭐⭐', examYears: [2023, 2025] },
  { path: '1.3.2', name: '副词的基本用法', category: '形容词与副词', examFrequency: '⭐⭐', examYears: [2023, 2025] },
  { path: '1.3.3', name: '比较级和最高级', category: '形容词与副词', examFrequency: '⭐⭐', examYears: [2023, 2025] },
  { path: '1.4.1', name: '动词的形式', category: '动词', examFrequency: '⭐', examYears: [] },
  { path: '1.4.2', name: '情态动词', category: '动词', examFrequency: '⭐⭐⭐⭐', examYears: [2025] },
  { path: '1.4.3', name: '非谓语动词', category: '动词', examFrequency: '⭐⭐⭐⭐⭐', examYears: [2023, 2024] },
  { path: '1.5.1', name: '时间介词', category: '介词', examFrequency: '⭐⭐', examYears: [2023, 2024] },
  { path: '1.5.2', name: '地点介词', category: '介词', examFrequency: '⭐⭐', examYears: [2025] },
  { path: '1.5.3', name: '其他介词', category: '介词', examFrequency: '⭐⭐', examYears: [2025] },
  { path: '1.6.1', name: '不定冠词', category: '冠词', examFrequency: '⭐⭐', examYears: [2024] },
  { path: '1.6.2', name: '定冠词', category: '冠词', examFrequency: '⭐', examYears: [] },
  { path: '1.6.3', name: '零冠词', category: '冠词', examFrequency: '⭐', examYears: [] },
  { path: '1.7.1', name: '基数词与序数词', category: '数词', examFrequency: '⭐⭐', examYears: [2025] },
  { path: '1.7.2', name: '数词的应用', category: '数词', examFrequency: '⭐⭐', examYears: [2023] },
  { path: '1.8.1', name: '并列连词', category: '连词', examFrequency: '⭐⭐', examYears: [2023, 2025] },
  { path: '1.8.2', name: '从属连词', category: '连词', examFrequency: '⭐', examYears: [] },
  
  // 句法部分
  { path: '2.1.1', name: '主谓宾结构', category: '句子成分与基本句型', examFrequency: '⭐', examYears: [] },
  { path: '2.1.2', name: '主系表结构', category: '句子成分与基本句型', examFrequency: '⭐', examYears: [] },
  { path: '2.2.1', name: '一般现在时', category: '动词时态', examFrequency: '⭐⭐', examYears: [2023] },
  { path: '2.2.2', name: '一般过去时', category: '动词时态', examFrequency: '⭐', examYears: [] },
  { path: '2.2.3', name: '一般将来时', category: '动词时态', examFrequency: '⭐', examYears: [] },
  { path: '2.2.4', name: '现在进行时', category: '动词时态', examFrequency: '⭐', examYears: [] },
  { path: '2.2.5', name: '过去进行时', category: '动词时态', examFrequency: '⭐⭐', examYears: [2024] },
  { path: '2.2.6', name: '现在完成时', category: '动词时态', examFrequency: '⭐⭐⭐⭐', examYears: [2023, 2025] },
  { path: '2.2.7', name: '过去完成时', category: '动词时态', examFrequency: '⭐', examYears: [] },
  { path: '2.3.1', name: '一般时态的被动语态', category: '被动语态', examFrequency: '⭐⭐⭐⭐', examYears: [2023, 2024, 2025] },
  { path: '2.3.2', name: '完成时态的被动语态', category: '被动语态', examFrequency: '⭐', examYears: [] },
  { path: '2.4.1', name: '语法一致原则', category: '主谓一致', examFrequency: '⭐', examYears: [] },
  { path: '2.4.2', name: '意义一致原则', category: '主谓一致', examFrequency: '⭐', examYears: [] },
  { path: '2.4.3', name: '就近原则', category: '主谓一致', examFrequency: '⭐⭐', examYears: [2024] },
  { path: '2.5.1', name: '宾语从句', category: '复合句', examFrequency: '⭐⭐⭐⭐', examYears: [2023, 2024, 2025] },
  { path: '2.5.2', name: '定语从句', category: '复合句', examFrequency: '⭐⭐⭐⭐', examYears: [2024, 2025] },
  { path: '2.5.3', name: '状语从句', category: '复合句', examFrequency: '⭐⭐', examYears: [2023, 2025] },
  { path: '2.6.1', name: 'There be 句型', category: '特殊句式', examFrequency: '⭐', examYears: [] },
  { path: '2.6.2', name: '感叹句', category: '特殊句式', examFrequency: '⭐⭐', examYears: [2024, 2025] },
  { path: '2.6.3', name: '祈使句', category: '特殊句式', examFrequency: '⭐', examYears: [] },
  { path: '2.6.4', name: '倒装句', category: '特殊句式', examFrequency: '⭐', examYears: [] }
];

// 为每个知识点生成题目
questionData.forEach((point, index) => {
  const baseId = `middle_${point.path.replace(/\./g, '_')}`;
  const timestamp = Date.now();
  
  // 生成2个选择题
  for (let i = 1; i <= 2; i++) {
    const question = {
      _id: `${baseId}_choice_${i}_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      text: `[${point.name}]选择题${i}：请选择正确答案。`,
      answer: i === 1 ? 'A' : 'B',
      grammarPoint: point.name,
      category: point.category,
      type: 'choice',
      options: [
        'A. 选项A（正确答案）',
        'B. 选项B',
        'C. 选项C',
        'D. 选项D'
      ],
      analysis: `本题考查${point.name}的用法。这是第${i}道选择题的解析。`,
      difficulty: 'medium',
      province: '云南',
      year: 2025,
      source: '题库',
      schoolLevel: 'middle',
      examFrequency: point.examFrequency,
      examYears: point.examYears
    };
    allQuestions.push(question);
  }
  
  // 生成1个填空题
  const fillQuestion = {
    _id: `${baseId}_fill_1_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
    text: `[${point.name}]填空题：请用括号内单词的正确形式填空。`,
    answer: '正确答案',
    grammarPoint: point.name,
    category: point.category,
    type: 'fill_blank',
    analysis: `本题考查${point.name}的用法。这是填空题的解析。`,
    difficulty: 'medium',
    province: '云南',
    year: 2025,
    source: '题库',
    schoolLevel: 'middle',
    examFrequency: point.examFrequency,
    examYears: point.examYears
  };
  allQuestions.push(fillQuestion);
});

// 保存到文件
const outputFile = 'middle_school_questions.json';
fs.writeFileSync(outputFile, JSON.stringify(allQuestions, null, 2), 'utf8');

console.log(`✅ 共生成 ${allQuestions.length} 道题目`);
console.log(`   选择题: ${allQuestions.filter(q => q.type === 'choice').length} 道`);
console.log(`   填空题: ${allQuestions.filter(q => q.type === 'fill_blank').length} 道`);
console.log(`📄 文件已保存: ${outputFile}`);
console.log(`\n⚠️  注意：这是模板文件，需要根据实际题目内容替换文本。`);




