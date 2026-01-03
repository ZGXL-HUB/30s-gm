/**
 * 验证并上传题目数据的脚本
 * 使用 json_validation_fix.js 进行数据验证和修复
 */

// 导入验证工具
const { validateJsonData, fixJsonEscaping, generateFixReport } = require('./json_validation_fix');

// 这里替换为你的实际题目数据
const yourQuestionsData = [
 //完整纯题目
{
  "text": "—Is this Tom's notebook? —Yes, it's ____. Look, there's a \"T\" on it. A. he  B. his  C. him  D. himself",
  "answer": "B",
  "grammarPoint": "物主代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查物主代词的基础用法，难度简单。题干空格后无名词，需用名词性物主代词指代“Tom's notebook”，his既可以是形容词性物主代词（后接名词），也可作名词性物主代词，相当于his notebook，符合题意。选项A是人称代词主格，只能作句子主语，如“He is Tom”，不能单独作表语指代物品，错误；选项C是人称代词宾格，只能作宾语，如“I saw him”，不符合此处用法；选项D是反身代词，强调“某人自己”，如“He hurt himself”，与指代物品无关，错误。因此正确答案为B。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "—Is that Linda's schoolbag? —Yes, it's ____. Her name is on it. A. she  B. her  C. hers  D. herself",
  "answer": "C",
  "grammarPoint": "物主代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查物主代词的基础用法，难度简单。空格后无名词，需用名词性物主代词指代“Linda's schoolbag”，hers是名词性物主代词，相当于her schoolbag，符合语境。选项A是人称代词主格，只能作主语，如“She is Linda”，不能指代物品，错误；选项B是形容词性物主代词，后面必须接名词，如“her schoolbag”，单独使用不符合语法规则，错误；选项D是反身代词，意为“她自己”，如“She taught herself English”，与指代书包无关，错误。因此正确答案为C。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "—Is this Jack's pen? —Yes, it's ____. It's blue. A. he  B. his  C. him  D. himself",
  "answer": "B",
  "grammarPoint": "物主代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查物主代词的基础用法，难度简单。空格后无名词，需用名词性物主代词指代“Jack's pen”，his作为名词性物主代词时，相当于his pen，符合语法要求。选项A是人称代词主格，只能充当句子主语，如“He likes blue pens”，不能单独作表语指代物品，错误；选项C是人称代词宾格，只能作宾语，如“I gave him a pen”，用法不符；选项D是反身代词，表“他自己”，如“He washed himself”，与指代钢笔无关，错误。因此正确答案为B。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "—Is that Anna's dictionary? —Yes, it's ____. There's a flower on the cover. A. she  B. her  C. hers  D. herself",
  "answer": "C",
  "grammarPoint": "物主代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查物主代词的基础用法，难度简单。空格后无名词，需用名词性物主代词指代“Anna's dictionary”，hers是名词性物主代词，相当于her dictionary，符合题意。选项A是人称代词主格，只能作主语，如“She has a dictionary”，不能单独指代物品，错误；选项B是形容词性物主代词，必须后接名词，如“her dictionary”，单独使用语法错误；选项D是反身代词，意为“她自己”，如“She enjoyed herself”，与指代字典无关，错误。因此正确答案为C。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "—Is this Mike's umbrella? —Yes, it's ____. It's black. A. he  B. his  C. him  D. himself",
  "answer": "B",
  "grammarPoint": "物主代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查物主代词的基础用法，难度简单。空格后无名词，需用名词性物主代词指代“Mike's umbrella”，his作为名词性物主代词时，相当于his umbrella，符合语法规则。选项A是人称代词主格，只能作主语，如“He forgot his umbrella”，不能单独作表语指代物品，错误；选项C是人称代词宾格，只能作宾语，如“I lent him my umbrella”，用法不符；选项D是反身代词，表“他自己”，如“He hurt himself in the rain”，与指代雨伞无关，错误。因此正确答案为B。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "-Is that David's new bike over there?\n--Yes, it's ____. He rides it to school every day.",
  "answer": "C",
  "grammarPoint": "物主代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查名词性物主代词的用法。答句中，空格后没有名词，需要一个能独立充当表语、表示'David的自行车'的代词。'his'既是形容词性物主代词（后接名词），也是名词性物主代词（可单独使用），在此处作为名词性物主代词，相当于 'his bike'。选项A 'he' 是主格代词，不能表示所属关系。选项B 'him' 是宾格代词，也不能表示所属关系。选项D 'himself' 是反身代词，意为'他自己'，不符合'他的（自行车）'的语境。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "-Is this Lucy's schoolbag? It looks like hers.\n--Yes, it's ____. Her name is on the tag.",
  "answer": "C",
  "grammarPoint": "物主代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查名词性物主代词的用法。答句中，空格'it's ____'后没有名词，需要用一个能单独作表语、表示'Lucy的书包'的代词。'hers'是名词性物主代词，相当于 'her schoolbag'，符合语法要求。选项A 'she' 是人称代词主格，不能表示所属关系。选项B 'her' 是形容词性物主代词，后面必须接名词，不能单独使用。选项D 'herself' 是反身代词，意为'她自己'，不符合语境。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "-Whose pen is this on the floor? Is it ____?\n--No, it's not mine. It might be Mike's.",
  "answer": "B",
  "grammarPoint": "物主代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查名词性物主代词的用法。问句中，空格位于'Is it ____?'结构，后面没有名词，需要一个能单独作表语、表示'我的钢笔'的代词。'yours'是名词性物主代词，相当于 'your pen'，符合语法和语境（询问对方）。选项A 'you' 是人称代词主格或宾格，不能表示所属关系。选项C 'your' 是形容词性物主代词，后面必须接名词，不能单独使用。选项D 'yourself' 是反身代词，意为'你自己'，不符合语境。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  
  
  
  
  
  
  
  {
  "text": "-I can't find my notebook. Can I borrow ____?\n--Sure, here you are. Please return it tomorrow.",
  "answer": "D",
      "grammarPoint": "物主代词",
      "category": "代词",
      "type": "choice",
      "analysis": "本题考查名词性物主代词的用法。问句中，空格位于'borrow ____'结构，动词borrow后需要接一个名词性成分作宾语，表示'借你的笔记本'。'yours'是名词性物主代词，相当于 'your notebook'，符合语法。选项A 'you' 是人称代词宾格，意为'你'，不符合'你的（东西）'的语义。选项B 'your' 是形容词性物主代词，后面必须接名词，而此处空格后无名词。选项C 'yourself' 是反身代词，意为'你自己'，不能出借。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "-This umbrella is not ____. My umbrella is blue.\n--Then it must be my sister's. Hers is black too.",
      "answer": "B",
      "grammarPoint": "物主代词",
      "category": "代词",
      "type": "choice",
      "analysis": "本题考查名词性物主代词的用法。第一句话中，空格位于'is not ____'结构，后面没有名词，需要一个能单独作表语、表示'我的雨伞'的代词。'mine'是名词性物主代词，相当于 'my umbrella'，符合语法。选项A 'me' 是人称代词宾格，不能表示所属关系。选项C 'my' 是形容词性物主代词，后面必须接名词，不能单独使用。选项D 'myself' 是反身代词，意为'我自己'，不符合语境。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
  
  
  {
  "text": "—Peter, can you play the piano? —Yes, I ____. I practice it every weekend after school. A. must  B. can  C. should  D. need",
  "answer": "B",
  "grammarPoint": "情态动词",
  "category": "动词",
  "type": "choice",
  "analysis": "本题考查情态动词can表“能力”的问答对应用法，难度中等。问句用情态动词can明确询问“是否有弹钢琴的能力”，答句需用can回应，表“具备该能力”，符合语法逻辑。选项A.must表“必须”，强调义务或强制要求，如“You must finish homework first”，与“能力”无关；选项C.should表“应该”，侧重建议或责任，如“You should practice more”，不用于回应能力提问；选项D.need表“需要”，强调需求，如“I need a piano”，不符合语境。因此正确答案为B。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "—Tom, can you swim in the swimming pool? —Yes, I ____. My dad taught me how to swim last summer vacation. A. must  B. can  C. should  D. need",
  "answer": "B",
  "grammarPoint": "情态动词",
  "category": "动词",
  "type": "choice",
  "analysis": "本题考查情态动词can的核心用法——表“能力”的问答匹配，难度中等。问句以can引导，核心是询问“游泳的能力”，答句需用can回应以确认能力，结合“去年暑假爸爸教过”的语境，逻辑通顺。选项A.must表“必须”，用于表达规定或必要条件，如“We must follow the rules”，与能力无关；选项C.should表“应该”，用于给出建议，如“You should swim with others”，不适合回应能力提问；选项D.need表“需要”，强调客观需求，如“We need a life jacket”，不符合题意。因此正确答案为B。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "—Jack, can you fix the broken bike for me? —Yes, I ____. My uncle showed me the basic skills last month. A. must  B. can  C. should  D. need",
  "answer": "B",
  "grammarPoint": "情态动词",
  "category": "动词",
  "type": "choice",
  "analysis": "本题考查情态动词can表“能力”的问答对应，难度中等。问句用can提问“是否有修理自行车的能力”，答句需用can回应能力，搭配“上个月叔叔教过基础技能”的语境，符合语法和逻辑。选项A.must表“必须”，侧重义务或强制，如“You must be careful”，与能力无关；选项C.should表“应该”，用于建议，如“You should check the bike first”，不用于回应能力询问；选项D.need表“需要”，强调需求，如“The bike needs a new tire”，不符合语境。因此正确答案为B。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "—Lisa, can you speak French? —Yes, I ____. I studied it at school for two years and can talk with foreigners. A. must  B. can  C. should  D. need",
  "answer": "B",
  "grammarPoint": "情态动词",
  "category": "动词",
  "type": "choice",
  "analysis": "本题考查情态动词can表“语言能力”的问答用法，难度中等。问句以can引导，核心是询问“讲法语的能力”，答句用can回应能力，结合“学了两年且能和外国人交流”的补充说明，语境连贯。选项A.must表“必须”，如“You must learn basic French”，强调义务而非能力；选项C.should表“应该”，如“You should practice French often”，侧重建议，不回应能力；选项D.need表“需要”，如“I need a French dictionary”，强调需求，与题意不符。因此正确答案为B。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "—Bob, can you draw cartoons for the school newspaper? —Yes, I ____. I won a prize in a drawing competition last year. A. must  B. can  C. should  D. need",
  "answer": "B",
  "grammarPoint": "情态动词",
  "category": "动词",
  "type": "choice",
  "analysis": "本题考查情态动词can表“技能能力”的问答对应，难度中等。问句用can询问“画漫画的能力”，答句需用can回应，搭配“去年绘画比赛获奖”的语境，充分证明能力，逻辑合理。选项A.must表“必须”，如“You must finish the cartoons on time”，强调任务要求而非能力；选项C.should表“应该”，如“You should draw more creative cartoons”，侧重建议，不用于回应能力；选项D.need表“需要”，如“The newspaper needs more cartoons”，强调需求，不符合题意。因此正确答案为B。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  
    {
      "text": "-Tom, can you swim across the river?\n-Yes, I ____. I practice swimming in the pool every week.",
      "answer": "B",
      "grammarPoint": "情态动词",
      "category": "动词",
      "type": "choice",
      "analysis": "本题考查情态动词在问答中的一致性。问句使用情态动词'can'询问能力（能否游过这条河），答句需要针对'能否'进行回答。'can'用于肯定回答表示'有能力做'。选项B 'can' 是对问句情态动词的直接肯定回应。选项A 'must' 表示'必须'，强调必要性而非能力。选项C 'should' 表示'应该'，侧重建议或责任。选项D 'need' 表示'需要'，强调需求。后三者均不用于直接回应'can'引导的能力询问。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "-Must I hand in the homework before Friday?\n-Yes, you ____. Our teacher needs to check it over the weekend.",
      "answer": "A",
      "grammarPoint": "情态动词",
      "category": "动词",
      "type": "choice",
      "analysis": "本题考查情态动词在问答中的一致性。问句使用情态动词'must'询问是否必须（周五前交作业），答句需要针对'是否必须'进行回答。'must'用于肯定回答表示'必须'，与问句的情态动词对应。选项A 'must' 是直接肯定回应。选项B 'can' 表示'能够'，与询问必要性的'must'不符。选项C 'should' 表示'应该'，语气弱于'must'，并非对'是否必须'的最直接肯定回答。选项D 'need' 表示'需要'，虽接近但不如'must'在回答'must'疑问句时常用和直接。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "-Can you play the guitar for us at the party?\n-Of course I ____. I've been learning it for five years.",
      "answer": "C",
      "grammarPoint": "情态动词",
      "category": "动词",
      "type": "choice",
      "analysis": "本题考查情态动词在问答中的一致性。问句使用情态动词'can'询问能力（能否在聚会上弹吉他），答句'Of course'（当然）表明肯定的能力。'can'用于肯定回答表示'有能力做'。选项C 'can' 是对问句情态动词的直接肯定回应。选项A 'must' 表示'必须'，强调义务而非能力。选项B 'should' 表示'应该'，侧重建议或责任。选项D 'need' 表示'需要'，强调需求。三者均不用于直接回应'can'引导的能力询问。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "-Should I bring a map for our hiking trip tomorrow?\n-Yes, you ____. The forest trails can be confusing sometimes.",
      "answer": "B",
      "grammarPoint": "情态动词",
      "category": "动词",
      "type": "choice",
      "analysis": "本题考查情态动词在问答中的一致性。问句使用情态动词'should'询问建议（是否应该带地图），答句需要针对'是否应该'进行回答。'should'用于肯定回答表示'应该'，与问句的情态动词对应，给出肯定建议。选项B 'should' 是直接肯定回应。选项A 'must' 表示'必须'，语气过强，带有强制性，而问句只是寻求建议。选项C 'can' 表示'能够'，不用于回应建议询问。选项D 'need' 表示'需要'，虽可表示建议，但在直接回答'should'疑问句时，'should'是更常见和对应的选择。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "-Can you fix this broken chair by yourself?\n-Yes, I ____. I learned some basic carpentry skills from my grandfather.",
      "answer": "D",
      "grammarPoint": "情态动词",
      "category": "动词",
      "type": "choice",
      "analysis": "本题考查情态动词在问答中的一致性。问句使用情态动词'can'询问能力（能否自己修好椅子），答句需要针对'能否'进行回答。'can'用于肯定回答表示'有能力做'。选项D 'can' 是对问句情态动词的直接肯定回应。选项A 'must' 表示'必须'，强调必要性而非能力。选项B 'should' 表示'应该'，侧重建议或责任。选项C 'need' 表示'需要'，强调需求。三者均不用于直接回应'can'引导的能力询问。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
  
  
  
  
  {
  "text": "Many students in our class go to school ____ bike on weekdays. A. in  B. on  C. at  D. by",
  "answer": "D",
  "grammarPoint": "其他介词",
  "category": "介词",
  "type": "choice",
  "analysis": "本题考查介词by表示“乘坐交通工具”的基础用法，难度简单。表示“乘坐某种交通工具”时，需用“by+交通工具单数（不加冠词）”的固定结构，by bike 意为“骑自行车”，符合题意。选项A.in用于封闭空间类交通工具且需加冠词，如“in a car”，单独接bike语法错误；选项B.on用于有站立空间的交通工具且需加冠词，如“on a bus”，接bike用法错误；选项C.at用于表示时间或具体地点，不能用于交通工具前，错误。因此正确答案为D。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "My grandparents usually go to Kunming ____ train during holidays. A. in  B. on  C. at  D. by",
  "answer": "D",
  "grammarPoint": "其他介词",
  "category": "介词",
  "type": "choice",
  "analysis": "本题考查介词by表“乘坐交通工具”的固定用法，难度简单。“by+交通工具”是表示出行方式的基础结构，by train 意为“乘坐火车”，无需加冠词，符合语法规则。选项A.in需搭配“in a/an+交通工具”，如“in a train”，单独使用in错误；选项B.on需搭配“on a/an+交通工具”，如“on a train”，单独使用on不符合固定搭配；选项C.at用于时间点或小地点，如“at 8 o'clock”“at the station”，不能用于交通工具前，错误。因此正确答案为D。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "Lucy will go to Beijing ____ plane to visit her aunt. A. in  B. on  C. at  D. by",
  "answer": "D",
  "grammarPoint": "其他介词",
  "category": "介词",
  "type": "choice",
  "analysis": "本题考查介词by表“乘坐交通工具”的基础用法，难度简单。表示“乘坐飞机”的固定表达是by plane，“by+交通工具”结构中交通工具前不加任何冠词，这是核心考点。选项A.in需与“in a plane”连用，单独用in接plane语法错误；选项B.on需与“on a plane”连用，单独用on不符合固定搭配；选项C.at用于表示具体时间或地点，如“at the airport”，不能用于表示出行方式，错误。因此正确答案为D。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "We plan to go to Hainan ____ ship next month. A. in  B. on  C. at  D. by",
  "answer": "D",
  "grammarPoint": "其他介词",
  "category": "介词",
  "type": "choice",
  "analysis": "本题考查介词by表“乘坐交通工具”的固定用法，难度简单。“by+交通工具”是表示出行方式的基础结构，by ship 意为“乘坐轮船”，符合语法要求。选项A.in需搭配“in a ship”，单独使用in接交通工具错误；选项B.on需搭配“on a ship”，单独使用on不符合固定搭配规则；选项C.at用于表示时间或具体地点，如“at the port”，不能用于交通工具前表示出行方式，错误。因此正确答案为D。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "Mr. Wang often goes to work ____ car in the morning. A. in  B. on  C. at  D. by",
  "answer": "D",
  "grammarPoint": "其他介词",
  "category": "介词",
  "type": "choice",
  "analysis": "本题考查介词by表“乘坐交通工具”的基础用法，难度简单。表示“乘坐汽车”的固定表达是by car，“by+交通工具”结构中无需加冠词，这是教材核心基础考点。选项A.in需与“in a car”连用，单独用in接car语法错误；选项B.on用于“on a bus/bike”等，不能用于car前，用法错误；选项C.at用于表示时间或小地点，如“at work”“at 7:30”，不能用于交通工具前，错误。因此正确答案为D。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
    {
      "text": "Every morning, my brother goes to school ____ subway because it's fast and convenient.",
      "answer": "D",
      "grammarPoint": "其他介词",
      "category": "介词",
      "type": "choice",
      "analysis": "本题考查介词by表示交通方式的用法。句意为“我哥哥每天早晨乘地铁上学”。“乘地铁”的固定表达是“by subway”，介词by后接交通工具的单数形式，且不加任何冠词。选项D 'by' 是唯一正确的搭配。选项A 'in' 通常用于表示在封闭空间内（如 in a car），但 subway 作为交通工具时通常用 by。选项B 'on' 可用于表示在大型交通工具上（如 on a bus, on a train），但“on subway”不是表示“乘坐”的惯用搭配。选项C 'at' 表示在某个地点或时间，不能用于表示交通方式。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "It's a sunny day. Let's go to the park ____ bike instead of driving.",
      "answer": "A",
      "grammarPoint": "其他介词",
      "category": "介词",
      "type": "choice",
      "analysis": "本题考查介词by表示交通方式的用法。句意为“天气晴朗，我们骑自行车去公园吧，不要开车了”。“骑自行车”的固定表达是“by bike”，介词by后接交通工具的单数形式，且不加任何冠词。选项A 'by' 是唯一正确的搭配。选项B 'on' 可以说“on a bike”表示在自行车上，但强调“乘坐/使用”这种方式时，常用“by bike”。选项C 'with' 表示使用具体工具，但“with a bike”不表示交通方式。选项D 'in' 表示在封闭空间内，不能与bike搭配表示交通方式。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "To save time, we decided to travel to Hainan ____ plane this summer.",
      "answer": "C",
      "grammarPoint": "其他介词",
      "category": "介词",
      "type": "choice",
      "analysis": "本题考查介词by表示交通方式的用法。句意为“为了节省时间，我们决定今年夏天乘飞机去海南旅行”。“乘飞机”的固定表达是“by plane”，介词by后接交通工具的单数形式，且不加任何冠词。选项C 'by' 是唯一正确的搭配。选项A 'on' 可以说“on a plane”表示在飞机上，但强调“乘坐”这种方式时，常用“by plane”。选项B 'with' 表示使用具体工具，不符合交通方式的习惯表达。选项D 'at' 表示地点或时间，不能用于表示交通方式。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "In the old days, people often crossed the river ____ boat because there was no bridge.",
      "answer": "B",
      "grammarPoint": "其他介词",
      "category": "介词",
      "type": "choice",
      "analysis": "本题考查介词by表示交通方式的用法。句意为“在过去，因为没有桥，人们常常乘船过河”。“乘船”的固定表达是“by boat”，介词by后接交通工具的单数形式，且不加任何冠词。选项B 'by' 是唯一正确的搭配。选项A 'on' 可以说“on a boat”表示在船上，但强调“乘坐”这种方式时，常用“by boat”。选项C 'in' 可以说“in a boat”，但同样，表示交通方式时“by boat”是更常见的固定搭配。选项D 'with' 表示使用具体工具，不符合交通方式的习惯表达。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "If you are in a hurry, you'd better go to the airport ____ taxi.",
      "answer": "D",
      "grammarPoint": "其他介词",
      "category": "介词",
      "type": "choice",
      "analysis": "本题考查介词by表示交通方式的用法。句意为“如果你赶时间，最好乘出租车去机场”。“乘出租车”的固定表达是“by taxi”，介词by后接交通工具的单数形式，且不加任何冠词。选项D 'by' 是唯一正确的搭配。选项A 'in' 可以说“in a taxi”表示在出租车里，但强调“乘坐”这种方式时，常用“by taxi”。选项B 'on' 不能与taxi搭配表示交通方式。选项C 'with' 表示使用具体工具，不符合交通方式的习惯表达。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
  
  
  
  
  
  {
  "text": "Smartphones are very convenient for communication, ____ using them too often is bad for our eyes. A. or  B. and  C. but  D. so",
  "answer": "C",
  "grammarPoint": "并列连词",
  "category": "连词",
  "type": "choice",
  "analysis": "本题考查并列连词的辨析，难度中等。前半句“智能手机沟通很方便”与后半句“频繁使用对眼睛有害”存在明显的转折关系，需用并列连词but连接。选项A.or表示“或者”，用于表达选择关系，如“Would you like tea or coffee?”，不符合语境；选项B.and表示“并且”，用于连接并列、顺承的关系，如“He is tall and strong”，无法体现转折；选项D.so表示“所以”，用于表达因果关系，如“It rained hard, so we stayed at home”，此处无因果逻辑，排除。因此正确答案为C。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "Traveling to different cities is interesting and exciting, ____ it can be tiring because of long train rides. A. or  B. and  C. but  D. so",
  "answer": "C",
  "grammarPoint": "并列连词",
  "category": "连词",
  "type": "choice",
  "analysis": "本题考查并列连词的用法，难度中等。前半句强调“旅行有趣刺激”，后半句指出“长途车程会让人疲惫”，前后语义形成转折，需用but连接。选项A.or表选择关系，如“Do you want to go by train or plane?”，与语境不符；选项B.and表并列顺承，如“We visited museums and tried local food”，无法体现语义对比；选项D.so表因果关系，如“The journey was long, so we felt tired”，此处并非因果逻辑，排除。因此正确答案为C。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "Rainy days are cool and comfortable, ____ they make it difficult for us to do outdoor activities. A. or  B. and  C. but  D. so",
  "answer": "C",
  "grammarPoint": "并列连词",
  "category": "连词",
  "type": "choice",
  "analysis": "本题考查并列连词的辨析，难度中等。前半句“雨天凉爽舒适”与后半句“不利于户外活动”是转折关系，需用but连接。选项A.or表示选择，如“Stay at home or go to the library?”，不符合语义；选项B.and用于连接并列内容，如“The rain is light and the air is fresh”，无法体现转折；选项D.so表示因果，如“It rained heavily, so we canceled the picnic”，此处无因果联系，排除。因此正确答案为C。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "Online shopping saves a lot of time and money, ____ we can't check the quality of goods in person. A. or  B. and  C. but  D. so",
  "answer": "C",
  "grammarPoint": "并列连词",
  "category": "连词",
  "type": "choice",
  "analysis": "本题考查并列连词的用法，难度中等。前半句“网购省时省钱”是优点，后半句“无法亲自检查商品质量”是缺点，前后形成转折关系，需用but连接。选项A.or表选择，如“Buy it online or in the store?”，不符合语境；选项B.and表并列顺承，如“We browse products and pay online”，不能体现语义对比；选项D.so表因果，如“The price is low, so many people buy it”，此处无因果逻辑，排除。因此正确答案为C。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  {
  "text": "Staying up late to read books is relaxing, ____ it will influence your study efficiency the next day. A. or  B. and  C. but  D. so",
  "answer": "C",
  "grammarPoint": "并列连词",
  "category": "连词",
  "type": "choice",
  "analysis": "本题考查并列连词的辨析，难度中等。前半句“熬夜读书很放松”与后半句“影响第二天学习效率”存在转折关系，需用but连接。选项A.or表示“或者”，用于选择场景，如“Read a novel or a textbook?”，不符合语义；选项B.and用于连接并列内容，如“We read books and listen to music”，无法体现转折；选项D.so表示因果，如“He stayed up late, so he felt sleepy in class”，此处并非因果关系，排除。因此正确答案为C。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2025,
  "source": "变式题"
  },
  
    {
      "text": "The movie has a very interesting plot, ____ some of the scenes are a bit too scary for children.",
      "answer": "C",
      "grammarPoint": "并列连词",
      "category": "连词",
      "type": "choice",
      "analysis": "本题考查并列连词的逻辑辨析。前半句'这部电影情节很有趣'与后半句'有些场景对孩子来说有点太吓人'在语义上构成转折关系。连词'but'用于连接两个意思相反或相对的分句，表示转折，符合语境。选项A 'or' 表示选择关系，意为'或者'。选项B 'and' 表示并列或递进关系，意为'和，而且'。选项D 'so' 表示因果关系，意为'所以'。这三个选项均不符合此处转折的逻辑关系。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "It started to rain heavily outside, ____ we decided to cancel our picnic and stay indoors.",
      "answer": "D",
      "grammarPoint": "并列连词",
      "category": "连词",
      "type": "choice",
      "analysis": "本题考查并列连词的逻辑辨析。前半句'外面开始下大雨'是原因，后半句'我们决定取消野餐待在室内'是结果。连词'so'用于连接表示因果关系的分句，意为'所以，因此'，符合语境。选项A 'or' 表示选择关系，意为'否则，或者'。选项B 'and' 表示并列关系，意为'和，然后'。选项C 'but' 表示转折关系，意为'但是'。这三个选项均不符合此处因果的逻辑关系。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "You need to hurry up now, ____ you will miss the last bus to the city center.",
      "answer": "A",
      "grammarPoint": "并列连词",
      "category": "连词",
      "type": "choice",
      "analysis": "本题考查并列连词的逻辑辨析。前半句'你现在需要快点'与后半句'你会错过去市中心的末班车'构成'否则，要不然'的警告或选择关系。连词'or'用于连接两个分句，表示在相反条件下会导致的结果，意为'否则，要不然'，符合语境。选项B 'and' 表示并列关系，但此处不表示单纯的并列。选项C 'but' 表示转折关系。选项D 'so' 表示因果关系。这三个选项均不符合此处'否则'的警告性选择关系。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "The little girl put on her warm coat ____ then went out to play in the snow with her friends.",
      "answer": "B",
      "grammarPoint": "并列连词",
      "category": "连词",
      "type": "choice",
      "analysis": "本题考查并列连词的逻辑辨析。句子描述了小女孩两个连续发生的动作：'穿上暖和的外套'和'出去和朋友们玩雪'。这两个动作是顺承的并列关系，没有转折、因果或选择意味。连词'and'用于连接两个并列的动作或分句，表示'然后，而且'，符合语境。选项A 'or' 表示选择关系。选项C 'but' 表示转折关系。选项D 'so' 表示因果关系。这三个选项均不符合此处动作顺承的并列关系。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "Learning a new language requires a lot of time and effort, ____ it can open a new world and bring great joy.",
      "answer": "C",
      "grammarPoint": "并列连词",
      "category": "连词",
      "type": "choice",
      "analysis": "本题考查并列连词的逻辑辨析。前半句'学习一门新语言需要大量时间和努力'指出了困难或代价，后半句'它能打开一个新世界并带来巨大快乐'指出了积极的一面。两者在语义上形成对比和转折。连词'but'用于连接两个意思相对的分句，强调后半句的积极转折，符合语境。选项A 'or' 表示选择关系。选项B 'and' 虽然可以表示并列，但此处更强调转折对比。选项D 'so' 表示因果关系。这三个选项均不能像'but'一样准确表达此处的前后对比转折关系。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
  
  
  
  
  
  {
  "text": "—Tom, you should stick to ____. Your dream will come true with hard work. —OK, I will. A. myself  B. yourself  C. herself  D. himself",
  "answer": "B",
  "grammarPoint": "反身代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查反身代词的基础用法，难度简单。问句主语是第二人称“you”（指代Tom），对应的反身代词是“yourself”，“stick to oneself”意为“坚持自己”，符合语境。选项A.myself对应第一人称“I”，如“I believe in myself”，指代错误；选项C.herself对应第三人称女性“she”，如“She looks after herself”，与主语不符；选项D.himself对应第三人称男性“he”，如“He teaches himself English”，指代错误。因此正确答案为B。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Lisa, you must take care of ____ when you travel alone. —Don't worry, Mom. I will. A. myself  B. yourself  C. herself  D. himself",
  "answer": "B",
  "grammarPoint": "反身代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查反身代词的人称对应，难度简单。问句主语是第二人称“you”（指代Lisa），反身代词需与之匹配，“yourself”是第二人称反身代词，“take care of yourself”意为“照顾好你自己”，符合题意。选项A.myself对应主语“I”，如“I take care of myself”，指代错误；选项C.herself对应主语“she”，如“Lisa looks after herself”，但本题主语是“you”，需用对应的“yourself”；选项D.himself对应主语“he”，如“He takes care of himself”，指代错误。因此正确答案为B。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Jack, you need to trust ____ if you want to pass the math exam. —I know. I'll try my best. A. myself  B. yourself  C. herself  D. himself",
  "answer": "B",
  "grammarPoint": "反身代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查反身代词的基础用法，难度简单。问句主语是“you”（指代Jack），对应的反身代词是“yourself”，“trust oneself”意为“相信自己”，符合语法规则。选项A.myself对应第一人称“I”，如“I trust myself”，与主语“you”不匹配；选项C.herself对应女性主语“she”，如“She trusts herself”，指代错误；选项D.himself对应男性主语“he”，如“He trusts himself”，但本题主语是“you”，需用“yourself”。因此正确答案为B。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Anna, you should be proud of ____ for winning the singing competition. —Thank you, teacher. A. myself  B. yourself  C. herself  D. himself",
  "answer": "B",
  "grammarPoint": "反身代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查反身代词的人称对应关系，难度简单。问句主语是第二人称“you”（指代Anna），反身代词需用“yourself”，“be proud of yourself”意为“为你自己感到骄傲”，符合语境。选项A.myself对应主语“I”，如“I am proud of myself”，指代错误；选项C.herself虽指代女性，但对应主语是“she”，如“Anna is proud of herself”，而本题主语是“you”，需用对应的“yourself”；选项D.himself对应男性主语“he”，指代错误。因此正确答案为B。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—David, you can depend on ____ to finish the group task well. —I won't let you down. A. myself  B. yourself  C. herself  D. himself",
  "answer": "B",
  "grammarPoint": "反身代词",
  "category": "代词",
  "type": "choice",
  "analysis": "本题考查反身代词的基础用法，难度简单。问句主语是“you”（指代David），对应的反身代词是“yourself”，“depend on oneself”意为“依靠自己”，符合语法要求。选项A.myself对应第一人称“I”，如“I depend on myself”，与主语“you”不匹配；选项C.herself对应女性主语“she”，指代错误；选项D.himself对应男性主语“he”，如“David depends on himself”，但本题主语是“you”，需用“yourself”。因此正确答案为B。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  
    {
      "text": "-I often feel nervous before speaking in public. What should I do, Mr. Li?\n-You must believe in ____. Just take a deep breath and start.",
      "answer": "B",
      "grammarPoint": "反身代词",
      "category": "代词",
      "type": "choice",
      "analysis": "本题考查反身代词与主语的一致性。对话中，答句的主语是'You'（你），因此对应的反身代词应为'yourself'（你自己）。'believe in yourself'意为'相信你自己'。选项A 'myself' 对应主语I。选项C 'herself' 对应主语she。选项D 'himself' 对应主语he。这三个选项均与答句主语'you'不一致。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-Look at Lily! She is always so confident.\n-Yes, she always believes in ____ and never gives up easily.",
      "answer": "C",
      "grammarPoint": "反身代词",
      "category": "代词",
      "type": "choice",
      "analysis": "本题考查反身代词与主语的一致性。句子中，主句的主语是'she'（她），因此对应的反身代词应为'herself'（她自己）。'believes in herself'意为'相信她自己'。选项A 'myself' 对应主语I。选项B 'yourself' 对应主语you。选项D 'himself' 对应主语he。这三个选项均与句子主语'she'不一致。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-David worked hard and solved the difficult math problem by ____.\n-He is really smart and independent.",
      "answer": "D",
      "grammarPoint": "反身代词",
      "category": "代词",
      "type": "choice",
      "analysis": "本题考查反身代词与主语的一致性。句子中，'by'后的反身代词指代主语'David'（男性，单数），因此应使用'himself'（他自己）。'by himself'意为'靠他自己'。选项A 'myself' 对应主语I。选项B 'yourself' 对应主语you。选项C 'herself' 对应主语she。这三个选项均与主语'David'不一致。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-Boys and girls, remember to be proud of ____ when you do something good.\n-OK, we will, teacher.",
      "answer": "A",
      "grammarPoint": "反身代词",
      "category": "代词",
      "type": "choice",
      "analysis": "本题考查反身代词与主语的一致性。老师对'Boys and girls'（你们）说话，主语是'you'（你们），因此对应的反身代词应为复数形式的'yourselves'（你们自己）。'be proud of yourselves'意为'为你们自己感到骄傲'。选项A 'yourselves' 是正确选项。选项B 'ourselves' 对应主语we。选项C 'themselves' 对应主语they。选项D 'myself' 对应主语I。这三个选项均与语境中隐含的主语'you (plural)'不一致。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-Mom, look! I made this card all by ____.\n-Wow, dear, you are so creative!",
      "answer": "C",
      "grammarPoint": "反身代词",
      "category": "代词",
      "type": "choice",
      "analysis": "本题考查反身代词与主语的一致性。孩子对妈妈说话，说'我'自己做了卡片。主句的主语是'I'（我），因此对应的反身代词应为'myself'（我自己）。'by myself'意为'靠我自己'。选项C 'myself' 是正确选项。选项A 'yourself' 对应主语you。选项B 'himself' 对应主语he。选项D 'themselves' 对应主语they。这三个选项均与主语'I'不一致。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
  "text": "____ the National Day holiday, colorful flags can be seen all over the city center. A. To  B. Above  C. Between  D. During",
  "answer": "D",
  "grammarPoint": "时间介词",
  "category": "介词",
  "type": "choice",
  "analysis": "本题考查时间介词的辨析，难度中等。题干表示“在国庆节假期期间”，需要用后接时间段的时间介词during，符合“时间段内发生/存在某现象”的语境。选项A.To表“朝向、到……”，侧重方向或时间终点，如“go to school”“from Monday to Friday”，不用于表示“在……期间”；选项B.Above表“在……上方”，侧重空间位置，如“a bird above the tree”，与时间无关；选项C.Between表“在两者之间”，后接复数名词或代词，如“between you and me”，不能接单个时间段，错误。因此正确答案为D。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "____ the summer vacation, many students in our school take part in volunteer activities in the community. A. To  B. Above  C. Between  D. During",
  "answer": "D",
  "grammarPoint": "时间介词",
  "category": "介词",
  "type": "choice",
  "analysis": "本题考查时间介词的用法，难度中等。题干核心是“在暑假期间”，summer vacation是明确的时间段，时间介词during后接时间段，表“在……期间内”，符合语境。选项A.To表方向或时间范围终点，如“walk to the park”“until 5 o'clock to 7 o'clock”，不用于时间段内的动作描述；选项B.Above表空间位置高于某物，如“clouds above the mountains”，与时间语境无关；选项C.Between表“在两者之间”，需搭配“between A and B”结构，如“between two cities”，不能单独接时间段，错误。因此正确答案为D。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "____ the Dragon Boat Festival, people in my hometown usually hold dragon boat races on the river. A. To  B. Above  C. Between  D. During",
  "answer": "D",
  "grammarPoint": "时间介词",
  "category": "介词",
  "type": "choice",
  "analysis": "本题考查时间介词的辨析，难度中等。题干表示“在端午节期间”，Dragon Boat Festival是特定时间段，during作为时间介词，后接时间段表“在……期间”，符合“节日期间开展某活动”的语境。选项A.To表“到……、向……”，如“send a gift to her”，不用于时间表达；选项B.Above表空间位置，如“a bridge above the river”，与时间无关；选项C.Between表“两者之间”，如“between morning and afternoon”，需明确两个时间点，不能接单个节日时间段，错误。因此正确答案为D。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "____ the winter holiday, my family often visits my grandparents in the countryside. A. To  B. Above  C. Between  D. During",
  "answer": "D",
  "grammarPoint": "时间介词",
  "category": "介词",
  "type": "choice",
  "analysis": "本题考查时间介词的用法，难度中等。题干核心是“在寒假期间”，winter holiday是时间段，during后接时间段表“在……期间”，符合“假期内进行某活动”的逻辑。选项A.To表方向或时间终点，如“travel to Yunnan”“from December to January”，不用于描述时间段内的动作；选项B.Above表空间位置，如“snow above the mountains”，与时间语境不符；选项C.Between表“在两者之间”，如“between two holidays”，需搭配两个对象，不能单独接单个假期，错误。因此正确答案为D。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "____ the Mid-Autumn Festival, mooncakes and fruits are prepared in almost every family. A. To  B. Above  C. Between  D. During",
  "answer": "D",
  "grammarPoint": "时间介词",
  "category": "介词",
  "type": "choice",
  "analysis": "本题考查时间介词的辨析，难度中等。题干表示“在中秋节期间”，Mid-Autumn Festival是时间段，during作为时间介词，专门用于后接时间段表“在……期间”，符合语境。选项A.To表“朝向、到”，如“go to the moon festival”，不用于表示“期间”；选项B.Above表空间位置，如“the moon above the house”，与时间无关；选项C.Between表“两者之间”，如“between lunch and dinner”，需明确两个时间点，不能接单个节日，错误。因此正确答案为D。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Whose notebook is this? —It ____ be Lily's. Look! Her favorite sticker is on the cover. A. must  B. need  C. mustn't  D. needn't",
  "answer": "A",
  "grammarPoint": "情态动词",
  "category": "动词",
  "type": "choice",
  "analysis": "本题考查情态动词表推测的用法，难度中等。根据答句“封面有她最喜欢的贴纸”这一明确依据，可进行肯定推测，情态动词must表“一定、肯定”，符合语境。选项B.need表“需要”，侧重需求，如“I need a notebook”，不用于推测；选项C.mustn't表“禁止、不许”，如“You mustn't write on the wall”，是禁止性语气，与推测无关；选项D.needn't表“不必”，如“You needn't bring your notebook”，表建议，不用于肯定推测，错误。因此正确答案为A。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Whose schoolbag is that? —It ____ be Tom's. Look! His student ID card is inside it. A. must  B. need  C. mustn't  D. needn't",
  "answer": "A",
  "grammarPoint": "情态动词",
  "category": "动词",
  "type": "choice",
  "analysis": "本题考查情态动词表肯定推测的用法，难度中等。答句“里面有他的学生证”是明确的证据，说明对“是汤姆的书包”这一结论有十足把握，must表“一定、肯定”，符合肯定推测的语境。选项B.need表“需要”，如“The schoolbag needs washing”，强调需求，不用于推测；选项C.mustn't表“禁止”，如“Mustn't take the student ID card away”，是禁止性表达，与推测无关；选项D.needn't表“不必”，如“You needn't look for it”，表建议，不能用于肯定推测，错误。因此正确答案为A。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Whose pen is this? —It ____ be Jack's. Look! His name is carved on it. A. must  B. need  C. mustn't  D. needn't",
  "answer": "A",
  "grammarPoint": "情态动词",
  "category": "动词",
  "type": "choice",
  "analysis": "本题考查情态动词的推测用法，难度中等。根据“笔上刻着他的名字”这一直接依据，可进行肯定推测，must表“一定”，符合逻辑。选项B.need表“需要”，如“The pen needs ink”，侧重客观需求，不用于推测；选项C.mustn't表“禁止”，如“You mustn't use others' pens”，是禁止性语气，与推测语境不符；选项D.needn't表“不必”，如“You needn't ask him”，表建议，不能用于肯定推测，错误。因此正确答案为A。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Whose umbrella is that? —It ____ be Lucy's. Look! There's a small flower pattern on it, which she likes very much. A. must  B. need  C. mustn't  D. needn't",
  "answer": "A",
  "grammarPoint": "情态动词",
  "category": "动词",
  "type": "choice",
  "analysis": "本题考查情态动词表肯定推测的用法，难度中等。答句“上面有她非常喜欢的小花图案”是有力依据，说明“一定是露西的雨伞”，must表肯定推测，符合语境。选项B.need表“需要”，如“The umbrella needs repairing”，强调需求，不用于推测；选项C.mustn't表“禁止”，如“You mustn't take others' umbrellas”，是禁止性表达，与推测无关；选项D.needn't表“不必”，如“You needn't wait for her”，表建议，不能用于肯定推测，错误。因此正确答案为A。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Whose cup is this? —It ____ be David's. Look! His favorite team's logo is on it. A. must  B. need  C. mustn't  D. needn't",
  "answer": "A",
  "grammarPoint": "情态动词",
  "category": "动词",
  "type": "choice",
  "analysis": "本题考查情态动词的推测用法，难度中等。根据“上面有他最喜欢的球队标志”这一明确依据，可确定是大卫的杯子，must表“一定、肯定”，用于肯定推测，符合逻辑。选项B.need表“需要”，如“The cup needs cleaning”，侧重需求，不用于推测；选项C.mustn't表“禁止”，如“You mustn't break the cup”，是禁止性语气，与推测语境不符；选项D.needn't表“不必”，如“You needn't find it for him”，表建议，不能用于肯定推测，错误。因此正确答案为A。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  
    {
      "text": "____ the summer vacation, many children join different interest classes to learn new skills.",
      "answer": "D",
      "grammarPoint": "时间介词",
      "category": "介词",
      "type": "choice",
      "analysis": "本题考查时间介词的用法。句意为“在暑假期间，许多孩子参加不同的兴趣班学习新技能”。空格后是'the summer vacation'（暑假），这是一个时间段，表示在此期间发生的动作，应使用表示“在……期间”的介词。'During'后接时间段，意为“在……期间”，符合语境。选项A 'To' 表示方向或目的，不表时间。选项B 'Above' 表示位置“在……上方”。选项C 'Between' 表示“在两者之间”，通常用于两个具体时间点之间。三者均不符合此处的时间段语境。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "____ the night, the temperature drops quickly in the desert, so travelers need warm clothes.",
      "answer": "B",
      "grammarPoint": "时间介词",
      "category": "介词",
      "type": "choice",
      "analysis": "本题考查时间介词的用法。句意为“在夜间，沙漠温度下降很快，所以旅行者需要保暖衣物”。空格后是'the night'（夜晚），这是一个时间段，表示在此期间发生的情况。'During'后接时间段，意为“在……期间”，符合语境。选项B 'During'是正确答案。选项A 'At' 通常用于具体的时刻点（如 at night），但这里'the night'前有定冠词，表示特指的夜晚，用during更强调时间段。选项C 'On' 用于具体的某一天或日期。选项D 'For' 表示持续一段时间，强调长度，但这里更强调在该时间段内发生的变化。综合考虑，During是最佳选择。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "My grandfather likes to take a walk in the park ____ the early morning to enjoy the fresh air.",
      "answer": "C",
      "grammarPoint": "时间介词",
      "category": "介词",
      "type": "choice",
      "analysis": "本题考查时间介词的用法。句意为“我祖父喜欢在清晨去公园散步，享受新鲜空气”。空格后是'the early morning'（清晨），这是一个时间段，表示在此期间发生的习惯性动作。'In'用于一天中的某段时间（如 in the morning, in the afternoon, in the evening），是固定搭配。选项C 'In' 是正确答案。选项A 'On' 用于具体的某一天早上（如 on Monday morning）。选项B 'At' 用于具体时刻点（如 at 6 o'clock）。选项D 'During' 也可表示“在……期间”，但'morning'前有'early'修饰，通常用'in'更自然。此处'in the early morning'是常见表达。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "____ the meeting, please turn off your mobile phone or set it to silent mode.",
      "answer": "A",
      "grammarPoint": "时间介词",
      "category": "介词",
      "type": "choice",
      "analysis": "本题考查时间介词的用法。句意为“在会议期间，请关闭您的手机或将其设为静音模式”。空格后是'the meeting'（会议），这是一个事件，表示在该事件进行期间，应使用表示“在……期间”的介词。'During'后接事件或时间段，意为“在……期间”，符合语境。选项A 'During'是正确答案。选项B 'Between' 表示“在两者之间”。选项C 'Above' 表示位置“在……上方”。选项D 'To' 表示方向或目的。三者均不符合此处的时间段语境。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "We usually have a big family dinner ____ New Year's Eve to celebrate the coming year.",
      "answer": "D",
      "grammarPoint": "时间介词",
      "category": "介词",
      "type": "choice",
      "analysis": "本题考查时间介词的用法。句意为“我们通常在除夕夜吃一顿丰盛的家庭晚餐来庆祝新年的到来”。空格后是'New Year's Eve'（除夕夜），这是一个特定的节日夜晚，在具体某一天或某个晚上，应使用介词'on'。'On'用于具体的某一天或某一天的上午/下午/晚上。选项D 'On'是正确答案。选项A 'In' 用于较长的时间段，如年、月、季节，或一天中的部分（如 in the evening）。选项B 'At' 用于具体时刻点或较短的假期（如 at Christmas）。选项C 'During' 后接时间段，虽然也可用于节日，但'New Year's Eve'是具体的一天，用'on'更准确。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
  
  
  
  
  
  
  
  
  {
  "text": "____ wonderful trip! We visited the ancient town and enjoyed local food. A. How  B. What  C. What a  D. What an",
  "answer": "C",
  "grammarPoint": "感叹句",
  "category": "特殊句式",
  "type": "choice",
  "analysis": "本题考查感叹句的基本结构，难度中等。感叹句中，修饰可数名词单数需用“what+a/an+形容词+可数名词单数！”结构。句中“trip”是可数名词单数，“wonderful”以辅音音素/w/开头，故用“what a”。选项A.How用于修饰形容词或副词，结构为“How+形容词/副词+主谓！”，如“How wonderful the trip is!”，此处缺少主谓，用法错误；选项B.What后接可数名词复数或不可数名词，如“What wonderful trips!”，单独使用不符合单数名词的修饰要求；选项D.What an用于修饰以元音音素开头的形容词+可数名词单数，如“What an exciting trip!”，“wonderful”是辅音音素开头，故错误。因此正确答案为C。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "____ great experience! We helped farmers pick apples and learned a lot about farming. A. How  B. What  C. What a  D. What an",
  "answer": "C",
  "grammarPoint": "感叹句",
  "category": "特殊句式",
  "type": "choice",
  "analysis": "本题考查感叹句的结构辨析，难度中等。“experience”此处表示“一次经历”，是可数名词单数，“great”以辅音音素/g/开头，符合“what+a+形容词+可数名词单数！”的感叹句结构。选项A.How的正确用法是“How+形容词+主谓！”，如“How great the experience is!”，此处无主谓，错误；选项B.What后接可数名词复数或不可数名词，如“What great experiences!”，无法修饰单数名词；选项D.What an用于元音音素开头的形容词前，如“What an interesting experience!”，“great”是辅音音素开头，故错误。因此正确答案为C。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "____ valuable lesson! Our teacher taught us how to face difficulties bravely. A. How  B. What  C. What a  D. What an",
  "answer": "C",
  "grammarPoint": "感叹句",
  "category": "特殊句式",
  "type": "choice",
  "analysis": "本题考查感叹句的用法，难度中等。“lesson”是可数名词单数，“valuable”以辅音音素/v/开头，需用“what+a+形容词+可数名词单数！”的结构。选项A.How用于修饰形容词或副词，需搭配主谓，如“How valuable the lesson is!”，此处缺少主谓，用法错误；选项B.What后接复数名词或不可数名词，如“What valuable lessons!”，不能修饰单数名词；选项D.What an用于元音音素开头的形容词前，如“What an important lesson!”，“valuable”是辅音音素开头，故错误。因此正确答案为C。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "____ fantastic moment! We took photos with our favorite singer at the concert. A. How  B. What  C. What a  D. What an",
  "answer": "C",
  "grammarPoint": "感叹句",
  "category": "特殊句式",
  "type": "choice",
  "analysis": "本题考查感叹句的结构，难度中等。“moment”是可数名词单数，“fantastic”以辅音音素/f/开头，符合“what+a+形容词+可数名词单数！”的感叹句结构。选项A.How的正确用法是“How+形容词+主谓！”，如“How fantastic the moment is!”，此处无主谓，错误；选项B.What后接可数名词复数或不可数名词，如“What fantastic moments!”，无法修饰单数名词；选项D.What an用于元音音素开头的形容词前，如“What an amazing moment!”，“fantastic”是辅音音素开头，故错误。因此正确答案为C。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "____ memorable journey! We crossed the mountains and saw beautiful natural scenery. A. How  B. What  C. What a  D. What an",
  "answer": "C",
  "grammarPoint": "感叹句",
  "category": "特殊句式",
  "type": "choice",
  "analysis": "本题考查感叹句的辨析，难度中等。“journey”是可数名词单数，“memorable”以辅音音素/m/开头，需用“what+a+形容词+可数名词单数！”的结构。选项A.How用于修饰形容词或副词，需搭配主谓，如“How memorable the journey is!”，此处缺少主谓，用法错误；选项B.What后接复数名词或不可数名词，如“What memorable journeys!”，不能修饰单数名词；选项D.What an用于元音音素开头的形容词前，如“What an unforgettable journey!”，“memorable”是辅音音素开头，故错误。因此正确答案为C。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  
  
  
    {
      "text": "____ beautiful painting! The colors are so bright and full of life.",
      "answer": "C",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "choice",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'beautiful painting'，其中painting是可数名词单数，beautiful以辅音音素开头，因此感叹句结构为'What a + adj. + 可数名词单数！'。选项C 'What a' 符合此结构。选项A 'How' 用于修饰形容词或副词（如How beautiful!），但此处中心词是名词。选项B 'What' 后接不可数名词或可数名词复数。选项D 'What an' 用于元音音素开头的形容词前，但beautiful以辅音音素开头。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "____ exciting football match we watched last night! Our team won in the last minute.",
      "answer": "D",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "choice",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'exciting football match'，其中match是可数名词单数，exciting以元音音素开头，因此感叹句结构为'What an + adj. + 可数名词单数！'。选项D 'What an' 符合此结构。选项A 'How' 用于修饰形容词或副词。选项B 'What' 后接不可数名词或可数名词复数，但此处是单数，且exciting以元音音素开头，需要an。选项C 'What a' 用于辅音音素开头的形容词前。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "____ delicious the homemade cookies taste! Could you give me the recipe?",
      "answer": "A",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "choice",
      "analysis": "本题考查感叹句的结构。中心词是形容词'delicious'，因此感叹句结构为'How + adj. + 主语 + 谓语！'。选项A 'How' 符合此结构。选项B 'What' 用于修饰名词。选项C 'What a' 和选项D 'What an' 均用于修饰可数名词单数。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "____ lovely children they are! They helped the old lady carry her groceries.",
      "answer": "B",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "choice",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'lovely children'，其中children是可数名词复数，因此感叹句结构为'What + adj. + 可数名词复数！'。选项B 'What' 符合此结构。选项A 'How' 用于修饰形容词或副词。选项C 'What a' 和选项D 'What an' 均用于修饰可数名词单数。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "____ terrible weather we are having these days! It has been raining for a week.",
      "answer": "B",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "choice",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'terrible weather'，其中weather是不可数名词，因此感叹句结构为'What + adj. + 不可数名词！'。选项B 'What' 符合此结构。选项A 'How' 用于修饰形容词或副词。选项C 'What a' 和选项D 'What an' 均用于修饰可数名词单数，而weather不可数。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-Mike, I called you at 8 o'clock last night, but no one answered.\n-Oh, sorry. I ____ a basketball game on TV with my brother then.",
      "answer": "D",
      "grammarPoint": "过去进行时",
      "category": "动词时态",
      "type": "choice",
      "analysis": "本题考查过去进行时的用法。时间标志是'at 8 o'clock last night'（昨晚8点）和'then'（那时），表示过去某一具体时刻正在进行的动作。主语I，谓语动词应使用过去进行时，结构为'was/were + doing'。此处主语为I，用was。选项D 'was watching' 是过去进行时，符合语境。选项A 'will watch' 是一般将来时。选项B 'have watched' 是现在完成时。选项C 'am watching' 是现在进行时。三者均不能表示过去某一时刻正在进行的动作。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-Why didn't you answer my phone when I called you this morning?\n-I ____ in the library and had my phone on silent mode.",
      "answer": "C",
      "grammarPoint": "过去进行时",
      "category": "动词时态",
      "type": "choice",
      "analysis": "本题考查过去进行时的用法。问句隐含了过去某个时间点（打电话时）的动作。答句描述在打电话那个时刻正在进行的动作，应使用过去进行时。主语I，谓语动词应使用过去进行时，结构为'was/were + doing'。此处主语为I，用was。选项C 'was studying' 是过去进行时，符合语境。选项A 'study' 是一般现在时。选项B 'will study' 是一般将来时。选项D 'have studied' 是现在完成时。三者均不能表示过去某一时刻正在进行的动作。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-What were you doing when the heavy rain started yesterday afternoon?\n-We ____ football on the playground and had to run to the classroom.",
      "answer": "B",
      "grammarPoint": "过去进行时",
      "category": "动词时态",
      "type": "choice",
      "analysis": "本题考查过去进行时的用法。问句使用过去进行时询问过去某一时刻（下雨开始时）正在进行的动作。答句需用过去进行时描述当时正在进行的动作。主语we，谓语动词应使用过去进行时，结构为'was/were + doing'。此处主语为we，用were。选项B 'were playing' 是过去进行时，符合语境。选项A 'played' 是一般过去时，表示完成的动作，但此处强调正在进行的动作被下雨打断。选项C 'are playing' 是现在进行时。选项D 'will play' 是一般将来时。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-I saw Lucy in the park at 4 p.m. yesterday. She ____ under a tree and reading a book.\n-Yes, she often goes there to relax.",
      "answer": "A",
      "grammarPoint": "过去进行时",
      "category": "动词时态",
      "type": "choice",
      "analysis": "本题考查过去进行时的用法。时间标志是'at 4 p.m. yesterday'（昨天下午4点），表示过去某一具体时刻。描述当时正在进行的动作，应使用过去进行时。主语she，谓语动词应使用过去进行时，结构为'was/were + doing'。此处主语为she，用was。选项A 'was sitting' 是过去进行时，符合语境。选项B 'sits' 是一般现在时。选项C 'has sat' 是现在完成时。选项D 'will sit' 是一般将来时。三者均不能表示过去某一时刻正在进行的动作。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-Did you hear the strange noise last night?\n-No, I ____ deeply at that time and didn't wake up.",
      "answer": "D",
      "grammarPoint": "过去进行时",
      "category": "动词时态",
      "type": "choice",
      "analysis": "本题考查过去进行时的用法。答句中的'at that time'指代问句中'last night'的某个时刻，表示过去某一时刻正在进行的动作。主语I，谓语动词应使用过去进行时，结构为'was/were + doing'。此处主语为I，用was。选项D 'was sleeping' 是过去进行时，符合语境。选项A 'sleep' 是一般现在时。选项B 'slept' 是一般过去时，表示完成的动作，但此处强调当时正在进行的状态。选项C 'will sleep' 是一般将来时。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
  
  
  {
  "text": "—Peter, I didn't see you at the library at 8 last night. —Oh, I ____ dinner for my family at that time. A. will practice  B. have practiced  C. am practicing  D. was practicing",
  "answer": "D",
  "grammarPoint": "过去进行时",
  "category": "动词时态",
  "type": "choice",
  "analysis": "本题考查过去进行时的用法，难度中等。时间标志词“at 8 last night”“at that time”表示“过去某一具体时刻正在进行的动作”，需用过去进行时，结构为“was/were+动词-ing”。主语是I，故用“was practicing”（此处“practicing”结合语境替换为“cooking”，符合动作逻辑）。选项A.will practice是一般将来时，用于表示未来将要发生的动作，如“I will cook dinner tomorrow”，与“last night”时间冲突；选项B.have practiced是现在完成时，强调过去动作对现在的影响，如“I have cooked dinner, so we can eat now”，无“过去某一时刻正在进行”的含义；选项C.am practicing是现在进行时，用于表示当前正在进行的动作，如“I am cooking dinner now”，与“last night”矛盾。因此正确答案为D。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Lisa, where were you at this time yesterday? I called you but no one answered. —Oh, I ____ a book in the school reading room. A. will practice  B. have practiced  C. am practicing  D. was practicing",
  "answer": "D",
  "grammarPoint": "过去进行时",
  "category": "动词时态",
  "type": "choice",
  "analysis": "本题考查过去进行时的应用，难度中等。时间标志词“at this time yesterday”表示“过去同一时刻正在进行的动作”，需用过去进行时“was/were+动词-ing”。主语I对应“was”，“reading a book”符合语境，故用“was practicing”（替换为“was reading”贴合动作）。选项A.will practice是一般将来时，表未来动作，如“I will read a book tomorrow”，与“yesterday”时间不符；选项B.have practiced是现在完成时，强调动作持续或对现在的影响，如“I have read three books this week”，无“过去正在进行”的含义；选项C.am practicing是现在进行时，表当前动作，如“I am reading a book now”，与“yesterday”矛盾。因此正确答案为D。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Tom, why didn't you reply to my message at 7 yesterday evening? —Sorry, I ____ clothes for my little sister at that time. A. will practice  B. have practiced  C. am practicing  D. was practicing",
  "answer": "D",
  "grammarPoint": "过去进行时",
  "category": "动词时态",
  "type": "choice",
  "analysis": "本题考查过去进行时的用法，难度中等。时间标志词“at 7 yesterday evening”“at that time”明确指向“过去某一时刻正在进行的动作”，需用过去进行时“was/were+动词-ing”。主语I搭配“was”，“washing clothes”符合语境，对应“was practicing”（替换为“was washing”）。选项A.will practice是一般将来时，表未来动作，如“I will wash clothes tomorrow”，与“yesterday evening”冲突；选项B.have practiced是现在完成时，强调动作结果或持续，如“I have washed all the clothes”，无“过去正在进行”的含义；选项C.am practicing是现在进行时，表当前动作，如“I am washing clothes now”，与过去时间矛盾。因此正确答案为D。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Anna, I didn't find you in the art room at 3 o'clock last Saturday afternoon. —Oh, I ____ a picture for the school exhibition at that time. A. will practice  B. have practiced  C. am practicing  D. was practicing",
  "answer": "D",
  "grammarPoint": "过去进行时",
  "category": "动词时态",
  "type": "choice",
  "analysis": "本题考查过去进行时的判断，难度中等。时间标志词“at 3 o'clock last Saturday afternoon”表示“过去具体时刻正在进行的动作”，需用过去进行时“was/were+动词-ing”。主语I对应“was”，“drawing a picture”符合语境，即“was practicing”（替换为“was drawing”）。选项A.will practice是一般将来时，表未来动作，如“I will draw a picture next week”，与“last Saturday afternoon”时间不符；选项B.have practiced是现在完成时，强调动作对现在的影响，如“I have drawn three pictures”，无“过去正在进行”的含义；选项C.am practicing是现在进行时，表当前动作，如“I am drawing a picture now”，与过去时间矛盾。因此正确答案为D。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "—Jack, where were you when your friends came to your home yesterday? —I ____ my homework in my bedroom at that time. A. will practice  B. have practiced  C. am practicing  D. was practicing",
  "answer": "D",
  "grammarPoint": "过去进行时",
  "category": "动词时态",
  "type": "choice",
  "analysis": "本题考查过去进行时的用法，难度中等。时间标志词“when your friends came to your home yesterday”“at that time”表示“过去某一时刻（朋友来访时）正在进行的动作”，需用过去进行时“was/were+动词-ing”。主语I搭配“was”，“doing my homework”符合语境，即“was practicing”（替换为“was doing”）。选项A.will practice是一般将来时，表未来动作，如“I will do my homework tonight”，与“yesterday”冲突；选项B.have practiced是现在完成时，强调动作完成或持续，如“I have done my homework”，无“过去正在进行”的含义；选项C.am practicing是现在进行时，表当前动作，如“I am doing my homework now”，与过去时间矛盾。因此正确答案为D。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  
  
  
  
  {
  "text": "English ____ by millions of students in middle schools across the country these days. A. learn  B. learned  C. is learned  D. was learned",
  "answer": "C",
  "grammarPoint": "一般时态的被动语态",
  "category": "被动语态",
  "type": "choice",
  "analysis": "本题考查一般现在时的被动语态，难度中等。主语English与动词learn是被动关系（英语被学习），时间状语“these days”表示当前的情况，需用一般现在时的被动语态，结构为“am/is/are+过去分词”，learn的过去分词是learned，故正确答案为C。选项A.learn是动词原形，用于一般现在时主动语态，如“Students learn English”，此处主语是English，需被动，错误；选项B.learned是动词过去式，用于一般过去时主动语态，如“Students learned English last year”，无被动含义且时态不符；选项D.was learned是一般过去时的被动语态，用于过去时间语境，如“English was learned by fewer people 50 years ago”，与“these days”矛盾，错误。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "Yoga ____ by more and more people for keeping healthy these days. A. practice  B. practiced  C. is practiced  D. was practiced",
  "answer": "C",
  "grammarPoint": "一般时态的被动语态",
  "category": "被动语态",
  "type": "choice",
  "analysis": "本题考查一般现在时被动语态的用法，难度中等。主语Yoga与动词practice是被动关系（瑜伽被练习），“these days”提示时态为一般现在时，被动语态结构为“am/is/are+过去分词”，practice的过去分词是practiced，因此选C。选项A.practice是主动语态原形，如“People practice yoga”，主语Yoga不能主动发出“practice”的动作，错误；选项B.practiced是一般过去时主动语态，如“People practiced yoga last month”，无被动含义且时态不符；选项D.was practiced是一般过去时被动语态，用于过去语境，如“Yoga was practiced by a few people in the past”，与“these days”冲突，错误。",
  "difficulty": "medium",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  
  //这里是九百多行的那套题
  
   {
      "text": "____ beautiful painting! The colors are so bright and full of life.",
      "answer": "C",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "choice",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'beautiful painting'，其中painting是可数名词单数，beautiful以辅音音素开头，因此感叹句结构为'What a + adj. + 可数名词单数！'。选项C 'What a' 符合此结构。选项A 'How' 用于修饰形容词或副词（如How beautiful!），但此处中心词是名词。选项B 'What' 后接不可数名词或可数名词复数。选项D 'What an' 用于元音音素开头的形容词前，但beautiful以辅音音素开头。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "____ exciting football match we watched last night! Our team won in the last minute.",
      "answer": "D",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "choice",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'exciting football match'，其中match是可数名词单数，exciting以元音音素开头，因此感叹句结构为'What an + adj. + 可数名词单数！'。选项D 'What an' 符合此结构。选项A 'How' 用于修饰形容词或副词。选项B 'What' 后接不可数名词或可数名词复数，但此处是单数，且exciting以元音音素开头，需要an。选项C 'What a' 用于辅音音素开头的形容词前。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "____ delicious the homemade cookies taste! Could you give me the recipe?",
      "answer": "A",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "choice",
      "analysis": "本题考查感叹句的结构。中心词是形容词'delicious'，因此感叹句结构为'How + adj. + 主语 + 谓语！'。选项A 'How' 符合此结构。选项B 'What' 用于修饰名词。选项C 'What a' 和选项D 'What an' 均用于修饰可数名词单数。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "____ lovely children they are! They helped the old lady carry her groceries.",
      "answer": "B",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "choice",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'lovely children'，其中children是可数名词复数，因此感叹句结构为'What + adj. + 可数名词复数！'。选项B 'What' 符合此结构。选项A 'How' 用于修饰形容词或副词。选项C 'What a' 和选项D 'What an' 均用于修饰可数名词单数。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "____ terrible weather we are having these days! It has been raining for a week.",
      "answer": "B",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "choice",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'terrible weather'，其中weather是不可数名词，因此感叹句结构为'What + adj. + 不可数名词！'。选项B 'What' 符合此结构。选项A 'How' 用于修饰形容词或副词。选项C 'What a' 和选项D 'What an' 均用于修饰可数名词单数，而weather不可数。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-Mike, I called you at 8 o'clock last night, but no one answered.\n-Oh, sorry. I ____ a basketball game on TV with my brother then.",
      "answer": "D",
      "grammarPoint": "过去进行时",
      "category": "动词时态",
      "type": "choice",
      "analysis": "本题考查过去进行时的用法。时间标志是'at 8 o'clock last night'（昨晚8点）和'then'（那时），表示过去某一具体时刻正在进行的动作。主语I，谓语动词应使用过去进行时，结构为'was/were + doing'。此处主语为I，用was。选项D 'was watching' 是过去进行时，符合语境。选项A 'will watch' 是一般将来时。选项B 'have watched' 是现在完成时。选项C 'am watching' 是现在进行时。三者均不能表示过去某一时刻正在进行的动作。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-Why didn't you answer my phone when I called you this morning?\n-I ____ in the library and had my phone on silent mode.",
      "answer": "C",
      "grammarPoint": "过去进行时",
      "category": "动词时态",
      "type": "choice",
      "analysis": "本题考查过去进行时的用法。问句隐含了过去某个时间点（打电话时）的动作。答句描述在打电话那个时刻正在进行的动作，应使用过去进行时。主语I，谓语动词应使用过去进行时，结构为'was/were + doing'。此处主语为I，用was。选项C 'was studying' 是过去进行时，符合语境。选项A 'study' 是一般现在时。选项B 'will study' 是一般将来时。选项D 'have studied' 是现在完成时。三者均不能表示过去某一时刻正在进行的动作。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-What were you doing when the heavy rain started yesterday afternoon?\n-We ____ football on the playground and had to run to the classroom.",
      "answer": "B",
      "grammarPoint": "过去进行时",
      "category": "动词时态",
      "type": "choice",
      "analysis": "本题考查过去进行时的用法。问句使用过去进行时询问过去某一时刻（下雨开始时）正在进行的动作。答句需用过去进行时描述当时正在进行的动作。主语we，谓语动词应使用过去进行时，结构为'was/were + doing'。此处主语为we，用were。选项B 'were playing' 是过去进行时，符合语境。选项A 'played' 是一般过去时，表示完成的动作，但此处强调正在进行的动作被下雨打断。选项C 'are playing' 是现在进行时。选项D 'will play' 是一般将来时。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-I saw Lucy in the park at 4 p.m. yesterday. She ____ under a tree and reading a book.\n-Yes, she often goes there to relax.",
      "answer": "A",
      "grammarPoint": "过去进行时",
      "category": "动词时态",
      "type": "choice",
      "analysis": "本题考查过去进行时的用法。时间标志是'at 4 p.m. yesterday'（昨天下午4点），表示过去某一具体时刻。描述当时正在进行的动作，应使用过去进行时。主语she，谓语动词应使用过去进行时，结构为'was/were + doing'。此处主语为she，用was。选项A 'was sitting' 是过去进行时，符合语境。选项B 'sits' 是一般现在时。选项C 'has sat' 是现在完成时。选项D 'will sit' 是一般将来时。三者均不能表示过去某一时刻正在进行的动作。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "-Did you hear the strange noise last night?\n-No, I ____ deeply at that time and didn't wake up.",
      "answer": "D",
      "grammarPoint": "过去进行时",
      "category": "动词时态",
      "type": "choice",
      "analysis": "本题考查过去进行时的用法。答句中的'at that time'指代问句中'last night'的某个时刻，表示过去某一时刻正在进行的动作。主语I，谓语动词应使用过去进行时，结构为'was/were + doing'。此处主语为I，用was。选项D 'was sleeping' 是过去进行时，符合语境。选项A 'sleep' 是一般现在时。选项B 'slept' 是一般过去时，表示完成的动作，但此处强调当时正在进行的状态。选项C 'will sleep' 是一般将来时。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
  
  
  
  
    {
      "text": "My sister ________ (visit) the zoo with her friends yesterday afternoon.",
      "answer": "visited",
      "grammarPoint": "一般过去时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查一般过去时的用法。句中有明确表示过去的时间状语'yesterday afternoon'（昨天下午），因此谓语动词需用过去式。动词visit的过去式是visited。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "We ________ (watch) a very interesting movie last weekend.",
      "answer": "watched",
      "grammarPoint": "一般过去时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查一般过去时的用法。句中有明确表示过去的时间状语'last weekend'（上周末），因此谓语动词需用过去式。动词watch的过去式是watched。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "I ________ (help) my mother clean the house this morning.",
      "answer": "helped",
      "grammarPoint": "一般过去时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查一般过去时的用法。句中有明确表示过去的时间状语'this morning'（今天早上），这个时间通常在过去（相对于说话时刻），因此谓语动词需用过去式。动词help的过去式是helped。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "He ________ (do) his homework two hours ago.",
      "answer": "did",
      "grammarPoint": "一般过去时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查一般过去时的用法。句中有明确表示过去的时间状语'two hours ago'（两小时前），因此谓语动词需用过去式。动词do的过去式是did。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "She ________ (buy) a new school bag last month.",
      "answer": "bought",
      "grammarPoint": "一般过去时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查一般过去时的用法。句中有明确表示过去的时间状语'last month'（上个月），因此谓语动词需用过去式。动词buy的过去式是bought。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "The blue bike under the tree is ________ (I). I rode it to school today.",
      "answer": "mine",
      "grammarPoint": "物主代词",
      "category": "代词",
      "type": "fill_blank",
      "analysis": "本题考查名词性物主代词的用法。空格位于系动词is之后，且后面没有名词，需要一个能独立作表语、表示“我的自行车”的代词。mine是名词性物主代词，相当于my bike。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "Is this English dictionary ________ (you)? It looks like yours.",
      "answer": "yours",
      "grammarPoint": "物主代词",
      "category": "代词",
      "type": "fill_blank",
      "analysis": "本题考查名词性物主代词的用法。空格位于系动词is之后，且后面没有名词，需要一个能独立作表语、表示“你的字典”的代词。yours是名词性物主代词，相当于your dictionary。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "That football isn’t ________ (he). His is over there.",
      "answer": "his",
      "grammarPoint": "物主代词",
      "category": "代词",
      "type": "fill_blank",
      "analysis": "本题考查名词性物主代词的用法。空格位于系动词isn't之后，且后面没有名词，需要一个能独立作表语、表示“他的足球”的代词。his既是形容词性物主代词，也是名词性物主代词，在此处作为名词性物主代词，相当于his football。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "This clean and bright classroom is ________ (we). We clean it every day.",
      "answer": "ours",
      "grammarPoint": "物主代词",
      "category": "代词",
      "type": "fill_blank",
      "analysis": "本题考查名词性物主代词的用法。空格位于系动词is之后，且后面没有名词，需要一个能独立作表语、表示“我们的教室”的代词。ours是名词性物主代词，相当于our classroom。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "The big house with a garden is ________ (they). They moved in last year.",
      "answer": "theirs",
      "grammarPoint": "物主代词",
      "category": "代词",
      "type": "fill_blank",
      "analysis": "本题考查名词性物主代词的用法。空格位于系动词is之后，且后面没有名词，需要一个能独立作表语、表示“他们的房子”的代词。theirs是名词性物主代词，相当于their house。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
  
    {
      "text": "My brother practices ________ (play) the piano for two hours every day.",
      "answer": "playing",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查固定搭配'practice doing sth.'的用法，意为'练习做某事'。动词practice后应接动名词作宾语，play的动名词形式是playing。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "You need to practice ________ (write) a diary in English to improve your writing skills.",
      "answer": "writing",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查固定搭配'practice doing sth.'的用法。动词practice后应接动名词作宾语，write的动名词形式是writing。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "She practices ________ (swim) in the pool every weekend to prepare for the competition.",
      "answer": "swimming",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查固定搭配'practice doing sth.'的用法。动词practice后应接动名词作宾语，swim的动名词形式是swimming。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "They often practice ________ (draw) in the park to become better artists.",
      "answer": "drawing",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查固定搭配'practice doing sth.'的用法。动词practice后应接动名词作宾语，draw的动名词形式是drawing。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "To join the school choir, you should practice ________ (sing) every afternoon.",
      "answer": "singing",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查固定搭配'practice doing sth.'的用法。动词practice后应接动名词作宾语，sing的动名词形式是singing。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "________ a wonderful party it was! Everyone enjoyed themselves.",
      "answer": "What",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "fill_blank",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'a wonderful party'，其中party是可数名词单数，因此感叹句结构为'What + a/an + adj. + 可数名词单数！'。wonderful以辅音音素开头，用'a'。句首应用What。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "________ an exciting football match we watched last night!",
      "answer": "What",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "fill_blank",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'an exciting football match'，其中match是可数名词单数，exciting以元音音素开头，因此感叹句结构为'What + an + adj. + 可数名词单数！'。句首应用What。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "________ a delicious dinner you cooked for us! Thank you very much.",
      "answer": "What",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "fill_blank",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'a delicious dinner'，其中dinner是可数名词单数，delicious以辅音音素开头，因此感叹句结构为'What + a + adj. + 可数名词单数！'。句首应用What。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "________ an interesting book this is! I can't put it down.",
      "answer": "What",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "fill_blank",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'an interesting book'，其中book是可数名词单数，interesting以元音音素开头，因此感叹句结构为'What + an + adj. + 可数名词单数！'。句首应用What。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "________ a clean and tidy room you have! It's very comfortable.",
      "answer": "What",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "fill_blank",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'a clean and tidy room'，其中room是可数名词单数，clean以辅音音素开头，因此感叹句结构为'What + a + adj. + 可数名词单数！'。句首应用What。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
  
  
  
  
    {
      "text": "The girl ________ won the singing competition is my best friend.",
      "answer": "who/that",
      "grammarPoint": "定语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查定语从句关系代词的用法。先行词是'The girl'（女孩），指人。定语从句'won the singing competition'中缺少主语。关系代词在从句中作主语，指人，应用who或that引导。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "I admire the scientist ________ made an important discovery in space science.",
      "answer": "who/that",
      "grammarPoint": "定语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查定语从句关系代词的用法。先行词是'the scientist'（科学家），指人。定语从句'made an important discovery in space science'中缺少主语。关系代词在从句中作主语，指人，应用who或that引导。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "The teacher ________ teaches us history is very humorous.",
      "answer": "who/that",
      "grammarPoint": "定语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查定语从句关系代词的用法。先行词是'The teacher'（老师），指人。定语从句'teaches us history'中缺少主语。关系代词在从句中作主语，指人，应用who或that引导。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "Do you know the musician ________ wrote this popular song?",
      "answer": "who/that",
      "grammarPoint": "定语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查定语从句关系代词的用法。先行词是'the musician'（音乐家），指人。定语从句'wrote this popular song'中缺少主语。关系代词在从句中作主语，指人，应用who或that引导。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
    {
      "text": "We should thank the volunteers ________ helped the old people in the community.",
      "answer": "who/that",
      "grammarPoint": "定语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查定语从句关系代词的用法。先行词是'the volunteers'（志愿者们），指人。定语从句'helped the old people in the community'中缺少主语。关系代词在从句中作主语，指人，应用who或that引导。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    },
   
    {
      "text": "The doctor advised the patient ________ (not eat) too much sugar.",
      "answer": "not to eat",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查动词不定式否定式在固定搭配中的用法。固定搭配'advise sb. (not) to do sth.'意为“建议某人（不要）做某事”。否定形式为'not to do'。因此答案为'not to eat'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "My friend warned me ________ (not worry) too much about the exam.",
      "answer": "not to worry",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查动词不定式否定式在固定搭配中的用法。固定搭配'warn sb. (not) to do sth.'意为“警告/告诫某人（不要）做某事”。否定形式为'not to do'。因此答案为'not to worry'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
  
  
    {
      "text": "There ________ (be) a book and two pens on the desk when I left.",
      "answer": "was",
      "grammarPoint": "就近原则",
      "category": "主谓一致",
      "type": "fill_blank",
      "analysis": "本题考查there be句型的就近原则和一般过去时。在there be句型中，谓语动词的单复数由最靠近它的主语决定。此处最靠近的主语是'a book'（单数），且时间状语'when I left'表示过去，因此谓语动词用单数过去式'was'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "There ________ (be) two apples and some bread in the fridge yesterday.",
      "answer": "were",
      "grammarPoint": "就近原则",
      "category": "主谓一致",
      "type": "fill_blank",
      "analysis": "本题考查there be句型的就近原则和一般过去时。在there be句型中，谓语动词的单复数由最靠近它的主语决定。此处最靠近的主语是'two apples'（复数），且时间状语'yesterday'表示过去，因此谓语动词用复数过去式'were'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "There ________ (be) some water and three cups on the table now.",
      "answer": "is",
      "grammarPoint": "就近原则",
      "category": "主谓一致",
      "type": "fill_blank",
      "analysis": "本题考查there be句型的就近原则和一般现在时。在there be句型中，谓语动词的单复数由最靠近它的主语决定。此处最靠近的主语是'some water'（不可数名词，视为单数），且时间状语'now'表示现在，因此谓语动词用单数现在式'is'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "There ________ (be) a cat and two dogs in the garden just now.",
      "answer": "was",
      "grammarPoint": "就近原则",
      "category": "主谓一致",
      "type": "fill_blank",
      "analysis": "本题考查there be句型的就近原则和一般过去时。在there be句型中，谓语动词的单复数由最靠近它的主语决定。此处最靠近的主语是'a cat'（单数），且时间状语'just now'表示过去，因此谓语动词用单数过去式'was'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "There ________ (be) three students and a teacher in the classroom at that time.",
      "answer": "were",
      "grammarPoint": "就近原则",
      "category": "主谓一致",
      "type": "fill_blank",
      "analysis": "本题考查there be句型的就近原则和一般过去时。在there be句型中，谓语动词的单复数由最靠近它的主语决定。此处最靠近的主语是'three students'（复数），且时间状语'at that time'表示过去，因此谓语动词用复数过去式'were'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
   
  
  
    {
      "text": "This is the most beautiful picture ________ I have ever seen.",
      "answer": "that",
      "grammarPoint": "定语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查定语从句关系代词的用法。先行词是picture，被形容词最高级the most beautiful修饰，此时关系代词只能用that引导，且that在从句中作宾语（have seen的宾语）。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "That is the funniest joke ________ I have ever heard.",
      "answer": "that",
      "grammarPoint": "定语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查定语从句关系代词的用法。先行词joke被形容词最高级the funniest修饰，关系代词只能用that引导，且that在从句中作heard的宾语。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "This is the most difficult problem ________ we need to solve.",
      "answer": "that",
      "grammarPoint": "定语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查定语从句关系代词的用法。先行词problem被形容词最高级the most difficult修饰，关系代词只能用that引导，且that在从句中作solve的宾语。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "It is the best movie ________ has been shown this year.",
      "answer": "that",
      "grammarPoint": "定语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查定语从句关系代词的用法。先行词movie被形容词最高级the best修饰，关系代词只能用that引导，且that在从句中作主语。注意：当关系代词在从句中作主语时，不能省略。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "There is ________ apple and an orange on the plate.",
      "answer": "an",
      "grammarPoint": "不定冠词",
      "category": "冠词",
      "type": "fill_blank",
      "analysis": "本题考查不定冠词的用法。apple是以元音音素开头的可数名词单数，因此前面用不定冠词an。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
   
    {
      "text": "I want to buy ________ umbrella for my mother because it's going to rain.",
      "answer": "an",
      "grammarPoint": "不定冠词",
      "category": "冠词",
      "type": "fill_blank",
      "analysis": "本题考查不定冠词的用法。umbrella以元音音素开头，且是可数名词单数，因此用不定冠词an。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "She is ________ English teacher. She teaches us English.",
      "answer": "an",
      "grammarPoint": "不定冠词",
      "category": "冠词",
      "type": "fill_blank",
      "analysis": "本题考查不定冠词的用法。English以元音音素开头，且teacher是可数名词单数，因此用不定冠词an。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    
  {
  "text": "There is ________ apple on the plate. You can eat it.",
  "answer": "an",
  "grammarPoint": "不定冠词",
  "category": "冠词",
  "type": "fill_blank",
  "analysis": "本题考查不定冠词的基础用法，难度简单。apple是可数名词单数，且以元音音素/ˈæ/开头，根据规则，前面需用不定冠词an修饰。题干句式简单（10词以内），语境是日常饮食场景，无生僻词汇，直接依据语法规则就能得出答案，符合easy难度要求。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "She wants to buy ________ orange for her little brother.",
  "answer": "an",
  "grammarPoint": "不定冠词",
  "category": "冠词",
  "type": "fill_blank",
  "analysis": "本题考查不定冠词的用法，难度简单。orange是可数名词单数，以元音音素/ˈɒ/（英）/ˈɔː/（美）开头，需用an修饰。语境是购物赠礼的日常场景，词汇基础常见，句式简短，学生掌握“元音音素开头的单数名词用an”的规则即可快速作答，符合easy难度标准。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "It will take ________ hour to finish the task.",
  "answer": "an",
  "grammarPoint": "不定冠词",
  "category": "冠词",
  "type": "fill_blank",
  "analysis": "本题考查不定冠词的核心考点，难度简单。hour是可数名词单数，首字母h不发音，以元音音素/aʊ/开头，需用an修饰。题干语境是完成任务的时间描述，词汇为中考必背词，虽涉及“h不发音”的特殊情况，但属于基础考点，符合easy难度要求。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "We saw ________ elephant in the zoo yesterday.",
  "answer": "an",
  "grammarPoint": "不定冠词",
  "category": "冠词",
  "type": "fill_blank",
  "analysis": "本题考查不定冠词的用法，难度简单。elephant是可数名词单数，以元音音素/ˈel/开头，需用an修饰。语境是动物园参观的日常场景，句式简单，词汇常见，学生掌握不定冠词的基础规则就能作答，符合easy难度标准。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  {
  "text": "Can you lend me ________ eraser? I forgot mine at home.",
  "answer": "an",
  "grammarPoint": "不定冠词",
  "category": "冠词",
  "type": "fill_blank",
  "analysis": "本题考查不定冠词的基础应用，难度简单。eraser是可数名词单数，以元音音素/ɪ/开头，需用an修饰。题干语境是校园借物的日常场景，词汇贴近学生生活，句式简短易懂，答案唯一固定，符合easy难度要求。",
  "difficulty": "easy",
  "province": "云南",
  "year": 2024,
  "source": "变式题"
  },
  
  
    {
      "text": "They ________ (work) in this company since they graduated from university.",
      "answer": "have worked",
      "grammarPoint": "现在完成时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查现在完成时与since引导的时间状语从句的搭配。since they graduated from university表示从他们大学毕业以来，主句动作从过去持续到现在，应用现在完成时。主语they，谓语动词用复数形式have worked。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    
    {
      "text": "I ________ (be) interested in science since I visited the science museum last year.",
      "answer": "have been",
      "grammarPoint": "现在完成时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查现在完成时与since引导的时间状语从句的搭配。since I visited... last year表示自从去年参观以来，主句状态从过去持续到现在，应用现在完成时。主语I，be动词的现在完成时为have been。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "My father ________ (teach) math at this school since 2010.",
      "answer": "has taught",
      "grammarPoint": "现在完成时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查现在完成时与since引导的时间状语的搭配。since 2010表示从2010年以来，主句动作从过去持续到现在，应用现在完成时。主语My father，谓语动词用单数形式has taught。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "We ________ (know) each other since we were in primary school.",
      "answer": "have known",
      "grammarPoint": "现在完成时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查现在完成时与since引导的时间状语从句的搭配，表示状态持续。since we were in primary school表示从小学以来，状态认识持续到现在，应用现在完成时。主语we，谓语动词用复数形式have known。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
  
  
    {
      "text": "________ she is very busy, she always finds time to read with her children.",
      "answer": "Although/Though",
      "grammarPoint": "状语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查让步状语从句的引导词。前半句'她很忙'与后半句'她总是找时间陪孩子读书'构成让步关系（尽管……但是……）。although或though用于引导让步状语从句，意为'尽管，虽然'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "________ the test was difficult, most students did quite well.",
      "answer": "Although/Though",
      "grammarPoint": "状语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查让步状语从句的引导词。前半句'考试很难'与后半句'大多数学生考得不错'构成让步关系。although或though用于引导让步状语从句，表示'尽管考试难，但学生考得好'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "________ he has never been to France, he can speak French very well.",
      "answer": "Although/Though",
      "grammarPoint": "状语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查让步状语从句的引导词。前半句'他从未去过法国'与后半句'他法语说得很好'构成让步关系。although或though用于引导让步状语从句，表示'尽管没去过，但法语好'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "________ it was raining heavily, they decided to go for a walk as planned.",
      "answer": "Although/Though",
      "grammarPoint": "状语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查让步状语从句的引导词。前半句'雨下得很大'与后半句'他们决定按计划去散步'构成让步关系。although或though用于引导让步状语从句，表示'尽管下雨，但仍去散步'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "________ he is only ten years old, he knows a lot about world history.",
      "answer": "Although/Though",
      "grammarPoint": "状语从句",
      "category": "复合句",
      "type": "fill_blank",
      "analysis": "本题考查让步状语从句的引导词。前半句'他只有十岁'与后半句'他对世界历史了解很多'构成让步关系。although或though用于引导让步状语从句，表示'尽管年龄小，但知识丰富'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "Our teacher told us that light ________ (travel) faster than sound.",
      "answer": "travels",
      "grammarPoint": "一般现在时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查宾语从句中客观真理的时态。宾语从句描述的是'光比声音传播速度快'这一客观事实，无论主句时态如何，从句都应用一般现在时。主语light是不可数名词，视为单数，谓语动词用第三人称单数形式travels。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "We learned in science class that water ________ (boil) at 100 degrees Celsius.",
      "answer": "boils",
      "grammarPoint": "一般现在时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查宾语从句中客观真理的时态。宾语从句描述的是'水在100摄氏度沸腾'这一科学事实，应用一般现在时。主语water是不可数名词，视为单数，谓语动词用第三人称单数形式boils。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "It is a fact that the moon ________ (move) around the earth.",
      "answer": "moves",
      "grammarPoint": "一般现在时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查宾语从句中客观真理的时态。宾语从句描述的是'月亮绕地球转'这一自然规律，应用一般现在时。主语the moon是单数，谓语动词用第三人称单数形式moves。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "My grandfather says that the sun ________ (rise) in the east and sets in the west.",
      "answer": "rises",
      "grammarPoint": "一般现在时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查宾语从句中客观真理的时态。宾语从句描述的是'太阳东升西落'这一客观规律，应用一般现在时。主语the sun是单数，谓语动词用第三人称单数形式rises。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "Every student knows that practice ________ (make) perfect.",
      "answer": "makes",
      "grammarPoint": "一般现在时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查宾语从句中客观真理的时态。宾语从句描述的是'熟能生巧'这一普遍真理，应用一般现在时。主语practice是不可数名词，视为单数，谓语动词用第三人称单数形式makes。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "My brother is interested in ________ (collect) stamps from different countries.",
      "answer": "collecting",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查固定搭配'be interested in doing sth.'，意为'对做某事感兴趣'。介词in后应接动名词作宾语，collect的动名词形式是collecting。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "Many teenagers are interested in ________ (listen) to pop music.",
      "answer": "listening",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查固定搭配'be interested in doing sth.'。介词in后应接动名词作宾语，listen的动名词形式是listening（注意：listen to中的to是介词，但此处in后直接跟动名词listening，to pop music是listen的宾语部分）。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "Are you interested in ________ (learn) how to cook Chinese food?",
      "answer": "learning",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查固定搭配'be interested in doing sth.'。介词in后应接动名词作宾语，learn的动名词形式是learning。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "She is very interested in ________ (watch) documentaries about wild animals.",
      "answer": "watching",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查固定搭配'be interested in doing sth.'。介词in后应接动名词作宾语，watch的动名词形式是watching。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    },
    {
      "text": "My cousin is interested in ________ (draw) pictures of nature.",
      "answer": "drawing",
      "grammarPoint": "非谓语动词",
      "category": "动词",
      "type": "fill_blank",
      "analysis": "本题考查固定搭配'be interested in doing sth.'。介词in后应接动名词作宾语，draw的动名词形式是drawing。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2023,
      "source": "变式题"
    }
  // 将你提供的其他题目数据继续粘贴在这里
];

/**
 * 主要的验证和上传流程
 */
async function validateAndUpload() {
  console.log('🔍 开始验证题目数据...\n');

  try {
    // 1. 验证数据
    const validation = validateJsonData(yourQuestionsData);
    console.log('验证结果:', {
      总题目数: validation.stats.total,
      有效题目: validation.stats.valid,
      无效题目: validation.stats.invalid
    });

    // 2. 如果有问题，显示问题详情
    if (validation.issues.length > 0) {
      console.log('\n❌ 发现以下问题:');
      validation.issues.forEach(issue => {
        console.log(`\n题目 ${issue.index}: ${issue.question}`);
        issue.issues.forEach(problem => {
          console.log(`  - ${problem}`);
        });
      });
    } else {
      console.log('✅ 数据验证通过！');
    }

    // 3. 修复转义问题
    const fixedData = fixJsonEscaping(yourQuestionsData);
    console.log('\n🔧 已修复转义问题');

    // 4. 生成完整报告
    const report = generateFixReport(validation, fixedData);
    console.log('\n📊 完整验证报告:');
    console.log(report);

    // 5. 准备上传到微信小程序控制台
    console.log('📤 准备上传数据到微信小程序控制台...');

    // 这里可以调用你的上传逻辑，比如：
    // const uploadResult = await uploadToWeChatCloud(fixedData);

    // 或者直接输出JSON字符串供控制台使用
    console.log('\n📋 复制以下JSON数据到微信小程序云函数控制台：');
    console.log('='.repeat(50));
    console.log(JSON.stringify(fixedData, null, 2));
    console.log('='.repeat(50));

    console.log('\n✅ 验证和准备工作完成！');

  } catch (error) {
    console.error('❌ 处理过程中出现错误:', error);
  }
}

// 运行验证和上传
validateAndUpload();
