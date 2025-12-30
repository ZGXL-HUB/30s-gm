// 快速检查命名系统
console.log('=== 快速命名检查 ===\n');

// 最近发布的作业中使用的语法点
const recentPoints = [
  "固定搭配",
  "代词综合", 
  "从属连词综合",
  "泛指与特指",
  "不规则复数",
  "主从句与动词",
  "时态(过去完成时)",
  "现在分词综合",
  "形容词综合",
  "副词修饰句子"
];

console.log('📋 检查这10个语法点在云数据库中的情况:\n');

const checkResults = {};

// 查询每个语法点
const checkPoint = async (point) => {
  try {
    // 检查 category 字段
    const catResult = await wx.cloud.database()
      .collection('questions')
      .where({ category: point })
      .count();
    
    // 检查 grammarPoint 字段  
    const gpResult = await wx.cloud.database()
      .collection('questions')
      .where({ grammarPoint: point })
      .count();
    
    const total = catResult.total + gpResult.total;
    
    if (total > 0) {
      console.log(`✅ "${point}"`);
      console.log(`   category: ${catResult.total}题, grammarPoint: ${gpResult.total}题, 合计: ${total}题`);
      checkResults[point] = { status: '找到', category: catResult.total, grammarPoint: gpResult.total };
    } else {
      console.log(`❌ "${point}"`);
      console.log(`   在 category 和 grammarPoint 字段中都未找到`);
      checkResults[point] = { status: '未找到', category: 0, grammarPoint: 0 };
    }
    
  } catch (error) {
    console.log(`❌ "${point}" - 查询失败:`, error.message);
    checkResults[point] = { status: '查询失败', error: error.message };
  }
};

// 依次检查所有语法点
(async () => {
  for (const point of recentPoints) {
    await checkPoint(point);
  }
  
  console.log('\n📊 检查结果汇总:');
  const found = Object.values(checkResults).filter(r => r.status === '找到').length;
  const notFound = Object.values(checkResults).filter(r => r.status === '未找到').length;
  
  console.log(`   ✅ 找到: ${found}/${recentPoints.length}`);
  console.log(`   ❌ 未找到: ${notFound}/${recentPoints.length}`);
  
  if (notFound > 0) {
    console.log('\n❌ 未找到的语法点需要处理:');
    Object.keys(checkResults).forEach(point => {
      if (checkResults[point].status === '未找到') {
        console.log(`   - "${point}"`);
      }
    });
    
    console.log('\n💡 建议: 运行 comprehensive_naming_analysis.js 进行深入分析');
  }
  
  console.log('\n=== 检查完成 ===');
})();

