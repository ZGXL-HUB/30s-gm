// 隐藏语法点配置文件
// 在这里添加不想让用户看到的语法点

const hiddenPoints = [
  // 隐藏"综合练习"大类，因为其功能与"系统组合"和"专属组合"重复
  "综合练习",
  
  // 示例：隐藏某些语法点
  // "时态(过去将来时)",
  // "语态(被动+八大时态)", 
  // "插入语与动词",
  // "f/fe结尾",
  // "连词与形容词"
];

// 隐藏语法点的原因说明（可选）
const hiddenPointsReason = {
  "综合练习": "该功能已整合到系统组合和专属组合中，不再单独显示",
  // "时态(过去将来时)": "该语法点暂时下架维护",
  // "语态(被动+八大时态)": "内容正在更新中",
  // "插入语与动词": "题目数量不足，暂时隐藏"
};

module.exports = {
  hiddenPoints,
  hiddenPointsReason,
  
  // 检查语法点是否被隐藏
  isHidden: function(pointName) {
    return hiddenPoints.includes(pointName);
  },
  
  // 获取隐藏原因
  getHiddenReason: function(pointName) {
    return hiddenPointsReason[pointName] || "该语法点暂时不可用";
  },
  
  // 获取所有隐藏的语法点
  getAllHidden: function() {
    return hiddenPoints;
  }
};
