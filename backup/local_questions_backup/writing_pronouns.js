// 代词书写规范表格数据
const writingPronounsData = {
  // 主表数据
  questions: [
    {
      id: 1,
      text: "代词训练表",
      answer: "表格1按你、我、他、她、它、你们、我们、他们的顺序排列，包含人称代词主格、宾格、形容词性物主代词、名词性物主代词和反身代词的完整形式。",
      analysis: "主格用于主语位置（如You are here），宾格作宾语（如Tell you a story），形容词性物主代词需后接名词（your book），名词性物主代词可独立使用（This is yours），反身代词表示自身（yourself）。",
      category: "代词训练",
      table_id: "pronoun_001"
    },
    {
      id: 2,
      text: "代词训练表",
      answer: "表格2按我们、它、你、他们、她、我、他、你们的乱序排列，需注意不同人称的代词形式变化。",
      analysis: "乱序排列旨在强化对各个人称代词的独立记忆，例如'她'的宾格与形容词性物主代词同形（her），名词性物主代词为hers，反身代词为herself。",
      category: "代词训练",
      table_id: "pronoun_002"
    }
  ],

  // 提示信息
  hints: {
    "宾格": "宾格里只有她以r结尾，只有我们以s结尾，其余都不以r或s结尾。",
    "形容词性物主代词": "形容词性物主代词中只有他和它以s结尾，其余的都以r结尾（我除外）。",
    "名词性物主代词": "名词性物主代词都在形容词性物主代词后加s，本来形容词性物主代词就以s结尾的他和它则不用加。",
    "反身代词": "带ta的（比如他她它和他们）用宾格加self/selves，不带ta的（比如你你们我们）用形容词性物主代词加self/selves，单数self复数selves。"
  },

  // 完整答案
  answers: {
    "pronoun_001": {
      title: "表格一（有序）",
      headers: ["人称", "人称代词（主格）", "人称代词（宾格）", "物主代词（形容词性）", "物主代词（名词性）", "反身代词"],
      data: [
        ["你", "you", "you", "your", "yours", "yourself"],
        ["我", "I", "me", "my", "mine", "myself"],
        ["他", "he", "him", "his", "his", "himself"],
        ["她", "she", "her", "her", "hers", "herself"],
        ["它", "it", "it", "its", "its", "itself"],
        ["你们", "you", "you", "your", "yours", "yourselves"],
        ["我们", "we", "us", "our", "ours", "ourselves"],
        ["他们", "they", "them", "their", "theirs", "themselves"]
      ]
    },
    "pronoun_002": {
      title: "表格二（乱序）",
      headers: ["人称", "人称代词（主格）", "人称代词（宾格）", "物主代词（形容词性）", "物主代词（名词性）", "反身代词"],
      data: [
        ["我们", "we", "us", "our", "ours", "ourselves"],
        ["它", "it", "it", "its", "its", "itself"],
        ["你", "you", "you", "your", "yours", "yourself"],
        ["他们", "they", "them", "their", "theirs", "themselves"],
        ["她", "she", "her", "her", "hers", "herself"],
        ["我", "I", "me", "my", "mine", "myself"],
        ["他", "he", "him", "his", "his", "himself"],
        ["你们", "you", "you", "your", "yours", "yourselves"]
      ]
    }
  },

  // 表格单元格数据
  pronoun_001: [
    { cell_id: "cell_001", table_id: "pronoun_001", row: 1, col: 1, question: "人称", answer: "你", is_header: true },
    { cell_id: "cell_002", table_id: "pronoun_001", row: 1, col: 2, question: "人称'你'的主格代词", answer: "you", is_header: false },
    { cell_id: "cell_003", table_id: "pronoun_001", row: 1, col: 3, question: "人称'你'的宾格代词", answer: "you", is_header: false },
    { cell_id: "cell_004", table_id: "pronoun_001", row: 1, col: 4, question: "人称'你'的形容词性物主代词", answer: "your", is_header: false },
    { cell_id: "cell_005", table_id: "pronoun_001", row: 1, col: 5, question: "人称'你'的名词性物主代词", answer: "yours", is_header: false },
    { cell_id: "cell_006", table_id: "pronoun_001", row: 1, col: 6, question: "人称'你'的反身代词", answer: "yourself", is_header: false },
    
    { cell_id: "cell_007", table_id: "pronoun_001", row: 2, col: 1, question: "人称", answer: "我", is_header: false },
    { cell_id: "cell_008", table_id: "pronoun_001", row: 2, col: 2, question: "人称'我'的主格代词", answer: "I", is_header: false },
    { cell_id: "cell_009", table_id: "pronoun_001", row: 2, col: 3, question: "人称'我'的宾格代词", answer: "me", is_header: false },
    { cell_id: "cell_010", table_id: "pronoun_001", row: 2, col: 4, question: "人称'我'的形容词性物主代词", answer: "my", is_header: false },
    { cell_id: "cell_011", table_id: "pronoun_001", row: 2, col: 5, question: "人称'我'的名词性物主代词", answer: "mine", is_header: false },
    { cell_id: "cell_012", table_id: "pronoun_001", row: 2, col: 6, question: "人称'我'的反身代词", answer: "myself", is_header: false },
    
    { cell_id: "cell_013", table_id: "pronoun_001", row: 3, col: 1, question: "人称", answer: "他", is_header: false },
    { cell_id: "cell_014", table_id: "pronoun_001", row: 3, col: 2, question: "人称'他'的主格代词", answer: "he", is_header: false },
    { cell_id: "cell_015", table_id: "pronoun_001", row: 3, col: 3, question: "人称'他'的宾格代词", answer: "him", is_header: false },
    { cell_id: "cell_016", table_id: "pronoun_001", row: 3, col: 4, question: "人称'他'的形容词性物主代词", answer: "his", is_header: false },
    { cell_id: "cell_017", table_id: "pronoun_001", row: 3, col: 5, question: "人称'他'的名词性物主代词", answer: "his", is_header: false },
    { cell_id: "cell_018", table_id: "pronoun_001", row: 3, col: 6, question: "人称'他'的反身代词", answer: "himself", is_header: false },
    
    { cell_id: "cell_019", table_id: "pronoun_001", row: 4, col: 1, question: "人称", answer: "她", is_header: false },
    { cell_id: "cell_020", table_id: "pronoun_001", row: 4, col: 2, question: "人称'她'的主格代词", answer: "she", is_header: false },
    { cell_id: "cell_021", table_id: "pronoun_001", row: 4, col: 3, question: "人称'她'的宾格代词", answer: "her", is_header: false },
    { cell_id: "cell_022", table_id: "pronoun_001", row: 4, col: 4, question: "人称'她'的形容词性物主代词", answer: "her", is_header: false },
    { cell_id: "cell_023", table_id: "pronoun_001", row: 4, col: 5, question: "人称'她'的名词性物主代词", answer: "hers", is_header: false },
    { cell_id: "cell_024", table_id: "pronoun_001", row: 4, col: 6, question: "人称'她'的反身代词", answer: "herself", is_header: false },
    
    { cell_id: "cell_025", table_id: "pronoun_001", row: 5, col: 1, question: "人称", answer: "它", is_header: false },
    { cell_id: "cell_026", table_id: "pronoun_001", row: 5, col: 2, question: "人称'它'的主格代词", answer: "it", is_header: false },
    { cell_id: "cell_027", table_id: "pronoun_001", row: 5, col: 3, question: "人称'它'的宾格代词", answer: "it", is_header: false },
    { cell_id: "cell_028", table_id: "pronoun_001", row: 5, col: 4, question: "人称'它'的形容词性物主代词", answer: "its", is_header: false },
    { cell_id: "cell_029", table_id: "pronoun_001", row: 5, col: 5, question: "人称'它'的名词性物主代词", answer: "its", is_header: false },
    { cell_id: "cell_030", table_id: "pronoun_001", row: 5, col: 6, question: "人称'它'的反身代词", answer: "itself", is_header: false },
    
    { cell_id: "cell_031", table_id: "pronoun_001", row: 6, col: 1, question: "人称", answer: "你们", is_header: false },
    { cell_id: "cell_032", table_id: "pronoun_001", row: 6, col: 2, question: "人称'你们'的主格代词", answer: "you", is_header: false },
    { cell_id: "cell_033", table_id: "pronoun_001", row: 6, col: 3, question: "人称'你们'的宾格代词", answer: "you", is_header: false },
    { cell_id: "cell_034", table_id: "pronoun_001", row: 6, col: 4, question: "人称'你们'的形容词性物主代词", answer: "your", is_header: false },
    { cell_id: "cell_035", table_id: "pronoun_001", row: 6, col: 5, question: "人称'你们'的名词性物主代词", answer: "yours", is_header: false },
    { cell_id: "cell_036", table_id: "pronoun_001", row: 6, col: 6, question: "人称'你们'的反身代词", answer: "yourselves", is_header: false },
    
    { cell_id: "cell_037", table_id: "pronoun_001", row: 7, col: 1, question: "人称", answer: "我们", is_header: false },
    { cell_id: "cell_038", table_id: "pronoun_001", row: 7, col: 2, question: "人称'我们'的主格代词", answer: "we", is_header: false },
    { cell_id: "cell_039", table_id: "pronoun_001", row: 7, col: 3, question: "人称'我们'的宾格代词", answer: "us", is_header: false },
    { cell_id: "cell_040", table_id: "pronoun_001", row: 7, col: 4, question: "人称'我们'的形容词性物主代词", answer: "our", is_header: false },
    { cell_id: "cell_041", table_id: "pronoun_001", row: 7, col: 5, question: "人称'我们'的名词性物主代词", answer: "ours", is_header: false },
    { cell_id: "cell_042", table_id: "pronoun_001", row: 7, col: 6, question: "人称'我们'的反身代词", answer: "ourselves", is_header: false },
    
    { cell_id: "cell_043", table_id: "pronoun_001", row: 8, col: 1, question: "人称", answer: "他们", is_header: false },
    { cell_id: "cell_044", table_id: "pronoun_001", row: 8, col: 2, question: "人称'他们'的主格代词", answer: "they", is_header: false },
    { cell_id: "cell_045", table_id: "pronoun_001", row: 8, col: 3, question: "人称'他们'的宾格代词", answer: "them", is_header: false },
    { cell_id: "cell_046", table_id: "pronoun_001", row: 8, col: 4, question: "人称'他们'的形容词性物主代词", answer: "their", is_header: false },
    { cell_id: "cell_047", table_id: "pronoun_001", row: 8, col: 5, question: "人称'他们'的名词性物主代词", answer: "theirs", is_header: false },
    { cell_id: "cell_048", table_id: "pronoun_001", row: 8, col: 6, question: "人称'他们'的反身代词", answer: "themselves", is_header: false }
  ],

  // 表格二（乱序）
  pronoun_002: [
    { cell_id: "cell_049", table_id: "pronoun_002", row: 1, col: 1, question: "人称", answer: "我们", is_header: false },
    { cell_id: "cell_050", table_id: "pronoun_002", row: 1, col: 2, question: "人称'我们'的主格代词", answer: "we", is_header: false },
    { cell_id: "cell_051", table_id: "pronoun_002", row: 1, col: 3, question: "人称'我们'的宾格代词", answer: "us", is_header: false },
    { cell_id: "cell_052", table_id: "pronoun_002", row: 1, col: 4, question: "人称'我们'的形容词性物主代词", answer: "our", is_header: false },
    { cell_id: "cell_053", table_id: "pronoun_002", row: 1, col: 5, question: "人称'我们'的名词性物主代词", answer: "ours", is_header: false },
    { cell_id: "cell_054", table_id: "pronoun_002", row: 1, col: 6, question: "人称'我们'的反身代词", answer: "ourselves", is_header: false },
    
    { cell_id: "cell_055", table_id: "pronoun_002", row: 2, col: 1, question: "人称", answer: "它", is_header: false },
    { cell_id: "cell_056", table_id: "pronoun_002", row: 2, col: 2, question: "人称'它'的主格代词", answer: "it", is_header: false },
    { cell_id: "cell_057", table_id: "pronoun_002", row: 2, col: 3, question: "人称'它'的宾格代词", answer: "it", is_header: false },
    { cell_id: "cell_058", table_id: "pronoun_002", row: 2, col: 4, question: "人称'它'的形容词性物主代词", answer: "its", is_header: false },
    { cell_id: "cell_059", table_id: "pronoun_002", row: 2, col: 5, question: "人称'它'的名词性物主代词", answer: "its", is_header: false },
    { cell_id: "cell_060", table_id: "pronoun_002", row: 2, col: 6, question: "人称'它'的反身代词", answer: "itself", is_header: false },
    
    { cell_id: "cell_061", table_id: "pronoun_002", row: 3, col: 1, question: "人称", answer: "你", is_header: false },
    { cell_id: "cell_062", table_id: "pronoun_002", row: 3, col: 2, question: "人称'你'的主格代词", answer: "you", is_header: false },
    { cell_id: "cell_063", table_id: "pronoun_002", row: 3, col: 3, question: "人称'你'的宾格代词", answer: "you", is_header: false },
    { cell_id: "cell_064", table_id: "pronoun_002", row: 3, col: 4, question: "人称'你'的形容词性物主代词", answer: "your", is_header: false },
    { cell_id: "cell_065", table_id: "pronoun_002", row: 3, col: 5, question: "人称'你'的名词性物主代词", answer: "yours", is_header: false },
    { cell_id: "cell_066", table_id: "pronoun_002", row: 3, col: 6, question: "人称'你'的反身代词", answer: "yourself", is_header: false },
    
    { cell_id: "cell_067", table_id: "pronoun_002", row: 4, col: 1, question: "人称", answer: "他们", is_header: false },
    { cell_id: "cell_068", table_id: "pronoun_002", row: 4, col: 2, question: "人称'他们'的主格代词", answer: "they", is_header: false },
    { cell_id: "cell_069", table_id: "pronoun_002", row: 4, col: 3, question: "人称'他们'的宾格代词", answer: "them", is_header: false },
    { cell_id: "cell_070", table_id: "pronoun_002", row: 4, col: 4, question: "人称'他们'的形容词性物主代词", answer: "their", is_header: false },
    { cell_id: "cell_071", table_id: "pronoun_002", row: 4, col: 5, question: "人称'他们'的名词性物主代词", answer: "theirs", is_header: false },
    { cell_id: "cell_072", table_id: "pronoun_002", row: 4, col: 6, question: "人称'他们'的反身代词", answer: "themselves", is_header: false },
    
    { cell_id: "cell_073", table_id: "pronoun_002", row: 5, col: 1, question: "人称", answer: "她", is_header: false },
    { cell_id: "cell_074", table_id: "pronoun_002", row: 5, col: 2, question: "人称'她'的主格代词", answer: "she", is_header: false },
    { cell_id: "cell_075", table_id: "pronoun_002", row: 5, col: 3, question: "人称'她'的宾格代词", answer: "her", is_header: false },
    { cell_id: "cell_076", table_id: "pronoun_002", row: 5, col: 4, question: "人称'她'的形容词性物主代词", answer: "her", is_header: false },
    { cell_id: "cell_077", table_id: "pronoun_002", row: 5, col: 5, question: "人称'她'的名词性物主代词", answer: "hers", is_header: false },
    { cell_id: "cell_078", table_id: "pronoun_002", row: 5, col: 6, question: "人称'她'的反身代词", answer: "herself", is_header: false },
    
    { cell_id: "cell_079", table_id: "pronoun_002", row: 6, col: 1, question: "人称", answer: "我", is_header: false },
    { cell_id: "cell_080", table_id: "pronoun_002", row: 6, col: 2, question: "人称'我'的主格代词", answer: "I", is_header: false },
    { cell_id: "cell_081", table_id: "pronoun_002", row: 6, col: 3, question: "人称'我'的宾格代词", answer: "me", is_header: false },
    { cell_id: "cell_082", table_id: "pronoun_002", row: 6, col: 4, question: "人称'我'的形容词性物主代词", answer: "my", is_header: false },
    { cell_id: "cell_083", table_id: "pronoun_002", row: 6, col: 5, question: "人称'我'的名词性物主代词", answer: "mine", is_header: false },
    { cell_id: "cell_084", table_id: "pronoun_002", row: 6, col: 6, question: "人称'我'的反身代词", answer: "myself", is_header: false },
    
    { cell_id: "cell_085", table_id: "pronoun_002", row: 7, col: 1, question: "人称", answer: "他", is_header: false },
    { cell_id: "cell_086", table_id: "pronoun_002", row: 7, col: 2, question: "人称'他'的主格代词", answer: "he", is_header: false },
    { cell_id: "cell_087", table_id: "pronoun_002", row: 7, col: 3, question: "人称'他'的宾格代词", answer: "him", is_header: false },
    { cell_id: "cell_088", table_id: "pronoun_002", row: 7, col: 4, question: "人称'他'的形容词性物主代词", answer: "his", is_header: false },
    { cell_id: "cell_089", table_id: "pronoun_002", row: 7, col: 5, question: "人称'他'的名词性物主代词", answer: "his", is_header: false },
    { cell_id: "cell_090", table_id: "pronoun_002", row: 7, col: 6, question: "人称'他'的反身代词", answer: "himself", is_header: false },
    
    { cell_id: "cell_091", table_id: "pronoun_002", row: 8, col: 1, question: "人称", answer: "你们", is_header: false },
    { cell_id: "cell_092", table_id: "pronoun_002", row: 8, col: 2, question: "人称'你们'的主格代词", answer: "you", is_header: false },
    { cell_id: "cell_093", table_id: "pronoun_002", row: 8, col: 3, question: "人称'你们'的宾格代词", answer: "you", is_header: false },
    { cell_id: "cell_094", table_id: "pronoun_002", row: 8, col: 4, question: "人称'你们'的形容词性物主代词", answer: "your", is_header: false },
    { cell_id: "cell_095", table_id: "pronoun_002", row: 8, col: 5, question: "人称'你们'的名词性物主代词", answer: "yours", is_header: false },
    { cell_id: "cell_096", table_id: "pronoun_002", row: 8, col: 6, question: "人称'你们'的反身代词", answer: "yourselves", is_header: false }
  ]
};

module.exports = writingPronounsData; 