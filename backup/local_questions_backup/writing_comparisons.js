// 形容词比较级最高级书写数据

const writingComparisonsData = {
  // 主表数据
  questions: [
    {
      id: 1,
      text: "形容词前后缀识别",
      answer: "识别形容词的常见前后缀，如un-、-ful、-able等",
      analysis: "掌握形容词前后缀规律有助于快速理解词义和扩大词汇量",
      category: "形容词前后缀",
      table_id: "comparison_prefix_suffix_001"
    },
    {
      id: 2,
      text: "形容词比较级书写",
      answer: "根据不同规则正确书写形容词比较级形式",
      analysis: "比较级变化规则包括直接加-er、去e加-r、双写加-er、变y为i加-er等",
      category: "比较级书写",
      table_id: "comparison_comparative_001"
    },
    {
      id: 3,
      text: "形容词最高级书写",
      answer: "根据不同规则正确书写形容词最高级形式",
      analysis: "最高级变化规则与比较级类似，但加-est后缀",
      category: "最高级书写",
      table_id: "comparison_superlative_001"
    }
  ],

  // 形容词前后缀识别表格
  comparison_prefix_suffix_001: [
    { cell_id: "cps_001", table_id: "comparison_prefix_suffix_001", row: 1, col: 1, question: "unhappy, unfair, uncommon", answer: "un-", is_header: false },
    { cell_id: "cps_002", table_id: "comparison_prefix_suffix_001", row: 1, col: 2, question: "请填入前缀", answer: "un-", correctAnswer: "un-", acceptedAnswers: ["un-", "un"], is_header: false },
    
    { cell_id: "cps_003", table_id: "comparison_prefix_suffix_001", row: 2, col: 1, question: "incredible, inactive, incorrect", answer: "in-", is_header: false },
    { cell_id: "cps_004", table_id: "comparison_prefix_suffix_001", row: 2, col: 2, question: "请填入前缀", answer: "in-", correctAnswer: "in-", acceptedAnswers: ["in-", "in"], is_header: false },
    
    { cell_id: "cps_005", table_id: "comparison_prefix_suffix_001", row: 3, col: 1, question: "impossible, impatient, immoral", answer: "im-", is_header: false },
    { cell_id: "cps_006", table_id: "comparison_prefix_suffix_001", row: 3, col: 2, question: "请填入前缀", answer: "im-", correctAnswer: "im-", acceptedAnswers: ["im-", "im"], is_header: false },
    
    { cell_id: "cps_007", table_id: "comparison_prefix_suffix_001", row: 4, col: 1, question: "illegal, illogical, illusive", answer: "il-", is_header: false },
    { cell_id: "cps_008", table_id: "comparison_prefix_suffix_001", row: 4, col: 2, question: "请填入前缀", answer: "il-", correctAnswer: "il-", acceptedAnswers: ["il-", "il"], is_header: false },
    
    { cell_id: "cps_009", table_id: "comparison_prefix_suffix_001", row: 5, col: 1, question: "irregular, irresponsible, irrelevant", answer: "ir-", is_header: false },
    { cell_id: "cps_010", table_id: "comparison_prefix_suffix_001", row: 5, col: 2, question: "请填入前缀", answer: "ir-", correctAnswer: "ir-", acceptedAnswers: ["ir-", "ir"], is_header: false },
    
    { cell_id: "cps_011", table_id: "comparison_prefix_suffix_001", row: 6, col: 1, question: "capable, flexible, visible", answer: "-able/-ible", is_header: false },
    { cell_id: "cps_012", table_id: "comparison_prefix_suffix_001", row: 6, col: 2, question: "请填入后缀", answer: "-able/-ible", correctAnswer: "-able/-ible", acceptedAnswers: ["-able", "able", "-ible", "ible", "-able/-ible"], is_header: false },
    
    { cell_id: "cps_013", table_id: "comparison_prefix_suffix_001", row: 7, col: 1, question: "careful, joyful, powerful", answer: "-ful", is_header: false },
    { cell_id: "cps_014", table_id: "comparison_prefix_suffix_001", row: 7, col: 2, question: "请填入后缀", answer: "-ful", correctAnswer: "-ful", acceptedAnswers: ["-ful", "ful"], is_header: false },
    
    { cell_id: "cps_015", table_id: "comparison_prefix_suffix_001", row: 8, col: 1, question: "dangerous, generous, anxious", answer: "-ous/-ious", is_header: false },
    { cell_id: "cps_016", table_id: "comparison_prefix_suffix_001", row: 8, col: 2, question: "请填入后缀", answer: "-ous/-ious", correctAnswer: "-ous/-ious", acceptedAnswers: ["-ous", "ous", "-ious", "ious", "-ous/-ious"], is_header: false },
    
    { cell_id: "cps_017", table_id: "comparison_prefix_suffix_001", row: 9, col: 1, question: "scientific, artistic, political", answer: "-ic/-ical", is_header: false },
    { cell_id: "cps_018", table_id: "comparison_prefix_suffix_001", row: 9, col: 2, question: "请填入后缀", answer: "-ic/-ical", correctAnswer: "-ic/-ical", acceptedAnswers: ["-ic", "ic", "-ical", "ical", "-ic/-ical"], is_header: false },
    
    { cell_id: "cps_019", table_id: "comparison_prefix_suffix_001", row: 10, col: 1, question: "sunny, windy, healthy", answer: "-y", is_header: false },
    { cell_id: "cps_020", table_id: "comparison_prefix_suffix_001", row: 10, col: 2, question: "请填入后缀", answer: "-y", correctAnswer: "-y", acceptedAnswers: ["-y", "y"], is_header: false }
  ],

  // 比较级书写表格
  comparison_comparative_001: [
    // 规则一：直接加-er
    { cell_id: "cc_001", table_id: "comparison_comparative_001", row: 1, col: 1, is_header: false, rule: { showType: "short", content: "规则一", fullContent: "直接加 -er（适用于单音节词及部分双音节词）" } },
    { cell_id: "cc_002", table_id: "comparison_comparative_001", row: 1, col: 2, is_header: false, hintWord: "fast", correctAnswer: "faster", userInput: "" },
    { cell_id: "cc_003", table_id: "comparison_comparative_001", row: 1, col: 3, is_header: false, hintWord: "hard", correctAnswer: "harder", userInput: "" },
    { cell_id: "cc_004", table_id: "comparison_comparative_001", row: 1, col: 4, is_header: false, hintWord: "short", correctAnswer: "shorter", userInput: "" },
    { cell_id: "cc_005", table_id: "comparison_comparative_001", row: 1, col: 5, is_header: false, hintWord: "clean", correctAnswer: "cleaner", userInput: "" },
    
    // 规则二：以不发音的e结尾，加-r
    { cell_id: "cc_006", table_id: "comparison_comparative_001", row: 2, col: 1, is_header: false, rule: { showType: "short", content: "规则二", fullContent: "以不发音的e结尾，加 -r" } },
    { cell_id: "cc_007", table_id: "comparison_comparative_001", row: 2, col: 2, is_header: false, hintWord: "nice", correctAnswer: "nicer", userInput: "" },
    { cell_id: "cc_008", table_id: "comparison_comparative_001", row: 2, col: 3, is_header: false, hintWord: "large", correctAnswer: "larger", userInput: "" },
    { cell_id: "cc_009", table_id: "comparison_comparative_001", row: 2, col: 4, is_header: false, hintWord: "safe", correctAnswer: "safer", userInput: "" },
    { cell_id: "cc_010", table_id: "comparison_comparative_001", row: 2, col: 5, is_header: false, hintWord: "cute", correctAnswer: "cuter", userInput: "" },
    
    // 规则三：重读闭音节结尾，双写辅音字母+er
    { cell_id: "cc_011", table_id: "comparison_comparative_001", row: 3, col: 1, is_header: false, rule: { showType: "short", content: "规则三", fullContent: "重读闭音节结尾，且词尾只有一个辅音字母，双写辅音字母+er" } },
    { cell_id: "cc_012", table_id: "comparison_comparative_001", row: 3, col: 2, is_header: false, hintWord: "big", correctAnswer: "bigger", userInput: "" },
    { cell_id: "cc_013", table_id: "comparison_comparative_001", row: 3, col: 3, is_header: false, hintWord: "hot", correctAnswer: "hotter", userInput: "" },
    { cell_id: "cc_014", table_id: "comparison_comparative_001", row: 3, col: 4, is_header: false, hintWord: "thin", correctAnswer: "thinner", userInput: "" },
    { cell_id: "cc_015", table_id: "comparison_comparative_001", row: 3, col: 5, is_header: false, hintWord: "fat", correctAnswer: "fatter", userInput: "" },
    
    // 规则四：以"辅音字母+y"结尾，变y为i+er
    { cell_id: "cc_016", table_id: "comparison_comparative_001", row: 4, col: 1, is_header: false, rule: { showType: "short", content: "规则四", fullContent: "以\"辅音字母+y\"结尾，变y为i+er" } },
    { cell_id: "cc_017", table_id: "comparison_comparative_001", row: 4, col: 2, is_header: false, hintWord: "happy", correctAnswer: "happier", userInput: "" },
    { cell_id: "cc_018", table_id: "comparison_comparative_001", row: 4, col: 3, is_header: false, hintWord: "easy", correctAnswer: "easier", userInput: "" },
    { cell_id: "cc_019", table_id: "comparison_comparative_001", row: 4, col: 4, is_header: false, hintWord: "heavy", correctAnswer: "heavier", userInput: "" },
    { cell_id: "cc_020", table_id: "comparison_comparative_001", row: 4, col: 5, is_header: false, hintWord: "busy", correctAnswer: "busier", userInput: "" },
    
    // 规则五：不规则变化
    { cell_id: "cc_021", table_id: "comparison_comparative_001", row: 5, col: 1, is_header: false, rule: { showType: "short", content: "规则五", fullContent: "不规则变化（需单独记忆的核心词汇）" } },
    { cell_id: "cc_022", table_id: "comparison_comparative_001", row: 5, col: 2, is_header: false, hintWord: "good", correctAnswer: "better", userInput: "" },
    { cell_id: "cc_023", table_id: "comparison_comparative_001", row: 5, col: 3, is_header: false, hintWord: "bad", correctAnswer: "worse", userInput: "" },
    { cell_id: "cc_024", table_id: "comparison_comparative_001", row: 5, col: 4, is_header: false, hintWord: "many", correctAnswer: "more", userInput: "" },
    { cell_id: "cc_025", table_id: "comparison_comparative_001", row: 5, col: 5, is_header: false, hintWord: "little", correctAnswer: "less", userInput: "" }
  ],

  // 最高级书写表格
  comparison_superlative_001: [
    // 规则一：直接加-est
    { cell_id: "cs_001", table_id: "comparison_superlative_001", row: 1, col: 1, is_header: false, rule: { showType: "short", content: "规则一", fullContent: "直接加 -est（适用于单音节词及部分双音节词）" } },
    { cell_id: "cs_002", table_id: "comparison_superlative_001", row: 1, col: 2, is_header: false, hintWord: "fast", correctAnswer: "fastest", userInput: "" },
    { cell_id: "cs_003", table_id: "comparison_superlative_001", row: 1, col: 3, is_header: false, hintWord: "hard", correctAnswer: "hardest", userInput: "" },
    { cell_id: "cs_004", table_id: "comparison_superlative_001", row: 1, col: 4, is_header: false, hintWord: "short", correctAnswer: "shortest", userInput: "" },
    { cell_id: "cs_005", table_id: "comparison_superlative_001", row: 1, col: 5, is_header: false, hintWord: "clean", correctAnswer: "cleanest", userInput: "" },
    
    // 规则二：以不发音的e结尾，加-st
    { cell_id: "cs_006", table_id: "comparison_superlative_001", row: 2, col: 1, is_header: false, rule: { showType: "short", content: "规则二", fullContent: "以不发音的e结尾，加 -st" } },
    { cell_id: "cs_007", table_id: "comparison_superlative_001", row: 2, col: 2, is_header: false, hintWord: "nice", correctAnswer: "nicest", userInput: "" },
    { cell_id: "cs_008", table_id: "comparison_superlative_001", row: 2, col: 3, is_header: false, hintWord: "large", correctAnswer: "largest", userInput: "" },
    { cell_id: "cs_009", table_id: "comparison_superlative_001", row: 2, col: 4, is_header: false, hintWord: "safe", correctAnswer: "safest", userInput: "" },
    { cell_id: "cs_010", table_id: "comparison_superlative_001", row: 2, col: 5, is_header: false, hintWord: "cute", correctAnswer: "cutest", userInput: "" },
    
    // 规则三：重读闭音节结尾，双写辅音字母+est
    { cell_id: "cs_011", table_id: "comparison_superlative_001", row: 3, col: 1, is_header: false, rule: { showType: "short", content: "规则三", fullContent: "重读闭音节结尾，且词尾只有一个辅音字母，双写辅音字母+est" } },
    { cell_id: "cs_012", table_id: "comparison_superlative_001", row: 3, col: 2, is_header: false, hintWord: "big", correctAnswer: "biggest", userInput: "" },
    { cell_id: "cs_013", table_id: "comparison_superlative_001", row: 3, col: 3, is_header: false, hintWord: "hot", correctAnswer: "hottest", userInput: "" },
    { cell_id: "cs_014", table_id: "comparison_superlative_001", row: 3, col: 4, is_header: false, hintWord: "thin", correctAnswer: "thinnest", userInput: "" },
    { cell_id: "cs_015", table_id: "comparison_superlative_001", row: 3, col: 5, is_header: false, hintWord: "fat", correctAnswer: "fattest", userInput: "" },
    
    // 规则四：以"辅音字母+y"结尾，变y为i+est
    { cell_id: "cs_016", table_id: "comparison_superlative_001", row: 4, col: 1, is_header: false, rule: { showType: "short", content: "规则四", fullContent: "以\"辅音字母+y\"结尾，变y为i+est" } },
    { cell_id: "cs_017", table_id: "comparison_superlative_001", row: 4, col: 2, is_header: false, hintWord: "happy", correctAnswer: "happiest", userInput: "" },
    { cell_id: "cs_018", table_id: "comparison_superlative_001", row: 4, col: 3, is_header: false, hintWord: "easy", correctAnswer: "easiest", userInput: "" },
    { cell_id: "cs_019", table_id: "comparison_superlative_001", row: 4, col: 4, is_header: false, hintWord: "heavy", correctAnswer: "heaviest", userInput: "" },
    { cell_id: "cs_020", table_id: "comparison_superlative_001", row: 4, col: 5, is_header: false, hintWord: "busy", correctAnswer: "busiest", userInput: "" },
    
    // 规则五：不规则变化
    { cell_id: "cs_021", table_id: "comparison_superlative_001", row: 5, col: 1, is_header: false, rule: { showType: "short", content: "规则五", fullContent: "不规则变化（需单独记忆的核心词汇）" } },
    { cell_id: "cs_022", table_id: "comparison_superlative_001", row: 5, col: 2, is_header: false, hintWord: "good", correctAnswer: "best", userInput: "" },
    { cell_id: "cs_023", table_id: "comparison_superlative_001", row: 5, col: 3, is_header: false, hintWord: "bad", correctAnswer: "worst", userInput: "" },
    { cell_id: "cs_024", table_id: "comparison_superlative_001", row: 5, col: 4, is_header: false, hintWord: "many", correctAnswer: "most", userInput: "" },
    { cell_id: "cs_025", table_id: "comparison_superlative_001", row: 5, col: 5, is_header: false, hintWord: "little", correctAnswer: "least", userInput: "" }
  ],

  // 提示信息
  hints: {
    "形容词前后缀": "掌握形容词前后缀规律有助于快速理解词义和扩大词汇量，如un-表示否定，-ful表示充满某种性质",
    "比较级最高级书写": "比较级和最高级的变化规律主要分为规则变化和不规则变化，需要根据单词的音节数和词尾结构来判断"
  },

  // 完整答案
  answers: {
    "comparison_prefix_suffix_001": {
      title: "形容词前后缀识别表",
      headers: ["含有相同前后缀的形容词", "前缀/后缀"],
      data: [
        ["unhappy, unfair, uncommon, unlikely", "un-"],
        ["incredible, inactive, incorrect, independent", "in-"],
        ["impossible, impatient, imbalanced, immoral", "im-"],
        ["illegal, illogical, illiterate, illusive", "il-"],
        ["irregular, irresponsible, irrelevant, irreplaceable", "ir-"],
        ["capable, flexible, visible, tangible", "-able/-ible"],
        ["careful, joyful, powerful, grateful", "-ful"],
        ["dangerous, generous, ambitious, anxious", "-ous/-ious"],
        ["scientific, artistic, historical, political", "-ic/-ical"],
        ["sunny, windy, healthy, noisy", "-y"]
      ]
    },
    "comparison_comparative_001": {
      title: "形容词比较级书写表",
      headers: ["规则", "例词1", "例词2", "例词3", "例词4"],
      data: [
        ["直接加-er", "fast→faster", "hard→harder", "short→shorter", "clean→cleaner"],
        ["以e结尾加-r", "nice→nicer", "large→larger", "safe→safer", "cute→cuter"],
        ["双写+er", "big→bigger", "hot→hotter", "thin→thinner", "fat→fatter"],
        ["变y为i+er", "happy→happier", "easy→easier", "heavy→heavier", "busy→busier"],
        ["不规则变化", "good→better", "bad→worse", "many→more", "little→less"]
      ]
    },
    "comparison_superlative_001": {
      title: "形容词最高级书写表",
      headers: ["规则", "例词1", "例词2", "例词3", "例词4"],
      data: [
        ["直接加-est", "fast→fastest", "hard→hardest", "short→shortest", "clean→cleanest"],
        ["以e结尾加-st", "nice→nicest", "large→largest", "safe→safest", "cute→cutest"],
        ["双写+est", "big→biggest", "hot→hottest", "thin→thinnest", "fat→fattest"],
        ["变y为i+est", "happy→happiest", "easy→easiest", "heavy→heaviest", "busy→busiest"],
        ["不规则变化", "good→best", "bad→worst", "many→most", "little→least"]
      ]
    }
  }
};

module.exports = writingComparisonsData; 