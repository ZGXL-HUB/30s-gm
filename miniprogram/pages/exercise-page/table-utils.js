// 表格优化工具函数

/**
 * 自适应输入框高度
 * @param {Object} e 输入事件对象
 * @param {String} inputClass 输入框类名
 * @param {Object} pageInstance 页面实例，用于调用setData
 */
function adjustInputHeight(e, inputClass = '.table-input', pageInstance = null) {
  // 在微信小程序中，无法直接操作DOM元素
  // 这里提供一个占位函数，避免报错
  // 实际的高度调整应该通过CSS或页面数据来控制
  
  console.log('adjustInputHeight called - 在微信小程序中需要通过CSS或数据绑定来控制输入框高度');
  
  // 如果需要实现自适应高度，可以考虑以下方案：
  // 1. 使用CSS的min-height和max-height
  // 2. 通过setData更新页面数据来控制样式
  // 3. 使用textarea组件替代input组件
  
  if (pageInstance && typeof pageInstance.setData === 'function') {
    // 示例：通过数据绑定控制输入框高度
    const { table, row, col } = e.currentTarget.dataset;
    const inputKey = `${table}_${row}_${col}`;
    
    // 这里可以根据输入内容长度动态调整高度
    const value = e.detail.value || '';
    const lineCount = value.split('\n').length;
    const estimatedHeight = Math.max(80, Math.min(lineCount * 40, 200));
    
    // 更新输入框高度数据
    const inputHeights = { ...pageInstance.data.inputHeights };
    inputHeights[inputKey] = estimatedHeight;
    
    pageInstance.setData({
      inputHeights: inputHeights
    });
  }
}

/**
 * 输入防抖处理
 * @param {Function} func 要执行的函数
 * @param {Number} delay 延迟时间(ms)
 */
function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * 表格输入验证
 * @param {String} value 输入值
 * @param {String} correctAnswer 正确答案
 * @returns {Object} 验证结果
 */
function validateTableInput(value, correctAnswer) {
  const trimmedValue = value.trim();
  
  if (!trimmedValue) {
    return { isValid: false, status: 'empty' };
  }
  
  // 支持多种答案格式
  const normalizedValue = trimmedValue.toLowerCase();
  const normalizedAnswer = correctAnswer.toLowerCase();
  
  // 精确匹配
  if (normalizedValue === normalizedAnswer) {
    return { isValid: true, status: 'correct' };
  }
  
  // 包含匹配（用于部分正确的答案）
  if (normalizedAnswer.includes(normalizedValue) || normalizedValue.includes(normalizedAnswer)) {
    return { isValid: true, status: 'partial' };
  }
  
  return { isValid: false, status: 'wrong' };
}

/**
 * 表格进度计算
 * @param {Object} tableData 表格数据
 * @param {Object} userInputs 用户输入
 * @returns {Object} 进度信息
 */
function calculateTableProgress(tableData, userInputs) {
  let totalCells = 0;
  let completedCells = 0;
  let correctCells = 0;
  
  // 遍历表格数据计算进度
  Object.keys(tableData).forEach(tableId => {
    const table = tableData[tableId];
    if (table && table.tableData && table.tableData.rows) {
      table.tableData.rows.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (colIndex > 0) { // 跳过第一列（通常是标签列）
            totalCells++;
            const inputKey = `${tableId}_${rowIndex}_${colIndex}`;
            const userInput = userInputs[inputKey];
            
            if (userInput && userInput.trim()) {
              completedCells++;
              // 这里可以添加正确性检查逻辑
              // if (isCorrect(userInput, cell)) correctCells++;
            }
          }
        });
      });
    }
  });
  
  const completionRate = totalCells > 0 ? (completedCells / totalCells) * 100 : 0;
  const accuracyRate = completedCells > 0 ? (correctCells / completedCells) * 100 : 0;
  
  return {
    totalCells,
    completedCells,
    correctCells,
    completionRate: Math.round(completionRate),
    accuracyRate: Math.round(accuracyRate)
  };
}

/**
 * 表格状态管理类
 */
class TableStateManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistorySize = 50;
  }
  
  /**
   * 保存状态到历史记录
   * @param {String} tableId 表格ID
   * @param {String} cellId 单元格ID
   * @param {String} value 输入值
   * @param {String} previousValue 之前的值
   */
  saveState(tableId, cellId, value, previousValue) {
    const state = {
      tableId,
      cellId,
      value,
      previousValue,
      timestamp: Date.now()
    };
    
    this.undoStack.push(state);
    
    // 限制历史记录大小
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }
    
    // 清空重做栈
    this.redoStack = [];
  }
  
  /**
   * 撤销操作
   * @returns {Object|null} 撤销的状态
   */
  undo() {
    if (this.undoStack.length === 0) return null;
    
    const state = this.undoStack.pop();
    this.redoStack.push(state);
    return state;
  }
  
  /**
   * 重做操作
   * @returns {Object|null} 重做的状态
   */
  redo() {
    if (this.redoStack.length === 0) return null;
    
    const state = this.redoStack.pop();
    this.undoStack.push(state);
    return state;
  }
  
  /**
   * 检查是否可以撤销
   * @returns {Boolean}
   */
  canUndo() {
    return this.undoStack.length > 0;
  }
  
  /**
   * 检查是否可以重做
   * @returns {Boolean}
   */
  canRedo() {
    return this.redoStack.length > 0;
  }
}

/**
 * 表格动画效果
 */
const TableAnimations = {
  /**
   * 单元格正确动画
   * @param {Element} element 元素
   */
  correctAnimation(element) {
    element.style.transform = 'scale(1.05)';
    element.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 200);
  },
  
  /**
   * 单元格错误动画
   * @param {Element} element 元素
   */
  wrongAnimation(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  },
  
  /**
   * 进度条动画
   * @param {Element} progressBar 进度条元素
   * @param {Number} percentage 百分比
   */
  progressAnimation(progressBar, percentage) {
    progressBar.style.width = '0%';
    progressBar.style.transition = 'width 0.5s ease';
    
    setTimeout(() => {
      progressBar.style.width = percentage + '%';
    }, 100);
  }
};

module.exports = {
  adjustInputHeight,
  debounce,
  validateTableInput,
  calculateTableProgress,
  TableStateManager,
  TableAnimations
};
