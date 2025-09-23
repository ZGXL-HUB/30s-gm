// 环境配置文件
// 请将敏感信息移到云开发环境变量中，不要直接硬编码

const config = {
  // 云开发环境ID - 请替换为您的实际环境ID
  cloudEnvId: 'cloud1-4gyu3i1id5f4e2fa', // 替换为您的环境ID
  
  // 管理员OpenID列表 - 建议使用云函数动态获取
  adminOpenIds: [
    // 请将管理员OpenID添加到此处，或通过云函数动态管理
  ],
  
  // 是否启用调试模式
  debug: false,
  
  // 是否启用详细日志
  verboseLogging: false
};

module.exports = config;
