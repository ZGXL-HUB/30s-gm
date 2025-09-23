// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('云函数开始执行，接收到的参数:', event);
  
  const wxContext = cloud.getWXContext()
  console.log('获取到的微信上下文:', wxContext);
  
  const result = {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
  
  console.log('准备返回的结果:', result);
  
  return result;
}