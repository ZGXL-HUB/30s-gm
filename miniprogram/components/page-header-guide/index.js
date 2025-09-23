Component({
  properties: {
    title: {
      type: String,
      value: '页面标题'
    },
    description: {
      type: String,
      value: '页面功能描述'
    },
    tip: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: '📚'
    },
    showClose: {
      type: Boolean,
      value: true
    },
    storageKey: {
      type: String,
      value: ''
    }
  },

  data: {
    showGuide: true
  },

  lifetimes: {
    attached() {
      this.checkGuideStatus();
    }
  },

  methods: {
    checkGuideStatus() {
      if (this.properties.storageKey) {
        const hasShown = wx.getStorageSync(this.properties.storageKey);
        if (hasShown) {
          this.setData({ showGuide: false });
        }
      }
    },

    hideGuide() {
      this.setData({ showGuide: false });
      
      if (this.properties.storageKey) {
        wx.setStorageSync(this.properties.storageKey, true);
      }
      
      this.triggerEvent('guideClosed');
    },

    showGuide() {
      this.setData({ showGuide: true });
    }
  }
});
