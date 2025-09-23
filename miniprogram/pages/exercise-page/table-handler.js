// 统一表格处理器
const TableUtils = require('./table-utils.js');

class TableHandler {
  constructor(pageInstance) {
    this.page = pageInstance;
    this.inputHandlers = new Map();
    this.setupHandlers();
  }

  /**
   * 设置各种表格类型的处理器
   */
  setupHandlers() {
    // 代词表格处理器
    this.inputHandlers.set('pronoun', this.handlePronounInput.bind(this));
    
    // 介词表格处理器
    this.inputHandlers.set('preposition', this.handlePrepositionInput.bind(this));
    
    // 时态书写表格处理器
    this.inputHandlers.set('tense_writing', this.handleTenseWritingInput.bind(this));
    
    // 形容词表格处理器
    this.inputHandlers.set('adjective', this.handleAdjectiveInput.bind(this));
    
    // 副词表格处理器
    this.inputHandlers.set('adverb', this.handleAdverbInput.bind(this));
  }

  /**
   * 统一的表格输入处理入口
   * @param {Object} e 输入事件
   * @param {String} tableType 表格类型
   */
  handleInput(e, tableType) {
    const handler = this.inputHandlers.get(tableType);
    if (handler) {
      handler(e);
    } else {
      console.warn(`未找到表格类型 ${tableType} 的处理器`);
    }
  }

  /**
   * 代词表格输入处理
   */
  handlePronounInput(e) {
    const { table, row, col } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    // 自适应输入框高度
    TableUtils.adjustInputHeight(e, '.table-input', this.page);
    
    const key = `${table}_${row}_${col}`;
    
    // 更新用户输入
    const pronounUserInputs = { ...this.page.data.pronounUserInputs };
    const previousValue = pronounUserInputs[key] || '';
    pronounUserInputs[key] = value;
    
    // 获取正确答案
    const correctAnswer = this.getPronounCorrectAnswer(table, row, col);
    
    // 验证答案
    const validation = TableUtils.validateTableInput(value, correctAnswer);
    const pronounInputStatus = { ...this.page.data.pronounInputStatus };
    
    this.updateInputStatus(pronounInputStatus, key, validation);
    
    // 添加动画效果
    this.addInputAnimation(e.currentTarget, validation.status);
    
    // 保存到历史记录
    this.saveToHistory(table, key, value, previousValue);
    
    // 更新统计
    this.updateWritingStats(table, key, validation.isValid);
    
    // 更新进度
    this.updateTableProgress();
    
    this.page.setData({
      pronounUserInputs,
      pronounInputStatus
    });
  }

  /**
   * 介词表格输入处理
   */
  handlePrepositionInput(e) {
    const { table, row, col } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    TableUtils.adjustInputHeight(e, '.table-input', this.page);
    
    const key = `${table}_${row}_${col}`;
    
    const prepositionUserInputs = { ...this.page.data.prepositionUserInputs };
    const previousValue = prepositionUserInputs[key] || '';
    prepositionUserInputs[key] = value;
    
    const correctAnswer = this.getPrepositionCorrectAnswer(table, row, col);
    const validation = TableUtils.validateTableInput(value, correctAnswer);
    const prepositionInputStatus = { ...this.page.data.prepositionInputStatus };
    
    this.updateInputStatus(prepositionInputStatus, key, validation);
    this.addInputAnimation(e.currentTarget, validation.status);
    this.saveToHistory(table, key, value, previousValue);
    this.updateWritingStats(table, key, validation.isValid);
    this.updateTableProgress();
    
    this.page.setData({
      prepositionUserInputs,
      prepositionInputStatus
    });
  }

  /**
   * 时态书写表格输入处理
   */
  handleTenseWritingInput(e) {
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    TableUtils.adjustInputHeight(e, '.table-input', this.page);
    
    const tableAnswers = { ...this.page.data.tableAnswers };
    if (!tableAnswers[tableId]) tableAnswers[tableId] = {};
    tableAnswers[tableId][cellId] = value;
    
    const cell = this.page.data.tableData[tableId].find(c => c.cell_id === cellId);
    const correctAnswer = cell && cell.correctAnswer;
    const validation = TableUtils.validateTableInput(value, correctAnswer);
    
    const tenseWritingInputStatus = { ...this.page.data.tenseWritingInputStatus };
    const statusKey = `${row}_${col}`;
    
    this.updateInputStatus(tenseWritingInputStatus, statusKey, validation);
    this.addInputAnimation(e.currentTarget, validation.status);
    this.updateTableProgress();
    
    this.page.setData({
      tableAnswers,
      tenseWritingInputStatus
    });
  }

  /**
   * 形容词表格输入处理
   */
  handleAdjectiveInput(e) {
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    TableUtils.adjustInputHeight(e, '.table-input', this.page);
    
    const tableUserInputs = { ...this.page.data.tableUserInputs };
    const inputKey = `${tableId}_${row}_${col}`;
    const previousValue = tableUserInputs[inputKey] || '';
    tableUserInputs[inputKey] = value;
    
    const correctAnswer = this.getAdjectiveCorrectAnswer(tableId, row, col);
    const validation = TableUtils.validateTableInput(value, correctAnswer);
    const tableInputStatus = { ...this.page.data.tableInputStatus };
    
    this.updateInputStatus(tableInputStatus, inputKey, validation);
    this.addInputAnimation(e.currentTarget, validation.status);
    this.saveToHistory(tableId, inputKey, value, previousValue);
    this.updateTableProgress();
    
    this.page.setData({
      tableUserInputs,
      tableInputStatus
    });
  }

  /**
   * 副词表格输入处理
   */
  handleAdverbInput(e) {
    const { tableId, cellId, row, col } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    TableUtils.adjustInputHeight(e, '.table-input', this.page);
    
    const tableUserInputs = { ...this.page.data.tableUserInputs };
    const inputKey = `${tableId}_${row}_${col}`;
    const previousValue = tableUserInputs[inputKey] || '';
    tableUserInputs[inputKey] = value;
    
    const correctAnswer = this.getAdverbCorrectAnswer(tableId, row, col);
    const validation = TableUtils.validateTableInput(value, correctAnswer);
    const tableInputStatus = { ...this.page.data.tableInputStatus };
    
    this.updateInputStatus(tableInputStatus, inputKey, validation);
    this.addInputAnimation(e.currentTarget, validation.status);
    this.saveToHistory(tableId, inputKey, value, previousValue);
    this.updateTableProgress();
    
    this.page.setData({
      tableUserInputs,
      tableInputStatus
    });
  }

  /**
   * 更新输入状态
   */
  updateInputStatus(statusObj, key, validation) {
    if (validation.status === 'empty') {
      delete statusObj[key];
    } else {
      statusObj[key] = validation.status;
    }
  }

  /**
   * 添加输入动画
   */
  addInputAnimation(element, status) {
    if (status === 'correct') {
      TableUtils.TableAnimations.correctAnimation(element);
    } else if (status === 'wrong') {
      TableUtils.TableAnimations.wrongAnimation(element);
    }
  }

  /**
   * 保存到历史记录
   */
  saveToHistory(tableId, cellId, value, previousValue) {
    if (this.page.data.tableStateManager) {
      this.page.data.tableStateManager.saveState(tableId, cellId, value, previousValue);
    }
  }

  /**
   * 更新书写统计
   */
  updateWritingStats(tableId, cellId, isValid) {
    if (this.page.updateWritingStatsFromTable) {
      this.page.updateWritingStatsFromTable(tableId, cellId, isValid);
    }
  }

  /**
   * 更新表格进度
   */
  updateTableProgress() {
    if (this.page.updateTableProgress) {
      this.page.updateTableProgress();
    }
  }

  /**
   * 获取代词表格正确答案
   */
  getPronounCorrectAnswer(table, row, col) {
    if (table.startsWith('pronoun_table_')) {
      const tableData = this.page.data.tableData[table];
      if (tableData && tableData.tableData && tableData.tableData.rows) {
        return tableData.tableData.rows[row][col];
      }
    } else {
      const cellIndex = row * 6 + col;
      const cellData = this.page.data.tableData[table][cellIndex];
      return cellData ? cellData.answer : '';
    }
    return '';
  }

  /**
   * 获取介词表格正确答案
   */
  getPrepositionCorrectAnswer(table, row, col) {
    const tableData = this.page.data.tablesData[table];
    if (tableData && tableData.tableData && tableData.tableData.rows) {
      const hintText = tableData.tableData.rows[row][0];
      return this.page.getPrepositionAnswers ? this.page.getPrepositionAnswers(hintText, row) : '';
    }
    return '';
  }

  /**
   * 获取形容词表格正确答案
   */
  getAdjectiveCorrectAnswer(tableId, row, col) {
    // 根据具体的形容词表格数据结构实现
    return '';
  }

  /**
   * 获取副词表格正确答案
   */
  getAdverbCorrectAnswer(tableId, row, col) {
    // 根据具体的副词表格数据结构实现
    return '';
  }

  /**
   * 获取表格类型
   */
  getTableType(tableId) {
    if (tableId.startsWith('pronoun_table_')) return 'pronoun';
    if (tableId.startsWith('preposition_table_')) return 'preposition';
    if (tableId.startsWith('tense_writing_')) return 'tense_writing';
    if (tableId.startsWith('adjective_')) return 'adjective';
    if (tableId.startsWith('adverb_')) return 'adverb';
    return 'unknown';
  }
}

module.exports = TableHandler;
