// 完整的时态题目处理
const tenseQuestions = [
  {
    "text": "While I ______ (cook) dinner last night, the phone suddenly rang.",
    "answer": "was cooking",
    "analysis": "该句需填入过去进行时\"was cooking\"。此处考查过去进行时与一般过去时的搭配使用，具体分析如下：\\n1. 时态判断：句中\"while\"引导时间状语从句，强调\"当一个动作正在进行时，另一个动作突然发生\"。主句\"rang\"为一般过去时，从句需用过去进行时表示持续的背景动作。\\n2. 过去进行时构成：主语\"I\"为第一人称单数，故用\"was + 现在分词\"(cook→cooking)。\\n3. 语境逻辑：\"做饭\"是持续进行的动作，\"电话铃响\"是突发的短暂动作，符合\"过去进行时+一般过去时\"的经典搭配。",
    "category": "谓语(6)"
  },
  {
    "text": "They ______ (walk) through the park when they met their old teacher.",
    "answer": "were walking",
    "analysis": "该句需填入过去进行时\"were walking\"。此处考查when引导的时间状语从句中过去进行时的用法，具体分析如下：\\n1. 时态判断：\"when\"在此处表示\"当……时\"，主句动作(遇见老师)是短暂的过去动作，从句动作(散步)是当时正在进行的持续动作，故从句用过去进行时。\\n2. 过去进行时构成：主语\"they\"为复数，故用\"were + 现在分词\"(walk→walking)。\\n3. 用法特点：突出\"相遇时正在做某事\"，体现动作的背景持续性与事件的突发性。",
    "category": "谓语(6)"
  },
  {
    "text": "At 8 o'clock last night, I ______ (watch) a documentary about ocean life.",
    "answer": "was watching",
    "analysis": "该句需填入过去进行时\"was watching\"。此处考查过去进行时表示过去某一特定时间正在进行的动作，具体分析如下：\\n1. 时态判断：时间状语\"At 8 o'clock last night\"明确指向过去的某一具体时刻，强调此时正在进行的动作，需用过去进行时。\\n2. 过去进行时构成：主语\"I\" + was + watching(watch的现在分词)。\\n3. 与一般过去时的区别：一般过去时表动作已完成，而此处强调\"8点那一刻正在看\"，突出动作在特定时间点的持续性。",
    "category": "谓语(6)"
  },
  {
    "text": "The students ______ (discuss) their project when the bell rang for class.",
    "answer": "were discussing",
    "analysis": "该句需填入过去进行时\"were discussing\"。此处考查过去进行时在时间状语从句中的应用，具体分析如下：\\n1. 时态判断：\"when\"引导的从句用一般过去时(rang)，表示突发动作；主句动作(讨论项目)是当时正在进行的持续动作，故用过去进行时。\\n2. 过去进行时构成：主语\"the students\"为复数 + were + discussing(discuss的现在分词)。\\n3. 语境逻辑：\"讨论\"是持续进行的课堂准备动作，\"铃声响\"是打断该动作的信号，符合过去进行时的语境功能。",
    "category": "谓语(6)"
  },
  {
    "text": "She ______ (read) a novel all afternoon yesterday, so she didn't hear the doorbell.",
    "answer": "was reading",
    "analysis": "该句需填入过去进行时\"was reading\"。此处考查过去进行时表示过去一段时间内持续进行的动作，具体分析如下：\\n1. 时态判断：时间状语\"all afternoon yesterday\"表示过去的一段持续时间，强调动作在该时段内一直在进行，用过去进行时。\\n2. 过去进行时构成：主语\"she\" + was + reading(read的现在分词)。\\n3. 逻辑关系：\"一直看书\"是\"没听见门铃\"的原因，体现持续动作对结果的影响。",
    "category": "谓语(6)"
  },
  {
    "text": "While Tom ______ (fix) his bike, his sister was watering the flowers in the garden.",
    "answer": "was fixing",
    "analysis": "该句需填入过去进行时\"was fixing\"。此处考查while引导的并列句中过去进行时的使用，具体分析如下：\\n1. 时态判断：\"while\"在此处连接两个同时进行的过去动作，前后句均用过去进行时，体现\"对比性的并行动作\"。\\n2. 过去进行时构成：主语\"Tom\"为第三人称单数 + was + fixing(fix的现在分词)。\\n3. 用法特点：强调两个动作在过去同一时间段内同时发生且持续进行，突出场景的画面感。",
    "category": "谓语(6)"
  },
  {
    "text": "The children ______ (play) happily in the yard when it suddenly started to rain.",
    "answer": "were playing",
    "analysis": "该句需填入过去进行时\"were playing\"。此处考查过去进行时与自然突发情况的搭配，具体分析如下：\\n1. 时态判断：\"下雨\"是突发的自然现象(started to rain为一般过去时)，\"孩子们玩耍\"是当时正在进行的持续动作，用过去进行时。\\n2. 过去进行时构成：主语\"the children\"为复数 + were + playing(play的现在分词)。\\n3. 场景描述：通过过去进行时营造\"玩耍正欢时突遇下雨\"的画面感，体现动作的中断。",
    "category": "谓语(6)"
  },
  {
    "text": "I ______ (think) about our holiday plan when my mom came into the room.",
    "answer": "was thinking",
    "analysis": "该句需填入过去进行时\"was thinking\"。此处考查过去进行时表示过去正在进行的心理活动，具体分析如下：\\n1. 时态判断：\"妈妈进来\"是过去的短暂动作(came为一般过去时)，\"思考假期计划\"是当时正在进行的心理活动，用过去进行时。\\n2. 过去进行时构成：主语\"I\" + was + thinking(think的现在分词)。\\n3. 动词特点：think虽为心理动词，但此处表示\"持续思考\"的过程，可用进行时(区别于静态心理动词如know)。",
    "category": "谓语(6)"
  },
  {
    "text": "They ______ (travel) through the mountains at this time last week.",
    "answer": "were traveling",
    "analysis": "该句需填入过去进行时\"were traveling\"。此处考查\"this time + 过去时间\"作状语时的时态，具体分析如下：\\n1. 时态判断：时间状语\"at this time last week\"(上周这个时候)强调过去某一特定时间点正在进行的动作，需用过去进行时。\\n2. 过去进行时构成：主语\"they\"为复数 + were + traveling(travel的现在分词)。\\n3. 时间表达特点：\"this time + 过去时间\"是过去进行时的典型标志，突出动作在过去对应时刻的持续性。",
    "category": "谓语(6)"
  },
  {
    "text": "While my dad ______ (drive) us to the airport, we listened to our favorite songs.",
    "answer": "was driving",
    "analysis": "该句需填入过去进行时\"was driving\"。此处考查while引导的主从复合句中动作的并行性，具体分析如下：\\n1. 时态判断：\"开车\"是持续进行的背景动作(过去进行时)，\"听歌\"是在该过程中同时进行的伴随动作(一般过去时)，体现\"一边……一边……\"的逻辑。\\n2. 过去进行时构成：主语\"my dad\"为第三人称单数 + was + driving(drive的现在分词)。\\n3. 动作关系：通过过去进行时区分主动作(开车)与伴随动作(听歌)，突出场景的连贯性。",
    "category": "谓语(6)"
  },
  {
    "text": "She ______ (talk) on the phone so loudly that she didn't notice me enter the room.",
    "answer": "was talking",
    "analysis": "该句需填入过去进行时\"was talking\"。此处考查过去进行时表示过去持续进行的动作对结果的影响，具体分析如下：\\n1. 时态判断：\"打电话\"是过去持续进行的动作(过去进行时)，\"没注意到我进来\"是该动作导致的结果(一般过去时)。\\n2. 过去进行时构成：主语\"she\" + was + talking(talk的现在分词)。\\n3. 逻辑关系：通过过去进行时强调\"持续大声打电话\"这一状态，解释\"没注意到\"的原因。",
    "category": "谓语(6)"
  },
  {
    "text": "At that moment, the audience ______ (cheer) for the winning team.",
    "answer": "were cheering",
    "analysis": "该句需填入过去进行时\"were cheering\"。此处考查\"at that moment\"作状语时的时态选择，具体分析如下：\\n1. 时态判断：\"at that moment\"(在那一刻)指向过去某一特定瞬间正在进行的动作，需用过去进行时。\\n2. 过去进行时构成：主语\"the audience\"为集合名词(强调个体时视为复数) + were + cheering(cheer的现在分词)。\\n3. 语境适配：描述比赛现场\"那一刻观众正在欢呼\"的即时场景，突出动作的动态性。",
    "category": "谓语(6)"
  },
  {
    "text": "While we ______ (have) dinner, a stranger knocked at the door.",
    "answer": "were having",
    "analysis": "该句需填入过去进行时\"were having\"。此处考查过去进行时在日常场景中的应用，具体分析如下：\\n1. 时态判断：\"吃晚饭\"是过去正在进行的日常活动(过去进行时)，\"陌生人敲门\"是打断该活动的突发动作(一般过去时)。\\n2. 过去进行时构成：主语\"we\"为复数 + were + having(have的现在分词)。\\n3. 场景特点：通过\"日常持续动作+突发打断\"的搭配，体现过去进行时的叙事功能。",
    "category": "谓语(6)"
  },
  {
    "text": "The wind ______ (blow) strongly all night, so many trees were uprooted.",
    "answer": "was blowing",
    "analysis": "该句需填入过去进行时\"was blowing\"。此处考查过去进行时表示过去持续的自然现象，具体分析如下：\\n1. 时态判断：\"风刮了一整夜\"是过去持续进行的自然现象(过去进行时)，\"树被连根拔起\"是结果(一般过去时)。\\n2. 过去进行时构成：主语\"the wind\"为不可数名词(视为单数) + was + blowing(blow的现在分词)。\\n3. 用法特点：用过去进行时强调自然现象的持续性，解释结果产生的过程。",
    "category": "谓语(6)"
  },
  {
    "text": "They ______ (not study) when the teacher walked into the classroom—they were chatting.",
    "answer": "were not studying",
    "analysis": "该句需填入过去进行时的否定式\"were not studying\"。此处考查过去进行时的否定结构，具体分析如下：\\n1. 时态判断：\"老师走进教室\"是过去动作(walked为一般过去时)，否定\"当时正在学习\"，用过去进行时的否定式。\\n2. 否定结构：were + not + 现在分词，主语\"they\"为复数，故用were not studying(可缩写为weren't studying)。\\n3. 对比关系：通过否定\"学习\"的持续动作，突出\"聊天\"这一实际进行的动作，体现转折逻辑。",
    "category": "谓语(6)"
  },
  {
    "text": "I ______ (take) photos of the sunset when a group of birds flew across the sky.",
    "answer": "was taking",
    "analysis": "该句需填入过去进行时\"was taking\"。此处考查过去进行时与瞬间动作的搭配，具体分析如下：\\n1. 时态判断：\"拍日落\"是过去持续进行的动作(过去进行时)，\"鸟群飞过天空\"是突发的瞬间动作(一般过去时)，形成画面感。\\n2. 过去进行时构成：主语\"I\" + was + taking(take的现在分词)。\\n3. 场景描述：用过去进行时铺垫背景动作，用一般过去时突出画面中的动态元素，增强叙事生动性。",
    "category": "谓语(6)"
  },
  {
    "text": "While the band ______ (perform) on stage, the audience was singing along.",
    "answer": "was performing",
    "analysis": "该句需填入过去进行时\"was performing\"。此处考查过去进行时在描述表演场景中的应用，具体分析如下：\\n1. 时态判断：\"乐队表演\"与\"观众跟唱\"是过去同时进行的动作，均用过去进行时(后句用was singing，前句对应was performing)。\\n2. 过去进行时构成：主语\"the band\"为单数名词 + was + performing(perform的现在分词)。\\n3. 并行动作：通过while连接两个过去进行时的动作，强调表演场景中\"台上与台下\"的互动与同步性。",
    "category": "谓语(6)"
  }
];

// 生成可以直接添加到questions.js的代码
function generateQuestionsJS() {
  let jsCode = '  "谓语(6)": [\n';
  tenseQuestions.forEach((q, index) => {
    jsCode += `    {\n`;
    jsCode += `      "text": "${q.text}",\n`;
    jsCode += `      "answer": "${q.answer}",\n`;
    jsCode += `      "analysis": "${q.analysis}",\n`;
    jsCode += `      "category": "${q.category}"\n`;
    jsCode += `    }${index < tenseQuestions.length - 1 ? ',' : ''}\n`;
  });
  jsCode += '  ],\n';
  return jsCode;
}

console.log('生成的题目代码:');
console.log(generateQuestionsJS());

module.exports = { tenseQuestions, generateQuestionsJS }; 