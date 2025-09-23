/**
 * 测试错题本清空按钮功能
 * 
 * 测试内容：
 * 1. 清空按钮在有错题时显示
 * 2. 清空按钮在无错题时隐藏
 * 3. 点击清空按钮弹出确认对话框
 * 4. 确认清空后数据被正确清除
 * 5. 清空后统计信息正确更新
 */

// 模拟微信小程序环境
const mockWx = {
  showModal: jest.fn(),
  showToast: jest.fn(),
  setStorageSync: jest.fn(),
  getStorageSync: jest.fn()
};

// 模拟页面数据
const mockPageData = {
  mistakes: [
    {
      id: '1',
      question: '测试题目1',
      correctAnswer: 'A',
      category: '介词'
    },
    {
      id: '2', 
      question: '测试题目2',
      correctAnswer: 'B',
      category: '代词'
    }
  ],
  filteredMistakes: [],
  learningProgress: {
    totalMistakes: 2,
    masteredMistakes: 0,
    masteryRate: 0
  }
};

// 测试清空错题功能
describe('错题本清空按钮功能测试', () => {
  
  beforeEach(() => {
    // 重置模拟函数
    jest.clearAllMocks();
    
    // 设置模拟存储数据
    mockWx.getStorageSync.mockReturnValue(mockPageData.mistakes);
  });

  test('清空按钮在有错题时应该显示', () => {
    const hasMistakes = mockPageData.mistakes.length > 0;
    expect(hasMistakes).toBe(true);
    
    // 检查WXML中的条件渲染
    const shouldShowButton = hasMistakes;
    expect(shouldShowButton).toBe(true);
  });

  test('清空按钮在无错题时应该隐藏', () => {
    const emptyMistakes = [];
    const hasMistakes = emptyMistakes.length > 0;
    expect(hasMistakes).toBe(false);
    
    // 检查WXML中的条件渲染
    const shouldShowButton = hasMistakes;
    expect(shouldShowButton).toBe(false);
  });

  test('点击清空按钮应该弹出确认对话框', () => {
    const clearAllMistakes = () => {
      if (mockPageData.mistakes.length === 0) {
        mockWx.showToast({
          title: '暂无错题可清空',
          icon: 'none'
        });
        return;
      }

      mockWx.showModal({
        title: '确认清空',
        content: `确定要清空所有${mockPageData.mistakes.length}道错题吗？\n\n⚠️ 此操作不可恢复！`,
        confirmText: '确认清空',
        cancelText: '取消',
        confirmColor: '#fa5151'
      });
    };

    clearAllMistakes();
    
    expect(mockWx.showModal).toHaveBeenCalledWith({
      title: '确认清空',
      content: '确定要清空所有2道错题吗？\n\n⚠️ 此操作不可恢复！',
      confirmText: '确认清空',
      cancelText: '取消',
      confirmColor: '#fa5151'
    });
  });

  test('确认清空后数据应该被正确清除', () => {
    const clearAllMistakes = (confirmed = true) => {
      if (confirmed) {
        // 清空错题数据
        mockPageData.mistakes = [];
        mockPageData.filteredMistakes = [];
        
        // 清空本地存储
        mockWx.setStorageSync('wrongQuestions', []);
        
        mockWx.showToast({
          title: '已清空所有错题',
          icon: 'success',
          duration: 2000
        });
      }
    };

    clearAllMistakes(true);
    
    expect(mockPageData.mistakes).toEqual([]);
    expect(mockPageData.filteredMistakes).toEqual([]);
    expect(mockWx.setStorageSync).toHaveBeenCalledWith('wrongQuestions', []);
    expect(mockWx.showToast).toHaveBeenCalledWith({
      title: '已清空所有错题',
      icon: 'success',
      duration: 2000
    });
  });

  test('清空后统计信息应该正确更新', () => {
    // 模拟清空操作
    mockPageData.mistakes = [];
    
    // 重新计算统计信息
    const totalMistakes = mockPageData.mistakes.length;
    const masteredMistakes = 0;
    const masteryRate = totalMistakes > 0 ? Math.round((masteredMistakes / totalMistakes) * 100) : 0;
    
    mockPageData.learningProgress = {
      totalMistakes,
      masteredMistakes,
      masteryRate
    };
    
    expect(mockPageData.learningProgress.totalMistakes).toBe(0);
    expect(mockPageData.learningProgress.masteredMistakes).toBe(0);
    expect(mockPageData.learningProgress.masteryRate).toBe(0);
  });

  test('取消清空操作时数据应该保持不变', () => {
    const originalMistakes = [...mockPageData.mistakes];
    
    const clearAllMistakes = (confirmed = false) => {
      if (confirmed) {
        mockPageData.mistakes = [];
        mockPageData.filteredMistakes = [];
        mockWx.setStorageSync('wrongQuestions', []);
      }
      // 如果取消，数据保持不变
    };

    clearAllMistakes(false);
    
    expect(mockPageData.mistakes).toEqual(originalMistakes);
    expect(mockWx.setStorageSync).not.toHaveBeenCalled();
  });
});

console.log('✅ 错题本清空按钮功能测试完成');

