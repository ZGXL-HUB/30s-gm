/**
 * 小程序音效工具：点击音效、Toast/正确率界面音效
 * 音频文件需放在 miniprogram/sounds/ 下：tap.mp3（点击）、toast.mp3（提示/结果）
 */

const TAP_SRC = '/sounds/tap.mp3';
const TOAST_SRC = '/sounds/toast.mp3';

function play(src) {
  if (!src) return;
  try {
    const ctx = wx.createInnerAudioContext();
    ctx.obeyMuteSwitch = false; // 跟随系统静音开关，设为 false 则静音时也播放（可按需改为 true）
    ctx.src = src;
    ctx.onError((err) => {
      // 文件不存在或播放失败时静默忽略
      ctx.destroy();
    });
    ctx.onEnded(() => {
      ctx.destroy();
    });
    ctx.play();
  } catch (e) {
    // 忽略
  }
}

/** 播放点击选项/按钮的音效 */
function playTap() {
  play(TAP_SRC);
}

/** 播放 Toast/正确率等提示音效 */
function playToast() {
  play(TOAST_SRC);
}

module.exports = {
  playTap,
  playToast,
  play
};
