// 代词完整数据 - 包含所有6个表格和6个笔记
const pronounCompleteData = {
    // 主表数据 - 6个表格
    questions: [
      {
        id: 1,
        text: "代词综合训练表",
        answer: "表格1包含人称代词主格、宾格、形容词性物主代词、名词性物主代词和反身代词的完整形式。",
        analysis: "主格用于主语位置（如You are here），宾格作宾语（如Tell you a story），形容词性物主代词需后接名词（your book），名词性物主代词可独立使用（This is yours），反身代词表示自身（yourself）。",
        category: "代词训练",
        table_id: "pronoun_table_001"
      },
      {
        id: 2,
        text: "人称代词训练表",
        answer: "表格2专门练习人称代词的主格和宾格形式。",
        analysis: "人称代词分主格(作主语)和宾格(作宾语)，需根据在句中成分选择。主格用于主语位置，宾格作宾语。",
        category: "代词训练",
        table_id: "pronoun_table_002"
      },
      {
        id: 3,
        text: "物主代词训练表",
        answer: "表格3专门练习物主代词的形容词性和名词性形式。",
        analysis: "物主代词分形容词性(后接名词)和名词性(相当于形容词性物主代词+名词，后不接名词)。",
        category: "代词训练",
        table_id: "pronoun_table_003"
      },
      {
        id: 4,
        text: "反身代词训练表",
        answer: "表格4专门练习反身代词的使用。",
        analysis: "反身代词表示自身，主语和宾语为同一人时使用。常见搭配有by oneself、enjoy oneself、help oneself等。",
        category: "代词训练",
        table_id: "pronoun_table_004"
      },
      {
        id: 5,
        text: "关系代词训练表",
        answer: "表格5专门练习关系代词的使用。",
        analysis: "关系代词用于引导定语从句，指代先行词，并在从句中充当主语、宾语、定语等成分。",
        category: "代词训练",
        table_id: "pronoun_table_005"
      },
      {
        id: 6,
        text: "it用法训练表",
        answer: "表格6专门练习it的各种用法。",
        analysis: "it的用法包括形式主语、强调句、固定句型等。",
        category: "代词训练",
        table_id: "pronoun_table_006"
      }
    ],
  
    // 提示信息
    hints: {
      "宾格": "宾格里只有她以r结尾，只有我们以s结尾，其余都不以r或s结尾。",
      "形容词性物主代词": "形容词性物主代词中只有他和它以s结尾，其余的都以r结尾（我除外）。",
      "名词性物主代词": "名词性物主代词都在形容词性物主代词后加s，本来形容词性物主代词就以s结尾的他和它则不用加。",
      "反身代词": "带ta的（比如他她它和他们）用宾格加self/selves，不带ta的（比如你你们我们）用形容词性物主代词加self/selves，单数self复数selves。",
      "关系代词": "who指代人作主语，whom指代人作宾语，which指代物，that可指代人或物，whose表所属关系。",
      "it用法": "it可作形式主语、强调句、固定句型It is + adj. + for/of sb. + to do sth."
    },
  
    // 完整答案 - 6个表格
    answers: {
      "pronoun_table_001": {
        title: "代词综合表格",
        headers: ["主格", "宾格", "形容词性物主代词", "名词性物主代词", "反身代词"],
        data: [
          ["I", "me", "my", "mine", "myself"],
          ["you", "you", "your", "yours", "yourself"],
          ["he", "him", "his", "his", "himself"],
          ["she", "her", "her", "hers", "herself"],
          ["it", "it", "its", "its", "itself"],
          ["we", "us", "our", "ours", "ourselves"],
          ["you", "you", "your", "yours", "yourselves"],
          ["they", "them", "their", "theirs", "themselves"]
        ]
      },
      "pronoun_table_002": {
        title: "人称代词表格",
        headers: ["人称", "人称代词(主格)", "人称代词(宾格)"],
        data: [
          ["你", "you", "you"],
          ["我", "I", "me"],
          ["他", "he", "him"],
          ["她", "she", "her"],
          ["它", "it", "it"],
          ["你们", "you", "you"],
          ["我们", "we", "us"],
          ["他们", "they", "them"]
        ]
      },
      "pronoun_table_003": {
        title: "物主代词表格",
        headers: ["人称", "物主代词(形容词性)", "物主代词(名词性)"],
        data: [
          ["你", "your", "yours"],
          ["我", "my", "mine"],
          ["他", "his", "his"],
          ["她", "her", "hers"],
          ["它", "its", "its"],
          ["你们", "your", "yours"],
          ["我们", "our", "ours"],
          ["他们", "their", "theirs"]
        ]
      },
      "pronoun_table_004": {
        title: "反身代词表格",
        headers: ["人称", "反身代词"],
        data: [
          ["你", "yourself"],
          ["我", "myself"],
          ["他", "himself"],
          ["她", "herself"],
          ["它", "itself"],
          ["你们", "yourselves"],
          ["我们", "ourselves"],
          ["他们", "themselves"]
        ]
      },
      "pronoun_table_005": {
        title: "关系代词表格",
        headers: ["例句", "先行词", "关系代词", "能填写 that 吗"],
        data: [
          ["穿红裙子的女孩是我妹妹", "the girl", "who", "能"],
          ["你昨天见到的李老师是我们的数学老师", "Mr. Li", "whom", "不能"],
          ["那只黑猫是我的", "the cat", "which", "能"],
          ["我去年访问的那座城市很美丽", "the city", "which", "不能"],
          ["这是我父亲给我的手表", "the watch", "that/which(或省略)", "能"],
          ["她的房子建于1990年，看起来很旧", "her house", "which", "不能"],
          ["那个父亲是医生的男孩学习很努力", "the boy", "whose", "能"],
          ["玛丽的哥哥是我的同学，她明天会来", "Mary", "whose", "不能"],
          ["所有在这里工作的人都很友好", "all the people", "that", "能(必须用 that)"],
          ["露西英语很好，她帮我做作业", "Lucy", "who", "不能"]
        ]
      },
      "pronoun_table_006": {
        title: "it用法表格",
        headers: ["例句", "答案"],
        data: [
          ["______ is necessary for us to learn teamwork.", "It"],
          ["It is ______(impoertance) for children to read more books.", "important"],
          ["It is kind ______ you to help me.", "of"],
          ["It was hard ______( finish) the task on time.", "to finish"],
          ["______ was in the park that we saw the accident.", "It"],
          ["It was Tom ______ won the first prize in the competition.", "that"],
          ["______ is obvious that she will agree with us.", "It"],
          ["It takes two hours ______ (get) to the airport by bus.", "to get"]
        ]
      }
    },
  
    // 笔记数据 - 6个笔记
    notes: {
      "pronoun_note_001": {
        id: "pronoun_note_001",
        frontendName: "代词笔记(综合)",
        content: "代词常见用法讲解",
        category: "代词",
        subCategory: "代词(1)",
        status: "已创建",
        noteContent: "一、人称代词与物主代词的意思区分\n人称代词：指代人或事物，在句中作主语、宾语等，强调 \"谁\"。\n物主代词：表示所属关系，强调 \"谁的\"。\n例子：\n人称代词：She(她)is a student.(她是学生。)\n物主代词：Her(她的)book is on the desk.(她的书在桌上。)\n\n二、人称代词之间的区分\n人称代词分主格(作主语)和宾格(作宾语)，需根据在句中成分选择。\n例子：\n主格(作主语)：He(他)likes music.(他喜欢音乐。)\n宾格(作宾语)：I often help him(他).(我经常帮他。)\n\n三、物主代词之间的区分\n物主代词分形容词性(后接名词)和名词性(相当于 \"形容词性物主代词 + 名词\"，后不接名词)。\n例子：\n形容词性：This is my(我的)pen.(这是我的钢笔。)\n名词性：This pen is mine(我的).(这支钢笔是我的。)\n\n四、反身代词的常见考法\n基本用法：主语和宾语为同一人时，宾语用反身代词(强调 \"自己\")。\n例：She taught herself(她自己)English.(她自学英语。)\n常见搭配：\nby oneself(独自)：He finished the work by himself.(他独自完成了工作。)\nenjoy oneself(玩得开心)：They enjoyed themselves at the party.(他们在派对上玩得很开心。)\nhelp oneself(随便吃 / 用)：Help yourself to some fruit.(随便吃点水果。)\n\n五、写法记忆规则\n宾格特点：\n唯一带 \"s\" 的宾格：us(我们)。\n唯一带 \"r\" 的宾格：her(她)。\n形容词性物主代词：\n仅 his(他的)和 its(它的)以 \"s\" 结尾。\nits(它的)没有一撇(≠ it's，it's=it is/has)。\n名词性物主代词：\n大多在形容词性物主代词后加 \"s\"，如 my→mine，your→yours，our→ours。\n特殊：his(形容词性)= his(名词性)，its(形容词性)= its(名词性)。\n反身代词：\n翻译出 \"他 / 她 / 它\" 的：用宾格 + self/selves，如 him→himself，them→themselves。\n未翻译出 \"他 / 她 / 它\" 的：用形容词性物主代词 + self/selves，如 my→myself，your→yourself。\n\n六、it 的常考用法\n固定句型(对某人来说做某事怎么样)：It + be + adj. + for/of sb. + to do sth.\n例：It is important for us to study hard.(对我们来说，努力学习很重要。)\n形式主语：代替不定式、从句等作主语(避免句子头重脚轻)。\n例：It is clear that he is right.(很明显他是对的。)\n强调句：It is/was + 被强调部分 + that/who + 其他。\n例：It was yesterday that we met.(我们是昨天遇见的。)\n\n七、关系代词的用法讲解\n关系代词用于引导定语从句，指代先行词(被修饰的名词 / 代词)，并在从句中充当主语、宾语、定语等成分。常见关系代词有：that, which, who, whom, whose。\n1. 分类及用法\nwho：指代人，在从句中作主语\n例句：The girl who is wearing a red dress is my sister.(穿红裙子的女孩是我妹妹。)\nwhom：指代人，在从句中作宾语(可省略)\n例句：The teacher whom you met yesterday is from Canada.(你昨天见到的老师来自加拿大。)\nwhich：指代物，在从句中作主语或宾语(作宾语时可省略)\n例句：This is the book which I bought last week.(这是我上周买的书。)\nthat：既可指代人也可指代物，在从句中作主语或宾语(作宾语时可省略)；但以下情况只能用 that：\n先行词被序数词、最高级修饰(如 the first, the best)\n先行词是不定代词(如 all, nothing, everything)\n先行词既有人又有物\n例句：This is the best film that I have ever seen.(这是我看过的最好的电影。)\nwhose：指代人或物的 \"…… 的\"，在从句中作定语\n例句：The boy whose father is a doctor studies hard.(那个父亲是医生的男孩学习很努力。)\n\n考察示例\n人称代词\n题目：______ (她) gave ______ (他) a book.\n答案：She; him\n解析：第一空作主语，用主格 She；第二空作宾语，用宾格 him。\n\n物主代词\n题目：This is ______ (我的) bag. ______ (你的) is on the chair.\n答案：my; Yours\n解析：第一空后接名词 bag，用形容词性物主代词 my；第二空后无名词，用名词性物主代词 Yours(相当于 your bag)。\n\n反身代词\n题目：The children dressed ______ (他们自己) quickly.\n答案：themselves\n解析：主语 the children 与宾语指同一群人，用反身代词 themselves(宾格 them+selves)。\n\nit 的用法\n题目：______ is necessary ______ us to learn teamwork.\n答案：It; for\n解析：此处 it 作形式主语，代替真正主语 \"to learn teamwork\"，符合句型 \"It is + adj. + for sb. + to do sth.\"。\n\n关系代词\n题目：The man ______ is talking to our teacher is my uncle.\n答案：who/that\n解析：先行词是 \"the man\"(人)，从句中缺少主语，用 who 或 that。\n题目：I lost the pen ______ my mother gave me as a gift.\n答案：which/that(或省略)\n解析：先行词是 \"the pen\"(物)，从句中缺少宾语，用 which、that 或省略关系代词。\n题目：This is the room ______ window faces the sea.\n答案：whose\n解析：从句中 \"window\" 与先行词 \"the room\" 是所属关系(房间的窗户)，用 whose 作定语。\n题目：All ______ we need is enough time.\n答案：that\n解析：先行词是不定代词 \"all\"，只能用 that 引导定语从句。\n题目：Do you know the girl with ______ Tom is talking?\n答案：whom\n解析：先行词是 \"the girl\"(人)，关系代词前有介词 \"with\"，需用宾格 whom(介词后不能用 who)。"
      },
      "pronoun_note_002": {
        id: "pronoun_note_002",
        frontendName: "代词笔记(人称代词)",
        content: "人称代词使用规则",
        category: "代词",
        subCategory: "代词(2)",
        status: "已创建",
        noteContent: "一、人称代词与物主代词的意思区分\n人称代词：指代人或事物，在句中作主语、宾语等，强调 \"谁\"。\n物主代词：表示所属关系，强调 \"谁的\"。\n例子：\n人称代词：She(她)is a student.(她是学生。)\n物主代词：Her(她的)book is on the desk.(她的书在桌上。)\n\n二、人称代词之间的区分\n人称代词分主格(作主语)和宾格(作宾语)，需根据在句中成分选择。\n例子：\n主格(作主语)：He(他)likes music.(他喜欢音乐。)\n宾格(作宾语)：I often help him(他).(我经常帮他。)\n\n三、写法记忆规则\n宾格特点：\n唯一带 \"s\" 的宾格：us(我们)。\n唯一带 \"r\" 的宾格：her(她)。\n\n考察示例\n人称代词\n题目：______ (她) gave ______ (他) a book.\n答案：She; him\n解析：第一空作主语，用主格 She；第二空作宾语，用宾格 him。"
      },
      "pronoun_note_003": {
        id: "pronoun_note_003",
        frontendName: "代词笔记(物主代词)",
        content: "物主代词使用规则",
        category: "代词",
        subCategory: "代词(3)",
        status: "已创建",
        noteContent: "一、人称代词与物主代词的意思区分\n人称代词：指代人或事物，在句中作主语、宾语等，强调 \"谁\"。\n物主代词：表示所属关系，强调 \"谁的\"。\n例子：\n人称代词：She(她)is a student.(她是学生。)\n物主代词：Her(她的)book is on the desk.(她的书在桌上。)\n\n二、物主代词之间的区分\n物主代词分形容词性(后接名词)和名词性(相当于 \"形容词性物主代词 + 名词\"，后不接名词)。\n例子：\n形容词性：This is my(我的)pen.(这是我的钢笔。)\n名词性：This pen is mine(我的).(这支钢笔是我的。)\n\n三、写法记忆规则\n形容词性物主代词：\n仅 his(他的)和 its(它的)以 \"s\" 结尾。\nits(它的)没有一撇(≠ it's，it's=it is/has)。\n名词性物主代词：\n大多在形容词性物主代词后加 \"s\"，如 my→mine，your→yours，our→ours。\n特殊：his(形容词性)= his(名词性)，its(形容词性)= its(名词性)。\n\n考察示例\n物主代词\n题目：This is ______ (我的) bag. ______ (你的) is on the chair.\n答案：my; Yours\n解析：第一空后接名词 bag，用形容词性物主代词 my；第二空后无名词，用名词性物主代词 Yours(相当于 your bag)。"
      },
      "pronoun_note_004": {
        id: "pronoun_note_004",
        frontendName: "代词笔记(反身代词)",
        content: "反身代词使用规则",
        category: "代词",
        subCategory: "代词(4)",
        status: "已创建",
        noteContent: "一、反身代词的常见考法\n基本用法：主语和宾语为同一人时，宾语用反身代词(强调 \"自己\")。\n例：She taught herself(她自己)English.(她自学英语。)\n\n二、常见搭配：\nby oneself(独自)：He finished the work by himself.(他独自完成了工作。)\nenjoy oneself(玩得开心)：They enjoyed themselves at the party.(他们在派对上玩得很开心。)\nhelp oneself(随便吃 / 用)：Help yourself to some fruit.(随便吃点水果。)\n\n三、写法记忆规则\n反身代词：\n翻译出 \"他 / 她 / 它\" 的：用宾格 + self/selves，如 him→himself，them→themselves。\n未翻译出 \"他 / 她 / 它\" 的：用形容词性物主代词 + self/selves，如 my→myself，your→yourself。\n\n考察示例\n反身代词\n题目：The children dressed ______ (他们自己) quickly.\n答案：themselves\n解析：主语 the children 与宾语指同一群人，用反身代词 themselves(宾格 them+selves)。"
      },
      "pronoun_note_005": {
        id: "pronoun_note_005",
        frontendName: "代词笔记(关系代词)",
        content: "关系代词使用规则",
        category: "代词",
  