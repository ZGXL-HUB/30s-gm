module.exports = {
  questions: [
    // 第1行：直接加 -ly
    { cell_id: "aw_001", table_id: "adverb_writing_001", row: 1, col: 1, 
      rule: {
        content: "直接加 -ly",
        fullContent: "大多数形容词直接在词尾加 -ly 变为副词"
      }, 
      is_header: false 
    },
    { cell_id: "aw_002", table_id: "adverb_writing_001", row: 1, col: 2, hintWord: "quick", correctAnswer: "quickly", is_header: false },
    { cell_id: "aw_003", table_id: "adverb_writing_001", row: 1, col: 3, hintWord: "clear", correctAnswer: "clearly", is_header: false },
    { cell_id: "aw_004", table_id: "adverb_writing_001", row: 1, col: 4, hintWord: "slow", correctAnswer: "slowly", is_header: false },
    { cell_id: "aw_005", table_id: "adverb_writing_001", row: 1, col: 5, hintWord: "careful", correctAnswer: "carefully", is_header: false },
    
    // 第2行：辅音字母 + y 结尾，变 y 为 i 加 -ly
    { cell_id: "aw_006", table_id: "adverb_writing_001", row: 2, col: 1, 
      rule: {
        content: "辅音字母 + y 结尾，变 y 为 i 加 -ly",
        fullContent: "若形容词以\"辅音字母 + y\"结尾，需先将 y 改为 i，再加 -ly"
      }, 
      is_header: false 
    },
    { cell_id: "aw_007", table_id: "adverb_writing_001", row: 2, col: 2, hintWord: "happy", correctAnswer: "happily", is_header: false },
    { cell_id: "aw_008", table_id: "adverb_writing_001", row: 2, col: 3, hintWord: "easy", correctAnswer: "easily", is_header: false },
    { cell_id: "aw_009", table_id: "adverb_writing_001", row: 2, col: 4, hintWord: "heavy", correctAnswer: "heavily", is_header: false },
    { cell_id: "aw_010", table_id: "adverb_writing_001", row: 2, col: 5, hintWord: "angry", correctAnswer: "angrily", is_header: false },
    
    // 第3行：due 和 true 变副词，去 e 加 -ly
    { cell_id: "aw_011", table_id: "adverb_writing_001", row: 3, col: 1, 
      rule: {
        content: "due 和 true 变副词，去 e 加 -ly",
        fullContent: "due 和 true 这两个词变副词时，去掉 e 后加 -ly"
      }, 
      is_header: false 
    },
    { cell_id: "aw_012", table_id: "adverb_writing_001", row: 3, col: 2, hintWord: "due", correctAnswer: "duly", is_header: false },
    { cell_id: "aw_013", table_id: "adverb_writing_001", row: 3, col: 3, hintWord: "true", correctAnswer: "truly", is_header: false },
    { cell_id: "aw_014", table_id: "adverb_writing_001", row: 3, col: 4, hintWord: "due", correctAnswer: "duly", is_header: false },
    { cell_id: "aw_015", table_id: "adverb_writing_001", row: 3, col: 5, hintWord: "true", correctAnswer: "truly", is_header: false },
    
    // 第4行：以 -le 结尾，去 e 加 -y
    { cell_id: "aw_016", table_id: "adverb_writing_001", row: 4, col: 1, 
      rule: {
        content: "以 -le 结尾，去 e 加 -y",
        fullContent: "以 -le 结尾的形容词，去掉 e 后加 -y 构成副词"
      }, 
      is_header: false 
    },
    { cell_id: "aw_017", table_id: "adverb_writing_001", row: 4, col: 2, hintWord: "terrible", correctAnswer: "terribly", is_header: false },
    { cell_id: "aw_018", table_id: "adverb_writing_001", row: 4, col: 3, hintWord: "gentle", correctAnswer: "gently", is_header: false },
    { cell_id: "aw_019", table_id: "adverb_writing_001", row: 4, col: 4, hintWord: "simple", correctAnswer: "simply", is_header: false },
    { cell_id: "aw_020", table_id: "adverb_writing_001", row: 4, col: 5, hintWord: "possible", correctAnswer: "possibly", is_header: false },
    
    // 第5行：以 -ic 结尾，加 -ally
    { cell_id: "aw_021", table_id: "adverb_writing_001", row: 5, col: 1, 
      rule: {
        content: "以 -ic 结尾，加 -ally",
        fullContent: "以 -ic 结尾的形容词，通常加 -ally 变为副词（但 public 例外，变为 publicly）"
      }, 
      is_header: false 
    },
    { cell_id: "aw_022", table_id: "adverb_writing_001", row: 5, col: 2, hintWord: "basic", correctAnswer: "basically", is_header: false },
    { cell_id: "aw_023", table_id: "adverb_writing_001", row: 5, col: 3, hintWord: "automatic", correctAnswer: "automatically", is_header: false },
    { cell_id: "aw_024", table_id: "adverb_writing_001", row: 5, col: 4, hintWord: "dramatic", correctAnswer: "dramatically", is_header: false },
    { cell_id: "aw_025", table_id: "adverb_writing_001", row: 5, col: 5, hintWord: "energetic", correctAnswer: "energetically", is_header: false },
    
    // 第6行：特殊变化（不规则形式）
    { cell_id: "aw_026", table_id: "adverb_writing_001", row: 6, col: 1, 
      rule: {
        content: "特殊变化（不规则形式）",
        fullContent: "少数形容词变副词有特殊形式，需单独记忆"
      }, 
      is_header: false 
    },
    { cell_id: "aw_027", table_id: "adverb_writing_001", row: 6, col: 2, hintWord: "good", correctAnswer: "well", is_header: false },
    { cell_id: "aw_028", table_id: "adverb_writing_001", row: 6, col: 3, hintWord: "fast", correctAnswer: "fast", is_header: false },
    { cell_id: "aw_029", table_id: "adverb_writing_001", row: 6, col: 4, hintWord: "hard", correctAnswer: "hard", is_header: false },
    { cell_id: "aw_030", table_id: "adverb_writing_001", row: 6, col: 5, hintWord: "late", correctAnswer: "late", is_header: false }
  ]
}; 