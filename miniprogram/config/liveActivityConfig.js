/**
 * 十四节课直播 · 活动与环节配置
 * 每节课一个活动，包含多个环节（课前检测、关键词识别、填空、翻译等）
 */
const SEGMENT_TYPES = {
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

// 十四节课活动配置：每课可配置 grammarPoint（用于从云端拉选择题/填空题）、翻译例句等
function buildActivities() {
  const list = [];
  const defaultGrammar = '一般现在时'; // 默认语法点，可按课改为不同
  for (let i = 1; i <= 14; i++) {
    list.push({
      id: `lesson${i}`,
      name: '十四节语法直播课',
      lessonIndex: i,
      lessonName: `第${i}课`,
      grammarPoint: defaultGrammar,
      schoolLevel: 'middle',
      segments: [
        { type: SEGMENT_TYPES.PRE_CLASS_TEST, name: '课前·真题检测', order: 1, limit: 10 },
        { type: SEGMENT_TYPES.KEYWORD_CHECK, name: '课中·关键词识别', order: 2, limit: 10 },
        { type: SEGMENT_TYPES.FILL_RULE, name: '课中·填空运用规则', order: 3, limit: 10 },
        { type: SEGMENT_TYPES.FILL_REAL, name: '课中·真题填空', order: 4, limit: 10 },
        { type: SEGMENT_TYPES.TRANSLATION, name: '课中·翻译题', order: 5, sentences: DEFAULT_TRANSLATION_SENTENCES }
      ]
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
  ACTIVITIES,
  getActivityById,
  getSegmentConfig,
  DEFAULT_TRANSLATION_SENTENCES
};
