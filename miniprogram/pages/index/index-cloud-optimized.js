// 优化后的首页代码 - 使用云端数据加载
// 这是 index.js 的云端优化版本

const cloudDataLoader = require('../../utils/cloudDataLoader.js');

Page({
  data: {
    // ... 其他数据保持不变
  },

  onLoad: function (options) {
    // 预加载常用数据
    this.preloadData();
    // ... 其他初始化代码
  },

  // 预加载数据
  async preloadData() {
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      
      // 预加载常用数据
      await cloudDataLoader.preloadCommonData();
      
      wx.hideLoading();
    } catch (error) {
      console.error('数据预加载失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '数据加载失败',
        icon: 'none'
      });
    }
  },

  // 加载语法练习题目 - 使用云端数据
  async loadGrammarQuestions(category, subCategory) {
    try {
      const questionsData = await cloudDataLoader.loadIntermediateQuestions();
      
      if (questionsData && questionsData[category]) {
        const categoryData = questionsData[category];
        let questions = [];
        
        if (subCategory && categoryData[subCategory]) {
          questions = categoryData[subCategory];
        } else {
          // 合并所有子类别的题目
          Object.keys(categoryData).forEach(key => {
            if (Array.isArray(categoryData[key])) {
              questions = questions.concat(categoryData[key]);
            }
          });
        }
        
        return questions;
      }
      
      return [];
    } catch (error) {
      console.error('加载语法题目失败:', error);
      return [];
    }
  },

  // 加载书写练习题目 - 使用云端数据
  async loadWritingQuestions(category) {
    try {
      const writingData = await cloudDataLoader.loadWritingRules(`writing_${category}.js`);
      return writingData || [];
    } catch (error) {
      console.error('加载书写题目失败:', error);
      return [];
    }
  },

  // 加载书写练习题库 - 使用云端数据
  async loadWritingExerciseQuestions() {
    try {
      const questions = await cloudDataLoader.loadWritingExerciseQuestions();
      return questions || {};
    } catch (error) {
      console.error('加载书写练习题库失败:', error);
      return {};
    }
  },

  // 其他方法保持不变...
  // 只需要将原来的 require() 调用替换为对应的云端加载方法
});
