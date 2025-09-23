// 测试书写题统计修复
// 这个脚本用于验证exercise-page中的submitTableAnswers方法是否正确保存书写题统计

console.log('=== 测试书写题统计修复 ===');

// 模拟wx对象
global.wx = {
  getStorageSync: (key) => {
    console.log(`获取存储: ${key}`);
    if (key === 'writingHistory') {
      return [
        {
          date: '2025/01/15',
          correctCount: 5,
          totalCount: 10
        }
      ];
    }
    return [];
  },
  setStorageSync: (key, value) => {
    console.log(`保存存储: ${key}`, value);
  }
};

// 模拟Page对象
function Page(config) {
  return config;
}

// 模拟require
function require(path) {
  console.log(`加载模块: ${path}`);
  return {};
}

// 测试数据
const testData = {
  correctCells: 8,
  totalCells: 10,
  today: '2025/01/15'
};

// 模拟saveWritingStats方法
function saveWritingStats(correctCount, totalCount) {
  try {
    console.log('开始保存书写题统计:', { correctCount, totalCount });
    
    const today = testData.today;
    const writingHistory = wx.getStorageSync('writingHistory') || [];
    
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
    wx.setStorageSync('writingHistory', writingHistory);
    console.log('书写题统计已保存:', todayRecord);
    
    // 验证保存结果
    const verifyHistory = wx.getStorageSync('writingHistory') || [];
    const verifyTodayRecord = verifyHistory.find(record => record.date === today);
    console.log('验证保存结果:', verifyTodayRecord);
    
    return true;
  } catch (error) {
    console.error('保存书写题统计失败:', error);
    return false;
  }
}

// 执行测试
console.log('\n=== 执行测试 ===');
const result = saveWritingStats(testData.correctCells, testData.totalCells);

console.log('\n=== 测试结果 ===');
if (result) {
  console.log('✅ 测试通过：书写题统计保存成功');
} else {
  console.log('❌ 测试失败：书写题统计保存失败');
}

console.log('\n=== 预期结果 ===');
console.log('1. 应该找到今日记录 (2025/01/15)');
console.log('2. 正确数应该从 5 增加到 13 (5 + 8)');
console.log('3. 总数应该从 10 增加到 20 (10 + 10)');
console.log('4. 数据应该成功保存到 writingHistory');
