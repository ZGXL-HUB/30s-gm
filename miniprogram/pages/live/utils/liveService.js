/**
 * 直播课活动 · 学生端服务
 * 活动配置、题目拉取、提交记录（含 openid）
 * 位置：live 分包内，避免主包「未使用 JS」报错
 */
const { getActivityById, getSegmentConfig, SEGMENT_TYPES, LESSON1_SEGMENTS } = require('../config/liveActivityConfig.js');
const cloudDataLoader = require('../../../utils/cloudDataLoader.js');

const STORAGE_KEY_PREFIX = 'live_result_';
const STORAGE_PRE_TEST_PREFIX = 'live_pre_test_';
const STORAGE_PREPRACTICE_RATE = 'live_prepractice_rate_'; // 第一环节正确率，仅本地，供最后环节对比
const STORAGE_RETEST_RATE = 'live_retest_rate_';           // 第七环节正确率，仅本地，与第一环节对比
const STORAGE_LESSON1_STARS = 'live_lesson1_stars';       // 第一课入口卡片星级（1/2/3）
const STORAGE_COMPLETED_LESSONS = 'live_completed_lessons';

function getOpenId() {
  try {
    const userInfo = wx.getStorageSync('userInfo');
    return (userInfo && userInfo.openid) ? userInfo.openid : 'anonymous_' + Date.now();
  } catch (e) {
    return 'anonymous_' + Date.now();
  }
}

/**
 * 解析扫码进入的 scene（小程序码场景值）或 query
 */
function parseActivityId(scene, query) {
  if (query && query.activityId) return query.activityId;
  if (!scene || typeof scene !== 'string') return null;
  const parts = scene.split('&').map(p => p.split('='));
  for (const [k, v] of parts) {
    if (k === 'activityId' && v) return decodeURIComponent(v);
  }
  return scene;
}

function getActivityConfig(activityId) {
  return getActivityById(activityId);
}

async function getPreTestQuestions(activityId, limit = 10) {
  const activity = getActivityById(activityId);
  const segment = getSegmentConfig(activity, SEGMENT_TYPES.PRE_CLASS_TEST);
  const num = (segment && segment.limit) ? segment.limit : limit;

  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    if (activityId === 'lesson1' && lesson1.PRE_TEST && lesson1.PRE_TEST.length > 0) {
      return lesson1.PRE_TEST.slice(0, num);
    }
  } catch (e) {}

  const grammarPoint = (activity && activity.grammarPoint) ? activity.grammarPoint : '一般现在时';
  const schoolLevel = (activity && activity.schoolLevel) ? activity.schoolLevel : 'middle';

  if (wx.cloud && wx.cloud.database) {
    try {
      const list = await cloudDataLoader.getQuestionsByGrammarPoint(grammarPoint, schoolLevel, 'choice', num);
      if (list && list.length > 0) {
        return list.map(q => ({
          _id: q._id,
          text: q.text,
          option: Array.isArray(q.option) ? q.option : (q.options || []),
          answer: q.answer,
          analysis: q.analysis || '',
          tag: q.tag || q.grammarPoint || ''
        }));
      }
    } catch (e) {
      console.warn('getPreTestQuestions cloud fail', e);
    }
  }

  return getFallbackChoiceQuestions(num);
}

function getKeywordCheckQuestions(activityId) {
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    if (activityId === 'lesson1' && lesson1.KEYWORD_CHOICE && lesson1.KEYWORD_FEEDBACK) {
      return { choice: lesson1.KEYWORD_CHOICE, feedback: lesson1.KEYWORD_FEEDBACK };
    }
  } catch (e) {}

  const choice = [
    { _id: 'k1', text: '下列哪项是一般现在时的标志词？', option: ['yesterday', 'every day', 'last week'], answer: 'every day', analysis: 'every day 表示经常', tag: '标志词' },
    { _id: 'k2', text: '下列哪项是一般过去时的标志词？', option: ['now', 'last year', 'tomorrow'], answer: 'last year', analysis: 'last year 表示过去', tag: '标志词' },
    { _id: 'k3', text: '一般现在时第三人称单数动词要加？', option: ['s', 'ed', 'ing'], answer: 's', analysis: '第三人称单数加 s', tag: '词法' },
    { _id: 'k4', text: '一般过去时动词通常加？', option: ['s', 'ed', 'ing'], answer: 'ed', analysis: '规则动词加 ed', tag: '词法' },
    { _id: 'k5', text: '"He ____ to school every day." 正确形式是？', option: ['go', 'goes', 'going'], answer: 'goes', analysis: '第三人称单数', tag: '书写' },
    { _id: 'k6', text: '"She ____ TV yesterday." 正确形式是？', option: ['watch', 'watches', 'watched'], answer: 'watched', analysis: '过去时', tag: '书写' },
    { _id: 'k7', text: '现在进行时的结构是？', option: ['do + 动词原形', 'be + 动词ing', 'have + 过去分词'], answer: 'be + 动词ing', analysis: 'be doing', tag: '词法' },
    { _id: 'k8', text: '现在完成时的结构是？', option: ['be + 动词ing', 'have + 过去分词', 'will + 动词原形'], answer: 'have + 过去分词', analysis: 'have done', tag: '词法' }
  ];
  const feedback = [
    { _id: 'f1', type: 'feedback', text: '你掌握了什么？', option: ['标志词识别', '词法规则', '书写形式', '都掌握了'], answer: '' },
    { _id: 'f2', type: 'feedback', text: '你偏好用小程序检测还是直接打在公屏上？', option: ['小程序检测', '打在公屏上', '都可以'], answer: '' }
  ];
  return { choice, feedback };
}

async function getFillQuestions(activityId, segmentType, limit = 10) {
  const activity = getActivityById(activityId);
  const seg = activity && activity.segments ? activity.segments.find(s => s.type === segmentType) : null;
  const num = (seg && seg.limit) ? seg.limit : limit;

  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    if (activityId === 'lesson1') {
      if (segmentType === SEGMENT_TYPES.FILL_RULE && lesson1.FILL_RULE && lesson1.FILL_RULE.length > 0) {
        return lesson1.FILL_RULE.slice(0, num).map(q => ({ ...q, blanks: q.blanks || [] }));
      }
      if (segmentType === SEGMENT_TYPES.FILL_REAL && lesson1.FILL_REAL && lesson1.FILL_REAL.length > 0) {
        return lesson1.FILL_REAL.slice(0, num).map(q => ({ ...q, blanks: q.blanks || [] }));
      }
    }
  } catch (e) {}

  const grammarPoint = (activity && activity.grammarPoint) ? activity.grammarPoint : '一般现在时';
  const schoolLevel = (activity && activity.schoolLevel) ? activity.schoolLevel : 'middle';

  if (wx.cloud && wx.cloud.database) {
    try {
      const list = await cloudDataLoader.getQuestionsByGrammarPoint(grammarPoint, schoolLevel, 'fill', num);
      if (list && list.length > 0) {
        return list.map(q => normalizeFillQuestion(q));
      }
    } catch (e) {
      console.warn('getFillQuestions cloud fail', e);
    }
  }

  return getFallbackFillQuestions(num);
}

function normalizeFillQuestion(q) {
  const text = q.text || '';
  const answer = q.answer;
  const blanks = answer ? (Array.isArray(answer) ? answer : [answer]) : [];
  return {
    _id: q._id,
    text,
    blanks,
    analysis: q.analysis || '',
    tag: q.tag || q.grammarPoint || ''
  };
}

function getTranslationSentences(activityId) {
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    if (activityId === 'lesson1' && lesson1.TRANSLATION_ALL && lesson1.TRANSLATION_ALL.length > 0) {
      return lesson1.TRANSLATION_ALL;
    }
  } catch (e) {}

  const activity = getActivityById(activityId);
  const seg = getSegmentConfig(activity, SEGMENT_TYPES.TRANSLATION);
  const sentences = (seg && seg.sentences && seg.sentences.length) ? seg.sentences : require('../config/liveActivityConfig.js').DEFAULT_TRANSLATION_SENTENCES;
  return sentences;
}

function pickOneTranslation(sentences) {
  if (!sentences || sentences.length === 0) return null;
  const idx = Math.floor(Math.random() * sentences.length);
  return { index: idx, ...sentences[idx] };
}

function saveResult(activityId, segmentType, payload) {
  const openid = getOpenId();
  const key = `${STORAGE_KEY_PREFIX}${activityId}_${segmentType}`;
  const record = {
    activityId,
    segmentType,
    openid,
    ...payload,
    submitTime: new Date().toISOString()
  };
  try {
    wx.setStorageSync(key, record);
    markLessonCompleted(activityId);
  } catch (e) {
    console.warn('saveResult storage fail', e);
  }
  return record;
}

function savePreTestResult(activityId, score, total, questionResults) {
  const openid = getOpenId();
  const key = `${STORAGE_PRE_TEST_PREFIX}${activityId}`;
  const record = {
    activityId,
    openid,
    score,
    total,
    correctRate: total > 0 ? Math.round((score / total) * 100) : 0,
    questionResults: questionResults || [],
    submitTime: new Date().toISOString()
  };
  try {
    wx.setStorageSync(key, record);
    markLessonCompleted(activityId);
  } catch (e) {
    console.warn('savePreTestResult storage fail', e);
  }
  return record;
}

function markLessonCompleted(activityId) {
  if (!activityId) return;
  try {
    const raw = wx.getStorageSync(STORAGE_COMPLETED_LESSONS);
    const set = raw && Array.isArray(raw) ? [...raw] : [];
    if (!set.includes(activityId)) {
      set.push(activityId);
      wx.setStorageSync(STORAGE_COMPLETED_LESSONS, set);
    }
  } catch (e) {
    console.warn('markLessonCompleted fail', e);
  }
}

function getCompletedLessonIds() {
  try {
    const raw = wx.getStorageSync(STORAGE_COMPLETED_LESSONS);
    return raw && Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

function getPreTestResult(activityId) {
  try {
    return wx.getStorageSync(`${STORAGE_PRE_TEST_PREFIX}${activityId}`) || null;
  } catch (e) {
    return null;
  }
}

function getSegmentResult(activityId, segmentType) {
  try {
    return wx.getStorageSync(`${STORAGE_KEY_PREFIX}${activityId}_${segmentType}`) || null;
  } catch (e) {
    return null;
  }
}

function getFallbackChoiceQuestions(limit) {
  const all = [
    { _id: 'f1', text: 'He ____ to school every day.', option: ['go', 'goes', 'going', 'went'], answer: 'goes', analysis: '第三人称单数', tag: '一般现在时' },
    { _id: 'f2', text: 'She ____ TV yesterday.', option: ['watch', 'watches', 'watched', 'watching'], answer: 'watched', analysis: '过去时', tag: '一般过去时' },
    { _id: 'f3', text: 'They ____ playing football now.', option: ['is', 'are', 'was', 'were'], answer: 'are', analysis: '现在进行时', tag: '现在进行时' },
    { _id: 'f4', text: 'I ____ already ____ my homework.', option: ['have, finish', 'has, finished', 'have, finished', 'had, finished'], answer: 'have, finished', analysis: '现在完成时', tag: '现在完成时' },
    { _id: 'f5', text: 'The book ____ by Tom last week.', option: ['reads', 'is read', 'was read', 'read'], answer: 'was read', analysis: '被动语态', tag: '被动语态' },
    { _id: 'f6', text: 'We ____ to the park if it is fine tomorrow.', option: ['go', 'went', 'will go', 'going'], answer: 'will go', analysis: '一般将来时', tag: '一般将来时' },
    { _id: 'f7', text: 'My mother ____ cooking when I got home.', option: ['is', 'was', 'are', 'were'], answer: 'was', analysis: '过去进行时', tag: '过去进行时' },
    { _id: 'f8', text: 'Lucy ____ English for three years.', option: ['learns', 'has learned', 'learned', 'will learn'], answer: 'has learned', analysis: '现在完成时', tag: '现在完成时' },
    { _id: 'f9', text: 'There ____ a meeting tomorrow.', option: ['is', 'will be', 'was', 'are'], answer: 'will be', analysis: 'There be 将来时', tag: 'There be句型' },
    { _id: 'f10', text: 'The room ____ every day.', option: ['cleans', 'is cleaned', 'cleaned', 'cleaning'], answer: 'is cleaned', analysis: '被动语态', tag: '被动语态' }
  ];
  return all.slice(0, limit);
}

function getFallbackFillQuestions(limit) {
  const all = [
    { _id: 'fill1', text: 'He ____ (go) to school every day.', blanks: ['goes'], analysis: '第三人称单数加 s' },
    { _id: 'fill2', text: 'She ____ (watch) TV yesterday.', blanks: ['watched'], analysis: '过去时' },
    { _id: 'fill3', text: 'They ____ (play) football now.', blanks: ['are playing'], analysis: '现在进行时' },
    { _id: 'fill4', text: 'I ____ already ____ (finish) my homework.', blanks: ['have', 'finished'], analysis: '现在完成时' },
    { _id: 'fill5', text: 'The window ____ (break) by the boy.', blanks: ['was broken'], analysis: '被动语态' },
    { _id: 'fill6', text: 'We ____ (visit) the museum next week.', blanks: ['will visit'], analysis: '一般将来时' },
    { _id: 'fill7', text: 'My sister ____ (read) when I came in.', blanks: ['was reading'], analysis: '过去进行时' },
    { _id: 'fill8', text: 'He ____ (live) here since 2020.', blanks: ['has lived'], analysis: '现在完成时' },
    { _id: 'fill9', text: 'There ____ (be) two books on the desk.', blanks: ['are'], analysis: 'There be' },
    { _id: 'fill10', text: 'The letter ____ (write) by him.', blanks: ['was written'], analysis: '被动语态' }
  ];
  return all.slice(0, limit).map(q => ({ ...q, text: q.text, blanks: q.blanks }));
}

const NUM_WORDS = { '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten', '11': 'eleven', '12': 'twelve' };
function normalizeForTranslation(s) {
  if (!s || typeof s !== 'string') return '';
  let t = s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/['']/g, "'");
  t = t.replace(/[.!?,;]+$/g, '').trim();
  t = t.replace(/\beveryday\b/g, 'every day');
  Object.keys(NUM_WORDS).forEach(num => {
    const word = NUM_WORDS[num];
    const re = new RegExp('\\b' + num + '\\b', 'g');
    t = t.replace(re, word);
  });
  return t;
}

function matchTranslation(userAnswer, correctEn) {
  const r = matchTranslationWithHint(userAnswer, correctEn);
  return r.match;
}

function matchTranslationWithHint(userAnswer, correctEn) {
  if (!userAnswer || !correctEn) {
    return { match: false, hint: ['请填写答案'] };
  }
  const u = normalizeForTranslation(userAnswer);
  const c = normalizeForTranslation(correctEn);
  if (u === c) return { match: true, hint: [] };

  const hints = [];
  const rawUser = String(userAnswer).trim();
  const rawCorrect = String(correctEn).trim();
  if (rawCorrect.length > 0 && rawUser.length > 0) {
    const correctFirst = rawCorrect[0];
    if (correctFirst === correctFirst.toUpperCase() && rawUser[0] !== rawUser[0].toUpperCase()) {
      hints.push('句首首字母需大写');
    }
  }
  if (/\d/.test(rawUser) && /(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)/.test(correctEn.toLowerCase())) {
    hints.push('数字建议用英文单词（如 7→seven）');
  }
  if (/\beveryday\b/i.test(rawUser) && /\bevery day\b/i.test(correctEn)) {
    hints.push('everyday（形容词/副词）与 every day（每天）不同，此处应为 every day');
  }
  if (rawCorrect.slice(-1) === '.' && rawUser.slice(-1) !== '.') {
    hints.push('句末可加句号');
  }
  if (hints.length === 0) hints.push('请对照正确答案检查拼写或表达');
  return { match: false, hint: hints };
}

const SEGMENT_ORDER = [
  SEGMENT_TYPES.PRE_CLASS_TEST,
  SEGMENT_TYPES.KEYWORD_CHECK,
  SEGMENT_TYPES.FILL_RULE,
  SEGMENT_TYPES.FILL_REAL,
  SEGMENT_TYPES.TRANSLATION
];

const LESSON1_ORDER = (LESSON1_SEGMENTS || []).map(s => s.type);

function getSegmentOrder(activityId) {
  return activityId === 'lesson1' && LESSON1_ORDER.length > 0 ? LESSON1_ORDER : SEGMENT_ORDER;
}

const SEGMENT_NAMES = {
  [SEGMENT_TYPES.REAL_EXAM_PREPRACTICE]: '第一环节·真题预练',
  [SEGMENT_TYPES.SIGNAL_WORD_RECOGNITION]: '第二环节·标志词识别',
  [SEGMENT_TYPES.PLURAL_FORM_RECOGNITION]: '第三环节·复数形式识别',
  [SEGMENT_TYPES.TRUE_FALSE_JUDGE]: '第四环节·正误判断',
  [SEGMENT_TYPES.ES_PLURAL_CHOICE]: '第五环节·书写名词复数',
  [SEGMENT_TYPES.FILL_MOCK]: '第六环节·模拟演练',
  [SEGMENT_TYPES.REAL_RETEST]: '第七环节·真题再练',
  [SEGMENT_TYPES.SENTENCE_ERROR_CLICK]: '第八环节·帮同学找错',
  [SEGMENT_TYPES.APPLY_USE]: '第九环节·学以致用',
  [SEGMENT_TYPES.SUMMARY_CARD]: '第十环节·一句话卡片',
  [SEGMENT_TYPES.PRE_CLASS_TEST]: '课前·真题检测',
  [SEGMENT_TYPES.KEYWORD_CHECK]: '课中·关键词识别',
  [SEGMENT_TYPES.FILL_RULE]: '课中·填空运用规则',
  [SEGMENT_TYPES.FILL_REAL]: '课中·真题填空',
  [SEGMENT_TYPES.TRANSLATION]: '课中·翻译题'
};

function getFirstIncompleteSegment(activityId) {
  if (!activityId) return null;
  const order = getSegmentOrder(activityId);
  for (let i = 0; i < order.length; i++) {
    const type = order[i];
    let done = false;
    if (type === SEGMENT_TYPES.PRE_CLASS_TEST) {
      done = !!getPreTestResult(activityId);
    } else if (type === SEGMENT_TYPES.REAL_EXAM_PREPRACTICE) {
      done = !!getRealExamPrepracticeResult(activityId);
    } else if (type === SEGMENT_TYPES.REAL_RETEST) {
      done = !!getRealRetestResult(activityId);
    } else {
      done = !!getSegmentResult(activityId, type);
    }
    if (!done) {
      return { segmentType: type, name: SEGMENT_NAMES[type] || type };
    }
  }
  return null;
}

function getNextSegmentType(currentSegmentType, activityId) {
  const order = getSegmentOrder(activityId || 'lesson1');
  const idx = order.indexOf(currentSegmentType);
  if (idx === -1 || idx >= order.length - 1) return null;
  return order[idx + 1];
}

function getSegmentPagePath(segmentType) {
  const paths = {
    [SEGMENT_TYPES.REAL_EXAM_PREPRACTICE]: '/pages/live/real-exam-prep/index',
    [SEGMENT_TYPES.SIGNAL_WORD_RECOGNITION]: '/pages/live/signal-word/index',
    [SEGMENT_TYPES.PLURAL_FORM_RECOGNITION]: '/pages/live/plural-form/index',
    [SEGMENT_TYPES.TRUE_FALSE_JUDGE]: '/pages/live/true-false-judge/index',
    [SEGMENT_TYPES.ES_PLURAL_CHOICE]: '/pages/live/es-choice/index',
    [SEGMENT_TYPES.FILL_MOCK]: '/pages/live/fill-mock/index',
    [SEGMENT_TYPES.REAL_RETEST]: '/pages/live/real-retest/index',
    [SEGMENT_TYPES.SENTENCE_ERROR_CLICK]: '/pages/live/sentence-error/index',
    [SEGMENT_TYPES.APPLY_USE]: '/pages/live/apply-use/index',
    [SEGMENT_TYPES.SUMMARY_CARD]: '/pages/live/summary-card/index',
    [SEGMENT_TYPES.PRE_CLASS_TEST]: '/pages/live/pre-test/index',
    [SEGMENT_TYPES.KEYWORD_CHECK]: '/pages/live/keyword-check/index',
    [SEGMENT_TYPES.FILL_RULE]: '/pages/live/fill-rule/index',
    [SEGMENT_TYPES.FILL_REAL]: '/pages/live/fill-real/index',
    [SEGMENT_TYPES.TRANSLATION]: '/pages/live/translation/index'
  };
  return paths[segmentType] || '';
}

function getRealExamPrepracticeQuestions(activityId) {
  if (activityId !== 'lesson1') return [];
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    return (lesson1.REAL_EXAM_PREPRACTICE || []).map(q => ({
      ...q,
      blanks: Array.isArray(q.blanks) ? q.blanks : [q.blanks]
    }));
  } catch (e) {
    return [];
  }
}

function getRealExamPrepracticeHint(activityId) {
  if (activityId !== 'lesson1') return '';
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    return lesson1.REAL_EXAM_PREPRACTICE_HINT || '';
  } catch (e) {
    return '';
  }
}

function getSignalWordGroups(activityId) {
  if (activityId !== 'lesson1') return [];
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    return lesson1.SIGNAL_WORD_GROUPS || [];
  } catch (e) {
    return [];
  }
}

function getPluralFormGroups(activityId) {
  if (activityId !== 'lesson1') return [];
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    return lesson1.PLURAL_FORM_GROUPS || [];
  } catch (e) {
    return [];
  }
}

function getTrueFalseGroups(activityId) {
  if (activityId !== 'lesson1') return [];
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    return lesson1.TRUE_FALSE_GROUPS || [];
  } catch (e) {
    return [];
  }
}

function getEsChoiceGroups(activityId) {
  if (activityId !== 'lesson1') return [];
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    return lesson1.ES_CHOICE_GROUPS || [];
  } catch (e) {
    return [];
  }
}

function getFillMockGroups(activityId) {
  if (activityId !== 'lesson1') return [];
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    return lesson1.FILL_MOCK_GROUPS || [];
  } catch (e) {
    return [];
  }
}

function getRealRetestQuestions(activityId) {
  if (activityId !== 'lesson1') return [];
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    return (lesson1.REAL_RETEST || []).map(q => ({
      ...q,
      blanks: Array.isArray(q.blanks) ? q.blanks : [q.blanks]
    }));
  } catch (e) {
    return [];
  }
}

function getRealRetestHint(activityId) {
  if (activityId !== 'lesson1') return '';
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    return lesson1.REAL_RETEST_HINT || '';
  } catch (e) {
    return '';
  }
}

function getSentenceErrorData(activityId) {
  if (activityId !== 'lesson1') return { sentences: [], hint: '' };
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    return {
      sentences: lesson1.SENTENCE_ERROR_SENTENCES || [],
      hint: lesson1.SENTENCE_ERROR_HINT || ''
    };
  } catch (e) {
    return { sentences: [], hint: '' };
  }
}

function getApplyUseData(activityId) {
  if (activityId !== 'lesson1') return { questions: [], hint: '' };
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    const questions = (lesson1.APPLY_USE_QUESTIONS || []).map(q => ({
      ...q,
      blanks: Array.isArray(q.blanks) ? q.blanks : [q.blanks]
    }));
    return {
      questions,
      hint: lesson1.APPLY_USE_HINT || ''
    };
  } catch (e) {
    return { questions: [], hint: '' };
  }
}

function getSummaryCardData(activityId) {
  if (activityId !== 'lesson1') return null;
  try {
    const lesson1 = require('../../../data/liveLesson1Exercises.js');
    const card = lesson1.SUMMARY_CARD;
    if (!card) return null;
    return {
      text: card.text,
      blanks: Array.isArray(card.blanks) ? card.blanks : [card.blanks],
      hint: lesson1.SUMMARY_CARD_HINT || ''
    };
  } catch (e) {
    return null;
  }
}

function computeLesson1Stars(firstRate, retestRate) {
  if (firstRate == null || retestRate == null) return 2;
  if (retestRate > firstRate) return 3;
  if (retestRate < firstRate) return 1;
  return 2;
}

function saveRealRetestResult(activityId, correctRate, score, total) {
  const key = `${STORAGE_RETEST_RATE}${activityId}`;
  try {
    const firstResult = getRealExamPrepracticeResult(activityId);
    const firstRate = firstResult && firstResult.correctRate != null ? firstResult.correctRate : null;
    const stars = activityId === 'lesson1' ? computeLesson1Stars(firstRate, correctRate) : null;
    wx.setStorageSync(key, {
      activityId,
      correctRate,
      score: score ?? 0,
      total: total ?? 0,
      firstRate,
      stars,
      submitTime: new Date().toISOString()
    });
    if (activityId === 'lesson1' && stars != null) {
      wx.setStorageSync(STORAGE_LESSON1_STARS, stars);
    }
    markLessonCompleted(activityId);
  } catch (e) {
    console.warn('saveRealRetestResult fail', e);
  }
}

function getRealRetestResult(activityId) {
  try {
    const key = `${STORAGE_RETEST_RATE}${activityId}`;
    return wx.getStorageSync(key) || null;
  } catch (e) {
    return null;
  }
}

function getLesson1Stars(activityId) {
  if (activityId !== 'lesson1') return null;
  try {
    const stored = wx.getStorageSync(STORAGE_LESSON1_STARS);
    if (stored === 1 || stored === 2 || stored === 3) return stored;
    const retest = getRealRetestResult(activityId);
    return (retest && retest.stars) || null;
  } catch (e) {
    return null;
  }
}

function saveRealExamPrepracticeResult(activityId, correctRate, score, total) {
  const key = `${STORAGE_PREPRACTICE_RATE}${activityId}`;
  try {
    wx.setStorageSync(key, {
      activityId,
      correctRate,
      score: score ?? 0,
      total: total ?? 0,
      submitTime: new Date().toISOString()
    });
    markLessonCompleted(activityId);
  } catch (e) {
    console.warn('saveRealExamPrepracticeResult fail', e);
  }
}

function getRealExamPrepracticeResult(activityId) {
  try {
    const key = `${STORAGE_PREPRACTICE_RATE}${activityId}`;
    return wx.getStorageSync(key) || null;
  } catch (e) {
    return null;
  }
}

function clearSegmentProgress(activityId) {
  if (!activityId) return;
  try {
    const order = getSegmentOrder(activityId);
    order.forEach((segmentType) => {
      wx.removeStorageSync(`${STORAGE_KEY_PREFIX}${activityId}_${segmentType}`);
    });
    wx.removeStorageSync(`${STORAGE_PRE_TEST_PREFIX}${activityId}`);
    wx.removeStorageSync(`${STORAGE_PREPRACTICE_RATE}${activityId}`);
    wx.removeStorageSync(`${STORAGE_RETEST_RATE}${activityId}`);
    if (activityId === 'lesson1') {
      wx.removeStorageSync(STORAGE_LESSON1_STARS);
    }
    const raw = wx.getStorageSync(STORAGE_COMPLETED_LESSONS);
    if (raw && Array.isArray(raw)) {
      const set = raw.filter((id) => id !== activityId);
      wx.setStorageSync(STORAGE_COMPLETED_LESSONS, set);
    }
  } catch (e) {
    console.warn('clearSegmentProgress fail', e);
  }
}

module.exports = {
  parseActivityId,
  getActivityConfig,
  getPreTestQuestions,
  getKeywordCheckQuestions,
  getFillQuestions,
  getTranslationSentences,
  pickOneTranslation,
  saveResult,
  savePreTestResult,
  getPreTestResult,
  getSegmentResult,
  getOpenId,
  matchTranslation,
  matchTranslationWithHint,
  markLessonCompleted,
  getCompletedLessonIds,
  getFirstIncompleteSegment,
  getNextSegmentType,
  getSegmentPagePath,
  getSegmentOrder,
  getRealExamPrepracticeQuestions,
  getRealExamPrepracticeHint,
  getSignalWordGroups,
  getPluralFormGroups,
  getTrueFalseGroups,
  getEsChoiceGroups,
  getFillMockGroups,
  getRealRetestQuestions,
  getRealRetestHint,
  getSentenceErrorData,
  getApplyUseData,
  getSummaryCardData,
  saveRealRetestResult,
  getRealRetestResult,
  getLesson1Stars,
  saveRealExamPrepracticeResult,
  getRealExamPrepracticeResult,
  clearSegmentProgress,
  SEGMENT_ORDER,
  SEGMENT_TYPES
};
