// 数据定义模板 - 确保正确的变量声明

// ⚠️ 重要提示：
// 1. 每次导入使用不同的变量名
// 2. 使用 var 而不是 const
// 3. 确保所有字符串都用双引号
// 4. 不要在对象属性名两侧加引号（除非必要）

// 示例数据模板 - 复制并修改
var batch_20241201_001 = [
  {
    "text": "English ____ by millions of students in middle schools. A. learn B. learned C. is learned D. was learned",
    "answer": "C",
    "grammarPoint": "一般时态的被动语态",
    "category": "被动语态",
    "type": "choice",
    "analysis": "本题考查一般现在时的被动语态。主语English与动词learn是被动关系，时间状语'these days'表示当前的情况，需用一般现在时的被动语态，结构为'am/is/are+过去分词'，learn的过去分词是learned，故正确答案为C。",
    "difficulty": "medium",
    "province": "云南",
    "year": 2024,
    "source": "变式题"
  },
  {
    "text": "Yoga ____ by more and more people for keeping healthy these days. A. practice B. practiced C. is practiced D. was practiced",
    "answer": "C",
    "grammarPoint": "一般时态的被动语态",
    "category": "被动语态",
    "type": "choice",
    "analysis": "本题考查一般现在时被动语态的用法。主语Yoga与动词practice是被动关系，'these days'提示时态为一般现在时，被动语态结构为'am/is/are+过去分词'，practice的过去分词是practiced，因此选C。",
    "difficulty": "medium",
    "province": "云南",
    "year": 2024,
    "source": "变式题"
  }
];

// 验证数据格式的函数
function validateBatchData(data, batchName) {
  console.log(`🔍 验证批次数据: ${batchName}`);

  if (!Array.isArray(data)) {
    console.error(`❌ ${batchName} 不是数组格式`);
    return false;
  }

  if (data.length === 0) {
    console.error(`❌ ${batchName} 为空数组`);
    return false;
  }

  const requiredFields = [
    'text', 'answer', 'grammarPoint', 'category',
    'type', 'analysis', 'difficulty', 'province', 'year', 'source'
  ];

  let validCount = 0;
  let invalidCount = 0;

  data.forEach((item, index) => {
    let isValid = true;
    const missingFields = [];

    requiredFields.forEach(field => {
      if (!item.hasOwnProperty(field)) {
        missingFields.push(field);
        isValid = false;
      }
    });

    if (missingFields.length > 0) {
      console.warn(`⚠️ 题目 ${index + 1} 缺少字段: ${missingFields.join(', ')}`);
      invalidCount++;
    } else {
      validCount++;
    }

    // 额外验证
    if (!['A', 'B', 'C', 'D'].includes(item.answer)) {
      console.warn(`⚠️ 题目 ${index + 1} 答案格式错误: ${item.answer}`);
      isValid = false;
    }

    if (!['choice', 'fill_blank'].includes(item.type)) {
      console.warn(`⚠️ 题目 ${index + 1} 类型错误: ${item.type}`);
      isValid = false;
    }
  });

  const result = {
    batchName: batchName,
    total: data.length,
    valid: validCount,
    invalid: invalidCount,
    isReady: invalidCount === 0
  };

  console.log(`📊 验证结果:`, result);

  if (result.isReady) {
    console.log(`✅ ${batchName} 数据验证通过，可以导入`);
  } else {
    console.error(`❌ ${batchName} 数据验证失败，请修复后再导入`);
  }

  return result;
}

// 挂载验证函数
if (typeof wx !== 'undefined') {
  wx.validateBatchData = validateBatchData;
  console.log('✅ 数据验证函数已加载');
  console.log('使用方法: wx.validateBatchData(batch_20241201_001, "batch_20241201_001")');
} else {
  console.log('❌ 不在小程序环境中');
}

// 自动验证当前批次
console.log('🔄 自动验证示例数据...');
validateBatchData(batch_20241201_001, "batch_20241201_001");

console.log('');
console.log('📝 使用指南:');
console.log('1. 修改上面的 batch_20241201_001 变量名（每次使用不同名称）');
console.log('2. 替换数组内容为您的题目数据');
console.log('3. 运行: wx.validateBatchData(您的变量名, "批次名称")');
console.log('4. 确认验证通过后再进行导入');




