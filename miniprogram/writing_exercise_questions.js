// 书写规范表格考点抽取填空题
// 每个表格抽取三个不同的考点，格式为"XX的XX是______"

const writingExerciseQuestions = {
  // 代词书写表格考点抽取
  pronoun_001: [
    {
      id: "pronoun_001_1",
      question: "我的主格是______",
      answer: "I",
      category: "代词书写",
      subCategory: "人称代词",
      table_id: "pronoun_001",
      analysis: "第一人称单数的主格形式是I"
    },
    {
      id: "pronoun_001_2", 
      question: "她的宾格是______",
      answer: "her",
      category: "代词书写",
      subCategory: "人称代词",
      table_id: "pronoun_001",
      analysis: "第三人称单数女性的宾格形式是her"
    },
    {
      id: "pronoun_001_3",
      question: "他们的形容词性物主代词是______",
      answer: "their",
      category: "代词书写", 
      subCategory: "物主代词",
      table_id: "pronoun_001",
      analysis: "第三人称复数的形容词性物主代词是their"
    }
  ],

  pronoun_002: [
    {
      id: "pronoun_002_1",
      question: "我们的人称代词(主格)是______",
      answer: "we",
      category: "代词书写",
      subCategory: "人称代词",
      table_id: "pronoun_002",
      analysis: "第一人称复数的主格形式是we"
    },
    {
      id: "pronoun_002_2",
      question: "它的人称代词(宾格)是______",
      answer: "it",
      category: "代词书写",
      subCategory: "人称代词", 
      table_id: "pronoun_002",
      analysis: "第三人称单数中性(动物/物体)的宾格形式是it"
    },
    {
      id: "pronoun_002_3",
      question: "你们的名词性物主代词是______",
      answer: "yours",
      category: "代词书写",
      subCategory: "物主代词",
      table_id: "pronoun_002",
      analysis: "第二人称复数的名词性物主代词是yours"
    }
  ],

  // 名词变复数表格考点抽取
  noun_001: [
    {
      id: "noun_001_1",
      question: "happiness, kindness, darkness的名词后缀是______",
      answer: "-ness",
      category: "名词变复数",
      subCategory: "名词后缀识别",
      table_id: "noun_001",
      analysis: "这些抽象名词都以-ness结尾，表示性质或状态"
    },
    {
      id: "noun_001_2",
      question: "development, agreement, improvement的名词后缀是______",
      answer: "-ment",
      category: "名词变复数",
      subCategory: "名词后缀识别",
      table_id: "noun_001",
      analysis: "这些名词都以-ment结尾，表示行为或结果"
    },
    {
      id: "noun_001_3",
      question: "worker, teacher, painter的名词后缀是______",
      answer: "-er",
      category: "名词变复数",
      subCategory: "名词后缀识别",
      table_id: "noun_001",
      analysis: "这些表示职业的名词都以-er结尾，表示从事某种工作的人"
    }
  ],

  noun_002: [
    {
      id: "noun_002_1",
      question: "happiness, happy, happen, happily中名词后缀结尾的是______",
      answer: "happiness",
      category: "名词变复数",
      subCategory: "名词后缀识别",
      table_id: "noun_002",
      analysis: "happiness以-ness结尾，是抽象名词后缀"
    },
    {
      id: "noun_002_2",
      question: "warm, warmth, warn, warmer中名词后缀结尾的是______",
      answer: "warmth",
      category: "名词变复数",
      subCategory: "名词后缀识别",
      table_id: "noun_002",
      analysis: "warmth以-th结尾，是抽象名词后缀"
    },
    {
      id: "noun_002_3",
      question: "work, worked, working, worker中名词后缀结尾的是______",
      answer: "worker",
      category: "名词变复数",
      subCategory: "名词后缀识别",
      table_id: "noun_002",
      analysis: "worker以-er结尾，表示从事某种工作的人"
    }
  ],

  noun_003: [
    {
      id: "noun_003_1",
      question: "在happiness, happy, happen, happily中，以名词后缀结尾的是______",
      answer: "happiness",
      category: "名词变复数",
      subCategory: "名词后缀识别",
      table_id: "noun_003",
      analysis: "happiness以-ness结尾，是抽象名词后缀"
    },
    {
      id: "noun_003_2",
      question: "在warmth, warm, warn, warmer中，以名词后缀结尾的是______",
      answer: "warmth",
      category: "名词变复数",
      subCategory: "名词后缀识别",
      table_id: "noun_003",
      analysis: "warmth以-th结尾，是抽象名词后缀"
    },
    {
      id: "noun_003_3",
      question: "在development, develop, developed, developer中，以名词后缀结尾的是______",
      answer: "development",
      category: "名词变复数",
      subCategory: "名词后缀识别",
      table_id: "noun_003",
      analysis: "development以-ment结尾，表示行为或结果"
    }
  ],

  noun_004: [
    {
      id: "noun_004_1",
      question: "book的复数形式是______",
      answer: "books",
      category: "名词变复数",
      subCategory: "规则变复数",
      table_id: "noun_004",
      analysis: "以辅音字母+o结尾的名词，直接加s变复数"
    },
    {
      id: "noun_004_2",
      question: "city的复数形式是______",
      answer: "cities",
      category: "名词变复数",
      subCategory: "规则变复数",
      table_id: "noun_004",
      analysis: "以辅音字母+y结尾的名词，变y为i再加es"
    },
    {
      id: "noun_004_3",
      question: "knife的复数形式是______",
      answer: "knives",
      category: "名词变复数",
      subCategory: "规则变复数",
      table_id: "noun_004",
      analysis: "以f或fe结尾的名词，变f为v再加es"
    }
  ],

  // 动词分词书写表格考点抽取
  present_participle_001: [
    {
      id: "present_participle_001_1",
      question: "work的现在分词是______",
      answer: "working",
      category: "动词分词书写",
      subCategory: "现在分词",
      table_id: "present_participle_001",
      analysis: "一般动词直接加-ing构成现在分词"
    },
    {
      id: "present_participle_001_2",
      question: "write的现在分词是______",
      answer: "writing",
      category: "动词分词书写",
      subCategory: "现在分词",
      table_id: "present_participle_001",
      analysis: "以e结尾的动词，去e加-ing构成现在分词"
    },
    {
      id: "present_participle_001_3",
      question: "run的现在分词是______",
      answer: "running",
      category: "动词分词书写",
      subCategory: "现在分词",
      table_id: "present_participle_001",
      analysis: "以重读闭音节结尾且末尾只有一个辅音字母的动词，双写末尾辅音字母再加-ing"
    }
  ],

  past_participle_001: [
    {
      id: "past_participle_001_1",
      question: "work的过去分词是______",
      answer: "worked",
      category: "动词分词书写",
      subCategory: "过去分词",
      table_id: "past_participle_001",
      analysis: "一般动词直接加-ed构成过去分词"
    },
    {
      id: "past_participle_001_2",
      question: "like的过去分词是______",
      answer: "liked",
      category: "动词分词书写",
      subCategory: "过去分词",
      table_id: "past_participle_001",
      analysis: "以e结尾的动词，直接加-d构成过去分词"
    },
    {
      id: "past_participle_001_3",
      question: "study的过去分词是______",
      answer: "studied",
      category: "动词分词书写",
      subCategory: "过去分词",
      table_id: "past_participle_001",
      analysis: "以辅音字母+y结尾的动词，变y为i再加-ed"
    }
  ],

  // 时态书写表格考点抽取
  tense_writing_001: [
    {
      id: "tense_writing_001_1",
      question: "do的第三人称单数形式是______",
      answer: "does",
      category: "时态书写",
      subCategory: "一般现在时",
      table_id: "tense_writing_001",
      analysis: "一般现在时中，第三人称单数动词要加s或es"
    },
    {
      id: "tense_writing_001_2",
      question: "work的过去式是______",
      answer: "worked",
      category: "时态书写",
      subCategory: "一般过去时",
      table_id: "tense_writing_001",
      analysis: "一般过去时中，动词要用过去式形式"
    },
    {
      id: "tense_writing_001_3",
      question: "study的现在分词是______",
      answer: "studying",
      category: "时态书写",
      subCategory: "现在进行时",
      table_id: "tense_writing_001",
      analysis: "现在进行时中，动词要用现在分词(-ing)形式"
    }
  ],

  // 语态书写表格考点抽取
  voice_writing_001: [
    {
      id: "voice_writing_001_1",
      question: "loves（一般现在时第三人称单数）的被动语态是______",
      answer: "is loved",
      category: "语态书写",
      subCategory: "被动语态",
      table_id: "voice_writing_001",
      analysis: "被动语态结构：主语+be动词+过去分词+by+动作执行者"
    },
    {
      id: "voice_writing_001_2",
      question: "builds（一般现在时第三人称单数）的被动语态是______",
      answer: "is built",
      category: "语态书写",
      subCategory: "被动语态",
      table_id: "voice_writing_001",
      analysis: "复数主语的被动语态用are+过去分词"
    },
    {
      id: "voice_writing_001_3",
      question: "teaches（一般现在时第三人称单数）的被动语态是______",
      answer: "is taught",
      category: "语态书写",
      subCategory: "被动语态",
      table_id: "voice_writing_001",
      analysis: "第三人称单数主语的被动语态用is+过去分词"
    }
  ],

  voice_writing_002: [
    {
      id: "voice_writing_002_1",
      question: "wrote（一般过去时）的被动语态是______",
      answer: "was written/were written",
      category: "语态书写",
      subCategory: "被动语态",
      table_id: "voice_writing_002",
      analysis: "一般过去时的被动语态用was/were+过去分词"
    },
    {
      id: "voice_writing_002_2",
      question: "made（一般过去时）的被动语态是______",
      answer: "was made/ were made",
      category: "语态书写",
      subCategory: "被动语态",
      table_id: "voice_writing_002",
      analysis: "复数主语的过去被动语态用were+过去分词"
    },
    {
      id: "voice_writing_002_3",
      question: "broke（一般过去时）的被动语态是______",
      answer: "was broken/were broken",
      category: "语态书写",
      subCategory: "被动语态",
      table_id: "voice_writing_002",
      analysis: "第三人称单数主语的过去被动语态用was+过去分词"
    }
  ],

  voice_writing_003: [
    {
      id: "voice_writing_003_1",
      question: "will write（一般将来时）的被动语态是______",
      answer: "will be written",
      category: "语态书写",
      subCategory: "被动语态",
      table_id: "voice_writing_003",
      analysis: "一般将来时的被动语态用will be+过去分词"
    },
    {
      id: "voice_writing_003_2",
      question: "will build（一般将来时）的被动语态是______",
      answer: "will be built",
      category: "语态书写",
      subCategory: "被动语态",
      table_id: "voice_writing_003",
      analysis: "一般将来时的被动语态结构：主语+will be+过去分词+by+动作执行者"
    },
    {
      id: "voice_writing_003_3",
      question: "will teach（一般将来时）的被动语态是______",
      answer: "will be taught",
      category: "语态书写",
      subCategory: "被动语态",
      table_id: "voice_writing_003",
      analysis: "一般将来时的被动语态中，所有主语都用will be+过去分词"
    }
  ],

  // 比较级最高级表格考点抽取
  comparison_prefix_suffix_001: [
    {
      id: "comparison_prefix_suffix_001_1",
      question: "unhappy的形容词前缀是______",
      answer: "un-",
      category: "比较级最高级书写",
      subCategory: "形容词前后缀识别",
      table_id: "comparison_prefix_suffix_001",
      analysis: "un-是表示否定的前缀，unhappy表示不快乐的"
    },
    {
      id: "comparison_prefix_suffix_001_2",
      question: "impossible的形容词前缀是______",
      answer: "im-",
      category: "比较级最高级书写",
      subCategory: "形容词前后缀识别",
      table_id: "comparison_prefix_suffix_001",
      analysis: "im-是表示否定的前缀，impossible表示不可能的"
    },
    {
      id: "comparison_prefix_suffix_001_3",
      question: "beautiful的形容词后缀是______",
      answer: "-ful",
      category: "比较级最高级书写",
      subCategory: "形容词前后缀识别",
      table_id: "comparison_prefix_suffix_001",
      analysis: "-ful是表示充满某种特性的后缀，beautiful表示美丽的"
    }
  ],

  comparison_comparative_001: [
    {
      id: "comparison_comparative_001_1",
      question: "big的比较级是______",
      answer: "bigger",
      category: "比较级最高级书写",
      subCategory: "比较级书写",
      table_id: "comparison_comparative_001",
      analysis: "以重读闭音节结尾且末尾只有一个辅音字母的形容词，双写末尾辅音字母再加-er"
    },
    {
      id: "comparison_comparative_001_2",
      question: "happy的比较级是______",
      answer: "happier",
      category: "比较级最高级书写",
      subCategory: "比较级书写",
      table_id: "comparison_comparative_001",
      analysis: "以辅音字母+y结尾的形容词，变y为i再加-er"
    },
    {
      id: "comparison_comparative_001_3",
      question: "beautiful的比较级是______",
      answer: "more beautiful",
      category: "比较级最高级书写",
      subCategory: "比较级书写",
      table_id: "comparison_comparative_001",
      analysis: "多音节形容词的比较级用more+形容词原级"
    }
  ],

  comparison_superlative_001: [
    {
      id: "comparison_superlative_001_1",
      question: "big的最高级是______",
      answer: "biggest",
      category: "比较级最高级书写",
      subCategory: "最高级书写",
      table_id: "comparison_superlative_001",
      analysis: "以重读闭音节结尾且末尾只有一个辅音字母的形容词，双写末尾辅音字母再加-est"
    },
    {
      id: "comparison_superlative_001_2",
      question: "happy的最高级是______",
      answer: "happiest",
      category: "比较级最高级书写",
      subCategory: "最高级书写",
      table_id: "comparison_superlative_001",
      analysis: "以辅音字母+y结尾的形容词，变y为i再加-est"
    },
    {
      id: "comparison_superlative_001_3",
      question: "beautiful的最高级是______",
      answer: "most beautiful",
      category: "比较级最高级书写",
      subCategory: "最高级书写",
      table_id: "comparison_superlative_001",
      analysis: "多音节形容词的最高级用most+形容词原级"
    }
  ],

  // 形容词变副词表格考点抽取
  adverb_writing_001: [
    {
      id: "adverb_writing_001_1",
      question: "quick的副词是______",
      answer: "quickly",
      category: "形容词变副词书写",
      subCategory: "形容词变副词",
      table_id: "adverb_writing_001",
      analysis: "以辅音字母+y结尾的形容词，变y为i再加-ly构成副词"
    },
    {
      id: "adverb_writing_001_2",
      question: "happy的副词是______",
      answer: "happily",
      category: "形容词变副词书写",
      subCategory: "形容词变副词",
      table_id: "adverb_writing_001",
      analysis: "以辅音字母+y结尾的形容词，变y为i再加-ly构成副词"
    },
    {
      id: "adverb_writing_001_3",
      question: "beautiful的副词是______",
      answer: "beautifully",
      category: "形容词变副词书写",
      subCategory: "形容词变副词",
      table_id: "adverb_writing_001",
      analysis: "以-ful结尾的形容词，直接加-ly构成副词"
    }
  ]
};

// 导出数据
module.exports = {
  writingExerciseQuestions
};

// 如果是在浏览器环境中使用
if (typeof window !== 'undefined') {
  window.writingExerciseQuestions = writingExerciseQuestions;
}
