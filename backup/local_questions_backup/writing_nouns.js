// 名词后缀识别表格数据
const writingNounsData = {
  // 主表数据
  questions: [
    {
      id: 1,
      text: "名词后缀识别（一）",
      answer: "后缀归纳表：通过观察同后缀名词，识别并填写正确的名词后缀。",
      analysis: "通过观察具有相同后缀的名词，归纳出常见的名词后缀规律，如-ness表示抽象名词，-ment表示行为或结果等。",
      category: "名词变复数",
      table_id: "noun_001"
    },
    {
      id: 2,
      text: "名词后缀识别（二）",
      answer: "后缀辨析表：从四个单词中选择以名词后缀结尾的单词。",
      analysis: "通过对比不同词性的单词，识别哪些单词是以名词后缀结尾的名词，训练对名词后缀的敏感度。",
      category: "名词变复数",
      table_id: "noun_002"
    },
    {
      id: 3,
      text: "名词后缀识别（三）",
      answer: "综合应用表：在混合单词中点击所有以名词后缀结尾的名词。",
      analysis: "在包含不同词性单词的表格中，准确识别并选择所有以名词后缀结尾的名词，综合应用名词后缀知识。",
      category: "名词变复数",
      table_id: "noun_003"
    },
    {
      id: 4,
      text: "规则变复数",
      answer: "请根据规则填写对应单词的复数形式。",
      analysis: "本表格总结了常见的名词变复数规则，帮助学生掌握不同结尾的名词变复数的写法。",
      category: "名词变复数",
      table_id: "noun_004"
    },
    {
      id: 5,
      text: "现在分词书写练习",
      answer: "练习动词变现在分词的各种规则",
      analysis: "包含直接加-ing、去e加-ing、双写加-ing、变ie为y加-ing和特殊变化五种规则",
      category: "现在分词书写",
      table_id: "present_participle_001"
    },
    {
      id: 6,
      text: "过去分词书写练习",
      answer: "练习动词变过去分词的各种规则",
      analysis: "包含直接加-ed、加-d、双写加-ed、变y为i加-ed和不规则变化五种规则",
      category: "过去分词书写",
      table_id: "past_participle_001"
    }
  ],

  // 单元格型表格数据
  noun_001: [
    // 名词后缀识别（一）
    // 每行2个单元格：名词串、后缀填空
    ...[
      { nouns: "happiness, kindness, darkness", answer: "-ness" },
      { nouns: "warmth, depth, length", answer: "-th" },
      { nouns: "development, agreement, improvement", answer: "-ment" },
      { nouns: "action, decision, infection", answer: "-ion" },
      { nouns: "pressure, exposure, failure", answer: "-ure" },
      { nouns: "importance, appearance, guidance", answer: "-ance" },
      { nouns: "difference, existence, patience", answer: "-ence" },
      { nouns: "reality, ability, curiosity", answer: "-ity" },
      { nouns: "inventor, conductor, editor", answer: "-or" },
      { nouns: "worker, teacher, painter", answer: "-er" },
      { nouns: "artist, physicist, socialist", answer: "-ist" },
      { nouns: "capitalism, socialism, tourism", answer: "-ism" },
      { nouns: "arrival, denial, approval", answer: "-al" },
      { nouns: "childhood, neighborhood, manhood", answer: "-hood" },
      { nouns: "friendship, membership, leadership", answer: "-ship" },
      { nouns: "freedom, kingdom, wisdom", answer: "-dom" }
    ].map((row, i) => ([
      { cell_id: `cell_${i+1}_1`, table_id: "noun_001", row: i+1, col: 1, question: row.nouns, answer: row.nouns, is_header: false },
      { cell_id: `cell_${i+1}_2`, table_id: "noun_001", row: i+1, col: 2, question: "后缀", answer: row.answer, is_header: false }
    ])).flat(),
  ],

  noun_002: [
    // 名词后缀识别（二）
    // 每行4个单元格：选项A/B/C/D，用户需填正确的单词
    ...[
      { words: ["happiness", "happy", "happen", "happily"], correctIndex: 0 },
      { words: ["warm", "warmth", "warn", "warmer"], correctIndex: 1 },
      { words: ["develop", "developed", "development", "developer"], correctIndex: 2 },
      { words: ["action", "act", "active", "actor"], correctIndex: 0 },
      { words: ["press", "pressure", "pressing", "pressurized"], correctIndex: 1 },
      { words: ["important", "importance", "import", "imported"], correctIndex: 1 },
      { words: ["different", "difference", "differ", "differently"], correctIndex: 1 },
      { words: ["real", "reality", "realize", "really"], correctIndex: 1 },
      { words: ["improve", "invite", "try", "invention"], correctIndex: 3 },
      { words: ["work", "worked", "working", "worker"], correctIndex: 3 },
      { words: ["huge", "guess", "artist", "tell"], correctIndex: 2 },
      { words: ["cope", "capitalism", "realize", "positive"], correctIndex: 1 },
      { words: ["arrive", "arriving", "arrived", "arrival"], correctIndex: 3 },
      { words: ["chilly", "childhood", "childish", "save"], correctIndex: 1 },
      { words: ["fry", "friendship", "friendly", "boost"], correctIndex: 1 },
      { words: ["frozen", "free", "freedom", "partial"], correctIndex: 2 }
    ].map((row, i) => row.words.map((word, j) => ({
      cell_id: `cell_${i+1}_${j+1}`, table_id: "noun_002", row: i+1, col: j+1, question: word, answer: row.words[row.correctIndex], is_header: false }))
    ).flat(),
  ],

  noun_003: [
    // 名词后缀识别（三）
    // 12行4列，每个单元格一个单词，用户点击所有带名词后缀的
    ...[
      ["freedom", "decision", "rapid", "membership"],
      ["run", "quiet", "socialism", "old"],
      ["soft", "jump", "difference", "dance"],
      ["ability", "smart", "artist", "action"],
      ["large", "infection", "new", "conductor"],
      ["denial", "kindness", "childhood", "steep"],
      ["big", "tourism", "write", "pressure"],
      ["improvement", "talk", "walk", "short"],
      ["strong", "swim", "worker", "young"],
      ["patience", "sleep", "wisdom", "weak"],
      ["appearance", "high", "invention", "leadership"],
      ["kingdom", "rapid", "importance", "quick"]
    ].map((row, i) => row.map((word, j) => ({
      cell_id: `cell_${i+1}_${j+1}`, table_id: "noun_003", row: i+1, col: j+1, question: word, answer: word, is_header: false }))
    ).flat(),
  ],

  // 新增：规则变复数交互表格
  noun_004: [
    // 规则一
    { cell_id: "cell_1_1", table_id: "noun_004", row: 1, col: 1, is_header: false, rule: { showType: "short", content: "规则一", fullContent: "大多数名词在词尾加 -s，-s 在清辅音后读[s]，在浊辅音和元音后读[z]", lightBulbShow: true } },
    { cell_id: "cell_1_2", table_id: "noun_004", row: 1, col: 2, is_header: false, hintWord: "lamp", hintColor: "lightGray", correctAnswer: "lamps", userInput: "" },
    { cell_id: "cell_1_3", table_id: "noun_004", row: 1, col: 3, is_header: false, hintWord: "coat", hintColor: "lightGray", correctAnswer: "coats", userInput: "" },
    { cell_id: "cell_1_4", table_id: "noun_004", row: 1, col: 4, is_header: false, hintWord: "bag", hintColor: "lightGray", correctAnswer: "bags", userInput: "" },
    { cell_id: "cell_1_5", table_id: "noun_004", row: 1, col: 5, is_header: false, hintWord: "book", hintColor: "lightGray", correctAnswer: "books", userInput: "" },
    // 规则二
    { cell_id: "cell_2_1", table_id: "noun_004", row: 2, col: 1, is_header: false, rule: { showType: "short", content: "规则二", fullContent: "以 -s、-x、-sh、-ch 结尾，读音为[s]、[z]、[ʃ]、[tʃ]、[ʒ]、[dʒ]等的名词后加 -es，如果词尾为 e，只加 -s，-es 读作[ɪz]；stomach 的复数形式为 stomachs，因为 stomach 中 ch 的发音为[k]而不是[tʃ]", lightBulbShow: true } },
    { cell_id: "cell_2_2", table_id: "noun_004", row: 2, col: 2, is_header: false, hintWord: "bus", hintColor: "lightGray", correctAnswer: "buses", userInput: "" },
    { cell_id: "cell_2_3", table_id: "noun_004", row: 2, col: 3, is_header: false, hintWord: "stomach", hintColor: "lightGray", correctAnswer: "stomachs", userInput: "" },
    { cell_id: "cell_2_4", table_id: "noun_004", row: 2, col: 4, is_header: false, hintWord: "box", hintColor: "lightGray", correctAnswer: "boxes", userInput: "" },
    { cell_id: "cell_2_5", table_id: "noun_004", row: 2, col: 5, is_header: false, hintWord: "brush", hintColor: "lightGray", correctAnswer: "brushes", userInput: "" },
    // 规则三
    { cell_id: "cell_3_1", table_id: "noun_004", row: 3, col: 1, is_header: false, rule: { showType: "short", content: "规则三", fullContent: "以字母 -f 或 -fe 结尾的名词，要把 f 或 fe 改为 v 再加 -es；有些以 -f 结尾的名词变复数直接加 -s（如 roof、belief、chief、gulf ），也有些词两种变化形式皆可（如 handkerchief、scarf ）", lightBulbShow: true } },
    { cell_id: "cell_3_2", table_id: "noun_004", row: 3, col: 2, is_header: false, hintWord: "leaf", hintColor: "lightGray", correctAnswer: "leaves", userInput: "" },
    { cell_id: "cell_3_3", table_id: "noun_004", row: 3, col: 3, is_header: false, hintWord: "wife", hintColor: "lightGray", correctAnswer: "wives", userInput: "" },
    { cell_id: "cell_3_4", table_id: "noun_004", row: 3, col: 4, is_header: false, hintWord: "life", hintColor: "lightGray", correctAnswer: "lives", userInput: "" },
    { cell_id: "cell_3_5", table_id: "noun_004", row: 3, col: 5, is_header: false, hintWord: "roof", hintColor: "lightGray", correctAnswer: "roofs", userInput: "" },
    // 规则四
    { cell_id: "cell_4_1", table_id: "noun_004", row: 4, col: 1, is_header: false, rule: { showType: "short", content: "规则四", fullContent: "以 -y 结尾的名词，y 前为辅音字母时，变 y 为 i 再加 -es，前为元音字母时，直接加 -s", lightBulbShow: true } },
    { cell_id: "cell_4_2", table_id: "noun_004", row: 4, col: 2, is_header: false, hintWord: "factory", hintColor: "lightGray", correctAnswer: "factories", userInput: "" },
    { cell_id: "cell_4_3", table_id: "noun_004", row: 4, col: 3, is_header: false, hintWord: "university", hintColor: "lightGray", correctAnswer: "universities", userInput: "" },
    { cell_id: "cell_4_4", table_id: "noun_004", row: 4, col: 4, is_header: false, hintWord: "family", hintColor: "lightGray", correctAnswer: "families", userInput: "" },
    { cell_id: "cell_4_5", table_id: "noun_004", row: 4, col: 5, is_header: false, hintWord: "day", hintColor: "lightGray", correctAnswer: "days", userInput: "" },
    // 规则五
    { cell_id: "cell_5_1", table_id: "noun_004", row: 5, col: 1, is_header: false, rule: { showType: "short", content: "规则五", fullContent: "以 -o 结尾的名词一般加 -es，但 o 前为元音字母的名词和一些以 -o 结尾的外来词、缩略词等直接加 -s", lightBulbShow: true } },
    { cell_id: "cell_5_2", table_id: "noun_004", row: 5, col: 2, is_header: false, hintWord: "hero", hintColor: "lightGray", correctAnswer: "heroes", userInput: "" },
    { cell_id: "cell_5_3", table_id: "noun_004", row: 5, col: 3, is_header: false, hintWord: "potato", hintColor: "lightGray", correctAnswer: "potatoes", userInput: "" },
    { cell_id: "cell_5_4", table_id: "noun_004", row: 5, col: 4, is_header: false, hintWord: "tomato", hintColor: "lightGray", correctAnswer: "tomatoes", userInput: "" },
    { cell_id: "cell_5_5", table_id: "noun_004", row: 5, col: 5, is_header: false, hintWord: "echo", hintColor: "lightGray", correctAnswer: "echos", userInput: "" }
  ],

  // 提示信息
  hints: {
    "常见名词后缀": "常见的名词后缀包括：-ness（抽象名词）、-ment（行为或结果）、-ion（行为或状态）、-er/-or（人）、-ist（专家）、-ism（主义）、-ship（关系）、-hood（状态）、-dom（领域）等。",
    "后缀识别技巧": "观察单词的词根和词尾，如果词尾是常见的名词后缀，且整个单词表示人、物、概念或抽象概念，通常就是名词。",
    "词性判断": "名词后缀通常表示人、物、概念或抽象概念，而形容词后缀通常表示性质或状态，动词后缀通常表示动作。"
  },

  // 完整答案
  answers: {
    "noun_001": {
      title: "名词后缀识别（一）- 后缀归纳表",
      headers: ["同后缀名词", "后缀"],
      data: [
        ["happiness, kindness, darkness", "-ness"],
        ["warmth, depth, length", "-th"],
        ["development, agreement, improvement", "-ment"],
        ["action, decision, infection", "-ion"],
        ["pressure, exposure, failure", "-ure"],
        ["importance, appearance, guidance", "-ance"],
        ["difference, existence, patience", "-ence"],
        ["reality, ability, curiosity", "-ity"],
        ["inventor, conductor, editor", "-or"],
        ["worker, teacher, painter", "-er"],
        ["artist, physicist, socialist", "-ist"],
        ["capitalism, socialism, tourism", "-ism"],
        ["arrival, denial, approval", "-al"],
        ["childhood, neighborhood, manhood", "-hood"],
        ["friendship, membership, leadership", "-ship"],
        ["freedom, kingdom, wisdom", "-dom"]
      ]
    },
    "noun_002": {
      title: "名词后缀识别（二）- 后缀辨析表",
      headers: ["选项A", "选项B", "选项C", "选项D"],
      data: [
        ["happiness", "happy", "happen", "happily"],
        ["warm", "warmth", "warn", "warmer"],
        ["develop", "developed", "development", "developer"],
        ["action", "act", "active", "actor"],
        ["press", "pressure", "pressing", "pressurized"],
        ["important", "importance", "import", "imported"],
        ["different", "difference", "differ", "differently"],
        ["real", "reality", "realize", "really"],
        ["invent", "inventor", "inventive", "invention"],
        ["work", "worker", "working", "worked"],
        ["art", "artist", "artistic", "artistry"],
        ["capital", "capitalism", "capitalize", "capitol"],
        ["arrive", "arrival", "arrived", "arriving"],
        ["child", "childhood", "childish", "children"],
        ["friend", "friendship", "friendly", "friended"],
        ["freeze", "freedom", "free", "freely"]
      ]
    },
    "noun_003": {
      title: "名词后缀识别（三）- 综合应用表",
      headers: ["单词1", "单词2", "单词3", "单词4", "单词5", "单词6"],
      data: [
        ["freedom", "decision", "rapid", "membership", "run", "quiet"],
        ["kindness", "large", "infection", "jump", "socialism", "soft"],
        ["ability", "small", "artist", "talk", "leadership", "strong"],
        ["denial", "old", "difference", "dance", "childhood", "tall"],
        ["improvement", "big", "tourism", "write", "pressure", "short"],
        ["action", "new", "conductor", "swim", "worker", "young"],
        ["appearance", "high", "patience", "sleep", "wisdom", "weak"],
        ["kingdom", "rapid", "importance", "walk", "invention", "quick"]
      ]
    }
  },

  // 现在分词表格数据 (present_participle_001)
  present_participle_001: [
    // 第一行：直接加-ing
    { cell_id: "pp_001", table_id: "present_participle_001", row: 0, col: 0, is_header: true, rule: "💡 规则一", fullRule: "一般情况：直接加 -ing" },
    { cell_id: "pp_002", table_id: "present_participle_001", row: 0, col: 1, is_header: false, hintWord: "work", correctAnswer: "working" },
    { cell_id: "pp_003", table_id: "present_participle_001", row: 0, col: 2, is_header: false, hintWord: "read", correctAnswer: "reading" },
    { cell_id: "pp_004", table_id: "present_participle_001", row: 0, col: 3, is_header: false, hintWord: "play", correctAnswer: "playing" },
    { cell_id: "pp_005", table_id: "present_participle_001", row: 0, col: 4, is_header: false, hintWord: "listen", correctAnswer: "listening" },
    
    // 第二行：去e加-ing
    { cell_id: "pp_006", table_id: "present_participle_001", row: 1, col: 0, is_header: true, rule: "💡 规则二", fullRule: "以不发音的e结尾：去e加 -ing" },
    { cell_id: "pp_007", table_id: "present_participle_001", row: 1, col: 1, is_header: false, hintWord: "write", correctAnswer: "writing" },
    { cell_id: "pp_008", table_id: "present_participle_001", row: 1, col: 2, is_header: false, hintWord: "make", correctAnswer: "making" },
    { cell_id: "pp_009", table_id: "present_participle_001", row: 1, col: 3, is_header: false, hintWord: "take", correctAnswer: "taking" },
    { cell_id: "pp_010", table_id: "present_participle_001", row: 1, col: 4, is_header: false, hintWord: "live", correctAnswer: "living" },
    
    // 第三行：双写加-ing
    { cell_id: "pp_011", table_id: "present_participle_001", row: 2, col: 0, is_header: true, rule: "💡 规则三", fullRule: "重读闭音节结尾：双写辅音字母加 -ing" },
    { cell_id: "pp_012", table_id: "present_participle_001", row: 2, col: 1, is_header: false, hintWord: "run", correctAnswer: "running" },
    { cell_id: "pp_013", table_id: "present_participle_001", row: 2, col: 2, is_header: false, hintWord: "stop", correctAnswer: "stopping" },
    { cell_id: "pp_014", table_id: "present_participle_001", row: 2, col: 3, is_header: false, hintWord: "swim", correctAnswer: "swimming" },
    { cell_id: "pp_015", table_id: "present_participle_001", row: 2, col: 4, is_header: false, hintWord: "put", correctAnswer: "putting" },
    
    // 第四行：变ie为y加-ing
    { cell_id: "pp_016", table_id: "present_participle_001", row: 3, col: 0, is_header: true, rule: "💡 规则四", fullRule: "以ie结尾：变ie为y加 -ing" },
    { cell_id: "pp_017", table_id: "present_participle_001", row: 3, col: 1, is_header: false, hintWord: "lie", correctAnswer: "lying" },
    { cell_id: "pp_018", table_id: "present_participle_001", row: 3, col: 2, is_header: false, hintWord: "die", correctAnswer: "dying" },
    { cell_id: "pp_019", table_id: "present_participle_001", row: 3, col: 3, is_header: false, hintWord: "tie", correctAnswer: "tying" },
    { cell_id: "pp_020", table_id: "present_participle_001", row: 3, col: 4, is_header: false, hintWord: "pie", correctAnswer: "pieing" },
    
    // 第五行：特殊变化
    { cell_id: "pp_021", table_id: "present_participle_001", row: 4, col: 0, is_header: true, rule: "💡 规则五", fullRule: "特殊变化动词：需单独记忆" },
    { cell_id: "pp_022", table_id: "present_participle_001", row: 4, col: 1, is_header: false, hintWord: "be", correctAnswer: "being" },
    { cell_id: "pp_023", table_id: "present_participle_001", row: 4, col: 2, is_header: false, hintWord: "have", correctAnswer: "having" },
    { cell_id: "pp_024", table_id: "present_participle_001", row: 4, col: 3, is_header: false, hintWord: "do", correctAnswer: "doing" },
    { cell_id: "pp_025", table_id: "present_participle_001", row: 4, col: 4, is_header: false, hintWord: "see", correctAnswer: "seeing" }
  ],

  // 过去分词表格数据 (past_participle_001)
  past_participle_001: [
    // 第一行：直接加-ed
    { cell_id: "pap_001", table_id: "past_participle_001", row: 0, col: 0, is_header: true, rule: "💡 规则一", fullRule: "一般情况：直接加 -ed" },
    { cell_id: "pap_002", table_id: "past_participle_001", row: 0, col: 1, is_header: false, hintWord: "work", correctAnswer: "worked" },
    { cell_id: "pap_003", table_id: "past_participle_001", row: 0, col: 2, is_header: false, hintWord: "play", correctAnswer: "played" },
    { cell_id: "pap_004", table_id: "past_participle_001", row: 0, col: 3, is_header: false, hintWord: "visit", correctAnswer: "visited" },
    { cell_id: "pap_005", table_id: "past_participle_001", row: 0, col: 4, is_header: false, hintWord: "listen", correctAnswer: "listened" },
    
    // 第二行：以e结尾加-d
    { cell_id: "pap_006", table_id: "past_participle_001", row: 1, col: 0, is_header: true, rule: "💡 规则二", fullRule: "以不发音的e结尾：直接加 -d" },
    { cell_id: "pap_007", table_id: "past_participle_001", row: 1, col: 1, is_header: false, hintWord: "live", correctAnswer: "lived" },
    { cell_id: "pap_008", table_id: "past_participle_001", row: 1, col: 2, is_header: false, hintWord: "love", correctAnswer: "loved" },
    { cell_id: "pap_009", table_id: "past_participle_001", row: 1, col: 3, is_header: false, hintWord: "use", correctAnswer: "used" },
    { cell_id: "pap_010", table_id: "past_participle_001", row: 1, col: 4, is_header: false, hintWord: "hope", correctAnswer: "hoped" },
    
    // 第三行：双写加-ed
    { cell_id: "pap_011", table_id: "past_participle_001", row: 2, col: 0, is_header: true, rule: "💡 规则三", fullRule: "重读闭音节结尾：双写辅音字母加 -ed" },
    { cell_id: "pap_012", table_id: "past_participle_001", row: 2, col: 1, is_header: false, hintWord: "stop", correctAnswer: "stopped" },
    { cell_id: "pap_013", table_id: "past_participle_001", row: 2, col: 2, is_header: false, hintWord: "plan", correctAnswer: "planned" },
    { cell_id: "pap_014", table_id: "past_participle_001", row: 2, col: 3, is_header: false, hintWord: "prefer", correctAnswer: "preferred" },
    { cell_id: "pap_015", table_id: "past_participle_001", row: 2, col: 4, is_header: false, hintWord: "refer", correctAnswer: "referred" },
    
    // 第四行：变y为i加-ed
    { cell_id: "pap_016", table_id: "past_participle_001", row: 3, col: 0, is_header: true, rule: "💡 规则四", fullRule: "以辅音字母+y结尾：变y为i加 -ed" },
    { cell_id: "pap_017", table_id: "past_participle_001", row: 3, col: 1, is_header: false, hintWord: "study", correctAnswer: "studied" },
    { cell_id: "pap_018", table_id: "past_participle_001", row: 3, col: 2, is_header: false, hintWord: "carry", correctAnswer: "carried" },
    { cell_id: "pap_019", table_id: "past_participle_001", row: 3, col: 3, is_header: false, hintWord: "worry", correctAnswer: "worried" },
    { cell_id: "pap_020", table_id: "past_participle_001", row: 3, col: 4, is_header: false, hintWord: "try", correctAnswer: "tried" },
    
    // 第五行：不规则变化
    { cell_id: "pap_021", table_id: "past_participle_001", row: 4, col: 0, is_header: true, rule: "💡 规则五", fullRule: "不规则动词：特殊变化需单独记忆" },
    { cell_id: "pap_022", table_id: "past_participle_001", row: 4, col: 1, is_header: false, hintWord: "do", correctAnswer: "done" },
    { cell_id: "pap_023", table_id: "past_participle_001", row: 4, col: 2, is_header: false, hintWord: "go", correctAnswer: "gone" },
    { cell_id: "pap_024", table_id: "past_participle_001", row: 4, col: 3, is_header: false, hintWord: "take", correctAnswer: "taken" },
    { cell_id: "pap_025", table_id: "past_participle_001", row: 4, col: 4, is_header: false, hintWord: "write", correctAnswer: "written" }
  ]
};

console.log('实际加载的noun_003:', writingNounsData['noun_003']);
console.log('实际加载的noun_004:', writingNounsData['noun_004']);

module.exports = writingNounsData; 