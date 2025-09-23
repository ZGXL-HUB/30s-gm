// 快速启动题目生成器
// 基于你现有的题库结构，快速生成满足难度需求的题目

const fs = require('fs');
const path = require('path');

// 读取现有题库
function loadExistingQuestions() {
  try {
    const questionsPath = path.join(__dirname, 'miniprogram/data/intermediate_questions.js');
    const content = fs.readFileSync(questionsPath, 'utf8');
    
    // 简单的正则提取（基于你的文件格式）
    const questions = {};
    const categoryMatches = content.match(/"([^"]+)":\s*\[([\s\S]*?)\]/g);
    
    if (categoryMatches) {
      categoryMatches.forEach(match => {
        const categoryNameMatch = match.match(/"([^"]+)":\s*\[/);
        if (!categoryNameMatch) return;
        
        const categoryName = categoryNameMatch[1];
        const arrayContentMatch = match.match(/\[([\s\S]*)\]/);
        if (!arrayContentMatch) return;
        
        const arrayContent = arrayContentMatch[1];
        const questionMatches = arrayContent.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
        
        if (questionMatches) {
          const questionObjects = [];
          questionMatches.forEach(questionMatch => {
            try {
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
              // 忽略解析错误
            }
          });
          
          if (questionObjects.length > 0) {
            questions[categoryName] = questionObjects;
          }
        }
      });
    }
    
    return questions;
  } catch (error) {
    console.error('加载现有题库失败:', error);
    return {};
  }
}

// 智能题目生成器
class SmartQuestionGenerator {
  constructor() {
    this.existingQuestions = loadExistingQuestions();
    this.generatedQuestions = {};
    this.difficultyRules = this.initDifficultyRules();
  }

  // 初始化难度规则
  initDifficultyRules() {
    return {
      easy: {
        // 简单题目特征
        maxLength: 50,
        simpleWords: true,
        singleConcept: true,
        commonPatterns: true
      },
      medium: {
        maxLength: 100,
        moderateWords: true,
        dualConcept: true,
        variedPatterns: true
      },
      hard: {
        maxLength: 200,
        complexWords: true,
        multiConcept: true,
        advancedPatterns: true
      }
    };
  }

  // 分析现有题目模式
  analyzePatterns() {
    const patterns = {};
    
    Object.keys(this.existingQuestions).forEach(category => {
      const questions = this.existingQuestions[category];
      patterns[category] = {
        totalCount: questions.length,
        avgLength: this.calculateAvgLength(questions),
        commonAnswers: this.extractCommonAnswers(questions),
        questionTypes: this.extractQuestionTypes(questions),
        difficulty: this.estimateDifficulty(questions)
      };
    });
    
    return patterns;
  }

  // 计算平均长度
  calculateAvgLength(questions) {
    const totalLength = questions.reduce((sum, q) => sum + q.text.length, 0);
    return Math.round(totalLength / questions.length);
  }

  // 提取常见答案
  extractCommonAnswers(questions) {
    const answers = questions.map(q => q.answer);
    const answerCount = {};
    
    answers.forEach(answer => {
      answerCount[answer] = (answerCount[answer] || 0) + 1;
    });
    
    return Object.entries(answerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([answer, count]) => ({ answer, count }));
  }

  // 提取题目类型
  extractQuestionTypes(questions) {
    const types = {};
    
    questions.forEach(q => {
      const text = q.text;
      if (text.includes('下列') && text.includes('正确的是')) {
        types.choice = (types.choice || 0) + 1;
      } else if (text.includes('填空') || text.includes('（  ）')) {
        types.fillBlank = (types.fillBlank || 0) + 1;
      } else if (text.includes('判断') || text.includes('是否正确')) {
        types.trueFalse = (types.trueFalse || 0) + 1;
      } else {
        types.other = (types.other || 0) + 1;
      }
    });
    
    return types;
  }

  // 估算难度
  estimateDifficulty(questions) {
    const avgLength = this.calculateAvgLength(questions);
    const complexWords = questions.filter(q => 
      q.text.length > 100 || 
      q.text.includes('下列') || 
      q.text.includes('关于')
    ).length;
    
    const complexityRatio = complexWords / questions.length;
    
    if (avgLength < 60 && complexityRatio < 0.3) return 'easy';
    if (avgLength < 120 && complexityRatio < 0.6) return 'medium';
    return 'hard';
  }

  // 生成题目变式
  generateVariants(originalQuestion, count = 3) {
    const variants = [];
    const { text, answer, analysis, category } = originalQuestion;
    
    for (let i = 0; i < count; i++) {
      const variant = this.createVariant(text, answer, analysis, category);
      if (variant) {
        variants.push(variant);
      }
    }
    
    return variants;
  }

  // 创建题目变式
  createVariant(text, answer, analysis, category) {
    // 基于原题目创建变式
    const variants = [
      // 改变表述方式
      text.replace('下列', '以下').replace('正确的是', '正确的选项是'),
      text.replace('下列', '下面').replace('正确的是', '正确的一项是'),
      text.replace('下列', '以下').replace('正确的是', '符合要求的是'),
      
      // 改变问题形式
      text.replace('下列', '关于').replace('正确的是', '下列说法正确的是'),
      text.replace('下列', '根据').replace('正确的是', '正确的表述是'),
      
      // 改变选项描述
      text.replace('正确的是', '符合规则的是'),
      text.replace('正确的是', '使用恰当的是'),
      text.replace('正确的是', '语法正确的是')
    ];
    
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    
    return {
      text: randomVariant,
      answer: answer,
      analysis: analysis,
      category: category,
      type: 'variant',
      difficulty: this.estimateDifficulty([{ text: randomVariant }])
    };
  }

  // 生成干扰项
  generateDistractors(correctAnswer, category) {
    const distractors = [];
    
    // 基于答案类型生成干扰项
    if (typeof correctAnswer === 'string') {
      const answer = correctAnswer.toLowerCase();
      
      // 代词干扰项
      if (category.includes('代词')) {
        const pronounMap = {
          'i': ['me', 'my', 'mine'],
          'me': ['i', 'my', 'mine'],
          'he': ['him', 'his', 'himself'],
          'him': ['he', 'his', 'himself'],
          'she': ['her', 'hers', 'herself'],
          'her': ['she', 'hers', 'herself'],
          'we': ['us', 'our', 'ours'],
          'us': ['we', 'our', 'ours'],
          'they': ['them', 'their', 'theirs'],
          'them': ['they', 'their', 'theirs']
        };
        
        if (pronounMap[answer]) {
          distractors.push(...pronounMap[answer]);
        }
      }
      
      // 介词干扰项
      else if (category.includes('介词')) {
        const prepositionMap = {
          'to': ['for', 'at', 'in', 'by'],
          'of': ['for', 'with', 'by', 'from'],
          'in': ['at', 'on', 'by', 'within'],
          'at': ['in', 'on', 'to', 'by'],
          'on': ['in', 'at', 'by', 'upon'],
          'for': ['to', 'of', 'with', 'by'],
          'with': ['by', 'for', 'of', 'to'],
          'by': ['with', 'for', 'in', 'at']
        };
        
        if (prepositionMap[answer]) {
          distractors.push(...prepositionMap[answer]);
        }
      }
      
      // 通用干扰项
      else {
        const genericDistractors = ['different', 'other', 'similar', 'wrong', 'incorrect'];
        distractors.push(...genericDistractors);
      }
    }
    
    return [...new Set(distractors)].slice(0, 3);
  }

  // 批量生成题目
  generateBatchQuestions(targetCount = 5000) {
    console.log('🚀 开始批量生成题目...');
    
    const patterns = this.analyzePatterns();
    const categories = Object.keys(this.existingQuestions);
    const questionsPerCategory = Math.floor(targetCount / categories.length);
    
    console.log(`📊 分析结果:`);
    Object.keys(patterns).forEach(category => {
      const pattern = patterns[category];
      console.log(`   ${category}: ${pattern.totalCount}题, 难度${pattern.difficulty}, 平均长度${pattern.avgLength}`);
    });
    
    categories.forEach(category => {
      console.log(`\n🔄 正在生成 ${category} 分类题目...`);
      
      const existingQuestions = this.existingQuestions[category];
      const targetCount = questionsPerCategory;
      const currentCount = existingQuestions.length;
      const needCount = Math.max(0, targetCount - currentCount);
      
      if (needCount > 0) {
        const generatedQuestions = [];
        
        // 从现有题目生成变式
        const variantCount = Math.min(needCount, existingQuestions.length * 2);
        for (let i = 0; i < variantCount && generatedQuestions.length < needCount; i++) {
          const originalQuestion = existingQuestions[i % existingQuestions.length];
          const variants = this.generateVariants(originalQuestion, 1);
          generatedQuestions.push(...variants);
        }
        
        // 如果还不够，生成全新题目
        while (generatedQuestions.length < needCount) {
          const randomQuestion = existingQuestions[Math.floor(Math.random() * existingQuestions.length)];
          const newQuestion = this.createNewQuestion(randomQuestion, category);
          if (newQuestion) {
            generatedQuestions.push(newQuestion);
          }
        }
        
        this.generatedQuestions[category] = generatedQuestions.slice(0, needCount);
        console.log(`   ✅ 生成了 ${this.generatedQuestions[category].length} 道新题目`);
      } else {
        console.log(`   ⏭️  ${category} 已有足够题目，跳过生成`);
      }
    });
    
    return this.generatedQuestions;
  }

  // 创建全新题目
  createNewQuestion(templateQuestion, category) {
    const { text, answer, analysis } = templateQuestion;
    
    // 基于模板创建新题目
    const newText = this.generateNewText(text, category);
    const newAnswer = this.generateNewAnswer(answer, category);
    const newAnalysis = this.generateNewAnalysis(analysis, newAnswer);
    
    return {
      text: newText,
      answer: newAnswer,
      analysis: newAnalysis,
      category: category,
      type: 'generated',
      difficulty: this.estimateDifficulty([{ text: newText }])
    };
  }

  // 生成新题目文本
  generateNewText(originalText, category) {
    const templates = {
      '代词': [
        '下列代词使用正确的是（  ）',
        '关于代词，下列正确的是（  ）',
        '下列代词形式正确的是（  ）'
      ],
      '介词': [
        '下列介词使用正确的是（  ）',
        '关于介词，下列正确的是（  ）',
        '下列介词搭配正确的是（  ）'
      ],
      '时态': [
        '下列时态使用正确的是（  ）',
        '关于时态，下列正确的是（  ）',
        '下列时态形式正确的是（  ）'
      ]
    };
    
    const categoryTemplates = templates[category] || templates['代词'];
    return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  }

  // 生成新答案
  generateNewAnswer(originalAnswer, category) {
    // 基于分类生成相关答案
    const answerPool = {
      '代词': ['I', 'me', 'my', 'mine', 'he', 'him', 'his', 'she', 'her', 'hers'],
      '介词': ['to', 'for', 'of', 'in', 'at', 'on', 'by', 'with', 'from'],
      '时态': ['is', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would']
    };
    
    const pool = answerPool[category] || answerPool['代词'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 生成新解析
  generateNewAnalysis(originalAnalysis, answer) {
    return `正确答案是"${answer}"。根据语法规则，${answer}是正确形式。`;
  }

  // 保存生成的题目
  saveGeneratedQuestions(outputPath) {
    const allQuestions = { ...this.existingQuestions };
    
    // 合并生成的题目
    Object.keys(this.generatedQuestions).forEach(category => {
      if (allQuestions[category]) {
        allQuestions[category] = [...allQuestions[category], ...this.generatedQuestions[category]];
      } else {
        allQuestions[category] = this.generatedQuestions[category];
      }
    });
    
    const content = `// 扩展后的题库
// 生成时间: ${new Date().toLocaleString()}
// 总题目数: ${Object.values(allQuestions).flat().length}

const expandedQuestions = ${JSON.stringify(allQuestions, null, 2)};

module.exports = expandedQuestions;
`;

    fs.writeFileSync(outputPath, content, 'utf8');
    
    console.log(`\n✅ 题目已保存到: ${outputPath}`);
    console.log(`📊 最终统计:`);
    Object.keys(allQuestions).forEach(category => {
      console.log(`   ${category}: ${allQuestions[category].length} 题`);
    });
    console.log(`   总计: ${Object.values(allQuestions).flat().length} 题`);
  }
}

// 执行生成
const generator = new SmartQuestionGenerator();
const generatedQuestions = generator.generateBatchQuestions(5000);
generator.saveGeneratedQuestions('expanded_questions.js');

console.log('\n🎉 批量题目生成完成！');
console.log('💡 建议下一步：');
console.log('1. 检查生成的题目质量');
console.log('2. 进行小规模测试');
console.log('3. 根据反馈优化生成算法');
console.log('4. 集成到现有系统中');
