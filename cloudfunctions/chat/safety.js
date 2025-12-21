// cloudfunctions/chat/safety.js
// 接收 cloud 实例作为参数，避免重复初始化
const checkContentSafety = async (cloud, content) => {
  if (!content) return { safe: true };
  
  try {
    const result = await cloud.openapi.security.msgSecCheck({
      content: content
    });
    // errCode = 0 代表通过
    return { safe: result.errCode === 0 };
  } catch (err) {
    console.error("安全校验异常:", err);
    // 策略：如果校验接口挂了，为了安全起见，通常视为不通过
    // 或者你可以根据 errCode 判断，如果是频率限制则放行
    return { safe: false };
  }
};

module.exports = { checkContentSafety };