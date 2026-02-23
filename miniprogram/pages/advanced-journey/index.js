// 进阶之旅页面 - 小程序版本（7天学习路径）
// 对应Vue页面 /pages/grammar-hall/advanced-journey.vue

const recommendationApi = require('../../api/recommendationApi');

Page({
  data: {
    userId: 'user_12345',
    sevenDayPlan: [],
    loading: false,
    targetAccuracy: 0,
    weakPoints: []
  },

  // 阻止事件冒泡
  stopPropagation(e) {
    // 空函数，仅用于阻止事件冒泡
  },

  onLoad(options) {
    console.log('进阶之旅页面加载');
    
    if (options.userId) {
      this.setData({ userId: options.userId });
    }
    
    this.getSevenDayPlan();
  },

  onShow() {
    console.log('进阶之旅页面显示');
  },

  // 获取7天学习路径
  async getSevenDayPlan() {
    try {
      this.setData({ loading: true });
      
      console.log('获取7天学习路径');
      
      // 调用API获取7天学习路径
      const result = await recommendationApi.getSevenDayPlan(this.data.userId);
      
      if (result.code === 200) {
        const planData = result.data;
        this.setData({ 
          sevenDayPlan: planData.plan,
          targetAccuracy: planData.targetAccuracy,
          weakPoints: planData.weakPoints,
          loading: false 
        });
        
        console.log(`7天学习路径获取完成：${planData.plan.length}天计划`);
        
      } else {
        console.error('获取7天学习路径失败:', result.message);
        this.setData({ loading: false });
        wx.showToast({
          title: result.message || '获取学习路径失败',
          icon: 'none'
        });
      }
      
    } catch (error) {
      console.error('获取7天学习路径失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    }
  },

  // 开始专项练习
  async startSpecialPractice(e) {
    const dayIndex = e.currentTarget.dataset.day;
    const dayPlan = this.data.sevenDayPlan[dayIndex];
    
    try {
      console.log(`开始第${dayIndex + 1}天专项练习：${dayPlan.content}`);
      
      wx.showLoading({
        title: '生成专项题目...'
      });
      
      // 从薄弱点中随机选择一个进行专项练习
      const weakPoints = this.data.weakPoints;
      if (weakPoints.length === 0) {
        wx.hideLoading();
        wx.showToast({
          title: '暂无薄弱点数据',
          icon: 'none'
        });
        return;
      }
      
      // 随机选择一个薄弱点
      const randomIndex = Math.floor(Math.random() * weakPoints.length);
      const selectedPoint = weakPoints[randomIndex];
      
      // 调用突破冷却的专项练习接口
      const result = await recommendationApi.getPracticeByWeakPoint(
        this.data.userId,
        selectedPoint.name,
        12,  // 学习路径固定12题
        true  // 白名单模式
      );
      
      wx.hideLoading();
      
      if (result.code === 200) {
        const questions = result.data.questions;
        console.log(`获取到${questions.length}道${selectedPoint.name}专项题目`);
        
        // 跳转至专项练习页面
        wx.navigateTo({
          url: `/pages/exercise-page/index?questions=${encodeURIComponent(JSON.stringify(questions))}&type=special&day=${dayIndex + 1}&pointName=${encodeURIComponent(selectedPoint.name)}`,
          success: () => {
            console.log('跳转到专项练习页面成功');
          },
          fail: (error) => {
            console.error('跳转到专项练习页面失败:', error);
            wx.showToast({
              title: '跳转失败',
              icon: 'none'
            });
          }
        });
        
      } else {
        console.error('获取专项练习失败:', result.message);
        wx.showToast({
          title: result.message || '获取题目失败',
          icon: 'none'
        });
      }
      
    } catch (error) {
      console.error('专项练习失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    }
  },

  // 查看学习详情
  viewLearningDetail(e) {
    const dayIndex = e.currentTarget.dataset.day;
    const dayPlan = this.data.sevenDayPlan[dayIndex];
    
    wx.showModal({
      title: `第${dayIndex + 1}天学习计划`,
      content: `学习重点：${dayPlan.content}\n\n目标：${dayPlan.target}\n\n建议：根据薄弱点进行专项练习，逐步提升能力水平`,
      showCancel: true,
      cancelText: '取消',
      confirmText: '开始练习',
      success: (res) => {
        if (res.confirm) {
          // 触发开始练习
          this.startSpecialPractice(e);
        }
      }
    });
  },

  // 刷新学习路径
  async refreshPlan() {
    console.log('刷新7天学习路径');
    await this.getSevenDayPlan();
  },

  // 查看整体学习建议
  viewOverallSuggestion() {
    const weakPoints = this.data.weakPoints;
    const targetAccuracy = this.data.targetAccuracy;
    
    const weakPointNames = weakPoints.map(point => point.name).join('、');
    
    wx.showModal({
      title: '学习建议',
      content: `目标正确率：${targetAccuracy}%\n\n主要薄弱点：${weakPointNames}\n\n建议：\n1. 按7天计划循序渐进\n2. 重点攻克薄弱语法点\n3. 定期检测学习效果\n4. 保持持续练习习惯`,
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});
