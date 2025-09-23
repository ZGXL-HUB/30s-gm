// 每日任务卡片组件 - 小程序版本
// 对应Vue组件 /components/home/DailyTaskCard.vue

const recommendationApi = require('../api/recommendationApi');

Component({
  properties: {
    // 用户ID
    userId: {
      type: String,
      value: ''
    },
    // 连续学习天数
    continueStudyDays: {
      type: Number,
      value: 0
    }
  },

  data: {
    selectedTab: '语法',
    defaultTabIndex: 0,
    questionCount: 0,
    estimatedTime: 0,
    currentQuestionList: [],
    loading: false,
    // 近7天活跃占比
    recentActivityRatio: {
      grammarRatio: 50,
      writingRatio: 50
    }
  },

  lifetimes: {
    attached() {
      console.log('每日任务卡片组件初始化');
      this.initComponent();
    }
  },

  methods: {
    // 初始化组件
    async initComponent() {
      try {
        // 1. 按近7天活跃占比定默认标签（>60%则默认对应标签）
        await this.getRecent7DayActiveRatio();
        
        // 2. 初始化默认标签题单
        await this.getQuestionList(this.data.selectedTab);
        
      } catch (error) {
        console.error('初始化每日任务卡片失败:', error);
        this.showError('初始化失败');
      }
    },

    // 获取近7天活跃占比
    async getRecent7DayActiveRatio() {
      try {
        console.log('获取用户近7天活跃占比');
        
        const result = await recommendationApi.getUserActiveRatio(this.properties.userId);
        
        if (result.code === 200) {
          const { grammarRatio, writingRatio } = result.data;
          
          this.setData({
            recentActivityRatio: { grammarRatio, writingRatio },
            defaultTabIndex: grammarRatio > 60 ? 0 : 1,
            selectedTab: grammarRatio > 60 ? '语法' : '书写'
          });
          
          console.log(`活跃占比 - 语法:${grammarRatio}%, 书写:${writingRatio}%, 默认标签:${this.data.selectedTab}`);
        } else {
          console.error('获取活跃占比失败:', result.message);
        }
        
      } catch (error) {
        console.error('获取近7天活跃占比失败:', error);
      }
    },

    // 获取题目列表
    async getQuestionList(tabType) {
      try {
        this.setData({ loading: true });
        
        console.log(`获取${tabType}题目列表`);
        
        const questionCount = this.getQuestionCountByDay();
        
        const result = await recommendationApi.getNoDuplicateQuestions(
          this.properties.userId,
          "daily_recommend",
          tabType,
          questionCount
        );
        
        if (result.code === 200) {
          const questions = result.data.questions || [];
          
          this.setData({
            currentQuestionList: questions,
            questionCount: questions.length,
            loading: false
          });
          
          // 计算预计时间：语法题1题0.7分钟，书写题1题1.5分钟
          const estimatedTime = Math.ceil(
            tabType === '语法' ? questions.length * 0.7 : questions.length * 1.5
          );
          
          this.setData({ estimatedTime });
          
          console.log(`${tabType}题目获取成功: ${questions.length}道题，预计${estimatedTime}分钟`);
          
          // 触发题目更新事件
          this.triggerEvent('questionsUpdated', {
            tabType,
            questions,
            questionCount: questions.length,
            estimatedTime
          });
          
        } else {
          console.error('获取题目失败:', result.message);
          this.showError(`获取${tabType}题目失败`);
          this.setData({ loading: false });
        }
        
      } catch (error) {
        console.error(`获取${tabType}题目列表失败:`, error);
        this.showError('网络错误');
        this.setData({ loading: false });
      }
    },

    // 处理标签切换
    async handleTabChange(e) {
      const index = e.detail.index;
      const selectedTab = index === 0 ? '语法' : '书写';
      
      console.log(`切换到${selectedTab}标签`);
      
      this.setData({ selectedTab });
      
      // 切换时重新拉取去重题
      await this.getQuestionList(selectedTab);
    },

    // 按连续学习天数定题量
    getQuestionCountByDay() {
      const continueDays = this.properties.continueStudyDays || 0;
      
      if (continueDays < 3) {
        return 8;
      } else if (continueDays > 7) {
        return 15;
      } else {
        return 10;
      }
    },

    // 显示错误提示
    showError(message) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      });
    },

    // 刷新题目列表
    async refreshQuestions() {
      console.log('刷新题目列表');
      await this.getQuestionList(this.data.selectedTab);
    },

    // 开始练习
    startPractice() {
      if (this.data.currentQuestionList.length === 0) {
        this.showError('暂无题目');
        return;
      }
      
      console.log(`开始${this.data.selectedTab}练习`);
      
      // 触发开始练习事件
      this.triggerEvent('startPractice', {
        tabType: this.data.selectedTab,
        questions: this.data.currentQuestionList,
        questionCount: this.data.questionCount,
        estimatedTime: this.data.estimatedTime
      });
    },

    // 获取组件数据（供外部调用）
    getComponentData() {
      return {
        selectedTab: this.data.selectedTab,
        questionCount: this.data.questionCount,
        estimatedTime: this.data.estimatedTime,
        currentQuestionList: this.data.currentQuestionList,
        recentActivityRatio: this.data.recentActivityRatio
      };
    }
  }
});
