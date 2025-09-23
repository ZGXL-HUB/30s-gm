// 测试书写题统计修复效果
console.log('=== 测试书写题统计修复效果 ===');

// 模拟微信小程序的存储API
const mockStorage = {
  writingHistory: []
};

// 模拟wx.getStorageSync和wx.setStorageSync
function wx_getStorageSync(key) {
  if (key === 'writingHistory') {
    return mockStorage.writingHistory;
  }
  return [];
}

function wx_setStorageSync(key, value) {
  if (key === 'writingHistory') {
    mockStorage.writingHistory = value;
  }
}

// 模拟getTodayDateString方法
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

// 模拟saveWritingStats方法（修复后的版本）
function saveWritingStats(correctCount, totalCount) {
  try {
    console.log('开始保存书写题统计:', { correctCount, totalCount });
    
    const today = getTodayDateString();
    const writingHistory = wx_getStorageSync('writingHistory') || [];
    
    console.log('当前日期:', today);
    console.log('现有书写历史记录:', writingHistory);
    
    // 查找今日记录
    let todayRecord = writingHistory.find(record => record.date === today);
    if (!todayRecord) {
      console.log('未找到今日记录，创建新记录');
      todayRecord = {
        date: today,
        correctCount: 0,
        totalCount: 0
      };
      writingHistory.push(todayRecord);
    } else {
      console.log('找到今日记录:', todayRecord);
    }
    
    // 更新统计
    const oldCorrectCount = todayRecord.correctCount;
    const oldTotalCount = todayRecord.totalCount;
    
    todayRecord.totalCount += totalCount;
    todayRecord.correctCount += correctCount;
    
    console.log('书写统计更新详情:', {
      旧正确数: oldCorrectCount,
      旧总数: oldTotalCount,
      新增正确数: correctCount,
      新增总数: totalCount,
      新正确数: todayRecord.correctCount,
      新总数: todayRecord.totalCount
    });
    
    // 保存更新
    wx_setStorageSync('writingHistory', writingHistory);
    console.log('书写题统计已保存:', todayRecord);
    
    // 验证保存结果
    const verifyHistory = wx_getStorageSync('writingHistory') || [];
    const verifyTodayRecord = verifyHistory.find(record => record.date === today);
    console.log('验证保存结果:', verifyTodayRecord);
    
    return true;
  } catch (error) {
    console.error('保存书写题统计失败:', error);
    return false;
  }
}

// 模拟统计计算逻辑
function calculateWritingStats() {
  const today = getTodayDateString();
  const writingHistory = wx_getStorageSync('writingHistory') || [];
  
  console.log('当前日期:', today);
  console.log('书写历史记录:', writingHistory);
  
  // 筛选今日记录
  const todayWriting = writingHistory.filter(record => {
    console.log('书写记录日期:', record.date, '匹配结果:', record.date === today);
    return record.date === today;
  });
  
  console.log('今日书写记录:', todayWriting);
  console.log('今日书写记录详情:', todayWriting.map(record => ({
    date: record.date,
    correctCount: record.correctCount,
    totalCount: record.totalCount,
    hasCorrectCount: 'correctCount' in record,
    correctCountType: typeof record.correctCount
  })));
  
  // 计算书写题统计
  const writingCount = todayWriting.reduce((sum, record) => {
    console.log('书写题统计:', record.correctCount, '当前累计:', sum);
    return sum + (record.correctCount || 0);
  }, 0);
  
  console.log('最终书写题统计结果:', writingCount);
  
  return writingCount;
}

// 执行测试
console.log('\n=== 执行测试 ===');

// 测试1: 第一次保存统计
console.log('\n--- 测试1: 第一次保存统计 ---');
const result1 = saveWritingStats(1, 1);
console.log('保存结果:', result1);
const stats1 = calculateWritingStats();
console.log('统计结果:', stats1);

// 测试2: 第二次保存统计
console.log('\n--- 测试2: 第二次保存统计 ---');
const result2 = saveWritingStats(2, 3);
console.log('保存结果:', result2);
const stats2 = calculateWritingStats();
console.log('统计结果:', stats2);

// 测试3: 验证最终结果
console.log('\n--- 测试3: 验证最终结果 ---');
const finalStats = calculateWritingStats();
console.log('最终统计结果:', finalStats);
console.log('期望结果: 3 (1+2)');
console.log('测试通过:', finalStats === 3);

console.log('\n=== 测试完成 ===');
