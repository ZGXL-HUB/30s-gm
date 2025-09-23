
// 前端调用云函数示例
// 在需要获取题目的页面中使用

// 获取指定分类的题目
async function getQuestionsByCategory(category, limit = 10, offset = 0) {
  try {
    const result = await wx.cloud.callFunction({
      name: 'getQuestionsData',
      data: {
        action: 'getQuestionsByCategory',
        category: category,
        limit: limit,
        offset: offset
      }
    });
    
    if (result.result.success) {
      return result.result.data;
    } else {
      throw new Error(result.result.error);
    }
  } catch (error) {
    console.error('获取题目失败:', error);
    return [];
  }
}

// 获取所有分类
async function getCategories() {
  try {
    const result = await wx.cloud.callFunction({
      name: 'getQuestionsData',
      data: {
        action: 'getCategories'
      }
    });
    
    if (result.result.success) {
      return result.result.data;
    } else {
      throw new Error(result.result.error);
    }
  } catch (error) {
    console.error('获取分类失败:', error);
    return [];
  }
}

// 使用示例
Page({
  data: {
    questions: [],
    categories: [],
    currentCategory: 'all'
  },
  
  onLoad() {
    this.loadCategories();
    this.loadQuestions();
  },
  
  async loadCategories() {
    const categories = await getCategories();
    this.setData({ categories });
  },
  
  async loadQuestions(category = 'all') {
    const questions = await getQuestionsByCategory(category, 20, 0);
    this.setData({ 
      questions,
      currentCategory: category
    });
  },
  
  onCategoryChange(e) {
    const category = e.detail.value;
    this.loadQuestions(category);
  }
});
