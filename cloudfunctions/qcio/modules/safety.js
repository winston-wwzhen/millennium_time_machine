// cloudfunctions/qcio/modules/safety.js
// 内容安全检测模块
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
    // 策略：如果校验接口出错，放行内容（fail-open）
    // 只在真正检测到敏感词时才拦截，避免接口问题影响用户体验
    return { safe: true };
  }
};

module.exports = { checkContentSafety };
