// pages/grammar-test-sets/index.js
Page({
  data: {
    testSets: [],
    loading: true,
    showTypeSelection: true, // 新增：显示类型选择界面
    selectedTestType: '' // 新增：选中的测试类型
  },

  onLoad: function (options) {
    this.loadTestSets();
  },

  loadTestSets: function () {
    const that = this;
    wx.request({
      url: 'https://your-api-endpoint/grammar_test_sets.json', // 这里需要替换为实际的数据源
      success: function (res) {
        that.setData({
          testSets: res.data.sets || [],
          loading: false
        });
      },
      fail: function () {
        // 如果API不可用，使用本地数据
        that.loadLocalTestSets();
      }
    });
  },

  loadLocalTestSets: function () {
    // 从本地文件加载测试套题
    const testSets = [
      {
        id: 1,
        name: "第一套语法测试",
        description: "名词后缀识别、代词、现在分词、时态、语态练习",
        questionCount: 5
      },
      {
        id: 2,
        name: "第二套语法测试", 
        description: "名词后缀识别、代词、现在分词、时态、语态练习",
        questionCount: 5
      },
      {
        id: 3,
        name: "第三套语法测试",
        description: "名词后缀识别、代词、现在分词、时态、语态练习", 
        questionCount: 5
      },
      {
        id: 4,
        name: "第四套语法测试",
        description: "名词后缀识别、代词、现在分词、时态、语态练习",
        questionCount: 5
      },
      {
        id: 5,
        name: "第五套语法测试",
        description: "名词后缀识别、代词、现在分词、时态、语态练习",
        questionCount: 5
      },
      {
        id: 6,
        name: "第六套语法测试",
        description: "名词后缀识别、代词、过去分词、时态、语态练习",
        questionCount: 5
      },
      {
        id: 7,
        name: "第七套语法测试",
        description: "名词后缀识别、代词、过去分词、时态、语态练习",
        questionCount: 5
      },
      {
        id: 8,
        name: "第八套语法测试",
        description: "名词后缀识别、代词、过去分词、时态、语态练习",
        questionCount: 5
      },
      {
        id: 9,
        name: "第九套语法测试",
        description: "名词后缀识别、代词、过去分词、时态、语态练习",
        questionCount: 5
      },
      {
        id: 10,
        name: "第十套语法测试",
        description: "名词后缀识别、代词、过去分词、时态、语态练习",
        questionCount: 5
      },
      {
        id: 11,
        name: "第十一套语法测试",
        description: "规则变复数、语态填表练习（各种时态）",
        questionCount: 5
      },
      {
        id: 12,
        name: "第十二套语法测试",
        description: "规则变复数、语态填表练习（各种时态）",
        questionCount: 5
      },
      {
        id: 13,
        name: "第十三套语法测试",
        description: "规则变复数、语态填表练习（各种时态）",
        questionCount: 5
      },
      {
        id: 14,
        name: "第十四套语法测试",
        description: "规则变复数、语态填表练习（各种时态）",
        questionCount: 5
      },
      {
        id: 15,
        name: "第十五套语法测试",
        description: "规则变复数、语态填表练习（各种时态）",
        questionCount: 5
      },
      {
        id: 16,
        name: "第十六套语法测试",
        description: "形容词前后缀识别、比较级最高级、语态填表练习",
        questionCount: 5
      },
      {
        id: 17,
        name: "第十七套语法测试",
        description: "形容词前后缀识别、比较级最高级、语态填表练习",
        questionCount: 5
      },
      {
        id: 18,
        name: "第十八套语法测试",
        description: "形容词前后缀识别、比较级最高级、语态填表练习",
        questionCount: 5
      },
      {
        id: 19,
        name: "第十九套语法测试",
        description: "形容词前后缀识别、比较级最高级、语态填表练习",
        questionCount: 5
      },
      {
        id: 20,
        name: "第二十套语法测试",
        description: "形容词前后缀识别、比较级最高级、语态填表练习",
        questionCount: 5
      }
    ];

    this.setData({
      testSets: testSets,
      loading: false
    });
  },

  // 新增：选择测试类型
  selectTestType: function(e) {
    const testType = e.currentTarget.dataset.type;
    this.setData({
      selectedTestType: testType,
      showTypeSelection: false
    });
  },

  // 新增：返回类型选择
  backToTypeSelection: function() {
    this.setData({
      showTypeSelection: true,
      selectedTestType: ''
    });
  },

  onTestSetTap: function (e) {
    const setId = e.currentTarget.dataset.id;
    const setName = e.currentTarget.dataset.name;
    
    // 根据选择的测试类型跳转到不同的页面
    if (this.data.selectedTestType === 'choice') {
      // 选择题格式
      wx.navigateTo({
        url: `/pages/grammar-test/grammar-test?setId=${setId}&setName=${encodeURIComponent(setName)}`
      });
    } else {
      // 填空题格式
      wx.navigateTo({
        url: `/pages/grammar-test-sets/test?setId=${setId}&setName=${encodeURIComponent(setName)}`
      });
    }
  },

  onShareAppMessage: function () {
    return {
      title: '语法测试套题',
      path: '/pages/grammar-test-sets/index'
    };
  }
});
