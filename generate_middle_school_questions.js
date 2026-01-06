/**
 * 为初中模块自选20题模式生成题目
 * 每个三级知识点生成2个选择题和1个填空题
 */

const grammarData = require('./miniprogram/config/middle-school-grammar-data.js');

// 根据真题数据统计考频（合并2023-2025年数据）
const examFrequencyMap = {
  // 物主代词：2025(2次), 2023(1次) = 3次
  '1.2.2': { years: [2023, 2025], count: 3 },
  // 情态动词：2025(3次)
  '1.4.2': { years: [2025], count: 3 },
  // 地点介词：2025(1次)
  '1.5.2': { years: [2025], count: 1 },
  // 其他介词：2025(1次)
  '1.5.3': { years: [2025], count: 1 },
  // 并列连词：2025(1次), 2023(1次) = 2次
  '1.8.1': { years: [2023, 2025], count: 2 },
  // 比较级和最高级：2025(1次), 2023(1次) = 2次
  '1.3.3': { years: [2023, 2025], count: 2 },
  // 现在完成时：2025(1次), 2023(2次) = 3次
  '2.2.6': { years: [2023, 2025], count: 3 },
  // 一般时态的被动语态：2025(1次), 2024(1次), 2023(1次) = 3次
  '2.3.1': { years: [2023, 2024, 2025], count: 3 },
  // 宾语从句：2025(1次), 2024(1次), 2023(2次) = 4次
  '2.5.1': { years: [2023, 2024, 2025], count: 4 },
  // 感叹句：2025(1次), 2024(1次) = 2次
  '2.6.2': { years: [2024, 2025], count: 2 },
  // 基数词与序数词：2025(1次)
  '1.7.1': { years: [2025], count: 1 },
  // 人称代词：2025(1次)
  '1.2.1': { years: [2025], count: 1 },
  // 形容词作定语：2025(1次), 2023(1次) = 2次
  '1.3.1': { years: [2023, 2025], count: 2 },
  // 副词的基本用法：2025(1次), 2023(1次) = 2次
  '1.3.2': { years: [2023, 2025], count: 2 },
  // 名词的复数：2025(1次), 2023(1次) = 2次
  '1.1.2': { years: [2023, 2025], count: 2 },
  // 反身代词：2024(1次)
  '1.2.3': { years: [2024], count: 1 },
  // 时间介词：2024(1次), 2023(1次) = 2次
  '1.5.1': { years: [2023, 2024], count: 2 },
  // 过去进行时：2024(2次)
  '2.2.5': { years: [2024], count: 2 },
  // 非谓语动词：2024(3次), 2023(2次) = 5次
  '1.4.3': { years: [2023, 2024], count: 5 },
  // 定语从句：2024(3次), 2025(1次) = 4次
  '2.5.2': { years: [2024, 2025], count: 4 },
  // 名词所有格：2024(1次)
  '1.1.1': { years: [2024], count: 1 },
  // 就近原则：2024(1次)
  '2.4.3': { years: [2024], count: 1 },
  // 不定冠词：2024(1次)
  '1.6.1': { years: [2024], count: 1 },
  // 一般现在时：2023(1次)
  '2.2.1': { years: [2023], count: 1 },
  // 状语从句：2023(1次), 2025(1次) = 2次
  '2.5.3': { years: [2023, 2025], count: 2 },
  // 数词的应用：2023(1次)
  '1.7.2': { years: [2023], count: 1 }
};

// 计算考频星星
function getExamFrequency(path) {
  const data = examFrequencyMap[path];
  if (!data) return '⭐';
  
  const count = data.count;
  
  if (count >= 5) return '⭐⭐⭐⭐⭐';
  if (count >= 3) return '⭐⭐⭐⭐';
  if (count >= 2) return '⭐⭐⭐';
  if (count >= 1) return '⭐⭐';
  return '⭐';
}

// 获取考过的年份
function getExamYears(path) {
  const data = examFrequencyMap[path];
  if (!data) return [];
  return data.years || [];
}

// 题目生成模板
const questionTemplates = {
  // 词法部分
  '名词所有格': {
    choice: [
      {
        text: "This is ________ book. It's not mine.",
        options: ["A. Tom", "B. Tom's", "C. Toms", "D. Toms'"],
        answer: "B",
        analysis: "本题考查名词所有格的用法。表示'汤姆的书'，需要在名词后加's，即Tom's。"
      },
      {
        text: "The ________ room is very clean and tidy.",
        options: ["A. children", "B. childrens", "C. children's", "D. childrens'"],
        answer: "C",
        analysis: "本题考查复数名词的所有格。children是复数形式，其所有格是children's。"
      }
    ],
    fill: {
      text: "This is my ________ (friend) birthday party.",
      answer: "friend's",
      analysis: "本题考查名词所有格的用法。表示'我朋友的生日聚会'，friend后需要加's构成所有格。"
    }
  },
  
  '名词的复数': {
    choice: [
      {
        text: "There are many ________ in the park.",
        options: ["A. child", "B. childs", "C. children", "D. childrens"],
        answer: "C",
        analysis: "本题考查名词的复数形式。child的复数形式是不规则变化children，不是childs。"
      },
      {
        text: "I bought three ________ at the market.",
        options: ["A. tomato", "B. tomatos", "C. tomatoes", "D. tomato's"],
        answer: "C",
        analysis: "本题考查以o结尾的名词复数。tomato的复数形式是tomatoes，需要加es。"
      }
    ],
    fill: {
      text: "We need more ________ (visitor) to help with the event.",
      answer: "visitors",
      analysis: "本题考查名词的复数形式。visitor是可数名词，many后需要接复数形式visitors。"
    }
  },
  
  '人称代词': {
    choice: [
      {
        text: "My teacher asked ________ to finish the homework on time.",
        options: ["A. I", "B. me", "C. my", "D. mine"],
        answer: "B",
        analysis: "本题考查人称代词的宾格用法。ask是及物动词，后接宾语，需用人称代词宾格me。"
      },
      {
        text: "________ are good friends and often play together.",
        options: ["A. We", "B. Us", "C. Our", "D. Ours"],
        answer: "A",
        analysis: "本题考查人称代词主格的用法。句子缺少主语，需用人称代词主格We。"
      }
    ],
    fill: {
      text: "Please give ________ (we) some time to think about it.",
      answer: "us",
      analysis: "本题考查人称代词宾格的用法。give是及物动词，后接间接宾语，需用人称代词宾格us。"
    }
  },
  
  '物主代词': {
    choice: [
      {
        text: "This is not my book. It's ________.",
        options: ["A. her", "B. hers", "C. she", "D. she's"],
        answer: "B",
        analysis: "本题考查名词性物主代词的用法。hers是名词性物主代词，相当于her book，可以单独使用。"
      },
      {
        text: "The red bike is ________. The blue one is mine.",
        options: ["A. your", "B. yours", "C. you", "D. you're"],
        answer: "B",
        analysis: "本题考查名词性物主代词的用法。yours相当于your bike，可以单独作表语。"
      }
    ],
    fill: {
      text: "This bag is ________ (she). Please give it to her.",
      answer: "hers",
      analysis: "本题考查名词性物主代词的用法。hers是名词性物主代词，相当于her bag，可以单独使用。"
    }
  },
  
  '反身代词': {
    choice: [
      {
        text: "You should take care of ________ when you are alone.",
        options: ["A. you", "B. your", "C. yourself", "D. yours"],
        answer: "C",
        analysis: "本题考查反身代词的用法。take care of oneself表示'照顾自己'，需用反身代词yourself。"
      },
      {
        text: "The children enjoyed ________ at the party.",
        options: ["A. them", "B. their", "C. themselves", "D. theirs"],
        answer: "C",
        analysis: "本题考查反身代词的用法。enjoy oneself表示'玩得开心'，需用反身代词themselves。"
      }
    ],
    fill: {
      text: "He taught ________ (he) English by watching movies.",
      answer: "himself",
      analysis: "本题考查反身代词的用法。teach oneself表示'自学'，需用反身代词himself。"
    }
  },
  
  '不定代词': {
    choice: [
      {
        text: "There is ________ wrong with my computer. It doesn't work.",
        options: ["A. something", "B. anything", "C. nothing", "D. everything"],
        answer: "A",
        analysis: "本题考查不定代词的用法。something wrong表示'有问题'，用于肯定句。"
      },
      {
        text: "Would you like ________ to drink?",
        options: ["A. something", "B. anything", "C. nothing", "D. everything"],
        answer: "A",
        analysis: "本题考查不定代词的用法。在表示建议或请求的疑问句中，通常用something。"
      }
    ],
    fill: {
      text: "There is ________ (some) important in today's newspaper.",
      answer: "something",
      analysis: "本题考查不定代词的用法。something important表示'重要的事情'，用于肯定句。"
    }
  },
  
  '形容词作定语': {
    choice: [
      {
        text: "The weather is ________ today. Let's go for a walk.",
        options: ["A. wind", "B. windy", "C. windily", "D. winding"],
        answer: "B",
        analysis: "本题考查形容词作表语的用法。is后需接形容词作表语，windy表示'有风的'。"
      },
      {
        text: "This is an ________ story. I want to read it again.",
        options: ["A. interest", "B. interested", "C. interesting", "D. interestingly"],
        answer: "C",
        analysis: "本题考查形容词作定语的用法。interesting修饰名词story，表示'有趣的'。"
      }
    ],
    fill: {
      text: "The food tastes ________ (wonder). We all like it.",
      answer: "wonderful",
      analysis: "本题考查形容词作表语的用法。taste是系动词，后接形容词作表语，wonderful表示'美味的'。"
    }
  },
  
  '副词的基本用法': {
    choice: [
      {
        text: "You should think ________ before making a decision.",
        options: ["A. careful", "B. carefully", "C. care", "D. caring"],
        answer: "B",
        analysis: "本题考查副词的用法。think是动词，需用副词carefully修饰，表示'仔细地思考'。"
      },
      {
        text: "She speaks English very ________.",
        options: ["A. good", "B. well", "C. better", "D. best"],
        answer: "B",
        analysis: "本题考查副词的用法。speak是动词，需用副词well修饰，表示'说得好'。"
      }
    ],
    fill: {
      text: "Please listen to the teacher ________ (careful) in class.",
      answer: "carefully",
      analysis: "本题考查副词的用法。listen是动词，需用副词carefully修饰，表示'仔细地听'。"
    }
  },
  
  '比较级和最高级': {
    choice: [
      {
        text: "This book is ________ than that one.",
        options: ["A. interesting", "B. more interesting", "C. most interesting", "D. the most interesting"],
        answer: "B",
        analysis: "本题考查形容词比较级的用法。than表示两者比较，需用比较级more interesting。"
      },
      {
        text: "Mount Qomolangma is ________ mountain in the world.",
        options: ["A. high", "B. higher", "C. highest", "D. the highest"],
        answer: "D",
        analysis: "本题考查形容词最高级的用法。in the world表示范围，需用最高级the highest。"
      }
    ],
    fill: {
      text: "This is the ________ (old) building in our city.",
      answer: "oldest",
      analysis: "本题考查形容词最高级的用法。in our city表示范围，需用最高级oldest，前面加the。"
    }
  },
  
  '动词的形式': {
    choice: [
      {
        text: "Please ________ the lights when you leave the room.",
        options: ["A. turn on", "B. turn off", "C. turn up", "D. turn down"],
        answer: "B",
        analysis: "本题考查动词短语的用法。turn off表示'关闭'，符合语境'离开房间时关灯'。"
      },
      {
        text: "I need to ________ this math problem.",
        options: ["A. work on", "B. work out", "C. work at", "D. work for"],
        answer: "B",
        analysis: "本题考查动词短语的用法。work out表示'解决'，符合语境'解决数学题'。"
      }
    ],
    fill: {
      text: "Don't forget to ________ (turn) off the TV before you go to bed.",
      answer: "turn",
      analysis: "本题考查动词短语的用法。turn off是固定搭配，表示'关闭'。"
    }
  },
  
  '情态动词': {
    choice: [
      {
        text: "—Can you play the piano? —Yes, I ________.",
        options: ["A. can", "B. can't", "C. must", "D. mustn't"],
        answer: "A",
        analysis: "本题考查情态动词can表示能力的用法。can表示'能够'，用于回答can引导的疑问句。"
      },
      {
        text: "You ________ be careful when crossing the street.",
        options: ["A. can", "B. may", "C. must", "D. might"],
        answer: "C",
        analysis: "本题考查情态动词must表示必须的用法。must表示'必须'，强调必要性。"
      }
    ],
    fill: {
      text: "Students ________ (can) use mobile phones in class.",
      answer: "can't",
      analysis: "本题考查情态动词can的否定形式。can't表示'不能'，表示禁止。"
    }
  },
  
  '非谓语动词': {
    choice: [
      {
        text: "I want ________ English well.",
        options: ["A. learn", "B. to learn", "C. learning", "D. learned"],
        answer: "B",
        analysis: "本题考查非谓语动词的用法。want后接不定式to do作宾语，表示'想要做某事'。"
      },
      {
        text: "She is interested in ________ stamps.",
        options: ["A. collect", "B. to collect", "C. collecting", "D. collected"],
        answer: "C",
        analysis: "本题考查非谓语动词的用法。be interested in后接动名词doing作宾语，表示'对做某事感兴趣'。"
      }
    ],
    fill: {
      text: "My hobby is ________ (read) books in my free time.",
      answer: "reading",
      analysis: "本题考查非谓语动词的用法。动名词reading作表语，表示'阅读'这一活动。"
    }
  },
  
  '时间介词': {
    choice: [
      {
        text: "We usually have breakfast ________ 7 o'clock in the morning.",
        options: ["A. in", "B. on", "C. at", "D. for"],
        answer: "C",
        analysis: "本题考查时间介词的用法。at用于具体的钟点时间，如at 7 o'clock。"
      },
      {
        text: "The meeting will be held ________ April 24th.",
        options: ["A. in", "B. on", "C. at", "D. for"],
        answer: "B",
        analysis: "本题考查时间介词的用法。on用于具体的日期，如on April 24th。"
      }
    ],
    fill: {
      text: "We have English class ________ (在) Monday morning.",
      answer: "on",
      analysis: "本题考查时间介词的用法。on用于表示星期几或具体某天的上午/下午/晚上。"
    }
  },
  
  '地点介词': {
    choice: [
      {
        text: "The library is ________ the school. It's very convenient.",
        options: ["A. in", "B. on", "C. at", "D. to"],
        answer: "A",
        analysis: "本题考查地点介词的用法。in表示'在...里面'，the library is in the school表示'图书馆在学校里'。"
      },
      {
        text: "Put the book ________ the desk, please.",
        options: ["A. in", "B. on", "C. at", "D. to"],
        answer: "B",
        analysis: "本题考查地点介词的用法。on表示'在...上面'，put...on表示'把...放在...上面'。"
      }
    ],
    fill: {
      text: "The cat is hiding ________ (在...下面) the table.",
      answer: "under",
      analysis: "本题考查地点介词的用法。under表示'在...下面'。"
    }
  },
  
  '其他介词': {
    choice: [
      {
        text: "I go to school ________ bus every day.",
        options: ["A. in", "B. on", "C. by", "D. with"],
        answer: "C",
        analysis: "本题考查表示交通方式的介词。by bus表示'乘公交车'，是固定搭配。"
      },
      {
        text: "She came to the party ________ her friend.",
        options: ["A. in", "B. on", "C. by", "D. with"],
        answer: "D",
        analysis: "本题考查介词的用法。with表示'和...一起'，符合语境。"
      }
    ],
    fill: {
      text: "We traveled to Beijing ________ (乘) train last summer.",
      answer: "by",
      analysis: "本题考查表示交通方式的介词。by train表示'乘火车'，是固定搭配。"
    }
  },
  
  '不定冠词': {
    choice: [
      {
        text: "I need ________ hour to finish my homework.",
        options: ["A. a", "B. an", "C. the", "D. /"],
        answer: "B",
        analysis: "本题考查不定冠词的用法。hour以元音音素开头，需用an。"
      },
      {
        text: "There is ________ apple on the table.",
        options: ["A. a", "B. an", "C. the", "D. /"],
        answer: "B",
        analysis: "本题考查不定冠词的用法。apple以元音音素开头，需用an。"
      }
    ],
    fill: {
      text: "This is ________ (a) useful book for students.",
      answer: "a",
      analysis: "本题考查不定冠词的用法。useful以辅音音素开头，需用a。"
    }
  },
  
  '定冠词': {
    choice: [
      {
        text: "________ sun rises in the east.",
        options: ["A. A", "B. An", "C. The", "D. /"],
        answer: "C",
        analysis: "本题考查定冠词的用法。the用于表示世界上独一无二的事物，如the sun。"
      },
      {
        text: "I like playing ________ piano in my free time.",
        options: ["A. a", "B. an", "C. the", "D. /"],
        answer: "C",
        analysis: "本题考查定冠词的用法。the用于表示乐器的名称，如play the piano。"
      }
    ],
    fill: {
      text: "________ (the) earth goes around the sun.",
      answer: "The",
      analysis: "本题考查定冠词的用法。the用于表示世界上独一无二的事物，如the earth。"
    }
  },
  
  '零冠词': {
    choice: [
      {
        text: "We have ________ lunch at 12 o'clock.",
        options: ["A. a", "B. an", "C. the", "D. /"],
        answer: "D",
        analysis: "本题考查零冠词的用法。have lunch是固定搭配，表示'吃午饭'，不需要冠词。"
      },
      {
        text: "She goes to ________ school by bike every day.",
        options: ["A. a", "B. an", "C. the", "D. /"],
        answer: "D",
        analysis: "本题考查零冠词的用法。go to school表示'去上学'，是固定搭配，不需要冠词。"
      }
    ],
    fill: {
      text: "We usually play ________ (/) basketball after school.",
      answer: "",
      analysis: "本题考查零冠词的用法。play basketball是固定搭配，表示'打篮球'，不需要冠词。"
    }
  },
  
  '基数词与序数词': {
    choice: [
      {
        text: "Today is the ________ Saturday of this month.",
        options: ["A. two", "B. second", "C. twice", "D. second's"],
        answer: "B",
        analysis: "本题考查序数词的用法。the second Saturday表示'第二个星期六'，需用序数词second。"
      },
      {
        text: "There are ________ students in our class.",
        options: ["A. twenty", "B. twentieth", "C. twenties", "D. twenty's"],
        answer: "A",
        analysis: "本题考查基数词的用法。表示数量，需用基数词twenty。"
      }
    ],
    fill: {
      text: "This is my ________ (one) time to visit Beijing.",
      answer: "first",
      analysis: "本题考查序数词的用法。the first time表示'第一次'，需用序数词first。"
    }
  },
  
  '数词的应用': {
    choice: [
      {
        text: "I go to the library ________ a week.",
        options: ["A. one", "B. once", "C. first", "D. ones"],
        answer: "B",
        analysis: "本题考查数词的应用。once a week表示'一周一次'，once表示'一次'。"
      },
      {
        text: "The book costs ________ dollars.",
        options: ["A. ten", "B. tenth", "C. tens", "D. ten's"],
        answer: "A",
        analysis: "本题考查基数词的用法。表示价格，需用基数词ten。"
      }
    ],
    fill: {
      text: "I brush my teeth ________ (two) a day.",
      answer: "twice",
      analysis: "本题考查数词的应用。twice a day表示'一天两次'，twice表示'两次'。"
    }
  },
  
  '并列连词': {
    choice: [
      {
        text: "I like English, ________ I don't like math.",
        options: ["A. and", "B. but", "C. or", "D. so"],
        answer: "B",
        analysis: "本题考查并列连词的用法。but表示转折，符合语境'喜欢英语但不喜欢数学'。"
      },
      {
        text: "You can have an apple ________ a banana.",
        options: ["A. and", "B. but", "C. or", "D. so"],
        answer: "C",
        analysis: "本题考查并列连词的用法。or表示选择，符合语境'可以要苹果或香蕉'。"
      }
    ],
    fill: {
      text: "Hurry up, ________ (or) you will be late for school.",
      answer: "or",
      analysis: "本题考查并列连词的用法。or表示'否则'，用于警告或建议。"
    }
  },
  
  '从属连词': {
    choice: [
      {
        text: "I will call you ________ I arrive at the station.",
        options: ["A. when", "B. where", "C. what", "D. which"],
        answer: "A",
        analysis: "本题考查从属连词的用法。when引导时间状语从句，表示'当...的时候'。"
      },
      {
        text: "I don't know ________ he will come or not.",
        options: ["A. if", "B. that", "C. what", "D. which"],
        answer: "A",
        analysis: "本题考查从属连词的用法。if引导宾语从句，表示'是否'。"
      }
    ],
    fill: {
      text: "We will go to the park ________ (if) it doesn't rain tomorrow.",
      answer: "if",
      analysis: "本题考查从属连词的用法。if引导条件状语从句，表示'如果'。"
    }
  },
  
  // 句法部分
  '主谓宾结构': {
    choice: [
      {
        text: "The students ________ English every day.",
        options: ["A. study", "B. studies", "C. studied", "D. studying"],
        answer: "A",
        analysis: "本题考查主谓宾结构的用法。The students是复数主语，谓语动词用原形study。"
      },
      {
        text: "My mother ________ delicious food for us.",
        options: ["A. cook", "B. cooks", "C. cooked", "D. cooking"],
        answer: "B",
        analysis: "本题考查主谓宾结构的用法。My mother是第三人称单数主语，谓语动词用第三人称单数形式cooks。"
      }
    ],
    fill: {
      text: "The children ________ (play) football in the playground now.",
      answer: "are playing",
      analysis: "本题考查主谓宾结构的用法。The children是复数主语，现在进行时用are playing。"
    }
  },
  
  '主系表结构': {
    choice: [
      {
        text: "The flowers ________ beautiful in spring.",
        options: ["A. is", "B. are", "C. was", "D. were"],
        answer: "B",
        analysis: "本题考查主系表结构的用法。The flowers是复数主语，系动词用are。"
      },
      {
        text: "She ________ a teacher in our school.",
        options: ["A. is", "B. are", "C. was", "D. were"],
        answer: "A",
        analysis: "本题考查主系表结构的用法。She是第三人称单数主语，系动词用is。"
      }
    ],
    fill: {
      text: "The weather ________ (be) very nice today.",
      answer: "is",
      analysis: "本题考查主系表结构的用法。The weather是不可数名词，作单数处理，系动词用is。"
    }
  },
  
  '一般现在时': {
    choice: [
      {
        text: "The sun ________ in the east every day.",
        options: ["A. rise", "B. rises", "C. rose", "D. rising"],
        answer: "B",
        analysis: "本题考查一般现在时的用法。The sun是第三人称单数主语，谓语动词用第三人称单数形式rises。"
      },
      {
        text: "We ________ to school by bus every morning.",
        options: ["A. go", "B. goes", "C. went", "D. going"],
        answer: "A",
        analysis: "本题考查一般现在时的用法。We是复数主语，谓语动词用原形go。"
      }
    ],
    fill: {
      text: "The earth ________ (go) around the sun.",
      answer: "goes",
      analysis: "本题考查一般现在时的用法。表示客观真理，用一般现在时，The earth是第三人称单数，谓语动词用goes。"
    }
  },
  
  '一般过去时': {
    choice: [
      {
        text: "I ________ a movie with my friend yesterday.",
        options: ["A. see", "B. saw", "C. seen", "D. seeing"],
        answer: "B",
        analysis: "本题考查一般过去时的用法。yesterday表示过去时间，需用一般过去时saw。"
      },
      {
        text: "They ________ to the park last Sunday.",
        options: ["A. go", "B. goes", "C. went", "D. going"],
        answer: "C",
        analysis: "本题考查一般过去时的用法。last Sunday表示过去时间，需用一般过去时went。"
      }
    ],
    fill: {
      text: "She ________ (buy) a new dress last week.",
      answer: "bought",
      analysis: "本题考查一般过去时的用法。last week表示过去时间，需用一般过去时bought。"
    }
  },
  
  '一般将来时': {
    choice: [
      {
        text: "I ________ visit my grandparents next week.",
        options: ["A. will", "B. would", "C. shall", "D. should"],
        answer: "A",
        analysis: "本题考查一般将来时的用法。next week表示将来时间，需用will表示将来。"
      },
      {
        text: "We ________ have a party tomorrow evening.",
        options: ["A. will", "B. would", "C. shall", "D. should"],
        answer: "A",
        analysis: "本题考查一般将来时的用法。tomorrow evening表示将来时间，需用will表示将来。"
      }
    ],
    fill: {
      text: "They ________ (go) to Beijing next month.",
      answer: "will go",
      analysis: "本题考查一般将来时的用法。next month表示将来时间，需用will go表示将来。"
    }
  },
  
  '现在进行时': {
    choice: [
      {
        text: "Look! The children ________ in the playground.",
        options: ["A. play", "B. plays", "C. are playing", "D. played"],
        answer: "C",
        analysis: "本题考查现在进行时的用法。Look!表示正在进行的动作，需用现在进行时are playing。"
      },
      {
        text: "Listen! Someone ________ at the door.",
        options: ["A. knock", "B. knocks", "C. is knocking", "D. knocked"],
        answer: "C",
        analysis: "本题考查现在进行时的用法。Listen!表示正在进行的动作，需用现在进行时is knocking。"
      }
    ],
    fill: {
      text: "The students ________ (read) books in the library now.",
      answer: "are reading",
      analysis: "本题考查现在进行时的用法。now表示正在进行的动作，需用现在进行时are reading。"
    }
  },
  
  '过去进行时': {
    choice: [
      {
        text: "I ________ my homework at 8 o'clock last night.",
        options: ["A. do", "B. did", "C. was doing", "D. am doing"],
        answer: "C",
        analysis: "本题考查过去进行时的用法。at 8 o'clock last night表示过去某个时间点正在进行的动作，需用过去进行时was doing。"
      },
      {
        text: "They ________ basketball when it started to rain.",
        options: ["A. play", "B. played", "C. were playing", "D. are playing"],
        answer: "C",
        analysis: "本题考查过去进行时的用法。when引导的时间状语从句表示过去某个时间点，主句需用过去进行时were playing。"
      }
    ],
    fill: {
      text: "She ________ (practice) the piano at that time yesterday.",
      answer: "was practicing",
      analysis: "本题考查过去进行时的用法。at that time yesterday表示过去某个时间点正在进行的动作，需用过去进行时was practicing。"
    }
  },
  
  '现在完成时': {
    choice: [
      {
        text: "I ________ this book three times.",
        options: ["A. read", "B. reads", "C. have read", "D. had read"],
        answer: "C",
        analysis: "本题考查现在完成时的用法。three times表示动作发生的次数，强调结果，需用现在完成时have read。"
      },
      {
        text: "She ________ to Beijing twice.",
        options: ["A. go", "B. goes", "C. has been", "D. had been"],
        answer: "C",
        analysis: "本题考查现在完成时的用法。twice表示动作发生的次数，强调经历，需用现在完成时has been。"
      }
    ],
    fill: {
      text: "We ________ (know) each other for five years.",
      answer: "have known",
      analysis: "本题考查现在完成时的用法。for five years表示持续的时间，需用现在完成时have known。"
    }
  },
  
  '过去完成时': {
    choice: [
      {
        text: "By the time I arrived, the meeting ________ already started.",
        options: ["A. has", "B. had", "C. have", "D. having"],
        answer: "B",
        analysis: "本题考查过去完成时的用法。By the time表示'到...时候为止'，主句动作发生在过去动作之前，需用过去完成时had started。"
      },
      {
        text: "I ________ my homework before my father came back.",
        options: ["A. finish", "B. finished", "C. have finished", "D. had finished"],
        answer: "D",
        analysis: "本题考查过去完成时的用法。before表示'在...之前'，主句动作发生在过去动作之前，需用过去完成时had finished。"
      }
    ],
    fill: {
      text: "She ________ (leave) when I got to the station.",
      answer: "had left",
      analysis: "本题考查过去完成时的用法。when引导的时间状语从句表示过去时间，主句动作发生在该时间之前，需用过去完成时had left。"
    }
  },
  
  '一般时态的被动语态': {
    choice: [
      {
        text: "English ________ all over the world.",
        options: ["A. speak", "B. speaks", "C. is spoken", "D. spoke"],
        answer: "C",
        analysis: "本题考查一般现在时被动语态的用法。English是动作的承受者，需用被动语态is spoken。"
      },
      {
        text: "The meeting ________ next Monday.",
        options: ["A. will hold", "B. will be held", "C. holds", "D. held"],
        answer: "B",
        analysis: "本题考查一般将来时被动语态的用法。The meeting是动作的承受者，需用被动语态will be held。"
      }
    ],
    fill: {
      text: "Many trees ________ (plant) in our school every year.",
      answer: "are planted",
      analysis: "本题考查一般现在时被动语态的用法。Many trees是动作的承受者，需用被动语态are planted。"
    }
  },
  
  '完成时态的被动语态': {
    choice: [
      {
        text: "The work ________ by the workers.",
        options: ["A. has finished", "B. has been finished", "C. finished", "D. finishes"],
        answer: "B",
        analysis: "本题考查现在完成时被动语态的用法。The work是动作的承受者，需用被动语态has been finished。"
      },
      {
        text: "The bridge ________ before we arrived.",
        options: ["A. built", "B. was built", "C. had been built", "D. has been built"],
        answer: "C",
        analysis: "本题考查过去完成时被动语态的用法。The bridge是动作的承受者，动作发生在过去动作之前，需用过去完成时被动语态had been built。"
      }
    ],
    fill: {
      text: "All the tickets ________ (sell) out by the time we got there.",
      answer: "had been sold",
      analysis: "本题考查过去完成时被动语态的用法。All the tickets是动作的承受者，动作发生在过去动作之前，需用过去完成时被动语态had been sold。"
    }
  },
  
  '语法一致原则': {
    choice: [
      {
        text: "Each of the students ________ a book.",
        options: ["A. have", "B. has", "C. having", "D. had"],
        answer: "B",
        analysis: "本题考查主谓一致的语法一致原则。Each of the students作主语时，谓语动词用单数形式has。"
      },
      {
        text: "The number of students ________ increasing.",
        options: ["A. is", "B. are", "C. be", "D. being"],
        answer: "A",
        analysis: "本题考查主谓一致的语法一致原则。The number of表示'...的数量'，作主语时，谓语动词用单数形式is。"
      }
    ],
    fill: {
      text: "Neither of the two boys ________ (be) good at math.",
      answer: "is",
      analysis: "本题考查主谓一致的语法一致原则。Neither of表示'两者都不'，作主语时，谓语动词用单数形式is。"
    }
  },
  
  '意义一致原则': {
    choice: [
      {
        text: "The family ________ watching TV now.",
        options: ["A. is", "B. are", "C. be", "D. being"],
        answer: "B",
        analysis: "本题考查主谓一致的意义一致原则。The family表示'家庭成员'，强调个体，谓语动词用复数形式are。"
      },
      {
        text: "Three years ________ a long time.",
        options: ["A. is", "B. are", "C. be", "D. being"],
        answer: "A",
        analysis: "本题考查主谓一致的意义一致原则。Three years表示'三年时间'，作为一个整体，谓语动词用单数形式is。"
      }
    ],
    fill: {
      text: "The police ________ (be) looking for the missing child.",
      answer: "are",
      analysis: "本题考查主谓一致的意义一致原则。The police表示'警察'，是复数概念，谓语动词用复数形式are。"
    }
  },
  
  '就近原则': {
    choice: [
      {
        text: "Either you or I ________ wrong.",
        options: ["A. is", "B. are", "C. am", "D. be"],
        answer: "C",
        analysis: "本题考查主谓一致的就近原则。Either...or连接两个主语时，谓语动词与最近的主语I保持一致，用am。"
      },
      {
        text: "Neither the teacher nor the students ________ in the classroom.",
        options: ["A. is", "B. are", "C. be", "D. being"],
        answer: "B",
        analysis: "本题考查主谓一致的就近原则。Neither...nor连接两个主语时，谓语动词与最近的主语the students保持一致，用are。"
      }
    ],
    fill: {
      text: "Not only Tom but also his friends ________ (like) playing basketball.",
      answer: "like",
      analysis: "本题考查主谓一致的就近原则。Not only...but also连接两个主语时，谓语动词与最近的主语his friends保持一致，用复数形式like。"
    }
  },
  
  '宾语从句': {
    choice: [
      {
        text: "I don't know ________ he will come tomorrow.",
        options: ["A. that", "B. what", "C. if", "D. which"],
        answer: "C",
        analysis: "本题考查宾语从句的用法。if引导宾语从句，表示'是否'，符合语境。"
      },
      {
        text: "Can you tell me ________ the library is?",
        options: ["A. that", "B. what", "C. where", "D. which"],
        answer: "C",
        analysis: "本题考查宾语从句的用法。where引导宾语从句，表示'在哪里'，符合语境。"
      }
    ],
    fill: {
      text: "I wonder ________ (when) you joined the club.",
      answer: "when",
      analysis: "本题考查宾语从句的用法。when引导宾语从句，表示'什么时候'，符合语境。"
    }
  },
  
  '定语从句': {
    choice: [
      {
        text: "The book ________ I bought yesterday is very interesting.",
        options: ["A. that", "B. what", "C. where", "D. which"],
        answer: "A",
        analysis: "本题考查定语从句的用法。that引导定语从句，修饰先行词The book，在从句中作宾语。"
      },
      {
        text: "This is the school ________ I studied three years ago.",
        options: ["A. that", "B. what", "C. where", "D. which"],
        answer: "C",
        analysis: "本题考查定语从句的用法。where引导定语从句，修饰先行词the school，在从句中作地点状语。"
      }
    ],
    fill: {
      text: "The girl ________ (who) is singing is my sister.",
      answer: "who",
      analysis: "本题考查定语从句的用法。who引导定语从句，修饰先行词The girl，在从句中作主语。"
    }
  },
  
  '状语从句': {
    choice: [
      {
        text: "I will call you ________ I arrive at the station.",
        options: ["A. when", "B. where", "C. what", "D. which"],
        answer: "A",
        analysis: "本题考查状语从句的用法。when引导时间状语从句，表示'当...的时候'。"
      },
      {
        text: "We will go to the park ________ it doesn't rain tomorrow.",
        options: ["A. if", "B. that", "C. what", "D. which"],
        answer: "A",
        analysis: "本题考查状语从句的用法。if引导条件状语从句，表示'如果'。"
      }
    ],
    fill: {
      text: "She was so tired ________ (that) she fell asleep immediately.",
      answer: "that",
      analysis: "本题考查状语从句的用法。so...that引导结果状语从句，表示'如此...以至于'。"
    }
  },
  
  'There be 句型': {
    choice: [
      {
        text: "________ a book on the desk.",
        options: ["A. There is", "B. There are", "C. It is", "D. They are"],
        answer: "A",
        analysis: "本题考查There be句型的用法。There is用于单数名词，表示'有'。"
      },
      {
        text: "________ many students in the classroom.",
        options: ["A. There is", "B. There are", "C. It is", "D. They are"],
        answer: "B",
        analysis: "本题考查There be句型的用法。There are用于复数名词，表示'有'。"
      }
    ],
    fill: {
      text: "________ (there) be a meeting this afternoon.",
      answer: "There will",
      analysis: "本题考查There be句型的用法。There will be表示将来'将有'。"
    }
  },
  
  '感叹句': {
    choice: [
      {
        text: "________ a beautiful day it is!",
        options: ["A. What", "B. How", "C. That", "D. Which"],
        answer: "A",
        analysis: "本题考查感叹句的用法。What a + 形容词 + 名词 + 主谓结构，表示'多么...的一天'。"
      },
      {
        text: "________ kind the boy is!",
        options: ["A. What", "B. How", "C. That", "D. Which"],
        answer: "B",
        analysis: "本题考查感叹句的用法。How + 形容词 + 主谓结构，表示'多么...'。"
      }
    ],
    fill: {
      text: "________ (what) a meaningful day it is!",
      answer: "What",
      analysis: "本题考查感叹句的用法。What a + 形容词 + 名词 + 主谓结构，表示'多么有意义的一天'。"
    }
  },
  
  '祈使句': {
    choice: [
      {
        text: "________ quiet, please. The baby is sleeping.",
        options: ["A. Be", "B. Being", "C. To be", "D. Been"],
        answer: "A",
        analysis: "本题考查祈使句的用法。Be quiet是祈使句，表示'请安静'。"
      },
      {
        text: "________ the door when you leave.",
        options: ["A. Close", "B. Closing", "C. To close", "D. Closed"],
        answer: "A",
        analysis: "本题考查祈使句的用法。Close the door是祈使句，表示'关门'。"
      }
    ],
    fill: {
      text: "________ (not) be late for school again.",
      answer: "Don't",
      analysis: "本题考查祈使句的用法。Don't be late是祈使句的否定形式，表示'不要迟到'。"
    }
  },
  
  '倒装句': {
    choice: [
      {
        text: "________ did I know that he was a teacher.",
        options: ["A. Little", "B. Few", "C. Many", "D. Much"],
        answer: "A",
        analysis: "本题考查倒装句的用法。Little放在句首，句子需倒装，表示'我几乎不知道'。"
      },
      {
        text: "________ can you find such a good friend.",
        options: ["A. Seldom", "B. Often", "C. Always", "D. Usually"],
        answer: "A",
        analysis: "本题考查倒装句的用法。Seldom放在句首，句子需倒装，表示'很少能找到'。"
      }
    ],
    fill: {
      text: "________ (never) have I seen such a beautiful sunset.",
      answer: "Never",
      analysis: "本题考查倒装句的用法。Never放在句首，句子需倒装，表示'我从未见过'。"
    }
  }
};

// 生成所有题目
function generateAllQuestions() {
  const allQuestions = [];
  const allLevel3Points = grammarData.getAllLevel3Points();
  
  allLevel3Points.forEach((point, index) => {
    const grammarPointName = point.name;
    const category = point.level2Name;
    const path = point.path;
    const examFrequency = getExamFrequency(path);
    const examYears = getExamYears(path);
    
    // 获取题目模板
    const template = questionTemplates[grammarPointName];
    if (!template) {
      console.warn(`未找到知识点"${grammarPointName}"的题目模板`);
      return;
    }
    
    // 生成2个选择题
    template.choice.forEach((choiceQ, i) => {
      const question = {
        _id: `middle_${path.replace(/\./g, '_')}_choice_${i + 1}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: choiceQ.text,
        answer: choiceQ.answer,
        grammarPoint: grammarPointName,
        category: category,
        type: 'choice',
        options: choiceQ.options,
        analysis: choiceQ.analysis,
        difficulty: 'medium',
        province: '云南',
        year: 2025,
        source: '题库',
        schoolLevel: 'middle',
        examFrequency: examFrequency,
        examYears: examYears.length > 0 ? examYears : []
      };
      allQuestions.push(question);
    });
    
    // 生成1个填空题
    const fillQ = template.fill;
    const fillQuestion = {
      _id: `middle_${path.replace(/\./g, '_')}_fill_1_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: fillQ.text,
      answer: fillQ.answer,
      grammarPoint: grammarPointName,
      category: category,
      type: 'fill_blank',
      analysis: fillQ.analysis,
      difficulty: 'medium',
      province: '云南',
      year: 2025,
      source: '题库',
      schoolLevel: 'middle',
      examFrequency: examFrequency,
      examYears: examYears.length > 0 ? examYears : []
    };
    allQuestions.push(fillQuestion);
  });
  
  return allQuestions;
}

// 主函数
function main() {
  const questions = generateAllQuestions();
  console.log(`共生成 ${questions.length} 道题目`);
  console.log(`其中选择题 ${questions.filter(q => q.type === 'choice').length} 道`);
  console.log(`其中填空题 ${questions.filter(q => q.type === 'fill_blank').length} 道`);
  
  // 保存到文件
  const fs = require('fs');
  const outputFile = 'middle_school_questions.json';
  fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2), 'utf8');
  console.log(`题目已保存到 ${outputFile}`);
  
  // 统计信息
  const stats = {};
  questions.forEach(q => {
    if (!stats[q.grammarPoint]) {
      stats[q.grammarPoint] = { choice: 0, fill: 0 };
    }
    if (q.type === 'choice') {
      stats[q.grammarPoint].choice++;
    } else {
      stats[q.grammarPoint].fill++;
    }
  });
  
  console.log('\n各知识点题目统计:');
  Object.keys(stats).forEach(point => {
    console.log(`${point}: 选择题${stats[point].choice}道, 填空题${stats[point].fill}道`);
  });
}

if (require.main === module) {
  main();
}

module.exports = { generateAllQuestions, getExamFrequency, getExamYears };

