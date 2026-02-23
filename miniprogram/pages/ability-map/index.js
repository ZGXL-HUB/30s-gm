// 能力图谱页面 - 小程序版本
// 对应Vue页面 /pages/ability-test/ability-map.vue

const recommendationApi = require('../../api/recommendationApi');

Page({
  data: {
    userId: 'user_12345',
    weakPoints: [],
    loading: false
  },

  // 阻止事件冒泡
  stopPropagation(e) {
    // 空函数，仅用于阻止事件冒泡
  },

  onLoad(options) {
    console.log('能力图谱页面加载');
    
    if (options.userId) {
      this.setData({ userId: options.userId });
    }
    
    this.loadWeakPoints();
  },

  onShow() {
    console.log('能力图谱页面显示');
  },

  // 加载薄弱点数据
  async loadWeakPoints() {
    try {
      this.setData({ loading: true });
      
      console.log('加载薄弱点数据');
      
      // 模拟薄弱点数据
      const mockWeakPoints = [
        { id: 1, name: '定语从句', accuracy: 65 },
        { id: 2, name: '非谓语动词', accuracy: 58 },
        { id: 3, name: '状语从句', accuracy: 72 },
        { id: 4, name: '虚拟语气', accuracy: 45 },
        { id: 5, name: '被动语态', accuracy: 68 }
      ];
      
      this.setData({ 
        weakPoints: mockWeakPoints,
        loading: false 
      });
      
      console.log(`加载完成，共${mockWeakPoints.length}个薄弱点`);
      
    } catch (error) {
      console.error('加载薄弱点失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 立即练5题（突破冷却的专项练习）
  async gotoPractice(e) {
    const pointName = e.currentTarget.dataset.name;
    
    try {
      console.log(`开始${pointName}专项练习`);
      
      wx.showLoading({
        title: '生成专项题目...'
      });
      
      // 调用突破冷却的练习接口（白名单：忽略48h冷却）
      const result = await recommendationApi.getPracticeByWeakPoint(
        this.data.userId,
        pointName,
        5,  // 固定5题
        true  // is_whitelist：突破冷却
      );
      
      wx.hideLoading();
      
      if (result.code === 200) {
        const questions = result.data.questions;
        console.log(`获取到${questions.length}道${pointName}专项题目`);
        
        // 跳转至专项练习页面
        wx.navigateTo({
          url: `/pages/practice/special/index?questions=${encodeURIComponent(JSON.stringify(questions))}&pointName=${encodeURIComponent(pointName)}`,
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

  // 刷新薄弱点数据
  async refreshWeakPoints() {
    console.log('刷新薄弱点数据');
    await this.loadWeakPoints();
  },

  // 查看薄弱点详情
  viewWeakPointDetail(e) {
    const pointName = e.currentTarget.dataset.name;
    const accuracy = e.currentTarget.dataset.accuracy;
    
    wx.showModal({
      title: pointName,
      content: `当前正确率：${accuracy}%\n\n建议：\n1. 重点练习相关题目\n2. 查看详细解析\n3. 进行专项训练`,
      showCancel: true,
      cancelText: '取消',
      confirmText: '立即练习',
      success: (res) => {
        if (res.confirm) {
          // 触发立即练习
          const event = {
            currentTarget: {
              dataset: { name: pointName }
            }
          };
          this.gotoPractice(event);
        }
      }
    });
  },

  // 查看整体能力分析
  viewOverallAnalysis() {
    const weakPoints = this.data.weakPoints;
    const totalAccuracy = weakPoints.reduce((sum, point) => sum + point.accuracy, 0) / weakPoints.length;
    const weakCount = weakPoints.filter(point => point.accuracy < 60).length;
    
    wx.showModal({
      title: '整体能力分析',
      content: `平均正确率：${totalAccuracy.toFixed(1)}%\n薄弱点数量：${weakCount}个\n\n建议：\n1. 重点攻克薄弱点\n2. 制定专项练习计划\n3. 定期检测进步情况`,
      showCancel: false,
      confirmText: '我知道了'
    });
  }
});
