/**
 * 初中英语语法知识点三级菜单数据结构
 * 基于云南中考真题数据
 * 
 * 注意：此文件位于分包内，避免跨包引用问题
 */

// 真题数据映射：题目ID -> 知识点路径（三级路径）
const examQuestionMapping = {
  // 2025年真题
  1: { path: '2.2.2', type: 'choice', year: 2025 }, // 一般过去时
  2: { path: '1.2.2', type: 'choice', year: 2025 }, // 物主代词
  3: { path: '1.4.2', type: 'choice', year: 2025 }, // 情态动词
  4: { path: '1.5.2', type: 'choice', year: 2025 }, // 地点介词
  5: { path: '1.8.1', type: 'choice', year: 2025 }, // 并列连词
  21: { path: '1.4.2', type: 'choice', year: 2025 }, // 情态动词
  22: { path: '2.5.3', type: 'choice', year: 2025 }, // 状语从句
  25: { path: '1.4.2', type: 'choice', year: 2025 }, // 情态动词
  29: { path: '2.5.1', type: 'choice', year: 2025 }, // 宾语从句
  31: { path: '2.2.2', type: 'fill', year: 2025 }, // 一般过去时
  32: { path: '1.2.2', type: 'fill', year: 2025 }, // 物主代词
  33: { path: '1.4.3', type: 'fill', year: 2025 }, // 非谓语动词
  34: { path: '2.6.2', type: 'fill', year: 2025 }, // 感叹句
  35: { path: '2.5.2', type: 'fill', year: 2025 }, // 定语从句
  
  // 2024年真题
  6: { path: '1.2.3', type: 'choice', year: 2024 }, // 反身代词
  7: { path: '1.5.1', type: 'choice', year: 2024 }, // 时间介词
  8: { path: '1.4.2', type: 'choice', year: 2024 }, // 情态动词
  9: { path: '2.6.2', type: 'choice', year: 2024 }, // 感叹句
  10: { path: '2.2.5', type: 'choice', year: 2024 }, // 过去进行时
  11: { path: '2.3.1', type: 'choice', year: 2024 }, // 被动语态
  12: { path: '1.4.3', type: 'choice', year: 2024 }, // 非谓语动词（动词短语）
  19: { path: '2.2.5', type: 'choice', year: 2024 }, // 过去进行时
  20: { path: '2.5.2', type: 'choice', year: 2024 }, // 定语从句
  24: { path: '2.5.2', type: 'choice', year: 2024 }, // 定语从句
  27: { path: '1.4.3', type: 'choice', year: 2024 }, // 非谓语动词
  36: { path: '1.4.3', type: 'fill', year: 2024 }, // 非谓语动词
  37: { path: '2.4.3', type: 'fill', year: 2024 }, // 主谓一致（就近原则）
  38: { path: '1.4.3', type: 'fill', year: 2024 }, // 非谓语动词
  39: { path: '2.5.2', type: 'fill', year: 2024 }, // 定语从句
  40: { path: '1.6.1', type: 'fill', year: 2024 }, // 不定冠词
  
  // 2023年真题
  13: { path: '1.5.1', type: 'choice', year: 2023 }, // 时间介词
  14: { path: '1.8.1', type: 'choice', year: 2023 }, // 并列连词
  15: { path: '1.3.3', type: 'choice', year: 2023 }, // 比较级和最高级
  16: { path: '2.5.1', type: 'choice', year: 2023 }, // 宾语从句
  17: { path: '2.5.1', type: 'choice', year: 2023 }, // 宾语从句
  18: { path: '2.2.6', type: 'choice', year: 2023 }, // 现在完成时
  23: { path: '2.2.6', type: 'choice', year: 2023 }, // 现在完成时
  26: { path: '2.3.1', type: 'choice', year: 2023 }, // 被动语态
  41: { path: '2.2.6', type: 'fill', year: 2023 }, // 现在完成时
  42: { path: '1.4.3', type: 'fill', year: 2023 }, // 非谓语动词
  43: { path: '2.5.3', type: 'fill', year: 2023 }, // 状语从句
  44: { path: '2.2.1', type: 'fill', year: 2023 }, // 一般现在时
  45: { path: '1.4.3', type: 'fill', year: 2023 }  // 非谓语动词
};

/**
 * 计算知识点的考频（支持二级和三级路径）
 * @param {string} path - 知识点路径，如 '1.2.2' 或 '1.2'
 * @returns {string} 考频星星，如 '⭐⭐⭐'
 */
function calculateFrequency(path) {
  // 如果是二级路径（如 '1.2'），需要统计所有三级路径（如 '1.2.1', '1.2.2'等）
  let questions = [];
  if (path.split('.').length === 2) {
    // 二级路径：统计所有以该路径开头的三级路径
    const prefix = path + '.';
    questions = Object.values(examQuestionMapping).filter(q => 
      q.path.startsWith(prefix)
    );
  } else {
    // 三级路径：直接匹配
    questions = Object.values(examQuestionMapping).filter(q => q.path === path);
  }
  
  const count = questions.length;
  
  if (count >= 5) return '⭐⭐⭐⭐⭐';
  if (count >= 3) return '⭐⭐⭐⭐';
  if (count >= 2) return '⭐⭐⭐';
  if (count >= 1) return '⭐⭐';
  return '⭐';
}

/**
 * 获取知识点考过的年份（支持二级和三级路径）
 * @param {string} path - 知识点路径
 * @returns {number[]} 年份数组
 */
function getExamYears(path) {
  let questions = [];
  if (path.split('.').length === 2) {
    // 二级路径：统计所有以该路径开头的三级路径
    const prefix = path + '.';
    questions = Object.values(examQuestionMapping).filter(q => 
      q.path.startsWith(prefix)
    );
  } else {
    // 三级路径：直接匹配
    questions = Object.values(examQuestionMapping).filter(q => q.path === path);
  }
  
  const years = [...new Set(questions.map(q => q.year))];
  return years.sort();
}

/**
 * 完整的三级菜单数据结构
 */
const grammarMenuData = [
  {
    id: 'lexical',
    name: '词法',
    level: 1,
    type: 'group', // 仅作为分组标签
    children: [
      {
        id: 'noun',
        name: '名词',
        level: 2,
        level1Id: 'lexical',
        type: 'topic', // 专题模式的选择目标
        examFrequency: calculateFrequency('1.1'),
        examYears: getExamYears('1.1'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'noun_possessive',
            name: '名词所有格',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'noun',
            path: '1.1.1',
            type: 'point', // 自选模式的选择目标
            examFrequency: calculateFrequency('1.1.1'),
            examYears: getExamYears('1.1.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'noun_plural',
            name: '名词的复数',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'noun',
            path: '1.1.2',
            type: 'point',
            examFrequency: calculateFrequency('1.1.2'),
            examYears: getExamYears('1.1.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'pronoun',
        name: '代词',
        level: 2,
        level1Id: 'lexical',
        type: 'topic',
        examFrequency: calculateFrequency('1.2'),
        examYears: getExamYears('1.2'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'pronoun_personal',
            name: '人称代词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'pronoun',
            path: '1.2.1',
            type: 'point',
            examFrequency: calculateFrequency('1.2.1'),
            examYears: getExamYears('1.2.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'pronoun_possessive',
            name: '物主代词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'pronoun',
            path: '1.2.2',
            type: 'point',
            examFrequency: calculateFrequency('1.2.2'),
            examYears: getExamYears('1.2.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'pronoun_reflexive',
            name: '反身代词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'pronoun',
            path: '1.2.3',
            type: 'point',
            examFrequency: calculateFrequency('1.2.3'),
            examYears: getExamYears('1.2.3'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'pronoun_indefinite',
            name: '不定代词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'pronoun',
            path: '1.2.4',
            type: 'point',
            examFrequency: calculateFrequency('1.2.4'),
            examYears: getExamYears('1.2.4'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'adjective_adverb',
        name: '形容词与副词',
        level: 2,
        level1Id: 'lexical',
        type: 'topic',
        examFrequency: calculateFrequency('1.3'),
        examYears: getExamYears('1.3'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'adj_attributive',
            name: '形容词作定语',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'adjective_adverb',
            path: '1.3.1',
            type: 'point',
            examFrequency: calculateFrequency('1.3.1'),
            examYears: getExamYears('1.3.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'adv_basic',
            name: '副词的基本用法',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'adjective_adverb',
            path: '1.3.2',
            type: 'point',
            examFrequency: calculateFrequency('1.3.2'),
            examYears: getExamYears('1.3.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'comparison',
            name: '比较级和最高级',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'adjective_adverb',
            path: '1.3.3',
            type: 'point',
            examFrequency: calculateFrequency('1.3.3'),
            examYears: getExamYears('1.3.3'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'verb',
        name: '动词',
        level: 2,
        level1Id: 'lexical',
        type: 'topic',
        examFrequency: calculateFrequency('1.4'),
        examYears: getExamYears('1.4'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'verb_form',
            name: '动词的形式',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'verb',
            path: '1.4.1',
            type: 'point',
            examFrequency: calculateFrequency('1.4.1'),
            examYears: getExamYears('1.4.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'modal_verb',
            name: '情态动词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'verb',
            path: '1.4.2',
            type: 'point',
            examFrequency: calculateFrequency('1.4.2'),
            examYears: getExamYears('1.4.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'non_finite_verb',
            name: '非谓语动词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'verb',
            path: '1.4.3',
            type: 'point',
            examFrequency: calculateFrequency('1.4.3'),
            examYears: getExamYears('1.4.3'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'preposition',
        name: '介词',
        level: 2,
        level1Id: 'lexical',
        type: 'topic',
        examFrequency: calculateFrequency('1.5'),
        examYears: getExamYears('1.5'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'prep_time',
            name: '时间介词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'preposition',
            path: '1.5.1',
            type: 'point',
            examFrequency: calculateFrequency('1.5.1'),
            examYears: getExamYears('1.5.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'prep_place',
            name: '地点介词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'preposition',
            path: '1.5.2',
            type: 'point',
            examFrequency: calculateFrequency('1.5.2'),
            examYears: getExamYears('1.5.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'prep_other',
            name: '其他介词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'preposition',
            path: '1.5.3',
            type: 'point',
            examFrequency: calculateFrequency('1.5.3'),
            examYears: getExamYears('1.5.3'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'article',
        name: '冠词',
        level: 2,
        level1Id: 'lexical',
        type: 'topic',
        examFrequency: calculateFrequency('1.6'),
        examYears: getExamYears('1.6'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'article_indefinite',
            name: '不定冠词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'article',
            path: '1.6.1',
            type: 'point',
            examFrequency: calculateFrequency('1.6.1'),
            examYears: getExamYears('1.6.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'article_definite',
            name: '定冠词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'article',
            path: '1.6.2',
            type: 'point',
            examFrequency: calculateFrequency('1.6.2'),
            examYears: getExamYears('1.6.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'article_zero',
            name: '零冠词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'article',
            path: '1.6.3',
            type: 'point',
            examFrequency: calculateFrequency('1.6.3'),
            examYears: getExamYears('1.6.3'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'numeral',
        name: '数词',
        level: 2,
        level1Id: 'lexical',
        type: 'topic',
        examFrequency: calculateFrequency('1.7'),
        examYears: getExamYears('1.7'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'numeral_cardinal_ordinal',
            name: '基数词与序数词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'numeral',
            path: '1.7.1',
            type: 'point',
            examFrequency: calculateFrequency('1.7.1'),
            examYears: getExamYears('1.7.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'numeral_application',
            name: '数词的应用',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'numeral',
            path: '1.7.2',
            type: 'point',
            examFrequency: calculateFrequency('1.7.2'),
            examYears: getExamYears('1.7.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'conjunction',
        name: '连词',
        level: 2,
        level1Id: 'lexical',
        type: 'topic',
        examFrequency: calculateFrequency('1.8'),
        examYears: getExamYears('1.8'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'conj_coordinate',
            name: '并列连词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'conjunction',
            path: '1.8.1',
            type: 'point',
            examFrequency: calculateFrequency('1.8.1'),
            examYears: getExamYears('1.8.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'conj_subordinate',
            name: '从属连词',
            level: 3,
            level1Id: 'lexical',
            level2Id: 'conjunction',
            path: '1.8.2',
            type: 'point',
            examFrequency: calculateFrequency('1.8.2'),
            examYears: getExamYears('1.8.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      }
    ]
  },
  {
    id: 'syntactic',
    name: '句法',
    level: 1,
    type: 'group', // 仅作为分组标签
    children: [
      {
        id: 'sentence_structure',
        name: '句子成分与基本句型',
        level: 2,
        level1Id: 'syntactic',
        type: 'topic',
        examFrequency: calculateFrequency('2.1'),
        examYears: getExamYears('2.1'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'svo',
            name: '主谓宾结构',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'sentence_structure',
            path: '2.1.1',
            type: 'point',
            examFrequency: calculateFrequency('2.1.1'),
            examYears: getExamYears('2.1.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'svp',
            name: '主系表结构',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'sentence_structure',
            path: '2.1.2',
            type: 'point',
            examFrequency: calculateFrequency('2.1.2'),
            examYears: getExamYears('2.1.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'tense',
        name: '动词时态',
        level: 2,
        level1Id: 'syntactic',
        type: 'topic',
        examFrequency: calculateFrequency('2.2'),
        examYears: getExamYears('2.2'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'tense_present_simple',
            name: '一般现在时',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'tense',
            path: '2.2.1',
            type: 'point',
            examFrequency: calculateFrequency('2.2.1'),
            examYears: getExamYears('2.2.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'tense_past_simple',
            name: '一般过去时',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'tense',
            path: '2.2.2',
            type: 'point',
            examFrequency: calculateFrequency('2.2.2'),
            examYears: getExamYears('2.2.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'tense_future_simple',
            name: '一般将来时',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'tense',
            path: '2.2.3',
            type: 'point',
            examFrequency: calculateFrequency('2.2.3'),
            examYears: getExamYears('2.2.3'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'tense_present_continuous',
            name: '现在进行时',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'tense',
            path: '2.2.4',
            type: 'point',
            examFrequency: calculateFrequency('2.2.4'),
            examYears: getExamYears('2.2.4'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'tense_past_continuous',
            name: '过去进行时',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'tense',
            path: '2.2.5',
            type: 'point',
            examFrequency: calculateFrequency('2.2.5'),
            examYears: getExamYears('2.2.5'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'tense_present_perfect',
            name: '现在完成时',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'tense',
            path: '2.2.6',
            type: 'point',
            examFrequency: calculateFrequency('2.2.6'),
            examYears: getExamYears('2.2.6'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'tense_past_perfect',
            name: '过去完成时',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'tense',
            path: '2.2.7',
            type: 'point',
            examFrequency: calculateFrequency('2.2.7'),
            examYears: getExamYears('2.2.7'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'passive_voice',
        name: '被动语态',
        level: 2,
        level1Id: 'syntactic',
        type: 'topic',
        examFrequency: calculateFrequency('2.3'),
        examYears: getExamYears('2.3'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'passive_simple',
            name: '一般时态的被动语态',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'passive_voice',
            path: '2.3.1',
            type: 'point',
            examFrequency: calculateFrequency('2.3.1'),
            examYears: getExamYears('2.3.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'passive_perfect',
            name: '完成时态的被动语态',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'passive_voice',
            path: '2.3.2',
            type: 'point',
            examFrequency: calculateFrequency('2.3.2'),
            examYears: getExamYears('2.3.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'subject_verb_agreement',
        name: '主谓一致',
        level: 2,
        level1Id: 'syntactic',
        type: 'topic',
        examFrequency: calculateFrequency('2.4'),
        examYears: getExamYears('2.4'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'agreement_grammatical',
            name: '语法一致原则',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'subject_verb_agreement',
            path: '2.4.1',
            type: 'point',
            examFrequency: calculateFrequency('2.4.1'),
            examYears: getExamYears('2.4.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'agreement_meaning',
            name: '意义一致原则',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'subject_verb_agreement',
            path: '2.4.2',
            type: 'point',
            examFrequency: calculateFrequency('2.4.2'),
            examYears: getExamYears('2.4.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'agreement_proximity',
            name: '就近原则',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'subject_verb_agreement',
            path: '2.4.3',
            type: 'point',
            examFrequency: calculateFrequency('2.4.3'),
            examYears: getExamYears('2.4.3'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'complex_sentence',
        name: '复合句',
        level: 2,
        level1Id: 'syntactic',
        type: 'topic',
        examFrequency: calculateFrequency('2.5'),
        examYears: getExamYears('2.5'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'object_clause',
            name: '宾语从句',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'complex_sentence',
            path: '2.5.1',
            type: 'point',
            examFrequency: calculateFrequency('2.5.1'),
            examYears: getExamYears('2.5.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'attributive_clause',
            name: '定语从句',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'complex_sentence',
            path: '2.5.2',
            type: 'point',
            examFrequency: calculateFrequency('2.5.2'),
            examYears: getExamYears('2.5.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'adverbial_clause',
            name: '状语从句',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'complex_sentence',
            path: '2.5.3',
            type: 'point',
            examFrequency: calculateFrequency('2.5.3'),
            examYears: getExamYears('2.5.3'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      },
      {
        id: 'special_sentence',
        name: '特殊句式',
        level: 2,
        level1Id: 'syntactic',
        type: 'topic',
        examFrequency: calculateFrequency('2.6'),
        examYears: getExamYears('2.6'),
        examRegion: '云南',
        questionCount: { choice: 20, fill: 20 },
        children: [
          {
            id: 'there_be',
            name: 'There be 句型',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'special_sentence',
            path: '2.6.1',
            type: 'point',
            examFrequency: calculateFrequency('2.6.1'),
            examYears: getExamYears('2.6.1'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'exclamatory',
            name: '感叹句',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'special_sentence',
            path: '2.6.2',
            type: 'point',
            examFrequency: calculateFrequency('2.6.2'),
            examYears: getExamYears('2.6.2'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'imperative',
            name: '祈使句',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'special_sentence',
            path: '2.6.3',
            type: 'point',
            examFrequency: calculateFrequency('2.6.3'),
            examYears: getExamYears('2.6.3'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          },
          {
            id: 'inversion',
            name: '倒装句',
            level: 3,
            level1Id: 'syntactic',
            level2Id: 'special_sentence',
            path: '2.6.4',
            type: 'point',
            examFrequency: calculateFrequency('2.6.4'),
            examYears: getExamYears('2.6.4'),
            examRegion: '云南',
            questionCount: { choice: 10, fill: 10 }
          }
        ]
      }
    ]
  }
];

/**
 * 获取所有二级菜单（专题模式的选择目标）
 */
function getAllLevel2Topics() {
  const topics = [];
  grammarMenuData.forEach(level1 => {
    if (level1.children) {
      level1.children.forEach(level2 => {
        topics.push({
          ...level2,
          level1Name: level1.name
        });
      });
    }
  });
  return topics;
}

/**
 * 获取所有三级菜单（自选模式的选择目标）
 */
function getAllLevel3Points() {
  const points = [];
  grammarMenuData.forEach(level1 => {
    if (level1.children) {
      level1.children.forEach(level2 => {
        if (level2.children) {
          level2.children.forEach(level3 => {
            points.push({
              ...level3,
              level1Name: level1.name,
              level2Name: level2.name
            });
          });
        }
      });
    }
  });
  return points;
}

/**
 * 根据年份获取考过的知识点
 */
function getPointsByYear(year) {
  return getAllLevel3Points().filter(point => 
    point.examYears && point.examYears.includes(year)
  );
}

module.exports = {
  grammarMenuData,
  examQuestionMapping,
  getAllLevel2Topics,
  getAllLevel3Points,
  getPointsByYear,
  calculateFrequency,
  getExamYears
};




