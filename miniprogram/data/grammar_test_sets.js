// 语法测试题套题数据
const grammarTestSets = [
  // 第一套测试题
  {
    id: 1,
    name: "第一套语法测试",
    questions: [
      {
        "text": "She is good ______ playing the piano and often performs ______ public.",
        "option": ["at; in", "in; on", "for; at"],
        "answer": "at; in",
        "analysis": "be good at 是固定搭配，意为 \"擅长……\"；in public 表示 \"公开地，在公众场合\"，为固定短语。故答案为 at; in。",
        "tag": "介词"
      },
      {
        "text": "—Whose book is this? —It must be ______. I saw him reading it yesterday.",
        "option": ["he", "his", "him"],
        "answer": "his",
        "analysis": "此处需要一个名词性物主代词指代 \"他的书\"，he 是主格，him 是宾格，his 可作名词性物主代词，符合语境。故答案为 his。",
        "tag": "代词"
      },
      {
        "text": "I like both tea ______ coffee, ______ my brother prefers juice.",
        "option": ["and; but", "or; so", "but; and"],
        "answer": "and; but",
        "analysis": "both...and... 是固定搭配，意为 \"两者都……\"；前后句表示转折关系，用 but 连接。故答案为 and; but。",
        "tag": "连词"
      },
      {
        "text": "______ sun rises in ______ east and sets in ______ west.",
        "option": ["The; the; the", "A; an; a", "The; a; a"],
        "answer": "The; the; the",
        "analysis": "世界上独一无二的事物前用定冠词 the；方位名词前通常用定冠词 the。故答案为 The; the; the。",
        "tag": "冠词"
      },
      {
        "text": "There are many ______ in the forest. Some of them are very tall.",
        "option": ["tree", "trees", "treees"],
        "answer": "trees",
        "analysis": "many 后接可数名词复数形式，tree 的复数是 trees。故答案为 trees。",
        "tag": "名词"
      },
      {
        "text": "My parents ______ to the countryside every year when they were young.",
        "option": ["go", "went", "will go"],
        "answer": "went",
        "analysis": "根据时间状语 \"when they were young\" 可知，句子用一般过去时，go 的过去式是 went。故答案为 went。",
        "tag": "谓语"
      },
      {
        "text": "______ the homework, he went out to play with his friends.",
        "option": ["Finishing", "Finished", "Having finished"],
        "answer": "Having finished",
        "analysis": "非谓语动词作状语，finish 与逻辑主语 he 是主动关系，且动作发生在 went out 之前，用现在分词的完成式。故答案为 Having finished。",
        "tag": "非谓语"
      },
      {
        "text": "This is ______ interesting story that I have ever heard.",
        "option": ["a most", "the most", "most"],
        "answer": "the most",
        "analysis": "根据 \"that I have ever heard\" 可知，此处用形容词最高级，interesting 的最高级是 the most interesting。故答案为 the most。",
        "tag": "形容词"
      },
      {
        "text": "He runs ______ than any other student in his class.",
        "option": ["fast", "faster", "fastest"],
        "answer": "faster",
        "analysis": "由 than 可知，此处用副词的比较级，fast 的比较级是 faster。故答案为 faster。",
        "tag": "副词"
      },
      {
        "text": "The house ______ we live in is very old.",
        "option": ["which", "where", "who"],
        "answer": "which",
        "analysis": "定语从句修饰先行词 the house，关系词在从句中作宾语，用 which 或 that，where 在从句中作状语，who 指人。故答案为 which。",
        "tag": "定语从句"
      },
      {
        "text": "______ it rains tomorrow, we will stay at home.",
        "option": ["If", "Because", "Unless"],
        "answer": "If",
        "analysis": "此处是条件状语从句，if 表示 \"如果\"，符合句意；because 表原因，unless 表 \"除非\"。故答案为 If。",
        "tag": "状语从句"
      },
      {
        "text": "The fact, ______ I believe, is very important for us to know.",
        "option": ["that", "which", "what"],
        "answer": "which",
        "analysis": "插入语 I believe 不影响句子结构，此处是非限制性定语从句，修饰先行词 the fact，用 which。故答案为 which。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第二套测试题
  {
    id: 2,
    name: "第二套语法测试",
    questions: [
      {
        "text": "We usually have a meeting ______ Monday morning and sometimes ______ noon.",
        "option": ["on; at", "in; on", "at; in"],
        "answer": "on; at",
        "analysis": "表示在具体某一天的上午用介词 on；at noon 是固定搭配，意为 \"在中午\"。故答案为 on; at。",
        "tag": "介词"
      },
      {
        "text": "These books are ______, and those over there are ______.",
        "option": ["our; theirs", "ours; their", "ours; theirs"],
        "answer": "ours; theirs",
        "analysis": "两个空后均无名词，需用名词性物主代词。our 和 their 是形容词性物主代词，ours 和 theirs 是名词性物主代词。故答案为 ours; theirs。",
        "tag": "代词"
      },
      {
        "text": "You can ______ stay at home ______ go out to play, but you must finish your homework first.",
        "option": ["either; or", "both; and", "not only; but also"],
        "answer": "either; or",
        "analysis": "either...or... 表示 \"要么…… 要么……\"，符合句意；both...and... 表示 \"两者都\"，not only...but also... 表示 \"不仅…… 而且……\"。故答案为 either; or。",
        "tag": "连词"
      },
      {
        "text": "My sister wants to be ______ doctor when she grows up, and she dreams of working in ______ United States.",
        "option": ["a; the", "an; /", "the; a"],
        "answer": "a; the",
        "analysis": "doctor 是可数名词单数，且以辅音音素开头，用 a；the United States 是固定搭配，国家名前加定冠词 the。故答案为 a; the。",
        "tag": "冠词"
      },
      {
        "text": "I need two ______ and some ______ for the party.",
        "option": ["knifes; tomato", "knives; tomatoes", "knife; tomatos"],
        "answer": "knives; tomatoes",
        "analysis": "two 后接可数名词复数，knife 的复数是 knives；some 后接可数名词复数或不可数名词，tomato 的复数是 tomatoes。故答案为 knives; tomatoes。",
        "tag": "名词"
      },
      {
        "text": "Look! The children ______ happily in the park.",
        "option": ["play", "are playing", "played"],
        "answer": "are playing",
        "analysis": "由 \"Look!\" 可知，句子用现在进行时，结构为 be + 现在分词，children 是复数，be 动词用 are。故答案为 are playing。",
        "tag": "谓语"
      },
      {
        "text": "The teacher told us ______ noise in the library.",
        "option": ["not make", "not to make", "don't make"],
        "answer": "not to make",
        "analysis": "tell sb. not to do sth. 是固定用法，意为 \"告诉某人不要做某事\"，此处用不定式的否定形式作宾补。故答案为 not to make。",
        "tag": "非谓语"
      },
      {
        "text": "Of all the subjects, I think English is ______ useful than math.",
        "option": ["more", "most", "the most"],
        "answer": "more",
        "analysis": "由 than 可知，此处用形容词的比较级，useful 的比较级是 more useful。故答案为 more。",
        "tag": "形容词"
      },
      {
        "text": "He speaks English ______ among all the students in his group.",
        "option": ["fluently", "more fluently", "most fluently"],
        "answer": "most fluently",
        "analysis": "由 \"among all the students\" 可知，此处用副词的最高级，fluently 的最高级是 most fluently。故答案为 most fluently。",
        "tag": "副词"
      },
      {
        "text": "Do you know the girl ______ is talking with our teacher?",
        "option": ["which", "who", "whom"],
        "answer": "who",
        "analysis": "定语从句修饰先行词 the girl（指人），关系词在从句中作主语，用 who；which 指物，whom 在从句中作宾语。故答案为 who。",
        "tag": "定语从句"
      },
      {
        "text": "______ he is very young, he knows a lot about history.",
        "option": ["When", "Although", "As"],
        "answer": "Although",
        "analysis": "此处是让步状语从句，although 表示 \"虽然，尽管\"，符合句意；when 表时间，as 表原因或时间。故答案为 Although。",
        "tag": "状语从句"
      },
      {
        "text": "He said, ______ I remember, that he would come back next week.",
        "option": ["as", "which", "what"],
        "answer": "as",
        "analysis": "as I remember 是插入语，意为 \"正如我所记得的\"，as 有 \"正如\" 之意，符合语境；which 和 what 不用于此结构。故答案为 as。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第三套测试题
  {
    id: 3,
    name: "第三套语法测试",
    questions: [
      {
        "text": "They arrived ______ the small village ______ a cold winter evening.",
        "option": ["at; on", "in; in", "to; at"],
        "answer": "at; on",
        "analysis": "arrive at 后接小地点，arrive in 后接大地点，the small village 是小地点，用 at；表示在具体某一天的晚上用介词 on。故答案为 at; on。",
        "tag": "介词"
      },
      {
        "text": "—Is this pen ______? —No, it's ______. Mine is in my bag.",
        "option": ["yours; her", "your; hers", "yours; hers"],
        "answer": "yours; hers",
        "analysis": "两个空后均无名词，需用名词性物主代词。yours 是名词性物主代词，your 是形容词性物主代词；hers 是名词性物主代词，her 是形容词性物主代词。故答案为 yours; hers。",
        "tag": "代词"
      },
      {
        "text": "She didn't go to school yesterday ______ she was ill.",
        "option": ["so", "because", "but"],
        "answer": "because",
        "analysis": "后句 \"她生病了\" 是前句 \"没去上学\" 的原因，because 表示原因，so 表示结果，but 表示转折。故答案为 because。",
        "tag": "连词"
      },
      {
        "text": "______ earth moves around ______ sun, and ______ moon moves around ______ earth.",
        "option": ["The; the; the; the", "An; a; a; an", "A; the; a; the"],
        "answer": "The; the; the; the",
        "analysis": "世界上独一无二的天体前要用定冠词 the，earth（地球）、sun（太阳）、moon（月亮）都是独一无二的，故都用 the。故答案为 The; the; the; the。",
        "tag": "冠词"
      },
      {
        "text": "There are five ______ in the office, and each has a ______.",
        "option": ["woman teachers; child", "women teachers; child", "women teachers; children"],
        "answer": "women teachers; child",
        "analysis": "woman 作定语修饰复数名词时，自身也要用复数 women，所以 \"女老师\" 是 women teachers；each 后接可数名词单数，child 用单数形式。故答案为 women teachers; child。",
        "tag": "名词"
      },
      {
        "text": "By the time we got there, the movie ______ for ten minutes.",
        "option": ["has begun", "had been on", "began"],
        "answer": "had been on",
        "analysis": "by the time 引导的从句用一般过去时，主句用过去完成时；begin 是短暂性动词，不能与 for ten minutes 连用，需用延续性动词 be on。故答案为 had been on。",
        "tag": "谓语"
      },
      {
        "text": "______ by the beautiful scenery, the visitors decided to stay for another two days.",
        "option": ["Attracting", "Attracted", "To attract"],
        "answer": "Attracted",
        "analysis": "非谓语动词作状语，attract 与逻辑主语 the visitors 是被动关系，用过去分词形式。故答案为 Attracted。",
        "tag": "非谓语"
      },
      {
        "text": "The ______ you work, the ______ progress you will make.",
        "option": ["harder; greater", "hard; great", "hardest; greatest"],
        "answer": "harder; greater",
        "analysis": "\"the + 比较级，the + 比较级\" 是固定句型，意为 \"越……，越……\"，hard 的比较级是 harder，great 的比较级是 greater。故答案为 harder; greater。",
        "tag": "形容词"
      },
      {
        "text": "He runs ______ enough to catch up with the others.",
        "option": ["quick", "quickly", "quicker"],
        "answer": "quickly",
        "analysis": "此处修饰动词 runs，要用副词，quick 是形容词，quickly 是副词，quicker 是形容词比较级。故答案为 quickly。",
        "tag": "副词"
      },
      {
        "text": "This is the school ______ I studied three years ago.",
        "option": ["where", "that", "which"],
        "answer": "where",
        "analysis": "定语从句修饰先行词 the school，关系词在从句中作地点状语，用 where；that 和 which 在从句中作主语或宾语。故答案为 where。",
        "tag": "定语从句"
      },
      {
        "text": "I will call you ______ I arrive in Beijing.",
        "option": ["since", "as soon as", "so that"],
        "answer": "as soon as",
        "analysis": "此处是时间状语从句，as soon as 表示 \"一…… 就……\"，符合句意；since 表示 \"自从\"，so that 表示 \"为了\"。故答案为 as soon as。",
        "tag": "状语从句"
      },
      {
        "text": "The plan, ______ I think, is practical and feasible.",
        "option": ["what", "that", "which"],
        "answer": "which",
        "analysis": "插入语 I think 不影响句子结构，此处是非限制性定语从句，修饰先行词 the plan，用 which；that 不能引导非限制性定语从句，what 不能引导定语从句。故答案为 which。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第四套测试题
  {
    id: 4,
    name: "第四套语法测试",
    questions: [
      {
        "text": "We have been friends ______ we were in primary school.",
        "option": ["for", "since", "in"],
        "answer": "since",
        "analysis": "since 后接时间点或从句，表示 \"自从…… 以来\"，与现在完成时连用；for 后接时间段；in 后接将来时间。此处是从句，用 since。故答案为 since。",
        "tag": "介词"
      },
      {
        "text": "______ is important to learn English well, and ______ helps a lot in our daily life.",
        "option": ["It; it", "This; that", "What; which"],
        "answer": "It; it",
        "analysis": "第一个空用 it 作形式主语，真正的主语是不定式 \"to learn English well\"；第二个空用 it 指代 \"学好英语这件事\"。this、that、what、which 均不符合此用法。故答案为 It; it。",
        "tag": "代词"
      },
      {
        "text": "You will miss the bus ______ you hurry up.",
        "option": ["if", "unless", "when"],
        "answer": "unless",
        "analysis": "unless 表示 \"除非\"，相当于 \"if not\"，符合句意；if 表示 \"如果\"，when 表示 \"当…… 时\"。故答案为 unless。",
        "tag": "连词"
      },
      {
        "text": "She can play ______ piano very well, but she can't play ______ basketball.",
        "option": ["the; /", "a; the", "/; a"],
        "answer": "the; /",
        "analysis": "演奏乐器时，乐器前用定冠词 the；球类运动前不加冠词。故答案为 the; /。",
        "tag": "冠词"
      },
      {
        "text": "The ______ of the city is beautiful, and there are many tall ______ here.",
        "option": ["scenery; building", "sceneries; buildings", "scenery; buildings"],
        "answer": "scenery; buildings",
        "analysis": "scenery 是不可数名词，没有复数形式；many 后接可数名词复数，building 的复数是 buildings。故答案为 scenery; buildings。",
        "tag": "名词"
      },
      {
        "text": "My brother ______ in this company for five years, and he ______ here in 2019.",
        "option": ["worked; came", "has worked; came", "has worked; has come"],
        "answer": "has worked; came",
        "analysis": "第一句有 \"for five years\"，用现在完成时；第二句有具体时间 \"in 2019\"，用一般过去时。come 的过去式是 came。故答案为 has worked; came。",
        "tag": "谓语"
      },
      {
        "text": "The students are looking forward to ______ the new museum next week.",
        "option": ["visit", "visiting", "visited"],
        "answer": "visiting",
        "analysis": "look forward to 中的 to 是介词，后接动名词作宾语，即 \"look forward to doing sth.\"，意为 \"期待做某事\"。故答案为 visiting。",
        "tag": "非谓语"
      },
      {
        "text": "This story is ______ than that one, and it's ______ interesting story I've ever heard.",
        "option": ["more exciting; the most", "exciting; more", "most exciting; the more"],
        "answer": "more exciting; the most",
        "analysis": "第一空由 than 可知用比较级，exciting 的比较级是 more exciting；第二空由 \"I've ever heard\" 可知用最高级，interesting 的最高级是 the most interesting。故答案为 more exciting; the most。",
        "tag": "形容词"
      },
      {
        "text": "He speaks ______ clearly that everyone can understand him ______.",
        "option": ["so; easily", "such; easy", "too; easier"],
        "answer": "so; easily",
        "analysis": "\"so + 副词 + that...\" 是固定句型，意为 \"如此…… 以至于……\"；第二空修饰动词 understand，用副词 easily。such 后接名词，too...to... 表示 \"太…… 而不能……\"，easy 是形容词，easier 是比较级，均不符合。故答案为 so; easily。",
        "tag": "副词"
      },
      {
        "text": "I still remember the day ______ we first met each other.",
        "option": ["which", "when", "where"],
        "answer": "when",
        "analysis": "定语从句修饰先行词 the day，关系词在从句中作时间状语，用 when；which 在从句中作主语或宾语，where 作地点状语。故答案为 when。",
        "tag": "定语从句"
      },
      {
        "text": "______ the weather is bad, we will put off the sports meeting until next week.",
        "option": ["Even if", "In order that", "In case"],
        "answer": "In case",
        "analysis": "in case 表示 \"如果，万一\"，符合句意；even if 表示 \"即使\"，in order that 表示 \"为了\"。故答案为 In case。",
        "tag": "状语从句"
      },
      {
        "text": "The man, ______ you said was very helpful, has left the company.",
        "option": ["who", "whom", "which"],
        "answer": "who",
        "analysis": "插入语 you said 不影响句子结构，此处是定语从句修饰先行词 the man（指人），关系词在从句中作主语，用 who；whom 作宾语，which 指物。故答案为 who。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第五套测试题
  {
    id: 5,
    name: "第五套语法测试",
    questions: [
      {
        "text": "The meeting will be held ______ 3 o'clock ______ the afternoon of May 10th.",
        "option": ["at; on", "in; at", "on; in"],
        "answer": "at; on",
        "analysis": "具体时刻前用介词 at；表示在具体某一天的下午用介词 on。故答案为 at; on。",
        "tag": "介词"
      },
      {
        "text": "—Which of the two books do you prefer? —I prefer ______, because ______ of them are interesting.",
        "option": ["both; either", "either; both", "neither; both"],
        "answer": "either; both",
        "analysis": "第一空由 \"prefer\" 可知是在两者中选其一，用 either；第二空由 \"are\" 可知主语是复数，both 表示 \"两者都\"，符合语境。故答案为 either; both。",
        "tag": "代词"
      },
      {
        "text": "She likes not only reading ______ writing, ______ she often writes stories for children.",
        "option": ["but also; and", "but; so", "and; but"],
        "answer": "but also; and",
        "analysis": "not only...but also... 是固定搭配，意为 \"不仅…… 而且……\"；后句补充说明前句内容，用 and 连接。故答案为 but also; and。",
        "tag": "连词"
      },
      {
        "text": "______ old man in ______ brown coat is my grandfather.",
        "option": ["An; a", "The; a", "A; the"],
        "answer": "The; a",
        "analysis": "第一空特指 \"那个穿棕色外套的老人\"，用定冠词 the；第二空泛指 \"一件棕色外套\"，brown 以辅音音素开头，用 a。故答案为 The; a。",
        "tag": "冠词"
      },
      {
        "text": "There are three ______ and two ______ in the picture.",
        "option": ["sheep; foxes", "sheeps; foxs", "sheep; foxs"],
        "answer": "sheep; foxes",
        "analysis": "sheep 的单复数同形；fox 的复数是 foxes。故答案为 sheep; foxes。",
        "tag": "名词"
      },
      {
        "text": "Look! The workers ______ a new road in front of our school, and they ______ it for three months.",
        "option": ["build; have built", "are building; have been building", "built; built"],
        "answer": "are building; have been building",
        "analysis": "由 \"Look!\" 可知第一句用现在进行时；第二句有 \"for three months\"，且动作仍在进行，用现在完成进行时。故答案为 are building; have been building。",
        "tag": "谓语"
      },
      {
        "text": "______ late for school again, you should get up earlier tomorrow.",
        "option": ["To not be", "Not to be", "Not being"],
        "answer": "Not to be",
        "analysis": "不定式作目的状语，否定形式是在 to 前加 not，此处表示 \"为了不再上学迟到\"。故答案为 Not to be。",
        "tag": "非谓语"
      },
      {
        "text": "Of the three girls, Lucy is ______ one, and Lily is ______ than Mary.",
        "option": ["the tallest; taller", "taller; tallest", "tallest; the taller"],
        "answer": "the tallest; taller",
        "analysis": "第一空由 \"Of the three girls\" 可知用最高级，且加 the；第二空由 than 可知用比较级。故答案为 the tallest; taller。",
        "tag": "形容词"
      },
      {
        "text": "He runs ______ than his brother, but his sister runs ______ in their family.",
        "option": ["fast; fastest", "faster; fastest", "faster; faster"],
        "answer": "faster; fastest",
        "analysis": "第一空由 than 可知用比较级；第二空由 \"in their family\" 可知用最高级。故答案为 faster; fastest。",
        "tag": "副词"
      },
      {
        "text": "The reason ______ he was late for class is that he missed the early bus.",
        "option": ["why", "which", "when"],
        "answer": "why",
        "analysis": "定语从句修饰先行词 the reason，关系词在从句中作原因状语，用 why。故答案为 why。",
        "tag": "定语从句"
      },
      {
        "text": "He worked ______ hard ______ he won the first prize in the competition.",
        "option": ["such; that", "so; that", "as; as"],
        "answer": "so; that",
        "analysis": "\"so + 副词 + that...\" 表示 \"如此…… 以至于……\"，符合句意；such 后接名词，as...as 表示 \"和…… 一样\"。故答案为 so; that。",
        "tag": "状语从句"
      },
      {
        "text": "The book, ______ I think is worth reading, was written by a famous writer.",
        "option": ["which", "that", "what"],
        "answer": "which",
        "analysis": "插入语 I think 不影响句子结构，此处是非限制性定语从句，修饰先行词 the book，用 which；that 不能引导非限制性定语从句，what 不能引导定语从句。故答案为 which。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第六套测试题
  {
    id: 6,
    name: "第六套语法测试",
    questions: [
      {
        "text": "He has been absent ______ school for two days because of his illness.",
        "option": ["from", "of", "at"],
        "answer": "from",
        "analysis": "固定搭配be absent from表示\"缺席……\"，介词from表示来源或分离。",
        "tag": "介词"
      },
      {
        "text": "Someone has left ______ umbrella in the classroom. Could it be yours?",
        "option": ["his", "their", "her"],
        "answer": "their",
        "analysis": "当代指不特定单数主语someone时，现代英语常用they/them/their保持性别中立。",
        "tag": "代词"
      },
      {
        "text": "I was about to leave ______ the phone rang suddenly.",
        "option": ["when", "while", "since"],
        "answer": "when",
        "analysis": "when可引出突然发生的动作，与was/were about to do连用，表示\"正要……这时……\"。",
        "tag": "连词"
      },
      {
        "text": "Paris is ______ European city famous for its art and fashion.",
        "option": ["a", "an", "the"],
        "answer": "a",
        "analysis": "European发音以辅音音素/j/开头，故用a；此处为泛指，不用定冠词the。",
        "tag": "冠词"
      },
      {
        "text": "There is no ______ that he will win the speech contest; he has prepared for months.",
        "option": ["doubt", "idea", "news"],
        "answer": "doubt",
        "analysis": "no doubt后接that从句表示\"毫无疑问……\"，符合句意；idea与news后通常不接that从句。",
        "tag": "名词"
      },
      {
        "text": "By the time we arrived, the film ______ for ten minutes.",
        "option": ["had started", "had been on", "has started"],
        "answer": "had been on",
        "analysis": "for ten minutes需与延续性动词连用；had been on表示状态持续，had started为非延续性动词，不能与时间段连用。",
        "tag": "谓语"
      },
      {
        "text": "The girl asked to be introduced to the boy ______ in the corner.",
        "option": ["seated", "seating", "to seat"],
        "answer": "seated",
        "analysis": "过去分词seated作后置定语，相当于who was seated，表示被动完成的状态；seating无此用法。",
        "tag": "非谓语"
      },
      {
        "text": "The task is ______ than we expected, so we need more time.",
        "option": ["much difficult", "far more difficult", "very difficult"],
        "answer": "far more difficult",
        "analysis": "than提示需用比较级more difficult；far修饰比较级，加强程度。",
        "tag": "形容词"
      },
      {
        "text": "______ speaking, the results are quite satisfactory.",
        "option": ["Honest", "Honestly", "Honesty"],
        "answer": "Honestly",
        "analysis": "副词Honestly修饰全句，作评注性状语，意为\"坦率地说\"；形容词Honest无法修饰整个句子。",
        "tag": "副词"
      },
      {
        "text": "The scientist ______ research has won worldwide recognition is said to be very modest.",
        "option": ["who", "whose", "which"],
        "answer": "whose",
        "analysis": "whose引导定语从句，作research的定语，表示\"其研究\"；who/which无法表达所属关系。",
        "tag": "定语从句"
      },
      {
        "text": "You will succeed in the end ______ you give up halfway.",
        "option": ["unless", "if", "once"],
        "answer": "unless",
        "analysis": "unless=if...not，引导条件状语从句，意为\"除非……否则……\"，符合句意\"除非中途放弃，否则终将成功\"。",
        "tag": "状语从句"
      },
      {
        "text": "The book, I think, ______ worth ______ twice.",
        "option": ["is; reading", "are; to read", "is; to read"],
        "answer": "is; reading",
        "analysis": "插入语I think不影响主谓一致，主语the book为单数，谓语用is；be worth后接动名词reading表示\"值得被读\"。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第七套测试题
  {
    id: 7,
    name: "第七套语法测试",
    questions: [
      {
        "text": "She insisted ______ paying the bill, saying it was her treat.",
        "option": ["on", "to", "for"],
        "answer": "on",
        "analysis": "insist on doing sth 为固定搭配，表示\"坚持做某事\"。",
        "tag": "介词"
      },
      {
        "text": "Neither of the answers is correct, so you have to change ______.",
        "option": ["both", "either", "neither"],
        "answer": "either",
        "analysis": "neither 表示\"两者都不\"，后接单数谓语；根据语境需用 either 指代两者之一。",
        "tag": "代词"
      },
      {
        "text": "He speaks quickly ______ clearly, which makes him easy to understand.",
        "option": ["but", "and", "or"],
        "answer": "and",
        "analysis": "前后为并列的肯定特征，用 and 连接表示\"既……又……\"。",
        "tag": "连词"
      },
      {
        "text": "He was elected ______ chairman of the students' union last week.",
        "option": ["a", "the", "/"],
        "answer": "/",
        "analysis": "表示职位、头衔的名词用作补足语时通常不用冠词。",
        "tag": "冠词"
      },
      {
        "text": "The manager gave us some useful ______ on how to improve our service.",
        "option": ["advice", "advices", "advise"],
        "answer": "advice",
        "analysis": "advice 为不可数名词，无复数形式；advise 为动词。",
        "tag": "名词"
      },
      {
        "text": "By next Friday they ______ the bridge for three months.",
        "option": ["will repair", "will have been repairing", "have repaired"],
        "answer": "will have been repairing",
        "analysis": "by+将来时间点 用将来完成进行时，强调动作持续到那时并已进行一段时间。",
        "tag": "谓语"
      },
      {
        "text": "The man ______ at the counter seems to be waiting for someone.",
        "option": ["stand", "stood", "standing"],
        "answer": "standing",
        "analysis": "现在分词短语 standing at the counter 作后置定语，相当于 who is standing。",
        "tag": "非谓语"
      },
      {
        "text": "This is the ______ restaurant I've ever been to; the food is terrible.",
        "option": ["worse", "worst", "bad"],
        "answer": "worst",
        "analysis": "ever 提示用最高级 worst；形容词最高级前需加 the。",
        "tag": "形容词"
      },
      {
        "text": "He finished the work ______ quickly than we had expected.",
        "option": ["more", "much", "very"],
        "answer": "more",
        "analysis": "than 提示需用比较级 more quickly；much 只能修饰比较级，不能单独作比较级。",
        "tag": "副词"
      },
      {
        "text": "The village ______ we spent our holiday last year is famous for its beautiful lake.",
        "option": ["where", "which", "that"],
        "answer": "where",
        "analysis": "先行词 village 在定语从句中充当地点状语，故用关系副词 where。",
        "tag": "定语从句"
      },
      {
        "text": "______ it rains tomorrow, the sports meeting will be put off.",
        "option": ["In case", "If", "Unless"],
        "answer": "If",
        "analysis": "If 引导条件状语从句，表示\"如果\"；unless 表示\"除非\"，语义相反。",
        "tag": "状语从句"
      },
      {
        "text": "The results, I believe, ______ yet, so we have to wait patiently.",
        "option": ["haven't been announced", "hasn't announced", "hasn't been announced"],
        "answer": "haven't been announced",
        "analysis": "插入语 I believe 不影响主谓一致，主语 results 为复数；被动语态 haven't been announced 表示\"尚未被宣布\"。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第八套测试题
  {
    id: 8,
    name: "第八套语法测试",
    questions: [
      {
        "text": "The key ______ success lies not in luck but in hard work.",
        "option": ["of", "to", "for"],
        "answer": "to",
        "analysis": "固定搭配 the key to... 表示\"……的关键\"。介词 to 表\"通向\"。",
        "tag": "介词"
      },
      {
        "text": "Each student should bring ______ own notebook to the lab session.",
        "option": ["his", "their", "one's"],
        "answer": "their",
        "analysis": "each student 为单数，但现代英语常用 their 作性别中性物主代词，避免性别偏见。",
        "tag": "代词"
      },
      {
        "text": "I was tired, ______ I still finished all the homework before bed.",
        "option": ["so", "or", "but"],
        "answer": "but",
        "analysis": "前后为转折关系：虽然累，但仍完成作业，故选 but。",
        "tag": "连词"
      },
      {
        "text": "He was made ______ captain of the school basketball team yesterday.",
        "option": ["a", "the", "/"],
        "answer": "/",
        "analysis": "表示独一无二的职位、头衔作补语时，通常不用冠词。",
        "tag": "冠词"
      },
      {
        "text": "The scientist gave us a series of ______ on environmental protection.",
        "option": ["lecture", "lectures", "lecture's"],
        "answer": "lectures",
        "analysis": "a series of 后接可数名词复数 lectures；lecture's 为所有格，不合句意。",
        "tag": "名词"
      },
      {
        "text": "When I got to the cinema, the movie ______ for twenty minutes.",
        "option": ["had started", "had been on", "has been on"],
        "answer": "had been on",
        "analysis": "for twenty minutes 需与延续性动词连用；had been on 表示状态持续到过去某一时刻。",
        "tag": "谓语"
      },
      {
        "text": "The boy ______ by the window is my cousin from Canada.",
        "option": ["seating", "seated", "to seat"],
        "answer": "seated",
        "analysis": "过去分词 seated 作后置定语，相当于 who is seated，表示\"坐在……的\"。",
        "tag": "非谓语"
      },
      {
        "text": "Of the two proposals, the first one sounds ______ to the committee.",
        "option": ["more practical", "most practical", "the more practical"],
        "answer": "more practical",
        "analysis": "比较范围 of the two 用比较级 more practical；最高级和定冠词多余。",
        "tag": "形容词"
      },
      {
        "text": "She speaks French ______ fluently than her brother.",
        "option": ["very", "much", "more"],
        "answer": "more",
        "analysis": "than 提示需用副词比较级 more fluently；very 与 much 均不能直接作比较级。",
        "tag": "副词"
      },
      {
        "text": "The university ______ my father graduated in 1990 has become one of the top ten in the country.",
        "option": ["that", "where", "which"],
        "answer": "where",
        "analysis": "先行词 university 在从句中充当地点状语，需用关系副词 where。",
        "tag": "定语从句"
      },
      {
        "text": "______ you study harder, you won't pass the final exam.",
        "option": ["If", "Unless", "Because"],
        "answer": "Unless",
        "analysis": "unless = if...not，引导条件状语从句：除非你更努力，否则不能通过考试。",
        "tag": "状语从句"
      },
      {
        "text": "The plan, it seems to me, ______ carefully before being put into practice.",
        "option": ["needs to be discussed", "need discussing", "needs discussing"],
        "answer": "needs to be discussed",
        "analysis": "插入语 it seems to me 不影响主谓一致，主语 plan 为单数；need 后接被动不定式 to be discussed 表被动。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第九套测试题
  {
    id: 9,
    name: "第九套语法测试",
    questions: [
      {
        "text": "The little boy was accused ______ breaking the window with a stone.",
        "option": ["for", "of", "with"],
        "answer": "of",
        "analysis": "固定搭配 be accused of doing sth.，意为\"被指控做某事\"。",
        "tag": "介词"
      },
      {
        "text": "Each of the students has to hand in ______ assignment before Friday.",
        "option": ["their", "his or her", "one's"],
        "answer": "his or her",
        "analysis": "each 强调个体单数，正式语境中用 his or her；their 虽口语可用，但考试以严谨为准。",
        "tag": "代词"
      },
      {
        "text": "You'd better take the map with you, ______ you might get lost in the mountains.",
        "option": ["or", "so", "for"],
        "answer": "or",
        "analysis": "or 引导警告或结果，意为\"否则\"；符合\"带上地图，否则你会迷路\"的语境。",
        "tag": "连词"
      },
      {
        "text": "______ UNESCO was founded in 1945, its headquarters are in Paris.",
        "option": ["The", "A", "/"],
        "answer": "/",
        "analysis": "专有机构名称 UNESCO 前不用冠词；若用全称 the United Nations Educational... 则加 the。",
        "tag": "冠词"
      },
      {
        "text": "The police are gathering ______ about the accident from witnesses.",
        "option": ["an information", "informations", "information"],
        "answer": "information",
        "analysis": "information 为不可数名词，无复数形式，也不与 a/an 连用。",
        "tag": "名词"
      },
      {
        "text": "By the end of this year, the factory ______ production by 30 percent.",
        "option": ["will increase", "will have increased", "has increased"],
        "answer": "will have increased",
        "analysis": "by the end of this year 提示需用将来完成时 will have increased，强调到将来某时刻已完成的动作。",
        "tag": "谓语"
      },
      {
        "text": "The question ______ at tomorrow's meeting is of great importance.",
        "option": ["to be discussed", "being discussed", "discussed"],
        "answer": "to be discussed",
        "analysis": "不定式被动 to be discussed 表示将来被动，作后置定语，相当于 which will be discussed。",
        "tag": "非谓语"
      },
      {
        "text": "This problem is far ______ difficult than the one we solved yesterday.",
        "option": ["much", "more", "most"],
        "answer": "more",
        "analysis": "than 提示用比较级 more difficult；far 修饰比较级，加强程度。",
        "tag": "形容词"
      },
      {
        "text": "The boy speaks English almost ______ a native speaker.",
        "option": ["like", "as", "alike"],
        "answer": "like",
        "analysis": "介词 like 后接名词，表示\"像……一样\"；as 作介词需接句子，alike 为形容词或副词，位置不符。",
        "tag": "副词"
      },
      {
        "text": "The reason ______ he gave for his absence was unacceptable.",
        "option": ["that", "why", "for which"],
        "answer": "that",
        "analysis": "先行词 reason 在从句中作 gave 的宾语，用关系代词 that/which，口语常省略；why/for which 在从句中作状语。",
        "tag": "定语从句"
      },
      {
        "text": "She was reading a novel ______ the lights suddenly went out.",
        "option": ["while", "when", "as soon as"],
        "answer": "when",
        "analysis": "when 可表示一个动作正在进行时另一动作突然发生，符合\"正在阅读时灯突然熄灭\"的语境。",
        "tag": "状语从句"
      },
      {
        "text": "The results, I suppose, ______ to all participants by the end of next week.",
        "option": ["will be emailed", "will email", "are emailed"],
        "answer": "will be emailed",
        "analysis": "插入语 I suppose 不影响主谓，results 为复数；by the end of next week 提示用一般将来时被动 will be emailed。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第十套测试题
  {
    id: 10,
    name: "第十套语法测试",
    questions: [
      {
        "text": "She is married ______ a famous writer who lives next door to us.",
        "option": ["with", "to", "for"],
        "answer": "to",
        "analysis": "固定搭配 be married to sb 表示\"与某人结婚\"，介词用 to。",
        "tag": "介词"
      },
      {
        "text": "Neither of the twins remembered ______ homework at home.",
        "option": ["their", "his", "her"],
        "answer": "their",
        "analysis": "neither of + 复数名词，指\"两者都不\"，现代英语常用 their 指代，保持性别中性。",
        "tag": "代词"
      },
      {
        "text": "Take more exercise, ______ you'll soon feel healthier.",
        "option": ["and", "or", "but"],
        "answer": "and",
        "analysis": "祈使句 + and + 陈述句 表示\"如果……就会……\"，前后为顺承关系。",
        "tag": "连词"
      },
      {
        "text": "He is ______ honest man whom everyone in the village trusts.",
        "option": ["a", "an", "the"],
        "answer": "an",
        "analysis": "honest 读音以元音音素开头，故用 an；此处为泛指，不用 the。",
        "tag": "冠词"
      },
      {
        "text": "The government has released new ______ on reducing air pollution.",
        "option": ["datas", "data", "datums"],
        "answer": "data",
        "analysis": "data 为不可数名词，无复数形式；常用作复数概念，谓语动词亦可用复数，但不可加 s。",
        "tag": "名词"
      },
      {
        "text": "By the time you get back, we ______ dinner ready.",
        "option": ["will have got", "will get", "have got"],
        "answer": "will have got",
        "analysis": "by the time 引导的从句用一般现在时，主句用将来完成时 will have got，表示到那时已完成。",
        "tag": "谓语"
      },
      {
        "text": "The girl ______ on the stage is the youngest pianist in the competition.",
        "option": ["performing", "performed", "perform"],
        "answer": "performing",
        "analysis": "现在分词 performing 作后置定语，相当于 who is performing，表示正在进行的动作。",
        "tag": "非谓语"
      },
      {
        "text": "This is the ______ interesting novel I have ever read.",
        "option": ["more", "most", "very"],
        "answer": "most",
        "analysis": "ever 提示用最高级 most；最高级前需加 the。",
        "tag": "形容词"
      },
      {
        "text": "He speaks English ______ fluently than his brother.",
        "option": ["very", "more", "much"],
        "answer": "more",
        "analysis": "than 提示用副词比较级 more fluently；very 和 much 均不能直接作比较级。",
        "tag": "副词"
      },
      {
        "text": "The factory ______ produces these parts is closing next month.",
        "option": ["where", "which", "in which"],
        "answer": "which",
        "analysis": "先行词 factory 在从句中作主语，用关系代词 which；where/in which 需作地点状语。",
        "tag": "定语从句"
      },
      {
        "text": "You can't improve your grades ______ you change your study habits.",
        "option": ["unless", "if", "since"],
        "answer": "unless",
        "analysis": "unless = if...not，引导条件状语从句，意为\"除非……否则不能……\"。",
        "tag": "状语从句"
      },
      {
        "text": "The plan, I believe, ______ by all members before it is finally approved.",
        "option": ["will discuss", "will be discussed", "is discussing"],
        "answer": "will be discussed",
        "analysis": "插入语 I believe 不影响主谓一致，主语 plan 为单数；被动语态 will be discussed 表示将来被讨论。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第十一套测试题
  {
    id: 11,
    name: "第十一套语法测试",
    questions: [
      {
        "text": "The book is _____ the table and the chair.",
        "option": ["between", "among", "in"],
        "answer": "between",
        "analysis": "between用于两者之间（table和chair），among用于三者及以上。in表示在...内部不符合语境。",
        "tag": "介词"
      },
      {
        "text": "I can't find my pen. Can I use _____?",
        "option": ["yours", "your", "you"],
        "answer": "yours",
        "analysis": "yours是名词性物主代词，相当于your pen。your是形容词性物主代词需接名词，you是人称代词。",
        "tag": "代词"
      },
      {
        "text": "_____ it was raining hard, we decided to go out.",
        "option": ["Although", "Because", "Since"],
        "answer": "Although",
        "analysis": "although引导让步状语从句表转折，because/since表原因与句意矛盾。",
        "tag": "连词"
      },
      {
        "text": "_____ sun rises in _____ east.",
        "option": ["The; the", "A; an", "The; a"],
        "answer": "The; the",
        "analysis": "独一无二的事物（sun）和方向名词（east）前要加定冠词the。",
        "tag": "冠词"
      },
      {
        "text": "Please give me two _____ of bread.",
        "option": ["loafs", "loaves", "piece"],
        "answer": "loaves",
        "analysis": "bread是不可数名词，用计量单位loaf的复数形式loaves（两块面包）。loaf复数变形为loaves。",
        "tag": "名词"
      },
      {
        "text": "She _____ to school every day when she was a child.",
        "option": ["goes", "went", "has gone"],
        "answer": "went",
        "analysis": "when引导的过去时间状语从句要求主句用一般过去时（went），goes是一般现在时，has gone是现在完成时。",
        "tag": "谓语"
      },
      {
        "text": "_____ from the top, the city looks more beautiful.",
        "option": ["Seeing", "Seen", "To see"],
        "answer": "Seen",
        "analysis": "city与see是被动关系（被看），用过去分词seen作状语。seeing表主动，to see表目的。",
        "tag": "非谓语"
      },
      {
        "text": "This problem is _____ than that one.",
        "option": ["more difficult", "difficulter", "most difficult"],
        "answer": "more difficult",
        "analysis": "多音节形容词difficult的比较级是more difficult，difficulter是错误变形，most difficult是比较级误用。",
        "tag": "形容词"
      },
      {
        "text": "He drives _____ than his brother.",
        "option": ["careful", "carefully", "more carefully"],
        "answer": "more carefully",
        "analysis": "than要求用比较级，drives是动词需副词修饰，carefully的比较级是more carefully。",
        "tag": "副词"
      },
      {
        "text": "The man _____ you met yesterday is my teacher.",
        "option": ["who", "which", "where"],
        "answer": "who",
        "analysis": "先行词man指人，在从句作met的宾语，用关系代词who/whom/that。which指物，where指地点。",
        "tag": "定语从句"
      },
      {
        "text": "I will call you _____ I arrive in Beijing.",
        "option": ["until", "as soon as", "while"],
        "answer": "as soon as",
        "analysis": "as soon as引导时间状语从句表\"一...就...\"，符合句意。until表直到，while表同时发生。",
        "tag": "状语从句"
      },
      {
        "text": "The experiment, _____, was a great success.",
        "option": ["to say the least", "saying the least", "said the least"],
        "answer": "to say the least",
        "analysis": "to say the least是独立成分作插入语，表示\"至少可以说\"。B/C形式不能作插入语。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第十二套测试题
  {
    id: 12,
    name: "第十二套语法测试",
    questions: [
      {
        "text": "The hotel provides free breakfast _____ all guests.",
        "option": ["for", "to", "with"],
        "answer": "for",
        "analysis": "provide sth. for sb. 是固定搭配（为某人提供某物），to强调方向性（如give sth. to sb.），with表示伴随。",
        "tag": "介词"
      },
      {
        "text": "Neither of the answers _____ correct.",
        "option": ["is", "are", "were"],
        "answer": "is",
        "analysis": "neither作主语时谓语动词用单数（is），且句子陈述客观事实用一般现在时。are/were为复数形式误用。",
        "tag": "代词"
      },
      {
        "text": "I'll take an umbrella _____ it rains.",
        "option": ["in case", "so that", "even though"],
        "answer": "in case",
        "analysis": "in case引导目的状语从句表\"以防万一\"，符合带伞的语境。so that表目的（需接积极目的），even though表让步。",
        "tag": "连词"
      },
      {
        "text": "He is _____ honest boy with _____ unique talent.",
        "option": ["an; a", "a; an", "the; a"],
        "answer": "an; a",
        "analysis": "honest以元音音素开头用an，unique以辅音音素/j/开头用a。定冠词the不符合泛指语境。",
        "tag": "冠词"
      },
      {
        "text": "The _____ of the books are on the shelf.",
        "option": ["copy", "copies", "copys"],
        "answer": "copies",
        "analysis": "are提示主语用复数，book的复数是books，其所属概念copy（册/本）也相应变为复数copies。copys是错误变形。",
        "tag": "名词"
      },
      {
        "text": "Look！The children _____ kites in the park.",
        "option": ["fly", "flew", "are flying"],
        "answer": "are flying",
        "analysis": "look提示现在进行时（are flying），fly是一般现在时，flew是一般过去时。",
        "tag": "谓语"
      },
      {
        "text": "_____ her homework, Lily went to play tennis.",
        "option": ["Finishing", "Having finished", "Finished"],
        "answer": "Having finished",
        "analysis": "Lily与finish是主动关系，且完成作业先于去打网球，用现在分词完成式having finished表动作先后。finishing表同时，finished表被动。",
        "tag": "非谓语"
      },
      {
        "text": "This mountain is _____ than we expected.",
        "option": ["much higher", "more high", "very higher"],
        "answer": "much higher",
        "analysis": "high的比较级是higher，much可修饰比较级表程度。more high是错误变形（单音节形容词直接加-er），very不修饰比较级。",
        "tag": "形容词"
      },
      {
        "text": "She sings _____ beautifully _____ her sister.",
        "option": ["as; as", "so; as", "more; than"],
        "answer": "as; as",
        "analysis": "同级比较结构as+副词原级+as（和...一样美），否定句才用so...as。more...than是比较级结构，与beautifully原级矛盾。",
        "tag": "副词"
      },
      {
        "text": "This is the factory _____ my father once worked.",
        "option": ["where", "which", "that"],
        "answer": "where",
        "analysis": "先行词factory在从句作地点状语（worked in the factory→省略in which→用where），which/that需作主语或宾语。",
        "tag": "定语从句"
      },
      {
        "text": "_____ you study hard, you will pass the exam.",
        "option": ["If", "Unless", "Although"],
        "answer": "If",
        "analysis": "if引导条件状语从句表\"如果\"，符合逻辑。unless表\"除非\"（=if not），although表让步。",
        "tag": "状语从句"
      },
      {
        "text": "The plan, _____, needs further discussion.",
        "option": ["if I may say so", "if I may say", "may I say so"],
        "answer": "if I may say so",
        "analysis": "if I may say so是标准插入语（恕我直言），作独立成分。B缺少so，C是疑问句形式不能作插入语。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第十三套测试题
  {
    id: 13,
    name: "第十三套语法测试",
    questions: [
      {
        "text": "The conference will take place _____ June 15th _____ 9:00 AM.",
        "option": ["on; at", "in; on", "at; in"],
        "answer": "on; at",
        "analysis": "具体日期（June 15th）前用on，具体时刻（9:00 AM）前用at。in用于月份/年份/泛指上午下午。",
        "tag": "介词"
      },
      {
        "text": "I don't like this pen. Please give me _____ one.",
        "option": ["other", "another", "the other"],
        "answer": "another",
        "analysis": "another指三者及以上中的\"另一个\"（换一支笔），other需接复数（other ones），the other指两者中的另一个。",
        "tag": "代词"
      },
      {
        "text": "_____ he had enough time, he didn't finish the task.",
        "option": ["Although", "Because", "If"],
        "answer": "Although",
        "analysis": "although引导让步状语从句表\"尽管\"（有时间但没完成），because表原因矛盾，if表假设不符语境。",
        "tag": "连词"
      },
      {
        "text": "_____ Great Wall is _____ longest wall in the world.",
        "option": ["The; the", "A; a", "The; a"],
        "answer": "The; the",
        "analysis": "专有名词The Great Wall（长城）和形容词最高级longest前必须加定冠词the。",
        "tag": "冠词"
      },
      {
        "text": "There are many _____ in the zoo, like lions and tigers.",
        "option": ["animals", "animal", "an animal"],
        "answer": "animals",
        "analysis": "many修饰可数名词复数，animal的复数是直接加s（animals）。animal单数/an animal与many矛盾。",
        "tag": "名词"
      },
      {
        "text": "By the time we arrived, the movie _____ for 20 minutes.",
        "option": ["had started", "had been on", "started"],
        "answer": "had been on",
        "analysis": "by the time+过去时间→主句用过去完成时；for 20 minutes要求延续性动词（be on表\"上映\"），start是非延续性动词。",
        "tag": "谓语"
      },
      {
        "text": "_____ from space, the earth looks like a blue ball.",
        "option": ["Seen", "Seeing", "To see"],
        "answer": "Seen",
        "analysis": "earth与see是被动关系（被从太空看），用过去分词seen作状语。seeing表主动，to see表目的。",
        "tag": "非谓语"
      },
      {
        "text": "This question is _____ than the previous one.",
        "option": ["more difficult", "difficulty", "most difficult"],
        "answer": "more difficult",
        "analysis": "than要求比较级，difficult是多音节形容词，比较级为more difficult。difficulty是名词，most difficult是比较级误用。",
        "tag": "形容词"
      },
      {
        "text": "He runs _____ fast _____ no one can catch up with him.",
        "option": ["so; that", "too; to", "very; that"],
        "answer": "so; that",
        "analysis": "so...that...引导结果状语从句（跑得如此快以至于没人追上），too...to后接动词原形（无从句），very不引导从句。",
        "tag": "副词"
      },
      {
        "text": "The book _____ cover is red is mine.",
        "option": ["whose", "which", "that"],
        "answer": "whose",
        "analysis": "先行词book在从句作cover的定语（书的封面→whose cover），which/that只能作主语或宾语。",
        "tag": "定语从句"
      },
      {
        "text": "_____ it was late, she still finished her homework.",
        "option": ["Although", "Because", "Since"],
        "answer": "Although",
        "analysis": "although引导让步状语从句表\"虽然\"（晚但完成了），because/since表原因与句意矛盾。",
        "tag": "状语从句"
      },
      {
        "text": "If I _____ you, I would accept the offer.",
        "option": ["am", "were", "will be"],
        "answer": "were",
        "analysis": "对现在情况的虚拟假设→if从句用一般过去时（be动词特殊变were），主句用would+动词原形。am/will be为真实时态。",
        "tag": "虚拟语气"
      }
    ]
  },
  
  // 第十四套测试题
  {
    id: 14,
    name: "第十四套语法测试",
    questions: [
      {
        "text": "The company has made great progress _____ the past decade.",
        "option": ["during", "for", "since"],
        "answer": "during",
        "analysis": "during表示在一段时间内（the past decade十年期间），for接时间段（如for 10 years），since接时间点（如since 2015）。",
        "tag": "介词"
      },
      {
        "text": "_____ of the students in our class has a dictionary.",
        "option": ["Each", "Every", "Both"],
        "answer": "Each",
        "analysis": "each of+复数名词作主语时谓语用单数（has），强调个体；every不能直接接of；both指两者与students复数范围矛盾。",
        "tag": "代词"
      },
      {
        "text": "I'll call you as soon as I _____ the airport.",
        "option": ["reach", "will reach", "reached"],
        "answer": "reach",
        "analysis": "as soon as引导时间状语从句，遵循主将从现原则（主句will call→从句用一般现在时reach）。will reach是将来时误用，reached是过去时。",
        "tag": "连词"
      },
      {
        "text": "He is _____ university student who plays _____ violin very well.",
        "option": ["a; the", "an; a", "the; the"],
        "answer": "a; the",
        "analysis": "university以辅音音素/juː/开头用a，violin是乐器前必须加定冠词the。an用于元音音素开头的单词。",
        "tag": "冠词"
      },
      {
        "text": "The _____ of the two solutions is more practical.",
        "option": ["later", "latter", "late"],
        "answer": "latter",
        "analysis": "the latter指两者中的后者（与the former相对），later是late的比较级（更晚的），late是形容词（迟到的）。",
        "tag": "名词"
      },
      {
        "text": "She _____ English for ten years by the end of last year.",
        "option": ["had learned", "has learned", "learned"],
        "answer": "had learned",
        "analysis": "by the end of last year（到去年年底为止）→ 过去完成时（had learned）。has learned是现在完成时，learned是一般过去时。",
        "tag": "谓语"
      },
      {
        "text": "_____ the project successfully, they worked day and night.",
        "option": ["Completing", "To complete", "Completed"],
        "answer": "To complete",
        "analysis": "不定式to complete作目的状语（为了成功完成项目），completing表主动伴随，completed表被动或完成。",
        "tag": "非谓语"
      },
      {
        "text": "This is by far _____ movie I have ever seen.",
        "option": ["the most exciting", "more exciting", "exciting"],
        "answer": "the most exciting",
        "analysis": "by far修饰最高级（the most exciting），且最高级前必须加the。more exciting是比较级，exciting是原级。",
        "tag": "形容词"
      },
      {
        "text": "He _____ forgot his own birthday!",
        "option": ["almost", "nearly", "hardly"],
        "answer": "almost",
        "analysis": "almost表示接近事实（几乎忘记），nearly与否定词连用时含义不同（not nearly远非），hardly几乎不（语义矛盾）。",
        "tag": "副词"
      },
      {
        "text": "This is the place _____ we once visited.",
        "option": ["which", "where", "in which"],
        "answer": "which",
        "analysis": "先行词place在从句作visited的宾语（visited the place→用which），where/in which需作地点状语（如we once visited there）。",
        "tag": "定语从句"
      },
      {
        "text": "_____ you heat ice, it turns into water.",
        "option": ["If", "Unless", "Although"],
        "answer": "If",
        "analysis": "if引导条件状语从句表\"如果\"（加热冰→变成水），unless表\"除非\"（=if not），although表让步。",
        "tag": "状语从句"
      },
      {
        "text": "When I got home, my mother _____ dinner.",
        "option": ["cooks", "was cooking", "cooked"],
        "answer": "was cooking",
        "analysis": "when引导的时间状语从句（got home过去时）→ 主句用过去进行时（was cooking）表\"正在做饭\"（动作正在进行）。cooks是一般现在时，cooked是一般过去时。",
        "tag": "时态一致性"
      }
    ]
  },
  
  // 第十五套测试题
  {
    id: 15,
    name: "第十五套语法测试",
    questions: [
      {
        "text": "The little boy pointed _____ the toy car and said, 'I want that one!'",
        "option": ["at", "to", "out"],
        "answer": "at",
        "analysis": "point at强调指向近处具体事物（玩具车），to多用于指方向（如point to the future），point out意为指出（强调说明）。",
        "tag": "介词"
      },
      {
        "text": "I can't find my keys. I think I've lost _____.",
        "option": ["it", "them", "one"],
        "answer": "them",
        "analysis": "keys是复数，需用复数代词them指代；it指代单数，one指同类中的一个（非特指）。",
        "tag": "代词"
      },
      {
        "text": "_____ we had enough money, we couldn't buy the house because the price was too high.",
        "option": ["Although", "Because", "If"],
        "answer": "Although",
        "analysis": "although引导让步状语从句表'尽管'（有钱但买不起），because表原因与后半句重复，if表假设不符语境。",
        "tag": "连词"
      },
      {
        "text": "_____ girl in _____ red dress is my sister.",
        "option": ["The; the", "A; a", "The; a"],
        "answer": "The; the",
        "analysis": "特指穿红裙子的女孩（双方已知）用the，in the red dress是固定搭配（穿特定颜色衣服需加the）。",
        "tag": "冠词"
      },
      {
        "text": "The _____ of the meeting is to discuss the new project.",
        "option": ["purpose", "reason", "result"],
        "answer": "purpose",
        "analysis": "purpose表'目的'（会议的目标），reason表'原因'，result表'结果'，根据句意讨论新项目是会议的目的。",
        "tag": "名词"
      },
      {
        "text": "He _____ in Beijing for five years before he moved to Shanghai.",
        "option": ["lived", "had lived", "has lived"],
        "answer": "had lived",
        "analysis": "before引导的过去时间（moved to Shanghai）→ 主句用过去完成时（had lived）表'过去的过去'，lived是一般过去时，has lived是现在完成时。",
        "tag": "谓语"
      },
      {
        "text": "_____ tired after a long walk, they sat down to rest.",
        "option": ["Feeling", "Felt", "To feel"],
        "answer": "Feeling",
        "analysis": "they与feel是主动关系（感到累），用现在分词feeling作原因状语；felt是过去分词表被动，to feel表目的。",
        "tag": "非谓语"
      },
      {
        "text": "This problem is _____ than I thought at first.",
        "option": ["more difficult", "difficulty", "most difficult"],
        "answer": "more difficult",
        "analysis": "than要求比较级，difficult是多音节形容词，比较级为more difficult。difficulty是名词，most difficult是比较级误用。",
        "tag": "形容词"
      },
      {
        "text": "She answered the question _____ correctly that everyone was surprised.",
        "option": ["so", "very", "too"],
        "answer": "so",
        "analysis": "so...that...引导结果状语从句（回答得如此正确以至于惊讶），very不引导从句，too...to后接动词原形。",
        "tag": "副词"
      },
      {
        "text": "The man _____ you saw just now is our new teacher.",
        "option": ["who", "which", "what"],
        "answer": "who",
        "analysis": "先行词man指人，在从句作saw的宾语（saw the man→用who/whom/that），which指物，what不能引导定语从句。",
        "tag": "定语从句"
      },
      {
        "text": "It was _____ that helped me carry these books.",
        "option": ["he", "him", "his"],
        "answer": "he",
        "analysis": "强调句型It was...that...中，被强调部分（主语）需用主格he；him是宾格，his是物主代词。",
        "tag": "强调句型"
      },
      {
        "text": "With the exam _____ tomorrow, all the students are busy preparing.",
        "option": ["to come", "coming", "come"],
        "answer": "coming",
        "analysis": "with+名词+现在分词（coming）表主动且即将发生（考试即将到来），to come表将来但强调计划，come是过去分词表完成。",
        "tag": "with复合结构"
      }
    ]
  },
  
  // 第十六套测试题
  {
    id: 16,
    name: "第十六套语法测试",
    questions: [
      {
        "text": "The success of the project depends ______ how well the team cooperates.",
        "option": ["on", "at", "by"],
        "answer": "on",
        "analysis": "固定搭配 depend on（依赖，取决于），其他介词不符合该搭配用法。",
        "tag": "介词"
      },
      {
        "text": "The teacher asked the students to exchange ______ ideas during the discussion.",
        "option": ["their", "his", "her"],
        "answer": "their",
        "analysis": "代词需与主语the students（复数）保持数的一致，因此使用复数物主代词their。",
        "tag": "代词"
      },
      {
        "text": "We can go to the museum ______ we can visit the park this weekend.",
        "option": ["or", "and", "but"],
        "answer": "or",
        "analysis": "连词or表示选择关系，符合语境\"去博物馆或者去公园\"。and表并列，but表转折，均不符合逻辑。",
        "tag": "连词"
      },
      {
        "text": "He is ______ only person who can solve this problem.",
        "option": ["the", "a", "an"],
        "answer": "the",
        "analysis": "冠词the表示特指\"唯一能解决问题的人\"，only修饰名词时通常与定冠词the连用。",
        "tag": "冠词"
      },
      {
        "text": "We need to buy some ______ for the new apartment.",
        "option": ["furniture", "furnitures", "a furniture"],
        "answer": "furniture",
        "analysis": "furniture为不可数名词，无复数形式，也不能与不定冠词a连用。",
        "tag": "名词"
      },
      {
        "text": "Neither the students nor the teacher ______ satisfied with the result.",
        "option": ["is", "are", "were"],
        "answer": "is",
        "analysis": "neither...nor...连接主语时，谓语动词遵循\"就近原则\"，与teacher（单数）一致，故用is。",
        "tag": "谓语"
      },
      {
        "text": "______ the homework, the boy went out to play basketball.",
        "option": ["Finishing", "Finished", "Having finished"],
        "answer": "Having finished",
        "analysis": "非谓语动词作时间状语，finish发生在went out之前，需用现在分词的完成式Having finished。",
        "tag": "非谓语"
      },
      {
        "text": "The ______ news made all of us feel ______.",
        "option": ["exciting; excited", "excited; exciting", "exciting; exciting"],
        "answer": "exciting; excited",
        "analysis": "exciting修饰物（news），excited修饰人（us），区分-ing形容词表主动/特征，-ed形容词表被动/感受。",
        "tag": "形容词"
      },
      {
        "text": "The team worked ______ to complete the task ahead of schedule.",
        "option": ["efficiently", "efficient", "efficiency"],
        "answer": "efficiently",
        "analysis": "副词efficiently修饰动词worked，表示\"高效地\"。efficient是形容词，efficiency是名词。",
        "tag": "副词"
      },
      {
        "text": "The book ______ cover is red was written by a famous scientist.",
        "option": ["which", "whose", "that"],
        "answer": "whose",
        "analysis": "定语从句中缺少表示所有关系的限定词，修饰cover，因此用关系代词whose（=the book's）。",
        "tag": "定语从句"
      },
      {
        "text": "______ it rains tomorrow, we will cancel the outdoor activity.",
        "option": ["If", "Unless", "Although"],
        "answer": "If",
        "analysis": "if引导条件状语从句，表示\"如果明天下雨\"。unless意为\"除非\"，although表让步，均不符合逻辑。",
        "tag": "状语从句"
      },
      {
        "text": "The theory, as ______ known to all, has been widely applied.",
        "option": ["is", "be", "being"],
        "answer": "is",
        "analysis": "as引导插入语，在从句中作主语，后接谓语动词，需用第三人称单数is（the theory是单数）。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第十七套测试题
  {
    id: 17,
    name: "第十七套语法测试",
    questions: [
      {
        "text": "She has a great interest ______ classical music and often goes to concerts.",
        "option": ["in", "for", "on"],
        "answer": "in",
        "analysis": "固定搭配 interest in（对...感兴趣），其他介词不符合该搭配用法。",
        "tag": "介词"
      },
      {
        "text": "Some of these books are mine, and the rest are ______.",
        "option": ["his", "him", "he"],
        "answer": "his",
        "analysis": "空格处需要物主代词作表语，表示\"他的(书)\"，因此使用名词性物主代词his。",
        "tag": "代词"
      },
      {
        "text": "I'd like to go shopping with you, ______ I have to finish my homework first.",
        "option": ["but", "so", "or"],
        "answer": "but",
        "analysis": "连词but表示转折关系，符合语境\"我想去购物，但必须先完成作业\"。so表结果，or表选择，均不符合逻辑。",
        "tag": "连词"
      },
      {
        "text": "It's such ______ honor to be invited to speak at ______ international conference.",
        "option": ["an; an", "a; an", "an; the"],
        "answer": "an; an",
        "analysis": "honor发音以元音开头，但h不发音，故用an；international发音以元音开头，故用an。",
        "tag": "冠词"
      },
      {
        "text": "The factory has recently installed new ______ to improve production efficiency.",
        "option": ["equipment", "equipments", "an equipment"],
        "answer": "equipment",
        "analysis": "equipment为不可数名词，无复数形式，也不能与不定冠词a/an连用。",
        "tag": "名词"
      },
      {
        "text": "Not only the students but also the teacher ______ invited to the ceremony.",
        "option": ["was", "were", "have been"],
        "answer": "was",
        "analysis": "not only...but also...连接主语时，谓语动词遵循\"就近原则\"，与teacher（单数）一致，故用was。",
        "tag": "谓语"
      },
      {
        "text": "______ from the top of the mountain, the city looks magnificent.",
        "option": ["Seeing", "Seen", "To see"],
        "answer": "Seen",
        "analysis": "非谓语动词作状语，city与see之间是被动关系（被看见），故用过去分词Seen。",
        "tag": "非谓语"
      },
      {
        "text": "After the long journey, they felt ______ and wanted to find a ______ place to rest.",
        "option": ["tired; comfortable", "tiring; comfortable", "tired; comfort"],
        "answer": "tired; comfortable",
        "analysis": "tired修饰人（they），表示\"感到疲倦的\"；comfortable修饰物（place），表示\"令人舒适的\"。",
        "tag": "形容词"
      },
      {
        "text": "The speaker explained the concept ______, making it easy for everyone to understand.",
        "option": ["clear", "clearly", "clearing"],
        "answer": "clearly",
        "analysis": "副词clearly修饰动词explained，表示\"清楚地解释\"。clear是形容词，clearing是名词。",
        "tag": "副词"
      },
      {
        "text": "The company ______ CEO resigned last month is facing financial difficulties.",
        "option": ["which", "whose", "that"],
        "answer": "whose",
        "analysis": "定语从句中缺少表示所有关系的限定词，修饰CEO，因此用关系代词whose（=the company's）。",
        "tag": "定语从句"
      },
      {
        "text": "______ he arrives late, we will start the meeting without him.",
        "option": ["Even if", "So that", "Now that"],
        "answer": "Even if",
        "analysis": "even if引导让步状语从句，表示\"即使他迟到\"。so that表目的，now that表原因，均不符合逻辑。",
        "tag": "状语从句"
      },
      {
        "text": "The decision, as ______ expected, caused considerable controversy among the public.",
        "option": ["was", "is", "be"],
        "answer": "was",
        "analysis": "as引导插入语，在从句中作主语，后接谓语动词，根据主句时态（caused，过去时）保持一致，故用was。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第十八套测试题
  {
    id: 18,
    name: "第十八套语法测试",
    questions: [
      {
        "text": "The manager insisted ______ holding the meeting as scheduled despite the bad weather.",
        "option": ["on", "in", "at"],
        "answer": "on",
        "analysis": "固定搭配 insist on（坚持），其他介词不符合该搭配用法。",
        "tag": "介词"
      },
      {
        "text": "Every student should bring ______ own textbook to class tomorrow.",
        "option": ["their", "his or her", "one's"],
        "answer": "his or her",
        "analysis": "every student为单数概念，需用单数物主代词his or her保持数的一致。their为复数，one's通常用于泛指。",
        "tag": "代词"
      },
      {
        "text": "The experiment failed several times, ______ the researchers didn't give up.",
        "option": ["but", "so", "for"],
        "answer": "but",
        "analysis": "连词but表示转折关系，符合语境\"实验失败多次，但研究人员没有放弃\"。so表结果，for表原因，均不符合逻辑。",
        "tag": "连词"
      },
      {
        "text": "He is ______ university student who won ______ first prize in the competition.",
        "option": ["a; the", "an; the", "C. the; a"],
        "answer": "a; the",
        "analysis": "university发音以辅音[j]开头，故用a；first prize为序数词修饰的名词，前面需用定冠词the。",
        "tag": "冠词"
      },
      {
        "text": "The police have collected important ______ about the case from various sources.",
        "option": ["information", "informations", "an information"],
        "answer": "information",
        "analysis": "information为不可数名词，无复数形式，也不能与不定冠词a/an连用。",
        "tag": "名词"
      },
      {
        "text": "Twenty dollars ______ not enough to buy that dictionary.",
        "option": ["is", "are", "were"],
        "answer": "is",
        "analysis": "表示时间、金额、距离等的复数名词作主语时，通常被视为一个整体，谓语动词用单数形式。",
        "tag": "谓语"
      },
      {
        "text": "______ his number many times, she finally managed to get through to him.",
        "option": ["Dialing", "Having dialed", "Dialed"],
        "answer": "Having dialed",
        "analysis": "非谓语动词作时间状语，dial发生在managed之前，需用现在分词的完成式Having dialed表示先后关系。",
        "tag": "非谓语"
      },
      {
        "text": "The ______ story kept the children ______ throughout the night.",
        "option": ["frightening; awake", "frightened; awake", "frightening; awoken"],
        "answer": "frightening; awake",
        "analysis": "frightening修饰物（story），表示\"令人害怕的\"；awake作宾语补足语修饰人（children），表示\"醒着的\"。",
        "tag": "形容词"
      },
      {
        "text": "The project was ______ completed within three months, which was beyond our expectation.",
        "option": ["successful", "successfully", "success"],
        "answer": "successfully",
        "analysis": "副词successfully修饰动词was completed，表示\"成功地完成\"。successful是形容词，success是名词。",
        "tag": "副词"
      },
      {
        "text": "The artist ______ works are exhibited here is known for his unique style.",
        "option": ["who", "whose", "whom"],
        "answer": "whose",
        "analysis": "定语从句中缺少表示所有关系的限定词，修饰works，因此用关系代词whose（=the artist's）。",
        "tag": "定语从句"
      },
      {
        "text": "______ you have finished your report, you can help others with theirs.",
        "option": ["Now that", "Even though", "In case"],
        "answer": "Now that",
        "analysis": "now that引导原因状语从句，表示\"既然你已经完成了报告\"。even though表让步，in case表条件，均不符合逻辑。",
        "tag": "状语从句"
      },
      {
        "text": "The proposal, as ______ put forward by the committee, needs further discussion.",
        "option": ["was", "is", "has"],
        "answer": "was",
        "analysis": "as引导插入语，在从句中作主语，后接谓语动词，根据主句时态（needs，现在时）但动作put forward发生在过去，故用was。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第十九套测试题
  {
    id: 19,
    name: "第十九套语法测试",
    questions: [
      {
        "text": "The success of this project depends largely ______ the team's cooperation.",
        "option": ["on", "with", "for"],
        "answer": "on",
        "analysis": "固定搭配 depend on（依赖，取决于），其他介词不符合该搭配用法。",
        "tag": "介词"
      },
      {
        "text": "Each of the students must complete ______ assignment by Friday.",
        "option": ["their", "his or her", "one's"],
        "answer": "his or her",
        "analysis": "each of the students为单数概念，需用单数物主代词his or her保持数的一致。their为复数，one's通常用于泛指。",
        "tag": "代词"
      },
      {
        "text": "I wanted to go to the concert, ______ I couldn't get a ticket.",
        "option": ["but", "so", "or"],
        "answer": "but",
        "analysis": "连词but表示转折关系，符合语境\"我想去音乐会，但买不到票\"。so表结果，or表选择，均不符合逻辑。",
        "tag": "连词"
      },
      {
        "text": "She is ______ only person who can speak ______ Japanese in our department.",
        "option": ["the; /", "an; the", "the; the"],
        "answer": "the; /",
        "analysis": "only修饰名词时通常与定冠词the连用；语言名称前通常不加冠词。",
        "tag": "冠词"
      },
      {
        "text": "The company needs to update its ______ to improve efficiency.",
        "option": ["equipment", "equipments", "an equipment"],
        "answer": "equipment",
        "analysis": "equipment为不可数名词，无复数形式，也不能与不定冠词a/an连用。",
        "tag": "名词"
      },
      {
        "text": "Neither the teacher nor the students ______ aware of the schedule change.",
        "option": ["was", "were", "has been"],
        "answer": "were",
        "analysis": "neither...nor...连接主语时，谓语动词遵循\"就近原则\"，与students（复数）一致，故用were。",
        "tag": "谓语"
      },
      {
        "text": "______ by the beautiful scenery, the tourists took many photos.",
        "option": ["Attracting", "Attracted", "Having attracted"],
        "answer": "Attracted",
        "analysis": "非谓语动词作原因状语，tourists与attract之间是被动关系（被吸引），故用过去分词Attracted。",
        "tag": "非谓语"
      },
      {
        "text": "The ______ news made all the ______ children jump with joy.",
        "option": ["exciting; excited", "excited; exciting", "exciting; exciting"],
        "answer": "exciting; excited",
        "analysis": "exciting修饰物（news），excited修饰人（children），区分-ing形容词表主动/特征，-ed形容词表被动/感受。",
        "tag": "形容词"
      },
      {
        "text": "The speaker explained the complex theory ______ and clearly.",
        "option": ["patient", "patiently", "patience"],
        "answer": "patiently",
        "analysis": "副词patiently修饰动词explained，与clearly并列。patient是形容词，patience是名词。",
        "tag": "副词"
      },
      {
        "text": "The scientist ______ research has won many awards will give a lecture tomorrow.",
        "option": ["who", "whose", "whom"],
        "answer": "whose",
        "analysis": "定语从句中缺少表示所有关系的限定词，修饰research，因此用关系代词whose（=the scientist's）。",
        "tag": "定语从句"
      },
      {
        "text": "______ you have any questions, please feel free to ask me.",
        "option": ["If", "Unless", "Although"],
        "answer": "If",
        "analysis": "if引导条件状语从句，表示\"如果你有任何问题\"。unless意为\"除非\"，although表让步，均不符合逻辑。",
        "tag": "状语从句"
      },
      {
        "text": "The plan, as ______ suggested by the consultant, requires further modification.",
        "option": ["was", "is", "has been"],
        "answer": "was",
        "analysis": "as引导插入语，在从句中作主语，后接谓语动词，根据主句时态（requires，现在时）但动作suggested发生在过去，故用was。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  },
  
  // 第二十套测试题
  {
    id: 20,
    name: "第二十套语法测试",
    questions: [
      {
        "text": "The professor's research focuses ______ the impact of climate change on marine ecosystems.",
        "option": ["on", "in", "at"],
        "answer": "on",
        "analysis": "固定搭配 focus on（专注于），其他介词不符合该搭配用法。",
        "tag": "介词"
      },
      {
        "text": "Somebody left ______ umbrella in the conference room yesterday.",
        "option": ["their", "his or her", "one's"],
        "answer": "his or her",
        "analysis": "somebody为单数不定代词，需用单数物主代词his or her保持数的一致。their为复数，one's通常用于泛指。",
        "tag": "代词"
      },
      {
        "text": "The experiment was complex, ______ the results were surprisingly clear.",
        "option": ["but", "so", "for"],
        "answer": "but",
        "analysis": "连词but表示转折关系，符合语境\"实验很复杂，但结果却异常清晰\"。so表结果，for表原因，均不符合逻辑。",
        "tag": "连词"
      },
      {
        "text": "He is ______ honest man who always tells ______ truth.",
        "option": ["an; the", "a; the", "C. the; a"],
        "answer": "an; the",
        "analysis": "honest发音以元音开头，故用an；truth为特指\"真相\"，前面需用定冠词the。",
        "tag": "冠词"
      },
      {
        "text": "The committee has gathered sufficient ______ to make an informed decision.",
        "option": ["evidence", "evidences", "an evidence"],
        "answer": "evidence",
        "analysis": "evidence为不可数名词，无复数形式，也不能与不定冠词a/an连用。",
        "tag": "名词"
      },
      {
        "text": "The number of students applying for scholarships ______ increased significantly this year.",
        "option": ["has", "have", "having"],
        "answer": "has",
        "analysis": "the number of作主语时，谓语动词用单数形式，表示\"...的数量\"。",
        "tag": "谓语"
      },
      {
        "text": "______ the difficult questions, the candidate remained calm and confident.",
        "option": ["Facing", "Faced", "Having faced"],
        "answer": "Facing",
        "analysis": "非谓语动词作状语，candidate与face之间是主动关系（面对），故用现在分词Facing。",
        "tag": "非谓语"
      },
      {
        "text": "The ______ crowd became ______ when the famous actor appeared.",
        "option": ["excited; exciting", "exciting; excited", "excited; excited"],
        "answer": "exciting; excited",
        "analysis": "exciting修饰crowd，表示\"令人兴奋的人群\"；excited作表语，表示\"变得兴奋\"。",
        "tag": "形容词"
      },
      {
        "text": "The team worked ______ to meet the tight deadline.",
        "option": ["efficient", "efficiently", "efficiency"],
        "answer": "efficiently",
        "analysis": "副词efficiently修饰动词worked，表示\"高效地工作\"。efficient是形容词，efficiency是名词。",
        "tag": "副词"
      },
      {
        "text": "The author ______ latest novel became a bestseller will visit our city next month.",
        "option": ["who", "whose", "whom"],
        "answer": "whose",
        "analysis": "定语从句中缺少表示所有关系的限定词，修饰latest novel，因此用关系代词whose（=the author's）。",
        "tag": "定语从句"
      },
      {
        "text": "______ he had little experience, he handled the situation quite well.",
        "option": ["Although", "Because", "If"],
        "answer": "Although",
        "analysis": "although引导让步状语从句，表示\"尽管他经验不足\"。because表原因，if表条件，均不符合逻辑。",
        "tag": "状语从句"
      },
      {
        "text": "The policy, as ______ expected, has generated widespread discussion.",
        "option": ["was", "is", "has been"],
        "answer": "was",
        "analysis": "as引导插入语，在从句中作主语，后接谓语动词，根据主句时态（has generated，现在完成时）但动作expected发生在过去，故用was。",
        "tag": "动词在主从句复合句插入语中的不同表现形式"
      }
    ]
  }
];

module.exports = grammarTestSets;
