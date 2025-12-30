// 教师端通用卡片组件
Component({
  properties: {
    // 卡片标题
    title: {
      type: String,
      value: ''
    },
    // 卡片副标题
    subtitle: {
      type: String,
      value: ''
    },
    // 卡片图标
    icon: {
      type: String,
      value: ''
    },
    // 卡片颜色
    color: {
      type: String,
      value: '#667eea'
    },
    // 是否显示箭头
    showArrow: {
      type: Boolean,
      value: true
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      value: true
    },
    // 自定义样式
    customStyle: {
      type: String,
      value: ''
    }
  },

  data: {
    // 组件内部数据
  },

  methods: {
    // 卡片点击事件
    onCardTap() {
      if (this.data.clickable) {
        this.triggerEvent('tap', {
          title: this.data.title,
          subtitle: this.data.subtitle
        });
      }
    }
  }
});
