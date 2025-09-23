Page({
  data: {
    cards: [],
    currentIndex: 0,
    isFlipped: false,
    totalCards: 0
  },

  onLoad(options) {
    this.loadCards();
  },

  // 加载卡片数据
  loadCards() {
    try {
      const voiceData = require('../../data/writing_voices.js');
      this.setData({
        cards: voiceData.voice_flip_cards,
        totalCards: voiceData.voice_flip_cards.length
      });
    } catch (e) {
      console.error("语态翻转卡片数据加载失败:", e);
    }
  },

  // 翻转卡片
  flipCard() {
    this.setData({
      isFlipped: !this.data.isFlipped
    });
  },

  // 上一张卡片
  prevCard() {
    const newIndex = this.data.currentIndex > 0 ? this.data.currentIndex - 1 : this.data.totalCards - 1;
    this.setData({
      currentIndex: newIndex,
      isFlipped: false // 切换卡片时重置为正面
    });
  },

  // 下一张卡片
  nextCard() {
    const newIndex = this.data.currentIndex < this.data.totalCards - 1 ? this.data.currentIndex + 1 : 0;
    this.setData({
      currentIndex: newIndex,
      isFlipped: false // 切换卡片时重置为正面
    });
  }
}); 