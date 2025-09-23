// 云开发环境列表配置
// 如果需要使用云开发，请在下方配置环境ID
// 如果不使用云开发，可以留空，应用将使用本地数据

const envList = [
  // 示例环境配置（请根据实际情况修改）
  // { envId: 'your-env-id', envName: '生产环境' },
  // { envId: 'your-dev-env-id', envName: '开发环境' }
];

const isMac = false;

// 导出时确保 envList 不为空，提供一个默认配置
module.exports = {
  envList: envList.length > 0 ? envList : [{ envId: null, envName: '本地模式' }],
  isMac
};
