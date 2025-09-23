const fs = require('fs');
const path = require('path');

// 定义所有语法小点
const grammarPoints = [
  // 介词类
  "介词综合", "固定搭配", "介词 + 名词/动名词",
  
  // 代词类
  "代词综合", "人称代词", "物主代词", "反身代词", "关系代词", "it相关",
  
  // 连词类
  "并列连词综合", "从属连词综合", "连词与名/动/形/副综合", "连词与名词", "连词与动词", "连词与形容词",
  
  // 冠词类
  "冠词综合", "泛指与特指", "a和an", "the的特殊用法",
  
  // 名词类
  "名词综合", "复合词和外来词", "单复数同形", "不规则复数", "以o结尾", "以y结尾", "s/sh/ch/x结尾", "以f/fe结尾",
  
  // 动词类
  "被动写be吗", "并列句与动词", "主从句与动词", "插入语与动词",
  
  // 谓语类
  "谓语", "时态(一般过去时)", "时态(一般将来时)", "时态(过去将来时)", "时态(现在进行时)", "时态(过去进行时)", "时态(现在完成时)", "时态(过去完成时)", "语态(被动+八大时态)",
  
  // 非谓语类
  "现在分词综合", "过去分词综合", "不定式综合",
  
  // 形容词类
  "形容词综合", "比较级", "最高级",
  
  // 副词类
  "副词综合", "副词修饰动词", "副词修饰句子", "副词修饰形容词/副词",
  
  // 定语从句类
  "定语从句综合", "that能填吗", "who和which选哪个", "whose", "which和when/where混淆",
  
  // 状语从句类
  "状语从句综合", "when", "where", "how", "why"
];

// 读取题目数据
function loadQuestions() {
  try {
    const questionsPath = path.join(__dirname, '..', 'miniprogram', 'data', 'intermediate_questions.js');
    const content = fs.readFileSync(questionsPath, 'utf8');
    
    // 提取questions对象
    const questionsMatch = content.match(/const questions = ({[\s\S]*?});/);
    if (!questionsMatch) {
      throw new Error('无法找到questions对象');
    }
    
    // 执行代码获取questions对象
    const questionsCode = questionsMatch[1];
    const questions = eval('(' + questionsCode + ')');
    
    return questions;
  } catch (error) {
    console.error('加载题目数据失败:', error.message);
    return null;
  }
}

// 为答案生成合理的干扰项
function generateDistractors(answer, category) {
  const distractors = [];
  
  // 根据答案类型和语法点生成不同的干扰项
  if (typeof answer === 'string') {
    if (answer.length <= 3) {
      // 短答案（介词、冠词等）
      const similarAnswers = {
        // 介词
        'to': ['for', 'at', 'in'],
        'of': ['for', 'with', 'by'],
        'in': ['at', 'on', 'by'],
        'at': ['in', 'on', 'to'],
        'on': ['in', 'at', 'by'],
        'for': ['to', 'of', 'with'],
        'with': ['by', 'for', 'of'],
        'by': ['with', 'for', 'in'],
        'from': ['of', 'by', 'with'],
        'about': ['of', 'for', 'to'],
        'against': ['for', 'with', 'to'],
        'among': ['between', 'in', 'with'],
        'between': ['among', 'in', 'with'],
        
        // 代词
        'us': ['we', 'our', 'ours'],
        'me': ['I', 'my', 'mine'],
        'him': ['he', 'his', 'he\'s'],
        'her': ['she', 'her', 'hers'],
        'them': ['they', 'their', 'theirs'],
        'it': ['its', 'this', 'that'],
        'myself': ['me', 'I', 'my'],
        'yourself': ['you', 'your', 'yours'],
        'himself': ['he', 'his', 'him'],
        'herself': ['she', 'her', 'hers'],
        'itself': ['it', 'its', 'this'],
        'ourselves': ['we', 'our', 'us'],
        'yourselves': ['you', 'your', 'yours'],
        'themselves': ['they', 'their', 'them'],
        
        // 关系代词
        'who': ['which', 'that', 'whom'],
        'which': ['what', 'that', 'who'],
        'that': ['which', 'what', 'who'],
        'whose': ['who', 'which', 'that'],
        'whom': ['who', 'which', 'that'],
        
        // 疑问词
        'when': ['where', 'how', 'why'],
        'where': ['when', 'how', 'why'],
        'how': ['what', 'when', 'where'],
        'why': ['what', 'when', 'where'],
        'what': ['which', 'that', 'who'],
        
        // 冠词
        'a': ['an', 'the', 'some'],
        'an': ['a', 'the', 'some'],
        'the': ['a', 'an', 'this'],
        
        // 连词
        'and': ['or', 'but', 'so'],
        'or': ['and', 'but', 'so'],
        'but': ['and', 'or', 'so'],
        'so': ['and', 'or', 'but'],
        'because': ['since', 'as', 'for'],
        'since': ['because', 'as', 'for'],
        'as': ['because', 'since', 'for'],
        'if': ['whether', 'when', 'unless'],
        'when': ['if', 'while', 'as'],
        'while': ['when', 'as', 'during'],
        'although': ['though', 'despite', 'however'],
        'though': ['although', 'despite', 'however']
      };
      
      if (similarAnswers[answer]) {
        distractors.push(...similarAnswers[answer].slice(0, 2));
      } else {
        // 生成通用干扰项
        const commonWords = ['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
        const filtered = commonWords.filter(word => word !== answer);
        distractors.push(...filtered.slice(0, 2));
      }
    } else {
      // 长答案（动词、名词等）
      
      // 特殊处理反身代词
      if (answer.endsWith('self') || answer.endsWith('selves')) {
        const base = answer.replace(/self$|selves$/, '');
        const alternatives = [];
        if (base === 'my') alternatives.push('me', 'I');
        else if (base === 'your') alternatives.push('you', 'yours');
        else if (base === 'him') alternatives.push('he', 'his');
        else if (base === 'her') alternatives.push('she', 'hers');
        else if (base === 'it') alternatives.push('its', 'this');
        else if (base === 'our') alternatives.push('we', 'us');
        else if (base === 'your') alternatives.push('you', 'yours');
        else if (base === 'their') alternatives.push('they', 'them');
        else {
          alternatives.push('me', 'you', 'him', 'her');
        }
        distractors.push(...alternatives.slice(0, 2));
      }
      // 特殊处理物主代词
      else if (answer.endsWith('s') && ['yours', 'ours', 'theirs', 'his', 'hers', 'its'].includes(answer)) {
        const base = answer.replace(/s$/, '');
        const alternatives = [];
        if (base === 'your') alternatives.push('you', 'your');
        else if (base === 'our') alternatives.push('we', 'our');
        else if (base === 'their') alternatives.push('they', 'their');
        else if (base === 'hi') alternatives.push('he', 'his');
        else if (base === 'her') alternatives.push('she', 'her');
        else if (base === 'it') alternatives.push('its', 'this');
        else {
          alternatives.push('my', 'your', 'his', 'her');
        }
        distractors.push(...alternatives.slice(0, 2));
      }
      // 特殊处理复合答案（如 "which / that"）
      else if (answer.includes(' / ')) {
        const parts = answer.split(' / ');
        const alternatives = [];
        alternatives.push(parts[0], parts[1]);
        // 添加其他相关词
        if (answer.includes('which')) alternatives.push('what', 'who');
        if (answer.includes('that')) alternatives.push('this', 'it');
        distractors.push(...alternatives.slice(0, 2));
      }
      // 特殊处理疑问词
      else if (['whoever', 'whatever', 'whenever', 'wherever', 'however'].includes(answer)) {
        const base = answer.replace(/ever$/, '');
        const alternatives = [];
        alternatives.push(base, 'anyone', 'anything', 'anywhere');
        distractors.push(...alternatives.slice(0, 2));
      }
      else if (answer.endsWith('ing')) {
        // 动名词形式
        const base = answer.slice(0, -3);
        // 只生成有效的英语单词形式
        const alternatives = [];
        if (base.length > 0) {
          alternatives.push(base + 'ed');  // 过去式
          alternatives.push(base + 's');   // 第三人称单数
        }
        // 添加一些常见的错误形式
        alternatives.push('to ' + base);
        alternatives.push('the ' + base);
        distractors.push(...alternatives.slice(0, 2));
      } else if (answer.endsWith('ed')) {
        // 过去式
        const base = answer.slice(0, -2);
        const alternatives = [];
        if (base.length > 0) {
          alternatives.push(base + 'ing'); // 动名词
          alternatives.push(base + 's');   // 第三人称单数
        }
        alternatives.push('to ' + base);
        alternatives.push('the ' + base);
        distractors.push(...alternatives.slice(0, 2));
      } else if (answer.endsWith('s')) {
        // 复数形式
        const base = answer.slice(0, -1);
        const alternatives = [];
        if (base.length > 0) {
          alternatives.push(base);         // 单数
          alternatives.push(base + 'ing'); // 动名词
        }
        alternatives.push('the ' + base);
        alternatives.push('a ' + base);
        distractors.push(...alternatives.slice(0, 2));
      } else if (answer.endsWith('er')) {
        // 比较级
        const base = answer.slice(0, -2);
        const alternatives = [];
        if (base.length > 0) {
          alternatives.push(base);         // 原级
          alternatives.push(base + 'est'); // 最高级
        }
        alternatives.push('more ' + base);
        alternatives.push('the ' + base);
        distractors.push(...alternatives.slice(0, 2));
      } else if (answer.endsWith('est')) {
        // 最高级
        const base = answer.slice(0, -3);
        const alternatives = [];
        if (base.length > 0) {
          alternatives.push(base);         // 原级
          alternatives.push(base + 'er');  // 比较级
        }
        alternatives.push('most ' + base);
        alternatives.push('the ' + base);
        distractors.push(...alternatives.slice(0, 2));
      } else {
        // 其他长答案
        const alternatives = [];
        if (answer.length > 2) {
          alternatives.push(answer + 'ing');
          alternatives.push(answer + 'ed');
          alternatives.push(answer + 's');
        }
        alternatives.push('the ' + answer);
        alternatives.push('a ' + answer);
        distractors.push(...alternatives.slice(0, 2));
      }
    }
  } else {
    // 数字或其他类型
    distractors.push(answer + 1, answer - 1);
  }
  
  // 确保干扰项不重复且不等于正确答案
  const uniqueDistractors = [...new Set(distractors)].filter(d => d !== answer);
  
  // 如果干扰项不够，添加通用干扰项
  while (uniqueDistractors.length < 2) {
    const genericDistractors = ['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'and', 'or', 'but'];
    for (const distractor of genericDistractors) {
      if (!uniqueDistractors.includes(distractor) && distractor !== answer) {
        uniqueDistractors.push(distractor);
        break;
      }
    }
    // 防止无限循环
    if (uniqueDistractors.length < 2) {
      uniqueDistractors.push('other', 'different');
      break;
    }
  }
  
  return uniqueDistractors.slice(0, 2);
}

// 随机打乱选项顺序
function shuffleOptions(correctAnswer, distractors) {
  const allOptions = [correctAnswer, ...distractors];
  
  // Fisher-Yates 洗牌算法
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }
  
  return allOptions;
}

// 生成选择题
function generateMultipleChoice(question, grammarPoint) {
  const correctAnswer = question.answer;
  const distractors = generateDistractors(correctAnswer, grammarPoint);
  const shuffledOptions = shuffleOptions(correctAnswer, distractors);
  
  // 找到正确答案的索引
  const correctIndex = shuffledOptions.indexOf(correctAnswer);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    grammarPoint: grammarPoint,
    question: question.text,
    options: shuffledOptions.map((option, index) => ({
      label: String.fromCharCode(65 + index), // A, B, C, D
      text: option,
      isCorrect: option === correctAnswer
    })),
    correctAnswer: correctAnswer,
    correctOption: String.fromCharCode(65 + correctIndex),
    analysis: question.analysis || '暂无解析',
    category: question.category || grammarPoint
  };
}

// 主函数
function main() {
  console.log('开始生成语法选择题...');
  
  const questions = loadQuestions();
  if (!questions) {
    console.error('无法加载题目数据');
    return;
  }
  
  const multipleChoiceQuestions = [];
  const missingPoints = [];
  
  // 为每个语法小点生成选择题
  for (const point of grammarPoints) {
    if (questions[point] && questions[point].length > 0) {
      // 随机选择一题
      const randomIndex = Math.floor(Math.random() * questions[point].length);
      const selectedQuestion = questions[point][randomIndex];
      
      // 生成选择题
      const mcQuestion = generateMultipleChoice(selectedQuestion, point);
      multipleChoiceQuestions.push(mcQuestion);
      
      console.log(`✓ 已生成 ${point} 的选择题`);
    } else {
      missingPoints.push(point);
      console.log(`✗ 未找到 ${point} 的题目数据`);
    }
  }
  
  // 生成结果
  const result = {
    metadata: {
      totalQuestions: multipleChoiceQuestions.length,
      grammarPoints: grammarPoints.length,
      generatedAt: new Date().toISOString(),
      description: '语法选择题题库 - 每个语法小点随机抽取一题，添加干扰项生成选择题格式'
    },
    questions: multipleChoiceQuestions,
    missingPoints: missingPoints
  };
  
  // 保存到文件
  const outputPath = path.join(__dirname, '语法选择题题库.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
  
  // 生成HTML版本
  generateHTML(result);
  
  // 生成Markdown版本
  generateMarkdown(result);
  
  console.log(`\n✅ 完成！生成了 ${multipleChoiceQuestions.length} 道选择题`);
  console.log(`📁 结果已保存到: ${outputPath}`);
  console.log(`📊 缺失的语法点: ${missingPoints.length} 个`);
  if (missingPoints.length > 0) {
    console.log('缺失的语法点:', missingPoints.join(', '));
  }
}

// 生成HTML版本
function generateHTML(result) {
  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>语法选择题题库</title>
    <style>
        body { font-family: 'Microsoft YaHei', Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        .metadata { background: #ecf0f1; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .question { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa; }
        .question-header { font-weight: bold; color: #e74c3c; margin-bottom: 10px; }
        .question-text { font-size: 16px; margin-bottom: 15px; line-height: 1.6; }
        .options { margin-bottom: 15px; }
        .option { margin: 8px 0; padding: 8px 12px; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; }
        .option:hover { background-color: #e8f4fd; }
        .option.correct { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .option.incorrect { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        .analysis { background: #e7f3ff; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db; }
        .analysis-title { font-weight: bold; color: #2980b9; margin-bottom: 8px; }
        .stats { text-align: center; color: #7f8c8d; margin-top: 20px; }
        .option-label { display: inline-block; width: 30px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 语法选择题题库</h1>
        
        <div class="metadata">
            <p><strong>生成时间:</strong> ${new Date(result.metadata.generatedAt).toLocaleString('zh-CN')}</p>
            <p><strong>题目总数:</strong> ${result.metadata.totalQuestions}</p>
            <p><strong>语法点总数:</strong> ${result.metadata.grammarPoints}</p>
            <p><strong>描述:</strong> ${result.metadata.description}</p>
        </div>`;

  result.questions.forEach((q, index) => {
    html += `
        <div class="question">
            <div class="question-header">第${index + 1}题 - ${q.grammarPoint}</div>
            <div class="question-text">${q.question}</div>
            <div class="options">`;
    
    q.options.forEach(option => {
      const className = option.isCorrect ? 'correct' : 'incorrect';
      html += `<div class="option ${className}"><span class="option-label">${option.label}.</span> ${option.text}</div>`;
    });
    
    html += `
            </div>
            <div class="analysis">
                <div class="analysis-title">💡 解析</div>
                <div>${q.analysis}</div>
            </div>
        </div>`;
  });

  html += `
        <div class="stats">
            <p>共 ${result.metadata.totalQuestions} 道题目 | 生成时间: ${new Date(result.metadata.generatedAt).toLocaleString('zh-CN')}</p>
        </div>
    </div>
</body>
</html>`;

  const htmlPath = path.join(__dirname, '语法选择题题库.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`📄 HTML版本已生成: ${htmlPath}`);
}

// 生成Markdown版本
function generateMarkdown(result) {
  let markdown = `# 📚 语法选择题题库

## 📊 基本信息
- **生成时间**: ${new Date(result.metadata.generatedAt).toLocaleString('zh-CN')}
- **题目总数**: ${result.metadata.totalQuestions}
- **语法点总数**: ${result.metadata.grammarPoints}
- **描述**: ${result.metadata.description}

---

`;

  result.questions.forEach((q, index) => {
    markdown += `## 第${index + 1}题 - ${q.grammarPoint}

**题目**: ${q.question}

**选项**:
`;

    q.options.forEach(option => {
      const marker = option.isCorrect ? '✅' : '❌';
      markdown += `${marker} ${option.label}. ${option.text}\n`;
    });

    markdown += `
**正确答案**: ${q.correctAnswer} (${q.correctOption})

**解析**: ${q.analysis}

---

`;
  });

  markdown += `## 📈 统计信息
- 总题目数: ${result.metadata.totalQuestions}
- 语法点覆盖: ${result.metadata.totalQuestions}/${result.metadata.grammarPoints}
- 生成时间: ${new Date(result.metadata.generatedAt).toLocaleString('zh-CN')}

`;

  if (result.missingPoints.length > 0) {
    markdown += `## ⚠️ 缺失的语法点
${result.missingPoints.map(point => `- ${point}`).join('\n')}
`;
  }

  const mdPath = path.join(__dirname, '语法选择题题库.md');
  fs.writeFileSync(mdPath, markdown, 'utf8');
  console.log(`📝 Markdown版本已生成: ${mdPath}`);
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  generateMultipleChoice,
  generateDistractors,
  shuffleOptions
};
