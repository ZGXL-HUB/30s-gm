/**
 * 十四节课直播 · 活动与环节配置
 * 每节课一个活动，包含多个环节（课前检测、关键词识别、填空、翻译等）
 */
const SEGMENT_TYPES = {
  REAL_EXAM_PREPRACTICE: 'real_exam_prepractice',   // 第一环节：真题预练（仅第一课）
  SIGNAL_WORD_RECOGNITION: 'signal_word_recognition', // 第二环节：标志词识别（仅第一课）
  PLURAL_FORM_RECOGNITION: 'plural_form_recognition', // 第三环节：复数形式识别（仅第一课）
  TRUE_FALSE_JUDGE: 'true_false_judge',             // 第四环节：正误判断（仅第一课）
  ES_PLURAL_CHOICE: 'es_plural_choice',              // 第五环节：书写名词复数·单选题（仅第一课）
  FILL_MOCK: 'fill_mock',                            // 第六环节：真题变式填空（仅第一课）
  REAL_RETEST: 'real_retest',                        // 第七环节：真题再练（仅第一课，与第一环节对比+星级）
  SENTENCE_ERROR_CLICK: 'sentence_error_click',      // 第八环节：帮同学找错（仅第一课）
  APPLY_USE: 'apply_use',                            // 第九环节：学以致用（仅第一课）
  SUMMARY_CARD: 'summary_card',                      // 第十环节：一句话卡片（仅第一课）
  PRE_CLASS_TEST: 'pre_class_test',   // 课前真题检测
  KEYWORD_CHECK: 'keyword_check',     // 关键词识别
  FILL_RULE: 'fill_rule',             // 填空运用规则
  FILL_REAL: 'fill_real_exam',        // 填空到真题
  TRANSLATION: 'translation'          // 翻译题
};

// 默认每课翻译例句（中文→英文），教师可后续按课配置
const DEFAULT_TRANSLATION_SENTENCES = [
  { zh: '我每天七点起床。', en: 'I get up at seven every day.' },
  { zh: '他上周去了北京。', en: 'He went to Beijing last week.' },
  { zh: '我们正在做作业。', en: 'We are doing our homework.' },
  { zh: '这本书已经被读完了。', en: 'This book has been read.' },
  { zh: '如果明天下雨，我就待在家里。', en: 'If it rains tomorrow, I will stay at home.' }
];

// 第一课环节顺序（含第一至第四环节 + 后续环节，共10步预留）
const LESSON1_SEGMENTS = [
  { type: SEGMENT_TYPES.REAL_EXAM_PREPRACTICE, name: '第一环节·真题预练', order: 1 },
  { type: SEGMENT_TYPES.SIGNAL_WORD_RECOGNITION, name: '第二环节·标志词识别', order: 2 },
  { type: SEGMENT_TYPES.PLURAL_FORM_RECOGNITION, name: '第三环节·复数形式识别', order: 3 },
  { type: SEGMENT_TYPES.TRUE_FALSE_JUDGE, name: '第四环节·正误判断', order: 4 },
  { type: SEGMENT_TYPES.ES_PLURAL_CHOICE, name: '第五环节·书写名词复数', order: 5 },
  { type: SEGMENT_TYPES.FILL_MOCK, name: '第六环节·模拟演练', order: 6 },
  { type: SEGMENT_TYPES.REAL_RETEST, name: '第七环节·真题再练', order: 7 },
  { type: SEGMENT_TYPES.SENTENCE_ERROR_CLICK, name: '第八环节·帮同学找错', order: 8 },
  { type: SEGMENT_TYPES.APPLY_USE, name: '第九环节·学以致用', order: 9 },
  { type: SEGMENT_TYPES.SUMMARY_CARD, name: '第十环节·一句话卡片', order: 10 },
  { type: SEGMENT_TYPES.PRE_CLASS_TEST, name: '课前·真题检测', order: 11, limit: 10 },
  { type: SEGMENT_TYPES.KEYWORD_CHECK, name: '课中·关键词识别', order: 12, limit: 10 },
  { type: SEGMENT_TYPES.FILL_RULE, name: '课中·填空运用规则', order: 13, limit: 10 },
  { type: SEGMENT_TYPES.FILL_REAL, name: '课中·真题填空', order: 14, limit: 10 },
  { type: SEGMENT_TYPES.TRANSLATION, name: '课中·翻译题', order: 15, sentences: [] }
];

// 十四节课活动配置：每课可配置 grammarPoint（用于从云端拉选择题/填空题）、翻译例句等
function buildActivities() {
  const list = [];
  const defaultGrammar = '一般现在时'; // 默认语法点，可按课改为不同
  const defaultSegments = [
    { type: SEGMENT_TYPES.PRE_CLASS_TEST, name: '课前·真题检测', order: 1, limit: 10 },
    { type: SEGMENT_TYPES.KEYWORD_CHECK, name: '课中·关键词识别', order: 2, limit: 10 },
    { type: SEGMENT_TYPES.FILL_RULE, name: '课中·填空运用规则', order: 3, limit: 10 },
    { type: SEGMENT_TYPES.FILL_REAL, name: '课中·真题填空', order: 4, limit: 10 },
    { type: SEGMENT_TYPES.TRANSLATION, name: '课中·翻译题', order: 5, sentences: DEFAULT_TRANSLATION_SENTENCES }
  ];
  for (let i = 1; i <= 14; i++) {
    const segments = i === 1 ? LESSON1_SEGMENTS : defaultSegments;
    list.push({
      id: `lesson${i}`,
      name: '十四节语法直播课',
      lessonIndex: i,
      lessonName: `第${i}课`,
      grammarPoint: defaultGrammar,
      schoolLevel: 'middle',
      segments
    });
  }
  return list;
}

const ACTIVITIES = buildActivities();

function getActivityById(activityId) {
  return ACTIVITIES.find(a => a.id === activityId) || null;
}

function getSegmentConfig(activity, segmentType) {
  if (!activity || !activity.segments) return null;
  return activity.segments.find(s => s.type === segmentType) || null;
}

module.exports = {
  SEGMENT_TYPES,
  LESSON1_SEGMENTS,
  ACTIVITIES,
  getActivityById,
  getSegmentConfig,
  DEFAULT_TRANSLATION_SENTENCES
};
