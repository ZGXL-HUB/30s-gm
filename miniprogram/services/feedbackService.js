/**
 * 反馈相关API服务
 */
const CloudApi = require('./cloudApi.js');

class FeedbackService {
  /**
   * 提交反馈
   * @param {Object} feedbackData 反馈数据
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async submitFeedback(feedbackData, options = {}) {
    const result = await CloudApi.callFunction('feedbackManager', {
      action: 'submitFeedback',
      data: feedbackData
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '提交中...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 获取反馈列表
   * @param {Object} params 查询参数
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async getFeedbackList(params = {}, options = {}) {
    const result = await CloudApi.callFunction('feedbackManager', {
      action: 'getFeedbackList',
      data: params
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '加载反馈列表...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 获取反馈详情
   * @param {string} feedbackId 反馈ID
   * @param {Object} options 可选配置
   * @returns {Promise<Object>}
   */
  static async getFeedbackDetail(feedbackId, options = {}) {
    const result = await CloudApi.callFunction('feedbackManager', {
      action: 'detail',
      feedbackId: feedbackId
    }, {
      showLoading: options.showLoading !== false,
      loadingText: '加载详情...',
      showError: options.showError !== false
    });

    return result;
  }

  /**
   * 同步本地存储的反馈到云端
   * @param {Object} options 可选配置
   * @returns {Promise<Object>} 同步结果
   */
  static async syncLocalFeedbacksToCloud(options = {}) {
    try {
      // 获取本地存储的反馈
      const localFeedbacks = wx.getStorageSync('local_feedbacks') || [];
      
      // 过滤出未同步的反馈（source为local_storage且没有synced标记）
      const unsyncedFeedbacks = localFeedbacks.filter(fb => 
        fb.source === 'local_storage' && !fb.synced
      );

      if (unsyncedFeedbacks.length === 0) {
        return {
          success: true,
          syncedCount: 0,
          message: '没有需要同步的反馈'
        };
      }

      console.log(`开始同步 ${unsyncedFeedbacks.length} 条本地反馈到云端...`);

      const syncedIds = [];
      const failedIds = [];

      // 逐个同步反馈
      for (const feedback of unsyncedFeedbacks) {
        try {
          // 准备反馈数据（移除本地存储特有的字段）
          const feedbackData = {
            feedbackId: feedback.feedbackId,
            type: feedback.type || 'general',
            title: feedback.title || '功能反馈',
            content: feedback.content,
            existingIssues: feedback.existingIssues || '',
            unmetNeeds: feedback.unmetNeeds || ''
          };

          // 提交到云端
          const result = await this.submitFeedback(feedbackData, {
            showLoading: false,
            showError: false
          });

          if (result.success) {
            syncedIds.push(feedback.feedbackId || feedback.id);
            console.log(`反馈 ${feedback.feedbackId} 同步成功`);
          } else {
            failedIds.push(feedback.feedbackId || feedback.id);
            console.error(`反馈 ${feedback.feedbackId} 同步失败:`, result.error || result.message);
          }
        } catch (error) {
          console.error(`同步反馈 ${feedback.feedbackId} 时出错:`, error);
          failedIds.push(feedback.feedbackId || feedback.id);
        }
      }

      // 更新本地存储，标记已同步的反馈
      if (syncedIds.length > 0) {
        const updatedFeedbacks = localFeedbacks.map(fb => {
          const id = fb.feedbackId || fb.id;
          if (syncedIds.includes(id)) {
            return {
              ...fb,
              synced: true,
              syncedTime: new Date().toISOString()
            };
          }
          return fb;
        });
        wx.setStorageSync('local_feedbacks', updatedFeedbacks);
      }

      return {
        success: true,
        syncedCount: syncedIds.length,
        failedCount: failedIds.length,
        syncedIds: syncedIds,
        failedIds: failedIds,
        message: `成功同步 ${syncedIds.length} 条反馈，失败 ${failedIds.length} 条`
      };
    } catch (error) {
      console.error('同步本地反馈失败:', error);
      return {
        success: false,
        error: error.message,
        message: '同步失败'
      };
    }
  }
}

module.exports = FeedbackService;


