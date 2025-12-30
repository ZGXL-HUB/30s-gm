/**
 * 分享图片生成工具
 */
class ShareImageGenerator {
  constructor() {
    this.canvasId = 'shareImageCanvas';
    this.canvasWidth = 375;
    this.canvasHeight = 500;
  }

  /**
   * 生成分享图片
   * @param {Object} options 配置选项
   * @param {string} options.inviteCode 邀请码
   * @param {string} options.className 班级名称
   * @param {string} options.expiryDate 有效期
   * @param {string} options.qrCodeUrl 小程序码URL（可选）
   * @returns {Promise<string>} 生成的图片临时路径
   */
  async generateShareImage(options) {
    const { inviteCode, className, expiryDate, qrCodeUrl } = options;
    
    return new Promise((resolve, reject) => {
      const ctx = wx.createCanvasContext(this.canvasId);
      
      // 设置背景
      this.drawBackground(ctx);
      
      // 绘制标题
      this.drawTitle(ctx, '班级邀请码');
      
      // 绘制邀请码
      this.drawInviteCode(ctx, inviteCode);
      
      // 绘制班级信息
      this.drawClassInfo(ctx, className, expiryDate);
      
      // 绘制二维码或占位符
      if (qrCodeUrl) {
        this.drawQRCode(ctx, qrCodeUrl);
      } else {
        this.drawQRCodePlaceholder(ctx);
      }
      
      // 绘制底部说明
      this.drawFooter(ctx);
      
      // 完成绘制
      ctx.draw(false, () => {
        // 导出图片
        wx.canvasToTempFilePath({
          canvasId: this.canvasId,
          success: (res) => {
            resolve(res.tempFilePath);
          },
          fail: (error) => {
            reject(error);
          }
        });
      });
    });
  }

  /**
   * 绘制背景
   */
  drawBackground(ctx) {
    // 白色背景
    ctx.setFillStyle('#FFFFFF');
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // 顶部装饰条
    ctx.setFillStyle('#4A90E2');
    ctx.fillRect(0, 0, this.canvasWidth, 8);
  }

  /**
   * 绘制标题
   */
  drawTitle(ctx, title) {
    ctx.setFillStyle('#333333');
    ctx.setFontSize(24);
    ctx.setTextAlign('center');
    ctx.fillText(title, this.canvasWidth / 2, 60);
  }

  /**
   * 绘制邀请码
   */
  drawInviteCode(ctx, inviteCode) {
    // 邀请码背景
    ctx.setFillStyle('#F5F5F5');
    ctx.fillRect(50, 100, this.canvasWidth - 100, 80);
    
    // 邀请码文字
    ctx.setFillStyle('#4A90E2');
    ctx.setFontSize(32);
    ctx.setTextAlign('center');
    ctx.fillText(inviteCode, this.canvasWidth / 2, 150);
  }

  /**
   * 绘制班级信息
   */
  drawClassInfo(ctx, className, expiryDate) {
    ctx.setFillStyle('#666666');
    ctx.setFontSize(16);
    ctx.setTextAlign('left');
    
    // 班级信息
    ctx.fillText(`班级: ${className}`, 50, 220);
    ctx.fillText(`有效期: ${expiryDate}`, 50, 250);
  }

  /**
   * 绘制二维码
   */
  drawQRCode(ctx, qrCodeUrl) {
    const qrSize = 120;
    const qrX = (this.canvasWidth - qrSize) / 2;
    const qrY = 300;
    
    // 绘制二维码
    ctx.drawImage(qrCodeUrl, qrX, qrY, qrSize, qrSize);
    
    // 二维码说明
    ctx.setFillStyle('#999999');
    ctx.setFontSize(14);
    ctx.setTextAlign('center');
    ctx.fillText('扫码加入班级', this.canvasWidth / 2, qrY + qrSize + 20);
  }

  /**
   * 绘制二维码占位符
   */
  drawQRCodePlaceholder(ctx) {
    const qrSize = 120;
    const qrX = (this.canvasWidth - qrSize) / 2;
    const qrY = 300;
    
    // 占位符背景
    ctx.setFillStyle('#F0F0F0');
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    
    // 占位符边框
    ctx.setStrokeStyle('#CCCCCC');
    ctx.setLineWidth(2);
    ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    
    // 占位符文字
    ctx.setFillStyle('#999999');
    ctx.setFontSize(14);
    ctx.setTextAlign('center');
    ctx.fillText('小程序码', this.canvasWidth / 2, qrY + qrSize / 2 - 5);
    ctx.fillText('(上线后显示)', this.canvasWidth / 2, qrY + qrSize / 2 + 15);
    
    // 说明文字
    ctx.setFontSize(12);
    ctx.fillText('请使用此邀请码加入班级', this.canvasWidth / 2, qrY + qrSize + 20);
  }

  /**
   * 绘制底部说明
   */
  drawFooter(ctx) {
    ctx.setFillStyle('#999999');
    ctx.setFontSize(12);
    ctx.setTextAlign('center');
    ctx.fillText('请使用此邀请码加入班级', this.canvasWidth / 2, 480);
  }
}

module.exports = ShareImageGenerator;
