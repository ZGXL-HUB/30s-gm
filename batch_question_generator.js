// 批量题目生成器 - 基于模板的智能生成方案
const fs = require('fs');
const path = require('path');

class BatchQuestionGenerator {
  constructor() {
    this.grammarRules = this.loadGrammarRules();
    this.difficultyTemplates = this.loadDifficultyTemplates();
    this.questionTemplates = this.loadQuestionTemplates();
  }

  // 加载语法规则库
  loadGrammarRules() {
    return {
      // 代词规则
      pronouns: {
        personal: {
          subject: ['I', 'you', 'he', 'she', 'it', 'we', 'they'],
          object: ['me', 'you', 'him', 'her', 'it', 'us', 'them'],
          possessive: ['my', 'your', 'his', 'her', 'its', 'our', 'their'],
          reflexive: ['myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves']
        },
        relative: ['who', 'whom', 'which', 'that', 'whose']
      },
      
      // 介词规则
      prepositions: {
        time: ['at', 'in', 'on', 'by', 'for', 'during', 'since', 'until', 'before', 'after'],
        place: ['at', 'in', 'on', 'by', 'near', 'under', 'over', 'above', 'below', 'beside'],
        direction: ['to', 'from', 'into', 'onto', 'towards', 'away from'],
        manner: ['by', 'with', 'without', 'like', 'unlike']
      },
      
      // 时态规则
      tenses: {
        present: {
          simple: ['am/is/are', 'do/does'],
          continuous: ['am/is/are + -ing'],
          perfect: ['have/has + past participle'],
          perfect_continuous: ['have/has been + -ing']
        },
        past: {
          simple: ['was/were', 'did'],
          continuous: ['was/were + -ing'],
          perfect: ['had + past participle'],
          perfect_continuous: ['had been + -ing']
        },
        future: {
          simple: ['will + base form'],
          continuous: ['will be + -ing'],
          perfect: ['will have + past participle'],
          perfect_continuous: ['will have been + -ing']
        }
      },
      
      // 名词复数规则
      nounPlurals: {
        regular: ['+s', '+es', '+ies'],
        irregular: ['children', 'men', 'women', 'feet', 'teeth', 'mice', 'geese'],
        unchanged: ['sheep', 'deer', 'fish', 'series', 'species']
      },
      
      // 形容词比较级规则
      comparatives: {
        regular: ['+er', '+est', 'more +', 'most +'],
        irregular: {
          good: ['better', 'best'],
          bad: ['worse', 'worst'],
          far: ['farther/further', 'farthest/furthest'],
          little: ['less', 'least'],
          many: ['more', 'most']
        }
      }
    };
  }

  // 加载难度模板
  loadDifficultyTemplates() {
    return {
      easy: {
        // 简单题目特征
        characteristics: [
          '使用基础词汇',
          '句子结构简单',
          '语法点单一',
          '答案明确唯一'
        ],
        // 难度权重
        weights: {
          vocabulary: 0.3,
          structure: 0.4,
          grammar: 0.3
        }
      },
      medium: {
        characteristics: [
          '使用中等难度词汇',
          '句子结构适中',
          '涉及2-3个语法点',
          '需要一定推理能力'
        ],
        weights: {
          vocabulary: 0.4,
          structure: 0.3,
          grammar: 0.3
        }
      },
      hard: {
        characteristics: [
          '使用高级词汇',
          '复杂句子结构',
          '涉及多个语法点',
          '需要深度理解'
        ],
        weights: {
          vocabulary: 0.3,
          structure: 0.3,
          grammar: 0.4
        }
      }
    };
  }

  // 加载题目模板
  loadQuestionTemplates() {
    return {
      // 填空题模板
      fillBlank: {
        templates: [
          "下列单词中，{grammar_point}形式正确的是（  ）",
          "在下列选项中，{grammar_point}使用正确的是（  ）",
          "下列句子中，{grammar_point}部分正确的是（  ）",
          "根据{grammar_point}规则，下列正确的是（  ）"
        ],
        options: {
          count: 4,
          includeCorrect: true,
          includeDistractors: true
        }
      },
      
      // 选择题模板
      multipleChoice: {
        templates: [
          "下列{grammar_point}中，正确的是（  ）",
          "关于{grammar_point}，下列表述正确的是（  ）",
          "下列{grammar_point}形式书写正确的是（  ）",
          "下列关于{grammar_point}的说法正确的是（  ）"
        ],
        options: {
          count: 4,
          includeCorrect: true,
          includeDistractors: true
        }
      },
      
      // 判断题模板
      trueFalse: {
        templates: [
          "下列{grammar_point}的表述是否正确：{statement}",
          "关于{grammar_point}，下列说法是否正确：{statement}",
          "下列{grammar_point}规则是否正确：{statement}"
        ]
      }
    };
  }

  // 生成题目
  generateQuestions(category, count, difficulty = 'medium') {
    const questions = [];
    const grammarPoint = this.grammarRules[category];
    
    if (!grammarPoint) {
      console.error(`未找到语法点: ${category}`);
      return questions;
    }

    for (let i = 0; i < count; i++) {
      const question = this.generateSingleQuestion(category, difficulty);
      if (question) {
        questions.push(question);
      }
    }

    return questions;
  }

  // 生成单个题目
  generateSingleQuestion(category, difficulty) {
    const template = this.selectTemplate(category, difficulty);
    const grammarPoint = this.grammarRules[category];
    
    // 根据难度调整题目复杂度
    const complexity = this.getComplexityByDifficulty(difficulty);
    
    // 生成题目内容
    const questionText = this.generateQuestionText(template, category, complexity);
    const correctAnswer = this.generateCorrectAnswer(grammarPoint, complexity);
    const options = this.generateOptions(correctAnswer, category, difficulty);
    const analysis = this.generateAnalysis(correctAnswer, category, complexity);

    return {
      text: questionText,
      answer: correctAnswer,
      options: options,
      analysis: analysis,
      category: category,
      difficulty: difficulty,
      type: 'generated',
      createdAt: new Date().toISOString()
    };
  }

  // 选择题目模板
  selectTemplate(category, difficulty) {
    const templates = this.questionTemplates.fillBlank.templates;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // 根据难度获取复杂度
  getComplexityByDifficulty(difficulty) {
    const complexityMap = {
      easy: { level: 1, features: ['basic_vocabulary', 'simple_structure'] },
      medium: { level: 2, features: ['intermediate_vocabulary', 'moderate_structure', 'multiple_concepts'] },
      hard: { level: 3, features: ['advanced_vocabulary', 'complex_structure', 'multiple_concepts', 'nuanced_understanding'] }
    };
    return complexityMap[difficulty] || complexityMap.medium;
  }

  // 生成题目文本
  generateQuestionText(template, category, complexity) {
    return template.replace('{grammar_point}', this.getGrammarPointName(category));
  }

  // 获取语法点名称
  getGrammarPointName(category) {
    const nameMap = {
      pronouns: '代词',
      prepositions: '介词',
      tenses: '时态',
      nounPlurals: '名词复数',
      comparatives: '形容词比较级'
    };
    return nameMap[category] || category;
  }

  // 生成正确答案
  generateCorrectAnswer(grammarPoint, complexity) {
    // 根据语法规则和复杂度生成正确答案
    const rules = Object.values(grammarPoint).flat();
    return rules[Math.floor(Math.random() * rules.length)];
  }

  // 生成选项
  generateOptions(correctAnswer, category, difficulty) {
    const options = [correctAnswer];
    const distractors = this.generateDistractors(correctAnswer, category, difficulty);
    
    // 合并选项并打乱顺序
    const allOptions = [...options, ...distractors];
    return this.shuffleArray(allOptions);
  }

  // 生成干扰项
  generateDistractors(correctAnswer, category, difficulty) {
    const distractors = [];
    const grammarPoint = this.grammarRules[category];
    
    // 根据语法点生成相关干扰项
    if (category === 'pronouns') {
      const allPronouns = Object.values(grammarPoint).flat();
      const wrongPronouns = allPronouns.filter(p => p !== correctAnswer);
      distractors.push(...this.randomSelect(wrongPronouns, 3));
    } else if (category === 'prepositions') {
      const allPrepositions = Object.values(grammarPoint).flat();
      const wrongPrepositions = allPrepositions.filter(p => p !== correctAnswer);
      distractors.push(...this.randomSelect(wrongPrepositions, 3));
    }
    
    return distractors;
  }

  // 生成解析
  generateAnalysis(correctAnswer, category, complexity) {
    return `正确答案是"${correctAnswer}"。根据${this.getGrammarPointName(category)}的语法规则，${correctAnswer}是正确形式。`;
  }

  // 工具方法
  randomSelect(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // 批量生成所有分类的题目
  generateAllQuestions(totalCount = 5000) {
    const categories = Object.keys(this.grammarRules);
    const questionsPerCategory = Math.floor(totalCount / categories.length);
    const allQuestions = {};

    console.log(`开始批量生成 ${totalCount} 道题目...`);

    categories.forEach(category => {
      console.log(`正在生成 ${category} 分类题目...`);
      
      const easyCount = Math.floor(questionsPerCategory * 0.3);
      const mediumCount = Math.floor(questionsPerCategory * 0.5);
      const hardCount = questionsPerCategory - easyCount - mediumCount;

      const easyQuestions = this.generateQuestions(category, easyCount, 'easy');
      const mediumQuestions = this.generateQuestions(category, mediumCount, 'medium');
      const hardQuestions = this.generateQuestions(category, hardCount, 'hard');

      allQuestions[category] = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
      
      console.log(`✓ ${category}: 生成了 ${allQuestions[category].length} 题`);
    });

    return allQuestions;
  }

  // 保存题目到文件
  saveQuestions(questions, outputPath) {
    const content = `// 批量生成的题目库
// 生成时间: ${new Date().toLocaleString()}
// 总题目数: ${Object.values(questions).flat().length}

const generatedQuestions = ${JSON.stringify(questions, null, 2)};

module.exports = generatedQuestions;
`;

    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`✅ 题目已保存到: ${outputPath}`);
  }
}

// 使用示例
const generator = new BatchQuestionGenerator();

// 生成5000道题目
const allQuestions = generator.generateAllQuestions(5000);

// 保存到文件
generator.saveQuestions(allQuestions, 'generated_questions_batch.js');

console.log('🎉 批量题目生成完成！');
console.log(`📊 统计信息:`);
Object.keys(allQuestions).forEach(category => {
  console.log(`   ${category}: ${allQuestions[category].length} 题`);
});
console.log(`   总计: ${Object.values(allQuestions).flat().length} 题`);
