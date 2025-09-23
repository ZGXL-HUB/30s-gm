const fs = require('fs');
const path = require('path');

// 读取原始题库
const originalQuestionsPath = path.join(__dirname, 'miniprogram/data/intermediate_questions.js');
const originalContent = fs.readFileSync(originalQuestionsPath, 'utf8');

// 使用正则表达式提取题目数据
function extractQuestionsFromContent(content) {
  const questions = {};
  
  // 匹配每个分类的题目
  const categoryMatches = content.match(/"([^"]+)":\s*\[([\s\S]*?)\]/g);
  
  if (categoryMatches) {
    categoryMatches.forEach(match => {
      // 提取分类名
      const categoryNameMatch = match.match(/"([^"]+)":\s*\[/);
      if (!categoryNameMatch) return;
      
      const categoryName = categoryNameMatch[1];
      
      // 提取题目数组内容
      const arrayContentMatch = match.match(/\[([\s\S]*)\]/);
      if (!arrayContentMatch) return;
      
      const arrayContent = arrayContentMatch[1];
      
      // 解析题目对象
      const questionObjects = [];
      const questionMatches = arrayContent.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
      
      if (questionMatches) {
        questionMatches.forEach(questionMatch => {
          try {
            // 提取题目文本
            const textMatch = questionMatch.match(/"text":\s*"([^"]+)"/);
            const answerMatch = questionMatch.match(/"answer":\s*"([^"]+)"/);
            const analysisMatch = questionMatch.match(/"analysis":\s*"([^"]+)"/);
            
            if (textMatch && answerMatch) {
              questionObjects.push({
                text: textMatch[1],
                answer: answerMatch[1],
                analysis: analysisMatch ? analysisMatch[1] : '',
                category: categoryName
              });
            }
          } catch (error) {
            console.log('解析题目时出错:', error);
          }
        });
      }
      
      if (questionObjects.length > 0) {
        questions[categoryName] = questionObjects;
      }
    });
  }
  
  return questions;
}

// 改进的干扰项生成函数
function generateImprovedDistractors(correctAnswer, questionText, category) {
  const distractors = [];
  
  // 根据答案类型和语法点生成不同的干扰项
  if (typeof correctAnswer === 'string') {
    const answer = correctAnswer.trim().toLowerCase();
    
    // 介词类干扰项
    if (category.includes('介词') || category.includes('preposition')) {
      const prepositionDistractors = {
        'to': ['for', 'at', 'in', 'by'],
        'of': ['for', 'with', 'by', 'from'],
        'in': ['at', 'on', 'by', 'within'],
        'at': ['in', 'on', 'to', 'by'],
        'on': ['in', 'at', 'by', 'upon'],
        'for': ['to', 'of', 'with', 'by'],
        'with': ['by', 'for', 'of', 'to'],
        'by': ['with', 'for', 'in', 'at'],
        'from': ['of', 'by', 'with', 'to'],
        'about': ['of', 'for', 'to', 'concerning'],
        'against': ['for', 'with', 'to', 'opposite'],
        'among': ['between', 'in', 'with', 'amidst'],
        'between': ['among', 'in', 'with', 'amidst'],
        'through': ['by', 'with', 'via', 'across'],
        'without': ['with', 'by', 'through', 'via'],
        'within': ['in', 'inside', 'during', 'throughout'],
        'during': ['in', 'within', 'throughout', 'while'],
        'since': ['for', 'from', 'after', 'before'],
        'until': ['till', 'before', 'after', 'since'],
        'before': ['after', 'until', 'since', 'during']
      };
      
      if (prepositionDistractors[answer]) {
        distractors.push(...prepositionDistractors[answer].slice(0, 3));
      }
    }
    
    // 代词类干扰项
    else if (category.includes('代词') || category.includes('pronoun')) {
      const pronounDistractors = {
        'us': ['we', 'our', 'ours', 'ourselves'],
        'me': ['I', 'my', 'mine', 'myself'],
        'him': ['he', 'his', 'himself', 'he\'s'],
        'her': ['she', 'hers', 'herself', 'she\'s'],
        'them': ['they', 'their', 'theirs', 'themselves'],
        'it': ['its', 'this', 'that', 'itself'],
        'myself': ['me', 'I', 'my', 'mine'],
        'yourself': ['you', 'your', 'yours', 'yourselves'],
        'himself': ['he', 'his', 'him', 'he\'s'],
        'herself': ['she', 'her', 'hers', 'she\'s'],
        'itself': ['it', 'its', 'this', 'that'],
        'ourselves': ['we', 'our', 'us', 'ours'],
        'yourselves': ['you', 'your', 'yours', 'yourself'],
        'themselves': ['they', 'their', 'them', 'theirs'],
        'who': ['which', 'that', 'whom', 'whose'],
        'which': ['what', 'that', 'who', 'whom'],
        'that': ['which', 'what', 'who', 'whom'],
        'whose': ['who', 'which', 'that', 'whom'],
        'whom': ['who', 'which', 'that', 'whose']
      };
      
      if (pronounDistractors[answer]) {
        distractors.push(...pronounDistractors[answer].slice(0, 3));
      }
    }
    
    // 冠词类干扰项
    else if (category.includes('冠词') || category.includes('article')) {
      const articleDistractors = {
        'a': ['an', 'the', 'some', 'any'],
        'an': ['a', 'the', 'some', 'any'],
        'the': ['a', 'an', 'this', 'that'],
        'some': ['any', 'a', 'an', 'the'],
        'any': ['some', 'a', 'an', 'the']
      };
      
      if (articleDistractors[answer]) {
        distractors.push(...articleDistractors[answer].slice(0, 3));
      }
    }
    
    // 时态和语态干扰项
    else if (category.includes('时态') || category.includes('语态') || category.includes('tense')) {
      const tenseDistractors = {
        'is': ['are', 'was', 'were', 'be'],
        'are': ['is', 'was', 'were', 'be'],
        'was': ['is', 'are', 'were', 'be'],
        'were': ['is', 'are', 'was', 'be'],
        'am': ['is', 'are', 'was', 'were'],
        'been': ['being', 'be', 'is', 'are'],
        'being': ['been', 'be', 'is', 'are'],
        'have': ['has', 'had', 'having', 'has'],
        'has': ['have', 'had', 'having', 'has'],
        'had': ['have', 'has', 'having', 'has'],
        'will': ['would', 'shall', 'should', 'can'],
        'would': ['will', 'shall', 'should', 'can'],
        'can': ['could', 'will', 'would', 'may'],
        'could': ['can', 'will', 'would', 'may'],
        'may': ['might', 'can', 'could', 'will'],
        'might': ['may', 'can', 'could', 'will']
      };
      
      if (tenseDistractors[answer]) {
        distractors.push(...tenseDistractors[answer].slice(0, 3));
      }
    }
    
    // 形容词和副词干扰项
    else if (category.includes('形容词') || category.includes('副词') || category.includes('adjective') || category.includes('adverb')) {
      const adjAdvDistractors = {
        'good': ['well', 'better', 'best', 'nice'],
        'well': ['good', 'better', 'best', 'fine'],
        'better': ['good', 'well', 'best', 'nicer'],
        'best': ['good', 'well', 'better', 'finest'],
        'bad': ['badly', 'worse', 'worst', 'poor'],
        'worse': ['bad', 'badly', 'worst', 'poorer'],
        'worst': ['bad', 'badly', 'worse', 'poorest'],
        'big': ['large', 'huge', 'enormous', 'great'],
        'small': ['little', 'tiny', 'mini', 'petite'],
        'fast': ['quick', 'rapid', 'swift', 'speedy'],
        'slow': ['sluggish', 'gradual', 'leisurely', 'unhurried'],
        'high': ['tall', 'elevated', 'lofty', 'towering'],
        'low': ['short', 'small', 'diminished', 'reduced'],
        'long': ['extended', 'prolonged', 'lengthy', 'extensive'],
        'short': ['brief', 'concise', 'abbreviated', 'condensed']
      };
      
      if (adjAdvDistractors[answer]) {
        distractors.push(...adjAdvDistractors[answer].slice(0, 3));
      }
    }
    
    // 名词复数形式干扰项
    else if (category.includes('名词') || category.includes('noun')) {
      const nounDistractors = {
        'children': ['child', 'childs', 'childrens', 'childes'],
        'men': ['man', 'mans', 'mens', 'manes'],
        'women': ['woman', 'womans', 'womens', 'womanes'],
        'feet': ['foot', 'foots', 'feets', 'footes'],
        'teeth': ['tooth', 'tooths', 'teeths', 'toothes'],
        'mice': ['mouse', 'mouses', 'mices', 'mousees'],
        'geese': ['goose', 'gooses', 'geeses', 'goosees'],
        'sheep': ['sheeps', 'sheepes', 'sheep', 'sheeple'],
        'deer': ['deers', 'deeres', 'deer', 'deerle'],
        'fish': ['fishes', 'fishs', 'fish', 'fishle'],
        'series': ['serie', 'seriess', 'serieses', 'serie'],
        'species': ['specie', 'speciess', 'specieses', 'specie'],
        'means': ['mean', 'meanss', 'meanses', 'mean'],
        'works': ['work', 'workss', 'workses', 'work'],
        'news': ['new', 'newss', 'newses', 'new']
      };
      
      if (nounDistractors[answer]) {
        distractors.push(...nounDistractors[answer].slice(0, 3));
      }
    }
    
    // 动词形式干扰项
    else if (category.includes('动词') || category.includes('verb')) {
      const verbDistractors = {
        'goes': ['go', 'went', 'gone', 'going'],
        'went': ['go', 'goes', 'gone', 'going'],
        'gone': ['go', 'goes', 'went', 'going'],
        'going': ['go', 'goes', 'went', 'gone'],
        'comes': ['come', 'came', 'coming', 'comed'],
        'came': ['come', 'comes', 'coming', 'comed'],
        'coming': ['come', 'comes', 'came', 'comed'],
        'does': ['do', 'did', 'done', 'doing'],
        'did': ['do', 'does', 'done', 'doing'],
        'done': ['do', 'does', 'did', 'doing'],
        'doing': ['do', 'does', 'did', 'done'],
        'sees': ['see', 'saw', 'seen', 'seeing'],
        'saw': ['see', 'sees', 'seen', 'seeing'],
        'seen': ['see', 'sees', 'saw', 'seeing'],
        'seeing': ['see', 'sees', 'saw', 'seen'],
        'takes': ['take', 'took', 'taken', 'taking'],
        'took': ['take', 'takes', 'taken', 'taking'],
        'taken': ['take', 'takes', 'took', 'taking'],
        'taking': ['take', 'takes', 'took', 'taken']
      };
      
      if (verbDistractors[answer]) {
        distractors.push(...verbDistractors[answer].slice(0, 3));
      }
    }
    
    // 通用干扰项（当没有特定分类匹配时）
    if (distractors.length === 0) {
      const genericDistractors = [
        'different', 'other', 'another', 'similar',
        'same', 'like', 'unlike', 'opposite',
        'correct', 'wrong', 'right', 'incorrect',
        'true', 'false', 'yes', 'no',
        'up', 'down', 'left', 'right',
        'in', 'out', 'on', 'off',
        'big', 'small', 'large', 'tiny',
        'fast', 'slow', 'quick', 'gradual',
        'high', 'low', 'tall', 'short',
        'long', 'short', 'wide', 'narrow'
      ];
      
      // 随机选择3个通用干扰项
      const shuffled = genericDistractors.sort(() => 0.5 - Math.random());
      distractors.push(...shuffled.slice(0, 3));
    }
  }
  
  // 去重并确保不包含正确答案
  const uniqueDistractors = [...new Set(distractors)].filter(d => d !== correctAnswer);
  
  // 如果干扰项不够，添加一些通用选项
  while (uniqueDistractors.length < 3) {
    const genericOptions = ['different', 'other', 'similar', 'correct', 'wrong', 'same', 'like'];
    const randomOption = genericOptions[Math.floor(Math.random() * genericOptions.length)];
    if (!uniqueDistractors.includes(randomOption) && randomOption !== correctAnswer) {
      uniqueDistractors.push(randomOption);
    }
  }
  
  return uniqueDistractors.slice(0, 3);
}

// 转换填空题为选择题
function convertToImprovedChoiceQuestion(originalQuestion) {
  const correctAnswer = originalQuestion.answer;
  const distractors = generateImprovedDistractors(correctAnswer, originalQuestion.text, originalQuestion.category);
  
  // 创建选项数组，包含正确答案和干扰项
  const allOptions = [correctAnswer, ...distractors];
  
  // 随机打乱选项顺序
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }
  
  return {
    text: originalQuestion.text,
    options: allOptions,
    correctAnswer: correctAnswer,
    analysis: originalQuestion.analysis,
    category: originalQuestion.category || '综合练习'
  };
}

// 解析题库
console.log('正在解析题库文件...');
const questions = extractQuestionsFromContent(originalContent);

if (Object.keys(questions).length === 0) {
  console.error('❌ 无法解析到任何题目，请检查题库文件格式');
  process.exit(1);
}

console.log(`✅ 成功解析 ${Object.keys(questions).length} 个分类的题目`);

// 转换整个题库
const choiceQuestions = {};

for (const category in questions) {
  choiceQuestions[category] = questions[category].map(convertToImprovedChoiceQuestion);
  console.log(`✓ 已转换 ${category}: ${questions[category].length} 题`);
}

// 生成新的题库文件内容
const newFileContent = `// 改进版选择题题库 - 基于 intermediate_questions.js 生成
// 生成时间: ${new Date().toLocaleString()}
// 每个题目包含正确答案和3个合理的干扰项

const choiceQuestions = ${JSON.stringify(choiceQuestions, null, 2)};

module.exports = choiceQuestions;
`;

// 保存到新文件
const outputPath = path.join(__dirname, 'miniprogram/data/choice_questions.js');
fs.writeFileSync(outputPath, newFileContent, 'utf8');

console.log('✅ 改进版选择题题库生成完成！');
console.log(`📁 文件保存到: ${outputPath}`);

// 统计信息
let totalQuestions = 0;
Object.keys(choiceQuestions).forEach(category => {
  totalQuestions += choiceQuestions[category].length;
});

console.log(`📊 总题目数: ${totalQuestions}`);
console.log(`📊 分类数: ${Object.keys(choiceQuestions).length}`);
