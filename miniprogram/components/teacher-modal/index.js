// 教师端通用弹窗组件
Component({
  properties: {
    // 是否显示弹窗
    show: {
      type: Boolean,
      value: false
    },
    // 弹窗标题
    title: {
      type: String,
      value: ''
    },
    // 弹窗内容
    content: {
      type: String,
      value: ''
    },
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      value: true
    },
    // 是否显示遮罩层
    showMask: {
      type: Boolean,
      value: true
    },
    // 弹窗宽度
    width: {
      type: String,
      value: '90%'
    },
    // 弹窗高度
    height: {
      type: String,
      value: 'auto'
    },
    // 是否可点击遮罩关闭
    maskClosable: {
      type: Boolean,
      value: true
    }
  },

  data: {
    // 组件内部数据
  },

  methods: {
    // 关闭弹窗
    onClose() {
      this.triggerEvent('close');
    },

    // 点击遮罩层
    onMaskTap() {
      if (this.data.maskClosable) {
        this.onClose();
      }
    },

    // 阻止事件冒泡
    onContentTap(e) {
      e.stopPropagation();
    }
  }
});
