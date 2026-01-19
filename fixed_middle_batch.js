// 修复后的初中习题第一批 - 格式正确

var middleBatch_001 = [
  {
    "text": "—Is this Tom's notebook? —Yes, it's ____. Look, there's a 'T' on it. A. he  B. his  C. him  D. himself",
    "answer": "B",
    "grammarPoint": "物主代词",
    "category": "代词",
    "type": "choice",
    "analysis": "本题考查物主代词的基础用法，难度简单。题干空格后无名词，需用名词性物主代词指代'Tom's notebook'，his既可以是形容词性物主代词（后接名词），也可作名词性物主代词，相当于his notebook，符合题意。选项A是人称代词主格，只能作句子主语，如'He is Tom'，不能单独作表语指代物品，错误；选项C是人称代词宾格，只能作宾语，如'I saw him'，不符合此处用法；选项D是反身代词，强调'某人自己'，如'He hurt himself'，与指代物品无关，错误。因此正确答案为B。",
    "difficulty": "easy",
    "province": "云南",
    "year": 2025,
    "source": "变式题"
  }
  // 在这里继续添加更多题目...
  // 建议每批添加 50-100 道题目
];

// 执行上传
console.log(`准备上传第1批初中习题，共 ${middleBatch_001.length} 道题目`);
wx.syncUpload(middleBatch_001, {schoolLevel: "middle"});




