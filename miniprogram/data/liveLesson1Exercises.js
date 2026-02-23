/**
 * 第一课习题库：some/many/数字+名词复数(+s/+es) + be动词匹配
 * 存储位置：miniprogram/data/liveLesson1Exercises.js
 * 第一课时含十个步骤，此处包含：第一环节真题预练、第二环节标志词识别 及后续环节题目。
 */

// ========== 第一环节：真题预练（7道填空，正确率仅存本地供最后环节对比） ==========
const REAL_EXAM_PREPRACTICE = [
  { _id: 'rep1', text: '1. (23春68改错)There is some books on the desk.写出错误词汇的正确形式________', blanks: ['are'] },
  { _id: 'rep2', text: '2.(23秋67改错)She can sing many English song.写出错误词汇的正确形式________', blanks: ['songs'] },
  { _id: 'rep3', text: '3.(24春66改错)There are three girl in her family.写出错误词汇的正确形式________', blanks: ['girls'] },
  { _id: 'rep4', text: '4.(24秋66改错)There are 4 book on the desk.写出错误词汇的正确形式________', blanks: ['books'] },
  { _id: 'rep5', text: '5.(25春58改错)Many year ago, it was a Sunday morning on my tenth birthday.写出错误词汇的正确形式________', blanks: ['years'] },
  { _id: 'rep6', text: '6.(25春66改错)I bought four book yesterday.写出错误词汇的正确形式________', blanks: ['books'] },
  { _id: 'rep7', text: '7.(23秋60) During the first day, I had seven _______ (class) — Chinese, maths, English, physics, chemistry, PE and music. 写出括号中词汇的正确形式________', blanks: ['classes'] }
];

const REAL_EXAM_PREPRACTICE_HINT = 'some,many,数字加名词复数，一般加s/es';

// ========== 第二环节：标志词识别（3组，每组10题，点击句中标志词） ==========
const SIGNAL_WORD_GROUPS = [
  {
    _id: 'sw1',
    hint: 'some是常见的名词复数标志词',
    sentences: [
      { text: "1. I've made some new friends.", correctWord: 'some' },
      { text: '2. Some students did very well last year including Nancy,Maria and Linda.', correctWord: 'Some' },
      { text: '3. There are some important things that everybody should pay attention to.', correctWord: 'some' },
      { text: '4. We can download some applications conveniently.', correctWord: 'some' },
      { text: '5. Are there some other notable wins I would know of?', correctWord: 'some' },
      { text: '6. Do they have some sporting activities there,too?', correctWord: 'some' },
      { text: '7. We have some voluntary jobs to do after class with each other.', correctWord: 'some' },
      { text: '8. I have some other questions and want to talk to someone about the rule.', correctWord: 'some' },
      { text: '9. There are some cool friends I met during the trip in Thailand.', correctWord: 'some' },
      { text: '10. Some participants join in the short video solicitation activity actively.', correctWord: 'Some' }
    ]
  },
  {
    _id: 'sw2',
    hint: 'many是常见的名词复数标志词',
    sentences: [
      { text: '1. Many students have been leaving garbage in public.', correctWord: 'Many' },
      { text: '2. There are many new faces here in the Environmental Protection Union.', correctWord: 'many' },
      { text: '3. Many high schools in the US have vocational classes for students.', correctWord: 'Many' },
      { text: '4. Many service workers rely on that for their daily living in America.', correctWord: 'Many' },
      { text: "5. Many guests went to the party in Lucky Chen's Restaurant that evening.", correctWord: 'Many' },
      { text: '6. Many foreign students take part in the Chinese Speech Contest every year.', correctWord: 'Many' },
      { text: '7. Many participants share their amazing moments in the short video activity.', correctWord: 'Many' },
      { text: "8. Many families go to Lucky Chen's Restaurant in Canada's Chinatown.", correctWord: 'Many' },
      { text: '9. Many classmates encourage each other during the school hike activity.', correctWord: 'Many' },
      { text: '10. Many tourists visit the Lake District to enjoy the beautiful scenery every summer.', correctWord: 'Many' }
    ]
  },
  {
    _id: 'sw3',
    hint: '数字是常见的名词复数标志词',
    sentences: [
      { text: '1. One is thirteen thirteen years old,and the other is ten.', correctWord: 'thirteen' },
      { text: '2. I attend a class with another 21 students from different countries.', correctWord: '21' },
      { text: '3. It has 21 categories in total for the Pulitzer Prize.', correctWord: '21' },
      { text: '4. We have two exams:a midterm and a final in this course.', correctWord: 'two' },
      { text: '5. You are allowed to miss two classes at most in the semester.', correctWord: 'two' },
      { text: '6. I began to take part in competitions three years after learning the piano.', correctWord: 'three' },
      { text: '7. I have stayed in Paris for nearly five years now as a pianist.', correctWord: 'five' },
      { text: '8. The hike took us four hours to reach the final destination.', correctWord: 'four' },
      { text: '9. There are three levels —the high level,the middle level and the low level in the poetry competition.', correctWord: 'three' },
      { text: '10. I go hiking with 3 partners once or twice every week after school.', correctWord: '3' }
    ]
  }
];

// ========== 第三环节：复数形式识别（3组，点击句中 some/many/数字 修饰的名词复数） ==========
const PLURAL_FORM_GROUPS = [
  {
    _id: 'pf1',
    hint: '规则变化的名词复数一般以s、es结尾',
    sentences: [
      { text: "1. I've made some new friends.", correctWord: 'friends' },
      { text: '2. Some students did very well last year including Nancy,Maria and Linda.', correctWord: 'students' },
      { text: '3. There are some important things that everybody should pay attention to.', correctWord: 'things' },
      { text: '4. We can download some applications conveniently.', correctWord: 'applications' },
      { text: '5. Are there some other notable wins I would know of?', correctWord: 'wins' },
      { text: '6. Do they have some sporting activities there,too?', correctWord: 'activities' },
      { text: '7. We have some voluntary jobs to do after class with each other.', correctWord: 'jobs' },
      { text: '8. I have some other questions and want to talk to someone about the rule.', correctWord: 'questions' },
      { text: '9. There are some cool friends I met during the trip in Thailand.', correctWord: 'friends' },
      { text: '10. Some participants join in the short video solicitation activity actively.', correctWord: 'participants' }
    ]
  },
  {
    _id: 'pf2',
    hint: '规则变化的名词复数一般以s、es结尾',
    sentences: [
      { text: '1. Many students have been leaving garbage in public.', correctWord: 'students' },
      { text: '2. There are many new faces here in the Environmental Protection Union.', correctWord: 'faces' },
      { text: '3. Many high schools in the US have vocational classes for students.', correctWord: 'schools' },
      { text: '4. Many service workers rely on that for their daily living in America.', correctWord: 'workers' },
      { text: "5. Many guests went to the party in Lucky Chen's Restaurant that evening.", correctWord: 'guests' },
      { text: '6. Many foreign students take part in the Chinese Speech Contest every year.', correctWord: 'students' },
      { text: '7. Many participants share their amazing moments in the short video activity.', correctWord: 'participants' },
      { text: "8. Many families go to Lucky Chen's Restaurant in Canada's Chinatown.", correctWord: 'families' },
      { text: '9. Many classmates encourage each other during the school hike activity.', correctWord: 'classmates' },
      { text: '10. Many tourists visit the Lake District to enjoy the beautiful scenery every summer.', correctWord: 'tourists' }
    ]
  },
  {
    _id: 'pf3',
    hint: '规则变化的名词复数一般以s、es结尾',
    sentences: [
      { text: '1. One is thirteen thirteen years old,and the other is ten.', correctWord: 'years' },
      { text: '2. I attend a class with another 21 students from different countries.', correctWord: 'students' },
      { text: '3. It has 21 categories in total for the Pulitzer Prize.', correctWord: 'categories' },
      { text: '4. We have two exams:a midterm and a final in this course.', correctWord: 'exams' },
      { text: '5. You are allowed to miss two classes at most in the semester.', correctWord: 'classes' },
      { text: '6. I began to take part in competitions three years after learning the piano.', correctWord: 'competitions' },
      { text: '7. I have stayed in Paris for nearly five years now as a pianist.', correctWord: 'years' },
      { text: '8. The hike took us four hours to reach the final destination.', correctWord: 'hours' },
      { text: '9. There are three levels —the high level,the middle level and the low level in the poetry competition.', correctWord: 'levels' },
      { text: '10. I go hiking with 3 partners once or twice every week after school.', correctWord: 'partners' }
    ]
  }
];

// ========== 第四环节：正误判断（3组，√×判断句子是否符合 some/many/数字+名词复数） ==========
const TRUE_FALSE_GROUPS = [
  {
    _id: 'tf1',
    hint: 'some后的名词要变复数，加s/es，，注意there are+名词复数',
    sentences: [
      { text: "1. I've made some new friend.", correct: false },
      { text: '2. Some students did very well last year including Nancy,Maria and Linda.', correct: true },
      { text: '3. There is some important things that everybody should pay attention to.', correct: false },
      { text: '4. We can download some applications conveniently.', correct: true },
      { text: '5. Are there some other notable win I would know of?', correct: false },
      { text: '6. Do they have some sporting activity there,too?', correct: false },
      { text: '7. We have some voluntary job to do after class with each other.', correct: false },
      { text: '8. I have some other questions and want to talk to someone about the rule.', correct: true },
      { text: '9. There are some cool friend I met during the trip in Thailand.', correct: false },
      { text: '10. Some participant join in the short video solicitation activity actively.', correct: false }
    ]
  },
  {
    _id: 'tf2',
    hint: 'many后的名词要变复数，加s/es，，注意there are+名词复数',
    sentences: [
      { text: '1. Many student have been leaving garbage in public.', correct: false },
      { text: '2. There is many new faces here in the Environmental Protection Union.', correct: false },
      { text: '3. Many high schools in the US have vocational classes for students.', correct: true },
      { text: '4. Many service jobs rely on that for their daily living in America.', correct: true },
      { text: "5. Many guest went to the party in Lucky Chen's Restaurant that evening.", correct: false },
      { text: '6. Many foreign students take part in the Chinese Speech Contest every year.', correct: true },
      { text: '7. Many participant share their amazing moments in the short video activity.', correct: false },
      { text: "8. Many families go to Lucky Chen's Restaurant in Canada's Chinatown.", correct: true },
      { text: '9. Many classmate encourage each other during the school hike activity.', correct: false },
      { text: '10. Many tourist visit the Lake District to enjoy the beautiful scenery every summer.', correct: false }
    ]
  },
  {
    _id: 'tf3',
    hint: '数字后的名词要变复数，加s/es，，注意阿拉伯数字和英语数字',
    sentences: [
      { text: '1. One is thirteen thirteen year old,and the other is ten.', correct: false },
      { text: '2. I attend a class with another 21 student from different countries.', correct: false },
      { text: '3. It has 21 categories in total for the Pulitzer Prize.', correct: true },
      { text: '4. We have two exam:a midterm and a final in this course.', correct: false },
      { text: '5. You are allowed to miss two classes at most in the semester.', correct: true },
      { text: '6. I began to take part in competition three years after learning the piano.', correct: false },
      { text: '7. I have stayed in Paris for nearly five year now as a pianist.', correct: false },
      { text: '8. The hike took us four hour to reach the final destination.', correct: false },
      { text: '9. There are three levels —the high level,the middle level and the low level in the poetry competition.', correct: true },
      { text: '10. I go hiking with 3 partner once or twice every week after school.', correct: false }
    ]
  }
];

// ========== 第五环节：书写名词复数·单选题（2组，es 规则选择题） ==========
const ES_CHOICE_GROUPS = [
  {
    _id: 'es1',
    hint: '以s/sh/ch/x结尾的名词变复数加es',
    questions: [
      { text: '1. 下列书写错误的是（）', option: ['A. class → classes', 'B. dish → dishs', 'C. watch → watches', 'D. fox → foxes'], answer: 'B. dish → dishs' },
      { text: '2. 下列书写错误的是（）', option: ['A. bus → bus', 'B. brush → brushes', 'C. peach → peaches', 'D. tax → taxes'], answer: 'A. bus → bus' },
      { text: '3. 下列书写错误的是（）', option: ['A. dress → dresses', 'B. wish → wishes', 'C. lunch → lunchs', 'D. wax → waxes'], answer: 'C. lunch → lunchs' },
      { text: '4. 下列书写错误的是（）', option: ['A. glass → glasses', 'B. wash → washes', 'C. beach → beaches', 'D. ax → axs'], answer: 'D. ax → axs' },
      { text: '5. 下列书写错误的是（）', option: ['A. glass → glasses', 'B. wish → wishs', 'C. church → churches', 'D. tax → taxes'], answer: 'B. wish → wishs' }
    ]
  },
  {
    _id: 'es2',
    hint: '以s/sh/ch/x结尾的名词变复数加es',
    questions: [
      { text: '1. 下列some/many/数字加名词复数书写正确的是（）', option: ['A. I have many class.', 'B. She washes some dishs.', 'C. He buys two watch.', 'D. I see three foxes.'], answer: 'D. I see three foxes.' },
      { text: '2. 下列some/many/数字加名词复数书写正确的是（）', option: ['A. There are some bus.', 'B. I need many brushs.', 'C. She eats four peaches.', 'D. He pays five tax.'], answer: 'C. She eats four peaches.' },
      { text: '3. 下列some/many/数字加名词复数书写正确的是（）', option: ['A. I like some dress.', 'B. He makes many wishs.', 'C. We have six lunchs.', 'D. There are seven waxes.'], answer: 'D. There are seven waxes.' },
      { text: '4. 下列some/many/数字加名词复数书写正确的是（）', option: ['A. I wear eight glasses.', 'B. He does some washs.', 'C. They go to nine beach.', 'D. I use ten ax.'], answer: 'A. I wear eight glasses.' },
      { text: '5. 下列some/many/数字加名词复数书写正确的是（）', option: ['A. I need some glass.', 'B. She has many wishes.', 'C. We visit eleven churchs.', 'D. He collects twelve taxs.'], answer: 'B. She has many wishes.' }
    ]
  }
];

// ========== 第六环节：真题变式填空/改错（2组，每组10空） ==========
const FILL_MOCK_GROUPS = [
  {
    _id: 'fm1',
    hint: '本节课学习了三个关键的名词复数标志词，分别是some/many/数字;学习了常见的名词复数变化是在括号里的词后面加s/es;其中加es的情况最常见的是括号里的词以s/sh/ch/x结尾; 此外需要注意there are+名词复数',
    questions: [
      { text: '1. There are five ______ (boy) in his class.', blanks: ['boys'] },
      { text: '2. There are 6 _____ (pen) on the shelf.', blanks: ['pens'] },
      { text: '3. There ______ (be) some pens on the table.', blanks: ['are'] },
      { text: '4. He can read many Chinese ______ (poem).', blanks: ['poems'] },
      { text: '5. Many ______ (day) ago, it was a Saturday afternoon on my fifth birthday.', blanks: ['days'] },
      { text: '6. I saw seven ______ (friend) this morning.', blanks: ['friends'] },
      { text: '7. During the second day, she had nine _______ (class), ate seven _______ (dish), bought five _______ (watch), and four ________ (box) of chocolates.', blanks: ['classes', 'dishes', 'watches', 'boxes'] }
    ]
  },
  {
    _id: 'fm2',
    hint: '本节课学习了三个关键的名词复数标志词，分别是some/many/数字;学习了常见的名词复数变化是在括号里的词后面加s/es;其中加es的情况最常见的是括号里的词以s/sh/ch/x结尾; 此外需要注意there are+名词复数',
    questions: [
      { text: '1. 请写出There are five boy in his class.中错误单词的正确形式', blanks: ['boys'] },
      { text: '2. 请写出There are 6 pen on the shelf..中错误单词的正确形式', blanks: ['pens'] },
      { text: '3. 请写出 There is some pens on the table.中错误单词的正确形式', blanks: ['are'] },
      { text: '4. 请写出He can read many Chinese poem.中错误单词的正确形式', blanks: ['poems'] },
      { text: '5. 请写出Many day ago, it was a Saturday afternoon on my fifth birthday.中错误单词的正确形式', blanks: ['days'] },
      { text: '6. 请写出 I saw seven friend this morning.中错误单词的正确形式', blanks: ['friends'] },
      { text: '7. 请写出During the second day, she had nine class.中错误单词的正确形式', blanks: ['classes'] },
      { text: '8. 请写出During the second day, she ate seven dishs.中错误单词的正确形式', blanks: ['dishes'] },
      { text: '9. 请写出During the second day, she bought five watchs.中错误单词的正确形式', blanks: ['watches'] },
      { text: '10. 请写出During the second day, she got four boxs of chocolates.中错误单词的正确形式', blanks: ['boxes'] }
    ]
  }
];

// ========== 第七环节：真题再练（7道填空，与第一环节对比，存本地+星级） ==========
const REAL_RETEST = [
  { _id: 'rr1', text: '1. (23春68改错)There is some books on the desk.写出错误词汇的正确形式________', blanks: ['are'] },
  { _id: 'rr2', text: '8.(23秋67改错)She can sing many English song.写出错误词汇的正确形式________', blanks: ['songs'] },
  { _id: 'rr3', text: '9.(24春66改错)There are three girl in her family.写出错误词汇的正确形式________', blanks: ['girls'] },
  { _id: 'rr4', text: '10.(24秋66改错)There are 4 book on the desk.写出错误词汇的正确形式________', blanks: ['books'] },
  { _id: 'rr5', text: '11.(25春58改错)Many year ago, it was a Sunday morning on my tenth birthday.写出错误词汇的正确形式________', blanks: ['years'] },
  { _id: 'rr6', text: '12.(25春66改错)I bought four book yesterday.写出错误词汇的正确形式________', blanks: ['books'] },
  { _id: 'rr7', text: '13.(23秋60) During the first day, I had seven _______ (class) — Chinese, maths, English, physics, chemistry, PE and music. 写出括号中词汇的正确形式________', blanks: ['classes'] }
];

const REAL_RETEST_HINT = '本节课学习了三个关键的名词复数标志词，分别是some/many/数字;学习了常见的名词复数变化是在括号里的词后面加s/es;其中加es的情况最常见的是括号里的词以s/sh/ch/x结尾; 此外需要注意there are+名词复数';

// ========== 第八环节：帮同学找出表达里的错误（5句，点击句中错误词汇） ==========
const SENTENCE_ERROR_SENTENCES = [
  { text: '1. There are some important thing that everybody should pay attention to.', correctWord: 'thing' },
  { text: '2. All foreign students are welcome to share some amazing moment in China.', correctWord: 'moment' },
  { text: '3. It took us four hour to reach the destination.', correctWord: 'hour' },
  { text: '4. Then I served the two dish to my parents.', correctWord: 'dish' },
  { text: '5. Three year ago, I went to Beijing with my father for a trip.', correctWord: 'year' }
];

const SENTENCE_ERROR_HINT = '本节课学习了三个关键的名词复数标志词，分别是some/many/数字;学习了常见的名词复数变化是在括号里的词后面加s/es;其中加es的情况最常见的是括号里的词以s/sh/ch/x结尾; 此外需要注意there are+名词复数';

// ========== 第九环节：学以致用（5句英译填空，共10空） ==========
const APPLY_USE_QUESTIONS = [
  { text: '1. 有一些每个人都应该注意的重要事项。\nThere are _______ important _______ that everybody should pay attention to.', blanks: ['some', 'things'] },
  { text: '2. 欢迎所有外国学生分享在中国的一些精彩瞬间。\nAll foreign students are welcome to share _______ amazing _______ in China.', blanks: ['some', 'moments'] },
  { text: '3. 我们花了四个小时才到达目的地。\nIt took us _______ _______ to reach the destination.', blanks: ['four', 'hours'] },
  { text: '4. 然后我把这两道菜端给了父母。\nThen I served the _______ _______ to my parents.', blanks: ['two', 'dishes'] },
  { text: '5. 三年前，我和爸爸一起去北京旅行了。\n_______ _______ ago, I went to Beijing with my father for a trip.', blanks: ['Three', 'years'] }
];

const APPLY_USE_HINT = '本节课学习了三个关键的名词复数标志词，分别是some/many/数字;学习了常见的名词复数变化是在括号里的词后面加s/es;其中加es的情况最常见的是括号里的词以s/sh/ch/x结尾; 此外需要注意there are+名词复数';

// ========== 第十环节：一句话卡片（1句10空填空） ==========
const SUMMARY_CARD = {
  text: '本节课学习了三个关键的名词复数标志词，分别是________,_________,_________;学习了常见的名词复数变化是在括号里的词后面加_________,__________;其中加es的情况最常见的是括号里的词以_________,__________,_________,___________结尾，注意there _________+名词复数。',
  blanks: ['some', 'many', '数字', 's', 'es', 's', 'sh', 'ch', 'x', 'are']
};

const SUMMARY_CARD_HINT = '本节课学习了三个关键的名词复数标志词，分别是some/many/数字;学习了常见的名词复数变化是在括号里的词后面加s/es;其中加es的情况最常见的是括号里的词以s/sh/ch/x结尾; 此外需要注意there are+名词复数';

// ========== 课前60分钟：真题检测（6道改错题，以选择题形式作答） ==========
const PRE_TEST = [
  {
    _id: 'pt1',
    text: '找出错误并改正：There is some pen on the desk.',
    option: ['pen→pens', 'is→are', 'some→a', 'desk→desks'],
    answer: 'pen→pens',
    analysis: 'some 后接可数名词复数，pen 应加 s。',
    tag: 'some+名词复数'
  },
  {
    _id: 'pt2',
    text: '找出错误并改正：She can draw many nice picture.',
    option: ['picture→pictures', 'many→much', 'draw→draws', 'nice→nicer'],
    answer: 'picture→pictures',
    analysis: 'many 后接可数名词复数，picture 应加 s。',
    tag: 'many+名词复数'
  },
  {
    _id: 'pt3',
    text: '找出错误并改正：There are five apple in the bag.',
    option: ['apple→apples', 'are→is', 'five→fifth', 'bag→bags'],
    answer: 'apple→apples',
    analysis: '数字 five 后接可数名词复数，apple 应加 s。',
    tag: '数字+名词复数'
  },
  {
    _id: 'pt4',
    text: '找出错误并改正：I see 6 bird in the tree this morning.',
    option: ['bird→birds', 'see→saw', '6→six', 'tree→trees'],
    answer: 'bird→birds',
    analysis: '数字 6 后接可数名词复数，bird 应加 s。',
    tag: '数字+名词复数'
  },
  {
    _id: 'pt5',
    text: '找出错误并改正：Many day later, we will meet again.',
    option: ['day→days', 'later→late', 'will→would', 'meet→meets'],
    answer: 'day→days',
    analysis: 'many 后接可数名词复数，day 应加 s。',
    tag: 'many+名词复数'
  },
  {
    _id: 'pt6',
    text: '找出错误并改正：My mom buys two cake for my birthday.',
    option: ['cake→cakes', 'two→second', 'buys→buy', 'birthday→birthdays'],
    answer: 'cake→cakes',
    analysis: '数字 two 后接可数名词复数，cake 应加 s。',
    tag: '数字+名词复数'
  }
];

// ========== 直播7-9分钟：关键词识别（8道选择+2道调研） ==========
const KEYWORD_CHOICE = [
  {
    _id: 'k1',
    text: '下列哪个词出现时，后面名词需要变复数+s/+es？（）',
    option: ['a', 'some', 'one', 'this'],
    answer: 'some',
    analysis: 'some 表“一些”，后接可数名词复数。',
    tag: '标志词识别'
  },
  {
    _id: 'k2',
    text: '以下哪组词汇都属于考点触发词？（）',
    option: ['many/数字/some', 'much/a little/any', 'every/each/that', 'this/that/it'],
    answer: 'many/数字/some',
    analysis: '口诀：some，many和数字，看见加s或es。',
    tag: '标志词识别'
  },
  {
    _id: 'k3',
    text: '句子中出现“seven”（数字），后面的可数名词要？（）',
    option: ['用原形', '变复数+s/+es', '变特殊复数', '改y为ies'],
    answer: '变复数+s/+es',
    analysis: '数字后接可数名词用复数，本题仅考+s/+es。',
    tag: '标志词识别'
  },
  {
    _id: 'k4',
    text: '触发词“some”后接可数名词book，应变为？（）',
    option: ['book', 'books', 'bookes', "book's"],
    answer: 'books',
    analysis: 'book 以辅音字母结尾，直接加 s。',
    tag: '对应词法'
  },
  {
    _id: 'k5',
    text: '触发词“five”后接可数名词class，应变为？（）',
    option: ['class', 'classs', 'classes', "class'es"],
    answer: 'classes',
    analysis: 'class 以 s 结尾，加 es。',
    tag: '对应词法'
  },
  {
    _id: 'k6',
    text: '触发词“many”后接可数名词song，应变为？（）',
    option: ['song', 'songs', 'songes', 'sung'],
    answer: 'songs',
    analysis: 'song 以辅音字母结尾，直接加 s。',
    tag: '对应词法'
  },
  {
    _id: 'k7',
    text: '触发考点后，名词family的变形正确的是？（）（本题仅考+s/+es，排除改y为ies等）',
    option: ['families（超纲排除）', 'family（原形）', 'familys（仅+s）', 'familyes'],
    answer: 'familys（仅+s）',
    analysis: '本课仅考+s/+es，不考y改ies；family 特殊变化超纲排除。',
    tag: '词法书写'
  },
  {
    _id: 'k8',
    text: '触发考点后，下列变形唯一正确的是？（）',
    option: ['girl→girls', 'leaf→leaves（超纲排除）', 'baby→babies（超纲排除）', 'man→men（超纲排除）'],
    answer: 'girl→girls',
    analysis: '本课仅考+s/+es；girl 直接加 s 正确。',
    tag: '词法书写'
  }
];

const KEYWORD_FEEDBACK = [
  {
    _id: 'f1',
    type: 'feedback',
    text: '关于“some/many/数字+名词变复数”的知识点，你目前的掌握程度？（）',
    option: ['完全掌握', '基本掌握', '有点模糊', '完全不会'],
    answer: ''
  },
  {
    _id: 'f2',
    type: 'feedback',
    text: '你偏好用小程序检测还是直接把答案打在公屏上？（）',
    option: ['小程序检测', '公屏打字', '都可以', '无所谓'],
    answer: ''
  }
];

// ========== 直播10-12分钟：填空运用规则（10题） ==========
const FILL_RULE = [
  { _id: 'fr1', text: 'There is some ______ (pen) on my desk.', blanks: ['pens'], analysis: 'some+可数名词复数，pen→pens。' },
  { _id: 'fr2', text: 'She has many ______ (friend) in the school.', blanks: ['friends'], analysis: 'many+可数名词复数，friend→friends。' },
  { _id: 'fr3', text: 'I see three ______ (tree) near the park.', blanks: ['trees'], analysis: '数字three+可数名词复数，tree→trees。' },
  { _id: 'fr4', text: 'There are 8 ______ (desk) in the classroom.', blanks: ['desks'], analysis: '数字8+可数名词复数，desk→desks。' },
  { _id: 'fr5', text: 'Many ______ (student) like English very much.', blanks: ['students'], analysis: 'many+可数名词复数，student→students。' },
  { _id: 'fr6', text: 'He buys four ______ (box) in the shop.', blanks: ['boxes'], analysis: '数字+可数名词，box以x结尾加es。' },
  { _id: 'fr7', text: 'There is some ______ (book) in my schoolbag.', blanks: ['books'], analysis: 'some+可数名词复数，book→books。' },
  { _id: 'fr8', text: 'We have six ______ (class) every morning.', blanks: ['classes'], analysis: '数字+可数名词，class以s结尾加es。' },
  { _id: 'fr9', text: 'I find 10 ______ (bag) in the library.', blanks: ['bags'], analysis: '数字10+可数名词复数，bag→bags。' },
  { _id: 'fr10', text: 'Many ______ (year) pass by quickly.', blanks: ['years'], analysis: 'many+可数名词复数，year→years。' }
];

// ========== 直播13-15分钟：真题填空（5题，近三年变式） ==========
const FILL_REAL = [
  { _id: 'fe1', text: '[23秋变式] During the first day, I have six ______ (class) in the school.', blanks: ['classes'], analysis: '数字six+可数名词，class→classes。' },
  { _id: 'fe2', text: '[24春变式] There are four ______ (girl) in our group.', blanks: ['girls'], analysis: '数字four+可数名词复数，girl→girls。' },
  { _id: 'fe3', text: '[24秋变式] There are 5 ______ (book) on the teacher\'s desk.', blanks: ['books'], analysis: '数字5+可数名词复数，book→books。' },
  { _id: 'fe4', text: '[25春变式] Many ______ (year) ago, I lived in a small village.', blanks: ['years'], analysis: 'many+可数名词复数，year→years。' },
  { _id: 'fe5', text: '[23春变式] There is some ______ (flower) on the window.', blanks: ['flowers'], analysis: 'some+可数名词复数，flower→flowers。' }
];

// ========== 直播22-25分钟：翻译题（5个核心句 + 2个加练句） ==========
const TRANSLATION_CORE = [
  { zh: '桌子上有一些书。', en: 'There are some books on the desk.' },
  { zh: '她会唱很多英文歌。', en: 'She can sing many English songs.' },
  { zh: '我家有三个女孩。', en: 'There are three girls in my family.' },
  { zh: '我的书桌上有四本书。', en: 'There are four books on my desk.' },
  { zh: '我昨天买了两个盒子。', en: 'I bought two boxes yesterday.' }
];

const TRANSLATION_EXTRA = [
  { zh: '公园里有很多树。', en: 'There are many trees in the park.' },
  { zh: '我们每天有七节课。', en: 'We have seven classes every day.' }
];

// 合并为核心5句+加练2句（加练时从全部7句随机抽）
const TRANSLATION_ALL = [...TRANSLATION_CORE, ...TRANSLATION_EXTRA];

module.exports = {
  REAL_EXAM_PREPRACTICE,
  REAL_EXAM_PREPRACTICE_HINT,
  SIGNAL_WORD_GROUPS,
  PLURAL_FORM_GROUPS,
  TRUE_FALSE_GROUPS,
  ES_CHOICE_GROUPS,
  FILL_MOCK_GROUPS,
  REAL_RETEST,
  REAL_RETEST_HINT,
  SENTENCE_ERROR_SENTENCES,
  SENTENCE_ERROR_HINT,
  APPLY_USE_QUESTIONS,
  APPLY_USE_HINT,
  SUMMARY_CARD,
  SUMMARY_CARD_HINT,
  PRE_TEST,
  KEYWORD_CHOICE,
  KEYWORD_FEEDBACK,
  FILL_RULE,
  FILL_REAL,
  TRANSLATION_CORE,
  TRANSLATION_EXTRA,
  TRANSLATION_ALL
};
