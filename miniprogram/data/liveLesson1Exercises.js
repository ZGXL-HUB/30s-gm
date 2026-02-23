/**
 * 第一课习题库：some/many/数字+名词复数(+s/+es) + be动词匹配
 * 存储位置：miniprogram/data/liveLesson1Exercises.js
 * 修改此处即可更新第1课各环节题目，提高题目质量。
 */

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
  PRE_TEST,
  KEYWORD_CHOICE,
  KEYWORD_FEEDBACK,
  FILL_RULE,
  FILL_REAL,
  TRANSLATION_CORE,
  TRANSLATION_EXTRA,
  TRANSLATION_ALL
};
